/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Class
 *
 * */

/**
 * Delaunay triangulation of a 2D point set.
 *
 * @internal
 */
class Delaunay<T extends Float32Array|Float64Array = Float32Array> {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The resulting triangulation as a flat array of triangle vertex indices.
     */
    public readonly triangles: Uint32Array;


    /**
     * The input points array.
     */
    public readonly points: T;

    /**
     * Sorted and deduplicated point indices used for triangulation.
     */
    private readonly ids: Uint32Array;

    /**
     * Numerical tolerance for geometric predicates.
     */
    private readonly epsilon: number;

    /**
     * Minimum X value used for normalization.
     */
    private readonly minX: number;

    /**
     * Minimum Y value used for normalization.
     */
    private readonly minY: number;

    /**
     * Inverse X scale factor used for normalization.
     */
    private readonly invScaleX: number;

    /**
     * Inverse Y scale factor used for normalization.
     */
    private readonly invScaleY: number;

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Create a new Delaunay triangulation.
     *
     * @param {Float32Array|Float64Array} points
     * A 1D array of points in the format [x0, y0, x1, y1, ...].
     */
    constructor(points: T) {
        this.points = points;

        const n = points.length >>> 1;

        // Floating-point error multiplier used by geometric predicates.
        this.epsilon = 4 * Number.EPSILON;

        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        for (let i = 0; i < n; i++) {
            const px = points[i << 1],
                py = points[(i << 1) + 1];

            if (px < minX) {
                minX = px;
            }
            if (px > maxX) {
                maxX = px;
            }
            if (py < minY) {
                minY = py;
            }
            if (py > maxY) {
                maxY = py;
            }
        }

        const rangeX = maxX - minX || 1,
            rangeY = maxY - minY || 1;

        this.minX = minX;
        this.minY = minY;
        this.invScaleX = 1 / rangeX;
        this.invScaleY = 1 / rangeY;

        const ids = new Uint32Array(n),
            x = (i: number): number =>
                (points[i << 1] - minX) * this.invScaleX,
            y = (i: number): number =>
                (points[(i << 1) + 1] - minY) * this.invScaleY;

        for (let i = 0; i < n; i++) {
            ids[i] = i;
        }

        ids.sort((a, b): number => (x(a) - x(b)) || (y(a) - y(b)));

        let m = n ? 1 : 0,
            pa: number,
            pb: number;
        for (let i = 1; i < n; ++i) {
            pa = ids[m - 1],
            pb = ids[i];
            if (x(pa) !== x(pb) || y(pa) !== y(pb)) {
                ids[m++] = pb;
            }
        }

        this.ids = ids.subarray(0, m);
        this.triangles = this.triangulate();
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Triangulate the points.
     *
     * @return {Uint32Array}
     * A 1D array of triangle vertex indices.
     */
    private triangulate(): Uint32Array {
        const count = this.ids.length;
        if (count < 3) {
            return new Uint32Array(0);
        }

        const points = this.points,
            { minX, minY, invScaleX, invScaleY } = this,
            x = (i: number): number =>
                (points[i << 1] - minX) * invScaleX,
            y = (i: number): number =>
                (points[(i << 1) + 1] - minY) * invScaleY;

        // Determine if three points are in counter-clockwise order.
        const orient = (a: number, b: number, c: number): boolean => {
            const ax = x(a),
                ay = y(a),
                bx = x(b) - ax,
                by = y(b) - ay,
                cx = x(c) - ax,
                cy = y(c) - ay,
                det = bx * cy - by * cx,
                err = (Math.abs(bx * cy) + Math.abs(by * cx)) * this.epsilon;

            return det > err;
        };

        // Determine if a point (d) is inside the circumcircle of a triangle
        // (a, b, c).
        const inCircle = (
            a: number,
            b: number,
            c: number,
            d: number
        ): boolean => {
            if (a === d || b === d || c === d) {
                // Skip if d is one of the triangle vertices.
                return false;
            }

            const ax = x(a) - x(d),
                ay = y(a) - y(d),
                bx = x(b) - x(d),
                by = y(b) - y(d),
                cx = x(c) - x(d),
                cy = y(c) - y(d),
                aa = ax * ax + ay * ay,
                bb = bx * bx + by * by,
                cc = cx * cx + cy * cy,
                term1 = by * cc - bb * cy,
                term2 = bx * cc - bb * cx,
                term3 = bx * cy - by * cx,
                det = ax * term1 - ay * term2 + aa * term3,
                err = (
                    Math.abs(ax * term1) +
                    Math.abs(ay * term2) +
                    Math.abs(aa * term3)
                ) * this.epsilon;

            return det > err;
        };

        // Data structures for the quad-edge data structure.
        let cap = Math.max(32, ((8 * count + 7) & ~3)), // Capacity (% 4 = 0)
            on = new Int32Array(cap), // Next edge in same face
            rt = new Int32Array(cap), // Rotation of edge (90 degrees)
            vtx = new Uint32Array(cap), // Origin vertex of edge
            seen = new Uint8Array(cap), // Visited flag for edge traversal
            top = 0; // Next free edge id (% 4 = 0)

        // Ensure the data structures have enough capacity for the required
        // number of edges.
        const ensure = (need: number): void => {
            // If the capacity is sufficient, return.
            if (need <= cap) {
                return;
            }

            // Double capacity until sufficient.
            let ncap = cap << 1;
            while (ncap < need) {
                ncap <<= 1;
            }

            const on2 = new Int32Array(ncap),
                rt2 = new Int32Array(ncap),
                v2 = new Uint32Array(ncap),
                s2 = new Uint8Array(ncap);

            on2.set(on);
            rt2.set(rt);
            v2.set(vtx);
            s2.set(seen);

            on = on2;
            rt = rt2;
            vtx = v2;
            seen = s2;
            cap = ncap;
        };

        const sym = (e: number): number => rt[rt[e]],
            rotSym = (e: number): number => sym(rt[e]),
            dest = (e: number): number => vtx[sym(e)],
            lnext = (e: number): number => rt[on[rotSym(e)]],
            oprev = (e: number): number => rt[on[rt[e]]],
            rprev = (e: number): number => on[sym(e)],
            leftOf = (p: number, e: number): boolean =>
                orient(p, vtx[e], dest(e)),
            rightOf = (p: number, e: number): boolean =>
                orient(p, dest(e), vtx[e]),
            admissible = (e: number, base: number): boolean =>
                rightOf(dest(e), base);

        // Create a new edge between two vertices.
        const makeEdge = (a: number, b: number): number => {
            ensure(top + 4);
            const e0 = top,
                e1 = top + 1,
                e2 = top + 2,
                e3 = top + 3;
            top += 4;

            // Rot cycle
            rt[e0] = e1;
            rt[e1] = e2;
            rt[e2] = e3;
            rt[e3] = e0;

            // Onext initial
            on[e0] = e0;
            on[e2] = e2;
            on[e1] = e3;
            on[e3] = e1;

            // Origins
            vtx[e0] = a;
            vtx[e2] = b;
            vtx[e1] = 0xffffffff;
            vtx[e3] = 0xffffffff;

            return e0;
        };

        // Splice two edges.
        const splice = (a: number, b: number): void => {
            const alpha = rt[on[a]];
            const beta = rt[on[b]];

            const t2 = on[a];
            const t3 = on[beta];
            const t4 = on[alpha];

            on[a] = on[b];
            on[b] = t2;
            on[alpha] = t3;
            on[beta] = t4;
        };

        // Connect two edges.
        const connect = (a: number, b: number): number => {
            const q = makeEdge(dest(a), vtx[b]);
            splice(q, lnext(a));
            splice(sym(q), b);
            return q;
        };

        // Removes an edge from both sides.
        const drop = (e: number): void => {
            splice(e, oprev(e));
            const es = sym(e);
            splice(es, oprev(es));
        };

        const A = this.ids;

        // Recursively triangulate a range [lo, hi) of points. Returns the
        // two endpoints [left, right] of the lower common tangent.
        const solve = (lo: number, hi: number): [number, number] => {
            const len = hi - lo;

            // If there are only two points, create a single edge.
            if (len === 2) {
                const a = makeEdge(A[lo], A[lo + 1]);
                return [a, sym(a)];
            }

            // If there are three points, create two edges and connect them.
            if (len === 3) {
                const a = makeEdge(A[lo], A[lo + 1]),
                    b = makeEdge(A[lo + 1], A[lo + 2]);
                splice(sym(a), b);

                const p0 = A[lo],
                    p1 = A[lo + 1],
                    p2 = A[lo + 2];

                if (orient(p0, p1, p2)) {
                    connect(b, a);
                    return [a, sym(b)];
                }

                if (orient(p0, p2, p1)) {
                    const c = connect(b, a);
                    return [sym(c), c];
                }

                return [a, sym(b)];
            }

            // Find the midpoint of the range.
            const mid = lo + ((len + 1) >>> 1);
            const L = solve(lo, mid);
            const R = solve(mid, hi);

            let ldo = L[0],
                ldi = L[1],
                rdi = R[0],
                rdo = R[1];

            // Lower common tangent
            for (;;) {
                if (leftOf(vtx[rdi], ldi)) {
                    ldi = lnext(ldi);
                } else if (rightOf(vtx[ldi], rdi)) {
                    rdi = rprev(rdi);
                } else {
                    break;
                }
            }

            let base = connect(sym(rdi), ldi);
            if (vtx[ldi] === vtx[ldo]) {
                ldo = sym(base);
            }
            if (vtx[rdi] === vtx[rdo]) {
                rdo = base;
            }

            // Merge loop - removing bad edges (inCircle) and adding new edges.
            for (;;) {
                // Left candidate
                let lc = on[sym(base)];
                if (admissible(lc, base)) {
                    while (
                        inCircle(dest(base), vtx[base], dest(lc), dest(on[lc]))
                    ) {
                        const t = on[lc];
                        drop(lc);
                        lc = t;
                    }
                }

                // Right candidate
                let rc = oprev(base);
                if (admissible(rc, base)) {
                    while (
                        inCircle(
                            dest(base),
                            vtx[base],
                            dest(rc),
                            dest(oprev(rc))
                        )
                    ) {
                        const t = oprev(rc);
                        drop(rc);
                        rc = t;
                    }
                }

                if (!admissible(lc, base) && !admissible(rc, base)) {
                    break;
                }

                if (!admissible(lc, base) || (
                    admissible(rc, base) &&
                    inCircle(dest(lc), vtx[lc], vtx[rc], dest(rc))
                )) {
                    base = connect(rc, sym(base));
                } else {
                    base = connect(sym(base), sym(lc));
                }
            }

            return [ldo, rdo];
        };

        let e0 = solve(0, count)[0];
        while (leftOf(dest(on[e0]), e0)) {
            e0 = on[e0];
        }

        const Q: number[] = [e0];
        let qi = 0;

        {
            let c = e0;
            do {
                Q.push(sym(c));
                seen[c] = 1;
                c = lnext(c);
            } while (c !== e0);
        }

        const faces: number[] = [];
        let cur: number,
            t: number;
        while (qi < Q.length) {
            const e = Q[qi++];
            if (seen[e]) {
                continue;
            }

            cur = e;
            do {
                faces.push(vtx[cur]);
                t = sym(cur);
                if (!seen[t]) {
                    Q.push(t);
                }
                seen[cur] = 1;
                cur = lnext(cur);
            } while (cur !== e);
        }

        return new Uint32Array(faces);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Delaunay;
