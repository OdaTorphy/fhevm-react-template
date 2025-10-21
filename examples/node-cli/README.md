# Node.js CLI Example

Command-line tool for FHEVM encryption.

---

## Installation

```bash
npm install
```

---

## Usage

### Encrypt a Value

```bash
node index.js encrypt <value> --contract <address> [options]
```

**Options:**
- `-t, --type <type>` - Encryption type (uint64, uint32, uint16, uint8, bool)
- `-n, --network <network>` - Network (sepolia, mainnet)
- `-c, --contract <address>` - Contract address (required)

### Examples

**Encrypt a 64-bit integer:**
```bash
node index.js encrypt 42 --contract 0xYourContractAddress --type uint64
```

**Encrypt an 8-bit integer:**
```bash
node index.js encrypt 100 --contract 0xYourContractAddress --type uint8
```

**Encrypt a boolean:**
```bash
node index.js encrypt true --contract 0xYourContractAddress --type bool
```

### Display Info

```bash
node index.js info
```

---

## Output Example

```
✔ Encryption successful!

Original Value: 42
Type: uint64
Encrypted (hex): 0x1a2b3c4d5e6f7890abcdef...
Length: 256 bytes

This encrypted value can be safely sent to your smart contract.
```

---

## Features

- Command-line encryption
- Multiple encryption types
- Progress indicators
- Colored output
- Error handling

---

## Project Structure

```
node-cli/
├── index.js           # Main CLI script
├── package.json       # Dependencies
└── README.md          # This file
```

---

## Use Cases

1. **Testing** - Encrypt test values for smart contract testing
2. **Scripting** - Automate encryption in deployment scripts
3. **Debugging** - Quick encryption for debugging purposes
4. **Integration** - Use in CI/CD pipelines

---

## Learn More

- [FHEVM SDK Documentation](../../README.md)
- [API Reference](../../docs/api-reference.md)
- [Getting Started Guide](../../docs/getting-started.md)
