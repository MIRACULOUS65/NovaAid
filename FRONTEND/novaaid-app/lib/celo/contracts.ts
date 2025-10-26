import { ethers } from 'ethers';

// Contract ABIs (simplified - add full ABI after deployment)
export const VERIFIED_PAYMENTS_ABI = [
  "function payVerificationFee() external payable",
  "function verificationFee() external view returns (uint256)",
  "function isVerified(address user) external view returns (bool)",
  "function checkVerification(address user) external view returns (bool, uint256)",
  "event UserVerified(address indexed user, uint256 timestamp)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

// Contract addresses (update after deployment)
export const CONTRACTS = {
  sepolia: {
    verifiedPayments: '0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5',
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'
  },
  celo: {
    verifiedPayments: process.env.NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS || '',
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a'
  }
};

// Network configuration
export const NETWORKS = {
  sepolia: {
    chainId: '0xaef3', // 44787 in hex (Alfajores)
    chainName: 'Celo Alfajores Testnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18
    },
    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
    blockExplorerUrls: ['https://alfajores.celoscan.io/']
  },
  celo: {
    chainId: '0xa4ec', // 42220 in hex
    chainName: 'Celo Mainnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18
    },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://celoscan.io']
  }
};

/**
 * Get contract instance
 */
export function getVerifiedPaymentsContract(
  signerOrProvider: ethers.Signer | ethers.Provider,
  network: 'sepolia' | 'celo' = 'sepolia'
) {
  const address = CONTRACTS[network].verifiedPayments;
  if (!address) {
    throw new Error('Contract address not configured');
  }
  return new ethers.Contract(address, VERIFIED_PAYMENTS_ABI, signerOrProvider);
}

/**
 * Get cUSD token contract
 */
export function getCUSDContract(
  signerOrProvider: ethers.Signer | ethers.Provider,
  network: 'sepolia' | 'celo' = 'sepolia'
) {
  const address = CONTRACTS[network].cUSD;
  return new ethers.Contract(address, ERC20_ABI, signerOrProvider);
}

/**
 * Switch to Celo network in MetaMask
 */
export async function switchToCeloNetwork(network: 'sepolia' | 'celo' = 'sepolia') {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const networkConfig = NETWORKS[network];

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } catch (addError) {
        throw new Error('Failed to add Celo network to MetaMask');
      }
    } else {
      throw switchError;
    }
  }
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
