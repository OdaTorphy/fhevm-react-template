# TypeScript Guide

Type-safe FHEVM SDK usage with TypeScript.

---

## Installation

```bash
npm install fhevm-sdk
# TypeScript types are included
```

---

## Type Definitions

### Core Types

```typescript
import type {
  FhevmConfig,
  FhevmClient,
  EncryptType,
  FhevmError,
} from 'fhevm-sdk';

// Configuration
const config: FhevmConfig = {
  network: 'sepolia',
  contractAddress: '0x...',
};

// Encryption types
const type: EncryptType = 'uint64';
```

### React Hook Types

```typescript
import type {
  UseEncryptResult,
  UseDecryptResult,
  UseFhevmTransactionResult,
} from 'fhevm-sdk/react';

const encryptResult: UseEncryptResult = useEncrypt();
const decryptResult: UseDecryptResult = useDecrypt();
```

---

## Type-Safe Contract Interaction

```typescript
import { Contract } from 'ethers';
import { useContract } from 'fhevm-sdk/react';

// Define contract interface
interface MyContract extends Contract {
  submitValue(encrypted: Uint8Array): Promise<TransactionResponse>;
  getData(id: number): Promise<Uint8Array>;
}

// Use with type safety
const contract = useContract<MyContract>(ADDRESS, ABI);
const tx = await contract.submitValue(encrypted);
```

---

## Custom Types

```typescript
// Define your own encrypted data type
type EncryptedPollutionData = {
  measurement: Uint8Array;
  pollutantType: number;
  timestamp: number;
};

// Use in components
const submitReport = async (data: EncryptedPollutionData) => {
  const tx = await contract.submitReport(
    data.measurement,
    data.pollutantType,
    data.timestamp
  );
  return tx.wait();
};
```

---

For more examples, see the [Next.js Example](../examples/nextjs-pollution-monitor/).
