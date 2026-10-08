const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const cartItems = await prisma.cartItem.findMany({
            where: { buyerId },
            include: {
                product: {
                    select: {
                        productName: true,
                        price: true,
                        unit: true,
                        status: true,
                        farmer: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, cart: cartItems });
    } catch (e) {
        console.error("Failed to fetch cart:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/cart
exports.addToCart = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Missing productId or quantity" });
        }

        const qtyNum = parseFloat(quantity);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }

        // Validate product exists & is available
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.status !== 'AVAILABLE') {
            return res.status(400).json({ success: false, message: "Product is no longer available" });
        }

        if (qtyNum > product.quantity) {
            return res.status(400).json({ success: false, message: `Requested quantity exceeds available stock (${product.quantity} ${product.unit}).` });
        }

        // Check if item already in cart
        let cartItem = await prisma.cartItem.findFirst({ where: { buyerId, productId } });

        if (cartItem) {
            const newQty = cartItem.quantity + qtyNum;
            if (newQty > product.quantity) {
                return res.status(400).json({ success: false, message: `Total requested quantity exceeds available stock.` });
            }
            cartItem = await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: newQty,
                    priceAtAdd: product.price,
                    subtotal: newQty * product.price
                }
            });
        } else {
            cartItem = await prisma.cartItem.create({
                data: {
                    buyer: { connect: { id: buyerId } },
                    product: { connect: { id: productId } },
                    quantity: qtyNum,
                    priceAtAdd: product.price,
                    subtotal: qtyNum * product.price
                }
            });
        }

        res.status(201).json({ success: true, item: cartItem });

    } catch (e) {
        console.error("Failed to add to cart:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PUT /api/cart/:id
exports.updateCartItem = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const { id } = req.params;
        const { quantity } = req.body;

        const qtyNum = parseFloat(quantity);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: { id, buyerId },
            include: { product: true }
        });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        if (qtyNum > cartItem.product.quantity) {
            return res.status(400).json({ success: false, message: `Quantity exceeds available stock (${cartItem.product.quantity}).` });
        }

        const updated = await prisma.cartItem.update({
            where: { id },
            data: {
                quantity: qtyNum,
                priceAtAdd: cartItem.product.price,
                subtotal: qtyNum * cartItem.product.price
            }
        });

        res.json({ success: true, item: updated });

    } catch (e) {
        console.error("Failed to update cart:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/cart/:id
exports.removeFromCart = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const { id } = req.params;

        const cartItem = await prisma.cartItem.findFirst({ where: { id, buyerId } });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        await prisma.cartItem.delete({ where: { id } });

        res.json({ success: true, message: "Item removed from cart" });

    } catch (e) {
        console.error("Failed to delete cart item:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
