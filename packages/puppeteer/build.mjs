import * as esbuild from 'esbuild';
import dts from 'unplugin-dts/esbuild';

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: ['node22'],
    outfile: 'dist/paprize-puppeteer.js',
    plugins: [dts({ bundleTypes: true })],
});
