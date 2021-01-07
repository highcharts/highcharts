/* *
 *
 *  (c) 2010-2021 Grzegorz Blachlinski, Sebastian Bochan
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
import Chart from '../../Core/Chart/Chart.js';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var BubbleSeries = SeriesRegistry.seriesTypes.bubble;
/* *
 *
 *  Class
 *
 * */
var PackedBubblePoint = /** @class */ (function (_super) {
    __extends(PackedBubblePoint, _super);
    function PackedBubblePoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.degree = NaN;
        _this.mass = NaN;
        _this.radius = NaN;
        _this.options = void 0;
        _this.series = void 0;
        _this.value = null;
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
     * Destroy point.
     * Then remove point from the layout.
     * @private
     */
    PackedBubblePoint.prototype.destroy = function () {
        if (this.series.layout) {
            this.series.layout.removeElementFromCollection(this, this.series.layout.nodes);
        }
        return Point.prototype.destroy.apply(this, arguments);
    };
    PackedBubblePoint.prototype.firePointEvent = function () {
        var point = this, series = this.series, seriesOptions = series.options;
        if (this.isParentNode && seriesOptions.parentNode) {
            var temp = seriesOptions.allowPointSelect;
            seriesOptions.allowPointSelect = seriesOptions.parentNode.allowPointSelect;
            Point.prototype.firePointEvent.apply(this, arguments);
            seriesOptions.allowPointSelect = temp;
        }
        else {
            Point.prototype.firePointEvent.apply(this, arguments);
        }
    };
    PackedBubblePoint.prototype.select = function () {
        var point = this, series = this.series, chart = series.chart;
        if (point.isParentNode) {
            chart.getSelectedPoints = chart.getSelectedParentNodes;
            Point.prototype.select.apply(this, arguments);
            chart.getSelectedPoints = Chart.prototype.getSelectedPoints;
        }
        else {
            Point.prototype.select.apply(this, arguments);
        }
    };
    return PackedBubblePoint;
}(BubbleSeries.prototype.pointClass));
/* *
 *
 *  Default Export
 *
 * */
export default PackedBubblePoint;
