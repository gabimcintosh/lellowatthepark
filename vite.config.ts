import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
    appType: 'spa',
    base: './',
    server: {
        open: '/index.html'
    },
    build: {
        target: 'esnext',
    },
    plugins: [react()],
} satisfies UserConfig;
