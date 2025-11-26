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

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Renderer/AlignObject';
import type Axis from '../Axis';
import type BBoxObject from '../../Renderer/BBoxObject';
import type StackingAxis from './StackingAxis';
import type SVGAttributes from '../../Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Renderer/SVG/SVGElement';
import type SVGLabel from '../../Renderer/SVG/SVGLabel';

import T from '../../Templating.js';
const { format } = T;
import SeriesRegistry from '../../Series/SeriesRegistry.js';
const { series: Series } = SeriesRegistry;
import U from '../../Utilities.js';
const {
    destroyObjectProperties,
    fireEvent,
    getAlignFactor,
    isNumber,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

export interface AdjustStackPositionProps {
    labelBox: BBoxObject;
    verticalAlign: VerticalAlignValue;
    textAlign: AlignValue;
}

export interface AlignOptions {
    verticalAlign: 'top'|'middle'|'bottom';
    align: 'left'|'center'|'right';
    x?: number;
    y?: number;
}

export interface StackBoxProps {
    boxBottom?: number;
    boxTop?: number;
    defaultX?: number;
    isNegative: boolean;
    width: number;
    xAxis?: Axis;
    xOffset: number;
}

/* *
 *
 *  Class
 *
 * */

/**
 * The class for stacks. Each stack, on a specific X value and either negative
 * or positive, has its own stack item.
 * @private
 */
class StackItem {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        axis: StackingAxis,
        negativeValue: boolean,
        x: number,
        stackOption?: number|string
    ) {
        this.axis = axis;

        // The stack goes to the left either if the stack has negative value
        // or when axis is reversed. XOR operator.
        this.negativeValue = negativeValue;

        // Save the x value to be able to position the label later
        this.x = x;

        // Initialize total value
        this.total = null;
        this.cumulative = null;

        // This will keep each points' extremes stored by series.index and point
        // index
        this.points = {};
        this.hasValidPoints = false;

        // Save the stack option on the series configuration object,
        // and whether to treat it as percent
        this.stack = stackOption;
        this.leftCliff = 0;
        this.rightCliff = 0;

    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: StackingAxis;
    public base?: string;
    public cumulative: number | null;
    public hasValidPoints: boolean;
    public label?: SVGLabel;
    public leftCliff: number;
    public negativeValue: boolean;
    public padding?: number;
    public points: Record<string, Array<number>>;
    public rightCliff: number;
    public rotation?: number;
    public shadow?: SVGElement;
    public shadowGroup?: SVGElement;
    public stack?: string|number;
    public total: number | null;
    public touched?: number;
    public x: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public destroy(): void {
        destroyObjectProperties(this, this.axis);
    }

    /**
     * Renders the stack total label and adds it to the stack label group.
     * @private
     */
    public render(group: SVGElement): void {
        const axis = this.axis,
            chart = axis.chart,
            options = axis.options.stackLabels || {},
            formatOption = options.format,
            // Format the text in the label.
            str = formatOption ?
                format(formatOption, this, chart) :
                (options.formatter as any).call(this);

        // Change the text to reflect the new total and set visibility to hidden
        // in case the series is hidden
        if (this.label) {
            this.label.attr({ text: str, visibility: 'hidden' });
        } else {
            // Create new label
            this.label = chart.renderer.label(
                str,
                0,
                void 0,
                options.shape,
                void 0,
                void 0,
                options.useHTML,
                false,
                'stack-labels'
            );

            const attr: SVGAttributes = {
                r: options.borderRadius || 0,
                text: str,
                // Set default padding to 5 as it is in datalabels #12308
                padding: pick(options.padding, 5),
                visibility: 'hidden' // Hidden until setOffset is called
            };

            if (!chart.styledMode) {
                attr.fill = options.backgroundColor;
                attr.stroke = options.borderColor;
                attr['stroke-width'] = options.borderWidth;
                this.label.css(options.style || {});
            }

            this.label.attr(attr);

            if (!this.label.added) {
                this.label.add(group); // Add to the labels-group
            }
        }

        // Rank it higher than data labels (#8742)
        this.label.labelrank = chart.plotSizeY;
        fireEvent(this, 'afterRender');
    }

    /**
     * Sets the offset that the stack has from the x value and repositions the
     * label.
     * @private
     */
    public setOffset(
        xOffset: number,
        width: number,
        boxBottom?: number,
        boxTop?: number,
        defaultX?: number,
        xAxis?: Axis
    ): void {
        const { axis, label } = this,
            chart = axis.chart,
            options = axis.options.stackLabels || {},
            inverted = chart.inverted,
            isNegative = this.negativeValue !== !!axis.reversed,
            stackBox = this.getStackBox({
                boxBottom,
                boxTop,
                defaultX,
                isNegative,
                width,
                xAxis,
                xOffset
            }),
            {
                align = (inverted ? (isNegative ? 'left' : 'right') : 'center'),
                verticalAlign = (
                    inverted ? 'middle' : isNegative ? 'bottom' : 'top'
                ),
                textAlign = (
                    inverted ? (!isNegative ? 'left' : 'right') : 'center'
                ),
                x = 0,
                y = 0
            } = options,
            alignOptions: AlignOptions = {
                align,
                verticalAlign,
                x,
                y
            };

        if (label && stackBox) {
            const labelBox = label.getBBox(void 0, 0),
                padding = label.padding;
            let isJustify = pick(options.overflow, 'justify') === 'justify',
                visible;

            // Calculate the adjusted Stack position, to take into consideration
            // the size if the labelBox and vertical alignment as well as the
            // text alignment. It needs to be done to work with default
            // SVGLabel.align/justify methods.
            const { x: adjustX, y: adjustY } = this.adjustStackPosition({
                labelBox,
                verticalAlign,
                textAlign
            });

            stackBox.x -= adjustX;
            stackBox.y -= adjustY;

            // Align the label to the adjusted box.
            label.align(alignOptions, false, stackBox);

            // Check if the label is inside the plotArea #12294
            visible = chart.isInsidePlot(
                label.alignAttr.x + x + adjustX,
                label.alignAttr.y + y + adjustY
            );

            if (!visible) {
                isJustify = false;
            }

            if (isJustify) {
                // Justify stackLabel into the alignBox
                Series.prototype.justifyDataLabel.call(
                    axis,
                    label,
                    alignOptions,
                    label.alignAttr,
                    labelBox,
                    stackBox
                );
            }

            // Add correct rotation with its rotation origin (#15129)
            label.attr({
                rotation: options.rotation,
                rotationOriginX: labelBox.width *
                    getAlignFactor(options.textAlign || 'center'),
                rotationOriginY: labelBox.height / 2
            });

            // Check if the dataLabel should be visible.
            if (pick(!isJustify && options.crop, true)) {
                visible =
                    isNumber(label.x) &&
                    isNumber(label.y) &&
                    chart.isInsidePlot(
                        label.x - padding + (label.width || 0),
                        label.y
                    ) &&
                    chart.isInsidePlot(label.x + padding, label.y);

            }
            label[visible ? 'show' : 'hide']();
        }

        fireEvent(this, 'afterSetOffset', { xOffset, width });
    }

    /**
     * Adjust the stack BBox position, to take into consideration the alignment
     * of the dataLabel. This is necessary to make the stackDataLabel work with
     * core methods like `SVGLabel.adjust` and `Series.justifyDataLabel`.
     * @param AdjustStackPositionProps
     * @return {{x: number, y: number}} Adjusted BBox position of the stack.
     */
    public adjustStackPosition({
        labelBox,
        verticalAlign,
        textAlign
    }: AdjustStackPositionProps): {x: number, y: number} {
        return {
            x: labelBox.width / 2 +
                (labelBox.width / 2) * (2 * getAlignFactor(textAlign) - 1),
            y: (labelBox.height / 2) * 2 * (1 - getAlignFactor(verticalAlign))
        };
    }
    /**
     * Get the bbox of the stack.
     * @private
     * @function Highcharts.StackItem#getStackBox
     * @return {BBoxObject} The x, y, height, width of the stack.
     */
    public getStackBox(stackBoxProps: StackBoxProps): BBoxObject {
        const axis = this.axis,
            chart = axis.chart,
            {
                boxBottom,
                boxTop,
                defaultX,
                isNegative,
                width,
                xOffset
            } = stackBoxProps,
            totalStackValue = axis.stacking.usePercentage ?
                100 :
                pick(boxTop, this.total, 0),
            y = axis.toPixels(totalStackValue),
            xAxis = stackBoxProps.xAxis || chart.xAxis[0],
            x = pick(defaultX, xAxis.translate(this.x)) + xOffset,
            yZero = axis.toPixels(
                boxBottom ||
                (
                    isNumber(axis.min) &&
                    axis.logarithmic &&
                    axis.logarithmic.lin2log(axis.min)
                ) ||
                0
            ),
            height = Math.abs(y - yZero),
            inverted = chart.inverted;

        return inverted ?
            {
                x: (isNegative ? y : y - height) - chart.plotLeft,
                y: xAxis.height - x - width + xAxis.top - chart.plotTop,
                width: height,
                height: width
            } : {
                x: x + xAxis.transB - chart.plotLeft,
                y: (isNegative ? y - height : y) - chart.plotTop,
                width: width,
                height: height
            };
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default StackItem;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Stack of data points
 *
 * @product highcharts
 *
 * @interface Highcharts.StackItemObject
 *//**
 * Alignment settings
 * @name Highcharts.StackItemObject#alignOptions
 * @type {Highcharts.AlignObject}
 *//**
 * Related axis
 * @name Highcharts.StackItemObject#axis
 * @type {Highcharts.Axis}
 *//**
 * Cumulative value of the stacked data points
 * @name Highcharts.StackItemObject#cumulative
 * @type {number}
 *//**
 * True if on the negative side
 * @name Highcharts.StackItemObject#isNegative
 * @type {boolean}
 *//**
 * Related SVG element
 * @name Highcharts.StackItemObject#label
 * @type {Highcharts.SVGElement}
 *//**
 * Related stack options
 * @name Highcharts.StackItemObject#options
 * @type {Highcharts.YAxisStackLabelsOptions}
 *//**
 * Total value of the stacked data points
 * @name Highcharts.StackItemObject#total
 * @type {number}
 *//**
 * Shared x value of the stack
 * @name Highcharts.StackItemObject#x
 * @type {number}
 */

''; // Keeps doclets above in JS file
