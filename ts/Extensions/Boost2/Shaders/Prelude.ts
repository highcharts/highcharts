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
    // Dash runs in device pixels, on and off alternating from the first.
    // Up to six carry every style the core defines; a zero count means a
    // solid stroke and leaves the arc buffer unread.
    dashA     : vec4f,
    dashB     : vec4f,
    dashCount : u32,
    dashPeriod: f32,
    // Marker paint. Each color stands in for the one the zone would
    // give, and the flags say which of them was set at all.
    fillColor : vec4f,
    lineColor : vec4f,
    // Marker outline width in device pixels, straddling the edge
    stroke    : f32,
    // 1 marker.fillColor set, 2 marker.lineColor set
    paint     : u32,
    // Marker shape, in the order Series.symbol names them: 0 circle,
    // 1 square, 2 diamond, 3 triangle, 4 triangle-down
    symbol    : u32,
    // Half extent of the quad a marker is drawn on, in device pixels.
    // A mitered corner carries the outline further out than the radius
    // and the stroke alone, so the host works this out per symbol.
    reach     : f32,
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
// Distance along the drawn path to each of its vertices, in device
// pixels, restarting at every gap. One entry when the stroke is solid.
@group(0) @binding(4) var<storage, read> arcs : array<f32>;

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

fn dashAt(k : u32) -> f32 {
    if (k < 4u) {
        return u.dashA[k];
    }
    return u.dashB[k - 4u];
}

// What the dash pattern leaves of a fragment lying s device pixels along
// the path. Runs alternate on and off from the first, and the end of a
// run fades by the same rule as the edge of a shape.
fn dashAlpha(s : f32) -> f32 {
    if (u.dashCount == 0u) {
        return 1.0;
    }

    let w = fwidth(s);
    let phase = s - u.dashPeriod * floor(s / u.dashPeriod);

    var start = 0.0;
    var alpha = 1.0;

    for (var k = 0u; k < u.dashCount; k++) {
        let len = dashAt(k);

        if (phase >= start && phase < start + len) {
            // Distance to the nearer end of the run it falls in.
            let d = min(phase - start, start + len - phase);
            alpha = select(
                coverageAt(d, w), coverageAt(-d, w), (k & 1u) == 0u
            );
        }
        start += len;
    }
    return alpha;
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
