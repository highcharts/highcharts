/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from './Chart/Chart';
import type SVGPath from './Renderer/SVG/SVGPath';
import H from './Globals.js';
type NonArray<T> = T extends Array<unknown> ? never : T;
type NonFunction<T> = T extends Function ? never : T;
type NullType = (null|undefined);

/**
 * Internal types
 * @private
 */
declare global {
    type DeepPartial<T> = {
        [P in keyof T]?: (T[P]|DeepPartial<T[P]>);
    }
    interface Math {
        easeInOutSine(pos: number): number;
    }
    namespace Highcharts {
        type CursorValue = (
            'alias'|'all-scroll'|'auto'|'cell'|'col-resize'|'context-menu'|
            'copy'|'crosshair'|'default'|'e-resize'|'ew-resize'|'grab'|
            'grabbing'|'help'|'move'|'n-resize'|'ne-resize'|'nesw-resize'|
            'no-drop'|'none'|'not-allowed'|'ns-resize'|'nw-resize'|
            'nwse-resize'|'pointer'|'progress'|'row-resize'|'s-resize'|
            'se-resize'|'sw-resize'|'text'|'vertical-text'|'w-resize'|'wait'|
            'zoom-in'|'zoom-out'
        );
        type DashStyleValue = (
            'Dash'|'DashDot'|'Dot'|'LongDash'|'LongDashDot'|'LongDashDotDot'|
            'ShortDash'|'ShortDashDot'|'ShortDashDotDot'|'ShortDot'|'Solid'
        );
        type ExtractArrayType<T> = T extends (infer U)[] ? U : never;
        type HTMLAttributes = (
            Dictionary<(boolean|number|string|Function|undefined)>
        );
        type RelativeSize = (number|string);
        interface AnimationOptionsObject {
            complete?: Function;
            curAnim?: Dictionary<boolean>;
            defer: number;
            duration: number;
            easing?: (string|Function);
            step?: AnimationStepCallbackFunction;
        }
        interface AnimationStepCallbackFunction {
            (this: SVGElement, ...args: Array<any>): void;
        }
        interface Class<T = any> extends Function {
            new(...args: Array<any>): T;
        }
        interface CSSObject {
            [key: string]: (boolean|number|string|undefined);
            backgroundColor?: ColorString;
            borderRadius?: (number|string);
            color?: ('contrast'|ColorString);
            cursor?: CursorValue;
            fontSize?: (number|string);
            lineWidth?: (number|string);
            pointerEvents?: string;
            stroke?: ColorString;
            strokeWidth?: (number|string);
            width?: string;
        }
        /**
         * @deprecated
         * Use `Record<string, T>` instead.
         */
        interface Dictionary<T> extends Record<string, T> {
            [key: string]: T;
        }
        interface ErrorMessageEventObject {
            code: number;
            message: string;
            params: Dictionary<string>;
        }
        interface EventCallbackFunction<T> {
            (this: T, eventArguments: (Dictionary<any>|Event)): (boolean|void);
        }
        interface EventOptionsObject {
            order?: number;
        }
        interface EventWrapperObject<T> {
            fn: Highcharts.EventCallbackFunction<T>;
            order: number;
        }
        interface FormatterCallbackFunction<T> {
            (this: T): string;
        }
        interface ObjectEachCallbackFunction<TObject, TContext> {
            (
                this: TContext,
                value: TObject[keyof TObject],
                key: keyof TObject,
                obj: TObject
            ): void;
        }
        interface OffsetObject {
            left: number;
            top: number;
        }
        interface Timer {
            (gotoEnd?: boolean): boolean;
            elem?: (HTMLDOMElement|SVGElement);
            prop?: string;
            stopped?: boolean;
        }
        interface RangeObject {
            max: number;
            min: number;
        }
        interface WrapProceedFunction {
            (...args: Array<any>): any;
        }
        class Fx {
            public constructor(
                elem: (HTMLDOMElement|SVGElement),
                options: Partial<AnimationOptionsObject>,
                prop: string
            );
            public elem: (HTMLElement|SVGElement);
            public end?: any;
            public options: Partial<AnimationOptionsObject>;
            public paths?: [SVGPath, SVGPath];
            public pos?: any;
            public prop: string;
            public start?: any;
            public dSetter(): void;
            public fillSetter(): void;
            public initPath(
                elem: SVGElement,
                fromD: SVGPath,
                toD: SVGPath
            ): [SVGPath, SVGPath];
            public run(from: number, to: number, unit: string): void;
            public step(gotoEnd?: boolean): boolean;
            public strokeSetter(): void;
            public update(): void;
        }
        let timers: Array<any>;
        function addEvent<T>(
            el: (Class<T>|T),
            type: string,
            fn: (EventCallbackFunction<T>|Function),
            options?: EventOptionsObject
        ): Function;
        function animate(
            el: (HTMLDOMElement|SVGElement),
            params: (CSSObject|SVGAttributes),
            opt?: Partial<AnimationOptionsObject>
        ): void;
        function animObject(
            animation?: (boolean|AnimationOptionsObject)
        ): AnimationOptionsObject;
        function arrayMax(data: Array<any>): number;
        function arrayMin(data: Array<any>): number;
        function attr(
            elem: (HTMLDOMElement|SVGDOMElement),
            prop: (HTMLAttributes|SVGAttributes)
        ): undefined;
        function attr(
            elem: (HTMLDOMElement|SVGDOMElement),
            prop: string,
            value?: undefined
        ): (string|null);
        function attr(
            elem: (HTMLDOMElement|SVGDOMElement),
            prop: string,
            value: (number|string)
        ): undefined;
        function clearTimeout(id: number): void;
        function correctFloat(num: number, prec?: number): number;
        function createElement(
            tag: string,
            attribs?: HTMLAttributes,
            styles?: CSSObject,
            parent?: HTMLDOMElement,
            nopad?: boolean
        ): HTMLDOMElement;
        function css(
            el: (HTMLDOMElement|SVGDOMElement),
            styles: CSSObject
        ): void;
        function datePropsToTimestamps(obj: any): void;
        function defined<T>(obj: T): obj is NonNullable<T>;
        function destroyObjectProperties(obj: any, except?: any): void;
        function discardElement(element: HTMLDOMElement): void;
        function erase(arr: Array<unknown>, item: unknown): void;
        function error(
            code: (number|string),
            stop?: boolean,
            chart?: Chart,
            param?: Dictionary<string>
        ): void;
        function extend<T extends object>(a: (T|undefined), b: object): T;
        function extendClass<T, TReturn = T>(
            parent: Class<T>,
            members: unknown
        ): Class<TReturn>;
        function find<T>(arr: Array<T>, fn: Function): (T|undefined);
        function fireEvent<T>(
            el: T,
            type: string,
            eventArguments?: (Dictionary<any>|Event),
            defaultFunction?: (EventCallbackFunction<T>|Function)
        ): void;
        function format(str: string, ctx: any, chart?: Chart): string;
        function getDeferredAnimation(
            chart: Chart,
            animation: Partial<Highcharts.AnimationOptionsObject>,
            series?: Series
        ): Partial<Highcharts.AnimationOptionsObject>;
        function getMagnitude(num: number): number;
        function getStyle(
            el: HTMLDOMElement,
            prop: string,
            toInt?: boolean
        ): (number|string);
        function inArray(
            item: any,
            arr: Array<any>,
            fromIndex?: number
        ): number;
        /** USE IMPORT */
        function isArray(obj: unknown): obj is Array<unknown>;
        /** USE IMPORT */
        function isClass(obj: (object|undefined)): obj is Class;
        /** USE IMPORT */
        function isDOMElement(obj: unknown): obj is HTMLDOMElement;
        /** USE IMPORT */
        function isFunction(obj: unknown): obj is Function;
        /** USE IMPORT */
        function isNumber(n: unknown): n is number;
        /** USE IMPORT */
        function isObject<T>(obj: T, strict: true): obj is object & NonArray<NonFunction<NonNullable<T>>>;
        /** USE IMPORT */
        function isObject<T>(obj: T, strict?: false): obj is object & NonFunction<NonNullable<T>>;
        /** USE IMPORT */
        function isString(s: unknown): s is string;
        /** @deprecated */
        function keys(obj: any): Array<string>;
        function merge<T1, T2 = object>(
            extend: boolean,
            a?: T1,
            ...n: Array<T2|undefined>
        ): (T1&T2);
        function merge<
            T1 extends object = object,
            T2 = unknown,
            T3 = unknown,
            T4 = unknown,
            T5 = unknown,
            T6 = unknown,
            T7 = unknown,
            T8 = unknown,
            T9 = unknown
        >(
            a?: T1,
            b?: T2,
            c?: T3,
            d?: T4,
            e?: T5,
            f?: T6,
            g?: T7,
            h?: T8,
            i?: T9,
        ): (T1&T2&T3&T4&T5&T6&T7&T8&T9);
        function normalizeTickInterval(
            interval: number,
            multiples?: Array<any>,
            magnitude?: number,
            allowDecimals?: boolean,
            hasTickAmount?: boolean
        ): number;
        function numberFormat(
            number: number,
            decimals: number,
            decimalPoint?: string,
            thousandsSep?: string
        ): string;
        function objectEach<TObject, TContext>(
            obj: TObject,
            fn: ObjectEachCallbackFunction<TObject, TContext>,
            ctx?: TContext
        ): void;
        function offset(el: Element): OffsetObject;
        function pad(number: number, length?: number, padder?: string): string;
        function pick<T1, T2, T3, T4, T5>(...args: [T1, T2, T3, T4, T5]):
        T1 extends NullType ?
            T2 extends NullType ?
                T3 extends NullType ?
                    T4 extends NullType ?
                        T5 extends NullType ?
                            undefined : T5 : T4 : T3 : T2 : T1;
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
        T1 extends NullType ? T2 extends NullType ? undefined : T2 : T1;
        function pick<T1>(...args: [T1]): T1 extends NullType ? undefined : T1;
        function pick<T>(...args: Array<T|null|undefined>): T|undefined;
        function pInt(s: any, mag?: number): number;
        function relativeLength(
            value: RelativeSize,
            base: number,
            offset?: number
        ): number;
        function removeEvent<T>(
            el: (Class<T>|T),
            type?: string,
            fn?: (EventCallbackFunction<T>|Function)
        ): void
        function seriesType<TSeries extends Series>(
            type: string,
            parent: string,
            options: TSeries['options'],
            props?: Partial<TSeries>,
            pointProps?: Partial<TSeries['pointClass']['prototype']>
        ): typeof Series;
        function setAnimation(
            animation: (boolean|Partial<AnimationOptionsObject>|undefined),
            chart: Chart
        ): void
        function splat(obj: any): Array<any>;
        function stableSort(arr: Array<any>, sortFunction: Function): void;
        function stop(el: SVGElement, prop?: string): void;
        function syncTimeout(
            fn: Function,
            delay: number,
            context?: unknown
        ): number;
        function uniqueKey(): string;
        function useSerialIds(mode?: boolean): (boolean|undefined);
        function wrap(
            obj: any,
            method: string,
            func: WrapProceedFunction
        ): void;
        let garbageBin: (globalThis.HTMLElement|undefined);
        let timeUnits: Dictionary<number>;
    }
}

/**
 * An animation configuration. Animation configurations can also be defined as
 * booleans, where `false` turns off animation and `true` defaults to a duration
 * of 500ms and defer of 0ms.
 *
 * @interface Highcharts.AnimationOptionsObject
 *//**
 * A callback function to exectute when the animation finishes.
 * @name Highcharts.AnimationOptionsObject#complete
 * @type {Function|undefined}
 *//**
 * The animation defer in milliseconds.
 * @name Highcharts.AnimationOptionsObject#defer
 * @type {number|undefined}
 *//**
 * The animation duration in milliseconds.
 * @name Highcharts.AnimationOptionsObject#duration
 * @type {number|undefined}
 *//**
 * The name of an easing function as defined on the `Math` object.
 * @name Highcharts.AnimationOptionsObject#easing
 * @type {string|Function|undefined}
 *//**
 * A callback function to execute on each step of each attribute or CSS property
 * that's being animated. The first argument contains information about the
 * animation and progress.
 * @name Highcharts.AnimationOptionsObject#step
 * @type {Function|undefined}
 */

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
 * Class costructor.
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
 * Use the native `Record<string, any>` instead.
 *
 * @deprecated
 * @interface Highcharts.Dictionary<T>
 *//**
 * @name Highcharts.Dictionary<T>#[key:string]
 * @type {T}
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
 */

/**
 * Formats data as a string. Usually the data is accessible throught the `this`
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
 * var chart = Highcharts.chart('container', { ... });
 *
 * @namespace Highcharts
 */

H.timers = [];

var charts = H.charts,
    doc = H.doc,
    win = H.win;

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
 *        access to the Chart instance.
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

    var isCode = isNumber(code),
        message = isCode ?
            `${severity} #${code}: www.highcharts.com/errors/${code}/` :
            code.toString(),
        defaultHandler = function (): void {
            if (stop) {
                throw new Error(message);
            }
            // else ...
            if (
                win.console &&
                error.messages.indexOf(message) === -1 // prevent console flooting
            ) {
                console.log(message); // eslint-disable-line no-console
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

    if (chart) {
        fireEvent(
            chart,
            'displayError',
            { code, message, params } as Highcharts.ErrorMessageEventObject,
            defaultHandler
        );
    } else {
        defaultHandler();
    }

    error.messages.push(message);
}
namespace error {
    export const messages: Array<string> = [];
}
H.error = error;


/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * An animator object used internally. One instance applies to one property
 * (attribute or style prop) on one element. Animation is always initiated
 * through {@link SVGElement#animate}.
 *
 * @example
 * var rect = renderer.rect(0, 0, 10, 10).add();
 * rect.animate({ width: 100 });
 *
 * @private
 * @class
 * @name Highcharts.Fx
 */
class Fx {

    /* *
     *
     *  Constructors
     *
     * */

    /**
     *
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGElement} elem
     *        The element to animate.
     *
     * @param {Partial<Highcharts.AnimationOptionsObject>} options
     *        Animation options.
     *
     * @param {string} prop
     *        The single attribute or CSS property to animate.
     */
    public constructor(
        elem: (Highcharts.HTMLElement|Highcharts.SVGElement),
        options: Partial<Highcharts.AnimationOptionsObject>,
        prop: string
    ) {
        this.options = options;
        this.elem = elem;
        this.prop = prop;
    }

    /* *
     *
     *  Properties
     *
     * */

    public elem: (Highcharts.HTMLElement|Highcharts.SVGElement);
    public end?: number;
    public from?: number;
    public now?: number;
    public options: Partial<Highcharts.AnimationOptionsObject>;
    public paths?: [SVGPath, SVGPath];
    public pos?: number;
    public prop: string;
    public start?: number;
    public startTime?: number;
    public toD?: SVGPath;
    public unit?: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Set the current step of a path definition on SVGElement.
     *
     * @function Highcharts.Fx#dSetter
     *
     * @return {void}
     */
    public dSetter(): void {
        var paths = this.paths,
            start = paths && paths[0],
            end = paths && paths[1],
            path: SVGPath = [],
            now = this.now || 0;

        // Land on the final path without adjustment points appended in the ends
        if (now === 1 || !start || !end) {
            path = this.toD || [];

        } else if (start.length === end.length && now < 1) {
            for (let i = 0; i < end.length; i++) {

                // Tween between the start segment and the end segment. Start
                // with a copy of the end segment and tween the appropriate
                // numerics
                const startSeg = start[i];
                const endSeg = end[i];
                const tweenSeg = [];

                for (let j = 0; j < endSeg.length; j++) {
                    const startItem = startSeg[j];
                    const endItem = endSeg[j];

                    // Tween numbers
                    if (
                        typeof startItem === 'number' &&
                        typeof endItem === 'number' &&
                        // Arc boolean flags
                        !(endSeg[0] === 'A' && (j === 4 || j === 5))
                    ) {
                        tweenSeg[j] = startItem + now * (endItem - startItem);

                    // Strings, take directly from the end segment
                    } else {
                        tweenSeg[j] = endItem;
                    }
                }

                path.push(tweenSeg as SVGPath.Segment);

            }
        // If animation is finished or length not matching, land on right value
        } else {
            path = end;
        }

        this.elem.attr('d', path, void 0, true);
    }

    /**
     * Update the element with the current animation step.
     *
     * @function Highcharts.Fx#update
     *
     * @return {void}
     */
    public update(): void {
        var elem = this.elem,
            prop = this.prop, // if destroyed, it is null
            now: number = this.now as any,
            step = this.options.step;

        // Animation setter defined from outside
        if ((this as any)[prop + 'Setter']) {
            (this as any)[prop + 'Setter']();

        // Other animations on SVGElement
        } else if (elem.attr) {
            if (elem.element) {
                elem.attr(prop, now, null as any, true);
            }

        // HTML styles, raw HTML content like container size
        } else {
            elem.style[prop] = now + (this.unit as any);
        }

        if (step) {
            step.call(elem, now, this);
        }

    }

    /**
     * Run an animation.
     *
     * @function Highcharts.Fx#run
     *
     * @param {number} from
     *        The current value, value to start from.
     *
     * @param {number} to
     *        The end value, value to land on.
     *
     * @param {string} unit
     *        The property unit, for example `px`.
     *
     * @return {void}
     */
    public run(from: number, to: number, unit: string): void {
        var self = this,
            options = self.options,
            timer: Highcharts.Timer = function (gotoEnd?: boolean): boolean {
                return timer.stopped ? false : self.step(gotoEnd);
            },
            requestAnimationFrame =
                win.requestAnimationFrame ||
                function (step: Function): void {
                    setTimeout(step, 13);
                },
            step = function (): void {
                for (var i = 0; i < H.timers.length; i++) {
                    if (!H.timers[i]()) {
                        H.timers.splice(i--, 1);
                    }
                }

                if (H.timers.length) {
                    requestAnimationFrame(step);
                }
            };

        if (from === to && !this.elem['forceAnimate:' + this.prop]) {
            delete (options.curAnim as any)[this.prop];
            if (options.complete && Object.keys(options.curAnim as any).length === 0) {
                options.complete.call(this.elem);
            }
        } else { // #7166
            this.startTime = +new Date();
            this.start = from;
            this.end = to;
            this.unit = unit;
            this.now = this.start;
            this.pos = 0;

            timer.elem = this.elem;
            timer.prop = this.prop;

            if (timer() && H.timers.push(timer) === 1) {
                requestAnimationFrame(step);
            }
        }
    }

    /**
     * Run a single step in the animation.
     *
     * @function Highcharts.Fx#step
     *
     * @param {boolean} [gotoEnd]
     *        Whether to go to the endpoint of the animation after abort.
     *
     * @return {boolean}
     *         Returns `true` if animation continues.
     */
    public step(gotoEnd?: boolean): boolean {
        var t = +new Date(),
            ret,
            done,
            options = this.options,
            elem = this.elem,
            complete = options.complete,
            duration: number = options.duration as any,
            curAnim: Highcharts.Dictionary<boolean> = options.curAnim as any;

        if (elem.attr && !elem.element) { // #2616, element is destroyed
            ret = false;

        } else if (gotoEnd || t >= duration + (this.startTime as any)) {
            this.now = this.end;
            this.pos = 1;
            this.update();

            curAnim[this.prop] = true;

            done = true;

            objectEach(curAnim, function (val: boolean): void {
                if (val !== true) {
                    done = false;
                }
            });

            if (done && complete) {
                complete.call(elem);
            }
            ret = false;

        } else {
            this.pos = (options.easing as Function)(
                (t - (this.startTime as any)) / duration
            );
            this.now = (this.start as any) + (((this.end as any) - (this.start as any)) * (this.pos as any));
            this.update();
            ret = true;
        }
        return ret;
    }

    /**
     * Prepare start and end values so that the path can be animated one to one.
     *
     * @function Highcharts.Fx#initPath
     *
     * @param {Highcharts.SVGElement} elem
     *        The SVGElement item.
     *
     * @param {Highcharts.SVGPathArray|undefined} fromD
     *        Starting path definition.
     *
     * @param {Highcharts.SVGPathArray} toD
     *        Ending path definition.
     *
     * @return {Array<Highcharts.SVGPathArray,Highcharts.SVGPathArray>}
     *         An array containing start and end paths in array form so that
     *         they can be animated in parallel.
     */
    public initPath(
        elem: Highcharts.SVGElement,
        fromD: SVGPath|undefined,
        toD: SVGPath
    ): [SVGPath, SVGPath] {
        var shift,
            startX = elem.startX,
            endX = elem.endX,
            fullLength: number,
            i: number,
            start = fromD && fromD.slice(), // copy
            end = toD.slice(), // copy
            isArea = elem.isArea,
            positionFactor = isArea ? 2 : 1,
            reverse;

        if (!start) {
            return [end, end];
        }

        /**
         * If shifting points, prepend a dummy point to the end path.
         * @private
         * @param {Highcharts.SVGPathArray} arr - array
         * @param {Highcharts.SVGPathArray} other - array
         * @return {void}
         */
        function prepend(
            arr: SVGPath,
            other: SVGPath
        ): void {
            while (arr.length < fullLength) {

                // Move to, line to or curve to?
                const moveSegment = arr[0],
                    otherSegment = other[fullLength - arr.length];
                if (otherSegment && moveSegment[0] === 'M') {
                    if (otherSegment[0] === 'C') {
                        arr[0] = [
                            'C',
                            moveSegment[1],
                            moveSegment[2],
                            moveSegment[1],
                            moveSegment[2],
                            moveSegment[1],
                            moveSegment[2]
                        ];
                    } else {
                        arr[0] = ['L', moveSegment[1], moveSegment[2]];
                    }
                }

                // Prepend a copy of the first point
                arr.unshift(moveSegment);

                // For areas, the bottom path goes back again to the left, so we
                // need to append a copy of the last point.
                if (isArea) {
                    arr.push(arr[arr.length - 1]);
                }
            }
        }

        /**
         * Copy and append last point until the length matches the end length.
         * @private
         * @param {Highcharts.SVGPathArray} arr - array
         * @param {Highcharts.SVGPathArray} other - array
         * @return {void}
         */
        function append(
            arr: SVGPath,
            other: SVGPath
        ): void {
            while (arr.length < fullLength) {

                // Pull out the slice that is going to be appended or inserted.
                // In a line graph, the positionFactor is 1, and the last point
                // is sliced out. In an area graph, the positionFactor is 2,
                // causing the middle two points to be sliced out, since an area
                // path starts at left, follows the upper path then turns and
                // follows the bottom back.
                const segmentToAdd = arr[arr.length / positionFactor - 1].slice();

                // Disable the first control point of curve segments
                if (segmentToAdd[0] === 'C') {
                    segmentToAdd[1] = segmentToAdd[5];
                    segmentToAdd[2] = segmentToAdd[6];
                }

                if (!isArea) {
                    arr.push(segmentToAdd as SVGPath.Segment);

                } else {

                    const lowerSegmentToAdd = arr[arr.length / positionFactor].slice();
                    arr.splice(
                        arr.length / 2,
                        0,
                        segmentToAdd as SVGPath.Segment,
                        lowerSegmentToAdd as SVGPath.Segment
                    );
                }
            }
        }

        // For sideways animation, find out how much we need to shift to get the
        // start path Xs to match the end path Xs.
        if (startX && endX) {
            for (i = 0; i < startX.length; i++) {
                // Moving left, new points coming in on right
                if (startX[i] === endX[0]) {
                    shift = i;
                    break;
                // Moving right
                } else if (startX[0] ===
                        endX[endX.length - startX.length + i]) {
                    shift = i;
                    reverse = true;
                    break;
                // Fixed from the right side, "scaling" left
                } else if (
                    startX[startX.length - 1] ===
                        endX[endX.length - startX.length + i]
                ) {
                    shift = startX.length - i;
                    break;
                }
            }
            if (typeof shift === 'undefined') {
                start = [];
            }
        }

        if (start.length && isNumber(shift)) {

            // The common target length for the start and end array, where both
            // arrays are padded in opposite ends
            fullLength = end.length + shift * positionFactor;

            if (!reverse) {
                prepend(end, start);
                append(start, end);
            } else {
                prepend(start, end);
                append(end, start);
            }
        }
        return [start, end];
    }

    /**
     * Handle animation of the color attributes directly.
     *
     * @function Highcharts.Fx#fillSetter
     *
     * @return {void}
     */
    public fillSetter(): void {
        Fx.prototype.strokeSetter.apply(this, arguments as any);
    }

    /**
     * Handle animation of the color attributes directly.
     *
     * @function Highcharts.Fx#strokeSetter
     *
     * @return {void}
     */
    public strokeSetter(): void {
        this.elem.attr(
            this.prop,
            H.color(this.start as any).tweenTo(H.color(this.end as any), this.pos as any),
            null as any,
            true
        );
    }
}

H.Fx = Fx;

function merge<T1, T2 = object>(
    extend: boolean,
    a?: T1,
    ...n: Array<T2|undefined>
): (T1&T2);
function merge<
    T1 extends object = object,
    T2 = unknown,
    T3 = unknown,
    T4 = unknown,
    T5 = unknown,
    T6 = unknown,
    T7 = unknown,
    T8 = unknown,
    T9 = unknown
>(
    a?: T1,
    b?: T2,
    c?: T3,
    d?: T4,
    e?: T5,
    f?: T6,
    g?: T7,
    h?: T8,
    i?: T9,
): (T1&T2&T3&T4&T5&T6&T7&T8&T9);
/* eslint-disable valid-jsdoc */
/**
 * Utility function to deep merge two or more objects and return a third object.
 * If the first argument is true, the contents of the second object is copied
 * into the first object. The merge function can also be used with a single
 * object argument to create a deep copy of an object.
 *
 * @function Highcharts.merge<T>
 *
 * @param {boolean} extend
 *        Whether to extend the left-side object (a) or return a whole new
 *        object.
 *
 * @param {T|undefined} a
 *        The first object to extend. When only this is given, the function
 *        returns a deep copy.
 *
 * @param {...Array<object|undefined>} [n]
 *        An object to merge into the previous one.
 *
 * @return {T}
 *         The merged object. If the first argument is true, the return is the
 *         same as the second argument.
 *//**
 * Utility function to deep merge two or more objects and return a third object.
 * The merge function can also be used with a single object argument to create a
 * deep copy of an object.
 *
 * @function Highcharts.merge<T>
 *
 * @param {T|undefined} a
 *        The first object to extend. When only this is given, the function
 *        returns a deep copy.
 *
 * @param {...Array<object|undefined>} [n]
 *        An object to merge into the previous one.
 *
 * @return {T}
 *         The merged object. If the first argument is true, the return is the
 *         same as the second argument.
 */
function merge<T>(): T {
    /* eslint-enable valid-jsdoc */
    var i,
        args = arguments,
        len,
        ret = {} as T,
        doCopy = function (copy: any, original: any): any {
            // An object is replacing a primitive
            if (typeof copy !== 'object') {
                copy = {};
            }

            objectEach(original, function (value, key): void {

                // Copy the contents of objects, but not arrays or DOM nodes
                if (isObject(value, true) &&
                    !isClass(value) &&
                    !isDOMElement(value)
                ) {
                    copy[key] = doCopy(copy[key] || {}, value);

                // Primitives and arrays are copied over directly
                } else {
                    copy[key] = original[key];
                }
            });
            return copy;
        };

    // If first argument is true, copy into the existing object. Used in
    // setOptions.
    if (args[0] === true) {
        ret = args[1];
        args = Array.prototype.slice.call(args, 2) as any;
    }

    // For each argument, extend the return
    len = args.length;
    for (i = 0; i < len; i++) {
        ret = doCopy(ret, args[i]);
    }

    return ret;
}
H.merge = merge;

/**
 * Constrain a value to within a lower and upper threshold.
 *
 * @private
 * @param {number} value The initial value
 * @param {number} min The lower threshold
 * @param {number} max The upper threshold
 * @return {number} Returns a number value within min and max.
 */
function clamp(value: number, min: number, max: number): number {
    return value > min ? value < max ? value : max : min;
}

/**
 * Shortcut for parseInt
 *
 * @private
 * @function Highcharts.pInt
 *
 * @param {*} s
 *        any
 *
 * @param {number} [mag]
 *        Magnitude
 *
 * @return {number}
 *         number
 */
const pInt = H.pInt = function pInt(s: any, mag?: number): number {
    return parseInt(s, mag || 10);
};

/**
 * Utility function to check for string type.
 *
 * @function Highcharts.isString
 *
 * @param {*} s
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a string.
 */
const isString = H.isString = function isString(s: unknown): s is string {
    return typeof s === 'string';
};

/**
 * Utility function to check if an item is an array.
 *
 * @function Highcharts.isArray
 *
 * @param {*} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is an array.
 */
const isArray = H.isArray = function isArray(obj: unknown): obj is Array<unknown> {
    var str = Object.prototype.toString.call(obj);

    return str === '[object Array]' || str === '[object Array Iterator]';
};

function isObject<T>(obj: T, strict: true): obj is object & NonArray<NonFunction<NonNullable<T>>>;
function isObject<T>(obj: T, strict?: false): obj is object & NonFunction<NonNullable<T>>;
/**
 * Utility function to check if an item is of type object.
 *
 * @function Highcharts.isObject
 *
 * @param {*} obj
 *        The item to check.
 *
 * @param {boolean} [strict=false]
 *        Also checks that the object is not an array.
 *
 * @return {boolean}
 *         True if the argument is an object.
 */
function isObject<T>(
    obj: T,
    strict?: boolean
): boolean {
    return (
        !!obj &&
        typeof obj === 'object' &&
        (!strict || !isArray(obj))
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
H.isObject = isObject;

/**
 * Utility function to check if an Object is a HTML Element.
 *
 * @function Highcharts.isDOMElement
 *
 * @param {*} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a HTML Element.
 */
const isDOMElement = H.isDOMElement = function isDOMElement(obj: unknown): obj is Highcharts.HTMLDOMElement {
    return isObject(obj) && typeof (obj as any).nodeType === 'number';
};

/**
 * Utility function to check if an Object is a class.
 *
 * @function Highcharts.isClass
 *
 * @param {object|undefined} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a class.
 */
const isClass = H.isClass = function isClass(obj: (object|undefined)): obj is Highcharts.Class<any> {
    var c: (Function|undefined) = obj && obj.constructor;

    return !!(
        isObject(obj, true) &&
        !isDOMElement(obj) &&
        (c && (c as any).name && (c as any).name !== 'Object')
    );
};

/**
 * Utility function to check if an item is a number and it is finite (not NaN,
 * Infinity or -Infinity).
 *
 * @function Highcharts.isNumber
 *
 * @param {*} n
 *        The item to check.
 *
 * @return {boolean}
 *         True if the item is a finite number
 */
const isNumber = H.isNumber = function isNumber(n: unknown): n is number {
    return typeof n === 'number' && !isNaN(n) && n < Infinity && n > -Infinity;
};

/**
 * Remove the last occurence of an item from an array.
 *
 * @function Highcharts.erase
 *
 * @param {Array<*>} arr
 *        The array.
 *
 * @param {*} item
 *        The item to remove.
 *
 * @return {void}
 */
const erase = H.erase = function erase(arr: Array<unknown>, item: unknown): void {
    var i = arr.length;

    while (i--) {
        if (arr[i] === item) {
            arr.splice(i, 1);
            break;
        }
    }
};

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
const defined = H.defined = function defined<T>(obj: T): obj is NonNullable<T> {
    return typeof obj !== 'undefined' && obj !== null;
};

function attr(
    elem: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement),
    prop: (Highcharts.HTMLAttributes|Highcharts.SVGAttributes)
): undefined;
function attr(
    elem: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement),
    prop: string,
    value?: undefined
): (string|null);
function attr(
    elem: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement),
    prop: string,
    value: (number|string)
): undefined;
/**
 * Set or get an attribute or an object of attributes. To use as a setter, pass
 * a key and a value, or let the second argument be a collection of keys and
 * values. To use as a getter, pass only a string as the second argument.
 *
 * @function Highcharts.attr
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} elem
 *        The DOM element to receive the attribute(s).
 *
 * @param {string|Highcharts.HTMLAttributes|Highcharts.SVGAttributes} [prop]
 *        The property or an object of key-value pairs.
 *
 * @param {number|string} [value]
 *        The value if a single property is set.
 *
 * @return {string|null|undefined}
 *         When used as a getter, return the value.
 */
function attr(
    elem: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement),
    prop: (string|Highcharts.HTMLAttributes|Highcharts.SVGAttributes),
    value?: (number|string)
): (string|null|undefined) {
    let ret;

    // if the prop is a string
    if (isString(prop)) {
        // set the value
        if (defined(value)) {
            elem.setAttribute(prop, value as string);

        // get the value
        } else if (elem && elem.getAttribute) {
            ret = elem.getAttribute(prop);

            // IE7 and below cannot get class through getAttribute (#7850)
            if (!ret && prop === 'class') {
                ret = elem.getAttribute(prop + 'Name');
            }
        }

    // else if prop is defined, it is a hash of key/value pairs
    } else {
        objectEach(prop, function (val, key): void {
            elem.setAttribute(key, val);
        });
    }
    return ret;
}
H.attr = attr;

/**
 * Check if an element is an array, and if not, make it into an array.
 *
 * @function Highcharts.splat
 *
 * @param {*} obj
 *        The object to splat.
 *
 * @return {Array}
 *         The produced or original array.
 */
const splat = H.splat = function splat(obj: any): Array<any> {
    return isArray(obj) ? obj : [obj];
};

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
const syncTimeout = H.syncTimeout = function syncTimeout(
    fn: Function,
    delay: number,
    context?: unknown
): number {
    if (delay > 0) {
        return setTimeout(fn, delay, context);
    }
    fn.call(0, context);
    return -1;
};

/**
 * Internal clear timeout. The function checks that the `id` was not removed
 * (e.g. by `chart.destroy()`). For the details see
 * [issue #7901](https://github.com/highcharts/highcharts/issues/7901).
 *
 * @function Highcharts.clearTimeout
 *
 * @param {number} id
 *        Id of a timeout.
 *
 * @return {void}
 */
const internalClearTimeout = H.clearTimeout = function (id: number): void {
    if (defined(id)) {
        clearTimeout(id);
    }
};

/* eslint-disable valid-jsdoc */
/**
 * Utility function to extend an object with the members of another.
 *
 * @function Highcharts.extend<T>
 *
 * @param {T|undefined} a
 *        The object to be extended.
 *
 * @param {object} b
 *        The object to add to the first one.
 *
 * @return {T}
 *         Object a, the original object.
 */
const extend = H.extend = function extend<T extends object>(a: (T|undefined), b: object): T {
    /* eslint-enable valid-jsdoc */
    var n;

    if (!a) {
        a = {} as T;
    }
    for (n in b) { // eslint-disable-line guard-for-in
        (a as any)[n] = (b as any)[n];
    }
    return a;
};

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
H.pick = pick;

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
const css = H.css = function css(
    el: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement),
    styles: Highcharts.CSSObject
): void {
    if (H.isMS && !H.svg) { // #2686
        if (styles && typeof styles.opacity !== 'undefined') {
            styles.filter =
                'alpha(opacity=' + (styles.opacity as any * 100) + ')';
        }
    }
    extend(el.style, styles);
};

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
const createElement = H.createElement = function createElement(
    tag: string,
    attribs?: Highcharts.HTMLAttributes,
    styles?: Highcharts.CSSObject,
    parent?: Highcharts.HTMLDOMElement,
    nopad?: boolean
): Highcharts.HTMLDOMElement {
    var el = doc.createElement(tag);

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
};

// eslint-disable-next-line valid-jsdoc
/**
 * Extend a prototyped class by new members.
 *
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
const extendClass = H.extendClass = function extendClass <T, TReturn = T>(
    parent: Highcharts.Class<T>,
    members: any
): Highcharts.Class<TReturn> {
    var obj: Highcharts.Class<TReturn> = (function (): void {}) as any;

    obj.prototype = new parent(); // eslint-disable-line new-cap
    extend(obj.prototype, members);
    return obj;
};

/**
 * Left-pad a string to a given length by adding a character repetetively.
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
const pad = H.pad = function pad(number: number, length?: number, padder?: string): string {
    return new Array(
        (length || 2) +
        1 -
        String(number)
            .replace('-', '')
            .length
    ).join(padder || '0') + number;
};

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
const relativeLength = H.relativeLength = function relativeLength(
    value: Highcharts.RelativeSize,
    base: number,
    offset?: number
): number {
    return (/%$/).test(value as any) ?
        (base * parseFloat(value as any) / 100) + (offset || 0) :
        parseFloat(value as any);
};

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
const wrap = H.wrap = function wrap(
    obj: any,
    method: string,
    func: Highcharts.WrapProceedFunction
): void {
    var proceed = obj[method];

    obj[method] = function (): any {
        var args = Array.prototype.slice.call(arguments),
            outerArgs = arguments,
            ctx = this,
            ret;

        ctx.proceed = function (): void {
            proceed.apply(ctx, arguments.length ? arguments : outerArgs);
        };
        args.unshift(proceed);
        ret = func.apply(this, args);
        ctx.proceed = null;
        return ret;
    };
};

/**
 * Format a string according to a subset of the rules of Python's String.format
 * method.
 *
 * @example
 * var s = Highcharts.format(
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
const format = H.format = function (str: string, ctx: any, chart?: Chart): string {
    var splitter = '{',
        isInside = false,
        segment,
        valueAndFormat: Array<string>,
        ret = [],
        val,
        index;
    const floatRegex = /f$/;
    const decRegex = /\.([0-9])/;
    const lang = H.defaultOptions.lang;
    const time = chart && chart.time || H.time;
    const numberFormatter = chart && chart.numberFormatter || numberFormat;

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
                    const decimals = parseInt((segment.match(decRegex) || ['', '-1'])[1], 10);
                    if (val !== null) {
                        val = numberFormatter(
                            val,
                            decimals,
                            (lang as any).decimalPoint,
                            segment.indexOf(',') > -1 ? (lang as any).thousandsSep : ''
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
};

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
const getMagnitude = H.getMagnitude = function (num: number): number {
    return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
};

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
const normalizeTickInterval = H.normalizeTickInterval = function (
    interval: number,
    multiples?: Array<any>,
    magnitude?: number,
    allowDecimals?: boolean,
    hasTickAmount?: boolean
): number {
    var normalized,
        i,
        retInterval = interval;

    // round to a tenfold of 1, 2, 2.5 or 5
    magnitude = pick(magnitude, 1);
    normalized = interval / (magnitude as any);

    // multiples for a linear scale
    if (!multiples) {
        multiples = hasTickAmount ?
            // Finer grained ticks when the tick amount is hard set, including
            // when alignTicks is true on multiple axes (#4580).
            [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] :

            // Else, let ticks fall on rounder numbers
            [1, 2, 2.5, 5, 10];


        // the allowDecimals option
        if (allowDecimals === false) {
            if (magnitude === 1) {
                multiples = multiples.filter(function (num: number): boolean {
                    return num % 1 === 0;
                });
            } else if ((magnitude as any) <= 0.1) {
                multiples = [1 / (magnitude as any)];
            }
        }
    }

    // normalize the interval to the nearest multiple
    for (i = 0; i < multiples.length; i++) {
        retInterval = multiples[i];
        // only allow tick amounts smaller than natural
        if (
            (
                hasTickAmount &&
                retInterval * (magnitude as any) >= interval
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
};


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
 *
 * @return {void}
 */
const stableSort = H.stableSort = function stableSort(arr: Array<any>, sortFunction: Function): void {

    // @todo It seems like Chrome since v70 sorts in a stable way internally,
    // plus all other browsers do it, so over time we may be able to remove this
    // function
    var length = arr.length,
        sortValue,
        i;

    // Add index to each item
    for (i = 0; i < length; i++) {
        arr[i].safeI = i; // stable sort index
    }

    arr.sort(function (a: any, b: any): number {
        sortValue = sortFunction(a, b);
        return sortValue === 0 ? a.safeI - b.safeI : sortValue;
    });

    // Remove index from items
    for (i = 0; i < length; i++) {
        delete arr[i].safeI; // stable sort index
    }
};

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
const arrayMin = H.arrayMin = function arrayMin(data: Array<any>): number {
    var i = data.length,
        min = data[0];

    while (i--) {
        if (data[i] < min) {
            min = data[i];
        }
    }
    return min;
};

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
const arrayMax = H.arrayMax = function arrayMax(data: Array<any>): number {
    var i = data.length,
        max = data[0];

    while (i--) {
        if (data[i] > max) {
            max = data[i];
        }
    }
    return max;
};

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
 *
 * @return {void}
 */
const destroyObjectProperties = H.destroyObjectProperties =
    function destroyObjectProperties(obj: any, except?: any): void {
        objectEach(obj, function (val, n): void {
            // If the object is non-null and destroy is defined
            if (val && val !== except && val.destroy) {
                // Invoke the destroy
                val.destroy();
            }

            // Delete the property from the object.
            delete obj[n];
        });
    };


/**
 * Discard a HTML element by moving it to the bin and delete.
 *
 * @function Highcharts.discardElement
 *
 * @param {Highcharts.HTMLDOMElement} element
 *        The HTML node to discard.
 *
 * @return {void}
 */
const discardElement = H.discardElement = function discardElement(element?: Highcharts.HTMLDOMElement): void {
    var garbageBin = H.garbageBin;

    // create a garbage bin element, not part of the DOM
    if (!garbageBin) {
        garbageBin = createElement('div');
    }

    // move the node and empty bin
    if (element) {
        garbageBin.appendChild(element);
    }
    garbageBin.innerHTML = '';
};

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
const correctFloat = H.correctFloat = function correctFloat(num: number, prec?: number): number {
    return parseFloat(
        num.toPrecision(prec || 14)
    );
};

/**
 * Set the global animation to either a given value, or fall back to the given
 * chart's animation option.
 *
 * @function Highcharts.setAnimation
 *
 * @param {boolean|Partial<Highcharts.AnimationOptionsObject>|undefined} animation
 *        The animation object.
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @return {void}
 *
 * @todo
 * This function always relates to a chart, and sets a property on the renderer,
 * so it should be moved to the SVGRenderer.
 */
const setAnimation = H.setAnimation = function setAnimation(
    animation: (boolean|Partial<Highcharts.AnimationOptionsObject>|undefined),
    chart: Chart
): void {
    chart.renderer.globalAnimation = pick(
        animation,
        (chart.options.chart as any).animation,
        true
    );
};

/**
 * Get the animation in object form, where a disabled animation is always
 * returned as `{ duration: 0 }`.
 *
 * @function Highcharts.animObject
 *
 * @param {boolean|Highcharts.AnimationOptionsObject} [animation=0]
 *        An animation setting. Can be an object with duration, complete and
 *        easing properties, or a boolean to enable or disable.
 *
 * @return {Highcharts.AnimationOptionsObject}
 *         An object with at least a duration property.
 */
const animObject = H.animObject = function animObject(
    animation?: (boolean|Partial<Highcharts.AnimationOptionsObject>)
): Highcharts.AnimationOptionsObject {
    return isObject(animation) ?
        H.merge(
            { duration: 500, defer: 0 },
            animation as Highcharts.AnimationOptionsObject
        ) as any :
        { duration: animation as boolean ? 500 : 0, defer: 0 };
};

/**
 * The time unit lookup
 *
 * @ignore
 */

const timeUnits: Highcharts.Dictionary<number> = H.timeUnits = {
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
const numberFormat = H.numberFormat = function numberFormat(
    number: number,
    decimals: number,
    decimalPoint?: string,
    thousandsSep?: string
): string {
    number = +number || 0;
    decimals = +decimals;

    var lang = H.defaultOptions.lang,
        origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
        strinteger,
        thousands,
        ret,
        roundedNumber,
        exponent = number.toString().split('e'),
        fractionDigits;

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
    roundedNumber = (
        Math.abs(exponent[1] ? exponent[0] as any : number) +
        Math.pow(10, -Math.max(decimals, origDec) - 1)
    ).toFixed(decimals);

    // A string containing the positive integer component of the number
    strinteger = String(pInt(roundedNumber));

    // Leftover after grouping into thousands. Can be 0, 1 or 2.
    thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

    // Language
    decimalPoint = pick(decimalPoint, (lang as any).decimalPoint);
    thousandsSep = pick(thousandsSep, (lang as any).thousandsSep);

    // Start building the return
    ret = number < 0 ? '-' : '';

    // Add the leftover after grouping into thousands. For example, in the
    // number 42 000 000, this line adds 42.
    ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

    // Add the remaining thousands groups, joined by the thousands separator
    ret += strinteger
        .substr(thousands)
        .replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);

    // Add the decimal point and the decimal component
    if (decimals) {
        // Get the decimal component
        ret += decimalPoint + roundedNumber.slice(-decimals);
    }

    if (exponent[1] && +ret !== 0) {
        ret += 'e' + exponent[1];
    }

    return ret;
};

/**
 * Easing definition
 *
 * @private
 * @function Math.easeInOutSine
 *
 * @param {number} pos
 *        Current position, ranging from 0 to 1.
 *
 * @return {number}
 *         Ease result
 */
Math.easeInOutSine = function (pos: number): number {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
};

/**
 * Returns the value of a property path on a given object.
 *
 * @private
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
function getNestedProperty(path: string, obj: unknown): unknown {

    if (!path) {
        return obj;
    }

    const pathElements = path.split('.').reverse();

    let subProperty = obj as Record<string, unknown>;

    if (pathElements.length === 1) {
        return subProperty[path];
    }

    let pathElement = pathElements.pop();

    while (
        typeof pathElement !== 'undefined' &&
        typeof subProperty !== 'undefined' &&
        subProperty !== null
    ) {
        subProperty = subProperty[pathElement] as Record<string, unknown>;
        pathElement = pathElements.pop();
    }

    return subProperty;
}

/**
 * Get the computed CSS value for given element and property, only for numerical
 * properties. For width and height, the dimension of the inner box (excluding
 * padding) is returned. Used for fitting the chart within the container.
 *
 * @function Highcharts.getStyle
 *
 * @param {Highcharts.HTMLDOMElement} el
 *        An HTML element.
 *
 * @param {string} prop
 *        The property name.
 *
 * @param {boolean} [toInt=true]
 *        Parse to integer.
 *
 * @return {number|string}
 *         The numeric value.
 */
const getStyle = H.getStyle = function (
    el: Highcharts.HTMLDOMElement,
    prop: string,
    toInt?: boolean
): (number|string) {

    var style;

    // For width and height, return the actual inner pixel size (#4913)
    if (prop === 'width') {

        let offsetWidth = Math.min(el.offsetWidth, el.scrollWidth);

        // In flex boxes, we need to use getBoundingClientRect and floor it,
        // because scrollWidth doesn't support subpixel precision (#6427) ...
        const boundingClientRectWidth = el.getBoundingClientRect &&
            el.getBoundingClientRect().width;
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
                (H as any).getStyle(el, 'padding-left') -
                (H as any).getStyle(el, 'padding-right')
            )
        );
    }

    if (prop === 'height') {
        return Math.max(
            0, // #8377
            Math.min(el.offsetHeight, el.scrollHeight) -
                (H as any).getStyle(el, 'padding-top') -
                (H as any).getStyle(el, 'padding-bottom')
        );
    }

    if (!win.getComputedStyle) {
        // SVG not supported, forgot to load oldie.js?
        error(27, true);
    }

    // Otherwise, get the computed style
    style = win.getComputedStyle(el, undefined); // eslint-disable-line no-undefined
    if (style) {
        style = style.getPropertyValue(prop);
        if (pick(toInt, prop !== 'opacity')) {
            style = pInt(style);
        }
    }
    return style;
};

/**
 * Get the defer as a number value from series animation options.
 *
 * @function Highcharts.getDeferredAnimation
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @return {number}
 *        The numeric value.
 */
const getDeferredAnimation = H.getDeferredAnimation = function (
    chart,
    animation,
    series?
): Partial<Highcharts.AnimationOptionsObject> {

    const labelAnimation = animObject(animation);
    const s = series ? [series] : chart.series;
    let defer = 0;
    let duration = 0;

    s.forEach((series): void => {
        const seriesAnim = animObject(series.options.animation);

        defer = animation && defined(animation.defer) ?
            labelAnimation.defer :
            Math.max(
                defer,
                seriesAnim.duration + seriesAnim.defer
            );
        duration = Math.min(labelAnimation.duration, seriesAnim.duration);
    });
    // Disable defer for exporting
    if (chart.renderer.forExport) {
        defer = 0;
    }

    const anim = {
        defer: Math.max(0, defer - duration),
        duration: Math.min(defer, duration)
    };

    return anim;
};

/**
 * Search for an item in an array.
 *
 * @function Highcharts.inArray
 *
 * @deprecated
 *
 * @param {*} item
 *        The item to search for.
 *
 * @param {Array<*>} arr
 *        The array or node collection to search in.
 *
 * @param {number} [fromIndex=0]
 *        The index to start searching from.
 *
 * @return {number}
 *         The index within the array, or -1 if not found.
 */
const inArray = H.inArray = function (item: any, arr: Array<any>, fromIndex?: number): number {
    error(32, false, void 0, { 'Highcharts.inArray': 'use Array.indexOf' });
    return arr.indexOf(item, fromIndex);
};

/* eslint-disable valid-jsdoc */
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
const find = H.find = (Array.prototype as any).find ?
    /* eslint-enable valid-jsdoc */
    function<T> (arr: Array<T>, callback: Function): (T|undefined) {
        return (arr as any).find(callback as any);
    } :
    // Legacy implementation. PhantomJS, IE <= 11 etc. #7223.
    function<T> (arr: Array<T>, callback: Function): (T|undefined) {
        var i,
            length = arr.length;

        for (i = 0; i < length; i++) {
            if (callback(arr[i], i)) { // eslint-disable-line callback-return
                return arr[i];
            }
        }
    };

/**
 * Returns an array of a given object's own properties.
 *
 * @function Highcharts.keys
 * @deprecated
 *
 * @param {*} obj
 *        The object of which the properties are to be returned.
 *
 * @return {Array<string>}
 *         An array of strings that represents all the properties.
 */
H.keys = function (obj): Array<string> {
    error(32, false, void 0, { 'Highcharts.keys': 'use Object.keys' });
    return Object.keys(obj);
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
const offset = H.offset = function offset(el: Element): Highcharts.OffsetObject {
    var docElem = doc.documentElement,
        box = (el.parentElement || el.parentNode) ?
            el.getBoundingClientRect() :
            { top: 0, left: 0 };

    return {
        top: box.top + (win.pageYOffset || docElem.scrollTop) -
            (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) -
            (docElem.clientLeft || 0)
    };
};

/**
 * Stop running animation.
 *
 * @function Highcharts.stop
 *
 * @param {Highcharts.SVGElement} el
 *        The SVGElement to stop animation on.
 *
 * @param {string} [prop]
 *        The property to stop animating. If given, the stop method will stop a
 *        single property from animating, while others continue.
 *
 * @return {void}
 *
 * @todo
 * A possible extension to this would be to stop a single property, when
 * we want to continue animating others. Then assign the prop to the timer
 * in the Fx.run method, and check for the prop here. This would be an
 * improvement in all cases where we stop the animation from .attr. Instead of
 * stopping everything, we can just stop the actual attributes we're setting.
 */
const stop = H.stop = function (el: Highcharts.SVGElement, prop?: string): void {

    var i = H.timers.length;

    // Remove timers related to this element (#4519)
    while (i--) {
        if (H.timers[i].elem === el && (!prop || prop === H.timers[i].prop)) {
            H.timers[i].stopped = true; // #4667
        }
    }
};

/* eslint-disable valid-jsdoc */
/**
 * Iterate over object key pairs in an object.
 *
 * @function Highcharts.objectEach<T>
 *
 * @param {*} obj
 *        The object to iterate over.
 *
 * @param {Highcharts.ObjectEachCallbackFunction<T>} fn
 *        The iterator callback. It passes three arguments:
 *        * value - The property value.
 *        * key - The property key.
 *        * obj - The object that objectEach is being applied to.
 *
 * @param {T} [ctx]
 *        The context.
 *
 * @return {void}
 */
const objectEach = H.objectEach = function objectEach<TObject, TContext>(
    obj: TObject,
    fn: Highcharts.ObjectEachCallbackFunction<TObject, TContext>,
    ctx?: TContext
): void {
    /* eslint-enable valid-jsdoc */
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            fn.call(ctx || obj[key] as unknown as TContext, obj[key], key, obj);
        }
    }
};

/**
 * Iterate over an array.
 *
 * @deprecated
 * @function Highcharts.each
 *
 * @param {Array<*>} arr
 *        The array to iterate over.
 *
 * @param {Function} fn
 *        The iterator callback. It passes three arguments:
 *        - `item`: The array item.
 *        - `index`: The item's index in the array.
 *        - `arr`: The array that each is being applied to.
 *
 * @param {*} [ctx]
 *        The context.
 *
 * @return {void}
 */

/**
 * Filter an array by a callback.
 *
 * @deprecated
 * @function Highcharts.grep
 *
 * @param {Array<*>} arr
 *        The array to filter.
 *
 * @param {Function} callback
 *        The callback function. The function receives the item as the first
 *        argument. Return `true` if the item is to be preserved.
 *
 * @return {Array<*>}
 *         A new, filtered array.
 */

/**
 * Map an array by a callback.
 *
 * @deprecated
 * @function Highcharts.map
 *
 * @param {Array<*>} arr
 *        The array to map.
 *
 * @param {Function} fn
 *        The callback function. Return the new value for the new array.
 *
 * @return {Array<*>}
 *         A new array item with modified items.
 */

/**
 * Reduce an array to a single value.
 *
 * @deprecated
 * @function Highcharts.reduce
 *
 * @param {Array<*>} arr
 *        The array to reduce.
 *
 * @param {Function} fn
 *        The callback function. Return the reduced value. Receives 4
 *        arguments: Accumulated/reduced value, current value, current array
 *        index, and the array.
 *
 * @param {*} initialValue
 *        The initial value of the accumulator.
 *
 * @return {*}
 *         The reduced value.
 */

/**
 * Test whether at least one element in the array passes the test implemented by
 * the provided function.
 *
 * @deprecated
 * @function Highcharts.some
 *
 * @param {Array<*>} arr
 *        The array to test
 *
 * @param {Function} fn
 *        The function to run on each item. Return truty to pass the test.
 *        Receives arguments `currentValue`, `index` and `array`.
 *
 * @param {*} ctx
 *        The context.
 *
 * @return {boolean}
 */
objectEach({
    map: 'map',
    each: 'forEach',
    grep: 'filter',
    reduce: 'reduce',
    some: 'some'
} as Record<string, ('map'|'forEach'|'filter'|'reduce'|'some')>, function (val, key): void {
    (H as any)[key] = function (arr: Array<unknown>): any {
        error(32, false, void 0, { [`Highcharts.${key}`]: `use Array.${val}` });
        return (Array.prototype[val] as any).apply(
            arr,
            [].slice.call(arguments, 1)
        );
    };
});

/* eslint-disable valid-jsdoc */
/**
 * Add an event listener.
 *
 * @function Highcharts.addEvent<T>
 *
 * @param {Highcharts.Class<T>|T} el
 *        The element or object to add a listener to. It can be a
 *        {@link HTMLDOMElement}, an {@link SVGElement} or any other object.
 *
 * @param {string} type
 *        The event type.
 *
 * @param {Highcharts.EventCallbackFunction<T>|Function} fn
 *        The function callback to execute when the event is fired.
 *
 * @param {Highcharts.EventOptionsObject} [options]
 *        Options for adding the event.
 *
 * @return {Function}
 *         A callback function to remove the added event.
 */
const addEvent = H.addEvent = function<T> (
    el: (Highcharts.Class<T>|T),
    type: string,
    fn: (Highcharts.EventCallbackFunction<T>|Function),
    options: Highcharts.EventOptionsObject = {}
): Function {
    /* eslint-enable valid-jsdoc */
    var events: Highcharts.Dictionary<Array<any>>,
        addEventListener = (
            (el as any).addEventListener || H.addEventListenerPolyfill
        );

    // If we're setting events directly on the constructor, use a separate
    // collection, `protoEvents` to distinguish it from the item events in
    // `hcEvents`.
    if (typeof el === 'function' && el.prototype) {
        events = el.prototype.protoEvents = el.prototype.protoEvents || {};
    } else {
        events = (el as any).hcEvents = (el as any).hcEvents || {};
    }

    // Allow click events added to points, otherwise they will be prevented by
    // the TouchPointer.pinch function after a pinch zoom operation (#7091).
    if (H.Point &&
        el instanceof H.Point &&
        (el as any).series &&
        (el as any).series.chart
    ) {
        (el as any).series.chart.runTrackerClick = true;
    }

    // Handle DOM events
    if (addEventListener) {
        addEventListener.call(el, type, fn, false);
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
    events[type].sort(function (
        a: Highcharts.EventWrapperObject<T>,
        b: Highcharts.EventWrapperObject<T>
    ): number {
        return a.order - b.order;
    });

    // Return a function that can be called to remove this event.
    return function (): void {
        removeEvent(el, type, fn);
    };
};

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
const removeEvent = H.removeEvent = function removeEvent<T>(
    el: (Highcharts.Class<T>|T),
    type?: string,
    fn?: (Highcharts.EventCallbackFunction<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */

    var events;

    /**
     * @private
     * @param {string} type - event type
     * @param {Highcharts.EventCallbackFunction<T>} fn - callback
     * @return {void}
     */
    function removeOneEvent(
        type: string,
        fn: (Highcharts.EventCallbackFunction<T>|Function)
    ): void {
        var removeEventListener = (
            (el as any).removeEventListener || H.removeEventListenerPolyfill
        );

        if (removeEventListener) {
            removeEventListener.call(el, type, fn, false);
        }
    }

    /**
     * @private
     * @param {any} eventCollection - collection
     * @return {void}
     */
    function removeAllEvents(eventCollection: any): void {
        var types: Highcharts.Dictionary<boolean>,
            len;

        if (!(el as any).nodeName) {
            return; // break on non-DOM events
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

    ['protoEvents', 'hcEvents'].forEach(function (coll: string, i): void {
        const eventElem = i ? el : (el as any).prototype;
        const eventCollection = eventElem && eventElem[coll];

        if (eventCollection) {
            if (type) {
                events = (
                    eventCollection[type] || []
                ) as Highcharts.EventWrapperObject<T>[];

                if (fn) {
                    eventCollection[type] = events.filter(
                        function (obj): boolean {
                            return fn !== obj.fn;
                        }
                    );
                    removeOneEvent(type, fn);

                } else {
                    removeAllEvents(eventCollection);
                    eventCollection[type] = [];
                }
            } else {
                removeAllEvents(eventCollection);
                eventElem[coll] = {};
            }
        }
    });
};

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
const fireEvent = H.fireEvent = function<T> (
    el: T,
    type: string,
    eventArguments?: (Highcharts.Dictionary<any>|Event),
    defaultFunction?: (Highcharts.EventCallbackFunction<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */
    var e,
        i;

    eventArguments = eventArguments || {};

    if (doc.createEvent &&
        ((el as any).dispatchEvent || (el as any).fireEvent)
    ) {
        e = doc.createEvent('Events');
        e.initEvent(type, true, true);

        extend(e, eventArguments);

        if ((el as any).dispatchEvent) {
            (el as any).dispatchEvent(e);
        } else {
            (el as any).fireEvent(type, e);
        }

    } else {

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
                // (#2297). If it is set, we're running a browser event,
                // and setting it will cause en error in IE8 (#2465).
                type: type
            });
        }

        const fireInOrder = (
            protoEvents: Highcharts.EventWrapperObject<any>[] = [],
            hcEvents: Highcharts.EventWrapperObject<any>[] = []
        ): void => {
            let iA = 0;
            let iB = 0;
            const length = protoEvents.length + hcEvents.length;

            for (i = 0; i < length; i++) {
                const obj = (
                    !protoEvents[iA] ?
                        hcEvents[iB++] :
                        !hcEvents[iB] ?
                            protoEvents[iA++] :
                            protoEvents[iA].order <= hcEvents[iB].order ?
                                protoEvents[iA++] :
                                hcEvents[iB++]
                );

                // If the event handler return false, prevent the default
                // handler from executing
                if (obj.fn.call(el, eventArguments as any) === false) {
                    (eventArguments as any).preventDefault();
                }
            }
        };

        fireInOrder(
            (el as any).protoEvents && (el as any).protoEvents[type],
            (el as any).hcEvents && (el as any).hcEvents[type]
        );
    }

    // Run the default if not prevented
    if (defaultFunction && !eventArguments.defaultPrevented) {
        (defaultFunction as Function).call(el, eventArguments);
    }
};

/**
 * The global animate method, which uses Fx to create individual animators.
 *
 * @function Highcharts.animate
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGElement} el
 *        The element to animate.
 *
 * @param {Highcharts.CSSObject|Highcharts.SVGAttributes} params
 *        An object containing key-value pairs of the properties to animate.
 *        Supports numeric as pixel-based CSS properties for HTML objects and
 *        attributes for SVGElements.
 *
 * @param {Partial<Highcharts.AnimationOptionsObject>} [opt]
 *        Animation options.
 *
 * @return {void}
 */
const animate = H.animate = function (
    el: (Highcharts.HTMLDOMElement|Highcharts.SVGElement),
    params: (Highcharts.CSSObject|Highcharts.SVGAttributes),
    opt?: Partial<Highcharts.AnimationOptionsObject>
): void {
    var start,
        unit = '',
        end,
        fx,
        args;

    if (!isObject(opt)) { // Number or undefined/null
        args = arguments;
        opt = {
            duration: args[2],
            easing: args[3],
            complete: args[4]
        };
    }
    if (!isNumber(opt.duration)) {
        opt.duration = 400;
    }
    opt.easing = typeof opt.easing === 'function' ?
        opt.easing :
        (Math[opt.easing as keyof Math] || Math.easeInOutSine) as any;
    opt.curAnim = merge(params) as any;

    objectEach(params, function (val, prop): void {
        // Stop current running animation of this property
        stop(el as any, prop);

        fx = new Fx(el as any, opt as any, prop);
        end = null;

        if (prop === 'd' && isArray(params.d)) {
            fx.paths = fx.initPath(
                el as any,
                (el as any).pathArray,
                params.d
            );
            fx.toD = params.d as any;
            start = 0;
            end = 1;
        } else if ((el as any).attr) {
            start = (el as any).attr(prop);
        } else {
            start = parseFloat(getStyle(el as any, prop) as any) || 0;
            if (prop !== 'opacity') {
                unit = 'px';
            }
        }

        if (!end) {
            end = val;
        }
        if (end && end.match && end.match('px')) {
            end = end.replace(/px/g, ''); // #4351
        }
        fx.run(start as any, end, unit);
    });
};

/**
 * Factory to create new series prototypes.
 *
 * @function Highcharts.seriesType
 *
 * @param {string} type
 *        The series type name.
 *
 * @param {string} parent
 *        The parent series type name. Use `line` to inherit from the basic
 *        {@link Series} object.
 *
 * @param {Highcharts.SeriesOptionsType|Highcharts.Dictionary<*>} options
 *        The additional default options that are merged with the parent's
 *        options.
 *
 * @param {Highcharts.Dictionary<*>} [props]
 *        The properties (functions and primitives) to set on the new
 *        prototype.
 *
 * @param {Highcharts.Dictionary<*>} [pointProps]
 *        Members for a series-specific extension of the {@link Point}
 *        prototype if needed.
 *
 * @return {Highcharts.Series}
 *         The newly created prototype as extended from {@link Series} or its
 *         derivatives.
 */
// docs: add to API + extending Highcharts
const seriesType = H.seriesType = function<TSeries extends Highcharts.Series> (
    type: string,
    parent: string,
    options: TSeries['options'],
    props?: Partial<TSeries>,
    pointProps?: Partial<TSeries['pointClass']['prototype']>
): typeof Highcharts.Series {
    var defaultOptions = getOptions(),
        seriesTypes = H.seriesTypes;

    // Merge the options
    (defaultOptions.plotOptions as any)[type] = merge(
        (defaultOptions.plotOptions as any)[parent],
        options
    );

    // Create the class
    seriesTypes[type] = extendClass(
        seriesTypes[parent] || function (): void {},
        props
    );
    seriesTypes[type].prototype.type = type;

    // Create the point class if needed
    if (pointProps) {
        seriesTypes[type].prototype.pointClass =
            extendClass(H.Point, pointProps);
    }

    return seriesTypes[type];
};

let serialMode: (boolean|undefined);
/**
 * Get a unique key for using in internal element id's and pointers. The key is
 * composed of a random hash specific to this Highcharts instance, and a
 * counter.
 *
 * @example
 * var id = uniqueKey(); // => 'highcharts-x45f6hp-0'
 *
 * @function Highcharts.uniqueKey
 *
 * @return {string}
 * A unique key.
 */
const uniqueKey = H.uniqueKey = (function (): () => string {

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
const useSerialIds = H.useSerialIds = function (mode?: boolean): (boolean|undefined) {
    return (serialMode = pick(mode, serialMode));
};

const isFunction = H.isFunction = function (obj: unknown): obj is Function {
    return typeof obj === 'function';
};

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions
 * for outside modules wasn't enough because the setOptions method created a new
 * object.
 *
 * @function Highcharts.getOptions
 *
 * @return {Highcharts.Options}
 */
const getOptions = H.getOptions = function (): Highcharts.Options {
    return H.defaultOptions;
};

/**
 * Merge the default options with custom options and return the new options
 * structure. Commonly used for defining reusable templates.
 *
 * @sample highcharts/global/useutc-false Setting a global option
 * @sample highcharts/members/setoptions Applying a global theme
 *
 * @function Highcharts.setOptions
 *
 * @param {Highcharts.Options} options
 *        The new custom chart options.
 *
 * @return {Highcharts.Options}
 *         Updated options.
 */
const setOptions = H.setOptions = function (
    options: Highcharts.Options
): Highcharts.Options {

    // Copy in the default options
    H.defaultOptions = merge(true, H.defaultOptions, options);

    // Update the time object
    if (options.time || options.global) {
        H.time.update(merge(
            H.defaultOptions.global,
            H.defaultOptions.time,
            options.global,
            options.time
        ));
    }

    return H.defaultOptions;
};

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
     *        Function to run when the chart has loaded and and all external
     *        images are loaded. Defining a
     *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
     *        handler is equivalent.
     *
     * @return {JQuery}
     *         The current JQuery selector.
     */
    (win as any).jQuery.fn.highcharts = function (): any {
        var args = [].slice.call(arguments) as any;

        if (this[0]) { // this[0] is the renderTo div

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

// TODO use named exports when supported.
const utilitiesModule = {
    Fx: H.Fx as unknown as typeof Highcharts.Fx,
    addEvent,
    animate,
    animObject,
    arrayMax,
    arrayMin,
    attr,
    clamp,
    clearTimeout: internalClearTimeout,
    correctFloat,
    createElement,
    css,
    defined,
    destroyObjectProperties,
    discardElement,
    erase,
    error,
    extend,
    extendClass,
    find,
    fireEvent,
    format,
    getDeferredAnimation,
    getMagnitude,
    getNestedProperty,
    getOptions,
    getStyle,
    inArray,
    isArray,
    isClass,
    isDOMElement,
    isFunction,
    isNumber,
    isObject,
    isString,
    merge,
    normalizeTickInterval,
    numberFormat,
    objectEach,
    offset,
    pad,
    pick,
    pInt,
    relativeLength,
    removeEvent,
    seriesType,
    setAnimation,
    setOptions,
    splat,
    stableSort,
    stop,
    syncTimeout,
    timeUnits,
    uniqueKey,
    useSerialIds,
    wrap
};

export default utilitiesModule;
