import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        coverage: {
            exclude: [
                'src/index.ts',
                'src/debugUtilities/**',
                'src/report/pageConst.ts',
                'src/report/reportStyles.ts',
                'src/plugins/index.ts',
                'src/plugins/defaultPlugins.ts',
                ...coverageConfigDefaults.exclude,
            ],
            reporter: ['text', 'lcov'],
            thresholds: {
                100: true,
            },
        },
    },
});
