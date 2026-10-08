const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/farmer/orders
exports.getFarmerOrders = async (req, res) => {
    try {
        const farmerId = req.user.userId;

        // Fetch OrderItems that belong to products owned by this farmer
        const items = await prisma.orderItem.findMany({
            where: {
                product: {
                    farmerId: farmerId
                }
            },
            include: {
                order: {
                    include: {
                        buyer: { select: { name: true, phone: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group items by Order ID so the farmer sees discrete orders
        const ordersMap = {};

        for (const item of items) {
            const o = item.order;
            if (!ordersMap[o.id]) {
                ordersMap[o.id] = {
                    id: o.id,
                    buyerName: o.buyer?.name || 'Verified Buyer',
                    date: o.createdAt,
                    totalValueForFarmer: 0,
                    status: item.status,
                    items: []
                };
            }

            ordersMap[o.id].totalValueForFarmer += item.subtotal;
            ordersMap[o.id].items.push({
                productName: item.productName,
                quantity: item.quantity,
                unit: item.unit
            });

            // Logic rule: Use lowest pending priority state if mixed in display (not strictly required if orderItem status is perfectly uniform, but in case they shift asynchronously)
            if (item.status === 'PENDING') ordersMap[o.id].status = 'PENDING';
        }

        const consolidated = Object.values(ordersMap).sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ success: true, orders: consolidated });
    } catch (e) {
        console.error("Failed to fetch farmer orders:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/farmer/orders/:id
exports.getFarmerOrderDetails = async (req, res) => {
    try {
        const farmerId = req.user.userId;
        const { id } = req.params;

        const items = await prisma.orderItem.findMany({
            where: {
                orderId: id,
                product: {
                    farmerId: farmerId
                }
            },
            include: {
                order: {
                    include: {
                        buyer: { select: { name: true, phone: true } }
                    }
                }
            }
        });

        if (items.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found or access denied." });
        }

        const o = items[0].order;

        const details = {
            id: o.id,
            buyerName: o.buyer?.name || 'Verified Buyer',
            buyerPhone: o.buyer?.phone || 'Hidden',
            date: o.createdAt,
            totalValueForFarmer: 0,
            status: items[0].status, // Uses first item status as representation
            items: []
        };

        for (const item of items) {
            details.totalValueForFarmer += item.subtotal;
            details.items.push({
                itemId: item.id,
                productName: item.productName,
                variety: item.variety,
                quantity: item.quantity,
                unit: item.unit,
                priceAtOrder: item.priceAtOrder,
                subtotal: item.subtotal,
                status: item.status
            });
        }

        res.json({ success: true, order: details });
    } catch (e) {
        console.error("Failed to fetch details:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PUT /api/farmer/orders/:id/status
exports.updateFarmerOrderStatus = async (req, res) => {
    try {
        const farmerId = req.user.userId;
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'CONFIRMED', 'DISPATCHED', 'COMPLETED', 'CANCELLED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        await prisma.$transaction(async (tx) => {
            const items = await tx.orderItem.findMany({
                where: { orderId: id, product: { farmerId: farmerId } }
            });

            if (items.length === 0) {
                throw new Error("NOT_FOUND");
            }

            for (const item of items) {
                if ((item.status === 'COMPLETED' || item.status === 'CANCELLED' || item.status === 'REJECTED') && status !== item.status) {
                    throw new Error(`INVALID_TRANSITION_${item.status}`);
                }

                // Restore stock if transitioning to CANCELLED/REJECTED
                const isNowCancelled = (status === 'CANCELLED' || status === 'REJECTED');
                const wasNotCancelled = (item.status !== 'CANCELLED' && item.status !== 'REJECTED');

                if (isNowCancelled && wasNotCancelled && item.productId) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            quantity: { increment: item.quantity },
                            status: 'AVAILABLE' // Since stock is restored, ensure discoverability
                        }
                    });
                }

                await tx.orderItem.update({
                    where: { id: item.id },
                    data: { status }
                });
            }

            // Sync overarching parent order state
            const allItems = await tx.orderItem.findMany({ where: { orderId: id } });
            const allCompleted = allItems.every(i => i.status === 'COMPLETED');
            const allCancelled = allItems.every(i => i.status === 'CANCELLED' || i.status === 'REJECTED');

            if (allCompleted) {
                await tx.order.update({ where: { id }, data: { status: 'COMPLETED' } });
            } else if (allCancelled) {
                await tx.order.update({ where: { id }, data: { status: 'CANCELLED' } });
            }
        });

        res.json({ success: true, message: `Order status updated to ${status}` });

    } catch (e) {
        console.error("Failed to update status:", e);
        if (e.message === "NOT_FOUND") {
            return res.status(404).json({ success: false, message: "Order not found or zero items mapped to you." });
        }
        if (e.message.startsWith("INVALID_TRANSITION_")) {
            return res.status(400).json({ success: false, message: `Cannot change status of a ${e.message.split('INVALID_TRANSITION_')[1].toLowerCase()} order item.` });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
