import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/store': path.resolve(__dirname, 'src/store'),
    },
  },
  server: {
    port: 3031, // Changed back to 3001 to match your original client setup
    host: true, // Allow external connections
    open: true, // Auto-open browser
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, options) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Proxying request:', req.method, req.url ?? '', '→', options?.target + (req?.url ?? ''));
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    cors: true, // Enable CORS for the dev server
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          form: ['zod', 'react-hook-form', '@hookform/resolvers/zod'],
          router: ['wouter'],
          seo: ['react-helmet-async'],
          error: ['react-error-boundary'],
          i18n: ['react-i18next'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
        },
      },
    },
  },
});