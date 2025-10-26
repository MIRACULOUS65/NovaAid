import express from 'express';
import { getZKFirestore } from '../config/firebase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/verification/record
 * Record a successful verification payment
 */
router.post('/record', async (req, res) => {
  try {
    const { txHash, amount, walletAddress, userId } = req.body;
    // const userId = req.user.sub; // Temporarily disabled for development

    if (!txHash || !amount || !walletAddress || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getZKFirestore();

    // Check if already verified
    const existingVerification = await db.collection('verifications')
      .where('clerkId', '==', userId)
      .limit(1)
      .get();

    if (!existingVerification.empty) {
      return res.status(409).json({ 
        error: 'User already verified',
        verification: existingVerification.docs[0].data()
      });
    }

    // Record verification
    const verificationDoc = {
      clerkId: userId,
      txHash,
      amount,
      walletAddress,
      verified: true,
      verifiedAt: new Date().toISOString()
    };

    // Add verification record
    const verificationRef = await db.collection('verifications').add(verificationDoc);

    // Create or update user document with verified status (using set with merge)
    await db.collection('users').doc(userId).set({
      clerkId: userId,
      verified: true,
      verifiedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    res.json({
      success: true,
      verified: true,
      verificationId: verificationRef.id,
      verificationDoc
    });
  } catch (error) {
    console.error('Error recording verification:', error);
    res.status(500).json({ 
      error: 'Failed to record verification',
      details: error.message 
    });
  }
});

/**
 * GET /api/verification/status
 * Check user's verification status
 */
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const db = getZKFirestore();

    const verificationSnapshot = await db.collection('verifications')
      .where('clerkId', '==', userId)
      .limit(1)
      .get();

    if (verificationSnapshot.empty) {
      return res.json({ verified: false });
    }

    const verificationData = verificationSnapshot.docs[0].data();
    
    res.json({
      verified: true,
      ...verificationData
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    res.status(500).json({ error: 'Failed to check verification status' });
  }
});

export default router;
