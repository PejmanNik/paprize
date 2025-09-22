import * as esbuild from 'esbuild';
import dts from 'unplugin-dts/esbuild';

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    platform: 'node',
    format: 'esm',
    target: ['node22'],
    external: ["serve-handler", "@paprize/core"],
    alias: {
        '@paprize/core/src': '@paprize/core',
    },
    outfile: 'dist/paprize-puppeteer.js',
    plugins: [dts({ bundleTypes: true })],
});
