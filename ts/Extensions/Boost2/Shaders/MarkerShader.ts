/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: shader for the `marker` pipeline.
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
 * One instanced quad per point, four vertices on `triangle-strip`.
 * Instancing keeps the quads apart; a single strip would join them.
 *
 * The quad carries its offset from the centre in device pixels, so the
 * fragment shader covers boundary pixels by their distance to the circle
 * edge. It reaches one pixel past the radius, so that fringe is not cut.
 *
 * @internal
 */
const MarkerShader: string = Prelude + `

struct MarkerOut {
    @builtin(position) pos    : vec4f,
    // Offset from the centre of the marker, in device pixels
    @location(0)       offset : vec2f,
};

@vertex
fn vsMarker(
    @builtin(vertex_index)   vi : u32,
    @builtin(instance_index) ii : u32
) -> MarkerOut {
    let reach  = u.radius + 1.0;
    let corner = vec2f(
        f32(vi & 1u) * 2.0 - 1.0,
        f32(vi >> 1u) * 2.0 - 1.0
    ) * reach;

    var out : MarkerOut;
    out.pos = toClip(toPixels(pts[ii]) + corner);
    out.offset = corner;
    return out;
}

@fragment
fn fsMarker(in : MarkerOut) -> @location(0) vec4f {
    let d = length(in.offset) - u.radius;

    // fwidth is the change of d across one pixel, so the ratio is the
    // fraction of the pixel that falls inside the circle.
    let alpha = u.color.a * clamp(0.5 - d / fwidth(d), 0.0, 1.0);

    // Target alphaMode is 'premultiplied'.
    return vec4f(u.color.rgb * alpha, alpha);
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default MarkerShader;
