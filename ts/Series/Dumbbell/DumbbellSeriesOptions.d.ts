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

import type AreaRangeSeriesOptions from '../AreaRange/AreaRangeSeriesOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type DumbbellPointOptions from './DumbbellPointOptions';
import type {
    LegendSymbolType,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
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
 * The dumbbell series is a cartesian series with higher and lower values
 * for each point along an X axis, connected with a line between the
 * values.
 *
 * Requires `highcharts-more.js` and `modules/dumbbell.js`.
 *
 * The `dumbbell` series. If the [type](#series.dumbbell.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/dumbbell/
 *         Dumbbell chart
 *
 * @sample {highcharts} highcharts/series-dumbbell/styled-mode-dumbbell/
 *         Styled mode
 *
 * @extends plotOptions.arearange
 *
 * @extends series,plotOptions.dumbbell
 *
 * @product highcharts highstock
 *
 * @excluding fillColor, fillOpacity, lineWidth, stack, stacking,
 *            stickyTracking, trackByArea, boostThreshold, boostBlending
 *
 * @excluding boostThreshold, boostBlending
 *
 * @since 8.0.0
 *
 * @requires highcharts-more
 *
 * @requires modules/dumbbell
 */
interface DumbbellSeriesOptions extends AreaRangeSeriesOptions {
    states?: SeriesStatesOptions<DumbbellSeriesOptions>;

    /**
     * Color of the line that connects the dumbbell point's values.
     * By default it is the series' color.
     *
     * @type {string}
     *
     * @product highcharts highstock
     *
     * @since 8.0.0
     */
    connectorColor?: ColorString;

    /**
     * Pixel width of the line that connects the dumbbell point's
     * values.
     *
     * @since 8.0.0
     *
     * @product highcharts highstock
     */
    connectorWidth?: number;
    groupPadding?: number;
    pointPadding?: number;

    /**
     * Color of the start markers in a dumbbell graph. This option takes
     * priority over the series color. To avoid this, set `lowColor` to
     * `undefined`.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @since 8.0.0
     *
     * @product highcharts highstock
     */
    lowColor?: ColorType;

    /**
     * Options for the lower markers of the dumbbell-like series. When
     *  `lowMarker`
     * is not defined, options inherit form the marker.
     *
     * @see [marker](#series.arearange.marker)
     *
     * @declare Highcharts.PointMarkerOptionsObject
     *
     * @extends plotOptions.series.marker
     *
     * @default undefined
     *
     * @product highcharts highstock
     *
     * @apioption plotOptions.dumbbell.lowMarker
     */
    lowMarker?: PointMarkerOptions;

    /**
     * An array of data points for the series. For the `dumbbell` series
     * type, points can be given in the following ways:
     *
     * 1. An array of arrays with 3 or 2 values. In this case, the values
     *  correspond
     *    to `x,low,high`. If the first value is a string, it is applied as the
     *  name
     *    of the point, and the `x` value is inferred. The `x` value can also be
     *    omitted, in which case the inner arrays should be of length 2\. Then
     *  the
     *    `x` value is automatically calculated, either starting at 0 and
     *    incremented by 1, or from `pointStart` and `pointInterval` given in
     *  the
     *    series options.
     *    ```js
     *    data: [
     *        [0, 4, 2],
     *        [1, 2, 1],
     *        [2, 9, 10]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.dumbbell.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        low: 0,
     *        high: 4,
     *        name: "Point2",
     *        color: "#00FF00",
     *        lowColor: "#00FFFF",
     *        connectorWidth: 3,
     *        connectorColor: "#FF00FF"
     *    }, {
     *        x: 1,
     *        low: 5,
     *        high: 3,
     *        name: "Point1",
     *        color: "#FF00FF"
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
     * @type {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
     *
     * @extends series.arearange.data
     *
     * @product highcharts highstock
     *
     * @apioption series.dumbbell.data
     */
    data?: Array<(DumbbellPointOptions|PointShortOptions)>;

    legendSymbol?: LegendSymbolType;

    crisp?: boolean;

    stickyTracking?: boolean;

    pointRange?: number;

    lineWidth?: number;

    fillColor?: ColorType;

    trackByArea?: boolean;

}

/* *
 *
 *  Default Export
 *
 * */

export default DumbbellSeriesOptions;
