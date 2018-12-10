/* *
 *
 *  (c) 2010-2018 Grzegorz Blachlinski, Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Color.js';
import '../parts/Point.js';
import '../parts/Series.js';


var seriesType = H.seriesType,
    defined = H.defined;

/**
 * Packed bubble series
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.packedbubble
 *
 * @augments Highcharts.Series
 *
 * @requires modules:highcharts-more
 */
seriesType('packedbubble', 'bubble',

    /**
     * A packed bubble series is a two dimensional series type, where each point
     * renders a value in X, Y position. Each point is drawn as a bubble where
     * the bubbles don't overlap with each other and the radius of the bubble
     * related to the value. Requires `highcharts-more.js`.
     *
     * @sample {highcharts} highcharts/demo/packed-bubble/
     *         Packed-bubble chart
     *
     * @extends      plotOptions.bubble
     * @since        7.0.0
     * @product      highcharts
     * @excluding    connectEnds, connectNulls, keys, maxSize, minSize, sizeBy,
     *               sizeByAbsoluteValue, step, zMax, zMin
     * @optionparent plotOptions.packedbubble
     */
    {
        /**
         * Minimum bubble size. Bubbles will automatically size between the
         * `minSize` and `maxSize` to reflect the `z` value of each bubble.
         * Can be either pixels (when no unit is given), or a percentage of
         * the smallest one of the plot width and height.
         *
         * @sample {highcharts} highcharts/plotoptions/bubble-size/
         *         Bubble size
         *
         * @type    {number|string}
         * @since   3.0
         * @product highcharts highstock
         */
        minSize: '10%',
        /**
         * Maximum bubble size. Bubbles will automatically size between the
         * `minSize` and `maxSize` to reflect the `z` value of each bubble.
         * Can be either pixels (when no unit is given), or a percentage of
         * the smallest one of the plot width and height.
         *
         * @sample {highcharts} highcharts/plotoptions/bubble-size/
         *         Bubble size
         *
         * @type    {number|string}
         * @since   3.0
         * @product highcharts highstock
         */
        maxSize: '100%',
        sizeBy: 'radius',
        zoneAxis: 'y',
        tooltip: {
            pointFormat: 'Value: {point.value}'
        }
    }, {
        pointArrayMap: ['value'],
        pointValKey: 'value',
        isCartesian: false,
        axisTypes: [],
        /**
         * Create a single array of all points from all series
         * @private
         * @param {Array} Array of all series objects
         * @return {Array} Returns the array of all points.
         */
        accumulateAllPoints: function (series) {

            var chart = series.chart,
                allDataPoints = [],
                i, j;

            for (i = 0; i < chart.series.length; i++) {

                series = chart.series[i];

                if (series.visible || !chart.options.chart.ignoreHiddenSeries) {

                    // add data to array only if series is visible
                    for (j = 0; j < series.yData.length; j++) {
                        allDataPoints.push([
                            null, null,
                            series.yData[j],
                            series.index,
                            j
                        ]);
                    }
                }
            }

            return allDataPoints;
        },
        // Extend the base translate method to handle bubble size, and correct
        // positioning them.
        translate: function () {

            var positions, // calculated positions of bubbles in bubble array
                series = this,
                chart = series.chart,
                data = series.data,
                index = series.index,
                point,
                radius,
                i;

            this.processedXData = this.xData;
            this.generatePoints();

            // merged data is an array with all of the data from all series
            if (!defined(chart.allDataPoints)) {
                chart.allDataPoints = series.accumulateAllPoints(series);

                // calculate radius for all added data
                series.getPointRadius();
            }

            // after getting initial radius, calculate bubble positions
            positions = this.placeBubbles(chart.allDataPoints);

            // Set the shape type and arguments to be picked up in drawPoints
            for (i = 0; i < positions.length; i++) {

                if (positions[i][3] === index) {

                    // update the series points with the values from positions
                    // array
                    point = data[positions[i][4]];
                    radius = positions[i][2];
                    point.plotX = positions[i][0] - chart.plotLeft +
                      chart.diffX;
                    point.plotY = positions[i][1] - chart.plotTop +
                      chart.diffY;

                    point.marker = H.extend(point.marker, {
                        radius: radius,
                        width: 2 * radius,
                        height: 2 * radius
                    });
                }
            }
        },
        /**
         * Check if two bubbles overlaps.
         * @private
         * @param {Array} bubble1 first bubble
         * @param {Array} bubble2 second bubble
         * @return {boolean} overlap or not
         */
        checkOverlap: function (bubble1, bubble2) {
            var diffX = bubble1[0] - bubble2[0], // diff of X center values
                diffY = bubble1[1] - bubble2[1], // diff of Y center values
                sumRad = bubble1[2] + bubble2[2]; // sum of bubble radius

            return (
                Math.sqrt(diffX * diffX + diffY * diffY) -
                Math.abs(sumRad)
            ) < -0.001;
        },
        /**
         * Function that is adding one bubble based on positions and sizes
         * of two other bubbles, lastBubble is the last added bubble,
         * newOrigin is the bubble for positioning new bubbles.
         * nextBubble is the curently added bubble for which we are
         * calculating positions
         * @private
         * @param {Array} lastBubble The closest last bubble
         * @param {Array} newOrigin New bubble
         * @param {Array} nextBubble The closest next bubble
         * @return {Array} Bubble with correct positions
         */
        positionBubble: function (lastBubble, newOrigin, nextBubble) {
            var sqrt = Math.sqrt,
                asin = Math.asin,
                acos = Math.acos,
                pow = Math.pow,
                abs = Math.abs,
                distance = sqrt( // dist between lastBubble and newOrigin
                  pow((lastBubble[0] - newOrigin[0]), 2) +
                  pow((lastBubble[1] - newOrigin[1]), 2)
                ),
                alfa = acos(
                  // from cosinus theorem: alfa is an angle used for
                  // calculating correct position
                  (
                    pow(distance, 2) +
                    pow(nextBubble[2] + newOrigin[2], 2) -
                    pow(nextBubble[2] + lastBubble[2], 2)
                  ) / (2 * (nextBubble[2] + newOrigin[2]) * distance)
                ),

                beta = asin( // from sinus theorem.
                  abs(lastBubble[0] - newOrigin[0]) /
                  distance
                ),
                // providing helping variables, related to angle between
                // lastBubble and newOrigin
                gamma = (lastBubble[1] - newOrigin[1]) < 0 ? 0 : Math.PI,
                // if new origin y is smaller than last bubble y value
                // (2 and 3 quarter),
                // add Math.PI to final angle

                delta = (lastBubble[0] - newOrigin[0]) *
                (lastBubble[1] - newOrigin[1]) < 0 ?
                1 : -1, // (1st and 3rd quarter)
                finalAngle = gamma + alfa + beta * delta,
                cosA = Math.cos(finalAngle),
                sinA = Math.sin(finalAngle),
                posX = newOrigin[0] + (newOrigin[2] + nextBubble[2]) * sinA,
                // center of new origin + (radius1 + radius2) * sinus A
                posY = newOrigin[1] - (newOrigin[2] + nextBubble[2]) * cosA;

            return [
                posX,
                posY,
                nextBubble[2],
                nextBubble[3],
                nextBubble[4]
            ]; // the same as described before
        },
        /**
         * This is the main function responsible for positioning all of the
         * bubbles.
         * allDataPoints - bubble array, in format [pixel x value,
         * pixel y value, radius, related series index, related point index]
         * @private
         * @param {Array} allDataPoints All points from all series
         * @return {Array} Positions of all bubbles
         */
        placeBubbles: function (allDataPoints) {

            var series = this,
                checkOverlap = series.checkOverlap,
                positionBubble = series.positionBubble,
                bubblePos = [],
                stage = 1,
                j = 0,
                k = 0,
                calculatedBubble,
                sortedArr,
                i;

            // sort all points
            sortedArr = allDataPoints.sort(function (a, b) {
                return b[2] - a[2];
            });

            // if length is 0, return empty array
            if (!sortedArr.length) {
                return [];
            } else if (sortedArr.length < 2) {
                // if length is 1,return only one bubble
                return [
                    0, 0,
                    sortedArr[0][0],
                    sortedArr[0][1],
                    sortedArr[0][2]
                ];
            }

            // create first bubble in the middle of the chart
            bubblePos.push([
                [
                    0, // starting in 0,0 coordinates
                    0,
                    sortedArr[0][2], // radius
                    sortedArr[0][3], // series index
                    sortedArr[0][4]
                ] // point index
            ]); // 0 level bubble

            bubblePos.push([
                [
                    0,
                    0 - sortedArr[1][2] - sortedArr[0][2],
                    // move bubble above first one
                    sortedArr[1][2],
                    sortedArr[1][3],
                    sortedArr[1][4]
                ]
            ]); // 1 level 1st bubble

            // first two already positioned so starting from 2
            for (i = 2; i < sortedArr.length; i++) {
                sortedArr[i][2] = sortedArr[i][2] || 1;
                // in case if radius is calculated as 0.

                calculatedBubble = positionBubble(
                    bubblePos[stage][j],
                    bubblePos[stage - 1][k],
                    sortedArr[i]
                ); // calculate initial bubble position

                if (checkOverlap(calculatedBubble, bubblePos[stage][0])) {
                    // if new bubble is overlapping with first bubble in
                    // current level (stage)
                    bubblePos.push([]);
                    k = 0;
                    // reset index of bubble, used for positioning the bubbles
                    // around it, we are starting from first bubble in next
                    // stage because we are changing level to higher
                    bubblePos[stage + 1].push(
                      positionBubble(
                        bubblePos[stage][j],
                        bubblePos[stage][0],
                        sortedArr[i]
                      )
                    );
                    // (last added bubble, 1st. bbl from cur stage, new bubble)
                    stage++; // the new level is created, above current one
                    j = 0; // set the index of bubble in current level to 0
                } else if (
                    stage > 1 && bubblePos[stage - 1][k + 1] &&
                    checkOverlap(calculatedBubble, bubblePos[stage - 1][k + 1])
                ) {
                    // If new bubble is overlapping with one of the previous
                    // stage bubbles, it means that - bubble, used for
                    // positioning the bubbles around it has changed so we need
                    // to recalculate it.
                    k++;
                    bubblePos[stage].push(
                      positionBubble(bubblePos[stage][j],
                        bubblePos[stage - 1][k],
                        sortedArr[i]
                      ));
                    // (last added bubble, previous stage bubble, new bubble)
                    j++;
                } else { // simply add calculated bubble
                    j++;
                    bubblePos[stage].push(calculatedBubble);
                }
            }
            series.chart.stages = bubblePos;
            // it may not be necessary but adding it just in case -
            // it is containing all of the bubble levels

            series.chart.rawPositions = [].concat.apply([], bubblePos);
            // bubble positions merged into one array

            series.resizeRadius();

            return series.chart.rawPositions;
        },
        /**
         * The function responsible for resizing the bubble radius.
         * In shortcut: it is taking the initially
         * calculated positions of bubbles. Then it is calculating the min max
         * of both dimensions, creating something in shape of bBox.
         * The comparison of bBox and the size of plotArea
         * (later it may be also the size set by customer) is giving the
         * value how to recalculate the radius so it will match the size
         * @private
         */
        resizeRadius: function () {

            var chart = this.chart,
                positions = chart.rawPositions,
                min = Math.min,
                max = Math.max,
                plotLeft = chart.plotLeft,
                plotTop = chart.plotTop,
                chartHeight = chart.plotHeight,
                chartWidth = chart.plotWidth,
                minX, maxX, minY, maxY,
                radius,
                bBox,
                spaceRatio,
                smallerDimension,
                i;

            minX = minY = Number.POSITIVE_INFINITY; // set initial values
            maxX = maxY = Number.NEGATIVE_INFINITY;

            for (i = 0; i < positions.length; i++) {
                radius = positions[i][2];
                minX = min(minX, positions[i][0] - radius);
                // (x center-radius) is the min x value used by specific bubble
                maxX = max(maxX, positions[i][0] + radius);
                minY = min(minY, positions[i][1] - radius);
                maxY = max(maxY, positions[i][1] + radius);
            }

            bBox = [maxX - minX, maxY - minY];
            spaceRatio = [
                (chartWidth - plotLeft) / bBox[0],
                (chartHeight - plotTop) / bBox[1]
            ];

            smallerDimension = min.apply([], spaceRatio);

            if (Math.abs(smallerDimension - 1) > 1e-10) {
                // if bBox is considered not the same width as possible size
                for (i = 0; i < positions.length; i++) {
                    positions[i][2] *= smallerDimension;
                }
                this.placeBubbles(positions);
            } else {
                // If no radius recalculation is needed, we need to position the
                // whole bubbles in center of chart plotarea for this, we are
                // adding two parameters, diffY and diffX, that are related to
                // differences between the initial center and the bounding box.
                chart.diffY = chartHeight / 2 +
                    plotTop - minY - (maxY - minY) / 2;
                chart.diffX = chartWidth / 2 +
                    plotLeft - minX - (maxX - minX) / 2;
            }
        },

        // Calculate radius of bubbles in series.
        getPointRadius: function () { // bubbles array

            var series = this,
                chart = series.chart,
                plotWidth = chart.plotWidth,
                plotHeight = chart.plotHeight,
                seriesOptions = series.options,
                smallestSize = Math.min(plotWidth, plotHeight),
                extremes = {},
                radii = [],
                allDataPoints = chart.allDataPoints,
                minSize,
                maxSize,
                value,
                radius;

            ['minSize', 'maxSize'].forEach(function (prop) {
                var length = parseInt(seriesOptions[prop], 10),
                    isPercent = /%$/.test(length);

                extremes[prop] = isPercent ?
                    smallestSize * length / 100 :
                    length;
            });

            chart.minRadius = minSize = extremes.minSize;
            chart.maxRadius = maxSize = extremes.maxSize;

            (allDataPoints || []).forEach(function (point, i) {

                value = point[2];

                radius = series.getRadius(
                    minSize,
                    maxSize,
                    minSize,
                    maxSize,
                    value
                );

                if (value === 0) {
                    radius = null;
                }

                allDataPoints[i][2] = radius;
                radii.push(radius);
            });

            this.radii = radii;
        },

        alignDataLabel: H.Series.prototype.alignDataLabel
    }
);

// When one series is modified, the others need to be recomputed
H.addEvent(H.seriesTypes.packedbubble, 'updatedData', function () {
    var self = this;
    this.chart.series.forEach(function (s) {
        if (s.type === self.type) {
            s.isDirty = true;
        }
    });
});

// Remove accumulated data points to redistribute all of them again
// (i.e after hiding series by legend)
H.addEvent(H.Chart, 'beforeRedraw', function () {
    if (this.allDataPoints) {
        delete this.allDataPoints;
    }
});

/**
 * A `packedbubble` series. If the [type](#series.packedbubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.packedbubble
 * @excluding dataParser, dataURL, stack
 * @product   highcharts highstock
 * @apioption series.packedbubble
 */

/**
 * An array of data points for the series. For the `packedbubble` series type,
 * points can be given in the following ways:
 *
 * 1. An array of `y` values.
 *    ```js
 *    data: [5, 1, 20]
 *    ```
 *
 * 2. An array of objects with named values. The objects are point configuration
 *    objects as seen below. If the total number of data points exceeds the
 *    series' [turboThreshold](#series.packedbubble.turboThreshold), this option
 *    is not available.
 *    ```js
 *    data: [{
 *        y: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 5,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts
 * @apioption series.packedbubble.data
 */

/**
 * @excluding enabled, enabledThreshold, height, radius, width
 * @apioption series.packedbubble.marker
 */
