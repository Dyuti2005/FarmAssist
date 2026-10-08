import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 8C: Buyer Product Discovery tests...\n");

    try {
        const randId = Math.floor(Math.random() * 100000);

        // 1. Setup Data
        const farmerUser = await prisma.user.create({
            data: { name: "Phase 8C Farmer", phone: `9188777${randId}`, passwordHash: "dummy", role: "FARMER" }
        });
        await prisma.farmerProfile.create({ data: { userId: farmerUser.id, farmLocation: "Discovery Farm", farmSize: "10 Acres" } });

        const buyerUser = await prisma.user.create({
            data: { name: "Phase 8C Buyer", phone: `9199888${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        // 2. Farmer creates two mappings (Available, Unavailable)
        const productAvail = await prisma.product.create({
            data: { farmer: { connect: { id: farmerUser.id } }, productName: "Premium Apple", quantity: 100, price: 50, unit: "kg", status: "AVAILABLE" }
        });
        const productUnavail = await prisma.product.create({
            data: { farmer: { connect: { id: farmerUser.id } }, productName: "Hidden Apple", quantity: 100, price: 50, unit: "kg", status: "UNAVAILABLE" }
        });

        const bToken = jwt.sign({ userId: buyerUser.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const fToken = jwt.sign({ userId: farmerUser.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // TEST BLOCK
        console.log("--- TEST 1: Buyer Fetch Single Product (AVAILABLE) ---");
        let res = await fetch(`http://localhost:5002/api/marketplace/${productAvail.id}`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        let productCheck = await res.json();
        console.log("Response:", productCheck);
        console.log("Is Available Product returned?", productCheck.success === true && productCheck.product?.title === "Premium Apple");
        console.log("Does it gracefully format farmer data?", productCheck.product?.farmer === "Phase 8C Farmer", "FarmSize String:", productCheck.product?.farmSize);

        console.log("\n--- TEST 2: Buyer Fetch Single Product (UNAVAILABLE) ---");
        res = await fetch(`http://localhost:5002/api/marketplace/${productUnavail.id}`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        let hCheck = await res.json();
        console.log("Is block successful (404 Not Found / Unavailable)?", res.status === 404);

        console.log("\n--- TEST 3: Farmer Traversal Block (Cannot use /api/marketplace/:id) ---");
        res = await fetch(`http://localhost:5002/api/marketplace/${productAvail.id}`, { headers: { 'Authorization': `Bearer ${fToken}` } });
        let tCheck = await res.json();
        console.log("Farmer access blocked?", res.status === 403);

        console.log("\n--- TEST 4: Invalid Random ID Graceful Fallback ---");
        res = await fetch(`http://localhost:5002/api/marketplace/invalid-uuid-1234`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        let iCheck = await res.json();
        console.log("Invalid ID blocked?", res.status === 500 || res.status === 404);

        // CLEANUP
        await prisma.product.deleteMany({ where: { farmerId: farmerUser.id } });
        await prisma.farmerProfile.deleteMany({ where: { userId: farmerUser.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmerUser.id, buyerUser.id] } } });

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
