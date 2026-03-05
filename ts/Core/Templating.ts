/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TimeBase from '../Shared/TimeBase';
import type { LangOptionsCore } from '../Shared/LangOptionsCore';

import D from './Defaults.js';
const {
    defaultOptions,
    defaultTime
} = D;
import G from './Globals.js';
const {
    pageLang
} = G;
import U from './Utilities.js';
const {
    extend,
    getNestedProperty,
    isArray,
    isNumber,
    isObject,
    isString,
    pick,
    ucfirst
} = U;

/** @internal */
interface MatchObject {
    body?: string;
    ctx: any;
    elseBody?: string;
    expression: string;
    find: string;
    fn?: string;
    length: number;
    isBlock: boolean;
    start: number;
    startInner: number;
}

/** @internal */
const helpers: Record<string, Function> = {
    // Built-in helpers
    add: (a: number, b: number): number => a + b,
    divide: (a: number, b: number): number | string => (b !== 0 ? a / b : ''),
    // eslint-disable-next-line eqeqeq
    eq: (a: unknown, b: unknown): boolean => a == b,
    each: function (arr: string[] | object[] | undefined): string | false {
        const match = arguments[arguments.length - 1];
        return isArray(arr) ?
            arr.map((item, i): string => format(match.body, extend(
                isObject(item) ? item : { '@this': item }, {
                    '@index': i,
                    '@first': i === 0,
                    '@last': i === arr.length - 1
                }
            ))).join('') :
            false;
    },
    ge: (a: number, b: number): boolean => a >= b,
    gt: (a: number, b: number): boolean => a > b,
    'if': (condition: string[] | undefined): boolean => !!condition,
    le: (a: number, b: number): boolean => a <= b,
    lt: (a: number, b: number): boolean => a < b,
    multiply: (a: number, b: number): number => a * b,
    // eslint-disable-next-line eqeqeq
    ne: (a: unknown, b: unknown): boolean => a != b,
    subtract: (a: number, b: number): number => a - b,
    ucfirst,
    unless: (condition: string[] | undefined): boolean => !condition
};

const numberFormatCache: Record<string, Intl.NumberFormat> = {};

/* *
 *
 *  Functions
 *
 * */

/**
 * Internal convenience function.
 * @internal
 */
const isQuotedString = (str: string): boolean => /^["'].+["']$/.test(str);

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
 * @param {boolean} [upperCaseFirst=false]
 *        Upper case first letter in the return.
 *
 * @return {string}
 *         The formatted date.
 */
function dateFormat(
    format: string,
    timestamp: number,
    upperCaseFirst?: boolean
): string {
    return defaultTime.dateFormat(format, timestamp, upperCaseFirst);
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
 * @param {Highcharts.Chart} [owner]
 *        A `Chart` or `Grid` instance used to get numberFormatter and time.
 *
 * @return {string}
 *         The formatted string.
 */
function format(
    str = '',
    ctx: any,
    owner?: Templating.Owner
): string {

    // eslint-disable-next-line prefer-regex-literals
    const regex = new RegExp(
            '\\{([\\p{L}\\d:\\.,;\\-\\/<>\\[\\]%_@+"\'’= #\\(\\)]+)\\}',
            'gu'
        ),
        // The sub expression regex is the same as the top expression regex,
        // but except parens and block helpers (#), and surrounded by parens
        // instead of curly brackets.
        // eslint-disable-next-line prefer-regex-literals
        subRegex = new RegExp(
            '\\(([\\p{L}\\d:\\.,;\\-\\/<>\\[\\]%_@+"\'= ]+)\\)',
            'gu'
        ),
        matches = [],
        floatRegex = /f$/,
        decRegex = /\.(\d)/,
        lang = owner?.options?.lang || defaultOptions.lang,
        time = owner?.time || defaultTime,
        numberFormatter = owner?.numberFormatter || numberFormat.bind(owner);

    /*
     * Get a literal or variable value inside a template expression. May be
     * extended with other types like string or null if needed, but keep it
     * small for now.
     */
    const resolveProperty = (key = ''): unknown => {
        let n: number;

        // Literals
        if (key === 'true') {
            return true;
        }
        if (key === 'false') {
            return false;
        }
        if ((n = Number(key)).toString() === key) {
            return n;
        }
        if (isQuotedString(key)) {
            return key.slice(1, -1);
        }

        // Variables and constants
        return getNestedProperty(key, ctx);
    };

    let match: RegExpExecArray | null,
        currentMatch: MatchObject | undefined,
        depth = 0,
        hasSub: boolean | undefined;

    // Parse and create tree
    while ((match = regex.exec(str)) !== null) {
        // When a sub expression is found, it is evaluated first, and the
        // results recursively evaluated until no subexpression exists.
        const mainMatch = match,
            subMatch = subRegex.exec(match[1]);
        if (subMatch) {
            match = subMatch;
            hasSub = true;
        }
        if (!currentMatch?.isBlock) {
            currentMatch = {
                ctx,
                expression: match[1],
                find: match[0],
                isBlock: match[1].charAt(0) === '#',
                start: match.index,
                startInner: match.index + match[0].length,
                length: match[0].length
            };
        }

        // Identify helpers
        const fn = (
            currentMatch.isBlock ? mainMatch : match
        )[1].split(' ')[0].replace('#', '');
        if (helpers[fn]) {

            // Block helper, only 0 level is handled
            if (currentMatch.isBlock && fn === currentMatch.fn) {
                depth++;
            }
            if (!currentMatch.fn) {
                currentMatch.fn = fn;
            }
        }

        // Closing a block helper
        const startingElseSection = match[1] === 'else';
        if (
            currentMatch.isBlock &&
            currentMatch.fn && (
                match[1] === `/${currentMatch.fn}` ||
                startingElseSection
            )
        ) {
            if (!depth) { // === 0

                const start = currentMatch.startInner,
                    body = str.substr(
                        start,
                        match.index - start
                    );

                // Either closing without an else section, or when encountering
                // an else section
                if (currentMatch.body === void 0) {
                    currentMatch.body = body;
                    currentMatch.startInner = match.index + match[0].length;

                    // The body exists already, so this is the else section
                } else {
                    currentMatch.elseBody = body;
                }
                currentMatch.find += body + match[0];

                if (!startingElseSection) {
                    matches.push(currentMatch);
                    currentMatch = void 0;
                }
            } else if (!startingElseSection) {
                depth--;
            }

            // Common expression
        } else if (!currentMatch.isBlock) {
            matches.push(currentMatch);
        }

        // Evaluate sub-matches one by one to prevent orphaned block closers
        if (subMatch && !currentMatch?.isBlock) {
            break;
        }
    }

    // Execute
    matches.forEach((match): void => {
        const { body, elseBody, expression, fn } = match;
        let replacement: any,
            i: number;

        // Helper function
        if (fn) {
            // Pass the helpers the amount of arguments defined by the function,
            // then the match as the last argument.
            const args: unknown[] = [match],
                parts: Array<string> = [],
                len = expression.length;

            let start = 0,
                startChar;
            for (i = 0; i <= len; i++) {
                const char = expression.charAt(i);

                // Start of string
                if (!startChar && (char === '"' || char === '\'')) {
                    startChar = char;

                    // End of string
                } else if (startChar === char) {
                    startChar = '';
                }

                if (
                    !startChar &&
                    (char === ' ' || i === len)
                ) {
                    parts.push(expression.substr(start, i - start));
                    start = i + 1;
                }
            }

            i = helpers[fn].length;
            while (i--) {
                args.unshift(resolveProperty(parts[i + 1]));
            }

            replacement = helpers[fn].apply(ctx, args);

            // Block helpers may return true or false. They may also return a
            // string, like the `each` helper.
            if (match.isBlock && typeof replacement === 'boolean') {
                replacement = format(
                    replacement ? body : elseBody, ctx, owner
                );
            }


            // Simple variable replacement
        } else {
            const valueAndFormat = isQuotedString(expression) ?
                [expression] : expression.split(':');

            replacement = resolveProperty(valueAndFormat.shift() || '');

            // Format the replacement
            if (valueAndFormat.length && typeof replacement === 'number') {
                const segment = valueAndFormat.join(':');

                if (floatRegex.test(segment)) { // Float
                    const decimals = parseInt(
                        (segment.match(decRegex) || ['', '-1'])[1],
                        10
                    );
                    if (replacement !== null) {
                        replacement = numberFormatter(
                            replacement,
                            decimals,
                            lang.decimalPoint,
                            segment.indexOf(',') > -1 ? lang.thousandsSep : ''
                        );
                    }
                } else {
                    replacement = time.dateFormat(segment, replacement);
                }
            }

            // Use string literal in order to be preserved in the outer
            // expression
            subRegex.lastIndex = 0;
            if (subRegex.test(match.find) && isString(replacement)) {
                replacement = `"${replacement}"`;
            }
        }
        str = str.replace(match.find, pick(replacement, ''));
    });
    return hasSub ? format(str, ctx, owner) : str;
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
    this: Templating.Owner | void,
    number: number,
    decimals: number,
    decimalPoint?: string,
    thousandsSep?: string
): string {
    number = +number || 0;
    decimals = +decimals;

    let ret: string,
        fractionDigits: number,
        [mantissa, exp] = number.toString().split('e').map(Number);

    const lang = this?.options?.lang || defaultOptions.lang,
        origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
        firstDecimals = decimals,
        options: Intl.NumberFormatOptions = {};

    decimalPoint ??= lang.decimalPoint;
    thousandsSep ??= lang.thousandsSep;

    if (decimals === -1) {
        // Preserve decimals. Not huge numbers (#3793).
        decimals = Math.min(origDec, 20);
    } else if (!isNumber(decimals)) {
        decimals = 2;
    } else if (decimals && exp < 0) {
        // Expose decimals from exponential notation (#7042)
        fractionDigits = decimals + exp;
        if (fractionDigits >= 0) {
            // Remove too small part of the number while keeping the notation
            mantissa = +mantissa.toExponential(fractionDigits).split('e')[0];
            decimals = fractionDigits;
        } else {
            // `fractionDigits < 0`
            mantissa = Math.floor(mantissa);

            if (decimals < 20) {
                // Use number instead of exponential notation (#7405)
                number = +(mantissa * Math.pow(10, exp)).toFixed(decimals);
            } else {
                // Or zero
                number = 0;
            }
            exp = 0;
        }
    }

    if (exp) {
        decimals ??= 2;
        number = mantissa;
    }

    if (isNumber(decimals) && decimals >= 0) {
        options.minimumFractionDigits = decimals;
        options.maximumFractionDigits = decimals;
    }
    if (thousandsSep === '') {
        options.useGrouping = false;
    }

    const hasSeparators = thousandsSep || decimalPoint,
        locale = hasSeparators ?
            'en' : (this?.locale || lang.locale || pageLang),
        cacheKey = JSON.stringify(options) + locale,
        nf = numberFormatCache[cacheKey] ??=
            new Intl.NumberFormat(locale, options);

    ret = nf.format(number);

    // If thousandsSep or decimalPoint are set, fall back to using English
    // format with string replacement for the separators.
    if (hasSeparators) {
        ret = ret
            // Preliminary step to avoid re-swapping (#22402)
            .replace(/([,\.])/g, '_$1')
            .replace(/_\,/g, thousandsSep ?? ',')
            .replace('_.', decimalPoint ?? '.');
    }

    if (
        // Remove signed zero (#20564)
        (!decimals && +ret === 0) ||
        // Small numbers, no decimals (#14023)
        (exp < 0 && !firstDecimals)
    ) {
        ret = '0';
    }

    if (exp && +ret !== 0) {
        ret += 'e' + (exp < 0 ? '' : '+') + exp;
    }

    return ret;
}

/* *
 *
 *  Default Export
 *
 * */

const Templating = {
    dateFormat,
    format,
    helpers,
    numberFormat
};

namespace Templating {
    export interface FormatterCallback<T> {
        (this: T): string;
    }
    export interface OwnerOptions {
        /**
         * Language options. See {@link Highcharts.LangOptions} for details.
         */
        lang?: LangOptionsCore;
    }
    export interface Owner {
        /**
         * The chart options. See {@link Highcharts.Options} for details.
         */
        options?: OwnerOptions;
        /**
         * The time object. See {@link Highcharts.Time} for details.
         */
        time?: TimeBase;
        /**
         * A function to format numbers. See {@link Highcharts.numberFormat} for
         * details.
         */
        numberFormatter?: Function;
        /**
         * The locale to use for number formatting.
         */
        locale?: string | string[];
    }
}

export default Templating;

/* *
 * API Declarations
 * */

/**
 * @interface Highcharts.Templating
 *
 * The Highcharts.Templating interface provides a structure for defining
 * helpers. Helpers can be used as conditional blocks or functions within
 * expressions. Highcharts includes several built-in helpers and supports
 * the addition of custom helpers.
 *
 * @see [More information](
 * https://www.highcharts.com/docs/chart-concepts/templating#helpers)
 *
 * @example
 * // Define a custom helper to return the absolute value of a number
 * Highcharts.Templating.helpers.abs = value => Math.abs(value);
 *
 * // Usage in a format string
 * format: 'Absolute value: {abs point.y}'
 *
 * @name Highcharts.Templating#helpers
 * @type {Record<string, Function>}
 */

(''); // Keeps doclets above in file
