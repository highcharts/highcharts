/**
 * (c) 2010-2017 Kacper Madej
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var seriesType = H.seriesType,
    isArray = H.isArray;

// Utils:
function populateAverage(xVal, yVal, i, period, index) {
    /**
     * Calculated as:
     * (Closing Price [today] - Closing Price [n days ago]) /
     * Closing Price [n days ago] * 100
     *
     * Return y as null when avoiding division by zero
     */
    var nDaysAgoY,
        rocY;

    if (index < 0) {
        // y data given as an array of values
        nDaysAgoY = yVal[i - period];
        rocY = nDaysAgoY ?
            (yVal[i] - nDaysAgoY) / nDaysAgoY * 100 :
            null;
    } else {
        // y data given as an array of arrays and the index should be used
        nDaysAgoY = yVal[i - period][index];
        rocY = nDaysAgoY ?
            (yVal[i][index] - nDaysAgoY) / nDaysAgoY * 100 :
            null;
    }

    return [xVal[i], rocY];
}

/**
 * The ROC series type.
 *
 * @constructor seriesTypes.roc
 * @augments seriesTypes.sma
 */
seriesType('roc', 'sma',
    /**
     * Rate of change indicator (ROC). The indicator value for each point
     * is defined as:
     *
     * `(C - Cn) / Cn * 100`
     *
     * where: `C` is the close value of the point of the same x in the
     * linked series and `Cn` is the close value of the point `n` periods
     * ago. `n` is set through [period](#plotOptions.roc.params.period).
     *
     * This series requires `linkedTo` option to be set.
     *
     * @extends {plotOptions.sma}
     * @product highstock
     * @sample {highstock} stock/indicators/roc
     *                     Rate of change indicator
     * @since 6.0.0
     * @optionparent plotOptions.roc
     */
    {
        name: 'Rate of Change (9)',
        params: {
            index: 3,
            period: 9
        }
    }, {
        nameBase: 'Rate of Change',
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                ROC = [],
                xData = [],
                yData = [],
                i,
                index = -1,
                ROCPoint;

            // Period is used as a number of time periods ago, so we need more
            // (at least 1 more) data than the period value
            if (xVal.length <= period) {
                return false;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index;
            }

            // i = period <-- skip first N-points
            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen; i++) {
                ROCPoint = populateAverage(xVal, yVal, i, period, index);
                ROC.push(ROCPoint);
                xData.push(ROCPoint[0]);
                yData.push(ROCPoint[1]);
            }

            return {
                values: ROC,
                xData: xData,
                yData: yData
            };
        }
    });

/**
 * A `ROC` series. If the [type](#series.wma.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * Rate of change indicator (ROC). The indicator value for each point
 * is defined as:
 *
 * `(C - Cn) / Cn * 100`
 *
 * where: `C` is the close value of the point of the same x in the
 * linked series and `Cn` is the close value of the point `n` periods
 * ago. `n` is set through [period](#series.roc.params.period).
 *
 * This series requires `linkedTo` option to be set.
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.roc
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.roc
 */

/**
 * @extends series.sma.data
 * @product highstock
 * @apioption series.roc.data
 */
