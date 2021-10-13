/* *
 * Orthographic projection
 * */

'use strict';

import type ProjectionDefinition from '../ProjectionDefinition';

const deg2rad = Math.PI / 180;

const Orthographic: ProjectionDefinition = {

    forward: (lonLat): [number, number] => {

        const lonDeg = lonLat[0],
            latDeg = lonLat[1];

        if (lonDeg < -90 || lonDeg > 90) {
            return [NaN, NaN];
        }
        const lat = latDeg * deg2rad;
        return [
            Math.cos(lat) * Math.sin(lonDeg * deg2rad),
            Math.sin(lat)
        ];
    },

    inverse: (xy): [number, number] => {
        const x = xy[0],
            y = xy[1],
            z = Math.sqrt(x * x + y * y),
            c = Math.asin(z),
            cSin = Math.sin(c),
            cCos = Math.cos(c);

        return [
            Math.atan2(x * cSin, z * cCos) / deg2rad,
            Math.asin(z && y * cSin / z) / deg2rad
        ];
    }
};

export default Orthographic;
