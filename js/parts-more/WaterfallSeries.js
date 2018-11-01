/**
 * (c) 2010-2018 Torstein Honsi
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
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * A waterfall chart displays sequentially introduced positive or negative
 * values in cumulative columns.
 *
 * @sample       highcharts/demo/waterfall/
 *               Waterfall chart
 * @sample       highcharts/plotoptions/waterfall-inverted/
 *               Horizontal (inverted) waterfall
 * @sample       highcharts/plotoptions/waterfall-stacked/
 *               Stacked waterfall chart
 * @extends      {plotOptions.column}
 * @product      highcharts
 * @optionparent plotOptions.waterfall
 */
seriesType('waterfall', 'column', {

    /**
     * The color used specifically for positive point columns. When not
     * specified, the general series color is used.
     *
     * In styled mode, the waterfall colors can be set with the
     * `.highcharts-point-negative`, `.highcharts-sum` and
     * `.highcharts-intermediate-sum` classes.
     *
     * @type      {Color}
     * @sample    {highcharts} highcharts/demo/waterfall/ Waterfall
     * @product   highcharts
     * @apioption plotOptions.waterfall.upColor
     */

    dataLabels: {
        inside: true
    },
    /*= if (build.classic) { =*/

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
     * @type    {Color}
     * @default #333333
     * @since   3.0
     * @product highcharts
     */
    lineColor: '${palette.neutralColor80}',

    /**
     * A name for the dash style to use for the line connecting the columns
     * of the waterfall series. Possible values:
     *
     * *   Solid
     * *   ShortDash
     * *   ShortDot
     * *   ShortDashDot
     * *   ShortDashDotDot
     * *   Dot
     * *   Dash
     * *   LongDash
     * *   DashDot
     * *   LongDashDot
     * *   LongDashDotDot
     *
     * In styled mode, the stroke dash-array can be set with the
     * `.highcharts-graph` class.
     *
     * @type    {String}
     * @default Dot
     * @since   3.0
     * @product highcharts
     */
    dashStyle: 'dot',

    /**
     * The color of the border of each waterfall column.
     *
     * In styled mode, the border stroke can be set with the
     * `.highcharts-point` class.
     *
     * @type    {Color}
     * @default #333333
     * @since   3.0
     * @product highcharts
     */
    borderColor: '${palette.neutralColor80}',

    states: {
        hover: {
            lineWidthPlus: 0 // #3126
        }
    }
    /*= } =*/

// Prototype members
}, {
    pointValKey: 'y',

    /**
     * Property needed to prevent lines between the columns from disappearing
     * when negativeColor is used.
     */
    showLine: true,

    /**
     * After generating points, set y-values for all sums.
     */
    generatePoints: function () {
        var previousIntermediate = this.options.threshold,
            point,
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
            if (point.isSum) {
                point.y = correctFloat(y);
            } else if (point.isIntermediateSum) {
                point.y = correctFloat(y - previousIntermediate); // #3840
                previousIntermediate = y;
            }
        }
    },

    /**
     * Translate data points from raw values
     */
    translate: function () {
        var series = this,
            options = series.options,
            yAxis = series.yAxis,
            len,
            i,
            points,
            point,
            shapeArgs,
            stack,
            y,
            yValue,
            previousY,
            previousIntermediate,
            range,
            minPointLength = pick(options.minPointLength, 5),
            halfMinPointLength = minPointLength / 2,
            threshold = options.threshold,
            stacking = options.stacking,
            stackIndicator,
            tooltipY;

        // run column series translate
        seriesTypes.column.prototype.translate.apply(series);

        previousY = previousIntermediate = threshold;
        points = series.points;

        for (i = 0, len = points.length; i < len; i++) {
            // cache current point object
            point = points[i];
            yValue = series.processedYData[i];
            shapeArgs = point.shapeArgs;

            // get current stack
            stack = stacking &&
                yAxis.stacks[
                    (series.negStacks && yValue < threshold ? '-' : '') +
                        series.stackKey
                ];
            stackIndicator = series.getStackIndicator(
                stackIndicator,
                point.x,
                series.index
            );
            range = pick(
                stack && stack[point.x].points[stackIndicator.key],
                [0, yValue]
            );

            // up points
            y = Math.max(previousY, previousY + point.y) + range[0];
            shapeArgs.y = yAxis.translate(y, 0, 1, 0, 1);

            // sum points
            if (point.isSum) {
                shapeArgs.y = yAxis.translate(range[1], 0, 1, 0, 1);
                shapeArgs.height = Math.min(
                        yAxis.translate(range[0], 0, 1, 0, 1),
                        yAxis.len
                    ) - shapeArgs.y; // #4256

            } else if (point.isIntermediateSum) {
                shapeArgs.y = yAxis.translate(range[1], 0, 1, 0, 1);
                shapeArgs.height = Math.min(
                        yAxis.translate(previousIntermediate, 0, 1, 0, 1),
                        yAxis.len
                    ) - shapeArgs.y;
                previousIntermediate = range[1];

            // If it's not the sum point, update previous stack end position
            // and get shape height (#3886)
            } else {
                shapeArgs.height = yValue > 0 ?
                    yAxis.translate(previousY, 0, 1, 0, 1) - shapeArgs.y :
                    yAxis.translate(previousY, 0, 1, 0, 1) -
                        yAxis.translate(previousY - yValue, 0, 1, 0, 1);

                previousY += stack && stack[point.x] ?
                    stack[point.x].total :
                    yValue;

                point.below = previousY < pick(threshold, 0);
            }

            // #3952 Negative sum or intermediate sum not rendered correctly
            if (shapeArgs.height < 0) {
                shapeArgs.y += shapeArgs.height;
                shapeArgs.height *= -1;
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

    /**
     * Call default processData then override yData to reflect
     * waterfall's extremes on yAxis
     */
    processData: function (force) {
        var series = this,
            options = series.options,
            yData = series.yData,
            // #3710 Update point does not propagate to sum
            points = series.options.data,
            point,
            dataLength = yData.length,
            threshold = options.threshold || 0,
            subSum,
            sum,
            dataMin,
            dataMax,
            y,
            i;

        sum = subSum = dataMin = dataMax = threshold;

        for (i = 0; i < dataLength; i++) {
            y = yData[i];
            point = points && points[i] ? points[i] : {};

            if (y === 'sum' || point.isSum) {
                yData[i] = correctFloat(sum);
            } else if (y === 'intermediateSum' || point.isIntermediateSum) {
                yData[i] = correctFloat(subSum);
            } else {
                sum += y;
                subSum += y;
            }
            dataMin = Math.min(sum, dataMin);
            dataMax = Math.max(sum, dataMax);
        }

        Series.prototype.processData.call(this, force);

        // Record extremes only if stacking was not set:
        if (!series.options.stacking) {
            series.dataMin = dataMin;
            series.dataMax = dataMax;
        }
    },

    /**
     * Return y value or string if point is sum
     */
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

    /*= if (build.classic) { =*/
    /**
     * Postprocess mapping between options and SVG attributes
     */
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
    /*= } =*/

    /**
     * Return an empty path initially, because we need to know the
     * stroke-width in order to set the final path.
     */
    getGraphPath: function () {
        return ['M', 0, 0];
    },

    /**
     * Draw columns' connector lines
     */
    getCrispPath: function () {

        var data = this.data,
            length = data.length,
            lineWidth = this.graph.strokeWidth() + this.borderWidth,
            normalizer = Math.round(lineWidth) % 2 / 2,
            reversedXAxis = this.xAxis.reversed,
            reversedYAxis = this.yAxis.reversed,
            path = [],
            prevArgs,
            pointArgs,
            i,
            d;

        for (i = 1; i < length; i++) {
            pointArgs = data[i].shapeArgs;
            prevArgs = data[i - 1].shapeArgs;

            d = [
                'M',
                prevArgs.x + (reversedXAxis ? 0 : prevArgs.width),
                prevArgs.y + data[i - 1].minPointLengthOffset + normalizer,
                'L',
                pointArgs.x + (reversedXAxis ? prevArgs.width : 0),
                prevArgs.y + data[i - 1].minPointLengthOffset + normalizer
            ];

            if (
                (data[i - 1].y < 0 && !reversedYAxis) ||
                (data[i - 1].y > 0 && reversedYAxis)
            ) {
                d[2] += prevArgs.height;
                d[5] += prevArgs.height;
            }

            path = path.concat(d);
        }

        return path;
    },

    /**
     * The graph is initially drawn with an empty definition, then updated with
     * crisp rendering.
     */
    drawGraph: function () {
        Series.prototype.drawGraph.call(this);
        this.graph.attr({
            d: this.getCrispPath()
        });
    },

    /**
     * Waterfall has stacking along the x-values too.
     */
    setStackedPoints: function () {
        var series = this,
            options = series.options,
            stackedYLength,
            i;

        Series.prototype.setStackedPoints.apply(series, arguments);

        stackedYLength = series.stackedYData ? series.stackedYData.length : 0;

        // Start from the second point:
        for (i = 1; i < stackedYLength; i++) {
            if (
                !options.data[i].isSum &&
                !options.data[i].isIntermediateSum
            ) {
                // Sum previous stacked data as waterfall can grow up/down:
                series.stackedYData[i] += series.stackedYData[i - 1];
            }
        }
    },

    /**
     * Extremes for a non-stacked series are recorded in processData.
     * In case of stacking, use Series.stackedYData to calculate extremes.
     */
    getExtremes: function () {
        if (this.options.stacking) {
            return Series.prototype.getExtremes.apply(this, arguments);
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
    /**
     * Pass the null test in ColumnSeries.translate.
     */
    isValid: function () {
        return isNumber(this.y, true) || this.isSum || this.isIntermediateSum;
    }

});

/**
 * A `waterfall` series. If the [type](#series.waterfall.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.waterfall
 * @excluding dataParser,dataURL
 * @product   highcharts
 * @apioption series.waterfall
 */

/**
 * An array of data points for the series. For the `waterfall` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 7],
 *         [1, 8],
 *         [2, 3]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series'
 * [turboThreshold](#series.waterfall.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 8,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 8,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array|Number>}
 * @extends   series.line.data
 * @excluding marker
 * @sample    {highcharts} highcharts/chart/reflow-true/
 *            Numerical values
 * @sample    {highcharts} highcharts/series/data-array-of-arrays/
 *            Arrays of numeric x and y
 * @sample    {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *            Arrays of datetime x and y
 * @sample    {highcharts} highcharts/series/data-array-of-name-value/
 *            Arrays of point.name and y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts
 * @apioption series.waterfall.data
 */


/**
 * When this property is true, the points acts as a summary column for
 * the values added or substracted since the last intermediate sum,
 * or since the start of the series. The `y` value is ignored.
 *
 * @type      {Boolean}
 * @sample    {highcharts} highcharts/demo/waterfall/ Waterfall
 * @default   false
 * @product   highcharts
 * @apioption series.waterfall.data.isIntermediateSum
 */

/**
 * When this property is true, the point display the total sum across
 * the entire series. The `y` value is ignored.
 *
 * @type      {Boolean}
 * @sample    {highcharts} highcharts/demo/waterfall/ Waterfall
 * @default   false
 * @product   highcharts
 * @apioption series.waterfall.data.isSum
 */
