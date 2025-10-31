/**
 * Decryption utilities for FHEVM
 * Standalone functions for decrypting FHE data
 */

import type { FhevmInstance } from 'fhevmjs';
import { DecryptionError } from '../utils/errors';
import type { DecryptedValue } from './types';

/**
 * Decrypt data with user signature (EIP-712)
 * Requires authorization from the user
 */
export async function userDecrypt(
  instance: FhevmInstance,
  data: Uint8Array,
  contractAddress: string,
  userAddress: string
): Promise<DecryptedValue> {
  try {
    // Generate EIP-712 signature for authorization
    const signature = await instance.generateSignature(contractAddress, userAddress);

    // Decrypt with signature
    const decrypted = await instance.decrypt(data, signature);

    return {
      value: decrypted,
      timestamp: Date.now(),
      authorized: true,
    };
  } catch (error) {
    throw new DecryptionError(`User decryption failed: ${error}`);
  }
}

/**
 * Decrypt public data (no signature required)
 * Only works for data that doesn't require authorization
 */
export async function publicDecrypt(
  instance: FhevmInstance,
  data: Uint8Array
): Promise<DecryptedValue> {
  try {
    const decrypted = await instance.decrypt(data);

    return {
      value: decrypted,
      timestamp: Date.now(),
      authorized: false,
    };
  } catch (error) {
    throw new DecryptionError(`Public decryption failed: ${error}`);
  }
}

/**
 * Batch decrypt multiple encrypted values
 */
export async function decryptBatch(
  instance: FhevmInstance,
  dataArray: Uint8Array[],
  contractAddress?: string,
  userAddress?: string
): Promise<DecryptedValue[]> {
  try {
    const results: DecryptedValue[] = [];

    for (const data of dataArray) {
      if (contractAddress && userAddress) {
        results.push(await userDecrypt(instance, data, contractAddress, userAddress));
      } else {
        results.push(await publicDecrypt(instance, data));
      }
    }

    return results;
  } catch (error) {
    throw new DecryptionError(`Batch decryption failed: ${error}`);
  }
}

/**
 * Verify if data can be decrypted
 */
export async function canDecrypt(
  instance: FhevmInstance,
  data: Uint8Array
): Promise<boolean> {
  try {
    await publicDecrypt(instance, data);
    return true;
  } catch {
    return false;
  }
}
