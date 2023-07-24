const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  try {
    const NFT = await ethers.getContractFactory("BuidlNFT");
    const nft = await NFT.deploy("BuidlNFT", "BN");
    await nft.deployed();
    console.log("NFT Contract Address:", nft.address);

    const TOKEN = await ethers.getContractFactory("BuidlToken");
    const token = await TOKEN.deploy("BuidlToken", "BT");
    await token.deployed();
    console.log("Token Contract Address:", token.address);

    const STAKING = await ethers.getContractFactory("Staking");
    const staking = await STAKING.deploy(
      nft.address,
      token.address,
      "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"
    );
    await staking.deployed();
    console.log("Staking Contract Address:", staking.address);

    await hre.run("verify:verify", {
      address: nft.address,
      constructorArguments: ["BuidlNFT", "BNT"],
    });

    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: ["BuidlToken", "BTN"],
    });

    await hre.run("verify:verify", {
      address: staking.address,
      constructorArguments: [nft.address, token.address],
    });
  } catch (error) {
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
