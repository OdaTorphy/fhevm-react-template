'use client';

import { useState, useEffect, useCallback } from 'react';
import FHEClient from '../lib/fhe/client';

interface UseFHEReturn {
  client: FHEClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

export const useFHE = (contractAddress?: string): UseFHEReturn => {
  const [client, setClient] = useState<FHEClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    const address = contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!address) {
      setError('No contract address provided');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const fheClient = new FHEClient(address);
      await fheClient.initialize();
      setClient(fheClient);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Initialization failed';
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  }, [contractAddress]);

  useEffect(() => {
    if (!isInitialized && !isInitializing && !error) {
      initialize();
    }
  }, [initialize, isInitialized, isInitializing, error]);

  return {
    client,
    isInitialized,
    isInitializing,
    error,
    initialize
  };
};

export default useFHE;
