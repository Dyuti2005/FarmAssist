const { ethers } = require('ethers');
const crypto = require('crypto');

const RPC_URL = process.env.POLYGON_RPC_URL;
const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.POLYGON_CONTRACT_ADDRESS;

// Minimal ABI strictly for the functions we need
const ABI = [
    "function registerPassport(string memory _internalPassportId, string memory _dataHash) public",
    "event PassportRegistered(string indexed internalPassportId, string dataHash, uint256 timestamp, address indexed submittingWallet)"
];

const verifyConnection = async () => {
    try {
        if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
            console.error("[Polygon] Missing configuration.");
            return false;
        }
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const network = await provider.getNetwork();
        console.log(`[Polygon] Connected to network: ${network.name}`);
        return true;
    } catch (error) {
        console.error(`[Polygon] Connection failed:`, error);
        return false;
    }
};

const storeCropPassportData = async (internalPassportId, passportData) => {
    try {
        if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
            throw new Error("Missing Polygon configuration");
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

        // Step 1: Create a deterministic hash of the sensitive data (we do NOT store raw data on-chain)
        const dataString = JSON.stringify(passportData);
        const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');

        console.log(`[Polygon] Submitting hash ${dataHash} for passport ${internalPassportId}...`);

        // Step 2: Submit transaction to Polygon Amoy
        const tx = await contract.registerPassport(internalPassportId, "0x" + dataHash);

        console.log(`[Polygon] Transaction submitted. Hash: ${tx.hash}`);

        // Wait for 1 confirmation
        const receipt = await tx.wait(1);
        console.log(`[Polygon] Transaction confirmed in block: ${receipt.blockNumber}`);

        return {
            transactionHash: tx.hash,
            dataHash: "0x" + dataHash,
            network: "Polygon Amoy",
            contractAddress: CONTRACT_ADDRESS
        };

    } catch (error) {
        console.error("[Polygon] Transaction failed:", error);
        throw new Error("Blockchain verification failed: " + error.message);
    }
};

module.exports = {
    verifyConnection,
    storeCropPassportData
};
