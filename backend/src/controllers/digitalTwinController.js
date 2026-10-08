const prisma = require('../config/db');

exports.getDigitalTwinByCropId = async (req, res) => {
    try {
        const { cropId } = req.params;

        // Verify crop ownership securely
        const crop = await prisma.crop.findUnique({
            where: { id: cropId }
        });

        if (!crop) return res.status(404).json({ message: "Crop not found" });
        if (crop.farmerId !== req.user.userId) return res.status(403).json({ message: "Unauthorized access" });

        // Get or initialize Digital Twin profile
        let twin = await prisma.digitalTwinProfile.findUnique({
            where: { cropId },
            include: { activities: { orderBy: { date: 'desc' } } }
        });

        if (!twin) {
            // Seed a minimal profile if none exists for the first time
            twin = await prisma.digitalTwinProfile.create({
                data: {
                    cropId,
                    season: "Kharif",
                    farmStatus: "Healthy",
                    twinStatus: "Active",
                    healthScore: 92,
                    healthStatus: "Excellent",
                    soilPh: 6.5,
                    soilOrganicMatter: 2.1,
                    soilN: 14,
                    soilP: 32,
                    soilK: 18,
                    lastSoilTestDate: new Date(),
                    activities: {
                        create: [
                            { activityType: "Soil Test Completed", date: new Date(Date.now() - 20 * 86400000) },
                            { activityType: "Irrigation Logged", date: new Date(Date.now() - 19 * 86400000) },
                            { activityType: "Fertilizer Added", date: new Date(Date.now() - 17 * 86400000) },
                            { activityType: "Pest Monitoring", date: new Date(Date.now() - 16 * 86400000) }
                        ]
                    }
                },
                include: { activities: { orderBy: { date: 'desc' } } }
            });
        }

        res.json(twin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
