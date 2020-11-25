/* *
 *
 *  (c) 2010-2020 Sebastian Bochan, Rafal Sebestjanski
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
import DumbbellSeries from '../Dumbbell/DumbbellSeries.js';
import DumbbellPoint from '../Dumbbell/DumbbellPoint.js';
import BaseSeries from '../../Core/Series/Series.js';
import Point from '../../Core/Series/Point.js';
import ColumnSeries from '../Column/ColumnSeries.js';
var colProto = ColumnSeries.prototype;
import U from '../../Core/Utilities.js';
var isObject = U.isObject, pick = U.pick, merge = U.merge, extend = U.extend;
var areaProto = BaseSeries.seriesTypes.area.prototype;
/* *
 *
 *  Class
 *
 * */
var LollipopSeries = /** @class */ (function (_super) {
    __extends(LollipopSeries, _super);
    function LollipopSeries() {
        /* *
         *
         *  Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /* *
         *
         *  Functions
         *
         * */
    }
    LollipopSeries.defaultOptions = merge(DumbbellSeries.defaultOptions, {
        /** @ignore-option */
        lowColor: void 0,
        /** @ignore-option */
        threshold: 0,
        /** @ignore-option */
        connectorWidth: 1,
        /** @ignore-option */
        groupPadding: 0.2,
        /** @ignore-option */
        pointPadding: 0.1,
        /** @ignore-option */
        states: {
            hover: {
                /** @ignore-option */
                lineWidthPlus: 0,
                /** @ignore-option */
                connectorWidthPlus: 1,
                /** @ignore-option */
                halo: false
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
        }
    });
    return LollipopSeries;
}(DumbbellSeries));
extend(LollipopSeries.prototype, {
    pointArrayMap: ['y'],
    pointValKey: 'y',
    toYData: function (point) {
        return [pick(point.y, point.low)];
    },
    translatePoint: areaProto.translate,
    drawPoint: areaProto.drawPoints,
    drawDataLabels: colProto.drawDataLabels,
    setShapeArgs: colProto.translate
});
var LollipopPoint = /** @class */ (function (_super) {
    __extends(LollipopPoint, _super);
    function LollipopPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.series = void 0;
        _this.options = void 0;
        return _this;
    }
    return LollipopPoint;
}(DumbbellPoint));
LollipopSeries.prototype.pointClass = LollipopPoint;
extend(LollipopSeries.prototype.pointClass.prototype, {
    pointSetState: areaProto.pointClass.prototype.setState,
    setState: DumbbellPoint.prototype.setState,
    // Does not work with the inherited `isvalid`
    isValid: Point.prototype.isValid,
    init: function (series, options, x) {
        if (isObject(options) && 'low' in options) {
            options.y = options.low;
            delete options.low;
        }
        return Point.prototype.init.apply(this, arguments);
    }
});
BaseSeries.registerSeriesType('lollipop', LollipopSeries);
/* *
 *
 *  Default export
 *
 * */
export default LollipopSeries;
/**
 * The lollipop series is a carteseian series with a line anchored from
 * the x axis and a dot at the end to mark the value.
 * Requires `highcharts-more.js`, `modules/dumbbell.js` and
 * `modules/lollipop.js`.
 *
 * @sample {highcharts} highcharts/demo/lollipop/
 *         Lollipop chart
 * @sample {highcharts} highcharts/series-dumbbell/styled-mode-dumbbell/
 *         Styled mode
 *
 * @extends      plotOptions.dumbbell
 * @product      highcharts highstock
 * @excluding    fillColor, fillOpacity, lineWidth, stack, stacking, lowColor,
 *               stickyTracking, trackByArea
 * @since 8.0.0
 * @optionparent plotOptions.lollipop
 */
/**
 * The `lollipop` series. If the [type](#series.lollipop.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.lollipop,
 * @excluding boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @requires  modules/dumbbell
 * @requires  modules/lollipop
 * @apioption series.lollipop
 */
/**
 * An array of data points for the series. For the `lollipop` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 6],
 *        [1, 2],
 *        [2, 6]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.lollipop.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00",
 *        connectorWidth: 3,
 *        connectorColor: "#FF00FF"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.dumbbell.data
 * @excluding high, low, lowColor
 * @product   highcharts highstock
 * @apioption series.lollipop.data
 */
/**
* The y value of the point.
*
* @type      {number|null}
* @product   highcharts highstock
* @apioption series.line.data.y
*/
''; // adds doclets above to transpiled file
