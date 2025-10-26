import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let authDb = null;  // For Clerk auth data
let zkDb = null;     // For blockchain/ZK data (commitments, merkleRoots, verifications)

export function initializeFirebase() {
  try {
    // Initialize Clerk Auth Database (nova-aid-43305)
    let authServiceAccount;
    
    // Try environment variable first (for Railway/production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      console.log('Loading Firebase auth config from environment variable...');
      authServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      // Fallback to file (for local development)
      console.log('Loading Firebase auth config from file...');
      const authServiceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
                                     join(__dirname, '..', 'serviceAccountKey.json');
      authServiceAccount = JSON.parse(readFileSync(authServiceAccountPath, 'utf8'));
    }

    const authApp = admin.initializeApp({
      credential: admin.credential.cert(authServiceAccount)
    }, 'auth-app');

    authDb = authApp.firestore();
    console.log('✅ Firebase Admin initialized successfully (Auth DB)');
    
    // Initialize ZK/Blockchain Database (nova-aid-blockchain-zk-data)
    let zkServiceAccount;
    
    try {
      // Try environment variable first (for Railway/production)
      if (process.env.FIREBASE_ZK_SERVICE_ACCOUNT_JSON) {
        console.log('Loading Firebase ZK config from environment variable...');
        zkServiceAccount = JSON.parse(process.env.FIREBASE_ZK_SERVICE_ACCOUNT_JSON);
      } else {
        // Fallback to file (for local development)
        console.log('Loading Firebase ZK config from file...');
        const zkServiceAccountPath = process.env.FIREBASE_ZK_SERVICE_ACCOUNT_PATH || 
                                     join(__dirname, '..', 'zkServiceAccountKey.json');
        zkServiceAccount = JSON.parse(readFileSync(zkServiceAccountPath, 'utf8'));
      }
      
      const zkApp = admin.initializeApp({
        credential: admin.credential.cert(zkServiceAccount)
      }, 'zk-app');

      zkDb = zkApp.firestore();
      console.log('✅ Firebase Admin initialized successfully (ZK DB)');
    } catch (zkError) {
      console.warn('⚠️  ZK Database service account not found. Using auth database for all operations.');
      console.warn('Please set FIREBASE_ZK_SERVICE_ACCOUNT_JSON env var or create zkServiceAccountKey.json');
      zkDb = authDb; // Fallback to auth database if ZK database not configured
    }
    
    return { authDb, zkDb };
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

/**
 * Get Firestore instance for Clerk auth data
 */
export function getAuthFirestore() {
  if (!authDb) {
    throw new Error('Auth Firestore not initialized. Call initializeFirebase() first.');
  }
  return authDb;
}

/**
 * Get Firestore instance for blockchain/ZK data (commitments, merkleRoots, verifications)
 */
export function getZKFirestore() {
  if (!zkDb) {
    throw new Error('ZK Firestore not initialized. Call initializeFirebase() first.');
  }
  return zkDb;
}

/**
 * @deprecated Use getAuthFirestore() or getZKFirestore() instead
 */
export function getFirestore() {
  console.warn('getFirestore() is deprecated. Use getAuthFirestore() or getZKFirestore() instead.');
  return getAuthFirestore();
}

export { admin };
