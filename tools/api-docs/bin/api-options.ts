#!/usr/bin/env npx ts-node
/* *
 *
 *  Creating API options documentation from TypeScript sources.
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
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
    const options: Record<string, TSLib.SourceInfo> = {};

    let content: string;
    let sourceInfo: TSLib.SourceInfo;

    for (const path of FSLib.getFilePaths(source, true)) {

        if (path.endsWith('Options.d.ts')) {

            content = await FS.readFile(path, 'utf8');

            if (content.includes('/**')) {

                options[path] = sourceInfo =
                    TSLib.getSourceInfo(path, content, debug);

                for (const info of sourceInfo.code) {

                    if (
                        info.kind === 'Class' ||
                        info.kind === 'Interface'
                    ) {

                        TSLib.autoExtendInfo(sourceInfo, info);

                    }

                }

            }

        }

    }

    console.log(Object.keys(options));

}


/* *
 *
 *  Runtime
 *
 * */


main();
