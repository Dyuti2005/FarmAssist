const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const { storeCropPassportData } = require('../blockchain/polygonService');

// POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        const buyerId = req.user.userId;

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch CartItems
            const cartItems = await tx.cartItem.findMany({
                where: { buyerId },
                include: { product: { include: { crop: true } } }
            });

            if (cartItems.length === 0) {
                throw new Error('CART_EMPTY');
            }

            // 2. Validation & Totals
            let totalAmount = 0;
            const itemsToCreate = [];

            for (const item of cartItems) {
                const p = item.product;
                if (!p) {
                    throw new Error('PRODUCT_NOT_FOUND');
                }
                if (p.status !== 'AVAILABLE') {
                    throw new Error(`PRODUCT_UNAVAILABLE_${p.productName}`);
                }
                if (item.quantity > p.quantity) {
                    throw new Error(`INSUFFICIENT_STOCK_${p.productName}`);
                }

                // Subtotal
                const itemSubtotal = item.quantity * p.price;
                totalAmount += itemSubtotal;

                itemsToCreate.push({
                    productId: p.id,
                    productName: p.productName,
                    variety: p.crop?.variety || 'Standard',
                    quantity: item.quantity,
                    unit: p.unit,
                    priceAtOrder: p.price,
                    subtotal: itemSubtotal
                });

                // Decrement stock atomically
                const updatedProduct = await tx.product.updateMany({
                    where: {
                        id: p.id,
                        quantity: { gte: item.quantity },
                        status: 'AVAILABLE'
                    },
                    data: {
                        quantity: { decrement: item.quantity }
                    }
                });

                if (updatedProduct.count === 0) {
                    throw new Error(`INSUFFICIENT_STOCK_${p.productName}`);
                }

                // If reached zero, mark UNAVAILABLE
                const finalCheck = await tx.product.findUnique({ where: { id: p.id } });
                if (finalCheck.quantity === 0) {
                    await tx.product.update({ where: { id: p.id }, data: { status: 'UNAVAILABLE' } });
                }
            }

            // 3. Create Order
            const newOrder = await tx.order.create({
                data: {
                    buyer: { connect: { id: buyerId } },
                    totalAmount,
                    status: 'CONFIRMED',
                    items: {
                        create: itemsToCreate
                    }
                },
                include: { items: true }
            });

            // 4. Clear Cart
            await tx.cartItem.deleteMany({
                where: { buyerId }
            });

            return newOrder;
        }, { maxWait: 5000, timeout: 20000 });

        res.status(201).json({ success: true, order: result });

    } catch (e) {
        console.error("Failed to create order:", e.message);

        let msg = "Failed to place order.";
        if (e.message === 'CART_EMPTY') msg = "Cannot place an order with an empty cart.";
        if (e.message === 'PRODUCT_NOT_FOUND') msg = "One or more products no longer exist.";
        if (e.message.startsWith('PRODUCT_UNAVAILABLE_')) msg = `${e.message.split('PRODUCT_UNAVAILABLE_')[1]} is no longer available.`;
        if (e.message.startsWith('INSUFFICIENT_STOCK_')) msg = `Insufficient stock for ${e.message.split('INSUFFICIENT_STOCK_')[1]}.`;

        res.status(400).json({ success: false, message: msg });
    }
};

// GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { buyerId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        const formatted = orders.map(o => ({
            id: o.id,
            status: o.status,
            totalAmount: o.totalAmount,
            date: o.createdAt,
            itemCount: o.items.length,
            previewName: o.items.length > 0 ? o.items[0].productName : 'Items'
        }));

        res.json({ success: true, orders: formatted });
    } catch (e) {
        console.error("Failed to fetch orders:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const { id } = req.params;

        const order = await prisma.order.findFirst({
            where: { id, buyerId },
            include: { items: true }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (e) {
        console.error("Failed to fetch order details:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/orders/:orderId/blockchain-verify
exports.verifyOrderOnBlockchain = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } }, payments: true }
        });

        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Authorization Rule
        if (role === 'BUYER' && order.buyerId !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: Not your order" });
        }

        if (role === 'FARMER') {
            const hasMyProduct = order.items.some(item => item.product?.farmerId === userId);
            if (!hasMyProduct) {
                return res.status(403).json({ success: false, message: "Forbidden: Order does not contain your products" });
            }
        }

        if (order.blockchainStatus === 'VERIFIED') {
            return res.status(200).json({
                success: true,
                message: "Order already verified on blockchain",
                verification: {
                    network: order.blockchainNetwork,
                    transactionHash: order.blockchainTransactionHash,
                    dataHash: order.blockchainDataHash,
                    status: order.blockchainStatus,
                    verifiedAt: order.blockchainVerifiedAt
                }
            });
        }

        // SHA-256 Hash of Non-Sensitive Output Core
        const relevantData = {
            orderId: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
            itemCount: order.items.length,
            items: order.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            paymentStatus: order.payments.length > 0 ? order.payments[0].status : "NONE"
        };

        try {
            const blockResult = await storeCropPassportData(order.id, relevantData);

            const updated = await prisma.order.update({
                where: { id: order.id },
                data: {
                    blockchainStatus: "VERIFIED",
                    blockchainTransactionHash: blockResult.transactionHash,
                    blockchainNetwork: blockResult.network,
                    blockchainDataHash: blockResult.dataHash,
                    blockchainVerifiedAt: new Date()
                }
            });

            res.json({
                success: true,
                message: "Marketplace order verified flawlessly on Polygon!",
                verification: {
                    network: updated.blockchainNetwork,
                    transactionHash: updated.blockchainTransactionHash,
                    dataHash: updated.blockchainDataHash,
                    status: updated.blockchainStatus,
                    verifiedAt: updated.blockchainVerifiedAt
                }
            });
        } catch (e) {
            console.error(e);
            await prisma.order.update({
                where: { id: order.id },
                data: { blockchainStatus: "FAILED" }
            });
            throw new Error("Smart contract submission explicitly rejected");
        }
    } catch (e) {
        console.error("Failed to verify on blockchain:", e);
        res.status(500).json({ success: false, message: "Internal server error: " + e.message });
    }
};

// GET /api/orders/:orderId/blockchain-verification
exports.getBlockchainVerification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (role === 'BUYER' && order.buyerId !== userId) return res.status(403).json({ success: false, message: "Forbidden" });
        if (role === 'FARMER') {
            const hasMyProduct = order.items.some(item => item.product?.farmerId === userId);
            if (!hasMyProduct) return res.status(403).json({ success: false, message: "Forbidden" });
        }

        res.json({
            success: true,
            verification: {
                network: order.blockchainNetwork,
                transactionHash: order.blockchainTransactionHash,
                dataHash: order.blockchainDataHash,
                status: order.blockchainStatus,
                verifiedAt: order.blockchainVerifiedAt
            }
        });
    } catch (e) {
        console.error("Failed to fetch blockchain metadata:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
