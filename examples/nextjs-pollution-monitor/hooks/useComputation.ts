'use client';

/**
 * Computation Hook - Wrapper around fhevm-sdk for contract interactions
 * This demonstrates how to use the SDK for contract interactions and computations
 */

import { useContract, useFhevmTransaction } from 'fhevm-sdk/react';

// Re-export for convenience
export { useContract, useFhevmTransaction, useDecrypt, useBatchDecrypt } from 'fhevm-sdk/react';

export default useFhevmTransaction;
