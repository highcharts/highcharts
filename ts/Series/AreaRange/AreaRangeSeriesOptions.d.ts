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

import type AreaRangeDataLabelOptions from './AreaRangeDataLabelOptions';
import type AreaRangePointOptions from './AreaRangePointOptions';
import type AreaSeriesOptions from '../Area/AreaSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';
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
 * A `arearange` series. If the [type](#series.arearange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends series,plotOptions.arearange
 *
 * @excluding dataParser, dataURL, stack, stacking
 *
 * @product highcharts highstock
 *
 * @requires highcharts-more
 *
 * @apioption series.arearange
 */
export interface AreaRangeSeriesOptions extends AreaSeriesOptions {

    dataLabels?: (
        AreaRangeDataLabelOptions |
        Array<AreaRangeDataLabelOptions>
    );

    states?: SeriesStatesOptions<AreaRangeSeriesOptions>;

    trackByArea?: boolean;

    /**
     * Options for the lower markers of the arearange-like series. When
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
     */
    lowMarker?: PointMarkerOptions;

    /**
     *
     * @sample {highcharts} highcharts/series-arearange/lowmarker/
     *         Area range chart with `lowMarker` option
     *
     * @declare Highcharts.PointMarkerOptionsObject
     *
     * @extends plotOptions.series.marker.symbol
     *
     * @product highcharts highstock
     *
     * @apioption plotOptions.arearange.lowMarker.symbol
     */

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
