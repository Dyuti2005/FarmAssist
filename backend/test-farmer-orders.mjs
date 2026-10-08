import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 8F: Farmer Order Management tests...\n");

    try {
        const randId = Math.floor(Math.random() * 100000);

        // 1. Setup Data
        const farmerA = await prisma.user.create({
            data: { name: "Phase 8F Farmer A", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" }
        });

        const farmerB = await prisma.user.create({
            data: { name: "Phase 8F Farmer B", phone: `91888${randId}`, passwordHash: "dummy", role: "FARMER" }
        });

        const buyerUser = await prisma.user.create({
            data: { name: "Phase 8F Buyer", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" }
        });

        const prodA = await prisma.product.create({
            data: { farmer: { connect: { id: farmerA.id } }, productName: "Farmer A Wheat", quantity: 600, price: 40, unit: "kg", status: "AVAILABLE" }
        });
        const prodB = await prisma.product.create({
            data: { farmer: { connect: { id: farmerB.id } }, productName: "Farmer B Rice", quantity: 1000, price: 60, unit: "kg", status: "AVAILABLE" }
        });

        const fAToken = jwt.sign({ userId: farmerA.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const fBToken = jwt.sign({ userId: farmerB.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bToken = jwt.sign({ userId: buyerUser.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // Add both items to Buyer's Cart natively
        await prisma.cartItem.createMany({
            data: [
                { buyerId: buyerUser.id, productId: prodA.id, quantity: 10, priceAtAdd: 40, subtotal: 400 },
                { buyerId: buyerUser.id, productId: prodB.id, quantity: 5, priceAtAdd: 60, subtotal: 300 }
            ]
        });

        // Buyer Places Mixed Order
        const orderRes = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bToken}` } });
        const orderCheck = await orderRes.json();
        const orderId = orderCheck.order.id;

        console.log("--- TEST 1: Process Mixed Order ---");
        console.log("Mixed Order properly generated?", orderCheck.success && orderCheck.order.items.length === 2 && orderCheck.order.totalAmount === 700);

        console.log("\n--- TEST 2: Multi-Farmer Order Isolation (Farmer A view) ---");
        let res = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}`, { headers: { 'Authorization': `Bearer ${fAToken}` } });
        let fACheck = await res.json();
        console.log("Farmer A sees ONLY Farmer A Wheat?",
            fACheck.success && fACheck.order.items.length === 1 && fACheck.order.items[0].productName === "Farmer A Wheat"
        );
        console.log("Farmer A sees ONLY their isolated Subtotal (400 instead of 700)?", fACheck.order.totalValueForFarmer === 400);

        console.log("\n--- TEST 3: Multi-Farmer Order Isolation (Farmer B view) ---");
        res = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}`, { headers: { 'Authorization': `Bearer ${fBToken}` } });
        let fBCheck = await res.json();
        console.log("Farmer B sees ONLY Farmer B Rice?",
            fBCheck.success && fBCheck.order.items.length === 1 && fBCheck.order.items[0].productName === "Farmer B Rice"
        );
        console.log("Farmer B sees ONLY their isolated Subtotal (300 instead of 700)?", fBCheck.order.totalValueForFarmer === 300);

        console.log("\n--- TEST 4: Buyer Cannot Access Farmer Order API ---");
        res = await fetch(`http://localhost:5002/api/farmer/orders`, { headers: { 'Authorization': `Bearer ${bToken}` } });
        console.log("Buyer gracefully blocked with 403 Forbidden?", res.status === 403);

        console.log("\n--- TEST 5: Farmer Status Transitions validation ---");
        res = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}/status`, {
            method: 'PUT', headers: { 'Authorization': `Bearer ${fAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'INVALID_STATUS' })
        });
        console.log("Invalid synthetic statuses blocked?", res.status === 400);

        res = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}/status`, {
            method: 'PUT', headers: { 'Authorization': `Bearer ${fAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'DISPATCHED' })
        });

        let faStatusCheck = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}`, { headers: { 'Authorization': `Bearer ${fAToken}` } });
        let fbStatusCheck = await fetch(`http://localhost:5002/api/farmer/orders/${orderId}`, { headers: { 'Authorization': `Bearer ${fBToken}` } });

        faStatusCheck = await faStatusCheck.json();
        fbStatusCheck = await fbStatusCheck.json();

        console.log("Farmer A modifying status ONLY updates Farmer A's items?",
            faStatusCheck.order.status === 'DISPATCHED' && fbStatusCheck.order.status === 'CONFIRMED'
        );

        console.log("\n--- TEST 6: Double-decrement Stock Prevention ---");
        const doubleStockProd = await prisma.product.findUnique({ where: { id: prodA.id } });
        console.log("Did Farmer A stock correctly decouple avoiding 2nd decrement (Stays 590)?", doubleStockProd.quantity === 590);

        // CLEANUP
        await prisma.cartItem.deleteMany({ where: { buyerId: buyerUser.id } });
        await prisma.orderItem.deleteMany({ where: { orderId } });
        await prisma.order.deleteMany({ where: { id: orderId } });
        await prisma.product.deleteMany({ where: { farmerId: { in: [farmerA.id, farmerB.id] } } });
        await prisma.user.deleteMany({ where: { id: { in: [farmerA.id, farmerB.id, buyerUser.id] } } });

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
