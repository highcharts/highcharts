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
 *  Declarations
 *
 * */


/**
 * Options to initialize a new DataTable instance.
 */
export interface DataTableOptions {


    /**
     * Initial map of column aliases to original column names.
     */
    aliases?: Record<string, string>;


    /**
     * Initial columns with their values.
     */
    columns?: Record<string, Array<DataTableValue>>;


    /**
     * Custom ID to identify the new DataTable instance.
     */
    id?: string;


}


export type DataTableValue = (boolean|null|number|string|undefined);


/* *
 *
 *  Default Export
 *
 * */


export default DataTableOptions;
