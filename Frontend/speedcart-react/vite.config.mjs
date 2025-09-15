import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Restart from 'vite-plugin-restart';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: './',  // Ensure the root is this package
  plugins: [
    Restart({
      // 👇 Watch these files/folders and restart when they change
      restart: [
        '../shared/dist/**/*',      // Adjust path to match where "shared" outputs its build
      ],
    }),
    react(),
    tsconfigPaths(), // Allows Vite to resolve paths in tsconfig.json
  ],
  resolve: {
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
