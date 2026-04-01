import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        open: 'index.html',
    },
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: './tests/setupTests.ts',
        coverage: {
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                ...configDefaults.exclude,
                "**/*.types.ts",
                "**/*.d.ts",
            ]
        },
    },
});
