/* *
 *
 *  (c) 2009-2026 Highsoft AS
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
 * Options to configure the modifier.
 */
export interface SortModifierOptions extends DataModifierOptions {

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
     * Column with values to order.
     *
     * @default "y"
     */
    orderByColumn: string;

    /**
     * Column to update with order index instead of change order of rows.
     */
    orderInColumn?: string;

}


/* *
 *
 *  Default Export
 *
 * */


export default SortModifierOptions;
