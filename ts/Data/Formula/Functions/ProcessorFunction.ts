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

/* *
 *
 *  Constants
 *
 * */

const keyRegExp = /^[A-Z][A-Z\.]*$/;

/* *
 *
 *  Interface
 *
 * */

interface ProcessorFunction {
    callback: (values: Array<Value>) => Value;
}

/* *
 *
 *  Interface Namespace
 *
 * */

namespace ProcessorFunction {

    /* *
     *
     *  Constants
     *
     * */

    export const types: Record<string, ProcessorFunction> = {};

    /* *
     *
     *  Functions
     *
     * */

    export function registerType(
        key: string,
        DataModifierClass: ProcessorFunction
    ): boolean {
        return (
            keyRegExp.test(key) &&
            !types[key] &&
            !!(types[key] = DataModifierClass)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ProcessorFunction;
