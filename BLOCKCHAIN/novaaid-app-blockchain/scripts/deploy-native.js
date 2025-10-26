const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Import contract ABIs
const SemaphoreVerifier = require("../artifacts/contracts/SemaphoreVerifier.sol/SemaphoreVerifier.json");
const VerifiedPaymentsNative = require("../artifacts/contracts/VerifiedPaymentsNative.sol/VerifiedPaymentsNative.json");

async function main() {
  console.log("Starting deployment to Celo Alfajores Testnet (Native CELO)");
  
  // Configuration
  const RPC_URL = process.env.CELO_SEPOLIA_RPC || "https://alfajores-forno.celo-testnet.org";
  const PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY;
  const SERVER_WALLET = process.env.SERVER_WALLET_ADDRESS || "0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151";
  const VERIFICATION_FEE = ethers.parseEther("0.01"); // 0.01 CELO
  
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
  console.log("- Payment Method: Native CELO (no token required)");
  
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
  
  // Deploy VerifiedPaymentsNative
  console.log("\n2. Deploying VerifiedPaymentsNative...");
  const PaymentsFactory = new ethers.ContractFactory(
    VerifiedPaymentsNative.abi,
    VerifiedPaymentsNative.bytecode,
    wallet
  );
  const payments = await PaymentsFactory.deploy(
    verifierAddress,
    SERVER_WALLET,
    VERIFICATION_FEE
  );
  await payments.waitForDeployment();
  const paymentsAddress = await payments.getAddress();
  console.log("✓ VerifiedPaymentsNative deployed to:", paymentsAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: "alfajores",
    chainId: 44787,
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
    paymentMethod: "native-celo",
    contracts: {
      SemaphoreVerifier: verifierAddress,
      VerifiedPaymentsNative: paymentsAddress
    },
    configuration: {
      serverWallet: SERVER_WALLET,
      verificationFee: VERIFICATION_FEE.toString()
    }
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const filename = `native-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  
  // Also save as latest
  const latestPath = path.join(deploymentsDir, "native-latest.json");
  fs.writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n✓ Deployment info saved to:", filepath);
  console.log("\n=== Deployment Summary ===");
  console.log("Network: Celo Alfajores Testnet");
  console.log("Chain ID: 44787");
  console.log("Payment Method: Native CELO (no cUSD needed!)");
  console.log("SemaphoreVerifier:", verifierAddress);
  console.log("VerifiedPaymentsNative:", paymentsAddress);
  console.log("\nNext steps:");
  console.log("1. Update .env with contract addresses");
  console.log("2. Update frontend configuration");
  console.log("3. Users can now pay with CELO directly!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
