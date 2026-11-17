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
 * Rows per block of the origin and min/max indexes, as a shift. Shared
 * with the shaders below, so the two cannot drift apart.
 * @internal
 */
const BLOCK_SHIFT = 10;

/** @internal */
const BLOCK = 1 << BLOCK_SHIFT;

/**
 * Bindings, domain mapping and the antialiasing rule, prepended to the
 * shaders. Declares no entry point, so it is not a shader itself.
 *
 * Coordinates are held as an offset from the origin of their block, and
 * each origin as its distance from the lower end of the domain. That
 * distance is worked out in double precision on the way in, so the
 * shader only ever adds two small numbers and never has to cancel two
 * large ones, which a compiler is free to reassociate away.
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

const BLOCK_SHIFT = ${BLOCK_SHIFT}u;

struct U {
    // Device pixels of the domain minimum, and device pixels per domain
    // unit. A scale is negative where its axis runs the other way.
    origin    : vec2f,
    scale     : vec2f,
    // Width and height of the domain
    span      : vec2f,
    // Canvas size in device pixels
    viewport  : vec2f,
    // Half the stroke width, in device pixels
    halfWidth : f32,
    // Marker radius, in device pixels
    radius    : f32,
    // On an ordinal axis, x comes from the row index through these two:
    // slope * index + offset. A zero slope means a plain axis.
    ordSlope  : f32,
    ordOffset : f32,
    // Counts and modes last, so that the two views the host writes
    // through cover one run of the buffer each.
    // Point count; the buffer may be larger than the current series
    count     : u32,
    // Number of entries in the zone buffer, never below one
    zoneCount : u32,
    // Step mode, encoded as Series.getGraphPath encodes it: 0 none,
    // 1 right, 2 center, 3 left
    step      : u32,
    // Set where the surface hangs in a group the core leaves upright on
    // an inverted chart, so the domain axes meet the opposite screen
    // ones. The line group is rotated instead and never sets this.
    swap      : u32,
};

// A band of the y domain, up to its value. The last one has no bound and
// carries the color of the series, so an unzoned series is just that one
// entry and needs no case of its own.
struct Zone {
    color : vec4f,
    value : f32,
};

@group(0) @binding(0) var<uniform> u : U;
@group(0) @binding(1) var<storage, read> pts : array<vec2f>;
@group(0) @binding(2) var<storage, read> zones : array<Zone>;
// Origin of each block, as its distance from the lower end of the domain
@group(0) @binding(3) var<storage, read> origins : array<vec2f>;

// Where a point sits above the lower end of the domain, in domain units.
fn offsetAt(i : u32) -> vec2f {
    let d = origins[i >> BLOCK_SHIFT] + pts[i];

    if (u.ordSlope != 0.0) {
        return vec2f(u.ordSlope * f32(i) + u.ordOffset, d.y);
    }
    return d;
}

fn toPixelsAt(d : vec2f) -> vec2f {
    return u.origin + select(d, d.yx, u.swap != 0u) * u.scale;
}

fn toPixels(i : u32) -> vec2f {
    return toPixelsAt(offsetAt(i));
}

// A point is in the plot area when its own coordinate is, regardless of
// how far the shape drawn at it reaches.
fn inPlotArea(i : u32) -> bool {
    let d = offsetAt(i);

    return d.x >= 0.0 && d.x <= u.span.x && d.y >= 0.0 && d.y <= u.span.y;
}

fn toClip(px : vec2f) -> vec4f {
    return vec4f(px / u.viewport * 2.0 - 1.0, 0.0, 1.0);
}

// The first zone the value falls below, as Point.getZone decides.
fn tint(value : f32) -> vec4f {
    let last = u.zoneCount - 1u;

    for (var i = 0u; i < last; i++) {
        if (value < zones[i].value) {
            return zones[i].color;
        }
    }
    return zones[last].color;
}

// How far a fragment sits above the lower end of the domain, which is
// what zone values are expressed in. Fragment rows run down from the
// top, the rows toPixelsAt returns run up from the bottom.
fn fragValue(pos : vec4f) -> f32 {
    return (u.viewport.y - pos.y - u.origin.y) / u.scale.y;
}

// Device pixels a shape is grown by, to leave room for its own fringe.
const AA_PAD = 1.0;

// Coverage from a signed distance in device pixels, negative inside.
// The second argument is the change of the distance across one pixel,
// so the ratio is the fraction of the pixel that falls inside the shape.
fn coverageAt(d : f32, w : f32) -> f32 {
    return clamp(0.5 - d / w, 0.0, 1.0);
}

// The same rule where the distance carries its own gradient. A distance
// folded by abs() does not: across the two pixels either side of the
// centre it reads the same, which leaves no gradient to measure, so
// fold after taking it. Fragment stage only.
fn coverage(d : f32) -> f32 {
    return coverageAt(d, fwidth(d));
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export { BLOCK, BLOCK_SHIFT };

/** @internal */
export default Prelude;
