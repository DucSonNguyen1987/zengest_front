import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(), // Le plugin react standard sans options supplémentaires
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
  },
  // La section esbuild a été complètement supprimée pour éviter les conflits
  // Notamment l'option jsxInject qui causait le problème
});