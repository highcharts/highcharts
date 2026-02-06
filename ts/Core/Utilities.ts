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
import type Series from './Series/Series';
import type Time from './Time';
import type Chart from './Chart/Chart';

import { attr, fireEvent, isNumber, isString, objectEach, pick } from '../Shared/Utilities.js';
import H from './Globals.js';
const {
    charts,
    win
} = H;

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
export function error(
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
export namespace error {
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
export function insertItem(
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
 * The time unit lookup
 *
 * @ignore
 */

export const timeUnits: Record<Time.TimeUnit, number> = {
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
export const uniqueKey = (function (): () => string {

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
export function useSerialIds(mode?: boolean): (boolean|undefined) {
    return (serialMode = pick(mode, serialMode));
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
