/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: WGSL prepended to every shader.
 *
 *  License: highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Shader Code
 *
 * */

/**
 * Bindings, domain mapping and the antialiasing rule, prepended to the
 * shaders. Declares no entry point, so it is not a shader itself.
 *
 * Each shape measures its own signed distance, which is intrinsic to it,
 * and turns it into coverage through the one rule here.
 *
 * All pipelines share one bind group layout, so a series needs a single
 * bind group.
 *
 * @internal
 */
const Prelude: string = `

struct U {
    // xMin, xMax, yMin, yMax, in the origin-shifted domain
    domain    : vec4f,
    color     : vec4f,
    // Canvas size in device pixels
    viewport  : vec2f,
    // Half the stroke width, in device pixels
    halfWidth : f32,
    // Point count; the buffer may be larger than the current series
    count     : f32,
    // Marker radius, in device pixels
    radius    : f32,
    // Margin between the canvas edge and the plot box, in device pixels
    pad       : f32,
};

@group(0) @binding(0) var<uniform> u : U;
@group(0) @binding(1) var<storage, read> pts : array<vec2f>;

// The canvas may be larger than the plot box, so that a marker at the
// edge is not cut off; the domain maps to the inset box.
fn toPixels(p : vec2f) -> vec2f {
    return u.pad + vec2f(
        (p.x - u.domain.x) / (u.domain.y - u.domain.x),
        (p.y - u.domain.z) / (u.domain.w - u.domain.z)
    ) * (u.viewport - 2.0 * u.pad);
}

// A point is in the plot area when its own coordinate is, regardless of
// how far the shape drawn at it reaches.
fn inPlotArea(p : vec2f) -> bool {
    return p.x >= u.domain.x && p.x <= u.domain.y &&
        p.y >= u.domain.z && p.y <= u.domain.w;
}

fn toClip(px : vec2f) -> vec4f {
    return vec4f(px / u.viewport * 2.0 - 1.0, 0.0, 1.0);
}

// Device pixels a shape is grown by, to leave room for its own fringe.
const AA_PAD = 1.0;

// Coverage from a signed distance in device pixels, negative inside.
// fwidth is the change of d across one pixel, so the ratio is the
// fraction of the pixel that falls inside the shape. Fragment stage only.
fn coverage(d : f32) -> f32 {
    return clamp(0.5 - d / fwidth(d), 0.0, 1.0);
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default Prelude;
