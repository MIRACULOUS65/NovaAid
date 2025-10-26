# NovaAid Backend - Semaphore + Celo Integration

Backend service for NovaAid app with Semaphore identity commitments and Merkle tree management.

## Features

- **Commitment Management**: Register and store Semaphore identity commitments
- **Merkle Tree**: Off-chain Merkle tree construction and proof generation
- **Verification Tracking**: Record and verify user verification status
- **Firestore Integration**: Persistent storage for commitments and roots
- **Clerk Authentication**: JWT-based authentication

## Setup

### Prerequisites

- Node.js 18+
- Firebase Admin SDK credentials
- Clerk API keys

### Installation

```bash
cd NovaAid/BACKEND/novaaid-app-backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
CLERK_SECRET_KEY=your_clerk_secret_key
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=your_operator_private_key
PORT=3001
```

3. Place your Firebase service account JSON file in the root directory as `serviceAccountKey.json`

### Running

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Commitment Endpoints

#### POST /api/commitment/register
Register a new Semaphore commitment for a user.

**Headers:**
- `Authorization: Bearer <clerk_jwt>`

**Body:**
```json
{
  "commitment": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "commitment": "0x...",
  "root": "0x...",
  "leavesCount": 10
}
```

#### GET /api/commitment/check
Check if user has a registered commitment.

**Headers:**
- `Authorization: Bearer <clerk_jwt>`

**Response:**
```json
{
  "hasCommitment": true,
  "commitment": "0x...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Merkle Tree Endpoints

#### GET /api/merkle/root
Get the latest Merkle root.

**Response:**
```json
{
  "root": "0x...",
  "leavesCount": 10,
  "version": 1234567890,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/merkle/proof/:commitment
Get Merkle proof for a specific commitment.

**Headers:**
- `Authorization: Bearer <clerk_jwt>`

**Response:**
```json
{
  "commitment": "0x...",
  "proof": [
    { "position": 0, "data": "0x..." }
  ],
  "root": "0x..."
}
```

#### POST /api/merkle/rebuild
Manually trigger Merkle tree rebuild.

**Headers:**
- `Authorization: Bearer <clerk_jwt>`

**Response:**
```json
{
  "success": true,
  "root": "0x...",
  "leavesCount": 10
}
```

### Verification Endpoints

#### POST /api/verification/record
Record a successful verification payment.

**Headers:**
- `Authorization: Bearer <clerk_jwt>`

**Body:**
```json
{
  "txHash": "0x...",
  "amount": "0.01",
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "verified": true
}
```

#### GET /api/verification/status
Check user's verification status.

**Headers:**
- `Authorization: Bearer <clerk_jwt>`

**Response:**
```json
{
  "verified": true,
  "verifiedAt": "2024-01-01T00:00:00.000Z",
  "txHash": "0x...",
  "amount": "0.01",
  "walletAddress": "0x..."
}
```

## Firestore Collections

### commitments
Stores user Semaphore commitments.

```
{
  clerkId: string,
  commitment: string (hex),
  createdAt: string (ISO)
}
```

### merkleRoots
Stores Merkle root history.

```
{
  root: string (hex),
  leavesCount: number,
  version: number (timestamp),
  createdAt: string (ISO)
}
```

### verifications
Stores user verification records.

```
{
  clerkId: string,
  txHash: string,
  amount: string,
  walletAddress: string,
  verified: boolean,
  verifiedAt: string (ISO)
}
```

## Security Notes

- Never store user's identity salt/trapdoor on the server
- Only commitments are stored in Firestore
- All endpoints require Clerk JWT authentication
- Rate limiting should be implemented in production
- Use HTTPS in production

## Development

### Testing

```bash
npm test
```

### Health Check

```bash
curl http://localhost:3001/health
```

## Deployment

1. Set up environment variables on your hosting platform
2. Ensure Firebase credentials are securely stored
3. Configure CORS for your frontend domain
4. Set up monitoring and logging
5. Implement rate limiting

## Troubleshooting

### Firebase Connection Issues
- Verify service account JSON is valid
- Check Firebase project permissions
- Ensure Firestore is enabled

### Merkle Tree Errors
- Check that commitments are valid hex strings
- Verify Firestore collection structure
- Rebuild tree manually if needed

## License

MIT
