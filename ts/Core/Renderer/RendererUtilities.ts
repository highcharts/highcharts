/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
     * @private
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
            cursor: number,
            step: number,
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
            step = equalRank ? boxesLength / 2 : -1;
            cursor = equalRank ? step : boxesLength - 1;

            // When the boxes have equal rank (pie data labels, flags - #10073),
            // decimate the boxes by starting in the middle and gradually remove
            // more items inside the array. When they are sorted by rank, just
            // remove the ones with the lowest rank from the end.
            while (step && total > reducedLen) {
                i = Math.floor(cursor);
                box = boxes[i];
                if (pushUnique(forDeletion, i)) {
                    total -= box.size;
                }
                cursor += step;

                // Start over the decimation with smaller steps
                if (equalRank && cursor >= boxes.length) {
                    step /= 2;
                    cursor = step;
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
                if (i > 0 &&
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
                // increments of 10% to recursively reduce the  number of
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

export default RendererUtilities;
