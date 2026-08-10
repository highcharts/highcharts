/* *
 *
 *  Grid Summary Rows Types
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type {
    CellType as DataTableCellType,
    RowObject as DataTableRowObject
} from '../../../Data/DataTable';
import type { AggregatorOption } from '../Aggregation/AggregationTypes';
import type { StyleValue } from '../../Core/GridUtils';
import type SummaryTableCell from './SummaryTableCell';
import type SummaryTableRow from './SummaryTableRow';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options for a summary (total) row.
 *
 * Provide a single object to render one summary row, or an array of objects to
 * render several (mirroring the `dataLabels` object-or-array convention).
 */
export type SummaryOptions = (SummaryRowOptions | SummaryRowOptions[]);

/**
 * Context passed to a summary aggregator callback.
 */
export interface SummaryColumnAggregatorContext {
    /**
     * Aggregated source column id.
     */
    columnId: string;

    /**
     * Number of data rows the aggregation runs over.
     */
    rowCount: number;

    /**
     * Id of the summary row being resolved.
     */
    summaryRowId: string;

    /**
     * Zero-based index of the summary row being resolved.
     */
    summaryRowIndex: number;
}

/**
 * Aggregator option: a registered Formula processor function name (for example
 * `SUM`), or a callback returning one.
 */
export type SummaryAggregatorOption =
    AggregatorOption<SummaryColumnAggregatorContext>;

/**
 * Per-column configuration within a summary row (a "mini" `columns[]` entry).
 *
 * The column is referenced by `id`. Provide `aggregator` to aggregate the
 * column, or `value` for a static cell (for example a `'Total'` label). Without
 * either, the row's `aggregator` default applies.
 */
export interface SummaryColumnOptions {
    /**
     * Referenced source column id.
     */
    id: string;

    /**
     * Aggregator applied to this column, overriding the row `aggregator`
     * default. Set it to `false` to leave the cell empty, for example in a text
     * column where a numeric aggregator would resolve to `0`. A static `value`
     * suppresses the row default as well.
     */
    aggregator?: SummaryAggregatorOption;

    /**
     * Static value rendered in this column (no aggregation), for example a
     * `'Total'` label. Takes precedence over the row `aggregator` default.
     */
    value?: DataTableCellType;

    /**
     * Format applied to this summary cell only, overriding the column's
     * `cells.format`. Works like a regular cell format; the formatted value is
     * the aggregated value or `value`.
     */
    format?: string;

    /**
     * Additional class name for this summary cell, added on top of the column's
     * `cells.className`. It uses templating, where the context is the summary
     * cell instance.
     */
    className?: string;

    /**
     * CSS styles for this summary cell, merged over the column's `cells.style`.
     * Can be a static style object or a callback that returns one.
     */
    style?: StyleValue<SummaryTableCell>;
}

/**
 * Options for a single summary row.
 */
export interface SummaryRowOptions {
    /**
     * Whether the summary row is rendered.
     * @default true
     */
    enabled?: boolean;

    /**
     * Stable id of the summary row, surfaced in the aggregator context.
     * Defaults to the row index.
     */
    id?: string;

    /**
     * Default aggregator applied to every column of the row, except columns
     * given an explicit `aggregator` or `value` in `columns`.
     *
     * @sample grid-pro/options/summary-rows Summary rows
     */
    aggregator?: SummaryAggregatorOption;

    /**
     * Format applied to every cell of the row, overriding the columns'
     * `cells.format`. A `format` in `columns` overrides it for that cell; set it
     * there to `'{value}'` to render a cell unformatted.
     */
    format?: string;

    /**
     * Additional class name for the summary row element.
     */
    className?: string;

    /**
     * CSS styles for the summary row element. Can be a static style object or a
     * callback that returns one.
     */
    style?: StyleValue<SummaryTableRow>;

    /**
     * Per-column overrides for this row (aggregator or static value),
     * referenced by column `id`.
     */
    columns?: SummaryColumnOptions[];

    /**
     * Where the summary row is stuck relative to the scrollable body.
     * @default 'bottom'
     */
    position?: SummaryRowPosition;

    /**
     * Rows the aggregation runs over, as a stage of the data pipeline. Each
     * value narrows the previous one, so several rows can render a page
     * subtotal, a filtered total and an unfiltered grand total side by side.
     *
     * - `'all'`: every source row, ignoring the active filters. Requires a
     *   local data provider.
     * - `'filtered'`: the rows left by filtering, across all pages.
     * - `'page'`: the rows of the current page. Requires pagination.
     *
     * A value that does not apply falls back to `'filtered'` and is reported
     * once. `'page'` is also unsupported with TreeView and row grouping, where
     * a page is a range of projected rows that the aggregated rows do not line
     * up with.
     *
     * @default 'filtered'
     */
    scope?: SummaryRowScope;
}

/**
 * Placement of a summary row relative to the scrollable body.
 */
export type SummaryRowPosition = ('top' | 'bottom');

/**
 * Rows a summary row aggregates, as a stage of the data pipeline.
 */
export type SummaryRowScope = ('all' | 'filtered' | 'page');

/**
 * Resolved summary row ready to render: cell values plus the per-cell format,
 * class name and style overrides keyed by column id.
 */
export interface SummaryRenderRow {
    /**
     * Cell values keyed by column id.
     */
    data: DataTableRowObject;

    /**
     * Per-cell format overrides keyed by column id.
     */
    formats: Record<string, string>;

    /**
     * Per-cell class names keyed by column id.
     */
    classNames: Record<string, string>;

    /**
     * Per-cell styles keyed by column id.
     */
    styles: Record<string, StyleValue<SummaryTableCell>>;

    /**
     * Class name for the row element.
     */
    className?: string;

    /**
     * Styles for the row element.
     */
    style?: StyleValue<SummaryTableRow>;

    /**
     * Where the row is stuck relative to the scrollable body.
     */
    position: SummaryRowPosition;
}
