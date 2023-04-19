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
 * @interface Highcharts.FormulaFunction
 */
interface FormulaFunction {

    /**
     * Processor for the given values.
     *
     * @param {Array<(Highcharts.FormulaValue|Array<Highcharts.FormulaValue>)>} values
     * Values to process. This is a regular array to avoid stack overflows.
     *
     * @return {Highcharts.FormulaValue}
     * Result value of the process.
     */
    process: (values: Array<(Value|Array<Value>)>) => (Value|Array<Value>);

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
namespace FormulaFunction {


    /* *
     *
     *  Constants
     *
     * */


    /**
     * Registry of functions for the FormulaProcessor.
     */
    export const types: Record<string, FormulaFunction> = {};


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
     * @param {Highcharts.FormulaFunction} formulaFunction
     * ProcessorFunction for the FormulaProcessor. This is an object so that it
     * can take additional parameter for future validation routines.
     *
     * @return {boolean}
     * Return true, if the ProcessorFunction has been registered.
     */
    export function registerType(
        key: string,
        formulaFunction: FormulaFunction
    ): boolean {
        return (
            keyRegExp.test(key) &&
            !types[key] &&
            !!(types[key] = formulaFunction)
        );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default FormulaFunction;
