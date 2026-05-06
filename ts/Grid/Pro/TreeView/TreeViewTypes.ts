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
     *
     * When omitted, TreeView auto-detects the standard `parentId` or `path`
     * columns and prefers `path` when both exist. For custom input
     * definitions, set
     * `data.treeView.input.type` explicitly.
     *
     * @sample grid-pro/tree-view/parent-id Parent ID tree input
     * @sample grid-pro/tree-view/input-path Path tree input
     */
    input?: TreeInputOptions;

    /**
     * Column ID used as the tree column when rendering expand/collapse UI.
     */
    treeColumn?: string;

    /**
     * Explicit set of expanded row IDs, or `'all'` to expand all tree rows
     * initially.
     *
     * @default []
     */
    expandedRowIds?: TreeExpandedRowIds;

    /**
     * Enables sticky parent rows.
     *
     * @sample grid-pro/tree-view/sticky-parents Sticky parents
     * @default true
     */
    stickyParents?: boolean;
}

/**
 * Initial expansion seed for tree rows.
 */
export type TreeExpandedRowIds = RowId[] | 'all';

/**
 * Tree input options variants supported by TreeView.
 */
export type TreeInputOptions = (
    TreeInputParentIdOptions |
    TreeInputPathOptions
);

/**
 * Callback used to split a raw path value into ordered path segments.
 */
export type TreeInputPathSeparatorCallback = (path: string) => string[];

/**
 * Path segment separator definition for path-based tree input.
 */
export type TreeInputPathSeparator = (
    string |
    RegExp |
    TreeInputPathSeparatorCallback
);

/**
 * Parent-child relation input based on a parent ID column.
 */
export interface TreeInputParentIdOptions {
    /**
     * Type of the tree input.
     */
    type: 'parentId';

    /**
     * Column ID containing parent row IDs.
     * @default 'parentId'
     */
    parentIdColumn?: string;
}

/**
 * Parent-child relation input based on full node paths.
 */
export interface TreeInputPathOptions {
    /**
     * Type of the tree input.
     */
    type: 'path';

    /**
     * Column ID containing full node paths.
     * @default 'path'
     */
    pathColumn?: string;

    /**
     * Path segment separator, a RegExp extracting ordered path segments,
     * or a callback returning ordered path segments.
     *
     * @sample grid-pro/tree-view/separator-callback Separator callback
     * @default '/'
     */
    separator?: TreeInputPathSeparator;

    /**
     * Defines how path values are rendered when the path column is used as
     * the tree column.
     *
     * If `true`, renders complete paths. If `false`, renders only
     * the current path segment (leaf node name).
     *
     * @default false
     */
    showFullPath?: boolean;
}

/**
 * Canonical tree node record used by TreeView internals.
 */
export interface TreeNodeRecord {
    id: RowId;
    parentId: RowId | null;
    rowIndex: number | null;
    isGenerated?: boolean;
    path?: string;
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
    parentId: RowId | null;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    lastVisibleDescendantId?: RowId;
    isAncestorOnly?: boolean;
}

/**
 * Tree projection state cache for currently projected rows.
 */
export interface TreeProjectionState {
    rowIds: RowId[];
    rowIndexes: Array<number | undefined>;
    rowsById: Map<RowId, TreeProjectionRowState>;
}

/**
 * Adapter contract for tree input formats.
 */
export interface TreeInputAdapter {
    buildIndexFromColumns(
        columns: ColumnCollection,
        idColumn: string,
        input: TreeInputOptions
    ): TreeIndexBuildResult;
}
