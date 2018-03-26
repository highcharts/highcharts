/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './ColumnSeries.js';

var seriesType = H.seriesType;

/**
 * The Bar series class
 */
seriesType('bar', 'column', null, {
    inverted: true
});
/**
 * A bar series is a special type of column series where the columns are
 * horizontal.
 *
 * @sample       highcharts/demo/bar-basic/
 *               Bar chart
 * @extends      {plotOptions.column}
 * @product      highcharts
 * @optionparent plotOptions.bar
 */


/**
 * A `bar` series. If the [type](#series.bar.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.bar
 * @excluding connectNulls,dashStyle,dataParser,dataURL,gapSize,gapUnit,linecap,
 *            lineWidth,marker,connectEnds,step
 * @product   highcharts
 * @apioption series.bar
 */

/**
 * An array of data points for the series. For the `bar` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 5],
 *         [1, 10],
 *         [2, 3]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.bar.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 1,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 10,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array|Number>}
 * @extends   series.column.data
 * @sample    {highcharts} highcharts/chart/reflow-true/
 *            Numerical values
 * @sample    {highcharts} highcharts/series/data-array-of-arrays/
 *            Arrays of numeric x and y
 * @sample    {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *            Arrays of datetime x and y
 * @sample    {highcharts} highcharts/series/data-array-of-name-value/
 *            Arrays of point.name and y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
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

/**
 * Alignment of the data label relative to the data point.
 *
 * @type      {String}
 * @sample    {highcharts}
 *            highcharts/plotoptions/bar-datalabels-align-inside-bar/
 *            Data labels inside the bar
 * @default   left
 * @product   highcharts
 * @apioption plotOptions.bar.dataLabels.align
 */

/**
 * The x position of the data label relative to the data point.
 *
 * @type      {Number}
 * @sample    {highcharts}
 *            highcharts/plotoptions/bar-datalabels-align-inside-bar/
 *            Data labels inside the bar
 * @default   5
 * @product   highcharts
 * @apioption plotOptions.bar.dataLabels.x
 */
