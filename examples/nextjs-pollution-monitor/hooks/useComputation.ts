'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';
import { ComputationOperation, ComputationResponse } from '../lib/fhe/types';

interface UseComputationReturn {
  compute: (operation: ComputationOperation, operands: any[]) => Promise<void>;
  isComputing: boolean;
  result: ComputationResponse | null;
  error: string | null;
  reset: () => void;
}

export const useComputation = (): UseComputationReturn => {
  const { client, isInitialized } = useFHE();
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<ComputationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(async (operation: ComputationOperation, operands: any[]) => {
    if (!client || !isInitialized) {
      setError('FHE client not initialized');
      return;
    }

    if (!operands || operands.length < 2) {
      setError('At least 2 operands are required');
      return;
    }

    setIsComputing(true);
    setError(null);
    setResult(null);

    try {
      const response = await client.compute(operation, operands);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Computation failed';
      setError(errorMessage);
    } finally {
      setIsComputing(false);
    }
  }, [client, isInitialized]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    result,
    error,
    reset
  };
};

export default useComputation;
