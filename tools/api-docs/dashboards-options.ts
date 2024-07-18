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


import Database from './database';
import FSLib from '../libs/fs';
import TSLib from '../libs/ts';


/* *
 *
 *  Constants
 *
 * */


const DATABASE = new Database('Highcharts Dashboards');


const PRODUCT = 'dashboards';


const REFERENCES: Record<string, true> = {};


/* *
 *
 *  Functions
 *
 * */


async function addOption(
    parentNode: (Database.Node|undefined),
    codeInfo: TSLib.CodeInfo
): Promise<(Database.Node|undefined)> {

    const doclet = codeInfo.kind === 'Doclet' ? codeInfo : codeInfo.doclet;
    const moreInfos: Array<TSLib.CodeInfo> = [];

    let name = (
        (doclet && TSLib.extractInfoName(doclet)) ??
        TSLib.extractInfoName(codeInfo)
    );

    const reference = (
        codeInfo.meta.scope ?
            `${codeInfo.meta.file}:${codeInfo.meta.scope}.${name}` :
            `${codeInfo.meta.file}:${name}`
    );

    if (REFERENCES[reference]) {
        return void 0;
    }

    REFERENCES[reference] = true;

    if (
        typeof name === 'string' &&
        !name.includes('.') &&
        parentNode
    ) {
        name = `${parentNode.name}.${name}`
    }

    let node: (Database.Node|undefined) = (
        name &&
        await DATABASE.getNode(name)
    ) || {
        description: '',
        doclet: {},
        meta: {
            file: codeInfo.meta.file
        },
        name
    };
    let resolved: TSLib.CodeInfo;
    let value: TSLib.Value;

    switch (codeInfo.kind) {

        case 'Class':
            node = void 0;
            TSLib.autoExtendInfo(codeInfo);
            for (const member of codeInfo.members) {
                if (
                    member.kind === 'Property' &&
                    member.flags?.includes('static') &&
                    TSLib
                        .extractTypes(member.type || [])
                        .some(type => type.endsWith('Options'))
                ) {
                    return addOption(void 0, member);
                }
            }
            break;

        case 'Doclet':
            break;

        case 'Export':
            value = codeInfo.value;
            return (
                typeof value === 'object' ?
                    addOption(parentNode, value) :
                    void 0
            );

        case 'FunctionCall':
            node = void 0;
            if (
                codeInfo.name === 'merge' &&
                codeInfo.arguments
            ) {
                for (const argument of codeInfo.arguments) {
                    if (typeof argument === 'object') {
                        moreInfos.push(argument);
                    }
                }
            }
            break;

        case 'Interface':
            node = void 0;
            if (codeInfo.name.endsWith('Options')) {
                TSLib.autoExtendInfo(codeInfo);
                if (doclet && parentNode) {
                    value = TSLib.extractTagText(doclet, 'description', true);
                    if (typeof value === 'string') {
                        parentNode.description = (
                            parentNode.description ?
                                `${parentNode.description}\n\n${value}` :
                                value
                        );
                        DATABASE.setNode(parentNode);
                    }
                }
                moreInfos.push(...codeInfo.members);
            }
            break;

        case 'Namespace':
        case 'Object':
            node = void 0;
            for (const member of codeInfo.members) {
                if (
                    member.kind === 'Class' ||
                    member.kind === 'Variable'
                ) {
                    moreInfos.push(member);
                }
            }
            break;

        case 'Property':
        case 'Variable':
            if (
                codeInfo.kind === 'Variable' &&
                codeInfo.name !== 'defaultOptions'
            ) {
                return;
            }
            value = codeInfo.value;
            switch (typeof value) {

                case 'boolean':
                case 'number':
                case 'string':
                    node.doclet.default = (node.doclet.default || []);
                    node.doclet.default.push(value);
                    break;

                case 'object':
                    moreInfos.push(value);
                    break;

            }
            if (codeInfo.type) {
                node.doclet.type = TSLib.extractTypes(codeInfo.type);
                for (const type of node.doclet.type) {
                    if (type.endsWith('Options')) {
                        resolved = TSLib.resolveReference(
                            codeInfo,
                            type
                        );
                        if (resolved) {
                            moreInfos.push(resolved);
                        }
                    }
                }
            }
            if (codeInfo.kind === 'Variable') {
                node = void 0;
            }
            break;

        case 'Reference':
            resolved = TSLib.resolveReference(
                TSLib.getSourceInfo(codeInfo.meta.file),
                codeInfo
            );
            return (
                resolved ?
                    addOption(parentNode, resolved) :
                    void 0
            );

    }

    if (node) {
        if (doclet) {
            for (const tag of Object.keys(doclet.tags)) {
                switch (tag) {

                    case 'apioption':
                    case 'optionparent':
                        node.name = TSLib.extractTagText(doclet, tag, PRODUCT);
                        break;

                    case 'description':
                        node.description =
                            TSLib.extractTagText(doclet, tag, PRODUCT);
                        break;

                    default:
                        node.doclet[tag] = doclet.tags[tag].slice();
                        break;

                }
            }
        }

        if (node.name) {
            console.log(node.name);
            node = await DATABASE.setNode(node);
        } else {
            node = void 0;
        }
    }

    if (moreInfos.length) {
        for (const moreInfo of moreInfos) {
            await addOption(node || parentNode, moreInfo);
        }
    }

    return node;
}


async function main() {

    // Reset

    FSLib.deleteFile('tree-database.json');

    // Auto complete foreign declarations
    const sourcePaths = FSLib.getFilePaths(FSLib.path('ts/'), true);

    for (const sourcePath of sourcePaths) {
        if (
            sourcePath.endsWith('.d.ts') ||
            sourcePath.startsWith(FSLib.path('ts/Dash')) ||
            sourcePath.startsWith(FSLib.path('ts/Data'))
        ) {
            TSLib.getSourceInfo(sourcePath);
        }
    }

    TSLib.autoCompleteInfos();

    // Load root options
    await addOption(
        void 0,
        TSLib.resolveReference(
            TSLib.getSourceInfo(FSLib.path('ts/Dashboards/Board.ts')),
            'Board.defaultOptions'
        )
    );

}


/* *
 *
 *  Runtime
 *
 * */


main()
    .catch(error => {
        throw error;
    });
