import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import dts from 'unplugin-dts/vite';

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'paprize_react',
            fileName: 'paprize-react',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react-is',
                'react-dom/client',
                'react/jsx-runtime',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-is': 'ReactIs',
                    'react-dom': 'ReactDOM',
                    'react-dom/client': 'ReactDOMClient',
                    'react/jsx-runtime': 'jsxRuntime',
                },
            },
        },
    },
    plugins: [
        react(),
        dts({
            tsconfigPath: 'tsconfig.app.json',
            insertTypesEntry: true,
            bundleTypes: true,
        }),
        checker({
            typescript: true,
        }),
    ],
});
