# Semaphore + Celo Integration - Complete Implementation Guide

## Overview

This document provides a complete guide for the Semaphore + Celo verification system implemented in NovaAid. The system allows users to verify their identity on the Celo blockchain using zero-knowledge proofs and pay a verification fee.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
│                 │
│ - Identity Gen  │
│ - Wallet Connect│
│ - Payment UI    │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│   Backend       │  │   Blockchain    │
│  (Node.js)      │  │    (Celo)       │
│                 │  │                 │
│ - Commitments   │  │ - Verifier      │
│ - Merkle Tree   │  │ - Payments      │
│ - Verification  │  │ - On-chain Data │
└────────┬────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Firestore     │
│                 │
│ - Users         │
│ - Commitments   │
│ - Merkle Roots  │
│ - Verifications │
└─────────────────┘
```

## Folder Structure

```
NovaAid/
├── BACKEND/
│   └── novaaid-app-backend/
│       ├── config/
│       │   └── firebase.js
│       ├── middleware/
│       │   └── auth.js
│       ├── routes/
│       │   ├── commitment.js
│       │   ├── merkle.js
│       │   └── verification.js
│       ├── utils/
│       │   └── merkleTree.js
│       ├── index.js
│       ├── package.json
│       └── README.md
│
├── BLOCKCHAIN/
│   └── novaaid-app-blockchain/
│       ├── contracts/
│       │   ├── SemaphoreVerifier.sol
│       │   └── VerifiedPayments.sol
│       ├── scripts/
│       │   └── deploy.js
│       ├── deployments/
│       ├── hardhat.config.js
│       ├── package.json
│       └── README.md
│
└── FRONTEND/
    └── novaaid-app/
        ├── app/
        │   ├── api/
        │   │   ├── commitment/register/
        │   │   └── verification/
        │   │       ├── status/
        │   │       └── record/
        │   ├── profile/
        │   │   └── page.tsx
        │   └── verification/
        │       └── page.tsx
        ├── lib/
        │   ├── semaphore/
        │   │   └── identity.ts
        │   └── celo/
        │       └── contracts.ts
        └── package.json
```

## Implementation Flow

### 1. User Registration Flow

```
1. User signs up with Clerk
2. Frontend generates Semaphore identity (client-side)
   - Generate random salt
   - Create identity from salt
   - Compute commitment
   - Store salt in localStorage (NEVER send to server)
3. Frontend sends commitment to backend
4. Backend stores commitment in Firestore
5. Backend rebuilds Merkle tree
6. Backend saves new Merkle root
```

### 2. Verification Payment Flow

```
1. User clicks "Verify Now" button
2. User connects MetaMask wallet
3. Frontend switches to Celo Alfajores network
4. User approves cUSD spending
5. Frontend calls smart contract payVerificationFee()
6. Transaction is sent to blockchain
7. Smart contract:
   - Checks user not already verified
   - Transfers cUSD to server wallet
   - Marks user as verified
   - Emits UserVerified event
8. Frontend records verification in backend
9. Backend updates Firestore user document
10. User gets verified badge on profile
```

### 3. Proof Generation Flow (Advanced)

```
1. User has registered commitment
2. Backend provides Merkle proof for commitment
3. Frontend generates Semaphore proof:
   - Uses identity (from localStorage)
   - Uses Merkle proof
   - Uses signal (payment action)
   - Generates nullifier
4. Frontend calls payWithProof() with proof
5. Smart contract verifies proof
6. If valid, processes payment
7. Nullifier prevents replay attacks
```

## Key Components

### Frontend Components

#### `/app/verification/page.tsx`
Main verification page with:
- Wallet connection UI
- Network switching
- Payment processing
- Status display

#### `/lib/semaphore/identity.ts`
Identity management:
- Generate random salt
- Create Semaphore identity
- Store/retrieve from localStorage
- Never expose salt to server

#### `/lib/celo/contracts.ts`
Blockchain interaction:
- Contract ABIs
- Network configuration
- Helper functions for contract calls

### Backend Components

#### `/routes/commitment.js`
- `POST /api/commitment/register` - Register commitment
- `GET /api/commitment/check` - Check if user has commitment

#### `/routes/merkle.js`
- `GET /api/merkle/root` - Get latest Merkle root
- `GET /api/merkle/proof/:commitment` - Get proof for commitment
- `POST /api/merkle/rebuild` - Rebuild tree

#### `/routes/verification.js`
- `POST /api/verification/record` - Record successful verification
- `GET /api/verification/status` - Check verification status

#### `/utils/merkleTree.js`
Merkle tree utilities:
- Build tree from commitments
- Generate proofs
- Save/retrieve roots

### Smart Contracts

#### `SemaphoreVerifier.sol`
Simplified verifier for development. In production, use official Semaphore verifier.

#### `VerifiedPayments.sol`
Main payment contract:
- Accept verification fees
- Track verified users
- Prevent double verification
- Owner-controlled configuration

## Installation & Setup

### 1. Backend Setup

```bash
cd NovaAid/BACKEND/novaaid-app-backend
npm install
cp .env.example .env
# Edit .env with your credentials
# Add serviceAccountKey.json
npm run dev
```

### 2. Blockchain Setup

```bash
cd NovaAid/BLOCKCHAIN/novaaid-app-blockchain
npm install
cp .env.example .env
# Edit .env with your private key
npm run compile
npm run deploy:alfajores
# Note the deployed contract addresses
```

### 3. Frontend Setup

```bash
cd NovaAid/FRONTEND/novaaid-app
npm install
# Update .env.local with contract addresses
npm run dev
```

## Environment Variables

### Backend (.env)
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
CLERK_SECRET_KEY=sk_test_...
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0x...
PORT=3001
```

### Blockchain (.env)
```env
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0x...
SERVER_WALLET_ADDRESS=0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=0x...
NEXT_PUBLIC_CELO_NETWORK=alfajores
BACKEND_API_URL=http://localhost:3001
```

## Testing Checklist

### Unit Tests
- [ ] Identity generation is deterministic
- [ ] Commitment format is valid
- [ ] Merkle tree builds correctly
- [ ] Proof generation works
- [ ] Contract functions execute

### Integration Tests
- [ ] User can register commitment
- [ ] Backend stores commitment correctly
- [ ] Merkle root updates
- [ ] Wallet connects successfully
- [ ] Network switching works
- [ ] Payment transaction succeeds
- [ ] Verification status updates
- [ ] Verified badge appears

### Security Tests
- [ ] Salt never sent to server
- [ ] Commitments are unique per user
- [ ] Double verification prevented
- [ ] Nullifier prevents replay
- [ ] Only owner can update root
- [ ] JWT authentication works

## Deployment Steps

### 1. Deploy Backend
```bash
# Set up on your hosting platform (Railway, Render, etc.)
# Configure environment variables
# Upload Firebase credentials securely
# Start service
```

### 2. Deploy Smart Contracts
```bash
# For testnet
npm run deploy:alfajores

# For mainnet (when ready)
npm run deploy:mainnet

# Note contract addresses
# Verify on block explorer
```

### 3. Deploy Frontend
```bash
# Update contract addresses in .env.local
# Build application
npm run build

# Deploy to Vercel/Netlify
# Configure environment variables
```

### 4. Post-Deployment
- [ ] Test end-to-end flow on testnet
- [ ] Monitor backend logs
- [ ] Check Firestore data
- [ ] Verify transactions on explorer
- [ ] Test with real users
- [ ] Set up monitoring/alerts

## Security Best Practices

### Client-Side
1. **Never expose salt**: Salt stays in localStorage only
2. **Validate inputs**: Check commitment format before sending
3. **Secure storage**: Use secure localStorage practices
4. **Clear on logout**: Option to clear identity on logout

### Server-Side
1. **JWT validation**: Always verify Clerk tokens
2. **Rate limiting**: Prevent spam registrations
3. **Input validation**: Validate all commitment formats
4. **HTTPS only**: Use secure connections
5. **CORS configuration**: Restrict to your domain

### Smart Contract
1. **Access control**: Owner-only functions
2. **Reentrancy guard**: Prevent reentrancy attacks
3. **Double-spend prevention**: Check verification status
4. **Nullifier tracking**: Prevent proof replay
5. **Emergency functions**: Owner can withdraw if needed

## Troubleshooting

### Common Issues

#### "MetaMask not installed"
- User needs to install MetaMask extension
- Provide link to metamask.io

#### "Insufficient cUSD balance"
- User needs test cUSD from faucet
- Provide link to faucet.celo.org

#### "Transaction failed"
- Check gas limits
- Verify allowance is set
- Ensure user not already verified

#### "Commitment already exists"
- User already registered
- Check if they cleared localStorage
- May need to use existing commitment

#### "Firebase connection error"
- Verify service account JSON
- Check Firestore permissions
- Ensure collections exist

## Future Enhancements

1. **Full Semaphore Integration**: Use official verifier contract
2. **Batch Verification**: Verify multiple users at once
3. **Proof Caching**: Cache proofs for faster verification
4. **Mobile Support**: Add WalletConnect for mobile wallets
5. **Multi-chain**: Support other EVM chains
6. **Governance**: Community-controlled verification fees
7. **Reputation System**: Build on verified status
8. **Privacy Features**: Enhanced anonymity options

## Resources

- [Semaphore Documentation](https://semaphore.appliedzkp.org/)
- [Celo Documentation](https://docs.celo.org/)
- [Clerk Documentation](https://clerk.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## Support

For issues or questions:
1. Check this documentation
2. Review README files in each folder
3. Check GitHub issues
4. Contact development team

## License

MIT License - See LICENSE file for details
