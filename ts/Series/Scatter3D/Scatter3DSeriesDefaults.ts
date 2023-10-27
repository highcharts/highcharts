/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Scatter 3D series.
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

import type Scatter3DSeriesOptions from './Scatter3DSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A 3D scatter plot uses x, y and z coordinates to display values for three
 * variables for a set of data.
 *
 * @sample {highcharts} highcharts/3d/scatter/
 *         Simple 3D scatter
 * @sample {highcharts} highcharts/demo/3d-scatter-draggable
 *         Draggable 3d scatter
 *
 * @extends      plotOptions.scatter
 * @excluding    dragDrop, cluster, boostThreshold, boostBlending
 * @product      highcharts
 * @requires     highcharts-3d
 * @optionparent plotOptions.scatter3d
 */
const Scatter3DSeriesDefaults: Scatter3DSeriesOptions = {

    tooltip: {

        pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>'

    }

};

/**
 * A `scatter3d` series. If the [type](#series.scatter3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * scatter3d](#plotOptions.scatter3d).
 *
 * @extends   series,plotOptions.scatter3d
 * @excluding boostThreshold, boostBlending
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption series.scatter3d
 */

/**
 * An array of data points for the series. For the `scatter3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 values. In this case, the values correspond
 * to `x,y,z`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 0, 1],
 *         [1, 8, 7],
 *         [2, 9, 2]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series'
 * [turboThreshold](#series.scatter3d.turboThreshold), this option is not
 * available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 2,
 *         z: 24,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 4,
 *         z: 12,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
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
 * @type      {Array<Array<number>|*>}
 * @extends   series.scatter.data
 * @product   highcharts
 * @apioption series.scatter3d.data
 */

/**
 * The z value for each data point.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.scatter3d.data.z
 */

''; // detachs doclets above

/* *
 *
 *  Default Export
 *
 * */

export default Scatter3DSeriesDefaults;
