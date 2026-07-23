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
 * Per-column aggregation is configured on the columns and can target a specific
 * row through the row id exposed in the aggregator context.
 */
export type SummaryOptions = (SummaryRowOptions | SummaryRowOptions[]);

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
     * Stable id of the summary row, surfaced in the summary column aggregator
     * and label context. Defaults to the row index.
     */
    id?: string;
}

/**
 * Context passed to a summary column aggregator or label callback.
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
 * Aggregator option accepted by a summary column.
 */
export type SummaryColumnAggregatorOption =
    AggregatorOption<SummaryColumnAggregatorContext>;

/**
 * Static or resolved label rendered in a non-aggregated summary cell.
 */
export type SummaryColumnLabel = (
    string |
    ((context: SummaryColumnAggregatorContext) => (string | null | undefined))
);

/**
 * Summary options for a single column.
 */
export interface SummaryColumnOptions {
    /**
     * Aggregator applied to this column in the summary rows.
     *
     * When a string, that Formula processor function name (for example `SUM`)
     * is applied to every value in the column. When a callback, it receives
     * the summary row context and returns a function name, or a falsy value to
     * skip aggregation for that column/row.
     *
     * @sample grid-pro/options/summary-rows Summary row
     */
    aggregator?: SummaryColumnAggregatorOption;

    /**
     * Label rendered in this column's summary cell when the column is not
     * aggregated (for example `'Total'` in the first column). A callback can
     * return a different label per summary row.
     */
    label?: SummaryColumnLabel;
}
