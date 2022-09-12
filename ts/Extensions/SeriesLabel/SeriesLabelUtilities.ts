/* *
 *
 *  (c) 2009-2021 Torstein Honsi
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

import type { LabelIntersectBoxObject } from './SeriesLabelOptions';

/* *
 *
 *  Functions
 *
 * */

/**
 * Counter-clockwise, part of the fast line intersection logic.
 *
 * @private
 * @function ccw
 */
function ccw(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
): boolean {
    const cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));

    return cw > 0 ? true : !(cw < 0);
}

/**
 * Detect if two lines intersect.
 *
 * @private
 * @function intersectLine
 */
function intersectLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
): boolean {
    return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
        ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
}

/**
 * Detect if a box intersects with a line.
 *
 * @private
 * @function boxIntersectLine
 */
function boxIntersectLine(
    x: number,
    y: number,
    w: number,
    h: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): boolean {
    return (
        intersectLine(x, y, x + w, y, x1, y1, x2, y2) || // top of label
        intersectLine(x + w, y, x + w, y + h, x1, y1, x2, y2) || // right
        intersectLine(x, y + h, x + w, y + h, x1, y1, x2, y2) || // bottom
        intersectLine(x, y, x, y + h, x1, y1, x2, y2) // left of label
    );
}

/**
 * @private
 */
function intersectRect(
    r1: LabelIntersectBoxObject,
    r2: LabelIntersectBoxObject
): boolean {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
}

/* *
 *
 *  Default Export
 *
 * */

const SeriesLabelUtilities = {
    boxIntersectLine,
    intersectRect
};

export default SeriesLabelUtilities;
