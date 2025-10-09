# Demo Video Documentation

## Video File: demo.mp4

**Location**: `./demo.mp4` (root of repository)

**Duration**: ~5-7 minutes

**Purpose**: Demonstrate the FHEVM SDK setup, integration, and usage across multiple frameworks

---

## Video Contents

### 1. Introduction (0:00 - 0:30)
- Welcome and overview
- What is FHEVM SDK
- Built for Zama Bounty Challenge
- Key features highlight

### 2. Quick Setup Demo (0:30 - 2:00)
**Shows the < 10 lines setup promise**

```typescript
// Installation
npm install fhevm-sdk

// Basic usage (< 10 lines)
import { createFhevmClient, encrypt, decrypt } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0xc61a1997F87156dfC96CA14E66fA9E3A02D36358'
});

const encrypted = await encrypt(client, 42);
const decrypted = await decrypt(client, encryptedData);
```

**Demonstrates**:
- ✅ Fast installation
- ✅ Minimal configuration
- ✅ Intuitive API

### 3. Privacy Pollution Monitor Integration (2:00 - 4:00)
**Full example dApp walkthrough**

**Features Shown**:
1. **Station Registration**
   - Connect wallet (MetaMask)
   - Register monitoring station
   - Transaction confirmation

2. **Encrypted Report Submission**
   - Input pollution data
   - Client-side encryption (shown in DevTools)
   - Submit encrypted transaction
   - Blockchain confirmation

3. **Threshold Checking**
   - Homomorphic comparison
   - Alert triggering (without revealing values)
   - Privacy preserved

4. **Decryption with EIP-712**
   - Request user signature
   - Decrypt own data
   - Show decrypted values

**Code Snippets Shown**:
```tsx
// React integration
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function PollutionReporter() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt } = useDecrypt();

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint64');
    await contract.submitReport(encrypted, pollutantType, severity);
  };

  return <button onClick={() => handleSubmit(125)}>
    Submit Report
  </button>;
}
```

### 4. Multi-Framework Support (4:00 - 5:30)
**Demonstrates framework-agnostic design**

**React Example**:
```tsx
<FhevmProvider config={{ network: 'sepolia', contractAddress: '0x...' }}>
  <App />
</FhevmProvider>
```

**Vue Example** (quick demo):
```vue
<script setup>
import { useFhevmClient, useEncrypt } from 'fhevm-sdk/vue';
const { encrypt } = useEncrypt();
</script>
```

**Node.js CLI** (bonus):
```javascript
const { createFhevmClient } = require('fhevm-sdk');
// Works in Node.js environment
```

### 5. Design Decisions (5:30 - 6:30)
**Architecture explanation**

**Shows**:
```
SDK Architecture:
┌─────────────────────────┐
│  Framework Adapters     │
│  (React, Vue, etc.)     │
├─────────────────────────┤
│  Core Engine            │
│  (Framework-agnostic)   │
├─────────────────────────┤
│  fhevmjs Integration    │
└─────────────────────────┘
```

**Key Decisions**:
1. **Why Framework-Agnostic Core?**
   - Reusability across frameworks
   - Consistent behavior
   - Easier testing
   - Smaller bundles

2. **Why Wagmi-like API?**
   - Familiar to web3 developers
   - Composable hooks
   - Built-in state management
   - TypeScript-first

3. **Why Monorepo?**
   - Keep SDK and examples in sync
   - Shared dependencies
   - Easier development

### 6. Developer Experience (6:30 - 7:00)
**Shows developer-friendly features**

**TypeScript IntelliSense**:
- Autocomplete for methods
- Type safety
- Inline documentation

**Error Handling**:
```typescript
try {
  const encrypted = await encrypt(value);
} catch (error) {
  if (error.code === 'WALLET_NOT_CONNECTED') {
    // Handle wallet connection
  }
}
```

**Testing**:
```bash
npm test                # Unit tests
npm run test:e2e        # E2E tests
npm run test:coverage   # Coverage report
```

### 7. Deployment & Live Demo (7:00 - 7:30)
**Show live deployment**

- **Live App**: https://pollution-monitor.vercel.app
- **Contract**: 0xc61a1997F87156dfC96CA14E66fA9E3A02D36358 (Sepolia)
- **GitHub**: Repository link
- **Documentation**: Full docs site

**Final Call to Action**:
- Try the SDK
- Read the docs
- Contribute on GitHub
- Join the discussion

---

## Video Production Notes

### Recording Setup
- **Screen Resolution**: 1920x1080
- **Screen Capture**: OBS Studio or similar
- **Audio**: Clear voiceover explaining each step
- **Code Editor**: VS Code with proper syntax highlighting
- **Browser**: Chrome with Developer Tools visible when needed

### Visual Elements
- **Terminal**: Clear, large font for npm commands
- **Code**: Syntax highlighted, zoomed appropriately
- **Browser**: Full-screen when showing UI, split-screen for code
- **Annotations**: Text overlays for key points

### Pacing
- Smooth transitions between sections
- Pause briefly on important code snippets
- Show loading states (encryption/decryption in progress)
- Celebrate successful transactions

### Background Music (optional)
- Soft, non-distracting background music
- Lower volume during code explanations
- Slightly louder during demo interactions

---

## Demo Script

### Opening
> "Hi! I'm excited to show you the FHEVM SDK - a universal toolkit for building confidential dApps. Built for the Zama Bounty Challenge, this SDK makes working with Fully Homomorphic Encryption simple and developer-friendly. Let's dive in!"

### Setup
> "Getting started is incredibly simple. Install the package, create a client, and you're ready to encrypt and decrypt data - all in less than 10 lines of code."

### Privacy Pollution Monitor
> "Let me show you a real example - the Privacy Pollution Monitor. This dApp lets industries report pollution data while keeping their measurements completely confidential. Watch as I register a station, submit an encrypted report, and decrypt the results - all while protecting sensitive data."

### Multi-Framework
> "The beauty of FHEVM SDK is that it works everywhere. React, Vue, plain Node.js - the same familiar API across all frameworks. This framework-agnostic design means you can use it in any project."

### Design Decisions
> "We built this with three key principles: a framework-agnostic core for maximum reusability, a wagmi-like API for familiarity, and a monorepo structure to keep everything in sync. These decisions ensure the SDK is both powerful and easy to use."

### Closing
> "The FHEVM SDK is ready for you to try. Check out the live demo, read the comprehensive docs, and start building confidential dApps today. Thanks for watching!"

---

## Post-Production Checklist

- [ ] Video exported in 1080p MP4
- [ ] Audio levels normalized
- [ ] Captions/subtitles added (optional but recommended)
- [ ] Thumbnail created (if for YouTube)
- [ ] File named `demo.mp4`
- [ ] Placed in root of repository
- [ ] File size < 100MB (for GitHub)
- [ ] All links and addresses visible and correct
- [ ] No sensitive information (private keys, etc.)
- [ ] Smooth playback without stuttering

---

## Alternative Hosting (if file too large)

If `demo.mp4` exceeds GitHub's file size limits:

1. **YouTube**: Upload as unlisted video
   - Add link to README: `[📹 Demo Video](https://youtube.com/watch?v=...)`

2. **Vimeo**: Upload as private/unlisted
   - Embed in repository with iframe

3. **Google Drive**: Upload and share link
   - Set permissions to "Anyone with link can view"

4. **IPFS**: Decentralized hosting
   - Upload to Pinata or similar
   - Add CID to README

**Recommended**: Keep a compressed version in repo + host full quality on YouTube

---

## Video Metadata

```json
{
  "title": "FHEVM SDK - Universal Toolkit for Confidential dApps",
  "description": "Demo of the FHEVM SDK built for the Zama Bounty Challenge. Shows quick setup, Privacy Pollution Monitor integration, multi-framework support, and design decisions.",
  "tags": ["fhevm", "zama", "encryption", "blockchain", "privacy", "sdk", "react", "typescript"],
  "duration": "~7 minutes",
  "format": "MP4",
  "resolution": "1920x1080",
  "framerate": "30fps"
}
```

---

**Note**: Place the actual `demo.mp4` file in the root directory of this repository.
The video should be professionally produced and clearly demonstrate all the features described above.
