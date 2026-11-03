/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: shader for the `line` pipeline.
 *
 *  License: highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Prelude from './Prelude.js';

/* *
 *
 *  Shader Code
 *
 * */

/**
 * `vsHairline` is one vertex per point on `line-strip`, which the hardware
 * rasterizes one device pixel wide, ignoring `lineWidth` and joins.
 *
 * `vsLine` is four vertices per point on `triangle-strip`: a pair for the
 * segment arriving at the point and a pair for the one leaving it.
 * Each segment therefore carries the normal of its own direction and keeps
 * its exact width, while the two triangles between the pairs form the
 * join. Collapsing the pairs onto the miter point empties those triangles
 * and leaves a miter; keeping them apart fills them as a bevel.
 *
 * The offset is taken in device pixels: the domain mapping is anisotropic,
 * so a normal from data space would vary the width with the slope.
 * Neighbours come from the same storage buffer, so no extra vertex data.
 *
 * @internal
 */
const LineShader: string = Prelude + `

// Below this length, in device pixels, a segment carries no direction.
const EPS = 1e-6;

// Reciprocal of the SVG default stroke-miterlimit of 4.
const MITER_LIMIT = 0.25;

// One vertex per point, for line-strip topology.
@vertex
fn vsHairline(@builtin(vertex_index) vi : u32) -> @builtin(position) vec4f {
    return toClip(toPixels(pts[vi]));
}

@vertex
fn vsLine(@builtin(vertex_index) vi : u32) -> @builtin(position) vec4f {
    let last = u32(u.count) - 1u;
    let i    = vi >> 2u;
    let k    = vi & 3u;
    let side = select(1.0, -1.0, (k & 1u) == 1u);

    let curr = toPixels(pts[i]);
    let dIn  = curr - toPixels(pts[max(i, 1u) - 1u]);
    let dOut = toPixels(pts[min(i + 1u, last)]) - curr;

    let lIn  = length(dIn);
    let lOut = length(dOut);

    // False for a NaN length too, so a null point, the ends of the strip
    // and a zero-length segment all take the same path.
    let okIn  = lIn  > EPS;
    let okOut = lOut > EPS;

    var dir : vec2f;

    if (okIn && okOut) {
        let uIn  = dIn / lIn;
        let uOut = dOut / lOut;
        let tangent = uIn + uOut;
        let lTan = length(tangent);

        if (lTan > EPS) {
            let m = tangent / lTan;
            let n = vec2f(-m.y, m.x);
            // Grows as 1 / sin(theta / 2) towards a reversal.
            let sinHalf = dot(n, vec2f(-uIn.y, uIn.x));

            if (sinHalf >= MITER_LIMIT) {
                // Both halves meet at the miter point, which leaves the
                // two join triangles with no area.
                return toClip(curr + n * side * u.halfWidth / sinHalf);
            }
        }

        // Past the limit each half keeps the normal of its own segment,
        // and the join triangles span the gap between them as a bevel.
        dir = select(uIn, uOut, k >= 2u);
    } else if (okIn) {
        dir = dIn / lIn;
    } else if (okOut) {
        dir = dOut / lOut;
    } else {
        return toClip(curr);
    }

    return toClip(curr + vec2f(-dir.y, dir.x) * side * u.halfWidth);
}

@fragment
fn fs() -> @location(0) vec4f {
    // Target alphaMode is 'premultiplied'.
    return vec4f(u.color.rgb * u.color.a, u.color.a);
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default LineShader;
