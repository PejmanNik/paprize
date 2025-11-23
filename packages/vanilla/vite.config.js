import { defineConfig } from 'vite';
import { paprizeConfig } from '@paprize-dev/config/vite';

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
