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
    groupColumn: string;
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
    stickyParents: boolean;
}

export interface ResolvedTreeViewOptions {
    input: NormalizedTreeInputOptions;
    treeColumn?: string;
    expandedRowIds: TreeExpandedRowIds;
    stickyParents: boolean;
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

const defaultGroupingInput: NormalizedTreeInputGroupingOptions = {
    type: 'grouping',
    groupBy: [],
    groupColumn: 'Group'
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
                treeView.input.type === 'grouping' ?
                    {
                        ...merge(defaultGroupingInput, treeView.input),
                        groupBy: normalizeGroupBy(treeView.input.groupBy)
                    } :
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
