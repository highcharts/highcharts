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
 * A marker is drawn whole whenever its own coordinate is inside the plot
 * area, and not at all otherwise, as the unclipped `markerGroup` of the
 * SVG path behaves.
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
    let p      = pts[ii];
    let centre = toPixels(p);
    // Collapsing the quad to its centre leaves it with no area, which
    // drops the marker whole rather than clipping it.
    let reach  = select(0.0, u.radius + AA_PAD, inPlotArea(p));
    let corner = vec2f(
        f32(vi & 1u) * 2.0 - 1.0,
        f32(vi >> 1u) * 2.0 - 1.0
    ) * reach;

    var out : MarkerOut;
    out.pos = toClip(centre + corner);
    out.offset = corner;
    return out;
}

@fragment
fn fsMarker(in : MarkerOut) -> @location(0) vec4f {
    let alpha = u.color.a * coverage(length(in.offset) - u.radius);

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
