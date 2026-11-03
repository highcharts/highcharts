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
 *  Shader Code
 *
 * */

/**
 * One vertex per point, `line-strip` topology.
 *
 * WebGPU has no line width, so the stroke is one pixel and `lineWidth` has
 * no effect. Wider strokes require per-segment quads.
 *
 * @internal
 */
const LineShader: string = `

struct U {
    // xMin, xMax, yMin, yMax, in the origin-shifted domain
    domain : vec4f,
    color  : vec4f,
};

@group(0) @binding(0) var<uniform> u : U;
@group(0) @binding(1) var<storage, read> pts : array<vec2f>;

@vertex
fn vs(@builtin(vertex_index) vi : u32) -> @builtin(position) vec4f {
    let p = pts[vi];

    return vec4f(
        (p.x - u.domain.x) / (u.domain.y - u.domain.x) * 2.0 - 1.0,
        (p.y - u.domain.z) / (u.domain.w - u.domain.z) * 2.0 - 1.0,
        0.0,
        1.0
    );
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
