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
    Formula,
    Function,
    Item,
    Operator,
    Pointer,
    Range,
    Term,
    Value
} from './FormulaTypes';


import FormulaFunction from './Functions/FormulaFunction.js';
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
 * @return {Formula.Value|undefined}
 * Result value of the process. `undefined` indicates an empty formula array.
 */
function processFormula(
    formula: Formula,
    table?: DataTable
): (Value|undefined) {
    let x: (Value|undefined);

    for (
        let i = 0,
            iEnd = formula.length,
            item: Item,
            operator: (Operator|undefined),
            y: (Value|undefined),
            ys: (Value|Array<Value>|undefined);
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
            y = (processFormula(formula, table) || NaN);

        // Next item is a function call and needs to get processed first
        } else if (isFunction(item)) {
            ys = (processFunction(item, table) || NaN);
            y = (isValue(ys) ? ys : NaN);

        // Next item is a pointer and needs to get resolved
        } else if (isPointer(item)) {
            y = (table && processPointer(item, table) || NaN);

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

    return x;
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
 * @return {Value|Array<Value>|undefined}
 * Result value (or values) of the process. `undefined` indicates an unknown
 * function.
 */
function processFunction(
    formulaFunction: Function,
    table?: DataTable
): (Value|Array<Value>|undefined) {
    const processor = FormulaFunction.types[formulaFunction.name];

    if (processor) {
        const args = formulaFunction.args,
            values: Array<(Value|Array<Value>)> = [];

        // First process all arguments to values
        for (let i = 0, iEnd = args.length, term: (Range|Term); i < iEnd; ++i) {
            term = args[i];

            // Add value
            if (isValue(term)) {
                values.push(term);

            // Add values of a range
            } else if (isRange(term)) {
                values.push(table && processRange(term, table) || []);

            // Add values of a function
            } else if (isFunction(term)) {
                values.push(table && processFunction(term, table) || NaN);

            // Process functions, operations, pointers with formula processor
            } else {
                values.push(
                    processFormula(
                        isFormula(term) ? term : [term],
                        table
                    ) ||
                    NaN
                );
            }
        }

        // Provide all values to the processor function
        return processor.process(values);
    }
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
function processPointer(
    pointer: Pointer,
    table: DataTable
): (Value|undefined) {
    const columnName = table.getColumnNames()[pointer.column];

    if (columnName) {
        const cell = table.getCell(columnName, pointer.row);

        switch (typeof cell) {
            case 'boolean':
            case 'number':
            case 'string':
                return cell;
            default:
                return NaN;
        }
    }
}


/**
 * Extracts cell values from a table for a given range.
 *
 * @private
 *
 * @param {Highcharts.FormulaRange} range
 * Formula range to use.
 *
 * @param {Highcharts.DataTable} table
 * Table to extract from.
 *
 * @return {Array<Highcharts.FormulaValue>|undefined}
 * Extracted values. 'undefined' indicates that the range was not found.
 */
function processRange(
    range: Range,
    table: DataTable
): (Array<Value>|undefined) {
    const columnNames = table
        .getColumnNames()
        .slice(range.beginColumn, range.endColumn + 1);

    if (columnNames.length) {
        const values: Array<Value> = [];

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            const cells = table.getColumn(columnNames[i], true) || [];

            for (
                let j = range.beginRow,
                    jEnd = range.endRow + 1,
                    cell: DataTable.CellType;
                j < jEnd;
                ++j
            ) {
                cell = cells[j];
                switch (typeof cell) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        values.push(cell);
                        break;
                    default:
                        values.push(NaN);
                        break;
                }
            }
        }

        return values;
    }
}


/* *
 *
 *  Default Export
 *
 * */


const FormulaProcessor = {
    processFormula
};


export default FormulaProcessor;
