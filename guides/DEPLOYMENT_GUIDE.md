# NovaAid - Complete Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- [x] Node.js 18+ installed
- [x] Firebase project created
- [x] Clerk account set up
- [x] MetaMask wallet with test CELO
- [x] Git repository access
- [x] Hosting accounts (Vercel, Railway, etc.)

## Step-by-Step Deployment

### Phase 1: Backend Deployment

#### 1.1 Prepare Backend

```bash
cd NovaAid/BACKEND/novaaid-app-backend
npm install
```

#### 1.2 Configure Environment

Create `.env` file:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_FRONTEND_API=clerk.your-domain.com
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0xyourprivatekey
PORT=3001
NODE_ENV=production
```

#### 1.3 Add Firebase Credentials

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `serviceAccountKey.json` in backend root
4. **NEVER commit this file to Git**

#### 1.4 Deploy Backend (Railway Example)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables via Railway dashboard
# Upload serviceAccountKey.json content as env var

# Deploy
railway up
```

Alternative platforms:
- **Render**: Connect GitHub repo, set env vars
- **Heroku**: Use Heroku CLI, set config vars
- **DigitalOcean**: Use App Platform

#### 1.5 Note Backend URL

Save your backend URL (e.g., `https://your-app.railway.app`)

---

### Phase 2: Blockchain Deployment

#### 2.1 Prepare Blockchain

```bash
cd NovaAid/BLOCKCHAIN/novaaid-app-blockchain
npm install
```

#### 2.2 Get Test CELO

1. Visit [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
2. Enter your wallet address
3. Request test CELO and cUSD
4. Wait for confirmation

#### 2.3 Configure Environment

Create `.env` file:
```env
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0xyourprivatekey
SERVER_WALLET_ADDRESS=0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151
```

#### 2.4 Compile Contracts

```bash
npm run compile
```

#### 2.5 Deploy to Alfajores

```bash
npm run deploy:alfajores
```

Expected output:
```
Starting deployment to alfajores
Deploying contracts with account: 0x...
Account balance: 5.0 CELO

Deployment Configuration:
- Server Wallet: 0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151
- Verification Fee: 0.01 CELO
- cUSD Address: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

1. Deploying SemaphoreVerifier...
✓ SemaphoreVerifier deployed to: 0xABC123...

2. Deploying VerifiedPayments...
✓ VerifiedPayments deployed to: 0xDEF456...

✓ Deployment info saved to: deployments/alfajores-1234567890.json

=== Deployment Summary ===
Network: alfajores
SemaphoreVerifier: 0xABC123...
VerifiedPayments: 0xDEF456...
```

#### 2.6 Save Contract Addresses

Copy the deployed contract addresses. You'll need them for frontend configuration.

#### 2.7 Verify Contracts (Optional)

```bash
npx hardhat verify --network alfajores 0xDEF456... "0xABC123..." "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" "0x3bE3f44cCFF04b0DBe03ADe00710f35eBc387151" "10000000000000000"
```

---

### Phase 3: Frontend Deployment

#### 3.1 Install Dependencies

```bash
cd NovaAid/FRONTEND/novaaid-app
npm install
```

#### 3.2 Update Environment Variables

Update `.env.local`:
```env
# Existing Clerk & Firebase vars...

# Add these new variables:
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=0xDEF456...
NEXT_PUBLIC_SEMAPHORE_VERIFIER_ADDRESS=0xABC123...
NEXT_PUBLIC_CELO_NETWORK=alfajores
BACKEND_API_URL=https://your-backend.railway.app
```

#### 3.3 Update Contract Configuration

Edit `lib/celo/contracts.ts`:
```typescript
export const CONTRACTS = {
  alfajores: {
    verifiedPayments: '0xDEF456...', // Your deployed address
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'
  }
};
```

#### 3.4 Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- [ ] Login works
- [ ] Profile page loads
- [ ] Verification page accessible
- [ ] Wallet connection works

#### 3.5 Build for Production

```bash
npm run build
```

Fix any build errors before proceeding.

#### 3.6 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or use Vercel Dashboard:
1. Import Git repository
2. Configure environment variables
3. Deploy

#### 3.7 Configure Environment Variables on Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

Add all variables from `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PRIVATE_KEY` (formatted correctly)
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS`
- `NEXT_PUBLIC_SEMAPHORE_VERIFIER_ADDRESS`
- `NEXT_PUBLIC_CELO_NETWORK`
- `BACKEND_API_URL`

---

### Phase 4: Post-Deployment Configuration

#### 4.1 Update Clerk Settings

1. Go to Clerk Dashboard
2. Add production domain to allowed origins
3. Update redirect URLs
4. Configure webhooks if needed

#### 4.2 Update Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Commitments collection
    match /commitments/{commitmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // Merkle roots collection
    match /merkleRoots/{rootId} {
      allow read: if true;
      allow write: if false; // Only backend can write
    }
    
    // Verifications collection
    match /verifications/{verificationId} {
      allow read: if request.auth != null && request.auth.uid == verificationId;
      allow write: if false; // Only backend can write
    }
  }
}
```

#### 4.3 Configure CORS on Backend

Update backend to allow frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

#### 4.4 Test End-to-End Flow

1. **Sign Up**
   - [ ] Create new account
   - [ ] User synced to Firestore

2. **Profile**
   - [ ] View profile page
   - [ ] See "Verify Now" button

3. **Verification**
   - [ ] Navigate to verification page
   - [ ] Connect MetaMask
   - [ ] Switch to Celo Alfajores
   - [ ] Approve cUSD spending
   - [ ] Pay verification fee
   - [ ] Transaction confirms

4. **Verified Status**
   - [ ] Verified badge appears on profile
   - [ ] Verification status saved
   - [ ] Can view transaction on explorer

---

### Phase 5: Monitoring & Maintenance

#### 5.1 Set Up Monitoring

**Backend Monitoring:**
- Railway: Built-in logs and metrics
- Add error tracking (Sentry)
- Set up uptime monitoring (UptimeRobot)

**Frontend Monitoring:**
- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring

**Blockchain Monitoring:**
- Watch contract events on Celoscan
- Monitor server wallet balance
- Track verification transactions

#### 5.2 Set Up Alerts

Configure alerts for:
- Backend downtime
- High error rates
- Low server wallet balance
- Failed transactions
- Unusual activity

#### 5.3 Regular Maintenance

**Weekly:**
- [ ] Check backend logs
- [ ] Review error reports
- [ ] Monitor transaction success rate

**Monthly:**
- [ ] Update dependencies
- [ ] Review security
- [ ] Check server wallet balance
- [ ] Analyze usage metrics

---

## Production Checklist

Before going to mainnet:

### Security
- [ ] All private keys secured
- [ ] Environment variables not exposed
- [ ] Firebase rules configured
- [ ] CORS properly set
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced everywhere

### Testing
- [ ] All features tested on testnet
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] User acceptance testing done
- [ ] Edge cases handled

### Documentation
- [ ] User guide created
- [ ] API documentation complete
- [ ] Troubleshooting guide available
- [ ] Support channels set up

### Infrastructure
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Scaling plan ready
- [ ] Disaster recovery plan

---

## Mainnet Deployment

When ready for mainnet:

### 1. Deploy Contracts to Celo Mainnet

```bash
# Update .env with mainnet RPC
CELO_MAINNET_RPC=https://forno.celo.org

# Deploy
npm run deploy:mainnet
```

### 2. Update Frontend Configuration

```env
NEXT_PUBLIC_CELO_NETWORK=celo
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=0xMainnetAddress...
```

### 3. Fund Server Wallet

Ensure server wallet has enough CELO for operations.

### 4. Announce Launch

- Notify users
- Update documentation
- Monitor closely

---

## Troubleshooting

### Backend Issues

**"Firebase connection failed"**
- Check service account JSON
- Verify Firestore enabled
- Check network connectivity

**"Clerk authentication failed"**
- Verify API keys
- Check domain configuration
- Review CORS settings

### Blockchain Issues

**"Insufficient funds"**
- Get more test CELO from faucet
- Check wallet balance

**"Transaction reverted"**
- Check gas limits
- Verify contract addresses
- Review transaction parameters

### Frontend Issues

**"Cannot connect to wallet"**
- Ensure MetaMask installed
- Check network configuration
- Clear browser cache

**"Contract call failed"**
- Verify contract addresses
- Check network (testnet vs mainnet)
- Review transaction logs

---

## Support Resources

- **Documentation**: See README files in each folder
- **Celo Discord**: https://discord.gg/celo
- **Clerk Support**: https://clerk.com/support
- **Firebase Support**: https://firebase.google.com/support

---

## Next Steps

After successful deployment:

1. **User Onboarding**: Create tutorials and guides
2. **Feature Enhancement**: Add requested features
3. **Performance Optimization**: Monitor and optimize
4. **Community Building**: Engage with users
5. **Continuous Improvement**: Iterate based on feedback

---

## Conclusion

You now have a fully deployed Semaphore + Celo verification system! 

Remember to:
- Monitor regularly
- Keep dependencies updated
- Listen to user feedback
- Maintain security best practices

Good luck with your deployment! 🚀
