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
const { getArgumentValue } = FormulaProcessor;


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `OR(...tests)` implementation. Returns `TRUE`, if one test
 * result is not `0` or `FALSE`.
 *
 * @private
 * @function Formula.processorFunctions.AND
 *
 * @param {Highcharts.FormulaArguments} args
 * Arguments to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to use for references and ranges.
 *
 * @return {boolean}
 * Result value of the process.
 */
function OR(
    args: Arguments,
    table?: DataTable
): boolean {

    for (
        let i = 0,
            iEnd = args.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = getArgumentValue(args[i], table);

        if (typeof value === 'object') {
            if (OR(value, table)) {
                return true;
            }
        } else if (value) {
            return true;
        }
    }

    return false;
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('OR', OR);


/* *
 *
 *  Default Export
 *
 * */


export default OR;
