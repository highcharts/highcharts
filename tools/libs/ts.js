/* *
 *
 *  Handles TypeScript API and provides a simplified AST for doclet-relevant
 *  source nodes.
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


/* eslint-disable no-console, no-underscore-dangle, no-unused-expressions, no-use-before-define */


/* *
 *
 *  Imports
 *
 * */


const FS = require('node:fs');

const FSLib = require('./fs');

const Path = require('node:path');

const TS = require('typescript');


/* *
 *
 *  Constants
 *
 * */


const DOCLET = /\/\*\*.*?\*\//gsu;


const DOCLET_TAG_INSET = /\{([^}]+)\}/gsu;


const DOCLET_TAG_NAME = /^(?:\[([a-z][\w.='"]+)\]|([a-z][\w.='"]*))/su;


const NATIVE_HELPER =
    /^(?:Array|Extract|Omit|Partial|Record|Require)(?:<|$)/su;


const NATIVE_TYPES = [
    'Array',
    'Function',
    'NaN',
    'Number',
    'Object',
    'String',
    'Symbol'
];


const SANITIZE_TEXT = /^(['"`]?)(.*)\1$/gsu;


const SANITIZE_TYPE = /\(\s*(.*)\s*\)/gsu;


/** @type {Record<string,SourceInfo>} */
const SOURCE_CACHE = {};


const SOURCE_EXTENSION = /(?:\.d)?\.(?:jsx?|tsx?)$/gsu;


const TYPE_SPLIT = /[^\w\.]+/gsu;


/* *
 *
 *  Variables
 *
 * */


/* eslint-disable-next-line prefer-const */
let sourceRoot = 'ts';


/* *
 *
 *  Functions
 *
 * */


/**
 * Adds a tag to a DocletInfo object.
 *
 * @param {DocletInfo} doclet
 * Doclet information to modify.
 *
 * @param {string} tag
 * Tag to add to.
 *
 * @param {string} [text]
 * Text to add.
 *
 * @return {DocletInfo}
 * DocletInfo object as reference.
 */
function addTag(
    doclet,
    tag,
    text
) {
    const tags = doclet.tags;

    tags[tag] = tags[tag] || [];

    if (text) {
        tags[tag].push(text);
    }

}


/**
 * Complete source info with external additions.
 *
 * @param {SourceInfo} sourceInfoToComplete
 * Source information to complete.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {SourceInfo}
 * Extended class or interface information.
 */
function autoCompleteInfo(
    sourceInfoToComplete,
    includeNodes
) {
    const _modulePathToComplete = sanitizeSourcePath(sourceInfoToComplete.path);

    /** @type {string} */
    let _modulePath;
    /** @type {SourceInfo} */
    let _sourceInfo;

    for (const _sourcePath of FSLib.getFilePaths(sourceRoot, true)) {

        if (!SOURCE_EXTENSION.test(_sourcePath)) {
            continue;
        }

        _sourceInfo = getSourceInfo(_sourcePath, void 0, includeNodes);

        if (_sourceInfo) {
            for (const _codeInfo of _sourceInfo.code) {
                if (
                    _codeInfo.kind === 'Module' &&
                    _codeInfo.flags.includes('declare')
                ) {
                    _modulePath = sanitizeSourcePath(FSLib.normalizePath(
                        _sourceInfo.path,
                        _codeInfo.name,
                        true
                    ));

                    if (_modulePath === _modulePathToComplete) {
                        mergeCodeInfos(
                            sourceInfoToComplete,
                            _codeInfo
                        );
                    }
                }
            }
        }

    }

    return sourceInfoToComplete;
}


/**
 * Extends ClassInfo and InterfaceInfo with additional inherited members.
 *
 * @param {SourceInfo} sourceInfo
 * Source information of the class or interface.
 *
 * @param {ClassInfo|InterfaceInfo} infoToExtend
 * Class or interface information to extend.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ClassInfo|InterfaceInfo}
 * Extended class or interface information.
 */
function autoExtendInfo(
    sourceInfo,
    infoToExtend,
    includeNodes
) {
    /** @type {Array<string>} */
    const _extendsToDo = [];

    if (infoToExtend.extends) {
        const _extendsTypes = (
            typeof infoToExtend.extends === 'string' ?
                [infoToExtend.extends] :
                infoToExtend.extends
        );

        for (const _extendsType of _extendsTypes) {
            for (const _extractedType of extractTypes(_extendsType)) {
                if (!_extendsToDo.includes(_extractedType)) {
                    _extendsToDo.push(_extractedType);
                }
            }
        }

    }

    /** @type {CodeInfo} */
    let _resolvedInfo;
    /** @type {string|undefined} */
    let _resolvedPath;
    /** @type {ResolvedInfo} */
    let _resolvedType;

    for (const _extendType of _extendsToDo) {
        _resolvedType = resolveType(sourceInfo, _extendType, includeNodes);

        if (!_resolvedType) {
            continue;
        }

        _resolvedPath = _resolvedType.resolvedPath;
        _resolvedInfo = autoExtendInfo(
            getSourceInfo(_resolvedPath, void 0, includeNodes),
            _resolvedType.resolvedInfo,
            includeNodes
        );

        if (
            _resolvedInfo.kind !== 'Class' &&
            _resolvedInfo.kind !== 'Namespace' &&
            _resolvedInfo.kind !== 'Interface'
        ) {
            continue;
        }

        for (const _member of _resolvedInfo.members) {

            // Check if already defined in target
            if (extractInfos(infoToExtend.members, _member.name)) {
                continue;
            }

            const _newMember = newCodeInfo(_member);

            _newMember.meta.merged = true;

            infoToExtend.members.push(_newMember);

        }

    }

    return infoToExtend;
}


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
 * [TS] Shifts ranges in the source node with replacements.
 *
 * @param {TS.SourceFile} sourceNode
 * Source file to change.
 *
 * @param {Array<[number,number,string]} replacements
 * Replacements to apply.
 *
 * @return {TS.SourceFile}
 * New source node with changes.
 */
function changeSourceNode(
    sourceNode,
    replacements
) {

    if (
        !replacements ||
        !replacements.length
    ) {
        return sourceNode;
    }

    return TS.createSourceFile(
        sourceNode.fileName,
        changeSourceCode(sourceNode.getFullText(), replacements),
        TS.ScriptTarget.ESNext,
        true
    );
}


/**
 * [TS] Logs debug information for a node and its children into the console.
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
 * Extracts the entity name from the given code information.
 *
 * @param {CodeInfo|SourceInfo} codeInfo
 * Code information to extract from.
 *
 * @return {string|undefined}
 * Extracted name or `undefined`.
 */
function extractInfoName(
    codeInfo
) {
    /** @type {string} */
    let _name;

    switch (codeInfo.kind) {
        case 'Class':
        case 'Function':
        case 'Interface':
        case 'Module':
        case 'Namespace':
        case 'Property':
        case 'TypeAlias':
        case 'Variable':
            return codeInfo.name;
        case 'Doclet':
            _name = extractTagText(codeInfo, 'optionparent');
            if (typeof _name === 'string') {
                return _name;
            }
            return (
                extractTagText(codeInfo, 'apioption') ||
                extractTagText(codeInfo, 'name') ||
                extractTagText(codeInfo, 'function')
            );
        case 'Source':
            return codeInfo.path;
        default:
            return void 0;
    }
}


/**
 * Extracts information from an array of CodeInfo types.
 *
 * @param {Array<CodeInfo>} arr
 * Array of informations to extract from.
 *
 * @param {string} name
 * Name of information to extract.
 *
 * @return {Array<CodeInfo>|undefined}
 * Extracted information or `undefined`.
 */
function extractInfos(
    arr,
    name
) {

    if (typeof name !== 'string') {
        return void 0;
    }

    /** @type {Array<CodeInfo>} */
    const extractions = [];

    for (const info of arr) {
        switch (info.kind) {
            case 'Class':
            case 'Function':
            case 'Interface':
            case 'Module':
            case 'Namespace':
            case 'Property':
            case 'Variable':
                if (info.name === name) {
                    extractions.push(info);
                }
                continue;
            default:
                continue;
        }
    }

    return (
        extractions.length ?
            extractions :
            void 0
    );
}


/**
 * Retrieves curly bracket insets from the given tag text.
 *
 * @param {string} text
 * Tag text to get insets from.
 *
 * @return {Array<string>}
 * Retrieved curly bracket insets.
 */
function extractTagInsets(
    text
) {
    return Array
        .from(text.matchAll(DOCLET_TAG_INSET))
        .map(inset => inset[1]);
}


/**
 * Retrieves all information for the specified tag from a DocletInfo object.
 *
 * @param {DocletInfo} doclet
 * Doclet information to retrieve from.
 *
 * @param {string} tag
 * Tag to retrieve.
 *
 * @return {Array<DocletTag>}
 * Retrieved tag informations.
 */
function extractTagObjects(
    doclet,
    tag
) {
    /** @type {Array<DocletTag>} */
    const _objects = [];

    /** @type {Array<string>} */
    let _array;
    /** @type {RegExpMatchArray} */
    let _match;
    /** @type {DocletTag} */
    let _object;

    for (let _text of (doclet.tags[tag] || [])) {
        _object = { tag };

        switch (tag) {

            default:
                if (_text.startsWith('{')) {
                    _array = extractTagInsets(_text);
                    if (_array.length) {
                        _object.type = _array[0];
                        _text = _text.replace(`{${_array[0]}}`, '').trimStart();
                    }
                }
                break;

            case 'param':
                _match = _text.match(DOCLET_TAG_NAME);
                if (_match) {
                    if (_match[1]) {
                        _object.isOptional = true;
                        _object.name = _match[1];
                    } else {
                        _object.name = _match[2];
                    }
                    if (_object.name.includes('=')) {
                        _object.value = _object.name.split('=', 2)[1];
                        _object.name = _object.name.split('=', 2)[0];
                    }
                    _text = _text.substring(_match[0].length).trimStart();
                }
                break;

            case 'sample':
            case 'samples':
                _array = extractTagInsets(_text);
                if (_array.length) {
                    _text = _text.replace(`{${_array[0]}}`, '').trimStart();
                    _object.products = _array[0].split('|');
                }
                _match = _text.match(/^\S+/gsu);
                if (_match) {
                    _object.name = _text.substring(_match[0].length).trim();
                    _object.value = _match[0];
                    _text = '';
                }
                break;

        }
        if (_text) {
            _object.text = _text;
        }
        _objects.push(_object);
    }

    if (
        !_objects.length &&
        doclet.tags[tag]
    ) {
        _objects.push({ tag });
    }

    return _objects;
}


/**
 * Retrieves the text of the last occurance for the specified tag from a
 * DocletInfo object.
 *
 * @param {DocletInfo} doclet
 * Doclet information to retrieve from.
 *
 * @param {string} tag
 * Tag to retrieve.
 *
 * @param {boolean} [allText]
 * True, to to extract all text if tag has been found multiple times, otherwise
 * extract just the text from the last occurance.
 *
 * @return {string|undefined}
 * Retrieved text or `undefined`.
 */
function extractTagText(
    doclet,
    tag,
    allText
) {
    const tagText = doclet.tags[tag];

    if (tagText) {
        if (allText) {
            return tagText.join('\n\n');
        }
        if (tagText.length) {
            return tagText[tagText.length - 1];
        }
    }

    return void 0;
}


/**
 * Extracts all types of a type statement, including conditionals, generics,
 * intersects and unions.
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
 * [TS] Retrieve child informations and doclets.
 *
 * @param {Array<TS.Node>} nodes
 * Child nodes to extract from.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {Array<CodeInfo>}
 * Retrieved child informations.
 */
function getChildInfos(
    nodes,
    includeNodes
) {
    /** @type {Array<CodeInfo>} */
    const _infos = [];

    /** @type {CodeInfo|undefined} */
    let _child;
    /** @type {Array<CodeInfo>|undefined} */
    let _children;
    /** @type {DocletInfo} */
    let _doclet;
    /** @type {Array<DocletInfo>} */
    let _doclets;
    /** @type {TS.Node} */
    let _previousNode = nodes[0];

    for (const node of nodes) {

        if (node.kind === TS.SyntaxKind.EndOfFileToken) {
            break;
        }

        if (TS.isVariableStatement(node)) {
            _children = getChildInfos(
                getNodesChildren(node.declarationList),
                includeNodes
            );
            if (_children.length) {
                // Take the first one out to attach leading doclet
                _child = _children.shift();
            }
        } else {
            _child = (
                getVariableInfo(node, includeNodes) ||
                getTypeAliasInfo(node, includeNodes) ||
                getPropertyInfo(node, includeNodes) ||
                getObjectInfo(node, includeNodes) ||
                getNamespaceInfo(node, includeNodes) ||
                getInterfaceInfo(node, includeNodes) ||
                getImportInfo(node, includeNodes) ||
                getFunctionInfo(node, includeNodes) ||
                getFunctionCallInfo(node, includeNodes) ||
                getExportInfo(node, includeNodes) ||
                getDeconstructInfos(node, includeNodes) ||
                getClassInfo(node, includeNodes)
            );
        }

        // Retrieve leading doclets

        _doclets = getDocletInfosBetween(_previousNode, node, includeNodes);

        // Deal with floating doclets before leading child doclet

        if (_doclets.length) {
            _doclet = _doclets[_doclets.length - 1];
            if (
                _child &&
                _child.kind !== 'Export' &&
                _child.kind !== 'Import' &&
                !_doclet.tags.apioption
            ) {
                _child.doclet = _doclets.pop();
            }
            _infos.push(..._doclets);
        }

        // Finally add child(ren)

        if (_child) {
            _infos.push(_child);
            _child = void 0;
        }

        if (_children) {
            _infos.push(..._children);
            _children = void 0;
        }

        _previousNode = node;

    }

    return _infos;
}


/**
 * Retrieves class info from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a class.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ClassInfo|undefined}
 * Class information or `undefined`.
 */
function getClassInfo(
    node,
    includeNodes
) {

    if (!TS.isClassDeclaration(node)) {
        return void 0;
    }

    /** @type {ClassInfo} */
    const _info = {
        kind: 'Class'
    };

    _info.name = ((node.name && node.name.getText()) || 'default');

    if (node.typeParameters) {
        const _generics = _info.generics = [];
        for (const parameter of getChildInfos(node.typeParameters)) {
            if (parameter.kind === 'Variable') {
                _generics.push(parameter);
            }
        }
    }

    if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
            if (clause.token === TS.SyntaxKind.ExtendsKeyword) {
                _info.extends = clause.types.map(t => t.getText());
            } else {
                _info.implements = clause.types.map(t => t.getText());
            }
        }
    }

    if (node.members) {
        /** @type {Array<MemberInfo>} */
        const _members = _info.members = [];

        for (const _childInfo of getChildInfos(node.members, includeNodes)) {
            if (
                _childInfo.kind === 'Doclet' ||
                _childInfo.kind === 'Function' ||
                _childInfo.kind === 'Property'
            ) {
                _members.push(_childInfo);
            }
        }

    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves deconstruct information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a deconstruct.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript node in the information.
 *
 * @return {DeconstructInfo|undefined}
 * Deconstruct information or `undefined`.
 */
function getDeconstructInfos(
    node,
    includeNodes
) {

    if (
        !TS.isParameter(node) &&
        !TS.isVariableDeclaration(node)
    ) {
        return void 0;
    }

    if (
        !TS.isArrayBindingPattern(node.name) &&
        !TS.isObjectBindingPattern(node.name)
    ) {
        return void 0;
    }

    /** @type {DeconstructInfo} */
    const _info = {
        kind: 'Deconstruct',
        deconstructs: {}
    };

    if (node.initializer) {
        _info.from = node.initializer.getText();
    }

    for (const element of node.name.elements) {
        _info.deconstructs[(element.propertyName || element.name).text] =
            element.name.text;
    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
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

    for (const doclet of getDocletsBetween(startNode, endNode)) {

        _doclet = newDocletInfo();

        for (const node of doclet) {
            if (TS.isJSDoc(node)) {

                if (node.comment) {
                    addTag(
                        _doclet,
                        'description',
                        node.comment instanceof Array ?
                            node.comment
                                .map(c => c.text)
                                .join('\n')
                                .trim() :
                            node.comment
                                .trim()
                    );
                }

                if (node.tags) {
                    for (const tag of node.tags) {
                        _tagName = tag.tagName.text;
                        addTag(
                            _doclet,
                            _tagName,
                            tag.getText()
                                .trim()
                                .substring(_tagName.length + 1)
                                .split(/\n *\*?/gu)
                                .join('\n')
                                .trim()
                        );
                    }
                }

                _doclet.meta = getInfoMeta(node);

                if (includeNodes) {
                    _doclet.node = node;
                }

            }
        }

        _doclets.push(_doclet);

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
    const sourceFile = startNode.getSourceFile();
    const snippets = Array.from(
        sourceFile
            .getFullText()
            .substring(start, end)
            .matchAll(DOCLET)
    );

    if (snippets.length) {
        // Restore original position range in snap
        let lastIndex = 0;
        let snap = ''.padEnd(start, ' ');

        for (const snippet of snippets) {
            snap += (
                '\n\'' + ''.padEnd(snippet.index - lastIndex - 5, '_') +
                '\';\n' + snippet
            );
            lastIndex = snippet.index;
        }

        /** @type {ReturnType<TS.getJSDocCommentsAndTags>} */
        let parts;

        TS.forEachChild(
            TS.createSourceFile(
                sourceFile.fileName,
                snap + '\n\'\';\n',
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
    }

    return doclets;
}


/**
 * Retrieves export information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be an export.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ExportInfo|undefined}
 * Export information or `undefined`.
 */
function getExportInfo(
    node,
    includeNodes
) {

    if (!TS.isExportAssignment(node)) {
        return void 0;
    }

    /** @type {ExportInfo} */
    const _info = {
        kind: 'Export'
    };

    if (TS.isIdentifier(node.expression)) {

        _info.name = node.expression.text;

    } else {
        const _value = getChildInfos([node.expression], includeNodes)[0];

        if (_value) {
            if (_value.name) {
                _info.name = _value.name;
            }
            _info.value = _value;
        }

    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves function call info from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a function call.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {FunctionCallInfo|undefined}
 * Function call information or `undefined`.
 */
function getFunctionCallInfo(
    node,
    includeNodes
) {

    if (!TS.isCallExpression(node)) {
        return void 0;
    }

    /** @type {FunctionCallInfo} */
    const _info = {
        kind: 'FunctionCall',
        name: ''
    };

    if (TS.isIdentifier(node.expression)) {
        _info.name = node.expression.text;
    }

    if (node.arguments) {
        const _arguments = _info.arguments = [];

        /** @type {CodeInfo|undefined} */
        let _childInfo;

        for (const _child of getNodesChildren(node)) {

            if (_child === node.expression) {
                continue;
            }

            _childInfo = getChildInfos([_child], includeNodes);

            if (_childInfo.length) {

                _arguments.push(..._childInfo);

            } else if (TS.isIdentifier(_child)) {

                _childInfo = {
                    kind: 'Variable',
                    name: _child.text
                };

                _childInfo.meta = getInfoMeta(_child);

                if (includeNodes) {
                    _childInfo.node = _child;
                }

                _arguments.push(_childInfo);

            }

        }
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves import information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be an import.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ImportInfo|undefined}
 * Import information or `undefined`.
 */
function getFunctionInfo(
    node,
    includeNodes
) {

    if (
        !TS.isConstructorDeclaration(node) &&
        !TS.isFunctionDeclaration(node) &&
        !TS.isMethodDeclaration(node)
    ) {
        return void 0;
    }

    /** @type {FunctionInfo} */
    const _info = {
        kind: 'Function',
        name: (
            TS.isConstructorDeclaration(node) ?
                'constructor' :
                ((node.name && node.name.text) || '')
        )
    };

    if (node.typeParameters) {
        const _generics = _info.generics = [];
        for (const parameter of getChildInfos(node.typeParameters)) {
            if (parameter.kind === 'Variable') {
                _generics.push(parameter);
            }
        }
    }

    if (node.parameters) {
        const _parameters = _info.parameters = [];
        for (const parameter of getChildInfos(node.parameters, includeNodes)) {
            if (parameter.kind === 'Variable') {
                _parameters.push(parameter);
            }
        }
    }

    if (node.type) {
        _info.return = node.type.getText();
    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (
        node.body &&
        node.body.getFirstToken()
    ) {
        const _bodyDoclets = getDocletInfosBetween(
            node.body.getFirstToken(),
            node.body.getLastToken()
        );

        if (_bodyDoclets && _bodyDoclets.length) {
            _info.body = _bodyDoclets;
        }

    }

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
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
 * Import information or `undefined`.
 */
function getImportInfo(
    node,
    includeNode
) {

    if (!TS.isImportDeclaration(node)) {
        return void 0;
    }

    /** @type {ImportInfo} */
    const _info = {
        kind: 'Import'
    };

    _info.from = sanitizeText(node.moduleSpecifier.getText());

    if (node.importClause) {
        const _imports = _info.imports = {};

        /** @type {string} */
        let propertyName;

        for (const clause of getNodesChildren(node.importClause)) {
            if (TS.isIdentifier(clause)) {
                _imports.default = clause.text;
            }
            if (TS.isNamedImports(clause)) {
                for (const child of getNodesChildren(clause)) {
                    if (TS.isImportSpecifier(child)) {
                        propertyName = (
                            child.propertyName &&
                            child.propertyName.text ||
                            child.name.text
                        );
                        _imports[propertyName] = child.name.text;
                    }
                }
            }
        }

    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNode) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves info flags from the given node.
 *
 * @param {TS.Node} node
 * Node to retrieve from.
 *
 * @return {Array<InfoFlag>|undefined}
 * Retrieved info flags or `undefined`.
 */
function getInfoFlags(
    node
) {
    /** @type {Array<InfoFlag>} */
    const _flags = [];

    if (!node.flags) {
        return void 0;
    }

    for (const modifier of (TS.getModifiers(node) || [])) {
        if (!TS.isDecorator(modifier)) {
            _flags.push(modifier.getText());
        }
    }

    if (!_flags.length) {
        return void 0;
    }

    return _flags;
}


/**
 * Retrieves meta information for a given node.
 *
 * @param {TS.Node} node
 * Node to return meta information for.
 *
 * @return {Meta}
 * Meta information for the given node.
 */
function getInfoMeta(
    node
) {
    return {
        begin: node.getStart(),
        end: node.getEnd(),
        file: node.getSourceFile().fileName,
        overhead: node.getLeadingTriviaWidth(),
        syntax: node.kind
    };
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
    const _info = {
        kind: 'Interface'
    };

    _info.name = node.name.text;

    if (node.typeParameters) {
        const _generics = _info.generics = [];

        for (const parameter of getChildInfos(node.typeParameters)) {
            if (parameter.kind === 'Variable') {
                _generics.push(parameter);
            }
        }

    }

    if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
            if (clause.token === TS.SyntaxKind.ExtendsKeyword) {
                _info.extends = clause.types.map(t => t.getText());
            } else {
                _info.implements = clause.types.map(t => t.getText());
            }
        }
    }

    if (node.members) {
        /** @type {Array<MemberInfo>} */
        const _members = _info.members = [];

        for (const _childInfo of getChildInfos(node.members, includeNodes)) {
            if (
                _childInfo.kind === 'Doclet' ||
                _childInfo.kind === 'Function' ||
                _childInfo.kind === 'Property'
            ) {
                _members.push(_childInfo);
            }
        }

    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves namespace and module information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a namespace or module.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {NamespaceInfo|undefined}
 * Namespace, module or `undefined`.
 */
function getNamespaceInfo(
    node,
    includeNodes
) {

    if (!TS.isModuleDeclaration(node)) {
        return void 0;
    }

    /** @type {NamespaceInfo} */
    const _info = {
        kind: (
            node
                .getChildren()
                .some(token => token.kind === TS.SyntaxKind.ModuleKeyword) ?
                'Module' :
                'Namespace'
        ),
        name: node.name.text
    };

    if (node.body && node.body.statements) {
        /** @type {Array<CodeInfo>} */
        const _members = _info.members = [];

        for (
            const _childInfo
            of getChildInfos(node.body.statements, includeNodes)
        ) {
            _members.push(_childInfo);
        }

    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    return _info;
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
 * [TS] Retrieve the first logical child of a node.
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
 * [TS] Retrieve the last logical child of a node.
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
 * Retrieves object information from the current node.
 *
 * @param {TS.Node} node
 * Node that might be an object literal.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ObjectInfo}
 * Object information or `undefined`.
 */
function getObjectInfo(
    node,
    includeNodes
) {
    /** @type {string|undefined} */
    let _type;

    if (TS.isAsExpression(node)) {
        _type = node.type.getText();
        node = node.expression;
    }

    if (!TS.isObjectLiteralExpression(node)) {
        return void 0;
    }

    /** @type {ObjectInfo} */
    const _info = {
        kind: 'Object'
    };

    if (node.properties) {
        /** @type {Array<MemberInfo>} */
        const _members = _info.members = [];

        for (const _childInfo of getChildInfos(node.properties, includeNodes)) {
            if (
                _childInfo.kind === 'Doclet' ||
                _childInfo.kind === 'Function' ||
                _childInfo.kind === 'Property'
            ) {
                _members.push(_childInfo);
            }
        }

    }

    if (_type) {
        _info.type = _type;
    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
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
        !TS.isPropertySignature(node) &&
        !TS.isShorthandPropertyAssignment(node)
    ) {
        return void 0;
    }

    /** @type {PropertyInfo} */
    const _info = {
        kind: 'Property'
    };

    _info.name = node.name.text;

    if (
        !TS.isPropertyAssignment(node) &&
        !TS.isShorthandPropertyAssignment(node) &&
        node.type
    ) {
        _info.type = trimBetween(node.type.getText());
    }

    if (!TS.isPropertySignature(node)) {
        const _initializer = (
            TS.isShorthandPropertyAssignment(node) ?
                node.objectAssignmentInitializer :
                node.initializer
        );

        if (_initializer) {
            const expression = getChildInfos([_initializer]);

            if (expression.length) {
                _info.value = expression[0];
            } else {
                _info.value = node.initializer.getText();
            }
        }
    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNode) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves source information from the given file source.
 *
 * @param {string} filePath
 * Path to source file.
 *
 * @param {string} [sourceText]
 * Text of source file.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {SourceInfo}
 * Source information.
 */
function getSourceInfo(
    filePath,
    sourceText,
    includeNodes
) {
    const _cacheKey = `${filePath}:${includeNodes}`;

    if (!sourceText) {
        if (SOURCE_CACHE[_cacheKey]) {
            return SOURCE_CACHE[_cacheKey];
        }
        sourceText = FS.readFileSync(filePath, 'utf8');
    }

    const _sourceFile = TS.createSourceFile(
        filePath,
        sourceText,
        TS.ScriptTarget.Latest,
        true
    );

    /** @type {SourceInfo} */
    const _info = {
        kind: 'Source',
        path: filePath
    };

    _info.code = getChildInfos(getNodesChildren(_sourceFile), includeNodes);

    SOURCE_CACHE[_cacheKey] = _info;

    if (_info.path.endsWith('.d.ts')) {
        autoCompleteInfo(_info, includeNodes);
    }

    return _info;
}


/**
 * Retrieves type alias information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a type alias.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript node in the information.
 *
 * @return {TypeAliasInfo|undefined}
 * Type alias information or `undefined`.
 */
function getTypeAliasInfo(
    node,
    includeNodes
) {

    if (!TS.isTypeAliasDeclaration(node)) {
        return void 0;
    }

    /** @type {TypeAliasInfo} */
    const _info = {
        kind: 'TypeAlias',
        name: node.name.text
    };

    if (node.typeParameters) {
        const _generics = _info.generics = [];

        for (const parameter of getChildInfos(node.typeParameters)) {
            if (parameter.kind === 'Variable') {
                _generics.push(parameter);
            }
        }

    }

    if (node.type) {
        const _type = getChildInfos([node.type]);

        if (_type.length) {
            _info.value = _type[0];
        } else {
            _info.value = sanitizeType(node.type.getText());
        }

    }

    if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves variable information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a variable or assignment.
 *
 * @param {boolean} includeNodes
 * Whether to include the TypeScript node in the information.
 *
 * @return {VariableInfo|undefined}
 * Variable information or `undefined`.
 */
function getVariableInfo(
    node,
    includeNodes
) {

    if (
        (
            !TS.isTypeParameterDeclaration(node) &&
            !TS.isParameter(node) &&
            !TS.isVariableDeclaration(node)
        ) ||
        TS.isArrayBindingPattern(node.name) ||
        TS.isObjectBindingPattern(node.name)
    ) {
        return void 0;
    }

    /** @type {VariableInfo} */
    const _info = {
        kind: 'Variable',
        name: node.name.getText()
    };

    if (TS.isTypeParameterDeclaration(node)) {
        if (node.constraint) {
            _info.type = node.constraint.getText();
        }
        if (node.default) {
            _info.value = node.default.getText();
        }
    } else {
        if (node.type) {
            _info.type = node.type.getText();
        }
        if (node.initializer) {
            const _initializer = getChildInfos([node.initializer]);

            if (!_info.type) {
                _info.type = toTypeof(node.initializer);
            }

            if (_initializer.length) {
                _info.value = _initializer[0];
            } else {
                _info.value = sanitizeText(node.initializer.getText());
            }
        }
    }

    if (TS.isVariableDeclarationList(node.parent)) {
        if (node.parent.parent.flags) {
            _info.flags = getInfoFlags(node.parent.parent);
        }
    } else if (node.flags) {
        _info.flags = getInfoFlags(node);
    }

    _info.meta = getInfoMeta(node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
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
        NATIVE_HELPER.test(type) ||
        TS.SyntaxKind[type] > 0
    );
}


/**
 * Merge code information.
 *
 * @template {CodeInfo|SourceInfo} T
 *
 * @param {T} targetInfo
 * Target information to merge into.
 *
 * @param {CodeInfo|SourceInfo} sourceInfo
 * Source information to merge.
 *
 * @return {T}
 * Target infos as reference.
 */
function mergeCodeInfos(
    targetInfo,
    sourceInfo
) {
    /** @type {Array<CodeInfo>} */
    let _targetMembers;
    /** @type {Array<CodeInfo>} */
    let _sourceMembers;

    switch (targetInfo.kind) {
        default:
            return targetInfo;
        case 'Class':
        case 'Interface':
        case 'Namespace':
        case 'Object':
            _targetMembers = targetInfo.members;
            break;
        case 'Source':
            _targetMembers = targetInfo.code;
            break;
    }

    switch (sourceInfo.kind) {
        default:
            return targetInfo;
        case 'Class':
        case 'Interface':
        case 'Module':
        case 'Namespace':
        case 'Object':
            _sourceMembers = sourceInfo.members;
            break;
        case 'Source':
            _sourceMembers = sourceInfo.code;
            break;
    }

    if (
        targetInfo.kind !== sourceInfo.kind &&
        (
            targetInfo.kind !== 'Source' ||
            sourceInfo.kind !== 'Module'
        )
    ) {
        return targetInfo;
    }

    /** @type {boolean} */
    let _merged;
    /** @type {CodeInfo} */
    let _mergedMember;
    /** @type {string} */
    let _name;

    for (const _sourceMember of _sourceMembers) {

        _merged = false;
        _name = extractInfoName(_sourceMember);

        for (
            const _targetMember
            of (extractInfos(_targetMembers, _name) || [])
        ) {
            if (_targetMember.kind === _sourceMember.kind) {
                switch (_sourceMember.kind) {
                    default:
                        continue;
                    case 'Class':
                    case 'Interface':
                    case 'Namespace':
                    case 'Object':
                        mergeCodeInfos(_targetMember, _sourceMember);
                        break;
                    case 'Doclet':
                        mergeDocletInfos(
                            _targetMember,
                            _sourceMember
                        );
                        break;
                    case 'Function':
                        _mergedMember = newCodeInfo(_sourceMember);
                        _mergedMember.meta.merged = true;
                        _targetMembers.push(_mergedMember);
                        break;
                    case 'Property':
                        if (_sourceMember.doclet) {
                            if (_targetMember.doclet) {
                                mergeDocletInfos(
                                    _targetMember.doclet,
                                    _sourceMember.doclet
                                );
                            } else {
                                _mergedMember =
                                    newDocletInfo(_sourceMember.doclet);
                                _mergedMember.meta.merged = true;
                                _targetMember.doclet = _mergedMember;
                            }
                        }
                        if (
                            _targetMember.value &&
                            typeof _targetMember.value === 'object' &&
                            _sourceMember.value &&
                            typeof _sourceMember.value === 'object'
                        ) {
                            mergeCodeInfos(
                                _targetMember,
                                _sourceMember
                            );
                        }
                        break;
                }
                _merged = true;
            }
        }

        if (!_merged) {
            _mergedMember = newCodeInfo(_sourceMember);
            _mergedMember.meta.merged = true;
            _targetMembers.push(_mergedMember);
        }

    }

    return targetInfo;
}


/**
 * Merge multiple DocletInfo objects into the first.
 *
 * @param {DocletInfo} [targetDoclet]
 * Doclet information to add to.
 *
 * @param {...Array<DocletInfo>} [sourceDoclets]
 * Doclet informations to add.
 *
 * @return {DocletInfo}
 * First DocletObject as reference.
 */
function mergeDocletInfos(
    targetDoclet,
    ...sourceDoclets
) {
    targetDoclet = targetDoclet || newDocletInfo();

    const targetTags = targetDoclet.tags;

    /** @type {Record<string,Array<string>>} */
    let sourceTags;
    /** @type {Array<string>} */
    let targetTag;

    for (const sourceDoclet of sourceDoclets) {
        sourceTags = sourceDoclet.tags;
        for (const tag of Object.keys(sourceTags)) {
            targetTag = targetTags[tag] = targetTags[tag] || [];
            for (const value of sourceTags[tag]) {
                if (!targetTag.includes(value)) {
                    targetTag.push(value);
                }
            }
        }
    }

    targetDoclet.meta.merged = true;

    return targetDoclet;
}


/**
 * Creates a new CodeInfo object from a template.
 *
 * @template {CodeInfo|SourceInfo} T
 *
 * @param {T} [template]
 * Template to create from.
 *
 * @return {T}
 * Template copy.
 */
function newCodeInfo(
    template
) {
    return (
        typeof template === 'object' ?
            /* eslint-disable-next-line no-undef */
            structuredClone({
                ...template,
                node: void 0 // Avoid clone of native TSNode.
            }) :
            {
                kind: 'Object'
            }
    );
}


/**
 * Creates a new DocletInfo object.
 *
 * @param {DocletInfo} [template]
 * Doclet information to apply.
 *
 * @return {DocletInfo}
 * The new doclet information.
 */
function newDocletInfo(
    template
) {
    /** @type {DocletInfo} */
    const doclet = {
        kind: 'Doclet',
        tags: {}
    };

    if (template) {
        const newTags = doclet.tags;
        const tags = template.tags;

        for (const tag of Object.keys(tags)) {
            newTags[tag] = tags[tag].slice();
        }
    }

    return doclet;
}


/**
 * Removes all doclets from source code.
 *
 * @param {string} sourceCode
 * Source code to remove doclets from.
 *
 * @return {string}
 * Source code without doclets.
 */
function removeAllDoclets(
    sourceCode
) {
    return sourceCode
        .replace(/\n *\/\*\*.*?\*\//gsu, '')
        .replace(/\n(\(?)''\1;[^\n]*/gsu, '')
        .replace(/\n\s+\n/gsu, '\n\n');
}


/**
 * Removes a tag from a DocletInfo object.
 *
 * @param {DocletInfo} doclet
 * Doclet information to modify.
 *
 * @param {string} tag
 * Tag to remove.
 *
 * @return {Array<string>}
 * Removed tag text.
 */
function removeTag(
    doclet,
    tag
) {
    const tags = doclet.tags;

    if (tags) {
        const text = tags[tag];

        delete tags[tag];

        return text;
    }

    return [];
}


/**
 * Resolves type relative to the given source information.
 *
 * @param {SourceInfo} sourceInfo
 * Source information to use.
 *
 * @param {string} searchType
 * Type to resolve to.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ResolvedInfo|undefined}
 * Resolve information.
 */
function resolveType(
    sourceInfo,
    searchType,
    includeNodes
) {
    /** @type {Record<string,boolean>} */
    const _stack = {};

    /**
     * Internal resolve.
     * @param {CodeInfo} info
     * Current info.
     * @param {string} type
     * Current type.
     * @return {ResolveInfo|undefined}
     * Result.
     */
    function resolve(info, type) {
        /** @type {ResolvedInfo} */
        const _result = {
            kind: 'Resolved',
            path: sourceInfo.path,
            resolvedInfo: void 0,
            resolvedPath: sourceInfo.path,
            search: type
        };

        switch (info.kind) {
            case 'Import':
                for (const item of Object.keys(info.imports || {})) {

                    // `item` is the external name,
                    // while `type` is the local name
                    if (info.imports[item] !== type) {
                        continue;
                    }

                    let _resolvedPath = FSLib.normalizePath(
                        sourceInfo.path,
                        info.from,
                        true
                    );

                    if (Path.extname(_resolvedPath) === '.js') {
                        _resolvedPath = _resolvedPath
                            .substring(0, _resolvedPath.length - 3);
                    }

                    if (!Path.extname(_resolvedPath)) {
                        if (FS.existsSync(_resolvedPath + '.d.ts')) {
                            _resolvedPath += '.d.ts';
                        } else if (FS.existsSync(_resolvedPath + '.ts')) {
                            _resolvedPath += '.ts';
                        } else {
                            continue;
                        }
                    }

                    if (_stack[_resolvedPath]) {
                        return void 0; // Break circular references
                    }

                    _stack[_resolvedPath] = true;

                    const _resolvedSource =
                        getSourceInfo(_resolvedPath, void 0, includeNodes);

                    for (const _codeInfo of _resolvedSource.code) {
                        const _resolvedInfo = resolve(_codeInfo, type);
                        if (_resolvedInfo) {
                            delete _stack[_resolvedPath];
                            _result.resolvedInfo = _resolvedInfo.resolvedInfo;
                            _result.resolvedPath = _resolvedSource.path;
                            return _result;
                        }
                    }

                }
                break;
            case 'Export':
                if (
                    info.object &&
                    (
                        info.name === type ||
                        info.object.name === type
                    )
                ) {
                    _result.resolvedInfo = info.object;
                    return _result;
                }
                break;
            case 'Class':
            case 'Interface':
            case 'Object':
            case 'Variable':
                if (info.name === type) {
                    _result.resolvedInfo = info;
                    return _result;
                }
                break;
            default:
                break;
        }

        return void 0;
    }

    for (const _codeInfo of sourceInfo.code) {
        const _resolveInfo = resolve(_codeInfo, searchType);
        if (_resolveInfo) {
            return _resolveInfo;
        }
    }

    return void 0;
}


/**
 * Sanitize source path from file extensions.
 *
 * @param {string} sourcePath
 * Source path to sanitize.
 *
 * @return {string}
 * Sanitized source path.
 */
function sanitizeSourcePath(
    sourcePath
) {
    return sourcePath.replace(SOURCE_EXTENSION, '');
}


/**
 * Sanitize text from surrounding quote characters.
 *
 * @param {string} text
 * Text to sanitize.
 *
 * @return {string}
 * Sanitized text.
 */
function sanitizeText(
    text
) {
    return ('' + text).replace(SANITIZE_TEXT, '$2');
}


/**
 * Sanitize type from surrounding paranthesis characters.
 *
 * @param {string} type
 * Type to sanitize.
 *
 * @return {string}
 * Sanitized type.
 */
function sanitizeType(
    type
) {
    return ('' + type).replaceAll(SANITIZE_TYPE, '$1').trim();
}


/**
 * Removes all spaces in the given text.
 *
 * @param {string} text
 * Text to trim.
 *
 * @return {string}
 * Trimmed text.
 */
function trimBetween(
    text
) {
    return text.replace(/\s+/gsu, '');
}


/**
 * Compiles doclet information into a code string.
 *
 * @see changeSourceCode
 *
 * @param {DocletInfo} doclet
 * Doclet information to compile.
 *
 * @param {number|string} [indent]
 * Indent styling.
 *
 * @return {string}
 * Doclet string.
 */
function toDocletString(
    doclet,
    indent = 0
) {

    if (typeof indent === 'number') {
        indent = ''.padEnd(indent, ' ');
    }

    if (indent[0] !== '\n') {
        indent = '\n' + indent;
    }

    const tags = doclet.tags;
    const tagKeys = Object.keys(tags);

    let compiled = indent + '/**';

    if (
        tags.description &&
        (
            tags.description.length <= 1 ||
            tags.description[1][0] !== '{'
        )
    ) {
        compiled += (
            indent + ' * ' +
            tags.description
                .join('\n\n')
                .trim()
                .split('\n')
                .join(indent + ' * ')
        );
        tagKeys.splice(tagKeys.indexOf('description'), 1);
    }

    for (const tag of tagKeys) {
        for (const text of tags[tag]) {
            compiled += (
                indent + ' *' +
                indent + ' * @' + tag + ' ' +
                text
                    .trim()
                    .split('\n')
                    .map(line => line.trim())
                    .join(indent + ' * ' + ''.padEnd(tag.length + 2, ' '))
            );
        }
    }

    compiled = compiled
        .split('\n')
        .map(line => {
            line = line.trimEnd();
            if (line.length > 80) {
                const br = line.substring(0, 80).lastIndexOf(' ');
                if (br >= 40) {
                    return (
                        line.substring(0, br) +
                        indent + ' * ' + line.substring(br)
                    );
                }
            }
            return line;
        })
        .join('\n');

    return compiled + indent + ' */\n';
}


/**
 * [TS] Reflects a node kind to a primitive type.
 *
 * @param {TS.Node} node
 * Node to reflect.
 *
 * @return {string|undefined}
 * Reflected primitive type or `undefined`.
 */
function toTypeof(
    node
) {
    return {
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
}


/* *
 *
 *  Default Export
 *
 * */


module.exports = {
    SOURCE_CACHE,
    SOURCE_EXTENSION,
    sourceRoot,
    addTag,
    autoExtendInfo,
    changeSourceCode,
    changeSourceNode,
    debug,
    extractInfoName,
    extractInfos,
    extractTagInsets,
    extractTagObjects,
    extractTagText,
    extractTypes,
    getChildInfos,
    getDocletInfosBetween,
    getNodesChildren,
    getNodesFirstChild,
    getNodesLastChild,
    getSourceInfo,
    isCapitalCase,
    isNativeType,
    mergeCodeInfos,
    mergeDocletInfos,
    newCodeInfo,
    newDocletInfo,
    removeAllDoclets,
    removeTag,
    resolveType,
    sanitizeSourcePath,
    sanitizeText,
    sanitizeType,
    toDocletString,
    toTypeof
};


/* *
 *
 *  Doclet Declarations
 *
 * */


/**
 * @typedef ClassInfo
 * @property {DocletInfo} [doclet]
 * @property {string} [extends]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<VariableInfo>} [generics]
 * @property {Array<string>} [implements]
 * @property {'Class'} kind
 * @property {Array<MemberInfo>} members
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.ClassDeclaration} [node]
 */


/**
 * @typedef {ClassInfo|DeconstructInfo|DocletInfo|ExportInfo|FunctionCallInfo|
 *           FunctionInfo|ImportInfo|InterfaceInfo|NamespaceInfo|ObjectInfo|
 *           PropertyInfo|TypeAliasInfo|VariableInfo
 *          } CodeInfo
 */


/**
 * @typedef DeconstructInfo
 * @property {Record<string,string>} deconstructs
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Deconstruct'} kind
 * @property {string} [from]
 * @property {Meta} meta
 * @property {TS.VariableDeclaration} [node]
 * @property {string} [type]
 */


/**
 * @typedef DocletInfo
 * @property {'Doclet'} kind
 * @property {Meta} meta
 * @property {TS.JSDoc} [node]
 * @property {Record<string,Array<string>>} tags
 */


/**
 * @typedef DocletTag
 * @property {boolean} [isOptional]
 * @property {string} [name]
 * @property {Array<string>} [products]
 * @property {string} tag
 * @property {string} [text]
 * @property {string} [type]
 * @property {string} [value]
 */


/**
 * @typedef ExportInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Export'} kind
 * @property {Meta} meta
 * @property {string} [name]
 * @property {TS.ImportDeclaration} [node]
 * @property {CodeInfo} [value]
 */


/**
 * @typedef FunctionCallInfo
 * @property {Array<CodeInfo>} [arguments]
 * @property {'FunctionCall'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.ImportDeclaration} [node]
 */


/**
 * @typedef FunctionInfo
 * @property {Array<DocletInfo>} [body]
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<VariableInfo>} [generics]
 * @property {boolean} [inherited]
 * @property {'Function'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.ImportDeclaration} [node]
 * @property {Array<VariableInfo>} [parameters]
 * @property {string} [return]
 */


/**
 * @typedef ImportInfo
 * @property {DocletInfo} [doclet]
 * @property {Record<string,string>} [imports]
 * @property {'Import'} kind
 * @property {Meta} meta
 * @property {TS.ImportDeclaration} [node]
 * @property {string} from
 */


/**
 * @typedef {'async'|'abstract'|'declare'|'default'|'export'|'private'|
 *           'protected'|'static'
 *          } InfoFlag
 */


/**
 * @typedef InterfaceInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<string>} [extends]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<VariableInfo>} [generics]
 * @property {'Interface'} kind
 * @property {Array<MemberInfo>} members
 * @property {Meta} meta
 * @property {TS.InterfaceDeclaration} [node]
 * @property {string} name
 */


/**
 * @typedef {DocletInfo|FunctionInfo|PropertyInfo} MemberInfo
 */


/**
 * @typedef Meta
 * @property {number} begin
 * @property {number} end
 * @property {string} file
 * @property {boolean} [merged]
 * @property {number} overhead
 * @property {number} syntax
 */


/**
 * @typedef NamespaceInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Module'|'Namespace'} kind
 * @property {Array<CodeInfo>} members
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.Node} [node]
 */


/**
 * @typedef ObjectInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Object'} kind
 * @property {Array<MemberInfo>} members
 * @property {Meta} meta
 * @property {TS.Node} [node]
 * @property {string} [type]
 */


/**
 * @typedef PropertyInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {boolean} [inherited]
 * @property {'Property'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.PropertyAssignment|TS.PropertyDeclaration|TS.PropertySignature} [node]
 * @property {string} [type]
 * @property {boolean|null|number|string|FunctionCallInfo|ObjectInfo} [value]
 */


/**
 * @typedef ResolvedInfo
 * @property {'Resolved'} kind
 * @property {string} path
 * @property {CodeInfo} resolvedInfo
 * @property {string} resolvedPath
 * @property {string} search
 */


/**
 * @typedef SourceInfo
 * @property {Array<CodeInfo>} code
 * @property {'Source'} kind
 * @property {TS.SourceFile} [node]
 * @property {string} path
 */


/**
 * @typedef TypeAliasInfo
 * @property {DocletInfo} [doclet]
 * @property {'TypeAlias'} kind
 * @property {Array<VariableInfo>} [generics]
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.VariableDeclaration} [node]
 * @property {string} [value]
 */


/**
 * @typedef VariableInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Variable'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.VariableDeclaration} [node]
 * @property {string} [type]
 * @property {boolean|null|number|string|FunctionCallInfo|ObjectInfo} [value]
 */


('');
