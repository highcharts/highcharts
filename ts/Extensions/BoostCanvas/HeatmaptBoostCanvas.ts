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

import type HeatmapSeries from '../../Series/Heatmap/HeatmapSeries';
import type ScatterSeries from '../../Series/Scatter/ScatterSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

import ScatterBoostCanvas from './ScatterBoostCanvas.js';
import U from '../../Core/Utilities.js';
const {
    wrap
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace HeatmapBoostCanvas {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends HeatmapSeries {
        boostCanvas: ScatterBoostCanvas.Additions;
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
        HeatmapSeriesClass: typeof HeatmapSeries,
        ScatterSeriesClass: typeof ScatterSeries
    ): typeof Composition {

        if (composedClasses.indexOf(HeatmapSeriesClass) === -1) {
            composedClasses.push(HeatmapSeriesClass);

            const heatmapProto = HeatmapSeriesClass.prototype as Composition;

            wrap(heatmapProto, 'drawPoints', drawPoints);

            ScatterBoostCanvas.compose(ScatterSeriesClass);
        }

        return HeatmapSeriesClass as (typeof Composition);
    }

    /**
     * @private
     */
    function drawPoints(
        this: Composition
    ): void {
        const chart = this.chart,
            ctx = this.boostCanvas.getContext(),
            inverted = this.chart.inverted,
            xAxis = this.xAxis,
            yAxis = this.yAxis;

        if (ctx) {

            // draw the columns
            this.points.forEach(function (point): void {
                let plotY = point.plotY,
                    pointAttr: SVGAttributes;

                if (
                    typeof plotY !== 'undefined' &&
                    !isNaN(plotY) &&
                    point.y !== null &&
                    ctx
                ) {
                    const { x = 0, y = 0, width = 0, height = 0 } =
                        point.shapeArgs || {};

                    if (!chart.styledMode) {
                        pointAttr = point.series.pointAttribs(point);
                    } else {
                        pointAttr = point.series.colorAttribs(point);
                    }

                    ctx.fillStyle = pointAttr.fill as any;

                    if (inverted) {
                        ctx.fillRect(
                            yAxis.len - y + xAxis.left,
                            xAxis.len - x + yAxis.top,
                            -height,
                            -width
                        );
                    } else {
                        ctx.fillRect(
                            x + xAxis.left,
                            y + yAxis.top,
                            width,
                            height
                        );
                    }
                }
            });

            this.boostCanvas.canvasToSVG();

        } else {
            this.chart.showLoading(
                'Your browser doesn\'t support HTML5 canvas, <br>' +
                'please use a modern browser'
            );

            // Uncomment this to provide low-level (slow) support in oldIE.
            // It will cause script errors on charts with more than a few
            // thousand points.
            // arguments[0].call(this);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default HeatmapBoostCanvas;
