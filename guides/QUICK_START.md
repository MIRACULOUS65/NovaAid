# NovaAid - Quick Start Guide

Get your Semaphore + Celo verification system running in 15 minutes!

## 🚀 Quick Installation

### Step 1: Install Dependencies

#### Frontend
```bash
cd NovaAid/FRONTEND/novaaid-app
npm install
```

#### Backend
```bash
cd NovaAid/BACKEND/novaaid-app-backend
npm install
```

#### Blockchain
```bash
cd NovaAid/BLOCKCHAIN/novaaid-app-blockchain
npm install
```

### Step 2: Configure Environment

#### Frontend (.env.local)
```env
# Copy from your existing .env.local
# Add these new variables:
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=
NEXT_PUBLIC_CELO_NETWORK=alfajores
BACKEND_API_URL=http://localhost:3001
```

#### Backend (.env)
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
CLERK_SECRET_KEY=your_clerk_secret
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=your_private_key
PORT=3001
```

#### Blockchain (.env)
```env
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=your_private_key
SERVER_WALLET_ADDRESS=0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151
```

### Step 3: Get Test CELO

1. Visit https://faucet.celo.org/alfajores
2. Enter your wallet address
3. Request test CELO and cUSD

### Step 4: Deploy Smart Contracts

```bash
cd NovaAid/BLOCKCHAIN/novaaid-app-blockchain
npm run compile
npm run deploy:alfajores
```

**Save the contract addresses!** You'll need them for the frontend.

### Step 5: Update Frontend Config

Edit `NovaAid/FRONTEND/novaaid-app/lib/celo/contracts.ts`:

```typescript
export const CONTRACTS = {
  alfajores: {
    verifiedPayments: '0xYourDeployedAddress', // From Step 4
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'
  }
};
```

### Step 6: Start Services

#### Terminal 1 - Backend
```bash
cd NovaAid/BACKEND/novaaid-app-backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd NovaAid/FRONTEND/novaaid-app
npm run dev
```

### Step 7: Test the System

1. Open http://localhost:3000
2. Sign in with Clerk
3. Go to Profile page
4. Click "Verify Now"
5. Connect MetaMask
6. Pay 0.01 CELO
7. Get verified badge! ✅

---

## 📋 What You Just Built

### Architecture Overview

```
┌──────────────┐
│   Frontend   │  ← User interacts here
│  (Next.js)   │
└──────┬───────┘
       │
       ├─────────────┬──────────────┐
       │             │              │
       ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Backend  │  │Blockchain│  │ Firebase │
│ (Node)   │  │  (Celo)  │  │          │
└──────────┘  └──────────┘  └──────────┘
```

### Key Features

✅ **Semaphore Identity**: Zero-knowledge identity commitments  
✅ **Merkle Tree**: Off-chain proof generation  
✅ **Celo Payments**: Blockchain verification fees  
✅ **Verified Badge**: On-chain verification status  
✅ **Privacy-First**: Salt never leaves client  

---

## 🎯 User Flow

### 1. Registration
- User signs up with Clerk
- Frontend generates Semaphore identity (client-side)
- Commitment sent to backend
- Stored in Firestore

### 2. Verification
- User clicks "Verify Now"
- Connects MetaMask wallet
- Pays 0.01 CELO verification fee
- Transaction recorded on blockchain
- Verified badge appears

### 3. Profile
- Verified badge displayed
- Status saved in Firestore
- Visible to all users

---

## 🔧 Common Commands

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run linter
```

### Backend
```bash
npm run dev          # Development with auto-reload
npm start            # Production server
npm test             # Run tests
```

### Blockchain
```bash
npm run compile              # Compile contracts
npm run deploy:alfajores     # Deploy to testnet
npm run deploy:mainnet       # Deploy to mainnet
npm test                     # Run contract tests
```

---

## 📁 Project Structure

```
NovaAid/
├── BACKEND/novaaid-app-backend/
│   ├── config/          # Firebase configuration
│   ├── middleware/      # Authentication
│   ├── routes/          # API endpoints
│   ├── utils/           # Merkle tree utilities
│   └── index.js         # Server entry point
│
├── BLOCKCHAIN/novaaid-app-blockchain/
│   ├── contracts/       # Solidity contracts
│   ├── scripts/         # Deployment scripts
│   └── deployments/     # Deployed addresses
│
└── FRONTEND/novaaid-app/
    ├── app/
    │   ├── api/         # Next.js API routes
    │   ├── profile/     # Profile page
    │   └── verification/# Verification page
    └── lib/
        ├── semaphore/   # Identity management
        └── celo/        # Blockchain interaction
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Install dependencies again
npm install
```

### "MetaMask not detected"
- Install MetaMask browser extension
- Refresh the page

### "Insufficient funds"
- Get test CELO from faucet
- Wait a few minutes for confirmation

### "Transaction failed"
- Check you're on Alfajores network
- Verify contract addresses are correct
- Ensure you have enough cUSD

### Backend won't start
- Check Firebase credentials
- Verify .env file exists
- Ensure port 3001 is available

---

## 🔐 Security Notes

### ⚠️ NEVER COMMIT:
- Private keys
- Firebase service account JSON
- Clerk secret keys
- .env files

### ✅ ALWAYS:
- Keep salt in localStorage only
- Use HTTPS in production
- Validate all inputs
- Rate limit API endpoints

---

## 📚 Next Steps

### For Development
1. Read `SEMAPHORE_CELO_IMPLEMENTATION.md` for details
2. Review smart contracts in `BLOCKCHAIN/contracts/`
3. Explore API endpoints in `BACKEND/routes/`
4. Customize UI in `FRONTEND/app/`

### For Production
1. Follow `DEPLOYMENT_GUIDE.md`
2. Deploy backend to Railway/Render
3. Deploy contracts to Celo mainnet
4. Deploy frontend to Vercel
5. Set up monitoring

### For Testing
1. Test on Alfajores testnet first
2. Get test CELO from faucet
3. Verify all flows work
4. Check Firestore data
5. Monitor transactions

---

## 💡 Tips & Best Practices

### Development
- Use separate wallets for testing
- Keep test CELO balance topped up
- Monitor backend logs
- Check Firestore regularly

### Security
- Never expose private keys
- Use environment variables
- Implement rate limiting
- Validate all inputs

### Performance
- Cache Merkle roots
- Batch Firestore operations
- Optimize contract gas usage
- Use CDN for frontend

---

## 🆘 Getting Help

### Documentation
- `README.md` files in each folder
- `SEMAPHORE_CELO_IMPLEMENTATION.md` for architecture
- `DEPLOYMENT_GUIDE.md` for production

### Resources
- [Celo Docs](https://docs.celo.org/)
- [Semaphore Docs](https://semaphore.appliedzkp.org/)
- [Clerk Docs](https://clerk.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Community
- Celo Discord: https://discord.gg/celo
- Semaphore Telegram: https://t.me/semaphore_protocol

---

## ✨ Features Implemented

- [x] Semaphore identity generation
- [x] Commitment registration
- [x] Merkle tree management
- [x] Celo wallet integration
- [x] Verification payment flow
- [x] Verified badge display
- [x] Profile page integration
- [x] Firestore persistence
- [x] Smart contract deployment
- [x] Complete documentation

---

## 🎉 You're All Set!

Your NovaAid verification system is ready to use!

**Test it now:**
1. Visit http://localhost:3000
2. Sign in
3. Go to verification page
4. Connect wallet and verify
5. See your verified badge!

**Questions?** Check the documentation or reach out for support.

Happy building! 🚀
