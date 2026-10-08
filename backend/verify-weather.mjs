import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        const profile = await prisma.farmerProfile.findFirst();
        if (!profile) {
            console.log("No FarmerProfile found mapped in DB. Test aborted.");
            return;
        }

        const farmerId = profile.userId;
        const token = jwt.sign(
            { userId: farmerId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log(`Testing GET /api/weather with farmer's token (Location: ${profile.farmLocation})...`);
        const res = await fetch(`http://localhost:5002/api/weather`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("Status:", res.status);
        if (data.success) {
            console.log(`Success! Current Temp: ${data.data.current.temperature}`);
            console.log(`Current Condition: ${data.data.current.description}`);
            console.log(`Forecast Days: ${data.data.forecast.length}`);
            console.log(data.data.forecast);
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
