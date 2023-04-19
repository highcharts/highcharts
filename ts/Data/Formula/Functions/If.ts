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
 * Processor for the `IF(test, value1, value2)` implementation. Returns one of
 * the values based on the test result. `value1` will be returned, if the test
 * result is not zero.
 *
 * @private
 * @function Formula.ProcessorFunction.types.IF
 *
 * @param {Array<(Highcharts.FormulaValue|Array<Highcharts.FormulaValue>)>} values
 * Values to process.
 *
 * @return {Highcharts.FormulaValue|Array<Highcharts.FormulaValue>}
 * Result value of the process.
 */
function process(
    values: Array<(Value|Array<Value>)>
): (Value|Array<Value>) {
    return (values[0] ? values[1] : values[2]);
}


/* *
 *
 *  Registry
 *
 * */


const If: FormulaFunction = {
    process
};


FormulaFunction.registerType('IF', If);


/* *
 *
 *  Default Export
 *
 * */


export default If;
