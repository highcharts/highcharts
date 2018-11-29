/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* Layout algorithm by Ben Frederickson:
* https://www.benfrederickson.com/better-venn-diagrams/
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
var color = H.Color,
    extend = H.extend,
    getDistanceBetweenPoints = geometry.getDistanceBetweenPoints,
    getOverlapBetweenCirclesByDistance =
        geometryCircles.getOverlapBetweenCircles,
    isArray = H.isArray,
    isBoolean = function (x) {
        return typeof x === 'boolean';
    },
    isNumber = H.isNumber,
    isObject = H.isObject,
    isString = H.isString,
    keys = H.keys,
    merge = H.merge,
    noop = H.noop,
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
 *
 * @param {object} mapOfIdToCircle Map from id to circle.
 * @param {array} relations List of relations to calculate the loss of.
 * @returns {number} Returns the loss between positions of the circles for the
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
 * Creates a list that contains a sequence of numbers ranging from start to end.
 *
 * TODO: add unit tests.
 *
 * @param {number} start The smallest number in the list.
 * @param {number} end The largest number in the list.
 * @param {number} [step=1] The increment between the values in the sequence.
 * @returns {array} Returns the sequence of numbers in the range from start to
 * end.
 */
var range = function range(start, end, step) {
    var s = step || 1,
        length = Math.round((start + end) / s),
        range = Array.apply(0, Array(length)).map(function (_, i) {
            return i * s;
        });
    return range;
};

/**
 * Uses binary search to make a best guess of the ideal distance between two
 * circles too get the desired overlap.
 * Currently there is no known formula to calculate the distance from the area
 * of overlap, which makes the binary search a preferred method.
 *
 * @param {number} r1 Radius of the first circle.
 * @param {number} r2 Radiues of the second circle.
 * @param {number} overlap The wanted overlap between the two circles.
 * @returns {number} Returns the distance needed to get the wanted overlap
 * between the two circles.
 */
var getDistanceBetweenCirclesByOverlap =
function getDistanceBetweenCirclesByOverlap(r1, r2, overlap) {
    var error = 0.01,
        maxDistance = r1 + r2,
        list = range(0, maxDistance, 0.001),
        index = binarySearch(list, 0, function (x) {
            var actualOverlap = getOverlapBetweenCirclesByDistance(r1, r2, x),
                diff = overlap - actualOverlap;

            // If the difference is below accepted error then return overlap to
            // confirm we have found the right value.
            return (Math.abs(diff) < error) ? 0 : diff;
        });

    // Round the resulting value to have two decimals.
    return Math.round(list[index] * 100) / 100;
};

var isSet = function (x) {
    return isArray(x.sets) && x.sets.length === 1;
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
 * @param {Array} relations List of the overlap between two or more sets, or the
 * size of a single set.
 * @returns List of circles and their calculated positions.
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

    var relationsWithTwoSets = relations.filter(function (x) {
        return x.sets.length === 2;
    });

    // Iterate and position the remaining sets.
    sortedByOverlap.forEach(function (set) {
        var circle = set.circle,
            radius = circle.r,
            overlapping = set.overlapping;

        var bestPosition = positionedSets
        .reduce(function (best, positionedSet) {
            var positionedCircle = positionedSet.circle,
                overlap = overlapping[positionedSet.sets[0]];

            // Calculate the distance between the sets to get the correct
            // overlap
            var distance = getDistanceBetweenCirclesByOverlap(
                radius,
                positionedCircle.r,
                overlap
            );

            // Create a list of possible coordinates calculated from distance.
            var possibleCoordinates = [
                { x: positionedCircle.x + distance, y: positionedCircle.y },
                { x: positionedCircle.x - distance, y: positionedCircle.y },
                { x: positionedCircle.x, y: positionedCircle.y + distance },
                { x: positionedCircle.x, y: positionedCircle.y - distance }
            ];

            // Iterate all suggested coordinates and find the best one.
            possibleCoordinates.forEach(function (coordinates) {
                circle.x = coordinates.x;
                circle.y = coordinates.y;

                // Calculate loss for the suggested coordinates.
                var currentLoss = loss(mapOfIdToCircles, relationsWithTwoSets);

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
    return mapOfIdToCircles;
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
    var mapOfIdToShape = {};

    // Calculate best initial positions by using greedy layout.
    if (relations.length > 0) {
        mapOfIdToShape = layoutGreedyVenn(relations);
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
 * Prepares the venn data so that it is usable for the layout function.
 * Filter out sets, or intersections that includes sets, that are missing in the
 * data or has (value < 1).
 * Adds missing relations between sets in the data as value = 0.
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

/**
 * getScale - Calculates the proper scale to fit the cloud inside the plotting
 *            area.
 *
 * NOTE: copied from wordcloud.
 *
 * @param  {number} targetWidth  Width of target area.
 * @param  {number} targetHeight Height of target area.
 * @param  {object} field The playing field.
 * @param  {Series} series Series object.
 * @return {number} Returns the value to scale the playing field up to the size
 *     of the target area.
 */
var getScale = function getScale(targetWidth, targetHeight, field) {
    var height = Math.max(Math.abs(field.top), Math.abs(field.bottom)) * 2,
        width = Math.max(Math.abs(field.left), Math.abs(field.right)) * 2,
        scaleX = width > 0 ? 1 / width * targetWidth : 1,
        scaleY = height > 0 ? 1 / height * targetHeight : 1;
    return Math.min(scaleX, scaleY);
};

/**
 * updateFieldBoundaries - If a circle is outside a give field, then the
 * boundaries of the field is adjusted accordingly. Modifies the field object
 * which is passed as the first parameter.
 *
 * NOTE: Copied from wordcloud, can probably be unified.
 *
 * @param  {object} field The bounding box of a playing field.
 * @param  {object} placement The bounding box for a placed point.
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

var getDlOptions = function getDlOptions(params) {
    // Set options to new object to avoid problems with scope
    var optionsPoint = (
            isObject(params.optionsPoint) ?
            params.optionsPoint.dataLabels :
            {}
        ),
        optionsSeries = (
            isObject(params.optionsSeries) ?
            params.optionsSeries.dataLabels :
            {}
        ),
        options = merge({
            style: {}
        }, optionsSeries, optionsPoint);
    return options;
};

var vennOptions = {
    borderColor: '${palette.neutralColor20}',
    borderDashStyle: 'solid',
    borderWidth: 1,
    brighten: 0,
    clip: false,
    colorByPoint: true,
    dataLabels: {
        enabled: true,
        formatter: function () {
            return this.point.name;
        }
    },
    marker: false,
    opacity: 0.75,
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
    /**
     * Owerwrite bindAxes to modify the axes according to a venn diagram.
     * @returns {undefined}
     */
    bindAxes: function () {
        var axis = {
            endOnTick: false,
            gridLineWidth: 0,
            lineWidth: 0,
            maxPadding: 0,
            startOnTick: false,
            title: null,
            tickPositions: []
        };

        Series.prototype.bindAxes.call(this);
        extend(this.yAxis.options, axis);
        extend(this.xAxis.options, axis);
    },
    directTouch: true,
    // Datalabels are drawn at the end of drawPoints.
    drawDataLabels: noop,
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

        // Add necessary properties for the data labels hack.
        // TODO: draw labels in the loop where the point graphic is drawn.
        var optionsChart = chart && chart.options && chart.options.chart || {},
            hasRendered = series.hasRendered,
            animation = (
                isBoolean(optionsChart.animation) ?
                optionsChart.animation :
                true
            ),
            animateLabels,
            animateLabelsCalled = false,
            addedHack = false,
            hackDataLabelAnimation = !!(
                animation &&
                hasRendered &&
                series.dataLabelsGroup
            );

        if (hackDataLabelAnimation) {
            series.dataLabelsGroup.attr({ opacity: 0 });
            animateLabels = function () {
                var s = series;
                animateLabelsCalled = true;
                if (s.dataLabelsGroup) {
                    s.dataLabelsGroup.animate({
                        opacity: 1,
                        visibility: 'visible'
                    });
                }
            };
        }

        // Process the data before passing it into the layout function.
        var relations = processVennData(series.options.data);

        // Calculate the positions of each circle.
        var circles = layout(relations);

        // Calculate the scale, and center of the plot area.
        var field = Object.keys(circles).reduce(function (field, key) {
                return updateFieldBoundaries(field, circles[key]);
            }, { top: 0, bottom: 0, left: 0, right: 0 }),
            scale = getScale(xAxis.len, yAxis.len, field),
            centerX = xAxis.len / 2,
            centerY = yAxis.len / 2;

        // Iterate all points and calculate and draw their graphics.
        points.forEach(function (point) {
            var sets = isArray(point.sets) ? point.sets : [],
                shape = circles[sets.join()],
                attr = !shape ? {} : {
                    x: centerX + shape.x * scale,
                    y: centerY + shape.y * scale,
                    r: shape.r * scale
                };

            point.shapeArgs = attr;

            // Add point attribs
            if (!chart.styledMode) {
                extend(attr, series.pointAttribs(point, point.state));
            }

            // Draw the point graphic.
            point.draw({
                attr: attr,
                css: {},
                group: group,
                renderer: renderer,
                shapeType: 'circle'
            });

            // Set a lot of options to have the data labels logic work.
            point.isNull = !point.graphic;
            point.plotX = attr.x;
            point.plotY = attr.y;
            point.dlOptions = getDlOptions({
                optionsPoint: point.options,
                optionsSeries: series.options
            });

            // Set name for usage in tooltip and in data label.
            point.name = sets.join('∩');
        });

        // Draw data labels after points
        // TODO draw labels one by one to avoid addtional looping
        if (hackDataLabelAnimation && addedHack) {
            series.hasRendered = false;
            series.options.dataLabels.defer = true;
            Series.prototype.drawDataLabels.call(series);
            series.hasRendered = true;
            // If animateLabels is called before labels were hidden, then call
            // it again.
            if (animateLabelsCalled) {
                animateLabels();
            }
        } else {
            Series.prototype.drawDataLabels.call(series);
        }
    },
    /**
     * Calculates the style attributes for a point. The attributes can vary
     * depending on the state of the point.
     *
     * @param {object} point The point which will get the resulting attributes.
     * @param {string} state The state of the point.
     * @returns {object} Returns the calculated attributes.
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
            this.points.forEach(function (point) {
                if (point.graphic && point.shapeArgs) {
                    point.graphic
                        .attr({
                            r: 0
                        })
                        .animate({
                            r: point.shapeArgs.r
                        }, H.animObject(this.options.animation));
                }
            }, this);
            this.animate = null;
        }
    },

    utils: {
        addOverlapToSets: addOverlapToSets,
        binarySearch: binarySearch,
        getDistanceBetweenPoints: getDistanceBetweenPoints,
        getDistanceBetweenCirclesByOverlap: getDistanceBetweenCirclesByOverlap,
        getOverlapBetweenCirclesByDistance: getOverlapBetweenCirclesByDistance,
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
        return isSet(point);
    },
    isValid: function () {
        return isNumber(this.value);
    }
};

seriesType('venn', 'scatter', vennOptions, vennSeries, vennPoint);
