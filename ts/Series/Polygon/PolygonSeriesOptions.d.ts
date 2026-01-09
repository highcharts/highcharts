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
import type ColorType from '../../Core/Color/ColorType';
import type {
    LegendSymbolType,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type PolygonPointOptions from './PolygonPointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A polygon series can be used to draw any freeform shape in the cartesian
 * coordinate system. A fill is applied with the `color` option, and
 * stroke is applied through `lineWidth` and `lineColor` options.
 *
 * A `polygon` series. If the [type](#series.polygon.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/polygon/
 *         Polygon
 *
 * @sample {highstock} highcharts/demo/polygon/
 *         Polygon
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.polygon
 *
 * @since 4.1.0
 *
 * @excluding jitter, softThreshold, threshold, cluster, boostThreshold,
 *            boostBlending
 *
 * @excluding dataParser, dataURL, stack, boostThreshold, boostBlending
 *
 * @product highcharts highstock
 *
 * @requires highcharts-more
 */
interface PolygonSeriesOptions extends ScatterSeriesOptions {

    /**
     * An array of data points for the series. For the `polygon` series
     * type, points can be given in the following ways:
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
     *    data: [
     *        [0, 10],
     *        [1, 3],
     *        [2, 1]
     *    ]
     *    ```
     *
     * 3. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.polygon.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        y: 1,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        x: 1,
     *        y: 8,
     *        name: "Point1",
     *        color: "#FF00FF"
     *    }]
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
     *
     * @apioption series.polygon.data
     */
    data?: Array<(PolygonPointOptions|PointShortOptions)>;

    fillColor?: ColorType;

    legendSymbol?: LegendSymbolType;

    marker?: PointMarkerOptions;

    states?: SeriesStatesOptions<PolygonSeriesOptions>;

    stickyTracking?: boolean;

    trackByArea?: boolean;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default PolygonSeriesOptions;
