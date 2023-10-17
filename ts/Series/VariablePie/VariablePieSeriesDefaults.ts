/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2021 Grzegorz Blachliński
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

import type VariablePieSeriesOptions from './VariablePieSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A variable pie series is a two dimensional series type, where each point
 * renders an Y and Z value.  Each point is drawn as a pie slice where the
 * size (arc) of the slice relates to the Y value and the radius of pie
 * slice relates to the Z value.
 *
 * @sample {highcharts} highcharts/demo/variable-radius-pie/
 *         Variable-radius pie chart
 *
 * @extends      plotOptions.pie
 * @excluding    dragDrop
 * @since        6.0.0
 * @product      highcharts
 * @requires     modules/variable-pie.js
 * @optionparent plotOptions.variablepie
 */
const VariablePieSeriesDefaults: VariablePieSeriesOptions = {

    /**
     * The minimum size of the points' radius related to chart's `plotArea`.
     * If a number is set, it applies in pixels.
     *
     * @sample {highcharts} highcharts/variable-radius-pie/min-max-point-size/
     *         Example of minPointSize and maxPointSize
     * @sample {highcharts} highcharts/variable-radius-pie/min-point-size-100/
     *         minPointSize set to 100
     *
     * @type  {number|string}
     * @since 6.0.0
     */
    minPointSize: '10%',

    /**
     * The maximum size of the points' radius related to chart's `plotArea`.
     * If a number is set, it applies in pixels.
     *
     * @sample {highcharts} highcharts/variable-radius-pie/min-max-point-size/
     *         Example of minPointSize and maxPointSize
     *
     * @type  {number|string}
     * @since 6.0.0
     */
    maxPointSize: '100%',

    /**
     * The minimum possible z value for the point's radius calculation. If
     * the point's Z value is smaller than zMin, the slice will be drawn
     * according to the zMin value.
     *
     * @sample {highcharts} highcharts/variable-radius-pie/zmin-5/
     *         zMin set to 5, smaller z values are treated as 5
     * @sample {highcharts} highcharts/variable-radius-pie/zmin-zmax/
     *         Series limited by both zMin and zMax
     *
     * @type  {number}
     * @since 6.0.0
     */
    zMin: void 0,

    /**
     * The maximum possible z value for the point's radius calculation. If
     * the point's Z value is bigger than zMax, the slice will be drawn
     * according to the zMax value
     *
     * @sample {highcharts} highcharts/variable-radius-pie/zmin-zmax/
     *         Series limited by both zMin and zMax
     *
     * @type  {number}
     * @since 6.0.0
     */
    zMax: void 0,

    /**
     * Whether the pie slice's value should be represented by the area or
     * the radius of the slice. Can be either `area` or `radius`. The
     * default, `area`, corresponds best to the human perception of the size
     * of each pie slice.
     *
     * @sample {highcharts} highcharts/variable-radius-pie/sizeby/
     *         Difference between area and radius sizeBy
     *
     * @type  {Highcharts.VariablePieSizeByValue}
     * @since 6.0.0
     */
    sizeBy: 'area',

    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}<br/>Value: {point.y}<br/>Size: {point.z}<br/>'
    }

};


/**
 * A `variablepie` series. If the [type](#series.variablepie.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.variablepie
 * @excluding dataParser, dataURL, stack, xAxis, yAxis, dataSorting,
 *            boostThreshold, boostBlending
 * @product   highcharts
 * @requires  modules/variable-pie.js
 * @apioption series.variablepie
 */

/**
 * An array of data points for the series. For the `variablepie` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 2 values. In this case, the numerical values will
 *    be interpreted as `y, z` options. Example:
 *    ```js
 *    data: [
 *        [40, 75],
 *        [50, 50],
 *        [60, 40]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.variablepie.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        y: 1,
 *        z: 4,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 7,
 *        z: 10,
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
 * @type      {Array<Array<(number|string),number>|*>}
 * @extends   series.pie.data
 * @excluding marker, x
 * @product   highcharts
 * @apioption series.variablepie.data
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default VariablePieSeriesDefaults;
