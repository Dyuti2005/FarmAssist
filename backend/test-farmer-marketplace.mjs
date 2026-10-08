import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 8B: Farmer Marketplace Listing tests...\n");

    try {
        const randId = Math.floor(Math.random() * 100000);
        // Setup mock farmer & buyer
        const farmerUser = await prisma.user.create({
            data: { name: "Phase 8 Farmer", phone: `8888777${randId}`, passwordHash: "dummy", role: "FARMER" }
        });

        const farmer2User = await prisma.user.create({
            data: { name: "Bad Farmer", phone: `8888700${randId}`, passwordHash: "dummy", role: "FARMER" }
        });

        const buyerUser = await prisma.user.create({
            data: { name: "Phase 8 Buyer", phone: `9999888${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        await prisma.farmerProfile.create({ data: { userId: farmerUser.id, farmLocation: "Testing Field" } });

        const fToken = jwt.sign({ userId: farmerUser.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const f2Token = jwt.sign({ userId: farmer2User.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bToken = jwt.sign({ userId: buyerUser.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        console.log("--- TEST 1: Farmer Create Listing ---");
        let res = await fetch(`http://localhost:5002/api/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${fToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ productName: "Test Wheat", quantity: 50, price: 30, unit: "kg" })
        });
        let pData = await res.json();
        console.log("POST Response:", pData);
        const pId = pData.product?.id;
        console.log("Product Created ID:", pId);

        console.log("\n--- TEST 2: Validate Rejections ---");
        let rej = await fetch(`http://localhost:5002/api/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${fToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ productName: "Invalid Rice", quantity: -10, price: 50, unit: "kg" })
        });
        console.log("Negative quantity rejected:", rej.status === 400);

        console.log("\n--- TEST 3: Marketplace visibility (AVAILABLE) ---");
        res = await fetch(`http://localhost:5002/api/marketplace`, {
            headers: { 'Authorization': `Bearer ${bToken}` }
        });
        let mData = await res.json();
        console.log("Is product in marketplace?", mData.products.some(p => p.id === pId));

        console.log("\n--- TEST 4: Hide/Update Product (UNAVAILABLE) ---");
        await fetch(`http://localhost:5002/api/products/${pId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${fToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "UNAVAILABLE" })
        });

        res = await fetch(`http://localhost:5002/api/marketplace`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        let mDataHidden = await res.json();
        console.log("Is product hidden in marketplace?", !mDataHidden.products.some(p => p.id === pId));

        console.log("\n--- TEST 5: Farmer B Cross-modify attempt ---");
        let cMod = await fetch(`http://localhost:5002/api/products/${pId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${f2Token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "AVAILABLE" }) // Trying to unhide Farmer 1's crop
        });
        console.log("Farmer 2 mod blocked:", cMod.status === 404);

        console.log("\n--- TEST 6: Buyer Modify attempt ---");
        let bMod = await fetch(`http://localhost:5002/api/products/${pId}`, {
            method: 'PUT', // Route is protected by requireRole(FARMER)
            headers: { 'Authorization': `Bearer ${bToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: 1 })
        });
        console.log("Buyer mod blocked:", bMod.status === 403);

        console.log("\n--- TEST 7: Farmer Delete Listing ---");
        await fetch(`http://localhost:5002/api/products/${pId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${fToken}` }
        });
        let chkDel = await prisma.product.findUnique({ where: { id: pId } });
        console.log("Product successfully deleted from DB:", chkDel === null);

        // CLEANUP
        await prisma.farmerProfile.deleteMany({ where: { userId: farmerUser.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmerUser.id, farmer2User.id, buyerUser.id] } } });

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
