/* *
 * Web Mercator projection, used for most online map tile services
 * */

'use strict';

import type { LonLatArray, ProjectedXYArray } from '../MapViewOptions';
import type ProjectionDefinition from '../ProjectionDefinition';

const maxLatitude = 85.0511287798, // The latitude that defines a square
    r = 63.78137,
    deg2rad = Math.PI / 180;

class WebMercator implements ProjectionDefinition {

    bounds = {
        x1: -200.37508342789243,
        x2: 200.37508342789243,
        y1: -200.3750834278071,
        y2: 200.3750834278071
    };

    forward(lonLat: LonLatArray): ProjectedXYArray {

        const sinLat = Math.sin(lonLat[1] * deg2rad);

        const xy: ProjectedXYArray = [
            r * lonLat[0] * deg2rad,
            r * Math.log((1 + sinLat) / (1 - sinLat)) / 2
        ];

        if (Math.abs(lonLat[1]) > maxLatitude) {
            xy.outside = true;
        }

        return xy;
    }

    inverse(xy: ProjectedXYArray): LonLatArray {
        return [
            xy[0] / (r * deg2rad),
            (2 * Math.atan(Math.exp(xy[1] / r)) - (Math.PI / 2)) / deg2rad
        ];
    }

    maxLatitude = maxLatitude;
}

export default WebMercator;
