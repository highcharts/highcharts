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

var geometryCircles = {
    getOverlapBetweenCircles: getOverlapBetweenCircles
};

export default geometryCircles;
