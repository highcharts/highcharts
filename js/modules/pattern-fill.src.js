/**
 * Module for using patterns or images as point fills.
 *
 * (c) 2010-2018 Highsoft AS
 * Author: Torstein Hønsi, Øystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var wrap = H.wrap,
	each = H.each,
	merge = H.merge;


/**
 * Utility function to compute a hash value from an object. Modified Java
 * String.hashCode implementation in JS. Use the preSeed parameter to add an
 * additional seeding step.
 *
 * @param {Object} obj The javascript object to compute the hash from.
 * @param {Bool} [preSeed=false] Add an optional preSeed stage.
 *
 * @return {String} The computed hash.
 */
function hashFromObject(obj, preSeed) {
	var str = JSON.stringify(obj),
		strLen = str.length || 0,
		hash = 0,
		i = 0,
		char,
		seedStep;

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
 * @typedef {Object} PatternOptions
 * @property {Object} pattern Holds a pattern definition.
 * @property {String} pattern.image URL to an image to use as the pattern.
 * @property {Number} pattern.width Width of the pattern. For images this is
 * 	automatically set to the width of the element bounding box if not supplied.
 *  For non-image patterns the default is 32px.
 * @property {Number} pattern.height Height of the pattern. For images this is
 *	automatically set to the height of the element bounding box if not supplied.
 *  For non-image patterns the default is 32px.
 * @property {Number} pattern.x Horizontal offset of the pattern. Defaults to 0.
 * @property {Number} pattern.y Vertical offset of the pattern. Defaults to 0.
 * @property {Object|String} pattern.path Either an SVG path as string, or an
 *  object. As an object, supply the path string in the `path.d` property. Other
 *  supported properties are standard SVG attributes like `path.stroke` and
 *  `path.fill`. If a path is supplied for the pattern, the `image` property is
 *  ignored.
 * @property {String} pattern.color Pattern color, used as default path stroke.
 * @property {Number} pattern.opacity Opacity of the pattern as a float value
 * 	from 0 to 1.
 * @property {String} pattern.id ID to assign to the pattern. This is
 * 	automatically computed if not added, and identical patterns are reused. To
 * 	refer to an existing pattern for a Highcharts color, use
 *	`color: "url(#pattern-id)"`.
 *
 * @example
 * // Pattern used as a color option
 * color: {
 *     pattern: {
 *			path: {
 *		 		d: 'M 3 3 L 8 3 L 8 8 Z',
 *				fill: '#102045'
 *			},
 *			width: 12,
 *			height: 12,
 *			color: '#907000',
 *			opacity: 0.5
 *     }
 * }
 */
/**
 * Add a pattern to the renderer.
 *
 * @private
 * @param {PatternOptions} options The pattern options.
 *
 * @return {Object} The added pattern. Undefined if the pattern already exists.
 */
H.SVGRenderer.prototype.addPattern = function (options) {
	var pattern,
		path,
		width = options.width || 32,
		height = options.height || 32,
		color = options.color || '#343434',
		id = options.id,
		ren = this;

	/**
	 * Add a rectangle for solid color
	 */
	function rect(fill) {
		ren.rect(0, 0, width, height)
			.attr({
				fill: fill
			})
			.add(pattern);
	}

	if (!id) {
		this.idCounter = this.idCounter || 0;
		id = 'highcharts-pattern-' + this.idCounter;
		++this.idCounter;
	}

	// Do nothing if ID already exists
	this.defIds = this.defIds || [];
	if (H.inArray(id, this.defIds) > -1) {
		return;
	}

	// Store ID in list to avoid duplicates
	this.defIds.push(id);

	// Create pattern element
	pattern = this.createElement('pattern').attr({
		id: id,
		patternUnits: 'userSpaceOnUse',
		width: width,
		height: height
	}).add(this.defs);

	// Set id on the SVGRenderer object
	pattern.id = id;

	// Use an SVG path for the pattern
	if (options.path) {
		path = options.path;

		// The background
		if (path.fill) {
			rect(path.fill);
		}

		// The pattern
		this.createElement('path').attr({
			'd': path.d || path,
			'stroke': path.stroke || color,
			'stroke-width': path.strokeWidth || 2
		}).add(pattern);
		pattern.color = color;

	// Image pattern
	} else if (options.image) {
		this.image(
			options.image, options.x || 0, options.y || 0, width, height
		).add(pattern);
	}

	if (options.opacity !== undefined) {
		each(pattern.element.children, function (child) {
			child.setAttribute('opacity', options.opacity);
		});
	}

	return pattern;
};


/**
 * Make sure we have a series color
 */
wrap(H.Series.prototype, 'getColor', function (proceed) {
	var oldColor = this.options.color;
	// Temporarely remove color options to get defaults
	if (oldColor && oldColor.pattern && !oldColor.pattern.color) {
		delete this.options.color;
		// Get default
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		// Replace with old, but add default color
		oldColor.pattern.color = this.color;
		this.color = this.options.color = oldColor;
	} else {
		// We have a color, no need to do anything special
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});


/**
 * Merge series color options to points
 */
wrap(H.Point.prototype, 'applyOptions', function (proceed) {
	var point = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
		colorOptions = point.options.color;

	// Only do this if we have defined a specific color on this point. Otherwise
	// we will end up trying to re-add the series color for each point.
	if (typeof colorOptions === 'object') {
		// Move path definition to object, allows for merge with series path
		// definition
		if (
			colorOptions.pattern &&
			typeof colorOptions.pattern.path === 'string'
		) {
			colorOptions.pattern.path = {
				d: colorOptions.pattern.path
			};
		}
		// Merge with series options
		point.color = point.options.color = merge(
			point.series.options.color, colorOptions
		);
	}

	return point;
});


/**
 * Add functionality to SVG renderer to handle patterns as complex colors
 */
H.addEvent(H.SVGRenderer, 'complexColor', function (args) {
	var color = args.args[0],
		prop = args.args[1],
		element = args.args[2],
		pattern = color.pattern,
		value = '#343434',
		bBox;

	// Skip and call default if there is no pattern
	if (!pattern) {
		return true;
	}

	// We have a pattern.
	if (
		pattern.image ||
		typeof pattern.path === 'string' ||
		pattern.path && pattern.path.d
	) {
		// Real pattern. Add it and set the color value to be a reference.

		// If we don't have an explicit ID, compute a hash from the
		// definition and use that as the ID. This ensures that points with
		// the same pattern definition reuse existing pattern elements by
		// default. We combine two hashes, the second with an additional
		// preSeed algorithm, to minimize collision probability.
		pattern.id = pattern.id || 'highcharts-pattern-' +
			hashFromObject(pattern) + hashFromObject(pattern, true);

		// Autocompute width/height for images
		if (pattern.image && (!pattern.width || !pattern.height)) {
			bBox = element.getBBox();
			pattern.width = pattern.width || Math.round(bBox.width);
			pattern.height = pattern.height || Math.round(bBox.height);
		}

		// Add it. This function does nothing if an element with this ID
		// already exists.
		this.addPattern(pattern);

		value = 'url(' + this.url + '#' + pattern.id + ')';

	} else {
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


/**
 * Add the predefined patterns
 */
H.Chart.prototype.callbacks.push(function (chart) {
	var colors = H.getOptions().colors;
	each([
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
	], function (pattern, i) {
		chart.renderer.addPattern({
			id: 'highcharts-default-pattern-' + i,
			path: pattern,
			color: colors[i],
			width: 10,
			height: 10
		});
	});
});
