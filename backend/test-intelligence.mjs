import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    try {
        const profile = await prisma.farmerProfile.findFirst();
        if (!profile) return console.log("Missing FarmerProfile test data.");

        const crop = await prisma.crop.findFirst({ where: { farmerId: profile.userId } });
        if (!crop) return console.log("Missing Crop test data.");

        const token = jwt.sign(
            { userId: profile.userId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        const invalidToken = jwt.sign(
            { userId: "unauthorized_user_123", role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log("\n--- TEST 1: Valid Farmer/Crop & Weather Data & Soil Data");
        let res = await fetch(`http://localhost:5002/api/digital-twin/${crop.id}/insights`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        let data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log("Insights Generated:", data.insights);

        console.log("\n--- TEST 2: Unauthorized Farmer");
        res = await fetch(`http://localhost:5002/api/digital-twin/${crop.id}/insights`, {
            headers: { 'Authorization': `Bearer ${invalidToken}` }
        });
        data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log("Response:", data.message);

        console.log("\n--- TEST 3: Insufficient Data Case (Empty DB object simulation)");
        // create dummy crop
        const dummyCrop = await prisma.crop.create({
            data: {
                farmerId: profile.userId,
                cropName: "Test Seed",
                status: "PLANTED"
            }
        });
        res = await fetch(`http://localhost:5002/api/digital-twin/${dummyCrop.id}/insights`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log("Response:", data.insights);

        // cleanup
        await prisma.crop.delete({ where: { id: dummyCrop.id } });

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
