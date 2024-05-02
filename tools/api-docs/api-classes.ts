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

import FSLib from '../libs/fs.js';

import TSLib from '../libs/ts.js';

import Yargs from 'yargs';


/* *
 *
 *  Functions
 *
 * */

// TODO:
// - Check doclets that are matching the name with classes and interfaces.
// - Include kind=Doclet with matching tags.

async function main() {
    const args = await Yargs.argv;
    const debug = !!args.debug;
    const source = args.source as string || 'ts';
    const classes: Record<string, TSLib.SourceInfo> = {};

    const filteredClassCodeInfo: Array<TSLib.CodeInfo> = [];
    const filteredInterfaceCodeInfo: Array<TSLib.CodeInfo> = [];
    const allClassNames: Array<string> = [];
    const allInterfaceNames: Array<string> = [];

    let content: string;
    let filteredOutCounter = 0;

    for (const path of FSLib.getFilePaths(source, true)) {
        if (
            !path.endsWith('Defaults.ts') &&
            !path.endsWith('Options.d.ts') &&
            !path.endsWith('Options.ts') &&
            // Ignore some like Dashboards
            !path.includes('ts\\Dashboards') &&
            !path.includes('ts\\DataGrid') &&
            !path.includes('ts\\Data')
        ) {
            content = await FS.readFile(path, 'utf8');
            if (content.includes('/**')) {
                classes[path] = TSLib.getSourceInfo(path, content, debug);
                classes[path].code.forEach((code: TSLib.CodeInfo): void => {
                    if (
                        code.kind === 'Class' &&
                        // Must have doclet
                        code.doclet &&
                        // Must have description
                        code.doclet.tags?.description &&
                        // Ignore private
                        code.doclet.tags?.private === void 0
                    ) {
                        filteredClassCodeInfo.push(code);
                        (code as any).parentPath = path;

                        filterProperties(code);

                        // Doclet's name tag is more important than code's name
                        if (code.doclet?.tags?.name) {
                            code.name = code.doclet.tags.name[0]
                                .replace(/Highcharts./g, '');
                        }
                        allClassNames.push(code.name);
                    } else if (

                        // "kind": "Doclet",
                        // "tags": {
                        //     "interface": [
                        //         "Highcharts.AjaxSettingsObject"
                        //     ]
                        // },

                        code.kind === 'Doclet' &&
                        code.tags?.interface
                        // TODO?: Ignore private(?)
                    ) {
                        filteredInterfaceCodeInfo.push(code);
                        (code as any).parentPath = path;

                        //filterProperties(code);

                        allInterfaceNames.push(code.tags.interface[0]);
                    } else {
                        filteredOutCounter++;
                    }
                });
            }
        }
    }

    console.log('Old interfaces: 109; classes: 29. Total: 138');
    // Found +1 (missing PlotLineOrBand that should be added), so all good.
    console.log('classes found: ', filteredClassCodeInfo.length);

    // TODO: Check if all interfaces are found.
    // 7 missing, +12 extra
    console.log('interfaces found: ', allInterfaceNames.length);

    filteredClassCodeInfo.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    console.log('--- Classes: ---');
    allClassNames.sort(
        (a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})
    );
    console.log(allClassNames.join('\n'));

    console.log('--- Interfaces: ---');
    allInterfaceNames.sort(
        (a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})
    );
    console.log(allInterfaceNames.join('\n'));

    await FS.writeFile(
        'api-docs/api-classes.json',
        TSLib.toJSONString(filteredClassCodeInfo, '    '),
        'utf8'
    );

    await FS.writeFile(
        'api-docs/api-interfaces.json',
        TSLib.toJSONString(filteredClassCodeInfo, '    '),
        'utf8'
    );

    await FS.writeFile(
        'api-docs/api-all.json',
        TSLib.toJSONString(classes, '    '),
        'utf8'
    );

}

function filterProperties(code: TSLib.CodeInfo): void {
    const filteredProperties: Array<TSLib.CodeInfo> = [];
    for(const property of code.properties) {
        // Ignore private
        if (property.doclet?.tags?.private === void 0) {
            filteredProperties.push(property);
        }
    }
    code.properties = filterProperties;
}


/* *
 *
 *  Runtime
 *
 * */


main();
