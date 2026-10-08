require('dotenv').config();
const { storeCropPassportData, verifyConnection } = require('./src/blockchain/polygonService');

async function testBlockchain() {
    console.log("Starting blockchain verification test...");

    const isConnected = await verifyConnection();
    if (!isConnected) {
        console.error("Failed to connect to Polygon network");
        process.exit(1);
    }
    console.log("Connection verified.");

    const fakePassportId = "test_passport_" + Date.now();
    const testData = { dummy: "Hello FarmChain", timestamp: Date.now() };

    console.log(`Submitting test record... ID: ${fakePassportId}`);
    try {
        const result = await storeCropPassportData(fakePassportId, testData);
        console.log("Test successful!");
        console.log("Transaction Hash:", result.transactionHash);
        console.log("Data Hash:", result.dataHash);
        console.log("Network:", result.network);
    } catch (e) {
        console.error("Test failed:", e.message);
        process.exit(1);
    }
}

testBlockchain();
