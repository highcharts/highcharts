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

/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `MOD(value1, value2)` implementation. Calculates the rest
 * of the division with the given values.
 *
 * @private
 * @function Formula.processorFunctions.MOD
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
function MOD(
    args: Arguments,
    table?: DataTable
): number {
    let value1 = getArgumentValue(args[0], table),
        value2 = getArgumentValue(args[1], table);

    if (typeof value1 === 'object') {
        value1 = value1[0];
    }

    if (typeof value2 === 'object') {
        value2 = value2[0];
    }

    if (
        typeof value1 !== 'number' ||
        typeof value2 !== 'number' ||
        value2 === 0
    ) {
        return NaN;
    }

    return value1 % value2;
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('MOD', MOD);


/* *
 *
 *  Default Export
 *
 * */


export default MOD;
