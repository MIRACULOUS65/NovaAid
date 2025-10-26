import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { getZKFirestore } from '../config/firebase.js';

/**
 * Build Merkle tree from all commitments in Firestore
 */
export async function buildMerkleTree() {
  const db = getZKFirestore();
  
  try {
    const commitmentsSnapshot = await db.collection('commitments').get();
    
    if (commitmentsSnapshot.empty) {
      console.log('No commitments found, creating empty tree');
      return {
        tree: new MerkleTree([], keccak256, { sortPairs: true }),
        leaves: [],
        root: '0x0000000000000000000000000000000000000000000000000000000000000000'
      };
    }

    const leaves = commitmentsSnapshot.docs.map(doc => {
      const commitment = doc.data().commitment;
      // Remove 0x prefix if present and convert to buffer
      const cleanCommitment = commitment.replace(/^0x/, '');
      return Buffer.from(cleanCommitment, 'hex');
    });

    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = '0x' + tree.getRoot().toString('hex');

    console.log(`Built Merkle tree with ${leaves.length} leaves, root: ${root}`);

    return { tree, leaves, root };
  } catch (error) {
    console.error('Error building Merkle tree:', error);
    throw error;
  }
}

/**
 * Get Merkle proof for a specific commitment
 */
export function getMerkleProof(tree, commitment) {
  const cleanCommitment = commitment.replace(/^0x/, '');
  const leaf = Buffer.from(cleanCommitment, 'hex');
  const proof = tree.getProof(leaf);
  
  return proof.map(p => ({
    position: p.position === 'left' ? 0 : 1,
    data: '0x' + p.data.toString('hex')
  }));
}

/**
 * Save Merkle root to Firestore
 */
export async function saveMerkleRoot(root, leavesCount) {
  const db = getZKFirestore();
  
  try {
    const rootDoc = {
      root,
      leavesCount,
      createdAt: new Date().toISOString(),
      version: Date.now()
    };

    await db.collection('merkleRoots').add(rootDoc);
    
    // Also update the latest root document
    await db.collection('merkleRoots').doc('latest').set(rootDoc);
    
    console.log(`Saved Merkle root: ${root}`);
    return rootDoc;
  } catch (error) {
    console.error('Error saving Merkle root:', error);
    throw error;
  }
}

/**
 * Get latest Merkle root from Firestore
 */
export async function getLatestMerkleRoot() {
  const db = getZKFirestore();
  
  try {
    const latestDoc = await db.collection('merkleRoots').doc('latest').get();
    
    if (!latestDoc.exists) {
      return null;
    }
    
    return latestDoc.data();
  } catch (error) {
    console.error('Error getting latest Merkle root:', error);
    throw error;
  }
}
