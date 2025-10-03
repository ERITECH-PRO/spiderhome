import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const target = process.env.VITE_PROXY_TARGET || 'http://localhost:3002';
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react', 'bcryptjs', 'jsonwebtoken', 'mysql2'],
    },
    define: {
      global: 'globalThis',
    },
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
      },
    },
  };
});
