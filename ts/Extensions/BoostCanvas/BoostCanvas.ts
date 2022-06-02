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

import type Chart from '../../Core/Chart/Chart';
import type Series from '../../Core/Series/Series.js';
import type { SeriesTypeRegistry } from '../../Core/Series/SeriesType';

import AreaBoostCanvas from './AreaBoostCanvas.js';
import BubbleBoostCanvas from './BubbleBoostCanvas.js';
import ColumnBoostCanvas from './ColumnBoostCanvas.js';
import HeatmapBoostCanvas from './HeatmaptBoostCanvas.js';
import ScatterBoostCanvas from './ScatterBoostCanvas.js';
import SeriesBoostCanvas from './SeriesBoostCanvas.js';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/* *
 *
 *  Namespace
 *
 * */

namespace BoostCanvas {

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

    /**
     * @private
     */
    export function compose(
        ChartClass: typeof Chart,
        SeriesClass: typeof Series,
        seriesTypes: SeriesTypeRegistry
    ): void {
        const areaClass = seriesTypes['area'],
            bubbleClass = seriesTypes['bubble'],
            columnClass = seriesTypes['column'],
            heatmapClass = seriesTypes['heatmap'],
            scatterClass = seriesTypes['scatter'];

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            ChartClass.prototype.callbacks.push(onChartCallback);
        }


        if (areaClass) {
            AreaBoostCanvas.compose(areaClass);
        }

        if (bubbleClass) {
            BubbleBoostCanvas.compose(bubbleClass);
        }

        if (columnClass) {
            ColumnBoostCanvas.compose(columnClass);
        }

        if (scatterClass) {
            ScatterBoostCanvas.compose(scatterClass);

            if (heatmapClass) {
                HeatmapBoostCanvas.compose(heatmapClass, scatterClass);
            }
        }

        if (SeriesClass) {
            SeriesBoostCanvas.compose(SeriesClass);
        }
    }

    /**
     * @private
     */
    function onChartCallback(
        this: Chart
    ): void {
        addEvent(this, 'predraw', onChartClear);
        addEvent(this, 'render', onChartCanvasToSVG);
    }

    /**
     * @private
     */
    function onChartCanvasToSVG(this: Chart): void {
        if (this.boostCopy) {
            this.boostCopy();
        }
    }

    /**
     * @private
     */
    function onChartClear(this: Chart): void {
        if (this.renderTarget) {
            this.renderTarget.attr({ href: '' });
        }

        if (this.canvas) {
            (this.canvas.getContext('2d') as any).clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default BoostCanvas;
