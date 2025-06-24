/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // <-- ceci est crucial
    environment: 'jsdom', // pour tester du React
    setupFiles: './vitest.setup.ts', // s’il existe
    alias: {
      '@': '/src' // adapte selon ton projet
    }
  }
});
