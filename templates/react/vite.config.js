import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'fhevm-sdk': '../../packages/fhevm-sdk/src',
      'fhevm-sdk/react': '../../packages/fhevm-sdk/src/react',
    },
  },
});
