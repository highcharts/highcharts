/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import ColorMapMixin from '../../Mixins/ColorMapSeries.js';
var colorMapPointMixin = ColorMapMixin.colorMapPointMixin;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ScatterPoint = SeriesRegistry.seriesTypes.scatter.prototype.pointClass;
import U from '../../Core/Utilities.js';
var clamp = U.clamp, extend = U.extend, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
var HeatmapPoint = /** @class */ (function (_super) {
    __extends(HeatmapPoint, _super);
    function HeatmapPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = void 0;
        _this.series = void 0;
        _this.value = void 0;
        _this.x = void 0;
        _this.y = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
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
    HeatmapPoint.prototype.applyOptions = function (options, x) {
        var point = _super.prototype.applyOptions.call(this, options, x);
        point.formatPrefix = point.isNull || point.value === null ? 'null' : 'point';
        return point;
    };
    HeatmapPoint.prototype.getCellAttributes = function () {
        var point = this, series = point.series, seriesOptions = series.options, xPad = (seriesOptions.colsize || 1) / 2, yPad = (seriesOptions.rowsize || 1) / 2, xAxis = series.xAxis, yAxis = series.yAxis, markerOptions = point.options.marker || series.options.marker, pointPlacement = series.pointPlacementToXValue(), // #7860
        pointPadding = pick(point.pointPadding, seriesOptions.pointPadding, 0), cellAttr = {
            x1: clamp(Math.round(xAxis.len -
                (xAxis.translate(point.x - xPad, false, true, false, true, -pointPlacement) || 0)), -xAxis.len, 2 * xAxis.len),
            x2: clamp(Math.round(xAxis.len -
                (xAxis.translate(point.x + xPad, false, true, false, true, -pointPlacement) || 0)), -xAxis.len, 2 * xAxis.len),
            y1: clamp(Math.round((yAxis.translate(point.y - yPad, false, true, false, true) || 0)), -yAxis.len, 2 * yAxis.len),
            y2: clamp(Math.round((yAxis.translate(point.y + yPad, false, true, false, true) || 0)), -yAxis.len, 2 * yAxis.len)
        };
        // Handle marker's fixed width, and height values including border
        // and pointPadding while calculating cell attributes.
        [['width', 'x'], ['height', 'y']].forEach(function (dimension) {
            var prop = dimension[0], direction = dimension[1];
            var start = direction + '1', end = direction + '2';
            var side = Math.abs(cellAttr[start] - cellAttr[end]), borderWidth = markerOptions &&
                markerOptions.lineWidth || 0, plotPos = Math.abs(cellAttr[start] + cellAttr[end]) / 2;
            if (markerOptions[prop] &&
                markerOptions[prop] < side) {
                cellAttr[start] = plotPos - (markerOptions[prop] / 2) -
                    (borderWidth / 2);
                cellAttr[end] = plotPos + (markerOptions[prop] / 2) +
                    (borderWidth / 2);
            }
            // Handle pointPadding
            if (pointPadding) {
                if (direction === 'y') {
                    start = end;
                    end = direction + '1';
                }
                cellAttr[start] += pointPadding;
                cellAttr[end] -= pointPadding;
            }
        });
        return cellAttr;
    };
    /**
     * @private
     */
    HeatmapPoint.prototype.haloPath = function (size) {
        if (!size) {
            return [];
        }
        var rect = this.shapeArgs;
        return [
            'M',
            rect.x - size,
            rect.y - size,
            'L',
            rect.x - size,
            rect.y + rect.height + size,
            rect.x + rect.width + size,
            rect.y + rect.height + size,
            rect.x + rect.width + size,
            rect.y - size,
            'Z'
        ];
    };
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    HeatmapPoint.prototype.isValid = function () {
        // undefined is allowed
        return (this.value !== Infinity &&
            this.value !== -Infinity);
    };
    return HeatmapPoint;
}(ScatterPoint));
extend(HeatmapPoint.prototype, {
    dataLabelOnNull: colorMapPointMixin.dataLabelOnNull,
    setState: colorMapPointMixin.setState
});
/* *
 *
 *  Default Export
 *
 * */
export default HeatmapPoint;
