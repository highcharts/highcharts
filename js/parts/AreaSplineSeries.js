/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Legend.js';
import './AreaSeries.js';
import './SplineSeries.js';
var areaProto = H.seriesTypes.area.prototype, defaultPlotOptions = H.defaultPlotOptions, LegendSymbolMixin = H.LegendSymbolMixin, seriesType = H.seriesType;
/**
 * AreaSpline series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.areaspline
 *
 * @augments Highcharts.Series
 */
seriesType('areaspline', 'spline', 
/**
 * The area spline series is an area series where the graph between the
 * points is smoothed into a spline.
 *
 * @sample {highcharts} highcharts/demo/areaspline/
 *         Area spline chart
 * @sample {highstock} stock/demo/areaspline/
 *         Area spline chart
 *
 * @extends   plotOptions.area
 * @excluding step
 * @product   highcharts highstock
 * @apioption plotOptions.areaspline
 */
defaultPlotOptions.area, {
    getStackPoints: areaProto.getStackPoints,
    getGraphPath: areaProto.getGraphPath,
    drawGraph: areaProto.drawGraph,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle
});
/**
 * A `areaspline` series. If the [type](#series.areaspline.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.areaspline
 * @excluding dataParser, dataURL
 * @product   highcharts highstock
 * @apioption series.areaspline
 */
/**
 * An array of data points for the series. For the `areaspline` series
 * type, points can be given in the following ways:
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
 *        [0, 10],
 *        [1, 9],
 *        [2, 3]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.areaspline.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 4,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 4,
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
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.areaspline.data
 */
''; // adds doclets above into transpilat
