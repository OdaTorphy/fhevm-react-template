'use client';

import { FhevmProvider } from 'fhevm-sdk/react';
import './globals.css';

const CONTRACT_ADDRESS = '0xc61a1997F87156dfC96CA14E66fA9E3A02D36358';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Privacy Pollution Monitor - FHEVM SDK Example</title>
        <meta name="description" content="Confidential environmental monitoring using FHEVM SDK" />
      </head>
      <body>
        <FhevmProvider
          config={{
            network: 'sepolia',
            contractAddress: CONTRACT_ADDRESS,
          }}
        >
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <span className="text-2xl">🌱</span>
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      Privacy Pollution Monitor
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Powered by FHEVM SDK
                    </span>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="mt-auto border-t bg-white">
              <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                <p>Built with FHEVM SDK • Zama Bounty Challenge</p>
                <p className="mt-1">Contract: {CONTRACT_ADDRESS}</p>
              </div>
            </footer>
          </div>
        </FhevmProvider>
      </body>
    </html>
  );
}
