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
    Range,
    Reference,
    Value
} from './FormulaTypes.js';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Formula parser might struggle over a syntax error.
 * @private
 */
export interface FormulaParserError extends Error {
    message: string;
    name: 'FormulaParseError';
}


/* *
 *
 *  Constants
 *
 * */


/**
 * @private
 */
const booleanRegExp = /^(?:FALSE|TRUE)/;


/**
 * `.`-separated decimal.
 * @private
 */
const decimal1RegExp = /^[+-]?\d+(?:\.\d+)?(?:e[+-]\d+)?/;


/**
 * `,`-separated decimal.
 * @private
 */
const decimal2RegExp = /^[+-]?\d+(?:,\d+)?(?:e[+-]\d+)?/;


/**
 * - Group 1: Function name
 * @private
 */
const functionRegExp = /^([A-Z][A-Z\d\.]*)\(/;


/**
 * @private
 */
const operatorRegExp = /^(?:[+\-*\/^<=>]|<=|=>)/;


/**
 * - Group 1: Start column
 * - Group 2: Start row
 * - Group 3: End column
 * - Group 4: End row
 * @private
 */
const rangeA1RegExp = /^(\$?[A-Z]+)(\$?\d+)\:(\$?[A-Z]+)(\$?\d+)/;


/**
 * - Group 1: Start row
 * - Group 2: Start column
 * - Group 3: End row
 * - Group 4: End column
 * @private
 */
const rangeR1C1RegExp =
    /^R(\d*|\[\d+\])C(\d*|\[\d+\])\:R(\d*|\[\d+\])C(\d*|\[\d+\])/;


/**
 * - Group 1: Column
 * - Group 2: Row
 * @private
 */
const referenceA1RegExp = /^(\$?[A-Z]+)(\$?\d+)(?![\:C])/;


/**
 * - Group 1: Row
 * - Group 2: Column
 * @private
 */
const referenceR1C1RegExp = /^R(\d*|\[\d+\])C(\d*|\[\d+\])(?!\:)/;


/* *
 *
 *  Functions
 *
 * */


/**
 * Extracts the inner string of the most outer parantheses.
 *
 * @private
 *
 * @param {string} text
 * Text string to extract from.
 *
 * @return {string}
 * Extracted parantheses. If not found an exception will be thrown.
 */
function extractParantheses(
    text: string
): string {
    let parantheseLevel = 0;

    for (
        let i = 0,
            iEnd = text.length,
            char: string,
            parantheseStart = 1;
        i < iEnd;
        ++i
    ) {
        char = text[i];

        if (char === '(') {
            if (!parantheseLevel) {
                parantheseStart = i + 1;
            }

            ++parantheseLevel;

            continue;
        }

        if (char === ')') {
            --parantheseLevel;

            if (!parantheseLevel) {
                return text.substring(parantheseStart, i);
            }
        }
    }

    if (parantheseLevel > 0) {
        const error = new Error('Incomplete parantheses.');
        error.name = 'FormulaParseError';
        throw error;
    }

    return '';
}


/**
 * Extracts the inner string value.
 *
 * @private
 *
 * @param {string} text
 * Text string to extract from.
 *
 * @return {string}
 * Extracted string. If not found an exception will be thrown.
 */
function extractString(
    text: string
): string {
    let start = -1;

    for (
        let i = 0,
            iEnd = text.length,
            char: string,
            escaping = false;
        i < iEnd;
        ++i
    ) {
        char = text[i];

        if (char === '\\') {
            escaping = !escaping;
            continue;
        }

        if (escaping) {
            escaping = false;
            continue;
        }

        if (char === '"') {
            if (start < 0) {
                start = i;
            } else {
                return text.substring(start + 1, i); // i is excluding
            }
        }
    }

    const error = new Error('Incomplete string.');
    error.name = 'FormulaParseError';
    throw error;
}


/**
 * Parses an argument string. Formula arrays with a single term will be
 * simplified to the term.
 *
 * @private
 *
 * @param {string} text
 * Argument string to parse.
 *
 * @param {boolean} alternativeSeparators
 * Whether to expect `;` as argument separator and `,` as decimal separator.
 *
 * @return {Formula|Function|Range|Reference|Value}
 * The recognized term structure.
 */
function parseArgument(
    text: string,
    alternativeSeparators: boolean
): (Formula|Function|Range|Reference|Value) {
    let match: (RegExpMatchArray|null);

    // Check for a R1C1:R1C1 range notation
    match = text.match(rangeR1C1RegExp);
    if (match) {
        const beginColumnRelative = (match[2] === '' || match[2][0] === '[');
        const beginRowRelative = (match[1] === '' || match[1][0] === '[');
        const endColumnRelative = (match[4] === '' || match[4][0] === '[');
        const endRowRelative = (match[3] === '' || match[3][0] === '[');
        const range: Range = {
            type: 'range',
            beginColumn: (
                beginColumnRelative ?
                    parseInt(match[2].substring(1, -1) || '0', 10) :
                    parseInt(match[2], 10) - 1
            ),
            beginRow: (
                beginRowRelative ?
                    parseInt(match[1].substring(1, -1) || '0', 10) :
                    parseInt(match[1], 10) - 1
            ),
            endColumn: (
                endColumnRelative ?
                    parseInt(match[4].substring(1, -1) || '0', 10) :
                    parseInt(match[4], 10) - 1
            ),
            endRow: (
                endRowRelative ?
                    parseInt(match[3].substring(1, -1) || '0', 10) :
                    parseInt(match[3], 10) - 1
            )
        };

        if (beginColumnRelative) {
            range.beginColumnRelative = true;
        }

        if (beginRowRelative) {
            range.beginRowRelative = true;
        }

        if (endColumnRelative) {
            range.endColumnRelative = true;
        }

        if (endRowRelative) {
            range.endRowRelative = true;
        }

        return range;
    }

    // Check for a A1:A1 range notation
    match = text.match(rangeA1RegExp);
    if (match) {
        const beginColumnRelative = match[1][0] !== '$';
        const beginRowRelative = match[2][0] !== '$';
        const endColumnRelative = match[3][0] !== '$';
        const endRowRelative = match[4][0] !== '$';
        const range: Range = {
            type: 'range',
            beginColumn: parseReferenceColumn(
                beginColumnRelative ?
                    match[1] :
                    match[1].substring(1)
            ) - 1,
            beginRow: parseInt(
                beginRowRelative ?
                    match[2] :
                    match[2].substring(1),
                10
            ) - 1,
            endColumn: parseReferenceColumn(
                endColumnRelative ?
                    match[3] :
                    match[3].substring(1)
            ) - 1,
            endRow: parseInt(
                endRowRelative ?
                    match[4] :
                    match[4].substring(1),
                10
            ) - 1
        };

        if (beginColumnRelative) {
            range.beginColumnRelative = true;
        }

        if (beginRowRelative) {
            range.beginRowRelative = true;
        }

        if (endColumnRelative) {
            range.endColumnRelative = true;
        }

        if (endRowRelative) {
            range.endRowRelative = true;
        }

        return range;
    }

    // Fallback to formula processing for other pattern types
    const formula = parseFormula(text, alternativeSeparators);
    return (
        formula.length === 1 && typeof formula[0] !== 'string' ?
            formula[0] :
            formula
    );
}


/**
 * Parse arguments string inside function parantheses.
 *
 * @private
 *
 * @param {string} text
 * Parantheses string of the function.
 *
 * @param {boolean} alternativeSeparators
 * Whether to expect `;` as argument separator and `,` as decimal separator.
 *
 * @return {Highcharts.FormulaArguments}
 * Parsed arguments array.
 */
function parseArguments(
    text: string,
    alternativeSeparators: boolean
): Arguments {
    const args: Arguments = [],
        argumentsSeparator = (alternativeSeparators ? ';' : ',');

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

        // Check for separator
        if (
            char === argumentsSeparator &&
            !parantheseLevel &&
            term
        ) {
            args.push(parseArgument(term, alternativeSeparators));
            term = '';

        // Check for a quoted string before skip logic
        } else if (
            char === '"' &&
            !parantheseLevel &&
            !term
        ) {
            const string = extractString(text.substring(i));
            args.push(string);
            i += string.length + 1; // only +1 to cover ++i in for-loop

        // Skip space and check paranthesis nesting
        } else if (char !== ' ') {
            term += char;
            if (char === '(') {
                ++parantheseLevel;
            } else if (char === ')') {
                --parantheseLevel;
            }
        }
    }

    // look for left-overs from last argument
    if (!parantheseLevel && term) {
        args.push(parseArgument(term, alternativeSeparators));
    }

    return args;
}


/**
 * Converts a spreadsheet formula string into a formula array. Throws a
 * `FormulaParserError` when the string can not be parsed.
 *
 * @private
 * @function Formula.parseFormula
 *
 * @param {string} text
 * Spreadsheet formula string, without the leading `=`.
 *
 * @param {boolean} alternativeSeparators
 * * `false` to expect `,` between arguments and `.` in decimals.
 * * `true` to expect `;` between arguments and `,` in decimals.
 *
 * @return {Formula.Formula}
 * Formula array representing the string.
 */
function parseFormula(
    text: string,
    alternativeSeparators: boolean
): Formula {
    const decimalRegExp = (
            alternativeSeparators ?
                decimal2RegExp :
                decimal1RegExp
        ),
        formula: Formula = [];

    let match: (RegExpMatchArray|null),
        next = (text[0] === '=' ? text.substring(1) : text).trim();

    while (next) {

        // Check for an R1C1 reference notation
        match = next.match(referenceR1C1RegExp);
        if (match) {
            const columnRelative = (match[2] === '' || match[2][0] === '[');
            const rowRelative = (match[1] === '' || match[1][0] === '[');

            const reference: Reference = {
                type: 'reference',
                column: (
                    columnRelative ?
                        parseInt(match[2].substring(1, -1) || '0', 10) :
                        parseInt(match[2], 10) - 1
                ),
                row: (
                    rowRelative ?
                        parseInt(match[1].substring(1, -1) || '0', 10) :
                        parseInt(match[1], 10) - 1
                )
            };

            if (columnRelative) {
                reference.columnRelative = true;
            }

            if (rowRelative) {
                reference.rowRelative = true;
            }

            formula.push(reference);

            next = next.substring(match[0].length).trim();

            continue;
        }

        // Check for an A1 reference notation
        match = next.match(referenceA1RegExp);
        if (match) {
            const columnRelative = match[1][0] !== '$';
            const rowRelative = match[2][0] !== '$';

            const reference: Reference = {
                type: 'reference',
                column: parseReferenceColumn(
                    columnRelative ?
                        match[1] :
                        match[1].substring(1)
                ) - 1,
                row: parseInt(
                    rowRelative ?
                        match[2] :
                        match[2].substring(1),
                    10
                ) - 1
            };

            if (columnRelative) {
                reference.columnRelative = true;
            }

            if (rowRelative) {
                reference.rowRelative = true;
            }

            formula.push(reference);

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

        // Check for a boolean value
        match = next.match(booleanRegExp);
        if (match) {
            formula.push(match[0] === 'TRUE');

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

        // Check for a quoted string
        if (next[0] === '"') {
            const string = extractString(next);

            formula.push(string.substring(1, -1));

            next = next.substring(string.length + 2).trim();

            continue;
        }

        // Check for a function
        match = next.match(functionRegExp);
        if (match) {
            next = next.substring(match[1].length).trim();

            const parantheses = extractParantheses(next);

            formula.push({
                type: 'function',
                name: match[1],
                args: parseArguments(parantheses, alternativeSeparators)
            });

            next = next.substring(parantheses.length + 2).trim();

            continue;
        }

        // Check for a formula in parantheses
        if (next[0] === '(') {
            const paranteses = extractParantheses(next);

            if (paranteses) {
                formula
                    .push(parseFormula(paranteses, alternativeSeparators));

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

        error.name = 'FormulaParseError';

        throw error;
    }

    return formula;
}


/**
 * Converts a reference column `A` of `A1` into a number. Supports endless sizes
 * `ZZZ...`, just limited by integer precision.
 *
 * @private
 *
 * @param {string} text
 * Column string to convert.
 *
 * @return {number}
 * Converted column index.
 */
function parseReferenceColumn(
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


/* *
 *
 *  Default Export
 *
 * */


const FormulaParser = {
    parseFormula
};


export default FormulaParser;
