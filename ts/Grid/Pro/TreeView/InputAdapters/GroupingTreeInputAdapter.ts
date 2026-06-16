/* *
 *
 *  Grid Tree View Grouping Input Adapter
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

import type DataTable from '../../../../Data/DataTable';
import type {
    CellType as DataTableCellType
} from '../../../../Data/DataTable';
import type { RowId } from '../../../Core/Data/DataProvider';
import type {
    TreeIndexBuildResult,
    TreeNodeRecord
} from '../TreeViewTypes';
import type {
    NormalizedTreeInputGroupingOptions
} from '../TreeViewOptionsNormalizer';

import { normalizeRowIdValue } from '../TreeViewCommons.js';
import { defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

interface SourceRowGroupValues {
    groupValues: DataTableCellType[];
    rowId: RowId;
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Builds a canonical tree index by grouping flat rows by source columns.
 *
 * @param table
 * Source table.
 *
 * @param input
 * Normalized grouping tree input options.
 *
 * @param idColumn
 * Column ID containing stable row IDs, when configured.
 *
 * @returns
 * Canonical tree index.
 */
export function buildIndexFromColumns(
    table: DataTable,
    input: NormalizedTreeInputGroupingOptions,
    idColumn?: string
): TreeIndexBuildResult {
    const { columns } = table;
    const { groupBy, groupColumn } = input;

    if (!groupBy.length) {
        throw new Error(
            'TreeView: `data.treeView.input.groupBy` must not be empty.'
        );
    }

    if (!groupColumn) {
        throw new Error(
            'TreeView: `data.treeView.input.groupColumn` must not be empty.'
        );
    }

    const groupBySet = new Set(groupBy);
    if (groupBySet.size !== groupBy.length) {
        throw new Error(
            'TreeView: `data.treeView.input.groupBy` must not contain ' +
            'duplicate column IDs.'
        );
    }

    for (let i = 0, iEnd = groupBy.length; i < iEnd; ++i) {
        const groupByColumn = groupBy[i];
        if (!columns[groupByColumn]) {
            throw new Error(
                `TreeView: groupBy column "${groupByColumn}" not found.`
            );
        }
    }

    if (columns[groupColumn] && !groupBySet.has(groupColumn)) {
        throw new Error(
            `TreeView: groupColumn "${groupColumn}" conflicts with an ` +
            'existing source column.'
        );
    }

    const rowCount = table.getRowCount();
    const nodes = new Map<RowId, TreeNodeRecord>();
    const rowOrder: RowId[] = [];
    const rowGroupValues = new Array<SourceRowGroupValues>(rowCount);

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const rowId = idColumn ?
            normalizeRowIdValue(
                columns[idColumn]?.[rowIndex],
                idColumn,
                rowIndex,
                false
            ) :
            table.getOriginalRowIndex(rowIndex);

        if (!defined(rowId)) {
            throw new Error(
                'TreeView: Could not resolve original row index ' +
                `at row ${rowIndex}.`
            );
        }

        if (nodes.has(rowId)) {
            throw new Error(
                idColumn ?
                    `TreeView: Duplicate row id "${String(rowId)}" in ` +
                        `column "${idColumn}" at row ${rowIndex}.` :
                    'TreeView: Duplicate original row index ' +
                        `"${String(rowId)}" at row ${rowIndex}.`
            );
        }

        const groupValues = new Array<DataTableCellType>(groupBy.length);
        for (let i = 0, iEnd = groupBy.length; i < iEnd; ++i) {
            groupValues[i] = columns[groupBy[i]][rowIndex] as DataTableCellType;
        }

        nodes.set(rowId, {
            id: rowId,
            parentId: null,
            rowIndex,
            childrenIds: []
        });
        rowOrder.push(rowId);
        rowGroupValues[rowIndex] = {
            groupValues,
            rowId
        };
    }

    const groupNodeIdByKey = new Map<string, RowId>();

    const ensureGroupNode = (
        key: string,
        parentId: RowId | null,
        groupValue: DataTableCellType
    ): RowId => {
        const existingId = groupNodeIdByKey.get(key);
        if (defined(existingId)) {
            return existingId;
        }

        const generatedNodeId = createGeneratedRowId(key, nodes);
        nodes.set(generatedNodeId, {
            id: generatedNodeId,
            parentId,
            rowIndex: null,
            isGenerated: true,
            groupValue,
            childrenIds: []
        });
        rowOrder.push(generatedNodeId);
        groupNodeIdByKey.set(key, generatedNodeId);

        if (parentId !== null) {
            nodes.get(parentId)?.childrenIds.push(generatedNodeId);
        }

        return generatedNodeId;
    };

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const row = rowGroupValues[rowIndex];
        let parentId: RowId | null = null;
        let key = '';

        for (let i = 0, iEnd = groupBy.length; i < iEnd; ++i) {
            const groupValue = row.groupValues[i];

            key += getGroupKeyPart(groupBy[i], groupValue);
            parentId = ensureGroupNode(key, parentId, groupValue);
        }

        const node = nodes.get(row.rowId);
        if (!node) {
            continue;
        }

        node.parentId = parentId;
        if (parentId !== null) {
            nodes.get(parentId)?.childrenIds.push(row.rowId);
        }
    }

    return {
        nodes,
        rowOrder
    };
}

/**
 * Creates a stable key part for a grouping value.
 *
 * @param columnId
 * Grouping source column ID.
 *
 * @param value
 * Grouping value.
 */
function getGroupKeyPart(
    columnId: string,
    value: DataTableCellType
): string {
    const stringValue = String(value);

    return (
        '|' +
        columnId.length +
        ':' +
        columnId +
        '=' +
        typeof value +
        ':' +
        stringValue.length +
        ':' +
        stringValue
    );
}

/**
 * Creates a deterministic generated row ID for a row group.
 *
 * @param key
 * Group key represented by the generated row.
 *
 * @param nodes
 * Current node map used for collision checks.
 *
 * @returns
 * Unique generated row ID.
 */
function createGeneratedRowId(
    key: string,
    nodes: Map<RowId, TreeNodeRecord>
): RowId {
    const base = '__hcg_tree_group__:' + key;
    let candidate: RowId = base;
    let suffix = 0;

    while (nodes.has(candidate)) {
        ++suffix;
        candidate = `${base}#${suffix}`;
    }

    return candidate;
}
