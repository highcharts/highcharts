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

import type DataTable from '../Data/DataTable';
import type DataTableOptions from '../Data/DataTableOptions';
import type DataGridCell from './DataGridCell';


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
     * Options for individual columns.
     */
    columns?: Record<string, IndividualColumnOptions>;

    /**
     * Contains options for caption.
     */
    caption?: CaptionOptions;
}

/**
 * Options to control the way DataGrid is rendered.
 */
export interface DataGridSettings {
    /**
    * Options to control the columns behavior and rendering.
    */
    columns?: ColumnsSettings;

    /**
    * Options to control the rows behavior and rendering.
    */
    rows?: RowsSettings;
}

export interface ColumnsSettings {
    /**
     * The distribution of the columns. If `full`, the columns will be
     * distributed so that the first and the last column are at the edges of
     * the grid. If `fixed`, the columns will have a fixed width in pixels.
     *
     * @default 'full'
     */
    distribution?: ColumnDistribution;

    /**
     * Whether the columns should be resizable.
     *
     * @default true
     */
    resizing?: boolean;
}

export interface RowsSettings {
    /**
     * Buffer of rows to render outside the visible area from the top and from
     * the bottom while scrolling. The bigger the buffer, the less flicker will
     * be seen while scrolling, but the more rows will have to be rendered.
     *
     * Cannot be lower than 0.
     *
     * @default 10
     */
    bufferSize?: number;

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
    strictHeights?: boolean;
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
     * The format of the cell content within the given column of
     * DataGrid.
     */
    cellFormat?: string;

    /**
     * The format of the column header.
     */
    headFormat?: string;
}

/**
 * Column options that can be set for each column individually.
 */
export interface IndividualColumnOptions extends ColumnOptions {
    /**
     * The custom CSS class name for the column.
     */
    className?: string;

    /**
     * Whether the column is enabled and should be displayed.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Callback function for formatting cells within the given column of the
     * DataGrid.
     *
     * @return {string}
     * A string to be concatenated in to the common cell's text.
     */
    cellFormatter?: CellFormatterCallback;

    /**
     * Weather to use HTML to render the cell content. When enabled, other
     * elements than text can be added to the cell ie. images.
     *
     * @default false
     */
    useHTML?: boolean;

    /**
     * Switch to make the column cells editable ('true') or read-only ('false').
     *
     * @default true
     */
    editable?: boolean;
}

export interface CaptionOptions {
    /**
     * The caption of the datagrid grid.
     */
    text?: string;
}

/**
 * Returns a formatted call's string.
 */
export interface CellFormatterCallback {
    (this: DataGridCell): string;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
