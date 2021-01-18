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
import ColumnSeries from '../Column/ColumnSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Bar series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bar
 *
 * @augments Highcharts.Series
 */
var BarSeries = /** @class */ (function (_super) {
    __extends(BarSeries, _super);
    function BarSeries() {
        /* *
         *
         *  Static Properties
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
    /**
     * A bar series is a special type of column series where the columns are
     * horizontal.
     *
     * @sample highcharts/demo/bar-basic/
     *         Bar chart
     *
     * @extends      plotOptions.column
     * @product      highcharts
     * @optionparent plotOptions.bar
     */
    BarSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
    // nothing here yet
    });
    return BarSeries;
}(ColumnSeries));
extend(BarSeries.prototype, {
    inverted: true
});
SeriesRegistry.registerSeriesType('bar', BarSeries);
/* *
 *
 *  Default Export
 *
 * */
export default BarSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A `bar` series. If the [type](#series.bar.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.bar
 * @excluding connectNulls, dashStyle, dataParser, dataURL, gapSize, gapUnit,
 *            linecap, lineWidth, marker, connectEnds, step
 * @product   highcharts
 * @apioption series.bar
 */
/**
 * An array of data points for the series. For the `bar` series type,
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
 *        [0, 5],
 *        [1, 10],
 *        [2, 3]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.bar.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 10,
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
 * @extends   series.column.data
 * @product   highcharts
 * @apioption series.bar.data
 */
/**
 * @excluding halo,lineWidth,lineWidthPlus,marker
 * @product   highcharts highstock
 * @apioption series.bar.states.hover
 */
/**
 * @excluding halo,lineWidth,lineWidthPlus,marker
 * @product   highcharts highstock
 * @apioption series.bar.states.select
 */
''; // gets doclets above into transpilat
