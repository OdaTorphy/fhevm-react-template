/**
 * FHE Key Management
 * Handles public/private key operations
 */

export interface KeyPair {
  publicKey: string;
  timestamp: number;
  contractAddress: string;
}

export class KeyManager {
  private static keyCache: Map<string, KeyPair> = new Map();
  private static readonly CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

  /**
   * Get or fetch public key for a contract
   */
  static async getPublicKey(contractAddress: string): Promise<string> {
    const cached = this.getCachedKey(contractAddress);
    if (cached) {
      return cached.publicKey;
    }

    const keyPair = await this.fetchPublicKey(contractAddress);
    this.cacheKey(contractAddress, keyPair);
    return keyPair.publicKey;
  }

  /**
   * Fetch public key from network
   */
  private static async fetchPublicKey(contractAddress: string): Promise<KeyPair> {
    // In production, this would fetch from FHEVM network
    // For now, return mock data
    return {
      publicKey: `mock-public-key-${contractAddress.slice(0, 10)}`,
      timestamp: Date.now(),
      contractAddress
    };
  }

  /**
   * Get cached key if still valid
   */
  private static getCachedKey(contractAddress: string): KeyPair | null {
    const cached = this.keyCache.get(contractAddress);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.keyCache.delete(contractAddress);
      return null;
    }

    return cached;
  }

  /**
   * Cache a key pair
   */
  private static cacheKey(contractAddress: string, keyPair: KeyPair): void {
    this.keyCache.set(contractAddress, keyPair);
  }

  /**
   * Clear cache for a specific contract
   */
  static clearCache(contractAddress?: string): void {
    if (contractAddress) {
      this.keyCache.delete(contractAddress);
    } else {
      this.keyCache.clear();
    }
  }

  /**
   * Refresh key for a contract
   */
  static async refreshKey(contractAddress: string): Promise<string> {
    this.clearCache(contractAddress);
    return await this.getPublicKey(contractAddress);
  }
}

export default KeyManager;
