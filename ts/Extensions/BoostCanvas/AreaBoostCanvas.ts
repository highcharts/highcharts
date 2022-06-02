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

import type AreaSeries from '../../Series/Area/AreaSeries';
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

namespace AreaBoostCanvas {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends AreaSeries {
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
        AreaSeriesClass: typeof AreaSeries
    ): typeof Composition {

        if (composedClasses.indexOf(AreaSeriesClass) === -1) {
            composedClasses.push(AreaSeriesClass);

            addEvent(AreaSeriesClass, 'init', onInit);
        }

        return AreaSeriesClass as typeof Composition;
    }

    /**
     * @private
     */
    function onInit(
        this: Series
    ): void {
        if (this.type === 'area') {

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

        public fillOpacity = true;

        public sampling = true;

        /* *
         *
         *  Functions
         *
         * */

        public cvsDrawPoint(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            yBottom: number,
            lastPoint: Record<string, number>
        ): void {
            if (lastPoint && clientX !== lastPoint.clientX) {
                ctx.moveTo(lastPoint.clientX as any, lastPoint.yBottom as any);
                ctx.lineTo(lastPoint.clientX as any, lastPoint.plotY as any);
                ctx.lineTo(clientX, plotY);
                ctx.lineTo(clientX, yBottom);
            }
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default AreaBoostCanvas;
