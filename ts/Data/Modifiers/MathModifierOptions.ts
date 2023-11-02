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


import type DataModifierOptions from './DataModifierOptions';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Options to configure a formula replacing column values.
 */
export interface MathModifierColumnFormulaOptions {

    /**
     * Column name or alias in the DataTable to replace with values of the
     * formula.
     */
    column: string;

    /**
     * Formula to use to replace column values.
     */
    formula: string;

    /**
     * Row index to end the replacing process.
     */
    rowEnd?: number;

    /**
     * Row index to start the replacing process from.
     */
    rowStart?: number;

}


/**
 * Options to configure the MathModifier and Formula system.
 */
export interface MathModifierOptions extends DataModifierOptions {

    /**
     * Name of the related modifier for these options.
     */
    type: 'Math';

    /**
     * Whether to expect regular or alternative separators in formulas.
     * * `false` to expect `,` between arguments and `.` in decimals.
     * * `true` to expect `;` between arguments and `,` in decimals.
     */
    alternativeSeparators: boolean;

    /**
     * Array of column formulas that will be used to replace the column
     * values in their columns.
     * @private
     * @todo Implement
     */
    columnFormulas?: Array<MathModifierColumnFormulaOptions>;

    /**
     * Array of column names or aliases to replace formula strings to
     * replace with calculated values. By default all columns in a table
     * will be processed.
     */
    formulaColumns?: Array<string>;

}


/* *
 *
 *  Default Export
 *
 * */


export default MathModifierOptions;
