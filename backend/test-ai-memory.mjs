import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function renderTest() {
    console.log("Starting AI Memory & History tests...\n");

    try {
        const profile = await prisma.farmerProfile.findFirst();
        const farmerAToken = jwt.sign(
            { userId: profile.userId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        // Dummy Farmer B
        const farmerBToken = jwt.sign(
            { userId: "dummy_farmer_b", role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log("--- TEST 1: Farmer A creates a conversation ---");
        let res = await fetch(`http://localhost:5002/api/ai/conversations`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${farmerAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "My first AI chat" })
        });
        let cData = await res.json();
        console.log("Status:", res.status);
        console.log("Conversation Created:", cData.conversation.id);
        const convId = cData.conversation.id;

        console.log("\n--- TEST 2: Farmer A sends a message ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations/${convId}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${farmerAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "What should I do?" })
        });
        let mData = await res.json();
        console.log("Status:", res.status);
        console.log("User Input Passed Natively. AI Reply Status (Mock):", mData.reply);

        console.log("\n--- TEST 3: Messages persist and retrieved ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations/${convId}/messages`, {
            headers: { 'Authorization': `Bearer ${farmerAToken}` }
        });
        let pData = await res.json();
        console.log("Status:", res.status);
        console.log(`Retrieved ${pData.messages.length} messages (USER + ASSISTANT pairs saved)`);

        console.log("\n--- TEST 4: Farmer B attempts to access Farmer A's conversation ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations/${convId}/messages`, {
            headers: { 'Authorization': `Bearer ${farmerBToken}` }
        });
        let bData = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", bData.message);

        console.log("\n--- TEST 5: Farmer A deletes conversation ---");
        res = await fetch(`http://localhost:5002/api/ai/conversations/${convId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${farmerAToken}` }
        });
        let dData = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", dData.message);

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

renderTest();
