/* *
 *
 *  Accessibility module - internationalization support
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../Core/Chart/Chart';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
const {
    format,
    pick
} = U;

declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        /** @requires modules/accessibility */
        langFormat(
            langKey: string,
            context: Record<string, any>,
            time?: Highcharts.Time
        ): string;
    }
}

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface A11yBracketStatementObject {
            begin: number;
            end: number;
            statement: string;
        }
        interface A11yFormatTokenObject {
            type: string;
            value: string;
        }
        /** @requires modules/accessibility */
        function i18nFormat(
            formatString: string,
            context: Record<string, any>,
            chart: Chart
        ): string;
    }
}


/* eslint-disable valid-jsdoc */

/**
 * String trim that works for IE6-8 as well.
 *
 * @private
 * @function stringTrim
 *
 * @param {string} str
 *        The input string
 *
 * @return {string}
 *         The trimmed string
 */
function stringTrim(str: string): string {
    return str.trim && str.trim() || str.replace(/^\s+|\s+$/g, '');
}

/**
 * i18n utility function. Format a single array or plural statement in a format
 * string. If the statement is not an array or plural statement, returns the
 * statement within brackets. Invalid array statements return an empty string.
 *
 * @private
 * @function formatExtendedStatement
 *
 * @param {string} statement
 *
 * @param {Highcharts.Dictionary<*>} ctx
 *        Context to apply to the format string.
 *
 * @return {string}
 */
function formatExtendedStatement(
    statement: string,
    ctx: Record<string, any>
): string {
    var eachStart = statement.indexOf('#each('),
        pluralStart = statement.indexOf('#plural('),
        indexStart = statement.indexOf('['),
        indexEnd = statement.indexOf(']'),
        arr,
        result;

    // Dealing with an each-function?
    if (eachStart > -1) {
        var eachEnd = statement.slice(eachStart).indexOf(')') + eachStart,
            preEach = statement.substring(0, eachStart),
            postEach = statement.substring(eachEnd + 1),
            eachStatement = statement.substring(eachStart + 6, eachEnd),
            eachArguments = eachStatement.split(','),
            lenArg = Number(eachArguments[1]),
            len;

        result = '';
        arr = ctx[eachArguments[0]];
        if (arr) {
            lenArg = isNaN(lenArg) ? arr.length : lenArg;
            len = lenArg < 0 ?
                arr.length + lenArg :
                Math.min(lenArg, arr.length); // Overshoot
            // Run through the array for the specified length
            for (var i = 0; i < len; ++i) {
                result += preEach + arr[i] + postEach;
            }
        }
        return result.length ? result : '';
    }

    // Dealing with a plural-function?
    if (pluralStart > -1) {
        var pluralEnd = statement.slice(pluralStart).indexOf(')') + pluralStart,
            pluralStatement = statement.substring(pluralStart + 8, pluralEnd),
            pluralArguments = pluralStatement.split(','),
            num = Number(ctx[pluralArguments[0]]);

        switch (num) {
            case 0:
                result = pick(pluralArguments[4], pluralArguments[1]);
                break;
            case 1:
                result = pick(pluralArguments[2], pluralArguments[1]);
                break;
            case 2:
                result = pick(pluralArguments[3], pluralArguments[1]);
                break;
            default:
                result = pluralArguments[1];
        }
        return result ? stringTrim(result) : '';
    }

    // Array index
    if (indexStart > -1) {
        var arrayName = statement.substring(0, indexStart),
            ix = Number(statement.substring(indexStart + 1, indexEnd)),
            val;

        arr = ctx[arrayName];
        if (!isNaN(ix) && arr) {
            if (ix < 0) {
                val = arr[arr.length + ix];
                // Handle negative overshoot
                if (typeof val === 'undefined') {
                    val = arr[0];
                }
            } else {
                val = arr[ix];
                // Handle positive overshoot
                if (typeof val === 'undefined') {
                    val = arr[arr.length - 1];
                }
            }
        }
        return typeof val !== 'undefined' ? val : '';
    }

    // Standard substitution, delegate to format or similar
    return '{' + statement + '}';
}


/**
 * i18n formatting function. Extends Highcharts.format() functionality by also
 * handling arrays and plural conditionals. Arrays can be indexed as follows:
 *
 * - Format: 'This is the first index: {myArray[0]}. The last: {myArray[-1]}.'
 *
 * - Context: { myArray: [0, 1, 2, 3, 4, 5] }
 *
 * - Result: 'This is the first index: 0. The last: 5.'
 *
 *
 * They can also be iterated using the #each() function. This will repeat the
 * contents of the bracket expression for each element. Example:
 *
 * - Format: 'List contains: {#each(myArray)cm }'
 *
 * - Context: { myArray: [0, 1, 2] }
 *
 * - Result: 'List contains: 0cm 1cm 2cm '
 *
 *
 * The #each() function optionally takes a length parameter. If positive, this
 * parameter specifies the max number of elements to iterate through. If
 * negative, the function will subtract the number from the length of the array.
 * Use this to stop iterating before the array ends. Example:
 *
 * - Format: 'List contains: {#each(myArray, -1), }and {myArray[-1]}.'
 *
 * - Context: { myArray: [0, 1, 2, 3] }
 *
 * - Result: 'List contains: 0, 1, 2, and 3.'
 *
 *
 * Use the #plural() function to pick a string depending on whether or not a
 * context object is 1. Arguments are #plural(obj, plural, singular). Example:
 *
 * - Format: 'Has {numPoints} {#plural(numPoints, points, point}.'
 *
 * - Context: { numPoints: 5 }
 *
 * - Result: 'Has 5 points.'
 *
 *
 * Optionally there are additional parameters for dual and none: #plural(obj,
 * plural, singular, dual, none). Example:
 *
 * - Format: 'Has {#plural(numPoints, many points, one point, two points,
 *   none}.'
 *
 * - Context: { numPoints: 2 }
 *
 * - Result: 'Has two points.'
 *
 *
 * The dual or none parameters will take precedence if they are supplied.
 *
 * @requires modules/accessibility
 *
 * @function Highcharts.i18nFormat
 *
 * @param {string} formatString
 *        The string to format.
 *
 * @param {Highcharts.Dictionary<*>} context
 *        Context to apply to the format string.
 *
 * @param {Highcharts.Chart} chart
 *        A `Chart` instance with a time object and numberFormatter, passed on
 *        to format().
 *
 * @return {string}
 *         The formatted string.
 */
H.i18nFormat = function (
    formatString: string,
    context: Record<string, any>,
    chart: Chart
): string {
    var getFirstBracketStatement = function (
            sourceStr: string,
            offset: number
        ): (Highcharts.A11yBracketStatementObject|undefined) {
            var str = sourceStr.slice(offset || 0),
                startBracket = str.indexOf('{'),
                endBracket = str.indexOf('}');

            if (startBracket > -1 && endBracket > startBracket) {
                return {
                    statement: str.substring(startBracket + 1, endBracket),
                    begin: offset + startBracket + 1,
                    end: offset + endBracket
                };
            }
        },
        tokens: Array<Highcharts.A11yFormatTokenObject> = [],
        bracketRes,
        constRes,
        cursor = 0;

    // Tokenize format string into bracket statements and constants
    do {
        bracketRes = getFirstBracketStatement(formatString, cursor);
        constRes = formatString.substring(
            cursor,
            bracketRes && bracketRes.begin - 1
        );

        // If we have constant content before this bracket statement, add it
        if (constRes.length) {
            tokens.push({
                value: constRes,
                type: 'constant'
            });
        }

        // Add the bracket statement
        if (bracketRes) {
            tokens.push({
                value: bracketRes.statement,
                type: 'statement'
            });
        }

        cursor = bracketRes ? bracketRes.end + 1 : cursor + 1;
    } while (bracketRes);

    // Perform the formatting. The formatArrayStatement function returns the
    // statement in brackets if it is not an array statement, which means it
    // gets picked up by format below.
    tokens.forEach(function (token: Highcharts.A11yFormatTokenObject): void {
        if (token.type === 'statement') {
            token.value = formatExtendedStatement(token.value, context);
        }
    });

    // Join string back together and pass to format to pick up non-array
    // statements.
    return format(tokens.reduce(function (
        acc: string,
        cur: Highcharts.A11yFormatTokenObject
    ): string {
        return acc + cur.value;
    }, ''), context, chart);
};


/**
 * Apply context to a format string from lang options of the chart.
 *
 * @requires modules/accessibility
 *
 * @function Highcharts.Chart#langFormat
 *
 * @param {string} langKey
 *        Key (using dot notation) into lang option structure.
 *
 * @param {Highcharts.Dictionary<*>} context
 *        Context to apply to the format string.
 *
 * @return {string}
 *         The formatted string.
 */
H.Chart.prototype.langFormat = function (
    langKey: string,
    context: Record<string, any>
): string {
    var keys = langKey.split('.'),
        formatString: string = this.options.lang as any,
        i = 0;

    for (; i < keys.length; ++i) {
        formatString = formatString && (formatString as any)[keys[i]];
    }
    return typeof formatString === 'string' ?
        H.i18nFormat(formatString, context, this) : '';
};
