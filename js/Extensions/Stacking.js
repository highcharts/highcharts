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
import Axis from '../Core/Axis/Axis.js';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import Series from '../Core/Series/Series.js';
import StackingAxis from '../Core/Axis/StackingAxis.js';
import U from '../Core/Utilities.js';
var correctFloat = U.correctFloat, defined = U.defined, destroyObjectProperties = U.destroyObjectProperties, format = U.format, isArray = U.isArray, isNumber = U.isNumber, pick = U.pick;
/**
 * Stack of data points
 *
 * @product highcharts
 *
 * @interface Highcharts.StackItemObject
 */ /**
* Alignment settings
* @name Highcharts.StackItemObject#alignOptions
* @type {Highcharts.AlignObject}
*/ /**
* Related axis
* @name Highcharts.StackItemObject#axis
* @type {Highcharts.Axis}
*/ /**
* Cumulative value of the stacked data points
* @name Highcharts.StackItemObject#cumulative
* @type {number}
*/ /**
* True if on the negative side
* @name Highcharts.StackItemObject#isNegative
* @type {boolean}
*/ /**
* Related SVG element
* @name Highcharts.StackItemObject#label
* @type {Highcharts.SVGElement}
*/ /**
* Related stack options
* @name Highcharts.StackItemObject#options
* @type {Highcharts.YAxisStackLabelsOptions}
*/ /**
* Total value of the stacked data points
* @name Highcharts.StackItemObject#total
* @type {number}
*/ /**
* Shared x value of the stack
* @name Highcharts.StackItemObject#x
* @type {number}
*/
''; // detached doclets above
/* eslint-disable no-invalid-this, valid-jsdoc */
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
var StackItem = /** @class */ (function () {
    function StackItem(axis, options, isNegative, x, stackOption) {
        var inverted = axis.chart.inverted;
        this.axis = axis;
        // Tells if the stack is negative
        this.isNegative = isNegative;
        // Save the options to be able to style the label
        this.options = options = options || {};
        // Save the x value to be able to position the label later
        this.x = x;
        // Initialize total value
        this.total = null;
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
    /**
     * @private
     * @function Highcharts.StackItem#destroy
     */
    StackItem.prototype.destroy = function () {
        destroyObjectProperties(this, this.axis);
    };
    /**
     * Renders the stack total label and adds it to the stack label group.
     *
     * @private
     * @function Highcharts.StackItem#render
     * @param {Highcharts.SVGElement} group
     */
    StackItem.prototype.render = function (group) {
        var chart = this.axis.chart, options = this.options, formatOption = options.format, attr = {}, str = formatOption ? // format the text in the label
            format(formatOption, this, chart) :
            options.formatter.call(this);
        // Change the text to reflect the new total and set visibility to hidden
        // in case the serie is hidden
        if (this.label) {
            this.label.attr({ text: str, visibility: 'hidden' });
        }
        else {
            // Create new label
            this.label = chart.renderer
                .label(str, null, null, options.shape, null, null, options.useHTML, false, 'stack-labels');
            attr = {
                r: options.borderRadius || 0,
                text: str,
                rotation: options.rotation,
                padding: pick(options.padding, 5),
                visibility: 'hidden' // hidden until setOffset is called
            };
            if (!chart.styledMode) {
                attr.fill = options.backgroundColor;
                attr.stroke = options.borderColor;
                attr['stroke-width'] = options.borderWidth;
                this.label.css(options.style);
            }
            this.label.attr(attr);
            if (!this.label.added) {
                this.label.add(group); // add to the labels-group
            }
        }
        // Rank it higher than data labels (#8742)
        this.label.labelrank = chart.plotSizeY;
    };
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
    StackItem.prototype.setOffset = function (xOffset, xWidth, boxBottom, boxTop, defaultX) {
        var stackItem = this, axis = stackItem.axis, chart = axis.chart, 
        // stack value translated mapped to chart coordinates
        y = axis.translate(axis.stacking.usePercentage ?
            100 :
            (boxTop ?
                boxTop :
                stackItem.total), 0, 0, 0, 1), yZero = axis.translate(boxBottom ? boxBottom : 0), // stack origin
        // stack height:
        h = defined(y) && Math.abs(y - yZero), 
        // x position:
        x = pick(defaultX, chart.xAxis[0].translate(stackItem.x)) +
            xOffset, stackBox = defined(y) && stackItem.getStackBox(chart, stackItem, x, y, xWidth, h, axis), label = stackItem.label, isNegative = stackItem.isNegative, isJustify = pick(stackItem.options.overflow, 'justify') === 'justify', textAlign = stackItem.textAlign, visible;
        if (label && stackBox) {
            var bBox = label.getBBox(), padding = label.padding, boxOffsetX, boxOffsetY;
            if (textAlign === 'left') {
                boxOffsetX = chart.inverted ? -padding : padding;
            }
            else if (textAlign === 'right') {
                boxOffsetX = bBox.width;
            }
            else {
                if (chart.inverted && textAlign === 'center') {
                    boxOffsetX = bBox.width / 2;
                }
                else {
                    boxOffsetX = chart.inverted ?
                        (isNegative ? bBox.width + padding : -padding) : bBox.width / 2;
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
            label.align(stackItem.alignOptions, null, stackBox);
            // Check if label is inside the plotArea #12294
            if (chart.isInsidePlot(label.alignAttr.x + boxOffsetX - stackItem.alignOptions.x, label.alignAttr.y + boxOffsetY - stackItem.alignOptions.y)) {
                label.show();
            }
            else {
                // Move label away to avoid the overlapping issues
                label.alignAttr.y = -9999;
                isJustify = false;
            }
            if (isJustify) {
                // Justify stackLabel into the stackBox
                Series.prototype.justifyDataLabel.call(this.axis, label, stackItem.alignOptions, label.alignAttr, bBox, stackBox);
            }
            label.attr({
                x: label.alignAttr.x,
                y: label.alignAttr.y
            });
            if (pick(!isJustify && stackItem.options.crop, true)) {
                visible =
                    isNumber(label.x) &&
                        isNumber(label.y) &&
                        chart.isInsidePlot(label.x - padding + label.width, label.y) &&
                        chart.isInsidePlot(label.x + padding, label.y);
                if (!visible) {
                    label.hide();
                }
            }
        }
    };
    /**
     * @private
     * @function Highcharts.StackItem#getStackBox
     *
     * @param {Highcharts.Chart} chart
     *
     * @param {Highcharts.StackItem} stackItem
     *
     * @param {number} x
     *
     * @param {number} y
     *
     * @param {number} xWidth
     *
     * @param {number} h
     *
     * @param {Highcharts.Axis} axis
     *
     * @return {Highcharts.BBoxObject}
     */
    StackItem.prototype.getStackBox = function (chart, stackItem, x, y, xWidth, h, axis) {
        var reversed = stackItem.axis.reversed, inverted = chart.inverted, axisPos = axis.height + axis.pos -
            (inverted ? chart.plotLeft : chart.plotTop), neg = (stackItem.isNegative && !reversed) ||
            (!stackItem.isNegative && reversed); // #4056
        return {
            x: inverted ? (neg ? y - axis.right : y - h + axis.pos - chart.plotLeft) :
                x + chart.xAxis[0].transB - chart.plotLeft,
            y: inverted ?
                axis.height - x - xWidth :
                (neg ?
                    (axisPos - y - h) :
                    axisPos - y),
            width: inverted ? h : xWidth,
            height: inverted ? xWidth : h
        };
    };
    return StackItem;
}());
/**
 * Generate stacks for each series and calculate stacks total values
 *
 * @private
 * @function Highcharts.Chart#getStacks
 */
Chart.prototype.getStacks = function () {
    var chart = this, inverted = chart.inverted;
    // reset stacks for each yAxis
    chart.yAxis.forEach(function (axis) {
        if (axis.stacking && axis.stacking.stacks && axis.hasVisibleSeries) {
            axis.stacking.oldStacks = axis.stacking.stacks;
        }
    });
    chart.series.forEach(function (series) {
        var xAxisOptions = series.xAxis && series.xAxis.options || {};
        if (series.options.stacking &&
            (series.visible === true ||
                chart.options.chart.ignoreHiddenSeries === false)) {
            series.stackKey = [
                series.type,
                pick(series.options.stack, ''),
                inverted ? xAxisOptions.top : xAxisOptions.left,
                inverted ? xAxisOptions.height : xAxisOptions.width
            ].join(',');
        }
    });
};
// Stacking methods defined on the Axis prototype
StackingAxis.compose(Axis);
// Stacking methods defined for Series prototype
/**
 * Set grouped points in a stack-like object. When `centerInCategory` is true,
 * and `stacking` is not enabled, we need a pseudo (horizontal) stack in order
 * to handle grouping of points within the same category.
 *
 * @private
 * @function Highcharts.Series#setStackedPoints
 * @return {void}
 */
Series.prototype.setGroupedPoints = function () {
    if (this.options.centerInCategory &&
        (this.is('column') || this.is('columnrange')) &&
        // With stacking enabled, we already have stacks that we can compute
        // from
        !this.options.stacking &&
        // With only one series, we don't need to consider centerInCategory
        this.chart.series.length > 1) {
        Series.prototype.setStackedPoints.call(this, 'group');
    }
};
/**
 * Adds series' points value to corresponding stack
 *
 * @private
 * @function Highcharts.Series#setStackedPoints
 */
Series.prototype.setStackedPoints = function (stackingParam) {
    var stacking = stackingParam || this.options.stacking;
    if (!stacking ||
        (this.visible !== true &&
            this.chart.options.chart.ignoreHiddenSeries !== false)) {
        return;
    }
    var series = this, xData = series.processedXData, yData = series.processedYData, stackedYData = [], yDataLength = yData.length, seriesOptions = series.options, threshold = seriesOptions.threshold, stackThreshold = pick(seriesOptions.startFromThreshold && threshold, 0), stackOption = seriesOptions.stack, stackKey = stackingParam ? series.type + "," + stacking : series.stackKey, negKey = '-' + stackKey, negStacks = series.negStacks, yAxis = series.yAxis, stacks = yAxis.stacking.stacks, oldStacks = yAxis.stacking.oldStacks, stackIndicator, isNegative, stack, other, key, pointKey, i, x, y;
    yAxis.stacking.stacksTouched += 1;
    // loop over the non-null y values and read them into a local array
    for (i = 0; i < yDataLength; i++) {
        x = xData[i];
        y = yData[i];
        stackIndicator = series.getStackIndicator(stackIndicator, x, series.index);
        pointKey = stackIndicator.key;
        // Read stacked values into a stack based on the x value,
        // the sign of y and the stack key. Stacking is also handled for null
        // values (#739)
        isNegative = negStacks && y < (stackThreshold ? 0 : threshold);
        key = isNegative ? negKey : stackKey;
        // Create empty object for this stack if it doesn't exist yet
        if (!stacks[key]) {
            stacks[key] =
                {};
        }
        // Initialize StackItem for this x
        if (!stacks[key][x]) {
            if (oldStacks[key] &&
                oldStacks[key][x]) {
                stacks[key][x] = oldStacks[key][x];
                stacks[key][x].total = null;
            }
            else {
                stacks[key][x] = new StackItem(yAxis, yAxis.options.stackLabels, isNegative, x, stackOption);
            }
        }
        // If the StackItem doesn't exist, create it first
        stack = stacks[key][x];
        if (y !== null) {
            stack.points[pointKey] = stack.points[series.index] =
                [pick(stack.cumulative, stackThreshold)];
            // Record the base of the stack
            if (!defined(stack.cumulative)) {
                stack.base = pointKey;
            }
            stack.touched = yAxis.stacking.stacksTouched;
            // In area charts, if there are multiple points on the same X value,
            // let the area fill the full span of those points
            if (stackIndicator.index > 0 && series.singleStacks === false) {
                stack.points[pointKey][0] =
                    stack.points[series.index + ',' + x + ',0'][0];
            }
            // When updating to null, reset the point stack (#7493)
        }
        else {
            stack.points[pointKey] = stack.points[series.index] =
                null;
        }
        // Add value to the stack total
        if (stacking === 'percent') {
            // Percent stacked column, totals are the same for the positive and
            // negative stacks
            other = isNegative ? stackKey : negKey;
            if (negStacks && stacks[other] && stacks[other][x]) {
                other = stacks[other][x];
                stack.total = other.total =
                    Math.max(other.total, stack.total) +
                        Math.abs(y) ||
                        0;
                // Percent stacked areas
            }
            else {
                stack.total =
                    correctFloat(stack.total + (Math.abs(y) || 0));
            }
        }
        else if (stacking === 'group') {
            if (isArray(y)) {
                y = y[0];
            }
            // In this stack, the total is the number of valid points
            if (y !== null) {
                stack.total = (stack.total || 0) + 1;
            }
        }
        else {
            stack.total = correctFloat(stack.total + (y || 0));
        }
        if (stacking === 'group') {
            // This point's index within the stack, pushed to stack.points[1]
            stack.cumulative = (stack.total || 1) - 1;
        }
        else {
            stack.cumulative =
                pick(stack.cumulative, stackThreshold) + (y || 0);
        }
        if (y !== null) {
            stack.points[pointKey].push(stack.cumulative);
            stackedYData[i] = stack.cumulative;
            stack.hasValidPoints = true;
        }
    }
    if (stacking === 'percent') {
        yAxis.stacking.usePercentage = true;
    }
    if (stacking !== 'group') {
        this.stackedYData = stackedYData; // To be used in getExtremes
    }
    // Reset old stacks
    yAxis.stacking.oldStacks = {};
};
/**
 * Iterate over all stacks and compute the absolute values to percent
 *
 * @private
 * @function Highcharts.Series#modifyStacks
 */
Series.prototype.modifyStacks = function () {
    var series = this, yAxis = series.yAxis, stackKey = series.stackKey, stacks = yAxis.stacking.stacks, processedXData = series.processedXData, stackIndicator, stacking = series.options.stacking;
    if (series[stacking + 'Stacker']) { // Modifier function exists
        [stackKey, '-' + stackKey].forEach(function (key) {
            var i = processedXData.length, x, stack, pointExtremes;
            while (i--) {
                x = processedXData[i];
                stackIndicator = series.getStackIndicator(stackIndicator, x, series.index, key);
                stack = stacks[key] && stacks[key][x];
                pointExtremes =
                    stack && stack.points[stackIndicator.key];
                if (pointExtremes) {
                    series[stacking + 'Stacker'](pointExtremes, stack, i);
                }
            }
        });
    }
};
/**
 * Modifier function for percent stacks. Blows up the stack to 100%.
 *
 * @private
 * @function Highcharts.Series#percentStacker
 */
Series.prototype.percentStacker = function (pointExtremes, stack, i) {
    var totalFactor = stack.total ? 100 / stack.total : 0;
    // Y bottom value
    pointExtremes[0] = correctFloat(pointExtremes[0] * totalFactor);
    // Y value
    pointExtremes[1] = correctFloat(pointExtremes[1] * totalFactor);
    this.stackedYData[i] = pointExtremes[1];
};
/**
 * Get stack indicator, according to it's x-value, to determine points with the
 * same x-value
 *
 * @private
 * @function Highcharts.Series#getStackIndicator
 * @param {Highcharts.StackItemIndicatorObject|undefined} stackIndicator
 * @param {number} x
 * @param {number} index
 * @param {string} [key]
 * @return {Highcharts.StackItemIndicatorObject}
 */
Series.prototype.getStackIndicator = function (stackIndicator, x, index, key) {
    // Update stack indicator, when:
    // first point in a stack || x changed || stack type (negative vs positive)
    // changed:
    if (!defined(stackIndicator) ||
        stackIndicator.x !== x ||
        (key && stackIndicator.key !== key)) {
        stackIndicator = {
            x: x,
            index: 0,
            key: key
        };
    }
    else {
        (stackIndicator).index++;
    }
    stackIndicator.key =
        [index, x, stackIndicator.index].join(',');
    return stackIndicator;
};
H.StackItem = StackItem;
export default H.StackItem;
