import express from 'express';
import { getZKFirestore } from '../config/firebase.js';
import { authMiddleware } from '../middleware/auth.js';
import { buildMerkleTree, saveMerkleRoot } from '../utils/merkleTree.js';

const router = express.Router();

/**
 * POST /api/commitment/register
 * Register a new Semaphore commitment for a user
 */
router.post('/register', async (req, res) => {
  try {
    const { commitment, userId } = req.body;
    // const userId = req.user.sub; // Temporarily disabled for development

    if (!commitment || !userId) {
      return res.status(400).json({ error: 'Commitment and userId are required' });
    }

    // Validate commitment format (should be hex string)
    if (!/^0x[0-9a-fA-F]{64}$/.test(commitment)) {
      return res.status(400).json({ error: 'Invalid commitment format' });
    }

    const db = getZKFirestore();

    // Check if user already has a commitment
    const existingCommitment = await db.collection('commitments')
      .where('clerkId', '==', userId)
      .limit(1)
      .get();

    if (!existingCommitment.empty) {
      return res.status(409).json({ 
        error: 'User already has a registered commitment',
        commitment: existingCommitment.docs[0].data().commitment
      });
    }

    // Store commitment
    const commitmentDoc = {
      clerkId: userId,
      commitment,
      createdAt: new Date().toISOString()
    };

    await db.collection('commitments').add(commitmentDoc);

    // Rebuild Merkle tree
    const { tree, leaves, root } = await buildMerkleTree();

    // Save new root
    await saveMerkleRoot(root, leaves.length);

    res.json({
      success: true,
      commitment,
      root,
      leavesCount: leaves.length
    });
  } catch (error) {
    console.error('Error registering commitment:', error);
    res.status(500).json({ error: 'Failed to register commitment' });
  }
});

/**
 * GET /api/commitment/check
 * Check if user has a registered commitment
 */
router.get('/check', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const db = getZKFirestore();

    const commitmentSnapshot = await db.collection('commitments')
      .where('clerkId', '==', userId)
      .limit(1)
      .get();

    if (commitmentSnapshot.empty) {
      return res.json({ hasCommitment: false });
    }

    const commitmentData = commitmentSnapshot.docs[0].data();
    
    res.json({
      hasCommitment: true,
      commitment: commitmentData.commitment,
      createdAt: commitmentData.createdAt
    });
  } catch (error) {
    console.error('Error checking commitment:', error);
    res.status(500).json({ error: 'Failed to check commitment' });
  }
});

export default router;
