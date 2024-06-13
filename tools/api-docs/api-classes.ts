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
import Path from 'node:path';
import TSLib from '../libs/ts.js';
import TreeLib from '../libs/tree.js';
const { toJSONString } = TreeLib;
import Yargs from 'yargs';
import markdownit from 'markdown-it';
const md = markdownit();

/* *
 *
 *  Functions
 *
 * */

// TODO:
// - Check doclets that are matching the name with classes and interfaces.
// - Include kind=Doclet with matching tags.

/**
 * Main function
 *
 * @param [args.source='ts'] {string} Source directory.
 */
async function main() {
    const args = await Yargs.argv;
    const source = args.source as string || 'ts';

    await buildStructure();

    const classes: Record<string, TSLib.SourceInfo> = {};

    const filteredClassCodeInfo: Array<TSLib.ClassInfo> = [];
    // const filteredInterfaceCodeInfo: Array<TSLib.CodeInfo> = [];
    const allClassNames: Array<string> = [];
    // const allInterfaceNames: Array<string> = [];

    let content: string;

    for (const path of FSLib.getFilePaths(source, true)) {
        if (
            !path.endsWith('Defaults.ts') &&
            !path.endsWith('Options.d.ts') &&
            !path.endsWith('Options.ts') &&
            !path.endsWith('.json') &&
            !path.endsWith('.d.ts') &&
            // Ignore some like Dashboards
            !path.includes(FSLib.path('ts\\Dashboards')) &&
            !path.includes('ts\\DataGrid') &&
            !path.includes('ts\\Data')
        ) {
            content = await FS.readFile(path, 'utf8');
            if (content.includes('/**')) {
                classes[path] = TSLib
                    .getSourceInfo(path, content, !!args.debug);
                classes[path].code.forEach((code: TSLib.CodeInfo): void => {
                    if (
                        code.kind === 'Class' &&
                        // Must have doclet
                        code.doclet &&
                        // Must have description
                        code.doclet.tags.description &&
                        // Ignore private
                        code.doclet.tags.private === void 0
                    ) {
                        filteredClassCodeInfo.push(code);
                        (code as any).parentPath = path;

                        filterMembers(code);

                        // Doclet's name tag is more important than code's name
                        if (code.doclet?.tags?.name) {
                            code.name = code.doclet.tags.name[0]
                                .replace(/Highcharts./g, '');
                        }
                        allClassNames.push(code.name);
                    } /*else if (

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

                        //filterMembers(code);

                        allInterfaceNames.push(code.tags.interface[0]);
                    } else {
                        filteredOutCounter++;
                    }*/
                });
            }
        }
    }

    //console.log('Old interfaces: 109; classes: 29. Total: 138');
    // Found +1 (missing PlotLineOrBand that should be added), so all good.
    console.log('classes found: ', filteredClassCodeInfo.length);

    // TODO: Check if all interfaces are found.
    // 7 missing, +12 extra
    // console.log('interfaces found: ', allInterfaceNames.length);

    filteredClassCodeInfo.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    //console.log('--- Classes: ---');
    allClassNames.sort(
        (a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})
    );
    // console.log(allClassNames.join('\n'));

    /*console.log('--- Interfaces: ---');
    allInterfaceNames.sort(
        (a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})
    );
    console.log(allInterfaceNames.join('\n'));*/

    
    const Handlebars = require('handlebars'),
        mainHbs = Handlebars.compile(await FS.readFile(
            'tools/api-docs/templates/main.handlebars',
            'utf8'
        ));

    // Some constants for the template
    const exec = require('child_process').execSync,
        hcRoot = process.cwd(),
        packageJson = require('../../package.json'),
        product = 'highcharts',
        productName = 'Highcharts',
        version = packageJson.version,
        versionProps = {
            commit: exec(
                'git rev-parse --short HEAD',
                {cwd: process.cwd()}
            ).toString().trim(),
            branch: exec(
                'git rev-parse --abbrev-ref HEAD',
                {cwd: process.cwd()}
            ).toString().trim(),
            version: require(hcRoot  + '/package.json').version
        },
        urlRoot = 'https://api.highcharts.com/',
        defaultHbsConfig = {
            date: new Date(),
            includeClassReference: true,
            platforms: {
                'JS': '/highcharts/',
                'iOS': '/ios/highcharts/',
                'Android': '/android/highcharts/'
            },
            platform: 'JS',
            toc: {
                highcharts: {
                    displayName: 'Highcharts',
                    versions: {
                        current: '../highcharts'
                    }
                },
                highstock: {
                    displayName: 'Highcharts Stock',
                    versions: {
                        current: '../highstock'
                    }
                },
                highmaps: {
                    displayName: 'Highcharts Maps',
                    versions: {
                        current: '../highmaps'
                    }
                },
                gantt: {
                    displayName: 'Highcharts Gantt',
                    versions: {
                        current: '../gantt'
                    }
                }
            },
            twitter: {
                card: 'summary',
                creator: '@highcharts',
                site: '@highcharts'
            },
            version,
            versionProps,
            year: (new Date()).getFullYear(),
            opengraph: {
                // TODO?: Add opengraph data based on the class
                description: 'Interactive charts for your web pages.',
                determiner: '',
                image: (urlRoot + product + '/mstile-310x310.png'),
                sitename: 'Highcharts',
                title: (productName + ' API Options'),
                type: 'website',
                url: (urlRoot + product + '/')
            },
            productModule: product,
            productName,
            productVersionStr: product + '-' + version,
            searchBoost: 0, // (getSearchBoost(name) * 100),
            searchTitle: 'Overview', // getSearchTitle(node),
        };

    // Make directories
    await FS.mkdir('build/api/class-reference/nav', {recursive: true});

    // Make HTML and JSON for each class and its children
    async function processParent(info: TSLib.ClassInfo) {
        info.doclet.tags.description.push('Src: ' + info.doclet.meta?.file);

        const name = info.name,
            fullName = 'Highcharts.' + name,
            description = getHTMLDescription(info.doclet.tags.description || []),
            html = mainHbs({
                ...defaultHbsConfig,

                name: fullName,
                node: {
                    meta: {
                        fullname: fullName,
                        name: fullName,
                        hasChildren: true
                    },
                    doclet: {
                        description
                    },
                    children: info.members.map((member: any) => {
                        return {
                            name: 'Highcharts.' + name + '.' + member.name,
                            shortName: member.name,
                            node: {
                                doclet: {
                                    defaultvalue: member.value || member.kind
                                }
                            },
                            type: member.kind === 'Function' ?
                                'method' : 'member'
                        };
                    }).sort((a, b) => {
                        if (a.type !== b.type) {
                            return a.type === 'member' ? -1 : 1;
                        }
                        return a.name.localeCompare(b.name, undefined, {
                            sensitivity: 'base'
                        });
                    })
                }
            }),
            dataJSON = {
                ignoreDefault: true,
                typeList: {
                    names: ['*']
                },
                description,
                requires: info.doclet.tags.requires?.map((req: string) => {
                    return req.replace(/module:/g, '');
                }) || void 0,
                samples: getSamples(info.doclet.tags.sample),
                children: info.members.map((member: any) => {
                    if (!member.doclet) {
                        member.doclet = {
                            tags: {
                                description: [
                                    '!! No doclet !!'
                                ]
                            }
                        };
                        console.warn('No doclet found for ' + fullName +
                            '.' + member.name);
                    }

                    // Temporarly add not yet supported info into description
                    member.doclet.tags.description =
                        member.doclet.tags.description || [];
                    if (member.parameters) {
                        member.parameters.forEach((param: any) => {
                            if (param.name !== 'this') {
                                member.doclet.tags.description.push(
                                    '**Parameter:** ' + sanitize(
                                        param.name + ': ' + param.type
                                    )
                                );
                            } else {
                                member.doclet.tags.description.push(
                                    '**Ctx:** ' + sanitize(param.type)
                                );
                            }
                        });
                    }
                    if (member.doclet.tags.param) {
                        member.doclet.tags.param.forEach((param: string) => {
                            member.doclet.tags.description.push(
                                '**Doclet.param:** ' + sanitize(param)
                            );
                        });
                    }
                    if (member.return) {
                        member.doclet.tags.description.push(
                            '**Returns:** ' + sanitize(member.return)
                        );
                    }
                    if (member.body) {
                        member.doclet.tags.description.push(
                            '**Extra:** ' + sanitize(
                                JSON.stringify(member.body)
                            )
                        );
                    }

                    // Nested from value
                    if (member.value) {
                        member.doclet.tags.description.push(
                            '**Value:** ' + sanitize(
                                JSON.stringify(member.value)
                            )
                        );
                    }

                    let typeListNames = member.doclet.tags.type?.join(', ') ||
                        (typeof member.value === 'object' ?
                        '*' :
                        typeof member.value === 'string' ?
                            member.value : member.kind);

                    if (typeListNames === '*') {
                        // Nested type shows as collapsible. Add children.
                        processParent({
                            name: info.name + '.' + member.name,
                            doclet: member.doclet,
                            members: member.value?.members,
                            meta: member.meta,
                            parentPath: (info as any).parentPath
                        } as unknown as TSLib.ClassInfo);
                    }

                    return {
                        ignoreDefault: member.kind === 'Function',
                        description: getHTMLDescription(
                            member.doclet.tags.description || []
                        ),
                        filename: member.meta?.file ||
                            member.doclet?.meta?.file ||
                            info.meta?.file ||
                            info.doclet?.meta?.file,
                        fullname: fullName + '.' + member.name,

                        isLeaf: typeof member.value !== 'object',
                        // line: 000,
                        // lineEnd: 000,
                        name: member.name,

                        samples: getSamples(member.doclet.tags.sample),
                        typeList: {
                            names: [typeListNames]
                        },
                        type: member.kind === 'Function' ?
                            'method' : 'member',
                        version: versionProps.version
                    };
                // Sort by name a-z
                }).sort((a, b) => {
                    if (a.type !== b.type) {
                        return a.type === 'member' ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name, undefined, {
                        sensitivity: 'base'
                    });
                })
            };

        // For the class itself
        await FS.writeFile(
            `build/api/class-reference/nav/${fullName}.json`,
            JSON.stringify(dataJSON),
            'utf8'
        );

        // Make HTML for each child
        dataJSON.children.forEach(async (child: any) => {
            const childRes = mainHbs({
                ...defaultHbsConfig,

                name: child.fullname,
                node: child,
                description: child.description
                // TODO: add more to work without JS, handlebars only
            });

            await FS.writeFile(
                `build/api/class-reference/${child.fullname}.html`,
                childRes,
                'utf8'
            );
        });

        // Make the main HTML
        await FS.writeFile(
            `build/api/class-reference/${fullName}.html`,
            html,
            'utf8'
        );
    }
    filteredClassCodeInfo.forEach(processParent);

    // Global
    await FS.writeFile(
        `build/api/class-reference/nav/index.json`,
        JSON.stringify({
            children: allClassNames.map(name => {
                return {
                    name: 'Highcharts.' + name,
                    // Full path like chart.a.b.${name}
                    fullname: 'Highcharts.' + name
                };
            })
        }),
        'utf8'
    );

    await FS.writeFile(
        'tree-api-classes.json',
        toJSONString(filteredClassCodeInfo, '    '),
        'utf8'
    );

    /*await FS.writeFile(
        'tree-api-interfaces.json',
        toJSONString(filteredClassCodeInfo, '    '),
        'utf8'
    );*/

    // TODO: This is used for debugging, remove later
    await FS.writeFile(
        'tree-api-all.json',
        toJSONString(classes, '    '),
        'utf8'
    );

}

// Sanitize HTML
function sanitize(text: string): string {
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Convert description to HTML
function parseLine(line: string): string {
    return md.render(line);
}
function getHTMLDescription(description: string[]) {
    let html: string = '';
    description.forEach((line: string) => {
        html += parseLine(line);
    });
    return html;
}

// Map from strings to objects as expected by hapijs api (api.js).
function getSamples(
    samples: Array<string>|void
): Array<{name: string, value: string}>|void {
    if (!samples) {
        return void 0;
    }

    const samplesObjects: Array<{name: string, value: string}> = samples.map(
        (sample: string) => {
            let parts = sample.match(/^(\S+)\s+(.+?)\s*$/);

            if (!parts) {
                parts = ['', sample, sample];
            }

            return parts.length === 3 ? {
                value: parts[1],
                name: parts[2]
            } : null;
        }).reduce((acc, item) => {
            if (item) {
                acc.push(item);
            }
            return acc;
        }, []);

    return samplesObjects.length ? samplesObjects : void 0;
}

// Filter members by doclet
function filterMembers(code: TSLib.ClassInfo): void {
    const filteredMembers: Array<TSLib.MemberInfo> = [];
    for(const member of code.members) {
        if (
            // Allow only if has doclet
            (member as any).doclet &&
            // Ignore private
            (member as any).doclet.tags?.private === void 0
        ) {
            filteredMembers.push(member);
        }
    }
    code.members = filteredMembers;
}

/**
 * Build structure. Create directories and copy files.
 */
async function buildStructure() {
    const buildPath = 'build/api/class-reference';

    await FS.mkdir(buildPath, {recursive: true});

    // TODO: move more relevent files and paths
}

/* *
 *
 *  Runtime
 *
 * */

main();
