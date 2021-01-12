/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import Axis from './Axis.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, merge = U.merge, pick = U.pick, splat = U.splat;
/* eslint-disable valid-jsdoc */
/**
 * 3D chart with support of z coordinates.
 * @private
 * @class
 */
var ZChart = /** @class */ (function () {
    function ZChart() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    ZChart.compose = function (ChartClass) {
        addEvent(ChartClass, 'afterGetAxes', ZChart.onAfterGetAxes);
        var chartProto = ChartClass.prototype;
        chartProto.addZAxis = ZChart.wrapAddZAxis;
        chartProto.collectionsWithInit.zAxis = [chartProto.addZAxis];
        chartProto.collectionsWithUpdate.push('zAxis');
    };
    /**
     * Get the Z axis in addition to the default X and Y.
     * @private
     */
    ZChart.onAfterGetAxes = function () {
        var chart = this;
        var options = this.options;
        var zAxisOptions = options.zAxis = splat(options.zAxis || {});
        if (!chart.is3d()) {
            return;
        }
        chart.zAxis = [];
        zAxisOptions.forEach(function (axisOptions, i) {
            axisOptions.index = i;
            // Z-Axis is shown horizontally, so it's kind of a X-Axis
            axisOptions.isX = true;
            chart
                .addZAxis(axisOptions)
                .setScale();
        });
    };
    /**
     * @private
     */
    ZChart.wrapAddZAxis = function (options) {
        return new ZAxis(this, options);
    };
    return ZChart;
}());
/**
 * 3D axis for z coordinates.
 */
var ZAxis = /** @class */ (function (_super) {
    __extends(ZAxis, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function ZAxis(chart, userOptions) {
        var _this = _super.call(this, chart, userOptions) || this;
        _this.isZAxis = true;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    ZAxis.prototype.getSeriesExtremes = function () {
        var axis = this;
        var chart = axis.chart;
        axis.hasVisibleSeries = false;
        // Reset properties in case we're redrawing (#3353)
        axis.dataMin = axis.dataMax = axis.ignoreMinPadding = axis.ignoreMaxPadding = void 0;
        if (axis.stacking) {
            axis.stacking.buildStacks();
        }
        // loop through this axis' series
        axis.series.forEach(function (series) {
            if (series.visible ||
                !(chart.options.chart &&
                    chart.options.chart.ignoreHiddenSeries)) {
                var seriesOptions = series.options, zData, threshold = seriesOptions.threshold;
                axis.hasVisibleSeries = true;
                // Validate threshold in logarithmic axes
                if (axis.positiveValuesOnly && threshold <= 0) {
                    threshold = void 0;
                }
                zData = series.zData;
                if (zData.length) {
                    axis.dataMin = Math.min(pick(axis.dataMin, zData[0]), Math.min.apply(null, zData));
                    axis.dataMax = Math.max(pick(axis.dataMax, zData[0]), Math.max.apply(null, zData));
                }
            }
        });
    };
    /**
     * @private
     */
    ZAxis.prototype.setAxisSize = function () {
        var axis = this;
        var chart = axis.chart;
        _super.prototype.setAxisSize.call(this);
        axis.width = axis.len = (chart.options.chart &&
            chart.options.chart.options3d &&
            chart.options.chart.options3d.depth) || 0;
        axis.right = chart.chartWidth - axis.width - axis.left;
    };
    /**
     * @private
     */
    ZAxis.prototype.setOptions = function (userOptions) {
        userOptions = merge({
            offset: 0,
            lineWidth: 0
        }, userOptions);
        // #14793, this used to be set on the prototype
        this.isZAxis = true;
        _super.prototype.setOptions.call(this, userOptions);
        this.coll = 'zAxis';
    };
    /* *
     *
     *  Static Properties
     *
     * */
    ZAxis.ZChartComposition = ZChart;
    return ZAxis;
}(Axis));
export default ZAxis;
