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
     * Per-column overrides for this row (aggregator or static value),
     * referenced by column `id`.
     */
    columns?: SummaryColumnOptions[];

    /**
     * Where the summary row is stuck relative to the scrollable body.
     * @default 'bottom'
     */
    position?: SummaryRowPosition;
}

/**
 * Placement of a summary row relative to the scrollable body.
 */
export type SummaryRowPosition = ('top' | 'bottom');

/**
 * Resolved summary row ready to render: cell values plus per-cell format
 * overrides keyed by column id.
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
     * Where the row is stuck relative to the scrollable body.
     */
    position: SummaryRowPosition;
}
