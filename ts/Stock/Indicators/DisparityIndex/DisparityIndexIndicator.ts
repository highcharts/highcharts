/* *
 *  (c) 2010-2021 Rafal Sebestjanski
 *
 *  Disparity Index indicator for highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    DisparityIndexOptions,
    DisparityIndexParamsOptions
} from './DisparityIndexOptions';
import type DisparityIndexPoint from './DisparityIndexPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        ema: EMAIndicator,
        dema: DEMAIndicator,
        sma: SMAIndicator,
        tema: TEMAIndicator,
        wma: WMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    correctFloat,
    isArray,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Disparity Index series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.disparityindex
 *
 * @augments Highcharts.Series
 */
class DisparityIndexIndicator extends SMAIndicator {
    /**
     * Disparity Index.
     * This series requires the `linkedTo` option to be set and should
     * be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/disparity-index
     *         Disparity Index indicator
     *
     * @extends      plotOptions.sma
     * @since        next
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/disparity-index
     * @optionparent plotOptions.disparityindex
     */
    public static defaultOptions: DisparityIndexOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            /**
             * The average used to calculate the Disparity Index indicator.
             * By default it uses SMA. To use other averages, e.g. EMA,
             * the stock/indicators/ema.js file needs to be loaded.
             *
             * If value is different than ema|dema|tema|wma, then sma is used.
             */
            average: 'sma',
            index: 3,
            period: 14
        },
        marker: {
            enabled: false
        },
        dataGrouping: {
            approximation: 'averages'
        }
    } as DisparityIndexOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<DisparityIndexPoint> = void 0 as any;
    public options: DisparityIndexOptions = void 0 as any;
    public points: Array<DisparityIndexPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public init(this: DisparityIndexIndicator): void {
        const args = arguments,
            options = arguments[1],
            ctx = this, // Disparity Index indicator
            params = options.params as DisparityIndexParamsOptions,
            period = params.period;

        let averageIndicator,
            averageType = params.average;

        if (period) {
            switch (averageType) {
            // ctx.range = average indicator period minus 1
            case 'ema':
                averageIndicator = EMAIndicator;
                ctx.range = period - 1;
                break;
            case 'dema':
                averageIndicator = DEMAIndicator;
                ctx.range = (2 * period - 1) - 1;
                break;
            case 'tema':
                averageIndicator = TEMAIndicator;
                ctx.range = (3 * period - 2) - 1;
                break;
            case 'wma':
                averageIndicator = WMAIndicator;
                ctx.range = period - 1;
                break;
            default: // use sma if any of the above strings do not match
                averageType = 'sma';
                averageIndicator = SMAIndicator;
                ctx.range = period - 1;
            }
        }

        ctx.averageIndicator = averageIndicator;

        // Check if the required average indicator modules is loaded
        RequiredIndicatorMixin.isParentLoaded(
            averageIndicator as any,
            averageType,
            ctx.type,
            function (indicator: Highcharts.Indicator): undefined {
                indicator.prototype.init.apply(ctx, args);
                return;
            }
        );
    }

    public calculateDisparityIndex(
        close: number,
        periodAverage: number
    ): number {
        return correctFloat(close - periodAverage) / periodAverage * 100;
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: DisparityIndexParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const index: number = (params.index as any),
            xVal: Array<number> = (series.xData as any),
            yVal: Array<number>|Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            disparityIndexPoint: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            averageIndicator: any = this.averageIndicator,
            range = this.range,
            isOHLC = isArray(yVal[0]);

        // Check period, if bigger than points length, skip
        if (xVal.length <= range) {
            return;
        }

        // Get the average indicator's values
        const values = averageIndicator.prototype
            .getValues(series, params).yData;

        for (let i = range; i < yValLen; i++) {
            const disparityIndexValue: number = this.calculateDisparityIndex(
                isOHLC ? (yVal[i] as any)[index] : yVal[i],
                values[i - range]
            );

            disparityIndexPoint.push([
                xVal[i],
                disparityIndexValue
            ]);
            xData.push(xVal[i]);
            yData.push(disparityIndexValue);
        }

        return {
            values: disparityIndexPoint,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }

}

interface DisparityIndexIndicator {
    averageIndicator?:
        typeof EMAIndicator|
        typeof DEMAIndicator|
        typeof SMAIndicator|
        typeof TEMAIndicator|
        typeof WMAIndicator;
    pointClass: typeof DisparityIndexPoint;
    range: number;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        disparityindex: typeof DisparityIndexIndicator;
    }
}
SeriesRegistry.registerSeriesType('disparityindex', DisparityIndexIndicator);


/* *
 *
 *  Default Export
 *
 * */

export default DisparityIndexIndicator;

/**
 * The Disparity Index indicator series.
 * If the [type](#series.disparityindex.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.disparityindex
 * @since     next
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/disparity-index
 * @apioption series.disparityindex
 */

''; // to include the above in the js output
