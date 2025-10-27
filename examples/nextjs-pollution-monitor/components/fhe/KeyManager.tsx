'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFHEContext } from './FHEProvider';

export const KeyManager: React.FC = () => {
  const { isInitialized, publicKey, error, initialize } = useFHEContext();

  return (
    <Card title="FHE Key Manager" subtitle="Manage encryption keys">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-700">Status</p>
            <p className={`text-lg font-semibold ${isInitialized ? 'text-green-600' : 'text-orange-600'}`}>
              {isInitialized ? 'Initialized' : 'Not Initialized'}
            </p>
          </div>
          <div className="flex-shrink-0">
            {isInitialized ? (
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>

        {publicKey && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Public Key</p>
            <p className="text-xs font-mono text-blue-700 break-all">
              {publicKey}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={initialize}
          variant={isInitialized ? 'secondary' : 'primary'}
          className="w-full"
        >
          {isInitialized ? 'Refresh Keys' : 'Initialize FHE'}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Keys are fetched from the FHEVM network</p>
          <p>• Public keys are used for client-side encryption</p>
          <p>• Private keys remain secure on the network</p>
        </div>
      </div>
    </Card>
  );
};
