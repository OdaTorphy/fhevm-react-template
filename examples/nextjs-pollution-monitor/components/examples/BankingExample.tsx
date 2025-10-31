'use client';

/**
 * Banking Example Component
 * Demonstrates confidential financial operations using FHEVM SDK
 *
 * This example shows how to:
 * - Encrypt sensitive financial data (balances, transactions)
 * - Perform confidential computations (transfers, balance checks)
 * - Decrypt results with proper authorization
 */

import React, { useState } from 'react';
import { useEncrypt, useDecrypt, useFhevmClient } from 'fhevm-sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const BankingExample: React.FC = () => {
  const client = useFhevmClient();
  const { encrypt, isEncrypting, error: encryptError } = useEncrypt();
  const { decrypt, isDecrypting, error: decryptError } = useDecrypt();

  const [balance, setBalance] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [encryptedBalance, setEncryptedBalance] = useState<Uint8Array | null>(null);
  const [decryptedResult, setDecryptedResult] = useState<any>(null);

  const handleEncryptBalance = async () => {
    try {
      const amount = parseInt(balance);
      if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid positive number');
        return;
      }

      // Auto-select appropriate encryption type based on value
      let encryptedData: Uint8Array;
      if (amount <= 255) {
        encryptedData = await encrypt(amount, 'uint8');
      } else if (amount <= 65535) {
        encryptedData = await encrypt(amount, 'uint16');
      } else if (amount <= 4294967295) {
        encryptedData = await encrypt(amount, 'uint32');
      } else {
        encryptedData = await encrypt(amount, 'uint64');
      }

      setEncryptedBalance(encryptedData);
      alert('Balance encrypted successfully!');
    } catch (err) {
      console.error('Encryption failed:', err);
      alert(`Encryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDecryptBalance = async () => {
    if (!encryptedBalance) {
      alert('Please encrypt a balance first');
      return;
    }

    try {
      // Public decrypt for demo purposes
      // In production, use userDecrypt with contract address
      const result = await decrypt(encryptedBalance);
      setDecryptedResult(result);
    } catch (err) {
      console.error('Decryption failed:', err);
      alert(`Decryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleConfidentialTransfer = async () => {
    try {
      const amount = parseInt(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid transfer amount');
        return;
      }

      const encryptedAmount = await encrypt(amount, 'uint32');

      // In a real application, you would:
      // 1. Send encryptedAmount to your smart contract
      // 2. The contract performs confidential transfer
      // 3. No one can see the transfer amount

      alert('Confidential transfer prepared! (In production, this would call your smart contract)');
      console.log('Encrypted transfer amount:', encryptedAmount);
    } catch (err) {
      console.error('Transfer preparation failed:', err);
      alert(`Transfer failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Banking Example: Confidential Transactions
      </h2>

      <div className="space-y-6">
        {/* Encrypt Balance Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            1. Encrypt Account Balance
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Encrypt your account balance so it remains private on the blockchain.
          </p>

          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Enter balance amount"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleEncryptBalance}
              disabled={isEncrypting || !balance}
              className="px-6"
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt Balance'}
            </Button>
          </div>

          {encryptedBalance && (
            <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-xs text-green-800">
                ✓ Balance encrypted successfully! Length: {encryptedBalance.length} bytes
              </p>
            </div>
          )}

          {encryptError && (
            <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-xs text-red-800">Error: {encryptError.message}</p>
            </div>
          )}
        </div>

        {/* Confidential Transfer Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            2. Confidential Transfer
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Transfer funds without revealing the amount to anyone.
          </p>

          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Transfer amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleConfidentialTransfer}
              disabled={isEncrypting || !transferAmount}
              className="px-6"
            >
              {isEncrypting ? 'Processing...' : 'Prepare Transfer'}
            </Button>
          </div>
        </div>

        {/* Decrypt Result Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            3. Decrypt Balance (Authorized Only)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Only authorized parties can decrypt and view the actual balance.
          </p>

          <Button
            onClick={handleDecryptBalance}
            disabled={isDecrypting || !encryptedBalance}
            className="px-6"
          >
            {isDecrypting ? 'Decrypting...' : 'Decrypt Balance'}
          </Button>

          {decryptedResult && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-900 font-medium">
                Decrypted Balance: ${decryptedResult.toString()}
              </p>
            </div>
          )}

          {decryptError && (
            <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-xs text-red-800">Error: {decryptError.message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border">
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Use Cases:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Private account balances</li>
          <li>• Confidential salary payments</li>
          <li>• Hidden transaction amounts</li>
          <li>• Anonymous trading</li>
          <li>• Privacy-preserving DeFi protocols</li>
        </ul>
      </div>
    </Card>
  );
};

export default BankingExample;
