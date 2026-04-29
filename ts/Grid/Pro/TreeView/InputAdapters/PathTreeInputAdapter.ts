/* *
 *
 *  Grid Tree View Path Input Adapter
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { ColumnCollection } from '../../../../Data/DataTable';
import type { RowId } from '../../../Core/Data/DataProvider';
import type {
    TreeInputPathSeparator,
    TreeIndexBuildResult,
    TreeNodeRecord
} from '../TreeViewTypes';
import type {
    NormalizedTreeInputPathOptions
} from '../TreeViewOptionsNormalizer';

import {
    defined,
    isArray,
    isFunction,
    isNumber,
    isString
} from '../../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

interface NormalizedPathValue {
    hierarchy: string[];
    path: string;
}

/**
 * Builds a canonical tree index from full path definitions.
 *
 * @param columns
 * Source columns.
 *
 * @param idColumn
 * Column ID containing stable row IDs.
 *
 * @param input
 * Normalized tree input options.
 *
 * @returns
 * Canonical tree index.
 */
export function buildIndexFromColumns(
    columns: ColumnCollection,
    idColumn: string,
    input: NormalizedTreeInputPathOptions
): TreeIndexBuildResult {
    const { pathColumn, separator } = input;

    const idValues = columns[idColumn];
    if (!idValues) {
        throw new Error(`TreeView: idColumn "${idColumn}" not found.`);
    }

    const pathValues = columns[pathColumn];
    if (!pathValues) {
        throw new Error(`TreeView: pathColumn "${pathColumn}" not found.`);
    }

    if (!separator) {
        throw new Error(
            'TreeView: `data.treeView.input.separator` must not be empty.'
        );
    }

    const rowCount = Math.max(idValues.length, pathValues.length);
    const nodes = new Map<RowId, TreeNodeRecord>();
    const rowOrder: RowId[] = [];
    const pathToId = new Map<string, RowId>();
    const pathById = new Map<RowId, string>();
    const hierarchyById = new Map<RowId, string[]>();
    const parentPathByPath = new Map<string, string | null>();
    const rootIds: RowId[] = [];

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const id = normalizeRowIdValue(idValues[rowIndex], idColumn, rowIndex);
        const normalizedPath = normalizePathValue(
            pathValues[rowIndex],
            pathColumn,
            rowIndex,
            separator
        );
        const { hierarchy, path } = normalizedPath;

        if (nodes.has(id)) {
            throw new Error(
                `TreeView: Duplicate row id "${String(id)}" in column ` +
                `"${idColumn}" at row ${rowIndex}.`
            );
        }

        if (pathToId.has(path)) {
            throw new Error(
                `TreeView: Duplicate path "${path}" in column ` +
                `"${pathColumn}" at row ${rowIndex}.`
            );
        }

        nodes.set(id, {
            id,
            parentId: null,
            rowIndex,
            path,
            childrenIds: []
        });
        rowOrder.push(id);
        pathToId.set(path, id);
        pathById.set(id, path);
        hierarchyById.set(id, hierarchy);

        for (let i = 0, iEnd = hierarchy.length; i < iEnd; ++i) {
            const hierarchyPath = hierarchy[i];

            if (parentPathByPath.has(hierarchyPath)) {
                continue;
            }

            parentPathByPath.set(
                hierarchyPath,
                i === 0 ? null : hierarchy[i - 1]
            );
        }
    }

    const sourceRowOrder = rowOrder.slice();

    /**
     * Ensures a node for a given path.
     *
     * @param path
     * Path to ensure node for.
     *
     * @returns
     * Existing or generated node ID.
     */
    function ensureNodeForPath(path: string): RowId {
        const existingId = pathToId.get(path);
        if (defined(existingId)) {
            return existingId;
        }

        const parentPath = parentPathByPath.get(path) ?? null;
        const parentId = (
            parentPath === null ?
                null :
                ensureNodeForPath(parentPath)
        );

        const generatedId = createGeneratedRowId(path, nodes);
        nodes.set(generatedId, {
            id: generatedId,
            parentId,
            rowIndex: null,
            isGenerated: true,
            path,
            childrenIds: []
        });

        rowOrder.push(generatedId);
        pathToId.set(path, generatedId);
        pathById.set(generatedId, path);

        if (parentId === null) {
            rootIds.push(generatedId);
        } else {
            nodes.get(parentId)?.childrenIds.push(generatedId);
        }

        return generatedId;
    }

    for (let i = 0, iEnd = sourceRowOrder.length; i < iEnd; ++i) {
        const nodeId = sourceRowOrder[i];
        const node = nodes.get(nodeId);
        const hierarchy = hierarchyById.get(nodeId);
        const path = pathById.get(nodeId);
        if (!node || !defined(path) || !hierarchy) {
            continue;
        }

        const parentPath = parentPathByPath.get(path) ?? null;
        if (parentPath === null) {
            rootIds.push(node.id);
            continue;
        }

        const parentId = ensureNodeForPath(parentPath);

        node.parentId = parentId;
        nodes.get(parentId)?.childrenIds.push(node.id);
    }

    return {
        nodes,
        rowOrder,
        rootIds
    };
}

/**
 * Normalizes row ID values to valid `RowId`.
 *
 * @param value
 * Raw cell value.
 *
 * @param columnId
 * Source column ID.
 *
 * @param rowIndex
 * Row index of the value.
 *
 * @returns
 * Normalized row ID.
 */
function normalizeRowIdValue(
    value: unknown,
    columnId: string,
    rowIndex: number
): RowId {
    if (!defined(value)) {
        throw new Error(
            `TreeView: Missing value in "${columnId}" at row ${rowIndex}.`
        );
    }

    if (isString(value) || isNumber(value)) {
        return value;
    }

    throw new Error(
        `TreeView: "${columnId}" must contain only string or number values. ` +
        `Invalid value at row ${rowIndex}.`
    );
}

/**
 * Normalizes and validates path values.
 *
 * @param value
 * Raw path value.
 *
 * @param columnId
 * Source column ID.
 *
 * @param rowIndex
 * Row index of the value.
 *
 * @param separator
 * Path segment separator.
 *
 * @returns
 * Normalized path.
 */
function normalizePathValue(
    value: unknown,
    columnId: string,
    rowIndex: number,
    separator: TreeInputPathSeparator
): NormalizedPathValue {
    if (!isString(value)) {
        throw new Error(
            `TreeView: "${columnId}" must contain only string values. ` +
            `Invalid value at row ${rowIndex}.`
        );
    }

    if (!value.length) {
        throw new Error(
            `TreeView: Empty path in "${columnId}" at row ${rowIndex}.`
        );
    }

    const segments = getPathSegments(value, separator);

    return {
        hierarchy: buildPathHierarchy(
            value,
            columnId,
            rowIndex,
            segments,
            separator
        ),
        path: value
    };
}

/**
 * Resolves ordered path segments from a raw path value.
 *
 * @param value
 * Raw path value.
 *
 * @param separator
 * Path separator definition.
 *
 * @returns
 * Ordered path segments.
 */
function getPathSegments(
    value: string,
    separator: TreeInputPathSeparator
): string[] {
    if (isFunction(separator)) {
        const segments = separator(value);

        if (!isArray(segments)) {
            throw new Error(
                'TreeView: `data.treeView.input.separator` callback must ' +
                'return an array.'
            );
        }

        return segments as string[];
    }

    if (separator instanceof RegExp) {
        const regex = new RegExp(
            separator.source,
            separator.flags.includes('g') ?
                separator.flags :
                separator.flags + 'g'
        );
        const segments: string[] = [];
        let match: RegExpExecArray | null;

        while ((match = regex.exec(value)) !== null) {
            segments.push(match[0]);

            if (match[0] === '') {
                ++regex.lastIndex;
            }
        }

        return segments;
    }

    if (!separator) {
        throw new Error(
            'TreeView: `data.treeView.input.separator` must not be empty.'
        );
    }

    return value.split(separator);
}

/**
 * Builds cumulative path hierarchy from ordered path segments.
 *
 * @param value
 * Raw path value.
 *
 * @param columnId
 * Source column ID.
 *
 * @param rowIndex
 * Row index of the value.
 *
 * @param segments
 * Ordered path segments.
 *
 * @param separator
 * Path separator definition.
 *
 * @returns
 * Cumulative path hierarchy from root to leaf.
 */
function buildPathHierarchy(
    value: string,
    columnId: string,
    rowIndex: number,
    segments: string[],
    separator: TreeInputPathSeparator
): string[] {
    const hierarchy: string[] = [];
    let path = '';
    const joinWithSeparator = isString(separator);

    for (let i = 0, iEnd = segments.length; i < iEnd; ++i) {
        const segment = segments[i];

        if (!isString(segment) || !segment.length) {
            throw new Error(
                `TreeView: Invalid path "${value}" in "${columnId}" at row ` +
                `${rowIndex}. Empty path segments are not allowed.`
            );
        }

        if (joinWithSeparator && path.length) {
            path += separator as string;
        }

        path += segment;
        hierarchy.push(path);
    }

    return hierarchy;
}

/**
 * Creates a deterministic generated row ID for a missing path node.
 *
 * @param path
 * Missing path represented by the generated row.
 *
 * @param nodes
 * Current node map used for collision checks.
 *
 * @returns
 * Unique generated row ID.
 */
function createGeneratedRowId(
    path: string,
    nodes: Map<RowId, TreeNodeRecord>
): RowId {
    const base = '__hcg_tree_path__:' + path;
    let candidate: RowId = base;
    let suffix = 0;

    while (nodes.has(candidate)) {
        ++suffix;
        candidate = `${base}#${suffix}`;
    }

    return candidate;
}
