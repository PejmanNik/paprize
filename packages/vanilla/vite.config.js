import { defineConfig } from 'vite';
import { paprizeConfig } from '@paprize/config/vite';

export default defineConfig(
    paprizeConfig({
        build: {
            sourcemap: true,
            lib: {
                entry: 'src/index.ts',
                name: 'paprize-vanilla',
                fileName: 'paprize-vanilla',
                formats: ['es', 'umd'],
            },
        },
    })
);
