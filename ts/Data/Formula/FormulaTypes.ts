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

export type Arguments = Array<(Range|Term)>;

export type Formula = Array<(Operator|Term)>;

export interface Function {
    args: Readonly<Arguments>;
    name: string;
    type: 'function';
}

export type Operator = ('+'|'-'|'*'|'/'|'^');

export interface Pointer {
    column: number;
    row: number;
    type: 'pointer';
}

export interface Range {
    beginColumn: number;
    beginRow: number;
    endColumn: number;
    endRow: number;
    type: 'range';
}

export type Term = (Formula|Function|Pointer|Value);

export type Value = number;

/* *
 *
 *  Functions
 *
 * */

function isFormula(
    item: (Range|Operator|Term)
): item is Formula {
    return item instanceof Array;
}

function isFunction(
    item: (Range|Operator|Term)
): item is Function {
    return (
        typeof item === 'object' &&
        !(item instanceof Array) &&
        item.type === 'function'
    );
}

function isOperator(
    item: (Range|Operator|Term)
): item is Operator {
    return (
        typeof item === 'string' &&
        '+-*/^'.indexOf(item) >= 0
    );
}

function isPointer(
    item: (Range|Operator|Term)
): item is Pointer {
    return (
        typeof item === 'object' &&
        !(item instanceof Array) &&
        item.type === 'pointer'
    );
}

function isRange(
    item: (Range|Operator|Term)
): item is Range {
    return (
        typeof item === 'object' &&
        !(item instanceof Array) &&
        item.type === 'range'
    );
}

function isValue(
    item: (Range|Operator|Term)
): item is Value {
    return typeof item === 'number';
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
    isPointer,
    isRange,
    isValue
};

export default MathFormula;
