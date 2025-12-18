/* *
 *
 *  Grid Header Cell State Helpers namespace
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 * Imports
 *
 * */

import type Column from '../../Column';


/* *
 *
 *  Namespace
 *
 * */


/**
 * Checks if the column is filtered.
 *
 * @param column
 * The column to check.
 */
export function isFiltered(column: Column): boolean {
    const { condition, value } = column.options.filtering || {};
    return !!(condition && (
        ['empty', 'notEmpty', 'true', 'false'].includes(condition) ||
        (value !== void 0 && value !== '') // Accept null and 0
    ));
}

/**
 * Checks if the column is sorted.
 *
 * @param column
 * The column to check.
 *
 * @param order
 * Optional sorting order to check for.
 *
 * @returns
 * True if the column is sorted. In case of `order` is provided, true
 * only if the column is sorted in the provided order.
 */
export function isSorted(column: Column, order?: ('asc'|'desc')): boolean {
    const {
        currentSorting,
        currentSortings
    } = column.viewport.grid.querying.sorting || {};

    const columnSorting = (
        currentSortings?.find((sorting): boolean =>
            sorting.columnId === column.id
        ) ||
        (
            currentSorting?.columnId === column.id ?
                currentSorting :
                void 0
        )
    );

    if (!columnSorting?.order) {
        return false;
    }

    return order ?
        columnSorting.order === order :
        !!columnSorting.order;
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    isFiltered,
    isSorted
} as const;
