/**
 * Calculates the center between a list of points.
 *
 * @param {array} points A list of points to calculate the center of.
 */
var getCenterOfPoints = function getCenterOfPoints(points) {
    var sum = points.reduce(function (sum, point) {
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
 *
 * @param {object} p1 The x and y coordinates of the first point.
 * @param {object} p2 The x and y coordinates of the second point.
 * @returns {number} Returns the distance between the points.
 */
var getDistanceBetweenPoints = function getDistanceBetweenPoints(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculates the angle between two points.
 *
 * TODO: add unit tests.
 *
 * @param {object} p1 The first point.
 * @param {object} p2 The second point.
 * @returns {number} Returns the angle in radians.
 */
var getAngleBetweenPoints = function getAngleBetweenPoints(p1, p2) {
    return Math.atan2(p2.x - p1.x, p2.y - p1.y);
};

var geometry = {
    getAngleBetweenPoints: getAngleBetweenPoints,
    getCenterOfPoints: getCenterOfPoints,
    getDistanceBetweenPoints: getDistanceBetweenPoints
};

export default geometry;
