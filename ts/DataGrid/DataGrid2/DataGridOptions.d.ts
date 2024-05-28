/* *
 *
 *  Data Grid options
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../Data/DataTable';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the content and the user experience of a grid structure.
 */
export interface DataGridOptions {

    /**
     * Data table to display in the grid structure.
     */
    dataTable: DataTable;

    /**
     * Contains options for rows.
     */
    rowOptions?: RowOptions;
}

/**
 * Options for rows.
 */
export interface RowOptions {

    /**
     * Buffer of rows to render outside the visible area from the top and from
     * the bottom while scrolling. The bigger the buffer, the less flicker will
     * be seen while scrolling, but the more rows will have to be rendered.
     *
     * @default 5
     */
    bufferSize?: number;

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
