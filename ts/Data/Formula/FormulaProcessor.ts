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
    Operator,
    Pointer,
    Range,
    Term,
    Value
} from './FormulaTypes';

import FormulaTypes from './FormulaTypes.js';
import ProcessorFunction from './Functions/ProcessorFunction.js';

/* *
 *
 *  Functions
 *
 * */

function basicOperation(
    operator: Operator,
    x: Value,
    y: Value
): number {
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
 * @param {Formula.Formula} formula
 * Formula array to process.
 *
 * @param {Highcharts.DataTable} [table]
 * Table to use for pointer and ranges.
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
            item: (Operator|Term),
            operator: (Operator|undefined),
            y: (Value|undefined);
        i < iEnd;
        ++i
    ) {
        item = formula[i];

        if (FormulaTypes.isOperator(item)) {
            operator = item;
            continue;
        }

        if (FormulaTypes.isValue(item)) {
            y = item;
        } else if (FormulaTypes.isFormula(item)) {
            y = (processFormula(formula, table) || NaN);
        } else if (FormulaTypes.isFunction(item)) {
            y = (processFunction(item, table) || NaN);
        } else if (FormulaTypes.isPointer(item)) {
            y = (table && processPointer(item, table) || NaN);
        }

        if (typeof y !== 'undefined') {
            x = basicOperation((operator || '+'), (x || 0), y);
            operator = void 0;
            y = void 0;
        }
    }

    return x;
}

function processFunction(
    item: Function,
    table?: DataTable
): (Value|undefined) {
    const processor = ProcessorFunction.types[item.name];

    if (processor) {
        const args = item.args,
            values: Array<(Value|Array<Value>)> = [];

        // First process all arguments to values
        for (let i = 0, iEnd = args.length, term: (Range|Term); i < iEnd; ++i) {
            term = args[i];

            // Add value
            if (FormulaTypes.isValue(term)) {
                values.push(term);

            // Add values of a range
            } else if (FormulaTypes.isRange(term)) {
                values.push(table && processRange(term, table) || []);

            // Process functions, operations, pointers with formula processor
            } else {
                values.push(
                    processFormula(
                        FormulaTypes.isFormula(term) ? term : [term],
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

function processPointer(
    item: Pointer,
    table: DataTable
): (Value|undefined) {
    const columnName = table.getColumnNames()[item.column];

    if (columnName) {
        return table.getCellAsNumber(columnName, item.row, true);
    }
}

function processRange(
    item: Range,
    table: DataTable
): (Array<Value>|undefined) {
    const columnNames = table
        .getColumnNames()
        .slice(item.beginColumn, item.endColumn + 1);

    if (columnNames.length) {
        const values: Array<Value> = [];

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            const cells = table
                .getColumnAsNumbers(columnNames[i], true)
                .slice(item.beginRow, item.endRow + 1);

            for (let j = 0, jEnd = cells.length; j < jEnd; ++j) {
                values.push(cells[j]);
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
