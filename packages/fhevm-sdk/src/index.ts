/**
 * FHEVM SDK - Universal toolkit for confidential dApps
 * Framework-agnostic core with wagmi-like developer experience
 */

export * from './core/client';
export * from './core/encrypt';
export * from './core/decrypt';
export * from './core/types';
export * from './utils/helpers';
export * from './utils/errors';

// Core exports
export { createFhevmClient, FhevmClient } from './core/client';
export {
  encrypt8,
  encrypt16,
  encrypt32,
  encrypt64,
  encryptBool,
  encryptAddress,
  encryptBatch,
} from './core/encrypt';
export {
  userDecrypt,
  publicDecrypt,
  decryptBatch,
} from './core/decrypt';

// Type exports
export type {
  FhevmConfig,
  FhevmClient as IFhevmClient,
  EncryptedValue,
  DecryptedValue,
  EncryptionType,
  NetworkConfig,
} from './core/types';
