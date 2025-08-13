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


export interface ClassInfo {
    doclet?: InfoDoclet;
    extends?: ReferenceType;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    implements?: Array<ReferenceType>;
    kind: 'Class';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    node: TS.ClassDeclaration;
}


export type CodeInfo = (
    | ClassInfo
    | FunctionInfo
    | InterfaceInfo
    | NamespaceInfo
    | PropertyInfo
    | TypeAliasInfo
    | VariableInfo
);


export interface InfoDoclet {
    [tag: string]: Array<string>
};


export interface DocletTag {
    isOptional?: boolean;
    name?: string;
    tag: string;
    text?: string;
    type?: Array<string>;
    value?: string;
}


export interface FunctionInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    inherited?: boolean;
    kind: 'Function';
    meta: InfoMeta;
    name: string;
    node: (
        | TS.ConstructorDeclaration
        | TS.FunctionDeclaration
        | TS.MethodDeclaration
    );
    parameters?: Array<VariableInfo>;
    return?: VariableType;
}


export type InfoFlag = (
    'async'|'abstract'|'assured'|'default'|'export'|
    'optional'|'private'|'protected'|'readonly'|'rest'|'static'
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
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    generics?: Array<TypeAliasInfo>;
    extends?: Array<VariableType>;
    kind: 'Interface';
    members: Array<MemberInfo>;
    meta: InfoMeta;
    name: string;
    node: TS.InterfaceDeclaration;
}


export interface IntersectionType {
    kind: 'IntersectionType';
    members: Array<VariableType>;
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
    node: TS.ModuleDeclaration;
}


export interface Project {
    infoLookup: Map<TS.Symbol, CodeInfo>;
    program: TS.Program;
    rootPath: string;
    sourceInfos: Array<SourceInfo>;
}


export interface PropertyInfo {
    doclet?: InfoDoclet;
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


export interface ReferenceType {
    kind: 'ReferenceType';
    meta: InfoMeta;
    name: string;
    symbol: TS.Symbol;
}


export interface SourceInfo {
    code: Array<CodeInfo>;
    file: string;
    kind: 'Source';
    node: TS.SourceFile;
}


export interface TypeAliasInfo {
    doclet?: InfoDoclet;
    fullNames: Array<string>;
    generics?: Array<TypeAliasInfo>;
    kind: 'TypeAlias';
    meta: InfoMeta;
    name: string;
    node: (TS.TypeAliasDeclaration|TS.TypeParameterDeclaration);
    value?: VariableType;
}


export interface VariableInfo {
    doclet?: InfoDoclet;
    flags?: Array<InfoFlag>;
    kind: 'Variable';
    meta: InfoMeta;
    name: string;
    node: (TS.ParameterDeclaration|TS.VariableDeclaration);
    type: VariableType;
}


export type VariableType = (string|IntersectionType|ReferenceType);


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
 * @param symbols
 * Child symbols to process and add.
 */
function addChildInfos (
    project: Project,
    infos: Array<CodeInfo>,
    symbols: Iterable<TS.Symbol>
): void {
    let _child: (CodeInfo|undefined);

    for (const _symbol of symbols) {

        _child = project.infoLookup.get(_symbol);

        if (_child) {
            infos.push(_child);
            continue;
        }

        if (!_symbol.declarations) {
            continue;
        }

        for (const declaration of _symbol.declarations) {
            _child = (
                getVariableInfo(project, declaration) ||
                getTypeAliasInfo(project, declaration) ||
                getPropertyInfo(project, declaration) ||
                getNamespaceInfo(project, declaration) ||
                getInterfaceInfo(project, declaration) ||
                getFunctionInfo(project, declaration) ||
                getClassInfo(project, declaration)
            );
            if (_child) {
                addInfoDoclet(_child, _symbol, project);
                infos.push(_child);
                _child = void 0;
                break;
            }

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
    
    if (!_commentParts) {
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

    for (const _part of symbol.getJsDocTags(_typeChecker)) {

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

    if (
        TS.isExportAssignment(node.parent) ||
        TS.isExportDeclaration(node.parent) &&
        (
            TS.getCombinedModifierFlags(node.parent) & // Bit operation
                TS.ModifierFlags.ExportDefault
        )
    ) {
        _flags.push('default');
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
        | TS.InterfaceDeclaration
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
            _info.value = nodesInfoType(
                project,
                TS.getEffectiveConstraintOfTypeParameter(_typeParameter)
            );
        }

        if (_typeParameter.default) {
            _info.value = nodesInfoType(project, _typeParameter.default);
        }

        addInfoFlags(_info, _typeParameter);
        addInfoMeta(_info, _typeParameter);

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
    const _referenceTypes: Array<ReferenceType> = [];
    const _addReferenceType = (_type: TS.ExpressionWithTypeArguments): void => {
        const _heritageSymbol = nodesSymbol(_program, _type);
        if (_heritageSymbol) {
            _referenceType = getReferenceType(project, _heritageSymbol);
            _referenceTypes.push(_referenceType);
        }
    };

    let _referenceType: ReferenceType;
    let _classHeritage: (ReferenceType|undefined);

    for (const _heritageClause of node.heritageClauses) {

        if (
            _heritageClause.token === TS.SyntaxKind.ExtendsKeyword &&
            TS.isClassDeclaration(node)
        ) {
            _addReferenceType(_heritageClause.types[0]);
            _classHeritage = _referenceTypes.pop();
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
    info: Partial<(CodeInfo|IntersectionType|ReferenceType)>,
    node?: TS.Node
): void {

    if (node) {
        info.meta = {
            begin: node.getStart(),
            end: node.getEnd(),
            file: node.getSourceFile().fileName,
            overhead: node.getLeadingTriviaWidth(),
            scope: '',
            syntax: node.kind
        };
    } else {
        info.meta = {
            begin: 0,
            end: 0,
            file: '',
            overhead: 0,
            scope: '',
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
    targetInfos: Array<CodeInfo|VariableType>
): void {
    const _scopePath = (
        parentInfo.kind === 'Source' ?
            '' :
            parentInfo.meta.scope ?
                `${parentInfo.meta.scope}.${parentInfo.name}` :
                parentInfo.name
    );

    for (const _info of targetInfos) {

        if (
            !_info ||
            typeof _info !== 'object'
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
        name: symbolsName(_program, _symbol)
    } as ClassInfo;

    addInfoGenerics(_info, node, project);
    addInfoHeritage(_info, node, project);
    addChildInfos(
        project,
        _info.members = [],
        symbolsChildren(_program, _symbol)
    );
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
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
        !TS.isGetAccessorDeclaration(node) &&
        !TS.isMethodDeclaration(node) &&
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
        name: symbolsName(_program, _symbol)
    } as FunctionInfo;

    addInfoGenerics(_info, node, project);

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

    const _returnType = node.type || TS.getJSDocReturnType(node);

    if (_returnType) {
        _info.return = nodesInfoType(project, _returnType);
    }

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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
        name: symbolsName(_program, _symbol)
    } as InterfaceInfo;

    addInfoGenerics(_info, node, project);
    addInfoHeritage(_info, node, project);
    addChildInfos(
        project,
        _info.members = [],
        symbolsChildren(_program, _symbol)
    );
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

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

    const _info: Partial<NamespaceInfo> = {
        kind: 'Namespace',
        name: symbolsName(_program, _symbol),
        members: []
    };

    addChildInfos(project, _info.members!, symbolsChildren(_program, _symbol));
    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info as NamespaceInfo;
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
        sourceInfos: [],
        infoLookup: new Map(),
    };
    const _absolutePath: string = Path.resolve(_folderPath);
    const _sourceInfos = _project.sourceInfos;

    for (const _sourceFile of _program.getSourceFiles()) {
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
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Property',
        name: symbolsName(_program, _symbol),
        type: nodesInfoType(project, node.type)
    } as PropertyInfo;

    addInfoFlags(_info, node);
    addInfoMeta(_info, node);

    return _info;
}


/**
 * Retrieves reference information from the given project symbol.
 *
 * @param project
 * Related project.
 *
 * @param symbol
 * Project symbol for reference.
 *
 * @return
 * Reference information.
 */
function getReferenceType (
    project: Project,
    symbol: TS.Symbol
): ReferenceType {
    const _program = project.program;
    const _info: Partial<ReferenceType> = {
        kind: 'ReferenceType',
        name: symbolsName(_program, symbol),
        symbol: symbol
    };

    addInfoMeta(_info, symbol.declarations?.[0])

    return _info as ReferenceType;
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

    const _info = {
        kind: 'Source',
        code: [],
        file: Path.relative(project.rootPath, TS.sys.resolvePath(sourceFile.fileName)),
        node: sourceFile
    } as SourceInfo;

    const _symbol = nodesSymbol(_program, sourceFile)!;

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
): (TypeAliasInfo|undefined) {

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
        name: symbolsName(_program, _symbol)
    } as TypeAliasInfo;

    _info.value = (
        nodesInfoType(project, node.type) ||
        nodesInfoType(project, TS.getJSDocType(node))
    );

    addInfoGenerics(_info, node, project);
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
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    const _info = {
        kind: 'Variable',
        name: symbolsName(_program, _symbol)
    } as VariableInfo;

    if (_symbol.declarations && TS.isTypeNode(_symbol.declarations[0])) {
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
): (VariableType|undefined) {

    if (
        !node ||
        !TS.isTypeNode(node)
    ) {
        return;
    }

    const _program = project.program;
    const _symbol = nodesSymbol(_program, node);

    if (!_symbol) {
        return;
    }

    if (TS.isParenthesizedTypeNode(node)) {
        return nodesInfoType(project, node.type);
    }

    if (TS.isIntersectionTypeNode(node)) {
        let _infoType = {
            kind: 'IntersectionType',
            members: [],
            symbol: _symbol
        } as unknown as IntersectionType;
        let _subType: (VariableType|undefined);

        for (const _subitem of node.types) {
            _subType = nodesInfoType(project, _subitem);

            if (
                _subType &&
                _subType !== 'void'
            ) {
                _infoType.members.push(_subType);
            }
        }

        addInfoMeta(_infoType, node);

        return _infoType;
    }

    if (TS.isTypeReferenceNode(node)) {
        const _infoType = {
            kind: 'ReferenceType',
            name: node.typeName.getText(),
            symbol: _symbol
        } as ReferenceType;

        addInfoMeta(_infoType, node);

        return _infoType;
    }

    return sanitizeType(node.getText());
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
    node: (
        | TS.Declaration
        | TS.Expression
        | TS.SourceFile
        | TS.TypeNode
        | TS.TypeReferenceNode
    )
): (TS.Symbol|undefined) {
    const _typeChecker = program.getTypeChecker();

    let _symbol: (TS.Symbol|undefined);

    if (TS.isSourceFile(node)) {
        _symbol = _typeChecker.getSymbolAtLocation(node);
    } else if (TS.isTypeNode(node)) {
        _symbol = _typeChecker.getTypeFromTypeNode(node).getSymbol();
    } else if (TS.isTypeReferenceNode(node)) {
        _symbol = _typeChecker.getSymbolAtLocation(node.typeName);
    } else {
        const _identifier = TS.getNameOfDeclaration(node);

        if (_identifier) {
            _symbol = _typeChecker.getSymbolAtLocation(_identifier);
        }
    }

    if (!_symbol) {
        return;
    }

    if (_symbol.flags & TS.SymbolFlags.Alias) {
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

    if (symbol.exports) {
        return Array.from(symbol.exports.values());
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

    if (symbol.flags & TS.SymbolFlags.Alias) {
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
