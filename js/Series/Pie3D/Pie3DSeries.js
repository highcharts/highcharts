/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  3D pie series
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import H from '../../Core/Globals.js';
var deg2rad = H.deg2rad, svg = H.svg;
import Pie3DPoint from './Pie3DPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var PieSeries = SeriesRegistry.seriesTypes.pie;
import U from '../../Core/Utilities.js';
var extend = U.extend, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
var Pie3DSeries = /** @class */ (function (_super) {
    __extends(Pie3DSeries, _super);
    function Pie3DSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    Pie3DSeries.prototype.addPoint = function () {
        _super.prototype.addPoint.apply(this, arguments);
        if (this.chart.is3d()) {
            // destroy (and rebuild) everything!!!
            this.update(this.userOptions, true); // #3845 pass the old options
        }
    };
    /**
     * @private
     */
    Pie3DSeries.prototype.animate = function (init) {
        if (!this.chart.is3d()) {
            _super.prototype.animate.apply(this, arguments);
        }
        else {
            var animation = this.options.animation, attribs, center = this.center, group = this.group, markerGroup = this.markerGroup;
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
    };
    /**
     * @private
     */
    Pie3DSeries.prototype.drawDataLabels = function () {
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
        _super.prototype.drawDataLabels.apply(this, arguments);
    };
    /**
     * @private
     */
    Pie3DSeries.prototype.pointAttribs = function (point) {
        var attr = _super.prototype.pointAttribs.apply(this, arguments), options = this.options;
        if (this.chart.is3d() && !this.chart.styledMode) {
            attr.stroke = options.edgeColor || point.color || this.color;
            attr['stroke-width'] = pick(options.edgeWidth, 1);
        }
        return attr;
    };
    /**
     * @private
     */
    Pie3DSeries.prototype.translate = function () {
        _super.prototype.translate.apply(this, arguments);
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
    };
    return Pie3DSeries;
}(PieSeries));
extend(Pie3DSeries, {
    pointClass: Pie3DPoint
});
/* *
 *
 *  Default Export
 *
 * */
export default Pie3DSeries;
/* *
 *
 *  API Options
 *
 * */
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
''; // keeps doclets above after transpilation
