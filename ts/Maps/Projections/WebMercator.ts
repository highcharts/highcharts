/* *
 * Web Mercator projection, used for most online map tile services
 * */

import type ProjectionDefinition from '../ProjectionTypes';

'use strict';

const maxLatitude = 85.0511287798; // The latitude that defines a square
const r = 6378137;
const WebMercator: ProjectionDefinition = {

    forward: function (lonLat): [number, number] {

        if (Math.abs(lonLat[1]) > maxLatitude) {
            return [NaN, NaN];
        }

        const d = Math.PI / 180,
            sin = Math.sin(lonLat[1] * d);

        return [
            r * lonLat[0] * d,
            r * Math.log((1 + sin) / (1 - sin)) / 2
        ];
    },

    inverse: function (xy): Highcharts.LonLatArray {
        const d = 180 / Math.PI;

        return [
            (2 * Math.atan(Math.exp(xy[1] / r)) - (Math.PI / 2)) * d,
            xy[0] * d / r
        ];
    },
    maxLatitude
};

export default WebMercator;
