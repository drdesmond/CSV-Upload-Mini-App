import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  esbuild: {
    // Disable TypeScript checking during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  build: {
    // Disable TypeScript checking during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings
        if (warning.code === 'TS2307' || warning.code === 'TS2339') return;
        warn(warning);
      },
    },
  },
});
