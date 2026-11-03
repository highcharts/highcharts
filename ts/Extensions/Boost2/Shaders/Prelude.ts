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
 * Bindings and domain mapping, prepended to the shaders. Declares no entry
 * point, so it is not a shader itself. All pipelines share one bind group
 * layout, so a series needs a single bind group.
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
};

@group(0) @binding(0) var<uniform> u : U;
@group(0) @binding(1) var<storage, read> pts : array<vec2f>;

fn toPixels(p : vec2f) -> vec2f {
    return vec2f(
        (p.x - u.domain.x) / (u.domain.y - u.domain.x),
        (p.y - u.domain.z) / (u.domain.w - u.domain.z)
    ) * u.viewport;
}

fn toClip(px : vec2f) -> vec4f {
    return vec4f(px / u.viewport * 2.0 - 1.0, 0.0, 1.0);
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default Prelude;
