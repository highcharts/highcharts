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

        class EMAIndicator extends SMAIndicator {
            public data: Array<EMAIndicatorPoint>;
            public options: EMAIndicatorOptions;
            public pointClass: typeof EMAIndicatorPoint;
            public points: Array<EMAIndicatorPoint>;
            public accumulatePeriodPoints(
                period: number,
                index: number,
                yVal: Array<Array<number>>
            ): number;
            public calculateEma(
                xVal: (Array<number>|undefined),
                yVal: (Array<number>|Array<Array<number>>),
                i: number,
                EMApercent: number,
                calEMA: (number|undefined),
                index: number,
                SMA: number
            ): [number, number];
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: EMAIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
        }

        interface EMAIndicatorOptions extends SMAIndicatorOptions {
            params?: EMAIndicatorParamsOptions;
        }

        interface EMAIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class EMAIndicatorPoint extends SMAIndicatorPoint {
            public series: EMAIndicator;
        }

        interface SeriesTypesDictionary {
            ema: typeof EMAIndicator;
        }

    }
}

import U from '../parts/Utilities.js';
const {
    correctFloat,
    isArray
} = U;

var seriesType = H.seriesType;

/**
 * The EMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ema
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.EMAIndicator>(
    'ema',
    'sma',
    /**
     * Exponential moving average indicator (EMA). This series requires the
     * `linkedTo` option to be set.
     *
     * @sample stock/indicators/ema
     *         Exponential moving average indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ema
     * @optionparent plotOptions.ema
     */
    {
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             *
             * By default index value used to be set to 0. Since Highstock 7
             * by default index is set to 3 which means that the ema
             * indicator will be calculated using Close values.
             */
            index: 3,
            period: 9 // @merge 14 in v6.2
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        accumulatePeriodPoints: function (
            period: number,
            index: number,
            yVal: Array<Array<number>>
        ): number {
            var sum = 0,
                i = 0,
                y: (number|Array<number>) = 0;

            while (i < period) {
                y = index < 0 ? yVal[i] : yVal[i][index];
                sum = sum + (y as any);
                i++;
            }

            return sum;
        },
        calculateEma: function (
            xVal: Array<number>,
            yVal: (Array<number>|Array<Array<number>>),
            i: number,
            EMApercent: number,
            calEMA: (number|undefined),
            index: number,
            SMA: number
        ): [number, number] {
            var x: number = xVal[i - 1],
                yValue: number = index < 0 ?
                    yVal[i - 1] :
                    (yVal as any)[i - 1][index],
                y: number;

            y = typeof calEMA === 'undefined' ?
                SMA : correctFloat((yValue * EMApercent) +
                (calEMA * (1 - EMApercent)));

            return [x, y];
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            this: Highcharts.EMAIndicator,
            series: TLinkedSeries,
            params: Highcharts.EMAIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen = yVal ? yVal.length : 0,
                EMApercent = 2 / (period + 1),
                sum = 0,
                EMA: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                index = -1,
                SMA = 0,
                calEMA: (number|undefined),
                EMAPoint: [number, number],
                i: number;

            // Check period, if bigger than points length, skip
            if (yValLen < period) {
                return;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 0;
            }

            // Accumulate first N-points
            sum = this.accumulatePeriodPoints(
                period,
                index,
                yVal
            );

            // first point
            SMA = sum / period;

            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen + 1; i++) {
                EMAPoint = this.calculateEma(
                    xVal,
                    yVal,
                    i,
                    EMApercent,
                    calEMA,
                    index,
                    SMA
                );
                EMA.push(EMAPoint);
                xData.push(EMAPoint[0]);
                yData.push(EMAPoint[1]);
                calEMA = EMAPoint[1];
            }

            return {
                values: EMA,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `EMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ema
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @apioption series.ema
 */

''; // adds doclet above to the transpiled file
