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
 * Two vertex entry points over one fragment shader and uniform layout.
 *
 * `vsLine` is one vertex per point on `line-strip`, which the hardware
 * rasterizes one device pixel wide. `vsRibbon` is two vertices per point
 * on `triangle-strip`, offset along the miter normal; consecutive points
 * share their vertices, so joins need no separate geometry.
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

@vertex
fn vsLine(@builtin(vertex_index) vi : u32) -> @builtin(position) vec4f {
    return toClip(toPixels(pts[vi]));
}

@vertex
fn vsRibbon(@builtin(vertex_index) vi : u32) -> @builtin(position) vec4f {
    let last = u32(u.count) - 1u;
    let i    = vi >> 1u;
    let side = f32(vi & 1u) * 2.0 - 1.0;

    let curr = toPixels(pts[i]);
    let dIn  = curr - toPixels(pts[max(i, 1u) - 1u]);
    let dOut = toPixels(pts[min(i + 1u, last)]) - curr;

    let lIn  = length(dIn);
    let lOut = length(dOut);

    // False for a NaN length too, so a null point, the ends of the strip
    // and a zero-length segment all take the same path.
    let okIn  = lIn  > EPS;
    let okOut = lOut > EPS;

    var tangent : vec2f;
    var scale = 1.0;

    if (okIn && okOut) {
        let uIn  = dIn / lIn;
        let uOut = dOut / lOut;

        tangent = uIn + uOut;

        let lTan = length(tangent);

        if (lTan <= EPS) {
            // The path reverses onto itself; the miter is unbounded.
            return toClip(curr);
        }

        tangent = tangent / lTan;

        // The miter grows as 1 / sin(theta / 2) and is clamped rather than
        // replaced by a bevel, which a shared-vertex strip cannot express.
        scale = 1.0 / max(
            dot(vec2f(-tangent.y, tangent.x), vec2f(-uIn.y, uIn.x)),
            MITER_LIMIT
        );
    } else if (okIn) {
        tangent = dIn / lIn;
    } else if (okOut) {
        tangent = dOut / lOut;
    } else {
        return toClip(curr);
    }

    return toClip(curr + vec2f(-tangent.y, tangent.x) *
        side * u.halfWidth * scale);
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
