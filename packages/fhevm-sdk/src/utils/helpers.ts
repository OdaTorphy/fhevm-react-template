/**
 * Helper utilities for FHEVM SDK
 */

/**
 * Convert Uint8Array to hex string
 */
export function toHex(data: Uint8Array): string {
  return '0x' + Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
  const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate chain ID
 */
export function isValidChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}

/**
 * Sleep utility for testing
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry utility for network operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, onRetry } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      if (onRetry) {
        onRetry(error as Error, attempt);
      }
      await sleep(delay * attempt);
    }
  }

  throw new Error('Retry failed');
}

/**
 * Determine optimal encryption type based on value
 */
export function getOptimalEncryptionType(
  value: number | bigint
): 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' {
  const num = typeof value === 'bigint' ? value : BigInt(value);

  if (num <= 255n) return 'uint8';
  if (num <= 65535n) return 'uint16';
  if (num <= 4294967295n) return 'uint32';
  if (num <= 18446744073709551615n) return 'uint64';
  if (num <= 340282366920938463463374607431768211455n) return 'uint128';
  return 'uint256';
}

/**
 * Format error message for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
