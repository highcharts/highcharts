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

        class WmaIndicator extends SmaIndicator {
            public data: Array<WmaIndicatorPoint>;
            public options: WmaIndicatorOptions;
            public pointClass: typeof WmaIndicatorPoint;
            public points: Array<WmaIndicatorPoint>;
            public getValues(
                series: Series,
                params: Dictionary<number>
            ): (boolean|IndicatorValuesObject);
            public yData: Array<number>;
        }

        class WmaIndicatorPoint extends SmaIndicatorPoint {
            public series: WmaIndicator;
        }

        interface SeriesTypesDictionary {
            wma: typeof WmaIndicator;
        }

        interface WmaIndicatorOptions extends SmaIndicatorOptions {
            params?: WmaIndicatorParamsOptions;
            states?: SeriesStatesOptionsObject<WmaIndicator>;
        }

        interface WmaIndicatorParamsOptions
            extends Dictionary<number> {
            index: number;
            period: number;
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
    points: Array<Array<(number|null|undefined)>>,
    xVal: Array<number>,
    yVal: Array<(
        number|
        Array<(number|null|undefined)>|
        null|
        undefined
    )>,
    i: number,
    index: number
): void {
    var xValue = xVal[i],
        yValue = index < 0 ? yVal[i] : (yVal[i] as any)[index];

    points.push([xValue, yValue]);
}

/**
 * @private
 */
function weightedSumArray(
    array: Array<Array<(number|null|undefined)>>,
    pLen: number
): number {
    // The denominator is the sum of the number of days as a triangular number.
    // If there are 5 days, the triangular numbers are 5, 4, 3, 2, and 1.
    // The sum is 5 + 4 + 3 + 2 + 1 = 15.
    var denominator = (pLen + 1) / 2 * pLen;

    // reduce VS loop => reduce
    return (array.reduce(
        function (
            prev: Array<(number|null|undefined)>,
            cur: Array<(number|null|undefined)>,
            i: number
        ): Array<(number|null)> {
            return [null, (prev[1] as any) + (cur[1] as any) * (i + 1)];
        })[1] as any) / denominator;
}

/**
 * @private
 */
function populateAverage(
    points: Array<Array<(number|null|undefined)>>,
    xVal: Array<number>,
    yVal: Array<(
        number|
        Array<(number|null|undefined)>|
        null|
        undefined
    )>,
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
seriesType<Highcharts.WmaIndicator>(
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
        getValues: function (
            series: Highcharts.Series,
            params: Highcharts.Dictionary<(number)>
        ): (boolean|Highcharts.IndicatorValuesObject) {
            var period: number = params.period as any,
                xVal: Array<number> = (series.xData as any),
                yVal: Array<(
                    number|Array<(number|null|undefined)>|null|undefined
                )> = (series.yData as any),
                yValLen = yVal ? yVal.length : 0,
                range = 1,
                xValue = xVal[0],
                yValue = yVal[0],
                WMA: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                index = -1,
                i: (number|undefined),
                points: Array<Array<(number|null|undefined)>>,
                WMAPoint: (Array<number>|undefined);

            if (xVal.length < period) {
                return false;
            }

            // Switch index for OHLC / Candlestick
            if (isArray(yVal[0])) {
                index = (params.index);
                yValue = (yVal[0] as any)[index];
            }
            // Starting point
            points = [[xValue, (yValue as any)]];

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
            };
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
 * @apioption series.wma
 */

''; // adds doclet above to the transpiled file
