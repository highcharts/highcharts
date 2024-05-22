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



import FS from 'node:fs';

import LogLib from '../libs/log.js';

import TreeLib from '../libs/tree.js';

import TSLib from '../libs/ts.js';

import Yargs from 'yargs';


/* *
 *
 *  Declarations
 *
 * */


interface Args {
    debug?: boolean;
    root?: string;
    source?: string;
}


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


function addTreeNode(
    sourceInfo: TSLib.SourceInfo,
    parentNode: TreeLib.TreeNode,
    info: TSLib.CodeInfo,
    debug?: boolean
): void {
    const _stack: Array<TSLib.CodeInfo> = [];

    const add = (
        _sourceInfo: TSLib.SourceInfo,
        _parentNode: TreeLib.TreeNode,
        _info: TSLib.CodeInfo
    ) => {
        let _treeNode: (TreeLib.TreeNode|undefined);

        if (
            _info.kind === 'Doclet' ||
            _info.doclet
        ) {
            const _doclet = (_info.kind === 'Doclet' ? _info : _info.doclet);
            const _fullname = (
                TSLib.extractTagText(_doclet, 'optionparent', true) ??
                TSLib.extractTagText(_doclet, 'apioption', true)
            );

            if (typeof _fullname === 'string') {
                _treeNode = getTreeNode(_fullname);
            }

        }

        let _moreInfos: Array<TSLib.CodeInfo> = [];
        let _referenceInfo: TSLib.ResolvedInfo;

        switch (_info.kind) {
            case 'Class':
            case 'Interface':
                _moreInfos.push(..._info.members);
                break;
            case 'Function':
                if (_parentNode.meta.fullname) {
                    _treeNode = (
                        _treeNode ||
                        getTreeNode(
                            `${_parentNode.meta.fullname}.${_info.name}`
                        )
                    );
                }
                break;
            case 'Namespace':
                _moreInfos.push(..._info.members);
                break;
            case 'Property':
            case 'Variable':
                if (_info.kind === 'Property') {
                    _treeNode = (
                        _treeNode ||
                        getTreeNode(
                            `${_parentNode.meta.fullname}.${_info.name}`
                        )
                    );
                }

                if (_info.type) {
                    for (const type of TSLib.extractTypes(_info.type)) {
                        if (type.endsWith('Options')) {
                            _referenceInfo =
                                TSLib.resolveType(_sourceInfo, type);
                            if (_referenceInfo) {
                                _moreInfos.push(_referenceInfo.resolvedInfo);
                            }
                        }
                    }
                }
                if (
                    _info.value &&
                    typeof _info.value === 'object' &&
                    (
                        _info.doclet ||
                        _info.kind === 'Property'
                    )
                ) {
                    _moreInfos.push(..._info.value.members);
                    for (
                        const type
                        of TSLib.extractTypes(_info.value.type || '')
                    ) {
                        if (type.endsWith('Options')) {
                            _referenceInfo =
                                TSLib.resolveType(_sourceInfo, type);
                            if (
                                _referenceInfo &&
                                _referenceInfo.resolvedInfo.kind !== 'Doclet'
                            ) {
                                _moreInfos.push(_referenceInfo.resolvedInfo);
                            }
                        }
                    }
                }
                break;
        }

        if (_treeNode) {
            if (
                _info.kind === 'Doclet' ||
                _info.doclet
            ) {
                const _infoDoclet = (
                    _info.kind === 'Doclet' ?
                    _info :
                    _info.doclet
                );
                const _nodeDoclet = _treeNode.doclet;

                let _array: Array<Record<string, (string|Array<string>)>>;
                let _split: Array<string>;

                // TODO: Use TSLib.extractTagObjects
                for (const _tag of Object.keys(_infoDoclet.tags)) {
                    switch (_tag) {

                        case 'description': 
                            _nodeDoclet[_tag] =
                                TSLib.extractTagText(_infoDoclet, _tag, true);
                            break;

                        case 'productdesc':
                            _array = _nodeDoclet[`${_tag}s`] = [];
                            for (const _text of _infoDoclet.tags[_tag]) {
                                _split = _text.split(/\s+/u, );
                                if (_split.length === 2) {
                                    _array.push({
                                        products: _split[0]
                                            .replace(/[{}]/gu, '')
                                            .split('|'),
                                        value: _split[1]
                                    });
                                }
                            }
                            break;

                        case 'sample':
                            _array = _nodeDoclet[`${_tag}s`] = [];
                            for (const _text of _infoDoclet.tags[_tag]) {
                                _split = _text.split(/\s+/u, 2);
                                if (_split.length === 2) {
                                    _array.push({
                                        name: _split[0],
                                        value: _split[1]
                                    });
                                }
                            }
                            break;

                        default:
                            if (_infoDoclet.tags[_tag].length > 1) {
                                _nodeDoclet[_tag] =
                                    _infoDoclet.tags[_tag].slice();
                            } else {
                                _nodeDoclet[_tag] = _infoDoclet.tags[_tag][0];
                            }
                            break;

                    }
                }
            }
        }

        for (const _moreInfo of _moreInfos) {

            if (_stack.includes(_moreInfo)) { // Break recursive option trees
                continue;
            }

            _stack.push(_moreInfo);

            add(
                TSLib.getSourceInfo(_moreInfo.meta.source, void 0, debug),
                (_treeNode || _parentNode),
                _moreInfo
            );

            _stack.pop();

        }

    };

    add(sourceInfo, parentNode, info);

}


function buildTree(
    rootPath: string,
    debug?: boolean
): void {
    const _rootSource = TSLib.getSourceInfo(rootPath, void 0, debug);
    const _rootNode = {
        doclet: {},
        meta: {
            fullname: '',
            name: ''
        },
        children: TREE
    };

    for (const _codeInfo of _rootSource.code) {
        addTreeNode(_rootSource, _rootNode, _codeInfo, debug);
    }

}


function getTreeNode(
    fullname: string
): TreeLib.TreeNode {
    let _currentNode: TreeLib.TreeNode = {
        doclet: {},
        meta: {
            fullname: '',
            name: ''
        },
        children: TREE
    };

    let _fullname: string;

    for (const _name of fullname.split('.')) {

        if (!_name) {
            continue;
        }

        _fullname = (
            _currentNode.meta.fullname ?
                `${_currentNode.meta.fullname}.${_name}` :
                _name
        );

        if (!_currentNode.children) {
            _currentNode.children = {};
        }

        if (!_currentNode.children[_name]) {
            _currentNode.children[_name] = {
                doclet: {},
                meta: {
                    fullname: _fullname,
                    name: _name
                }
            };
        }

        _currentNode = _currentNode.children[_name];

    }

    return _currentNode;
}


function main() {
    const args = Yargs.parseSync(process.argv) as Args;
    const debug = !!args.debug;
    const root = args.root as (string|undefined) || 'ts/Core/Defaults.ts';

    TSLib.sourceRoot = args.source as (string|undefined) || 'ts';

    let timer: number;

    timer = LogLib.starting(`Building tree from ${root}`);
    buildTree(root, debug);
    LogLib.finished(`Building tree from ${root}`, timer);

    LogLib.message(`Found ${Object.keys(TREE).length} root options:`);
    LogLib.message(Object.keys(TREE).sort().join(', '));

    LogLib.warn('Saving JSON ...');
    saveJSON();
    LogLib.success('Done');

}


function saveJSON() {
    const save = (filePath, obj) => {
        FS.writeFileSync(filePath, TSLib.toJSONString(obj, 4), 'utf8');
        LogLib.message('Saved', filePath, '.');
    };

    // await save('tree-defaults.json', DEFAULTS);
    save('tree-cache.json', TSLib.SOURCE_CACHE);
    save('tree-v2.json', TREE);
}


/* *
 *
 *  Runtime
 *
 * */


main();
