/* *
 *
 *  License: www.highcharts.com/license
 *  Author: Torstein Honsi, Christer Vasseng
 *
 *  This module serves as a fallback for the Boost module in IE9 and IE10. Newer
 *  browsers support WebGL which is faster.
 *
 *  It is recommended to include this module in conditional comments targeting
 *  IE9 and IE10.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import G from '../../Core/Globals.js';
const {
    win
} = G;

/* *
 *
 *  Constants
 *
 * */

const CHUNK_SIZE = 3000;

/* *
 *
 *  Functions
 *
 * */

/**
 * An "async" foreach loop. Uses a setTimeout to keep the loop from blocking the
 * UI thread.
 *
 * @private
 *
 * @param arr {Array} - the array to loop through
 * @param fn {Function} - the callback to call for each item
 * @param finalFunc {Function} - the callback to call when done
 * @param chunkSize {Number} - the number of iterations per timeout
 * @param i {Number} - the current index
 * @param noTimeout {Boolean} - set to true to skip timeouts
 */
function eachAsync(
    arr: Array<unknown>,
    fn: Function,
    finalFunc: Function,
    chunkSize?: number,
    i?: number,
    noTimeout?: boolean
): void {
    i = i || 0;
    chunkSize = chunkSize || CHUNK_SIZE;

    let threshold = i + chunkSize,
        proceed = true;

    while (proceed && i < threshold && i < arr.length) {
        proceed = fn(arr[i], i);
        ++i;
    }

    if (proceed) {
        if (i < arr.length) {

            if (noTimeout) {
                eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout);
            } else if (win.requestAnimationFrame) {
                // If available, do requestAnimationFrame - shaves off a few ms
                win.requestAnimationFrame(function (): void {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            } else {
                setTimeout(function (): void {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            }

        } else if (finalFunc) {
            finalFunc();
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

const BoostCanvasUtilities = {
    eachAsync
};

export default BoostCanvasUtilities;
