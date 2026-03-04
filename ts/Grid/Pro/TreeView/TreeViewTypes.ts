/* *
 *
 *  Grid Tree View Types
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

import type { RowId } from '../../Core/Data/DataProvider';
import type { ColumnCollection } from '../../../Data/DataTable';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Tree View options for Grid data providers.
 */
export interface TreeViewOptions {
    /**
     * Enables tree view processing.
     * @default true
     */
    enabled?: boolean;

    /**
     * Input format definition used to build the tree index.
     */
    input: TreeInputOptions;

    /**
     * Column ID used as the tree column when rendering expand/collapse UI.
     */
    treeColumnId?: string;

    /**
     * Default expansion mode for initial tree state.
     * @default false
     */
    initiallyExpanded?: boolean;

    /**
     * Explicit set of expanded row IDs.
     */
    expandedRowIds?: RowId[];
}

/**
 * Tree input options variants supported by TreeView.
 */
export type TreeInputOptions = (
    TreeInputParentIdOptions |
    TreeInputPathOptions
);

/**
 * Parent-child relation input based on a parent ID column.
 */
export interface TreeInputParentIdOptions {
    type: 'parentId';
    parentIdColumn: string;
}

/**
 * Parent-child relation input based on a parent ID column.
 */
export interface TreeInputPathOptions {
    type: 'path';
    pathColumn: string;
    separator: string;
}

/**
 * Canonical tree node record used by TreeView internals.
 */
export interface TreeNodeRecord {
    id: RowId;
    parentId: RowId | null;
    rowIndex: number;
    childrenIds: RowId[];
}

/**
 * Canonical tree index produced from input data.
 */
export interface TreeIndexBuildResult {
    nodes: Map<RowId, TreeNodeRecord>;
    rowOrder: RowId[];
    rootIds: RowId[];
}

/**
 * Tree metadata for a single visible row in projected order.
 */
export interface TreeProjectionRowState {
    id: RowId;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
}

/**
 * Tree projection state cache for currently projected rows.
 */
export interface TreeProjectionState {
    rowIds: RowId[];
    rowIndexes: number[];
    rowsById: Map<RowId, TreeProjectionRowState>;
}

/**
 * Adapter contract for tree input formats.
 */
export interface TreeInputAdapter {
    buildIndexFromColumns(
        columns: ColumnCollection,
        idColumn: string,
        sourceColumn: string
    ): TreeIndexBuildResult;
}
