# React Basic Example

Minimal React setup demonstrating FHEVM SDK usage.

---

## Features

- Basic encryption demonstration
- Simple UI with loading states
- Error handling
- Educational info panel

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173`

---

## What This Example Shows

### 1. Provider Setup

```jsx
<FhevmProvider config={{ network: 'sepolia', contractAddress: '0x...' }}>
  <App />
</FhevmProvider>
```

### 2. Encryption Hook

```jsx
const { encrypt, isEncrypting, error } = useEncrypt();

const handleEncrypt = async () => {
  const encrypted = await encrypt(42, 'uint64');
  console.log('Encrypted:', encrypted);
};
```

### 3. Loading States

```jsx
<button disabled={isEncrypting}>
  {isEncrypting ? 'Encrypting...' : 'Encrypt'}
</button>
```

---

## Project Structure

```
react-basic/
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Main component with FHEVM integration
│   └── index.css          # Styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
└── README.md              # This file
```

---

## Next Steps

- Add contract interaction
- Implement decryption
- Build a complete form

See the [Next.js Example](../nextjs-pollution-monitor/) for a full-featured application.

---

## Learn More

- [FHEVM SDK Documentation](../../README.md)
- [React Guide](../../docs/react-guide.md)
- [API Reference](../../docs/api-reference.md)
