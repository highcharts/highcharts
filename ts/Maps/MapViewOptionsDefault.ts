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

import type MapViewOptions from './MapViewOptions';
import D from '../Core/DefaultOptions.js';

/**
 * The `mapView` options control the initial view of the chart, and how
 * projection is set up for raw geoJSON maps (beta as of v9.3).
 *
 * To set the view dynamically after chart generation, see
 * [mapView.setView](/class-reference/Highcharts.MapView#setView).
 *
 * @since 9.3.0
 * @product      highmaps
 * @optionparent mapView
 */
const defaultOptions: MapViewOptions = {
    /**
     * The center of the map in terms of longitude and latitude. For
     * preprojected maps (like the GeoJSON files in Map Collection v1.x), the
     * units are projected x and y units.
     *
     * @default [0, 0]
     * @type   {Highcharts.LonLatArray}
     *
     * @sample {highmaps} maps/mapview/center-zoom Custom view of a world map
     * @sample {highmaps} maps/mapview/get-view Report the current view of a
     *         preprojected map
     */
    center: [0, 0],

    /**
     * Prevents the end user from zooming too far in on the map. See
     * [zoom](#mapView.zoom).
     *
     * @type   {number|undefined}
     *
     * @sample {highmaps} maps/mapview/maxzoom
     *         Prevent zooming in too far
     */
    maxZoom: void 0,

    /**
     * The padding inside the plot area when auto fitting to the map bounds. A
     * number signifies pixels, and a percentage is relative to the plot area
     * size.
     *
     * @sample {highmaps} maps/chart/plotbackgroundcolor-color
     *         Visible plot area and percentage padding
     * @type  {number|string|Array<number|string>}
     */
    padding: 0,

    /**
     * The projection options allow applying client side projection to a map
     * given in coordinates, typically from TopoJSON or GeoJSON.
     *
     * Sub-options are:
     * * `name`, which as of v9.3 can be `EqualEarth`, `LambertConformalConic`,
     *   `Miller`, `Orthographic` or `WebMercator`.
     * * `parallels`, the standard parallels for the LambertConformalConic
     *   projection.
     * * `rotation`, a three-axis rotation of the globe prior to projection,
     *   which in practice can be used for example to render a world map with
     *   the Americas centered (`[90, 0]`), or to rotate an orthographic
     *   projection.
     *
     * @type   {Object}
     * @sample {highmaps} maps/demo/topojson-projection Orthographic projection
     */
    projection: {

        /**
         * Projection name. Built-in projections are `EqualEarth`,
         * `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
         *
         * @type   {string}
         * @sample maps/demo/topojson-projection
         *         Orthographic projection
         */
        name: void 0,

        /**
         * The to standard parallels that define the map layout in conic
         * projections, like the LambertConformalConic projection. If only one
         * number is given, the second parallel will be the same as the first.
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
         * * `gamma` applies a _roll_.
         *
         * @sample maps/mapview/projection-america-centric
         *         America-centric world map
         */
        rotation: void 0
    },

    /**
     * The zoom level of a map. Higher zoom levels means more zoomed in. An
     * increase of 1 zooms in to a quarter of the viewed area (half the width
     * and height). Defaults to fitting to the map bounds.
     *
     * In a `WebMercator` projection, a zoom level of 0 represents
     * the world in a 256x256 pixel square. This is a common concept for WMS
     * tiling software.
     *
     * @type   {number|undefined}
     * @sample {highmaps} maps/mapview/center-zoom
     *         Custom view of a world map
     * @sample {highmaps} maps/mapview/get-view
     *         Report the current view of a preprojected map
     */
    zoom: void 0
};

/* *
 *
 *  Default Export
 *
 * */

export default defaultOptions;
