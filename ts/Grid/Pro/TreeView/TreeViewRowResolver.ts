'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { RowId } from '../../Core/Data/DataProvider';
import type Table from '../../Core/Table/Table';
import type TableRow from '../../Core/Table/Body/TableRow';
import type { TreeProjectionState } from './TreeViewTypes';

import { defined } from '../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the pagination offset for viewport rows in the current table.
 *
 * @param table
 * Table instance hosting the rendered rows.
 *
 * @returns
 * Number of projected rows skipped before the current page.
 */
function getPaginationOffset(table: Table): number {
    const pagination = table.grid.querying.pagination;

    return pagination.enabled ?
        Math.max(0, pagination.currentPage - 1) * pagination.currentPageSize :
        0;
}

/**
 * Resolves the projected TreeView row index for a rendered row.
 *
 * @param row
 * Rendered viewport or sticky row.
 *
 * @param projectionState
 * Current TreeView projection state.
 *
 * @returns
 * Projected row index, if the row belongs to the active projection.
 */
export function getTreeViewProjectedRowIndex(
    row: TableRow,
    projectionState?: TreeProjectionState
): number | undefined {
    const projectedRowIndex = row.viewport.rows.indexOf(row) > -1 ?
        row.index + getPaginationOffset(row.viewport) :
        row.index;

    if (!projectionState) {
        return projectedRowIndex;
    }

    if (
        projectedRowIndex < 0 ||
        projectedRowIndex >= projectionState.rowIds.length
    ) {
        return;
    }

    return projectedRowIndex;
}

/**
 * Resolves the stable TreeView row ID for a rendered row.
 *
 * @param row
 * Rendered viewport or sticky row.
 *
 * @param projectionState
 * Current TreeView projection state.
 *
 * @returns
 * Stable row ID, if available.
 */
export function getTreeViewRowId(
    row: TableRow,
    projectionState?: TreeProjectionState
): RowId | undefined {
    if (defined(row.id)) {
        return row.id;
    }

    const projectedRowIndex = getTreeViewProjectedRowIndex(
        row,
        projectionState
    );

    if (!defined(projectedRowIndex)) {
        return;
    }

    return projectionState?.rowIds[projectedRowIndex];
}

/**
 * Synchronizes rendered row identity with the current TreeView projection.
 *
 * @param row
 * Rendered viewport or sticky row.
 *
 * @param projectionState
 * Current TreeView projection state.
 */
export function syncTreeViewRowId(
    row: TableRow,
    projectionState?: TreeProjectionState
): void {
    const rowId = getTreeViewRowId(row, projectionState);

    if (!defined(rowId)) {
        row.htmlElement.removeAttribute('data-row-id');
        return;
    }

    row.id = rowId;
    row.htmlElement.setAttribute('data-row-id', String(rowId));
}

/**
 * Converts a projected TreeView row index to the viewport-local row index.
 *
 * @param table
 * Viewport table handling keyboard and focus navigation.
 *
 * @param projectedRowIndex
 * Row index in the full TreeView projection.
 *
 * @returns
 * Row index relative to the current page in the viewport.
 */
export function getLocalTreeViewRowIndex(
    table: Table,
    projectedRowIndex: number
): number {
    return projectedRowIndex - getPaginationOffset(table);
}
