/* *
 *
 *  Handles TypeScript API and provides a simplified AST of native declarations.
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


export interface ArrayType {
    kind: 'ArrayType';
    meta: InfoMeta;
    symbol: TS.Symbol;
    type?: InfoType;
}

export interface ClassInfo {
    doclet?: InfoDoclet;
    extends?: InfoType;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    implements?: Array<InfoType>;
    kind: 'Class';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    scope?: string;
    symbol: TS.Symbol;
}


export type CodeInfo = (
    | ClassInfo
    | EnumerationInfo
    | FunctionInfo
    | InterfaceInfo
    | NamespaceInfo
    | PropertyInfo
    | TypeAliasInfo
    | VariableInfo
);


export interface DocletTag {
    isOptional?: boolean;
    name?: string;
    tag: string;
    text?: string;
    type?: Array<string>;
    value?: string;
}


export interface EnumerationInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    kind: 'Enumeration';
    members: Array<PropertyInfo>;
    meta: InfoMeta;
    name: string;
    scope?: string;
    symbol: TS.Symbol;
}


export interface FunctionInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    kind: 'Function';
    meta: InfoMeta;
    name: string;
    parameters?: Array<VariableInfo>;
    return?: InfoType;
    scope?: string;
    symbol: TS.Symbol
}


export interface GenericType {
    arguments: Array<InfoType>;
    kind: 'GenericType';
    meta: InfoMeta;
    name: string;
    symbol: TS.Symbol;
}


export interface InfoDoclet {
    [tag: string]: Array<string>
};


export type InfoFlag = (
    'async'|'abstract'|'assured'|'global'|'optional'|'private'|'protected'|
    'readonly'|'rest'|'static'
);


export interface InfoMeta {
    column: number;
    file: string;
    line: number;
    syntax: number;
}


export type InfoType = (
    | string
    | ArrayType
    | GenericType
    | IntersectionType
    | ObjectType
    | ReferenceType
    | UnionType
);


export interface InterfaceInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    extends?: Array<InfoType>;
    kind: 'Interface';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    scope?: string;
    symbol: TS.Symbol;
}


export interface IntersectionType {
    isConditional?: boolean;
    kind: 'IntersectionType';
    members: Array<InfoType>;
    meta: InfoMeta;
    symbol: TS.Symbol;
}


export type MemberInfo = (FunctionInfo|PropertyInfo);


export interface NamespaceInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    kind: 'Namespace';
    members: Array<CodeInfo>;
    meta: InfoMeta;
    name: string;
    scope?: string;
    symbol: TS.Symbol;
}


export interface ObjectType {
    kind: 'ObjectType';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    symbol: TS.Symbol;
}


export interface Project {
    globalInfos: Array<CodeInfo>;
    infoLookup: Map<TS.Symbol, CodeInfo>;
    program: TS.Program;
    rootPath: string;
    sourceInfos: Array<SourceInfo>;
}


export interface PropertyInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    kind: 'Property';
    meta: InfoMeta;
    name: string;
    scope?: undefined;
    symbol: TS.Symbol;
    type?: InfoType;
}


export interface ReferenceType {
    isTypeOf?: boolean;
    kind: 'ReferenceType';
    meta: InfoMeta;
    symbol: TS.Symbol;
    type: string;
}


export interface SourceInfo {
    code: Array<CodeInfo>;
    file: string;
    kind: 'Source';
    symbol?: TS.Symbol;
}


export interface TypeAliasInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    fullNames: Array<string>;
    generics?: Array<TypeAliasInfo>;
    kind: 'TypeAlias';
    meta: InfoMeta;
    name: string;
    scope?: string;
    symbol: TS.Symbol;
    type?: InfoType;
}


export interface UnionType {
    kind: 'UnionType';
    members: Array<InfoType>;
    meta: InfoMeta;
    symbol: TS.Symbol;
}


export interface VariableInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    kind: 'Variable';
    meta: InfoMeta;
    name: string;
    scope?: string;
    symbol: TS.Symbol;
    type: InfoType;
}


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
 * @param children
 * Child nodes or symbols to process and add.
 */
function addChildInfos (
    project: Project,
    infos: Array<CodeInfo>,
    children: (Iterable<TS.Node>|Iterable<TS.Symbol>)
): void {
    const _program = project.program;

    let _child: (CodeInfo|undefined);

    for (let _childSymbol of children) {

        if (isNode(_childSymbol)) {
            const _nodeSymbol = nodesSymbol(_program, _childSymbol);

            if (!_nodeSymbol) {
                continue;
            }

            _childSymbol = _nodeSymbol;
        }

        _child = project.infoLookup.get(_childSymbol);

        if (_child) {
            infos.push(_child);
            continue;
        }

        if (!_childSymbol.declarations) {
            continue;
        }

        for (let _node of _childSymbol.declarations) {

            if (TS.isImportSpecifier(_node)) {
                continue;
            }

            const _nodeSymbol = nodesSymbol(_program, _node);

            if (
                !_nodeSymbol ||
                project.infoLookup.has(_nodeSymbol)
            ) {
                continue;
            }

            if (
                TS.isExportAssignment(_node) ||
                TS.isExportSpecifier(_node)
            ) {
                if (
                    _node.kind === TS.SyntaxKind.ExportAssignment &&
                    _node.isExportEquals
                ) {
                    // Ignore old school exports
                    continue;
                }
                addChildInfos(project, infos, [_nodeSymbol]);
                continue;
            }

            if (TS.isVariableStatement(_node)) {
                addChildInfos(project, infos, _node
                    .declarationList.declarations
                    .map(_innerNode => nodesSymbol(_program, _innerNode))
                    .filter(_innerSymbol => !!_innerSymbol)
                );
                continue;
            }

            _child = (
                getVariableInfo(project, _node) ||
                getTypeAliasInfo(project, _node) ||
                getPropertyInfo(project, _node) ||
                getNamespaceInfo(project, _node) ||
                getInterfaceInfo(project, _node) ||
                getFunctionInfo(project, _node) ||
                getEnumerationInfo(project, _node) ||
                getClassInfo(project, _node)
            );

            if (_child) {

                if (
                    _child.meta.file.startsWith('..') ||
                    (extractInfoName(_child) || '').startsWith('_')
                ) {
                    // Skip externals
                    continue;
                }

                addInfoDoclet(_child, _childSymbol, project);

                if (_node.parent.kind !== TS.SyntaxKind.ModuleBlock) {
                    project.infoLookup.set(_childSymbol, _child);
                }

                if (_child.flags?.includes('global')) {
                    project.globalInfos.push(_child);
                } else {
                    infos.push(_child);
                }

                _child = void 0;

                continue;
            }

            error(`NOT SUPPORTED: ${TS.SyntaxKind[_node.kind]}`, _node);
        }

    }

}


/**
 * Adds doclet information from the given project symbol.
 *
 * @param node
 * Node that might have 
 *
 * @param symbol
 * Symbol that might have a doclet.
 *
 * @param project
 * Related project.
 *
 * @return
 * Doclet information or `undefined`.
 */
function addInfoDoclet(
    info: CodeInfo,
    symbol: TS.Symbol,
    project: Project,
): (InfoDoclet|undefined) {
    const _typeChecker = project.program.getTypeChecker();
    const _commentParts = symbol.getDocumentationComment(_typeChecker);
    const _commentTags = symbol.getJsDocTags(_typeChecker);
    
    if (
        !_commentParts ||
        !_commentTags.length
    ) {
        return;
    }

    const _description: Array<string> = [];

    for (const _part of _commentParts) {
        if (_part.kind !== 'text') {
            break;
        } 
        _description.push(_part.text);
    }

    const _doclet: InfoDoclet = info.doclet = info.doclet || {};

    if (_description.length) {
        _doclet['description'] = _description;
    }

    let _tag: string;

    for (const _part of _commentTags) {

        _tag = JSDOC_TAG_REPLACEMENTS[_part.name] || _part.name;
        _doclet[_tag] = _doclet[_tag] || [];

        if (_part.text) {
            _doclet[_tag].push(TS.displayPartsToString(_part.text));
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
    info: Partial<CodeInfo>,
    node: TS.Node
): void {

    switch (info.kind) {
        case 'TypeAlias':
        case undefined:
            return;
    }

    const _flags: Array<InfoFlag> = [];

    if (node.flags & /* Bit operation */ TS.NodeFlags.GlobalAugmentation) {
        _flags.push('global');
    }

    if (TS.canHaveModifiers(node)) {
        for (const _modifier of (TS.getModifiers(node) || [])) {
            if (!TS.isDecorator(_modifier)) {
                _flags.push(_modifier.getText() as InfoFlag);
            }
        }
    }

    if (
        (
            TS.isBindingElement(node) ||
            TS.isParameterPropertyDeclaration(node, node.parent)
        ) &&
        node.dotDotDotToken
    ) {
        _flags.push('rest');
    }

    if (
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
        if (
            !TS.isVariableDeclaration(node) &&
            node.questionToken
        ) {
            _flags.push('optional');
        }
    }

    if (_flags.length) {
        info.flags = _flags;
    }

}


/**
 * Adds generic parameter informations.
 *
 * @param info
 * Information to add to.
 *
 * @param node
 * Node to retrieve from.
 *
 * @param project
 * Related project.
 */
function addInfoGenerics (
    info: Partial<(ClassInfo|FunctionInfo|InterfaceInfo|TypeAliasInfo)>,
    node: (
        | TS.ClassDeclaration
        | TS.FunctionLikeDeclaration
        | TS.FunctionTypeNode
        | TS.InterfaceDeclaration
        | TS.MethodSignature
        | TS.TypeAliasDeclaration
    ),
    project: Project
): void {

    if (!node.typeParameters) {
        return;
    }

    const _generics: Array<TypeAliasInfo> = [];
    const _program = project.program;

    let _info: TypeAliasInfo;
    let _symbol: (TS.Symbol|undefined);

    for (const _typeParameter of node.typeParameters) {
        _symbol = nodesSymbol(_program, _typeParameter);

        if (!_symbol) {
            continue;
        }

        _info = {
            kind: 'TypeAlias',
            name: symbolsName(_program, _symbol)
        } as TypeAliasInfo;

        if (_typeParameter.constraint) {
            _info.type = nodesInfoType(
                project,
                TS.getEffectiveConstraintOfTypeParameter(_typeParameter)
            );
        }

        if (_typeParameter.default) {
            _info.type = nodesInfoType(project, _typeParameter.default);
        }

        addInfoFlags(_info, _typeParameter);
        addInfoMeta(_info, _typeParameter, project);

        _generics.push(_info);
    }

    if (_generics.length) {
        info.generics = _generics;
    }

}


/**
 * Adds heritage information.
 *
 * @param info
 * Information to add to.
 *
 * @param node
 * Node to retrieve from.
 *
 * @param project
 * Related project.
 */
function addInfoHeritage (
    info: Partial<(ClassInfo|InterfaceInfo)>,
    node: (TS.ClassDeclaration|TS.InterfaceDeclaration),
    project: Project
): void {

    if (!node.heritageClauses) {
        return;
    }

    const _program = project.program;
    const _referenceTypes: Array<InfoType> = [];
    const _addReferenceType = (_type: TS.ExpressionWithTypeArguments): void => {
        const _heritageType = nodesInfoType(project, _type);
        if (_heritageType) {
            _referenceTypes.push(_heritageType);
        }
    };

    let _classHeritage: (InfoType|undefined);

    for (const _heritageClause of node.heritageClauses) {

        if (
            _heritageClause.token === TS.SyntaxKind.ExtendsKeyword &&
            TS.isClassDeclaration(node)
        ) {
            if (_heritageClause.types.length === 1) {
                _addReferenceType(_heritageClause.types[0]);
                _classHeritage = _referenceTypes.pop();
            }
            continue;
        }

        for (const _heritageType of _heritageClause.types) {
            _addReferenceType(_heritageType);
        }

    }

    if (info.kind === 'Class') {
        if (_classHeritage) {
            info.extends = _classHeritage;
        }
        if (_referenceTypes.length) {
            info.implements = _referenceTypes;
        }
    } else {
        if (_referenceTypes.length) {
            info.extends = _referenceTypes;
        }
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
    info: Partial<(CodeInfo|InfoType)>,
    node: (TS.Node|undefined),
    project: Project
): void {

    if (typeof info === 'string') {
        return;
    }

    if (node) {
        const _location = nodesLocation(node);

        info.meta = {
            column: _location.column,
            file: nodesProjectPath(project, node),
            line: _location.line,
            syntax: node.kind
        };
    } else {
        info.meta = {
            column: 1,
            file: '',
            line: 1,
            syntax: TS.SyntaxKind.Unknown
        };
    }

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
    targetInfos: Array<CodeInfo>
): void {

    if (parentInfo.kind !== 'Namespace') {
        return;
    }

    for (const _info of targetInfos) {

        if (
            !_info ||
            typeof _info !== 'object' ||
            _info.kind === 'Property'
        ) {
            continue;
        }

        if (!_info.scope) {
            _info.scope = parentInfo.scope || parentInfo.name;
        }

        if (_info.kind == 'Namespace') {
            addInfoScopes(_info, _info.members);
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
 * [TS] Writes an error message with a source path to given node.
 *
 * @param message
 * Error message to write.
 *
 * @param node
 * Node to point to.
 */
export function error(
    message: string,
    node: TS.Node
): void {
    const _fileName = Path.resolve(node.getSourceFile().fileName);
    const _location = nodesLocation(node);

    console.error(
        message,
        `\n  in ${_fileName}:${_location.line}:${_location.column}`
    );
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
        return;
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
    info: (CodeInfo|InfoDoclet|SourceInfo)
): (string|undefined) {
    let _name: (string|undefined);

    switch (info.kind) {
        case 'Class':
        case 'Enumeration':
        case 'Function':
        case 'Interface':
        case 'Namespace':
        case 'Property':
        case 'TypeAlias':
        case 'Variable':
            return info.name;
        case 'Source':
            return info.file;
        default:
            _name = extractTagText(info, 'optionparent', true);
            if (typeof _name === 'string') {
                return _name;
            }
            return (
                extractTagText(info, 'apioption', true) ||
                extractTagText(info, 'function', true) ||
                extractTagText(info, 'name', true)
            );
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
    doclet: InfoDoclet,
    tag: string
): Array<DocletTag> {
    const _objects: Array<DocletTag> = [];

    let _inset: (string|undefined);
    let _match: (RegExpMatchArray|null);
    let _object: DocletTag;

    for (let _text of (doclet[tag] || [])) {
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
        doclet[tag]
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
 * Retrieved text.
 */
export function extractTagText (
    doclet: (InfoDoclet|undefined),
    tag: string,
    allOrInset: (boolean|string) = false
): string {
    const _tagText = doclet?.[tag];

    if (!_tagText?.length) {
        return '';
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
 * @deprecated
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
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Class',
        name: symbolsName(_program, _symbol),
        members: [],
        symbol: _symbol
    } as unknown as ClassInfo;

    addInfoGenerics(_info, node, project);
    addInfoHeritage(_info, node, project);
    addChildInfos(project, _info.members, symbolsChildren(_program, _symbol));
    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

    return _info;
}


/**
 * Retrieves enumeration information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be an enumeration.
 *
 * @return
 * Enumeration information or `undefined`.
 */
function getEnumerationInfo (
    project: Project,
    node: TS.Node
): (EnumerationInfo|undefined) {

    if (!TS.isEnumDeclaration(node)) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Enumeration',
        name: symbolsName(_program, _symbol),
        members: [],
        symbol: _symbol
    } as unknown as EnumerationInfo;

    addChildInfos(project, _info.members, node.members);
    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

    return _info;
}


/**
 * Retrieves function information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a function.
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
        !TS.isFunctionTypeNode(node) &&
        !TS.isGetAccessorDeclaration(node) &&
        !TS.isMethodDeclaration(node) &&
        !TS.isMethodSignature(node) &&
        !TS.isSetAccessorDeclaration(node)
    ) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Function',
        name: symbolsName(_program, _symbol),
        symbol: _symbol
    } as FunctionInfo;

    addInfoGenerics(_info, node, project);

    if (node.parameters) {
        const _parameters: Array<VariableInfo> = _info.parameters = [];

        let _variableInfo: (VariableInfo|undefined);

        for (const _parameter of node.parameters) {
            _variableInfo = getVariableInfo(project, _parameter);
            if (_variableInfo) {
                _parameters.push(_variableInfo);
            }
        }

        if (_parameters.length) {
            _info.parameters = _parameters;
        }
    }

    const _returnType = node.type || TS.getJSDocReturnType(node);

    if (_returnType) {
        _info.return = nodesInfoType(project, _returnType);
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

    return _info;
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
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Interface',
        name: symbolsName(_program, _symbol),
        members: [],
        symbol: _symbol
    } as unknown as InterfaceInfo;

    addInfoGenerics(_info, node, project);
    addInfoHeritage(_info, node, project);
    addChildInfos(project, _info.members, symbolsChildren(_program, _symbol));
    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

    return _info;
}


/**
 * Retrieves namespace information from the given node.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node that might be a namespace.
 *
 * @return
 * Namespace or `undefined`.
 */
function getNamespaceInfo (
    project: Project,
    node: TS.Node
): (NamespaceInfo|undefined) {

    if (!TS.isModuleDeclaration(node)) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Namespace',
        name: symbolsName(_program, _symbol),
        members: [],
        symbol: _symbol
    } as unknown as NamespaceInfo;

    addChildInfos(project, _info.members, symbolsChildren(_program, _symbol));
    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

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
    configOrRootPath: string
): Project {
    const _program = tsProgram(configOrRootPath);
    const _folderPath = (
        Path.extname(configOrRootPath) ?
            Path.dirname(configOrRootPath):
            configOrRootPath
    );
    const _project: Project = {
        program: _program,
        rootPath: _folderPath,
        globalInfos: [],
        sourceInfos: [],
        infoLookup: new Map(),
    };

    const _sourceInfos = _project.sourceInfos;

    for (const _sourceFile of _program.getSourceFiles()) {
        if (
            !_program.isSourceFileDefaultLibrary(_sourceFile) &&
            !_program.isSourceFileFromExternalLibrary(_sourceFile)
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
): (FunctionInfo|PropertyInfo|undefined) {

    if (hasArrowFunction(node)) {
        return getFunctionInfo(project, node);
    }

    if (
        !TS.isEnumMember(node) &&
        !TS.isPropertyDeclaration(node) &&
        !TS.isPropertySignature(node)
    ) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Property',
        name: symbolsName(_program, _symbol)
    } as PropertyInfo;

    if (TS.isEnumMember(node)) {
        _info.type = node.initializer?.getText();
    } else {
        _info.type = nodesInfoType(project, node.type);
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

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
    const _program = project.program;

    if (typeof sourceFile === 'string') {
        sourceFile = _program.getSourceFile(sourceFile)!;
    }

    const _symbol = nodesSymbol(_program, sourceFile);

    const _info = {
        kind: 'Source',
        file: Path.relative(
            project.rootPath,
            TS.sys.resolvePath(sourceFile.fileName)
        ),
        code: [],
        symbol: _symbol
    } as SourceInfo;

    if (_symbol) {
        addChildInfos(project, _info.code, symbolsChildren(_program, _symbol));
    }

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
): (FunctionInfo|TypeAliasInfo|undefined) {

    if (hasArrowFunction(node)) {
        return getFunctionInfo(project, node.type);
    }

    if (!TS.isTypeAliasDeclaration(node)) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'TypeAlias',
        name: symbolsName(_program, _symbol),
        symbol: _symbol
    } as TypeAliasInfo;

    _info.type = (
        nodesInfoType(project, node.type) ||
        nodesInfoType(project, TS.getJSDocType(node))
    );

    addInfoGenerics(_info, node, project);
    addInfoFlags(_info, node);
    addInfoMeta(_info, node, project);

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

    if (
        !TS.isVariableDeclaration(node)
    ) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Variable',
        name: symbolsName(_program, _symbol),
        symbol: _symbol
    } as VariableInfo;

    if (
        _symbol.declarations?.length === 1 &&
        TS.isTypeNode(_symbol.declarations[0])
    ) {
        const _infoType = nodesInfoType(project, _symbol.declarations[0]);

        if (_infoType) {
            _info.type = _infoType;
        }
    }

    if (!_info.type) {
        symbolsTypeToString(_program, _symbol)
    }

    if (TS.isVariableDeclarationList(node.parent)) {
        addInfoFlags(_info, node.parent.parent);
    } else {
        addInfoFlags(_info, node);
    }

    addInfoMeta(_info, node, project);

    return _info;
}


/**
 * [TS] Tests the given node for an arrow function type.
 *
 * @param node
 * Node to test.
 *
 * @return
 * `true` if it has an arrow function type, otherwise `false`.
 */
function hasArrowFunction(
    node: TS.Node
): node is TS.Node&{type: TS.FunctionTypeNode} {
    return (
        (
            TS.isPropertyDeclaration(node) ||
            TS.isPropertySignature(node) ||
            TS.isTypeAliasDeclaration(node)
        ) &&
        !!node.type &&
        TS.isFunctionTypeNode(node.type)
    );
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
 * [TS] Tests the given object for an node-like structure.
 *
 * @param obj
 * Object to test.
 *
 * @return
 * `true` if it is a Node, otherwise `false`.
 */
function isNode(
    obj: unknown
): obj is TS.Node {
    return (
        !!obj &&
        typeof obj === 'object' &&
        typeof (obj as TS.Node).getSourceFile === 'function' &&
        typeof (obj as TS.Node).kind === 'number'
    );
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
function nodesInfoType (
    project: Project,
    node: (TS.TypeNode|undefined)
): (InfoType|undefined) {

    if (!node) {
        return;
    }

    if (TS.isParenthesizedTypeNode(node)) {
        return nodesInfoType(project, node.type);
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (
        !_symbol ||
        !_symbol.declarations
    ) {
        return node.getText();
    }

    const _sourceFile = node.getSourceFile();

    if (
        !_program.isSourceFileDefaultLibrary(_sourceFile) &&
        !_program.isSourceFileFromExternalLibrary(_sourceFile)
    ) {

        if (TS.isArrayTypeNode(node)) {
            const _infoType = {
                kind: 'ArrayType',
                type: nodesInfoType(project, node.elementType),
                symbol: _symbol
            } as ArrayType;

            addInfoMeta(_infoType, node, project);

            return _infoType;
        }

        if (
            TS.isExpressionWithTypeArguments(node) ||
            (
                TS.isTypeReferenceNode(node) &&
                node.typeArguments
            )
        ) {
            const _innerSymbol = nodesSymbol(_program, (
                TS.isExpressionWithTypeArguments(node) ?
                    node.expression :
                    node
            ));

            if (
                _innerSymbol &&
                node.typeArguments
            ) {
                // Only process real generics, rest becomes references
                const _infoType = {
                    kind: 'GenericType',
                    name: _innerSymbol.name,
                    arguments: [],
                    symbol: _innerSymbol
                } as unknown as GenericType;

                let _argInfoType: (InfoType|undefined);

                for (const _arg of node.typeArguments) {
                    _argInfoType = nodesInfoType(project, _arg);
                    if (_argInfoType) {
                        _infoType.arguments.push(_argInfoType);
                    }
                }

                addInfoMeta(_infoType, node, project);

                return _infoType;
            }
        }

        if (
            TS.isConditionalTypeNode(node) ||
            TS.isIntersectionTypeNode(node) ||
            TS.isUnionTypeNode(node)
        ) {
            const _infoType = {
                kind: (
                    TS.isUnionTypeNode(node) ?
                        'UnionType' :
                        'IntersectionType'
                ),
                members: [],
                symbol: _symbol
            } as unknown as IntersectionType;

            const _isConditional = TS.isConditionalTypeNode(node);
            const _innerNodes = (
                _isConditional ?
                    [node.trueType, node.falseType] :
                    node.types
            );

            let _innerType: (InfoType|undefined);

            for (const _innerNode of _innerNodes) {
                _innerType = nodesInfoType(project, _innerNode);

                if (
                    _innerType &&
                    _innerType !== 'void'
                ) {
                    _infoType.members.push(_innerType);
                }
            }

            if (_isConditional) {
                _infoType.isConditional = true;
            }

            addInfoMeta(_infoType, node, project);

            return _infoType;
        }

        if (
            TS.isExpressionWithTypeArguments(node) ||
            TS.isIndexedAccessTypeNode(node) ||
            TS.isTypeQueryNode(node) ||
            TS.isTypeReferenceNode(node)
        ) {
            const _isTypeOf = (
                TS.isIndexedAccessTypeNode(node) ||
                TS.isTypeQueryNode(node)
            );
            const _type = (
                TS.isTypeQueryNode(node) ?
                    node.getText().substring(7) :
                    TS.isIndexedAccessTypeNode(node) ?
                        node.getText().replace(/\[(['"])(.*?)\1\]/gsu, '.$2') :
                        node.getText()
            );
            const _infoType = {
                kind: 'ReferenceType',
                type: _type,
                symbol: _symbol
            } as ReferenceType;

            if (_isTypeOf) {
                _infoType.isTypeOf = true;
                _infoType.type = _infoType.type.replace('typeof ', '');
            }

            addInfoMeta(_infoType, node, project);

            return _infoType;
        }

        if (
            TS.isMappedTypeNode(node) ||
            TS.isTypeLiteralNode(node)
        ) {
            const _infoType = {
                kind: 'ObjectType',
                members: [],
                symbol: _symbol
            } as unknown as ObjectType;

            if (TS.isMappedTypeNode(node)) {
                const _typeChecker = _program.getTypeChecker();
                addChildInfos(
                    project,
                    _infoType.members,
                    _typeChecker.getPropertiesOfType(
                        _typeChecker.getTypeFromTypeNode(node)
                    ),
                );
            } else {
                addChildInfos(project, _infoType.members, node.members || []);
            }

            addInfoMeta(_infoType, node, project);

            return _infoType;
        }

        if (TS.isThisTypeNode(node)) {
            const _infoType = {
                kind: 'ReferenceType',
                type: _symbol.name,
                symbol: _symbol
            } as ReferenceType;

            addInfoMeta(_infoType, node, project);

            return _infoType;
        }

        if (TS.isImportTypeNode(node) && node.qualifier) {
            return node.qualifier.getText();
        }

        error(`UNKNOWN TYPE: ${TS.SyntaxKind[node.kind]}`, node);

    }

    return sanitizeType(node.getText());
}


/**
 * [TS] Retrieves the location for the given node.
 *
 * @param program
 * Related parser program.
 *
 * @param node
 * Node to retrieve location for.
 *
 * @return
 * Retrieved location.
 */
function nodesLocation(
    node: TS.Node
): { column: number, line: number, start: number, end: number } {
    const _linesUntilPos = node
        .getSourceFile()
        .getFullText()
        .substring(0, node.getStart())
        .split(/\r?\n/gsu);
    const _line = _linesUntilPos.length;
    const _column = _linesUntilPos[_line - 1].length + 1;

    return {
        column: _column,
        end: node.getEnd(),
        line: _line,
        start: node.getStart()
    };
}


/**
 * Retrieves the project path for a given node. The path of external nodes
 * starts with `..`.
 *
 * @param project
 * Related project.
 *
 * @param node
 * Node to return project path for.
 *
 * @return
 * Project path for the given node.
 */
function nodesProjectPath(
    project: Project,
    node: TS.Node
): string {
    return Path.relative(
        Path.resolve(project.rootPath),
        Path.resolve(node.getSourceFile().fileName)
    );
}


/**
 * [TS] Retrieves the project symbol for the given node. This can be used for
 * project-wide reflection and requires some form of identity.
 *
 * @param program
 * Related parser program.
 *
 * @param node
 * Node to retrieve symbol from.
 *
 * @return
 * Retrieved symbol or `undefined`.
 */
function nodesSymbol(
    program: TS.Program,
    node: TS.Node
): (TS.Symbol|undefined) {

    if (
        TS.isIntersectionTypeNode(node) ||
        TS.isUnionTypeNode(node)
    ) {
        return nodesSymbol(program, node.types[0]);
    }

    if (TS.isParenthesizedTypeNode(node)) {
        return nodesSymbol(program, node.type);
    }

    const _typeChecker = program.getTypeChecker();

    let _symbol: (TS.Symbol|undefined);

    if (TS.isExportAssignment(node)) {
        _symbol = _typeChecker
            .getSymbolAtLocation(node.expression || node.name);
    } else if (TS.isExportSpecifier(node)) {
        _symbol = _typeChecker
            .getSymbolAtLocation(node.propertyName || node.name);
    } else if (TS.isImportTypeNode(node)) {
        _symbol = _typeChecker.getSymbolAtLocation(node.qualifier || node);
    } else if (TS.isSourceFile(node)) {
        _symbol = _typeChecker.getSymbolAtLocation(node);
    } else if (TS.isTypeQueryNode(node)) {
        _symbol = _typeChecker.getSymbolAtLocation(node.exprName);
    } else if (TS.isTypeReferenceNode(node)) {
        _symbol = _typeChecker.getSymbolAtLocation(node.typeName);
    } else if (TS.isTypeNode(node)) {
        _symbol = _typeChecker.getTypeFromTypeNode(node).getSymbol();
    } else {
        const _identifier = TS.getNameOfDeclaration(node as TS.Declaration);
        if (_identifier) {
            _symbol = _typeChecker.getSymbolAtLocation(_identifier);
        }
    }

    if (!_symbol) {
        return;
    }

    if (_symbol.flags & /* Bit operation */ TS.SymbolFlags.Alias) {
        _symbol = _typeChecker.getAliasedSymbol(_symbol)
    }

    return _typeChecker.getMergedSymbol(_symbol);
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
 * [TS] Retrieves all children for a given project symbol.
 *
 * @param program
 * Related parser program.
 *
 * @param symbol
 * Symbol to retrieve children for.
 *
 * @return
 * Retrieved children.
 */
function symbolsChildren(
    program: TS.Program,
    symbol: TS.Symbol
): Array<TS.Symbol> {
    const _type = symbolsType(program, symbol);
    const _typeChecker = program.getTypeChecker();

    if (symbol.flags & /* Bit operation */ TS.SymbolFlags.Module) {
        return _typeChecker.getExportsOfModule(symbol);
    }

    return _typeChecker.getPropertiesOfType(_type);
}


/**
 * [TS] Retrieves the name for a given project symbol. This works around default
 * exports.
 *
 * @param program
 * Related parser program.
 *
 * @param symbol
 * Symbol to retrieve name for.
 *
 * @return
 * Retrieved name.
 */
function symbolsName(
    program: TS.Program,
    symbol: TS.Symbol
): string {

    if (symbol.flags & /* Bit operation */ TS.SymbolFlags.Alias) {
        symbol = program.getTypeChecker().getAliasedSymbol(symbol);
    }

    return symbol.name;
}


/**
 * [TS] Retrieves the type for a given project symbol.
 *
 * @param program
 * Related parser program.
 *
 * @param symbol
 * Symbol to retrieve type for.
 *
 * @return
 * Retrieved type.
 */
function symbolsType(
    program: TS.Program,
    symbol: TS.Symbol
): TS.Type {
    return program.getTypeChecker().getDeclaredTypeOfSymbol(symbol);
}


/**
 * [TS] Retrieves the type string for a given project symbol.
 *
 * @param program
 * Related parser program.
 *
 * @param symbol
 * Symbol to retrieve type string for.
 *
 * @return
 * Retrieved type string.
 */
function symbolsTypeToString(
    program: TS.Program,
    symbol: TS.Symbol
): string {
    return program.getTypeChecker().typeToString(symbolsType(program, symbol));
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
    doclet: InfoDoclet,
    indent: (number|string) = 0
): string {

    if (typeof indent === 'number') {
        indent = ''.padEnd(indent, ' ');
    }

    if (indent[0] !== '\n') {
        indent = '\n' + indent;
    }

    const tags = Object.keys(doclet);

    let compiled = indent + '/**';

    if (
        doclet.description &&
        (
            doclet.description.length <= 1 ||
            doclet.description[1][0] !== '{'
        )
    ) {
        compiled += (
            indent + ' * ' +
            doclet.description
                .join('\n\n')
                .trim()
                .split('\n')
                .join(indent + ' * ')
        );
        tags.splice(tags.indexOf('description'), 1);
    }

    for (const tag of tags) {
        for (const text of doclet[tag]) {
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
 * Compiles project information into a JSON file.
 *
 * @see changeSourceCode
 *
 * @param project
 * Project information to compile.
 *
 * @param filePath
 * File path to save JSON into.
 */
export function toProjectJSON (
    project: Project,
    filePath: string
): void {
    FS.writeFileSync(filePath, JSON.stringify(
        project,
        (_key, value) => {
            if (typeof value?.flags !== 'number') {
                return value;
            }
        },
        2
    ), 'utf8');
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
