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
Next.js App
├── FHEVM SDK Integration
│   ├── FhevmProvider (React Context)
│   ├── useFhevmClient hook
│   ├── useEncrypt hook
│   └── useDecrypt hook
│
├── Components
│   ├── StationRegistration
│   ├── PollutionReporter
│   ├── DashboardView
│   └── WalletConnect
│
└── Contract Interaction
    ├── PrivacyPollutionMonitor.sol
    ├── Encrypted submissions
    └── EIP-712 decryption
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

## 📦 Project Structure

```
nextjs-pollution-monitor/
├── app/
│   ├── layout.tsx              # FHEVM Provider setup
│   ├── page.tsx                # Home page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard
│   └── station/
│       └── page.tsx            # Station management
│
├── components/
│   ├── StationRegistration.tsx
│   ├── PollutionReporter.tsx
│   ├── ReportsList.tsx
│   ├── WalletConnect.tsx
│   └── StatsCard.tsx
│
├── lib/
│   ├── contract.ts             # Contract ABI and address
│   └── utils.ts                # Helper functions
│
├── public/
│   └── assets/
│
└── package.json
```

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
