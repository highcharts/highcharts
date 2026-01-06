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

import type BoxPlotSeriesOptions from '../BoxPlot/BoxPlotSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';
import type ErrorBarPointOptions from './ErrorBarPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Error bars are a graphical representation of the variability of data and
 * are used on graphs to indicate the error, or uncertainty in a reported
 * measurement.
 *
 * A `errorbar` series. If the [type](#series.errorbar.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/error-bar/
 *         Error bars on a column series
 *
 * @sample highcharts/series-errorbar/on-scatter/
 *         Error bars on a scatter series
 *
 * @sample highcharts/series-errorbar/datalabels/
 *         Error bars with data labels
 *
 * @extends plotOptions.boxplot
 *
 * @extends series,plotOptions.errorbar
 *
 * @excluding boostBlending, boostThreshold
 *
 * @excluding dataParser, dataURL, stack, stacking, boostThreshold,
 *            boostBlending
 *
 * @product highcharts
 *
 * @requires highcharts-more
 */
export interface ErrorBarSeriesOptions extends BoxPlotSeriesOptions {

    /**
     * The main color of the bars. This can be overridden by
     * [stemColor](#plotOptions.errorbar.stemColor) and
     * [whiskerColor](#plotOptions.errorbar.whiskerColor) individually.
     *
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @default #000000
     *
     * @since 3.0
     *
     * @product highcharts
     */
    color?: ColorType;

    /**
     * An array of data points for the series. For the `errorbar` series
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
     *        [0, 10, 2],
     *        [1, 1, 8],
     *        [2, 4, 5]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.errorbar.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        low: 0,
     *        high: 0,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        x: 1,
     *        low: 5,
     *        high: 5,
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
     * @excluding dataLabels, drilldown, marker, states
     *
     * @product highcharts
     *
     * @apioption series.errorbar.data
     */
    data?: Array<(ErrorBarPointOptions|PointShortOptions)>;

    grouping?: boolean;

    /**
     * The parent series of the error bar. The default value links it to
     * the previous series. Otherwise, use the id of the parent series.
     *
     * @since 3.0
     *
     * @product highcharts
     */
    linkedTo?: string;

    states?: SeriesStatesOptions<ErrorBarSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

    /**
     * The line width of the whiskers, the horizontal lines marking
     * low and high values. When `null`, the general
     * [lineWidth](#plotOptions.errorbar.lineWidth) applies.
     *
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type {number}
     *
     * @since 3.0
     *
     * @product highcharts
     */
    whiskerWidth?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default ErrorBarSeriesOptions;
