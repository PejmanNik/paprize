import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import dts from 'unplugin-dts/vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
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
            name: 'paprize-react',
            fileName: 'paprize-react',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: [
                '@paprize/core',
                'react',
                'react-dom',
                'react-is',
                'react-dom/client',
                'react/jsx-runtime',
            ],
            output: {
                globals: {
                    '@paprize/core': 'PaprizeCore',
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
}));
