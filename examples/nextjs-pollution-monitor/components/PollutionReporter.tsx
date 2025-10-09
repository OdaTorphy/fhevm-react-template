'use client';

import { useState } from 'react';
import { useEncrypt, useContract, useFhevmTransaction } from 'fhevm-sdk/react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';

const POLLUTANT_TYPES = {
  PM25: { id: 1, name: 'PM2.5', unit: 'μg/m³', threshold: 35 },
  PM10: { id: 2, name: 'PM10', unit: 'μg/m³', threshold: 150 },
  SO2: { id: 3, name: 'SO₂', unit: 'μg/m³', threshold: 75 },
  NO2: { id: 4, name: 'NO₂', unit: 'μg/m³', threshold: 100 },
  OZONE: { id: 5, name: 'O₃', unit: 'μg/m³', threshold: 70 },
  HEAVY_METALS: { id: 6, name: 'Heavy Metals', unit: 'μg/m³', threshold: 0 },
};

export default function PollutionReporter() {
  const { encrypt, isEncrypting } = useEncrypt();
  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const { send, isLoading, txHash } = useFhevmTransaction(contract, 'submitReport');

  const [pollutantType, setPollutantType] = useState<keyof typeof POLLUTANT_TYPES>('PM25');
  const [measurement, setMeasurement] = useState('');
  const [severity, setSeverity] = useState(3);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculateSeverity = (value: number, threshold: number): number => {
    if (value < threshold * 0.5) return 1; // Low
    if (value < threshold) return 2; // Moderate
    if (value < threshold * 1.5) return 3; // High
    if (value < threshold * 2) return 4; // Very High
    return 5; // Critical
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(measurement);
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid measurement');
      return;
    }

    setError('');
    setSuccess(false);

    try {
      // Step 1: Encrypt the measurement using FHEVM SDK
      console.log('🔐 Encrypting measurement:', value);
      const encryptedValue = await encrypt(value, 'uint64');
      console.log('✅ Encryption complete');

      // Step 2: Calculate severity
      const pollutant = POLLUTANT_TYPES[pollutantType];
      const autoSeverity = calculateSeverity(value, pollutant.threshold);
      setSeverity(autoSeverity);

      // Step 3: Submit encrypted report to blockchain
      console.log('📝 Submitting encrypted report...');
      const receipt = await send(encryptedValue, pollutant.id, autoSeverity);

      if (receipt.status === 1) {
        setSuccess(true);
        setMeasurement('');
        alert(
          `✅ Report submitted successfully!\n\n` +
          `Pollutant: ${pollutant.name}\n` +
          `Severity: ${autoSeverity}/5\n` +
          `Tx: ${txHash}`
        );
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit report');
    }
  };

  const pollutant = POLLUTANT_TYPES[pollutantType];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submit Encrypted Pollution Report
        </h2>
        <p className="text-gray-600">
          Submit confidential pollution measurements. Your data will be encrypted using FHE before
          being sent to the blockchain, ensuring complete privacy.
        </p>
      </div>

      {/* SDK Integration Demo */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">🔧 SDK Encryption Flow</h3>
        <pre className="text-xs bg-white rounded p-3 overflow-x-auto">
          <code className="text-gray-800">
{`const { encrypt, isEncrypting } = useEncrypt();

// Encrypt measurement (client-side)
const encrypted = await encrypt(125, 'uint64');

// Submit encrypted data to contract
await contract.submitReport(
  encrypted,      // euint64 - fully encrypted
  pollutantType,  // uint8
  severity        // uint8
);`}
          </code>
        </pre>
        <p className="text-xs text-purple-700 mt-2">
          ✨ The actual measurement value (125 μg/m³) is never exposed on-chain
        </p>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pollutant Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pollutant Type
          </label>
          <select
            value={pollutantType}
            onChange={(e) => setPollutantType(e.target.value as keyof typeof POLLUTANT_TYPES)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isEncrypting || isLoading}
          >
            {Object.entries(POLLUTANT_TYPES).map(([key, type]) => (
              <option key={key} value={key}>
                {type.name} - Threshold: {type.threshold} {type.unit}
              </option>
            ))}
          </select>
        </div>

        {/* Measurement Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Measurement ({pollutant.unit})
          </label>
          <input
            type="number"
            step="0.01"
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
            placeholder={`Enter ${pollutant.name} measurement`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isEncrypting || isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Threshold: {pollutant.threshold} {pollutant.unit}
            {measurement && (
              <span
                className={`ml-2 font-medium ${
                  parseFloat(measurement) > pollutant.threshold
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {parseFloat(measurement) > pollutant.threshold
                  ? '⚠️ Above threshold'
                  : '✓ Within limits'}
              </span>
            )}
          </p>
        </div>

        {/* Severity Display */}
        {measurement && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-calculated Severity
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((level) => {
                const autoSeverity = calculateSeverity(
                  parseFloat(measurement),
                  pollutant.threshold
                );
                return (
                  <div
                    key={level}
                    className={`w-12 h-8 rounded flex items-center justify-center font-bold ${
                      level <= autoSeverity
                        ? level <= 2
                          ? 'bg-green-500 text-white'
                          : level === 3
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {level}
                  </div>
                );
              })}
              <span className="text-sm text-gray-600 ml-2">
                Level {calculateSeverity(parseFloat(measurement), pollutant.threshold)} / 5
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && txHash && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">✅ Report Submitted Successfully!</p>
            <p className="text-sm font-mono break-all mt-1">{txHash}</p>
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
          disabled={isEncrypting || isLoading || !measurement}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isEncrypting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              🔐 Encrypting Data...
            </span>
          ) : isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              📝 Submitting to Blockchain...
            </span>
          ) : (
            '🔐 Encrypt & Submit Report'
          )}
        </button>
      </form>

      {/* Privacy Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔒 Privacy Guarantees</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Measurement value is encrypted before leaving your browser</li>
          <li>✓ Only you can decrypt your specific reports (with EIP-712 signature)</li>
          <li>✓ Blockchain stores encrypted data (euint64) - actual value never exposed</li>
          <li>✓ Homomorphic comparisons done without revealing measurements</li>
        </ul>
      </div>
    </div>
  );
}
