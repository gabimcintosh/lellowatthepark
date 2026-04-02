import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        open: 'index.html',
    },
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        setupFiles: './tests/setupTests.ts',
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/index.tsx",
                "src/App.tsx",
                ...configDefaults.exclude,
                "**/*.types.ts",
                "**/*.d.ts",
            ]
        },
    },
});
