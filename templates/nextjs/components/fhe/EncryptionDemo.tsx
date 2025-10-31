'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useEncryption } from '../../hooks/useEncryption';

export const EncryptionDemo: React.FC = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64'>('uint64');
  const { encrypt, isEncrypting, result, error } = useEncryption();

  const handleEncrypt = async () => {
    if (!value) return;
    await encrypt(value, type);
  };

  return (
    <Card title="Encryption Demo" subtitle="Encrypt values using FHE">
      <div className="space-y-4">
        <Input
          label="Value to Encrypt"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="uint8">uint8 (0-255)</option>
            <option value="uint16">uint16 (0-65,535)</option>
            <option value="uint32">uint32 (0-4.2B)</option>
            <option value="uint64">uint64 (0-18.4Q)</option>
          </select>
        </div>

        <Button
          onClick={handleEncrypt}
          isLoading={isEncrypting}
          disabled={!value || isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Encryption Successful</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p><strong>Type:</strong> {result.encrypted.type}</p>
              <p><strong>Original Value:</strong> {result.encrypted.value}</p>
              <p><strong>Timestamp:</strong> {new Date(result.encrypted.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
