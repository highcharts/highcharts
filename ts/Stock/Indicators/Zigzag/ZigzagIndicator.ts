/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kacper Madej
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { IndicatorLinkedSeriesBase } from '../IndicatorBase';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    ZigzagOptions,
    ZigzagParamsOptions
} from './ZigzagOptions';
import type ZigzagPoint from './ZigzagPoint';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const { sma: SMAIndicator } = SeriesRegistry.seriesTypes;
import U from '../../../Core/Utilities.js';
const {
    merge,
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Zig Zag series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.zigzag
 *
 * @augments Highcharts.Series
 */

class ZigzagIndicator extends SMAIndicator {

    /* *
     *
     *  Static Properties
     *
     * */

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
    public static defaultOptions: ZigzagOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding index, period
         */
        params: {
            // Index and period are unchangeable, do not inherit (#15362)
            index: void 0,
            period: void 0,
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
    } as ZigzagOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<ZigzagPoint>;
    public points!: Array<ZigzagPoint>;
    public options!: ZigzagOptions;

    /* *
     *
     *  Functions
     *
     * */

    getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries&IndicatorLinkedSeriesBase,
        params: ZigzagParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const lowIndex: number = params.lowIndex as any,
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
            yData: Array<number> = [];

        let i: number,
            j: (number|undefined),
            zigzagPoint: (Array<number>|undefined),
            directionUp: (boolean|undefined),
            exitLoop = false,
            yIndex: (boolean|number) = false;

        // Exit if not enough points or no low or high values
        if (
            !xVal || xVal.length <= 1 ||
            (
                yValLen &&
                (
                    typeof yVal[0][lowIndex] === 'undefined' ||
                    typeof yVal[0][highIndex] === 'undefined'
                )
            )
        ) {
            return;
        }

        // Set first zigzag point candidate
        const firstZigzagLow = yVal[0][lowIndex],
            firstZigzagHigh = yVal[0][highIndex];

        // Search for a second zigzag point candidate,
        // this will also set first zigzag point
        for (i = 1; i < yValLen; i++) {
            // Required change to go down
            if (yVal[i][lowIndex] <= firstZigzagHigh * deviations.high) {
                zigzag.push([xVal[0], firstZigzagHigh]);
                // Second zigzag point candidate
                zigzagPoint = [xVal[i], yVal[i][lowIndex]];
                // Next line will be going up
                directionUp = true;
                exitLoop = true;

                // Required change to go up
            } else if (
                yVal[i][highIndex] >= firstZigzagLow * deviations.low
            ) {
                zigzag.push([xVal[0], firstZigzagLow]);
                // Second zigzag point candidate
                zigzagPoint = [xVal[i], yVal[i][highIndex]];
                // Next line will be going down
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
            if (directionUp) { // Next line up

                // lower when going down -> change zigzag candidate
                if (yVal[i][lowIndex] <= (zigzagPoint as any)[1]) {
                    zigzagPoint = [xVal[i], yVal[i][lowIndex]];
                }

                // Required change to go down -> new zigzagpoint and
                // direction change
                if (
                    yVal[i][highIndex] >=
                    (zigzagPoint as any)[1] * deviations.low
                ) {
                    yIndex = highIndex;
                }

            } else { // Next line down

                // higher when going up -> change zigzag candidate
                if (yVal[i][highIndex] >= (zigzagPoint as any)[1]) {
                    zigzagPoint = [xVal[i], yVal[i][highIndex]];
                }

                // Required change to go down -> new zigzagpoint and
                // direction change
                if (
                    yVal[i][lowIndex] <=
                    (zigzagPoint as any)[1] * deviations.high
                ) {
                    yIndex = lowIndex;
                }
            }
            if (yIndex !== false) { // New zigzag point and direction change
                zigzag.push(zigzagPoint as any);
                xData.push((zigzagPoint as any)[0]);
                yData.push((zigzagPoint as any)[1]);
                zigzagPoint = [xVal[i], yVal[i][yIndex]];
                directionUp = !directionUp;

                yIndex = false;
            }
        }

        const zigzagLen = zigzag.length;

        // No zigzag for last point
        if (
            zigzagLen !== 0 &&
            zigzag[zigzagLen - 1][0] < xVal[yValLen - 1]
        ) {
            // Set last point from zigzag candidate
            zigzag.push(zigzagPoint as any);
            xData.push((zigzagPoint as any)[0]);
            yData.push((zigzagPoint as any)[1]);
        }
        return {
            values: zigzag,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface ZigzagIndicator {
    nameComponents: Array<string>;
    nameSuffixes: Array<string>;
    nameBase: string;
    pointClass: typeof ZigzagPoint;
}

extend(ZigzagIndicator.prototype, {
    nameComponents: ['deviation'],
    nameSuffixes: ['%'],
    nameBase: 'Zig Zag'
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        zigzag: typeof ZigzagIndicator;
    }
}

SeriesRegistry.registerSeriesType('zigzag', ZigzagIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default ZigzagIndicator;

/* *
 *
 *  API Options
 *
 * */

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

''; // Adds doclets above to transpiled file
