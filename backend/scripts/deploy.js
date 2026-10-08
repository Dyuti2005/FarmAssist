const hre = require("hardhat");

async function main() {
    console.log("Starting deployment...");
    // Using ethers v6 which is standard in latest hardhat
    const CropPassportRegistry = await hre.ethers.getContractFactory("CropPassportRegistry");
    const registry = await CropPassportRegistry.deploy();

    await registry.waitForDeployment();
    const address = await registry.getAddress();

    console.log("CropPassportRegistry deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
