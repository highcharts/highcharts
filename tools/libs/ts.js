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


/* eslint-disable
   no-console, no-undef, no-underscore-dangle, no-unused-expressions,
   no-use-before-define */


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


const DOCLET_TAG_INSET = /^\s*\{([^}]+)\}/su;


const DOCLET_TAG_NAME = /^(?:\[([a-z][\w.='"]+)\]|([a-z][\w.='"]*))/su;


const JSX = /\.j(sx?)$/su;


const GENERIC = /^[\w\.]*<[\s\w\.\[\],|()]+>$/su;


const NATIVE_HELPER = new RegExp(
    '^(?:' + [
        'Array', 'Extract', 'Omit', 'Partial', 'Promise', 'Readonly',
        'ReadonlyArray', 'Record', 'Require'
    ].join('|') + ')(?:<|$)',
    'su'
);


const NATIVE_TYPES = [
    'Array',
    'Function',
    'NaN',
    'Number',
    'Object',
    'String',
    'Symbol'
];


/**
 * Array of product IDs to extract. If empty, everything is included.
 *
 * @type {Array<string>}
 */
const PRODUCTS = [];


const SANITIZE_TEXT = /^(['"`]?)(.*)\1$/gsu;


const SANITIZE_TYPE = /\(\s*(.*)\s*\)/gsu;


/**
 * Dictionary of cached source information. The key starts with the path.
 * Separated with a colon character (`:`) follows a boolean value indicating the
 * inclusion of native TypeScript nodes.
 *
 * @type {Record<string,SourceInfo>}
 */
const SOURCE_CACHE = {};


const SOURCE_EXTENSION = /(?:\.d)?\.[jt]sx?$/gsu;


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
 * Add child informations and doclets.
 *
 * @param {CodeInfo} infos
 * Array of code information to add to.
 *
 * @param {TS.Node} nodes
 * Child nodes to extract from.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 */
function addChildInfos(
    infos,
    nodes,
    includeNodes
) {
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
                getClassInfo(node, includeNodes) ||
                getArrayInfo(node, includeNodes)
            );
        }

        // Retrieve leading doclets

        _doclets = getDocletInfosBetween(_previousNode, node, includeNodes);

        // Deal with floating doclets before leading child doclet

        if (_doclets.length) {

            _doclet = _doclets[_doclets.length - 1];

            // Add trailing doclet to child information

            if (
                _child &&
                _child.kind !== 'Export' &&
                _child.kind !== 'Import' &&
                !_doclet.tags.apioption
            ) {
                _child.doclet = _doclets.pop();
            }

            // Add floating doclets

            for (_doclet of _doclets) {
                if (isProductRelated(_doclet)) {
                    infos.push(_doclet);
                }
            }

        }

        // Finally add child(ren)

        if (_child) {
            if (isProductRelated(_child.doclet)) {
                infos.push(_child);
            }
            _child = void 0;
        }

        if (_children) {
            infos.push(..._children);
            _children = void 0;
        }

        _previousNode = node;
    }

}


/**
 * Adds info flags from the given node.
 *
 * @param {CodeInfo} info
 * Information to add to.
 *
 * @param {TS.Node} node
 * Node to retrieve from.
 */
function addInfoFlags(
    info,
    node
) {
    /** @type {Array<InfoFlag>} */
    const _flags = [];

    for (const _modifier of (TS.getModifiers(node) || [])) {
        if (!TS.isDecorator(_modifier)) {
            _flags.push(_modifier.getText());
        }
    }

    if (node.dotDotDotToken) {
        _flags.push('rest');
    }

    if (node.exclamationToken) {
        _flags.push('assured');
    }

    if (TS.isExportAssignment(node)) {
        _flags.push('default');
    }

    if (
        node.importClause &&
        node.importClause.isTypeOnly
    ) {
        _flags.push('type');
    }

    if (
        node.questionDotToken ||
        node.questionToken
    ) {
        _flags.push('optional');
    }

    if (_flags.length) {
        info.flags = _flags;
    }

}


/**
 * Retrieves meta information for a given node.
 *
 * @param {CodeInfo} info
 * Information to add to.
 *
 * @param {TS.Node} node
 * Node to return meta information for.
 */
function addInfoMeta(
    info,
    node
) {
    info.meta = {
        begin: node.getStart(),
        end: node.getEnd(),
        file: node.getSourceFile().fileName,
        overhead: node.getLeadingTriviaWidth(),
        syntax: node.kind
    };
}


/**
 * Adds the scope path to code informations.
 *
 * @param {CodeInfo|SourceInfo} parentInfo
 * Code information with scope path to add.
 *
 * @param {Array<CodeInfo|ValueInfo>} targetInfos
 * Code information to add to add to.
 */
function addInfoScopes(
    parentInfo,
    targetInfos
) {
    const _scopePath = extractInfoScopePath(parentInfo);

    for (const _info of targetInfos) {

        if (
            !_info ||
            typeof _info !== 'object' ||
            _info.kind === 'Doclet' ||
            _info.kind === 'Export' ||
            _info.kind === 'Import'
        ) {
            continue;
        }

        if (_scopePath) {
            _info.meta.scope = _scopePath;
        }

        switch (_info.kind) {

            case 'Array':
                if (_info.values) {
                    addInfoScopes(_info, _info.values);
                }
                break;

            case 'Class':
            case 'Interface':
                if (_info.generics) {
                    addInfoScopes(_info, _info.generics);
                }
                addInfoScopes(_info, _info.members);
                break;


            case 'Function':
                if (_info.generics) {
                    addInfoScopes(_info, _info.generics);
                }
                if (_info.parameters) {
                    addInfoScopes(_info, _info.parameters);
                }
                break;

            case 'FunctionCall':
                if (_info.arguments) {
                    addInfoScopes(_info, _info.arguments);
                }
                if (_info.genericArguments) {
                    addInfoScopes(_info, _info.genericArguments);
                }
                break;

            case 'Module':
            case 'Namespace':
            case 'Object':
                addInfoScopes(_info, _info.members);
                break;

            case 'Property':
            case 'Reference':
            case 'Variable':
                if (typeof _info.value === 'object') {
                    addInfoScopes(_info, [_info.value]);
                }
                break;

            case 'TypeAlias':
                if (_info.generics) {
                    addInfoScopes(_info, _info.generics);
                }
                break;

            default:
                break;

        }

    }

}


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
 * Complete cached source infos with external additions from DTS files.
 */
function autoCompleteInfos() {
    /** @type {string} */
    let _modulePath;
    /** @type {SourceInfo} */
    let _sourceInfo;

    for (const _key of Object.keys(SOURCE_CACHE)) {

        _sourceInfo = SOURCE_CACHE[_key];

        if (!_sourceInfo) {
            continue;
        }

        for (const _info of _sourceInfo.code) {
            if (
                _info.kind === 'Module' &&
                _info.flags.includes('declare')
            ) {
                _modulePath = sanitizeSourcePath(FSLib.normalizePath(
                    _sourceInfo.path,
                    _info.name,
                    true
                ));

                const _sourceInfoToMerge =
                    getSourceInfo(`${_modulePath}.d.ts`, !!_info.node);

                if (_sourceInfoToMerge) {
                    mergeCodeInfos(_sourceInfoToMerge, _info);
                }
            }
        }

    }

}


/**
 * Extends ClassInfo and InterfaceInfo with additional inherited members.
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

    for (const _extendType of _extendsToDo) {
        _resolvedInfo = resolveReference(
            getSourceInfo(infoToExtend.meta.file, includeNodes),
            _extendType,
            includeNodes
        );

        if (!_resolvedInfo) {
            continue;
        }

        // First complete the parent
        _resolvedInfo = autoExtendInfo(_resolvedInfo, includeNodes);

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
 * Extracts the arguments of the generic name or type.
 *
 * @param {string} nameOrTypeString
 * Name or type to extract from.
 *
 * @return {Array<string>|undefined}
 * Extracted generic arguments.
 */
function extractGenericArguments(
    nameOrTypeString
) {

    if (!GENERIC.test(nameOrTypeString)) {
        return void 0;
    }

    /** @type {Array<string>} */
    const types = [];

    let sublevel = 0;

    for (let part of nameOrTypeString.split(',')) {

        part = part.trim();

        if (sublevel) {
            types.push(`${types.pop()},${part}`);
        } else {
            types.push(part);
        }

        if (part.includes('<')) {
            ++sublevel;
        }
        if (part.includes('>')) {
            --sublevel;
        }

    }

    return types;
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
            _name = extractTagText(codeInfo, 'optionparent', true);
            if (typeof _name === 'string') {
                return _name;
            }
            return (
                extractTagText(codeInfo, 'apioption', true) ||
                extractTagText(codeInfo, 'function', true) ||
                extractTagText(codeInfo, 'name', true)
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
 * Extracts scope path for the given code information.
 *
 * @param {CodeInfo|SourceInfo} info
 * Information to extract from.
 *
 * @return {string|undefined}
 * Scope path or `undefined`.
 */
function extractInfoScopePath(
    info
) {

    switch (info.kind) {

        case 'Array':
        case 'Deconstruct':
        case 'Object':
            return info.meta.scope;

        case 'Class':
        case 'Function':
        case 'FunctionCall':
        case 'Interface':
        case 'Namespace':
        case 'Property':
        case 'Reference':
        case 'TypeAlias':
        case 'Variable':
            return (
                info.meta.scope ?
                    `${info.meta.scope}.${info.name}` :
                    info.name
            );

        default:
            return void 0;

    }

}


/**
 * Retrieves the leading curly bracket inset from the given tag text.
 *
 * @param {string} text
 * Tag text to get insets from.
 *
 * @return {string}
 * Inset from curly bracket or `undefined`.
 */
function extractTagInset(
    text
) {
    return (text.match(DOCLET_TAG_INSET) || [])[1];
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

    /** @type {string|undefined} */
    let _inset;
    /** @type {RegExpMatchArray} */
    let _match;
    /** @type {DocletTag} */
    let _object;

    for (let _text of (doclet.tags[tag] || [])) {
        _object = { tag };
        _inset = extractTagInset(_text);

        if (_inset) {
            _object.type = _inset;
            _text = _text
                .substring(_text.indexOf(`{${_inset}}` + _inset.length + 2))
                .trimStart();
        }

        switch (tag) {

            default:
                break;

            case 'param':
            case 'return':
            case 'returns':
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
 * Retrieves the text of the specified tag from a DocletInfo object.
 *
 * @param {DocletInfo} doclet
 * Doclet information to retrieve from.
 *
 * @param {string} tag
 * Tag to retrieve.
 *
 * @param {boolean|string} [allOrInset]
 * * `false`: Extracts only text from the last tag occurance. (default)
 * * `true`: Extracts text from all tag occurances, separated by `\n\n`.
 * * `string`: Extracts only text with matching leading inset (e.g. product).
 *
 * @return {string|undefined}
 * Retrieved text or `undefined`.
 */
function extractTagText(
    doclet,
    tag,
    allOrInset = false
) {
    const _tagText = doclet.tags[tag];

    if (
        !_tagText ||
        !_tagText.length
    ) {
        return void 0;
    }

    if (allOrInset === false) {
        return _tagText[_tagText.length - 1];
    }

    if (allOrInset === true) {
        return _tagText.join('\n\n');
    }

    /** @type {Array<string>} */
    const _insetText = [];

    /** @type {string|undefined} */
    let _inset;

    for (const _text of _tagText) {
        _inset = extractTagInset(_text);
        if (!_inset) {
            _insetText.push(_text);
        } else if (_inset === allOrInset) {
            _insetText.push(
                _text
                    .substring(_text.indexOf(`{${_inset}}` + _inset.length + 1))
                    .trimStart()
            );
        }
    }

    return _insetText.join('\n\n');
}


/**
 * Extracts all types of a type statement, including conditionals, generics,
 * intersects and unions.
 *
 * @param {string|Array<string>} typeStrings
 * Type statements as strings to extract from.
 *
 * @param {boolean} [includeNativeTypes]
 * Set `true` to include TypeScript's native types.
 *
 * @return {Array<string>}
 * Array of extracted types.
 */
function extractTypes(
    typeStrings,
    includeNativeTypes
) {
    /** @type {Array<string>} */
    const _types = [];

    let _sublevel = 0;

    typeStrings = (
        typeof typeStrings === 'string' ?
            [typeStrings] :
            typeStrings
    );

    for (const _typeString of typeStrings) {
        for (let _part of _typeString.split('|')) {

            if (
                !includeNativeTypes &&
                isNativeType(_part)
            ) {
                if (_part.includes('<')) {
                    _types.push(
                        _part
                            .replace(NATIVE_HELPER, '')
                            .replace('>', '')
                    );
                }
                continue;
            }

            _part = _part.trim();

            if (_sublevel) {
                _types.push(`${_types.pop()}|${_part}`);
            } else {
                _types.push(_part);
            }

            if (_part.includes('<')) {
                ++_sublevel;
            }
            if (_part.includes('>')) {
                --_sublevel;
            }

        }
    }

    return _types;
}


/**
 * Retrieves array info from the given node.
 *
 * @param {TS.Node} node
 * Node that might be an array.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ArrayInfo|undefined}
 * Array information or `undefined`.
 */
function getArrayInfo(
    node,
    includeNodes
) {

    if (!TS.isArrayLiteralExpression(node)) {
        return void 0;
    }

    /** @type {ArrayInfo} */
    const _info = {
        kind: 'Array'
    };

    /** @type {Array<MemberInfo>} */
    const _values = _info.values = [];

    for (const _child of node.elements) {
        _values.push(getInfoValue(_child));
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    if (includeNodes) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieve child informations and doclets.
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

    addChildInfos(_infos, nodes, includeNodes);

    return _infos;
}


/**
 * Retrieves class info from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a class.
 *
 * @param {boolean} [includeNodes]
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
        addChildInfos(_info.generics = [], node.typeParameters, includeNodes);
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

    addChildInfos(_info.members = [], node.members, includeNodes);
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
 * @param {boolean} [includeNodes]
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
        const _from = getInfoValue(node.initializer);

        if (
            typeof _from === 'object' &&
            (
                _from.kind === 'FunctionCall' ||
                _from.kind === 'Reference'
            )
        ) {
            _info.from = _from;
        }
    }

    for (const element of node.name.elements) {
        _info.deconstructs[(element.propertyName || element.name).text] =
            element.name.text;
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
 * @param {boolean} [includeNodes]
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
                        (
                            node.comment instanceof Array ?
                                node.comment
                                    .map(c => c.text)
                                    .join('\n') :
                                node.comment
                        ).trim()
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

                addInfoMeta(_doclet, node);

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
 * @param {boolean} [includeNodes]
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
        kind: 'Export',
        value: getInfoValue(node.expression, includeNodes)
    };

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
 * @param {boolean} [includeNodes]
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
        /** @type {Array<Value>} */
        const _arguments = _info.arguments = [];

        for (const _child of node.arguments) {
            _arguments.push(getInfoValue(_child));
        }

        if (!_arguments.length) {
            delete _info.arguments;
        }
    }

    if (node.typeArguments) {
        /** @type {Array<string>} */
        const _genericArguments = _info.genericArguments = [];

        for (const _child of node.typeArguments) {
            _genericArguments.push(getInfoType(_child));
        }

        if (!_genericArguments.length) {
            delete _info.genericArguments;
        }
    }

    addInfoMeta(_info, node);

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
 * @param {boolean} [includeNodes]
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
        /** @type {Array<VariableInfo>} */
        const _generics = _info.generics = [];

        /** @type {TypeAliasInfo} */
        let _typeAlias;

        for (const _typeParameter of node.typeParameters) {
            _typeAlias = getTypeAliasInfo(_typeParameter, includeNodes);

            if (_typeAlias) {
                _generics.push(_typeAlias);
            }
        }

        if (!_generics.length) {
            delete _info.generics;
        }
    }

    if (node.parameters) {
        /** @type {Array<VariableInfo>} */
        const _parameters = _info.parameters = [];

        /** @type {PropertyInfo|} */
        let _typeAlias;

        for (const parameter of node.parameters) {
            _typeAlias = getTypeAliasInfo(parameter, includeNodes);

            if (_typeAlias) {
                _parameters.push(_typeAlias);
            }
        }

        if (!_parameters.length) {
            delete _info.parameters;
        }
    }

    _info.return = (
        getInfoType(node.type) ||
        getInfoType(TS.getJSDocReturnType(node))
    );

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    if (includeNode) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves type information for a given node.
 *
 * @param {TS.TypeNode} [node]
 * Node to return type information for.
 *
 * @return {Array<string>|undefined}
 * Type information for the given node.
 */
function getInfoType(
    node
) {
    /** @type {Array<string>} */
    let _infoType = [];

    if (node) {
        if (TS.isParenthesizedTypeNode(node)) {
            return getInfoType(node.type);
        }
        if (TS.isUnionTypeNode(node)) {
            for (const _nodeType of node.types) {
                _infoType.push(...(getInfoType(_nodeType) || []));
            }
        } else {
            _infoType.push(sanitizeType(node.getText()));
        }
    }

    _infoType = _infoType.filter(_type => _type !== 'void');

    if (_infoType.length) {
        return _infoType;
    }

    return void 0;
}


/**
 * Retrieves value information for a given expression.
 *
 * @param {TS.Expression} node
 * Expression to return a value for.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {Value}
 * Value or `undefined`.
 */
function getInfoValue(
    node,
    includeNodes
) {
    /** @type {Value} */
    let _value = (
        getArrayInfo(node, includeNodes) ||
        getDeconstructInfos(node, includeNodes) ||
        getFunctionCallInfo(node, includeNodes) ||
        getFunctionInfo(node, includeNodes) ||
        getObjectInfo(node, includeNodes) ||
        getReferenceInfo(node, includeNodes) ||
        getVariableInfo(node, includeNodes)
    );

    if (_value) {
        const _doclets = getDocletInfosBetween(node, node, includeNodes);

        if (_doclets.length) {
            _value.doclet = _doclets.pop();
        }

        return _value;
    }

    _value = node.getText();

    if (sanitizeText(_value) !== _value) {
        return sanitizeText(_value);
    }

    if (!isNaN(Number(_value))) {
        return Number(_value);
    }

    return {
        false: false,
        null: null,
        true: true
    }[_value] || _value;
}


/**
 * Retrieves interface information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be an interface.
 *
 * @param {boolean} [includeNodes]
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
        addChildInfos(_info.generics = [], node.typeParameters, includeNodes);
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

    addChildInfos(_info.members = [], node.members, includeNodes);
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
 * @param {boolean} [includeNodes]
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

    addChildInfos(
        _info.members = [],
        ((node.body && node.body.statements) || []),
        includeNodes
    );
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    if (includeNodes) {
        _info.node = node;
    }

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
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {ObjectInfo}
 * Object information or `undefined`.
 */
function getObjectInfo(
    node,
    includeNodes
) {
    /** @type {Array<string>|undefined} */
    let _type;

    if (TS.isAsExpression(node)) {
        _type = getInfoType(node.type);
        node = node.expression;
    }

    if (!TS.isObjectLiteralExpression(node)) {
        return void 0;
    }

    /** @type {ObjectInfo} */
    const _info = {
        kind: 'Object'
    };

    _type = (_type || getInfoType(TS.getJSDocType(node)));

    if (typeof _type !== 'object') {
        _info.type = _type;
    }

    addChildInfos(_info.members = [], node.properties, includeNodes);
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
        !TS.isShorthandPropertyAssignment(node)
    ) {
        _info.type = (
            getInfoType(node.type) ||
            getInfoType(TS.getJSDocType(node))
        );
    }

    if (!TS.isPropertySignature(node)) {
        const _initializer = (
            TS.isShorthandPropertyAssignment(node) ?
                node.objectAssignmentInitializer :
                node.initializer
        );

        if (_initializer) {
            _info.value = getInfoValue(_initializer);
        }
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    if (includeNode) {
        _info.node = node;
    }

    return _info;
}


/**
 * Retrieves reference information from the current node.
 *
 * @param {TS.Node} node
 * Node that might be a reference like an intendifier.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript node in the information.
 *
 * @return {ReferenceInfo|undefined}
 * Reference information or `undefined`.
 */
function getReferenceInfo(
    node,
    includeNodes
) {

    if (
        !TS.isIdentifier(node) &&
        !TS.isParameter(node) &&
        !TS.isPropertyAccessExpression(node)
    ) {
        return void 0;
    }

    /** @type {ReferenceInfo} */
    const _info = {
        kind: 'Reference',
        name: (
            TS.isParameter(node) ?
                node.name.text :
                node.getText()
        )
    };

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    if (includeNodes) {
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
 * @return {SourceInfo|undefined}
 * Source information.
 */
function getSourceInfo(
    filePath,
    sourceText,
    includeNodes
) {
    let _info = getSourceInfoFromCache(filePath, includeNodes);

    if (!sourceText) {
        if (_info) {
            return _info;
        }
        sourceText = FS.readFileSync(filePath, 'utf8');
    }

    const _cacheKey = `${filePath}:${!!includeNodes}`;
    const _sourceFile = TS.createSourceFile(
        filePath,
        sourceText,
        TS.ScriptTarget.Latest,
        true
    );

    /** @type {SourceInfo} */
    _info = {
        kind: 'Source',
        path: filePath,
        code: []
    };

    addChildInfos(_info.code, getNodesChildren(_sourceFile), includeNodes);
    addInfoScopes(_info, _info.code);

    SOURCE_CACHE[_cacheKey] = _info;

    return _info;
}


/**
 * Retrieves source information from the source cache.
 *
 * @param {string} filePath
 * Path to source file.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @return {SourceInfo|undefined}
 * Source information.
 */
function getSourceInfoFromCache(
    filePath,
    includeNodes
) {
    return SOURCE_CACHE[`${filePath}:${!!includeNodes}`];
}


/**
 * Retrieves type alias information from the given node.
 *
 * @param {TS.Node} node
 * Node that might be a type alias.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript node in the information.
 *
 * @return {TypeAliasInfo|undefined}
 * Type alias information or `undefined`.
 */
function getTypeAliasInfo(
    node,
    includeNodes
) {

    if (
        !TS.isTypeAliasDeclaration(node) &&
        !TS.isTypeParameterDeclaration(node)
    ) {
        return void 0;
    }

    /** @type {TypeAliasInfo} */
    const _info = {
        kind: 'TypeAlias',
        name: node.name.text
    };

    if (TS.isTypeParameterDeclaration(node)) {
        if (node.constraint) {
            _info.value = (
                getInfoType(node.constraint) ||
                getInfoType(
                    TS
                        .getJSDocParameterTags(node)
                        .filter(_parameter => _parameter.name === _info.name)[0]
                )
            );
        }
        if (node.default) {
            _info.value = _info.value || [];
            _info.value = getInfoType(node.default);
        }
    } else {
        _info.value = (
            getInfoType(node.type) ||
            getInfoType(TS.getJSDocType(node))
        );
        if (node.typeParameters) {
            /** @type {Array<TypeAliasInfo>} */
            const _generics = [];

            /** @type {TypeAliasInfo|undefined} */
            let _typeAliasInfo;

            for (const parameter of node.typeParameters) {
                _typeAliasInfo = getTypeAliasInfo(parameter);
                if (_typeAliasInfo) {
                    _generics.push(_typeAliasInfo);
                }
            }

            if (_generics.length) {
                _info.generics = _generics;
            }
        }

    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
 * @param {boolean} [includeNodes]
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
        !TS.isVariableDeclaration(node) ||
        TS.isArrayBindingPattern(node.name) || // See getDeconstructInfo
        TS.isObjectBindingPattern(node.name)
    ) {
        return void 0;
    }

    /** @type {VariableInfo} */
    const _info = {
        kind: 'Variable',
        name: node.name.text
    };

    _info.type = (
        getInfoType(node.type) ||
        getInfoType(TS.getJSDocType(node))
    );
    if (node.initializer) {
        _info.type = (
            _info.type ||
            getInfoType(node.initializer)
        );
        _info.value = getInfoValue(node.initializer, includeNodes);
    }

    if (TS.isVariableDeclarationList(node.parent)) {
        addInfoFlags(_info, node.parent.parent);
    } else {
        addInfoFlags(_info, node);
    }

    addInfoMeta(_info, node);

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
 * @param {string} typeString
 * Type to test.
 *
 * @return {boolean}
 * `true`, if type is integrated into TypeScript.
 */
function isNativeType(
    typeString
) {
    return (
        typeString.length < 2 ||
        !isCapitalCase(typeString) ||
        NATIVE_TYPES.includes(typeString) ||
        NATIVE_HELPER.test(typeString) ||
        TS.SyntaxKind[typeString] > 0
    );
}


/**
 * Tests whether a doclet tag is related to one or more products. The test will
 * also succeed, if no product information was provided or could be found.
 *
 * @param {string|DocletInfo|undefined} docletOrTagLine
 * Doclet information or tag line to test.
 *
 * @param {Array<string>} [products]
 * Products to test against.
 *
 * @return {boolean}
 * `true` if related to one or more products, otherwise `false`.
 */
function isProductRelated(
    docletOrTagLine,
    products = PRODUCTS
) {
    /** @type {Array<string>} */
    const productsToTest = [];

    if (
        !docletOrTagLine ||
        !products.length
    ) {
        return true;
    }

    /**
     * Adds any discovered product to the `productsToTest` array.
     *
     * @param {string} tagLine
     * Line to extract product from.
     */
    function addProductsToTest(tagLine) {
        const inset = extractTagInset(tagLine);

        if (inset) {
            productsToTest.push(...inset.split(/[^\w\-]+/gu));
        }

    }

    if (typeof docletOrTagLine === 'string') {

        addProductsToTest(docletOrTagLine);

    } else {
        const productTagLine = extractTagText(docletOrTagLine, 'product', true);

        if (productTagLine) {
            return isProductRelated(`{${productTagLine}}`, products);
        }

        const tags = docletOrTagLine.tags;

        for (const tag of Object.keys(tags)) {

            if (
                tag === 'param' ||
                tag === 'type'
            ) {
                continue;
            }

            for (const tagLine of tags[tag]) {
                addProductsToTest(tagLine);
            }

        }

    }

    if (!productsToTest.length) {
        return true;
    }

    for (const product of productsToTest) {
        if (products.includes(product)) {
            return true;
        }
    }

    return false;
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
                        addInfoScopes(_targetMember, [_mergedMember]);
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
                            _targetMember.type ||
                            _sourceMember.type
                        ) {
                            _targetMember.type = Array.from(new Set([
                                ...(_targetMember.type || []),
                                ...(_sourceMember.type || [])
                            ]));
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
            addInfoScopes(targetInfo, [_mergedMember]);
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

    /** @type {string} */
    let productTagLine;
    /** @type {Record<string,Array<string>>} */
    let sourceTags;
    /** @type {Array<string>} */
    let targetTag;

    for (const sourceDoclet of sourceDoclets) {
        productTagLine = extractTagText(sourceDoclet, 'product', true);

        if (
            productTagLine &&
            !isProductRelated(`{${productTagLine}}`)
        ) {
            continue;
        }

        sourceTags = sourceDoclet.tags;

        for (const tag of Object.keys(sourceTags)) {
            targetTag = targetTags[tag] = targetTags[tag] || [];
            for (const value of sourceTags[tag]) {
                if (
                    !targetTag.includes(value) &&
                    isProductRelated(value)
                ) {
                    targetTag.push(value);
                }
            }
        }
    }

    targetDoclet.meta.merged = true;

    return targetDoclet;
}


/**
 * Creates a new code or source information object.
 *
 * @template {CodeInfo|SourceInfo} T
 *
 * @param {Partial<T>} [template]
 * Information to apply.
 *
 * @return {T}
 * New information.
 */
function newCodeInfo(
    template = {}
) {
    const clone = {
        kind: 'Object',
        meta: newMeta(),
        ...structuredClone({
            ...template,
            node: void 0 // Avoid clone of native TSNode.
        })
    };

    delete clone.node; // Clean-up

    return clone;
}


/**
 * Creates a new DocletInfo object.
 *
 * @param {Partial<DocletInfo>} [template]
 * Doclet information to apply.
 *
 * @return {DocletInfo}
 * The new doclet information.
 */
function newDocletInfo(
    template = {}
) {
    const clone = {
        kind: 'Doclet',
        tags: {},
        meta: newMeta(),
        ...structuredClone({
            ...template,
            node: void 0 // Avoid clone of native TSNode.
        })
    };

    delete clone.node; // Clean-up

    return clone;
}


/**
 * Creates a new Meta object.
 *
 * @param {Partial<Meta>} [template]
 * Meta to apply.
 *
 * @return {Meta}
 * New meta.
 */
function newMeta(
    template = {}
) {
    return {
        begin: 0,
        end: 0,
        file: '',
        overhead: 0,
        syntax: 0,
        ...structuredClone(template)
    };
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
 * Resets the products array and source cache for a new session.
 */
function reset() {

    PRODUCTS.length = 0;

    for (const key of Object.keys(SOURCE_CACHE)) {
        delete SOURCE_CACHE[key];
    }

}


/**
 * Resolves a reference relative to the given information.
 *
 * @param {CodeInfo|SourceInfo} scopeInfo
 * Scope information to use.
 *
 * @param {string|ReferenceInfo} reference
 * Reference name or information to resolve.
 *
 * @return {CodeInfo|undefined}
 * Resolved information or `undefined`.
 */
function resolveReference(
    scopeInfo,
    reference
) {
    const _sourceInfo = (
        scopeInfo.kind === 'Source' ?
            scopeInfo :
            getSourceInfo(scopeInfo.meta.file)
    );

    let _hasThis = false;
    let _referenceName = (
        typeof reference === 'string' ?
            reference :
            reference.name
    );

    const _referenceSplit = _referenceName.split(/\W+/gsu);

    if (_referenceSplit.indexOf('this') === 0) {
        _hasThis = true;
        _referenceName = _referenceName.substring(5);
        _referenceSplit.shift();
    }

    /** @type {CodeInfo|undefined} */
    let _resolvedInfo;
    let _scopePath = extractInfoScopePath(scopeInfo);

    // First search in inner scopes.
    while (_scopePath) {

        _resolvedInfo = resolveReferenceInChildInfos(
            _sourceInfo,
            _sourceInfo.code,
            (
                _referenceName ?
                    `${_scopePath}.${_referenceName}` :
                    _scopePath
            )
        );

        if (_resolvedInfo) {
            return _resolvedInfo;
        }

        _scopePath = _scopePath.substring(0, _scopePath.lastIndexOf('.'));

    }

    // Did not found this in inner scopes.
    if (_hasThis) {
        return void 0;
    }

    // Search in source scope.
    return resolveReferenceInChildInfos(
        _sourceInfo,
        _sourceInfo.code,
        _referenceName
    );
}


/**
 * Resolves a reference relative to the given informations.
 *
 * @param {NamespaceInfo|SourceInfo} scopeInfo
 * Scope information to use.
 *
 * @param {Array<CodeInfo>} childInfos
 * Child informations to use.
 *
 * @param {string} referenceName
 * Reference name to resolve.
 *
 * @return {CodeInfo|undefined}
 * Resolved information or `undefined`.
 */
function resolveReferenceInChildInfos(
    scopeInfo,
    childInfos,
    referenceName
) {
    const _referenceSplit = referenceName.split(/\W+/gsu);
    const _referenceCurrent = _referenceSplit.shift();
    const _referenceNext = _referenceSplit.join('.');

    /** @type {CodeInfo|undefined} */
    let _resolvedInfo;
    /** @type {SourceInfo|undefined} */
    let _sourceInfo;

    for (const _childInfo of childInfos) {
        switch (_childInfo.kind) {

            case 'Class':
            case 'Interface':
            case 'Namespace':
                if (extractInfoName(_childInfo) === _referenceCurrent) {
                    if (_referenceNext) {
                        _resolvedInfo = resolveReferenceInChildInfos(
                            (
                                _childInfo.kind === 'Namespace' ?
                                    _childInfo :
                                    scopeInfo
                            ),
                            _childInfo.members,
                            _referenceNext
                        );
                        if (_resolvedInfo) {
                            return _resolvedInfo;
                        }
                    } else {
                        return _childInfo;
                    }
                }
                continue;

            case 'Deconstruct':
                _resolvedInfo = resolveReferenceInDeconstructInfo(
                    scopeInfo,
                    _childInfo,
                    referenceName
                );
                if (_resolvedInfo) {
                    return _resolvedInfo;
                }
                continue;

            case 'Export':
                _resolvedInfo = resolveReferenceInExportInfo(
                    scopeInfo,
                    _childInfo,
                    referenceName
                );
                if (_resolvedInfo) {
                    return _resolvedInfo;
                }
                continue;

            case 'Import':
                _resolvedInfo =
                    resolveReferenceInImportInfo(_childInfo, referenceName);
                if (_resolvedInfo) {
                    return _resolvedInfo;
                }
                continue;

            case 'Module':
                continue;

            case 'Property':
            case 'Variable':
                if (extractInfoName(_childInfo) === _referenceCurrent) {
                    if (!_referenceNext) {
                        return _childInfo;
                    }
                    if (typeof _childInfo.value === 'object') {
                        return resolveReferenceInChildInfos(
                            scopeInfo,
                            [_childInfo.value],
                            _referenceNext
                        );
                    }
                }
                continue;

            case 'Reference':
                if (scopeInfo.kind === 'Namespace') {
                    // Search in original file
                    if (_childInfo.meta.file !== scopeInfo.meta.file) {
                        _resolvedInfo = resolveReference(
                            getSourceInfo(
                                _childInfo.meta.file,
                                void 0,
                                !!_childInfo.node
                            ),
                            _childInfo.name,
                            !!_childInfo.node
                        );
                        if (_resolvedInfo) {
                            return _resolvedInfo;
                        }
                    }
                    // Search in namespace
                    _resolvedInfo = resolveReferenceInChildInfos(
                        scopeInfo,
                        scopeInfo.members,
                        _childInfo.name
                    );
                    if (_resolvedInfo) {
                        return _resolvedInfo;
                    }
                    // Search in outer scope of namespace
                    _sourceInfo = getSourceInfo(
                        scopeInfo.meta.file,
                        void 0,
                        !!scopeInfo.node
                    );
                    if (_sourceInfo) {
                        _resolvedInfo = resolveReferenceInChildInfos(
                            _sourceInfo,
                            _sourceInfo.code,
                            _childInfo.name
                        );
                        if (_resolvedInfo) {
                            return _resolvedInfo;
                        }
                    }
                } else {
                    if (_childInfo.meta.file !== scopeInfo.path) {
                        // Search in original file
                        _sourceInfo = getSourceInfo(
                            _childInfo.meta.file,
                            void 0,
                            !!_childInfo.node
                        );
                        if (_sourceInfo) {
                            _resolvedInfo =
                                resolveReference(_sourceInfo, _childInfo.name);
                            if (_resolvedInfo) {
                                return _resolvedInfo;
                            }
                        }
                    }
                    // Search in source scope
                    if (scopeInfo.kind === 'Source') {
                        _resolvedInfo = resolveReference(scopeInfo, _childInfo);
                        if (_resolvedInfo) {
                            return _resolvedInfo;
                        }
                    }
                }
                continue;

            case 'Object':
                _resolvedInfo = resolveReferenceInObjectInfo(
                    scopeInfo,
                    _childInfo,
                    referenceName
                );
                if (_resolvedInfo) {
                    return _resolvedInfo;
                }
                continue;

            case 'TypeAlias':
                if (extractInfoName(_childInfo) === _referenceCurrent) {
                    const _typeAlias = extractTypes(_childInfo.value)[0];
                    if (_typeAlias) {
                        return resolveReference(
                            scopeInfo,
                            _referenceNext ?
                                `${_typeAlias}.${_referenceNext}` :
                                _typeAlias
                        );
                    }
                    return _childInfo;
                }
                continue;

            default:
                if (extractInfoName(_childInfo) === referenceName) {
                    return _childInfo;
                }
                continue;

        }
    }

    return void 0;
}


/**
 * Resolves a reference relative to the given informations.
 *
 * @param {NamespaceInfo|SourceInfo} scopeInfo
 * Scope information to use.
 *
 * @param {DeconstructInfo} deconstructInfo
 * Deconstruct information to use.
 *
 * @param {string} referenceName
 * Reference name to resolve.
 *
 * @return {CodeInfo|undefined}
 * Resolved information or `undefined`.
 */
function resolveReferenceInDeconstructInfo(
    scopeInfo,
    deconstructInfo,
    referenceName
) {
    const _deconstructs = deconstructInfo.deconstructs;
    const _referenceSplit = referenceName.split(/\W+/gsu);
    const _referenceCurrent = _referenceSplit.shift();
    const _referenceNext = _referenceSplit.join('.');

    /** @type {string|undefined} */
    let _found;

    for (const _original of Object.keys(_deconstructs || [])) {
        if (_deconstructs[_original] === _referenceCurrent) {
            _found = _original;
            break;
        }
    }

    if (_found) {

        if (_referenceNext) {
            return resolveReferenceInChildInfos(
                scopeInfo,
                (
                    scopeInfo.kind === 'Source' ?
                        scopeInfo.code :
                        scopeInfo.members
                ),
                (
                    deconstructInfo.from ?
                        `${_found}.${_referenceNext}` :
                        _found
                )
            );
        }

        return _found;
    }

    return void 0;
}


/**
 * Resolves a reference relative to the given informations.
 *
 * @param {NamespaceInfo|SourceInfo} scopeInfo
 * Scope information to use.
 *
 * @param {ExportInfo} exportInfo
 * Export information to use.
 *
 * @param {string} referenceName
 * Reference name to resolve.
 *
 * @return {CodeInfo|undefined}
 * Resolved information or `undefined`.
 */
function resolveReferenceInExportInfo(
    scopeInfo,
    exportInfo,
    referenceName
) {
    const _referenceSplit = referenceName.split(/\W+/gsu);
    const _referenceCurrent = _referenceSplit.shift();
    const _referenceNext = _referenceSplit.join('.');

    if (
        _referenceCurrent !== 'default' ||
        !exportInfo.flags ||
        !exportInfo.flags.includes('default')
    ) {
        return void 0;
    }

    const _exportValue = exportInfo.value;

    if (
        !_exportValue ||
        typeof _exportValue !== 'object'
    ) {
        return exportInfo;
    }

    if (_exportValue.kind === 'Reference') {
        return resolveReferenceInChildInfos(
            scopeInfo,
            (
                scopeInfo.kind === 'Source' ?
                    scopeInfo.code :
                    scopeInfo.members
            ),
            (
                _referenceNext ?
                    `${_exportValue.name}.${_referenceNext}` :
                    _exportValue.name
            )
        );
    }

    if (_referenceNext) {
        return resolveReferenceInChildInfos(
            scopeInfo,
            [_exportValue],
            _referenceNext
        );
    }

    return _exportValue;
}


/**
 * Resolves a reference relative to the given informations.
 *
 * @param {ImportInfo} importInfo
 * Import information to use.
 *
 * @param {string} referenceName
 * Reference name to resolve.
 *
 * @return {CodeInfo|undefined}
 * Resolved information or `undefined`.
 */
function resolveReferenceInImportInfo(
    importInfo,
    referenceName
) {
    const _referenceSplit = referenceName.split(/\W+/gsu);
    const _referenceCurrent = _referenceSplit.shift();
    const _referenceNext = _referenceSplit.join('.');

    /** @type {string|undefined} */
    let _found;

    for (const _original of Object.keys(importInfo.imports || [])) {
        if (importInfo.imports[_original] === _referenceCurrent) {
            _found = _original;
            break;
        }
    }

    if (_found) {
        const _from = Path.join(
            Path.dirname(importInfo.meta.file),
            importInfo.from
        );

        /** @type {SourceInfo|undefined} */
        let _sourceInfo;

        if (
            SOURCE_EXTENSION.test(_from) &&
            FSLib.isFile(FSLib.path(_from.replace(JSX, '\.t$1')))
        ) {
            _sourceInfo = getSourceInfo(
                _from.replace(JSX, '\.t$1'),
                void 0,
                !!importInfo.node
            );
        } else if (FSLib.isFile(FSLib.path(`${_from}.ts`))) {
            _sourceInfo =
                getSourceInfo(`${_from}.ts`, void 0, !!importInfo.node);
        } else if (FSLib.isFile(FSLib.path(`${_from}.d.ts`))) {
            _sourceInfo =
                getSourceInfo(`${_from}.d.ts`, void 0, !!importInfo.node);
        } else {
            return importInfo;
        }

        if (_sourceInfo) {
            return resolveReferenceInChildInfos(
                _sourceInfo,
                _sourceInfo.code,
                (_referenceNext ? `${_found}.${_referenceNext}` : _found)
            );
        }

        return importInfo;
    }

    return void 0;
}


/**
 * Resolves a reference relative to the given informations.
 *
 * @param {NamespaceInfo|SourceInfo} scopeInfo
 * Scope information to use.
 *
 * @param {ObjectInfo} objectInfo
 * Object information to use.
 *
 * @param {string} referenceName
 * Reference name to resolve.
 *
 * @return {CodeInfo|undefined}
 * Resolved information or `undefined`.
 */
function resolveReferenceInObjectInfo(
    scopeInfo,
    objectInfo,
    referenceName
) {
    const _referenceSplit = referenceName.split(/\W+/gsu);
    const _nextReferenceName = _referenceSplit.shift();
    const _restReferenceName = _referenceSplit.join('.');

    for (const _member of objectInfo.members) {
        if (extractInfoName(_member) === _nextReferenceName) {
            if (!_restReferenceName) {
                return _member;
            }
            if (_member.kind === 'Property') {
                return resolveReferenceInChildInfos(
                    scopeInfo,
                    _member,
                    _restReferenceName
                );
            }
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
    type = trimBetween(`${type}`, true);

    if (type.includes('=>')) {
        return type.trim();
    }

    return type.replaceAll(SANITIZE_TYPE, '$1').trim();
}


/**
 * Removes all spaces in the given text.
 *
 * @param {string} text
 * Text to trim.
 *
 * @param {boolean} [keepSeparate]
 * Replaces spaces with a single space character.
 *
 * @return {string}
 * Trimmed text.
 */
function trimBetween(
    text,
    keepSeparate
) {
    return text.replace(/\s+/gsu, (keepSeparate ? ' ' : ''));
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


/* *
 *
 *  Default Export
 *
 * */


module.exports = {
    PRODUCTS,
    SOURCE_CACHE,
    SOURCE_EXTENSION,
    sourceRoot,
    addTag,
    autoCompleteInfos,
    autoExtendInfo,
    changeSourceCode,
    changeSourceNode,
    debug,
    extractGenericArguments,
    extractInfoName,
    extractInfos,
    extractTagInset,
    extractTagObjects,
    extractTagText,
    extractTypes,
    getChildInfos,
    getDocletInfosBetween,
    getNodesChildren,
    getNodesFirstChild,
    getNodesLastChild,
    getSourceInfo,
    getSourceInfoFromCache,
    isCapitalCase,
    isNativeType,
    mergeCodeInfos,
    mergeDocletInfos,
    newCodeInfo,
    newDocletInfo,
    removeAllDoclets,
    removeTag,
    reset,
    resolveReference,
    sanitizeSourcePath,
    sanitizeText,
    sanitizeType,
    toDocletString
};


/* *
 *
 *  Doclet Declarations
 *
 * */


/**
 * @typedef ArrayInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Array'} kind
 * @property {Meta} meta
 * @property {TS.ArrayLiteralExpression} [node]
 * @property {Array<Value>} values
 */


/**
 * @typedef ClassInfo
 * @property {DocletInfo} [doclet]
 * @property {string} [extends]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<TypeAliasInfo>} [generics]
 * @property {Array<string>} [implements]
 * @property {'Class'} kind
 * @property {Array<MemberInfo>} members
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.ClassDeclaration} [node]
 */


/**
 * @typedef {ArrayInfo|ClassInfo|DeconstructInfo|DocletInfo|ExportInfo|
 *           FunctionCallInfo|FunctionInfo|ImportInfo|InterfaceInfo|
 *           NamespaceInfo|ObjectInfo|PropertyInfo|ReferenceInfo|TypeAliasInfo|
 *           VariableInfo
 *          } CodeInfo
 */


/**
 * @typedef DeconstructInfo
 * @property {Record<string,string>} deconstructs
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {FunctionCallInfo|ReferenceInfo} [from]
 * @property {'Deconstruct'} kind
 * @property {Meta} meta
 * @property {TS.ParameterDeclaration|TS.VariableDeclaration} [node]
 * @property {Array<string>} [type]
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
 * @property {string} tag
 * @property {string} [text]
 * @property {Array<string>} [type]
 * @property {string} [value]
 */


/**
 * @typedef ExportInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Export'} kind
 * @property {Meta} meta
 * @property {TS.ExportDeclaration} [node]
 * @property {Value} [value]
 */


/**
 * @typedef FunctionCallInfo
 * @property {Array<Value>} [arguments]
 * @property {DocletInfo} [doclet]
 * @property {Array<string>} [genericArguments]
 * @property {'FunctionCall'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.CallExpression} [node]
 */


/**
 * @typedef FunctionInfo
 * @property {Array<DocletInfo>} [body]
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<TypeAliasInfo>} [generics]
 * @property {boolean} [inherited]
 * @property {'Function'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.ConstructorDeclaration|TS.FunctionDeclaration|TS.MethodDeclaration} [node]
 * @property {Array<VariableInfo>} [parameters]
 * @property {Array<string>} [return]
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
 * @typedef {'async'|'abstract'|'assured'|'await'|'declare'|'default'|'export'|
 *           'optional'|'private'|'protected'|'rest'|'static'|'type'
 *          } InfoFlag
 */


/**
 * @typedef InterfaceInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<string>} [extends]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<TypeAliasInfo>} [generics]
 * @property {'Interface'} kind
 * @property {Array<MemberInfo>} members
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.InterfaceDeclaration} [node]
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
 * @property {string} [scope]
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
 * @property {TS.ModuleDeclaration} [node]
 */


/**
 * @typedef ObjectInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Object'} kind
 * @property {Array<MemberInfo>} members
 * @property {Meta} meta
 * @property {TS.ObjectLiteralExpression} [node]
 * @property {Array<string>} [type]
 */


/**
 * @typedef PropertyInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {boolean} [inherited]
 * @property {'Property'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.PropertyAssignment|TS.PropertyDeclaration|TS.PropertySignature|TS.ShorthandPropertyAssignment} [node]
 * @property {Array<string>} [type]
 * @property {Value} [value]
 */


/**
 * @typedef ReferenceInfo
 * @property {DocletInfo} [doclet]
 * @property {'Reference'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.Identifier|TS.PropertyAccessExpression} node
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
 * @property {Array<TypeAliasInfo>} [generics]
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.TypeAliasDeclaration|TS.TypeParameterDeclaration} [node]
 * @property {Array<string>} [value]
 */


/**
 * @typedef {boolean|null|number|string|ArrayInfo|FunctionCallInfo|FunctionInfo|
 *           ObjectInfo|ReferenceInfo
 *          } Value
 */


/**
 * @typedef VariableInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Variable'} kind
 * @property {Meta} meta
 * @property {string} name
 * @property {TS.ParameterDeclaration|TS.TypeParameterDeclaration|TS.VariableDeclaration} [node]
 * @property {Array<string>} [type]
 * @property {Value} [value]
 */


('');
