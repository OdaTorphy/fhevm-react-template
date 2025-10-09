import type { BrowserProvider, Signer, Contract } from 'ethers';

/**
 * Network configuration for FHEVM
 */
export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  gatewayUrl?: string;
}

/**
 * FHEVM client configuration
 */
export interface FhevmConfig {
  network: 'sepolia' | 'mainnet' | 'localhost' | NetworkConfig;
  contractAddress: string;
  rpcUrl?: string;
  chainId?: number;
  gatewayUrl?: string;
  provider?: BrowserProvider;
  signer?: Signer;
}

/**
 * Encryption types supported by FHEVM
 */
export type EncryptionType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'bool'
  | 'address'
  | 'bytes';

/**
 * Encrypted value container
 */
export interface EncryptedValue {
  data: Uint8Array;
  type: EncryptionType;
}

/**
 * Decrypted value
 */
export type DecryptedValue = number | bigint | boolean | string;

/**
 * FHEVM Client instance
 */
export interface FhevmClientInstance {
  init(): Promise<void>;
  isInitialized(): boolean;
  getPublicKey(): Promise<string>;
  getSigner(): Signer;
  getProvider(): BrowserProvider;
  getContract(address: string, abi: any): Contract;
  encrypt8(value: number): Promise<Uint8Array>;
  encrypt16(value: number): Promise<Uint8Array>;
  encrypt32(value: number): Promise<Uint8Array>;
  encrypt64(value: bigint | number): Promise<Uint8Array>;
  encrypt128(value: bigint | number): Promise<Uint8Array>;
  encrypt256(value: bigint | number): Promise<Uint8Array>;
  encryptBool(value: boolean): Promise<Uint8Array>;
  encryptAddress(address: string): Promise<Uint8Array>;
  encryptBatch(values: Record<string, any>): Promise<Record<string, Uint8Array>>;
  userDecrypt(data: Uint8Array, contractAddress: string): Promise<DecryptedValue>;
  publicDecrypt(data: Uint8Array): Promise<DecryptedValue>;
  decryptBatch(data: Uint8Array[]): Promise<DecryptedValue[]>;
}

/**
 * Batch encryption input
 */
export interface BatchEncryptInput {
  [key: string]: number | bigint | boolean | string;
}

/**
 * Batch encryption output
 */
export interface BatchEncryptOutput {
  [key: string]: Uint8Array;
}

/**
 * Decryption options
 */
export interface DecryptOptions {
  contractAddress?: string;
  requireSignature?: boolean;
  eip712Domain?: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  gasLimit?: bigint;
  gasPrice?: bigint;
  value?: bigint;
  nonce?: number;
}
