/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            scale3d?: number;
        }
        interface Position3dObject extends PositionObject {
            z: number;
        }
        interface Rotation3dObject {
            cosA: number;
            cosB: number;
            sinA: number;
            sinB: number;
        }
        function perspective(
            points: Array<Position3dObject>,
            chart: Chart,
            insidePlotArea?: boolean
        ): Array<Position3dObject>;
        function perspective3D(
            coordinate: Position3dObject,
            origin: Position3dObject,
            distance: number
        ): PositionObject;
        function pointCameraDistance(
            coordinates: Dictionary<number>,
            chart: Chart
        ): number;
        function shapeArea(vertexes: Array<PositionObject>): number;
        function shapeArea3d(
            vertexes: Array<Position3dObject>,
            chart: Chart,
            insidePlotArea?: boolean
        ): number;
    }
}

import U from '../parts/Utilities.js';
const {
    pick
} = U;

// Mathematical Functionility
var deg2rad = H.deg2rad;

/* eslint-disable max-len */
/**
 * Apply 3-D rotation
 * Euler Angles (XYZ):
 *     cosA = cos(Alfa|Roll)
 *     cosB = cos(Beta|Pitch)
 *     cosG = cos(Gamma|Yaw)
 *
 * Composite rotation:
 * |          cosB * cosG             |           cosB * sinG            |    -sinB    |
 * | sinA * sinB * cosG - cosA * sinG | sinA * sinB * sinG + cosA * cosG | sinA * cosB |
 * | cosA * sinB * cosG + sinA * sinG | cosA * sinB * sinG - sinA * cosG | cosA * cosB |
 *
 * Now, Gamma/Yaw is not used (angle=0), so we assume cosG = 1 and sinG = 0, so
 * we get:
 * |     cosB    |   0    |   - sinB    |
 * | sinA * sinB |  cosA  | sinA * cosB |
 * | cosA * sinB | - sinA | cosA * cosB |
 *
 * But in browsers, y is reversed, so we get sinA => -sinA. The general result
 * is:
 * |      cosB     |   0    |    - sinB     |     | x |     | px |
 * | - sinA * sinB |  cosA  | - sinA * cosB |  x  | y |  =  | py |
 * |  cosA * sinB  |  sinA  |  cosA * cosB  |     | z |     | pz |
 *
 * @private
 * @function rotate3D
 */
/* eslint-enable max-len */

/**
 * @private
 * @param {number} x
 *        X coordinate
 * @param {number} y
 *        Y coordinate
 * @param {number} z
 *        Z coordinate
 * @param {Highcharts.Rotation3dObject} angles
 *        Rotation angles
 * @return {Highcharts.Rotation3dObject}
 *         Rotated position
 */
function rotate3D(
    x: number,
    y: number,
    z: number,
    angles: Highcharts.Rotation3dObject
): Highcharts.Position3dObject {
    return {
        x: angles.cosB * x - angles.sinB * z,
        y: -angles.sinA * angles.sinB * x + angles.cosA * y -
            angles.cosB * angles.sinA * z,
        z: angles.cosA * angles.sinB * x + angles.sinA * y +
            angles.cosA * angles.cosB * z
    };
}

/**
 * Perspective3D function is available in global Highcharts scope because is
 * needed also outside of perspective() function (#8042).
 * @private
 * @function Highcharts.perspective3D
 *
 * @param {Highcharts.Position3dObject} coordinate
 * 3D position
 *
 * @param {Highcharts.Position3dObject} origin
 * 3D root position
 *
 * @param {number} distance
 * Perspective distance
 *
 * @return {Highcharts.PositionObject}
 * Perspective 3D Position
 *
 * @requires highcharts-3d
 */
H.perspective3D = function (
    coordinate: Highcharts.Position3dObject,
    origin: Highcharts.Position3dObject,
    distance: number
): Highcharts.PositionObject {
    var projection = ((distance > 0) && (distance < Number.POSITIVE_INFINITY)) ?
        distance / (coordinate.z + origin.z + distance) :
        1;

    return {
        x: coordinate.x * projection,
        y: coordinate.y * projection
    };
};

/**
 * Transforms a given array of points according to the angles in chart.options.
 *
 * @private
 * @function Highcharts.perspective
 *
 * @param {Array<Highcharts.Position3dObject>} points
 * The array of points
 *
 * @param {Highcharts.Chart} chart
 * The chart
 *
 * @param {boolean} [insidePlotArea]
 * Wether to verifiy the points are inside the plotArea
 *
 * @return {Array<Highcharts.Position3dObject>}
 * An array of transformed points
 *
 * @requires highcharts-3d
 */
H.perspective = function (
    points: Array<Highcharts.Position3dObject>,
    chart: Highcharts.Chart,
    insidePlotArea?: boolean
): Array<Highcharts.Position3dObject> {
    var options3d = (chart.options.chart as any).options3d,
        inverted = insidePlotArea ? chart.inverted : false,
        origin = {
            x: chart.plotWidth / 2,
            y: chart.plotHeight / 2,
            z: options3d.depth / 2,
            vd: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0)
        },
        scale = chart.scale3d || 1,
        beta = deg2rad * options3d.beta * (inverted ? -1 : 1),
        alpha = deg2rad * options3d.alpha * (inverted ? -1 : 1),
        angles = {
            cosA: Math.cos(alpha),
            cosB: Math.cos(-beta),
            sinA: Math.sin(alpha),
            sinB: Math.sin(-beta)
        };

    if (!insidePlotArea) {
        origin.x += chart.plotLeft;
        origin.y += chart.plotTop;
    }

    // Transform each point
    return points.map(function (
        point: Highcharts.Position3dObject
    ): Highcharts.Position3dObject {
        var rotated = rotate3D(
                (inverted ? point.y : point.x) - origin.x,
                (inverted ? point.x : point.y) - origin.y,
                (point.z || 0) - origin.z,
                angles
            ),
            // Apply perspective
            coordinate: Highcharts.Position3dObject =
                H.perspective3D(rotated, origin, origin.vd) as any;

        // Apply translation
        coordinate.x = coordinate.x * scale + origin.x;
        coordinate.y = coordinate.y * scale + origin.y;
        coordinate.z = rotated.z * scale + origin.z;

        return {
            x: (inverted ? coordinate.y : coordinate.x),
            y: (inverted ? coordinate.x : coordinate.y),
            z: coordinate.z
        };
    });
};

/**
 * Calculate a distance from camera to points - made for calculating zIndex of
 * scatter points.
 *
 * @private
 * @function Highcharts.pointCameraDistance
 *
 * @param {Highcharts.Dictionary<number>} coordinates
 * Coordinates of the specific point
 *
 * @param {Highcharts.Chart} chart
 * Related chart
 *
 * @return {number}
 * Distance from camera to point
 *
 * @requires highcharts-3d
 */
H.pointCameraDistance = function (
    coordinates: Highcharts.Dictionary<number>,
    chart: Highcharts.Chart
): number {
    var options3d = (chart.options.chart as any).options3d,
        cameraPosition = {
            x: chart.plotWidth / 2,
            y: chart.plotHeight / 2,
            z: pick(options3d.depth, 1) * pick(options3d.viewDistance, 0) +
                options3d.depth
        },
        distance = Math.sqrt(
            Math.pow(cameraPosition.x - coordinates.plotX, 2) +
            Math.pow(cameraPosition.y - coordinates.plotY, 2) +
            Math.pow(cameraPosition.z - coordinates.plotZ, 2)
        );

    return distance;
};

/**
 * Calculate area of a 2D polygon using Shoelace algorithm
 * http://en.wikipedia.org/wiki/Shoelace_formula
 *
 * @private
 * @function Highcharts.shapeArea
 *
 * @param {Array<Highcharts.PositionObject>} vertexes
 * 2D Polygon
 *
 * @return {number}
 * Calculated area
 *
 * @requires highcharts-3d
 */
H.shapeArea = function (vertexes: Array<Highcharts.PositionObject>): number {
    var area = 0,
        i,
        j;

    for (i = 0; i < vertexes.length; i++) {
        j = (i + 1) % vertexes.length;
        area += vertexes[i].x * vertexes[j].y - vertexes[j].x * vertexes[i].y;
    }
    return area / 2;
};

/**
 * Calculate area of a 3D polygon after perspective projection
 *
 * @private
 * @function Highcharts.shapeArea3d
 *
 * @param {Array<Highcharts.Position3dObject>} vertexes
 * 3D Polygon
 *
 * @param {Highcharts.Chart} chart
 * Related chart
 *
 * @param {boolean} [insidePlotArea]
 * Wether to verifiy the points are inside the plotArea
 *
 * @return {number}
 * Calculated area
 *
 * @requires highcharts-3d
 */
H.shapeArea3d = function (
    vertexes: Array<Highcharts.Position3dObject>,
    chart: Highcharts.Chart,
    insidePlotArea?: boolean
): number {
    return H.shapeArea(H.perspective(vertexes, chart, insidePlotArea));
};
