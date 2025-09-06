import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'unplugin-dts/vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'paprize_puppeteer',
            fileName: 'paprize-puppeteer',
            formats: ['es', 'umd'],
        },
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
});
