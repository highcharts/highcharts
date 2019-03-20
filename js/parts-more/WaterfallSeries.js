/* *
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
import '../parts/Point.js';

var correctFloat = H.correctFloat,
    isNumber = H.isNumber,
    pick = H.pick,
    objectEach = H.objectEach,
    arrayMin = H.arrayMin,
    arrayMax = H.arrayMax,
    addEvent = H.addEvent,
    Axis = H.Axis,
    Chart = H.Chart,
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

addEvent(Axis, 'afterInit', function () {
    if (!this.isXAxis) {
        this.waterfallStacks = {};
    }
});

addEvent(Chart, 'beforeRedraw', function () {
    var axes = this.axes,
        series = this.series,
        i = series.length;

    while (i--) {
        if (series[i].options.stacking) {
            axes.forEach(function (axis) {
                if (!axis.isXAxis) {
                    axis.waterfallStacks = {};
                }
            });
            i = 0;
        }
    }
});

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
 * @product      highcharts
 * @optionparent plotOptions.waterfall
 */
seriesType('waterfall', 'column', {

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
        /** @ignore-option */
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
     * In styled mode, the stroke can be set with the `.highcharts-graph` class.
     *
     * @type    {Highcharts.ColorString}
     * @since   3.0
     * @product highcharts
     */
    lineColor: '${palette.neutralColor80}',

    /**
     * A name for the dash style to use for the line connecting the columns
     * of the waterfall series. Possible values: Dash, DashDot, Dot, LongDash,
     * LongDashDot, LongDashDotDot, ShortDash, ShortDashDot, ShortDashDotDot,
     * ShortDot, Solid
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
     * @type    {Highcharts.ColorString}
     * @since   3.0
     * @product highcharts
     */
    borderColor: '${palette.neutralColor80}',

    states: {
        hover: {
            lineWidthPlus: 0 // #3126
        }
    }

// Prototype members
}, {
    pointValKey: 'y',

    // Property needed to prevent lines between the columns from disappearing
    // when negativeColor is used.
    showLine: true,

    // After generating points, set y-values for all sums.
    generatePoints: function () {
        var point,
            len,
            i,
            y;

        // Parent call:
        seriesTypes.column.prototype.generatePoints.apply(this);

        for (i = 0, len = this.points.length; i < len; i++) {
            point = this.points[i];
            y = this.processedYData[i];
            // override point value for sums
            // #3710 Update point does not propagate to sum
            if (point.isIntermediateSum || point.isSum) {
                point.y = correctFloat(y);
            }
        }
    },

    // Translate data points from raw values
    translate: function () {
        var series = this,
            options = series.options,
            yAxis = series.yAxis,
            len,
            i,
            points,
            point,
            shapeArgs,
            y,
            yValue,
            previousY,
            previousIntermediate,
            range,
            minPointLength = pick(options.minPointLength, 5),
            halfMinPointLength = minPointLength / 2,
            threshold = options.threshold,
            stacking = options.stacking,
            tooltipY,
            actualStack = yAxis.waterfallStacks[series.stackKey],
            actualStackX,
            total,
            pointY,
            yPos,
            hPos;

        // run column series translate
        seriesTypes.column.prototype.translate.apply(series);

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
                        total = actualStackX.threshold + actualStackX.total;
                        actualStackX.total -= pointY;

                        y = pointY >= 0 ? total : total - pointY;
                    } else {
                        if (pointY >= 0) {
                            total = actualStackX.threshold +
                                actualStackX.posTotal;

                            actualStackX.posTotal -= pointY;
                            y = total;
                        } else {
                            total = actualStackX.threshold +
                                actualStackX.negTotal;

                            actualStackX.negTotal -= pointY;
                            y = total - pointY;
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
                    } else {
                        yPos = y;
                        hPos = y - pointY;
                    }

                    point.below = yPos <= pick(threshold, 0);

                    shapeArgs.y = yAxis.translate(yPos, 0, 1, 0, 1);
                    shapeArgs.height = Math.abs(shapeArgs.y -
                        yAxis.translate(hPos, 0, 1, 0, 1));
                }
            } else {
                // up points
                y = Math.max(previousY, previousY + pointY) + range[0];
                shapeArgs.y = yAxis.translate(y, 0, 1, 0, 1);

                // sum points
                if (point.isSum) {
                    shapeArgs.y = yAxis.translate(range[1], 0, 1, 0, 1);
                    shapeArgs.height = Math.min(
                        yAxis.translate(range[0], 0, 1, 0, 1),
                        yAxis.len
                    ) - shapeArgs.y; // #4256

                } else if (point.isIntermediateSum) {
                    if (pointY >= 0) {
                        yPos = range[1] + previousIntermediate;
                        hPos = previousIntermediate;
                    } else {
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
                    shapeArgs.height = Math.abs(shapeArgs.y - Math.min(
                        yAxis.translate(hPos, 0, 1, 0, 1),
                        yAxis.len
                    ));

                    previousIntermediate += range[1];

                // If it's not the sum point, update previous stack end position
                // and get shape height (#3886)
                } else {
                    shapeArgs.height = yValue > 0 ?
                        yAxis.translate(previousY, 0, 1, 0, 1) - shapeArgs.y :
                        yAxis.translate(previousY, 0, 1, 0, 1) -
                            yAxis.translate(previousY - yValue, 0, 1, 0, 1);

                    previousY += yValue;
                    point.below = previousY < pick(threshold, 0);
                }

                // #3952 Negative sum or intermediate sum not rendered correctly
                if (shapeArgs.height < 0) {
                    shapeArgs.y += shapeArgs.height;
                    shapeArgs.height *= -1;
                }
            }

            point.plotY = shapeArgs.y = Math.round(shapeArgs.y) -
                (series.borderWidth % 2) / 2;
            // #3151
            shapeArgs.height = Math.max(Math.round(shapeArgs.height), 0.001);
            point.yBottom = shapeArgs.y + shapeArgs.height;

            if (shapeArgs.height <= minPointLength && !point.isNull) {
                shapeArgs.height = minPointLength;
                shapeArgs.y -= halfMinPointLength;
                point.plotY = shapeArgs.y;
                if (point.y < 0) {
                    point.minPointLengthOffset = -halfMinPointLength;
                } else {
                    point.minPointLengthOffset = halfMinPointLength;
                }
            } else {
                if (point.isNull) {
                    shapeArgs.width = 0;
                }
                point.minPointLengthOffset = 0;
            }

            // Correct tooltip placement (#3014)
            tooltipY = point.plotY + (point.negative ? shapeArgs.height : 0);

            if (series.chart.inverted) {
                point.tooltipPos[0] = yAxis.len - tooltipY;
            } else {
                point.tooltipPos[1] = tooltipY;
            }
        }
    },

    // Call default processData then override yData to reflect waterfall's
    // extremes on yAxis
    processData: function (force) {
        var series = this,
            options = series.options,
            yData = series.yData,
            // #3710 Update point does not propagate to sum
            points = options.data,
            point,
            dataLength = yData.length,
            threshold = options.threshold || 0,
            subSum,
            sum,
            dataMin,
            dataMax,
            y,
            i;

        sum = subSum = dataMin = dataMax = 0;

        for (i = 0; i < dataLength; i++) {
            y = yData[i];
            point = points && points[i] ? points[i] : {};

            if (y === 'sum' || point.isSum) {
                yData[i] = correctFloat(sum);
            } else if (y === 'intermediateSum' || point.isIntermediateSum) {
                yData[i] = correctFloat(subSum);
                subSum = 0;
            } else {
                sum += y;
                subSum += y;
            }
            dataMin = Math.min(sum, dataMin);
            dataMax = Math.max(sum, dataMax);
        }

        Series.prototype.processData.call(this, force);

        // Record extremes only if stacking was not set:
        if (!options.stacking) {
            series.dataMin = dataMin + threshold;
            series.dataMax = dataMax;
        }
    },

    // Return y value or string if point is sum
    toYData: function (pt) {
        if (pt.isSum) {
            // #3245 Error when first element is Sum or Intermediate Sum
            return (pt.x === 0 ? null : 'sum');
        }
        if (pt.isIntermediateSum) {
            return (pt.x === 0 ? null : 'intermediateSum'); // #3245
        }
        return pt.y;
    },

    // Postprocess mapping between options and SVG attributes
    pointAttribs: function (point, state) {

        var upColor = this.options.upColor,
            attr;

        // Set or reset up color (#3710, update to negative)
        if (upColor && !point.options.color) {
            point.color = point.y > 0 ? upColor : null;
        }

        attr = seriesTypes.column.prototype.pointAttribs.call(
            this,
            point,
            state
        );

        // The dashStyle option in waterfall applies to the graph, not
        // the points
        delete attr.dashstyle;

        return attr;
    },

    // Return an empty path initially, because we need to know the stroke-width
    // in order to set the final path.
    getGraphPath: function () {
        return ['M', 0, 0];
    },

    // Draw columns' connector lines
    getCrispPath: function () {

        var data = this.data,
            yAxis = this.yAxis,
            length = data.length,
            graphNormalizer = Math.round(this.graph.strokeWidth()) % 2 / 2,
            borderNormalizer = Math.round(this.borderWidth) % 2 / 2,
            reversedXAxis = this.xAxis.reversed,
            reversedYAxis = this.yAxis.reversed,
            stacking = this.options.stacking,
            path = [],
            connectorThreshold,
            prevStack,
            prevStackX,
            prevPoint,
            yPos,
            isPos,
            prevArgs,
            pointArgs,
            i,
            d;

        for (i = 1; i < length; i++) {
            pointArgs = data[i].shapeArgs;
            prevPoint = data[i - 1];
            prevArgs = data[i - 1].shapeArgs;
            prevStack = yAxis.waterfallStacks[this.stackKey];
            isPos = prevPoint.y > 0 ? -prevArgs.height : 0;

            if (prevStack) {
                prevStackX = prevStack[i - 1];

                // y position of the connector is different when series are
                // stacked, yAxis is reversed and it also depends on point's
                // value
                if (stacking) {
                    connectorThreshold = prevStackX.connectorThreshold;

                    yPos = Math.round(
                        (yAxis.translate(connectorThreshold, 0, 1, 0, 1) +
                        (reversedYAxis ? isPos : 0))
                    ) - graphNormalizer;
                } else {
                    yPos = prevArgs.y + prevPoint.minPointLengthOffset +
                        borderNormalizer - graphNormalizer;
                }

                d = [
                    'M',
                    prevArgs.x + (reversedXAxis ? 0 : prevArgs.width),
                    yPos,
                    'L',
                    pointArgs.x + (reversedXAxis ? pointArgs.width : 0),
                    yPos
                ];
            }

            if (
                !stacking &&
                (prevPoint.y < 0 && !reversedYAxis) ||
                (prevPoint.y > 0 && reversedYAxis)
            ) {
                d[2] += prevArgs.height;
                d[5] += prevArgs.height;
            }

            path = path.concat(d);
        }

        return path;
    },

    // The graph is initially drawn with an empty definition, then updated with
    // crisp rendering.
    drawGraph: function () {
        Series.prototype.drawGraph.call(this);
        this.graph.attr({
            d: this.getCrispPath()
        });
    },

    // Waterfall has stacking along the x-values too.
    setStackedPoints: function () {
        var series = this,
            options = series.options,
            waterfallStacks = series.yAxis.waterfallStacks,
            seriesThreshold = options.threshold,
            stackThreshold = seriesThreshold || 0,
            interSum = seriesThreshold || 0,
            stackKey = series.stackKey,
            xData = series.xData,
            xLength = xData.length,
            actualStack,
            actualStackX,
            posTotal,
            negTotal,
            xPoint,
            yVal,
            x;

        // code responsible for creating stacks for waterfall series
        if (series.visible || !series.chart.options.chart.ignoreHiddenSeries) {
            if (!waterfallStacks[stackKey]) {
                waterfallStacks[stackKey] = {};
            }

            actualStack = waterfallStacks[stackKey];

            for (var i = 0; i < xLength; i++) {
                x = xData[i];

                if (!actualStack[x]) {
                    actualStack[x] = {
                        negTotal: 0,
                        posTotal: 0,
                        total: 0,
                        stackTotal: 0,
                        threshold: 0,
                        stackState: [stackThreshold]
                    };
                }

                actualStackX = actualStack[x];
                yVal = series.yData[i];

                if (yVal >= 0) {
                    actualStackX.posTotal += yVal;
                } else {
                    actualStackX.negTotal += yVal;
                }

                // points do not exist yet, so raw data is used
                xPoint = options.data[i];
                posTotal = actualStackX.posTotal;
                negTotal = actualStackX.negTotal;

                if (xPoint && xPoint.isIntermediateSum) {
                    // swapping values
                    stackThreshold ^= interSum;
                    interSum ^= stackThreshold;
                    stackThreshold ^= interSum;
                } else if (xPoint && xPoint.isSum) {
                    stackThreshold = seriesThreshold;
                }

                actualStackX.stackTotal = posTotal + negTotal;
                actualStackX.total = actualStackX.stackTotal;
                actualStackX.threshold = stackThreshold;

                actualStackX.stackState[0] = stackThreshold;
                actualStackX.stackState.push(actualStackX.stackTotal);

                stackThreshold += actualStackX.stackTotal;
            }
        }
    },

    // Extremes for a non-stacked series are recorded in processData.
    // In case of stacking, use Series.stackedYData to calculate extremes.
    getExtremes: function () {
        var stacking = this.options.stacking,
            yAxis,
            waterfallStacks,
            stackedYNeg,
            stackedYPos,
            states,
            firstState;

        if (stacking) {
            yAxis = this.yAxis;
            waterfallStacks = yAxis.waterfallStacks;
            stackedYNeg = this.stackedYNeg = [];
            stackedYPos = this.stackedYPos = [];

            // the visible y range can be different when stacking is set to
            // overlap and different when it's set to normal
            if (stacking === 'overlap') {
                objectEach(waterfallStacks[this.stackKey], function (stackX) {

                    states = [];
                    stackX.stackState.forEach(function (state, stateIndex) {
                        firstState = stackX.stackState[0];

                        if (stateIndex) {
                            states.push(state + firstState);
                        } else {
                            states.push(firstState);
                        }
                    });

                    stackedYNeg.push(arrayMin(states));
                    stackedYPos.push(arrayMax(states));
                });
            } else {
                objectEach(waterfallStacks[this.stackKey], function (stackX) {
                    stackedYNeg.push(stackX.negTotal + stackX.threshold);
                    stackedYPos.push(stackX.posTotal + stackX.threshold);
                });
            }

            this.dataMin = arrayMin(stackedYNeg);
            this.dataMax = arrayMax(stackedYPos);
        }
    }


// Point members
}, {
    getClassName: function () {
        var className = Point.prototype.getClassName.call(this);

        if (this.isSum) {
            className += ' highcharts-sum';
        } else if (this.isIntermediateSum) {
            className += ' highcharts-intermediate-sum';
        }
        return className;
    },
    // Pass the null test in ColumnSeries.translate.
    isValid: function () {
        return isNumber(this.y, true) || this.isSum || this.isIntermediateSum;
    }

});

/**
 * A `waterfall` series. If the [type](#series.waterfall.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.waterfall
 * @excluding dataParser, dataURL
 * @product   highcharts
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
