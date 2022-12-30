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

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from '../../Renderer/AlignObject';
import type Axis from '../Axis';
import type BBoxObject from '../../Renderer/BBoxObject';
import type Chart from '../../Chart/Chart';
import type StackingAxis from './StackingAxis';
import type {
    StackLabelOptions,
    StackOverflowValue
} from './StackingOptions';
import type SVGAttributes from '../../Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Renderer/SVG/SVGElement';
import type SVGLabel from '../../Renderer/SVG/SVGLabel';

import FU from '../../FormatUtilities.js';
const { format } = FU;
import SeriesRegistry from '../../Series/SeriesRegistry.js';
const { series: Series } = SeriesRegistry;
import U from '../../Utilities.js';
const {
    destroyObjectProperties,
    pick,
    isNumber
} = U;

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
        options: StackLabelOptions,
        negativeValue: boolean,
        x: number,
        stackOption?: StackOverflowValue
    ) {
        const inverted = axis.chart.inverted,
            reversed = axis.reversed;

        this.axis = axis;

        // The stack goes to the left either if the stack has negative value
        // or when axis is reversed. XOR operator.
        const isNegative = (this.isNegative = !!negativeValue !== !!reversed);

        // Save the options to be able to style the label
        this.options = options = options || {};

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

        // The align options and text align varies on whether the stack is
        // negative and if the chart is inverted or not.
        // First test the user supplied value, then use the dynamic.
        this.alignOptions = {
            align:
                options.align ||
                (inverted ? (isNegative ? 'left' : 'right') : 'center'),
            verticalAlign:
                options.verticalAlign ||
                (inverted ? 'middle' : isNegative ? 'bottom' : 'top'),
            y: options.y,
            x: options.x
        };

        this.textAlign =
            options.textAlign ||
            (inverted ? (isNegative ? 'left' : 'right') : 'center');
    }

    public alignOptions: AlignObject;
    public axis: StackingAxis;
    public base?: string;
    public cumulative: number | null;
    public hasValidPoints: boolean;
    public isNegative: boolean;
    public label?: SVGLabel;
    public leftCliff: number;
    public options: StackLabelOptions;
    public padding?: number;
    public points: Record<string, Array<number>>;
    public rightCliff: number;
    public rotation?: number;
    public stack?: StackOverflowValue;
    public textAlign: AlignValue;
    public total: number | null;
    public touched?: number;
    public x: number;
    public factorMap = {
        top: 2,
        middle: 1,
        bottom: 0,
        left: 2,
        center: 1,
        right: 0
    };

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
        const chart = this.axis.chart,
            options = this.options,
            formatOption = options.format,
            // Format the text in the label.
            str = formatOption ?
                format(formatOption, this, chart) :
                (options.formatter as any).call(this);

        // Change the text to reflect the new total and set visibility to hidden
        // in case the serie is hidden
        if (this.label) {
            this.label.attr({ text: str, visibility: 'hidden' });
        } else {
            // Create new label
            this.label = chart.renderer.label(
                str,
                null as any,
                null as any,
                (options as any).shape,
                null as any,
                null as any,
                options.useHTML,
                false,
                'stack-labels'
            );

            const attr: SVGAttributes = {
                r: options.borderRadius || 0,
                text: str,
                rotation: (options as any).rotation,
                // set default padding to 5 as it is in datalabels #12308
                padding: pick((options as any).padding, 5),
                visibility: 'hidden' // hidden until setOffset is called
            };

            if (!chart.styledMode) {
                attr.fill = options.backgroundColor;
                attr.stroke = options.borderColor;
                attr['stroke-width'] = options.borderWidth;
                this.label.css(options.style as any);
            }

            this.label.attr(attr);

            if (!this.label.added) {
                this.label.add(group); // add to the labels-group
            }
        }

        // Rank it higher than data labels (#8742)
        this.label.labelrank = chart.plotSizeY;
    }

    /**
     * Sets the offset that the stack has from the x value and repositions the
     * label.
     * @private
     */
    public setOffset(
        xOffset: number,
        xWidth: number,
        boxBottom?: number,
        boxTop?: number,
        defaultX?: number,
        xAxis?: Axis
    ): void {
        const axis = this.axis,
            chart = axis.chart,
            stackBox = this.getStackBox({
                xOffset,
                width: xWidth,
                boxBottom,
                boxTop,
                defaultX,
                xAxis
            }),
            label = this.label,
            textAlign = this.textAlign,
            { align, verticalAlign } = this.alignOptions;

        if (label && stackBox) {
            const bBox = label.getBBox(),
                padding = label.padding;
            let isJustify =
                    pick(this.options.overflow, 'justify') === 'justify',
                visible;

            // Reset alignOptions property after justify #12337
            this.alignOptions.x = pick(this.options.x, 0);
            this.alignOptions.y = pick(this.options.y, 0);

            // Calculate the adjusted Stack position, to take into consideration
            // The size if the labelBox and vertical alignment as
            // well as the text alignment. It's need to be done to work with
            // default SVGLabel.align/justify methods.
            const { x, y } = this.adjustStackPosition({
                labelBox: bBox,
                vAlign: verticalAlign as VerticalAlignValue,
                textAlign
            });

            stackBox.x -= x;
            stackBox.y -= y;
            // Align the label to the adjusted box.
            label.align(this.alignOptions, false, stackBox);
            // Check if label is inside the plotArea #12294
            visible = (
                chart.isInsidePlot(
                    label.alignAttr.x +
                        this.alignOptions.x +
                        x,
                    label.alignAttr.y +
                        this.alignOptions.y +
                        y
                )
            );

            if (!visible) {
                isJustify = false;
            }

            if (isJustify) {
                // Justify stackLabel into the stackBox
                Series.prototype.justifyDataLabel.call(
                    this.axis,
                    label,
                    this.alignOptions,
                    label.alignAttr,
                    bBox,
                    stackBox
                );
            }

            // add attr to aviod the default animation of justifyDataLabel.
            label.attr({
                x: label.alignAttr.x,
                y: label.alignAttr.y
            });

            // check if the dataLabel should be visible.
            if (pick(!isJustify && this.options.crop, true)) {
                visible =
                    isNumber(label.x) &&
                    isNumber(label.y) &&
                    chart.isInsidePlot(
                        label.x - padding + label.width,
                        label.y
                    ) &&
                    chart.isInsidePlot(label.x + padding, label.y);

            }
            label[visible ? 'show' : 'hide']();
        }
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
        vAlign,
        textAlign
    }: AdjustStackPositionProps): {x: number, y: number} {
        const verticalAlignFactor = this.factorMap[vAlign],
            textAlignFactor = this.factorMap[textAlign] - 1;

        return {
            x: (labelBox.width / 2) + (labelBox.width / 2) * textAlignFactor,
            y: (labelBox.height / 2) * verticalAlignFactor
        };
    }
    /**
     * Get the bbox of the stack.
     * @private
     * @function Highcharts.StackItem#getStackBox
     * @return {BBoxObject} The x,y, height, width of the stack.
     */
    public getStackBox(stackBoxProps: StackBoxProps): BBoxObject {
        const stackItem = this,
            axis = this.axis,
            chart = axis.chart,
            {
                boxTop,
                defaultX,
                xOffset,
                width,
                boxBottom
            } = stackBoxProps,
            totalStackValue = axis.stacking.usePercentage ?
                100 :
                pick(boxTop, this.total, 0),
            y = axis.toPixels(totalStackValue),
            xAxis = stackBoxProps.xAxis || chart.xAxis[0],
            x = pick(defaultX, xAxis.toPixels(this.x)) + xOffset,
            yZero = axis.toPixels(boxBottom ? boxBottom : 0),
            height = Math.abs(y - yZero),
            inverted = chart.inverted,
            neg = stackItem.isNegative;

        return inverted ?
            {
                x: (neg ? y : y - height) - chart.plotLeft,
                y: x - chart.plotTop,
                width: height,
                height: width
            } : {
                x: x - chart.plotLeft,
                y: (neg ? y - height : y) - chart.plotTop,
                width: width,
                height: height
            };
    }
}

export interface StackBoxProps {
    xOffset: number;
    width: number;
    boxBottom?: number;
    boxTop?: number;
    defaultX?: number;
    xAxis?: Axis;
}

export interface AdjustStackPositionProps {
    labelBox: BBoxObject;
    vAlign: VerticalAlignValue;
    textAlign: AlignValue;
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

''; // keeps doclets above in JS file
