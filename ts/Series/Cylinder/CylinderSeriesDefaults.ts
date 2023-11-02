/* *
 *
 *  Highcharts cylinder - a 3D series
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Kacper Madej
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

import type CylinderSeriesOptions from './CylinderSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A cylinder graph is a variation of a 3d column graph. The cylinder graph
 * features cylindrical points.
 *
 * @sample {highcharts} highcharts/demo/cylinder/
 *         Cylinder graph
 *
 * @extends      plotOptions.column
 * @since        7.0.0
 * @product      highcharts
 * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
 *               dragDrop, boostBlending
 * @requires     modules/cylinder
 * @optionparent plotOptions.cylinder
 */
const CylinderSeriesDefaults: CylinderSeriesOptions = {};

/**
 * A `cylinder` series. If the [type](#series.cylinder.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cylinder
 * @since     7.0.0
 * @product   highcharts
 * @excluding allAreas, boostThreshold, colorAxis, compare, compareBase,
 *            boostBlending
 * @requires  modules/cylinder
 * @apioption series.cylinder
 */

/**
 * An array of data points for the series. For the `cylinder` series type,
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
 *        [0, 0],
 *        [1, 8],
 *        [2, 9]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.cylinder.turboThreshold), this option is not
 *    available.
 *
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
 * @extends   series.column.data
 * @product   highcharts highstock
 * @apioption series.cylinder.data
 */

''; // detaches doclets above

/* *
 *
 *  Default Export
 *
 * */

export default CylinderSeriesDefaults;
