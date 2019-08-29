/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';

import U from '../parts/Utilities.js';
var isArray = U.isArray;

var seriesType = H.seriesType,
    correctFloat = H.correctFloat;

/**
 * The EMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ema
 *
 * @augments Highcharts.Series
 */
seriesType(
    'ema',
    'sma',
    /**
     * Exponential moving average indicator (EMA). This series requires the
     * `linkedTo` option to be set.
     *
     * @sample stock/indicators/ema
     *         Exponential moving average indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @optionparent plotOptions.ema
     */
    {
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             *
             * By default index value used to be set to 0. Since Highstock 7
             * by default index is set to 3 which means that the ema
             * indicator will be calculated using Close values.
             */
            index: 3,
            period: 9 // @merge 14 in v6.2
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        accumulatePeriodPoints: function (
            period,
            index,
            yVal
        ) {
            var sum = 0,
                i = 0,
                y = 0;

            while (i < period) {
                y = index < 0 ? yVal[i] : yVal[i][index];
                sum = sum + y;
                i++;
            }

            return sum;
        },
        calculateEma: function (
            xVal,
            yVal,
            i,
            EMApercent,
            calEMA,
            index,
            SMA
        ) {
            var x = xVal[i - 1],
                yValue = index < 0 ? yVal[i - 1] : yVal[i - 1][index],
                y;

            y = calEMA === undefined ?
                SMA : correctFloat((yValue * EMApercent) +
                (calEMA * (1 - EMApercent)));

            return [x, y];
        },
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                EMApercent = 2 / (period + 1),
                sum = 0,
                EMA = [],
                xData = [],
                yData = [],
                index = -1,
                SMA = 0,
                calEMA,
                EMAPoint,
                i;

            // Check period, if bigger than points length, skip
            if (yValLen < period) {
                return false;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 0;
            }

            // Accumulate first N-points
            sum = this.accumulatePeriodPoints(
                period,
                index,
                yVal
            );

            // first point
            SMA = sum / period;

            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen + 1; i++) {
                EMAPoint = this.calculateEma(
                    xVal,
                    yVal,
                    i,
                    EMApercent,
                    calEMA,
                    index,
                    SMA
                );
                EMA.push(EMAPoint);
                xData.push(EMAPoint[0]);
                yData.push(EMAPoint[1]);
                calEMA = EMAPoint[1];
            }

            return {
                values: EMA,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A `EMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ema
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @apioption series.ema
 */
