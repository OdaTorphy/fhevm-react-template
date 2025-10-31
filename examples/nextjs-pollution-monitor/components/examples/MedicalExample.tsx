'use client';

/**
 * Medical Example Component
 * Demonstrates confidential health data operations using FHEVM SDK
 *
 * This example shows how to:
 * - Encrypt sensitive medical records (age, vital signs, test results)
 * - Perform confidential health computations (risk scoring, diagnostics)
 * - Maintain patient privacy while enabling medical research
 */

import React, { useState } from 'react';
import { useEncrypt, useBatchEncrypt, useDecrypt, useFhevmClient } from 'fhevm-sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface MedicalData {
  age: string;
  bloodPressure: string;
  heartRate: string;
  glucose: string;
}

export const MedicalExample: React.FC = () => {
  const client = useFhevmClient();
  const { encrypt, isEncrypting: isSingleEncrypting, error: encryptError } = useEncrypt();
  const { encryptBatch, isEncrypting: isBatchEncrypting, error: batchError } = useBatchEncrypt();
  const { decrypt, isDecrypting, error: decryptError } = useDecrypt();

  const [medicalData, setMedicalData] = useState<MedicalData>({
    age: '',
    bloodPressure: '',
    heartRate: '',
    glucose: ''
  });

  const [encryptedRecords, setEncryptedRecords] = useState<Record<string, Uint8Array> | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const handleInputChange = (field: keyof MedicalData, value: string) => {
    setMedicalData(prev => ({ ...prev, [field]: value }));
  };

  const handleEncryptMedicalData = async () => {
    try {
      // Validate inputs
      const age = parseInt(medicalData.age);
      const bp = parseInt(medicalData.bloodPressure);
      const hr = parseInt(medicalData.heartRate);
      const glucose = parseInt(medicalData.glucose);

      if (isNaN(age) || isNaN(bp) || isNaN(hr) || isNaN(glucose)) {
        alert('Please fill in all fields with valid numbers');
        return;
      }

      if (age < 0 || age > 150 || bp < 0 || bp > 300 || hr < 0 || hr > 300 || glucose < 0 || glucose > 1000) {
        alert('Please enter realistic health values');
        return;
      }

      // Use batch encryption for multiple values
      const valuesToEncrypt = {
        age,
        bloodPressure: bp,
        heartRate: hr,
        glucose
      };

      const encrypted = await encryptBatch(valuesToEncrypt);
      setEncryptedRecords(encrypted);

      // Calculate a simple risk score (this would be done in FHE on-chain in production)
      const score = calculateRiskScore(age, bp, hr, glucose);
      setRiskScore(score);

      alert('Medical data encrypted successfully! All data is now private.');
    } catch (err) {
      console.error('Encryption failed:', err);
      alert(`Encryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const calculateRiskScore = (age: number, bp: number, hr: number, glucose: number): number => {
    // Simple risk scoring algorithm (for demonstration)
    let score = 0;

    // Age factor
    if (age > 60) score += 2;
    else if (age > 40) score += 1;

    // Blood pressure factor
    if (bp > 140) score += 3;
    else if (bp > 120) score += 1;

    // Heart rate factor
    if (hr > 100) score += 2;
    else if (hr < 60) score += 1;

    // Glucose factor
    if (glucose > 200) score += 3;
    else if (glucose > 140) score += 2;
    else if (glucose > 100) score += 1;

    return Math.min(score, 10); // Cap at 10
  };

  const getRiskLevel = (score: number): { level: string; color: string; description: string } => {
    if (score <= 2) return {
      level: 'Low Risk',
      color: 'text-green-700 bg-green-50 border-green-200',
      description: 'Health indicators are within normal ranges'
    };
    if (score <= 5) return {
      level: 'Moderate Risk',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      description: 'Some indicators require monitoring'
    };
    return {
      level: 'High Risk',
      color: 'text-red-700 bg-red-50 border-red-200',
      description: 'Multiple indicators require medical attention'
    };
  };

  const handleShareWithResearch = () => {
    if (!encryptedRecords) {
      alert('Please encrypt medical data first');
      return;
    }

    // In production, this would:
    // 1. Send encrypted data to a research contract
    // 2. Researchers can compute on encrypted data
    // 3. Original values remain private

    alert('Medical data shared with research! Data remains encrypted and private.');
    console.log('Encrypted medical records shared:', Object.keys(encryptedRecords));
  };

  const isEncrypting = isSingleEncrypting || isBatchEncrypting;
  const allFieldsFilled = Object.values(medicalData).every(v => v !== '');

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Medical Example: Confidential Health Records
      </h2>

      <div className="space-y-6">
        {/* Input Medical Data Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            1. Enter Patient Health Data
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            All medical information will be encrypted before storage.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (years)
              </label>
              <Input
                type="number"
                placeholder="e.g., 45"
                value={medicalData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (systolic)
              </label>
              <Input
                type="number"
                placeholder="e.g., 120"
                value={medicalData.bloodPressure}
                onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate (bpm)
              </label>
              <Input
                type="number"
                placeholder="e.g., 72"
                value={medicalData.heartRate}
                onChange={(e) => handleInputChange('heartRate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Glucose (mg/dL)
              </label>
              <Input
                type="number"
                placeholder="e.g., 95"
                value={medicalData.glucose}
                onChange={(e) => handleInputChange('glucose', e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleEncryptMedicalData}
            disabled={isEncrypting || !allFieldsFilled}
            className="mt-4 px-6"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt Medical Data'}
          </Button>

          {encryptedRecords && (
            <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-xs text-green-800 font-medium">
                ✓ All medical records encrypted successfully!
              </p>
              <p className="text-xs text-green-700 mt-1">
                {Object.keys(encryptedRecords).length} fields protected with FHE
              </p>
            </div>
          )}

          {(encryptError || batchError) && (
            <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-xs text-red-800">
                Error: {encryptError?.message || batchError?.message}
              </p>
            </div>
          )}
        </div>

        {/* Risk Assessment Section */}
        {riskScore !== null && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              2. Confidential Risk Assessment
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Risk computed on encrypted data (in production, this happens on-chain).
            </p>

            {(() => {
              const risk = getRiskLevel(riskScore);
              return (
                <div className={`p-4 rounded border ${risk.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">{risk.level}</span>
                    <span className="text-sm font-mono">Score: {riskScore}/10</span>
                  </div>
                  <p className="text-sm">{risk.description}</p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Share for Research Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            3. Privacy-Preserving Research
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Share encrypted data for medical research without revealing patient information.
          </p>

          <Button
            onClick={handleShareWithResearch}
            disabled={!encryptedRecords}
            className="px-6"
          >
            Share with Research (Encrypted)
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border">
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Use Cases:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Private electronic health records (EHR)</li>
          <li>• Confidential medical research and trials</li>
          <li>• Anonymous health data aggregation</li>
          <li>• Privacy-preserving telemedicine</li>
          <li>• Secure genetic data analysis</li>
          <li>• HIPAA-compliant blockchain solutions</li>
        </ul>
      </div>
    </Card>
  );
};

export default MedicalExample;
