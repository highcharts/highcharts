/* *
 *
 *  Grid Row Grouping Options Resolver
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

import type Grid from '../../Core/Grid';
import type {
    NormalizedTreeViewOptions
} from '../TreeView/TreeViewOptionsNormalizer';

import { isArray, isString } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

const defaultGroupColumnId = 'group';


/* *
 *
 *  Functions
 *
 * */

/**
 * Resolves ordered source column IDs used as row grouping levels.
 *
 * Configured IDs refer to Grid columns, so they are mapped through
 * `columns[].dataId` when needed. Unbound columns and duplicates are skipped.
 *
 * @param grid
 * Grid instance to read options from.
 *
 * @returns
 * Ordered grouping source column IDs.
 */
export function resolveGroupByColumnIds(grid: Grid): string[] {
    const groupBy = grid.options?.rowGrouping?.groupBy;
    const columnIds = (
        isArray(groupBy) ?
            groupBy :
            isString(groupBy) ? [groupBy] : []
    );
    const columnPolicy = grid.columnPolicy;
    const groupByColumnIds: string[] = [];
    const seen = new Set<string>();

    for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
        const sourceColumnId = columnPolicy.getColumnSourceId(columnIds[i]);

        if (!sourceColumnId || seen.has(sourceColumnId)) {
            continue;
        }

        seen.add(sourceColumnId);
        groupByColumnIds.push(sourceColumnId);
    }

    return groupByColumnIds;
}

/**
 * Resolves row grouping options into TreeView projection options.
 *
 * @param grid
 * Grid instance to read options from.
 *
 * @returns
 * Normalized projection options, or `undefined` when row grouping is not
 * configured.
 */
export function resolveRowGroupingOptions(
    grid: Grid
): NormalizedTreeViewOptions | undefined {
    const rowGrouping = grid.options?.rowGrouping;

    if (!rowGrouping?.enabled) {
        return;
    }

    const groupBy = resolveGroupByColumnIds(grid);
    if (!groupBy.length) {
        return;
    }

    const groupColumn = rowGrouping.columnId || defaultGroupColumnId;

    return {
        input: {
            type: 'grouping',
            groupBy,
            groupColumn,
            hideGroupedColumns: rowGrouping.hideGroupedColumns !== false
        },
        treeColumn: groupColumn,
        expandedRowIds: [],
        expandedLevels: rowGrouping.expandedLevels ?? 0,
        stickyParents: rowGrouping.stickyParents !== false
    };
}
