import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './',  // Ensure the root is this package
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@customHooks': path.resolve(__dirname, 'src/customHooks'),
      '@modularStyles': path.resolve(__dirname, 'src/modularStyles'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
    dedupe: ['shared'], // Forces Vite to always use the package, not resolve it itself
    preserveSymlinks: true // Prevents Vite from resolving `shared` to the source folder
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  publicDir: 'public',  // Explicitly set public folder
});
