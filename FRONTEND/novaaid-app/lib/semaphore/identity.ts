import { Identity } from '@semaphore-protocol/identity';

export interface SemaphoreIdentity {
  commitment: string;
  identityString: string;
  trapdoor: bigint;
  nullifier: bigint;
  isNew: boolean;
}

/**
 * Generate a random salt for identity creation
 */
export function generateRandomSalt(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a Semaphore identity from a salt
 */
export function createIdentity(salt: string): Identity {
  return new Identity(salt);
}

/**
 * Get or create a Semaphore identity for a user
 * Identity is stored in localStorage (client-side only)
 * IMPORTANT: Trapdoor and nullifier never leave the client!
 */
export function getOrCreateIdentity(userId: string): SemaphoreIdentity {
  const storageKey = `semaphore_identity_${userId}`;
  
  // Try to load existing identity
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const identity = new Identity(parsed.identityString);
        return {
          commitment: '0x' + identity.commitment.toString(16).padStart(64, '0'),
          identityString: parsed.identityString,
          trapdoor: parsed.trapdoor || (identity as any).trapdoor,
          nullifier: parsed.nullifier || (identity as any).nullifier,
          isNew: false
        };
      } catch (error) {
        console.error("Failed to load existing identity, creating new one:", error);
      }
    }
  }
  
  // Create new identity
  const identity = new Identity();
  const identityString = identity.toString();
  
  // Store identity (only in browser)
  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify({
      identityString,
      createdAt: new Date().toISOString()
    }));
  }
  
  return {
    commitment: '0x' + identity.commitment.toString(16).padStart(64, '0'),
    identityString,
    trapdoor: identity.trapdoor,
    nullifier: identity.nullifier,
    isNew: true
  };
}

/**
 * Load existing identity from localStorage
 */
export function loadIdentity(userId: string): Identity | null {
  if (typeof window === 'undefined') return null;
  
  const storageKey = `semaphore_identity_${userId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return new Identity(parsed.identityString);
  } catch (error) {
    console.error("Failed to load identity:", error);
    return null;
  }
}

/**
 * Export identity for backup
 */
export function exportIdentity(userId: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const storageKey = `semaphore_identity_${userId}`;
  const stored = localStorage.getItem(storageKey);
  return stored;
}

/**
 * Import identity from backup
 */
export function importIdentity(userId: string, backup: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const parsed = JSON.parse(backup);
    const identity = new Identity(parsed.identityString);
    
    const storageKey = `semaphore_identity_${userId}`;
    localStorage.setItem(storageKey, backup);
    
    return true;
  } catch (error) {
    console.error("Failed to import identity:", error);
    return false;
  }
}

/**
 * Clear identity (use with caution!)
 */
export function clearIdentity(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const storageKey = `semaphore_identity_${userId}`;
  localStorage.removeItem(storageKey);
}

/**
 * Check if user has a stored identity
 */
export function hasStoredIdentity(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  const storageKey = `semaphore_identity_${userId}`;
  return localStorage.getItem(storageKey) !== null;
}
