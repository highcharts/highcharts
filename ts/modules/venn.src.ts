/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2019 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class VennPoint extends ScatterPoint implements DrawPoint {
            public draw: typeof draw;
            public options: VennPointOptions;
            public series: VennSeries;
            public sets: Array<string>;
            public value: number;
            public isValid(): boolean;
            public shouldDraw(): boolean;
        }
        class VennSeries extends ScatterSeries {
            public axisTypes: Array<string>;
            public data: Array<VennPoint>;
            public directTouch: boolean;
            public isCartesian: boolean;
            public mapOfIdToRelation: Dictionary<VennRelationObject>;
            public options: VennSeriesOptions;
            public pointArrayMap: Array<string>;
            public pointClass: typeof VennPoint;
            public points: Array<VennPoint>;
            public utils: VennUtilsObject;
            public animate(init?: boolean): void;
            public drawPoints(): void;
            public translate(): void;
        }
        interface SeriesTypesDictionary {
            venn: typeof VennSeries;
        }
        interface VennLabelPositionObject {
            point: PositionObject;
            margin: number;
        }
        interface VennLabelValuesObject {
            position: PositionObject;
            width: number;
        }
        interface VennLabelOverlapObject {
            coordinates: PositionObject;
            loss: number;
        }
        interface VennPointOptions extends ScatterPointOptions {
            name?: string;
            sets?: Array<string>;
            value?: number;
        }
        interface VennPropsObject {
            overlapping: Dictionary<number>;
            totalOverlap: number;
        }
        interface VennRelationObject extends VennPropsObject {
            circle: CircleObject;
            sets: Array<string>;
            value: number;
        }
        interface VennSeriesOptions extends ScatterSeriesOptions {
            borderDashStyle?: DashStyleValue;
            brighten?: number;
            brightness?: number;
            data?: Array<Highcharts.VennPointOptions>;
            states?: SeriesStatesOptionsObject<VennSeries>;
        }
        interface VennUtilsObject {
            geometry: GeometryMixin;
            geometryCircles: object;
            nelderMead: NelderMeadMixin;
            addOverlapToSets(
                relations: Array<VennRelationObject>
            ): Array<VennRelationObject>;
            getDistanceBetweenCirclesByOverlap(
                r1: number,
                r2: number,
                overlap: number
            ): number;
            getLabelWidth(
                pos: PositionObject,
                internal: Array<CircleObject>,
                external: Array<CircleObject>
            ): number;
            getMarginFromCircles(
                point: PositionObject,
                internal: Array<CircleObject>,
                external: Array<CircleObject>
            ): number;
            layoutGreedyVenn(
                relations: Array<VennRelationObject>
            ): Dictionary<CircleObject>;
            loss(
                mapOfIdToCircle: Dictionary<CircleObject>,
                relations: Array<VennRelationObject>
            ): number;
            processVennData(
                data: Array<VennPointOptions>
            ): Array<VennRelationObject>;
            sortByTotalOverlap(
                a: VennRelationObject,
                b: VennRelationObject
            ): number;
        }
    }
}

import draw from '../mixins/draw-point.js';
import geometry from '../mixins/geometry.js';
import GeometryCircleMixin from '../mixins/geometry-circles.js';
const {
    getAreaOfCircle,
    getAreaOfIntersectionBetweenCircles,
    getCircleCircleIntersection,
    getCirclesIntersectionPolygon,
    getOverlapBetweenCircles: getOverlapBetweenCirclesByDistance,
    isCircle1CompletelyOverlappingCircle2,
    isPointInsideAllCircles,
    isPointInsideCircle,
    isPointOutsideAllCircles
} = GeometryCircleMixin;

import NelderMeadModule from '../mixins/nelder-mead.js';
// TODO: replace with individual imports
var nelderMead = NelderMeadModule.nelderMead;

import U from '../parts/Utilities.js';
const {
    animObject,
    isArray,
    isNumber,
    isObject,
    isString
} = U;

import '../parts/Series.js';

var addEvent = H.addEvent,
    color = H.Color,
    extend = H.extend,
    getCenterOfPoints = geometry.getCenterOfPoints,
    getDistanceBetweenPoints = geometry.getDistanceBetweenPoints,
    merge = H.merge,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

var objectValues = function objectValues<T>(
    obj: Highcharts.Dictionary<T>
): Array<T> {
    return Object.keys(obj).map(function (x: string): T {
        return obj[x];
    });
};

/**
 * Calculates the area of overlap between a list of circles.
 * @private
 * @todo add support for calculating overlap between more than 2 circles.
 * @param {Array<Highcharts.CircleObject>} circles
 * List of circles with their given positions.
 * @return {number}
 * Returns the area of overlap between all the circles.
 */
var getOverlapBetweenCircles = function getOverlapBetweenCircles(
    circles: Array<Highcharts.CircleObject>
): number {
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
 * @param {Dictionary<Highcharts.CircleObject>} mapOfIdToCircle
 * Map from id to circle.
 * @param {Array<Highcharts.VennRelationObject>} relations
 * List of relations to calculate the loss of.
 * @return {number}
 * Returns the loss between positions of the circles for the given relations.
 */
var loss = function loss(
    mapOfIdToCircle: Highcharts.Dictionary<Highcharts.CircleObject>,
    relations: Array<Highcharts.VennRelationObject>
): number {
    var precision = 10e10;

    // Iterate all the relations and calculate their individual loss.
    return relations.reduce(function (
        totalLoss: number,
        relation: Highcharts.VennRelationObject
    ): number {
        var loss = 0;

        if (relation.sets.length > 1) {
            var wantedOverlap = relation.value;
            // Calculate the actual overlap between the sets.
            var actualOverlap = getOverlapBetweenCircles(
                // Get the circles for the given sets.
                relation.sets.map(function (
                    set: string
                ): Highcharts.CircleObject {
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
 * @param {Function} f
 * The function to find the root of.
 * @param {number} a
 * The lowest number in the search range.
 * @param {number} b
 * The highest number in the search range.
 * @param {number} [tolerance=1e-10]
 * The allowed difference between the returned value and root.
 * @param {number} [maxIterations=100]
 * The maximum iterations allowed.
 * @return {number}
 * Root number.
 */
var bisect = function bisect(
    f: Function,
    a: number,
    b: number,
    tolerance?: number,
    maxIterations?: number
): number {
    var fA = f(a),
        fB = f(b),
        nMax = maxIterations || 100,
        tol = tolerance || 1e-10,
        delta = b - a,
        n = 1,
        x: (number|undefined),
        fX: (number|undefined);

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
            if (fA * (fX as any) > 0) {
                a = x;
            } else {
                b = x;
            }
        }
    }

    return x as any;
};

/**
 * Uses the bisection method to make a best guess of the ideal distance between
 * two circles too get the desired overlap.
 * Currently there is no known formula to calculate the distance from the area
 * of overlap, which makes the bisection method preferred.
 * @private
 * @param {number} r1
 * Radius of the first circle.
 * @param {number} r2
 * Radiues of the second circle.
 * @param {number} overlap
 * The wanted overlap between the two circles.
 * @return {number}
 * Returns the distance needed to get the wanted overlap between the two
 * circles.
 */
var getDistanceBetweenCirclesByOverlap =
function getDistanceBetweenCirclesByOverlap(
    r1: number,
    r2: number,
    overlap: number
): number {
    var maxDistance = r1 + r2,
        distance;

    if (overlap <= 0) {
        // If overlap is below or equal to zero, then there is no overlap.
        distance = maxDistance;
    } else if (getAreaOfCircle(r1 < r2 ? r1 : r2) <= overlap) {
        // When area of overlap is larger than the area of the smallest circle,
        // then it is completely overlapping.
        distance = 0;
    } else {
        distance = bisect(function (x: number): number {
            var actualOverlap = getOverlapBetweenCirclesByDistance(r1, r2, x);

            // Return the differance between wanted and actual overlap.
            return overlap - actualOverlap;
        }, 0, maxDistance);
    }
    return distance;
};

var isSet = function (
    x: (Highcharts.VennPointOptions|Highcharts.VennRelationObject)
): boolean {
    return isArray(x.sets) && x.sets.length === 1;
};

/**
 * Calculates a margin for a point based on the iternal and external circles.
 * The margin describes if the point is well placed within the internal circles,
 * and away from the external
 * @private
 * @todo add unit tests.
 * @param {Highcharts.PositionObject} point
 * The point to evaluate.
 * @param {Array<Highcharts.CircleObject>} internal
 * The internal circles.
 * @param {Array<Highcharts.CircleObject>} external
 * The external circles.
 * @return {number}
 * Returns the margin.
 */
var getMarginFromCircles = function getMarginFromCircles(
    point: Highcharts.PositionObject,
    internal: Array<Highcharts.CircleObject>,
    external: Array<Highcharts.CircleObject>
): number {
    var margin = internal.reduce(function (
        margin: number,
        circle: Highcharts.CircleObject
    ): number {
        var m = circle.r - getDistanceBetweenPoints(point, circle);

        return (m <= margin) ? m : margin;
    }, Number.MAX_VALUE);

    margin = external.reduce(function (
        margin: number,
        circle: Highcharts.CircleObject
    ): number {
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
 * @param {Array<Highcharts.CircleObject>} internal
 * Internal circles.
 * @param {Array<Highcharts.CircleObject>} external
 * External circles.
 * @return {Highcharts.PositionObject}
 * Returns the found position.
 */
var getLabelPosition = function getLabelPosition(
    internal: Array<Highcharts.CircleObject>,
    external: Array<Highcharts.CircleObject>
): Highcharts.PositionObject {
    // Get the best label position within the internal circles.
    var best = internal.reduce(function (
        best: Highcharts.VennLabelPositionObject,
        circle: Highcharts.CircleObject
    ): Highcharts.VennLabelPositionObject {
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
            // Iterate the given points and return the one with the largest
            // margin.
            .reduce(function (
                best: Highcharts.VennLabelPositionObject,
                point: Highcharts.PositionObject
            ): Highcharts.VennLabelPositionObject {
                var margin = getMarginFromCircles(point, internal, external);

                // If the margin better than the current best, then update best.
                if (best.margin < margin) {
                    best.point = point;
                    best.margin = margin;
                }
                return best;
            }, best);
    }, {
        point: void 0 as any,
        margin: -Number.MAX_VALUE
    }).point;

    // Use nelder mead to optimize the initial label position.
    var optimal = nelderMead(
        function (p: Array<number>): number {
            return -(
                getMarginFromCircles({ x: p[0], y: p[1] }, internal, external)
            );
        },
        [best.x, best.y] as any
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
        if (internal.length > 1) {
            best = getCenterOfPoints(
                getCirclesIntersectionPolygon(internal)
            );
        } else {
            best = {
                x: internal[0].x,
                y: internal[0].y
            };
        }
    }

    // Return the best point.
    return best;
};

/**
 * Finds the available width for a label, by taking the label position and
 * finding the largest distance, which is inside all internal circles, and
 * outside all external circles.
 *
 * @private
 * @param {Highcharts.PositionObject} pos
 * The x and y coordinate of the label.
 * @param {Array<Highcharts.CircleObject>} internal
 * Internal circles.
 * @param {Array<Highcharts.CircleObject>} external
 * External circles.
 * @return {number}
 * Returns available width for the label.
 */
var getLabelWidth = function getLabelWidth(
    pos: Highcharts.PositionObject,
    internal: Array<Highcharts.CircleObject>,
    external: Array<Highcharts.CircleObject>
): number {
    var radius = internal.reduce(function (
            min: number,
            circle: Highcharts.CircleObject
        ): number {
            return Math.min(circle.r, min);
        }, Infinity),
        // Filter out external circles that are completely overlapping.
        filteredExternals = external.filter(
            function (circle: Highcharts.CircleObject): boolean {
                return !isPointInsideCircle(pos, circle);
            }
        );

    var findDistance = function (
        maxDistance: number,
        direction: number
    ): number {
        return bisect(function (x: number): number {
            var testPos = {
                    x: pos.x + (direction * x),
                    y: pos.y
                },
                isValid = (
                    isPointInsideAllCircles(testPos, internal) &&
                    isPointOutsideAllCircles(testPos, filteredExternals)
                );

            // If the position is valid, then we want to move towards the max
            // distance. If not, then we want to  away from the max distance.
            return -(maxDistance - x) + (isValid ? 0 : Number.MAX_VALUE);
        }, 0, maxDistance);
    };

    // Find the smallest distance of left and right.
    return Math.min(findDistance(radius, -1), findDistance(radius, 1)) * 2;
};

/**
 * Calulates data label values for a given relations object.
 *
 * @private
 * @todo add unit tests
 * @param {Highcharts.VennRelationObject} relation A relations object.
 * @param {Array<Highcharts.VennRelationObject>} setRelations The list of
 * relations that is a set.
 * @return {Highcharts.VennLabelValuesObject}
 * Returns an object containing position and width of the label.
 */
function getLabelValues(
    relation: Highcharts.VennRelationObject,
    setRelations: Array<Highcharts.VennRelationObject>
): Highcharts.VennLabelValuesObject {
    const sets = relation.sets;
    // Create a list of internal and external circles.
    const data = setRelations.reduce(function (
        data: Highcharts.Dictionary<(Array<Highcharts.CircleObject>)>,
        set: Highcharts.VennRelationObject
    ): Highcharts.Dictionary<Array<Highcharts.CircleObject>> {
        // If the set exists in this relation, then it is internal,
        // otherwise it will be external.
        const isInternal = sets.indexOf(set.sets[0]) > -1;
        const property = isInternal ? 'internal' : 'external';

        // Add the circle to the list.
        data[property].push(set.circle);
        return data;
    }, {
        internal: [],
        external: []
    });

    // Filter out external circles that are completely overlapping all internal
    data.external = data.external.filter((externalCircle): boolean =>
        data.internal.some((internalCircle): boolean =>
            !isCircle1CompletelyOverlappingCircle2(
                externalCircle, internalCircle
            )
        )
    );

    // Calulate the label position.
    const position = getLabelPosition(data.internal, data.external);
    // Calculate the label width
    const width = getLabelWidth(position, data.internal, data.external);

    return {
        position,
        width
    };
}

/**
 * Takes an array of relations and adds the properties `totalOverlap` and
 * `overlapping` to each set. The property `totalOverlap` is the sum of value
 * for each relation where this set is included. The property `overlapping` is
 * a map of how much this set is overlapping another set.
 * NOTE: This algorithm ignores relations consisting of more than 2 sets.
 * @private
 * @param {Array<Highcharts.VennRelationObject>} relations
 * The list of relations that should be sorted.
 * @return {Array<Highcharts.VennRelationObject>}
 * Returns the modified input relations with added properties `totalOverlap` and
 * `overlapping`.
 */
var addOverlapToSets = function addOverlapToSets(
    relations: Array<Highcharts.VennRelationObject>
): Array<Highcharts.VennRelationObject> {
    // Calculate the amount of overlap per set.
    var mapOfIdToProps = relations
        // Filter out relations consisting of 2 sets.
        .filter(function (relation: Highcharts.VennRelationObject): boolean {
            return relation.sets.length === 2;
        })
        // Sum up the amount of overlap for each set.
        .reduce(function (
            map: Highcharts.Dictionary<Highcharts.VennPropsObject>,
            relation: Highcharts.VennRelationObject
        ): Highcharts.Dictionary<Highcharts.VennPropsObject> {
            var sets = relation.sets;

            sets.forEach(function (
                set: string,
                i: number,
                arr: Array<string>
            ): void {
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
        .forEach(function (set: Highcharts.VennRelationObject): void {
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
var sortByTotalOverlap = function sortByTotalOverlap(
    a: Highcharts.VennRelationObject,
    b: Highcharts.VennRelationObject
): number {
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
var layoutGreedyVenn = function layoutGreedyVenn(
    relations: Array<Highcharts.VennRelationObject>
): Highcharts.Dictionary<Highcharts.CircleObject> {
    var positionedSets: Array<Highcharts.VennRelationObject> = [],
        mapOfIdToCircles: Highcharts.Dictionary<Highcharts.CircleObject> =
            {};

    // Define a circle for each set.
    relations
        .filter(function (relation: Highcharts.VennRelationObject): boolean {
            return relation.sets.length === 1;
        }).forEach(function (relation: Highcharts.VennRelationObject): void {
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
     * @param {object} set
     * The set to add to its final position.
     * @param {object} coordinates
     * The coordinates to position the set at.
     * @return {void}
     */
    var positionSet = function positionSet(
        set: Highcharts.VennRelationObject,
        coordinates: Highcharts.PositionObject
    ): void {
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
    positionSet(sortedByOverlap.shift() as any, { x: 0, y: 0 });

    var relationsWithTwoSets = relations.filter(
        function (x: Highcharts.VennRelationObject): boolean {
            return x.sets.length === 2;
        }
    );

    // Iterate and position the remaining sets.
    sortedByOverlap.forEach(function (
        set: Highcharts.VennRelationObject
    ): void {
        var circle = set.circle,
            radius = circle.r,
            overlapping = set.overlapping;

        var bestPosition = positionedSets
            .reduce(function (
                best: Highcharts.VennLabelOverlapObject,
                positionedSet: Highcharts.VennRelationObject,
                i: number
            ): Highcharts.VennLabelOverlapObject {
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
                var possibleCoordinates: Array<Highcharts.PositionObject> = [
                    { x: positionedCircle.x + distance, y: positionedCircle.y },
                    { x: positionedCircle.x - distance, y: positionedCircle.y },
                    { x: positionedCircle.x, y: positionedCircle.y + distance },
                    { x: positionedCircle.x, y: positionedCircle.y - distance }
                ];

                // If there are more circles overlapping, then add the
                // intersection points as possible positions.
                positionedSets.slice(i + 1).forEach(function (
                    positionedSet2: Highcharts.VennRelationObject
                ): void {
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
                possibleCoordinates.forEach(function (
                    coordinates: Highcharts.PositionObject
                ): void {
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
                coordinates: void 0 as any
            });

        // Add the set to its final position.
        positionSet(set, bestPosition.coordinates);
    });

    // Return the positions of each set.
    return mapOfIdToCircles;
};

/**
 * Calculates the positions, and the label values of all the sets in the venn
 * diagram.
 *
 * @private
 * @todo Add support for constrained MDS.
 * @param {Array<Highchats.VennRelationObject>} relations
 * List of the overlap between two or more sets, or the size of a single set.
 * @return {Highcharts.Dictionary<*>}
 * List of circles and their calculated positions.
 */
function layout(
    relations: Array<Highcharts.VennRelationObject>
): ({
        mapOfIdToShape: Highcharts.Dictionary<(
            Highcharts.CircleObject|Highcharts.GeometryIntersectionObject
        )>;
        mapOfIdToLabelValues: Highcharts.Dictionary<(
            Highcharts.VennLabelValuesObject
        )>;
    }) {
    const mapOfIdToShape: Highcharts.Dictionary<(
        Highcharts.CircleObject|Highcharts.GeometryIntersectionObject
    )> = {};
    const mapOfIdToLabelValues: Highcharts.Dictionary<(
        Highcharts.VennLabelValuesObject
    )> = {};

    // Calculate best initial positions by using greedy layout.
    if (relations.length > 0) {
        const mapOfIdToCircles = layoutGreedyVenn(relations);
        const setRelations = relations.filter(isSet);

        relations
            .forEach(function (relation: Highcharts.VennRelationObject): void {
                const sets = relation.sets;
                const id = sets.join();

                // Get shape from map of circles, or calculate intersection.
                const shape = isSet(relation) ?
                    mapOfIdToCircles[id] :
                    getAreaOfIntersectionBetweenCircles(
                        sets.map((set): Highcharts.CircleObject =>
                            mapOfIdToCircles[set])
                    );

                // Calculate label values if the set has a shape
                if (shape) {
                    mapOfIdToShape[id] = shape;
                    mapOfIdToLabelValues[id] = getLabelValues(
                        relation, setRelations
                    );
                }
            });
    }
    return { mapOfIdToShape, mapOfIdToLabelValues };
}

var isValidRelation = function (
    x: (Highcharts.VennPointOptions|Highcharts.VennRelationObject)
): boolean {
    var map: Highcharts.Dictionary<boolean> = {};

    return (
        isObject(x) &&
        (isNumber(x.value) && x.value > -1) &&
        (isArray(x.sets) && x.sets.length > 0) &&
        !x.sets.some(function (set: string): boolean {
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

var isValidSet = function (
    x: (Highcharts.VennPointOptions|Highcharts.VennRelationObject)
): boolean {
    return (isValidRelation(x) && isSet(x) && (x.value as any) > 0);
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
var processVennData = function processVennData(
    data: Array<Highcharts.VennPointOptions>
): Array<Highcharts.VennRelationObject> {
    var d = isArray(data) ? data : [];

    var validSets = d
        .reduce(function (
            arr: Array<string>,
            x: Highcharts.VennPointOptions
        ): Array<string> {
            // Check if x is a valid set, and that it is not an duplicate.
            if (isValidSet(x) && arr.indexOf((x.sets as any)[0]) === -1) {
                arr.push((x.sets as any)[0]);
            }
            return arr;
        }, [])
        .sort();

    var mapOfIdToRelation = d.reduce(function (
        mapOfIdToRelation: Highcharts.Dictionary<Highcharts.VennRelationObject>,
        relation: Highcharts.VennPointOptions
    ): Highcharts.Dictionary<Highcharts.VennRelationObject> {
        if (
            isValidRelation(relation) &&
            !(relation.sets as any).some(function (set: string): boolean {
                return validSets.indexOf(set) === -1;
            })
        ) {
            mapOfIdToRelation[(relation.sets as any).sort().join()] =
                relation as any;
        }
        return mapOfIdToRelation;
    }, {});

    validSets.reduce(function (
        combinations: Array<string>,
        set: string,
        i: number,
        arr: Array<string>
    ): Array<string> {
        var remaining = arr.slice(i + 1);

        remaining.forEach(function (set2: string): void {
            combinations.push(set + ',' + set2);
        });
        return combinations;
    }, []).forEach(function (combination: string): void {
        if (!mapOfIdToRelation[combination]) {
            var obj: Highcharts.VennRelationObject = {
                sets: combination.split(','),
                value: 0
            } as any;

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
 * @param {number} targetWidth
 * Width of target area.
 * @param {number} targetHeight
 * Height of target area.
 * @param {Highcharts.PolygonBoxObject} field
 * The playing field.
 * @return {Highcharts.Dictionary<number>}
 * Returns the value to scale the playing field up to the size of the target
 * area, and center of x and y.
 */
var getScale = function getScale(
    targetWidth: number,
    targetHeight: number,
    field: Highcharts.PolygonBoxObject
): Highcharts.Dictionary<number> {
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
 * @param {Highcharts.PolygonBoxObject} field
 * The bounding box of a playing field.
 * @param {Highcharts.CircleObject} circle
 * The bounding box for a placed point.
 * @return {Highcharts.PolygonBoxObject}
 * Returns a modified field object.
 */
var updateFieldBoundaries = function updateFieldBoundaries(
    field: Highcharts.PolygonBoxObject,
    circle: Highcharts.CircleObject
): Highcharts.PolygonBoxObject {
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
 * @excluding    connectEnds, connectNulls, cropThreshold, dragDrop,
 *               findNearestPointBy, getExtremesFromAll, jitter, label, linecap,
 *               lineWidth, linkedTo, marker, negativeColor, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointStart, softThreshold,
 *               stacking, steps, threshold, xAxis, yAxis, zoneAxis, zones
 * @product      highcharts
 * @requires     modules/venn
 * @optionparent plotOptions.venn
 */
var vennOptions: Highcharts.VennSeriesOptions = {
    borderColor: '${palette.neutralColor20}',
    borderDashStyle: 'solid' as any,
    borderWidth: 1,
    brighten: 0,
    clip: false,
    colorByPoint: true,
    dataLabels: {
        enabled: true,
        verticalAlign: 'middle',
        formatter: function (): (string|undefined) {
            return this.point.name;
        }
    },
    /**
     * @ignore-option
     * @private
     */
    inactiveOtherPoints: true,
    marker: false as any,
    opacity: 0.75,
    showInLegend: false,
    states: {
        /**
         * @excluding halo
         */
        hover: {
            opacity: 1,
            borderColor: '${palette.neutralColor80}'
        },
        /**
         * @excluding halo
         */
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
    translate: function (this: Highcharts.VennSeries): void {

        var chart = this.chart;

        this.processedXData = this.xData as any;
        this.generatePoints();

        // Process the data before passing it into the layout function.
        var relations = processVennData(this.options.data as any);

        // Calculate the positions of each circle.
        const { mapOfIdToShape, mapOfIdToLabelValues } = layout(relations);

        // Calculate the scale, and center of the plot area.
        var field = Object.keys(mapOfIdToShape)
                .filter(function (key: string): boolean {
                    var shape = mapOfIdToShape[key];

                    return shape && isNumber((shape as any).r);
                })
                .reduce(function (
                    field: Highcharts.PolygonBoxObject,
                    key: string
                ): Highcharts.PolygonBoxObject {
                    return updateFieldBoundaries(
                        field,
                        mapOfIdToShape[key] as any
                    );
                }, { top: 0, bottom: 0, left: 0, right: 0 }),
            scaling = getScale(chart.plotWidth, chart.plotHeight, field),
            scale = scaling.scale,
            centerX = scaling.centerX,
            centerY = scaling.centerY;

        // Iterate all points and calculate and draw their graphics.
        this.points.forEach(function (point: Highcharts.VennPoint): void {
            var sets: Array<string> = isArray(point.sets) ? point.sets : [],
                id = sets.join(),
                shape = mapOfIdToShape[id],
                shapeArgs: (Highcharts.SVGAttributes|undefined),
                dataLabelValues = mapOfIdToLabelValues[id] || {},
                dataLabelWidth = dataLabelValues.width,
                dataLabelPosition = dataLabelValues.position,
                dlOptions = point.options && point.options.dataLabels;

            if (shape) {
                if ((shape as any).r) {
                    shapeArgs = {
                        x: centerX + (shape as any).x * scale,
                        y: centerY + (shape as any).y * scale,
                        r: (shape as any).r * scale
                    };
                } else if ((shape as any).d) {
                    // TODO: find a better way to handle scaling of a path.
                    var d = (shape as any).d.reduce(function (
                        path: Highcharts.SVGPathArray,
                        arr: Highcharts.SVGPathArray
                    ): Highcharts.SVGPathArray {
                        if (arr[0] === 'M') {
                            arr[1] = centerX + (arr as any)[1] * scale;
                            arr[2] = centerY + (arr as any)[2] * scale;
                        } else if (arr[0] === 'A') {
                            arr[1] = (arr as any)[1] * scale;
                            arr[2] = (arr as any)[2] * scale;
                            arr[6] = centerX + (arr as any)[6] * scale;
                            arr[7] = centerY + (arr as any)[7] * scale;
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
                    dataLabelPosition = {} as any;
                }

                if (isNumber(dataLabelWidth)) {
                    dataLabelWidth = Math.round(dataLabelWidth * scale);
                }
            }

            point.shapeArgs = shapeArgs;

            // Placement for the data labels
            if (dataLabelPosition && shapeArgs) {
                point.plotX = dataLabelPosition.x;
                point.plotY = dataLabelPosition.y;
            }

            // Add width for the data label
            if (dataLabelWidth && shapeArgs) {
                point.dlOptions = merge(
                    true,
                    {
                        style: {
                            width: dataLabelWidth
                        }
                    },
                    isObject(dlOptions) && dlOptions
                );
            }

            // Set name for usage in tooltip and in data label.
            point.name = point.options.name || sets.join('∩');
        });
    },
    /* eslint-disable valid-jsdoc */
    /**
     * Draw the graphics for each point.
     * @private
     */
    drawPoints: function (this: Highcharts.VennSeries): void {
        var series = this,
            // Series properties
            chart = series.chart,
            group: Highcharts.SVGElement = series.group as any,
            points = series.points || [],
            // Chart properties
            renderer = chart.renderer;

        // Iterate all points and calculate and draw their graphics.
        points.forEach(function (point: Highcharts.VennPoint): void {
            var attribs = {
                    zIndex: isArray(point.sets) ? point.sets.length : 0
                },
                shapeArgs: Highcharts.SVGAttributes = point.shapeArgs as any;

            // Add point attribs
            if (!chart.styledMode) {
                extend(attribs, series.pointAttribs(point, point.state));
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
     * @param {Highcharts.Point} point
     * The point which will get the resulting attributes.
     * @param {string} [state]
     * The state of the point.
     * @return {Highcharts.SVGAttributes}
     * Returns the calculated attributes.
     */
    pointAttribs: function (
        this: Highcharts.VennSeries,
        point: Highcharts.VennPoint,
        state?: keyof Highcharts.VennSeries['options']['states']
    ): Highcharts.SVGAttributes {
        var series = this,
            seriesOptions = series.options || {},
            pointOptions = point && point.options || {},
            stateOptions =
                (state && (seriesOptions.states as any)[state as any]) || {},
            options = merge(
                seriesOptions,
                { color: point && point.color },
                pointOptions,
                stateOptions
            );

        // Return resulting values for the attributes.
        return {
            'fill': (color as any)(options.color)
                .setOpacity(options.opacity)
                .brighten(options.brightness)
                .get(),
            'stroke': options.borderColor,
            'stroke-width': options.borderWidth,
            'dashstyle': options.borderDashStyle
        };
    },
    /* eslint-enable valid-jsdoc */
    animate: function (this: Highcharts.VennSeries, init?: boolean): void {
        if (!init) {
            var series = this,
                animOptions = animObject(series.options.animation);

            series.points.forEach(function (point: Highcharts.VennPoint): void {
                var args = point.shapeArgs;

                if (point.graphic && args) {
                    var attr: Highcharts.SVGAttributes = {},
                        animate: Highcharts.SVGAttributes = {};

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
                        setTimeout(function (): void {
                            if (point && point.graphic) {
                                point.graphic.animate({
                                    opacity: 1
                                });
                            }
                        }, animOptions.duration);
                    }
                }
            }, series);
            series.animate = null as any;
        }
    },
    utils: {
        addOverlapToSets: addOverlapToSets,
        geometry: geometry,
        geometryCircles: GeometryCircleMixin,
        getLabelWidth: getLabelWidth,
        getMarginFromCircles: getMarginFromCircles,
        getDistanceBetweenCirclesByOverlap: getDistanceBetweenCirclesByOverlap,
        layoutGreedyVenn: layoutGreedyVenn,
        loss: loss,
        nelderMead: NelderMeadModule,
        processVennData: processVennData,
        sortByTotalOverlap: sortByTotalOverlap
    }
};

var vennPoint = {
    draw: draw,
    shouldDraw: function (this: Highcharts.VennPoint): boolean {
        var point = this;

        // Only draw points with single sets.
        return !!point.shapeArgs;
    },
    isValid: function (this: Highcharts.VennPoint): boolean {
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
 * @requires  modules/venn
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
 * @excluding halo
 * @apioption series.venn.states.hover
 */

/**
 * @excluding halo
 * @apioption series.venn.states.select
 */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.venn
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.VennSeries>(
    'venn', 'scatter', vennOptions, vennSeries, vennPoint
);

/* eslint-disable no-invalid-this */

// Modify final series options.
addEvent(seriesTypes.venn, 'afterSetOptions', function (
    e: { options: Highcharts.VennSeriesOptions }
): void {
    var options = e.options,
        states: Highcharts.SeriesStatesOptionsObject<Highcharts.VennSeries> =
            options.states as any;

    if (this instanceof seriesTypes.venn) {
        // Explicitly disable all halo options.
        Object.keys(states).forEach(function (state: string): void {
            (states as any)[state].halo = false;
        });
    }
});
