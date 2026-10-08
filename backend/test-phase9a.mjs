import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 9A Validation Tests...\n");

    try {
        const randId = Math.floor(Math.random() * 10000);

        // Setup
        const farmer = await prisma.user.create({ data: { name: "9A Farmer", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" } });
        const buyerA = await prisma.user.create({ data: { name: "9A Buyer A", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" } });
        const buyerB = await prisma.user.create({ data: { name: "9A Buyer B", phone: `91999${randId}`, passwordHash: "dummy", role: "BUYER" } });

        const product = await prisma.product.create({
            data: { farmer: { connect: { id: farmer.id } }, productName: "9A Orange", quantity: 100, price: 50, unit: "kg", status: "AVAILABLE" }
        });

        const fToken = jwt.sign({ userId: farmer.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bAToken = jwt.sign({ userId: buyerA.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bBToken = jwt.sign({ userId: buyerB.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // Setup an order for Buyer A
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: product.id, quantity: 10, priceAtAdd: 50, subtotal: 500 } });
        const orderResA = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        const orderData = await orderResA.json();
        if (!orderData.success) {
            console.error("Critical: Order Creation Failed!", orderData);
            throw new Error("Initial order failed to create.");
        }
        const orderIdA = orderData.order.id;

        // Validation Variables
        let passed = true;

        // 1. Create a PENDING payment for their own order + Check Amount match
        console.log("--- 1. Buyer A creates payment intent ---");
        const payRes1 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}/create`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 9999, status: 'PAID' }) // Attempts to inject fake amount and fake status
        });
        const pay1 = await payRes1.json();
        console.log("Success?", pay1.success);
        console.log("Status is strictly PENDING?", pay1.payment?.status === 'PENDING');
        console.log("Amount matches EXACT backend Order total (500) natively ignoring injection?", pay1.payment?.amount === 500);
        if (!pay1.success || pay1.payment.status !== 'PENDING' || pay1.payment.amount !== 500) passed = false;

        // 2. Prevent Duplicate Active Payments
        console.log("\n--- 2. Prevent Duplicate Payment Simulation ---");
        const payRes2 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}/create`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        console.log("Duplicate gracefully blocked (400)?", payRes2.status === 400);
        if (payRes2.status !== 400) passed = false;

        // 3. Buyer cannot create for another Buyer
        console.log("\n--- 3. Buyer B tries to pay Buyer A's order ---");
        const payRes3 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}/create`, { method: 'POST', headers: { 'Authorization': `Bearer ${bBToken}` } });
        console.log("Blocked accurately (404/Not Found mappings)?", payRes3.status === 404);
        if (payRes3.status !== 404) passed = false;

        // 4. Farmer cannot access payment APIs (Strict Buyer-only)
        console.log("\n--- 4. Farmer accesses payment API ---");
        const payRes4 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}`, { headers: { 'Authorization': `Bearer ${fToken}` } });
        console.log("Farmer blocked gracefully (403 Forbidden)?", payRes4.status === 403);
        if (payRes4.status !== 403) passed = false;

        // 5. Payment persistence query
        console.log("\n--- 5. Payment status persistent state extraction ---");
        const payRes5 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}`, { headers: { 'Authorization': `Bearer ${bAToken}` } });
        const pay5 = await payRes5.json();
        console.log("Restores actively PENDING schema securely?", pay5.payment?.status === 'PENDING' && pay5.payment.id === pay1.payment.id);
        if (!pay5.payment || pay5.payment.status !== 'PENDING') passed = false;

        console.log("\n>>> ALL TESTS PASSED:", passed);

        // CLEANUP
        await prisma.payment.deleteMany({ where: { id: pay1.payment?.id } });
        await prisma.cartItem.deleteMany({ where: { buyerId: { in: [buyerA.id, buyerB.id] } } });
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({ where: { farmerId: farmer.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmer.id, buyerA.id, buyerB.id] } } });

    } catch (e) {
        console.error("Critical Failure:", e);
    } finally {
        await prisma.$disconnect();
    }
}
runTests();
