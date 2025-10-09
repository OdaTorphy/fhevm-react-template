import { BrowserProvider, Contract, Signer } from 'ethers';
import { createInstance, FhevmInstance } from 'fhevmjs';
import type { FhevmConfig, FhevmClientInstance, NetworkConfig } from './types';
import { FhevmError } from '../utils/errors';

/**
 * Network presets
 */
const NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    gatewayUrl: 'https://gateway.zama.ai',
  },
  localhost: {
    name: 'Localhost',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
  },
  mainnet: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
  },
};

/**
 * FHEVM Client implementation
 */
export class FhevmClient implements FhevmClientInstance {
  private config: FhevmConfig;
  private instance: FhevmInstance | null = null;
  private provider: BrowserProvider;
  private signer: Signer | null = null;
  private initialized = false;

  constructor(config: FhevmConfig) {
    this.config = config;

    // Setup provider
    if (config.provider) {
      this.provider = config.provider;
    } else {
      const networkConfig = this.getNetworkConfig();
      // In browser environment, use window.ethereum
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        this.provider = new BrowserProvider((window as any).ethereum);
      } else {
        throw new FhevmError('No provider found. Please provide a provider or connect wallet.');
      }
    }
  }

  /**
   * Initialize the FHEVM client
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Get signer
      this.signer = this.config.signer || (await this.provider.getSigner());

      // Get network info
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create FHEVM instance
      this.instance = await createInstance({
        chainId,
        publicKey: await this.getPublicKeyFromContract(),
      });

      this.initialized = true;
    } catch (error) {
      throw new FhevmError(`Failed to initialize FHEVM client: ${error}`);
    }
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get public key from contract
   */
  async getPublicKey(): Promise<string> {
    this.ensureInitialized();
    return this.instance!.getPublicKey();
  }

  /**
   * Get signer
   */
  getSigner(): Signer {
    this.ensureInitialized();
    if (!this.signer) {
      throw new FhevmError('No signer available');
    }
    return this.signer;
  }

  /**
   * Get provider
   */
  getProvider(): BrowserProvider {
    return this.provider;
  }

  /**
   * Get contract instance
   */
  getContract(address: string, abi: any): Contract {
    return new Contract(address, abi, this.getSigner());
  }

  /**
   * Encrypt uint8
   */
  async encrypt8(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    return this.instance!.encrypt8(value);
  }

  /**
   * Encrypt uint16
   */
  async encrypt16(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    return this.instance!.encrypt16(value);
  }

  /**
   * Encrypt uint32
   */
  async encrypt32(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    return this.instance!.encrypt32(value);
  }

  /**
   * Encrypt uint64
   */
  async encrypt64(value: bigint | number): Promise<Uint8Array> {
    this.ensureInitialized();
    const bigIntValue = typeof value === 'number' ? BigInt(value) : value;
    return this.instance!.encrypt64(bigIntValue);
  }

  /**
   * Encrypt uint128
   */
  async encrypt128(value: bigint | number): Promise<Uint8Array> {
    this.ensureInitialized();
    const bigIntValue = typeof value === 'number' ? BigInt(value) : value;
    return this.instance!.encrypt128(bigIntValue);
  }

  /**
   * Encrypt uint256
   */
  async encrypt256(value: bigint | number): Promise<Uint8Array> {
    this.ensureInitialized();
    const bigIntValue = typeof value === 'number' ? BigInt(value) : value;
    return this.instance!.encrypt256(bigIntValue);
  }

  /**
   * Encrypt boolean
   */
  async encryptBool(value: boolean): Promise<Uint8Array> {
    this.ensureInitialized();
    return this.instance!.encryptBool(value);
  }

  /**
   * Encrypt address
   */
  async encryptAddress(address: string): Promise<Uint8Array> {
    this.ensureInitialized();
    return this.instance!.encryptAddress(address);
  }

  /**
   * Batch encrypt values
   */
  async encryptBatch(values: Record<string, any>): Promise<Record<string, Uint8Array>> {
    this.ensureInitialized();
    const encrypted: Record<string, Uint8Array> = {};

    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'boolean') {
        encrypted[key] = await this.encryptBool(value);
      } else if (typeof value === 'string' && value.startsWith('0x')) {
        encrypted[key] = await this.encryptAddress(value);
      } else if (typeof value === 'bigint' || typeof value === 'number') {
        // Auto-detect size
        const numValue = typeof value === 'bigint' ? value : BigInt(value);
        if (numValue <= 255n) {
          encrypted[key] = await this.encrypt8(Number(numValue));
        } else if (numValue <= 65535n) {
          encrypted[key] = await this.encrypt16(Number(numValue));
        } else if (numValue <= 4294967295n) {
          encrypted[key] = await this.encrypt32(Number(numValue));
        } else {
          encrypted[key] = await this.encrypt64(numValue);
        }
      }
    }

    return encrypted;
  }

  /**
   * User decrypt (requires EIP-712 signature)
   */
  async userDecrypt(data: Uint8Array, contractAddress: string): Promise<any> {
    this.ensureInitialized();
    const signer = this.getSigner();
    const address = await signer.getAddress();

    // Generate EIP-712 signature
    const signature = await this.instance!.generateSignature(contractAddress, address);

    // Decrypt with signature
    return this.instance!.decrypt(data, signature);
  }

  /**
   * Public decrypt (no signature required)
   */
  async publicDecrypt(data: Uint8Array): Promise<any> {
    this.ensureInitialized();
    return this.instance!.decrypt(data);
  }

  /**
   * Batch decrypt
   */
  async decryptBatch(data: Uint8Array[]): Promise<any[]> {
    this.ensureInitialized();
    return Promise.all(data.map((d) => this.publicDecrypt(d)));
  }

  /**
   * Get network configuration
   */
  private getNetworkConfig(): NetworkConfig {
    if (typeof this.config.network === 'string') {
      return NETWORKS[this.config.network];
    }
    return this.config.network;
  }

  /**
   * Get public key from contract (placeholder)
   */
  private async getPublicKeyFromContract(): Promise<string> {
    // In real implementation, this would fetch from the FHEVM gateway
    // For now, return a placeholder
    return '0x...'; // This should be fetched from the contract/gateway
  }

  /**
   * Ensure client is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.instance) {
      throw new FhevmError('Client not initialized. Call init() first.');
    }
  }
}

/**
 * Factory function to create FHEVM client
 */
export async function createFhevmClient(config: FhevmConfig): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.init();
  return client;
}
