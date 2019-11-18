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
        class ZigzagIndicator extends SMAIndicator {
            public data: Array<ZigzagIndicatorPoint>;
            public nameBase: string;
            public nameComponents: Array<string>;
            public nameSuffixes: Array<string>;
            public options: ZigzagIndicatorOptions;
            public pointClass: typeof ZigzagIndicatorPoint;
            public points: Array<ZigzagIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: ZigzagIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
        }
        class ZigzagIndicatorPoint extends SMAIndicatorPoint {
            series: ZigzagIndicator;
        }
        interface SeriesTypesDictionary {
            zigzag: typeof ZigzagIndicator;
        }

        interface ZigzagIndicatorOptions extends SMAIndicatorOptions {
            params?: ZigzagIndicatorParamsOptions;
        }
        interface ZigzagIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            deviation?: number;
            highIndex?: number;
            index?: undefined;
            lowIndex?: number;
            period?: undefined;
        }
    }
}

import '../parts/Utilities.js';

var seriesType = H.seriesType,
    UNDEFINED: undefined;

/**
 * The Zig Zag series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.zigzag
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.ZigzagIndicator>(
    'zigzag',
    'sma',
    /**
     * Zig Zag indicator.
     *
     * This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/zigzag
     *         Zig Zag indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/zigzag
     * @optionparent plotOptions.zigzag
     */
    {
        /**
         * @excluding index, period
         */
        params: {
            /**
             * The point index which indicator calculations will base - low
             * value.
             *
             * For example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             */
            lowIndex: 2,
            /**
             * The point index which indicator calculations will base - high
             * value.
             *
             * For example using OHLC data, index=1 means the indicator will be
             * calculated using High values.
             */
            highIndex: 1,
            /**
             * The threshold for the value change.
             *
             * For example deviation=1 means the indicator will ignore all price
             * movements less than 1%.
             */
            deviation: 1
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameComponents: ['deviation'],
        nameSuffixes: ['%'],
        nameBase: 'Zig Zag',
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            this: Highcharts.ZigzagIndicator,
            series: TLinkedSeries,
            params: Highcharts.ZigzagIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var lowIndex: number = params.lowIndex as any,
                highIndex: number = params.highIndex as any,
                deviation = (params.deviation as any) / 100,
                deviations = {
                    'low': 1 + deviation,
                    'high': 1 - deviation
                },
                xVal = series.xData,
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen = yVal ? yVal.length : 0,
                zigzag: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                i: number,
                j: (number|undefined),
                zigzagPoint: (Array<number>|undefined),
                firstZigzagLow: number,
                firstZigzagHigh: number,
                directionUp: (boolean|undefined),
                zigzagLen: (number|undefined),
                exitLoop = false,
                yIndex: (boolean|number) = false;

            // Exit if not enught points or no low or high values
            if (
                !xVal || xVal.length <= 1 ||
                (
                    yValLen &&
                    (
                        yVal[0][lowIndex] === UNDEFINED ||
                        yVal[0][highIndex] === UNDEFINED
                    )
                )
            ) {
                return;
            }

            // Set first zigzag point candidate
            firstZigzagLow = yVal[0][lowIndex];
            firstZigzagHigh = yVal[0][highIndex];

            // Search for a second zigzag point candidate,
            // this will also set first zigzag point
            for (i = 1; i < yValLen; i++) {
                // requried change to go down
                if (yVal[i][lowIndex] <= firstZigzagHigh * deviations.high) {
                    zigzag.push([xVal[0], firstZigzagHigh]);
                    // second zigzag point candidate
                    zigzagPoint = [xVal[i], yVal[i][lowIndex]];
                    // next line will be going up
                    directionUp = true;
                    exitLoop = true;

                    // requried change to go up
                } else if (
                    yVal[i][highIndex] >= firstZigzagLow * deviations.low
                ) {
                    zigzag.push([xVal[0], firstZigzagLow]);
                    // second zigzag point candidate
                    zigzagPoint = [xVal[i], yVal[i][highIndex]];
                    // next line will be going down
                    directionUp = false;
                    exitLoop = true;

                }
                if (exitLoop) {
                    xData.push(zigzag[0][0]);
                    yData.push(zigzag[0][1]);
                    j = i++;
                    i = yValLen;
                }
            }

            // Search for next zigzags
            for (i = (j as any); i < yValLen; i++) {
                if (directionUp) { // next line up

                    // lower when going down -> change zigzag candidate
                    if (yVal[i][lowIndex] <= (zigzagPoint as any)[1]) {
                        zigzagPoint = [xVal[i], yVal[i][lowIndex]];
                    }

                    // requried change to go down -> new zigzagpoint and
                    // direction change
                    if (
                        yVal[i][highIndex] >=
                        (zigzagPoint as any)[1] * deviations.low
                    ) {
                        yIndex = highIndex;
                    }

                } else { // next line down

                    // higher when going up -> change zigzag candidate
                    if (yVal[i][highIndex] >= (zigzagPoint as any)[1]) {
                        zigzagPoint = [xVal[i], yVal[i][highIndex]];
                    }

                    // requried change to go down -> new zigzagpoint and
                    // direction change
                    if (
                        yVal[i][lowIndex] <=
                        (zigzagPoint as any)[1] * deviations.high
                    ) {
                        yIndex = lowIndex;
                    }
                }
                if (yIndex !== false) { // new zigzag point and direction change
                    zigzag.push(zigzagPoint as any);
                    xData.push((zigzagPoint as any)[0]);
                    yData.push((zigzagPoint as any)[1]);
                    zigzagPoint = [xVal[i], yVal[i][yIndex]];
                    directionUp = !directionUp;

                    yIndex = false;
                }
            }

            zigzagLen = zigzag.length;

            // no zigzag for last point
            if (
                zigzagLen !== 0 &&
                zigzag[zigzagLen - 1][0] < xVal[yValLen - 1]
            ) {
                // set last point from zigzag candidate
                zigzag.push(zigzagPoint as any);
                xData.push((zigzagPoint as any)[0]);
                yData.push((zigzagPoint as any)[1]);
            }
            return {
                values: zigzag,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `Zig Zag` series. If the [type](#series.zigzag.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.zigzag
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/zigzag
 * @apioption series.zigzag
 */

''; // adds doclets above to transpiled file
