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

import type {
    TreeInputPathSeparator,
    TreeExpandedRowIds,
    TreeViewOptions
} from './TreeViewTypes';
import type {
    RowGroupingExpandedLevels
} from '../RowGrouping/RowGroupingTypes';

import { merge } from '../../../Shared/Utilities.js';

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

/**
 * Internal projection input generated from `rowGrouping` options. Row grouping
 * is a presentation feature and is not part of the public TreeView input API.
 */
export interface NormalizedTreeInputGroupingOptions {
    type: 'grouping';
    groupBy: string[];
    groupColumn: string;
    hideGroupedColumns: boolean;
}

export type NormalizedTreeInputOptions = (
    NormalizedTreeInputGroupingOptions |
    NormalizedTreeInputParentIdOptions |
    NormalizedTreeInputPathOptions
);

export interface NormalizedTreeViewOptions {
    input?: NormalizedTreeInputOptions;
    treeColumn?: string;
    expandedRowIds: TreeExpandedRowIds;

    /**
     * Depth-based expansion seed used by row grouping instead of explicit
     * `expandedRowIds`, which are not authorable for generated group rows.
     */
    expandedLevels?: RowGroupingExpandedLevels;
    stickyParents: boolean;
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
 * Validates and normalizes TreeView options from Grid config.
 *
 * @param treeView
 * Raw TreeView options.
 *
 * @returns
 * Normalized options or `undefined` when TreeView is disabled.
 */
export function normalizeTreeViewOptions(
    treeView?: TreeViewOptions
): NormalizedTreeViewOptions | undefined {
    if (!treeView || treeView.enabled === false) {
        return;
    }

    const expandedRowIds: TreeExpandedRowIds = treeView.expandedRowIds ?? [];
    const normalizedInput: (NormalizedTreeInputOptions|undefined) = (
        !treeView.input ?
            void 0 :
            treeView.input.type === 'path' ?
                merge(defaultPathInput, treeView.input) :
                merge(defaultParentIdInput, treeView.input)
    );

    return {
        input: normalizedInput,
        treeColumn: treeView.treeColumn,
        expandedRowIds: (
            expandedRowIds === 'all' ?
                expandedRowIds :
                expandedRowIds.slice()
        ),
        stickyParents: treeView.stickyParents !== false
    };
}
