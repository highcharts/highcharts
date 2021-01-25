/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type PositionObject from '../Core/Renderer/PositionObject';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface GeometryMixin {
            getAngleBetweenPoints(
                p1: PositionObject,
                p2: PositionObject
            ): number;
            getCenterOfPoints(points: Array<PositionObject>): PositionObject;
            getDistanceBetweenPoints(
                p1: PositionObject,
                p2: PositionObject
            ): number;
        }
    }
}

/**
 * Calculates the center between a list of points.
 * @private
 * @param {Array<Highcharts.PositionObject>} points
 *        A list of points to calculate the center of.
 * @return {Highcharts.PositionObject}
 *         Calculated center
 */
const getCenterOfPoints = function getCenterOfPoints(
    points: Array<PositionObject>
): PositionObject {
    var sum = points.reduce(function (
        sum: PositionObject,
        point: PositionObject
    ): PositionObject {
        sum.x += point.x;
        sum.y += point.y;
        return sum;
    }, { x: 0, y: 0 });

    return {
        x: sum.x / points.length,
        y: sum.y / points.length
    };
};

/**
 * Calculates the distance between two points based on their x and y
 * coordinates.
 * @private
 * @param {Highcharts.PositionObject} p1
 *        The x and y coordinates of the first point.
 * @param {Highcharts.PositionObject} p2
 *        The x and y coordinates of the second point.
 * @return {number}
 *         Returns the distance between the points.
 */
const getDistanceBetweenPoints = function getDistanceBetweenPoints(
    p1: PositionObject,
    p2: PositionObject
): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculates the angle between two points.
 * @todo add unit tests.
 * @private
 * @param {Highcharts.PositionObject} p1 The first point.
 * @param {Highcharts.PositionObject} p2 The second point.
 * @return {number} Returns the angle in radians.
 */
const getAngleBetweenPoints = function getAngleBetweenPoints(
    p1: PositionObject,
    p2: PositionObject
): number {
    return Math.atan2(p2.x - p1.x, p2.y - p1.y);
};

const geometry: Highcharts.GeometryMixin = {
    getAngleBetweenPoints: getAngleBetweenPoints,
    getCenterOfPoints: getCenterOfPoints,
    getDistanceBetweenPoints: getDistanceBetweenPoints
};

export default geometry;
