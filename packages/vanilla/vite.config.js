import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'unplugin-dts/vite';

export default defineConfig(({ command, mode }) => ({
    resolve: {
        alias:
            command === 'build'
                ? { '@paprize/core/src': '@paprize/core' }
                : undefined,
    },
    build: {
        sourcemap: true,
        lib: {
            entry: 'src/index.ts',
            name: 'paprize-vanilla',
            fileName: 'paprize-vanilla',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['@paprize/core'],
            output: {
                globals: {
                    '@paprize/core': 'PaprizeCore',
                },
            },
        },
    },
    esbuild: {
        dropLabels: mode === 'production' ? ['DEV'] : [],
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            bundleTypes: true,
        }),
        checker({
            typescript: true,
        }),
    ],
}));
