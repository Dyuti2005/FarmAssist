const prisma = require('../config/db');
const { storeCropPassportData } = require('../blockchain/polygonService');

exports.getPassportById = async (req, res) => {
    try {
        const { id } = req.params;
        const passport = await prisma.cropPassport.findUnique({
            where: { id },
            include: { crop: true }
        });
        if (!passport) return res.status(404).json({ message: "Crop Passport not found" });
        if (passport.crop.farmerId !== req.user.userId) return res.status(403).json({ message: "Unauthorized access" });

        res.json(passport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerPassportOnChain = async (req, res) => {
    try {
        const { id } = req.params;
        const passport = await prisma.cropPassport.findUnique({
            where: { id },
            include: { crop: true }
        });

        if (!passport) return res.status(404).json({ message: "Crop Passport not found" });
        if (passport.crop.farmerId !== req.user.userId) return res.status(403).json({ message: "Unauthorized access" });
        if (passport.blockchainStatus === "VERIFIED") return res.status(400).json({ message: "Already registered on blockchain" });

        // Prepare deterministic logic for hashing data
        const sensitiveData = {
            passportNumber: passport.passportNumber,
            cropName: passport.crop.cropName,
            variety: passport.crop.variety,
            farmerId: passport.crop.farmerId, // Link to actual user logically without exposing raw personal name
        };

        // Submit to smart contract
        const blockResult = await storeCropPassportData(passport.id, sensitiveData);

        // Save transaction back to postgres
        const updated = await prisma.cropPassport.update({
            where: { id },
            data: {
                blockchainStatus: "VERIFIED",
                blockchainTransactionHash: blockResult.transactionHash,
                blockchainNetwork: blockResult.network,
                contractAddress: blockResult.contractAddress,
                dataHash: blockResult.dataHash
            }
        });

        res.json({ message: "Passport successfully registered on Polygon", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to register: " + error.message });
    }
};
