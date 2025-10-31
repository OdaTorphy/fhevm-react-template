'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useComputation } from '../../hooks/useComputation';

export const ComputationDemo: React.FC = () => {
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'div'>('add');
  const { compute, isComputing, result, error } = useComputation();

  const handleCompute = async () => {
    if (!operand1 || !operand2) return;
    await compute(operation, [operand1, operand2]);
  };

  const operationLabels = {
    add: 'Addition (+)',
    sub: 'Subtraction (-)',
    mul: 'Multiplication (×)',
    div: 'Division (÷)'
  };

  return (
    <Card title="Homomorphic Computation" subtitle="Perform operations on encrypted data">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Operand 1"
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            placeholder="First value"
          />
          <Input
            label="Operand 2"
            type="number"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            placeholder="Second value"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(operationLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!operand1 || !operand2 || isComputing}
          className="w-full"
        >
          {isComputing ? 'Computing...' : 'Perform Computation'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Computation Complete</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Operation:</strong> {operationLabels[operation]}</p>
              <p><strong>Operands:</strong> {result.result.operandCount}</p>
              <p><strong>Result:</strong> Encrypted (homomorphic operation successful)</p>
              <p className="text-xs mt-2 text-blue-600">
                Note: Result remains encrypted and can only be decrypted by authorized parties
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
