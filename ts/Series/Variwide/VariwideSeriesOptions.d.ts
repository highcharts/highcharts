/* *
 *
 *  Highcharts variwide module
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type VariwidePointOptions from './VariwidePointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A variwide chart (related to marimekko chart) is a column chart with a
 * variable width expressing a third dimension.
 *
 * A `variwide` series. If the [type](#series.variwide.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/variwide/
 *         Variwide chart
 *
 * @sample {highcharts} highcharts/series-variwide/inverted/
 *         Inverted variwide chart
 *
 * @sample {highcharts} highcharts/series-variwide/datetime/
 *         Variwide columns on a datetime axis
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.variwide
 *
 * @since 6.0.0
 *
 * @product highcharts
 *
 * @excluding boostThreshold, crisp, depth, edgeColor, edgeWidth,
 *            groupZPadding, boostBlending
 *
 * @excluding boostThreshold, boostBlending
 *
 * @requires modules/variwide
 */
interface VariwideSeriesOptions extends ColumnSeriesOptions {

    /**
     * An array of data points for the series. For the `variwide` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 3 or 2 values. In this case, the values
     *  correspond
     *    to `x,y,z`. If the first value is a string, it is applied as the name
     *  of
     *    the point, and the `x` value is inferred. The `x` value can also be
     *    omitted, in which case the inner arrays should be of length 2. Then
     *  the
     *    `x` value is automatically calculated, either starting at 0 and
     *    incremented by 1, or from `pointStart` and `pointInterval` given in
     *  the
     *    series options.
     *    ```js
     *       data: [
     *           [0, 1, 2],
     *           [1, 5, 5],
     *           [2, 0, 2]
     *       ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.variwide.turboThreshold), this option is not
     *    available.
     *    ```js
     *       data: [{
     *           x: 1,
     *           y: 1,
     *           z: 1,
     *           name: "Point2",
     *           color: "#00FF00"
     *       }, {
     *           x: 1,
     *           y: 5,
     *           z: 4,
     *           name: "Point1",
     *           color: "#FF00FF"
     *       }]
     *    ```
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
     * @type {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
     *
     * @extends series.line.data
     *
     * @excluding marker
     *
     * @product highcharts
     *
     * @apioption series.variwide.data
     */
    data?: Array<(VariwidePointOptions|PointShortOptions)>;

    /**
     * In a variwide chart, the group padding is 0 in order to express the
     * horizontal stacking of items.
     */
    groupPadding?: number;

    /**
     * In a variwide chart, the point padding is 0 in order to express the
     * horizontal stacking of items.
     */
    pointPadding?: number;

    states?: SeriesStatesOptions<VariwideSeriesOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default VariwideSeriesOptions;
