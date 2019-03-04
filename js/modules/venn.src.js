/* *
 * Experimental Highcharts module which enables visualization of a Venn Diagram.
 *
 * (c) 2016-2019 Highsoft AS
 *
 * Authors: Jon Arild Nygard
 *
 * Layout algorithm by Ben Frederickson:
 * https://www.benfrederickson.com/better-venn-diagrams/
 *
 * License: www.highcharts.com/license
 */

'use strict';

import draw from '../mixins/draw-point.js';
import geometry from '../mixins/geometry.js';
import geometryCircles from '../mixins/geometry-circles.js';
import H from '../parts/Globals.js';
import '../parts/Series.js';

var color = H.Color,
    extend = H.extend,
    getAreaOfIntersectionBetweenCircles =
        geometryCircles.getAreaOfIntersectionBetweenCircles,
    getCircleCircleIntersection = geometryCircles.getCircleCircleIntersection,
    getCenterOfPoints = geometry.getCenterOfPoints,
    getDistanceBetweenPoints = geometry.getDistanceBetweenPoints,
    getOverlapBetweenCirclesByDistance =
        geometryCircles.getOverlapBetweenCircles,
    isArray = H.isArray,
    isNumber = H.isNumber,
    isObject = H.isObject,
    isPointInsideAllCircles = geometryCircles.isPointInsideAllCircles,
    isPointOutsideAllCircles = geometryCircles.isPointOutsideAllCircles,
    isString = H.isString,
    merge = H.merge,
    seriesType = H.seriesType;

var objectValues = function objectValues(obj) {
    return Object.keys(obj).map(function (x) {
        return obj[x];
    });
};

/**
 * Calculates the area of overlap between a list of circles.
 * @private
 * @todo add support for calculating overlap between more than 2 circles.
 * @param {Array<object>} circles List of circles with their given positions.
 * @return {number} Returns the area of overlap between all the circles.
 */
var getOverlapBetweenCircles = function getOverlapBetweenCircles(circles) {
    var overlap = 0;

    // When there is only two circles we can find the overlap by using their
    // radiuses and the distance between them.
    if (circles.length === 2) {
        var circle1 = circles[0];
        var circle2 = circles[1];

        overlap = getOverlapBetweenCirclesByDistance(
            circle1.r,
            circle2.r,
            getDistanceBetweenPoints(circle1, circle2)
        );
    }

    return overlap;
};

/**
 * Calculates the difference between the desired overlap and the actual overlap
 * between two circles.
 * @private
 * @param {object} mapOfIdToCircle Map from id to circle.
 * @param {Array<object>} relations List of relations to calculate the loss of.
 * @return {number} Returns the loss between positions of the circles for the
 * given relations.
 */
var loss = function loss(mapOfIdToCircle, relations) {
    var precision = 10e10;

    // Iterate all the relations and calculate their individual loss.
    return relations.reduce(function (totalLoss, relation) {
        var loss = 0;

        if (relation.sets.length > 1) {
            var wantedOverlap = relation.value;
            // Calculate the actual overlap between the sets.
            var actualOverlap = getOverlapBetweenCircles(
                // Get the circles for the given sets.
                relation.sets.map(function (set) {
                    return mapOfIdToCircle[set];
                })
            );

            var diff = wantedOverlap - actualOverlap;

            loss = Math.round((diff * diff) * precision) / precision;
        }

        // Add calculated loss to the sum.
        return totalLoss + loss;
    }, 0);
};

/**
 * Finds the root of a given function. The root is the input value needed for
 * a function to return 0.
 *
 * See https://en.wikipedia.org/wiki/Bisection_method#Algorithm
 *
 * TODO: Add unit tests.
 *
 * @param {function} f The function to find the root of.
 * @param {number} a The lowest number in the search range.
 * @param {number} b The highest number in the search range.
 * @param {number} [tolerance=1e-10] The allowed difference between the returned
 * value and root.
 * @param {number} [maxIterations=100] The maximum iterations allowed.
 */
var bisect = function bisect(f, a, b, tolerance, maxIterations) {
    var fA = f(a),
        fB = f(b),
        nMax = maxIterations || 100,
        tol = tolerance || 1e-10,
        delta = b - a,
        n = 1,
        x, fX;

    if (a >= b) {
        throw new Error('a must be smaller than b.');
    } else if (fA * fB > 0) {
        throw new Error('f(a) and f(b) must have opposite signs.');
    }

    if (fA === 0) {
        x = a;
    } else if (fB === 0) {
        x = b;
    } else {
        while (n++ <= nMax && fX !== 0 && delta > tol) {
            delta = (b - a) / 2;
            x = a + delta;
            fX = f(x);

            // Update low and high for next search interval.
            if (fA * fX > 0) {
                a = x;
            } else {
                b = x;
            }
        }
    }

    return x;
};

/**
 * Uses the bisection method to make a best guess of the ideal distance between
 * two circles too get the desired overlap.
 * Currently there is no known formula to calculate the distance from the area
 * of overlap, which makes the bisection method preferred.
 * @private
 * @param {number} r1 Radius of the first circle.
 * @param {number} r2 Radiues of the second circle.
 * @param {number} overlap The wanted overlap between the two circles.
 * @return {number} Returns the distance needed to get the wanted overlap
 * between the two circles.
 */
var getDistanceBetweenCirclesByOverlap =
function getDistanceBetweenCirclesByOverlap(r1, r2, overlap) {
    var maxDistance = r1 + r2,
        distance = maxDistance;

    if (overlap > 0) {
        distance = bisect(function (x) {
            var actualOverlap = getOverlapBetweenCirclesByDistance(r1, r2, x);

            // Return the differance between wanted and actual overlap.
            return overlap - actualOverlap;
        }, 0, maxDistance);
    }
    return distance;
};

var isSet = function (x) {
    return isArray(x.sets) && x.sets.length === 1;
};

/**
 * Finds an optimal position for a given point.
 * @private
 * @todo add unit tests.
 * @todo add constraints to optimize the algorithm.
 * @param {Function} fn The function to test a point.
 * @param {Array<*>} initial The initial point to optimize.
 * @return {Array<*>} Returns the opimized position of a point.
 */
var nelderMead = function nelderMead(fn, initial) {
    var maxIterations = 100,
        sortByFx = function (a, b) {
            return a.fx - b.fx;
        },
        pRef = 1, // Reflection parameter
        pExp = 2, // Expansion parameter
        pCon = -0.5, // Contraction parameter
        pOCon = pCon * pRef, // Outwards contraction parameter
        pShrink = 0.5; // Shrink parameter

    var weightedSum = function weightedSum(weight1, v1, weight2, v2) {
        return v1.map(function (x, i) {
            return weight1 * x + weight2 * v2[i];
        });
    };

    var getSimplex = function getSimplex(initial) {
        var n = initial.length,
            simplex = new Array(n + 1);

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

    var getCentroid = function (simplex) {
        var arr = simplex.slice(0, -1),
            length = arr.length,
            result = [],
            sum = function (data, point) {
                data.sum += point[data.i];
                return data;
            };

        for (var i = 0; i < length; i++) {
            result[i] = simplex.reduce(sum, { sum: 0, i: i }).sum / length;
        }
        return result;
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

/**
 * Calculates a margin for a point based on the iternal and external circles.
 * The margin describes if the point is well placed within the internal circles,
 * and away from the external
 * @private
 * @todo add unit tests.
 * @param {object} point The point to evaluate.
 * @param {Array<object>} internal The internal circles.
 * @param {Array<object>} external The external circles.
 * @return {number} Returns the margin.
 */
var getMarginFromCircles =
function getMarginFromCircles(point, internal, external) {
    var margin = internal.reduce(function (margin, circle) {
        var m = circle.r - getDistanceBetweenPoints(point, circle);

        return (m <= margin) ? m : margin;
    }, Number.MAX_VALUE);

    margin = external.reduce(function (margin, circle) {
        var m = getDistanceBetweenPoints(point, circle) - circle.r;

        return (m <= margin) ? m : margin;
    }, margin);

    return margin;
};

/**
 * Finds the optimal label position by looking for a position that has a low
 * distance from the internal circles, and as large possible distane to the
 * external circles.
 * @private
 * @todo Optimize the intial position.
 * @todo Add unit tests.
 * @param {Array<object>} internal Internal circles.
 * @param {Array<object>} external External circles.
 * @return {object} Returns the found position.
 */
var getLabelPosition = function getLabelPosition(internal, external) {
    // Get the best label position within the internal circles.
    var best = internal.reduce(function (best, circle) {
        var d = circle.r / 2;

        // Give a set of points with the circle to evaluate as the best label
        // position.
        return [
            { x: circle.x, y: circle.y },
            { x: circle.x + d, y: circle.y },
            { x: circle.x - d, y: circle.y },
            { x: circle.x, y: circle.y + d },
            { x: circle.x, y: circle.y - d }
        ]
        // Iterate the given points and return the one with the largest margin.
            .reduce(function (best, point) {
                var margin = getMarginFromCircles(point, internal, external);

                // If the margin better than the current best, then update best.
                if (best.margin < margin) {
                    best.point = point;
                    best.margin = margin;
                }
                return best;
            }, best);
    }, {
        point: undefined,
        margin: -Number.MAX_VALUE
    }).point;

    // Use nelder mead to optimize the initial label position.
    var optimal = nelderMead(
        function (p) {
            return -(
                getMarginFromCircles({ x: p[0], y: p[1] }, internal, external)
            );
        },
        [best.x, best.y]
    );

    // Update best to be the point which was found to have the best margin.
    best = {
        x: optimal[0],
        y: optimal[1]
    };

    if (!(
        isPointInsideAllCircles(best, internal) &&
        isPointOutsideAllCircles(best, external)
    )) {
        // If point was either outside one of the internal, or inside one of the
        // external, then it was invalid and should use a fallback.
        best = getCenterOfPoints(internal);
    }

    // Return the best point.
    return best;
};

/**
 * Calulates data label positions for a list of relations.
 * @private
 * @todo add unit tests
 * @todo NOTE: may be better suited as a part of the layout function.
 * @param {Array<object>} relations The list of relations.
 * @return {object} Returns a map from id to the data label position.
 */
var getLabelPositions = function getLabelPositions(relations) {
    var singleSets = relations.filter(isSet);

    return relations.reduce(function (map, relation) {
        if (relation.value) {
            var sets = relation.sets,
                id = sets.join(),
                // Create a list of internal and external circles.
                data = singleSets.reduce(function (data, set) {
                    // If the set exists in this relation, then it is internal,
                    // otherwise it will be external.
                    var isInternal = sets.indexOf(set.sets[0]) > -1,
                        property = isInternal ? 'internal' : 'external';

                    // Add the circle to the list.
                    data[property].push(set.circle);
                    return data;
                }, {
                    internal: [],
                    external: []
                });

            // Calulate the label position.
            map[id] = getLabelPosition(
                data.internal,
                data.external
            );
        }
        return map;
    }, {});
};

/**
 * Takes an array of relations and adds the properties `totalOverlap` and
 * `overlapping` to each set. The property `totalOverlap` is the sum of value
 * for each relation where this set is included. The property `overlapping` is
 * a map of how much this set is overlapping another set.
 * NOTE: This algorithm ignores relations consisting of more than 2 sets.
 * @private
 * @param {Array<object>} relations The list of relations that should be sorted.
 * @return {Array<object>} Returns the modified input relations with added
 * properties `totalOverlap` and `overlapping`.
 */
var addOverlapToSets = function addOverlapToSets(relations) {
    // Calculate the amount of overlap per set.
    var mapOfIdToProps = relations
        // Filter out relations consisting of 2 sets.
        .filter(function (relation) {
            return relation.sets.length === 2;
        })
        // Sum up the amount of overlap for each set.
        .reduce(function (map, relation) {
            var sets = relation.sets;

            sets.forEach(function (set, i, arr) {
                if (!isObject(map[set])) {
                    map[set] = {
                        overlapping: {},
                        totalOverlap: 0
                    };
                }
                map[set].totalOverlap += relation.value;
                map[set].overlapping[arr[1 - i]] = relation.value;
            });
            return map;
        }, {});

    relations
        // Filter out single sets
        .filter(isSet)
        // Extend the set with the calculated properties.
        .forEach(function (set) {
            var properties = mapOfIdToProps[set.sets[0]];

            extend(set, properties);
        });

    // Returns the modified relations.
    return relations;
};

/**
 * Takes two sets and finds the one with the largest total overlap.
 * @private
 * @param {object} a The first set to compare.
 * @param {object} b The second set to compare.
 * @return {number} Returns 0 if a and b are equal, <0 if a is greater, >0 if b
 * is greater.
 */
var sortByTotalOverlap = function sortByTotalOverlap(a, b) {
    return b.totalOverlap - a.totalOverlap;
};

/**
 * Uses a greedy approach to position all the sets. Works well with a small
 * number of sets, and are in these cases a good choice aesthetically.
 * @private
 * @param {Array<object>} relations List of the overlap between two or more
 * sets, or the size of a single set.
 * @return {Array<object>} List of circles and their calculated positions.
 */
var layoutGreedyVenn = function layoutGreedyVenn(relations) {
    var positionedSets = [],
        mapOfIdToCircles = {};

    // Define a circle for each set.
    relations
        .filter(function (relation) {
            return relation.sets.length === 1;
        }).forEach(function (relation) {
            mapOfIdToCircles[relation.sets[0]] = relation.circle = {
                x: Number.MAX_VALUE,
                y: Number.MAX_VALUE,
                r: Math.sqrt(relation.value / Math.PI)
            };
        });

    /**
     * Takes a set and updates the position, and add the set to the list of
     * positioned sets.
     * @private
     * @param {object} set The set to add to its final position.
     * @param {object} coordinates The coordinates to position the set at.
     */
    var positionSet = function positionSet(set, coordinates) {
        var circle = set.circle;

        circle.x = coordinates.x;
        circle.y = coordinates.y;
        positionedSets.push(set);
    };

    // Find overlap between sets. Ignore relations with more then 2 sets.
    addOverlapToSets(relations);

    // Sort sets by the sum of their size from large to small.
    var sortedByOverlap = relations
        .filter(isSet)
        .sort(sortByTotalOverlap);

    // Position the most overlapped set at 0,0.
    positionSet(sortedByOverlap.shift(), { x: 0, y: 0 });

    var relationsWithTwoSets = relations.filter(function (x) {
        return x.sets.length === 2;
    });

    // Iterate and position the remaining sets.
    sortedByOverlap.forEach(function (set) {
        var circle = set.circle,
            radius = circle.r,
            overlapping = set.overlapping;

        var bestPosition = positionedSets
            .reduce(function (best, positionedSet, i) {
                var positionedCircle = positionedSet.circle,
                    overlap = overlapping[positionedSet.sets[0]];

                // Calculate the distance between the sets to get the correct
                // overlap
                var distance = getDistanceBetweenCirclesByOverlap(
                    radius,
                    positionedCircle.r,
                    overlap
                );

                // Create a list of possible coordinates calculated from
                // distance.
                var possibleCoordinates = [
                    { x: positionedCircle.x + distance, y: positionedCircle.y },
                    { x: positionedCircle.x - distance, y: positionedCircle.y },
                    { x: positionedCircle.x, y: positionedCircle.y + distance },
                    { x: positionedCircle.x, y: positionedCircle.y - distance }
                ];

                // If there are more circles overlapping, then add the
                // intersection points as possible positions.
                positionedSets.slice(i + 1).forEach(function (positionedSet2) {
                    var positionedCircle2 = positionedSet2.circle,
                        overlap2 = overlapping[positionedSet2.sets[0]],
                        distance2 = getDistanceBetweenCirclesByOverlap(
                            radius,
                            positionedCircle2.r,
                            overlap2
                        );

                    // Add intersections to list of coordinates.
                    possibleCoordinates = possibleCoordinates.concat(
                        getCircleCircleIntersection({
                            x: positionedCircle.x,
                            y: positionedCircle.y,
                            r: distance
                        }, {
                            x: positionedCircle2.x,
                            y: positionedCircle2.y,
                            r: distance2
                        })
                    );
                });

                // Iterate all suggested coordinates and find the best one.
                possibleCoordinates.forEach(function (coordinates) {
                    circle.x = coordinates.x;
                    circle.y = coordinates.y;

                    // Calculate loss for the suggested coordinates.
                    var currentLoss = loss(
                        mapOfIdToCircles, relationsWithTwoSets
                    );

                    // If the loss is better, then use these new coordinates.
                    if (currentLoss < best.loss) {
                        best.loss = currentLoss;
                        best.coordinates = coordinates;
                    }
                });

                // Return resulting coordinates.
                return best;
            }, {
                loss: Number.MAX_VALUE,
                coordinates: undefined
            });

        // Add the set to its final position.
        positionSet(set, bestPosition.coordinates);
    });

    // Return the positions of each set.
    return mapOfIdToCircles;
};

/**
 * Calculates the positions of all the sets in the venn diagram.
 * @private
 * @todo Add support for constrained MDS.
 * @param {Array<object>} relations List of the overlap between two or more sets, or the
 * size of a single set.
 * @return {Arrat<object>} List of circles and their calculated positions.
 */
var layout = function (relations) {
    var mapOfIdToShape = {};

    // Calculate best initial positions by using greedy layout.
    if (relations.length > 0) {
        mapOfIdToShape = layoutGreedyVenn(relations);

        relations
            .filter(function (x) {
                return !isSet(x);
            })
            .forEach(function (relation) {
                var sets = relation.sets,
                    id = sets.join(),
                    circles = sets.map(function (set) {
                        return mapOfIdToShape[set];
                    });

                // Add intersection shape to map
                mapOfIdToShape[id] =
                    getAreaOfIntersectionBetweenCircles(circles);
            });
    }
    return mapOfIdToShape;
};

var isValidRelation = function (x) {
    var map = {};

    return (
        isObject(x) &&
        (isNumber(x.value) && x.value > -1) &&
        (isArray(x.sets) && x.sets.length > 0) &&
        !x.sets.some(function (set) {
            var invalid = false;

            if (!map[set] && isString(set)) {
                map[set] = true;
            } else {
                invalid = true;
            }
            return invalid;
        })
    );
};

var isValidSet = function (x) {
    return (isValidRelation(x) && isSet(x) && x.value > 0);
};

/**
 * Prepares the venn data so that it is usable for the layout function. Filter
 * out sets, or intersections that includes sets, that are missing in the data
 * or has (value < 1). Adds missing relations between sets in the data as
 * value = 0.
 * @private
 * @param {Array<object>} data The raw input data.
 * @return {Array<object>} Returns an array of valid venn data.
 */
var processVennData = function processVennData(data) {
    var d = isArray(data) ? data : [];

    var validSets = d
        .reduce(function (arr, x) {
            // Check if x is a valid set, and that it is not an duplicate.
            if (isValidSet(x) && arr.indexOf(x.sets[0]) === -1) {
                arr.push(x.sets[0]);
            }
            return arr;
        }, [])
        .sort();

    var mapOfIdToRelation = d.reduce(function (mapOfIdToRelation, relation) {
        if (isValidRelation(relation) && !relation.sets.some(function (set) {
            return validSets.indexOf(set) === -1;
        })) {
            mapOfIdToRelation[relation.sets.sort().join()] = relation;
        }
        return mapOfIdToRelation;
    }, {});

    validSets.reduce(function (combinations, set, i, arr) {
        var remaining = arr.slice(i + 1);

        remaining.forEach(function (set2) {
            combinations.push(set + ',' + set2);
        });
        return combinations;
    }, []).forEach(function (combination) {
        if (!mapOfIdToRelation[combination]) {
            var obj = {
                sets: combination.split(','),
                value: 0
            };

            mapOfIdToRelation[combination] = obj;
        }
    });

    // Transform map into array.
    return objectValues(mapOfIdToRelation);
};

/**
 * Calculates the proper scale to fit the cloud inside the plotting area.
 * @private
 * @todo add unit test
 * @param {number} targetWidth  Width of target area.
 * @param {number} targetHeight Height of target area.
 * @param {object} field The playing field.
 * @param {Highcharts.Series} series Series object.
 * @return {object} Returns the value to scale the playing field up to the size
 * of the target area, and center of x and y.
 */
var getScale = function getScale(targetWidth, targetHeight, field) {
    var height = field.bottom - field.top, // top is smaller than bottom
        width = field.right - field.left,
        scaleX = width > 0 ? 1 / width * targetWidth : 1,
        scaleY = height > 0 ? 1 / height * targetHeight : 1,
        adjustX = (field.right + field.left) / 2,
        adjustY = (field.top + field.bottom) / 2,
        scale = Math.min(scaleX, scaleY);

    return {
        scale: scale,
        centerX: targetWidth / 2 - adjustX * scale,
        centerY: targetHeight / 2 - adjustY * scale
    };
};

/**
 * If a circle is outside a give field, then the boundaries of the field is
 * adjusted accordingly. Modifies the field object which is passed as the first
 * parameter.
 * @private
 * @todo NOTE: Copied from wordcloud, can probably be unified.
 * @param {object} field The bounding box of a playing field.
 * @param {object} placement The bounding box for a placed point.
 * @return {object} Returns a modified field object.
 */
var updateFieldBoundaries = function updateFieldBoundaries(field, circle) {
    var left = circle.x - circle.r,
        right = circle.x + circle.r,
        bottom = circle.y + circle.r,
        top = circle.y - circle.r;

    // TODO improve type checking.
    if (!isNumber(field.left) || field.left > left) {
        field.left = left;
    }
    if (!isNumber(field.right) || field.right < right) {
        field.right = right;
    }
    if (!isNumber(field.top) || field.top > top) {
        field.top = top;
    }
    if (!isNumber(field.bottom) || field.bottom < bottom) {
        field.bottom = bottom;
    }
    return field;
};

/**
 * A Venn diagram displays all possible logical relations between a collection
 * of different sets. The sets are represented by circles, and the relation
 * between the sets are displayed by the overlap or lack of overlap between
 * them. The venn diagram is a special case of Euler diagrams, which can also
 * be displayed by this series type.
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @extends      plotOptions.scatter
 * @excluding    connectEnds, connectNulls, cropThreshold, findNearestPointBy,
 *               getExtremesFromAll, jitter, label, linecap, lineWidth,
 *               linkedTo, marker, negativeColor, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointStart, softThreshold,
 *               stacking, steps, threshold, xAxis, yAxis, zoneAxis, zones
 * @product      highcharts
 * @optionparent plotOptions.venn
 */
var vennOptions = {
    borderColor: '${palette.neutralColor20}',
    borderDashStyle: 'solid',
    borderWidth: 1,
    brighten: 0,
    clip: false,
    colorByPoint: true,
    dataLabels: {
        /** @ignore-option */
        enabled: true,
        /** @ignore-option */
        formatter: function () {
            return this.point.name;
        }
    },
    marker: false,
    opacity: 0.75,
    showInLegend: false,
    states: {
        hover: {
            opacity: 1,
            halo: false,
            borderColor: '${palette.neutralColor80}'
        },
        select: {
            color: '${palette.neutralColor20}',
            borderColor: '${palette.neutralColor100}',
            animation: false
        }
    },
    tooltip: {
        pointFormat: '{point.name}: {point.value}'
    }
};

var vennSeries = {
    isCartesian: false,
    axisTypes: [],
    directTouch: true,
    pointArrayMap: ['value'],
    translate: function () {

        var chart = this.chart;

        this.processedXData = this.xData;
        this.generatePoints();

        // Process the data before passing it into the layout function.
        var relations = processVennData(this.options.data);

        // Calculate the positions of each circle.
        var mapOfIdToShape = layout(relations);

        // Calculate positions of each data label
        var mapOfIdToLabelPosition = getLabelPositions(relations);

        // Calculate the scale, and center of the plot area.
        var field = Object.keys(mapOfIdToShape)
                .filter(function (key) {
                    var shape = mapOfIdToShape[key];

                    return shape && isNumber(shape.r);
                })
                .reduce(function (field, key) {
                    return updateFieldBoundaries(field, mapOfIdToShape[key]);
                }, { top: 0, bottom: 0, left: 0, right: 0 }),
            scaling = getScale(chart.plotWidth, chart.plotHeight, field),
            scale = scaling.scale,
            centerX = scaling.centerX,
            centerY = scaling.centerY;

        // Iterate all points and calculate and draw their graphics.
        this.points.forEach(function (point) {
            var sets = isArray(point.sets) ? point.sets : [],
                id = sets.join(),
                shape = mapOfIdToShape[id],
                shapeArgs,
                dataLabelPosition = mapOfIdToLabelPosition[id];

            if (shape) {
                if (shape.r) {
                    shapeArgs = {
                        x: centerX + shape.x * scale,
                        y: centerY + shape.y * scale,
                        r: shape.r * scale
                    };
                } else if (shape.d) {
                    // TODO: find a better way to handle scaling of a path.
                    var d = shape.d.reduce(function (path, arr) {
                        if (arr[0] === 'M') {
                            arr[1] = centerX + arr[1] * scale;
                            arr[2] = centerY + arr[2] * scale;
                        } else if (arr[0] === 'A') {
                            arr[1] = arr[1] * scale;
                            arr[2] = arr[2] * scale;
                            arr[6] = centerX + arr[6] * scale;
                            arr[7] = centerY + arr[7] * scale;
                        }
                        return path.concat(arr);
                    }, [])
                        .join(' ');

                    shapeArgs = {
                        d: d
                    };
                }

                // Scale the position for the data label.
                if (dataLabelPosition) {
                    dataLabelPosition.x = centerX + dataLabelPosition.x * scale;
                    dataLabelPosition.y = centerY + dataLabelPosition.y * scale;
                } else {
                    dataLabelPosition = {};
                }
            }

            point.shapeArgs = shapeArgs;

            // Placement for the data labels
            if (dataLabelPosition && shapeArgs) {
                point.plotX = dataLabelPosition.x;
                point.plotY = dataLabelPosition.y;
            }

            // Set name for usage in tooltip and in data label.
            point.name = point.options.name || sets.join('∩');
        });
    },
    /**
     * Draw the graphics for each point.
     * @private
     */
    drawPoints: function () {
        var series = this,
            // Series properties
            chart = series.chart,
            group = series.group,
            points = series.points || [],
            // Chart properties
            renderer = chart.renderer;

        // Iterate all points and calculate and draw their graphics.
        points.forEach(function (point) {
            var attribs,
                shapeArgs = point.shapeArgs;

            // Add point attribs
            if (!chart.styledMode) {
                attribs = series.pointAttribs(point, point.state);
            }
            // Draw the point graphic.
            point.draw({
                isNew: !point.graphic,
                animatableAttribs: shapeArgs,
                attribs: attribs,
                group: group,
                renderer: renderer,
                shapeType: shapeArgs && shapeArgs.d ? 'path' : 'circle'
            });
        });

    },
    /**
     * Calculates the style attributes for a point. The attributes can vary
     * depending on the state of the point.
     * @private
     * @param {object} point The point which will get the resulting attributes.
     * @param {string} state The state of the point.
     * @return {object} Returns the calculated attributes.
     */
    pointAttribs: function (point, state) {
        var series = this,
            seriesOptions = series.options || {},
            pointOptions = point && point.options || {},
            stateOptions = (state && seriesOptions.states[state]) || {},
            options = merge(
                seriesOptions,
                { color: point && point.color },
                pointOptions,
                stateOptions
            );

        // Return resulting values for the attributes.
        return {
            'fill': color(options.color)
                .setOpacity(options.opacity)
                .brighten(options.brightness)
                .get(),
            'stroke': options.borderColor,
            'stroke-width': options.borderWidth,
            'dashstyle': options.borderDashStyle
        };
    },
    animate: function (init) {
        if (!init) {
            var series = this,
                animOptions = H.animObject(series.options.animation);

            series.points.forEach(function (point) {
                var args = point.shapeArgs;

                if (point.graphic && args) {
                    var attr = {},
                        animate = {};

                    if (args.d) {
                        // If shape is a path, then animate opacity.
                        attr.opacity = 0.001;
                    } else {
                        // If shape is a circle, then animate radius.
                        attr.r = 0;
                        animate.r = args.r;
                    }

                    point.graphic
                        .attr(attr)
                        .animate(animate, animOptions);

                    // If shape is path, then fade it in after the circles
                    // animation
                    if (args.d) {
                        setTimeout(function () {
                            if (point && point.graphic) {
                                point.graphic.animate({
                                    opacity: 1
                                });
                            }
                        }, animOptions.duration);
                    }
                }
            }, series);
            series.animate = null;
        }
    },
    utils: {
        addOverlapToSets: addOverlapToSets,
        geometry: geometry,
        geometryCircles: geometryCircles,
        getDistanceBetweenCirclesByOverlap: getDistanceBetweenCirclesByOverlap,
        layoutGreedyVenn: layoutGreedyVenn,
        loss: loss,
        processVennData: processVennData,
        sortByTotalOverlap: sortByTotalOverlap
    }
};

var vennPoint = {
    draw: draw,
    shouldDraw: function () {
        var point = this;

        // Only draw points with single sets.
        return !!point.shapeArgs;
    },
    isValid: function () {
        return isNumber(this.value);
    }
};

/**
 * A `venn` series. If the [type](#series.venn.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.venn
 * @excluding connectEnds, connectNulls, cropThreshold, dataParser, dataURL,
 *            findNearestPointBy, getExtremesFromAll, label, linecap, lineWidth,
 *            linkedTo, marker, negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking, steps,
 *            threshold, xAxis, yAxis, zoneAxis, zones
 * @product   highcharts
 * @apioption series.venn
 */

/**
 * @type      {Array<*>}
 * @extends   series.scatter.data
 * @excluding marker, x, y
 * @product   highcharts
 * @apioption series.venn.data
 */

/**
 * The name of the point. Used in data labels and tooltip. If name is not
 * defined then it will default to the joined values in
 * [sets](#series.venn.sets).
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @type      {number}
 * @since     7.0.0
 * @product   highcharts
 * @apioption series.venn.data.name
 */

/**
 * The value of the point, resulting in a relative area of the circle, or area
 * of overlap between two sets in the venn or euler diagram.
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @type      {number}
 * @since     7.0.0
 * @product   highcharts
 * @apioption series.venn.data.value
 */

/**
 * The set or sets the options will be applied to. If a single entry is defined,
 * then it will create a new set. If more than one entry is defined, then it
 * will define the overlap between the sets in the array.
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @type      {Array<string>}
 * @since     7.0.0
 * @product   highcharts
 * @apioption series.venn.data.sets
 */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.venn
 *
 * @augments Highcharts.Series
 */
seriesType('venn', 'scatter', vennOptions, vennSeries, vennPoint);
