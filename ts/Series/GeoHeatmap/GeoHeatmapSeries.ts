/* *
 *
 *  (c) 2010-2023 Highsoft AS
 *  Authors:
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GeoHeatmapSeriesOptions from './GeoHeatmapSeriesOptions.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import GeoHeatmapPoint from './GeoHeatmapPoint.js';

const {
    seriesTypes: {
        map: MapSeries
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';

const {
    extend,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */


/* *
 *
 *  Class
 *
 * */

/**
 * The Geo Heatmap series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.geoheatmap
 *
 * @augments Highcharts.Series
 */

class GeoHeatmapSeries extends MapSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A `geoheatmap` series is a variety of heatmap series, composed into
     * the map projection, where the units are expressed in the latitude
     * and longitude, and individual values contained in a matrix are
     * represented as colors.
     *
     * @sample maps/demo/geoheatmap/
     *         GeoHeatmap chart
     *
     * @extends      plotOptions.map
     * @since        next
     * @product      highmaps
     * @excluding    allAreas, dragDrop, findNearestPointBy, geometry, joinBy, negativeColor, onPoint,
     * @requires     modules/geoheatmap
     * @optionparent plotOptions.geoheatmap
     */

    public static defaultOptions: GeoHeatmapSeriesOptions =
        merge(MapSeries.defaultOptions, {

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
             * @type      {number|null}
             * @default   1
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.borderWidth
             */
            borderWidth: 1,

            /**
             * The column size - how many longitude units each column in the
             * geoheatmap should span.
             *
             * @sample maps/demo/geoheatmap/
             *         GeoHeatmap chart
             *
             * @type      {number}
             * @default   1
             * @since     next
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
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     next
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.color
             */

            /**
             * The rowsize size - how many latitude units each row in the
             * geoheatmap should span.
             *
             * @sample maps/demo/geoheatmap/
             *         GeoHeatmap chart
             *
             * @type      {number}
             * @default   1
             * @since     next
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.rowsize
             */
            rowsize: 1,

            /**
             * The z index of the geoheatmap series.
             *
             * @type      {number}
             * @since     next
             * @product   highmaps
             * @default   2
             * @apioption plotOptions.geoheatmap.zIndex
             */
            zIndex: 2
        } as GeoHeatmapSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public options: GeoHeatmapSeriesOptions = void 0 as any;
    public data: Array<GeoHeatmapPoint> = void 0 as any;
    public points: Array<GeoHeatmapPoint> = void 0 as any;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface GeoHeatmapSeries {
    pointClass: typeof GeoHeatmapPoint;
    pointArrayMap: Array<string>;
}
extend(GeoHeatmapSeries.prototype, {
    type: 'geoheatmap',
    pointClass: GeoHeatmapPoint,
    pointArrayMap: ['lon', 'lat', 'value']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        geoheatmap: typeof GeoHeatmapSeries;
    }
}
SeriesRegistry.registerSeriesType('geoheatmap', GeoHeatmapSeries);

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeries;


/* *
 *
 *  API Options
 *
 * */

/**
 * A `geoheatmap` series. If the [type](#series.map.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.geoheatmap
 * @excluding allAreas, dataParser, dataURL, dragDrop, findNearestPointBy,
 *            joinBy, marker, mapData, negativeColor, onPoint, shadow
 * @product   highmaps
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
 * @sample maps/demo/geoheatmap/
 *         GeoHeatmap chart
 *
 * @type      {Array<Array<number>|*>}
 * @extends   series.map.data
 * @product   highmaps
 * @apioption series.geoheatmap.data
 */

/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highmaps
 * @apioption series.geoheatmap.data.color
 */

/**
 * The value of the point, resulting in a color controled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.geoheatmap.data.value
 */

/**
 * The border width of each geoheatmap tile.
 *
 * In styled mode, the border stroke width is given in the
 * `.highcharts-point` class.
 *
 * @type      {number|null}
 * @default   1
 * @product   highmaps
 * @apioption series.geoheatmap.borderWidth
 */

/**
 * The column size - how many longitude units each column in the
 * geoheatmap should span.
 *
 * @type      {number|null}
 * @default   1
 * @product   highmaps
 * @apioption series.geoheatmap.colsize
 */

/**
 * The rowsize size - how many latitude units each row in the
 * geoheatmap should span.
 *
 * @type      {number|null}
 * @default   1
 * @product   highmaps
 * @apioption series.geoheatmap.rowsize
 */

/**
 * The z index of the geoheatmap series.
 *
 * @type      {number}
 * @since     next
 * @product   highmaps
 * @default   2
 * @apioption plotOptions.geoheatmap.zIndex
 */

''; // adds doclets above to the transpiled file
