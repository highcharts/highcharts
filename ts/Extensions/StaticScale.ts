/* *
 *
 *  (c) 2016-2021 Torstein Honsi, Lars Cabrera
 *
 *  License: www.highcharts.com/license
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

import type Axis from '../Core/Axis/Axis';
import type Chart from '../Core/Chart/Chart';
import type Series from '../Core/Series/Series';

import U from '../Core/Utilities.js';
const {
    addEvent,
    defined,
    isNumber,
    pick,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Axis/AxisOptions' {
    interface AxisOptions {
        staticScale?: number;
    }
}

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        redrawTrigger?: string;
        initiatedScale?: boolean;
        /** @requires modules/static-scale */
        adjustHeight(): void;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

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

    if (pushUnique(composedMembers, AxisClass)) {
        addEvent(AxisClass, 'afterSetOptions', onAxisAfterSetOptions);
    }

    if (pushUnique(composedMembers, ChartClass)) {
        const chartProto = ChartClass.prototype;

        chartProto.adjustHeight = chartAdjustHeight;

        addEvent(ChartClass, 'render', chartProto.adjustHeight);
    }

}

/** @private */
function onAxisAfterSetOptions(
    this: Axis
): void {
    const chartOptions = this.chart.options.chart;
    if (
        !this.horiz &&
        isNumber(this.options.staticScale) &&
        (
            !(chartOptions as any).height ||
            (
                (chartOptions as any).scrollablePlotArea &&
                (chartOptions as any).scrollablePlotArea.minHeight
            )
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
                animate =
                    !!chart.initiatedScale &&
                    (chart.options as any).animation,
                staticScale = axis.options.staticScale;

            if (axis.staticScale && defined(axis.min)) {
                let height = pick(
                    axis.brokenAxis && axis.brokenAxis.unitLength,
                    (axis.max as any) + axis.tickInterval - axis.min
                ) * (staticScale as any);


                // Minimum height is 1 x staticScale.
                height = Math.max(height, staticScale as any);

                let diff = height - chart.plotHeight;

                if (!chart.scrollablePixelsY && Math.abs(diff) >= 1) {
                    chart.plotHeight = height;
                    chart.redrawTrigger = 'adjustHeight';
                    chart.setSize(void 0, chart.chartHeight + diff, animate);
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
    this.redrawTrigger = null as any;
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

''; // keeps doclets above in JS file
