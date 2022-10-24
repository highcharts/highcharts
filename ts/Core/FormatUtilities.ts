/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from './Chart/Chart';

import D from './DefaultOptions.js';
const {
    defaultOptions,
    defaultTime
} = D;
import U from './Utilities.js';
const {
    getNestedProperty,
    isNumber,
    pick,
    pInt
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Formats a JavaScript date timestamp (milliseconds since Jan 1st 1970) into a
 * human readable date string. The format is a subset of the formats for PHP's
 * [strftime](https://www.php.net/manual/en/function.strftime.php) function.
 * Additional formats can be given in the {@link Highcharts.dateFormats} hook.
 *
 * Since v6.0.5, all internal dates are formatted through the
 * {@link Highcharts.Chart#time} instance to respect chart-level time settings.
 * The `Highcharts.dateFormat` function only reflects global time settings set
 * with `setOptions`.
 *
 * Supported format keys:
 * - `%a`: Short weekday, like 'Mon'
 * - `%A`: Long weekday, like 'Monday'
 * - `%d`: Two digit day of the month, 01 to 31
 * - `%e`: Day of the month, 1 through 31
 * - `%w`: Day of the week, 0 through 6
 * - `%b`: Short month, like 'Jan'
 * - `%B`: Long month, like 'January'
 * - `%m`: Two digit month number, 01 through 12
 * - `%y`: Two digits year, like 09 for 2009
 * - `%Y`: Four digits year, like 2009
 * - `%H`: Two digits hours in 24h format, 00 through 23
 * - `%k`: Hours in 24h format, 0 through 23
 * - `%I`: Two digits hours in 12h format, 00 through 11
 * - `%l`: Hours in 12h format, 1 through 12
 * - `%M`: Two digits minutes, 00 through 59
 * - `%p`: Upper case AM or PM
 * - `%P`: Lower case AM or PM
 * - `%S`: Two digits seconds, 00 through 59
 * - `%L`: Milliseconds (naming from Ruby)
 *
 * @function Highcharts.dateFormat
 *
 * @param {string} format
 *        The desired format where various time representations are prefixed
 *        with `%`.
 *
 * @param {number} timestamp
 *        The JavaScript timestamp.
 *
 * @param {boolean} [capitalize=false]
 *        Upper case first letter in the return.
 *
 * @return {string}
 *         The formatted date.
 */
function dateFormat(
    format: string,
    timestamp: number,
    capitalize?: boolean
): string {
    return defaultTime.dateFormat(format, timestamp, capitalize);
}

/**
 * Format a string according to a subset of the rules of Python's String.format
 * method.
 *
 * @example
 * let s = Highcharts.format(
 *     'The {color} fox was {len:.2f} feet long',
 *     { color: 'red', len: Math.PI }
 * );
 * // => The red fox was 3.14 feet long
 *
 * @function Highcharts.format
 *
 * @param {string} str
 *        The string to format.
 *
 * @param {Record<string, *>} ctx
 *        The context, a collection of key-value pairs where each key is
 *        replaced by its value.
 *
 * @param {Highcharts.Chart} [chart]
 *        A `Chart` instance used to get numberFormatter and time.
 *
 * @return {string}
 *         The formatted string.
 */
function format(str: string, ctx: any, chart?: Chart): string {
    let splitter = '{',
        isInside = false,
        segment,
        valueAndFormat: Array<string>,
        val,
        index;
    const floatRegex = /f$/;
    const decRegex = /\.([0-9])/;
    const lang = defaultOptions.lang;
    const time = chart && chart.time || defaultTime;
    const numberFormatter = chart && chart.numberFormatter || numberFormat;
    const ret = [];

    while (str) {
        index = str.indexOf(splitter);
        if (index === -1) {
            break;
        }

        segment = str.slice(0, index);
        if (isInside) { // we're on the closing bracket looking back

            valueAndFormat = segment.split(':');
            val = getNestedProperty(valueAndFormat.shift() || '', ctx);

            // Format the replacement
            if (valueAndFormat.length && typeof val === 'number') {

                segment = valueAndFormat.join(':');

                if (floatRegex.test(segment)) { // float
                    const decimals = parseInt(
                        (segment.match(decRegex) || ['', '-1'])[1],
                        10
                    );
                    if (val !== null) {
                        val = numberFormatter(
                            val,
                            decimals,
                            lang.decimalPoint,
                            segment.indexOf(',') > -1 ? lang.thousandsSep : ''
                        );
                    }
                } else {
                    val = time.dateFormat(segment, val);
                }
            }

            // Push the result and advance the cursor
            ret.push(val);
        } else {
            ret.push(segment);

        }
        str = str.slice(index + 1); // the rest
        isInside = !isInside; // toggle
        splitter = isInside ? '}' : '{'; // now look for next matching bracket
    }
    ret.push(str);
    return ret.join('');
}

/**
 * Format a number and return a string based on input settings.
 *
 * @sample highcharts/members/highcharts-numberformat/
 *         Custom number format
 *
 * @function Highcharts.numberFormat
 *
 * @param {number} number
 *        The input number to format.
 *
 * @param {number} decimals
 *        The amount of decimals. A value of -1 preserves the amount in the
 *        input number.
 *
 * @param {string} [decimalPoint]
 *        The decimal point, defaults to the one given in the lang options, or
 *        a dot.
 *
 * @param {string} [thousandsSep]
 *        The thousands separator, defaults to the one given in the lang
 *        options, or a space character.
 *
 * @return {string}
 *         The formatted number.
 */
function numberFormat(
    number: number,
    decimals: number,
    decimalPoint?: string,
    thousandsSep?: string
): string {
    number = +number || 0;
    decimals = +decimals;

    let ret,
        fractionDigits;

    const lang = defaultOptions.lang,
        origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
        exponent = number.toString().split('e'),
        firstDecimals = decimals;

    if (decimals === -1) {
        // Preserve decimals. Not huge numbers (#3793).
        decimals = Math.min(origDec, 20);
    } else if (!isNumber(decimals)) {
        decimals = 2;
    } else if (decimals && exponent[1] && exponent[1] as any < 0) {
        // Expose decimals from exponential notation (#7042)
        fractionDigits = decimals + +exponent[1];
        if (fractionDigits >= 0) {
            // remove too small part of the number while keeping the notation
            exponent[0] = (+exponent[0]).toExponential(fractionDigits)
                .split('e')[0];
            decimals = fractionDigits;
        } else {
            // fractionDigits < 0
            exponent[0] = exponent[0].split('.')[0] || 0 as any;

            if (decimals < 20) {
                // use number instead of exponential notation (#7405)
                number = (exponent[0] as any * Math.pow(10, exponent[1] as any))
                    .toFixed(decimals) as any;
            } else {
                // or zero
                number = 0;
            }
            exponent[1] = 0 as any;
        }
    }

    // Add another decimal to avoid rounding errors of float numbers. (#4573)
    // Then use toFixed to handle rounding.
    const roundedNumber = (
        Math.abs(exponent[1] ? exponent[0] as any : number) +
        Math.pow(10, -Math.max(decimals, origDec) - 1)
    ).toFixed(decimals);

    // A string containing the positive integer component of the number
    const strinteger = String(pInt(roundedNumber));

    // Leftover after grouping into thousands. Can be 0, 1 or 2.
    const thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

    // Language
    decimalPoint = pick(decimalPoint, lang.decimalPoint);
    thousandsSep = pick(thousandsSep, lang.thousandsSep);

    // Start building the return
    ret = number < 0 ? '-' : '';

    // Add the leftover after grouping into thousands. For example, in the
    // number 42 000 000, this line adds 42.
    ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

    if (+exponent[1] < 0 && !firstDecimals) {
        ret = '0';
    } else {
        // Add the remaining thousands groups, joined by the thousands separator
        ret += strinteger
            .substr(thousands)
            .replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
    }

    // Add the decimal point and the decimal component
    if (decimals) {
        // Get the decimal component
        ret += decimalPoint + roundedNumber.slice(-decimals);
    }

    if (exponent[1] && +ret !== 0) {
        ret += 'e' + exponent[1];
    }

    return ret;
}

/* *
 *
 *  Default Export
 *
 * */

const FormatUtilities = {
    dateFormat,
    format,
    numberFormat
};

namespace FormatUtilities {
    export interface FormatterCallback<T> {
        (this: T): string;
    }
}

export default FormatUtilities;
