import { ethers, config } from "hardhat";

const PRIVATE_KEYS: any = config.networks.localhost.accounts;

export async function main() {
  console.log(""); // readable console logging

  const provider = new ethers.JsonRpcProvider(config.networks.localhost.url);
  const wallet = new ethers.Wallet(PRIVATE_KEYS[0], provider);
  console.log("Deploying with account:", wallet.address);
  console.log(""); // readable console logging

  const bridgeContractFactory = await ethers.getContractFactory("TokenBridge");
  const bridgeContract = await bridgeContractFactory.connect(wallet).deploy();
  await bridgeContract.waitForDeployment();
  const bridgeContractAddress = bridgeContract.target;
  console.log("Bridge contract was deployed to:", bridgeContractAddress);
  console.log(""); // readable console logging

  const tokenContractFactory = await ethers.getContractFactory("WERC20");
  const tokenContract = await tokenContractFactory.connect(wallet).deploy(
    bridgeContractAddress, 
    100000000000000000000n, 
    "KrasiToken", 
    "KRT"
  );
  await tokenContract.waitForDeployment();
  const tokenContractAddress = tokenContract.target;
  console.log("Token contract was deployed to:", tokenContractAddress);
  console.log(""); // readable console logging

  const tokenContractOwner = await tokenContract.owner();

  return {
    bridgeAddress: bridgeContractAddress,
    tokenAddress: tokenContractAddress,
    tokenOwner: tokenContractOwner
  };
}
