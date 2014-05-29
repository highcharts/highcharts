
/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var rgbaRegEx = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
	hexRegEx = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
	rgbRegEx = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/;

var Color = function (input) {
	// declare variables
	var rgba = [], result, stops;

	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {

		// Gradients
		if (input && input.stops) {
			stops = map(input.stops, function (stop) {
				return Color(stop[1]);
			});

		// Solid colors
		} else {
			// rgba
			result = rgbaRegEx.exec(input);
			if (result) {
				rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
			} else { 
				// hex
				result = hexRegEx.exec(input);
				if (result) {
					rgba = [pInt(result[1], 16), pInt(result[2], 16), pInt(result[3], 16), 1];
				} else {
					// rgb
					result = rgbRegEx.exec(input);
					if (result) {
						rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
					}
				}
			}
		}		

	}
	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	function get(format) {
		var ret;

		if (stops) {
			ret = merge(input);
			ret.stops = [].concat(ret.stops);
			each(stops, function (stop, i) {
				ret.stops[i] = [ret.stops[i][0], stop.get(format)];
			});

		// it's NaN if gradient colors on a column chart
		} else if (rgba && !isNaN(rgba[0])) {
			if (format === 'rgb') {
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
	}

	/**
	 * Brighten the color
	 * @param {Number} alpha
	 */
	function brighten(alpha) {
		if (stops) {
			each(stops, function (stop) {
				stop.brighten(alpha);
			});
		
		} else if (isNumber(alpha) && alpha !== 0) {
			var i;
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
	}
	/**
	 * Set the color's opacity to a given alpha value
	 * @param {Number} alpha
	 */
	function setOpacity(alpha) {
		rgba[3] = alpha;
		return this;
	}

	// initialize: parse the input
	init(input);

	// public methods
	return {
		get: get,
		brighten: brighten,
		rgba: rgba,
		setOpacity: setOpacity
	};
};

