/**
 *
 *  (c) 2010-2021 Kamil Kulig
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
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var SMAIndicator = SeriesRegistry.seriesTypes.sma;
import U from '../../../Core/Utilities.js';
var isArray = U.isArray, extend = U.extend, merge = U.merge;
/* *
 *
 * Class
 *
 * */
/**
 * Linear regression series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearregression
 *
 * @augments Highcharts.Series
 */
var LinearRegressionIndicator = /** @class */ (function (_super) {
    __extends(LinearRegressionIndicator, _super);
    function LinearRegressionIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Return the slope and intercept of a straight line function.
     * @private
     * @param {Highcharts.LinearRegressionIndicator} this indicator to use
     * @param {Array<number>} xData -  list of all x coordinates in a period
     * @param {Array<number>} yData - list of all y coordinates in a period
     * @return {Highcharts.RegressionLineParametersObject}
     *          object that contains the slope and the intercept
     *          of a straight line function
     */
    LinearRegressionIndicator.prototype.getRegressionLineParameters = function (xData, yData) {
        // least squares method
        var yIndex = this.options.params.index, getSingleYValue = function (yValue, yIndex) {
            return isArray(yValue) ? yValue[yIndex] : yValue;
        }, xSum = xData.reduce(function (accX, val) {
            return val + accX;
        }, 0), ySum = yData.reduce(function (accY, val) {
            return getSingleYValue(val, yIndex) + accY;
        }, 0), xMean = xSum / xData.length, yMean = ySum / yData.length, xError, yError, formulaNumerator = 0, formulaDenominator = 0, i, slope;
        for (i = 0; i < xData.length; i++) {
            xError = xData[i] - xMean;
            yError = getSingleYValue(yData[i], yIndex) - yMean;
            formulaNumerator += xError * yError;
            formulaDenominator += Math.pow(xError, 2);
        }
        slope = formulaDenominator ?
            formulaNumerator / formulaDenominator : 0; // don't divide by 0
        return {
            slope: slope,
            intercept: yMean - slope * xMean
        };
    };
    /**
     * Return the y value on a straight line.
     * @private
     * @param {Highcharts.RegressionLineParametersObject} lineParameters
     *          object that contains the slope and the intercept
     *          of a straight line function
     * @param {number} endPointX - x coordinate of the point
     * @return {number} - y value of the point that lies on the line
     */
    LinearRegressionIndicator.prototype.getEndPointY = function (lineParameters, endPointX) {
        return lineParameters.slope * endPointX + lineParameters.intercept;
    };
    /**
     * Transform the coordinate system so that x values start at 0 and
     * apply xAxisUnit.
     * @private
     * @param {Array<number>} xData - list of all x coordinates in a period
     * @param {number} xAxisUnit - option (see the API)
     * @return {Array<number>} - array of transformed x data
     */
    LinearRegressionIndicator.prototype.transformXData = function (xData, xAxisUnit) {
        var xOffset = xData[0];
        return xData.map(function (xValue) {
            return (xValue - xOffset) / xAxisUnit;
        });
    };
    /**
     * Find the closest distance between points in the base series.
     * @private
     * @param {Array<number>} xData list of all x coordinates in the base series
     * @return {number} - closest distance between points in the base series
     */
    LinearRegressionIndicator.prototype.findClosestDistance = function (xData) {
        var distance, closestDistance, i;
        for (i = 1; i < xData.length - 1; i++) {
            distance = xData[i] - xData[i - 1];
            if (distance > 0 &&
                (typeof closestDistance === 'undefined' ||
                    distance < closestDistance)) {
                closestDistance = distance;
            }
        }
        return closestDistance;
    };
    // Required to be implemented - starting point for indicator's logic
    LinearRegressionIndicator.prototype.getValues = function (baseSeries, regressionSeriesParams) {
        var xData = baseSeries.xData, yData = baseSeries.yData, period = regressionSeriesParams.period, lineParameters, i, periodStart, periodEnd, 
        // format required to be returned
        indicatorData = {
            xData: [],
            yData: [],
            values: []
        }, endPointX, endPointY, periodXData, periodYData, periodTransformedXData, xAxisUnit = this.options.params.xAxisUnit ||
            this.findClosestDistance(xData);
        // Iteration logic: x value of the last point within the period
        // (end point) is used to represent the y value (regression)
        // of the entire period.
        for (i = period - 1; i <= xData.length - 1; i++) {
            periodStart = i - period + 1; // adjusted for slice() function
            periodEnd = i + 1; // (as above)
            endPointX = xData[i];
            periodXData = xData.slice(periodStart, periodEnd);
            periodYData = yData.slice(periodStart, periodEnd);
            periodTransformedXData = this.transformXData(periodXData, xAxisUnit);
            lineParameters = this.getRegressionLineParameters(periodTransformedXData, periodYData);
            endPointY = this.getEndPointY(lineParameters, periodTransformedXData[periodTransformedXData.length - 1]);
            // @todo this is probably not used anywhere
            indicatorData.values.push({
                regressionLineParameters: lineParameters,
                x: endPointX,
                y: endPointY
            });
            indicatorData.xData.push(endPointX);
            indicatorData.yData.push(endPointY);
        }
        return indicatorData;
    };
    /**
     * Linear regression indicator. This series requires `linkedTo` option to be
     * set.
     *
     * @sample {highstock} stock/indicators/linear-regression
     *         Linear regression indicator
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/linearregression
     * @optionparent plotOptions.linearregression
     */
    LinearRegressionIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            /**
             * Unit (in milliseconds) for the x axis distances used to
             * compute the regression line paramters (slope & intercept) for
             * every range. In Highstock the x axis values are always
             * represented in milliseconds which may cause that distances
             * between points are "big" integer numbers.
             *
             * Highstock's linear regression algorithm (least squares
             * method) will utilize these "big" integers for finding the
             * slope and the intercept of the regression line for each
             * period. In consequence, this value may be a very "small"
             * decimal number that's hard to interpret by a human.
             *
             * For instance: `xAxisUnit` equealed to `86400000` ms (1 day)
             * forces the algorithm to treat `86400000` as `1` while
             * computing the slope and the intercept. This may enchance the
             * legiblitity of the indicator's values.
             *
             * Default value is the closest distance between two data
             * points.
             *
             * @sample {highstock} stock/plotoptions/linear-regression-xaxisunit
             *         xAxisUnit set to 1 minute
             *
             * @example
             * // In Liniear Regression Slope Indicator series `xAxisUnit`is
             * // `86400000` (1 day) and period is `3`. There're 3 points in
             * // the base series:
             *
             * data: [
             *   [Date.UTC(2020, 0, 1), 1],
             *   [Date.UTC(2020, 0, 2), 3],
             *   [Date.UTC(2020, 0, 3), 5]
             * ]
             *
             * // This will produce one point in the indicator series that
             * // has a `y` value of `2` (slope of the regression line). If
             * // we change the `xAxisUnit` to `1` (ms) the value of the
             * // indicator's point will be `2.3148148148148148e-8` which is
             * // harder to interpert for a human.
             *
             * @type    {number}
             * @product highstock
             */
            xAxisUnit: void 0
        },
        tooltip: {
            valueDecimals: 4
        }
    });
    return LinearRegressionIndicator;
}(SMAIndicator));
extend(LinearRegressionIndicator.prototype, {
    nameBase: 'Linear Regression Indicator'
});
SeriesRegistry.registerSeriesType('linearRegression', LinearRegressionIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default LinearRegressionIndicator;
/**
 * A linear regression series. If the
 * [type](#series.linearregression.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregression
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/linearregression
 * @apioption series.linearregression
 */
''; // to include the above in the js output
