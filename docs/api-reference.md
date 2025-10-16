# API Reference

Complete API documentation for FHEVM SDK.

---

## Core Client

### `createFhevmClient(config)`

Creates and initializes an FHEVM client instance.

**Parameters:**
- `config: FhevmConfig` - Client configuration object

**Returns:** `Promise<FhevmClient>`

**Example:**
```javascript
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...',
});
```

---

### `FhevmClient`

Main client class for FHEVM operations.

#### Methods

##### `encrypt64(value: number | bigint): Promise<Uint8Array>`

Encrypts a 64-bit unsigned integer.

**Parameters:**
- `value` - Number to encrypt (0 to 2^64-1)

**Returns:** `Promise<Uint8Array>` - Encrypted data

**Example:**
```javascript
const encrypted = await client.encrypt64(1000);
```

##### `encrypt32(value: number | bigint): Promise<Uint8Array>`

Encrypts a 32-bit unsigned integer.

##### `encrypt16(value: number): Promise<Uint8Array>`

Encrypts a 16-bit unsigned integer.

##### `encrypt8(value: number): Promise<Uint8Array>`

Encrypts an 8-bit unsigned integer.

##### `encryptBool(value: boolean): Promise<Uint8Array>`

Encrypts a boolean value.

##### `encryptAddress(address: string): Promise<Uint8Array>`

Encrypts an Ethereum address.

##### `userDecrypt(encryptedData: Uint8Array, contractAddress: string): Promise<bigint>`

Decrypts data with EIP-712 signature.

**Parameters:**
- `encryptedData` - Encrypted data to decrypt
- `contractAddress` - Contract address for signature

**Returns:** `Promise<bigint>` - Decrypted value

##### `publicDecrypt(encryptedData: Uint8Array): Promise<bigint>`

Decrypts publicly accessible encrypted data.

---

## React Hooks

### `useFhevmClient()`

Returns the initialized FHEVM client from context.

**Returns:** `FhevmClient`

**Example:**
```jsx
const client = useFhevmClient();
const encrypted = await client.encrypt64(42);
```

---

### `useEncrypt()`

Provides encryption functionality with loading states.

**Returns:** `UseEncryptResult`

```typescript
interface UseEncryptResult {
  encrypt: (value: number | bigint | boolean, type: EncryptType) => Promise<Uint8Array>;
  isEncrypting: boolean;
  error: Error | null;
}

type EncryptType = 'uint64' | 'uint32' | 'uint16' | 'uint8' | 'bool' | 'address';
```

**Example:**
```jsx
const { encrypt, isEncrypting, error } = useEncrypt();

const handleSubmit = async () => {
  const encrypted = await encrypt(42, 'uint64');
  // Use encrypted value...
};
```

---

### `useDecrypt()`

Provides decryption functionality with loading states.

**Returns:** `UseDecryptResult`

```typescript
interface UseDecryptResult {
  decrypt: (encryptedData: Uint8Array, contractAddress: string) => Promise<bigint>;
  isDecrypting: boolean;
  error: Error | null;
}
```

**Example:**
```jsx
const { decrypt, isDecrypting } = useDecrypt();

const handleDecrypt = async (data) => {
  const decrypted = await decrypt(data, contractAddress);
  console.log('Value:', decrypted);
};
```

---

### `useContract(address, abi)`

Creates a contract instance with FHEVM integration.

**Parameters:**
- `address: string` - Contract address
- `abi: any[]` - Contract ABI

**Returns:** `Contract`

**Example:**
```jsx
const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
const tx = await contract.submitValue(encrypted);
```

---

### `useFhevmTransaction(contract, method)`

Manages FHEVM transaction lifecycle.

**Parameters:**
- `contract: Contract` - Contract instance
- `method: string` - Method name to call

**Returns:** `UseFhevmTransactionResult`

```typescript
interface UseFhevmTransactionResult {
  send: (...args: any[]) => Promise<TransactionReceipt>;
  isLoading: boolean;
  txHash: string | null;
  error: Error | null;
}
```

**Example:**
```jsx
const { send, isLoading, txHash } = useFhevmTransaction(contract, 'submitValue');

const handleSubmit = async (encrypted) => {
  const receipt = await send(encrypted);
  console.log('Success:', receipt);
};
```

---

## Types

### `FhevmConfig`

```typescript
interface FhevmConfig {
  network: 'sepolia' | 'mainnet' | 'localhost';
  contractAddress: string;
  rpcUrl?: string;
  gatewayUrl?: string;
  publicKey?: string;
  chainId?: number;
}
```

### `EncryptType`

```typescript
type EncryptType =
  | 'uint64'
  | 'uint32'
  | 'uint16'
  | 'uint8'
  | 'bool'
  | 'address';
```

### `FhevmError`

```typescript
class FhevmError extends Error {
  code: ErrorCode;
  details?: any;
}

type ErrorCode =
  | 'NOT_INITIALIZED'
  | 'ENCRYPTION_FAILED'
  | 'DECRYPTION_FAILED'
  | 'INVALID_TYPE'
  | 'NETWORK_ERROR'
  | 'CONTRACT_ERROR';
```

---

## Utilities

### `convertToBytes(value, type)`

Converts a value to bytes for encryption.

### `convertFromBytes(bytes, type)`

Converts bytes back to original type after decryption.

### `validateAddress(address)`

Validates an Ethereum address.

### `getNetworkConfig(network)`

Gets default network configuration.

---

## Advanced Usage

### Custom Network Configuration

```javascript
const client = await createFhevmClient({
  network: 'localhost',
  contractAddress: '0x...',
  rpcUrl: 'http://localhost:8545',
  chainId: 31337,
});
```

### Batch Encryption

```javascript
const values = [10, 20, 30, 40, 50];
const encrypted = await Promise.all(
  values.map(v => client.encrypt64(v))
);
```

### Error Recovery

```javascript
try {
  const encrypted = await client.encrypt64(value);
} catch (error) {
  if (error.code === 'NOT_INITIALIZED') {
    await client.init();
    return client.encrypt64(value);
  }
  throw error;
}
```

---

For more examples, see the [examples directory](../examples/).
