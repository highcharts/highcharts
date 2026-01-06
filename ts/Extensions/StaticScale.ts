/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *  Author: Torstein Honsi, Lars Cabrera
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../Core/Axis/Axis';
import type Chart from '../Core/Chart/Chart';
import type Series from '../Core/Series/Series';

import U from '../Core/Utilities.js';
const {
    addEvent,
    defined,
    isNumber
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Axis/AxisOptions' {
    interface AxisOptions {

        /**
         * For vertical axes only. Setting the static scale ensures that each
         * tick unit is translated into a fixed pixel height. For example,
         * setting the static scale to 24 results in each Y axis category
         * taking up 24 pixels, and the height of the chart adjusts. Adding or
         * removing items will make the chart resize.
         *
         * @sample gantt/xrange-series/demo/
         *         X-range series with static scale
         *
         * @type      {number}
         * @default   50
         * @since     6.2.0
         * @product   gantt
         * @apioption yAxis.staticScale
         */
        staticScale?: number;

    }
}

declare module '../Core/Chart/ChartBase'{
    interface ChartBase {

        /** @internal */
        redrawTrigger?: string;

        /** @internal */
        initiatedScale?: boolean;

        /** @requires modules/static-scale */
        adjustHeight(): void;

    }
}

/* *
 *
 *  Composition
 *
 * */

/** @private */
function compose(
    AxisClass: typeof Axis,
    ChartClass: typeof Chart
): void {
    const chartProto = ChartClass.prototype;

    if (!chartProto.adjustHeight) {
        addEvent(AxisClass, 'afterSetOptions', onAxisAfterSetOptions);

        chartProto.adjustHeight = chartAdjustHeight;

        addEvent(ChartClass, 'render', chartProto.adjustHeight);
    }

}

/** @private */
function onAxisAfterSetOptions(
    this: Axis
): void {
    const chartOptions = this.chart.userOptions.chart;
    if (
        !this.horiz &&
        isNumber(this.options.staticScale) &&
        (
            !chartOptions?.height ||
            chartOptions.scrollablePlotArea?.minHeight
        )
    ) {
        this.staticScale = this.options.staticScale;
    }
}

/** @private */
function chartAdjustHeight(
    this: Chart
): void {
    const chart = this;

    if (chart.redrawTrigger !== 'adjustHeight') {
        for (const axis of (chart.axes || [])) {
            const chart = axis.chart,
                staticScale = axis.options.staticScale;

            if (
                axis.staticScale &&
                staticScale &&
                defined(axis.min) &&
                defined(axis.max)
            ) {
                let height = (axis.brokenAxis?.unitLength ??
                    (axis.max + axis.tickInterval - axis.min)) * (staticScale);

                // Minimum height is 1 x staticScale.
                height = Math.max(height, staticScale);

                const diff = height - chart.plotHeight;

                if (!chart.scrollablePixelsY && Math.abs(diff) >= 1) {
                    chart.plotHeight = height;
                    chart.redrawTrigger = 'adjustHeight';
                    chart.setSize(
                        void 0,
                        chart.chartHeight + diff,
                        chart.initiatedScale ? void 0 : false
                    );
                }

                // Make sure clip rects have the right height before initial
                // animation.
                axis.series.forEach(function (series: Series): void {
                    const clipRect = series.sharedClipKey &&
                        chart.sharedClips[series.sharedClipKey];

                    if (clipRect) {
                        clipRect.attr(chart.inverted ? {
                            width: chart.plotHeight
                        } : {
                            height: chart.plotHeight
                        });
                    }
                });
            }
        }
        this.initiatedScale = true;
    }
    this.redrawTrigger = void 0;
}

/* *
 *
 *  Default Export
 *
 * */

const StaticScale = {
    compose
};

export default StaticScale;

/* *
 *
 *  API Options
 *
 * */

/**
 * For vertical axes only. Setting the static scale ensures that each tick unit
 * is translated into a fixed pixel height. For example, setting the static
 * scale to 24 results in each Y axis category taking up 24 pixels, and the
 * height of the chart adjusts. Adding or removing items will make the chart
 * resize.
 *
 * @sample gantt/xrange-series/demo/
 *         X-range series with static scale
 *
 * @type      {number}
 * @default   50
 * @since     6.2.0
 * @product   gantt
 * @apioption yAxis.staticScale
 */

''; // Keeps doclets above in JS file
