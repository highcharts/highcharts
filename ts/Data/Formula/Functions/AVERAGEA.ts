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
const { getArgumentValue } = FormulaProcessor;
import FormulaTypes from '../FormulaTypes.js';
const { asNumber } = FormulaTypes;


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `AVERAGEA(...values)` implementation. Calculates the
 * average of the given values. Strings and FALSE are calculated as 0.
 *
 * @private
 * @function Formula.processorFunctions.AVERAGEA
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
function AVERAGEA(
    args: Arguments,
    table?: DataTable
): number {
    let count = 0,
        result = 0;

    for (
        let i = 0,
            iEnd = args.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = getArgumentValue(args[i], table);

        if (typeof value !== 'object') {
            value = asNumber(value);
            if (!isNaN(value)) {
                ++count;
                result += value;
            }
            continue;
        }

        for (let j = 0, jEnd = value.length, jValue: number; j < jEnd; ++j) {
            jValue = asNumber(value[j]);
            if (!isNaN(jValue)) {
                ++count;
                result += jValue;
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


FormulaProcessor.registerProcessorFunction('AVERAGEA', AVERAGEA);


/* *
 *
 *  Default Export
 *
 * */


export default AVERAGEA;
