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
import TSLib from '../libs/TS';
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
// - Links in docs like "{@link Highcharts#chart}".
// - Smart link to other docs for types.
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

    const searchJSON: Array<string> = [];
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
            !path.includes(FSLib.path('ts/Dashboards')) &&
            !path.includes(FSLib.path('ts/DataGrid')) &&
            !path.includes(FSLib.path('ts/Data'))
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
                            if (!code.doclet.tags.name[0]) {
                                console.error('Empty tags name: ', code.name);
                            }
                            code.name = (code.doclet.tags.name[0] || '')
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

    // Old interfaces: 109; classes: 29. Total: 138.
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
        packageJson = require(hcRoot + '/package.json'),
        product = 'highcharts',
        productName = 'Highcharts',
        version = packageJson.version,
        versionProps = {
            commit: exec(
                'git rev-parse --short HEAD',
                {cwd: hcRoot}
            ).toString().trim(),
            branch: exec(
                'git rev-parse --abbrev-ref HEAD',
                {cwd: hcRoot}
            ).toString().trim(),
            version
        },
        urlRoot = 'https://api.highcharts.com/',
        defaultHbsConfig = {
            isClassReference: true,
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

    // Make HTML and JSON for each class and its children
    async function processParent(info: TSLib.ClassInfo) {
        const name = info.name,
            fullName = 'Highcharts.' + name,
            description = getHTMLDescription(
                descriptionFromTags(info.doclet.tags)
            ),
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
                        const memberFullName = fullName + '.' + member.name;
                        searchJSON.push(memberFullName);

                        return {
                            name: memberFullName,
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
                deprecated: !!info.doclet.tags.deprecated,
                children: info.members.map((member: any|TSLib.PropertyInfo) => {
                    const params: Array<string> = [],
                        memberDescription: Array<string> = descriptionFromTags(
                            member.doclet.tags,
                            params
                        );
                    let returnTypeAdded = false;

                    // Return type
                    if (member.return) {
                        memberDescription.push(
                            '**Return type:** ' +
                            sanitize(member.return.join(' | '))
                        );
                        returnTypeAdded = true;
                    }
                    // Return description (and type if not added)
                    if (member.doclet.tags.return) {
                        if (!returnTypeAdded) {
                            memberDescription.push(
                                '**Return type:** ' +
                                sanitize(member.doclet.tags.return.reduce(
                                    (acc, currVal) => {
                                        return acc + (acc ? ' | ': '') +
                                            currVal.split('}')[0].slice(1);
                                    },
                                    ''
                                ))
                            );
                        }
                        memberDescription.push(
                            sanitize(member.doclet.tags.return.reduce(
                                (acc, currVal) => {
                                    return acc + (acc ? '\n\n': '') +
                                        currVal.split('}')[1].trim();
                                },
                                ''
                            ))
                        );
                        returnTypeAdded = true;
                    }


                    // Nested from value
                    if (member.value && typeof member.value === 'string') {
                        memberDescription.push(
                            '**Value:** ' + sanitize(member.value)
                        );
                    }

                    // Primarily use type
                    let typeListNames = member.type?.join(' | ') ||
                        member.doclet.tags.type?.join(' | ')
                            .replace(/[{}]/g, '');

                    // Fallback for functions
                    if (!typeListNames) {
                        if(member.doclet.tags.function) {
                            typeListNames = member.doclet.tags.function
                                .join(' | ');
                            member.kind = 'Function';
                            member.doclet.tags.type = ['Function'];
                        } else {
                            // Fallback for value only
                            typeListNames = typeof member.value === 'object' ?
                                '*' :
                                typeof member.value === 'string' ?
                                    member.value :
                                    member.kind;
                        }
                    }

                    if (typeListNames === '*') {
                        // Nested type shows as collapsible. Add children.
                        // TODO: remove the warn when you are sure it's working
                        console.warn('Check: ', info.name + '.' + member.name);
                        processParent({
                            name: info.name + '.' + member.name,
                            doclet: member.doclet,
                            members: member.value?.members || [],
                            meta: member.meta,
                            parentPath: (info as any).parentPath
                        } as unknown as TSLib.ClassInfo);
                    }

                    // TODO: Remove the legacy syntax and this can be removed.
                    typeListNames = typeListNames.replace(/#\.?/, '.');

                    return {
                        ignoreDefault: true,
                        deprecated: !!member.doclet.tags.deprecated,
                        description: getHTMLDescription(memberDescription),
                        filename: member.meta?.file ||
                            member.doclet?.meta?.file ||
                            info.meta?.file ||
                            info.doclet?.meta?.file,
                        fullname: fullName + '.' + member.name.split('\r\n')[0],

                        isLeaf: !!member.doclet.tags.type ||
                            typeof member.value !== 'object',
                        name: member.name,

                        samples: getSamples(member.doclet.tags.sample),
                        typeList: {
                            names: [typeListNames]
                        },
                        default: typeListNames,
                        type: member.kind === 'Function' ?
                            'method' : 'member',
                        functionTypes: member.kind === 'Function' ? {
                            params,
                            return: member.return
                        } : void 0,
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

        searchJSON.push(fullName);

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
                node: {
                    meta: {
                        fullname: child.fullname,
                        name: child.fullname
                    },
                    doclet: {
                        description: child.description
                    }
                }
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

    // Search
    await FS.writeFile(
        `build/api/class-reference/search.json`,
        JSON.stringify(searchJSON),
        'utf8'
    );

    // Creat the main site for backwards compatibility
    await FS.writeFile(
        `build/api/class-reference/classes.list.html`,
        mainHbs({ ...defaultHbsConfig }),
        'utf8'
    );

    // Store results
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
    if (typeof text.replace !== 'function') {
        text = JSON.stringify(text);
    }
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Convert description to HTML
function parseLine(line: string): string {
    return md.render(
        line.replace(
            /{@link ([^|}]+)(?:\|([^}]+))?}/gm,
            (_, link, name) => {
                // Remove # from the legacy syntax
                // TODO: clean up the source files
                link = link.replace('#', '.');
                // TODO: Some links miss Highcharts. prefix
                return `[${name || link}](${link})`;
            }
        ).replace(
            // Converts in links: # (and optional following dot) to a dot.
            /(\]\(Highcharts\.[^\#]+)\#[\.]?([^\)]+\))/gm,
            (_, start, end) => {
                return `${start}.${end}`;
            }
        )
    );
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
    for (const member of code.members) {
        if (
            // Allow if has doclet
            (member as any).doclet &&
            // Ignore private
            (member as any).doclet.tags?.private === void 0
        ) {
            filteredMembers.push(member);
        }

        // Create additional members from body
        if (
            (member as any).body
        ) {
            filteredMembers.push.apply(
                filteredMembers,
                getMembersFromBody((member as any).body)
            );
        }
    }
    code.members = filteredMembers;
}

// Get members from body
function getMembersFromBody(
    body: Array<TSLib.DocletInfo>
): Array<TSLib.FunctionInfo|TSLib.PropertyInfo> {
    const members: Array<TSLib.FunctionInfo|TSLib.PropertyInfo> = [];
    for (const doclet of body) {
        // Skip private
        if (doclet.tags.private) {
            continue;
        }

        members.push({
            doclet,
            kind: doclet.tags.function ? 'Function' : 'Property',
            name: doclet.tags.name?.[0].split('#')[1] || 'unknown',
            meta: doclet.meta
        });
    }
    return members;
}

/**
 * Build structure. Create directories and copy files.
 */
async function buildStructure() {
    const buildPath = 'build/api/class-reference';
    await FS.mkdir(buildPath + '/nav', {recursive: true});
    FS.cp('tools/api-docs/static', buildPath, { recursive: true });
}

/**
 * Gathers description from doclet tags for top level options and also for
 * its members.
 *
 * @param {Record<string,Array<string>>} tags Doclet tags
 * @param {Array<string>} [paramsNames=[]] Array of parameter names to populate
 */
function descriptionFromTags(
    tags: Record<string,Array<string>>,
    paramsNames: Array<string> = []
): Array<string> {
    const description: Array<string> = [];

    if (tags.description) {
        description.push(...tags.description);
    }

    if (tags.param) {
        const params = [];
        tags.param.forEach((param: string) => {
            const paramRegex = /{([^}]+)}\s+(\S+)\s*(.*)/,
                parts = param.match(paramRegex) || [],
                paramInfo = parts.length < 2 ? void 0 :
                    [
                        '| `' + parts[2] + '`', // Name
                        linkAndFormat(parts[1]), // Type
                        parts[3] // Description
                    ].join(' | ') + ' |';

            if (!paramInfo) {
                console.warn('Regex failed for param: ', param);
            }
            paramsNames.push(parts[2]);
            params.push(paramInfo || sanitize(param));
        });
        description.push(
            '**Parameters:**\n',
            '| Name | Type | Description |\n' +
            '| --- | --- | --- |\n' +
            params.join('\n')
        );
    }
    if (tags.example) {
        tags.example.forEach((example: string) => {
            description.push(
                '**Example:** \n\n```\n' + sanitize(example) +
                '\n```'
            );
        });
    }
    if (tags.since) {
        tags.since.forEach((since: string) => {
            description.push(
                '**Since:** ' + sanitize(since)
            );
        });
    }

    return description;
}

// Create internal markdown links and adjust formatting for markdown table.
function linkAndFormat(text: string): string {
    return text.replace(
        /Highcharts\.[A-Z][a-zA-Z0-9]+/g,
        (match: string) => {
            // Use # for internal links resolved in hapi (api.js).
            return `[${match}](#${match})`;
        }
    ).replace(
        /\|/g,
        // Adding spaces around pipes for better readability.
        ' &#124; '
    );
}

/* *
 *
 *  Runtime
 *
 * */

main();

