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


import type { Value } from '../FormulaTypes';


import FormulaFunction from './FormulaFunction.js';


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
 * @function Formula.ProcessorFunction.types.NOT
 *
 * @param {Array<(Highcharts.FormulaValue|Array<Highcharts.FormulaValue>)>} values
 * Values to process.
 *
 * @return {boolean}
 * Result value of the process.
 */
function process(
    values: Array<(Value|Array<Value>)>
): boolean {
    return !values[0];
}


/* *
 *
 *  Registry
 *
 * */


const Not: FormulaFunction = {
    process
};


FormulaFunction.registerType('NOT', Not);


/* *
 *
 *  Default Export
 *
 * */


export default Not;
