# Installation Commands - Copy & Paste Ready

## 🚀 Quick Installation Guide

Follow these commands in order to get your system running.

---

## Step 1: Install Frontend Dependencies

```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app"
npm install @semaphore-protocol/identity@^4.0.0 @semaphore-protocol/proof@^4.0.0 @semaphore-protocol/group@^4.0.0 ethers@^6.9.0 @celo/contractkit@^6.0.0
```

---

## Step 2: Install Backend Dependencies

```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm install
```

---

## Step 3: Install Blockchain Dependencies

```bash
cd "d:\Refugee Lifeline\NovaAid\BLOCKCHAIN\novaaid-app-blockchain"
npm install
```

---

## Step 4: Configure Environment Variables

### Backend Configuration

```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
copy .env.example .env
```

Then edit `.env` with your values:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
CLERK_SECRET_KEY=your_clerk_secret_key
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=your_private_key
PORT=3001
```

### Blockchain Configuration

```bash
cd "d:\Refugee Lifeline\NovaAid\BLOCKCHAIN\novaaid-app-blockchain"
copy .env.example .env
```

Then edit `.env` with your values:
```env
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=your_private_key
SERVER_WALLET_ADDRESS=0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151
```

### Frontend Configuration

Add to your existing `.env.local`:
```env
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=
NEXT_PUBLIC_CELO_NETWORK=alfajores
BACKEND_API_URL=http://localhost:3001
```

---

## Step 5: Get Test CELO

1. Visit: https://faucet.celo.org/alfajores
2. Enter your wallet address
3. Request test CELO and cUSD
4. Wait for confirmation (usually 1-2 minutes)

---

## Step 6: Compile Smart Contracts

```bash
cd "d:\Refugee Lifeline\NovaAid\BLOCKCHAIN\novaaid-app-blockchain"
npm run compile
```

Expected output:
```
Compiled 2 Solidity files successfully
```

---

## Step 7: Deploy Smart Contracts to Alfajores

```bash
cd "d:\Refugee Lifeline\NovaAid\BLOCKCHAIN\novaaid-app-blockchain"
npm run deploy:alfajores
```

**IMPORTANT:** Save the contract addresses from the output!

Example output:
```
✓ SemaphoreVerifier deployed to: 0xABC123...
✓ VerifiedPayments deployed to: 0xDEF456...
```

---

## Step 8: Update Frontend with Contract Addresses

Edit `d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app\lib\celo\contracts.ts`:

Replace the contract addresses:
```typescript
export const CONTRACTS = {
  alfajores: {
    verifiedPayments: '0xYourDeployedAddress', // From Step 7
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'
  }
};
```

Also update `.env.local`:
```env
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=0xYourDeployedAddress
```

---

## Step 9: Start Backend Server

Open a new terminal:
```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm run dev
```

Expected output:
```
NovaAid Backend Server running on port 3001
Environment: development
Firebase Admin initialized successfully
```

Keep this terminal running!

---

## Step 10: Start Frontend Server

Open another new terminal:
```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app"
npm run dev
```

Expected output:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Step 11: Test the System

1. Open browser: http://localhost:3000
2. Sign in with Clerk
3. Navigate to Profile page
4. Click "Verify Now" button
5. Connect MetaMask wallet
6. Approve network switch to Celo Alfajores
7. Approve cUSD spending
8. Pay 0.01 CELO verification fee
9. Wait for transaction confirmation
10. See verified badge appear! ✅

---

## 🔍 Verification Checklist

After installation, verify:

- [ ] Frontend runs on http://localhost:3000
- [ ] Backend runs on http://localhost:3001
- [ ] Backend health check works: http://localhost:3001/health
- [ ] Smart contracts deployed to Alfajores
- [ ] Contract addresses updated in frontend
- [ ] MetaMask installed and connected
- [ ] Wallet has test CELO and cUSD
- [ ] Can sign in with Clerk
- [ ] Profile page loads correctly
- [ ] Verification page accessible
- [ ] Wallet connection works
- [ ] Network switching works
- [ ] Payment transaction succeeds
- [ ] Verified badge appears

---

## 🐛 Common Issues & Fixes

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend won't start
```bash
# Check if port 3001 is available
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID <process_id> /F
```

### "Insufficient funds" error
- Get more test CELO from faucet
- Wait a few minutes for faucet transaction
- Check balance in MetaMask

### "Transaction failed" error
- Ensure you're on Alfajores network
- Check contract addresses are correct
- Verify you have enough cUSD
- Try increasing gas limit

### MetaMask not connecting
- Refresh the page
- Disconnect and reconnect wallet
- Clear browser cache
- Try different browser

---

## 📊 Verify Installation

### Check Backend Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Check Frontend Build
```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app"
npm run build
```

Should complete without errors.

### Check Contract Deployment
Visit Celoscan:
```
https://alfajores.celoscan.io/address/YOUR_CONTRACT_ADDRESS
```

---

## 🎯 Next Steps After Installation

1. **Test the complete flow**
   - Sign up new user
   - Generate identity
   - Pay verification fee
   - Confirm verified badge

2. **Review the code**
   - Check backend routes
   - Review smart contracts
   - Understand frontend flow

3. **Customize as needed**
   - Adjust verification fee
   - Modify UI components
   - Add additional features

4. **Prepare for production**
   - Follow DEPLOYMENT_GUIDE.md
   - Deploy to mainnet when ready
   - Set up monitoring

---

## 📚 Additional Resources

- **Quick Start**: See `QUICK_START.md`
- **Full Implementation**: See `SEMAPHORE_CELO_IMPLEMENTATION.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **API Docs**: See `BACKEND/novaaid-app-backend/README.md`
- **Contract Docs**: See `BLOCKCHAIN/novaaid-app-blockchain/README.md`

---

## ✅ Installation Complete!

If all steps completed successfully:
- ✅ All dependencies installed
- ✅ Environment configured
- ✅ Contracts deployed
- ✅ Backend running
- ✅ Frontend running
- ✅ System tested

**You're ready to start developing!** 🚀

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error messages carefully
3. Verify all environment variables are set
4. Ensure you have test CELO
5. Check Firebase and Clerk configuration

---

**Last Updated**: October 25, 2025  
**Status**: Ready for Installation  
**Estimated Time**: 15-20 minutes
