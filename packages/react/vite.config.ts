import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { paprizeConfig } from '@paprize/config/vite';

export default defineConfig(
    paprizeConfig({
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
        plugins: [react()],
    })
);
