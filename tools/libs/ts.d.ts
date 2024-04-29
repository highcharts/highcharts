/*
 * Copyright (C) Highsoft AS
 */


/* *
 *
 *  Imports
 *
 * */


import type TS from 'typescript';


/* *
 *
 *  Declarations
 *
 * */


declare namespace TSLib {


    interface ClassInfo {
        doclet?: DocletInfo;
        extends?: string;
        flags?: Array<InfoFlag>;
        generics: Array<VariableInfo>;
        implements?: Array<string>;
        kind: 'Class';
        meta: MetaInfo;
        name: string;
        node?: TS.ClassDeclaration;
        properties: Array<PropertyInfo>
    }


    type CodeInfo = (
        | ClassInfo
        | DeconstructInfo
        | DocletInfo
        | ExportInfo
        | ImportInfo
        | InterfaceInfo
        | ObjectInfo
        | PropertyInfo
        | SourceInfo
        | VariableInfo
    );


    interface DeconstructInfo {
        deconstructs: Record<string, string>;
        doclet?: DocletInfo;
        flags?: Array<InfoFlag>;
        kind: 'Deconstruct';
        from?: string;
        meta: MetaInfo;
        node?: TS.VariableDeclaration;
        type?: string;
    }


    interface DocletInfo {
        kind: 'Doclet';
        meta: MetaInfo;
        node?: TS.JSDoc;
        tags: Record<string,Array<string>>;
    }


    interface ExportInfo {
        doclet?: DocletInfo;
        flags?: Array<InfoFlag>;
        kind: 'Export';
        name?: string;
        object?: CodeInfo;
        meta: MetaInfo;
        node?: TS.ImportDeclaration;
    }


    interface FunctionInfo {
        doclet?: DocletInfo;
        flags?: Array<InfoFlag>;
        generics?: Array<VariableInfo>;
        kind: 'Function';
        meta: MetaInfo;
        name: string;
        parameters?: Array<VariableInfo>;
        return?: string;
    }


    interface ImportInfo {
        doclet?: DocletInfo;
        imports: Record<string,string>;
        kind: 'Import';
        meta: MetaInfo;
        node?: TS.ImportDeclaration
        from: string;
    }


    type InfoFlag = (
        | 'async'
        | 'abstract'
        | 'declare'
        | 'default'
        | 'export'
        | 'private'
        | 'protected'
    );


    interface InterfaceInfo {
        doclet?: DocletInfo;
        extends?: Array<string>;
        flags?: Array<InfoFlag>;
        generics?: Array<VariableInfo>;
        kind: 'Interface';
        meta: MetaInfo;
        node?: TS.InterfaceDeclaration;
        name: string;
        properties: Array<PropertyInfo>;
    }


    interface MetaInfo {
        begin: number;
        end: number;
        kind: 'Meta';
        overhead: number;
    }


    interface ObjectInfo {
        flags?: Array<InfoFlag>;
        kind: 'Object';
        meta: MetaInfo;
        node?: TS.Node;
        properties: Array<PropertyInfo>;
        type?: string;
    }


    interface PropertyInfo {
        doclet?: DocletInfo;
        flags?: Array<InfoFlag>;
        kind: 'Property';
        meta: MetaInfo;
        name: string;
        node?: (
            | TS.PropertyAssignment
            | TS.PropertyDeclaration
            | TS.PropertySignature
        );
        type?: string;
        value?: (bigint|boolean|null|number|string|ObjectInfo)
    }


    interface ResolvedInfo {
        kind: 'Resolved',
        path: string;
        resolvedInfo: CodeInfo;
        resolvedPath: string;
        type: string;
    }


    interface SourceInfo {
        code: Array<CodeInfo>;
        kind: 'Source';
        node?: TS.SourceFile;
        path: string;
    }


    interface VariableInfo {
        doclet?: DocletInfo;
        flags?: Array<InfoFlag>;
        kind: 'Variable';
        meta: MetaInfo;
        name: string;
        node?: TS.VariableDeclaration;
        type?: string;
        value?: (bigint|boolean|null|number|string|ObjectInfo);
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
        doclet: DocletInfo,
        tag: string,
        text?: string
    ): DocletInfo;


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
    function changeSourceCode(
        sourceCode: string,
        replacements: Array<[begin: number, end: number, replacement: string]>
    ): string;


    /**
     * Logs debug information for a node and its children into the console.
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
    function debug(
        node: TS.Node,
        depth?: number,
        indent?: string
    ): void;


    /**
     * [TS] Retrieve child informations.
     *
     * @param nodes
     * Child nodes to extract from.
     *
     * @param includeNodes
     * Whether to include the TypeScript nodes in the information.
     *
     * @return
     * Retrieved child informations.
     */
    function getChildInfos(
        nodes: Array<TS.Node>,
        includeNodes?: boolean
    ): Array<CodeInfo>;


    /**
     * [TS] Retrieves all logical children and skips statement tokens.
     *
     * @param node
     * Node to retrieve logical children from.
     *
     * @return
     * Array of logical children.
     */
    function getNodesChildren(
        node: TS.Node
    ): Array<TS.Node>;


    /**
     * Retrieves source information from the given file source.
     *
     * @param filePath
     * Path to source file.
     *
     * @param sourceCode
     * Code of source file.
     *
     * @param includeNodes
     * Whether to include the TypeScript nodes in the information.
     *
     * @return
     * Source information.
     */
    function getSourceInfo(
        filePath: string,
        sourceCode: string,
        includeNodes?: boolean
    ): SourceInfo;


    /**
     * Retrieves the last text of the specified tag from a DocletInfo object.
     *
     * @param doclet
     * Doclet information to retrieve from.
     *
     * @param tag
     * Tag to retrieve.
     *
     * @return
     * Retrieved text or `undefined`.
     */
    function getTagText(
        doclet: DocletInfo,
        tag: string
    ): (string|undefined);


    /**
     * Tests if a text string starts with upper case.
     *
     * @param text
     * Text string to test.
     *
     * @return
     * `true`, if text string starts with upper case.
     */
    function isCapitalCase(
        text: string
    ): boolean;


    /**
     * Tests if a type is integrated into TypeScript.
     *
     * @param type
     * Type to test.
     *
     * @return
     * `true`, if type is integrated into TypeScript.
     */
    function isNativeType(
        type: string
    ): boolean;


    /**
     * Merge multiple DocletInfo objects into the first.
     *
     * @param targetDoclet
     * Doclet information to add to.
     *
     * @param sourceDoclets
     * Doclet informations to add.
     *
     * @return
     * First DocletObject as reference.
     */
    function mergeDocletInfos(
        targetDoclet?: DocletInfo,
        ...sourceDoclets: Array<DocletInfo>
    ): DocletInfo;


    /**
     * Creates a new DocletInfo object.
     *
     * @param template
     * Doclet information to apply.
     *
     * @return
     * The new doclet information.
     */
    function newDocletInfo(
        template?: DocletInfo
    ): DocletInfo;


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
    function removeTag(
        doclet: DocletInfo,
        tag: string
    ): Array<string>;


    /**
     * Resolves type relative to the given source information.
     *
     * @param sourceInfo
     * Source information to use.
     *
     * @param type
     * Type to resolve to.
     *
     * @return
     * Resolve information.
     */
    function resolveType(
        sourceInfo: SourceInfo,
        type: string
    ): ResolvedInfo;


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
    function toDocletString(
        doclet: DocletInfo,
        indent?: (number|string)
    ): string;

    /**
     * Converts any tree to a JSON string, while converting TypeScript nodes to raw
     * code.
     *
     * @param jsonTree
     * Tree to convert.
     *
     * @param indent
     * Indent option.
     *
     * @return
     * Converted JSON string.
     */
    function toJSONString(
        jsonTree: unknown,
        indent?: string
    ): string;


    /**
     * [TS] Reflects a node kind to a primitive type.
     *
     * @param node
     * Node to reflect.
     *
     * @return
     * Reflected primitive type or `undefined`.
     */
    function toTypeof(
        node: TS.Node
    ): (string|undefined);


}


/* *
 *
 *  Default Export
 *
 * */


export default TSLib;
