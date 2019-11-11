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
        class ChaikinIndicator extends EMAIndicator {
            public data: Array<ChaikinIndicatorPoint>;
            public init(): void;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: ChaikinIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined)
            public nameBase: string;
            public nameComponents: Array<string>;
            public options: ChaikinIndicatorOptions;
            public pointClass: typeof ChaikinIndicatorPoint;
            public points: Array<ChaikinIndicatorPoint>;
        }

        interface ChaikinIndicatorParamsOptions
            extends EMAIndicatorParamsOptions {
            periods?: Array<number>;
            volumeSeriesID?: string;
        }

        class ChaikinIndicatorPoint extends EMAIndicatorPoint {
            public series: ChaikinIndicator;
        }

        interface ChaikinIndicatorOptions extends EMAIndicatorOptions {
            params?: ChaikinIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            chaikin: typeof ChaikinIndicator;
        }
    }
}

import './accumulation-distribution.src.js';
import U from '../parts/Utilities.js';
const {
    correctFloat
} = U;

import requiredIndicatorMixin from '../mixins/indicator-required.js';

var EMA = H.seriesTypes.ema,
    AD = H.seriesTypes.ad,
    error = H.error,
    requiredIndicator = requiredIndicatorMixin;

/**
 * The Chaikin series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.chaikin
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.ChaikinIndicator>(
    'chaikin',
    'ema',
    /**
     * Chaikin Oscillator. This series requires the `linkedTo` option to
     * be set and should be loaded after the `stock/indicators/indicators.js`
     * and `stock/indicators/ema.js`.
     *
     * @sample {highstock} stock/indicators/chaikin
     *         Chaikin Oscillator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ema
     * @requires     stock/indicators/chaikin
     * @optionparent plotOptions.chaikin
     */
    {
        /**
         * Paramters used in calculation of Chaikin Oscillator
         * series points.
         *
         * @excluding index, period
         */
        params: {
            /**
             * The id of volume series which is mandatory.
             * For example using OHLC data, volumeSeriesID='volume' means
             * the indicator will be calculated using OHLC and volume values.
             */
            volumeSeriesID: 'volume',
            /**
             * Periods for Chaikin Oscillator calculations.
             *
             * @type    {Array<number>}
             * @default [3, 10]
             */
            periods: [3, 10]
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Chaikin Osc',
        nameComponents: ['periods'],
        init: function (this: Highcharts.ChaikinIndicator): void {
            var args = arguments,
                ctx = this;

            requiredIndicator.isParentLoaded(
                (EMA as any),
                'ema',
                ctx.type,
                function (indicator: Highcharts.Indicator): undefined {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                }
            );
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.ChaikinIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var periods: Array<number> = (params.periods as any),
                period: number = (params.period as any),
                // Accumulation Distribution Line data
                ADL: (
                    Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined
                ),
                // 0- date, 1- Chaikin Oscillator
                CHA: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                periodsOffset: number,
                // Shorter Period EMA
                SPE: (
                    Highcharts.IndicatorValuesObject<TLinkedSeries>|
                    undefined
                ),
                // Longer Period EMA
                LPE: (
                    Highcharts.IndicatorValuesObject<TLinkedSeries>|
                    undefined
                ),
                oscillator: number,
                i: number;

            // Check if periods are correct
            if (periods.length !== 2 || periods[1] <= periods[0]) {
                error(
                    'Error: "Chaikin requires two periods. Notice, first ' +
                    'period should be lower than the second one."'
                );
                return;
            }

            ADL = AD.prototype.getValues.call(this, series, {
                volumeSeriesID: params.volumeSeriesID,
                period: period
            }) as Highcharts.IndicatorValuesObject<TLinkedSeries>;

            // Check if adl is calculated properly, if not skip
            if (!ADL) {
                return;
            }

            SPE = EMA.prototype.getValues.call(this, (ADL as any), {
                period: periods[0]
            }) as Highcharts.IndicatorValuesObject<TLinkedSeries>;

            LPE = EMA.prototype.getValues.call(this, (ADL as any), {
                period: periods[1]
            }) as Highcharts.IndicatorValuesObject<TLinkedSeries>;

            // Check if ema is calculated properly, if not skip
            if (!SPE || !LPE) {
                return;
            }

            periodsOffset = periods[1] - periods[0];

            for (i = 0; i < LPE.yData.length; i++) {
                oscillator = correctFloat(
                    (SPE as any).yData[i + periodsOffset] -
                    (LPE as any).yData[i]
                );

                CHA.push([(LPE as any).xData[i], oscillator]);
                xData.push((LPE as any).xData[i]);
                yData.push(oscillator);
            }

            return {
                values: CHA,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `Chaikin Oscillator` series. If the [type](#series.chaikin.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.chaikin
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, stacking, showInNavigator
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @requires  stock/indicators/chaikin
 * @apioption series.chaikin
 */

''; // to include the above in the js output
