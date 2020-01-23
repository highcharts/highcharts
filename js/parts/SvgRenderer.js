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
 * The horizontal alignment of an element.
 *
 * @typedef {"center"|"left"|"right"} Highcharts.AlignValue
 */
/**
 * Options to align the element relative to the chart or another box.
 *
 * @interface Highcharts.AlignObject
 */ /**
* Horizontal alignment. Can be one of `left`, `center` and `right`.
*
* @name Highcharts.AlignObject#align
* @type {Highcharts.AlignValue|undefined}
*
* @default left
*/ /**
* Vertical alignment. Can be one of `top`, `middle` and `bottom`.
*
* @name Highcharts.AlignObject#verticalAlign
* @type {Highcharts.VerticalAlignValue|undefined}
*
* @default top
*/ /**
* Horizontal pixel offset from alignment.
*
* @name Highcharts.AlignObject#x
* @type {number|undefined}
*
* @default 0
*/ /**
* Vertical pixel offset from alignment.
*
* @name Highcharts.AlignObject#y
* @type {number|undefined}
*
* @default 0
*/ /**
* Use the `transform` attribute with translateX and translateY custom
* attributes to align this elements rather than `x` and `y` attributes.
*
* @name Highcharts.AlignObject#alignByTranslate
* @type {boolean|undefined}
*
* @default false
*/
/**
 * Bounding box of an element.
 *
 * @interface Highcharts.BBoxObject
 * @extends Highcharts.PositionObject
 */ /**
* Height of the bounding box.
*
* @name Highcharts.BBoxObject#height
* @type {number}
*/ /**
* Width of the bounding box.
*
* @name Highcharts.BBoxObject#width
* @type {number}
*/ /**
* Horizontal position of the bounding box.
*
* @name Highcharts.BBoxObject#x
* @type {number}
*/ /**
* Vertical position of the bounding box.
*
* @name Highcharts.BBoxObject#y
* @type {number}
*/
/**
 * A clipping rectangle that can be applied to one or more {@link SVGElement}
 * instances. It is instanciated with the {@link SVGRenderer#clipRect} function
 * and applied with the {@link SVGElement#clip} function.
 *
 * @example
 * var circle = renderer.circle(100, 100, 100)
 *     .attr({ fill: 'red' })
 *     .add();
 * var clipRect = renderer.clipRect(100, 100, 100, 100);
 *
 * // Leave only the lower right quarter visible
 * circle.clip(clipRect);
 *
 * @typedef {Highcharts.SVGElement} Highcharts.ClipRectElement
 */
/**
 * The font metrics.
 *
 * @interface Highcharts.FontMetricsObject
 */ /**
* The baseline relative to the top of the box.
*
* @name Highcharts.FontMetricsObject#b
* @type {number}
*/ /**
* The font size.
*
* @name Highcharts.FontMetricsObject#f
* @type {number}
*/ /**
* The line height.
*
* @name Highcharts.FontMetricsObject#h
* @type {number}
*/
/**
 * An object containing `x` and `y` properties for the position of an element.
 *
 * @interface Highcharts.PositionObject
 */ /**
* X position of the element.
* @name Highcharts.PositionObject#x
* @type {number}
*/ /**
* Y position of the element.
* @name Highcharts.PositionObject#y
* @type {number}
*/
/**
 * A rectangle.
 *
 * @interface Highcharts.RectangleObject
 */ /**
* Height of the rectangle.
* @name Highcharts.RectangleObject#height
* @type {number}
*/ /**
* Width of the rectangle.
* @name Highcharts.RectangleObject#width
* @type {number}
*/ /**
* Horizontal position of the rectangle.
* @name Highcharts.RectangleObject#x
* @type {number}
*/ /**
* Vertical position of the rectangle.
* @name Highcharts.RectangleObject#y
* @type {number}
*/
/**
 * The shadow options.
 *
 * @interface Highcharts.ShadowOptionsObject
 */ /**
* The shadow color.
* @name    Highcharts.ShadowOptionsObject#color
* @type    {Highcharts.ColorString|undefined}
* @default ${palette.neutralColor100}
*/ /**
* The horizontal offset from the element.
*
* @name    Highcharts.ShadowOptionsObject#offsetX
* @type    {number|undefined}
* @default 1
*/ /**
* The vertical offset from the element.
* @name    Highcharts.ShadowOptionsObject#offsetY
* @type    {number|undefined}
* @default 1
*/ /**
* The shadow opacity.
*
* @name    Highcharts.ShadowOptionsObject#opacity
* @type    {number|undefined}
* @default 0.15
*/ /**
* The shadow width or distance from the element.
* @name    Highcharts.ShadowOptionsObject#width
* @type    {number|undefined}
* @default 3
*/
/**
 * @interface Highcharts.SizeObject
 */ /**
* @name Highcharts.SizeObject#height
* @type {number}
*/ /**
* @name Highcharts.SizeObject#width
* @type {number}
*/
/**
 * An object of key-value pairs for SVG attributes. Attributes in Highcharts
 * elements for the most parts correspond to SVG, but some are specific to
 * Highcharts, like `zIndex`, `rotation`, `rotationOriginX`,
 * `rotationOriginY`, `translateX`, `translateY`, `scaleX` and `scaleY`. SVG
 * attributes containing a hyphen are _not_ camel-cased, they should be
 * quoted to preserve the hyphen.
 *
 * @example
 * {
 *     'stroke': '#ff0000', // basic
 *     'stroke-width': 2, // hyphenated
 *     'rotation': 45 // custom
 *     'd': ['M', 10, 10, 'L', 30, 30, 'z'] // path definition, note format
 * }
 *
 * @interface Highcharts.SVGAttributes
 */ /**
* @name Highcharts.SVGAttributes#[key:string]
* @type {*}
*/ /**
* @name Highcharts.SVGAttributes#d
* @type {string|Highcharts.SVGPathArray|undefined}
*/ /**
* @name Highcharts.SVGAttributes#fill
* @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
*/ /**
* @name Highcharts.SVGAttributes#inverted
* @type {boolean|undefined}
*/ /**
* @name Highcharts.SVGAttributes#matrix
* @type {Array<number>|undefined}
*/ /**
* @name Highcharts.SVGAttributes#rotation
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#rotationOriginX
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#rotationOriginY
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#scaleX
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#scaleY
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#stroke
* @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
*/ /**
* @name Highcharts.SVGAttributes#style
* @type {string|Highcharts.CSSObject|undefined}
*/ /**
* @name Highcharts.SVGAttributes#translateX
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#translateY
* @type {number|undefined}
*/ /**
* @name Highcharts.SVGAttributes#zIndex
* @type {number|undefined}
*/
/**
 * Serialized form of an SVG definition, including children. Some key
 * property names are reserved: tagName, textContent, and children.
 *
 * @interface Highcharts.SVGDefinitionObject
 */ /**
* @name Highcharts.SVGDefinitionObject#[key:string]
* @type {boolean|number|string|Array<Highcharts.SVGDefinitionObject>|undefined}
*/ /**
* @name Highcharts.SVGDefinitionObject#children
* @type {Array<Highcharts.SVGDefinitionObject>|undefined}
*/ /**
* @name Highcharts.SVGDefinitionObject#tagName
* @type {string|undefined}
*/ /**
* @name Highcharts.SVGDefinitionObject#textContent
* @type {string|undefined}
*/
/**
 * An SVG DOM element. The type is a reference to the regular SVGElement in the
 * global scope.
 *
 * @typedef {globals.GlobalSVGElement} Highcharts.SVGDOMElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */
/**
 * Array of path commands, that will go into the `d` attribute of an SVG
 * element.
 *
 * @typedef {Array<number|Highcharts.SVGPathCommand>} Highcharts.SVGPathArray
 */
/**
 * Possible path commands in a SVG path array.
 *
 * @typedef {string} Highcharts.SVGPathCommand
 * @validvalue ["a","c","h","l","m","q","s","t","v","z","A","C","H","L","M","Q","S","T","V","Z"]
 */
/**
 * An extendable collection of functions for defining symbol paths. Symbols are
 * used internally for point markers, button and label borders and backgrounds,
 * or custom shapes. Extendable by adding to {@link SVGRenderer#symbols}.
 *
 * @interface Highcharts.SymbolDictionary
 */ /**
* @name Highcharts.SymbolDictionary#[key:string]
* @type {Function|undefined}
*/ /**
* @name Highcharts.SymbolDictionary#arc
* @type {Function|undefined}
*/ /**
* @name Highcharts.SymbolDictionary#callout
* @type {Function|undefined}
*/ /**
* @name Highcharts.SymbolDictionary#circle
* @type {Function|undefined}
*/ /**
* @name Highcharts.SymbolDictionary#diamond
* @type {Function|undefined}
*/ /**
* @name Highcharts.SymbolDictionary#square
* @type {Function|undefined}
*/ /**
* @name Highcharts.SymbolDictionary#triangle
* @type {Function|undefined}
*/
/**
 * Can be one of `arc`, `callout`, `circle`, `diamond`, `square`, `triangle`,
 * and `triangle-down`. Symbols are used internally for point markers, button
 * and label borders and backgrounds, or custom shapes. Extendable by adding to
 * {@link SVGRenderer#symbols}.
 *
 * @typedef {"arc"|"callout"|"circle"|"diamond"|"square"|"triangle"|"triangle-down"} Highcharts.SymbolKeyValue
 */
/**
 * Additional options, depending on the actual symbol drawn.
 *
 * @interface Highcharts.SymbolOptionsObject
 */ /**
* The anchor X position for the `callout` symbol. This is where the chevron
* points to.
*
* @name Highcharts.SymbolOptionsObject#anchorX
* @type {number|undefined}
*/ /**
* The anchor Y position for the `callout` symbol. This is where the chevron
* points to.
*
* @name Highcharts.SymbolOptionsObject#anchorY
* @type {number|undefined}
*/ /**
* The end angle of an `arc` symbol.
*
* @name Highcharts.SymbolOptionsObject#end
* @type {number|undefined}
*/ /**
* Whether to draw `arc` symbol open or closed.
*
* @name Highcharts.SymbolOptionsObject#open
* @type {boolean|undefined}
*/ /**
* The radius of an `arc` symbol, or the border radius for the `callout` symbol.
*
* @name Highcharts.SymbolOptionsObject#r
* @type {number|undefined}
*/ /**
* The start angle of an `arc` symbol.
*
* @name Highcharts.SymbolOptionsObject#start
* @type {number|undefined}
*/
/**
 * The vertical alignment of an element.
 *
 * @typedef {"bottom"|"middle"|"top"} Highcharts.VerticalAlignValue
 */
/* eslint-disable no-invalid-this, valid-jsdoc */
import colorModule from './Color.js';
var color = colorModule.color;
import utilitiesModule from './Utilities.js';
var animObject = utilitiesModule.animObject, attr = utilitiesModule.attr, defined = utilitiesModule.defined, destroyObjectProperties = utilitiesModule.destroyObjectProperties, erase = utilitiesModule.erase, extend = utilitiesModule.extend, isArray = utilitiesModule.isArray, isNumber = utilitiesModule.isNumber, isObject = utilitiesModule.isObject, isString = utilitiesModule.isString, objectEach = utilitiesModule.objectEach, pick = utilitiesModule.pick, pInt = utilitiesModule.pInt, removeEvent = utilitiesModule.removeEvent, splat = utilitiesModule.splat;
var SVGElement, SVGRenderer, addEvent = H.addEvent, animate = H.animate, charts = H.charts, css = H.css, createElement = H.createElement, deg2rad = H.deg2rad, doc = H.doc, hasTouch = H.hasTouch, isFirefox = H.isFirefox, isMS = H.isMS, isWebKit = H.isWebKit, merge = H.merge, noop = H.noop, stop = H.stop, svg = H.svg, SVG_NS = H.SVG_NS, symbolSizes = H.symbolSizes, win = H.win;
/**
 * The SVGElement prototype is a JavaScript wrapper for SVG elements used in the
 * rendering layer of Highcharts. Combined with the {@link
 * Highcharts.SVGRenderer} object, these prototypes allow freeform annotation
 * in the charts or even in HTML pages without instanciating a chart. The
 * SVGElement can also wrap HTML labels, when `text` or `label` elements are
 * created with the `useHTML` parameter.
 *
 * The SVGElement instances are created through factory functions on the {@link
 * Highcharts.SVGRenderer} object, like {@link Highcharts.SVGRenderer#rect|
 * rect}, {@link Highcharts.SVGRenderer#path|path}, {@link
 * Highcharts.SVGRenderer#text|text}, {@link Highcharts.SVGRenderer#label|
 * label}, {@link Highcharts.SVGRenderer#g|g} and more.
 *
 * @class
 * @name Highcharts.SVGElement
 */
SVGElement = H.SVGElement = function () {
    return this;
};
extend(SVGElement.prototype, /** @lends Highcharts.SVGElement.prototype */ {
    // Default base for animation
    opacity: 1,
    SVG_NS: SVG_NS,
    /**
     * For labels, these CSS properties are applied to the `text` node directly.
     *
     * @private
     * @name Highcharts.SVGElement#textProps
     * @type {Array<string>}
     */
    textProps: ['direction', 'fontSize', 'fontWeight', 'fontFamily',
        'fontStyle', 'color', 'lineHeight', 'width', 'textAlign',
        'textDecoration', 'textOverflow', 'textOutline', 'cursor'],
    /**
     * Initialize the SVG element. This function only exists to make the
     * initialization process overridable. It should not be called directly.
     *
     * @function Highcharts.SVGElement#init
     *
     * @param {Highcharts.SVGRenderer} renderer
     *        The SVGRenderer instance to initialize to.
     *
     * @param {string} nodeName
     *        The SVG node name.
     *
     * @return {void}
     */
    init: function (renderer, nodeName) {
        /**
         * The primary DOM node. Each `SVGElement` instance wraps a main DOM
         * node, but may also represent more nodes.
         *
         * @name Highcharts.SVGElement#element
         * @type {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement}
         */
        this.element = nodeName === 'span' ?
            createElement(nodeName) :
            doc.createElementNS(this.SVG_NS, nodeName);
        /**
         * The renderer that the SVGElement belongs to.
         *
         * @name Highcharts.SVGElement#renderer
         * @type {Highcharts.SVGRenderer}
         */
        this.renderer = renderer;
        H.fireEvent(this, 'afterInit');
    },
    /**
     * Animate to given attributes or CSS properties.
     *
     * @sample highcharts/members/element-on/
     *         Setting some attributes by animation
     *
     * @function Highcharts.SVGElement#animate
     *
     * @param {Highcharts.SVGAttributes} params
     *        SVG attributes or CSS to animate.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [options]
     *        Animation options.
     *
     * @param {Function} [complete]
     *        Function to perform at the end of animation.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    animate: function (params, options, complete) {
        var animOptions = animObject(pick(options, this.renderer.globalAnimation, true));
        // When the page is hidden save resources in the background by not
        // running animation at all (#9749).
        if (pick(doc.hidden, doc.msHidden, doc.webkitHidden, false)) {
            animOptions.duration = 0;
        }
        if (animOptions.duration !== 0) {
            // allows using a callback with the global animation without
            // overwriting it
            if (complete) {
                animOptions.complete = complete;
            }
            animate(this, params, animOptions);
        }
        else {
            this.attr(params, void 0, complete);
            // Call the end step synchronously
            objectEach(params, function (val, prop) {
                if (animOptions.step) {
                    animOptions.step.call(this, val, { prop: prop, pos: 1 });
                }
            }, this);
        }
        return this;
    },
    /**
     * Build and apply an SVG gradient out of a common JavaScript configuration
     * object. This function is called from the attribute setters. An event
     * hook is added for supporting other complex color types.
     *
     * @private
     * @function Highcharts.SVGElement#complexColor
     *
     * @param {Highcharts.GradientColorObject} colorOptions
     *        The gradient options structure.
     *
     * @param {string} prop
     *        The property to apply, can either be `fill` or `stroke`.
     *
     * @param {Highcharts.SVGDOMElement} elem
     *        SVG element to apply the gradient on.
     *
     * @return {void}
     */
    complexColor: function (colorOptions, prop, elem) {
        var renderer = this.renderer, colorObject, gradName, gradAttr, radAttr, gradients, gradientObject, stops, stopColor, stopOpacity, radialReference, id, key = [], value;
        H.fireEvent(this.renderer, 'complexColor', {
            args: arguments
        }, function () {
            // Apply linear or radial gradients
            if (colorOptions.radialGradient) {
                gradName = 'radialGradient';
            }
            else if (colorOptions.linearGradient) {
                gradName = 'linearGradient';
            }
            if (gradName) {
                gradAttr = colorOptions[gradName];
                gradients = renderer.gradients;
                stops = colorOptions.stops;
                radialReference = elem.radialReference;
                // Keep < 2.2 kompatibility
                if (isArray(gradAttr)) {
                    colorOptions[gradName] = gradAttr = {
                        x1: gradAttr[0],
                        y1: gradAttr[1],
                        x2: gradAttr[2],
                        y2: gradAttr[3],
                        gradientUnits: 'userSpaceOnUse'
                    };
                }
                // Correct the radial gradient for the radial reference system
                if (gradName === 'radialGradient' &&
                    radialReference &&
                    !defined(gradAttr.gradientUnits)) {
                    // Save the radial attributes for updating
                    radAttr = gradAttr;
                    gradAttr = merge(gradAttr, renderer.getRadialAttr(radialReference, radAttr), { gradientUnits: 'userSpaceOnUse' });
                }
                // Build the unique key to detect whether we need to create a
                // new element (#1282)
                objectEach(gradAttr, function (val, n) {
                    if (n !== 'id') {
                        key.push(n, val);
                    }
                });
                objectEach(stops, function (val) {
                    key.push(val);
                });
                key = key.join(',');
                // Check if a gradient object with the same config object is
                // created within this renderer
                if (gradients[key]) {
                    id = gradients[key].attr('id');
                }
                else {
                    // Set the id and create the element
                    gradAttr.id = id = H.uniqueKey();
                    gradients[key] = gradientObject =
                        renderer.createElement(gradName)
                            .attr(gradAttr)
                            .add(renderer.defs);
                    gradientObject.radAttr = radAttr;
                    // The gradient needs to keep a list of stops to be able to
                    // destroy them
                    gradientObject.stops = [];
                    stops.forEach(function (stop) {
                        var stopObject;
                        if (stop[1].indexOf('rgba') === 0) {
                            colorObject = color(stop[1]);
                            stopColor = colorObject.get('rgb');
                            stopOpacity = colorObject.get('a');
                        }
                        else {
                            stopColor = stop[1];
                            stopOpacity = 1;
                        }
                        stopObject = renderer.createElement('stop').attr({
                            offset: stop[0],
                            'stop-color': stopColor,
                            'stop-opacity': stopOpacity
                        }).add(gradientObject);
                        // Add the stop element to the gradient
                        gradientObject.stops.push(stopObject);
                    });
                }
                // Set the reference to the gradient object
                value = 'url(' + renderer.url + '#' + id + ')';
                elem.setAttribute(prop, value);
                elem.gradient = key;
                // Allow the color to be concatenated into tooltips formatters
                // etc. (#2995)
                colorOptions.toString = function () {
                    return value;
                };
            }
        });
    },
    /**
     * Apply a text outline through a custom CSS property, by copying the text
     * element and apply stroke to the copy. Used internally. Contrast checks at
     * [example](https://jsfiddle.net/highcharts/43soe9m1/2/).
     *
     * @example
     * // Specific color
     * text.css({
     *    textOutline: '1px black'
     * });
     * // Automatic contrast
     * text.css({
     *    color: '#000000', // black text
     *    textOutline: '1px contrast' // => white outline
     * });
     *
     * @private
     * @function Highcharts.SVGElement#applyTextOutline
     *
     * @param {string} textOutline
     *        A custom CSS `text-outline` setting, defined by `width color`.
     *
     * @return {void}
     */
    applyTextOutline: function (textOutline) {
        var elem = this.element, tspans, hasContrast = textOutline.indexOf('contrast') !== -1, styles = {}, color, strokeWidth, firstRealChild;
        // When the text shadow is set to contrast, use dark stroke for light
        // text and vice versa.
        if (hasContrast) {
            styles.textOutline = textOutline = textOutline.replace(/contrast/g, this.renderer.getContrast(elem.style.fill));
        }
        // Extract the stroke width and color
        textOutline = textOutline.split(' ');
        color = textOutline[textOutline.length - 1];
        strokeWidth = textOutline[0];
        if (strokeWidth && strokeWidth !== 'none' && H.svg) {
            this.fakeTS = true; // Fake text shadow
            tspans = [].slice.call(elem.getElementsByTagName('tspan'));
            // In order to get the right y position of the clone,
            // copy over the y setter
            this.ySetter = this.xSetter;
            // Since the stroke is applied on center of the actual outline, we
            // need to double it to get the correct stroke-width outside the
            // glyphs.
            strokeWidth = strokeWidth.replace(/(^[\d\.]+)(.*?)$/g, function (match, digit, unit) {
                return (2 * digit) + unit;
            });
            // Remove shadows from previous runs.
            this.removeTextOutline(tspans);
            // For each of the tspans, create a stroked copy behind it.
            firstRealChild = elem.firstChild;
            tspans.forEach(function (tspan, y) {
                var clone;
                // Let the first line start at the correct X position
                if (y === 0) {
                    tspan.setAttribute('x', elem.getAttribute('x'));
                    y = elem.getAttribute('y');
                    tspan.setAttribute('y', y || 0);
                    if (y === null) {
                        elem.setAttribute('y', 0);
                    }
                }
                // Create the clone and apply outline properties
                clone = tspan.cloneNode(1);
                attr(clone, {
                    'class': 'highcharts-text-outline',
                    fill: color,
                    stroke: color,
                    'stroke-width': strokeWidth,
                    'stroke-linejoin': 'round'
                });
                elem.insertBefore(clone, firstRealChild);
            });
        }
    },
    /**
     * @private
     * @param {Array<Highcharts.SVGDOMElement>} tspans - text spans
     * @return {void}
     */
    removeTextOutline: function (tspans) {
        // Iterate from the end to
        // support removing items inside the cycle (#6472).
        var i = tspans.length, tspan;
        while (i--) {
            tspan = tspans[i];
            if (tspan.getAttribute('class') === 'highcharts-text-outline') {
                // Remove then erase
                erase(tspans, this.element.removeChild(tspan));
            }
        }
    },
    // Custom attributes used for symbols, these should be filtered out when
    // setting SVGElement attributes (#9375).
    symbolCustomAttribs: [
        'x',
        'y',
        'width',
        'height',
        'r',
        'start',
        'end',
        'innerR',
        'anchorX',
        'anchorY',
        'rounded'
    ],
    /**
     * @function Highcharts.SVGElement#attr
     *
     * @param {string} hash
     *
     * @return {Highcharts.SVGElement}
     */ /**
    * Apply native and custom attributes to the SVG elements.
    *
    * In order to set the rotation center for rotation, set x and y to 0 and
    * use `translateX` and `translateY` attributes to position the element
    * instead.
    *
    * Attributes frequently used in Highcharts are `fill`, `stroke`,
    * `stroke-width`.
    *
    * @sample highcharts/members/renderer-rect/
    *         Setting some attributes
    *
    * @example
    * // Set multiple attributes
    * element.attr({
    *     stroke: 'red',
    *     fill: 'blue',
    *     x: 10,
    *     y: 10
    * });
    *
    * // Set a single attribute
    * element.attr('stroke', 'red');
    *
    * // Get an attribute
    * element.attr('stroke'); // => 'red'
    *
    * @function Highcharts.SVGElement#attr
    *
    * @param {string|Highcharts.SVGAttributes} [hash]
    *        The native and custom SVG attributes.
    *
    * @param {number|string|Highcharts.SVGPathArray} [val]
    *        If the type of the first argument is `string`, the second can be a
    *        value, which will serve as a single attribute setter. If the first
    *        argument is a string and the second is undefined, the function
    *        serves as a getter and the current value of the property is
    *        returned.
    *
    * @param {Function} [complete]
    *        A callback function to execute after setting the attributes. This
    *        makes the function compliant and interchangeable with the
    *        {@link SVGElement#animate} function.
    *
    * @param {boolean} [continueAnimation=true]
    *        Used internally when `.attr` is called as part of an animation
    *        step. Otherwise, calling `.attr` for an attribute will stop
    *        animation for that attribute.
    *
    * @return {Highcharts.SVGElement}
    *         If used as a setter, it returns the current
    *         {@link Highcharts.SVGElement} so the calls can be chained. If
    *         used as a getter, the current value of the attribute is returned.
    */
    attr: function (hash, val, complete, continueAnimation) {
        var key, element = this.element, hasSetSymbolSize, ret = this, skipAttr, setter, symbolCustomAttribs = this.symbolCustomAttribs;
        // single key-value pair
        if (typeof hash === 'string' && typeof val !== 'undefined') {
            key = hash;
            hash = {};
            hash[key] = val;
        }
        // used as a getter: first argument is a string, second is undefined
        if (typeof hash === 'string') {
            ret = (this[hash + 'Getter'] || this._defaultGetter).call(this, hash, element);
            // setter
        }
        else {
            objectEach(hash, function eachAttribute(val, key) {
                skipAttr = false;
                // Unless .attr is from the animator update, stop current
                // running animation of this property
                if (!continueAnimation) {
                    stop(this, key);
                }
                // Special handling of symbol attributes
                if (this.symbolName &&
                    H.inArray(key, symbolCustomAttribs) !== -1) {
                    if (!hasSetSymbolSize) {
                        this.symbolAttr(hash);
                        hasSetSymbolSize = true;
                    }
                    skipAttr = true;
                }
                if (this.rotation && (key === 'x' || key === 'y')) {
                    this.doTransform = true;
                }
                if (!skipAttr) {
                    setter = this[key + 'Setter'] || this._defaultSetter;
                    setter.call(this, val, key, element);
                    // Let the shadow follow the main element
                    if (!this.styledMode &&
                        this.shadows &&
                        /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/
                            .test(key)) {
                        this.updateShadows(key, val, setter);
                    }
                }
            }, this);
            this.afterSetters();
        }
        // In accordance with animate, run a complete callback
        if (complete) {
            complete.call(this);
        }
        return ret;
    },
    /**
     * This method is executed in the end of `attr()`, after setting all
     * attributes in the hash. In can be used to efficiently consolidate
     * multiple attributes in one SVG property -- e.g., translate, rotate and
     * scale are merged in one "transform" attribute in the SVG node.
     *
     * @private
     * @function Highcharts.SVGElement#afterSetters
     *
     * @return {void}
     */
    afterSetters: function () {
        // Update transform. Do this outside the loop to prevent redundant
        // updating for batch setting of attributes.
        if (this.doTransform) {
            this.updateTransform();
            this.doTransform = false;
        }
    },
    /**
     * Update the shadow elements with new attributes.
     *
     * @private
     * @function Highcharts.SVGElement#updateShadows
     *
     * @param {string} key
     *        The attribute name.
     *
     * @param {number} value
     *        The value of the attribute.
     *
     * @param {Function} setter
     *        The setter function, inherited from the parent wrapper.
     *
     * @return {void}
     */
    updateShadows: function (key, value, setter) {
        var shadows = this.shadows, i = shadows.length;
        while (i--) {
            setter.call(shadows[i], key === 'height' ?
                Math.max(value - (shadows[i].cutHeight || 0), 0) :
                key === 'd' ? this.d : value, key, shadows[i]);
        }
    },
    /**
     * Add a class name to an element.
     *
     * @function Highcharts.SVGElement#addClass
     *
     * @param {string} className
     *        The new class name to add.
     *
     * @param {boolean} [replace=false]
     *        When true, the existing class name(s) will be overwritten with
     *        the new one. When false, the new one is added.
     *
     * @return {Highcharts.SVGElement}
     *         Return the SVG element for chainability.
     */
    addClass: function (className, replace) {
        var currentClassName = replace ? '' : (this.attr('class') || '');
        // Trim the string and remove duplicates
        className = (className || '')
            .split(/ /g)
            .reduce(function (newClassName, name) {
            if (currentClassName.indexOf(name) === -1) {
                newClassName.push(name);
            }
            return newClassName;
        }, (currentClassName ?
            [currentClassName] :
            []))
            .join(' ');
        if (className !== currentClassName) {
            this.attr('class', className);
        }
        return this;
    },
    /**
     * Check if an element has the given class name.
     *
     * @function Highcharts.SVGElement#hasClass
     *
     * @param {string} className
     *        The class name to check for.
     *
     * @return {boolean}
     *         Whether the class name is found.
     */
    hasClass: function (className) {
        return (this.attr('class') || '')
            .split(' ')
            .indexOf(className) !== -1;
    },
    /**
     * Remove a class name from the element.
     *
     * @function Highcharts.SVGElement#removeClass
     *
     * @param {string|RegExp} className
     *        The class name to remove.
     *
     * @return {Highcharts.SVGElement} Returns the SVG element for chainability.
     */
    removeClass: function (className) {
        return this.attr('class', (this.attr('class') || '').replace(isString(className) ?
            new RegExp(" ?" + className + " ?") : // #12064
            className, ''));
    },
    /**
     * If one of the symbol size affecting parameters are changed,
     * check all the others only once for each call to an element's
     * .attr() method
     *
     * @private
     * @function Highcharts.SVGElement#symbolAttr
     *
     * @param {Highcharts.SVGAttributes} hash
     *        The attributes to set.
     *
     * @return {void}
     */
    symbolAttr: function (hash) {
        var wrapper = this;
        [
            'x',
            'y',
            'r',
            'start',
            'end',
            'width',
            'height',
            'innerR',
            'anchorX',
            'anchorY',
            'clockwise'
        ].forEach(function (key) {
            wrapper[key] = pick(hash[key], wrapper[key]);
        });
        wrapper.attr({
            d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.width, wrapper.height, wrapper)
        });
    },
    /**
     * Apply a clipping rectangle to this element.
     *
     * @function Highcharts.SVGElement#clip
     *
     * @param {Highcharts.ClipRectElement} [clipRect]
     *        The clipping rectangle. If skipped, the current clip is removed.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVG element to allow chaining.
     */
    clip: function (clipRect) {
        return this.attr('clip-path', clipRect ?
            'url(' + this.renderer.url + '#' + clipRect.id + ')' :
            'none');
    },
    /**
     * Calculate the coordinates needed for drawing a rectangle crisply and
     * return the calculated attributes.
     *
     * @function Highcharts.SVGElement#crisp
     *
     * @param {Highcharts.RectangleObject} rect
     *        Rectangle to crisp.
     *
     * @param {number} [strokeWidth]
     *        The stroke width to consider when computing crisp positioning. It
     *        can also be set directly on the rect parameter.
     *
     * @return {Highcharts.RectangleObject}
     *         The modified rectangle arguments.
     */
    crisp: function (rect, strokeWidth) {
        var wrapper = this, normalizer;
        strokeWidth = strokeWidth || rect.strokeWidth || 0;
        // Math.round because strokeWidth can sometimes have roundoff errors
        normalizer = Math.round(strokeWidth) % 2 / 2;
        // normalize for crisp edges
        rect.x = Math.floor(rect.x || wrapper.x || 0) + normalizer;
        rect.y = Math.floor(rect.y || wrapper.y || 0) + normalizer;
        rect.width = Math.floor((rect.width || wrapper.width || 0) - 2 * normalizer);
        rect.height = Math.floor((rect.height || wrapper.height || 0) - 2 * normalizer);
        if (defined(rect.strokeWidth)) {
            rect.strokeWidth = strokeWidth;
        }
        return rect;
    },
    /**
     * Set styles for the element. In addition to CSS styles supported by
     * native SVG and HTML elements, there are also some custom made for
     * Highcharts, like `width`, `ellipsis` and `textOverflow` for SVG text
     * elements.
     *
     * @sample highcharts/members/renderer-text-on-chart/
     *         Styled text
     *
     * @function Highcharts.SVGElement#css
     *
     * @param {Highcharts.CSSObject} styles
     *        The new CSS styles.
     *
     * @return {Highcharts.SVGElement}
     *         Return the SVG element for chaining.
     */
    css: function (styles) {
        var oldStyles = this.styles, newStyles = {}, elem = this.element, textWidth, serializedCss = '', hyphenate, hasNew = !oldStyles, 
        // These CSS properties are interpreted internally by the SVG
        // renderer, but are not supported by SVG and should not be added to
        // the DOM. In styled mode, no CSS should find its way to the DOM
        // whatsoever (#6173, #6474).
        svgPseudoProps = ['textOutline', 'textOverflow', 'width'];
        // convert legacy
        if (styles && styles.color) {
            styles.fill = styles.color;
        }
        // Filter out existing styles to increase performance (#2640)
        if (oldStyles) {
            objectEach(styles, function (style, n) {
                if (style !== oldStyles[n]) {
                    newStyles[n] = style;
                    hasNew = true;
                }
            });
        }
        if (hasNew) {
            // Merge the new styles with the old ones
            if (oldStyles) {
                styles = extend(oldStyles, newStyles);
            }
            // Get the text width from style
            if (styles) {
                // Previously set, unset it (#8234)
                if (styles.width === null || styles.width === 'auto') {
                    delete this.textWidth;
                    // Apply new
                }
                else if (elem.nodeName.toLowerCase() === 'text' &&
                    styles.width) {
                    textWidth = this.textWidth = pInt(styles.width);
                }
            }
            // store object
            this.styles = styles;
            if (textWidth && (!svg && this.renderer.forExport)) {
                delete styles.width;
            }
            // Serialize and set style attribute
            if (elem.namespaceURI === this.SVG_NS) { // #7633
                hyphenate = function (a, b) {
                    return '-' + b.toLowerCase();
                };
                objectEach(styles, function (style, n) {
                    if (svgPseudoProps.indexOf(n) === -1) {
                        serializedCss +=
                            n.replace(/([A-Z])/g, hyphenate) + ':' +
                                style + ';';
                    }
                });
                if (serializedCss) {
                    attr(elem, 'style', serializedCss); // #1881
                }
            }
            else {
                css(elem, styles);
            }
            if (this.added) {
                // Rebuild text after added. Cache mechanisms in the buildText
                // will prevent building if there are no significant changes.
                if (this.element.nodeName === 'text') {
                    this.renderer.buildText(this);
                }
                // Apply text outline after added
                if (styles && styles.textOutline) {
                    this.applyTextOutline(styles.textOutline);
                }
            }
        }
        return this;
    },
    /**
     * Get the computed style. Only in styled mode.
     *
     * @example
     * chart.series[0].points[0].graphic.getStyle('stroke-width'); // => '1px'
     *
     * @function Highcharts.SVGElement#getStyle
     *
     * @param {string} prop
     *        The property name to check for.
     *
     * @return {string}
     *         The current computed value.
     */
    getStyle: function (prop) {
        return win.getComputedStyle(this.element || this, '')
            .getPropertyValue(prop);
    },
    /**
     * Get the computed stroke width in pixel values. This is used extensively
     * when drawing shapes to ensure the shapes are rendered crisp and
     * positioned correctly relative to each other. Using
     * `shape-rendering: crispEdges` leaves us less control over positioning,
     * for example when we want to stack columns next to each other, or position
     * things pixel-perfectly within the plot box.
     *
     * The common pattern when placing a shape is:
     * - Create the SVGElement and add it to the DOM. In styled mode, it will
     *   now receive a stroke width from the style sheet. In classic mode we
     *   will add the `stroke-width` attribute.
     * - Read the computed `elem.strokeWidth()`.
     * - Place it based on the stroke width.
     *
     * @function Highcharts.SVGElement#strokeWidth
     *
     * @return {number}
     *         The stroke width in pixels. Even if the given stroke widtch (in
     *         CSS or by attributes) is based on `em` or other units, the pixel
     *         size is returned.
     */
    strokeWidth: function () {
        // In non-styled mode, read the stroke width as set by .attr
        if (!this.renderer.styledMode) {
            return this['stroke-width'] || 0;
        }
        // In styled mode, read computed stroke width
        var val = this.getStyle('stroke-width'), ret = 0, dummy;
        // Read pixel values directly
        if (val.indexOf('px') === val.length - 2) {
            ret = pInt(val);
            // Other values like em, pt etc need to be measured
        }
        else if (val !== '') {
            dummy = doc.createElementNS(SVG_NS, 'rect');
            attr(dummy, {
                width: val,
                'stroke-width': 0
            });
            this.element.parentNode.appendChild(dummy);
            ret = dummy.getBBox().width;
            dummy.parentNode.removeChild(dummy);
        }
        return ret;
    },
    /**
     * Add an event listener. This is a simple setter that replaces all other
     * events of the same type, opposed to the {@link Highcharts#addEvent}
     * function.
     *
     * @sample highcharts/members/element-on/
     *         A clickable rectangle
     *
     * @function Highcharts.SVGElement#on
     *
     * @param {string} eventType
     *        The event type. If the type is `click`, Highcharts will internally
     *        translate it to a `touchstart` event on touch devices, to prevent
     *        the browser from waiting for a click event from firing.
     *
     * @param {Function} handler
     *        The handler callback.
     *
     * @return {Highcharts.SVGElement}
     *         The SVGElement for chaining.
     */
    on: function (eventType, handler) {
        var svgElement = this, element = svgElement.element;
        // touch
        if (hasTouch && eventType === 'click') {
            element.ontouchstart = function (e) {
                svgElement.touchEventFired = Date.now(); // #2269
                e.preventDefault();
                handler.call(element, e);
            };
            element.onclick = function (e) {
                if (win.navigator.userAgent.indexOf('Android') === -1 ||
                    Date.now() - (svgElement.touchEventFired || 0) > 1100) {
                    handler.call(element, e);
                }
            };
        }
        else {
            // simplest possible event model for internal use
            element['on' + eventType] = handler;
        }
        return this;
    },
    /**
     * Set the coordinates needed to draw a consistent radial gradient across
     * a shape regardless of positioning inside the chart. Used on pie slices
     * to make all the slices have the same radial reference point.
     *
     * @function Highcharts.SVGElement#setRadialReference
     *
     * @param {Array<number>} coordinates
     *        The center reference. The format is `[centerX, centerY, diameter]`
     *        in pixels.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    setRadialReference: function (coordinates) {
        var existingGradient = this.renderer.gradients[this.element.gradient];
        this.element.radialReference = coordinates;
        // On redrawing objects with an existing gradient, the gradient needs
        // to be repositioned (#3801)
        if (existingGradient && existingGradient.radAttr) {
            existingGradient.animate(this.renderer.getRadialAttr(coordinates, existingGradient.radAttr));
        }
        return this;
    },
    /**
     * Move an object and its children by x and y values.
     *
     * @function Highcharts.SVGElement#translate
     *
     * @param {number} x
     *        The x value.
     *
     * @param {number} y
     *        The y value.
     *
     * @return {Highcharts.SVGElement}
     */
    translate: function (x, y) {
        return this.attr({
            translateX: x,
            translateY: y
        });
    },
    /**
     * Invert a group, rotate and flip. This is used internally on inverted
     * charts, where the points and graphs are drawn as if not inverted, then
     * the series group elements are inverted.
     *
     * @function Highcharts.SVGElement#invert
     *
     * @param {boolean} inverted
     *        Whether to invert or not. An inverted shape can be un-inverted by
     *        setting it to false.
     *
     * @return {Highcharts.SVGElement}
     *         Return the SVGElement for chaining.
     */
    invert: function (inverted) {
        var wrapper = this;
        wrapper.inverted = inverted;
        wrapper.updateTransform();
        return wrapper;
    },
    /**
     * Update the transform attribute based on internal properties. Deals with
     * the custom `translateX`, `translateY`, `rotation`, `scaleX` and `scaleY`
     * attributes and updates the SVG `transform` attribute.
     *
     * @private
     * @function Highcharts.SVGElement#updateTransform
     *
     * @return {void}
     */
    updateTransform: function () {
        var wrapper = this, translateX = wrapper.translateX || 0, translateY = wrapper.translateY || 0, scaleX = wrapper.scaleX, scaleY = wrapper.scaleY, inverted = wrapper.inverted, rotation = wrapper.rotation, matrix = wrapper.matrix, element = wrapper.element, transform;
        // Flipping affects translate as adjustment for flipping around the
        // group's axis
        if (inverted) {
            translateX += wrapper.width;
            translateY += wrapper.height;
        }
        // Apply translate. Nearly all transformed elements have translation,
        // so instead of checking for translate = 0, do it always (#1767,
        // #1846).
        transform = ['translate(' + translateX + ',' + translateY + ')'];
        // apply matrix
        if (defined(matrix)) {
            transform.push('matrix(' + matrix.join(',') + ')');
        }
        // apply rotation
        if (inverted) {
            transform.push('rotate(90) scale(-1,1)');
        }
        else if (rotation) { // text rotation
            transform.push('rotate(' + rotation + ' ' +
                pick(this.rotationOriginX, element.getAttribute('x'), 0) +
                ' ' +
                pick(this.rotationOriginY, element.getAttribute('y') || 0) + ')');
        }
        // apply scale
        if (defined(scaleX) || defined(scaleY)) {
            transform.push('scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')');
        }
        if (transform.length) {
            element.setAttribute('transform', transform.join(' '));
        }
    },
    /**
     * Bring the element to the front. Alternatively, a new zIndex can be set.
     *
     * @sample highcharts/members/element-tofront/
     *         Click an element to bring it to front
     *
     * @function Highcharts.SVGElement#toFront
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    toFront: function () {
        var element = this.element;
        element.parentNode.appendChild(element);
        return this;
    },
    /**
     * Align the element relative to the chart or another box.
     *
     * @function Highcharts.SVGElement#align
     *
     * @param {Highcharts.AlignObject} [alignOptions]
     *        The alignment options. The function can be called without this
     *        parameter in order to re-align an element after the box has been
     *        updated.
     *
     * @param {boolean} [alignByTranslate]
     *        Align element by translation.
     *
     * @param {string|Highcharts.BBoxObject} [box]
     *        The box to align to, needs a width and height. When the box is a
     *        string, it refers to an object in the Renderer. For example, when
     *        box is `spacingBox`, it refers to `Renderer.spacingBox` which
     *        holds `width`, `height`, `x` and `y` properties.
     *
     * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
     */
    align: function (alignOptions, alignByTranslate, box) {
        var align, vAlign, x, y, attribs = {}, alignTo, renderer = this.renderer, alignedObjects = renderer.alignedObjects, alignFactor, vAlignFactor;
        // First call on instanciate
        if (alignOptions) {
            this.alignOptions = alignOptions;
            this.alignByTranslate = alignByTranslate;
            if (!box || isString(box)) {
                this.alignTo = alignTo = box || 'renderer';
                // prevent duplicates, like legendGroup after resize
                erase(alignedObjects, this);
                alignedObjects.push(this);
                box = null; // reassign it below
            }
            // When called on resize, no arguments are supplied
        }
        else {
            alignOptions = this.alignOptions;
            alignByTranslate = this.alignByTranslate;
            alignTo = this.alignTo;
        }
        box = pick(box, renderer[alignTo], renderer);
        // Assign variables
        align = alignOptions.align;
        vAlign = alignOptions.verticalAlign;
        // default: left align
        x = (box.x || 0) + (alignOptions.x || 0);
        // default: top align
        y = (box.y || 0) + (alignOptions.y || 0);
        // Align
        if (align === 'right') {
            alignFactor = 1;
        }
        else if (align === 'center') {
            alignFactor = 2;
        }
        if (alignFactor) {
            x += (box.width - (alignOptions.width || 0)) /
                alignFactor;
        }
        attribs[alignByTranslate ? 'translateX' : 'x'] = Math.round(x);
        // Vertical align
        if (vAlign === 'bottom') {
            vAlignFactor = 1;
        }
        else if (vAlign === 'middle') {
            vAlignFactor = 2;
        }
        if (vAlignFactor) {
            y += (box.height - (alignOptions.height || 0)) /
                vAlignFactor;
        }
        attribs[alignByTranslate ? 'translateY' : 'y'] = Math.round(y);
        // Animate only if already placed
        this[this.placed ? 'animate' : 'attr'](attribs);
        this.placed = true;
        this.alignAttr = attribs;
        return this;
    },
    /**
     * Get the bounding box (width, height, x and y) for the element. Generally
     * used to get rendered text size. Since this is called a lot in charts,
     * the results are cached based on text properties, in order to save DOM
     * traffic. The returned bounding box includes the rotation, so for example
     * a single text line of rotation 90 will report a greater height, and a
     * width corresponding to the line-height.
     *
     * @sample highcharts/members/renderer-on-chart/
     *         Draw a rectangle based on a text's bounding box
     *
     * @function Highcharts.SVGElement#getBBox
     *
     * @param {boolean} [reload]
     *        Skip the cache and get the updated DOM bouding box.
     *
     * @param {number} [rot]
     *        Override the element's rotation. This is internally used on axis
     *        labels with a value of 0 to find out what the bounding box would
     *        be have been if it were not rotated.
     *
     * @return {Highcharts.BBoxObject}
     *         The bounding box with `x`, `y`, `width` and `height` properties.
     */
    getBBox: function (reload, rot) {
        var wrapper = this, bBox, // = wrapper.bBox,
        renderer = wrapper.renderer, width, height, element = wrapper.element, styles = wrapper.styles, fontSize, textStr = wrapper.textStr, toggleTextShadowShim, cache = renderer.cache, cacheKeys = renderer.cacheKeys, isSVG = element.namespaceURI === wrapper.SVG_NS, cacheKey;
        var rotation = pick(rot, wrapper.rotation, 0);
        fontSize = renderer.styledMode ? (element &&
            SVGElement.prototype.getStyle.call(element, 'font-size')) : (styles && styles.fontSize);
        // Avoid undefined and null (#7316)
        if (defined(textStr)) {
            cacheKey = textStr.toString();
            // Since numbers are monospaced, and numerical labels appear a lot
            // in a chart, we assume that a label of n characters has the same
            // bounding box as others of the same length. Unless there is inner
            // HTML in the label. In that case, leave the numbers as is (#5899).
            if (cacheKey.indexOf('<') === -1) {
                cacheKey = cacheKey.replace(/[0-9]/g, '0');
            }
            // Properties that affect bounding box
            cacheKey += [
                '',
                rotation,
                fontSize,
                wrapper.textWidth,
                styles && styles.textOverflow // #5968
            ].join(',');
        }
        if (cacheKey && !reload) {
            bBox = cache[cacheKey];
        }
        // No cache found
        if (!bBox) {
            // SVG elements
            if (isSVG || renderer.forExport) {
                try { // Fails in Firefox if the container has display: none.
                    // When the text shadow shim is used, we need to hide the
                    // fake shadows to get the correct bounding box (#3872)
                    toggleTextShadowShim = this.fakeTS && function (display) {
                        [].forEach.call(element.querySelectorAll('.highcharts-text-outline'), function (tspan) {
                            tspan.style.display = display;
                        });
                    };
                    // Workaround for #3842, Firefox reporting wrong bounding
                    // box for shadows
                    if (toggleTextShadowShim) {
                        toggleTextShadowShim('none');
                    }
                    bBox = element.getBBox ?
                        // SVG: use extend because IE9 is not allowed to change
                        // width and height in case of rotation (below)
                        extend({}, element.getBBox()) : {
                        // Legacy IE in export mode
                        width: element.offsetWidth,
                        height: element.offsetHeight
                    };
                    // #3842
                    if (toggleTextShadowShim) {
                        toggleTextShadowShim('');
                    }
                }
                catch (e) {
                    '';
                }
                // If the bBox is not set, the try-catch block above failed. The
                // other condition is for Opera that returns a width of
                // -Infinity on hidden elements.
                if (!bBox || bBox.width < 0) {
                    bBox = { width: 0, height: 0 };
                }
                // VML Renderer or useHTML within SVG
            }
            else {
                bBox = wrapper.htmlGetBBox();
            }
            // True SVG elements as well as HTML elements in modern browsers
            // using the .useHTML option need to compensated for rotation
            if (renderer.isSVG) {
                width = bBox.width;
                height = bBox.height;
                // Workaround for wrong bounding box in IE, Edge and Chrome on
                // Windows. With Highcharts' default font, IE and Edge report
                // a box height of 16.899 and Chrome rounds it to 17. If this
                // stands uncorrected, it results in more padding added below
                // the text than above when adding a label border or background.
                // Also vertical positioning is affected.
                // https://jsfiddle.net/highcharts/em37nvuj/
                // (#1101, #1505, #1669, #2568, #6213).
                if (isSVG) {
                    bBox.height = height = ({
                        '11px,17': 14,
                        '13px,20': 16
                    }[styles &&
                        styles.fontSize + ',' + Math.round(height)] ||
                        height);
                }
                // Adjust for rotated text
                if (rotation) {
                    var rad = rotation * deg2rad;
                    bBox.width = Math.abs(height * Math.sin(rad)) +
                        Math.abs(width * Math.cos(rad));
                    bBox.height = Math.abs(height * Math.cos(rad)) +
                        Math.abs(width * Math.sin(rad));
                }
            }
            // Cache it. When loading a chart in a hidden iframe in Firefox and
            // IE/Edge, the bounding box height is 0, so don't cache it (#5620).
            if (cacheKey && bBox.height > 0) {
                // Rotate (#4681)
                while (cacheKeys.length > 250) {
                    delete cache[cacheKeys.shift()];
                }
                if (!cache[cacheKey]) {
                    cacheKeys.push(cacheKey);
                }
                cache[cacheKey] = bBox;
            }
        }
        return bBox;
    },
    /**
     * Show the element after it has been hidden.
     *
     * @function Highcharts.SVGElement#show
     *
     * @param {boolean} [inherit=false]
     *        Set the visibility attribute to `inherit` rather than `visible`.
     *        The difference is that an element with `visibility="visible"`
     *        will be visible even if the parent is hidden.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    show: function (inherit) {
        return this.attr({ visibility: inherit ? 'inherit' : 'visible' });
    },
    /**
     * Hide the element, similar to setting the `visibility` attribute to
     * `hidden`.
     *
     * @function Highcharts.SVGElement#hide
     *
     * @param {boolean} [hideByTranslation=false]
     *        The flag to determine if element should be hidden by moving out
     *        of the viewport. Used for example for dataLabels.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    hide: function (hideByTranslation) {
        if (hideByTranslation) {
            this.attr({ y: -9999 });
        }
        else {
            this.attr({ visibility: 'hidden' });
        }
        return this;
    },
    /**
     * Fade out an element by animating its opacity down to 0, and hide it on
     * complete. Used internally for the tooltip.
     *
     * @function Highcharts.SVGElement#fadeOut
     *
     * @param {number} [duration=150]
     *        The fade duration in milliseconds.
     *
     * @return {void}
     */
    fadeOut: function (duration) {
        var elemWrapper = this;
        elemWrapper.animate({
            opacity: 0
        }, {
            duration: duration || 150,
            complete: function () {
                // #3088, assuming we're only using this for tooltips
                elemWrapper.attr({ y: -9999 });
            }
        });
    },
    /**
     * Add the element to the DOM. All elements must be added this way.
     *
     * @sample highcharts/members/renderer-g
     *         Elements added to a group
     *
     * @function Highcharts.SVGElement#add
     *
     * @param {Highcharts.SVGElement} [parent]
     *        The parent item to add it to. If undefined, the element is added
     *        to the {@link Highcharts.SVGRenderer.box}.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    add: function (parent) {
        var renderer = this.renderer, element = this.element, inserted;
        if (parent) {
            this.parentGroup = parent;
        }
        // mark as inverted
        this.parentInverted = parent && parent.inverted;
        // build formatted text
        if (typeof this.textStr !== 'undefined') {
            renderer.buildText(this);
        }
        // Mark as added
        this.added = true;
        // If we're adding to renderer root, or other elements in the group
        // have a z index, we need to handle it
        if (!parent || parent.handleZ || this.zIndex) {
            inserted = this.zIndexSetter();
        }
        // If zIndex is not handled, append at the end
        if (!inserted) {
            (parent ?
                parent.element :
                renderer.box).appendChild(element);
        }
        // fire an event for internal hooks
        if (this.onAdd) {
            this.onAdd();
        }
        return this;
    },
    /**
     * Removes an element from the DOM.
     *
     * @private
     * @function Highcharts.SVGElement#safeRemoveChild
     *
     * @param {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} element
     *        The DOM node to remove.
     *
     * @return {void}
     */
    safeRemoveChild: function (element) {
        var parentNode = element.parentNode;
        if (parentNode) {
            parentNode.removeChild(element);
        }
    },
    /**
     * Destroy the element and element wrapper and clear up the DOM and event
     * hooks.
     *
     * @function Highcharts.SVGElement#destroy
     *
     * @return {undefined}
     */
    destroy: function () {
        var wrapper = this, element = wrapper.element || {}, renderer = wrapper.renderer, parentToClean = (renderer.isSVG &&
            element.nodeName === 'SPAN' &&
            wrapper.parentGroup), grandParent, ownerSVGElement = element.ownerSVGElement, i, clipPath = wrapper.clipPath;
        // remove events
        element.onclick = element.onmouseout = element.onmouseover =
            element.onmousemove = element.point = null;
        stop(wrapper); // stop running animations
        if (clipPath && ownerSVGElement) {
            // Look for existing references to this clipPath and remove them
            // before destroying the element (#6196).
            // The upper case version is for Edge
            [].forEach.call(ownerSVGElement.querySelectorAll('[clip-path],[CLIP-PATH]'), function (el) {
                var clipPathAttr = el.getAttribute('clip-path');
                if (clipPathAttr.indexOf(clipPath.element.id) > -1) {
                    el.removeAttribute('clip-path');
                }
            });
            wrapper.clipPath = clipPath.destroy();
        }
        // Destroy stops in case this is a gradient object
        if (wrapper.stops) {
            for (i = 0; i < wrapper.stops.length; i++) {
                wrapper.stops[i] = wrapper.stops[i].destroy();
            }
            wrapper.stops = null;
        }
        // remove element
        wrapper.safeRemoveChild(element);
        if (!renderer.styledMode) {
            wrapper.destroyShadows();
        }
        // In case of useHTML, clean up empty containers emulating SVG groups
        // (#1960, #2393, #2697).
        while (parentToClean &&
            parentToClean.div &&
            parentToClean.div.childNodes.length === 0) {
            grandParent = parentToClean.parentGroup;
            wrapper.safeRemoveChild(parentToClean.div);
            delete parentToClean.div;
            parentToClean = grandParent;
        }
        // remove from alignObjects
        if (wrapper.alignTo) {
            erase(renderer.alignedObjects, wrapper);
        }
        objectEach(wrapper, function (val, key) {
            // Destroy child elements of a group
            if (wrapper[key] &&
                wrapper[key].parentGroup === wrapper &&
                wrapper[key].destroy) {
                wrapper[key].destroy();
            }
            // Delete all properties
            delete wrapper[key];
        });
        return;
    },
    /**
     * Add a shadow to the element. Must be called after the element is added to
     * the DOM. In styled mode, this method is not used, instead use `defs` and
     * filters.
     *
     * @example
     * renderer.rect(10, 100, 100, 100)
     *     .attr({ fill: 'red' })
     *     .shadow(true);
     *
     * @function Highcharts.SVGElement#shadow
     *
     * @param {boolean|Highcharts.ShadowOptionsObject} [shadowOptions]
     *        The shadow options. If `true`, the default options are applied. If
     *        `false`, the current shadow will be removed.
     *
     * @param {Highcharts.SVGElement} [group]
     *        The SVG group element where the shadows will be applied. The
     *        default is to add it to the same parent as the current element.
     *        Internally, this is ised for pie slices, where all the shadows are
     *        added to an element behind all the slices.
     *
     * @param {boolean} [cutOff]
     *        Used internally for column shadows.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    shadow: function (shadowOptions, group, cutOff) {
        var shadows = [], i, shadow, element = this.element, strokeWidth, shadowWidth, shadowElementOpacity, 
        // compensate for inverted plot area
        transform;
        if (!shadowOptions) {
            this.destroyShadows();
        }
        else if (!this.shadows) {
            shadowWidth = pick(shadowOptions.width, 3);
            shadowElementOpacity = (shadowOptions.opacity || 0.15) /
                shadowWidth;
            transform = this.parentInverted ?
                '(-1,-1)' :
                '(' + pick(shadowOptions.offsetX, 1) + ', ' +
                    pick(shadowOptions.offsetY, 1) + ')';
            for (i = 1; i <= shadowWidth; i++) {
                shadow = element.cloneNode(0);
                strokeWidth = (shadowWidth * 2) + 1 - (2 * i);
                attr(shadow, {
                    stroke: (shadowOptions.color ||
                        '${palette.neutralColor100}'),
                    'stroke-opacity': shadowElementOpacity * i,
                    'stroke-width': strokeWidth,
                    transform: 'translate' + transform,
                    fill: 'none'
                });
                shadow.setAttribute('class', (shadow.getAttribute('class') || '') + ' highcharts-shadow');
                if (cutOff) {
                    attr(shadow, 'height', Math.max(attr(shadow, 'height') - strokeWidth, 0));
                    shadow.cutHeight = strokeWidth;
                }
                if (group) {
                    group.element.appendChild(shadow);
                }
                else if (element.parentNode) {
                    element.parentNode.insertBefore(shadow, element);
                }
                shadows.push(shadow);
            }
            this.shadows = shadows;
        }
        return this;
    },
    /**
     * Destroy shadows on the element.
     *
     * @private
     * @function Highcharts.SVGElement#destroyShadows
     *
     * @return {void}
     */
    destroyShadows: function () {
        (this.shadows || []).forEach(function (shadow) {
            this.safeRemoveChild(shadow);
        }, this);
        this.shadows = void 0;
    },
    /**
     * @private
     * @function Highcharts.SVGElement#xGetter
     *
     * @param {string} key - key
     *
     * @return {number|string|null}
     */
    xGetter: function (key) {
        if (this.element.nodeName === 'circle') {
            if (key === 'x') {
                key = 'cx';
            }
            else if (key === 'y') {
                key = 'cy';
            }
        }
        return this._defaultGetter(key);
    },
    /**
     * Get the current value of an attribute or pseudo attribute,
     * used mainly for animation. Called internally from
     * the {@link Highcharts.SVGRenderer#attr} function.
     *
     * @private
     * @function Highcharts.SVGElement#_defaultGetter
     *
     * @param {string} key
     *        Property key.
     *
     * @return {number|string}
     *         Property value.
     */
    _defaultGetter: function (key) {
        var ret = pick(this[key + 'Value'], // align getter
        this[key], this.element ? this.element.getAttribute(key) : null, 0);
        if (/^[\-0-9\.]+$/.test(ret)) { // is numerical
            ret = parseFloat(ret);
        }
        return ret;
    },
    /**
     * @private
     * @function Highcharts.SVGElement#dSettter
     *
     * @param {number|string|Highcharts.SVGPathArray} value
     *
     * @param {string} key
     *
     * @param {Highcharts.SVGDOMElement} element
     *
     * @return {void}
     */
    dSetter: function (value, key, element) {
        if (value && value.join) { // join path
            value = value.join(' ');
        }
        if (/(NaN| {2}|^$)/.test(value)) {
            value = 'M 0 0';
        }
        // Check for cache before resetting. Resetting causes disturbance in the
        // DOM, causing flickering in some cases in Edge/IE (#6747). Also
        // possible performance gain.
        if (this[key] !== value) {
            element.setAttribute(key, value);
            this[key] = value;
        }
    },
    /**
     * @private
     * @function Highcharts.SVGElement#dashstyleSetter
     *
     * @param {string} value
     *
     * @return {void}
     */
    dashstyleSetter: function (value) {
        var i, strokeWidth = this['stroke-width'];
        // If "inherit", like maps in IE, assume 1 (#4981). With HC5 and the new
        // strokeWidth function, we should be able to use that instead.
        if (strokeWidth === 'inherit') {
            strokeWidth = 1;
        }
        value = value && value.toLowerCase();
        if (value) {
            value = value
                .replace('shortdashdotdot', '3,1,1,1,1,1,')
                .replace('shortdashdot', '3,1,1,1')
                .replace('shortdot', '1,1,')
                .replace('shortdash', '3,1,')
                .replace('longdash', '8,3,')
                .replace(/dot/g, '1,3,')
                .replace('dash', '4,3,')
                .replace(/,$/, '')
                .split(','); // ending comma
            i = value.length;
            while (i--) {
                value[i] = pInt(value[i]) * strokeWidth;
            }
            value = value.join(',')
                .replace(/NaN/g, 'none'); // #3226
            this.element.setAttribute('stroke-dasharray', value);
        }
    },
    /**
     * @private
     * @function Highcharts.SVGElement#alignSetter
     *
     * @param {"start"|"middle"|"end"} value
     *
     * @return {void}
     */
    alignSetter: function (value) {
        var convert = {
            left: 'start',
            center: 'middle',
            right: 'end'
        };
        if (convert[value]) {
            this.alignValue = value;
            this.element.setAttribute('text-anchor', convert[value]);
        }
    },
    /**
     * @private
     * @function Highcharts.SVGElement#opacitySetter
     *
     * @param {string} value
     *
     * @param {string} key
     *
     * @param {Highcharts.SVGDOMElement} element
     *
     * @return {void}
     */
    opacitySetter: function (value, key, element) {
        this[key] = value;
        element.setAttribute(key, value);
    },
    /**
     * @private
     * @function Highcharts.SVGElement#titleSetter
     *
     * @param {string} value
     *
     * @return {void}
     */
    titleSetter: function (value) {
        var titleNode = this.element.getElementsByTagName('title')[0];
        if (!titleNode) {
            titleNode = doc.createElementNS(this.SVG_NS, 'title');
            this.element.appendChild(titleNode);
        }
        // Remove text content if it exists
        if (titleNode.firstChild) {
            titleNode.removeChild(titleNode.firstChild);
        }
        titleNode.appendChild(doc.createTextNode(
        // #3276, #3895
        String(pick(value, ''))
            .replace(/<[^>]*>/g, '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')));
    },
    /**
     * @private
     * @function Highcharts.SVGElement#textSetter
     *
     * @param {string} value
     *
     * @return {void}
     */
    textSetter: function (value) {
        if (value !== this.textStr) {
            // Delete size caches when the text changes
            delete this.bBox;
            delete this.textPxLength;
            this.textStr = value;
            if (this.added) {
                this.renderer.buildText(this);
            }
        }
    },
    /**
     * @private
     * @function Highcharts.SVGElement#setTextPath
     * @param {Highcharts.SVGElement} path - path to follow
     * @param {Highcharts.DataLabelsTextPathOptionsObject} textPathOptions - options
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    setTextPath: function (path, textPathOptions) {
        var elem = this.element, attribsMap = {
            textAnchor: 'text-anchor'
        }, attrs, adder = false, textPathElement, textPathId, textPathWrapper = this.textPathWrapper, tspans, firstTime = !textPathWrapper;
        // Defaults
        textPathOptions = merge(true, {
            enabled: true,
            attributes: {
                dy: -5,
                startOffset: '50%',
                textAnchor: 'middle'
            }
        }, textPathOptions);
        attrs = textPathOptions.attributes;
        if (path && textPathOptions && textPathOptions.enabled) {
            // In case of fixed width for a text, string is rebuilt
            // (e.g. ellipsis is applied), so we need to rebuild textPath too
            if (textPathWrapper &&
                textPathWrapper.element.parentNode === null) {
                // When buildText functionality was triggered again
                // and deletes textPathWrapper parentNode
                firstTime = true;
                textPathWrapper = textPathWrapper.destroy();
            }
            else if (textPathWrapper) {
                // Case after drillup when spans were added into
                // the DOM outside the textPathWrapper parentGroup
                this.removeTextOutline.call(textPathWrapper.parentGroup, [].slice.call(elem.getElementsByTagName('tspan')));
            }
            // label() has padding, text() doesn't
            if (this.options && this.options.padding) {
                attrs.dx = -this.options.padding;
            }
            if (!textPathWrapper) {
                // Create <textPath>, defer the DOM adder
                this.textPathWrapper = textPathWrapper =
                    this.renderer.createElement('textPath');
                adder = true;
            }
            textPathElement = textPathWrapper.element;
            // Set ID for the path
            textPathId = path.element.getAttribute('id');
            if (!textPathId) {
                path.element.setAttribute('id', textPathId = H.uniqueKey());
            }
            // Change DOM structure, by placing <textPath> tag in <text>
            if (firstTime) {
                tspans = elem.getElementsByTagName('tspan');
                // Now move all <tspan>'s to the <textPath> node
                while (tspans.length) {
                    // Remove "y" from tspans, as Firefox translates them
                    tspans[0].setAttribute('y', 0);
                    // Remove "x" from tspans
                    if (isNumber(attrs.dx)) {
                        tspans[0].setAttribute('x', -attrs.dx);
                    }
                    textPathElement.appendChild(tspans[0]);
                }
            }
            // Add <textPath> to the DOM
            if (adder) {
                textPathWrapper.add({
                    // label() is placed in a group, text() is standalone
                    element: this.text ? this.text.element : elem
                });
            }
            // Set basic options:
            // Use `setAttributeNS` because Safari needs this..
            textPathElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.renderer.url + '#' + textPathId);
            // Presentation attributes:
            // dx/dy options must by set on <text> (parent),
            // the rest should be set on <textPath>
            if (defined(attrs.dy)) {
                textPathElement.parentNode
                    .setAttribute('dy', attrs.dy);
                delete attrs.dy;
            }
            if (defined(attrs.dx)) {
                textPathElement.parentNode
                    .setAttribute('dx', attrs.dx);
                delete attrs.dx;
            }
            // Additional attributes
            objectEach(attrs, function (val, key) {
                textPathElement.setAttribute(attribsMap[key] || key, val);
            });
            // Remove translation, text that follows path does not need that
            elem.removeAttribute('transform');
            // Remove shadows and text outlines
            this.removeTextOutline.call(textPathWrapper, [].slice.call(elem.getElementsByTagName('tspan')));
            // Remove background and border for label(), see #10545
            // Alternatively, we can disable setting background rects in
            // series.drawDataLabels()
            if (this.text && !this.renderer.styledMode) {
                this.attr({
                    fill: 'none',
                    'stroke-width': 0
                });
            }
            // Disable some functions
            this.updateTransform = noop;
            this.applyTextOutline = noop;
        }
        else if (textPathWrapper) {
            // Reset to prototype
            delete this.updateTransform;
            delete this.applyTextOutline;
            // Restore DOM structure:
            this.destroyTextPath(elem, path);
            // Bring attributes back
            this.updateTransform();
            // Set textOutline back for text()
            if (this.options.rotation) {
                this.applyTextOutline(this.options.style.textOutline);
            }
        }
        return this;
    },
    destroyTextPath: function (elem, path) {
        var tspans, textElement = elem.getElementsByTagName('text')[0];
        if (textElement) {
            // Remove textPath attributes
            textElement.removeAttribute('dx');
            textElement.removeAttribute('dy');
            // Remove ID's:
            path.element.setAttribute('id', '');
            // Check if textElement includes textPath,
            if (textElement.getElementsByTagName('textPath').length) {
                // Move nodes to <text>
                tspans = this.textPathWrapper.element.childNodes;
                // Now move all <tspan>'s to the <textPath> node
                while (tspans.length) {
                    textElement.appendChild(tspans[0]);
                }
                // Remove <textPath> from the DOM
                textElement.removeChild(this.textPathWrapper.element);
            }
        }
        else if (elem.getAttribute('dx') || elem.getAttribute('dy')) {
            // Remove textPath attributes from elem
            // to get correct text-outline position
            elem.removeAttribute('dx');
            elem.removeAttribute('dy');
        }
        // Set textPathWrapper to undefined and destroy it
        this.textPathWrapper = this.textPathWrapper.destroy();
    },
    /**
     * @private
     * @function Highcharts.SVGElement#fillSetter
     *
     * @param {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject} value
     *
     * @param {string} key
     *
     * @param {Highcharts.SVGDOMElement} element
     *
     * @return {void}
     */
    fillSetter: function (value, key, element) {
        if (typeof value === 'string') {
            element.setAttribute(key, value);
        }
        else if (value) {
            this.complexColor(value, key, element);
        }
    },
    /**
     * @private
     * @function Highcharts.SVGElement#visibilitySetter
     *
     * @param {string} value
     *
     * @param {string} key
     *
     * @param {Highcharts.SVGDOMElement} element
     *
     * @return {void}
     */
    visibilitySetter: function (value, key, element) {
        // IE9-11 doesn't handle visibilty:inherit well, so we remove the
        // attribute instead (#2881, #3909)
        if (value === 'inherit') {
            element.removeAttribute(key);
        }
        else if (this[key] !== value) { // #6747
            element.setAttribute(key, value);
        }
        this[key] = value;
    },
    /**
     * @private
     * @function Highcharts.SVGElement#zIndexSetter
     * @param {string} [value] - value
     * @param {string} [key] - key
     * @return {boolean}
     */
    zIndexSetter: function (value, key) {
        var renderer = this.renderer, parentGroup = this.parentGroup, parentWrapper = parentGroup || renderer, parentNode = parentWrapper.element || renderer.box, childNodes, otherElement, otherZIndex, element = this.element, inserted = false, undefinedOtherZIndex, svgParent = parentNode === renderer.box, run = this.added, i;
        if (defined(value)) {
            // So we can read it for other elements in the group
            element.setAttribute('data-z-index', value);
            value = +value;
            if (this[key] === value) {
                // Only update when needed (#3865)
                run = false;
            }
        }
        else if (defined(this[key])) {
            element.removeAttribute('data-z-index');
        }
        this[key] = value;
        // Insert according to this and other elements' zIndex. Before .add() is
        // called, nothing is done. Then on add, or by later calls to
        // zIndexSetter, the node is placed on the right place in the DOM.
        if (run) {
            value = this.zIndex;
            if (value && parentGroup) {
                parentGroup.handleZ = true;
            }
            childNodes = parentNode.childNodes;
            for (i = childNodes.length - 1; i >= 0 && !inserted; i--) {
                otherElement = childNodes[i];
                otherZIndex = otherElement.getAttribute('data-z-index');
                undefinedOtherZIndex = !defined(otherZIndex);
                if (otherElement !== element) {
                    if (
                    // Negative zIndex versus no zIndex:
                    // On all levels except the highest. If the parent is
                    // <svg>, then we don't want to put items before <desc>
                    // or <defs>
                    value < 0 &&
                        undefinedOtherZIndex &&
                        !svgParent &&
                        !i) {
                        parentNode.insertBefore(element, childNodes[i]);
                        inserted = true;
                    }
                    else if (
                    // Insert after the first element with a lower zIndex
                    pInt(otherZIndex) <= value ||
                        // If negative zIndex, add this before first undefined
                        // zIndex element
                        (undefinedOtherZIndex &&
                            (!defined(value) || value >= 0))) {
                        parentNode.insertBefore(element, childNodes[i + 1] || null // null for oldIE export
                        );
                        inserted = true;
                    }
                }
            }
            if (!inserted) {
                parentNode.insertBefore(element, childNodes[svgParent ? 3 : 0] || null // null for oldIE
                );
                inserted = true;
            }
        }
        return inserted;
    },
    /**
     * @private
     * @function Highcharts.SVGElement#_defaultSetter
     *
     * @param {string} value
     *
     * @param {string} key
     *
     * @param {Highcharts.SVGDOMElement} element
     *
     * @return {void}
     */
    _defaultSetter: function (value, key, element) {
        element.setAttribute(key, value);
    }
});
// Some shared setters and getters
SVGElement.prototype.yGetter =
    SVGElement.prototype.xGetter;
SVGElement.prototype.translateXSetter =
    SVGElement.prototype.translateYSetter =
        SVGElement.prototype.rotationSetter =
            SVGElement.prototype.verticalAlignSetter =
                SVGElement.prototype.rotationOriginXSetter =
                    SVGElement.prototype.rotationOriginYSetter =
                        SVGElement.prototype.scaleXSetter =
                            SVGElement.prototype.scaleYSetter =
                                SVGElement.prototype.matrixSetter = function (value, key) {
                                    this[key] = value;
                                    this.doTransform = true;
                                };
// WebKit and Batik have problems with a stroke-width of zero, so in this case
// we remove the stroke attribute altogether. #1270, #1369, #3065, #3072.
SVGElement.prototype['stroke-widthSetter'] =
    /**
     * @private
     * @function Highcharts.SVGElement#strokeSetter
     *
     * @param {number|string} value
     *
     * @param {string} key
     *
     * @param {Highcharts.SVGDOMElement} element
     *
     * @return {void}
     */
    SVGElement.prototype.strokeSetter = function (value, key, element) {
        this[key] = value;
        // Only apply the stroke attribute if the stroke width is defined and larger
        // than 0
        if (this.stroke && this['stroke-width']) {
            // Use prototype as instance may be overridden
            SVGElement.prototype.fillSetter.call(this, this.stroke, 'stroke', element);
            element.setAttribute('stroke-width', this['stroke-width']);
            this.hasStroke = true;
        }
        else if (key === 'stroke-width' && value === 0 && this.hasStroke) {
            element.removeAttribute('stroke');
            this.hasStroke = false;
        }
        else if (this.renderer.styledMode && this['stroke-width']) {
            element.setAttribute('stroke-width', this['stroke-width']);
            this.hasStroke = true;
        }
    };
/**
 * Allows direct access to the Highcharts rendering layer in order to draw
 * primitive shapes like circles, rectangles, paths or text directly on a chart,
 * or independent from any chart. The SVGRenderer represents a wrapper object
 * for SVG in modern browsers. Through the VMLRenderer, part of the `oldie.js`
 * module, it also brings vector graphics to IE <= 8.
 *
 * An existing chart's renderer can be accessed through {@link Chart.renderer}.
 * The renderer can also be used completely decoupled from a chart.
 *
 * @sample highcharts/members/renderer-on-chart
 *         Annotating a chart programmatically.
 * @sample highcharts/members/renderer-basic
 *         Independent SVG drawing.
 *
 * @example
 * // Use directly without a chart object.
 * var renderer = new Highcharts.Renderer(parentNode, 600, 400);
 *
 * @class
 * @name Highcharts.SVGRenderer
 *
 * @param {Highcharts.HTMLDOMElement} container
 *        Where to put the SVG in the web page.
 *
 * @param {number} width
 *        The width of the SVG.
 *
 * @param {number} height
 *        The height of the SVG.
 *
 * @param {Highcharts.CSSObject} [style]
 *        The box style, if not in styleMode
 *
 * @param {boolean} [forExport=false]
 *        Whether the rendered content is intended for export.
 *
 * @param {boolean} [allowHTML=true]
 *        Whether the renderer is allowed to include HTML text, which will be
 *        projected on top of the SVG.
 *
 * @param {boolean} [styledMode=false]
 *        Whether the renderer belongs to a chart that is in styled mode.
 *        If it does, it will avoid setting presentational attributes in
 *        some cases, but not when set explicitly through `.attr` and `.css`
 *        etc.
 */
SVGRenderer = H.SVGRenderer = function () {
    this.init.apply(this, arguments);
};
extend(SVGRenderer.prototype, /** @lends Highcharts.SVGRenderer.prototype */ {
    /**
     * A pointer to the renderer's associated Element class. The VMLRenderer
     * will have a pointer to VMLElement here.
     *
     * @name Highcharts.SVGRenderer#Element
     * @type {Highcharts.SVGElement}
     */
    Element: SVGElement,
    SVG_NS: SVG_NS,
    /**
     * Initialize the SVGRenderer. Overridable initializer function that takes
     * the same parameters as the constructor.
     *
     * @function Highcharts.SVGRenderer#init
     *
     * @param {Highcharts.HTMLDOMElement} container
     *        Where to put the SVG in the web page.
     *
     * @param {number} width
     *        The width of the SVG.
     *
     * @param {number} height
     *        The height of the SVG.
     *
     * @param {Highcharts.CSSObject} [style]
     *        The box style, if not in styleMode
     *
     * @param {boolean} [forExport=false]
     *        Whether the rendered content is intended for export.
     *
     * @param {boolean} [allowHTML=true]
     *        Whether the renderer is allowed to include HTML text, which will
     *        be projected on top of the SVG.
     *
     * @param {boolean} [styledMode=false]
     *        Whether the renderer belongs to a chart that is in styled mode.
     *        If it does, it will avoid setting presentational attributes in
     *        some cases, but not when set explicitly through `.attr` and `.css`
     *        etc.
     *
     * @return {void}
     */
    init: function (container, width, height, style, forExport, allowHTML, styledMode) {
        var renderer = this, boxWrapper, element, desc;
        boxWrapper = renderer.createElement('svg')
            .attr({
            version: '1.1',
            'class': 'highcharts-root'
        });
        if (!styledMode) {
            boxWrapper.css(this.getStyle(style));
        }
        element = boxWrapper.element;
        container.appendChild(element);
        // Always use ltr on the container, otherwise text-anchor will be
        // flipped and text appear outside labels, buttons, tooltip etc (#3482)
        attr(container, 'dir', 'ltr');
        // For browsers other than IE, add the namespace attribute (#1978)
        if (container.innerHTML.indexOf('xmlns') === -1) {
            attr(element, 'xmlns', this.SVG_NS);
        }
        // object properties
        renderer.isSVG = true;
        /**
         * The root `svg` node of the renderer.
         *
         * @name Highcharts.SVGRenderer#box
         * @type {Highcharts.SVGDOMElement}
         */
        this.box = element;
        /**
         * The wrapper for the root `svg` node of the renderer.
         *
         * @name Highcharts.SVGRenderer#boxWrapper
         * @type {Highcharts.SVGElement}
         */
        this.boxWrapper = boxWrapper;
        renderer.alignedObjects = [];
        /**
         * Page url used for internal references.
         *
         * @private
         * @name Highcharts.SVGRenderer#url
         * @type {string}
         */
        // #24, #672, #1070
        this.url = ((isFirefox || isWebKit) &&
            doc.getElementsByTagName('base').length) ?
            win.location.href
                .split('#')[0] // remove the hash
                .replace(/<[^>]*>/g, '') // wing cut HTML
                // escape parantheses and quotes
                .replace(/([\('\)])/g, '\\$1')
                // replace spaces (needed for Safari only)
                .replace(/ /g, '%20') :
            '';
        // Add description
        desc = this.createElement('desc').add();
        desc.element.appendChild(doc.createTextNode('Created with @product.name@ @product.version@'));
        /**
         * A pointer to the `defs` node of the root SVG.
         *
         * @name Highcharts.SVGRenderer#defs
         * @type {Highcharts.SVGElement}
         */
        renderer.defs = this.createElement('defs').add();
        renderer.allowHTML = allowHTML;
        renderer.forExport = forExport;
        renderer.styledMode = styledMode;
        renderer.gradients = {}; // Object where gradient SvgElements are stored
        renderer.cache = {}; // Cache for numerical bounding boxes
        renderer.cacheKeys = [];
        renderer.imgCount = 0;
        renderer.setSize(width, height, false);
        // Issue 110 workaround:
        // In Firefox, if a div is positioned by percentage, its pixel position
        // may land between pixels. The container itself doesn't display this,
        // but an SVG element inside this container will be drawn at subpixel
        // precision. In order to draw sharp lines, this must be compensated
        // for. This doesn't seem to work inside iframes though (like in
        // jsFiddle).
        var subPixelFix, rect;
        if (isFirefox && container.getBoundingClientRect) {
            subPixelFix = function () {
                css(container, { left: 0, top: 0 });
                rect = container.getBoundingClientRect();
                css(container, {
                    left: (Math.ceil(rect.left) - rect.left) + 'px',
                    top: (Math.ceil(rect.top) - rect.top) + 'px'
                });
            };
            // run the fix now
            subPixelFix();
            // run it on resize
            renderer.unSubPixelFix = addEvent(win, 'resize', subPixelFix);
        }
    },
    /**
     * General method for adding a definition to the SVG `defs` tag. Can be used
     * for gradients, fills, filters etc. Styled mode only. A hook for adding
     * general definitions to the SVG's defs tag. Definitions can be referenced
     * from the CSS by its `id`. Read more in
     * [gradients, shadows and patterns](https://www.highcharts.com/docs/chart-design-and-style/gradients-shadows-and-patterns).
     * Styled mode only.
     *
     * @function Highcharts.SVGRenderer#definition
     *
     * @param {Highcharts.SVGDefinitionObject} def
     *        A serialized form of an SVG definition, including children.
     *
     * @return {Highcharts.SVGElement}
     *         The inserted node.
     */
    definition: function (def) {
        var ren = this;
        /**
         * @private
         * @param {Highcharts.SVGDefinitionObject} config - SVG definition
         * @param {Highcharts.SVGElement} [parent] - parent node
         */
        function recurse(config, parent) {
            var ret;
            splat(config).forEach(function (item) {
                var node = ren.createElement(item.tagName), attr = {};
                // Set attributes
                objectEach(item, function (val, key) {
                    if (key !== 'tagName' &&
                        key !== 'children' &&
                        key !== 'textContent') {
                        attr[key] = val;
                    }
                });
                node.attr(attr);
                // Add to the tree
                node.add(parent || ren.defs);
                // Add text content
                if (item.textContent) {
                    node.element.appendChild(doc.createTextNode(item.textContent));
                }
                // Recurse
                recurse(item.children || [], node);
                ret = node;
            });
            // Return last node added (on top level it's the only one)
            return ret;
        }
        return recurse(def);
    },
    /**
     * Get the global style setting for the renderer.
     *
     * @private
     * @function Highcharts.SVGRenderer#getStyle
     *
     * @param {Highcharts.CSSObject} style
     *        Style settings.
     *
     * @return {Highcharts.CSSObject}
     *         The style settings mixed with defaults.
     */
    getStyle: function (style) {
        this.style = extend({
            fontFamily: '"Lucida Grande", "Lucida Sans Unicode", ' +
                'Arial, Helvetica, sans-serif',
            fontSize: '12px'
        }, style);
        return this.style;
    },
    /**
     * Apply the global style on the renderer, mixed with the default styles.
     *
     * @function Highcharts.SVGRenderer#setStyle
     *
     * @param {Highcharts.CSSObject} style
     *        CSS to apply.
     */
    setStyle: function (style) {
        this.boxWrapper.css(this.getStyle(style));
    },
    /**
     * Detect whether the renderer is hidden. This happens when one of the
     * parent elements has `display: none`. Used internally to detect when we
     * needto render preliminarily in another div to get the text bounding boxes
     * right.
     *
     * @function Highcharts.SVGRenderer#isHidden
     *
     * @return {boolean}
     *         True if it is hidden.
     */
    isHidden: function () {
        return !this.boxWrapper.getBBox().width;
    },
    /**
     * Destroys the renderer and its allocated members.
     *
     * @function Highcharts.SVGRenderer#destroy
     *
     * @return {null}
     */
    destroy: function () {
        var renderer = this, rendererDefs = renderer.defs;
        renderer.box = null;
        renderer.boxWrapper = renderer.boxWrapper.destroy();
        // Call destroy on all gradient elements
        destroyObjectProperties(renderer.gradients || {});
        renderer.gradients = null;
        // Defs are null in VMLRenderer
        // Otherwise, destroy them here.
        if (rendererDefs) {
            renderer.defs = rendererDefs.destroy();
        }
        // Remove sub pixel fix handler (#982)
        if (renderer.unSubPixelFix) {
            renderer.unSubPixelFix();
        }
        renderer.alignedObjects = null;
        return null;
    },
    /**
     * Create a wrapper for an SVG element. Serves as a factory for
     * {@link SVGElement}, but this function is itself mostly called from
     * primitive factories like {@link SVGRenderer#path}, {@link
     * SVGRenderer#rect} or {@link SVGRenderer#text}.
     *
     * @function Highcharts.SVGRenderer#createElement
     *
     * @param {string} nodeName
     *        The node name, for example `rect`, `g` etc.
     *
     * @return {Highcharts.SVGElement}
     *         The generated SVGElement.
     */
    createElement: function (nodeName) {
        var wrapper = new this.Element();
        wrapper.init(this, nodeName);
        return wrapper;
    },
    /**
     * Dummy function for plugins, called every time the renderer is updated.
     * Prior to Highcharts 5, this was used for the canvg renderer.
     *
     * @deprecated
     * @function Highcharts.SVGRenderer#draw
     */
    draw: noop,
    /**
     * Get converted radial gradient attributes according to the radial
     * reference. Used internally from the {@link SVGElement#colorGradient}
     * function.
     *
     * @private
     * @function Highcharts.SVGRenderer#getRadialAttr
     *
     * @param {Array<number>} radialReference
     *
     * @param {Highcharts.SVGAttributes} gradAttr
     *
     * @return {Highcharts.SVGAttributes}
     */
    getRadialAttr: function (radialReference, gradAttr) {
        return {
            cx: (radialReference[0] - radialReference[2] / 2) +
                gradAttr.cx * radialReference[2],
            cy: (radialReference[1] - radialReference[2] / 2) +
                gradAttr.cy * radialReference[2],
            r: gradAttr.r * radialReference[2]
        };
    },
    /**
     * Truncate the text node contents to a given length. Used when the css
     * width is set. If the `textOverflow` is `ellipsis`, the text is truncated
     * character by character to the given length. If not, the text is
     * word-wrapped line by line.
     *
     * @private
     * @function Highcharts.SVGRenderer#truncate
     *
     * @param {Highcharts.SVGElement} wrapper
     *
     * @param {Highcharts.HTMLDOMElement} tspan
     *
     * @param {string|undefined} text
     *
     * @param {Array<string>|undefined} words
     *
     * @param {number} startAt
     *
     * @param {number} width
     *
     * @param {Function} getString
     *
     * @return {boolean}
     *         True if tspan is too long.
     */
    truncate: function (wrapper, tspan, text, words, startAt, width, getString) {
        var renderer = this, rotation = wrapper.rotation, str, 
        // Word wrap can not be truncated to shorter than one word, ellipsis
        // text can be completely blank.
        minIndex = words ? 1 : 0, maxIndex = (text || words).length, currentIndex = maxIndex, 
        // Cache the lengths to avoid checking the same twice
        lengths = [], updateTSpan = function (s) {
            if (tspan.firstChild) {
                tspan.removeChild(tspan.firstChild);
            }
            if (s) {
                tspan.appendChild(doc.createTextNode(s));
            }
        }, getSubStringLength = function (charEnd, concatenatedEnd) {
            // charEnd is useed when finding the character-by-character
            // break for ellipsis, concatenatedEnd is used for word-by-word
            // break for word wrapping.
            var end = concatenatedEnd || charEnd;
            if (typeof lengths[end] === 'undefined') {
                // Modern browsers
                if (tspan.getSubStringLength) {
                    // Fails with DOM exception on unit-tests/legend/members
                    // of unknown reason. Desired width is 0, text content
                    // is "5" and end is 1.
                    try {
                        lengths[end] = startAt +
                            tspan.getSubStringLength(0, words ? end + 1 : end);
                    }
                    catch (e) {
                        '';
                    }
                    // Legacy
                }
                else if (renderer.getSpanWidth) { // #9058 jsdom
                    updateTSpan(getString(text || words, charEnd));
                    lengths[end] = startAt +
                        renderer.getSpanWidth(wrapper, tspan);
                }
            }
            return lengths[end];
        }, actualWidth, truncated;
        wrapper.rotation = 0; // discard rotation when computing box
        actualWidth = getSubStringLength(tspan.textContent.length);
        truncated = startAt + actualWidth > width;
        if (truncated) {
            // Do a binary search for the index where to truncate the text
            while (minIndex <= maxIndex) {
                currentIndex = Math.ceil((minIndex + maxIndex) / 2);
                // When checking words for word-wrap, we need to build the
                // string and measure the subStringLength at the concatenated
                // word length.
                if (words) {
                    str = getString(words, currentIndex);
                }
                actualWidth = getSubStringLength(currentIndex, str && str.length - 1);
                if (minIndex === maxIndex) {
                    // Complete
                    minIndex = maxIndex + 1;
                }
                else if (actualWidth > width) {
                    // Too large. Set max index to current.
                    maxIndex = currentIndex - 1;
                }
                else {
                    // Within width. Set min index to current.
                    minIndex = currentIndex;
                }
            }
            // If max index was 0 it means the shortest possible text was also
            // too large. For ellipsis that means only the ellipsis, while for
            // word wrap it means the whole first word.
            if (maxIndex === 0) {
                // Remove ellipsis
                updateTSpan('');
                // If the new text length is one less than the original, we don't
                // need the ellipsis
            }
            else if (!(text && maxIndex === text.length - 1)) {
                updateTSpan(str || getString(text || words, currentIndex));
            }
        }
        // When doing line wrapping, prepare for the next line by removing the
        // items from this line.
        if (words) {
            words.splice(0, currentIndex);
        }
        wrapper.actualWidth = actualWidth;
        wrapper.rotation = rotation; // Apply rotation again.
        return truncated;
    },
    /**
     * A collection of characters mapped to HTML entities. When `useHTML` on an
     * element is true, these entities will be rendered correctly by HTML. In
     * the SVG pseudo-HTML, they need to be unescaped back to simple characters,
     * so for example `&lt;` will render as `<`.
     *
     * @example
     * // Add support for unescaping quotes
     * Highcharts.SVGRenderer.prototype.escapes['"'] = '&quot;';
     *
     * @name Highcharts.SVGRenderer#escapes
     * @type {Highcharts.Dictionary<string>}
     */
    escapes: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    },
    /**
     * Parse a simple HTML string into SVG tspans. Called internally when text
     * is set on an SVGElement. The function supports a subset of HTML tags, CSS
     * text features like `width`, `text-overflow`, `white-space`, and also
     * attributes like `href` and `style`.
     *
     * @private
     * @function Highcharts.SVGRenderer#buildText
     *
     * @param {Highcharts.SVGElement} wrapper
     *        The parent SVGElement.
     *
     * @return {void}
     */
    buildText: function (wrapper) {
        var textNode = wrapper.element, renderer = this, forExport = renderer.forExport, textStr = pick(wrapper.textStr, '').toString(), hasMarkup = textStr.indexOf('<') !== -1, lines, childNodes = textNode.childNodes, truncated, parentX = attr(textNode, 'x'), textStyles = wrapper.styles, width = wrapper.textWidth, textLineHeight = textStyles && textStyles.lineHeight, textOutline = textStyles && textStyles.textOutline, ellipsis = textStyles && textStyles.textOverflow === 'ellipsis', noWrap = textStyles && textStyles.whiteSpace === 'nowrap', fontSize = textStyles && textStyles.fontSize, textCache, isSubsequentLine, i = childNodes.length, tempParent = width && !wrapper.added && this.box, getLineHeight = function (tspan) {
            var fontSizeStyle;
            if (!renderer.styledMode) {
                fontSizeStyle =
                    /(px|em)$/.test(tspan && tspan.style.fontSize) ?
                        tspan.style.fontSize :
                        (fontSize || renderer.style.fontSize || 12);
            }
            return textLineHeight ?
                pInt(textLineHeight) :
                renderer.fontMetrics(fontSizeStyle, 
                // Get the computed size from parent if not explicit
                (tspan.getAttribute('style') ? tspan : textNode)).h;
        }, unescapeEntities = function (inputStr, except) {
            objectEach(renderer.escapes, function (value, key) {
                if (!except || except.indexOf(value) === -1) {
                    inputStr = inputStr.toString().replace(new RegExp(value, 'g'), key);
                }
            });
            return inputStr;
        }, parseAttribute = function (s, attr) {
            var start, delimiter;
            start = s.indexOf('<');
            s = s.substring(start, s.indexOf('>') - start);
            start = s.indexOf(attr + '=');
            if (start !== -1) {
                start = start + attr.length + 1;
                delimiter = s.charAt(start);
                if (delimiter === '"' || delimiter === "'") { // eslint-disable-line quotes
                    s = s.substring(start + 1);
                    return s.substring(0, s.indexOf(delimiter));
                }
            }
        };
        var regexMatchBreaks = /<br.*?>/g;
        // The buildText code is quite heavy, so if we're not changing something
        // that affects the text, skip it (#6113).
        textCache = [
            textStr,
            ellipsis,
            noWrap,
            textLineHeight,
            textOutline,
            fontSize,
            width
        ].join(',');
        if (textCache === wrapper.textCache) {
            return;
        }
        wrapper.textCache = textCache;
        // Remove old text
        while (i--) {
            textNode.removeChild(childNodes[i]);
        }
        // Skip tspans, add text directly to text node. The forceTSpan is a hook
        // used in text outline hack.
        if (!hasMarkup &&
            !textOutline &&
            !ellipsis &&
            !width &&
            (textStr.indexOf(' ') === -1 ||
                (noWrap && !regexMatchBreaks.test(textStr)))) {
            textNode.appendChild(doc.createTextNode(unescapeEntities(textStr)));
            // Complex strings, add more logic
        }
        else {
            if (tempParent) {
                // attach it to the DOM to read offset width
                tempParent.appendChild(textNode);
            }
            if (hasMarkup) {
                lines = renderer.styledMode ? (textStr
                    .replace(/<(b|strong)>/g, '<span class="highcharts-strong">')
                    .replace(/<(i|em)>/g, '<span class="highcharts-emphasized">')) : (textStr
                    .replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
                    .replace(/<(i|em)>/g, '<span style="font-style:italic">'));
                lines = lines
                    .replace(/<a/g, '<span')
                    .replace(/<\/(b|strong|i|em|a)>/g, '</span>')
                    .split(regexMatchBreaks);
            }
            else {
                lines = [textStr];
            }
            // Trim empty lines (#5261)
            lines = lines.filter(function (line) {
                return line !== '';
            });
            // build the lines
            lines.forEach(function (line, lineNo) {
                var spans, spanNo = 0, lineLength = 0;
                line = line
                    // Trim to prevent useless/costly process on the spaces
                    // (#5258)
                    .replace(/^\s+|\s+$/g, '')
                    .replace(/<span/g, '|||<span')
                    .replace(/<\/span>/g, '</span>|||');
                spans = line.split('|||');
                spans.forEach(function buildTextSpans(span) {
                    if (span !== '' || spans.length === 1) {
                        var attributes = {}, tspan = doc.createElementNS(renderer.SVG_NS, 'tspan'), classAttribute, styleAttribute, // #390
                        hrefAttribute;
                        classAttribute = parseAttribute(span, 'class');
                        if (classAttribute) {
                            attr(tspan, 'class', classAttribute);
                        }
                        styleAttribute = parseAttribute(span, 'style');
                        if (styleAttribute) {
                            styleAttribute = styleAttribute.replace(/(;| |^)color([ :])/, '$1fill$2');
                            attr(tspan, 'style', styleAttribute);
                        }
                        // Not for export - #1529
                        hrefAttribute = parseAttribute(span, 'href');
                        if (hrefAttribute && !forExport) {
                            attr(tspan, 'onclick', 'location.href=\"' + hrefAttribute + '\"');
                            attr(tspan, 'class', 'highcharts-anchor');
                            if (!renderer.styledMode) {
                                css(tspan, { cursor: 'pointer' });
                            }
                        }
                        // Strip away unsupported HTML tags (#7126)
                        span = unescapeEntities(span.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' ');
                        // Nested tags aren't supported, and cause crash in
                        // Safari (#1596)
                        if (span !== ' ') {
                            // add the text node
                            tspan.appendChild(doc.createTextNode(span));
                            // First span in a line, align it to the left
                            if (!spanNo) {
                                if (lineNo && parentX !== null) {
                                    attributes.x = parentX;
                                }
                            }
                            else {
                                attributes.dx = 0; // #16
                            }
                            // add attributes
                            attr(tspan, attributes);
                            // Append it
                            textNode.appendChild(tspan);
                            // first span on subsequent line, add the line
                            // height
                            if (!spanNo && isSubsequentLine) {
                                // allow getting the right offset height in
                                // exporting in IE
                                if (!svg && forExport) {
                                    css(tspan, { display: 'block' });
                                }
                                // Set the line height based on the font size of
                                // either the text element or the tspan element
                                attr(tspan, 'dy', getLineHeight(tspan));
                            }
                            // Check width and apply soft breaks or ellipsis
                            if (width) {
                                var words = span.replace(/([^\^])-/g, '$1- ').split(' '), // #1273
                                hasWhiteSpace = !noWrap && (spans.length > 1 ||
                                    lineNo ||
                                    words.length > 1), wrapLineNo = 0, dy = getLineHeight(tspan);
                                if (ellipsis) {
                                    truncated = renderer.truncate(wrapper, tspan, span, void 0, 0, 
                                    // Target width
                                    Math.max(0, 
                                    // Substract the font face to make
                                    // room for the ellipsis itself
                                    width - parseInt(fontSize || 12, 10)), 
                                    // Build the text to test for
                                    function (text, currentIndex) {
                                        return text.substring(0, currentIndex) + '\u2026';
                                    });
                                }
                                else if (hasWhiteSpace) {
                                    while (words.length) {
                                        // For subsequent lines, create tspans
                                        // with the same style attributes as the
                                        // parent text node.
                                        if (words.length &&
                                            !noWrap &&
                                            wrapLineNo > 0) {
                                            tspan = doc.createElementNS(SVG_NS, 'tspan');
                                            attr(tspan, {
                                                dy: dy,
                                                x: parentX
                                            });
                                            if (styleAttribute) { // #390
                                                attr(tspan, 'style', styleAttribute);
                                            }
                                            // Start by appending the full
                                            // remaining text
                                            tspan.appendChild(doc.createTextNode(words.join(' ')
                                                .replace(/- /g, '-')));
                                            textNode.appendChild(tspan);
                                        }
                                        // For each line, truncate the remaining
                                        // words into the line length.
                                        renderer.truncate(wrapper, tspan, null, words, wrapLineNo === 0 ? lineLength : 0, width, 
                                        // Build the text to test for
                                        function (text, currentIndex) {
                                            return words
                                                .slice(0, currentIndex)
                                                .join(' ')
                                                .replace(/- /g, '-');
                                        });
                                        lineLength = wrapper.actualWidth;
                                        wrapLineNo++;
                                    }
                                }
                            }
                            spanNo++;
                        }
                    }
                });
                // To avoid beginning lines that doesn't add to the textNode
                // (#6144)
                isSubsequentLine = (isSubsequentLine ||
                    textNode.childNodes.length);
            });
            if (ellipsis && truncated) {
                wrapper.attr('title', unescapeEntities(wrapper.textStr, ['&lt;', '&gt;']) // #7179
                );
            }
            if (tempParent) {
                tempParent.removeChild(textNode);
            }
            // Apply the text outline
            if (textOutline && wrapper.applyTextOutline) {
                wrapper.applyTextOutline(textOutline);
            }
        }
    },
    /**
     * Returns white for dark colors and black for bright colors.
     *
     * @function Highcharts.SVGRenderer#getContrast
     *
     * @param {Highcharts.ColorString} rgba
     *        The color to get the contrast for.
     *
     * @return {Highcharts.ColorString}
     *         The contrast color, either `#000000` or `#FFFFFF`.
     */
    getContrast: function (rgba) {
        rgba = color(rgba).rgba;
        // The threshold may be discussed. Here's a proposal for adding
        // different weight to the color channels (#6216)
        rgba[0] *= 1; // red
        rgba[1] *= 1.2; // green
        rgba[2] *= 0.5; // blue
        return rgba[0] + rgba[1] + rgba[2] >
            1.8 * 255 ?
            '#000000' :
            '#FFFFFF';
    },
    /**
     * Create a button with preset states.
     *
     * @function Highcharts.SVGRenderer#button
     *
     * @param {string} text
     *        The text or HTML to draw.
     *
     * @param {number} x
     *        The x position of the button's left side.
     *
     * @param {number} y
     *        The y position of the button's top side.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.SVGElement>} callback
     *        The function to execute on button click or touch.
     *
     * @param {Highcharts.SVGAttributes} [normalState]
     *        SVG attributes for the normal state.
     *
     * @param {Highcharts.SVGAttributes} [hoverState]
     *        SVG attributes for the hover state.
     *
     * @param {Highcharts.SVGAttributes} [pressedState]
     *        SVG attributes for the pressed state.
     *
     * @param {Highcharts.SVGAttributes} [disabledState]
     *        SVG attributes for the disabled state.
     *
     * @param {Highcharts.SymbolKeyValue} [shape=rect]
     *        The shape type.
     *
     * @param {boolean} [useHTML=false]
     *        Wether to use HTML to render the label.
     *
     * @return {Highcharts.SVGElement}
     *         The button element.
     */
    button: function (text, x, y, callback, normalState, hoverState, pressedState, disabledState, shape, useHTML) {
        var label = this.label(text, x, y, shape, null, null, useHTML, null, 'button'), curState = 0, styledMode = this.styledMode;
        // Default, non-stylable attributes
        label.attr(merge({ padding: 8, r: 2 }, normalState));
        if (!styledMode) {
            // Presentational
            var normalStyle, hoverStyle, pressedStyle, disabledStyle;
            // Normal state - prepare the attributes
            normalState = merge({
                fill: '${palette.neutralColor3}',
                stroke: '${palette.neutralColor20}',
                'stroke-width': 1,
                style: {
                    color: '${palette.neutralColor80}',
                    cursor: 'pointer',
                    fontWeight: 'normal'
                }
            }, normalState);
            normalStyle = normalState.style;
            delete normalState.style;
            // Hover state
            hoverState = merge(normalState, {
                fill: '${palette.neutralColor10}'
            }, hoverState);
            hoverStyle = hoverState.style;
            delete hoverState.style;
            // Pressed state
            pressedState = merge(normalState, {
                fill: '${palette.highlightColor10}',
                style: {
                    color: '${palette.neutralColor100}',
                    fontWeight: 'bold'
                }
            }, pressedState);
            pressedStyle = pressedState.style;
            delete pressedState.style;
            // Disabled state
            disabledState = merge(normalState, {
                style: {
                    color: '${palette.neutralColor20}'
                }
            }, disabledState);
            disabledStyle = disabledState.style;
            delete disabledState.style;
        }
        // Add the events. IE9 and IE10 need mouseover and mouseout to funciton
        // (#667).
        addEvent(label.element, isMS ? 'mouseover' : 'mouseenter', function () {
            if (curState !== 3) {
                label.setState(1);
            }
        });
        addEvent(label.element, isMS ? 'mouseout' : 'mouseleave', function () {
            if (curState !== 3) {
                label.setState(curState);
            }
        });
        label.setState = function (state) {
            // Hover state is temporary, don't record it
            if (state !== 1) {
                label.state = curState = state;
            }
            // Update visuals
            label
                .removeClass(/highcharts-button-(normal|hover|pressed|disabled)/)
                .addClass('highcharts-button-' +
                ['normal', 'hover', 'pressed', 'disabled'][state || 0]);
            if (!styledMode) {
                label
                    .attr([
                    normalState,
                    hoverState,
                    pressedState,
                    disabledState
                ][state || 0])
                    .css([
                    normalStyle,
                    hoverStyle,
                    pressedStyle,
                    disabledStyle
                ][state || 0]);
            }
        };
        // Presentational attributes
        if (!styledMode) {
            label
                .attr(normalState)
                .css(extend({ cursor: 'default' }, normalStyle));
        }
        return label
            .on('click', function (e) {
            if (curState !== 3) {
                callback.call(label, e);
            }
        });
    },
    /**
     * Make a straight line crisper by not spilling out to neighbour pixels.
     *
     * @function Highcharts.SVGRenderer#crispLine
     *
     * @param {Highcharts.SVGPathArray} points
     *        The original points on the format `['M', 0, 0, 'L', 100, 0]`.
     *
     * @param {number} width
     *        The width of the line.
     *
     * @return {Highcharts.SVGPathArray}
     *         The original points array, but modified to render crisply.
     */
    crispLine: function (points, width) {
        // normalize to a crisp line
        if (points[1] === points[4]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            points[1] = points[4] =
                Math.round(points[1]) - (width % 2 / 2);
        }
        if (points[2] === points[5]) {
            points[2] = points[5] =
                Math.round(points[2]) + (width % 2 / 2);
        }
        return points;
    },
    /**
     * Draw a path, wraps the SVG `path` element.
     *
     * @sample highcharts/members/renderer-path-on-chart/
     *         Draw a path in a chart
     * @sample highcharts/members/renderer-path/
     *         Draw a path independent from a chart
     *
     * @example
     * var path = renderer.path(['M', 10, 10, 'L', 30, 30, 'z'])
     *     .attr({ stroke: '#ff00ff' })
     *     .add();
     *
     * @function Highcharts.SVGRenderer#path
     *
     * @param {Highcharts.SVGPathArray} [path]
     *        An SVG path definition in array form.
     *
     * @return {Highcharts.SVGElement}
     *         The generated wrapper element.
     *
     */ /**
    * Draw a path, wraps the SVG `path` element.
    *
    * @function Highcharts.SVGRenderer#path
    *
    * @param {Highcharts.SVGAttributes} [attribs]
    *        The initial attributes.
    *
    * @return {Highcharts.SVGElement}
    *         The generated wrapper element.
    */
    path: function (path) {
        var attribs = (this.styledMode ? {} : {
            fill: 'none'
        });
        if (isArray(path)) {
            attribs.d = path;
        }
        else if (isObject(path)) { // attributes
            extend(attribs, path);
        }
        return this.createElement('path').attr(attribs);
    },
    /**
     * Draw a circle, wraps the SVG `circle` element.
     *
     * @sample highcharts/members/renderer-circle/
     *         Drawing a circle
     *
     * @function Highcharts.SVGRenderer#circle
     *
     * @param {number} [x]
     *        The center x position.
     *
     * @param {number} [y]
     *        The center y position.
     *
     * @param {number} [r]
     *        The radius.
     *
     * @return {Highcharts.SVGElement}
     *         The generated wrapper element.
     */ /**
    * Draw a circle, wraps the SVG `circle` element.
    *
    * @function Highcharts.SVGRenderer#circle
    *
    * @param {Highcharts.SVGAttributes} [attribs]
    *        The initial attributes.
    *
    * @return {Highcharts.SVGElement}
    *         The generated wrapper element.
    */
    circle: function (x, y, r) {
        var attribs = (isObject(x) ?
            x :
            typeof x === 'undefined' ? {} : { x: x, y: y, r: r }), wrapper = this.createElement('circle');
        // Setting x or y translates to cx and cy
        wrapper.xSetter = wrapper.ySetter = function (value, key, element) {
            element.setAttribute('c' + key, value);
        };
        return wrapper.attr(attribs);
    },
    /**
     * Draw and return an arc.
     *
     * @sample highcharts/members/renderer-arc/
     *         Drawing an arc
     *
     * @function Highcharts.SVGRenderer#arc
     *
     * @param {number} [x=0]
     *        Center X position.
     *
     * @param {number} [y=0]
     *        Center Y position.
     *
     * @param {number} [r=0]
     *        The outer radius' of the arc.
     *
     * @param {number} [innerR=0]
     *        Inner radius like used in donut charts.
     *
     * @param {number} [start=0]
     *        The starting angle of the arc in radians, where 0 is to the right
     *         and `-Math.PI/2` is up.
     *
     * @param {number} [end=0]
     *        The ending angle of the arc in radians, where 0 is to the right
     *        and `-Math.PI/2` is up.
     *
     * @return {Highcharts.SVGElement}
     *         The generated wrapper element.
     */ /**
    * Draw and return an arc. Overloaded function that takes arguments object.
    *
    * @function Highcharts.SVGRenderer#arc
    *
    * @param {Highcharts.SVGAttributes} attribs
    *        Initial SVG attributes.
    *
    * @return {Highcharts.SVGElement}
    *         The generated wrapper element.
    */
    arc: function (x, y, r, innerR, start, end) {
        var arc, options;
        if (isObject(x)) {
            options = x;
            y = options.y;
            r = options.r;
            innerR = options.innerR;
            start = options.start;
            end = options.end;
            x = options.x;
        }
        else {
            options = {
                innerR: innerR,
                start: start,
                end: end
            };
        }
        // Arcs are defined as symbols for the ability to set
        // attributes in attr and animate
        arc = this.symbol('arc', x, y, r, r, options);
        arc.r = r; // #959
        return arc;
    },
    /**
     * Draw and return a rectangle.
     *
     * @function Highcharts.SVGRenderer#rect
     *
     * @param {number} [x]
     *        Left position.
     *
     * @param {number} [y]
     *        Top position.
     *
     * @param {number} [width]
     *        Width of the rectangle.
     *
     * @param {number} [height]
     *        Height of the rectangle.
     *
     * @param {number} [r]
     *        Border corner radius.
     *
     * @param {number} [strokeWidth]
     *        A stroke width can be supplied to allow crisp drawing.
     *
     * @return {Highcharts.SVGElement}
     *         The generated wrapper element.
     */ /**
    * Draw and return a rectangle.
    *
    * @sample highcharts/members/renderer-rect-on-chart/
    *         Draw a rectangle in a chart
    * @sample highcharts/members/renderer-rect/
    *         Draw a rectangle independent from a chart
    *
    * @function Highcharts.SVGRenderer#rect
    *
    * @param {Highcharts.SVGAttributes} [attributes]
    *        General SVG attributes for the rectangle.
    *
    * @return {Highcharts.SVGElement}
    *         The generated wrapper element.
    */
    rect: function (x, y, width, height, r, strokeWidth) {
        r = isObject(x) ? x.r : r;
        var wrapper = this.createElement('rect'), attribs = isObject(x) ?
            x :
            typeof x === 'undefined' ?
                {} :
                {
                    x: x,
                    y: y,
                    width: Math.max(width, 0),
                    height: Math.max(height, 0)
                };
        if (!this.styledMode) {
            if (typeof strokeWidth !== 'undefined') {
                attribs.strokeWidth = strokeWidth;
                attribs = wrapper.crisp(attribs);
            }
            attribs.fill = 'none';
        }
        if (r) {
            attribs.r = r;
        }
        wrapper.rSetter = function (value, key, element) {
            wrapper.r = value;
            attr(element, {
                rx: value,
                ry: value
            });
        };
        wrapper.rGetter = function () {
            return wrapper.r;
        };
        return wrapper.attr(attribs);
    },
    /**
     * Resize the {@link SVGRenderer#box} and re-align all aligned child
     * elements.
     *
     * @sample highcharts/members/renderer-g/
     *         Show and hide grouped objects
     *
     * @function Highcharts.SVGRenderer#setSize
     *
     * @param {number} width
     *        The new pixel width.
     *
     * @param {number} height
     *        The new pixel height.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animate=true]
     *        Whether and how to animate.
     *
     * @return {void}
     */
    setSize: function (width, height, animate) {
        var renderer = this, alignedObjects = renderer.alignedObjects, i = alignedObjects.length;
        renderer.width = width;
        renderer.height = height;
        renderer.boxWrapper.animate({
            width: width,
            height: height
        }, {
            step: function () {
                this.attr({
                    viewBox: '0 0 ' + this.attr('width') + ' ' +
                        this.attr('height')
                });
            },
            duration: pick(animate, true) ? void 0 : 0
        });
        while (i--) {
            alignedObjects[i].align();
        }
    },
    /**
     * Create and return an svg group element. Child
     * {@link Highcharts.SVGElement} objects are added to the group by using the
     * group as the first parameter in {@link Highcharts.SVGElement#add|add()}.
     *
     * @function Highcharts.SVGRenderer#g
     *
     * @param {string} [name]
     *        The group will be given a class name of `highcharts-{name}`. This
     *        can be used for styling and scripting.
     *
     * @return {Highcharts.SVGElement}
     *         The generated wrapper element.
     */
    g: function (name) {
        var elem = this.createElement('g');
        return name ?
            elem.attr({ 'class': 'highcharts-' + name }) :
            elem;
    },
    /**
     * Display an image.
     *
     * @sample highcharts/members/renderer-image-on-chart/
     *         Add an image in a chart
     * @sample highcharts/members/renderer-image/
     *         Add an image independent of a chart
     *
     * @function Highcharts.SVGRenderer#image
     *
     * @param {string} src
     *        The image source.
     *
     * @param {number} [x]
     *        The X position.
     *
     * @param {number} [y]
     *        The Y position.
     *
     * @param {number} [width]
     *        The image width. If omitted, it defaults to the image file width.
     *
     * @param {number} [height]
     *        The image height. If omitted it defaults to the image file
     *        height.
     *
     * @param {Function} [onload]
     *        Event handler for image load.
     *
     * @return {Highcharts.SVGElement}
     *         The generated wrapper element.
     */
    image: function (src, x, y, width, height, onload) {
        var attribs = { preserveAspectRatio: 'none' }, elemWrapper, dummy, setSVGImageSource = function (el, src) {
            // Set the href in the xlink namespace
            if (el.setAttributeNS) {
                el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
            }
            else {
                // could be exporting in IE
                // using href throws "not supported" in ie7 and under,
                // requries regex shim to fix later
                el.setAttribute('hc-svg-href', src);
            }
        }, onDummyLoad = function (e) {
            setSVGImageSource(elemWrapper.element, src);
            onload.call(elemWrapper, e);
        };
        // optional properties
        if (arguments.length > 1) {
            extend(attribs, {
                x: x,
                y: y,
                width: width,
                height: height
            });
        }
        elemWrapper = this.createElement('image').attr(attribs);
        // Add load event if supplied
        if (onload) {
            // We have to use a dummy HTML image since IE support for SVG image
            // load events is very buggy. First set a transparent src, wait for
            // dummy to load, and then add the real src to the SVG image.
            setSVGImageSource(elemWrapper.element, 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' /* eslint-disable-line */);
            dummy = new win.Image();
            addEvent(dummy, 'load', onDummyLoad);
            dummy.src = src;
            if (dummy.complete) {
                onDummyLoad({});
            }
        }
        else {
            setSVGImageSource(elemWrapper.element, src);
        }
        return elemWrapper;
    },
    /**
     * Draw a symbol out of pre-defined shape paths from
     * {@link SVGRenderer#symbols}.
     * It is used in Highcharts for point makers, which cake a `symbol` option,
     * and label and button backgrounds like in the tooltip and stock flags.
     *
     * @function Highcharts.SVGRenderer#symbol
     *
     * @param {string} symbol
     *        The symbol name.
     *
     * @param {number} [x]
     *        The X coordinate for the top left position.
     *
     * @param {number} [y]
     *        The Y coordinate for the top left position.
     *
     * @param {number} [width]
     *        The pixel width.
     *
     * @param {number} [height]
     *        The pixel height.
     *
     * @param {Highcharts.SymbolOptionsObject} [options]
     *        Additional options, depending on the actual symbol drawn.
     *
     * @return {Highcharts.SVGElement}
     */
    symbol: function (symbol, x, y, width, height, options) {
        var ren = this, obj, imageRegex = /^url\((.*?)\)$/, isImage = imageRegex.test(symbol), sym = (!isImage && (this.symbols[symbol] ? symbol : 'circle')), 
        // get the symbol definition function
        symbolFn = (sym && this.symbols[sym]), 
        // check if there's a path defined for this symbol
        path = (defined(x) && symbolFn && symbolFn.call(this.symbols, Math.round(x), Math.round(y), width, height, options)), imageSrc, centerImage;
        if (symbolFn) {
            obj = this.path(path);
            if (!ren.styledMode) {
                obj.attr('fill', 'none');
            }
            // expando properties for use in animate and attr
            extend(obj, {
                symbolName: sym,
                x: x,
                y: y,
                width: width,
                height: height
            });
            if (options) {
                extend(obj, options);
            }
            // Image symbols
        }
        else if (isImage) {
            imageSrc = symbol.match(imageRegex)[1];
            // Create the image synchronously, add attribs async
            obj = this.image(imageSrc);
            // The image width is not always the same as the symbol width. The
            // image may be centered within the symbol, as is the case when
            // image shapes are used as label backgrounds, for example in flags.
            obj.imgwidth = pick(symbolSizes[imageSrc] && symbolSizes[imageSrc].width, options && options.width);
            obj.imgheight = pick(symbolSizes[imageSrc] && symbolSizes[imageSrc].height, options && options.height);
            /**
             * Set the size and position
             */
            centerImage = function () {
                obj.attr({
                    width: obj.width,
                    height: obj.height
                });
            };
            /**
             * Width and height setters that take both the image's physical size
             * and the label size into consideration, and translates the image
             * to center within the label.
             */
            ['width', 'height'].forEach(function (key) {
                obj[key + 'Setter'] = function (value, key) {
                    var attribs = {}, imgSize = this['img' + key], trans = key === 'width' ? 'translateX' : 'translateY';
                    this[key] = value;
                    if (defined(imgSize)) {
                        // Scale and center the image within its container.
                        // The name `backgroundSize` is taken from the CSS spec,
                        // but the value `within` is made up. Other possible
                        // values in the spec, `cover` and `contain`, can be
                        // implemented if needed.
                        if (options &&
                            options.backgroundSize === 'within' &&
                            this.width &&
                            this.height) {
                            imgSize = Math.round(imgSize * Math.min(this.width / this.imgwidth, this.height / this.imgheight));
                        }
                        if (this.element) {
                            this.element.setAttribute(key, imgSize);
                        }
                        if (!this.alignByTranslate) {
                            attribs[trans] = ((this[key] || 0) - imgSize) / 2;
                            this.attr(attribs);
                        }
                    }
                };
            });
            if (defined(x)) {
                obj.attr({
                    x: x,
                    y: y
                });
            }
            obj.isImg = true;
            if (defined(obj.imgwidth) && defined(obj.imgheight)) {
                centerImage();
            }
            else {
                // Initialize image to be 0 size so export will still function
                // if there's no cached sizes.
                obj.attr({ width: 0, height: 0 });
                // Create a dummy JavaScript image to get the width and height.
                createElement('img', {
                    onload: function () {
                        var chart = charts[ren.chartIndex];
                        // Special case for SVGs on IE11, the width is not
                        // accessible until the image is part of the DOM
                        // (#2854).
                        if (this.width === 0) {
                            css(this, {
                                position: 'absolute',
                                top: '-999em'
                            });
                            doc.body.appendChild(this);
                        }
                        // Center the image
                        symbolSizes[imageSrc] = {
                            width: this.width,
                            height: this.height
                        };
                        obj.imgwidth = this.width;
                        obj.imgheight = this.height;
                        if (obj.element) {
                            centerImage();
                        }
                        // Clean up after #2854 workaround.
                        if (this.parentNode) {
                            this.parentNode.removeChild(this);
                        }
                        // Fire the load event when all external images are
                        // loaded
                        ren.imgCount--;
                        if (!ren.imgCount && chart && chart.onload) {
                            chart.onload();
                        }
                    },
                    src: imageSrc
                });
                this.imgCount++;
            }
        }
        return obj;
    },
    /**
     * An extendable collection of functions for defining symbol paths.
     *
     * @name Highcharts.SVGRenderer#symbols
     * @type {Highcharts.SymbolDictionary}
     */
    symbols: {
        circle: function (x, y, w, h) {
            // Return a full arc
            return this.arc(x + w / 2, y + h / 2, w / 2, h / 2, {
                start: Math.PI * 0.5,
                end: Math.PI * 2.5,
                open: false
            });
        },
        square: function (x, y, w, h) {
            return [
                'M', x, y,
                'L', x + w, y,
                x + w, y + h,
                x, y + h,
                'Z'
            ];
        },
        triangle: function (x, y, w, h) {
            return [
                'M', x + w / 2, y,
                'L', x + w, y + h,
                x, y + h,
                'Z'
            ];
        },
        'triangle-down': function (x, y, w, h) {
            return [
                'M', x, y,
                'L', x + w, y,
                x + w / 2, y + h,
                'Z'
            ];
        },
        diamond: function (x, y, w, h) {
            return [
                'M', x + w / 2, y,
                'L', x + w, y + h / 2,
                x + w / 2, y + h,
                x, y + h / 2,
                'Z'
            ];
        },
        arc: function (x, y, w, h, options) {
            var start = options.start, rx = options.r || w, ry = options.r || h || w, proximity = 0.001, fullCircle = Math.abs(options.end - options.start - 2 * Math.PI) <
                proximity, 
            // Substract a small number to prevent cos and sin of start and
            // end from becoming equal on 360 arcs (related: #1561)
            end = options.end - proximity, innerRadius = options.innerR, open = pick(options.open, fullCircle), cosStart = Math.cos(start), sinStart = Math.sin(start), cosEnd = Math.cos(end), sinEnd = Math.sin(end), 
            // Proximity takes care of rounding errors around PI (#6971)
            longArc = pick(options.longArc, options.end - start - Math.PI < proximity ? 0 : 1), arc;
            arc = [
                'M',
                x + rx * cosStart,
                y + ry * sinStart,
                'A',
                rx,
                ry,
                0,
                longArc,
                pick(options.clockwise, 1),
                x + rx * cosEnd,
                y + ry * sinEnd
            ];
            if (defined(innerRadius)) {
                arc.push(open ? 'M' : 'L', x + innerRadius * cosEnd, y + innerRadius * sinEnd, 'A', // arcTo
                innerRadius, // x radius
                innerRadius, // y radius
                0, // slanting
                longArc, // long or short arc
                // Clockwise - opposite to the outer arc clockwise
                defined(options.clockwise) ? 1 - options.clockwise : 0, x + innerRadius * cosStart, y + innerRadius * sinStart);
            }
            arc.push(open ? '' : 'Z'); // close
            return arc;
        },
        /**
         * Callout shape used for default tooltips, also used for rounded
         * rectangles in VML
         */
        callout: function (x, y, w, h, options) {
            var arrowLength = 6, halfDistance = 6, r = Math.min((options && options.r) || 0, w, h), safeDistance = r + halfDistance, anchorX = options && options.anchorX, anchorY = options && options.anchorY, path;
            path = [
                'M', x + r, y,
                'L', x + w - r, y,
                'C', x + w, y, x + w, y, x + w, y + r,
                'L', x + w, y + h - r,
                'C', x + w, y + h, x + w, y + h, x + w - r, y + h,
                'L', x + r, y + h,
                'C', x, y + h, x, y + h, x, y + h - r,
                'L', x, y + r,
                'C', x, y, x, y, x + r, y // top-left corner
            ];
            // Anchor on right side
            if (anchorX && anchorX > w) {
                // Chevron
                if (anchorY > y + safeDistance &&
                    anchorY < y + h - safeDistance) {
                    path.splice(13, 3, 'L', x + w, anchorY - halfDistance, x + w + arrowLength, anchorY, x + w, anchorY + halfDistance, x + w, y + h - r);
                    // Simple connector
                }
                else {
                    path.splice(13, 3, 'L', x + w, h / 2, anchorX, anchorY, x + w, h / 2, x + w, y + h - r);
                }
                // Anchor on left side
            }
            else if (anchorX && anchorX < 0) {
                // Chevron
                if (anchorY > y + safeDistance &&
                    anchorY < y + h - safeDistance) {
                    path.splice(33, 3, 'L', x, anchorY + halfDistance, x - arrowLength, anchorY, x, anchorY - halfDistance, x, y + r);
                    // Simple connector
                }
                else {
                    path.splice(33, 3, 'L', x, h / 2, anchorX, anchorY, x, h / 2, x, y + r);
                }
            }
            else if ( // replace bottom
            anchorY &&
                anchorY > h &&
                anchorX > x + safeDistance &&
                anchorX < x + w - safeDistance) {
                path.splice(23, 3, 'L', anchorX + halfDistance, y + h, anchorX, y + h + arrowLength, anchorX - halfDistance, y + h, x + r, y + h);
            }
            else if ( // replace top
            anchorY &&
                anchorY < 0 &&
                anchorX > x + safeDistance &&
                anchorX < x + w - safeDistance) {
                path.splice(3, 3, 'L', anchorX - halfDistance, y, anchorX, y - arrowLength, anchorX + halfDistance, y, w - r, y);
            }
            return path;
        }
    },
    /**
     * Define a clipping rectangle. The clipping rectangle is later applied
     * to {@link SVGElement} objects through the {@link SVGElement#clip}
     * function.
     *
     * @example
     * var circle = renderer.circle(100, 100, 100)
     *     .attr({ fill: 'red' })
     *     .add();
     * var clipRect = renderer.clipRect(100, 100, 100, 100);
     *
     * // Leave only the lower right quarter visible
     * circle.clip(clipRect);
     *
     * @function Highcharts.SVGRenderer#clipRect
     *
     * @param {number} [x]
     *
     * @param {number} [y]
     *
     * @param {number} [width]
     *
     * @param {number} [height]
     *
     * @return {Highcharts.ClipRectElement}
     *         A clipping rectangle.
     */
    clipRect: function (x, y, width, height) {
        var wrapper, 
        // Add a hyphen at the end to avoid confusion in testing indexes
        // -1 and -10, -11 etc (#6550)
        id = H.uniqueKey() + '-', clipPath = this.createElement('clipPath').attr({
            id: id
        }).add(this.defs);
        wrapper = this.rect(x, y, width, height, 0).add(clipPath);
        wrapper.id = id;
        wrapper.clipPath = clipPath;
        wrapper.count = 0;
        return wrapper;
    },
    /**
     * Draw text. The text can contain a subset of HTML, like spans and anchors
     * and some basic text styling of these. For more advanced features like
     * border and background, use {@link Highcharts.SVGRenderer#label} instead.
     * To update the text after render, run `text.attr({ text: 'New text' })`.
     *
     * @sample highcharts/members/renderer-text-on-chart/
     *         Annotate the chart freely
     * @sample highcharts/members/renderer-on-chart/
     *         Annotate with a border and in response to the data
     * @sample highcharts/members/renderer-text/
     *         Formatted text
     *
     * @function Highcharts.SVGRenderer#text
     *
     * @param {string} [str]
     *        The text of (subset) HTML to draw.
     *
     * @param {number} [x]
     *        The x position of the text's lower left corner.
     *
     * @param {number} [y]
     *        The y position of the text's lower left corner.
     *
     * @param {boolean} [useHTML=false]
     *        Use HTML to render the text.
     *
     * @return {Highcharts.SVGElement}
     *         The text object.
     */
    text: function (str, x, y, useHTML) {
        // declare variables
        var renderer = this, wrapper, attribs = {};
        if (useHTML && (renderer.allowHTML || !renderer.forExport)) {
            return renderer.html(str, x, y);
        }
        attribs.x = Math.round(x || 0); // X always needed for line-wrap logic
        if (y) {
            attribs.y = Math.round(y);
        }
        if (defined(str)) {
            attribs.text = str;
        }
        wrapper = renderer.createElement('text')
            .attr(attribs);
        if (!useHTML) {
            wrapper.xSetter = function (value, key, element) {
                var tspans = element.getElementsByTagName('tspan'), tspan, parentVal = element.getAttribute(key), i;
                for (i = 0; i < tspans.length; i++) {
                    tspan = tspans[i];
                    // If the x values are equal, the tspan represents a
                    // linebreak
                    if (tspan.getAttribute(key) === parentVal) {
                        tspan.setAttribute(key, value);
                    }
                }
                element.setAttribute(key, value);
            };
        }
        return wrapper;
    },
    /**
     * Utility to return the baseline offset and total line height from the font
     * size.
     *
     * @function Highcharts.SVGRenderer#fontMetrics
     *
     * @param {number|string} [fontSize]
     *        The current font size to inspect. If not given, the font size
     *        will be found from the DOM element.
     *
     * @param {Highcharts.SVGElement|Highcharts.SVGDOMElement} [elem]
     *        The element to inspect for a current font size.
     *
     * @return {Highcharts.FontMetricsObject}
     *         The font metrics.
     */
    fontMetrics: function (fontSize, elem) {
        var lineHeight, baseline;
        if ((this.styledMode || !/px/.test(fontSize)) &&
            win.getComputedStyle // old IE doesn't support it
        ) {
            fontSize = elem && SVGElement.prototype.getStyle.call(elem, 'font-size');
        }
        else {
            fontSize = fontSize ||
                // When the elem is a DOM element (#5932)
                (elem && elem.style && elem.style.fontSize) ||
                // Fall back on the renderer style default
                (this.style && this.style.fontSize);
        }
        // Handle different units
        if (/px/.test(fontSize)) {
            fontSize = pInt(fontSize);
        }
        else {
            fontSize = 12;
        }
        // Empirical values found by comparing font size and bounding box
        // height. Applies to the default font family.
        // https://jsfiddle.net/highcharts/7xvn7/
        lineHeight = fontSize < 24 ? fontSize + 3 : Math.round(fontSize * 1.2);
        baseline = Math.round(lineHeight * 0.8);
        return {
            h: lineHeight,
            b: baseline,
            f: fontSize
        };
    },
    /**
     * Correct X and Y positioning of a label for rotation (#1764).
     *
     * @private
     * @function Highcharts.SVGRenderer#rotCorr
     *
     * @param {number} baseline
     *
     * @param {number} rotation
     *
     * @param {boolean} [alterY]
     *
     * @param {Highcharts.PositionObject}
     */
    rotCorr: function (baseline, rotation, alterY) {
        var y = baseline;
        if (rotation && alterY) {
            y = Math.max(y * Math.cos(rotation * deg2rad), 4);
        }
        return {
            x: (-baseline / 3) * Math.sin(rotation * deg2rad),
            y: y
        };
    },
    /**
     * Draw a label, which is an extended text element with support for border
     * and background. Highcharts creates a `g` element with a text and a `path`
     * or `rect` inside, to make it behave somewhat like a HTML div. Border and
     * background are set through `stroke`, `stroke-width` and `fill` attributes
     * using the {@link Highcharts.SVGElement#attr|attr} method. To update the
     * text after render, run `label.attr({ text: 'New text' })`.
     *
     * @sample highcharts/members/renderer-label-on-chart/
     *         A label on the chart
     *
     * @function Highcharts.SVGRenderer#label
     *
     * @param {string} str
     *        The initial text string or (subset) HTML to render.
     *
     * @param {number} x
     *        The x position of the label's left side.
     *
     * @param {number} [y]
     *        The y position of the label's top side or baseline, depending on
     *        the `baseline` parameter.
     *
     * @param {string} [shape='rect']
     *        The shape of the label's border/background, if any. Defaults to
     *        `rect`. Other possible values are `callout` or other shapes
     *        defined in {@link Highcharts.SVGRenderer#symbols}.
     *
     * @param {number} [anchorX]
     *        In case the `shape` has a pointer, like a flag, this is the
     *        coordinates it should be pinned to.
     *
     * @param {number} [anchorY]
     *        In case the `shape` has a pointer, like a flag, this is the
     *        coordinates it should be pinned to.
     *
     * @param {boolean} [useHTML=false]
     *        Wether to use HTML to render the label.
     *
     * @param {boolean} [baseline=false]
     *        Whether to position the label relative to the text baseline,
     *        like {@link Highcharts.SVGRenderer#text|renderer.text}, or to the
     *        upper border of the rectangle.
     *
     * @param {string} [className]
     *        Class name for the group.
     *
     * @return {Highcharts.SVGElement}
     *         The generated label.
     */
    label: function (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {
        var renderer = this, styledMode = renderer.styledMode, wrapper = renderer.g((className !== 'button' && 'label')), text = wrapper.text = renderer.text('', 0, 0, useHTML)
            .attr({
            zIndex: 1
        }), box, bBox, alignFactor = 0, padding = 3, paddingLeft = 0, width, height, wrapperX, wrapperY, textAlign, deferredAttr = {}, strokeWidth, baselineOffset, hasBGImage = /^url\((.*?)\)$/.test(shape), needsBox = styledMode || hasBGImage, getCrispAdjust = function () {
            return styledMode ?
                box.strokeWidth() % 2 / 2 :
                (strokeWidth ? parseInt(strokeWidth, 10) : 0) % 2 / 2;
        }, updateBoxSize, updateTextPadding, boxAttr;
        if (className) {
            wrapper.addClass('highcharts-' + className);
        }
        /* This function runs after the label is added to the DOM (when the
           bounding box is available), and after the text of the label is
           updated to detect the new bounding box and reflect it in the border
           box. */
        updateBoxSize = function () {
            var style = text.element.style, crispAdjust, attribs = {};
            bBox = ((typeof width === 'undefined' ||
                typeof height === 'undefined' ||
                textAlign) &&
                defined(text.textStr) &&
                text.getBBox()); // #3295 && 3514 box failure when string equals 0
            wrapper.width = ((width || bBox.width || 0) +
                2 * padding +
                paddingLeft);
            wrapper.height = (height || bBox.height || 0) + 2 * padding;
            // Update the label-scoped y offset
            baselineOffset = padding + Math.min(renderer
                .fontMetrics(style && style.fontSize, text).b, 
            // Math.min because of inline style (#9400)
            bBox ? bBox.height : Infinity);
            if (needsBox) {
                // Create the border box if it is not already present
                if (!box) {
                    // Symbol definition exists (#5324)
                    wrapper.box = box =
                        renderer.symbols[shape] || hasBGImage ?
                            renderer.symbol(shape) :
                            renderer.rect();
                    box.addClass(// Don't use label className for buttons
                    (className === 'button' ? '' : 'highcharts-label-box') +
                        (className ? ' highcharts-' + className + '-box' : ''));
                    box.add(wrapper);
                    crispAdjust = getCrispAdjust();
                    attribs.x = crispAdjust;
                    attribs.y = (baseline ? -baselineOffset : 0) + crispAdjust;
                }
                // Apply the box attributes
                attribs.width = Math.round(wrapper.width);
                attribs.height = Math.round(wrapper.height);
                box.attr(extend(attribs, deferredAttr));
                deferredAttr = {};
            }
        };
        /*
         * This function runs after setting text or padding, but only if padding
         * is changed.
         */
        updateTextPadding = function () {
            var textX = paddingLeft + padding, textY;
            // determin y based on the baseline
            textY = baseline ? 0 : baselineOffset;
            // compensate for alignment
            if (defined(width) &&
                bBox &&
                (textAlign === 'center' || textAlign === 'right')) {
                textX += { center: 0.5, right: 1 }[textAlign] *
                    (width - bBox.width);
            }
            // update if anything changed
            if (textX !== text.x || textY !== text.y) {
                text.attr('x', textX);
                // #8159 - prevent misplaced data labels in treemap
                // (useHTML: true)
                if (text.hasBoxWidthChanged) {
                    bBox = text.getBBox(true);
                    updateBoxSize();
                }
                if (typeof textY !== 'undefined') {
                    text.attr('y', textY);
                }
            }
            // record current values
            text.x = textX;
            text.y = textY;
        };
        /*
         * Set a box attribute, or defer it if the box is not yet created
         */
        boxAttr = function (key, value) {
            if (box) {
                box.attr(key, value);
            }
            else {
                deferredAttr[key] = value;
            }
        };
        /*
         * After the text element is added, get the desired size of the border
         * box and add it before the text in the DOM.
         */
        wrapper.onAdd = function () {
            text.add(wrapper);
            wrapper.attr({
                // Alignment is available now  (#3295, 0 not rendered if given
                // as a value)
                text: (str || str === 0) ? str : '',
                x: x,
                y: y
            });
            if (box && defined(anchorX)) {
                wrapper.attr({
                    anchorX: anchorX,
                    anchorY: anchorY
                });
            }
        };
        /*
         * Add specific attribute setters.
         */
        // only change local variables
        wrapper.widthSetter = function (value) {
            // width:auto => null
            width = isNumber(value) ? value : null;
        };
        wrapper.heightSetter = function (value) {
            height = value;
        };
        wrapper['text-alignSetter'] = function (value) {
            textAlign = value;
        };
        wrapper.paddingSetter = function (value) {
            if (defined(value) && value !== padding) {
                padding = wrapper.padding = value;
                updateTextPadding();
            }
        };
        wrapper.paddingLeftSetter = function (value) {
            if (defined(value) && value !== paddingLeft) {
                paddingLeft = value;
                updateTextPadding();
            }
        };
        // change local variable and prevent setting attribute on the group
        wrapper.alignSetter = function (value) {
            value = {
                left: 0,
                center: 0.5,
                right: 1
            }[value];
            if (value !== alignFactor) {
                alignFactor = value;
                // Bounding box exists, means we're dynamically changing
                if (bBox) {
                    wrapper.attr({ x: wrapperX }); // #5134
                }
            }
        };
        // apply these to the box and the text alike
        wrapper.textSetter = function (value) {
            if (typeof value !== 'undefined') {
                // Must use .attr to ensure transforms are done (#10009)
                text.attr({
                    text: value
                });
            }
            updateBoxSize();
            updateTextPadding();
        };
        // apply these to the box but not to the text
        wrapper['stroke-widthSetter'] = function (value, key) {
            if (value) {
                needsBox = true;
            }
            strokeWidth = this['stroke-width'] = value;
            boxAttr(key, value);
        };
        if (styledMode) {
            wrapper.rSetter = function (value, key) {
                boxAttr(key, value);
            };
        }
        else {
            wrapper.strokeSetter =
                wrapper.fillSetter =
                    wrapper.rSetter = function (value, key) {
                        if (key !== 'r') {
                            if (key === 'fill' && value) {
                                needsBox = true;
                            }
                            // for animation getter (#6776)
                            wrapper[key] = value;
                        }
                        boxAttr(key, value);
                    };
        }
        wrapper.anchorXSetter = function (value, key) {
            anchorX = wrapper.anchorX = value;
            boxAttr(key, Math.round(value) - getCrispAdjust() - wrapperX);
        };
        wrapper.anchorYSetter = function (value, key) {
            anchorY = wrapper.anchorY = value;
            boxAttr(key, value - wrapperY);
        };
        // rename attributes
        wrapper.xSetter = function (value) {
            wrapper.x = value; // for animation getter
            if (alignFactor) {
                value -= alignFactor * ((width || bBox.width) + 2 * padding);
                // Force animation even when setting to the same value (#7898)
                wrapper['forceAnimate:x'] = true;
            }
            wrapperX = Math.round(value);
            wrapper.attr('translateX', wrapperX);
        };
        wrapper.ySetter = function (value) {
            wrapperY = wrapper.y = Math.round(value);
            wrapper.attr('translateY', wrapperY);
        };
        // Redirect certain methods to either the box or the text
        var baseCss = wrapper.css;
        var wrapperExtension = {
            /**
             * Pick up some properties and apply them to the text instead of the
             * wrapper.
             */
            css: function (styles) {
                if (styles) {
                    var textStyles = {};
                    // Create a copy to avoid altering the original object
                    // (#537)
                    styles = merge(styles);
                    wrapper.textProps.forEach(function (prop) {
                        if (typeof styles[prop] !== 'undefined') {
                            textStyles[prop] = styles[prop];
                            delete styles[prop];
                        }
                    });
                    text.css(textStyles);
                    // Update existing text and box
                    if ('width' in textStyles) {
                        updateBoxSize();
                    }
                    // Keep updated (#9400)
                    if ('fontSize' in textStyles) {
                        updateBoxSize();
                        updateTextPadding();
                    }
                }
                return baseCss.call(wrapper, styles);
            },
            /*
             * Return the bounding box of the box, not the group.
             */
            getBBox: function () {
                return {
                    width: bBox.width + 2 * padding,
                    height: bBox.height + 2 * padding,
                    x: bBox.x - padding,
                    y: bBox.y - padding
                };
            },
            /**
             * Destroy and release memory.
             */
            destroy: function () {
                // Added by button implementation
                removeEvent(wrapper.element, 'mouseenter');
                removeEvent(wrapper.element, 'mouseleave');
                if (text) {
                    text = text.destroy();
                }
                if (box) {
                    box = box.destroy();
                }
                // Call base implementation to destroy the rest
                SVGElement.prototype.destroy.call(wrapper);
                // Release local pointers (#1298)
                wrapper =
                    renderer =
                        updateBoxSize =
                            updateTextPadding =
                                boxAttr = null;
            }
        };
        if (!styledMode) {
            /**
             * Apply the shadow to the box.
             *
             * @ignore
             * @function Highcharts.SVGElement#shadow
             *
             * @return {Highcharts.SVGElement}
             */
            wrapperExtension.shadow = function (b) {
                if (b) {
                    updateBoxSize();
                    if (box) {
                        box.shadow(b);
                    }
                }
                return wrapper;
            };
        }
        return extend(wrapper, wrapperExtension);
    }
}); // end SVGRenderer
// general renderer
H.Renderer = SVGRenderer;
