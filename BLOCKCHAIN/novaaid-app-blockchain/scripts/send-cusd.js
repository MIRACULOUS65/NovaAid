const { ethers } = require("ethers");
require("dotenv").config();

// ERC20 ABI for cUSD token
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

async function main() {
  console.log("Sending test cUSD...\n");
  
  // Configuration
  const RPC_URL = process.env.CELO_SEPOLIA_RPC || "https://alfajores-forno.celo-testnet.org";
  const PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY;
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  
  if (!PRIVATE_KEY) {
    throw new Error("OPERATOR_PRIVATE_KEY not found in .env file");
  }
  
  // Get recipient address from command line or use default
  const recipientAddress = process.argv[2];
  
  if (!recipientAddress) {
    console.error("Usage: node scripts/send-cusd.js <RECIPIENT_ADDRESS>");
    console.error("Example: node scripts/send-cusd.js 0x1234567890123456789012345678901234567890");
    process.exit(1);
  }
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log("Sender wallet:", wallet.address);
  console.log("Recipient:", recipientAddress);
  
  // Get cUSD contract
  const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, wallet);
  
  // Check sender balance
  const senderBalance = await cusdContract.balanceOf(wallet.address);
  console.log("Sender cUSD balance:", ethers.formatEther(senderBalance), "cUSD");
  
  // Amount to send (1 cUSD)
  const amount = ethers.parseEther("1.0");
  console.log("\nSending:", ethers.formatEther(amount), "cUSD");
  
  if (senderBalance < amount) {
    console.error("\n❌ Insufficient cUSD balance in sender wallet!");
    console.error("Please get cUSD from the faucet first:");
    console.error("https://faucet.celo.org/alfajores");
    process.exit(1);
  }
  
  // Send cUSD
  console.log("\nSending transaction...");
  const tx = await cusdContract.transfer(recipientAddress, amount);
  console.log("Transaction hash:", tx.hash);
  
  console.log("Waiting for confirmation...");
  await tx.wait();
  
  // Check new balances
  const newSenderBalance = await cusdContract.balanceOf(wallet.address);
  const recipientBalance = await cusdContract.balanceOf(recipientAddress);
  
  console.log("\n✅ Transfer successful!");
  console.log("Sender new balance:", ethers.formatEther(newSenderBalance), "cUSD");
  console.log("Recipient balance:", ethers.formatEther(recipientBalance), "cUSD");
  console.log("\nView on explorer:");
  console.log(`https://alfajores.celoscan.io/tx/${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
