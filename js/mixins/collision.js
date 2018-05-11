import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var find = H.find,
    reduce = H.reduce;
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
    return reduce(
        polygon,
        function (result, point) {
            var product = dotProduct(point, target);
            result.min = Math.min(result.min, product);
            result.max = Math.max(result.max, product);
            return result;
        },
        {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        }
    );
};

/**
 * Checks wether two convex polygons are colliding by using the Separating Axis
 * Theorem.
 * @param {Array} polygon1 First polygon.
 * @param {Array} polygon2 Second polygon.
 * @returns {boolean} Returns true if they are colliding, otherwise false.
 */
var isPolygonsColliding = function isPolygonsColliding(polygon1, polygon2) {
    var getAxes = function (polygon1, polygon2) {
            var existingAxes = {};

            // Get the axis from both polygons.
            return [polygon1, polygon2].reduce(function (axes, polygon) {
                var points = polygon.concat([polygon[0]]);
                points.reduce(function (p1, p2) {
                    var normals = getNormals(p1, p2),
                        axis = normals[0], // Use the left normal as axis.
                        key = axis.toString();

                    // Check that the axis is unique.
                    if (!existingAxes[key]) {
                        existingAxes[key] = true;
                        axes.push(normals[0]);
                    }

                    // Return p2 to be used as p1 in next iteration.
                    return p2;
                });
                return axes;
            }, []);
        },
        axes = getAxes(polygon1, polygon2),
        overlappingOnAllAxes = !find(axes, function (axis) {
            var projection1 = project(polygon1, axis),
                projection2 = project(polygon2, axis),
                isOverlapping = !(
                    projection2.min > projection1.max ||
                    projection2.max < projection1.min
                );
            return !isOverlapping;
        });
    return overlappingOnAllAxes;
};

var collision = {
    isPolygonsColliding: isPolygonsColliding
};

export default collision;
