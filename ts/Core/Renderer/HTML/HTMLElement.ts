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
    DOMElementType,
    HTMLDOMElement
} from '../DOMElementType';
import type HTMLRenderer from './HTMLRenderer';
import type SVGRenderer from '../SVG/SVGRenderer.js';

import AST from './AST.js';
import SVGElement from '../SVG/SVGElement.js';
import U from '../../Utilities.js';
const {
    attr,
    css,
    createElement,
    defined,
    extend,
    pInt
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../SVG/SVGElementLike' {
    interface SVGElementLike {
        /** @requires Core/Renderer/HTML/HTMLElement */
        appendChild: HTMLDOMElement['appendChild'];
        element: DOMElementType;
        parentGroup?: SVGElement;
        renderer: (HTMLRenderer|SVGRenderer);
        style: (CSSObject&CSSStyleDeclaration);
        xCorr: number;
        yCorr: number;
        afterSetters(): void;
        /** @requires Core/Renderer/HTML/HTMLElement */
        getSpanCorrection(
            width: number,
            baseline: number,
            alignCorrection: number
        ): void;
        /** @requires Core/Renderer/HTML/HTMLElement */
        // htmlCss(styles: CSSObject): HTMLElement;
        /** @requires Core/Renderer/HTML/HTMLElement */
        // htmlGetBBox(): BBoxObject;
        /** @requires Core/Renderer/HTML/HTMLElement */
        // htmlUpdateTransform(): void;
        /** @requires Core/Renderer/HTML/HTMLElement */
        setSpanRotation(
            rotation: number,
            alignCorrection: number,
            baseline: number
        ): void;
        textSetter(value: string): void;
        translateXSetter(value: number, key: string): void;
        translateYSetter(value: number, key: string): void;
    }
}

const addSetters = function (
    gWrapper: HTMLElement|SVGElement,
    style?: CSSStyleDeclaration
): void {
    // These properties are set as attributes on the SVG group, and
    // as identical CSS properties on the div. (#3542)
    ['opacity', 'visibility'].forEach(function (
        prop: string
    ): void {
        gWrapper[prop + 'Setter'] = function (
            value: string,
            key: string,
            elem: HTMLElement
        ): void {
            const styleObject = gWrapper.div ?
                gWrapper.div.style :
                style;
            SVGElement.prototype[prop + 'Setter']
                .call(this, value, key, elem);
            if (styleObject) {
                styleObject[key as any] = value;
            }
        };
    });
    gWrapper.addedSetters = true;
};

/* *
 *
 *  Class
 *
 * */

class HTMLElement extends SVGElement {

    /* *
     *
     *  Prototype
     *
     * */

    public div?: HTMLDOMElement;
    public parentGroup?: SVGElement;

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
    public getSpanCorrection(
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
            whiteSpace = styles?.whiteSpace;

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
    public setSpanRotation(
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

    public add(svgGroupWrapper?: SVGElement): this {
        const htmlElement = this,
            container = this.renderer.box.parentNode,
            parents = [] as Array<SVGElement>;

        let htmlGroup: (HTMLElement|HTMLDOMElement|null|undefined);

        this.parentGroup = svgGroupWrapper;

        // Create a mock group to hold the HTML elements
        if (svgGroupWrapper) {
            htmlGroup = svgGroupWrapper.div;
            if (!htmlGroup) {

                // Read the parent chain into an array and read from top
                // down
                let svgGroup: SVGElement|undefined = svgGroupWrapper;
                while (svgGroup) {

                    parents.push(svgGroup);

                    // Move up to the next parent group
                    svgGroup = svgGroup.parentGroup;
                }

                // Ensure dynamically updating position when any parent
                // is translated
                parents.reverse().forEach(function (parentGroup): void {
                    const cls = attr(parentGroup.element, 'class'),
                        parentProtoCss = parentGroup.css;

                    /**
                     * Common translate setter for X and Y on the HTML
                     * group. Reverted the fix for #6957 due to
                     * positioning problems and offline export (#7254,
                     * #7280, #7529)
                     * @private
                     * @param {*} value
                     * @param {string} key
                                             */
                    function translateSetter(
                        value: any,
                        key: string
                    ): void {
                        parentGroup[key] = value;

                        if (key === 'translateX') {
                            htmlGroupStyle.left = value + 'px';
                        } else {
                            htmlGroupStyle.top = value + 'px';
                        }

                        parentGroup.doTransform = true;
                    }

                    // Create a HTML div and append it to the parent div
                    // to emulate the SVG group structure
                    const parentGroupStyles = parentGroup.styles || {};
                    htmlGroup =
                    parentGroup.div =
                    parentGroup.div || createElement(
                        'div',
                        cls ? { className: cls } : void 0,
                        {
                            position: 'absolute',
                            left: (parentGroup.translateX || 0) + 'px',
                            top: (parentGroup.translateY || 0) + 'px',
                            display: parentGroup.display,
                            opacity: parentGroup.opacity, // #5075
                            visibility: parentGroup.visibility

                        // The top group is appended to container
                        },
                        (htmlGroup as any) || container
                    );

                    // Shortcut
                    const htmlGroupStyle = (htmlGroup as any).style;

                    // Set listeners to update the HTML div's position
                    // whenever the SVG group position is changed.
                    extend(parentGroup, {
                        // (#7287) Pass htmlGroup to use
                        // the related group
                        classSetter: (function (
                            htmlGroup: HTMLElement
                        ): Function {
                            return function (
                                this: HTMLElement,
                                value: string
                            ): void {
                                this.element.setAttribute(
                                    'class',
                                    value
                                );
                                htmlGroup.className = value;
                            };
                        }(htmlGroup as any)),

                        // Extend the parent group's css function by
                        // updating the shadow div counterpart with the same
                        // style.
                        css: function (styles: CSSObject): SVGElement {

                            // Call the base css method. The `parentGroup`
                            // can be either an SVGElement or an SVGLabel,
                            // in which the css method is extended (#19200).
                            parentProtoCss.call(parentGroup, styles);

                            (
                                [
                                    // #6794
                                    'cursor',
                                    // #5595, #18821
                                    'pointerEvents'
                                ] as (keyof CSSObject)[]
                            ).forEach((prop): void => {
                                if (styles[prop]) {
                                    htmlGroupStyle[prop] = styles[prop];
                                }
                            });
                            return parentGroup;
                        },

                        on: function (): SVGElement {
                            if (parents[0].div) { // #6418
                                htmlElement.on.apply({
                                    element: parents[0].div,
                                    onEvents: parentGroup.onEvents
                                }, arguments);
                            }
                            return parentGroup;
                        },
                        translateXSetter: translateSetter,
                        translateYSetter: translateSetter
                    });
                    if (!parentGroup.addedSetters) {
                        addSetters(parentGroup);
                    }

                    // Apply pre-existing style
                    parentGroup.css(parentGroupStyles);

                });

            }
        } else {
            htmlGroup = container as any;
        }

        (htmlGroup as any).appendChild(this.element);

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

    /**
     * These properties are set as attributes on the SVG group, and as identical
     * CSS properties on the div. (#3542)
     *
     * @private
     */
    public opacitySetter(
        value: string,
        key: string,
        elem: HTMLDOMElement
    ): void {
        const style = this.div?.style || elem.style;
        super[`${key}Setter`].call(this, value, key, elem);
        if (style) {
            style[key as any] = value;
        }
    }

}

// Some shared setters
const proto = HTMLElement.prototype;
(proto as any).visibilitySetter = proto.opacitySetter;
proto.ySetter = proto.xSetter;
proto.rotationSetter = proto.xSetter;

/* *
 *
 *  Class Prototype
 *
 * */

interface HTMLElement {
    element: HTMLDOMElement;
    renderer: HTMLRenderer;
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLElement;
