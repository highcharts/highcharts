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
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type WaterfallPointOptions from './WaterfallPointOptions';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */


/**
 * A waterfall chart displays sequentially introduced positive or negative
 * values in cumulative columns.
 *
 * A `waterfall` series. If the [type](#series.waterfall.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/waterfall/
 *         Waterfall chart
 *
 * @sample highcharts/plotoptions/waterfall-inverted/
 *         Horizontal (inverted) waterfall
 *
 * @sample highcharts/plotoptions/waterfall-stacked/
 *         Stacked waterfall chart
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.waterfall
 *
 * @excluding boostThreshold, boostBlending
 *
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 *
 * @product highcharts
 *
 * @requires highcharts-more
 */
export interface WaterfallSeriesOptions extends ColumnSeriesOptions {

    /**
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    color?: ColorType;

    /**
     * An array of data points for the series. For the `waterfall` series
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
     *        [0, 7],
     *        [1, 8],
     *        [2, 3]
     *    ]
     *    ```
     *
     * 3. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.waterfall.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        y: 8,
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
     * @excluding marker
     *
     * @product highcharts
     *
     * @apioption series.waterfall.data
     */
    data?: Array<(WaterfallPointOptions|PointShortOptions)>;

    /**
     * The color of the border of each waterfall column.
     *
     * In styled mode, the border stroke can be set with the
     * `.highcharts-point` class.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @since 3.0
     *
     * @product highcharts
     */
    borderColor?: ColorType;

    /**
     * A name for the dash style to use for the line connecting the columns
     * of the waterfall series. Possible values: Dash, DashDot, Dot,
     * LongDash, LongDashDot, LongDashDotDot, ShortDash, ShortDashDot,
     * ShortDashDotDot, ShortDot, Solid
     *
     * In styled mode, the stroke dash-array can be set with the
     * `.highcharts-graph` class.
     *
     * @type {Highcharts.DashStyleValue}
     *
     * @since 3.0
     *
     * @product highcharts
     */
    dashStyle?: DashStyleValue;

    /**
     * The color of the line that connects columns in a waterfall series.
     *
     * In styled mode, the stroke can be set with the `.highcharts-graph`
     * class.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @since 3.0
     *
     * @product highcharts
     */
    lineColor?: ColorType;

    /**
     * The width of the line connecting waterfall columns.
     *
     * @product highcharts
     */
    lineWidth?: number;

    states?: SeriesStatesOptions<WaterfallSeriesOptions>;

    /**
     * The color used specifically for positive point columns. When not
     * specified, the general series color is used.
     *
     * In styled mode, the waterfall colors can be set with the
     * `.highcharts-point-negative`, `.highcharts-sum` and
     * `.highcharts-intermediate-sum` classes.
     *
     * @sample {highcharts} highcharts/demo/waterfall/
     *         Waterfall
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts
     */
    upColor?: ColorType;

}

/* *
 *
 *  Default Export
 *
 * */

export default WaterfallSeriesOptions;
