/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

import type AreaRangePointOptions from './AreaRangePointOptions';
import type AreaSeriesOptions from '../Area/AreaSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        trackByArea?: boolean;
    }
}

/**
 * Extended data labels for range series types. Range series data labels use
 * no `x` and `y` options. Instead, they have `xLow`, `xHigh`, `yLow` and
 * `yHigh` options to allow the higher and lower data label sets individually.
 *
 * TODO: `x` and `y` are still inherited from `DataLabelOptions`, because
 * `AreaRangeSeries.drawDataLabels` temporarily maps the range-specific offsets
 * to these base properties while rendering. Tighten this to
 * `Omit<DataLabelOptions, 'x' | 'y'>` when that flow can be refactored.
 */
export interface AreaRangeDataLabelOptions extends DataLabelOptions {

    /**
     * X offset of the higher data labels relative to the point value.
     *
     * @sample highcharts/plotoptions/arearange-datalabels/
     *         Data labels on range series
     *
     * @default 0
     */
    xHigh?: number;

    /**
     * X offset of the lower data labels relative to the point value.
     *
     * @sample highcharts/plotoptions/arearange-datalabels/
     *         Data labels on range series
     *
     * @default 0
     */
    xLow?: number;

    /**
     * Y offset of the higher data labels relative to the point value.
     *
     * @sample highcharts/plotoptions/arearange-datalabels/
     *         Data labels on range series
     *
     * @default 0
     */
    yHigh?: number;

    /**
     * Y offset of the lower data labels relative to the point value.
     *
     * @sample highcharts/plotoptions/arearange-datalabels/
     *         Data labels on range series
     *
     * @default 0
     */
    yLow?: number;
}

/**
 * A `arearange` series. If the [type](#series.arearange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 */
export interface AreaRangeSeriesOptions extends AreaSeriesOptions {

    /**
     * Extended data labels for range series types. Range series data labels
     * use no `x` and `y` options. Instead, they have `xLow`, `xHigh`, `yLow`
     * and `yHigh` options to allow the higher and lower data label sets
     * individually.
     *
     * @declare Highcharts.SeriesAreaRangeDataLabelsOptionsObject
     *
     * @exclude x, y
     *
     * @since 2.3.0
     *
     * @product highcharts highstock
     */
    dataLabels?: (
        AreaRangeDataLabelOptions |
        Array<AreaRangeDataLabelOptions>
    );

    states?: SeriesStatesOptions<AreaRangeSeriesOptions>;

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @sample {highcharts|highstock} highcharts/plotoptions/area-trackbyarea/
     *         Display the tooltip when the area is hovered
     *
     * @default true
     *
     * @since 2.3.0
     *
     * @product highcharts highstock
     */
    trackByArea?: boolean;

    /**
     * Options for the lower markers of the arearange-like series. When
     *  `lowMarker`
     * is not defined, options inherit from the marker.
     *
     * @see [marker](#series.arearange.marker)
     *
     * @sample {highcharts} highcharts/series-arearange/lowmarker/
     *         Area range chart with `lowMarker` option
     *
     * @declare Highcharts.PointMarkerOptionsObject
     *
     * @extends plotOptions.series.marker
     *
     * @product highcharts highstock
     */
    lowMarker?: PointMarkerOptions;

    /**
     *
     * @see [color](#series.arearange.color)
     *
     * @see [fillColor](#series.arearange.fillColor)
     *
     * @default {highcharts} 0.75
     *
     * @default {highstock} 0.75
     */
    fillOpacity?: number;

    /**
     *
     * @see [color](#series.arearange.color)
     *
     * @see [fillOpacity](#series.arearange.fillOpacity)
     */
    fillColor?: ColorType;

    /**
     * An array of data points for the series. For the `arearange` series type,
     * points can be given in the following ways:
     *
     * 1.  An array of arrays with 3 or 2 values. In this case, the values
     *     correspond to `x,low,high`. If the first value is a string, it is
     *     applied as the name of the point, and the `x` value is inferred.
     *     The `x` value can also be omitted, in which case the inner arrays
     *     should be of length 2\. Then the `x` value is automatically
     *  calculated,
     *     either starting at 0 and incremented by 1, or from `pointStart`
     *     and `pointInterval` given in the series options.
     *     ```js
     *     data: [
     *         [0, 8, 3],
     *         [1, 1, 1],
     *         [2, 6, 8]
     *     ]
     *     ```
     *
     * 2.  An array of objects with named values. The following snippet shows
     *  only a
     *     few settings, see the complete options set below. If the total
     *  number of
     *     data points exceeds the series'
     *     [turboThreshold](#series.arearange.turboThreshold),
     *     this option is not available.
     *     ```js
     *     data: [{
     *         x: 1,
     *         low: 9,
     *         high: 0,
     *         name: "Point2",
     *         color: "#00FF00"
     *     }, {
     *         x: 1,
     *         low: 3,
     *         high: 4,
     *         name: "Point1",
     *         color: "#FF00FF"
     *     }]
     *     ```
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
     * @excluding marker, y
     *
     * @product highcharts highstock
     */
    data?: Array<(AreaRangePointOptions|PointShortOptions)>;

    /**
     *
     * @see [fillColor](#series.arearange.fillColor)
     *
     * @see [fillOpacity](#series.arearange.fillOpacity)
     */
    color?: ColorType;

}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangeSeriesOptions;
