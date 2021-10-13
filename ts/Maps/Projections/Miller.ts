/* *
 * Miller projection
 * */

'use strict';

import type ProjectionDefinition from '../ProjectionDefinition';

const quarterPI = Math.PI / 4;
const deg2rad = Math.PI / 180;

const Miller: ProjectionDefinition = {

    forward: (lonLat): [number, number] => [
        lonLat[0] * deg2rad,
        1.25 * Math.log(Math.tan(quarterPI + 0.4 * lonLat[1] * deg2rad))
    ],

    inverse: (xy): [number, number] => [
        xy[0] / deg2rad,
        2.5 * (Math.atan(Math.exp(0.8 * xy[1])) - quarterPI) / deg2rad
    ]
};

export default Miller;
