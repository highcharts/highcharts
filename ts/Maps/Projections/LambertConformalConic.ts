/* *
 *
 *  Lambert Conformal Conic projection
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
import type ProjectionOptions from '../ProjectionOptions';

/* *
 *
 *  Constants
 *
 * */

const sign = Math.sign ||
        ((n: number): number => (n === 0 ? 0 : n > 0 ? 1 : -1)),
    scale = 63.78137,
    deg2rad = Math.PI / 180,
    halfPI = Math.PI / 2,
    eps10 = 1e-6,
    tany = (y: number): number => Math.tan((halfPI + y) / 2);

/* *
 *
 *  Class
 *
 * */

/**
 * The Lambert conformal conic projection (LCC) is a conic map projection used
 * for many national and regional mapping systems.
 *
 * Its advantage lies in mapping smaller areas like countries or continents.
 * Two standard parallels are given, and between these, the distortion is
 * minimal.
 *
 * In Highcharts, LCC is the default projection when loading a map smaller than
 * 180 degrees width and 90 degrees height.
 *
 * For custom use, `rotation` should be set to adjust the reference longitude,
 * in addition to the `parallels` option.
 *
 * @class
 * @name Highcharts.LambertConformalConic
 *
 * @param {Highcharts.MapViewProjectionOptions} options
 * The projection options, with support for `parallels`.
 */
class LambertConformalConic implements ProjectionDefinition {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: ProjectionOptions
    ) {
        const parallels = (options.parallels || [])
                .map((n): number => n * deg2rad),
            lat1 = parallels[0] || 0,
            lat2 = parallels[1] ?? lat1,
            cosLat1 = Math.cos(lat1);

        if (typeof options.projectedBounds === 'object') {
            this.projectedBounds = options.projectedBounds;
        }

        // Apply the global variables
        let n = lat1 === lat2 ?
            Math.sin(lat1) :
            Math.log(
                cosLat1 / Math.cos(lat2)
            ) / Math.log(
                tany(lat2) / tany(lat1)
            );

        if (Math.abs(n) < 1e-10) {
            n = (sign(n) || 1) * 1e-10;
        }

        this.n = n;
        this.c = cosLat1 * Math.pow(tany(lat1), n) / n;
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    private c: number;

    /** @internal */
    private n: number;

    /** @internal */
    private projectedBounds: (MapBounds|undefined);

    /* *
     *
     *  Functions
     *
     * */

    public forward(
        lonLat: LonLatArray
    ): ProjectedXYArray {
        const { c, n, projectedBounds } = this,
            lon = lonLat[0] * deg2rad;

        let lat = lonLat[1] * deg2rad;

        if (c > 0) {
            if (lat < -halfPI + eps10) {
                lat = -halfPI + eps10;
            }
        } else {
            if (lat > halfPI - eps10) {
                lat = halfPI - eps10;
            }
        }
        const r = c / Math.pow(tany(lat), n),
            x = r * Math.sin(n * lon) * scale,
            y = (c - r * Math.cos(n * lon)) * scale,
            xy: ProjectedXYArray = [x, y];

        if (
            projectedBounds && (
                x < projectedBounds.x1 ||
                x > projectedBounds.x2 ||
                y < projectedBounds.y1 ||
                y > projectedBounds.y2
            )
        ) {
            xy.outside = true;
        }

        return xy;
    }

    public inverse(
        xy: ProjectedXYArray
    ): LonLatArray {
        const { c, n } = this,
            x = xy[0] / scale,
            y = xy[1] / scale,
            cy = c - y,
            rho = sign(n) * Math.sqrt(x * x + cy * cy);

        let l = Math.atan2(x, Math.abs(cy)) * sign(cy);

        if (cy * n < 0) {
            l -= Math.PI * sign(x) * sign(cy);
        }

        return [
            (l / n) / deg2rad,
            (2 * Math.atan(Math.pow(c / rho, 1 / n)) - halfPI) / deg2rad
        ];
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default LambertConformalConic;
