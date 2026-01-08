/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Scatter3DPointOptions from './Scatter3DPointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * A 3D scatter plot uses x, y and z coordinates to display values for three
 * variables for a set of data.
 *
 * A `scatter3d` series. If the [type](#series.scatter3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * scatter3d](#plotOptions.scatter3d).
 *
 * @sample {highcharts} highcharts/3d/scatter/
 *         Simple 3D scatter
 *
 * @sample {highcharts} highcharts/demo/3d-scatter-draggable
 *         Draggable 3d scatter
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.scatter3d
 *
 * @excluding dragDrop, cluster, boostThreshold, boostBlending
 *
 * @excluding boostThreshold, boostBlending
 *
 * @product highcharts
 *
 * @requires highcharts-3d
 */
export interface Scatter3DSeriesOptions extends ScatterSeriesOptions {
    // Nothing here yet

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
     * 3.  An array of objects with named values. The following snippet shows
     *  only a
     * few settings, see the complete options set below. If the total number of
     *  data
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
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays/
     *         Arrays of numeric x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
     *         Arrays of datetime x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-name-value/
     *         Arrays of point.name and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @type {Array<Array<number>|*>}
     *
     * @extends series.scatter.data
     *
     * @product highcharts
     */
    data?: Array<Array<number>|Scatter3DPointOptions>;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default Scatter3DSeriesOptions;
