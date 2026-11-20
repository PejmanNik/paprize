import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import dts from 'unplugin-dts/esbuild';

await fs.rm('./dist', { recursive: true, force: true });

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    platform: 'node',
    format: 'esm',
    target: ['node22'],
    external: ['serve-handler', '@paprize/core'],
    outfile: 'dist/paprize-puppeteer.js',
    plugins: [dts({ bundleTypes: true })],
});

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    platform: 'node',
    format: 'cjs',
    target: ['node22'],
    external: ['serve-handler', '@paprize/core'],
    outfile: 'dist/paprize-puppeteer.umd.cjs',
    define: {
        // `import.meta.dirname` is ESM-only; use the CommonJS equivalent.
        'import.meta.dirname': '__dirname',
    },
});

await esbuild.build({
    entryPoints: ['src/zeroReport.ts'],
    bundle: true,
    sourcemap: true,
    platform: 'node',
    format: 'esm',
    target: ['node22'],
    outfile: 'dist/paprize-zero.js'
});
