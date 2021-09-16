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

/* *
 *
 *  Functions
 *
 * */

/**
 * Get extremes of array filled by OHLC data.
 *
 * @private
 *
 * @param {Array<Array<number>>} arr
 * Array of OHLC points (arrays).
 *
 * @param {number} minIndex
 * Index of "low" value in point array.
 *
 * @param {number} maxIndex
 * Index of "high" value in point array.
 *
 * @return {Array<number,number>}
 * Returns array with min and max value.
 */
function getArrayExtremes<T extends Array<number>>(
    arr: Array<T>,
    minIndex: number,
    maxIndex: number
): ArrayUtilities.Extremes {
    return arr.reduce(
        (
            prev,
            target
        ): [number, number] => [
            Math.min(prev[0], target[minIndex]),
            Math.max(prev[1], target[maxIndex])
        ],
        [Number.MAX_VALUE, -Number.MAX_VALUE]
    );
}

/* *
 *
 *  Namespace
 *
 * */

namespace ArrayUtilities {

    /** 0: min, 1: max */
    export type Extremes = [number, number];

}

/* *
 *
 *  Default Export
 *
 * */

const ArrayUtilities = {
    getArrayExtremes
};

export default ArrayUtilities;
