/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../parts/Utilities.js';
var correctFloat = U.correctFloat, pick = U.pick, seriesType = U.seriesType;
/* eslint-disable valid-jsdoc */
// Utils
/**
 * @private
 */
function accumulatePoints(sum, yVal, i, index, subtract) {
    var price = pick(yVal[i][index], yVal[i]);
    if (subtract) {
        return correctFloat(sum - price);
    }
    return correctFloat(sum + price);
}
/* eslint-enable valid-jsdoc */
/**
 * The DPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dpo
 *
 * @augments Highcharts.Series
 */
seriesType('dpo', 'sma', 
/**
 * Detrended Price Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/dpo
 *         Detrended Price Oscillator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/dpo
 * @optionparent plotOptions.dpo
 */
{
    /**
     * Parameters used in calculation of Detrended Price Oscillator series
     * points.
     */
    params: {
        /**
         * Period for Detrended Price Oscillator
         */
        period: 21
    }
}, 
/**
 * @lends Highcharts.Series#
 */
{
    nameBase: 'DPO',
    getValues: function (series, params) {
        var period = params.period, index = params.index, offset = Math.floor(period / 2 + 1), range = period + offset, xVal = series.xData || [], yVal = series.yData || [], yValLen = yVal.length, 
        // 0- date, 1- Detrended Price Oscillator
        DPO = [], xData = [], yData = [], sum = 0, oscillator, periodIndex, rangeIndex, price, i, j;
        if (xVal.length <= range) {
            return;
        }
        // Accumulate first N-points for SMA
        for (i = 0; i < period - 1; i++) {
            sum = accumulatePoints(sum, yVal, i, index);
        }
        // Detrended Price Oscillator formula:
        // DPO = Price - Simple moving average [from (n / 2 + 1) days ago]
        for (j = 0; j <= yValLen - range; j++) {
            periodIndex = j + period - 1;
            rangeIndex = j + range - 1;
            // adding the last period point
            sum = accumulatePoints(sum, yVal, periodIndex, index);
            price = pick(yVal[rangeIndex][index], yVal[rangeIndex]);
            oscillator = price - sum / period;
            // substracting the first period point
            sum = accumulatePoints(sum, yVal, j, index, true);
            DPO.push([xVal[rangeIndex], oscillator]);
            xData.push(xVal[rangeIndex]);
            yData.push(oscillator);
        }
        return {
            values: DPO,
            xData: xData,
            yData: yData
        };
    }
});
/**
 * A Detrended Price Oscillator. If the [type](#series.dpo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dpo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dpo
 * @apioption series.dpo
 */
''; // to include the above in the js output'
