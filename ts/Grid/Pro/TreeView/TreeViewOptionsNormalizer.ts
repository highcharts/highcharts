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

import type { RowId } from '../../Core/Data/DataProvider';
import type {
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
    initiallyExpanded: boolean;
    expandedRowIds: RowId[];
}

const defaultOptions: NormalizedTreeViewOptions = {
    input: {
        type: 'parentId',
        parentIdColumn: 'parentId'
    },
    initiallyExpanded: false,
    expandedRowIds: []
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

    const mergedOptions = merge(defaultOptions, treeView);
    const normalizedInput: NormalizedTreeInputOptions = (
        mergedOptions.input.type === 'path' ?
            merge(
                {
                    type: 'path',
                    pathColumn: 'path',
                    separator: '/'
                },
                mergedOptions.input
            ) :
            merge(
                {
                    type: 'parentId',
                    parentIdColumn: 'parentId'
                },
                mergedOptions.input
            )
    );

    return {
        ...mergedOptions,
        input: normalizedInput,
        expandedRowIds: mergedOptions.expandedRowIds.slice()
    };
}
