import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function copyFile(fileName) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const rootReadme = path.resolve(__dirname, '..', '..', fileName);

    const targetReadme = path.resolve(process.cwd(), fileName);

    fs.copyFileSync(rootReadme, targetReadme);
}

copyFile('README.md');
copyFile('CHANGELOG.md');
