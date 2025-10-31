# Next.js FHEVM Example - Complete Structure

This document provides an overview of the comprehensive Next.js example structure based on the specification.

## Directory Tree

```
nextjs-pollution-monitor/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with FHE provider
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   └── api/                          # API Routes
│       ├── fhe/                      # FHE Operations
│       │   ├── route.ts              # Main FHE endpoint
│       │   ├── encrypt/route.ts      # Encryption API
│       │   ├── decrypt/route.ts      # Decryption API
│       │   └── compute/route.ts      # Homomorphic computation API
│       └── keys/route.ts             # Key management API
│
├── components/                       # React Components
│   ├── ui/                           # Base UI components
│   │   ├── Button.tsx                # Reusable button with variants
│   │   ├── Input.tsx                 # Input with label and error handling
│   │   └── Card.tsx                  # Container with header/footer
│   ├── fhe/                          # FHE functionality components
│   │   ├── FHEProvider.tsx           # FHE context provider
│   │   ├── EncryptionDemo.tsx        # Interactive encryption demo
│   │   ├── ComputationDemo.tsx       # Homomorphic computation demo
│   │   └── KeyManager.tsx            # Key management UI
│   ├── Dashboard.tsx                 # Existing dashboard component
│   ├── PollutionReporter.tsx         # Existing pollution reporter
│   ├── StationRegistration.tsx       # Existing station registration
│   └── WalletConnect.tsx             # Existing wallet connect
│
├── lib/                              # Library utilities
│   ├── fhe/                          # FHE integration library
│   │   ├── client.ts                 # Client-side FHE operations
│   │   ├── server.ts                 # Server-side FHE operations
│   │   ├── keys.ts                   # Key management utilities
│   │   └── types.ts                  # FHE type definitions
│   ├── utils/                        # Utility functions
│   │   ├── security.ts               # Security utilities
│   │   └── validation.ts             # Validation helpers
│   └── contract.ts                   # Existing contract integration
│
├── hooks/                            # Custom React Hooks
│   ├── useFHE.ts                     # FHE client hook
│   ├── useEncryption.ts              # Encryption hook
│   └── useComputation.ts             # Computation hook
│
├── types/                            # TypeScript type definitions
│   ├── fhe.ts                        # FHE type definitions
│   └── api.ts                        # API type definitions
│
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── README.md                         # Documentation
```

## API Endpoints

### FHE Operations
- `GET/POST /api/fhe` - Main FHE endpoint status
- `POST /api/fhe/encrypt` - Encrypt values
- `POST /api/fhe/decrypt` - Decrypt with EIP-712 signature
- `POST /api/fhe/compute` - Homomorphic computations

### Key Management
- `GET /api/keys?contract=0x...` - Retrieve public key
- `POST /api/keys` - Key management operations

## Custom Hooks

### useFHE
Initialize and manage FHE client instance.

### useEncryption
Handle encryption operations with loading states.

### useComputation
Perform homomorphic computations on encrypted data.

## Components

### UI Components
- **Button**: Variants (primary, secondary, outline, danger), sizes, loading states
- **Input**: Label, error handling, helper text
- **Card**: Title, subtitle, content, footer

### FHE Components
- **FHEProvider**: Context for FHE operations
- **EncryptionDemo**: Interactive encryption demonstration
- **ComputationDemo**: Homomorphic computation demonstration
- **KeyManager**: Key management interface

## Library Modules

### FHE Library
- **client.ts**: Client-side encryption/decryption
- **server.ts**: Server-side validation and operations
- **keys.ts**: Public/private key management
- **types.ts**: Type definitions for FHE operations

### Utilities
- **security.ts**: Address validation, signature verification, rate limiting
- **validation.ts**: Type validation, value range checking

## Type Definitions

### FHE Types
- EncryptionType: uint8, uint16, uint32, uint64, bool, address
- ComputationOperation: add, sub, mul, div, eq, ne, lt, lte, gt, gte, min, max
- EncryptedValue, EncryptionResult, DecryptionResult, ComputationResult

### API Types
- Request/Response types for all API endpoints
- Error handling types
- Pagination types

## Features

✅ Complete FHE workflow (encrypt → compute → decrypt)
✅ API routes for all FHE operations
✅ Custom React hooks for state management
✅ Reusable UI component library
✅ TypeScript type safety throughout
✅ Security utilities and validation
✅ Interactive demonstration components
✅ Comprehensive documentation

## Usage Examples

See README.md for detailed usage examples and integration guides.
