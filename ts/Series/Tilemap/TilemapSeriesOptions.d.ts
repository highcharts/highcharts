/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Øystein Moseng
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

import type HeatmapSeriesOptions from '../Heatmap/HeatmapSeriesOptions';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TilemapPointOptions from './TilemapPointOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * A tilemap series is a type of heatmap where the tile shapes are
 * configurable.
 *
 * A `tilemap` series. If the [type](#series.tilemap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/honeycomb-usa/
 *         Honeycomb tilemap, USA
 *
 * @sample maps/plotoptions/honeycomb-brazil/
 *         Honeycomb tilemap, Brazil
 *
 * @sample maps/plotoptions/honeycomb-china/
 *         Honeycomb tilemap, China
 *
 * @sample maps/plotoptions/honeycomb-europe/
 *         Honeycomb tilemap, Europe
 *
 * @sample maps/demo/circlemap-africa/
 *         Circlemap tilemap, Africa
 *
 * @sample maps/demo/diamondmap
 *         Diamondmap tilemap
 *
 * @extends plotOptions.heatmap
 *
 * @extends series,plotOptions.tilemap
 *
 * @since 6.0.0
 *
 * @excluding jitter, joinBy, shadow, allAreas, mapData, marker, data,
 *            dataSorting, boostThreshold, boostBlending
 *
 * @excluding allAreas, dataParser, dataURL, joinBy, mapData, marker,
 *            pointRange, shadow, stack, dataSorting, boostThreshold,
 *            boostBlending
 *
 * @product highcharts highmaps
 *
 * @requires modules/tilemap
 */
export interface TilemapSeriesOptions extends HeatmapSeriesOptions {

    /**
     * An array of data points for the series. For the `tilemap` series
     * type, points can be given in the following ways:
     *
     * 1. An array of arrays with 3 or 2 values. In this case, the values
     *  correspond
     *    to `x,y,value`. If the first value is a string, it is applied as the
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
     *        [0, 9, 7],
     *        [1, 10, 4],
     *        [2, 6, 3]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The objects are point
     *  configuration
     *    objects as seen below. If the total number of data points exceeds the
     *    series' [turboThreshold](#series.tilemap.turboThreshold), this option
     *  is
     *    not available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        y: 3,
     *        value: 10,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        x: 1,
     *        y: 7,
     *        value: 10,
     *        name: "Point1",
     *        color: "#FF00FF"
     *    }]
     *    ```
     *
     * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
     * coordinates are offset.
     *
     * @sample maps/series/tilemap-gridoffset
     *         Offset grid coordinates
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
     * @extends series.heatmap.data
     *
     * @excluding marker
     *
     * @product highcharts highmaps
     */
    data?: Array<(PointShortOptions|TilemapPointOptions)>;

    /**
     * The column size - how many X axis units each column in the tilemap
     * should span. Works as in [Heatmaps](#plotOptions.heatmap.colsize).
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         One day
     *
     * @sample {highmaps} maps/demo/heatmap/
     *         One day
     *
     * @default 1
     *
     * @product highcharts highmaps
     */
    colsize?: number;

    marker?: PointMarkerOptions;

    /**
     * The padding between points in the tilemap.
     *
     * @sample maps/plotoptions/tilemap-pointpadding
     *         Point padding on tiles
     */
    pointPadding?: number;

    /**
     * The row size - how many Y axis units each tilemap row should span.
     * Analogous to [colsize](#plotOptions.tilemap.colsize).
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         1 by default
     *
     * @sample {highmaps} maps/demo/heatmap/
     *         1 by default
     *
     * @default 1
     *
     * @product highcharts highmaps
     */
    rowsize?: number;

    state?: SeriesStatesOptions<TilemapSeriesOptions>;

    states?: TilemapSeriesStatesOptions;

    /**
     * The shape of the tiles in the tilemap. Possible values are `hexagon`,
     * `circle`, `diamond`, and `square`.
     *
     * @sample maps/demo/circlemap-africa
     *         Circular tile shapes
     *
     * @sample maps/demo/diamondmap
     *         Diamond tile shapes
     */
    tileShape?: TilemapShapeValue;

}

interface TilemapSeriesStatesOptions {
    hover?: TilemapSeriesStatesHoverOptions;
}

interface TilemapSeriesStatesHoverOptions {
    halo?: TilemapSeriesStatesHoverHaloOptions;
}

interface TilemapSeriesStatesHoverHaloOptions {

    attributes?: TilemapSeriesStatesHoverHaloAttributesOptions;

    enabled?: boolean;

    size?: number;

    opacity?: number;

}

interface TilemapSeriesStatesHoverHaloAttributesOptions {
    zIndex?: number;
}

export type TilemapShapeValue = ('circle'|'diamond'|'hexagon'|'square');

/* *
 *
 *  Default Export
 *
 * */

export default TilemapSeriesOptions;
