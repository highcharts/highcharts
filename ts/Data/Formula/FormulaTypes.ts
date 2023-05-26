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
 *  Declarations
 *
 * */


/**
 * Arguments array of a formula function with terms and ranges.
 */
export type Arguments = Array<(Range|Term)>;


/**
 * Formula array with terms and operators.
 */
export type Formula = Array<(Operator|Term)>;


/**
 * Formula function with an arguments array.
 */
export interface Function {
    args: Arguments;
    name: string;
    type: 'function';
}


/**
 * Item in arguments and formulas.
 */
export type Item = (Operator|Range|Term);


/**
 * Formula operators, either basic arithmetic, or basic logic.
 */
export type Operator = ('+'|'-'|'*'|'/'|'^'|'='|'<'|'<='|'>'|'>=');


/**
 * Represents a range to cells of a table.
 */
export interface Range {
    beginColumn: number;
    beginColumnRelative?: true;
    beginRow: number;
    beginRowRelative?: true;
    endColumn: number;
    endColumnRelative?: true;
    endRow: number;
    endRowRelative?: true;
    type: 'range';
}


/**
 * Represents a reference to a table cell.
 */
export interface Reference {
    column: number;
    columnRelative?: true;
    row: number;
    rowRelative?: true;
    type: 'reference';
}


/**
 * A term represents some form of processing into a value or is already a value.
 */
export type Term = (Formula|Function|Reference|Value);


/**
 * A value to use in a operation or process.
 */
export type Value = (boolean|number|string);


/* *
 *
 *  Constants
 *
 * */


/**
 * Array of all possible operators.
 * @private
 */
const operators: Array<string> =
    ['+', '-', '*', '/', '^', '=', '<', '<=', '>', '>='];


/* *
 *
 *  Functions
 *
 * */


/**
 * Tests an item for a Formula array.
 *
 * @private
 *
 * @param {Highcharts.FormulaItem} item
 * Item to test.
 *
 * @return {boolean}
 * `true`, if the item is a formula (or argument) array.
 */
function isFormula(
    item: Item
): item is Formula {
    return item instanceof Array;
}


/**
 * Tests an item for a Function structure.
 *
 * @private
 *
 * @param {Highcharts.FormulaItem} item
 * Item to test.
 *
 * @return {boolean}
 * `true`, if the item is a formula function.
 */
function isFunction(
    item: Item
): item is Function {
    return (
        typeof item === 'object' &&
        !(item instanceof Array) &&
        item.type === 'function'
    );
}


/**
 * Tests an item for an Operator string.
 *
 * @private
 *
 * @param {Highcharts.FormulaItem} item
 * Item to test.
 *
 * @return {boolean}
 * `true`, if the item is an operator string.
 */
function isOperator(
    item: Item
): item is Operator {
    return (
        typeof item === 'string' &&
        operators.indexOf(item) >= 0
    );
}


/**
 * Tests an item for a Range structure.
 *
 * @private
 *
 * @param {Highcharts.FormulaItem} item
 * Item to test.
 *
 * @return {boolean}
 * `true`, if the item is a range.
 */
function isRange(
    item: Item
): item is Range {
    return (
        typeof item === 'object' &&
        !(item instanceof Array) &&
        item.type === 'range'
    );
}


/**
 * Tests an item for a Reference structure.
 *
 * @private
 *
 * @param {Highcharts.FormulaItem} item
 * Item to test.
 *
 * @return {boolean}
 * `true`, if the item is a reference.
 */
function isReference(
    item: Item
): item is Reference {
    return (
        typeof item === 'object' &&
        !(item instanceof Array) &&
        item.type === 'reference'
    );
}


/**
 * Tests an item for a Value structure.
 *
 * @private
 *
 * @param {Highcharts.FormulaItem|null|undefined} item
 * Item to test.
 *
 * @return {boolean}
 * `true`, if the item is a value.
 */
function isValue(
    item: (Item|null|undefined)
): item is Value {
    return (
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'string'
    );
}


/* *
 *
 *  Default Export
 *
 * */


const MathFormula = {
    isFormula,
    isFunction,
    isOperator,
    isRange,
    isReference,
    isValue
};


export default MathFormula;
