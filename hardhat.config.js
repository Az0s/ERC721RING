require("@nomicfoundation/hardhat-toolbox");

const dotenv = require("dotenv");
dotenv.config();

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    // mainnet: {
    //   url: API_URL,
    //   accounts: [PRIVATE_KEY],
    // },
    goerli: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
  },
  // settings: {
  //     optimizer: {
  //         enabled: true,
  //         runs: 200,
  //     },
  // },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
