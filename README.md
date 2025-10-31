# FHEVM SDK - Universal Toolkit for Confidential dApps 🔐

> Framework-agnostic FHEVM SDK with wagmi-like developer experience for building privacy-preserving applications on Zama's Fully Homomorphic Encryption Virtual Machine.

**🎯 Built for the Zama Bounty Challenge** - A complete, reusable SDK that makes building confidential frontends simple, consistent, and developer-friendly.

**🌐 Live Example**: [https://fhe-pollution-monitor.vercel.app/](https://fhe-pollution-monitor.vercel.app/)

**💻 GitHub**: [https://github.com/OdaTorphy/fhevm-react-template](https://github.com/OdaTorphy/fhevm-react-template)

**📹 Demo Video**: Download `demo.mp4` to watch the full demonstration (streaming not available)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-purple)](https://docs.zama.ai/fhevm)

---

## ✨ Features

- 🎨 **Framework-Agnostic** - Works with React, Next.js, Vue, Node.js, or vanilla JavaScript
- 🔌 **Wagmi-like API** - Intuitive hooks and composables familiar to web3 developers
- 📦 **All-in-One Package** - Wraps all required dependencies (fhevmjs, ethers, etc.)
- 🚀 **Quick Setup** - Less than 10 lines of code to get started
- 🔐 **Complete FHEVM Flow** - Initialize, encrypt inputs, decrypt outputs, contract interaction
- 🧩 **Modular & Reusable** - Clean components for different encryption/decryption scenarios
- 📚 **Well Documented** - Comprehensive guides and code examples
- 🎭 **TypeScript First** - Full type safety with excellent IntelliSense
- ⚡ **Zero Configuration** - Sensible defaults with easy customization
- 🔄 **EIP-712 Support** - Built-in userDecrypt and publicDecrypt utilities

---

## 🚀 Quick Start

### Installation

```bash
# Install the SDK
npm install fhevm-sdk

# Or with yarn
yarn add fhevm-sdk

# Or with pnpm
pnpm add fhevm-sdk
```

### Basic Usage (< 10 lines!)

```typescript
import { createFhevmClient, encrypt, decrypt } from 'fhevm-sdk';

// 1. Initialize the client
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...'
});

// 2. Encrypt sensitive data
const encryptedValue = await encrypt(client, 42);

// 3. Decrypt results (with EIP-712 signature)
const decryptedValue = await decrypt(client, encryptedData);
```

---

## 🏗️ Architecture

```
fhevm-sdk/
├── Core Engine (framework-agnostic)
│   ├── FHEVM initialization
│   ├── Encryption utilities
│   ├── Decryption utilities (EIP-712)
│   └── Contract interaction
│
├── React Adapters
│   ├── useFhevmClient()
│   ├── useEncrypt()
│   ├── useDecrypt()
│   └── useContract()
│
├── Vue Adapters
│   ├── useFhevmClient()
│   ├── useEncrypt()
│   └── useDecrypt()
│
└── Utilities
    ├── Type converters
    ├── Network helpers
    └── Error handling
```

---

## 📦 Package Structure

This is a monorepo containing:

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── react/          # React hooks
│       │   ├── vue/            # Vue composables
│       │   └── types/          # TypeScript definitions
│       └── package.json
│
├── examples/
│   ├── nextjs-pollution-monitor/    # Full-featured Next.js application
│   ├── react-basic/                 # Minimal React setup
│   ├── node-cli/                    # Command-line encryption tool
│   └── PrivacyPollutionMonitor/     # Solidity contracts example
│
├── contracts/                   # Example smart contracts
└── README.md                    # This file
```

---

## 🎯 Complete FHEVM Flow

### 1. Initialize FHEVM Client

```typescript
import { FhevmClient } from 'fhevm-sdk';

const client = new FhevmClient({
  network: 'sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
  chainId: 11155111,
  contractAddress: '0xYourContract',
  // Optional: custom gateway for decryption
  gatewayUrl: 'https://gateway.zama.ai'
});

await client.init();
```

### 2. Encrypt Inputs

```typescript
// Encrypt different types
const encrypted8 = await client.encrypt8(255);
const encrypted16 = await client.encrypt16(65535);
const encrypted32 = await client.encrypt32(1000000);
const encrypted64 = await client.encrypt64(BigInt('9007199254740991'));
const encryptedBool = await client.encryptBool(true);
const encryptedAddress = await client.encryptAddress('0x...');

// Batch encryption
const batch = await client.encryptBatch({
  amount: 1000,
  threshold: 500,
  active: true
});
```

### 3. Contract Interaction

```typescript
import { Contract } from 'ethers';

// Connect to contract
const contract = new Contract(
  contractAddress,
  contractABI,
  client.getSigner()
);

// Submit encrypted data
const tx = await contract.submitReport(
  encrypted64,
  encrypted8,
  encryptedBool
);

await tx.wait();
```

### 4. Decrypt Outputs (EIP-712)

```typescript
// User decrypt (requires signature)
const decrypted = await client.userDecrypt(
  encryptedData,
  contractAddress
);

// Public decrypt (no signature needed)
const publicData = await client.publicDecrypt(encryptedData);

// Batch decrypt
const results = await client.decryptBatch([
  encryptedValue1,
  encryptedValue2,
  encryptedValue3
]);
```

---

## 🎨 React Integration

### Setup Provider

```tsx
import { FhevmProvider } from 'fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: '0x...'
      }}
    >
      <YourApp />
    </FhevmProvider>
  );
}
```

### Use Hooks

```tsx
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function EncryptionComponent() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const handleSubmit = async (value: number) => {
    // Encrypt
    const encrypted = await encrypt(value, 'uint64');

    // Send to contract
    const tx = await contract.submit(encrypted);
    await tx.wait();

    // Decrypt result
    const result = await decrypt(encryptedResult);
    console.log('Decrypted:', result);
  };

  return (
    <div>
      <button onClick={() => handleSubmit(42)} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit Encrypted Data'}
      </button>
    </div>
  );
}
```

---

## 🎭 Vue Integration

```vue
<script setup lang="ts">
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/vue';

const client = useFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...'
});

const { encrypt, isEncrypting } = useEncrypt(client);
const { decrypt, isDecrypting } = useDecrypt(client);

const handleEncrypt = async () => {
  const encrypted = await encrypt(42, 'uint64');
  console.log('Encrypted:', encrypted);
};
</script>

<template>
  <button @click="handleEncrypt" :disabled="isEncrypting">
    {{ isEncrypting ? 'Encrypting...' : 'Encrypt Data' }}
  </button>
</template>
```

---

## 📋 SDK Integration Examples

This repository includes three comprehensive examples demonstrating FHEVM SDK integration across different environments:

### 1. Next.js Full-Featured Application

**Location**: `examples/nextjs-pollution-monitor/`

A complete production-ready Next.js application showcasing:
- ✅ Station registration with encrypted data
- ✅ Confidential pollution reporting (euint64)
- ✅ Homomorphic threshold checking
- ✅ EIP-712 signed decryption
- ✅ Role-based access control
- ✅ Real-time encrypted dashboard
- ✅ MetaMask integration
- ✅ Sepolia testnet deployment

**Quick Start:**
```bash
cd examples/nextjs-pollution-monitor
npm install
npm run dev
```

Visit `http://localhost:3000`

See [examples/nextjs-pollution-monitor/README.md](./examples/nextjs-pollution-monitor/README.md) for details.

### 2. React Basic Example

**Location**: `examples/react-basic/`

A minimal React setup perfect for learning FHEVM SDK basics:
- ✅ Basic encryption demonstration
- ✅ Simple UI with loading states
- ✅ Error handling
- ✅ Educational info panel

**Quick Start:**
```bash
cd examples/react-basic
npm install
npm run dev
```

Visit `http://localhost:5173`

See [examples/react-basic/README.md](./examples/react-basic/README.md) for details.

### 3. Node.js CLI Tool

**Location**: `examples/node-cli/`

Command-line tool for FHEVM encryption operations:
- ✅ Command-line encryption
- ✅ Multiple encryption types (uint8, uint16, uint32, uint64, bool)
- ✅ Progress indicators
- ✅ Colored output
- ✅ Perfect for testing and automation

**Quick Start:**
```bash
cd examples/node-cli
npm install

# Encrypt a value
node index.js encrypt 42 --contract 0xYourContractAddress --type uint64
```

See [examples/node-cli/README.md](./examples/node-cli/README.md) for details.

---

## 🛠️ Development

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fhevm-react-template.git
cd fhevm-react-template

# Install all dependencies (monorepo)
npm install

# Build the SDK
npm run build:sdk

# Run tests
npm test

# Start development mode
npm run dev
```

### Project Scripts

```bash
# Build
npm run build              # Build all packages
npm run build:sdk          # Build SDK only
npm run build:examples     # Build all examples

# Development
npm run dev                # Start all in dev mode
npm run dev:sdk            # SDK dev mode with watch
npm run dev:nextjs         # Next.js example

# Testing
npm test                   # Run all tests
npm run test:sdk           # SDK tests only
npm run test:e2e           # End-to-end tests

# Deployment
npm run deploy:contracts   # Deploy to Sepolia
npm run deploy:frontend    # Deploy Next.js to Vercel

# Linting & Formatting
npm run lint               # Lint all packages
npm run format             # Format code
```

---

## 📚 Documentation

### Core Concepts

- **[Getting Started](./docs/getting-started.md)** - Installation and basic usage
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[React Guide](./docs/react-guide.md)** - React-specific integration
- **[Vue Guide](./docs/vue-guide.md)** - Vue-specific integration
- **[TypeScript Guide](./docs/typescript-guide.md)** - Type definitions and usage

### Advanced Topics

- **[Encryption Strategies](./docs/encryption.md)** - Best practices for encrypting data
- **[Decryption Flows](./docs/decryption.md)** - EIP-712 signatures and permissions
- **[Contract Integration](./docs/contracts.md)** - Working with FHEVM contracts
- **[Error Handling](./docs/errors.md)** - Common errors and solutions
- **[Performance](./docs/performance.md)** - Optimization tips

### Examples

- **[React Basic](./examples/react-basic/)** - Minimal React setup for learning SDK basics
- **[Next.js Application](./examples/nextjs-pollution-monitor/)** - Production-ready confidential monitoring system
- **[Node.js CLI](./examples/node-cli/)** - Command-line encryption and testing tool

---

## 🎥 Video Demo

**📹 Watch the Demo**: [demo.mp4]

The video demonstrates:
1. SDK installation and setup (< 10 lines)
2. Full-featured Next.js application integration
3. React basic example walkthrough
4. Node.js CLI tool usage
5. Encryption and decryption flows
6. Multi-framework support (React, Vue, Node.js)
7. Design decisions and architecture

---

## 🌐 Live Deployment

**🚀 Live Demo**: [https://fhe-pollution-monitor.vercel.app](https://fhe-pollution-monitor.vercel.app)

**Example Applications**:
- **Next.js Full Application**: Production-ready confidential environmental monitoring system
  - Live Demo: [https://fhe-pollution-monitor.vercel.app](https://fhe-pollution-monitor.vercel.app)
  - Contract: `0xc61a1997F87156dfC96CA14E66fA9E3A02D36358` (Sepolia)
- **React Basic**: Minimal setup for learning
- **Node.js CLI**: Command-line encryption tool

**Smart Contract** (Sepolia Testnet):
- Address: `0xc61a1997F87156dfC96CA14E66fA9E3A02D36358`
- Network: Sepolia (Chain ID: 11155111)
- Explorer: [View on Etherscan](https://sepolia.etherscan.io/address/0xc61a1997F87156dfC96CA14E66fA9E3A02D36358)

---

## 💡 Design Decisions

### Why Framework-Agnostic Core?

The SDK separates core functionality from framework adapters, allowing:
- ✅ Use in any JavaScript environment
- ✅ Consistent behavior across frameworks
- ✅ Easy testing and maintenance
- ✅ Smaller bundle sizes (tree-shaking)

### Why Wagmi-like API?

Web3 developers are familiar with wagmi's hook-based approach:
- ✅ Intuitive for React developers
- ✅ Composable and reusable
- ✅ Built-in state management
- ✅ TypeScript-first

### Why Monorepo Structure?

Keeps SDK and examples in sync:
- ✅ Shared dependencies
- ✅ Easier testing
- ✅ Consistent versioning
- ✅ Simplified development workflow

---

## 🧩 SDK API Reference

### Core Functions

```typescript
// Client Management
createFhevmClient(config: FhevmConfig): Promise<FhevmClient>
FhevmClient.init(): Promise<void>
FhevmClient.getPublicKey(): Promise<string>

// Encryption
encrypt8(value: number): Promise<Uint8Array>
encrypt16(value: number): Promise<Uint8Array>
encrypt32(value: number): Promise<Uint8Array>
encrypt64(value: bigint): Promise<Uint8Array>
encryptBool(value: boolean): Promise<Uint8Array>
encryptAddress(address: string): Promise<Uint8Array>

// Decryption
userDecrypt(data: Uint8Array, contract: string): Promise<any>
publicDecrypt(data: Uint8Array): Promise<any>
decryptBatch(data: Uint8Array[]): Promise<any[]>

// Contract Helpers
getContract(address: string, abi: any): Contract
getSigner(): Signer
getProvider(): Provider
```

### React Hooks

```typescript
// Provider
<FhevmProvider config={...}>

// Hooks
useFhevmClient(): FhevmClient
useEncrypt(): { encrypt, isEncrypting, error }
useDecrypt(): { decrypt, isDecrypting, error }
useContract(address, abi): Contract
useFhevmTransaction(contract, method): { send, isLoading, error }
```

### Vue Composables

```typescript
useFhevmClient(config): FhevmClient
useEncrypt(client): { encrypt, isEncrypting, error }
useDecrypt(client): { decrypt, isDecrypting, error }
useContract(client, address, abi): Contract
```

---

## 🔒 Security Considerations

### Client-Side Encryption

- ✅ Encryption happens in the browser/client
- ✅ Keys never leave the client
- ✅ Uses Zama's official fhevmjs library

### EIP-712 Signatures

- ✅ User must sign to decrypt own data
- ✅ Prevents unauthorized decryption
- ✅ Domain-specific signatures

### Best Practices

```typescript
// ✅ Good: Encrypt sensitive data
const encrypted = await encrypt(socialSecurityNumber);

// ❌ Bad: Send sensitive data in plain text
await contract.submit(socialSecurityNumber); // NEVER!

// ✅ Good: Verify decryption permissions
if (await hasPermission(address)) {
  const decrypted = await decrypt(data);
}

// ✅ Good: Handle errors properly
try {
  const result = await decrypt(data);
} catch (error) {
  if (error.code === 'SIGNATURE_REQUIRED') {
    // Request user signature
  }
}
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

Target: >80% code coverage

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 🌟 Roadmap

### Phase 1 (Current) ✅
- Core SDK with framework-agnostic API
- React and Vue adapters
- Three comprehensive examples (Next.js, React, Node.js)
- Comprehensive documentation

### Phase 2 (Q2 2025) 🔜
- Angular support
- Svelte support
- CLI tools for quick scaffolding
- Additional example applications

### Phase 3 (Q3 2025) 🔜
- Performance optimizations
- Batch encryption/decryption improvements
- Advanced caching strategies
- Developer DevTools extension

### Phase 4 (Q4 2025) 🔜
- Mobile SDK (React Native)
- Wallet integrations (MetaMask Snaps)
- FHEVM testing utilities
- Production-ready templates

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama** - For pioneering Fully Homomorphic Encryption and the FHEVM platform
- **fhevmjs** - Official Zama FHE library for JavaScript
- **wagmi** - Inspiration for the hook-based API design
- **Viem** - Modern Ethereum library patterns
- **Community** - For feedback and contributions

---

## 📞 Support & Resources

### Documentation
- **SDK Docs**: [docs.fhevm-sdk.dev](https://docs.fhevm-sdk.dev)
- **Zama FHEVM**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **API Reference**: [api.fhevm-sdk.dev](https://api.fhevm-sdk.dev)

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/fhevm-react-template/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/yourusername/fhevm-react-template/discussions)
- **Discord**: [Join the Zama community](https://discord.fhe.org)

### Contact
- **Email**: fhevm-sdk@protonmail.com
- **Twitter**: [@FhevmSDK](https://twitter.com/FhevmSDK)

---

<div align="center">

**FHEVM SDK** - Making Confidential dApps Simple 🔐

*Built with ❤️ for the Zama Bounty Challenge*

[Documentation](./docs) • [Examples](./examples) • [API Reference](./docs/api-reference.md) • [Contributing](./CONTRIBUTING.md)

</div>
