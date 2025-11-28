import * as esbuild from 'esbuild';
import fs from 'fs/promises';

await fs.rm('./dist', { recursive: true, force: true });

await esbuild.build({
    entryPoints: ['utils/setupLibs.ts'],
    bundle: true,
    sourcemap: false,
    platform: 'node',
    format: 'esm',
    target: ['node22'],
    external: [],
    outfile: 'dist/paprize.js',
    plugins: [],
});
