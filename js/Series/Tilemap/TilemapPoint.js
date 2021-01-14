/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Øystein Moseng
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
import ColorSeriesModule from '../../Mixins/ColorSeries.js';
var colorPointMixin = ColorSeriesModule.colorPointMixin;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Point = SeriesRegistry.series.prototype.pointClass, HeatmapPoint = SeriesRegistry.seriesTypes.heatmap.prototype.pointClass;
import U from '../../Core/Utilities.js';
var extend = U.extend;
/* *
 *
 *  Class
 *
 * */
var TilemapPoint = /** @class */ (function (_super) {
    __extends(TilemapPoint, _super);
    function TilemapPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = void 0;
        _this.radius = void 0;
        _this.series = void 0;
        _this.tileEdges = void 0;
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
     * @function Highcharts.Point#haloPath
     *
     * @return {Highcharts.SVGElement|Highcharts.SVGPathArray|Array<Highcharts.SVGElement>}
     */
    TilemapPoint.prototype.haloPath = function () {
        return this.series.tileShape.haloPath.apply(this, arguments);
    };
    return TilemapPoint;
}(HeatmapPoint));
extend(TilemapPoint.prototype, {
    setState: Point.prototype.setState,
    setVisible: colorPointMixin.setVisible
});
/* *
 *
 *  Default Export
 *
 * */
export default TilemapPoint;
