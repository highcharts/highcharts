import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';

const dir = path.dirname(fileURLToPath(import.meta.url));

async function getLangFiles() {
    const files = await readdir(dir);
    return files.filter((file) => file.match(/lang-.*\.json/));
}

const langFiles = await getLangFiles();

export default langFiles.map((langFile) => [
    {
        mode: 'production',
        entry: path.resolve(dir, './lang-module.ts'),
        module: {
            rules: [{
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        // transpileOnly: true
                    }
                }]

            }]
        },
        output: {
            filename: `${langFile.replace('.json', '')}.src.js`,
            path: path.resolve(dir, '../ts/masters/i18n'),
            scriptType: 'module',
            module: true
        },
        resolve: {
            alias: {
                langFile$: path.resolve(dir, langFile),
            }
        },
        externals: {
            'highchartsGlobal': '../../Core/Globals.js'
        },
        experiments: {
            outputModule: true
        }
    },
    {
        mode: 'production',
        entry: path.resolve(dir, './lang-module.ts'),
        module: {
            rules: [{
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        // transpileOnly: true
                    }
                }]

            }]
        },
        output: {
            filename: `${langFile.replace('.json', '')}.src.js`,
            path: path.resolve(dir, '../code/i18n'),
            scriptType: 'module',
            module: true
        },
        resolve: {
            alias: {
                langFile$: path.resolve(dir, langFile),
            }
        },
        externals: {
            'highchartsGlobal': '../../Core/Globals.js'
        },
        experiments: {
            outputModule: true
        }
    },

]
).flat();

