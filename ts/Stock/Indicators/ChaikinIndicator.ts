/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    EMAOptions,
    EMAParamsOptions
} from './EMA/EMAOptions';
import type EMAPoint from './EMA/EMAPoint';
import type IndicatorValuesObject from './IndicatorValuesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        ad: AD,
        ema: EMAIndicator
    }
} = BaseSeries;
import RequiredIndicatorMixin from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
const {
    correctFloat,
    extend,
    merge,
    error
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ChaikinIndicatorParamsOptions
            extends EMAParamsOptions {
            periods?: Array<number>;
            volumeSeriesID?: string;
        }

        class ChaikinIndicatorPoint extends EMAPoint {
            public series: ChaikinIndicator;
        }

        interface ChaikinIndicatorOptions extends EMAOptions {
            params?: ChaikinIndicatorParamsOptions;
        }
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * The Chaikin series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.chaikin
 *
 * @augments Highcharts.Series
 */
class ChaikinIndicator extends EMAIndicator {
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

    public static defaultOptions: Highcharts.ChaikinIndicatorOptions = merge(EMAIndicator.defaultOptions, {
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
    } as Highcharts.ChaikinIndicatorOptions);
}

/* *
 *
 *  Prototype Properties
 *
 * */
interface ChaikinIndicator {
    data: Array<Highcharts.ChaikinIndicatorPoint>;
    options: Highcharts.ChaikinIndicatorOptions;
    pointClass: typeof Highcharts.ChaikinIndicatorPoint;
    points: Array<Highcharts.ChaikinIndicatorPoint>;
    init(): void;
    getValues<TLinkedSeries extends LineSeries> (
        series: TLinkedSeries,
        params: Highcharts.ChaikinIndicatorParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined);
}

extend(ChaikinIndicator.prototype, {
    nameBase: 'Chaikin Osc',
    nameComponents: ['periods'],
    init: function (this: ChaikinIndicator): void {
        var args = arguments,
            ctx = this;

        RequiredIndicatorMixin.isParentLoaded(
            (EMAIndicator as any),
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
        params: Highcharts.ChaikinIndicatorParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var periods: Array<number> = (params.periods as any),
            period: number = (params.period as any),
            // Accumulation Distribution Line data
            ADL: (
                IndicatorValuesObject<TLinkedSeries>|undefined
            ),
            // 0- date, 1- Chaikin Oscillator
            CHA: Array<Array<number>> = [],
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
                'Error: "Chaikin requires two periods. Notice, first ' +
                'period should be lower than the second one."'
            );
            return;
        }

        ADL = AD.prototype.getValues.call(this, series, {
            volumeSeriesID: params.volumeSeriesID,
            period: period
        }) as IndicatorValuesObject<TLinkedSeries>;

        // Check if adl is calculated properly, if not skip
        if (!ADL) {
            return;
        }

        SPE = EMAIndicator.prototype.getValues.call(this, (ADL as any), {
            period: periods[0]
        }) as IndicatorValuesObject<TLinkedSeries>;

        LPE = EMAIndicator.prototype.getValues.call(this, (ADL as any), {
            period: periods[1]
        }) as IndicatorValuesObject<TLinkedSeries>;

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
        } as IndicatorValuesObject<TLinkedSeries>;
    }
});

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        chaikin: typeof ChaikinIndicator;
    }
}
BaseSeries.registerSeriesType('chaikin', ChaikinIndicator);

/* *
 *
 *  Default Export
 *
 * */
export default ChaikinIndicator;

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
