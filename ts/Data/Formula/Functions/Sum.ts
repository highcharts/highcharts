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

import ProcessorFunction from './ProcessorFunction.js';

/* *
 *
 *  Functions
 *
 * */

function callback(
    values: Array<Value>
): Value {
    let result = 0;

    for (let i = 0, iEnd = values.length; i < iEnd; ++i) {
        result += values[i];
    }

    return result;
}

/* *
 *
 *  Registry
 *
 * */


const Sum: ProcessorFunction = {
    callback
};

ProcessorFunction.registerType('SUM', Sum);

/* *
 *
 *  Default Export
 *
 * */

export default Sum;
