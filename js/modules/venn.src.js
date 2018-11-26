/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* License: www.highcharts.com/license
*
* This is an experimental Highcharts module which enables visualization
* of a Venn Diagram.
*/
'use strict';
import draw from '../mixins/draw-point.js';
import geometry from '../mixins/geometry.js';
import geometryCircles from '../mixins/geometry-circles.js';
import H from '../parts/Globals.js';
import '../parts/Series.js';
var extend = H.extend,
    getDistanceBetweenPoints = geometry.getDistanceBetweenPoints,
    getOverlapBetweenCirclesByDistance = geometryCircles.getOverlapBetweenCircles,
    isArray = H.isArray,
    isNumber = H.isNumber,
    isObject = H.isObject,
    isString = H.isString,
    keys = H.keys,
    seriesType = H.seriesType,
    Series = H.Series;

var objectValues = function objectValues(obj) {
    return keys(obj).map(function (x) {
        return obj[x];
    });
};

/**
 * Calculates the area of overlap between a list of circles.
 *
 * TODO: add support for calculating overlap between more than 2 circles.
 *
 * @param {array} circles List of circles with their given positions.
 * @returns {number} Returns the area of overlap between all the circles.
 */
var getOverlapBetweenCircles = function getOverlapBetweenCircles(circles) {
    var overlap = 0;

    // When there is only two circles we can find the overlap by using their
    // radiuses and the distance between them.
    if (circles.length === 2) {
        var circle1 = circles[0];
        var circle2 = circles[1];

        overlap = getOverlapBetweenCirclesByDistance(
            circle1.radius,
            circle2.radius,
            getDistanceBetweenPoints(circle1, circle2)
        );
    }

    return overlap;
};

/**
 * Calculates the difference between the desired overlap and the actual overlap
 * between two circles.
 *
 * @param {object} mapOfIdToCircle Map from id to circle.
 * @param {array} relations List of relations to calculate the loss of.
 * @returns {number} Returns the loss between positions of the circles for the
 * given relations.
 */
var loss = function loss(mapOfIdToCircle, relations) {
    // Iterate all the relations and calculate their individual loss.
    return relations.reduce(function (totalLoss, relation) {
        var loss = 0;

        if (relation.sets.length > 1) {
            var wantedOverlap = relation.size;

            // Calculate the actual overlap between the sets.
            var actualOverlap = getOverlapBetweenCircles(
                // Get the circles for the given sets.
                relations.sets.map(function (set) {
                    return mapOfIdToCircle[set];
                })
            );

            var diff = wantedOverlap - actualOverlap;
            loss = diff * diff;
        }

        // Add calculated loss to the sum.
        return totalLoss + loss;
    });
};

/**
 * A binary search function that takes an higher order function to opererate on
 * the values in the array before returning the result to compare with the value
 * that is searched for.
 * Useful to find a value that will give a result that meets some requirement.
 *
 * @param {array} arr The array to search for.
 * @param {*} value The value that is wanted to find.
 * @param {function} fn The higher order function to operate on the values in
 * the array.
 * @returns {number} Returns the index of the matching value, or -1 if the value
 * was not found.
 */
var binarySearch = function binarySearch(arr, value, fn) {
    var start = 0,
        stop = arr.length - 1,
        middle = Math.floor((start + stop) / 2),
        res;

    while ((res = fn(arr[middle], value)) !== value && start < stop) {
        if (value < res) {
            stop = middle - 1;
        } else {
            start = middle + 1;
        }
        middle = Math.floor((start + stop) / 2);
    }

    return res === value ? middle : -1;
};

/**
 * Uses binary search to make a best guess of the ideal distance between two
 * circles too get the desired overlap.
 * Currently there is no known formula to calculate the distance from the area
 * of overlap, which makes the binary search a preferred method.
 *
 * TODO: implement this.
 *
 * @param {Number} r1 Radius of the first circle.
 * @param {Number} r2 Radiues of the second circle.
 * @param {Number} overlap The wanted overlap between the two circles.
 */
var getDistanceBetweenCirclesByOverlap =
function getDistanceBetweenCirclesByOverlap(r1, r2, overlap) {
    return 0;
};

var isSet = function (x) {
    return x.sets.length === 1;
};

/**
 * Takes an array of relations and adds the properties totalOverlap and
 * overlapping to each set.
 * The property totalOverlap is the sum of value for each relation where this
 * set is included.
 * The property overlapping is a map of how much this set is overlapping another
 * set.
 * NOTE: This algorithm ignores relations consisting of more than 2 sets.
 *
 * @param {array} relations The list of relations that should be sorted.
 * @returns {array} Returns the modified input relations with added properties
 * totalOverlap and overlapping.
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
 *
 * @param {object} a The first set to compare.
 * @param {object} b The second set to compare.
 * @returns {number} Returns 0 if a and b are equal, <0 if a is greater, >0 if b
 * is greater.
 */
var sortByTotalOverlap = function sortByTotalOverlap(a, b) {
    return b.totalOverlap - a.totalOverlap;
};

/**
 * Uses a greedy approach to position all the sets. Works well with a small
 * number of sets, and are in these cases a good choice aesthetically.
 *
 * TODO: define circles for each set.
 * TODO: implement positionSet.
 * TODO: find the overlap between sets and sort them.
 *
 * @param {Array} relations List of the overlap between two or more sets, or the
 * size of a single set.
 * @returns List of circles and their calculated positions.
 */
var layoutGreedyVenn = function layoutGreedyVenn(relations) {
    var positionedSets = [];

    // Define a circle for each set.
    relations
        .filter(function (relation) {
            return relation.sets.length === 1;
        }).forEach(function (relation) {
            relation.circle = {
                x: 0,
                y: 0,
                r: Math.sqrt(relation.value / Math.PI)
            };
        });

    /**
     * Takes a set and updates the position, and add the set to the list of
     * positioned sets.
     *
     * @param {object} set The set to add to its final position.
     * @param {object} coordinates The coordinates to position the set at.
     * @returns {undefined} Returns undefined.
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
    positionSet(sortedByOverlap.pop(), { x: 0, y: 0 });

    // Iterate and position the remaining sets.
    sortedByOverlap.forEach(function (set) {
        var radius = set.circle.r,
            overlapping = set.overlapping;

        var bestPosition = positionedSets
        .reduce(function (best, positionedSet) {
            var circle = positionedSet.circle,
                overlap = overlapping[positionedSet.sets[0]];

            // Calculate the distance between the sets to get the correct
            // overlap
            var distance = getDistanceBetweenCirclesByOverlap(
                radius,
                circle.radius,
                overlap
            );

            // Create a list of possible coordinates calculated from distance.
            var possibleCoordinates = [[0, 0]];

            // Iterate all suggested coordinates and find the best one.
            possibleCoordinates.forEach(function (coordinates) {
                // Calculate loss for the suggested coordinates.
                var currentLoss = loss(coordinates);

                // If the loss is better, then use these new coordinates.
                if (currentLoss < best.loss) {
                    best.loss = currentLoss;
                    best.coordinates = coordinates;
                }
            });

            // Return resulting coordinates.
            return best;
        }, {
            loss: Number.MAX_SAFE_INTEGER,
            coordinates: undefined
        });

        // Add the set to its final position.
        positionSet(set, bestPosition.coordinates);
    });

    // Return the positions of each set.
    return positioned;
};

/**
 * Calculates the positions of all the sets in the venn diagram.
 *
 * TODO: Add support for constrained MDS.
 *
 * @param {Array} relations List of the overlap between two or more sets, or the
 * size of a single set.
 * @returns List of circles and their calculated positions.
 */
var layout = function (relations) {
    // Calculate best initial positions by using greedy layout.
    var positions = layoutGreedyVenn(relations);
    return positions;
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
 * Prepares the venn data so that it is usable for the layout function.
 * Filter out sets, or intersections that includes sets, that are missing in the
 * data or has (value < 1).
 * Adds missing relations between sets in the data as value = 0.
 *
 * TODO: implement filtering and addition of missing relations.
 *
 * @param {Array} data The raw input data.
 * @returns {Array} Returns an array of valid venn data.
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

var vennOptions = {
};

var vennSeries = {
    /**
     * Owerwrite bindAxes to modify the axes according to a venn diagram.
     * @returns {undefined}
     */
    bindAxes: function () {
        var series = this,
            axis = {
                min: 0,
                max: 100
            };

        // Call original function to bind the axes.
        Series.prototype.bindAxes.call(this);

        // Extend axes with new values.
        H.extend(series.yAxis.options, axis);
        H.extend(series.xAxis.options, axis);
    },
    /**
     * Draw the graphics for each point.
     * @returns {undefined}
     */
    drawPoints: function () {
        var series = this,
            // Series properties
            chart = series.chart,
            group = series.group,
            points = series.points || [],
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            // Chart properties
            renderer = chart.renderer;

        // Process the data before passing it into the layout function.
        var relations = processVennData(series.options.data);

        // Calculate the positions of each circle.
        var circles = layout(relations);

        // Iterate all points and calculate and draw their graphics.
        // points.forEach(function (point, i) {
        //     var attr = getShapeArgs({
        //             i: i,
        //             xAxis: xAxis,
        //             yAxis: yAxis
        //         }),
        //         css = {
        //             color: point.color
        //         };

        //     // Draw the point graphic.
        //     point.draw({
        //         animate: {},
        //         attr: attr,
        //         css: css,
        //         group: group,
        //         renderer: renderer,
        //         shapeType: 'circle'
        //     });
        // });
    },
    utils: {
        addOverlapToSets: addOverlapToSets,
        binarySearch: binarySearch,
        getDistanceBetweenPoints: getDistanceBetweenPoints,
        getOverlapBetweenCirclesByDistance: getOverlapBetweenCirclesByDistance,
        processVennData: processVennData,
        sortByTotalOverlap: sortByTotalOverlap
    }
};

var vennPoint = {
    draw: draw,
    shouldDraw: function () {
        // var point = this;

        // Draw all points for now.
        return true;
    }
};

seriesType('venn', 'line', vennOptions, vennSeries, vennPoint);
