'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';
import { EncryptionType, EncryptionResponse } from '../lib/fhe/types';

interface UseEncryptionReturn {
  encrypt: (value: number | string | boolean, type: EncryptionType) => Promise<void>;
  isEncrypting: boolean;
  result: EncryptionResponse | null;
  error: string | null;
  reset: () => void;
}

export const useEncryption = (): UseEncryptionReturn => {
  const { client, isInitialized } = useFHE();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [result, setResult] = useState<EncryptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(async (value: number | string | boolean, type: EncryptionType) => {
    if (!client || !isInitialized) {
      setError('FHE client not initialized');
      return;
    }

    setIsEncrypting(true);
    setError(null);
    setResult(null);

    try {
      const response = await client.encrypt(value, type);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
    } finally {
      setIsEncrypting(false);
    }
  }, [client, isInitialized]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    encrypt,
    isEncrypting,
    result,
    error,
    reset
  };
};

export default useEncryption;
