/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type {
    MapViewInsetsOptions,
    MapViewOptions
} from './MapViewOptions';

import { Palette } from '../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * The `mapView` options control the initial view of the chart, and how
 * projection is set up for raw geoJSON maps (beta as of v9.3).
 *
 * To set the view dynamically after chart generation, see
 * [mapView.setView](/class-reference/Highcharts.MapView#setView).
 *
 * @since        9.3.0
 * @product      highmaps
 * @optionparent mapView
 */
const MapViewDefaults: MapViewOptions = {

    /**
     * The center of the map in terms of longitude and latitude. For
     * preprojected maps (like the GeoJSON files in Map Collection v1.x),
     * the units are projected x and y units.
     *
     * @sample {highmaps} maps/mapview/center-zoom
     *         Custom view of a world map
     * @sample {highmaps} maps/mapview/get-view
     *         Report the current view of a preprojected map
     *
     * @type    {Highcharts.LonLatArray}
     * @default [0, 0]
     */
    center: [0, 0],

    /**
     * Fit the map to a geometry object consisting of individual points or
     * polygons. This is practical for responsive maps where we want to
     * focus on a specific area regardless of map size - unlike setting
     * `center` and `zoom`, where the view doesn't scale with different map
     * sizes.
     *
     * The geometry can be combined with the [padding](#mapView.padding)
     * option to avoid touching the edges of the chart.
     *
     * @sample maps/mapview/fittogeometry
     *         Fitting the view to geometries
     *
     * @type {object}
     * @since 10.3.3
     */
    fitToGeometry: void 0,

    /**
     * Prevents the end user from zooming too far in on the map. See
     * [zoom](#mapView.zoom).
     *
     * @sample {highmaps} maps/mapview/maxzoom
     *         Prevent zooming in too far
     *
     * @type   {number|undefined}
     */
    maxZoom: void 0,

    /**
     * The padding inside the plot area when auto fitting to the map bounds.
     * A number signifies pixels, and a percentage is relative to the plot
     * area size.
     *
     * An array sets individual padding for the sides in the order [top,
     * right, bottom, left].
     *
     * @sample {highmaps} maps/chart/plotbackgroundcolor-color
     *         Visible plot area and percentage padding
     * @sample {highmaps} maps/demo/mappoint-mapmarker
     *         Padding for individual sides
     *
     * @type  {number|string|Array<number|string>}
     */
    padding: 0,

    /**
     * The projection options allow applying client side projection to a map
     * given in geographic coordinates, typically from TopoJSON or GeoJSON.
     *
     * @sample maps/demo/projection-explorer
     *         Projection explorer
     * @sample maps/demo/topojson-projection
     *         Orthographic projection
     * @sample maps/mapview/projection-custom-proj4js
     *         Custom UTM projection definition
     * @sample maps/mapview/projection-custom-d3geo
     *         Custom Robinson projection definition
     *
     * @type   {object}
     */
    projection: {

        /**
         * Projection name. Built-in projections are `EqualEarth`,
         * `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
         *
         * @sample maps/demo/projection-explorer
         *         Projection explorer
         * @sample maps/mapview/projection-custom-proj4js
         *         Custom UTM projection definition
         * @sample maps/mapview/projection-custom-d3geo
         *         Custom Robinson projection definition
         * @sample maps/demo/topojson-projection
         *         Orthographic projection
         *
         * @type   {string}
         */
        name: void 0,

        /**
         * The two standard parallels that define the map layout in conic
         * projections, like the LambertConformalConic projection. If only
         * one number is given, the second parallel will be the same as the
         * first.
         *
         * @sample maps/mapview/projection-parallels
         *         LCC projection with parallels
         * @sample maps/demo/projection-explorer
         *         Projection explorer
         *
         * @type {Array<number>}
         */
        parallels: void 0,

        /**
         * Rotation of the projection in terms of degrees `[lambda, phi,
         * gamma]`. When given, a three-axis spherical rotation is be applied
         * to the globe prior to the projection.
         *
         * * `lambda` shifts the longitudes by the given value.
         * * `phi` shifts the latitudes by the given value. Can be omitted.
         * * `gamma` applies a _roll_. Can be omitted.
         *
         * @sample maps/demo/projection-explorer
         *         Projection explorer
         * @sample maps/mapview/projection-america-centric
         *         America-centric world map
         */
        rotation: void 0
    },

    /**
     * The zoom level of a map. Higher zoom levels means more zoomed in. An
     * increase of 1 zooms in to a quarter of the viewed area (half the
     * width and height). Defaults to fitting to the map bounds.
     *
     * In a `WebMercator` projection, a zoom level of 0 represents
     * the world in a 256x256 pixel square. This is a common concept for WMS
     * tiling software.
     *
     * @sample {highmaps} maps/mapview/center-zoom
     *         Custom view of a world map
     * @sample {highmaps} maps/mapview/get-view
     *         Report the current view of a preprojected map
     *
     * @type   {number}
     */
    zoom: void 0,

    /**
     * Generic options for the placement and appearance of map insets like
     * non-contiguous territories.
     *
     * @since        10.0.0
     * @product      highmaps
     * @optionparent mapView.insetOptions
     */
    insetOptions: {

        /**
         * The border color of the insets.
         *
         * @sample maps/mapview/insetoptions-border
         *         Inset border options
         *
         * @type {Highcharts.ColorType}
         */
        borderColor: Palette.neutralColor20,

        /**
         * The pixel border width of the insets.
         *
         * @sample maps/mapview/insetoptions-border
         *         Inset border options
         */
        borderWidth: 1,

        /**
         * The padding of the insets. Can be either a number of pixels, a
         * percentage string, or an array of either. If an array is given, it
         * sets the top, right, bottom, left paddings respectively.
         *
         * @type {number|string|Array<number|string>}
         */
        padding: '10%',

        /**
         * What coordinate system the `field` and `borderPath` should relate to.
         * If `plotBox`, they will be fixed to the plot box and responsively
         * move in relation to the main map. If `mapBoundingBox`, they will be
         * fixed to the map bounding box, which is constant and centered in
         * different chart sizes and ratios.
         *
         * @validvalue ["plotBox", "mapBoundingBox"]
         */
        relativeTo: 'mapBoundingBox',

        /**
         * The individual MapView insets, typically used for non-contiguous
         * areas of a country. Each item inherits from the generic
         * `insetOptions`.
         *
         * Some of the TopoJSON files of the [Highcharts Map
         * Collection](https://code.highcharts.com/mapdata/) include a property
         * called `hc-recommended-mapview`, and some of these include insets. In
         * order to override the recommended inset options, an inset option with
         * a matching id can be applied, and it will be merged into the embedded
         * settings.
         *
         * @sample      maps/mapview/insets-extended
         *              Extending the embedded insets
         * @sample      maps/mapview/insets-complete
         *              Complete inset config from scratch
         *
         * @extends     mapView.insetOptions
         * @type        Array<Object>
         * @product     highmaps
         * @apioption   mapView.insets
         */

        /**
         * A geometry object of type `MultiLineString` defining the border path
         * of the inset in terms of `units`. If undefined, a border is rendered
         * around the `field` geometry. It is recommended that the `borderPath`
         * partly follows the outline of the `field` in order to make pointer
         * positioning consistent.
         *
         * @sample    maps/mapview/insets-complete
         *            Complete inset config with `borderPath`
         *
         * @product   highmaps
         * @type      {Object|undefined}
         * @apioption mapView.insets.borderPath
         */

        /**
         * A geometry object of type `Polygon` defining where in the chart the
         * inset should be rendered, in terms of `units` and relative to the
         * `relativeTo` setting. If a `borderPath` is omitted, a border is
         * rendered around the field. If undefined, the inset is rendered in the
         * full plot area.
         *
         * @sample    maps/mapview/insets-extended
         *            Border path emitted, field is rendered
         *
         * @product   highmaps
         * @type      {object|undefined}
         * @apioption mapView.insets.field
         */

        /**
         * A geometry object of type `Polygon` encircling the shapes that should
         * be rendered in the inset, in terms of geographic coordinates.
         * Geometries within this geometry are removed from the default map view
         * and rendered in the inset.
         *
         * @sample    maps/mapview/insets-complete
         *            Complete inset config with `geoBounds`
         *
         * @product   highmaps
         * @type      {object}
         * @apioption mapView.insets.geoBounds
         */

        /**
         * The id of the inset, used for internal reference.
         *
         * @sample    maps/mapview/insets-extended
         *            Extending recommended insets by id
         *
         * @product   highmaps
         * @type      {string}
         * @apioption mapView.insets.id
         */

        /**
         * The projection options for the inset.
         *
         * @product   highmaps
         * @type      {Object}
         * @extends   mapView.projection
         * @apioption mapView.insets.projection
         */

        /**
         * What units to use for the `field` and `borderPath` geometries. If
         * `percent` (default), they relate to the box given in `relativeTo`. If
         * `pixels`, they are absolute values.
         *
         * @validvalue ["percent", "pixels"]
         */
        units: 'percent'

    }

};

/* *
 *
 *  Default Export
 *
 * */

export default MapViewDefaults;
