/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataModifierOptions from './DataModifierOptions';
import type DataTable from '../DataTable';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Definition of a sorting level when sorting by multiple columns.
 */
export interface SortModifierOrderByOption {
    /**
     * Column ID with values to order by.
     */
    column: string;

    /**
     * Direction of sorting for this level. If not set, the modifier-level
     * `direction` is used.
     */
    direction?: ('asc'|'desc');

    /**
     * Custom compare function for this level. If not set, the modifier-level
     * `compare` is used.
     */
    compare?: (a: DataTable.CellType, b: DataTable.CellType) => number;
}


/**
 * Base options shared by sorting modifiers.
 */
export interface SortModifierBaseOptions extends DataModifierOptions {
    /**
     * Name of the related modifier for these options.
     */
    type: 'Sort';

    /**
     * Direction of sorting.
     *
     * @default "desc"
     */
    direction: ('asc'|'desc');

    /**
     * Custom compare function to sort the column values. It overrides the
     * default sorting behavior. If not set, the default sorting behavior is
     * used.
     *
     * @param a
     * The first value to compare.
     *
     * @param b
     * The second value to compare.
     *
     * @return
     * A number indicating whether the first value (`a`) is less than (`-1`),
     * equal to (`0`), or greater than (`1`) the second value (`b`).
     */
    compare?: (a: DataTable.CellType, b: DataTable.CellType) => number;

    /**
     * Column to update with order index instead of change order of rows.
     */
    orderInColumn?: string;
}

/**
 * Options to configure a single-column sort modifier.
 */
export interface SingleSortModifierOptions extends SortModifierBaseOptions {
    /**
     * Column with values to order.
     *
     * @default "y"
     */
    orderByColumn: string;
}

/**
 * Options to configure a multi-column sort modifier.
 */
export interface MultiSortModifierOptions extends SortModifierBaseOptions {
    /**
     * Columns and directions to order by, in priority order.
     */
    columns: SortModifierOrderByOption[];
}

/**
 * Options to configure the modifier.
 */
export type SortModifierOptions =
    SingleSortModifierOptions |
    MultiSortModifierOptions;


/* *
 *
 *  Default Export
 *
 * */


export default SortModifierOptions;
