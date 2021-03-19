/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { AlignValue } from '../AlignObject';
import type BBoxObject from '../BBoxObject';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../CSSObject';
import type ShadowOptionsObject from '../ShadowOptionsObject';
import type SVGAttributes from './SVGAttributes';
import type SVGRenderer from './SVGRenderer';
import SVGElement from './SVGElement.js';
import U from '../../Utilities.js';
const {
    defined,
    extend,
    isNumber,
    merge,
    pick,
    removeEvent
} = U;

/* eslint require-jsdoc: 0, no-invalid-this: 0 */
function paddingSetter(this: SVGLabel, value: (number|string), key: string): void {
    if (!isNumber(value)) {
        this[key] = void 0;
    } else if (value !== this[key]) {
        this[key] = value;
        this.updateTextPadding();
    }
}

/**
 * SVG label to render text.
 * @private
 * @class
 * @name Highcharts.SVGLabel
 * @augments Highcharts.SVGElement
 */
class SVGLabel extends SVGElement {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly emptyBBox: BBoxObject = { width: 0, height: 0, x: 0, y: 0 };

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        renderer: SVGRenderer,
        str: string,
        x: number,
        y?: number,
        shape?: Highcharts.SymbolKeyValue | string,
        anchorX?: number,
        anchorY?: number,
        useHTML?: boolean,
        baseline?: boolean,
        className?: string
    ) {
        super();
        this.init(renderer, 'g');

        this.textStr = str;
        this.x = x;
        this.y = y;
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.baseline = baseline;
        this.className = className;

        if (className !== 'button') {
            this.addClass('highcharts-label');
        }
        if (className) {
            this.addClass('highcharts-' + className);
        }

        this.text = renderer.text('', 0, 0, useHTML)
            .attr({
                zIndex: 1
            });

        // Validate the shape argument
        let hasBGImage;
        if (typeof shape === 'string') {
            hasBGImage = /^url\((.*?)\)$/.test(shape);
            if (this.renderer.symbols[shape] || hasBGImage) {
                this.symbolKey = shape;
            }
        }

        this.bBox = SVGLabel.emptyBBox;
        this.padding = 3;
        this.baselineOffset = 0;
        this.needsBox = renderer.styledMode || hasBGImage;
        this.deferredAttr = {};
        this.alignFactor = 0;

    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * For labels, these CSS properties are applied to the `text` node directly.
     *
     * @private
     * @name Highcharts.SVGLabel#textProps
     * @type {Array<string>}
     */
    public static textProps: Array<keyof CSSObject> = [
        'color', 'direction', 'fontFamily', 'fontSize', 'fontStyle',
        'fontWeight', 'lineHeight', 'textAlign', 'textDecoration',
        'textOutline', 'textOverflow', 'width'
    ]

    /* *
     *
     *  Functions
     *
     * */

    public alignSetter(value: AlignValue): void {
        const alignFactor = ({
            left: 0,
            center: 0.5,
            right: 1
        })[value];
        if (alignFactor !== this.alignFactor) {
            this.alignFactor = alignFactor;
            // Bounding box exists, means we're dynamically changing
            if (this.bBox && isNumber(this.xSetting)) {
                this.attr({ x: this.xSetting }); // #5134
            }
        }
    }

    public anchorXSetter(value: number, key: string): void {
        this.anchorX = value;
        this.boxAttr(
            key,
            Math.round(value) - this.getCrispAdjust() - this.xSetting
        );
    }

    public anchorYSetter(value: number, key: string): void {
        this.anchorY = value;
        this.boxAttr(key, value - this.ySetting);
    }

    /*
     * Set a box attribute, or defer it if the box is not yet created
     */
    private boxAttr(key: string, value: any): void {
        if (this.box) {
            this.box.attr(key, value);
        } else {
            this.deferredAttr[key] = value;
        }
    }

    /*
     * Pick up some properties and apply them to the text instead of the
     * wrapper.
     */
    public css(styles: CSSObject): SVGElement {
        if (styles) {
            var textStyles: CSSObject = {},
                isWidth: boolean,
                isFontStyle: boolean;

            // Create a copy to avoid altering the original object
            // (#537)
            styles = merge(styles);
            SVGLabel.textProps.forEach((prop): void => {
                if (typeof styles[prop] !== 'undefined') {
                    (textStyles as any)[prop] = styles[prop];
                    delete styles[prop];
                }
            });
            this.text.css(textStyles);

            isWidth = 'width' in textStyles;
            isFontStyle = 'fontSize' in textStyles ||
                'fontWeight' in textStyles;

            // Update existing text, box (#9400, #12163)
            if (isFontStyle) {
                this.updateTextPadding();
            } else if (isWidth) {
                this.updateBoxSize();
            }

        }
        return SVGElement.prototype.css.call(this, styles);
    }

    /*
     * Destroy and release memory.
     */
    public destroy(): undefined {

        // Added by button implementation
        removeEvent(this.element, 'mouseenter');
        removeEvent(this.element, 'mouseleave');

        if (this.text) {
            this.text.destroy();
        }
        if (this.box) {
            this.box = this.box.destroy();
        }
        // Call base implementation to destroy the rest
        SVGElement.prototype.destroy.call(this);

        return void 0;
    }

    public fillSetter(value: ColorType, key: string): void {
        if (value) {
            this.needsBox = true;
        }
        // for animation getter (#6776)
        this.fill = value;
        this.boxAttr(key, value);
    }

    /*
     * Return the bounding box of the box, not the group.
     */
    public getBBox(): BBoxObject {
        // If we have a text string and the DOM bBox was 0, it typically means
        // that the label was first rendered hidden, so we need to update the
        // bBox (#15246)
        if (this.textStr && this.bBox.width === 0 && this.bBox.height === 0) {
            this.updateBoxSize();
        }
        const padding = this.padding;
        const paddingLeft = pick(this.paddingLeft, padding);
        return {
            width: this.width,
            height: this.height,
            x: this.bBox.x - paddingLeft,
            y: this.bBox.y - padding
        };
    }

    private getCrispAdjust(): number {
        return this.renderer.styledMode && this.box ?
            this.box.strokeWidth() % 2 / 2 :
            (this['stroke-width'] ? parseInt(this['stroke-width'], 10) : 0) % 2 / 2;
    }

    public heightSetter(value: number): void {
        this.heightSetting = value;
    }

    // Event handling. In case of useHTML, we need to make sure that events
    // are captured on the span as well, and that mouseenter/mouseleave
    // between the SVG group and the HTML span are not treated as real
    // enter/leave events. #13310.
    public on(
        eventType: string,
        handler: Function
    ): SVGLabel {
        const label = this;
        const text = label.text;
        const span: SVGElement|undefined =
            text && text.element.tagName === 'SPAN' ? text : void 0;

        let selectiveHandler: Function|undefined;

        if (span) {
            selectiveHandler = function (e: MouseEvent): void {
                if (
                    (
                        eventType === 'mouseenter' ||
                        eventType === 'mouseleave'
                    ) &&
                    e.relatedTarget instanceof Element &&
                    (
                        // #14110
                        label.element.compareDocumentPosition(e.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY ||
                        span.element.compareDocumentPosition(e.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY
                    )
                ) {
                    return;
                }
                handler.call(label.element, e);
            };
            span.on(eventType, selectiveHandler);
        }
        SVGElement.prototype.on.call(
            label,
            eventType,
            selectiveHandler || handler
        );

        return label;
    }

    /*
     * After the text element is added, get the desired size of the border
     * box and add it before the text in the DOM.
     */
    public onAdd(): void {
        const str = this.textStr;
        this.text.add(this);
        this.attr({
            // Alignment is available now  (#3295, 0 not rendered if given
            // as a value)
            text: (defined(str) ? str : ''),
            x: this.x,
            y: this.y
        });

        if (this.box && defined(this.anchorX)) {
            this.attr({
                anchorX: this.anchorX,
                anchorY: this.anchorY
            });
        }
    }

    public paddingSetter = paddingSetter;

    public paddingLeftSetter = paddingSetter;

    public paddingRightSetter = paddingSetter;

    public rSetter(
        value: any,
        key: string
    ): void {
        this.boxAttr(key, value);
    }

    public shadow(
        b: (boolean|ShadowOptionsObject)
    ): SVGLabel {
        if (b && !this.renderer.styledMode) {
            this.updateBoxSize();
            if (this.box) {
                this.box.shadow(b);
            }
        }
        return this;
    }

    public strokeSetter(
        value: any,
        key: string
    ): void {
        // for animation getter (#6776)
        this.stroke = value;
        this.boxAttr(key, value);
    }

    public 'stroke-widthSetter'(
        value: string,
        key: string
    ): void {
        if (value) {
            this.needsBox = true;
        }
        this['stroke-width'] = value;
        this.boxAttr(key, value);
    }

    public 'text-alignSetter'(value: string): void {
        this.textAlign = value;
    }

    public textSetter(text?: string): void {
        if (typeof text !== 'undefined') {
            // Must use .attr to ensure transforms are done (#10009)
            this.text.attr({ text });
        }
        this.updateTextPadding();
    }

    /*
     * This function runs after the label is added to the DOM (when the bounding
     * box is available), and after the text of the label is updated to detect
     * the new bounding box and reflect it in the border box.
     */
    private updateBoxSize(): void {
        var style = this.text.element.style,
            crispAdjust,
            attribs: SVGAttributes = {};

        const padding = this.padding;

        // #12165 error when width is null (auto)
        // #12163 when fontweight: bold, recalculate bBox withot cache
        // #3295 && 3514 box failure when string equals 0
        const bBox = this.bBox = (
            (!isNumber(this.widthSetting) || !isNumber(this.heightSetting) || this.textAlign) &&
            defined(this.text.textStr)
        ) ?
            this.text.getBBox() : SVGLabel.emptyBBox;

        this.width = this.getPaddedWidth();
        this.height = (this.heightSetting || bBox.height || 0) + 2 * padding;

        // Update the label-scoped y offset. Math.min because of inline
        // style (#9400)
        this.baselineOffset = padding + Math.min(
            this.renderer.fontMetrics(
                style && style.fontSize,
                this.text
            ).b,
            // When the height is 0, there is no bBox, so go with the font
            // metrics. Highmaps CSS demos.
            bBox.height || Infinity
        );

        if (this.needsBox) {

            // Create the border box if it is not already present
            if (!this.box) {
                // Symbol definition exists (#5324)
                const box = this.box = this.symbolKey ?
                    this.renderer.symbol(this.symbolKey) :
                    this.renderer.rect();

                box.addClass( // Don't use label className for buttons
                    (this.className === 'button' ? '' : 'highcharts-label-box') +
                    (this.className ? ' highcharts-' + this.className + '-box' : '')
                );

                box.add(this);
            }

            crispAdjust = this.getCrispAdjust();
            attribs.x = crispAdjust;
            attribs.y = (this.baseline ? -this.baselineOffset : 0) + crispAdjust;

            // Apply the box attributes
            attribs.width = Math.round(this.width);
            attribs.height = Math.round(this.height);

            this.box.attr(extend(attribs, this.deferredAttr));
            this.deferredAttr = {};
        }
    }

    /*
     * This function runs after setting text or padding, but only if padding
     * is changed.
     */
    public updateTextPadding(): void {
        const text = this.text;

        this.updateBoxSize();

        // Determine y based on the baseline
        const textY = this.baseline ? 0 : this.baselineOffset;

        let textX = pick(this.paddingLeft, this.padding);

        // compensate for alignment
        if (
            defined(this.widthSetting) &&
            this.bBox &&
            (this.textAlign === 'center' || this.textAlign === 'right')
        ) {
            textX += { center: 0.5, right: 1 }[this.textAlign as ('center'|'right')] *
                (this.widthSetting - this.bBox.width);
        }

        // update if anything changed
        if (textX !== text.x || textY !== text.y) {
            text.attr('x', textX);
            // #8159 - prevent misplaced data labels in treemap
            // (useHTML: true)
            if (text.hasBoxWidthChanged) {
                this.bBox = text.getBBox(true);
            }
            if (typeof textY !== 'undefined') {
                text.attr('y', textY);
            }
        }

        // record current values
        text.x = textX;
        text.y = textY;
    }

    public widthSetter(value: (number|string)): void {
        // width:auto => null
        this.widthSetting = isNumber(value) ? value : void 0;
    }

    public getPaddedWidth(): number {
        const padding = this.padding;
        const paddingLeft = pick(this.paddingLeft, padding);
        const paddingRight = pick(this.paddingRight, padding);
        return (this.widthSetting || this.bBox.width || 0) + paddingLeft + paddingRight;
    }

    public xSetter(value: number): void {
        this.x = value; // for animation getter
        if (this.alignFactor) {
            value -= this.alignFactor * this.getPaddedWidth();

            // Force animation even when setting to the same value (#7898)
            this['forceAnimate:x'] = true;
        }
        this.xSetting = Math.round(value);
        this.attr('translateX', this.xSetting);
    }

    public ySetter(value: number): void {
        this.ySetting = this.y = Math.round(value);
        this.attr('translateY', this.ySetting);
    }
}

export default SVGLabel;
