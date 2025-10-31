'use client';

/**
 * Encryption Hook - Wrapper around fhevm-sdk for convenient encryption
 * This demonstrates how to use the SDK's encryption functionality
 */

import { useEncrypt } from 'fhevm-sdk/react';

// Re-export for convenience
export { useEncrypt as useEncryption, useBatchEncrypt } from 'fhevm-sdk/react';

export default useEncrypt;
