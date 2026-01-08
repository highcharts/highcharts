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


import type { Arguments } from '../FormulaTypes';
import type DataTable from '../../DataTable.js';


import FormulaProcessor from '../FormulaProcessor.js';
const { getArgumentValue } = FormulaProcessor;


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `ISNA(value)` implementation. Returns TRUE if value is not
 * a number.
 *
 * @private
 * @function Formula.processorFunctions.ISNA
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
function ISNA(
    args: Arguments,
    table?: DataTable
): boolean {
    const value = getArgumentValue(args[0], table);
    return (typeof value !== 'number' || isNaN(value));
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('ISNA', ISNA);


/* *
 *
 *  Default Export
 *
 * */


export default ISNA;
