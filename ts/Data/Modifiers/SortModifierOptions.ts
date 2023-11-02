/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
