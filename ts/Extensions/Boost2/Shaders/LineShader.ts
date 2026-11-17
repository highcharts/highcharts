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
 * `vsHairline` is one vertex per point on `line-strip`, which the hardware
 * rasterizes one device pixel wide, ignoring `lineWidth` and joins.
 *
 * `vsLine` is four vertices per point on `triangle-strip`: a pair for the
 * segment arriving at the point and a pair for the one leaving it.
 * Each segment therefore carries the normal of its own direction and keeps
 * its exact width, while the two triangles between the pairs form the
 * join. Collapsing the pairs onto the miter point empties those triangles
 * and leaves a miter; keeping them apart fills them as a bevel.
 *
 * The offset is taken in device pixels: the domain mapping is anisotropic,
 * so a normal from data space would vary the width with the slope.
 * Neighbors come from the same storage buffer, so no extra vertex data.
 *
 * @internal
 */
const LineShader: string = Prelude + `

// Below this length, in device pixels, a segment carries no direction.
const EPS = 1e-6;

// Reciprocal of the SVG default stroke-miterlimit of 4.
const MITER_LIMIT = 0.25;

struct LineOut {
    @builtin(position) pos : vec4f,
    // Signed distance from the centerline, in device pixels
    @location(0)       off : f32,
    // Where the segment this fragment belongs to starts, and how far
    // along the path that is. The fragment measures its own distance
    // from them rather than taking an interpolated one, which keeps
    // every term small: a cumulative length reaches millions of pixels
    // on a long series, where f32 can no longer separate two dashes.
    @location(1) @interpolate(flat) arcFrom : f32,
    @location(2) @interpolate(flat) segFrom : vec2f,
    @location(3) @interpolate(flat) segDir  : vec2f,
};

// How far along the path a fragment lies, in device pixels.
fn pathDistance(in : LineOut) -> f32 {
    // Fragment rows run down from the top, pixel rows up from the
    // bottom.
    let p = vec2f(in.pos.x, u.viewport.y - in.pos.y);

    return in.arcFrom + dot(p - in.segFrom, in.segDir);
}

// Horizontal and vertical reach of the step between k and k + 1, in
// device pixels.
fn stepLegs(k : u32) -> vec2f {
    let a = offsetAt(k);
    let b = offsetAt(min(k + 1u, u.count - 1u));

    return abs((b - a) * u.scale);
}

// Distance along the drawn path to a vertex. Points carry their own;
// a corner adds the legs of its step that come before it. Zero where
// the stroke is solid, which is all the buffer then holds.
fn arcAt(j : u32) -> f32 {
    if (u.dashCount == 0u) {
        return 0.0;
    }

    let last = u.count - 1u;

    if (u.step == 0u) {
        return arcs[min(j, last)];
    }

    if (u.step == 2u) {
        let k = min(j / 3u, last);
        let r = j % 3u;
        let legs = stepLegs(k);

        if (r == 0u) {
            return arcs[k];
        }
        if (r == 1u) {
            return arcs[k] + legs.x * 0.5;
        }
        return arcs[k] + legs.x * 0.5 + legs.y;
    }

    let k = min(j >> 1u, last);

    if ((j & 1u) == 0u) {
        return arcs[k];
    }

    let legs = stepLegs(k);

    // A right step rises first, a left one runs across first.
    return arcs[k] + select(legs.x, legs.y, u.step == 1u);
}

// Vertices the line takes. A step carries one extra corner per segment,
// two when it is centered.
fn vertexCount() -> u32 {
    let n = u.count;

    if (u.step == 0u) {
        return n;
    }
    if (u.step == 2u) {
        return 3u * n - 2u;
    }
    return 2u * n - 1u;
}

// Where a vertex of the line sits, in domain offsets. A corner takes one
// coordinate from each of the points it lies between, so each coordinate
// still comes through the origin of its own block.
fn vertexAt(j : u32) -> vec2f {
    let last = u.count - 1u;

    if (u.step == 0u) {
        return offsetAt(min(j, last));
    }

    if (u.step == 2u) {
        let k = min(j / 3u, last);
        let a = offsetAt(k);
        let b = offsetAt(min(k + 1u, last));
        let r = j % 3u;
        let mid = (a.x + b.x) * 0.5;

        if (r == 0u) {
            return a;
        }
        if (r == 1u) {
            return vec2f(mid, a.y);
        }
        return vec2f(mid, b.y);
    }

    let k = min(j >> 1u, last);
    let a = offsetAt(k);

    if ((j & 1u) == 0u) {
        return a;
    }

    let b = offsetAt(min(k + 1u, last));

    // A right step takes the new value at the left end of the segment,
    // a left step keeps the old one until the right end.
    return select(vec2f(b.x, a.y), vec2f(a.x, b.y), u.step == 1u);
}

// One vertex per point, for line-strip topology.
@vertex
fn vsHairline(@builtin(vertex_index) vi : u32) -> LineOut {
    let last = vertexCount() - 1u;
    let here = toPixelsAt(vertexAt(vi));
    let ahead = toPixelsAt(vertexAt(min(vi + 1u, last))) - here;
    let reach = length(ahead);

    var out : LineOut;
    out.pos = toClip(here);
    out.off = 0.0;
    out.arcFrom = arcAt(vi);
    out.segFrom = here;
    out.segDir = select(vec2f(0.0, 0.0), ahead / reach, reach > EPS);
    return out;
}

@vertex
fn vsLine(@builtin(vertex_index) vi : u32) -> LineOut {
    let last = vertexCount() - 1u;
    let i    = vi >> 2u;
    let k    = vi & 3u;
    let side = select(1.0, -1.0, (k & 1u) == 1u);
    // Built wider than the stroke; the fragment shader fades the surplus
    // out, so the edge is not cut off at the geometry.
    let reach = u.halfWidth + AA_PAD;

    var out : LineOut;
    out.off = side * reach;

    let curr = toPixelsAt(vertexAt(i));
    let dIn  = curr - toPixelsAt(vertexAt(max(i, 1u) - 1u));
    let dOut = toPixelsAt(vertexAt(min(i + 1u, last))) - curr;

    let lIn  = length(dIn);
    let lOut = length(dOut);

    // Every vertex of a point reports that point, so the segment and
    // the join either side of it measure from the same place.
    out.arcFrom = arcAt(i);
    out.segFrom = curr;
    out.segDir = select(
        select(vec2f(0.0, 0.0), dIn / lIn, lIn > EPS),
        dOut / lOut,
        lOut > EPS
    );

    // False for a NaN length too, so a null point, the ends of the strip
    // and a zero-length segment all take the same path.
    let okIn  = lIn  > EPS;
    let okOut = lOut > EPS;

    var dir : vec2f;

    if (okIn && okOut) {
        let uIn  = dIn / lIn;
        let uOut = dOut / lOut;
        let tangent = uIn + uOut;
        let lTan = length(tangent);

        if (lTan > EPS) {
            let m = tangent / lTan;
            let n = vec2f(-m.y, m.x);
            // Grows as 1 / sin(theta / 2) towards a reversal.
            let sinHalf = dot(n, vec2f(-uIn.y, uIn.x));

            if (sinHalf >= MITER_LIMIT) {
                // Both halves meet at the miter point, which leaves the
                // two join triangles with no area.
                out.pos = toClip(curr + n * side * reach / sinHalf);
                return out;
            }
        }

        // Past the limit each half keeps the normal of its own segment,
        // and the join triangles span the gap between them as a bevel.
        dir = select(uIn, uOut, k >= 2u);
    } else if (okIn) {
        dir = dIn / lIn;
    } else if (okOut) {
        dir = dOut / lOut;
    } else {
        out.pos = toClip(curr);
        return out;
    }

    out.pos = toClip(curr + vec2f(-dir.y, dir.x) * side * reach);
    return out;
}

// Hairlines are a single pixel of the primitive, with nothing to fade.
@fragment
fn fs(in : LineOut) -> @location(0) vec4f {
    let color = tint(fragValue(in.pos));
    let alpha = color.a * dashAlpha(pathDistance(in));

    // Target alphaMode is 'premultiplied'.
    return vec4f(color.rgb * alpha, alpha);
}

@fragment
fn fsLine(in : LineOut) -> @location(0) vec4f {
    let color = tint(fragValue(in.pos));
    let alpha = color.a * dashAlpha(pathDistance(in)) *
        coverageAt(abs(in.off) - u.halfWidth, fwidth(in.off));

    // Target alphaMode is 'premultiplied'.
    return vec4f(color.rgb * alpha, alpha);
}

`;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default LineShader;
