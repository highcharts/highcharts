/* *
 * (c) 2010-2017 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import derivedSeriesMixin from '../mixins/derived-series.js';

var correctFloat = H.correctFloat,
    seriesType = H.seriesType,
    merge = H.merge;


/**
 * The pareto series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pareto
 *
 * @augments Highcharts.Series
 */
seriesType('pareto', 'line'

    /**
     * A pareto diagram is a type of chart that contains both bars and a line
     * graph, where individual values are represented in descending order by
     * bars, and the cumulative total is represented by the line.
     *
     * @sample {highcharts} highcharts/demo/pareto/
     *         Pareto diagram
     *
     * @extends      plotOptions.line
     * @since        6.0.0
     * @product      highcharts
     * @excluding    allAreas, boostThreshold, borderColor, borderRadius,
     *               borderWidth, crisp, colorAxis, depth, data, edgeColor,
     *               edgeWidth, findNearestPointBy, gapSize, gapUnit, grouping,
     *               groupPadding, groupZPadding, maxPointWidth, keys,
     *               negativeColor, pointInterval, pointIntervalUnit,
     *               pointPadding, pointPlacement, pointRange, pointStart,
     *               pointWidth, shadow, step, softThreshold, stacking,
     *               threshold, zoneAxis, zones
     * @optionparent plotOptions.pareto
     */
    , {
        /**
         * Higher zIndex than column series to draw line above shapes.
         */
        zIndex: 3
    }, merge(derivedSeriesMixin, {
        /**
         * Calculate sum and return percent points.
         *
         * @private
         * @function Highcharts.Series#setDerivedData
         *
         * @return {Array<Array<number,number>>}
         *         Returns array of points [x,y]
         */
        setDerivedData: function () {
            if (this.baseSeries.yData.length > 1) {
                var xValues = this.baseSeries.xData,
                    yValues = this.baseSeries.yData,
                    sum = this.sumPointsPercents(yValues, xValues, null, true);

                this.setData(
                    this.sumPointsPercents(yValues, xValues, sum, false),
                    false
                );
            }
        },
        /**
         * Calculate y sum and each percent point.
         *
         * @private
         * @function Highcharts.Series#sumPointsPercents
         *
         * @param {Array<number>} yValues
         *        Y values
         *
         * @param {Array<number>} xValues
         *        X values
         *
         * @param {number} sum
         *        Sum of all y values
         *
         * @param {boolean} [isSum]
         *        Declares if calculate sum of all points
         *
         * @return {number|Array<number,number>}
         *         Returns sum of points or array of points [x,sum]
         */
        sumPointsPercents: function (yValues, xValues, sum, isSum) {
            var sumY = 0,
                sumPercent = 0,
                percentPoints = [],
                percentPoint;

            yValues.forEach(function (point, i) {
                if (point !== null) {
                    if (isSum) {
                        sumY += point;
                    } else {
                        percentPoint = (point / sum) * 100;
                        percentPoints.push([
                            xValues[i],
                            correctFloat(sumPercent + percentPoint)
                        ]);
                        sumPercent += percentPoint;
                    }
                }
            });

            return isSum ? sumY : percentPoints;
        }
    }));

/**
 * A `pareto` series. If the [type](#series.pareto.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pareto
 * @since     6.0.0
 * @product   highcharts
 * @excluding data, dataParser, dataURL
 * @apioption series.pareto
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @default   undefined
 * @apioption series.pareto.baseSeries
 */

/**
 * An array of data points for the series. For the `pareto` series type,
 * points are calculated dynamically.
 *
 * @type      {Array<Array<number|string>|*>}
 * @extends   series.column.data
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.pareto.data
 */
