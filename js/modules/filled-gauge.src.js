/**
 * Filled angular gauge module for Highcharts
 * License: www.highcharts.com/license
 * Author: Torstein Honsi
 * Version: 0.0.1
 * http://jsfiddle.net/highcharts/5FnPZ/
 */

/*global Highcharts*/
(function (H) {
    "use strict";

    var defaultPlotOptions = H.getOptions().plotOptions,
        pInt = H.pInt,
        pick = H.pick;

    // The default options
    defaultPlotOptions.filledgauge = H.merge(defaultPlotOptions.gauge, {
        colorByPoint: true
    });

    // The series prototype
    H.seriesTypes.filledgauge = H.extendClass(H.seriesTypes.gauge, {
        type: 'filledgauge',

        /**
         * Draw the points where each point is one needle
         */
        drawPoints: function () {
            var series = this,
                yAxis = series.yAxis,
                center = yAxis.center,
                options = series.options,
                renderer = series.chart.renderer;

            H.each(series.points, function (point) {
                var graphic = point.graphic,
                    rotation = yAxis.startAngleRad + yAxis.translate(point.y, null, null, null, true),
                    radius = (pInt(pick(options.radius, 100)) * center[2]) / 200,
                    innerRadius = (pInt(pick(options.innerRadius, 60)) * center[2]) / 200,
                    shapeArgs,
                    d;

                // Handle the wrap option
                if (options.wrap === false) {
                    rotation = Math.max(yAxis.startAngleRad, Math.min(yAxis.endAngleRad, rotation));
                }
                rotation = rotation * 180 / Math.PI;

                shapeArgs = {
                    x: center[0],
                    y: center[1],
                    r: radius,
                    innerR: innerRadius,
                    start: yAxis.startAngleRad,
                    end: rotation / (180 / Math.PI)
                };

                if (graphic) {
                    d = shapeArgs.d;
                    graphic.animate(shapeArgs);
                    shapeArgs.d = d; // animate alters it
                } else {
                    point.graphic = renderer.arc(shapeArgs)
                        .attr({
                            stroke: options.borderColor || 'none',
                            'stroke-width': options.borderWidth || 0,
                            fill: point.color
                        })
                        .add(series.group);
                }
            });
        },
        animate: null
    });

}(Highcharts));