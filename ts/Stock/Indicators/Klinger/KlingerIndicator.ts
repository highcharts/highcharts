/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    KlingerOptions,
    KlingerParamsOptions
} from './KlingerOptions';
import type KlingerPoint from './KlingerPoint';
import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator,
        ema: EMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * The Klinger Indicator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.klinger
 *
 * @augments Highcharts.Series
 */
class KlingerIndicator extends SMAIndicator {
    /**
     * Klinger indicator. This series requires the `linkedTo` option to be set
     * and should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/klinger
     *         Klinger indicator
     *
     * @extends      plotOptions.sma
     * @since        next
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/klinger
     * @optionparent plotOptions.klinger
     */
    public static defaultOptions: KlingerOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            fastAvgPeriod: 34,
            slowAvgPeriod: 55,
            signal: 13,
            volumeSeriesID: 'volume'
        }
    } as KlingerOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<KlingerPoint> = void 0 as any;
    public EMApercent: number = void 0 as any;
    public points: Array<KlingerPoint> = void 0 as any;
    public options: KlingerOptions = void 0 as any;
    public volumeSeries: LineSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    init(this: KlingerIndicator): void {
        const args = arguments,
            ctx = this;

        // Check if the EMA module is added.
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


    public calculateTrend(
        this: KlingerIndicator,
        yVal: (Array<Array<number>>),
        i: number
    ): number {
        const isUpward = yVal[i][1] + yVal[i][2] + yVal[i][3] > yVal[i - 1][1] + yVal[i - 1][2] + yVal[i - 1][3];

        return isUpward ? 1 : -1;
    }

    // Checks if the series and volumeSeries are accessible, number of
    // points.x is longer than period, is series has OHLC data
    public isValidData(this: KlingerIndicator): boolean {
        const chart = this.chart,
            options: KlingerOptions = this.options,
            series = this.linkedParent,
            isSeriesOHLC: (boolean|undefined) = series && series.yData && (series.yData as any)[0].length === 4,
            volumeSeries = (this.volumeSeries ||
                    (
                        this.volumeSeries =
                        chart.get((options.params as any).volumeSeriesID) as any
                    )
            );

        /**
         * @private
         * @param {Highcharts.Series} series to check length validity on.
         * @return {boolean|undefined} true if length is valid.
         */
        function isLengthValid(series: LineSeries): (boolean|undefined) {
            return series && series.xData && series.xData.length >= (options.params as any).slowAvgPeriod;
        }

        return !!(isLengthValid(series) && isLengthValid(volumeSeries) && isSeriesOHLC);
    }

    public getVolumeForce(yVal: Array<Array<number>>): Array<Array<number>> {
        const volumeForce: Array<Array<number>> = [];

        let CM: number = 0, // cumulative measurement
            DM: number, // daily measurement
            force: number,
            i: number = 1, // start from second point
            previousCM: number = 0,
            prevoiusDM: number = yVal[0][1] - yVal[0][2], // initial DM
            previousTrend: number = 0,
            trend: number;

        for (i; i < yVal.length; i++) {
            trend = this.calculateTrend(yVal, i);

            // DM = high - low
            DM = yVal[i][1] - yVal[i][2];

            if (trend === previousTrend) {
                CM = previousCM + DM;
            } else {
                CM = prevoiusDM + DM;
            }

            force = ((this.volumeSeries.yData as any)[i] as number) * trend * Math.abs(2 * ((DM / CM) - 1));
            volumeForce.push([force]);

            // Before next iteration, assign the current as the previous.
            previousTrend = trend;
            previousCM = CM;
            prevoiusDM = DM;
        }
        return volumeForce;
    }

    public getEMA(
        yVal: (Array<number>|Array<Array<number>>),
        prevEMA: (number|undefined),
        SMA: number,
        index?: number,
        i?: number,
        xVal?: Array<number>
    ): [number, number] {

        return EMAIndicator.prototype.calculateEma(
            xVal || [],
            yVal,
            typeof i === 'undefined' ? 1 : i,
            this.EMApercent,
            prevEMA,
            typeof index === 'undefined' ? -1 : index,
            SMA
        );
    }

    public getSMA(
        period: number,
        index: number,
        values: Array<Array<number>>
    ): number {
        const accumulatePeriodPointsSlow =
            EMAIndicator.prototype.accumulatePeriodPoints(period, index, values);

        return accumulatePeriodPointsSlow / period;
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: KlingerParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const Klinger: Array<Array<number>> = [],
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            xData: Array<number> = [],
            yData: Array<number> = [],
            slowEMAvalues: Array<number> = [],
            fastEMAvalues: Array<number> = [];

        let klingerPoint: Array<number> = [],
            i: number = 0,
            j: number = 0,
            prevEMA: (number|undefined);

        // If the necessary conditions are not fulfilled, don't proceed.
        if (!this.isValidData()) {
            return;
        }

        // Calculate the Volume Force array.
        const volumeForce: Array<Array<number>> = this.getVolumeForce(yVal);

        // Calculate SMA for the first points.
        const SMAFast = this.getSMA(params.fastAvgPeriod, 0, volumeForce),
            SMASlow = this.getSMA(params.slowAvgPeriod, 0, volumeForce);

        // FAST EMA
        this.EMApercent = 2 / (params.fastAvgPeriod + 1);
        for (i; i < volumeForce.length; i++) {

            if (i < params.fastAvgPeriod) {
                fastEMAvalues.push(0);
            } else {
                const EMAcalc = this.getEMA(
                    volumeForce,
                    prevEMA,
                    SMAFast,
                    0,
                    i,
                    xVal
                )[1];

                fastEMAvalues.push(EMAcalc);
                prevEMA = EMAcalc;
            }
        }

        // SLOW EMA
        this.EMApercent = 2 / (params.slowAvgPeriod + 1);
        for (j; j < volumeForce.length; j++) {
            if (j < params.slowAvgPeriod) {
                slowEMAvalues.push(0);
            } else {
                const EMAcalc = this.getEMA(
                    volumeForce,
                    prevEMA,
                    SMASlow,
                    0,
                    j,
                    xVal
                )[1];

                slowEMAvalues.push(EMAcalc);
                prevEMA = EMAcalc;
            }
        }

        // Calculate KO
        for (var k = 0; k < xVal.length; k++) {
            let KO;
            if (k >= params.slowAvgPeriod) {
                KO = fastEMAvalues[k - 1] - slowEMAvalues[k - 1];

                klingerPoint = [xVal[k], KO];

                Klinger.push(klingerPoint);
                xData.push(xVal[k]);
                yData.push(KO);
            }
        }

        return {
            values: Klinger,
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

interface KlingerIndicator {
    pointClass: typeof KlingerPoint;
}

/* *
 *
 *  Registry
 *
 * */
declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        klinger: typeof KlingerIndicator;
    }
}

SeriesRegistry.registerSeriesType('klinger', KlingerIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default KlingerIndicator;

''; // to include the above in the js output
