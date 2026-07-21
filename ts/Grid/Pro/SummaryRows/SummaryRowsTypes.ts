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
 * Feature-level options for flat summary (total) rows.
 */
export interface SummaryOptions {
    /**
     * Enables the summary row.
     * @default false
     */
    enabled?: boolean;
}

/**
 * Context passed to a summary column aggregator callback.
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
}

/**
 * Aggregator option accepted by a summary column.
 */
export type SummaryColumnAggregatorOption =
    AggregatorOption<SummaryColumnAggregatorContext>;

/**
 * Summary options for a single column.
 */
export interface SummaryColumnOptions {
    /**
     * Aggregator applied to this column in the summary row.
     *
     * When a string, that Formula processor function name (for example `SUM`)
     * is applied to every value in the column. When a callback, it returns a
     * function name or a falsy value to skip aggregation for this column.
     *
     * @sample grid-pro/summary-rows/grand-total Summary row
     */
    aggregator?: SummaryColumnAggregatorOption;

    /**
     * Static label rendered in this column's summary cell when the column is
     * not aggregated (for example `'Total'` in the first column).
     */
    label?: string;
}
