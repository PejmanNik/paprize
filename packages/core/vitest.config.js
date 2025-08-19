import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        coverage: {
            exclude: [
                'src/index.ts',
                'src/devTools/**',
                ...coverageConfigDefaults.exclude,
            ],
            reporter: ['text']
        },
    },
});
