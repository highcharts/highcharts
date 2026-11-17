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
    // Collapsing the quad to its center leaves it with no area, which
    // drops the marker whole rather than clipping it.
    let reach  = select(0.0, u.reach, inPlotArea(ii));
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

// Distance to the edge of the marker, negative inside, in device
// pixels. Every symbol is inscribed in the same box of half extent
// u.radius, as Series.markerAttribs sizes them.
//
// The polygons measure to the nearest edge line rather than to the
// nearest point of the outline. Offsetting that by half a stroke keeps
// the corners sharp, which is the miter join SVG draws; a true distance
// would round them. Every built-in symbol stays inside the SVG miter
// limit of 4, the sharpest being the triangle apex at 2.24.
fn shapeDistance(p : vec2f) -> f32 {
    let q = abs(p);
    let r = u.radius;

    if (u.symbol == 1u) {
        return max(q.x, q.y) - r;
    }
    if (u.symbol == 2u) {
        return (q.x + q.y - r) * 0.70710678;
    }
    // Rows here run up from the bottom, the other way from the symbol
    // paths of the core, so the apex of a triangle sits at plus radius.
    if (u.symbol == 3u) {
        return max(-p.y - r, (2.0 * q.x + p.y - r) * 0.44721360);
    }
    if (u.symbol == 4u) {
        return max(p.y - r, (2.0 * q.x - p.y - r) * 0.44721360);
    }
    return length(p) - r;
}

@fragment
fn fsMarker(in : MarkerOut) -> @location(0) vec4f {
    // A marker takes one color whole, from its own value, as the zone of
    // a point does in SVG. Series.pointAttribs lets marker.fillColor and
    // marker.lineColor stand in for it.
    let zone = tint(in.value);
    let fill = select(zone, u.fillColor, (u.paint & 1u) != 0u);
    let d = shapeDistance(in.offset);
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
