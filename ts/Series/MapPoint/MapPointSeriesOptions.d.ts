/* *
 *
 *  Imports
 *
 * */

import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type MapPointSeries from './MapPointSeries';
import type MapPointPointOptions from './MapPointPointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
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
 * A mappoint series is a special form of scatter series where the points
 * can be laid out in map coordinates on top of a map.
 *
 * A `mappoint` series. If the [type](#series.mappoint.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample maps/demo/mapline-mappoint/
 *         Map-line and map-point series.
 *
 * @sample maps/demo/mappoint-mapmarker
 *         Using the mapmarker symbol for points
 *
 * @sample maps/demo/mappoint-datalabels-mapmarker
 *         Using the mapmarker shape for data labels
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.mappoint
 *
 * @product highmaps
 *
 * @excluding dataParser, dataURL
 *
 * @excluding borderColor, borderWidth
 *
 * @type {number}
 */
export interface MapPointSeriesOptions extends ScatterSeriesOptions {

    /**
     * An array of data points for the series. For the `mappoint` series
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
     * 3. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.mappoint.turboThreshold),
     *    this option is not available.
     *    ```js
     *        data: [{
     *            x: 1,
     *            y: 7,
     *            name: "Point2",
     *            color: "#00FF00"
     *        }, {
     *            x: 1,
     *            y: 4,
     *            name: "Point1",
     *            color: "#FF00FF"
     *        }]
     *    ```
     *
     * @type {Array<number|Array<number,(number|null)>|null|*>}
     *
     * @extends series.map.data
     *
     * @excluding labelrank, middleX, middleY, path, value
     *
     * @product highmaps
     */
    data?: Array<MapPointPointOptions>;

    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);

    legendSymbol?: LegendSymbolType;

    states?: SeriesStatesOptions<MapPointSeries>;

}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointSeriesOptions;
