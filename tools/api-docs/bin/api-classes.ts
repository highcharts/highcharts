#!/usr/bin/env npx ts-node
/* *
 *
 *  Creating API classes documentation from TypeScript sources.
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Kacper Madej
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import FS from 'node:fs/promises';

import FSLib from '../../libs/fs.js';

import TSLib from '../../libs/ts.js';

import Yargs from 'yargs';


/* *
 *
 *  Functions
 *
 * */


async function main() {
    const args = await Yargs.argv;
    const debug = !!args.debug;
    const source = args.source as string || 'ts'
    const classes: Record<string, TSLib.SourceInfo> = {};

    let content: string;

    for (const path of FSLib.getFilePaths(source, true)) {
        if (
            !path.endsWith('Defaults.ts') &&
            !path.endsWith('Options.d.ts') &&
            !path.endsWith('Options.ts')
        ) {
            content = await FS.readFile(path, 'utf8');
            if (content.includes('/**')) {
                classes[path] = TSLib.getSourceInfo(path, content, debug);
            }
        }
    }

    console.log(Object.keys(classes));

}


/* *
 *
 *  Runtime
 *
 * */


main();
