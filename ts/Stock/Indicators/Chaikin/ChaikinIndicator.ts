/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    ChaikinOptions,
    ChaikinParamsOptions
} from './ChaikinOptions';
import type ChaikinPoint from './ChaikinPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';

import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
import '../AD/ADIndicator.js'; // For historic reasons, AD i built into Chaikin
const {
    seriesTypes: {
        ad: AD,
        ema: EMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    correctFloat,
    extend,
    merge,
    error
} = U;

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
    public static defaultOptions: ChaikinOptions = merge(EMAIndicator.defaultOptions, {
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
    } as ChaikinOptions);

    /* *
     *
     *  Properties
     *
     * */
    public data: Array<ChaikinPoint> = void 0 as any;

    public options: ChaikinOptions = void 0 as any;

    public points: Array<ChaikinPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */
    init(this: ChaikinIndicator): void {
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
    }

    getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: ChaikinParamsOptions
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
}

/* *
 *
 *  Prototype Properties
 *
 * */
interface ChaikinIndicator {
    nameBase: string;
    nameComponents: Array<string>;
    pointClass: typeof ChaikinPoint;
}

extend(ChaikinIndicator.prototype, {
    nameBase: 'Chaikin Osc',
    nameComponents: ['periods']
});

/* *
 *
 *  Registry
 *
 * */
declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        chaikin: typeof ChaikinIndicator;
    }
}
SeriesRegistry.registerSeriesType('chaikin', ChaikinIndicator);

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
