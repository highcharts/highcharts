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
    Item,
    Value
} from '../FormulaTypes';
import type DataTable from '../../DataTable';


import FormulaParser from '../FormulaProcessor.js';
import FormulaProcessor from '../FormulaProcessor.js';
const {
    getArgumentValue,
    getArgumentsValues
} = FormulaProcessor;
import FormulaTypes from '../FormulaTypes.js';
const {
    isFormula,
    isFunction
} = FormulaTypes;


/* *
 *
 *  Enums
 *
 * */


enum SubtotalFunction {
    AVERAGE = 1,
    COUNT = 2,
    COUNTA = 3,
    MAX = 4,
    MIN = 5,
    PRODUCT = 6,
    STDEV = 7,
    STDEVP = 8,
    SUM = 9,
    VAR = 10,
    VARP = 11
}


/* *
 *
 *  Functions
 *
 * */


function containsSubtotal(
    item: Item
): boolean {

    if (isFunction(item)) {
        if (item.name === 'SUBTOTAL') {
            return true;
        }

        for (let args = item.args, i = 0, iEnd = args.length; i < iEnd; ++i) {
            if (containsSubtotal(args[i])) {
                return true;
            }
        }
    }

    if (isFormula(item)) {
        for (let i = 0, iEnd = item.length; i < iEnd; ++i) {
            if (containsSubtotal(item[i])) {
                return true;
            }
        }
    }

    return false;
}


/**
 * @private
 */
function filterSubtotal(
    args: Array<Item>
): Array<Item> {
    const cleanArgs: Array<Item> = [];

    for (let i = 0, iEnd = args.length, arg: Item; i < iEnd; ++i) {
        arg = args[i];

        if (!containsSubtotal(arg)) {
            cleanArgs.push(arg);
        }
    }

    return cleanArgs;
}


/**
 * Processor for the `SUBTOTAL(type, ...tests)` implementation.
 *
 * Types:
 * 1. AVERAGE
 * 2. COUNT
 * 3. COUNTA
 * 4. MAX
 * 5. MIN
 * 6. PRODUCT
 * 7. STDEV
 * 8. STDEVP
 * 9. SUM
 * 10. VAR
 * 11. VARP
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
 * @return {Value|Array<Value>}
 * Result value of the process.
 */
function SUBTOTAL(
    args: Arguments,
    table?: DataTable
): (Value|Array<Value>) {
    const fnValue = getArgumentValue(args[0], table);

    if (typeof fnValue !== 'number') {
        return NaN;
    }

    const fn = FormulaProcessor.processorFunctions[SubtotalFunction[fnValue]];

    if (typeof fn !== 'function') {
        return NaN;
    }

    const values = getArgumentsValues(filterSubtotal(args.slice(1)), table);

    for (
        let i = 0,
            iEnd = values.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = values[i];
    }
    console.log(SubtotalFunction[fnValue], args.slice(1), values);
    return fn(values, table);
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('SUBTOTAL', SUBTOTAL);


/* *
 *
 *  Default Export
 *
 * */


export default SUBTOTAL;
