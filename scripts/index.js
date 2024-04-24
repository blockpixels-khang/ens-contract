const { getContractAddress } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-ethers");


(async () => {
  try {
    const ResolverFactory = await ethers.getContractFactory("OffchainResolver");
    const resolverContract = await ResolverFactory.deploy("https://dev-api.kemi.id/ens/{sender}/{data}.json", [
      "0xF8eE099797D093Fbe2BF63CAce230556eA6cF202"
    ]);
    console.log(resolverContract);
  } catch (e) {
    console.log(e);
  }
})();


