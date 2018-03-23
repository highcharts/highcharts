'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var each = H.each,
    merge = H.merge,
    isArray = H.isArray,
    defined = H.defined,
    SMA = H.seriesTypes.sma;

// Utils:
function minInArray(arr, index) {
    return H.reduce(arr, function (min, target) {
        return Math.min(min, target[index]);
    }, Infinity);
}

function maxInArray(arr, index) {
    return H.reduce(arr, function (min, target) {
        return Math.max(min, target[index]);
    }, 0);
}

H.seriesType('stochastic', 'sma',
    /**
     * Stochastic oscillator. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @extends {plotOptions.sma}
     * @product highstock
     * @sample {highstock} stock/indicators/stochastic
     *                     Stochastic oscillator
     * @since 6.0.0
     * @optionparent plotOptions.stochastic
     */
    {
        name: 'Stochastic (14, 3)',
        /**
         * @excluding index,period
         */
        params: {
            /**
             * Periods for Stochastic oscillator: [%K, %D].
             *
             * @default [14, 3]
             * @type {Array}
             * @since 6.0.0
             * @product highstock
             */
            periods: [14, 3]
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>%K: {point.y}<br/>%D: {point.smoothed}<br/>'
        },
        /**
         * Smoothed line options.
         *
         * @since 6.0.0
         * @product highstock
         */
        smoothedLine: {
            /**
             * Styles for a smoothed line.
             *
             * @since 6.0.0
             * @product highstock
             */
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.stochastic.color](
                 * #plotOptions.stochastic.color).
                 *
                 * @type {String}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    }, /** @lends Highcharts.Series.prototype */ {
        nameComponents: ['periods'],
        nameBase: 'Stochastic',
        pointArrayMap: ['y', 'smoothed'],
        parallelArrays: ['x', 'y', 'smoothed'],
        pointValKey: 'y',
        init: function () {
            SMA.prototype.init.apply(this, arguments);

            // Set default color for lines:
            this.options = merge({
                smoothedLine: {
                    styles: {
                        lineColor: this.color
                    }
                }
            }, this.options);
        },
        toYData: function (point) {
            return [point.y, point.smoothed];
        },
        translate: function () {
            var indicator = this;

            SMA.prototype.translate.apply(indicator);

            each(indicator.points, function (point) {
                if (point.smoothed !== null) {
                    point.plotSmoothed = indicator.yAxis.toPixels(
                        point.smoothed,
                        true
                    );
                }
            });
        },
        drawGraph: function () {
            var indicator = this,
                mainLinePoints = indicator.points,
                pointsLength = mainLinePoints.length,
                mainLineOptions = indicator.options,
                mainLinePath = indicator.graph,
                gappedExtend = {
                    options: {
                        gapSize: mainLineOptions.gapSize
                    }
                },
                smoothing = [],
                point;

            // Generate points for %K and %D lines:
            while (pointsLength--) {
                point = mainLinePoints[pointsLength];
                smoothing.push({
                    plotX: point.plotX,
                    plotY: point.plotSmoothed,
                    isNull: !defined(point.plotSmoothed)
                });
            }

            // Modify options and generate smoothing line:
            indicator.points = smoothing;
            indicator.options = merge(
                mainLineOptions.smoothedLine.styles,
                gappedExtend
            );
            indicator.graph = indicator.graphSmoothed;
            SMA.prototype.drawGraph.call(indicator);
            indicator.graphSmoothed = indicator.graph;

            // Restore options and draw a main line:
            indicator.points = mainLinePoints;
            indicator.options = mainLineOptions;
            indicator.graph = mainLinePath;
            SMA.prototype.drawGraph.call(indicator);
        },
        getValues: function (series, params) {
            var periodK = params.periods[0],
                periodD = params.periods[1],
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                SO = [], // 0- date, 1-%K, 2-%D
                xData = [],
                yData = [],
                slicedY,
                close = 3,
                low = 2,
                high = 1,
                CL, HL, LL, K,
                D = null,
                points,
                i;


            // Stochastic requires close value
            if (
                xVal.length < periodK ||
                !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return false;
            }

            // For a N-period, we start from N-1 point, to calculate Nth point
            // That is why we later need to comprehend slice() elements list
            // with (+1)
            for (i = periodK - 1; i < yValLen; i++) {
                slicedY = yVal.slice(i - periodK + 1, i + 1);

                // Calculate %K
                LL = minInArray(slicedY, low); // Lowest low in %K periods
                CL = yVal[i][close] - LL;
                HL = maxInArray(slicedY, high) - LL;
                K = CL / HL * 100;

                // Calculate smoothed %D, which is SMA of %K
                if (i >= periodK + periodD) {
                    points = SMA.prototype.getValues.call(this, {
                        xData: xData.slice(i - periodD - periodK, i - periodD),
                        yData: yData.slice(i - periodD - periodK, i - periodD)
                    }, {
                        period: periodD
                    });
                    D = points.yData[0];
                }

                SO.push([xVal[i], K, D]);
                xData.push(xVal[i]);
                yData.push([K, D]);
            }

            return {
                values: SO,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A Stochastic indicator. If the [type](#series.stochastic.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.stochastic
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.stochastic
 */

/**
 * An array of data points for the series. For the `stochastic` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.stochastic.data
 */

