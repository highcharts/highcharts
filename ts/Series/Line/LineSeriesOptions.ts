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

import type { LinePointOptions } from './LinePointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesOptions } from '../../Core/Series/SeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A line series displays information as a series of data points connected by
 * straight line segments.
 *
 * @sample {highcharts} highcharts/demo/line-chart/
 *         Line chart
 * @sample {highstock} stock/demo/basic-line/
 *         Line chart
 *
 * @product highcharts highstock
 */
export interface LineSeriesOptions extends SeriesOptions {
    /**
     * An array of data points for the series. For the `line` series type,
     * points can be given in the following ways:
     *
     * 1. An array of numerical values. In this case, the numerical values will
     *    be interpreted as `y` options. The `x` values will be automatically
     *    calculated, either starting at 0 and incremented by 1, or from
     *    `pointStart` and `pointInterval` given in the series options. If the
     *    axis has categories, these will be used. Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * 2. An array of arrays with 2 values. In this case, the values correspond
     *    to `x,y`. If the first value is a string, it is applied as the name of
     *    the point, and the `x` value is inferred.
     *    ```js
     *    data: [
     *        [0, 1],
     *        [1, 2],
     *        [2, 8]
     *    ]
     *    ```
     *
     * 3. An array of objects with named values. The following snippet shows
     *    only a few settings, see the complete options set below. If the total
     *    number of data points exceeds the series'
     *    [turboThreshold](#series.line.turboThreshold),
     *    this option is not available.
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
     * **Note:** In TypeScript you have to extend `PointOptionsObject` with an
     * additional declaration to allow custom data types:
     * ```ts
     * declare module `highcharts` {
     *   interface PointOptionsObject {
     *     custom: Record<string, (boolean|number|string)>;
     *   }
     * }
     * ```
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
     */
    data?: Array<(LinePointOptions|PointShortOptions)>;

    /**
     * @default 'lineMarker'
     */
    legendSymbol?: SeriesOptions['legendSymbol'];

    states?: SeriesStatesOptions<LineSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LineSeriesOptions;
