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


import type {
    Arguments,
    Formula,
    Function,
    Operator,
    Pointer,
    Range,
    Value
} from './FormulaTypes.js';


/* *
 *
 *  Declarations
 *
 * */


export interface FormulaParserError extends Error {
    message: string;
    name: 'FormulaParserError';
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
 * @internal
 */
const pointerRegExp = /^([A-Z]+)(\d+)(?!\:)/;


/**
 * - Group 1: Start column
 * - Group 2: Start row
 * - Group 3: End column
 * - Group 4: End row
 * @internal
 */
const rangeRegExp = /^([A-Z]+)(\d+)\:([A-Z]+)(\d+)/;


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
): Arguments {
    const args: Arguments = [],
        argumentsSeparator = (alternativeSeparator ? ';' : ',');

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
            args.push(parseTerm(term, alternativeSeparator));
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

    // look for left-overs
    if (!parantheseLevel && term) {
        args.push(parseTerm(term, alternativeSeparator));
    }

    return args;
}

function parseFormula(
    text: string,
    alternativeSeparator: boolean
): Formula {
    const decimalRegExp = (
            alternativeSeparator ?
                decimal2RegExp :
                decimal1RegExp
        ),
        formula: Formula = [];

    let match: (RegExpMatchArray|null),
        next = text.trim();

    while (next) {

        // Check for a function
        match = next.match(functionRegExp);
        if (match) {
            next = next.substring(match[0].length - 1).trim();

            const parantheses = extractParantheses(next);

            formula.push(parseFunction(
                match,
                parantheses,
                alternativeSeparator
            ));

            next = next.substring(parantheses.length + 2).trim();

            continue;
        }

        // Check for an A1 pointer notation
        match = next.match(pointerRegExp);
        if (match) {
            formula.push(parsePointer(match));

            next = next.substring(match[0].length).trim();

            continue;
        }

        // Check for a number value
        match = next.match(decimalRegExp);
        if (match) {
            formula.push(parseFloat(match[0]));

            next = next.substring(match[0].length).trim();

            continue;
        }

        // Check for a formula operator
        match = next.match(operatorRegExp);
        if (match) {
            formula.push(match[0] as Operator);

            next = next.substring(match[0].length).trim();

            continue;
        }

        // Check for a formula in parantheses
        if (next[0] === '(') {
            const paranteses = extractParantheses(next);

            if (paranteses) {
                formula
                    .push(parseFormula(paranteses, alternativeSeparator));

                next = next.substring(paranteses.length + 2).trim();

                continue;
            }
        }

        // Something is not right
        const position = text.length - next.length,
            error = new Error(
                'Unexpected character `' +
                text.substring(position, position + 1) +
                '` at position ' + (position + 1) +
                '. (`...' + text.substring(position - 5, position + 6) + '...`)'
            ) as FormulaParserError;

        error.name = 'FormulaParserError';

        throw error;
    }

    return formula;
}

function parseFunction(
    match: RegExpMatchArray,
    parantheses: string,
    alternativeSeparator: boolean
): Function {
    return {
        type: 'function',
        name: match[1],
        args: parseArguments(parantheses, alternativeSeparator)
    };
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

function parsePointer(
    match: RegExpMatchArray
): Pointer {

    return {
        type: 'pointer',
        column: (parsePointerColumn(match[1]) - 1),
        row: (parseInt(match[2], 10) - 1)
    };
}

function parseRange(
    match: RegExpMatchArray
): Range {
    return {
        type: 'range',
        beginColumn: (parsePointerColumn(match[1]) - 1),
        beginRow: (parseInt(match[2], 10) - 1),
        endColumn: (parsePointerColumn(match[3]) - 1),
        endRow: (parseInt(match[4], 10) - 1)
    };
}


/**
 * Parses an argument string. Formula arrays with a single term will be
 * simplified to the term.
 *
 * @param {string} text
 * Argument string to parse.
 *
 * @param {boolean} alternativeSeparators
 * Whether to expect `;` as argument separator and `,` as decimal separator.
 *
 * @return {Formula|Function|Pointer|Range|Value}
 * The recognized term structure.
 */
function parseTerm(
    text: string,
    alternativeSeparators: boolean
): (Formula|Function|Pointer|Range|Value) {

    // Check for a range notation
    const match = text.match(rangeRegExp);
    if (match) {
        return parseRange(match);
    }

    // Fallback to formula processing
    const formula = parseFormula(text, alternativeSeparators);
    return (
        formula.length === 1 && typeof formula[0] !== 'string' ?
            formula[0] :
            formula
    );
}


/* *
 *
 *  Default Export
 *
 * */


const FormulaParser = {
    parseFormula
};

export default FormulaParser;
