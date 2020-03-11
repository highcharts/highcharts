/**
 *
 *  (c) 2010-2020 Pawel Fus & Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var reduce = H.reduce;
var reduceArrayMixin = {
    /**
     * Get min value of array filled by OHLC data.
     * @private
     * @param {Array<*>} arr Array of OHLC points (arrays).
     * @param {string} index Index of "low" value in point array.
     * @return {number} Returns min value.
     */
    minInArray: function (arr, index) {
        return reduce(arr, function (min, target) {
            return Math.min(min, target[index]);
        }, Number.MAX_VALUE);
    },
    /**
     * Get max value of array filled by OHLC data.
     * @private
     * @param {Array<*>} arr Array of OHLC points (arrays).
     * @param {string} index Index of "high" value in point array.
     * @return {number} Returns max value.
     */
    maxInArray: function (arr, index) {
        return reduce(arr, function (max, target) {
            return Math.max(max, target[index]);
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
    getArrayExtremes: function (arr, minIndex, maxIndex) {
        return reduce(arr, function (prev, target) {
            return [
                Math.min(prev[0], target[minIndex]),
                Math.max(prev[1], target[maxIndex])
            ];
        }, [Number.MAX_VALUE, -Number.MAX_VALUE]);
    }
};
export default reduceArrayMixin;
