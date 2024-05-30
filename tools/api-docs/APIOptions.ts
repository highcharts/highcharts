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

import FSLib from '../libs/fs.js';

import GitLib from '../libs/git.js';

import LogLib from '../libs/log.js';

import Path from 'node:path';

import TreeLib from '../libs/tree.js';

import TSLib from '../libs/ts.js';

import Utilities from './Utilities';

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


const DEFAULT_ROOT = FSLib.path('ts/Core/Defaults.ts');


const DEFAULT_SOURCE = FSLib.path('ts/');


const INDICATORS_ROOT = FSLib.path('ts/Stock/Indicators/');


const SERIES_ROOT = FSLib.path('ts/Series/');


const TREE: TreeLib.Options = {};


/* *
 *
 *  Functions
 *
 * */


function addTreeNode(
    sourceInfo: TSLib.SourceInfo,
    parentNode: TreeLib.Option,
    info: TSLib.CodeInfo,
    debug?: boolean
): void {
    const _stack: Array<TSLib.CodeInfo> = [];

    const add = (
        _sourceInfo: TSLib.SourceInfo,
        _parentNode: TreeLib.Option,
        _info: TSLib.CodeInfo
    ) => {
        const _infoDoclet = (_info.kind === 'Doclet' ? _info : _info.doclet);

        let _treeNode: (TreeLib.Option|undefined);
        let _fullname: (string|undefined);
        if (_infoDoclet) {
            _fullname = (
                TSLib.extractTagText(_infoDoclet, 'optionparent', true) ??
                TSLib.extractTagText(_infoDoclet, 'apioption', true)
            );

            if (
                typeof _fullname === 'undefined' &&
                _info.kind === 'Interface'
            ) {
                _fullname = Utilities.getOptionName(_info.name);
            }

            if (typeof _fullname === 'string') {
                _treeNode = getTreeNode(_fullname);
            }

        }

        let _moreInfos: Array<TSLib.CodeInfo> = [];
        let _referenceInfo: TSLib.ResolvedInfo;

        switch (_info.kind) {

            case 'Class':
            case 'Interface':
                TSLib.autoExtendInfo(_sourceInfo, _info, debug);
                _moreInfos.push(..._info.members);
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

            default:
                break;

        }

        if (_infoDoclet && _treeNode) {
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

                    case 'extends':
                        _nodeDoclet[_tag] =
                            TSLib.extractTagText(_infoDoclet, _tag);
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

                    case 'requires':
                    case 'see':
                        _nodeDoclet[_tag] = _infoDoclet.tags[_tag].slice();
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

                    case 'type':
                        _nodeDoclet.type = {
                            names: _infoDoclet.tags.type.slice()
                        };
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

        for (const _moreInfo of _moreInfos) {

            if (_stack.includes(_moreInfo)) { // Break recursive option trees
                continue;
            }

            _stack.push(_moreInfo);

            add(
                TSLib.getSourceInfo(_moreInfo.meta.file, void 0, debug),
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
    const _rootInfo = TSLib.getSourceInfo(rootPath, void 0, debug);
    const _rootNode = {
        doclet: {},
        meta: {
            fullname: '',
            name: ''
        },
        children: TREE
    };

    for (const _codeInfo of _rootInfo.code) {
        addTreeNode(_rootInfo, _rootNode, _codeInfo, debug);
    }

}


function buildTreeIndicators(
    sourceRootPath: string,
    debug?: boolean
): void {
    const _rootNode = getTreeNode('plotOptions');

    let _filePath: string;
    let _sourceInfo: (TSLib.SourceInfo|undefined);

    for (const _path of FSLib.getDirectoryPaths(sourceRootPath, true)) {
        if (_path.split(Path.sep).includes('Indicators')) {
            _sourceInfo = void 0;
            _filePath =
                FSLib.path(`${_path}/${Path.basename(_path)}Indicator.ts`);

            if (FSLib.isFile(_filePath)) {
                _sourceInfo = TSLib.getSourceInfo(_filePath, void 0, debug);
            }

            if (_sourceInfo) {
                console.log(_filePath);
                for (const _codeInfo of _sourceInfo.code) {
                    addTreeNode(_sourceInfo, _rootNode, _codeInfo);
                }
            }
        }
    }

}


function buildTreeSeries(
    sourceRootPath: string,
    debug?: boolean
): void {
    const _rootNode = getTreeNode('plotOptions');

    let _filePath: string;
    let _sourceInfo: (TSLib.SourceInfo|undefined);

    for (const _path of FSLib.getDirectoryPaths(sourceRootPath, true)) {
        if (_path.split(Path.sep).includes('Series')) {
            _sourceInfo = void 0;
            _filePath =
                FSLib.path(`${_path}/${Path.basename(_path)}Defaults.ts`);

            if (FSLib.isFile(_filePath)) {
                _sourceInfo = TSLib.getSourceInfo(_filePath, void 0, debug);
            }

            _filePath =
                FSLib.path(`${_path}/${Path.basename(_path)}Options.d.ts`);

            if (FSLib.isFile(_filePath)) {
                _sourceInfo = TSLib.getSourceInfo(_filePath, void 0, debug);
            }

            _filePath =
                FSLib.path(`${_path}/${Path.basename(_path)}Series.ts`);

            if (FSLib.isFile(_filePath)) {
                _sourceInfo = TSLib.getSourceInfo(_filePath, void 0, debug);
            }

            if (_sourceInfo) {
                console.log(_filePath);
                for (const _codeInfo of _sourceInfo.code) {
                    addTreeNode(_sourceInfo, _rootNode, _codeInfo);
                }
            }
        }
    }

}


function getTreeNode(
    fullname: string
): TreeLib.Option {
    let _currentNode: TreeLib.Option = {
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
                },
                children: {}
            };
        }

        _currentNode = _currentNode.children[_name];

    }

    return _currentNode;
}


async function main() {
    const args = Yargs.parseSync(process.argv) as Args;
    const debug = !!args.debug;
    const root = args.root as (string|undefined) || DEFAULT_ROOT;
    const source = args.source as (string|undefined) || DEFAULT_SOURCE;

    TSLib.sourceRoot = source;

    let timer: number;

    timer = LogLib.starting(`Building tree from ${root}`);
    buildTree(root, debug);
    LogLib.finished(`Building tree from ${root}`, timer);

    if (root === DEFAULT_ROOT) {
        if (INDICATORS_ROOT.startsWith(source)) {
            timer = LogLib.starting(
                `Building indicator tree from ${INDICATORS_ROOT}`
            );
            buildTreeIndicators(INDICATORS_ROOT, debug);
            LogLib.finished(
                `Building indicator tree from ${INDICATORS_ROOT}`,
                timer
            );
        }
        if (SERIES_ROOT.startsWith(source)) {
            timer = LogLib.starting(`Building series tree from ${SERIES_ROOT}`);
            buildTreeSeries(SERIES_ROOT, debug);
            LogLib.finished(`Building series tree from ${SERIES_ROOT}`, timer);
        }
    }

    LogLib.message(`Found ${Object.keys(TREE).length} root options:`);
    LogLib.message(Object.keys(TREE).sort().join(', '));

    LogLib.warn('Saving JSON ...');
    await saveJSON();
    LogLib.success('Done');

}


async function saveJSON() {
    const save = (filePath, obj) => {
        FS.writeFileSync(
            filePath,
            TreeLib.toJSONString(TreeLib.sortJSONTree(obj), 4),
            'utf8'
        );
        LogLib.message('Saved', filePath, '.');
    };

    TREE._meta = {
        branch: await GitLib.getBranch(),
        commit: await GitLib.getLatestCommitShaSync(),
        version: JSON.parse(FS.readFileSync('package.json', 'utf8')).version
    } as any;

    // await save('tree-defaults.json', DEFAULTS);
    save('tree-cache.json', TSLib.SOURCE_CACHE);
    save('tree-v2.json', {
        _meta: TREE._meta,
        plotOptions: TREE.plotOptions,
        series: TREE.series
    });
}


/* *
 *
 *  Runtime
 *
 * */


main();
