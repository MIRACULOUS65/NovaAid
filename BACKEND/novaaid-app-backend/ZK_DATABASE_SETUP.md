# ZK Database Setup Guide

## Overview

The NovaAid backend now uses **two separate Firebase databases**:

1. **Auth Database** (`nova-aid-43305`) - For Clerk authentication data
2. **ZK Database** (`nova-aid-blockchain-zk-data`) - For blockchain/ZK verification data

### Collections in ZK Database

The ZK database stores:
- **commitments** - User Semaphore commitments
- **merkleRoots** - Historical Merkle tree roots and versions
- **verifications** - Payment verification records
- **users** - User verification status (for future NGO verification)

---

## Setup Instructions

### Step 1: Access Firebase Console

Go to [Firebase Console](https://console.firebase.google.com/) and select the **nova-aid-blockchain-zk-data** project.

### Step 2: Generate Service Account Key

1. Navigate to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate New Private Key**
3. Confirm and download the JSON file
4. Save it as `zkServiceAccountKey.json` in the backend root directory:
   ```
   NovaAid/BACKEND/novaaid-app-backend/zkServiceAccountKey.json
   ```

### Step 3: Configure Environment Variables

If you have a `.env` file, add:

```bash
FIREBASE_ZK_SERVICE_ACCOUNT_PATH=./zkServiceAccountKey.json
```

### Step 4: Restart Backend Server

Stop the current backend server (Ctrl+C) and restart:

```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm run dev
```

You should see:
```
Firebase Admin initialized successfully (Auth DB)
Firebase Admin initialized successfully (ZK DB)
NovaAid Backend Server running on port 3001
```

---

## Verification

### Test Merkle Root Storage

1. Register a commitment:
```bash
POST http://localhost:3001/api/commitment/register
Content-Type: application/json

{
  "commitment": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "userId": "test_user_123"
}
```

2. Check Firestore Console:
   - Go to **nova-aid-blockchain-zk-data** project
   - Navigate to **Firestore Database**
   - You should see the `commitments` and `merkleRoots` collections with your data

### Check Merkle Root

```bash
GET http://localhost:3001/api/merkle/root
```

Response should include the latest root stored in the ZK database.

---

## Database Schema

### commitments Collection

```json
{
  "clerkId": "user_xxx",
  "commitment": "0x...",
  "createdAt": "2025-10-25T15:14:47.355Z"
}
```

### merkleRoots Collection

```json
{
  "root": "0x4fc93f5a...",
  "leavesCount": 2,
  "createdAt": "2025-10-25T15:14:47.355Z",
  "version": 1730000000000
}
```

### verifications Collection

```json
{
  "clerkId": "user_xxx",
  "txHash": "0x...",
  "amount": "0.01",
  "walletAddress": "0x...",
  "verified": true,
  "verifiedAt": "2025-10-25T15:14:47.355Z"
}
```

### users Collection (Future - NGO Verification)

```json
{
  "clerkId": "user_xxx",
  "verified": true,
  "verifiedAt": "2025-10-25T15:14:47.355Z",
  "verificationType": "zk" | "ngo",
  "ngoVerifiedBy": "ngo_user_xxx" // Optional, for NGO verification
}
```

---

## Troubleshooting

### Error: "ZK Database service account not found"

If you see this warning:
```
ZK Database service account not found. Using auth database for all operations.
```

**Solution**: The backend is using a fallback mode. Create the `zkServiceAccountKey.json` file as described in Step 2.

### Error: "Permission denied"

**Solution**: Ensure your service account has **Firestore Admin** permissions in the Firebase Console.

### Data still going to wrong database

**Solution**: 
1. Check the service account key file has the correct `project_id`: `"nova-aid-blockchain-zk-data"`
2. Restart the backend server
3. Check console logs to confirm both databases initialized

---

## Firebase Project Configuration

Your Firebase client configuration (for frontend):

```javascript
const zkFirebaseConfig = {
  apiKey: "AIzaSyC_yh7xZckbSwtvuBpVFc_kZSyNjpchkEI",
  authDomain: "nova-aid-blockchain-zk-data.firebaseapp.com",
  projectId: "nova-aid-blockchain-zk-data",
  storageBucket: "nova-aid-blockchain-zk-data.firebasestorage.app",
  messagingSenderId: "926280914453",
  appId: "1:926280914453:web:c3e9b1111c5c350e80601c",
  measurementId: "G-32SYH3F0V6"
};
```

**Note**: Keep this configuration for any frontend code that needs to directly read from the ZK database.

---

## Security Best Practices

1. ✅ **Never commit** `zkServiceAccountKey.json` to Git
2. ✅ Add to `.gitignore`: `zkServiceAccountKey.json`
3. ✅ Store in secure environment variables for production
4. ✅ Limit service account permissions to only what's needed
5. ✅ Rotate keys periodically

---

## Future: NGO Verification Flow

When implementing NGO verification:

1. NGO accounts will have a special role in the `users` collection
2. NGOs can mark users as `verified` without ZK proof
3. The `verificationType` field will distinguish between:
   - `"zk"` - Zero-knowledge proof verification (current)
   - `"ngo"` - NGO manual verification (future)
4. Both verification types will be recorded in the same `verifications` collection

This separation of databases ensures that NGO operations won't interfere with ZK proof data integrity.
