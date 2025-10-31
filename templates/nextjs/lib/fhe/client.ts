/**
 * Client-side FHE Operations
 * Handles encryption and client-side FHE functionality
 */

export class FHEClient {
  private publicKey: string | null = null;
  private contractAddress: string;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
  }

  /**
   * Initialize the FHE client with public key
   */
  async initialize(): Promise<void> {
    try {
      const response = await fetch(`/api/keys?contract=${this.contractAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch public key');
      }
      const data = await response.json();
      this.publicKey = data.publicKey.key;
    } catch (error) {
      throw new Error(`FHE initialization failed: ${error}`);
    }
  }

  /**
   * Encrypt a value
   */
  async encrypt(value: number | string | boolean, type: string): Promise<any> {
    if (!this.publicKey) {
      throw new Error('FHE client not initialized');
    }

    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type })
      });

      if (!response.ok) {
        throw new Error('Encryption failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Encryption error: ${error}`);
    }
  }

  /**
   * Decrypt encrypted data
   */
  async decrypt(encryptedData: string, signature: string): Promise<any> {
    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedData,
          signature,
          contractAddress: this.contractAddress
        })
      });

      if (!response.ok) {
        throw new Error('Decryption failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Decryption error: ${error}`);
    }
  }

  /**
   * Perform homomorphic computation
   */
  async compute(operation: string, operands: any[]): Promise<any> {
    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands })
      });

      if (!response.ok) {
        throw new Error('Computation failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Computation error: ${error}`);
    }
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.publicKey !== null;
  }

  /**
   * Get public key
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }
}

export default FHEClient;
