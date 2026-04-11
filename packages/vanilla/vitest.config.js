import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        coverage: {
            exclude: [
                ...coverageConfigDefaults.exclude,
                'src/index.ts',
                'src/debugUtilities/**',
                '**/dist/**',
            ],
            reporter: ['text'],
        },
    },
});
