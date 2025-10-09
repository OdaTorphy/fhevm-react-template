'use client';

import { useState } from 'react';
import StationRegistration from '@/components/StationRegistration';
import PollutionReporter from '@/components/PollutionReporter';
import Dashboard from '@/components/Dashboard';
import WalletConnect from '@/components/WalletConnect';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'report'>('dashboard');

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Privacy Pollution Monitor 🌱
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Confidential environmental monitoring using Fully Homomorphic Encryption (FHE).
          Report pollution data while keeping measurements completely private.
        </p>

        {/* Wallet Connection */}
        <WalletConnect />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="font-semibold text-gray-900 mb-1">Encrypted Data</h3>
            <p className="text-sm text-gray-600">
              All measurements encrypted with FHEVM SDK
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🏭</div>
            <h3 className="font-semibold text-gray-900 mb-1">Industrial Privacy</h3>
            <p className="text-sm text-gray-600">
              Report honestly without exposing data
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">Zero-Knowledge</h3>
            <p className="text-sm text-gray-600">
              Verify compliance without revealing values
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏭 Register Station
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'report'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 Submit Report
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'register' && <StationRegistration />}
          {activeTab === 'report' && <PollutionReporter />}
        </div>
      </div>

      {/* SDK Demo Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 FHEVM SDK Integration
        </h2>
        <p className="text-gray-700 mb-4">
          This example demonstrates the complete FHEVM SDK integration in a Next.js application.
        </p>

        <div className="bg-white rounded-lg p-4 font-mono text-sm">
          <div className="text-gray-500 mb-2">// Setup (in layout.tsx)</div>
          <div className="text-purple-600">&lt;FhevmProvider</div>
          <div className="pl-4 text-gray-700">config=&#123;&#123;</div>
          <div className="pl-8 text-gray-700">network: <span className="text-green-600">'sepolia'</span>,</div>
          <div className="pl-8 text-gray-700">contractAddress: <span className="text-green-600">'0x...'</span></div>
          <div className="pl-4 text-gray-700">&#125;&#125;</div>
          <div className="text-purple-600">&gt;</div>
          <div className="pl-4 text-gray-500">&#123;children&#125;</div>
          <div className="text-purple-600">&lt;/FhevmProvider&gt;</div>

          <div className="mt-4 text-gray-500">// Use in components</div>
          <div className="text-blue-600">const</div> <span className="text-gray-700">&#123; encrypt &#125; =</span> <span className="text-purple-600">useEncrypt</span>();
          <div className="text-blue-600">const</div> <span className="text-gray-700">encrypted =</span> <span className="text-blue-600">await</span> <span className="text-purple-600">encrypt</span>(<span className="text-orange-600">42</span>, <span className="text-green-600">'uint64'</span>);
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <a
            href="https://docs.zama.ai/fhevm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            FHEVM Documentation →
          </a>
          <a
            href="https://github.com/yourusername/fhevm-react-template"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            SDK GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
