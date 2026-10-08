const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Buyer Profile
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { buyerProfile: true }
        });

        if (!user || user.role !== 'BUYER') {
            return res.status(403).json({ success: false, message: "Unauthorized access or not a buyer." });
        }

        res.json({
            success: true,
            buyer: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                companyName: user.buyerProfile?.companyName || '',
                businessType: user.buyerProfile?.businessType || '',
                location: user.buyerProfile?.location || ''
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Failed to fetch buyer profile" });
    }
};

// Update Buyer Profile
exports.updateMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { companyName, businessType, location, name, email } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'BUYER') {
            return res.status(403).json({ success: false, message: "Unauthorized access or not a buyer." });
        }

        // Update User explicitly
        if (name || email) {
            await prisma.user.update({
                where: { id: userId },
                data: { name: name || user.name, email: email || user.email }
            });
        }

        const profile = await prisma.buyerProfile.upsert({
            where: { userId },
            create: { userId, companyName, businessType, location },
            update: { companyName, businessType, location }
        });

        res.json({ success: true, profile });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Failed to update buyer profile" });
    }
};
