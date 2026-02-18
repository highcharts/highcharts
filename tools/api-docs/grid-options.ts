/* *
 *
 *  Creating Grid API options documentation from TypeScript interface sources.
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import FS from 'node:fs';

import * as Path from 'node:path';

import FSLib from '../libs/fs.js';

import GitLib from '../libs/git.js';

import LogLib from '../libs/log.js';

import TreeLib from '../libs/tree.js';

import TSLib from '../libs/TS';

import Yargs from 'yargs';


/* *
 *
 *  Declarations
 *
 * */


interface Args {
    debug?: boolean;
    source?: string;
}


/* *
 *
 *  Constants
 *
 * */


const DEFAULT_SOURCE = FSLib.path('ts/Grid/');


const STACK: Array<TSLib.CodeInfo> = [];


const TREE: TreeLib.Options = {};

interface RendererOptionSpec {
    interfaceName: string;
    typeName: string;
}

const VIEW_RENDERER_OPTIONS: Array<RendererOptionSpec> = [
    { interfaceName: 'TextRendererOptions', typeName: 'text' },
    { interfaceName: 'CheckboxRendererOptions', typeName: 'checkbox' },
    { interfaceName: 'SelectRendererOptions', typeName: 'select' },
    { interfaceName: 'SparklineRendererOptions', typeName: 'sparkline' },
    { interfaceName: 'TextInputRendererOptions', typeName: 'textInput' },
    { interfaceName: 'DateInputRendererOptions', typeName: 'dateInput' },
    { interfaceName: 'DateTimeInputRendererOptions', typeName: 'dateTimeInput' },
    { interfaceName: 'TimeInputRendererOptions', typeName: 'timeInput' },
    { interfaceName: 'NumberInputRendererOptions', typeName: 'numberInput' }
];

const EDIT_RENDERER_OPTIONS: Array<RendererOptionSpec> = [
    { interfaceName: 'CheckboxRendererOptions', typeName: 'checkbox' },
    { interfaceName: 'SelectRendererOptions', typeName: 'select' },
    { interfaceName: 'TextInputRendererOptions', typeName: 'textInput' },
    { interfaceName: 'DateInputRendererOptions', typeName: 'dateInput' },
    { interfaceName: 'DateTimeInputRendererOptions', typeName: 'dateTimeInput' },
    { interfaceName: 'TimeInputRendererOptions', typeName: 'timeInput' },
    { interfaceName: 'NumberInputRendererOptions', typeName: 'numberInput' }
];


/* *
 *
 *  Functions
 *
 * */


/**
 * Walk the root `Options` interface in `ts/Grid/Core/Options.ts` and add
 * each member as a top-level tree node.
 */
function addGridOptions(
    sourceInfo: TSLib.SourceInfo,
    debug?: boolean
): void {
    const rootNode = getTreeNode('');

    for (const info of sourceInfo.code) {
        if (
            info.kind === 'Interface' &&
            info.name === 'Options' &&
            info.doclet
        ) {
            for (const member of info.members) {
                addTreeNode(sourceInfo, rootNode, member, debug);
            }
        }
    }
}


/**
 * Add a tree node from a CodeInfo, resolving references to `*Options`
 * interfaces and recursing into their members.
 *
 * Adapted from api-options.ts `addTreeNode()`.
 */
function addTreeNode(
    sourceInfo: TSLib.SourceInfo,
    parentNode: TreeLib.Option,
    info: TSLib.CodeInfo,
    debug?: boolean
): void {
    const _infoDoclet = (
        info.kind === 'Doclet' ?
            info :
            info.doclet || TSLib.newDocletInfo()
    );
    const _parentName = parentNode.meta.fullname;

    let _fullname: (string | undefined) = TSLib.extractInfoName(info);

    if (typeof _fullname === 'undefined') {
        return;
    }

    _fullname = getGridOptionName(_fullname);

    if (_fullname.startsWith('_')) {
        return;
    }

    // Skip @private and @internal members
    if (
        _infoDoclet.tags &&
        (
            _infoDoclet.tags.private ||
            _infoDoclet.tags.internal
        )
    ) {
        return;
    }

    let _inlineObjectTypes: Array<string> = [];
    let _moreInfos: Array<TSLib.CodeInfo> = [];
    let _resolved: TSLib.CodeInfo;
    let _value: TSLib.Value;

    switch (info.kind) {

        default:
            break;

        case 'Interface':
            for (const _member of info.members) {
                addTreeNode(sourceInfo, parentNode, _member, debug);
            }
            return;

        case 'Object':
            for (const _member of info.members) {
                addTreeNode(sourceInfo, parentNode, _member, debug);
            }
            return;

        case 'Property':
        case 'Variable':
            if (
                info.kind === 'Property' &&
                _parentName
            ) {
                _fullname = `${_parentName}.${_fullname}`;
            }
            if (info.type) {
                for (const _type of info.type) {
                    const resolvedInterface = resolveTypeToInterface(
                        sourceInfo, _type, info
                    );
                    if (resolvedInterface) {
                        _moreInfos.push(resolvedInterface);
                        continue;
                    }

                    // Handle inline object types: { prop?: type; ... }
                    if (_type.startsWith('{')) {
                        _inlineObjectTypes.push(_type);
                    }
                }
            }
            if (
                !_infoDoclet.tags.type &&
                info.type
            ) {
                // Replace inline object type strings with 'Object' in
                // the type tag to keep doclet types clean.
                _infoDoclet.tags.type = info.type.map(
                    t => t.startsWith('{') ? 'Object' : t
                );
            }
            _value = info.value;
            if (
                !_infoDoclet.tags.default &&
                !_infoDoclet.tags.defaultvalue &&
                _value
            ) {
                _infoDoclet.tags.default = [];
                if (typeof _value === 'object') {
                    switch (_value.kind) {

                        default:
                            break;

                        case 'Array':
                            _infoDoclet.tags.default
                                .push(`[${_value.value.join(',')}]`);
                            break;

                        case 'Object':
                            _infoDoclet.tags.default.push(
                                '{' + Object
                                    .entries(_value.members)
                                    .map(
                                        _entry =>
                                            `${_entry[0]}:${_entry[1]}`
                                    )
                                    .join(',') + '}'
                            );
                            break;

                    }
                } else {
                    _infoDoclet.tags.default.push(`${_value}`);
                }
            }
            if (typeof _value !== 'object') {
                break;
            }
            if (_value.kind === 'FunctionCall') {
                if (
                    _value.name !== 'merge' ||
                    !_value.arguments
                ) {
                    return;
                }
                for (const _argument of _value.arguments) {
                    if (typeof _argument !== 'object') {
                        continue;
                    }
                    if (_argument.kind === 'Object') {
                        _moreInfos.push(..._argument.members);
                        continue;
                    }
                    if (_argument.kind === 'Reference') {
                        _resolved =
                            TSLib.resolveReference(sourceInfo, _argument);
                        if (_resolved) {
                            _moreInfos.push(_resolved);
                        }
                    }
                }
                break;
            }
            if (_value.kind === 'Object') {
                _moreInfos.push(..._value.members);
                for (const _type of (_value.type || [])) {
                    if (!_type.endsWith('Options')) {
                        continue;
                    }
                    _resolved = TSLib.resolveReference(sourceInfo, _type);
                    if (
                        _resolved &&
                        _resolved.kind !== 'Doclet'
                    ) {
                        _moreInfos.push(_resolved);
                    }
                }
                break;
            }
            break;

        case 'Reference':
            _resolved = TSLib.resolveReference(sourceInfo, info);
            if (_resolved) {
                addTreeNode(sourceInfo, parentNode, _resolved, debug);
            }
            break;

    }

    const _treeNode = getTreeNode(_fullname);
    const _nodeDoclet = _treeNode.doclet;
    const _nodeMeta = _treeNode.meta;

    let _array: Array<Record<string, (string | Array<string>)>>;
    let _split: Array<string>;

    for (const _tag of Object.keys(_infoDoclet.tags)) {
        switch (_tag) {

            default:
                if (_infoDoclet.tags[_tag].length > 1) {
                    _nodeDoclet[_tag] =
                        _infoDoclet.tags[_tag].slice();
                } else {
                    _nodeDoclet[_tag] = _infoDoclet.tags[_tag][0];
                }
                break;

            case 'default':
            case 'defaultvalue':
                let _defaultValue: (boolean | number | string | undefined) =
                    TSLib.extractTagText(_infoDoclet, _tag, true);

                if (typeof _defaultValue !== 'undefined') {
                    _defaultValue = normalizeDefaultValue(_defaultValue);

                    if (
                        typeof _defaultValue === 'string' &&
                        !isNaN(Number(_defaultValue))
                    ) {
                        _defaultValue = Number(_defaultValue);
                    } else if (typeof _defaultValue === 'string') {
                        _defaultValue = ({
                            false: false,
                            null: null,
                            true: true
                        } as Record<string, any>)[_defaultValue] ||
                            _defaultValue;
                    } else {
                        _defaultValue = _defaultValue;
                    }

                    _nodeDoclet.defaultvalue = _defaultValue;
                    _nodeMeta.default = _defaultValue;
                }
                break;

            case 'description':
                _nodeDoclet[_tag] =
                    formatJSDocLinks(
                        TSLib.extractTagText(_infoDoclet, _tag, true) || ''
                    );
                break;

            case 'extends':
                _nodeDoclet[_tag] =
                    TSLib.extractTagText(_infoDoclet, _tag);
                break;

            case 'productdesc':
                _array = _nodeDoclet.productdescs = [];
                for (
                    const _object
                    of TSLib.extractTagObjects(_infoDoclet, 'productdesc')
                ) {
                    if (_object.type) {
                        _array.push({
                            products: _object.type,
                            value: _object.text
                        });
                    }
                }
                break;

            case 'requires':
            case 'see':
                _nodeDoclet[_tag] = _infoDoclet.tags[_tag].slice();
                break;

            case 'sample':
                _array = _nodeDoclet[`${_tag}s`] = [];
                for (
                    const _object
                    of TSLib.extractTagObjects(_infoDoclet, 'sample')
                ) {
                    const _sample: TreeLib.OptionDocletSample = {
                        name: _object.name || _object.text,
                        value: _object.value || ''
                    };
                    if (_object.type) {
                        _sample.products = _object.type.slice();
                    }
                    _array.push(_sample);
                }
                break;

            case 'type':
                // Type strings may come from JSDoc `@type {X}` (with
                // braces) or from TypeScript type annotations (bare).
                // Use extractTagInset for braced types, fall back to
                // the raw string for bare types.
                _split = TSLib.extractTypes(
                    _infoDoclet.tags.type
                        .map(
                            (_type: string) =>
                                TSLib.extractTagInset(_type) || _type
                        )
                        .join('|'),
                    true
                );
                if (_split) {
                    _nodeDoclet.type = {
                        names: _split.map(_type => _type
                            .replace(
                                /^(?:DeepPartial|Partial)<(.*)>$/gsu,
                                '$1'
                            )
                            .replace(/\bany\b/gsu, '*')
                        )
                    };
                }
                break;

        }
    }

    appendDeprecationToDescription(_infoDoclet, _nodeDoclet);

    // Expand callback type aliases to show the actual function signature
    expandCallbackTypes(sourceInfo, _nodeDoclet, info);
    expandRendererOptionChildren(_nodeDoclet, _treeNode, debug);
    expandDataProviderOptionChildren(
        sourceInfo, info, _nodeDoclet, _treeNode, debug
    );

    for (const _moreInfo of _moreInfos) {

        if (STACK.includes(_moreInfo)) { // Break recursive option trees
            continue;
        }

        STACK.push(_moreInfo);

        addTreeNode(
            TSLib.getSourceInfo(_moreInfo.meta.file, void 0, debug),
            _treeNode,
            _moreInfo
        );

        STACK.pop();

    }

    // Process inline object types (e.g., csv?: { decimalPoint?: string; })
    for (const _inlineType of _inlineObjectTypes) {
        parseInlineObjectType(_inlineType, _treeNode);
    }

}


/**
 * Try to resolve a type string to an Interface CodeInfo whose members
 * should become children of the current tree node.
 *
 * Handles:
 * - Simple type names: `FooOptions`
 * - Generics: `Array<Foo>`, `Partial<Foo>`, `DeepPartial<Foo>`
 * - Array shorthand: `Foo[]`
 * - Indexed access: `Foo['bar']`
 * - Type aliases (one level of indirection)
 */
/**
 * Find a TypeAlias by name in a source's code array.
 * `resolveReference` follows aliases instead of returning them, so
 * we need a direct lookup.
 */
function findTypeAlias(
    sourceInfo: TSLib.SourceInfo,
    name: string
): TSLib.CodeInfo | undefined {
    for (const code of sourceInfo.code) {
        if (code.kind === 'TypeAlias' && code.name === name) {
            return code;
        }
    }
    return void 0;
}

function findInterfaceInfoByName(
    name: string
): { info: TSLib.CodeInfo; sourceInfo: TSLib.SourceInfo } | undefined {
    for (const sourceKey of Object.keys(TSLib.SOURCE_CACHE)) {
        const sourceInfo = TSLib.SOURCE_CACHE[sourceKey];

        for (const code of sourceInfo.code) {
            if (code.kind === 'Interface' && code.name === name) {
                return { info: code, sourceInfo };
            }
        }
    }

    return void 0;
}

function normalizeDefaultValue(
    value: (boolean | number | string)
): (boolean | number | string) {
    if (typeof value !== 'string') {
        return value;
    }

    let normalized = value
        .replace(/\s*\/\/\s*eslint-disable-line.*$/u, '')
        .trim();

    const quoted = normalized.match(/^(['"])([\s\S]*)\1$/u);
    if (quoted) {
        normalized = quoted[2]
            .replace(/\\'/gu, '\'')
            .replace(/\\"/gu, '"');
        return normalized;
    }

    return normalized;
}

function formatJSDocLinks(
    text: string
): string {
    return text.replace(
        /\{@link\s+([^}\s|]+)(?:\s*\|\s*([^}]+)|\s+([^}]+))?\}/gu,
        (_match, target: string, pipeLabel?: string, spaceLabel?: string) => {
            const href = target.trim();
            const label = (pipeLabel || spaceLabel || href).trim();

            if (/^https?:\/\//u.test(href)) {
                return `<a href="${href}">${label}</a>`;
            }

            return label;
        }
    );
}

function appendDeprecationToDescription(
    infoDoclet: TSLib.DocletInfo,
    nodeDoclet: Record<string, any>
): void {
    if (!infoDoclet.tags.deprecated) {
        return;
    }

    const deprecatedText = (
        TSLib.extractTagText(infoDoclet, 'deprecated', true) || ''
    ).trim();
    const deprecatedHTML = deprecatedText ?
        `<p><em>Deprecated:</em> ${deprecatedText}</p>` :
        '<p><em>Deprecated.</em></p>';
    const existingDescription = nodeDoclet.description || '';

    if (!existingDescription.includes('Deprecated:')) {
        nodeDoclet.description = existingDescription + deprecatedHTML;
    }
}

function expandRendererOptionChildren(
    nodeDoclet: Record<string, any>,
    treeNode: TreeLib.Option,
    debug?: boolean
): void {
    const typeNames = nodeDoclet.type?.names;

    if (!Array.isArray(typeNames)) {
        return;
    }

    const specs = (
        typeNames.includes('EditModeRendererType[\'options\']') ?
            EDIT_RENDERER_OPTIONS :
            typeNames.includes('CellRendererType[\'options\']') ?
                VIEW_RENDERER_OPTIONS :
                void 0
    );

    if (!specs) {
        return;
    }

    // Render renderer type branches as array items in the left sidebar,
    // analogous to how `series` options are presented in Core docs.
    nodeDoclet.supportsArray = true;

    for (const spec of specs) {
        const interfaceInfo = findInterfaceInfoByName(spec.interfaceName);

        if (!interfaceInfo) {
            continue;
        }

        const { info, sourceInfo } = interfaceInfo;

        if (info.kind !== 'Interface') {
            continue;
        }

        // Group renderer-specific options by renderer type, similar to
        // how Highcharts Core groups series options by series type.
        const typeNode = getTreeNode(`${treeNode.meta.fullname}.${spec.typeName}`);
        if (!typeNode.doclet.description) {
            const interfaceDesc = (
                info.doclet &&
                TSLib.extractTagText(info.doclet, 'description', true)
            ) || '';

            typeNode.doclet.description = interfaceDesc || (
                `Options for renderer type <code>'${spec.typeName}'</code>.`
            );
        }

        let hasTypeSpecificMembers = false;
        for (const member of info.members) {
            // `type` is already represented by the synthetic renderer branch
            // label: `{ type: "<rendererType>", ... }`.
            if (TSLib.extractInfoName(member) === 'type') {
                continue;
            }
            hasTypeSpecificMembers = true;
            addTreeNode(sourceInfo, typeNode, member, debug);
        }

        // Keep type branches expandable even when a renderer has no
        // extra options besides `type`, but avoid rendering `undefined`.
        if (!hasTypeSpecificMembers) {
            const typeMember = info.members.find(
                member => TSLib.extractInfoName(member) === 'type'
            );

            if (typeMember) {
                addTreeNode(sourceInfo, typeNode, typeMember, debug);
                const typeValueNode = findTreeNode(`${typeNode.meta.fullname}.type`);

                if (typeValueNode) {
                    typeValueNode.doclet.defaultvalue = `'${spec.typeName}'`;
                }
            }
        }
    }
}

function getDataProviderOptionInterfaces(
    sourceInfo: TSLib.SourceInfo,
    info: TSLib.CodeInfo
): Array<{
    providerType: string;
    interfaceInfo: TSLib.CodeInfo;
    sourceInfo: TSLib.SourceInfo;
}> {
    const results: Array<{
        providerType: string;
        interfaceInfo: TSLib.CodeInfo;
        sourceInfo: TSLib.SourceInfo;
    }> = [];
    const seen = new Set<string>();

    for (const sourceKey of Object.keys(TSLib.SOURCE_CACHE)) {
        const registrySource = TSLib.SOURCE_CACHE[sourceKey];

        for (const code of registrySource.code) {
            if (
                code.kind !== 'Interface' ||
                code.name !== 'DataProviderTypeRegistry'
            ) {
                continue;
            }

            for (const member of code.members) {
                if (member.kind !== 'Property' || !member.type?.length) {
                    continue;
                }

                const providerType = member.name;
                const classType = member.type.find(
                    type => type.startsWith('typeof ')
                );

                if (!classType) {
                    continue;
                }

                const className = classType.replace(/^typeof\s+/u, '');
                const classInfo = tryResolve(registrySource, className, member);

                if (!classInfo || classInfo.kind !== 'Class') {
                    continue;
                }

                let optionsInterface: TSLib.CodeInfo | undefined;
                const optionsMember = classInfo.members.find(
                    classMember => (
                        classMember.kind === 'Property' &&
                        classMember.name === 'options' &&
                        (classMember as any).type?.length
                    )
                );

                if ((optionsMember as any)?.type?.[0]) {
                    optionsInterface = resolveTypeToInterface(
                        registrySource,
                        (optionsMember as any).type[0],
                        info
                    );
                }

                if (!optionsInterface) {
                    const fallbackName = `${className}Options`;
                    const fallback = findInterfaceInfoByName(fallbackName);
                    if (fallback) {
                        optionsInterface = fallback.info;
                    }
                }

                if (!optionsInterface || optionsInterface.kind !== 'Interface') {
                    continue;
                }

                const key = `${providerType}:${optionsInterface.name}`;
                if (seen.has(key)) {
                    continue;
                }
                seen.add(key);
                results.push({
                    providerType,
                    interfaceInfo: optionsInterface,
                    sourceInfo: TSLib.getSourceInfo(optionsInterface.meta.file)
                });
            }
        }
    }

    return results;
}

function expandDataProviderOptionChildren(
    sourceInfo: TSLib.SourceInfo,
    info: TSLib.CodeInfo,
    nodeDoclet: Record<string, any>,
    treeNode: TreeLib.Option,
    debug?: boolean
): void {
    const typeNames = nodeDoclet.type?.names;

    if (
        !Array.isArray(typeNames) ||
        !typeNames.includes('DataProviderOptionsType')
    ) {
        return;
    }

    const optionInterfaces = getDataProviderOptionInterfaces(sourceInfo, info);
    if (!optionInterfaces.length) {
        return;
    }

    // Render provider-specific branches as array items in the left sidebar,
    // analogous to how `series` options are presented in Core docs.
    nodeDoclet.supportsArray = true;

    for (const provider of optionInterfaces) {
        if (provider.interfaceInfo.kind !== 'Interface') {
            continue;
        }

        const providerNode = getTreeNode(
            `${treeNode.meta.fullname}.${provider.providerType}`
        );

        if (!providerNode.doclet.description) {
            const interfaceDesc = (
                provider.interfaceInfo.doclet &&
                TSLib.extractTagText(
                    provider.interfaceInfo.doclet,
                    'description',
                    true
                )
            ) || '';

            providerNode.doclet.description = interfaceDesc || (
                `Options for data provider type ` +
                `<code>'${provider.providerType}'</code>.`
            );
        }

        let hasProviderSpecificMembers = false;
        for (const member of provider.interfaceInfo.members) {
            if (TSLib.extractInfoName(member) === 'providerType') {
                continue;
            }
            hasProviderSpecificMembers = true;
            addTreeNode(provider.sourceInfo, providerNode, member, debug);
        }

        // Keep provider branches expandable even when a provider has no
        // extra options besides `providerType`, but avoid `undefined`.
        if (!hasProviderSpecificMembers) {
            const providerTypeMember = provider.interfaceInfo.members.find(
                member => TSLib.extractInfoName(member) === 'providerType'
            );

            if (providerTypeMember) {
                addTreeNode(provider.sourceInfo, providerNode, providerTypeMember, debug);
                const providerTypeNode = findTreeNode(
                    `${providerNode.meta.fullname}.providerType`
                );

                if (providerTypeNode) {
                    providerTypeNode.doclet.defaultvalue =
                        `'${provider.providerType}'`;
                }
            }
        }
    }
}


/**
 * Expand callback type alias names in the doclet's type field to show
 * the actual function signature. For example, `ColumnEventCallback` becomes
 * `(this: Column) => void`.
 *
 * This makes the API docs more informative for event callbacks where
 * users need to know what `this` context and parameters are available.
 */
function expandCallbackTypes(
    sourceInfo: TSLib.SourceInfo,
    nodeDoclet: Record<string, any>,
    info: TSLib.CodeInfo
): void {
    if (
        !nodeDoclet.type?.names ||
        !Array.isArray(nodeDoclet.type.names)
    ) {
        return;
    }

    const contextParts: Array<string> = [];

    nodeDoclet.type.names = nodeDoclet.type.names.map(
        (typeName: string) => {
            // Only expand names that look like callback type aliases
            // (PascalCase, end with Callback/Function, not a native type)
            if (
                !typeName.match(/^[A-Z]\w+(?:Callback|Function)$/) ||
                TSLib.isNativeType(typeName)
            ) {
                return typeName;
            }

            // resolveReference doesn't return TypeAlias directly
            // (it follows the alias). Search code arrays instead.
            const alias = findTypeAlias(sourceInfo, typeName) ||
                (info.meta.file !== sourceInfo.path ?
                    findTypeAlias(
                        TSLib.getSourceInfo(info.meta.file),
                        typeName
                    ) : undefined
                );

            if (!alias) {
                return typeName;
            }

            const aliasValue = (alias as any).value;
            if (!aliasValue) {
                return typeName;
            }

            // The value is an array of type strings
            const sig = Array.isArray(aliasValue) ?
                aliasValue.join('') : String(aliasValue);

            // Only expand if it looks like a function signature
            if (sig.includes('=>') || sig.includes('function')) {
                // Extract context info from the signature
                const callbackContext = parseCallbackSignature(sig);
                if (callbackContext) {
                    contextParts.push(callbackContext);
                }
                return sig;
            }

            return typeName;
        }
    );

    // Append callback context info to the description
    if (contextParts.length > 0) {
        const existing = nodeDoclet.description || '';
        nodeDoclet.description =
            existing + contextParts.join('');
    }
}


/**
 * Parse a callback function signature and return an HTML description
 * of the `this` context and parameters.
 *
 * Example input: `(this: Column, e: AnyRecord) => void`
 * Returns: `<p>Context: <code>this</code> refers to the ... </p>`
 */
function parseCallbackSignature(
    sig: string
): string | undefined {
    // Extract the parameter list from between parentheses
    const paramsMatch = sig.match(/^\(([^)]*)\)\s*=>/);
    if (!paramsMatch) {
        return void 0;
    }

    const paramStr = paramsMatch[1].trim();
    if (!paramStr) {
        return void 0;
    }

    const parts: Array<string> = [];
    let thisType: string | undefined;
    const params: Array<{ name: string; type: string }> = [];

    // Split by comma, handling simple cases
    for (const segment of paramStr.split(',')) {
        const trimmed = segment.trim();
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) {
            continue;
        }

        const name = trimmed.substring(0, colonIdx).trim();
        const type = trimmed.substring(colonIdx + 1).trim();

        if (name === 'this') {
            thisType = type;
        } else {
            params.push({ name, type });
        }
    }

    if (thisType) {
        parts.push(
            `<p>The <code>this</code> context refers to the ` +
            linkType(thisType) + ` instance.</p>`
        );
    }

    if (params.length > 0) {
        const paramItems = params.map(
            p => `<li><code>${p.name}</code> — ` +
                linkType(p.type) + `</li>`
        ).join('');
        parts.push(
            `<p>Callback parameters:</p><ul>${paramItems}</ul>`
        );
    }

    return parts.length > 0 ? parts.join('') : void 0;
}


/**
 * Wrap a type name in a `<code>` tag. The actual linking to the class
 * reference is handled at render time by `getClassReferenceUrl` in
 * api.js (post-processed to support Grid types).
 *
 * For the description HTML, we add a link that will resolve when served
 * alongside the TypeDoc class reference.
 */
function linkType(typeName: string): string {
    // Known Grid runtime classes that have TypeDoc pages
    const GRID_CLASSES: Record<string, string> = {
        Cell: 'Grid_Core_Table_Cell.Cell',
        Column: 'Grid_Core_Table_Column.Column',
        Grid: 'Grid_Core_Grid.Grid',
        HeaderCell: 'Grid_Core_Table_Header_HeaderCell.HeaderCell',
        Pagination: 'Grid_Core_Pagination_Pagination.Pagination',
        Table: 'Grid_Core_Table_Table.Table',
        TableCell: 'Grid_Core_Table_Body_TableCell.TableCell',
        TableRow: 'Grid_Core_Table_Body_TableRow.TableRow'
    };

    if (GRID_CLASSES[typeName]) {
        return `<a href="/grid/typedoc/classes/${GRID_CLASSES[typeName]}.html">` +
            `${typeName}</a>`;
    }

    return `<code>${typeName}</code>`;
}


function resolveTypeToInterface(
    sourceInfo: TSLib.SourceInfo,
    typeStr: string,
    info: TSLib.CodeInfo
): TSLib.CodeInfo | undefined {

    // 1. Unwrap generics: Array<T>, Partial<T>, DeepPartial<T>
    const genericMatch = typeStr.match(
        /^(?:Array|Partial|DeepPartial)<(.+)>$/
    );
    if (genericMatch) {
        return resolveTypeToInterface(sourceInfo, genericMatch[1], info);
    }

    // 2. Array shorthand: Foo[]
    const arrayShortMatch = typeStr.match(/^(\w+)\[\]$/);
    if (arrayShortMatch) {
        return resolveTypeToInterface(
            sourceInfo, arrayShortMatch[1], info
        );
    }

    // 3. Indexed access: Foo['bar']
    const indexedMatch = typeStr.match(/^(\w+)\['(\w+)'\]$/);
    if (indexedMatch) {
        return resolveIndexedAccessType(
            sourceInfo, indexedMatch[1], indexedMatch[2], info
        );
    }

    // 4. Union types: Foo|Bar — try each part
    if (typeStr.includes('|')) {
        for (const part of typeStr.split('|')) {
            const trimmed = part.trim();
            if (trimmed) {
                const result = resolveTypeToInterface(
                    sourceInfo, trimmed, info
                );
                if (result) {
                    return result;
                }
            }
        }
        return void 0;
    }

    // 5. Skip native/primitive types
    if (TSLib.isNativeType(typeStr)) {
        return void 0;
    }

    // 6. Direct resolution
    let resolved = tryResolve(sourceInfo, typeStr, info);

    if (!resolved) {
        return void 0;
    }

    // 7. Follow TypeAlias one level
    if (resolved.kind === 'TypeAlias') {
        return followTypeAlias(sourceInfo, resolved as any, info);
    }

    if (resolved.kind === 'Interface') {
        // Auto-extend to include inherited members
        TSLib.autoExtendInfo(resolved as TSLib.InterfaceInfo);
        return resolved;
    }

    return void 0;
}


/**
 * Try to resolve a type name from the current source or the member's
 * original source file (for augmented members).
 */
function tryResolve(
    sourceInfo: TSLib.SourceInfo,
    typeName: string,
    info: TSLib.CodeInfo
): TSLib.CodeInfo | undefined {
    let resolved = TSLib.resolveReference(sourceInfo, typeName);

    // Fallback for augmented members: try the member's source file
    if (
        !resolved &&
        info.meta.file &&
        info.meta.file !== sourceInfo.path
    ) {
        try {
            const memberSource = TSLib.getSourceInfo(info.meta.file);
            if (memberSource) {
                resolved = TSLib.resolveReference(memberSource, typeName);
            }
        } catch (e) {
            // Source file may not be loaded
        }
    }

    return resolved;
}


/**
 * Resolve an indexed access type like `Foo['bar']` by finding the
 * `bar` member of `Foo` and returning its type as an interface.
 */
function resolveIndexedAccessType(
    sourceInfo: TSLib.SourceInfo,
    baseTypeName: string,
    memberName: string,
    info: TSLib.CodeInfo
): TSLib.CodeInfo | undefined {
    const baseResolved = tryResolve(sourceInfo, baseTypeName, info);

    if (!baseResolved) {
        return void 0;
    }

    // Search candidate interfaces for the member
    const candidates: Array<TSLib.CodeInfo> = [];

    if (baseResolved.kind === 'Interface') {
        candidates.push(baseResolved);
    } else if (baseResolved.kind === 'TypeAlias') {
        // Extract type references from the alias value and try each
        collectInterfacesFromAlias(
            sourceInfo, baseResolved as any, info, candidates
        );
    }

    // Look for the member in each candidate interface
    for (const candidate of candidates) {
        if (!('members' in candidate)) {
            continue;
        }
        for (const member of (candidate as any).members) {
            if (
                member.kind === 'Property' &&
                member.name === memberName &&
                member.type
            ) {
                // Resolve the member's type to an interface
                for (const t of member.type) {
                    const result = resolveTypeToInterface(
                        TSLib.getSourceInfo(
                            candidate.meta.file, void 0
                        ),
                        t,
                        member
                    );
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }

    return void 0;
}


/**
 * Follow a TypeAlias to find an interface it references.
 */
function followTypeAlias(
    sourceInfo: TSLib.SourceInfo,
    aliasInfo: TSLib.CodeInfo & { value?: any },
    info: TSLib.CodeInfo
): TSLib.CodeInfo | undefined {
    if (!aliasInfo.value) {
        return void 0;
    }

    // The value of a TypeAlias can be a string or array of type names
    const typeNames: Array<string> = Array.isArray(aliasInfo.value) ?
        aliasInfo.value : [aliasInfo.value];

    for (const typeName of typeNames) {
        if (typeof typeName !== 'string' || TSLib.isNativeType(typeName)) {
            continue;
        }
        // Strip generics to get the base type name
        const baseMatch = typeName.match(/^(\w+)/);
        if (!baseMatch) {
            continue;
        }
        const resolved = tryResolve(sourceInfo, baseMatch[1], info);
        if (resolved && resolved.kind === 'Interface') {
            TSLib.autoExtendInfo(resolved as TSLib.InterfaceInfo);
            return resolved;
        }
    }

    return void 0;
}


/**
 * Collect interface references from a type alias definition.
 * Used for indexed access resolution on complex aliases like
 * `Extract<CellRendererType, EditModeRenderer>`.
 */
function collectInterfacesFromAlias(
    sourceInfo: TSLib.SourceInfo,
    aliasInfo: TSLib.CodeInfo & { value?: any },
    info: TSLib.CodeInfo,
    out: Array<TSLib.CodeInfo>
): void {
    if (!aliasInfo.value) {
        return;
    }

    const typeNames: Array<string> = Array.isArray(aliasInfo.value) ?
        aliasInfo.value : [aliasInfo.value];

    for (const typeName of typeNames) {
        if (typeof typeName !== 'string') {
            continue;
        }

        // Extract all identifiers from the type expression
        const identifiers = typeName.match(/\b[A-Z]\w+/g) || [];

        for (const id of identifiers) {
            if (TSLib.isNativeType(id)) {
                continue;
            }
            const resolved = tryResolve(sourceInfo, id, info);
            if (resolved) {
                if (resolved.kind === 'Interface') {
                    out.push(resolved);
                } else if (resolved.kind === 'Class') {
                    out.push(resolved);
                } else if (resolved.kind === 'TypeAlias') {
                    // Recurse one level
                    collectInterfacesFromAlias(
                        sourceInfo, resolved as any, info, out
                    );
                }
            }
        }
    }
}


/**
 * Parse an inline object type string (e.g., `{ prop?: type; ... }`) and
 * create child tree nodes under the given parent.
 *
 * The TS parser captures inline object types as raw strings including
 * embedded JSDoc comments. This function extracts properties and their
 * documentation.
 */
function parseInlineObjectType(
    typeStr: string,
    parentNode: TreeLib.Option
): void {
    // Strip outer braces
    const body = typeStr.replace(/^\{|\}$/g, '').trim();
    if (!body) {
        return;
    }

    // Split into segments by looking for property declarations.
    // Each property may be preceded by a JSDoc comment.
    // Pattern: optional JSDoc /** ... */ followed by propName?: type;
    const propRegex =
        /(?:\/\*\*([^]*?)\*\/\s*)?(\w+)\??\s*:\s*([^;]+);/g;

    let match: RegExpExecArray | null;

    while ((match = propRegex.exec(body)) !== null) {
        const jsDocBody = match[1] || '';
        const propName = match[2];
        const propType = match[3].trim();

        const fullname = parentNode.meta.fullname ?
            `${parentNode.meta.fullname}.${propName}` :
            propName;

        const childNode = getTreeNode(fullname);

        // Extract description from JSDoc (first non-tag text)
        const descMatch = jsDocBody.match(
            /^\s*\*?\s*((?:(?!@\w).)+)/s
        );
        if (descMatch) {
            const desc = descMatch[1]
                .replace(/\n\s*\*\s?/g, ' ')
                .trim();
            if (desc) {
                childNode.doclet.description = formatJSDocLinks(desc);
            }
        }

        // Extract @default value
        const defaultMatch = jsDocBody.match(
            /@default\s+(.+?)(?:\n|\*\/|$)/
        );
        if (defaultMatch) {
            let defaultVal: any = defaultMatch[1]
                .replace(/\s*\*?\s*$/, '')
                .replace(/^'(.*)'$/, '$1')
                .trim();

            if (!isNaN(Number(defaultVal))) {
                defaultVal = Number(defaultVal);
            } else if (defaultVal === 'true') {
                defaultVal = true;
            } else if (defaultVal === 'false') {
                defaultVal = false;
            } else if (defaultVal === 'null') {
                defaultVal = null;
            }

            childNode.doclet.defaultvalue = defaultVal;
            childNode.meta.default = defaultVal;
        }

        // Set type
        if (propType) {
            childNode.doclet.type = {
                names: TSLib.extractTypes(propType, true) || [propType]
            };
        }
    }
}


/**
 * Handle `declare module` augmentations from Grid Pro files.
 *
 * The built-in `autoCompleteInfos()` only resolves `.d.ts` files.
 * This function also tries `.ts` files for Grid source modules.
 */
function autoCompleteGridInfos(): void {
    for (const key of Object.keys(TSLib.SOURCE_CACHE)) {
        const sourceInfo = TSLib.SOURCE_CACHE[key];

        if (!sourceInfo) {
            continue;
        }

        for (const info of sourceInfo.code) {
            if (
                info.kind === 'Module' &&
                info.flags?.includes('declare')
            ) {
                // Resolve the module path relative to the source file's
                // directory, keeping it as a relative path to match cache
                // keys.
                const modulePath = Path.normalize(
                    Path.join(
                        Path.dirname(sourceInfo.path),
                        info.name
                    )
                ).replace(/\\/gu, '/');

                // Try .ts first (Grid source files), then .d.ts
                let targetInfo: TSLib.SourceInfo | undefined;

                try {
                    targetInfo =
                        TSLib.getSourceInfo(`${modulePath}.ts`);
                } catch (e) {
                    // File may not exist, try .d.ts
                }

                if (!targetInfo) {
                    try {
                        targetInfo =
                            TSLib.getSourceInfo(`${modulePath}.d.ts`);
                    } catch (e) {
                        // File may not exist either
                    }
                }

                if (targetInfo) {
                    TSLib.mergeCodeInfos(targetInfo, info);
                }
            }
        }
    }
}


/**
 * Convert an interface/type name to a grid option name.
 *
 * Unlike Highcharts Core, Grid does not have plotOptions/series mapping,
 * so the conversion is simpler.
 */
function getGridOptionName(
    camelCaseName: string
): string {
    if (!camelCaseName) {
        return '';
    }

    // Strip trailing "Options" suffix for interface-based names
    if (
        camelCaseName.endsWith('Options') &&
        camelCaseName !== 'Options'
    ) {
        camelCaseName = camelCaseName.substring(
            0,
            camelCaseName.length - 7
        );
    }

    // Lower-case the first character
    return camelCaseName[0].toLowerCase() + camelCaseName.substring(1);
}


/**
 * Creates or retrieves a tree node by its dotted full name.
 *
 * Reused from api-options.ts.
 */
function getTreeNode(
    fullname: string
): TreeLib.Option {
    let _currentNode: TreeLib.Option = {
        doclet: {},
        meta: {
            fullname: '',
            name: ''
        },
        children: TREE
    };

    let _fullname: string;

    for (const _name of fullname.split('.')) {

        if (!_name) {
            continue;
        }

        _fullname = (
            _currentNode.meta.fullname ?
                `${_currentNode.meta.fullname}.${_name}` :
                _name
        );

        if (!_currentNode.children) {
            _currentNode.children = {};
        }

        if (!_currentNode.children[_name]) {
            _currentNode.children[_name] = {
                doclet: {},
                meta: {
                    fullname: _fullname,
                    name: _name
                },
                children: {}
            };
        }

        _currentNode = _currentNode.children[_name];

    }

    return _currentNode;
}


/**
 * Merge default values from the `defaultOptions` object in Defaults.ts
 * into tree nodes that don't already have a `defaultvalue`.
 */
function mergeDefaultValues(
    sourceInfo: TSLib.SourceInfo,
    debug?: boolean
): void {
    for (const info of sourceInfo.code) {
        // Look for exported `const defaultOptions`
        if (
            info.kind === 'Variable' &&
            info.name === 'defaultOptions' &&
            typeof info.value === 'object' &&
            info.value.kind === 'Object'
        ) {
            walkDefaultsObject(info.value.members, '', debug);
        }

        // Look for `export { defaultOptions, ... }` or `export default { defaultOptions }`
        if (
            info.kind === 'Export' &&
            typeof info.value === 'object' &&
            info.value.kind === 'Object'
        ) {
            walkDefaultsObject(info.value.members, '', debug);
        }
    }
}


/**
 * Walk the members of a defaults object and fill in `defaultvalue` for
 * tree nodes that are missing them.
 */
function walkDefaultsObject(
    members: Array<TSLib.CodeInfo>,
    parentPath: string,
    debug?: boolean
): void {
    for (const member of members) {
        if (member.kind !== 'Property') {
            continue;
        }

        const fullPath = parentPath ?
            `${parentPath}.${member.name}` :
            member.name;

        // Check if this path exists in the tree
        const treeNode = findTreeNode(fullPath);

        if (treeNode) {
            // Fill in default value if not already set
            if (
                typeof treeNode.doclet.defaultvalue === 'undefined' &&
                typeof treeNode.meta.default === 'undefined' &&
                member.value !== undefined &&
                typeof member.value !== 'object'
            ) {
                let defaultVal: any = member.value;

                defaultVal = normalizeDefaultValue(defaultVal);

                if (!isNaN(Number(defaultVal))) {
                    defaultVal = Number(defaultVal);
                } else if (defaultVal === 'true') {
                    defaultVal = true;
                } else if (defaultVal === 'false') {
                    defaultVal = false;
                } else if (defaultVal === 'null') {
                    defaultVal = null;
                }

                treeNode.doclet.defaultvalue = defaultVal;
                treeNode.meta.default = defaultVal;
            }
        }

        // Recurse into nested objects
        if (
            typeof member.value === 'object' &&
            member.value.kind === 'Object'
        ) {
            walkDefaultsObject(member.value.members, fullPath, debug);
        }
    }
}


/**
 * Find a tree node by dotted path, returning undefined if not found.
 */
function findTreeNode(
    fullname: string
): TreeLib.Option | undefined {
    const parts = fullname.split('.');
    let current: Record<string, TreeLib.Option> = TREE;

    for (let i = 0; i < parts.length; i++) {
        const name = parts[i];

        if (!current[name]) {
            return undefined;
        }

        // Last segment — return the node
        if (i === parts.length - 1) {
            return current[name];
        }

        // More segments — need children to descend into
        if (!current[name].children) {
            return undefined;
        }

        current = current[name].children!;
    }

    return undefined;
}


async function main() {
    const args = Yargs.parseSync(process.argv) as Args;
    const debug = !!args.debug;
    const source = args.source as (string | undefined) || DEFAULT_SOURCE;

    let timer: number;

    const _paths = (
        FSLib.isFile(source) ?
            [source] :
            FSLib.getFilePaths(source, true)
    );

    // 1. Load all Grid source files
    timer = LogLib.starting(`Loading ${source}`);
    for (const _path of _paths) {
        TSLib.getSourceInfo(_path, void 0, debug);
    }
    // Run standard autoComplete for .d.ts module augmentations
    TSLib.autoCompleteInfos();
    // Run Grid-specific autoComplete for .ts module augmentations
    autoCompleteGridInfos();
    LogLib.finished(`Loading ${source}`, timer);

    // 2. Find and walk the Options interface
    timer = LogLib.starting(`Building tree from ${source}`);

    const optionsPath = FSLib.path('ts/Grid/Core/Options.ts');
    const optionsKey = Object.keys(TSLib.SOURCE_CACHE).find(
        key => key.startsWith(optionsPath)
    );

    if (optionsKey) {
        addGridOptions(TSLib.SOURCE_CACHE[optionsKey], debug);
    } else {
        LogLib.warn(`Could not find Options.ts in cache`);
    }

    LogLib.finished(`Building tree from ${source}`, timer);

    // 3. Merge default values from Defaults.ts
    timer = LogLib.starting('Merging default values');

    const defaultsPath = FSLib.path('ts/Grid/Core/Defaults.ts');
    const defaultsKey = Object.keys(TSLib.SOURCE_CACHE).find(
        key => key.startsWith(defaultsPath)
    );

    if (defaultsKey) {
        mergeDefaultValues(TSLib.SOURCE_CACHE[defaultsKey], debug);
    }

    LogLib.finished('Merging default values', timer);

    LogLib.message(`Found ${Object.keys(TREE).length} root options:`);
    LogLib.message(Object.keys(TREE).sort().join(', '));

    // 4. Save output
    LogLib.warn('Saving JSON ...');
    await saveJSON();
    LogLib.success('Done');
}


async function saveJSON() {
    const save = (filePath: string, obj: any) => {
        FS.writeFileSync(
            filePath,
            TreeLib.toJSONString(TreeLib.sortJSONTree(obj), 4),
            'utf8'
        );
        LogLib.message('Saved', filePath, '.');
    };

    TREE._meta = {
        branch: await GitLib.getBranch(),
        commit: await GitLib.getLatestCommitShaSync(),
        version: JSON.parse(FS.readFileSync('package.json', 'utf8')).version
    } as any;

    save('tree-grid.json', { _meta: TREE._meta, ...TREE });
}


/* *
 *
 *  Runtime
 *
 * */


main();
