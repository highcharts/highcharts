'use strict';
import H from '../parts/Globals.js';

var correctFloat = H.correctFloat,
    pick = H.pick;

H.seriesType('dpo', 'sma',
    /**
     * Detrended Price Oscillator. This series requires the `linkedTo`
     * option to be set and should be loaded after the
     * `stock/indicators/indicators.js`.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/dpo
     *                     Detrended Price Oscillator
     * @since 7.0.0
     * @excluding
     *             allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
     *             showInNavigator,navigatorOptions,pointInterval,
     *             pointIntervalUnit,pointPlacement,pointRange,pointStart
     * @optionparent plotOptions.dpo
     */
    {
        /**
         * Parameters used in calculation of Detrended Price Oscillator
         * series points.
         */
        params: {
            /**
             * Period for Detrended Price Oscillator
             * @since 7.0.0
             * @product highstock
             */
            period: 21
        }
    }, /** @lends Highcharts.Series.prototype */ {
        nameBase: 'DPO',
        getValues: function (series, params) {
            var period = params.period,
                index = params.index,
                offset = Math.floor(period / 2 + 1),
                range = period + offset,
                xVal = series.xData || [],
                yVal = series.yData || [],
                yValLen = yVal.length,
                DPO = [], // 0- date, 1- Detrended Price Oscillator
                xData = [],
                yData = [],
                sum = 0,
                oscillator,
                lastPeriodPrice,
                fisrtPeriodPrice,
                currentPrice,
                periodIndex,
                rangeIndex,
                i,
                j;

            if (xVal.length <= range) {
                return false;
            }

            // Accumulate first N-points for SMA
            for (i = 0; i < period - 1; i++) {
                lastPeriodPrice = pick(yVal[i][index], yVal[i]);
                sum = correctFloat(sum + lastPeriodPrice);
            }

            // Detrended Price Oscillator formula:
            // DPO = Price - Simple moving average [from (n / 2 + 1) days ago]

            for (j = 0; j <= yValLen - range; j++) {
                periodIndex = j + period - 1;
                rangeIndex = j + range - 1;

                lastPeriodPrice =
                    pick(yVal[periodIndex][index], yVal[periodIndex]);
                currentPrice =
                    pick(yVal[rangeIndex][index], yVal[rangeIndex]);

                sum = correctFloat(sum + lastPeriodPrice);
                oscillator = currentPrice - sum / period;

                DPO.push([xVal[rangeIndex], oscillator]);
                xData.push(xVal[rangeIndex]);
                yData.push(oscillator);

                fisrtPeriodPrice = pick(yVal[j][index], yVal[j]);
                sum = correctFloat(sum - fisrtPeriodPrice);
            }

            return {
                values: DPO,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A Detrended Price Oscillator. If the [type](#series.dpo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.dpo
 * @excluding   data,dataParser,dataURL
 *              allAreas,colorAxis,compare,compareBase,joinBy,
 *              keys,stacking,showInNavigator,navigatorOptions,pointInterval,
 *              pointIntervalUnit,pointPlacement,pointRange,pointStart
 * @product highstock
 * @apioption series.dpo
 */

/**
 * An array of data points for the series. For the `dpo` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.dpo.data
 */
