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

class Delaunay<PointsArray extends Float32Array|Float64Array = Float32Array> {

    /* *
     *
     *  Properties
     *
     * */

    public readonly triangles: Uint32Array;
    public readonly points: PointsArray;

    private readonly ids: Uint32Array;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(points: PointsArray) {
        this.points = points;

        const n = points.length >>> 1,
            ids = new Uint32Array(n),
            x = (i: number): number => points[i << 1],
            y = (i: number): number => points[(i << 1) + 1];

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

    private triangulate(): Uint32Array {
        const count = this.ids.length;
        if (count < 3) {
            return new Uint32Array(0);
        }

        const points = this.points,
            x = (i: number): number => points[i << 1],
            y = (i: number): number => points[(i << 1) + 1];

        const orient = (a: number, b: number, c: number): boolean => {
            const ax = x(a),
                ay = y(a);
            return (x(b) - ax) * (y(c) - ay) - (y(b) - ay) * (x(c) - ax) > 0;
        };

        const inCircle = (
            a: number,
            b: number,
            c: number,
            d: number
        ): boolean => {
            if (a === d || b === d || c === d) {
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
                cc = cx * cx + cy * cy;

            return (
                ax * (by * cc - bb * cy) -
                ay * (bx * cc - bb * cx) +
                aa * (bx * cy - by * cx)
            ) > 0;
        };

        let cap = Math.max(32, ((8 * count + 7) & ~3)),
            on = new Int32Array(cap),
            rt = new Int32Array(cap),
            vtx = new Uint32Array(cap),
            seen = new Uint8Array(cap),
            top = 0; // Next free edge id (always multiple of 4)

        const ensure = (need: number): void => {
            if (need <= cap) {
                return;
            }

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

        const connect = (a: number, b: number): number => {
            const q = makeEdge(dest(a), vtx[b]);
            splice(q, lnext(a));
            splice(sym(q), b);
            return q;
        };

        const drop = (e: number): void => {
            splice(e, oprev(e));
            const es = sym(e);
            splice(es, oprev(es));
        };

        const A = this.ids;

        const solve = (lo: number, hi: number): [number, number] => {
            const len = hi - lo;

            if (len === 2) {
                const a = makeEdge(A[lo], A[lo + 1]);
                return [a, sym(a)];
            }

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

            // Merge loop
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
