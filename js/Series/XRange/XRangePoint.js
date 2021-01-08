/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
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
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ColumnSeries = SeriesRegistry.seriesTypes.column;
/* *
 *
 *  Declarations
 *
 * */
var XRangePoint = /** @class */ (function (_super) {
    __extends(XRangePoint, _super);
    function XRangePoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.options = void 0;
        _this.series = void 0;
        _this.tooltipDateKeys = ['x', 'x2'];
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     * Static properties
     *
     * */
    /**
     * Return color of a point based on its category.
     *
     * @private
     * @function getColorByCategory
     *
     * @param {object} series
     *        The series which the point belongs to.
     *
     * @param {object} point
     *        The point to calculate its color for.
     *
     * @return {object}
     *         Returns an object containing the properties color and colorIndex.
     */
    XRangePoint.getColorByCategory = function (series, point) {
        var colors = series.options.colors || series.chart.options.colors, colorCount = colors ?
            colors.length :
            series.chart.options.chart.colorCount, colorIndex = point.y % colorCount, color = colors && colors[colorIndex];
        return {
            colorIndex: colorIndex,
            color: color
        };
    };
    /* *
     *
     * Functions
     *
     * */
    /**
     * The ending X value of the range point.
     * @name Highcharts.Point#x2
     * @type {number|undefined}
     * @requires modules/xrange
     */
    /**
     * Extend applyOptions so that `colorByPoint` for x-range means that one
     * color is applied per Y axis category.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @return {Highcharts.Series}
     */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    XRangePoint.prototype.resolveColor = function () {
        var series = this.series, colorByPoint;
        if (series.options.colorByPoint && !this.options.color) {
            colorByPoint = XRangePoint.getColorByCategory(series, this);
            if (!series.chart.styledMode) {
                this.color = colorByPoint.color;
            }
            if (!this.options.colorIndex) {
                this.colorIndex = colorByPoint.colorIndex;
            }
        }
        else if (!this.color) {
            this.color = series.color;
        }
    };
    /**
     * Extend init to have y default to 0.
     *
     * @private
     * @function Highcharts.Point#init
     *
     * @return {Highcharts.Point}
     */
    XRangePoint.prototype.init = function () {
        Point.prototype.init.apply(this, arguments);
        if (!this.y) {
            this.y = 0;
        }
        return this;
    };
    /**
     * @private
     * @function Highcharts.Point#setState
     */
    XRangePoint.prototype.setState = function () {
        Point.prototype.setState.apply(this, arguments);
        this.series.drawPoint(this, this.series.getAnimationVerb());
    };
    /**
     * @private
     * @function Highcharts.Point#getLabelConfig
     *
     * @return {Highcharts.PointLabelObject}
     */
    // Add x2 and yCategory to the available properties for tooltip formats
    XRangePoint.prototype.getLabelConfig = function () {
        var point = this, cfg = Point.prototype.getLabelConfig.call(point), yCats = point.series.yAxis.categories;
        cfg.x2 = point.x2;
        cfg.yCategory = point.yCategory = yCats && yCats[point.y];
        return cfg;
    };
    /**
     * @private
     * @function Highcharts.Point#isValid
     *
     * @return {boolean}
     */
    XRangePoint.prototype.isValid = function () {
        return typeof this.x === 'number' &&
            typeof this.x2 === 'number';
    };
    return XRangePoint;
}(ColumnSeries.prototype.pointClass));
/* *
 *
 *  Default Export
 *
 * */
export default XRangePoint;
