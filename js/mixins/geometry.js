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

var geometry = {
    getDistanceBetweenPoints: getDistanceBetweenPoints
};

export default geometry;
