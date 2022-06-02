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

import type BubbleSeries from '../../Series/Bubble/BubbleSeries';
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

namespace BubbleBoostCanvas {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends BubbleSeries {
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
        BubbleSeriesClass: typeof BubbleSeries
    ): typeof Composition {

        if (composedClasses.indexOf(BubbleSeriesClass) === -1) {
            composedClasses.push(BubbleSeriesClass);

            addEvent(BubbleSeriesClass, 'init', onInit);
        }

        return BubbleSeriesClass as typeof Composition;
    }

    /**
     * @private
     */
    function onInit(
        this: Series
    ): void {
        if (this.type === 'bubble') {

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

        public cvsStrokeBatch = 1;

        /* *
         *
         *  Functions
         *
         * */

        public cvsMarkerCircle(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            r: number,
            i?: number
        ): void {
            const series = this.series;

            ctx.moveTo(clientX, plotY);
            ctx.arc(
                clientX,
                plotY,
                series.radii && (series.radii[i as any] as any),
                0,
                2 * Math.PI,
                false
            );
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default BubbleBoostCanvas;
