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
import type DataGridRow from './DataGridRow';

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

    /**
     * Default height of each row in pixels. This is used to calculate the
     * amount of visible rows in a container and the size of the scrollbar.
     *
     * @default 36
     */
    height?: number;

    /**
     * Calls to set the height of a row in render time. This is useful for
     * dynamic row heights. If set, the height option is ignored.
     *
     * @param row The row to set height for.
     * @returns The height of the row in pixels or undefined if the default height should be used.
     */
    setHeight?: ((row: DataGridRow) => number | undefined);
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
