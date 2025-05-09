/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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

import type AlignObject from '../AlignObject';
import type AnimationOptions from '../../Animation/AnimationOptions';
import type BBoxObject from '../BBoxObject';
import type ColorString from '../../Color/ColorString';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../CSSObject';
import type {
    DOMElementType,
    HTMLDOMElement,
    SVGDOMElement
} from '../DOMElementType';
import type FontMetricsObject from '../FontMetricsObject';
import type GradientColor from '../../Color/GradientColor';
import type RectangleObject from '../RectangleObject';
import type ShadowOptionsObject from '../ShadowOptionsObject';
import type SVGAttributes from './SVGAttributes';
import type SVGElementLike from './SVGElementLike';
import type SVGPath from './SVGPath';
import type SVGRenderer from './SVGRenderer';

import A from '../../Animation/AnimationUtilities.js';
const {
    animate,
    animObject,
    stop
} = A;
import Color from '../../Color/Color.js';
import H from '../../Globals.js';
const {
    deg2rad,
    doc,
    svg,
    SVG_NS,
    win,
    isFirefox
} = H;
import U from '../../Utilities.js';
const {
    addEvent,
    attr,
    createElement,
    crisp,
    css,
    defined,
    erase,
    extend,
    fireEvent,
    getAlignFactor,
    isArray,
    isFunction,
    isNumber,
    isObject,
    isString,
    merge,
    objectEach,
    pick,
    pInt,
    pushUnique,
    replaceNested,
    syncTimeout,
    uniqueKey
} = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * @private
 */
declare module '../CSSObject' {
    interface CSSObject {
        strokeWidth?: (number|string);
    }
}

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The SVGElement prototype is a JavaScript wrapper for SVG elements used in the
 * rendering layer of Highcharts. Combined with the
 * {@link Highcharts.SVGRenderer}
 * object, these prototypes allow freeform annotation in the charts or even in
 * HTML pages without instanciating a chart. The SVGElement can also wrap HTML
 * labels, when `text` or `label` elements are created with the `useHTML`
 * parameter.
 *
 * The SVGElement instances are created through factory functions on the
 * {@link Highcharts.SVGRenderer}
 * object, like
 * {@link Highcharts.SVGRenderer#rect|rect},
 * {@link Highcharts.SVGRenderer#path|path},
 * {@link Highcharts.SVGRenderer#text|text},
 * {@link Highcharts.SVGRenderer#label|label},
 * {@link Highcharts.SVGRenderer#g|g}
 * and more.
 *
 * See [How to use the SVG Renderer](
 * https://www.highcharts.com/docs/advanced-chart-features/renderer) for a
 * comprehensive tutorial on how to draw SVG elements on a chart.
 *
 * @class
 * @name Highcharts.SVGElement
 */
class SVGElement implements SVGElementLike {

    /* *
     *
     *  Properties
     *
     * */

    // Custom attributes used for symbols, these should be filtered out when
    // setting SVGElement attributes (#9375).
    public static symbolCustomAttribs: Array<string> = [
        'anchorX',
        'anchorY',
        'clockwise',
        'end',
        'height',
        'innerR',
        'r',
        'start',
        'width',
        'x',
        'y'
    ];

    public added?: boolean;
    // @todo public alignAttr?: SVGAttributes;
    public alignByTranslate?: boolean;
    public alignOptions?: AlignObject;
    public alignTo?: BBoxObject|string;
    public alignValue?: ('left'|'center'|'right');
    public clipPath?: SVGElement;
    // @todo public d?: number;
    public div?: HTMLDOMElement;
    public doTransform?: boolean;
    public element: DOMElementType;
    public fakeTS?: boolean;
    public firstLineMetrics?: FontMetricsObject;
    public handleZ?: boolean;
    public height?: number;
    public imgwidth?: number;
    public imgheight?: number;
    public inverted: undefined;
    public matrix?: Array<number>;
    public onEvents: Record<string, Function> = {};
    public opacity = 1; // Default base for animation
    // @todo public options?: AnyRecord;
    public parentGroup?: SVGElement;
    public pathArray?: SVGPath;
    public placed?: boolean;
    public r?: number;
    public radAttr?: SVGAttributes;
    public renderer: SVGRenderer;
    public rotation?: number;
    public rotationOriginX?: number;
    public rotationOriginY?: number;
    public scaleX?: number;
    public scaleY?: number;
    public stops?: Array<SVGElement>;
    public stroke?: ColorType;
    // @todo public 'stroke-width'?: number;
    public styledMode?: boolean;
    public styles: CSSObject;
    public SVG_NS = SVG_NS;
    public symbolName?: string;
    public text?: SVGElement;
    public textPxLength?: number;
    public textStr?: string;
    public textWidth?: number;
    // @todo public textPxLength?: number;
    public translateX?: number;
    public translateY?: number;
    public visibility?: 'hidden'|'inherit'|'visible';
    public width?: number;
    public x?: number;
    public y?: number;
    // @todo public zIndex?: number;

    /* *
     *
     *  Functions
     *
     * */

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
    private _defaultGetter(key: string): (number|string) {
        let ret = pick(
            (this as AnyRecord)[key + 'Value'], // Align getter
            (this as AnyRecord)[key],
            this.element ? this.element.getAttribute(key) : null,
            0
        );

        if (/^-?[\d\.]+$/.test(ret)) { // Is numerical
            ret = parseFloat(ret);
        }
        return ret;
    }

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
     */
    public _defaultSetter(
        value: string,
        key: string,
        element: SVGDOMElement
    ): void {
        element.setAttribute(key, value);
    }

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
    public add(parent?: SVGElement): this {
        const renderer = this.renderer,
            element = this.element;

        let inserted;

        if (parent) {
            this.parentGroup = parent;
        }

        // Build formatted text
        if (
            typeof this.textStr !== 'undefined' &&
            this.element.nodeName === 'text' // Not for SVGLabel instances
        ) {
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
                renderer.box
            ).appendChild(element);
        }

        // Fire an event for internal hooks
        if (this.onAdd) {
            this.onAdd();
        }

        return this;
    }

    /**
     * Add a class name to an element.
     *
     * @function Highcharts.SVGElement#addClass
     *
     * @param {string} className
     * The new class name to add.
     *
     * @param {boolean} [replace=false]
     * When true, the existing class name(s) will be overwritten with the new
     * one. When false, the new one is added.
     *
     * @return {Highcharts.SVGElement}
     * Return the SVG element for chainability.
     */
    public addClass(
        className: string,
        replace?: boolean
    ): this {
        const currentClassName = replace ? '' : (this.attr('class') || '');

        // Trim the string and remove duplicates
        className = (className || '')
            .split(/ /g)
            .reduce(function (
                newClassName: Array<string>,
                name: string
            ): Array<string> {
                if ((currentClassName as any).indexOf(name) === -1) {
                    newClassName.push(name);
                }
                return newClassName;
            }, (currentClassName ?
                [currentClassName] :
                []
            ) as Array<string>)
            .join(' ');

        if (className !== currentClassName) {
            this.attr('class', className);
        }

        return this;
    }

    /**
     * This method is executed in the end of `attr()`, after setting all
     * attributes in the hash. In can be used to efficiently consolidate
     * multiple attributes in one SVG property -- e.g., translate, rotate and
     * scale are merged in one "transform" attribute in the SVG node.
     *
     * @private
     * @function Highcharts.SVGElement#afterSetters
     */
    public afterSetters(): void {
        // Update transform. Do this outside the loop to prevent redundant
        // updating for batch setting of attributes.
        if (this.doTransform) {
            this.updateTransform();
            this.doTransform = false;
        }
    }

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
     * @param {string|Highcharts.BBoxObject} [alignTo]
     *        The box to align to, needs a width and height. When the box is a
     *        string, it refers to an object in the Renderer. For example, when
     *        box is `spacingBox`, it refers to `Renderer.spacingBox` which
     *        holds `width`, `height`, `x` and `y` properties.
     *
     * @param {boolean} [redraw]
     *        Decide if SVGElement should be redrawn with new alignment or
     *        just change its attributes.
     *
     * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
     */
    public align(
        alignOptions?: AlignObject,
        alignByTranslate?: boolean,
        alignTo?: (string|BBoxObject),
        redraw: boolean = true
    ): this {
        const renderer = this.renderer,
            alignedObjects = renderer.alignedObjects,
            initialAlignment = Boolean(alignOptions);

        // First call on instanciate
        if (alignOptions) {
            this.alignOptions = alignOptions;
            this.alignByTranslate = alignByTranslate;
            this.alignTo = alignTo;

        // When called on resize, no arguments are supplied
        } else {
            alignOptions = this.alignOptions || {};
            alignByTranslate = this.alignByTranslate;
            alignTo = this.alignTo;
        }

        const alignToKey = !alignTo || isString(alignTo) ?
            alignTo || 'renderer' :
            void 0;

        // When aligned to a key, automatically re-align on redraws
        if (alignToKey) {
            // Prevent duplicates, like legendGroup after resize
            if (initialAlignment) {
                pushUnique(alignedObjects, this);
            }
            alignTo = void 0; // Do not use the box
        }

        const alignToBox: BBoxObject = pick(
                alignTo,
                (renderer as any)[alignToKey as any],
                renderer
            ),
            // Default: left align
            x = (alignToBox.x || 0) + (alignOptions.x || 0) +
                ((alignToBox.width || 0) - (alignOptions.width || 0)) *
                getAlignFactor(alignOptions.align),
            // Default: top align
            y = (alignToBox.y || 0) + (alignOptions.y || 0) +
                ((alignToBox.height || 0) - (alignOptions.height || 0)) *
                getAlignFactor(alignOptions.verticalAlign),
            attribs: SVGAttributes = {
                'text-align': alignOptions?.align
            };

        attribs[alignByTranslate ? 'translateX' : 'x'] = Math.round(x);
        attribs[alignByTranslate ? 'translateY' : 'y'] = Math.round(y);

        // Animate only if already placed
        if (redraw) {
            this[this.placed ? 'animate' : 'attr'](attribs);
            this.placed = true;
        }
        this.alignAttr = attribs;
        return this;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#alignSetter
     * @param {"left"|"center"|"right"} value
     */
    public alignSetter(value: ('left'|'center'|'right')): void {
        const convert: Record<string, string> = {
            left: 'start',
            center: 'middle',
            right: 'end'
        };
        if (convert[value]) {
            this.alignValue = value;
            this.element.setAttribute('text-anchor', convert[value]);
        }
    }

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
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [options]
     *        Animation options.
     *
     * @param {Function} [complete]
     *        Function to perform at the end of animation.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    public animate(
        params: SVGAttributes,
        options?: (boolean|DeepPartial<AnimationOptions>),
        complete?: Function
    ): this {
        const animOptions = animObject(
                pick(options, this.renderer.globalAnimation, true)
            ),
            deferTime = animOptions.defer;

        // When the page is hidden save resources in the background by not
        // running animation at all (#9749).
        if (doc.hidden) {
            animOptions.duration = 0;
        }

        if (animOptions.duration !== 0) {
            // Allows using a callback with the global animation without
            // overwriting it
            if (complete) {
                animOptions.complete = complete;
            }
            // If defer option is defined delay the animation #12901
            syncTimeout((): void => {
                if (this.element) {
                    animate(this, params, animOptions);
                }
            }, deferTime);
        } else {
            this.attr(params, void 0, complete || animOptions.complete);
            // Call the end step synchronously
            objectEach(params, function (val: any, prop: string): void {
                if (animOptions.step) {
                    animOptions.step.call(
                        this,
                        val,
                        { prop: prop, pos: 1, elem: this }
                    );
                }
            }, this);
        }
        return this;
    }

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
     */
    public applyTextOutline(textOutline: string): void {
        const elem = this.element,
            hasContrast = textOutline.indexOf('contrast') !== -1,
            styles: CSSObject = {};

        // When the text shadow is set to contrast, use dark stroke for light
        // text and vice versa.
        if (hasContrast) {
            styles.textOutline = textOutline = textOutline.replace(
                /contrast/g,
                this.renderer.getContrast(elem.style.fill)
            );
        }

        // Extract the stroke width and color
        const spacePos = textOutline.indexOf(' '),
            color: ColorString = textOutline.substring(spacePos + 1);

        let strokeWidth = textOutline.substring(0, spacePos);

        if (strokeWidth && strokeWidth !== 'none' && H.svg) {

            this.fakeTS = true; // Fake text shadow

            // Since the stroke is applied on center of the actual outline, we
            // need to double it to get the correct stroke-width outside the
            // glyphs.
            strokeWidth = strokeWidth.replace(
                /(^[\d\.]+)(.*?)$/g,
                function (match: string, digit: string, unit: string): string {
                    return (2 * Number(digit)) + unit;
                }
            );

            // Remove shadows from previous runs.
            this.removeTextOutline();

            const outline = doc.createElementNS(
                SVG_NS,
                'tspan'
            ) as DOMElementType;
            attr(outline, {
                'class': 'highcharts-text-outline',
                fill: color,
                stroke: color,
                'stroke-width': strokeWidth as any,
                'stroke-linejoin': 'round'
            });

            // For each of the tspans and text nodes, create a copy in the
            // outline.
            const parentElem = elem.querySelector('textPath') || elem;
            [].forEach.call(
                parentElem.childNodes,
                (childNode: ChildNode): void => {
                    const clone = childNode.cloneNode(true);
                    if ((clone as DOMElementType).removeAttribute) {
                        ['fill', 'stroke', 'stroke-width', 'stroke'].forEach(
                            (prop): void => (clone as DOMElementType)
                                .removeAttribute(prop)
                        );
                    }
                    outline.appendChild(clone);
                }
            );

            // Collect the sum of dy from all children, included nested ones
            let totalHeight = 0;
            [].forEach.call(
                parentElem.querySelectorAll('text tspan'),
                (element): void => {
                    totalHeight += Number(
                        (element as DOMElementType).getAttribute('dy')
                    );
                }
            );

            // Insert an absolutely positioned break before the original text
            // to keep it in place
            const br = doc.createElementNS(SVG_NS, 'tspan') as DOMElementType;
            br.textContent = '\u200B';

            // Reset the position for the following text
            attr(br, {
                x: Number(elem.getAttribute('x')),
                dy: -totalHeight
            });

            // Insert the outline
            outline.appendChild(br);
            parentElem.insertBefore(outline, parentElem.firstChild);

        }
    }

    public attr(key: string): (number|string);
    public attr(
        key: string,
        val: (number|string|ColorType|SVGPath),
        complete?: Function,
        continueAnimation?: boolean
    ): this;
    public attr(
        hash?: SVGAttributes,
        val?: undefined,
        complete?: Function,
        continueAnimation?: boolean
    ): this;
    /**
     * @function Highcharts.SVGElement#attr
     * @param {string} key
     * @return {number|string}
     *//**
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
    public attr(
        hash?: (string|SVGAttributes),
        val?: (number|string|ColorType|SVGPath),
        complete?: Function,
        continueAnimation?: boolean
    ): (number|string|this) {
        const { element } = this,
            symbolCustomAttribs = SVGElement.symbolCustomAttribs;

        let key,
            hasSetSymbolSize: boolean,
            ret = this,
            skipAttr,
            setter;

        // Single key-value pair
        if (typeof hash === 'string' && typeof val !== 'undefined') {
            key = hash;
            hash = {};
            (hash as any)[key] = val;
        }

        // Used as a getter: first argument is a string, second is undefined
        if (typeof hash === 'string') {
            ret = (
                (this as AnyRecord)[hash + 'Getter'] ||
                (this as AnyRecord)._defaultGetter
            ).call(
                this,
                hash,
                element
            );

        // Setter
        } else {

            objectEach(hash, function eachAttribute(
                val: any,
                key: string
            ): void {
                skipAttr = false;

                // Unless .attr is from the animator update, stop current
                // running animation of this property
                if (!continueAnimation) {
                    stop(this as any, key);
                }

                // Special handling of symbol attributes
                if (
                    this.symbolName &&
                    symbolCustomAttribs.indexOf(key) !== -1
                ) {
                    if (!hasSetSymbolSize) {
                        this.symbolAttr(hash as any);
                        hasSetSymbolSize = true;
                    }
                    skipAttr = true;
                }

                if (this.rotation && (key === 'x' || key === 'y')) {
                    this.doTransform = true;
                }

                if (!skipAttr) {
                    setter = (
                        (this as AnyRecord)[key + 'Setter'] ||
                        (this as AnyRecord)._defaultSetter
                    );
                    setter.call(this, val, key, element);
                }
            }, this);

            this.afterSetters();
        }

        // In accordance with animate, run a complete callback
        if (complete) {
            complete.call(this);
        }

        return ret;
    }

    /**
     * Apply a clipping shape to this element.
     *
     * @function Highcharts.SVGElement#clip
     *
     * @param {SVGElement} [clipElem]
     *        The clipping shape. If skipped, the current clip is removed.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVG element to allow chaining.
     */
    public clip(clipElem?: SVGElement): this {
        if (clipElem && !clipElem.clipPath) {
            // Add a hyphen at the end to avoid confusion in testing indexes
            // -1 and -10, -11 etc (#6550)
            const id = uniqueKey() + '-',
                clipPath = this.renderer.createElement('clipPath')
                    .attr({ id })
                    .add(this.renderer.defs);

            extend(clipElem, { clipPath, id, count: 0 });

            clipElem.add(clipPath);
        }
        return this.attr(
            'clip-path',
            clipElem ?
                `url(${this.renderer.url}#${clipElem.id})` :
                'none'
        );
    }

    /**
     * Calculate the coordinates needed for drawing a rectangle crisply and
     * return the calculated attributes.
     *
     * @function Highcharts.SVGElement#crisp
     *
     * @param {Highcharts.RectangleObject} rect
     * Rectangle to crisp.
     *
     * @param {number} [strokeWidth]
     * The stroke width to consider when computing crisp positioning. It can
     * also be set directly on the rect parameter.
     *
     * @return {Highcharts.RectangleObject}
     * The modified rectangle arguments.
     */
    public crisp(
        rect: RectangleObject,
        strokeWidth?: number
    ): RectangleObject {
        // Math.round because strokeWidth can sometimes have roundoff errors
        strokeWidth = Math.round(strokeWidth || rect.strokeWidth || 0);

        const x1 = rect.x || this.x || 0,
            y1 = rect.y || this.y || 0,
            x2 = (rect.width || this.width || 0) + x1,
            y2 = (rect.height || this.height || 0) + y1,
            // Find all the rounded coordinates for corners
            x = crisp(x1, strokeWidth),
            y = crisp(y1, strokeWidth),
            x2Crisp = crisp(x2, strokeWidth),
            y2Crisp = crisp(y2, strokeWidth);

        extend(rect, {
            x,
            y,
            width: x2Crisp - x,
            height: y2Crisp - y
        });

        if (defined(rect.strokeWidth)) {
            rect.strokeWidth = strokeWidth;
        }
        return rect;
    }

    /**
     * Build and apply an SVG gradient out of a common JavaScript configuration
     * object. This function is called from the attribute setters. An event
     * hook is added for supporting other complex color types.
     *
     * @private
     * @function Highcharts.SVGElement#complexColor
     *
     * @param {Highcharts.GradientColorObject|Highcharts.PatternObject} colorOptions
     * The gradient or pattern options structure.
     *
     * @param {string} prop
     * The property to apply, can either be `fill` or `stroke`.
     *
     * @param {Highcharts.SVGDOMElement} elem
     * SVG element to apply the gradient on.
     */
    public complexColor(
        colorOptions: Exclude<ColorType, ColorString>,
        prop: string,
        elem: SVGDOMElement
    ): void {
        const renderer = this.renderer;

        let colorObject,
            gradName: keyof GradientColor,
            gradAttr: SVGAttributes,
            radAttr: SVGAttributes,
            gradients: Record<string, SVGElement>,
            stops: (GradientColor['stops']|undefined),
            stopColor: ColorString,
            stopOpacity,
            radialReference: Array<number>,
            id,
            key: (string|Array<string>) = [],
            value: string;

        fireEvent(this.renderer, 'complexColor', {
            args: arguments
        }, function (): void {
            // Apply linear or radial gradients
            if ((colorOptions as GradientColor).radialGradient) {
                gradName = 'radialGradient';
            } else if ((colorOptions as GradientColor).linearGradient) {
                gradName = 'linearGradient';
            }

            if (gradName) {
                gradAttr = (colorOptions as GradientColor)[gradName] as any;
                gradients = renderer.gradients as any;
                stops = (colorOptions as GradientColor).stops;
                radialReference = (elem as any).radialReference;

                // Keep < 2.2 compatibility
                if (isArray(gradAttr)) {
                    (colorOptions as any)[gradName] = gradAttr = {
                        x1: gradAttr[0] as number,
                        y1: gradAttr[1] as number,
                        x2: gradAttr[2] as number,
                        y2: gradAttr[3] as number,
                        gradientUnits: 'userSpaceOnUse'
                    };
                }

                // Correct the radial gradient for the radial reference system
                if (
                    gradName === 'radialGradient' &&
                    radialReference &&
                    !defined(gradAttr.gradientUnits)
                ) {
                    // Save the radial attributes for updating
                    radAttr = gradAttr;
                    gradAttr = merge(
                        gradAttr,
                        renderer.getRadialAttr(radialReference, radAttr),
                        { gradientUnits: 'userSpaceOnUse' }
                    );
                }

                // Build the unique key to detect whether we need to create a
                // new element (#1282)
                objectEach(gradAttr, function (value, n): void {
                    if (n !== 'id') {
                        (key as any).push(n, value);
                    }
                });
                objectEach(stops, function (val): void {
                    (key as any).push(val);
                });
                key = (key as any).join(',');

                // Check if a gradient object with the same config object is
                // created within this renderer
                if (gradients[key as any]) {
                    id = gradients[key as any].attr('id');

                } else {

                    // Set the id and create the element
                    gradAttr.id = id = uniqueKey();
                    const gradientObject = gradients[key as any] =
                        renderer.createElement(gradName)
                            .attr(gradAttr)
                            .add(renderer.defs) as any;

                    gradientObject.radAttr = radAttr;

                    // The gradient needs to keep a list of stops to be able to
                    // destroy them
                    gradientObject.stops = [];
                    (stops as any).forEach(function (
                        stop: [number, ColorString]
                    ): void {
                        if (stop[1].indexOf('rgba') === 0) {
                            colorObject = Color.parse(stop[1]);
                            stopColor = colorObject.get('rgb') as any;
                            stopOpacity = colorObject.get('a') as any;
                        } else {
                            stopColor = stop[1];
                            stopOpacity = 1;
                        }
                        const stopObject = renderer.createElement('stop').attr({
                            offset: stop[0],
                            'stop-color': stopColor,
                            'stop-opacity': stopOpacity
                        }).add(gradientObject as any);

                        // Add the stop element to the gradient
                        gradientObject.stops.push(stopObject);
                    });
                }

                // Set the reference to the gradient object
                value = 'url(' + renderer.url + '#' + id + ')';
                elem.setAttribute(prop, value);
                elem.gradient = key as any;

                // Allow the color to be concatenated into tooltips formatters
                // etc. (#2995)
                colorOptions.toString = function (): string {
                    return value;
                };
            }
        });
    }

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
    public css(styles: CSSObject): this {
        const oldStyles = this.styles,
            newStyles: CSSObject = {},
            elem = this.element;

        let textWidth,
            hasNew = !oldStyles;

        // Filter out existing styles to increase performance (#2640)
        if (oldStyles) {
            objectEach(styles, function (value, n: keyof CSSObject): void {
                if (oldStyles && oldStyles[n] !== value) {
                    (newStyles as any)[n] = value;
                    hasNew = true;
                }
            });
        }

        if (hasNew) {

            // Merge the new styles with the old ones
            if (oldStyles) {
                styles = extend(
                    oldStyles,
                    newStyles
                );
            }

            // Get the text width from style
            // Previously set, unset it (#8234)
            if (styles.width === null || styles.width as any === 'auto') {
                delete this.textWidth;

            // Apply new
            } else if (
                elem.nodeName.toLowerCase() === 'text' &&
                styles.width
            ) {
                textWidth = this.textWidth = pInt(styles.width);
            }


            // Store object
            extend(this.styles, styles);

            if (textWidth && (!svg && this.renderer.forExport)) {
                delete styles.width;
            }

            const fontSize = isFirefox && styles.fontSize || null;

            // Necessary in firefox to be able to set font-size, #22124
            if (
                fontSize && (
                    isNumber(fontSize) ||
                    /^\d+$/.test(fontSize)
                )
            ) {
                styles.fontSize += 'px';
            }

            const stylesToApply = merge(styles);
            if (elem.namespaceURI === this.SVG_NS) {

                // These CSS properties are interpreted internally by the SVG
                // renderer, but are not supported by SVG and should not be
                // added to the DOM. In styled mode, no CSS should find its way
                // to the DOM whatsoever (#6173, #6474).
                (
                    ['textOutline', 'textOverflow', 'whiteSpace', 'width'] as
                    ('textOutline'|'textOverflow'|'whiteSpace'|'width')[]
                ).forEach(
                    (key): boolean|undefined => (
                        stylesToApply &&
                        delete stylesToApply[key]
                    )
                );

                // SVG requires fill for text
                if (stylesToApply.color) {
                    stylesToApply.fill = stylesToApply.color;
                    delete stylesToApply.color;
                }
            }
            css(elem, stylesToApply);
        }

        if (this.added) {

            // Rebuild text after added. Cache mechanisms in the buildText will
            // prevent building if there are no significant changes.
            if (this.element.nodeName === 'text') {
                this.renderer.buildText(this);
            }

            // Apply text outline after added
            if (styles.textOutline) {
                this.applyTextOutline(styles.textOutline);
            }
        }

        return this;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#dashstyleSetter
     * @param {string} value
     */
    public dashstyleSetter(value: string): void {
        let i,
            strokeWidth = this['stroke-width'];

        // If "inherit", like maps in IE, assume 1 (#4981). With HC5 and the new
        // strokeWidth function, we should be able to use that instead.
        if (strokeWidth as unknown as string === 'inherit') {
            strokeWidth = 1;
        }
        if (value) {
            value = value.toLowerCase();
            const v = value
                .replace('shortdashdotdot', '3,1,1,1,1,1,')
                .replace('shortdashdot', '3,1,1,1')
                .replace('shortdot', '1,1,')
                .replace('shortdash', '3,1,')
                .replace('longdash', '8,3,')
                .replace(/dot/g, '1,3,')
                .replace('dash', '4,3,')
                .replace(/,$/, '')
                .split(','); // Ending comma

            i = v.length;
            while (i--) {
                v[i] = '' + (pInt(v[i]) * pick(strokeWidth, NaN));
            }
            value = v.join(',').replace(/NaN/g, 'none'); // #3226
            this.element.setAttribute('stroke-dasharray', value);
        }
    }

    /**
     * Destroy the element and element wrapper and clear up the DOM and event
     * hooks.
     *
     * @function Highcharts.SVGElement#destroy
     */
    public destroy(): undefined {
        const wrapper = this,
            element = wrapper.element || {},
            renderer = wrapper.renderer,
            ownerSVGElement = (element as SVGDOMElement).ownerSVGElement;

        let parentToClean: (SVGElement|undefined) = (
                element.nodeName === 'SPAN' &&
                wrapper.parentGroup ||
                void 0
            ),
            grandParent: SVGElement,
            i;

        // Remove events
        element.onclick = element.onmouseout = element.onmouseover =
            element.onmousemove = (element as any).point = null;
        stop(wrapper as any); // Stop running animations

        if (wrapper.clipPath && ownerSVGElement) {
            const clipPath = wrapper.clipPath;
            // Look for existing references to this clipPath and remove them
            // before destroying the element (#6196).
            // The upper case version is for Edge
            [].forEach.call(
                ownerSVGElement.querySelectorAll('[clip-path],[CLIP-PATH]'),
                function (el: SVGDOMElement): void {
                    if ((el.getAttribute('clip-path') as any).indexOf(
                        clipPath.element.id
                    ) > -1) {
                        el.removeAttribute('clip-path');
                    }
                }
            );
            wrapper.clipPath = clipPath.destroy();
        }

        // Destroy stops in case this is a gradient object @todo old code?
        if (wrapper.stops) {
            for (i = 0; i < wrapper.stops.length; i++) {
                wrapper.stops[i].destroy();
            }
            wrapper.stops.length = 0;
            wrapper.stops = void 0;
        }

        // Remove element
        wrapper.safeRemoveChild(element);

        // In case of useHTML, clean up empty containers emulating SVG groups
        // (#1960, #2393, #2697).
        while (
            parentToClean?.div &&
            parentToClean.div.childNodes.length === 0
        ) {
            grandParent = (parentToClean as any).parentGroup;
            wrapper.safeRemoveChild((parentToClean as any).div);
            delete (parentToClean as any).div;
            parentToClean = grandParent;
        }

        // Remove from alignObjects
        if (wrapper.alignOptions) {
            erase(renderer.alignedObjects, wrapper);
        }

        objectEach(wrapper as AnyRecord, (val: unknown, key): void => {

            if (
                // Destroy child elements of a group
                wrapper[key]?.parentGroup === wrapper ||
                // Destroy own elements
                ['connector', 'foreignObject'].indexOf(key) !== -1
            ) {
                wrapper[key]?.destroy?.();
            }

            // Delete all properties
            delete wrapper[key];
        });

        return;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#dSettter
     * @param {number|string|Highcharts.SVGPathArray} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public dSetter(
        value: (string|SVGPath),
        key: string,
        element: SVGDOMElement
    ): void {
        if (isArray(value)) {
            // Backwards compatibility, convert one-dimensional array into an
            // array of segments
            if (typeof value[0] === 'string') {
                value = this.renderer.pathToSegments(value as any);
            }
            this.pathArray = value;
            value = value.reduce(
                (acc, seg, i): string => {
                    if (!seg?.join) {
                        return (seg || '').toString();
                    }
                    return (i ? acc + ' ' : '') + seg.join(' ');
                },
                ''
            );
        }
        if (/(NaN| {2}|^$)/.test(value)) {
            value = 'M 0 0';
        }

        // Check for cache before resetting. Resetting causes disturbance in the
        // DOM, causing flickering in some cases in Edge/IE (#6747). Also
        // possible performance gain.
        if ((this as AnyRecord)[key] !== value) {
            element.setAttribute(key, value);
            (this as AnyRecord)[key] = value;
        }

    }

    /**
     * @private
     * @function Highcharts.SVGElement#fillSetter
     * @param {Highcharts.ColorType} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public fillSetter(
        value: ColorType,
        key: string,
        element: SVGDOMElement
    ): void {
        if (typeof value === 'string') {
            element.setAttribute(key, value);
        } else if (value) {
            this.complexColor(value as any, key, element);
        }
    }

    /**
     * @private
     * @function Highcharts.SVGElement#hrefSetter
     * @param {Highcharts.ColorType} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public hrefSetter(
        value: string,
        key: string,
        element: SVGDOMElement
    ): void {
        // Namespace is needed for offline export, #19106
        element.setAttributeNS('http://www.w3.org/1999/xlink', key, value);
    }

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
     *        Skip the cache and get the updated DOM bounding box.
     *
     * @param {number} [rot]
     *        Override the element's rotation. This is internally used on axis
     *        labels with a value of 0 to find out what the bounding box would
     *        be have been if it were not rotated.
     *
     * @return {Highcharts.BBoxObject}
     *         The bounding box with `x`, `y`, `width` and `height` properties.
     */
    public getBBox(reload?: boolean, rot?: number): BBoxObject {
        const wrapper = this,
            {
                alignValue,
                element,
                renderer,
                styles,
                textStr
            } = wrapper,
            {
                cache,
                cacheKeys
            } = renderer,
            isSVG = element.namespaceURI === wrapper.SVG_NS,
            rotation = pick(rot, wrapper.rotation, 0),
            fontSize = renderer.styledMode ? (
                element &&
                SVGElement.prototype.getStyle.call(element, 'font-size')
            ) : (
                styles.fontSize
            );

        let bBox: BBoxObject|undefined,
            height,
            toggleTextShadowShim,
            cacheKey;

        // Avoid undefined and null (#7316)
        if (defined(textStr)) {

            cacheKey = textStr.toString();

            // Since numbers are monospaced, and numerical labels appear a lot
            // in a chart, we assume that a label of n characters has the same
            // bounding box as others of the same length. Unless there is inner
            // HTML in the label. In that case, leave the numbers as is (#5899).
            if (cacheKey.indexOf('<') === -1) {
                cacheKey = cacheKey.replace(/\d/g, '0');
            }

            // Properties that affect bounding box
            cacheKey += [
                '',
                renderer.rootFontSize,
                fontSize,
                rotation,
                wrapper.textWidth, // #7874, also useHTML
                alignValue,
                styles.lineClamp,
                styles.textOverflow, // #5968
                styles.fontWeight // #12163
            ].join(',');

        }

        if (cacheKey && !reload) {
            bBox = cache[cacheKey];
        }

        // No cache found
        if (!bBox || bBox.polygon) {

            // SVG elements
            if (isSVG || renderer.forExport) {
                try { // Fails in Firefox if the container has display: none.

                    // When the text shadow shim is used, we need to hide the
                    // fake shadows to get the correct bounding box (#3872)
                    toggleTextShadowShim = this.fakeTS && function (
                        display: string
                    ): void {
                        const outline = element.querySelector(
                            '.highcharts-text-outline'
                        ) as DOMElementType|undefined;

                        if (outline) {
                            css(outline, { display });
                        }
                    };

                    // Workaround for #3842, Firefox reporting wrong bounding
                    // box for shadows
                    if (isFunction(toggleTextShadowShim)) {
                        toggleTextShadowShim('none');
                    }

                    bBox = (element as any).getBBox ?
                        // SVG: use extend because IE9 is not allowed to change
                        // width and height in case of rotation (below)
                        extend({} as any, (element as any).getBBox()) : {

                            // HTML elements with `exporting.allowHTML` and
                            // legacy IE in export mode
                            width: (element as any).offsetWidth,
                            height: (element as any).offsetHeight,
                            x: 0,
                            y: 0
                        };

                    // #3842
                    if (isFunction(toggleTextShadowShim)) {
                        toggleTextShadowShim('');
                    }
                } catch (e) {
                    '';
                }

                // If the bBox is not set, the try-catch block above failed. The
                // other condition is for Opera that returns a width of
                // -Infinity on hidden elements.
                if (!bBox || bBox.width < 0) {
                    bBox = { x: 0, y: 0, width: 0, height: 0 };
                }

            // Use HTML within SVG
            } else {

                bBox = wrapper.htmlGetBBox();

            }

            // True SVG elements as well as HTML elements in modern browsers
            // using the .useHTML option need to compensated for rotation
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
                bBox.height = height = (
                    ({
                        '11px,17': 14,
                        '13px,20': 16
                    } as Record<string, number>)[
                        `${fontSize || ''},${Math.round(height)}`
                    ] ||
                    height
                );
            }

            // Adjust for rotated text
            if (rotation) {
                bBox = this.getRotatedBox(bBox, rotation);
            }

            // Create a reference to catch changes to bBox
            const e = { bBox };

            fireEvent(this, 'afterGetBBox', e);

            // Pick up any changes after the fired event
            bBox = e.bBox;
        }

        // Cache it. When loading a chart in a hidden iframe in Firefox and
        // IE/Edge, the bounding box height is 0, so don't cache it (#5620).
        if (cacheKey && (textStr === '' || bBox.height > 0)) {

            // Rotate (#4681)
            while (cacheKeys.length > 250) {
                delete cache[cacheKeys.shift() as any];
            }

            if (!cache[cacheKey]) {
                cacheKeys.push(cacheKey);
            }
            cache[cacheKey] = bBox;
        }

        return bBox;
    }

    /**
     * Get the rotated box.
     * @private
     */
    public getRotatedBox(
        box: BBoxObject,
        rotation: number
    ): BBoxObject {
        const { x: boxX, y: boxY, width, height } = box,
            {
                alignValue,
                translateY,
                rotationOriginX = 0,
                rotationOriginY = 0
            } = this,
            alignFactor = getAlignFactor(alignValue),
            baseline = Number(this.element.getAttribute('y') || 0) -
                (translateY ? 0 : boxY),
            rad = rotation * deg2rad,
            rad90 = (rotation - 90) * deg2rad,
            cosRad = Math.cos(rad),
            sinRad = Math.sin(rad),
            wCosRad = width * cosRad,
            wSinRad = width * sinRad,
            cosRad90 = Math.cos(rad90),
            sinRad90 = Math.sin(rad90),
            [
                [
                    xOriginCosRad,
                    xOriginSinRad
                ],
                [
                    yOriginCosRad,
                    yOriginSinRad
                ]
            ] = [
                rotationOriginX,
                rotationOriginY
            ].map((rotOrigin): number[] => [
                rotOrigin - (rotOrigin * cosRad),
                rotOrigin * sinRad
            ]),

            // Find the starting point on the left side baseline of
            // the text
            pX = (
                (boxX + alignFactor * (width - wCosRad)) +
                xOriginCosRad + yOriginSinRad
            ),
            pY = (
                (boxY + baseline - alignFactor * wSinRad) -
                xOriginSinRad + yOriginCosRad
            ),

            // Find all corners
            aX = pX + baseline * cosRad90,
            bX = aX + wCosRad,
            cX = bX - height * cosRad90,
            dX = cX - wCosRad,

            aY = pY + baseline * sinRad90,
            bY = aY + wSinRad,
            cY = bY - height * sinRad90,
            dY = cY - wSinRad;

        // Deduct the bounding box from the corners
        const x = Math.min(aX, bX, cX, dX),
            y = Math.min(aY, bY, cY, dY),
            boxWidth = Math.max(aX, bX, cX, dX) - x,
            boxHeight = Math.max(aY, bY, cY, dY) - y;

        /* Uncomment to debug boxes
        this.renderer.path([
            ['M', aX, aY],
            ['L', bX, bY],
            ['L', cX, cY],
            ['L', dX, dY],
            ['Z']
        ])
            .attr({
                stroke: 'red',
                'stroke-width': 1
            })
            .add();
        // */

        return {
            x,
            y,
            width: boxWidth,
            height: boxHeight,
            polygon: [
                [aX, aY],
                [bX, bY],
                [cX, cY],
                [dX, dY]
            ]
        };
    }

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
    public getStyle(prop: string): string {
        return win
            .getComputedStyle(this.element || this, '')
            .getPropertyValue(prop);
    }

    /**
     * Check if an element has the given class name.
     *
     * @function Highcharts.SVGElement#hasClass
     *
     * @param {string} className
     * The class name to check for.
     *
     * @return {boolean}
     * Whether the class name is found.
     */
    public hasClass(className: string): boolean {
        return ('' + this.attr('class'))
            .split(' ')
            .indexOf(className) !== -1;
    }

    /**
     * Hide the element, similar to setting the `visibility` attribute to
     * `hidden`.
     *
     * @function Highcharts.SVGElement#hide
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    public hide(): this {
        return this.attr({ visibility: 'hidden' });
    }

    /**
     * @private
     */
    public htmlGetBBox(): BBoxObject {
        return { height: 0, width: 0, x: 0, y: 0 };
    }

    /**
     * Initialize the SVG element. This function only exists to make the
     * initialization process overridable. It should not be called directly.
     *
     * @function Highcharts.SVGElement#init
     *
     * @param {Highcharts.SVGRenderer} renderer
     * The SVGRenderer instance to initialize to.
     *
     * @param {string} nodeName
     * The SVG node name.
     */
    public constructor(
        renderer: SVGRenderer,
        nodeName: string
    ) {

        /**
         * The primary DOM node. Each `SVGElement` instance wraps a main DOM
         * node, but may also represent more nodes.
         *
         * @name Highcharts.SVGElement#element
         * @type {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement}
         */
        this.element = nodeName === 'span' || nodeName === 'body' ?
            createElement(nodeName) as HTMLDOMElement :
            doc.createElementNS(this.SVG_NS, nodeName) as SVGDOMElement;

        /**
         * The renderer that the SVGElement belongs to.
         *
         * @name Highcharts.SVGElement#renderer
         * @type {Highcharts.SVGRenderer}
         */
        this.renderer = renderer;

        this.styles = {};

        fireEvent(this, 'afterInit');
    }

    /**
     * Add an event listener. This is a simple setter that replaces the
     * previous event of the same type added by this function, as opposed to
     * the {@link Highcharts#addEvent} function.
     *
     * @sample highcharts/members/element-on/
     *         A clickable rectangle
     *
     * @function Highcharts.SVGElement#on
     *
     * @param {string} eventType
     * The event type.
     *
     * @param {Function} handler
     * The handler callback.
     *
     * @return {Highcharts.SVGElement}
     * The SVGElement for chaining.
     */
    public on(
        eventType: string,
        handler: Function
    ): this {
        const { onEvents } = this;

        if (onEvents[eventType]) {
            // Unbind existing event
            onEvents[eventType]();
        }
        onEvents[eventType] = addEvent(this.element, eventType, handler);

        return this;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#opacitySetter
     * @param {string} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public opacitySetter(
        value: string,
        key: string,
        element: SVGDOMElement|HTMLDOMElement
    ): void {
        // Round off to avoid float errors, like tests where opacity lands on
        // 9.86957e-06 instead of 0
        const opacity = Number(Number(value).toFixed(3));
        this.opacity = opacity;
        element.setAttribute(key, opacity);
    }

    /**
     * Re-align an aligned text or label after setting the text.
     *
     * @private
     * @function Highcharts.SVGElement#reAlign
     *
     */
    protected reAlign(): void {
        if (this.alignOptions?.width && this.alignOptions.align !== 'left') {
            this.alignOptions.width = this.getBBox().width;
            this.placed = false; // Block animation
            this.align();
        }
    }

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
    public removeClass(className: (string|RegExp)): this {
        return this.attr(
            'class',
            ('' + this.attr('class'))
                .replace(
                    isString(className) ?
                        new RegExp(`(^| )${className}( |$)`) : // #12064, #13590
                        className,
                    ' '
                )
                .replace(/ +/g, ' ')
                .trim()
        );
    }

    /**
     *
     * @private
     */
    public removeTextOutline(): void {
        const outline = this.element
            .querySelector('tspan.highcharts-text-outline') as SVGDOMElement;

        if (outline) {
            this.safeRemoveChild(outline);
        }
    }

    /**
     * Removes an element from the DOM.
     *
     * @private
     * @function Highcharts.SVGElement#safeRemoveChild
     *
     * @param {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} element
     * The DOM node to remove.
     */
    public safeRemoveChild(
        element: (SVGDOMElement|HTMLDOMElement)
    ): void {
        const parentNode = element.parentNode;

        if (parentNode) {
            parentNode.removeChild(element);
        }
    }

    /**
     * Set the coordinates needed to draw a consistent radial gradient across
     * a shape regardless of positioning inside the chart. Used on pie slices
     * to make all the slices have the same radial reference point.
     *
     * @function Highcharts.SVGElement#setRadialReference
     *
     * @param {Array<number>} coordinates
     * The center reference. The format is `[centerX, centerY, diameter]` in
     * pixels.
     *
     * @return {Highcharts.SVGElement}
     * Returns the SVGElement for chaining.
     */
    public setRadialReference(coordinates: Array<number>): this {
        const existingGradient = (
            this.element.gradient &&
            this.renderer.gradients[this.element.gradient]
        ) || void 0;

        this.element.radialReference = coordinates;

        // On redrawing objects with an existing gradient, the gradient needs
        // to be repositioned (#3801)
        if (existingGradient?.radAttr) {
            existingGradient.animate(
                this.renderer.getRadialAttr(
                    coordinates,
                    existingGradient.radAttr
                )
            );
        }

        return this;
    }

    /**
     * Add a shadow to the element. In styled mode, this method is not used,
     * instead use `defs` and filters.
     *
     * @example
     * renderer.rect(10, 100, 100, 100)
     *     .attr({ fill: 'red' })
     *     .shadow(true);
     *
     * @function Highcharts.SVGElement#shadow
     *
     * @param {boolean|Highcharts.ShadowOptionsObject} [shadowOptions] The
     *        shadow options. If `true`, the default options are applied. If
     *        `false`, the current shadow will be removed.
     *
     * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
     */
    public shadow(
        shadowOptions?: (boolean|Partial<ShadowOptionsObject>)
    ): this {
        const { renderer } = this,
            options = merge(this.parentGroup?.rotation === 90 ? {
                offsetX: -1,
                offsetY: -1
            } : {}, isObject(shadowOptions) ? shadowOptions : {}),
            id = renderer.shadowDefinition(options);

        return this.attr({
            filter: shadowOptions ?
                `url(${renderer.url}#${id})` :
                'none'
        });
    }

    /**
     * Show the element after it has been hidden.
     *
     * @function Highcharts.SVGElement#show
     *
     * @param {boolean} [inherit=true]
     *        Set the visibility attribute to `inherit` rather than `visible`.
     *        The difference is that an element with `visibility="visible"`
     *        will be visible even if the parent is hidden.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    public show(inherit: boolean = true): this {
        return this.attr(
            { visibility: inherit ? 'inherit' : 'visible' }
        );
    }

    /**
     * Set the stroke-width and record it on the SVGElement
     *
     * @private
     * @function Highcharts.SVGElement#strokeSetter
     * @param {number|string|ColorType} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public 'stroke-widthSetter'(
        value: (number|string),
        key: 'stroke-width',
        element: SVGDOMElement
    ): void {
        // Record it for quick access in getter
        this[key] = value;
        element.setAttribute(key, value);
    }

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
     * The stroke width in pixels. Even if the given stroke width (in CSS or by
     * attributes) is based on `em` or other units, the pixel size is returned.
     */
    public strokeWidth(): number {

        // In non-styled mode, read the stroke width as set by .attr
        if (!this.renderer.styledMode) {
            return this['stroke-width'] || 0;
        }

        // In styled mode, read computed stroke width
        const val = this.getStyle('stroke-width');

        let ret = 0,
            tempElement: SVGDOMElement;

        // Read pixel values directly
        if (/px$/.test(val)) {
            ret = pInt(val);

        // Other values like em, pt etc need to be measured
        } else if (val !== '') {
            tempElement = doc.createElementNS(SVG_NS, 'rect') as SVGDOMElement;
            attr(tempElement, {
                width: val as any,
                'stroke-width': 0
            });
            this.element.parentNode.appendChild(tempElement);
            ret = (tempElement as any).getBBox().width;
            tempElement.parentNode.removeChild(tempElement);
        }
        return ret;
    }

    /**
     * If one of the symbol size affecting parameters are changed,
     * check all the others only once for each call to an element's
     * .attr() method
     *
     * @private
     * @function Highcharts.SVGElement#symbolAttr
     *
     * @param {Highcharts.SVGAttributes} hash
     * The attributes to set.
     */
    public symbolAttr(hash: SVGAttributes): void {
        const wrapper = this as AnyRecord;

        SVGElement.symbolCustomAttribs.forEach(function (key: string): void {
            wrapper[key] = pick((hash as any)[key], wrapper[key]);
        });

        wrapper.attr({
            d: (wrapper.renderer.symbols[wrapper.symbolName] as any)(
                wrapper.x,
                wrapper.y,
                wrapper.width,
                wrapper.height,
                wrapper
            )
        });
    }

    /**
     * @private
     * @function Highcharts.SVGElement#textSetter
     * @param {string} value
     */
    public textSetter(value: string): void {
        if (value !== this.textStr) {
            // Delete size caches when the text changes
            // delete this.bBox; // old code in series-label
            delete this.textPxLength;

            this.textStr = value;
            if (this.added) {
                this.renderer.buildText(this);
            }

            this.reAlign();
        }
    }

    /**
     * @private
     * @function Highcharts.SVGElement#titleSetter
     * @param {string} value
     */
    public titleSetter(value: string): void {
        const el = this.element;
        const titleNode = el.getElementsByTagName('title')[0] ||
            doc.createElementNS(this.SVG_NS, 'title');

        // Move to first child
        if (el.insertBefore) {
            el.insertBefore(titleNode, el.firstChild);
        } else {
            el.appendChild(titleNode);
        }

        // Replace text content and escape markup
        titleNode.textContent = replaceNested( // Scan #[73]
            pick(value, ''), // #3276, #3895
            [/<[^>]*>/g, '']
        ).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    /**
     * Bring the element to the front. Alternatively, a new zIndex can be set.
     *
     * @sample highcharts/members/element-tofront/
     *         Click an element to bring it to front
     *
     * @function Highcharts.SVGElement#toFront
     *
     * @return {Highcharts.SVGElement}
     * Returns the SVGElement for chaining.
     */
    public toFront(): this {
        const element = this.element;

        element.parentNode.appendChild(element);

        return this;
    }

    /**
     * Move an object and its children by x and y values.
     *
     * @function Highcharts.SVGElement#translate
     *
     * @param {number} x
     * The x value.
     *
     * @param {number} y
     * The y value.
     *
     * @return {Highcharts.SVGElement}
     * Translated element.
     */
    public translate(
        x: number,
        y: number
    ): this {
        return this.attr({
            translateX: x,
            translateY: y
        }) as any;
    }


    /**
     * Update the transform attribute based on internal properties. Deals with
     * the custom `translateX`, `translateY`, `rotation`, `scaleX` and `scaleY`
     * attributes and updates the SVG `transform` attribute.
     *
     * @private
     * @function Highcharts.SVGElement#updateTransform
     */
    public updateTransform(
        attrib: 'transform' | 'patternTransform' = 'transform'
    ): void {
        const {
            element,
            foreignObject,
            matrix,
            padding,
            rotation = 0,
            rotationOriginX,
            rotationOriginY,
            scaleX,
            scaleY,
            text,
            translateX = 0,
            translateY = 0
        } = this;

        // Apply translate. Nearly all transformed elements have translation,
        // so instead of checking for translate = 0, do it always (#1767,
        // #1846).
        const transform = ['translate(' + translateX + ',' + translateY + ')'];

        // Apply matrix
        if (defined(matrix)) {
            transform.push(
                'matrix(' + matrix.join(',') + ')'
            );
        }

        // Apply rotation
        if (rotation) {
            transform.push(
                'rotate(' + rotation + ' ' +
                (rotationOriginX ?? element.getAttribute('x') ?? this.x ?? 0) +
                ' ' +
                (rotationOriginY ?? element.getAttribute('y') ?? this.y ?? 0) +
                ')'
            );

            // HTML labels rotation (#20685)
            if (
                text?.element.tagName === 'SPAN' &&
                !text?.foreignObject
            ) {
                text.attr({
                    rotation,
                    rotationOriginX: (rotationOriginX || 0) - padding,
                    rotationOriginY: (rotationOriginY || 0) - padding
                });
            }
        }

        // Apply scale
        if (defined(scaleX) || defined(scaleY)) {
            transform.push(
                'scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')'
            );
        }

        if (transform.length && !(text || this).textPath) {
            (foreignObject?.element || element)
                .setAttribute(attrib, transform.join(' '));
        }
    }

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
     */
    public visibilitySetter(
        value: 'hidden'|'inherit'|'visible',
        key: 'visibility',
        element: SVGDOMElement
    ): void {
        // IE9-11 doesn't handle visibility:inherit well, so we remove the
        // attribute instead (#2881, #3909)
        if (value === 'inherit') {
            element.removeAttribute(key);
        } else if (this[key] !== value) { // #6747
            element.setAttribute(key, value);
        }
        this[key] = value;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#xGetter
     */
    public xGetter(key: string): (number|string|null) {
        if (this.element.nodeName === 'circle') {
            if (key === 'x') {
                key = 'cx';
            } else if (key === 'y') {
                key = 'cy';
            }
        }
        return this._defaultGetter(key);
    }

    /**
     * @private
     * @function Highcharts.SVGElement#zIndexSetter
     */
    public zIndexSetter(
        value?: number,
        key?: string
    ): boolean {
        const renderer = this.renderer,
            parentGroup = this.parentGroup,
            parentWrapper = parentGroup || renderer,
            parentNode = (parentWrapper as any).element || renderer.box,
            element = this.element,
            svgParent = parentNode === renderer.box;

        let childNodes,
            otherElement,
            otherZIndex,
            inserted = false,
            undefinedOtherZIndex,
            run = this.added,
            i;

        if (defined(value)) {
            // So we can read it for other elements in the group
            element.setAttribute('data-z-index', (value as any));

            (value as any) = +(value as any);
            if ((this as any)[key as any] === value) {
                // Only update when needed (#3865)
                run = false;
            }
        } else if (defined((this as any)[key as any])) {
            element.removeAttribute('data-z-index');
        }

        (this as any)[key as any] = value;

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
                        value as any < 0 &&
                        undefinedOtherZIndex &&
                        !svgParent &&
                        !i
                    ) {
                        parentNode.insertBefore(element, childNodes[i]);
                        inserted = true;
                    } else if (
                        // Insert after the first element with a lower zIndex
                        pInt(otherZIndex) <= (value as any) ||
                        // If negative zIndex, add this before first undefined
                        // zIndex element
                        (
                            undefinedOtherZIndex &&
                            (!defined(value) || (value as any) >= 0)
                        )
                    ) {
                        parentNode.insertBefore(
                            element,
                            childNodes[i + 1]
                        );
                        inserted = true;
                    }
                }
            }

            if (!inserted) {
                parentNode.insertBefore(
                    element,
                    childNodes[svgParent ? 3 : 0]
                );
                inserted = true;
            }
        }
        return inserted;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface SVGElement extends SVGElementLike {
    // Takes interfaces from shared interface and internal namespace
    matrixSetter: SVGElement.SetterFunction<(number|string|null)>;
    rotationOriginXSetter(value: number|null, key?: string): void;
    rotationOriginYSetter(value: number|null, key?: string): void;
    rotationSetter(value: number, key?: string): void;
    scaleXSetter: SVGElement.SetterFunction<(number|string|null)>;
    scaleYSetter: SVGElement.SetterFunction<(number|string|null)>;
    'stroke-widthSetter'(
        value: (number|string),
        key: string,
        element: SVGDOMElement
    ): void;
    translateXSetter: SVGElement.SetterFunction<(number|string|null)>;
    translateYSetter: SVGElement.SetterFunction<(number|string|null)>;
    verticalAlignSetter: SVGElement.SetterFunction<(number|string|null)>;
    yGetter(key: string): (number|string|null);
}

// Some shared setters and getters
SVGElement.prototype.strokeSetter = SVGElement.prototype.fillSetter;
SVGElement.prototype.yGetter = SVGElement.prototype.xGetter;
SVGElement.prototype.matrixSetter =
SVGElement.prototype.rotationOriginXSetter =
SVGElement.prototype.rotationOriginYSetter =
SVGElement.prototype.rotationSetter =
SVGElement.prototype.scaleXSetter =
SVGElement.prototype.scaleYSetter =
SVGElement.prototype.translateXSetter =
SVGElement.prototype.translateYSetter =
SVGElement.prototype.verticalAlignSetter = function (
    value: (number|string|null),
    key: string
): void {
    (this as AnyRecord)[key] = value;
    this.doTransform = true;
};

/* *
 *
 *  Class Namespace
 *
 * */

namespace SVGElement {

    export interface ElementSetterFunction<T> {
        (value: T, key: string, element: SVGDOMElement): void;
    }

    export interface GetterFunction<T> {
        (key: string): T;
    }

    export interface SetterFunction<T> {
        (value: T, key: string): void;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SVGElement;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Reference to the global SVGElement class as a workaround for a name conflict
 * in the Highcharts namespace.
 *
 * @global
 * @typedef {global.SVGElement} GlobalSVGElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */

/**
 * The horizontal alignment of an element.
 *
 * @typedef {"center"|"left"|"right"} Highcharts.AlignValue
 */

/**
 * Options to align the element relative to the chart or another box.
 *
 * @interface Highcharts.AlignObject
 *//**
 * Horizontal alignment. Can be one of `left`, `center` and `right`.
 *
 * @name Highcharts.AlignObject#align
 * @type {Highcharts.AlignValue|undefined}
 *
 * @default left
 *//**
 * Vertical alignment. Can be one of `top`, `middle` and `bottom`.
 *
 * @name Highcharts.AlignObject#verticalAlign
 * @type {Highcharts.VerticalAlignValue|undefined}
 *
 * @default top
 *//**
 * Horizontal pixel offset from alignment.
 *
 * @name Highcharts.AlignObject#x
 * @type {number|undefined}
 *
 * @default 0
 *//**
 * Vertical pixel offset from alignment.
 *
 * @name Highcharts.AlignObject#y
 * @type {number|undefined}
 *
 * @default 0
 *//**
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
 *//**
 * Height of the bounding box.
 *
 * @name Highcharts.BBoxObject#height
 * @type {number}
 *//**
 * Width of the bounding box.
 *
 * @name Highcharts.BBoxObject#width
 * @type {number}
 *//**
 * Horizontal position of the bounding box.
 *
 * @name Highcharts.BBoxObject#x
 * @type {number}
 *//**
 * Vertical position of the bounding box.
 *
 * @name Highcharts.BBoxObject#y
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
 *//**
 * @name Highcharts.SVGAttributes#[key:string]
 * @type {*}
 *//**
 * @name Highcharts.SVGAttributes#d
 * @type {string|Highcharts.SVGPathArray|undefined}
 *//**
 * @name Highcharts.SVGAttributes#dx
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#dy
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#fill
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
 *//**
 * @name Highcharts.SVGAttributes#inverted
 * @type {boolean|undefined}
 *//**
 * @name Highcharts.SVGAttributes#matrix
 * @type {Array<number>|undefined}
 *//**
 * @name Highcharts.SVGAttributes#rotation
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#rotationOriginX
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#rotationOriginY
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#scaleX
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#scaleY
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#stroke
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
 *//**
 * @name Highcharts.SVGAttributes#style
 * @type {string|Highcharts.CSSObject|undefined}
 *//**
 * @name Highcharts.SVGAttributes#translateX
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#translateY
 * @type {number|undefined}
 *//**
 * @name Highcharts.SVGAttributes#zIndex
 * @type {number|undefined}
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
 * The vertical alignment of an element.
 *
 * @typedef {"bottom"|"middle"|"top"} Highcharts.VerticalAlignValue
 */

''; // Keeps doclets above in JS file
