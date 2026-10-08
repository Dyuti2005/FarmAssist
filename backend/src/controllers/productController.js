const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get farmer's own products
exports.getMyProducts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const products = await prisma.product.findMany({
            where: { farmerId: userId },
            include: { crop: { select: { cropName: true, variety: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, products });
    } catch (e) {
        console.error("Failed to fetch my products:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Create a new product listing
exports.createProduct = async (req, res) => {
    try {
        const farmerId = req.user.userId;
        const { cropId, productName, quantity, price, unit } = req.body;

        if (!productName || !quantity || !price || !unit) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const qtyNum = parseFloat(quantity);
        const priceNum = parseFloat(price);

        if (isNaN(qtyNum) || qtyNum <= 0) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }
        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ success: false, message: "Invalid price" });
        }

        // Validate if cropId is provided, the crop actually belongs to the farmer
        if (cropId) {
            const crop = await prisma.crop.findFirst({ where: { id: cropId, farmerId } });
            if (!crop) return res.status(403).json({ success: false, message: "Crop does not belong to you or does not exist." });
        }

        const productData = {
            farmer: { connect: { id: farmerId } },
            productName,
            quantity: qtyNum,
            price: priceNum,
            unit,
            status: 'AVAILABLE'
        };

        if (cropId) {
            productData.crop = { connect: { id: cropId } };
        }

        const product = await prisma.product.create({
            data: productData
        });

        res.status(201).json({ success: true, product });
    } catch (e) {
        console.error("Failed to create product:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update an existing product listing
exports.updateProduct = async (req, res) => {
    try {
        const farmerId = req.user.userId;
        const { id } = req.params;
        const { productName, quantity, price, unit, status } = req.body;

        const product = await prisma.product.findFirst({ where: { id, farmerId } });
        if (!product) return res.status(404).json({ success: false, message: "Product not found or unauthorized" });

        const updateData = {};
        if (productName !== undefined) updateData.productName = productName;
        if (unit !== undefined) updateData.unit = unit;

        if (quantity !== undefined) {
            const qtyNum = parseFloat(quantity);
            if (isNaN(qtyNum) || qtyNum < 0) return res.status(400).json({ success: false, message: "Invalid quantity" });
            updateData.quantity = qtyNum;
        }

        if (price !== undefined) {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) return res.status(400).json({ success: false, message: "Invalid price" });
            updateData.price = priceNum;
        }

        if (status !== undefined) {
            const allowedStatuses = ['AVAILABLE', 'UNAVAILABLE', 'SOLD'];
            if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status value" });
            updateData.status = status;
        }

        const updated = await prisma.product.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, product: updated });
    } catch (e) {
        console.error("Failed to update product:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete a product listing
exports.deleteProduct = async (req, res) => {
    try {
        const farmerId = req.user.userId;
        const { id } = req.params;

        const product = await prisma.product.findFirst({ where: { id, farmerId } });
        if (!product) return res.status(404).json({ success: false, message: "Product not found or unauthorized" });

        await prisma.product.delete({ where: { id } });

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (e) {
        console.error("Failed to delete product:", e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
