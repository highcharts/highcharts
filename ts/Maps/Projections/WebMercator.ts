/* *
 *
 *  Web Mercator projection, used for most online map tile services
 *
 *  (c) 2021-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Torstein Honsi
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    LonLatArray,
    MapBounds,
    ProjectedXYArray
} from '../MapViewOptions';
import type ProjectionDefinition from '../ProjectionDefinition';

/* *
 *
 *  Constants
 *
 * */

const r = 63.78137,
    deg2rad = Math.PI / 180;

/* *
 *
 *  Class
 *
 * */

/**
 * Web Mercator is a variant of the Mercator map projection and is the de facto
 * standard for Web mapping applications.
 *
 * Web Mercator is primarily created for tiled map services, as when zooming in
 * to smaller scales, the angle between lines on the surface is approximately
 * retained.
 *
 * The great disadvantage of Web Mercator is that areas inflate with distance
 * from the equator. For example, in the world map, Greenland appears roughly
 * the same size as Africa. In reality Africa is 14 times larger, as is apparent
 * from the Equal Earth or Orthographic projections.
 *
 * @class
 * @name Highcharts.WebMercator
 */
class WebMercator implements ProjectionDefinition {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public bounds: MapBounds = {
        x1: -200.37508342789243,
        x2: 200.37508342789243,
        y1: -200.3750834278071,
        y2: 200.3750834278071
    };

    /**
     * The latitude that defines a square.
     * @internal
     */
    public maxLatitude = 85.0511287798;

    /* *
     *
     *  Functions
     *
     * */

    public forward(
        lonLat: LonLatArray
    ): ProjectedXYArray {
        const sinLat = Math.sin(lonLat[1] * deg2rad),
            xy: ProjectedXYArray = [
                r * lonLat[0] * deg2rad,
                r * Math.log((1 + sinLat) / (1 - sinLat)) / 2
            ];

        if (Math.abs(lonLat[1]) > this.maxLatitude) {
            xy.outside = true;
        }

        return xy;
    }

    public inverse(
        xy: ProjectedXYArray
    ): LonLatArray {
        return [
            xy[0] / (r * deg2rad),
            (2 * Math.atan(Math.exp(xy[1] / r)) - (Math.PI / 2)) / deg2rad
        ];
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default WebMercator;
