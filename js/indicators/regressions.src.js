/* *
 *
 *  (c) 2010-2019 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';

import U from '../parts/Utilities.js';
var isArray = U.isArray;

var seriesType = H.seriesType;

/**
 * Linear regression series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearregression
 *
 * @augments Highcharts.Series
 */
seriesType(
    'linearRegression',
    'sma',
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
     * @optionparent plotOptions.linearregression
     */
    {
        params: {
            /**
             * Unit (in milliseconds) for the x axis distances used to compute
             * the regression line paramters (slope & intercept) for every
             * range. In Highstock the x axis values are always represented in
             * milliseconds which may cause that distances between points are
             * "big" integer numbers.
             *
             * Highstock's linear regression algorithm (least squares method)
             * will utilize these "big" integers for finding the slope and the
             * intercept of the regression line for each period. In consequence,
             * this value may be a very "small" decimal number that's hard to
             * interpret by a human.
             *
             * For instance: `xAxisUnit` equealed to `86400000` ms (1 day)
             * forces the algorithm to treat `86400000` as `1` while computing
             * the slope and the intercept. This may enchance the legiblitity of
             * the indicator's values.
             *
             * Default value is the closest distance between two data points.
             *
             * @sample {highstock} stock/plotoptions/linear-regression-xaxisunit
             *         xAxisUnit set to 1 minute
             *
             * @example
             * // In Liniear Regression Slope Indicator series `xAxisUnit` is
             * // `86400000` (1 day) and period is `3`. There're 3 points in the
             * // base series:
             *
             * data: [
             *   [Date.UTC(2019, 0, 1), 1],
             *   [Date.UTC(2019, 0, 2), 3],
             *   [Date.UTC(2019, 0, 3), 5]
             * ]
             *
             * // This will produce one point in the indicator series that has a
             * // `y` value of `2` (slope of the regression line). If we change
             * // the `xAxisUnit` to `1` (ms) the value of the indicator's point
             * // will be `2.3148148148148148e-8` which is harder to interpert
             * // for a human.
             *
             * @type    {number}
             * @product highstock
             */
            xAxisUnit: undefined
        },
        tooltip: {
            valueDecimals: 4
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Linear Regression Indicator',

        /**
         * Return the slope and intercept of a straight line function.
         * @private
         * @param {Array<number>} - list of all x coordinates in a period
         * @param {Array<number>} - list of all y coordinates in a period
         * @return {object} - object that contains the slope and the intercept
         * of a straight line function
         */
        getRegressionLineParameters: function (xData, yData) {
            // least squares method
            var yIndex = this.options.params.index,
                getSingleYValue = function (yValue, yIndex) {
                    return isArray(yValue) ? yValue[yIndex] : yValue;
                },
                xSum = xData.reduce(function (accX, val) {
                    return val + accX;
                }, 0),
                ySum = yData.reduce(function (accY, val) {
                    return getSingleYValue(val, yIndex) + accY;
                }, 0),
                xMean = xSum / xData.length,
                yMean = ySum / yData.length,
                xError,
                yError,
                formulaNumerator = 0,
                formulaDenominator = 0,
                i,
                slope;

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
        },


        /**
         * Return the y value on a straight line.
         * @private
         * @param {object} - object that contains the slope and the intercept
         * of a straight line function
         * @param {number} - x coordinate of the point
         * @return {number} - y value of the point that lies on the line
         */
        getEndPointY: function (lineParameters, endPointX) {
            return lineParameters.slope * endPointX + lineParameters.intercept;
        },

        /**
         * Transform the coordinate system so that x values start at 0 and
         * apply xAxisUnit.
         * @private
         * @param {Array<number>} - list of all x coordinates in a period
         * @param {number} - xAxisUnit option (see the API)
         * @return {Array<number>} - array of transformed x data
         */
        transformXData: function (xData, xAxisUnit) {
            var xOffset = xData[0];

            return xData.map(function (xValue) {
                return (xValue - xOffset) / xAxisUnit;
            });
        },

        /**
         * Find the closest distance between points in the base series.
         * @private
         * @param {Array<number>} - list of all x coordinates in the base series
         * @return {number} - closest distance between points in the base series
         */
        findClosestDistance: function (xData) {
            var distance,
                closestDistance,
                i;

            for (i = 1; i < xData.length - 1; i++) {
                distance = xData[i] - xData[i - 1];
                if (distance > 0 && (closestDistance === undefined ||
                  distance < closestDistance)) {
                    closestDistance = distance;
                }
            }

            return closestDistance;
        },

        // Required to be implemented - starting point for indicator's logic
        getValues: function (baseSeries, regressionSeriesParams) {
            var xData = baseSeries.xData,
                yData = baseSeries.yData,
                period = regressionSeriesParams.period,
                lineParameters,
                i,
                periodStart,
                periodEnd,
                indicatorData = { // format required to be returned
                    xData: [], // by getValues() method
                    yData: [],
                    values: []
                },
                endPointX,
                endPointY,
                periodXData,
                periodYData,
                periodTransformedXData,
                xAxisUnit = this.options.params.xAxisUnit ||
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
                periodTransformedXData = this.transformXData(periodXData,
                    xAxisUnit);

                lineParameters = this.getRegressionLineParameters(
                    periodTransformedXData, periodYData
                );

                endPointY = this.getEndPointY(lineParameters,
                    periodTransformedXData[periodTransformedXData.length - 1]);

                indicatorData.values.push({
                    regressionLineParameters: lineParameters,
                    x: endPointX,
                    y: endPointY
                });

                indicatorData.xData.push(endPointX);
                indicatorData.yData.push(endPointY);
            }

            return indicatorData;
        }
    }
);

/**
 * A linear regression series. If the [type](#series.linearregression.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregression
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @apioption series.linearregression
 */

/* ************************************************************************** */

/**
 * The Linear Regression Slope series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionSlope
 *
 * @augments Highcharts.Series
 */
seriesType(
    'linearRegressionSlope',
    'linearRegression',
    /**
     * Linear regression slope indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-slope
     *         Linear regression slope indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @optionparent plotOptions.linearregressionslope
     */
    {},
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Linear Regression Slope Indicator',
        getEndPointY: function (lineParameters) {
            return lineParameters.slope;
        }
    }
);

/**
 * A linear regression slope series. If the
 * [type](#series.linearregressionslope.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionslope
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @apioption series.linearregressionslope
 */

/* ************************************************************************** */

/**
 * The Linear Regression Intercept series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionIntercept
 *
 * @augments Highcharts.Series
 */
seriesType(
    'linearRegressionIntercept',
    'linearRegression',
    /**
     * Linear regression intercept indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-intercept
     *         Linear intercept slope indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @optionparent plotOptions.linearregressionintercept
     */
    {},
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Linear Regression Intercept Indicator',
        getEndPointY: function (lineParameters) {
            return lineParameters.intercept;
        }
    }
);

/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionintercept.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionintercept
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @apioption series.linearregressionintercept
 */

/* ************************************************************************** */

/**
 * The Linear Regression Angle series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionAngle
 *
 * @augments Highcharts.Series
 */
seriesType(
    'linearRegressionAngle',
    'linearRegression',
    /**
     * Linear regression angle indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-angle
     *         Linear intercept angle indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @optionparent plotOptions.linearregressionangle
     */
    {
        tooltip: { // add a degree symbol
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
            '{series.name}: <b>{point.y}°</b><br/>'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Linear Regression Angle Indicator',

        /**
        * Convert a slope of a line to angle (in degrees) between
        * the line and x axis
        * @private
        * @param {number} - slope of the straight line function
        * @return {number}
        */
        slopeToAngle: function (slope) {
            return Math.atan(slope) * (180 / Math.PI); // rad to deg
        },

        getEndPointY: function (lineParameters) {
            return this.slopeToAngle(lineParameters.slope);
        }
    }
);

/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionangle.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionangle
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @apioption series.linearregressionangle
 */
