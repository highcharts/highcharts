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


import type {
    Arguments,
    Value
} from '../FormulaTypes';
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
 * Processor for the `PRODUCT(...values)` implementation. Calculates the product
 * of the given values.
 *
 * @private
 * @function Formula.processorFunctions.PRODUCT
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
function PRODUCT(
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

        if (value instanceof Array) {
            result *= PRODUCT(value, table);
        } else {
            result *= asNumber(value);
        }
    }

    return result;
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('PRODUCT', PRODUCT);


/* *
 *
 *  Default Export
 *
 * */


export default PRODUCT;
