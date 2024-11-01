import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: [
        process.env.PRIVATE_KEY
          ? `0x${process.env.PRIVATE_KEY}`
          : "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
  },
};

export default config;
