# Getting Started with FHEVM SDK

Complete guide to installing and using the FHEVM SDK in your project.

---

## Installation

### NPM

```bash
npm install fhevm-sdk
```

### Yarn

```bash
yarn add fhevm-sdk
```

### PNPM

```bash
pnpm add fhevm-sdk
```

---

## Quick Start

### 1. Basic Setup (Vanilla JavaScript)

```javascript
import { createFhevmClient } from 'fhevm-sdk';

// Initialize client
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0xYourContractAddress',
});

// Encrypt a value
const encrypted = await client.encrypt64(42);

// Use in contract call
const tx = await contract.submitData(encrypted);
await tx.wait();
```

### 2. React Setup

```jsx
import { FhevmProvider, useEncrypt, useFhevmClient } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: '0xYourContractAddress',
      }}
    >
      <YourComponents />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { encrypt, isEncrypting } = useEncrypt();

  const handleSubmit = async (value) => {
    const encrypted = await encrypt(value, 'uint64');
    // Use encrypted value...
  };

  return <button onClick={() => handleSubmit(42)}>Submit</button>;
}
```

### 3. Next.js Setup

```tsx
// app/layout.tsx
import { FhevmProvider } from 'fhevm-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider
          config={{
            network: 'sepolia',
            contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          }}
        >
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';

import { useEncrypt } from 'fhevm-sdk/react';

export default function Page() {
  const { encrypt } = useEncrypt();
  // Use SDK hooks...
}
```

---

## Configuration Options

```typescript
interface FhevmConfig {
  // Required: Network to connect to
  network: 'sepolia' | 'mainnet' | 'localhost';

  // Required: Contract address for FHEVM operations
  contractAddress: string;

  // Optional: Custom RPC URL
  rpcUrl?: string;

  // Optional: Gateway URL for decryption
  gatewayUrl?: string;

  // Optional: Public key for encryption
  publicKey?: string;

  // Optional: Chain ID (auto-detected from network)
  chainId?: number;
}
```

### Example Configurations

**Sepolia Testnet:**
```javascript
const config = {
  network: 'sepolia',
  contractAddress: '0x...',
};
```

**Custom RPC:**
```javascript
const config = {
  network: 'sepolia',
  contractAddress: '0x...',
  rpcUrl: 'https://your-custom-rpc.com',
};
```

**With Gateway:**
```javascript
const config = {
  network: 'sepolia',
  contractAddress: '0x...',
  gatewayUrl: 'https://gateway.zama.ai',
};
```

---

## Core Concepts

### 1. Client Initialization

The FHEVM client must be initialized before any encryption/decryption operations:

```javascript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient(config);

// Client is now ready for operations
await client.encrypt64(42);
```

### 2. Encryption Types

The SDK supports multiple encryption types:

```javascript
// 64-bit unsigned integer
const encrypted64 = await client.encrypt64(1000);

// 32-bit unsigned integer
const encrypted32 = await client.encrypt32(500);

// 16-bit unsigned integer
const encrypted16 = await client.encrypt16(100);

// 8-bit unsigned integer
const encrypted8 = await client.encrypt8(10);

// Boolean
const encryptedBool = await client.encryptBool(true);

// Address
const encryptedAddress = await client.encryptAddress('0x...');
```

### 3. Contract Interaction

```javascript
import { ethers } from 'ethers';

// Connect to wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Create contract instance
const contract = new ethers.Contract(address, abi, signer);

// Encrypt and submit
const encrypted = await client.encrypt64(42);
const tx = await contract.submitValue(encrypted);
await tx.wait();
```

### 4. Decryption with EIP-712

```javascript
// Decrypt encrypted data (requires user signature)
const decrypted = await client.userDecrypt(
  encryptedData,
  contractAddress
);

console.log('Decrypted value:', decrypted);
```

---

## Common Patterns

### Pattern 1: Encrypt and Submit

```javascript
async function submitEncryptedValue(value) {
  try {
    // 1. Encrypt
    const encrypted = await client.encrypt64(value);

    // 2. Submit to contract
    const tx = await contract.submitValue(encrypted);

    // 3. Wait for confirmation
    const receipt = await tx.wait();

    console.log('Success:', receipt.hash);
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### Pattern 2: Retrieve and Decrypt

```javascript
async function getDecryptedValue(id) {
  try {
    // 1. Get encrypted data from contract
    const encryptedData = await contract.getData(id);

    // 2. Decrypt with user signature
    const decrypted = await client.userDecrypt(
      encryptedData,
      contractAddress
    );

    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt:', error);
  }
}
```

### Pattern 3: Batch Operations

```javascript
async function batchEncrypt(values) {
  const encrypted = await Promise.all(
    values.map(v => client.encrypt64(v))
  );

  const tx = await contract.batchSubmit(encrypted);
  await tx.wait();
}
```

---

## Error Handling

```javascript
import { FhevmError } from 'fhevm-sdk';

try {
  const encrypted = await client.encrypt64(value);
} catch (error) {
  if (error instanceof FhevmError) {
    switch (error.code) {
      case 'NOT_INITIALIZED':
        console.error('Client not initialized');
        break;
      case 'ENCRYPTION_FAILED':
        console.error('Encryption failed:', error.message);
        break;
      case 'INVALID_TYPE':
        console.error('Invalid encryption type');
        break;
      default:
        console.error('Unknown error:', error);
    }
  }
}
```

---

## Next Steps

- **[API Reference](./api-reference.md)** - Complete API documentation
- **[React Guide](./react-guide.md)** - React-specific patterns
- **[TypeScript Guide](./typescript-guide.md)** - Type definitions
- **[Examples](../examples/)** - Working code examples

---

## Troubleshooting

### Client Initialization Fails

```javascript
// Ensure network is correct
const config = {
  network: 'sepolia', // Not 'goerli'
  contractAddress: '0x...',
};
```

### MetaMask Not Connected

```javascript
// Check if MetaMask is installed
if (!window.ethereum) {
  alert('Please install MetaMask');
}

// Request account access
await window.ethereum.request({
  method: 'eth_requestAccounts'
});
```

### Encryption Takes Too Long

```javascript
// Use loading states in UI
const [isEncrypting, setIsEncrypting] = useState(false);

const handleSubmit = async () => {
  setIsEncrypting(true);
  try {
    const encrypted = await client.encrypt64(value);
    // Continue...
  } finally {
    setIsEncrypting(false);
  }
};
```

---

**Ready to dive deeper?** Check out the [API Reference](./api-reference.md) for complete documentation.
