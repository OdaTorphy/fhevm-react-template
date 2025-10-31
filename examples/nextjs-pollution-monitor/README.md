# Privacy Pollution Monitor - Next.js Example

> Full-featured Next.js application demonstrating FHEVM SDK integration for confidential environmental monitoring.

This example shows how to use the FHEVM SDK in a production Next.js application with:
- ✅ Client-side FHE encryption
- ✅ Wagmi-like React hooks
- ✅ EIP-712 signed decryption
- ✅ Real-time encrypted dashboard
- ✅ MetaMask integration
- ✅ Sepolia testnet deployment

---

## 🚀 Quick Start

```bash
# From repository root
npm install

# Or from this directory
cd examples/nextjs-pollution-monitor
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 🏗️ Architecture

```
Next.js Application Structure
├── app/                          # App Router (Next.js 13+)
│   ├── layout.tsx                # Root layout with FHE provider
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── api/                      # API Routes
│       ├── fhe/                  # FHE operations
│       │   ├── route.ts          # Main FHE endpoint
│       │   ├── encrypt/route.ts  # Encryption API
│       │   ├── decrypt/route.ts  # Decryption API
│       │   └── compute/route.ts  # Homomorphic computation
│       └── keys/route.ts         # Key management API
│
├── components/                   # React Components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                      # FHE functionality
│   │   ├── FHEProvider.tsx       # FHE context provider
│   │   ├── EncryptionDemo.tsx    # Encryption demonstration
│   │   ├── ComputationDemo.tsx   # Computation demonstration
│   │   └── KeyManager.tsx        # Key management UI
│   ├── StationRegistration.tsx
│   ├── PollutionReporter.tsx
│   ├── Dashboard.tsx
│   └── WalletConnect.tsx
│
├── lib/                          # Library utilities
│   ├── fhe/                      # FHE integration
│   │   ├── client.ts             # Client-side FHE operations
│   │   ├── server.ts             # Server-side FHE operations
│   │   ├── keys.ts               # Key management
│   │   └── types.ts              # FHE type definitions
│   ├── utils/                    # Utility functions
│   │   ├── security.ts           # Security utilities
│   │   └── validation.ts         # Validation helpers
│   └── contract.ts               # Smart contract integration
│
├── hooks/                        # Custom React Hooks
│   ├── useFHE.ts                 # FHE client hook
│   ├── useEncryption.ts          # Encryption hook
│   └── useComputation.ts         # Computation hook
│
└── types/                        # TypeScript definitions
    ├── fhe.ts                    # FHE type definitions
    └── api.ts                    # API type definitions
```

---

## 📋 Features Demonstrated

### 1. Monitoring Station Registration

```tsx
import { useFhevmClient, useContract } from 'fhevm-sdk/react';

function StationRegistration() {
  const client = useFhevmClient();
  const contract = useContract(CONTRACT_ADDRESS, ABI);

  const registerStation = async (name: string) => {
    const tx = await contract.registerStation(name);
    await tx.wait();
  };

  return (
    <button onClick={() => registerStation('Factory North')}>
      Register Station
    </button>
  );
}
```

### 2. Encrypted Pollution Reporting

```tsx
import { useEncrypt, useFhevmTransaction } from 'fhevm-sdk/react';

function PollutionReporter() {
  const { encrypt, isEncrypting } = useEncrypt();
  const { send, isLoading } = useFhevmTransaction(contract, 'submitReport');

  const submitReport = async (value: number, type: number) => {
    // Encrypt the pollution measurement
    const encrypted = await encrypt(value, 'uint64');

    // Submit encrypted report
    await send(encrypted, type, getSeverity(value));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="PM2.5 value (μg/m³)" />
      <button disabled={isEncrypting || isLoading}>
        {isEncrypting ? 'Encrypting...' : 'Submit Report'}
      </button>
    </form>
  );
}
```

### 3. Decryption with EIP-712

```tsx
import { useDecrypt } from 'fhevm-sdk/react';

function DecryptValue() {
  const { decrypt, isDecrypting } = useDecrypt();

  const viewMyReport = async (encryptedData: Uint8Array) => {
    try {
      // Requires user signature
      const decrypted = await decrypt(encryptedData, CONTRACT_ADDRESS);
      console.log('Decrypted value:', decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  return (
    <button onClick={() => viewMyReport(data)} disabled={isDecrypting}>
      {isDecrypting ? 'Decrypting...' : 'View My Data'}
    </button>
  );
}
```

### 4. Real-time Dashboard

```tsx
import { useContract, useBatchDecrypt } from 'fhevm-sdk/react';

function Dashboard() {
  const contract = useContract(CONTRACT_ADDRESS, ABI);
  const { decryptBatch } = useBatchDecrypt();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [stations, reports] = await contract.getStatistics();
    setStats({ stations, reports });
  };

  return (
    <div className="dashboard">
      <h2>Environmental Monitoring Dashboard</h2>
      <StatsCard label="Total Stations" value={stats?.stations} />
      <StatsCard label="Total Reports" value={stats?.reports} />
      <RecentReports />
    </div>
  );
}
```

---

## 🔐 Privacy Features

### What's Encrypted
- Individual pollution measurements (euint64)
- Severity assessments
- Station-specific data

### What's Public
- Station registration (name visible)
- Report timestamps
- Alert status (threshold exceeded yes/no)
- Total statistics

### Decryption Permissions
- **Station Operators**: Can decrypt their own reports
- **Verifiers**: Can access encrypted data with permission
- **Public**: Can view aggregated statistics only

---

## 🛠️ Configuration

### Environment Variables

Create `.env.local`:

```env
# Network
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0xc61a1997F87156dfC96CA14E66fA9E3A02D36358

# FHEVM Gateway
NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

### FHEVM Provider Setup

`app/layout.tsx`:
```tsx
import { FhevmProvider } from 'fhevm-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider
          config={{
            network: 'sepolia',
            contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
          }}
        >
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

---

## 🔌 API Routes

### FHE Operations API

#### GET/POST `/api/fhe`
Main FHE endpoint providing API status and information.

**Response:**
```json
{
  "status": "ok",
  "endpoints": {
    "encrypt": "/api/fhe/encrypt",
    "decrypt": "/api/fhe/decrypt",
    "compute": "/api/fhe/compute"
  },
  "version": "1.0.0"
}
```

#### POST `/api/fhe/encrypt`
Encrypt values using FHE.

**Request:**
```json
{
  "value": 42,
  "type": "uint64"
}
```

**Response:**
```json
{
  "success": true,
  "encrypted": {
    "type": "uint64",
    "value": "42",
    "timestamp": 1234567890
  },
  "message": "Value encrypted successfully"
}
```

#### POST `/api/fhe/decrypt`
Decrypt encrypted data with EIP-712 signature.

**Request:**
```json
{
  "encryptedData": "0x...",
  "signature": "0x...",
  "contractAddress": "0x..."
}
```

#### POST `/api/fhe/compute`
Perform homomorphic computations.

**Request:**
```json
{
  "operation": "add",
  "operands": ["0x...", "0x..."]
}
```

#### GET `/api/keys`
Retrieve public key for encryption.

**Query Parameters:**
- `contract`: Contract address (required)

---

## 🪝 Custom Hooks

### `useFHE(contractAddress?)`
Initialize and manage FHE client.

```tsx
const { client, isInitialized, isInitializing, error, initialize } = useFHE();
```

### `useEncryption()`
Handle encryption operations.

```tsx
const { encrypt, isEncrypting, result, error, reset } = useEncryption();

await encrypt(42, 'uint64');
```

### `useComputation()`
Handle homomorphic computations.

```tsx
const { compute, isComputing, result, error, reset } = useComputation();

await compute('add', [encryptedValue1, encryptedValue2]);
```

---

## 📦 Components Library

### UI Components (`components/ui/`)

#### Button
Reusable button component with loading states.

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean

#### Input
Input component with label and error handling.

```tsx
<Input
  label="Enter value"
  error="Invalid input"
  helperText="Helper text"
/>
```

#### Card
Container component with header and footer.

```tsx
<Card
  title="Card Title"
  subtitle="Subtitle"
  footer={<Button>Action</Button>}
>
  Content
</Card>
```

### FHE Components (`components/fhe/`)

#### FHEProvider
Context provider for FHE operations.

```tsx
<FHEProvider contractAddress="0x...">
  <App />
</FHEProvider>
```

#### EncryptionDemo
Interactive encryption demonstration component.

#### ComputationDemo
Interactive homomorphic computation demo.

#### KeyManager
FHE key management interface.

---

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Component tests
npm run test:components
```

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Vercel)

Add in Vercel Dashboard:
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_NETWORK`
- `NEXT_PUBLIC_RPC_URL`

---

## 🔗 Contract Integration

### ABI Location

`lib/contract.ts`:
```typescript
export const CONTRACT_ABI = [/* ABI from artifacts */];
export const CONTRACT_ADDRESS = '0xc61a1997F87156dfC96CA14E66fA9E3A02D36358';
```

### Contract Methods Used

- `registerStation(name)`
- `submitReport(encrypted, type, severity)`
- `verifyReport(reportId)`
- `getStationDetails(address)`
- `getReportDetails(reportId)`
- `getStatistics()`

---

## 💡 Code Examples

See complete examples in:
- `components/StationRegistration.tsx` - Station setup
- `components/PollutionReporter.tsx` - Encrypted reporting
- `components/DashboardView.tsx` - Data visualization
- `app/dashboard/page.tsx` - Full page integration

---

## 🐛 Troubleshooting

### MetaMask Not Connecting

```typescript
// Check if MetaMask is installed
if (!window.ethereum) {
  alert('Please install MetaMask');
}

// Request account access
await window.ethereum.request({ method: 'eth_requestAccounts' });
```

### Encryption Errors

```typescript
// Ensure client is initialized
const client = useFhevmClient();

// Check if client is ready
if (!client.isInitialized()) {
  await client.init();
}
```

### Sepolia Network Issues

```typescript
// Add/Switch to Sepolia
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: ['https://rpc.sepolia.org'],
  }],
});
```

---

## 📚 Learn More

- [FHEVM SDK Documentation](../../README.md)
- [API Reference](../../docs/api-reference.md)
- [React Integration Guide](../../docs/react-guide.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

---

## 🤝 Contributing

Improvements welcome! This example demonstrates FHEVM SDK integration patterns.

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE)

---

**Live Demo**: [https://pollution-monitor.vercel.app](https://pollution-monitor.vercel.app)
**Contract**: `0xc61a1997F87156dfC96CA14E66fA9E3A02D36358` (Sepolia)
