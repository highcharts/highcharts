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
import BoxPlotSeries from '../BoxPlot/BoxPlotSeries.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var AreaRangeSeries = SeriesRegistry.seriesTypes.arearange;
import U from '../../Core/Utilities.js';
var merge = U.merge, extend = U.extend;
/**
 * Errorbar series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.errorbar
 *
 * @augments Highcharts.Series
 *
 */
var ErrorBarSeries = /** @class */ (function (_super) {
    __extends(ErrorBarSeries, _super);
    function ErrorBarSeries() {
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
    }
    /* *
     *
     *  Functions
     *
     * */
    // Get the width and X offset, either on top of the linked series
    // column or standalone
    ErrorBarSeries.prototype.getColumnMetrics = function () {
        return ((this.linkedParent && this.linkedParent.columnMetrics) ||
            ColumnSeries.prototype.getColumnMetrics.call(this));
    };
    ErrorBarSeries.prototype.drawDataLabels = function () {
        var valKey = this.pointValKey;
        if (AreaRangeSeries) {
            AreaRangeSeries.prototype.drawDataLabels.call(this);
            // Arearange drawDataLabels does not reset point.y to high,
            // but to low after drawing (#4133)
            this.data.forEach(function (point) {
                point.y = point[valKey];
            });
        }
    };
    // return a plain array for speedy calculation
    ErrorBarSeries.prototype.toYData = function (point) {
        return [point.low, point.high];
    };
    /**
     * Error bars are a graphical representation of the variability of data and
     * are used on graphs to indicate the error, or uncertainty in a reported
     * measurement.
     *
     * @sample highcharts/demo/error-bar/
     *         Error bars on a column series
     * @sample highcharts/series-errorbar/on-scatter/
     *         Error bars on a scatter series
     *
     * @extends      plotOptions.boxplot
     * @excluding    boostBlending, boostThreshold
     * @product      highcharts highstock
     * @requires     highcharts-more
     * @optionparent plotOptions.errorbar
     */
    ErrorBarSeries.defaultOptions = merge(BoxPlotSeries.defaultOptions, {
        /**
         * The main color of the bars. This can be overridden by
         * [stemColor](#plotOptions.errorbar.stemColor) and
         * [whiskerColor](#plotOptions.errorbar.whiskerColor) individually.
         *
         * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
         *         Error bar styling
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default #000000
         * @since   3.0
         * @product highcharts
         */
        color: palette.neutralColor100,
        grouping: false,
        /**
         * The parent series of the error bar. The default value links it to
         * the previous series. Otherwise, use the id of the parent series.
         *
         * @since   3.0
         * @product highcharts
         */
        linkedTo: ':previous',
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
        },
        /**
         * The line width of the whiskers, the horizontal lines marking
         * low and high values. When `null`, the general
         * [lineWidth](#plotOptions.errorbar.lineWidth) applies.
         *
         * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
         *         Error bar styling
         *
         * @type    {number}
         * @since   3.0
         * @product highcharts
         */
        whiskerWidth: null
    });
    return ErrorBarSeries;
}(BoxPlotSeries));
extend(ErrorBarSeries.prototype, {
    // array point configs are mapped to this
    pointArrayMap: ['low', 'high'],
    pointValKey: 'high',
    doQuartiles: false
});
SeriesRegistry.registerSeriesType('errorbar', ErrorBarSeries);
/* *
 *
 *  Default export
 *
 * */
export default ErrorBarSeries;
/* *
 *
 *  API options
 *
 * */
/**
 * A `errorbar` series. If the [type](#series.errorbar.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.errorbar
 * @excluding dataParser, dataURL, stack, stacking, boostThreshold,
 *            boostBlending
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.errorbar
 */
/**
 * An array of data points for the series. For the `errorbar` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,low,high`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 10, 2],
 *        [1, 1, 8],
 *        [2, 4, 5]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.errorbar.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 0,
 *        high: 0,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        high: 5,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.arearange.data
 * @excluding dataLabels, drilldown, marker, states
 * @product   highcharts
 * @apioption series.errorbar.data
 */
''; // adds doclets above to transpiled file
