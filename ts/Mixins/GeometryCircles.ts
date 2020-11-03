/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type PositionObject from '../Core/Renderer/PositionObject';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import Geometry from './Geometry.js';
const {
    getAngleBetweenPoints,
    getCenterOfPoints,
    getDistanceBetweenPoints
} = Geometry;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface CircleObject extends PositionObject {
            r: number;
        }
        interface GeometryIntersectionObject {
            center: PositionObject;
            d: SVGPath;
        }
        interface GeometryObject extends PositionObject {
            angle?: number;
            r?: number;
            indexes?: [number, number];
        }
    }
}


/**
 * @private
 * @param {number} x
 *        Number to round
 * @param {number} decimals
 *        Number of decimals to round to
 * @return {number}
 *         Rounded number
 */
function round(x: number, decimals: number): number {
    const a = Math.pow(10, decimals);

    return Math.round(x * a) / a;
}

/**
 * Calculates the area of a circle based on its radius.
 * @private
 * @param {number} r
 *        The radius of the circle.
 * @return {number}
 *         Returns the area of the circle.
 */
function getAreaOfCircle(r: number): number {
    if (r <= 0) {
        throw new Error('radius of circle must be a positive number.');
    }
    return Math.PI * r * r;
}

/**
 * Calculates the area of a circular segment based on the radius of the circle
 * and the height of the segment.
 * See http://mathworld.wolfram.com/CircularSegment.html
 * @private
 * @param {number} r
 *        The radius of the circle.
 * @param {number} h
 *        The height of the circular segment.
 * @return {number}
 *         Returns the area of the circular segment.
 */
function getCircularSegmentArea(r: number, h: number): number {
    return r * r * Math.acos(1 - h / r) - (r - h) * Math.sqrt(h * (2 * r - h));
}

/**
 * Calculates the area of overlap between two circles based on their radiuses
 * and the distance between them.
 * See http://mathworld.wolfram.com/Circle-CircleIntersection.html
 * @private
 * @param {number} r1
 *        Radius of the first circle.
 * @param {number} r2
 *        Radius of the second circle.
 * @param {number} d
 *        The distance between the two circles.
 * @return {number}
 *         Returns the area of overlap between the two circles.
 */
function getOverlapBetweenCircles(r1: number, r2: number, d: number): number {
    let overlap = 0;

    // If the distance is larger than the sum of the radiuses then the circles
    // does not overlap.
    if (d < r1 + r2) {
        if (d <= Math.abs(r2 - r1)) {
            // If the circles are completely overlapping, then the overlap
            // equals the area of the smallest circle.
            overlap = getAreaOfCircle(r1 < r2 ? r1 : r2);
        } else {
            // Height of first triangle segment.
            const d1 = (r1 * r1 - r2 * r2 + d * d) / (2 * d),
                // Height of second triangle segment.
                d2 = d - d1;

            overlap = (
                getCircularSegmentArea(r1, r1 - d1) +
                getCircularSegmentArea(r2, r2 - d2)
            );
        }
        // Round the result to two decimals.
        overlap = round(overlap, 14);
    }
    return overlap;
}

/**
 * Calculates the intersection points of two circles.
 *
 * NOTE: does not handle floating errors well.
 * @private
 * @param {Highcharts.CircleObject} c1
 *        The first circle.
 * @param {Highcharts.CircleObject} c2
 *        The second sircle.
 * @return {Array<Highcharts.PositionObject>}
 *         Returns the resulting intersection points.
 */
function getCircleCircleIntersection(
    c1: Highcharts.CircleObject,
    c2: Highcharts.CircleObject
): Array<PositionObject> {
    const d = getDistanceBetweenPoints(c1, c2),
        r1 = c1.r,
        r2 = c2.r;
    let points: Array<PositionObject> = [];

    if (d < r1 + r2 && d > Math.abs(r1 - r2)) {
        // If the circles are overlapping, but not completely overlapping, then
        // it exists intersecting points.
        const r1Square = r1 * r1,
            r2Square = r2 * r2,
            // d^2 - r^2 + R^2 / 2d
            x = (r1Square - r2Square + d * d) / (2 * d),
            // y^2 = R^2 - x^2
            y = Math.sqrt(r1Square - x * x),
            x1 = c1.x,
            x2 = c2.x,
            y1 = c1.y,
            y2 = c2.y,
            x0 = x1 + x * (x2 - x1) / d,
            y0 = y1 + x * (y2 - y1) / d,
            rx = -(y2 - y1) * (y / d),
            ry = -(x2 - x1) * (y / d);

        points = [
            { x: round(x0 + rx, 14), y: round(y0 - ry, 14) },
            { x: round(x0 - rx, 14), y: round(y0 + ry, 14) }
        ];
    }
    return points;
}

/**
 * Calculates all the intersection points for between a list of circles.
 * @private
 * @param {Array<Highcharts.CircleObject>} circles
 *        The circles to calculate the points from.
 * @return {Array<Highcharts.GeometryObject>}
 *         Returns a list of intersection points.
 */
function getCirclesIntersectionPoints(
    circles: Array<Highcharts.CircleObject>
): Array<Highcharts.GeometryObject> {
    return circles.reduce(function (
        points: Array<Highcharts.GeometryObject>,
        c1: Highcharts.CircleObject,
        i: number,
        arr: Array<Highcharts.CircleObject>
    ): Array<Highcharts.GeometryObject> {
        const additional = arr.slice(i + 1)
            .reduce(function (
                points: Array<Highcharts.GeometryObject>,
                c2: Highcharts.CircleObject,
                j: number
            ): Array<Highcharts.GeometryObject> {
                const indexes: [number, number] = [i, j + i + 1];

                return points.concat(
                    getCircleCircleIntersection(c1, c2)
                        .map(function (
                            p: Highcharts.GeometryObject
                        ): Highcharts.GeometryObject {
                            p.indexes = indexes;
                            return p;
                        })
                );
            }, []);

        return points.concat(additional);
    }, []);
}

/**
 * Tests wether the first circle is completely overlapping the second circle.
 *
 * @private
 * @param {Highcharts.CircleObject} circle1 The first circle.
 * @param {Highcharts.CircleObject} circle2 The The second circle.
 * @return {boolean} Returns true if circle1 is completely overlapping circle2,
 * false if not.
 */
function isCircle1CompletelyOverlappingCircle2(
    circle1: Highcharts.CircleObject,
    circle2: Highcharts.CircleObject
): boolean {
    return getDistanceBetweenPoints(circle1, circle2) + circle2.r <
        circle1.r + 1e-10;
}

/**
 * Tests wether a point lies within a given circle.
 * @private
 * @param {Highcharts.PositionObject} point
 *        The point to test for.
 * @param {Highcharts.CircleObject} circle
 *        The circle to test if the point is within.
 * @return {boolean}
 *         Returns true if the point is inside, false if outside.
 */
function isPointInsideCircle(
    point: PositionObject,
    circle: Highcharts.CircleObject
): boolean {
    return getDistanceBetweenPoints(point, circle) <= circle.r + 1e-10;
}

/**
 * Tests wether a point lies within a set of circles.
 * @private
 * @param {Highcharts.PositionObject} point
 *        The point to test.
 * @param {Array<Highcharts.CircleObject>} circles
 *        The list of circles to test against.
 * @return {boolean}
 *         Returns true if the point is inside all the circles, false if not.
 */
function isPointInsideAllCircles(
    point: PositionObject,
    circles: Array<Highcharts.CircleObject>
): boolean {
    return !circles.some(function (circle: Highcharts.CircleObject): boolean {
        return !isPointInsideCircle(point, circle);
    });
}

/**
 * Tests wether a point lies outside a set of circles.
 *
 * TODO: add unit tests.
 * @private
 * @param {Highcharts.PositionObject} point
 *        The point to test.
 * @param {Array<Highcharts.CircleObject>} circles
 *        The list of circles to test against.
 * @return {boolean}
 *         Returns true if the point is outside all the circles, false if not.
 */
function isPointOutsideAllCircles(
    point: PositionObject,
    circles: Array<Highcharts.CircleObject>
): boolean {
    return !circles.some(function (circle: Highcharts.CircleObject): boolean {
        return isPointInsideCircle(point, circle);
    });
}

/**
 * Calculates the points for the polygon of the intersection area between a set
 * of circles.
 *
 * @private
 * @param {Array<Highcharts.CircleObject>} circles
 *        List of circles to calculate polygon of.
 * @return {Array<Highcharts.GeometryObject>} Return list of points in the
 * intersection polygon.
 */
function getCirclesIntersectionPolygon(
    circles: Array<Highcharts.CircleObject>
): Array<Highcharts.GeometryObject> {
    return getCirclesIntersectionPoints(circles)
        .filter(function (p: PositionObject): boolean {
            return isPointInsideAllCircles(p, circles);
        });
}

/**
 * Calculate the path for the area of overlap between a set of circles.
 * @todo handle cases with only 1 or 0 arcs.
 * @private
 * @param {Array<Highcharts.CircleObject>} circles
 *        List of circles to calculate area of.
 * @return {Highcharts.GeometryIntersectionObject|undefined}
 *         Returns the path for the area of overlap. Returns an empty string if
 *         there are no intersection between all the circles.
 */
function getAreaOfIntersectionBetweenCircles(
    circles: Array<Highcharts.CircleObject>
): (Highcharts.GeometryIntersectionObject|undefined) {
    let intersectionPoints = getCirclesIntersectionPolygon(circles),
        result: (Highcharts.GeometryIntersectionObject|undefined);

    if (intersectionPoints.length > 1) {
        // Calculate the center of the intersection points.
        const center = getCenterOfPoints(intersectionPoints);

        intersectionPoints = intersectionPoints
            // Calculate the angle between the center and the points.
            .map(function (
                p: Highcharts.GeometryObject
            ): Highcharts.GeometryObject {
                p.angle = getAngleBetweenPoints(center, p);
                return p;
            })
            // Sort the points by the angle to the center.
            .sort(function (
                a: Highcharts.GeometryObject,
                b: Highcharts.GeometryObject
            ): number {
                return (b.angle as any) - (a.angle as any);
            });

        const startPoint = intersectionPoints[intersectionPoints.length - 1];
        const arcs: SVGPath = intersectionPoints
            .reduce(function (
                data,
                p1: Highcharts.GeometryObject
            ): any {
                const { startPoint } = data,
                    midPoint = getCenterOfPoints([startPoint, p1]);

                // Calculate the arc from the intersection points and their
                // circles.
                const arc = (p1.indexes as any)
                    // Filter out circles that are not included in both
                    // intersection points.
                    .filter(function (index: number): boolean {
                        return (startPoint.indexes as any).indexOf(index) > -1;
                    })
                    // Iterate the circles of the intersection points and
                    // calculate arcs.
                    .reduce(function (arc: any, index: number): any {
                        const circle = circles[index],
                            angle1 = getAngleBetweenPoints(circle, p1),
                            angle2 = getAngleBetweenPoints(circle, startPoint),
                            angleDiff = angle2 - angle1 +
                                (angle2 < angle1 ? 2 * Math.PI : 0),
                            angle = angle2 - angleDiff / 2;
                        let width = getDistanceBetweenPoints(
                            midPoint,
                            {
                                x: circle.x + circle.r * Math.sin(angle),
                                y: circle.y + circle.r * Math.cos(angle)
                            }
                        );
                        const { r } = circle;

                        // Width can sometimes become to large due to floating
                        // point errors
                        if (width > r * 2) {
                            width = r * 2;
                        }
                        // Get the arc with the smallest width.
                        if (!arc || arc.width > width) {
                            arc = {
                                r,
                                largeArc: width > r ? 1 : 0,
                                width,
                                x: p1.x,
                                y: p1.y
                            };
                        }

                        // Return the chosen arc.
                        return arc;
                    }, null);

                // If we find an arc then add it to the list and update p2.
                if (arc) {
                    const { r } = arc;

                    data.arcs.push(
                        ['A', r, r, 0, arc.largeArc, 1, arc.x, arc.y]
                    );
                    data.startPoint = p1;
                }
                return data;
            }, {
                startPoint: startPoint,
                arcs: [] as SVGPath
            }).arcs;

        if (arcs.length === 0) {
            // empty
        } else if (arcs.length === 1) {
            // empty
        } else {
            arcs.unshift(['M', startPoint.x, startPoint.y]);
            result = {
                center,
                d: arcs
            };
        }
    }

    return result;
}

const geometryCircles = {
    getAreaOfCircle,
    getAreaOfIntersectionBetweenCircles,
    getCircleCircleIntersection,
    getCirclesIntersectionPoints,
    getCirclesIntersectionPolygon,
    getCircularSegmentArea,
    getOverlapBetweenCircles,
    isCircle1CompletelyOverlappingCircle2,
    isPointInsideCircle,
    isPointInsideAllCircles,
    isPointOutsideAllCircles,
    round
};

export default geometryCircles;
