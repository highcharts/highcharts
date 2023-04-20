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


import FormulaFunction from './FormulaFunction.js';


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `COUNT(range)` implementation. Returns the number of
 * given values that are numbers.
 *
 * @private
 * @function Formula.ProcessorFunction.types.COUNT
 *
 * @param {Array<(Highcharts.FormulaValue|Array<Highcharts.FormulaValue>)>} values
 * Values to process.
 *
 * @return {number}
 * Result value of the process.
 */
function process(
    values: Array<(Value|Array<Value>)>
): number {
    let count = 0;

    for (
        let i = 0,
            iEnd = values.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = values[i];

        if (typeof value === 'number') {
            if (!isNaN(value)) {
                ++count;
            }
        } else if (value instanceof Array) {
            count += process(value);
        }
    }

    return count;
}


/* *
 *
 *  Registry
 *
 * */


const Count: FormulaFunction = {
    process
};


FormulaFunction.registerType('COUNT', Count);


/* *
 *
 *  Default Export
 *
 * */


export default Count;
