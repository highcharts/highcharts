/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
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
import U from './Utilities.js';
var defined = U.defined, objectEach = U.objectEach;
import './Axis.js';
import './Chart.js';
import './Series.js';
var Axis = H.Axis, Chart = H.Chart, correctFloat = H.correctFloat, destroyObjectProperties = H.destroyObjectProperties, format = H.format, pick = H.pick, Series = H.Series;
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
H.StackItem = function (axis, options, isNegative, x, stackOption) {
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
    // Save the stack option on the series configuration object, and whether to
    // treat it as percent
    this.stack = stackOption;
    this.leftCliff = 0;
    this.rightCliff = 0;
    // The align options and text align varies on whether the stack is negative
    // and if the chart is inverted or not.
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
};
H.StackItem.prototype = {
    /**
     * @private
     * @function Highcharts.StackItem#destroy
     * @return {void}
     */
    destroy: function () {
        destroyObjectProperties(this, this.axis);
    },
    /**
     * Renders the stack total label and adds it to the stack label group.
     *
     * @private
     * @function Highcharts.StackItem#render
     * @param {Highcharts.SVGElement} group
     * @return {void}
     */
    render: function (group) {
        var chart = this.axis.chart, options = this.options, formatOption = options.format, attr = {}, str = formatOption ? // format the text in the label
            format(formatOption, this, chart.time) :
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
                text: str,
                align: this.textAlign,
                rotation: options.rotation,
                padding: pick(options.padding, 0),
                visibility: 'hidden' // hidden until setOffset is called
            };
            this.label.attr(attr);
            if (!chart.styledMode) {
                this.label.css(options.style);
            }
            if (!this.label.added) {
                this.label.add(group); // add to the labels-group
            }
        }
        // Rank it higher than data labels (#8742)
        this.label.labelrank = chart.plotHeight;
    },
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
     * @return {void}
     */
    setOffset: function (xOffset, xWidth, boxBottom, boxTop, defaultX) {
        var stackItem = this, axis = stackItem.axis, chart = axis.chart, 
        // stack value translated mapped to chart coordinates
        y = axis.translate(axis.usePercentage ?
            100 :
            (boxTop ?
                boxTop :
                stackItem.total), 0, 0, 0, 1), yZero = axis.translate(boxBottom ? boxBottom : 0), // stack origin
        // stack height:
        h = defined(y) && Math.abs(y - yZero), 
        // x position:
        x = pick(defaultX, chart.xAxis[0].translate(stackItem.x)) +
            xOffset, stackBox = defined(y) && stackItem.getStackBox(chart, stackItem, x, y, xWidth, h, axis), label = stackItem.label, isNegative = stackItem.isNegative, isJustify = pick(stackItem.options.overflow, 'justify') === 'justify', visible, alignAttr;
        if (label && stackBox) {
            var bBox = label.getBBox(), boxOffsetX = chart.inverted ?
                (isNegative ? bBox.width : 0) : bBox.width / 2, boxOffsetY = chart.inverted ?
                bBox.height / 2 : (isNegative ? -4 : bBox.height + 4);
            stackItem.alignOptions.x = pick(stackItem.options.x, 0);
            // Align the label to the box
            label.align(stackItem.alignOptions, null, stackBox);
            // Set visibility (#678)
            alignAttr = label.alignAttr;
            label.show();
            // Set label above/under stackBox
            alignAttr.y -= boxOffsetY;
            if (isJustify) {
                // Set label x position for justifyDataLabel function
                alignAttr.x -= boxOffsetX;
                Series.prototype.justifyDataLabel.call(this.axis, label, stackItem.alignOptions, alignAttr, bBox, stackBox);
                alignAttr.x += boxOffsetX;
            }
            alignAttr.x = label.alignAttr.x;
            label.attr({
                x: alignAttr.x,
                y: alignAttr.y
            });
            if (pick(!isJustify && stackItem.options.crop, true)) {
                visible = chart.isInsidePlot(label.x +
                    (chart.inverted ? 0 : -bBox.width / 2), label.y) &&
                    chart.isInsidePlot(label.x + (chart.inverted ?
                        (isNegative ? -bBox.width : bBox.width) :
                        bBox.width / 2), label.y + bBox.height);
                if (!visible) {
                    label.hide();
                }
            }
        }
    },
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
    getStackBox: function (chart, stackItem, x, y, xWidth, h, axis) {
        var reversed = stackItem.axis.reversed, inverted = chart.inverted, axisPos = axis.height + axis.pos -
            (inverted ? chart.plotLeft : chart.plotTop), neg = (stackItem.isNegative && !reversed) ||
            (!stackItem.isNegative && reversed); // #4056
        return {
            x: inverted ? (neg ? y : y - h) : x,
            y: inverted ?
                axisPos - x - xWidth :
                (neg ?
                    (axisPos - y - h) :
                    axisPos - y),
            width: inverted ? h : xWidth,
            height: inverted ? xWidth : h
        };
    }
};
/**
 * Generate stacks for each series and calculate stacks total values
 *
 * @private
 * @function Highcharts.Chart#getStacks
 * @return {void}
 */
Chart.prototype.getStacks = function () {
    var chart = this, inverted = chart.inverted;
    // reset stacks for each yAxis
    chart.yAxis.forEach(function (axis) {
        if (axis.stacks && axis.hasVisibleSeries) {
            axis.oldStacks = axis.stacks;
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
/**
 * Build the stacks from top down
 *
 * @private
 * @function Highcharts.Axis#buildStacks
 * @return {void}
 */
Axis.prototype.buildStacks = function () {
    var axisSeries = this.series, reversedStacks = pick(this.options.reversedStacks, true), len = axisSeries.length, i;
    if (!this.isXAxis) {
        this.usePercentage = false;
        i = len;
        while (i--) {
            axisSeries[reversedStacks ? i : len - i - 1].setStackedPoints();
        }
        // Loop up again to compute percent and stream stack
        for (i = 0; i < len; i++) {
            axisSeries[i].modifyStacks();
        }
    }
};
/**
 * @private
 * @function Highcharts.Axis#renderStackTotals
 * @return {vopid}
 */
Axis.prototype.renderStackTotals = function () {
    var axis = this, chart = axis.chart, renderer = chart.renderer, stacks = axis.stacks, stackTotalGroup = axis.stackTotalGroup;
    // Create a separate group for the stack total labels
    if (!stackTotalGroup) {
        axis.stackTotalGroup = stackTotalGroup =
            renderer
                .g('stack-labels')
                .attr({
                visibility: 'visible',
                zIndex: 6
            })
                .add();
    }
    // plotLeft/Top will change when y axis gets wider so we need to translate
    // the stackTotalGroup at every render call. See bug #506 and #516
    stackTotalGroup.translate(chart.plotLeft, chart.plotTop);
    // Render each stack total
    objectEach(stacks, function (type) {
        objectEach(type, function (stack) {
            stack.render(stackTotalGroup);
        });
    });
};
/**
 * Set all the stacks to initial states and destroy unused ones.
 *
 * @private
 * @function Highcharts.Axis#resetStacks
 * @return {void}
 */
Axis.prototype.resetStacks = function () {
    var axis = this, stacks = axis.stacks;
    if (!axis.isXAxis) {
        objectEach(stacks, function (type) {
            objectEach(type, function (stack, key) {
                // Clean up memory after point deletion (#1044, #4320)
                if (stack.touched < axis.stacksTouched) {
                    stack.destroy();
                    delete type[key];
                    // Reset stacks
                }
                else {
                    stack.total = null;
                    stack.cumulative = null;
                }
            });
        });
    }
};
/**
 * @private
 * @function Highcharts.Axis#cleanStacks
 * @return {void}
 */
Axis.prototype.cleanStacks = function () {
    var stacks;
    if (!this.isXAxis) {
        if (this.oldStacks) {
            stacks = this.stacks = this.oldStacks;
        }
        // reset stacks
        objectEach(stacks, function (type) {
            objectEach(type, function (stack) {
                stack.cumulative = stack.total;
            });
        });
    }
};
// Stacking methods defnied for Series prototype
/**
 * Adds series' points value to corresponding stack
 *
 * @private
 * @function Highcharts.Series#setStackedPoints
 * @return {void}
 */
Series.prototype.setStackedPoints = function () {
    if (!this.options.stacking ||
        (this.visible !== true &&
            this.chart.options.chart.ignoreHiddenSeries !== false)) {
        return;
    }
    var series = this, xData = series.processedXData, yData = series.processedYData, stackedYData = [], yDataLength = yData.length, seriesOptions = series.options, threshold = seriesOptions.threshold, stackThreshold = pick(seriesOptions.startFromThreshold && threshold, 0), stackOption = seriesOptions.stack, stacking = seriesOptions.stacking, stackKey = series.stackKey, negKey = '-' + stackKey, negStacks = series.negStacks, yAxis = series.yAxis, stacks = yAxis.stacks, oldStacks = yAxis.oldStacks, stackIndicator, isNegative, stack, other, key, pointKey, i, x, y;
    yAxis.stacksTouched += 1;
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
                stacks[key][x] = new H.StackItem(yAxis, yAxis.options.stackLabels, isNegative, x, stackOption);
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
            stack.touched = yAxis.stacksTouched;
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
        else {
            stack.total = correctFloat(stack.total + (y || 0));
        }
        stack.cumulative =
            pick(stack.cumulative, stackThreshold) + (y || 0);
        if (y !== null) {
            stack.points[pointKey].push(stack.cumulative);
            stackedYData[i] = stack.cumulative;
        }
    }
    if (stacking === 'percent') {
        yAxis.usePercentage = true;
    }
    this.stackedYData = stackedYData; // To be used in getExtremes
    // Reset old stacks
    yAxis.oldStacks = {};
};
/**
 * Iterate over all stacks and compute the absolute values to percent
 *
 * @private
 * @function Highcharts.Series#modifyStacks
 * @return {void}
 */
Series.prototype.modifyStacks = function () {
    var series = this, stackKey = series.stackKey, stacks = series.yAxis.stacks, processedXData = series.processedXData, stackIndicator, stacking = series.options.stacking;
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
 * @param {Array<number>} pointExtremes
 * @param {Highcharts.StackItem} stack
 * @param {number} i
 * @return {void}
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
        stackIndicator.index++;
    }
    stackIndicator.key =
        [index, x, stackIndicator.index].join(',');
    return stackIndicator;
};
