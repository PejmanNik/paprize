import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'unplugin-dts/vite';

export default defineConfig(({ mode }) => ({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'paprize_core',
            fileName: 'paprize-core',
            formats: ['es', 'umd'],
        },
    },
    esbuild: {
        dropLabels: mode === 'production' ? ['DEV'] : []
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
