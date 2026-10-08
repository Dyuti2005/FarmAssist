const prisma = require('../config/db');

exports.getFarmerProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await prisma.farmerProfile.findUnique({
            where: { userId },
            include: { user: true }
        });

        if (!profile) return res.status(404).json({ message: "Farmer not found" });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFarmerProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { farmLocation, farmSize, soilType, irrigationType } = req.body;

        const updated = await prisma.farmerProfile.update({
            where: { userId },
            data: { farmLocation, farmSize, soilType, irrigationType }
        });

        res.json({ message: "Farmer profile updated", data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
