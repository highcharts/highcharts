/* *
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Askel Eirik Johansson
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type { LonLatArray } from '../../Maps/MapViewOptions';
import type { MapLonLatObject } from '../../Maps/GeoJSON';
import type MapLinePointOptions from '../MapLine/MapLinePointOptions';


/* *
 *
 *  Declarations
 *
 * */

export interface FlowMapPointOptions extends MapLinePointOptions {
    /**
     * A `curveFactor` with a higher value than 0 will curve the link clockwise.
     * A negative value will curve the link counter clockwise.
     * If the value is 0 the link will be straight.
     *
     * @sample {highmaps} maps/series-flowmap/ship-route/
     *         Example ship route
     */
    curveFactor?: number;

    /**
     * The fill color of an individual link.
     */
    fillColor?: ColorType;

    /**
     * The opacity of the link color fill.
     */
    fillOpacity: number;

    /**
     * ID referencing a map point holding coordinates of the link origin or
     * coordinates in terms of array of `[longitude, latitude]` or object with
     * `lon` and `lat` properties.
     *
     * @sample {highmaps} maps/series-flowmap/from-to-lon-lat
     *         Flowmap point using lon-lat coordinates
     * @sample {highmaps} maps/series-flowmap/flight-routes
     *         Highmaps basic flight routes demo
     */
    from?: (string|LonLatArray|MapLonLatObject);

    /**
     * If set to `true`, the line will grow towards its end.
     *
     * @sample {highmaps} maps/series-flowmap/ship-route/
     *         Example ship route
     */
    growTowards?: boolean;

    /**
     * Specifying a `markerEnd` here will create an arrow symbol
     * indicating the direction of flow at the destination of one individual
     * link. If one has been previously specified at the higher level option it
     * will be overridden for the current link.
     *
     * @sample {highmaps} maps/series-flowmap/ship-route/
     *         Example ship route
     */
    markerEnd?: MarkerEndOptions;

    /**
     * The opacity of an individual link.
     */
    opacity?: number;

    /**
     * ID referencing a map point holding coordinates of the link origin or
     * coordinates in terms of array of `[longitude, latitude]` or object with
     * `lon` and `lat` properties.
     *
     * @sample {highmaps} maps/series-flowmap/from-to-lon-lat
     *         Flowmap point using lon-lat coordinates
     * @sample {highmaps} maps/series-flowmap/flight-routes
     *         Highmaps basic flight routes demo
     */
    to?: (string|LonLatArray|MapLonLatObject);

    /**
     * The weight of a link determines its thickness compared to
     * other links.
     *
     * @sample {highmaps} maps/series-flowmap/ship-route/
     *         Example ship route
     */
    weight?: number;

    /**
     * Specify the `lineWidth` of the link.
     */
    lineWidth?: number;
}

export interface MarkerEndOptions {
    /**
     * Enable or disable the `markerEnd`.
     *
     * @sample {highmaps} maps/series-flowmap/marker-end
     *         Setting different markerType for markerEnd
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Height of the `markerEnd`. Can be a number in pixels or a
     * percentage based on the weight of the link.
     *
     * @default '40%'
     */
    height: number | string;

    /**
     * Change the shape of the `markerEnd`.
     * Can be `arrow` or `mushroom`.
     *
     * @default 'arrow'
     */
    markerType?: string;

    /**
     * Width of the `markerEnd`. Can be a number in pixels or a
     * percentage based on the weight of the link.
     *
     * @default '40%'
     */
    width: number | string;
}

export default FlowMapPointOptions;
