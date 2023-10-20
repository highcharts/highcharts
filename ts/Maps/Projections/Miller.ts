/* *
 * Miller projection
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

class Miller implements ProjectionDefinition {

    /* *
     *
     *  Properties
     *
     * */

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
                Math.exp(0.8 * (xy[1] / scale))) - quarterPI
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
