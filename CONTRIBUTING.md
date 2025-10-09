# Contributing to FHEVM SDK

Thank you for your interest in contributing to the FHEVM SDK! This document provides guidelines for contributing to this project.

## 🎯 Project Goals

The FHEVM SDK aims to make building confidential dApps:
- **Simple**: < 10 lines of code to get started
- **Consistent**: Same API across all frameworks
- **Developer-friendly**: Wagmi-like experience with great DX

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Build the SDK
npm run build:sdk

# Run tests
npm test

# Start development mode
npm run dev
```

## 📝 Contribution Workflow

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy.

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation

### 4. Test Your Changes

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Check formatting
npm run format:check

# Build to ensure no errors
npm run build
```

### 5. Commit Your Changes

We use **Conventional Commits**:

```bash
git commit -m "feat: add Vue composables for FHEVM SDK"
git commit -m "fix: resolve encryption race condition"
git commit -m "docs: add API reference for decrypt methods"
```

**Commit types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎨 Code Style

### TypeScript

```typescript
// ✅ Good
export async function encryptValue(
  client: FhevmClient,
  value: number
): Promise<Uint8Array> {
  return client.encrypt64(value);
}

// ❌ Bad
export async function encryptValue(client,value) {
  return client.encrypt64(value)
}
```

### React Components

```tsx
// ✅ Good
export function EncryptButton({ value, onEncrypt }: Props) {
  const { encrypt, isEncrypting } = useEncrypt();

  return (
    <button onClick={() => onEncrypt(value)} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}

// ❌ Bad
export function EncryptButton(props) {
  const encrypt = useEncrypt()
  return <button onClick={()=>props.onEncrypt(props.value)}>Encrypt</button>
}
```

### Documentation

```typescript
/**
 * Encrypt a uint64 value using FHEVM
 *
 * @param client - Initialized FHEVM client
 * @param value - Number to encrypt (must fit in uint64)
 * @returns Encrypted value as Uint8Array
 * @throws {FhevmError} If client not initialized
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt64(client, 42);
 * ```
 */
export async function encrypt64(
  client: FhevmClient,
  value: bigint | number
): Promise<Uint8Array> {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { FhevmClient } from '../src/core/client';

describe('FhevmClient', () => {
  it('should initialize successfully', async () => {
    const client = new FhevmClient(config);
    await client.init();

    expect(client.isInitialized()).toBe(true);
  });

  it('should encrypt uint64 values', async () => {
    const client = await createFhevmClient(config);
    const encrypted = await client.encrypt64(42);

    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

Test real scenarios with contracts:

```typescript
describe('Privacy Pollution Monitor Integration', () => {
  it('should submit encrypted report', async () => {
    const client = await createFhevmClient(config);
    const encrypted = await client.encrypt64(125); // PM2.5 value

    const tx = await contract.submitReport(encrypted, POLLUTANT_PM25, 3);
    const receipt = await tx.wait();

    expect(receipt.status).toBe(1);
  });
});
```

## 📚 Documentation

### README Updates

When adding features, update:
- Main README.md
- Package README (if SDK change)
- Example READMEs (if affecting examples)

### API Documentation

Add JSDoc comments to all public APIs:

```typescript
/**
 * Description of what this does
 *
 * @param paramName - Description
 * @returns Description
 * @throws {ErrorType} When this happens
 *
 * @example
 * ```typescript
 * // Usage example
 * ```
 */
```

## 🐛 Reporting Issues

### Bug Reports

Include:
- **Description**: What's the bug?
- **Steps to Reproduce**: How to trigger it?
- **Expected Behavior**: What should happen?
- **Actual Behavior**: What actually happens?
- **Environment**: OS, Node version, browser, etc.
- **Code Sample**: Minimal reproducible example

### Feature Requests

Include:
- **Use Case**: Why is this needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other approaches considered?
- **Examples**: Code examples of the API

## ✅ Pull Request Checklist

Before submitting:

- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation updated
- [ ] Examples updated (if applicable)
- [ ] Conventional commit messages
- [ ] PR description explains changes

## 🔍 Code Review Process

1. **Automated Checks**: CI runs tests, linting, build
2. **Maintainer Review**: Code quality, design, tests
3. **Discussion**: Feedback and iterations
4. **Approval**: Merged when approved

## 🌟 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📞 Getting Help

- **GitHub Discussions**: Ask questions
- **Discord**: Join Zama community
- **Issues**: Report bugs or request features

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FHEVM SDK! 🎉
