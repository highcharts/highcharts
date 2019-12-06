/* *
 *
 *  Module for using patterns or images as point fills.
 *
 *  (c) 2010-2019 Highsoft AS
 *  Author: Torstein Hønsi, Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
/**
 * Pattern options
 *
 * @interface Highcharts.PatternOptionsObject
 */ /**
* Background color for the pattern if a `path` is set (not images).
* @name Highcharts.PatternOptionsObject#backgroundColor
* @type {Highcharts.ColorString}
*/ /**
* URL to an image to use as the pattern.
* @name Highcharts.PatternOptionsObject#image
* @type {string}
*/ /**
* Width of the pattern. For images this is automatically set to the width of
* the element bounding box if not supplied. For non-image patterns the default
* is 32px. Note that automatic resizing of image patterns to fill a bounding
* box dynamically is only supported for patterns with an automatically
* calculated ID.
* @name Highcharts.PatternOptionsObject#width
* @type {number}
*/ /**
* Analogous to pattern.width.
* @name Highcharts.PatternOptionsObject#height
* @type {number}
*/ /**
* For automatically calculated width and height on images, it is possible to
* set an aspect ratio. The image will be zoomed to fill the bounding box,
* maintaining the aspect ratio defined.
* @name Highcharts.PatternOptionsObject#aspectRatio
* @type {number}
*/ /**
* Horizontal offset of the pattern. Defaults to 0.
* @name Highcharts.PatternOptionsObject#x
* @type {number|undefined}
*/ /**
* Vertical offset of the pattern. Defaults to 0.
* @name Highcharts.PatternOptionsObject#y
* @type {number|undefined}
*/ /**
* Either an SVG path as string, or an object. As an object, supply the path
* string in the `path.d` property. Other supported properties are standard SVG
* attributes like `path.stroke` and `path.fill`. If a path is supplied for the
* pattern, the `image` property is ignored.
* @name Highcharts.PatternOptionsObject#path
* @type {string|Highcharts.SVGAttributes}
*/ /**
* Pattern color, used as default path stroke.
* @name Highcharts.PatternOptionsObject#color
* @type {Highcharts.ColorString}
*/ /**
* Opacity of the pattern as a float value from 0 to 1.
* @name Highcharts.PatternOptionsObject#opacity
* @type {number}
*/ /**
* ID to assign to the pattern. This is automatically computed if not added, and
* identical patterns are reused. To refer to an existing pattern for a
* Highcharts color, use `color: "url(#pattern-id)"`.
* @name Highcharts.PatternOptionsObject#id
* @type {string|undefined}
*/
/**
 * Holds a pattern definition.
 *
 * @sample highcharts/series/pattern-fill-area/
 *         Define a custom path pattern
 * @sample highcharts/series/pattern-fill-pie/
 *         Default patterns and a custom image pattern
 * @sample maps/demo/pattern-fill-map/
 *         Custom images on map
 *
 * @example
 * // Pattern used as a color option
 * color: {
 *     pattern: {
 *            path: {
 *                 d: 'M 3 3 L 8 3 L 8 8 Z',
 *                fill: '#102045'
 *            },
 *            width: 12,
 *            height: 12,
 *            color: '#907000',
 *            opacity: 0.5
 *     }
 * }
 *
 * @interface Highcharts.PatternObject
 */ /**
* Pattern options
* @name Highcharts.PatternObject#pattern
* @type {Highcharts.PatternOptionsObject}
*/ /**
* Animation options for the image pattern loading.
* @name Highcharts.PatternObject#animation
* @type {boolean|Highcharts.AnimationOptionsObject|undefined}
*/ /**
* Optionally an index referencing which pattern to use. Highcharts adds
* 10 default patterns to the `Highcharts.patterns` array. Additional
* pattern definitions can be pushed to this array if desired. This option
* is an index into this array.
* @name Highcharts.PatternObject#patternIndex
* @type {number|undefined}
*/
import U from '../parts/Utilities.js';
var animObject = U.animObject, erase = U.erase, pick = U.pick, wrap = U.wrap;
var addEvent = H.addEvent, merge = H.merge;
// Add the predefined patterns
H.patterns = (function () {
    var patterns = [], colors = H.getOptions().colors;
    [
        'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
        'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
        'M 3 0 L 3 10 M 8 0 L 8 10',
        'M 0 3 L 10 3 M 0 8 L 10 8',
        'M 0 3 L 5 3 L 5 0 M 5 10 L 5 7 L 10 7',
        'M 3 3 L 8 3 L 8 8 L 3 8 Z',
        'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0',
        'M 10 3 L 5 3 L 5 0 M 5 10 L 5 7 L 0 7',
        'M 2 5 L 5 2 L 8 5 L 5 8 Z',
        'M 0 0 L 5 10 L 10 0'
    ].forEach(function (pattern, i) {
        patterns.push({
            path: pattern,
            color: colors[i],
            width: 10,
            height: 10
        });
    });
    return patterns;
})();
/**
 * Utility function to compute a hash value from an object. Modified Java
 * String.hashCode implementation in JS. Use the preSeed parameter to add an
 * additional seeding step.
 *
 * @private
 * @function hashFromObject
 *
 * @param {object} obj
 *        The javascript object to compute the hash from.
 *
 * @param {boolean} [preSeed=false]
 *        Add an optional preSeed stage.
 *
 * @return {string}
 *         The computed hash.
 */
function hashFromObject(obj, preSeed) {
    var str = JSON.stringify(obj), strLen = str.length || 0, hash = 0, i = 0, char, seedStep;
    if (preSeed) {
        seedStep = Math.max(Math.floor(strLen / 500), 1);
        for (var a = 0; a < strLen; a += seedStep) {
            hash += str.charCodeAt(a);
        }
        hash = hash & hash;
    }
    for (; i < strLen; ++i) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16).replace('-', '1');
}
/**
 * Set dimensions on pattern from point. This function will set internal
 * pattern._width/_height properties if width and height are not both already
 * set. We only do this on image patterns. The _width/_height properties are set
 * to the size of the bounding box of the point, optionally taking aspect ratio
 * into account. If only one of width or height are supplied as options, the
 * undefined option is calculated as above.
 *
 * @private
 * @function Highcharts.Point#calculatePatternDimensions
 *
 * @param {Highcharts.PatternOptionsObject} pattern
 *        The pattern to set dimensions on.
 *
 * @return {void}
 *
 * @requires modules/pattern-fill
 */
H.Point.prototype.calculatePatternDimensions = function (pattern) {
    if (pattern.width && pattern.height) {
        return;
    }
    var bBox = this.graphic && (this.graphic.getBBox &&
        this.graphic.getBBox(true) ||
        this.graphic.element &&
            this.graphic.element.getBBox()) || {}, shapeArgs = this.shapeArgs;
    // Prefer using shapeArgs, as it is animation agnostic
    if (shapeArgs) {
        bBox.width = shapeArgs.width || bBox.width;
        bBox.height = shapeArgs.height || bBox.height;
        bBox.x = shapeArgs.x || bBox.x;
        bBox.y = shapeArgs.y || bBox.y;
    }
    // For images we stretch to bounding box
    if (pattern.image) {
        // If we do not have a bounding box at this point, simply add a defer
        // key and pick this up in the fillSetter handler, where the bounding
        // box should exist.
        if (!bBox.width || !bBox.height) {
            pattern._width = 'defer';
            pattern._height = 'defer';
            return;
        }
        // Handle aspect ratio filling
        if (pattern.aspectRatio) {
            bBox.aspectRatio = bBox.width / bBox.height;
            if (pattern.aspectRatio > bBox.aspectRatio) {
                // Height of bBox will determine width
                bBox.aspectWidth = bBox.height * pattern.aspectRatio;
            }
            else {
                // Width of bBox will determine height
                bBox.aspectHeight = bBox.width / pattern.aspectRatio;
            }
        }
        // We set the width/height on internal properties to differentiate
        // between the options set by a user and by this function.
        pattern._width = pattern.width ||
            Math.ceil(bBox.aspectWidth || bBox.width);
        pattern._height = pattern.height ||
            Math.ceil(bBox.aspectHeight || bBox.height);
    }
    // Set x/y accordingly, centering if using aspect ratio, otherwise adjusting
    // so bounding box corner is 0,0 of pattern.
    if (!pattern.width) {
        pattern._x = pattern.x || 0;
        pattern._x += bBox.x - Math.round(bBox.aspectWidth ?
            Math.abs(bBox.aspectWidth - bBox.width) / 2 :
            0);
    }
    if (!pattern.height) {
        pattern._y = pattern.y || 0;
        pattern._y += bBox.y - Math.round(bBox.aspectHeight ?
            Math.abs(bBox.aspectHeight - bBox.height) / 2 :
            0);
    }
};
/* eslint-disable no-invalid-this */
/**
 * Add a pattern to the renderer.
 *
 * @private
 * @function Highcharts.SVGRenderer#addPattern
 *
 * @param {Highcharts.PatternObject} options
 * The pattern options.
 *
 * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
 * The animation options.
 *
 * @return {Highcharts.SVGElement|undefined}
 * The added pattern. Undefined if the pattern already exists.
 *
 * @requires modules/pattern-fill
 */
H.SVGRenderer.prototype.addPattern = function (options, animation) {
    var pattern, animate = pick(animation, true), animationOptions = animObject(animate), path, defaultSize = 32, width = options.width || options._width || defaultSize, height = (options.height || options._height || defaultSize), color = options.color || '#343434', id = options.id, ren = this, rect = function (fill) {
        ren.rect(0, 0, width, height)
            .attr({ fill: fill })
            .add(pattern);
    }, attribs;
    if (!id) {
        this.idCounter = this.idCounter || 0;
        id = 'highcharts-pattern-' + this.idCounter + '-' + (this.chartIndex || 0);
        ++this.idCounter;
    }
    // Do nothing if ID already exists
    this.defIds = this.defIds || [];
    if (this.defIds.indexOf(id) > -1) {
        return;
    }
    // Store ID in list to avoid duplicates
    this.defIds.push(id);
    // Create pattern element
    pattern = this.createElement('pattern').attr({
        id: id,
        patternUnits: 'userSpaceOnUse',
        patternContentUnits: options.patternContentUnits || 'userSpaceOnUse',
        width: width,
        height: height,
        x: options._x || options.x || 0,
        y: options._y || options.y || 0
    }).add(this.defs);
    // Set id on the SVGRenderer object
    pattern.id = id;
    // Use an SVG path for the pattern
    if (options.path) {
        path = options.path;
        // The background
        if (options.backgroundColor) {
            rect(options.backgroundColor);
        }
        // The pattern
        attribs = {
            'd': path.d || path
        };
        if (!this.styledMode) {
            attribs.stroke = path.stroke || color;
            attribs['stroke-width'] = pick(path.strokeWidth, 2);
            attribs.fill = path.fill || 'none';
        }
        if (path.transform) {
            attribs.transform = path.transform;
        }
        this.createElement('path').attr(attribs).add(pattern);
        pattern.color = color;
        // Image pattern
    }
    else if (options.image) {
        if (animate) {
            this.image(options.image, 0, 0, width, height, function () {
                // Onload
                this.animate({
                    opacity: pick(options.opacity, 1)
                }, animationOptions);
                H.removeEvent(this.element, 'load');
            }).attr({ opacity: 0 }).add(pattern);
        }
        else {
            this.image(options.image, 0, 0, width, height).add(pattern);
        }
    }
    // For non-animated patterns, set opacity now
    if (!(options.image && animate) && typeof options.opacity !== 'undefined') {
        [].forEach.call(pattern.element.childNodes, function (child) {
            child.setAttribute('opacity', options.opacity);
        });
    }
    // Store for future reference
    this.patternElements = this.patternElements || {};
    this.patternElements[id] = pattern;
    return pattern;
};
// Make sure we have a series color
wrap(H.Series.prototype, 'getColor', function (proceed) {
    var oldColor = this.options.color;
    // Temporarely remove color options to get defaults
    if (oldColor &&
        oldColor.pattern &&
        !oldColor.pattern.color) {
        delete this.options.color;
        // Get default
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        // Replace with old, but add default color
        oldColor.pattern.color =
            this.color;
        this.color = this.options.color = oldColor;
    }
    else {
        // We have a color, no need to do anything special
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});
// Calculate pattern dimensions on points that have their own pattern.
addEvent(H.Series, 'render', function () {
    var isResizing = this.chart.isResizing;
    if (this.isDirtyData || isResizing || !this.chart.hasRendered) {
        (this.points || []).forEach(function (point) {
            var colorOptions = point.options && point.options.color;
            if (colorOptions &&
                colorOptions.pattern) {
                // For most points we want to recalculate the dimensions on
                // render, where we have the shape args and bbox. But if we
                // are resizing and don't have the shape args, defer it, since
                // the bounding box is still not resized.
                if (isResizing &&
                    !(point.shapeArgs &&
                        point.shapeArgs.width &&
                        point.shapeArgs.height)) {
                    colorOptions.pattern._width =
                        'defer';
                    colorOptions.pattern._height =
                        'defer';
                }
                else {
                    point.calculatePatternDimensions(colorOptions.pattern);
                }
            }
        });
    }
});
// Merge series color options to points
addEvent(H.Point, 'afterInit', function () {
    var point = this, colorOptions = point.options.color;
    // Only do this if we have defined a specific color on this point. Otherwise
    // we will end up trying to re-add the series color for each point.
    if (colorOptions && colorOptions.pattern) {
        // Move path definition to object, allows for merge with series path
        // definition
        if (typeof colorOptions.pattern.path === 'string') {
            colorOptions.pattern.path = {
                d: colorOptions.pattern.path
            };
        }
        // Merge with series options
        point.color = point.options.color = merge(point.series.options.color, colorOptions);
    }
});
// Add functionality to SVG renderer to handle patterns as complex colors
H.addEvent(H.SVGRenderer, 'complexColor', function (args) {
    var color = args.args[0], prop = args.args[1], element = args.args[2], chartIndex = (this.chartIndex || 0);
    var pattern = color.pattern, value = '#343434';
    // Handle patternIndex
    if (typeof color.patternIndex !== 'undefined' && H.patterns) {
        pattern = H.patterns[color.patternIndex];
    }
    // Skip and call default if there is no pattern
    if (!pattern) {
        return true;
    }
    // We have a pattern.
    if (pattern.image ||
        typeof pattern.path === 'string' ||
        pattern.path && pattern.path.d) {
        // Real pattern. Add it and set the color value to be a reference.
        // Force Hash-based IDs for legend items, as they are drawn before
        // point render, meaning they are drawn before autocalculated image
        // width/heights. We don't want them to highjack the width/height for
        // this ID if it is defined by users.
        var forceHashId = element.parentNode &&
            element.parentNode.getAttribute('class');
        forceHashId = forceHashId &&
            forceHashId.indexOf('highcharts-legend') > -1;
        // If we don't have a width/height yet, handle it. Try faking a point
        // and running the algorithm again.
        if (pattern._width === 'defer' || pattern._height === 'defer') {
            H.Point.prototype.calculatePatternDimensions.call({ graphic: { element: element } }, pattern);
        }
        // If we don't have an explicit ID, compute a hash from the
        // definition and use that as the ID. This ensures that points with
        // the same pattern definition reuse existing pattern elements by
        // default. We combine two hashes, the second with an additional
        // preSeed algorithm, to minimize collision probability.
        if (forceHashId || !pattern.id) {
            // Make a copy so we don't accidentally edit options when setting ID
            pattern = merge({}, pattern);
            pattern.id = 'highcharts-pattern-' + chartIndex + '-' +
                hashFromObject(pattern) + hashFromObject(pattern, true);
        }
        // Add it. This function does nothing if an element with this ID
        // already exists.
        this.addPattern(pattern, !this.forExport && pick(pattern.animation, this.globalAnimation, { duration: 100 }));
        value = "url(" + this.url + "#" + pattern.id + ")";
    }
    else {
        // Not a full pattern definition, just add color
        value = pattern.color || value;
    }
    // Set the fill/stroke prop on the element
    element.setAttribute(prop, value);
    // Allow the color to be concatenated into tooltips formatters etc.
    color.toString = function () {
        return value;
    };
    // Skip default handler
    return false;
});
// When animation is used, we have to recalculate pattern dimensions after
// resize, as the bounding boxes are not available until then.
H.addEvent(H.Chart, 'endResize', function () {
    if ((this.renderer && this.renderer.defIds || []).filter(function (id) {
        return (id &&
            id.indexOf &&
            id.indexOf('highcharts-pattern-') === 0);
    }).length) {
        // We have non-default patterns to fix. Find them by looping through
        // all points.
        this.series.forEach(function (series) {
            series.points.forEach(function (point) {
                var colorOptions = point.options && point.options.color;
                if (colorOptions &&
                    colorOptions.pattern) {
                    colorOptions.pattern._width =
                        'defer';
                    colorOptions.pattern._height =
                        'defer';
                }
            });
        });
        // Redraw without animation
        this.redraw(false);
    }
});
// Add a garbage collector to delete old patterns with autogenerated hashes that
// are no longer being referenced.
H.addEvent(H.Chart, 'redraw', function () {
    var usedIds = [], renderer = this.renderer, 
    // Get the autocomputed patterns - these are the ones we might delete
    patterns = (renderer.defIds || []).filter(function (pattern) {
        return (pattern.indexOf &&
            pattern.indexOf('highcharts-pattern-') === 0);
    });
    if (patterns.length) {
        // Look through the DOM for usage of the patterns. This can be points,
        // series, tooltips etc.
        [].forEach.call(this.renderTo.querySelectorAll('[color^="url("], [fill^="url("], [stroke^="url("]'), function (node) {
            var id = node.getAttribute('fill') ||
                node.getAttribute('color') ||
                node.getAttribute('stroke');
            if (id) {
                usedIds.push(id
                    .substring(id.indexOf('url(') + 5)
                    .replace(')', ''));
            }
        });
        // Loop through the patterns that exist and see if they are used
        patterns.forEach(function (id) {
            if (usedIds.indexOf(id) === -1) {
                // Remove id from used id list
                erase(renderer.defIds, id);
                // Remove pattern element
                if (renderer.patternElements[id]) {
                    renderer.patternElements[id].destroy();
                    delete renderer.patternElements[id];
                }
            }
        });
    }
});
