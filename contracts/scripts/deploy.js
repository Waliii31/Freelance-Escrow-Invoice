/**
 * Deployment Script for Freelance Escrow Protocol on BOT Chain Mainnet
 * Network: BOT Chain Mainnet
 * RPC: https://rpc.botchain.ai
 * Chain ID: 677
 * Block Explorer: https://scan.botchain.ai
 * 
 * Usage:
 * npx hardhat run contracts/scripts/deploy.js --network botchain
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("==================================================");
  console.log("DEPLOYING TACTILE BRUTALISM FREELANCE ESCROW PROTOCOL");
  console.log("Network: BOT Chain Mainnet (Chain ID 677)");
  console.log("Deployer Address:", deployer.address);
  console.log("==================================================");

  // 1. Deploy Mock USDC (or use existing stablecoin address on BOT Chain)
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log(`[+] MockUSDC Deployed: ${usdcAddress}`);

  // 2. Deploy FreelanceEscrow
  const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");
  const escrow = await FreelanceEscrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log(`[+] FreelanceEscrow Deployed: ${escrowAddress}`);

  console.log("==================================================");
  console.log("BOT CHAIN SCAN VERIFICATION:");
  console.log(`https://scan.botchain.ai/address/${escrowAddress}`);
  console.log("==================================================");
  console.log("CONFIG FOR .env OR src/utils/contracts.ts:");
  console.log(`VITE_ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log(`VITE_USDC_CONTRACT_ADDRESS=${usdcAddress}`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
