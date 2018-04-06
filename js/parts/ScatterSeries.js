/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Options.js';
import './Series.js';
var Series = H.Series,
    seriesType = H.seriesType;

/**
 * A scatter plot uses cartesian coordinates to display values for two variables
 * for a set of data.
 *
 * @sample       {highcharts} highcharts/demo/scatter/
 *               Scatter plot
 * @extends      {plotOptions.line}
 * @excluding    pointPlacement, shadow
 * @product      highcharts highstock
 * @optionparent plotOptions.scatter
 */
seriesType('scatter', 'line', {

    /**
     * The width of the line connecting the data points.
     *
     * @sample  {highcharts} highcharts/plotoptions/scatter-linewidth-none/
     *          0 by default
     * @sample  {highcharts} highcharts/plotoptions/scatter-linewidth-1/
     *          1px
     * @product highcharts highstock
     */
    lineWidth: 0,

    findNearestPointBy: 'xy',
    marker: {
        enabled: true // Overrides auto-enabling in line series (#3647)
    },

    /**
     * Sticky tracking of mouse events. When true, the `mouseOut` event
     * on a series isn't triggered until the mouse moves over another series,
     * or out of the plot area. When false, the `mouseOut` event on a series
     * is triggered when the mouse leaves the area around the series' graph
     * or markers. This also implies the tooltip. When `stickyTracking`
     * is false and `tooltip.shared` is false, the tooltip will be hidden
     * when moving the mouse between series.
     *
     * @type      {Boolean}
     * @default   false
     * @product   highcharts highstock
     * @apioption plotOptions.scatter.stickyTracking
     */

    /**
     * A configuration object for the tooltip rendering of each single
     * series. Properties are inherited from [tooltip](#tooltip).
     * Overridable properties are `headerFormat`, `pointFormat`, `yDecimals`,
     * `xDateFormat`, `yPrefix` and `ySuffix`. Unlike other series, in
     * a scatter plot the series.name by default shows in the headerFormat
     * and point.x and point.y in the pointFormat.
     *
     * @product highcharts highstock
     */
    tooltip: {
        /*= if (build.classic) { =*/
        headerFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            '<span style="font-size: 0.85em"> {series.name}</span><br/>',
        /*= } else { =*/

        headerFormat:
            '<span class="highcharts-color-{point.colorIndex}">\u25CF</span> ' +
            '<span class="highcharts-header"> {series.name}</span><br/>',
        /*= } =*/

        pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
    }

// Prototype members
}, {
    sorted: false,
    requireSorting: false,
    noSharedTooltip: true,
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    takeOrdinalPosition: false, // #2342
    drawGraph: function () {
        if (this.options.lineWidth) {
            Series.prototype.drawGraph.call(this);
        }
    }
});

/**
 * A `scatter` series. If the [type](#series.scatter.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.scatter
 * @excluding dataParser,dataURL
 * @product   highcharts highstock
 * @apioption series.scatter
 */

/**
 * An array of data points for the series. For the `scatter` series
 * type, points can be given in the following ways:
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
 *         [0, 0],
 *         [1, 8],
 *         [2, 9]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.scatter.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 2,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array|Number>}
 * @extends   series.line.data
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
 * @product   highcharts highstock
 * @apioption series.scatter.data
 */
