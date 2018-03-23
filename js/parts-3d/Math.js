/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
/**
 *    Mathematical Functionility
 */
var deg2rad = H.deg2rad,
    pick = H.pick;

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
 */
/* eslint-enable max-len */
function rotate3D(x, y, z, angles) {
    return {
        x: angles.cosB * x - angles.sinB * z,
        y: -angles.sinA * angles.sinB * x + angles.cosA * y -
            angles.cosB * angles.sinA * z,
        z: angles.cosA * angles.sinB * x + angles.sinA * y +
            angles.cosA * angles.cosB * z
    };
}

function perspective3D(coordinate, origin, distance) {
    var projection = ((distance > 0) && (distance < Number.POSITIVE_INFINITY)) ?
        distance / (coordinate.z + origin.z + distance) :
        1;
    return {
        x: coordinate.x * projection,
        y: coordinate.y * projection
    };
}

/**
 * Transforms a given array of points according to the angles in chart.options.
 * Parameters:
 *        - points: the array of points
 *        - chart: the chart
 *        - insidePlotArea: wether to verifiy the points are inside the plotArea
 * Returns:
 *        - an array of transformed points
 */
H.perspective = function (points, chart, insidePlotArea) {
    var options3d = chart.options.chart.options3d,
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
    return H.map(points, function (point) {
        var rotated = rotate3D(
                (inverted ? point.y : point.x) - origin.x,
                (inverted ? point.x : point.y) - origin.y,
                (point.z || 0) - origin.z,
                angles
            ),
            // Apply perspective
            coordinate = perspective3D(rotated, origin, origin.vd);

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
 * Parameters:
 *        - coordinates: The coordinates of the specific point
 *        - chart: the chart
 * Returns:
 *        - a distance from camera to point
 */
H.pointCameraDistance = function (coordinates, chart) {
    var options3d = chart.options.chart.options3d,
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
 */
H.shapeArea = function (vertexes) {
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
 */
H.shapeArea3d = function (vertexes, chart, insidePlotArea) {
    return H.shapeArea(H.perspective(vertexes, chart, insidePlotArea));
};

