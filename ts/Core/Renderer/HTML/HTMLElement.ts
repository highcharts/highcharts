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

import type BBoxObject from '../BBoxObject';
import type CSSObject from '../CSSObject';
import type {
    HTMLDOMElement
} from '../DOMElementType';
import type SVGRenderer from '../SVG/SVGRenderer.js';

import AST from './AST.js';
import H from '../../Globals.js';
const { composed, isFirefox } = H;
import SVGElement from '../SVG/SVGElement.js';
import U from '../../Utilities.js';
const {
    css,
    defined,
    extend,
    getAlignFactor,
    isNumber,
    pInt,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../SVG/SVGRendererBase' {
    interface SVGRendererBase {
        /** @requires Core/Renderer/HTML/HTMLElement */
        html(str: string, x: number, y: number): HTMLElement;
    }
}

/* *
 *
 *  Class
 *
 * */

class HTMLElement extends SVGElement {
    /**
     * Compose
     * @internal
     */
    public static compose<T extends typeof SVGRenderer>(
        SVGRendererClass: T
    ): void {

        if (pushUnique(composed, this.compose)) {
            // Create a HTML text node. This is used by the SVG renderer `text`
            // and `label` functions through the `useHTML` parameter.
            SVGRendererClass.prototype.html = function (
                str: string,
                x: number,
                y: number
            ): HTMLElement {
                return new HTMLElement(this, 'div')
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
     *  Properties
     *
     * */


    /** @internal */
    public div?: HTMLDOMElement;


    /** @internal */
    public foreignObject: SVGElement;


    /** @internal */
    public parentGroup?: SVGElement;


    /** @internal */
    public xCorr?: number;


    /** @internal */
    public yCorr?: number;


    /* *
     *
     *  Constructor
     *
     * */


    /** @internal */
    public constructor(
        renderer: SVGRenderer,
        nodeName: 'div'
    ) {
        super(renderer, nodeName);

        this.foreignObject = renderer.createElement('foreignObject')
            .attr({
                zIndex: 2
            });

        this.element.style.whiteSpace = 'nowrap';
    }


    /* *
     *
     *  Functions
     *
     * */


    /**
     * Get the correction in X and Y positioning as the element is rotated.
     * @internal
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
     * @internal
     */
    public css(styles: CSSObject): this {
        const { element } = this,
            // When setting or unsetting the width style, we need to update
            // transform (#8809)
            isSettingWidth = styles && 'width' in styles,
            textWidth = isSettingWidth && styles.width;

        let doTransform;

        if (isSettingWidth) {
            delete styles.width;
            this.textWidth = pInt(textWidth) || void 0;
            doTransform = true;
        }

        // Some properties require other properties to be set
        if (styles?.textOverflow === 'ellipsis') {
            styles.overflow = 'hidden';
            styles.whiteSpace = 'nowrap';
        }
        if (styles?.lineClamp) {
            styles.display = '-webkit-box';
            styles.WebkitLineClamp = styles.lineClamp;
            styles.WebkitBoxOrient = 'vertical';
            styles.overflow = 'hidden';
        }

        // SVG natively supports setting font size as numbers. With HTML, the
        // font size should behave in the same way (#21624).
        if (isNumber(Number(styles?.fontSize))) {
            styles.fontSize += 'px';
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
     * @internal
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
     * @internal
     */
    public updateTransform(): void {
        // Aligning non added elements is expensive
        if (!this.added) {
            this.alignOnAdd = true;
            return;
        }

        const {
            element,
            foreignObject,
            oldTextWidth,
            renderer,
            rotation,
            scaleX,
            styles: { display = 'inline-block', whiteSpace },
            textAlign = 'left',
            textWidth,
            x = 0,
            y = 0
        } = this;

        // Get the pixel length of the text
        const getTextPxLength = (): number => {
            if (this.textPxLength) {
                return this.textPxLength;
            }
            // Reset multiline/ellipsis in order to read width (#4928, #5417)
            css(element, {
                width: '',
                whiteSpace: whiteSpace || 'nowrap'
            });
            return element.offsetWidth;
        };

        const currentTextTransform = [
            rotation,
            textAlign,
            element.innerHTML,
            textWidth,
            this.textAlign
        ].join(',');

        let baseline;

        css(element, {
            // Inline block must be set before we can read the offset width
            display: 'inline-block',
            verticalAlign: 'top'
        });

        // Update textWidth. Use the memoized textPxLength if possible, to avoid
        // the getTextPxLength function using elem.offsetWidth. Calling
        // offsetWidth affects rendering time as it forces layout (#7656).
        if (textWidth !== oldTextWidth) { // #983, #1254
            const textPxLength = getTextPxLength(),
                textWidthNum = textWidth || 0,
                willOverWrap = !renderer.styledMode &&
                    element.style.textOverflow === '' &&
                    element.style.webkitLineClamp;

            if (
                (
                    textWidthNum > oldTextWidth ||
                    textPxLength > textWidthNum ||
                    willOverWrap
                ) && (
                    // Only set the width if the text is able to word-wrap, or
                    // text-overflow is ellipsis (#9537)
                    /[\-\s\u00AD]/.test(
                        element.textContent || element.innerText
                    ) ||
                    element.style.textOverflow === 'ellipsis'
                )
            ) {
                const usePxWidth = rotation ||
                    scaleX ||
                    textPxLength > textWidthNum ||
                    // Set width to prevent over-wrapping (#22609)
                    willOverWrap;

                css(element, {
                    width: usePxWidth && isNumber(textWidth) ?
                        textWidth + 'px' : 'auto', // #16261
                    display,
                    whiteSpace: whiteSpace || 'normal' // #3331
                });
                this.oldTextWidth = textWidth;
            }
        }

        // In many cases (Firefox always, others on title layout) we need the
        // foreign object to have a larger width and height than its content, in
        // order to read its content's size
        foreignObject.attr({
            width: renderer.width,
            height: renderer.height
        });

        // Do the calculations and DOM access only if properties changed
        if (currentTextTransform !== this.cTT) {
            baseline = renderer.fontMetrics(element).b;

            this.getSpanCorrection(
                // Avoid elem.offsetWidth if we can, it affects rendering time
                // heavily (#7656)
                (
                    (
                        !defined(rotation) &&
                        !this.textWidth &&
                        this.textPxLength
                    ) || // #7920
                    element.offsetWidth
                ),
                baseline,
                getAlignFactor(textAlign)
            );
        }

        // Move the foreign object
        super.updateTransform();
        if (isNumber(x) && isNumber(y)) {
            foreignObject.attr({
                x: x + (this.xCorr || 0),
                y: y + (this.yCorr || 0),
                // Add 4px to avoid ellipsis, since the body adds 3 px right
                // margin. We need one more because of rounding.
                width: element.offsetWidth + 4,
                // Add 1px to account for subpixel bounding boxes
                height: element.offsetHeight + 1,
                'transform-origin': element
                    .getAttribute('transform-origin') || '0 0'
            });

            // Reset, otherwise lineClamp will not work
            css(element, { display, textAlign });

        } else if (isFirefox) {
            foreignObject.attr({
                width: 0,
                height: 0
            });
        }

        // Record current text transform
        this.cTT = currentTextTransform;
    }

    /**
     * Add the element to a group wrapper. For HTML elements, a parallel div
     * will be created for each ancenstor SVG `g` element.
     *
     * @internal
     */
    public add(parentGroup?: SVGElement): this {
        const { foreignObject, renderer } = this;

        // Foreign object
        foreignObject.add(parentGroup);
        super.add(
            // Create a body inside the foreignObject
            renderer.createElement('body')
                .attr({ xmlns: 'http://www.w3.org/1999/xhtml' })
                .css({
                    background: 'transparent',
                    // 3px is to avoid clipping on the right
                    margin: '0 3px 0 0'
                })
                .add(foreignObject)
        );

        if (this.alignOnAdd) {
            this.updateTransform();
        }

        return this;
    }

    /**
     * Text setter
     * @internal
     */
    public textSetter(value: string): void {
        if (value !== this.textStr) {
            delete this.oldTextWidth;

            AST.setElementHTML(this.element, value ?? '');

            this.textStr = value;
            this.doTransform = true;
        }
    }


    /**
     * Align setter
     * @internal
     */
    public alignSetter(value: 'left'|'center'|'right'): void {
        this.alignValue = this.textAlign = value;
        this.doTransform = true;
    }


    /**
     * Various setters which rely on update transform
     * @internal
     */
    public xSetter(value: number, key: string): void {
        this[key] = value;
        this.doTransform = true;
    }


}


// Some shared setters
const proto = HTMLElement.prototype;
proto.ySetter = proto.xSetter;


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


/** @internal */
export default HTMLElement;
