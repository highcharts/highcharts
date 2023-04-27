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

/* *
 *
 *  Imports
 *
 * */

import type { PlotOptionsOf } from '../../Core/Series/SeriesOptions';
import type ScatterSeries from './ScatterSeries';

/* *
 *
 *  API Options
 *
 * */

/**
 * A scatter plot uses cartesian coordinates to display values for two
 * variables for a set of data.
 *
 * @sample {highcharts} highcharts/demo/scatter/
 *         Scatter plot
 *
 * @extends      plotOptions.line
 * @excluding    cropThreshold, pointPlacement, shadow, useOhlcData
 * @product      highcharts highstock
 * @optionparent plotOptions.scatter
 */
const ScatterSeriesDefaults: PlotOptionsOf<ScatterSeries> = {

    /**
     * The width of the line connecting the data points.
     *
     * @sample {highcharts} highcharts/plotoptions/scatter-linewidth-none/
     *         0 by default
     * @sample {highcharts} highcharts/plotoptions/scatter-linewidth-1/
     *         1px
     *
     * @product highcharts highstock
     */
    lineWidth: 0,

    findNearestPointBy: 'xy',

    /**
     * Apply a jitter effect for the rendered markers. When plotting
     * discrete values, a little random noise may help telling the points
     * apart. The jitter setting applies a random displacement of up to `n`
     * axis units in either direction. So for example on a horizontal X
     * axis, setting the `jitter.x` to 0.24 will render the point in a
     * random position between 0.24 units to the left and 0.24 units to the
     * right of the true axis position. On a category axis, setting it to
     * 0.5 will fill up the bin and make the data appear continuous.
     *
     * When rendered on top of a box plot or a column series, a jitter value
     * of 0.24 will correspond to the underlying series' default
     * [groupPadding](
     * https://api.highcharts.com/highcharts/plotOptions.column.groupPadding)
     * and [pointPadding](
     * https://api.highcharts.com/highcharts/plotOptions.column.pointPadding)
     * settings.
     *
     * @sample {highcharts} highcharts/demo/scatter-jitter
     *         Jitter on a scatter plot
     *
     * @sample {highcharts} highcharts/series-scatter/jitter-boxplot
     *         Jittered scatter plot on top of a box plot
     *
     * @product highcharts highstock
     * @since 7.0.2
     */
    jitter: {
        /**
         * The maximal X offset for the random jitter effect.
         */
        x: 0,
        /**
         * The maximal Y offset for the random jitter effect.
         */
        y: 0
    },

    marker: {

        enabled: true // Overrides auto-enabling in line series (#3647)
    },

    /**
     * Sticky tracking of mouse events. When true, the `mouseOut` event
     * on a series isn't triggered until the mouse moves over another
     * series, or out of the plot area. When false, the `mouseOut` event on
     * a series is triggered when the mouse leaves the area around the
     * series' graph or markers. This also implies the tooltip. When
     * `stickyTracking` is false and `tooltip.shared` is false, the tooltip
     * will be hidden when moving the mouse between series.
     *
     * @type      {boolean}
     * @default   false
     * @product   highcharts highstock highmaps
     * @apioption plotOptions.scatter.stickyTracking
     */

    /**
     * A configuration object for the tooltip rendering of each single
     * series. Properties are inherited from [tooltip](#tooltip).
     * Overridable properties are `headerFormat`, `pointFormat`,
     * `yDecimals`, `xDateFormat`, `yPrefix` and `ySuffix`. Unlike other
     * series, in a scatter plot the series.name by default shows in the
     * headerFormat and point.x and point.y in the pointFormat.
     *
     * @product highcharts highstock highmaps
     */
    tooltip: {
        /**
         * @product highcharts highstock
         */
        headerFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<span style="font-size: 0.8em"> {series.name}</span><br/>',
        pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
    }

};

/**
 * A `scatter` series. If the [type](#series.scatter.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.scatter
 * @excluding cropThreshold, dataParser, dataURL, useOhlcData
 * @product   highcharts highstock
 * @apioption series.scatter
 */

/**
 * An array of data points for the series. For the `scatter` series
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
 *        [0, 0],
 *        [1, 8],
 *        [2, 9]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.scatter.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 2,
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
 * @apioption series.scatter.data
 */

''; // keeps doclets above in JS file

/* *
 *
 *  Default Export
 *
 * */

export default ScatterSeriesDefaults;
