# Encryption Strategies

Best practices for encrypting data with FHEVM SDK.

---

## Encryption Types

### Available Types

```javascript
// 64-bit unsigned integer (0 to 2^64-1)
const encrypted64 = await client.encrypt64(1000000);

// 32-bit unsigned integer
const encrypted32 = await client.encrypt32(50000);

// 16-bit unsigned integer
const encrypted16 = await client.encrypt16(1000);

// 8-bit unsigned integer
const encrypted8 = await client.encrypt8(100);

// Boolean
const encryptedBool = await client.encryptBool(true);

// Ethereum address
const encryptedAddress = await client.encryptAddress('0x...');
```

---

## When to Use Each Type

### `encrypt64` - Large Numbers

Use for:
- Financial amounts (wei, tokens)
- Large measurements
- Timestamps
- IDs

```javascript
const encrypted = await client.encrypt64(1000000000000);
```

### `encrypt8` - Small Values

Use for:
- Enum values
- Categories
- Severity levels (1-5)
- Status codes

```javascript
const severity = 3; // 1-5 scale
const encrypted = await client.encrypt8(severity);
```

### `encryptBool` - True/False

Use for:
- Verification status
- Approval flags
- Active/inactive states

```javascript
const encrypted = await client.encryptBool(true);
```

---

## Performance Optimization

### Batch Encryption

```javascript
// Encrypt multiple values in parallel
const values = [10, 20, 30, 40, 50];
const encrypted = await Promise.all(
  values.map(v => client.encrypt64(v))
);

// Submit all at once
await contract.batchSubmit(encrypted);
```

### Caching Client

```javascript
// Initialize once, reuse many times
const client = await createFhevmClient(config);

// Use for multiple encryptions
const enc1 = await client.encrypt64(100);
const enc2 = await client.encrypt64(200);
const enc3 = await client.encrypt64(300);
```

---

## Security Best Practices

### 1. Never Log Unencrypted Data

```javascript
// Bad
console.log('Value:', sensitiveValue);

// Good
const encrypted = await client.encrypt64(sensitiveValue);
console.log('Encrypted successfully');
```

### 2. Validate Before Encrypting

```javascript
function encryptPollutionValue(value) {
  // Validate range
  if (value < 0 || value > 10000) {
    throw new Error('Value out of range');
  }

  // Validate type
  if (!Number.isInteger(value)) {
    throw new Error('Value must be integer');
  }

  return client.encrypt64(value);
}
```

### 3. Use Appropriate Types

```javascript
// Bad - Using uint64 for small enum
const status = 2; // 0-4 range
const encrypted = await client.encrypt64(status); // Overkill

// Good - Use uint8
const encrypted = await client.encrypt8(status);
```

---

For more details, see [API Reference](./api-reference.md).
