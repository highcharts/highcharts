/* *
 *
 *  Grid Tree View Options Normalizer
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

import type { Options } from '../../Core/Options';
import type { RowId } from '../../Core/Data/DataProvider';
import type {
    DeprecatedTreeViewOptions,
    RowGroupingOptions,
    TreeInputOptions,
    TreeInputPathSeparator,
    TreeExpandedLevels,
    TreeViewOptions
} from './TreeViewTypes';

import {
    isArray,
    isString,
    merge
} from '../../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

export interface NormalizedTreeInputParentIdOptions {
    type: 'parentId';
    parentIdColumn: string;
}

export interface NormalizedTreeInputPathOptions {
    type: 'path';
    pathColumn: string;
    separator: TreeInputPathSeparator;
    showFullPath: boolean;
}

export interface NormalizedTreeInputGroupingOptions {
    type: 'grouping';
    groupBy: string[];
    groupColumnId: string;
    hideGroupByColumns: boolean;
}

export type NormalizedTreeInputOptions = (
    NormalizedTreeInputGroupingOptions |
    NormalizedTreeInputParentIdOptions |
    NormalizedTreeInputPathOptions
);

export interface NormalizedTreeViewOptions {
    input?: NormalizedTreeInputOptions;
    treeColumn?: string;
    expandedLevels: TreeExpandedLevels;
    expandedRowIds: RowId[];
    stickyParents: boolean;

    /**
     * Whether row grouping has been ignored, because tree view was enabled at
     * the same time.
     * @internal
     */
    rowGroupingIgnored: boolean;
}

export interface ResolvedTreeViewOptions extends NormalizedTreeViewOptions {
    input: NormalizedTreeInputOptions;
}

const defaultParentIdInput: NormalizedTreeInputParentIdOptions = {
    type: 'parentId',
    parentIdColumn: 'parentId'
};

const defaultPathInput: NormalizedTreeInputPathOptions = {
    type: 'path',
    pathColumn: 'path',
    separator: '/',
    showFullPath: false
};


/* *
 *
 *  Functions
 *
 * */

/**
 * Normalizes row grouping column definitions.
 *
 * @param groupBy
 * Raw grouping column or columns.
 *
 * @returns
 * Normalized grouping column IDs.
 */
function normalizeGroupBy(
    groupBy: (string | string[] | undefined)
): string[] {
    if (isArray(groupBy)) {
        return groupBy.slice();
    }

    return isString(groupBy) ? [groupBy] : [];
}

/**
 * Normalizes the tree input definition of the tree view options.
 *
 * @param input
 * Raw tree input options.
 *
 * @returns
 * Normalized input, or `undefined` when the input should be autodetected.
 */
function normalizeTreeInput(
    input?: TreeInputOptions
): NormalizedTreeInputOptions | undefined {
    if (!input) {
        return;
    }

    return merge(
        input.type === 'path' ? defaultPathInput : defaultParentIdInput,
        input
    );
}

/**
 * Normalizes row grouping options into a grouping tree input.
 *
 * @param rowGrouping
 * Raw row grouping options.
 *
 * @returns
 * Normalized grouping input.
 */
function normalizeGroupingInput(
    rowGrouping: RowGroupingOptions
): NormalizedTreeInputGroupingOptions {
    return {
        type: 'grouping',
        groupBy: normalizeGroupBy(rowGrouping.groupBy),
        groupColumnId: rowGrouping.groupColumnId || 'group',
        hideGroupByColumns: rowGrouping.hideGroupByColumns !== false
    };
}

/**
 * Validates and normalizes TreeView options from Grid config.
 *
 * Tree view takes precedence when both tree view and row grouping are enabled.
 *
 * @param options
 * Grid options.
 *
 * @param deprecatedTreeView
 * Tree view options of the local data provider.
 *
 * @returns
 * Normalized options or `undefined` when both features are disabled.
 */
export function normalizeTreeViewOptions(
    options?: Options,
    // TODO: Remove deprecated option before releasing next major
    deprecatedTreeView?: DeprecatedTreeViewOptions
): NormalizedTreeViewOptions | undefined {
    let treeView: TreeViewOptions | undefined;

    if (options?.treeView?.enabled) {
        treeView = options.treeView;
    } else if (deprecatedTreeView?.enabled) {
        // TODO: Remove deprecated option before releasing next major
        treeView = deprecatedTreeView;
    }

    const rowGrouping = options?.rowGrouping?.enabled ?
        options.rowGrouping :
        void 0;

    let input: NormalizedTreeInputOptions | undefined;

    if (treeView) {
        input = normalizeTreeInput(treeView.input);
    } else if (rowGrouping) {
        input = normalizeGroupingInput(rowGrouping);
    } else {
        return;
    }

    const rows = options?.rendering?.rows;

    // TODO: Remove deprecated option before releasing next major
    // Options moved to `rendering.rows` are read from the data provider
    // options only when the deprecated `data.treeView` is the active source.
    const deprecatedRows = treeView === deprecatedTreeView ?
        deprecatedTreeView :
        void 0;

    // TODO: Remove deprecated option before releasing next major
    // The deprecated option accepted `'all'`, which is now expressed by
    // `rendering.rows.expandedLevels`.
    const deprecatedExpandedRowIds = deprecatedRows?.expandedRowIds;
    const deprecatedExpandAll = deprecatedExpandedRowIds === 'all';

    const expandedRowIds = (
        rows?.expandedRowIds ??
        (deprecatedExpandAll ? void 0 : deprecatedExpandedRowIds) ??
        []
    );

    return {
        input,
        treeColumn: treeView?.treeColumn,
        expandedLevels: (
            rows?.expandedLevels ??
            (deprecatedExpandAll ? 'all' : 0)
        ),
        expandedRowIds: expandedRowIds.slice(),
        stickyParents: (
            rows?.stickyParents ??
            deprecatedRows?.stickyParents ??
            true
        ),
        rowGroupingIgnored: !!(treeView && rowGrouping)
    };
}
