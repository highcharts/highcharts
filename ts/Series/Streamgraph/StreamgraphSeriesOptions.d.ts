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

import type AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type { StackOverflowValue } from '../../Core/Axis/Stacking/StackingOptions';
import type StreamgraphPointOptions from './StreamgraphPointOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * A streamgraph is a type of stacked area graph which is displaced around a
 * central axis, resulting in a flowing, organic shape.
 *
 * A `streamgraph` series. If the [type](#series.streamgraph.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts|highstock} highcharts/demo/streamgraph/
 *         Streamgraph
 *
 * @extends plotOptions.areaspline
 *
 * @extends series,plotOptions.streamgraph
 *
 * @since 6.0.0
 *
 * @product highcharts highstock
 *
 * @requires modules/streamgraph
 *
 * @excluding dataParser, dataURL, step, boostThreshold, boostBlending
 */
export interface StreamgraphSeriesOptions extends AreaSplineSeriesOptions {

    /**
     *
     * @see [fillColor](#plotOptions.streamgraph.fillColor)
     *
     * @see [fillOpacity](#plotOptions.streamgraph.fillOpacity)
     *
     * @see [fillColor](#series.streamgraph.fillColor)
     *
     * @see [fillOpacity](#series.streamgraph.fillOpacity)
     */
    color?: ColorType;

    /**
     * An array of data points for the series. For the `streamgraph` series
     *  type,
     * points can be given in the following ways:
     *
     * 1. An array of numerical values. In this case, the numerical values will
     *  be
     *    interpreted as `y` options. The `x` values will be automatically
     *    calculated, either starting at 0 and incremented by 1, or from
     *    `pointStart` and `pointInterval` given in the series options. If the
     *  axis
     *    has categories, these will be used. Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * 2. An array of arrays with 2 values. In this case, the values correspond
     *  to
     *    `x,y`. If the first value is a string, it is applied as the name of
     *  the
     *    point, and the `x` value is inferred.
     *    ```js
     *        data: [
     *            [0, 9],
     *            [1, 7],
     *            [2, 6]
     *        ]
     *    ```
     *
     * 3. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.area.turboThreshold),
     *    this option is not available.
     *    ```js
     *        data: [{
     *            x: 1,
     *            y: 9,
     *            name: "Point2",
     *            color: "#00FF00"
     *        }, {
     *            x: 1,
     *            y: 6,
     *            name: "Point1",
     *            color: "#FF00FF"
     *        }]
     *    ```
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
     * @type {Array<number|Array<(number|string),(number|null)>|null|*>}
     *
     * @extends series.line.data
     *
     * @product highcharts highstock
     */
    data?: Array<(StreamgraphPointOptions|PointShortOptions)>;

    /**
     * @see [color](#plotOptions.streamgraph.color)
     *
     * @see [fillOpacity](#plotOptions.streamgraph.fillOpacity)
     *
     * @see [color](#series.streamgraph.color)
     *
     * @see [fillOpacity](#series.streamgraph.fillOpacity)
     */
    fillColor?: ColorType;

    /**
     * @see [color](#plotOptions.streamgraph.color)
     *
     * @see [fillColor](#plotOptions.streamgraph.fillColor)
     *
     * @see [color](#series.streamgraph.color)
     *
     * @see [fillColor](#series.streamgraph.fillColor)
     *
     * @default 1
     */
    fillOpacity?: number;

    stacking?: StackOverflowValue;

    states?: SeriesStatesOptions<StreamgraphSeriesOptions>;

    marker?: PointMarkerOptions;

    lineWidth?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default StreamgraphSeriesOptions;
