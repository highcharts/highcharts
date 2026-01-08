/* *
 *
 *  Wind barb series module
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
import type PointShortOptions from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type WindbarbPointOptions from './WindbarbPointOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * Wind barbs are a convenient way to represent wind speed and direction in
 * one graphical form. Wind direction is given by the stem direction, and
 * wind speed by the number and shape of barbs.
 *
 * A `windbarb` series. If the [type](#series.windbarb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts|highstock} highcharts/demo/windbarb-series/
 *         Wind barb series
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.windbarb
 *
 * @excluding boostThreshold, marker, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dragDrop, gapSize, gapUnit,
 *            linecap, shadow, stacking, step, boostBlending
 *
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 *
 * @since 6.0.0
 *
 * @product highcharts highstock
 *
 * @requires modules/windbarb
 */
export interface WindbarbSeriesOptions extends ColumnSeriesOptions {

    /**
     * @default value
     */
    colorKey?: string;

    /**
     * An array of data points for the series. For the `windbarb` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 3 values. In this case, the values correspond
     *  to
     *    `x,value,direction`. If the first value is a string, it is applied as
     *  the
     *    name of the point, and the `x` value is inferred.
     *    ```js
     *       data: [
     *           [Date.UTC(2017, 0, 1, 0), 3.3, 90],
     *           [Date.UTC(2017, 0, 1, 1), 12.1, 180],
     *           [Date.UTC(2017, 0, 1, 2), 11.1, 270]
     *       ]
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
     *       data: [{
     *           x: Date.UTC(2017, 0, 1, 0),
     *           value: 12.1,
     *           direction: 90
     *       }, {
     *           x: Date.UTC(2017, 0, 1, 1),
     *           value: 11.1,
     *           direction: 270
     *       }]
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
     * @type {Array<Array<(number|string),number,number>|*>}
     *
     * @extends series.line.data
     *
     * @product highcharts highstock
     *
     * @apioption series.windbarb.data
     */
    data?: Array<(WindbarbPointOptions|PointShortOptions)>;

    /**
     * Data grouping options for the wind barbs. In Highcharts, this
     * requires the `modules/datagrouping.js` module to be loaded. In
     * Highcharts Stock, data grouping is included.
     *
     * @sample highcharts/plotoptions/windbarb-datagrouping
     *         Wind barb with data grouping
     *
     * @since 7.1.0
     *
     * @product highcharts highstock
     */
    dataGrouping?: WindbarbSeriesDataGroupingOptions;

    /**
     * The line width of the wind barb symbols.
     */
    lineWidth?: number;

    /**
     * The id of another series in the chart that the wind barbs are
     * projected on. When `null`, the wind symbols are drawn on the X axis,
     * but offset up or down by the `yOffset` setting.
     *
     * @sample {highcharts|highstock} highcharts/plotoptions/windbarb-onseries
     *         Projected on area series
     *
     * @type {string|null}
     */
    onSeries?: (string|null);

    states?: SeriesStatesOptions<WindbarbSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

    /**
     * Pixel length of the stems.
     */
    vectorLength?: number;

    /**
     * Horizontal offset from the cartesian position, in pixels. When the
     * chart is inverted, this option allows translation like
     * [yOffset](#plotOptions.windbarb.yOffset) in non inverted charts.
     *
     * @since 6.1.0
     */
    xOffset?: number;

    /**
     * Vertical offset from the cartesian position, in pixels. The default
     * value makes sure the symbols don't overlap the X axis when `onSeries`
     * is `null`, and that they don't overlap the linked series when
     * `onSeries` is given.
     */
    yOffset?: number;

}

/**
 * Data grouping options for the wind barbs. In Highcharts, this
 * requires the `modules/datagrouping.js` module to be loaded. In
 * Highcharts Stock, data grouping is included.
 *
 * @sample highcharts/plotoptions/windbarb-datagrouping
 *         Wind barb with data grouping
 *
 * @since 7.1.0
 *
 * @product highcharts highstock
 */
interface WindbarbSeriesDataGroupingOptions {

    /**
     * Whether to enable data grouping.
     *
     * @product highcharts highstock
     */
    enabled?: boolean;

    /**
     * Approximation function for the data grouping. The default
     * returns an average of wind speed and a vector average direction
     * weighted by wind speed.
     *
     * @product highcharts highstock
     *
     * @type {string|Function}
     */
    approximation?: string|Function;

    /**
     * The approximate data group width.
     *
     * @product highcharts highstock
     */
    groupPixelWidth?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default WindbarbSeriesOptions;
