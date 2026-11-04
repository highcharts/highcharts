/* *
 *
 *  Grid Aggregation
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
import type {
    Arguments as FormulaArguments
} from '../../../Data/Formula/Formula';
import type { AggregatorOption } from './AggregationTypes';

import { isCellValue } from '../../../Data/DataTable.js';
import Formula from '../../../Data/Formula/Formula.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Resolves the aggregation function name for an aggregator option.
 *
 * The resolved name is normalized (trimmed and upper-cased) to match the
 * canonical keys of the Formula processor functions registry.
 *
 * @param aggregator
 * Aggregator option, either a function name or a callback returning one.
 *
 * @param context
 * Context passed to the aggregator callback.
 *
 * @return
 * Canonical function name, or `undefined` when aggregation should be skipped.
 */
function resolveAggregatorName<TContext>(
    aggregator: (AggregatorOption<TContext> | undefined),
    context: TContext
): string | undefined {
    if (!aggregator) {
        return;
    }

    const result = (
        typeof aggregator === 'function' ?
            aggregator(context) :
            aggregator
    );

    if (typeof result !== 'string') {
        return;
    }

    return result.trim().toUpperCase() || void 0;
}

/**
 * Executes a registered Formula processor function on a set of values.
 *
 * @param functionName
 * Registered Formula processor function name.
 *
 * @param values
 * Values to aggregate.
 *
 * @return
 * Aggregated cell value, or `null` when the function is unknown or fails.
 */
function executeAggregate(
    functionName: string,
    values: Array<Exclude<DataTableCellType, null | undefined>>
): DataTableCellType {
    const processor = Formula.processorFunctions[functionName];
    if (!processor) {
        return null;
    }

    try {
        const result = processor(values as unknown as FormulaArguments);
        return isCellValue(result) ? result : null;
    } catch {
        return null;
    }
}


/* *
 *
 *  Default Export
 *
 * */

const Aggregation = {
    executeAggregate,
    resolveAggregatorName
};

export default Aggregation;
