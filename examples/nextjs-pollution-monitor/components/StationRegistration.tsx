'use client';

import { useState } from 'react';
import { useFhevmClient, useContract } from 'fhevm-sdk/react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';

export default function StationRegistration() {
  const client = useFhevmClient();
  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);

  const [stationName, setStationName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stationName.trim()) {
      setError('Please enter a station name');
      return;
    }

    setIsRegistering(true);
    setError('');
    setTxHash('');

    try {
      // Call contract to register station
      const tx = await contract.registerStation(stationName);
      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        alert(`✅ Station registered successfully!\nTx: ${tx.hash}`);
        setStationName('');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register station');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Monitoring Station</h2>
        <p className="text-gray-600">
          Register your environmental monitoring station on the blockchain. This will grant you
          permission to submit encrypted pollution reports.
        </p>
      </div>

      {/* SDK Integration Example */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">🔧 SDK Integration</h3>
        <pre className="text-xs bg-white rounded p-3 overflow-x-auto">
          <code className="text-gray-800">
{`const client = useFhevmClient();
const contract = useContract(address, abi);
const tx = await contract.registerStation(name);
await tx.wait();`}
          </code>
        </pre>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-2">
            Station Name
          </label>
          <input
            id="stationName"
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            placeholder="e.g., Factory North Monitoring Station"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isRegistering}
          />
          <p className="mt-1 text-sm text-gray-500">
            Choose a descriptive name for your monitoring station
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Transaction Submitted</p>
            <p className="text-sm font-mono break-all">{txHash}</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-green-900"
            >
              View on Sepolia Etherscan →
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isRegistering || !stationName.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isRegistering ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            '🏭 Register Station'
          )}
        </button>
      </form>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">After Registration</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Submit encrypted pollution reports</li>
            <li>✓ Access your station dashboard</li>
            <li>✓ View historical data</li>
            <li>✓ Manage alert thresholds</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ MetaMask wallet connected</li>
            <li>✓ Sepolia testnet ETH for gas</li>
            <li>✓ Unique station name</li>
            <li>✓ Valid Ethereum address</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
