/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

const {
    seriesTypes: {
        ema: EMAIndicator
    }
} = SeriesRegistry;
import type {
    APOOptions,
    APOParamsOptions
} from './APOOptions';
import type APOPoint from './APOPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
import U from '../../../Core/Utilities.js';
const {
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
 * The APO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.apo
 *
 * @augments Highcharts.Series
 */
class APOIndicator extends EMAIndicator {
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
    public static defaultOptions: APOOptions = merge(EMAIndicator.defaultOptions, {
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
    } as APOOptions);

    /* *
    *
    *  Properties
    *
    * */
    public data: Array<APOPoint> = void 0 as any;
    public options: APOOptions = void 0 as any;
    public points: Array<APOPoint> = void 0 as any;

    /* *
    *
    *  Functions
    *
    * */

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: APOParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries> | undefined) {
        var periods: Array<number> = (params.periods as any),
            index: number = (params.index as any),
            // 0- date, 1- Absolute price oscillator
            APO: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            periodsOffset: number,
            // Shorter Period EMA
            SPE: (
                IndicatorValuesObject<TLinkedSeries> |
                undefined
            ),
            // Longer Period EMA
            LPE: (
                IndicatorValuesObject<TLinkedSeries> |
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

        SPE = EMAIndicator.prototype.getValues.call(this, series, {
            index: index,
            period: periods[0]
        }) as IndicatorValuesObject<TLinkedSeries>;

        LPE = EMAIndicator.prototype.getValues.call(this, series, {
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

    public init(this: APOIndicator): void {
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
}

/* *
*
*   Prototype Properties
*
* */

interface APOIndicator {
    nameBase: string;
    nameComponents: Array<string>;
    pointClass: typeof APOPoint;
}

extend(APOIndicator.prototype, {
    nameBase: 'APO',
    nameComponents: ['periods']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        apo: typeof APOIndicator;
    }
}

SeriesRegistry.registerSeriesType('apo', APOIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default APOIndicator;

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
