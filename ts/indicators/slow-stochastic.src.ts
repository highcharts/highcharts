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
        class SlowStochasticIndicator extends StochasticIndicator {
            public nameBase: string;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: SlowStochasticIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
        }

        interface SlowStochasticIndicatorParamsOptions
            extends StochasticIndicatorParamsOptions {
            // for inheritance
        }

        class SlowStochasticIndicatorPoint extends StochasticIndicatorPoint {
            public series: SlowStochasticIndicator;
        }

        interface SlowStochasticIndicatorOptions
            extends StochasticIndicatorOptions, MultipleLinesIndicatorOptions {
            params?: SlowStochasticIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            slowstochastic: typeof SlowStochasticIndicator;
        }
    }
}

import requiredIndicator from '../mixins/indicator-required.js';

var seriesTypes = H.seriesTypes;

/**
 * The Slow Stochastic series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.slowstochastic
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.SlowStochasticIndicator>(
    'slowstochastic',
    'stochastic',
    /**
     * Slow Stochastic oscillator. This series requires the `linkedTo` option
     * to be set and should be loaded after `stock/indicators/indicators.js`
     * and `stock/indicators/stochastic.js` files.
     *
     * @sample stock/indicators/slow-stochastic
     *         Slow Stochastic oscillator
     *
     * @extends      plotOptions.stochastic
     * @since        8.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/stochastic
     * @requires     stock/indicators/slowstochastic
     * @optionparent plotOptions.slowstochastic
     */
    {
        params: {
            /**
             * Periods for Slow Stochastic oscillator: [%K, %D, SMA(%D)].
             *
             * @type    {Array<number,number,number>}
             * @default [14, 3, 3]
             */
            periods: [14, 3, 3]
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Slow Stochastic',
        init: function (this: Highcharts.SlowStochasticIndicator): void {
            const args = arguments,
                ctx = this;

            requiredIndicator.isParentLoaded(
                (H.seriesTypes.stochastic as any),
                'stochastic',
                ctx.type,
                function (indicator: Highcharts.Indicator): undefined {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                }
            );
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            this: Highcharts.SlowStochasticIndicator,
            series: TLinkedSeries,
            params: Highcharts.SlowStochasticIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            const periods: Array<number> = (params.periods as any),
                fastValues = seriesTypes.stochastic.prototype.getValues.call(
                    this,
                    series,
                    params
                ) as any,
                slowValues = {
                    values: [] as Array<Array<number>>,
                    xData: [] as Array<number>,
                    yData: [] as Array<Array<number>>
                };

            let i = 0;

            if (!fastValues) {
                return;
            }

            slowValues.xData = fastValues.xData.slice(periods[1] - 1);
            const fastYData = fastValues.yData.slice(periods[1] - 1);

            // Get SMA(%D)
            const smoothedValues: (
                undefined|Highcharts.IndicatorValuesObject<Highcharts.Series>
            ) = seriesTypes.sma.prototype.getValues.call(
                this,
                ({
                    xData: slowValues.xData,
                    yData: fastYData
                } as any),
                {
                    index: 1,
                    period: periods[2]
                }
            );

            if (!smoothedValues) {
                return;
            }

            const xDataLen = slowValues.xData.length;

            // Format data
            for (; i < xDataLen; i++) {

                slowValues.yData[i] = [
                    fastYData[i][1],
                    smoothedValues.yData[i - periods[2] + 1] || null
                ];

                slowValues.values[i] = [
                    slowValues.xData[i],
                    fastYData[i][1],
                    smoothedValues.yData[i - periods[2] + 1] || null
                ];
            }

            return slowValues as
                Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A Slow Stochastic indicator. If the [type](#series.slowstochastic.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.slowstochastic
 * @since     8.0.0
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/stochastic
 * @requires  stock/indicators/slowstochastic
 * @apioption series.slowstochastic
 */

''; // to include the above in the js output
