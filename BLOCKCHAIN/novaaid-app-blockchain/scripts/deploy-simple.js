const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Import contract ABIs
const SemaphoreVerifier = require("../artifacts/contracts/SemaphoreVerifier.sol/SemaphoreVerifier.json");
const VerifiedPayments = require("../artifacts/contracts/VerifiedPayments.sol/VerifiedPayments.json");

async function main() {
  console.log("Starting deployment to Celo Alfajores Testnet");
  
  // Configuration
  const RPC_URL = process.env.CELO_SEPOLIA_RPC || "https://alfajores-forno.celo-testnet.org";
  const PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY;
  const SERVER_WALLET = process.env.SERVER_WALLET_ADDRESS || "0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151";
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  const VERIFICATION_FEE = ethers.parseEther("0.01");
  
  if (!PRIVATE_KEY) {
    throw new Error("OPERATOR_PRIVATE_KEY not found in .env file");
  }
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log("Deploying contracts with account:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  
  console.log("\nDeployment Configuration:");
  console.log("- Server Wallet:", SERVER_WALLET);
  console.log("- Verification Fee:", ethers.formatEther(VERIFICATION_FEE), "CELO");
  console.log("- cUSD Address:", CUSD_ADDRESS);
  
  // Deploy SemaphoreVerifier
  console.log("\n1. Deploying SemaphoreVerifier...");
  const VerifierFactory = new ethers.ContractFactory(
    SemaphoreVerifier.abi,
    SemaphoreVerifier.bytecode,
    wallet
  );
  const verifier = await VerifierFactory.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✓ SemaphoreVerifier deployed to:", verifierAddress);
  
  // Deploy VerifiedPayments
  console.log("\n2. Deploying VerifiedPayments...");
  const PaymentsFactory = new ethers.ContractFactory(
    VerifiedPayments.abi,
    VerifiedPayments.bytecode,
    wallet
  );
  const payments = await PaymentsFactory.deploy(
    verifierAddress,
    CUSD_ADDRESS,
    SERVER_WALLET,
    VERIFICATION_FEE
  );
  await payments.waitForDeployment();
  const paymentsAddress = await payments.getAddress();
  console.log("✓ VerifiedPayments deployed to:", paymentsAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: "alfajores",
    chainId: 44787,
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SemaphoreVerifier: verifierAddress,
      VerifiedPayments: paymentsAddress
    },
    configuration: {
      serverWallet: SERVER_WALLET,
      verificationFee: VERIFICATION_FEE.toString(),
      cusdAddress: CUSD_ADDRESS
    }
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const filename = `sepolia-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  
  // Also save as latest
  const latestPath = path.join(deploymentsDir, "sepolia-latest.json");
  fs.writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n✓ Deployment info saved to:", filepath);
  console.log("\n=== Deployment Summary ===");
  console.log("Network: Celo Alfajores Testnet");
  console.log("Chain ID: 44787");
  console.log("SemaphoreVerifier:", verifierAddress);
  console.log("VerifiedPayments:", paymentsAddress);
  console.log("\nNext steps:");
  console.log("1. Update .env with contract addresses");
  console.log("2. Update frontend configuration");
  console.log("3. Verify contracts on block explorer (optional)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
