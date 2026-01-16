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

/* *
 *
 *  Imports
 *
 * */

import type { AlignValue } from '../AlignObject';
import type BBoxObject from '../BBoxObject';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../CSSObject';
import type SVGAttributes from './SVGAttributes';
import type SVGPath from './SVGPath';
import type SVGRenderer from './SVGRenderer';
import type { SymbolKey } from './SymbolType';

import SVGElement from './SVGElement.js';
import U from '../../Utilities.js';
const {
    defined,
    extend,
    getAlignFactor,
    isNumber,
    merge,
    pick,
    removeEvent
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * SVG label to render text.
 *
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

    /** @internal */
    public static readonly emptyBBox: BBoxObject = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };

    /**
     * For labels, these CSS properties are applied to the `text` node directly.
     *
     * @internal
     * @name Highcharts.SVGLabel#textProps
     * @type {Array<string>}
     */
    public static textProps: Array<keyof CSSObject> = [
        'color', 'direction', 'fontFamily', 'fontSize', 'fontStyle',
        'fontWeight', 'lineClamp', 'lineHeight', 'textAlign', 'textDecoration',
        'textOutline', 'textOverflow', 'whiteSpace', 'width'
    ];

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        renderer: SVGRenderer,
        str: string,
        x: number,
        y?: number,
        shape?: string, // @todo (SymbolKey|string),
        anchorX?: number,
        anchorY?: number,
        useHTML?: boolean,
        baseline?: boolean,
        className?: string
    ) {
        super(renderer, 'g');

        this.textStr = str;
        this.x = x;
        this.y = y;
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.baseline = baseline;
        this.className = className;

        this.addClass(
            className === 'button' ?
                'highcharts-no-tooltip' :
                'highcharts-label'
        );

        if (className) {
            this.addClass('highcharts-' + className);
        }

        // Create the text element. An undefined text content prevents redundant
        // box calculation (#16121)
        this.text = renderer.text(void 0, 0, 0, useHTML).attr({ zIndex: 1 });

        // Validate the shape argument
        let hasBGImage;
        if (typeof shape === 'string') {
            hasBGImage = /^url\((.*?)\)$/.test(shape);
            if (hasBGImage || this.renderer.symbols[shape as SymbolKey]) {
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

    /** @internal */
    public alignFactor: number;

    /** @internal */
    public baselineOffset: number;

    /** @internal */
    public bBox: BBoxObject;

    /** @internal */
    public box?: SVGElement;

    /** @internal */
    public deferredAttr: (SVGAttributes&AnyRecord);

    /** @internal */
    public heightSetting?: number;

    /** @internal */
    public needsBox?: boolean;

    /** @internal */
    public padding: number;

    /** @internal */
    public paddingLeftSetter = this.paddingSetter;

    /** @internal */
    public paddingRightSetter = this.paddingSetter;

    /** @internal */
    public text: SVGElement;

    /** @internal */
    public textStr: string;

    /** @internal */
    public doUpdate = false;

    /** @internal */
    public x: number;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public alignSetter(value: AlignValue): void {
        const alignFactor = getAlignFactor(value);
        this.textAlign = value;
        if (alignFactor !== this.alignFactor) {
            this.alignFactor = alignFactor;
            // Bounding box exists, means we're dynamically changing
            if (this.bBox && isNumber(this.xSetting)) {
                this.attr({ x: this.xSetting }); // #5134
            }

            this.updateTextPadding(); // #23595
        }
    }

    /** @internal */
    public anchorXSetter(value: number, key: string): void {
        this.anchorX = value;
        this.boxAttr(
            key,
            Math.round(value) - this.getCrispAdjust() - this.xSetting
        );
    }

    /** @internal */
    public anchorYSetter(value: number, key: string): void {
        this.anchorY = value;
        this.boxAttr(key, value - this.ySetting);
    }

    /**
     * Set a box attribute, or defer it, if the box is not yet created.
     * @internal
     */
    private boxAttr(
        key: string,
        value: (number|string|ColorType|SVGPath)
    ): void {
        if (this.box) {
            this.box.attr(key, value);
        } else {
            this.deferredAttr[key] = value;
        }
    }

    /**
     * Pick up some properties and apply them to the text instead of the
     * wrapper.
     * @internal
     */
    public css(styles: CSSObject): this {
        if (styles) {
            const textStyles: AnyRecord = {};

            // Create a copy to avoid altering the original object
            // (#537)
            styles = merge(styles);
            SVGLabel.textProps.forEach((prop): void => {
                if (typeof styles[prop] !== 'undefined') {
                    textStyles[prop] = styles[prop];
                    delete styles[prop];
                }
            });
            this.text.css(textStyles);

            // Update existing text, box (#9400, #12163, #18212, #23595)
            if (
                'fontSize' in textStyles ||
                    'fontWeight' in textStyles ||
                    'width' in textStyles
            ) {
                this.updateTextPadding();
            } else if ('textOverflow' in textStyles) {
                this.updateBoxSize();
            }

        }
        return SVGElement.prototype.css.call(this, styles) as this;
    }

    /**
     * Destroy and release memory.
     * @internal
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

    /** @internal */
    public fillSetter(value: ColorType, key: string): void {
        if (value) {
            this.needsBox = true;
        }
        // For animation getter (#6776)
        this.fill = value;
        this.boxAttr(key, value);
    }

    /**
     * Return the bounding box of the box, not the group.
     * @internal
     */
    public getBBox(reload?: boolean, rot?: number): BBoxObject {
        // If we have a text string and the DOM bBox was 0, it typically means
        // that the label was first rendered hidden, so we need to update the
        // bBox (#15246)
        if (
            (
                this.textStr && this.bBox.width === 0 && this.bBox.height === 0
            ) || this.rotation
        ) {
            this.updateBoxSize();
        }
        const {
                padding,
                height = 0,
                translateX = 0,
                translateY = 0,
                width = 0
            } = this,
            paddingLeft = pick(this.paddingLeft, padding),
            rotation = rot ?? (this.rotation || 0);

        let bBox: BBoxObject = {
            width,
            height,
            x: translateX + this.bBox.x - paddingLeft,
            y: translateY + this.bBox.y - padding + this.baselineOffset
        };

        if (rotation) {
            bBox = this.getRotatedBox(bBox, rotation);
        }

        return bBox;
    }

    /** @internal */
    private getCrispAdjust(): number {
        return (
            this.renderer.styledMode && this.box ?
                this.box.strokeWidth() :
                (
                    this['stroke-width'] ?
                        parseInt(this['stroke-width'], 10) :
                        0
                )
        ) % 2 / 2;
    }

    /** @internal */
    public heightSetter(value: number): void {
        this.heightSetting = value;
        this.doUpdate = true;
    }


    /**
     * This method is executed in the end of `attr()`, after setting all
     * attributes in the hash. In can be used to efficiently consolidate
     * multiple attributes in one SVG property -- e.g., translate, rotate and
     * scale are merged in one "transform" attribute in the SVG node.
     * Also updating height or width should trigger update of the box size.
     *
     * @internal
     * @function Highcharts.SVGLabel#afterSetters
     */
    public afterSetters(): void {
        super.afterSetters();
        if (this.doUpdate) {
            this.updateBoxSize();
            this.doUpdate = false;
        }
    }

    /**
     * After the text element is added, get the desired size of the border
     * box and add it before the text in the DOM.
     * @internal
     */
    public onAdd(): void {
        this.text.add(this);
        this.attr({
            // Alignment is available now  (#3295, 0 not rendered if given
            // as a value)
            text: pick(this.textStr, ''),
            x: this.x || 0,
            y: this.y || 0
        });

        if (this.box && defined(this.anchorX)) {
            this.attr({
                anchorX: this.anchorX,
                anchorY: this.anchorY
            });
        }
    }

    /** @internal */
    public paddingSetter(
        value: (number|string),
        key: string
    ): void {
        if (!isNumber(value)) {
            this[key] = void 0;
        } else if (value !== this[key]) {
            this[key] = value;
            this.updateTextPadding();
        }
    }

    /** @internal */
    public rSetter(
        value: (number|string|ColorType|SVGPath),
        key: string
    ): void {
        this.boxAttr(key, value);
    }

    /** @internal */
    public strokeSetter(
        value: ColorType,
        key: string
    ): void {
        // For animation getter (#6776)
        this.stroke = value;
        this.boxAttr(key, value);
    }

    /** @internal */
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

    /** @internal */
    public 'text-alignSetter'(value: string): void {
        // The text-align variety is for the pre-animation getter. The code
        // should be unified to either textAlign or text-align.
        this.textAlign = this['text-align'] = value;
        this.updateTextPadding();
    }

    /** @internal */
    public textSetter(text?: string): void {
        if (typeof text !== 'undefined') {
            // Must use .attr to ensure transforms are done (#10009)
            this.text.attr({ text });
        }
        this.updateTextPadding();

        this.reAlign();
    }

    /**
     * This function runs after the label is added to the DOM (when the bounding
     * box is available), and after the text of the label is updated to detect
     * the new bounding box and reflect it in the border box.
     * @internal
     */
    private updateBoxSize(): void {
        const text = this.text,
            attribs: SVGAttributes = {},
            padding = this.padding,
            // #12165 error when width is null (auto)
            // #12163 when fontweight: bold, recalculate bBox without cache
            // #3295 && 3514 box failure when string equals 0
            bBox = this.bBox = (
                ((
                    !isNumber(this.widthSetting) ||
                    !isNumber(this.heightSetting) ||
                    this.textAlign
                ) && defined(text.textStr)) ?
                    text.getBBox(void 0, 0) :
                    SVGLabel.emptyBBox
            );

        let crispAdjust;

        this.width = this.getPaddedWidth();
        this.height = (this.heightSetting || bBox.height || 0) + 2 * padding;

        const metrics = this.renderer.fontMetrics(text);

        // Update the label-scoped y offset. Math.min because of inline
        // style (#9400)
        this.baselineOffset = padding + Math.min(
            // When applicable, use the font size of the first line (#15707)
            (this.text.firstLineMetrics || metrics).b,
            // When the height is 0, there is no bBox, so go with the font
            // metrics. Highmaps CSS demos.
            bBox.height || Infinity
        );

        // #15491: Vertical centering
        if (this.heightSetting) {
            this.baselineOffset += (this.heightSetting - metrics.h) / 2;
        }

        if (this.needsBox && !text.textPath) {

            // Create the border box if it is not already present
            if (!this.box) {
                // Symbol definition exists (#5324)
                const box = this.box = this.symbolKey ?
                    this.renderer.symbol(this.symbolKey) :
                    this.renderer.rect();

                box.addClass( // Don't use label className for buttons
                    (
                        this.className === 'button' ?
                            '' : 'highcharts-label-box'
                    ) +
                    (
                        this.className ?
                            ' highcharts-' + this.className + '-box' : ''
                    )
                );

                box.add(this);
            }

            crispAdjust = this.getCrispAdjust();
            attribs.x = crispAdjust;
            attribs.y = (
                (this.baseline ? -this.baselineOffset : 0) + crispAdjust
            );

            // Apply the box attributes
            attribs.width = Math.round(this.width);
            attribs.height = Math.round(this.height);

            this.box.attr(extend(attribs, this.deferredAttr));
            this.deferredAttr = {};
        }
    }

    /**
     * This function runs after setting text or padding, but only if padding
     * is changed.
     * @internal
     */
    public updateTextPadding(): void {
        const text = this.text,
            textAlign = text.styles.textAlign || this.textAlign;

        if (!text.textPath) {

            this.updateBoxSize();

            // Determine y based on the baseline
            const textY = this.baseline ? 0 : this.baselineOffset,
                textX = (this.paddingLeft ?? this.padding) +
                    // Compensate for alignment
                    getAlignFactor(textAlign) * (
                        this.widthSetting ?? this.bBox.width
                    );

            // Update if anything changed
            if (textX !== text.x || textY !== text.y) {
                text.attr({
                    align: textAlign,
                    x: textX
                });

                if (typeof textY !== 'undefined') {
                    text.attr('y', textY);
                }
            }

            // Record current values
            text.x = textX;
            text.y = textY;
        }
    }

    /** @internal */
    public widthSetter(value: (number|string)): void {
        // `width:auto` => null
        this.widthSetting = isNumber(value) ? value : void 0;
        this.doUpdate = true;
    }

    /** @internal */
    public getPaddedWidth(): number {
        const padding = this.padding;
        const paddingLeft = pick(this.paddingLeft, padding);
        const paddingRight = pick(this.paddingRight, padding);
        return (
            (this.widthSetting || this.bBox.width || 0) +
            paddingLeft +
            paddingRight
        );
    }

    /** @internal */
    public xSetter(value: number): void {
        this.x = value; // For animation getter

        if (this.alignFactor) {
            value -= this.alignFactor * this.getPaddedWidth();

            // Force animation even when setting to the same value (#7898)
            this['forceAnimate:x'] = true;
        }

        if (this.anchorX) {
            // #22907, force anchorX to animate after x set
            this['forceAnimate:anchorX'] = true;
        }

        this.xSetting = Math.round(value);
        this.attr('translateX', this.xSetting);
    }

    /** @internal */
    public ySetter(value: number): void {
        if (this.anchorY) {
            // #22907, force anchorY to animate after y set
            this['forceAnimate:anchorY'] = true;
        }

        this.ySetting = this.y = Math.round(value);
        this.attr('translateY', this.ySetting);
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default SVGLabel;
