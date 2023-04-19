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
 * Processor for the `AVERAGE(...values)` implementation. Calculates the average
 * value of the given values.
 *
 * @private
 * @function Formula.ProcessorFunction.types.AVERAGE
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
    let count = 0,
        result = 0;

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
                result += value;
            }
        } else if (value instanceof Array) {
            for (let j = 0, jEnd = value.length, jValue: Value; j < jEnd; ++j) {
                jValue = value[j];
                if (typeof jValue === 'number' && !isNaN(jValue)) {
                    ++count;
                    result += jValue;
                }
            }
        }
    }

    return (count ? (result / count) : 0);
}


/* *
 *
 *  Registry
 *
 * */


const Average: FormulaFunction = {
    process
};


FormulaFunction.registerType('AVERAGE', Average);


/* *
 *
 *  Default Export
 *
 * */


export default Average;
