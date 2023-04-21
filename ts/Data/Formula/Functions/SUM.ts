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

/* eslint-disable new-cap */


/* *
 *
 *  Imports
 *
 * */


import type { Arguments, Value } from '../FormulaTypes';
import type DataTable from '../../DataTable';


import FormulaProcessor from '../FormulaProcessor.js';
import FormulaTypes from '../FormulaTypes.js';
const { asNumber } = FormulaTypes;


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
 * @param {Highcharts.FormulaArguments} [table]
 * Table to process.
 *
 * @return {number}
 * Result value of the process.
 */
function SUM(
    args: Arguments,
    table?: DataTable
): number {
    const values = FormulaProcessor.getArgumentValues(args, table);
    let result = 0;

    for (
        let i = 0,
            iEnd = values.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = values[i];

        if (value instanceof Array) {
            result += SUM(value, table);
        } else {
            result += asNumber(value);
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
