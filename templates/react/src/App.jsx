import { useState } from 'react';
import { FhevmProvider, useEncrypt, useFhevmClient } from 'fhevm-sdk/react';

const CONTRACT_ADDRESS = '0xYourContractAddressHere';

function App() {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: CONTRACT_ADDRESS,
      }}
    >
      <div className="App">
        <h1>FHEVM SDK - Basic React Example</h1>
        <EncryptionDemo />
      </div>
    </FhevmProvider>
  );
}

function EncryptionDemo() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const { encrypt, isEncrypting, error } = useEncrypt();
  const client = useFhevmClient();

  const handleEncrypt = async (e) => {
    e.preventDefault();

    if (!value) {
      alert('Please enter a value');
      return;
    }

    try {
      // Encrypt the value
      const encrypted = await encrypt(parseInt(value), 'uint64');

      // Convert to hex string for display
      const hex = Array.from(encrypted)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      setResult(`Encrypted: 0x${hex.substring(0, 64)}...`);
      console.log('Full encrypted value:', encrypted);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <div className="demo">
      <h2>Encryption Demo</h2>
      <form onSubmit={handleEncrypt}>
        <div>
          <label htmlFor="value">Enter a number to encrypt:</label>
          <input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 42"
            disabled={isEncrypting}
          />
        </div>

        <button type="submit" disabled={isEncrypting || !value}>
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>
      </form>

      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}

      {result && (
        <div className="result">
          {result}
        </div>
      )}

      <div className="info">
        <h3>How it works:</h3>
        <ol>
          <li>Enter a number (0 to 2^64-1)</li>
          <li>Click "Encrypt Value"</li>
          <li>SDK encrypts using FHE</li>
          <li>Encrypted value shown as hex</li>
        </ol>
        <p>
          <strong>Note:</strong> The encrypted value can be safely sent to
          a blockchain smart contract without revealing the original number.
        </p>
      </div>
    </div>
  );
}

export default App;
