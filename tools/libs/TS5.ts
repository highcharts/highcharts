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
   func-style,
   jsdoc/require-param-description, jsdoc/require-description,
   no-console, no-undef, no-underscore-dangle, no-unused-expressions,
   no-use-before-define */


/* *
 *
 *  Imports
 *
 * */


import * as FS from 'node:fs';

import * as Path from 'node:path';

import * as TS from 'typescript';


/* *
 *
 *  Declarations
 *
 * */


export interface ClassInfo {
    doclet?: DocletInfo;
    extends?: string;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    implements?: Array<string>;
    kind: 'Class';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    node: TS.ClassDeclaration;
}


export type CodeInfo = (
    | ClassInfo
    | DocletInfo
    | FunctionInfo
    | InterfaceInfo
    | NamespaceInfo
    | PropertyInfo
    | TypeAliasInfo
    | VariableInfo
);


export interface DocletInfo {
    kind: 'Doclet';
    meta: InfoMeta;
    node: TS.JSDoc;
    tags: Record<string, Array<string>>;
}


export interface DocletTag {
    isOptional?: boolean;
    name?: string;
    tag: string;
    text?: string;
    type?: Array<string>;
    value?: string;
}


export interface FunctionInfo {
    doclet?: DocletInfo;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    inherited?: boolean;
    kind: 'Function';
    meta: InfoMeta;
    name: string;
    node: (TS.ConstructorDeclaration|TS.FunctionDeclaration|TS.MethodDeclaration);
    parameters?: Array<VariableInfo>;
    return?: VariableType;
}


export type InfoFlag = (
    'async'|'abstract'|'assured'|'await'|'declare'|'default'|'export'|
    'optional'|'private'|'protected'|'readonly'|'rest'|'static'|'type'
);


export interface InfoMeta {
    begin: number;
    end: number;
    file: string;
    overhead: number;
    scope: string;
    syntax: number;
}


export interface InterfaceInfo {
    doclet?: DocletInfo;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    extends?: Array<string>;
    kind: 'Interface';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    node: TS.InterfaceDeclaration;
}


export type IntersectType = Array<VariableType>;


export type MemberInfo = (DocletInfo|FunctionInfo|PropertyInfo);


export interface NamespaceInfo {
    doclet?: DocletInfo;
    flags?: Array<InfoFlag>;
    kind: ('Module'|'Namespace');
    members: Array<CodeInfo>;
    meta: InfoMeta;
    name: string;
    node: TS.ModuleDeclaration;
}


export interface ObjectType {
    doclet?: DocletInfo;
    flags?: Array<InfoFlag>;
    kind: 'ObjectType';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    node: TS.TypeLiteralNode;
}


export interface Project {
    rootPath?: string;
    sourceInfos: Array<SourceInfo>;
    tsProgram: TS.Program;
}


export interface PropertyInfo {
    doclet?: DocletInfo;
    flags?: Array<InfoFlag>;
    inherited?: boolean;
    kind: 'Property';
    meta: InfoMeta;
    name: string;
    node: (
        | TS.PropertyAssignment
        | TS.PropertyDeclaration
        | TS.PropertySignature
        | TS.ShorthandPropertyAssignment
    );
    type?: VariableType;
}


export interface SourceInfo {
    code: Array<CodeInfo>;
    file: string;
    kind: 'Source';
    node: TS.SourceFile;
}


export interface TypeAliasInfo {
    doclet?: DocletInfo;
    kind: 'TypeAlias';
    generics?: Array<TypeAliasInfo>;
    meta: InfoMeta;
    name: string;
    node: (TS.TypeAliasDeclaration|TS.TypeParameterDeclaration);
    value?: VariableType;
}


export interface VariableInfo {
    doclet?: DocletInfo;
    flags?: Array<InfoFlag>;
    kind: 'Variable';
    meta: InfoMeta;
    name: string;
    node: (TS.ParameterDeclaration|TS.TypeParameterDeclaration|TS.VariableDeclaration);
    type: VariableType;
}


export type VariableType = (string|IntersectType|ObjectType);


/* *
 *
 *  Constants
 *
 * */


const DOCLET_TAG_INSET = /^\s*\{([^}]+)\}/su;


const DOCLET_TAG_NAME = /^(?:\[([a-z][\w\.='"]+)\]|([a-z][\w\.='"]*))/su;


const JSDOC_TAG_REPLACEMENTS: Record<string, string> = {
    arg: 'param',
    argument: 'param',
    defaultvalue: 'default',
    desc: 'description',
    func: 'function',
    method: 'function',
    returns: 'return',
};


const GENERIC = /^[\w\.]*<[\s\w\.\[\],|()]+>$/su;


const NATIVE_HELPER = new RegExp(
    '^(?:' + [
        'Array', 'Extract', 'Omit', 'Partial', 'Promise', 'Readonly',
        'ReadonlyArray', 'Record', 'Require'
    ].join('|') + ')(?:<|$)',
    'gsu'
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


const SANITIZE_TYPE = /\(\s*(.*)\s*\)/gsu;


/* *
 *
 *  Functions
 *
 * */


/**
 * Add child informations and doclets.
 *
 * @param project
 * Related project.
 *
 * @param infos
 * Array of code information to add to.
 *
 * @param nodes
 * Child nodes to extract from.
 */
function addChildInfos (
    project: Project,
    infos: Array<CodeInfo>,
    nodes: (Array<TS.Node>|TS.NodeArray<TS.Node>|TS.SymbolTable)
): void {
    let _child: (CodeInfo|undefined);
    let _children: (Array<CodeInfo>|undefined);
    let _doclet: DocletInfo;
    let _doclets: Array<DocletInfo>;

    if (!(nodes instanceof Array)) { // Symbol
        nodes = Array
            .from(nodes.values())
            .filter(v => !!v.valueDeclaration)
            .map(v => v.valueDeclaration!);
    }

    for (const node of nodes) {

        if (node.kind === TS.SyntaxKind.EndOfFileToken) {
            break;
        } else if (TS.isVariableStatement(node)) {
            addChildInfos(
                project,
                infos,
                nodesChildren(node.declarationList)
            );
        } else if (TS.isExportAssignment(node)) {
            addChildInfos(
                project,
                infos,
                [node.expression]
            );
        } else {
            _child = (
                getVariableInfo(project, node) ||
                getTypeAliasInfo(project, node) ||
                getPropertyInfo(project, node) ||
                getNamespaceInfo(project, node) ||
                getInterfaceInfo(project, node) ||
                getFunctionInfo(project, node) ||
                getClassInfo(project, node)
            );
        }

        // Retrieve leading doclets

        _doclets = getDocletInfos(project, node);

        // Deal with floating doclets before leading child doclet

        if (_doclets.length) {

            _doclet = _doclets[_doclets.length - 1];

            // Add trailing doclet to child information

            if (
                _child &&
                _child.kind !== 'Doclet' &&
                !_doclet.tags.apioption
            ) {
                _child.doclet = _doclets.pop();
            }

            // Add floating doclets

            for (_doclet of _doclets) {
                infos.push(_doclet);
            }

        }

        // Finally add child(ren)

        if (_child) {
            infos.push(_child);
            _child = void 0;
        }

        if (_children) {
            infos.push(..._children);
            _children = void 0;
        }
    }

}


/**
 * Adds info flags from the given node.
 *
 * @param info
 * Information to add to.
 *
 * @param node
 * Node to retrieve from.
 */
function addInfoFlags (
    info: Partial<(CodeInfo|ObjectType)>,
    node: TS.Node
): void {

    switch (info.kind) {
        case 'Doclet':
        case 'TypeAlias':
        case undefined:
            return;
    }

    const _flags: Array<InfoFlag> = [];

    if (!TS.canHaveModifiers(node)) {
        return;
    }

    for (const _modifier of (TS.getModifiers(node) || [])) {
        if (!TS.isDecorator(_modifier)) {
            _flags.push(_modifier.getText() as InfoFlag);
        }
    }

    if (
        (
            TS.isBindingElement(node) ||
            TS.isParameterPropertyDeclaration(node, node.parent) ||
            TS.isTupleTypeNode(node)
        ) &&
        node.dotDotDotToken
    ) {
        _flags.push('rest');
    }

    if (
        TS.isArrayLiteralExpression(node) ||
        TS.isConstructorDeclaration(node) ||
        TS.isFunctionDeclaration(node) ||
        TS.isGetAccessorDeclaration(node) ||
        TS.isMethodDeclaration(node) ||
        TS.isPropertyDeclaration(node) ||
        TS.isSetAccessorDeclaration(node) ||
        TS.isVariableDeclaration(node)
    ) {
        if (node.exclamationToken) {
            _flags.push('assured');
        }
        if (node.questionToken) {
            _flags.push('optional');
        }
    }

    if (TS.isExportAssignment(node)) {
        _flags.push('default');
    }

    if (
        TS.isImportDeclaration(node) &&
        node.importClause &&
        node.importClause.isTypeOnly
    ) {
        _flags.push('type');
    }

    if (_flags.length) {
        info.flags = _flags;
    }

}


/**
 * Retrieves meta information for a given node.
 *
 * @param info
 * Information to add to.
 *
 * @param node
 * Node to return meta information for.
 */
function addInfoMeta (
    info: Partial<(CodeInfo|ObjectType)>,
    node: TS.Node
): void {
    info.meta = {
        begin: node.getStart(),
        end: node.getEnd(),
        file: node.getSourceFile().fileName,
        overhead: node.getLeadingTriviaWidth(),
        scope: '',
        syntax: node.kind
    };
    Object.defineProperty(info, 'node', {
        value: node,
    });
}


/**
 * Adds the scope path to code informations.
 *
 * @param parentInfo
 * Code information with scope path to add.
 *
 * @param targetInfos
 * Code information to add to.
 */
function addInfoScopes (
    parentInfo: (CodeInfo|SourceInfo),
    targetInfos: Array<CodeInfo|VariableType>
): void {
    const _scopePath = extractInfoScopePath(parentInfo);

    for (const _info of targetInfos) {

        if (
            !_info ||
            typeof _info !== 'object' ||
            _info instanceof Array ||
            _info.kind === 'Doclet'
        ) {
            continue;
        }

        if (_scopePath) {
            _info.meta.scope = _scopePath;
        }

        switch (_info.kind) {

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

            case 'Module':
            case 'Namespace':
                addInfoScopes(_info, _info.members);
                break;

            case 'Property':
            case 'Variable':
                if (typeof _info.type === 'object') {
                    addInfoScopes(_info, [_info.type]);
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
 * Shifts ranges in the source code with replacements.
 *
 * @param sourceCode
 * Source code to change.
 *
 * @param replacements
 * Replacements to apply.
 *
 * @return
 * Changed source code.
 */
function changeSourceCode (
    sourceCode: string,
    replacements: Array<[number,number,string]>
): string {

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
 * @param sourceNode
 * Source file to change.
 *
 * @param replacements
 * Replacements to apply.
 *
 * @return
 * New source node with changes.
 */
export function changeSourceNode (
    sourceNode: TS.SourceFile,
    replacements: Array<[number,number,string]>
): TS.SourceFile {

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
 * @param node
 * Node to debug.
 *
 * @param depth
 * Level of debug depth regarding children.
 *
 * @param indent
 * Internal parameter.
 */
export function debug (
    node: TS.Node,
    depth: number = 0,
    indent: string = ''
): void {

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
        for (const child of nodesChildren(node)) {
            debug(child, depth, indent);
        }
    }

}


/**
 * Extracts the arguments of the generic name or type.
 *
 * @param nameOrTypeString
 * Name or type to extract from.
 *
 * @return
 * Extracted generic arguments.
 */
export function extractGenericArguments (
    nameOrTypeString: string
): Array<string>|undefined {

    if (!nameOrTypeString.match(GENERIC)) {
        return void 0;
    }

    const types: Array<string> = [];

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
 * @param info
 * Code information to extract from.
 *
 * @return
 * Extracted name or `undefined`.
 */
export function extractInfoName (
    info: (CodeInfo|ObjectType|SourceInfo)
): (string|undefined) {
    let _name: (string|undefined);

    switch (info.kind) {
        case 'Class':
        case 'Function':
        case 'Interface':
        case 'Module':
        case 'Namespace':
        case 'Property':
        case 'TypeAlias':
        case 'Variable':
            return info.name;
        case 'Doclet':
            _name = extractTagText(info, 'optionparent', true);
            if (typeof _name === 'string') {
                return _name;
            }
            return (
                extractTagText(info, 'apioption', true) ||
                extractTagText(info, 'function', true) ||
                extractTagText(info, 'name', true)
            );
        case 'Source':
            return info.file;
        default:
            return void 0;
    }
}


/**
 * Retrieves the leading curly bracket inset from the given tag text.
 *
 * @param text
 * Tag text to get insets from.
 *
 * @return
 * Inset from curly bracket or `undefined`.
 */
export function extractTagInset (
    text: string
): string {
    return (text.match(DOCLET_TAG_INSET) || [])[1];
}


/**
 * Extracts scope path for the given code information.
 *
 * @param info
 * Information to extract from.
 *
 * @return
 * Scope path or `undefined`.
 */
function extractInfoScopePath (
    info: (CodeInfo|ObjectType|SourceInfo)
): (string|undefined) {

    switch (info.kind) {

        case 'Class':
        case 'Function':
        case 'Interface':
        case 'Namespace':
        case 'Module':
        case 'ObjectType':
        case 'Property':
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
 * Retrieves all information for the specified tag from a DocletInfo object.
 *
 * @param doclet
 * Doclet information to retrieve from.
 *
 * @param tag
 * Tag to retrieve.
 *
 * @return
 * Retrieved tag informations.
 */
export function extractTagObjects (
    doclet: DocletInfo,
    tag: string
): Array<DocletTag> {
    const _objects: Array<DocletTag> = [];

    let _inset: (string|undefined);
    let _match: (RegExpMatchArray|null);
    let _object: DocletTag;

    for (let _text of (doclet.tags[tag] || [])) {
        _object = { tag };
        _inset = extractTagInset(_text);

        if (_inset) {
            _object.type = [_inset];
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
 * @param doclet
 * Doclet information to retrieve from.
 *
 * @param tag
 * Tag to retrieve.
 *
 * @param allOrInset
 * * `false`: Extracts only text from the last tag occurance. (default)
 * * `true`: Extracts text from all tag occurances, separated by `\n\n`.
 * * `string`: Extracts only text with matching leading inset (e.g. product).
 *
 * @return
 * Retrieved text or `undefined`.
 */
export function extractTagText (
    doclet: DocletInfo,
    tag: string,
    allOrInset: (boolean|string) = false
): (string|undefined) {
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

    const _insetText: Array<string> = [];

    let _inset: (string|undefined);

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
 * @param typeStrings
 * Type statements as strings to extract from.
 *
 * @param includeNativeTypes
 * Set `true` to include TypeScript's native types.
 *
 * @return
 * Array of extracted types.
 */
export function extractTypes (
    typeStrings: (string|Array<string>),
    includeNativeTypes?: boolean
): Array<string> {
    const _types: Array<string> = [];

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
 * Retrieves class info from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a class.
 *
 * @return
 * Class information or `undefined`.
 */
function getClassInfo (
    project: Project,
    node: TS.Node
): (ClassInfo|undefined) {

    if (!TS.isClassDeclaration(node)) {
        return void 0;
    }

    const _info = {
        kind: 'Class'
    } as ClassInfo;

    _info.name = ((node.name && node.name.getText()) || 'default');

    if (node.typeParameters) {
        addChildInfos(project, _info.generics = [], node.typeParameters);
    }

    if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
            if (clause.token === TS.SyntaxKind.ExtendsKeyword) {
                _info.extends = clause.types[0]?.getText();
            } else {
                _info.implements = clause.types.map(t => t.getText());
            }
        }
    }

    addChildInfos(project, _info.members = [], node.members);
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
}

/**
 * Retrieves doclet information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might have a doclet.
 *
 * @return
 * Doclet information or `undefined`.
 */
function getDocletInfos(
    project: Project,
    node: TS.Node
): Array<DocletInfo> {

    if (!TS.isJSDocCommentContainingNode(node)) {
        return [];
    }

    const _docs = TS.getJSDocCommentsAndTags(node);
    const _infos: Array<DocletInfo> = [];

    let _info: (DocletInfo|undefined);

    for (const _doc of _docs) {
        if (_info && TS.isJSDoc(_doc) && Object.keys(_info.tags).length) {
            _infos.push(_info);
            _info = undefined;
        }
        if (!_info) {
            _info = {
                kind: 'Doclet',
                tags: {},
            } as DocletInfo;
            addInfoMeta(_info, _doc);
        }
        if (TS.isJSDoc(_doc)) {
            if (_doc.comment) {
                _info.tags.description = _info.tags.description || [];
                if (_doc.comment instanceof Array) {
                    _info.tags.description = _info.tags.description
                        .concat(_doc.comment.map(c => c.text));
                } else {
                    _info.tags.description.push(_doc.comment);
                }
            }
        } else {
            let _tag =_doc.tagName.text;

            _tag = JSDOC_TAG_REPLACEMENTS[_tag] || _tag;
            _info.tags[_tag] = _info.tags[_tag] || [];

            if (_doc.comment instanceof Array) {
                _info.tags[_tag] = _info.tags.description
                    .concat(_doc.comment.map(c => c.text));
            } else if (_doc.comment) {
                _info.tags[_tag].push(_doc.comment);
            }
        }
    }

    if (_info && !_infos.includes(_info)) {
        _infos.push(_info);
    }

    if (_infos.length) {
        return _infos;
    }

    return [];
}


/**
 * Retrieves function information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be an import.
 *
 * @return
 * Function information or `undefined`.
 */
function getFunctionInfo (
    project: Project,
    node: TS.Node
): (FunctionInfo|undefined) {

    if (
        !TS.isConstructorDeclaration(node) &&
        !TS.isFunctionDeclaration(node) &&
        !TS.isMethodDeclaration(node)
    ) {
        return void 0;
    }

    const _info = {
        kind: 'Function',
        name: (
            TS.isConstructorDeclaration(node) ?
                'constructor' :
                nodesName(node)
        )
    } as FunctionInfo;

    if (node.parameters) {
        const _parameters: Array<VariableInfo> = _info.parameters = [];

        let _variableInfo: (VariableInfo|undefined);

        for (const parameter of node.parameters) {
            _variableInfo = getVariableInfo(project, parameter);

            if (_variableInfo) {
                _parameters.push(_variableInfo);
            }
        }

        if (_parameters.length) {
            _info.parameters = _parameters;
        }
    }

    if (node.typeParameters) {
        const _generics: Array<TypeAliasInfo> = _info.generics = [];

        let _typeAlias: (TypeAliasInfo|undefined);

        for (const _typeParameter of node.typeParameters) {
            _typeAlias = getTypeAliasInfo(project, _typeParameter);

            if (_typeAlias) {
                _generics.push(_typeAlias);
            }
        }

        if (!_generics.length) {
            delete _info.generics;
        }
    }

    const _returnType = node.type || TS.getJSDocReturnType(node);

    if (_returnType) {
        _info.return = getInfoType(project, _returnType);
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
}


/**
 * Retrieves type information for a given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node to return type information for.
 *
 * @return
 * Type information for the given node.
 */
function getInfoType (
    project: Project,
    node: (TS.TypeNode|undefined)
): (VariableType|undefined) {

    if (
        !node ||
        !TS.isTypeNode(node)
    ) {
        return;
    }

    let _infoType: Array<VariableType> = [];

    if (node) {
        if (TS.isParenthesizedTypeNode(node)) {
            return getInfoType(project, node.type);
        }
        if (TS.isTypeLiteralNode(node)) {
            const _type: Partial<ObjectType> = {
                kind: 'ObjectType',
                name: nodesName(node),
                members: []
            };

            let _memberType: (MemberInfo|undefined);

            for (const _member of node.members) {
                _memberType = (
                    getPropertyInfo(project, _member) ||
                    getFunctionInfo(project, _member)
                );
                if (_memberType) {
                    _type.members!.push(_memberType);
                }
            }

            addInfoFlags(_type, node);
            addInfoMeta(_type, node);

            return _type as ObjectType;
        }
        if (TS.isUnionTypeNode(node) || TS.isIntersectionTypeNode(node)) {
            let _subtype: (VariableType|undefined);

            for (const _subitem of node.types) {
                _subtype = getInfoType(project, _subitem);

                if (_subtype) {
                    _infoType.push(_subtype);
                }
            }
        } else if (TS.isTypeReferenceNode(node)) {
            _infoType.push(sanitizeType(node.typeName.getText()));
        } else {
            _infoType.push(sanitizeType(node.getText()));
        }
    }

    _infoType = _infoType.filter(_type => _type !== 'void');

    if (!_infoType.length) {
        return void 0;
    }

    return (_infoType.length === 1 ? _infoType[0] : _infoType);
}


/**
 * Retrieves interface information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be an interface.
 *
 * @return
 * Interface or `undefined`.
 */
function getInterfaceInfo (
    project: Project,
    node: TS.Node
): (InterfaceInfo|undefined) {

    if (!TS.isInterfaceDeclaration(node)) {
        return void 0;
    }

    const _tsChecker = project.tsProgram.getTypeChecker();
    const _info = {
        kind: 'Interface',
        name: nodesName(node)
    } as InterfaceInfo;

    if (node.typeParameters) {
        addChildInfos(project, _info.generics = [], node.typeParameters);
    }

    if (node.heritageClauses) {
        const _type = nodesType(project.tsProgram, node);
        _info.extends = _tsChecker
            .getBaseTypes(_type as TS.InterfaceType)
            .map(_baseType => _tsChecker.typeToString(_baseType));
    }

    const _symbol = _tsChecker.getSymbolAtLocation(node.name);

    if (_symbol) {
        const _mergedSymbol = _tsChecker.getMergedSymbol(_symbol);

        if (_mergedSymbol.members) {
            addChildInfos(project, _info.members = [], _mergedSymbol.members);
        }
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
}


/**
 * Retrieves namespace and module information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a namespace or module.
 *
 * @return
 * Namespace, module or `undefined`.
 */
function getNamespaceInfo (
    project: Project,
    node: TS.Node
): (NamespaceInfo|undefined) {

    if (!TS.isModuleDeclaration(node)) {
        return void 0;
    }

    const _info = {
        kind: (
            node
                .getChildren()
                .some(token => token.kind === TS.SyntaxKind.ModuleKeyword) ?
                'Module' :
                'Namespace'
        ),
        name: node.name.text
    } as NamespaceInfo;

    addChildInfos(
        project,
        _info.members = [],
        node.body && nodesChildren(node.body) || []
    );
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
}


/**
 * Retrieves project information for the given root path.
 *
 * @param configOrEntryPath
 * Path to config, root file, or project folder.
 *
 * @return
 * New Project with source information.
 */
export function getProject(
    configOrRootPath: string,
): Project {
    const _project: Project = {
        rootPath: configOrRootPath,
        sourceInfos: [],
        tsProgram: tsProgram(configOrRootPath)
    };
    const _folderPath = (
        Path.extname(configOrRootPath) ?
            Path.dirname(configOrRootPath):
            configOrRootPath
    );
    const _absolutePath: string = Path.resolve(_folderPath);
    const _sourceInfos = _project.sourceInfos;

    for (const _sourceFile of _project.tsProgram.getSourceFiles()) {
        if (
            _sourceFile.fileName.startsWith(_absolutePath) ||
            _sourceFile.fileName.startsWith(_folderPath)
        ) {
            _sourceInfos.push(getSourceInfo(_project, _sourceFile));
        }
    }

    return _project;
}

/**
 * Retrieves property information from the current node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a property.
 *
 * @return
 * Property information or `undefined`.
 */
function getPropertyInfo (
    project: Project,
    node: TS.Node
): (PropertyInfo|undefined) {

    if (
        !TS.isPropertyDeclaration(node) &&
        !TS.isPropertySignature(node)
    ) {
        return void 0;
    }

    const _info = {
        kind: 'Property',
        name: nodesName(node),
        type: getInfoType(project, node.type)
    } as PropertyInfo;

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
}


/**
 * Retrieves source information from the given file source.
 *
 * @param project
 * Related project.
 *
 * @param sourceFile
 * Node or path of source file.
 *
 * @return
 * Source information.
 */
export function getSourceInfo (
    project: Project,
    sourceFile: (string|TS.SourceFile),
): SourceInfo {

    if (typeof sourceFile === 'string') {
        sourceFile = project.tsProgram.getSourceFile(sourceFile)!;
    }

    const _info = {
        kind: 'Source',
        code: [],
        file: sourceFile.fileName,
        node: sourceFile
    } as SourceInfo;

    addChildInfos(project, _info.code, nodesChildren(sourceFile));
    addInfoScopes(_info, _info.code);

    return _info;
}


/**
 * Retrieves type alias information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a type alias.
 *
 * @return
 * Type alias information or `undefined`.
 */
function getTypeAliasInfo (
    project: Project,
    node: TS.Node
): (TypeAliasInfo|undefined) {

    if (
        !TS.isTypeAliasDeclaration(node) &&
        !TS.isTypeParameterDeclaration(node)
    ) {
        return void 0;
    }

    const _info = {
        kind: 'TypeAlias',
        name: nodesName(node)
    } as TypeAliasInfo;

    if (TS.isTypeParameterDeclaration(node)) {
        if (node.constraint) {
            _info.value = getInfoType(project, node.constraint);
        }
        if (node.default) {
            _info.value = _info.value || [];
            _info.value = getInfoType(project, node.default);
        }
    } else {
        _info.value = (
            getInfoType(project, node.type) ||
            getInfoType(project, TS.getJSDocType(node))
        );
        if (node.typeParameters) {
            const _generics: Array<TypeAliasInfo> = [];

            let _typeAliasInfo: (TypeAliasInfo|undefined);

            for (const parameter of node.typeParameters) {
                _typeAliasInfo = getTypeAliasInfo(project, parameter);
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

    return _info;
}


/**
 * Retrieves variable information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a variable or assignment.
 *
 * @return
 * Variable information or `undefined`.
 */
function getVariableInfo (
    project: Project,
    node: TS.Node
): (VariableInfo|undefined) {

    if (!TS.isVariableDeclaration(node)) {
        return void 0;
    }

    const _tsChecker = project.tsProgram.getTypeChecker();
    const _type = nodesType(project.tsProgram, node);
    const _info = {
        kind: 'Variable',
        name: nodesName(node),
        type: [_tsChecker.typeToString(_type)]
    } as VariableInfo;

    if (TS.isVariableDeclarationList(node.parent)) {
        addInfoFlags(_info, node.parent.parent);
    } else {
        addInfoFlags(_info, node);
    }

    addInfoMeta(_info, node);

    return _info;
}


/**
 * Tests if a text string starts with upper case.
 *
 * @param text
 * Text string to test.
 *
 * @return
 * `true`, if text string starts with upper case.
 */
function isCapitalCase (
    text: string
): boolean {
    const firstChar = `${text}`.charAt(0);

    return (firstChar === firstChar.toUpperCase());
}


/**
 * Tests if a type is integrated into TypeScript.
 *
 * @param typeString
 * Type to test.
 *
 * @return
 * `true`, if type is integrated into TypeScript.
 */
export function isNativeType (
    typeString: string
): boolean {
    return (
        typeString.length < 2 ||
        !isCapitalCase(typeString) ||
        NATIVE_TYPES.includes(typeString) ||
        !!typeString.match(NATIVE_HELPER) ||
        !!TS.SyntaxKind[typeString as keyof typeof TS.SyntaxKind]
    );
}


/**
 * Creates a new DocletInfo object.
 *
 * @param template
 * Doclet information to apply.
 *
 * @return
 * The new doclet information.
 */
export function newDocletInfo (
    template: Partial<DocletInfo> = {}
): DocletInfo {
    const mockupSource = TS
        .createSourceFile('', '/** */', TS.ScriptTarget.Latest);
    const clone: Partial<DocletInfo> = {
        kind: 'Doclet',
        tags: {},
        meta: newMeta(),
        ...structuredClone({
            ...template,
            node: void 0
        })
    };

    clone.node = mockupSource.getChildAt(0) as TS.JSDoc;

    return clone as DocletInfo;
}


/**
 * Creates a new Meta object.
 *
 * @param template
 * Meta to apply.
 *
 * @return
 * New meta.
 */
function newMeta (
    template: Partial<InfoMeta> = {}
): InfoMeta {
    return {
        begin: 0,
        end: 0,
        file: '',
        overhead: 0,
        scope: '',
        syntax: 0,
        ...structuredClone(template)
    };
}


/**
 * [TS] Retrieves all logical children and skips statement tokens.
 *
 * @param node
 * Node to retrieve logical children from.
 *
 * @return
 * Array of logical children.
 */
function nodesChildren (
    node: TS.Node
): Array<TS.Node> {
    const children: Array<TS.Node> = [];

    TS.forEachChild(node, child => {
        children.push(child);
    });

    return children;
}


/**
 * [TS] Retrieves the name of a given reflective node.
 *
 * @param node
 * Node to retrieve name from.
 *
 * @return
 * Retrieved type.
 */
function nodesName(
    node: (TS.NamedDeclaration|TS.TypeReferenceNode)
): string {
    return (
        TS.isTypeReferenceNode(node) ?
            node.typeName.getText() :
            TS.getNameOfDeclaration(node)?.getText() ||
            TS.InternalSymbolName.Missing
    );
}


/**
 * [TS] Retrieves the symbol of a given reflective node.
 *
 * @param program
 * Related parser program.
 *
 * @param node
 * Node to retrieve symbol from.
 *
 * @return
 * Retrieved symbol.
 */
function nodesSymbol(
    program: TS.Program,
    node: (TS.Declaration|TS.Expression)
): TS.Symbol {
    const _identifier = TS.getNameOfDeclaration(node);
    const _name = _identifier?.getText() || TS.InternalSymbolName.Missing;
    const _symbol = _identifier && program
        .getTypeChecker()
        .getSymbolAtLocation(_identifier);

    return (_symbol || {
        escapedName: TS.InternalSymbolName.Missing,
        flags: TS.SymbolFlags.None,
        name: _name,
        getDeclarations: () => [],
        getDocumentationComment: () => [],
        getEscapedName: () => TS.InternalSymbolName.Missing,
        getFlags: () => TS.SymbolFlags.None,
        getJsDocTags: () => [],
        getName: () => _name,
    });
}


/**
 * [TS] Retrieves the type of a given reflective node.
 *
 * @param program
 * Related parser program.
 *
 * @param node
 * Node to retrieve type from.
 *
 * @return
 * Retrieved type.
 */
function nodesType(
    program: TS.Program,
    node: (TS.NamedDeclaration|TS.TypeNode)
): TS.Type {
    const _tsChecker = program.getTypeChecker();

    return (
        TS.isTypeNode(node) ?
            _tsChecker.getTypeFromTypeNode(node) :
            _tsChecker.getDeclaredTypeOfSymbol(nodesSymbol(program, node))
    );
}


/**
 * Removes all doclets from source code.
 *
 * @param sourceCode
 * Source code to remove doclets from.
 *
 * @return
 * Source code without doclets.
 */
export function removeAllDoclets (
    sourceCode: string
): string {
    return sourceCode
        .replace(/\n *\/\*\*.*?\*\//gsu, '')
        .replace(/\n(\(?)''\1;[^\n]*/gsu, '')
        .replace(/\n\s+\n/gsu, '\n\n');
}


/**
 * Removes a tag from a DocletInfo object.
 *
 * @param doclet
 * Doclet information to modify.
 *
 * @param tag
 * Tag to remove.
 *
 * @return
 * Removed tag text.
 */
export function removeTag (
    doclet: DocletInfo,
    tag: string
): Array<string> {
    const tags = doclet.tags;

    if (tags) {
        const text = tags[tag];

        delete tags[tag];

        return text;
    }

    return [];
}


export function resolveReference(
    project: Project,
    location: (CodeInfo|SourceInfo),
    reference: string
): Array<CodeInfo> {
    const _tsChecker = project.tsProgram.getTypeChecker();
    const _symbol = _tsChecker
        .resolveName(reference, location.node, TS.SymbolFlags.All, true);

    const _resolvedReferences: Array<CodeInfo> = [];

    if (_symbol?.declarations) {
        addChildInfos(project, _resolvedReferences, _symbol.declarations);
    }

    return _resolvedReferences;
}


/**
 * Sanitize type from surrounding paranthesis characters.
 *
 * @param type
 * Type to sanitize.
 *
 * @return
 * Sanitized type.
 */
function sanitizeType (
    type: string
): string {
    type = trimBetween(`${type}`, true);

    if (type.includes('=>')) {
        return type.trim();
    }

    return type.replace(new RegExp(SANITIZE_TYPE.source, 'gu'), '$1').trim();
}


/**
 * Removes all spaces in the given text.
 *
 * @param text
 * Text to trim.
 *
 * @param keepSeparate
 * Replaces spaces with a single space character.
 *
 * @return
 * Trimmed text.
 */
function trimBetween (
    text: string,
    keepSeparate?: boolean
): string {
    return text.replace(/\s+/gsu, (keepSeparate ? ' ' : ''));
}


/**
 * Compiles doclet information into a code string.
 *
 * @see changeSourceCode
 *
 * @param doclet
 * Doclet information to compile.
 *
 * @param indent
 * Indent styling.
 *
 * @return
 * Doclet string.
 */
export function toDocletString (
    doclet: DocletInfo,
    indent: (number|string) = 0
): string {

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
 * [TS] Creates a parser program.
 *
 * @param rootPath
 * Root path to load. This can be either a config, folder, or source.
 *
 * @returns
 * Parser program.
 *
 * @throws Error
 */
function tsProgram(
    rootPath: string
): TS.Program {

    // Fix root path
    if (FS.existsSync(Path.join(rootPath, 'tsconfig.json'))) {
        rootPath = Path.join(rootPath, 'tsconfig.json');
    }

    // TSConfig mode
    if (rootPath.endsWith('.json')) {
        const _parsedConfig = TS.readConfigFile(rootPath, TS.sys.readFile);

        if (_parsedConfig.error) {
            throw new Error(_parsedConfig.error.messageText.toString());
        }

        const _parsedCommandLine = TS.parseJsonConfigFileContent(
            _parsedConfig.config || {},
            TS.sys,
            Path.dirname(rootPath)
        );

        if (_parsedCommandLine.errors.length) {
            throw new Error(
                _parsedCommandLine.errors[0].messageText.toString()
            );
        }

        return TS.createProgram(
            _parsedCommandLine.fileNames,
            _parsedCommandLine.options
        );
    }

    // Discovery mode
    const _files: Array<string> = [];
    const _addFolder = (folderPath: string): void => {
        for (const entry of FS.readdirSync(folderPath, {
            encoding: 'utf8',
            recursive: true,
            withFileTypes: true
        })) {
            if (entry.isDirectory()) {
                _addFolder(Path.join(entry.parentPath, entry.name));
            } else if (entry.name.match(/\.[jt]sx?$/gsu)) {
                _files.push(Path.join(entry.parentPath, entry.name));
            }
        }
    };

    if (FS.statSync(rootPath).isDirectory()) {
        _addFolder(rootPath);
    } else if (rootPath.match(/\.[jt]sx?$/gsu)) {
        _files.push(rootPath);
    }

    return TS.createProgram(_files, {
        module: TS.ModuleKind.NodeNext,
        moduleResolution: TS.ModuleResolutionKind.NodeNext
    });
}


/* *
 *
 *  Default Export
 *
 * */


export * as default from './TS5';
