import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const target = process.env.VITE_PROXY_TARGET || 'http://185.183.35.80:3003';
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
