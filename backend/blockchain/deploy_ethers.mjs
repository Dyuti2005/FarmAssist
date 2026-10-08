import fs from "fs";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

async function main() {
    console.log("Starting pure ethers deployment...");
    const RPC_URL = process.env.POLYGON_RPC_URL;
    const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;

    if (!PRIVATE_KEY || !RPC_URL) {
        throw new Error("Missing .env variables");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const artifactPath = "./artifacts/contracts/CropPassportRegistry.sol/CropPassportRegistry.json";
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    console.log("Deploying contract...");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("Deployed to:", address);

    // Auto-update .env
    const envPath = "../.env";
    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(/POLYGON_CONTRACT_ADDRESS=".*"/, `POLYGON_CONTRACT_ADDRESS="${address}"`);
    fs.writeFileSync(envPath, envContent);

    console.log("Successfully updated .env with deployed address.");
}

main().catch(console.error);
