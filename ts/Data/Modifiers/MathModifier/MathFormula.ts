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

export type MathArguments =
    Array<(number|MathFormula|MathFunction|MathPointer|MathRange)>;

export type MathFormula =
    Array<(number|MathFormula|MathFunction|MathOperator|MathPointer|MathRange)>;

export interface MathFunction {
    arguments: MathArguments;
    name: string;
    type: 'function';
}

export type MathOperator = ('+'|'-'|'*'|'/'|'^');

export interface MathPointer {
    column: number;
    row: number;
    type: 'pointer';
}

export interface MathRange {
    beginColumn: number;
    beginRow: number;
    endColumn: number;
    endRow: number;
    type: 'range';
}

export interface FormulaParseError extends Error {
    message: string;
    name: 'FormulaParseError';
}

/* *
 *
 *  Constants
 *
 * */

/**
 * @internal
 */
const decimal1RegExp = /^[+-]?\d+(?:\.\d+)?(?:e[+-]\d+)?/;

/**
 * @internal
 */
const decimal2RegExp = /^[+-]?\d+(?:,\d+)?(?:e[+-]\d+)?/;

/**
 * - Group 1: Function name
 * @internal
 */
const functionRegExp = /^([A-Z][A-Z\d\.]*)\(/;

/**
 * @internal
 */
const operatorRegExp = /^[+\-*\/^]/;

/**
 * - Group 1: Start column
 * - Group 2: Start row
 * - Group 3: End column
 * - Group 4: End row
 * @internal
 */
const pointerOrRangeRegExp = /^([A-Z]+)(\d+)(?:\:([A-Z]+)(\d+))?/;

/* *
 *
 *  Functions
 *
 * */

function extractParantheses(
    text: string
): string {
    let parantheseLevel = 0;

    for (let i = 0, iEnd = text.length, char: string; i < iEnd; ++i) {
        char = text[i];

        if (char === '(') {
            ++parantheseLevel;
            continue;
        }

        if (char === ')') {
            --parantheseLevel;

            if (!parantheseLevel) {
                return text.substring(1, i);
            }
        }
    }

    const error = new Error('Incomplete parantheses.');
    error.name = 'ExtractParanthesesError';
    throw error;
}

function parseArguments(
    text: string,
    alternativeSeparator: boolean
): MathArguments {
    const argumentsSeparator = (alternativeSeparator ? ';' : ','),
        mathArguments: MathArguments = [];

    let parantheseLevel = 0,
        term = '';

    for (
        let i = 0,
            iEnd = text.length,
            char: string;
        i < iEnd;
        ++i
    ) {
        char = text[i];

        if (
            char === argumentsSeparator &&
            !parantheseLevel &&
            term
        ) {
            mathArguments.push(parseTerm(term, alternativeSeparator));
            term = '';
        } else if (char !== ' ') {
            term += char;

            if (char === '(') {
                ++parantheseLevel;
            } else if (char === ')') {
                --parantheseLevel;
            }
        }
    }

    if (!parantheseLevel && term) {
        mathArguments.push(parseTerm(term, alternativeSeparator));
    }

    return mathArguments;
}

function parseFormula(
    text: string,
    alternativeSeparator: boolean
): MathFormula {
    const decimalRegExp = (
            alternativeSeparator ?
                decimal2RegExp :
                decimal1RegExp
        ),
        mathFormula: MathFormula = [];

    let match: (RegExpMatchArray|null),
        more = text.trim();

    while (more) {

        // Check for an function
        match = more.match(functionRegExp);
        if (match) {
            more = more.substring(match[0].length - 1).trim();

            const parantheses = extractParantheses(more),
                mathFunction: MathFunction = {
                    type: 'function',
                    name: match[1],
                    arguments: parseArguments(parantheses, alternativeSeparator)
                };

            if (
                mathFormula.length &&
                typeof mathFormula[mathFormula.length - 1] !== 'string'
            ) {
                mathFormula.push('+');
            }

            mathFormula.push(mathFunction);

            more = more.substring(parantheses.length + 2).trim();

            continue;
        }

        // Check for an A1 notation
        match = more.match(pointerOrRangeRegExp);
        if (match) {
            mathFormula.push(parsePointerOrRange(match));

            more = more.substring(match[0].length).trim();

            continue;
        }

        // Check for a number value
        match = more.match(decimalRegExp);
        if (match) {
            mathFormula.push(parseFloat(match[0]));

            more = more.substring(match[0].length).trim();

            continue;
        }

        // Check for a formula operator
        match = more.match(operatorRegExp);
        if (match) {
            mathFormula.push(match[0] as MathOperator);

            more = more.substring(match[0].length).trim();

            continue;
        }

        // Check for a formula in parantheses
        if (more[0] === '(') {
            const paranteses = extractParantheses(more);

            if (paranteses) {
                mathFormula
                    .push(parseFormula(paranteses, alternativeSeparator));

                more = more.substring(paranteses.length + 2).trim();

                continue;
            }
        }

        // Something is not right
        const position = text.length - more.length,
            error = new Error(
                'Unexpected character `' +
                text.substring(position, position + 1) +
                '` at position ' + (position + 1) +
                '. (`...' + text.substring(position - 5, position + 6) + '...`)'
            ) as FormulaParseError;

        error.name = 'FormulaParseError';

        throw error;
    }

    return mathFormula;
}

function parsePointerColumn(
    text: string
): number {
    let column = 0;

    for (
        let i = 0,
            iEnd = text.length,
            code: number,
            factor = text.length - 1;
        i < iEnd;
        ++i
    ) {
        code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
            column += (code - 64) * Math.pow(26, factor);
        }
        --factor;
    }

    return column;
}

function parsePointerOrRange(
    match: RegExpMatchArray
): (MathPointer|MathRange) {

    if (match[4]) {
        return {
            type: 'range',
            beginColumn: (parsePointerColumn(match[1]) - 1),
            beginRow: (parseInt(match[2], 10) - 1),
            endColumn: (parsePointerColumn(match[3]) - 1),
            endRow: (parseInt(match[4], 10) - 1)
        };
    }

    return {
        type: 'pointer',
        column: (parsePointerColumn(match[1]) - 1),
        row: (parseInt(match[2], 10) - 1)
    };
}

function parseTerm(
    text: string,
    alternativeSeparator: boolean
): (number|MathFormula|MathFunction|MathPointer|MathRange) {
    const mathFormula = parseFormula(text, alternativeSeparator);

    return (
        mathFormula.length === 1 && typeof mathFormula[0] !== 'string' ?
            mathFormula[0] :
            mathFormula
    );
}

/* *
 *
 *  Default Export
 *
 * */

const MathFormula = {
    parseFormula
};

export default MathFormula;
