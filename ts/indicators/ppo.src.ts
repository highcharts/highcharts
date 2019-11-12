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

        class PPOIndicator extends EMAIndicator {
            public data: Array<PPOIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: PPOIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public init(): void;
            public options: PPOIndicatorOptions;
            public nameBase: string;
            public nameComponents: Array<string>;
            public pointClass: typeof PPOIndicatorPoint;
            public points: Array<PPOIndicatorPoint>;
        }

        interface PPOIndicatorParamsOptions extends EMAIndicatorParamsOptions {
            periods?: Array<number>;
        }

        class PPOIndicatorPoint extends EMAIndicatorPoint {
            public series: PPOIndicator;
        }

        interface PPOIndicatorOptions extends EMAIndicatorOptions {
            params?: PPOIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            ppo: typeof PPOIndicator;
        }
    }
}


import U from '../parts/Utilities.js';
const {
    correctFloat
} = U;

import requiredIndicatorMixin from '../mixins/indicator-required.js';

var EMA = H.seriesTypes.ema,
    error = H.error,
    requiredIndicator = requiredIndicatorMixin;

/**
 * The PPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ppo
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.PPOIndicator>(
    'ppo',
    'ema',
    /**
     * Percentage Price Oscillator. This series requires the
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
     *
     * @sample {highstock} stock/indicators/ppo
     *         Percentage Price Oscillator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ema
     * @requires     stock/indicators/ppo
     * @optionparent plotOptions.ppo
     */
    {
        /**
         * Paramters used in calculation of Percentage Price Oscillator series
         * points.
         *
         * @excluding period
         */
        params: {
            /**
             * Periods for Percentage Price Oscillator calculations.
             *
             * @type    {Array<number>}
             * @default [12, 26]
             */
            periods: [12, 26]
        }
    },
    /**
     * @lends Highcharts.Series.prototype
     */
    {
        nameBase: 'PPO',
        nameComponents: ['periods'],
        init: function (this: Highcharts.PPOIndicator): void {
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
            params: Highcharts.PPOIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var periods: Array<number> = (params.periods as any),
                index: number = (params.index as any),
                // 0- date, 1- Percentage Price Oscillator
                PPO: Array<Array<number>> = [],
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
                    'Error: "PPO requires two periods. Notice, first period ' +
                    'should be lower than the second one."'
                );
                return;
            }

            SPE = EMA.prototype.getValues.call(this, series, {
                index: index,
                period: periods[0]
            }) as Highcharts.IndicatorValuesObject<TLinkedSeries>;

            LPE = EMA.prototype.getValues.call(this, series, {
                index: index,
                period: periods[1]
            }) as Highcharts.IndicatorValuesObject<TLinkedSeries>;

            // Check if ema is calculated properly, if not skip
            if (!SPE || !LPE) {
                return;
            }

            periodsOffset = periods[1] - periods[0];

            for (i = 0; i < LPE.yData.length; i++) {
                oscillator = correctFloat(
                    ((SPE as any).yData[i + periodsOffset] -
                    (LPE as any).yData[i]) /
                    (LPE as any).yData[i] *
                    100
                );

                PPO.push([(LPE as any).xData[i], oscillator]);
                xData.push((LPE as any).xData[i]);
                yData.push(oscillator);
            }

            return {
                values: PPO,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `Percentage Price Oscillator` series. If the [type](#series.ppo.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ppo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @requires  stock/indicators/ppo
 * @apioption series.ppo
 */

''; // to include the above in the js output
