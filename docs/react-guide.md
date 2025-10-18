# React Integration Guide

Complete guide for using FHEVM SDK in React applications.

---

## Setup

### 1. Install Dependencies

```bash
npm install fhevm-sdk react react-dom
```

### 2. Provider Setup

Wrap your app with `FhevmProvider`:

```jsx
import { FhevmProvider } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: '0xYourContractAddress',
      }}
    >
      <YourApp />
    </FhevmProvider>
  );
}
```

---

## Available Hooks

### `useFhevmClient()`

Access the FHEVM client instance.

```jsx
import { useFhevmClient } from 'fhevm-sdk/react';

function MyComponent() {
  const client = useFhevmClient();

  const encrypt = async () => {
    const encrypted = await client.encrypt64(42);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={encrypt}>Encrypt</button>;
}
```

### `useEncrypt()`

Simplified encryption with loading states.

```jsx
import { useEncrypt } from 'fhevm-sdk/react';

function EncryptionForm() {
  const [value, setValue] = useState('');
  const { encrypt, isEncrypting, error } = useEncrypt();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encrypted = await encrypt(parseInt(value), 'uint64');
    // Use encrypted value...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### `useDecrypt()`

Decrypt encrypted data with EIP-712 signatures.

```jsx
import { useDecrypt } from 'fhevm-sdk/react';

function DecryptButton({ encryptedData, contractAddress }) {
  const { decrypt, isDecrypting } = useDecrypt();
  const [decrypted, setDecrypted] = useState(null);

  const handleDecrypt = async () => {
    const value = await decrypt(encryptedData, contractAddress);
    setDecrypted(value);
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
      </button>
      {decrypted && <p>Value: {decrypted.toString()}</p>}
    </div>
  );
}
```

### `useContract()`

Create contract instances with automatic signer injection.

```jsx
import { useContract } from 'fhevm-sdk/react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';

function ContractInteraction() {
  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);

  const getData = async () => {
    const data = await contract.getData();
    console.log('Data:', data);
  };

  return <button onClick={getData}>Get Data</button>;
}
```

### `useFhevmTransaction()`

Manage transaction lifecycle with loading states.

```jsx
import { useFhevmTransaction, useEncrypt } from 'fhevm-sdk/react';

function SubmitForm() {
  const contract = useContract(ADDRESS, ABI);
  const { encrypt } = useEncrypt();
  const { send, isLoading, txHash } = useFhevmTransaction(contract, 'submitValue');

  const handleSubmit = async (value) => {
    const encrypted = await encrypt(value, 'uint64');
    const receipt = await send(encrypted);
    console.log('Success:', receipt);
  };

  return (
    <div>
      <button onClick={() => handleSubmit(42)} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {txHash && <p>Tx: {txHash}</p>}
    </div>
  );
}
```

---

## Complete Example

```jsx
import React, { useState } from 'react';
import {
  FhevmProvider,
  useEncrypt,
  useContract,
  useFhevmTransaction,
} from 'fhevm-sdk/react';

const CONTRACT_ADDRESS = '0x...';
const CONTRACT_ABI = [/* ABI */];

function App() {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: CONTRACT_ADDRESS,
      }}
    >
      <SubmitForm />
    </FhevmProvider>
  );
}

function SubmitForm() {
  const [value, setValue] = useState('');
  const { encrypt, isEncrypting } = useEncrypt();
  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const { send, isLoading, txHash } = useFhevmTransaction(contract, 'submitValue');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Encrypt
    const encrypted = await encrypt(parseInt(value), 'uint64');

    // Step 2: Submit to blockchain
    const receipt = await send(encrypted);

    console.log('Success!', receipt);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />
      <button disabled={isEncrypting || isLoading}>
        {isEncrypting ? 'Encrypting...' : isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {txHash && <p>Transaction: {txHash}</p>}
    </form>
  );
}

export default App;
```

---

## Best Practices

### 1. Error Boundaries

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FhevmProvider config={config}>
        <YourApp />
      </FhevmProvider>
    </ErrorBoundary>
  );
}
```

### 2. Loading States

```jsx
function Component() {
  const { encrypt, isEncrypting } = useEncrypt();
  const { send, isLoading } = useFhevmTransaction(contract, 'method');

  const isBusy = isEncrypting || isLoading;

  return (
    <button disabled={isBusy}>
      {isBusy ? 'Processing...' : 'Submit'}
    </button>
  );
}
```

### 3. Error Handling

```jsx
function Component() {
  const { encrypt, error } = useEncrypt();

  return (
    <div>
      <button onClick={handleEncrypt}>Encrypt</button>
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
```

---

For more examples, see the [Next.js Example](../examples/nextjs-pollution-monitor/).
