const prisma = require('../config/db');

exports.getAllCrops = async (req, res) => {
    try {
        const crops = await prisma.crop.findMany({
            where: { farmerId: req.user.userId },
            include: { passports: true }
        });
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCrop = async (req, res) => {
    try {
        const { cropName, variety, sowingDate, expectedHarvestDate, quantity, status } = req.body;
        // Use req.user.userId instead of accepting arbitrary farmerId
        const newCrop = await prisma.crop.create({
            data: {
                farmerId: req.user.userId,
                cropName,
                variety,
                sowingDate: sowingDate ? new Date(sowingDate) : null,
                expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
                quantity,
                status
            }
        });
        res.status(201).json({ message: "Crop created", data: newCrop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCropById = async (req, res) => {
    try {
        const { id } = req.params;
        const crop = await prisma.crop.findUnique({
            where: { id },
            include: { passports: true }
        });
        if (!crop) return res.status(404).json({ message: "Crop not found" });
        if (crop.farmerId !== req.user.userId) return res.status(403).json({ message: "Unauthorized access to crop" });
        res.json(crop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCrop = async (req, res) => {
    try {
        const { id } = req.params;
        const crop = await prisma.crop.findUnique({ where: { id } });
        if (!crop) return res.status(404).json({ message: "Crop not found" });
        if (crop.farmerId !== req.user.userId) return res.status(403).json({ message: "Unauthorized access to update crop" });

        const updated = await prisma.crop.update({
            where: { id },
            data: req.body
        });
        res.json({ message: "Crop updated", data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
