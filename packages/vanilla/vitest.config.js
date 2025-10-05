import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig(({ command }) => ({
    resolve: {
        alias:
            command === 'build'
                ? { '@paprize/core/src': '@paprize/core' }
                : undefined,
    },
    test: {
        environment: 'happy-dom',
        coverage: {
            exclude: [
                'src/index.ts',
                'src/debugUtilities/**',
                'src/plugins/index.ts',
                'src/plugins/defaultPlugins.ts',
                ...coverageConfigDefaults.exclude,
            ],
            reporter: ['text'],
        },
    },
}));
