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
     * A geoheatmap series is a variety of heatmap series, composed into
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
     * @excluding    joinBy
     * @requires     modules/geoheatmap
     * @optionparent plotOptions.geoheatmap
     */

    public static defaultOptions: GeoHeatmapSeriesOptions =
        merge(MapSeries.defaultOptions, {
            /**
             * The keys property defines how the fields in data array should be
             * interpretated.
             *
             */
            keys: ['lon', 'lat', 'value'],

            /**
             * The opacity of the geoheatmap series.
             *
             * @type      {number}
             * @since     next
             * @product   highmaps
             * @default   0.7
             * @apioption plotOptions.geoheatmap.opacity
             */
            opacity: 0.7,

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
             * @product   highcharts highmaps
             * @apioption plotOptions.geoheatmap.colsize
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
             * @product   highcharts highmaps
             * @apioption plotOptions.geoheatmap.rowsize
             */
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
}
extend(GeoHeatmapSeries.prototype, {
    type: 'geoheatmap',
    pointClass: GeoHeatmapPoint
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

''; // adds doclets above to the transpiled file
