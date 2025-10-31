/**
 * API Type Definitions
 * Type definitions for API requests and responses
 */

import { EncryptionType, ComputationOperation } from './fhe';

// Base API Response
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: number;
}

// Encryption API
export interface EncryptAPIRequest {
  value: number | string | boolean;
  type: EncryptionType;
}

export interface EncryptAPIResponse extends APIResponse {
  encrypted?: {
    type: EncryptionType;
    value: string;
    timestamp: number;
  };
}

// Decryption API
export interface DecryptAPIRequest {
  encryptedData: string;
  signature: string;
  contractAddress: string;
}

export interface DecryptAPIResponse extends APIResponse {
  decrypted?: {
    value: any;
    timestamp: number;
    contractAddress: string;
  };
}

// Computation API
export interface ComputeAPIRequest {
  operation: ComputationOperation;
  operands: any[];
}

export interface ComputeAPIResponse extends APIResponse {
  result?: {
    operation: ComputationOperation;
    operandCount: number;
    timestamp: number;
  };
}

// Key Management API
export interface KeysAPIRequest {
  contractAddress: string;
  action?: 'generate' | 'refresh' | 'revoke';
}

export interface KeysAPIResponse extends APIResponse {
  publicKey?: {
    contract: string;
    key: string;
    timestamp: number;
  };
  action?: string;
}

// Generic Error Response
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp?: number;
}

// Pagination
export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends APIResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
