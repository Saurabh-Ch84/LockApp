import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // --- CONFIGURATION FOR DEVELOPMENT (npm run dev) ---
    return {
      plugins: [react()],
      server: {
        port: 5173,
        strictPort: true,
      },
    };
  } else {
    // --- CONFIGURATION FOR PRODUCTION (npm run build) ---
    return {
      plugins: [react()],
      base: './', // Use relative paths
      build: {
        outDir: 'dist', // Build to a clean, top-level 'dist' folder
      },
    };
  }
});