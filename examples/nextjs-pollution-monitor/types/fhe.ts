/**
 * FHE Type Definitions
 * Comprehensive type definitions for FHE operations
 */

export type EncryptionType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export type ComputationOperation =
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'eq'
  | 'ne'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'min'
  | 'max';

export interface EncryptedValue {
  type: EncryptionType;
  data: Uint8Array | string;
  timestamp?: number;
}

export interface FHEClientConfig {
  contractAddress: string;
  network?: 'sepolia' | 'mainnet' | 'localhost';
  gatewayUrl?: string;
  rpcUrl?: string;
}

export interface EncryptionResult {
  success: boolean;
  encrypted: EncryptedValue;
  message?: string;
}

export interface DecryptionResult {
  success: boolean;
  decrypted: any;
  message?: string;
}

export interface ComputationResult {
  success: boolean;
  result: EncryptedValue;
  operation: ComputationOperation;
  message?: string;
}

export interface PublicKey {
  key: string;
  contract: string;
  timestamp: number;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}

export interface EncryptionOptions {
  type: EncryptionType;
  compress?: boolean;
  validate?: boolean;
}

export interface DecryptionOptions {
  signature: string;
  contractAddress: string;
  verifySignature?: boolean;
}

export interface ComputationOptions {
  operation: ComputationOperation;
  operands: EncryptedValue[];
  optimize?: boolean;
}
