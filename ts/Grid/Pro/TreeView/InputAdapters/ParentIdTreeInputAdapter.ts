/* *
 *
 *  Grid Tree View Parent ID Input Adapter
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
    NormalizedTreeInputParentIdOptions
} from '../TreeViewOptionsNormalizer';

import { normalizeRowIdValue } from '../TreeViewCommons.js';
import { defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Builds a canonical tree index from flat columns using `id` and `parentId`.
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
    input: NormalizedTreeInputParentIdOptions
): TreeIndexBuildResult {
    const { parentIdColumn } = input;

    const idValues = columns[idColumn];
    if (!idValues) {
        throw new Error(`TreeView: idColumn "${idColumn}" not found.`);
    }

    const parentValues = columns[parentIdColumn];
    if (!parentValues) {
        throw new Error(
            `TreeView: parentIdColumn "${parentIdColumn}" not found.`
        );
    }

    const rowCount = Math.max(idValues.length, parentValues.length);
    const nodes = new Map<RowId, TreeNodeRecord>();
    const rowOrder: RowId[] = [];

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const id = normalizeRowIdValue(
            idValues[rowIndex],
            idColumn,
            rowIndex,
            false
        );
        const parentId = normalizeRowIdValue(
            parentValues[rowIndex],
            parentIdColumn,
            rowIndex,
            true
        );

        if (nodes.has(id)) {
            throw new Error(
                `TreeView: Duplicate row id "${String(id)}" in column ` +
                `"${idColumn}" at row ${rowIndex}.`
            );
        }

        nodes.set(id, {
            id,
            parentId,
            rowIndex,
            childrenIds: []
        });
        rowOrder.push(id);
    }

    const rootIds: RowId[] = [];

    for (let i = 0, iEnd = rowOrder.length; i < iEnd; ++i) {
        const id = rowOrder[i];
        const node = nodes.get(id);
        if (!node) {
            continue;
        }

        if (node.parentId === null) {
            rootIds.push(node.id);
            continue;
        }

        if (!nodes.has(node.parentId)) {
            throw new Error(
                `TreeView: Missing parent "${String(node.parentId)}" for ` +
                `row id "${String(node.id)}".`
            );
        }

        const parentNode = nodes.get(node.parentId);
        parentNode?.childrenIds.push(node.id);
    }

    validateAcyclic(nodes, rowOrder);

    return {
        nodes,
        rowOrder,
        rootIds
    };
}

/**
 * Validates that parent references form an acyclic graph.
 *
 * @param nodes
 * Canonical node map.
 *
 * @param rowOrder
 * Row IDs in source order.
 */
function validateAcyclic(
    nodes: Map<RowId, TreeNodeRecord>,
    rowOrder: RowId[]
): void {
    const checked = new Set<RowId>();

    for (let i = 0, iEnd = rowOrder.length; i < iEnd; ++i) {
        const startId = rowOrder[i];
        if (checked.has(startId)) {
            continue;
        }

        const path: RowId[] = [];
        const pathIndex = new Map<RowId, number>();
        let current: RowId | null = startId;

        while (current !== null) {
            if (checked.has(current)) {
                break;
            }

            const loopStart = pathIndex.get(current);
            if (defined(loopStart)) {
                const cycle = path
                    .slice(loopStart)
                    .concat(current)
                    .map((id): string => String(id))
                    .join(' -> ');

                throw new Error(
                    `TreeView: Cycle detected in parentId references: ${cycle}.`
                );
            }

            pathIndex.set(current, path.length);
            path.push(current);

            const node = nodes.get(current);
            current = node ? node.parentId : null;
        }

        for (let j = 0, jEnd = path.length; j < jEnd; ++j) {
            checked.add(path[j]);
        }
    }
}
