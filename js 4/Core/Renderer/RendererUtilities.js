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
var clamp = U.clamp, pick = U.pick, stableSort = U.stableSort;
/* *
 *
 *  Namespace
 *
 * */
var RendererUtilities;
(function (RendererUtilities) {
    /* *
     *
     *  Declarations
     *
     * */
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
    function distribute(boxes, len, maxDistance) {
        // Original array will be altered with added .pos
        var origBoxes = boxes, reducedLen = origBoxes.reducedLen || len, sortByRank = function (a, b) {
            return (b.rank || 0) - (a.rank || 0);
        }, sortByTarget = function (a, b) {
            return a.target - b.target;
        };
        var i, overlapping = true, restBoxes = [], // The outranked overshoot
        box, target, total = 0;
        // If the total size exceeds the len, remove those boxes with the lowest
        // rank
        i = boxes.length;
        while (i--) {
            total += boxes[i].size;
        }
        // Sort by rank, then slice away overshoot
        if (total > reducedLen) {
            stableSort(boxes, sortByRank);
            i = 0;
            total = 0;
            while (total <= reducedLen) {
                total += boxes[i].size;
                i++;
            }
            restBoxes = boxes.splice(i - 1, boxes.length);
        }
        // Order by target
        stableSort(boxes, sortByTarget);
        // So far we have been mutating the original array. Now
        // create a copy with target arrays
        boxes = boxes.map(function (box) { return ({
            size: box.size,
            targets: [box.target],
            align: pick(box.align, 0.5)
        }); });
        while (overlapping) {
            // Initial positions: target centered in box
            i = boxes.length;
            while (i--) {
                box = boxes[i];
                // Composite box, average of targets
                target = (Math.min.apply(0, box.targets) +
                    Math.max.apply(0, box.targets)) / 2;
                box.pos = clamp(target - box.size * box.align, 0, len - box.size);
            }
            // Detect overlap and join boxes
            i = boxes.length;
            overlapping = false;
            while (i--) {
                // Overlap
                if (i > 0 &&
                    boxes[i - 1].pos + boxes[i - 1].size >
                        boxes[i].pos) {
                    // Add this size to the previous box
                    boxes[i - 1].size += boxes[i].size;
                    boxes[i - 1].targets = boxes[i - 1]
                        .targets
                        .concat(boxes[i].targets);
                    boxes[i - 1].align = 0.5;
                    // Overlapping right, push left
                    if (boxes[i - 1].pos + boxes[i - 1].size > len) {
                        boxes[i - 1].pos = len - boxes[i - 1].size;
                    }
                    boxes.splice(i, 1); // Remove this item
                    overlapping = true;
                }
            }
        }
        // Add the rest (hidden boxes)
        origBoxes.push.apply(origBoxes, restBoxes);
        // Now the composite boxes are placed, we need to put the original boxes
        // within them
        i = 0;
        boxes.some(function (box) {
            var posInCompositeBox = 0;
            // Exceeded maxDistance => abort
            return (box.targets || []).some(function () {
                origBoxes[i].pos = box.pos + posInCompositeBox;
                // If the distance between the position and the target exceeds
                // maxDistance, abort the loop and decrease the length in
                // increments of 10% to recursively reduce the  number of
                // visible boxes by rank. Once all boxes are within the
                // maxDistance, we're good.
                if (typeof maxDistance !== 'undefined' &&
                    Math.abs(origBoxes[i].pos - origBoxes[i].target) > maxDistance) {
                    // Reset the positions that are already set
                    origBoxes
                        .slice(0, i + 1)
                        .forEach(function (box) { return delete box.pos; });
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
    RendererUtilities.distribute = distribute;
})(RendererUtilities || (RendererUtilities = {}));
/* *
 *
 *  Default Export
 *
 * */
export default RendererUtilities;
