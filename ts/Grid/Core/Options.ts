/* *
 *
 *  Grid options
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type {
    A11yOptions,
    HeaderCellA11yOptions,
    LangAccessibilityOptions
} from './Accessibility/A11yOptions';
import type {
    PaginationLangOptions,
    PaginationOptions
} from './Pagination/PaginationOptions';
import type { ColumnResizingMode } from './Table/ColumnResizing/ColumnResizing';
import type { ColumnDataType } from './Table/Column';
import type DataTable from '../../Data/DataTable';
import type DataTableOptions from '../../Data/DataTableOptions';
import type Cell from './Table/Cell';
import type Column from './Table/Column';
import type { LangOptionsCore } from '../../Shared/LangOptionsCore';
import type {
    Condition as ColumnFilteringCondition
} from './Table/Actions/ColumnFiltering/FilteringTypes';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Callback function to be called when a header event is triggered. Returns a
 * formatted cell's string.
 */
export type CellFormatterCallback = (this: Cell) => string;

/**
 * Callback function to be called when a header event is triggered. Returns a
 * formatted header's string.
 */
export type HeaderFormatterCallback = (this: Column) => string;

/**
 * Column sorting order type.
 */
export type ColumnSortingOrder = 'asc' | 'desc' | null;


/**
 * Options to control the content and the user experience of a grid structure.
 */
export interface Options {

    /**
     * Accessibility options for the grid.
     */
    accessibility?: A11yOptions;

    /**
     * Pagination options for the grid.
     */
    pagination?: PaginationOptions;

    /**
     * Options for the table caption.
     */
    caption?: CaptionOptions;

    /**
     * Default options for all the columns in the grid. Can be overridden
     * by the `dataTypeColumnDefaults` and individual column options.
     */
    columnDefaults?: ColumnOptions;

    /**
     * Options for individual columns.
     */
    columns?: Array<IndividualColumnOptions>;

    /**
     * Data table with the data to display in the grid structure.
     */
    dataTable?: DataTable | DataTableOptions;

    /**
     * Options for the description of the grid.
     */
    description?: DescriptionOptions;

    /**
     * Defines the structure of levels in header. Used for grouping columns
     * headers.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/grouped-headers | Grouped headers}
     */
    header?: Array<GroupedHeaderOptions | string>;

    /**
     * The unique id of the grid. It is generated automatically, if not set.
     */
    id?: string;

    /**
     * Language options for the grid.
     */
    lang?: LangOptions;

    /**
     * Time options for the grid.
     */
    time?: TimeOptions;

    /**
     * Options to control the way grid is rendered.
     */
    rendering?: RenderingSettings;
}

/**
 * Options to control the way grid is rendered.
 */
export interface RenderingSettings {
    /**
     * Options to control the columns rendering.
     */
    columns?: ColumnsSettings;

    /**
     * Options to control the rows rendering.
     */
    rows?: RowsSettings;

    /**
     * Options to control the header rendering.
     */
    header?: HeaderSettings;

    /**
     * Options to control the table rendering.
     */
    table?: TableSettings;

    /**
     * The theme of the Grid. It will set the class name on the container.
     * Can be set to the empty string to disable the theme.
     *
     * @default 'hcg-theme-default'
     */
    theme?: string;
}

/**
 * Options to control the columns rendering.
 */
export interface ColumnsSettings {

    /**
     * Columns included in the grid structure - contains the columns IDs.
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
     * Options for the columns resizing.
     */
    resizing?: ResizingOptions;
}

/**
 * Options to control the columns resizing.
 */
export interface ResizingOptions {
    /**
     * Whether the columns resizing is enabled. If `true`, the user can
     * resize the columns by dragging the column header edges.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/column-resizing-disabled | Column resize disabled}
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Determines how column widths are adjusted when resizing.
     * - `'adjacent'`: Resizing a column will also adjust the width of its
     *   immediate neighbor, keeping the rest of the columns in the same place.
     *   This is the default mode.
     * - `'independent'`: Only the resized column is changed; all columns to
     *   its right retain their current pixel widths, effectively "freezing"
     *   their widths.
     * - `'distributed'`: Only the resized column is affected; other column
     *   width settings will not be changed.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/column-resizing | Resizing overview}
     *
     * @default 'adjacent'
     */
    mode?: ColumnResizingMode;
}

/**
 * Options to control the rows rendering.
 */
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
     * Defines the minimum height of the table body (`tbody`) based on the
     * number of rows that should be visible in the viewport.
     *
     * If set to `null`, the minimum height will not be enforced.
     *
     * It's ignored when height of the container is set or the `min-height`
     * style is set on the `tbody` by the user.
     *
     * @default 2
     */
    minVisibleRows?: number | null;

    /**
     * Whether the height of the rows should be calculated automatically based
     * on the content of the cells. If `true`, the ellipsis will be used to
     * indicate that the content is too long to fit in the cell.
     *
     * When there is no need to have different row heights, it is recommended
     * to set this option to `true` for the performance reasons, to avoid the
     * unnecessary calculations.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/strict-row-heights | Strict row heights}
     *
     * @default false
     */
    strictHeights?: boolean;

    /**
     * Rows virtualization option render rows that are visible in the viewport
     * only. In case of large data set, the enabled option improve performance
     * and saves memory.
     *
     * The option is automatically set to `true` when the number of rows exceeds
     * the `virtualizationThreshold` option value. If defined, it takes the
     * precedence over the `virtualizationThreshold` option.
     *
     * @default false
     */
    virtualization?: boolean;

    /**
     * The rows virtualization threshold option sets the row count limit at
     * which virtualization is activated. When the number of rows exceeds this
     * threshold, virtualization is enabled to optimize performance.
     *
     * The option has no effect when the `virtualization` option is defined.
     *
     * @default 50
     */
    virtualizationThreshold?: number;
}

/**
 * Options to control the header rendering.
 */
export interface HeaderSettings {
    /**
     * Whether the header should be rendered.
     *
     * @default true
     */
    enabled?: boolean;
}

/**
 * Options to control the table rendering.
 */
export interface TableSettings {
    /**
     * The custom CSS class name for the table.
     */
    className?: string;
}

/**
 * Column options that can be shared between columns but can be set for each
 * column individually.
 */
export interface ColumnOptions {

    /**
     * Options for all cells in the column.
     */
    cells?: ColumnCellOptions;

    /**
     * The data type of the column. Can be one of `string`, `number`,
     * `boolean` or `date`.
     *
     * If not set, the data type is inferred from the first cell in the
     * column.
     */
    dataType?: ColumnDataType;

    /**
     * Options for all the header cells in the column.
     */
    header?: ColumnHeaderOptions;

    /**
     * Column sorting options.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/sorting-options | Sorting options}
     */
    sorting?: ColumnSortingOptions;

    /**
     * The width of the column. It can be set in pixels or as a percentage of
     * the table width. If unset, the width is distributed evenly between all
     * columns.
     *
     * This option does not work with the `resizing` option set to `full`.
     *
     * If the `resizing` option is undefined, it is set to `mixed` and the
     * `width` option is used to set the width of the column.
     */
    width?: number | string;

    /**
     * Filtering options for the column.
     */
    filtering?: ColumnFilteringOptions;
}

/**
 * Options for all cells in the column.
 */
export interface ColumnCellOptions {

    /**
     * Allows to define an additional class name to all table cells in the
     * column. Applied only to cell that are in the table, not in the column
     * header. It is updated with every cell's value change.
     *
     * It uses templating, where context is the table cell instance.
     *
     * @default undefined
     */
    className?: string;

    /**
     * The format of the cell content within the given column of the grid.
     * Applied only to cell that are in the table, not in the column header.
     *
     * When not set, the default format `'{value}'` is used.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/cell-formatting/ | Cell formatting}
     *
     * @default undefined
     */
    format?: string;

    /**
     * Callback function for formatting cells within the given column of the
     * grid. Applied only to cell that are in the table not the column
     * header.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/cell-formatting/ | Cell formatting}
     *
     * @return
     * A string to be set as a table cell's content.
     */
    formatter?: CellFormatterCallback;
}

/**
 * Options for the header cells in the columns.
 */
export interface ColumnHeaderOptions {

    /**
     * Allows user to define an additional class name only to the column header.
     *
     * It uses templating, where context is the header cell instance.
     *
     * @default undefined
     */
    className?: string;

    /**
     * The format of the column header. Use `{id}` to display the column id.
     */
    format?: string;

    /**
     * Callback function for formatting the column header. It is called for each
     * column header cell.
     *
     * @return
     * A string to be set as a header cell's content.
     */
    formatter?: HeaderFormatterCallback;
}

/**
 * Column sorting options available for applying to all columns at once.
 */
export interface ColumnSortingOptions {
    /**
     * Whether to allow users to sort values in column. When it is enabled,
     * the column header will be clickable.
     *
     * When sorting is disabled (`false`), this column cannot be sorted by the
     * user interface. However, the order of rows in this column may still
     * change when other columns are sorted.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/sorting-options | Sorting options}
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * @deprecated
     * Use `enabled` instead
     */
    sortable?: boolean;

    /**
     * Custom compare function to sort the column values. It overrides the
     * default sorting behavior. If not set, the default sorting behavior is
     * used.
     *
     * @param a
     * The first value to compare.
     *
     * @param b
     * The second value to compare.
     *
     * @return
     * A number indicating whether the first value (`a`) is less than (`-1`),
     * equal to (`0`), or greater than (`1`) the second value (`b`).
     */
    compare?: (a: DataTable.CellType, b: DataTable.CellType) => number;
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
     * The custom CSS class name for the column. Applied also to cells that are
     * in the table and also to the column header cells.
     *
     * It does not use templating.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/custom-class | Custom class}
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
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/overview | Disabled meta column}
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
     * The caption of the grid.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/overview | Caption}
     */
    text?: string;
}

export interface DescriptionOptions {
    /**
     * The custom CSS class name for the description.
     */
    className?: string;

    /**
     * The description of the grid.
     */
    text?: string;
}

/**
 * Options to control the structure of table header.
 */
export interface GroupedHeaderOptions {

    /**
     * Accessibility options for one of the column header cells.
     */
    accessibility?: HeaderCellA11yOptions;

    /**
     * The format of the column header. Use `{id}` to display the column id.
     */
    format?: string;

    /**
     * The custom CSS class name for the header.
     */
    className?: string;

    /**
     * The id of column with data.
     */
    columnId?: string;

    /**
     * Current level of header in the whole header tree.
     * @internal
     * @private
     */
    level?: number;

    /**
     * Columns that are displayed below the header.
     */
    columns?: GroupedHeaderOptions[];
}

/**
 * Options for the credits label.
 */
export interface CreditsOptions {
    /**
     * Whether to show the credits.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The URL that will be opened when the credits label is clicked.
     *
     * @default 'https://www.highcharts.com?credits'
     */
    href?: string;

    /**
     * The text for the credits label.
     *
     * Reference to Highcharts icon, that is enabled in Grid Lite, by default.
     *
     */
    text?: string;

    /**
     * The position of the credits label.
     *
     * @default 'bottom'
     */
    position?: 'bottom' | 'top';
}


/**
 * Language options for the grid.
 */
export interface LangOptions extends LangOptionsCore {

    /**
     * Configure the accessibility strings in the chart.
     */
    accessibility?: LangAccessibilityOptions;

    /**
     * The text to display when the loading indicator is shown.
     *
     * @default 'Loading...'
     */
    loading?: string;

    /**
     * The text to display when there is no data to show.
     *
     * @default 'No data to display'
     */
    noData?: string;

    /**
     * `Filter` translation.
     *
     * @default 'Filter'
     */
    filter?: string;

    /**
     * `Sort ascending` translation.
     *
     * @default 'Sort ascending'
     */
    sortAscending?: string;

    /**
     * `Sort descending` translation.
     *
     * @default 'Sort descending'
     */
    sortDescending?: string;

    /**
     * `Column` translation.
     *
     * @default 'Column'
     */
    column?: string;

    /**
     * `Set filter` translation.
     *
     * @default 'Set filter'
     */
    setFilter?: string;

    /**
     * Language options for column filtering conditions.
     */
    columnFilteringConditions?: Partial<
        Record<ColumnFilteringCondition, string>
    >;

    /**
     * Language options for pagination text values.
     */
    pagination?: PaginationLangOptions;
}


/**
 * Options for the time settings.
 */
export interface TimeOptions {
    /**
     * The timezone to use for formatting time and date. The time zone names
     * can be different between browsers, as described in [mdn docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timezone).
     *
     * @default 'UTC'
     */
    timezone?: string;
}

/**
 * Column filtering options.
 */
export interface FilteringCondition {
    /**
     * The condition to use for filtering the column.
     */
    condition?: ColumnFilteringCondition;

    /**
     * The value that is used with the condition to filter the column.
     */
    value?: string | number | boolean | null;
}

export interface ColumnFilteringOptions extends FilteringCondition {
    /**
     * Whether the filtering is enabled or not.
     */
    enabled?: boolean;

    /**
     * Whether the filtering inputs should be rendered inline in the special
     * table header row (`true`), or should be accessed via a popup (`false`).
     *
     * @default false
     */
    inline?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default Options;
