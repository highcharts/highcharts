/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


'use strict';

/* eslint-disable new-cap */


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


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `SUM(...values)` implementation. Calculates the sum of the
 * given values.
 *
 * @private
 * @function Formula.processorFunctions.SUM
 *
 * @param {Highcharts.FormulaArguments} args
 * Arguments to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to process.
 *
 * @return {number}
 * Result value of the process.
 */
function SUM(
    args: Arguments,
    table?: DataTable
): number {
    const values = FormulaProcessor.getArgumentsValues(args, table);

    let result = 0;

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
                    result += value;
                }
                break;
            case 'object':
                result += SUM(value, table);
                break;
        }
    }

    return result;
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('SUM', SUM); // 🐝


/* *
 *
 *  Default Export
 *
 * */


export default SUM;
