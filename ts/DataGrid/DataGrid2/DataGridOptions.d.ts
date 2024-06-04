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
export interface ColumnOptions {
    /**
     * The title of the column to display in the grid structure.
     * @unimplemented
     */
    name?: string;

    /**
     * The format of the cell content.
     * @unimplemented
     */
    format?: string;
}

/**
 * Options for columns.
 */
export interface ColumnsOptions {

    /**
     * The distribution of the columns. If `full`, the columns will be
     * distributed so that the first and the last column are at the edges of
     * the grid. If `fixed`, the columns will have a fixed width in pixels.
     *
     * @default 'full'
     */
    distribution: 'full' | 'fixed'

    /**
     * The columns to display in the grid structure. Can be a list of column
     * IDs (data table column names) or a list of objects with options for
     * individual columns. If not defined, all columns from the data table will
     * be displayed with default options.
     */
    columnAssignment?: Array<string | ColumnAssignmentOptions>;

    /**
     * Column options that will be shared between all columns.
     */
    options?: ColumnOptions;
}

/**
 * Options for column assignment for individual columns.
 */
export interface ColumnAssignmentOptions {
    /**
     * The id of the affected column (the name of the column in the data table).
     */
    columnId: string;

    /**
     * Options for the column.
     */
    options: ColumnOptions;
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
