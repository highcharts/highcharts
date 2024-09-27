#!/usr/bin/env node
/* *
 *
 *  Moving doclets to interfaces.
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
import FSLib from './libs/fs.js';
import Path from 'node:path';
import TS from 'typescript';
import TSLib from './libs/TS.js';
import Yargs from 'yargs';


/* *
 *
 *  Constants
 *
 * */


const HELP = [
    './tools/move-doclets.mjs [OPTIONS]',
    '',
    'OPTIONS:',
    '  --help -h        This help.',
    '  --json           Log JSON tree of each source. (move-doclets.json)',
    '  --remove         Remove doclets from source file after movement',
    '  --series [path]  Move doclets for given series path. (recursive)',
    '  --verbose        Log extra debug information.'
].join('\n');


const MAP_PROPERTY_TYPES = {
    '.center': '[string|number|null,string|number|null]',
    '.color': 'ColorType',
    '.colorKey': 'string',
    '.dataLabels': 'Partial<DataLabelOptions>',
    '.fillColor': 'ColorType',
    '.findNearestPointBy': 'SeriesFindNearestPointByValue',
    '.legendSymbol': 'LegendSymbolType',
    '.legendType': '(\'point\'|\'series\')',
    '.marker': 'PointMarkerOptions',
    '.sonification': 'SeriesSonificationOptions',
    '.stacking': 'StackOverflowValue',
    '.tooltip': 'Partial<TooltipOptions>',
    '.zoneAxis': '(\'x\'|\'y\'|\'z\'|undefined)',
    '.zones': 'Array<SeriesZonesOptions>',
};

const MAP_TYPE_IMPORTS = {
    'ColorString': 'ts/Core/Color/ColorString',
    'ColorType': 'ts/Core/Color/ColorType',
    'DashStyleValue': 'ts/Core/Renderer/DashStyleValue',
    'DataLabelOptions': 'ts/Core/Series/DataLabelOptions',
    'GradientColorObject': 'ts/Core/Color/GradientColor',
    'LegendSymbolType': 'ts/Core/Series/SeriesOptions',
    'PatternObject': 'ts/Extensions/PatternFill',
    'PointEventsOptions': 'ts/Core/Series/PointOptions',
    'PointMarkerOptions': 'ts/Core/Series/PointOptions',
    'PointOptions': 'ts/Core/Series/PointOptions',
    'PointShortOptions': 'ts/Core/Series/PointOptions',
    'SeriesFindNearestPointByValue': 'ts/Core/Series/SeriesOptions',
    'SeriesSonificationOptions': 'ts/Extensions/Sonification/Options',
    'StackOverflowValue': 'ts/Core/Series/SeriesOptions',
    'TooltipOptions': 'ts/Core/TooltipOptions',
};

const OPTION_CASTING = {
    'abands': 'ABands',
    'ad': 'AD',
    'ao': 'AO',
    'apo': 'APO',
    'arcdiagram': 'ArcDiagram',
    'area3d': 'Area3D',
    'arearange': 'AreaRange',
    'areaspline': 'AreaSpline',
    'areasplinerange': 'AreaSplineRange',
    'aroonoscillator': 'AroonOscillator',
    'atr': 'ATR',
    'bb': 'BB',
    'boxplot': 'BoxPlot',
    'cci': 'CCI',
    'cmf': 'CMF',
    'cmo': 'CMO',
    'column3d': 'Column3D',
    'columnpyramid': 'ColumnPyramid',
    'columnrange': 'ColumnRange',
    'dema': 'DEMA',
    'dependencywheel': 'DependencyWheel',
    'disparityindex': 'DisparityIndex',
    'dmi': 'DMI',
    'dotplot': 'DotPlot',
    'dpo': 'DPO',
    'ema': 'EMA',
    'errorbar': 'ErrorBar',
    'flowmap': 'FlowMap',
    'funnel3d': 'Funnel3D',
    'geoheatmap': 'GeoHeatmap',
    'heikinashi': 'HeikinAshi',
    'hlc': 'HLC',
    'hollowcandlestick': 'HollowCandlestick',
    'ikh': 'IKH',
    'keltnerchannels': 'KeltnerChannels',
    'linearregression': 'LinearRegression',
    'linearregressionangle': 'LinearRegressionAngle',
    'linearregressionintercept': 'LinearRegressionIntercept',
    'linearregressionslopes': 'LinearRegressionSlopes',
    'macd': 'MACD',
    'mapbubble': 'MapBubble',
    'mapline': 'MapLine',
    'mappoint': 'MapPoint',
    'mfi': 'MFI',
    'natr': 'NATR',
    'obv': 'OBV',
    'ohlc': 'OHLC',
    'packedbubble': 'PackedBubble',
    'pc': 'PC',
    'pivotpoints': 'PivotPoints',
    'ppo': 'PPO',
    'priceenvelopes': 'PriceEnvelopes',
    'psar': 'PSAR',
    'pyramid3d': 'Pyramid3D',
    'roc': 'ROC',
    'rsi': 'RSI',
    'scatter3d': 'Scatter3D',
    'slowstochastic': 'SlowStochastic',
    'sma': 'SMA',
    'solidgauge': 'SolidGauge',
    'tema': 'TEMA',
    'tiledwebmap': 'TiledWebMap',
    'trendline': 'TrendLine',
    'trix': 'TRIX',
    'variablepie': 'VariablePie',
    'vbp': 'VBP',
    'vwap': 'VWAP',
    'williamsr': 'WilliamsR',
    'wma': 'WMA',
    'xrange': 'XRange'
};


/* *
 *
 *  Variables
 *
 * */


let verbose = false;


/* *
 *
 *  Functions
 *
 * */


/**
 * @param {Record<string,*>} branch
 * @param {string} path
 * @param {string} statement
 */
function addImport(
    branch,
    path,
    statement
) {
    const imports = branch.imports = branch.imports || {};
    const types = imports[path] = imports[path] || [];

    for (const part of TSLib.extractTypes(statement)) {
        if (!types.includes(part)) {
            types.push(part);
        }
    }

}


/**
 * @param {Record<string,*>} branch
 * @param {TS.Node} node
 * @param {TS.Node} previousNode
 * @param {Array<Record<string,*>>} tree
 */
function decorateDoclet(
    branch,
    node,
    previousNode,
    tree
) {
    const doclets = TSLib.getDocletInfosBetween(previousNode, node)

    if (doclets.length) {
        /** @type {Record<string,*>} */
        let anonymousBranch = {};

        // Add all doclets
        for (const doclet of doclets) {
            anonymousBranch = { doclet };
            decorateName(anonymousBranch, node);
            decorateType(anonymousBranch, node);
            tree.push(anonymousBranch);
        }

        // Now move last doclet to branch, if custom option path is missing
        if (
            tree[tree.length - 1].doclet &&
            !tree[tree.length - 1].doclet.apioption &&
            !tree[tree.length - 1].doclet.optionparent
        ) {
            branch.doclet = tree.pop().doclet;
        }

    }

}


/**
 * @param {Record<string,*>} branch
 * @param {TS.Node} node
 * @param {string} [parentName]
 */
function decorateName(
    branch,
    node,
    parentName
) {
    /** @type {string} */
    let optionName;

    if (branch.doclet) {
        optionName = (
            TSLib.extractTagText(branch.doclet, 'apioption') ||
            TSLib.extractTagText(branch.doclet, 'optionparent')
        );
        if (optionName) {
            branch.name = optionName.split('.').pop();
            branch.fullName = optionName.replace(/^plotOptions\./u, 'series.');
            return;
        }
    }

    if (
        TS.isPropertyAssignment(node) ||
        TS.isVariableDeclaration(node)
    ) {
        optionName = node.name.text;
        if (optionName) {
            branch.name = optionName;
            branch.fullName = (
                parentName ?
                    `${parentName}.${optionName}` :
                    optionName
            ).replace(/^plotOptions\./u, 'series.');
            return;
        }
    }

}


/**
 * @param {Record<string,*>} branch
 * @param {TS.Node} node
 */
function decorateType(
    branch,
    node
) {

    if (node.kind === TS.SyntaxKind.UndefinedKeyword) {
        branch.type = 'undefined';
        return;
    }

    /**
     * @param {string} fullName
     * @return {string}
     */
    const reflectInMap = (fullName) => {
        return (
            MAP_PROPERTY_TYPES[fullName] ||
            MAP_PROPERTY_TYPES[fullName.replace(/^.*\./g, '.')]
        );
    };

    /**
     * @param {string} name
     * @return {string}
     */
    const reflectInOptions = (name) => {
        const optionsPath = 'ts/Core/Series/SeriesOptions.d.ts';
        const optionsSource = TS.createSourceFile(
            optionsPath,
            FS.readFileSync(optionsPath, 'utf8'),
            TS.ScriptTarget.Latest,
            true
        );
        for (const node of TSLib.getNodesChildren(optionsSource)) {
            if (
                TS.isInterfaceDeclaration(node) &&
                node.name.text.endsWith('Options')
            ) {
                for (const child of TSLib.getNodesChildren(node)) {
                    if (
                        TS.isPropertySignature(child) &&
                        child.name.text === name
                    ) {
                        return (child.type & child.type.getText());
                    }
                }
            }
        }
    };

    let optionType;

    if (
        !optionType &&
        branch.doclet
    ) {
        optionType = TSLib.extractTagText(branch.doclet, 'type');
        if (optionType) {
            optionType = optionType.replace(/^{(.*)}/g, '$1')
        }
    }

    if (
        !optionType &&
        branch.fullName
    ) {
        optionType = reflectInMap(branch.fullName);
        if (optionType) {
            branch.isMappedType = true;
        }
    }

    if (
        !optionType &&
        branch.name
    ) {
        optionType = reflectInOptions(branch.name);
        if (optionType) {
            branch.isMappedType = true;
        }
    }

    if (
        !optionType &&
        TS.isPropertyAssignment(node)
    ) {
        let child = TSLib.getNodesLastChild(node);

        if (child) {

            if (TS.isBinaryExpression(child)) {
                child = TSLib.getNodesFirstChild(child);
            }

            optionType = (
                getTypeOf(child) ||
                getTypeOf(TSLib.getNodesFirstChild(node))
            );

        }

    }

    if (
        !optionType &&
        TS.isVariableDeclaration(node)
    ) {
        if (node.type) {
            optionType = node.type.getText();
        } else {
            optionType = getTypeOf(node.getLastToken());
        }
    }

    branch.type = optionType || '*';

}


/**
 * @param {TS.SourceFile} source
 * @return {Record<string,*>}
 */
function extractDocletsTree(
    source
) {
    /**
     * @param {TS.Node} node
     * @param {TS.Node} previousNode
     * @param {Array<Record<string,*>>} tree
     */
    const process = (node, previousNode, parentName, tree) => {

        if (
            TS.isAsExpression(node) ||
            TS.isObjectLiteralExpression(node) ||
            TS.isVariableDeclaration(node) ||
            TS.isVariableDeclarationList(node)
        ) {
            for (const child of TSLib.getNodesChildren(node)) {
                process(child, previousNode, parentName, tree);
                previousNode = child;
            }
            return;
        }

        const branch = {};

        if (
            TS.isExpressionStatement(node) ||
            TS.isPropertyAssignment(node) ||
            TS.isVariableStatement(node)
        ) {

            decorateDoclet(branch, node, previousNode, tree);
            decorateName(branch, node, parentName);
            decorateType(branch, node);

            if (verbose) {
                console.info('Found:', TS.SyntaxKind[node.kind], branch.fullName);
            }

            if (!branch.fullName) {
                for (const child of TSLib.getNodesChildren(node)) {
                    process(child, previousNode, parentName, tree);
                    previousNode = child;
                }
                return;
            }

            tree.push(branch);

            if (
                branch.isMappedType ||
                (
                    TS.isExpressionStatement(node) &&
                    TS.isStringLiteral(node.getFirstToken())
                )
            ) {
                if (verbose) {
                    console.info('Skipping children:', TS.SyntaxKind[node.kind], branch.fullName);
                }
                return;
            }

            /** @type {Array<Record<string,any>>} */
            let children = [];
            /** @type {TS.Node} */
            let previousChild;

            parentName = branch.fullName || parentName;

            for (const child of TSLib.getNodesChildren(node)) {
                process(child, previousChild, parentName, children);
                previousChild = child;
            }

            if (children.length) {
                branch.children = children;
            }

        } else if (verbose) {
            console.info('Skipping:', TS.SyntaxKind[node.kind]);
        }

    };

    const tree = [];

    /** @type {TS.Node} */
    let previousNode = source.getFirstToken();

    for (const node of TSLib.getNodesChildren(source)) {
        process(node, previousNode, undefined, tree);
        previousNode = node;
    }

    return {
        fileName: source.fileName,
        children: tree
    };
}


/**
 * @param {string} path
 * @return {string|undefined}
 */
function findPairedSource(
    path
) {
    let name = Path.basename(Path.basename(path, '.d.ts'), '.ts');
    /** @type {string|undefined} */
    let pairedPath;

    path = Path.dirname(path);

    if (name.endsWith('Defaults')) {

        pairedPath = Path.join(path, name.replace(/Defaults$/, 'Options.ts'));

        if (FS.existsSync(pairedPath)) {
            return pairedPath;
        }

    }

    if (name.endsWith('Options')) {

        pairedPath = Path.join(path, name.replace(/Options$/, 'Defaults.ts'));

        if (FS.existsSync(pairedPath)) {
            return pairedPath;
        }

    }

}

/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function generateDynamicCode(
    branch
) {
    const doclet = branch.doclet;

    let code = '';

    if (
        doclet &&
        Object.keys(doclet.tags).length
    ) {
        code += (
            branch.children ?
                TSLib.toDocletString(doclet) :
                TSLib.toDocletString(doclet, 4)
        );
    }

    if (branch.children) {
        const replacements = [];
        code += 'interface ' + getInterfaceName(branch) + ' {\n';
        for (const child of branch.children) {
            if (child.children) {
                if (
                    child.doclet &&
                    Object.keys(child.doclet.tags).length
                ) {
                    code += TSLib.toDocletString(doclet, 4);
                }
                code += (
                    '    ' + getPropertyName(child) + '?: ' +
                    getMemberType(child) + ';\n'
                );
                replacements.push([0, 0, generateDynamicCode(child)]);
            } else {
                code += generateDynamicCode(child);
            }
        }
        code += '\n}\n';
        for (const replacement of replacements) {
            replacement[0] = code.length;
            replacement[1] = code.length;
        }
        code = TSLib.changeSourceCode(code, replacements);
    } else {
        code += (
            '    ' + getPropertyName(branch) + '?: ' +
            getMemberType(branch) + ';\n'
        );
    }

    if (code[0] !== '\n') {
        code = '\n' + code;
    }

    return code;
}


/**
 * @param {string} moduleFolder
 * @param {Array<string>} imports
 * @param {string} importPath
 * @return {string}
 */
function generateImportCode(
    moduleFolder,
    imports,
    importPath
) {
    const importKeyword = importPath.endsWith('.js') ? 'import' : 'import type';
    const dtsPath = importPath.replace(/(?:\.js)?$/u, '.d.ts');
    const tsPath = importPath.replace(/(?:\.js)?$/u, '.ts');
    const moduleCode = FS.readFileSync(
        (
            FS.existsSync(tsPath) ?
                tsPath :
                dtsPath
        ),
        'utf8'
    );

    /** @type {string|Array<string>} */
    let defaultImport = [];
    let namedImports = [];

    for (const item of imports) {
        if (moduleCode.includes(`export default ${item.trim()};`)) {
            defaultImport.push(item);
        } else {
            namedImports.push(item);
        }
    }

    if (namedImports.length) {
        if (namedImports.length === 1) { // > 1 comma
            namedImports = `{ ${namedImports[0]} }`;
        } else {
            namedImports = `{\n    ${namedImports.join(',\n    ')}\n}`;
        }
    }
    if (defaultImport.length) {
        defaultImport = defaultImport[0];
        if (typeof namedImports === 'string') {
            defaultImport += ', ';
        }
    }

    let relativePath = Path.relative(moduleFolder, importPath);

    relativePath = (
        relativePath[0] === '.' ?
            relativePath :
            `./${relativePath}`
    );

    return (
        importKeyword + ' ' +
        defaultImport + namedImports + ' ' +
        `from '${relativePath}';`
    );
}


/**
 * @param {Record<string,*>} branch
 * @param {boolean} [ofParent]
 * @return {string|undefined}
 */
function getInterfaceName(
    branch,
    ofParent
) {
    const doclet = branch.doclet;

    /** @param {string} fullName */
    const convertName = (fullName) => {
        const splittedName = fullName.split('.');

        if (ofParent) {
            splittedName.pop();
        }

        if (splittedName[0] === 'series') {
            splittedName.shift();
            splittedName.splice(1, 0, 'series');
        }

        return splittedName
            .map(p => (
                OPTION_CASTING[p] ||
                (p[0].toUpperCase() + p.substring(1))
            ))
            .join('')
            .replace(/Options/g, '')
            .concat('Options');
    };

    if (branch.fullName) {
        return convertName(branch.fullName);
    }

    if (doclet) {
        const fullName = (
            TSLib.extractTagText(doclet, 'apioption') ||
            TSLib.extractTagText(doclet, 'optionparent')
        );

        if (fullName) {
            return convertName(fullName);
        }
    }

}


/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function getMemberType(
    branch
) {
    const doclet = branch.doclet;

    let interfaceName = getInterfaceName(branch);
    let memberType = (
            branch.type ||
            (doclet && TSLib.extractTagText(doclet, 'type')) ||
            '*'
        )
        .replace(/[{}]/gu, '')
        .replace(/,(\S)/gu, ', $1');

    if (interfaceName) {

        if (branch.name === 'data') {
            interfaceName =
                interfaceName.replace('SeriesDataOptions', 'PointOptions');
        }

        memberType = memberType.replace(/\*/gu, interfaceName);
    }

    return memberType;
}


/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function getPropertyName(
    branch
) {
    return (
        branch.name ||
        branch.fullName?.split('.').pop() ||
        ''
    );
}


/**
 * @param {TS.Node} node
 * @return {InfoType|undefined}
 */
function getTypeOf(
    node
) {
    const _type = {
        // [TS.SyntaxKind.BigIntKeyword]: 'bigint', // JSON issue
        // [TS.SyntaxKind.BigIntLiteral]: 'bigint', // JSON issue
        [TS.SyntaxKind.FalseKeyword]: 'boolean',
        [TS.SyntaxKind.TrueKeyword]: 'boolean',
        [TS.SyntaxKind.ArrowFunction]: 'function',
        [TS.SyntaxKind.FunctionDeclaration]: 'function',
        [TS.SyntaxKind.FunctionExpression]: 'function',
        [TS.SyntaxKind.FunctionKeyword]: 'function',
        [TS.SyntaxKind.NumberKeyword]: 'number',
        [TS.SyntaxKind.NumericLiteral]: 'number',
        [TS.SyntaxKind.ObjectKeyword]: '*',
        [TS.SyntaxKind.ObjectLiteralExpression]: '*',
        [TS.SyntaxKind.StringKeyword]: 'string',
        [TS.SyntaxKind.StringLiteral]: 'string'
    }[node.kind];

    if (!_type) {
        return void 0;
    }

    return [{
        type: _type
    }];
}


async function main() {
    const argv = Yargs(process.argv).argv;

    if (argv.h || argv.help) {
        console.info(HELP);
        return;
    }

    if (argv.verbose) {
        verbose = true;
    }

    if (argv.series) {
        verbose && console.info('Moving series doclets...');
        await moveSeriesDoclets(argv.series, !!argv.json, !!argv.remove);
    }

}


/**
 * @param {TS.SourceFile} source
 * @param {Record<string,*>} tree
 * @return {string}
 */
function mergeImports(
    source,
    tree
) {
    const currentPath = Path.dirname(source.fileName);
    /** @type {Record<string, Array<string>>} */
    const imports = {};

    /**
     * @param {TS.ImportDeclaration} importNode
     * @return {string}
     */
    const getImportPath = (importNode) => {
        return Path.join(
            currentPath,
            TSLib.sanitizeText(importNode.moduleSpecifier.getText())
        );
    };

    /**
     * @param {TS.Node} node
     */
    const extractImports = (node) => {
        if (TS.isSourceFile(node)) {
            for (const child of TSLib.getNodesChildren(node)) {
                extractImports(child);
            }
        } else if (TS.isImportDeclaration(node)) {
            const path = getImportPath(node);
            const nodeTypes =
                TSLib.extractTypes(node.importClause?.getText() || '');
            const allTypes = imports[path] = imports[path] || [];

            for (const nodeType of nodeTypes) {
                if (!allTypes.includes(nodeType)) {
                    allTypes.push(nodeType);
                }
            }

        }
    };

    /**
     * @param {Record<string,*>} branch
     */
    const connectImports = (branch) => {
        /** @type {Record<string,Array<string>>} */
        let allTypes;

        if (branch.imports) {
            const branchImports = branch.imports;
            /** @type {Array<string>} */
            let branchTypes;

            for (const path of Object.keys(branchImports)) {

                branchTypes = branchImports[path];
                allTypes = imports[path] = imports[path] || [];

                for (const branchType of branchTypes) {
                    if (MAP_TYPE_IMPORTS[branchType]) {
                        const mappedTypes =
                            imports[MAP_TYPE_IMPORTS[branchType]] =
                                imports[MAP_TYPE_IMPORTS[branchType]] || [];
                        if (!mappedTypes.includes(branchType)) {
                            mappedTypes.push(branchType);
                        }
                    } else if (!allTypes.includes(branchType)) {
                        allTypes.push(branchType);
                    }
                }

            }

        }

        if (branch.type) {
            /** @type {string} */
            let path;

            for (const branchType of TSLib.extractTypes(branch.type)) {
                if (branchType === 'Highcharts') {
                    continue;
                }
                if (MAP_TYPE_IMPORTS[branchType]) {
                    path = MAP_TYPE_IMPORTS[branchType];
                } else {
                    path = 'ts/Core/Series/SeriesOptions';
                }
                allTypes = imports[path] = imports[path] || [];
                if (!allTypes.includes(branchType)) {
                    allTypes.push(branchType);
                }
            }
        }

        if (branch.children) {
            for (const subBranch of branch.children) {
                connectImports(subBranch);
            }
        }

    };

    extractImports(source);
    connectImports(tree);

    let sourceCode = source.getFullText();

    if (Object.keys(imports)) {
        /** @type {Array<[number,number,string]>} */
        const replacements = [];

        let replacementEnd = 0;

        for (const node of TSLib.getNodesChildren(source)) {
            if (TS.isImportDeclaration(node)) {
                const path = getImportPath(node);
                if (imports[path]) {
                    replacementEnd = Math.max(replacementEnd, node.getEnd());
                    replacements.push([
                        node.getStart(),
                        node.getEnd(),
                        generateImportCode(
                            currentPath,
                            imports[path],
                            path
                        )
                    ]);
                    delete imports[path];
                }
            }
        }

        for (const path in imports) {
            if (!replacements.some(r => r[3] === path)) {
                replacements.push([
                    replacementEnd,
                    replacementEnd,
                    '\n' + generateImportCode(
                        currentPath,
                        imports[path],
                        path
                    )
                ]);
            }
        }

        sourceCode = TSLib.changeSourceCode(sourceCode, replacements);

    }

    return sourceCode;
}


/**
 * @param {Record<string,*>} tree
 * @todo do not merge; turn around and put plotOptions doclet to the file end
 */
function mergeInterfaceOverwrite(
    tree
) {
    /** @type {Record<string,Record<string,*>>} */
    const visitedBranches = {};
    /** @type {Record<string,*>} */
    const newTree = { children: [] };

    const walk = (branch, newParent) => {
        /** @type {string} */
        const interfaceName = getInterfaceName(branch);
        /** @type {Record<string,*>} */
        const newBranch = visitedBranches[interfaceName] || {};

        // Check, if new branch is known
        if (visitedBranches[interfaceName]) {
            if (branch.doclet) {
                newBranch.doclet = TSLib.mergeDocletInfos(
                    newBranch.doclet,
                    branch.doclet
                );
                if (newBranch.doclet.tags.optionparent) {
                    TSLib.removeTag(newBranch.doclet, 'apioption');
                    TSLib.addTag(
                        newBranch.doclet,
                        'optionparent',
                        TSLib.removeTag(newBranch.doclet, 'optionparent')[0]
                    );
                }
            }
            newBranch.isMerged = true;
        } else {
            newBranch.name = branch.name;
            newBranch.fullName = branch.fullName;
            newBranch.type = branch.type;
            newBranch.isMappedType = branch.isMappedType;
            newBranch.imports = branch.imports;
            newBranch.doclet = branch.doclet;
            newParent.children.push(newBranch);
            visitedBranches[interfaceName] = newBranch;
        }

        if (branch.children) {
            newBranch.children = newBranch.children || [];
            for (const child of branch.children) {
                walk(child, newBranch);
            }
        }

        if (!newBranch.children?.length) {
            delete newBranch.children;
        }
    };

    if (tree.children) {
        for (const branch of tree.children) {
            walk(branch, newTree);
        }
        tree.children = newTree.children;
    }
}


/**
 * @param {string} path
 * @param {boolean} logJSON
 * @param {boolean} removeDoclets
 */
async function moveSeriesDoclets(
    path,
    logJSON,
    removeDoclets
) {
    const files = FSLib.getFilePaths(path, true);

    /** @type {TS.SourceFile} */
    let source;
    /** @type {string} */
    let sourcePath;
    /** @type {TS.SourceFile} */
    let target;
    /** @type {string} */
    let targetCode;
    /** @type {Record<string,*>} */
    let tree;

    for (const file of files) {

        if (!file.endsWith('Options.d.ts')) {
            continue;
        }

        sourcePath = findPairedSource(file);

        if (!sourcePath) {
            continue;
        }

        targetCode = await FS.promises.readFile(file, 'utf8');

        if (targetCode.includes('/**')) {
            continue;
        }

        verbose && console.info('');
        console.info('Reading', sourcePath);

        source = TS.createSourceFile(
            sourcePath,
            await FS.promises.readFile(sourcePath, 'utf8'),
            TS.ScriptTarget.Latest,
            true
        );

        tree = extractDocletsTree(source);

        if (!tree) {
            continue;
        }

        if (logJSON) {
            writeJSON(Path.join('tmp', 'move-doclets.json'), tree);
        }

        verbose && console.info('');
        console.info('Writing', file);

        target = TS.createSourceFile(
            file,
            targetCode,
            TS.ScriptTarget.Latest,
            true
        );

        writeDocletsTree(target, tree);

        if (removeDoclets) {

            verbose && console.info('');
            console.info('Cleaning', source.fileName);

            await FS.promises.writeFile(
                sourcePath,
                TSLib.removeAllDoclets(
                    await FS.promises.readFile(sourcePath, 'utf8')
                ),
                'utf8'
            );

        }
    }

}


/**
 * @param {TS.SourceFile} target
 * @param {Record<string,*>} tree
 */
function writeDocletsTree(
    target,
    tree
) {
    /** @type {Array<[number,number,Record<string,*>]>} */
    const changes = [];

    /**
     * @param {Record<string,*>} branch
     * @param {TS.Node} node
     */
    const isRegistered = (branch, node) => changes.some(change => (
        change[2].fullName === branch.fullName &&
        (
            !node ||
            change[1] === node.kind
        )
    ));

    /**
     * @param {Record<string,*>} branch
     * @param {TS.Node} node
     * @param {TS.Node} parent
     */
    const connectOptions = (branch, node, parent) => {

        if (!isRegistered(branch, node)) {
            if (TS.isInterfaceDeclaration(node)) {
                if (getInterfaceName(branch) === node.name.text) {
                    if (branch.doclet) {
                        TSLib.removeTag(branch.doclet, 'apioption');
                        TSLib.removeTag(branch.doclet, 'optionparent');
                    }
                    changes.push([node.getStart(), node.kind, branch]);
                }
            } else if (
                TS.isPropertySignature(node) &&
                TS.isInterfaceDeclaration(parent)
            ) {
                if (
                    getPropertyName(branch) === node.name.text &&
                    getInterfaceName(branch, true) === parent.name.text
                ) {
                    if (branch.doclet) {
                        TSLib.removeTag(branch.doclet, 'apioption');
                        TSLib.removeTag(branch.doclet, 'optionparent');
                    }
                    changes.push([node.getStart() - 4, node.kind, branch]);
                }
            }
        }

        if (!TS.isModuleDeclaration(node)) {
            for (const child of TSLib.getNodesChildren(node)) {
                connectOptions(branch, child, node);
            }
        }

        if (branch.children) {
            for (const subBranch of branch.children) {
                connectOptions(subBranch, node, parent);
            }
        }

    };

    /**
     * @param {Record<string,*>} branch
     */
    const addOptions = (branch) => {

        if (!isRegistered(branch)) {
            for (const node of TSLib.getNodesChildren(target)) {
                if (
                    TS.isInterfaceDeclaration(node) &&
                    getInterfaceName(branch, true) === node.name.text
                ) {
                    changes.push([
                        node.getEnd() - 1,
                        TS.SyntaxKind.Unknown,
                        branch
                    ]);

                    if (branch.children) {
                        const children = branch.children;
                        const doclet = TSLib.newDocletInfo(branch.doclet);

                        branch.type = getMemberType(branch);
                        delete branch.children;

                        changes.push([
                            node.getEnd() + 1,
                            TS.SyntaxKind.Unknown,
                            {
                                name: branch.name,
                                fullName: branch.fullName,
                                type: branch.type,
                                isMappedType: branch.isMappedType,
                                isMerged: branch.isMerged,
                                doclet,
                                children
                            }
                        ]);
                    }
                }
            }

            if (!isRegistered(branch)) {
                if (
                    branch.doclet &&
                    !branch.doclet.tags.apioption &&
                    !branch.doclet.tags.optionparent
                ) {
                    TSLib.addTag(branch.doclet, 'apioption', branch.fullName);
                }

                changes.push([
                    target.getEnd(),
                    TS.SyntaxKind.InterfaceDeclaration,
                    branch
                ]);
            }

        } else if (branch.children) {
            for (const subBranch of branch.children) {
                addOptions(subBranch);
            }
        }

    };

    if (tree.children) {

        // merge nodes with same interface path
        mergeInterfaceOverwrite(tree);

        // connect related options
        for (const branch of tree.children) {
            for (const node of TSLib.getNodesChildren(target)) {
                connectOptions(branch, node);
            }
        }

        // add unmatched options
        for (const branch of tree.children) {
            addOptions(branch);
        }

    }

    if (changes.length) {

        if (verbose) {
            console.info('');
            console.info('Applying', changes.length, 'change(s)...');
        }

        /** @type {Array<[number,number,string]>} */
        const replacements = [];

        for (const change of changes) {
            switch (change[1]) {
                case TS.SyntaxKind.InterfaceDeclaration:
                    if (change[2].doclet) {
                        replacements.push([
                            change[0],
                            change[0],
                            TSLib.toDocletString(change[2].doclet)
                        ]);
                    }
                    break;
                case TS.SyntaxKind.PropertySignature:
                    if (change[2].doclet) {
                        replacements.push([
                            change[0],
                            change[0],
                            TSLib.toDocletString(change[2].doclet, 4)
                        ]);
                    }
                    break;
                default:
                    replacements.push([
                        change[0],
                        change[0],
                        generateDynamicCode(change[2])
                    ]);
                    break;
            }
        }

        target = TSLib.changeSourceNode(target, replacements);

        let targetCode = mergeImports(target, tree);

        if (targetCode.endsWith('*/\n')) {
            targetCode += '\n(\'\');\n';
        }

        FS.writeFileSync(target.fileName, targetCode, 'utf8');

    }

}


/**
 * @param {string} filePath
 * @param {*} treeJSON
 */
function writeJSON(
    filePath,
    treeJSON
) {
    verbose && console.info('');
    console.info('Writing ' + filePath + '...');

    FS.mkdirSync(Path.dirname(filePath), { recursive: true });
    FS.writeFileSync(
        filePath,
        JSON.stringify(treeJSON, null, '    '),
        'utf8'
    );
}


/* *
 *
 *  CLI
 *
 * */


main();
