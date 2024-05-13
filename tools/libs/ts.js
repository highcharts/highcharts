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


const DOCLET_TAG_NAME = /^(?:\[([a-z][\w.='"]+)\]|([a-z][\w.='"]*))/su;


const DOCLET_TAG_TYPE = /^\{([^}]+)\}/su;


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


const TYPE_SPLIT = /[\W\.]+/gsu;


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
    const extendsToDo = [];

    if (infoToExtend.extends) {
        const extendsTypes = (
            typeof infoToExtend.extends === 'string' ?
                [infoToExtend.extends] :
                infoToExtend.extends
        );

        for (const extendsType of extendsTypes) {
            for (const extractedType of extractTypes(extendsType)) {
                if (!extendsToDo.includes(extractedType)) {
                    extendsToDo.push(extractedType);
                }
            }
        }

    }

    /** @type {CodeInfo} */
    let resolvedInfo;
    /** @type {string|undefined} */
    let resolvedPath;
    /** @type {ResolvedInfo} */
    let resolvedType;

    for (const extendType of extendsToDo) {
        resolvedType = resolveType(sourceInfo, extendType, includeNodes);

        if (!resolvedType) {
            return;
        }

        resolvedInfo = resolvedType.resolvedInfo;
        resolvedPath = FSLib.normalizePath(
            sourceInfo.path,
            resolvedType.resolvedPath,
            true
        );

        if (
            resolvedInfo.kind !== 'Class' &&
            resolvedInfo.kind !== 'Interface'
        ) {
            continue;
        }

        for (let property of resolvedInfo.members) {

            if (extractInfo(infoToExtend.members, property.name)) {
                continue;
            }

            property = newCodeInfo(property);
            property.meta.origin = {
                parent: resolvedInfo.name,
                path: resolvedPath
            };

            infoToExtend.members.push(property);

        }

    }

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
 * Extracts information from an array of CodeInfo types.
 *
 * @param {Array<CodeInfo>} arr
 * Array of informations to extract from.
 *
 * @param {string} name
 * Name of information to extract.
 *
 * @return {Array<CodeInfo>}
 * Extract information.
 */
function extractInfo(
    arr,
    name
) {
    /** @type {Array<CodeInfo>} */
    const extractions = [];

    for (const info of arr) {
        switch (info.kind) {
            case 'Class':
            case 'Function':
            case 'Interface':
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

    /** @type {RegExpMatchArray} */
    let _match;
    /** @type {DocletTag} */
    let _object;

    for (let text of (doclet.tags[tag] || [])) {
        _object = { tag };
        _match = text.match(DOCLET_TAG_TYPE);
        if (_match) {
            _object.type = _match[1];
            text = text.substring(_match[0].length).trimStart();
        }
        if (tag === 'param') {
            _match = text.match(DOCLET_TAG_NAME);
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
                text = text.substring(_match[0].length).trimStart();
            }
        }
        _object.text = text;
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
 * @return {string|void}
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

        if (
            // TS.isVariableDeclarationList(node) ||
            TS.isVariableStatement(node)
        ) {
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
                getPropertyInfo(node, includeNodes) ||
                getObjectInfo(node, includeNodes) ||
                getNamespaceInfo(node, includeNodes) ||
                getInterfaceInfo(node, includeNodes) ||
                getImportInfo(node, includeNodes) ||
                getFunctionInfo(node, includeNodes) ||
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

    _info.flags = getInfoFlags(node);
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

    _info.flags = getInfoFlags(node);
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
                    _doclet.meta = getInfoMeta(node);
                    if (includeNodes) {
                        _doclet.node = node;
                    }
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
        const _object = getChildInfos([node.expression], includeNodes)[0];
        if (_object) {
            if (_object.name) {
                _info.name = _object.name;
            }
            _info.object = _object;
        }
    }

    _info.flags = getInfoFlags(node);
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
        kind: 'Function'
    };

    _info.name = (
        TS.isConstructorDeclaration(node) ?
            'constructor' :
            ((node.name && node.name.text) || '')
    );

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

    _info.flags = getInfoFlags(node);
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

    _info.flags = getInfoFlags(node);
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

    if (!TS.canHaveModifiers(node)) {
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
 * @return {MetaInfo}
 * Meta information for the given node.
 */
function getInfoMeta(
    node
) {
    return {
        begin: node.getStart(),
        end: node.getEnd(),
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

    _info.flags = getInfoFlags(node);
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

    _info.flags = getInfoFlags(node);
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

    _info.flags = getInfoFlags(node);
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
        _info.type = node.type.getText();
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

    _info.flags = getInfoFlags(node);
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
    const sourceFile = TS.createSourceFile(
        filePath,
        (sourceText || FS.readFileSync(filePath, 'utf8')),
        TS.ScriptTarget.Latest,
        true
    );

    /** @type {SourceInfo} */
    const _info = {
        kind: 'Source',
        path: filePath
    };

    _info.code = getChildInfos(getNodesChildren(sourceFile), includeNodes);

    if (includeNodes) {
        _info.node = sourceFile;
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

    _info.flags = getInfoFlags(
        TS.isVariableDeclarationList(node.parent) ?
            node.parent.parent :
            node
    );
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

    return targetDoclet;
}


/**
 * Creates a new CodeInfo object from a template.
 *
 * @template {CodeInfo} T
 *
 * @param {T} template
 * Template to create from.
 *
 * @return {T}
 * Template copy.
 */
function newCodeInfo(
    template
) {
    /** @type {Partial<CodeInfo>} */
    const newInfo = {};

    for (const key of Object.keys(template)) {
        if (template[key] instanceof Array) {
            newInfo[key] = template[key].map(item => (
                item && typeof item === 'object' ?
                    newCodeInfo(item) :
                    item
            ));
        } else if (
            template[key] &&
            typeof template[key] === 'object' &&
            template[key].kind
        ) {
            newInfo[key] = newCodeInfo(template[key]);
        } else {
            newInfo[key] = template[key];
        }
    }

    return newInfo;
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
 * @param {string} type
 * Type to resolve to.
 *
 * @param {boolean} [includeNodes]
 * Whether to include the TypeScript nodes in the information.
 *
 * @param {Record<string,SourceInfo>} [_stack]
 * Internal stack for recursion.
 *
 * @return {ResolvedInfo|undefined}
 * Resolve information.
 */
function resolveType(
    sourceInfo,
    type,
    includeNodes,
    _stack = {}
) {
    /** @type {ResolvedInfo} */
    const resolvedInfo = {
        kind: 'Resolved',
        path: sourceInfo.path,
        resolvedInfo: void 0,
        resolvedPath: sourceInfo.path,
        type
    };

    /** @type {string} */
    let resolvedPath;

    for (const info of sourceInfo.code) {

        if (info.kind === 'Import') {
            const imports = info.imports;

            for (const item in imports) {

                // `item` is the external name, while `type` is the local name
                if (imports[item] === type) {

                    resolvedPath =
                        FSLib.normalizePath(sourceInfo.path, info.from, true);

                    if (Path.extname(resolvedPath) === '.js') {
                        resolvedPath = resolvedPath
                            .substring(0, resolvedPath.length - 3);
                    }

                    if (!Path.extname(resolvedPath)) {
                        if (FS.existsSync(resolvedPath + '.d.ts')) {
                            resolvedPath += '.d.ts';
                        } else if (FS.existsSync(resolvedPath + '.ts')) {
                            resolvedPath += '.ts';
                        } else {
                            continue;
                        }
                    }

                    if (_stack[resolvedPath]) {
                        return void 0; // Break circular references
                    }

                    const resolvedSource = getSourceInfo(
                        resolvedPath,
                        FS.readFileSync(resolvedPath, 'utf8'),
                        includeNodes
                    );

                    _stack[resolvedPath] = resolvedSource;

                    const resolvedImport = resolveType(
                        resolvedSource,
                        (
                            item === 'default' ?
                                type :
                                item
                        ),
                        includeNodes,
                        _stack
                    );

                    if (resolvedImport) {
                        delete _stack[resolvedPath];
                        resolvedInfo.resolvedInfo = resolvedImport.resolvedInfo;
                        resolvedInfo.resolvedPath = resolvedImport.path;
                        return resolvedInfo;
                    }

                }

            }

        }

        switch (info.kind) {
            case 'Export':
                if (
                    info.object &&
                    (
                        info.name === type ||
                        info.object.name === type
                    )
                ) {
                    resolvedInfo.resolvedInfo = info.object;
                    return resolvedInfo;
                }
                break;
            case 'Class':
            case 'Interface':
            case 'Object':
            case 'Variable':
                if (info.name === type) {
                    resolvedInfo.resolvedInfo = info;
                    return resolvedInfo;
                }
                break;
            default:
                break;
        }

    }

    return void 0;
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
 * Converts any tree to a JSON string, while converting TypeScript nodes to raw
 * code.
 *
 * @param {unknown} jsonTree
 * Tree to convert.
 *
 * @param {number|string} [indent]
 * Indent option.
 *
 * @return {string}
 * Converted JSON string.
 */
function toJSONString(
    jsonTree,
    indent
) {

    if (typeof indent === 'number') {
        indent = ''.padEnd(indent, ' ');
    }

    return JSON.stringify(
        jsonTree,
        (_key, value) => (
            (
                value &&
                typeof value === 'object' &&
                typeof value.kind === 'number' &&
                typeof value.getText === 'function'
            ) ?
                value.getText() :
                value
        ),
        indent
    );
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
    addTag,
    autoExtendInfo,
    changeSourceCode,
    changeSourceNode,
    debug,
    extractInfo,
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
    mergeDocletInfos,
    newCodeInfo,
    newDocletInfo,
    removeAllDoclets,
    removeTag,
    resolveType,
    sanitizeText,
    toDocletString,
    toJSONString,
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
 * @property {Array<Member>} members
 * @property {MetaInfo} meta
 * @property {string} name
 * @property {TS.ClassDeclaration} [node]
 */


/**
 * @typedef {ClassInfo|DeconstructInfo|DocletInfo|ExportInfo|FunctionInfo|
 *           ImportInfo|InterfaceInfo|NamespaceInfo|ObjectInfo|PropertyInfo|
 *           VariableInfo
 *          } CodeInfo
 */


/**
 * @typedef {ClassInfo|DeconstructInfo|DocletInfo|ExportInfo|FunctionInfo|
 *           ImportInfo|InterfaceInfo|NamespaceInfo|ObjectInfo|PropertyInfo|
 *           VariableInfo
 *          } CodeInfo
 */


/**
 * @typedef DeconstructInfo
 * @property {Record<string,string>} deconstructs
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Deconstruct'} kind
 * @property {string} [from]
 * @property {MetaInfo} meta
 * @property {TS.VariableDeclaration} [node]
 * @property {string} [type]
 */


/**
 * @typedef DocletInfo
 * @property {'Doclet'} kind
 * @property {MetaInfo} meta
 * @property {TS.JSDoc} [node]
 * @property {Record<string,Array<string>>} tags
 */


/**
 * @typedef DocletTag
 * @property {boolean} [isOptional]
 * @property {string} [name]
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
 * @property {string} [name]
 * @property {CodeInfo} [object]
 * @property {MetaInfo} meta
 * @property {TS.ImportDeclaration} [node]
 */


/**
 * @typedef FunctionInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {Array<VariableInfo>} [generics]
 * @property {boolean} [inherited]
 * @property {'Function'} kind
 * @property {MetaInfo} meta
 * @property {string} name
 * @property {Array<VariableInfo>} [parameters]
 * @property {string} [return]
 */


/**
 * @typedef ImportInfo
 * @property {DocletInfo} [doclet]
 * @property {Record<string,string>} imports
 * @property {'Import'} kind
 * @property {MetaInfo} meta
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
 * @property {Array<Member>} members
 * @property {MetaInfo} meta
 * @property {TS.InterfaceDeclaration} [node]
 * @property {string} name
 */


/**
 * @typedef {DocletInfo|FunctionInfo|PropertyInfo} MemberInfo
 */


/**
 * @typedef MetaInfo
 * @property {number} begin
 * @property {number} end
 * @property {'Meta'} kind
 * @property {number} overhead
 * @property {MetaOrigin} [origin]
 */


/**
 * @typedef MetaOrigin
 * @property {string} parent
 * @property {string} path
 */


/**
 * @typedef NamespaceInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Module'|'Namespace'} kind
 * @property {Array<CodeInfo>} members
 * @property {MetaInfo} meta
 * @property {string} name
 * @property {TS.Node} [node]
 */


/**
 * @typedef ObjectInfo
 * @property {Array<InfoFlag>} [flags]
 * @property {'Object'} kind
 * @property {Array<Member>} members
 * @property {MetaInfo} meta
 * @property {TS.Node} [node]
 * @property {string} [type]
 */


/**
 * @typedef PropertyInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {boolean} [inherited]
 * @property {'Property'} kind
 * @property {MetaInfo} meta
 * @property {string} name
 * @property {TS.PropertyAssignment|TS.PropertyDeclaration|TS.PropertySignature} [node]
 * @property {string} [type]
 * @property {boolean|null|number|string|ObjectInfo} [value]
 */


/**
 * @typedef ResolvedInfo
 * @property {'Resolved'} kind
 * @property {string} path
 * @property {CodeInfo} resolvedInfo
 * @property {string} resolvedPath
 * @property {string} type
 */


/**
 * @typedef SourceInfo
 * @property {Array<CodeInfo>} code
 * @property {'Source'} kind
 * @property {TS.SourceFile} [node]
 * @property {string} path
 */


/**
 * @typedef VariableInfo
 * @property {DocletInfo} [doclet]
 * @property {Array<InfoFlag>} [flags]
 * @property {'Variable'} kind
 * @property {MetaInfo} meta
 * @property {string} name
 * @property {TS.VariableDeclaration} [node]
 * @property {string} [type]
 * @property {boolean|null|number|string|ObjectInfo} [value]
 */


('');
