/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* License: www.highcharts.com/license
*
* This is an experimental Highcharts module which enables visualization
* of a Venn Diagram.
*/
'use strict';
import draw from '../mixins/draw-point.js';
import H from '../parts/Globals.js';
import '../parts/Series.js';
var seriesType = H.seriesType,
    Series = H.Series;

/**
 * Calculate the positions and size of a shape.
 * @param {object} params The parameters required.
 * @returns {object} The resulting shape attributes.
 */
var getShapeArgs = function (params) {
    var xAxis = params.xAxis,
        yAxis = params.yAxis,
        i = params.i;

    return {
        x: xAxis.translate(i * 20),
        y: yAxis.translate(i * 20),
        r: 50
    };
};

var vennOptions = {
};

var vennSeries = {
    /**
     * Owerwrite bindAxes to modify the axes according to a venn diagram.
     * @returns {undefined}
     */
    bindAxes: function () {
        var series = this,
            axis = {
                min: 0,
                max: 100
            };

        // Call original function to bind the axes.
        Series.prototype.bindAxes.call(this);

        // Extend axes with new values.
        H.extend(series.yAxis.options, axis);
        H.extend(series.xAxis.options, axis);
    },
    /**
     * Draw the graphics for each point.
     * @returns {undefined}
     */
    drawPoints: function () {
        var series = this,
            // Series properties
            chart = series.chart,
            group = series.group,
            points = series.points || [],
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            // Chart properties
            renderer = chart.renderer;

        // Iterate all points and calculate and draw their graphics.
        points.forEach(function (point, i) {
            var attr = getShapeArgs({
                    i: i,
                    xAxis: xAxis,
                    yAxis: yAxis
                }),
                css = {
                    color: point.color
                };

            // Draw the point graphic.
            point.draw({
                animate: {},
                attr: attr,
                css: css,
                group: group,
                renderer: renderer,
                shapeType: 'circle'
            });
        });
    }
};

var vennPoint = {
    draw: draw,
    shouldDraw: function () {
        // var point = this;

        // Draw all points for now.
        return true;
    }
};

seriesType('venn', 'line', vennOptions, vennSeries, vennPoint);
