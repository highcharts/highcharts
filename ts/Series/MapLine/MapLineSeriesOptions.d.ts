/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type MapLinePointOptions from './MapLinePointOptions';
import type MapLineSeries from './MapLineSeries';
import type MapSeriesOptions from '../Map/MapSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type {
    LegendSymbolType,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A mapline series is a special case of the map series where the value
 * colors are applied to the strokes rather than the fills. It can also be
 * used for freeform drawing, like dividers, in the map.
 *
 * A `mapline` series. If the [type](#series.mapline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample maps/demo/mapline-mappoint/
 *         Mapline and map-point chart
 *
 * @sample maps/demo/animated-mapline/
 *         Mapline with CSS keyframe animation
 *
 * @sample maps/demo/flight-routes
 *         Flight routes
 *
 * @extends plotOptions.map
 *
 * @extends series,plotOptions.mapline
 *
 * @excluding dragDrop
 *
 * @excluding dataParser, dataURL, dragDrop, marker
 *
 * @product highmaps
 */
export interface MapLineSeriesOptions extends MapSeriesOptions {

    /**
     * An array of data points for the series. For the `mapline` series type,
     * points can be given in the following ways:
     *
     * 1.  An array of numerical values. In this case, the numerical values
     * will be interpreted as `value` options. Example:
     *
     *  ```js
     *  data: [0, 5, 3, 5]
     *  ```
     *
     * 2.  An array of arrays with 2 values. In this case, the values correspond
     * to `[hc-key, value]`. Example:
     *
     *  ```js
     *     data: [
     *         ['us-ny', 0],
     *         ['us-mi', 5],
     *         ['us-tx', 3],
     *         ['us-ak', 5]
     *     ]
     *  ```
     *
     * 3.  An array of objects with named values. The following snippet shows
     *  only a
     * few settings, see the complete options set below. If the total number of
     *  data
     * points exceeds the series' [turboThreshold](#series.map.turboThreshold),
     * this option is not available.
     *
     *  ```js
     *     data: [{
     *         value: 6,
     *         name: "Point2",
     *         color: "#00FF00"
     *     }, {
     *         value: 6,
     *         name: "Point1",
     *         color: "#FF00FF"
     *     }]
     *  ```
     *
     * @type {Array<number|Array<string,(number|null)>|null|*>}
     *
     * @extends series.map.data
     *
     * @excluding drilldown
     *
     * @product highmaps
     */
    data?: Array<(MapLinePointOptions|PointShortOptions)>;

    /**
     * Fill color for the map line shapes
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    fillColor?: ColorType;

    legendSymbol?: LegendSymbolType;

    /**
     * Pixel width of the mapline line.
     *
     * @default 1
     *
     * @product highmaps
     *
     * @since 10.3.3
     */
    lineWidth?: number;

    /**
     *
     * @type {number}
     *
     * @product highmaps
     *
     * @excluding borderWidth
     *
     * @apioption plotOptions.mapline.states.hover
     */

    /**
     * Pixel width of the mapline line.
     *
     * @type {number}
     *
     * @since 10.2.0
     *
     * @product highmaps
     *
     * @apioption plotOptions.mapline.states.hover.lineWidth
     */

    states?: SeriesStatesOptions<MapLineSeries>;

}

/* *
 *
 *  Default Export
 *
 * */

export default MapLineSeriesOptions;
