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
    rows?: RowsOptions;

    /**
     * Contains options for columns.
     */
    columns?: ColumnsOptions;
}

/**
 * Options for rows.
 */
export interface RowsOptions {

    /**
     * Buffer of rows to render outside the visible area from the top and from
     * the bottom while scrolling. The bigger the buffer, the less flicker will
     * be seen while scrolling, but the more rows will have to be rendered.
     *
     * @default 5
     */
    bufferSize?: number;

}

/**
 * Column options that can be shared between columns but can be set for each
 * column individually.
 */
export interface SharedColumnOptions {
    /**
     * The title of the column to display in the grid structure.
     * @unimplemented
     */
    headFormat?: string;

    /**
     * The format of the cell content.
     * @unimplemented
     */
    cellFormat?: string;
}

/**
 * Options for columns.
 */
export interface ColumnsOptions extends SharedColumnOptions {

    /**
     * The distribution of the columns. If `fill`, the columns will be
     * distributed so that the first and the last column are at the edges of
     * the grid. If `fixedWidth`, the columns will have a fixed width in pixels.
     *
     * @default 'fill'
     */
    distribution: 'fill' | 'fixedWidth'

    /**
     * The columns to display in the grid structure. Can be a list of column
     * names or a list of objects with options for individual columns.
     * Ultimately it can be set to `all` to display all columns from the data
     * table with default options.
     *
     * @default 'all'
     */
    columnAssignment: Array<string | ColumnAssignmentOptions> | 'all';
}

/**
 * Options for column assignment for individual columns.
 */
export interface ColumnAssignmentOptions extends SharedColumnOptions {
    /**
     * The name of the column in the data table.
     */
    name: string;
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
