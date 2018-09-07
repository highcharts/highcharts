import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var deg2rad = H.deg2rad,
    find = H.find,
    isArray = H.isArray,
    isNumber = H.isNumber,
    map = H.map,
    reduce = H.reduce;

/**
 * Alternative solution to correctFloat.
 * E.g H.correctFloat(123, 2) returns 120, when it should be 123.
 */
var correctFloat = function (number, precision) {
    var p = isNumber(precision) ? precision : 14,
        magnitude = Math.pow(10, p);
    return Math.round(number * magnitude) / magnitude;
};

/**
 * Calculates the normals to a line between two points.
 * @param {Array} p1 Start point for the line. Array of x and y value.
 * @param {Array} p2 End point for the line. Array of x and y value.
 * @returns {Array} Returns the two normals in an array.
 */
var getNormals = function getNormal(p1, p2) {
    var dx = p2[0] - p1[0], // x2 - x1
        dy = p2[1] - p1[1]; // y2 - y1
    return [
        [-dy, dx],
        [dy, -dx]
    ];
};

/**
 * Calculates the dot product of two coordinates. The result is a scalar value.
 * @param {Array} a The x and y coordinates of the first point.
 * @param {Array} b The x and y coordinates of the second point.
 * @returns {Number} Returns the dot product of a and b.
 */
var dotProduct = function dotProduct(a, b) {
    var ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1];
    return ax * bx + ay * by;
};

/**
 * Projects a polygon onto a coordinate.
 * @param {Array} polygon Array of points in a polygon.
 * @param {Array} target The coordinate of pr
 */
var project = function project(polygon, target) {
    var products = map(polygon, function (point) {
        return dotProduct(point, target);
    });
    return {
        min: Math.min.apply(this, products),
        max: Math.max.apply(this, products)
    };
};

/**
 * Rotates a point clockwise around the origin.
 * @param {Array} point The x and y coordinates for the point.
 * @param {Number} angle The angle of rotation.
 * @returns {Array} The x and y coordinate for the rotated point.
 */
var rotate2DToOrigin = function (point, angle) {
    var x = point[0],
        y = point[1],
        rad = deg2rad * -angle,
        cosAngle = Math.cos(rad),
        sinAngle = Math.sin(rad);
    return [
        correctFloat(x * cosAngle - y * sinAngle),
        correctFloat(x * sinAngle + y * cosAngle)
    ];
};

/**
 * Rotate a point clockwise around another point.
 * @param {Array} point The x and y coordinates for the point.
 * @param {Array} origin The point to rotate around.
 * @param {Number} angle The angle of rotation.
 * @returns {Array} The x and y coordinate for the rotated point.
 */
var rotate2DToPoint = function (point, origin, angle) {
    var x = point[0] - origin[0],
        y = point[1] - origin[1],
        rotated = rotate2DToOrigin([x, y], angle);
    return [
        rotated[0] + origin[0],
        rotated[1] + origin[1]
    ];
};

var isAxesEqual = function (axis1, axis2) {
    return (
        axis1[0] === axis2[0] &&
        axis1[1] === axis2[1]
    );
};

var getAxesFromPolygon = function (polygon) {
    var points,
        axes = polygon.axes;
    if (!isArray(axes)) {
        axes = [];
        points = points = polygon.concat([polygon[0]]);
        reduce(
            points,
            function findAxis(p1, p2) {
                var normals = getNormals(p1, p2),
                    axis = normals[0]; // Use the left normal as axis.

                // Check that the axis is unique.
                if (!find(axes, function (existing) {
                    return isAxesEqual(existing, axis);
                })) {
                    axes.push(axis);
                }

                // Return p2 to be used as p1 in next iteration.
                return p2;
            }
        );
        polygon.axes = axes;
    }
    return axes;
};

var getAxes = function (polygon1, polygon2) {
    // Get the axis from both polygons.
    var axes1 = getAxesFromPolygon(polygon1),
        axes2 = getAxesFromPolygon(polygon2);
    return axes1.concat(axes2);
};

var getPolygon = function (x, y, width, height, rotation) {
    var origin = [x, y],
        left = x - (width / 2),
        right = x + (width / 2),
        top = y - (height / 2),
        bottom = y + (height / 2),
        polygon = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom]
        ];
    return map(polygon, function (point) {
        return rotate2DToPoint(point, origin, -rotation);
    });
};

var getBoundingBoxFromPolygon = function (points) {
    return reduce(points, function (obj, point) {
        var x = point[0],
            y = point[1];
        obj.left = Math.min(x, obj.left);
        obj.right = Math.max(x, obj.right);
        obj.bottom = Math.max(y, obj.bottom);
        obj.top = Math.min(y, obj.top);
        return obj;
    }, {
        left: Number.MAX_VALUE,
        right: -Number.MAX_VALUE,
        bottom: -Number.MAX_VALUE,
        top: Number.MAX_VALUE
    });
};

var isPolygonsOverlappingOnAxis = function (axis, polygon1, polygon2) {
    var projection1 = project(polygon1, axis),
        projection2 = project(polygon2, axis),
        isOverlapping = !(
            projection2.min > projection1.max ||
            projection2.max < projection1.min
        );
    return !isOverlapping;
};

/**
 * Checks wether two convex polygons are colliding by using the Separating Axis
 * Theorem.
 * @param {Array} polygon1 First polygon.
 * @param {Array} polygon2 Second polygon.
 * @returns {boolean} Returns true if they are colliding, otherwise false.
 */
var isPolygonsColliding = function isPolygonsColliding(polygon1, polygon2) {
    var axes = getAxes(polygon1, polygon2),
        overlappingOnAllAxes = !find(axes, function (axis) {
            return isPolygonsOverlappingOnAxis(axis, polygon1, polygon2);
        });
    return overlappingOnAllAxes;
};

var movePolygon = function (deltaX, deltaY, polygon) {
    return map(polygon, function (point) {
        return [
            point[0] + deltaX,
            point[1] + deltaY
        ];
    });
};

var collision = {
    getBoundingBoxFromPolygon: getBoundingBoxFromPolygon,
    getPolygon: getPolygon,
    isPolygonsColliding: isPolygonsColliding,
    movePolygon: movePolygon,
    rotate2DToOrigin: rotate2DToOrigin,
    rotate2DToPoint: rotate2DToPoint
};

export default collision;
