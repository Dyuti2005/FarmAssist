import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function renderTest() {
    console.log("Starting AI backend tests...\n");

    try {
        const profile = await prisma.farmerProfile.findFirst();
        const token = jwt.sign(
            { userId: profile ? profile.userId : "dummy123", role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log("--- TEST 1: Authenticated Farmer Request (Missing Key / Mock) ---");
        let res = await fetch(`http://localhost:5002/api/ai/chat`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "How is my crop doing today?" })
        });
        let data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data.message || "Failed properly capturing AI Missing config");

        console.log("\n--- TEST 2: Unauthenticated Request ---");
        res = await fetch(`http://localhost:5002/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Hello?" })
        });
        data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data.message || "Blocked successfully");

        console.log("\n--- TEST 3: Empty Message Request ---");
        res = await fetch(`http://localhost:5002/api/ai/chat`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "" })
        });
        data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data.message || "Blocked successfully");

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

renderTest();
