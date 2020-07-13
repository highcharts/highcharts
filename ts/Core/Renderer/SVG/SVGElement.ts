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

import type SVGPath from './SVGPath';
import Color from '../../Color.js';
import H from '../../Globals.js';
const {
    deg2rad,
    doc,
    hasTouch,
    isFirefox,
    noop,
    svg,
    SVG_NS,
    win
} = H;
import U from '../../Utilities.js';
const {
    animate,
    animObject,
    attr,
    createElement,
    css,
    defined,
    erase,
    extend,
    fireEvent,
    isArray,
    isFunction,
    isNumber,
    isString,
    merge,
    objectEach,
    pick,
    pInt,
    stop,
    syncTimeout,
    uniqueKey
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    interface Element {
        gradient?: string;
        parentNode: (Node&ParentNode);
        radialReference?: Array<number>;
    }
    interface SVGElement {
        cutHeight?: number;
    }
    namespace Highcharts {
        type AlignValue = ('center'|'left'|'right');
        type HTMLDOMElement = globalThis.HTMLElement;
        type SVGDOMElement = globalThis.SVGElement;
        type VerticalAlignValue = ('bottom'|'middle'|'top');
        interface AlignObject {
            align?: AlignValue;
            alignByTranslate?: boolean;
            verticalAlign?: VerticalAlignValue;
            x?: number;
            y?: number;
        }
        interface BBoxObject extends PositionObject, SizeObject {
            height: number;
            width: number;
            x: number;
            y: number;
        }
        interface ShadowOptionsObject {
            color: ColorString;
            offsetX: number;
            offsetY: number;
            opacity: number;
            width: number;
        }
        interface SVGAttributes {
            [key: string]: any;
            clockwise?: number;
            d?: (string|SVGPath);
            fill?: ColorType;
            // height?: number;
            inverted?: boolean;
            longArc?: number;
            matrix?: Array<number>;
            rotation?: number;
            rotationOriginX?: number;
            rotationOriginY?: number;
            scaleX?: number;
            scaleY?: number;
            stroke?: ColorType;
            style?: CSSObject;
            translateX?: number;
            translateY?: number;
            // width?: number;
            // x?: number;
            // y?: number;
            zIndex?: number;
        }
        class SVGElement {
            public constructor();
            [key: string]: any;
            public element: (HTMLDOMElement|SVGDOMElement);
            public hasBoxWidthChanged: boolean;
            public parentGroup?: SVGElement;
            public pathArray?: SVGPath;
            public r?: number;
            public renderer: SVGRenderer;
            public rotation?: number;
            public shadows?: Array<(HTMLDOMElement|SVGDOMElement)>;
            public oldShadowOptions?: Highcharts.ShadowOptionsObject;
            public styles?: CSSObject;
            public textStr?: string;
            public x?: number;
            public y?: number;
            public add(parent?: SVGElement): SVGElement;
            public addClass(className: string, replace?: boolean): SVGElement;
            public afterSetters(): void;
            public align(
                alignOptions?: AlignObject,
                alignByTranslate?: boolean,
                box?: (string|BBoxObject)
            ): SVGElement;
            public alignSetter(value: ('left'|'center'|'right')): void;
            public animate(
                params: SVGAttributes,
                options?: (boolean|Partial<AnimationOptionsObject>),
                complete?: Function
            ): SVGElement;
            public applyTextOutline(textOutline: string): void;
            public attr(
                hash: string
            ): (number|string)
            public attr(
                hash?: (string|SVGAttributes),
                val?: (number|string|SVGPath),
                complete?: Function,
                continueAnimation?: boolean
            ): SVGElement;
            public clip(clipRect?: ClipRectElement): SVGElement;
            public complexColor(
                color: GradientColorObject,
                prop: string,
                elem: SVGDOMElement
            ): void;
            public crisp(
                rect: RectangleObject,
                strokeWidth?: number
            ): RectangleObject;
            public css(styles: CSSObject): SVGElement;
            public dashstyleSetter(value: string): void;
            public destroy(): undefined;
            public destroyShadows(): void;
            public destroyTextPath (
                elem: SVGDOMElement,
                path: SVGElement
            ): void;
            public dSetter(
                value: (number|string|SVGPath),
                key: string,
                element: SVGDOMElement
            ): void;
            public fadeOut(duration?: number): void;
            public fillSetter(
                value: ColorType,
                key: string,
                element: SVGDOMElement
            ): void;
            public getBBox(reload?: boolean, rot?: number): BBoxObject;
            public getStyle(prop: string): string;
            public hasClass(className: string): boolean;
            public hide(hideByTranslation?: boolean): SVGElement;
            public init(renderer: SVGRenderer, nodeName: string): void;
            public invert(inverted: boolean): SVGElement
            public matrixSetter(value: any, key: string): void;
            public on(eventType: string, handler: Function): SVGElement;
            public opacitySetter(
                value: string,
                key: string,
                element: SVGDOMElement
            ): void;
            public removeClass(
                className: (string|RegExp)
            ): SVGElement;
            public removeTextOutline(tspans: Array<SVGDOMElement>): void;
            public rotationOriginXSetter(value: any, key: string): void;
            public rotationOriginYSetter(value: any, key: string): void;
            public rotationSetter(value: any, key: string): void;
            public safeRemoveChild(
                element: (SVGDOMElement|HTMLDOMElement)
            ): void;
            public scaleXSetter(value: any, key: string): void;
            public scaleYSetter(value: any, key: string): void;
            public setRadialReference(coordinates: Array<number>): SVGElement;
            public setTextPath(
                path: SVGElement,
                textPathOptions: object
            ): SVGElement;
            public shadow(
                shadowOptions?: (boolean|Partial<ShadowOptionsObject>),
                group?: SVGElement,
                cutOff?: boolean
            ): SVGElement;
            public show(inherit?: boolean): SVGElement;
            public strokeSetter(
                value: (number|string),
                key: string,
                element: SVGDOMElement
            ): void
            public strokeWidth(): number;
            public symbolAttr(hash: SVGAttributes): void;
            public textSetter(value: string): void;
            public titleSetter(value: string): void;
            public toFront(): SVGElement;
            public translate(x: number, y: number): SVGElement;
            public translateXSetter(value: any, key: string): void;
            public translateYSetter(value: any, key: string): void;
            public updateShadows(
                key: string,
                value: number,
                setter: Function
            ): void;
            public updateTransform(): void;
            public verticalAlignSetter(value: any, key: string): void;
            public visibilitySetter(
                value: string,
                key: string,
                element: SVGDOMElement
            ): void;
            public xGetter(key: string): (number|string|null);
            public yGetter(key: string): (number|string|null);
            public zIndexSetter(value: number, key: string): boolean;
        }
    }
}

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

''; // detach doclets above

/**
 * @private
 */
interface SVGElement extends Highcharts.SVGElement {
    // takes interfaces from internal namespace
}

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
 * @class
 * @name Highcharts.SVGElement
 */
class SVGElement {

    /* *
     *
     *  Properties
     *
     * */

    public added?: boolean;
    public alignAttr?: Highcharts.SVGAttributes;
    public alignByTranslate?: boolean;
    public alignOptions?: Highcharts.AlignObject;
    public alignTo?: string;
    public alignValue?: ('left'|'center'|'right');
    public clipPath?: SVGElement;
    public element: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement) = void 0 as any;
    public d?: number;
    public div?: Highcharts.HTMLDOMElement;
    public doTransform?: boolean;
    public fakeTS?: boolean;
    public handleZ?: boolean;
    public hasStroke?: boolean;
    public height: number = void 0 as any;
    public inverted?: boolean;
    public matrix?: Array<number>;
    public oldShadowOptions?: Highcharts.ShadowOptionsObject;
    public onAdd?: Function;
    public opacity = 1; // Default base for animation
    public options?: Record<string, any>;
    public parentInverted?: boolean;
    public parentGroup?: SVGElement;
    public pathArray?: SVGPath;
    public placed?: boolean;
    public r?: number;
    public radAttr?: Highcharts.SVGAttributes;
    public renderer: Highcharts.SVGRenderer = void 0 as any;
    public rotation?: number;
    public rotationOriginX?: number;
    public rotationOriginY?: number;
    public scaleX?: number;
    public scaleY?: number;
    public shadows?: Array<Highcharts.SVGDOMElement>;
    public stops?: Array<SVGElement>;
    public stroke?: Highcharts.ColorType;
    public 'stroke-width'?: number;
    public styledMode?: boolean;
    public styles?: Highcharts.CSSObject;
    public SVG_NS = SVG_NS;
    // Custom attributes used for symbols, these should be filtered out when
    // setting SVGElement attributes (#9375).
    public symbolCustomAttribs: Array<string> = [
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
    ];
    public symbolName?: string;
    public text?: SVGElement;
    public textStr?: string;
    public textWidth?: number;
    public textPathWrapper?: SVGElement;
    public textPxLength?: number;
    public translateX?: number;
    public translateY?: number;
    public width: number = void 0 as any;
    public x?: number;
    public xSetter?: (SVGElement.ElementSetterFunction<string>|SVGElement.SetterFunction<number>);
    public y?: number;
    public ySetter?: (SVGElement.ElementSetterFunction<string>|SVGElement.SetterFunction<number>);
    public zIndex?: number;

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
        var ret = pick(
            (this as Record<string, any>)[key + 'Value'], // align getter
            (this as Record<string, any>)[key],
            this.element ? this.element.getAttribute(key) : null,
            0
        );

        if (/^[\-0-9\.]+$/.test(ret)) { // is numerical
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
     * @return {void}
     */
    public _defaultSetter(
        value: string,
        key: string,
        element: Highcharts.SVGDOMElement
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
    public add(parent?: SVGElement): SVGElement {
        var renderer = this.renderer,
            element = this.element,
            inserted;

        if (parent) {
            this.parentGroup = parent;
        }

        // Mark as inverted
        this.parentInverted = parent && (parent as any).inverted;

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

        // fire an event for internal hooks
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
    ): SVGElement {
        var currentClassName = replace ? '' : (this.attr('class') || '');

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
     * @param {string|Highcharts.BBoxObject} [box]
     *        The box to align to, needs a width and height. When the box is a
     *        string, it refers to an object in the Renderer. For example, when
     *        box is `spacingBox`, it refers to `Renderer.spacingBox` which
     *        holds `width`, `height`, `x` and `y` properties.
     *
     * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
     */
    public align(
        alignOptions?: Highcharts.AlignObject,
        alignByTranslate?: boolean,
        box?: (string|Highcharts.BBoxObject)
    ): SVGElement {
        var align: Highcharts.AlignValue,
            vAlign: Highcharts.VerticalAlignValue,
            x,
            y,
            attribs = {} as Highcharts.SVGAttributes,
            alignTo: (string|undefined),
            renderer = this.renderer,
            alignedObjects: Array<SVGElement> = renderer.alignedObjects as any,
            alignFactor,
            vAlignFactor;

        // First call on instanciate
        if (alignOptions) {
            this.alignOptions = alignOptions;
            this.alignByTranslate = alignByTranslate;
            if (!box || isString(box)) {
                this.alignTo = alignTo = box || 'renderer';
                // prevent duplicates, like legendGroup after resize
                erase(alignedObjects, this);
                alignedObjects.push(this);
                box = void 0; // reassign it below
            }

        // When called on resize, no arguments are supplied
        } else {
            alignOptions = this.alignOptions;
            alignByTranslate = this.alignByTranslate;
            alignTo = this.alignTo;
        }

        box = pick(box, (renderer as any)[alignTo as any], renderer as any);

        // Assign variables
        align = (alignOptions as any).align;
        vAlign = (alignOptions as any).verticalAlign;
        // default: left align
        x = ((box as any).x || 0) + ((alignOptions as any).x || 0);
        // default: top align
        y = ((box as any).y || 0) + ((alignOptions as any).y || 0);

        // Align
        if (align === 'right') {
            alignFactor = 1;
        } else if (align === 'center') {
            alignFactor = 2;
        }
        if (alignFactor) {
            x += ((box as any).width - ((alignOptions as any).width || 0)) /
                alignFactor;
        }
        attribs[alignByTranslate ? 'translateX' : 'x'] = Math.round(x);


        // Vertical align
        if (vAlign === 'bottom') {
            vAlignFactor = 1;
        } else if (vAlign === 'middle') {
            vAlignFactor = 2;
        }
        if (vAlignFactor) {
            y += ((box as any).height - ((alignOptions as any).height || 0)) /
                vAlignFactor;
        }
        attribs[alignByTranslate ? 'translateY' : 'y'] = Math.round(y);

        // Animate only if already placed
        this[this.placed ? 'animate' : 'attr'](attribs);
        this.placed = true;
        this.alignAttr = attribs;

        return this;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#alignSetter
     * @param {"left"|"center"|"right"} value
     */
    public alignSetter(value: ('left'|'center'|'right')): void {
        var convert: Record<string, string> = {
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
        params: Highcharts.SVGAttributes,
        options?: (boolean|Partial<Highcharts.AnimationOptionsObject>),
        complete?: Function
    ): SVGElement {
        var animOptions = animObject(
                pick(options, this.renderer.globalAnimation, true)
            ),
            deferTime = animOptions.defer;

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
            // If defer option is defined delay the animation #12901
            syncTimeout((): void => {
                if (this.element) {
                    animate(this, params, animOptions);
                }
            }, deferTime);
        } else {
            this.attr(params, void 0, complete);
            // Call the end step synchronously
            objectEach(params, function (val: any, prop: string): void {
                if (animOptions.step) {
                    animOptions.step.call(this as any, val, { prop: prop, pos: 1 });
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
        var elem = this.element,
            tspans: Array<Highcharts.SVGDOMElement>,
            hasContrast = textOutline.indexOf('contrast') !== -1,
            styles = {} as Highcharts.CSSObject,
            color: Highcharts.ColorString,
            strokeWidth: string,
            firstRealChild: Highcharts.SVGDOMElement;

        // When the text shadow is set to contrast, use dark stroke for light
        // text and vice versa.
        if (hasContrast) {
            styles.textOutline = textOutline = textOutline.replace(
                /contrast/g,
                this.renderer.getContrast(elem.style.fill as any)
            );
        }

        // Extract the stroke width and color
        textOutline = textOutline.split(' ') as any;
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
            strokeWidth = strokeWidth.replace(
                /(^[\d\.]+)(.*?)$/g,
                function (match: string, digit: string, unit: string): string {
                    return (2 * (digit as any)) + unit;
                }
            );

            // Remove shadows from previous runs.
            this.removeTextOutline(tspans);

            // Check if the element contains RTL characters.
            // Comparing against Hebrew and Arabic characters,
            // excluding Arabic digits. Source:
            // https://www.unicode.org/Public/UNIDATA/extracted/DerivedBidiClass.txt
            const isRTL = elem.textContent ?
                /^[\u0591-\u065F\u066A-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
                    .test(elem.textContent) : false;
            // For each of the tspans, create a stroked copy behind it.
            firstRealChild = elem.firstChild as any;
            tspans.forEach(function (
                tspan: Highcharts.SVGDOMElement,
                y: number
            ): void {
                var clone: any;

                // Let the first line start at the correct X position
                if (y === 0) {
                    tspan.setAttribute('x', elem.getAttribute('x') as any);
                    y = elem.getAttribute('y') as any;
                    tspan.setAttribute('y', y || 0);
                    if (y === null) {
                        elem.setAttribute('y', 0);
                    }
                }

                // Create the clone and apply outline properties.
                // For RTL elements apply outline properties for orginal element
                // to prevent outline from overlapping the text.
                // For RTL in Firefox keep the orginal order (#10162).
                clone = tspan.cloneNode(true);
                attr((isRTL && !isFirefox) ? tspan : clone, {
                    'class': 'highcharts-text-outline',
                    fill: color,
                    stroke: color,
                    'stroke-width': strokeWidth,
                    'stroke-linejoin': 'round'
                });
                elem.insertBefore(clone, firstRealChild);
            });

            // Create a whitespace between tspan and clone,
            // to fix the display of Arabic characters in Firefox.
            if (isRTL && isFirefox && tspans[0]) {
                const whitespace = tspans[0].cloneNode(true);
                whitespace.textContent = ' ';
                elem.insertBefore(whitespace, firstRealChild);
            }
        }
    }

    public attr(key: string): (number|string);
    public attr(
        hash: Highcharts.SVGAttributes,
        val?: undefined,
        complete?: Function,
        continueAnimation?: boolean
    ): SVGElement;
    public attr(
        key: string,
        val: (number|string|SVGPath),
        complete?: Function,
        continueAnimation?: boolean
    ): SVGElement;
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
        hash?: (string|Highcharts.SVGAttributes),
        val?: (number|string|SVGPath),
        complete?: Function,
        continueAnimation?: boolean
    ): (number|string|SVGElement) {
        var key,
            element = this.element,
            hasSetSymbolSize: boolean,
            ret = this,
            skipAttr,
            setter,
            symbolCustomAttribs = this.symbolCustomAttribs;

        // single key-value pair
        if (typeof hash === 'string' && typeof val !== 'undefined') {
            key = hash;
            hash = {};
            hash[key] = val;
        }

        // used as a getter: first argument is a string, second is undefined
        if (typeof hash === 'string') {
            ret = (
                (this as Record<string, any>)[hash + 'Getter'] ||
                (this as Record<string, any>)._defaultGetter
            ).call(
                this,
                hash,
                element
            );

        // setter
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
                        (this as Record<string, any>)[key + 'Setter'] ||
                        (this as Record<string, any>)._defaultSetter
                    );
                    setter.call(this, val, key, element);

                    // Let the shadow follow the main element
                    if (
                        !this.styledMode &&
                        this.shadows &&
                        /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(key)
                    ) {
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
    }

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
    public clip(clipRect?: Highcharts.ClipRectElement): SVGElement {
        return this.attr(
            'clip-path',
            clipRect ?
                'url(' + this.renderer.url + '#' + clipRect.id + ')' :
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
        rect: Highcharts.RectangleObject,
        strokeWidth?: number
    ): Highcharts.RectangleObject {

        var wrapper = this,
            normalizer;

        strokeWidth = strokeWidth || rect.strokeWidth || 0;
        // Math.round because strokeWidth can sometimes have roundoff errors
        normalizer = Math.round(strokeWidth) % 2 / 2;

        // normalize for crisp edges
        rect.x = Math.floor(rect.x || wrapper.x || 0) + normalizer;
        rect.y = Math.floor(rect.y || wrapper.y || 0) + normalizer;
        rect.width = Math.floor(
            (rect.width || wrapper.width || 0) - 2 * normalizer
        );
        rect.height = Math.floor(
            (rect.height || wrapper.height || 0) - 2 * normalizer
        );
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
        colorOptions: (Highcharts.GradientColorObject|Highcharts.PatternObject),
        prop: string,
        elem: Highcharts.SVGDOMElement
    ): void {
        var renderer = this.renderer,
            colorObject,
            gradName: keyof Highcharts.GradientColorObject,
            gradAttr: Highcharts.SVGAttributes,
            radAttr: Highcharts.SVGAttributes,
            gradients: Record<string, SVGElement>,
            stops: (Array<Highcharts.GradientColorStopObject>|undefined),
            stopColor: Highcharts.ColorString,
            stopOpacity,
            radialReference: Array<number>,
            id,
            key = [] as (string|Array<string>),
            value: string;

        fireEvent(this.renderer, 'complexColor', {
            args: arguments
        }, function (): void {
            // Apply linear or radial gradients
            if ((colorOptions as Highcharts.GradientColorObject).radialGradient) {
                gradName = 'radialGradient';
            } else if ((colorOptions as Highcharts.GradientColorObject).linearGradient) {
                gradName = 'linearGradient';
            }

            if (gradName) {
                gradAttr = (colorOptions as Highcharts.GradientColorObject)[gradName] as any;
                gradients = renderer.gradients as any;
                stops = (colorOptions as Highcharts.GradientColorObject).stops;
                radialReference = (elem as any).radialReference;

                // Keep < 2.2 kompatibility
                if (isArray(gradAttr)) {
                    (colorOptions as any)[gradName] = gradAttr = {
                        x1: gradAttr[0],
                        y1: gradAttr[1],
                        x2: gradAttr[2],
                        y2: gradAttr[3],
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
                objectEach(gradAttr, function (val: string, n: string): void {
                    if (n !== 'id') {
                        (key as any).push(n, val);
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
                        stop: [number, Highcharts.ColorString]
                    ): void {
                        var stopObject;

                        if (stop[1].indexOf('rgba') === 0) {
                            colorObject = Color.parse(stop[1]);
                            stopColor = colorObject.get('rgb') as any;
                            stopOpacity = colorObject.get('a');
                        } else {
                            stopColor = stop[1];
                            stopOpacity = 1;
                        }
                        stopObject = renderer.createElement('stop').attr({
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
                (elem as any).gradient = key;

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
    public css(styles: Highcharts.CSSObject): SVGElement {
        var oldStyles = this.styles,
            newStyles: Highcharts.CSSObject = {},
            elem = this.element,
            textWidth,
            serializedCss = '',
            hyphenate: Function,
            hasNew = !oldStyles,
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
            objectEach(styles, function (style, n): void {
                if (oldStyles && oldStyles[n] !== style) {
                    newStyles[n] = style;
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
            if (styles) {
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
            }

            // store object
            this.styles = styles;

            if (textWidth && (!svg && this.renderer.forExport)) {
                delete styles.width;
            }

            // Serialize and set style attribute
            if (elem.namespaceURI === this.SVG_NS) { // #7633
                hyphenate = function (a: string, b: string): string {
                    return '-' + b.toLowerCase();
                };
                objectEach(styles, function (style, n): void {
                    if (svgPseudoProps.indexOf(n) === -1) {
                        serializedCss +=
                        n.replace(/([A-Z])/g, hyphenate as any) + ':' +
                        style + ';';
                    }
                });
                if (serializedCss) {
                    attr(elem, 'style', serializedCss); // #1881
                }
            } else {
                css(elem, styles);
            }


            if (this.added) {

                // Rebuild text after added. Cache mechanisms in the buildText
                // will prevent building if there are no significant changes.
                if (this.element.nodeName === 'text') {
                    this.renderer.buildText(this as any);
                }

                // Apply text outline after added
                if (styles && styles.textOutline) {
                    this.applyTextOutline(styles.textOutline as any);
                }
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
        var i,
            strokeWidth = this['stroke-width'];

        // If "inherit", like maps in IE, assume 1 (#4981). With HC5 and the new
        // strokeWidth function, we should be able to use that instead.
        if (strokeWidth as unknown as string === 'inherit') {
            strokeWidth = 1;
        }
        value = value && value.toLowerCase();
        if (value) {
            const v = value
                .replace('shortdashdotdot', '3,1,1,1,1,1,')
                .replace('shortdashdot', '3,1,1,1')
                .replace('shortdot', '1,1,')
                .replace('shortdash', '3,1,')
                .replace('longdash', '8,3,')
                .replace(/dot/g, '1,3,')
                .replace('dash', '4,3,')
                .replace(/,$/, '')
                .split(','); // ending comma

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
        var wrapper = this,
            element = wrapper.element || {},
            renderer = wrapper.renderer,
            parentToClean: (SVGElement|undefined) = (
                renderer.isSVG &&
                element.nodeName === 'SPAN' &&
                wrapper.parentGroup ||
                void 0
            ),
            grandParent: SVGElement,
            ownerSVGElement = (element as Highcharts.SVGDOMElement).ownerSVGElement,
            i;

        // remove events
        element.onclick = element.onmouseout = element.onmouseover =
            element.onmousemove = (element as any).point = null;
        stop(wrapper as any); // stop running animations

        if (wrapper.clipPath && ownerSVGElement) {
            const clipPath = wrapper.clipPath;
            // Look for existing references to this clipPath and remove them
            // before destroying the element (#6196).
            // The upper case version is for Edge
            [].forEach.call(
                ownerSVGElement.querySelectorAll('[clip-path],[CLIP-PATH]'),
                function (el: Highcharts.SVGDOMElement): void {
                    var clipPathAttr = el.getAttribute('clip-path');

                    if ((clipPathAttr as any).indexOf(clipPath.element.id) > -1
                    ) {
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

        // remove element
        wrapper.safeRemoveChild(element);

        if (!renderer.styledMode) {
            wrapper.destroyShadows();
        }

        // In case of useHTML, clean up empty containers emulating SVG groups
        // (#1960, #2393, #2697).
        while (
            parentToClean &&
            parentToClean.div &&
            parentToClean.div.childNodes.length === 0
        ) {
            grandParent = (parentToClean as any).parentGroup;
            wrapper.safeRemoveChild((parentToClean as any).div);
            delete (parentToClean as any).div;
            parentToClean = grandParent;
        }

        // remove from alignObjects
        if (wrapper.alignTo) {
            erase(renderer.alignedObjects, wrapper);
        }

        objectEach(wrapper, function (val: unknown, key: string): void {

            // Destroy child elements of a group
            if (
                (wrapper as Record<string, any>)[key] &&
                (wrapper as Record<string, any>)[key].parentGroup === wrapper &&
                (wrapper as Record<string, any>)[key].destroy
            ) {
                (wrapper as Record<string, any>)[key].destroy();
            }

            // Delete all properties
            delete (wrapper as Record<string, any>)[key];
        });

        return;
    }

    /**
     * Destroy shadows on the element.
     *
     * @private
     * @function Highcharts.SVGElement#destroyShadows
     *
     * @return {void}
     */
    public destroyShadows(): void {
        (this.shadows || []).forEach(function (
            shadow: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement)
        ): void {
            this.safeRemoveChild(shadow);
        }, this);
        this.shadows = void 0;
    }

    /**
     * @private
     */
    public destroyTextPath(
        elem: Highcharts.SVGDOMElement,
        path: SVGElement
    ): void {
        const textElement = elem.getElementsByTagName('text')[0];
        let tspans: NodeListOf<ChildNode>;

        if (textElement) {
            // Remove textPath attributes
            textElement.removeAttribute('dx');
            textElement.removeAttribute('dy');

            // Remove ID's:
            path.element.setAttribute('id', '');
            // Check if textElement includes textPath,
            if (
                this.textPathWrapper &&
                textElement.getElementsByTagName('textPath').length
            ) {
                // Move nodes to <text>
                tspans = this.textPathWrapper.element.childNodes;
                // Now move all <tspan>'s to the <textPath> node
                while (tspans.length) {
                    textElement.appendChild(tspans[0]);
                }
                // Remove <textPath> from the DOM
                textElement.removeChild(this.textPathWrapper.element);
            }
        } else if (elem.getAttribute('dx') || elem.getAttribute('dy')) {
            // Remove textPath attributes from elem
            // to get correct text-outline position
            elem.removeAttribute('dx');
            elem.removeAttribute('dy');
        }
        if (this.textPathWrapper) {
            // Set textPathWrapper to undefined and destroy it
            this.textPathWrapper = this.textPathWrapper.destroy();
        }
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
        element: Highcharts.SVGDOMElement
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
                    if (!seg || !seg.join) {
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
        if ((this as Record<string, any>)[key] !== value) {
            element.setAttribute(key, value);
            (this as Record<string, any>)[key] = value;
        }

    }

    /**
     * Fade out an element by animating its opacity down to 0, and hide it on
     * complete. Used internally for the tooltip.
     *
     * @function Highcharts.SVGElement#fadeOut
     *
     * @param {number} [duration=150]
     * The fade duration in milliseconds.
     */
    public fadeOut(duration?: number): void {
        var elemWrapper = this;

        elemWrapper.animate({
            opacity: 0
        }, {
            duration: pick(duration, 150),
            complete: function (): void {
                // #3088, assuming we're only using this for tooltips
                elemWrapper.attr({ y: -9999 }).hide();
            }
        });
    }

    /**
     * @private
     * @function Highcharts.SVGElement#fillSetter
     * @param {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public fillSetter(
        value: Highcharts.ColorType,
        key: string,
        element: Highcharts.SVGDOMElement
    ): void {
        if (typeof value === 'string') {
            element.setAttribute(key, value);
        } else if (value) {
            this.complexColor(value as any, key, element);
        }
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
    public getBBox(
        reload?: boolean,
        rot?: number
    ): Highcharts.BBoxObject {
        var wrapper = this,
            bBox: any, // = wrapper.bBox,
            renderer = wrapper.renderer,
            width,
            height,
            element = wrapper.element,
            styles = wrapper.styles,
            fontSize,
            textStr = wrapper.textStr,
            toggleTextShadowShim,
            cache = renderer.cache,
            cacheKeys = renderer.cacheKeys,
            isSVG = element.namespaceURI === wrapper.SVG_NS,
            cacheKey;

        const rotation = pick(rot, wrapper.rotation, 0);

        fontSize = renderer.styledMode ? (
            element &&
            SVGElement.prototype.getStyle.call(element, 'font-size')
        ) : (
            styles && styles.fontSize
        );

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
                wrapper.textWidth, // #7874, also useHTML
                styles && styles.textOverflow, // #5968
                styles && styles.fontWeight // #12163
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
                    toggleTextShadowShim = this.fakeTS && function (
                        display: string
                    ): void {
                        [].forEach.call(
                            element.querySelectorAll(
                                '.highcharts-text-outline'
                            ),
                            function (tspan: Highcharts.SVGDOMElement): void {
                                tspan.style.display = display;
                            }
                        );
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

                            // Legacy IE in export mode
                            width: (element as any).offsetWidth,
                            height: (element as any).offsetHeight
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
                    bBox = { width: 0, height: 0 } as any;
                }


            // VML Renderer or useHTML within SVG
            } else {

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
                    bBox.height = height = (
                        ({
                            '11px,17': 14,
                            '13px,20': 16
                        } as Record<string, number>)[
                            (styles as any) &&
                            (styles as any).fontSize + ',' + Math.round(height)
                        ] ||
                        height
                    );
                }

                // Adjust for rotated text
                if (rotation) {
                    const rad = rotation * deg2rad;
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
                    delete cache[cacheKeys.shift() as any];
                }

                if (!cache[cacheKey]) {
                    cacheKeys.push(cacheKey);
                }
                cache[cacheKey] = bBox;
            }
        }
        return bBox;
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
     * @param {boolean} [hideByTranslation=false]
     *        The flag to determine if element should be hidden by moving out
     *        of the viewport. Used for example for dataLabels.
     *
     * @return {Highcharts.SVGElement}
     *         Returns the SVGElement for chaining.
     */
    public hide(hideByTranslation?: boolean): SVGElement {

        if (hideByTranslation) {
            this.attr({ y: -9999 });
        } else {
            this.attr({ visibility: 'hidden' });
        }

        return this;
    }

    /**
     * @private
     */
    public htmlGetBBox(): Highcharts.BBoxObject {
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
    public init(
        renderer: Highcharts.SVGRenderer,
        nodeName: string
    ): void {

        /**
         * The primary DOM node. Each `SVGElement` instance wraps a main DOM
         * node, but may also represent more nodes.
         *
         * @name Highcharts.SVGElement#element
         * @type {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement}
         */
        this.element = nodeName === 'span' ?
            createElement(nodeName) as Highcharts.HTMLDOMElement :
            doc.createElementNS(this.SVG_NS, nodeName) as Highcharts.SVGDOMElement;

        /**
         * The renderer that the SVGElement belongs to.
         *
         * @name Highcharts.SVGElement#renderer
         * @type {Highcharts.SVGRenderer}
         */
        this.renderer = renderer;

        fireEvent(this, 'afterInit');
    }

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
    public invert(inverted: boolean): SVGElement {
        var wrapper = this;

        wrapper.inverted = inverted;
        wrapper.updateTransform();

        return wrapper;
    }

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
     * The event type. If the type is `click`, Highcharts will internally
     * translate it to a `touchstart` event on touch devices, to prevent the
     * browser from waiting for a click event from firing.
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
    ): SVGElement {
        var svgElement = this,
            element = svgElement.element,
            touchStartPos: Record<string, number>,
            touchEventFired: boolean;

        // touch
        if (hasTouch && eventType === 'click') {
            element.ontouchstart = function (e: TouchEvent): void {
                // save touch position for later calculation
                touchStartPos = {
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                };
            };

            // Instead of ontouchstart, event handlers should be called
            // on touchend - similar to how current mouseup events are called
            element.ontouchend = function (e: TouchEvent): void {

                // hasMoved is a boolean variable containing logic if page
                // was scrolled, so if touch position changed more than
                // ~4px (value borrowed from general touch handler)
                const hasMoved = touchStartPos.clientX ? Math.sqrt(
                    Math.pow(
                        touchStartPos.clientX - e.changedTouches[0].clientX,
                        2
                    ) +
                    Math.pow(
                        touchStartPos.clientY - e.changedTouches[0].clientY,
                        2
                    )
                ) >= 4 : false;

                if (!hasMoved) { // only call handlers if page was not scrolled
                    handler.call(element, e);
                }

                touchEventFired = true;
                // prevent other events from being fired. #9682
                e.preventDefault();
            };

            element.onclick = function (e: Event): void {
                // Do not call onclick handler if touch event was fired already.
                if (!touchEventFired) {
                    handler.call(element, e);
                }
            };
        } else {
            // simplest possible event model for internal use
            (element as Record<string, any>)['on' + eventType] = handler;
        }
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
        element: Highcharts.SVGDOMElement
    ): void {
        (this as Record<string, any>)[key] = value;
        element.setAttribute(key, value);
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
    public removeClass(className: (string|RegExp)): SVGElement {
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
     * @private
     * @param {Array<Highcharts.SVGDOMElement>} tspans
     * Text spans.
     */
    public removeTextOutline(tspans: Array<Highcharts.SVGDOMElement>): void {
        // Iterate from the end to
        // support removing items inside the cycle (#6472).
        var i = tspans.length,
            tspan;
        while (i--) {
            tspan = tspans[i];
            if (tspan.getAttribute('class') === 'highcharts-text-outline') {
                // Remove then erase
                erase(tspans, this.element.removeChild(tspan));
            }
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
        element: (Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement)
    ): void {
        var parentNode = element.parentNode;

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
    public setRadialReference(coordinates: Array<number>): SVGElement {
        var existingGradient = (
            this.element.gradient &&
            this.renderer.gradients[this.element.gradient]
        );

        this.element.radialReference = coordinates;

        // On redrawing objects with an existing gradient, the gradient needs
        // to be repositioned (#3801)
        if (existingGradient && existingGradient.radAttr) {
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
     * @private
     * @function Highcharts.SVGElement#setTextPath
     * @param {Highcharts.SVGElement} path
     * Path to follow.
     * @param {Highcharts.DataLabelsTextPathOptionsObject} textPathOptions
     * Options.
     * @return {Highcharts.SVGElement}
     * Returns the SVGElement for chaining.
     */
    public setTextPath(
        path: SVGElement,
        textPathOptions: Record<string, any>
    ): SVGElement {
        var elem = this.element,
            attribsMap = {
                textAnchor: 'text-anchor'
            },
            attrs,
            adder = false,
            textPathElement: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement),
            textPathId,
            textPathWrapper: SVGElement = this.textPathWrapper as any,
            tspans,
            firstTime = !textPathWrapper;

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
            if (
                textPathWrapper &&
                textPathWrapper.element.parentNode === null
            ) {
                // When buildText functionality was triggered again
                // and deletes textPathWrapper parentNode
                firstTime = true;
                textPathWrapper = textPathWrapper.destroy() as any;
            } else if (textPathWrapper) {
                // Case after drillup when spans were added into
                // the DOM outside the textPathWrapper parentGroup
                this.removeTextOutline.call(
                    textPathWrapper.parentGroup,
                    [].slice.call(elem.getElementsByTagName('tspan'))
                );
            }
            // label() has padding, text() doesn't
            if (this.options && this.options.padding) {
                attrs.dx = -this.options.padding;
            }

            if (!textPathWrapper) {
                // Create <textPath>, defer the DOM adder
                this.textPathWrapper = textPathWrapper =
                    this.renderer.createElement('textPath') as any;
                adder = true;
            }

            textPathElement = textPathWrapper.element;

            // Set ID for the path
            textPathId = path.element.getAttribute('id');
            if (!textPathId) {
                path.element.setAttribute('id', textPathId = uniqueKey());
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
            if (
                adder &&
                textPathWrapper
            ) {
                textPathWrapper.add({
                    // label() is placed in a group, text() is standalone
                    element: this.text ? this.text.element : elem
                } as any);
            }

            // Set basic options:
            // Use `setAttributeNS` because Safari needs this..
            textPathElement.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'href',
                this.renderer.url + '#' + textPathId
            );

            // Presentation attributes:

            // dx/dy options must by set on <text> (parent),
            // the rest should be set on <textPath>
            if (defined(attrs.dy)) {
                (textPathElement.parentNode as any)
                    .setAttribute('dy', attrs.dy);
                delete attrs.dy;
            }
            if (defined(attrs.dx)) {
                (textPathElement.parentNode as any)
                    .setAttribute('dx', attrs.dx);
                delete attrs.dx;
            }

            // Additional attributes
            objectEach(attrs, function (val: string, key: string): void {
                textPathElement.setAttribute(
                    (attribsMap as any)[key] || key,
                    val
                );
            });

            // Remove translation, text that follows path does not need that
            elem.removeAttribute('transform');

            // Remove shadows and text outlines
            this.removeTextOutline.call(
                textPathWrapper,
                [].slice.call(elem.getElementsByTagName('tspan'))
            );

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
            this.updateTransform = noop as any;
            this.applyTextOutline = noop as any;

        } else if (textPathWrapper) {
            // Reset to prototype
            delete this.updateTransform;
            delete this.applyTextOutline;

            // Restore DOM structure:
            this.destroyTextPath(elem as any, path);

            // Bring attributes back
            this.updateTransform();

            // Set textOutline back for text()
            if (this.options && this.options.rotation) {
                this.applyTextOutline(this.options.style.textOutline);
            }
        }

        return this;
    }

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
    public shadow(
        shadowOptions?: (boolean|Partial<Highcharts.ShadowOptionsObject>),
        group?: SVGElement,
        cutOff?: boolean
    ): SVGElement {
        var shadows = [],
            i,
            shadow: Highcharts.SVGDOMElement,
            element = this.element,
            strokeWidth,
            shadowElementOpacity,
            update = false,
            oldShadowOptions = this.oldShadowOptions,
            // compensate for inverted plot area
            transform;

        const defaultShadowOptions: Highcharts.ShadowOptionsObject = {
            color: '${palette.neutralColor100}',
            offsetX: 1,
            offsetY: 1,
            opacity: 0.15,
            width: 3
        };
        let options: Highcharts.ShadowOptionsObject|undefined;
        if (shadowOptions === true) {
            options = defaultShadowOptions;
        } else if (typeof shadowOptions === 'object') {
            options = extend(defaultShadowOptions, shadowOptions);
        }

        // Update shadow when options change (#12091).
        if (options) {
            // Go over each key to look for change
            if (options && oldShadowOptions) {
                objectEach(options, (value, key): void => {
                    if (value !== (oldShadowOptions as any)[key]) {
                        update = true;
                    }
                });
            }

            if (update) {
                this.destroyShadows();
            }

            this.oldShadowOptions = options;
        }

        if (!options) {
            this.destroyShadows();

        } else if (!this.shadows) {
            shadowElementOpacity = options.opacity / options.width;
            transform = this.parentInverted ?
                'translate(-1,-1)' :
                `translate(${options.offsetX}, ${options.offsetY})`;
            for (i = 1; i <= options.width; i++) {
                shadow = element.cloneNode(false) as any;
                strokeWidth = (options.width * 2) + 1 - (2 * i);
                attr(shadow, {
                    stroke: (
                        (shadowOptions as any).color ||
                        '${palette.neutralColor100}'
                    ),
                    'stroke-opacity': shadowElementOpacity * i,
                    'stroke-width': strokeWidth,
                    transform,
                    fill: 'none'
                });
                shadow.setAttribute(
                    'class',
                    (shadow.getAttribute('class') || '') + ' highcharts-shadow'
                );
                if (cutOff) {
                    attr(
                        shadow,
                        'height',
                        Math.max(
                            (attr(shadow, 'height') as any) - strokeWidth,
                            0
                        )
                    );
                    shadow.cutHeight = strokeWidth;
                }

                if (group) {
                    group.element.appendChild(shadow);
                } else if (element.parentNode) {
                    element.parentNode.insertBefore(shadow, element);
                }

                shadows.push(shadow);
            }

            this.shadows = shadows;
        }

        return this;
    }

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
    public show(inherit?: boolean): SVGElement {
        return this.attr(
            { visibility: inherit ? 'inherit' : 'visible' }
        );
    }

    /**
     * WebKit and Batik have problems with a stroke-width of zero, so in this
     * case we remove the stroke attribute altogether. #1270, #1369, #3065,
     * #3072.
     *
     * @private
     * @function Highcharts.SVGElement#strokeSetter
     * @param {number|string} value
     * @param {string} key
     * @param {Highcharts.SVGDOMElement} element
     */
    public strokeSetter(
        value: (number|string),
        key: string,
        element: Highcharts.SVGDOMElement
    ): void {
        (this as Record<string, any>)[key] = value;
        // Only apply the stroke attribute if the stroke width is defined and
        // larger than 0
        if (this.stroke && this['stroke-width']) {
            // Use prototype as instance may be overridden
            SVGElement.prototype.fillSetter.call(
                this,
                this.stroke,
                'stroke',
                element
            );

            element.setAttribute('stroke-width', this['stroke-width']);
            this.hasStroke = true;
        } else if (key === 'stroke-width' && value === 0 && this.hasStroke) {
            element.removeAttribute('stroke');
            this.hasStroke = false;
        } else if (this.renderer.styledMode && this['stroke-width']) {
            element.setAttribute('stroke-width', this['stroke-width']);
            this.hasStroke = true;
        }
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
     * The stroke width in pixels. Even if the given stroke widtch (in CSS or by
     * attributes) is based on `em` or other units, the pixel size is returned.
     */
    public strokeWidth(): number {

        // In non-styled mode, read the stroke width as set by .attr
        if (!this.renderer.styledMode) {
            return this['stroke-width'] || 0;
        }

        // In styled mode, read computed stroke width
        var val = this.getStyle('stroke-width'),
            ret = 0,
            dummy: Highcharts.SVGDOMElement;

        // Read pixel values directly
        if (val.indexOf('px') === val.length - 2) {
            ret = pInt(val);

        // Other values like em, pt etc need to be measured
        } else if (val !== '') {
            dummy = doc.createElementNS(SVG_NS, 'rect') as Highcharts.SVGDOMElement;
            attr(dummy, {
                width: val,
                'stroke-width': 0
            });
            (this.element.parentNode as any).appendChild(dummy);
            ret = (dummy as any).getBBox().width;
            (dummy.parentNode as any).removeChild(dummy);
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
    public symbolAttr(hash: Highcharts.SVGAttributes): void {
        var wrapper = this as Record<string, any>;

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
        ].forEach(function (key: string): void {
            wrapper[key] = pick(hash[key], wrapper[key]);
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
                this.renderer.buildText(this as any);
            }
        }
    }

    /**
     * @private
     * @function Highcharts.SVGElement#titleSetter
     * @param {string} value
     */
    public titleSetter(value: string): void {
        var titleNode: Highcharts.SVGDOMElement = (
            this.element.getElementsByTagName('title')[0] as any
        );

        if (!titleNode) {
            titleNode = doc.createElementNS(this.SVG_NS, 'title') as any;
            this.element.appendChild(titleNode);
        }

        // Remove text content if it exists
        if (titleNode.firstChild) {
            titleNode.removeChild(titleNode.firstChild);
        }

        titleNode.appendChild(
            doc.createTextNode(
                // #3276, #3895
                String(pick(value, ''))
                    .replace(/<[^>]*>/g, '')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
            )
        );
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
    public toFront(): SVGElement {
        var element = this.element;

        element.parentNode.appendChild(element);

        return this;
    }

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
    public translate(
        x: number,
        y: number
    ): SVGElement {
        return this.attr({
            translateX: x,
            translateY: y
        }) as any;
    }

    /**
     * Update the shadow elements with new attributes.
     *
     * @private
     * @function Highcharts.SVGElement#updateShadows
     *
     * @param {string} key
     * The attribute name.
     *
     * @param {number} value
     * The value of the attribute.
     *
     * @param {Function} setter
     * The setter function, inherited from the parent wrapper.
     */
    public updateShadows(
        key: string,
        value: number,
        setter: Function
    ): void {
        const shadows = this.shadows;

        if (shadows) {
            let i = shadows.length;
            while (i--) {
                setter.call(
                    shadows[i],
                    key === 'height' ?
                        Math.max(
                            value - (shadows[i].cutHeight || 0),
                            0
                        ) :
                        key === 'd' ? this.d : value,
                    key,
                    shadows[i]
                );
            }
        }
    }

    /**
     * Update the transform attribute based on internal properties. Deals with
     * the custom `translateX`, `translateY`, `rotation`, `scaleX` and `scaleY`
     * attributes and updates the SVG `transform` attribute.
     *
     * @private
     * @function Highcharts.SVGElement#updateTransform
     */
    public updateTransform(): void {
        var wrapper = this,
            translateX = wrapper.translateX || 0,
            translateY = wrapper.translateY || 0,
            scaleX = wrapper.scaleX,
            scaleY = wrapper.scaleY,
            inverted = wrapper.inverted,
            rotation = wrapper.rotation,
            matrix = wrapper.matrix,
            element = wrapper.element,
            transform;

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
            transform.push(
                'matrix(' + matrix.join(',') + ')'
            );
        }

        // apply rotation
        if (inverted) {
            transform.push('rotate(90) scale(-1,1)');
        } else if (rotation) { // text rotation
            transform.push(
                'rotate(' + rotation + ' ' +
                pick(this.rotationOriginX, element.getAttribute('x'), 0) +
                ' ' +
                pick(this.rotationOriginY, element.getAttribute('y') || 0) + ')'
            );
        }

        // apply scale
        if (defined(scaleX) || defined(scaleY)) {
            transform.push(
                'scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')'
            );
        }

        if (transform.length) {
            element.setAttribute('transform', transform.join(' '));
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
     * @return {void}
     */
    public visibilitySetter(
        value: string,
        key: string,
        element: Highcharts.SVGDOMElement
    ): void {
        // IE9-11 doesn't handle visibilty:inherit well, so we remove the
        // attribute instead (#2881, #3909)
        if (value === 'inherit') {
            element.removeAttribute(key);
        } else if ((this as Record<string, any>)[key] !== value) { // #6747
            element.setAttribute(key, value);
        }
        (this as Record<string, any>)[key] = value;
    }

    /**
     * @private
     * @function Highcharts.SVGElement#xGetter
     *
     * @param {string} key
     *
     * @return {number|string|null}
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
     * @param {number} [value]
     * @param {string} [key]
     * @return {boolean}
     */
    public zIndexSetter(
        value?: number,
        key?: string
    ): boolean {
        var renderer = this.renderer,
            parentGroup = this.parentGroup,
            parentWrapper = parentGroup || renderer,
            parentNode = (parentWrapper as any).element || renderer.box,
            childNodes,
            otherElement,
            otherZIndex,
            element = this.element,
            inserted = false,
            undefinedOtherZIndex,
            svgParent = parentNode === renderer.box,
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
                            childNodes[i + 1] || null // null for oldIE export
                        );
                        inserted = true;
                    }
                }
            }

            if (!inserted) {
                parentNode.insertBefore(
                    element,
                    childNodes[svgParent ? 3 : 0] || null // null for oldIE
                );
                inserted = true;
            }
        }
        return inserted;
    }

}

interface SVGElement {
    matrixSetter: SVGElement.SetterFunction<(number|string|null)>;
    rotationOriginXSetter: SVGElement.SetterFunction<(number|string|null)>;
    rotationOriginYSetter: SVGElement.SetterFunction<(number|string|null)>;
    rotationSetter: SVGElement.SetterFunction<(number|string|null)>;
    scaleXSetter: SVGElement.SetterFunction<(number|string|null)>;
    scaleYSetter: SVGElement.SetterFunction<(number|string|null)>;
    'stroke-widthSetter': SVGElement['strokeSetter'];
    translateXSetter: SVGElement.SetterFunction<(number|string|null)>;
    translateYSetter: SVGElement.SetterFunction<(number|string|null)>;
    verticalAlignSetter: SVGElement.SetterFunction<(number|string|null)>;
    yGetter: SVGElement['xGetter'];
}

// Some shared setters and getters
SVGElement.prototype['stroke-widthSetter'] = SVGElement.prototype.strokeSetter;
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
    (this as Record<string, any>)[key] = value;
    this.doTransform = true;
};

namespace SVGElement {

    export interface ElementSetterFunction<T> {
        (value: T, key: string, element: Highcharts.SVGDOMElement): void;
    }

    export interface GetterFunction<T> {
        (key: string): T;
    }

    export interface SetterFunction<T> {
        (value: T, key: string): void;
    }

}

H.SVGElement = SVGElement as any;

export default H.SVGElement;
