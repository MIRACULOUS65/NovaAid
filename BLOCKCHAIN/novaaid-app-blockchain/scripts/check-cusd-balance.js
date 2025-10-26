const { ethers } = require("ethers");
require("dotenv").config();

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

async function main() {
  const RPC_URL = process.env.CELO_SEPOLIA_RPC || "https://alfajores-forno.celo-testnet.org";
  const PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY;
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, provider);
  
  console.log("Checking deployer wallet:", wallet.address);
  
  const celoBalance = await provider.getBalance(wallet.address);
  const cusdBalance = await cusdContract.balanceOf(wallet.address);
  
  console.log("CELO balance:", ethers.formatEther(celoBalance), "CELO");
  console.log("cUSD balance:", ethers.formatEther(cusdBalance), "cUSD");
}

main().catch(console.error);
