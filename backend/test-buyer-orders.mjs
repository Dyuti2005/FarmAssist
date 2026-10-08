import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 8E: Buyer Order Creation tests...\n");

    try {
        const randId = Math.floor(Math.random() * 100000);

        // 1. Setup Data
        const farmerUser = await prisma.user.create({
            data: { name: "Phase 8E Farmer", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" }
        });

        const buyerUser = await prisma.user.create({
            data: { name: "Phase 8E Buyer A", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        const buyer2User = await prisma.user.create({
            data: { name: "Phase 8E Buyer B", phone: `91999${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        let productAvail = await prisma.product.create({
            data: { farmer: { connect: { id: farmerUser.id } }, productName: "Dynamic Wheat", quantity: 600, price: 40, unit: "kg", status: "AVAILABLE" }
        });

        const bToken = jwt.sign({ userId: buyerUser.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const b2Token = jwt.sign({ userId: buyer2User.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const fToken = jwt.sign({ userId: farmerUser.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // Add item to cart natively without API
        await prisma.cartItem.create({
            data: { buyer: { connect: { id: buyerUser.id } }, product: { connect: { id: productAvail.id } }, quantity: 15, priceAtAdd: 40, subtotal: 600 }
        });

        // TEST BLOCK
        console.log("--- TEST 1: Process Empty Cart Order Block ---");
        let res = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${b2Token}` } });
        let resCheck = await res.json();
        console.log("Empty cart properly blocked?", resCheck);

        console.log("\n--- TEST 2: Farmer Intercept (Cannot post to Order) ---");
        res = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${fToken}` } });
        console.log("Farmer access to Buyer APIs blocked?", res.status === 403);

        console.log("\n--- TEST 3: Order Process atomic creation ---");
        res = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bToken}` } });
        let orderCheck = await res.json();
        console.log("Test 3 Response:", orderCheck);

        const orderId = orderCheck.order?.id;
        if (!orderId) {
            console.log("TEST ABORTED: Order creation failed. Check errors above.");
            throw new Error("Cannot validate later stages without an orderId.");
        }

        console.log("\n--- TEST 4: Post-Order Validation (Cart cleared & Product Stock Dropped) ---");
        const remainingCart = await prisma.cartItem.findMany({ where: { buyerId: buyerUser.id } });
        console.log("Is the cart cleared correctly?", remainingCart.length === 0);

        productAvail = await prisma.product.findUnique({ where: { id: productAvail.id } });
        console.log("Has the product quantity accurately decreased from 600 to 585?", productAvail.quantity === 585);

        console.log("\n--- TEST 5: Snapshot Decoupling Validation ---");
        // Emulate Farmer changing their product name/price later
        await prisma.product.update({ where: { id: productAvail.id }, data: { price: 90, productName: "Altered Wheat" } });

        res = await fetch(`http://localhost:5002/api/orders/${orderId}`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        let snapCheck = await res.json();
        console.log("Does the completed order keep the historical price (40) and name (Dynamic Wheat)?",
            snapCheck.order?.items[0]?.priceAtOrder === 40 && snapCheck.order?.items[0]?.productName === "Dynamic Wheat"
        );

        console.log("\n--- TEST 6: Order Segregation (Buyer B reading Buyer A's order) ---");
        res = await fetch(`http://localhost:5002/api/orders/${orderId}`, { headers: { 'Authorization': `Bearer ${b2Token}` } });
        console.log("Is Buyer B blocked from seeing Buyer A's order?", res.status === 404);

        // CLEANUP
        await prisma.cartItem.deleteMany({ where: { buyerId: buyerUser.id } });
        await prisma.orderItem.deleteMany({ where: { orderId } });
        await prisma.order.deleteMany({ where: { id: orderId } });
        await prisma.product.deleteMany({ where: { farmerId: farmerUser.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmerUser.id, buyerUser.id, buyer2User.id] } } });

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
