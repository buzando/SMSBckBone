import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env, // Si necesitas acceso completo a las variables de proceso
    },
    optimizeDeps: {
        include: ['@mui/material/Tooltip',],
    },
    build: {
        outDir: 'build',
        sourcemap: true,
        chunkSizeWarningLimit: 1000,
       
    },
    server: {
        port: 55578,
        host: true, // Permite acceso desde la red local
    },
     base:'',
})
