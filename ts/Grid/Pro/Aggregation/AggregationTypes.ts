/* *
 *
 *  Grid Aggregation Types
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
 *  Declarations
 *
 * */

/**
 * Result returned by an aggregator callback.
 *
 * Return a registered Formula processor function name (for example `SUM`),
 * or a falsy value to skip aggregation.
 */
export type AggregatorResult = (false|null|string|undefined);

/**
 * Callback deciding which aggregation function should be applied.
 *
 * @param context
 * Feature-specific context describing what is being aggregated.
 */
export interface AggregatorCallback<TContext> {
    (context: TContext): AggregatorResult;
}

/**
 * Aggregator option accepted by an aggregating feature.
 *
 * When provided as a string, that Formula processor function name is always
 * applied. When provided as a callback, it is invoked per aggregation and
 * should return a function name or a falsy value to skip aggregation.
 */
export type AggregatorOption<TContext> = (
    string |
    AggregatorCallback<TContext>
);


/* *
 *
 *  Default Export
 *
 * */

export default AggregatorOption;
