# NovaAid Blockchain - Celo Smart Contracts

Smart contracts for NovaAid verification system on Celo blockchain.

## Contracts

### SemaphoreVerifier.sol
Verifies Semaphore zero-knowledge proofs.

**Note:** Current implementation is simplified for development. In production, use the official Semaphore verifier contract.

### VerifiedPayments.sol
Handles verification payments and tracks verified users on-chain.

**Features:**
- Accept verification fee payments in CELO
- Track verified users on-chain
- Prevent double verification
- Owner-controlled root updates
- Emergency withdrawal function

## Setup

### Prerequisites

- Node.js 18+
- Hardhat
- Celo wallet with test CELO (for Sepolia testnet)

### Installation

```bash
cd NovaAid/BLOCKCHAIN/novaaid-app-blockchain
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
```env
CELO_SEPOLIA_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=your_private_key_here
SERVER_WALLET_ADDRESS=0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151
```

### Get Test CELO

Visit the [Celo Alfajores Faucet](https://faucet.celo.org/alfajores) to get test CELO and cUSD.

## Compilation

```bash
npm run compile
```

## Deployment

### Deploy to Celo Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

### Deploy to Celo Mainnet

```bash
npm run deploy:mainnet
```

### Deployment Output

After deployment, contract addresses will be saved to:
- `deployments/sepolia-latest.json`
- `deployments/celo-latest.json`

Example output:
```json
{
  "network": "sepolia",
  "chainId": 11142220,
  "deployer": "0x...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "contracts": {
    "SemaphoreVerifier": "0x...",
    "VerifiedPayments": "0x..."
  },
  "configuration": {
    "serverWallet": "0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151",
    "verificationFee": "10000000000000000",
    "cusdAddress": "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
  }
}
```

## Contract Interaction

### Update Verification Fee

```javascript
const contract = await ethers.getContractAt("VerifiedPayments", contractAddress);
await contract.updateVerificationFee(ethers.parseEther("0.02"));
```

### Update Merkle Root

```javascript
const newRoot = "0x...";
await contract.updateRoot(newRoot);
```

### Check Verification Status

```javascript
const [isVerified, timestamp] = await contract.checkVerification(userAddress);
console.log(`Verified: ${isVerified}, At: ${new Date(timestamp * 1000)}`);
```

### Pay Verification Fee (User)

```javascript
// Approve cUSD first
const cusd = await ethers.getContractAt("IERC20", cusdAddress);
await cusd.approve(contractAddress, verificationFee);

// Pay verification fee
await contract.payVerificationFee();
```

## Testing

```bash
npm test
```

## Contract Addresses

### Alfajores Testnet
- **cUSD Token**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
- **SemaphoreVerifier**: (Deploy and update here)
- **VerifiedPayments**: (Deploy and update here)

### Celo Mainnet
- **cUSD Token**: `0x765DE816845861e75A25fCA122bb6898B8B1282a`
- **SemaphoreVerifier**: (Deploy and update here)
- **VerifiedPayments**: (Deploy and update here)

## Network Configuration

### Alfajores Testnet
- **Chain ID**: 44787 (0xaef3)
- **RPC**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://alfajores.celoscan.io
- **Faucet**: https://faucet.celo.org/alfajores

### Celo Mainnet
- **Chain ID**: 42220 (0xa4ec)
- **RPC**: https://forno.celo.org
- **Explorer**: https://celoscan.io

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Owner Functions**: Only owner can update root and fees
3. **Reentrancy**: Contract uses ReentrancyGuard
4. **Double Verification**: Prevented by checking `isVerified` mapping
5. **Nullifier Tracking**: Prevents proof replay attacks

## Verification on Block Explorer

After deployment, verify your contracts:

```bash
npx hardhat verify --network alfajores DEPLOYED_CONTRACT_ADDRESS "CONSTRUCTOR_ARG1" "CONSTRUCTOR_ARG2"
```

Example:
```bash
npx hardhat verify --network alfajores 0x123... 0xVerifierAddress 0xcUSDAddress 0xServerWallet "10000000000000000"
```

## Upgrading Contracts

To upgrade contracts:
1. Deploy new contract version
2. Update frontend configuration with new addresses
3. Migrate data if necessary
4. Update backend configuration

## Gas Optimization

- Verification fee payment: ~100,000 gas
- Root update: ~50,000 gas
- Check verification: ~30,000 gas (view function, no gas)

## Troubleshooting

### Deployment Fails
- Check you have enough CELO for gas
- Verify RPC endpoint is accessible
- Ensure private key is correct

### Transaction Reverts
- Check cUSD allowance is sufficient
- Verify user is not already verified
- Ensure contract has correct permissions

### MetaMask Issues
- Add Celo network manually if auto-add fails
- Check you're on the correct network
- Clear MetaMask activity data if stuck

## Resources

- [Celo Documentation](https://docs.celo.org/)
- [Semaphore Protocol](https://semaphore.appliedzkp.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## License

MIT
