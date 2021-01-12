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
import Color from '../../Color/Color.js';
import H from '../../Globals.js';
import palette from '../../Color/Palette.js';
import SVGElement from './SVGElement.js';
import SVGLabel from './SVGLabel.js';
import AST from '../HTML/AST.js';
import TextBuilder from './TextBuilder.js';
import U from '../../Utilities.js';
var addEvent = U.addEvent, attr = U.attr, createElement = U.createElement, css = U.css, defined = U.defined, destroyObjectProperties = U.destroyObjectProperties, extend = U.extend, isArray = U.isArray, isNumber = U.isNumber, isObject = U.isObject, isString = U.isString, merge = U.merge, objectEach = U.objectEach, pick = U.pick, pInt = U.pInt, splat = U.splat, uniqueKey = U.uniqueKey;
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
 * Array of path commands, that will go into the `d` attribute of an SVG
 * element.
 *
 * @typedef {Array<(Array<Highcharts.SVGPathCommand>|Array<Highcharts.SVGPathCommand,number>|Array<Highcharts.SVGPathCommand,number,number>|Array<Highcharts.SVGPathCommand,number,number,number,number>|Array<Highcharts.SVGPathCommand,number,number,number,number,number,number>|Array<Highcharts.SVGPathCommand,number,number,number,number,number,number,number>)>} Highcharts.SVGPathArray
 */
/**
 * Possible path commands in an SVG path array. Valid values are `A`, `C`, `H`,
 * `L`, `M`, `Q`, `S`, `T`, `V`, `Z`.
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
/* eslint-disable no-invalid-this, valid-jsdoc */
var charts = H.charts, deg2rad = H.deg2rad, doc = H.doc, isFirefox = H.isFirefox, isMS = H.isMS, isWebKit = H.isWebKit, noop = H.noop, svg = H.svg, SVG_NS = H.SVG_NS, symbolSizes = H.symbolSizes, win = H.win;
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
var SVGRenderer = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function SVGRenderer(container, width, height, style, forExport, allowHTML, styledMode) {
        /* *
         *
         *  Properties
         *
         * */
        this.alignedObjects = void 0;
        /**
         * The root `svg` node of the renderer.
         *
         * @name Highcharts.SVGRenderer#box
         * @type {Highcharts.SVGDOMElement}
         */
        this.box = void 0;
        /**
         * The wrapper for the root `svg` node of the renderer.
         *
         * @name Highcharts.SVGRenderer#boxWrapper
         * @type {Highcharts.SVGElement}
         */
        this.boxWrapper = void 0;
        this.cache = void 0;
        this.cacheKeys = void 0;
        this.chartIndex = void 0;
        /**
         * A pointer to the `defs` node of the root SVG.
         *
         * @name Highcharts.SVGRenderer#defs
         * @type {Highcharts.SVGElement}
         */
        this.defs = void 0;
        this.globalAnimation = void 0;
        this.gradients = void 0;
        this.height = void 0;
        this.imgCount = void 0;
        this.isSVG = void 0;
        this.style = void 0;
        /**
         * Page url used for internal references.
         *
         * @private
         * @name Highcharts.SVGRenderer#url
         * @type {string}
         */
        this.url = void 0;
        this.width = void 0;
        this.init(container, width, height, style, forExport, allowHTML, styledMode);
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Initialize the SVGRenderer. Overridable initializer function that takes
     * the same parameters as the constructor.
     *
     * @function Highcharts.SVGRenderer#init
     *
     * @param {Highcharts.HTMLDOMElement} container
     * Where to put the SVG in the web page.
     *
     * @param {number} width
     * The width of the SVG.
     *
     * @param {number} height
     * The height of the SVG.
     *
     * @param {Highcharts.CSSObject} [style]
     * The box style, if not in styleMode
     *
     * @param {boolean} [forExport=false]
     * Whether the rendered content is intended for export.
     *
     * @param {boolean} [allowHTML=true]
     * Whether the renderer is allowed to include HTML text, which will be
     * projected on top of the SVG.
     *
     * @param {boolean} [styledMode=false]
     * Whether the renderer belongs to a chart that is in styled mode. If it
     * does, it will avoid setting presentational attributes in some cases, but
     * not when set explicitly through `.attr` and `.css` etc.
     */
    SVGRenderer.prototype.init = function (container, width, height, style, forExport, allowHTML, styledMode) {
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
        this.box = element;
        this.boxWrapper = boxWrapper;
        renderer.alignedObjects = [];
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
    };
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
     * @param {Highcharts.ASTNode} def
     * A serialized form of an SVG definition, including children.
     *
     * @return {Highcharts.SVGElement}
     * The inserted node.
     */
    SVGRenderer.prototype.definition = function (def) {
        var ast = new AST([def]);
        return ast.addToDOM(this.defs.element);
    };
    /**
     * Get the global style setting for the renderer.
     *
     * @private
     * @function Highcharts.SVGRenderer#getStyle
     *
     * @param {Highcharts.CSSObject} style
     * Style settings.
     *
     * @return {Highcharts.CSSObject}
     * The style settings mixed with defaults.
     */
    SVGRenderer.prototype.getStyle = function (style) {
        this.style = extend({
            fontFamily: '"Lucida Grande", "Lucida Sans Unicode", ' +
                'Arial, Helvetica, sans-serif',
            fontSize: '12px'
        }, style);
        return this.style;
    };
    /**
     * Apply the global style on the renderer, mixed with the default styles.
     *
     * @function Highcharts.SVGRenderer#setStyle
     *
     * @param {Highcharts.CSSObject} style
     * CSS to apply.
     */
    SVGRenderer.prototype.setStyle = function (style) {
        this.boxWrapper.css(this.getStyle(style));
    };
    /**
     * Detect whether the renderer is hidden. This happens when one of the
     * parent elements has `display: none`. Used internally to detect when we
     * needto render preliminarily in another div to get the text bounding boxes
     * right.
     *
     * @function Highcharts.SVGRenderer#isHidden
     *
     * @return {boolean}
     * True if it is hidden.
     */
    SVGRenderer.prototype.isHidden = function () {
        return !this.boxWrapper.getBBox().width;
    };
    /**
     * Destroys the renderer and its allocated members.
     *
     * @function Highcharts.SVGRenderer#destroy
     *
     * @return {null}
     */
    SVGRenderer.prototype.destroy = function () {
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
    };
    /**
     * Create a wrapper for an SVG element. Serves as a factory for
     * {@link SVGElement}, but this function is itself mostly called from
     * primitive factories like {@link SVGRenderer#path}, {@link
     * SVGRenderer#rect} or {@link SVGRenderer#text}.
     *
     * @function Highcharts.SVGRenderer#createElement
     *
     * @param {string} nodeName
     * The node name, for example `rect`, `g` etc.
     *
     * @return {Highcharts.SVGElement}
     * The generated SVGElement.
     */
    SVGRenderer.prototype.createElement = function (nodeName) {
        var wrapper = new this.Element();
        wrapper.init(this, nodeName);
        return wrapper;
    };
    /**
     * Get converted radial gradient attributes according to the radial
     * reference. Used internally from the {@link SVGElement#colorGradient}
     * function.
     *
     * @private
     * @function Highcharts.SVGRenderer#getRadialAttr
     */
    SVGRenderer.prototype.getRadialAttr = function (radialReference, gradAttr) {
        return {
            cx: (radialReference[0] - radialReference[2] / 2) +
                gradAttr.cx * radialReference[2],
            cy: (radialReference[1] - radialReference[2] / 2) +
                gradAttr.cy * radialReference[2],
            r: gradAttr.r * radialReference[2]
        };
    };
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
     * The parent SVGElement.
     */
    SVGRenderer.prototype.buildText = function (wrapper) {
        new TextBuilder(wrapper).buildSVG();
    };
    /**
     * Returns white for dark colors and black for bright colors.
     *
     * @function Highcharts.SVGRenderer#getContrast
     *
     * @param {Highcharts.ColorString} rgba
     * The color to get the contrast for.
     *
     * @return {Highcharts.ColorString}
     * The contrast color, either `#000000` or `#FFFFFF`.
     */
    SVGRenderer.prototype.getContrast = function (rgba) {
        rgba = Color.parse(rgba).rgba;
        // The threshold may be discussed. Here's a proposal for adding
        // different weight to the color channels (#6216)
        rgba[0] *= 1; // red
        rgba[1] *= 1.2; // green
        rgba[2] *= 0.5; // blue
        return rgba[0] + rgba[1] + rgba[2] >
            1.8 * 255 ?
            '#000000' :
            '#FFFFFF';
    };
    /**
     * Create a button with preset states.
     *
     * @function Highcharts.SVGRenderer#button
     *
     * @param {string} text
     * The text or HTML to draw.
     *
     * @param {number} x
     * The x position of the button's left side.
     *
     * @param {number} y
     * The y position of the button's top side.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.SVGElement>} callback
     * The function to execute on button click or touch.
     *
     * @param {Highcharts.SVGAttributes} [theme]
     * SVG attributes for the normal state.
     *
     * @param {Highcharts.SVGAttributes} [hoverState]
     * SVG attributes for the hover state.
     *
     * @param {Highcharts.SVGAttributes} [pressedState]
     * SVG attributes for the pressed state.
     *
     * @param {Highcharts.SVGAttributes} [disabledState]
     * SVG attributes for the disabled state.
     *
     * @param {Highcharts.SymbolKeyValue} [shape=rect]
     * The shape type.
     *
     * @param {boolean} [useHTML=false]
     * Wether to use HTML to render the label.
     *
     * @return {Highcharts.SVGElement}
     * The button element.
     */
    SVGRenderer.prototype.button = function (text, x, y, callback, theme, hoverState, pressedState, disabledState, shape, useHTML) {
        var label = this.label(text, x, y, shape, void 0, void 0, useHTML, void 0, 'button'), curState = 0, styledMode = this.styledMode, 
        // Make a copy of normalState (#13798)
        // (reference to options.rangeSelector.buttonTheme)
        normalState = theme ? merge(theme) : {}, userNormalStyle = normalState && normalState.style || {};
        // Remove stylable attributes
        normalState = AST.filterUserAttributes(normalState);
        // Default, non-stylable attributes
        label.attr(merge({ padding: 8, r: 2 }, normalState));
        if (!styledMode) {
            // Presentational
            var normalStyle, hoverStyle, pressedStyle, disabledStyle;
            // Normal state - prepare the attributes
            normalState = merge({
                fill: palette.neutralColor3,
                stroke: palette.neutralColor20,
                'stroke-width': 1,
                style: {
                    color: palette.neutralColor80,
                    cursor: 'pointer',
                    fontWeight: 'normal'
                }
            }, {
                style: userNormalStyle
            }, normalState);
            normalStyle = normalState.style;
            delete normalState.style;
            // Hover state
            hoverState = merge(normalState, {
                fill: palette.neutralColor10
            }, AST.filterUserAttributes(hoverState || {}));
            hoverStyle = hoverState.style;
            delete hoverState.style;
            // Pressed state
            pressedState = merge(normalState, {
                fill: palette.highlightColor10,
                style: {
                    color: palette.neutralColor100,
                    fontWeight: 'bold'
                }
            }, AST.filterUserAttributes(pressedState || {}));
            pressedStyle = pressedState.style;
            delete pressedState.style;
            // Disabled state
            disabledState = merge(normalState, {
                style: {
                    color: palette.neutralColor20
                }
            }, AST.filterUserAttributes(disabledState || {}));
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
    };
    /**
     * Make a straight line crisper by not spilling out to neighbour pixels.
     *
     * @function Highcharts.SVGRenderer#crispLine
     *
     * @param {Highcharts.SVGPathArray} points
     *        The original points on the format `[['M', 0, 0], ['L', 100, 0]]`.
     *
     * @param {number} width
     *        The width of the line.
     *
     * @param {string} roundingFunction
     *        The rounding function name on the `Math` object, can be one of
     *        `round`, `floor` or `ceil`.
     *
     * @return {Highcharts.SVGPathArray}
     *         The original points array, but modified to render crisply.
     */
    SVGRenderer.prototype.crispLine = function (points, width, roundingFunction) {
        if (roundingFunction === void 0) { roundingFunction = 'round'; }
        var start = points[0];
        var end = points[1];
        // Normalize to a crisp line
        if (start[1] === end[1]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            start[1] = end[1] =
                Math[roundingFunction](start[1]) - (width % 2 / 2);
        }
        if (start[2] === end[2]) {
            start[2] = end[2] =
                Math[roundingFunction](start[2]) + (width % 2 / 2);
        }
        return points;
    };
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
     * An SVG path definition in array form.
     *
     * @return {Highcharts.SVGElement}
     * The generated wrapper element.
     *
     */ /**
    * Draw a path, wraps the SVG `path` element.
    *
    * @function Highcharts.SVGRenderer#path
    *
    * @param {Highcharts.SVGAttributes} [attribs]
    * The initial attributes.
    *
    * @return {Highcharts.SVGElement}
    * The generated wrapper element.
    */
    SVGRenderer.prototype.path = function (path) {
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
    };
    /**
     * Draw a circle, wraps the SVG `circle` element.
     *
     * @sample highcharts/members/renderer-circle/
     *         Drawing a circle
     *
     * @function Highcharts.SVGRenderer#circle
     *
     * @param {number} [x]
     * The center x position.
     *
     * @param {number} [y]
     * The center y position.
     *
     * @param {number} [r]
     * The radius.
     *
     * @return {Highcharts.SVGElement}
     * The generated wrapper element.
     */ /**
    * Draw a circle, wraps the SVG `circle` element.
    *
    * @function Highcharts.SVGRenderer#circle
    *
    * @param {Highcharts.SVGAttributes} [attribs]
    * The initial attributes.
    *
    * @return {Highcharts.SVGElement}
    * The generated wrapper element.
    */
    SVGRenderer.prototype.circle = function (x, y, r) {
        var attribs = (isObject(x) ?
            x :
            typeof x === 'undefined' ? {} : { x: x, y: y, r: r }), wrapper = this.createElement('circle');
        // Setting x or y translates to cx and cy
        wrapper.xSetter = wrapper.ySetter = function (value, key, element) {
            element.setAttribute('c' + key, value);
        };
        return wrapper.attr(attribs);
    };
    /**
     * Draw and return an arc.
     *
     * @sample highcharts/members/renderer-arc/
     *         Drawing an arc
     *
     * @function Highcharts.SVGRenderer#arc
     *
     * @param {number} [x=0]
     * Center X position.
     *
     * @param {number} [y=0]
     * Center Y position.
     *
     * @param {number} [r=0]
     * The outer radius' of the arc.
     *
     * @param {number} [innerR=0]
     * Inner radius like used in donut charts.
     *
     * @param {number} [start=0]
     * The starting angle of the arc in radians, where 0 is to the right and
     * `-Math.PI/2` is up.
     *
     * @param {number} [end=0]
     * The ending angle of the arc in radians, where 0 is to the right and
     * `-Math.PI/2` is up.
     *
     * @return {Highcharts.SVGElement}
     * The generated wrapper element.
     */ /**
    * Draw and return an arc. Overloaded function that takes arguments object.
    *
    * @function Highcharts.SVGRenderer#arc
    *
    * @param {Highcharts.SVGAttributes} attribs
    * Initial SVG attributes.
    *
    * @return {Highcharts.SVGElement}
    * The generated wrapper element.
    */
    SVGRenderer.prototype.arc = function (x, y, r, innerR, start, end) {
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
    };
    /**
     * Draw and return a rectangle.
     *
     * @function Highcharts.SVGRenderer#rect
     *
     * @param {number} [x]
     * Left position.
     *
     * @param {number} [y]
     * Top position.
     *
     * @param {number} [width]
     * Width of the rectangle.
     *
     * @param {number} [height]
     * Height of the rectangle.
     *
     * @param {number} [r]
     * Border corner radius.
     *
     * @param {number} [strokeWidth]
     * A stroke width can be supplied to allow crisp drawing.
     *
     * @return {Highcharts.SVGElement}
     * The generated wrapper element.
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
    * General SVG attributes for the rectangle.
    *
    * @return {Highcharts.SVGElement}
    * The generated wrapper element.
    */
    SVGRenderer.prototype.rect = function (x, y, width, height, r, strokeWidth) {
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
    };
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
     * The new pixel width.
     *
     * @param {number} height
     * The new pixel height.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animate=true]
     * Whether and how to animate.
     */
    SVGRenderer.prototype.setSize = function (width, height, animate) {
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
    };
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
    SVGRenderer.prototype.g = function (name) {
        var elem = this.createElement('g');
        return name ?
            elem.attr({ 'class': 'highcharts-' + name }) :
            elem;
    };
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
    SVGRenderer.prototype.image = function (src, x, y, width, height, onload) {
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
    };
    /**
     * Draw a symbol out of pre-defined shape paths from
     * {@link SVGRenderer#symbols}.
     * It is used in Highcharts for point makers, which cake a `symbol` option,
     * and label and button backgrounds like in the tooltip and stock flags.
     *
     * @function Highcharts.SVGRenderer#symbol
     *
     * @param {string} symbol
     * The symbol name.
     *
     * @param {number} [x]
     * The X coordinate for the top left position.
     *
     * @param {number} [y]
     * The Y coordinate for the top left position.
     *
     * @param {number} [width]
     * The pixel width.
     *
     * @param {number} [height]
     * The pixel height.
     *
     * @param {Highcharts.SymbolOptionsObject} [options]
     * Additional options, depending on the actual symbol drawn.
     *
     * @return {Highcharts.SVGElement}
     */
    SVGRenderer.prototype.symbol = function (symbol, x, y, width, height, options) {
        var ren = this, obj, imageRegex = /^url\((.*?)\)$/, isImage = imageRegex.test(symbol), sym = (!isImage && (this.symbols[symbol] ? symbol : 'circle')), 
        // get the symbol definition function
        symbolFn = (sym && this.symbols[sym]), path, imageSrc, centerImage;
        if (symbolFn) {
            // Check if there's a path defined for this symbol
            if (typeof x === 'number') {
                path = symbolFn.call(this.symbols, Math.round(x || 0), Math.round(y || 0), width || 0, height || 0, options);
            }
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
                        if (!ren.imgCount && chart && !chart.hasLoaded) {
                            chart.onload();
                        }
                    },
                    src: imageSrc
                });
                this.imgCount++;
            }
        }
        return obj;
    };
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
    SVGRenderer.prototype.clipRect = function (x, y, width, height) {
        var wrapper, 
        // Add a hyphen at the end to avoid confusion in testing indexes
        // -1 and -10, -11 etc (#6550)
        id = uniqueKey() + '-', clipPath = this.createElement('clipPath').attr({
            id: id
        }).add(this.defs);
        wrapper = this.rect(x, y, width, height, 0).add(clipPath);
        wrapper.id = id;
        wrapper.clipPath = clipPath;
        wrapper.count = 0;
        return wrapper;
    };
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
     * The text of (subset) HTML to draw.
     *
     * @param {number} [x]
     * The x position of the text's lower left corner.
     *
     * @param {number} [y]
     * The y position of the text's lower left corner.
     *
     * @param {boolean} [useHTML=false]
     * Use HTML to render the text.
     *
     * @return {Highcharts.SVGElement}
     * The text object.
     */
    SVGRenderer.prototype.text = function (str, x, y, useHTML) {
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
    };
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
    SVGRenderer.prototype.fontMetrics = function (fontSize, elem) {
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
    };
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
    SVGRenderer.prototype.rotCorr = function (baseline, rotation, alterY) {
        var y = baseline;
        if (rotation && alterY) {
            y = Math.max(y * Math.cos(rotation * deg2rad), 4);
        }
        return {
            x: (-baseline / 3) * Math.sin(rotation * deg2rad),
            y: y
        };
    };
    /**
     * Compatibility function to convert the legacy one-dimensional path array
     * into an array of segments.
     *
     * It is used in maps to parse the `path` option, and in SVGRenderer.dSetter
     * to support legacy paths from demos.
     *
     * @private
     * @function Highcharts.SVGRenderer#pathToSegments
     */
    SVGRenderer.prototype.pathToSegments = function (path) {
        var ret = [];
        var segment = [];
        var commandLength = {
            A: 8,
            C: 7,
            H: 2,
            L: 3,
            M: 3,
            Q: 5,
            S: 5,
            T: 3,
            V: 2
        };
        // Short, non-typesafe parsing of the one-dimensional array. It splits
        // the path on any string. This is not type checked against the tuple
        // types, but is shorter, and doesn't require specific checks for any
        // command type in SVG.
        for (var i = 0; i < path.length; i++) {
            // Command skipped, repeat previous or insert L/l for M/m
            if (isString(segment[0]) &&
                isNumber(path[i]) &&
                segment.length === commandLength[(segment[0].toUpperCase())]) {
                path.splice(i, 0, segment[0].replace('M', 'L').replace('m', 'l'));
            }
            // Split on string
            if (typeof path[i] === 'string') {
                if (segment.length) {
                    ret.push(segment.slice(0));
                }
                segment.length = 0;
            }
            segment.push(path[i]);
        }
        ret.push(segment.slice(0));
        return ret;
        /*
        // Fully type-safe version where each tuple type is checked. The
        // downside is filesize and a lack of flexibility for unsupported
        // commands
        const ret: SVGPath = [],
            commands = {
                A: 7,
                C: 6,
                H: 1,
                L: 2,
                M: 2,
                Q: 4,
                S: 4,
                T: 2,
                V: 1,
                Z: 0
            };

        let i = 0,
            lastI = 0,
            lastCommand;

        while (i < path.length) {
            const item = path[i];

            let command;

            if (typeof item === 'string') {
                command = item;
                i += 1;
            } else {
                command = lastCommand || 'M';
            }

            // Upper case
            const commandUC = command.toUpperCase();

            if (commandUC in commands) {

                // No numeric parameters
                if (command === 'Z' || command === 'z') {
                    ret.push([command]);

                // One numeric parameter
                } else {
                    const val0 = path[i];
                    if (typeof val0 === 'number') {

                        // Horizontal line to
                        if (command === 'H' || command === 'h') {
                            ret.push([command, val0]);
                            i += 1;

                        // Vertical line to
                        } else if (command === 'V' || command === 'v') {
                            ret.push([command, val0]);
                            i += 1;

                        // Two numeric parameters
                        } else {
                            const val1 = path[i + 1];
                            if (typeof val1 === 'number') {
                                // lineTo
                                if (command === 'L' || command === 'l') {
                                    ret.push([command, val0, val1]);
                                    i += 2;

                                // moveTo
                                } else if (command === 'M' || command === 'm') {
                                    ret.push([command, val0, val1]);
                                    i += 2;

                                // Smooth quadratic bezier
                                } else if (command === 'T' || command === 't') {
                                    ret.push([command, val0, val1]);
                                    i += 2;

                                // Four numeric parameters
                                } else {
                                    const val2 = path[i + 2],
                                        val3 = path[i + 3];
                                    if (
                                        typeof val2 === 'number' &&
                                        typeof val3 === 'number'
                                    ) {
                                        // Quadratic bezier to
                                        if (
                                            command === 'Q' ||
                                            command === 'q'
                                        ) {
                                            ret.push([
                                                command,
                                                val0,
                                                val1,
                                                val2,
                                                val3
                                            ]);
                                            i += 4;

                                        // Smooth cubic bezier to
                                        } else if (
                                            command === 'S' ||
                                            command === 's'
                                        ) {
                                            ret.push([
                                                command,
                                                val0,
                                                val1,
                                                val2,
                                                val3
                                            ]);
                                            i += 4;

                                        // Six numeric parameters
                                        } else {
                                            const val4 = path[i + 4],
                                                val5 = path[i + 5];

                                            if (
                                                typeof val4 === 'number' &&
                                                typeof val5 === 'number'
                                            ) {
                                                // Curve to
                                                if (
                                                    command === 'C' ||
                                                    command === 'c'
                                                ) {
                                                    ret.push([
                                                        command,
                                                        val0,
                                                        val1,
                                                        val2,
                                                        val3,
                                                        val4,
                                                        val5
                                                    ]);
                                                    i += 6;

                                                // Seven numeric parameters
                                                } else {
                                                    const val6 = path[i + 6];

                                                    // Arc to
                                                    if (
                                                        typeof val6 ===
                                                        'number' &&
                                                        (
                                                            command === 'A' ||
                                                            command === 'a'
                                                        )
                                                    ) {
                                                        ret.push([
                                                            command,
                                                            val0,
                                                            val1,
                                                            val2,
                                                            val3,
                                                            val4,
                                                            val5,
                                                            val6
                                                        ]);
                                                        i += 7;

                                                    }

                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }

            // An unmarked command following a moveTo is a lineTo
            lastCommand = command === 'M' ? 'L' : command;

            if (i === lastI) {
                break;
            }
            lastI = i;
        }
        return ret;
        */
    };
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
    SVGRenderer.prototype.label = function (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {
        return new SVGLabel(this, str, x, y, shape, anchorX, anchorY, useHTML, baseline, className);
    };
    return SVGRenderer;
}());
/**
 * A pointer to the renderer's associated Element class. The VMLRenderer
 * will have a pointer to VMLElement here.
 *
 * @name Highcharts.SVGRenderer#Element
 * @type {Highcharts.SVGElement}
 */
SVGRenderer.prototype.Element = SVGElement;
/**
 * @private
 */
SVGRenderer.prototype.SVG_NS = SVG_NS;
/**
 * Dummy function for plugins, called every time the renderer is updated.
 * Prior to Highcharts 5, this was used for the canvg renderer.
 *
 * @deprecated
 * @function Highcharts.SVGRenderer#draw
 */
SVGRenderer.prototype.draw = noop;
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
SVGRenderer.prototype.escapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
};
/**
 * An extendable collection of functions for defining symbol paths.
 *
 * @name Highcharts.SVGRenderer#symbols
 * @type {Highcharts.SymbolDictionary}
 */
SVGRenderer.prototype.symbols = {
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
            ['M', x, y],
            ['L', x + w, y],
            ['L', x + w, y + h],
            ['L', x, y + h],
            ['Z']
        ];
    },
    triangle: function (x, y, w, h) {
        return [
            ['M', x + w / 2, y],
            ['L', x + w, y + h],
            ['L', x, y + h],
            ['Z']
        ];
    },
    'triangle-down': function (x, y, w, h) {
        return [
            ['M', x, y],
            ['L', x + w, y],
            ['L', x + w / 2, y + h],
            ['Z']
        ];
    },
    diamond: function (x, y, w, h) {
        return [
            ['M', x + w / 2, y],
            ['L', x + w, y + h / 2],
            ['L', x + w / 2, y + h],
            ['L', x, y + h / 2],
            ['Z']
        ];
    },
    arc: function (x, y, w, h, options) {
        var arc = [];
        if (options) {
            var start = options.start || 0, end = options.end || 0, rx = options.r || w, ry = options.r || h || w, proximity = 0.001, fullCircle = Math.abs(end - start - 2 * Math.PI) <
                proximity, 
            // Substract a small number to prevent cos and sin of start and
            // end from becoming equal on 360 arcs (related: #1561)
            end = end - proximity, innerRadius = options.innerR, open = pick(options.open, fullCircle), cosStart = Math.cos(start), sinStart = Math.sin(start), cosEnd = Math.cos(end), sinEnd = Math.sin(end), 
            // Proximity takes care of rounding errors around PI (#6971)
            longArc = pick(options.longArc, end - start - Math.PI < proximity ? 0 : 1);
            arc.push([
                'M',
                x + rx * cosStart,
                y + ry * sinStart
            ], [
                'A',
                rx,
                ry,
                0,
                longArc,
                pick(options.clockwise, 1),
                x + rx * cosEnd,
                y + ry * sinEnd
            ]);
            if (defined(innerRadius)) {
                arc.push(open ?
                    [
                        'M',
                        x + innerRadius * cosEnd,
                        y + innerRadius * sinEnd
                    ] : [
                    'L',
                    x + innerRadius * cosEnd,
                    y + innerRadius * sinEnd
                ], [
                    'A',
                    innerRadius,
                    innerRadius,
                    0,
                    longArc,
                    // Clockwise - opposite to the outer arc clockwise
                    defined(options.clockwise) ? 1 - options.clockwise : 0,
                    x + innerRadius * cosStart,
                    y + innerRadius * sinStart
                ]);
            }
            if (!open) {
                arc.push(['Z']);
            }
        }
        return arc;
    },
    /**
     * Callout shape used for default tooltips, also used for rounded
     * rectangles in VML
     */
    callout: function (x, y, w, h, options) {
        var arrowLength = 6, halfDistance = 6, r = Math.min((options && options.r) || 0, w, h), safeDistance = r + halfDistance, anchorX = options && options.anchorX, anchorY = options && options.anchorY || 0, path;
        path = [
            ['M', x + r, y],
            ['L', x + w - r, y],
            ['C', x + w, y, x + w, y, x + w, y + r],
            ['L', x + w, y + h - r],
            ['C', x + w, y + h, x + w, y + h, x + w - r, y + h],
            ['L', x + r, y + h],
            ['C', x, y + h, x, y + h, x, y + h - r],
            ['L', x, y + r],
            ['C', x, y, x, y, x + r, y] // top-left corner
        ];
        if (!isNumber(anchorX)) {
            return path;
        }
        // Anchor on right side
        if (x + anchorX >= w) {
            // Chevron
            if (anchorY > y + safeDistance &&
                anchorY < y + h - safeDistance) {
                path.splice(3, 1, ['L', x + w, anchorY - halfDistance], ['L', x + w + arrowLength, anchorY], ['L', x + w, anchorY + halfDistance], ['L', x + w, y + h - r]);
                // Simple connector
            }
            else {
                path.splice(3, 1, ['L', x + w, h / 2], ['L', anchorX, anchorY], ['L', x + w, h / 2], ['L', x + w, y + h - r]);
            }
            // Anchor on left side
        }
        else if (x + anchorX <= 0) {
            // Chevron
            if (anchorY > y + safeDistance &&
                anchorY < y + h - safeDistance) {
                path.splice(7, 1, ['L', x, anchorY + halfDistance], ['L', x - arrowLength, anchorY], ['L', x, anchorY - halfDistance], ['L', x, y + r]);
                // Simple connector
            }
            else {
                path.splice(7, 1, ['L', x, h / 2], ['L', anchorX, anchorY], ['L', x, h / 2], ['L', x, y + r]);
            }
        }
        else if ( // replace bottom
        anchorY &&
            anchorY > h &&
            anchorX > x + safeDistance &&
            anchorX < x + w - safeDistance) {
            path.splice(5, 1, ['L', anchorX + halfDistance, y + h], ['L', anchorX, y + h + arrowLength], ['L', anchorX - halfDistance, y + h], ['L', x + r, y + h]);
        }
        else if ( // replace top
        anchorY &&
            anchorY < 0 &&
            anchorX > x + safeDistance &&
            anchorX < x + w - safeDistance) {
            path.splice(1, 1, ['L', anchorX - halfDistance, y], ['L', anchorX, y - arrowLength], ['L', anchorX + halfDistance, y], ['L', w - r, y]);
        }
        return path;
    }
};
H.SVGRenderer = SVGRenderer;
H.Renderer = H.SVGRenderer;
export default H.Renderer;
