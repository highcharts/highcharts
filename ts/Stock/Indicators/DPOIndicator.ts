/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import U from '../../Core/Utilities.js';
const {
    correctFloat,
    pick,
    seriesType
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class DPOIndicator extends SMAIndicator {
            public data: Array<DPOIndicatorPoint>;
            public nameBase: string;
            public options: DPOIndicatorOptions;
            public pointClass: typeof DPOIndicatorPoint;
            public points: Array<DPOIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: DPOIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
        }

        interface DPOIndicatorOptions extends SMAIndicatorOptions {
            params?: DPOIndicatorParamsOptions;
        }

        interface DPOIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class DPOIndicatorPoint extends SMAIndicatorPoint {
            public series: DPOIndicator;
        }

        interface SeriesTypesDictionary {
            dpo: typeof DPOIndicator;
        }

    }
}

/* eslint-disable valid-jsdoc */
// Utils
/**
 * @private
 */
function accumulatePoints(
    sum: number,
    yVal: (Array<number>|Array<Array<number>>),
    i: number,
    index: number,
    subtract?: boolean
): number {
    var price = pick<(number|undefined), number>(
        (yVal[i] as any)[index], (yVal[i] as any)
    );

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
seriesType<Highcharts.DPOIndicator>(
    'dpo',
    'sma',
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
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.DPOIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                index: number = (params.index as any),
                offset: number = Math.floor(period / 2 + 1),
                range: number = period + offset,
                xVal: Array<number> = series.xData || [],
                yVal: (Array<number>|Array<Array<number>>) =
                    (series.yData as any) || [],
                yValLen: number = yVal.length,
                // 0- date, 1- Detrended Price Oscillator
                DPO: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                sum = 0,
                oscillator: number,
                periodIndex: number,
                rangeIndex: number,
                price: number,
                i: number,
                j: number;

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
                price = pick<(number|undefined), number>(
                    (yVal[rangeIndex] as any)[index], (yVal[rangeIndex] as any)
                );

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
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

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
