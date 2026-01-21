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
import type { EventCallback } from './Callback';
import type Series from './Series/Series';
import type Time from './Time';

import { attr, extend, getMagnitude, isNumber, isString, objectEach, pick } from '../Shared/Utilities.js';
import H from './Globals.js';
const {
    charts,
    doc,
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
}


/* *
 *
 *  Default Export
 *
 * */

interface Utilities {
    addEvent: typeof addEvent;
    error: typeof error;
    fireEvent: typeof fireEvent;
    /** @internal */
    insertItem: typeof insertItem;
    removeEvent: typeof removeEvent;
    /** @internal */
    timeUnits: typeof timeUnits;
    uniqueKey: typeof uniqueKey;
    useSerialIds: typeof useSerialIds;
}

// TODO use named exports when supported.
const Utilities: Utilities = {
    addEvent,
    error,
    fireEvent,
    getMagnitude,
    insertItem,
    removeEvent,
    timeUnits,
    uniqueKey,
    useSerialIds
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
