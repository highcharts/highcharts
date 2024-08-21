/* *
 *
 *  DataGrid options
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../Data/DataTable';
import type DataTableOptions from '../Data/DataTableOptions';
import type Cell from './Cell';
import Column from './Column';


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
 * Callback function to be called when a cell event is triggered.
 */
export type CellEventCallback = (this: Cell) => void;

/**
 * Callback function to be called when a column event is triggered.
 */
export type ColumnEventCallback = (this: Column) => void;

/**
 * Callback function to be called when a header event is triggered. Returns a
 * formatted cell's string.
 */
export type CellFormatterCallback = (this: Cell) => string;

/**
 * Column sorting order type.
 */
export type ColumnSortingOrder = 'asc' | 'desc' | null;


/**
 * Options to control the content and the user experience of a grid structure.
 */
export interface Options {
    /**
     * Options for individual columns.
     */
    columns?: Array<IndividualColumnOptions>;

    /**
     * Options applied to all elements in the datagrid by default. Can be
     * overridden by individual options.
     */
    defaults?: DataGridDefaults;

    /**
     * Events options triggered by the datagrid elements.
     */
    events?: DataGridEvents;

    /**
     * Options to control the way datagrid is rendered.
     */
    settings?: DataGridSettings;

    /**
     * Data table with the data to display in the grid structure.
     */
    table?: DataTable | DataTableOptions;
}

/**
 * Options to control the way datagrid is rendered.
 */
export interface DataGridSettings {
    /**
     * Options for the table caption.
     */
    caption?: CaptionOptions;

    /**
    * Options to control the columns behavior and rendering.
    */
    columns?: ColumnsSettings;

    /**
    * Options to control the rows behavior and rendering.
    */
    rows?: RowsSettings;

    /**
    * Defines the structure of levels in header. Used for grouping columns
    * headers.
    */
    header?: GroupedHeader[];
}

export interface ColumnsSettings {
    /**
     * The distribution of the columns. If `full`, the columns will be
     * distributed so that the first and the last column are at the edges of
     * the grid. If `fixed`, the columns will have a fixed width in pixels.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/fixed-distribution | Fixed distribution}
     *
     * @default 'full'
     */
    distribution?: ColumnDistribution;

    /**
     * Columns included in the grid structure- contains the columns IDs.
     * If not set, all columns will be included. Useful when many columns needs
     * to be excluded from the grid.
     *
     * Individual column options `enabled` options can be set to `false` to
     * disable a column.
     *
     * @private
     */
    included?: Array<string>;

    /**
     * Whether the columns should be resizable.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/column-resizing-disabled | Column resize disabled}
     *
     * @default true
     */
    resizable?: boolean;
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
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/strict-row-heights | Strict row heights}
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
     * Default options for all the columns in the datagrid. Can be overridden
     * by individual column options.
     */
    columns?: ColumnOptions;
}

/**
 * Column options that can be shared between columns but can be set for each
 * column individually.
 */
export interface ColumnOptions {
    /**
     * The format of the cell content within the given column of the datagrid.
     * Applied only to cell that are in the table not the column header.
     *
     * When not set, the default format `'{id}'` is used.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-formatting/ | Cell formatting}
     *
     * @default undefined
     */
    cellFormat?: string;

    /**
     * Callback function for formatting cells within the given column of the
     * datagrid. Applied only to cell that are in the table not the column
     * header.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-formatting/ | Cell formatting}
     *
     * @return
     * A string to be concatenated in to the common cell's text.
     */
    cellFormatter?: CellFormatterCallback;

    /**
     * The format of the column header. Use `{id}` to display the column id.
     */
    headerFormat?: string;

    /**
     * Weather to use HTML to render the cell content. When enabled, other
     * elements than text can be added to the cell ie. images.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/custom-html | Custom HTML}
     *
     * @default false
     */
    useHTML?: boolean;

    /**
     * Whether to make the column cells editable `true`, or read-only `false`.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/overview | Editable columns disabled}
     *
     * @default true
     */
    editable?: boolean;

    /**
     * Column sorting options.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/sorting-options | Sorting options}
     */
    sorting?: ColumnSortingOptions;
}

/**
 * Column sorting options avalable for applying to all columns at once.
 */
export interface ColumnSortingOptions {
    /**
     * Whether to allow users to sort values in column. When it is enabled,
     * the column header will be clickable.
     *
     * When sorting is disabled `false`, this column cannot be sorted by the
     * user interface. However, the order of rows in this column may still
     * change when other columns are sorted.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/sorting-options | Sorting options}
     *
     * @default true
     */
    sortable?: boolean;
}

/**
 * Column sorting options that can be set for each column individually.
 */
export interface IndividualColumnSortingOptions extends ColumnSortingOptions {
    /**
     * The initial sorting order of the column. Can be either `asc` for
     * ascending, `desc` for descending, or `null` for disabled.
     *
     * @default null
     */
    order?: ColumnSortingOrder;
}

/**
 * Column options that can be set for each column individually.
 */
export interface IndividualColumnOptions extends ColumnOptions {
    /**
     * The custom CSS class name for the column. Applied only to cell that are
     * in the table not the column header.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/demo/datagrid-custom-class | Custom class}
     *
     * @default undefined
     */
    className?: string;

    /**
     * Whether the column is enabled and should be displayed. If `false`, the
     * column will not be rendered.
     *
     * Shorter way to disable multiple columns at once is to use the `included`
     * array in the `columns` settings.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/overview | Disabled meta column}
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The id of the column in the data table for which the options are applied.
     */
    id: string;

    sorting?: IndividualColumnSortingOptions;
}

export interface CaptionOptions {
    /**
     * The custom CSS class name for the table caption.
     */
    className?: string;

    /**
     * The caption of the datagrid.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/overview | Caption}
     */
    text?: string;
}

/**
 * Events options.
 */
export interface DataGridEvents {
    /**
     * Events related to the cells.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-events/ | Datagrid events}
     */
    cell?: CellEvents;

    /**
     * Events related to the column.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-events/ | Datagrid events}
     */
    column?: ColumnEvents

    /**
     * Events related to the header.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-events/ | Datagrid events}
     */
    header?: HeaderEvents
}

/**
 * Events related to the cells.
 */
export interface CellEvents {
    /**
     * Callback function to be called when the cell is clicked.
     */
    click?: CellEventCallback;

    /**
     * Callback function to be called when the cell is hovered.
     */
    mouseOver?: CellEventCallback;

    /**
     * Callback function to be called when the cell is no longer hovered.
     */
    mouseOut?: CellEventCallback;

    /**
     * Callback function to be called after editing of cell value.
     */
    afterEdit?: CellEventCallback;
}


export interface ColumnEvents {
    /**
     * Callback function to be called when the column is sorted for instance,
     * after clicking on header.
     */
    afterSorting?: ColumnEventCallback;

    /**
     * Callback function to be called when the column is resized.
     */
    afterResize?: ColumnEventCallback;
}

export interface HeaderEvents {
    /**
     * Callback function to be called when the header is clicked.
     */
    click?: ColumnEventCallback;
}

export interface GroupedHeader {
    /**
     * The format of the column header. Use `{id}` to display the column id.
     */
    headerFormat?: string;
    /**
     * Weather to use HTML to render the cell content. When enabled, other
     * elements than text can be added to the cell ie. images.
     */
    useHTML?: boolean;
    /**
     * The custom CSS class name for the table caption.
     */
    className?: string;
    /**
     * The id of column with data.
     */
    columnId?: string;
    /**
     * Current level of header in the whole header tree.
     * @private
     */
    level?: number;
    /**
     * Columns that are displayed below the header.
     */
    columns?: GroupedHeader[];
}
/* *
 *
 *  Default Export
 *
 * */

export default Options;
