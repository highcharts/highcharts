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
    TreeIndexBuildResult,
    TreeNodeRecord
} from '../TreeViewTypes';
import type {
    NormalizedTreeInputPathOptions
} from '../TreeViewOptionsNormalizer';

import { defined, isNumber, isString } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

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
    const rootIds: RowId[] = [];

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const id = normalizeRowIdValue(idValues[rowIndex], idColumn, rowIndex);
        const path = normalizePathValue(
            pathValues[rowIndex],
            pathColumn,
            rowIndex,
            separator
        );

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

        const parentPath = getParentPath(path, separator);
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
        const path = pathById.get(nodeId);
        if (!node || !defined(path)) {
            continue;
        }

        const parentPath = getParentPath(path, separator);
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
    separator: string
): string {
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

    const segments = value.split(separator);
    for (let i = 0, iEnd = segments.length; i < iEnd; ++i) {
        if (!segments[i].length) {
            throw new Error(
                `TreeView: Invalid path "${value}" in "${columnId}" at row ` +
                `${rowIndex}. Empty path segments are not allowed.`
            );
        }
    }

    return value;
}

/**
 * Resolves parent path from a full node path.
 *
 * @param path
 * Full node path.
 *
 * @param separator
 * Path segment separator.
 *
 * @returns
 * Parent path, or `null` for root nodes.
 */
function getParentPath(
    path: string,
    separator: string
): string | null {
    const separatorIndex = path.lastIndexOf(separator);
    if (separatorIndex < 0) {
        return null;
    }

    return path.slice(0, separatorIndex);
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
