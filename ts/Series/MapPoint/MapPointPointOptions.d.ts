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

import type { GeoJSONGeometryPoint } from '../../Maps/GeoJSON';
import type { LonLatArray } from '../../Maps/MapViewOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * The geometry of a point.
 *
 * To achieve a better separation between the structure and the data,
 * it is recommended to use `mapData` to define the geometry instead
 * of defining it on the data points themselves.
 *
 * The geometry object is compatible to that of a `feature` in geoJSON, so
 * features of geoJSON can be passed directly into the `data`, optionally
 * after first filtering and processing it.
 *
 * @sample maps/series/mappoint-line-geometry/
 *         Map point and line geometry
 *
 * @since 9.3.0
 *
 * @product highmaps
 *
 * @optionparent series.mappoint.data.geometry
 */
export interface MapPointPointGeometryOptions extends GeoJSONGeometryPoint {

    /**
     * The geometry coordinates in terms of `[longitude, latitude]`.
     *
     * @since 9.3.0
     *
     * @product highmaps
     */
    coordinates: LonLatArray;

    /**
     * The geometry type, which in case of the `mappoint` series is always `Point`.
     *
     * @since 9.3.0
     *
     * @product highmaps
     */
    type: 'Point';

}

export interface MapPointPointOptions extends ScatterPointOptions {

    geometry?: MapPointPointGeometryOptions;

    /**
     * The latitude of the point. Must be combined with the `lon` option
     * to work. Overrides `x` and `y` values.
     *
     * @sample {highmaps} maps/demo/mappoint-latlon/
     *         Point position by lat/lon
     *
     * @product highmaps
     *
     * @since 1.1.0
     */
    lat?: number;

    /**
     * The longitude of the point. Must be combined with the `lon` option
     * to work. Overrides `x` and `y` values.
     *
     * @sample {highmaps} maps/demo/mappoint-latlon/
     *         Point position by lat/lon
     *
     * @product highmaps
     *
     * @since 1.1.0
     */
    lon?: number;

    /**
     * The x coordinate of the point in terms of projected units.
     *
     * @sample {highmaps} maps/series/mapline-mappoint-path-xy/
     *         Map point demo
     *
     * @product highmaps
     */
    x?: number;

    /**
     * The x coordinate of the point in terms of projected units.
     *
     * @sample {highmaps} maps/series/mapline-mappoint-path-xy/
     *         Map point demo
     *
     * @product highmaps
     */
    y?: (number|null);

}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointPointOptions;
