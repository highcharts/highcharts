/* *
 *
 * Equal Earth projection, an equal-area projection designed to minimize
 * distortion and remain pleasing to the eye.
 *
 * Invented by Bojan Šavrič, Bernhard Jenny, and Tom Patterson in 2018. It is
 * inspired by the widely used Robinson projection.
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

const A1 = 1.340264,
    A2 = -0.081106,
    A3 = 0.000893,
    A4 = 0.003796,
    M = Math.sqrt(3) / 2.0,
    scale = 74.03120656864502;

/* *
 *
 *  Class
 *
 * */

class EqualEarth implements ProjectionDefinition {

    /* *
     *
     *  Properties
     *
     * */

    public bounds: MapBounds = {
        x1: -200.37508342789243,
        x2: 200.37508342789243,
        y1: -97.52595454902263,
        y2: 97.52595454902263
    };

    /* *
     *
     *  Functions
     *
     * */

    public forward(
        lonLat: LonLatArray
    ): ProjectedXYArray {
        const d = Math.PI / 180,
            paramLat = Math.asin(M * Math.sin(lonLat[1] * d)),
            paramLatSq = paramLat * paramLat,
            paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;

        const x = lonLat[0] * d * Math.cos(paramLat) * scale /
            (M * (
                A1 +
                3 * A2 * paramLatSq +
                paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq)
            )),

            y = paramLat * scale * (
                A1 + A2 * paramLatSq + paramLatPow6 * (A3 + A4 * paramLatSq)
            );

        return [x, y];
    }

    public inverse(
        xy: ProjectedXYArray
    ): LonLatArray {
        const x = xy[0] / scale,
            y = xy[1] / scale,
            d = 180 / Math.PI,
            epsilon = 1e-9;

        let paramLat = y,
            paramLatSq: number,
            paramLatPow6: number,
            fy: number,
            fpy: number,
            dlat: number;

        for (let i = 0; i < 12; ++i) {
            paramLatSq = paramLat * paramLat;
            paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
            fy = paramLat * (
                A1 + A2 * paramLatSq + paramLatPow6 * (A3 + A4 * paramLatSq)
            ) - y;
            fpy = A1 + 3 * A2 * paramLatSq + paramLatPow6 * (
                7 * A3 + 9 * A4 * paramLatSq
            );
            paramLat -= dlat = fy / fpy;

            if (Math.abs(dlat) < epsilon) {
                break;
            }
        }

        paramLatSq = paramLat * paramLat;
        paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;

        const lon = d * M * x * (
                A1 + 3 * A2 * paramLatSq + paramLatPow6 *
                (7 * A3 + 9 * A4 * paramLatSq)
            ) / Math.cos(paramLat),

            lat = d * Math.asin(Math.sin(paramLat) / M);

        // If lons are beyond the border of a map -> resolve via break
        if (Math.abs(lon) > 180) {
            return [NaN, NaN];
        }

        return [lon, lat];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default EqualEarth;
