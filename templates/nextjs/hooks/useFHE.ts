'use client';

/**
 * FHE Hook - Re-exports from fhevm-sdk for convenience
 * This demonstrates how to integrate the SDK into your application
 */

export { useFhevmClient, useEncrypt, useDecrypt, useContract, useFhevmTransaction, useBatchEncrypt, useBatchDecrypt } from 'fhevm-sdk/react';

// Legacy export for backward compatibility
export { useFhevmClient as useFHE } from 'fhevm-sdk/react';
