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
    Operator,
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

function processFormula(
    formula: Formula,
    table: DataTable
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
        } else if (item.type === 'function') {
            y = (processFunction(item, table) || NaN);
        }
        // @todo pointer implementation
        // @todo range defaults to SUM, if not an argument

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
    table: DataTable
): (Value|undefined) {
    const processor = ProcessorFunction.types[item.name];

    if (processor) {
        const args = item.args,
            values: Array<Value> = [];

        for (let i = 0, iEnd = args.length, term: Term; i < iEnd; ++i) {
            term = args[i];

            if (FormulaTypes.isValue(term)) {
                values.push(term);
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

        return processor.callback(values);
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
