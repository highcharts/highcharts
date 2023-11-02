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


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `MEDIAN(...values)` implementation. Calculates the median
 * average of the given values.
 *
 * @private
 * @function Formula.processorFunctions.MEDIAN
 *
 * @param {Highcharts.FormulaArguments} args
 * Arguments to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to process.
 *
 * @return {number}
 * Result value of the process.
 */
function MEDIAN(
    args: Arguments,
    table?: DataTable
): number {
    const median: Array<number> = [],
        values = FormulaProcessor.getArgumentsValues(args, table);

    for (
        let i = 0,
            iEnd = values.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = values[i];

        switch (typeof value) {
            case 'number':
                if (!isNaN(value)) {
                    median.push(value);
                }
                break;
            case 'object':
                for (
                    let j = 0,
                        jEnd = value.length,
                        value2: Value;
                    j < jEnd;
                    ++j
                ) {
                    value2 = value[j];
                    if (
                        typeof value2 === 'number' &&
                        !isNaN(value2)
                    ) {
                        median.push(value2);
                    }
                }
                break;
        }
    }

    const count = median.length;

    if (!count) {
        return NaN;
    }

    const half = Math.floor(count / 2); // floor because index starts at 0

    return (
        count % 2 ?
            median[half] : // odd
            (median[half - 1] + median[half]) / 2 // even
    );
}


/* *
 *
 *  Registry
 *
 * */


FormulaProcessor.registerProcessorFunction('MEDIAN', MEDIAN);


/* *
 *
 *  Default Export
 *
 * */


export default MEDIAN;
