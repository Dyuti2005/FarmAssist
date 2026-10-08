require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const ethers = require('ethers');

async function checkDatabase() {
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log("DATABASE: CONNECTED");
        const usersCount = await prisma.user.count().catch(() => null);
        if (usersCount !== null) {
            console.log(`DATABASE: MODEL ACCESSIBLE`);
        } else {
            console.log("DATABASE: MODEL INACCESSIBLE");
        }
        await prisma.$disconnect();
    } catch (err) {
        console.log("DATABASE: ERROR", err.message);
    }
}

async function checkPolygon() {
    try {
        const rpcUrl = process.env.POLYGON_RPC_URL;
        if (!rpcUrl) {
            console.log("POLYGON/ALCHEMY: MISCONFIGURED (NO RPC URL)");
            return;
        }
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const network = await provider.getNetwork();
        console.log("ALCHEMY/RPC: ACTIVE");
        console.log(`POLYGON_AMOY: WORKING (Chain ${network.chainId})`);

        if (process.env.POLYGON_PRIVATE_KEY) {
            const wallet = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY, provider);
            console.log(`POLYGON_WALLET: DETECTED (${await wallet.getAddress()})`);
        } else {
            console.log("POLYGON_WALLET: MISCONFIGURED");
        }

        const contractAddr = process.env.POLYGON_CONTRACT_ADDRESS;
        if (contractAddr) {
            const code = await provider.getCode(contractAddr);
            if (code === '0x') {
                console.log("POLYGON_CONTRACT: UNREACHABLE (No code at address)");
            } else {
                console.log("POLYGON_CONTRACT: REACHABLE");
            }
        } else {
            console.log("POLYGON_CONTRACT: MISCONFIGURED");
        }
    } catch (err) {
        console.log("POLYGON/ALCHEMY: ERROR", err.message);
    }
}

checkDatabase().then(checkPolygon);
