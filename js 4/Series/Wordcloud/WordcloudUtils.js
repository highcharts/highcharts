/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */
'use strict';
import H from '../../Core/Globals.js';
var deg2rad = H.deg2rad;
import U from '../../Core/Utilities.js';
var extend = U.extend, find = U.find, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge;
/* *
 *
 * Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * Detects if there is a collision between two rectangles.
 *
 * @private
 * @function isRectanglesIntersecting
 *
 * @param {Highcharts.PolygonBoxObject} r1
 * First rectangle.
 *
 * @param {Highcharts.PolygonBoxObject} r2
 * Second rectangle.
 *
 * @return {boolean}
 * Returns true if the rectangles overlap.
 */
function isRectanglesIntersecting(r1, r2) {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
}
/**
 * Calculates the normals to a line between two points.
 *
 * @private
 * @function getNormals
 * @param {Highcharts.PolygonPointObject} p1
 *        Start point for the line. Array of x and y value.
 * @param {Highcharts.PolygonPointObject} p2
 *        End point for the line. Array of x and y value.
 * @return {Highcharts.PolygonObject}
 *         Returns the two normals in an array.
 */
function getNormals(p1, p2) {
    var dx = p2[0] - p1[0], // x2 - x1
    dy = p2[1] - p1[1]; // y2 - y1
    return [
        [-dy, dx],
        [dy, -dx]
    ];
}
/**
 * @private
 */
function getAxesFromPolygon(polygon) {
    var points, axes = polygon.axes || [];
    if (!axes.length) {
        axes = [];
        points = points = polygon.concat([polygon[0]]);
        points.reduce(function findAxis(p1, p2) {
            var normals = getNormals(p1, p2), axis = normals[0]; // Use the left normal as axis.
            // Check that the axis is unique.
            if (!find(axes, function (existing) {
                return existing[0] === axis[0] &&
                    existing[1] === axis[1];
            })) {
                axes.push(axis);
            }
            // Return p2 to be used as p1 in next iteration.
            return p2;
        });
        polygon.axes = axes;
    }
    return axes;
}
/**
 * Projects a polygon onto a coordinate.
 *
 * @private
 * @function project
 * @param {Highcharts.PolygonObject} polygon
 * Array of points in a polygon.
 * @param {Highcharts.PolygonPointObject} target
 * The coordinate of pr
 */
function project(polygon, target) {
    var products = polygon.map(function (point) {
        var ax = point[0], ay = point[1], bx = target[0], by = target[1];
        return ax * bx + ay * by;
    });
    return {
        min: Math.min.apply(this, products),
        max: Math.max.apply(this, products)
    };
}
/**
 * @private
 */
function isPolygonsOverlappingOnAxis(axis, polygon1, polygon2) {
    var projection1 = project(polygon1, axis), projection2 = project(polygon2, axis), isOverlapping = !(projection2.min > projection1.max ||
        projection2.max < projection1.min);
    return !isOverlapping;
}
/**
 * Checks wether two convex polygons are colliding by using the Separating
 * Axis Theorem.
 *
 * @private
 * @function isPolygonsColliding
 * @param {Highcharts.PolygonObject} polygon1
 *        First polygon.
 *
 * @param {Highcharts.PolygonObject} polygon2
 *        Second polygon.
 *
 * @return {boolean}
 *         Returns true if they are colliding, otherwise false.
 */
function isPolygonsColliding(polygon1, polygon2) {
    // Get the axis from both polygons.
    var axes1 = getAxesFromPolygon(polygon1), axes2 = getAxesFromPolygon(polygon2), axes = axes1.concat(axes2), overlappingOnAllAxes = !find(axes, function (axis) { return isPolygonsOverlappingOnAxis(axis, polygon1, polygon2); });
    return overlappingOnAllAxes;
}
/**
 * Detects if a word collides with any previously placed words.
 *
 * @private
 * @function intersectsAnyWord
 *
 * @param {Highcharts.Point} point
 * Point which the word is connected to.
 *
 * @param {Array<Highcharts.Point>} points
 * Previously placed points to check against.
 *
 * @return {boolean}
 * Returns true if there is collision.
 */
function intersectsAnyWord(point, points) {
    var intersects = false, rect = point.rect, polygon = point.polygon, lastCollidedWith = point.lastCollidedWith, isIntersecting = function (p) {
        var result = isRectanglesIntersecting(rect, p.rect);
        if (result &&
            (point.rotation % 90 || p.rotation % 90)) {
            result = isPolygonsColliding(polygon, p.polygon);
        }
        return result;
    };
    // If the point has already intersected a different point, chances are
    // they are still intersecting. So as an enhancement we check this
    // first.
    if (lastCollidedWith) {
        intersects = isIntersecting(lastCollidedWith);
        // If they no longer intersects, remove the cache from the point.
        if (!intersects) {
            delete point.lastCollidedWith;
        }
    }
    // If not already found, then check if we can find a point that is
    // intersecting.
    if (!intersects) {
        intersects = !!find(points, function (p) {
            var result = isIntersecting(p);
            if (result) {
                point.lastCollidedWith = p;
            }
            return result;
        });
    }
    return intersects;
}
/**
 * Gives a set of cordinates for an Archimedian Spiral.
 *
 * @private
 * @function archimedeanSpiral
 *
 * @param {number} attempt
 * How far along the spiral we have traversed.
 *
 * @param {Highcharts.WordcloudSpiralParamsObject} [params]
 * Additional parameters.
 *
 * @return {boolean|Highcharts.PositionObject}
 * Resulting coordinates, x and y. False if the word should be dropped from
 * the visualization.
 */
function archimedeanSpiral(attempt, params) {
    var field = params.field, result = false, maxDelta = (field.width * field.width) + (field.height * field.height), t = attempt * 0.8; // 0.2 * 4 = 0.8. Enlarging the spiral.
    // Emergency brake. TODO make spiralling logic more foolproof.
    if (attempt <= 10000) {
        result = {
            x: t * Math.cos(t),
            y: t * Math.sin(t)
        };
        if (!(Math.min(Math.abs(result.x), Math.abs(result.y)) < maxDelta)) {
            result = false;
        }
    }
    return result;
}
/**
 * Gives a set of cordinates for an rectangular spiral.
 *
 * @private
 * @function squareSpiral
 *
 * @param {number} attempt
 * How far along the spiral we have traversed.
 *
 * @param {Highcharts.WordcloudSpiralParamsObject} [params]
 * Additional parameters.
 *
 * @return {boolean|Highcharts.PositionObject}
 * Resulting coordinates, x and y. False if the word should be dropped from
 * the visualization.
 */
function squareSpiral(attempt, params) {
    var a = attempt * 4, k = Math.ceil((Math.sqrt(a) - 1) / 2), t = 2 * k + 1, m = Math.pow(t, 2), isBoolean = function (x) {
        return typeof x === 'boolean';
    }, result = false;
    t -= 1;
    if (attempt <= 10000) {
        if (isBoolean(result) && a >= m - t) {
            result = {
                x: k - (m - a),
                y: -k
            };
        }
        m -= t;
        if (isBoolean(result) && a >= m - t) {
            result = {
                x: -k,
                y: -k + (m - a)
            };
        }
        m -= t;
        if (isBoolean(result)) {
            if (a >= m - t) {
                result = {
                    x: -k + (m - a),
                    y: k
                };
            }
            else {
                result = {
                    x: k,
                    y: k - (m - a - t)
                };
            }
        }
        result.x *= 5;
        result.y *= 5;
    }
    return result;
}
/**
 * Gives a set of cordinates for an rectangular spiral.
 *
 * @private
 * @function rectangularSpiral
 *
 * @param {number} attempt
 * How far along the spiral we have traversed.
 *
 * @param {Highcharts.WordcloudSpiralParamsObject} [params]
 * Additional parameters.
 *
 * @return {boolean|Higcharts.PositionObject}
 * Resulting coordinates, x and y. False if the word should be dropped from
 * the visualization.
 */
function rectangularSpiral(attempt, params) {
    var result = squareSpiral(attempt, params), field = params.field;
    if (result) {
        result.x *= field.ratioX;
        result.y *= field.ratioY;
    }
    return result;
}
/**
 * @private
 * @function getRandomPosition
 *
 * @param {number} size
 * Random factor.
 *
 * @return {number}
 * Random position.
 */
function getRandomPosition(size) {
    return Math.round((size * (Math.random() + 0.5)) / 2);
}
/**
 * Calculates the proper scale to fit the cloud inside the plotting area.
 *
 * @private
 * @function getScale
 *
 * @param {number} targetWidth
 * Width of target area.
 *
 * @param {number} targetHeight
 * Height of target area.
 *
 * @param {Object} field
 * The playing field.
 *
 * @param {Highcharts.Series} series
 * Series object.
 *
 * @return {number}
 * Returns the value to scale the playing field up to the size of the target
 * area.
 */
function getScale(targetWidth, targetHeight, field) {
    var height = Math.max(Math.abs(field.top), Math.abs(field.bottom)) * 2, width = Math.max(Math.abs(field.left), Math.abs(field.right)) * 2, scaleX = width > 0 ? 1 / width * targetWidth : 1, scaleY = height > 0 ? 1 / height * targetHeight : 1;
    return Math.min(scaleX, scaleY);
}
/**
 * Calculates what is called the playing field. The field is the area which
 * all the words are allowed to be positioned within. The area is
 * proportioned to match the target aspect ratio.
 *
 * @private
 * @function getPlayingField
 *
 * @param {number} targetWidth
 * Width of the target area.
 *
 * @param {number} targetHeight
 * Height of the target area.
 *
 * @param {Array<Highcharts.Point>} data
 * Array of points.
 *
 * @param {Object} data.dimensions
 * The height and width of the word.
 *
 * @return {Object}
 * The width and height of the playing field.
 */
function getPlayingField(targetWidth, targetHeight, data) {
    var info = data.reduce(function (obj, point) {
        var dimensions = point.dimensions, x = Math.max(dimensions.width, dimensions.height);
        // Find largest height.
        obj.maxHeight = Math.max(obj.maxHeight, dimensions.height);
        // Find largest width.
        obj.maxWidth = Math.max(obj.maxWidth, dimensions.width);
        // Sum up the total maximum area of all the words.
        obj.area += x * x;
        return obj;
    }, {
        maxHeight: 0,
        maxWidth: 0,
        area: 0
    }), 
    /**
     * Use largest width, largest height, or root of total area to give
     * size to the playing field.
     */
    x = Math.max(info.maxHeight, // Have enough space for the tallest word
    info.maxWidth, // Have enough space for the broadest word
    // Adjust 15% to account for close packing of words
    Math.sqrt(info.area) * 0.85), ratioX = targetWidth > targetHeight ? targetWidth / targetHeight : 1, ratioY = targetHeight > targetWidth ? targetHeight / targetWidth : 1;
    return {
        width: x * ratioX,
        height: x * ratioY,
        ratioX: ratioX,
        ratioY: ratioY
    };
}
/**
 * Calculates a number of degrees to rotate, based upon a number of
 * orientations within a range from-to.
 *
 * @private
 * @function getRotation
 *
 * @param {number} [orientations]
 * Number of orientations.
 *
 * @param {number} [index]
 * Index of point, used to decide orientation.
 *
 * @param {number} [from]
 * The smallest degree of rotation.
 *
 * @param {number} [to]
 * The largest degree of rotation.
 *
 * @return {boolean|number}
 * Returns the resulting rotation for the word. Returns false if invalid
 * input parameters.
 */
function getRotation(orientations, index, from, to) {
    var result = false, // Default to false
    range, intervals, orientation;
    // Check if we have valid input parameters.
    if (isNumber(orientations) &&
        isNumber(index) &&
        isNumber(from) &&
        isNumber(to) &&
        orientations > 0 &&
        index > -1 &&
        to > from) {
        range = to - from;
        intervals = range / (orientations - 1 || 1);
        orientation = index % orientations;
        result = from + (orientation * intervals);
    }
    return result;
}
/**
 * Calculates the spiral positions and store them in scope for quick access.
 *
 * @private
 * @function getSpiral
 *
 * @param {Function} fn
 * The spiral function.
 *
 * @param {Object} params
 * Additional parameters for the spiral.
 *
 * @return {Function}
 * Function with access to spiral positions.
 */
function getSpiral(fn, params) {
    var length = 10000, i, arr = [];
    for (i = 1; i < length; i++) {
        // @todo unnecessary amount of precaclulation
        arr.push(fn(i, params));
    }
    return function (attempt) {
        return attempt <= length ? arr[attempt - 1] : false;
    };
}
/**
 * Detects if a word is placed outside the playing field.
 *
 * @private
 * @function outsidePlayingField
 *
 * @param {Highcharts.PolygonBoxObject} rect
 * The word box.
 *
 * @param {Highcharts.WordcloudFieldObject} field
 * The width and height of the playing field.
 *
 * @return {boolean}
 * Returns true if the word is placed outside the field.
 */
function outsidePlayingField(rect, field) {
    var playingField = {
        left: -(field.width / 2),
        right: field.width / 2,
        top: -(field.height / 2),
        bottom: field.height / 2
    };
    return !(playingField.left < rect.left &&
        playingField.right > rect.right &&
        playingField.top < rect.top &&
        playingField.bottom > rect.bottom);
}
/**
 * @private
 */
function movePolygon(deltaX, deltaY, polygon) {
    return polygon.map(function (point) {
        return [
            point[0] + deltaX,
            point[1] + deltaY
        ];
    });
}
/**
 * Check if a point intersects with previously placed words, or if it goes
 * outside the field boundaries. If a collision, then try to adjusts the
 * position.
 *
 * @private
 * @function intersectionTesting
 *
 * @param {Highcharts.Point} point
 * Point to test for intersections.
 *
 * @param {Highcharts.WordcloudTestOptionsObject} options
 * Options object.
 *
 * @return {boolean|Highcharts.PositionObject}
 * Returns an object with how much to correct the positions. Returns false
 * if the word should not be placed at all.
 */
function intersectionTesting(point, options) {
    var placed = options.placed, field = options.field, rectangle = options.rectangle, polygon = options.polygon, spiral = options.spiral, attempt = 1, delta = {
        x: 0,
        y: 0
    }, 
    // Make a copy to update values during intersection testing.
    rect = point.rect = extend({}, rectangle);
    point.polygon = polygon;
    point.rotation = options.rotation;
    /* while w intersects any previously placed words:
        do {
        move w a little bit along a spiral path
        } while any part of w is outside the playing field and
                the spiral radius is still smallish */
    while (delta !== false &&
        (intersectsAnyWord(point, placed) ||
            outsidePlayingField(rect, field))) {
        delta = spiral(attempt);
        if (isObject(delta)) {
            // Update the DOMRect with new positions.
            rect.left = rectangle.left + delta.x;
            rect.right = rectangle.right + delta.x;
            rect.top = rectangle.top + delta.y;
            rect.bottom = rectangle.bottom + delta.y;
            point.polygon = movePolygon(delta.x, delta.y, polygon);
        }
        attempt++;
    }
    return delta;
}
/**
 * Extends the playing field to have enough space to fit a given word.
 *
 * @private
 * @function extendPlayingField
 *
 * @param {Highcharts.WordcloudFieldObject} field
 * The width, height and ratios of a playing field.
 *
 * @param {Highcharts.PolygonBoxObject} rectangle
 * The bounding box of the word to add space for.
 *
 * @return {Highcharts.WordcloudFieldObject}
 * Returns the extended playing field with updated height and width.
 */
function extendPlayingField(field, rectangle) {
    var height, width, ratioX, ratioY, x, extendWidth, extendHeight, result;
    if (isObject(field) && isObject(rectangle)) {
        height = (rectangle.bottom - rectangle.top);
        width = (rectangle.right - rectangle.left);
        ratioX = field.ratioX;
        ratioY = field.ratioY;
        // Use the same variable to extend both the height and width.
        x = ((width * ratioX) > (height * ratioY)) ? width : height;
        // Multiply variable with ratios to preserve aspect ratio.
        extendWidth = x * ratioX;
        extendHeight = x * ratioY;
        // Calculate the size of the new field after adding
        // space for the word.
        result = merge(field, {
            // Add space on the left and right.
            width: field.width + (extendWidth * 2),
            // Add space on the top and bottom.
            height: field.height + (extendHeight * 2)
        });
    }
    else {
        result = field;
    }
    // Return the new extended field.
    return result;
}
/**
 * If a rectangle is outside a give field, then the boundaries of the field
 * is adjusted accordingly. Modifies the field object which is passed as the
 * first parameter.
 *
 * @private
 * @function updateFieldBoundaries
 *
 * @param {Highcharts.WordcloudFieldObject} field
 * The bounding box of a playing field.
 *
 * @param {Highcharts.PolygonBoxObject} rectangle
 * The bounding box for a placed point.
 *
 * @return {Highcharts.WordcloudFieldObject}
 * Returns a modified field object.
 */
function updateFieldBoundaries(field, rectangle) {
    // @todo improve type checking.
    if (!isNumber(field.left) || field.left > rectangle.left) {
        field.left = rectangle.left;
    }
    if (!isNumber(field.right) || field.right < rectangle.right) {
        field.right = rectangle.right;
    }
    if (!isNumber(field.top) || field.top > rectangle.top) {
        field.top = rectangle.top;
    }
    if (!isNumber(field.bottom) || field.bottom < rectangle.bottom) {
        field.bottom = rectangle.bottom;
    }
    return field;
}
/**
 * Alternative solution to correctFloat.
 * E.g Highcharts.correctFloat(123, 2) returns 120, when it should be 123.
 *
 * @private
 * @function correctFloat
 */
function correctFloat(number, precision) {
    var p = isNumber(precision) ? precision : 14, magnitude = Math.pow(10, p);
    return Math.round(number * magnitude) / magnitude;
}
/**
 * @private
 */
function getBoundingBoxFromPolygon(points) {
    return points.reduce(function (obj, point) {
        var x = point[0], y = point[1];
        obj.left = Math.min(x, obj.left);
        obj.right = Math.max(x, obj.right);
        obj.bottom = Math.max(y, obj.bottom);
        obj.top = Math.min(y, obj.top);
        return obj;
    }, {
        left: Number.MAX_VALUE,
        right: -Number.MAX_VALUE,
        bottom: -Number.MAX_VALUE,
        top: Number.MAX_VALUE
    });
}
/**
 * @private
 */
function getPolygon(x, y, width, height, rotation) {
    var origin = [x, y], left = x - (width / 2), right = x + (width / 2), top = y - (height / 2), bottom = y + (height / 2), polygon = [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom]
    ];
    return polygon.map(function (point) {
        return rotate2DToPoint(point, origin, -rotation);
    });
}
/**
 * Rotates a point clockwise around the origin.
 *
 * @private
 * @function rotate2DToOrigin
 * @param {Highcharts.PolygonPointObject} point
 *        The x and y coordinates for the point.
 * @param {number} angle
 *        The angle of rotation.
 * @return {Highcharts.PolygonPointObject}
 *         The x and y coordinate for the rotated point.
 */
function rotate2DToOrigin(point, angle) {
    var x = point[0], y = point[1], rad = deg2rad * -angle, cosAngle = Math.cos(rad), sinAngle = Math.sin(rad);
    return [
        correctFloat(x * cosAngle - y * sinAngle),
        correctFloat(x * sinAngle + y * cosAngle)
    ];
}
/**
 * Rotate a point clockwise around another point.
 *
 * @private
 * @function rotate2DToPoint
 * @param {Highcharts.PolygonPointObject} point
 *        The x and y coordinates for the point.
 * @param {Highcharts.PolygonPointObject} origin
 *        The point to rotate around.
 * @param {number} angle
 *        The angle of rotation.
 * @return {Highcharts.PolygonPointObject}
 *         The x and y coordinate for the rotated point.
 */
function rotate2DToPoint(point, origin, angle) {
    var x = point[0] - origin[0], y = point[1] - origin[1], rotated = rotate2DToOrigin([x, y], angle);
    return [
        rotated[0] + origin[0],
        rotated[1] + origin[1]
    ];
}
/* *
 *
 * Default export
 *
 * */
var WordcloudUtils = {
    archimedeanSpiral: archimedeanSpiral,
    extendPlayingField: extendPlayingField,
    getBoundingBoxFromPolygon: getBoundingBoxFromPolygon,
    getPlayingField: getPlayingField,
    getPolygon: getPolygon,
    getRandomPosition: getRandomPosition,
    getRotation: getRotation,
    getScale: getScale,
    getSpiral: getSpiral,
    intersectionTesting: intersectionTesting,
    isPolygonsColliding: isPolygonsColliding,
    isRectanglesIntersecting: isRectanglesIntersecting,
    rectangularSpiral: rectangularSpiral,
    rotate2DToOrigin: rotate2DToOrigin,
    rotate2DToPoint: rotate2DToPoint,
    squareSpiral: squareSpiral,
    updateFieldBoundaries: updateFieldBoundaries
};
export default WordcloudUtils;
