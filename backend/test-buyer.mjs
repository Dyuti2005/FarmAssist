import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Buyer & Marketplace tests...\n");

    try {
        // Create a mock buyer
        const buyerUser = await prisma.user.create({
            data: {
                name: "Test Buyer Profile",
                phone: "998877665511",
                passwordHash: "dummy",
                role: "BUYER"
            }
        });

        const buyerToken = jwt.sign(
            { userId: buyerUser.id, role: "BUYER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        console.log("--- TEST 1: Update Buyer Profile ---");
        let res = await fetch(`http://localhost:5002/api/buyers/me`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${buyerToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyName: "Big Harvest Inc",
                businessType: "Wholesale",
                location: "Mumbai",
                name: "Real Buyer Name"
            })
        });
        let profData = await res.json();
        console.log("Buyer Profile Updated:", profData.profile.companyName);

        console.log("\n--- TEST 2: Fetch Buyer Profile ---");
        res = await fetch(`http://localhost:5002/api/buyers/me`, {
            headers: { 'Authorization': `Bearer ${buyerToken}` }
        });
        let getProf = await res.json();
        console.log("Buyer Data Fetched:", getProf.buyer);

        console.log("\n--- TEST 3: Fetch Marketplace ---");
        res = await fetch(`http://localhost:5002/api/marketplace?category=Grains`, {
            headers: { 'Authorization': `Bearer ${buyerToken}` }
        });
        let marketplaceData = await res.json();
        console.log("Marketplace Items Found:", marketplaceData.products?.length);

        console.log("\n--- TEST 4: Prevent Farmer from viewing buyer endpoints ---");
        const profile = await prisma.farmerProfile.findFirst();
        const farmerAToken = jwt.sign(
            { userId: profile.userId, role: "FARMER" },
            process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026',
            { expiresIn: '1h' }
        );

        res = await fetch(`http://localhost:5002/api/buyers/me`, {
            headers: { 'Authorization': `Bearer ${farmerAToken}` }
        });
        let unauthorizedCheck = await res.json();
        console.log("Farmer accessing Buyer endpoint:", res.status, unauthorizedCheck.message);

        res = await fetch(`http://localhost:5002/api/marketplace`, {
            headers: { 'Authorization': `Bearer ${farmerAToken}` }
        });
        let unauthorizedCheckMarket = await res.json();
        console.log("Farmer accessing Marketplace endpoint:", res.status, unauthorizedCheckMarket.message);

        // Cleanup test user
        await prisma.buyerProfile.deleteMany({ where: { userId: buyerUser.id } });
        await prisma.user.deleteMany({ where: { id: buyerUser.id } });

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
