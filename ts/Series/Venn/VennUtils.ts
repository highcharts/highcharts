/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2021 Highsoft AS
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

/* *
 *
 *  Imports
 *
 * */

import type PositionObject from '../../Core/Renderer/PositionObject';
import type VennPointOptions from './VennPointOptions';
import GeometryCirclesModule from '../../Mixins/GeometryCircles.js';
const {
    getAreaOfCircle,
    getCircleCircleIntersection,
    getOverlapBetweenCircles: getOverlapBetweenCirclesByDistance,
    isPointInsideAllCircles,
    isPointInsideCircle,
    isPointOutsideAllCircles
} = GeometryCirclesModule;
import GeometryMixin from '../../Mixins/Geometry.js';
import NelderMeadMixin from '../../Mixins/NelderMead.js';
const { getDistanceBetweenPoints } = GeometryMixin;
import U from '../../Core/Utilities.js';
const {
    extend,
    isArray,
    isNumber,
    isObject,
    isString
} = U;

/* *
 *
 *  Namespace
 *
 * */

namespace VennUtils {

    /* *
     *
     *  Properties
     *
     * */

    export const geometry = GeometryMixin;

    export const geometryCircles = GeometryCirclesModule;

    export const nelderMead = NelderMeadMixin;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Takes an array of relations and adds the properties `totalOverlap` and
     * `overlapping` to each set. The property `totalOverlap` is the sum of
     * value for each relation where this set is included. The property
     * `overlapping` is a map of how much this set is overlapping another set.
     * NOTE: This algorithm ignores relations consisting of more than 2 sets.
     * @private
     * @param {Array<Highcharts.VennRelationObject>} relations
     * The list of relations that should be sorted.
     * @return {Array<Highcharts.VennRelationObject>}
     * Returns the modified input relations with added properties `totalOverlap`
     * and `overlapping`.
     */
    export function addOverlapToSets(
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
                map: Record<string, Highcharts.VennPropsObject>,
                relation: Highcharts.VennRelationObject
            ): Record<string, Highcharts.VennPropsObject> {
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
    }

    /**
     * Finds the root of a given function. The root is the input value needed
     * for a function to return 0.
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
    function bisect(
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
    }

    /**
     * Uses the bisection method to make a best guess of the ideal distance
     * between two circles too get the desired overlap.
     * Currently there is no known formula to calculate the distance from the
     * area of overlap, which makes the bisection method preferred.
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
    export function getDistanceBetweenCirclesByOverlap(
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
            // When area of overlap is larger than the area of the smallest
            // circle, then it is completely overlapping.
            distance = 0;
        } else {
            distance = bisect(function (x: number): number {
                var actualOverlap = getOverlapBetweenCirclesByDistance(r1, r2, x);

                // Return the differance between wanted and actual overlap.
                return overlap - actualOverlap;
            }, 0, maxDistance);
        }
        return distance;
    }

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
    export function getLabelWidth(
        pos: PositionObject,
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

                // If the position is valid, then we want to move towards the
                // max distance. If not, then we want to  away from the max
                // distance.
                return -(maxDistance - x) + (isValid ? 0 : Number.MAX_VALUE);
            }, 0, maxDistance);
        };

        // Find the smallest distance of left and right.
        return Math.min(findDistance(radius, -1), findDistance(radius, 1)) * 2;
    }

    /**
     * Calculates a margin for a point based on the iternal and external
     * circles. The margin describes if the point is well placed within the
     * internal circles, and away from the external.
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
    export function getMarginFromCircles(
        point: PositionObject,
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
    }

    /**
     * Calculates the area of overlap between a list of circles.
     * @private
     * @todo add support for calculating overlap between more than 2 circles.
     * @param {Array<Highcharts.CircleObject>} circles
     * List of circles with their given positions.
     * @return {number}
     * Returns the area of overlap between all the circles.
     */
    function getOverlapBetweenCircles(
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
    }

    // eslint-disable-next-line require-jsdoc
    export function isSet(
        x: (VennPointOptions|Highcharts.VennRelationObject)
    ): boolean {
        return isArray(x.sets) && x.sets.length === 1;
    }

    // eslint-disable-next-line require-jsdoc
    function isValidRelation(
        x: (VennPointOptions|Highcharts.VennRelationObject)
    ): boolean {
        var map: Record<string, boolean> = {};

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
    }

    // eslint-disable-next-line require-jsdoc
    function isValidSet(
        x: (VennPointOptions|Highcharts.VennRelationObject)
    ): boolean {
        return (isValidRelation(x) && isSet(x) && (x.value as any) > 0);
    }

    /**
     * Uses a greedy approach to position all the sets. Works well with a small
     * number of sets, and are in these cases a good choice aesthetically.
     * @private
     * @param {Array<object>} relations List of the overlap between two or more
     * sets, or the size of a single set.
     * @return {Array<object>} List of circles and their calculated positions.
     */
    export function layoutGreedyVenn(
        relations: Array<Highcharts.VennRelationObject>
    ): Record<string, Highcharts.CircleObject> {
        var positionedSets: Array<Highcharts.VennRelationObject> = [],
            mapOfIdToCircles: Record<string, Highcharts.CircleObject> =
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
            coordinates: PositionObject
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

                    // Calculate the distance between the sets to get the
                    // correct overlap
                    var distance = getDistanceBetweenCirclesByOverlap(
                        radius,
                        positionedCircle.r,
                        overlap
                    );

                    // Create a list of possible coordinates calculated from
                    // distance.
                    var possibleCoordinates: Array<PositionObject> = [
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
                    possibleCoordinates.forEach(function (coordinates): void {
                        circle.x = coordinates.x;
                        circle.y = coordinates.y;

                        // Calculate loss for the suggested coordinates.
                        var currentLoss = loss(
                            mapOfIdToCircles, relationsWithTwoSets
                        );

                        // If the loss is better, then use these new coordinates
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
    }

    /**
     * Calculates the difference between the desired overlap and the actual
     * overlap between two circles.
     * @private
     * @param {Dictionary<Highcharts.CircleObject>} mapOfIdToCircle
     * Map from id to circle.
     * @param {Array<Highcharts.VennRelationObject>} relations
     * List of relations to calculate the loss of.
     * @return {number}
     * Returns the loss between positions of the circles for the given
     * relations.
     */
    export function loss(
        mapOfIdToCircle: Record<string, Highcharts.CircleObject>,
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
    }

    /**
     * Prepares the venn data so that it is usable for the layout function.
     * Filter out sets, or intersections that includes sets, that are missing in
     * the data or has (value < 1). Adds missing relations between sets in the
     * data as value = 0.
     * @private
     * @param {Array<object>} data The raw input data.
     * @return {Array<object>} Returns an array of valid venn data.
     */
    export function processVennData(
        data: Array<VennPointOptions>
    ): Array<Highcharts.VennRelationObject> {
        var d = isArray(data) ? data : [];

        var validSets = d
            .reduce(function (
                arr: Array<string>,
                x: VennPointOptions
            ): Array<string> {
                // Check if x is a valid set, and that it is not an duplicate.
                if (isValidSet(x) && arr.indexOf((x.sets as any)[0]) === -1) {
                    arr.push((x.sets as any)[0]);
                }
                return arr;
            }, [])
            .sort();

        var mapOfIdToRelation = d.reduce(function (
            mapOfIdToRelation: Record<string, Highcharts.VennRelationObject>,
            relation: VennPointOptions
        ): Record<string, Highcharts.VennRelationObject> {
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
        return Object
            .keys(mapOfIdToRelation)
            .map(function (id): Highcharts.VennRelationObject {
                return mapOfIdToRelation[id];
            });
    }

    /**
     * Takes two sets and finds the one with the largest total overlap.
     * @private
     * @param {object} a The first set to compare.
     * @param {object} b The second set to compare.
     * @return {number} Returns 0 if a and b are equal, <0 if a is greater, >0 if b
     * is greater.
     */
    export function sortByTotalOverlap(
        a: Highcharts.VennRelationObject,
        b: Highcharts.VennRelationObject
    ): number {
        return b.totalOverlap - a.totalOverlap;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default VennUtils;
