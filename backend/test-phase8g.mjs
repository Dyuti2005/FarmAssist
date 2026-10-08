import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runTests() {
    console.log("Starting Phase 8G Validation Tests...\n");

    try {
        const randId = Math.floor(Math.random() * 10000);

        // Setup
        const farmerA = await prisma.user.create({ data: { name: "8G Farmer A", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" } });
        const farmerB = await prisma.user.create({ data: { name: "8G Farmer B", phone: `91888${randId}`, passwordHash: "dummy", role: "FARMER" } });
        const buyerA = await prisma.user.create({ data: { name: "8G Buyer A", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" } });
        const buyerB = await prisma.user.create({ data: { name: "8G Buyer B", phone: `91999${randId}`, passwordHash: "dummy", role: "BUYER" } });

        const productA = await prisma.product.create({
            data: { farmer: { connect: { id: farmerA.id } }, productName: "8G Apple", quantity: 100, price: 50, unit: "kg", status: "AVAILABLE" }
        });

        const fAToken = jwt.sign({ userId: farmerA.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const fBToken = jwt.sign({ userId: farmerB.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bAToken = jwt.sign({ userId: buyerA.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bBToken = jwt.sign({ userId: buyerB.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // Test 1: Buyer A orders 60kg, Remaining stock = 40kg
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: productA.id, quantity: 60, priceAtAdd: 50, subtotal: 3000 } });
        await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        const p1 = await prisma.product.findUnique({ where: { id: productA.id } });
        console.log("Test 1 (Stock Reduction):", p1.quantity === 40 ? "Pass" : "Fail");

        // Test 2: Buyer B attempts 50kg (rejected)
        await prisma.cartItem.create({ data: { buyerId: buyerB.id, productId: productA.id, quantity: 50, priceAtAdd: 50, subtotal: 2500 } });
        const t2Res = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bBToken}` } });
        const t2Check = await t2Res.json();
        console.log("Test 2 (Oversell Rejected):", t2Check.success === false && t2Res.status === 400 ? "Pass" : "Fail");

        // Clean Buyer B's cart
        await prisma.cartItem.deleteMany({ where: { buyerId: buyerB.id } });

        // Test 3: Product reaches 0 quantity, goes unavailable
        await prisma.cartItem.create({ data: { buyerId: buyerB.id, productId: productA.id, quantity: 40, priceAtAdd: 50, subtotal: 2000 } });
        await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bBToken}` } });
        const p3 = await prisma.product.findUnique({ where: { id: productA.id } });
        console.log("Test 3 (0 Stock -> UNAVAILABLE):", p3.quantity === 0 && p3.status === 'UNAVAILABLE' ? "Pass" : "Fail");

        // Restore product for Test 4
        await prisma.product.update({ where: { id: productA.id }, data: { quantity: 100, status: 'AVAILABLE' } });

        // Test 4: Stale Cart Rejection
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: productA.id, quantity: 50, priceAtAdd: 50, subtotal: 2500 } });
        await prisma.product.update({ where: { id: productA.id }, data: { quantity: 20 } });
        const t4Res = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        console.log("Test 4 (Stale Cart Rejected):", t4Res.status === 400 ? "Pass" : "Fail");
        await prisma.cartItem.deleteMany({ where: { buyerId: buyerA.id } });

        // Test 5: Farmer marks UNAVAILABLE manually -> Order Blocked
        await prisma.product.update({ where: { id: productA.id }, data: { quantity: 50, status: 'UNAVAILABLE' } });
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: productA.id, quantity: 10, priceAtAdd: 50, subtotal: 500 } });
        const t5Res = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        console.log("Test 5 (Farmer Mutes Product):", t5Res.status === 400 ? "Pass" : "Fail");
        await prisma.cartItem.deleteMany({ where: { buyerId: buyerA.id } });

        // Test 6: Farmer Isolation
        await prisma.product.update({ where: { id: productA.id }, data: { status: 'AVAILABLE' } });
        const productB = await prisma.product.create({ data: { farmerId: farmerB.id, productName: "8G Mango", quantity: 100, price: 10, unit: "kg", status: "AVAILABLE" } });
        await prisma.cartItem.createMany({
            data: [
                { buyerId: buyerA.id, productId: productA.id, quantity: 10, priceAtAdd: 50, subtotal: 500 },
                { buyerId: buyerA.id, productId: productB.id, quantity: 10, priceAtAdd: 10, subtotal: 100 }
            ]
        });
        const t6OrderRes = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        const t6Order = await t6OrderRes.json();
        if (!t6Order.success) throw new Error("T6 Order failed: " + JSON.stringify(t6Order));

        await fetch(`http://localhost:5002/api/farmer/orders/${t6Order.order.id}/status`, { method: 'PUT', headers: { 'Authorization': `Bearer ${fAToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'DISPATCHED' }) });
        const t6BCheckRes = await fetch(`http://localhost:5002/api/farmer/orders/${t6Order.order.id}`, { headers: { 'Authorization': `Bearer ${fBToken}` } });
        const t6BCheck = await t6BCheckRes.json();
        console.log("Test 6 (Isolation): Farmer B item untouched?", t6BCheck.order.items[0].status === 'CONFIRMED' ? "Pass" : "Fail");

        // Test 9: Concurrent Purchase Simulation
        await prisma.product.update({ where: { id: productA.id }, data: { quantity: 15 } });
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: productA.id, quantity: 10, priceAtAdd: 50, subtotal: 500 } });
        await prisma.cartItem.create({ data: { buyerId: buyerB.id, productId: productA.id, quantity: 10, priceAtAdd: 50, subtotal: 500 } });

        const [resA, resB] = await Promise.all([
            fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } }),
            fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bBToken}` } })
        ]);
        const finalP = await prisma.product.findUnique({ where: { id: productA.id } });
        console.log(`Test 9 (Atomic Race Prevention Data): finalP.quantity=${finalP.quantity}, resA=${resA.status}, resB=${resB.status}`);
        console.log("Test 9 (Atomic Race Prevention):", finalP.quantity === 5 && (resA.status === 400 || resB.status === 400) ? "Pass" : "Fail");

        // Test 10: Parent order propagation 
        let cResB = await fetch(`http://localhost:5002/api/farmer/orders/${t6Order.order.id}/status`, { method: 'PUT', headers: { 'Authorization': `Bearer ${fBToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CANCELLED' }) });
        let cResBJson = await cResB.json();

        let cResA = await fetch(`http://localhost:5002/api/farmer/orders/${t6Order.order.id}/status`, { method: 'PUT', headers: { 'Authorization': `Bearer ${fAToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CANCELLED' }) });
        let cResAJson = await cResA.json();

        const parentHistoryReq = await fetch(`http://localhost:5002/api/orders/${t6Order.order.id}`, { headers: { 'Authorization': `Bearer ${bAToken}` } });
        const parentHistory = await parentHistoryReq.json();
        console.log("Test 10 (Parent Status Propagation):", parentHistory.order.status === 'CANCELLED' ? "Pass" : "Fail");

        // Verify restoration metric (10 units each from Test 6)
        const checkRestored = await prisma.product.findUnique({ where: { id: productB.id } });
        console.log(`Verify Order Cancel Stock Data: productB.quantity=${checkRestored.quantity}`);
        console.log("Verify Order Cancel Stock Restoration:", checkRestored.quantity === 100 ? "Pass" : "Fail");

        // CLEANUP
        await prisma.cartItem.deleteMany({ where: { buyerId: { in: [buyerA.id, buyerB.id] } } });
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({ where: { farmerId: { in: [farmerA.id, farmerB.id] } } });
        await prisma.user.deleteMany({ where: { id: { in: [farmerA.id, farmerB.id, buyerA.id, buyerB.id] } } });

    } catch (e) {
        console.error("Critical Failure:", e);
    } finally {
        await prisma.$disconnect();
    }
}
runTests();
