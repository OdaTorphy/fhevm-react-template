'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FHEContextType {
  isInitialized: boolean;
  publicKey: string | null;
  error: string | null;
  initialize: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export const useFHEContext = () => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
};

interface FHEProviderProps {
  children: React.ReactNode;
  contractAddress?: string;
}

export const FHEProvider: React.FC<FHEProviderProps> = ({
  children,
  contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    try {
      setError(null);

      // Fetch public key from API
      const response = await fetch(`/api/keys?contract=${contractAddress}`);

      if (!response.ok) {
        throw new Error('Failed to fetch public key');
      }

      const data = await response.json();
      setPublicKey(data.publicKey.key);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsInitialized(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      initialize();
    }
  }, [contractAddress]);

  const value: FHEContextType = {
    isInitialized,
    publicKey,
    error,
    initialize
  };

  return (
    <FHEContext.Provider value={value}>
      {children}
    </FHEContext.Provider>
  );
};
