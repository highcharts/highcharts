/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface NelderMearMixin {
            getCentroid(simplex: Array<NelderMearPointArray>): Array<number>;
            nelderMead(
                fn: NelderMearTestFunction,
                initial: NelderMearPointArray
            ): NelderMearPointArray;
        }
        interface NelderMearPointArray extends Array<number> {
            fx: number;
        }
        interface NelderMearTestFunction {
            (point: NelderMearPointArray): number;
        }
    }
}
/** @private */
declare interface NelderMearCentroidObject {
    i: number;
    sum: number;
}

/* eslint-disable valid-jsdoc */

var getCentroid = function (
    simplex: Array<Highcharts.NelderMearPointArray>
): Array<number> {
    var arr = simplex.slice(0, -1),
        length = arr.length,
        result = [] as Array<number>,
        sum = function (
            data: NelderMearCentroidObject,
            point: Array<number>
        ): NelderMearCentroidObject {
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
 * @param {Highcharts.NelderMearTestFunction} fn
 *        The function to test a point.
 * @param {Highcharts.NelderMearPointArray} initial
 *        The initial point to optimize.
 * @return {Highcharts.NelderMearPointArray}
 *         Returns the opimized position of a point.
 */
var nelderMead = function nelderMead(
    fn: Highcharts.NelderMearTestFunction,
    initial: Highcharts.NelderMearPointArray
): Highcharts.NelderMearPointArray {
    var maxIterations = 100,
        sortByFx = function (
            a: Highcharts.NelderMearPointArray,
            b: Highcharts.NelderMearPointArray
        ): number {
            return a.fx - b.fx;
        },
        pRef = 1, // Reflection parameter
        pExp = 2, // Expansion parameter
        pCon = -0.5, // Contraction parameter
        pOCon = pCon * pRef, // Outwards contraction parameter
        pShrink = 0.5; // Shrink parameter

    /**
     * @private
     */
    var weightedSum = function weightedSum(
        weight1: number,
        v1: Array<number>,
        weight2: number,
        v2: Array<number>
    ): Array<number> {
        return v1.map(function (x: number, i: number): number {
            return weight1 * x + weight2 * v2[i];
        });
    };

    /**
     * @private
     */
    var getSimplex = function getSimplex(
        initial: Highcharts.NelderMearPointArray
    ): Array<Highcharts.NelderMearPointArray> {
        var n = initial.length,
            simplex: Array<Highcharts.NelderMearPointArray> =
                new Array(n + 1);

        // Initial point to the simplex.
        simplex[0] = initial;
        simplex[0].fx = fn(initial);

        // Create a set of extra points based on the initial.
        for (var i = 0; i < n; ++i) {
            var point = initial.slice() as Highcharts.NelderMearPointArray;

            point[i] = point[i] ? point[i] * 1.05 : 0.001;
            point.fx = fn(point);
            simplex[i + 1] = point;
        }
        return simplex;
    };

    var updateSimplex = function (
        simplex: Array<Highcharts.NelderMearPointArray>,
        point: Highcharts.NelderMearPointArray
    ): Array<Highcharts.NelderMearPointArray> {
        point.fx = fn(point);
        simplex[simplex.length - 1] = point;
        return simplex;
    };

    var shrinkSimplex = function (
        simplex: Array<Highcharts.NelderMearPointArray>
    ): Array<Highcharts.NelderMearPointArray> {
        var best = simplex[0];

        return simplex.map(function (
            point: Highcharts.NelderMearPointArray
        ): Highcharts.NelderMearPointArray {
            var p = weightedSum(1 - pShrink, best, pShrink, point) as (
                Highcharts.NelderMearPointArray
            );

            p.fx = fn(p);
            return p;
        });
    };

    var getPoint = function (
        centroid: Array<number>,
        worst: Array<number>,
        a: number,
        b: number
    ): Highcharts.NelderMearPointArray {
        var point = weightedSum(a, centroid, b, worst) as (
            Highcharts.NelderMearPointArray
        );

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

            simplex = updateSimplex(
                simplex,
                (expanded.fx < reflected.fx) ? expanded : reflected
            );
        } else if (reflected.fx >= simplex[simplex.length - 2].fx) {
            // If the reflected point is worse than the second worse, then
            // contract.
            var contracted;

            if (reflected.fx > worst.fx) {
                // If the reflected is worse than the worst point, do a
                // contraction
                contracted = getPoint(centroid, worst, 1 + pCon, -pCon);
                if (contracted.fx < worst.fx) {
                    simplex = updateSimplex(simplex, contracted);
                } else {
                    simplex = shrinkSimplex(simplex);
                }
            } else {
                // Otherwise do an outwards contraction
                contracted = getPoint(centroid, worst, 1 - pOCon, pOCon);
                if (contracted.fx < reflected.fx) {
                    simplex = updateSimplex(simplex, contracted);
                } else {
                    simplex = shrinkSimplex(simplex);
                }
            }
        } else {
            simplex = updateSimplex(simplex, reflected);
        }
    }

    return simplex[0];
};

var content: Highcharts.NelderMearMixin = {
    getCentroid: getCentroid,
    nelderMead: nelderMead
};

export default content;
