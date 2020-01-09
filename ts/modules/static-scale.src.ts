/* *
 *
 *  (c) 2016-2020 Torstein Honsi, Lars Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            redrawTrigger?: string;
            initiatedScale?: boolean;
            /** @requires modules/static-scale */
            adjustHeight(): void;
        }
        interface XAxisOptions {
            staticScale?: number;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    defined,
    isNumber,
    pick
} = U;

var Chart = H.Chart;

/* eslint-disable no-invalid-this */

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

H.addEvent(H.Axis, 'afterSetOptions', function (): void {
    var chartOptions = this.chart.options && this.chart.options.chart;
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
});

Chart.prototype.adjustHeight = function (): void {
    if (this.redrawTrigger !== 'adjustHeight') {
        (this.axes || []).forEach(function (axis: Highcharts.Axis): void {
            var chart = axis.chart,
                animate =
                    !!chart.initiatedScale &&
                    (chart.options as any).animation,
                staticScale = axis.options.staticScale,
                height,
                diff;

            if (axis.staticScale && defined(axis.min)) {
                height = pick(
                    axis.unitLength,
                    (axis.max as any) + axis.tickInterval - axis.min
                ) * (staticScale as any);


                // Minimum height is 1 x staticScale.
                height = Math.max(height, staticScale as any);

                diff = height - chart.plotHeight;

                if (Math.abs(diff) >= 1) {
                    chart.plotHeight = height;
                    chart.redrawTrigger = 'adjustHeight';
                    chart.setSize(void 0, chart.chartHeight + diff, animate);
                }

                // Make sure clip rects have the right height before initial
                // animation.
                axis.series.forEach(function (series: Highcharts.Series): void {
                    var clipRect = series.sharedClipKey &&
                        (chart as any)[series.sharedClipKey];

                    if (clipRect) {
                        clipRect.attr({
                            height: chart.plotHeight
                        });
                    }
                });
            }

        });
        this.initiatedScale = true;
    }
    this.redrawTrigger = null as any;
};
H.addEvent(Chart, 'render', Chart.prototype.adjustHeight);
