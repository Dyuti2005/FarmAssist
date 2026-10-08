import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        let passport = await prisma.cropPassport.findFirst({ include: { crop: { include: { farmer: true } } } });

        if (!passport) {
            console.log("Creating dummy farmer, crop, and passport...");
            const farmer = await prisma.user.create({
                data: {
                    name: "Test Farmer",
                    phone: "+1234567890",
                    passwordHash: "dummyhash",
                    role: "FARMER"
                }
            });
            const crop = await prisma.crop.create({
                data: {
                    farmerId: farmer.id,
                    cropName: "Blockchain Wheat",
                    quantity: 500,
                    status: "PLANTED"
                }
            });
            passport = await prisma.cropPassport.create({
                data: {
                    cropId: crop.id,
                    passportNumber: "PASS-" + Date.now()
                },
                include: { crop: true }
            });
        }

        const farmerId = passport.crop.farmerId;
        const token = jwt.sign(
            { userId: farmerId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log(`Testing POST /api/crop-passports/${passport.id}/register...`);
        const res = await fetch(`http://localhost:5002/api/crop-passports/${passport.id}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("Status:", res.status);
        if (data.data) {
            console.log("Transaction Hash:", data.data.blockchainTransactionHash);
            console.log("Data Hash:", data.data.dataHash);
            console.log("Network:", data.data.blockchainNetwork);
            console.log("Contract Address:", data.data.contractAddress);
            console.log("Status:", data.data.blockchainStatus);
        } else {
            console.log("Response:", data);
        }

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
