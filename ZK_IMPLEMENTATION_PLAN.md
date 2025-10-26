# 🔐 ZK-SNARK Verification Implementation Plan

## ✅ Phase 1: Transaction ID Display (COMPLETED)

- [x] Show transaction hash on verification success
- [x] Add copy button for transaction ID
- [x] Link to Celo block explorer
- [x] Improved UI with better styling

**Status:** ✅ Done - Transaction ID now displays prominently with copy and view options

---

## 🚀 Phase 2: Infrastructure Setup (IN PROGRESS)

### 2.1 Firebase Configuration ✅
- [x] Created separate Firebase config for blockchain ZK data
- [x] File: `/FRONTEND/novaaid-app/lib/firebase/blockchain.ts`
- [x] Project: `nova-aid-blockchain-zk-data`

### 2.2 Pinata IPFS Integration ✅
- [x] Created Pinata configuration
- [x] File: `/BACKEND/novaaid-app-backend/config/pinata.js`
- [x] API Key: `b03549a812be8bc48dc1`
- [x] Functions: uploadToIPFS, retrieveFromIPFS, encrypt/decrypt

### 2.3 Semaphore Library Setup ⏳
**Status:** Need to install and configure

**Required NPM Packages:**
```bash
# Frontend
cd FRONTEND/novaaid-app
npm install @semaphore-protocol/identity @semaphore-protocol/proof @zk-kit/protocols

# Backend
cd BACKEND/novaaid-app-backend
npm install @semaphore-protocol/identity @semaphore-protocol/proof @zk-kit/protocols
npm install merkletreejs keccak256 axios

# Blockchain
cd BLOCKCHAIN/novaaid-app-blockchain
npm install @semaphore-protocol/identity @semaphore-protocol/proof
```

**Files to Create:**
- [ ] `/FRONTEND/novaaid-app/lib/semaphore/identity.ts` - Fix and complete
- [ ] `/FRONTEND/novaaid-app/lib/semaphore/proof.ts` - Proof generation
- [ ] `/BACKEND/novaaid-app-backend/utils/merkleTree.js` - Merkle tree manager
- [ ] `/BACKEND/novaaid-app-backend/utils/semaphore.js` - Semaphore utilities

---

## 📝 Phase 3: Backend API Routes

### 3.1 Commitment Registration
**Endpoint:** `POST /api/commitment/register`

**Current Status:** ✅ Exists but needs ZK enhancement

**Required Changes:**
- [ ] Add `status: 'pending_payment'` field
- [ ] Generate payment invoice with commitment
- [ ] Store in blockchain Firebase
- [ ] Return payment details

**Request:**
```json
{
  "commitment": "0xabc123...",
  "userId": "user_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "commitment": "0xabc123...",
  "status": "pending_payment",
  "payment": {
    "amount": "0.01",
    "currency": "CELO",
    "contractAddress": "0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5",
    "memo": "0xabc123..."
  }
}
```

### 3.2 Merkle Root Management
**Endpoints:**
- `GET /api/merkle/root` - Get current Merkle root ✅ (exists)
- `GET /api/merkle/path-elements?commitment=<hex>` - Get proof path
- `POST /api/merkle/update-root` - Update root (operator only)

**Files:**
- [ ] `/BACKEND/novaaid-app-backend/routes/merkle.js` - Enhance existing
- [ ] `/BACKEND/novaaid-app-backend/utils/merkleTree.js` - Tree manager

### 3.3 Payment Watcher Service
**File:** `/BACKEND/novaaid-app-backend/services/paymentWatcher.js`

**Functionality:**
- [ ] Listen to blockchain events from VerifiedPaymentsNative contract
- [ ] Match payment to pending commitment
- [ ] Verify amount is exactly 0.01 CELO
- [ ] Mark commitment as `paid`
- [ ] Add commitment to Merkle tree
- [ ] Compute new root
- [ ] Call `updateRoot()` on-chain
- [ ] Store in IPFS (encrypted)

### 3.4 Proof Verification
**Endpoint:** `POST /api/proof/verify`

**Request:**
```json
{
  "proof": "...",
  "publicSignals": [...],
  "signal": "vote_action_123",
  "nullifier": "0x..."
}
```

**Response:**
```json
{
  "verified": true,
  "nullifier": "0x...",
  "ipfsHash": "Qm..."
}
```

---

## 🔗 Phase 4: Smart Contract Updates

### 4.1 Current Contracts
**Deployed:** ✅
- `SemaphoreVerifier`: `0xB2BDdaCE73916545637C57a9d19043C5Fb2C6165`
- `VerifiedPaymentsNative`: `0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5`

### 4.2 Required Contract Updates

**VerifiedPaymentsNative.sol** - Add commitment tracking:
```solidity
mapping(bytes32 => bool) public commitmentPaid;

event PaymentWithCommitment(
    address indexed payer,
    bytes32 indexed commitment,
    uint256 amount,
    uint256 timestamp
);

function payWithCommitment(bytes32 commitment) external payable {
    require(msg.value >= verificationFee, "Insufficient payment");
    require(!commitmentPaid[commitment], "Commitment already paid");
    
    // Transfer to server wallet
    (bool success, ) = serverWallet.call{value: msg.value}("");
    require(success, "Transfer failed");
    
    // Mark commitment as paid
    commitmentPaid[commitment] = true;
    
    emit PaymentWithCommitment(msg.sender, commitment, msg.value, block.timestamp);
}
```

**VerifiedRegistry.sol** - New contract for Merkle root storage:
```solidity
contract VerifiedRegistry {
    address public owner;
    bytes32 public currentRoot;
    uint public rootVersion;
    
    mapping(bytes32 => bool) public nullifierUsed;
    
    event RootUpdated(bytes32 indexed newRoot, uint version);
    event ProofVerified(bytes32 indexed nullifier, address indexed verifier);
    
    function updateRoot(bytes32 newRoot) external onlyOwner {
        currentRoot = newRoot;
        rootVersion++;
        emit RootUpdated(newRoot, rootVersion);
    }
    
    function markNullifierUsed(bytes32 nullifier) external {
        require(!nullifierUsed[nullifier], "Nullifier already used");
        nullifierUsed[nullifier] = true;
        emit ProofVerified(nullifier, msg.sender);
    }
}
```

### 4.3 Deployment Scripts
- [ ] Update `deploy-native.js` to include VerifiedRegistry
- [ ] Create `updateRoot.js` script for operator
- [ ] Add contract verification scripts

---

## 🎨 Phase 5: Frontend Components

### 5.1 Identity Creation UI
**Component:** `/FRONTEND/novaaid-app/components/semaphore/IdentityCreator.tsx`

**Features:**
- [ ] Generate Semaphore identity (trapdoor + nullifier)
- [ ] Show commitment
- [ ] Store identity securely in localStorage (encrypted)
- [ ] Export/backup identity option

### 5.2 Payment Flow UI
**Page:** `/FRONTEND/novaaid-app/app/verification/page.tsx` (enhance existing)

**Current Flow:**
1. Connect wallet ✅
2. Click "Pay Verification Fee" ✅
3. Confirm in MetaMask ✅
4. Show transaction ID ✅

**Enhanced Flow:**
1. Create/Load Semaphore Identity
2. Generate Commitment
3. Register Commitment (backend)
4. Pay 0.01 CELO with Commitment
5. Wait for confirmation
6. Backend adds to Merkle tree
7. Show success + IPFS hash

### 5.3 Proof Generation UI
**Component:** `/FRONTEND/novaaid-app/components/semaphore/ProofGenerator.tsx`

**Features:**
- [ ] Load user's identity
- [ ] Fetch Merkle path from backend
- [ ] Generate ZK proof for given signal
- [ ] Submit proof for verification
- [ ] Display verification status

### 5.4 Verification Status Dashboard
**Page:** `/FRONTEND/novaaid-app/app/verification/status/page.tsx`

**Features:**
- [ ] Show commitment status (pending/paid/verified)
- [ ] Show Merkle root version
- [ ] Show IPFS proof hash
- [ ] View on-chain root
- [ ] Proof history

---

## 🗄️ Phase 6: Database Schema

### 6.1 Blockchain Firebase Collections

**Collection: `commitments`**
```json
{
  "commitment": "0xabc123...",
  "clerkId": "user_xxx",
  "status": "pending_payment | paid | verified",
  "createdAt": "2025-10-25T...",
  "paidAt": "2025-10-25T...",
  "txHash": "0xdef456...",
  "walletAddress": "0x...",
  "leafIndex": 42,
  "ipfsHash": "Qm..."
}
```

**Collection: `merkleRoots`**
```json
{
  "root": "0xroot123...",
  "version": 5,
  "leavesCount": 42,
  "timestamp": "2025-10-25T...",
  "txHash": "0xupdate...",
  "ipfsBackup": "Qm..."
}
```

**Collection: `proofs`**
```json
{
  "nullifier": "0xnull...",
  "signal": "vote_action_123",
  "clerkId": "user_xxx",
  "commitment": "0xabc...",
  "verified": true,
  "verifiedAt": "2025-10-25T...",
  "ipfsHash": "Qm...",
  "used": false
}
```

**Collection: `payments`**
```json
{
  "txHash": "0xpay...",
  "from": "0xwallet...",
  "commitment": "0xabc...",
  "amount": "0.01",
  "currency": "CELO",
  "timestamp": "2025-10-25T...",
  "blockNumber": 12345,
  "status": "confirmed"
}
```

---

## 🧪 Phase 7: Testing Strategy

### 7.1 Unit Tests
- [ ] Identity generation deterministic
- [ ] Merkle tree append/build correctness
- [ ] Proof generation valid
- [ ] Encryption/decryption works
- [ ] Pinata upload/download

### 7.2 Contract Tests
- [ ] Payment with commitment emits correct event
- [ ] Root update only by owner
- [ ] Nullifier marking prevents reuse
- [ ] Payment amount validation

### 7.3 Integration Tests
- [ ] Full flow: register → pay → tree update → proof gen → verify
- [ ] Test on Alfajores testnet
- [ ] Record transaction hashes
- [ ] Verify IPFS storage

### 7.4 Test Files to Create
- [ ] `/BLOCKCHAIN/novaaid-app-blockchain/test/VerifiedPayments.test.js`
- [ ] `/BLOCKCHAIN/novaaid-app-blockchain/test/VerifiedRegistry.test.js`
- [ ] `/BACKEND/novaaid-app-backend/test/merkleTree.test.js`
- [ ] `/BACKEND/novaaid-app-backend/test/semaphore.test.js`

---

## 📦 Phase 8: Deployment & DevOps

### 8.1 Environment Variables

**Backend `.env`:**
```env
# Existing
PORT=3001
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# New ZK Variables
BLOCKCHAIN_FIREBASE_PROJECT_ID=nova-aid-blockchain-zk-data
BLOCKCHAIN_FIREBASE_SERVICE_ACCOUNT_PATH=./blockchainServiceAccount.json
PINATA_API_KEY=b03549a812be8bc48dc1
PINATA_SECRET_API_KEY=<secret>

# Celo Alfajores
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0x...
VERIFICATION_AMOUNT_CELO=0.01

# Contracts (after deployment)
VERIFIED_REGISTRY_ADDRESS=<address>
VERIFICATION_ESCROW_ADDRESS=<address>
SEMAPHORE_VERIFIER_ADDRESS=<address>
```

**Frontend `.env.local`:**
```env
# Existing
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_CHAIN_ID=44787

# New ZK Variables
NEXT_PUBLIC_BLOCKCHAIN_FIREBASE_API_KEY=AIzaSyC_yh7xZckbSwtvuBpVFc_kZSyNjpchkEI
NEXT_PUBLIC_BLOCKCHAIN_FIREBASE_PROJECT_ID=nova-aid-blockchain-zk-data
NEXT_PUBLIC_VERIFIED_REGISTRY_ADDRESS=<address>
NEXT_PUBLIC_BACKEND_API=http://localhost:3001
```

### 8.2 Deployment Steps
1. [ ] Install all dependencies
2. [ ] Deploy contracts to Alfajores
3. [ ] Update environment variables
4. [ ] Run database migrations
5. [ ] Start payment watcher service
6. [ ] Test full flow
7. [ ] Document transaction hashes

---

## 📚 Phase 9: Documentation

### 9.1 README Files
- [ ] `/ZK_IMPLEMENTATION.md` - Overview and architecture
- [ ] `/BLOCKCHAIN/README.md` - Contract documentation
- [ ] `/BACKEND/ZK_API.md` - API endpoints
- [ ] `/FRONTEND/ZK_USAGE.md` - Frontend integration

### 9.2 Runbook
- [ ] How to rotate operator key
- [ ] How to manually update root
- [ ] How to handle failed payments
- [ ] How to refund users
- [ ] Emergency procedures

---

## 🎯 Current Status Summary

### ✅ Completed
1. Basic verification payment system
2. Transaction ID display with block explorer link
3. Firebase blockchain config setup
4. Pinata IPFS integration
5. Smart contracts deployed to Alfajores

### 🔄 In Progress
1. Semaphore library installation
2. Identity creation UI
3. Merkle tree management

### ⏳ To Do
1. Payment watcher service
2. Proof generation
3. Root update mechanism
4. Full integration tests
5. Documentation

---

## 🚦 Next Immediate Steps

1. **Install Semaphore packages**
   ```bash
   cd FRONTEND/novaaid-app
   npm install @semaphore-protocol/identity @semaphore-protocol/proof @zk-kit/protocols
   ```

2. **Fix identity.ts file**
   - Install packages first
   - Then implement proper identity creation

3. **Create Merkle tree manager**
   - Backend utility for tree operations
   - Store in blockchain Firebase

4. **Update contract with commitment tracking**
   - Add `payWithCommitment()` function
   - Emit payment events with commitment

5. **Build payment watcher**
   - Listen to blockchain events
   - Match payments to commitments
   - Update Merkle tree

---

## 📊 Estimated Timeline

- **Phase 1:** ✅ Complete (1 hour)
- **Phase 2:** 🔄 In Progress (2-3 hours)
- **Phase 3:** ⏳ Pending (4-5 hours)
- **Phase 4:** ⏳ Pending (3-4 hours)
- **Phase 5:** ⏳ Pending (5-6 hours)
- **Phase 6:** ⏳ Pending (2-3 hours)
- **Phase 7:** ⏳ Pending (4-5 hours)
- **Phase 8:** ⏳ Pending (2-3 hours)
- **Phase 9:** ⏳ Pending (2-3 hours)

**Total Estimated Time:** 25-35 hours of development work

---

## 🎉 Acceptance Criteria Tracking

- [ ] User can register commitment via UI
- [ ] Commitment stored in Firestore as `pending_payment`
- [ ] User pays 0.01 CELO on Alfajores with commitment
- [ ] Backend detects payment and marks as `paid`
- [ ] Backend appends to Merkle tree and updates root on-chain
- [ ] `GET /api/merkle/root` returns correct root
- [ ] User can generate Semaphore proof with local identity
- [ ] Proof verification succeeds (on-chain or off-chain)
- [ ] All secrets remain client-side
- [ ] Tests pass
- [ ] Documented with examples

---

**Current Priority:** Install Semaphore packages and fix identity.ts!
