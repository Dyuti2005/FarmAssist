import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_farmchain2026';

function signWebhook(payloadObj) {
    const rawBody = JSON.stringify(payloadObj);
    const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
    return { rawBody, signature };
}

async function runTests() {
    console.log("Starting Phase 9C Validation Tests (Webhooks)...\n");

    try {
        const randId = Math.floor(Math.random() * 10000);

        const farmer = await prisma.user.create({ data: { name: "9C Farmer", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" } });
        const buyerA = await prisma.user.create({ data: { name: "9C Buyer A", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" } });

        const product = await prisma.product.create({
            data: { farmer: { connect: { id: farmer.id } }, productName: "9C Wheat", quantity: 100, price: 500, unit: "kg", status: "AVAILABLE" }
        });

        const bAToken = jwt.sign({ userId: buyerA.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // Setup an order for Buyer A
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: product.id, quantity: 1, priceAtAdd: 500, subtotal: 500 } });
        const orderResA = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        const orderData = await orderResA.json();
        const orderIdA = orderData.order.id;

        let pass = true;

        // Create Payment intent
        const payRes1 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}/create`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}`, 'Content-Type': 'application/json' }
        });
        const pay1 = await payRes1.json();
        const paymentDb = await prisma.payment.findUnique({ where: { id: pay1.payment.id } });
        const rzpOrderId = paymentDb.razorpayOrderId;

        // Test 3: Invalid webhook signature -> rejected
        console.log("--- Test 3: Invalid Webhook Signature Rejection ---");
        const invalidPayload = { event: 'payment.captured' };
        const invalidRes = await fetch(`http://localhost:5002/api/webhooks/razorpay`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': 'malicious_signature', 'x-razorpay-event-id': 'ev_123' },
            body: JSON.stringify(invalidPayload)
        });
        console.log("Rejected invalid signature (400)?", invalidRes.status === 400);
        if (invalidRes.status !== 400) pass = false;

        // Test 1: Valid signed payment.captured webhook -> PAID
        console.log("\n--- Test 1: Valid payment.captured Webhook ---");
        const capEventId = `ev_cap_${randId}`;
        const capPayload = {
            event: 'payment.captured',
            payload: {
                payment: {
                    entity: {
                        id: `pay_valid_${randId}`,
                        order_id: rzpOrderId
                    }
                }
            }
        };
        const capSigned = signWebhook(capPayload);
        const capRes = await fetch(`http://localhost:5002/api/webhooks/razorpay`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': capSigned.signature, 'x-razorpay-event-id': capEventId },
            body: capSigned.rawBody
        });

        const checkPAID = await prisma.payment.findUnique({ where: { id: paymentDb.id } });
        console.log("Successfully processed webhook (200)?", capRes.status === 200);
        console.log("Payment status mutated to PAID?", checkPAID.status === 'PAID');
        if (capRes.status !== 200 || checkPAID.status !== 'PAID') pass = false;

        // Test 4 & 5: Duplicate webhook event & Inventory remains strictly intact
        console.log("\n--- Test 4 & 5: Duplicate Idempotency Validation ---");
        const dupRes = await fetch(`http://localhost:5002/api/webhooks/razorpay`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': capSigned.signature, 'x-razorpay-event-id': capEventId },
            body: capSigned.rawBody
        });
        const prodCheck = await prisma.product.findUnique({ where: { id: product.id } });
        console.log("Acknowledges idempotently (200)?", dupRes.status === 200);
        console.log("Inventory untouched/not re-decremented? (100 -> 99)", prodCheck.quantity === 99);
        if (dupRes.status !== 200 || prodCheck.quantity !== 99) pass = false;

        // Test 8: Already PAID cannot be downgraded to FAILED by delayed webhook
        console.log("\n--- Test 8: Prevent Delayed Downgrading ---");
        const failEventId = `ev_fail_${randId}`;
        const failPayload = {
            event: 'payment.failed',
            payload: { payment: { entity: { id: `pay_fail_${randId}`, order_id: rzpOrderId } } }
        };
        const failSigned = signWebhook(failPayload);
        await fetch(`http://localhost:5002/api/webhooks/razorpay`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': failSigned.signature, 'x-razorpay-event-id': failEventId },
            body: failSigned.rawBody
        });
        const finalPCheck = await prisma.payment.findUnique({ where: { id: paymentDb.id } });
        console.log("Payment securely retains PAID state refusing downgrade?", finalPCheck.status === 'PAID');
        if (finalPCheck.status !== 'PAID') pass = false;

        // Test 2: Valid signed payment.failed webhook
        console.log("\n--- Test 2: Valid payment.failed Webhook isolated ---");
        const payRes2 = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } }); // Will be empty cart, let's bypass by creating order natively
        const order2 = await prisma.order.create({ data: { buyerId: buyerA.id, totalAmount: 100, status: 'PENDING' } });
        const p2 = await prisma.payment.create({ data: { orderId: order2.id, amount: 100, status: 'PENDING', razorpayOrderId: `rzp_test_fail_${randId}` } });

        const realFailEventId = `ev_realfail_${randId}`;
        const realFailPayload = {
            event: 'payment.failed',
            payload: { payment: { entity: { id: `pay_fail_2_${randId}`, order_id: p2.razorpayOrderId } } }
        };
        const realFailSigned = signWebhook(realFailPayload);
        await fetch(`http://localhost:5002/api/webhooks/razorpay`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': realFailSigned.signature, 'x-razorpay-event-id': realFailEventId },
            body: realFailSigned.rawBody
        });
        const p2Check = await prisma.payment.findUnique({ where: { id: p2.id } });
        console.log("Payment successfully marked FAILED cleanly?", p2Check.status === 'FAILED');
        if (p2Check.status !== 'FAILED') pass = false;

        console.log("\n>>> ALL PHASE 9C TESTS PASSED:", pass);

        // CLEANUP
        await prisma.paymentWebhookEvent.deleteMany({ where: { eventId: { in: [capEventId, failEventId, realFailEventId] } } });
        await prisma.payment.deleteMany({ where: { id: { in: [paymentDb.id, p2.id] } } });
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({ where: { id: product.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmer.id, buyerA.id] } } });

    } catch (e) {
        console.error("Critical Failure:", e);
    } finally {
        await prisma.$disconnect();
    }
}
runTests();
