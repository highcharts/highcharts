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

import Utilities from './utilities';

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
        const _infoDoclet = (
            _info.kind === 'Doclet' ?
                _info :
                _info.doclet || TSLib.newDocletInfo()
        );
        const _parentName = (
            parentNode.meta.fullname === 'plotOptions' ?
                'plotOptions.series' :
                parentNode.meta.fullname
        );

        let _fullname: (string|undefined) = TSLib.getName(_info);

        if (
            typeof _fullname !== 'string' ||
            _fullname.startsWith('_') ||
            _infoDoclet.tags.private
        ) {
            return;
        }

        _fullname = Utilities.getOptionName(_fullname);

        let _moreInfos: Array<TSLib.CodeInfo> = [];
        let _resolvedInfo: TSLib.CodeInfo;
        let _resolvedValue: TSLib.Value;

        switch (_info.kind) {

            default:
                break;

            case 'Class':
            case 'Namespace':
                for (const _memberInfo of _info.members) {
                    if (
                        _memberInfo.kind === 'Property' &&
                        _memberInfo.name === 'defaultOptions'
                    ) {
                        addTreeNode(sourceInfo, parentNode, _memberInfo, debug);
                        break;
                    }
                }
                return;

            case 'Interface':
                if (!_info.name.endsWith('Options')) {
                    return;
                }
                TSLib.autoExtendInfo(_sourceInfo, _info, debug);
                _moreInfos.push(..._info.members);
                break;

            case 'Property':
            case 'Variable':
                if (
                    _info.kind === 'Property' &&
                    _parentName
                ) {
                    _fullname = `${_parentName}.${_fullname}`;
                }
                if (!_infoDoclet.tags.type) {
                    if (_info.type) {
                        _infoDoclet.tags.type = _info.type.slice();
                    } else if (_info.value) {
                        _infoDoclet.tags.type = [
                            typeof _info.value === 'object' ?
                                (
                                    _info.value.kind === 'Object' ?
                                        '{*}' :
                                        '{Function}'
                                ) :
                            `{${_info.value}}`
                        ];
                    }
                }
                if (
                    typeof _info.value === 'object' &&
                    _info.value.kind === 'FunctionCall' &&
                    _info.value.name === 'merge' &&
                    _info.value.arguments
                ) {
                    _resolvedValue =
                        _info.value.arguments[_info.value.arguments.length - 1];
                    if (typeof _resolvedValue === 'object') {
                        _moreInfos.push(_resolvedInfo);
                    }
                    break;
                }
                if (
                    typeof _info.value === 'object' &&
                    _info.value.kind === 'Object'
                ) {
                    _moreInfos.push(..._info.value.members);
                    for (const type of (_info.value.type || [])) {
                        if (!type.endsWith('Options')) {
                            continue;
                        }
                        _resolvedInfo =
                            TSLib.resolveReference(_sourceInfo, type);
                        if (
                            _resolvedInfo &&
                            _resolvedInfo.kind !== 'Doclet'
                        ) {
                            _moreInfos.push(_resolvedInfo);
                        }
                    }
                }
                break;

        }

        const _treeNode = getTreeNode(_fullname);
        const _nodeDoclet = _treeNode.doclet;

        let _array: Array<Record<string, (string|Array<string>)>>;
        let _split: Array<string>;

        // TODO: Use TSLib.extractTagObjects
        for (const _tag of Object.keys(_infoDoclet.tags)) {
            switch (_tag) {

                default:
                    if (_infoDoclet.tags[_tag].length > 1) {
                        _nodeDoclet[_tag] =
                            _infoDoclet.tags[_tag].slice();
                    } else {
                        _nodeDoclet[_tag] = _infoDoclet.tags[_tag][0];
                    }
                    break;

                case 'default':
                    _nodeDoclet.defaultvalue =
                        TSLib.extractTagText(_infoDoclet, _tag, true);
                    break;

                case 'description':
                    _nodeDoclet[_tag] =
                        TSLib.extractTagText(_infoDoclet, _tag, true);
                    break;

                case 'extends':
                    _nodeDoclet[_tag] =
                        TSLib.extractTagText(_infoDoclet, _tag);
                    break;

                case 'productdesc':
                    _array = _nodeDoclet.productdescs = [];
                    for (
                        const _object
                        of TSLib.extractTagObjects(_infoDoclet, 'productdesc')
                    ) {
                        if (_object.type) {
                            _array.push({
                                products: _object.type,
                                value: _object.text
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
                    for (
                        const _object
                        of TSLib.extractTagObjects(_infoDoclet, 'sample')
                    ) {
                        const _sample: TreeLib.OptionDocletSample = {
                            name: _object.name || _object.text,
                            value: _object.value || ''
                        };
                        if (_object.products) {
                            _sample.products = _object.products;
                        }
                        _array.push(_sample);
                    }
                    break;

                case 'type':
                    _split = TSLib
                        .extractTypes(_infoDoclet.tags.type.join('|'), true);
                    if (_split) {
                        _nodeDoclet.type = {
                            names: _split.map(_type => _type.replace(
                                /[\w\.]+/gsu,
                                substring => (
                                    TSLib.isNativeType(substring) ?
                                        substring :
                                        substring.startsWith('Highcharts.') ?
                                            substring :
                                            `Highcharts.${substring}`
                                )
                            ).replace(
                                /^(?:Highcharts.DeepPartial|Partial)<(.*)>$/gsu,
                                '$1'
                            ).replace(
                                /\bHighcharts.AnyRecord\b/gsu,
                                'Highcharts.Dictionary<*>'
                            ).replace(/\bany\b/gsu, '*'))
                        };
                    }
                    break;

            }
        }

        for (const _moreInfo of _moreInfos) {

            if (_stack.includes(_moreInfo)) { // Break recursive option trees
                continue;
            }

            _stack.push(_moreInfo);

            add(
                TSLib.getSourceInfo(_moreInfo.meta.file, void 0, debug),
                _treeNode,
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
    let _sourceInfos: Array<TSLib.SourceInfo> = [];

    for (const _path of FSLib.getDirectoryPaths(sourceRootPath, true)) {
        if (!_path.endsWith('/Line')) {
            continue;
        }
        if (_path.split(Path.sep).includes('Series')) {
            _sourceInfos.length = 0;

            _filePath = FSLib
                .path(`${_path}/${Path.basename(_path)}PointOptions.d.ts`);
            if (FSLib.isFile(_filePath)) {

                _sourceInfos
                    .push(TSLib.getSourceInfo(_filePath, void 0, debug));
            }

            _filePath = FSLib
                .path(`${_path}/${Path.basename(_path)}SeriesDefaults.ts`);
            if (FSLib.isFile(_filePath)) {
                _sourceInfos
                    .push(TSLib.getSourceInfo(_filePath, void 0, debug));
            }

            _filePath = FSLib
                .path(`${_path}/${Path.basename(_path)}SeriesOptions.d.ts`);
            if (FSLib.isFile(_filePath)) {
                _sourceInfos
                    .push(TSLib.getSourceInfo(_filePath, void 0, debug));
            }

            _filePath = FSLib
                .path(`${_path}/${Path.basename(_path)}Series.ts`);
            if (FSLib.isFile(_filePath)) {
                _sourceInfos
                    .push(TSLib.getSourceInfo(_filePath, void 0, debug));
            }

            for (const _sourceInfo of _sourceInfos) {
                for (const _codeInfo of _sourceInfo.code) {
                    addTreeNode(_sourceInfo, _rootNode, _codeInfo);
                }
            }
        }
    }

    if (_rootNode.children?.plotOptions?.children) {
        const _plotOptions = _rootNode.children.plotOptions.children;

        let _seriesOptions: TreeLib.Option;

        for (const _seriesType of Object.keys(_plotOptions.children)) {
            _seriesOptions = TreeLib.getTreeNode(_plotOptions, _seriesType);
            TreeLib.extendTreeNode(
                _plotOptions.children[_seriesType],
                _seriesOptions
            );
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

    // timer = LogLib.starting(`Building tree from ${root}`);
    // buildTree(root, debug);
    // LogLib.finished(`Building tree from ${root}`, timer);

    if (root === DEFAULT_ROOT) {
        // if (INDICATORS_ROOT.startsWith(source)) {
        //     timer = LogLib.starting(
        //         `Building indicator tree from ${INDICATORS_ROOT}`
        //     );
        //     buildTreeIndicators(INDICATORS_ROOT, debug);
        //     LogLib.finished(
        //         `Building indicator tree from ${INDICATORS_ROOT}`,
        //         timer
        //     );
        // }
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
