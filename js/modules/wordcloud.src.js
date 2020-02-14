/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2020 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var extend = U.extend, find = U.find, isArray = U.isArray, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge, seriesType = U.seriesType;
import drawPoint from '../mixins/draw-point.js';
import polygon from '../mixins/polygon.js';
import '../parts/Series.js';
var noop = H.noop, getBoundingBoxFromPolygon = polygon.getBoundingBoxFromPolygon, getPolygon = polygon.getPolygon, isPolygonsColliding = polygon.isPolygonsColliding, movePolygon = polygon.movePolygon, Series = H.Series;
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
    // If the point has already intersected a different point, chances are they
    // are still intersecting. So as an enhancement we check this first.
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
 * Resulting coordinates, x and y. False if the word should be dropped from the
 * visualization.
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
 * Resulting coordinates, x and y. False if the word should be dropped from the
 * visualization.
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
 * Resulting coordinates, x and y. False if the word should be dropped from the
 * visualization.
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
 * @param {object} field
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
 * Calculates what is called the playing field. The field is the area which all
 * the words are allowed to be positioned within. The area is proportioned to
 * match the target aspect ratio.
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
 * @param {object} data.dimensions
 * The height and width of the word.
 *
 * @return {object}
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
     * Use largest width, largest height, or root of total area to give size
     * to the playing field.
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
 * Calculates a number of degrees to rotate, based upon a number of orientations
 * within a range from-to.
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
 * Returns the resulting rotation for the word. Returns false if invalid input
 * parameters.
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
 * @param {object} params
 * Additional parameters for the spiral.
 *
 * @return {Function}
 * Function with access to spiral positions.
 */
function getSpiral(fn, params) {
    var length = 10000, i, arr = [];
    for (i = 1; i < length; i++) {
        arr.push(fn(i, params)); // @todo unnecessary amount of precaclulation
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
 * Returns an object with how much to correct the positions. Returns false if
 * the word should not be placed at all.
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
        // Calculate the size of the new field after adding space for the word.
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
 * If a rectangle is outside a give field, then the boundaries of the field is
 * adjusted accordingly. Modifies the field object which is passed as the first
 * parameter.
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
 * A word cloud is a visualization of a set of words, where the size and
 * placement of a word is determined by how it is weighted.
 *
 * @sample highcharts/demo/wordcloud
 *         Word Cloud chart
 *
 * @extends      plotOptions.column
 * @excluding    allAreas, boostThreshold, clip, colorAxis, compare,
 *               compareBase, crisp, cropTreshold, dataGrouping, dataLabels,
 *               depth, dragDrop, edgeColor, findNearestPointBy,
 *               getExtremesFromAll, grouping, groupPadding, groupZPadding,
 *               joinBy, maxPointWidth, minPointLength, navigatorOptions,
 *               negativeColor, pointInterval, pointIntervalUnit, pointPadding,
 *               pointPlacement, pointRange, pointStart, pointWidth, pointStart,
 *               pointWidth, shadow, showCheckbox, showInNavigator,
 *               softThreshold, stacking, threshold, zoneAxis, zones,
 *               dataSorting
 * @product      highcharts
 * @since        6.0.0
 * @requires     modules/wordcloud
 * @optionparent plotOptions.wordcloud
 */
var wordCloudOptions = {
    /**
     * If there is no space for a word on the playing field, then this option
     * will allow the playing field to be extended to fit the word. If false
     * then the word will be dropped from the visualization.
     *
     * NB! This option is currently not decided to be published in the API, and
     * is therefore marked as private.
     *
     * @private
     */
    allowExtendPlayingField: true,
    animation: {
        /** @internal */
        duration: 500
    },
    borderWidth: 0,
    clip: false,
    colorByPoint: true,
    /**
     * A threshold determining the minimum font size that can be applied to a
     * word.
     */
    minFontSize: 1,
    /**
     * The word with the largest weight will have a font size equal to this
     * value. The font size of a word is the ratio between its weight and the
     * largest occuring weight, multiplied with the value of maxFontSize.
     */
    maxFontSize: 25,
    /**
     * This option decides which algorithm is used for placement, and rotation
     * of a word. The choice of algorith is therefore a crucial part of the
     * resulting layout of the wordcloud. It is possible for users to add their
     * own custom placement strategies for use in word cloud. Read more about it
     * in our
     * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-placement-strategies)
     *
     * @validvalue: ["center", "random"]
     */
    placementStrategy: 'center',
    /**
     * Rotation options for the words in the wordcloud.
     *
     * @sample highcharts/plotoptions/wordcloud-rotation
     *         Word cloud with rotation
     */
    rotation: {
        /**
         * The smallest degree of rotation for a word.
         */
        from: 0,
        /**
         * The number of possible orientations for a word, within the range of
         * `rotation.from` and `rotation.to`. Must be a number larger than 0.
         */
        orientations: 2,
        /**
         * The largest degree of rotation for a word.
         */
        to: 90
    },
    showInLegend: false,
    /**
     * Spiral used for placing a word after the initial position experienced a
     * collision with either another word or the borders.
     * It is possible for users to add their own custom spiralling algorithms
     * for use in word cloud. Read more about it in our
     * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-spiralling-algorithm)
     *
     * @validvalue: ["archimedean", "rectangular", "square"]
     */
    spiral: 'rectangular',
    /**
     * CSS styles for the words.
     *
     * @type    {Highcharts.CSSObject}
     * @default {"fontFamily":"sans-serif", "fontWeight": "900"}
     */
    style: {
        /** @ignore-option */
        fontFamily: 'sans-serif',
        /** @ignore-option */
        fontWeight: '900',
        /** @ignore-option */
        whiteSpace: 'nowrap'
    },
    tooltip: {
        followPointer: true,
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.weight}</b><br/>'
    }
};
// Properties of the WordCloud series.
var wordCloudSeries = {
    animate: Series.prototype.animate,
    animateDrilldown: noop,
    animateDrillupFrom: noop,
    setClip: noop,
    bindAxes: function () {
        var wordcloudAxis = {
            endOnTick: false,
            gridLineWidth: 0,
            lineWidth: 0,
            maxPadding: 0,
            startOnTick: false,
            title: null,
            tickPositions: []
        };
        Series.prototype.bindAxes.call(this);
        extend(this.yAxis.options, wordcloudAxis);
        extend(this.xAxis.options, wordcloudAxis);
    },
    pointAttribs: function (point, state) {
        var attribs = H.seriesTypes.column.prototype
            .pointAttribs.call(this, point, state);
        delete attribs.stroke;
        delete attribs['stroke-width'];
        return attribs;
    },
    /**
     * Calculates the fontSize of a word based on its weight.
     *
     * @private
     * @function Highcharts.Series#deriveFontSize
     *
     * @param {number} [relativeWeight=0]
     * The weight of the word, on a scale 0-1.
     *
     * @param {number} [maxFontSize=1]
     * The maximum font size of a word.
     *
     * @param {number} [minFontSize=1]
     * The minimum font size of a word.
     *
     * @return {number}
     * Returns the resulting fontSize of a word. If minFontSize is larger then
     * maxFontSize the result will equal minFontSize.
     */
    deriveFontSize: function deriveFontSize(relativeWeight, maxFontSize, minFontSize) {
        var weight = isNumber(relativeWeight) ? relativeWeight : 0, max = isNumber(maxFontSize) ? maxFontSize : 1, min = isNumber(minFontSize) ? minFontSize : 1;
        return Math.floor(Math.max(min, weight * max));
    },
    drawPoints: function () {
        var series = this, hasRendered = series.hasRendered, xAxis = series.xAxis, yAxis = series.yAxis, chart = series.chart, group = series.group, options = series.options, animation = options.animation, allowExtendPlayingField = options.allowExtendPlayingField, renderer = chart.renderer, testElement = renderer.text().add(group), placed = [], placementStrategy = series.placementStrategy[options.placementStrategy], spiral, rotation = options.rotation, scale, weights = series.points.map(function (p) {
            return p.weight;
        }), maxWeight = Math.max.apply(null, weights), 
        // concat() prevents from sorting the original array.
        data = series.points.concat().sort(function (a, b) {
            return b.weight - a.weight; // Sort descending
        }), field;
        // Reset the scale before finding the dimensions (#11993).
        // SVGGRaphicsElement.getBBox() (used in SVGElement.getBBox(boolean))
        // returns slightly different values for the same element depending on
        // whether it is rendered in a group which has already defined scale
        // (e.g. 6) or in the group without a scale (scale = 1).
        series.group.attr({
            scaleX: 1,
            scaleY: 1
        });
        // Get the dimensions for each word.
        // Used in calculating the playing field.
        data.forEach(function (point) {
            var relativeWeight = 1 / maxWeight * point.weight, fontSize = series.deriveFontSize(relativeWeight, options.maxFontSize, options.minFontSize), css = extend({
                fontSize: fontSize + 'px'
            }, options.style), bBox;
            testElement.css(css).attr({
                x: 0,
                y: 0,
                text: point.name
            });
            bBox = testElement.getBBox(true);
            point.dimensions = {
                height: bBox.height,
                width: bBox.width
            };
        });
        // Calculate the playing field.
        field = getPlayingField(xAxis.len, yAxis.len, data);
        spiral = getSpiral(series.spirals[options.spiral], {
            field: field
        });
        // Draw all the points.
        data.forEach(function (point) {
            var relativeWeight = 1 / maxWeight * point.weight, fontSize = series.deriveFontSize(relativeWeight, options.maxFontSize, options.minFontSize), css = extend({
                fontSize: fontSize + 'px'
            }, options.style), placement = placementStrategy(point, {
                data: data,
                field: field,
                placed: placed,
                rotation: rotation
            }), attr = extend(series.pointAttribs(point, (point.selected && 'select')), {
                align: 'center',
                'alignment-baseline': 'middle',
                x: placement.x,
                y: placement.y,
                text: point.name,
                rotation: placement.rotation
            }), polygon = getPolygon(placement.x, placement.y, point.dimensions.width, point.dimensions.height, placement.rotation), rectangle = getBoundingBoxFromPolygon(polygon), delta = intersectionTesting(point, {
                rectangle: rectangle,
                polygon: polygon,
                field: field,
                placed: placed,
                spiral: spiral,
                rotation: placement.rotation
            }), animate;
            // If there is no space for the word, extend the playing field.
            if (!delta && allowExtendPlayingField) {
                // Extend the playing field to fit the word.
                field = extendPlayingField(field, rectangle);
                // Run intersection testing one more time to place the word.
                delta = intersectionTesting(point, {
                    rectangle: rectangle,
                    polygon: polygon,
                    field: field,
                    placed: placed,
                    spiral: spiral,
                    rotation: placement.rotation
                });
            }
            // Check if point was placed, if so delete it, otherwise place it on
            // the correct positions.
            if (isObject(delta)) {
                attr.x += delta.x;
                attr.y += delta.y;
                rectangle.left += delta.x;
                rectangle.right += delta.x;
                rectangle.top += delta.y;
                rectangle.bottom += delta.y;
                field = updateFieldBoundaries(field, rectangle);
                placed.push(point);
                point.isNull = false;
            }
            else {
                point.isNull = true;
            }
            if (animation) {
                // Animate to new positions
                animate = {
                    x: attr.x,
                    y: attr.y
                };
                // Animate from center of chart
                if (!hasRendered) {
                    attr.x = 0;
                    attr.y = 0;
                    // or animate from previous position
                }
                else {
                    delete attr.x;
                    delete attr.y;
                }
            }
            point.draw({
                animatableAttribs: animate,
                attribs: attr,
                css: css,
                group: group,
                renderer: renderer,
                shapeArgs: void 0,
                shapeType: 'text'
            });
        });
        // Destroy the element after use.
        testElement = testElement.destroy();
        // Scale the series group to fit within the plotArea.
        scale = getScale(xAxis.len, yAxis.len, field);
        series.group.attr({
            scaleX: scale,
            scaleY: scale
        });
    },
    hasData: function () {
        var series = this;
        return (isObject(series) &&
            series.visible === true &&
            isArray(series.points) &&
            series.points.length > 0);
    },
    // Strategies used for deciding rotation and initial position of a word. To
    // implement a custom strategy, have a look at the function random for
    // example.
    placementStrategy: {
        random: function (point, options) {
            var field = options.field, r = options.rotation;
            return {
                x: getRandomPosition(field.width) - (field.width / 2),
                y: getRandomPosition(field.height) - (field.height / 2),
                rotation: getRotation(r.orientations, point.index, r.from, r.to)
            };
        },
        center: function (point, options) {
            var r = options.rotation;
            return {
                x: 0,
                y: 0,
                rotation: getRotation(r.orientations, point.index, r.from, r.to)
            };
        }
    },
    pointArrayMap: ['weight'],
    // Spirals used for placing a word after the initial position experienced a
    // collision with either another word or the borders. To implement a custom
    // spiral, look at the function archimedeanSpiral for example.
    spirals: {
        'archimedean': archimedeanSpiral,
        'rectangular': rectangularSpiral,
        'square': squareSpiral
    },
    utils: {
        extendPlayingField: extendPlayingField,
        getRotation: getRotation,
        isPolygonsColliding: isPolygonsColliding,
        rotate2DToOrigin: polygon.rotate2DToOrigin,
        rotate2DToPoint: polygon.rotate2DToPoint
    },
    getPlotBox: function () {
        var series = this, chart = series.chart, inverted = chart.inverted, 
        // Swap axes for inverted (#2339)
        xAxis = series[(inverted ? 'yAxis' : 'xAxis')], yAxis = series[(inverted ? 'xAxis' : 'yAxis')], width = xAxis ? xAxis.len : chart.plotWidth, height = yAxis ? yAxis.len : chart.plotHeight, x = xAxis ? xAxis.left : chart.plotLeft, y = yAxis ? yAxis.top : chart.plotTop;
        return {
            translateX: x + (width / 2),
            translateY: y + (height / 2),
            scaleX: 1,
            scaleY: 1
        };
    }
};
// Properties of the Sunburst series.
var wordCloudPoint = {
    draw: drawPoint,
    shouldDraw: function shouldDraw() {
        var point = this;
        return !point.isNull;
    },
    isValid: function isValid() {
        return true;
    },
    weight: 1
};
/**
 * A `wordcloud` series. If the [type](#series.wordcloud.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.wordcloud
 * @exclude   dataSorting
 * @product   highcharts
 * @requires  modules/wordcloud
 * @apioption series.wordcloud
 */
/**
 * An array of data points for the series. For the `wordcloud` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 2 values. In this case, the values correspond to
 *    `name,weight`.
 *    ```js
 *    data: [
 *        ['Lorem', 4],
 *        ['Ipsum', 1]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.arearange.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        name: "Lorem",
 *        weight: 4
 *    }, {
 *        name: "Ipsum",
 *        weight: 1
 *    }]
 *    ```
 *
 * @type      {Array<Array<string,number>|*>}
 * @extends   series.line.data
 * @excluding drilldown, marker, x, y
 * @product   highcharts
 * @apioption series.wordcloud.data
 */
/**
 * The name decides the text for a word.
 *
 * @type      {string}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.name
 */
/**
 * The weighting of a word. The weight decides the relative size of a word
 * compared to the rest of the collection.
 *
 * @type      {number}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.weight
 */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.wordcloud
 *
 * @augments Highcharts.Series
 */
seriesType('wordcloud', 'column', wordCloudOptions, wordCloudSeries, wordCloudPoint);
