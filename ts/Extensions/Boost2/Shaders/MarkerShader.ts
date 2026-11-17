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
 * The quad carries its offset from the center in device pixels, so the
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
    // Offset from the center of the marker, in device pixels
    @location(0)       offset : vec2f,
    // Data y of the point, which colors the marker as a whole
    @location(1)       value  : f32,
};

@vertex
fn vsMarker(
    @builtin(vertex_index)   vi : u32,
    @builtin(instance_index) ii : u32
) -> MarkerOut {
    let center = toPixels(ii);
    // The outline straddles the edge, so half of it reaches past the
    // radius. Collapsing the quad to its center leaves it with no area,
    // which drops the marker whole rather than clipping it.
    let full   = u.radius + u.stroke * 0.5 + AA_PAD;
    let reach  = select(0.0, full, inPlotArea(ii));
    let corner = vec2f(
        f32(vi & 1u) * 2.0 - 1.0,
        f32(vi >> 1u) * 2.0 - 1.0
    ) * reach;

    var out : MarkerOut;
    out.pos = toClip(center + corner);
    out.offset = corner;
    // Zone values are offsets above the lower end of the domain too.
    out.value = offsetAt(ii).y;
    return out;
}

@fragment
fn fsMarker(in : MarkerOut) -> @location(0) vec4f {
    // A marker takes one color whole, from its own value, as the zone of
    // a point does in SVG. Series.pointAttribs lets marker.fillColor and
    // marker.lineColor stand in for it.
    let zone = tint(in.value);
    let fill = select(zone, u.fillColor, (u.paint & 1u) != 0u);
    let d = length(in.offset) - u.radius;
    let w = fwidth(d);

    if (u.stroke <= 0.0) {
        let alpha = fill.a * coverageAt(d, w);

        // Target alphaMode is 'premultiplied'.
        return vec4f(fill.rgb * alpha, alpha);
    }

    let line = select(zone, u.lineColor, (u.paint & 2u) != 0u);
    let half = u.stroke * 0.5;
    // Everything within the outer side of the outline is drawn, and the
    // fill shows through within the inner one.
    let outer = coverageAt(d - half, w);
    let inner = coverageAt(d + half, w);
    let alpha = mix(line.a, fill.a, inner) * outer;

    return vec4f(mix(line.rgb, fill.rgb, inner) * alpha, alpha);
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default MarkerShader;
