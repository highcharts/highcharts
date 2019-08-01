/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/* eslint-disable valid-jsdoc */
var getCentroid = function (simplex) {
    var arr = simplex.slice(0, -1), length = arr.length, result = [], sum = function (data, point) {
        data.sum += point[data.i];
        return data;
    };
    for (var i = 0; i < length; i++) {
        result[i] = arr.reduce(sum, { sum: 0, i: i }).sum / length;
    }
    return result;
};
/**
 * Finds an optimal position for a given point.
 * @todo add unit tests.
 * @todo add constraints to optimize the algorithm.
 * @private
 * @param {Highcharts.NelderMeadTestFunction} fn
 *        The function to test a point.
 * @param {Highcharts.NelderMeadPointArray} initial
 *        The initial point to optimize.
 * @return {Highcharts.NelderMeadPointArray}
 *         Returns the opimized position of a point.
 */
var nelderMead = function nelderMead(fn, initial) {
    var maxIterations = 100, sortByFx = function (a, b) {
        return a.fx - b.fx;
    }, pRef = 1, // Reflection parameter
    pExp = 2, // Expansion parameter
    pCon = -0.5, // Contraction parameter
    pOCon = pCon * pRef, // Outwards contraction parameter
    pShrink = 0.5; // Shrink parameter
    /**
     * @private
     */
    var weightedSum = function weightedSum(weight1, v1, weight2, v2) {
        return v1.map(function (x, i) {
            return weight1 * x + weight2 * v2[i];
        });
    };
    /**
     * @private
     */
    var getSimplex = function getSimplex(initial) {
        var n = initial.length, simplex = new Array(n + 1);
        // Initial point to the simplex.
        simplex[0] = initial;
        simplex[0].fx = fn(initial);
        // Create a set of extra points based on the initial.
        for (var i = 0; i < n; ++i) {
            var point = initial.slice();
            point[i] = point[i] ? point[i] * 1.05 : 0.001;
            point.fx = fn(point);
            simplex[i + 1] = point;
        }
        return simplex;
    };
    var updateSimplex = function (simplex, point) {
        point.fx = fn(point);
        simplex[simplex.length - 1] = point;
        return simplex;
    };
    var shrinkSimplex = function (simplex) {
        var best = simplex[0];
        return simplex.map(function (point) {
            var p = weightedSum(1 - pShrink, best, pShrink, point);
            p.fx = fn(p);
            return p;
        });
    };
    var getPoint = function (centroid, worst, a, b) {
        var point = weightedSum(a, centroid, b, worst);
        point.fx = fn(point);
        return point;
    };
    // Create a simplex
    var simplex = getSimplex(initial);
    // Iterate from 0 to max iterations
    for (var i = 0; i < maxIterations; i++) {
        // Sort the simplex
        simplex.sort(sortByFx);
        // Create a centroid from the simplex
        var worst = simplex[simplex.length - 1];
        var centroid = getCentroid(simplex);
        // Calculate the reflected point.
        var reflected = getPoint(centroid, worst, 1 + pRef, -pRef);
        if (reflected.fx < simplex[0].fx) {
            // If reflected point is the best, then possibly expand.
            var expanded = getPoint(centroid, worst, 1 + pExp, -pExp);
            simplex = updateSimplex(simplex, (expanded.fx < reflected.fx) ? expanded : reflected);
        }
        else if (reflected.fx >= simplex[simplex.length - 2].fx) {
            // If the reflected point is worse than the second worse, then
            // contract.
            var contracted;
            if (reflected.fx > worst.fx) {
                // If the reflected is worse than the worst point, do a
                // contraction
                contracted = getPoint(centroid, worst, 1 + pCon, -pCon);
                if (contracted.fx < worst.fx) {
                    simplex = updateSimplex(simplex, contracted);
                }
                else {
                    simplex = shrinkSimplex(simplex);
                }
            }
            else {
                // Otherwise do an outwards contraction
                contracted = getPoint(centroid, worst, 1 - pOCon, pOCon);
                if (contracted.fx < reflected.fx) {
                    simplex = updateSimplex(simplex, contracted);
                }
                else {
                    simplex = shrinkSimplex(simplex);
                }
            }
        }
        else {
            simplex = updateSimplex(simplex, reflected);
        }
    }
    return simplex[0];
};
var content = {
    getCentroid: getCentroid,
    nelderMead: nelderMead
};
export default content;
