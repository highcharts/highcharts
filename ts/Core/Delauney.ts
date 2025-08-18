// === Inline 'robust-predicates' ===
const EPSILON = 1.1102230246251565e-16;


const ccwerrboundA = (3 + 16 * EPSILON) * EPSILON;

/**
 *
 */
function orient2d(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number
): number {
    const detleft = (ay - cy) * (bx - cx),
        detright = (ax - cx) * (by - cy),
        det = detleft - detright,
        detsum = Math.abs(detleft + detright);
    if (Math.abs(det) >= ccwerrboundA * detsum) {
        return det;
    }
    return 0;
}

const EDGE_STACK = new Uint32Array(512);

export default class Delaunator {
    public triangles: Uint32Array;
    private _triangles: Uint32Array;
    private halfedges: Int32Array;
    private _halfedges: Int32Array;
    private _hashSize: number;
    private hull: Uint32Array;
    private _hullPrev: Uint32Array;
    private _hullNext: Uint32Array; // Edge to next edge
    private _hullTri: Uint32Array; // Edge to adjacent triangle
    private _hullHash: Int32Array; // Angular edge hash
    private _ids: Uint32Array;
    private _dists: Float64Array;
    private trianglesLen: number = 0;
    private _cx: number = 0;
    private _cy: number = 0;
    private _hullStart: number = 0;
    private coords: Float64Array;

    static from(
        points: any,
        getX = defaultGetX,
        getY = defaultGetY
    ): Delaunator {
        const n = points.length;
        const coords = new Float64Array(n * 2);

        for (let i = 0; i < n; i++) {
            const p = points[i];
            coords[2 * i] = getX(p);
            coords[2 * i + 1] = getY(p);
        }

        return new Delaunator(coords);
    }

    constructor(coords: Float64Array) {
        const n = coords.length >> 1;
        if (n > 0 && typeof coords[0] !== 'number') {
            throw new Error('Expected coords to contain numbers.');
        }

        this.coords = coords;

        // Arrays that will store the triangulation graph
        const maxTriangles = Math.max(2 * n - 5, 0);
        /** @private */ this._triangles = new Uint32Array(maxTriangles * 3);
        /** @private */ this._halfedges = new Int32Array(maxTriangles * 3);

        // Temporary arrays for tracking the edges of the advancing convex hull
        /** @private */ this._hashSize = Math.ceil(Math.sqrt(n));

        // Edge to prev edge
        /** @private */ this._hullPrev = new Uint32Array(n);

        // Edge to next edge
        /** @private */ this._hullNext = new Uint32Array(n);

        // Edge to adjacent triangle
        /** @private */ this._hullTri = new Uint32Array(n);

        // Angular edge hash
        /** @private */ this._hullHash = new Int32Array(this._hashSize);

        // Temporary arrays for sorting points
        /** @private */ this._ids = new Uint32Array(n);
        /** @private */ this._dists = new Float64Array(n);

        /**
         * A `Uint32Array` array of indices that reference points on the
         * convex hull of the input data, counter-clockwise.
         */
        this.hull = this._triangles;

        /**
         * A `Uint32Array` array of triangle vertex indices (each group of
         * three numbers forms a triangle). All triangles are directed
         * counterclockwise.
        */
        this.triangles = this._triangles;

        /**
         * A `Int32Array` array of triangle half-edge indices that allows you
         * to traverse the triangulation.
         * `i`-th half-edge in the array corresponds to vertex `triangles[i]`
         * the half-edge is coming from.
         * `halfedges[i]` is the index of a twin half-edge in an adjacent
         * triangle (or `-1` for outer half-edges on the convex hull).
         */
        this.halfedges = this._halfedges;

        this.update();
    }

    /**
     * Updates the triangulation if you modified `delaunay.coords` values in
     * place, avoiding expensive memory allocations. Useful for iterative
     * relaxation algorithms such as Lloyd's.
     */
    update(): void {
        const {
                coords,
                _hullPrev: hullPrev,
                _hullNext: hullNext,
                _hullTri: hullTri,
                _hullHash: hullHash
            } = this,
            n = coords.length >> 1;

        // Populate an array of point indices; calculate input data bbox
        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

        for (let i = 0; i < n; i++) {
            const x = coords[2 * i],
                y = coords[2 * i + 1];
            if (x < minX) {
                minX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
            this._ids[i] = i;
        }
        const cx = (minX + maxX) / 2,
            cy = (minY + maxY) / 2;

        let i0 = 0,
            i1 = 0,
            i2 = 0;

        // Pick a seed point close to the center
        for (let i = 0, minDist = Infinity; i < n; i++) {
            const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist) {
                i0 = i;
                minDist = d;
            }
        }
        const i0x = coords[2 * i0],
            i0y = coords[2 * i0 + 1];

        // Find the point closest to the seed
        for (let i = 0, minDist = Infinity; i < n; i++) {
            if (i === i0) {
                continue;
            }
            const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist && d > 0) {
                i1 = i;
                minDist = d;
            }
        }
        let i1x = coords[2 * i1],
            i1y = coords[2 * i1 + 1];

        let minRadius = Infinity;

        // Find 3rd point, forming the smallest circumcircle with the first 2
        for (let i = 0; i < n; i++) {
            if (i === i0 || i === i1) {
                continue;
            }
            const r = circumradius(
                i0x,
                i0y,
                i1x,
                i1y,
                coords[2 * i],
                coords[2 * i + 1]
            );
            if (r < minRadius) {
                i2 = i;
                minRadius = r;
            }
        }
        let i2x = coords[2 * i2],
            i2y = coords[2 * i2 + 1];

        if (minRadius === Infinity) {
            // Order collinear points by dx (or dy if all x are identical)
            // and return the list as a hull
            for (let i = 0; i < n; i++) {
                this._dists[i] = (
                    (coords[2 * i] - coords[0]) ||
                    (coords[2 * i + 1] - coords[1])
                );
            }
            quicksort(this._ids, this._dists, 0, n - 1);
            const hull = new Uint32Array(n);
            let j = 0;
            for (let i = 0, d0 = -Infinity; i < n; i++) {
                const id = this._ids[i];
                const d = this._dists[id];
                if (d > d0) {
                    hull[j++] = id;
                    d0 = d;
                }
            }
            // This.hull = hull.subarray(0, j);
            this.triangles = new Uint32Array(0);
            // This.halfedges = new Int32Array(0);
            return;
        }

        // Swap the order of the seed points for counter-clockwise orientation
        if (orient2d(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
            const i = i1,
                x = i1x,
                y = i1y;
            i1 = i2;
            i1x = i2x;
            i1y = i2y;
            i2 = i;
            i2x = x;
            i2y = y;
        }

        const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
        this._cx = center.x;
        this._cy = center.y;

        for (let i = 0; i < n; i++) {
            this._dists[i] = dist(
                coords[2 * i],
                coords[2 * i + 1],
                center.x,
                center.y
            );
        }

        // Sort the points by distance from the seed triangle circumcenter
        quicksort(this._ids, this._dists, 0, n - 1);

        // Set up the seed triangle as the starting hull
        this._hullStart = i0;
        let hullSize = 3;

        hullNext[i0] = hullPrev[i2] = i1;
        hullNext[i1] = hullPrev[i0] = i2;
        hullNext[i2] = hullPrev[i1] = i0;

        hullTri[i0] = 0;
        hullTri[i1] = 1;
        hullTri[i2] = 2;

        hullHash.fill(-1);
        hullHash[this._hashKey(i0x, i0y)] = i0;
        hullHash[this._hashKey(i1x, i1y)] = i1;
        hullHash[this._hashKey(i2x, i2y)] = i2;

        this.trianglesLen = 0;
        this._addTriangle(i0, i1, i2, -1, -1, -1);

        for (let k = 0, xp = 0, yp = 0; k < this._ids.length; k++) {
            const i = this._ids[k],
                x = coords[2 * i],
                y = coords[2 * i + 1];

            // Skip near-duplicate points
            if (
                k > 0 && Math.abs(x - xp) <= EPSILON &&
                Math.abs(y - yp) <= EPSILON
            ) {
                continue;
            }
            xp = x;
            yp = y;

            // Skip seed triangle points
            if (i === i0 || i === i1 || i === i2) {
                continue;
            }

            // Find a visible edge on the convex hull using edge hash
            let start = 0;
            for (
                let j = 0,
                    key = this._hashKey(x, y);
                j < this._hashSize;
                j++
            ) {
                start = hullHash[(key + j) % this._hashSize];
                if (start !== -1 && start !== hullNext[start]) {
                    break;
                }
            }

            start = hullPrev[start];
            let e = start,
                q;
            while (
                q = hullNext[e],
                orient2d(
                    x,
                    y,
                    coords[2 * e],
                    coords[2 * e + 1],
                    coords[2 * q],
                    coords[2 * q + 1]
                ) >= 0
            ) {
                e = q;
                if (e === start) {
                    e = -1;
                    break;
                }
            }
            if (e === -1) {
                continue;
            } // Likely a near-duplicate point; skip it

            // add the first triangle from the point
            let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);

            hullTri[i] = this._legalize(t + 2);
            hullTri[e] = t; // Keep track of boundary triangles on the hull
            hullSize++;

            let n = hullNext[e];
            while (
                q = hullNext[n],
                orient2d(
                    x,
                    y,
                    coords[2 * n],
                    coords[2 * n + 1],
                    coords[2 * q],
                    coords[2 * q + 1]
                ) < 0
            ) {
                t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
                hullTri[i] = this._legalize(t + 2);
                hullNext[n] = n; // Mark as removed
                hullSize--;
                n = q;
            }

            if (e === start) {
                while (
                    q = hullPrev[e],
                    orient2d(
                        x,
                        y,
                        coords[2 * q],
                        coords[2 * q + 1],
                        coords[2 * e],
                        coords[2 * e + 1]
                    ) < 0
                ) {
                    t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
                    this._legalize(t + 2);
                    hullTri[q] = t;
                    hullNext[e] = e; // Mark as removed
                    hullSize--;
                    e = q;
                }
            }

            // Update the hull indices
            this._hullStart = hullPrev[i] = e;
            hullNext[e] = hullPrev[n] = i;
            hullNext[i] = n;

            // Save the two new edges in the hash table
            hullHash[this._hashKey(x, y)] = i;
            hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
        }

        this.hull = new Uint32Array(hullSize);
        for (let i = 0, e = this._hullStart; i < hullSize; i++) {
            this.hull[i] = e;
            e = hullNext[e];
        }

        // Trim typed triangle mesh arrays
        this.triangles = this._triangles.subarray(0, this.trianglesLen);
        this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    }

    /**
     * Angle-based key for the edge hash used for advancing convex hull.
     *
     * @param {number} x
     * @param {number} y
     * @private
     */
    _hashKey(x: number, y: number): number {
        return Math.floor(
            pseudoAngle(
                x - this._cx,
                y - this._cy
            ) *
            this._hashSize
        ) % this._hashSize;
    }

    /**
     * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay
     * condition.
     *
     * @param {number} a
     * @private
     */
    _legalize(a: number): number {
        const { _triangles: triangles, _halfedges: halfedges, coords } = this;

        let i = 0,
            ar = 0;

        // Recursion eliminated with a fixed-size stack
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const b = halfedges[a];

            /*
             * If the pair of triangles doesn't satisfy the Delaunay condition
             *
             * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
             * then do the same check/flip recursively for the new pair of
             * triangles
             *
             *           pl                    pl
             *          /||\                  /  \
             *       al/ || \bl            al/    \a
             *        /  ||  \              /      \
             *       /  a||b  \    flip    /___ar___\
             *     p0\   ||   /p1   =>   p0\---bl---/p1
             *        \  ||  /              \      /
             *       ar\ || /br             b\    /br
             *          \||/                  \  /
             *           pr                    pr
             */
            const a0 = a - a % 3;
            ar = a0 + (a + 2) % 3;

            if (b === -1) { // Convex hull edge
                if (i === 0) {
                    break;
                }
                a = EDGE_STACK[--i];
                continue;
            }

            const b0 = b - b % 3,
                al = a0 + (a + 1) % 3,
                bl = b0 + (b + 2) % 3,
                p0 = triangles[ar],
                pr = triangles[a],
                pl = triangles[al],
                p1 = triangles[bl],
                illegal = inCircle(
                    coords[2 * p0], coords[2 * p0 + 1],
                    coords[2 * pr], coords[2 * pr + 1],
                    coords[2 * pl], coords[2 * pl + 1],
                    coords[2 * p1], coords[2 * p1 + 1]
                );

            if (illegal) {
                triangles[a] = p1;
                triangles[b] = p0;

                const hbl = halfedges[bl];

                // Edge swapped on the other side of the hull (rare);
                // fix the half-edge reference
                if (hbl === -1) {
                    let e = this._hullStart;
                    do {
                        if (this._hullTri[e] === bl) {
                            this._hullTri[e] = a;
                            break;
                        }
                        e = this._hullPrev[e];
                    } while (e !== this._hullStart);
                }
                this._link(a, hbl);
                this._link(b, halfedges[ar]);
                this._link(ar, bl);

                const br = b0 + (b + 1) % 3;

                // Don't worry about hitting the cap: it can only happen on
                // extremely degenerate input
                if (i < EDGE_STACK.length) {
                    EDGE_STACK[i++] = br;
                }
            } else {
                if (i === 0) {
                    break;
                }
                a = EDGE_STACK[--i];
            }
        }

        return ar;
    }

    /**
     * Link two half-edges to each other.
     * @param {number} a
     * @param {number} b
     * @private
     */
    _link(a: number, b: number): void {
        this._halfedges[a] = b;
        if (b !== -1) {
            this._halfedges[b] = a;
        }
    }

    /**
     * Add a new triangle given vertex indices and adjacent half-edge ids.
     *
     * @param {number} i0
     * @param {number} i1
     * @param {number} i2
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @private
     */
    _addTriangle(
        i0: number,
        i1: number,
        i2: number,
        a: number,
        b: number,
        c: number
    ): number {
        const t = this.trianglesLen;

        this._triangles[t] = i0;
        this._triangles[t + 1] = i1;
        this._triangles[t + 2] = i2;

        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);

        this.trianglesLen += 3;

        return t;
    }
}


/**
 *
 */
function pseudoAngle(dx: number, dy: number): number {
    const p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
}


/**
 *
 */
function dist(ax: number, ay: number, bx: number, by: number): number {
    const dx = ax - bx,
        dy = ay - by;
    return dx * dx + dy * dy;
}


/**
 *
 */
function inCircle(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    px: number,
    py: number
): boolean {
    const dx = ax - px,
        dy = ay - py,
        ex = bx - px,
        ey = by - py,
        fx = cx - px,
        fy = cy - py,
        ap = dx * dx + dy * dy,
        bp = ex * ex + ey * ey,
        cp = fx * fx + fy * fy;

    return dx * (ey * cp - bp * fy) -
           dy * (ex * cp - bp * fx) +
           ap * (ex * fy - ey * fx) < 0;
}


/**
 *
 */
function circumradius(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number
): number {
    const dx = bx - ax,
        dy = by - ay,
        ex = cx - ax,
        ey = cy - ay,
        bl = dx * dx + dy * dy,
        cl = ex * ex + ey * ey,
        d = 0.5 / (dx * ey - dy * ex),
        x = (ey * bl - dy * cl) * d,
        y = (dx * cl - ex * bl) * d;

    return x * x + y * y;
}


/**
 *
 */
function circumcenter(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number
): { x: number, y: number } {
    const dx = bx - ax,
        dy = by - ay,
        ex = cx - ax,
        ey = cy - ay,

        bl = dx * dx + dy * dy,
        cl = ex * ex + ey * ey,
        d = 0.5 / (dx * ey - dy * ex),

        x = ax + (ey * bl - dy * cl) * d,
        y = ay + (dx * cl - ex * bl) * d;

    return { x, y };
}


/**
 *
 */
function quicksort(
    ids: Uint32Array,
    dists: Float64Array,
    left: number,
    right: number
): void {
    if (right - left <= 20) {
        for (let i = left + 1; i <= right; i++) {
            const temp = ids[i];
            const tempDist = dists[temp];
            let j = i - 1;
            while (j >= left && dists[ids[j]] > tempDist) {
                ids[j + 1] = ids[j--];
            }
            ids[j + 1] = temp;
        }
    } else {
        const median = (left + right) >> 1;
        let i = left + 1;
        let j = right;
        swap(ids, median, i);
        if (dists[ids[left]] > dists[ids[right]]) {
            swap(ids, left, right);
        }
        if (dists[ids[i]] > dists[ids[right]]) {
            swap(ids, i, right);
        }
        if (dists[ids[left]] > dists[ids[i]]) {
            swap(ids, left, i);
        }

        const temp = ids[i];
        const tempDist = dists[temp];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            do {
                i++;
            } while (dists[ids[i]] < tempDist);
            do {
                j--;
            } while (dists[ids[j]] > tempDist);
            if (j < i) {
                break;
            }
            swap(ids, i, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;

        if (right - i + 1 >= j - left) {
            quicksort(ids, dists, i, right);
            quicksort(ids, dists, left, j - 1);
        } else {
            quicksort(ids, dists, left, j - 1);
            quicksort(ids, dists, i, right);
        }
    }
}


/**
 *
 */
function swap(arr: Uint32Array, i: number, j: number): void {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

/**
 *
 */
function defaultGetX(p: Float64Array): number {
    return p[0];
}
/**
 *
 */
function defaultGetY(p: Float64Array): number {
    return p[1];
}
