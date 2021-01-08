/**
 *
 *  (c) 2010-2021 Pawel Fus & Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../Core/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ReduceArrayMixin {
            getArrayExtremes<T>(
                arr: Array<T>,
                minIndex: keyof T,
                maxIndex: keyof T
            ): [number, number];
            maxInArray<T>(arr: Array<T>, index: keyof T): number;
            minInArray<T>(arr: Array<T>, index: keyof T): number;
        }
    }
}

import '../Core/Utilities.js';

const reduceArrayMixin: Highcharts.ReduceArrayMixin = {
    /**
     * Get min value of array filled by OHLC data.
     * @private
     * @param {Array<*>} arr Array of OHLC points (arrays).
     * @param {string} index Index of "low" value in point array.
     * @return {number} Returns min value.
     */
    minInArray: function <T> (arr: Array<T>, index: keyof T): number {
        return arr.reduce(function (min: number, target: T): number {
            return Math.min(min, target[index] as any);
        }, Number.MAX_VALUE);
    },
    /**
     * Get max value of array filled by OHLC data.
     * @private
     * @param {Array<*>} arr Array of OHLC points (arrays).
     * @param {string} index Index of "high" value in point array.
     * @return {number} Returns max value.
     */
    maxInArray: function <T> (arr: Array<T>, index: keyof T): number {
        return arr.reduce(function (max: number, target: T): number {
            return Math.max(max, target[index] as any);
        }, -Number.MAX_VALUE);
    },
    /**
     * Get extremes of array filled by OHLC data.
     * @private
     * @param {Array<*>} arr Array of OHLC points (arrays).
     * @param {string} minIndex Index of "low" value in point array.
     * @param {string} maxIndex Index of "high" value in point array.
     * @return {Array<number,number>} Returns array with min and max value.
     */
    getArrayExtremes: function <T> (
        arr: Array<T>,
        minIndex: keyof T,
        maxIndex: keyof T
    ): [number, number] {
        return arr.reduce(function (
            prev: [number, number],
            target: T
        ): [number, number] {
            return [
                Math.min(prev[0], target[minIndex] as any),
                Math.max(prev[1], target[maxIndex] as any)
            ];
        }, [Number.MAX_VALUE, -Number.MAX_VALUE]);
    }
};

export default reduceArrayMixin;
