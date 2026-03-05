/* *
 *
 *  Miller projection
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

const quarterPI = Math.PI / 4,
    deg2rad = Math.PI / 180,
    scale = 63.78137;

/* *
 *
 *  Class
 *
 * */

/**
 * The Miller cylindrical projection is a modified Mercator projection, proposed
 * by Osborn Maitland Miller in 1942. Compared to Mercator, the vertical
 * exaggeration of polar areas is smaller, so the relative size of areas is
 * more correct.
 *
 * Highcharts used this as the default map projection for world maps until the
 * Map Collection v2.0 and Highcharts v10.0, when projection math was moved to
 * the client side and EqualEarth chosen as the default world map projection.
 *
 * @class
 * @name Highcharts.Miller
 */
class Miller implements ProjectionDefinition {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public bounds: MapBounds = {
        x1: -200.37508342789243,
        x2: 200.37508342789243,
        y1: -146.91480769173063,
        y2: 146.91480769173063
    };

    /* *
     *
     *  Functions
     *
     * */

    public forward(
        lonLat: LonLatArray
    ): ProjectedXYArray {
        return [
            lonLat[0] * deg2rad * scale,
            1.25 * scale * Math.log(
                Math.tan(quarterPI + 0.4 * lonLat[1] * deg2rad)
            )
        ];
    }

    public inverse(
        xy: ProjectedXYArray
    ): LonLatArray {
        return [
            (xy[0] / scale) / deg2rad,
            2.5 * (Math.atan(
                Math.exp(0.8 * (xy[1] / scale))
            ) - quarterPI
            ) / deg2rad
        ];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Miller;
