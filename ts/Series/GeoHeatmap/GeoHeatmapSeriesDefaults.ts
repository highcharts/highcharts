/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GeoHeatmapSeriesOptions from './GeoHeatmapSeriesOptions.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * A `geoheatmap` series is a variety of heatmap series, composed into
 * the map projection, where the units are expressed in the latitude
 * and longitude, and individual values contained in a matrix are
 * represented as colors.
 *
 * @sample maps/demo/geoheatmap-europe/
 *         GeoHeatmap Chart with interpolation on Europe map
 * @sample maps/series-geoheatmap/geoheatmap-equalearth/
 *         GeoHeatmap Chart on the Equal Earth Projection
 *
 * @extends      plotOptions.map
 * @since        11.0.0
 * @product      highmaps
 * @excluding    allAreas, dragDrop, findNearestPointBy, geometry, joinBy,
 * negativeColor, onPoint, stickyTracking
 * @requires     modules/geoheatmap
 * @optionparent plotOptions.geoheatmap
 */
const GeoHeatmapSeriesDefaults: GeoHeatmapSeriesOptions = {

    nullColor: 'transparent',

    tooltip: {
        pointFormat: 'Lat: {point.lat}, Lon: {point.lon}, Value: {point.value}<br/>'
    },

    /**
     * The border width of each geoheatmap tile.
     *
     * In styled mode, the border stroke width is given in the
     * `.highcharts-point` class.
     *
     * @sample maps/demo/geoheatmap-orthographic/
     *         borderWidth set to 1 to create a grid
     *
     * @type      {number|null}
     * @default   0
     * @product   highmaps
     * @apioption plotOptions.geoheatmap.borderWidth
     */
    borderWidth: 0,

    /**
     * The column size - how many longitude units each column in the
     * geoheatmap should span.
     *
     * @sample maps/demo/geoheatmap-europe/
     *         1 by default, set to 5
     *
     * @product   highmaps
     * @apioption plotOptions.geoheatmap.colsize
     */
    colsize: 1,

    /**
     * The main color of the series. In heat maps this color is rarely
     * used, as we mostly use the color to denote the value of each
     * point. Unless options are set in the [colorAxis](#colorAxis), the
     * default value is pulled from the [options.colors](#colors) array.
     *
     * @type      {Highcharts.ColorType}
     * @product   highmaps
     * @apioption plotOptions.geoheatmap.color
     */

    /**
     * The rowsize size - how many latitude units each row in the
     * geoheatmap should span.
     *
     * @sample maps/demo/geoheatmap-europe/
     *         1 by default, set to 5
     *
     * @product   highmaps
     * @apioption plotOptions.geoheatmap.rowsize
     */
    rowsize: 1,

    stickyTracking: true,

    /**
     * Make the geoheatmap render its data points as an interpolated
     * image. It can be used to show a Temperature Map-like charts.
     *
     * @sample maps/demo/geoheatmap-earth-statistics
     *         Advanced demo of GeoHeatmap interpolation with multiple
     *         datasets
     *
     * @type      {boolean|Highcharts.InterpolationOptionsObject}
     * @since     11.2.0
     * @product   highmaps
     */
    interpolation: {
        /**
         * Enable or disable the interpolation of the geoheatmap series.
         *
         * @since 11.2.0
         */
        enabled: false,
        /**
         * Represents how much blur should be added to the interpolated
         * image. Works best in the range of 0-1, all higher values
         * would need a lot more performance of the machine to calculate
         * more detailed interpolation.
         *
         *  * **Note:** Useful, if the data is spread into wide range of
         *  longitude and latitude values.
         *
         * @sample maps/series-geoheatmap/turkey-fire-areas
         *         Simple demo of GeoHeatmap interpolation
         *
         * @since  11.2.0
         */
        blur: 1
    }

};

/**
 * A `geoheatmap` series. If the [type](#series.map.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.geoheatmap
 * @excluding allAreas, dataParser, dataURL, dragDrop, findNearestPointBy,
 *            joinBy, marker, mapData, negativeColor, onPoint, shadow,
 *            stickyTracking
 * @product   highmaps
 * @requires  modules/geoheatmap
 * @apioption series.geoheatmap
 */

/**
 * An array of data points for the series. For the `geoheatmap` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `lon,lat,value`. The `value` refers to the color on the `colorAxis`.
 *
 *  ```js
 *     data: [
 *         [51.50, -0.12, 7],
 *         [54.59, -5.93, 4],
 *         [55.8, -4.25, 3]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.heatmap.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         lat: 51.50,
 *         lon: -0.12,
 *         value: 7,
 *         name: "London"
 *     }, {
 *         lat: 54.59,
 *         lon: -5.93,
 *         value: 4,
 *         name: "Belfast"
 *     }]
 *  ```
 *
 * @sample maps/demo/geoheatmap-europe/
 *         GeoHeatmap Chart with interpolation on Europe map
 * @sample maps/series-geoheatmap/geoheatmap-equalearth/
 *         GeoHeatmap Chart on the Equal Earth Projection
 *
 * @basic
 * @type      {Array<Array<number>|*>}
 * @extends   series.map.data
 * @product   highmaps
 * @apioption series.geoheatmap.data
 */

/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 *
 * @type      {Highcharts.ColorType}
 * @product   highmaps
 * @apioption series.geoheatmap.data.color
 */

/**
 * The value of the point, resulting in a color controlled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.geoheatmap.data.value
 */

/**
 * Detailed options for interpolation object.
 *
 * @interface Highcharts.InterpolationOptionsObject
 *//**
 *  Enable or disable the interpolation.
 *
 * @name Highcharts.InterpolationOptionsObject#enabled
 * @type {boolean}
 *//**
 * Represents how much blur should be added to the interpolated
 * image. Works best in the range of 0-1, all higher values
 * would need a lot more performance of the machine to calculate
 * more detailed interpolation.
 *
 * @name Highcharts.InterpolationOptionsObject#blur
 * @type {number}
 */

''; // Adds doclets above to the transpiled file

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeriesDefaults;
