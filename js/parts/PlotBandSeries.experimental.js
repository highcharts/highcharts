/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
/* ****************************************************************************
 * Start PlotBand series code                                                 *
 *****************************************************************************/
/**
 * This is an experiment of implementing plotBands and plotLines as a series.
 * It could solve problems with export, updating etc., add tooltip and mouse
 * events, and provide a more compact and consistent implementation.
 * Demo: https://jsfiddle.net/highcharts/5Rbf6/
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Series.js';
import './Options.js';
var seriesType = H.seriesType,
    Series = H.Series;

seriesType('plotband', 'column', {
    lineWidth: 0,
    threshold: null
}, {
    // mapping between SVG attributes and the corresponding options
    pointAttrToOptions: {
        fill: 'color',
        stroke: 'lineColor',
        'stroke-width': 'lineWidth'
    },
    animate: function () {},

    translate: function () {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        Series.prototype.translate.apply(series);

        series.points.forEach(function (point) {
            var onXAxis = point.onXAxis,
                ownAxis = onXAxis ? xAxis : yAxis,
                otherAxis = onXAxis ? yAxis : xAxis,
                from = ownAxis.toPixels(point.from, true),
                to = ownAxis.toPixels(point.to, true),
                start = Math.min(from, to),
                width = Math.abs(to - from);

            point.plotY = 1; // lure ColumnSeries.drawPoints
            point.shapeType = 'rect';
            point.shapeArgs = ownAxis.horiz ? {
                x: start,
                y: 0,
                width: width,
                height: otherAxis.len
            } : {
                x: 0,
                y: start,
                width: otherAxis.len,
                height: width
            };
        });
    }


});
/* ****************************************************************************
 * End PlotBand series code                                                   *
 *****************************************************************************/
