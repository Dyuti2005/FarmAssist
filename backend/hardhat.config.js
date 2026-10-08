require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
    solidity: "0.8.24",
    networks: {
        amoy: {
            url: process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
            accounts: process.env.POLYGON_PRIVATE_KEY ? [process.env.POLYGON_PRIVATE_KEY] : []
        }
    }
};
