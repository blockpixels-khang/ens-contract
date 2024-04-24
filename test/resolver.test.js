const { expect } = require("chai");
const { ethers } = require("hardhat");
const Resolver_abi = require("@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json");
const { SigningKey, defaultAbiCoder, hexConcat } = require("ethers/lib/utils");
const namehash = require('eth-ens-namehash');
describe("Resolver", async function () {
  let catgirlNFT = [];
  let nft;
  let airdropContract;
  let ownerAddress;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addr5;
  let vrfCoodinator;
  let catgirlToken;
  let setter;
  let farming;
  let dev;
  let baseKemiContract;
  let minter;
  let priceOracle;
  let wearableContract;
  let signer;
  let Resolver;
  const minterRole =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  const SETTER_ROLE =
    "0x61c92169ef077349011ff0b1383c894d86c5f0b41d986366b58a6cf31e93beda";

  function dnsName(name) {
    // strip leading and trailing .
    const n = name.replace(/^\.|\.$/gm, "");

    var bufLen = n === "" ? 1 : n.length + 2;
    var buf = Buffer.allocUnsafe(bufLen);

    let offset = 0;
    if (n.length) {
      const list = n.split(".");
      for (let i = 0; i < list.length; i++) {
        const len = buf.write(list[i], offset + 1);
        buf[offset] = len;
        offset += len + 1;
      }
    }
    buf[offset++] = 0;
    return (
      "0x" +
      buf.reduce(
        (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
        ""
      )
    );
  }

  before(async () => {
    // assign address
    [
      owner,
      addr1,
      addr2,
      addr3,
      setter,
      farming,
      dev,
      minter,
      signer,
      addr4,
      addr5,
    ] = await ethers.getSigners();
    ownerAddress = owner;

    Resolver = new ethers.utils.Interface(Resolver_abi.abi);
  });

  it("Check verify signature", async () => {
    const signingKey = new SigningKey(ethers.utils.randomBytes(32));
    const signingAddress = ethers.utils.computeAddress(signingKey.privateKey);
    const ResolverFactory = await ethers.getContractFactory("OffchainResolver");
    const resolverContract = await ResolverFactory.deploy("http://aaaaa", [
      owner.address,
      signingAddress,
      "0xF8eE099797D093Fbe2BF63CAce230556eA6cF202"
    ]);
    const iface = new ethers.utils.Interface(["function addr(bytes32) returns(address,string)"]);
    const TEST_ADDRESS = "0xCAfEcAfeCAfECaFeCaFecaFecaFECafECafeCaFe";
    const addrData = iface.encodeFunctionData("addr", [namehash.hash('test.eth')]);
    const callData = resolverContract.interface.encodeFunctionData("resolve", [dnsName('test.eth'), addrData]);
    // try {
    //   const result = await resolverContract.resolve(
    //     dnsName("test.eth"),
    //     callData
    //   );
    //   console.log(result);
    // } catch (e) {
    //  console.log('hahah')
    // }
    const expires = Math.floor(Date.now() / 1000 + 3600);

   
    const resultData = iface.encodeFunctionResult("addr", [TEST_ADDRESS, "HAHAHAHA"]);
    const callDataHash = await resolverContract.makeSignatureHash(resolverContract.address, expires, callData, resultData);
    const sig = signingKey.signDigest(callDataHash);


    const response = defaultAbiCoder.encode(['bytes', 'uint64', 'bytes'], [resultData, expires, hexConcat([sig.r, sig.s, sig.v])]);

    const encodedData = ethers.utils.defaultAbiCoder.encode(['bytes', 'address'], [callData, resolverContract.address]);


    console.log({
      response,
      encodedData
    })
    const res = await resolverContract.resolveWithProof(response, encodedData)
  });
});
