/* *
 * Web Mercator projection, used for most online map tile services
 * */

import type { LonLatArray } from '../MapViewOptions';
import type ProjectionDefinition from '../ProjectionTypes';

'use strict';

const maxLatitude = 85.0511287798; // The latitude that defines a square
const r = 6378137;
const deg2rad = Math.PI / 180;
const WebMercator: ProjectionDefinition = {

    forward: (lonLat): [number, number] => {

        if (Math.abs(lonLat[1]) > maxLatitude) {
            return [NaN, NaN];
        }

        const sinLat = Math.sin(lonLat[1] * deg2rad);

        return [
            r * lonLat[0] * deg2rad,
            r * Math.log((1 + sinLat) / (1 - sinLat)) / 2
        ];
    },

    inverse: (xy): LonLatArray => [
        xy[0] / (r * deg2rad),
        (2 * Math.atan(Math.exp(xy[1] / r)) - (Math.PI / 2)) / deg2rad
    ],

    maxLatitude
};

export default WebMercator;
