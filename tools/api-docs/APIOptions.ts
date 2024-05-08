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
): void {
    const defaults = DEFAULTS[sourcePath] || [];

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
                    member.name.toLowerCase().includes('default') &&
                    types.length === 1 &&
                    types[0].endsWith('Options')
                ) {
                    defaults.push(member);
                }
                break;
        }
    }

    if (defaults.length) {
        DEFAULTS[sourcePath] = defaults;
    }

}


function addOptions(
    sourcePath: string,
    members: Array<TSLib.CodeInfo>,
    origin?: TSLib.MetaOrigin
): void {
    const options = OPTIONS[sourcePath] || [];

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
                    member.flags?.includes('declare') &&
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

    if (options.length) {
        OPTIONS[sourcePath] = options;
    }

}


function addTreeNode(
    sourceInfo: TSLib.SourceInfo,
    parentNode: TreeLib.TreeNode,
    info: (
        | TSLib.FunctionInfo
        | TSLib.InterfaceInfo
        | TSLib.PropertyInfo
        | TSLib.VariableInfo
    )
): void {
    let _treeNode: (TreeLib.TreeNode|undefined);

    if (info.doclet) {
        const _fullName = (
            TSLib.extractTagText(info.doclet, 'optionparent', true) ??
            TSLib.extractTagText(info.doclet, 'apioption', true) ??
            TSLib.extractTagText(info.doclet, 'name', true)
        );

        if (typeof _fullName === 'string') {
            _treeNode = getTreeNode(_fullName);
        }

    }

    if (!_treeNode) {

        if (
            info.kind !== 'Function' &&
            info.kind !== 'Property'
        ) {
            return;
        }

        _treeNode = getTreeNode(`${parentNode.meta.fullname}.${info.name}`);
 
    }

    let _moreInfo: (Array<(TSLib.FunctionInfo|TSLib.PropertyInfo)>|undefined);

    switch (info.kind) {
        case 'Interface':
            _moreInfo = info.members;
            break;
        case 'Property':
        case 'Variable':
            // use sourceInfo for type retrievement
            if (
                info.value &&
                typeof info.value === 'object'
            ) {
                _moreInfo = info.value.members;
            }
            break;
    }

    if (_moreInfo) {
        for (const _more of _moreInfo) {
            addTreeNode(sourceInfo, _treeNode, _more);
        }
    }

}


function buildTree(
    root: string
): void {
    const rootCode = DEFAULTS[root];
    const rootNode = {
        doclet: {

        },
        meta: {
            fullname: '',
            name: ''
        },
        children: TREE
    };

    for (const code of rootCode) {
        addTreeNode(TSLib.getSourceInfo(root), rootNode, code);
    }

}


function getTreeNode(
    fullname: string
): TreeLib.TreeNode {
    let currentNode: TreeLib.TreeNode = {
        doclet: {},
        meta: {
            fullname: '',
            name: ''
        },
        children: TREE
    };

    for (const name of fullname.split('.')) {

        if (!name) {
            continue;
        }

        if (!currentNode.children) {
            currentNode.children = {};
        }

        if (!currentNode.children[name]) {
            currentNode.children[name] = {
                doclet: {},
                meta: {
                    fullname: (
                        currentNode.meta.fullname ?
                            `${currentNode.meta.fullname}.${name}` :
                            name
                    ),
                    name
                }
            };
        }

        currentNode = currentNode.children[name];

    }

    return currentNode;
}


function loadSource(
    source: string,
    debug?: boolean
): void {
    const filePaths = (
        Path.extname(source) ?
            [source] :
            FSLib.getFilePaths(source, true)
    );

    let sourceInfo: TSLib.SourceInfo;

    for (const filePath of filePaths) {
        switch (Path.extname(filePath)) {
            case '.js':
            case '.ts':
                sourceInfo = TSLib.getSourceInfo(filePath, void 0, debug);

                addDefaults(filePath, sourceInfo.code);
                addOptions(filePath, sourceInfo.code);
        }
    }

}


async function main() {
    const args = await Yargs().argv;
    const debug = !!args.debug;
    const root = args.root as (string|undefined) || 'ts/Core/Defaults.ts';
    const source = args.source as (string|undefined) || 'ts/Core/Defaults.ts';

    LogLib.warn('Loading options from', source, '...');
    loadSource(source);
    LogLib.success('Done.');

    LogLib.warn('Building tree ...');
    buildTree(root);
    LogLib.success('Done.');

    LogLib.warn('Saving JSON ...');
    await saveJSON(debug);
    LogLib.success('Done');

}


async function saveJSON(
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
