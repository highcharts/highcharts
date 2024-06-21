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
import type DataTableOptions from '../../Data/DataTableOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * The distribution of the columns in the grid structure.
 */
export type ColumnDistribution = 'full' | 'fixed';


/**
 * Options to control the content and the user experience of a grid structure.
 */
export interface DataGridOptions {

    /**
     * Data table to display in the grid structure.
     */
    table?: DataTable | DataTableOptions;

    /**
     * Options to control the way DataGrid is rendered.
     */
    settings?: DataGridSettings;

    /**
     * Default options for the rows and columns.
     */
    defaults?: DataGridDefaults;

    /**
     * Columns included in the grid structure.
     */
    columnsIncluded?: Array<string>;

    /**
     * Columns excluded from the grid structure.
     */
    columns?: Record<string, ColumnOptions>;

    /**
     * Contains options for title
     */
    title?: TitleOptions;
}

/**
 * Options to control the way DataGrid is rendered.
 */
export interface DataGridSettings {

    /**
     * The distribution of the columns. If `full`, the columns will be
     * distributed so that the first and the last column are at the edges of
     * the grid. If `fixed`, the columns will have a fixed width in pixels.
     *
     * @default 'full'
     */
    columnDistribution?: ColumnDistribution;

    /**
     * Buffer of rows to render outside the visible area from the top and from
     * the bottom while scrolling. The bigger the buffer, the less flicker will
     * be seen while scrolling, but the more rows will have to be rendered.
     *
     * @default 5
     */
    rowBufferSize?: number;

    /**
     * Whether the height of the rows should be calculated automatically based
     * on the content of the cells. If `true`, the ellipsis will be used to
     * indicate that the content is too long to fit in the cell.
     *
     * When there is no need to have different row heights, it is recommended
     * to set this option to `true` for the performance reasons, to avoid the
     * unnecessary calculations.
     *
     * @default false
     */
    strictRowHeights?: boolean;
}

/**
 * Default options for the rows and columns.
 */
export interface DataGridDefaults {

    /**
     * Default options for the columns.
     */
    columns?: ColumnOptions;
}

/**
 * Column options that can be shared between columns but can be set for each
 * column individually.
 */
export interface ColumnOptions {

    /**
     * The format of the cell content.
     */
    cellFormat?: string;

    /**
     * Whether the column is enabled and should be displayed.
     * @unimplemented
     */
    enabled?: boolean;

    /**
     * The format of the column header.
     */
    headFormat?: string;
}

export interface TitleOptions {
    /**
     * The title of the datagrid grid.
     */
    text?: string;
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
