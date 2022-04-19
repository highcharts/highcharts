/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard
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
import DrawPointComposition from '../DrawPointComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Point = SeriesRegistry.series.prototype.pointClass, TreemapPoint = SeriesRegistry.seriesTypes.treemap.prototype.pointClass;
import U from '../../Core/Utilities.js';
var correctFloat = U.correctFloat, extend = U.extend;
/* *
 *
 *  Class
 *
 * */
var SunburstPoint = /** @class */ (function (_super) {
    __extends(SunburstPoint, _super);
    function SunburstPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.node = void 0;
        _this.options = void 0;
        _this.series = void 0;
        _this.shapeExisting = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    SunburstPoint.prototype.getDataLabelPath = function (label) {
        var renderer = this.series.chart.renderer, shapeArgs = this.shapeExisting, start = shapeArgs.start, end = shapeArgs.end, angle = start + (end - start) / 2, // arc middle value
        upperHalf = angle < 0 &&
            angle > -Math.PI ||
            angle > Math.PI, r = (shapeArgs.r + (label.options.distance || 0)), moreThanHalf;
        // Check if point is a full circle
        if (start === -Math.PI / 2 &&
            correctFloat(end) === correctFloat(Math.PI * 1.5)) {
            start = -Math.PI + Math.PI / 360;
            end = -Math.PI / 360;
            upperHalf = true;
        }
        // Check if dataLabels should be render in the
        // upper half of the circle
        if (end - start > Math.PI) {
            upperHalf = false;
            moreThanHalf = true;
        }
        if (this.dataLabelPath) {
            this.dataLabelPath = this.dataLabelPath.destroy();
        }
        this.dataLabelPath = renderer
            .arc({
            open: true,
            longArc: moreThanHalf ? 1 : 0
        })
            // Add it inside the data label group so it gets destroyed
            // with the label
            .add(label);
        this.dataLabelPath.attr({
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf,
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (r + shapeArgs.innerR) / 2
        });
        return this.dataLabelPath;
    };
    SunburstPoint.prototype.isValid = function () {
        return true;
    };
    return SunburstPoint;
}(TreemapPoint));
extend(SunburstPoint.prototype, {
    getClassName: Point.prototype.getClassName,
    haloPath: Point.prototype.haloPath,
    setState: Point.prototype.setState
});
DrawPointComposition.compose(SunburstPoint);
/* *
 *
 *  Defaul Export
 *
 * */
export default SunburstPoint;
