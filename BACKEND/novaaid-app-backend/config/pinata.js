import axios from 'axios';

const PINATA_API_KEY = process.env.PINATA_API_KEY || 'b03549a812be8bc48dc1';
const PINATA_API_URL = 'https://api.pinata.cloud';

/**
 * Upload encrypted ZK proof data to IPFS via Pinata
 * @param {Object} data - The encrypted proof data
 * @param {string} name - Filename/identifier
 * @returns {Promise<{ipfsHash: string, pinataUrl: string}>}
 */
export async function uploadToIPFS(data, name = 'zk-proof') {
  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: `${name}-${Date.now()}.json`,
          keyvalues: {
            type: 'zk-proof',
            timestamp: new Date().toISOString()
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY
        }
      }
    );

    return {
      ipfsHash: response.data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      timestamp: response.data.Timestamp
    };
  } catch (error) {
    console.error('Pinata upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Retrieve data from IPFS via Pinata gateway
 * @param {string} ipfsHash - The IPFS hash
 * @returns {Promise<Object>}
 */
export async function retrieveFromIPFS(ipfsHash) {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    );
    return response.data;
  } catch (error) {
    console.error('IPFS retrieval error:', error.message);
    throw new Error('Failed to retrieve from IPFS');
  }
}

/**
 * Encrypt data before uploading to IPFS
 * @param {Object} data - Data to encrypt
 * @param {string} secret - Encryption secret (derived from user's identity)
 * @returns {string} Encrypted data as base64
 */
export function encryptData(data, secret) {
  const crypto = require('crypto');
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(secret, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return JSON.stringify({
    iv: iv.toString('hex'),
    data: encrypted
  });
}

/**
 * Decrypt data retrieved from IPFS
 * @param {string} encryptedData - Encrypted data as JSON string
 * @param {string} secret - Decryption secret
 * @returns {Object} Decrypted data
 */
export function decryptData(encryptedData, secret) {
  const crypto = require('crypto');
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(secret, 'salt', 32);
  
  const { iv, data } = JSON.parse(encryptedData);
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

export default {
  uploadToIPFS,
  retrieveFromIPFS,
  encryptData,
  decryptData
};
