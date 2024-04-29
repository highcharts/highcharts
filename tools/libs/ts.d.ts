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
        object?: NodeInfo;
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


    type NodeInfo = (
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


    interface SourceInfo {
        code: Array<NodeInfo>;
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
     * Source information or exception.
     */
    function getSourceInfo(
        filePath: string,
        sourceCode: string,
        includeNodes?: boolean
    ): SourceInfo;


}


/* *
 *
 *  Default Export
 *
 * */


export default TSLib;
