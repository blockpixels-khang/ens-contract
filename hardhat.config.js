require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
const dotenv = require('dotenv');
dotenv.config();

const BSC_ACCOUNTS = process.env.BSC_ACCOUNT.split(',');
const ETH_ACC = process.env.ETH_ACCOUNT.split(',');
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
      chainId: 97,
      accounts: BSC_ACCOUNTS,
      allowUnlimitedContractSize: true,
    },
    eth: {
      url: "https://rpc.ankr.com/eth",
      accounts: ETH_ACC,
    },
    bsc: {
      url: "https://bsc-dataseed.bnbchain.org",
      accounts: BSC_ACCOUNTS,
    },
    
  },

};

