import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        coverage: {
            exclude: [
                'src/index.ts',
                'src/debugUtilities/**',
                ...coverageConfigDefaults.exclude,
            ],
            reporter: ['text'],
        },
    },
});
