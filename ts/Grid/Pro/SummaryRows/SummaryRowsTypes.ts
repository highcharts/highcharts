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
    CellType as DataTableCellType
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
 * Configuration of a single summary cell (a column within a summary row).
 *
 * The column is referenced by `columnId`. Provide `aggregator` to aggregate the
 * column, or `value` for a static cell (for example a `'Total'` label). Without
 * either, the row's `aggregator` default applies.
 */
export interface SummaryCellOptions {
    /**
     * Referenced source column id.
     */
    columnId: string;

    /**
     * Aggregator applied to this cell, overriding the row `aggregator` default.
     */
    aggregator?: SummaryAggregatorOption;

    /**
     * Static value rendered in this cell (no aggregation), for example a
     * `'Total'` label. Takes precedence over the row `aggregator` default.
     */
    value?: DataTableCellType;
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
     * Default aggregator applied to every column of the row, except cells
     * given an explicit `aggregator` or `value` in `cells`.
     *
     * @sample grid-pro/options/summary-rows Summary rows
     */
    aggregator?: SummaryAggregatorOption;

    /**
     * Per-cell overrides for this row (aggregator or static value), keyed by
     * `columnId`.
     */
    cells?: SummaryCellOptions[];
}
