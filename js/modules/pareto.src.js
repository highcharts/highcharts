/**
 * (c) 2010-2017 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import derivedSeriesMixin from '../mixins/derived-series.js';

var each = H.each,
    correctFloat = H.correctFloat,
    seriesType = H.seriesType,
    merge = H.merge;


/**
 * The pareto series type.
 *
 * @constructor seriesTypes.pareto
 * @augments seriesTypes.line
 */

/**
 * A pareto diagram is a type of chart that contains both bars and a line graph,
 * where individual values are represented in descending order by bars,
 * and the cumulative total is represented by the line.
 *
 * @extends plotOptions.line
 * @product highcharts
 * @sample {highcharts} highcharts/demo/pareto/
 *         Pareto diagram
 * @since 6.0.0
 * @excluding allAreas,boostThreshold,borderColor,borderRadius,
 *         borderWidth,crisp,colorAxis,depth,data,edgeColor,edgeWidth,
 *         findNearestPointBy,gapSize,gapUnit,grouping,groupPadding,
 *         groupZPadding,maxPointWidth,keys,negativeColor,pointInterval,
 *         pointIntervalUnit,pointPadding,pointPlacement,pointRange,pointStart,
 *         pointWidth,shadow,step,softThreshold,
 *         stacking,threshold,zoneAxis,zones
 * @optionparent plotOptions.pareto
 */

seriesType('pareto', 'line', {
    /**
     * Higher zIndex than column series to draw line above shapes.
     */
    zIndex: 3
}, merge(derivedSeriesMixin, {
    /**
     * calculate sum and return percent points
     *
     * @param  {Object} series
     * @return {Array} Returns array of points [x,y]
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
     * calculate y sum and each percent point
     *
     * @param  {Array} yValues y values
     * @param  {Array} xValues x values
     * @param  {Number} sum of all y values
     * @param  {Boolean} isSum declares if calculate sum of all points
     * @return {Array} Returns sum of points or array of points [x,y]
     */
    sumPointsPercents: function (yValues, xValues, sum, isSum) {
        var sumY = 0,
            sumPercent = 0,
            percentPoints = [],
            percentPoint;

        each(yValues, function (point, i) {
            if (point !== null) {
                if (isSum) {
                    sumY += point;
                } else {
                    percentPoint = (point / sum) * 100;
                    percentPoints.push(
                        [xValues[i], correctFloat(sumPercent + percentPoint)]
                    );
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
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.pareto
 * @excluding data,dataParser,dataURL
 * @product highcharts
 * @apioption series.pareto
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type {Number|String}
 * @default undefined
 * @apioption series.pareto.baseSeries
 */

/**
 * An array of data points for the series. For the `pareto` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.column.data
 * @product highcharts
 * @apioption series.pareto.data
 */
