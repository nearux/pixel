import "dotenv/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";

import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          viaIR: true,
        },
      },
    },
  },

  networks: {
    // Local development networks
    hardhat: {
      chainId: 31337,
      type: "edr-simulated",
    },

    // GIWA Sepolia Testnet
    giwaSepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.NEXT_PUBLIC_GIWA_SEPOLIA_RPC_URL as string,
      accounts: [process.env.NEXT_PUBLIC_GIWA_SEPOLIA_PRIVATE_KEY as string],
      chainId: 91342,
    },
  },

  // Path configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
