import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Decode private key if it's base64 encoded
function getPrivateKey(): string | undefined {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  
  // Check if it's base64 encoded (no BEGIN/END markers)
  if (!key.includes('BEGIN PRIVATE KEY')) {
    try {
      // Decode from base64
      const decoded = Buffer.from(key, 'base64').toString('utf-8');
      return decoded;
    } catch (error) {
      console.error('Failed to decode base64 private key:', error);
      return key;
    }
  }
  
  // Already in PEM format, just replace \n with actual newlines
  return key.replace(/\\n/g, '\n');
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: getPrivateKey(),
  }),
};

// Initialize Firebase Admin
export function getFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp(firebaseAdminConfig);
  }
  return getFirestore();
}
