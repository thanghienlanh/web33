import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy AIModelNFT
  console.log("\nDeploying AIModelNFT...");
  const AIModelNFT = await ethers.getContractFactory("AIModelNFT");
  const aiModelNFT = await AIModelNFT.deploy();
  await aiModelNFT.waitForDeployment();
  const aiModelNFTAddress = await aiModelNFT.getAddress();
  console.log("AIModelNFT deployed to:", aiModelNFTAddress);

  // Deploy Marketplace
  console.log("\nDeploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(aiModelNFTAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("AIModelNFT:", aiModelNFTAddress);
  console.log("Marketplace:", marketplaceAddress);
  console.log("\nSave these addresses to your .env file!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

