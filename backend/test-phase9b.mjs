import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const RZP_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_dummy';

async function runTests() {
    console.log("Starting Phase 9B Validation Tests (Razorpay Integration)...\n");

    try {
        const randId = Math.floor(Math.random() * 10000);

        // Setup
        const farmer = await prisma.user.create({ data: { name: "9B Farmer", phone: `91887${randId}`, passwordHash: "dummy", role: "FARMER" } });
        const buyerA = await prisma.user.create({ data: { name: "9B Buyer A", phone: `91998${randId}`, passwordHash: "dummy", role: "BUYER" } });
        const buyerB = await prisma.user.create({ data: { name: "9B Buyer B", phone: `91999${randId}`, passwordHash: "dummy", role: "BUYER" } });

        const product = await prisma.product.create({
            data: { farmer: { connect: { id: farmer.id } }, productName: "9B Grapes", quantity: 100, price: 50, unit: "kg", status: "AVAILABLE" }
        });

        const fToken = jwt.sign({ userId: farmer.id, role: "FARMER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bAToken = jwt.sign({ userId: buyerA.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });
        const bBToken = jwt.sign({ userId: buyerB.id, role: "BUYER" }, process.env.JWT_SECRET || 'supersecretjwtkeyforfarmchain2026', { expiresIn: '1h' });

        // Setup an order for Buyer A
        await prisma.cartItem.create({ data: { buyerId: buyerA.id, productId: product.id, quantity: 10, priceAtAdd: 50, subtotal: 500 } });
        const orderResA = await fetch(`http://localhost:5002/api/orders`, { method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}` } });
        const orderData = await orderResA.json();

        if (!orderData.success) {
            throw new Error("Initial order failed to create.");
        }

        const orderIdA = orderData.order.id;

        // Validation Flags
        let pass = true;

        // Test 1, 2, 3: Create Payment intent, check Rzp Order ID generated securely
        console.log("--- Test 1, 2, 3: Razorpay Generation & Manipulation Rejection ---");
        const payRes1 = await fetch(`http://localhost:5002/api/payments/order/${orderIdA}/create`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 999999, status: 'PAID' }) // Attack: Frontend attempt
        });
        const pay1 = await payRes1.json();

        if (!pay1.success) {
            console.error("Critical: Initial Razorpay Creation Failed!", pay1);
            throw new Error("Initial Razorpay order generation failed.");
        }

        const paymentDb = await prisma.payment.findUnique({ where: { id: pay1.payment.id } });

        console.log("Buyer A creates payment intent:", pay1.success);
        console.log("Razorpay TEST Order ID stored in PostgreSQL?", !!paymentDb.razorpayOrderId);
        console.log("Amount matches EXACT Order (₹500.0) blocking injection?", paymentDb.amount === 500);

        if (!pay1.success || !paymentDb.razorpayOrderId || paymentDb.amount !== 500) pass = false;

        const rzpOrderId = paymentDb.razorpayOrderId;
        const mockRzpPaymentId = `pay_fake_${randId}`;

        // Test 5: Invalid Signature
        console.log("\n--- Test 5: Invalid Razorpay Signature ---");
        const invalidVerifyRes = await fetch(`http://localhost:5002/api/payments/verify`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderIdA,
                razorpay_order_id: rzpOrderId,
                razorpay_payment_id: mockRzpPaymentId,
                razorpay_signature: "invalid_crypto_hash_malicious"
            })
        });
        const invalidData = await invalidVerifyRes.json();
        console.log("Safely blocked verifying payment?", invalidVerifyRes.status === 400 && !invalidData.success);
        if (invalidVerifyRes.status !== 400) pass = false;

        // Restore to PENDING for subsequent tests since Invalid marked it FAILED defensively!
        await prisma.payment.update({ where: { id: paymentDb.id }, data: { status: 'PENDING' } });

        // Test 6: Cross-tenant verification blocking
        console.log("\n--- Test 6: Buyer A cannot verify Buyer B's payment ---");
        const fakeValidSigForB = crypto.createHmac('sha256', RZP_SECRET).update(`${rzpOrderId}|${mockRzpPaymentId}`).digest('hex');

        const bBAccessRes = await fetch(`http://localhost:5002/api/payments/verify`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bBToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderIdA,
                razorpay_order_id: rzpOrderId,
                razorpay_payment_id: mockRzpPaymentId,
                razorpay_signature: fakeValidSigForB
            })
        });
        console.log("Strictly blocked Buyer B? (403)", bBAccessRes.status === 403);
        if (bBAccessRes.status !== 403) pass = false;

        // Test 8: Farmer accesses verification
        console.log("\n--- Test 8: Farmer blocked from accessing Buyer workflows ---");
        const farmRes = await fetch(`http://localhost:5002/api/payments/verify`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${fToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        console.log("Farmer cleanly rejected (403)", farmRes.status === 403);
        if (farmRes.status !== 403) pass = false;

        // Test 4: Valid Razorpay signature changes Payment -> PAID
        console.log("\n--- Test 4: Valid Signature Success State Transition ---");
        // We will generate exactly the HMAC hash using our RZP_SECRET
        const validSig = crypto.createHmac('sha256', RZP_SECRET).update(`${rzpOrderId}|${mockRzpPaymentId}`).digest('hex');
        const validVerifyRes = await fetch(`http://localhost:5002/api/payments/verify`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderIdA,
                razorpay_order_id: rzpOrderId,
                razorpay_payment_id: mockRzpPaymentId,
                razorpay_signature: validSig
            })
        });

        const finalP = await prisma.payment.findUnique({ where: { id: paymentDb.id } });
        console.log("Valid signature accepted?", validVerifyRes.status === 200);
        console.log("PostgreSQL mutated to PAID?", finalP.status === 'PAID');
        if (validVerifyRes.status !== 200 || finalP.status !== 'PAID') pass = false;

        // Test 7: Duplicate Payment confirmation is ignored
        console.log("\n--- Test 7: Duplicate Re-Validation Protection ---");
        const duplicateRes = await fetch(`http://localhost:5002/api/payments/verify`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${bAToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderIdA, razorpay_order_id: rzpOrderId, razorpay_payment_id: mockRzpPaymentId, razorpay_signature: validSig })
        });
        console.log("Blocked accurately duplicate execution (400)?", duplicateRes.status === 400);
        if (duplicateRes.status !== 400) pass = false;

        // Test 9: Orders intact
        console.log("\n--- Test 9: Orders untouched safely ---");
        const finalProductCheck = await prisma.product.findUnique({ where: { id: product.id } });
        console.log("Product deducted exactly (100 -> 90)?", finalProductCheck.quantity === 90);
        if (finalProductCheck.quantity !== 90) pass = false;

        console.log("\n>>> ALL PHASE 9B TESTS PASSED:", pass);

        // CLEANUP
        await prisma.payment.deleteMany({ where: { id: paymentDb.id } });
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({ where: { id: product.id } });
        await prisma.user.deleteMany({ where: { id: { in: [farmer.id, buyerA.id, buyerB.id] } } });

    } catch (e) {
        console.error("Critical Failure:", e);
    } finally {
        await prisma.$disconnect();
    }
}
runTests();
