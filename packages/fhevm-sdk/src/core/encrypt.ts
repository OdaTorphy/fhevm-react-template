/**
 * Encryption utilities for FHEVM
 * Standalone functions for encrypting data with FHE
 */

import type { FhevmInstance } from 'fhevmjs';
import { EncryptionError } from '../utils/errors';

/**
 * Encrypt a uint8 value
 */
export async function encrypt8(instance: FhevmInstance, value: number): Promise<Uint8Array> {
  try {
    if (value < 0 || value > 255) {
      throw new EncryptionError('Value must be between 0 and 255 for uint8');
    }
    return instance.encrypt8(value);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint8: ${error}`);
  }
}

/**
 * Encrypt a uint16 value
 */
export async function encrypt16(instance: FhevmInstance, value: number): Promise<Uint8Array> {
  try {
    if (value < 0 || value > 65535) {
      throw new EncryptionError('Value must be between 0 and 65535 for uint16');
    }
    return instance.encrypt16(value);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint16: ${error}`);
  }
}

/**
 * Encrypt a uint32 value
 */
export async function encrypt32(instance: FhevmInstance, value: number): Promise<Uint8Array> {
  try {
    if (value < 0 || value > 4294967295) {
      throw new EncryptionError('Value must be between 0 and 4294967295 for uint32');
    }
    return instance.encrypt32(value);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint32: ${error}`);
  }
}

/**
 * Encrypt a uint64 value
 */
export async function encrypt64(instance: FhevmInstance, value: bigint): Promise<Uint8Array> {
  try {
    if (value < 0n || value > 18446744073709551615n) {
      throw new EncryptionError('Value must be between 0 and 2^64-1 for uint64');
    }
    return instance.encrypt64(value);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint64: ${error}`);
  }
}

/**
 * Encrypt a boolean value
 */
export async function encryptBool(instance: FhevmInstance, value: boolean): Promise<Uint8Array> {
  try {
    return instance.encryptBool(value);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt bool: ${error}`);
  }
}

/**
 * Encrypt an Ethereum address
 */
export async function encryptAddress(instance: FhevmInstance, address: string): Promise<Uint8Array> {
  try {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new EncryptionError('Invalid Ethereum address format');
    }
    return instance.encryptAddress(address);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt address: ${error}`);
  }
}

/**
 * Batch encrypt multiple values
 */
export async function encryptBatch(
  instance: FhevmInstance,
  values: Record<string, any>
): Promise<Record<string, Uint8Array>> {
  try {
    const encrypted: Record<string, Uint8Array> = {};

    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'boolean') {
        encrypted[key] = await encryptBool(instance, value);
      } else if (typeof value === 'string' && value.startsWith('0x')) {
        encrypted[key] = await encryptAddress(instance, value);
      } else if (typeof value === 'bigint') {
        encrypted[key] = await encrypt64(instance, value);
      } else if (typeof value === 'number') {
        // Auto-detect optimal type
        if (value <= 255) {
          encrypted[key] = await encrypt8(instance, value);
        } else if (value <= 65535) {
          encrypted[key] = await encrypt16(instance, value);
        } else if (value <= 4294967295) {
          encrypted[key] = await encrypt32(instance, value);
        } else {
          encrypted[key] = await encrypt64(instance, BigInt(value));
        }
      } else {
        throw new EncryptionError(`Unsupported value type for key "${key}"`);
      }
    }

    return encrypted;
  } catch (error) {
    throw new EncryptionError(`Batch encryption failed: ${error}`);
  }
}
