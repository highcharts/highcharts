/*
 * (c) Highsoft AS
 */


/* eslint-disable no-console, no-underscore-dangle, no-unused-expressions, no-use-before-define */


/* *
 *
 *  Imports
 *
 * */


const FS = require('node:fs');


const TS = require('typescript');


/* *
 *
 *  Constants
 *
 * */


const DOCLET = /\/\*\*.*?\*\//gsu;


const NATIVE_TYPES = [
    'Array',
    'Function',
    'NaN',
    'Number',
    'Object',
    'String',
    'Symbol'
];


const TYPE_SPLIT = /\W+/gsu;


/* *
 *
 *  Functions
 *
 * */


/**
 * Shifts ranges in the source code with replacements.
 *
 * @param {string} sourceCode
 * Source code to change.
 *
 * @param {Array<[number,number,string]} replacements
 * Replacements to apply.
 *
 * @return {string}
 * Changed source code.
 */
function changeSourceCode(
    sourceCode,
    replacements
) {

    if (
        !replacements ||
        !replacements.length
    ) {
        return sourceCode;
    }

    for (const replacement of replacements.sort((a, b) => b[0] - a[0])) {
        sourceCode = (
            sourceCode.substring(0, replacement[0]) +
            replacement[2] +
            sourceCode.substring(replacement[1])
        );
    }

    return sourceCode;
}


/**
 * Shifts ranges in the source file with replacements.
 *
 * @param {TS.SourceFile} sourceFile
 * Source file to change.
 *
 * @param {Array<[number,number,string]} replacements
 * Replacements to apply.
 *
 * @return {TS.SourceFile}
 * New source file with changes.
 */
function changeSourceFile(
    sourceFile,
    replacements
) {

    if (
        !replacements ||
        !replacements.length
    ) {
        return sourceFile;
    }

    return TS.createSourceFile(
        sourceFile.fileName,
        changeSourceCode(sourceFile.getFullText(), replacements),
        TS.ScriptTarget.ESNext,
        true
    );
}


/**
 * Logs debug information for a node and its children into the console.
 *
 * @param {TS.Node} node
 * Node to debug.
 *
 * @param {number} [depth=0]
 * Level of debug depth regarding children.
 *
 * @param {string} [indent=""]
 * Internal parameter.
 */
function debug(
    node,
    depth = 0,
    indent = ''
) {

    if (!node) {
        console.info(indent + 0, 'undefined', '[-:-]');
        return;
    }

    console.info(
        indent + node.kind,
        TS.SyntaxKind[node.kind],
        `[${node.getFullStart()}:${node.getEnd()}]`
    );

    if (depth-- > 0) {
        indent += '  ';
        for (const child of getNodesChildren(node)) {
            debug(child, depth, indent);
        }
    }

}


/**
 * Extracts all types of a type statement, including intersects and unions.
 *
 * @param {string} typeString
 * Type statement as string to extract from.
 *
 * @param {boolean} [includeNativeTypes]
 * Set `true` to include TypeScript's native types.
 *
 * @return {Array<string>}
 * Array of extracted types.
 */
function extractTypes(
    typeString,
    includeNativeTypes
) {
    /** @type {Array<string>} */
    const types = [];

    for (const part of typeString.split(TYPE_SPLIT)) {

        if (
            !includeNativeTypes &&
            isNativeType(part)
        ) {
            continue;
        }

        if (!types.includes(part)) {
            types.push(part);
        }

    }

    return types;
}


/**
 * Retrieve child informations.
 *
 * @param {Array<TS.Node>} nodes
 * Child nodes to extract from.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {Array<NodeInfo>}
 * Retrieved child informations.
 */
function getChildInfos(
    nodes,
    includeNodes
) {
    /** @type {Array<NodeInfo>} */
    const _infos = [];

    /** @type {DocletInfo} */
    let _doclet;
    /** @type {Array<DocletInfo>} */
    let _doclets;
    /** @type {NodeInfo} */
    let _child;
    /** @type {Array<NodeInfo>} */
    let _children;
    /** @type {TS.Node} */
    let previousNode = nodes[0];

    for (const node of nodes) {

        if (node.kind === TS.SyntaxKind.EndOfFileToken) {
            break;
        }

        _children = getVariableInfos(node, includeNodes);

        if (_children.length) {
            _child = _children.shift();
        } else {
            _child = (
                getImportInfo(node, includeNodes) ||
                getInterfaceInfo(node, includeNodes) ||
                getPropertyInfo(node, includeNodes)
            );
        }

        _doclets = getDocletInfosBetween(previousNode, node, includeNodes);

        if (!_child) {
            _infos.push(..._doclets);
            continue;
        }

        if (_doclets.length) {
            _doclet = _doclets[_doclets.length - 1];
            if (!_doclet.tags.apioption) {
                _child.doclet = _doclets.pop();
            }
            _infos.push(..._doclets);
        }

        _infos.push(_child);

        if (_children.length) {
            _infos.push(..._children);
            _children.length = 0;
        }

        previousNode = node;

    }

    return _infos;
}


/**
 * Retrieve doclet informations between two nodes.
 *
 * @param {TS.Node} startNode
 * Node that comes before doclets.
 *
 * @param {TS.Node} endNode
 * Node that comes after doclets.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {Array<DocletInfo>}
 * Retrieved doclet informations.
 */
function getDocletInfosBetween(
    startNode,
    endNode,
    includeNodes
) {
    /** @type {Array<DocletInfo>} */
    const _doclets = [];

    /** @type {DocletInfo} */
    let _doclet;
    /** @type {string} */
    let _tagName;
    /** @type {Record<string,Array<string>>} */
    let _tags;

    for (const doclet of getDocletsBetween(startNode, endNode)) {

        _doclet = {
            kind: 'Doclet',
            tags: {}
        };
        _tags = _doclet.tags;

        for (const node of doclet) {
            if (TS.isJSDoc(node)) {
                if (node.comment) {
                    _tags.description = _tags.description || [];
                    _tags.description.push(
                        node.comment instanceof Array ?
                            node.comment.map(c => c.text) :
                            node.comment
                    );
                }
                if (node.tags) {
                    for (const tag of node.tags) {
                        _tagName = tag.tagName.getText();
                        _tags[_tagName] = _tags[_tagName] || [];
                        _tags[_tagName].push(
                            tag.getText()
                                .substring(_tagName.length + 1)
                                .split(/\n *\*?/gu)
                                .join('\n')
                                .trim()
                        );
                    }
                    if (includeNodes) {
                        _doclet.node = node;
                    }
                }
            }
        }

        _doclets.push(_doclet);

    }

    if (_doclets.length) {
        console.log(TS.SyntaxKind[startNode.kind], TS.SyntaxKind[endNode.kind]);
    }

    return _doclets;
}


/**
 * Retrieves all doclet nodes between two nodes.
 *
 * @param {TS.Node} startNode
 * Start node that comes before doclets.
 *
 * @param {TS.Node} endNode
 * End node that comes after doclets.
 *
 * @return {Array<ReturnType<TS.getJSDocCommentsAndTags>>}
 * Array of doclet nodes.
 *
 * @todo add function for simple array<doclet<tags>>
 */
function getDocletsBetween(
    startNode,
    endNode
) {
    /** @type {Array<ReturnType<TS.getJSDocCommentsAndTags>>} */
    const doclets = [];
    const end = endNode.getStart();
    const start = (
        startNode === endNode ?
            startNode.getFullStart() :
            startNode.getEnd()
    );

    /** @type {ReturnType<TS.getJSDocCommentsAndTags>} */
    let parts;

    TS.forEachChild(
        TS.createSourceFile(
            'doclets.ts',
            Array
                .from(
                    startNode
                        .getSourceFile()
                        .getFullText()
                        .substring(start, end)
                        .matchAll(DOCLET)
                )
                .map(match => match[0] + '\n\'\';\n')
                .join(''),
            TS.ScriptTarget.Latest,
            true
        ),
        node => {
            parts = TS.getJSDocCommentsAndTags(node);
            if (parts.length) {
                doclets.push(parts);
            }
        }
    );

    return doclets;
}


/**
 * Retrieves import information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be an import.
 *
 * @param {boolean} includeNode
 * Whether to include the TypeScript node in the information.
 *
 * @return {ImportInfo|undefined}
 * Import or `undefined`.
 */
function getImportInfo(
    node,
    includeNode
) {

    if (!TS.isImportDeclaration(node)) {
        return void 0;
    }

    /** @type {ImportInfo} */
    const _import = {
        kind: 'Import'
    };

    _import.from = node.moduleSpecifier
        .getText()
        .replace(/^(['"])(.*)\1$/u, '$2');

    if (node.importClause) {
        const _imports = _import.imports = {};

        /** @type {string} */
        let propertyName;

        for (const clause of getNodesChildren(node.importClause)) {
            if (TS.isIdentifier(clause)) {
                _imports.default = clause.getText();
            }
            if (TS.isNamedImports(clause)) {
                for (const child of getNodesChildren(clause)) {
                    if (TS.isImportSpecifier(child)) {
                        propertyName = (
                            child.propertyName &&
                            child.propertyName.getText() ||
                            child.name.getText()
                        );
                        _imports[propertyName] = child.name.getText();
                    }
                }
            }
        }

    }

    if (includeNode) {
        _import.node = node;
    }

    return _import;
}


/**
 * Retrieves interface information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be an interface.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {InterfaceInfo|undefined}
 * Interface or `undefined`.
 */
function getInterfaceInfo(
    node,
    includeNodes
) {

    if (!TS.isInterfaceDeclaration(node)) {
        return void 0;
    }

    /** @type {InterfaceInfo} */
    const _interface = {
        kind: 'Interface'
    };

    _interface.name = node.name.getText();

    if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
            if (clause.token === TS.SyntaxKind.ExtendsKeyword) {
                _interface.extends = clause.types.map(t => t.getText());
            } else {
                _interface.implements = clause.types.map(t => t.getText());
            }
        }
    }

    if (node.members) {
        const _properties = _interface.properties = [];
        for (const member of getChildInfos(node.members, includeNodes)) {
            if (
                member.kind === 'Doclet' ||
                member.kind === 'Property'
            ) {
                _properties.push(member);
            }
        }
    }

    if (node.typeParameters) {
        const _parameter = _interface.parameter = [];
        for (const param of node.typeParameters) {
            _parameter.push(param.getText());
        }
    }

    if (includeNodes) {
        _interface.node = node;
    }

    return _interface;
}


/**
 * Retrieves all logical children and skips statement tokens.
 *
 * @param {TS.Node} node
 * Node to retrieve logical children from.
 *
 * @return {Array<TS.Node>}
 * Array of logical children.
 */
function getNodesChildren(
    node
) {
    /** @type {Array<TS.Node>} */
    const children = [];

    TS.forEachChild(node, child => {
        children.push(child);
    });

    return children;
}


/**
 * Retrieve the first logical child of a node.
 *
 * @param {TS.Node} node
 * Node to retrieve the first logical child from.
 *
 * @return {TS.Node|undefined}
 * First logical child, if found.
 */
function getNodesFirstChild(
    node
) {
    return getNodesChildren(node).shift();
}


/**
 * Retrieve the last logical child of a node.
 *
 * @param {TS.Node} node
 * Node to retrieve the last logical child from.
 *
 * @return {TS.Node|undefined}
 * Last logical child, if found.
 */
function getNodesLastChild(
    node
) {
    return getNodesChildren(node).pop();
}


/**
 * Retrieves property information from the current node.
 *
 * @param {TS.Node} node
 * Node that might be a property.
 *
 * @param {boolean} includeNode
 * Whether to include the TypeScript node in the information.
 *
 * @return {PropertyInfo|undefined}
 * Property information or `undefined`.
 */
function getPropertyInfo(
    node,
    includeNode
) {

    if (
        !TS.isPropertyAssignment(node) &&
        !TS.isPropertyDeclaration(node) &&
        !TS.isPropertySignature(node)
    ) {
        return void 0;
    }

    /** @type {PropertyInfo} */
    const _property = {
        kind: 'Property'
    };

    _property.name = node.name.getText();

    if (node.type) {
        _property.type = node.type.getText();
    }

    if (node.initializer) {
        _property.value = node.initializer.getText();
    }

    if (includeNode) {
        _property.node = node;
    }

    return _property;
}


/**
 * Retrieves source information from the given file path.
 *
 * @param {string} filePath
 * Path to source file.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {SourceInfo|undefined}
 * Source information or `undefined`.
 */
function getSourceInfo(
    filePath,
    includeNodes
) {

    if (!FS.existsSync(filePath)) {
        return void 0;
    }

    const sourceFile = TS.createSourceFile(
        filePath,
        FS.readFileSync(filePath, 'utf8'),
        TS.ScriptTarget.Latest,
        true
    );

    /** @type {SourceInfo} */
    const _source = {
        kind: 'Source',
        path: filePath
    };

    _source.code = getChildInfos(
        getNodesChildren(sourceFile),
        includeNodes
    );

    if (includeNodes) {
        _source.node = sourceFile;
    }

    return _source;
}


/**
 * Retrieves variable informations from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a variable or assignment.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {Array<VariableInfo>}
 * Variable informations.
 */
function getVariableInfos(
    node,
    includeNodes
) {

    if (
        TS.isVariableDeclarationList(node) ||
        TS.isVariableStatement(node)
    ) {
        return getChildInfos(getNodesChildren(node), includeNodes);
    }

    if (!TS.isVariableDeclaration(node)) {
        return [];
    }

    /** @type {VariableInfo} */
    const _variable = {
        kind: 'Variable',
        name: node.name.getText()
    };

    if (node.initializer) {
        const _values = getChildInfos(
            getNodesChildren(node.initializer),
            includeNodes
        );

        if (_values.length === 1) {
            _variable.value = _values[0];
        } else {
            _variable.value = node.initializer.getText();
        }

    }

    if (node.type) {
        _variable.type = node.type.getText();
    }

    if (includeNodes) {
        _variable.node = node;
    }

    return [_variable];
}


/**
 * Tests if a text string starts with upper case.
 *
 * @param {string} text
 * Text string to test.
 *
 * @return {boolean}
 * `true`, if text string starts with upper case.
 */
function isCapitalCase(
    text
) {
    const firstChar = `${text}`.charAt(0);

    return (firstChar === firstChar.toUpperCase());
}


/**
 * Tests if a type is integrated into TypeScript.
 *
 * @param {string} type
 * Type to test.
 *
 * @return {boolean}
 * `true`, if type is integrated into TypeScript.
 */
function isNativeType(
    type
) {
    return (
        type.length < 2 ||
        !isCapitalCase(type) ||
        NATIVE_TYPES.includes(type) ||
        type.startsWith('Array') ||
        TS.SyntaxKind[type] > 0
    );
}


/**
 * Converts any tree to a JSON string, while converting TypeScript nodes to raw
 * code.
 *
 * @param {unknown} jsonTree
 * Tree to convert.
 *
 * @param {string} [indent]
 * Indent option.
 *
 * @return {string}
 * Converted JSON string.
 */
function toJSONString(
    jsonTree,
    indent
) {
    return JSON.stringify(
        jsonTree,
        (_key, value) => (
            (
                typeof value.kind === 'number' &&
                typeof value.getText === 'function'
            ) ?
                value.getText() :
                value
        ),
        indent
    );
}


/* *
 *
 *  Default Export
 *
 * */


module.exports = {
    changeSourceCode,
    changeSourceFile,
    debug,
    extractTypes,
    getChildInfos,
    getDocletsBetween,
    getNodesChildren,
    getNodesFirstChild,
    getNodesLastChild,
    getSourceInfo,
    isCapitalCase,
    isNativeType,
    toJSONString
};


/* *
 *
 *  Doclet Declarations
 *
 * */


/**
 * @typedef DocletInfo
 * @property {'Doclet'} kind
 * @property {TS.JSDoc} [node]
 * @property {Record<string, Array<string>>} tags
 */


/**
 * @typedef ImportInfo
 * @property {DocletInfo} [doclet]
 * @property {Record<string,string>} imports
 * @property {'Import'} kind
 * @property {TS.ImportDeclaration} [node]
 * @property {string} from
 */


/**
 * @typedef InterfaceInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<string>} extends
 * @property {Array<string>} implements
 * @property {'Interface'} kind
 * @property {TS.InterfaceDeclaration} [node]
 * @property {Array<string>} parameter
 * @property {Array<Propery>} properties
 */


/**
 * @typedef {DocletInfo|ImportInfo|InterfaceInfo|PropertyInfo|VariableInfo} NodeInfo
 */


/**
 * @typedef PropertyInfo
 * @property {DocletInfo} [doclet]
 * @property {'Property'} kind
 * @property {string} name
 * @property {TS.PropertyAssignment|TS.PropertyDeclaration|TS.PropertySignature} [node]
 * @property {string} [type]
 * @property {string} [value]
 */


/**
 * @typedef SourceInfo
 * @property {'Source'} kind
 * @property {TS.SourceFile} [node]
 * @property {string} path
 * @property {Array<NodeInfo>} code
 */


/**
 * @typedef VariableInfo
 * @property {`Variable`} kind
 * @property {string} name
 * @property {TS.VariableDeclaration} [node]
 * @property {string} [type]
 * @property {bigint|boolean|null|number|string|ObjectInfo} [value]
 */


('');
