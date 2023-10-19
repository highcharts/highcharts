/* *
 *
 *  (c) 2010-2021 Sebastian Bochan
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

import type ColumnPyramidSeriesOptions from './ColumnPyramidSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * Column pyramid series display one pyramid per value along an X axis.
 * To display horizontal pyramids, set [chart.inverted](#chart.inverted) to
 * `true`.
 *
 * @sample {highcharts|highstock} highcharts/demo/column-pyramid/
 *         Column pyramid
 * @sample {highcharts|highstock} highcharts/plotoptions/columnpyramid-stacked/
 *         Column pyramid stacked
 * @sample {highcharts|highstock} highcharts/plotoptions/columnpyramid-inverted/
 *         Column pyramid inverted
 *
 * @extends      plotOptions.column
 * @since        7.0.0
 * @product      highcharts highstock
 * @excluding    boostThreshold, borderRadius, crisp, depth, edgeColor,
 *               edgeWidth, groupZPadding, negativeColor, softThreshold,
 *               threshold, zoneAxis, zones, boostBlending
 * @requires     highcharts-more
 * @optionparent plotOptions.columnpyramid
 */
const ColumnPyramidSeriesDefaults: ColumnPyramidSeriesOptions = {

};

/**
 * A `columnpyramid` series. If the [type](#series.columnpyramid.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.columnpyramid
 * @excluding connectEnds, connectNulls, dashStyle, dataParser, dataURL,
 *            gapSize, gapUnit, linecap, lineWidth, marker, step,
 *            boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @apioption series.columnpyramid
 */

/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.columnpyramid.states.hover
 */

/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.columnpyramid.states.select
 */

/**
 * An array of data points for the series. For the `columnpyramid` series type,
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
 * 3. An array of objects with named values. The objects are point configuration
 *    objects as seen below. If the total number of data points exceeds the
 *    series' [turboThreshold](#series.columnpyramid.turboThreshold), this
 *    option is not available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
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
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts highstock
 * @apioption series.columnpyramid.data
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPyramidSeriesDefaults;
