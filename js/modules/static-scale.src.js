/**
 * (c) 2017 Torstein Honsi, Lars Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var Chart = H.Chart,
    each = H.each,
    pick = H.pick;

Chart.prototype.adjustHeight = function () {
    if (this.redrawTrigger !== 'adjustHeight') {
        each(this.axes || [], function (axis) {
            var chart = axis.chart,
                animate = !!chart.initiatedScale && chart.options.animation,
                staticScale = axis.options.staticScale,
                height,
                diff;
            if (
                H.isNumber(staticScale) &&
                !axis.horiz &&
                H.defined(axis.min)
            ) {
                height = pick(
                    axis.unitLength,
                    axis.max + axis.tickInterval - axis.min
                ) * staticScale;


                // Minimum height is 1 x staticScale.
                height = Math.max(height, staticScale);

                diff = height - chart.plotHeight;

                if (Math.abs(diff) >= 1) {
                    chart.plotHeight = height;
                    chart.redrawTrigger = 'adjustHeight';
                    chart.setSize(null, chart.chartHeight + diff, animate);
                }

                // Make sure clip rects have the right height before initial
                // animation.
                each(axis.series, function (series) {
                    var clipRect =
                        series.sharedClipKey && chart[series.sharedClipKey];
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
    this.redrawTrigger = null;
};
H.addEvent(Chart, 'render', Chart.prototype.adjustHeight);
