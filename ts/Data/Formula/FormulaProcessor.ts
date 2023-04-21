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


import type DataTable from '../DataTable';
import type {
    Arguments,
    Formula,
    Function,
    Item,
    Operator,
    Pointer,
    Range,
    Term,
    Value
} from './FormulaTypes';


import FormulaTypes from './FormulaTypes.js';
const {
    asNumber,
    isFormula,
    isFunction,
    isOperator,
    isPointer,
    isRange,
    isValue
} = FormulaTypes;


/* *
 *
 *  Declarations
 *
 * */


export interface ProcessorFunction {
    (args: Arguments, table?: DataTable): (Value|Array<Value>);
}


/* *
 *
 *  Constants
 *
 * */


const processorFunctions: Record<string, ProcessorFunction> = {};


const processorFunctionNameRegExp = /^[A-Z][A-Z\.]*$/;


/* *
 *
 *  Functions
 *
 * */


/**
 * Process a basic operation of two given values.
 *
 * @private
 *
 * @param {Highcharts.FormulaOperator} operator
 * Operator between values.
 *
 * @param {Highcharts.FormulaValue} x
 * First value for operation.
 *
 * @param {Highcharts.FormulaValue} y
 * Second value for operation.
 *
 * @return {Highcharts.FormulaValue}
 * Operation result. `NaN` if operation is not support.
 */
function basicOperation(
    operator: Operator,
    x: Value,
    y: Value
): Value {

    switch (operator) {
        case '=':
            return x == y ? 1 : 0; // eslint-disable-line eqeqeq
        case '<':
            return x < y ? 1 : 0;
        case '<=':
            return x <= y ? 1 : 0;
        case '>':
            return x > y ? 1 : 0;
        case '>=':
            return x >= y ? 1 : 0;
    }

    x = asNumber(x);
    y = asNumber(y);

    switch (operator) {
        case '+':
            return x + y;
        case '-':
            return x - y;
        case '*':
            return x * y;
        case '/':
            return x / y;
        case '^':
            return Math.pow(x, y);
        default:
            return NaN;
    }
}


/**
 */
function getArgumentValue(
    arg: (Range|Term),
    table?: DataTable
): (Value|Array<Value>) {

    // Add value
    if (isValue(arg)) {
        return arg;
    }

    // Add values of a range
    if (isRange(arg)) {
        return (table && getRangeValues(arg, table) || []);
    }

    // Add values of a function
    if (isFunction(arg)) {
        return processFunction(arg, table);
    }

    // Process functions, operations, pointers with formula processor
    return processFormula((isFormula(arg) ? arg : [arg]), table);
}


/**
 */
function getArgumentValues(
    args: Arguments,
    table?: DataTable
): Array<(Value|Array<Value>)> {
    const values: Array<(Value|Array<Value>)> = [];

    for (let i = 0, iEnd = args.length; i < iEnd; ++i) {
        values.push(getArgumentValue(args[i], table));
    }

    return values;
}


/**
 * Extracts the cell value from a table for a given pointer.
 *
 * @private
 *
 * @param {Highcharts.FormulaPointer} pointer
 * Formula pointer to use.
 *
 * @param {Highcharts.DataTable} table
 * Table to extract from.
 *
 * @return {Highcharts.FormulaValue}
 * Extracted value. 'undefined' might also indicate that the cell was not found.
 */
function getPointerValue(
    pointer: Pointer,
    table: DataTable
): Value {
    const columnName = table.getColumnNames()[pointer.column];

    if (columnName) {
        const cell = table.getCell(columnName, pointer.row);

        if (
            typeof cell === 'string' &&
            cell[0] === '=' &&
            table !== table.modified
        ) {
            // Look in the modified table for formula result
            const result = table.modified.getCell(columnName, pointer.row);
            return isValue(result) ? result : NaN;
        }

        return isValue(cell) ? cell : NaN;
    }

    return NaN;
}


/**
 * Extracts cell values from a table for a given range.
 *
 * @function Highcharts.Formula.getRangeValues
 *
 * @param {Highcharts.FormulaRange} range
 * Formula range to use.
 *
 * @param {Highcharts.DataTable} table
 * Table to extract from.
 *
 * @return {Array<Highcharts.FormulaValue>}
 * Extracted values.
 */
function getRangeValues(
    range: Range,
    table: DataTable
): Array<Value> {
    const columnNames = table
            .getColumnNames()
            .slice(range.beginColumn, range.endColumn + 1),
        values: Array<Value> = [];

    for (
        let i = 0,
            iEnd = columnNames.length,
            cell: DataTable.CellType;
        i < iEnd;
        ++i
    ) {
        const cells = table.getColumn(columnNames[i], true) || [];

        for (
            let j = range.beginRow,
                jEnd = range.endRow + 1;
            j < jEnd;
            ++j
        ) {
            cell = cells[j];

            if (
                typeof cell === 'string' &&
                cell[0] === '=' &&
                table !== table.modified
            ) {
                // Look in the modified table for formula result
                cell = table.modified.getCell(columnNames[i], j);
            }

            values.push(isValue(cell) ? cell : NaN);
        }
    }

    return values;
}


/**
 * Processes a formula array on the given table. If the formula does not contain
 * pointers or ranges, then no table has to be provided.
 *
 * @private
 * @function Highcharts.processFormula
 *
 * @param {Formula.Formula} formula
 * Formula array to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to use for pointers and ranges.
 *
 * @return {Formula.Value}
 * Result value of the process. `NaN` indicates an error.
 */
function processFormula(
    formula: Formula,
    table?: DataTable
): Value {
    let x: (Value|undefined);

    for (
        let i = 0,
            iEnd = formula.length,
            item: Item,
            operator: (Operator|undefined),
            result: (Value|Array<Value>),
            y: (Value|undefined);
        i < iEnd;
        ++i
    ) {
        item = formula[i];

        // Remember operator for operation on next item
        if (isOperator(item)) {
            operator = item;
            continue;
        }

        // Next item is a value
        if (isValue(item)) {
            y = item;

        // Next item is a formula and needs to get processed first
        } else if (isFormula(item)) {
            y = processFormula(formula, table);

        // Next item is a function call and needs to get processed first
        } else if (isFunction(item)) {
            result = processFunction(item, table);
            y = (isValue(result) ? result : NaN); // arrays are not allowed here

        // Next item is a pointer and needs to get resolved
        } else if (isPointer(item)) {
            y = (table && getPointerValue(item, table));

        }

        // If we have a next value, lets do the operation
        if (typeof y !== 'undefined') {

            // Next value is our first value
            if (typeof x === 'undefined') {
                x = y;

            // Regular next value
            } else {
                x = basicOperation((operator || '+'), x, y);
            }

            operator = void 0;
            y = void 0;
        }
    }

    return isValue(x) ? x : NaN;
}


/**
 * Process a function  on the give table. If the arguments do not contain
 * pointers or ranges, then no table has to be provided.
 *
 * @private
 *
 * @param {Highcharts.FormulaFunction} formulaFunction
 * Formula function to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to use for pointers and ranges.
 *
 * @return {Value|Array<Value>}
 * Result value (or values) of the process. `NaN` indicates an error.
 */
function processFunction(
    formulaFunction: Function,
    table?: DataTable
): (Value|Array<Value>) {
    const processor = processorFunctions[formulaFunction.name];

    if (processor) {
        try {
            return processor(formulaFunction.args, table);
        } catch {
            return NaN;
        }
    }

    return NaN;
}


/**
 * Registers a function for the FormulaProcessor.
 *
 * @param {string} name
 * Name of the function in spreadsheets notation with upper case.
 *
 * @param {Highcharts.FormulaFunction} processorFunction
 * ProcessorFunction for the FormulaProcessor. This is an object so that it
 * can take additional parameter for future validation routines.
 *
 * @return {boolean}
 * Return true, if the ProcessorFunction has been registered.
 */
function registerProcessorFunction(
    name: string,
    processorFunction: ProcessorFunction
): boolean {
    return (
        processorFunctionNameRegExp.test(name) &&
        !processorFunctions[name] &&
        !!(processorFunctions[name] = processorFunction)
    );
}


/* *
 *
 *  Default Export
 *
 * */


const FormulaProcessor = {
    getArgumentValue,
    getArgumentValues,
    getPointerValue,
    getRangeValues,
    processFormula,
    processorFunctions,
    registerProcessorFunction
};

export default FormulaProcessor;
