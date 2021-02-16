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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, ColumnSeries = _a.column, LineSeries = _a.line;
import U from '../../Core/Utilities.js';
var arrayMax = U.arrayMax, arrayMin = U.arrayMin, correctFloat = U.correctFloat, extend = U.extend, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
import WaterfallAxis from '../../Core/Axis/WaterfallAxis.js';
import WaterfallPoint from './WaterfallPoint.js';
import '../../Core/Options.js';
/**
 * Returns true if the key is a direct property of the object.
 * @private
 * @param {*} obj - Object with property to test
 * @param {string} key - Property key to test
 * @return {boolean} - Whether it is a direct property
 */
function ownProp(obj, key) {
    return Object.hasOwnProperty.call(obj, key);
}
/* eslint-disable no-invalid-this, valid-jsdoc */
// eslint-disable-next-line valid-jsdoc
/**
 * Waterfall series type.
 *
 * @private
 */
var WaterfallSeries = /** @class */ (function (_super) {
    __extends(WaterfallSeries, _super);
    function WaterfallSeries() {
        /* *
         *
         * Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.chart = void 0;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.stackedYNeg = void 0;
        _this.stackedYPos = void 0;
        _this.stackKey = void 0;
        _this.xData = void 0;
        _this.yAxis = void 0;
        _this.yData = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    // After generating points, set y-values for all sums.
    WaterfallSeries.prototype.generatePoints = function () {
        var point, len, i, y;
        // Parent call:
        ColumnSeries.prototype.generatePoints.apply(this);
        for (i = 0, len = this.points.length; i < len; i++) {
            point = this.points[i];
            y = this.processedYData[i];
            // override point value for sums
            // #3710 Update point does not propagate to sum
            if (point.isIntermediateSum || point.isSum) {
                point.y = correctFloat(y);
            }
        }
    };
    // Translate data points from raw values
    WaterfallSeries.prototype.translate = function () {
        var series = this, options = series.options, yAxis = series.yAxis, len, i, points, point, shapeArgs, y, yValue, previousY, previousIntermediate, range, minPointLength = pick(options.minPointLength, 5), halfMinPointLength = minPointLength / 2, threshold = options.threshold, stacking = options.stacking, tooltipY, actualStack = yAxis.waterfall.stacks[series.stackKey], actualStackX, dummyStackItem, total, pointY, yPos, hPos;
        // run column series translate
        ColumnSeries.prototype.translate.apply(series);
        previousY = previousIntermediate = threshold;
        points = series.points;
        for (i = 0, len = points.length; i < len; i++) {
            // cache current point object
            point = points[i];
            yValue = series.processedYData[i];
            shapeArgs = point.shapeArgs;
            range = [0, yValue];
            pointY = point.y;
            // code responsible for correct positions of stacked points
            // starts here
            if (stacking) {
                if (actualStack) {
                    actualStackX = actualStack[i];
                    if (stacking === 'overlap') {
                        total =
                            actualStackX.stackState[actualStackX.stateIndex--];
                        y = pointY >= 0 ? total : total - pointY;
                        if (ownProp(actualStackX, 'absolutePos')) {
                            delete actualStackX.absolutePos;
                        }
                        if (ownProp(actualStackX, 'absoluteNeg')) {
                            delete actualStackX.absoluteNeg;
                        }
                    }
                    else {
                        if (pointY >= 0) {
                            total = actualStackX.threshold +
                                actualStackX.posTotal;
                            actualStackX.posTotal -= pointY;
                            y = total;
                        }
                        else {
                            total = actualStackX.threshold +
                                actualStackX.negTotal;
                            actualStackX.negTotal -= pointY;
                            y = total - pointY;
                        }
                        if (!actualStackX.posTotal) {
                            if (ownProp(actualStackX, 'absolutePos')) {
                                actualStackX.posTotal =
                                    actualStackX.absolutePos;
                                delete actualStackX.absolutePos;
                            }
                        }
                        if (!actualStackX.negTotal) {
                            if (ownProp(actualStackX, 'absoluteNeg')) {
                                actualStackX.negTotal =
                                    actualStackX.absoluteNeg;
                                delete actualStackX.absoluteNeg;
                            }
                        }
                    }
                    if (!point.isSum) {
                        // the connectorThreshold property is later used in
                        // getCrispPath function to draw a connector line in a
                        // correct place
                        actualStackX.connectorThreshold =
                            actualStackX.threshold + actualStackX.stackTotal;
                    }
                    if (yAxis.reversed) {
                        yPos = (pointY >= 0) ? (y - pointY) : (y + pointY);
                        hPos = y;
                    }
                    else {
                        yPos = y;
                        hPos = y - pointY;
                    }
                    point.below = yPos <= pick(threshold, 0);
                    shapeArgs.y = yAxis.translate(yPos, 0, 1, 0, 1);
                    shapeArgs.height = Math.abs(shapeArgs.y -
                        yAxis.translate(hPos, 0, 1, 0, 1));
                    dummyStackItem = yAxis.waterfall.dummyStackItem;
                    if (dummyStackItem) {
                        dummyStackItem.x = i;
                        dummyStackItem.label = actualStack[i].label;
                        dummyStackItem.setOffset(series.pointXOffset || 0, series.barW || 0, series.stackedYNeg[i], series.stackedYPos[i]);
                    }
                }
            }
            else {
                // up points
                y =
                    Math.max(previousY, previousY + pointY) + range[0];
                shapeArgs.y =
                    yAxis.translate(y, 0, 1, 0, 1);
                // sum points
                if (point.isSum) {
                    shapeArgs.y = yAxis.translate(range[1], 0, 1, 0, 1);
                    shapeArgs.height = Math.min(yAxis.translate(range[0], 0, 1, 0, 1), yAxis.len) - shapeArgs.y; // #4256
                }
                else if (point.isIntermediateSum) {
                    if (pointY >= 0) {
                        yPos = range[1] + previousIntermediate;
                        hPos = previousIntermediate;
                    }
                    else {
                        yPos = previousIntermediate;
                        hPos = range[1] + previousIntermediate;
                    }
                    if (yAxis.reversed) {
                        // swapping values
                        yPos ^= hPos;
                        hPos ^= yPos;
                        yPos ^= hPos;
                    }
                    shapeArgs.y = yAxis.translate(yPos, 0, 1, 0, 1);
                    shapeArgs.height = Math.abs(shapeArgs.y -
                        Math.min(yAxis.translate(hPos, 0, 1, 0, 1), yAxis.len));
                    previousIntermediate += range[1];
                    // If it's not the sum point, update previous stack end position
                    // and get shape height (#3886)
                }
                else {
                    shapeArgs.height = yValue > 0 ?
                        yAxis.translate(previousY, 0, 1, 0, 1) - shapeArgs.y :
                        yAxis.translate(previousY, 0, 1, 0, 1) - yAxis.translate(previousY - yValue, 0, 1, 0, 1);
                    previousY += yValue;
                    point.below = previousY < pick(threshold, 0);
                }
                // #3952 Negative sum or intermediate sum not rendered correctly
                if (shapeArgs.height < 0) {
                    shapeArgs.y += shapeArgs.height;
                    shapeArgs.height *= -1;
                }
            }
            point.plotY = shapeArgs.y =
                Math.round(shapeArgs.y) - (series.borderWidth % 2) / 2;
            // #3151
            shapeArgs.height =
                Math.max(Math.round(shapeArgs.height), 0.001);
            point.yBottom = shapeArgs.y + shapeArgs.height;
            if (shapeArgs.height <= minPointLength && !point.isNull) {
                shapeArgs.height = minPointLength;
                shapeArgs.y -= halfMinPointLength;
                point.plotY = shapeArgs.y;
                if (point.y < 0) {
                    point.minPointLengthOffset = -halfMinPointLength;
                }
                else {
                    point.minPointLengthOffset = halfMinPointLength;
                }
            }
            else {
                if (point.isNull) {
                    shapeArgs.width = 0;
                }
                point.minPointLengthOffset = 0;
            }
            // Correct tooltip placement (#3014)
            tooltipY =
                point.plotY + (point.negative ? shapeArgs.height : 0);
            if (series.chart.inverted) {
                point.tooltipPos[0] = yAxis.len - tooltipY;
            }
            else {
                point.tooltipPos[1] = tooltipY;
            }
        }
    };
    // Call default processData then override yData to reflect waterfall's
    // extremes on yAxis
    WaterfallSeries.prototype.processData = function (force) {
        var series = this, options = series.options, yData = series.yData, 
        // #3710 Update point does not propagate to sum
        points = options.data, point, dataLength = yData.length, threshold = options.threshold || 0, subSum, sum, dataMin, dataMax, y, i;
        sum = subSum = dataMin = dataMax = 0;
        for (i = 0; i < dataLength; i++) {
            y = yData[i];
            point = points && points[i] ? points[i] : {};
            if (y === 'sum' || point.isSum) {
                yData[i] = correctFloat(sum);
            }
            else if (y === 'intermediateSum' ||
                point.isIntermediateSum) {
                yData[i] = correctFloat(subSum);
                subSum = 0;
            }
            else {
                sum += y;
                subSum += y;
            }
            dataMin = Math.min(sum, dataMin);
            dataMax = Math.max(sum, dataMax);
        }
        _super.prototype.processData.call(this, force);
        // Record extremes only if stacking was not set:
        if (!options.stacking) {
            series.dataMin = dataMin + threshold;
            series.dataMax = dataMax;
        }
        return;
    };
    // Return y value or string if point is sum
    WaterfallSeries.prototype.toYData = function (pt) {
        if (pt.isSum) {
            return 'sum';
        }
        if (pt.isIntermediateSum) {
            return 'intermediateSum';
        }
        return pt.y;
    };
    WaterfallSeries.prototype.updateParallelArrays = function (point, i) {
        _super.prototype.updateParallelArrays.call(this, point, i);
        // Prevent initial sums from triggering an error (#3245, #7559)
        if (this.yData[0] === 'sum' || this.yData[0] === 'intermediateSum') {
            this.yData[0] = null;
        }
    };
    // Postprocess mapping between options and SVG attributes
    WaterfallSeries.prototype.pointAttribs = function (point, state) {
        var upColor = this.options.upColor, attr;
        // Set or reset up color (#3710, update to negative)
        if (upColor && !point.options.color) {
            point.color = point.y > 0 ? upColor : null;
        }
        attr = ColumnSeries.prototype.pointAttribs.call(this, point, state);
        // The dashStyle option in waterfall applies to the graph, not
        // the points
        delete attr.dashstyle;
        return attr;
    };
    // Return an empty path initially, because we need to know the stroke-width
    // in order to set the final path.
    WaterfallSeries.prototype.getGraphPath = function () {
        return [['M', 0, 0]];
    };
    // Draw columns' connector lines
    WaterfallSeries.prototype.getCrispPath = function () {
        var data = this.data, yAxis = this.yAxis, length = data.length, graphNormalizer = Math.round(this.graph.strokeWidth()) % 2 / 2, borderNormalizer = Math.round(this.borderWidth) % 2 / 2, reversedXAxis = this.xAxis.reversed, reversedYAxis = this.yAxis.reversed, stacking = this.options.stacking, path = [], connectorThreshold, prevStack, prevStackX, prevPoint, yPos, isPos, prevArgs, pointArgs, i;
        for (i = 1; i < length; i++) {
            pointArgs = data[i].shapeArgs;
            prevPoint = data[i - 1];
            prevArgs = data[i - 1].shapeArgs;
            prevStack = yAxis.waterfall.stacks[this.stackKey];
            isPos = prevPoint.y > 0 ? -prevArgs.height : 0;
            if (prevStack && prevArgs && pointArgs) {
                prevStackX = prevStack[i - 1];
                // y position of the connector is different when series are
                // stacked, yAxis is reversed and it also depends on point's
                // value
                if (stacking) {
                    connectorThreshold = prevStackX.connectorThreshold;
                    yPos = Math.round((yAxis.translate(connectorThreshold, 0, 1, 0, 1) +
                        (reversedYAxis ? isPos : 0))) - graphNormalizer;
                }
                else {
                    yPos =
                        prevArgs.y + prevPoint.minPointLengthOffset +
                            borderNormalizer - graphNormalizer;
                }
                path.push([
                    'M',
                    (prevArgs.x || 0) + (reversedXAxis ?
                        0 :
                        (prevArgs.width || 0)),
                    yPos
                ], [
                    'L',
                    (pointArgs.x || 0) + (reversedXAxis ?
                        (pointArgs.width || 0) :
                        0),
                    yPos
                ]);
            }
            if (prevArgs &&
                path.length &&
                ((!stacking && prevPoint.y < 0 && !reversedYAxis) ||
                    (prevPoint.y > 0 && reversedYAxis))) {
                path[path.length - 2][2] += prevArgs.height;
                path[path.length - 1][2] += prevArgs.height;
            }
        }
        return path;
    };
    // The graph is initially drawn with an empty definition, then updated with
    // crisp rendering.
    WaterfallSeries.prototype.drawGraph = function () {
        LineSeries.prototype.drawGraph.call(this);
        this.graph.attr({
            d: this.getCrispPath()
        });
    };
    // Waterfall has stacking along the x-values too.
    WaterfallSeries.prototype.setStackedPoints = function () {
        var series = this, options = series.options, waterfallStacks = series.yAxis.waterfall.stacks, seriesThreshold = options.threshold, stackThreshold = seriesThreshold || 0, interSum = stackThreshold, stackKey = series.stackKey, xData = series.xData, xLength = xData.length, actualStack, actualStackX, totalYVal, actualSum, prevSum, statesLen, posTotal, negTotal, xPoint, yVal, x, alreadyChanged, changed;
        // function responsible for calculating correct values for stackState
        // array of each stack item. The arguments are: firstS - the value for
        // the first state, nextS - the difference between the previous and the
        // newest state, sInx - counter used in the for that updates each state
        // when necessary, sOff - offset that must be added to each state when
        // they need to be updated (if point isn't a total sum)
        // eslint-disable-next-line require-jsdoc
        function calculateStackState(firstS, nextS, sInx, sOff) {
            if (!statesLen) {
                actualStackX.stackState[0] = firstS;
                statesLen = actualStackX.stackState.length;
            }
            else {
                for (sInx; sInx < statesLen; sInx++) {
                    actualStackX.stackState[sInx] += sOff;
                }
            }
            actualStackX.stackState.push(actualStackX.stackState[statesLen - 1] + nextS);
        }
        series.yAxis.stacking.usePercentage = false;
        totalYVal = actualSum = prevSum = stackThreshold;
        // code responsible for creating stacks for waterfall series
        if (series.visible ||
            !series.chart.options.chart.ignoreHiddenSeries) {
            changed = waterfallStacks.changed;
            alreadyChanged = waterfallStacks.alreadyChanged;
            // in case of a redraw, stack for each x value must be
            // emptied (only for the first series in a specific stack)
            // and recalculated once more
            if (alreadyChanged &&
                alreadyChanged.indexOf(stackKey) < 0) {
                changed = true;
            }
            if (!waterfallStacks[stackKey]) {
                waterfallStacks[stackKey] = {};
            }
            actualStack = waterfallStacks[stackKey];
            for (var i = 0; i < xLength; i++) {
                x = xData[i];
                if (!actualStack[x] || changed) {
                    actualStack[x] = {
                        negTotal: 0,
                        posTotal: 0,
                        stackTotal: 0,
                        threshold: 0,
                        stateIndex: 0,
                        stackState: [],
                        label: ((changed &&
                            actualStack[x]) ?
                            actualStack[x].label :
                            void 0)
                    };
                }
                actualStackX = actualStack[x];
                yVal = series.yData[i];
                if (yVal >= 0) {
                    actualStackX.posTotal += yVal;
                }
                else {
                    actualStackX.negTotal += yVal;
                }
                // points do not exist yet, so raw data is used
                xPoint = options.data[i];
                posTotal = actualStackX.absolutePos =
                    actualStackX.posTotal;
                negTotal = actualStackX.absoluteNeg =
                    actualStackX.negTotal;
                actualStackX.stackTotal = posTotal + negTotal;
                statesLen = actualStackX.stackState.length;
                if (xPoint && xPoint.isIntermediateSum) {
                    calculateStackState(prevSum, actualSum, 0, prevSum);
                    prevSum = actualSum;
                    actualSum = seriesThreshold;
                    // swapping values
                    stackThreshold ^= interSum;
                    interSum ^= stackThreshold;
                    stackThreshold ^= interSum;
                }
                else if (xPoint && xPoint.isSum) {
                    calculateStackState(seriesThreshold, totalYVal, statesLen);
                    stackThreshold = seriesThreshold;
                }
                else {
                    calculateStackState(stackThreshold, yVal, 0, totalYVal);
                    if (xPoint) {
                        totalYVal += yVal;
                        actualSum += yVal;
                    }
                }
                actualStackX.stateIndex++;
                actualStackX.threshold = stackThreshold;
                stackThreshold += actualStackX.stackTotal;
            }
            waterfallStacks.changed = false;
            if (!waterfallStacks.alreadyChanged) {
                waterfallStacks.alreadyChanged = [];
            }
            waterfallStacks.alreadyChanged.push(stackKey);
        }
    };
    // Extremes for a non-stacked series are recorded in processData.
    // In case of stacking, use Series.stackedYData to calculate extremes.
    WaterfallSeries.prototype.getExtremes = function () {
        var stacking = this.options.stacking, yAxis, waterfallStacks, stackedYNeg, stackedYPos;
        if (stacking) {
            yAxis = this.yAxis;
            waterfallStacks = yAxis.waterfall.stacks;
            stackedYNeg = this.stackedYNeg = [];
            stackedYPos = this.stackedYPos = [];
            // the visible y range can be different when stacking is set to
            // overlap and different when it's set to normal
            if (stacking === 'overlap') {
                objectEach(waterfallStacks[this.stackKey], function (stackX) {
                    stackedYNeg.push(arrayMin(stackX.stackState));
                    stackedYPos.push(arrayMax(stackX.stackState));
                });
            }
            else {
                objectEach(waterfallStacks[this.stackKey], function (stackX) {
                    stackedYNeg.push(stackX.negTotal + stackX.threshold);
                    stackedYPos.push(stackX.posTotal + stackX.threshold);
                });
            }
            return {
                dataMin: arrayMin(stackedYNeg),
                dataMax: arrayMax(stackedYPos)
            };
        }
        // When not stacking, data extremes have already been computed in the
        // processData function.
        return {
            dataMin: this.dataMin,
            dataMax: this.dataMax
        };
    };
    /**
     * A waterfall chart displays sequentially introduced positive or negative
     * values in cumulative columns.
     *
     * @sample highcharts/demo/waterfall/
     *         Waterfall chart
     * @sample highcharts/plotoptions/waterfall-inverted/
     *         Horizontal (inverted) waterfall
     * @sample highcharts/plotoptions/waterfall-stacked/
     *         Stacked waterfall chart
     *
     * @extends      plotOptions.column
     * @excluding    boostThreshold, boostBlending
     * @product      highcharts
     * @requires     highcharts-more
     * @optionparent plotOptions.waterfall
     */
    WaterfallSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
        /**
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @apioption plotOptions.waterfall.color
         */
        /**
         * The color used specifically for positive point columns. When not
         * specified, the general series color is used.
         *
         * In styled mode, the waterfall colors can be set with the
         * `.highcharts-point-negative`, `.highcharts-sum` and
         * `.highcharts-intermediate-sum` classes.
         *
         * @sample {highcharts} highcharts/demo/waterfall/
         *         Waterfall
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highcharts
         * @apioption plotOptions.waterfall.upColor
         */
        dataLabels: {
            inside: true
        },
        /**
         * The width of the line connecting waterfall columns.
         *
         * @product highcharts
         */
        lineWidth: 1,
        /**
         * The color of the line that connects columns in a waterfall series.
         *
         * In styled mode, the stroke can be set with the `.highcharts-graph`
         * class.
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since   3.0
         * @product highcharts
         */
        lineColor: palette.neutralColor80,
        /**
         * A name for the dash style to use for the line connecting the columns
         * of the waterfall series. Possible values: Dash, DashDot, Dot,
         * LongDash, LongDashDot, LongDashDotDot, ShortDash, ShortDashDot,
         * ShortDashDotDot, ShortDot, Solid
         *
         * In styled mode, the stroke dash-array can be set with the
         * `.highcharts-graph` class.
         *
         * @type    {Highcharts.DashStyleValue}
         * @since   3.0
         * @product highcharts
         */
        dashStyle: 'Dot',
        /**
         * The color of the border of each waterfall column.
         *
         * In styled mode, the border stroke can be set with the
         * `.highcharts-point` class.
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since   3.0
         * @product highcharts
         */
        borderColor: palette.neutralColor80,
        states: {
            hover: {
                lineWidthPlus: 0 // #3126
            }
        }
    });
    return WaterfallSeries;
}(ColumnSeries));
extend(WaterfallSeries.prototype, {
    getZonesGraphs: LineSeries.prototype.getZonesGraphs,
    pointValKey: 'y',
    // Property needed to prevent lines between the columns from disappearing
    // when negativeColor is used.
    showLine: true,
    pointClass: WaterfallPoint
});
SeriesRegistry.registerSeriesType('waterfall', WaterfallSeries);
WaterfallAxis.compose(H.Axis, Chart);
/* *
 *
 * Export
 *
 * */
export default WaterfallSeries;
/**
 *
 * API Options
 *
 */
/**
 * A `waterfall` series. If the [type](#series.waterfall.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.waterfall
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.waterfall
 */
/**
 * An array of data points for the series. For the `waterfall` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 7],
 *        [1, 8],
 *        [2, 3]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.waterfall.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 8,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 8,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts
 * @apioption series.waterfall.data
 */
/**
 * When this property is true, the points acts as a summary column for
 * the values added or substracted since the last intermediate sum,
 * or since the start of the series. The `y` value is ignored.
 *
 * @sample {highcharts} highcharts/demo/waterfall/
 *         Waterfall
 *
 * @type      {boolean}
 * @default   false
 * @product   highcharts
 * @apioption series.waterfall.data.isIntermediateSum
 */
/**
 * When this property is true, the point display the total sum across
 * the entire series. The `y` value is ignored.
 *
 * @sample {highcharts} highcharts/demo/waterfall/
 *         Waterfall
 *
 * @type      {boolean}
 * @default   false
 * @product   highcharts
 * @apioption series.waterfall.data.isSum
 */
''; // adds doclets above to transpiled file
