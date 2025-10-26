const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment to", hre.network.name);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Configuration
  const SERVER_WALLET = process.env.SERVER_WALLET_ADDRESS || "0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151";
  const VERIFICATION_FEE = hre.ethers.parseEther("0.01"); // 0.01 CELO
  
  // Get cUSD address based on network
  let CUSD_ADDRESS;
  if (hre.network.name === "sepolia") {
    CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  } else if (hre.network.name === "celo") {
    CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  } else {
    throw new Error("Unsupported network. Use 'sepolia' for testnet or 'celo' for mainnet.");
  }

  console.log("\nDeployment Configuration:");
  console.log("- Server Wallet:", SERVER_WALLET);
  console.log("- Verification Fee:", hre.ethers.formatEther(VERIFICATION_FEE), "CELO");
  console.log("- cUSD Address:", CUSD_ADDRESS);

  // Deploy SemaphoreVerifier
  console.log("\n1. Deploying SemaphoreVerifier...");
  const SemaphoreVerifier = await hre.ethers.getContractFactory("SemaphoreVerifier");
  const verifier = await SemaphoreVerifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✓ SemaphoreVerifier deployed to:", verifierAddress);

  // Deploy VerifiedPayments
  console.log("\n2. Deploying VerifiedPayments...");
  const VerifiedPayments = await hre.ethers.getContractFactory("VerifiedPayments");
  const payments = await VerifiedPayments.deploy(
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
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
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

  const filename = `${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  // Also save as latest
  const latestPath = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✓ Deployment info saved to:", filepath);
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
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
