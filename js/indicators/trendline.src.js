/* *
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
 * The Trend line series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trendline
 *
 * @augments Highcharts.Series
 */
seriesType(
    'trendline',
    'sma',
    /**
     * Trendline (linear regression) fits a straight line to the selected data
     * using a method called the Sum Of Least Squares. This series requires the
     * `linkedTo` option to be set.
     *
     * @sample stock/indicators/trendline
     *         Exponential moving average indicator
     *
     * @extends      plotOptions.sma
     * @since        7.1.3
     * @product      highstock
     * @optionparent plotOptions.trendline
     */
    {
        name: 'TRENDLINE',
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             *
             * By default index value used to be set to 0. Since Highstock 7
             * by default index is set to 3 which means that the trendline
             * indicator will be calculated using Close values.
             */
            index: 3,
            period: 0
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        getValues: function (series, params) {
            var xVal = series.xData,
                yVal = series.yData,
                LR = [],
                xData = [],
                yData = [],
                sumX = 0,
                sumY = 0,
                sumXY = 0,
                sumX2 = 0,
                xValLength = xVal.length,
                index, alpha, beta, i, x, y;

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 3;
            }

            // Get sums:
            for (i = 0; i < xValLength; i++) {
                x = xVal[i];
                y = isArray(yVal[i]) ? yVal[i][index] : yVal[i];
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumX2 += x * x;
            }

            // Get slope and offset:
            alpha = (xValLength * sumXY - sumX * sumY) /
                (xValLength * sumX2 - sumX * sumX);

            if (isNaN(alpha)) {
                alpha = 0;
            }

            beta = (sumY - alpha * sumX) / xValLength;

            // Calculate linear regression:
            for (i = 0; i < xValLength; i++) {
                x = xVal[i];
                y = alpha * x + beta;

                // Prepare arrays required for getValues() method
                LR[i] = [x, y];
                xData[i] = x;
                yData[i] = y;
            }

            return {
                xData: xData,
                yData: yData,
                values: LR
            };
        }
    }
);

/**
 * A `TrendLine` series. If the [type](#series.trendline.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.trendline
 * @since     7.1.3
 * @product   highstock
 * @excluding dataParser, dataURL
 * @apioption series.trendline
 */
