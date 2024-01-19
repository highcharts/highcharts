import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';

const dir = path.dirname(fileURLToPath(import.meta.url));

async function getLangFiles() {
    const files = await readdir(dir);
    return files.filter((file) => file.match(/lang-.*\.json/));
}

const langFiles = await getLangFiles();

export default langFiles.map((langFile) => ({
    mode: 'production',
    entry: path.resolve(dir, './lang-module.ts'),
    output: {
        filename: `${langFile.replace('.json', '')}.src.ts`,
        path: path.resolve(dir, '../ts/masters/modules')
    },
    resolve: {
        alias: {
            langFile$: path.resolve(dir, langFile)
        }
    }
}));

