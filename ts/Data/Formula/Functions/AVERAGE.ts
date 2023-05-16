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


import type {
    Arguments,
    Value
} from '../FormulaTypes';
import type DataTable from '../../DataTable';


import FormulaProcessor from '../FormulaProcessor.js';
const { getArgumentsValues } = FormulaProcessor;

/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `AVERAGE(...values)` implementation. Calculates the average
 * of the given values that are numbers.
 *
 * @private
 * @function Formula.processorFunctions.AVERAGE
 *
 * @param {Highcharts.FormulaArguments} args
 * Arguments to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to use for references and ranges.
 *
 * @return {number}
 * Result value of the process.
 */
function AVERAGE(
    args: Arguments,
    table?: DataTable
): number {
    const values = getArgumentsValues(args, table);

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

        switch (typeof value) {
            case 'number':
                if (!isNaN(value)) {
                    ++count;
                    result += value;
                }
                break;
            case 'object':
                for (
                    let j = 0,
                        jEnd = value.length,
                        value2: Value;
                    j < jEnd;
                    ++j
                ) {
                    value2 = value[j];
                    if (
                        typeof value2 === 'number' &&
                        !isNaN(value2)
                    ) {
                        ++count;
                        result += value2;
                    }
                }
                break;
        }
    }

    return (count ? (result / count) : 0);
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('AVERAGE', AVERAGE);


/* *
 *
 *  Default Export
 *
 * */


export default AVERAGE;
