import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Configuration Vite simplifiée pour éviter les erreurs
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    host: true,
    open: false,
    
    // ✅ HMR simplifié
    hmr: {
      overlay: false,
      port: 5173,
    },
  },

  // ✅ Build simple
  build: {
    target: 'es2020',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },

  // ✅ Optimisations de base
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@reduxjs/toolkit',
      'react-redux',
    ],
  },

  // ✅ Configuration simple
  css: {
    devSourcemap: false,
  },

  esbuild: {
    target: 'es2020',
  },

  logLevel: 'info',
  clearScreen: false,
});