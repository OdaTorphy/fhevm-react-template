'use client';

import { useState, useEffect } from 'react';
import { useContract } from 'fhevm-sdk/react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';

export default function Dashboard() {
  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);

  const [stats, setStats] = useState({
    totalStations: 0,
    totalReports: 0,
    activeStations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [contract]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [stations, reports, active] = await contract.getStatistics();

      setStats({
        totalStations: Number(stations),
        totalReports: Number(reports),
        activeStations: Number(active),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Real-time statistics of the confidential pollution monitoring network.
        </p>
      </div>

      {/* SDK Integration Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">🔧 SDK Contract Integration</h3>
        <pre className="text-xs bg-white rounded p-3 overflow-x-auto">
          <code className="text-gray-800">
{`const contract = useContract(address, abi);

// Read contract state
const [stations, reports] = await contract.getStatistics();

// Contract calls are type-safe and easy to use`}
          </code>
        </pre>
      </div>

      {/* Statistics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStations}</p>
              </div>
              <div className="text-4xl">🏭</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Registered monitoring stations</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReports}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Encrypted pollution reports submitted</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Stations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeStations}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Currently operational</p>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-900">FHEVM Encryption</span>
            </div>
            <span className="text-sm text-green-600">Operational</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-900">Smart Contract</span>
            </div>
            <span className="text-sm text-green-600">Connected</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-900">Sepolia Network</span>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-mono text-gray-900">Sepolia Testnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chain ID:</span>
            <span className="font-mono text-gray-900">11155111</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Contract:</span>
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
            >
              {CONTRACT_ADDRESS}
            </a>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadStats}
        disabled={loading}
        className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? '🔄 Loading...' : '🔄 Refresh Statistics'}
      </button>
    </div>
  );
}
