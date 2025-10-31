/**
 * FHE Type Definitions
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

export interface EncryptedData {
  type: EncryptionType;
  value: string;
  timestamp: number;
}

export interface EncryptionRequest {
  value: number | string | boolean;
  type: EncryptionType;
}

export interface EncryptionResponse {
  success: boolean;
  encrypted: EncryptedData;
  message: string;
}

export interface DecryptionRequest {
  encryptedData: string;
  signature: string;
  contractAddress: string;
}

export interface DecryptionResponse {
  success: boolean;
  decrypted: {
    value: any;
    timestamp: number;
    contractAddress: string;
  };
  message: string;
}

export interface ComputationRequest {
  operation: ComputationOperation;
  operands: any[];
}

export interface ComputationResponse {
  success: boolean;
  result: {
    operation: ComputationOperation;
    operandCount: number;
    timestamp: number;
  };
  message: string;
}

export interface FHEConfig {
  contractAddress: string;
  network?: 'sepolia' | 'mainnet' | 'localhost';
  gatewayUrl?: string;
}

export interface PublicKeyData {
  contract: string;
  key: string;
  timestamp: number;
}

export interface KeyManagementRequest {
  contractAddress: string;
  action: 'generate' | 'refresh' | 'revoke';
}

export interface KeyManagementResponse {
  success: boolean;
  action: string;
  contractAddress: string;
  timestamp: number;
  message: string;
}
