import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        const crop = await prisma.crop.findFirst();
        if (!crop) {
            console.log("No Crop found in runtime DB. Test aborted.");
            return;
        }

        const farmerId = crop.farmerId;
        const token = jwt.sign(
            { userId: farmerId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log(`Testing GET /api/digital-twin/${crop.id}...`);
        const res = await fetch(`http://localhost:5002/api/digital-twin/${crop.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("Status:", res.status);
        if (data.season) {
            console.log(`Successfully fetched Twin. Season: ${data.season}, Score: ${data.healthScore}`);
            console.log(`Activities found: ${data.activities?.length || 0}`);
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
