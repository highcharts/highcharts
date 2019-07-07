/**
 *
 *  (c) 2010-2019 Pawel Fus & Daniel Studencki
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
        interface ReduceArrayMixin {
            getArrayExtremes(
                arr: Array<OHLCPoint>,
                minIndex: string,
                maxIndex: string
            ): [number, number];
            maxInArray(arr: Array<OHLCPoint>, index: string): number;
            minInArray(arr: Array<OHLCPoint>, index: string): number;
        }
    }
}

import '../parts/Utilities.js';

var reduce = H.reduce;

var reduceArrayMixin: Highcharts.ReduceArrayMixin = {
    /**
     * Get min value of array filled by OHLC data.
     * @privagte
     * @param {Array<Highcharts.OHLCPoint>} arr Array of OHLC points (arrays).
     * @param {string} index Index of "low" value in point array.
     * @return {number} Returns min value.
     */
    minInArray: function (
        arr: Array<Highcharts.OHLCPoint>,
        index: string
    ): number {
        return reduce(arr, function (
            min: number,
            target: Highcharts.OHLCPoint
        ): number {
            return Math.min(min, (target as any)[index]);
        }, Number.MAX_VALUE);
    },
    /**
     * Get max value of array filled by OHLC data.
     * @private
     * @param {Array<Highcharts.OHLCPoint>} arr Array of OHLC points (arrays).
     * @param {string} index Index of "high" value in point array.
     * @return {number} Returns max value.
     */
    maxInArray: function (
        arr: Array<Highcharts.OHLCPoint>,
        index: string
    ): number {
        return reduce(arr, function (
            max: number,
            target: Highcharts.OHLCPoint
        ): number {
            return Math.max(max, (target as any)[index]);
        }, -Number.MAX_VALUE);
    },
    /**
     * Get extremes of array filled by OHLC data.
     * @private
     * @param {Array<Highcharts.OHLCPoint>} arr Array of OHLC points (arrays).
     * @param {string} minIndex Index of "low" value in point array.
     * @param {string} maxIndex Index of "high" value in point array.
     * @return {Array<number,number>} Returns array with min and max value.
     */
    getArrayExtremes: function (
        arr: Array<Highcharts.OHLCPoint>,
        minIndex: string,
        maxIndex: string
    ): [number, number] {
        return reduce(arr, function (
            prev: [number, number],
            target: Highcharts.OHLCPoint
        ): [number, number] {
            return [
                Math.min(prev[0], (target as any)[minIndex]),
                Math.max(prev[1], (target as any)[maxIndex])
            ];
        }, [Number.MAX_VALUE, -Number.MAX_VALUE]);
    }
};

export default reduceArrayMixin;
