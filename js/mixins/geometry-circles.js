import geometry from './geometry.js';
var getDistanceBetweenPoints = geometry.getDistanceBetweenPoints;

var round = function round(x, decimals) {
    var a = Math.pow(10, decimals);
    return Math.round(x * a) / a;
};

/**
 * Calculates the area of overlap between two circles based on their radiuses
 * and the distance between them.
 * See http://mathworld.wolfram.com/Circle-CircleIntersection.html
 *
 * @param {number} r1 Radius of the first circle.
 * @param {number} r2 Radius of the second circle.
 * @param {number} d The distance between the two circles.
 * @returns {number} Returns the area of overlap between the two circles.
 */
var getOverlapBetweenCircles =
function getOverlapBetweenCircles(r1, r2, d) {
    var overlap = 0;

    // If the distance is larger than the sum of the radiuses then the circles
    // does not overlap.
    if (d < r1 + r2) {
        var r1Square = r1 * r1,
            r2Square = r2 * r2;

        if (d < Math.abs(r2 - r1)) {
            // If the circles are completely overlapping, then the overlap
            // equals the area of the smallest circle.
            overlap = Math.PI * Math.min(r1Square, r2Square);
        } else {
                // d^2 - r^2 + R^2 / 2d
            var x = (r1Square - r2Square + d * d) / (2 * d),
                // y^2 = R^2 - x^2
                y = Math.sqrt(r1Square - x * x);

            overlap = (
                r1Square * Math.asin(y / r1) +
                r2Square * Math.asin(y / r2) -
                y * (x + Math.sqrt(x * x + r2Square - r1Square))
            );
        }
        // Round the result to two decimals.
        overlap = Math.floor(overlap * 100) / 100;
    }
    return overlap;
};

/**
 * Calculates the intersection points of two circles.
 *
 * NOTE: does not handle floating errors well.
 *
 * @param {object} c1 The first circle.s
 * @param {object} c2 The second sircle.
 * @returns {array} Returns the resulting intersection points.
 */
var getCircleCircleIntersection =
function getCircleCircleIntersection(c1, c2) {
    var d = getDistanceBetweenPoints(c1, c2),
        r1 = c1.r,
        r2 = c2.r,
        points = [];

    if (d < r1 + r2 && d > Math.abs(r1 - r2)) {
        // If the circles are overlapping, but not completely overlapping, then
        // it exists intersecting points.
        var r1Square = r1 * r1,
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
            y0 = y1 + y * (y2 - y1) / d,
            rx = -(y2 - y1) * (y / d),
            ry = -(x2 - x1) * (y / d);

        points = [
            { x: round(x0 + rx, 3), y: round(y0 - ry, 3) },
            { x: round(x0 - rx, 3), y: round(y0 + ry, 3) }
        ];
    }
    return points;
};

/**
 * Calculates all the intersection points for between a list of circles.
 *
 * @param {array} circles The circles to calculate the points from.
 * @returns {array} Returns a list of intersection points.
 */
var getCirclesIntersectionPoints = function getIntersectionPoints(circles) {
    return circles.reduce(function (points, c1, i, arr) {
        var additional = arr.slice(i + 1)
            .reduce(function (points, c2) {
                return points.concat(getCircleCircleIntersection(c1, c2));
            }, []);
        return points.concat(additional);
    }, []);
};

var geometryCircles = {
    getCircleCircleIntersection: getCircleCircleIntersection,
    getCirclesIntersectionPoints: getCirclesIntersectionPoints,
    getOverlapBetweenCircles: getOverlapBetweenCircles
};

export default geometryCircles;
