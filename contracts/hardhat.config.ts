import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"

dotenv.config()

const PRIVATE_KEY_1 = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.8.24",
      },
      {
        version: "0.6.12",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts: [PRIVATE_KEY_1!],
    },
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC,
    //   accounts: [PRIVATE_KEY_1],
    // },
    assetchain_test: {
      url: "https://enugu-rpc.assetchain.org",
      accounts: [PRIVATE_KEY_1!],
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
      accounts: [PRIVATE_KEY_1!],
    },
  },
  etherscan: {
    apiKey: {
      assetchain_test: "abc",
    },
    customChains: [
      {
        network: "assetchain_test",
        chainId: 42421,
        urls: {
          apiURL: "https://scan-testnet.assetchain.org/api",
          browserURL: "https://scan-testnet.assetchain.org/",
        },
      },
    ],
  },
};

export default config;
