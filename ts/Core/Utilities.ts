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

import type AxisType from './Axis/AxisType';
import type Chart from './Chart/Chart';
import type CSSObject from './Renderer/CSSObject';
import type {
    TypedArray
} from '../Shared/Types';
import type {
    DOMElementType,
    HTMLDOMElement
} from './Renderer/DOMElementType';
import type { EventCallback } from './Callback';
import type HTMLAttributes from './Renderer/HTML/HTMLAttributes';
import type Series from './Series/Series';
import type SVGAttributes from './Renderer/SVG/SVGAttributes';
import type Time from './Time';

import { extend, isNumber, isObject, isString, objectEach, pInt } from '../Shared/Utilities.js';
import H from './Globals.js';
const {
    charts,
    doc,
    win
} = H;


type NullType = (null|undefined);

/* *
 *
 *  Functions
 *
 * */

/**
 * Provide error messages for debugging, with links to online explanation. This
 * function can be overridden to provide custom error handling.
 *
 * @sample highcharts/chart/highcharts-error/
 *         Custom error handler
 *
 * @function Highcharts.error
 *
 * @param {number|string} code
 *        The error code. See
 *        [errors.xml](https://github.com/highcharts/highcharts/blob/master/errors/errors.xml)
 *        for available codes. If it is a string, the error message is printed
 *        directly in the console.
 *
 * @param {boolean} [stop=false]
 *        Whether to throw an error or just log a warning in the console.
 *
 * @param {Highcharts.Chart} [chart]
 *        Reference to the chart that causes the error. Used in 'debugger'
 *        module to display errors directly on the chart.
 *        Important note: This argument is undefined for errors that lack
 *        access to the Chart instance. In such case, the error will be
 *        displayed on the last created chart.
 *
 * @param {Highcharts.Dictionary<string>} [params]
 *        Additional parameters for the generated message.
 *
 * @return {void}
 */
function error(
    code: (number|string),
    stop?: boolean,
    chart?: Chart,
    params?: Record<string, string>
): void {
    const severity = stop ? 'Highcharts error' : 'Highcharts warning';
    if (code === 32) {
        code = `${severity}: Deprecated member`;
    }

    const isCode = isNumber(code);
    let message = isCode ?
        `${severity} #${code}: www.highcharts.com/errors/${code}/` :
        code.toString();
    const defaultHandler = function (): void {
        if (stop) {
            throw new Error(message);
        }
        // Else ...
        if (
            win.console &&
            error.messages.indexOf(message) === -1 // Prevent console flooting
        ) {
            console.warn(message); // eslint-disable-line no-console
        }
    };

    if (typeof params !== 'undefined') {
        let additionalMessages = '';
        if (isCode) {
            message += '?';
        }
        objectEach(params, function (value, key): void {
            additionalMessages += `\n - ${key}: ${value}`;
            if (isCode) {
                message += encodeURI(key) + '=' + encodeURI(value);
            }
        });
        message += additionalMessages;
    }

    fireEvent(
        H,
        'displayError',
        { chart, code, message, params },
        defaultHandler
    );

    error.messages.push(message);
}
namespace error {
    export const messages: Array<string> = [];
}

/**
 * Insert a series or an axis in a collection with other items, either the
 * chart series or yAxis series or axis collections, in the correct order
 * according to the index option and whether it is internal. Used internally
 * when adding series and axes.
 *
 * @internal
 * @function Highcharts.Chart#insertItem
 * @param  {Highcharts.Series|Highcharts.Axis} item
 *         The item to insert
 * @param  {Array<Highcharts.Series>|Array<Highcharts.Axis>} collection
 *         A collection of items, like `chart.series` or `xAxis.series`.
 * @return {number} The index of the series in the collection.
 */
function insertItem(
    item: Series|AxisType,
    collection: Array<Series|AxisType>
): number {
    const indexOption = (item as Series).options.index,
        length = collection.length;
    let i: number|undefined;

    for (
        // Internal item (navigator) should always be pushed to the end
        i = item.options.isInternal ? length : 0;
        i < length + 1;
        i++
    ) {
        if (
            // No index option, reached the end of the collection,
            // equivalent to pushing
            !collection[i] ||

            // Handle index option, the element to insert has lower index
            (
                isNumber(indexOption) &&
                indexOption < pick(
                    (collection[i] as Series).options.index,
                    (collection[i] as Series)._i
                )
            ) ||

            // Insert the new item before other internal items
            // (navigator)
            collection[i].options.isInternal
        ) {
            collection.splice(i, 0, item);
            break;
        }
    }
    return i;
}

/**
 * Check if an object is null or undefined.
 *
 * @function Highcharts.defined
 *
 * @param {*} obj
 *        The object to check.
 *
 * @return {boolean}
 *         False if the object is null or undefined, otherwise true.
 */
function defined<T>(obj: T): obj is NonNullable<T> {
    return typeof obj !== 'undefined' && obj !== null;
}

function attr(
    elem: DOMElementType,
    prop: (HTMLAttributes|SVGAttributes)
): undefined;
function attr(
    elem: DOMElementType,
    prop: string,
    value?: undefined
): (string|null);
function attr(
    elem: DOMElementType,
    prop: string,
    value: (number|string)
): undefined;
/**
 * Set or get an attribute or an object of attributes.
 *
 * To use as a setter, pass a key and a value, or let the second argument be a
 * collection of keys and values. When using a collection, passing a value of
 * `null` or `undefined` will remove the attribute.
 *
 * To use as a getter, pass only a string as the second argument.
 *
 * @function Highcharts.attr
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} elem
 *        The DOM element to receive the attribute(s).
 *
 * @param {string|Highcharts.HTMLAttributes|Highcharts.SVGAttributes} [keyOrAttribs]
 *        The property or an object of key-value pairs.
 *
 * @param {number|string} [value]
 *        The value if a single property is set.
 *
 * @return {string|null|undefined}
 *         When used as a getter, return the value.
 */
function attr(
    elem: DOMElementType,
    keyOrAttribs: (string|HTMLAttributes|SVGAttributes),
    value?: (number|string)
): (string|null|undefined) {

    const isGetter = isString(keyOrAttribs) && !defined(value);

    let ret: string|null|undefined;

    const attrSingle = (
        value: number|string|boolean|undefined,
        key: string
    ): void => {

        // Set the value
        if (defined(value)) {
            elem.setAttribute(key, value);

        // Get the value
        } else if (isGetter) {
            ret = elem.getAttribute(key);

            // IE7 and below cannot get class through getAttribute (#7850)
            if (!ret && key === 'class') {
                ret = elem.getAttribute(key + 'Name');
            }

        // Remove the value
        } else {
            elem.removeAttribute(key);
        }
    };

    // If keyOrAttribs is a string
    if (isString(keyOrAttribs)) {
        attrSingle(value, keyOrAttribs);

    // Else if keyOrAttribs is defined, it is a hash of key/value pairs
    } else {
        objectEach(keyOrAttribs, attrSingle);
    }
    return ret;
}

/**
 * Set a timeout if the delay is given, otherwise perform the function
 * synchronously.
 *
 * @function Highcharts.syncTimeout
 *
 * @param {Function} fn
 *        The function callback.
 *
 * @param {number} delay
 *        Delay in milliseconds.
 *
 * @param {*} [context]
 *        An optional context to send to the function callback.
 *
 * @return {number}
 *         An identifier for the timeout that can later be cleared with
 *         Highcharts.clearTimeout. Returns -1 if there is no timeout.
 */
function syncTimeout(
    fn: Function,
    delay: number,
    context?: unknown
): number {
    if (delay > 0) {
        return setTimeout(fn, delay, context);
    }
    fn.call(0, context);
    return -1;
}

/**
 * Internal clear timeout. The function checks that the `id` was not removed
 * (e.g. by `chart.destroy()`). For the details see
 * [issue #7901](https://github.com/highcharts/highcharts/issues/7901).
 *
 * @function Highcharts.clearTimeout
 *
 * @param {number|undefined} id
 * Id of a timeout.
 */
function internalClearTimeout(id: (number|undefined)): void {
    if (defined(id)) {
        clearTimeout(id);
    }
}

function pick<T1, T2, T3, T4, T5>(...args: [T1, T2, T3, T4, T5]):
T1 extends NullType ?
    T2 extends NullType ?
        T3 extends NullType ?
            T4 extends NullType ?
                T5 extends NullType ? undefined : T5 : T4 : T3 : T2 : T1;
function pick<T1, T2, T3, T4>(...args: [T1, T2, T3, T4]):
T1 extends NullType ?
    T2 extends NullType ?
        T3 extends NullType ?
            T4 extends NullType ? undefined : T4 : T3 : T2 : T1;
function pick<T1, T2, T3>(...args: [T1, T2, T3]):
T1 extends NullType ?
    T2 extends NullType ?
        T3 extends NullType ? undefined : T3 : T2 : T1;
function pick<T1, T2>(...args: [T1, T2]):
T1 extends NullType ?
    T2 extends NullType ? undefined : T2 : T1;
function pick<T1>(...args: [T1]):
T1 extends NullType ? undefined : T1;
function pick<T>(...args: Array<T|null|undefined>): T|undefined;
/* eslint-disable valid-jsdoc */
/**
 * Return the first value that is not null or undefined.
 *
 * @function Highcharts.pick<T>
 *
 * @param {...Array<T|null|undefined>} items
 *        Variable number of arguments to inspect.
 *
 * @return {T}
 *         The value of the first argument that is not null or undefined.
 */
function pick<T>(): T|undefined {
    const args = arguments;
    const length = args.length;
    for (let i = 0; i < length; i++) {
        const arg = args[i];
        if (typeof arg !== 'undefined' && arg !== null) {
            return arg;
        }
    }
}

/**
 * Set CSS on a given element.
 *
 * @function Highcharts.css
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} el
 *        An HTML DOM element.
 *
 * @param {Highcharts.CSSObject} styles
 *        Style object with camel case property names.
 *
 * @return {void}
 */
function css(
    el: DOMElementType,
    styles: CSSObject
): void {
    extend(el.style, styles as any);
}

/**
 * Utility function to create an HTML element with attributes and styles.
 *
 * @function Highcharts.createElement
 *
 * @param {string} tag
 *        The HTML tag.
 *
 * @param {Highcharts.HTMLAttributes} [attribs]
 *        Attributes as an object of key-value pairs.
 *
 * @param {Highcharts.CSSObject} [styles]
 *        Styles as an object of key-value pairs.
 *
 * @param {Highcharts.HTMLDOMElement} [parent]
 *        The parent HTML object.
 *
 * @param {boolean} [nopad=false]
 *        If true, remove all padding, border and margin.
 *
 * @return {Highcharts.HTMLDOMElement}
 *         The created DOM element.
 */
function createElement(
    tag: string,
    attribs?: HTMLAttributes,
    styles?: CSSObject,
    parent?: HTMLDOMElement,
    nopad?: boolean
): HTMLDOMElement {
    const el = doc.createElement(tag);

    if (attribs) {
        extend(el, attribs);
    }
    if (nopad) {
        css(el, { padding: '0', border: 'none', margin: '0' });
    }
    if (styles) {
        css(el, styles);
    }
    if (parent) {
        parent.appendChild(el);
    }
    return el;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Extend a prototyped class by new members.
 *
 * @deprecated
 * @function Highcharts.extendClass<T>
 *
 * @param {Highcharts.Class<T>} parent
 *        The parent prototype to inherit.
 *
 * @param {Highcharts.Dictionary<*>} members
 *        A collection of prototype members to add or override compared to the
 *        parent prototype.
 *
 * @return {Highcharts.Class<T>}
 *         A new prototype.
 */
function extendClass <T, TReturn = T>(
    parent: Class<T>,
    members: any
): Class<TReturn> {
    const obj: Class<TReturn> = (function (): void {}) as any;

    obj.prototype = new parent(); // eslint-disable-line new-cap
    extend(obj.prototype, members);
    return obj;
}

/**
 * Left-pad a string to a given length by adding a character repetitively.
 *
 * @function Highcharts.pad
 *
 * @param {number} number
 *        The input string or number.
 *
 * @param {number} [length]
 *        The desired string length.
 *
 * @param {string} [padder=0]
 *        The character to pad with.
 *
 * @return {string}
 *         The padded string.
 */
function pad(number: number, length?: number, padder?: string): string {
    return new Array(
        (length || 2) +
        1 -
        String(number)
            .replace('-', '')
            .length
    ).join(padder || '0') + number;
}

/**
 * Return a length based on either the integer value, or a percentage of a base.
 *
 * @function Highcharts.relativeLength
 *
 * @param {Highcharts.RelativeSize} value
 *        A percentage string or a number.
 *
 * @param {number} base
 *        The full length that represents 100%.
 *
 * @param {number} [offset=0]
 *        A pixel offset to apply for percentage values. Used internally in
 *        axis positioning.
 *
 * @return {number}
 *         The computed length.
 */
function relativeLength(
    value: Utilities.RelativeSize,
    base: number,
    offset?: number
): number {
    return (/%$/).test(value as any) ?
        (base * parseFloat(value as any) / 100) + (offset || 0) :
        parseFloat(value as any);
}

/**
 * Replaces text in a string with a given replacement in a loop to catch nested
 * matches after previous replacements.
 *
 * @function Highcharts.replaceNested
 *
 * @param {string} text
 * Text to search and modify.
 *
 * @param {...Array<(RegExp|string)>} replacements
 * One or multiple tuples with search pattern (`[0]: (string|RegExp)`) and
 * replacement (`[1]: string`) for matching text.
 *
 * @return {string}
 * Text with replacements.
 */
function replaceNested(
    text: string,
    ...replacements: Array<[pattern: (string|RegExp), replacement: string]>
): string {
    let previous: string,
        replacement: [(string|RegExp), string];

    do {
        previous = text;

        for (replacement of replacements) {
            text = text.replace(replacement[0], replacement[1]);
        }
    } while (text !== previous);

    return text;
}

/**
 * Wrap a method with extended functionality, preserving the original function.
 *
 * @function Highcharts.wrap
 *
 * @param {*} obj
 *        The context object that the method belongs to. In real cases, this is
 *        often a prototype.
 *
 * @param {string} method
 *        The name of the method to extend.
 *
 * @param {Highcharts.WrapProceedFunction} func
 *        A wrapper function callback. This function is called with the same
 *        arguments as the original function, except that the original function
 *        is unshifted and passed as the first argument.
 */
function wrap<T, K extends FunctionNamesOf<T>>(
    obj: T,
    method: K,
    func: Utilities.WrapProceedFunction<T[K]&ArrowFunction>
): void {
    const proceed = obj[method] as T[K]&ArrowFunction;

    obj[method] = function (this: T): ReturnType<typeof func> {
        const outerArgs = arguments,
            scope = this;

        return func.apply(this, [
            function (): ReturnType<typeof proceed> {
                return proceed.apply(
                    scope,
                    arguments.length ? arguments : outerArgs
                );
            }
        ].concat(
            [].slice.call(arguments)
        ) as Parameters<typeof func>);
    } as T[K];
}

/**
 * Get the magnitude of a number.
 *
 * @function Highcharts.getMagnitude
 *
 * @param {number} num
 *        The number.
 *
 * @return {number}
 *         The magnitude, where 1-9 are magnitude 1, 10-99 magnitude 2 etc.
 */
function getMagnitude(num: number): number {
    return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
}

/**
 * Take an interval and normalize it to multiples of round numbers.
 *
 * @deprecated
 * @function Highcharts.normalizeTickInterval
 *
 * @param {number} interval
 *        The raw, un-rounded interval.
 *
 * @param {Array<*>} [multiples]
 *        Allowed multiples.
 *
 * @param {number} [magnitude]
 *        The magnitude of the number.
 *
 * @param {boolean} [allowDecimals]
 *        Whether to allow decimals.
 *
 * @param {boolean} [hasTickAmount]
 *        If it has tickAmount, avoid landing on tick intervals lower than
 *        original.
 *
 * @return {number}
 *         The normalized interval.
 *
 * @todo
 * Move this function to the Axis prototype. It is here only for historical
 * reasons.
 */
function normalizeTickInterval(
    interval: number,
    multiples?: Array<number>,
    magnitude?: number,
    allowDecimals?: boolean,
    hasTickAmount?: boolean
): number {
    let i,
        retInterval = interval;

    // Round to a tenfold of 1, 2, 2.5 or 5
    magnitude = pick(magnitude, getMagnitude(interval));
    const normalized = interval / magnitude;

    // Multiples for a linear scale
    if (!multiples) {
        multiples = hasTickAmount ?
            // Finer grained ticks when the tick amount is hard set, including
            // when alignTicks is true on multiple axes (#4580).
            [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] :

            // Else, let ticks fall on rounder numbers
            [1, 2, 2.5, 5, 10];


        // The allowDecimals option
        if (allowDecimals === false) {
            if (magnitude === 1) {
                multiples = multiples.filter(function (num: number): boolean {
                    return num % 1 === 0;
                });
            } else if (magnitude <= 0.1) {
                multiples = [1 / magnitude];
            }
        }
    }

    // Normalize the interval to the nearest multiple
    for (i = 0; i < multiples.length; i++) {
        retInterval = multiples[i];
        // Only allow tick amounts smaller than natural
        if (
            (
                hasTickAmount &&
                retInterval * magnitude >= interval
            ) ||
            (
                !hasTickAmount &&
                (
                    normalized <=
                    (
                        multiples[i] +
                        (multiples[i + 1] || multiples[i])
                    ) / 2
                )
            )
        ) {
            break;
        }
    }

    // Multiply back to the correct magnitude. Correct floats to appropriate
    // precision (#6085).
    retInterval = correctFloat(
        retInterval * (magnitude as any),
        -Math.round(Math.log(0.001) / Math.LN10)
    );

    return retInterval;
}


/**
 * Sort an object array and keep the order of equal items. The ECMAScript
 * standard does not specify the behaviour when items are equal.
 *
 * @function Highcharts.stableSort
 *
 * @param {Array<*>} arr
 *        The array to sort.
 *
 * @param {Function} sortFunction
 *        The function to sort it with, like with regular Array.prototype.sort.
 */
function stableSort<T>(
    arr: Array<T>,
    sortFunction: (a: T, b: T) => number
): void {

    // @todo It seems like Chrome since v70 sorts in a stable way internally,
    // plus all other browsers do it, so over time we may be able to remove this
    // function
    const length = arr.length;
    let sortValue,
        i;

    // Add index to each item
    for (i = 0; i < length; i++) {
        (arr[i] as any).safeI = i; // Stable sort index
    }

    arr.sort(function (a: any, b: any): number {
        sortValue = sortFunction(a, b);
        return sortValue === 0 ? a.safeI - b.safeI : sortValue;
    });

    // Remove index from items
    for (i = 0; i < length; i++) {
        delete (arr[i] as any).safeI; // Stable sort index
    }
}

/**
 * Non-recursive method to find the lowest member of an array. `Math.min` raises
 * a maximum call stack size exceeded error in Chrome when trying to apply more
 * than 150.000 points. This method is slightly slower, but safe.
 *
 * @function Highcharts.arrayMin
 *
 * @param {Array<*>} data
 *        An array of numbers.
 *
 * @return {number}
 *         The lowest number.
 */
function arrayMin(data: Array<any>|TypedArray): number {
    let i = data.length,
        min = data[0];

    while (i--) {
        if (data[i] < min) {
            min = data[i];
        }
    }
    return min;
}

/**
 * Non-recursive method to find the lowest member of an array. `Math.max` raises
 * a maximum call stack size exceeded error in Chrome when trying to apply more
 * than 150.000 points. This method is slightly slower, but safe.
 *
 * @function Highcharts.arrayMax
 *
 * @param {Array<*>} data
 *        An array of numbers.
 *
 * @return {number}
 *         The highest number.
 */
function arrayMax(data: Array<any>|TypedArray): number {
    let i = data.length,
        max = data[0];

    while (i--) {
        if (data[i] > max) {
            max = data[i];
        }
    }
    return max;
}

/**
 * Utility method that destroys any SVGElement instances that are properties on
 * the given object. It loops all properties and invokes destroy if there is a
 * destroy method. The property is then delete.
 *
 * @function Highcharts.destroyObjectProperties
 *
 * @param {*} obj
 *        The object to destroy properties on.
 *
 * @param {*} [except]
 *        Exception, do not destroy this property, only delete it.
 */
function destroyObjectProperties(
    obj: any,
    except?: any,
    destructablesOnly?: boolean
): void {
    objectEach(obj, function (val, n): void {
        // If the object is non-null and destroy is defined
        if (val !== except && val?.destroy) {
            // Invoke the destroy
            val.destroy();
        }

        // Delete the property from the object
        if (val?.destroy || !destructablesOnly) {
            delete obj[n];
        }
    });
}


/**
 * Discard a HTML element
 *
 * @function Highcharts.discardElement
 *
 * @param {Highcharts.HTMLDOMElement} element
 *        The HTML node to discard.
 */
function discardElement(element?: HTMLDOMElement): void {
    element?.parentElement?.removeChild(element);
}


/**
 * Fix JS round off float errors.
 *
 * @function Highcharts.correctFloat
 *
 * @param {number} num
 *        A float number to fix.
 *
 * @param {number} [prec=14]
 *        The precision.
 *
 * @return {number}
 *         The corrected float number.
 */
function correctFloat(num: number, prec?: number): number {

    // When the number is higher than 1e14 use the number (#16275)
    return num > 1e14 ? num : parseFloat(
        num.toPrecision(prec || 14)
    );
}

/**
 * The time unit lookup
 *
 * @ignore
 */

const timeUnits: Record<Time.TimeUnit, number> = {
    millisecond: 1,
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 24 * 3600000,
    week: 7 * 24 * 3600000,
    month: 28 * 24 * 3600000,
    year: 364 * 24 * 3600000
};

/**
 * Easing definition
 *
 * @internal
 * @function Math.easeInOutSine
 *
 * @param {number} pos
 * Current position, ranging from 0 to 1.
 *
 * @return {number}
 * Ease result
 */
Math.easeInOutSine = function (pos: number): number {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
};

/**
 * Convenience function to get the align factor, used several places for
 * computing positions
 * @internal
 */
const getAlignFactor = (align: string = ''): number => ({
    center: 0.5,
    right: 1,
    middle: 0.5,
    bottom: 1
}[align] || 0);

/**
 * Find the closest distance between two values of a two-dimensional array
 * @internal
 * @function Highcharts.getClosestDistance
 *
 * @param {Array<Array<number>>} arrays
 *          An array of arrays of numbers
 *
 * @return {number | undefined}
 *          The closest distance between values
 */
function getClosestDistance(
    arrays: (number[]|TypedArray)[],
    onError?: Function
): (number|undefined) {
    const allowNegative = !onError;
    let closest: number | undefined,
        loopLength: number,
        distance: number,
        i: number;

    arrays.forEach((xData): void => {
        if (xData.length > 1) {
            loopLength = xData.length - 1;
            for (i = loopLength; i > 0; i--) {
                distance = xData[i] - xData[i - 1];
                if (distance < 0 && !allowNegative) {
                    onError?.();
                    // Only one call
                    onError = void 0;
                } else if (distance && (
                    typeof closest === 'undefined' || distance < closest
                )) {
                    closest = distance;
                }
            }
        }
    });

    return closest;
}

/**
 * Returns the value of a property path on a given object.
 *
 * @internal
 * @function getNestedProperty
 *
 * @param {string} path
 * Path to the property, for example `custom.myValue`.
 *
 * @param {unknown} obj
 * Instance containing the property on the specific path.
 *
 * @return {unknown}
 * The unknown property value.
 */
function getNestedProperty(path: string, parent: unknown): unknown {

    const pathElements = path.split('.');

    while (pathElements.length && defined(parent)) {
        const pathElement = pathElements.shift();

        // Filter on the key
        if (
            typeof pathElement === 'undefined' ||
            pathElement === '__proto__'
        ) {
            return; // Undefined
        }

        if (pathElement === 'this') {
            let thisProp;
            if (isObject(parent)) {
                thisProp = (parent as Record<string, unknown>)['@this'];
            }
            return thisProp ?? parent;
        }

        const child = (parent as Record<string, unknown>)[
            pathElement.replace(/[\\'"]/g, '')
        ] as Record<string, unknown>;

        // Filter on the child
        if (
            !defined(child) ||
            typeof child === 'function' ||
            typeof child.nodeType === 'number' ||
            child as unknown === win
        ) {
            return; // Undefined
        }

        // Else, proceed
        parent = child;
    }
    return parent;
}

function getStyle(
    el: HTMLDOMElement,
    prop: string,
    toInt: true
): (number|undefined);
function getStyle(
    el: HTMLDOMElement,
    prop: string,
    toInt?: false
): (number|string|undefined);
/**
 * Get the computed CSS value for given element and property, only for numerical
 * properties. For width and height, the dimension of the inner box (excluding
 * padding) is returned. Used for fitting the chart within the container.
 *
 * @function Highcharts.getStyle
 *
 * @param {Highcharts.HTMLDOMElement} el
 * An HTML element.
 *
 * @param {string} prop
 * The property name.
 *
 * @param {boolean} [toInt=true]
 * Parse to integer.
 *
 * @return {number|string|undefined}
 * The style value.
 */
function getStyle(
    el: HTMLDOMElement,
    prop: string,
    toInt?: boolean
): (number|string|undefined) {
    let style: (number|string|undefined);

    // For width and height, return the actual inner pixel size (#4913)
    if (prop === 'width') {

        let offsetWidth = Math.min(el.offsetWidth, el.scrollWidth);

        // In flex boxes, we need to use getBoundingClientRect and floor it,
        // because scrollWidth doesn't support subpixel precision (#6427) ...
        const boundingClientRectWidth = el.getBoundingClientRect?.().width;
        // ...unless if the containing div or its parents are transform-scaled
        // down, in which case the boundingClientRect can't be used as it is
        // also scaled down (#9871, #10498).
        if (
            boundingClientRectWidth < offsetWidth &&
            boundingClientRectWidth >= offsetWidth - 1
        ) {
            offsetWidth = Math.floor(boundingClientRectWidth);
        }

        return Math.max(
            0, // #8377
            (
                offsetWidth -
                (getStyle(el, 'padding-left', true) || 0) -
                (getStyle(el, 'padding-right', true) || 0)
            )
        );
    }

    if (prop === 'height') {
        return Math.max(
            0, // #8377
            (
                Math.min(el.offsetHeight, el.scrollHeight) -
                (getStyle(el, 'padding-top', true) || 0) -
                (getStyle(el, 'padding-bottom', true) || 0)
            )
        );
    }

    // Otherwise, get the computed style
    const css = win.getComputedStyle(el, void 0); // eslint-disable-line no-undefined
    if (css) {
        style = css.getPropertyValue(prop);
        if (pick(toInt, prop !== 'opacity')) {
            style = pInt(style);
        }
    }

    return style;
}


/**
 * Return the value of the first element in the array that satisfies the
 * provided testing function.
 *
 * @function Highcharts.find<T>
 *
 * @param {Array<T>} arr
 *        The array to test.
 *
 * @param {Function} callback
 *        The callback function. The function receives the item as the first
 *        argument. Return `true` if this item satisfies the condition.
 *
 * @return {T|undefined}
 *         The value of the element.
 */
const find = (Array.prototype as any).find ?
    function<T> (
        arr: Array<T>,
        callback: Utilities.FindCallback<T>
    ): (T|undefined) {
        return (arr as any).find(callback as any);
    } :
    // Legacy implementation. PhantomJS, IE <= 11 etc. #7223.
    function<T> (
        arr: Array<T>,
        callback: Utilities.FindCallback<T>
    ): (T|undefined) {
        let i;
        const length = arr.length;

        for (i = 0; i < length; i++) {
            if (callback(arr[i], i)) { // eslint-disable-line node/callback-return
                return arr[i];
            }
        }
    };


/**
 * Get the element's offset position, corrected for `overflow: auto`.
 *
 * @function Highcharts.offset
 *
 * @param {global.Element} el
 *        The DOM element.
 *
 * @return {Highcharts.OffsetObject}
 *         An object containing `left` and `top` properties for the position in
 *         the page.
 */
function offset(el: Element): Utilities.OffsetObject {
    const docElem = doc.documentElement,
        box = (el.parentElement || el.parentNode) ?
            el.getBoundingClientRect() :
            { top: 0, left: 0, width: 0, height: 0 };

    return {
        top: box.top + (win.pageYOffset || docElem.scrollTop) -
            (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) -
            (docElem.clientLeft || 0),
        width: box.width,
        height: box.height
    };
}

/* eslint-disable valid-jsdoc */
/**
 * Add an event listener.
 *
 * @function Highcharts.addEvent<T>
 *
 * @param  {Highcharts.Class<T>|T} el
 *         The element or object to add a listener to. It can be a
 *         {@link HTMLDOMElement}, an {@link SVGElement} or any other object.
 *
 * @param  {string} type
 *         The event type.
 *
 * @param  {Highcharts.EventCallbackFunction<T>|Function} fn
 *         The function callback to execute when the event is fired.
 *
 * @param  {Highcharts.EventOptionsObject} [options]
 *         Options for adding the event.
 *
 * @sample highcharts/members/addevent
 *         Use a general `render` event to draw shapes on a chart
 *
 * @return {Function}
 *         A callback function to remove the added event.
 */
function addEvent<T>(
    el: (Class<T>|T),
    type: string,
    fn: (EventCallback<T>|Function),
    options: Utilities.EventOptions = {}
): Function {
    /* eslint-enable valid-jsdoc */

    // Add hcEvents to either the prototype (in case we're running addEvent on a
    // class) or the instance. If hasOwnProperty('hcEvents') is false, it is
    // inherited down the prototype chain, in which case we need to set the
    // property on this instance (which may itself be a prototype).
    const owner = typeof el === 'function' && el.prototype || el;
    if (!Object.hasOwnProperty.call(owner, 'hcEvents')) {
        owner.hcEvents = {};
    }
    const events: Record<string, Array<any>> = owner.hcEvents;


    // Allow click events added to points, otherwise they will be prevented by
    // the TouchPointer.pinch function after a pinch zoom operation (#7091).
    if (
        (H as any).Point && // Without H a dependency loop occurs
        el instanceof (H as any).Point &&
        (el as any).series &&
        (el as any).series.chart
    ) {
        (el as any).series.chart.runTrackerClick = true;
    }

    // Handle DOM events
    // If the browser supports passive events, add it to improve performance
    // on touch events (#11353).
    const addEventListener = (el as any).addEventListener;
    if (addEventListener) {
        addEventListener.call(
            el,
            type,
            fn,
            H.supportsPassiveEvents ? {
                passive: options.passive === void 0 ?
                    type.indexOf('touch') !== -1 : options.passive,
                capture: false
            } : false
        );
    }

    if (!events[type]) {
        events[type] = [];
    }

    const eventObject = {
        fn,
        order: typeof options.order === 'number' ? options.order : Infinity
    };
    events[type].push(eventObject);

    // Order the calls
    events[type].sort((
        a: Utilities.EventWrapperObject<T>,
        b: Utilities.EventWrapperObject<T>
    ): number => a.order - b.order);

    // Return a function that can be called to remove this event.
    return function (): void {
        removeEvent(el, type, fn);
    };
}

/* eslint-disable valid-jsdoc */
/**
 * Remove an event that was added with {@link Highcharts#addEvent}.
 *
 * @function Highcharts.removeEvent<T>
 *
 * @param {Highcharts.Class<T>|T} el
 *        The element to remove events on.
 *
 * @param {string} [type]
 *        The type of events to remove. If undefined, all events are removed
 *        from the element.
 *
 * @param {Highcharts.EventCallbackFunction<T>} [fn]
 *        The specific callback to remove. If undefined, all events that match
 *        the element and optionally the type are removed.
 *
 * @return {void}
 */
function removeEvent<T>(
    el: (Class<T>|T),
    type?: string,
    fn?: (EventCallback<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */

    /** @internal */
    function removeOneEvent(
        type: string,
        fn: (EventCallback<T>|Function)
    ): void {
        const removeEventListener = (el as any).removeEventListener;

        if (removeEventListener) {
            removeEventListener.call(el, type, fn, false);
        }
    }

    /** @internal */
    function removeAllEvents(eventCollection: any): void {
        let types: Record<string, boolean>,
            len;

        if (!(el as any).nodeName) {
            return; // Break on non-DOM events
        }

        if (type) {
            types = {};
            types[type] = true;
        } else {
            types = eventCollection;
        }

        objectEach(types, function (_val, n): void {
            if (eventCollection[n]) {
                len = eventCollection[n].length;
                while (len--) {
                    removeOneEvent(n as any, eventCollection[n][len].fn);
                }
            }
        });
    }

    const owner = typeof el === 'function' && el.prototype || el;
    if (Object.hasOwnProperty.call(owner, 'hcEvents')) {
        const events = owner.hcEvents;
        if (type) {
            const typeEvents = (
                events[type] || []
            ) as Utilities.EventWrapperObject<T>[];

            if (fn) {
                events[type] = typeEvents.filter(
                    function (obj): boolean {
                        return fn !== obj.fn;
                    }
                );
                removeOneEvent(type, fn);

            } else {
                removeAllEvents(events);
                events[type] = [];
            }
        } else {
            removeAllEvents(events);
            delete owner.hcEvents;
        }
    }
}

/* eslint-disable valid-jsdoc */
/**
 * Fire an event that was registered with {@link Highcharts#addEvent}.
 *
 * @function Highcharts.fireEvent<T>
 *
 * @param {T} el
 *        The object to fire the event on. It can be a {@link HTMLDOMElement},
 *        an {@link SVGElement} or any other object.
 *
 * @param {string} type
 *        The type of event.
 *
 * @param {Highcharts.Dictionary<*>|Event} [eventArguments]
 *        Custom event arguments that are passed on as an argument to the event
 *        handler.
 *
 * @param {Highcharts.EventCallbackFunction<T>|Function} [defaultFunction]
 *        The default function to execute if the other listeners haven't
 *        returned false.
 *
 * @return {void}
 */
function fireEvent<T>(
    el: T,
    type: string,
    eventArguments?: (AnyRecord|Event),
    defaultFunction?: (EventCallback<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */
    eventArguments = eventArguments || {};

    if (
        doc?.createEvent &&
        (
            (el as any).dispatchEvent ||
            (
                (el as any).fireEvent &&
                // Enable firing events on Highcharts instance.
                (el as any) !== H
            )
        )
    ) {
        const e = doc.createEvent('Events');
        e.initEvent(type, true, true);

        eventArguments = extend(e, eventArguments);

        if ((el as any).dispatchEvent) {
            (el as any).dispatchEvent(eventArguments);
        } else {
            (el as any).fireEvent(type, eventArguments);
        }

    } else if ((el as any).hcEvents) {

        if (!(eventArguments as any).target) {
            // We're running a custom event

            extend(eventArguments as any, {
                // Attach a simple preventDefault function to skip
                // default handler if called. The built-in
                // defaultPrevented property is not overwritable (#5112)
                preventDefault: function (): void {
                    (eventArguments as any).defaultPrevented = true;
                },
                // Setting target to native events fails with clicking
                // the zoom-out button in Chrome.
                target: el,
                // If the type is not set, we're running a custom event
                // (#2297). If it is set, we're running a browser event.
                type: type
            });
        }

        const events: Array<Utilities.EventWrapperObject<any>> = [];
        let object: any = el;
        let multilevel = false;

        // Recurse up the inheritance chain and collect hcEvents set as own
        // objects on the prototypes.
        while (object.hcEvents) {
            if (
                Object.hasOwnProperty.call(object, 'hcEvents') &&
                object.hcEvents[type]
            ) {
                if (events.length) {
                    multilevel = true;
                }
                events.unshift.apply(events, object.hcEvents[type]);
            }
            object = Object.getPrototypeOf(object);
        }

        // For performance reasons, only sort the event handlers in case we are
        // dealing with multiple levels in the prototype chain. Otherwise, the
        // events are already sorted in the addEvent function.
        if (multilevel) {
            // Order the calls
            events.sort((
                a: Utilities.EventWrapperObject<T>,
                b: Utilities.EventWrapperObject<T>
            ): number => a.order - b.order);
        }

        // Call the collected event handlers
        events.forEach((obj): void => {
            // If the event handler returns false, prevent the default handler
            // from executing
            if (obj.fn.call(el, eventArguments as any) === false) {
                (eventArguments as any).preventDefault();
            }
        });

    }

    // Run the default if not prevented
    if (defaultFunction && !eventArguments.defaultPrevented) {
        (defaultFunction as Function).call(el, eventArguments);
    }
}

let serialMode: (boolean|undefined);
/**
 * Get a unique key for using in internal element id's and pointers. The key is
 * composed of a random hash specific to this Highcharts instance, and a
 * counter.
 *
 * @example
 * let id = uniqueKey(); // => 'highcharts-x45f6hp-0'
 *
 * @function Highcharts.uniqueKey
 *
 * @return {string}
 * A unique key.
 */
const uniqueKey = (function (): () => string {

    const hash = Math.random().toString(36).substring(2, 9) + '-';

    let id = 0;

    return function (): string {
        return 'highcharts-' + (serialMode ? '' : hash) + id++;
    };

}());
/**
 * Activates a serial mode for element IDs provided by
 * {@link Highcharts.uniqueKey}. This mode can be used in automated tests, where
 * a simple comparison of two rendered SVG graphics is needed.
 *
 * **Note:** This is only for testing purposes and will break functionality in
 * webpages with multiple charts.
 *
 * @example
 * if (
 *   process &&
 *   process.env.NODE_ENV === 'development'
 * ) {
 *   Highcharts.useSerialIds(true);
 * }
 *
 * @function Highcharts.useSerialIds
 *
 * @param {boolean} [mode]
 * Changes the state of serial mode.
 *
 * @return {boolean|undefined}
 * State of the serial mode.
 */
function useSerialIds(mode?: boolean): (boolean|undefined) {
    return (serialMode = pick(mode, serialMode));
}

function isFunction(obj: unknown): obj is Function { // eslint-disable-line
    return typeof obj === 'function';
}

function ucfirst(s: unknown): string {
    return (
        (isString(s) ?
            s.substring(0, 1).toUpperCase() + s.substring(1) :
            String(s))
    );
}

/* *
 *
 *  External
 *
 * */

// Register Highcharts as a plugin in jQuery
if ((win as any).jQuery) {

    /**
     * Highcharts-extended JQuery.
     *
     * @external JQuery
     */

    /**
     * Helper function to return the chart of the current JQuery selector
     * element.
     *
     * @function external:JQuery#highcharts
     *
     * @return {Highcharts.Chart}
     *         The chart that is linked to the JQuery selector element.
     *//**
     * Factory function to create a chart in the current JQuery selector
     * element.
     *
     * @function external:JQuery#highcharts
     *
     * @param {'Chart'|'Map'|'StockChart'|string} [className]
     *        Name of the factory class in the Highcharts namespace.
     *
     * @param {Highcharts.Options} [options]
     *        The chart options structure.
     *
     * @param {Highcharts.ChartCallbackFunction} [callback]
     *        Function to run when the chart has loaded and all external
     *        images are loaded. Defining a
     *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
     *        handler is equivalent.
     *
     * @return {JQuery}
     *         The current JQuery selector.
     */
    (win as any).jQuery.fn.highcharts = function (): any {
        const args = [].slice.call(arguments) as any;

        if (this[0]) { // `this[0]` is the renderTo div

            // Create the chart
            if (args[0]) {
                new (H as any)[ // eslint-disable-line computed-property-spacing, no-new
                    // Constructor defaults to Chart
                    isString(args[0]) ? args.shift() : 'Chart'
                ](this[0], args[0], args[1]);
                return this;
            }

            // When called without parameters or with the return argument,
            // return an existing chart
            return charts[(attr(this[0], 'data-highcharts-chart') as any)];
        }
    };
}


/* *
 *
 *  Namespace
 *
 * */

namespace Utilities {
    export type RelativeSize = (number|string);
    export interface ErrorMessageEventObject {
        /**
         * The chart that causes the error.
         */
        chart?: Chart;
        /**
         * The error code.
         */
        code: number;
        /**
         * The error message.
         */
        message?: string;
        /**
         * Additional parameters for the generated message.
         */
        params?: Record<string, string>;
    }
    export interface EventOptions {
        /**
         * The order the event handler should be called. This opens for having
         * one handler be called before another, independent of in which order
         * they were added.
         */
        order?: number;
        /**
         * Whether an event should be passive or not. When set to `true`, the
         * function specified by listener will never call `preventDefault()`.
         */
        passive?: boolean;
    }
    export interface EventWrapperObject<T> {
        /**
         * The function callback to execute when the event is fired.
         */
        fn: EventCallback<T>;
        /**
         * The order the event handler should be called.
         */
        order: number;
    }
    export interface FindCallback<T> {
        (
            value: T,
            index: number
        ): unknown;
    }

    export interface OffsetObject {
        /**
         * Height of the element.
         */
        height: number;
        /**
         * Left distance to the page border.
         */
        left: number;
        /**
         * Top distance to the page border.
         */
        top: number;
        /**
         * Width of the element.
         */
        width: number;
    }
    export interface WrapProceedFunction<T extends ArrowFunction> {
        (proceed: (T&ArrowFunction), ...args: Array<any>): ReturnType<T>;
    }
}


/* *
 *
 *  Default Export
 *
 * */

interface Utilities {
    addEvent: typeof addEvent;
    arrayMax: typeof arrayMax;
    arrayMin: typeof arrayMin;
    attr: typeof attr;
    /** @internal */
    clearTimeout: typeof internalClearTimeout;
    correctFloat: typeof correctFloat;
    createElement: typeof createElement;
    /** @internal */
    css: typeof css;
    defined: typeof defined;
    destroyObjectProperties: typeof destroyObjectProperties;
    /** @internal */
    discardElement: typeof discardElement;
    error: typeof error;
    extendClass: typeof extendClass;
    find: typeof find;
    fireEvent: typeof fireEvent;
    /** @internal */
    getAlignFactor: typeof getAlignFactor;
    /** @internal */
    getClosestDistance: typeof getClosestDistance;
    getMagnitude: typeof getMagnitude;
    /** @internal */
    getNestedProperty: typeof getNestedProperty;
    getStyle: typeof getStyle;
    /** @internal */
    insertItem: typeof insertItem;
    isFunction: typeof isFunction;
    normalizeTickInterval: typeof normalizeTickInterval;
    offset: typeof offset;
    pad: typeof pad;
    pick: typeof pick;
    /** @internal */
    relativeLength: typeof relativeLength;
    removeEvent: typeof removeEvent;
    replaceNested: typeof replaceNested;
    stableSort: typeof stableSort;
    syncTimeout: typeof syncTimeout;
    /** @internal */
    timeUnits: typeof timeUnits;
    /** @internal */
    ucfirst: typeof ucfirst;
    uniqueKey: typeof uniqueKey;
    useSerialIds: typeof useSerialIds;
    wrap: typeof wrap;
}

// TODO use named exports when supported.
const Utilities: Utilities = {
    addEvent,
    arrayMax,
    arrayMin,
    attr,
    clearTimeout: internalClearTimeout,
    correctFloat,
    createElement,
    css,
    defined,
    destroyObjectProperties,
    discardElement,
    error,
    extendClass,
    find,
    fireEvent,
    getAlignFactor,
    getClosestDistance,
    getMagnitude,
    getNestedProperty,
    getStyle,
    insertItem,
    isFunction,
    normalizeTickInterval,
    offset,
    pad,
    pick,
    relativeLength,
    removeEvent,
    replaceNested,
    stableSort,
    syncTimeout,
    timeUnits,
    ucfirst,
    uniqueKey,
    useSerialIds,
    wrap
} as Utilities;

export default Utilities;


/* *
 *
 *  API Declarations
 *
 * */

/**
 * Creates a frame for the animated SVG element.
 *
 * @callback Highcharts.AnimationStepCallbackFunction
 *
 * @param {Highcharts.SVGElement} this
 *        The SVG element to animate.
 *
 * @return {void}
 */

/**
 * Interface description for a class.
 *
 * @interface Highcharts.Class<T>
 * @extends Function
 *//**
 * Class constructor.
 * @function Highcharts.Class<T>#new
 * @param {...Array<*>} args
 *        Constructor arguments.
 * @return {T}
 *         Class instance.
 */

/**
 * A style object with camel case property names to define visual appearance of
 * a SVG element or HTML element. The properties can be whatever styles are
 * supported on the given SVG or HTML element.
 *
 * @example
 * {
 *    fontFamily: 'monospace',
 *    fontSize: '1.2em'
 * }
 *
 * @interface Highcharts.CSSObject
 *//**
 * @name Highcharts.CSSObject#[key:string]
 * @type {boolean|number|string|undefined}
 *//**
 * Background style for the element.
 * @name Highcharts.CSSObject#background
 * @type {string|undefined}
 *//**
 * Background color of the element.
 * @name Highcharts.CSSObject#backgroundColor
 * @type {Highcharts.ColorString|undefined}
 *//**
 * Border style for the element.
 * @name Highcharts.CSSObject#border
 * @type {string|undefined}
 *//**
 * Radius of the element border.
 * @name Highcharts.CSSObject#borderRadius
 * @type {number|undefined}
 *//**
 * Color used in the element. The 'contrast' option is a Highcharts custom
 * property that results in black or white, depending on the background of the
 * element.
 * @name Highcharts.CSSObject#color
 * @type {'contrast'|Highcharts.ColorString|undefined}
 *//**
 * Style of the mouse cursor when resting over the element.
 * @name Highcharts.CSSObject#cursor
 * @type {Highcharts.CursorValue|undefined}
 *//**
 * Font family of the element text. Multiple values have to be in decreasing
 * preference order and separated by comma.
 * @name Highcharts.CSSObject#fontFamily
 * @type {string|undefined}
 *//**
 * Font size of the element text.
 * @name Highcharts.CSSObject#fontSize
 * @type {string|undefined}
 *//**
 * Font weight of the element text.
 * @name Highcharts.CSSObject#fontWeight
 * @type {string|undefined}
 *//**
 * Height of the element.
 * @name Highcharts.CSSObject#height
 * @type {number|undefined}
 *//**
 * The maximum number of lines. If lines are cropped away, an ellipsis will be
 * added.
 * @name Highcharts.CSSObject#lineClamp
 * @type {number|undefined}
 *//**
 * Width of the element border.
 * @name Highcharts.CSSObject#lineWidth
 * @type {number|undefined}
 *//**
 * Opacity of the element.
 * @name Highcharts.CSSObject#opacity
 * @type {number|undefined}
 *//**
 * Space around the element content.
 * @name Highcharts.CSSObject#padding
 * @type {string|undefined}
 *//**
 * Behaviour of the element when the mouse cursor rests over it.
 * @name Highcharts.CSSObject#pointerEvents
 * @type {string|undefined}
 *//**
 * Positioning of the element.
 * @name Highcharts.CSSObject#position
 * @type {string|undefined}
 *//**
 * Alignment of the element text.
 * @name Highcharts.CSSObject#textAlign
 * @type {string|undefined}
 *//**
 * Additional decoration of the element text.
 * @name Highcharts.CSSObject#textDecoration
 * @type {string|undefined}
 *//**
 * Outline style of the element text.
 * @name Highcharts.CSSObject#textOutline
 * @type {string|undefined}
 *//**
 * Line break style of the element text. Highcharts SVG elements support
 * `ellipsis` when a `width` is set.
 * @name Highcharts.CSSObject#textOverflow
 * @type {string|undefined}
 *//**
 * Top spacing of the element relative to the parent element.
 * @name Highcharts.CSSObject#top
 * @type {string|undefined}
 *//**
 * Animated transition of selected element properties.
 * @name Highcharts.CSSObject#transition
 * @type {string|undefined}
 *//**
 * Line break style of the element text.
 * @name Highcharts.CSSObject#whiteSpace
 * @type {string|undefined}
 *//**
 * Width of the element.
 * @name Highcharts.CSSObject#width
 * @type {number|undefined}
 */

/**
 * All possible cursor styles.
 *
 * @typedef {'alias'|'all-scroll'|'auto'|'cell'|'col-resize'|'context-menu'|'copy'|'crosshair'|'default'|'e-resize'|'ew-resize'|'grab'|'grabbing'|'help'|'move'|'n-resize'|'ne-resize'|'nesw-resize'|'no-drop'|'none'|'not-allowed'|'ns-resize'|'nw-resize'|'nwse-resize'|'pointer'|'progress'|'row-resize'|'s-resize'|'se-resize'|'sw-resize'|'text'|'vertical-text'|'w-resize'|'wait'|'zoom-in'|'zoom-out'} Highcharts.CursorValue
 */

/**
 * All possible dash styles.
 *
 * @typedef {'Dash'|'DashDot'|'Dot'|'LongDash'|'LongDashDot'|'LongDashDotDot'|'ShortDash'|'ShortDashDot'|'ShortDashDotDot'|'ShortDot'|'Solid'} Highcharts.DashStyleValue
 */

/**
 * Generic dictionary in TypeScript notation.
 * Use the native `AnyRecord` instead.
 *
 * @deprecated
 * @interface Highcharts.Dictionary<T>
 *//**
 * @name Highcharts.Dictionary<T>#[key:string]
 * @type {T}
 */

/**
 * @typedef {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} Highcharts.DOMElementType
 */

/**
 * The function callback to execute when the event is fired. The `this` context
 * contains the instance, that fired the event.
 *
 * @callback Highcharts.EventCallbackFunction<T>
 *
 * @param {T} this
 *
 * @param {Highcharts.Dictionary<*>|Event} [eventArguments]
 *        Event arguments.
 *
 * @return {boolean|void}
 */

/**
 * The event options for adding function callback.
 *
 * @interface Highcharts.EventOptionsObject
 *//**
 * The order the event handler should be called. This opens for having one
 * handler be called before another, independent of in which order they were
 * added.
 * @name Highcharts.EventOptionsObject#order
 * @type {number}
 *//**
 * Whether an event should be passive or not.
 * When set to `true`, the function specified by listener will never call
 * `preventDefault()`.
 * @name Highcharts.EventOptionsObject#passive
 * @type boolean
 */

/**
 * Formats data as a string. Usually the data is accessible through the `this`
 * keyword.
 *
 * @callback Highcharts.FormatterCallbackFunction<T>
 *
 * @param {T} this
 *        Context to format
 *
 * @return {string}
 *         Formatted text
 */

/**
 * An object of key-value pairs for HTML attributes.
 *
 * @typedef {Highcharts.Dictionary<boolean|number|string|Function>} Highcharts.HTMLAttributes
 */

/**
 * An HTML DOM element. The type is a reference to the regular HTMLElement in
 * the global scope.
 *
 * @typedef {global.HTMLElement} Highcharts.HTMLDOMElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
 */

/**
 * The iterator callback.
 *
 * @callback Highcharts.ObjectEachCallbackFunction<T>
 *
 * @param {T} this
 *        The context.
 *
 * @param {*} value
 *        The property value.
 *
 * @param {string} key
 *        The property key.
 *
 * @param {*} obj
 *        The object that objectEach is being applied to.
 */

/**
 * An object containing `left` and `top` properties for the position in the
 * page.
 *
 * @interface Highcharts.OffsetObject
 *//**
 * Left distance to the page border.
 * @name Highcharts.OffsetObject#left
 * @type {number}
 *//**
 * Top distance to the page border.
 * @name Highcharts.OffsetObject#top
 * @type {number}
 */

/**
 * Describes a range.
 *
 * @interface Highcharts.RangeObject
 *//**
 * Maximum number of the range.
 * @name Highcharts.RangeObject#max
 * @type {number}
 *//**
 * Minimum number of the range.
 * @name Highcharts.RangeObject#min
 * @type {number}
 */

/**
 * If a number is given, it defines the pixel length. If a percentage string is
 * given, like for example `'50%'`, the setting defines a length relative to a
 * base size, for example the size of a container.
 *
 * @typedef {number|string} Highcharts.RelativeSize
 */

/**
 * Proceed function to call original (wrapped) function.
 *
 * @callback Highcharts.WrapProceedFunction
 *
 * @param {*} [arg1]
 *        Optional argument. Without any arguments defaults to first argument of
 *        the wrapping function.
 *
 * @param {*} [arg2]
 *        Optional argument. Without any arguments defaults to second argument
 *        of the wrapping function.
 *
 * @param {*} [arg3]
 *        Optional argument. Without any arguments defaults to third argument of
 *        the wrapping function.
 *
 * @return {*}
 *         Return value of the original function.
 */

/**
 * The Highcharts object is the placeholder for all other members, and various
 * utility functions. The most important member of the namespace would be the
 * chart constructor.
 *
 * @example
 * let chart = Highcharts.chart('container', { ... });
 *
 * @namespace Highcharts
 */

''; // Detach doclets above
