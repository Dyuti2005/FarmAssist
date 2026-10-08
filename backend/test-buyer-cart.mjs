import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 8D: Buyer Cart tests...\n");

    try {
        const randId = Math.floor(Math.random() * 100000);

        // 1. Setup Data
        const farmerUser = await prisma.user.create({
            data: { name: "Phase 8D Farmer", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" }
        });

        const buyerUser = await prisma.user.create({
            data: { name: "Phase 8D Buyer A", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        const buyer2User = await prisma.user.create({
            data: { name: "Phase 8D Buyer B", phone: `91999${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        const productAvail = await prisma.product.create({
            data: { farmer: { connect: { id: farmerUser.id } }, productName: "Premium Corn", quantity: 500, price: 20, unit: "kg", status: "AVAILABLE" }
        });
        const productUnavail = await prisma.product.create({
            data: { farmer: { connect: { id: farmerUser.id } }, productName: "Hidden Corn", quantity: 50, price: 20, unit: "kg", status: "UNAVAILABLE" }
        });

        const bToken = jwt.sign({ userId: buyerUser.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const b2Token = jwt.sign({ userId: buyer2User.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const fToken = jwt.sign({ userId: farmerUser.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // TEST BLOCK
        console.log("--- TEST 1: Buyer A Adds AVAILABLE Product to Cart ---");
        let res = await fetch(`http://localhost:5002/api/cart`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${bToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productAvail.id, quantity: 10 })
        });
        let addCheck = await res.json();
        console.log("Cart item created correctly?", addCheck.success === true && addCheck.item.subtotal === 200);

        console.log("\n--- TEST 2: Validate Cart Retrieval & Calculation ---");
        res = await fetch(`http://localhost:5002/api/cart`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        let getCheck = await res.json();
        console.log("Cart contains 1 item?", getCheck.cart.length === 1);
        console.log("Cart loads expanded product info?", getCheck.cart[0].product.productName === "Premium Corn");

        console.log("\n--- TEST 3: Validation (Reject Unavailable) ---");
        res = await fetch(`http://localhost:5002/api/cart`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${bToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productUnavail.id, quantity: 5 })
        });
        let blockCheck = await res.json();
        console.log("UNAVAILABLE product correctly blocked?", blockCheck.success === false && res.status === 400);

        console.log("\n--- TEST 4: Validation (Reject Over-Quantity) ---");
        res = await fetch(`http://localhost:5002/api/cart`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${bToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productAvail.id, quantity: 600 }) // Available is 500
        });
        let limitCheck = await res.json();
        console.log("Over-quantity rejected?", limitCheck.success === false && res.status === 400);

        console.log("\n--- TEST 5: Security (Buyer B accesses Buyer A's Cart items) ---");
        res = await fetch(`http://localhost:5002/api/cart/${addCheck.item.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${b2Token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: 20 })
        });
        console.log("Cross-buyer mutation blocked?", res.status === 404);

        console.log("\n--- TEST 6: Security (Farmer tries to use cart) ---");
        res = await fetch(`http://localhost:5002/api/cart`, { headers: { 'Authorization': `Bearer ${fToken}` } });
        console.log("Farmer access to Buyer Cart blocked?", res.status === 403);

        console.log("\n--- TEST 7: Buyer A Updates Cart Quantity ---");
        res = await fetch(`http://localhost:5002/api/cart/${addCheck.item.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${bToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: 20 })
        });
        let updateCheck = await res.json();
        console.log("Quantity updated to 20 subtotal 400?", updateCheck.item.subtotal === 400);

        console.log("\n--- TEST 8: Buyer A Removes Item ---");
        res = await fetch(`http://localhost:5002/api/cart/${addCheck.item.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${bToken}` }
        });
        console.log("Item deleted successfully?", res.status === 200);

        // CLEANUP
        await prisma.cartItem.deleteMany({ where: { buyerId: buyerUser.id } });
        await prisma.product.deleteMany({ where: { farmerId: farmerUser.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmerUser.id, buyerUser.id, buyer2User.id] } } });

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
