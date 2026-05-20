/* *
 *
 *  Grid Tree View Cell Context
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

import type { RowId } from '../../../Core/Data/DataProvider';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type TreeProjectionController from '../Projection/TreeProjectionController';
import type {
    TreeProjectionRowState,
    TreeProjectionState
} from '../TreeViewTypes';
import type { ResolvedTreeViewOptions } from '../TreeViewOptionsNormalizer';

import { defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

export interface TreeViewCellContext {
    cell: TableCell;
    controller: TreeProjectionController;
    isTreeColumnCell: boolean;
    options: ResolvedTreeViewOptions;
    projectionState: TreeProjectionState;
    rowId: RowId;
    rowState: TreeProjectionRowState;
    treeColumnId: string;
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Resolves shared TreeView context for a rendered table cell.
 *
 * @param cell
 * Rendered table cell.
 *
 * @returns
 * Shared TreeView context, or `undefined` when the cell is not currently
 * associated with a projected tree row.
 */
export function getTreeViewCellContext(
    cell: TableCell
): TreeViewCellContext | undefined {
    const controller = cell.row.viewport.grid.treeView;
    const options = controller?.options;
    const projectionState = controller?.getProjectionState();
    const treeColumnId = (
        options?.treeColumn ||
        cell.row.viewport.columns[0]?.id
    );

    if (!controller || !options || !projectionState || !treeColumnId) {
        return;
    }

    const rowId = cell.row.id ?? projectionState.rowIds[cell.row.index];
    if (!defined(rowId)) {
        return;
    }

    const rowState = projectionState.rowsById.get(rowId);
    if (!rowState) {
        return;
    }

    return {
        cell,
        controller,
        isTreeColumnCell: cell.column.id === treeColumnId,
        options,
        projectionState,
        rowId,
        rowState,
        treeColumnId
    };
}
