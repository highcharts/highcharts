/* *
 *
 *  (c) 2010-2021 Sebastian Bochan
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
import DerivedSeriesMixin from '../../Mixins/DerivedSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var LineSeries = SeriesRegistry.seriesTypes.line;
import U from '../../Core/Utilities.js';
var correctFloat = U.correctFloat, merge = U.merge, extend = U.extend;
/* *
 *
 *  Class
 *
 * */
/**
 * The pareto series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pareto
 *
 * @augments Highcharts.Series
 */
var ParetoSeries = /** @class */ (function (_super) {
    __extends(ParetoSeries, _super);
    function ParetoSeries() {
        /* *
         *
         *  Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.points = void 0;
        _this.options = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Calculate y sum and each percent point.
     *
     * @private
     * @function Highcharts.Series#sumPointsPercents
     *
     * @param {Array<number>} yValues
     * Y values
     *
     * @param {Array<number>} xValues
     * X values
     *
     * @param {number} sum
     * Sum of all y values
     *
     * @param {boolean} [isSum]
     * Declares if calculate sum of all points
     *
     * @return {number|Array<number,number>}
     * Returns sum of points or array of points [x,sum]
     *
     * @requires modules/pareto
     */
    ParetoSeries.prototype.sumPointsPercents = function (yValues, xValues, sum, isSum) {
        var sumY = 0, sumPercent = 0, percentPoints = [], percentPoint;
        yValues.forEach(function (point, i) {
            if (point !== null) {
                if (isSum) {
                    sumY += point;
                }
                else {
                    percentPoint = (point / sum) * 100;
                    percentPoints.push([
                        xValues[i],
                        correctFloat(sumPercent + percentPoint)
                    ]);
                    sumPercent += percentPoint;
                }
            }
        });
        return (isSum ? sumY : percentPoints);
    };
    /**
     * Calculate sum and return percent points.
     *
     * @private
     * @function Highcharts.Series#setDerivedData
     * @requires modules/pareto
     */
    ParetoSeries.prototype.setDerivedData = function () {
        var xValues = this.baseSeries.xData, yValues = this.baseSeries.yData, sum = this.sumPointsPercents(yValues, xValues, null, true);
        this.setData(this.sumPointsPercents(yValues, xValues, sum, false), false);
    };
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
     *               borderWidth, crisp, colorAxis, depth, data, dragDrop,
     *               edgeColor, edgeWidth, findNearestPointBy, gapSize, gapUnit,
     *               grouping, groupPadding, groupZPadding, maxPointWidth, keys,
     *               negativeColor, pointInterval, pointIntervalUnit,
     *               pointPadding, pointPlacement, pointRange, pointStart,
     *               pointWidth, shadow, step, softThreshold, stacking,
     *               threshold, zoneAxis, zones, boostBlending
     * @requires     modules/pareto
     * @optionparent plotOptions.pareto
     */
    ParetoSeries.defaultOptions = merge(LineSeries.defaultOptions, {
        /**
         * Higher zIndex than column series to draw line above shapes.
         */
        zIndex: 3
    });
    return ParetoSeries;
}(LineSeries));
extend(ParetoSeries.prototype, {
    addBaseSeriesEvents: DerivedSeriesMixin.addBaseSeriesEvents,
    addEvents: DerivedSeriesMixin.addEvents,
    destroy: DerivedSeriesMixin.destroy,
    hasDerivedData: DerivedSeriesMixin.hasDerivedData,
    init: DerivedSeriesMixin.init,
    setBaseSeries: DerivedSeriesMixin.setBaseSeries
});
SeriesRegistry.registerSeriesType('pareto', ParetoSeries);
/* *
 *
 *  Default export
 *
 * */
export default ParetoSeries;
/* *
 *
 *  API options
 *
 * */
/**
 * A `pareto` series. If the [type](#series.pareto.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pareto
 * @since     6.0.0
 * @product   highcharts
 * @excluding data, dataParser, dataURL, boostThreshold, boostBlending
 * @requires  modules/pareto
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
''; // adds the doclets above to the transpiled file
