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

/**
 * Describes a registered function for the FormulaProcessor.
 *
 * @private
 * @interface Formula.ProcessorFunction
 */
interface ProcessorFunction {
    /**
     * Processor for the given values.
     *
     * @param {Array<(Formula.Value|Array<Formula.Value>)>} values
     * Values to process.
     *
     * @return {Formula.Value}
     * Result value of the process.
     */
    process: (values: Array<(Value|Array<Value>)>) => Value;
}

/* *
 *
 *  Interface Namespace
 *
 * */

/**
 * Contains the registry of functions for the FormulaProcessor.
 * @private
 */
namespace ProcessorFunction {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Registry of functions for the FormulaProcessor.
     */
    export const types: Record<string, ProcessorFunction> = {};

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Registers a function for the FormulaProcessor.
     *
     * @param {string} key
     * Key of the function in spreadsheets notation with upper case.
     *
     * @param {Formula.ProcessorFunction} processorFunction
     * ProcessorFunction for the FormulaProcessor. This is an object so that it
     * can take additional parameter for future validation routines.
     *
     * @return {boolean}
     * Return true, if the ProcessorFunction has been registered.
     */
    export function registerType(
        key: string,
        processorFunction: ProcessorFunction
    ): boolean {
        return (
            keyRegExp.test(key) &&
            !types[key] &&
            !!(types[key] = processorFunction)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ProcessorFunction;
