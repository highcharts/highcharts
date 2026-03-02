/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import U from '../Utilities.js';
const {
    clamp,
    pick,
    pushUnique,
    stableSort
} = U;

/* *
 *
 *  Namespace
 *
 * */

/** @internal */
namespace RendererUtilities {

    /* *
     *
     *  Declarations
     *
     * */

    export interface BoxObject {
        align?: number;
        pos?: number;
        rank?: (number|null);
        size: number;
        target: number;
        targets?: Array<number>;
    }

    export interface DistributedBoxArray<T extends BoxObject>
        extends Array<(T&DistributedBoxObject)> {
        reducedLen?: number;
    }

    export interface DistributedBoxObject extends BoxObject {
        pos?: number;
    }

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * General distribution algorithm for distributing labels of differing size
     * along a confined length in two dimensions. The algorithm takes an array
     * of objects containing a size, a target and a rank. It will place the
     * labels as close as possible to their targets, skipping the lowest ranked
     * labels if necessary.
     * @internal
     */
    export function distribute<T extends BoxObject>(
        boxes: DistributedBoxArray<T>,
        len: number,
        maxDistance?: number
    ): DistributedBoxArray<T> {
        // Original array will be altered with added .pos
        const origBoxes = boxes as DistributedBoxArray<T>,
            reducedLen = origBoxes.reducedLen || len,
            sortByRank = (
                a: BoxObject,
                b: BoxObject
            ): number =>
                (b.rank || 0) - (a.rank || 0),
            sortByTarget = (
                a: BoxObject,
                b: BoxObject
            ): number =>
                a.target - b.target,
            restBoxes: DistributedBoxArray<T> = [], // The outranked overshoot
            boxesLength = boxes.length,
            forDeletion: Array<number> = [],
            push = restBoxes.push;

        let i: number,
            overlapping = true,
            box: T & DistributedBoxObject,
            target: number,
            total = 0,
            equalRank: boolean;

        // If the total size exceeds the len, remove those boxes with the lowest
        // rank
        i = boxesLength;
        while (i--) {
            total += boxes[i].size;
        }

        // Sort by rank, then slice away overshoot
        if (total > reducedLen) {
            stableSort(boxes, sortByRank);
            equalRank = boxes[0].rank === boxes[boxes.length - 1].rank;

            // When all boxes have equal rank (pie data labels, flags - #10073),
            // decimate from the center outwards by repeatedly splitting index
            // ranges. This guarantees progress and avoids cursor/step stalling
            // on repeated indices (#23541). When ranks differ, remove the
            // lowest ranked boxes from the end.
            if (equalRank) {
                const ranges: Array<[number, number]> = [[0, boxesLength - 1]];

                while (ranges.length && total > reducedLen) {
                    const range = ranges.shift();
                    if (!range) {
                        break;
                    }

                    i = Math.floor((range[0] + range[1]) / 2);
                    box = boxes[i];
                    if (pushUnique(forDeletion, i)) {
                        total -= box.size;
                    }

                    if (range[0] < i) {
                        ranges.push([range[0], i - 1]);
                    }
                    if (i < range[1]) {
                        ranges.push([i + 1, range[1]]);
                    }
                }
            } else {
                i = boxesLength - 1;
                while (total > reducedLen && i >= 0) {
                    box = boxes[i];
                    if (pushUnique(forDeletion, i)) {
                        total -= box.size;
                    }
                    i--;
                }
            }

            // Clean out the boxes marked for deletion
            forDeletion
                .sort((a: number, b: number): number => b - a)
                .forEach((i): number =>
                    push.apply(restBoxes, boxes.splice(i, 1))
                );
        }

        // Order by target
        stableSort(boxes, sortByTarget);


        // So far we have been mutating the original array. Now
        // create a copy with target arrays
        boxes = boxes.map((box): (T&BoxObject) => ({
            size: box.size,
            targets: [box.target],
            align: pick(box.align, 0.5)
        } as (T&BoxObject)));

        while (overlapping) {
            // Initial positions: target centered in box
            i = boxes.length;
            while (i--) {
                box = boxes[i];
                // Composite box, average of targets
                target = (
                    Math.min.apply(0, box.targets as any) +
                    Math.max.apply(0, box.targets as any)
                ) / 2;
                box.pos = clamp(
                    target - box.size * (box.align as any), 0, len - box.size
                );
            }

            // Detect overlap and join boxes
            i = boxes.length;
            overlapping = false;
            while (i--) {
                // Overlap
                if (
                    i > 0 &&
                    (boxes[i - 1].pos as any) + boxes[i - 1].size >
                    (boxes[i].pos as any)
                ) {
                    // Add this size to the previous box
                    boxes[i - 1].size += boxes[i].size;
                    boxes[i - 1].targets = (boxes[i - 1]
                        .targets as any)
                        .concat(boxes[i].targets);
                    boxes[i - 1].align = 0.5;

                    // Overlapping right, push left
                    if ((boxes[i - 1].pos as any) + boxes[i - 1].size > len) {
                        boxes[i - 1].pos = len - boxes[i - 1].size;
                    }
                    boxes.splice(i, 1); // Remove this item
                    overlapping = true;
                }
            }
        }

        // Add the rest (hidden boxes)
        push.apply(origBoxes, restBoxes as DistributedBoxArray<T>);

        // Now the composite boxes are placed, we need to put the original boxes
        // within them
        i = 0;
        boxes.some((box): boolean => {
            let posInCompositeBox = 0;

            // Exceeded maxDistance => abort
            return (box.targets || []).some((): boolean => {
                origBoxes[i].pos = (box.pos as any) + posInCompositeBox;

                // If the distance between the position and the target exceeds
                // maxDistance, abort the loop and decrease the length in
                // increments of 10% to recursively reduce the number of
                // visible boxes by rank. Once all boxes are within the
                // maxDistance, we're good.
                if (
                    typeof maxDistance !== 'undefined' &&
                    Math.abs(
                        (origBoxes[i].pos as any) - origBoxes[i].target
                    ) > maxDistance
                ) {
                    // Reset the positions that are already set
                    origBoxes
                        .slice(0, i + 1)
                        .forEach((box): boolean => delete box.pos);

                    // Try with a smaller length
                    origBoxes.reducedLen =
                        (origBoxes.reducedLen || len) - (len * 0.1);

                    // Recurse
                    if (origBoxes.reducedLen > len * 0.1) {
                        distribute(origBoxes, len, maxDistance);
                    }

                    // Exceeded maxDistance => abort
                    return true;
                }

                posInCompositeBox += origBoxes[i].size;
                i++;

                return false;
            });
        });

        // Add the rest (hidden) boxes and sort by target
        stableSort(origBoxes, sortByTarget);

        return origBoxes;
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default RendererUtilities;
