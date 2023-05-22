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
 * Processor for the `XOR(...tests)` implementation. Returns `TRUE`, if at least
 * one of the given tests differs in result of other tests.
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
 * @return {boolean|number}
 * Result value of the process.
 */
function XOR(
    args: Arguments,
    table?: DataTable
): (boolean|number) {

    for (
        let i = 0,
            iEnd = args.length,
            lastValue: (boolean|undefined),
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = getArgumentValue(args[i], table);

        switch (typeof value) {
            case 'boolean':
            case 'number':
                if (typeof lastValue === 'undefined') {
                    lastValue = !!value;
                } else if (!!value !== lastValue) {
                    return true;
                }
                break;
            case 'object':
                for (
                    let j = 0,
                        jEnd = value.length,
                        value2: (Value|Array<Value>);
                    j < jEnd;
                    ++j
                ) {
                    value2 = value[j];
                    switch (typeof value2) {
                        case 'boolean':
                        case 'number':
                            if (typeof lastValue === 'undefined') {
                                lastValue = !!value2;
                            } else if (!!value2 !== lastValue) {
                                return true;
                            }
                            break;
                    }
                }
                break;
        }
    }

    return false;
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('XOR', XOR);


/* *
 *
 *  Default Export
 *
 * */


export default XOR;
