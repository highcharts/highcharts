/* *
 *
 *  Vector plot series module
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

import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type VectorPointOptions from './VectorPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export type VectorRotationOriginValue = ('start'|'center'|'end');

/**
 * A vector plot is a type of cartesian chart where each point has an X and
 * Y position, a length and a direction. Vectors are drawn as arrows.
 *
 * A `vector` series. If the [type](#series.vector.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts|highstock} highcharts/demo/vector-plot/
 *         Vector pot
 *
 * @since 6.0.0
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.vector
 *
 * @excluding boostThreshold, marker, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dragDrop, gapSize, gapUnit,
 *            dataGrouping, linecap, shadow, stacking, step, jitter,
 *            boostBlending
 *
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 *
 * @product highcharts highstock
 *
 * @requires modules/vector
 */
export interface VectorSeriesOptions extends ScatterSeriesOptions {

    /**
     * An array of data points for the series. For the `vector` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 4 values. In this case, the values correspond
     *  to
     *    to `x,y,length,direction`. If the first value is a string, it is
     *  applied
     *    as the name of the point, and the `x` value is inferred.
     *    ```js
     *    data: [
     *        [0, 0, 10, 90],
     *        [0, 1, 5, 180],
     *        [1, 1, 2, 270]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.area.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 0,
     *        y: 0,
     *        name: "Point2",
     *        length: 10,
     *        direction: 90
     *    }, {
     *        x: 1,
     *        y: 1,
     *        name: "Point1",
     *        direction: 270
     *    }]
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
     * @type {Array<Array<(number|string),number,number,number>|*>}
     *
     * @extends series.line.data
     *
     * @product highcharts highstock
     */
    data?: Array<(VectorPointOptions|PointShortOptions)>;

    marker?: PointMarkerOptions;

    /**
     * The line width for each vector arrow.
     */
    lineWidth?: number;

    /**
     * What part of the vector it should be rotated around. Can be one of
     * `start`, `center` and `end`. When `start`, the vectors will start
     * from the given [x, y] position, and when `end` the vectors will end
     * in the [x, y] position.
     *
     * @sample highcharts/plotoptions/vector-rotationorigin-start/
     *         Rotate from start
     *
     * @validvalue ["start", "center", "end"]
     */
    rotationOrigin?: VectorRotationOriginValue;

    states?: SeriesStatesOptions<VectorSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

    /**
     * Maximum length of the arrows in the vector plot. The individual arrow
     * length is computed between 0 and this value.
     */
    vectorLength?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default VectorSeriesOptions;
