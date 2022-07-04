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
    AlignValue
} from '../../Renderer/AlignObject';
import type Axis from '../Axis';
import type BBoxObject from '../../Renderer/BBoxObject';
import type Chart from '../../Chart/Chart';
import type StackingAxis from './StackingAxis';
import type {
    StackLabelOptions,
    StackOverflowValue
} from './StackingOptions';
import type SVGElement from '../../Renderer/SVG/SVGElement';
import type SVGLabel from '../../Renderer/SVG/SVGLabel';

import FU from '../../FormatUtilities.js';
const { format } = FU;
import SeriesRegistry from '../../Series/SeriesRegistry.js';
const { series: Series } = SeriesRegistry;
import U from '../../Utilities.js';
const {
    defined,
    destroyObjectProperties,
    isNumber,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The class for stacks. Each stack, on a specific X value and either negative
 * or positive, has its own stack item.
 *
 * @private
 * @class
 * @name Highcharts.StackItem
 * @param {Highcharts.Axis} axis
 * @param {Highcharts.YAxisStackLabelsOptions} options
 * @param {boolean} isNegative
 * @param {number} x
 * @param {Highcharts.OptionsStackingValue} [stackOption]
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
        isNegative: boolean,
        x: number,
        stackOption?: StackOverflowValue
    ) {

        const inverted = axis.chart.inverted;

        this.axis = axis;

        // Tells if the stack is negative
        this.isNegative = isNegative;

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
            align: options.align ||
                (inverted ? (isNegative ? 'left' : 'right') : 'center'),
            verticalAlign: options.verticalAlign ||
                (inverted ? 'middle' : (isNegative ? 'bottom' : 'top')),
            y: options.y,
            x: options.x
        };
        this.textAlign = options.textAlign ||
        (inverted ? (isNegative ? 'right' : 'left') : 'center');
    }

    public alignOptions: AlignObject;
    public axis: StackingAxis;
    public base?: string;
    public cumulative: (number|null);
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
    public total: (number|null);
    public touched?: number;
    public x: number;

    /**
     * @private
     * @function Highcharts.StackItem#destroy
     */
    public destroy(): void {
        destroyObjectProperties(this, this.axis);
    }

    /**
     * Renders the stack total label and adds it to the stack label group.
     *
     * @private
     * @function Highcharts.StackItem#render
     * @param {Highcharts.SVGElement} group
     */
    public render(group: SVGElement): void {
        let chart = this.axis.chart,
            options = this.options,
            formatOption = options.format,
            attr: AnyRecord = {},
            str = formatOption ? // format the text in the label
                format(formatOption, this, chart) :
                (options.formatter as any).call(this);

        // Change the text to reflect the new total and set visibility to hidden
        // in case the serie is hidden
        if (this.label) {
            this.label.attr({ text: str, visibility: 'hidden' });
        } else {
            // Create new label
            this.label = chart.renderer
                .label(
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

            attr = {
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
     *
     * @private
     * @function Highcarts.StackItem#setOffset
     * @param {number} xOffset
     * @param {number} xWidth
     * @param {number} [boxBottom]
     * @param {number} [boxTop]
     * @param {number} [defaultX]
     */
    public setOffset(
        xOffset: number,
        xWidth: number,
        boxBottom?: number,
        boxTop?: number,
        defaultX?: number
    ): void {
        let stackItem = this,
            axis = stackItem.axis,
            chart = axis.chart,
            // stack value translated mapped to chart coordinates
            y = axis.translate(
                axis.stacking.usePercentage ?
                    100 :
                    (boxTop ?
                        boxTop :
                        (stackItem.total as any)),
                0 as any,
                0 as any,
                0 as any,
                1 as any
            ),
            yZero = axis.translate(boxBottom ? boxBottom : 0), // stack origin
            // stack height:
            h = defined(y) && Math.abs((y as any) - (yZero as any)),
            // x position:
            x = pick(defaultX, chart.xAxis[0].translate(stackItem.x)) +
                xOffset,
            stackBox = defined(y) && stackItem.getStackBox(
                chart,
                stackItem,
                x,
                y as any,
                xWidth,
                h as any,
                axis
            ),
            label = stackItem.label,
            isNegative = stackItem.isNegative,
            isJustify = pick(stackItem.options.overflow,
                'justify') === 'justify',
            textAlign = stackItem.textAlign,
            visible;

        if (label && stackBox) {
            let bBox = label.getBBox(),
                padding = label.padding,
                boxOffsetX,
                boxOffsetY;

            if (textAlign === 'left') {
                boxOffsetX = chart.inverted ? -padding : padding;
            } else if (textAlign === 'right') {
                boxOffsetX = bBox.width;
            } else {
                if (chart.inverted && textAlign === 'center') {
                    boxOffsetX = bBox.width / 2;
                } else {
                    boxOffsetX = chart.inverted ?
                        (isNegative ? bBox.width + padding : -padding) :
                        bBox.width / 2;
                }
            }

            boxOffsetY = chart.inverted ?
                bBox.height / 2 : (isNegative ? -padding : bBox.height);

            // Reset alignOptions property after justify #12337
            stackItem.alignOptions.x = pick(stackItem.options.x, 0);
            stackItem.alignOptions.y = pick(stackItem.options.y, 0);

            // Set the stackBox position
            stackBox.x -= boxOffsetX;
            stackBox.y -= boxOffsetY;

            // Align the label to the box
            label.align(stackItem.alignOptions, null as any, stackBox);

            // Check if label is inside the plotArea #12294
            if (chart.isInsidePlot(
                label.alignAttr.x + boxOffsetX - stackItem.alignOptions.x,
                label.alignAttr.y + boxOffsetY - stackItem.alignOptions.y
            )) {
                label.show();
            } else {
                // Move label away to avoid the overlapping issues
                label.hide();
                isJustify = false;
            }

            if (isJustify) {
                // Justify stackLabel into the stackBox
                Series.prototype.justifyDataLabel.call(
                    this.axis,
                    label,
                    stackItem.alignOptions,
                    label.alignAttr,
                    bBox,
                    stackBox
                );
            }
            label.attr({
                x: label.alignAttr.x,
                y: label.alignAttr.y
            });

            if (pick(!isJustify && stackItem.options.crop, true)) {
                visible =
                    isNumber(label.x) &&
                    isNumber(label.y) &&
                    chart.isInsidePlot(
                        label.x - padding + label.width,
                        label.y
                    ) &&
                    chart.isInsidePlot(label.x + padding, label.y);

                if (!visible) {
                    label.hide();
                }
            }
        }
    }

    /**
     * @private
     * @function Highcharts.StackItem#getStackBox
     */
    public getStackBox(
        chart: Chart,
        stackItem: StackItem,
        x: number,
        y: number,
        xWidth: number,
        h: number,
        axis: Axis
    ): BBoxObject {
        const reversed = stackItem.axis.reversed,
            inverted = chart.inverted,
            axisPos = axis.height + (axis.pos as any) -
                (inverted ? chart.plotLeft : chart.plotTop),
            neg = (stackItem.isNegative && !reversed) ||
                (!stackItem.isNegative && reversed); // #4056

        return { // this is the box for the complete stack
            x: inverted ?
                (neg ? y - axis.right : y - h + axis.pos - chart.plotLeft) :
                x + chart.xAxis[0].transB - chart.plotLeft,
            y: inverted ?
                axis.height - x - xWidth :
                (neg ?
                    (axisPos - y - h) :
                    axisPos - y
                ),
            width: inverted ? h : xWidth,
            height: inverted ? xWidth : h
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

''; // keeps doclets above in JS file
