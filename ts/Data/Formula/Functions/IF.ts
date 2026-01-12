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
 * Processor for the `IF(test, value1, value2)` implementation. Returns one of
 * the values based on the test result. `value1` will be returned, if the test
 * result is not `0` or `FALSE`.
 *
 * @private
 * @function Formula.processorFunctions.IF
 *
 * @param {Highcharts.FormulaArguments} args
 * Arguments to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to use for references and ranges.
 *
 * @return {Highcharts.FormulaValue|Array<Highcharts.FormulaValue>}
 * Result value of the process.
 */
function IF(
    args: Arguments,
    table?: DataTable
): (Value|Array<Value>) {
    return (
        getArgumentValue(args[0], table) ?
            getArgumentValue(args[1], table) :
            getArgumentValue(args[2], table)
    );
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('IF', IF);


/* *
 *
 *  Default Export
 *
 * */


export default IF;
