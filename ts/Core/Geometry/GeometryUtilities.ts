/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type PositionObject from '../Renderer/PositionObject';

/* *
 *
 *  Namespace
 *
 * */

/** @internal */
namespace GeometryUtilities {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Calculates the center between a list of points.
     *
     * @internal
     *
     * @param {Array<Highcharts.PositionObject>} points
     * A list of points to calculate the center of.
     *
     * @return {Highcharts.PositionObject}
     * Calculated center
     */
    export function getCenterOfPoints(
        points: Array<PositionObject>
    ): PositionObject {
        const sum = points.reduce((sum, point): PositionObject => {
            sum.x += point.x;
            sum.y += point.y;
            return sum;
        }, { x: 0, y: 0 } as PositionObject);
        return {
            x: sum.x / points.length,
            y: sum.y / points.length
        };
    }

    /**
     * Calculates the distance between two points based on their x and y
     * coordinates.
     *
     * @internal
     *
     * @param {Highcharts.PositionObject} p1
     * The x and y coordinates of the first point.
     *
     * @param {Highcharts.PositionObject} p2
     * The x and y coordinates of the second point.
     *
     * @return {number}
     * Returns the distance between the points.
     */
    export function getDistanceBetweenPoints(
        p1: PositionObject,
        p2: PositionObject
    ): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    /**
     * Calculates the angle between two points.
     * @todo add unit tests.
     * @internal
     * @param {Highcharts.PositionObject} p1 The first point.
     * @param {Highcharts.PositionObject} p2 The second point.
     * @return {number} Returns the angle in radians.
     */
    export function getAngleBetweenPoints(
        p1: PositionObject,
        p2: PositionObject
    ): number {
        return Math.atan2(p2.x - p1.x, p2.y - p1.y);
    }

    /**
     * Test for point in polygon. Polygon defined as array of [x,y] points.
     * @internal
     * @param {PositionObject} point The point potentially within a polygon.
     * @param {Array<Array<number>>} polygon The polygon potentially containing the point.
     */
    export function pointInPolygon(
        { x, y }: PositionObject,
        polygon: Array<Array<number>>
    ): boolean {
        const len = polygon.length;
        let i,
            j,
            inside = false;

        for (i = 0, j = len - 1; i < len; j = i++) {
            const [x1, y1] = polygon[i],
                [x2, y2] = polygon[j];

            if (
                y1 > y !== y2 > y &&
                (
                    x < (x2 - x1) *
                    (y - y1) /
                    (y2 - y1) +
                    x1
                )
            ) {
                inside = !inside;
            }
        }

        return inside;
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default GeometryUtilities;
