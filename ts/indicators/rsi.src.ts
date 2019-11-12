/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class RSIIndicator extends SMAIndicator {
            public data: Array<RSIIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: RSIIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public options: RSIIndicatorOptions;
            public pointClass: typeof RSIIndicatorPoint;
            public points: Array<RSIIndicatorPoint>;
        }

        interface RSIIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            decimals?: number;
        }

        class RSIIndicatorPoint extends SMAIndicatorPoint {
            public series: RSIIndicator;
        }

        interface RSIIndicatorOptions extends SMAIndicatorOptions {
            params?: RSIIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            rsi: typeof RSIIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

/* eslint-disable require-jsdoc */

// Utils:
function toFixed(a: number, n: number): number {
    return parseFloat(a.toFixed(n));
}
/* eslint-enable require-jsdoc */

/**
 * The RSI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.rsi
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.RSIIndicator>(
    'rsi',
    'sma',
    /**
     * Relative strength index (RSI) technical indicator. This series
     * requires the `linkedTo` option to be set and should be loaded after
     * the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/rsi
     *         RSI indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/rsi
     * @optionparent plotOptions.rsi
     */
    {
        /**
         * @excluding index
         */
        params: {
            period: 14,
            /**
             * Number of maximum decimals that are used in RSI calculations.
             */
            decimals: 4
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.RSIIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                decimals: number = (params.decimals as any),
                // RSI starts calculations from the second point
                // Cause we need to calculate change between two points
                range = 1,
                RSI: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                index = 3,
                gain = 0,
                loss = 0,
                RSIPoint: number,
                change: number,
                avgGain: number,
                avgLoss: number,
                i: number;

            // RSI requires close value
            if (
                (xVal.length < period) || !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return;
            }

            // Calculate changes for first N points
            while (range < period) {
                change = toFixed(
                    yVal[range][index] - yVal[range - 1][index],
                    decimals
                );

                if (change > 0) {
                    gain += change;
                } else {
                    loss += Math.abs(change);
                }

                range++;
            }

            // Average for first n-1 points:
            avgGain = toFixed(gain / (period - 1), decimals);
            avgLoss = toFixed(loss / (period - 1), decimals);

            for (i = range; i < yValLen; i++) {
                change = toFixed(yVal[i][index] - yVal[i - 1][index], decimals);

                if (change > 0) {
                    gain = change;
                    loss = 0;
                } else {
                    gain = 0;
                    loss = Math.abs(change);
                }

                // Calculate smoothed averages, RS, RSI values:
                avgGain = toFixed(
                    (avgGain * (period - 1) + gain) / period,
                    decimals
                );
                avgLoss = toFixed(
                    (avgLoss * (period - 1) + loss) / period,
                    decimals
                );
                // If average-loss is equal zero, then by definition RSI is set
                // to 100:
                if (avgLoss === 0) {
                    RSIPoint = 100;
                // If average-gain is equal zero, then by definition RSI is set
                // to 0:
                } else if (avgGain === 0) {
                    RSIPoint = 0;
                } else {
                    RSIPoint = toFixed(
                        100 - (100 / (1 + (avgGain / avgLoss))),
                        decimals
                    );
                }

                RSI.push([xVal[i], RSIPoint]);
                xData.push(xVal[i]);
                yData.push(RSIPoint);
            }

            return {
                values: RSI,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `RSI` series. If the [type](#series.rsi.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.rsi
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/rsi
 * @apioption series.rsi
 */

''; // to include the above in the js output
