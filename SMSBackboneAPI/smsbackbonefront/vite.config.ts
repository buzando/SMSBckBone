import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    base: '/SMSWEB/', 
    build: {
        outDir: 'dist', 
        sourcemap: true, 
        chunkSizeWarningLimit: 1000
      },
    server: {
        port: 55578,
    },
})
