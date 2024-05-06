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

import FSLib from '../libs/fs.js';

import LogLib from '../libs/log.js';

import Path from 'node:path';

import TreeLib from '../libs/tree.js';

import TSLib from '../libs/ts.js';

import Yargs from 'yargs';


/* *
 *
 *  Constants
 *
 * */


const PRODUCT_ROOT_OPTIONS = [
    'Board.ts',
    'Defaults.ts'
];

const DEFAULTS: Record<string, Array<(TSLib.PropertyInfo|TSLib.VariableInfo)>> = {};

const OPTIONS: Record<string, Array<TSLib.InterfaceInfo>> = {};

const TREE: TreeLib.Tree = {};


/* *
 *
 *  Functions
 *
 * */


function addDefaults(
    sourcePath: string,
    members: Array<TSLib.CodeInfo>
) {
    const defaults = DEFAULTS[sourcePath] = DEFAULTS[sourcePath] || [];

    let types: Array<string>;

    for (let member of members) {
        switch (member.kind) {
            case 'Class':
                addDefaults(sourcePath, member.members);
                break;
            case 'Property':
                if (!member.flags?.includes('static')) {
                    continue;
                }
            case 'Variable':
                types = TSLib.extractTypes(member.type || '');
                if (
                    types.length === 1 &&
                    types[0].endsWith('Options')
                ) {
                    defaults.push(member);
                }
                break;
        }
    }
}


function addOptions(
    sourcePath: string,
    members: Array<TSLib.CodeInfo>,
    origin?: TSLib.MetaOrigin
) {
    const options = OPTIONS[sourcePath] = OPTIONS[sourcePath] || [];

    for (let member of members) {
        switch (member.kind) {
            case 'Interface':
                if (origin) {
                    member = TSLib.newCodeInfo(member);
                    member.meta.origin = origin;
                }
                options.push(member);
                break;
            case 'Module':
                if (
                    member.flags.includes('declare') &&
                    member.name.endsWith('Options')
                ) {
                    const path =
                        FSLib.normalizePath(sourcePath, member.name, true);

                    addOptions(
                        path,
                        member.members,
                        {
                            parent: member.name,
                            path: path
                        }
                    );

                }
                break;
            case 'Namespace':
                addOptions(sourcePath, member.members);
                break;
        }
    }

}


// function convertInterfaceToOptionPath(
//     sourceInfo: TSLib.SourceInfo,
//     interfaceInfo: TSLib.InterfaceInfo
// ) {
//     const sourcePath = sourceInfo.path;
//     const interfaceName = interfaceInfo.name;
//     const folderType = Path.dirname(sourcePath).split(Path.sep).pop();
//     const optionName = (
//         interfaceName.startsWith(folderType) ?
//             interfaceName.substring(folderType.length) :
//                 interfaceName.endsWith(`${folderType}Options`) ?
//                     interfaceName.substring(
//                         0,
//                         (interfaceName.length - folderType.length - 7)
//                     ) :
//                     interfaceName
//     );

//     if (sourcePath.includes('/Series/')) {
//         if (
//             interfaceName.startsWith(folderType) &&
//             interfaceName.endsWith('SeriesOptions')
//         ) {
//             const rest = interfaceName
//                 .substring(folderType.length, interfaceName.length - 13);

//             return `series.${folderType}.${rest.toLowerCase()}`;
//         }
//     } else {
//         if (interfaceName === '') {
            
//         }
//     }

// }


async function loadSources(
    sourcePath: string,
    debug?: boolean
) {
    const sourceInfo = TSLib.getSourceInfo(sourcePath, void 0, debug);

    addDefaults(sourcePath, sourceInfo.code);
    addOptions(sourcePath, sourceInfo.code);

}


async function main() {
    const args = await Yargs.argv;
    const debug = !!args.debug;
    const source = args.source as (string|undefined) || 'ts';

    LogLib.warn('Loading options from', source, '...');

    for (const path of FSLib.getFilePaths(source, true)) {
        if (Path.extname(path) === '.ts') {
            loadSources(path, debug);
        }
    }

    LogLib.success('Finished loading options.');

    await saveOptionsJSON(debug);

}


async function saveOptionsJSON(
    debug?: boolean
) {
    await FS.writeFile('tree-defaults.json', TSLib.toJSONString(DEFAULTS, 4), 'utf8');
    await FS.writeFile('tree-options.json', TSLib.toJSONString(OPTIONS, 4), 'utf8');
    await FS.writeFile('tree-v2.json', TSLib.toJSONString(TREE, 4), 'utf8');
}


/* *
 *
 *  Runtime
 *
 * */


main();
