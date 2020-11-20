/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type EMAIndicator from './EMA/EMAIndicator';
import type {
    EMAOptions,
    EMAParamsOptions
} from './EMA/EMAOptions';
import type EMAPoint from './EMA/EMAPoint';
import type IndicatorValuesObject from './IndicatorValuesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import BaseSeries from '../../Core/Series/Series.js';
import RequiredIndicatorMixin from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
const {
    error
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class APOIndicator extends EMAIndicator {
            public data: Array<APOIndicatorPoint>;
            public getValues<TLinkedSeries extends LineSeries>(
                series: TLinkedSeries,
                params: APOIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public init(): void;
            public nameBase: string;
            public nameComponents: Array<string>;
            public options: APOIndicatorOptions;
            public pointClass: typeof APOIndicatorPoint;
            public points: Array<APOIndicatorPoint>;
        }

        interface APOIndicatorParamsOptions extends EMAParamsOptions {
            periods?: Array<number>;
        }

        class APOIndicatorPoint extends EMAPoint {
            public series: APOIndicator;
        }

        interface APOIndicatorOptions extends EMAOptions {
            params?: APOIndicatorParamsOptions;
        }
    }
}

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        apo: typeof Highcharts.APOIndicator;
    }
}

// im port './EMAIndicator.js';

var EMA = BaseSeries.seriesTypes.ema;

/**
 * The APO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.apo
 *
 * @augments Highcharts.Series
 */
BaseSeries.seriesType<typeof Highcharts.APOIndicator>(
    'apo',
    'ema',
    /**
     * Absolute Price Oscillator. This series requires the `linkedTo` option to
     * be set and should be loaded after the `stock/indicators/indicators.js`
     * and `stock/indicators/ema.js`.
     *
     * @sample {highstock} stock/indicators/apo
     *         Absolute Price Oscillator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ema
     * @requires     stock/indicators/apo
     * @optionparent plotOptions.apo
     */
    {
        /**
         * Paramters used in calculation of Absolute Price Oscillator
         * series points.
         *
         * @excluding period
         */
        params: {
            /**
             * Periods for Absolute Price Oscillator calculations.
             *
             * @type    {Array<number>}
             * @default [10, 20]
             * @since   7.0.0
             */
            periods: [10, 20]
        }
    },
    /**
     * @lends Highcharts.Series.prototype
     */
    {
        nameBase: 'APO',
        nameComponents: ['periods'],
        init: function (this: Highcharts.APOIndicator): void {
            var args = arguments,
                ctx = this;

            RequiredIndicatorMixin.isParentLoaded(
                (EMA as any),
                'ema',
                ctx.type,
                function (indicator: Highcharts.Indicator): undefined {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                }
            );
        },
        getValues: function<TLinkedSeries extends LineSeries> (
            series: TLinkedSeries,
            params: Highcharts.APOIndicatorParamsOptions
        ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
            var periods: Array<number> = (params.periods as any),
                index: number = (params.index as any),
                // 0- date, 1- Absolute price oscillator
                APO: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                periodsOffset: number,
                // Shorter Period EMA
                SPE: (
                    IndicatorValuesObject<TLinkedSeries>|
                    undefined
                ),
                // Longer Period EMA
                LPE: (
                    IndicatorValuesObject<TLinkedSeries>|
                    undefined
                ),
                oscillator: number,
                i: number;

            // Check if periods are correct
            if (periods.length !== 2 || periods[1] <= periods[0]) {
                error(
                    'Error: "APO requires two periods. Notice, first period ' +
                    'should be lower than the second one."'
                );
                return;
            }

            SPE = EMA.prototype.getValues.call(this, series, {
                index: index,
                period: periods[0]
            }) as IndicatorValuesObject<TLinkedSeries>;

            LPE = EMA.prototype.getValues.call(this, series, {
                index: index,
                period: periods[1]
            }) as IndicatorValuesObject<TLinkedSeries>;

            // Check if ema is calculated properly, if not skip
            if (!SPE || !LPE) {
                return;
            }

            periodsOffset = periods[1] - periods[0];

            for (i = 0; i < LPE.yData.length; i++) {
                oscillator = (
                    (SPE as any).yData[i + periodsOffset] -
                    (LPE as any).yData[i]
                );

                APO.push([(LPE as any).xData[i], oscillator]);
                xData.push((LPE as any).xData[i]);
                yData.push(oscillator);
            }

            return {
                values: APO,
                xData: xData,
                yData: yData
            } as IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * An `Absolute Price Oscillator` series. If the [type](#series.apo.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.apo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @requires  stock/indicators/apo
 * @apioption series.apo
 */

''; // to include the above in the js output
