/* *
 *
 *  (c) 2010-2019 Kacper Madej
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

        class WMAIndicator extends SMAIndicator {
            public data: Array<WMAIndicatorPoint>;
            public options: WMAIndicatorOptions;
            public pointClass: typeof WMAIndicatorPoint;
            public points: Array<WMAIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: WMAIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
        }

        interface WMAIndicatorOptions extends SMAIndicatorOptions {
            params?: WMAIndicatorParamsOptions;
            states?: SeriesStatesOptionsObject<WMAIndicator>;
        }

        interface WMAIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class WMAIndicatorPoint extends SMAIndicatorPoint {
            public series: WMAIndicator;
        }

        interface SeriesTypesDictionary {
            wma: typeof WMAIndicator;
        }
    }
}


import U from '../parts/Utilities.js';
var isArray = U.isArray;

var seriesType = H.seriesType;

/* eslint-disable valid-jsdoc */
// Utils:
/**
 * @private
 */
function accumulateAverage(
    points: Array<[number, (number|Array<number>)]>,
    xVal: Array<number>,
    yVal: Array<Array<number>>,
    i: number,
    index: number
): void {
    var xValue: number = xVal[i],
        yValue: (number|Array<number>) = index < 0 ? yVal[i] : yVal[i][index];

    points.push([xValue, yValue]);
}

/**
 * @private
 */
function weightedSumArray(
    array: Array<[(number|null), (number|Array<number>)]>,
    pLen: number
): number {
    // The denominator is the sum of the number of days as a triangular number.
    // If there are 5 days, the triangular numbers are 5, 4, 3, 2, and 1.
    // The sum is 5 + 4 + 3 + 2 + 1 = 15.
    var denominator = (pLen + 1) / 2 * pLen;

    // reduce VS loop => reduce
    return (array.reduce(
        function (
            prev: [(number|null), (number|Array<number>)],
            cur: [(number|null), (number|Array<number>)],
            i: number
        ): [(number|null), (number|Array<number>)] {
            return [null, (prev[1] as any) + (cur[1] as any) * (i + 1)];
        })[1] as any) / denominator;
}

/**
 * @private
 */
function populateAverage(
    points: Array<[number, (number|Array<number>)]>,
    xVal: Array<number>,
    yVal: Array<Array<number>>,
    i: number
): Array<number> {
    var pLen = points.length,
        wmaY = weightedSumArray(points, pLen),
        wmaX = xVal[i - 1];

    points.shift(); // remove point until range < period

    return [wmaX, wmaY];
}
/* eslint-enable valid-jsdoc */

/**
 * The SMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.wma
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.WMAIndicator>(
    'wma',
    'sma',
    /**
     * Weighted moving average indicator (WMA). This series requires `linkedTo`
     * option to be set.
     *
     * @sample stock/indicators/wma
     *         Weighted moving average indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/wma
     * @optionparent plotOptions.wma
     */
    {
        params: {
            index: 3,
            period: 9
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.WMAIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = params.period as any,
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen = yVal ? yVal.length : 0,
                range = 1,
                xValue: number = xVal[0],
                yValue: (number|Array<number>) = yVal[0],
                WMA: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                index = -1,
                i: (number|undefined),
                points: Array<[number, (number|Array<number>)]>,
                WMAPoint: (Array<number>|undefined);

            if (xVal.length < period) {
                return;
            }

            // Switch index for OHLC / Candlestick
            if (isArray(yVal[0])) {
                index = (params.index as any);
                yValue = yVal[0][index];
            }
            // Starting point
            points = [[xValue, yValue]];

            // Accumulate first N-points
            while (range !== period) {
                accumulateAverage(points, xVal, yVal, range, index);
                range++;
            }

            // Calculate value one-by-one for each period in visible data
            for (i = range; i < yValLen; i++) {
                WMAPoint = populateAverage(points, xVal, yVal, i);
                WMA.push(WMAPoint);
                xData.push(WMAPoint[0]);
                yData.push(WMAPoint[1]);

                accumulateAverage(points, xVal, yVal, i, index);
            }

            WMAPoint = populateAverage(points, xVal, yVal, i);
            WMA.push(WMAPoint);
            xData.push(WMAPoint[0]);
            yData.push(WMAPoint[1]);

            return {
                values: WMA,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `WMA` series. If the [type](#series.wma.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.wma
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/wma
 * @apioption series.wma
 */

''; // adds doclet above to the transpiled file
