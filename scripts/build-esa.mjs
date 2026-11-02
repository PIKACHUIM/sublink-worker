import { build } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outfile = path.join(rootDir, 'dist', 'aliyun-esa.js');
const maxBundleSize = 4 * 1024 * 1024;

await fs.mkdir(path.dirname(outfile), { recursive: true });
await build({
    bundle: true,
    entryPoints: [path.join(rootDir, 'src', 'platforms', 'aliyun-esa.js')],
    format: 'esm',
    minify: true,
    outfile,
    platform: 'browser',
    target: ['es2022']
});

const { size } = await fs.stat(outfile);
if (size > maxBundleSize) {
    throw new Error(`ESA bundle is ${size} bytes, exceeding the 4 MiB function code limit`);
}
console.log(`Built dist/aliyun-esa.js (${size} bytes)`);
