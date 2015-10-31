
/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
function Color(input) {
	// Backwards compatibility, allow instanciation without new
	if (!(this instanceof Color)) {
		return new Color(input);
	}
    // Initialize
	this.init(input);
}
Color.prototype = {

	rgbaRegEx: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
	hexRegEx: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
	rgbRegEx: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,

	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	init: function (input) {
		var result,
			rgba;

		this.input = input;

		// Gradients
		if (input && input.stops) {
			this.stops = map(input.stops, function (stop) {
				return new Color(stop[1]);
			});

		// Solid colors
		} else {
			// rgba
			result = this.rgbaRegEx.exec(input);
			if (result) {
				rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
			} else {
				// hex
				result = this.hexRegEx.exec(input);
				if (result) {
					rgba = [pInt(result[1], 16), pInt(result[2], 16), pInt(result[3], 16), 1];
				} else {
					// rgb
					result = this.rgbRegEx.exec(input);
					if (result) {
						rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
					}
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
		} else if (rgba && !isNaN(rgba[0])) {
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

