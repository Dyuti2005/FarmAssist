import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Multilingual Memory tests...\n");

    try {
        const profile = await prisma.farmerProfile.findFirst();
        const farmerAToken = jwt.sign(
            { userId: profile.userId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log("--- TEST 1: Create English Conversation ---");
        let res = await fetch(`http://localhost:5002/api/ai/conversations`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${farmerAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "English Chat", language: "en" })
        });
        let cEN = await res.json();
        console.log("EN Conv Lang:", cEN.conversation.language);

        console.log("--- TEST 2: Create Kannada Conversation ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${farmerAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "Kannada Chat", language: "kn" })
        });
        let cKN = await res.json();
        console.log("KN Conv Lang:", cKN.conversation.language);

        console.log("--- TEST 3: Create Hindi Conversation ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${farmerAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "Hindi Chat", language: "hi" })
        });
        let cHI = await res.json();
        console.log("HI Conv Lang:", cHI.conversation.language);

        console.log("\n--- TEST 4: Fetch List confirming persistence ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations`, {
            headers: { 'Authorization': `Bearer ${farmerAToken}` }
        });
        let all = await res.json();
        console.log("Total Conversations Found:", all.conversations.length);
        console.log("Found KN block in array?", all.conversations.some(c => c.language === 'kn'));

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
