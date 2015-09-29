// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highmaps JS v1.1.8-modified ()
 *
 * (c) 2009-2014 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, HighchartsAdapter, document, window, navigator, setInterval, clearInterval, clearTimeout, setTimeout, location, jQuery, $, console, each, grep */
/*jslint ass: true, sloppy: true, forin: true, plusplus: true, nomen: true, vars: true, regexp: true, newcap: true, browser: true, continue: true, white: true */
/*(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(root);
    else {
        factory(global);
    }
}(this, function(window) {
    // @code
}));*/
(function () {
	var SVG_NS = 'http://www.w3.org/2000/svg',
		svg = !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect,
		isIE = /(msie|trident)/i.test(userAgent) && !window.opera,
		useCanVG = !svg && !isIE && !!document.createElement('canvas').getContext,
		vml = !svg && !useCanVG,
		userAgent = navigator.userAgent,
		isFirefox = /Firefox/.test(userAgent),
		hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4; // issue #38

window.Highcharts = window.Highcharts ? window.Highcharts.error(16, true) : {
	product: 'Highmaps',
	version: '1.1.8-modified',
	deg2rad: Math.PI * 2 / 360,
	hasBidiBug: hasBidiBug,
	isIE: isIE,
	isWebKit: /AppleWebKit/.test(userAgent),
	isFirefox: isFirefox,
	isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
	SVG_NS: SVG_NS,
	idCounter: 0,
	chartCount: 0,
	seriesTypes: {},
	svg: svg,
	useCanVG: useCanVG,
	vml: vml,
	charts: [],
	noop: function () {}
};

	return window.Highcharts;
}());(function (H) {
/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
H.extend = function (a, b) {
	var n;
	if (!a) {
		a = {};
	}
	for (n in b) {
		a[n] = b[n];
	}
	return a;
};
	
/**
 * Deep merge two or more objects and return a third object. If the first argument is
 * true, the contents of the second object is copied into the first object.
 * Previously this function redirected to jQuery.extend(true), but this had two limitations.
 * First, it deep merged arrays, which lead to workarounds in Highcharts. Second,
 * it copied properties from extended prototypes. 
 */
H.merge = function () {
	var i,
		args = arguments,
		len,
		ret = {},
		doCopy = function (copy, original) {
			var value, key;

			// An object is replacing a primitive
			if (typeof copy !== 'object') {
				copy = {};
			}

			for (key in original) {
				if (original.hasOwnProperty(key)) {
					value = original[key];

					// Copy the contents of objects, but not arrays or DOM nodes
					if (value && typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]' &&
							key !== 'renderTo' && typeof value.nodeType !== 'number') {
						copy[key] = doCopy(copy[key] || {}, value);
				
					// Primitives and arrays are copied over directly
					} else {
						copy[key] = original[key];
					}
				}
			}
			return copy;
		};

	// If first argument is true, copy into the existing object. Used in setOptions.
	if (args[0] === true) {
		ret = args[1];
		args = Array.prototype.slice.call(args, 2);
	}

	// For each argument, extend the return
	len = args.length;
	for (i = 0; i < len; i++) {
		ret = doCopy(ret, args[i]);
	}

	return ret;
};

/**
 * Shortcut for parseInt
 * @param {Object} s
 * @param {Number} mag Magnitude
 */
H.pInt = function (s, mag) {
	return parseInt(s, mag || 10);
};

/**
 * Check for string
 * @param {Object} s
 */
H.isString = function (s) {
	return typeof s === 'string';
};

/**
 * Check for object
 * @param {Object} obj
 */
H.isObject = function (obj) {
	return obj && typeof obj === 'object';
};

/**
 * Check for array
 * @param {Object} obj
 */
H.isArray = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * Check for number
 * @param {Object} n
 */
H.isNumber = function (n) {
	return typeof n === 'number';
};

H.log2lin = function (num) {
	return Math.log(num) / Math.LN10;
};
H.lin2log = function (num) {
	return Math.pow(10, num);
};

/**
 * Remove last occurence of an item from an array
 * @param {Array} arr
 * @param {Mixed} item
 */
H.erase = function (arr, item) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === item) {
			arr.splice(i, 1);
			break;
		}
	}
	//return arr;
};

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
H.defined = function (obj) {
	return obj !== undefined && obj !== null;
};

/**
 * Set or get an attribute or an object of attributes. Can't use jQuery attr because
 * it attempts to set expando properties on the SVG element, which is not allowed.
 *
 * @param {Object} elem The DOM element to receive the attribute(s)
 * @param {String|Object} prop The property or an abject of key-value pairs
 * @param {String} value The value if a single property is set
 */
H.attr = function (elem, prop, value) {
	var key,
		ret;

	// if the prop is a string
	if (H.isString(prop)) {
		// set the value
		if (H.defined(value)) {
			elem.setAttribute(prop, value);

		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}

	// else if prop is defined, it is a hash of key/value pairs
	} else if (H.defined(prop) && H.isObject(prop)) {
		for (key in prop) {
			elem.setAttribute(key, prop[key]);
		}
	}
	return ret;
};
/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
H.splat = function (obj) {
	return H.isArray(obj) ? obj : [obj];
};


/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
H.pick = function () {
	var args = arguments,
		i,
		arg,
		length = args.length;
	for (i = 0; i < length; i++) {
		arg = args[i];
		if (arg !== undefined && arg !== null) {
			return arg;
		}
	}
};

/**
 * Set CSS on a given element
 * @param {Object} el
 * @param {Object} styles Style object with camel case property names
 */
H.css = function (el, styles) {
	if (H.isIE && !H.svg) { // #2686
		if (styles && styles.opacity !== undefined) {
			styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
		}
	}
	H.extend(el.style, styles);
};

/**
 * Utility function to create element with attributes and styles
 * @param {Object} tag
 * @param {Object} attribs
 * @param {Object} styles
 * @param {Object} parent
 * @param {Object} nopad
 */
H.createElement = function (tag, attribs, styles, parent, nopad) {
	var el = document.createElement(tag),
		css = H.css;
	if (attribs) {
		H.extend(el, attribs);
	}
	if (nopad) {
		css(el, {padding: 0, border: 'none', margin: 0});
	}
	if (styles) {
		css(el, styles);
	}
	if (parent) {
		parent.appendChild(el);
	}
	return el;
};

/**
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
H.extendClass = function (parent, members) {
	var object = function () {};
	object.prototype = new parent();
	H.extend(object.prototype, members);
	return object;
};

/**
 * Pad a string to a given length by adding 0 to the beginning
 * @param {Number} number
 * @param {Number} length
 */
H.pad = function (number, length) {
	// Create an array of the remaining length +1 and join it with 0's
	return new Array((length || 2) + 1 - String(number).length).join(0) + number;
};

/**
 * Return a length based on either the integer value, or a percentage of a base.
 */
H.relativeLength = function (value, base) {
	return (/%$/).test(value) ? base * parseFloat(value) / 100 : parseFloat(value);
};

/**
 * Wrap a method with extended functionality, preserving the original function
 * @param {Object} obj The context object that the method belongs to 
 * @param {String} method The name of the method to extend
 * @param {Function} func A wrapper function callback. This function is called with the same arguments
 * as the original function, except that the original function is unshifted and passed as the first 
 * argument. 
 */
H.wrap = function (obj, method, func) {
	var proceed = obj[method];
	obj[method] = function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(proceed);
		return func.apply(this, args);
	};
};


H.getTZOffset = function (timestamp) {
	var d = H.Date;
	return ((d.hcGetTimezoneOffset && d.hcGetTimezoneOffset(timestamp)) || d.hcTimezoneOffset || 0) * 60000;
};

/**
 * Based on http://www.php.net/manual/en/function.strftime.php
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
H.dateFormat = function (format, timestamp, capitalize) {
	if (!H.defined(timestamp) || isNaN(timestamp)) {
		return H.defaultOptions.lang.invalidDate || '';
	}
	format = H.pick(format, '%Y-%m-%d %H:%M:%S');

	var d = H.Date,
		date = new d(timestamp - H.getTZOffset(timestamp)),
		key, // used in for constuct below
		// get the basic time values
		hours = date[d.hcGetHours](),
		day = date[d.hcGetDay](),
		dayOfMonth = date[d.hcGetDate](),
		month = date[d.hcGetMonth](),
		fullYear = date[d.hcGetFullYear](),
		lang = H.defaultOptions.lang,
		langWeekdays = lang.weekdays,
		pad = H.pad,

		// List all format keys. Custom formats can be added from the outside. 
		replacements = H.extend({

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31
			'e': dayOfMonth, // Day of the month, 1 through 31
			'w': day,

			// Week (none implemented)
			//'W': weekNumber(),

			// Month
			'b': lang.shortMonths[month], // Short month, like 'Jan'
			'B': lang.months[month], // Long month, like 'January'
			'm': pad(month + 1), // Two digit month number, 01 through 12

			// Year
			'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
			'Y': fullYear, // Four digits year, like 2009

			// Time
			'H': pad(hours), // Two digits hours in 24h format, 00 through 23
			'k': hours, // Hours in 24h format, 0 through 23
			'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
			'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
			'M': pad(date[d.hcGetMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()), // Two digits seconds, 00 through  59
			'L': pad(Math.round(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
		}, H.dateFormats);


	// do the replaces
	for (key in replacements) {
		while (format.indexOf('%' + key) !== -1) { // regex would do it in one line, but this is faster
			format = format.replace('%' + key, typeof replacements[key] === 'function' ? replacements[key](timestamp) : replacements[key]);
		}
	}

	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};

/** 
 * Format a single variable. Similar to sprintf, without the % prefix.
 */
H.formatSingle = function (format, val) {
	var floatRegex = /f$/,
		decRegex = /\.([0-9])/,
		lang = H.defaultOptions.lang,
		decimals;

	if (floatRegex.test(format)) { // float
		decimals = format.match(decRegex);
		decimals = decimals ? decimals[1] : -1;
		if (val !== null) {
			val = H.numberFormat(
				val,
				decimals,
				lang.decimalPoint,
				format.indexOf(',') > -1 ? lang.thousandsSep : ''
			);
		}
	} else {
		val = H.dateFormat(format, val);
	}
	return val;
};

/**
 * Format a string according to a subset of the rules of Python's String.format method.
 */
H.format = function (str, ctx) {
	var splitter = '{',
		isInside = false,
		segment,
		valueAndFormat,
		path,
		i,
		len,
		ret = [],
		val,
		index;
	
	while ((index = str.indexOf(splitter)) !== -1) {
		
		segment = str.slice(0, index);
		if (isInside) { // we're on the closing bracket looking back
			
			valueAndFormat = segment.split(':');
			path = valueAndFormat.shift().split('.'); // get first and leave format
			len = path.length;
			val = ctx;

			// Assign deeper paths
			for (i = 0; i < len; i++) {
				val = val[path[i]];
			}

			// Format the replacement
			if (valueAndFormat.length) {
				val = H.formatSingle(valueAndFormat.join(':'), val);
			}

			// Push the result and advance the cursor
			ret.push(val);
			
		} else {
			ret.push(segment);
			
		}
		str = str.slice(index + 1); // the rest
		isInside = !isInside; // toggle
		splitter = isInside ? '}' : '{'; // now look for next matching bracket
	}
	ret.push(str);
	return ret.join('');
};

/**
 * Get the magnitude of a number
 */
H.getMagnitude = function (num) {
	return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
};

/**
 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
 * @param {Number} interval
 * @param {Array} multiples
 * @param {Number} magnitude
 * @param {Object} options
 */
H.normalizeTickInterval = function (interval, multiples, magnitude, allowDecimals, preventExceed) {
	var normalized, 
		i,
		retInterval = interval;

	// round to a tenfold of 1, 2, 2.5 or 5
	magnitude = H.pick(magnitude, 1);
	normalized = interval / magnitude;

	// multiples for a linear scale
	if (!multiples) {
		multiples = [1, 2, 2.5, 5, 10];

		// the allowDecimals option
		if (allowDecimals === false) {
			if (magnitude === 1) {
				multiples = [1, 2, 5, 10];
			} else if (magnitude <= 0.1) {
				multiples = [1 / magnitude];
			}
		}
	}

	// normalize the interval to the nearest multiple
	for (i = 0; i < multiples.length; i++) {
		retInterval = multiples[i];
		if ((preventExceed && retInterval * magnitude >= interval) || // only allow tick amounts smaller than natural
			(!preventExceed && (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2))) {
			break;
		}
	}

	// multiply back to the correct magnitude
	retInterval *= magnitude;
	
	return retInterval;
};


/**
 * Utility method that sorts an object array and keeping the order of equal items.
 * ECMA script standard does not specify the behaviour when items are equal.
 */
H.stableSort = function (arr, sortFunction) {
	var length = arr.length,
		sortValue,
		i;

	// Add index to each item
	for (i = 0; i < length; i++) {
		arr[i].ss_i = i; // stable sort index
	}

	arr.sort(function (a, b) {
		sortValue = sortFunction(a, b);
		return sortValue === 0 ? a.ss_i - b.ss_i : sortValue;
	});

	// Remove index from items
	for (i = 0; i < length; i++) {
		delete arr[i].ss_i; // stable sort index
	}
};

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
H.arrayMin = function (data) {
	var i = data.length,
		min = data[0];

	while (i--) {
		if (data[i] < min) {
			min = data[i];
		}
	}
	return min;
};

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
H.arrayMax = function (data) {
	var i = data.length,
		max = data[0];

	while (i--) {
		if (data[i] > max) {
			max = data[i];
		}
	}
	return max;
};

/**
 * Utility method that destroys any SVGElement or VMLElement that are properties on the given object.
 * It loops all properties and invokes destroy if there is a destroy method. The property is
 * then delete'ed.
 * @param {Object} The object to destroy properties on
 * @param {Object} Exception, do not destroy this property, only delete it.
 */
H.destroyObjectProperties = function (obj, except) {
	var n;
	for (n in obj) {
		// If the object is non-null and destroy is defined
		if (obj[n] && obj[n] !== except && obj[n].destroy) {
			// Invoke the destroy
			obj[n].destroy();
		}

		// Delete the property from the object.
		delete obj[n];
	}
};


/**
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
H.discardElement = function (element) {
	var garbageBin = H.garbageBin;
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) {
		garbageBin = H.createElement('div');
	}

	// move the node and empty bin
	if (element) {
		garbageBin.appendChild(element);
	}
	garbageBin.innerHTML = '';
};

/**
 * Provide error messages for debugging, with links to online explanation 
 */
H.error = function (code, stop) {
	var msg = 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;
	if (stop) {
		throw msg;
	}
	// else ...
	if (window.console) {
		console.log(msg);
	}
};

/**
 * Fix JS round off float errors
 * @param {Number} num
 */
H.correctFloat = function (num, prec) {
	return parseFloat(
		num.toPrecision(prec || 14)
	);
};

/**
 * Set the global animation to either a given value, or fall back to the
 * given chart's animation option
 * @param {Object} animation
 * @param {Object} chart
 */
H.setAnimation = function (animation, chart) {
	chart.renderer.globalAnimation = H.pick(animation, chart.animation);
};

/**
 * The time unit lookup
 */
H.timeUnits = {
	millisecond: 1,
	second: 1000,
	minute: 60000,
	hour: 3600000,
	day: 24 * 3600000,
	week: 7 * 24 * 3600000,
	month: 28 * 24 * 3600000,
	year: 364 * 24 * 3600000
};

/**
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
H.numberFormat = function (number, decimals, decPoint, thousandsSep) {
	var lang = H.defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = +number || 0,
		c = decimals === -1 ?
			Math.min((n.toString().split('.')[1] || '').length, 20) : // Preserve decimals. Not huge numbers (#3793).
			(isNaN(decimals = Math.abs(decimals)) ? 2 : decimals),
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
		s = n < 0 ? "-" : "",
		i = String(H.pInt(n = Math.abs(n).toFixed(c))),
		j = i.length > 3 ? i.length % 3 : 0;

	return (s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
			(c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
};

	return H;
}(Highcharts));
(function (H) {
/**
 * Path interpolation algorithm used across adapters
 */
H.pathAnim = {
	/**
	 * Prepare start and end values so that the path can be animated one to one
	 */
	init: function (elem, fromD, toD) {
		fromD = fromD || '';
		var shift = elem.shift,
			bezier = fromD.indexOf('C') > -1,
			numParams = bezier ? 7 : 3,
			endLength,
			slice,
			i,
			start = fromD.split(' '),
			end = [].concat(toD), // copy
			startBaseLine,
			endBaseLine,
			sixify = function (arr) { // in splines make move points have six parameters like bezier curves
				i = arr.length;
				while (i--) {
					if (arr[i] === 'M') {
						arr.splice(i + 1, 0, arr[i + 1], arr[i + 2], arr[i + 1], arr[i + 2]);
					}
				}
			};

		if (bezier) {
			sixify(start);
			sixify(end);
		}

		// pull out the base lines before padding
		if (elem.isArea) {
			startBaseLine = start.splice(start.length - 6, 6);
			endBaseLine = end.splice(end.length - 6, 6);
		}

		// if shifting points, prepend a dummy point to the end path
		if (shift <= end.length / numParams && start.length === end.length) {
			while (shift--) {
				end = [].concat(end).splice(0, numParams).concat(end);
			}
		}
		elem.shift = 0; // reset for following animations

		// copy and append last point until the length matches the end length
		if (start.length) {
			endLength = end.length;
			while (start.length < endLength) {

				//bezier && sixify(start);
				slice = [].concat(start).splice(start.length - numParams, numParams);
				if (bezier) { // disable first control point
					slice[numParams - 6] = slice[numParams - 2];
					slice[numParams - 5] = slice[numParams - 1];
				}
				start = start.concat(slice);
			}
		}

		if (startBaseLine) { // append the base lines for areas
			start = start.concat(startBaseLine);
			end = end.concat(endBaseLine);
		}
		return [start, end];
	},

	/**
	 * Interpolate each value of the path and return the array
	 */
	step: function (start, end, pos, complete) {
		var ret = [],
			i = start.length,
			startVal;

		if (pos === 1) { // land on the final path without adjustment points appended in the ends
			ret = complete;

		} else if (i === end.length && pos < 1) {
			while (i--) {
				startVal = parseFloat(start[i]);
				ret[i] =
					isNaN(startVal) ? // a letter instruction like M or L
						start[i] :
						pos * (parseFloat(end[i] - startVal)) + startVal;

			}
		} else { // if animation is finished or length not matching, land on right value
			ret = end;
		}
		return ret;
	}
};

	return H;
}(Highcharts));
(function (H, $) {
	var HighchartsAdapter,

		attr = H.attr,
		charts = H.charts,
		extend = H.extend,
		isIE = H.isIE,
		isString = H.isString,
		wrap = H.wrap;
	/**
	 * The default HighchartsAdapter for jQuery
	 */
	HighchartsAdapter = window.HighchartsAdapter || ($ && {
		
		/**
		 * Initialize the adapter by applying some extensions to jQuery
		 */
		init: function (pathAnim) {
			
			// extend the animate function to allow SVG animations
			var Fx = $.fx;
			
			/*jslint unparam: true*//* allow unused param x in this function */
			$.extend($.easing, {
				easeOutQuad: function (x, t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				}
			});
			/*jslint unparam: false*/
		
			// extend some methods to check for elem.attr, which means it is a Highcharts SVG object
			$.each(['cur', '_default', 'width', 'height', 'opacity'], function (i, fn) {
				var obj = Fx.step,
					base;
					
				// Handle different parent objects
				if (fn === 'cur') {
					obj = Fx.prototype; // 'cur', the getter, relates to Fx.prototype
				
				} else if (fn === '_default' && $.Tween) { // jQuery 1.8 model
					obj = $.Tween.propHooks[fn];
					fn = 'set';
				}
		
				// Overwrite the method
				base = obj[fn];
				if (base) { // step.width and step.height don't exist in jQuery < 1.7
		
					// create the extended function replacement
					obj[fn] = function (fx) {

						var elem;
						
						// Fx.prototype.cur does not use fx argument
						fx = i ? fx : this;

						// Don't run animations on textual properties like align (#1821)
						if (fx.prop === 'align') {
							return;
						}
		
						// shortcut
						elem = fx.elem;
		
						// Fx.prototype.cur returns the current value. The other ones are setters
						// and returning a value has no effect.
						return elem.attr ? // is SVG element wrapper
							elem.attr(fx.prop, fn === 'cur' ? undefined : fx.now) : // apply the SVG wrapper's method
							base.apply(this, arguments); // use jQuery's built-in method
					};
				}
			});

			// Extend the opacity getter, needed for fading opacity with IE9 and jQuery 1.10+
			wrap($.cssHooks.opacity, 'get', function (proceed, elem, computed) {
				return elem.attr ? (elem.opacity || 0) : proceed.call(this, elem, computed);
			});
			
			// Define the setter function for d (path definitions)
			this.addAnimSetter('d', function (fx) {
				var elem = fx.elem,
					ends;
		
				// Normally start and end should be set in state == 0, but sometimes,
				// for reasons unknown, this doesn't happen. Perhaps state == 0 is skipped
				// in these cases
				if (!fx.started) {
					ends = pathAnim.init(elem, elem.d, elem.toD);
					fx.start = ends[0];
					fx.end = ends[1];
					fx.started = true;
				}
		
				// Interpolate each value of the path
				elem.attr('d', pathAnim.step(fx.start, fx.end, fx.pos, elem.toD));
			});
			
			/**
			 * Utility for iterating over an array. Parameters are reversed compared to jQuery.
			 * @param {Array} arr
			 * @param {Function} fn
			 */
			this.each = Array.prototype.forEach ?
				function (arr, fn) { // modern browsers
					return Array.prototype.forEach.call(arr, fn);
					
				} : 
				function (arr, fn) { // legacy
					var i, 
						len = arr.length;
					for (i = 0; i < len; i++) {
						if (fn.call(arr[i], arr[i], i, arr) === false) {
							return i;
						}
					}
				};
			
			/**
			 * Register Highcharts as a plugin in the respective framework
			 */
			$.fn.highcharts = function () {
				var constr = 'Chart', // default constructor
					args = arguments,
					options,
					ret,
					chart;

				if (this[0]) {

					if (isString(args[0])) {
						constr = args[0];
						args = Array.prototype.slice.call(args, 1); 
					}
					options = args[0];

					// Create the chart
					if (options !== undefined) {
						/*jslint unused:false*/
						options.chart = options.chart || {};
						options.chart.renderTo = this[0];
						chart = new H[constr](options, args[1]);
						ret = this;
						/*jslint unused:true*/
					}

					// When called without parameters or with the return argument, get a predefined chart
					if (options === undefined) {
						ret = charts[attr(this[0], 'data-highcharts-chart')];
					}
				}
				
				return ret;
			};

		},

		/**
		 * Add an animation setter for a specific property
		 */
		addAnimSetter: function (prop, setter) {
			// jQuery 1.8 style
			if ($.Tween) {
				$.Tween.propHooks[prop] = {
					set: setter
				};
			// pre 1.8
			} else {
				$.fx.step[prop] = setter;
			}
		},
		
		/**
		 * Downloads a script and executes a callback when done.
		 * @param {String} scriptLocation
		 * @param {Function} callback
		 */
		getScript: $.getScript,
		
		/**
		 * Return the index of an item in an array, or -1 if not found
		 */
		inArray: $.inArray,
		
		/**
		 * A direct link to jQuery methods. MooTools and Prototype adapters must be implemented for each case of method.
		 * @param {Object} elem The HTML element
		 * @param {String} method Which method to run on the wrapped element
		 */
		adapterRun: function (elem, method) {
			return $(elem)[method]();
		},
	
		/**
		 * Filter an array
		 */
		grep: $.grep,
	
		/**
		 * Map an array
		 * @param {Array} arr
		 * @param {Function} fn
		 */
		map: function (arr, fn) {
			//return jQuery.map(arr, fn);
			var results = [],
				i = 0,
				len = arr.length;
			for (; i < len; i++) {
				results[i] = fn.call(arr[i], arr[i], i, arr);
			}
			return results;
	
		},
	
		/**
		 * Get the position of an element relative to the top left of the page
		 */
		offset: function (el) {
			return $(el).offset();
		},
	
		/**
		 * Add an event listener
		 * @param {Object} el A HTML element or custom object
		 * @param {String} event The event type
		 * @param {Function} fn The event handler
		 */
		addEvent: function (el, event, fn) {
			$(el).bind(event, fn);
		},
	
		/**
		 * Remove event added with addEvent
		 * @param {Object} el The object
		 * @param {String} eventType The event type. Leave blank to remove all events.
		 * @param {Function} handler The function to remove
		 */
		removeEvent: function (el, eventType, handler) {
			// workaround for jQuery issue with unbinding custom events:
			// http://forum.jQuery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jQuery-1-4-2
			var func = document.removeEventListener ? 'removeEventListener' : 'detachEvent';
			if (document[func] && el && !el[func]) {
				el[func] = function () {};
			}
	
			$(el).unbind(eventType, handler);
		},
	
		/**
		 * Fire an event on a custom object
		 * @param {Object} el
		 * @param {String} type
		 * @param {Object} eventArguments
		 * @param {Function} defaultFunction
		 */
		fireEvent: function (el, type, eventArguments, defaultFunction) {
			var event = $.Event(type),
				detachedType = 'detached' + type,
				defaultPrevented;
	
			// Remove warnings in Chrome when accessing returnValue (#2790), layerX and layerY. Although Highcharts
			// never uses these properties, Chrome includes them in the default click event and
			// raises the warning when they are copied over in the extend statement below.
			//
			// To avoid problems in IE (see #1010) where we cannot delete the properties and avoid
			// testing if they are there (warning in chrome) the only option is to test if running IE.
			if (!isIE && eventArguments) {
				delete eventArguments.layerX;
				delete eventArguments.layerY;
				delete eventArguments.returnValue;
			}
	
			extend(event, eventArguments);
	
			// Prevent jQuery from triggering the object method that is named the
			// same as the event. For example, if the event is 'select', jQuery
			// attempts calling el.select and it goes into a loop.
			if (el[type]) {
				el[detachedType] = el[type];
				el[type] = null;
			}
	
			// Wrap preventDefault and stopPropagation in try/catch blocks in
			// order to prevent JS errors when cancelling events on non-DOM
			// objects. #615.
			/*jslint unparam: true*/
			$.each(['preventDefault', 'stopPropagation'], function (i, fn) {
				var base = event[fn];
				event[fn] = function () {
					try {
						base.call(event);
					} catch (e) {
						if (fn === 'preventDefault') {
							defaultPrevented = true;
						}
					}
				};
			});
			/*jslint unparam: false*/
	
			// trigger it
			$(el).trigger(event);
	
			// attach the method
			if (el[detachedType]) {
				el[type] = el[detachedType];
				el[detachedType] = null;
			}
	
			if (defaultFunction && !event.isDefaultPrevented() && !defaultPrevented) {
				defaultFunction(event);
			}
		},
		
		/**
		 * Extension method needed for MooTools
		 */
		washMouseEvent: function (e) {
			var ret = e.originalEvent || e;
			
			// computed by jQuery, needed by IE8
			if (ret.pageX === undefined) { // #1236
				ret.pageX = e.pageX;
				ret.pageY = e.pageY;
			}
			
			return ret;
		},
	
		/**
		 * Animate a HTML element or SVG element wrapper
		 * @param {Object} el
		 * @param {Object} params
		 * @param {Object} options jQuery-like animation options: duration, easing, callback
		 */
		animate: function (el, params, options) {
			var $el = $(el);
			if (!el.style) {
				el.style = {}; // #1881
			}
			if (params.d) {
				el.toD = params.d; // keep the array form for paths, used in $.fx.step.d
				params.d = 1; // because in jQuery, animating to an array has a different meaning
			}
	
			$el.stop();
			if (params.opacity !== undefined && el.attr) {
				params.opacity += 'px'; // force jQuery to use same logic as width and height (#2161)
			}
			el.hasAnim = 1; // #3342
			$el.animate(params, options);
	
		},
		/**
		 * Stop running animation
		 */
		stop: function (el) {
			if (el.hasAnim) { // #3342, memory leak on calling $(el) from destroy
				$(el).stop();
			}
		}
	});
	
	return (window.HighchartsAdapter = HighchartsAdapter);
}(Highcharts, window.jQuery));(function (H) {
// check for a custom HighchartsAdapter defined prior to this file
var globalAdapter = window.HighchartsAdapter,
	adapter = globalAdapter || {};
	
// Initialize the adapter
if (globalAdapter) {
	globalAdapter.init.call(globalAdapter, H.pathAnim);
}


// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
H.adapterRun = adapter.adapterRun;
H.addAnimSetter = adapter.addAnimSetter;
H.addEvent = adapter.addEvent;
H.animate = adapter.animate;
H.each = adapter.each;
H.getScript = adapter.getScript;
H.grep = adapter.grep;
H.map = adapter.map;
H.inArray = adapter.inArray;
H.fireEvent = adapter.fireEvent;
H.removeEvent = adapter.removeEvent;
H.stop = adapter.stop;

    return H;
}(Highcharts));
(function (H) {
	var each = H.each,
		getTZOffset = H.getTZOffset,
		isTouchDevice = H.isTouchDevice,
		merge = H.merge,
		pick = H.pick,
		svg = H.svg;
		
/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
H.defaultOptions = {
	colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', 
		    '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'],
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		// invalidDate: '',
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ' '
	},
	global: {
		useUTC: true,
		//timezoneOffset: 0,
		canvasToolsURL: 'http://code.highcharts.com/maps/1.1.8-modified/modules/canvas-tools.js',
		VMLRadialGradientURL: 'http://code.highcharts.com/maps/1.1.8-modified/gfx/vml-radial-gradient.png'
	},
	chart: {
		//animation: true,
		//alignTicks: false,
		//reflow: true,
		//className: null,
		//events: { load, selection },
		//margin: [null],
		//marginTop: null,
		//marginRight: null,
		//marginBottom: null,
		//marginLeft: null,
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 0,
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		spacing: [10, 10, 15, 10],
		//spacingTop: 10,
		//spacingRight: 10,
		//spacingBottom: 15,
		//spacingLeft: 10,
		//style: {
		//	fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
		//	fontSize: '12px'
		//},
		backgroundColor: '#FFFFFF',
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0',
		//plotBorderWidth: 0,
		//plotShadow: false,
		//zoomType: ''
		resetZoomButton: {
			theme: {
				zIndex: 20
			},
			position: {
				align: 'right',
				x: -10,
				//verticalAlign: 'top',
				y: 10
			}
			// relativeTo: 'plot'
		}
	},
	title: {
		text: 'Chart title',
		align: 'center',
		// floating: false,
		margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		
	},

	plotOptions: {
		line: { // base series options
			allowPointSelect: false,
			showCheckbox: false,
			animation: {
				duration: 1000
			},
			//connectNulls: false,
			//cursor: 'default',
			//clip: true,
			//dashStyle: null,
			//enableMouseTracking: true,
			events: {},
			//legendIndex: 0,
			//linecap: 'round',
			lineWidth: 2,
			//shadow: false,
			// stacking: null,
			marker: {
				//enabled: true,
				//symbol: null,
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				//fillColor: null,
				states: { // states for a single point
					hover: {
						enabled: true,
						lineWidthPlus: 1,
						radiusPlus: 2
					},
					select: {
						fillColor: '#FFFFFF',
						lineColor: '#000000',
						lineWidth: 2
					}
				}
			},
			point: {
				events: {}
			},
			dataLabels: {
				align: 'center',
				// defer: true,
				// enabled: false,
				formatter: function () {
					return this.y === null ? '' : H.numberFormat(this.y, -1);
				},
				style: {
					color: 'contrast',
					fontSize: '11px',
					fontWeight: 'bold',
					textShadow: '0 0 6px contrast, 0 0 3px contrast'
				},
				verticalAlign: 'bottom', // above singular point
				x: 0,
				y: 0,
				// backgroundColor: undefined,
				// borderColor: undefined,
				// borderRadius: undefined,
				// borderWidth: undefined,
				padding: 5
				// shadow: false
			},
			cropThreshold: 300, // draw points outside the plot area when the number of points is less than this
			pointRange: 0,
			//pointStart: 0,
			//pointInterval: 1,
			//showInLegend: null, // auto: true for standalone series, false for linked series
			softThreshold: true, // docs. Also, update the spline-plot-bands demo by removing y.min
			states: { // states for the entire series
				hover: {
					//enabled: false,
					lineWidthPlus: 1,
					marker: {
						// lineWidth: base + 1,
						// radius: base + 1
					},
					halo: {
						size: 10,
						opacity: 0.25
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: true,
			//tooltip: {
				//pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b>'
				//valueDecimals: null,
				//xDateFormat: '%A, %b %e, %Y',
				//valuePrefix: '',
				//ySuffix: ''				
			//}
			turboThreshold: 1000
			// zIndex: null
		}
	},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: 'absolute',
			color: '#3E576F'
		}
	},
	legend: {
		enabled: true,
		align: 'center',
		//floating: false,
		layout: 'horizontal',
		labelFormatter: function () {
			return this.name;
		},
		//borderWidth: 0,
		borderColor: '#909090',
		borderRadius: 0,
		navigation: {
			
			// animation: true,
			// arrowSize: 12
			// style: {} // text styles
		},
		// margin: 20,
		// reversed: false,
		shadow: false,
		// backgroundColor: null,
		/*style: {
			padding: '5px'
		},*/
		
		itemCheckboxStyle: {
			position: 'absolute',
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
		// symbolRadius: 0,
		// symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		// width: undefined,
		x: 0,
		y: 0,
		title: {
			//text: null,
			
		}			
	},

	loading: {
		// hideDuration: 100,
		// showDuration: 0,
		
	},

	tooltip: {
		enabled: true,
		animation: svg,
		//crosshairs: null,
		borderRadius: 3,
		dateTimeLabelFormats: { 
			millisecond: '%A, %b %e, %H:%M:%S.%L',
			second: '%A, %b %e, %H:%M:%S',
			minute: '%A, %b %e, %H:%M',
			hour: '%A, %b %e, %H:%M',
			day: '%A, %b %e, %Y',
			week: 'Week from %A, %b %e, %Y',
			month: '%B %Y',
			year: '%Y'
		},
		footerFormat: '',
		//formatter: defaultFormatter,
		headerFormat: '<span style="font-size: 0.85em">{point.key}</span><br/>',
		padding: 8, // docs
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
		//shape: 'callout',
		//shared: false,
		snap: isTouchDevice ? 25 : 10,
		
		//xDateFormat: '%A, %b %e, %Y',
		//valueDecimals: null,
		//valuePrefix: '',
		//valueSuffix: ''
	},

	credits: {
		enabled: true,
		href: 'http://www.highcharts.com',
		position: {
			align: 'right',
			x: -10,
			verticalAlign: 'bottom',
			y: -5
		},
		
		text: 'Highcharts.com'
	}
};




// Series defaults
H.defaultPlotOptions = H.defaultOptions.plotOptions;
H.defaultSeriesOptions = H.defaultPlotOptions.line;

// set the default time methods
setTimeMethods();



/**
 * Set the time methods globally based on the useUTC option. Time method can be either
 * local time or UTC (default).
 */
function setTimeMethods() {
	var globalOptions = H.defaultOptions.global,
		Date,
		useUTC = globalOptions.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	H.Date = Date = globalOptions.Date || window.Date; // Allow using a different Date class
	Date.hcTimezoneOffset = useUTC && globalOptions.timezoneOffset;
	Date.hcGetTimezoneOffset = useUTC && globalOptions.getTimezoneOffset;
	Date.hcMakeTime = function (year, month, date, hours, minutes, seconds) {
		var d;
		if (useUTC) {
			d = Date.UTC.apply(0, arguments);
			d += getTZOffset(d);
		} else {
			d = new Date(
				year,
				month,
				pick(date, 1),
				pick(hours, 0),
				pick(minutes, 0),
				pick(seconds, 0)
			).getTime();
		}
		return d;
	};
	each(['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcGet' + s] = GET + s;
	});
	each(['Milliseconds', 'Seconds', 'Minutes', 'Hours', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcSet' + s] = SET + s;
	});
}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
H.setOptions = function (options) {
	
	// Copy in the default options
	H.defaultOptions = merge(true, H.defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return H.defaultOptions;
};

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions for outside modules
 * wasn't enough because the setOptions method created a new object.
 */
H.getOptions = function() {
	return H.defaultOptions;
};

	return H;
}(Highcharts));
(function (H) {
	var Color,
		each = H.each,
		isNumber = H.isNumber,
		map = H.map,
		merge = H.merge,
		pInt = H.pInt,
		rgbaRegEx = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
		hexRegEx = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
		rgbRegEx = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/;
/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
H.Color = Color = function (input) {
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
		setOpacity: setOpacity,
		raw: input
	};
};

	return H;
}(Highcharts));
(function (H) {
	var SVGElement,
		SVGRenderer,

		addEvent = H.addEvent,
		attr = H.attr,
		Color = H.Color,
		css = H.css,
		createElement = H.createElement,
		defined = H.defined,
		deg2rad = H.deg2rad,
		destroyObjectProperties = H.destroyObjectProperties,
		each = H.each,
		extend = H.extend,
		erase = H.erase,
		hasTouch = H.hasTouch,
		isArray = H.isArray,
		isFirefox = H.isFirefox,
		isIE = H.isIE,
		isObject = H.isObject,
		isString = H.isString,
		isWebKit = H.isWebKit,
		merge = H.merge,
		pick = H.pick,
		pInt = H.pInt,
		removeEvent = H.removeEvent,
		svg = H.svg,
		SVG_NS = H.SVG_NS,
		useCanVG = H.useCanVG;

/**
 * A wrapper object for SVG elements
 */
SVGElement = H.SVGElement = function () {};
SVGElement.prototype = {
	
	// Default base for animation
	opacity: 1,
	SVG_NS: SVG_NS,
	// For labels, these CSS properties are applied to the <text> node directly
	textProps: ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'color', 
		'lineHeight', 'width', 'textDecoration', 'textOverflow', 'textShadow'],
	
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this;
		wrapper.element = nodeName === 'span' ?
			createElement(nodeName) :
			document.createElementNS(wrapper.SVG_NS, nodeName);
		wrapper.renderer = renderer;
	},
	
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 * @param {Function} complete Function to perform at the end of animation
	 */
	animate: function (params, options, complete) {
		var animOptions = pick(options, this.renderer.globalAnimation, true);
		HighchartsAdapter.stop(this); // stop regardless of animation actually running, or reverting to .attr (#607)
		if (animOptions) {
			animOptions = merge(animOptions, {}); //#2625
			if (complete) { // allows using a callback with the global animation without overwriting it
				animOptions.complete = complete;
			}
			HighchartsAdapter.animate(this, params, animOptions);
		} else {
			this.attr(params, null, complete);
		}
		return this;
	},

	/**
	 * Build an SVG gradient out of a common JavaScript configuration object
	 */
	colorGradient: function (color, prop, elem) {
		var renderer = this.renderer,
			colorObject,
			gradName,
			gradAttr,
			radAttr,
			gradients,
			gradientObject,
			stops,
			stopColor,
			stopOpacity,
			radialReference,
			n,
			id,
			key = [];

		// Apply linear or radial gradients
		if (color.linearGradient) {
			gradName = 'linearGradient';
		} else if (color.radialGradient) {
			gradName = 'radialGradient';
		}

		if (gradName) {
			gradAttr = color[gradName];
			gradients = renderer.gradients;
			stops = color.stops;
			radialReference = elem.radialReference;

			// Keep < 2.2 kompatibility
			if (isArray(gradAttr)) {
				color[gradName] = gradAttr = {
					x1: gradAttr[0],
					y1: gradAttr[1],
					x2: gradAttr[2],
					y2: gradAttr[3],
					gradientUnits: 'userSpaceOnUse'
				};
			}

			// Correct the radial gradient for the radial reference system
			if (gradName === 'radialGradient' && radialReference && !defined(gradAttr.gradientUnits)) {
				radAttr = gradAttr; // Save the radial attributes for updating
				gradAttr = merge(gradAttr, 
					renderer.getRadialAttr(radialReference, radAttr),
					{ gradientUnits: 'userSpaceOnUse' }
				);
			}

			// Build the unique key to detect whether we need to create a new element (#1282)
			for (n in gradAttr) {
				if (n !== 'id') {
					key.push(n, gradAttr[n]);
				}
			}
			for (n in stops) {
				key.push(stops[n]);
			}
			key = key.join(',');

			// Check if a gradient object with the same config object is created within this renderer
			if (gradients[key]) {
				id = gradients[key].attr('id');

			} else {

				// Set the id and create the element
				gradAttr.id = id = 'highcharts-' + H.idCounter++;
				gradients[key] = gradientObject = renderer.createElement(gradName)
					.attr(gradAttr)
					.add(renderer.defs);

				gradientObject.radAttr = radAttr;

				// The gradient needs to keep a list of stops to be able to destroy them
				gradientObject.stops = [];
				each(stops, function (stop) {
					var stopObject;
					if (stop[1].indexOf('rgba') === 0) {
						colorObject = Color(stop[1]);
						stopColor = colorObject.get('rgb');
						stopOpacity = colorObject.get('a');
					} else {
						stopColor = stop[1];
						stopOpacity = 1;
					}
					stopObject = renderer.createElement('stop').attr({
						offset: stop[0],
						'stop-color': stopColor,
						'stop-opacity': stopOpacity
					}).add(gradientObject);

					// Add the stop element to the gradient
					gradientObject.stops.push(stopObject);
				});
			}

			// Set the reference to the gradient object
			elem.setAttribute(prop, 'url(' + renderer.url + '#' + id + ')');
			elem.gradient = key;
		} 
	},

	/**
	 * Apply a polyfill to the text-stroke CSS property, by copying the text element
	 * and apply strokes to the copy.
	 *
	 * Contrast checks at http://jsfiddle.net/highcharts/43soe9m1/2/
	 *
	 * docs: update default, document the polyfill and the limitations on hex colors and pixel values, document contrast pseudo-color
	 */
	applyTextShadow: function (textShadow) {
		var elem = this.element,
			tspans,
			hasContrast = textShadow.indexOf('contrast') !== -1,
			styles = {},
			// IE10 and IE11 report textShadow in elem.style even though it doesn't work. Check
			// this again with new IE release. In exports, the rendering is passed to PhantomJS.
			supports = this.renderer.forExport || (elem.style.textShadow !== undefined && !isIE);

		// When the text shadow is set to contrast, use dark stroke for light text and vice versa
		if (hasContrast) {
			styles.textShadow = textShadow = textShadow.replace(/contrast/g, this.renderer.getContrast(elem.style.fill));
		}

		// Safari with retina displays as well as PhantomJS bug (#3974). Firefox does not tolerate this,
		// it removes the text shadows.
		if (isWebKit) {
			styles.textRendering = 'geometricPrecision';
		}

		/* Selective side-by-side testing in supported browser (http://jsfiddle.net/highcharts/73L1ptrh/)
		if (elem.textContent.indexOf('2.') === 0) {
			elem.style['text-shadow'] = 'none';
			supports = false;
		}
		// */

		// No reason to polyfill, we've got native support
		if (supports) {
			css(elem, styles); // Apply altered textShadow or textRendering workaround
		} else {

			this.fakeTS = true; // Fake text shadow

			// In order to get the right y position of the clones, 
			// copy over the y setter
			this.ySetter = this.xSetter;

			tspans = [].slice.call(elem.getElementsByTagName('tspan'));
			each(textShadow.split(/\s?,\s?/g), function (textShadow) {
				var firstChild = elem.firstChild,
					color,
					strokeWidth;
				
				textShadow = textShadow.split(' ');
				color = textShadow[textShadow.length - 1];

				// Approximately tune the settings to the text-shadow behaviour
				strokeWidth = textShadow[textShadow.length - 2];

				if (strokeWidth) {
					each(tspans, function (tspan, y) {
						var clone;

						// Let the first line start at the correct X position
						if (y === 0) {
							tspan.setAttribute('x', elem.getAttribute('x'));
							y = elem.getAttribute('y');
							tspan.setAttribute('y', y || 0);
							if (y === null) {
								elem.setAttribute('y', 0);
							}
						}

						// Create the clone and apply shadow properties
						clone = tspan.cloneNode(1);
						attr(clone, {
							'class': 'highcharts-text-shadow',
							'fill': color,
							'stroke': color,
							'stroke-opacity': 1 / Math.max(pInt(strokeWidth), 3),
							'stroke-width': strokeWidth,
							'stroke-linejoin': 'round'
						});
						elem.insertBefore(clone, firstChild);
					});
				}
			});
		}
	},

	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function (hash, val, complete) {
		var key,
			value,
			element = this.element,
			hasSetSymbolSize,
			ret = this,
			skipAttr;

		// single key-value pair
		if (typeof hash === 'string' && val !== undefined) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter: first argument is a string, second is undefined
		if (typeof hash === 'string') {
			ret = (this[hash + 'Getter'] || this._defaultGetter).call(this, hash, element);
		
		// setter
		} else {

			for (key in hash) {
				value = hash[key];
				skipAttr = false;



				if (this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(key)) {
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);
						hasSetSymbolSize = true;
					}
					skipAttr = true;
				}

				if (this.rotation && (key === 'x' || key === 'y')) {
					this.doTransform = true;
				}
				
				if (!skipAttr) {
					(this[key + 'Setter'] || this._defaultSetter).call(this, value, key, element);
				}

				// Let the shadow follow the main element
				if (this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(key)) {
					this.updateShadows(key, value);
				}
			}

			// Update transform. Do this outside the loop to prevent redundant updating for batch setting
			// of attributes.
			if (this.doTransform) {
				this.updateTransform();
				this.doTransform = false;
			}

		}

		// In accordance with animate, run a complete callback
		if (complete) {
			complete();
		}

		return ret;
	},

	updateShadows: function (key, value) {
		var shadows = this.shadows,
			i = shadows.length;
		while (i--) {
			shadows[i].setAttribute(
				key,
				key === 'height' ?
					Math.max(value - (shadows[i].cutHeight || 0), 0) :
					key === 'd' ? this.d : value
			);
		}
	},

	/**
	 * Add a class name to an element
	 */
	addClass: function (className) {
		var element = this.element,
			currentClassName = attr(element, 'class') || '';

		if (currentClassName.indexOf(className) === -1) {
			attr(element, 'class', currentClassName + (currentClassName ? ' ' : '') + className);
		}
		return this;
	},
	/* hasClass and removeClass are not (yet) needed */
	hasClass: function (className) {
		return attr(this.element, 'class').indexOf(className) !== -1;
	},
	removeClass: function (className) {
		attr(this.element, 'class', (attr(this.element, 'class') || '').replace(className, ''));
		return this;
	},

	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function (hash) {
		var wrapper = this;

		each(['x', 'y', 'r', 'start', 'end', 'width', 'height', 'innerR', 'anchorX', 'anchorY'], function (key) {
			wrapper[key] = pick(hash[key], wrapper[key]);
		});

		wrapper.attr({
			d: wrapper.renderer.symbols[wrapper.symbolName](
				wrapper.x,
				wrapper.y,
				wrapper.width,
				wrapper.height,
				wrapper
			)
		});
	},

	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function (clipRect) {
		return this.attr('clip-path', clipRect ? 'url(' + this.renderer.url + '#' + clipRect.id + ')' : 'none');
	},

	/**
	 * Calculate the coordinates needed for drawing a rectangle crisply and return the
	 * calculated attributes
	 * @param {Number} strokeWidth
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	crisp: function (rect, strokeWidth) {

		var wrapper = this,
			key,
			attribs = {},
			normalizer;

		strokeWidth = strokeWidth || rect.strokeWidth || wrapper.strokeWidth || 0;
		normalizer = Math.round(strokeWidth) % 2 / 2; // Math.round because strokeWidth can sometimes have roundoff errors

		// normalize for crisp edges
		rect.x = Math.floor(rect.x || wrapper.x || 0) + normalizer;
		rect.y = Math.floor(rect.y || wrapper.y || 0) + normalizer;
		rect.width = Math.floor((rect.width || wrapper.width || 0) - 2 * normalizer);
		rect.height = Math.floor((rect.height || wrapper.height || 0) - 2 * normalizer);
		if (defined(rect.strokeWidth)) {
			rect.strokeWidth = strokeWidth;
		}

		for (key in rect) {
			if (wrapper[key] !== rect[key]) { // only set attribute if changed
				wrapper[key] = attribs[key] = rect[key];
			}
		}

		return attribs;
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function (styles) {
		var elemWrapper = this,
			oldStyles = elemWrapper.styles,
			newStyles = {},
			elem = elemWrapper.element,
			textWidth,
			n,
			serializedCss = '',
			hyphenate,
			hasNew = !oldStyles;

		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}

		// Filter out existing styles to increase performance (#2640)
		if (oldStyles) {
			for (n in styles) {
				if (styles[n] !== oldStyles[n]) {
					newStyles[n] = styles[n];
					hasNew = true;
				}
			}
		}
		if (hasNew) {
			textWidth = elemWrapper.textWidth = 
				(styles && styles.width && elem.nodeName.toLowerCase() === 'text' && pInt(styles.width)) || 
				elemWrapper.textWidth; // #3501

			// Merge the new styles with the old ones
			if (oldStyles) {
				styles = extend(
					oldStyles,
					newStyles
				);
			}		

			// store object
			elemWrapper.styles = styles;

			if (textWidth && (useCanVG || (!svg && elemWrapper.renderer.forExport))) {
				delete styles.width;
			}

			// serialize and set style attribute
			if (isIE && !svg) {
				css(elemWrapper.element, styles);
			} else {
				/*jslint unparam: true*/
				hyphenate = function (a, b) { return '-' + b.toLowerCase(); };
				/*jslint unparam: false*/
				for (n in styles) {
					serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + styles[n] + ';';
				}
				attr(elem, 'style', serializedCss); // #1881
			}


			// re-build text
			if (textWidth && elemWrapper.added) {
				elemWrapper.renderer.buildText(elemWrapper);
			}
		}

		return elemWrapper;
	},

	
	/**
	 * Get a computed style
	 */
	getStyle: function (prop) {
		return window.getComputedStyle(this.element || this, '').getPropertyValue(prop);
	},

	/**
	 * Get a computed style in pixel values
	 */
	pxStyle: function (prop) {
		var val = this.getStyle(prop),
			ret,
			dummy;

		// Read pixel values directly
		if (val.indexOf('px') === val.length - 2) {
			ret = pInt(val);

		// Other values like em, pt etc need to be measured
		} else {
			dummy = document.createElementNS(SVG_NS, 'rect');
			attr(dummy, {
				'width': val,
				'stroke-width': 0
			});
			this.element.parentNode.appendChild(dummy);
			ret = dummy.getBBox().width;
			dummy.parentNode.removeChild(dummy);
		}
		return ret;
	},
	
	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		var svgElement = this,
			element = svgElement.element;
		
		// touch
		if (hasTouch && eventType === 'click') {
			element.ontouchstart = function (e) {			
				svgElement.touchEventFired = Date.now();				
				e.preventDefault();
				handler.call(element, e);
			};
			element.onclick = function (e) {												
				if (navigator.userAgent.indexOf('Android') === -1 || Date.now() - (svgElement.touchEventFired || 0) > 1100) { // #2269
					handler.call(element, e);
				}
			};			
		} else {
			// simplest possible event model for internal use
			element['on' + eventType] = handler;
		}
		return this;
	},

	/**
	 * Set the coordinates needed to draw a consistent radial gradient across
	 * pie slices regardless of positioning inside the chart. The format is
	 * [centerX, centerY, diameter] in pixels.
	 */
	setRadialReference: function (coordinates) {
		var existingGradient = this.renderer.gradients[this.element.gradient];

		this.element.radialReference = coordinates;
		
		// On redrawing objects with an existing gradient, the gradient needs
		// to be repositioned (#3801)
		if (existingGradient && existingGradient.radAttr) {
			existingGradient.animate(
				this.renderer.getRadialAttr(
					coordinates, 
					existingGradient.radAttr
				)
			);
		}

		return this;
	},

	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function (x, y) {
		return this.attr({
			translateX: x,
			translateY: y
		});
	},

	/**
	 * Invert a group, rotate and flip
	 */
	invert: function () {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},

	/**
	 * Private method to update the transform attribute based on internal
	 * properties
	 */
	updateTransform: function () {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			scaleX = wrapper.scaleX,
			scaleY = wrapper.scaleY,
			inverted = wrapper.inverted,
			rotation = wrapper.rotation,
			element = wrapper.element,
			transform;

		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}

		// Apply translate. Nearly all transformed elements have translation, so instead
		// of checking for translate = 0, do it always (#1767, #1846).
		transform = ['translate(' + translateX + ',' + translateY + ')'];

		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push('rotate(' + rotation + ' ' + (element.getAttribute('x') || 0) + ' ' + (element.getAttribute('y') || 0) + ')');
			
			// Delete bBox memo when the rotation changes
			//delete wrapper.bBox;
		}

		// apply scale
		if (defined(scaleX) || defined(scaleY)) {
			transform.push('scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')');
		}

		if (transform.length) {
			element.setAttribute('transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function () {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},


	/**
	 * Break down alignment options like align, verticalAlign, x and y
	 * to x and y relative to the chart.
	 *
	 * @param {Object} alignOptions
	 * @param {Boolean} alignByTranslate
	 * @param {String[Object} box The box to align to, needs a width and height. When the
	 *		box is a string, it refers to an object in the Renderer. For example, when
	 *		box is 'spacingBox', it refers to Renderer.spacingBox which holds width, height
	 *		x and y properties.
	 *
	 */
	align: function (alignOptions, alignByTranslate, box) {
		var align,
			vAlign,
			x,
			y,
			attribs = {},
			alignTo,
			renderer = this.renderer,
			alignedObjects = renderer.alignedObjects;

		// First call on instanciate
		if (alignOptions) {
			this.alignOptions = alignOptions;
			this.alignByTranslate = alignByTranslate;
			if (!box || isString(box)) { // boxes other than renderer handle this internally
				this.alignTo = alignTo = box || 'renderer';
				erase(alignedObjects, this); // prevent duplicates, like legendGroup after resize
				alignedObjects.push(this);
				box = null; // reassign it below
			}

		// When called on resize, no arguments are supplied
		} else {
			alignOptions = this.alignOptions;
			alignByTranslate = this.alignByTranslate;
			alignTo = this.alignTo;
		}

		box = pick(box, renderer[alignTo], renderer);

		// Assign variables
		align = alignOptions.align;
		vAlign = alignOptions.verticalAlign;
		x = (box.x || 0) + (alignOptions.x || 0); // default: left align
		y = (box.y || 0) + (alignOptions.y || 0); // default: top align

		// Align
		if (align === 'right' || align === 'center') {
			x += (box.width - (alignOptions.width || 0)) /
					{ right: 1, center: 2 }[align];
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = Math.round(x);


		// Vertical align
		if (vAlign === 'bottom' || vAlign === 'middle') {
			y += (box.height - (alignOptions.height || 0)) /
					({ bottom: 1, middle: 2 }[vAlign] || 1);

		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = Math.round(y);

		// Animate only if already placed
		this[this.placed ? 'animate' : 'attr'](attribs);
		this.placed = true;
		this.alignAttr = attribs;

		return this;
	},

	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function (reload) {
		var wrapper = this,
			numRegex = /^[0-9]+$/,
			bBox,// = wrapper.bBox,
			renderer = wrapper.renderer,
			width,
			height,
			rotation = wrapper.rotation,
			element = wrapper.element,
			styles = wrapper.styles,
			rad = rotation * deg2rad,
			textStr = wrapper.textStr,
			textShadow,
			elemStyle = element.style,
			toggleTextShadowShim,
			cacheKey;

		if (textStr !== undefined) {

			// Properties that affect bounding box
			cacheKey = ['', rotation || 0, styles && styles.fontSize, element.style.width].join(',');

			// Since numbers are monospaced, and numerical labels appear a lot in a chart,
			// we assume that a label of n characters has the same bounding box as others 
			// of the same length.
			if (textStr === '' || numRegex.test(textStr)) {
				cacheKey = 'num:' + textStr.toString().length + cacheKey;

			// Caching all strings reduces rendering time by 4-5%.
			} else {
				cacheKey = textStr + cacheKey;
			}
		}

		if (cacheKey && !reload) {
			bBox = renderer.cache[cacheKey];
		}

		// No cache found
		if (!bBox) {

			// SVG elements
			if (element.namespaceURI === wrapper.SVG_NS || renderer.forExport) {
				try { // Fails in Firefox if the container has display: none.

					// When the text shadow shim is used, we need to hide the fake shadows
					// to get the correct bounding box (#3872)
					toggleTextShadowShim = this.fakeTS && function (display) {
						each(element.querySelectorAll('.' + 'highcharts-text-shadow'), function (tspan) {
							tspan.style.display = display;
						});
					};

					// Workaround for #3842, Firefox reporting wrong bounding box for shadows
					if (isFirefox && elemStyle.textShadow) {
						textShadow = elemStyle.textShadow;
						elemStyle.textShadow = '';
					} else if (toggleTextShadowShim) {
						toggleTextShadowShim('none');
					}

					bBox = element.getBBox ?
						// SVG: use extend because IE9 is not allowed to change width and height in case
						// of rotation (below)
						extend({}, element.getBBox()) :
						// Canvas renderer and legacy IE in export mode
						{
							width: element.offsetWidth,
							height: element.offsetHeight
						};

					// #3842
					if (textShadow) {
						elemStyle.textShadow = textShadow;
					} else if (toggleTextShadowShim) {
						toggleTextShadowShim('');
					}
				} catch (e) {}

				// If the bBox is not set, the try-catch block above failed. The other condition
				// is for Opera that returns a width of -Infinity on hidden elements.
				if (!bBox || bBox.width < 0) {
					bBox = { width: 0, height: 0 };
				}


			// VML Renderer or useHTML within SVG
			} else {

				bBox = wrapper.htmlGetBBox();

			}

			// True SVG elements as well as HTML elements in modern browsers using the .useHTML option
			// need to compensated for rotation
			if (renderer.isSVG) {
				width = bBox.width;
				height = bBox.height;

				// Workaround for wrong bounding box in IE9 and IE10 (#1101, #1505, #1669, #2568)
				if (isIE && styles && styles.fontSize === '11px' && height.toPrecision(3) === '16.9') {
					bBox.height = height = 14;
				}

				// Adjust for rotated text
				if (rotation) {
					bBox.width = Math.abs(height * Math.sin(rad)) + Math.abs(width * Math.cos(rad));
					bBox.height = Math.abs(height * Math.cos(rad)) + Math.abs(width * Math.sin(rad));
				}
			}

			// Cache it
			if (cacheKey) {
				renderer.cache[cacheKey] = bBox;
			}
		}
		return bBox;
	},

	/**
	 * Show the element
	 */
	show: function (inherit) {
		return this.attr({ visibility: inherit ? 'inherit' : 'visible' });
	},

	/**
	 * Hide the element
	 */
	hide: function () {
		return this.attr({ visibility: 'hidden' });
	},

	fadeOut: function (duration) {
		var elemWrapper = this;
		elemWrapper.animate({
			opacity: 0
		}, {
			duration: duration || 150,
			complete: function () {
				elemWrapper.attr({ y: -9999 }); // #3088, assuming we're only using this for tooltips
			}
		});
	},

	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *	to append the element to the renderer.box.
	 */
	add: function (parent) {

		var renderer = this.renderer,
			element = this.element,
			inserted;

		if (parent) {
			this.parentGroup = parent;
		}

		// mark as inverted
		this.parentInverted = parent && parent.inverted;

		// build formatted text
		if (this.textStr !== undefined) {
			renderer.buildText(this);
		}

		// Mark as added
		this.added = true;

		// If we're adding to renderer root, or other elements in the group 
		// have a z index, we need to handle it
		if (!parent || parent.handleZ || this.zIndex) {
			inserted = this.zIndexSetter();
		}

		// If zIndex is not handled, append at the end
		if (!inserted) {
			(parent ? parent.element : renderer.box).appendChild(element);
		}

		// fire an event for internal hooks
		if (this.onAdd) {
			this.onAdd();
		}

		return this;
	},

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		var parentNode = element.parentNode;
		if (parentNode) {
			parentNode.removeChild(element);
		}
	},

	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function () {
		var wrapper = this,
			element = wrapper.element || {},
			shadows = wrapper.shadows,
			parentToClean = wrapper.renderer.isSVG && element.nodeName === 'SPAN' && wrapper.parentGroup,
			grandParent,
			key,
			i;

		// remove events
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = element.point = null;
		HighchartsAdapter.stop(wrapper); // stop running animations

		if (wrapper.clipPath) {
			wrapper.clipPath = wrapper.clipPath.destroy();
		}

		// Destroy stops in case this is a gradient object
		if (wrapper.stops) {
			for (i = 0; i < wrapper.stops.length; i++) {
				wrapper.stops[i] = wrapper.stops[i].destroy();
			}
			wrapper.stops = null;
		}

		// remove element
		wrapper.safeRemoveChild(element);

		// destroy shadows
		if (shadows) {
			each(shadows, function (shadow) {
				wrapper.safeRemoveChild(shadow);
			});
		}

		// In case of useHTML, clean up empty containers emulating SVG groups (#1960, #2393, #2697).
		while (parentToClean && parentToClean.div && parentToClean.div.childNodes.length === 0) {
			grandParent = parentToClean.parentGroup;
			wrapper.safeRemoveChild(parentToClean.div);
			delete parentToClean.div;
			parentToClean = grandParent;
		}

		// remove from alignObjects
		if (wrapper.alignTo) {
			erase(wrapper.renderer.alignedObjects, wrapper);
		}

		for (key in wrapper) {
			delete wrapper[key];
		}

		return null;
	},

	/**
	 * Add a shadow to the element. Must be done after the element is added to the DOM
	 * @param {Boolean|Object} shadowOptions
	 */
	shadow: function (shadowOptions, group, cutOff) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			strokeWidth,
			shadowWidth,
			shadowElementOpacity,

			// compensate for inverted plot area
			transform;


		if (shadowOptions) {
			shadowWidth = pick(shadowOptions.width, 3);
			shadowElementOpacity = (shadowOptions.opacity || 0.15) / shadowWidth;
			transform = this.parentInverted ?
				'(-1,-1)' :
				'(' + pick(shadowOptions.offsetX, 1) + ', ' + pick(shadowOptions.offsetY, 1) + ')';
			for (i = 1; i <= shadowWidth; i++) {
				shadow = element.cloneNode(0);
				strokeWidth = (shadowWidth * 2) + 1 - (2 * i);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': shadowOptions.color || 'black',
					'stroke-opacity': shadowElementOpacity * i,
					'stroke-width': strokeWidth,
					'transform': 'translate' + transform,
					'fill': 'none'
				});
				if (cutOff) {
					attr(shadow, 'height', Math.max(attr(shadow, 'height') - strokeWidth, 0));
					shadow.cutHeight = strokeWidth;
				}

				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				shadows.push(shadow);
			}

			this.shadows = shadows;
		}
		return this;

	},

	xGetter: function (key) {
		if (this.element.nodeName === 'circle') {
			key = { x: 'cx', y: 'cy' }[key] || key;
		}
		return this._defaultGetter(key);
	},

	/** 
	 * Get the current value of an attribute or pseudo attribute, used mainly
	 * for animation.
	 */
	_defaultGetter: function (key) {
		var ret = pick(this[key], this.element ? this.element.getAttribute(key) : null, 0);

		if (/^[\-0-9\.]+$/.test(ret)) { // is numerical
			ret = parseFloat(ret);
		}
		return ret;
	},


	dSetter: function (value, key, element) {
		if (value && value.join) { // join path
			value = value.join(' ');
		}
		if (/(NaN| {2}|^$)/.test(value)) {
			value = 'M 0 0';
		}
		element.setAttribute(key, value);

		this[key] = value;
	},
	
	alignSetter: function (value) {
		this.element.setAttribute('text-anchor', { left: 'start', center: 'middle', right: 'end' }[value]);
	},
	opacitySetter: function (value, key, element) {
		this[key] = value;
		element.setAttribute(key, value);
	},
	titleSetter: function (value) {
		var titleNode = this.element.getElementsByTagName('title')[0];
		if (!titleNode) {
			titleNode = document.createElementNS(this.SVG_NS, 'title');
			this.element.appendChild(titleNode);
		}
		titleNode.appendChild(
			document.createTextNode(
				(String(pick(value), '')).replace(/<[^>]*>/g, '') // #3276, #3895
			)
		);
	},
	textSetter: function (value) {
		if (value !== this.textStr) {
			// Delete bBox memo when the text changes
			delete this.bBox;
		
			this.textStr = value;
			if (this.added) {
				this.renderer.buildText(this);
			}
		}
	},
	fillSetter: function (value, key, element) {
		if (typeof value === 'string') {
			element.setAttribute(key, value);
		} else if (value) {
			this.colorGradient(value, key, element);
		}
	},
	visibilitySetter: function (value, key, element) {
		// IE9-11 doesn't handle visibilty:inherit well, so we remove the attribute instead (#2881, #3909)
		if (value === 'inherit') {
			element.removeAttribute(key);
		} else {
			element.setAttribute(key, value);
		}
	},
	zIndexSetter: function (value, key) {
		var renderer = this.renderer,
			parentGroup = this.parentGroup,
			parentWrapper = parentGroup || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes,
			otherElement,
			otherZIndex,
			element = this.element,
			inserted,
			run = this.added,
			i;
		
		if (defined(value)) {
			element.setAttribute(key, value); // So we can read it for other elements in the group
			value = +value;
			if (this[key] === value) { // Only update when needed (#3865)
				run = false;
			}
			this[key] = value;
		}

		// Insert according to this and other elements' zIndex. Before .add() is called,
		// nothing is done. Then on add, or by later calls to zIndexSetter, the node
		// is placed on the right place in the DOM.
		if (run) {
			value = this.zIndex;

			if (value && parentGroup) {
				parentGroup.handleZ = true;
			}
		
			childNodes = parentNode.childNodes;
			for (i = 0; i < childNodes.length && !inserted; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement !== element && (
						// Insert before the first element with a higher zIndex
						pInt(otherZIndex) > value ||
						// If no zIndex given, insert before the first element with a zIndex
						(!defined(value) && defined(otherZIndex))

						)) {
					parentNode.insertBefore(element, otherElement);
					inserted = true;
				}
			}
			if (!inserted) {
				parentNode.appendChild(element);
			}
		}
		return inserted;
	},
	_defaultSetter: function (value, key, element) {
		element.setAttribute(key, value);
	}
};

// Some shared setters and getters
SVGElement.prototype.yGetter = SVGElement.prototype.xGetter;
SVGElement.prototype.translateXSetter = SVGElement.prototype.translateYSetter = 
		SVGElement.prototype.rotationSetter = SVGElement.prototype.verticalAlignSetter = 
		SVGElement.prototype.scaleXSetter = SVGElement.prototype.scaleYSetter = function (value, key) {
	this[key] = value;
	this.doTransform = true;
};



/**
 * The default SVG renderer
 */
SVGRenderer = H.SVGRenderer = function () {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	Element: SVGElement,
	SVG_NS: SVG_NS,
	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Boolean} forExport
	 */
	init: function (container, width, height, style, forExport, allowHTML) {
		var renderer = this,
			loc = location,
			boxWrapper,
			element,
			desc;

		boxWrapper = renderer.createElement('svg')
			.attr({
				'version': '1.1',
				'class': 'highcharts-root'
			})
			;
		element = boxWrapper.element;
		container.appendChild(element);

		// For browsers other than IE, add the namespace attribute (#1978)
		if (container.innerHTML.indexOf('xmlns') === -1) {
			attr(element, 'xmlns', this.SVG_NS);
		}

		// object properties
		renderer.isSVG = true;
		renderer.box = element;
		renderer.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];

		// Page url used for internal references. #24, #672, #1070
		renderer.url = (isFirefox || isWebKit) && document.getElementsByTagName('base').length ?
			loc.href
				.replace(/#.*?$/, '') // remove the hash
				.replace(/([\('\)])/g, '\\$1') // escape parantheses and quotes
				.replace(/ /g, '%20') : // replace spaces (needed for Safari only)
			'';

		// Add description
		desc = this.createElement('desc').add();
		desc.element.appendChild(document.createTextNode('Created with Highmaps 1.1.8-modified'));


		renderer.defs = this.createElement('defs').add();
		renderer.allowHTML = allowHTML;
		renderer.forExport = forExport;
		renderer.gradients = {}; // Object where gradient SvgElements are stored
		renderer.cache = {}; // Cache for numerical bounding boxes

		renderer.setSize(width, height, false);



		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			renderer.subPixelFix = subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (Math.ceil(rect.left) - rect.left) + 'px',
					top: (Math.ceil(rect.top) - rect.top) + 'px'
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(window, 'resize', subPixelFix);
		}
	},
	

	/**
	 * Detect whether the renderer is hidden. This happens when one of the parent elements
	 * has display: none. #608.
	 */
	isHidden: function () {
		return !this.boxWrapper.getBBox().width;
	},

	/**
	 * Destroys the renderer and its allocated members.
	 */
	destroy: function () {
		var renderer = this,
			rendererDefs = renderer.defs;
		renderer.box = null;
		renderer.boxWrapper = renderer.boxWrapper.destroy();

		// Call destroy on all gradient elements
		destroyObjectProperties(renderer.gradients || {});
		renderer.gradients = null;

		// Defs are null in VMLRenderer
		// Otherwise, destroy them here.
		if (rendererDefs) {
			renderer.defs = rendererDefs.destroy();
		}

		// Remove sub pixel fix handler
		// We need to check that there is a handler, otherwise all functions that are registered for event 'resize' are removed
		// See issue #982
		if (renderer.subPixelFix) {
			removeEvent(window, 'resize', renderer.subPixelFix);
		}

		renderer.alignedObjects = null;

		return null;
	},

	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function (nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},

	/**
	 * Dummy function for use in canvas renderer
	 */
	draw: function () {},

	/**
	 * Get converted radial gradient attributes
	 */
	getRadialAttr: function (radialReference, gradAttr) {
		return {
			cx: (radialReference[0] - radialReference[2] / 2) + gradAttr.cx * radialReference[2],
			cy: (radialReference[1] - radialReference[2] / 2) + gradAttr.cy * radialReference[2],
			r: gradAttr.r * radialReference[2]
		};
	},

	/**
	 * Parse a simple HTML string into SVG tspans
	 *
	 * @param {Object} textNode The parent text SVG node
	 */
	buildText: function (wrapper) {
		var textNode = wrapper.element,
			renderer = this,
			forExport = renderer.forExport,
			textStr = pick(wrapper.textStr, '').toString(),
			hasMarkup = textStr.indexOf('<') !== -1,
			lines,
			childNodes = textNode.childNodes,
			styleRegex,
			hrefRegex,
			parentX = attr(textNode, 'x'),
			textStyles = wrapper.styles,
			width = wrapper.textWidth,
			textLineHeight = textStyles && textStyles.lineHeight,
			textShadow = textStyles && textStyles.textShadow,
			ellipsis = textStyles && textStyles.textOverflow === 'ellipsis',
			i = childNodes.length,
			tempParent = width && !wrapper.added && this.box,
			getLineHeight = function (tspan) {
				var fontSizeStyle;
				

				return textLineHeight ? 
					pInt(textLineHeight) :
					renderer.fontMetrics(
						fontSizeStyle,
						tspan
					).h;
			},
			unescapeAngleBrackets = function (inputStr) {
				return inputStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			};

		/// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}

		// Skip tspans, add text directly to text node. The forceTSpan is a hook 
		// used in text outline hack.
		if (!hasMarkup && !textShadow && !ellipsis && textStr.indexOf(' ') === -1) {
			textNode.appendChild(document.createTextNode(unescapeAngleBrackets(textStr)));
			return;

		// Complex strings, add more logic
		} else {

			styleRegex = /<.*style="([^"]+)".*>/;
			hrefRegex = /<.*href="(http[^"]+)".*>/;

			if (tempParent) {
				tempPar