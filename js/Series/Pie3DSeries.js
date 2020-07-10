/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  3D pie series
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
var pick = U.pick, wrap = U.wrap;
var deg2rad = H.deg2rad, seriesTypes = H.seriesTypes, svg = H.svg;
/**
 * The thickness of a 3D pie.
 *
 * @type      {number}
 * @default   0
 * @since     4.0
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.pie.depth
 */
/* eslint-disable no-invalid-this */
wrap(seriesTypes.pie.prototype, 'translate', function (proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));
    // Do not do this if the chart is not 3D
    if (!this.chart.is3d()) {
        return;
    }
    var series = this, seriesOptions = series.options, depth = seriesOptions.depth || 0, options3d = series.chart.options.chart.options3d, alpha = options3d.alpha, beta = options3d.beta, z = seriesOptions.stacking ?
        (seriesOptions.stack || 0) * depth :
        series._i * depth;
    z += depth / 2;
    if (seriesOptions.grouping !== false) {
        z = 0;
    }
    series.data.forEach(function (point) {
        var shapeArgs = point.shapeArgs, angle;
        point.shapeType = 'arc3d';
        shapeArgs.z = z;
        shapeArgs.depth = depth * 0.75;
        shapeArgs.alpha = alpha;
        shapeArgs.beta = beta;
        shapeArgs.center = series.center;
        angle = (shapeArgs.end + shapeArgs.start) / 2;
        point.slicedTranslation = {
            translateX: Math.round(Math.cos(angle) *
                seriesOptions.slicedOffset *
                Math.cos(alpha * deg2rad)),
            translateY: Math.round(Math.sin(angle) *
                seriesOptions.slicedOffset *
                Math.cos(alpha * deg2rad))
        };
    });
});
wrap(seriesTypes.pie.prototype.pointClass.prototype, 'haloPath', function (proceed) {
    var args = arguments;
    return this.series.chart.is3d() ? [] : proceed.call(this, args[1]);
});
wrap(seriesTypes.pie.prototype, 'pointAttribs', function (proceed, point, state) {
    var attr = proceed.call(this, point, state), options = this.options;
    if (this.chart.is3d() && !this.chart.styledMode) {
        attr.stroke = options.edgeColor || point.color || this.color;
        attr['stroke-width'] = pick(options.edgeWidth, 1);
    }
    return attr;
});
wrap(seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
    if (this.chart.is3d()) {
        var series = this, chart = series.chart, options3d = chart.options.chart.options3d;
        series.data.forEach(function (point) {
            var shapeArgs = point.shapeArgs, r = shapeArgs.r, 
            // #3240 issue with datalabels for 0 and null values
            a1 = (shapeArgs.alpha || options3d.alpha) * deg2rad, b1 = (shapeArgs.beta || options3d.beta) * deg2rad, a2 = (shapeArgs.start + shapeArgs.end) / 2, labelPosition = point.labelPosition, connectorPosition = labelPosition.connectorPosition, yOffset = (-r * (1 - Math.cos(a1)) * Math.sin(a2)), xOffset = r * (Math.cos(b1) - 1) * Math.cos(a2);
            // Apply perspective on label positions
            [
                labelPosition.natural,
                connectorPosition.breakAt,
                connectorPosition.touchingSliceAt
            ].forEach(function (coordinates) {
                coordinates.x += xOffset;
                coordinates.y += yOffset;
            });
        });
    }
    proceed.apply(this, [].slice.call(arguments, 1));
});
wrap(seriesTypes.pie.prototype, 'addPoint', function (proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));
    if (this.chart.is3d()) {
        // destroy (and rebuild) everything!!!
        this.update(this.userOptions, true); // #3845 pass the old options
    }
});
wrap(seriesTypes.pie.prototype, 'animate', function (proceed) {
    if (!this.chart.is3d()) {
        proceed.apply(this, [].slice.call(arguments, 1));
    }
    else {
        var args = arguments, init = args[1], animation = this.options.animation, attribs, center = this.center, group = this.group, markerGroup = this.markerGroup;
        if (svg) { // VML is too slow anyway
            if (animation === true) {
                animation = {};
            }
            // Initialize the animation
            if (init) {
                // Scale down the group and place it in the center
                group.oldtranslateX = pick(group.oldtranslateX, group.translateX);
                group.oldtranslateY = pick(group.oldtranslateY, group.translateY);
                attribs = {
                    translateX: center[0],
                    translateY: center[1],
                    scaleX: 0.001,
                    scaleY: 0.001
                };
                group.attr(attribs);
                if (markerGroup) {
                    markerGroup.attrSetters = group.attrSetters;
                    markerGroup.attr(attribs);
                }
                // Run the animation
            }
            else {
                attribs = {
                    translateX: group.oldtranslateX,
                    translateY: group.oldtranslateY,
                    scaleX: 1,
                    scaleY: 1
                };
                group.animate(attribs, animation);
                if (markerGroup) {
                    markerGroup.animate(attribs, animation);
                }
            }
        }
    }
});
