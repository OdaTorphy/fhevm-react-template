/**
 * FHE Provider - Re-exports from fhevm-sdk
 * This demonstrates how to use the SDK's provider component
 *
 * The FhevmProvider component wraps your application and provides
 * FHEVM functionality to all child components through React context.
 */

export { FhevmProvider as FHEProvider, FhevmProvider } from 'fhevm-sdk/react';

// Also export the hook for accessing the FHE client
export { useFhevmClient as useFHEContext } from 'fhevm-sdk/react';
