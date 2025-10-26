import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { buildMerkleTree, getMerkleProof, getLatestMerkleRoot } from '../utils/merkleTree.js';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/merkle/root
 * Get the latest Merkle root
 */
router.get('/root', async (req, res) => {
  try {
    const latestRoot = await getLatestMerkleRoot();
    
    if (!latestRoot) {
      return res.json({
        root: '0x0000000000000000000000000000000000000000000000000000000000000000',
        leavesCount: 0,
        version: 0
      });
    }

    res.json(latestRoot);
  } catch (error) {
    console.error('Error getting Merkle root:', error);
    res.status(500).json({ error: 'Failed to get Merkle root' });
  }
});

/**
 * GET /api/merkle/proof/:commitment
 * Get Merkle proof for a specific commitment
 */
router.get('/proof/:commitment', authMiddleware, async (req, res) => {
  try {
    const { commitment } = req.params;

    // Validate commitment format
    if (!/^0x[0-9a-fA-F]{64}$/.test(commitment)) {
      return res.status(400).json({ error: 'Invalid commitment format' });
    }

    // Rebuild tree to get current state
    const { tree, root } = await buildMerkleTree();

    // Get proof
    const proof = getMerkleProof(tree, commitment);

    res.json({
      commitment,
      proof,
      root
    });
  } catch (error) {
    console.error('Error getting Merkle proof:', error);
    res.status(500).json({ error: 'Failed to get Merkle proof' });
  }
});

/**
 * POST /api/merkle/rebuild
 * Manually trigger Merkle tree rebuild (admin only)
 */
router.post('/rebuild', authMiddleware, async (req, res) => {
  try {
    const { tree, leaves, root } = await buildMerkleTree();
    
    res.json({
      success: true,
      root,
      leavesCount: leaves.length
    });
  } catch (error) {
    console.error('Error rebuilding Merkle tree:', error);
    res.status(500).json({ error: 'Failed to rebuild Merkle tree' });
  }
});

export default router;
