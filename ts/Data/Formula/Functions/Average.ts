/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { Value } from '../FormulaTypes';

import ProcessorFunction from './ProcessorFunction.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Processor for the `AVERAGE(...values)` implementation. Calculates the average
 * value of the given values.
 *
 * @private
 * @function Formula.ProcessorFunction.types.AVERAGE
 *
 * @param {Array<(Formula.Value|Array<Formula.Value>)>} values
 * Values to process.
 *
 * @return {Formula.Value}
 * Result value of the process.
 */
function process(
    values: Array<(Value|Array<Value>)>
): Value {
    let result = 0;

    for (
        let i = 0,
            iEnd = values.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = values[i];

        if (typeof value === 'number') {
            result += value;
        } else {
            result += process(value);
        }
    }

    return (result / values.length);
}

/* *
 *
 *  Registry
 *
 * */


const Average: ProcessorFunction = {
    process
};

ProcessorFunction.registerType('AVERAGE', Average);

/* *
 *
 *  Default Export
 *
 * */

export default Average;
