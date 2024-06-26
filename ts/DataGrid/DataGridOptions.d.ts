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
 *  - Øystein Moseng
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../Data/DataTable';

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
     * Height of each grid cell in pixels. This is used to calculate the amount
     * of visible cells in a container and the size of the scrollbar.
     *
     * It also specifies the minimum height of the header row and its double
     * determines the maximum possible height of the header row.
     *
     * @default 49
     */
    cellHeight?: number;

    /**
     * Contains options for column headers.
     */
    columnHeaders?: ColumnHeaderOptions;

    /**
     * Contains column-specific options. The key is the column name and the
     * value is the object with the column-specific options.
     */
    columns?: Record<string, ColumnOptions>;

    /**
     * Table data to display in the grid structure.
     */
    dataTable?: DataTable;

    /**
     * An explicit height for the table. If given, the height of the table will
     * be fixed regardless of how many rows are visible. The scrollbar will
     * disappear if the actual height of the rows is less than the set height.
     * @internal
     * @default 400
     */
    defaultHeight?: number;

    /**
     * Switch to make the whole grid structure with all cells editable ('true')
     * or read-only ('false').
     *
     * @default true
     */
    editable?: boolean;

    /**
     * Events attached to the row : `click`.
     */
    events?: DataGridEvents

    /**
     * Switch to make the column sizes editable ('true') or fixed ('false').
     *
     * @default true
     */
    resizableColumns?: boolean;

    /**
     * Weather to use HTML to render the cell content. When enabled, other
     * elements than text can be added to the cell ie. images.
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cells-formatting | Cell with an URL to click}
     *
     * @default false
     */
    useHTML?: boolean;
}

/**
 * Contains options for column headers.
 */
export interface ColumnHeaderOptions {

    /**
     * Switch to turn the column header on (`true`) or off (`false`).
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/options/disable-column-headers/ | Column headers disabled}
     *
     * @default true
     */
    enabled?: boolean;
}

/**
 * Contains options for column cells.
 */
export interface ColumnOptions {
    /**
     * A string used to format each cell's content. The context is the cell's
     * value and can be accessed only by using `{value}` and `{text}`.
     * First one is used for formatting numbers, second one for
     * formatting strings.
     *
     * @example
     * ```js
     * cellFormat: '{value:.2f} kg'
     * ```
     * ```js
     * cellFormat: '{text} (custom format)'
     * ```
     */
    cellFormat?: string;

    /**
     * Extendable method for formatting each cell's in DataGrid.
     *
     * @return {string}
     * A string to be concatenated in to the common cell's text.
     */
    cellFormatter?: CellFormatterCallback;

    /**
     * Switch to make the column cells editable ('true') or read-only ('false').
     *
     * @default true
     */
    editable?: boolean;

    /**
     * A string used to format the header row's cells. The context is the
     * column's name and can be accessed only by using `{text}`.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/datagrid-component/datagrid-options/ | Add a header format}
     *
     * @example
     * ```js
     * headerFormat: '{text} (custom format)'
     * ```
     *
     */
    headerFormat?: string;

    /**
     * Wether to show the column in the grid structure.
     *
     * @default true
     */
    show?: boolean;
}

/**
 * Returns a formatted call's string.
 */
export interface CellFormatterCallback {
    (this: CellValue): string;
}

/**
 * Value to convert
 */
export interface CellValue {
    value: DataTable.CellType
}

/**
 * Contains events for row
 */
export interface DataGridEvents {
    row?: DataGridRowEvents
}

/**
 * Declare events for row
 */
export interface DataGridRowEvents {
    click?: DataGridClickCallbackFunction
}

/**
 * Click callback function
 */
export interface DataGridClickCallbackFunction {
    (this: HTMLElement, event: MouseEvent): void;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGridOptions;
