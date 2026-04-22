/* *
 *
 *  Grid Tree View Options Normalizer
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

import type {
    TreeExpandedRowIds,
    TreeViewOptions
} from './TreeViewTypes';

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
    separator: string;
}

export type NormalizedTreeInputOptions = (
    NormalizedTreeInputParentIdOptions |
    NormalizedTreeInputPathOptions
);

export interface NormalizedTreeViewOptions {
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
    separator: '/'
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
    const normalizedInput: NormalizedTreeInputOptions = (
        treeView.input?.type === 'path' ?
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
