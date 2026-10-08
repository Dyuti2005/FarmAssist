const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = new PrismaClient();

let razorpay;
if (process.env.RAZORPAY_KEY_ID === 'rzp_test_farmchain2026' || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy') {
    razorpay = {
        orders: {
            create: async () => ({ id: 'order_dummy_rzp_' + Math.random().toString(36).substring(2) })
        }
    };
} else {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

// GET /api/payments/order/:orderId
exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const buyerId = req.user.userId;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.buyerId !== buyerId) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const payment = await prisma.payment.findFirst({ where: { orderId } });
        res.json({
            success: true,
            payment: payment ? {
                id: payment.id,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                razorpayOrderId: payment.razorpayOrderId
            } : null
        });
    } catch (e) {
        console.error("Fetch payment status error:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/payments/order/:orderId/create
exports.createPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const buyerId = req.user.userId;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.buyerId !== buyerId) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check active payments
        const existingActivePayment = await prisma.payment.findFirst({
            where: {
                orderId,
                status: { in: ['PENDING', 'PROCESSING', 'PAID'] }
            }
        });

        if (existingActivePayment) {
            if (existingActivePayment.status === 'PENDING' && existingActivePayment.razorpayOrderId) {
                // Safely return existing intent
                return res.status(200).json({
                    success: true,
                    message: "Existing payment intent retrieved",
                    payment: existingActivePayment,
                    key_id: process.env.RAZORPAY_KEY_ID
                });
            } else {
                return res.status(400).json({ success: false, message: 'An active payment already exists for this order.' });
            }
        }

        // 1. Create Razorpay Order in TEST mode
        const amountInPaise = Math.round(order.totalAmount * 100);

        const rzpResponse = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${order.id}`
        });

        if (!rzpResponse || !rzpResponse.id) {
            throw new Error("Failed to create Razorpay Order");
        }

        // 2. Create internal Payment record linked to Razorpay
        const newPayment = await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: order.totalAmount, // Real backend amount tracking
                currency: 'INR',
                status: 'PENDING',
                provider: 'RAZORPAY',
                razorpayOrderId: rzpResponse.id
            }
        });

        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment: newPayment,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (e) {
        console.error("Payment creation error:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const buyerId = req.user.userId;

        if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing required payment fields" });
        }

        const payment = await prisma.payment.findFirst({
            where: {
                orderId,
                razorpayOrderId: razorpay_order_id
            },
            include: { order: true }
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment tracking record not found or mismatched" });
        }

        if (payment.order.buyerId !== buyerId) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        if (payment.status === 'PAID') {
            return res.status(400).json({ success: false, message: "Payment is already marked as PAID" });
        }

        // Hash verification via official methodology
        const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_dummy';
        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' }
            });
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Transition securely!
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'PAID',
                transactionId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            }
        });

        res.json({ success: true, message: "Payment verified smoothly" });

    } catch (e) {
        console.error("Verification error:", e);
        res.status(500).json({ success: false, message: "Server error validating digital signature" });
    }
};

// POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("Critical: RAZORPAY_WEBHOOK_SECRET not configured.");
            return res.status(500).json({ success: false, message: "Server misconfiguration" });
        }

        const signature = req.headers['x-razorpay-signature'];
        if (!signature || !req.rawBody) {
            return res.status(400).json({ success: false, message: "Invalid payload or signature missing" });
        }

        const expectedSignature = crypto.createHmac('sha256', webhookSecret)
            .update(req.rawBody)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error("Webhook signature mismatch!");
            return res.status(400).json({ success: false, message: "Signature verification failed" });
        }

        const event = req.body;
        const razorpayEventId = req.headers['x-razorpay-event-id'];

        // Idempotency Check
        let existingEvent = await prisma.paymentWebhookEvent.findUnique({
            where: { eventId: razorpayEventId }
        });

        if (existingEvent) {
            return res.status(200).json({ success: true, message: "Event already processed" });
        }

        await prisma.paymentWebhookEvent.create({
            data: {
                eventId: razorpayEventId,
                eventType: event.event,
                status: 'PROCESSING'
            }
        });

        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const paymentEntity = event.payload.payment.entity;
            const rzpOrderId = paymentEntity.order_id;
            const rzpPaymentId = paymentEntity.id;

            const payment = await prisma.payment.findUnique({
                where: { razorpayOrderId: rzpOrderId }
            });

            if (payment && payment.status !== 'PAID') {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'PAID',
                        transactionId: rzpPaymentId
                    }
                });
            }
        } else if (event.event === 'payment.failed') {
            const paymentEntity = event.payload.payment.entity;
            const rzpOrderId = paymentEntity.order_id;

            const payment = await prisma.payment.findUnique({
                where: { razorpayOrderId: rzpOrderId }
            });

            if (payment && payment.status !== 'PAID') {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'FAILED',
                        transactionId: paymentEntity.id
                    }
                });
            }
        }

        await prisma.paymentWebhookEvent.update({
            where: { eventId: razorpayEventId },
            data: { status: 'PROCESSED' }
        });

        res.status(200).json({ success: true, message: "Webhook processed gracefully" });
    } catch (e) {
        console.error("Webhook handler error:", e);
        res.status(500).json({ success: false, message: "Error parsing webhook" });
    }
};
