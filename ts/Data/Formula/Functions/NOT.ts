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
 * Processor for the `NOT(value)` implementation. Returns the opposite test
 * result.
 *
 * @private
 * @function Formula.processorFunctions.NOT
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
function NOT(
    args: Arguments,
    table?: DataTable
): boolean {
    return !!getArgumentValue(args[0], table);
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('NOT', NOT);


/* *
 *
 *  Default Export
 *
 * */


export default NOT;
