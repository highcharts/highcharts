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

import type ColumnSeries from '../../Series/Column/ColumnSeries';
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

namespace ColumnBoostCanvas {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends ColumnSeries {
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
        ColumnSeriesClass: typeof ColumnSeries
    ): typeof Composition {

        if (composedClasses.indexOf(ColumnSeriesClass) === -1) {
            composedClasses.push(ColumnSeriesClass);

            addEvent(ColumnSeriesClass, 'init', onInit);
        }

        return ColumnSeriesClass as typeof Composition;
    }

    /**
     * @private
     */
    function onInit(
        this: Series
    ): void {
        if (this.type === 'column') {

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
            yBottom: number
        ): void {
            ctx.rect(clientX - 1, plotY, 1, yBottom - plotY);
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnBoostCanvas;
