/* *
 *
 *  (c) 2023 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Tools to simplify line series, reducing the number of points down to a
 *  target number while keeping the line shape as much as possible.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from '../Core/Series/Point';

import U from '../Core/Utilities.js';
const {
    defined
} = U;

export type XYPair = [number, number];

// Point type with additional internal props for the simplification algorithms.
type VisvalingamPoint = Point & {
    _visvalingamArea?: number;
    _avArea?: number;
    _nextPoint?: VisvalingamPoint;
    _prevPoint?: VisvalingamPoint;
};

// For binary min heap compare function
type ComparePredicate = (pointA: Point, pointB: Point) => boolean;

/**
 * Minimal binary min heap implementation for points that compare by a function.
 *
 * The function takes a pointA and a pointB, and should return true if pointA is
 * smaller than pointB.
 *
 * @class
 * @private
 */
class BinaryMinHeap {
    private heap: Point[] = [];

    constructor(private compareIsSmallerThan: ComparePredicate) { }

    // Add point to heap, inserted in the right place based on comparison fn
    push(point: Point): void {
        this.heap.push(point);
        this.sortUpFromIndex(this.heap.length - 1);
    }

    // Remove minimum point from heap, updating the rest of the heap
    popMin(): Point|null {
        if (!this.heap.length) {
            return null;
        }
        const min = this.heap[0],
            last = this.heap.pop();
        if (last) {
            if (!this.heap.length) {
                return last;
            }
            this.heap[0] = last;
            this.sortDownFromIndex(0);
        }
        return min;
    }

    length(): number {
        return this.heap.length;
    }

    updateNode(point: Point): void {
        const index = this.heap.indexOf(point);
        if (index > -1) {
            this.sortUpFromIndex(index);
            this.sortDownFromIndex(index);
        }
    }

    private sortUpFromIndex(index: number): void {
        const point = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2),
                parentPoint = this.heap[parentIndex];
            if (this.compareIsSmallerThan(point, parentPoint)) {
                // Swap nodes
                this.heap[parentIndex] = point;
                this.heap[index] = parentPoint;
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    private sortDownFromIndex(index: number): void {
        const length = this.heap.length,
            point = this.heap[index];
        let ix = index;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const leftNodeIx = 2 * ix + 1,
                rightNodeIx = 2 * ix + 2;
            let leftNodePoint,
                rightNodePoint,
                swapIndex = null;
            if (leftNodeIx < length) {
                leftNodePoint = this.heap[leftNodeIx];
                if (this.compareIsSmallerThan(leftNodePoint, point)) {
                    swapIndex = leftNodeIx;
                }
            }
            if (rightNodeIx < length) {
                rightNodePoint = this.heap[rightNodeIx];
                const shouldSwapRight =
                    swapIndex !== null && leftNodePoint ?
                        this.compareIsSmallerThan(
                            rightNodePoint, leftNodePoint) :
                        this.compareIsSmallerThan(
                            rightNodePoint, point);
                if (shouldSwapRight) {
                    swapIndex = rightNodeIx;
                }
            }
            if (swapIndex === null) {
                break;
            }
            this.heap[ix] = this.heap[swapIndex];
            this.heap[swapIndex] = point;
            ix = swapIndex;
        }
    }
}


/**
 * Get the area of a triangle of points
 * @private
 */
function getAreaForPoint(point: Point, prev?: Point, next?: Point): number {
    if (!prev || !next) {
        return Infinity;
    }
    const x1 = point.plotX,
        x2 = prev.plotX,
        x3 = next.plotX,
        y1 = point.plotY,
        y2 = prev.plotY,
        y3 = next.plotY;
    if (
        !defined(x1) || !defined(x2) || !defined(x3) ||
        !defined(y1) || !defined(y2) || !defined(y3)
    ) {
        return Infinity;
    }
    return Math.abs(
        0.5 * (
            (x1 * (y2 - y3)) +
            (x2 * (y3 - y1)) +
            (x3 * (y1 - y2))
        )
    );
}


/**
 * Simplify large XY data sets before further processing, by keeping
 * the min and max point for each pixel only.
 * @private
 */
function preprocessSimplify(points: Point[]): Point[] {
    if (points.length < 2000) {
        return points;
    }
    const simplified: Point[] = [],
        len = points.length,
        groupMin: [number, null|Point] = [Infinity, null],
        groupMax: [number, null|Point] = [-Infinity, null],
        addGroup = (): void => {
            const min = groupMin[1],
                max = groupMax[1];
            if (min && max) {
                if (min === max) {
                    simplified.push(min);
                } else {
                    const minFirst = min.x < max.x;
                    simplified.push(
                        minFirst ? min : max, minFirst ? max : min
                    );
                }
            }
        };
    let groupX = Infinity;
    for (let i = 0, p, y; i < len; ++i) {
        p = points[i];
        y = p.y;
        if (p.plotX !== void 0 && y !== void 0 && y !== null) {
            const x = Math.round(p.plotX);
            if (x !== groupX) {
                // New group
                addGroup();
                groupX = x;
                groupMin[0] = groupMax[0] = y;
                groupMin[1] = groupMax[1] = p;
            } else {
                // Within group
                if (y > groupMax[0]) {
                    groupMax[0] = y;
                    groupMax[1] = p;
                }
                if (y < groupMin[0]) {
                    groupMin[0] = y;
                    groupMin[1] = p;
                }
            }
        }
    }
    addGroup();
    return simplified;
}


/**
 * Get simplified array of points, supplying the target number of points in
 * the resulting simplified array.
 *
 * Based on the Visvalingam-Whyatt algorithm.
 * @private
 */
function subtractiveVisvalingam(points: Point[], numPoints: number): Point[] {
    // Using a binary min heap + doubly linked list is orders of magnitude
    // faster than a plain array for this algorithm, even though it takes
    // a bit more code.
    const heap = new BinaryMinHeap(
        (pointA: VisvalingamPoint, pointB: VisvalingamPoint): boolean => (
            defined(pointA._visvalingamArea) &&
            defined(pointB._visvalingamArea) ?
                pointA._visvalingamArea < pointB._visvalingamArea :
                false
        )
    );

    // First compute area for all points, and add them to the heap.
    // Also link them so we can keep the order updated as we remove.
    points.forEach((p: VisvalingamPoint, ix: number): void => {
        p._prevPoint = points[ix - 1] || void 0;
        p._nextPoint = points[ix + 1] || void 0;
        p._visvalingamArea = getAreaForPoint(p, p._prevPoint, p._nextPoint);
        if (p._visvalingamArea < Infinity) {
            heap.push(p);
        }
    });

    // Then remove points until we reach the target
    while (heap.length() > numPoints) {
        const removed = heap.popMin() as VisvalingamPoint,
            next = removed._nextPoint,
            prev = removed._prevPoint;

        // Recalc linked list references & area around removed point
        if (next) {
            next._prevPoint = removed._prevPoint;
            next._visvalingamArea = getAreaForPoint(
                next, next._prevPoint, next._nextPoint
            );
            if (next._visvalingamArea < Infinity) {
                heap.updateNode(next);
            }
        }
        if (prev) {
            prev._nextPoint = removed._nextPoint;
            prev._visvalingamArea = getAreaForPoint(
                prev, prev._prevPoint, prev._nextPoint
            );
            if (prev._visvalingamArea < Infinity) {
                heap.updateNode(prev);
            }
        }
        removed._nextPoint = removed._prevPoint =
            removed._visvalingamArea = void 0;
    }

    const simplified: Point[] = [];
    let simplifiedPoint: VisvalingamPoint|undefined = points[0];
    while (simplifiedPoint) {
        if (defined(simplifiedPoint.y)) {
            simplified.push(simplifiedPoint);
        }
        delete simplifiedPoint._visvalingamArea;
        simplifiedPoint = simplifiedPoint._nextPoint;
    }

    return simplified;
}


/**
 * Get simplified array of points, supplying the target number of points in
 * the resulting simplified array.
 *
 * Based on a modified Visvalingam-Whyatt algorithm, where we are adding the
 * most impactful points rather than subtracting the least impactful ones.
 *
 * The algorithm could be made faster with a more complex data structure, but
 * is already more than fast enough for current use cases with basic sorted
 * arrays, so keeping it this way for lower file size.
 *
 * @private
 */
function additiveVisvalingam(points: Point[], numPoints: number): Point[] {
    // Binary search a point array sorted by X value
    const findInsertionIx = (points: Point[], candidateX: number): number => {
        let start = 0,
            end = points.length - 1;
        while (start <= end) {
            const mid = Math.floor((start + end) / 2),
                midX = points[mid].x;
            if (midX === candidateX) {
                return mid;
            }
            if (midX < candidateX) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
        return start; // Insertion point if there is no direct match
    };

    // Skip null points
    const candidatePoints: VisvalingamPoint[] = points
        .filter((p): boolean => defined(p.y));

    // Skip if not enough points
    if (candidatePoints.length < 3) {
        return candidatePoints;
    }

    // Always include end points
    const simplified = [
        candidatePoints[0],
        candidatePoints[candidatePoints.length - 1]
    ];
    candidatePoints.shift();
    candidatePoints.pop();

    // As a starting point, calculate the area for each candidate point as
    // if it was added to the simplified line
    candidatePoints.forEach((cp): unknown => (
        cp._avArea = getAreaForPoint(
            cp,
            simplified[0],
            simplified[1]
        )
    ));

    // Build up the simplified line by adding points
    while (simplified.length < numPoints && candidatePoints.length) {
        // Find the highest area candidate
        let i = candidatePoints.length,
            maxArea = 0,
            maxAreaIx = -1;
        while (i--) {
            const candidatePoint = candidatePoints[i],
                area = candidatePoint._avArea || 0;
            if (area > maxArea && area < Infinity) {
                maxArea = area;
                maxAreaIx = i;
            }
        }

        // Remove the point, and add it to the simplified line
        if (maxAreaIx > -1) {
            const addedPoint = candidatePoints[maxAreaIx],
                insertionIx = findInsertionIx(simplified, addedPoint.x);
            candidatePoints.splice(maxAreaIx, 1);
            simplified.splice(insertionIx, 0, addedPoint);

            // Recalc area of candidate points that have x val between prev
            // and next point in the simplified line.
            const prevSimplified = simplified[insertionIx - 1],
                nextSimplified = simplified[insertionIx + 1],
                startX = prevSimplified && prevSimplified.x,
                endX = nextSimplified && nextSimplified.x;
            let candidateIx = findInsertionIx(candidatePoints, startX),
                candidatePoint = candidatePoints[candidateIx];
            while (candidatePoint && candidatePoint.x < endX) {
                const isBeforeInserted = candidatePoint.x < addedPoint.x;
                candidatePoint._avArea = getAreaForPoint(
                    candidatePoint,
                    isBeforeInserted ? prevSimplified : addedPoint,
                    isBeforeInserted ? addedPoint : nextSimplified
                );
                candidatePoint = candidatePoints[++candidateIx];
            }
        } else {
            break;
        }
    }

    return simplified;
}


/**
 * Simplify points in a line/XY series using cascading algorithms.
 *
 * Points are first preprocessed for speed, by reducing to min/max per pixel.
 * Points are then subtracted using a Visvalingam-Whyatt algorithm, until we get
 * to a number of points a relative amount above target. Then we start from
 * scratch, using a modified, additive, Visvalingam-Whyatt algo to add points
 * from the subtracted result until we reach the target.
 *
 * This approach is a good compromise, as the subtractive algo works better
 * with oscillating data, while the additive algo works better otherwise.
 *
 * @private
 */
function simplifyLine(points: Point[], numPoints: number): XYPair[] {
    const preprocessed = preprocessSimplify(points),
        stage1Threshold = Math.max(numPoints * 1.1, numPoints + 10),
        subtracted = subtractiveVisvalingam(preprocessed, stage1Threshold);
    return additiveVisvalingam(subtracted, numPoints)
        .map((p): XYPair => [p.x, p.y as number]);
}


/* *
 *
 *  Default Export
 *
 * */

export default simplifyLine;
