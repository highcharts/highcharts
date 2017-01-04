/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var each = H.each,
	isNumber = H.isNumber,
	map = H.map,
	merge = H.merge,
	pInt = H.pInt;

/**
 * @typedef {string} ColorString
 * A valid color to be parsed and handled by Highcharts. Highcharts internally 
 * supports hex colors like `#ffffff`, rgb colors like `rgb(255,255,255)` and
 * rgba colors like `rgba(255,255,255,1)`. Other colors may be supported by the
 * browsers and displayed correctly, but Highcharts is not able to process them
 * and apply concepts like opacity and brightening.
 */
/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
H.Color = function (input) {
	// Backwards compatibility, allow instanciation without new
	if (!(this instanceof H.Color)) {
		return new H.Color(input);
	}
    // Initialize
	this.init(input);
};
H.Color.prototype = {

	// Collection of parsers. This can be extended from the outside by pushing parsers
	// to Highcharts.Color.prototype.parsers.
	parsers: [{
		// RGBA color
		regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
		parse: function (result) {
			return [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
		}
	}, {
		// HEX color
		regex: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
		parse: function (result) {
			return [pInt(result[1], 16), pInt(result[2], 16), pInt(result[3], 16), 1];
		}
	}, {
		// RGB color
		regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
		parse: function (result) {
			return [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
		}
	}],

	// Collection of named colors. Can be extended from the outside by adding colors
	// to Highcharts.Color.prototype.names.
	names: {
		white: '#ffffff',
		black: '#000000'
	},

	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	init: function (input) {
		var result,
			rgba,
			i,
			parser;

		this.input = input = this.names[input] || input;

		// Gradients
		if (input && input.stops) {
			this.stops = map(input.stops, function (stop) {
				return new H.Color(stop[1]);
			});

		// Solid colors
		} else {
			i = this.parsers.length;
			while (i-- && !rgba) {
				parser = this.parsers[i];
				result = parser.regex.exec(input);
				if (result) {
					rgba = parser.parse(result);
				}
			}
		}
		this.rgba = rgba || [];
	},

	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	get: function (format) {
		var input = this.input,
			rgba = this.rgba,
			ret;

		if (this.stops) {
			ret = merge(input);
			ret.stops = [].concat(ret.stops);
			each(this.stops, function (stop, i) {
				ret.stops[i] = [ret.stops[i][0], stop.get(format)];
			});

		// it's NaN if gradient colors on a column chart
		} else if (rgba && isNumber(rgba[0])) {
			if (format === 'rgb' || (!format && rgba[3] === 1)) {
				ret = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
			} else if (format === 'a') {
				ret = rgba[3];
			} else {
				ret = 'rgba(' + rgba.join(',') + ')';
			}
		} else {
			ret = input;
		}
		return ret;
	},

	/**
	 * Brighten the color
	 * @param {Number} alpha
	 */
	brighten: function (alpha) {
		var i, 
			rgba = this.rgba;

		if (this.stops) {
			each(this.stops, function (stop) {
				stop.brighten(alpha);
			});

		} else if (isNumber(alpha) && alpha !== 0) {
			for (i = 0; i < 3; i++) {
				rgba[i] += pInt(alpha * 255);

				if (rgba[i] < 0) {
					rgba[i] = 0;
				}
				if (rgba[i] > 255) {
					rgba[i] = 255;
				}
			}
		}
		return this;
	},

	/**
	 * Set the color's opacity to a given alpha value
	 * @param {Number} alpha
	 */
	setOpacity: function (alpha) {
		this.rgba[3] = alpha;
		return this;
	}
};
H.color = function (input) {
	return new H.Color(input);
};
