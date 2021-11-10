/* *
 * Miller projection
 * */

'use strict';
import type { LonLatArray } from '../MapViewOptions';
import type ProjectionDefinition from '../ProjectionDefinition';

const quarterPI = Math.PI / 4,
    deg2rad = Math.PI / 180,
    scale = 63.78137;

export default class Miller implements ProjectionDefinition {

    forward(lonLat: LonLatArray): [number, number] {
        return [
            lonLat[0] * deg2rad * scale,
            1.25 * scale * Math.log(
                Math.tan(quarterPI + 0.4 * lonLat[1] * deg2rad)
            )
        ];
    }

    inverse(xy: [number, number]): LonLatArray {
        return [
            (xy[0] / scale) / deg2rad,
            2.5 * (Math.atan(
                Math.exp(0.8 * (xy[1] / scale))) - quarterPI
            ) / deg2rad
        ];
    }
}
