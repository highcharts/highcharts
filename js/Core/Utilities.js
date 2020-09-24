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
import H from './Globals.js';
/**
 * An animation configuration. Animation configurations can also be defined as
 * booleans, where `false` turns off animation and `true` defaults to a duration
 * of 500ms and defer of 0ms.
 *
 * @interface Highcharts.AnimationOptionsObject
 */ /**
* A callback function to exectute when the animation finishes.
* @name Highcharts.AnimationOptionsObject#complete
* @type {Function|undefined}
*/ /**
* The animation defer in milliseconds.
* @name Highcharts.AnimationOptionsObject#defer
* @type {number|undefined}
*/ /**
* The animation duration in milliseconds.
* @name Highcharts.AnimationOptionsObject#duration
* @type {number|undefined}
*/ /**
* The name of an easing function as defined on the `Math` object.
* @name Highcharts.AnimationOptionsObject#easing
* @type {string|Function|undefined}
*/ /**
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
 */ /**
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
 */ /**
* @name Highcharts.CSSObject#[key:string]
* @type {boolean|number|string|undefined}
*/ /**
* Background style for the element.
* @name Highcharts.CSSObject#background
* @type {string|undefined}
*/ /**
* Background color of the element.
* @name Highcharts.CSSObject#backgroundColor
* @type {Highcharts.ColorString|undefined}
*/ /**
* Border style for the element.
* @name Highcharts.CSSObject#border
* @type {string|undefined}
*/ /**
* Radius of the element border.
* @name Highcharts.CSSObject#borderRadius
* @type {number|undefined}
*/ /**
* Color used in the element. The 'contrast' option is a Highcharts custom
* property that results in black or white, depending on the background of the
* element.
* @name Highcharts.CSSObject#color
* @type {'contrast'|Highcharts.ColorString|undefined}
*/ /**
* Style of the mouse cursor when resting over the element.
* @name Highcharts.CSSObject#cursor
* @type {Highcharts.CursorValue|undefined}
*/ /**
* Font family of the element text. Multiple values have to be in decreasing
* preference order and separated by comma.
* @name Highcharts.CSSObject#fontFamily
* @type {string|undefined}
*/ /**
* Font size of the element text.
* @name Highcharts.CSSObject#fontSize
* @type {string|undefined}
*/ /**
* Font weight of the element text.
* @name Highcharts.CSSObject#fontWeight
* @type {string|undefined}
*/ /**
* Height of the element.
* @name Highcharts.CSSObject#height
* @type {number|undefined}
*/ /**
* Width of the element border.
* @name Highcharts.CSSObject#lineWidth
* @type {number|undefined}
*/ /**
* Opacity of the element.
* @name Highcharts.CSSObject#opacity
* @type {number|undefined}
*/ /**
* Space around the element content.
* @name Highcharts.CSSObject#padding
* @type {string|undefined}
*/ /**
* Behaviour of the element when the mouse cursor rests over it.
* @name Highcharts.CSSObject#pointerEvents
* @type {string|undefined}
*/ /**
* Positioning of the element.
* @name Highcharts.CSSObject#position
* @type {string|undefined}
*/ /**
* Alignment of the element text.
* @name Highcharts.CSSObject#textAlign
* @type {string|undefined}
*/ /**
* Additional decoration of the element text.
* @name Highcharts.CSSObject#textDecoration
* @type {string|undefined}
*/ /**
* Outline style of the element text.
* @name Highcharts.CSSObject#textOutline
* @type {string|undefined}
*/ /**
* Line break style of the element text. Highcharts SVG elements support
* `ellipsis` when a `width` is set.
* @name Highcharts.CSSObject#textOverflow
* @type {string|undefined}
*/ /**
* Top spacing of the element relative to the parent element.
* @name Highcharts.CSSObject#top
* @type {string|undefined}
*/ /**
* Animated transition of selected element properties.
* @name Highcharts.CSSObject#transition
* @type {string|undefined}
*/ /**
* Line break style of the element text.
* @name Highcharts.CSSObject#whiteSpace
* @type {string|undefined}
*/ /**
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
 */ /**
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
 */ /**
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
 */ /**
* Left distance to the page border.
* @name Highcharts.OffsetObject#left
* @type {number}
*/ /**
* Top distance to the page border.
* @name Highcharts.OffsetObject#top
* @type {number}
*/
/**
 * Describes a range.
 *
 * @interface Highcharts.RangeObject
 */ /**
* Maximum number of the range.
* @name Highcharts.RangeObject#max
* @type {number}
*/ /**
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
var charts = H.charts, doc = H.doc, win = H.win;
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
function error(code, stop, chart, params) {
    var severity = stop ? 'Highcharts error' : 'Highcharts warning';
    if (code === 32) {
        code = severity + ": Deprecated member";
    }
    var isCode = isNumber(code), message = isCode ?
        severity + " #" + code + ": www.highcharts.com/errors/" + code + "/" :
        code.toString(), defaultHandler = function () {
        if (stop) {
            throw new Error(message);
        }
        // else ...
        if (win.console &&
            error.messages.indexOf(message) === -1 // prevent console flooting
        ) {
            console.log(message); // eslint-disable-line no-console
        }
    };
    if (typeof params !== 'undefined') {
        var additionalMessages_1 = '';
        if (isCode) {
            message += '?';
        }
        objectEach(params, function (value, key) {
            additionalMessages_1 += "\n - " + key + ": " + value;
            if (isCode) {
                message += encodeURI(key) + '=' + encodeURI(value);
            }
        });
        message += additionalMessages_1;
    }
    if (chart) {
        fireEvent(chart, 'displayError', { code: code, message: message, params: params }, defaultHandler);
    }
    else {
        defaultHandler();
    }
    error.messages.push(message);
}
(function (error) {
    error.messages = [];
})(error || (error = {}));
H.error = error;
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
 */ /**
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
function merge() {
    /* eslint-enable valid-jsdoc */
    var i, args = arguments, len, ret = {}, doCopy = function (copy, original) {
        // An object is replacing a primitive
        if (typeof copy !== 'object') {
            copy = {};
        }
        objectEach(original, function (value, key) {
            // Copy the contents of objects, but not arrays or DOM nodes
            if (isObject(value, true) &&
                !isClass(value) &&
                !isDOMElement(value)) {
                copy[key] = doCopy(copy[key] || {}, value);
                // Primitives and arrays are copied over directly
            }
            else {
                copy[key] = original[key];
            }
        });
        return copy;
    };
    // If first argument is true, copy into the existing object. Used in
    // setOptions.
    if (args[0] === true) {
        ret = args[1];
        args = Array.prototype.slice.call(args, 2);
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
function clamp(value, min, max) {
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
var pInt = H.pInt = function pInt(s, mag) {
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
var isString = H.isString = function isString(s) {
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
var isArray = H.isArray = function isArray(obj) {
    var str = Object.prototype.toString.call(obj);
    return str === '[object Array]' || str === '[object Array Iterator]';
};
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
function isObject(obj, strict) {
    return (!!obj &&
        typeof obj === 'object' &&
        (!strict || !isArray(obj))); // eslint-disable-line @typescript-eslint/no-explicit-any
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
var isDOMElement = H.isDOMElement = function isDOMElement(obj) {
    return isObject(obj) && typeof obj.nodeType === 'number';
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
var isClass = H.isClass = function isClass(obj) {
    var c = obj && obj.constructor;
    return !!(isObject(obj, true) &&
        !isDOMElement(obj) &&
        (c && c.name && c.name !== 'Object'));
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
var isNumber = H.isNumber = function isNumber(n) {
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
var erase = H.erase = function erase(arr, item) {
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
var defined = H.defined = function defined(obj) {
    return typeof obj !== 'undefined' && obj !== null;
};
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
function attr(elem, prop, value) {
    var ret;
    // if the prop is a string
    if (isString(prop)) {
        // set the value
        if (defined(value)) {
            elem.setAttribute(prop, value);
            // get the value
        }
        else if (elem && elem.getAttribute) {
            ret = elem.getAttribute(prop);
            // IE7 and below cannot get class through getAttribute (#7850)
            if (!ret && prop === 'class') {
                ret = elem.getAttribute(prop + 'Name');
            }
        }
        // else if prop is defined, it is a hash of key/value pairs
    }
    else {
        objectEach(prop, function (val, key) {
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
var splat = H.splat = function splat(obj) {
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
var syncTimeout = H.syncTimeout = function syncTimeout(fn, delay, context) {
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
var internalClearTimeout = H.clearTimeout = function (id) {
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
var extend = H.extend = function extend(a, b) {
    /* eslint-enable valid-jsdoc */
    var n;
    if (!a) {
        a = {};
    }
    for (n in b) { // eslint-disable-line guard-for-in
        a[n] = b[n];
    }
    return a;
};
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
function pick() {
    var args = arguments;
    var length = args.length;
    for (var i = 0; i < length; i++) {
        var arg = args[i];
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
var css = H.css = function css(el, styles) {
    if (H.isMS && !H.svg) { // #2686
        if (styles && typeof styles.opacity !== 'undefined') {
            styles.filter =
                'alpha(opacity=' + (styles.opacity * 100) + ')';
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
var createElement = H.createElement = function createElement(tag, attribs, styles, parent, nopad) {
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
var extendClass = H.extendClass = function extendClass(parent, members) {
    var obj = (function () { });
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
var pad = H.pad = function pad(number, length, padder) {
    return new Array((length || 2) +
        1 -
        String(number)
            .replace('-', '')
            .length).join(padder || '0') + number;
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
var relativeLength = H.relativeLength = function relativeLength(value, base, offset) {
    return (/%$/).test(value) ?
        (base * parseFloat(value) / 100) + (offset || 0) :
        parseFloat(value);
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
var wrap = H.wrap = function wrap(obj, method, func) {
    var proceed = obj[method];
    obj[method] = function () {
        var args = Array.prototype.slice.call(arguments), outerArgs = arguments, ctx = this, ret;
        ctx.proceed = function () {
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
var format = H.format = function (str, ctx, chart) {
    var splitter = '{', isInside = false, segment, valueAndFormat, ret = [], val, index;
    var floatRegex = /f$/;
    var decRegex = /\.([0-9])/;
    var lang = H.defaultOptions.lang;
    var time = chart && chart.time || H.time;
    var numberFormatter = chart && chart.numberFormatter || numberFormat;
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
                    var decimals = parseInt((segment.match(decRegex) || ['', '-1'])[1], 10);
                    if (val !== null) {
                        val = numberFormatter(val, decimals, lang.decimalPoint, segment.indexOf(',') > -1 ? lang.thousandsSep : '');
                    }
                }
                else {
                    val = time.dateFormat(segment, val);
                }
            }
            // Push the result and advance the cursor
            ret.push(val);
        }
        else {
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
var getMagnitude = H.getMagnitude = function (num) {
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
var normalizeTickInterval = H.normalizeTickInterval = function (interval, multiples, magnitude, allowDecimals, hasTickAmount) {
    var normalized, i, retInterval = interval;
    // round to a tenfold of 1, 2, 2.5 or 5
    magnitude = pick(magnitude, 1);
    normalized = interval / magnitude;
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
                multiples = multiples.filter(function (num) {
                    return num % 1 === 0;
                });
            }
            else if (magnitude <= 0.1) {
                multiples = [1 / magnitude];
            }
        }
    }
    // normalize the interval to the nearest multiple
    for (i = 0; i < multiples.length; i++) {
        retInterval = multiples[i];
        // only allow tick amounts smaller than natural
        if ((hasTickAmount &&
            retInterval * magnitude >= interval) ||
            (!hasTickAmount &&
                (normalized <=
                    (multiples[i] +
                        (multiples[i + 1] || multiples[i])) / 2))) {
            break;
        }
    }
    // Multiply back to the correct magnitude. Correct floats to appropriate
    // precision (#6085).
    retInterval = correctFloat(retInterval * magnitude, -Math.round(Math.log(0.001) / Math.LN10));
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
var stableSort = H.stableSort = function stableSort(arr, sortFunction) {
    // @todo It seems like Chrome since v70 sorts in a stable way internally,
    // plus all other browsers do it, so over time we may be able to remove this
    // function
    var length = arr.length, sortValue, i;
    // Add index to each item
    for (i = 0; i < length; i++) {
        arr[i].safeI = i; // stable sort index
    }
    arr.sort(function (a, b) {
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
var arrayMin = H.arrayMin = function arrayMin(data) {
    var i = data.length, min = data[0];
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
var arrayMax = H.arrayMax = function arrayMax(data) {
    var i = data.length, max = data[0];
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
 */
var destroyObjectProperties = H.destroyObjectProperties =
    function destroyObjectProperties(obj, except) {
        objectEach(obj, function (val, n) {
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
 */
var discardElement = H.discardElement = function discardElement(element) {
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
var correctFloat = H.correctFloat = function correctFloat(num, prec) {
    return parseFloat(num.toPrecision(prec || 14));
};
/**
 * The time unit lookup
 *
 * @ignore
 */
var timeUnits = H.timeUnits = {
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
var numberFormat = H.numberFormat = function numberFormat(number, decimals, decimalPoint, thousandsSep) {
    number = +number || 0;
    decimals = +decimals;
    var lang = H.defaultOptions.lang, origDec = (number.toString().split('.')[1] || '').split('e')[0].length, strinteger, thousands, ret, roundedNumber, exponent = number.toString().split('e'), fractionDigits;
    if (decimals === -1) {
        // Preserve decimals. Not huge numbers (#3793).
        decimals = Math.min(origDec, 20);
    }
    else if (!isNumber(decimals)) {
        decimals = 2;
    }
    else if (decimals && exponent[1] && exponent[1] < 0) {
        // Expose decimals from exponential notation (#7042)
        fractionDigits = decimals + +exponent[1];
        if (fractionDigits >= 0) {
            // remove too small part of the number while keeping the notation
            exponent[0] = (+exponent[0]).toExponential(fractionDigits)
                .split('e')[0];
            decimals = fractionDigits;
        }
        else {
            // fractionDigits < 0
            exponent[0] = exponent[0].split('.')[0] || 0;
            if (decimals < 20) {
                // use number instead of exponential notation (#7405)
                number = (exponent[0] * Math.pow(10, exponent[1]))
                    .toFixed(decimals);
            }
            else {
                // or zero
                number = 0;
            }
            exponent[1] = 0;
        }
    }
    // Add another decimal to avoid rounding errors of float numbers. (#4573)
    // Then use toFixed to handle rounding.
    roundedNumber = (Math.abs(exponent[1] ? exponent[0] : number) +
        Math.pow(10, -Math.max(decimals, origDec) - 1)).toFixed(decimals);
    // A string containing the positive integer component of the number
    strinteger = String(pInt(roundedNumber));
    // Leftover after grouping into thousands. Can be 0, 1 or 2.
    thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;
    // Language
    decimalPoint = pick(decimalPoint, lang.decimalPoint);
    thousandsSep = pick(thousandsSep, lang.thousandsSep);
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
Math.easeInOutSine = function (pos) {
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
function getNestedProperty(path, obj) {
    if (!path) {
        return obj;
    }
    var pathElements = path.split('.').reverse();
    var subProperty = obj;
    if (pathElements.length === 1) {
        return subProperty[path];
    }
    var pathElement = pathElements.pop();
    while (typeof pathElement !== 'undefined' &&
        typeof subProperty !== 'undefined' &&
        subProperty !== null) {
        subProperty = subProperty[pathElement];
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
var getStyle = H.getStyle = function (el, prop, toInt) {
    var style;
    // For width and height, return the actual inner pixel size (#4913)
    if (prop === 'width') {
        var offsetWidth = Math.min(el.offsetWidth, el.scrollWidth);
        // In flex boxes, we need to use getBoundingClientRect and floor it,
        // because scrollWidth doesn't support subpixel precision (#6427) ...
        var boundingClientRectWidth = el.getBoundingClientRect &&
            el.getBoundingClientRect().width;
        // ...unless if the containing div or its parents are transform-scaled
        // down, in which case the boundingClientRect can't be used as it is
        // also scaled down (#9871, #10498).
        if (boundingClientRectWidth < offsetWidth &&
            boundingClientRectWidth >= offsetWidth - 1) {
            offsetWidth = Math.floor(boundingClientRectWidth);
        }
        return Math.max(0, // #8377
        (offsetWidth -
            H.getStyle(el, 'padding-left') -
            H.getStyle(el, 'padding-right')));
    }
    if (prop === 'height') {
        return Math.max(0, // #8377
        Math.min(el.offsetHeight, el.scrollHeight) -
            H.getStyle(el, 'padding-top') -
            H.getStyle(el, 'padding-bottom'));
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
var inArray = H.inArray = function (item, arr, fromIndex) {
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
var find = H.find = Array.prototype.find ?
    /* eslint-enable valid-jsdoc */
    function (arr, callback) {
        return arr.find(callback);
    } :
    // Legacy implementation. PhantomJS, IE <= 11 etc. #7223.
    function (arr, callback) {
        var i, length = arr.length;
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
H.keys = function (obj) {
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
var offset = H.offset = function offset(el) {
    var docElem = doc.documentElement, box = (el.parentElement || el.parentNode) ?
        el.getBoundingClientRect() :
        { top: 0, left: 0 };
    return {
        top: box.top + (win.pageYOffset || docElem.scrollTop) -
            (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) -
            (docElem.clientLeft || 0)
    };
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
var objectEach = H.objectEach = function objectEach(obj, fn, ctx) {
    /* eslint-enable valid-jsdoc */
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            fn.call(ctx || obj[key], obj[key], key, obj);
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
}, function (val, key) {
    H[key] = function (arr) {
        var _a;
        error(32, false, void 0, (_a = {}, _a["Highcharts." + key] = "use Array." + val, _a));
        return Array.prototype[val].apply(arr, [].slice.call(arguments, 1));
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
var addEvent = H.addEvent = function (el, type, fn, options) {
    if (options === void 0) { options = {}; }
    /* eslint-enable valid-jsdoc */
    var events, addEventListener = (el.addEventListener || H.addEventListenerPolyfill);
    // If we're setting events directly on the constructor, use a separate
    // collection, `protoEvents` to distinguish it from the item events in
    // `hcEvents`.
    if (typeof el === 'function' && el.prototype) {
        events = el.prototype.protoEvents = el.prototype.protoEvents || {};
    }
    else {
        events = el.hcEvents = el.hcEvents || {};
    }
    // Allow click events added to points, otherwise they will be prevented by
    // the TouchPointer.pinch function after a pinch zoom operation (#7091).
    if (H.Point &&
        el instanceof H.Point &&
        el.series &&
        el.series.chart) {
        el.series.chart.runTrackerClick = true;
    }
    // Handle DOM events
    if (addEventListener) {
        addEventListener.call(el, type, fn, false);
    }
    if (!events[type]) {
        events[type] = [];
    }
    var eventObject = {
        fn: fn,
        order: typeof options.order === 'number' ? options.order : Infinity
    };
    events[type].push(eventObject);
    // Order the calls
    events[type].sort(function (a, b) {
        return a.order - b.order;
    });
    // Return a function that can be called to remove this event.
    return function () {
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
var removeEvent = H.removeEvent = function removeEvent(el, type, fn) {
    /* eslint-enable valid-jsdoc */
    var events;
    /**
     * @private
     * @param {string} type - event type
     * @param {Highcharts.EventCallbackFunction<T>} fn - callback
     * @return {void}
     */
    function removeOneEvent(type, fn) {
        var removeEventListener = (el.removeEventListener || H.removeEventListenerPolyfill);
        if (removeEventListener) {
            removeEventListener.call(el, type, fn, false);
        }
    }
    /**
     * @private
     * @param {any} eventCollection - collection
     * @return {void}
     */
    function removeAllEvents(eventCollection) {
        var types, len;
        if (!el.nodeName) {
            return; // break on non-DOM events
        }
        if (type) {
            types = {};
            types[type] = true;
        }
        else {
            types = eventCollection;
        }
        objectEach(types, function (_val, n) {
            if (eventCollection[n]) {
                len = eventCollection[n].length;
                while (len--) {
                    removeOneEvent(n, eventCollection[n][len].fn);
                }
            }
        });
    }
    ['protoEvents', 'hcEvents'].forEach(function (coll, i) {
        var eventElem = i ? el : el.prototype;
        var eventCollection = eventElem && eventElem[coll];
        if (eventCollection) {
            if (type) {
                events = (eventCollection[type] || []);
                if (fn) {
                    eventCollection[type] = events.filter(function (obj) {
                        return fn !== obj.fn;
                    });
                    removeOneEvent(type, fn);
                }
                else {
                    removeAllEvents(eventCollection);
                    eventCollection[type] = [];
                }
            }
            else {
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
var fireEvent = H.fireEvent = function (el, type, eventArguments, defaultFunction) {
    /* eslint-enable valid-jsdoc */
    var e, i;
    eventArguments = eventArguments || {};
    if (doc.createEvent &&
        (el.dispatchEvent || el.fireEvent)) {
        e = doc.createEvent('Events');
        e.initEvent(type, true, true);
        extend(e, eventArguments);
        if (el.dispatchEvent) {
            el.dispatchEvent(e);
        }
        else {
            el.fireEvent(type, e);
        }
    }
    else {
        if (!eventArguments.target) {
            // We're running a custom event
            extend(eventArguments, {
                // Attach a simple preventDefault function to skip
                // default handler if called. The built-in
                // defaultPrevented property is not overwritable (#5112)
                preventDefault: function () {
                    eventArguments.defaultPrevented = true;
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
        var fireInOrder = function (protoEvents, hcEvents) {
            if (protoEvents === void 0) { protoEvents = []; }
            if (hcEvents === void 0) { hcEvents = []; }
            var iA = 0;
            var iB = 0;
            var length = protoEvents.length + hcEvents.length;
            for (i = 0; i < length; i++) {
                var obj = (!protoEvents[iA] ?
                    hcEvents[iB++] :
                    !hcEvents[iB] ?
                        protoEvents[iA++] :
                        protoEvents[iA].order <= hcEvents[iB].order ?
                            protoEvents[iA++] :
                            hcEvents[iB++]);
                // If the event handler return false, prevent the default
                // handler from executing
                if (obj.fn.call(el, eventArguments) === false) {
                    eventArguments.preventDefault();
                }
            }
        };
        fireInOrder(el.protoEvents && el.protoEvents[type], el.hcEvents && el.hcEvents[type]);
    }
    // Run the default if not prevented
    if (defaultFunction && !eventArguments.defaultPrevented) {
        defaultFunction.call(el, eventArguments);
    }
};
var serialMode;
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
var uniqueKey = H.uniqueKey = (function () {
    var hash = Math.random().toString(36).substring(2, 9) + '-';
    var id = 0;
    return function () {
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
var useSerialIds = H.useSerialIds = function (mode) {
    return (serialMode = pick(mode, serialMode));
};
var isFunction = H.isFunction = function (obj) {
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
var getOptions = H.getOptions = function () {
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
var setOptions = H.setOptions = function (options) {
    // Copy in the default options
    H.defaultOptions = merge(true, H.defaultOptions, options);
    // Update the time object
    if (options.time || options.global) {
        H.time.update(merge(H.defaultOptions.global, H.defaultOptions.time, options.global, options.time));
    }
    return H.defaultOptions;
};
// Register Highcharts as a plugin in jQuery
if (win.jQuery) {
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
     */ /**
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
    win.jQuery.fn.highcharts = function () {
        var args = [].slice.call(arguments);
        if (this[0]) { // this[0] is the renderTo div
            // Create the chart
            if (args[0]) {
                new H[ // eslint-disable-line computed-property-spacing, no-new
                // Constructor defaults to Chart
                isString(args[0]) ? args.shift() : 'Chart'](this[0], args[0], args[1]);
                return this;
            }
            // When called without parameters or with the return argument,
            // return an existing chart
            return charts[attr(this[0], 'data-highcharts-chart')];
        }
    };
}
// TODO use named exports when supported.
var utilitiesModule = {
    addEvent: addEvent,
    arrayMax: arrayMax,
    arrayMin: arrayMin,
    attr: attr,
    clamp: clamp,
    clearTimeout: internalClearTimeout,
    correctFloat: correctFloat,
    createElement: createElement,
    css: css,
    defined: defined,
    destroyObjectProperties: destroyObjectProperties,
    discardElement: discardElement,
    erase: erase,
    error: error,
    extend: extend,
    extendClass: extendClass,
    find: find,
    fireEvent: fireEvent,
    format: format,
    getMagnitude: getMagnitude,
    getNestedProperty: getNestedProperty,
    getOptions: getOptions,
    getStyle: getStyle,
    inArray: inArray,
    isArray: isArray,
    isClass: isClass,
    isDOMElement: isDOMElement,
    isFunction: isFunction,
    isNumber: isNumber,
    isObject: isObject,
    isString: isString,
    merge: merge,
    normalizeTickInterval: normalizeTickInterval,
    numberFormat: numberFormat,
    objectEach: objectEach,
    offset: offset,
    pad: pad,
    pick: pick,
    pInt: pInt,
    relativeLength: relativeLength,
    removeEvent: removeEvent,
    setOptions: setOptions,
    splat: splat,
    stableSort: stableSort,
    syncTimeout: syncTimeout,
    timeUnits: timeUnits,
    uniqueKey: uniqueKey,
    useSerialIds: useSerialIds,
    wrap: wrap
};
export default utilitiesModule;
