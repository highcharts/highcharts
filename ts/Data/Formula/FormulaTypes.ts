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

export type Arguments = Array<Term>;

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

export type Term = (Formula|Function|Pointer|Range|Value);

export type Value = number;

/* *
 *
 *  Functions
 *
 * */

function isFormula(
    item: unknown
): item is Formula {
    return item instanceof Array;
}

function isOperator(
    item: unknown
): item is Operator {
    return (
        typeof item === 'string' &&
        '+-*/^'.indexOf(item) >= 0
    );
}

function isValue(
    item: unknown
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
    isOperator,
    isValue
};

export default MathFormula;
