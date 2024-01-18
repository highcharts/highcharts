/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type BBoxObject from '../BBoxObject';
import type CSSObject from '../CSSObject';
import type {
    HTMLDOMElement,
    SVGDOMElement
} from '../DOMElementType';
import type SVGRenderer from '../SVG/SVGRenderer.js';

import AST from './AST.js';
import H from '../../Globals.js';
const { composed } = H;
import SVGElement from '../SVG/SVGElement.js';
import U from '../../Utilities.js';
const {
    attr,
    css,
    createElement,
    defined,
    extend,
    pInt,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../SVG/SVGRendererLike' {
    interface SVGRendererLike {
        /** @requires Core/Renderer/HTML/HTMLElement */
        html(str: string, x: number, y: number): HTMLElement;
    }
}

/**
 * The opacity and visibility properties are set as attributes on the main
 * element and SVG groups, and as identical CSS properties on the HTML element
 * and the ancestry divs. (#3542)
 *
 * @private
 */
function commonSetter(
    this: SVGElement,
    value: string,
    key: string,
    elem: HTMLDOMElement
): void {
    const style = this.div?.style || elem.style;
    SVGElement.prototype[`${key}Setter`].call(this, value, key, elem);
    if (style) {
        style[key as any] = value;
    }
}

/**
 * Decorate each SVG group in the ancestry line. Each SVG `g` element that
 * contains children with useHTML, will receive a `div` element counterpart to
 * contain the HTML span. These div elements are translated and styled like
 * original `g` counterparts.
 *
 * @private
 */
const decorateSVGGroup = (
    g: SVGElement,
    container: HTMLDOMElement
): HTMLDOMElement => {
    if (!g.div) {
        const className = attr(g.element, 'class'),
            cssProto = g.css;

        // Create the parallel HTML group
        const div = createElement(
            'div',
            className ? { className } : void 0,
            {
                // Add HTML specific styles
                position: 'absolute',
                left: `${g.translateX || 0}px`,
                top: `${g.translateY || 0}px`,

                // Add pre-existing styles
                ...g.styles,

                // Add g attributes that correspond to CSS
                display: g.display,
                opacity: g.opacity, // #5075
                visibility: g.visibility
            },
            // The top group is appended to container
            g.parentGroup?.div || container
        );

        g.classSetter = (
            value: string,
            key: string,
            element: SVGDOMElement
        ): void => {
            element.setAttribute('class', value);
            div.className = value;
        };

        /**
         * Common translate setter for X and Y on the HTML group.
         *
         * Reverted the fix for #6957 due to positioning problems and offline
         * export (#7254, #7280, #7529)
         * @private
         */
        g.translateXSetter = g.translateYSetter = (
            value: number|string|null,
            key: string
        ): void => {
            g[key] = value;

            div.style[key === 'translateX' ? 'left' : 'top'] = `${value}px`;

            g.doTransform = true;
        };

        g.opacitySetter = (g as any).visibilitySetter = commonSetter;

        // Extend the parent group's css function by updating the parallel div
        // counterpart with the same style.
        g.css = (styles: CSSObject): SVGElement => {

            // Call the base css method. The `parentGroup` can be either an
            // SVGElement or an SVGLabel, in which the css method is extended
            // (#19200).
            cssProto.call(g, styles);

            // #6794
            if (styles.cursor) {
                div.style.cursor = styles.cursor;
            }

            // #18821
            if (styles.pointerEvents) {
                div.style.pointerEvents = styles.pointerEvents;
            }

            return g;
        };

        // Event handling
        g.on = function (): SVGElement {
            SVGElement.prototype.on.apply({
                element: div,
                onEvents: g.onEvents
            }, arguments);
            return g;
        };

        g.div = div;
    }
    return g.div;
};

/* *
 *
 *  Class
 *
 * */

class HTMLElement extends SVGElement {
    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Compose
     * @private
     */
    public static compose<T extends typeof SVGRenderer>(
        SVGRendererClass: T
    ): void {

        if (pushUnique(composed, this.compose)) {
            /**
             * Create a HTML text node. This is used by the SVG renderer `text`
             * and `label` functions through the `useHTML` parameter.
             *
             * @private
             */
            SVGRendererClass.prototype.html = function (
                str: string,
                x: number,
                y: number
            ): HTMLElement {
                return new HTMLElement(this, 'span')
                    // Set the default attributes
                    .attr({
                        text: str,
                        x: Math.round(x),
                        y: Math.round(y)
                    });
            };
        }
    }

    /* *
     *
     *  Prototype
     *
     * */

    public div?: HTMLDOMElement;
    public parentGroup?: SVGElement;
    public xCorr?: number;
    public yCorr?: number;


    /* *
     *
     *  Functions
     *
     * */
    public constructor(
        renderer: SVGRenderer,
        nodeName: 'span'
    ) {
        super(renderer, nodeName);

        this.css({
            position: 'absolute',
            ...(renderer.styledMode ? {} : {
                fontFamily: renderer.style.fontFamily,
                fontSize: renderer.style.fontSize
            })
        });

        // Keep the whiteSpace style outside the `HTMLElement.styles` collection
        this.element.style.whiteSpace = 'nowrap';
    }

    /**
     * Get the correction in X and Y positioning as the element is rotated.
     * @private
     */
    private getSpanCorrection(
        width: number,
        baseline: number,
        alignCorrection: number
    ): void {
        this.xCorr = -width * alignCorrection;
        this.yCorr = -baseline;
    }

    /**
     * Apply CSS to HTML elements. This is used in text within SVG rendering.
     * @private
     */
    public css(styles: CSSObject): this {
        const { element } = this,
            // When setting or unsetting the width style, we need to update
            // transform (#8809)
            isSettingWidth = (
                element.tagName === 'SPAN' &&
                styles &&
                'width' in styles
            ),
            textWidth = isSettingWidth && styles.width;

        let doTransform;

        if (isSettingWidth) {
            delete styles.width;
            this.textWidth = pInt(textWidth) || void 0;
            doTransform = true;
        }

        if (styles?.textOverflow === 'ellipsis') {
            styles.whiteSpace = 'nowrap';
            styles.overflow = 'hidden';
        }
        extend(this.styles, styles);
        css(element, styles);

        // Now that all styles are applied, to the transform
        if (doTransform) {
            this.updateTransform();
        }

        return this;
    }

    /**
     * The useHTML method for calculating the bounding box based on offsets.
     * Called internally from the `SVGElement.getBBox` function and subsequently
     * rotated.
     *
     * @private
     */
    public htmlGetBBox(): BBoxObject {
        const { element } = this;

        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    /**
     * Batch update styles and attributes related to transform
     *
     * @private
     */
    public updateTransform(): void {
        // Aligning non added elements is expensive
        if (!this.added) {
            this.alignOnAdd = true;
            return;
        }

        const {
                element,
                renderer,
                rotation,
                styles,
                textAlign = 'left',
                textWidth,
                translateX = 0,
                translateY = 0,
                x = 0,
                y = 0
            } = this,
            alignCorrection = ({
                left: 0, center: 0.5, right: 1
            } as Record<string, number>)[textAlign],
            whiteSpace = styles.whiteSpace;

        // Get the pixel length of the text
        const getTextPxLength = (): number => {
            if (this.textPxLength) {
                return this.textPxLength;
            }
            // Reset multiline/ellipsis in order to read width (#4928,
            // #5417)
            css(element, {
                width: '',
                whiteSpace: whiteSpace || 'nowrap'
            });
            return element.offsetWidth;
        };

        // Apply translate
        css(element, {
            marginLeft: `${translateX}px`,
            marginTop: `${translateY}px`
        });

        if (element.tagName === 'SPAN') {
            const currentTextTransform = [
                rotation,
                textAlign,
                element.innerHTML,
                textWidth,
                this.textAlign
            ].join(',');

            let baseline,
                hasBoxWidthChanged = false;

            // Update textWidth. Use the memoized textPxLength if possible, to
            // avoid the getTextPxLength function using elem.offsetWidth.
            // Calling offsetWidth affects rendering time as it forces layout
            // (#7656).
            if (textWidth !== this.oldTextWidth) { // #983, #1254
                const textPxLength = getTextPxLength(),
                    textWidthNum = textWidth || 0;
                if (
                    (
                        (textWidthNum > this.oldTextWidth) ||
                        textPxLength > textWidthNum
                    ) && (
                        // Only set the width if the text is able to word-wrap,
                        // or text-overflow is ellipsis (#9537)
                        /[ \-]/.test(
                            element.textContent || element.innerText
                        ) ||
                        element.style.textOverflow === 'ellipsis'
                    )
                ) {
                    css(element, {
                        width: (textPxLength > textWidthNum) || rotation ?
                            textWidth + 'px' :
                            'auto', // #16261
                        display: 'block',
                        whiteSpace: whiteSpace || 'normal' // #3331
                    });
                    this.oldTextWidth = textWidth;
                    hasBoxWidthChanged = true; // #8159
                }
            }
            this.hasBoxWidthChanged = hasBoxWidthChanged; // #8159


            // Do the calculations and DOM access only if properties changed
            if (currentTextTransform !== this.cTT) {
                baseline = renderer.fontMetrics(element).b;

                // Renderer specific handling of span rotation, but only if we
                // have something to update.
                if (
                    defined(rotation) &&
                    (
                        (rotation !== (this.oldRotation || 0)) ||
                        (textAlign !== this.oldAlign)
                    )
                ) {
                    this.setSpanRotation(
                        rotation,
                        alignCorrection,
                        baseline
                    );
                }

                this.getSpanCorrection(
                    // Avoid elem.offsetWidth if we can, it affects rendering
                    // time heavily (#7656)
                    (
                        (!defined(rotation) && this.textPxLength) || // #7920
                        element.offsetWidth
                    ),
                    baseline,
                    alignCorrection
                );
            }

            // Apply position with correction
            css(element, {
                left: (x + (this.xCorr || 0)) + 'px',
                top: (y + (this.yCorr || 0)) + 'px'
            });

            // Record current text transform
            this.cTT = currentTextTransform;
            this.oldRotation = rotation;
            this.oldAlign = textAlign;
        }
    }

    /**
     * Set the rotation of an individual HTML span.
     * @private
     */
    private setSpanRotation(
        rotation: number,
        alignCorrection: number,
        baseline: number
    ): void {
        // CSS transform and transform-origin both supported without prefix
        // since Firefox 16 (2012), IE 10 (2012), Chrome 36 (2014), Safari 9
        // (2015).;
        css(this.element, {
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${alignCorrection * 100}% ${baseline}px`
        });
    }

    /**
     * Add the element to a group wrapper. For HTML elements, a parallel div
     * will be created for each ancenstor SVG `g` element.
     *
     * @private
     */
    public add(parentGroup?: SVGElement): this {

        const container = this.renderer.box
                .parentNode as unknown as HTMLDOMElement,
            parents = [] as Array<SVGElement>;

        let div: HTMLDOMElement|undefined;

        this.parentGroup = parentGroup;

        // Create a parallel divs to hold the HTML elements
        if (parentGroup) {
            div = parentGroup.div;
            if (!div) {

                // Read the parent chain into an array and read from top
                // down
                let svgGroup: SVGElement|undefined = parentGroup;
                while (svgGroup) {

                    parents.push(svgGroup);

                    // Move up to the next parent group
                    svgGroup = svgGroup.parentGroup;
                }

                // Decorate each of the ancestor group elements with a parallel
                // div that reflects translation and styling
                for (const parentGroup of parents.reverse()) {
                    div = decorateSVGGroup(parentGroup, container);
                }
            }
        }

        (div || container).appendChild(this.element);

        this.added = true;
        if (this.alignOnAdd) {
            this.updateTransform();
        }

        return this;
    }

    /**
     * Text setter
     * @private
     */
    public textSetter(value: string): void {
        if (value !== this.textStr) {
            delete this.bBox;
            delete this.oldTextWidth;

            AST.setElementHTML(this.element, value ?? '');

            this.textStr = value;
            this.doTransform = true;
        }
    }

    /**
     * Align setter
     *
     * @private
     */
    public alignSetter(value: 'left'|'center'|'right'): void {
        this.alignValue = this.textAlign = value;
        this.doTransform = true;
    }
    /**
     * Various setters which rely on update transform
     * @private
     */
    public xSetter(value: number, key: string): void {
        this[key] = value;
        this.doTransform = true;
    }
}

// Some shared setters
const proto = HTMLElement.prototype;
(proto as any).visibilitySetter = proto.opacitySetter = commonSetter;
proto.ySetter = proto.xSetter;
proto.rotationSetter = proto.xSetter;


/* *
 *
 *  Class Prototype
 *
 * */

interface HTMLElement {
    element: HTMLDOMElement;
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLElement;
