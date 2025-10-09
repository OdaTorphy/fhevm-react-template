/**
 * React adapters for FHEVM SDK
 * Wagmi-like hooks for React applications
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FhevmClient, createFhevmClient } from '../core/client';
import type { FhevmConfig, DecryptedValue } from '../core/types';

/**
 * FHEVM Context
 */
interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isInitialized: false,
  error: null,
});

/**
 * FHEVM Provider
 */
export interface FhevmProviderProps {
  config: FhevmConfig;
  children: React.ReactNode;
}

export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initClient() {
      try {
        const fhevmClient = await createFhevmClient(config);
        if (!cancelled) {
          setClient(fhevmClient);
          setIsInitialized(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      }
    }

    initClient();

    return () => {
      cancelled = true;
    };
  }, [config]);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to use FHEVM client
 */
export function useFhevmClient(): FhevmClient {
  const { client, isInitialized, error } = useContext(FhevmContext);

  if (error) {
    throw error;
  }

  if (!isInitialized || !client) {
    throw new Error('FHEVM client not initialized. Wrap your app with <FhevmProvider>');
  }

  return client;
}

/**
 * Hook for encryption
 */
export function useEncrypt() {
  const client = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: any, type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address' = 'uint64') => {
      setIsEncrypting(true);
      setError(null);

      try {
        let result: Uint8Array;

        switch (type) {
          case 'uint8':
            result = await client.encrypt8(value);
            break;
          case 'uint16':
            result = await client.encrypt16(value);
            break;
          case 'uint32':
            result = await client.encrypt32(value);
            break;
          case 'uint64':
            result = await client.encrypt64(value);
            break;
          case 'bool':
            result = await client.encryptBool(value);
            break;
          case 'address':
            result = await client.encryptAddress(value);
            break;
          default:
            throw new Error(`Unsupported encryption type: ${type}`);
        }

        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for decryption
 */
export function useDecrypt() {
  const client = useFhevmClient();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (data: Uint8Array, contractAddress?: string): Promise<DecryptedValue> => {
      setIsDecrypting(true);
      setError(null);

      try {
        if (contractAddress) {
          return await client.userDecrypt(data, contractAddress);
        } else {
          return await client.publicDecrypt(data);
        }
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return { decrypt, isDecrypting, error };
}

/**
 * Hook for contract interaction
 */
export function useContract(address: string, abi: any) {
  const client = useFhevmClient();
  return client.getContract(address, abi);
}

/**
 * Hook for FHEVM transactions
 */
export function useFhevmTransaction(contract: any, method: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const send = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        const tx = await contract[method](...args);
        setTxHash(tx.hash);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, method]
  );

  return { send, isLoading, error, txHash };
}

/**
 * Hook for batch encryption
 */
export function useBatchEncrypt() {
  const client = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptBatch = useCallback(
    async (values: Record<string, any>) => {
      setIsEncrypting(true);
      setError(null);

      try {
        return await client.encryptBatch(values);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return { encryptBatch, isEncrypting, error };
}

/**
 * Hook for batch decryption
 */
export function useBatchDecrypt() {
  const client = useFhevmClient();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decryptBatch = useCallback(
    async (data: Uint8Array[]) => {
      setIsDecrypting(true);
      setError(null);

      try {
        return await client.decryptBatch(data);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return { decryptBatch, isDecrypting, error };
}
