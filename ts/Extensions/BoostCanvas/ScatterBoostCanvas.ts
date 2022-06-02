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

import type ScatterSeries from '../../Series/Scatter/ScatterSeries';
import type Series from '../../Core/Series/Series';

import SeriesBoostCanvas from './SeriesBoostCanvas.js';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace ScatterBoostCanvas {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends ScatterSeries {
        boostCanvas: Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose(
        ScatterSeriesClass: typeof ScatterSeries
    ): typeof Composition {

        if (composedClasses.indexOf(ScatterSeriesClass) === -1) {
            composedClasses.push(ScatterSeriesClass);

            addEvent(ScatterSeriesClass, 'init', onInit);
        }

        return ScatterSeriesClass as typeof Composition;
    }

    /**
     * @private
     */
    function onInit(
        this: Series
    ): void {
        if (this.type === 'scatter') {

            if (
                this.boostCanvas &&
                !(this.boostCanvas instanceof Additions)
            ) {
                this.boostCanvas.destroy();
            }

            this.boostCanvas = new Additions(this as Composition);
        }
    }

    /* *
     *
     *  Classes
     *
     * */


    export class Additions extends SeriesBoostCanvas.Additions {

        /* *
         *
         *  Properties
         *
         * */

        public fill = true;

        /* *
         *
         *  Functions
         *
         * */

        public cvsMarkerCircle(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            r: number
        ): void {
            ctx.moveTo(clientX, plotY);
            ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
        }

        /**
         * Rect is twice as fast as arc, should be used for small markers.
         */
        public cvsMarkerSquare(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            r: number
        ): void {
            ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ScatterBoostCanvas;
