// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highstock JS v1.1.5 (2012-03-15)
 *
 * (c) 2009-2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, document, window, navigator, setInterval, clearInterval, clearTimeout, setTimeout, location, jQuery, $, console */

(function () {
// encapsulated variables
var UNDEFINED,
	doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathCeil = math.ceil,
	mathMax = math.max,
	mathMin = math.min,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,
	mathPI = math.PI,
	deg2rad = mathPI * 2 / 360,


	// some variables
	userAgent = navigator.userAgent,
	isIE = /msie/i.test(userAgent) && !win.opera,
	docMode8 = doc.documentMode === 8,
	isWebKit = /AppleWebKit/.test(userAgent),
	isFirefox = /Firefox/.test(userAgent),
	SVG_NS = 'http://www.w3.org/2000/svg',
	hasSVG = !!doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg').createSVGRect,
	hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4, // issue #38
	useCanVG = !hasSVG && !isIE && !!doc.createElement('canvas').getContext,
	Renderer,
	hasTouch = doc.documentElement.ontouchstart !== UNDEFINED,
	symbolSizes = {},
	idCounter = 0,
	garbageBin,
	defaultOptions,
	dateFormat, // function
	globalAnimation,
	pathAnim,
	timeUnits,

	// some constants for frequently used strings
	DIV = 'div',
	ABSOLUTE = 'absolute',
	RELATIVE = 'relative',
	HIDDEN = 'hidden',
	PREFIX = 'highcharts-',
	VISIBLE = 'visible',
	PX = 'px',
	NONE = 'none',
	M = 'M',
	L = 'L',
	/*
	 * Empirical lowest possible opacities for TRACKER_FILL
	 * IE6: 0.002
	 * IE7: 0.002
	 * IE8: 0.002
	 * IE9: 0.00000000001 (unlimited)
	 * FF: 0.00000000001 (unlimited)
	 * Chrome: 0.000001
	 * Safari: 0.000001
	 * Opera: 0.00000000001 (unlimited)
	 */
	TRACKER_FILL = 'rgba(192,192,192,' + (hasSVG ? 0.000001 : 0.002) + ')', // invisible but clickable
	//TRACKER_FILL = 'rgba(192,192,192,0.5)',
	NORMAL_STATE = '',
	HOVER_STATE = 'hover',
	SELECT_STATE = 'select',
	MILLISECOND = 'millisecond',
	SECOND = 'second',
	MINUTE = 'minute',
	HOUR = 'hour',
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year',

	// constants for attributes
	FILL = 'fill',
	LINEAR_GRADIENT = 'linearGradient',
	STOPS = 'stops',
	STROKE = 'stroke',
	STROKE_WIDTH = 'stroke-width',

	// time methods, changed based on whether or not UTC is used
	makeTime,
	getMinutes,
	getHours,
	getDay,
	getDate,
	getMonth,
	getFullYear,
	setMinutes,
	setHours,
	setDate,
	setMonth,
	setFullYear,

	// check for a custom HighchartsAdapter defined prior to this file
	globalAdapter = win.HighchartsAdapter,
	adapter = globalAdapter || {},

	// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
	// and all the utility functions will be null. In that case they are populated by the
	// default adapters below.
	getScript = adapter.getScript,
	each = adapter.each,
	grep = adapter.grep,
	offset = adapter.offset,
	map = adapter.map,
	merge = adapter.merge,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	animate = adapter.animate,
	stop = adapter.stop,

	// lookup over the types and the associated classes
	seriesTypes = {};

// The Highcharts namespace
win.Highcharts = {};

/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
function extend(a, b) {
	var n;
	if (!a) {
		a = {};
	}
	for (n in b) {
		a[n] = b[n];
	}
	return a;
}

/**
 * Take an array and turn into a hash with even number arguments as keys and odd numbers as
 * values. Allows creating constants for commonly used style properties, attributes etc.
 * Avoid it in performance critical situations like looping
 */
function hash() {
	var i = 0,
		args = arguments,
		length = args.length,
		obj = {};
	for (; i < length; i++) {
		obj[args[i++]] = args[i];
	}
	return obj;
}

/**
 * Shortcut for parseInt
 * @param {Object} s
 * @param {Number} mag Magnitude
 */
function pInt(s, mag) {
	return parseInt(s, mag || 10);
}

/**
 * Check for string
 * @param {Object} s
 */
function isString(s) {
	return typeof s === 'string';
}

/**
 * Check for object
 * @param {Object} obj
 */
function isObject(obj) {
	return typeof obj === 'object';
}

/**
 * Check for array
 * @param {Object} obj
 */
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * Check for number
 * @param {Object} n
 */
function isNumber(n) {
	return typeof n === 'number';
}

function log2lin(num) {
	return math.log(num) / math.LN10;
}
function lin2log(num) {
	return math.pow(10, num);
}

/**
 * Remove last occurence of an item from an array
 * @param {Array} arr
 * @param {Mixed} item
 */
function erase(arr, item) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === item) {
			arr.splice(i, 1);
			break;
		}
	}
	//return arr;
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined(obj) {
	return obj !== UNDEFINED && obj !== null;
}

/**
 * Set or get an attribute or an object of attributes. Can't use jQuery attr because
 * it attempts to set expando properties on the SVG element, which is not allowed.
 *
 * @param {Object} elem The DOM element to receive the attribute(s)
 * @param {String|Object} prop The property or an abject of key-value pairs
 * @param {String} value The value if a single property is set
 */
function attr(elem, prop, value) {
	var key,
		setAttribute = 'setAttribute',
		ret;

	// if the prop is a string
	if (isString(prop)) {
		// set the value
		if (defined(value)) {

			elem[setAttribute](prop, value);

		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}

	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && isObject(prop)) {
		for (key in prop) {
			elem[setAttribute](key, prop[key]);
		}
	}
	return ret;
}
/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
function splat(obj) {
	return isArray(obj) ? obj : [obj];
}


/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
function pick() {
	var args = arguments,
		i,
		arg,
		length = args.length;
	for (i = 0; i < length; i++) {
		arg = args[i];
		if (typeof arg !== 'undefined' && arg !== null) {
			return arg;
		}
	}
}

/**
 * Set CSS on a given element
 * @param {Object} el
 * @param {Object} styles Style object with camel case property names
 */
function css(el, styles) {
	if (isIE) {
		if (styles && styles.opacity !== UNDEFINED) {
			styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
		}
	}
	extend(el.style, styles);
}

/**
 * Utility function to create element with attributes and styles
 * @param {Object} tag
 * @param {Object} attribs
 * @param {Object} styles
 * @param {Object} parent
 * @param {Object} nopad
 */
function createElement(tag, attribs, styles, parent, nopad) {
	var el = doc.createElement(tag);
	if (attribs) {
		extend(el, attribs);
	}
	if (nopad) {
		css(el, {padding: 0, border: NONE, margin: 0});
	}
	if (styles) {
		css(el, styles);
	}
	if (parent) {
		parent.appendChild(el);
	}
	return el;
}

/**
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
function extendClass(parent, members) {
	var object = function () {};
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}

/**
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
function numberFormat(number, decimals, decPoint, thousandsSep) {
	var lang = defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = number,
		c = isNaN(decimals = mathAbs(decimals)) ? 2 : decimals,
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
		s = n < 0 ? "-" : "",
		i = String(pInt(n = mathAbs(+n || 0).toFixed(c))),
		j = i.length > 3 ? i.length % 3 : 0;

	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

/**
 * Pad a string to a given length by adding 0 to the beginning
 * @param {Number} number
 * @param {Number} length
 */
function pad(number, length) {
	// Create an array of the remaining length +1 and join it with 0's
	return new Array((length || 2) + 1 - String(number).length).join(0) + number;
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	if (!defined(timestamp) || isNaN(timestamp)) {
		return 'Invalid date';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');

	var date = new Date(timestamp),
		key, // used in for constuct below
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,
		/* // uncomment this and the 'W' format key below to enable week numbers
		weekNumber = function () {
			var clone = new Date(date.valueOf()),
				day = clone[getDay]() == 0 ? 7 : clone[getDay](),
				dayNumber;
			clone.setDate(clone[getDate]() + 4 - day);
			dayNumber = mathFloor((clone.getTime() - new Date(clone[getFullYear](), 0, 1, -6)) / 86400000);
			return 1 + mathFloor(dayNumber / 7);
		},
		*/

		// list all format keys
		replacements = {

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31
			'e': dayOfMonth, // Day of the month, 1 through 31

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
			'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
			'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
			'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()), // Two digits seconds, 00 through  59
			'L': pad(mathRound(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
		};


	// do the replaces
	for (key in replacements) {
		format = format.replace('%' + key, replacements[key]);
	}

	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};

/**
 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
 * @param {Number} interval
 * @param {Array} multiples
 * @param {Number} magnitude
 * @param {Object} options
 */
function normalizeTickInterval(interval, multiples, magnitude, options) {
	var normalized, i;

	// round to a tenfold of 1, 2, 2.5 or 5
	magnitude = pick(magnitude, 1);
	normalized = interval / magnitude;

	// multiples for a linear scale
	if (!multiples) {
		multiples = [1, 2, 2.5, 5, 10];

		// the allowDecimals option
		if (options && options.allowDecimals === false) {
			if (magnitude === 1) {
				multiples = [1, 2, 5, 10];
			} else if (magnitude <= 0.1) {
				multiples = [1 / magnitude];
			}
		}
	}

	// normalize the interval to the nearest multiple
	for (i = 0; i < multiples.length; i++) {
		interval = multiples[i];
		if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
			break;
		}
	}

	// multiply back to the correct magnitude
	interval *= magnitude;

	return interval;
}

/**
 * Get a normalized tick interval for dates. Returns a configuration object with
 * unit range (interval), count and name. Used to prepare data for getTimeTicks. 
 * Previously this logic was part of getTimeTicks, but as getTimeTicks now runs
 * of segments in stock charts, the normalizing logic was extracted in order to 
 * prevent it for running over again for each segment having the same interval. 
 * #662, #697.
 */
function normalizeTimeTickInterval(tickInterval, unitsOption) {
	var units = unitsOption || [[
				MILLISECOND, // unit name
				[1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
			], [
				SECOND,
				[1, 2, 5, 10, 15, 30]
			], [
				MINUTE,
				[1, 2, 5, 10, 15, 30]
			], [
				HOUR,
				[1, 2, 3, 4, 6, 8, 12]
			], [
				DAY,
				[1, 2]
			], [
				WEEK,
				[1, 2]
			], [
				MONTH,
				[1, 2, 3, 4, 6]
			], [
				YEAR,
				null
			]],
		unit = units[units.length - 1], // default unit is years
		interval = timeUnits[unit[0]],
		multiples = unit[1],
		count,
		i;
		
	// loop through the units to find the one that best fits the tickInterval
	for (i = 0; i < units.length; i++) {
		unit = units[i];
		interval = timeUnits[unit[0]];
		multiples = unit[1];


		if (units[i + 1]) {
			// lessThan is in the middle between the highest multiple and the next unit.
			var lessThan = (interval * multiples[multiples.length - 1] +
						timeUnits[units[i + 1][0]]) / 2;

			// break and keep the current unit
			if (tickInterval <= lessThan) {
				break;
			}
		}
	}

	// prevent 2.5 years intervals, though 25, 250 etc. are allowed
	if (interval === timeUnits[YEAR] && tickInterval < 5 * interval) {
		multiples = [1, 2, 5];
	}
	
	// prevent 2.5 years intervals, though 25, 250 etc. are allowed
	if (interval === timeUnits[YEAR] && tickInterval < 5 * interval) {
		multiples = [1, 2, 5];
	}

	// get the count
	count = normalizeTickInterval(tickInterval / interval, multiples);
	
	return {
		unitRange: interval,
		count: count,
		unitName: unit[0]
	};
}

/**
 * Set the tick positions to a time unit that makes sense, for example
 * on the first of each month or on every Monday. Return an array
 * with the time positions. Used in datetime axes as well as for grouping
 * data on a datetime axis.
 *
 * @param {Object} normalizedInterval The interval in axis values (ms) and the count
 * @param {Number} min The minimum in axis values
 * @param {Number} max The maximum in axis values
 * @param {Number} startOfWeek
 */
function getTimeTicks(normalizedInterval, min, max, startOfWeek) {
	var tickPositions = [],
		i,
		higherRanks = {},
		useUTC = defaultOptions.global.useUTC,
		minYear, // used in months and years as a basis for Date.UTC()
		minDate = new Date(min),
		interval = normalizedInterval.unitRange,
		count = normalizedInterval.count;

	

	if (interval >= timeUnits[SECOND]) { // second
		minDate.setMilliseconds(0);
		minDate.setSeconds(interval >= timeUnits[MINUTE] ? 0 :
			count * mathFloor(minDate.getSeconds() / count));
	}

	if (interval >= timeUnits[MINUTE]) { // minute
		minDate[setMinutes](interval >= timeUnits[HOUR] ? 0 :
			count * mathFloor(minDate[getMinutes]() / count));
	}

	if (interval >= timeUnits[HOUR]) { // hour
		minDate[setHours](interval >= timeUnits[DAY] ? 0 :
			count * mathFloor(minDate[getHours]() / count));
	}

	if (interval >= timeUnits[DAY]) { // day
		minDate[setDate](interval >= timeUnits[MONTH] ? 1 :
			count * mathFloor(minDate[getDate]() / count));
	}

	if (interval >= timeUnits[MONTH]) { // month
		minDate[setMonth](interval >= timeUnits[YEAR] ? 0 :
			count * mathFloor(minDate[getMonth]() / count));
		minYear = minDate[getFullYear]();
	}

	if (interval >= timeUnits[YEAR]) { // year
		minYear -= minYear % count;
		minDate[setFullYear](minYear);
	}

	// week is a special case that runs outside the hierarchy
	if (interval === timeUnits[WEEK]) {
		// get start of current week, independent of count
		minDate[setDate](minDate[getDate]() - minDate[getDay]() +
			pick(startOfWeek, 1));
	}


	// get tick positions
	i = 1;
	minYear = minDate[getFullYear]();
	var time = minDate.getTime(),
		minMonth = minDate[getMonth](),
		minDateDate = minDate[getDate]();

	// iterate and add tick positions at appropriate values
	while (time < max) {
		tickPositions.push(time);

		// if the interval is years, use Date.UTC to increase years
		if (interval === timeUnits[YEAR]) {
			time = makeTime(minYear + i * count, 0);

		// if the interval is months, use Date.UTC to increase months
		} else if (interval === timeUnits[MONTH]) {
			time = makeTime(minYear, minMonth + i * count);

		// if we're using global time, the interval is not fixed as it jumps
		// one hour at the DST crossover
		} else if (!useUTC && (interval === timeUnits[DAY] || interval === timeUnits[WEEK])) {
			time = makeTime(minYear, minMonth, minDateDate +
				i * count * (interval === timeUnits[DAY] ? 1 : 7));

		// else, the interval is fixed and we use simple addition
		} else {
			time += interval * count;
			
			// mark new days if the time is dividable by day
			if (interval <= timeUnits[HOUR] && time % timeUnits[DAY] === 0) {
				higherRanks[time] = DAY;
			}
		}

		i++;
	}
	
	// push the last time
	tickPositions.push(time);

	// record information on the chosen unit - for dynamic label formatter
	tickPositions.info = extend(normalizedInterval, {
		higherRanks: higherRanks,
		totalRange: interval * count
	});

	return tickPositions;
}

/**
 * Helper class that contains variuos counters that are local to the chart.
 */
function ChartCounters() {
	this.color = 0;
	this.symbol = 0;
}

ChartCounters.prototype =  {
	/**
	 * Wraps the color counter if it reaches the specified length.
	 */
	wrapColor: function (length) {
		if (this.color >= length) {
			this.color = 0;
		}
	},

	/**
	 * Wraps the symbol counter if it reaches the specified length.
	 */
	wrapSymbol: function (length) {
		if (this.symbol >= length) {
			this.symbol = 0;
		}
	}
};

/**
 * Utility method extracted from Tooltip code that places a tooltip in a chart without spilling over
 * and not covering the point it self.
 */
function placeBox(boxWidth, boxHeight, outerLeft, outerTop, outerWidth, outerHeight, point, distance, preferRight) {
	
	// keep the box within the chart area
	var pointX = point.x,
		pointY = point.y,
		x = pointX + outerLeft + (preferRight ? distance : -boxWidth - distance),
		y = pointY - boxHeight + outerTop + 15, // 15 means the point is 15 pixels up from the bottom of the tooltip
		alignedRight;

	// it is too far to the left, adjust it
	if (x < 7) {
		x = outerLeft + pointX + distance;
	}

	// Test to see if the tooltip is too far to the right,
	// if it is, move it back to be inside and then up to not cover the point.
	if ((x + boxWidth) > (outerLeft + outerWidth)) {
		x -= (x + boxWidth) - (outerLeft + outerWidth);
		y = pointY - boxHeight + outerTop - distance;
		alignedRight = true;
	}

	// if it is now above the plot area, align it to the top of the plot area
	if (y < outerTop + 5) {
		y = outerTop + 5;

		// If the tooltip is still covering the point, move it below instead
		if (alignedRight && pointY >= y && pointY <= (y + boxHeight)) {
			y = pointY + outerTop + distance; // below
		}
	} else if (y + boxHeight > outerTop + outerHeight) {
		y = outerTop + outerHeight - boxHeight - distance; // below
	}

	return {x: x, y: y};
}

/**
 * Utility method that sorts an object array and keeping the order of equal items.
 * ECMA script standard does not specify the behaviour when items are equal.
 */
function stableSort(arr, sortFunction) {
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
}

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
function arrayMin(data) {
	var i = data.length,
		min = data[0];

	while (i--) {
		if (data[i] < min) {
			min = data[i];
		}
	}
	return min;
}

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
function arrayMax(data) {
	var i = data.length,
		max = data[0];

	while (i--) {
		if (data[i] > max) {
			max = data[i];
		}
	}
	return max;
}

/**
 * Utility method that destroys any SVGElement or VMLElement that are properties on the given object.
 * It loops all properties and invokes destroy if there is a destroy method. The property is
 * then delete'ed.
 */
function destroyObjectProperties(obj) {
	var n;
	for (n in obj) {
		// If the object is non-null and destroy is defined
		if (obj[n] && obj[n].destroy) {
			// Invoke the destroy
			obj[n].destroy();
		}

		// Delete the property from the object.
		delete obj[n];
	}
}


/**
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
function discardElement(element) {
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) {
		garbageBin = createElement(DIV);
	}

	// move the node and empty bin
	if (element) {
		garbageBin.appendChild(element);
	}
	garbageBin.innerHTML = '';
}

/**
 * Provide error messages for debugging, with links to online explanation 
 */
function error(code, stop) {
	var msg = 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;
	if (stop) {
		throw msg;
	} else if (win.console) {
		console.log(msg);
	}
}

/**
 * Fix JS round off float errors
 * @param {Number} num
 */
function correctFloat(num) {
	return parseFloat(
		num.toPrecision(14)
	);
}

/**
 * The time unit lookup
 */
/*jslint white: true*/
timeUnits = hash(
	MILLISECOND, 1,
	SECOND, 1000,
	MINUTE, 60000,
	HOUR, 3600000,
	DAY, 24 * 3600000,
	WEEK, 7 * 24 * 3600000,
	MONTH, 30 * 24 * 3600000,
	YEAR, 31556952000
);
/*jslint white: false*/
/**
 * Path interpolation algorithm used across adapters
 */
pathAnim = {
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
					if (arr[i] === M) {
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
		if (shift === 1) {

			end = [].concat(end).splice(0, numParams).concat(end);
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


/**
 * Set the global animation to either a given value, or fall back to the
 * given chart's animation option
 * @param {Object} animation
 * @param {Object} chart
 */
function setAnimation(animation, chart) {
	globalAnimation = pick(animation, chart.animation);
}

/*
 * Define the adapter for frameworks. If an external adapter is not defined,
 * Highcharts reverts to the built-in jQuery adapter.
 */
if (globalAdapter && globalAdapter.init) {
	// Initialize the adapter with the pathAnim object that takes care
	// of path animations.
	globalAdapter.init(pathAnim);
}
if (!globalAdapter && win.jQuery) {
	var jQ = jQuery;

	/**
	 * Downloads a script and executes a callback when done.
	 * @param {String} scriptLocation
	 * @param {Function} callback
	 */
	getScript = jQ.getScript;

	/**
	 * Utility for iterating over an array. Parameters are reversed compared to jQuery.
	 * @param {Array} arr
	 * @param {Function} fn
	 */
	each = function (arr, fn) {
		var i = 0,
			len = arr.length;
		for (; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	};

	/**
	 * Filter an array
	 */
	grep = jQ.grep;

	/**
	 * Map an array
	 * @param {Array} arr
	 * @param {Function} fn
	 */
	map = function (arr, fn) {
		//return jQuery.map(arr, fn);
		var results = [],
			i = 0,
			len = arr.length;
		for (; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}
		return results;

	};

	/**
	 * Deep merge two objects and return a third object
	 */
	merge = function () {
		var args = arguments;
		return jQ.extend(true, null, args[0], args[1], args[2], args[3]);
	};

	/**
	 * Get the position of an element relative to the top left of the page
	 */
	offset = function (el) {
		return jQ(el).offset();
	};

	/**
	 * Add an event listener
	 * @param {Object} el A HTML element or custom object
	 * @param {String} event The event type
	 * @param {Function} fn The event handler
	 */
	addEvent = function (el, event, fn) {
		jQ(el).bind(event, fn);
	};

	/**
	 * Remove event added with addEvent
	 * @param {Object} el The object
	 * @param {String} eventType The event type. Leave blank to remove all events.
	 * @param {Function} handler The function to remove
	 */
	removeEvent = function (el, eventType, handler) {
		// workaround for jQuery issue with unbinding custom events:
		// http://forum.jquery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jquery-1-4-2
		var func = doc.removeEventListener ? 'removeEventListener' : 'detachEvent';
		if (doc[func] && !el[func]) {
			el[func] = function () {};
		}

		jQ(el).unbind(eventType, handler);
	};

	/**
	 * Fire an event on a custom object
	 * @param {Object} el
	 * @param {String} type
	 * @param {Object} eventArguments
	 * @param {Function} defaultFunction
	 */
	fireEvent = function (el, type, eventArguments, defaultFunction) {
		var event = jQ.Event(type),
			detachedType = 'detached' + type,
			defaultPrevented;

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
		each(['preventDefault', 'stopPropagation'], function (fn) {
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

		// trigger it
		jQ(el).trigger(event);

		// attach the method
		if (el[detachedType]) {
			el[type] = el[detachedType];
			el[detachedType] = null;
		}

		if (defaultFunction && !event.isDefaultPrevented() && !defaultPrevented) {
			defaultFunction(event);
		}
	};

	/**
	 * Animate a HTML element or SVG element wrapper
	 * @param {Object} el
	 * @param {Object} params
	 * @param {Object} options jQuery-like animation options: duration, easing, callback
	 */
	animate = function (el, params, options) {
		var $el = jQ(el);
		if (params.d) {
			el.toD = params.d; // keep the array form for paths, used in jQ.fx.step.d
			params.d = 1; // because in jQuery, animating to an array has a different meaning
		}

		$el.stop();
		$el.animate(params, options);

	};
	/**
	 * Stop running animation
	 */
	stop = function (el) {
		jQ(el).stop();
	};


	//=== Extend jQuery on init

	/*jslint unparam: true*//* allow unused param x in this function */
	jQ.extend(jQ.easing, {
		easeOutQuad: function (x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}
	});
	/*jslint unparam: false*/

	// extend the animate function to allow SVG animations
	var jFx = jQuery.fx,
		jStep = jFx.step;

	// extend some methods to check for elem.attr, which means it is a Highcharts SVG object
	each(['cur', '_default', 'width', 'height'], function (fn, i) {
		var obj = i ? jStep : jFx.prototype, // 'cur', the getter' relates to jFx.prototype
			base = obj[fn],
			elem;

		if (base) { // step.width and step.height don't exist in jQuery < 1.7

			// create the extended function replacement
			obj[fn] = function (fx) {

				// jFx.prototype.cur does not use fx argument
				fx = i ? fx : this;

				// shortcut
				elem = fx.elem;

				// jFX.prototype.cur returns the current value. The other ones are setters
				// and returning a value has no effect.
				return elem.attr ? // is SVG element wrapper
					elem.attr(fx.prop, fx.now) : // apply the SVG wrapper's method
					base.apply(this, arguments); // use jQuery's built-in method
			};
		}
	});

	// animate paths
	jStep.d = function (fx) {
		var elem = fx.elem;


		// Normally start and end should be set in state == 0, but sometimes,
		// for reasons unknown, this doesn't happen. Perhaps state == 0 is skipped
		// in these cases
		if (!fx.started) {
			var ends = pathAnim.init(elem, elem.d, elem.toD);
			fx.start = ends[0];
			fx.end = ends[1];
			fx.started = true;
		}


		// interpolate each value of the path
		elem.attr('d', pathAnim.step(fx.start, fx.end, fx.pos, elem.toD));

	};
}

/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
var

defaultLabelOptions = {
	enabled: true,
	// rotation: 0,
	align: 'center',
	x: 0,
	y: 15,
	/*formatter: function () {
		return this.value;
	},*/
	style: {
		color: '#666',
		fontSize: '11px',
		lineHeight: '14px'
	}
};

defaultOptions = {
	colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
		'#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'],
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		decimalPoint: '.',
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ','
	},
	global: {
		useUTC: true,
		canvasToolsURL: 'http://code.highcharts.com/stock/1.1.5/modules/canvas-tools.js'
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
		borderRadius: 5,
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		spacingTop: 10,
		spacingRight: 10,
		spacingBottom: 15,
		spacingLeft: 10,
		style: {
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
			fontSize: '12px'
		},
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
		// margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		y: 15,
		style: {
			color: '#3E576F',
			fontSize: '16px'
		}

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		y: 30,
		style: {
			color: '#6D869F'
		}
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
			lineWidth: 2,
			shadow: true,
			// stacking: null,
			marker: {
				enabled: true,
				//symbol: null,
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				//fillColor: null,
				states: { // states for a single point
					hover: {
						//radius: base + 2
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
			dataLabels: merge(defaultLabelOptions, {
				enabled: false,
				y: -6,
				formatter: function () {
					return this.y;
				}
				// backgroundColor: undefined,
				// borderColor: undefined,
				// borderRadius: undefined,
				// borderWidth: undefined,
				// padding: 3,
				// shadow: false
			}),
			cropThreshold: 300, // draw points outside the plot area when the number of points is less than this
			pointRange: 0,
			//pointStart: 0,
			//pointInterval: 1,
			showInLegend: true,
			states: { // states for the entire series
				hover: {
					//enabled: false,
					//lineWidth: base + 1,
					marker: {
						// lineWidth: base + 1,
						// radius: base + 1
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: true
			//tooltip: {
				//pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>'
				//valueDecimals: null,
				//xDateFormat: '%A, %b %e, %Y',
				//valuePrefix: '',
				//ySuffix: ''				
			//}
			// turboThreshold: 1000
			// zIndex: null
		}
	},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: ABSOLUTE,
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
		borderWidth: 1,
		borderColor: '#909090',
		borderRadius: 5,
		// margin: 10,
		// reversed: false,
		shadow: false,
		// backgroundColor: null,
		style: {
			padding: '5px'
		},
		itemStyle: {
			cursor: 'pointer',
			color: '#3E576F'
		},
		itemHoverStyle: {
			//cursor: 'pointer', removed as of #601
			color: '#000000'
		},
		itemHiddenStyle: {
			color: '#C0C0C0'
		},
		itemCheckboxStyle: {
			position: ABSOLUTE,
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
		symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		// width: undefined,
		x: 0,
		y: 0
	},

	loading: {
		// hideDuration: 100,
		labelStyle: {
			fontWeight: 'bold',
			position: RELATIVE,
			top: '1em'
		},
		// showDuration: 0,
		style: {
			position: ABSOLUTE,
			backgroundColor: 'white',
			opacity: 0.5,
			textAlign: 'center'
		}
	},

	tooltip: {
		enabled: true,
		//crosshairs: null,
		backgroundColor: 'rgba(255, 255, 255, .85)',
		borderWidth: 2,
		borderRadius: 5,
		//formatter: defaultFormatter,
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
		pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
		shadow: true,
		shared: useCanVG,
		snap: hasTouch ? 25 : 10,
		style: {
			color: '#333333',
			fontSize: '12px',
			padding: '5px',
			whiteSpace: 'nowrap'
		}
		//xDateFormat: '%A, %b %e, %Y',
		//valueDecimals: null,
		//valuePrefix: '',
		//valueSuffix: ''
	},

	credits: {
		enabled: true,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		position: {
			align: 'right',
			x: -10,
			verticalAlign: 'bottom',
			y: -5
		},
		style: {
			cursor: 'pointer',
			color: '#909090',
			fontSize: '10px'
		}
	}
};

// Axis defaults
/*jslint white: true*/
var defaultXAxisOptions = {
	// allowDecimals: null,
	// alternateGridColor: null,
	// categories: [],
	dateTimeLabelFormats: hash(
		MILLISECOND, '%H:%M:%S.%L',
		SECOND, '%H:%M:%S',
		MINUTE, '%H:%M',
		HOUR, '%H:%M',
		DAY, '%e. %b',
		WEEK, '%e. %b',
		MONTH, '%b \'%y',
		YEAR, '%Y'
	),
	endOnTick: false,
	gridLineColor: '#C0C0C0',
	// gridLineDashStyle: 'solid',
	// gridLineWidth: 0,
	// reversed: false,

	labels: defaultLabelOptions,
		// { step: null },
	lineColor: '#C0D0E0',
	lineWidth: 1,
	//linkedTo: null,
	max: null,
	min: null,
	minPadding: 0.01,
	maxPadding: 0.01,
	//minRange: null,
	minorGridLineColor: '#E0E0E0',
	// minorGridLineDashStyle: null,
	minorGridLineWidth: 1,
	minorTickColor: '#A0A0A0',
	//minorTickInterval: null,
	minorTickLength: 2,
	minorTickPosition: 'outside', // inside or outside
	//minorTickWidth: 0,
	//opposite: false,
	//offset: 0,
	//plotBands: [{
	//	events: {},
	//	zIndex: 1,
	//	labels: { align, x, verticalAlign, y, style, rotation, textAlign }
	//}],
	//plotLines: [{
	//	events: {}
	//  dashStyle: {}
	//	zIndex:
	//	labels: { align, x, verticalAlign, y, style, rotation, textAlign }
	//}],
	//reversed: false,
	// showFirstLabel: true,
	// showLastLabel: true,
	startOfWeek: 1,
	startOnTick: false,
	tickColor: '#C0D0E0',
	//tickInterval: null,
	tickLength: 5,
	tickmarkPlacement: 'between', // on or between
	tickPixelInterval: 100,
	tickPosition: 'outside',
	tickWidth: 1,
	title: {
		//text: null,
		align: 'middle', // low, middle or high
		//margin: 0 for horizontal, 10 for vertical axes,
		//rotation: 0,
		//side: 'outside',
		style: {
			color: '#6D869F',
			//font: defaultFont.replace('normal', 'bold')
			fontWeight: 'bold'
		}
		//x: 0,
		//y: 0
	},
	type: 'linear' // linear, logarithmic or datetime
},

defaultYAxisOptions = merge(defaultXAxisOptions, {
	endOnTick: true,
	gridLineWidth: 1,
	tickPixelInterval: 72,
	showLastLabel: true,
	labels: {
		align: 'right',
		x: -8,
		y: 3
	},
	lineWidth: 0,
	maxPadding: 0.05,
	minPadding: 0.05,
	startOnTick: true,
	tickWidth: 0,
	title: {
		rotation: 270,
		text: 'Y-values'
	},
	stackLabels: {
		enabled: false,
		//align: dynamic,
		//y: dynamic,
		//x: dynamic,
		//verticalAlign: dynamic,
		//textAlign: dynamic,
		//rotation: 0,
		formatter: function () {
			return this.total;
		},
		style: defaultLabelOptions.style
	}
}),

defaultLeftAxisOptions = {
	labels: {
		align: 'right',
		x: -8,
		y: null
	},
	title: {
		rotation: 270
	}
},
defaultRightAxisOptions = {
	labels: {
		align: 'left',
		x: 8,
		y: null
	},
	title: {
		rotation: 90
	}
},
defaultBottomAxisOptions = { // horizontal axis
	labels: {
		align: 'center',
		x: 0,
		y: 14,
		overflow: 'justify' // docs
		// staggerLines: null
	},
	title: {
		rotation: 0
	}
},
defaultTopAxisOptions = merge(defaultBottomAxisOptions, {
	labels: {
		y: -5,
		overflow: 'justify'
		// staggerLines: null
	}
});
/*jslint white: false*/



// Series defaults
var defaultPlotOptions = defaultOptions.plotOptions,
	defaultSeriesOptions = defaultPlotOptions.line;
//defaultPlotOptions.line = merge(defaultSeriesOptions);
defaultPlotOptions.spline = merge(defaultSeriesOptions);
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	lineWidth: 0,
	states: {
		hover: {
			lineWidth: 0
		}
	},
	tooltip: {
		headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
	}
});
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	threshold: 0
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: 0.75,
	// fillColor: null

});
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);
defaultPlotOptions.column = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	borderRadius: 0,
	//colorByPoint: undefined,
	groupPadding: 0.2,
	marker: null, // point options are specified in the base options
	pointPadding: 0.1,
	//pointWidth: null,
	minPointLength: 0,
	cropThreshold: 50, // when there are more points, they will not animate out of the chart on xAxis.setExtremes
	pointRange: null, // null means auto, meaning 1 in a categorized axis and least distance between points if not categories
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		},
		select: {
			color: '#C0C0C0',
			borderColor: '#000000',
			shadow: false
		}
	},
	dataLabels: {
		y: null,
		verticalAlign: null
	},
	threshold: 0
});
defaultPlotOptions.bar = merge(defaultPlotOptions.column, {
	dataLabels: {
		align: 'left',
		x: 5,
		y: null,
		verticalAlign: 'middle'
	}
});
defaultPlotOptions.pie = merge(defaultSeriesOptions, {
	//dragType: '', // n/a
	borderColor: '#FFFFFF',
	borderWidth: 1,
	center: ['50%', '50%'],
	colorByPoint: true, // always true for pies
	dataLabels: {
		// align: null,
		// connectorWidth: 1,
		// connectorColor: point.color,
		// connectorPadding: 5,
		distance: 30,
		enabled: true,
		formatter: function () {
			return this.point.name;
		},
		// softConnector: true,
		y: 5
	},
	//innerSize: 0,
	legendType: 'point',
	marker: null, // point options are specified in the base options
	size: '75%',
	showInLegend: false,
	slicedOffset: 10,
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		}
	}

});

// set the default time methods
setTimeMethods();



/**
 * Set the time methods globally based on the useUTC option. Time method can be either
 * local time or UTC (default).
 */
function setTimeMethods() {
	var useUTC = defaultOptions.global.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	makeTime = useUTC ? Date.UTC : function (year, month, date, hours, minutes, seconds) {
		return new Date(
			year,
			month,
			pick(date, 1),
			pick(hours, 0),
			pick(minutes, 0),
			pick(seconds, 0)
		).getTime();
	};
	getMinutes =  GET + 'Minutes';
	getHours =    GET + 'Hours';
	getDay =      GET + 'Day';
	getDate =     GET + 'Date';
	getMonth =    GET + 'Month';
	getFullYear = GET + 'FullYear';
	setMinutes =  SET + 'Minutes';
	setHours =    SET + 'Hours';
	setDate =     SET + 'Date';
	setMonth =    SET + 'Month';
	setFullYear = SET + 'FullYear';

}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
function setOptions(options) {
	
	// Pull out axis options and apply them to the respective default axis options 
	defaultXAxisOptions = merge(defaultXAxisOptions, options.xAxis);
	defaultYAxisOptions = merge(defaultYAxisOptions, options.yAxis);
	options.xAxis = options.yAxis = UNDEFINED;
	
	// Merge in the default options
	defaultOptions = merge(defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return defaultOptions;
}

/**
 * Get the updated default options. Merely exposing defaultOptions for outside modules
 * isn't enough because the setOptions method creates a new object.
 */
function getOptions() {
	return defaultOptions;
}



/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var Color = function (input) {
	// declare variables
	var rgba = [], result;

	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {

		// rgba
		result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(input);
		if (result) {
			rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
		} else { // hex
			result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(input);
			if (result) {
				rgba = [pInt(result[1], 16), pInt(result[2], 16), pInt(result[3], 16), 1];
			}
		}

	}
	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	function get(format) {
		var ret;

		// it's NaN if gradient colors on a column chart
		if (rgba && !isNaN(rgba[0])) {
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
		if (isNumber(alpha) && alpha !== 0) {
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
		setOpacity: setOpacity
	};
};


/**
 * A wrapper object for SVG elements
 */
function SVGElement() {}

SVGElement.prototype = {
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this;
		wrapper.element = nodeName === 'span' ?
			createElement(nodeName) :
			doc.createElementNS(SVG_NS, nodeName);
		wrapper.renderer = renderer;
		/**
		 * A collection of attribute setters. These methods, if defined, are called right before a certain
		 * attribute is set on an element wrapper. Returning false prevents the default attribute
		 * setter to run. Returning a value causes the default setter to set that value. Used in
		 * Renderer.label.
		 */
		wrapper.attrSetters = {};
	},
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 * @param {Function} complete Function to perform at the end of animation
	 */
	animate: function (params, options, complete) {
		var animOptions = pick(options, globalAnimation, true);
		stop(this); // stop regardless of animation actually running, or reverting to .attr (#607)
		if (animOptions) {
			animOptions = merge(animOptions);
			if (complete) { // allows using a callback with the global animation without overwriting it
				animOptions.complete = complete;
			}
			animate(this, params, animOptions);
		} else {
			this.attr(params);
			if (complete) {
				complete();
			}
		}
	},
	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function (hash, val) {
		var wrapper = this,
			key,
			value,
			result,
			i,
			child,
			element = wrapper.element,
			nodeName = element.nodeName,
			renderer = wrapper.renderer,
			skipAttr,
			attrSetters = wrapper.attrSetters,
			shadows = wrapper.shadows,
			hasSetSymbolSize,
			ret = wrapper;

		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter: first argument is a string, second is undefined
		if (isString(hash)) {
			key = hash;
			if (nodeName === 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			} else if (key === 'strokeWidth') {
				key = 'stroke-width';
			}
			ret = attr(element, key) || wrapper[key] || 0;

			if (key !== 'd' && key !== 'visibility') { // 'd' is string in animation step
				ret = parseFloat(ret);
			}

		// setter
		} else {

			for (key in hash) {
				skipAttr = false; // reset
				value = hash[key];

				// check for a specific attribute setter
				result = attrSetters[key] && attrSetters[key](value, key);

				if (result !== false) {

					if (result !== UNDEFINED) {
						value = result; // the attribute setter has returned a new value to set
					}

					// paths
					if (key === 'd') {
						if (value && value.join) { // join path
							value = value.join(' ');
						}
						if (/(NaN| {2}|^$)/.test(value)) {
							value = 'M 0 0';
						}
						wrapper.d = value; // shortcut for animations

					// update child tspans x values
					} else if (key === 'x' && nodeName === 'text') {
						for (i = 0; i < element.childNodes.length; i++) {
							child = element.childNodes[i];
							// if the x values are equal, the tspan represents a linebreak
							if (attr(child, 'x') === attr(element, 'x')) {
								//child.setAttribute('x', value);
								attr(child, 'x', value);
							}
						}

						if (wrapper.rotation) {
							attr(element, 'transform', 'rotate(' + wrapper.rotation + ' ' + value + ' ' +
								pInt(hash.y || attr(element, 'y')) + ')');
						}

					// apply gradients
					} else if (key === 'fill') {
						value = renderer.color(value, element, key);

					// circle x and y
					} else if (nodeName === 'circle' && (key === 'x' || key === 'y')) {
						key = { x: 'cx', y: 'cy' }[key] || key;

					// rectangle border radius
					} else if (nodeName === 'rect' && key === 'r') {
						attr(element, {
							rx: value,
							ry: value
						});
						skipAttr = true;

					// translation and text rotation
					} else if (key === 'translateX' || key === 'translateY' || key === 'rotation' || key === 'verticalAlign') {
						wrapper[key] = value;
						wrapper.updateTransform();
						skipAttr = true;

					// apply opacity as subnode (required by legacy WebKit and Batik)
					} else if (key === 'stroke') {
						value = renderer.color(value, element, key);

					// emulate VML's dashstyle implementation
					} else if (key === 'dashstyle') {
						key = 'stroke-dasharray';
						value = value && value.toLowerCase();
						if (value === 'solid') {
							value = NONE;
						} else if (value) {
							value = value
								.replace('shortdashdotdot', '3,1,1,1,1,1,')
								.replace('shortdashdot', '3,1,1,1')
								.replace('shortdot', '1,1,')
								.replace('shortdash', '3,1,')
								.replace('longdash', '8,3,')
								.replace(/dot/g, '1,3,')
								.replace('dash', '4,3,')
								.replace(/,$/, '')
								.split(','); // ending comma

							i = value.length;
							while (i--) {
								value[i] = pInt(value[i]) * hash['stroke-width'];
							}
							value = value.join(',');
						}

					// special
					} else if (key === 'isTracker') {
						wrapper[key] = value;

					// IE9/MooTools combo: MooTools returns objects instead of numbers and IE9 Beta 2
					// is unable to cast them. Test again with final IE9.
					} else if (key === 'width') {
						value = pInt(value);

					// Text alignment
					} else if (key === 'align') {
						key = 'text-anchor';
						value = { left: 'start', center: 'middle', right: 'end' }[value];

					// Title requires a subnode, #431
					} else if (key === 'title') {
						var title = doc.createElementNS(SVG_NS, 'title');
						title.appendChild(doc.createTextNode(value));
						element.appendChild(title);
					}

					// jQuery animate changes case
					if (key === 'strokeWidth') {
						key = 'stroke-width';
					}

					// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)
					if (isWebKit && key === 'stroke-width' && value === 0) {
						value = 0.000001;
					}

					// symbols
					if (wrapper.symbolName && /^(x|y|r|start|end|innerR|anchorX|anchorY)/.test(key)) {


						if (!hasSetSymbolSize) {
							wrapper.symbolAttr(hash);
							hasSetSymbolSize = true;
						}
						skipAttr = true;
					}

					// let the shadow follow the main element
					if (shadows && /^(width|height|visibility|x|y|d|transform)$/.test(key)) {
						i = shadows.length;
						while (i--) {
							attr(shadows[i], key, value);
						}
					}

					// validate heights
					if ((key === 'width' || key === 'height') && nodeName === 'rect' && value < 0) {
						value = 0;
					}




					if (key === 'text') {
						// only one node allowed
						wrapper.textStr = value;
						if (wrapper.added) {
							renderer.buildText(wrapper);
						}
					} else if (!skipAttr) {
						attr(element, key, value);
					}

				}

			}

		}
		
		// Workaround for our #732, WebKit's issue https://bugs.webkit.org/show_bug.cgi?id=78385
		// TODO: If the WebKit team fix this bug before the final release of Chrome 18, remove the workaround.
		if (isWebKit && /Chrome\/(18|19)/.test(userAgent)) {
			if (nodeName === 'text' && (hash.x !== UNDEFINED || hash.y !== UNDEFINED)) {
				var parent = element.parentNode,
					next = element.nextSibling;
			
				if (parent) {
					parent.removeChild(element);
					if (next) {
						parent.insertBefore(element, next);
					} else {
						parent.appendChild(element);
					}
				}
			}
		}
		// End of workaround for #732
		
		return ret;
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
			d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.width, wrapper.height, wrapper)
		});
	},

	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function (clipRect) {
		return this.attr('clip-path', 'url(' + this.renderer.url + '#' + clipRect.id + ')');
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
	crisp: function (strokeWidth, x, y, width, height) {

		var wrapper = this,
			key,
			attribs = {},
			values = {},
			normalizer;

		strokeWidth = strokeWidth || wrapper.strokeWidth || (wrapper.attr && wrapper.attr('stroke-width')) || 0;
		normalizer = mathRound(strokeWidth) % 2 / 2; // mathRound because strokeWidth can sometimes have roundoff errors

		// normalize for crisp edges
		values.x = mathFloor(x || wrapper.x || 0) + normalizer;
		values.y = mathFloor(y || wrapper.y || 0) + normalizer;
		values.width = mathFloor((width || wrapper.width || 0) - 2 * normalizer);
		values.height = mathFloor((height || wrapper.height || 0) - 2 * normalizer);
		values.strokeWidth = strokeWidth;

		for (key in values) {
			if (wrapper[key] !== values[key]) { // only set attribute if changed
				wrapper[key] = attribs[key] = values[key];
			}
		}

		return attribs;
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function (styles) {
		/*jslint unparam: true*//* allow unused param a in the regexp function below */
		var elemWrapper = this,
			elem = elemWrapper.element,
			textWidth = styles && styles.width && elem.nodeName === 'text',
			n,
			serializedCss = '',
			hyphenate = function (a, b) { return '-' + b.toLowerCase(); };
		/*jslint unparam: false*/

		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}

		// Merge the new styles with the old ones
		styles = extend(
			elemWrapper.styles,
			styles
		);

		// store object
		elemWrapper.styles = styles;

		// serialize and set style attribute
		if (isIE && !hasSVG) { // legacy IE doesn't support setting style attribute
			if (textWidth) {
				delete styles.width;
			}
			css(elemWrapper.element, styles);
		} else {
			for (n in styles) {
				serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + styles[n] + ';';
			}
			elemWrapper.attr({
				style: serializedCss
			});
		}


		// re-build text
		if (textWidth && elemWrapper.added) {
			elemWrapper.renderer.buildText(elemWrapper);
		}

		return elemWrapper;
	},

	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		var fn = handler;
		// touch
		if (hasTouch && eventType === 'click') {
			eventType = 'touchstart';
			fn = function (e) {
				e.preventDefault();
				handler();
			};
		}
		// simplest possible event model for internal use
		this.element['on' + eventType] = fn;
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
	 * Apply CSS to HTML elements. This is used in text within SVG rendering and
	 * by the VML renderer
	 */
	htmlCss: function (styles) {
		var wrapper = this,
			element = wrapper.element,
			textWidth = styles && element.tagName === 'SPAN' && styles.width;

		if (textWidth) {
			delete styles.width;
			wrapper.textWidth = textWidth;
			wrapper.updateTransform();
		}

		wrapper.styles = extend(wrapper.styles, styles);
		css(wrapper.element, styles);

		return wrapper;
	},



	/**
	 * VML and useHTML method for calculating the bounding box based on offsets
	 * @param {Boolean} refresh Whether to force a fresh value from the DOM or to
	 * use the cached value
	 *
	 * @return {Object} A hash containing values for x, y, width and height
	 */

	htmlGetBBox: function (refresh) {
		var wrapper = this,
			element = wrapper.element,
			bBox = wrapper.bBox;

		// faking getBBox in exported SVG in legacy IE
		if (!bBox || refresh) {
			// faking getBBox in exported SVG in legacy IE
			if (element.nodeName === 'text') {
				element.style.position = ABSOLUTE;
			}

			bBox = wrapper.bBox = {
				x: element.offsetLeft,
				y: element.offsetTop,
				width: element.offsetWidth,
				height: element.offsetHeight
			};
		}

		return bBox;
	},

	/**
	 * VML override private method to update elements based on internal
	 * properties based on SVG transform
	 */
	htmlUpdateTransform: function () {
		// aligning non added elements is expensive
		if (!this.added) {
			this.alignOnAdd = true;
			return;
		}

		var wrapper = this,
			renderer = wrapper.renderer,
			elem = wrapper.element,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			x = wrapper.x || 0,
			y = wrapper.y || 0,
			align = wrapper.textAlign || 'left',
			alignCorrection = { left: 0, center: 0.5, right: 1 }[align],
			nonLeft = align && align !== 'left',
			shadows = wrapper.shadows;

		// apply translate
		if (translateX || translateY) {
			css(elem, {
				marginLeft: translateX,
				marginTop: translateY
			});
			if (shadows) { // used in labels/tooltip
				each(shadows, function (shadow) {
					css(shadow, {
						marginLeft: translateX + 1,
						marginTop: translateY + 1
					});
				});
			}
		}

		// apply inversion
		if (wrapper.inverted) { // wrapper is a group
			each(elem.childNodes, function (child) {
				renderer.invertChild(child, elem);
			});
		}

		if (elem.tagName === 'SPAN') {

			var width, height,
				rotation = wrapper.rotation,
				baseline,
				radians = 0,
				costheta = 1,
				sintheta = 0,
				quad,
				textWidth = pInt(wrapper.textWidth),
				xCorr = wrapper.xCorr || 0,
				yCorr = wrapper.yCorr || 0,
				currentTextTransform = [rotation, align, elem.innerHTML, wrapper.textWidth].join(',');

			if (currentTextTransform !== wrapper.cTT) { // do the calculations and DOM access only if properties changed

				if (defined(rotation)) {
					radians = rotation * deg2rad; // deg to rad
					costheta = mathCos(radians);
					sintheta = mathSin(radians);

					// Adjust for alignment and rotation. Rotation of useHTML content is not yet implemented
					// but it can probably be implemented for Firefox 3.5+ on user request. FF3.5+
					// has support for CSS3 transform. The getBBox method also needs to be updated
					// to compensate for the rotation, like it currently does for SVG.
					// Test case: http://highcharts.com/tests/?file=text-rotation
					css(elem, {
						filter: rotation ? ['progid:DXImageTransform.Microsoft.Matrix(M11=', costheta,
							', M12=', -sintheta, ', M21=', sintheta, ', M22=', costheta,
							', sizingMethod=\'auto expand\')'].join('') : NONE
					});
				}

				width = pick(wrapper.elemWidth, elem.offsetWidth);
				height = pick(wrapper.elemHeight, elem.offsetHeight);

				// update textWidth
				if (width > textWidth) {
					css(elem, {
						width: textWidth + PX,
						display: 'block',
						whiteSpace: 'normal'
					});
					width = textWidth;
				}

				// correct x and y
				baseline = renderer.fontMetrics(elem.style.fontSize).b;
				xCorr = costheta < 0 && -width;
				yCorr = sintheta < 0 && -height;

				// correct for baseline and corners spilling out after rotation
				quad = costheta * sintheta < 0;
				xCorr += sintheta * baseline * (quad ? 1 - alignCorrection : alignCorrection);
				yCorr -= costheta * baseline * (rotation ? (quad ? alignCorrection : 1 - alignCorrection) : 1);

				// correct for the length/height of the text
				if (nonLeft) {
					xCorr -= width * alignCorrection * (costheta < 0 ? -1 : 1);
					if (rotation) {
						yCorr -= height * alignCorrection * (sintheta < 0 ? -1 : 1);
					}
					css(elem, {
						textAlign: align
					});
				}

				// record correction
				wrapper.xCorr = xCorr;
				wrapper.yCorr = yCorr;
			}

			// apply position with correction
			css(elem, {
				left: (x + xCorr) + PX,
				top: (y + yCorr) + PX
			});

			// record current text transform
			wrapper.cTT = currentTextTransform;
		}
	},

	/**
	 * Private method to update the transform attribute based on internal
	 * properties
	 */
	updateTransform: function () {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			inverted = wrapper.inverted,
			rotation = wrapper.rotation,
			transform = [];

		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}

		// apply translate
		if (translateX || translateY) {
			transform.push('translate(' + translateX + ',' + translateY + ')');
		}

		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push('rotate(' + rotation + ' ' + wrapper.x + ' ' + wrapper.y + ')');
		}

		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
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
	 * @param {Object} box The box to align to, needs a width and height
	 *
	 */
	align: function (alignOptions, alignByTranslate, box) {
		var elemWrapper = this;

		if (!alignOptions) { // called on resize
			alignOptions = elemWrapper.alignOptions;
			alignByTranslate = elemWrapper.alignByTranslate;
		} else { // first call on instanciate
			elemWrapper.alignOptions = alignOptions;
			elemWrapper.alignByTranslate = alignByTranslate;
			if (!box) { // boxes other than renderer handle this internally
				elemWrapper.renderer.alignedObjects.push(elemWrapper);
			}
		}

		box = pick(box, elemWrapper.renderer);

		var align = alignOptions.align,
			vAlign = alignOptions.verticalAlign,
			x = (box.x || 0) + (alignOptions.x || 0), // default: left align
			y = (box.y || 0) + (alignOptions.y || 0), // default: top align
			attribs = {};


		// align
		if (/^(right|center)$/.test(align)) {
			x += (box.width - (alignOptions.width || 0)) /
					{ right: 1, center: 2 }[align];
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = mathRound(x);


		// vertical align
		if (/^(bottom|middle)$/.test(vAlign)) {
			y += (box.height - (alignOptions.height || 0)) /
					({ bottom: 1, middle: 2 }[vAlign] || 1);

		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = mathRound(y);

		// animate only if already placed
		elemWrapper[elemWrapper.placed ? 'animate' : 'attr'](attribs);
		elemWrapper.placed = true;
		elemWrapper.alignAttr = attribs;

		return elemWrapper;
	},

	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function (refresh) {
		var wrapper = this,
			bBox,
			width,
			height,
			rotation = wrapper.rotation,
			element = wrapper.element,
			rad = rotation * deg2rad;

		// SVG elements
		if (element.namespaceURI === SVG_NS) {
			try { // Fails in Firefox if the container has display: none.
				
				bBox = element.getBBox ?
					// SVG: use extend because IE9 is not allowed to change width and height in case
					// of rotation (below)
					extend({}, element.getBBox()) :
					// Canvas renderer: // TODO: can this be removed now that we're checking for the SVG NS?
					{
						width: element.offsetWidth,
						height: element.offsetHeight
					};
			} catch (e) {}
			
			// If the bBox is not set, the try-catch block above failed. The other condition
			// is for Opera that returns a width of -Infinity on hidden elements.
			if (!bBox || bBox.width < 0) {
				bBox = { width: 0, height: 0 };
			}
			
			width = bBox.width;
			height = bBox.height;

			// adjust for rotated text
			if (rotation) {
				bBox.width = mathAbs(height * mathSin(rad)) + mathAbs(width * mathCos(rad));
				bBox.height = mathAbs(height * mathCos(rad)) + mathAbs(width * mathSin(rad));
			}

		// VML Renderer or useHTML within SVG
		} else {
			bBox = wrapper.htmlGetBBox(refresh);
		}

		return bBox;
	},

	/**
	 * Show the element
	 */
	show: function () {
		return this.attr({ visibility: VISIBLE });
	},

	/**
	 * Hide the element
	 */
	hide: function () {
		return this.attr({ visibility: HIDDEN });
	},

	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *    to append the element to the renderer.box.
	 */
	add: function (parent) {

		var renderer = this.renderer,
			parentWrapper = parent || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes = parentNode.childNodes,
			element = this.element,
			zIndex = attr(element, 'zIndex'),
			otherElement,
			otherZIndex,
			i,
			inserted;

		// mark as inverted
		this.parentInverted = parent && parent.inverted;

		// build formatted text
		if (this.textStr !== undefined) {
			renderer.buildText(this);
		}

		// mark the container as having z indexed children
		if (zIndex) {
			parentWrapper.handleZ = true;
			zIndex = pInt(zIndex);
		}

		// insert according to this and other elements' zIndex
		if (parentWrapper.handleZ) { // this element or any of its siblings has a z index
			for (i = 0; i < childNodes.length; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement !== element && (
						// insert before the first element with a higher zIndex
						pInt(otherZIndex) > zIndex ||
						// if no zIndex given, insert before the first element with a zIndex
						(!defined(zIndex) && defined(otherZIndex))

						)) {
					parentNode.insertBefore(element, otherElement);
					inserted = true;
					break;
				}
			}
		}

		// default: append at the end
		if (!inserted) {
			parentNode.appendChild(element);
		}

		// mark as added
		this.added = true;

		// fire an event for internal hooks
		fireEvent(this, 'add');

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
			box = wrapper.box,
			key,
			i;

		// remove events
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
		stop(wrapper); // stop running animations

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

		// destroy label box
		if (box) {
			box.destroy();
		}

		// remove from alignObjects
		erase(wrapper.renderer.alignedObjects, wrapper);

		for (key in wrapper) {
			delete wrapper[key];
		}

		return null;
	},

	/**
	 * Empty a group element
	 */
	empty: function () {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length;

		while (i--) {
			element.removeChild(childNodes[i]);
		}
	},

	/**
	 * Add a shadow to the element. Must be done after the element is added to the DOM
	 * @param {Boolean} apply
	 */
	shadow: function (apply, group) {
		var shadows = [],
			i,
			shadow,
			element = this.element,

			// compensate for inverted plot area
			transform = this.parentInverted ? '(-1,-1)' : '(1,1)';


		if (apply) {
			for (i = 1; i <= 3; i++) {
				shadow = element.cloneNode(0);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': 'rgb(0, 0, 0)',
					'stroke-opacity': 0.05 * i,
					'stroke-width': 7 - 2 * i,
					'transform': 'translate' + transform,
					'fill': NONE
				});

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

	}
};


/**
 * The default SVG renderer
 */
var SVGRenderer = function () {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	Element: SVGElement,

	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Boolean} forExport
	 */
	init: function (container, width, height, forExport) {
		var renderer = this,
			loc = location,
			boxWrapper;

		boxWrapper = renderer.createElement('svg')
			.attr({
				xmlns: SVG_NS,
				version: '1.1'
			});
		container.appendChild(boxWrapper.element);

		// object properties
		renderer.isSVG = true;
		renderer.box = boxWrapper.element;
		renderer.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];
		renderer.url = isIE ? '' : loc.href.replace(/#.*?$/, '')
			.replace(/([\('\)])/g, '\\$1'); // Page url used for internal references. #24, #672.
		renderer.defs = this.createElement('defs').add();
		renderer.forExport = forExport;
		renderer.gradients = {}; // Object where gradient SvgElements are stored

		renderer.setSize(width, height, false);
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
	 * Parse a simple HTML string into SVG tspans
	 *
	 * @param {Object} textNode The parent text SVG node
	 */
	buildText: function (wrapper) {
		var textNode = wrapper.element,
			lines = pick(wrapper.textStr, '').toString()
				.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
				.replace(/<(i|em)>/g, '<span style="font-style:italic">')
				.replace(/<a/g, '<span')
				.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
				.split(/<br.*?>/g),
			childNodes = textNode.childNodes,
			styleRegex = /style="([^"]+)"/,
			hrefRegex = /href="([^"]+)"/,
			parentX = attr(textNode, 'x'),
			textStyles = wrapper.styles,
			width = textStyles && pInt(textStyles.width),
			textLineHeight = textStyles && textStyles.lineHeight,
			lastLine,
			GET_COMPUTED_STYLE = 'getComputedStyle',
			i = childNodes.length;

		// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}

		if (width && !wrapper.added) {
			this.box.appendChild(textNode); // attach it to the DOM to read offset width
		}

		// remove empty line at end
		if (lines[lines.length - 1] === '') {
			lines.pop();
		}

		// build the lines
		each(lines, function (line, lineNo) {
			var spans, spanNo = 0, lineHeight;

			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');

			each(spans, function (span) {
				if (span !== '' || spans.length === 1) {
					var attributes = {},
						tspan = doc.createElementNS(SVG_NS, 'tspan');
					if (styleRegex.test(span)) {
						attr(
							tspan,
							'style',
							span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2')
						);
					}
					if (hrefRegex.test(span)) {
						attr(tspan, 'onclick', 'location.href=\"' + span.match(hrefRegex)[1] + '\"');
						css(tspan, { cursor: 'pointer' });
					}

					span = (span.replace(/<(.|\n)*?>/g, '') || ' ')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>');

					// issue #38 workaround.
					/*if (reverse) {
						arr = [];
						i = span.length;
						while (i--) {
							arr.push(span.charAt(i));
						}
						span = arr.join('');
					}*/

					// add the text node
					tspan.appendChild(doc.createTextNode(span));

					if (!spanNo) { // first span in a line, align it to the left
						attributes.x = parentX;
					} else {
						// Firefox ignores spaces at the front or end of the tspan
						attributes.dx = 3; // space
					}

					// first span on subsequent line, add the line height
					if (!spanNo) {
						if (lineNo) {

							// allow getting the right offset height in exporting in IE
							if (!hasSVG && wrapper.renderer.forExport) {
								css(tspan, { display: 'block' });
							}

							// Webkit and opera sometimes return 'normal' as the line height. In that
							// case, webkit uses offsetHeight, while Opera falls back to 18
							lineHeight = win[GET_COMPUTED_STYLE] &&
								pInt(win[GET_COMPUTED_STYLE](lastLine, null).getPropertyValue('line-height'));

							if (!lineHeight || isNaN(lineHeight)) {
								lineHeight = textLineHeight || lastLine.offsetHeight || 18;
							}
							attr(tspan, 'dy', lineHeight);
						}
						lastLine = tspan; // record for use in next line
					}

					// add attributes
					attr(tspan, attributes);

					// append it
					textNode.appendChild(tspan);

					spanNo++;

					// check width and apply soft breaks
					if (width) {
						var words = span.replace(/-/g, '- ').split(' '),
							tooLong,
							actualWidth,
							rest = [];

						while (words.length || rest.length) {
							actualWidth = wrapper.getBBox().width;
							tooLong = actualWidth > width;
							if (!tooLong || words.length === 1) { // new line needed
								words = rest;
								rest = [];
								if (words.length) {
									tspan = doc.createElementNS(SVG_NS, 'tspan');
									attr(tspan, {
										dy: textLineHeight || 16,
										x: parentX
									});
									textNode.appendChild(tspan);

									if (actualWidth > width) { // a single word is pressing it out
										width = actualWidth;
									}
								}
							} else { // append to existing line tspan
								tspan.removeChild(tspan.firstChild);
								rest.unshift(words.pop());
							}
							if (words.length) {
								tspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
							}
						}
					}
				}
			});
		});
	},

	/**
	 * Create a button with preset states
	 * @param {String} text
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Function} callback
	 * @param {Object} normalState
	 * @param {Object} hoverState
	 * @param {Object} pressedState
	 */
	button: function (text, x, y, callback, normalState, hoverState, pressedState) {
		var label = this.label(text, x, y),
			curState = 0,
			stateOptions,
			stateStyle,
			normalStyle,
			hoverStyle,
			pressedStyle,
			STYLE = 'style',
			verticalGradient = { x1: 0, y1: 0, x2: 0, y2: 1 };

		// prepare the attributes
		/*jslint white: true*/
		normalState = merge(hash(
			STROKE_WIDTH, 1,
			STROKE, '#999',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#FFF'],
					[1, '#DDD']
				]
			),
			'r', 3,
			'padding', 3,
			STYLE, hash(
				'color', 'black'
			)
		), normalState);
		/*jslint white: false*/
		normalStyle = normalState[STYLE];
		delete normalState[STYLE];

		/*jslint white: true*/
		hoverState = merge(normalState, hash(
			STROKE, '#68A',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#FFF'],
					[1, '#ACF']
				]
			)
		), hoverState);
		/*jslint white: false*/
		hoverStyle = hoverState[STYLE];
		delete hoverState[STYLE];

		/*jslint white: true*/
		pressedState = merge(normalState, hash(
			STROKE, '#68A',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#9BD'],
					[1, '#CDF']
				]
			)
		), pressedState);
		/*jslint white: false*/
		pressedStyle = pressedState[STYLE];
		delete pressedState[STYLE];

		// add the events
		addEvent(label.element, 'mouseenter', function () {
			label.attr(hoverState)
				.css(hoverStyle);
		});
		addEvent(label.element, 'mouseleave', function () {
			stateOptions = [normalState, hoverState, pressedState][curState];
			stateStyle = [normalStyle, hoverStyle, pressedStyle][curState];
			label.attr(stateOptions)
				.css(stateStyle);
		});

		label.setState = function (state) {
			curState = state;
			if (!state) {
				label.attr(normalState)
					.css(normalStyle);
			} else if (state === 2) {
				label.attr(pressedState)
					.css(pressedStyle);
			}
		};

		return label
			.on('click', function () {
				callback.call(label);
			})
			.attr(normalState)
			.css(extend({ cursor: 'default' }, normalStyle));
	},

	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width
	 */
	crispLine: function (points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] === points[4]) {
			points[1] = points[4] = mathRound(points[1]) + (width % 2 / 2);
		}
		if (points[2] === points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},


	/**
	 * Draw a path
	 * @param {Array} path An SVG path in array form
	 */
	path: function (path) {
		return this.createElement('path').attr({
			d: path,
			fill: NONE
		});
	},

	/**
	 * Draw and return an SVG circle
	 * @param {Number} x The x position
	 * @param {Number} y The y position
	 * @param {Number} r The radius
	 */
	circle: function (x, y, r) {
		var attr = isObject(x) ?
			x :
			{
				x: x,
				y: y,
				r: r
			};

		return this.createElement('circle').attr(attr);
	},

	/**
	 * Draw and return an arc
	 * @param {Number} x X position
	 * @param {Number} y Y position
	 * @param {Number} r Radius
	 * @param {Number} innerR Inner radius like used in donut charts
	 * @param {Number} start Starting angle
	 * @param {Number} end Ending angle
	 */
	arc: function (x, y, r, innerR, start, end) {
		// arcs are defined as symbols for the ability to set
		// attributes in attr and animate

		if (isObject(x)) {
			y = x.y;
			r = x.r;
			innerR = x.innerR;
			start = x.start;
			end = x.end;
			x = x.x;
		}
		return this.symbol('arc', x || 0, y || 0, r || 0, r || 0, {
			innerR: innerR || 0,
			start: start || 0,
			end: end || 0
		});
	},

	/**
	 * Draw and return a rectangle
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} r Border corner radius
	 * @param {Number} strokeWidth A stroke width can be supplied to allow crisp drawing
	 */
	rect: function (x, y, width, height, r, strokeWidth) {
		if (isObject(x)) {
			y = x.y;
			width = x.width;
			height = x.height;
			r = x.r;
			strokeWidth = x.strokeWidth;
			x = x.x;
		}
		var wrapper = this.createElement('rect').attr({
			rx: r,
			ry: r,
			fill: NONE
		});

		return wrapper.attr(wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0)));
	},

	/**
	 * Resize the box and re-align all aligned elements
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Boolean} animate
	 *
	 */
	setSize: function (width, height, animate) {
		var renderer = this,
			alignedObjects = renderer.alignedObjects,
			i = alignedObjects.length;

		renderer.width = width;
		renderer.height = height;

		renderer.boxWrapper[pick(animate, true) ? 'animate' : 'attr']({
			width: width,
			height: height
		});

		while (i--) {
			alignedObjects[i].align();
		}
	},

	/**
	 * Create a group
	 * @param {String} name The group will be given a class name of 'highcharts-{name}'.
	 *     This can be used for styling and scripting.
	 */
	g: function (name) {
		var elem = this.createElement('g');
		return defined(name) ? elem.attr({ 'class': PREFIX + name }) : elem;
	},

	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var attribs = {
				preserveAspectRatio: NONE
			},
			elemWrapper;

		// optional properties
		if (arguments.length > 1) {
			extend(attribs, {
				x: x,
				y: y,
				width: width,
				height: height
			});
		}

		elemWrapper = this.createElement('image').attr(attribs);

		// set the href in the xlink namespace
		if (elemWrapper.element.setAttributeNS) {
			elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink',
				'href', src);
		} else {
			// could be exporting in IE
			// using href throws "not supported" in ie7 and under, requries regex shim to fix later
			elemWrapper.element.setAttribute('hc-svg-href', src);
	}

		return elemWrapper;
	},

	/**
	 * Draw a symbol out of pre-defined shape paths from the namespace 'symbol' object.
	 *
	 * @param {Object} symbol
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} radius
	 * @param {Object} options
	 */
	symbol: function (symbol, x, y, width, height, options) {

		var obj,

			// get the symbol definition function
			symbolFn = this.symbols[symbol],

			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				mathRound(x),
				mathRound(y),
				width,
				height,
				options
			),

			imageRegex = /^url\((.*?)\)$/,
			imageSrc,
			imageSize;

		if (path) {

			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				width: width,
				height: height
			});
			if (options) {
				extend(obj, options);
			}


		// image symbols
		} else if (imageRegex.test(symbol)) {

			var centerImage = function (img, size) {
				img.attr({
					width: size[0],
					height: size[1]
				}).translate(
					-mathRound(size[0] / 2),
					-mathRound(size[1] / 2)
				);
			};

			imageSrc = symbol.match(imageRegex)[1];
			imageSize = symbolSizes[imageSrc];

			// create the image synchronously, add attribs async
			obj = this.image(imageSrc)
				.attr({
					x: x,
					y: y
				});

			if (imageSize) {
				centerImage(obj, imageSize);
			} else {
				// initialize image to be 0 size so export will still function if there's no cached sizes
				obj.attr({ width: 0, height: 0 });

				// create a dummy JavaScript image to get the width and height
				createElement('img', {
					onload: function () {
						var img = this;

						centerImage(obj, symbolSizes[imageSrc] = [img.width, img.height]);
					},
					src: imageSrc
				});
			}
		}

		return obj;
	},

	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'circle': function (x, y, w, h) {
			var cpw = 0.166 * w;
			return [
				M, x + w / 2, y,
				'C', x + w + cpw, y, x + w + cpw, y + h, x + w / 2, y + h,
				'C', x - cpw, y + h, x - cpw, y, x + w / 2, y,
				'Z'
			];
		},

		'square': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle-down': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w / 2, y + h,
				'Z'
			];
		},
		'diamond': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h / 2,
				x + w / 2, y + h,
				x, y + h / 2,
				'Z'
			];
		},
		'arc': function (x, y, w, h, options) {
			var start = options.start,
				radius = options.r || w || h,
				end = options.end - 0.000001, // to prevent cos and sin of start and end from becoming equal on 360 arcs
				innerRadius = options.innerR,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				longArc = options.end - start < mathPI ? 0 : 1;

			return [
				M,
				x + radius * cosStart,
				y + radius * sinStart,
				'A', // arcTo
				radius, // x radius
				radius, // y radius
				0, // slanting
				longArc, // long or short arc
				1, // clockwise
				x + radius * cosEnd,
				y + radius * sinEnd,
				L,
				x + innerRadius * cosEnd,
				y + innerRadius * sinEnd,
				'A', // arcTo
				innerRadius, // x radius
				innerRadius, // y radius
				0, // slanting
				longArc, // long or short arc
				0, // clockwise
				x + innerRadius * cosStart,
				y + innerRadius * sinStart,

				'Z' // close
			];
		}
	},

	/**
	 * Define a clipping rectangle
	 * @param {String} id
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {
		var wrapper,
			id = PREFIX + idCounter++,

			clipPath = this.createElement('clipPath').attr({
				id: id
			}).add(this.defs);

		wrapper = this.rect(x, y, width, height, 0).add(clipPath);
		wrapper.id = id;
		wrapper.clipPath = clipPath;

		return wrapper;
	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object. Prior to Highstock, an array was used to define
	 * a linear gradient with pixel positions relative to the SVG. In newer versions
	 * we change the coordinates to apply relative to the shape, using coordinates
	 * 0-1 within the shape. To preserve backwards compatibility, linearGradient
	 * in this definition is an object of x1, y1, x2 and y2.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/;
		if (color && color.linearGradient) {
			var renderer = this,
				linearGradient = color[LINEAR_GRADIENT],
				relativeToShape = !isArray(linearGradient), // keep backwards compatibility
				id,
				gradients = renderer.gradients,
				gradientObject,
				x1 = linearGradient.x1 || linearGradient[0] || 0,
				y1 = linearGradient.y1 || linearGradient[1] || 0,
				x2 = linearGradient.x2 || linearGradient[2] || 0,
				y2 = linearGradient.y2 || linearGradient[3] || 0,
				stopColor,
				stopOpacity,
				// Create a unique key in order to reuse gradient objects. #671.
				key = [relativeToShape, x1, y1, x2, y2, color.stops.join(',')].join(',');

			// If the gradient with the same setup is already created, reuse it
			if (gradients[key]) {
				id = attr(gradients[key].element, 'id');

			// If not, create a new one and keep the reference.
			} else {
				id = PREFIX + idCounter++;
				gradientObject = renderer.createElement(LINEAR_GRADIENT)
					.attr(extend({
						id: id,
						x1: x1,
						y1: y1,
						x2: x2,
						y2: y2
					}, relativeToShape ? null : { gradientUnits: 'userSpaceOnUse' }))
					.add(renderer.defs);

				// The gradient needs to keep a list of stops to be able to destroy them
				gradientObject.stops = [];
				each(color.stops, function (stop) {
					var stopObject;
					if (regexRgba.test(stop[1])) {
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

				// Keep a reference to the gradient object so it is possible to reuse it and
				// destroy it later
				gradients[key] = gradientObject;
			}

			return 'url(' + this.url + '#' + id + ')';

		// Webkit and Batik can't show rgba.
		} else if (regexRgba.test(color)) {
			colorObject = Color(color);
			attr(elem, prop + '-opacity', colorObject.get('a'));

			return colorObject.get('rgb');


		} else {
			// Remove the opacity attribute added above. Does not throw if the attribute is not there.
			elem.removeAttribute(prop + '-opacity');

			return color;
		}

	},


	/**
	 * Add text to the SVG object
	 * @param {String} str
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Boolean} useHTML Use HTML to render the text
	 */
	text: function (str, x, y, useHTML) {

		// declare variables
		var renderer = this,
			defaultChartStyle = defaultOptions.chart.style,
			wrapper;

		if (useHTML && !renderer.forExport) {
			return renderer.html(str, x, y);
		}

		x = mathRound(pick(x, 0));
		y = mathRound(pick(y, 0));

		wrapper = renderer.createElement('text')
			.attr({
				x: x,
				y: y,
				text: str
			})
			.css({
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});

		wrapper.x = x;
		wrapper.y = y;
		return wrapper;
	},


	/**
	 * Create HTML text node. This is used by the VML renderer as well as the SVG
	 * renderer through the useHTML option.
	 *
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	html: function (str, x, y) {
		var defaultChartStyle = defaultOptions.chart.style,
			wrapper = this.createElement('span'),
			attrSetters = wrapper.attrSetters,
			element = wrapper.element,
			renderer = wrapper.renderer;

		// Text setter
		attrSetters.text = function (value) {
			element.innerHTML = value;
			return false;
		};

		// Various setters which rely on update transform
		attrSetters.x = attrSetters.y = attrSetters.align = function (value, key) {
			if (key === 'align') {
				key = 'textAlign'; // Do not overwrite the SVGElement.align method. Same as VML.
			}
			wrapper[key] = value;
			wrapper.htmlUpdateTransform();
			return false;
		};

		// Set the default attributes
		wrapper.attr({
				text: str,
				x: mathRound(x),
				y: mathRound(y)
			})
			.css({
				position: ABSOLUTE,
				whiteSpace: 'nowrap',
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});

		// Use the HTML specific .css method
		wrapper.css = wrapper.htmlCss;

		// This is specific for HTML within SVG
		if (renderer.isSVG) {
			wrapper.add = function (svgGroupWrapper) {

				var htmlGroup,
					htmlGroupStyle,
					container = renderer.box.parentNode;

				// Create a mock group to hold the HTML elements
				if (svgGroupWrapper) {
					htmlGroup = svgGroupWrapper.div;
					if (!htmlGroup) {
						htmlGroup = svgGroupWrapper.div = createElement(DIV, {
							className: attr(svgGroupWrapper.element, 'class')
						}, {
							position: ABSOLUTE,
							left: svgGroupWrapper.attr('translateX') + PX,
							top: svgGroupWrapper.attr('translateY') + PX
						}, container);

						// Ensure dynamic updating position
						htmlGroupStyle = htmlGroup.style;
						extend(svgGroupWrapper.attrSetters, {
							translateX: function (value) {
								htmlGroupStyle.left = value + PX;
							},
							translateY: function (value) {
								htmlGroupStyle.top = value + PX;
							},
							visibility: function (value, key) {
								htmlGroupStyle[key] = value;
							}
						});

					}
				} else {
					htmlGroup = container;
				}

				htmlGroup.appendChild(element);

				// Shared with VML:
				wrapper.added = true;
				if (wrapper.alignOnAdd) {
					wrapper.htmlUpdateTransform();
				}

				return wrapper;
			};
		}
		return wrapper;
	},

	/**
	 * Utility to return the baseline offset and total line height from the font size
	 */
	fontMetrics: function (fontSize) {
		fontSize = pInt(fontSize || 11);
		
		// Empirical values found by comparing font size and bounding box height.
		// Applies to the default font family. http://jsfiddle.net/highcharts/7xvn7/
		var lineHeight = fontSize < 24 ? fontSize + 4 : mathRound(fontSize * 1.2),
			baseline = mathRound(lineHeight * 0.8);
		
		return {
			h: lineHeight, 
			b: baseline
		};
	},

	/**
	 * Add a label, a text item that can hold a colored or gradient background
	 * as well as a border and shadow.
	 * @param {string} str
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} shape
	 * @param {Number} anchorX In case the shape has a pointer, like a flag, this is the
	 *    coordinates it should be pinned to
	 * @param {Number} anchorY
	 * @param {Boolean} baseline Whether to position the label relative to the text baseline,
	 *    like renderer.text, or to the upper border of the rectangle. 
	 */
	label: function (str, x, y, shape, anchorX, anchorY, useHTML, baseline) {

		var renderer = this,
			wrapper = renderer.g(),
			text = renderer.text('', 0, 0, useHTML)
				.attr({
					zIndex: 1
				})
				.add(wrapper),
			box,
			bBox,
			align = 'left',
			padding = 3,
			width,
			height,
			wrapperX,
			wrapperY,
			crispAdjust = 0,
			deferredAttr = {},
			baselineOffset,
			attrSetters = wrapper.attrSetters;

		/**
		 * This function runs after the label is added to the DOM (when the bounding box is
		 * available), and after the text of the label is updated to detect the new bounding
		 * box and reflect it in the border box.
		 */
		function updateBoxSize() {
			var boxY,
				style = text.element.style;
				
			bBox = (width === undefined || height === undefined || wrapper.styles.textAlign) &&
				text.getBBox(true);
			wrapper.width = (width || bBox.width) + 2 * padding;
			wrapper.height = (height || bBox.height) + 2 * padding;
			
			// update the label-scoped y offset
			baselineOffset = padding + renderer.fontMetrics(style && style.fontSize).b;
			
			
			// create the border box if it is not already present
			if (!box) {
				boxY = baseline ? -baselineOffset : 0;
			
				wrapper.box = box = shape ?
					renderer.symbol(shape, 0, boxY, wrapper.width, wrapper.height) :
					renderer.rect(0, boxY, wrapper.width, wrapper.height, 0, deferredAttr[STROKE_WIDTH]);
				box.add(wrapper);
			}

			// apply the box attributes
			box.attr(merge({
				width: wrapper.width,
				height: wrapper.height
			}, deferredAttr));
			deferredAttr = null;
		}

		/**
		 * This function runs after setting text or padding, but only if padding is changed
		 */
		function updateTextPadding() {
			var styles = wrapper.styles,
				textAlign = styles && styles.textAlign,
				x = padding,
				y;
			
			// determin y based on the baseline
			y = baseline ? 0 : baselineOffset;

			// compensate for alignment
			if (defined(width) && (textAlign === 'center' || textAlign === 'right')) {
				x += { center: 0.5, right: 1 }[textAlign] * (width - bBox.width);
			}

			// update if anything changed
			if (x !== text.x || y !== text.y) {
				text.attr({
					x: x,
					y: y
				});
			}

			// record current values
			text.x = x;
			text.y = y;
		}

		/**
		 * Set a box attribute, or defer it if the box is not yet created
		 * @param {Object} key
		 * @param {Object} value
		 */
		function boxAttr(key, value) {
			if (box) {
				box.attr(key, value);
			} else {
				deferredAttr[key] = value;
			}
		}

		function getSizeAfterAdd() {
			wrapper.attr({
				text: str, // alignment is available now
				x: x,
				y: y,
				anchorX: anchorX,
				anchorY: anchorY
			});
		}

		/**
		 * After the text element is added, get the desired size of the border box
		 * and add it before the text in the DOM.
		 */
		addEvent(wrapper, 'add', getSizeAfterAdd);

		/*
		 * Add specific attribute setters.
		 */

		// only change local variables
		attrSetters.width = function (value) {
			width = value;
			return false;
		};
		attrSetters.height = function (value) {
			height = value;
			return false;
		};
		attrSetters.padding = function (value) {
			if (defined(value) && value !== padding) {
				padding = value;
				updateTextPadding();
			}

			return false;
		};

		// change local variable and set attribue as well
		attrSetters.align = function (value) {
			align = value;
			return false; // prevent setting text-anchor on the group
		};
		
		// apply these to the box and the text alike
		attrSetters.text = function (value, key) {
			text.attr(key, value);
			updateBoxSize();
			updateTextPadding();
			return false;
		};

		// apply these to the box but not to the text
		attrSetters[STROKE_WIDTH] = function (value, key) {
			crispAdjust = value % 2 / 2;
			boxAttr(key, value);
			return false;
		};
		attrSetters.stroke = attrSetters.fill = attrSetters.r = function (value, key) {
			boxAttr(key, value);
			return false;
		};
		attrSetters.anchorX = function (value, key) {
			anchorX = value;
			boxAttr(key, value + crispAdjust - wrapperX);
			return false;
		};
		attrSetters.anchorY = function (value, key) {
			anchorY = value;
			boxAttr(key, value - wrapperY);
			return false;
		};
		
		// rename attributes
		attrSetters.x = function (value) {
			value -= { left: 0, center: 0.5, right: 1 }[align] * ((width || bBox.width) + padding);
			wrapperX = wrapper.x = mathRound(value); // wrapper.x is for animation getter
			
			wrapper.attr('translateX', wrapperX);
			return false;
		};
		attrSetters.y = function (value) {
			wrapperY = wrapper.y = mathRound(value);
			wrapper.attr('translateY', value);
			return false;
		};

		// Redirect certain methods to either the box or the text
		var baseCss = wrapper.css;
		return extend(wrapper, {
			/**
			 * Pick up some properties and apply them to the text instead of the wrapper
			 */
			css: function (styles) {
				if (styles) {
					var textStyles = {};
					styles = merge({}, styles); // create a copy to avoid altering the original object (#537)
					each(['fontSize', 'fontWeight', 'fontFamily', 'color', 'lineHeight', 'width'], function (prop) {
						if (styles[prop] !== UNDEFINED) {
							textStyles[prop] = styles[prop];
							delete styles[prop];
						}
					});
					text.css(textStyles);
				}
				return baseCss.call(wrapper, styles);
			},
			/**
			 * Return the bounding box of the box, not the group
			 */
			getBBox: function () {
				return box.getBBox();
			},
			/**
			 * Apply the shadow to the box
			 */
			shadow: function (b) {
				box.shadow(b);
				return wrapper;
			},
			/**
			 * Destroy and release memory.
			 */
			destroy: function () {
				removeEvent(wrapper, 'add', getSizeAfterAdd);

				// Added by button implementation
				removeEvent(wrapper.element, 'mouseenter');
				removeEvent(wrapper.element, 'mouseleave');

				if (text) {
					// Destroy the text element
					text = text.destroy();
				}
				// Call base implementation to destroy the rest
				SVGElement.prototype.destroy.call(wrapper);
			}
		});
	}
}; // end SVGRenderer


// general renderer
Renderer = SVGRenderer;


/* ****************************************************************************
 *                                                                            *
 * START OF INTERNET EXPLORER <= 8 SPECIFIC CODE                              *
 *                                                                            *
 * For applications and websites that don't need IE support, like platform    *
 * targeted mobile apps and web apps, this code can be removed.               *
 *                                                                            *
 *****************************************************************************/

/**
 * @constructor
 */
var VMLRenderer;
if (!hasSVG && !useCanVG) {

/**
 * The VML element wrapper.
 */
var VMLElement = {

	/**
	 * Initialize a new VML element wrapper. It builds the markup as a string
	 * to minimize DOM traffic.
	 * @param {Object} renderer
	 * @param {Object} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this,
			markup =  ['<', nodeName, ' filled="f" stroked="f"'],
			style = ['position: ', ABSOLUTE, ';'];

		// divs and shapes need size
		if (nodeName === 'shape' || nodeName === DIV) {
			style.push('left:0;top:0;width:10px;height:10px;');
		}
		if (docMode8) {
			style.push('visibility: ', nodeName === DIV ? HIDDEN : VISIBLE);
		}

		markup.push(' style="', style.join(''), '"/>');

		// create element with default attributes and style
		if (nodeName) {
			markup = nodeName === DIV || nodeName === 'span' || nodeName === 'img' ?
				markup.join('')
				: renderer.prepVML(markup);
			wrapper.element = createElement(markup);
		}

		wrapper.renderer = renderer;
		wrapper.attrSetters = {};
	},

	/**
	 * Add the node to the given parent
	 * @param {Object} parent
	 */
	add: function (parent) {
		var wrapper = this,
			renderer = wrapper.renderer,
			element = wrapper.element,
			box = renderer.box,
			inverted = parent && parent.inverted,

			// get the parent node
			parentNode = parent ?
				parent.element || parent :
				box;


		// if the parent group is inverted, apply inversion on all children
		if (inverted) { // only on groups
			renderer.invertChild(element, parentNode);
		}

		// issue #140 workaround - related to #61 and #74
		if (docMode8 && parentNode.gVis === HIDDEN) {
			css(element, { visibility: HIDDEN });
		}

		// append it
		parentNode.appendChild(element);

		// align text after adding to be able to read offset
		wrapper.added = true;
		if (wrapper.alignOnAdd && !wrapper.deferUpdateTransform) {
			wrapper.updateTransform();
		}

		// fire an event for internal hooks
		fireEvent(wrapper, 'add');

		return wrapper;
	},

	/**
	 * In IE8 documentMode 8, we need to recursively set the visibility down in the DOM
	 * tree for nested groups. Related to #61, #586.
	 */
	toggleChildren: function (element, visibility) {
		var childNodes = element.childNodes,
			i = childNodes.length;
			
		while (i--) {
			
			// apply the visibility
			css(childNodes[i], { visibility: visibility });
			
			// we have a nested group, apply it to its children again
			if (childNodes[i].nodeName === 'DIV') {
				this.toggleChildren(childNodes[i], visibility);
			}
		}
	},

	/**
	 * VML always uses htmlUpdateTransform
	 */
	updateTransform: SVGElement.prototype.htmlUpdateTransform,

	/**
	 * Get or set attributes
	 */
	attr: function (hash, val) {
		var wrapper = this,
			key,
			value,
			i,
			result,
			element = wrapper.element || {},
			elemStyle = element.style,
			nodeName = element.nodeName,
			renderer = wrapper.renderer,
			symbolName = wrapper.symbolName,
			hasSetSymbolSize,
			shadows = wrapper.shadows,
			skipAttr,
			attrSetters = wrapper.attrSetters,
			ret = wrapper;

		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter, val is undefined
		if (isString(hash)) {
			key = hash;
			if (key === 'strokeWidth' || key === 'stroke-width') {
				ret = wrapper.strokeweight;
			} else {
				ret = wrapper[key];
			}

		// setter
		} else {
			for (key in hash) {
				value = hash[key];
				skipAttr = false;

				// check for a specific attribute setter
				result = attrSetters[key] && attrSetters[key](value, key);

				if (result !== false && value !== null) { // #620

					if (result !== UNDEFINED) {
						value = result; // the attribute setter has returned a new value to set
					}


					// prepare paths
					// symbols
					if (symbolName && /^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(key)) {
						// if one of the symbol size affecting parameters are changed,
						// check all the others only once for each call to an element's
						// .attr() method
						if (!hasSetSymbolSize) {
							wrapper.symbolAttr(hash);

							hasSetSymbolSize = true;
						}
						skipAttr = true;

					} else if (key === 'd') {
						value = value || [];
						wrapper.d = value.join(' '); // used in getter for animation

						// convert paths
						i = value.length;
						var convertedPath = [];
						while (i--) {

							// Multiply by 10 to allow subpixel precision.
							// Substracting half a pixel seems to make the coordinates
							// align with SVG, but this hasn't been tested thoroughly
							if (isNumber(value[i])) {
								convertedPath[i] = mathRound(value[i] * 10) - 5;
							} else if (value[i] === 'Z') { // close the path
								convertedPath[i] = 'x';
							} else {
								convertedPath[i] = value[i];
							}

						}
						value = convertedPath.join(' ') || 'x';
						element.path = value;

						// update shadows
						if (shadows) {
							i = shadows.length;
							while (i--) {
								shadows[i].path = value;
							}
						}
						skipAttr = true;

					// directly mapped to css
					} else if (key === 'zIndex' || key === 'visibility') {

						// workaround for #61 and #586
						if (docMode8 && key === 'visibility' && nodeName === 'DIV') {
							element.gVis = value;
							wrapper.toggleChildren(element, value);
							if (value === VISIBLE) { // #74
								value = null;
							}
						}

						if (value) {
							elemStyle[key] = value;
						}



						skipAttr = true;

					// width and height
					} else if (key === 'width' || key === 'height') {
						
						value = mathMax(0, value); // don't set width or height below zero (#311)
						
						this[key] = value; // used in getter

						// clipping rectangle special
						if (wrapper.updateClipping) {
							wrapper[key] = value;
							wrapper.updateClipping();
						} else {
							// normal
							elemStyle[key] = value;
						}

						skipAttr = true;

					// x and y
					} else if (key === 'x' || key === 'y') {

						wrapper[key] = value; // used in getter
						elemStyle[{ x: 'left', y: 'top' }[key]] = value;

					// class name
					} else if (key === 'class') {
						// IE8 Standards mode has problems retrieving the className
						element.className = value;

					// stroke
					} else if (key === 'stroke') {

						value = renderer.color(value, element, key);

						key = 'strokecolor';

					// stroke width
					} else if (key === 'stroke-width' || key === 'strokeWidth') {
						element.stroked = value ? true : false;
						key = 'strokeweight';
						wrapper[key] = value; // used in getter, issue #113
						if (isNumber(value)) {
							value += PX;
						}

					// dashStyle
					} else if (key === 'dashstyle') {
						var strokeElem = element.getElementsByTagName('stroke')[0] ||
							createElement(renderer.prepVML(['<stroke/>']), null, null, element);
						strokeElem[key] = value || 'solid';
						wrapper.dashstyle = value; /* because changing stroke-width will change the dash length
							and cause an epileptic effect */
						skipAttr = true;

					// fill
					} else if (key === 'fill') {

						if (nodeName === 'SPAN') { // text color
							elemStyle.color = value;
						} else {
							element.filled = value !== NONE ? true : false;

							value = renderer.color(value, element, key);

							key = 'fillcolor';
						}

					// translation for animation
					} else if (key === 'translateX' || key === 'translateY' || key === 'rotation') {
						wrapper[key] = value;
						wrapper.updateTransform();

						skipAttr = true;

					// text for rotated and non-rotated elements
					} else if (key === 'text') {
						this.bBox = null;
						element.innerHTML = value;
						skipAttr = true;
					}

					// let the shadow follow the main element
					if (shadows && key === 'visibility') {
						i = shadows.length;
						while (i--) {
							shadows[i].style[key] = value;
						}
					}



					if (!skipAttr) {
						if (docMode8) { // IE8 setAttribute bug
							element[key] = value;
						} else {
							attr(element, key, value);
						}
					}

				}
			}
		}
		return ret;
	},

	/**
	 * Set the element's clipping to a predefined rectangle
	 *
	 * @param {String} id The id of the clip rectangle
	 */
	clip: function (clipRect) {
		var wrapper = this,
			clipMembers = clipRect.members;

		clipMembers.push(wrapper);
		wrapper.destroyClip = function () {
			erase(clipMembers, wrapper);
		};
		return wrapper.css(clipRect.getCSS(wrapper.inverted));
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: SVGElement.prototype.htmlCss,

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		// discardElement will detach the node from its parent before attaching it
		// to the garbage bin. Therefore it is important that the node is attached and have parent.
		var parentNode = element.parentNode;
		if (parentNode) {
			discardElement(element);
		}
	},

	/**
	 * Extend element.destroy by removing it from the clip members array
	 */
	destroy: function () {
		var wrapper = this;

		if (wrapper.destroyClip) {
			wrapper.destroyClip();
		}

		return SVGElement.prototype.destroy.apply(wrapper);
	},

	/**
	 * Remove all child nodes of a group, except the v:group element
	 */
	empty: function () {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length,
			node;

		while (i--) {
			node = childNodes[i];
			node.parentNode.removeChild(node);
		}
	},

	/**
	 * Add an event listener. VML override for normalizing event parameters.
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		// simplest possible event model for internal use
		this.element['on' + eventType] = function () {
			var evt = win.event;
			evt.target = evt.srcElement;
			handler(evt);
		};
		return this;
	},

	/**
	 * Apply a drop shadow by copying elements and giving them different strokes
	 * @param {Boolean} apply
	 */
	shadow: function (apply, group) {
		var shadows = [],
			i,
			element = this.element,
			renderer = this.renderer,
			shadow,
			elemStyle = element.style,
			markup,
			path = element.path;

		// some times empty paths are not strings
		if (path && typeof path.value !== 'string') {
			path = 'x';
		}

		if (apply) {
			for (i = 1; i <= 3; i++) {
				markup = ['<shape isShadow="true" strokeweight="', (7 - 2 * i),
					'" filled="false" path="', path,
					'" coordsize="100,100" style="', element.style.cssText, '" />'];
				shadow = createElement(renderer.prepVML(markup),
					null, {
						left: pInt(elemStyle.left) + 1,
						top: pInt(elemStyle.top) + 1
					}
				);

				// apply the opacity
				markup = ['<stroke color="black" opacity="', (0.05 * i), '"/>'];
				createElement(renderer.prepVML(markup), null, null, shadow);


				// insert it
				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				// record it
				shadows.push(shadow);

			}

			this.shadows = shadows;
		}
		return this;

	}
};
VMLElement = extendClass(SVGElement, VMLElement);

/**
 * The VML renderer
 */
var VMLRendererExtension = { // inherit SVGRenderer

	Element: VMLElement,
	isIE8: userAgent.indexOf('MSIE 8.0') > -1,


	/**
	 * Initialize the VMLRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function (container, width, height) {
		var renderer = this,
			boxWrapper,
			box;

		renderer.alignedObjects = [];

		boxWrapper = renderer.createElement(DIV);
		box = boxWrapper.element;
		box.style.position = RELATIVE; // for freeform drawing using renderer directly
		container.appendChild(boxWrapper.element);


		// generate the containing box
		renderer.box = box;
		renderer.boxWrapper = boxWrapper;


		renderer.setSize(width, height, false);

		// The only way to make IE6 and IE7 print is to use a global namespace. However,
		// with IE8 the only way to make the dynamic shapes visible in screen and print mode
		// seems to be to add the xmlns attribute and the behaviour style inline.
		if (!doc.namespaces.hcv) {

			doc.namespaces.add('hcv', 'urn:schemas-microsoft-com:vml');

			// setup default css
			doc.createStyleSheet().cssText =
				'hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke' +
				'{ behavior:url(#default#VML); display: inline-block; } ';

		}
	},

	/**
	 * Define a clipping rectangle. In VML it is accomplished by storing the values
	 * for setting the CSS style to all associated members.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {

		// create a dummy element
		var clipRect = this.createElement();

		// mimic a rectangle with its style object for automatic updating in attr
		return extend(clipRect, {
			members: [],
			left: x,
			top: y,
			width: width,
			height: height,
			getCSS: function (inverted) {
				var rect = this,//clipRect.element.style,
					top = rect.top,
					left = rect.left,
					right = left + rect.width,
					bottom = top + rect.height,
					ret = {
						clip: 'rect(' +
							mathRound(inverted ? left : top) + 'px,' +
							mathRound(inverted ? bottom : right) + 'px,' +
							mathRound(inverted ? right : bottom) + 'px,' +
							mathRound(inverted ? top : left) + 'px)'
					};

				// issue 74 workaround
				if (!inverted && docMode8) {
					extend(ret, {
						width: right + PX,
						height: bottom + PX
					});
				}
				return ret;
			},

			// used in attr and animation to update the clipping of all members
			updateClipping: function () {
				each(clipRect.members, function (member) {
					member.css(clipRect.getCSS(member.inverted));
				});
			}
		});

	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object, and apply opacity.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/,
			markup;

		if (color && color[LINEAR_GRADIENT]) {

			var stopColor,
				stopOpacity,
				linearGradient = color[LINEAR_GRADIENT],
				x1 = linearGradient.x1 || linearGradient[0] || 0,
				y1 = linearGradient.y1 || linearGradient[1] || 0,
				x2 = linearGradient.x2 || linearGradient[2] || 0,
				y2 = linearGradient.y2 || linearGradient[3] || 0,
				angle,
				color1,
				opacity1,
				color2,
				opacity2;

			each(color.stops, function (stop, i) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}

				if (!i) { // first
					color1 = stopColor;
					opacity1 = stopOpacity;
				} else {
					color2 = stopColor;
					opacity2 = stopOpacity;
				}
			});

			// Apply the gradient to fills only.
			if (prop === 'fill') {
				// calculate the angle based on the linear vector
				angle = 90  - math.atan(
					(y2 - y1) / // y vector
					(x2 - x1) // x vector
					) * 180 / mathPI;
	
	
				// when colors attribute is used, the meanings of opacity and o:opacity2
				// are reversed.
				markup = ['<fill colors="0% ', color1, ',100% ', color2, '" angle="', angle,
					'" opacity="', opacity2, '" o:opacity2="', opacity1,
					'" type="gradient" focus="100%" method="sigma" />'];
				createElement(this.prepVML(markup), null, null, elem);
			
			// Gradients are not supported for VML stroke, return the first color. #722.
			} else {
				return stopColor;
			}


		// if the color is an rgba color, split it and add a fill node
		// to hold the opacity component
		} else if (regexRgba.test(color) && elem.tagName !== 'IMG') {

			colorObject = Color(color);

			markup = ['<', prop, ' opacity="', colorObject.get('a'), '"/>'];
			createElement(this.prepVML(markup), null, null, elem);

			return colorObject.get('rgb');


		} else {
			var strokeNodes = elem.getElementsByTagName(prop);
			if (strokeNodes.length) {
				strokeNodes[0].opacity = 1;
			}
			return color;
		}

	},

	/**
	 * Take a VML string and prepare it for either IE8 or IE6/IE7.
	 * @param {Array} markup A string array of the VML markup to prepare
	 */
	prepVML: function (markup) {
		var vmlStyle = 'display:inline-block;behavior:url(#default#VML);',
			isIE8 = this.isIE8;

		markup = markup.join('');

		if (isIE8) { // add xmlns and style inline
			markup = markup.replace('/>', ' xmlns="urn:schemas-microsoft-com:vml" />');
			if (markup.indexOf('style="') === -1) {
				markup = markup.replace('/>', ' style="' + vmlStyle + '" />');
			} else {
				markup = markup.replace('style="', 'style="' + vmlStyle);
			}

		} else { // add namespace
			markup = markup.replace('<', '<hcv:');
		}

		return markup;
	},

	/**
	 * Create rotated and aligned text
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	text: SVGRenderer.prototype.html,

	/**
	 * Create and return a path element
	 * @param {Array} path
	 */
	path: function (path) {
		// create the shape
		return this.createElement('shape').attr({
			// subpixel precision down to 0.1 (width and height = 10px)
			coordsize: '100 100',
			d: path
		});
	},

	/**
	 * Create and return a circle element. In VML circles are implemented as
	 * shapes, which is faster than v:oval
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 */
	circle: function (x, y, r) {
		return this.symbol('circle').attr({ x: x - r, y: y - r, width: 2 * r, height: 2 * r });
	},

	/**
	 * Create a group using an outer div and an inner v:group to allow rotating
	 * and flipping. A simple v:group would have problems with positioning
	 * child HTML elements and CSS clip.
	 *
	 * @param {String} name The name of the group
	 */
	g: function (name) {
		var wrapper,
			attribs;

		// set the class name
		if (name) {
			attribs = { 'className': PREFIX + name, 'class': PREFIX + name };
		}

		// the div to hold HTML and clipping
		wrapper = this.createElement(DIV).attr(attribs);

		return wrapper;
	},

	/**
	 * VML override to create a regular HTML image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var obj = this.createElement('img')
			.attr({ src: src });

		if (arguments.length > 1) {
			obj.css({
				left: x,
				top: y,
				width: width,
				height: height
			});
		}
		return obj;
	},

	/**
	 * VML uses a shape for rect to overcome bugs and rotation problems
	 */
	rect: function (x, y, width, height, r, strokeWidth) {

		if (isObject(x)) {
			y = x.y;
			width = x.width;
			height = x.height;
			strokeWidth = x.strokeWidth;
			x = x.x;
		}
		var wrapper = this.symbol('rect');
		wrapper.r = r;

		return wrapper.attr(wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0)));
	},

	/**
	 * In the VML renderer, each child of an inverted div (group) is inverted
	 * @param {Object} element
	 * @param {Object} parentNode
	 */
	invertChild: function (element, parentNode) {
		var parentStyle = parentNode.style;

		css(element, {
			flip: 'x',
			left: pInt(parentStyle.width) - 10,
			top: pInt(parentStyle.height) - 10,
			rotation: -90
		});
	},

	/**
	 * Symbol definitions that override the parent SVG renderer's symbols
	 *
	 */
	symbols: {
		// VML specific arc function
		arc: function (x, y, w, h, options) {
			var start = options.start,
				end = options.end,
				radius = options.r || w || h,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				innerRadius = options.innerR,
				circleCorrection = 0.08 / radius, // #760
				innerCorrection = (innerRadius && 0.25 / innerRadius) || 0;

			if (end - start === 0) { // no angle, don't show it.
				return ['x'];

			} else if (2 * mathPI - end + start < circleCorrection) { // full circle
				// empirical correction found by trying out the limits for different radii
				cosEnd = -circleCorrection;
			} else if (end - start < innerCorrection) { // issue #186, another mysterious VML arc problem
				cosEnd = mathCos(start + innerCorrection);
			}

			return [
				'wa', // clockwise arc to
				x - radius, // left
				y - radius, // top
				x + radius, // right
				y + radius, // bottom
				x + radius * cosStart, // start x
				y + radius * sinStart, // start y
				x + radius * cosEnd, // end x
				y + radius * sinEnd, // end y


				'at', // anti clockwise arc to
				x - innerRadius, // left
				y - innerRadius, // top
				x + innerRadius, // right
				y + innerRadius, // bottom
				x + innerRadius * cosEnd, // start x
				y + innerRadius * sinEnd, // start y
				x + innerRadius * cosStart, // end x
				y + innerRadius * sinStart, // end y

				'x', // finish path
				'e' // close
			];

		},
		// Add circle symbol path. This performs significantly faster than v:oval.
		circle: function (x, y, w, h) {

			return [
				'wa', // clockwisearcto
				x, // left
				y, // top
				x + w, // right
				y + h, // bottom
				x + w, // start x
				y + h / 2,     // start y
				x + w, // end x
				y + h / 2,     // end y
				//'x', // finish path
				'e' // close
			];
		},
		/**
		 * Add rectangle symbol path which eases rotation and omits arcsize problems
		 * compared to the built-in VML roundrect shape
		 *
		 * @param {Number} left Left position
		 * @param {Number} top Top position
		 * @param {Number} r Border radius
		 * @param {Object} options Width and height
		 */

		rect: function (left, top, width, height, options) {
			/*for (var n in r) {
				logTime && console .log(n)
				}*/

			if (!defined(options)) {
				return [];
			}
			var right = left + width,
				bottom = top + height,
				r = mathMin(options.r || 0, width, height);

			return [
				M,
				left + r, top,

				L,
				right - r, top,
				'wa',
				right - 2 * r, top,
				right, top + 2 * r,
				right - r, top,
				right, top + r,

				L,
				right, bottom - r,
				'wa',
				right - 2 * r, bottom - 2 * r,
				right, bottom,
				right, bottom - r,
				right - r, bottom,

				L,
				left + r, bottom,
				'wa',
				left, bottom - 2 * r,
				left + 2 * r, bottom,
				left + r, bottom,
				left, bottom - r,

				L,
				left, top + r,
				'wa',
				left, top,
				left + 2 * r, top + 2 * r,
				left, top + r,
				left + r, top,


				'x',
				'e'
			];

		}
	}
};
VMLRenderer = function () {
	this.init.apply(this, arguments);
};
VMLRenderer.prototype = merge(SVGRenderer.prototype, VMLRendererExtension);

	// general renderer
	Renderer = VMLRenderer;
}

/* ****************************************************************************
 *                                                                            *
 * END OF INTERNET EXPLORER <= 8 SPECIFIC CODE                                *
 *                                                                            *
 *****************************************************************************/
/* ****************************************************************************
 *                                                                            *
 * START OF ANDROID < 3 SPECIFIC CODE. THIS CAN BE REMOVED IF YOU'RE NOT      *
 * TARGETING THAT SYSTEM.                                                     *
 *                                                                            *
 *****************************************************************************/
var CanVGRenderer,
	CanVGController;

if (useCanVG) {
	/**
	 * The CanVGRenderer is empty from start to keep the source footprint small.
	 * When requested, the CanVGController downloads the rest of the source packaged
	 * together with the canvg library.
	 */
	CanVGRenderer = function () {
		// Empty constructor
	};

	/**
	 * Handles on demand download of canvg rendering support.
	 */
	CanVGController = (function () {
		// List of renderering calls
		var deferredRenderCalls = [];

		/**
		 * When downloaded, we are ready to draw deferred charts.
		 */
		function drawDeferred() {
			var callLength = deferredRenderCalls.length,
				callIndex;

			// Draw all pending render calls
			for (callIndex = 0; callIndex < callLength; callIndex++) {
				deferredRenderCalls[callIndex]();
			}
			// Clear the list
			deferredRenderCalls = [];
		}

		return {
			push: function (func, scriptLocation) {
				// Only get the script once
				if (deferredRenderCalls.length === 0) {
					getScript(scriptLocation, drawDeferred);
				}
				// Register render call
				deferredRenderCalls.push(func);
			}
		};
	}());
} // end CanVGRenderer

/* ****************************************************************************
 *                                                                            *
 * END OF ANDROID < 3 SPECIFIC CODE                                           *
 *                                                                            *
 *****************************************************************************/

/**
 * General renderer
 */
Renderer = VMLRenderer || CanVGRenderer || SVGRenderer;

/**
 * The chart class
 * @param {Object} options
 * @param {Function} callback Function to run when the chart has loaded
 */
function Chart(userOptions, callback) {

	// Handle regular options
	var options,
		seriesOptions = userOptions.series; // skip merging data points to increase performance
	userOptions.series = null;
	options = merge(defaultOptions, userOptions); // do the merge
	options.series = userOptions.series = seriesOptions; // set back the series data
	
	var optionsChart = options.chart,
		optionsMargin = optionsChart.margin,
		margin = isObject(optionsMargin) ?
			optionsMargin :
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin],
		optionsMarginTop = pick(optionsChart.marginTop, margin[0]),
		optionsMarginRight = pick(optionsChart.marginRight, margin[1]),
		optionsMarginBottom = pick(optionsChart.marginBottom, margin[2]),
		optionsMarginLeft = pick(optionsChart.marginLeft, margin[3]),
		spacingTop = optionsChart.spacingTop,
		spacingRight = optionsChart.spacingRight,
		spacingBottom = optionsChart.spacingBottom,
		spacingLeft = optionsChart.spacingLeft,
		spacingBox,
		chartTitleOptions,
		chartSubtitleOptions,
		plotTop,
		marginRight,
		marginBottom,
		plotLeft,
		axisOffset,
		renderTo,
		renderToClone,
		container,
		containerId,
		containerWidth,
		containerHeight,
		chartWidth,
		chartHeight,
		oldChartWidth,
		oldChartHeight,
		chartBackground,
		plotBackground,
		plotBGImage,
		plotBorder,
		chart = this,
		chartEvents = optionsChart.events,
		runChartClick = chartEvents && !!chartEvents.click,
		eventType,
		isInsidePlot, // function
		tooltip,
		mouseIsDown,
		loadingDiv,
		loadingSpan,
		loadingShown,
		plotHeight,
		plotWidth,
		tracker,
		trackerGroup,
		legend,
		legendWidth,
		legendHeight,
		chartPosition,
		hasCartesianSeries = optionsChart.showAxes,
		isResizing = 0,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [],
		inverted,
		renderer,
		tooltipTick,
		tooltipInterval,
		hoverX,
		drawChartBox, // function
		getMargins, // function
		resetMargins, // function
		setChartSize, // function
		resize,
		zoom, // function
		zoomOut; // function


	/**
	 * Create a new axis object
	 * @param {Object} options
	 */
	function Axis(userOptions) {

		// Define variables
		var isXAxis = userOptions.isX,
			opposite = userOptions.opposite, // needed in setOptions
			horiz = inverted ? !isXAxis : isXAxis,
			side = horiz ?
				(opposite ? 0 : 2) : // top : bottom
				(opposite ? 1 : 3),  // right : left
			stacks = {},

			options = merge(
				isXAxis ? defaultXAxisOptions : defaultYAxisOptions,
				[defaultTopAxisOptions, defaultRightAxisOptions,
					defaultBottomAxisOptions, defaultLeftAxisOptions][side],
				userOptions
			),

			axis = this,
			axisTitle,
			type = options.type,
			isDatetimeAxis = type === 'datetime',
			isLog = type === 'logarithmic',
			offset = options.offset || 0,
			xOrY = isXAxis ? 'x' : 'y',
			axisLength = 0,
			oldAxisLength,
			transA, // translation factor
			transB, // translation addend
			oldTransA, // used for prerendering
			axisLeft,
			axisTop,
			axisWidth,
			axisHeight,
			axisBottom,
			axisRight,
			translate, // fn
			setAxisTranslation, // fn
			getPlotLinePath, // fn
			axisGroup,
			gridGroup,
			axisLine,
			dataMin,
			dataMax,
			minRange = options.minRange || options.maxZoom,
			range = options.range,
			userMin,
			userMax,
			oldUserMin,
			oldUserMax,
			max = null,
			min = null,
			oldMin,
			oldMax,
			minPadding = options.minPadding,
			maxPadding = options.maxPadding,
			minPixelPadding = 0,
			isLinked = defined(options.linkedTo),
			linkedParent,
			ignoreMinPadding, // can be set to true by a column or bar series
			ignoreMaxPadding,
			usePercentage,
			events = options.events,
			eventType,
			plotLinesAndBands = [],
			tickInterval,
			minorTickInterval,
			magnitude,
			tickPositions, // array containing predefined positions
			tickPositioner = options.tickPositioner,
			ticks = {},
			minorTicks = {},
			alternateBands = {},
			tickAmount,
			labelOffset,
			axisTitleMargin,// = options.title.margin,
			categories = options.categories,
			labelFormatter = options.labels.formatter ||  // can be overwritten by dynamic format
				function () {
					var value = this.value,
						dateTimeLabelFormat = this.dateTimeLabelFormat,
						ret;

					if (dateTimeLabelFormat) { // datetime axis
						ret = dateFormat(dateTimeLabelFormat, value);

					} else if (tickInterval % 1000000 === 0) { // use M abbreviation
						ret = (value / 1000000) + 'M';

					} else if (tickInterval % 1000 === 0) { // use k abbreviation
						ret = (value / 1000) + 'k';

					} else if (!categories && value >= 1000) { // add thousands separators
						ret = numberFormat(value, 0);

					} else { // strings (categories) and small numbers
						ret = value;
					}
					return ret;
				},

			staggerLines = horiz && options.labels.staggerLines,
			reversed = options.reversed,
			tickmarkOffset = (categories && options.tickmarkPlacement === 'between') ? 0.5 : 0;

		/**
		 * The Tick class
		 */
		function Tick(pos, type) {
			var tick = this;
			tick.pos = pos;
			tick.type = type || '';
			tick.isNew = true;

			if (!type) {
				tick.addLabel();
			}
		}
		Tick.prototype = {

			/**
			 * Write the tick label
			 */
			addLabel: function () {
				var tick = this,
					pos = tick.pos,
					labelOptions = options.labels,
					str,
					width = (categories && horiz && categories.length &&
						!labelOptions.step && !labelOptions.staggerLines &&
						!labelOptions.rotation &&
						plotWidth / categories.length) ||
						(!horiz && plotWidth / 2),
					isFirst = pos === tickPositions[0],
					isLast = pos === tickPositions[tickPositions.length - 1],
					css,
					value = categories && defined(categories[pos]) ? categories[pos] : pos,
					label = tick.label,
					tickPositionInfo = tickPositions.info,
					dateTimeLabelFormat;

				// Set the datetime label format. If a higher rank is set for this position, use that. If not,
				// use the general format.
				if (isDatetimeAxis && tickPositionInfo) {
					dateTimeLabelFormat = options.dateTimeLabelFormats[tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName];
				}

				// set properties for access in render method
				tick.isFirst = isFirst;
				tick.isLast = isLast;

				// get the string
				str = labelFormatter.call({
					axis: axis,
					chart: chart,
					isFirst: isFirst,
					isLast: isLast,
					dateTimeLabelFormat: dateTimeLabelFormat,
					value: isLog ? correctFloat(lin2log(value)) : value
				});


				// prepare CSS
				css = width && { width: mathMax(1, mathRound(width - 2 * (labelOptions.padding || 10))) + PX };
				css = extend(css, labelOptions.style);

				// first call
				if (!defined(label)) {
					tick.label =
						defined(str) && labelOptions.enabled ?
							renderer.text(
									str,
									0,
									0,
									labelOptions.useHTML
								)
								.attr({
									align: labelOptions.align,
									rotation: labelOptions.rotation
								})
								// without position absolute, IE export sometimes is wrong
								.css(css)
								.add(axisGroup) :
							null;

				// update
				} else if (label) {
					label.attr({
							text: str
						})
						.css(css);
				}
			},
			/**
			 * Get the offset height or width of the label
			 */
			getLabelSize: function () {
				var label = this.label;
				return label ?
					((this.labelBBox = label.getBBox()))[horiz ? 'height' : 'width'] :
					0;
			},
			
			/**
			 * Find how far the labels extend to the right and left of the tick's x position. Used for anti-collision
			 * detection with overflow logic.
			 */
			getLabelSides: function () {
				var bBox = this.labelBBox, // assume getLabelSize has run at this point
					labelOptions = options.labels,
					width = bBox.width,
					leftSide = width * { left: 0, center: 0.5, right: 1 }[labelOptions.align] - labelOptions.x;
					
				return [-leftSide, width - leftSide];				
			},
			
			/**
			 * Handle the label overflow by adjusting the labels to the left and right edge, or
			 * hide them if they collide into the neighbour label.
			 */
			handleOverflow: function (index) {
				var show = true,
					isFirst = this.isFirst,
					isLast = this.isLast,
					label = this.label,
					x = label.x;
					
				if (isFirst || isLast) {
					
					var sides = this.getLabelSides(),
						leftSide = sides[0],
						rightSide = sides[1],
						plotLeft = chart.plotLeft,
						plotRight = plotLeft + axis.len,
						neighbour = ticks[tickPositions[index + (isFirst ? 1 : -1)]],
						neighbourEdge = neighbour && neighbour.label.x + neighbour.getLabelSides()[isFirst ? 0 : 1];
					
					if ((isFirst && !reversed) || (isLast && reversed)) {
						// Is the label spilling out to the left of the plot area?
						if (x + leftSide < plotLeft) {
							
							// Align it to plot left
							x = plotLeft - leftSide;
							
							// Hide it if it now overlaps the neighbour label
							if (neighbour && x + rightSide > neighbourEdge) {
								show = false;
							}
						}
										
					} else {
						// Is the label spilling out to the right of the plot area?
						if (x + rightSide > plotRight) {
							
							// Align it to plot right
							x = plotRight - rightSide;
							
							// Hide it if it now overlaps the neighbour label
							if (neighbour && x + leftSide < neighbourEdge) {
								show = false;
							}
							
						}
					}
					
					// Set the modified x position of the label
					label.x = x;
				}
				return show;
			},
			
			/**
			 * Put everything in place
			 *
			 * @param index {Number}
			 * @param old {Boolean} Use old coordinates to prepare an animation into new position
			 */
			render: function (index, old) {
				var tick = this,
					type = tick.type,
					label = tick.label,
					pos = tick.pos,
					labelOptions = options.labels,
					gridLine = tick.gridLine,
					gridPrefix = type ? type + 'Grid' : 'grid',
					tickPrefix = type ? type + 'Tick' : 'tick',
					gridLineWidth = options[gridPrefix + 'LineWidth'],
					gridLineColor = options[gridPrefix + 'LineColor'],
					dashStyle = options[gridPrefix + 'LineDashStyle'],
					tickLength = options[tickPrefix + 'Length'],
					tickWidth = options[tickPrefix + 'Width'] || 0,
					tickColor = options[tickPrefix + 'Color'],
					tickPosition = options[tickPrefix + 'Position'],
					gridLinePath,
					mark = tick.mark,
					markPath,
					step = labelOptions.step,
					cHeight = (old && oldChartHeight) || chartHeight,
					attribs,
					show = true,
					x,
					y;

				// get x and y position for ticks and labels
				x = horiz ?
					translate(pos + tickmarkOffset, null, null, old) + transB :
					axisLeft + offset + (opposite ? ((old && oldChartWidth) || chartWidth) - axisRight - axisLeft : 0);

				y = horiz ?
					cHeight - axisBottom + offset - (opposite ? axisHeight : 0) :
					cHeight - translate(pos + tickmarkOffset, null, null, old) - transB;

				// create the grid line
				if (gridLineWidth) {
					gridLinePath = getPlotLinePath(pos + tickmarkOffset, gridLineWidth, old);

					if (gridLine === UNDEFINED) {
						attribs = {
							stroke: gridLineColor,
							'stroke-width': gridLineWidth
						};
						if (dashStyle) {
							attribs.dashstyle = dashStyle;
						}
						if (!type) {
							attribs.zIndex = 1;
						}
						tick.gridLine = gridLine =
							gridLineWidth ?
								renderer.path(gridLinePath)
									.attr(attribs).add(gridGroup) :
								null;
					}

					// If the parameter 'old' is set, the current call will be followed
					// by another call, therefore do not do any animations this time
					if (!old && gridLine && gridLinePath) {
						gridLine.animate({
							d: gridLinePath
						});
					}
				}

				// create the tick mark
				if (tickWidth) {

					// negate the length
					if (tickPosition === 'inside') {
						tickLength = -tickLength;
					}
					if (opposite) {
						tickLength = -tickLength;
					}

					markPath = renderer.crispLine([
						M,
						x,
						y,
						L,
						x + (horiz ? 0 : -tickLength),
						y + (horiz ? tickLength : 0)
					], tickWidth);

					if (mark) { // updating
						mark.animate({
							d: markPath
						});
					} else { // first time
						tick.mark = renderer.path(
							markPath
						).attr({
							stroke: tickColor,
							'stroke-width': tickWidth
						}).add(axisGroup);
					}
				}

				// the label is created on init - now move it into place
				if (label && !isNaN(x)) {
					x = x + labelOptions.x - (tickmarkOffset && horiz ?
						tickmarkOffset * transA * (reversed ? -1 : 1) : 0);
					y = y + labelOptions.y - (tickmarkOffset && !horiz ?
						tickmarkOffset * transA * (reversed ? 1 : -1) : 0);

					// vertically centered
					if (!defined(labelOptions.y)) {
						y += pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
					}


					// correct for staggered labels
					if (staggerLines) {
						y += (index / (step || 1) % staggerLines) * 16;
					}
					
					// Cache x and y to be able to read final position before animation
					label.x = x;
					label.y = y;

					// apply show first and show last
					if ((tick.isFirst && !pick(options.showFirstLabel, 1)) ||
							(tick.isLast && !pick(options.showLastLabel, 1))) {
						show = false;
						
					// Handle label overflow and show or hide accordingly
					} else if (!staggerLines && horiz && labelOptions.overflow === 'justify' && !tick.handleOverflow(index)) {						
						show = false;
					}

					// apply step
					if (step && index % step) {
						// show those indices dividable by step
						show = false;
					}
					
					// Set the new position, and show or hide
					if (show) {
						label[tick.isNew ? 'attr' : 'animate']({
							x: label.x,
							y: label.y
						});
						label.show();
						tick.isNew = false;
					} else {
						label.hide();
					}
				}

				
			},
			
			/**
			 * Destructor for the tick prototype
			 */
			destroy: function () {
				destroyObjectProperties(this);
			}
		};

		/**
		 * The object wrapper for plot lines and plot bands
		 * @param {Object} options
		 */
		function PlotLineOrBand(options) {
			var plotLine = this;
			if (options) {
				plotLine.options = options;
				plotLine.id = options.id;
			}

			//plotLine.render()
			return plotLine;
		}

		PlotLineOrBand.prototype = {

		/**
		 * Render the plot line or plot band. If it is already existing,
		 * move it.
		 */
		render: function () {
			var plotLine = this,
				halfPointRange = (axis.pointRange || 0) / 2,
				options = plotLine.options,
				optionsLabel = options.label,
				label = plotLine.label,
				width = options.width,
				to = options.to,
				from = options.from,
				value = options.value,
				toPath, // bands only
				dashStyle = options.dashStyle,
				svgElem = plotLine.svgElem,
				path = [],
				addEvent,
				eventType,
				xs,
				ys,
				x,
				y,
				color = options.color,
				zIndex = options.zIndex,
				events = options.events,
				attribs;

			// logarithmic conversion
			if (isLog) {
				from = log2lin(from);
				to = log2lin(to);
				value = log2lin(value);
			}

			// plot line
			if (width) {
				path = getPlotLinePath(value, width);
				attribs = {
					stroke: color,
					'stroke-width': width
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}
			} else if (defined(from) && defined(to)) { // plot band
				// keep within plot area
				from = mathMax(from, min - halfPointRange);
				to = mathMin(to, max + halfPointRange);

				toPath = getPlotLinePath(to);
				path = getPlotLinePath(from);
				if (path && toPath) {
					path.push(
						toPath[4],
						toPath[5],
						toPath[1],
						toPath[2]
					);
				} else { // outside the axis area
					path = null;
				}
				attribs = {
					fill: color
				};
			} else {
				return;
			}
			// zIndex
			if (defined(zIndex)) {
				attribs.zIndex = zIndex;
			}

			// common for lines and bands
			if (svgElem) {
				if (path) {
					svgElem.animate({
						d: path
					}, null, svgElem.onGetPath);
				} else {
					svgElem.hide();
					svgElem.onGetPath = function () {
						svgElem.show();
					};
				}
			} else if (path && path.length) {
				plotLine.svgElem = svgElem = renderer.path(path)
					.attr(attribs).add();

				// events
				if (events) {
					addEvent = function (eventType) {
						svgElem.on(eventType, function (e) {
							events[eventType].apply(plotLine, [e]);
						});
					};
					for (eventType in events) {
						addEvent(eventType);
					}
				}
			}

			// the plot band/line label
			if (optionsLabel && defined(optionsLabel.text) && path && path.length && axisWidth > 0 && axisHeight > 0) {
				// apply defaults
				optionsLabel = merge({
					align: horiz && toPath && 'center',
					x: horiz ? !toPath && 4 : 10,
					verticalAlign : !horiz && toPath && 'middle',
					y: horiz ? toPath ? 16 : 10 : toPath ? 6 : -4,
					rotation: horiz && !toPath && 90
				}, optionsLabel);

				// add the SVG element
				if (!label) {
					plotLine.label = label = renderer.text(
							optionsLabel.text,
							0,
							0
						)
						.attr({
							align: optionsLabel.textAlign || optionsLabel.align,
							rotation: optionsLabel.rotation,
							zIndex: zIndex
						})
						.css(optionsLabel.style)
						.add();
				}

				// get the bounding box and align the label
				xs = [path[1], path[4], pick(path[6], path[1])];
				ys = [path[2], path[5], pick(path[7], path[2])];
				x = arrayMin(xs);
				y = arrayMin(ys);

				label.align(optionsLabel, false, {
					x: x,
					y: y,
					width: arrayMax(xs) - x,
					height: arrayMax(ys) - y
				});
				label.show();

			} else if (label) { // move out of sight
				label.hide();
			}

			// chainable
			return plotLine;
		},

		/**
		 * Remove the plot line or band
		 */
		destroy: function () {
			var obj = this;

			destroyObjectProperties(obj);

			// remove it from the lookup
			erase(plotLinesAndBands, obj);
		}
		};

		/**
		 * The class for stack items
		 */
		function StackItem(options, isNegative, x, stackOption) {
			var stackItem = this;

			// Tells if the stack is negative
			stackItem.isNegative = isNegative;

			// Save the options to be able to style the label
			stackItem.options = options;

			// Save the x value to be able to position the label later
			stackItem.x = x;

			// Save the stack option on the series configuration object
			stackItem.stack = stackOption;

			// The align options and text align varies on whether the stack is negative and
			// if the chart is inverted or not.
			// First test the user supplied value, then use the dynamic.
			stackItem.alignOptions = {
				align: options.align || (inverted ? (isNegative ? 'left' : 'right') : 'center'),
				verticalAlign: options.verticalAlign || (inverted ? 'middle' : (isNegative ? 'bottom' : 'top')),
				y: pick(options.y, inverted ? 4 : (isNegative ? 14 : -6)),
				x: pick(options.x, inverted ? (isNegative ? -6 : 6) : 0)
			};

			stackItem.textAlign = options.textAlign || (inverted ? (isNegative ? 'right' : 'left') : 'center');
		}

		StackItem.prototype = {
			destroy: function () {
				destroyObjectProperties(this);
			},

			/**
			 * Sets the total of this stack. Should be called when a serie is hidden or shown
			 * since that will affect the total of other stacks.
			 */
			setTotal: function (total) {
				this.total = total;
				this.cum = total;
			},

			/**
			 * Renders the stack total label and adds it to the stack label group.
			 */
			render: function (group) {
				var stackItem = this,									// aliased this
					str = stackItem.options.formatter.call(stackItem);  // format the text in the label

				// Change the text to reflect the new total and set visibility to hidden in case the serie is hidden
				if (stackItem.label) {
					stackItem.label.attr({text: str, visibility: HIDDEN});
				// Create new label
				} else {
					stackItem.label =
						chart.renderer.text(str, 0, 0)				// dummy positions, actual position updated with setOffset method in columnseries
							.css(stackItem.options.style)			// apply style
							.attr({align: stackItem.textAlign,			// fix the text-anchor
								rotation: stackItem.options.rotation,	// rotation
								visibility: HIDDEN })					// hidden until setOffset is called
							.add(group);							// add to the labels-group
				}
			},

			/**
			 * Sets the offset that the stack has from the x value and repositions the label.
			 */
			setOffset: function (xOffset, xWidth) {
				var stackItem = this,										// aliased this
					neg = stackItem.isNegative,								// special treatment is needed for negative stacks
					y = axis.translate(stackItem.total, 0, 0, 0, 1),		// stack value translated mapped to chart coordinates
					yZero = axis.translate(0),								// stack origin
					h = mathAbs(y - yZero),									// stack height
					x = chart.xAxis[0].translate(stackItem.x) + xOffset,	// stack x position
					plotHeight = chart.plotHeight,
					stackBox = {	// this is the box for the complete stack
							x: inverted ? (neg ? y : y - h) : x,
							y: inverted ? plotHeight - x - xWidth : (neg ? (plotHeight - y - h) : plotHeight - y),
							width: inverted ? h : xWidth,
							height: inverted ? xWidth : h
					};

				if (stackItem.label) {
					stackItem.label
						.align(stackItem.alignOptions, null, stackBox)	// align the label to the box
						.attr({visibility: VISIBLE});					// set visibility
				}
			}
		};

		/**
		 * Get the minimum and maximum for the series of each axis
		 */
		function getSeriesExtremes() {
			var posStack = [],
				negStack = [],
				i;

			// reset dataMin and dataMax in case we're redrawing
			dataMin = dataMax = null;

			// loop through this axis' series
			each(axis.series, function (series) {

				if (series.visible || !optionsChart.ignoreHiddenSeries) {

					var seriesOptions = series.options,
						stacking,
						posPointStack,
						negPointStack,
						stackKey,
						stackOption,
						negKey,
						xData,
						yData,
						x,
						y,
						threshold = seriesOptions.threshold,
						yDataLength,
						activeYData = [],
						activeCounter = 0;
						
					// Validate threshold in logarithmic axes
					if (isLog && threshold <= 0) {
						threshold = seriesOptions.threshold = null;
					}

					// Get dataMin and dataMax for X axes
					if (isXAxis) {
						xData = series.xData;
						if (xData.length) {
							dataMin = mathMin(pick(dataMin, xData[0]), arrayMin(xData));
							dataMax = mathMax(pick(dataMax, xData[0]), arrayMax(xData));
						}

					// Get dataMin and dataMax for Y axes, as well as handle stacking and processed data
					} else {
						var isNegative,
							pointStack,
							key,
							cropped = series.cropped,
							xExtremes = series.xAxis.getExtremes(),
							//findPointRange,
							//pointRange,
							j,
							hasModifyValue = !!series.modifyValue;


						// Handle stacking
						stacking = seriesOptions.stacking;
						usePercentage = stacking === 'percent';

						// create a stack for this particular series type
						if (stacking) {
							stackOption = seriesOptions.stack;
							stackKey = series.type + pick(stackOption, '');
							negKey = '-' + stackKey;
							series.stackKey = stackKey; // used in translate

							posPointStack = posStack[stackKey] || []; // contains the total values for each x
							posStack[stackKey] = posPointStack;

							negPointStack = negStack[negKey] || [];
							negStack[negKey] = negPointStack;
						}
						if (usePercentage) {
							dataMin = 0;
							dataMax = 99;
						}


						// processData can alter series.pointRange, so this goes after
						//findPointRange = series.pointRange === null;

						xData = series.processedXData;
						yData = series.processedYData;
						yDataLength = yData.length;

						// loop over the non-null y values and read them into a local array
						for (i = 0; i < yDataLength; i++) {
							x = xData[i];
							y = yData[i];
							if (y !== null && y !== UNDEFINED) {

								// read stacked values into a stack based on the x value,
								// the sign of y and the stack key
								if (stacking) {
									isNegative = y < threshold;
									pointStack = isNegative ? negPointStack : posPointStack;
									key = isNegative ? negKey : stackKey;

									y = pointStack[x] =
										defined(pointStack[x]) ?
										pointStack[x] + y : y;


									// add the series
									if (!stacks[key]) {
										stacks[key] = {};
									}

									// If the StackItem is there, just update the values,
									// if not, create one first
									if (!stacks[key][x]) {
										stacks[key][x] = new StackItem(options.stackLabels, isNegative, x, stackOption);
									}
									stacks[key][x].setTotal(y);


								// general hook, used for Highstock compare values feature
								} else if (hasModifyValue) {
									y = series.modifyValue(y);
								}

								// get the smallest distance between points
								/*if (i) {
									distance = mathAbs(xData[i] - xData[i - 1]);
									pointRange = pointRange === UNDEFINED ? distance : mathMin(distance, pointRange);
								}*/

								// for points within the visible range, including the first point outside the
								// visible range, consider y extremes
								if (cropped || ((xData[i + 1] || x) >= xExtremes.min && (xData[i - 1] || x) <= xExtremes.max)) {

									j = y.length;
									if (j) { // array, like ohlc data
										while (j--) {
											if (y[j] !== null) {
												activeYData[activeCounter++] = y[j];
											}
										}
									} else {
										activeYData[activeCounter++] = y;
									}
								}
							}
						}

						// record the least unit distance
						/*if (findPointRange) {
							series.pointRange = pointRange || 1;
						}
						series.closestPointRange = pointRange;*/

						// Get the dataMin and dataMax so far. If percentage is used, the min and max are
						// always 0 and 100. If the length of activeYData is 0, continue with null values.
						if (!usePercentage && activeYData.length) {
							dataMin = mathMin(pick(dataMin, activeYData[0]), arrayMin(activeYData));
							dataMax = mathMax(pick(dataMax, activeYData[0]), arrayMax(activeYData));
						}

						// Adjust to threshold
						if (defined(threshold)) {
							if (dataMin >= threshold) {
								dataMin = threshold;
								ignoreMinPadding = true;
							} else if (dataMax < threshold) {
								dataMax = threshold;
								ignoreMaxPadding = true;
							}
						}
					}
				}
			});

		}

		/**
		 * Translate from axis value to pixel position on the chart, or back
		 *
		 */
		translate = function (val, backwards, cvsCoord, old, handleLog) {
			
			var sign = 1,
				cvsOffset = 0,
				localA = old ? oldTransA : transA,
				localMin = old ? oldMin : min,
				returnValue,
				postTranslate = options.ordinal || (isLog && handleLog);

			if (!localA) {
				localA = transA;
			}

			if (cvsCoord) {
				sign *= -1; // canvas coordinates inverts the value
				cvsOffset = axisLength;
			}
			if (reversed) { // reversed axis
				sign *= -1;
				cvsOffset -= sign * axisLength;
			}

			if (backwards) { // reverse translation
				if (reversed) {
					val = axisLength - val;
				}
				returnValue = val / localA + localMin; // from chart pixel to value
				if (postTranslate) { // log and ordinal axes
					returnValue = axis.lin2val(returnValue);
				}

			} else { // normal translation, from axis value to pixel, relative to plot
				if (postTranslate) { // log and ordinal axes
					val = axis.val2lin(val);
				}

				returnValue = sign * (val - localMin) * localA + cvsOffset + (sign * minPixelPadding);
			}

			return returnValue;
		};

		/**
		 * Create the path for a plot line that goes from the given value on
		 * this axis, across the plot to the opposite side
		 * @param {Number} value
		 * @param {Number} lineWidth Used for calculation crisp line
		 * @param {Number] old Use old coordinates (for resizing and rescaling)
		 */
		getPlotLinePath = function (value, lineWidth, old) {
			var x1,
				y1,
				x2,
				y2,
				translatedValue = translate(value, null, null, old),
				cHeight = (old && oldChartHeight) || chartHeight,
				cWidth = (old && oldChartWidth) || chartWidth,
				skip;

			x1 = x2 = mathRound(translatedValue + transB);
			y1 = y2 = mathRound(cHeight - translatedValue - transB);

			if (isNaN(translatedValue)) { // no min or max
				skip = true;

			} else if (horiz) {
				y1 = axisTop;
				y2 = cHeight - axisBottom;
				if (x1 < axisLeft || x1 > axisLeft + axisWidth) {
					skip = true;
				}
			} else {
				x1 = axisLeft;
				x2 = cWidth - axisRight;

				if (y1 < axisTop || y1 > axisTop + axisHeight) {
					skip = true;
				}
			}
			return skip ?
				null :
				renderer.crispLine([M, x1, y1, L, x2, y2], lineWidth || 0);
		};

		/**
		 * Set the tick positions of a linear axis to round values like whole tens or every five.
		 */
		function getLinearTickPositions(tickInterval, min, max) {

			var pos,
				lastPos,
				roundedMin = correctFloat(mathFloor(min / tickInterval) * tickInterval),
				roundedMax = correctFloat(mathCeil(max / tickInterval) * tickInterval),
				tickPositions = [];

			// Populate the intermediate values
			pos = roundedMin;
			while (pos <= roundedMax) {

				// Place the tick on the rounded value
				tickPositions.push(pos);

				// Always add the raw tickInterval, not the corrected one.
				pos = correctFloat(pos + tickInterval);

				// If the interval is not big enough in the current min - max range to actually increase
				// the loop variable, we need to break out to prevent endless loop. Issue #619
				if (pos === lastPos) {
					break;
				}

				// Record the last value
				lastPos = pos;
			}
			return tickPositions;
		}
		
		/**
		 * Set the tick positions of a logarithmic axis
		 */
		function getLogTickPositions(interval, min, max, minor) {
			
			// Since we use this method for both major and minor ticks,
			// use a local variable and return the result
			var positions = []; 
			
			// Reset
			if (!minor) {
				axis._minorAutoInterval = null;
			}
			
			// First case: All ticks fall on whole logarithms: 1, 10, 100 etc.
			if (interval >= 0.5) {
				interval = mathRound(interval);
				positions = getLinearTickPositions(interval, min, max);
				
			// Second case: We need intermediary ticks. For example 
			// 1, 2, 4, 6, 8, 10, 20, 40 etc. 
			} else if (interval >= 0.08) {
				var roundedMin = mathFloor(min),
					intermediate,
					i,
					j,
					len,
					pos,
					lastPos,
					break2;
					
				if (interval > 0.3) {
					intermediate = [1, 2, 4];
				} else if (interval > 0.15) { // 0.2 equals five minor ticks per 1, 10, 100 etc
					intermediate = [1, 2, 4, 6, 8];
				} else { // 0.1 equals ten minor ticks per 1, 10, 100 etc
					intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				}
				
				for (i = roundedMin; i < max + 1 && !break2; i++) {
					len = intermediate.length;
					for (j = 0; j < len && !break2; j++) {
						pos = log2lin(lin2log(i) * intermediate[j]);
						
						if (pos > min) {
							positions.push(lastPos);
						}
						
						if (lastPos > max) {
							break2 = true;
						}
						lastPos = pos;
					}
				}
				
			// Third case: We are so deep in between whole logarithmic values that
			// we might as well handle the tick positions like a linear axis. For
			// example 1.01, 1.02, 1.03, 1.04.
			} else {
				var realMin = lin2log(min),
					realMax = lin2log(max),
					tickIntervalOption = options[minor ? 'minorTickInterval' : 'tickInterval'],
					filteredTickIntervalOption = tickIntervalOption === 'auto' ? null : tickIntervalOption,
					tickPixelIntervalOption = options.tickPixelInterval / (minor ? 5 : 1),
					totalPixelLength = minor ? axisLength / tickPositions.length : axisLength;
				
				interval = pick(
					filteredTickIntervalOption,
					axis._minorAutoInterval,
					(realMax - realMin) * tickPixelIntervalOption / (totalPixelLength || 1)
				);
				
				interval = normalizeTickInterval(
					interval, 
					null, 
					math.pow(10, mathFloor(math.log(interval) / math.LN10))
				);
				
				positions = map(getLinearTickPositions(
					interval, 
					realMin,
					realMax	
				), log2lin);
				
				if (!minor) {
					axis._minorAutoInterval = interval / 5;
				}
			}
			
			// Set the axis-level tickInterval variable 
			if (!minor) {
				tickInterval = interval;
			}
			return positions;
		}
		
		/**
		 * Return the minor tick positions. For logarithmic axes, reuse the same logic
		 * as for major ticks.
		 */
		function getMinorTickPositions() {
			var minorTickPositions = [],
				pos,
				i,
				len;
			
			if (isLog) {
				len = tickPositions.length;
				for (i = 1; i < len; i++) {
					minorTickPositions = minorTickPositions.concat(
						getLogTickPositions(minorTickInterval, tickPositions[i - 1], tickPositions[i], true)
					);	
				}
			
			} else {			
				for (pos = min + (tickPositions[0] - min) % minorTickInterval; pos <= max; pos += minorTickInterval) {
					minorTickPositions.push(pos);	
				}
			}
			
			return minorTickPositions;
		}

		/**
		 * Adjust the min and max for the minimum range. Keep in mind that the series data is 
		 * not yet processed, so we don't have information on data cropping and grouping, or 
		 * updated axis.pointRange or series.pointRange. The data can't be processed until
		 * we have finally established min and max.
		 */
		function adjustForMinRange() {
			var zoomOffset,
				spaceAvailable = dataMax - dataMin >= minRange,
				closestDataRange,
				i,
				distance,
				xData,
				loopLength,
				minArgs,
				maxArgs;
				
			// Set the automatic minimum range based on the closest point distance
			if (isXAxis && minRange === UNDEFINED && !isLog) {
				
				if (defined(options.min) || defined(options.max)) {
					minRange = null; // don't do this again

				} else {

					// Find the closest distance between raw data points, as opposed to
					// closestPointRange that applies to processed points (cropped and grouped)
					each(axis.series, function (series) {
						xData = series.xData;
						loopLength = series.xIncrement ? 1 : xData.length - 1;
						for (i = loopLength; i > 0; i--) {
							distance = xData[i] - xData[i - 1];
							if (closestDataRange === UNDEFINED || distance < closestDataRange) {
								closestDataRange = distance;
							}
						}
					});
					minRange = mathMin(closestDataRange * 5, dataMax - dataMin);
				}
			}
			
			// if minRange is exceeded, adjust
			if (max - min < minRange) {

				zoomOffset = (minRange - max + min) / 2;

				// if min and max options have been set, don't go beyond it
				minArgs = [min - zoomOffset, pick(options.min, min - zoomOffset)];
				if (spaceAvailable) { // if space is available, stay within the data range
					minArgs[2] = dataMin;
				}
				min = arrayMax(minArgs);

				maxArgs = [min + minRange, pick(options.max, min + minRange)];
				if (spaceAvailable) { // if space is availabe, stay within the data range
					maxArgs[2] = dataMax;
				}
				
				max = arrayMin(maxArgs);

				// now if the max is adjusted, adjust the min back
				if (max - min < minRange) {
					minArgs[0] = max - minRange;
					minArgs[1] = pick(options.min, max - minRange);
					min = arrayMax(minArgs);
				}
			}
		}

		/**
		 * Set the tick positions to round values and optionally extend the extremes
		 * to the nearest tick
		 */
		function setTickPositions(secondPass) {

			var length,
				linkedParentExtremes,
				tickIntervalOption = options.tickInterval,
				tickPixelIntervalOption = options.tickPixelInterval;

			// linked axis gets the extremes from the parent axis
			if (isLinked) {
				linkedParent = chart[isXAxis ? 'xAxis' : 'yAxis'][options.linkedTo];
				linkedParentExtremes = linkedParent.getExtremes();
				min = pick(linkedParentExtremes.min, linkedParentExtremes.dataMin);
				max = pick(linkedParentExtremes.max, linkedParentExtremes.dataMax);
				if (options.type !== linkedParent.options.type) {
					error(11, 1); // Can't link axes of different type
				}
			} else { // initial min and max from the extreme data values
				min = pick(userMin, options.min, dataMin);
				max = pick(userMax, options.max, dataMax);
			}

			if (isLog) {
				if (!secondPass && mathMin(min, dataMin) <= 0) {
					error(10, 1); // Can't plot negative values on log axis
				}
				min = log2lin(min);
				max = log2lin(max);
			}

			// handle zoomed range
			if (range) {
				userMin = min = mathMax(min, max - range); // #618
				userMax = max;
				if (secondPass) {
					range = null;  // don't use it when running setExtremes
				}
			}

			// adjust min and max for the minimum range
			adjustForMinRange();

			// pad the values to get clear of the chart's edges
			if (!categories && !usePercentage && !isLinked && defined(min) && defined(max)) {
				length = (max - min) || 1;
				if (!defined(options.min) && !defined(userMin) && minPadding && (dataMin < 0 || !ignoreMinPadding)) {
					min -= length * minPadding;
				}
				if (!defined(options.max) && !defined(userMax)  && maxPadding && (dataMax > 0 || !ignoreMaxPadding)) {
					max += length * maxPadding;
				}
			}

			// get tickInterval
			if (min === max || min === undefined || max === undefined) {
				tickInterval = 1;
			} else if (isLinked && !tickIntervalOption &&
					tickPixelIntervalOption === linkedParent.options.tickPixelInterval) {
				tickInterval = linkedParent.tickInterval;
			} else {
				tickInterval = pick(
					tickIntervalOption,
					categories ? // for categoried axis, 1 is default, for linear axis use tickPix
						1 :
						(max - min) * tickPixelIntervalOption / (axisLength || 1)
				);
			}

			// Now we're finished detecting min and max, crop and group series data. This
			// is in turn needed in order to find tick positions in ordinal axes. 
			if (isXAxis && !secondPass) {
				each(axis.series, function (series) {
					series.processData(min !== oldMin || max !== oldMax);             
				});
			}

			// set the translation factor used in translate function
			setAxisTranslation();

			// hook for ordinal axes. To do: merge with below
			if (axis.beforeSetTickPositions) {
				axis.beforeSetTickPositions();
			}
			
			// hook for extensions, used in Highstock ordinal axes
			if (axis.postProcessTickInterval) {
				tickInterval = axis.postProcessTickInterval(tickInterval);				
			}

			// for linear axes, get magnitude and normalize the interval
			if (!isDatetimeAxis && !isLog) { // linear
				magnitude = math.pow(10, mathFloor(math.log(tickInterval) / math.LN10));
				if (!defined(options.tickInterval)) {
					tickInterval = normalizeTickInterval(tickInterval, null, magnitude, options);
				}
			}

			// record the tick interval for linked axis
			axis.tickInterval = tickInterval;

			// get minorTickInterval
			minorTickInterval = options.minorTickInterval === 'auto' && tickInterval ?
					tickInterval / 5 : options.minorTickInterval;

			// find the tick positions
			tickPositions = options.tickPositions || (tickPositioner && tickPositioner.apply(axis, [min, max]));
			if (!tickPositions) {
				if (isDatetimeAxis) {
					tickPositions = (axis.getNonLinearTimeTicks || getTimeTicks)(
						normalizeTimeTickInterval(tickInterval, options.units),
						min,
						max,
						options.startOfWeek,
						axis.ordinalPositions,
						axis.closestPointRange,
						true
					);
				} else if (isLog) {
					tickPositions = getLogTickPositions(tickInterval, min, max);
				} else {
					tickPositions = getLinearTickPositions(tickInterval, min, max);
				}
			}

			if (!isLinked) {

				// reset min/max or remove extremes based on start/end on tick
				var roundedMin = tickPositions[0],
					roundedMax = tickPositions[tickPositions.length - 1];

				if (options.startOnTick) {
					min = roundedMin;
				} else if (min > roundedMin) {
					tickPositions.shift();
				}

				if (options.endOnTick) {
					max = roundedMax;
				} else if (max < roundedMax) {
					tickPositions.pop();
				}

				// record the greatest number of ticks for multi axis
				if (!maxTicks) { // first call, or maxTicks have been reset after a zoom operation
					maxTicks = {
						x: 0,
						y: 0
					};
				}

				if (!isDatetimeAxis && tickPositions.length > maxTicks[xOrY] && options.alignTicks !== false) {
					maxTicks[xOrY] = tickPositions.length;
				}
			}
		}

		/**
		 * When using multiple axes, adjust the number of ticks to match the highest
		 * number of ticks in that group
		 */
		function adjustTickAmount() {

			if (maxTicks && maxTicks[xOrY] && !isDatetimeAxis && !categories && !isLinked && options.alignTicks !== false) { // only apply to linear scale
				var oldTickAmount = tickAmount,
					calculatedTickAmount = tickPositions.length;

				// set the axis-level tickAmount to use below
				tickAmount = maxTicks[xOrY];

				if (calculatedTickAmount < tickAmount) {
					while (tickPositions.length < tickAmount) {
						tickPositions.push(correctFloat(
							tickPositions[tickPositions.length - 1] + tickInterval
						));
					}
					transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
					max = tickPositions[tickPositions.length - 1];

				}
				if (defined(oldTickAmount) && tickAmount !== oldTickAmount) {
					axis.isDirty = true;
				}
			}


		}

		/**
		 * Set the scale based on data min and max, user set min and max or options
		 *
		 */
		function setScale() {
			var type,
				i,
				isDirtyData,
				isDirtyAxisLength;
				
			oldMin = min;
			oldMax = max;
			oldAxisLength = axisLength;

			// set the new axisLength
			axisLength = horiz ? axisWidth : axisHeight;
			isDirtyAxisLength = axisLength !== oldAxisLength;

			// is there new data?
			each(axis.series, function (series) {
				if (series.isDirtyData || series.isDirty ||
						series.xAxis.isDirty) { // when x axis is dirty, we need new data extremes for y as well
					isDirtyData = true;
				}
			});

			// do we really need to go through all this?
			if (isDirtyAxisLength || isDirtyData || isLinked ||
				userMin !== oldUserMin || userMax !== oldUserMax) {

				// get data extremes if needed
				getSeriesExtremes();

				// get fixed positions based on tickInterval
				setTickPositions();

				// record old values to decide whether a rescale is necessary later on (#540)
				oldUserMin = userMin;
				oldUserMax = userMax;

				// reset stacks
				if (!isXAxis) {
					for (type in stacks) {
						for (i in stacks[type]) {
							stacks[type][i].cum = stacks[type][i].total;
						}
					}
				}

				// Mark as dirty if it is not already set to dirty and extremes have changed. #595.
				if (!axis.isDirty) {
					axis.isDirty = isDirtyAxisLength || min !== oldMin || max !== oldMax;
				}
			}
		}

		/**
		 * Set the extremes and optionally redraw
		 * @param {Number} newMin
		 * @param {Number} newMax
		 * @param {Boolean} redraw
		 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
		 *    configuration
		 * @param {Object} eventArguments 
		 *
		 */
		function setExtremes(newMin, newMax, redraw, animation, eventArguments) {

			redraw = pick(redraw, true); // defaults to true
			
			// Extend the arguments with min and max
			eventArguments = extend(eventArguments, {
				min: newMin,
				max: newMax
			});

			// Fire the event
			fireEvent(axis, 'setExtremes', eventArguments, function () { // the default event handler

				userMin = newMin;
				userMax = newMax;
				
				// Mark for running afterSetExtremes
				axis.isDirtyExtremes = true;
				
				// redraw
				if (redraw) {
					chart.redraw(animation);
				}
			});
		}
		
		/**
		 * Update translation information
		 */
		setAxisTranslation = function () {
			var range = max - min,
				pointRange = 0,
				closestPointRange,
				seriesClosestPointRange;
			
			// adjust translation for padding
			if (isXAxis) {
				if (isLinked) {
					pointRange = linkedParent.pointRange;
				} else {
					each(axis.series, function (series) {
						pointRange = mathMax(pointRange, series.pointRange);
						seriesClosestPointRange = series.closestPointRange;
						if (!series.noSharedTooltip && defined(seriesClosestPointRange)) {
							closestPointRange = defined(closestPointRange) ?
								mathMin(closestPointRange, seriesClosestPointRange) :
								seriesClosestPointRange;
						}
					});
				}
				
				// pointRange means the width reserved for each point, like in a column chart
				axis.pointRange = pointRange;

				// closestPointRange means the closest distance between points. In columns
				// it is mostly equal to pointRange, but in lines pointRange is 0 while closestPointRange
				// is some other value
				axis.closestPointRange = closestPointRange;
			}

			// secondary values
			oldTransA = transA;
			axis.translationSlope = transA = axisLength / ((range + pointRange) || 1);
			transB = horiz ? axisLeft : axisBottom; // translation addend
			minPixelPadding = transA * (pointRange / 2);
		};

		/**
		 * Update the axis metrics
		 */
		function setAxisSize() {

			var offsetLeft = options.offsetLeft || 0,
				offsetRight = options.offsetRight || 0;

			// basic values
			axisLeft = pick(options.left, plotLeft + offsetLeft);
			axisTop = pick(options.top, plotTop);
			axisWidth = pick(options.width, plotWidth - offsetLeft + offsetRight);
			axisHeight = pick(options.height, plotHeight);
			axisBottom = chartHeight - axisHeight - axisTop;
			axisRight = chartWidth - axisWidth - axisLeft;
			axisLength = horiz ? axisWidth : axisHeight;

			// expose to use in Series object and navigator
			axis.left = axisLeft;
			axis.top = axisTop;
			axis.len = axisLength;

		}

		/**
		 * Get the actual axis extremes
		 */
		function getExtremes() {
			return {
				min: isLog ? correctFloat(lin2log(min)) : min,
				max: isLog ? correctFloat(lin2log(max)) : max,
				dataMin: dataMin,
				dataMax: dataMax,
				userMin: userMin,
				userMax: userMax
			};
		}

		/**
		 * Get the zero plane either based on zero or on the min or max value.
		 * Used in bar and area plots
		 */
		function getThreshold(threshold) {
			var realMin = isLog ? lin2log(min) : min,
				realMax = isLog ? lin2log(max) : max;
			
			if (realMin > threshold || threshold === null) {
				threshold = realMin;
			} else if (realMax < threshold) {
				threshold = realMax;
			}

			return translate(threshold, 0, 1, 0, 1);
		}

		/**
		 * Add a plot band or plot line after render time
		 *
		 * @param options {Object} The plotBand or plotLine configuration object
		 */
		function addPlotBandOrLine(options) {
			var obj = new PlotLineOrBand(options).render();
			plotLinesAndBands.push(obj);
			return obj;
		}

		/**
		 * Render the tick labels to a preliminary position to get their sizes
		 */
		function getOffset() {

			var hasData = axis.series.length && defined(min) && defined(max),
				showAxis = hasData || pick(options.showEmpty, true),
				titleOffset = 0,
				titleOffsetOption,
				titleMargin = 0,
				axisTitleOptions = options.title,
				labelOptions = options.labels,
				directionFactor = [-1, 1, 1, -1][side],
				n;

			if (!axisGroup) {
				axisGroup = renderer.g('axis')
					.attr({ zIndex: 7 })
					.add();
				gridGroup = renderer.g('grid')
					.attr({ zIndex: options.gridZIndex || 1 })
					.add();
			}

			labelOffset = 0; // reset

			if (hasData || isLinked) {
				each(tickPositions, function (pos) {
					if (!ticks[pos]) {
						ticks[pos] = new Tick(pos);
					} else {
						ticks[pos].addLabel(); // update labels depending on tick interval
					}

				});

				each(tickPositions, function (pos) {
					// left side must be align: right and right side must have align: left for labels
					if (side === 0 || side === 2 || { 1: 'left', 3: 'right' }[side] === labelOptions.align) {

						// get the highest offset
						labelOffset = mathMax(
							ticks[pos].getLabelSize(),
							labelOffset
						);
					}

				});

				if (staggerLines) {
					labelOffset += (staggerLines - 1) * 16;
				}

			} else { // doesn't have data
				for (n in ticks) {
					ticks[n].destroy();
					delete ticks[n];
				}
			}

			if (axisTitleOptions && axisTitleOptions.text) {
				if (!axisTitle) {
					axisTitle = axis.axisTitle = renderer.text(
						axisTitleOptions.text,
						0,
						0,
						axisTitleOptions.useHTML
					)
					.attr({
						zIndex: 7,
						rotation: axisTitleOptions.rotation || 0,
						align:
							axisTitleOptions.textAlign ||
							{ low: 'left', middle: 'center', high: 'right' }[axisTitleOptions.align]
					})
					.css(axisTitleOptions.style)
					.add();
					axisTitle.isNew = true;
				}

				if (showAxis) {
					titleOffset = axisTitle.getBBox()[horiz ? 'height' : 'width'];
					titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);
					titleOffsetOption = axisTitleOptions.offset;
				}

				// hide or show the title depending on whether showEmpty is set
				axisTitle[showAxis ? 'show' : 'hide']();


			}

			// handle automatic or user set offset
			offset = directionFactor * pick(options.offset, axisOffset[side]);

			axisTitleMargin =
				pick(titleOffsetOption,
					labelOffset + titleMargin +
					(side !== 2 && labelOffset && directionFactor * options.labels[horiz ? 'y' : 'x'])
				);

			axisOffset[side] = mathMax(
				axisOffset[side],
				axisTitleMargin + titleOffset + directionFactor * offset
			);

		}

		/**
		 * Render the axis
		 */
		function render() {
			var axisTitleOptions = options.title,
				stackLabelOptions = options.stackLabels,
				alternateGridColor = options.alternateGridColor,
				lineWidth = options.lineWidth,
				lineLeft,
				lineTop,
				linePath,
				hasRendered = chart.hasRendered,
				slideInTicks = hasRendered && defined(oldMin) && !isNaN(oldMin),
				hasData = axis.series.length && defined(min) && defined(max),
				showAxis = hasData || pick(options.showEmpty, true),
				from,
				to;

			// If the series has data draw the ticks. Else only the line and title
			if (hasData || isLinked) {

				// minor ticks
				if (minorTickInterval && !categories) {
					each(getMinorTickPositions(), function (pos) {
						if (!minorTicks[pos]) {
							minorTicks[pos] = new Tick(pos, 'minor');
						}

						// render new ticks in old position
						if (slideInTicks && minorTicks[pos].isNew) {
							minorTicks[pos].render(null, true);
						}


						minorTicks[pos].isActive = true;
						minorTicks[pos].render();
					});
				}

				// Major ticks. Pull out the first item and render it last so that
				// we can get the position of the neighbour label. #808.
				each(tickPositions.slice(1).concat([tickPositions[0]]), function (pos, i) {
					
					// Reorganize the indices
					i = (i === tickPositions.length - 1) ? 0 : i + 1;
					
					// linked axes need an extra check to find out if
					if (!isLinked || (pos >= min && pos <= max)) {

						if (!ticks[pos]) {
							ticks[pos] = new Tick(pos);
						}

						// render new ticks in old position
						if (slideInTicks && ticks[pos].isNew) {
							ticks[pos].render(i, true);
						}

						ticks[pos].isActive = true;
						ticks[pos].render(i);
					}

				});

				// alternate grid color
				if (alternateGridColor) {
					each(tickPositions, function (pos, i) {
						if (i % 2 === 0 && pos < max) {
							if (!alternateBands[pos]) {
								alternateBands[pos] = new PlotLineOrBand();
							}
							from = pos;
							to = tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : max;
							alternateBands[pos].options = {
								from: isLog ? lin2log(from) : from,
								to: isLog ? lin2log(to) : to,
								color: alternateGridColor
							};
							alternateBands[pos].render();
							alternateBands[pos].isActive = true;
						}
					});
				}

				// custom plot lines and bands
				if (!axis._addedPlotLB) { // only first time
					each((options.plotLines || []).concat(options.plotBands || []), function (plotLineOptions) {
						//plotLinesAndBands.push(new PlotLineOrBand(plotLineOptions).render());
						addPlotBandOrLine(plotLineOptions);
					});
					axis._addedPlotLB = true;
				}



			} // end if hasData

			// remove inactive ticks
			each([ticks, minorTicks, alternateBands], function (coll) {
				var pos;
				for (pos in coll) {
					if (!coll[pos].isActive) {
						coll[pos].destroy();
						delete coll[pos];
					} else {
						coll[pos].isActive = false; // reset
					}
				}
			});




			// Static items. As the axis group is cleared on subsequent calls
			// to render, these items are added outside the group.
			// axis line
			if (lineWidth) {
				lineLeft = axisLeft + (opposite ? axisWidth : 0) + offset;
				lineTop = chartHeight - axisBottom - (opposite ? axisHeight : 0) + offset;

				linePath = renderer.crispLine([
						M,
						horiz ?
							axisLeft :
							lineLeft,
						horiz ?
							lineTop :
							axisTop,
						L,
						horiz ?
							chartWidth - axisRight :
							lineLeft,
						horiz ?
							lineTop :
							chartHeight - axisBottom
					], lineWidth);
				if (!axisLine) {
					axisLine = renderer.path(linePath)
						.attr({
							stroke: options.lineColor,
							'stroke-width': lineWidth,
							zIndex: 7
						})
						.add();
				} else {
					axisLine.animate({ d: linePath });
				}

				// show or hide the line depending on options.showEmpty
				axisLine[showAxis ? 'show' : 'hide']();

			}

			if (axisTitle && showAxis) {
				// compute anchor points for each of the title align options
				var margin = horiz ? axisLeft : axisTop,
					fontSize = pInt(axisTitleOptions.style.fontSize || 12),
				// the position in the length direction of the axis
				alongAxis = {
					low: margin + (horiz ? 0 : axisLength),
					middle: margin + axisLength / 2,
					high: margin + (horiz ? axisLength : 0)
				}[axisTitleOptions.align],

				// the position in the perpendicular direction of the axis
				offAxis = (horiz ? axisTop + axisHeight : axisLeft) +
					(horiz ? 1 : -1) * // horizontal axis reverses the margin
					(opposite ? -1 : 1) * // so does opposite axes
					axisTitleMargin +
					(side === 2 ? fontSize : 0);

				axisTitle[axisTitle.isNew ? 'attr' : 'animate']({
					x: horiz ?
						alongAxis :
						offAxis + (opposite ? axisWidth : 0) + offset +
							(axisTitleOptions.x || 0), // x
					y: horiz ?
						offAxis - (opposite ? axisHeight : 0) + offset :
						alongAxis + (axisTitleOptions.y || 0) // y
				});
				axisTitle.isNew = false;
			}

			// Stacked totals:
			if (stackLabelOptions && stackLabelOptions.enabled) {
				var stackKey, oneStack, stackCategory,
					stackTotalGroup = axis.stackTotalGroup;

				// Create a separate group for the stack total labels
				if (!stackTotalGroup) {
					axis.stackTotalGroup = stackTotalGroup =
						renderer.g('stack-labels')
							.attr({
								visibility: VISIBLE,
								zIndex: 6
							})
							.translate(plotLeft, plotTop)
							.add();
				}

				// Render each stack total
				for (stackKey in stacks) {
					oneStack = stacks[stackKey];
					for (stackCategory in oneStack) {
						oneStack[stackCategory].render(stackTotalGroup);
					}
				}
			}
			// End stacked totals

			axis.isDirty = false;
		}

		/**
		 * Remove a plot band or plot line from the chart by id
		 * @param {Object} id
		 */
		function removePlotBandOrLine(id) {
			var i = plotLinesAndBands.length;
			while (i--) {
				if (plotLinesAndBands[i].id === id) {
					plotLinesAndBands[i].destroy();
				}
			}
		}
		
		/**
		 * Update the axis title by options
		 */
		function setTitle(newTitleOptions, redraw) {
			options.title = merge(options.title, newTitleOptions);
			
			axisTitle = axisTitle.destroy();
			axis.isDirty = true;
			
			if (pick(redraw, true)) {
				chart.redraw();
			}
		}

		/**
		 * Redraw the axis to reflect changes in the data or axis extremes
		 */
		function redraw() {

			// hide tooltip and hover states
			if (tracker.resetTracker) {
				tracker.resetTracker();
			}

			// render the axis
			render();

			// move plot lines and bands
			each(plotLinesAndBands, function (plotLine) {
				plotLine.render();
			});

			// mark associated series as dirty and ready for redraw
			each(axis.series, function (series) {
				series.isDirty = true;
			});

		}

		/**
		 * Set new axis categories and optionally redraw
		 * @param {Array} newCategories
		 * @param {Boolean} doRedraw
		 */
		function setCategories(newCategories, doRedraw) {
				// set the categories
				axis.categories = userOptions.categories = categories = newCategories;

				// force reindexing tooltips
				each(axis.series, function (series) {
					series.translate();
					series.setTooltipPoints(true);
				});


				// optionally redraw
				axis.isDirty = true;

				if (pick(doRedraw, true)) {
					chart.redraw();
				}
		}

		/**
		 * Destroys an Axis instance.
		 */
		function destroy() {
			var stackKey;

			// Remove the events
			removeEvent(axis);

			// Destroy each stack total
			for (stackKey in stacks) {
				destroyObjectProperties(stacks[stackKey]);

				stacks[stackKey] = null;
			}

			// Destroy stack total group
			if (axis.stackTotalGroup) {
				axis.stackTotalGroup = axis.stackTotalGroup.destroy();
			}

			// Destroy collections
			each([ticks, minorTicks, alternateBands, plotLinesAndBands], function (coll) {
				destroyObjectProperties(coll);
			});

			// Destroy local variables
			each([axisLine, axisGroup, gridGroup, axisTitle], function (obj) {
				if (obj) {
					obj.destroy();
				}
			});
			axisLine = axisGroup = gridGroup = axisTitle = null;
		}


		// Run Axis

		// Register
		axes.push(axis);
		chart[isXAxis ? 'xAxis' : 'yAxis'].push(axis);

		// inverted charts have reversed xAxes as default
		if (inverted && isXAxis && reversed === UNDEFINED) {
			reversed = true;
		}


		// expose some variables
		extend(axis, {
			addPlotBand: addPlotBandOrLine,
			addPlotLine: addPlotBandOrLine,
			adjustTickAmount: adjustTickAmount,
			categories: categories,
			getExtremes: getExtremes,
			getPlotLinePath: getPlotLinePath,
			getThreshold: getThreshold,
			isXAxis: isXAxis,
			options: options,
			plotLinesAndBands: plotLinesAndBands,
			getOffset: getOffset,
			render: render,
			setAxisSize: setAxisSize,
			setAxisTranslation: setAxisTranslation,
			setCategories: setCategories,
			setExtremes: setExtremes,
			setScale: setScale,
			setTickPositions: setTickPositions,
			translate: translate,
			redraw: redraw,
			removePlotBand: removePlotBandOrLine,
			removePlotLine: removePlotBandOrLine,
			reversed: reversed,
			setTitle: setTitle,
			series: [], // populated by Series
			stacks: stacks,
			destroy: destroy
		});

		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}

		// extend logarithmic axis
		if (isLog) {
			axis.val2lin = log2lin;
			axis.lin2val = lin2log;
		}

	} // end Axis


	/**
	 * The tooltip object
	 * @param {Object} options Tooltip options
	 */
	function Tooltip(options) {
		var currentSeries,
			borderWidth = options.borderWidth,
			crosshairsOptions = options.crosshairs,
			crosshairs = [],
			style = options.style,
			shared = options.shared,
			padding = pInt(style.padding),
			tooltipIsHidden = true,
			currentX = 0,
			currentY = 0;

		// remove padding CSS and apply padding on box instead
		style.padding = 0;

		// create the label
		var label = renderer.label('', 0, 0, null, null, null, options.useHTML)
			.attr({
				padding: padding,
				fill: options.backgroundColor,
				'stroke-width': borderWidth,
				r: options.borderRadius,
				zIndex: 8
			})
			.css(style)
			.hide()
			.add();

		// When using canVG the shadow shows up as a gray circle
		// even if the tooltip is hidden.
		if (!useCanVG) {
			label.shadow(options.shadow);
		}

		/**
		 * Destroy the tooltip and its elements.
		 */
		function destroy() {
			each(crosshairs, function (crosshair) {
				if (crosshair) {
					crosshair.destroy();
				}
			});

			// Destroy and clear local variables
			if (label) {
				label = label.destroy();
			}
		}

		/**
		 * In case no user defined formatter is given, this will be used
		 */
		function defaultFormatter() {
			var pThis = this,
				items = pThis.points || splat(pThis),
				series = items[0].series,
				s;

			// build the header
			s = [series.tooltipHeaderFormatter(items[0].key)];

			// build the values
			each(items, function (item) {
				series = item.series;
				s.push((series.tooltipFormatter && series.tooltipFormatter(item)) ||
					item.point.tooltipFormatter(series.tooltipOptions.pointFormat));
			});
			
			// footer
			s.push(options.footerFormat || '');
			
			return s.join('');
		}

		/**
		 * Provide a soft movement for the tooltip
		 *
		 * @param {Number} finalX
		 * @param {Number} finalY
		 */
		function move(finalX, finalY) {

			// get intermediate values for animation
			currentX = tooltipIsHidden ? finalX : (2 * currentX + finalX) / 3;
			currentY = tooltipIsHidden ? finalY : (currentY + finalY) / 2;

			// move to the intermediate value
			label.attr({ x: currentX, y: currentY });

			// run on next tick of the mouse tracker
			if (mathAbs(finalX - currentX) > 1 || mathAbs(finalY - currentY) > 1) {
				tooltipTick = function () {
					move(finalX, finalY);
				};
			} else {
				tooltipTick = null;
			}
		}

		/**
		 * Hide the tooltip
		 */
		function hide() {
			if (!tooltipIsHidden) {
				var hoverPoints = chart.hoverPoints;

				label.hide();

				// hide previous hoverPoints and set new
				if (hoverPoints) {
					each(hoverPoints, function (point) {
						point.setState();
					});
				}
				chart.hoverPoints = null;


				tooltipIsHidden = true;
			}

		}

		/**
		 * Hide the crosshairs
		 */
		function hideCrosshairs() {
			each(crosshairs, function (crosshair) {
				if (crosshair) {
					crosshair.hide();
				}
			});
		}

		/**
		 * Refresh the tooltip's text and position.
		 * @param {Object} point
		 *
		 */
		function refresh(point) {
			var x,
				y,
				show,
				plotX,
				plotY,
				textConfig = {},
				text,
				pointConfig = [],
				tooltipPos = point.tooltipPos,
				formatter = options.formatter || defaultFormatter,
				hoverPoints = chart.hoverPoints,
				placedTooltipPoint,
				borderColor;

			// shared tooltip, array is sent over
			if (shared && !(point.series && point.series.noSharedTooltip)) {
				plotY = 0;

				// hide previous hoverPoints and set new
				if (hoverPoints) {
					each(hoverPoints, function (point) {
						point.setState();
					});
				}
				chart.hoverPoints = point;

				each(point, function (item) {
					item.setState(HOVER_STATE);
					plotY += item.plotY; // for average

					pointConfig.push(item.getLabelConfig());
				});

				plotX = point[0].plotX;
				plotY = mathRound(plotY) / point.length; // mathRound because Opera 10 has problems here

				textConfig = {
					x: point[0].category
				};
				textConfig.points = pointConfig;
				point = point[0];

			// single point tooltip
			} else {
				textConfig = point.getLabelConfig();
			}
			text = formatter.call(textConfig);

			// register the current series
			currentSeries = point.series;

			// get the reference point coordinates (pie charts use tooltipPos)
			plotX = pick(plotX, point.plotX);
			plotY = pick(plotY, point.plotY);

			x = mathRound(tooltipPos ? tooltipPos[0] : (inverted ? plotWidth - plotY : plotX));
			y = mathRound(tooltipPos ? tooltipPos[1] : (inverted ? plotHeight - plotX : plotY));


			// For line type series, hide tooltip if the point falls outside the plot
			show = shared || !currentSeries.isCartesian || currentSeries.tooltipOutsidePlot || isInsidePlot(x, y);

			// update the inner HTML
			if (text === false || !show) {
				hide();
			} else {

				// show it
				if (tooltipIsHidden) {
					label.show();
					tooltipIsHidden = false;
				}

				// update text
				label.attr({
					text: text
				});

				// set the stroke color of the box
				borderColor = options.borderColor || point.color || currentSeries.color || '#606060';
				label.attr({
					stroke: borderColor
				});

				placedTooltipPoint = placeBox(
					label.width,
					label.height,
					plotLeft,
					plotTop,
					plotWidth,
					plotHeight,
					{x: x, y: y},
					pick(options.distance, 12),
					inverted
				);

				// do the move
				move(mathRound(placedTooltipPoint.x), mathRound(placedTooltipPoint.y));
			}


			// crosshairs
			if (crosshairsOptions) {
				crosshairsOptions = splat(crosshairsOptions); // [x, y]

				var path,
					i = crosshairsOptions.length,
					attribs,
					axis;

				while (i--) {
					axis = point.series[i ? 'yAxis' : 'xAxis'];
					if (crosshairsOptions[i] && axis) {
						path = axis.getPlotLinePath(
							i ? pick(point.stackY, point.y) : point.x, // #814 
							1
						);
						if (crosshairs[i]) {
							crosshairs[i].attr({ d: path, visibility: VISIBLE });

						} else {
							attribs = {
								'stroke-width': crosshairsOptions[i].width || 1,
								stroke: crosshairsOptions[i].color || '#C0C0C0',
								zIndex: crosshairsOptions[i].zIndex || 2
							};
							if (crosshairsOptions[i].dashStyle) {
								attribs.dashstyle = crosshairsOptions[i].dashStyle;
							}
							crosshairs[i] = renderer.path(path)
								.attr(attribs)
								.add();
						}
					}
				}
			}
			fireEvent(chart, 'tooltipRefresh', {
					text: text,
					x: x + plotLeft,
					y: y + plotTop,
					borderColor: borderColor
				});
		}



		// public members
		return {
			shared: shared,
			refresh: refresh,
			hide: hide,
			hideCrosshairs: hideCrosshairs,
			destroy: destroy
		};
	}

	/**
	 * The mouse tracker object
	 * @param {Object} options
	 */
	function MouseTracker(options) {


		var mouseDownX,
			mouseDownY,
			hasDragged,
			selectionMarker,
			zoomType = useCanVG ? '' : optionsChart.zoomType,
			zoomX = /x/.test(zoomType),
			zoomY = /y/.test(zoomType),
			zoomHor = (zoomX && !inverted) || (zoomY && inverted),
			zoomVert = (zoomY && !inverted) || (zoomX && inverted);

		/**
		 * Add crossbrowser support for chartX and chartY
		 * @param {Object} e The event object in standard browsers
		 */
		function normalizeMouseEvent(e) {
			var ePos,
				chartPosLeft,
				chartPosTop,
				chartX,
				chartY;

			// common IE normalizing
			e = e || win.event;
			if (!e.target) {
				e.target = e.srcElement;
			}

			// jQuery only copies over some properties. IE needs e.x and iOS needs touches.
			if (e.originalEvent) {
				e = e.originalEvent;
			}

			// The same for MooTools. It renames e.pageX to e.page.x. #445.
			if (e.event) {
				e = e.event;
			}

			// iOS
			ePos = e.touches ? e.touches.item(0) : e;

			// get mouse position
			chartPosition = offset(container);
			chartPosLeft = chartPosition.left;
			chartPosTop = chartPosition.top;

			// chartX and chartY
			if (isIE) { // IE including IE9 that has pageX but in a different meaning
				chartX = e.x;
				chartY = e.y;
			} else {
				chartX = ePos.pageX - chartPosLeft;
				chartY = ePos.pageY - chartPosTop;
			}

			return extend(e, {
				chartX: mathRound(chartX),
				chartY: mathRound(chartY)
			});
		}

		/**
		 * Get the click position in terms of axis values.
		 *
		 * @param {Object} e A mouse event
		 */
		function getMouseCoordinates(e) {
			var coordinates = {
				xAxis: [],
				yAxis: []
			};
			each(axes, function (axis) {
				var translate = axis.translate,
					isXAxis = axis.isXAxis,
					isHorizontal = inverted ? !isXAxis : isXAxis;

				coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
					axis: axis,
					value: translate(
						isHorizontal ?
							e.chartX - plotLeft  :
							plotHeight - e.chartY + plotTop,
						true
					)
				});
			});
			return coordinates;
		}

		/**
		 * With line type charts with a single tracker, get the point closest to the mouse
		 */
		function onmousemove(e) {
			var point,
				points,
				hoverPoint = chart.hoverPoint,
				hoverSeries = chart.hoverSeries,
				i,
				j,
				distance = chartWidth,
				index = inverted ? e.chartY : e.chartX - plotLeft; // wtf?

			// shared tooltip
			if (tooltip && options.shared && !(hoverSeries && hoverSeries.noSharedTooltip)) {
				points = [];

				// loop over all series and find the ones with points closest to the mouse
				i = series.length;
				for (j = 0; j < i; j++) {
					if (series[j].visible &&
							series[j].options.enableMouseTracking !== false &&
							!series[j].noSharedTooltip && series[j].tooltipPoints.length) {
						point = series[j].tooltipPoints[index];
						point._dist = mathAbs(index - point.plotX);
						distance = mathMin(distance, point._dist);
						points.push(point);
					}
				}
				// remove furthest points
				i = points.length;
				while (i--) {
					if (points[i]._dist > distance) {
						points.splice(i, 1);
					}
				}
				// refresh the tooltip if necessary
				if (points.length && (points[0].plotX !== hoverX)) {
					tooltip.refresh(points);
					hoverX = points[0].plotX;
				}
			}

			// separate tooltip and general mouse events
			if (hoverSeries && hoverSeries.tracker) { // only use for line-type series with common tracker

				// get the point
				point = hoverSeries.tooltipPoints[index];

				// a new point is hovered, refresh the tooltip
				if (point && point !== hoverPoint) {

					// trigger the events
					point.onMouseOver();

				}
			}
		}



		/**
		 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
		 */
		function resetTracker() {
			var hoverSeries = chart.hoverSeries,
				hoverPoint = chart.hoverPoint;

			if (hoverPoint) {
				hoverPoint.onMouseOut();
			}

			if (hoverSeries) {
				hoverSeries.onMouseOut();
			}

			if (tooltip) {
				tooltip.hide();
				tooltip.hideCrosshairs();
			}

			hoverX = null;
		}

		/**
		 * Mouse up or outside the plot area
		 */
		function drop() {
			if (selectionMarker) {
				var selectionData = {
						xAxis: [],
						yAxis: []
					},
					selectionBox = selectionMarker.getBBox(),
					selectionLeft = selectionBox.x - plotLeft,
					selectionTop = selectionBox.y - plotTop;


				// a selection has been made
				if (hasDragged) {

					// record each axis' min and max
					each(axes, function (axis) {
						if (axis.options.zoomEnabled !== false) {
							var translate = axis.translate,
								isXAxis = axis.isXAxis,
								isHorizontal = inverted ? !isXAxis : isXAxis,
								selectionMin = translate(
									isHorizontal ?
										selectionLeft :
										plotHeight - selectionTop - selectionBox.height,
									true,
									0,
									0,
									1
								),
								selectionMax = translate(
									isHorizontal ?
										selectionLeft + selectionBox.width :
										plotHeight - selectionTop,
									true,
									0,
									0,
									1
								);

								selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
									axis: axis,
									min: mathMin(selectionMin, selectionMax), // for reversed axes,
									max: mathMax(selectionMin, selectionMax)
								});
						}
					});
					fireEvent(chart, 'selection', selectionData, zoom);

				}
				selectionMarker = selectionMarker.destroy();
			}

			css(container, { cursor: 'auto' });

			chart.mouseIsDown = mouseIsDown = hasDragged = false;
			removeEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);

		}

		/**
		 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
		 */
		function hideTooltipOnMouseMove(e) {
			var pageX = defined(e.pageX) ? e.pageX : e.page.x, // In mootools the event is wrapped and the page x/y position is named e.page.x
				pageY = defined(e.pageX) ? e.pageY : e.page.y; // Ref: http://mootools.net/docs/core/Types/DOMEvent

			if (chartPosition &&
					!isInsidePlot(pageX - chartPosition.left - plotLeft,
						pageY - chartPosition.top - plotTop)) {
				resetTracker();
			}
		}

		/**
		 * When mouse leaves the container, hide the tooltip.
		 */
		function hideTooltipOnMouseLeave() {
			resetTracker();
			chartPosition = null; // also reset the chart position, used in #149 fix
		}

		/**
		 * Set the JS events on the container element
		 */
		function setDOMEvents() {
			var lastWasOutsidePlot = true;
			/*
			 * Record the starting position of a dragoperation
			 */
			container.onmousedown = function (e) {
				e = normalizeMouseEvent(e);

				// issue #295, dragging not always working in Firefox
				if (!hasTouch && e.preventDefault) {
					e.preventDefault();
				}

				// record the start position
				chart.mouseIsDown = mouseIsDown = true;
				chart.mouseDownX = mouseDownX = e.chartX;
				mouseDownY = e.chartY;

				addEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);
			};

			// The mousemove, touchmove and touchstart event handler
			var mouseMove = function (e) {

				// let the system handle multitouch operations like two finger scroll
				// and pinching
				if (e && e.touches && e.touches.length > 1) {
					return;
				}

				// normalize
				e = normalizeMouseEvent(e);
				if (!hasTouch) { // not for touch devices
					e.returnValue = false;
				}

				var chartX = e.chartX,
					chartY = e.chartY,
					isOutsidePlot = !isInsidePlot(chartX - plotLeft, chartY - plotTop);

				// on touch devices, only trigger click if a handler is defined
				if (hasTouch && e.type === 'touchstart') {
					if (attr(e.target, 'isTracker')) {
						if (!chart.runTrackerClick) {
							e.preventDefault();
						}
					} else if (!runChartClick && !isOutsidePlot) {
						e.preventDefault();
					}
				}

				// cancel on mouse outside
				if (isOutsidePlot) {

					/*if (!lastWasOutsidePlot) {
						// reset the tracker
						resetTracker();
					}*/

					// drop the selection if any and reset mouseIsDown and hasDragged
					//drop();
					if (chartX < plotLeft) {
						chartX = plotLeft;
					} else if (chartX > plotLeft + plotWidth) {
						chartX = plotLeft + plotWidth;
					}

					if (chartY < plotTop) {
						chartY = plotTop;
					} else if (chartY > plotTop + plotHeight) {
						chartY = plotTop + plotHeight;
					}

				}

				if (mouseIsDown && e.type !== 'touchstart') { // make selection

					// determine if the mouse has moved more than 10px
					hasDragged = Math.sqrt(
						Math.pow(mouseDownX - chartX, 2) +
						Math.pow(mouseDownY - chartY, 2)
					);
					if (hasDragged > 10) {
						var clickedInside = isInsidePlot(mouseDownX - plotLeft, mouseDownY - plotTop);

						// make a selection
						if (hasCartesianSeries && (zoomX || zoomY) && clickedInside) {
							if (!selectionMarker) {
								selectionMarker = renderer.rect(
									plotLeft,
									plotTop,
									zoomHor ? 1 : plotWidth,
									zoomVert ? 1 : plotHeight,
									0
								)
								.attr({
									fill: optionsChart.selectionMarkerFill || 'rgba(69,114,167,0.25)',
									zIndex: 7
								})
								.add();
							}
						}

						// adjust the width of the selection marker
						if (selectionMarker && zoomHor) {
							var xSize = chartX - mouseDownX;
							selectionMarker.attr({
								width: mathAbs(xSize),
								x: (xSize > 0 ? 0 : xSize) + mouseDownX
							});
						}
						// adjust the height of the selection marker
						if (selectionMarker && zoomVert) {
							var ySize = chartY - mouseDownY;
							selectionMarker.attr({
								height: mathAbs(ySize),
								y: (ySize > 0 ? 0 : ySize) + mouseDownY
							});
						}

						// panning
						if (clickedInside && !selectionMarker && optionsChart.panning) {
							chart.pan(chartX);
						}
					}

				} else if (!isOutsidePlot) {
					// show the tooltip
					onmousemove(e);
				}

				lastWasOutsidePlot = isOutsidePlot;

				// when outside plot, allow touch-drag by returning true
				return isOutsidePlot || !hasCartesianSeries;
			};

			/*
			 * When the mouse enters the container, run mouseMove
			 */
			container.onmousemove = mouseMove;

			/*
			 * When the mouse leaves the container, hide the tracking (tooltip).
			 */
			addEvent(container, 'mouseleave', hideTooltipOnMouseLeave);

			// issue #149 workaround
			// The mouseleave event above does not always fire. Whenever the mouse is moving
			// outside the plotarea, hide the tooltip
			addEvent(doc, 'mousemove', hideTooltipOnMouseMove);

			container.ontouchstart = function (e) {
				// For touch devices, use touchmove to zoom
				if (zoomX || zoomY) {
					container.onmousedown(e);
				}
				// Show tooltip and prevent the lower mouse pseudo event
				mouseMove(e);
			};

			/*
			 * Allow dragging the finger over the chart to read the values on touch
			 * devices
			 */
			container.ontouchmove = mouseMove;

			/*
			 * Allow dragging the finger over the chart to read the values on touch
			 * devices
			 */
			container.ontouchend = function () {
				if (hasDragged) {
					resetTracker();
				}
			};


			// MooTools 1.2.3 doesn't fire this in IE when using addEvent
			container.onclick = function (e) {
				var hoverPoint = chart.hoverPoint;
				e = normalizeMouseEvent(e);

				e.cancelBubble = true; // IE specific


				if (!hasDragged) {
					
					// Detect clicks on trackers or tracker groups, #783 
					if (hoverPoint && (attr(e.target, 'isTracker') || attr(e.target.parentNode, 'isTracker'))) {
						var plotX = hoverPoint.plotX,
							plotY = hoverPoint.plotY;

						// add page position info
						extend(hoverPoint, {
							pageX: chartPosition.left + plotLeft +
								(inverted ? plotWidth - plotY : plotX),
							pageY: chartPosition.top + plotTop +
								(inverted ? plotHeight - plotX : plotY)
						});

						// the series click event
						fireEvent(hoverPoint.series, 'click', extend(e, {
							point: hoverPoint
						}));

						// the point click event
						hoverPoint.firePointEvent('click', e);

					} else {
						extend(e, getMouseCoordinates(e));

						// fire a click event in the chart
						if (isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
							fireEvent(chart, 'click', e);
						}
					}


				}
				// reset mouseIsDown and hasDragged
				hasDragged = false;
			};

		}

		/**
		 * Destroys the MouseTracker object and disconnects DOM events.
		 */
		function destroy() {
			// Destroy the tracker group element
			if (chart.trackerGroup) {
				chart.trackerGroup = trackerGroup = chart.trackerGroup.destroy();
			}

			removeEvent(container, 'mouseleave', hideTooltipOnMouseLeave);
			removeEvent(doc, 'mousemove', hideTooltipOnMouseMove);
			container.onclick = container.onmousedown = container.onmousemove = container.ontouchstart = container.ontouchend = container.ontouchmove = null;
		}

		
		// Run MouseTracker
		
		if (!trackerGroup) {
			chart.trackerGroup = trackerGroup = renderer.g('tracker')
				.attr({ zIndex: 9 })
				.add();
		}
		
		if (options.enabled) {
			chart.tooltip = tooltip = Tooltip(options);

			// set the fixed interval ticking for the smooth tooltip
			tooltipInterval = setInterval(function () {
				if (tooltipTick) {
					tooltipTick();
				}
			}, 32);
		}

		setDOMEvents();

		// expose properties
		extend(this, {
			zoomX: zoomX,
			zoomY: zoomY,
			resetTracker: resetTracker,
			normalizeMouseEvent: normalizeMouseEvent,
			destroy: destroy
		});
	}



	/**
	 * The overview of the chart's series
	 */
	var Legend = function () {

		var options = chart.options.legend;

		if (!options.enabled) {
			return;
		}

		var horizontal = options.layout === 'horizontal',
			symbolWidth = options.symbolWidth,
			symbolPadding = options.symbolPadding,
			allItems,
			style = options.style,
			itemStyle = options.itemStyle,
			itemHoverStyle = options.itemHoverStyle,
			itemHiddenStyle = merge(itemStyle, options.itemHiddenStyle),
			padding = options.padding || pInt(style.padding),
			ltr = !options.rtl,
			itemMarginTop = options.itemMarginTop || 0,
			itemMarginBottom = options.itemMarginBottom || 0,
			y = 18,
			maxItemWidth = 0,
			initialItemX = 4 + padding + symbolWidth + symbolPadding,
			initialItemY = padding + itemMarginTop + y - 5, // 5 is the number of pixels above the text
			itemX,
			itemY,
			lastItemY,
			itemHeight = 0,
			box,
			legendBorderWidth = options.borderWidth,
			legendBackgroundColor = options.backgroundColor,
			legendGroup,
			offsetWidth,
			widthOption = options.width,
			series = chart.series,
			reversedLegend = options.reversed;



		/**
		 * Set the colors for the legend item
		 * @param {Object} item A Series or Point instance
		 * @param {Object} visible Dimmed or colored
		 */
		function colorizeItem(item, visible) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendSymbol = item.legendSymbol,
				hiddenColor = itemHiddenStyle.color,
				textColor = visible ? options.itemStyle.color : hiddenColor,
				symbolColor = visible ? item.color : hiddenColor;

			if (legendItem) {
				legendItem.css({ fill: textColor });
			}
			if (legendLine) {
				legendLine.attr({ stroke: symbolColor });
			}
			if (legendSymbol) {
				legendSymbol.attr({
					stroke: symbolColor,
					fill: symbolColor
				});
			}
		}

		/**
		 * Position the legend item
		 * @param {Object} item A Series or Point instance
		 * @param {Object} visible Dimmed or colored
		 */
		function positionItem(item) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendItemPos = item._legendItemPos,
				itemX = legendItemPos[0],
				itemY = legendItemPos[1],
				legendSymbol = item.legendSymbol,
				symbolX,
				checkbox = item.checkbox;
			
			if (legendItem) {
				legendItem.attr({
					x: ltr ? itemX : legendWidth - itemX,
					y: itemY
				});
			}
			if (legendLine) {
				legendLine.translate(
					ltr ? itemX : legendWidth - itemX,
					itemY - 4
				);
			}
			if (legendSymbol) {
				symbolX = itemX + legendSymbol.xOff;
				legendSymbol.attr({
					x: ltr ? symbolX : legendWidth - symbolX,
					y: itemY + legendSymbol.yOff
				});
			}
			if (checkbox) {
				checkbox.x = itemX;
				checkbox.y = itemY;
			}
		}

		/**
		 * Destroy a single legend item
		 * @param {Object} item The series or point
		 */
		function destroyItem(item) {
			var checkbox = item.checkbox;

			// destroy SVG elements
			each(['legendItem', 'legendLine', 'legendSymbol'], function (key) {
				if (item[key]) {
					item[key].destroy();
				}
			});

			if (checkbox) {
				discardElement(item.checkbox);
			}


		}

		/**
		 * Destroys the legend.
		 */
		function destroy() {
			if (box) {
				box = box.destroy();
			}

			if (legendGroup) {
				legendGroup = legendGroup.destroy();
			}
		}

		/**
		 * Position the checkboxes after the width is determined
		 */
		function positionCheckboxes() {
			each(allItems, function (item) {
				var checkbox = item.checkbox,
					alignAttr = legendGroup.alignAttr;
				if (checkbox) {
					css(checkbox, {
						left: (alignAttr.translateX + item.legendItemWidth + checkbox.x - 40) + PX,
						top: (alignAttr.translateY + checkbox.y - 11) + PX
					});
				}
			});
		}

		/**
		 * Render a single specific legend item
		 * @param {Object} item A series or point
		 */
		function renderItem(item) {
			var bBox,
				itemWidth,
				legendSymbol,
				symbolX,
				symbolY,
				simpleSymbol,
				radius,
				li = item.legendItem,
				series = item.series || item,
				itemOptions = series.options,
				strokeWidth = (itemOptions && itemOptions.borderWidth) || 0;


			if (!li) { // generate it once, later move it

				// let these series types use a simple symbol
				simpleSymbol = /^(bar|pie|area|column)$/.test(series.type);

				// generate the list item text
				item.legendItem = li = renderer.text(
						options.labelFormatter.call(item),
						0,
						0,
						options.useHTML
					)
					.css(item.visible ? itemStyle : itemHiddenStyle)
					.on('mouseover', function () {
						item.setState(HOVER_STATE);
						li.css(itemHoverStyle);
					})
					.on('mouseout', function () {
						li.css(item.visible ? itemStyle : itemHiddenStyle);
						item.setState();
					})
					.on('click', function () {
						var strLegendItemClick = 'legendItemClick',
							fnLegendItemClick = function () {
								item.setVisible();
							};

						// click the name or symbol
						if (item.firePointEvent) { // point
							item.firePointEvent(strLegendItemClick, null, fnLegendItemClick);
						} else {
							fireEvent(item, strLegendItemClick, null, fnLegendItemClick);
						}
					})
					.attr({
						align: ltr ? 'left' : 'right',
						zIndex: 2
					})
					.add(legendGroup);

				// draw the line
				if (!simpleSymbol && itemOptions && itemOptions.lineWidth) {
					var attrs = {
							'stroke-width': itemOptions.lineWidth,
							zIndex: 2
						};
					if (itemOptions.dashStyle) {
						attrs.dashstyle = itemOptions.dashStyle;
					}
					item.legendLine = renderer.path([
						M,
						(-symbolWidth - symbolPadding) * (ltr ? 1 : -1),
						0,
						L,
						(-symbolPadding) * (ltr ? 1 : -1),
						0
					])
					.attr(attrs)
					.add(legendGroup);
				}

				// draw a simple symbol
				if (simpleSymbol) { // bar|pie|area|column

					legendSymbol = renderer.rect(
						(symbolX = -symbolWidth - symbolPadding),
						(symbolY = -11),
						symbolWidth,
						12,
						2
					).attr({
						//'stroke-width': 0,
						zIndex: 3
					}).add(legendGroup);
					
					if (!ltr) {
						symbolX += symbolWidth;
					}
					
				} else if (itemOptions && itemOptions.marker && itemOptions.marker.enabled) { // draw the marker
					radius = itemOptions.marker.radius;
					legendSymbol = renderer.symbol(
						item.symbol,
						(symbolX = -symbolWidth / 2 - symbolPadding - radius),
						(symbolY = -4 - radius),
						2 * radius,
						2 * radius
					)
					.attr(item.pointAttr[NORMAL_STATE])
					.attr({ zIndex: 3 })
					.add(legendGroup);
					
					if (!ltr) {
						symbolX += symbolWidth / 2;
					}

				}
				if (legendSymbol) {
					
					legendSymbol.xOff = symbolX + (strokeWidth % 2 / 2);
					legendSymbol.yOff = symbolY + (strokeWidth % 2 / 2);
				}

				item.legendSymbol = legendSymbol;

				// colorize the items
				colorizeItem(item, item.visible);


				// add the HTML checkbox on top
				if (itemOptions && itemOptions.showCheckbox) {
					item.checkbox = createElement('input', {
						type: 'checkbox',
						checked: item.selected,
						defaultChecked: item.selected // required by IE7
					}, options.itemCheckboxStyle, container);

					addEvent(item.checkbox, 'click', function (event) {
						var target = event.target;
						fireEvent(item, 'checkboxClick', {
								checked: target.checked
							},
							function () {
								item.select();
							}
						);
					});
				}
			}


			// calculate the positions for the next line
			bBox = li.getBBox();

			itemWidth = item.legendItemWidth =
				options.itemWidth || symbolWidth + symbolPadding + bBox.width + padding;
			itemHeight = bBox.height;

			// if the item exceeds the width, start a new line
			if (horizontal && itemX - initialItemX + itemWidth >
					(widthOption || (chartWidth - 2 * padding - initialItemX))) {
				itemX = initialItemX;
				itemY += itemMarginTop + itemHeight + itemMarginBottom;
			}
			
			// If the item exceeds the height, start a new column
			if (!horizontal && itemY + options.y + itemHeight > chartHeight - spacingTop - spacingBottom) {
				itemY = initialItemY;
				itemX += maxItemWidth;
				maxItemWidth = 0;
			}

			// Set the edge positions
			maxItemWidth = mathMax(maxItemWidth, itemWidth);
			lastItemY = mathMax(lastItemY, itemY + itemMarginBottom);
			
			// cache the position of the newly generated or reordered items
			item._legendItemPos = [itemX, itemY];

			// advance
			if (horizontal) {
				itemX += itemWidth;
			} else {
				itemY += itemMarginTop + itemHeight + itemMarginBottom;
			}

			// the width of the widest item
			offsetWidth = widthOption || mathMax(
				(itemX - initialItemX) + (horizontal ? 0 : itemWidth),
				offsetWidth
			);

		}

		/**
		 * Render the legend. This method can be called both before and after
		 * chart.render. If called after, it will only rearrange items instead
		 * of creating new ones.
		 */
		function renderLegend() {
			itemX = initialItemX;
			itemY = initialItemY;
			offsetWidth = 0;
			lastItemY = 0;

			if (!legendGroup) {
				legendGroup = renderer.g('legend')
					// #414, #759. Trackers will be drawn above the legend, but we have 
					// to sacrifice that because tooltips need to be above the legend
					// and trackers above tooltips
					.attr({ zIndex: 7 }) 
					.add();
			}


			// add each series or point
			allItems = [];
			each(series, function (serie) {
				var seriesOptions = serie.options;

				if (!seriesOptions.showInLegend) {
					return;
				}

				// use points or series for the legend item depending on legendType
				allItems = allItems.concat(
						serie.legendItems ||
						(seriesOptions.legendType === 'point' ?
								serie.data :
								serie)
				);

			});

			// sort by legendIndex
			stableSort(allItems, function (a, b) {
				return (a.options.legendIndex || 0) - (b.options.legendIndex || 0);
			});

			// reversed legend
			if (reversedLegend) {
				allItems.reverse();
			}

			// render the items
			each(allItems, renderItem);


			// Draw the border
			legendWidth = widthOption || offsetWidth;
			legendHeight = lastItemY - y + itemHeight;

			if (legendBorderWidth || legendBackgroundColor) {
				legendWidth += 2 * padding;
				legendHeight += 2 * padding;

				if (!box) {
					box = renderer.rect(
						0,
						0,
						legendWidth,
						legendHeight,
						options.borderRadius,
						legendBorderWidth || 0
					).attr({
						stroke: options.borderColor,
						'stroke-width': legendBorderWidth || 0,
						fill: legendBackgroundColor || NONE
					})
					.add(legendGroup)
					.shadow(options.shadow);
					box.isNew = true;

				} else if (legendWidth > 0 && legendHeight > 0) {
					box[box.isNew ? 'attr' : 'animate'](
						box.crisp(null, null, null, legendWidth, legendHeight)
					);
					box.isNew = false;
				}

				// hide the border if no items
				box[allItems.length ? 'show' : 'hide']();
			}
			
			// Now that the legend width and height are extablished, put the items in the 
			// final position
			each(allItems, positionItem);

			// 1.x compatibility: positioning based on style
			var props = ['left', 'right', 'top', 'bottom'],
				prop,
				i = 4;
			while (i--) {
				prop = props[i];
				if (style[prop] && style[prop] !== 'auto') {
					options[i < 2 ? 'align' : 'verticalAlign'] = prop;
					options[i < 2 ? 'x' : 'y'] = pInt(style[prop]) * (i % 2 ? -1 : 1);
				}
			}

			if (allItems.length) {
				legendGroup.align(extend(options, {
					width: legendWidth,
					height: legendHeight
				}), true, spacingBox);
			}

			if (!isResizing) {
				positionCheckboxes();
			}
		}


		// run legend
		renderLegend();

		// move checkboxes
		addEvent(chart, 'endResize', positionCheckboxes);

		// expose
		return {
			colorizeItem: colorizeItem,
			destroyItem: destroyItem,
			renderLegend: renderLegend,
			destroy: destroy
		};
	};






	/**
	 * Initialize an individual series, called internally before render time
	 */
	function initSeries(options) {
		var type = options.type || optionsChart.type || optionsChart.defaultSeriesType,
			typeClass = seriesTypes[type],
			serie,
			hasRendered = chart.hasRendered;

		// an inverted chart can't take a column series and vice versa
		if (hasRendered) {
			if (inverted && type === 'column') {
				typeClass = seriesTypes.bar;
			} else if (!inverted && type === 'bar') {
				typeClass = seriesTypes.column;
			}
		}

		serie = new typeClass();

		serie.init(chart, options);

		// set internal chart properties
		if (!hasRendered && serie.inverted) {
			inverted = true;
		}
		if (serie.isCartesian) {
			hasCartesianSeries = serie.isCartesian;
		}

		series.push(serie);

		return serie;
	}

	/**
	 * Add a series dynamically after  time
	 *
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 * @return {Object} series The newly created series object
	 */
	function addSeries(options, redraw, animation) {
		var series;

		if (options) {
			setAnimation(animation, chart);
			redraw = pick(redraw, true); // defaults to true

			fireEvent(chart, 'addSeries', { options: options }, function () {
				series = initSeries(options);
				series.isDirty = true;

				chart.isDirtyLegend = true; // the series array is out of sync with the display
				if (redraw) {
					chart.redraw();
				}
			});
		}

		return series;
	}

	/**
	 * Check whether a given point is within the plot area
	 *
	 * @param {Number} x Pixel x relative to the plot area
	 * @param {Number} y Pixel y relative to the plot area
	 */
	isInsidePlot = function (x, y) {
		return x >= 0 &&
			x <= plotWidth &&
			y >= 0 &&
			y <= plotHeight;
	};

	/**
	 * Adjust all axes tick amounts
	 */
	function adjustTickAmounts() {
		if (optionsChart.alignTicks !== false) {
			each(axes, function (axis) {
				axis.adjustTickAmount();
			});
		}
		maxTicks = null;
	}

	/**
	 * Redraw legend, axes or series based on updated data
	 *
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	function redraw(animation) {
		var redrawLegend = chart.isDirtyLegend,
			hasStackedSeries,
			isDirtyBox = chart.isDirtyBox, // todo: check if it has actually changed?
			seriesLength = series.length,
			i = seriesLength,
			clipRect = chart.clipRect,
			serie;

		setAnimation(animation, chart);

		// link stacked series
		while (i--) {
			serie = series[i];
			if (serie.isDirty && serie.options.stacking) {
				hasStackedSeries = true;
				break;
			}
		}
		if (hasStackedSeries) { // mark others as dirty
			i = seriesLength;
			while (i--) {
				serie = series[i];
				if (serie.options.stacking) {
					serie.isDirty = true;
				}
			}
		}

		// handle updated data in the series
		each(series, function (serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				if (serie.options.legendType === 'point') {
					redrawLegend = true;
				}
			}
		});

		// handle added or removed series
		if (redrawLegend && legend.renderLegend) { // series or pie points are added or removed
			// draw legend graphics
			legend.renderLegend();

			chart.isDirtyLegend = false;
		}


		if (hasCartesianSeries) {
			if (!isResizing) {

				// reset maxTicks
				maxTicks = null;

				// set axes scales
				each(axes, function (axis) {
					axis.setScale();
				});
			}
			adjustTickAmounts();
			getMargins();

			// redraw axes
			each(axes, function (axis) {
				
				// Fire 'afterSetExtremes' only if extremes are set
				if (axis.isDirtyExtremes) { // #821
					axis.isDirtyExtremes = false;
					fireEvent(axis, 'afterSetExtremes', axis.getExtremes()); // #747, #751
				}
								
				if (axis.isDirty || isDirtyBox) {					
					axis.redraw();
					isDirtyBox = true; // #792
				}
			});


		}

		// the plot areas size has changed
		if (isDirtyBox) {
			drawChartBox();

			// move clip rect
			if (clipRect) {
				stop(clipRect);
				clipRect.animate({ // for chart resize
					width: chart.plotSizeX,
					height: chart.plotSizeY + 1
				});
			}

		}


		// redraw affected series
		each(series, function (serie) {
			if (serie.isDirty && serie.visible &&
					(!serie.isCartesian || serie.xAxis)) { // issue #153
				serie.redraw();
			}
		});


		// hide tooltip and hover states
		if (tracker && tracker.resetTracker) {
			tracker.resetTracker();
		}

		// redraw if canvas
		renderer.draw();

		// fire the event
		fireEvent(chart, 'redraw'); // jQuery breaks this when calling it from addEvent. Overwrites chart.redraw
	}



	/**
	 * Dim the chart and show a loading text or symbol
	 * @param {String} str An optional text to show in the loading label instead of the default one
	 */
	function showLoading(str) {
		var loadingOptions = options.loading;

		// create the layer at the first call
		if (!loadingDiv) {
			loadingDiv = createElement(DIV, {
				className: PREFIX + 'loading'
			}, extend(loadingOptions.style, {
				left: plotLeft + PX,
				top: plotTop + PX,
				width: plotWidth + PX,
				height: plotHeight + PX,
				zIndex: 10,
				display: NONE
			}), container);

			loadingSpan = createElement(
				'span',
				null,
				loadingOptions.labelStyle,
				loadingDiv
			);

		}

		// update text
		loadingSpan.innerHTML = str || options.lang.loading;

		// show it
		if (!loadingShown) {
			css(loadingDiv, { opacity: 0, display: '' });
			animate(loadingDiv, {
				opacity: loadingOptions.style.opacity
			}, {
				duration: loadingOptions.showDuration || 0
			});
			loadingShown = true;
		}
	}
	/**
	 * Hide the loading layer
	 */
	function hideLoading() {
		if (loadingDiv) {
			animate(loadingDiv, {
				opacity: 0
			}, {
				duration: options.loading.hideDuration || 100,
				complete: function () {
					css(loadingDiv, { display: NONE });
				}
			});
		}
		loadingShown = false;
	}

	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			points;

		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id === id) {
				return axes[i];
			}
		}

		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id === id) {
				return series[i];
			}
		}

		// search points
		for (i = 0; i < series.length; i++) {
			points = series[i].points || [];
			for (j = 0; j < points.length; j++) {
				if (points[j].id === id) {
					return points[j];
				}
			}
		}
		return null;
	}

	/**
	 * Create the Axis instances based on the config options
	 */
	function getAxes() {
		var xAxisOptions = options.xAxis || {},
			yAxisOptions = options.yAxis || {},
			optionsArray,
			axis;

		// make sure the options are arrays and add some members
		xAxisOptions = splat(xAxisOptions);
		each(xAxisOptions, function (axis, i) {
			axis.index = i;
			axis.isX = true;
		});

		yAxisOptions = splat(yAxisOptions);
		each(yAxisOptions, function (axis, i) {
			axis.index = i;
		});

		// concatenate all axis options into one array
		optionsArray = xAxisOptions.concat(yAxisOptions);

		each(optionsArray, function (axisOptions) {
			axis = new Axis(axisOptions);
		});

		adjustTickAmounts();
	}


	/**
	 * Get the currently selected points from all series
	 */
	function getSelectedPoints() {
		var points = [];
		each(series, function (serie) {
			points = points.concat(grep(serie.points, function (point) {
				return point.selected;
			}));
		});
		return points;
	}

	/**
	 * Get the currently selected series
	 */
	function getSelectedSeries() {
		return grep(series, function (serie) {
			return serie.selected;
		});
	}

	/**
	 * Display the zoom button
	 */
	function showResetZoom() {
		var lang = defaultOptions.lang,
			btnOptions = optionsChart.resetZoomButton,
			theme = btnOptions.theme,
			states = theme.states,
			box = btnOptions.relativeTo === 'chart' ? null : {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};
		chart.resetZoomButton = renderer.button(lang.resetZoom, null, null, zoomOut, theme, states && states.hover)
			.attr({
				align: btnOptions.position.align,
				title: lang.resetZoomTitle
			})
			.add()
			.align(btnOptions.position, false, box);
	}

	/**
	 * Zoom out to 1:1
	 */
	zoomOut = function () {
		var resetZoomButton = chart.resetZoomButton;

		fireEvent(chart, 'selection', { resetSelection: true }, zoom);
		if (resetZoomButton) {
			chart.resetZoomButton = resetZoomButton.destroy();
		}
	};
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom = function (event) {

		// add button to reset selection
		var hasZoomed;

		if (chart.resetZoomEnabled !== false && !chart.resetZoomButton) { // hook for Stock charts etc.
			showResetZoom();
		}

		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(axes, function (axis) {
				if (axis.options.zoomEnabled !== false) {
					axis.setExtremes(null, null, false);
					hasZoomed = true;
				}
			});
		} else { // else, zoom in on all axes
			each(event.xAxis.concat(event.yAxis), function (axisData) {
				var axis = axisData.axis;

				// don't zoom more than minRange
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					axis.setExtremes(axisData.min, axisData.max, false);
					hasZoomed = true;
				}
			});
		}

		// Redraw
		if (hasZoomed) {
			redraw( 
				pick(optionsChart.animation, chart.pointCount < 100) // animation
			);
		}
	};

	/**
	 * Pan the chart by dragging the mouse across the pane. This function is called
	 * on mouse move, and the distance to pan is computed from chartX compared to
	 * the first chartX position in the dragging operation.
	 */
	chart.pan = function (chartX) {

		var xAxis = chart.xAxis[0],
			mouseDownX = chart.mouseDownX,
			halfPointRange = xAxis.pointRange / 2,
			extremes = xAxis.getExtremes(),
			newMin = xAxis.translate(mouseDownX - chartX, true) + halfPointRange,
			newMax = xAxis.translate(mouseDownX + plotWidth - chartX, true) - halfPointRange,
			hoverPoints = chart.hoverPoints;

		// remove active points for shared tooltip
		if (hoverPoints) {
			each(hoverPoints, function (point) {
				point.setState();
			});
		}

		if (newMin > mathMin(extremes.dataMin, extremes.min) && newMax < mathMax(extremes.dataMax, extremes.max)) {
			xAxis.setExtremes(newMin, newMax, true, false);
		}

		chart.mouseDownX = chartX; // set new reference for next run
		css(container, { cursor: 'move' });
	};

	/**
	 * Show the title and subtitle of the chart
	 *
	 * @param titleOptions {Object} New title options
	 * @param subtitleOptions {Object} New subtitle options
	 *
	 */
	function setTitle(titleOptions, subtitleOptions) {

		chartTitleOptions = merge(options.title, titleOptions);
		chartSubtitleOptions = merge(options.subtitle, subtitleOptions);

		// add title and subtitle
		each([
			['title', titleOptions, chartTitleOptions],
			['subtitle', subtitleOptions, chartSubtitleOptions]
		], function (arr) {
			var name = arr[0],
				title = chart[name],
				titleOptions = arr[1],
				chartTitleOptions = arr[2];

			if (title && titleOptions) {
				title = title.destroy(); // remove old
			}
			if (chartTitleOptions && chartTitleOptions.text && !title) {
				chart[name] = renderer.text(
					chartTitleOptions.text,
					0,
					0,
					chartTitleOptions.useHTML
				)
				.attr({
					align: chartTitleOptions.align,
					'class': PREFIX + name,
					zIndex: chartTitleOptions.zIndex || 4
				})
				.css(chartTitleOptions.style)
				.add()
				.align(chartTitleOptions, false, spacingBox);
			}
		});

	}

	/**
	 * Get chart width and height according to options and container size
	 */
	function getChartSize() {

		containerWidth = (renderToClone || renderTo).offsetWidth;
		containerHeight = (renderToClone || renderTo).offsetHeight;
		chart.chartWidth = chartWidth = optionsChart.width || containerWidth || 600;
		chart.chartHeight = chartHeight = optionsChart.height ||
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			(containerHeight > 19 ? containerHeight : 400);
	}


	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	function getContainer() {
		renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;

		if (isString(renderTo)) {
			renderTo = doc.getElementById(renderTo);
		}
		
		// Display an error if the renderTo is wrong
		if (!renderTo) {
			error(13, true);
		}

		// remove previous chart
		renderTo.innerHTML = '';

		// If the container doesn't have an offsetWidth, it has or is a child of a node
		// that has display:none. We need to temporarily move it out to a visible
		// state to determine the size, else the legend and tooltips won't render
		// properly
		if (!renderTo.offsetWidth) {
			renderToClone = renderTo.cloneNode(0);
			css(renderToClone, {
				position: ABSOLUTE,
				top: '-9999px',
				display: ''
			});
			doc.body.appendChild(renderToClone);
		}

		// get the width and height
		getChartSize();

		// create the inner container
		chart.container = container = createElement(DIV, {
				className: PREFIX + 'container' +
					(optionsChart.className ? ' ' + optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN, // needed for context menu (avoid scrollbars) and
					// content overflow in IE
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left',
				lineHeight: 'normal' // #427
			}, optionsChart.style),
			renderToClone || renderTo
		);

		chart.renderer = renderer =
			optionsChart.forExport ? // force SVG, used for SVG export
				new SVGRenderer(container, chartWidth, chartHeight, true) :
				new Renderer(container, chartWidth, chartHeight);

		if (useCanVG) {
			// If we need canvg library, extend and configure the renderer
			// to get the tracker for translating mouse events
			renderer.create(chart, container, chartWidth, chartHeight);
		}

		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (-(rect.left - pInt(rect.left))) + PX,
					top: (-(rect.top - pInt(rect.top))) + PX
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(win, 'resize', subPixelFix);

			// remove it on chart destroy
			addEvent(chart, 'destroy', function () {
				removeEvent(win, 'resize', subPixelFix);
			});
		}
	}

	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be
	 * moved into their final positions
	 */
	getMargins = function () {
		var legendOptions = options.legend,
			legendMargin = pick(legendOptions.margin, 10),
			legendX = legendOptions.x,
			legendY = legendOptions.y,
			align = legendOptions.align,
			verticalAlign = legendOptions.verticalAlign,
			titleOffset;

		resetMargins();

		// adjust for title and subtitle
		if ((chart.title || chart.subtitle) && !defined(optionsMarginTop)) {
			titleOffset = mathMax(
				(chart.title && !chartTitleOptions.floating && !chartTitleOptions.verticalAlign && chartTitleOptions.y) || 0,
				(chart.subtitle && !chartSubtitleOptions.floating && !chartSubtitleOptions.verticalAlign && chartSubtitleOptions.y) || 0
			);
			if (titleOffset) {
				plotTop = mathMax(plotTop, titleOffset + pick(chartTitleOptions.margin, 15) + spacingTop);
			}
		}
		// adjust for legend
		if (legendOptions.enabled && !legendOptions.floating) {
			if (align === 'right') { // horizontal alignment handled first
				if (!defined(optionsMarginRight)) {
					marginRight = mathMax(
						marginRight,
						legendWidth - legendX + legendMargin + spacingRight
					);
				}
			} else if (align === 'left') {
				if (!defined(optionsMarginLeft)) {
					plotLeft = mathMax(
						plotLeft,
						legendWidth + legendX + legendMargin + spacingLeft
					);
				}

			} else if (verticalAlign === 'top') {
				if (!defined(optionsMarginTop)) {
					plotTop = mathMax(
						plotTop,
						legendHeight + legendY + legendMargin + spacingTop
					);
				}

			} else if (verticalAlign === 'bottom') {
				if (!defined(optionsMarginBottom)) {
					marginBottom = mathMax(
						marginBottom,
						legendHeight - legendY + legendMargin + spacingBottom
					);
				}
			}
		}

		// adjust for scroller
		if (chart.extraBottomMargin) {
			marginBottom += chart.extraBottomMargin;
		}
		if (chart.extraTopMargin) {
			plotTop += chart.extraTopMargin;
		}

		// pre-render axes to get labels offset width
		if (hasCartesianSeries) {
			each(axes, function (axis) {
				axis.getOffset();
			});
		}

		if (!defined(optionsMarginLeft)) {
			plotLeft += axisOffset[3];
		}
		if (!defined(optionsMarginTop)) {
			plotTop += axisOffset[0];
		}
		if (!defined(optionsMarginBottom)) {
			marginBottom += axisOffset[2];
		}
		if (!defined(optionsMarginRight)) {
			marginRight += axisOffset[1];
		}

		setChartSize();

	};

	/**
	 * Add the event handlers necessary for auto resizing
	 *
	 */
	function initReflow() {
		var reflowTimeout;
		function reflow(e) {
			var width = optionsChart.width || renderTo.offsetWidth,
				height = optionsChart.height || renderTo.offsetHeight,
				target = e ? e.target : win; // #805 - MooTools doesn't supply e
				
			// Width and height checks for display:none. Target is doc in IE8 and Opera,
			// win in Firefox, Chrome and IE9.
			if (width && height && (target === win || target === doc)) {
				
				if (width !== containerWidth || height !== containerHeight) {
					clearTimeout(reflowTimeout);
					reflowTimeout = setTimeout(function () {
						resize(width, height, false);
					}, 100);
				}
				containerWidth = width;
				containerHeight = height;
			}
		}
		addEvent(win, 'resize', reflow);
		addEvent(chart, 'destroy', function () {
			removeEvent(win, 'resize', reflow);
		});
	}

	/**
	 * Fires endResize event on chart instance.
	 */
	function fireEndResize() {
		if (chart) {
			fireEvent(chart, 'endResize', null, function () {
				isResizing -= 1;
			});
		}
	}

	/**
	 * Resize the chart to a given width and height
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object|Boolean} animation
	 */
	resize = function (width, height, animation) {
		var chartTitle = chart.title,
			chartSubtitle = chart.subtitle;

		isResizing += 1;

		// set the animation for the current process
		setAnimation(animation, chart);

		oldChartHeight = chartHeight;
		oldChartWidth = chartWidth;
		if (defined(width)) {
			chart.chartWidth = chartWidth = mathRound(width);
		}
		if (defined(height)) {
			chart.chartHeight = chartHeight = mathRound(height);
		}

		css(container, {
			width: chartWidth + PX,
			height: chartHeight + PX
		});
		renderer.setSize(chartWidth, chartHeight, animation);

		// update axis lengths for more correct tick intervals:
		plotWidth = chartWidth - plotLeft - marginRight;
		plotHeight = chartHeight - plotTop - marginBottom;

		// handle axes
		maxTicks = null;
		each(axes, function (axis) {
			axis.isDirty = true;
			axis.setScale();
		});

		// make sure non-cartesian series are also handled
		each(series, function (serie) {
			serie.isDirty = true;
		});

		chart.isDirtyLegend = true; // force legend redraw
		chart.isDirtyBox = true; // force redraw of plot and chart border

		getMargins();

		// move titles
		if (chartTitle) {
			chartTitle.align(null, null, spacingBox);
		}
		if (chartSubtitle) {
			chartSubtitle.align(null, null, spacingBox);
		}

		redraw(animation);


		oldChartHeight = null;
		fireEvent(chart, 'resize');

		// fire endResize and set isResizing back
		// If animation is disabled, fire without delay
		if (globalAnimation === false) {
			fireEndResize();
		} else { // else set a timeout with the animation duration
			setTimeout(fireEndResize, (globalAnimation && globalAnimation.duration) || 500);
		}
	};

	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	setChartSize = function () {

		chart.plotLeft = plotLeft = mathRound(plotLeft);
		chart.plotTop = plotTop = mathRound(plotTop);
		chart.plotWidth = plotWidth = mathRound(chartWidth - plotLeft - marginRight);
		chart.plotHeight = plotHeight = mathRound(chartHeight - plotTop - marginBottom);

		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;

		spacingBox = {
			x: spacingLeft,
			y: spacingTop,
			width: chartWidth - spacingLeft - spacingRight,
			height: chartHeight - spacingTop - spacingBottom
		};

		each(axes, function (axis) {
			axis.setAxisSize();
			axis.setAxisTranslation();
		});
	};

	/**
	 * Initial margins before auto size margins are applied
	 */
	resetMargins = function () {
		plotTop = pick(optionsMarginTop, spacingTop);
		marginRight = pick(optionsMarginRight, spacingRight);
		marginBottom = pick(optionsMarginBottom, spacingBottom);
		plotLeft = pick(optionsMarginLeft, spacingLeft);
		axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
	};

	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	drawChartBox = function () {
		var chartBorderWidth = optionsChart.borderWidth || 0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			mgn,
			plotSize = {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};

		// Chart area
		mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

		if (chartBorderWidth || chartBackgroundColor) {
			if (!chartBackground) {
				chartBackground = renderer.rect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn,
						optionsChart.borderRadius, chartBorderWidth)
					.attr({
						stroke: optionsChart.borderColor,
						'stroke-width': chartBorderWidth,
						fill: chartBackgroundColor || NONE
					})
					.add()
					.shadow(optionsChart.shadow);
			} else { // resize
				chartBackground.animate(
					chartBackground.crisp(null, null, null, chartWidth - mgn, chartHeight - mgn)
				);
			}
		}


		// Plot background
		if (plotBackgroundColor) {
			if (!plotBackground) {
				plotBackground = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0)
					.attr({
						fill: plotBackgroundColor
					})
					.add()
					.shadow(optionsChart.plotShadow);
			} else {
				plotBackground.animate(plotSize);
			}
		}
		if (plotBackgroundImage) {
			if (!plotBGImage) {
				plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
					.add();
			} else {
				plotBGImage.animate(plotSize);
			}
		}

		// Plot area border
		if (optionsChart.plotBorderWidth) {
			if (!plotBorder) {
				plotBorder = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, optionsChart.plotBorderWidth)
					.attr({
						stroke: optionsChart.plotBorderColor,
						'stroke-width': optionsChart.plotBorderWidth,
						zIndex: 4
					})
					.add();
			} else {
				plotBorder.animate(
					plotBorder.crisp(null, plotLeft, plotTop, plotWidth, plotHeight)
				);
			}
		}

		// reset
		chart.isDirtyBox = false;
	};

	/**
	 * Detect whether the chart is inverted, either by setting the chart.inverted option
	 * or adding a bar series to the configuration options
	 */
	function setInverted() {
		var BAR = 'bar',
			isInverted = (
				inverted || // it is set before
				optionsChart.inverted ||
				optionsChart.type === BAR || // default series type
				optionsChart.defaultSeriesType === BAR // backwards compatible
			),
			seriesOptions = options.series,
			i = seriesOptions && seriesOptions.length;

		// check if a bar series is present in the config options
		while (!isInverted && i--) {
			if (seriesOptions[i].type === BAR) {
				isInverted = true;
			}
		}

		// set the chart property and the chart scope variable
		chart.inverted = inverted = isInverted;
	}

	/**
	 * Render all graphics for the chart
	 */
	function render() {
		var labels = options.labels,
			credits = options.credits,
			creditsHref;

		// Title
		setTitle();


		// Legend
		legend = chart.legend = new Legend();

		// Get margins by pre-rendering axes
		// set axes scales
		each(axes, function (axis) {
			axis.setScale();
		});
		getMargins();
		each(axes, function (axis) {
			axis.setTickPositions(true); // update to reflect the new margins
		});
		adjustTickAmounts();
		getMargins(); // second pass to check for new labels


		// Draw the borders and backgrounds
		drawChartBox();

		// Axes
		if (hasCartesianSeries) {
			each(axes, function (axis) {
				axis.render();
			});
		}


		// The series
		if (!chart.seriesGroup) {
			chart.seriesGroup = renderer.g('series-group')
				.attr({ zIndex: 3 })
				.add();
		}
		each(series, function (serie) {
			serie.translate();
			serie.setTooltipPoints();
			serie.render();
		});


		// Labels
		if (labels.items) {
			each(labels.items, function () {
				var style = extend(labels.style, this.style),
					x = pInt(style.left) + plotLeft,
					y = pInt(style.top) + plotTop + 12;

				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;

				renderer.text(
					this.html,
					x,
					y
				)
				.attr({ zIndex: 2 })
				.css(style)
				.add();

			});
		}

		// Credits
		if (credits.enabled && !chart.credits) {
			creditsHref = credits.href;
			chart.credits = renderer.text(
				credits.text,
				0,
				0
			)
			.on('click', function () {
				if (creditsHref) {
					location.href = creditsHref;
				}
			})
			.attr({
				align: credits.position.align,
				zIndex: 8
			})
			.css(credits.style)
			.add()
			.align(credits.position);
		}

		// Set flag
		chart.hasRendered = true;

	}

	/**
	 * Clean up memory usage
	 */
	function destroy() {
		var i,
			parentNode = container && container.parentNode;

		// If the chart is destroyed already, do nothing.
		// This will happen if if a script invokes chart.destroy and
		// then it will be called again on win.unload
		if (chart === null) {
			return;
		}

		// fire the chart.destoy event
		fireEvent(chart, 'destroy');

		// remove events
		removeEvent(chart);

		// ==== Destroy collections:
		// Destroy axes
		i = axes.length;
		while (i--) {
			axes[i] = axes[i].destroy();
		}

		// Destroy each series
		i = series.length;
		while (i--) {
			series[i] = series[i].destroy();
		}

		// ==== Destroy chart properties:
		each(['title', 'subtitle', 'seriesGroup', 'clipRect', 'credits', 'tracker', 'scroller', 'rangeSelector'], function (name) {
			var prop = chart[name];

			if (prop) {
				chart[name] = prop.destroy();
			}
		});

		// ==== Destroy local variables:
		each([chartBackground, plotBorder, plotBackground, legend, tooltip, renderer, tracker], function (obj) {
			if (obj && obj.destroy) {
				obj.destroy();
			}
		});
		chartBackground = plotBorder = plotBackground = legend = tooltip = renderer = tracker = null;

		// remove container and all SVG
		if (container) { // can break in IE when destroyed before finished loading
			container.innerHTML = '';
			removeEvent(container);
			if (parentNode) {
				discardElement(container);
			}

			// IE6 leak
			container = null;
		}

		// memory and CPU leak
		clearInterval(tooltipInterval);

		// clean it all up
		for (i in chart) {
			delete chart[i];
		}

		chart = null;
		options = null;
	}
	/**
	 * Prepare for first rendering after all data are loaded
	 */
	function firstRender() {
		// VML namespaces can't be added until after complete. Listening
		// for Perini's doScroll hack is not enough.
		var ONREADYSTATECHANGE = 'onreadystatechange',
		COMPLETE = 'complete';
		// Note: in spite of JSLint's complaints, win == win.top is required
		/*jslint eqeq: true*/
		if ((!hasSVG && (win == win.top && doc.readyState !== COMPLETE)) || (useCanVG && !win.canvg)) {
		/*jslint eqeq: false*/
			if (useCanVG) {
				// Delay rendering until canvg library is downloaded and ready
				CanVGController.push(firstRender, options.global.canvasToolsURL);
			} else {
				doc.attachEvent(ONREADYSTATECHANGE, function () {
					doc.detachEvent(ONREADYSTATECHANGE, firstRender);
					if (doc.readyState === COMPLETE) {
						firstRender();
					}
				});
			}
			return;
		}

		// create the container
		getContainer();

		// Run an early event after the container and renderer are established
		fireEvent(chart, 'init');

		// Initialize range selector for stock charts
		if (Highcharts.RangeSelector && options.rangeSelector.enabled) {
			chart.rangeSelector = new Highcharts.RangeSelector(chart);
		}

		resetMargins();
		setChartSize();

		// Set the common inversion and transformation for inverted series after initSeries
		setInverted();

		// get axes
		getAxes();

		// Initialize the series
		each(options.series || [], function (serieOptions) {
			initSeries(serieOptions);
		});

		// Run an event where series and axes can be added
		//fireEvent(chart, 'beforeRender');

		// Initialize scroller for stock charts
		if (Highcharts.Scroller && (options.navigator.enabled || options.scrollbar.enabled)) {
			chart.scroller = new Highcharts.Scroller(chart);
		}

		chart.render = render;

		// depends on inverted and on margins being set
		chart.tracker = tracker = new MouseTracker(options.tooltip);


		render();

		// add canvas
		renderer.draw();
		// run callbacks
		if (callback) {
			callback.apply(chart, [chart]);
		}
		each(chart.callbacks, function (fn) {
			fn.apply(chart, [chart]);
		});
		
		
		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
		}

		fireEvent(chart, 'load');

	}

	// Run chart

	// Set up auto resize
	if (optionsChart.reflow !== false) {
		addEvent(chart, 'load', initReflow);
	}

	// Chart event handlers
	if (chartEvents) {
		for (eventType in chartEvents) {
			addEvent(chart, eventType, chartEvents[eventType]);
		}
	}


	chart.options = options;
	chart.series = series;


	chart.xAxis = [];
	chart.yAxis = [];




	// Expose methods and variables
	chart.addSeries = addSeries;
	chart.animation = useCanVG ? false : pick(optionsChart.animation, true);
	chart.Axis = Axis;
	chart.destroy = destroy;
	chart.get = get;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.hideLoading = hideLoading;
	chart.initSeries = initSeries;
	chart.isInsidePlot = isInsidePlot;
	chart.redraw = redraw;
	chart.setSize = resize;
	chart.setTitle = setTitle;
	chart.showLoading = showLoading;
	chart.pointCount = 0;
	chart.counters = new ChartCounters();
	/*
	if ($) $(function () {
		$container = $('#container');
		var origChartWidth,
			origChartHeight;
		if ($container) {
			$('<button>+</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 1.1, chartHeight *= 1.1);
				});
			$('<button>-</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 0.9, chartHeight *= 0.9);
				});
			$('<button>1:1</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(origChartWidth, origChartHeight);
				});
		}
	})
	*/




	firstRender();


} // end Chart

// Hook for exporting module
Chart.prototype.callbacks = [];
/**
 * The Point object and prototype. Inheritable and used as base for PiePoint
 */
var Point = function () {};
Point.prototype = {

	/**
	 * Initialize the point
	 * @param {Object} series The series object containing this point
	 * @param {Object} options The data in either number, array or object format
	 */
	init: function (series, options, x) {
		var point = this,
			counters = series.chart.counters,
			defaultColors;
		point.series = series;
		point.applyOptions(options, x);
		point.pointAttr = {};

		if (series.options.colorByPoint) {
			defaultColors = series.chart.options.colors;
			if (!point.options) {
				point.options = {};
			}
			point.color = point.options.color = point.color || defaultColors[counters.color++];

			// loop back to zero
			counters.wrapColor(defaultColors.length);
		}

		series.chart.pointCount++;
		return point;
	},
	/**
	 * Apply the options containing the x and y data and possible some extra properties.
	 * This is called on point init or from point.update.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options, x) {
		var point = this,
			series = point.series,
			optionsType = typeof options;

		point.config = options;

		// onedimensional array input
		if (optionsType === 'number' || options === null) {
			point.y = options;
		} else if (typeof options[0] === 'number') { // two-dimentional array
			point.x = options[0];
			point.y = options[1];
		} else if (optionsType === 'object' && typeof options.length !== 'number') { // object input
			// copy options directly to point
			extend(point, options);
			point.options = options;
			
			// This is the fastest way to detect if there are individual point dataLabels that need 
			// to be considered in drawDataLabels. These can only occur in object configs.
			if (options.dataLabels) {
				series._hasPointLabels = true;
			}
		} else if (typeof options[0] === 'string') { // categorized data with name in first position
			point.name = options[0];
			point.y = options[1];
		}
		
		/*
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		// todo: skip this? It is only used in applyOptions, in translate it should not be used
		if (point.x === UNDEFINED) {
			point.x = x === UNDEFINED ? series.autoIncrement() : x;
		}
		
		

	},

	/**
	 * Destroy a point to clear memory. Its reference still stays in series.data.
	 */
	destroy: function () {
		var point = this,
			series = point.series,
			hoverPoints = series.chart.hoverPoints,
			prop;

		series.chart.pointCount--;

		if (hoverPoints) {
			point.setState();
			erase(hoverPoints, point);
		}
		if (point === series.chart.hoverPoint) {
			point.onMouseOut();
		}
		series.chart.hoverPoints = null;

		// remove all events
		if (point.graphic || point.dataLabel) { // removeEvent and destroyElements are performance expensive
			removeEvent(point);
			point.destroyElements();
		}

		if (point.legendItem) { // pies have legend items
			point.series.chart.legend.destroyItem(point);
		}

		for (prop in point) {
			point[prop] = null;
		}


	},

	/**
	 * Destroy SVG elements associated with the point
	 */
	destroyElements: function () {
		var point = this,
			props = ['graphic', 'tracker', 'dataLabel', 'group', 'connector', 'shadowGroup'],
			prop,
			i = 6;
		while (i--) {
			prop = props[i];
			if (point[prop]) {
				point[prop] = point[prop].destroy();
			}
		}
	},

	/**
	 * Return the configuration hash needed for the data label and tooltip formatters
	 */
	getLabelConfig: function () {
		var point = this;
		return {
			x: point.category,
			y: point.y,
			key: point.name || point.category,
			series: point.series,
			point: point,
			percentage: point.percentage,
			total: point.total || point.stackTotal
		};
	},

	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 *     this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function (selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;

		selected = pick(selected, !point.selected);

		// fire the event with the defalut handler
		point.firePointEvent(selected ? 'select' : 'unselect', { accumulate: accumulate }, function () {
			point.selected = selected;
			point.setState(selected && SELECT_STATE);

			// unselect all other points unless Ctrl or Cmd + click
			if (!accumulate) {
				each(chart.getSelectedPoints(), function (loopPoint) {
					if (loopPoint.selected && loopPoint !== point) {
						loopPoint.selected = false;
						loopPoint.setState(NORMAL_STATE);
						loopPoint.firePointEvent('unselect');
					}
				});
			}
		});
	},

	onMouseOver: function () {
		var point = this,
			series = point.series,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// set normal state to previous series
		if (hoverPoint && hoverPoint !== point) {
			hoverPoint.onMouseOut();
		}

		// trigger the event
		point.firePointEvent('mouseOver');

		// update the tooltip
		if (tooltip && (!tooltip.shared || series.noSharedTooltip)) {
			tooltip.refresh(point);
		}

		// hover this
		point.setState(HOVER_STATE);
		chart.hoverPoint = point;
	},

	onMouseOut: function () {
		var point = this;
		point.firePointEvent('mouseOut');

		point.setState();
		point.series.chart.hoverPoint = null;
	},

	/**
	 * Extendable method for formatting each point's tooltip line
	 *
	 * @return {String} A string to be concatenated in to the common tooltip text
	 */
	tooltipFormatter: function (pointFormat) {
		var point = this,
			series = point.series,
			seriesTooltipOptions = series.tooltipOptions,
			split = String(point.y).split('.'),
			originalDecimals = split[1] ? split[1].length : 0,
			match = pointFormat.match(/\{(series|point)\.[a-zA-Z]+\}/g),
			splitter = /[{\.}]/,
			obj,
			key,
			replacement,
			parts,
			prop,
			i;

		// loop over the variables defined on the form {series.name}, {point.y} etc
		for (i in match) {
			key = match[i];
			if (isString(key) && key !== pointFormat) { // IE matches more than just the variables
				
				// Split it further into parts
				parts = (' ' + key).split(splitter); // add empty string because IE and the rest handles it differently
				obj = { 'point': point, 'series': series }[parts[1]];
				prop = parts[2];
				
				// Add some preformatting
				if (obj === point && (prop === 'y' || prop === 'open' || prop === 'high' || 
						prop === 'low' || prop === 'close')) { 
					replacement = (seriesTooltipOptions.valuePrefix || seriesTooltipOptions.yPrefix || '') + 
						numberFormat(point[prop], pick(seriesTooltipOptions.valueDecimals, seriesTooltipOptions.yDecimals, originalDecimals)) +
						(seriesTooltipOptions.valueSuffix || seriesTooltipOptions.ySuffix || '');
				
				// Automatic replacement
				} else {
					replacement = obj[prop];
				}
				
				pointFormat = pointFormat.replace(key, replacement);
			}
		}
		
		return pointFormat;
	},

	/**
	 * Update the point with new options (typically x/y data) and optionally redraw the series.
	 *
	 * @param {Object} options Point options as defined in the series.data array
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 */
	update: function (options, redraw, animation) {
		var point = this,
			series = point.series,
			graphic = point.graphic,
			i,
			data = series.data,
			dataLength = data.length,
			chart = series.chart;

		redraw = pick(redraw, true);

		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function () {

			point.applyOptions(options);

			// update visuals
			if (isObject(options)) {
				series.getAttribs();
				if (graphic) {
					graphic.attr(point.pointAttr[series.state]);
				}
			}

			// record changes in the parallel arrays
			for (i = 0; i < dataLength; i++) {
				if (data[i] === point) {
					series.xData[i] = point.x;
					series.yData[i] = point.y;
					series.options.data[i] = options;
					break;
				}
			}

			// redraw
			series.isDirty = true;
			series.isDirtyData = true;
			if (redraw) {
				chart.redraw(animation);
			}
		});
	},

	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	remove: function (redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			i,
			data = series.data,
			dataLength = data.length;

		setAnimation(animation, chart);
		redraw = pick(redraw, true);

		// fire the event with a default handler of removing the point
		point.firePointEvent('remove', null, function () {

			//erase(series.data, point);

			for (i = 0; i < dataLength; i++) {
				if (data[i] === point) {

					// splice all the parallel arrays
					data.splice(i, 1);
					series.options.data.splice(i, 1);
					series.xData.splice(i, 1);
					series.yData.splice(i, 1);
					break;
				}
			}

			point.destroy();


			// redraw
			series.isDirty = true;
			series.isDirtyData = true;
			if (redraw) {
				chart.redraw();
			}
		});


	},

	/**
	 * Fire an event on the Point object. Must not be renamed to fireEvent, as this
	 * causes a name clash in MooTools
	 * @param {String} eventType
	 * @param {Object} eventArgs Additional event arguments
	 * @param {Function} defaultFunction Default event handler
	 */
	firePointEvent: function (eventType, eventArgs, defaultFunction) {
		var point = this,
			series = this.series,
			seriesOptions = series.options;

		// load event handlers on demand to save time on mouseover/out
		if (seriesOptions.point.events[eventType] || (point.options && point.options.events && point.options.events[eventType])) {
			this.importEvents();
		}

		// add default handler if in selection mode
		if (eventType === 'click' && seriesOptions.allowPointSelect) {
			defaultFunction = function (event) {
				// Control key is for Windows, meta (= Cmd key) for Mac, Shift for Opera
				point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
			};
		}

		fireEvent(this, eventType, eventArgs, defaultFunction);
	},
	/**
	 * Import events from the series' and point's options. Only do it on
	 * demand, to save processing time on hovering.
	 */
	importEvents: function () {
		if (!this.hasImportedEvents) {
			var point = this,
				options = merge(point.series.options.point, point.options),
				events = options.events,
				eventType;

			point.events = events;

			for (eventType in events) {
				addEvent(point, eventType, events[eventType]);
			}
			this.hasImportedEvents = true;

		}
	},

	/**
	 * Set the point's state
	 * @param {String} state
	 */
	setState: function (state) {
		var point = this,
			plotX = point.plotX,
			plotY = point.plotY,
			series = point.series,
			stateOptions = series.options.states,
			markerOptions = defaultPlotOptions[series.type].marker && series.options.marker,
			normalDisabled = markerOptions && !markerOptions.enabled,
			markerStateOptions = markerOptions && markerOptions.states[state],
			stateDisabled = markerStateOptions && markerStateOptions.enabled === false,
			stateMarkerGraphic = series.stateMarkerGraphic,
			chart = series.chart,
			radius,
			pointAttr = point.pointAttr;

		state = state || NORMAL_STATE; // empty string

		if (
				// already has this state
				state === point.state ||
				// selected points don't respond to hover
				(point.selected && state !== SELECT_STATE) ||
				// series' state options is disabled
				(stateOptions[state] && stateOptions[state].enabled === false) ||
				// point marker's state options is disabled
				(state && (stateDisabled || (normalDisabled && !markerStateOptions.enabled)))

			) {
			return;
		}

		// apply hover styles to the existing point
		if (point.graphic) {
			radius = markerOptions && point.graphic.symbolName && pointAttr[state].r;
			point.graphic.attr(merge(
				pointAttr[state],
				radius ? { // new symbol attributes (#507, #612)
					x: plotX - radius,
					y: plotY - radius,
					width: 2 * radius,
					height: 2 * radius
				} : {}
			));
		} else {
			// if a graphic is not applied to each point in the normal state, create a shared
			// graphic for the hover state
			if (state) {
				if (!stateMarkerGraphic) {
					radius = markerOptions.radius;
					series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.symbol(
						series.symbol,
						-radius,
						-radius,
						2 * radius,
						2 * radius
					)
					.attr(pointAttr[state])
					.add(series.group);
				}

				stateMarkerGraphic.translate(
					plotX,
					plotY
				);
			}

			if (stateMarkerGraphic) {
				stateMarkerGraphic[state ? 'show' : 'hide']();
			}
		}

		point.state = state;
	}
};

/**
 * @classDescription The base function which all other series types inherit from. The data in the series is stored
 * in various arrays.
 *
 * - First, series.options.data contains all the original config options for
 * each point whether added by options or methods like series.addPoint.
 * - Next, series.data contains those values converted to points, but in case the series data length
 * exceeds the cropThreshold, or if the data is grouped, series.data doesn't contain all the points. It
 * only contains the points that have been created on demand.
 * - Then there's series.points that contains all currently visible point objects. In case of cropping,
 * the cropped-away points are not part of this array. The series.points array starts at series.cropStart
 * compared to series.data and series.options.data. If however the series data is grouped, these can't
 * be correlated one to one.
 * - series.xData and series.processedXData contain clean x values, equivalent to series.data and series.points.
 * - series.yData and series.processedYData contain clean x values, equivalent to series.data and series.points.
 *
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function () {};

Series.prototype = {

	isCartesian: true,
	type: 'line',
	pointClass: Point,
	sorted: true, // requires the data to be sorted
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		r: 'radius'
	},
	init: function (chart, options) {
		var series = this,
			eventType,
			events,
			//pointEvent,
			index = chart.series.length;

		series.chart = chart;
		series.options = options = series.setOptions(options); // merge with plotOptions
		
		// bind the axes
		series.bindAxes();

		// set some variables
		extend(series, {
			index: index,
			name: options.name || 'Series ' + (index + 1),
			state: NORMAL_STATE,
			pointAttr: {},
			visible: options.visible !== false, // true by default
			selected: options.selected === true // false by default
		});
		
		// special
		if (useCanVG) {
			options.animation = false;
		}

		// register event listeners
		events = options.events;
		for (eventType in events) {
			addEvent(series, eventType, events[eventType]);
		}
		if (
			(events && events.click) ||
			(options.point && options.point.events && options.point.events.click) ||
			options.allowPointSelect
		) {
			chart.runTrackerClick = true;
		}

		series.getColor();
		series.getSymbol();

		// set the data
		series.setData(options.data, false);

	},
	
	
	
	/**
	 * Set the xAxis and yAxis properties of cartesian series, and register the series
	 * in the axis.series array
	 */
	bindAxes: function () {
		var series = this,
			seriesOptions = series.options,
			chart = series.chart,
			axisOptions;
			
		if (series.isCartesian) {
			
			each(['xAxis', 'yAxis'], function (AXIS) { // repeat for xAxis and yAxis
				
				each(chart[AXIS], function (axis) { // loop through the chart's axis objects
					
					axisOptions = axis.options;
					
					// apply if the series xAxis or yAxis option mathches the number of the 
					// axis, or if undefined, use the first axis
					if ((seriesOptions[AXIS] === axisOptions.index) ||
							(seriesOptions[AXIS] === UNDEFINED && axisOptions.index === 0)) {
						
						// register this series in the axis.series lookup
						axis.series.push(series);
						
						// set this series.xAxis or series.yAxis reference
						series[AXIS] = axis;
						
						// mark dirty for redraw
						axis.isDirty = true;
					}
				});
				
			});
		}
	},


	/**
	 * Return an auto incremented x value based on the pointStart and pointInterval options.
	 * This is only used if an x value is not given for the point that calls autoIncrement.
	 */
	autoIncrement: function () {
		var series = this,
			options = series.options,
			xIncrement = series.xIncrement;

		xIncrement = pick(xIncrement, options.pointStart, 0);

		series.pointInterval = pick(series.pointInterval, options.pointInterval, 1);

		series.xIncrement = xIncrement + series.pointInterval;
		return xIncrement;
	},

	/**
	 * Divide the series data into segments divided by null values.
	 */
	getSegments: function () {
		var series = this,
			lastNull = -1,
			segments = [],
			i,
			points = series.points,
			pointsLength = points.length;

		if (pointsLength) { // no action required for []
			
			// if connect nulls, just remove null points
			if (series.options.connectNulls) {
				i = pointsLength;
				while (i--) {
					if (points[i].y === null) {
						points.splice(i, 1);
					}
				}
				if (points.length) {
					segments = [points];
				}
				
			// else, split on null points
			} else {
				each(points, function (point, i) {
					if (point.y === null) {
						if (i > lastNull + 1) {
							segments.push(points.slice(lastNull + 1, i));
						}
						lastNull = i;
					} else if (i === pointsLength - 1) { // last value
						segments.push(points.slice(lastNull + 1, i + 1));
					}
				});
			}
		}
		
		// register it
		series.segments = segments;
	},
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} itemOptions
	 */
	setOptions: function (itemOptions) {
		var series = this,
			chart = series.chart,
			chartOptions = chart.options,
			plotOptions = chartOptions.plotOptions,
			data = itemOptions.data,
			options;

		itemOptions.data = null; // remove from merge to prevent looping over the data set

		options = merge(
			plotOptions[this.type],
			plotOptions.series,
			itemOptions
		);
		
		// Re-insert the data array to the options and the original config (#717)
		options.data = itemOptions.data = data;
		
		// the tooltip options are merged between global and series specific options
		series.tooltipOptions = merge(chartOptions.tooltip, options.tooltip);
		
		return options;

	},
	/**
	 * Get the series' color
	 */
	getColor: function () {
		var defaultColors = this.chart.options.colors,
			counters = this.chart.counters;
		this.color = this.options.color || defaultColors[counters.color++] || '#0000ff';
		counters.wrapColor(defaultColors.length);
	},
	/**
	 * Get the series' symbol
	 */
	getSymbol: function () {
		var series = this,
			seriesMarkerOption = series.options.marker,
			chart = series.chart,
			defaultSymbols = chart.options.symbols,
			counters = chart.counters;
		series.symbol = seriesMarkerOption.symbol || defaultSymbols[counters.symbol++];
		
		// don't substract radius in image symbols (#604)
		if (/^url/.test(series.symbol)) {
			seriesMarkerOption.radius = 0;
		}
		counters.wrapSymbol(defaultSymbols.length);
	},

	/**
	 * Add a point dynamically after chart load time
	 * @param {Object} options Point options as given in series.data
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean} shift If shift is true, a point is shifted off the start
	 *    of the series as one is appended to the end.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	addPoint: function (options, redraw, shift, animation) {
		var series = this,
			data = series.data,
			graph = series.graph,
			area = series.area,
			chart = series.chart,
			xData = series.xData,
			yData = series.yData,
			currentShift = (graph && graph.shift) || 0,
			dataOptions = series.options.data,
			point;
			//point = (new series.pointClass()).init(series, options);

		setAnimation(animation, chart);

		// Make graph animate sideways
		if (graph && shift) { 
			graph.shift = currentShift + 1;
		}
		if (area) {
			if (shift) { // #780
				area.shift = currentShift + 1;
			}
			area.isArea = true; // needed in animation, both with and without shift
		}
		
		// Optional redraw, defaults to true
		redraw = pick(redraw, true);

		// Get options and push the point to xData, yData and series.options. In series.generatePoints
		// the Point instance will be created on demand and pushed to the series.data array.
		point = { series: series };
		series.pointClass.prototype.applyOptions.apply(point, [options]);
		xData.push(point.x);
		yData.push(series.valueCount === 4 ? [point.open, point.high, point.low, point.close] : point.y);
		dataOptions.push(options);


		// Shift the first point off the parallel arrays
		// todo: consider series.removePoint(i) method
		if (shift) {
			if (data[0] && data[0].remove) {
				data[0].remove(false);
			} else {
				data.shift();
				xData.shift();
				yData.shift();
				dataOptions.shift();
			}
		}
		series.getAttribs();

		// redraw
		series.isDirty = true;
		series.isDirtyData = true;
		if (redraw) {
			chart.redraw();
		}
	},

	/**
	 * Replace the series data with a new set of data
	 * @param {Object} data
	 * @param {Object} redraw
	 */
	setData: function (data, redraw) {
		var series = this,
			oldData = series.points,
			options = series.options,
			initialColor = series.initialColor,
			chart = series.chart,
			firstPoint = null,
			i;

		// reset properties
		series.xIncrement = null;
		series.pointRange = (series.xAxis && series.xAxis.categories && 1) || options.pointRange;
		
		if (defined(initialColor)) { // reset colors for pie
			chart.counters.color = initialColor;
		}
		
		// parallel arrays
		var xData = [],
			yData = [],
			dataLength = data ? data.length : [],
			turboThreshold = options.turboThreshold || 1000,
			pt,
			ohlc = series.valueCount === 4;

		// In turbo mode, only one- or twodimensional arrays of numbers are allowed. The
		// first value is tested, and we assume that all the rest are defined the same
		// way. Although the 'for' loops are similar, they are repeated inside each
		// if-else conditional for max performance.
		if (dataLength > turboThreshold) {
			
			// find the first non-null point
			i = 0;
			while (firstPoint === null && i < dataLength) {
				firstPoint = data[i];
				i++;
			}
		
		
			if (isNumber(firstPoint)) { // assume all points are numbers
				var x = pick(options.pointStart, 0),
					pointInterval = pick(options.pointInterval, 1);

				for (i = 0; i < dataLength; i++) {
					xData[i] = x;
					yData[i] = data[i];
					x += pointInterval;
				}
				series.xIncrement = x;
			} else if (isArray(firstPoint)) { // assume all points are arrays
				if (ohlc) { // [x, o, h, l, c]
					for (i = 0; i < dataLength; i++) {
						pt = data[i];
						xData[i] = pt[0];
						yData[i] = pt.slice(1, 5);
					}
				} else { // [x, y]
					for (i = 0; i < dataLength; i++) {
						pt = data[i];
						xData[i] = pt[0];
						yData[i] = pt[1];
					}
				}
			} /* else {
				error(12); // Highcharts expects configs to be numbers or arrays in turbo mode
			}*/
		} else {
			for (i = 0; i < dataLength; i++) {
				pt = { series: series };
				series.pointClass.prototype.applyOptions.apply(pt, [data[i]]);
				xData[i] = pt.x;
				yData[i] = ohlc ? [pt.open, pt.high, pt.low, pt.close] : pt.y;
			}
		}

		series.data = [];
		series.options.data = data;
		series.xData = xData;
		series.yData = yData;

		// destroy old points
		i = (oldData && oldData.length) || 0;
		while (i--) {
			if (oldData[i] && oldData[i].destroy) {
				oldData[i].destroy();
			}
		}

		// redraw
		series.isDirty = series.isDirtyData = chart.isDirtyBox = true;
		if (pick(redraw, true)) {
			chart.redraw(false);
		}
	},

	/**
	 * Remove a series and optionally redraw the chart
	 *
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */

	remove: function (redraw, animation) {
		var series = this,
			chart = series.chart;
		redraw = pick(redraw, true);

		if (!series.isRemoving) {  /* prevent triggering native event in jQuery
				(calling the remove function from the remove event) */
			series.isRemoving = true;

			// fire the event with a default handler of removing the point
			fireEvent(series, 'remove', null, function () {


				// destroy elements
				series.destroy();


				// redraw
				chart.isDirtyLegend = chart.isDirtyBox = true;
				if (redraw) {
					chart.redraw(animation);
				}
			});

		}
		series.isRemoving = false;
	},

	/**
	 * Process the data by cropping away unused data points if the series is longer
	 * than the crop threshold. This saves computing time for lage series.
	 */
	processData: function (force) {
		var series = this,
			processedXData = series.xData, // copied during slice operation below
			processedYData = series.yData,
			dataLength = processedXData.length,
			cropStart = 0,
			cropEnd = dataLength,
			cropped,
			distance,
			closestPointRange,
			xAxis = series.xAxis,
			i, // loop variable
			options = series.options,
			cropThreshold = options.cropThreshold,
			isCartesian = series.isCartesian;

		// If the series data or axes haven't changed, don't go through this. Return false to pass
		// the message on to override methods like in data grouping. 
		if (isCartesian && !series.isDirty && !xAxis.isDirty && !series.yAxis.isDirty && !force) {
			return false;
		}

		// optionally filter out points outside the plot area
		if (isCartesian && series.sorted && (!cropThreshold || dataLength > cropThreshold || series.forceCrop)) {
			var extremes = xAxis.getExtremes(),
				min = extremes.min,
				max = extremes.max;

			// it's outside current extremes
			if (processedXData[dataLength - 1] < min || processedXData[0] > max) {
				processedXData = [];
				processedYData = [];
			
			// only crop if it's actually spilling out
			} else if (processedXData[0] < min || processedXData[dataLength - 1] > max) {

				// iterate up to find slice start
				for (i = 0; i < dataLength; i++) {
					if (processedXData[i] >= min) {
						cropStart = mathMax(0, i - 1);
						break;
					}
				}
				// proceed to find slice end
				for (; i < dataLength; i++) {
					if (processedXData[i] > max) {
						cropEnd = i + 1;
						break;
					}
					
				}
				processedXData = processedXData.slice(cropStart, cropEnd);
				processedYData = processedYData.slice(cropStart, cropEnd);
				cropped = true;
			}
		}
		
		
		// Find the closest distance between processed points
		for (i = processedXData.length - 1; i > 0; i--) {
			distance = processedXData[i] - processedXData[i - 1];
			if (distance > 0 && (closestPointRange === UNDEFINED || distance < closestPointRange)) {
				closestPointRange = distance;
			}
		}
		
		// Record the properties
		series.cropped = cropped; // undefined or true
		series.cropStart = cropStart;
		series.processedXData = processedXData;
		series.processedYData = processedYData;
		
		if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
			series.pointRange = closestPointRange || 1;
		}
		series.closestPointRange = closestPointRange;
		
	},

	/**
	 * Generate the data point after the data has been processed by cropping away
	 * unused points and optionally grouped in Highcharts Stock.
	 */
	generatePoints: function () {
		var series = this,
			options = series.options,
			dataOptions = options.data,
			data = series.data,
			dataLength,
			processedXData = series.processedXData,
			processedYData = series.processedYData,
			pointClass = series.pointClass,
			processedDataLength = processedXData.length,
			cropStart = series.cropStart || 0,
			cursor,
			hasGroupedData = series.hasGroupedData,
			point,
			points = [],
			i;

		if (!data && !hasGroupedData) {
			var arr = [];
			arr.length = dataOptions.length;
			data = series.data = arr;
		}

		for (i = 0; i < processedDataLength; i++) {
			cursor = cropStart + i;
			if (!hasGroupedData) {
				if (data[cursor]) {
					point = data[cursor];
				} else {
					data[cursor] = point = (new pointClass()).init(series, dataOptions[cursor], processedXData[i]);
				}
				points[i] = point;
			} else {
				// splat the y data in case of ohlc data array
				points[i] = (new pointClass()).init(series, [processedXData[i]].concat(splat(processedYData[i])));
			}
		}

		// Hide cropped-away points - this only runs when the number of points is above cropThreshold, or when
		// swithching view from non-grouped data to grouped data (#637)	
		if (data && (processedDataLength !== (dataLength = data.length) || hasGroupedData)) {
			for (i = 0; i < dataLength; i++) {
				if (i === cropStart && !hasGroupedData) { // when has grouped data, clear all points
					i += processedDataLength;
				}
				if (data[i]) {
					data[i].destroyElements();
				}
			}
		}

		series.data = data;
		series.points = points;
	},

	/**
	 * Translate data points from raw data values to chart specific positioning data
	 * needed later in drawPoints, drawGraph and drawTracker.
	 */
	translate: function () {
		if (!this.processedXData) { // hidden series
			this.processData();
		}
		this.generatePoints();
		var series = this,
			chart = series.chart,
			options = series.options,
			stacking = options.stacking,
			xAxis = series.xAxis,
			categories = xAxis.categories,
			yAxis = series.yAxis,
			points = series.points,
			dataLength = points.length,
			hasModifyValue = !!series.modifyValue,
			isLastSeries,
			allStackSeries = yAxis.series,
			i = allStackSeries.length;
			
		// Is it the last visible series?
		while (i--) {
			if (allStackSeries[i].visible) {
				if (i === series.index) {
					isLastSeries = true;
				}
				break;
			}
		}
		
		// Translate each point
		for (i = 0; i < dataLength; i++) {
			var point = points[i],
				xValue = point.x,
				yValue = point.y,
				yBottom = point.low,
				stack = yAxis.stacks[(yValue < options.threshold ? '-' : '') + series.stackKey],
				pointStack,
				pointStackTotal;
				
			// get the plotX translation
			point.plotX = mathRound(xAxis.translate(xValue, 0, 0, 0, 1) * 10) / 10; // Math.round fixes #591

			// calculate the bottom y value for stacked series
			if (stacking && series.visible && stack && stack[xValue]) {
				pointStack = stack[xValue];
				pointStackTotal = pointStack.total;
				pointStack.cum = yBottom = pointStack.cum - yValue; // start from top
				yValue = yBottom + yValue;
				
				if (isLastSeries) {
					yBottom = options.threshold;
				}
				
				if (stacking === 'percent') {
					yBottom = pointStackTotal ? yBottom * 100 / pointStackTotal : 0;
					yValue = pointStackTotal ? yValue * 100 / pointStackTotal : 0;
				}

				point.percentage = pointStackTotal ? point.y * 100 / pointStackTotal : 0;
				point.stackTotal = pointStackTotal;
				point.stackY = yValue;
			}

			// Set translated yBottom or remove it
			point.yBottom = defined(yBottom) ? 
				yAxis.translate(yBottom, 0, 1, 0, 1) :
				null;
			
			// general hook, used for Highstock compare mode
			if (hasModifyValue) {
				yValue = series.modifyValue(yValue, point);
			}

			// Set the the plotY value, reset it for redraws
			point.plotY = (typeof yValue === 'number') ? 
				mathRound(yAxis.translate(yValue, 0, 1, 0, 1) * 10) / 10 : // Math.round fixes #591
				UNDEFINED;

			// set client related positions for mouse tracking
			point.clientX = chart.inverted ?
				chart.plotHeight - point.plotX :
				point.plotX; // for mouse tracking

			// some API data
			point.category = categories && categories[point.x] !== UNDEFINED ?
				categories[point.x] : point.x;


		}

		// now that we have the cropped data, build the segments
		series.getSegments();
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			points = [],
			pointsLength,
			plotSize = mathRound((inverted ? chart.plotTop : chart.plotLeft) + chart.plotSizeX),
			low,
			high,
			xAxis = series.xAxis,
			point,
			i,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension

		// don't waste resources if tracker is disabled
		if (series.options.enableMouseTracking === false) {
			return;
		}

		// renew
		if (renew) {
			series.tooltipPoints = null;
		}

		// concat segments to overcome null values
		each(series.segments || series.points, function (segment) {
			points = points.concat(segment);
		});

		// loop the concatenated points and apply each point to all the closest
		// pixel positions
		if (xAxis && xAxis.reversed) {
			points = points.reverse();//reverseArray(points);
		}

		//each(points, function (point, i) {
		pointsLength = points.length;
		for (i = 0; i < pointsLength; i++) {
			point = points[i];
			low = points[i - 1] ? points[i - 1]._high + 1 : 0;
			high = point._high = points[i + 1] ?
				(mathFloor((point.plotX + (points[i + 1] ? points[i + 1].plotX : plotSize)) / 2)) :
				plotSize;

			while (low <= high) {
				tooltipPoints[inverted ? plotSize - low++ : low++] = point;
			}
		}
		series.tooltipPoints = tooltipPoints;
	},

	/**
	 * Format the header of the tooltip
	 */
	tooltipHeaderFormatter: function (key) {
		var series = this,
			tooltipOptions = series.tooltipOptions,
			xDateFormat = tooltipOptions.xDateFormat || '%A, %b %e, %Y',
			xAxis = series.xAxis,
			isDateTime = xAxis && xAxis.options.type === 'datetime';
		
		return tooltipOptions.headerFormat
			.replace('{point.key}', isDateTime ? dateFormat(xDateFormat, key) :  key)
			.replace('{series.name}', series.name)
			.replace('{series.color}', series.color);
	},

	/**
	 * Series mouse over handler
	 */
	onMouseOver: function () {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries;

		if (!hasTouch && chart.mouseIsDown) {
			return;
		}

		// set normal state to previous series
		if (hoverSeries && hoverSeries !== series) {
			hoverSeries.onMouseOut();
		}

		// trigger the event, but to save processing time,
		// only if defined
		if (series.options.events.mouseOver) {
			fireEvent(series, 'mouseOver');
		}

		// hover this
		series.setState(HOVER_STATE);
		chart.hoverSeries = series;
	},

	/**
	 * Series mouse out handler
	 */
	onMouseOut: function () {
		// trigger the event only if listeners exist
		var series = this,
			options = series.options,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// trigger mouse out on the point, which must be in this series
		if (hoverPoint) {
			hoverPoint.onMouseOut();
		}

		// fire the mouse out event
		if (series && options.events.mouseOut) {
			fireEvent(series, 'mouseOut');
		}


		// hide the tooltip
		if (tooltip && !options.stickyTracking && !tooltip.shared) {
			tooltip.hide();
		}

		// set normal state
		series.setState();
		chart.hoverSeries = null;
	},

	/**
	 * Animate in the series
	 */
	animate: function (init) {
		var series = this,
			chart = series.chart,
			clipRect = series.clipRect,
			animation = series.options.animation;

		if (animation && !isObject(animation)) {
			animation = {};
		}

		if (init) { // initialize the animation
			if (!clipRect.isAnimating) { // apply it only for one of the series
				clipRect.attr('width', 0);
				clipRect.isAnimating = true;
			}

		} else { // run the animation
			clipRect.animate({
				width: chart.plotSizeX
			}, animation);

			// delete this function to allow it only once
			this.animate = null;
		}
	},


	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			pointAttr,
			points = series.points,
			chart = series.chart,
			plotX,
			plotY,
			i,
			point,
			radius,
			symbol,
			isImage,
			graphic;

		if (series.options.marker.enabled) {
			i = points.length;
			while (i--) {
				point = points[i];
				plotX = point.plotX;
				plotY = point.plotY;
				graphic = point.graphic;

				// only draw the point if y is defined
				if (plotY !== UNDEFINED && !isNaN(plotY)) {

					// shortcuts
					pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
					radius = pointAttr.r;
					symbol = pick(point.marker && point.marker.symbol, series.symbol);
					isImage = symbol.indexOf('url') === 0;

					if (graphic) { // update
						graphic.animate(extend({
							x: plotX - radius,
							y: plotY - radius
						}, graphic.symbolName ? { // don't apply to image symbols #507
							width: 2 * radius,
							height: 2 * radius
						} : {}));
					} else if (radius > 0 || isImage) {
						point.graphic = chart.renderer.symbol(
							symbol,
							plotX - radius,
							plotY - radius,
							2 * radius,
							2 * radius
						)
						.attr(pointAttr)
						.add(series.group);
					}
				}
			}
		}

	},

	/**
	 * Convert state properties from API naming conventions to SVG attributes
	 *
	 * @param {Object} options API options object
	 * @param {Object} base1 SVG attribute object to inherit from
	 * @param {Object} base2 Second level SVG attribute object to inherit from
	 */
	convertAttribs: function (options, base1, base2, base3) {
		var conversion = this.pointAttrToOptions,
			attr,
			option,
			obj = {};

		options = options || {};
		base1 = base1 || {};
		base2 = base2 || {};
		base3 = base3 || {};

		for (attr in conversion) {
			option = conversion[attr];
			obj[attr] = pick(options[option], base1[attr], base2[attr], base3[attr]);
		}
		return obj;
	},

	/**
	 * Get the state attributes. Each series type has its own set of attributes
	 * that are allowed to change on a point's state change. Series wide attributes are stored for
	 * all series, and additionally point specific attributes are stored for all
	 * points with individual marker options. If such options are not defined for the point,
	 * a reference to the series wide attributes is stored in point.pointAttr.
	 */
	getAttribs: function () {
		var series = this,
			normalOptions = defaultPlotOptions[series.type].marker ? series.options.marker : series.options,
			stateOptions = normalOptions.states,
			stateOptionsHover = stateOptions[HOVER_STATE],
			pointStateOptionsHover,
			seriesColor = series.color,
			normalDefaults = {
				stroke: seriesColor,
				fill: seriesColor
			},
			points = series.points,
			i,
			point,
			seriesPointAttr = [],
			pointAttr,
			pointAttrToOptions = series.pointAttrToOptions,
			hasPointSpecificOptions,
			key;

		// series type specific modifications
		if (series.options.marker) { // line, spline, area, areaspline, scatter

			// if no hover radius is given, default to normal radius + 2
			stateOptionsHover.radius = stateOptionsHover.radius || normalOptions.radius + 2;
			stateOptionsHover.lineWidth = stateOptionsHover.lineWidth || normalOptions.lineWidth + 1;

		} else { // column, bar, pie

			// if no hover color is given, brighten the normal color
			stateOptionsHover.color = stateOptionsHover.color ||
				Color(stateOptionsHover.color || seriesColor)
					.brighten(stateOptionsHover.brightness).get();
		}

		// general point attributes for the series normal state
		seriesPointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, normalDefaults);

		// HOVER_STATE and SELECT_STATE states inherit from normal state except the default radius
		each([HOVER_STATE, SELECT_STATE], function (state) {
			seriesPointAttr[state] =
					series.convertAttribs(stateOptions[state], seriesPointAttr[NORMAL_STATE]);
		});

		// set it
		series.pointAttr = seriesPointAttr;


		// Generate the point-specific attribute collections if specific point
		// options are given. If not, create a referance to the series wide point
		// attributes
		i = points.length;
		while (i--) {
			point = points[i];
			normalOptions = (point.options && point.options.marker) || point.options;
			if (normalOptions && normalOptions.enabled === false) {
				normalOptions.radius = 0;
			}
			hasPointSpecificOptions = false;

			// check if the point has specific visual options
			if (point.options) {
				for (key in pointAttrToOptions) {
					if (defined(normalOptions[pointAttrToOptions[key]])) {
						hasPointSpecificOptions = true;
					}
				}
			}



			// a specific marker config object is defined for the individual point:
			// create it's own attribute collection
			if (hasPointSpecificOptions) {

				pointAttr = [];
				stateOptions = normalOptions.states || {}; // reassign for individual point
				pointStateOptionsHover = stateOptions[HOVER_STATE] = stateOptions[HOVER_STATE] || {};

				// if no hover color is given, brighten the normal color
				if (!series.options.marker) { // column, bar, point
					pointStateOptionsHover.color =
						Color(pointStateOptionsHover.color || point.options.color)
							.brighten(pointStateOptionsHover.brightness ||
								stateOptionsHover.brightness).get();

				}

				// normal point state inherits series wide normal state
				pointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, seriesPointAttr[NORMAL_STATE]);

				// inherit from point normal and series hover
				pointAttr[HOVER_STATE] = series.convertAttribs(
					stateOptions[HOVER_STATE],
					seriesPointAttr[HOVER_STATE],
					pointAttr[NORMAL_STATE]
				);
				// inherit from point normal and series hover
				pointAttr[SELECT_STATE] = series.convertAttribs(
					stateOptions[SELECT_STATE],
					seriesPointAttr[SELECT_STATE],
					pointAttr[NORMAL_STATE]
				);



			// no marker config object is created: copy a reference to the series-wide
			// attribute collection
			} else {
				pointAttr = seriesPointAttr;
			}

			point.pointAttr = pointAttr;

		}

	},


	/**
	 * Clear DOM objects and free up memory
	 */
	destroy: function () {
		var series = this,
			chart = series.chart,
			seriesClipRect = series.clipRect,
			issue134 = /AppleWebKit\/533/.test(userAgent),
			destroy,
			i,
			data = series.data || [],
			point,
			prop,
			axis;

		// add event hook
		fireEvent(series, 'destroy');

		// remove all events
		removeEvent(series);
		
		// erase from axes
		each(['xAxis', 'yAxis'], function (AXIS) {
			axis = series[AXIS];
			if (axis) {
				erase(axis.series, series);
				axis.isDirty = true;
			}
		});

		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}

		// destroy all points with their elements
		i = data.length;
		while (i--) {
			point = data[i];
			if (point && point.destroy) {
				point.destroy();
			}
		}
		series.points = null;

		// If this series clipRect is not the global one (which is removed on chart.destroy) we
		// destroy it here.
		if (seriesClipRect && seriesClipRect !== chart.clipRect) {
			series.clipRect = seriesClipRect.destroy();
		}

		// destroy all SVGElements associated to the series
		each(['area', 'graph', 'dataLabelsGroup', 'group', 'tracker'], function (prop) {
			if (series[prop]) {

				// issue 134 workaround
				destroy = issue134 && prop === 'group' ?
					'hide' :
					'destroy';

				series[prop][destroy]();
			}
		});

		// remove from hoverSeries
		if (chart.hoverSeries === series) {
			chart.hoverSeries = null;
		}
		erase(chart.series, series);

		// clear all members
		for (prop in series) {
			delete series[prop];
		}
	},

	/**
	 * Draw the data labels
	 */
	drawDataLabels: function () {
		
		var series = this,
			seriesOptions = series.options,
			options = seriesOptions.dataLabels;
		
		if (options.enabled || series._hasPointLabels) {
			var x,
				y,
				points = series.points,
				pointOptions,
				generalOptions,
				str,
				dataLabelsGroup = series.dataLabelsGroup,
				chart = series.chart,
				xAxis = series.xAxis,
				groupLeft = xAxis ? xAxis.left : chart.plotLeft,
				yAxis = series.yAxis,
				groupTop = yAxis ? yAxis.top : chart.plotTop,
				renderer = chart.renderer,
				inverted = chart.inverted,
				seriesType = series.type,
				stacking = seriesOptions.stacking,
				isBarLike = seriesType === 'column' || seriesType === 'bar',
				vAlignIsNull = options.verticalAlign === null,
				yIsNull = options.y === null,
				fontMetrics = renderer.fontMetrics(options.style.fontSize), // height and baseline
				fontLineHeight = fontMetrics.h,
				fontBaseline = fontMetrics.b,
				dataLabel,
				enabled;

			if (isBarLike) {
				var defaultYs = {
					top: fontBaseline, 
					middle: fontBaseline - fontLineHeight / 2, 
					bottom: -fontLineHeight + fontBaseline
				};
				if (stacking) {
					// In stacked series the default label placement is inside the bars
					if (vAlignIsNull) {
						options = merge(options, {verticalAlign: 'middle'});
					}

					// If no y delta is specified, try to create a good default
					if (yIsNull) {
						options = merge(options, { y: defaultYs[options.verticalAlign]});
					}
				} else {
					// In non stacked series the default label placement is on top of the bars
					if (vAlignIsNull) {
						options = merge(options, {verticalAlign: 'top'});
					
					// If no y delta is specified, try to create a good default (like default bar)
					} else if (yIsNull) {
						options = merge(options, { y: defaultYs[options.verticalAlign]});
					}
					
				}
			}


			// create a separate group for the data labels to avoid rotation
			if (!dataLabelsGroup) {
				dataLabelsGroup = series.dataLabelsGroup =
					renderer.g('data-labels')
						.attr({
							visibility: series.visible ? VISIBLE : HIDDEN,
							zIndex: 6
						})
						.translate(groupLeft, groupTop)
						.add();
			} else {
				dataLabelsGroup.translate(groupLeft, groupTop);
			}
			
			// make the labels for each point
			generalOptions = options;
			each(points, function (point) {
				
				dataLabel = point.dataLabel;
				
				// Merge in individual options from point
				options = generalOptions; // reset changes from previous points
				pointOptions = point.options;
				if (pointOptions && pointOptions.dataLabels) {
					options = merge(options, pointOptions.dataLabels);
				}
				enabled = options.enabled;
				
				// Get the positions
				if (enabled) {
					var plotX = (point.barX && point.barX + point.barW / 2) || pick(point.plotX, -999),
						plotY = pick(point.plotY, -999),
						
						// if options.y is null, which happens by default on column charts, set the position
						// above or below the column depending on the threshold
						individualYDelta = options.y === null ? 
							(point.y >= seriesOptions.threshold ? 
								-fontLineHeight + fontBaseline : // below the threshold 
								fontBaseline) : // above the threshold
							options.y;
					
					x = (inverted ? chart.plotWidth - plotY : plotX) + options.x;
					y = mathRound((inverted ? chart.plotHeight - plotX : plotY) + individualYDelta);
					
				}
				
				// If the point is outside the plot area, destroy it. #678, #820
				if (dataLabel && series.isCartesian && (!chart.isInsidePlot(x, y) || !enabled)) {
					point.dataLabel = dataLabel.destroy();
				
				// Individual labels are disabled if the are explicitly disabled 
				// in the point options, or if they fall outside the plot area.
				} else if (enabled) {
					
					var align = options.align;
				
					// Get the string
					str = options.formatter.call(point.getLabelConfig(), options);
					
					// in columns, align the string to the column
					if (seriesType === 'column') {
						x += { left: -1, right: 1 }[align] * point.barW / 2 || 0;
					}
	
					if (!stacking && inverted && point.y < 0) {
						align = 'right';
						x -= 10;
					}
					
					// Determine the color
					options.style.color = pick(options.color, options.style.color, series.color, 'black');
	
					
					// update existing label
					if (dataLabel) {
						// vertically centered
						dataLabel
							.attr({
								text: str
							}).animate({
								x: x,
								y: y
							});
					// create new label
					} else if (defined(str)) {
						dataLabel = point.dataLabel = renderer[options.rotation ? 'text' : 'label']( // labels don't support rotation
							str,
							x,
							y,
							null,
							null,
							null,
							options.useHTML,
							true // baseline for backwards compat
						)
						.attr({
							align: align,
							fill: options.backgroundColor,
							stroke: options.borderColor,
							'stroke-width': options.borderWidth,
							r: options.borderRadius,
							rotation: options.rotation,
							padding: options.padding,
							zIndex: 1
						})
						.css(options.style)
						.add(dataLabelsGroup)
						.shadow(options.shadow);
					}
	
					if (isBarLike && seriesOptions.stacking && dataLabel) {
						var barX = point.barX,
							barY = point.barY,
							barW = point.barW,
							barH = point.barH;
	
						dataLabel.align(options, null,
							{
								x: inverted ? chart.plotWidth - barY - barH : barX,
								y: inverted ? chart.plotHeight - barX - barW : barY,
								width: inverted ? barH : barW,
								height: inverted ? barW : barH
							});
					}
					
					
				}
			});
		}
	},

	/**
	 * Draw the actual graph
	 */
	drawGraph: function () {
		var series = this,
			options = series.options,
			chart = series.chart,
			graph = series.graph,
			graphPath = [],
			fillColor,
			area = series.area,
			group = series.group,
			color = options.lineColor || series.color,
			lineWidth = options.lineWidth,
			dashStyle =  options.dashStyle,
			segmentPath,
			renderer = chart.renderer,
			translatedThreshold = series.yAxis.getThreshold(options.threshold),
			useArea = /^area/.test(series.type),
			singlePoints = [], // used in drawTracker
			areaPath = [],
			attribs;


		// divide into segments and build graph and area paths
		each(series.segments, function (segment) {
			segmentPath = [];

			// build the segment line
			each(segment, function (point, i) {

				if (series.getPointSpline) { // generate the spline as defined in the SplineSeries object
					segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i));

				} else {

					// moveTo or lineTo
					segmentPath.push(i ? L : M);

					// step line?
					if (i && options.step) {
						var lastPoint = segment[i - 1];
						segmentPath.push(
							point.plotX,
							lastPoint.plotY
						);
					}

					// normal line to next point
					segmentPath.push(
						point.plotX,
						point.plotY
					);
				}
			});

			// add the segment to the graph, or a single point for tracking
			if (segment.length > 1) {
				graphPath = graphPath.concat(segmentPath);
			} else {
				singlePoints.push(segment[0]);
			}

			// build the area
			if (useArea) {
				var areaSegmentPath = [],
					i,
					segLength = segmentPath.length;
				for (i = 0; i < segLength; i++) {
					areaSegmentPath.push(segmentPath[i]);
				}
				if (segLength === 3) { // for animation from 1 to two points
					areaSegmentPath.push(L, segmentPath[1], segmentPath[2]);
				}
				if (options.stacking && series.type !== 'areaspline') {
					
					// Follow stack back. Todo: implement areaspline. A general solution could be to 
					// reverse the entire graphPath of the previous series, though may be hard with
					// splines and with series with different extremes
					for (i = segment.length - 1; i >= 0; i--) {
					
						// step line?
						if (i < segment.length - 1 && options.step) {
							areaSegmentPath.push(segment[i + 1].plotX, segment[i].yBottom);
						}
						
						areaSegmentPath.push(segment[i].plotX, segment[i].yBottom);
					}

				} else { // follow zero line back
					areaSegmentPath.push(
						L,
						segment[segment.length - 1].plotX,
						translatedThreshold,
						L,
						segment[0].plotX,
						translatedThreshold
					);
				}
				areaPath = areaPath.concat(areaSegmentPath);
			}
		});

		// used in drawTracker:
		series.graphPath = graphPath;
		series.singlePoints = singlePoints;

		// draw the area if area series or areaspline
		if (useArea) {
			fillColor = pick(
				options.fillColor,
				Color(series.color).setOpacity(options.fillOpacity || 0.75).get()
			);
			if (area) {
				area.animate({ d: areaPath });

			} else {
				// draw the area
				series.area = series.chart.renderer.path(areaPath)
					.attr({
						fill: fillColor
					}).add(group);
			}
		}

		// draw the graph
		if (graph) {
			stop(graph); // cancel running animations, #459
			graph.animate({ d: graphPath });

		} else {
			if (lineWidth) {
				attribs = {
					'stroke': color,
					'stroke-width': lineWidth
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}

				series.graph = renderer.path(graphPath)
					.attr(attribs).add(group).shadow(options.shadow);
			}
		}
	},

	/**
	 * Initialize and perform group inversion on series.group and series.trackerGroup
	 */
	invertGroups: function () {
		var series = this,
			group = series.group,
			trackerGroup = series.trackerGroup,
			chart = series.chart;
		
		// A fixed size is needed for inversion to work
		function setInvert() {			
			var size = {
				width: series.yAxis.len,
				height: series.xAxis.len
			};
			
			// Set the series.group size
			group.attr(size).invert();
			
			// Set the tracker group size
			if (trackerGroup) {
				trackerGroup.attr(size).invert();
			}
		}

		addEvent(chart, 'resize', setInvert); // do it on resize
		addEvent(series, 'destroy', function () {
			removeEvent(chart, 'resize', setInvert);
		});

		// Do it now
		setInvert(); // do it now
		
		// On subsequent render and redraw, just do setInvert without setting up events again
		series.invertGroups = setInvert;
	},

	/**
	 * Render the graph and markers
	 */
	render: function () {
		var series = this,
			chart = series.chart,
			group,
			options = series.options,
			doClip = options.clip !== false,
			animation = options.animation,
			doAnimation = animation && series.animate,
			duration = doAnimation ? (animation && animation.duration) || 500 : 0,
			clipRect = series.clipRect,
			renderer = chart.renderer;


		// Add plot area clipping rectangle. If this is before chart.hasRendered,
		// create one shared clipRect.

		// Todo: since creating the clip property, the clipRect is created but
		// never used when clip is false. A better way would be that the animation
		// would run, then the clipRect destroyed.
		if (!clipRect) {
			clipRect = series.clipRect = !chart.hasRendered && chart.clipRect ?
				chart.clipRect :
				renderer.clipRect(0, 0, chart.plotSizeX, chart.plotSizeY + 1);
			if (!chart.clipRect) {
				chart.clipRect = clipRect;
			}
		}
		

		// the group
		if (!series.group) {
			group = series.group = renderer.g('series');

			group.attr({
					visibility: series.visible ? VISIBLE : HIDDEN,
					zIndex: options.zIndex
				})
				.translate(series.xAxis.left, series.yAxis.top)
				.add(chart.seriesGroup);
		}

		series.drawDataLabels();

		// initiate the animation
		if (doAnimation) {
			series.animate(true);
		}

		// cache attributes for shapes
		series.getAttribs();

		// draw the graph if any
		if (series.drawGraph) {
			series.drawGraph();
		}

		// draw the points
		series.drawPoints();

		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}
		
		// Handle inverted series and tracker groups
		if (chart.inverted) {
			series.invertGroups();
		}
		
		// Do the initial clipping. This must be done after inverting for VML.
		if (doClip && !series.hasRendered) {
			group.clip(clipRect);
			if (series.trackerGroup) {
				series.trackerGroup.clip(chart.clipRect);
			}
		}
			

		// run the animation
		if (doAnimation) {
			series.animate();
		}

		// finish the individual clipRect
		setTimeout(function () {
			clipRect.isAnimating = false;
			group = series.group; // can be destroyed during the timeout
			if (group && clipRect !== chart.clipRect && clipRect.renderer) {
				if (doClip) {
					group.clip((series.clipRect = chart.clipRect));
				}
				clipRect.destroy();
			}
		}, duration);

		series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		// (See #322) series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		series.hasRendered = true;
	},

	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function () {
		var series = this,
			chart = series.chart,
			wasDirtyData = series.isDirtyData, // cache it here as it is set to false in render, but used after
			group = series.group;

		// reposition on resize
		if (group) {
			if (chart.inverted) {
				group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				});
			}

			group.animate({
				translateX: series.xAxis.left,
				translateY: series.yAxis.top
			});
		}

		series.translate();
		series.setTooltipPoints(true);

		series.render();
		if (wasDirtyData) {
			fireEvent(series, 'updatedData');
		}
	},

	/**
	 * Set the state of the graph
	 */
	setState: function (state) {
		var series = this,
			options = series.options,
			graph = series.graph,
			stateOptions = options.states,
			lineWidth = options.lineWidth;

		state = state || NORMAL_STATE;

		if (series.state !== state) {
			series.state = state;

			if (stateOptions[state] && stateOptions[state].enabled === false) {
				return;
			}

			if (state) {
				lineWidth = stateOptions[state].lineWidth || lineWidth + 1;
			}

			if (graph && !graph.dashstyle) { // hover is turned off for dashed lines in VML
				graph.attr({ // use attr because animate will cause any other animation on the graph to stop
					'stroke-width': lineWidth
				}, state ? 0 : 500);
			}
		}
	},

	/**
	 * Set the visibility of the graph
	 *
	 * @param vis {Boolean} True to show the series, false to hide. If UNDEFINED,
	 *        the visibility is toggled.
	 */
	setVisible: function (vis, redraw) {
		var series = this,
			chart = series.chart,
			legendItem = series.legendItem,
			seriesGroup = series.group,
			seriesTracker = series.tracker,
			dataLabelsGroup = series.dataLabelsGroup,
			showOrHide,
			i,
			points = series.points,
			point,
			ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
			oldVisibility = series.visible;

		// if called without an argument, toggle visibility
		series.visible = vis = vis === UNDEFINED ? !oldVisibility : vis;
		showOrHide = vis ? 'show' : 'hide';

		// show or hide series
		if (seriesGroup) { // pies don't have one
			seriesGroup[showOrHide]();
		}

		// show or hide trackers
		if (seriesTracker) {
			seriesTracker[showOrHide]();
		} else if (points) {
			i = points.length;
			while (i--) {
				point = points[i];
				if (point.tracker) {
					point.tracker[showOrHide]();
				}
			}
		}


		if (dataLabelsGroup) {
			dataLabelsGroup[showOrHide]();
		}

		if (legendItem) {
			chart.legend.colorizeItem(series, vis);
		}


		// rescale or adapt to resized chart
		series.isDirty = true;
		// in a stack, all other series are affected
		if (series.options.stacking) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.options.stacking && otherSeries.visible) {
					otherSeries.isDirty = true;
				}
			});
		}

		if (ignoreHiddenSeries) {
			chart.isDirtyBox = true;
		}
		if (redraw !== false) {
			chart.redraw();
		}

		fireEvent(series, showOrHide);
	},

	/**
	 * Show the graph
	 */
	show: function () {
		this.setVisible(true);
	},

	/**
	 * Hide the graph
	 */
	hide: function () {
		this.setVisible(false);
	},


	/**
	 * Set the selected state of the graph
	 *
	 * @param selected {Boolean} True to select the series, false to unselect. If
	 *        UNDEFINED, the selection state is toggled.
	 */
	select: function (selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === UNDEFINED) ? !series.selected : selected;

		if (series.checkbox) {
			series.checkbox.checked = selected;
		}

		fireEvent(series, selected ? 'select' : 'unselect');
	},

	/**
	 * Create a group that holds the tracking object or objects. This allows for
	 * individual clipping and placement of each series tracker.
	 */
	drawTrackerGroup: function () {
		var trackerGroup = this.trackerGroup,
			chart = this.chart;
		
		if (this.isCartesian) {
		
			// Generate it on first call
			if (!trackerGroup) {	
				this.trackerGroup = trackerGroup = chart.renderer.g()
					.attr({
						zIndex: this.options.zIndex || 1
					})
					.add(chart.trackerGroup);
					
			}
			// Place it on first and subsequent (redraw) calls
			trackerGroup.translate(this.xAxis.left, this.yAxis.top);
			
		}
		
		return trackerGroup;
	},
	
	/**
	 * Draw the tracker object that sits above all data labels and markers to
	 * track mouse events on the graph or points. For the line type charts
	 * the tracker uses the same graphPath, but with a greater stroke width
	 * for better control.
	 */
	drawTracker: function () {
		var series = this,
			options = series.options,
			trackerPath = [].concat(series.graphPath),
			trackerPathLength = trackerPath.length,
			chart = series.chart,
			renderer = chart.renderer,
			snap = chart.options.tooltip.snap,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			singlePoints = series.singlePoints,
			trackerGroup = series.drawTrackerGroup(),
			singlePoint,
			i;

		// Extend end points. A better way would be to use round linecaps,
		// but those are not clickable in VML.
		if (trackerPathLength) {
			i = trackerPathLength + 1;
			while (i--) {
				if (trackerPath[i] === M) { // extend left side
					trackerPath.splice(i + 1, 0, trackerPath[i + 1] - snap, trackerPath[i + 2], L);
				}
				if ((i && trackerPath[i] === M) || i === trackerPathLength) { // extend right side
					trackerPath.splice(i, 0, L, trackerPath[i - 2] + snap, trackerPath[i - 1]);
				}
			}
		}

		// handle single points
		for (i = 0; i < singlePoints.length; i++) {
			singlePoint = singlePoints[i];
			trackerPath.push(M, singlePoint.plotX - snap, singlePoint.plotY,
				L, singlePoint.plotX + snap, singlePoint.plotY);
		}
		
		

		// draw the tracker
		if (tracker) {
			tracker.attr({ d: trackerPath });

		} else { // create
				
			series.tracker = renderer.path(trackerPath)
				.attr({
					isTracker: true,
					stroke: TRACKER_FILL,
					fill: NONE,
					'stroke-linejoin': 'bevel',
					'stroke-width' : options.lineWidth + 2 * snap,
					visibility: series.visible ? VISIBLE : HIDDEN
				})
				.on(hasTouch ? 'touchstart' : 'mouseover', function () {
					if (chart.hoverSeries !== series) {
						series.onMouseOver();
					}
				})
				.on('mouseout', function () {
					if (!options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css)
				.add(trackerGroup);
		}

	}

}; // end Series prototype


/**
 * LineSeries object
 */
var LineSeries = extendClass(Series);
seriesTypes.line = LineSeries;

/**
 * AreaSeries object
 */
var AreaSeries = extendClass(Series, {
	type: 'area'
});
seriesTypes.area = AreaSeries;




/**
 * SplineSeries object
 */
var SplineSeries = extendClass(Series, {
	type: 'spline',

	/**
	 * Draw the actual graph
	 */
	getPointSpline: function (segment, point, i) {
		var smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc
			denom = smoothing + 1,
			plotX = point.plotX,
			plotY = point.plotY,
			lastPoint = segment[i - 1],
			nextPoint = segment[i + 1],
			leftContX,
			leftContY,
			rightContX,
			rightContY,
			ret;

		// find control points
		if (i && i < segment.length - 1) {
			var lastX = lastPoint.plotX,
				lastY = lastPoint.plotY,
				nextX = nextPoint.plotX,
				nextY = nextPoint.plotY,
				correction;

			leftContX = (smoothing * plotX + lastX) / denom;
			leftContY = (smoothing * plotY + lastY) / denom;
			rightContX = (smoothing * plotX + nextX) / denom;
			rightContY = (smoothing * plotY + nextY) / denom;

			// have the two control points make a straight line through main point
			correction = ((rightContY - leftContY) * (rightContX - plotX)) /
				(rightContX - leftContX) + plotY - rightContY;

			leftContY += correction;
			rightContY += correction;

			// to prevent false extremes, check that control points are between
			// neighbouring points' y values
			if (leftContY > lastY && leftContY > plotY) {
				leftContY = mathMax(lastY, plotY);
				rightContY = 2 * plotY - leftContY; // mirror of left control point
			} else if (leftContY < lastY && leftContY < plotY) {
				leftContY = mathMin(lastY, plotY);
				rightContY = 2 * plotY - leftContY;
			}
			if (rightContY > nextY && rightContY > plotY) {
				rightContY = mathMax(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			} else if (rightContY < nextY && rightContY < plotY) {
				rightContY = mathMin(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			}

			// record for drawing in next point
			point.rightContX = rightContX;
			point.rightContY = rightContY;

		}

		// moveTo or lineTo
		if (!i) {
			ret = [M, plotX, plotY];
		} else { // curve from last point to this
			ret = [
				'C',
				lastPoint.rightContX || lastPoint.plotX,
				lastPoint.rightContY || lastPoint.plotY,
				leftContX || plotX,
				leftContY || plotY,
				plotX,
				plotY
			];
			lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
		}
		return ret;
	}
});
seriesTypes.spline = SplineSeries;



/**
 * AreaSplineSeries object
 */
var AreaSplineSeries = extendClass(SplineSeries, {
	type: 'areaspline'
});
seriesTypes.areaspline = AreaSplineSeries;

/**
 * ColumnSeries object
 */
var ColumnSeries = extendClass(Series, {
	type: 'column',
	tooltipOutsidePlot: true,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		r: 'borderRadius'
	},
	init: function () {
		Series.prototype.init.apply(this, arguments);

		var series = this,
			chart = series.chart;

		// if the series is added dynamically, force redraw of other
		// series affected by a new column
		if (chart.hasRendered) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.type === series.type) {
					otherSeries.isDirty = true;
				}
			});
		}
	},

	/**
	 * Translate each point to the plot area coordinate system and find shape positions
	 */
	translate: function () {
		var series = this,
			chart = series.chart,
			options = series.options,
			stacking = options.stacking,
			borderWidth = options.borderWidth,
			columnCount = 0,
			xAxis = series.xAxis,
			reversedXAxis = xAxis.reversed,
			stackGroups = {},
			stackKey,
			columnIndex;

		Series.prototype.translate.apply(series);

		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		each(chart.series, function (otherSeries) {
			if (otherSeries.type === series.type && otherSeries.visible &&
					series.options.group === otherSeries.options.group) { // used in Stock charts navigator series
				if (otherSeries.options.stacking) {
					stackKey = otherSeries.stackKey;
					if (stackGroups[stackKey] === UNDEFINED) {
						stackGroups[stackKey] = columnCount++;
					}
					columnIndex = stackGroups[stackKey];
				} else {
					columnIndex = columnCount++;
				}
				otherSeries.columnIndex = columnIndex;
			}
		});

		// calculate the width and position of each column based on
		// the number of column series in the plot, the groupPadding
		// and the pointPadding options
		var points = series.points,
			categoryWidth = mathAbs(xAxis.translationSlope) * (xAxis.ordinalSlope || xAxis.closestPointRange || 1),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 :
				pointOffsetWidth * options.pointPadding,
			pointWidth = mathCeil(mathMax(pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding), 1 + 2 * borderWidth)),
			colIndex = (reversedXAxis ? columnCount -
				series.columnIndex : series.columnIndex) || 0,
			pointXOffset = pointPadding + (groupPadding + colIndex *
				pointOffsetWidth - (categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1),
			threshold = options.threshold,
			translatedThreshold = series.yAxis.getThreshold(threshold),
			minPointLength = pick(options.minPointLength, 5);

		// record the new values
		each(points, function (point) {
			var plotY = point.plotY,
				yBottom = pick(point.yBottom, translatedThreshold),
				barX = point.plotX + pointXOffset,
				barY = mathCeil(mathMin(plotY, yBottom)),
				barH = mathCeil(mathMax(plotY, yBottom) - barY),
				stack = series.yAxis.stacks[(point.y < 0 ? '-' : '') + series.stackKey],
				shapeArgs;

			// Record the offset'ed position and width of the bar to be able to align the stacking total correctly
			if (stacking && series.visible && stack && stack[point.x]) {
				stack[point.x].setOffset(pointXOffset, pointWidth);
			}

			// handle options.minPointLength
			if (mathAbs(barH) < minPointLength) {
				if (minPointLength) {
					barH = minPointLength;
					barY =
						mathAbs(barY - translatedThreshold) > minPointLength ? // stacked
							yBottom - minPointLength : // keep position
							translatedThreshold - (plotY <= translatedThreshold ? minPointLength : 0);
				}
			}

			extend(point, {
				barX: barX,
				barY: barY,
				barW: pointWidth,
				barH: barH
			});

			// create shape type and shape args that are reused in drawPoints and drawTracker
			point.shapeType = 'rect';
			shapeArgs = {
				x: barX,
				y: barY,
				width: pointWidth,
				height: barH,
				r: options.borderRadius,
				strokeWidth: borderWidth
			};
			
			if (borderWidth % 2) { // correct for shorting in crisp method, visible in stacked columns with 1px border
				shapeArgs.y -= 1;
				shapeArgs.height += 1;
			}
			point.shapeArgs = shapeArgs;

			// make small columns responsive to mouse
			point.trackerArgs = mathAbs(barH) < 3 && merge(point.shapeArgs, {
				height: 6,
				y: barY - 3
			});
		});

	},

	getSymbol: function () {
	},

	/**
	 * Columns have no graph
	 */
	drawGraph: function () {},

	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 *
	 */
	drawPoints: function () {
		var series = this,
			options = series.options,
			renderer = series.chart.renderer,
			graphic,
			shapeArgs;


		// draw the columns
		each(series.points, function (point) {
			var plotY = point.plotY;
			if (plotY !== UNDEFINED && !isNaN(plotY) && point.y !== null) {
				graphic = point.graphic;
				shapeArgs = point.shapeArgs;
				if (graphic) { // update
					stop(graphic);
					graphic.animate(renderer.Element.prototype.crisp.apply({}, [
						shapeArgs.strokeWidth,
						shapeArgs.x,
						shapeArgs.y,
						shapeArgs.width,
						shapeArgs.height
					]));

				} else {
					point.graphic = graphic = renderer[point.shapeType](shapeArgs)
						.attr(point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE])
						.add(series.group)
						.shadow(options.shadow);
						
				}

			}
		});
	},
	/**
	 * Draw the individual tracker elements.
	 * This method is inherited by scatter and pie charts too.
	 */
	drawTracker: function () {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			shapeArgs,
			tracker,
			trackerLabel = +new Date(),
			options = series.options,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			trackerGroup = series.drawTrackerGroup(),
			rel;
			
		each(series.points, function (point) {
			tracker = point.tracker;
			shapeArgs = point.trackerArgs || point.shapeArgs;
			delete shapeArgs.strokeWidth;
			if (point.y !== null) {
				if (tracker) {// update
					tracker.attr(shapeArgs);

				} else {
					point.tracker =
						renderer[point.shapeType](shapeArgs)
						.attr({
							isTracker: trackerLabel,
							fill: TRACKER_FILL,
							visibility: series.visible ? VISIBLE : HIDDEN
						})
						.on(hasTouch ? 'touchstart' : 'mouseover', function (event) {
							rel = event.relatedTarget || event.fromElement;
							if (chart.hoverSeries !== series && attr(rel, 'isTracker') !== trackerLabel) {
								series.onMouseOver();
							}
							point.onMouseOver();

						})
						.on('mouseout', function (event) {
							if (!options.stickyTracking) {
								rel = event.relatedTarget || event.toElement;
								if (attr(rel, 'isTracker') !== trackerLabel) {
									series.onMouseOut();
								}
							}
						})
						.css(css)
						.add(point.group || trackerGroup); // pies have point group - see issue #118
				}
			}
		});
	},


	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it
	 */
	animate: function (init) {
		var series = this,
			points = series.points,
			options = series.options;

		if (!init) { // run the animation
			/*
			 * Note: Ideally the animation should be initialized by calling
			 * series.group.hide(), and then calling series.group.show()
			 * after the animation was started. But this rendered the shadows
			 * invisible in IE8 standards mode. If the columns flicker on large
			 * datasets, this is the cause.
			 */

			each(points, function (point) {
				var graphic = point.graphic,
					shapeArgs = point.shapeArgs,
					yAxis = series.yAxis,
					threshold = options.threshold;

				if (graphic) {
					// start values
					graphic.attr({
						height: 0,
						y: defined(threshold) ? 
							yAxis.getThreshold(threshold) :
							yAxis.translate(yAxis.getExtremes().min, 0, 1, 0, 1)
					});

					// animate
					graphic.animate({
						height: shapeArgs.height,
						y: shapeArgs.y
					}, options.animation);
				}
			});


			// delete this function to allow it only once
			series.animate = null;
		}

	},
	/**
	 * Remove this series from the chart
	 */
	remove: function () {
		var series = this,
			chart = series.chart;

		// column and bar series affects other series of the same type
		// as they are either stacked or grouped
		if (chart.hasRendered) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.type === series.type) {
					otherSeries.isDirty = true;
				}
			});
		}

		Series.prototype.remove.apply(series, arguments);
	}
});
seriesTypes.column = ColumnSeries;

var BarSeries = extendClass(ColumnSeries, {
	type: 'bar',
	init: function () {
		this.inverted = true;
		ColumnSeries.prototype.init.apply(this, arguments);
	}
});
seriesTypes.bar = BarSeries;

/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	sorted: false,
	/**
	 * Extend the base Series' translate method by adding shape type and
	 * arguments for the point trackers
	 */
	translate: function () {
		var series = this;

		Series.prototype.translate.apply(series);

		each(series.points, function (point) {
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: series.chart.options.tooltip.snap
			};
		});
	},

	/**
	 * Add tracking event listener to the series group, so the point graphics
	 * themselves act as trackers
	 */
	drawTracker: function () {
		var series = this,
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			points = series.points,
			i = points.length,
			graphic;

		// Set an expando property for the point index, used below
		while (i--) {
			graphic = points[i].graphic;
			if (graphic) { // doesn't exist for null points
				graphic.element._i = i; 
			}
		}
		
		// Add the event listeners, we need to do this only once
		if (!series._hasTracking) {
			series.group
				.attr({
					isTracker: true
				})
				.on(hasTouch ? 'touchstart' : 'mouseover', function (e) {
					series.onMouseOver();
					if (e.target._i !== UNDEFINED) { // undefined on graph in scatterchart
						points[e.target._i].onMouseOver();
					}
				})
				.on('mouseout', function () {
					if (!series.options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css);
		} else {
			series._hasTracking = true;
		}

	}
});
seriesTypes.scatter = ScatterSeries;

/**
 * Extended point object for pies
 */
var PiePoint = extendClass(Point, {
	/**
	 * Initiate the pie slice
	 */
	init: function () {

		Point.prototype.init.apply(this, arguments);

		var point = this,
			toggleSlice;

		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice')
		});

		// add event listener for select
		toggleSlice = function () {
			point.slice();
		};
		addEvent(point, 'select', toggleSlice);
		addEvent(point, 'unselect', toggleSlice);

		return point;
	},

	/**
	 * Toggle the visibility of the pie slice
	 * @param {Boolean} vis Whether to show the slice or not. If undefined, the
	 *    visibility is toggled
	 */
	setVisible: function (vis) {
		var point = this,
			chart = point.series.chart,
			tracker = point.tracker,
			dataLabel = point.dataLabel,
			connector = point.connector,
			shadowGroup = point.shadowGroup,
			method;

		// if called without an argument, toggle visibility
		point.visible = vis = vis === UNDEFINED ? !point.visible : vis;

		method = vis ? 'show' : 'hide';

		point.group[method]();
		if (tracker) {
			tracker[method]();
		}
		if (dataLabel) {
			dataLabel[method]();
		}
		if (connector) {
			connector[method]();
		}
		if (shadowGroup) {
			shadowGroup[method]();
		}
		if (point.legendItem) {
			chart.legend.colorizeItem(point, vis);
		}
	},

	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function (sliced, redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			slicedTranslation = point.slicedTranslation,
			translation;

		setAnimation(animation, chart);

		// redraw is true by default
		redraw = pick(redraw, true);

		// if called without an argument, toggle
		sliced = point.sliced = defined(sliced) ? sliced : !point.sliced;

		translation = {
			translateX: (sliced ? slicedTranslation[0] : chart.plotLeft),
			translateY: (sliced ? slicedTranslation[1] : chart.plotTop)
		};
		point.group.animate(translation);
		if (point.shadowGroup) {
			point.shadowGroup.animate(translation);
		}

	}
});

/**
 * The Pie series class
 */
var PieSeries = extendClass(Series, {
	type: 'pie',
	isCartesian: false,
	pointClass: PiePoint,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color'
	},

	/**
	 * Pies have one color each point
	 */
	getColor: function () {
		// record first color for use in setData
		this.initialColor = this.chart.counters.color;
	},

	/**
	 * Animate the column heights one by one from zero
	 */
	animate: function () {
		var series = this,
			points = series.points;

		each(points, function (point) {
			var graphic = point.graphic,
				args = point.shapeArgs,
				up = -mathPI / 2;

			if (graphic) {
				// start values
				graphic.attr({
					r: 0,
					start: up,
					end: up
				});

				// animate
				graphic.animate({
					r: args.r,
					start: args.start,
					end: args.end
				}, series.options.animation);
			}
		});

		// delete this function to allow it only once
		series.animate = null;

	},

	/**
	 * Extend the basic setData method by running processData and generatePoints immediately,
	 * in order to access the points from the legend.
	 */
	setData: function () {
		Series.prototype.setData.apply(this, arguments);
		this.processData();
		this.generatePoints();
	},
	/**
	 * Do translation for pie slices
	 */
	translate: function () {
		this.generatePoints();
		
		var total = 0,
			series = this,
			cumulative = -0.25, // start at top
			precision = 1000, // issue #172
			options = series.options,
			slicedOffset = options.slicedOffset,
			connectorOffset = slicedOffset + options.borderWidth,
			positions = options.center.concat([options.size, options.innerSize || 0]),
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			start,
			end,
			angle,
			points = series.points,
			circ = 2 * mathPI,
			fraction,
			smallestSize = mathMin(plotWidth, plotHeight),
			isPercent,
			radiusX, // the x component of the radius vector for a given point
			radiusY,
			labelDistance = options.dataLabels.distance;

		// get positions - either an integer or a percentage string must be given
		positions = map(positions, function (length, i) {

			isPercent = /%$/.test(length);
			return isPercent ?
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to smallestSize
				// i == 4: innerSize, relative to smallestSize
				[plotWidth, plotHeight, smallestSize, smallestSize][i] *
					pInt(length) / 100 :
				length;
		});

		// utility for getting the x value from a given y, used for anticollision logic in data labels
		series.getX = function (y, left) {

			angle = math.asin((y - positions[1]) / (positions[2] / 2 + labelDistance));

			return positions[0] +
				(left ? -1 : 1) *
				(mathCos(angle) * (positions[2] / 2 + labelDistance));
		};

		// set center for later use
		series.center = positions;

		// get the total sum
		each(points, function (point) {
			total += point.y;
		});

		each(points, function (point) {
			// set start and end angle
			fraction = total ? point.y / total : 0;
			start = mathRound(cumulative * circ * precision) / precision;
			cumulative += fraction;
			end = mathRound(cumulative * circ * precision) / precision;

			// set the shape
			point.shapeType = 'arc';
			point.shapeArgs = {
				x: positions[0],
				y: positions[1],
				r: positions[2] / 2,
				innerR: positions[3] / 2,
				start: start,
				end: end
			};

			// center for the sliced out slice
			angle = (end + start) / 2;
			point.slicedTranslation = map([
				mathCos(angle) * slicedOffset + chart.plotLeft,
				mathSin(angle) * slicedOffset + chart.plotTop
			], mathRound);

			// set the anchor point for tooltips
			radiusX = mathCos(angle) * positions[2] / 2;
			radiusY = mathSin(angle) * positions[2] / 2;
			point.tooltipPos = [
				positions[0] + radiusX * 0.7,
				positions[1] + radiusY * 0.7
			];

			// set the anchor point for data labels
			point.labelPos = [
				positions[0] + radiusX + mathCos(angle) * labelDistance, // first break of connector
				positions[1] + radiusY + mathSin(angle) * labelDistance, // a/a
				positions[0] + radiusX + mathCos(angle) * connectorOffset, // second break, right outside pie
				positions[1] + radiusY + mathSin(angle) * connectorOffset, // a/a
				positions[0] + radiusX, // landing point for connector
				positions[1] + radiusY, // a/a
				labelDistance < 0 ? // alignment
					'center' :
					angle < circ / 4 ? 'left' : 'right', // alignment
				angle // center angle
			];

			// API properties
			point.percentage = fraction * 100;
			point.total = total;

		});


		this.setTooltipPoints();
	},

	/**
	 * Render the slices
	 */
	render: function () {
		var series = this;

		// cache attributes for shapes
		series.getAttribs();

		this.drawPoints();

		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}

		this.drawDataLabels();

		if (series.options.animation && series.animate) {
			series.animate();
		}

		// (See #322) series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		series.isDirty = false; // means data is in accordance with what you see
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			groupTranslation,
			//center,
			graphic,
			group,
			shadow = series.options.shadow,
			shadowGroup,
			shapeArgs;

		// draw the slices
		each(series.points, function (point) {
			graphic = point.graphic;
			shapeArgs = point.shapeArgs;
			group = point.group;
			shadowGroup = point.shadowGroup;

			// put the shadow behind all points
			if (shadow && !shadowGroup) {
				shadowGroup = point.shadowGroup = renderer.g('shadow')
					.attr({ zIndex: 4 })
					.add();
			}

			// create the group the first time
			if (!group) {
				group = point.group = renderer.g('point')
					.attr({ zIndex: 5 })
					.add();
			}

			// if the point is sliced, use special translation, else use plot area traslation
			groupTranslation = point.sliced ? point.slicedTranslation : [chart.plotLeft, chart.plotTop];
			group.translate(groupTranslation[0], groupTranslation[1]);
			if (shadowGroup) {
				shadowGroup.translate(groupTranslation[0], groupTranslation[1]);
			}

			// draw the slice
			if (graphic) {
				graphic.animate(shapeArgs);
			} else {
				point.graphic =
					renderer.arc(shapeArgs)
					.attr(extend(
						point.pointAttr[NORMAL_STATE],
						{ 'stroke-linejoin': 'round' }
					))
					.add(point.group)
					.shadow(shadow, shadowGroup);
			}

			// detect point specific visibility
			if (point.visible === false) {
				point.setVisible(false);
			}

		});

	},

	/**
	 * Override the base drawDataLabels method by pie specific functionality
	 */
	drawDataLabels: function () {
		var series = this,
			data = series.data,
			point,
			chart = series.chart,
			options = series.options.dataLabels,
			connectorPadding = pick(options.connectorPadding, 10),
			connectorWidth = pick(options.connectorWidth, 1),
			connector,
			connectorPath,
			softConnector = pick(options.softConnector, true),
			distanceOption = options.distance,
			seriesCenter = series.center,
			radius = seriesCenter[2] / 2,
			centerY = seriesCenter[1],
			outside = distanceOption > 0,
			dataLabel,
			labelPos,
			labelHeight,
			halves = [// divide the points into right and left halves for anti collision
				[], // right
				[]  // left
			],
			x,
			y,
			visibility,
			rankArr,
			sort,
			i = 2,
			j;

		// get out if not enabled
		if (!options.enabled) {
			return;
		}

		// run parent method
		Series.prototype.drawDataLabels.apply(series);

		// arrange points for detection collision
		each(data, function (point) {
			if (point.dataLabel) { // it may have been cancelled in the base method (#407)
				halves[
					point.labelPos[7] < mathPI / 2 ? 0 : 1
				].push(point);
			}
		});
		halves[1].reverse();

		// define the sorting algorithm
		sort = function (a, b) {
			return b.y - a.y;
		};

		// assume equal label heights
		labelHeight = halves[0][0] && halves[0][0].dataLabel && halves[0][0].dataLabel.getBBox().height;

		/* Loop over the points in each quartile, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		while (i--) {

			var slots = [],
				slotsLength,
				usedSlots = [],
				points = halves[i],
				pos,
				length = points.length,
				slotIndex;


			// build the slots
			for (pos = centerY - radius - distanceOption; pos <= centerY + radius + distanceOption; pos += labelHeight) {
				slots.push(pos);
				// visualize the slot
				/*
				var slotX = series.getX(pos, i) + chart.plotLeft - (i ? 100 : 0),
					slotY = pos + chart.plotTop;
				if (!isNaN(slotX)) {
					chart.renderer.rect(slotX, slotY - 7, 100, labelHeight)
						.attr({
							'stroke-width': 1,
							stroke: 'silver'
						})
						.add();
					chart.renderer.text('Slot '+ (slots.length - 1), slotX, slotY + 4)
						.attr({
							fill: 'silver'
						}).add();
				}
				// */
			}
			slotsLength = slots.length;

			// if there are more values than available slots, remove lowest values
			if (length > slotsLength) {
				// create an array for sorting and ranking the points within each quarter
				rankArr = [].concat(points);
				rankArr.sort(sort);
				j = length;
				while (j--) {
					rankArr[j].rank = j;
				}
				j = length;
				while (j--) {
					if (points[j].rank >= slotsLength) {
						points.splice(j, 1);
					}
				}
				length = points.length;
			}

			// The label goes to the nearest open slot, but not closer to the edge than
			// the label's index.
			for (j = 0; j < length; j++) {

				point = points[j];
				labelPos = point.labelPos;

				var closest = 9999,
					distance,
					slotI;

				// find the closest slot index
				for (slotI = 0; slotI < slotsLength; slotI++) {
					distance = mathAbs(slots[slotI] - labelPos[1]);
					if (distance < closest) {
						closest = distance;
						slotIndex = slotI;
					}
				}

				// if that slot index is closer to the edges of the slots, move it
				// to the closest appropriate slot
				if (slotIndex < j && slots[j] !== null) { // cluster at the top
					slotIndex = j;
				} else if (slotsLength  < length - j + slotIndex && slots[j] !== null) { // cluster at the bottom
					slotIndex = slotsLength - length + j;
					while (slots[slotIndex] === null) { // make sure it is not taken
						slotIndex++;
					}
				} else {
					// Slot is taken, find next free slot below. In the next run, the next slice will find the
					// slot above these, because it is the closest one
					while (slots[slotIndex] === null) { // make sure it is not taken
						slotIndex++;
					}
				}

				usedSlots.push({ i: slotIndex, y: slots[slotIndex] });
				slots[slotIndex] = null; // mark as taken
			}
			// sort them in order to fill in from the top
			usedSlots.sort(sort);


			// now the used slots are sorted, fill them up sequentially
			for (j = 0; j < length; j++) {

				point = points[j];
				labelPos = point.labelPos;
				dataLabel = point.dataLabel;
				var slot = usedSlots.pop(),
					naturalY = labelPos[1];

				visibility = point.visible === false ? HIDDEN : VISIBLE;
				slotIndex = slot.i;

				// if the slot next to currrent slot is free, the y value is allowed
				// to fall back to the natural position
				y = slot.y;
				if ((naturalY > y && slots[slotIndex + 1] !== null) ||
						(naturalY < y &&  slots[slotIndex - 1] !== null)) {
					y = naturalY;
				}

				// get the x - use the natural x position for first and last slot, to prevent the top
				// and botton slice connectors from touching each other on either side
				x = series.getX(slotIndex === 0 || slotIndex === slots.length - 1 ? naturalY : y, i);

				// move or place the data label
				dataLabel
					.attr({
						visibility: visibility,
						align: labelPos[6]
					})[dataLabel.moved ? 'animate' : 'attr']({
						x: x + options.x +
							({ left: connectorPadding, right: -connectorPadding }[labelPos[6]] || 0),
						y: y + options.y
					});
				dataLabel.moved = true;

				// draw the connector
				if (outside && connectorWidth) {
					connector = point.connector;

					connectorPath = softConnector ? [
						M,
						x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
						'C',
						x, y, // first break, next to the label
						2 * labelPos[2] - labelPos[4], 2 * labelPos[3] - labelPos[5],
						labelPos[2], labelPos[3], // second break
						L,
						labelPos[4], labelPos[5] // base
					] : [
						M,
						x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
						L,
						labelPos[2], labelPos[3], // second break
						L,
						labelPos[4], labelPos[5] // base
					];

					if (connector) {
						connector.animate({ d: connectorPath });
						connector.attr('visibility', visibility);

					} else {
						point.connector = connector = series.chart.renderer.path(connectorPath).attr({
							'stroke-width': connectorWidth,
							stroke: options.connectorColor || point.color || '#606060',
							visibility: visibility,
							zIndex: 3
						})
						.translate(chart.plotLeft, chart.plotTop)
						.add();
					}
				}
			}
		}
	},

	/**
	 * Draw point specific tracker objects. Inherit directly from column series.
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,

	/**
	 * Pies don't have point marker symbols
	 */
	getSymbol: function () {}

});
seriesTypes.pie = PieSeries;

/* ****************************************************************************
 * Start data grouping module												 *
 ******************************************************************************/
/*jslint white:true */
var DATA_GROUPING = 'dataGrouping',
	seriesProto = Series.prototype,
	baseProcessData = seriesProto.processData,
	baseGeneratePoints = seriesProto.generatePoints,
	baseDestroy = seriesProto.destroy,
	baseTooltipHeaderFormatter = seriesProto.tooltipHeaderFormatter,
	NUMBER = 'number',
	
	commonOptions = {
			approximation: 'average', // average, open, high, low, close, sum
			//forced: undefined,
			groupPixelWidth: 2,
			// the first one is the point or start value, the second is the start value if we're dealing with range,
			// the third one is the end value if dealing with a range
			dateTimeLabelFormats: hash( 
				MILLISECOND, ['%A, %b %e, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
				SECOND, ['%A, %b %e, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
				MINUTE, ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
				HOUR, ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
				DAY, ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
				WEEK, ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
				MONTH, ['%B %Y', '%B', '-%B %Y'],
				YEAR, ['%Y', '%Y', '-%Y']
			)
			// smoothed = false, // enable this for navigator series only
		},
		
		// units are defined in a separate array to allow complete overriding in case of a user option
		defaultDataGroupingUnits = [[
				MILLISECOND, // unit name
				[1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
			], [
				SECOND,
				[1, 2, 5, 10, 15, 30]
			], [
				MINUTE,
				[1, 2, 5, 10, 15, 30]
			], [
				HOUR,
				[1, 2, 3, 4, 6, 8, 12]
			], [
				DAY,
				[1]
			], [
				WEEK,
				[1]
			], [
				MONTH,
				[1, 3, 6]
			], [
				YEAR,
				null
			]
		],
	
	/**
	 * Define the available approximation types. The data grouping approximations takes an array
	 * or numbers as the first parameter. In case of ohlc, four arrays are sent in as four parameters.
	 * Each array consists only of numbers. In case null values belong to the group, the property
	 * .hasNulls will be set to true on the array.
	 */
	approximations = {
		sum: function (arr) {
			var len = arr.length, 
				ret;
				
			// 1. it consists of nulls exclusively
			if (!len && arr.hasNulls) {
				ret = null;
			// 2. it has a length and real values
			} else if (len) {
				ret = 0;
				while (len--) {
					ret += arr[len];
				}
			}
			// 3. it has zero length, so just return undefined 
			// => doNothing()
			
			return ret;
		},
		average: function (arr) {
			var len = arr.length,
				ret = approximations.sum(arr);
				
			// If we have a number, return it divided by the length. If not, return
			// null or undefined based on what the sum method finds.
			if (typeof ret === NUMBER && len) {
				ret = ret / len;
			}
			
			return ret;
		},
		open: function (arr) {
			return arr.length ? arr[0] : (arr.hasNulls ? null : UNDEFINED);
		},
		high: function (arr) {
			return arr.length ? arrayMax(arr) : (arr.hasNulls ? null : UNDEFINED);
		},
		low: function (arr) {
			return arr.length ? arrayMin(arr) : (arr.hasNulls ? null : UNDEFINED);
		},
		close: function (arr) {
			return arr.length ? arr[arr.length - 1] : (arr.hasNulls ? null : UNDEFINED);
		},
		// ohlc is a special case where a multidimensional array is input and an array is output
		ohlc: function (open, high, low, close) {
			open = approximations.open(open);
			high = approximations.high(high);
			low = approximations.low(low);
			close = approximations.close(close);
			
			if (typeof open === NUMBER || typeof high === NUMBER || typeof low === NUMBER || typeof close === NUMBER) {
				return [open, high, low, close];
			} 
			// else, return is undefined
		}
	};

/*jslint white:false */

/**
 * Takes parallel arrays of x and y data and groups the data into intervals defined by groupPositions, a collection
 * of starting x values for each group.
 */
seriesProto.groupData = function (xData, yData, groupPositions, approximation) {
	var series = this,
		data = series.data,
		dataOptions = series.options.data,
		groupedXData = [],
		groupedYData = [],
		dataLength = xData.length,
		pointX,
		pointY,
		groupedY,
		handleYData = !!yData, // when grouping the fake extended axis for panning, we don't need to consider y
		values1 = [],
		values2 = [],
		values3 = [],
		values4 = [],
		approximationFn = typeof approximation === 'function' ? approximation : approximations[approximation],
		i;
	
		for (i = 0; i <= dataLength; i++) {

			// when a new group is entered, summarize and initiate the previous group
			while ((groupPositions[1] !== UNDEFINED && xData[i] >= groupPositions[1]) ||
					i === dataLength) { // get the last group

				// get group x and y 
				pointX = groupPositions.shift();				
				groupedY = approximationFn(values1, values2, values3, values4);
				
				// push the grouped data		
				if (groupedY !== UNDEFINED) {
					groupedXData.push(pointX);
					groupedYData.push(groupedY);
				}
				
				// reset the aggregate arrays
				values1 = [];
				values2 = [];
				values3 = [];
				values4 = [];
				
				// don't loop beyond the last group
				if (i === dataLength) {
					break;
				}
			}
			
			// break out
			if (i === dataLength) {
				break;
			}
			
			// for each raw data point, push it to an array that contains all values for this specific group
			pointY = handleYData ? yData[i] : null;
			if (approximation === 'ohlc') {
				
				var index = series.cropStart + i,
					point = (data && data[index]) || series.pointClass.prototype.applyOptions.apply({}, [dataOptions[index]]),
					open = point.open,
					high = point.high,
					low = point.low,
					close = point.close;
				
				
				if (typeof open === NUMBER) {
					values1.push(open);
				} else if (open === null) {
					values1.hasNulls = true;
				}
				
				if (typeof high === NUMBER) {
					values2.push(high);
				} else if (high === null) {
					values2.hasNulls = true;
				}
				
				if (typeof low === NUMBER) {
					values3.push(low);
				} else if (low === null) {
					values3.hasNulls = true;
				}
				
				if (typeof close === NUMBER) {
					values4.push(close);
				} else if (close === null) {
					values4.hasNulls = true;
				}
			} else {
				if (typeof pointY === NUMBER) {
					values1.push(pointY);
				} else if (pointY === null) {
					values1.hasNulls = true;
				}
			}

		}
	return [groupedXData, groupedYData];
};

/**
 * Extend the basic processData method, that crops the data to the current zoom
 * range, with data grouping logic.
 */
seriesProto.processData = function () {
	var series = this,
		options = series.options,
		dataGroupingOptions = options[DATA_GROUPING],
		groupingEnabled = dataGroupingOptions && dataGroupingOptions.enabled,
		groupedData = series.groupedData,
		hasGroupedData;

	// run base method
	series.forceCrop = groupingEnabled; // #334
	
	// skip if processData returns false or if grouping is disabled (in that order)
	if (baseProcessData.apply(series, arguments) === false || !groupingEnabled) {
		return;
		
	} else {
		// clear previous groups, #622, #740
		each(groupedData || [], function (point, i) {
			if (point) {
				groupedData[i] = point.destroy ? point.destroy() : null;
			}
		});
	}
	
	var i,
		chart = series.chart,
		processedXData = series.processedXData,
		processedYData = series.processedYData,
		plotSizeX = chart.plotSizeX,
		xAxis = series.xAxis,
		groupPixelWidth = pick(xAxis.groupPixelWidth, dataGroupingOptions.groupPixelWidth),
		dataLength = processedXData.length,
		chartSeries = chart.series,
		nonGroupedPointRange = series.pointRange;

	// attempt to solve #334: if multiple series are compared on the same x axis, give them the same
	// group pixel width
	if (!xAxis.groupPixelWidth) {
		i = chartSeries.length;
		while (i--) {
			if (chartSeries[i].xAxis === xAxis && chartSeries[i].options[DATA_GROUPING]) {
				groupPixelWidth = mathMax(groupPixelWidth, chartSeries[i].options[DATA_GROUPING].groupPixelWidth);
			}
		}
		xAxis.groupPixelWidth = groupPixelWidth;
		
	}

	// Execute grouping if the amount of points is greater than the limit defined in groupPixelWidth
	if (dataLength > (plotSizeX / groupPixelWidth) || dataGroupingOptions.forced) {
		hasGroupedData = true;

		series.points = null; // force recreation of point instances in series.translate

		var extremes = xAxis.getExtremes(),
			xMin = extremes.min,
			xMax = extremes.max,
			groupIntervalFactor = (xAxis.getGroupIntervalFactor && xAxis.getGroupIntervalFactor(xMin, xMax, processedXData)) || 1,
			interval = (groupPixelWidth * (xMax - xMin) / plotSizeX) * groupIntervalFactor,			
			groupPositions = (xAxis.getNonLinearTimeTicks || getTimeTicks)(
				normalizeTimeTickInterval(interval, dataGroupingOptions.units || defaultDataGroupingUnits),
				xMin, 
				xMax, 
				null, 
				processedXData, 
				series.closestPointRange
			),
			groupedXandY = seriesProto.groupData.apply(series, [processedXData, processedYData, groupPositions, dataGroupingOptions.approximation]),
			groupedXData = groupedXandY[0],
			groupedYData = groupedXandY[1];
			
		// prevent the smoothed data to spill out left and right, and make
		// sure data is not shifted to the left
		if (dataGroupingOptions.smoothed) {
			i = groupedXData.length - 1;
			groupedXData[i] = xMax;
			while (i-- && i > 0) {
				groupedXData[i] += interval / 2;
			}
			groupedXData[0] = xMin;
		}

		// record what data grouping values were used
		series.currentDataGrouping = groupPositions.info;
		if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
			series.pointRange = groupPositions.info.totalRange;
		}
		series.closestPointRange = groupPositions.info.totalRange;
		
		// set series props
		series.processedXData = groupedXData;
		series.processedYData = groupedYData;
	} else {
		series.currentDataGrouping = null;
		series.pointRange = nonGroupedPointRange;
	}

	series.hasGroupedData = hasGroupedData;
};

seriesProto.generatePoints = function () {
	var series = this;

	baseGeneratePoints.apply(series);

	// record grouped data in order to let it be destroyed the next time processData runs
	series.groupedData = series.hasGroupedData ? series.points : null;
};

/**
 * Make the tooltip's header reflect the grouped range
 */
seriesProto.tooltipHeaderFormatter = function (key) {
	var series = this,
		options = series.options,
		tooltipOptions = series.tooltipOptions,
		dataGroupingOptions = options.dataGrouping,
		xDateFormat = tooltipOptions.xDateFormat,
		xDateFormatEnd,
		xAxis = series.xAxis,
		currentDataGrouping,
		dateTimeLabelFormats,
		labelFormats,
		formattedKey,
		n,
		ret;
	
	// apply only to grouped series
	if (xAxis && xAxis.options.type === 'datetime' && dataGroupingOptions) {
		
		// set variables
		currentDataGrouping = series.currentDataGrouping;		
		dateTimeLabelFormats = dataGroupingOptions.dateTimeLabelFormats;
		
		// if we have grouped data, use the grouping information to get the right format
		if (currentDataGrouping) {
			labelFormats = dateTimeLabelFormats[currentDataGrouping.unitName];
			if (currentDataGrouping.count === 1) {
				xDateFormat = labelFormats[0];
			} else {
				xDateFormat = labelFormats[1];
				xDateFormatEnd = labelFormats[2];
			} 
		// if not grouped, and we don't have set the xDateFormat option, get the best fit,
		// so if the least distance between points is one minute, show it, but if the 
		// least distance is one day, skip hours and minutes etc.
		} else if (!xDateFormat) {
			for (n in timeUnits) {
				if (timeUnits[n] >= xAxis.closestPointRange) {
					xDateFormat = dateTimeLabelFormats[n][0];
					break;
				}	
			}		
		}
		
		// now format the key
		formattedKey = dateFormat(xDateFormat, key);
		if (xDateFormatEnd) {
			formattedKey += dateFormat(xDateFormatEnd, key + currentDataGrouping.totalRange - 1);
		}
		
		// return the replaced format
		ret = tooltipOptions.headerFormat.replace('{point.key}', formattedKey);
	
	// else, fall back to the regular formatter
	} else {
		ret = baseTooltipHeaderFormatter.apply(series, [key]);
	}
	
	return ret;
};

/**
 * Extend the series destroyer
 */
seriesProto.destroy = function () {
	var series = this,
		groupedData = series.groupedData || [],
		i = groupedData.length;

	while (i--) {
		if (groupedData[i]) {
			groupedData[i].destroy();
		}
	}
	baseDestroy.apply(series);
};


// Extend the plot options

// line types
defaultPlotOptions.line[DATA_GROUPING] =
	defaultPlotOptions.spline[DATA_GROUPING] =
	defaultPlotOptions.area[DATA_GROUPING] =
	defaultPlotOptions.areaspline[DATA_GROUPING] = commonOptions;

// bar-like types (OHLC and candleticks inherit this as the classes are not yet built)
defaultPlotOptions.column[DATA_GROUPING] = merge(commonOptions, {
		approximation: 'sum',
		groupPixelWidth: 10
});
/* ****************************************************************************
 * End data grouping module												   *
 ******************************************************************************//* ****************************************************************************
 * Start OHLC series code													 *
 *****************************************************************************/

// 1 - Set default options
defaultPlotOptions.ohlc = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	dataGrouping: {
		approximation: 'ohlc',
		enabled: true,
		groupPixelWidth: 5 // allows to be packed tighter than candlesticks
	},
	tooltip: {
		pointFormat: '<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>' +
			'Open: {point.open}<br/>' +
			'High: {point.high}<br/>' +
			'Low: {point.low}<br/>' +
			'Close: {point.close}<br/>'	
	},
	states: {
		hover: {
			lineWidth: 3
		}
	},
	threshold: null
});

// 2- Create the OHLCPoint object
var OHLCPoint = extendClass(Point, {
	/**
	 * Apply the options containing the x and OHLC data and possible some extra properties.
	 * This is called on point init or from point.update. Extends base Point by adding
	 * multiple y-like values.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options) {
		var point = this,
			series = point.series,
			i = 0;


		// object input for example:
		// { x: Date(2010, 0, 1), open: 7.88, high: 7.99, low: 7.02, close: 7.65 }
		if (typeof options === 'object' && typeof options.length !== 'number') {

			// copy options directly to point
			extend(point, options);

			point.options = options;
		} else if (options.length) { // array
			// with leading x value
			if (options.length === 5) {
				if (typeof options[0] === 'string') {
					point.name = options[0];
				} else if (typeof options[0] === 'number') {
					point.x = options[0];
				}
				i++;
			}
			point.open = options[i++];
			point.high = options[i++];
			point.low = options[i++];
			point.close = options[i++];
		}

		/*
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		point.y = point.high;
		if (point.x === UNDEFINED && series) {
			point.x = series.autoIncrement();
		}
		return point;
	}

});

// 3 - Create the OHLCSeries object
var OHLCSeries = extendClass(seriesTypes.column, {
	type: 'ohlc',
	valueCount: 4, // four values per point
	pointClass: OHLCPoint,

	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'color',
		'stroke-width': 'lineWidth'
	},


	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis;

		seriesTypes.column.prototype.translate.apply(series);

		// do the translation
		each(series.points, function (point) {
			// the graphics
			if (point.open !== null) {
				point.plotOpen = yAxis.translate(point.open, 0, 1, 0, 1);
			}
			if (point.close !== null) {
				point.plotClose = yAxis.translate(point.close, 0, 1, 0, 1);
			}

		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,
			points = series.points,
			chart = series.chart,
			pointAttr,
			plotOpen,
			plotClose,
			crispCorr,
			halfWidth,
			path,
			graphic,
			crispX;


		each(points, function (point) {
			if (point.plotY !== UNDEFINED) {

				graphic = point.graphic;
				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				halfWidth = mathRound(point.barW / 2);

				// the vertical stem
				path = [
					'M',
					crispX, mathRound(point.yBottom),
					'L',
					crispX, mathRound(point.plotY)
				];

				// open
				if (point.open !== null) {
					plotOpen = mathRound(point.plotOpen) + crispCorr;
					path.push(
						'M',
						crispX,
						plotOpen,
						'L',
						crispX - halfWidth,
						plotOpen
					);
				}

				// close
				if (point.close !== null) {
					plotClose = mathRound(point.plotClose) + crispCorr;
					path.push(
						'M',
						crispX,
						plotClose,
						'L',
						crispX + halfWidth,
						plotClose
					);
				}

				// create and/or update the graphic
				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}


		});

	},

	/**
	 * Disable animation
	 */
	animate: null


});
seriesTypes.ohlc = OHLCSeries;
/* ****************************************************************************
 * End OHLC series code													   *
 *****************************************************************************/
/* ****************************************************************************
 * Start Candlestick series code											  *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.candlestick = merge(defaultPlotOptions.column, {
	dataGrouping: {
		approximation: 'ohlc',
		enabled: true
	},
	lineColor: 'black',
	lineWidth: 1,
	states: {
		hover: {
			lineWidth: 2
		}
	},
	tooltip: defaultPlotOptions.ohlc.tooltip,
	threshold: null,
	upColor: 'white'
});

// 2 - Create the CandlestickSeries object
var CandlestickSeries = extendClass(OHLCSeries, {
	type: 'candlestick',

	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'color',
		stroke: 'lineColor',
		'stroke-width': 'lineWidth'
	},

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	getAttribs: function () {
		OHLCSeries.prototype.getAttribs.apply(this, arguments);
		var series = this,
			options = series.options,
			stateOptions = options.states,
			upColor = options.upColor,
			seriesDownPointAttr = merge(series.pointAttr);

		seriesDownPointAttr[''].fill = upColor;
		seriesDownPointAttr.hover.fill = stateOptions.hover.upColor || upColor;
		seriesDownPointAttr.select.fill = stateOptions.select.upColor || upColor;

		each(series.points, function (point) {
			if (point.open < point.close) {
				point.pointAttr = seriesDownPointAttr;
			}
		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,  //state = series.state,
			points = series.points,
			chart = series.chart,
			pointAttr,
			plotOpen,
			plotClose,
			topBox,
			bottomBox,
			crispCorr,
			crispX,
			graphic,
			path,
			halfWidth;


		each(points, function (point) {

			graphic = point.graphic;
			if (point.plotY !== UNDEFINED) {

				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				plotOpen = mathRound(point.plotOpen) + crispCorr;
				plotClose = mathRound(point.plotClose) + crispCorr;
				topBox = math.min(plotOpen, plotClose);
				bottomBox = math.max(plotOpen, plotClose);
				halfWidth = mathRound(point.barW / 2);

				// create the path
				path = [
					'M',
					crispX - halfWidth, bottomBox,
					'L',
					crispX - halfWidth, topBox,
					'L',
					crispX + halfWidth, topBox,
					'L',
					crispX + halfWidth, bottomBox,
					'L',
					crispX - halfWidth, bottomBox,
					'M',
					crispX, bottomBox,
					'L',
					crispX, mathRound(point.yBottom),
					'M',
					crispX, topBox,
					'L',
					crispX, mathRound(point.plotY),
					'Z'
				];

				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}
		});

	}


});

seriesTypes.candlestick = CandlestickSeries;

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/
/* ****************************************************************************
 * Start Flags series code													*
 *****************************************************************************/

var symbols = SVGRenderer.prototype.symbols;

// 1 - set default options
defaultPlotOptions.flags = merge(defaultPlotOptions.column, {
	dataGrouping: null,
	fillColor: 'white',
	lineWidth: 1,
	pointRange: 0, // #673
	//radius: 2,
	shape: 'flag',
	stackDistance: 7,
	states: {
		hover: {
			lineColor: 'black',
			fillColor: '#FCFFC5'
		}
	},
	style: {
		fontSize: '11px',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	threshold: null,
	y: -30
});

// 2 - Create the CandlestickSeries object
seriesTypes.flags = extendClass(seriesTypes.column, {
	type: 'flags',
	sorted: false,
	noSharedTooltip: true,
	/**
	 * Inherit the initialization from base Series
	 */
	init: Series.prototype.init,

	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'fillColor',
		stroke: 'color',
		'stroke-width': 'lineWidth',
		r: 'radius'
	},

	/**
	 * Extend the translate method by placing the point on the related series
	 */
	translate: function () {

		seriesTypes.column.prototype.translate.apply(this);

		var series = this,
			options = series.options,
			chart = series.chart,
			points = series.points,
			cursor = points.length - 1,
			point,
			lastPoint,
			optionsOnSeries = options.onSeries,
			onSeries = optionsOnSeries && chart.get(optionsOnSeries),
			step = onSeries && onSeries.options.step,
			onData = onSeries && onSeries.points,
			i = onData && onData.length,
			leftPoint,
			lastX,
			rightPoint;

		// relate to a master series
		if (onSeries && onSeries.visible && i) {
			lastX = onData[i - 1].x;

			// sort the data points
			points.sort(function (a, b) {
				return (a.x - b.x);
			});

			while (i-- && points[cursor]) {
				point = points[cursor];
				leftPoint = onData[i];
				
				
				if (leftPoint.x <= point.x && leftPoint.plotY !== UNDEFINED) {
					
					if (point.x <= lastX) { // #803
					
						point.plotY = leftPoint.plotY;
					
						// interpolate between points, #666
						if (leftPoint.x < point.x && !step) { 
							rightPoint = onData[i + 1];
							if (rightPoint && rightPoint.plotY !== UNDEFINED) {
								point.plotY += 
									((point.x - leftPoint.x) / (rightPoint.x - leftPoint.x)) * // the distance ratio, between 0 and 1 
									(rightPoint.plotY - leftPoint.plotY); // the y distance
							}
						}
					}
					cursor--;
					i++; // check again for points in the same x position
					if (cursor < 0) {
						break;
					}
				}
			}
		}

		each(points, function (point, i) {
			// place on y axis or custom position
			if (point.plotY === UNDEFINED) { // either on axis, outside series range or hidden series
				point.plotY = chart.plotHeight;
			}
			// if multiple flags appear at the same x, order them into a stack
			lastPoint = points[i - 1];
			if (lastPoint && lastPoint.plotX === point.plotX) {
				if (lastPoint.stackIndex === UNDEFINED) {
					lastPoint.stackIndex = 0;
				}
				point.stackIndex = lastPoint.stackIndex + 1;
			}
					
		});


	},

	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			pointAttr,
			points = series.points,
			chart = series.chart,
			renderer = chart.renderer,
			plotX,
			plotY,
			options = series.options,
			optionsY = options.y,
			shape = options.shape,
			box,
			bBox,
			i,
			point,
			graphic,
			connector,
			stackIndex,
			crisp = (options.lineWidth % 2 / 2),
			anchorX,
			anchorY;

		i = points.length;
		while (i--) {
			point = points[i];
			plotX = point.plotX + crisp;
			stackIndex = point.stackIndex;
			plotY = point.plotY;
			if (plotY !== UNDEFINED) {
				plotY = point.plotY + optionsY + crisp - (stackIndex !== UNDEFINED && stackIndex * options.stackDistance);
			}
			anchorX = stackIndex ? UNDEFINED : point.plotX + crisp; // skip connectors for higher level stacked points
			anchorY = stackIndex ? UNDEFINED : point.plotY;

			graphic = point.graphic;
			connector = point.connector;

			// only draw the point if y is defined
			if (plotY !== UNDEFINED) {
				// shortcuts
				pointAttr = point.pointAttr[point.selected ? 'select' : ''];
				if (graphic) { // update
					graphic.attr({
						x: plotX,
						y: plotY,
						r: pointAttr.r,
						anchorX: anchorX,
						anchorY: anchorY
					});
				} else {
					graphic = point.graphic = renderer.label(
						point.options.title || options.title || 'A',
						plotX,
						plotY,
						shape,
						anchorX,
						anchorY
					)
					.css(merge(options.style, point.style))
					.attr(pointAttr)
					.attr({
						align: shape === 'flag' ? 'left' : 'center',
						width: options.width,
						height: options.height
					})
					.add(series.group)
					.shadow(options.shadow);

				}

				// get the bounding box
				box = graphic.box;
				bBox = box.getBBox();

				// set the shape arguments for the tracker element
				point.shapeArgs = extend(
					bBox,
					{
						x: plotX - (shape === 'flag' ? 0 : box.attr('width') / 2), // flags align left, else align center
						y: plotY
					}
				);

			} else if (graphic) {
				point.graphic = graphic.destroy();
			}

		}

	},

	/**
	 * Extend the column trackers with listeners to expand and contract stacks
	 */
	drawTracker: function () {
		var series = this;

		seriesTypes.column.prototype.drawTracker.apply(series);

		// put each point in front on mouse over, this allows readability of vertically
		// stacked elements as well as tight points on the x axis
		each(series.points, function (point) {
			addEvent(point.tracker.element, 'mouseover', function () {
				point.graphic.toFront();
			});
		});
	},

	/**
	 * Override the regular tooltip formatter by returning the point text given
	 * in the options
	 */
	tooltipFormatter: function (item) {
		return item.point.text;
	},

	/**
	 * Disable animation
	 */
	animate: function () {}

});

// create the flag icon with anchor
symbols.flag = function (x, y, w, h, options) {
	var anchorX = (options && options.anchorX) || x,
		anchorY = (options &&  options.anchorY) || y;

	return [
		'M', anchorX, anchorY,
		'L', x, y + h,
		x, y,
		x + w, y,
		x + w, y + h,
		x, y + h,
		'M', anchorX, anchorY,
		'Z'
	];
};

// create the circlepin and squarepin icons with anchor
each(['circle', 'square'], function (shape) {
	symbols[shape + 'pin'] = function (x, y, w, h, options) {

		var anchorX = options && options.anchorX,
			anchorY = options &&  options.anchorY,
			path = symbols[shape](x, y, w, h);

		if (anchorX && anchorY) {
			path.push('M', anchorX, y + h, 'L', anchorX, anchorY);
		}

		return path;
	};
});

// The symbol callbacks are generated on the SVGRenderer object in all browsers. Even
// VML browsers need this in order to generate shapes in export. Now share
// them with the VMLRenderer.
if (Renderer === VMLRenderer) {
	each(['flag', 'circlepin', 'squarepin'], function (shape) {
		VMLRenderer.prototype.symbols[shape] = symbols[shape];
	});
}

/* ****************************************************************************
 * End Flags series code													  *
 *****************************************************************************/

// constants
var MOUSEDOWN = hasTouch ? 'touchstart' : 'mousedown',
	MOUSEMOVE = hasTouch ? 'touchmove' : 'mousemove',
	MOUSEUP = hasTouch ? 'touchend' : 'mouseup';




/* ****************************************************************************
 * Start Scroller code														*
 *****************************************************************************/
/*jslint white:true */
var buttonGradient = hash(
		LINEAR_GRADIENT, { x1: 0, y1: 0, x2: 0, y2: 1 },
		STOPS, [
			[0, '#FFF'],
			[1, '#CCC']
		]
	),
	units = [].concat(defaultDataGroupingUnits); // copy

// add more resolution to units
units[4] = [DAY, [1, 2, 3, 4]]; // allow more days
units[5] = [WEEK, [1, 2, 3]]; // allow more weeks

extend(defaultOptions, {
	navigator: {
		//enabled: true,
		handles: {
			backgroundColor: '#FFF',
			borderColor: '#666'
		},
		height: 40,
		margin: 10,
		maskFill: 'rgba(255, 255, 255, 0.75)',
		outlineColor: '#444',
		outlineWidth: 1,
		series: {
			type: 'areaspline',
			color: '#4572A7',
			compare: null,
			fillOpacity: 0.4,
			dataGrouping: {
				approximation: 'average',
				groupPixelWidth: 2,
				smoothed: true,
				units: units
			},
			dataLabels: {
				enabled: false
			},
			id: PREFIX + 'navigator-series',
			lineColor: '#4572A7',
			lineWidth: 1,
			marker: {
				enabled: false
			},
			pointRange: 0,
			shadow: false
		},
		//top: undefined,
		xAxis: {
			tickWidth: 0,
			lineWidth: 0,
			gridLineWidth: 1,
			tickPixelInterval: 200,
			labels: {
				align: 'left',
				x: 3,
				y: -4
			}
		},
		yAxis: {
			gridLineWidth: 0,
			startOnTick: false,
			endOnTick: false,
			minPadding: 0.1,
			maxPadding: 0.1,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickWidth: 0
		}
	},
	scrollbar: {
		//enabled: true
		height: hasTouch ? 20 : 14,
		barBackgroundColor: buttonGradient,
		barBorderRadius: 2,
		barBorderWidth: 1,
		barBorderColor: '#666',
		buttonArrowColor: '#666',
		buttonBackgroundColor: buttonGradient,
		buttonBorderColor: '#666',
		buttonBorderRadius: 2,
		buttonBorderWidth: 1,
		rifleColor: '#666',
		trackBackgroundColor: hash(
			LINEAR_GRADIENT, { x1: 0, y1: 0, x2: 0, y2: 1 },
			STOPS, [
				[0, '#EEE'],
				[1, '#FFF']
			]
		),
		trackBorderColor: '#CCC',
		trackBorderWidth: 1
		// trackBorderRadius: 0
	}
});
/*jslint white:false */

/**
 * The Scroller class
 * @param {Object} chart
 */
Highcharts.Scroller = function (chart) {

	var renderer = chart.renderer,
		chartOptions = chart.options,
		navigatorOptions = chartOptions.navigator,
		navigatorEnabled = navigatorOptions.enabled,
		navigatorLeft,
		navigatorWidth,
		navigatorSeries,
		navigatorData,
		scrollbarOptions = chartOptions.scrollbar,
		scrollbarEnabled = scrollbarOptions.enabled,
		grabbedLeft,
		grabbedRight,
		grabbedCenter,
		otherHandlePos,
		dragOffset,
		hasDragged,
		xAxis,
		yAxis,
		zoomedMin,
		zoomedMax,
		range,

		bodyStyle = document.body.style,
		defaultBodyCursor,

		handlesOptions = navigatorOptions.handles,
		height = navigatorEnabled ? navigatorOptions.height : 0,
		outlineWidth = navigatorOptions.outlineWidth,
		scrollbarHeight = scrollbarEnabled ? scrollbarOptions.height : 0,
		outlineHeight = height + scrollbarHeight,
		barBorderRadius = scrollbarOptions.barBorderRadius,
		top,
		halfOutline = outlineWidth / 2,
		outlineTop,
		scrollerLeft,
		scrollerWidth,
		rendered,
		baseSeriesOption = navigatorOptions.baseSeries,
		baseSeries = chart.series[baseSeriesOption] ||
			(typeof baseSeriesOption === 'string' && chart.get(baseSeriesOption)) ||
			chart.series[0],

		// element wrappers
		leftShade,
		rightShade,
		outline,
		handles = [],
		scrollbarGroup,
		scrollbarTrack,
		scrollbar,
		scrollbarRifles,
		scrollbarButtons = [],
		elementsToDestroy = []; // Array containing the elements to destroy when Scroller is destroyed

	chart.resetZoomEnabled = false;

	/**
	 * Return the top of the navigation 
	 */
	function getAxisTop(chartHeight) {
		return navigatorOptions.top || chartHeight - height - scrollbarHeight - chartOptions.chart.spacingBottom;
	}

	/**
	 * Draw one of the handles on the side of the zoomed range in the navigator
	 * @param {Number} x The x center for the handle
	 * @param {Number} index 0 for left and 1 for right
	 */
	function drawHandle(x, index) {

		var attr = {
				fill: handlesOptions.backgroundColor,
				stroke: handlesOptions.borderColor,
				'stroke-width': 1
			},
			tempElem;

		// create the elements
		if (!rendered) {

			// the group
			handles[index] = renderer.g()
				.css({ cursor: 'e-resize' })
				.attr({ zIndex: 4 - index }) // zIndex = 3 for right handle, 4 for left
				.add();

			// the rectangle
			tempElem = renderer.rect(-4.5, 0, 9, 16, 3, 1)
				.attr(attr)
				.add(handles[index]);
			elementsToDestroy.push(tempElem);

			// the rifles
			tempElem = renderer.path([
					'M',
					-1.5, 4,
					'L',
					-1.5, 12,
					'M',
					0.5, 4,
					'L',
					0.5, 12
				]).attr(attr)
				.add(handles[index]);
			elementsToDestroy.push(tempElem);
		}

		handles[index].translate(scrollerLeft + scrollbarHeight + parseInt(x, 10), top + height / 2 - 8);
	}

	/**
	 * Draw the scrollbar buttons with arrows
	 * @param {Number} index 0 is left, 1 is right
	 */
	function drawScrollbarButton(index) {
		var tempElem;
		if (!rendered) {

			scrollbarButtons[index] = renderer.g().add(scrollbarGroup);

			tempElem = renderer.rect(
				-0.5,
				-0.5,
				scrollbarHeight + 1, // +1 to compensate for crispifying in rect method
				scrollbarHeight + 1,
				scrollbarOptions.buttonBorderRadius,
				scrollbarOptions.buttonBorderWidth
			).attr({
				stroke: scrollbarOptions.buttonBorderColor,
				'stroke-width': scrollbarOptions.buttonBorderWidth,
				fill: scrollbarOptions.buttonBackgroundColor
			}).add(scrollbarButtons[index]);
			elementsToDestroy.push(tempElem);

			tempElem = renderer.path([
				'M',
				scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 - 3,
				'L',
				scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 + 3,
				scrollbarHeight / 2 + (index ? 2 : -2), scrollbarHeight / 2
			]).attr({
				fill: scrollbarOptions.buttonArrowColor
			}).add(scrollbarButtons[index]);
			elementsToDestroy.push(tempElem);
		}

		// adjust the right side button to the varying length of the scroll track
		if (index) {
			scrollbarButtons[index].attr({
				translateX: scrollerWidth - scrollbarHeight
			});
		}
	}

	/**
	 * Render the navigator and scroll bar
	 * @param {Number} min X axis value minimum
	 * @param {Number} max X axis value maximum
	 * @param {Number} pxMin Pixel value minimum
	 * @param {Number} pxMax Pixel value maximum
	 */
	function render(min, max, pxMin, pxMax) {

		// don't render the navigator until we have data (#486)
		if (isNaN(min)) {
			return;
		}

		var strokeWidth,
			scrollbarStrokeWidth = scrollbarOptions.barBorderWidth,
			centerBarX;

		outlineTop = top + halfOutline;
		navigatorLeft = pick(
			xAxis.left,
			chart.plotLeft + scrollbarHeight // in case of scrollbar only, without navigator
		);
		navigatorWidth = pick(xAxis.len, chart.plotWidth - 2 * scrollbarHeight);
		scrollerLeft = navigatorLeft - scrollbarHeight;
		scrollerWidth = navigatorWidth + 2 * scrollbarHeight;

		// Set the scroller x axis extremes to reflect the total. The navigator extremes
		// should always be the extremes of the union of all series in the chart as
		// well as the navigator series.
		if (xAxis.getExtremes) {
			var baseExtremes = chart.xAxis[0].getExtremes(), // the base
				noBase = baseExtremes.dataMin === null,
				navExtremes = xAxis.getExtremes(),
				newMin = mathMin(baseExtremes.dataMin, navExtremes.dataMin),
				newMax = mathMax(baseExtremes.dataMax, navExtremes.dataMax);

			if (!noBase && (newMin !== navExtremes.min || newMax !== navExtremes.max)) {
				xAxis.setExtremes(newMin, newMax, true, false);
			}
		}

		// get the pixel position of the handles
		pxMin = pick(pxMin, xAxis.translate(min));
		pxMax = pick(pxMax, xAxis.translate(max));


		// handles are allowed to cross
		zoomedMin = pInt(mathMin(pxMin, pxMax));
		zoomedMax = pInt(mathMax(pxMin, pxMax));
		range = zoomedMax - zoomedMin;

		// on first render, create all elements
		if (!rendered) {

			if (navigatorEnabled) {

				leftShade = renderer.rect()
					.attr({
						fill: navigatorOptions.maskFill,
						zIndex: 3
					}).add();
				rightShade = renderer.rect()
					.attr({
						fill: navigatorOptions.maskFill,
						zIndex: 3
					}).add();
				outline = renderer.path()
					.attr({
						'stroke-width': outlineWidth,
						stroke: navigatorOptions.outlineColor,
						zIndex: 3
					})
					.add();
			}

			if (scrollbarEnabled) {

				// draw the scrollbar group
				scrollbarGroup = renderer.g().add();

				// the scrollbar track
				strokeWidth = scrollbarOptions.trackBorderWidth;
				scrollbarTrack = renderer.rect().attr({
					y: -strokeWidth % 2 / 2,
					fill: scrollbarOptions.trackBackgroundColor,
					stroke: scrollbarOptions.trackBorderColor,
					'stroke-width': strokeWidth,
					r: scrollbarOptions.trackBorderRadius || 0,
					height: scrollbarHeight
				}).add(scrollbarGroup);

				// the scrollbar itself
				scrollbar = renderer.rect()
					.attr({
						y: -scrollbarStrokeWidth % 2 / 2,
						height: scrollbarHeight,
						fill: scrollbarOptions.barBackgroundColor,
						stroke: scrollbarOptions.barBorderColor,
						'stroke-width': scrollbarStrokeWidth,
						r: barBorderRadius
					})
					.add(scrollbarGroup);

				scrollbarRifles = renderer.path()
					.attr({
						stroke: scrollbarOptions.rifleColor,
						'stroke-width': 1
					})
					.add(scrollbarGroup);
			}
		}

		// place elements
		if (navigatorEnabled) {
			leftShade.attr({
				x: navigatorLeft,
				y: top,
				width: zoomedMin,
				height: height
			});
			rightShade.attr({
				x: navigatorLeft + zoomedMax,
				y: top,
				width: navigatorWidth - zoomedMax,
				height: height
			});
			outline.attr({ d: [
				M,
				scrollerLeft, outlineTop, // left
				L,
				navigatorLeft + zoomedMin + halfOutline, outlineTop, // upper left of zoomed range
				navigatorLeft + zoomedMin + halfOutline, outlineTop + outlineHeight - scrollbarHeight, // lower left of z.r.
				M,
				navigatorLeft + zoomedMax - halfOutline, outlineTop + outlineHeight - scrollbarHeight, // lower right of z.r.
				L,
				navigatorLeft + zoomedMax - halfOutline, outlineTop, // upper right of z.r.
				scrollerLeft + scrollerWidth, outlineTop // right
			]});
			// draw handles
			drawHandle(zoomedMin + halfOutline, 0);
			drawHandle(zoomedMax + halfOutline, 1);
		}

		// draw the scrollbar
		if (scrollbarEnabled) {

			// draw the buttons
			drawScrollbarButton(0);
			drawScrollbarButton(1);

			scrollbarGroup.translate(scrollerLeft, mathRound(outlineTop + height));

			scrollbarTrack.attr({
				width: scrollerWidth
			});

			scrollbar.attr({
				x: mathRound(scrollbarHeight + zoomedMin) + (scrollbarStrokeWidth % 2 / 2),
				width: range - scrollbarStrokeWidth
			});

			centerBarX = scrollbarHeight + zoomedMin + range / 2 - 0.5;

			scrollbarRifles.attr({ d: [
					M,
					centerBarX - 3, scrollbarHeight / 4,
					L,
					centerBarX - 3, 2 * scrollbarHeight / 3,
					M,
					centerBarX, scrollbarHeight / 4,
					L,
					centerBarX, 2 * scrollbarHeight / 3,
					M,
					centerBarX + 3, scrollbarHeight / 4,
					L,
					centerBarX + 3, 2 * scrollbarHeight / 3
				],
				visibility: range > 12 ? VISIBLE : HIDDEN
			});
		}

		rendered = true;
	}

	/**
	 * Event handler for the mouse down event.
	 */
	function mouseDownHandler(e) {
		e = chart.tracker.normalizeMouseEvent(e);
		var chartX = e.chartX,
			chartY = e.chartY,
			handleSensitivity = hasTouch ? 10 : 7,
			left,
			isOnNavigator;

		if (chartY > top && chartY < top + height + scrollbarHeight) { // we're vertically inside the navigator
			isOnNavigator = !scrollbarEnabled || chartY < top + height;

			// grab the left handle
			if (isOnNavigator && math.abs(chartX - zoomedMin - navigatorLeft) < handleSensitivity) {
				grabbedLeft = true;
				otherHandlePos = zoomedMax;

			// grab the right handle
			} else if (isOnNavigator && math.abs(chartX - zoomedMax - navigatorLeft) < handleSensitivity) {
				grabbedRight = true;
				otherHandlePos = zoomedMin;

			// grab the zoomed range
			} else if (chartX > navigatorLeft + zoomedMin && chartX < navigatorLeft + zoomedMax) {
				grabbedCenter = chartX;
				defaultBodyCursor = bodyStyle.cursor;
				bodyStyle.cursor = 'ew-resize';

				dragOffset = chartX - zoomedMin;

			// shift the range by clicking on shaded areas, scrollbar track or scrollbar buttons
			} else if (chartX > scrollerLeft && chartX < scrollerLeft + scrollerWidth) {

				if (isOnNavigator) { // center around the clicked point
					left = chartX - navigatorLeft - range / 2;
				} else { // click on scrollbar
					if (chartX < navigatorLeft) { // click left scrollbar button
						left = zoomedMin - mathMin(10, range);
					} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
						left = zoomedMin + mathMin(10, range);
					} else {
						// click on scrollbar track, shift the scrollbar by one range
						left = chartX < navigatorLeft + zoomedMin ? // on the left
							zoomedMin - range :
							zoomedMax;
					}
				}
				if (left < 0) {
					left = 0;
				} else if (left + range > navigatorWidth) {
					left = navigatorWidth - range;
				}
				if (left !== zoomedMin) { // it has actually moved
					chart.xAxis[0].setExtremes(
						xAxis.translate(left, true),
						xAxis.translate(left + range, true),
						true,
						false
					);
				}
			}
		}
		
	}

	/**
	 * Event handler for the mouse move event.
	 */
	function mouseMoveHandler(e) {
		e = chart.tracker.normalizeMouseEvent(e);
		var chartX = e.chartX;

		// validation for handle dragging
		if (chartX < navigatorLeft) {
			chartX = navigatorLeft;
		} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
			chartX = scrollerLeft + scrollerWidth - scrollbarHeight;
		}

		// drag left handle
		if (grabbedLeft) {
			hasDragged = true;
			render(0, 0, chartX - navigatorLeft, otherHandlePos);

		// drag right handle
		} else if (grabbedRight) {
			hasDragged = true;
			render(0, 0, otherHandlePos, chartX - navigatorLeft);

		// drag scrollbar or open area in navigator
		} else if (grabbedCenter) {
			hasDragged = true;
			if (chartX < dragOffset) { // outside left
				chartX = dragOffset;
			} else if (chartX > navigatorWidth + dragOffset - range) { // outside right
				chartX = navigatorWidth + dragOffset - range;
			}

			render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
		}
	}

	/**
	 * Event handler for the mouse up event.
	 */
	function mouseUpHandler() {
		if (hasDragged) {
				chart.xAxis[0].setExtremes(
					xAxis.translate(zoomedMin, true),
					xAxis.translate(zoomedMax, true),
					true,
					false
				);
			}
			grabbedLeft = grabbedRight = grabbedCenter = hasDragged = dragOffset = null;
			bodyStyle.cursor = defaultBodyCursor;
	}

	function updatedDataHandler() {
		var baseXAxis = baseSeries.xAxis,
			baseExtremes = baseXAxis.getExtremes(),
			baseMin = baseExtremes.min,
			baseMax = baseExtremes.max,
			baseDataMin = baseExtremes.dataMin,
			baseDataMax = baseExtremes.dataMax,
			range = baseMax - baseMin,
			stickToMin,
			stickToMax,
			newMax,
			newMin,
			doRedraw,
			navXData = navigatorSeries.xData,
			hasSetExtremes = !!baseXAxis.setExtremes;

		// detect whether to move the range
		stickToMax = baseMax >= navXData[navXData.length - 1];
		stickToMin = baseMin <= baseDataMin;

		// set the navigator series data to the new data of the base series
		if (!navigatorData) {
			navigatorSeries.options.pointStart = baseSeries.xData[0];
			navigatorSeries.setData(baseSeries.options.data, false);
			doRedraw = true;
		}

		// if the zoomed range is already at the min, move it to the right as new data
		// comes in
		if (stickToMin) {
			newMin = baseDataMin;
			newMax = newMin + range;
		}

		// if the zoomed range is already at the max, move it to the right as new data
		// comes in
		if (stickToMax) {
			newMax = baseDataMax;
			if (!stickToMin) { // if stickToMin is true, the new min value is set above
				newMin = mathMax(newMax - range, navigatorSeries.xData[0]);
			}
		}

		// update the extremes
		if (hasSetExtremes && (stickToMin || stickToMax)) {
			baseXAxis.setExtremes(newMin, newMax, true, false);
		// if it is not at any edge, just move the scroller window to reflect the new series data
		} else {
			if (doRedraw) {
				chart.redraw(false);
			}

			render(
				mathMax(baseMin, baseDataMin),
				mathMin(baseMax, baseDataMax)
			);
		}
	}

	/**
	 * Set up the mouse and touch events for the navigator and scrollbar
	 */
	function addEvents() {
		addEvent(chart.container, MOUSEDOWN, mouseDownHandler);
		addEvent(chart.container, MOUSEMOVE, mouseMoveHandler);
		addEvent(document, MOUSEUP, mouseUpHandler);
	}

	/**
	 * Removes the event handlers attached previously with addEvents.
	 */
	function removeEvents() {
		removeEvent(chart.container, MOUSEDOWN, mouseDownHandler);
		removeEvent(chart.container, MOUSEMOVE, mouseMoveHandler);
		removeEvent(document, MOUSEUP, mouseUpHandler);
		if (navigatorEnabled) {
			removeEvent(baseSeries, 'updatedData', updatedDataHandler);
		}
	}

	/**
	 * Initiate the Scroller object
	 */
	function init() {
		var xAxisIndex = chart.xAxis.length,
			yAxisIndex = chart.yAxis.length,
			baseChartSetSize = chart.setSize;

		// make room below the chart
		chart.extraBottomMargin = outlineHeight + navigatorOptions.margin;
		// get the top offset
		top = getAxisTop(chart.chartHeight);

		if (navigatorEnabled) {
			var baseOptions = baseSeries.options,
				mergedNavSeriesOptions,
				baseData = baseOptions.data,
				navigatorSeriesOptions = navigatorOptions.series;

			// remove it to prevent merging one by one
			navigatorData = navigatorSeriesOptions.data;
			baseOptions.data = navigatorSeriesOptions.data = null;


			// an x axis is required for scrollbar also
			xAxis = new chart.Axis(merge({
				ordinal: baseSeries.xAxis.options.ordinal // inherit base xAxis' ordinal option
			}, navigatorOptions.xAxis, {
				isX: true,
				type: 'datetime',
				index: xAxisIndex,
				height: height,
				top: top,
				offset: 0,
				offsetLeft: scrollbarHeight,
				offsetRight: -scrollbarHeight,
				startOnTick: false,
				endOnTick: false,
				minPadding: 0,
				maxPadding: 0,
				zoomEnabled: false
			}));

			yAxis = new chart.Axis(merge(navigatorOptions.yAxis, {
				alignTicks: false,
				height: height,
				top: top,
				offset: 0,
				index: yAxisIndex,
				zoomEnabled: false
			}));

			// dmerge the series options
			mergedNavSeriesOptions = merge(baseSeries.options, navigatorSeriesOptions, {
				threshold: null,
				clip: false,
				enableMouseTracking: false,
				group: 'nav', // for columns
				padXAxis: false,
				xAxis: xAxisIndex,
				yAxis: yAxisIndex,
				name: 'Navigator',
				showInLegend: false,
				isInternal: true,
				visible: true
			});

			// set the data back
			baseOptions.data = baseData;
			navigatorSeriesOptions.data = navigatorData;
			mergedNavSeriesOptions.data = navigatorData || baseData;

			// add the series
			navigatorSeries = chart.initSeries(mergedNavSeriesOptions);

			// respond to updated data in the base series
			// todo: use similiar hook when base series is not yet initialized
			addEvent(baseSeries, 'updatedData', updatedDataHandler);

		// in case of scrollbar only, fake an x axis to get translation
		} else {
			xAxis = {
				translate: function (value, reverse) {
					var ext = chart.xAxis[0].getExtremes(),
						scrollTrackWidth = chart.plotWidth - 2 * scrollbarHeight,
						dataMin = ext.dataMin,
						valueRange = ext.dataMax - dataMin;

					return reverse ?
						// from pixel to value
						(value * valueRange / scrollTrackWidth) + dataMin :
						// from value to pixel
						scrollTrackWidth * (value - dataMin) / valueRange;
				}
			};
		}
		
		
		// Override the chart.setSize method to adjust the xAxis and yAxis top option as well.
		// This needs to be done prior to chart.resize
		chart.setSize = function (width, height, animation) {
			xAxis.options.top = yAxis.options.top = top = getAxisTop(height);
			baseChartSetSize.call(chart, width, height, animation);
		};

		addEvents();
	}

	/**
	 * Destroys allocated elements.
	 */
	function destroy() {
		// Disconnect events added in addEvents
		removeEvents();

		// Destroy local variables
		each([xAxis, yAxis, leftShade, rightShade, outline, scrollbarTrack, scrollbar, scrollbarRifles, scrollbarGroup], function (obj) {
			if (obj && obj.destroy) {
				obj.destroy();
			}
		});
		xAxis = yAxis = leftShade = rightShade = outline = scrollbarTrack = scrollbar = scrollbarRifles = scrollbarGroup = null;

		// Destroy elements in collection
		each([scrollbarButtons, handles, elementsToDestroy], function (coll) {
			destroyObjectProperties(coll);
		});
	}

	// Run scroller
	init();

	// Expose
	return {
		render: render,
		destroy: destroy,
		series: navigatorSeries,
		xAxis: xAxis,
		yAxis: yAxis
	};

};

/* ****************************************************************************
 * End Scroller code														  *
 *****************************************************************************/

/* ****************************************************************************
 * Start Range Selector code												  *
 *****************************************************************************/
extend(defaultOptions, {
	rangeSelector: {
		// enabled: true,
		// buttons: {Object}
		// buttonSpacing: 0,
		buttonTheme: {
			width: 28,
			height: 16,
			padding: 1,
			r: 0,
			zIndex: 10 // #484
		//	states: {
		//		hover: {},
		//		select: {}
		// }
		}
		// inputDateFormat: '%b %e, %Y',
		// inputEditDateFormat: '%Y-%m-%d',
		// inputEnabled: true,
		// inputStyle: {}
		// labelStyle: {}
		// selected: undefined
		// todo:
		// - button styles for normal, hover and select state
		// - CSS text styles
		// - styles for the inputs and labels
	}
});
defaultOptions.lang = merge(defaultOptions.lang, {
	rangeSelectorZoom: 'Zoom',
	rangeSelectorFrom: 'From:',
	rangeSelectorTo: 'To:'
});

/**
 * The object constructor for the range selector
 * @param {Object} chart
 */
Highcharts.RangeSelector = function (chart) {
	var renderer = chart.renderer,
		rendered,
		container = chart.container,
		lang = defaultOptions.lang,
		div,
		leftBox,
		rightBox,
		boxSpanElements = {},
		divAbsolute,
		divRelative,
		selected,
		zoomText,
		buttons = [],
		buttonOptions,
		options,
		defaultButtons = [{
			type: 'month',
			count: 1,
			text: '1m'
		}, {
			type: 'month',
			count: 3,
			text: '3m'
		}, {
			type: 'month',
			count: 6,
			text: '6m'
		}, {
			type: 'ytd',
			text: 'YTD'
		}, {
			type: 'year',
			count: 1,
			text: '1y'
		}, {
			type: 'all',
			text: 'All'
		}];
		chart.resetZoomEnabled = false;

	/**
	 * The method to run when one of the buttons in the range selectors is clicked
	 * @param {Number} i The index of the button
	 * @param {Object} rangeOptions
	 * @param {Boolean} redraw
	 */
	function clickButton(i, rangeOptions, redraw) {

		var baseAxis = chart.xAxis[0],
			extremes = baseAxis && baseAxis.getExtremes(),
			navAxis = chart.scroller && chart.scroller.xAxis,
			navExtremes = navAxis && navAxis.getExtremes && navAxis.getExtremes(),
			navDataMin = navExtremes && navExtremes.dataMin,
			navDataMax = navExtremes && navExtremes.dataMax,
			baseDataMin = extremes && extremes.dataMin,
			baseDataMax = extremes && extremes.dataMax,
			dataMin = mathMin(baseDataMin, pick(navDataMin, baseDataMin)),
			dataMax = mathMax(baseDataMax, pick(navDataMax, baseDataMax)),
			newMin,
			newMax = baseAxis && mathMin(extremes.max, dataMax),
			now,
			date = new Date(newMax),
			type = rangeOptions.type,
			count = rangeOptions.count,
			baseXAxisOptions,
			range,
			rangeMin,
			year,
			// these time intervals have a fixed number of milliseconds, as opposed
			// to month, ytd and year
			fixedTimes = {
				millisecond: 1,
				second: 1000,
				minute: 60 * 1000,
				hour: 3600 * 1000,
				day: 24 * 3600 * 1000,
				week: 7 * 24 * 3600 * 1000
			};

		if (dataMin === null || dataMax === null || // chart has no data, base series is removed
				i === selected) { // same button is clicked twice
			return;
		}

		if (fixedTimes[type]) {
			range = fixedTimes[type] * count;
			newMin = mathMax(newMax - range, dataMin);
		} else if (type === 'month') {
			date.setMonth(date.getMonth() - count);
			newMin = mathMax(date.getTime(), dataMin);
			range = 30 * 24 * 3600 * 1000 * count;
		} else if (type === 'ytd') {
			date = new Date(0);
			now = new Date(dataMax);
			year = now.getFullYear();
			date.setFullYear(year);

			// workaround for IE6 bug, which sets year to next year instead of current
			if (String(year) !== dateFormat('%Y', date)) {
				date.setFullYear(year - 1);
			}

			newMin = rangeMin = mathMax(dataMin || 0, date.getTime());
			now = now.getTime();
			newMax = mathMin(dataMax || now, now);
		} else if (type === 'year') {
			date.setFullYear(date.getFullYear() - count);
			newMin = mathMax(dataMin, date.getTime());
			range = 365 * 24 * 3600 * 1000 * count;
		} else if (type === 'all' && baseAxis) {
			newMin = dataMin;
			newMax = dataMax;
		}

		// mark the button pressed
		if (buttons[i]) {
			buttons[i].setState(2);
		}

		// update the chart
		if (!baseAxis) { // axis not yet instanciated
			baseXAxisOptions = chart.options.xAxis;
			baseXAxisOptions[0] = merge(
				baseXAxisOptions[0],
				{
					range: range,
					min: rangeMin
				}
			);
			selected = i;

		} else { // existing axis object; after render time
			setTimeout(function () { // make sure the visual state is set before the heavy process begins
				baseAxis.setExtremes(
					newMin,
					newMax,
					pick(redraw, 1),
					0,
					{ rangeSelectorButton: rangeOptions }
				);
				selected = i;
			}, 1);
		}

	}

	/**
	 * The handler connected to container that handles mousedown.
	 */
	function mouseDownHandler() {
		if (leftBox) {
			leftBox.blur();
		}
		if (rightBox) {
			rightBox.blur();
		}
	}

	/**
	 * Initialize the range selector
	 */
	function init() {
		chart.extraTopMargin = 25;
		options = chart.options.rangeSelector;
		buttonOptions = options.buttons || defaultButtons;


		var selectedOption = options.selected;

		addEvent(container, MOUSEDOWN, mouseDownHandler);

		// zoomed range based on a pre-selected button index
		if (selectedOption !== UNDEFINED && buttonOptions[selectedOption]) {
			clickButton(selectedOption, buttonOptions[selectedOption], false);
		}

		// normalize the pressed button whenever a new range is selected
		addEvent(chart, 'load', function () {
			addEvent(chart.xAxis[0], 'afterSetExtremes', function () {
				if (this.isDirty) {
					if (buttons[selected]) {
						buttons[selected].setState(0);
					}
					selected = null;
				}
			});
		});
	}


	/**
	 * Set the internal and displayed value of a HTML input for the dates
	 * @param {Object} input
	 * @param {Number} time
	 */
	function setInputValue(input, time) {
		var format = input.hasFocus ? options.inputEditDateFormat || '%Y-%m-%d' : options.inputDateFormat || '%b %e, %Y';
		if (time) {
			input.HCTime = time;
		}
		input.value = dateFormat(format, input.HCTime);
	}

	/**
	 * Draw either the 'from' or the 'to' HTML input box of the range selector
	 * @param {Object} name
	 */
	function drawInput(name) {
		var isMin = name === 'min',
			input;

		// create the text label
		boxSpanElements[name] = createElement('span', {
			innerHTML: lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo']
		}, options.labelStyle, div);

		// create the input element
		input = createElement('input', {
			name: name,
			className: PREFIX + 'range-selector',
			type: 'text'
		}, extend({
			width: '80px',
			height: '16px',
			border: '1px solid silver',
			marginLeft: '5px',
			marginRight: isMin ? '5px' : '0',
			textAlign: 'center'
		}, options.inputStyle), div);


		input.onfocus = input.onblur = function (e) {
			e = e || window.event;
			input.hasFocus = e.type === 'focus';
			setInputValue(input);
		};

		// handle changes in the input boxes
		input.onchange = function () {
			var inputValue = input.value,
				value = Date.parse(inputValue),
				extremes = chart.xAxis[0].getExtremes();

			// if the value isn't parsed directly to a value by the browser's Date.parse method,
			// like YYYY-MM-DD in IE, try parsing it a different way
			if (isNaN(value)) {
				value = inputValue.split('-');
				value = Date.UTC(pInt(value[0]), pInt(value[1]) - 1, pInt(value[2]));
			}

			if (!isNaN(value) &&
				((isMin && (value >= extremes.dataMin && value <= rightBox.HCTime)) ||
				(!isMin && (value <= extremes.dataMax && value >= leftBox.HCTime)))
			) {
				chart.xAxis[0].setExtremes(
					isMin ? value : extremes.min,
					isMin ? extremes.max : value
				);
			}
		};

		return input;
	}

	/**
	 * Render the range selector including the buttons and the inputs. The first time render
	 * is called, the elements are created and positioned. On subsequent calls, they are
	 * moved and updated.
	 * @param {Number} min X axis minimum
	 * @param {Number} max X axis maximum
	 */
	function render(min, max) {
		var chartStyle = chart.options.chart.style,
			buttonTheme = options.buttonTheme,
			inputEnabled = options.inputEnabled !== false,
			states = buttonTheme && buttonTheme.states,
			plotLeft = chart.plotLeft,
			buttonLeft;

		// create the elements
		if (!rendered) {
			zoomText = renderer.text(lang.rangeSelectorZoom, plotLeft, chart.plotTop - 10)
				.css(options.labelStyle)
				.add();

			// button starting position
			buttonLeft = plotLeft + zoomText.getBBox().width + 5;

			each(buttonOptions, function (rangeOptions, i) {
				buttons[i] = renderer.button(
					rangeOptions.text,
					buttonLeft,
					chart.plotTop - 25,
					function () {
						clickButton(i, rangeOptions);
						this.isActive = true;
					},
					buttonTheme,
					states && states.hover,
					states && states.select
				)
				.css({
					textAlign: 'center'
				})
				.add();

				// increase button position for the next button
				buttonLeft += buttons[i].width + (options.buttonSpacing || 0);

				if (selected === i) {
					buttons[i].setState(2);
				}

			});

			// first create a wrapper outside the container in order to make
			// the inputs work and make export correct
			if (inputEnabled) {
				divRelative = div = createElement('div', null, {
					position: 'relative',
					height: 0,
					fontFamily: chartStyle.fontFamily,
					fontSize: chartStyle.fontSize,
					zIndex: 1 // above container
				});

				container.parentNode.insertBefore(div, container);

				// create an absolutely positionied div to keep the inputs
				divAbsolute = div = createElement('div', null, extend({
					position: 'absolute',
					top: (chart.plotTop - 25) + 'px',
					right: (chart.chartWidth - chart.plotLeft - chart.plotWidth) + 'px'
				}, options.inputBoxStyle), div);

				leftBox = drawInput('min');

				rightBox = drawInput('max');
			}
		}

		if (inputEnabled) {
			setInputValue(leftBox, min);
			setInputValue(rightBox, max);
		}


		rendered = true;
	}

	/**
	 * Destroys allocated elements.
	 */
	function destroy() {
		removeEvent(container, MOUSEDOWN, mouseDownHandler);

		// Destroy elements in collections
		each([buttons], function (coll) {
			destroyObjectProperties(coll);
		});

		// Destroy zoomText
		if (zoomText) {
			zoomText = zoomText.destroy();
		}

		// Clear input element events
		if (leftBox) {
			leftBox.onfocus = leftBox.onblur = leftBox.onchange = null;
		}
		if (rightBox) {
			rightBox.onfocus = rightBox.onblur = rightBox.onchange = null;
		}

		// Discard divs and spans
		each([leftBox, rightBox, boxSpanElements.min, boxSpanElements.max, divAbsolute, divRelative], function (item) {
			discardElement(item);
		});
		// Null the references
		leftBox = rightBox = boxSpanElements = div = divAbsolute = divRelative = null;

	}

	// Run RangeSelector
	init();

	// Expose
	return {
		render: render,
		destroy: destroy
	};
};

/* ****************************************************************************
 * End Range Selector code													*
 *****************************************************************************/



Chart.prototype.callbacks.push(function (chart) {
	var extremes,
		scroller = chart.scroller,
		rangeSelector = chart.rangeSelector;

	function renderScroller() {
		extremes = chart.xAxis[0].getExtremes();
		scroller.render(
			mathMax(extremes.min, extremes.dataMin),
			mathMin(extremes.max, extremes.dataMax)
		);
	}

	function renderRangeSelector() {
		extremes = chart.xAxis[0].getExtremes();
		rangeSelector.render(extremes.min, extremes.max);
	}

	function afterSetExtremesHandlerScroller(e) {
		scroller.render(e.min, e.max);
	}

	function afterSetExtremesHandlerRangeSelector(e) {
		rangeSelector.render(e.min, e.max);
	}

	function destroyEvents() {
		if (scroller) {
			removeEvent(chart, 'resize', renderScroller);
			removeEvent(chart.xAxis[0], 'afterSetExtremes', afterSetExtremesHandlerScroller);
		}
		if (rangeSelector) {
			removeEvent(chart, 'resize', renderRangeSelector);
			removeEvent(chart.xAxis[0], 'afterSetExtremes', afterSetExtremesHandlerRangeSelector);
		}
	}

	// initiate the scroller
	if (scroller) {
		// redraw the scroller on setExtremes
		addEvent(chart.xAxis[0], 'afterSetExtremes', afterSetExtremesHandlerScroller);

		// redraw the scroller chart resize
		addEvent(chart, 'resize', renderScroller);

		// do it now
		renderScroller();
	}
	if (rangeSelector) {
		// redraw the scroller on setExtremes
		addEvent(chart.xAxis[0], 'afterSetExtremes', afterSetExtremesHandlerRangeSelector);

		// redraw the scroller chart resize
		addEvent(chart, 'resize', renderRangeSelector);

		// do it now
		renderRangeSelector();
	}

	// Remove resize/afterSetExtremes at chart destroy
	addEvent(chart, 'destroy', destroyEvents);
});
/**
 * A wrapper for Chart with all the default values for a Stock chart
 */
Highcharts.StockChart = function (options, callback) {
	var seriesOptions = options.series, // to increase performance, don't merge the data 
		opposite,
		lineOptions = {

			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: true,
						radius: 5
					}
				}
			},
			// gapSize: 0,
			shadow: false,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			dataGrouping: {
				enabled: true
			}
		};

	// apply X axis options to both single and multi y axes
	options.xAxis = map(splat(options.xAxis || {}), function (xAxisOptions) {
		return merge({ // defaults
				minPadding: 0,
				maxPadding: 0,
				ordinal: true,
				title: {
					text: null
				},
				showLastLabel: true
			}, xAxisOptions, // user options 
			{ // forced options
				type: 'datetime',
				categories: null
			});
	});

	// apply Y axis options to both single and multi y axes
	options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
		opposite = yAxisOptions.opposite;
		return merge({ // defaults
			labels: {
				align: opposite ? 'right' : 'left',
				x: opposite ? -2 : 2,
				y: -2
			},
			showLastLabel: false,
			title: {
				text: null
			}
		}, yAxisOptions // user options
		);
	});

	options.series = null;

	options = merge({
		chart: {
			panning: true
		},
		navigator: {
			enabled: true
		},
		scrollbar: {
			enabled: true
		},
		rangeSelector: {
			enabled: true
		},
		title: {
			text: null
		},
		tooltip: {
			shared: true,
			crosshairs: true
		},
		legend: {
			enabled: false
		},

		plotOptions: {
			line: lineOptions,
			spline: lineOptions,
			area: lineOptions,
			areaspline: lineOptions,
			column: {
				shadow: false,
				borderWidth: 0,
				dataGrouping: {
					enabled: true
				}
			}
		}

	},
	options, // user's options

	{ // forced options
		chart: {
			inverted: false
		}
	});

	options.series = seriesOptions;


	return new Chart(options, callback);
};


/* ****************************************************************************
 * Start value compare logic                                                  *
 *****************************************************************************/
 
var seriesInit = seriesProto.init, 
	seriesProcessData = seriesProto.processData,
	pointTooltipFormatter = Point.prototype.tooltipFormatter;
	
/**
 * Extend series.init by adding a method to modify the y value used for plotting
 * on the y axis. This method is called both from the axis when finding dataMin
 * and dataMax, and from the series.translate method.
 */
seriesProto.init = function () {
	
	// call base method
	seriesInit.apply(this, arguments);
	
	// local variables
	var series = this,
		compare = series.options.compare;
	
	if (compare) {
		series.modifyValue = function (value, point) {
			var compareValue = this.compareValue;
			
			// get the modified value
			value = compare === 'value' ? 
				value - compareValue : // compare value
				value = 100 * (value / compareValue) - 100; // compare percent
				
			// record for tooltip etc.
			if (point) {
				point.change = value;
			}
			
			return value;
		};
	}	
};

/**
 * Extend series.processData by finding the first y value in the plot area,
 * used for comparing the following values 
 */
seriesProto.processData = function () {
	var series = this;
	
	// call base method
	seriesProcessData.apply(this, arguments);
	
	if (series.options.compare) {
		
		// local variables
		var i = 0,
			processedXData = series.processedXData,
			processedYData = series.processedYData,
			length = processedYData.length,
			min = series.xAxis.getExtremes().min;
		
		// find the first value for comparison
		for (; i < length; i++) {
			if (typeof processedYData[i] === NUMBER && processedXData[i] >= min) {
				series.compareValue = processedYData[i];
				break;
			}
		}
	}
};

/**
 * Extend the tooltip formatter by adding support for the point.change variable
 * as well as the changeDecimals option
 */
Point.prototype.tooltipFormatter = function (pointFormat) {
	var point = this;
	
	pointFormat = pointFormat.replace(
		'{point.change}',
		(point.change > 0 ? '+' : '') + numberFormat(point.change, point.series.tooltipOptions.changeDecimals || 2)
	); 
	
	return pointTooltipFormatter.apply(this, [pointFormat]);
};

/* ****************************************************************************
 * End value compare logic                                                    *
 *****************************************************************************/

/* ****************************************************************************
 * Start ordinal axis logic                                                   *
 *****************************************************************************/

(function () {
	var baseInit = seriesProto.init,
		baseGetSegments = seriesProto.getSegments;
		
	seriesProto.init = function () {
		var series = this,
			chart,
			xAxis;
		
		// call base method
		baseInit.apply(series, arguments);
		
		// chart and xAxis are set in base init
		chart = series.chart;
		xAxis = series.xAxis;
		
		// Destroy the extended ordinal index on updated data
		if (xAxis && xAxis.options.ordinal) {
			addEvent(series, 'updatedData', function () {
				delete xAxis.ordinalIndex;
			});
		}
		
		/**
		 * Extend the ordinal axis object. If we rewrite the axis object to a prototype model,
		 * we should add these properties to the prototype instead.
		 */
		if (xAxis && xAxis.options.ordinal && !xAxis.hasOrdinalExtension) {
				
			xAxis.hasOrdinalExtension = true;
		
			/**
			 * Calculate the ordinal positions before tick positions are calculated. 
			 * TODO: When we rewrite Axis to use a prototype model, this should be implemented
			 * as a method extension to avoid overhead in the core.
			 */
			xAxis.beforeSetTickPositions = function () {
				var axis = this,
					len,
					ordinalPositions = [],
					useOrdinal = false,
					dist,
					extremes = axis.getExtremes(),
					min = extremes.min,
					max = extremes.max,
					minIndex,
					maxIndex,
					slope,
					i;
				
				// apply the ordinal logic
				if (axis.options.ordinal) {
					
					each(axis.series, function (series, i) {
						
						if (series.visible !== false) {
							
							// concatenate the processed X data into the existing positions, or the empty array 
							ordinalPositions = ordinalPositions.concat(series.processedXData);
							len = ordinalPositions.length;
							
							// if we're dealing with more than one series, remove duplicates
							if (i && len) {
							
								ordinalPositions.sort(function (a, b) {
									return a - b; // without a custom function it is sorted as strings
								});
							
								i = len - 1;
								while (i--) {
									if (ordinalPositions[i] === ordinalPositions[i + 1]) {
										ordinalPositions.splice(i, 1);
									}
								}
							}
						}
						
					});
					
					// cache the length
					len = ordinalPositions.length;					
					
					// Check if we really need the overhead of mapping axis data against the ordinal positions.
					// If the series consist of evenly spaced data any way, we don't need any ordinal logic.
					if (len > 2) { // two points have equal distance by default
						dist = ordinalPositions[1] - ordinalPositions[0]; 
						i = len - 1;
						while (i-- && !useOrdinal) {
							if (ordinalPositions[i + 1] - ordinalPositions[i] !== dist) {
								useOrdinal = true;
							}
						}
					}
					
					// Record the slope and offset to compute the linear values from the array index.
					// Since the ordinal positions may exceed the current range, get the start and 
					// end positions within it (#719, #665b)
					if (useOrdinal) {
						
						// Register
						axis.ordinalPositions = ordinalPositions;
						
						// This relies on the ordinalPositions being set
						minIndex = xAxis.val2lin(min, true);
						maxIndex = xAxis.val2lin(max, true);
				
						// Set the slope and offset of the values compared to the indices in the ordinal positions
						axis.ordinalSlope = slope = (max - min) / (maxIndex - minIndex);
						axis.ordinalOffset = min - (minIndex * slope);
						
					} else {
						axis.ordinalPositions = axis.ordinalSlope = axis.ordinalOffset = UNDEFINED;
					}
				}
			};
			
			/**
			 * Translate from a linear axis value to the corresponding ordinal axis position. If there
			 * are no gaps in the ordinal axis this will be the same. The translated value is the value
			 * that the point would have if the axis were linear, using the same min and max.
			 * 
			 * @param Number val The axis value
			 * @param Boolean toIndex Whether to return the index in the ordinalPositions or the new value
			 */
			xAxis.val2lin = function (val, toIndex) {
				
				var axis = this,
					ordinalPositions = axis.ordinalPositions;
				
				if (!ordinalPositions) {
					return val;
				
				} else {
				
					var ordinalLength = ordinalPositions.length,
						i,
						distance,
						ordinalIndex;
						
					// first look for an exact match in the ordinalpositions array
					i = ordinalLength;
					while (i--) {
						if (ordinalPositions[i] === val) {
							ordinalIndex = i;
							break;
						}
					}
					
					// if that failed, find the intermediate position between the two nearest values
					i = ordinalLength - 1;
					while (i--) {
						if (val > ordinalPositions[i] || i === 0) { // interpolate
							distance = (val - ordinalPositions[i]) / (ordinalPositions[i + 1] - ordinalPositions[i]); // something between 0 and 1
							ordinalIndex = i + distance;
							break;
						}
					}
					return toIndex ?
						ordinalIndex :
						axis.ordinalSlope * (ordinalIndex || 0) + axis.ordinalOffset;
				}
			};
			
			/**
			 * Translate from linear (internal) to axis value
			 * 
			 * @param Number val The linear abstracted value
			 * @param Boolean fromIndex Translate from an index in the ordinal positions rather than a value
			 */
			xAxis.lin2val = function (val, fromIndex) {
				var axis = this,
					ordinalPositions = axis.ordinalPositions;
				
				if (!ordinalPositions) { // the visible range contains only equally spaced values
					return val;
				
				} else {
				
					var ordinalSlope = axis.ordinalSlope,
						ordinalOffset = axis.ordinalOffset,
						i = ordinalPositions.length - 1,
						linearEquivalentLeft,
						linearEquivalentRight,
						distance;
						
					
					// Handle the case where we translate from the index directly, used only 
					// when panning an ordinal axis
					if (fromIndex) {
						
						if (val < 0) { // out of range, in effect panning to the left
							val = ordinalPositions[0];
						} else if (val > i) { // out of range, panning to the right
							val = ordinalPositions[i];
						} else { // split it up
							i = mathFloor(val);
							distance = val - i; // the decimal
						}
						
					// Loop down along the ordinal positions. When the linear equivalent of i matches
					// an ordinal position, interpolate between the left and right values.
					} else {
						while (i--) {
							linearEquivalentLeft = (ordinalSlope * i) + ordinalOffset;
							if (val >= linearEquivalentLeft) {
								linearEquivalentRight = (ordinalSlope * (i + 1)) + ordinalOffset;
								distance = (val - linearEquivalentLeft) / (linearEquivalentRight - linearEquivalentLeft); // something between 0 and 1
								break;
							}
						}
					}
					
					// If the index is within the range of the ordinal positions, return the associated
					// or interpolated value. If not, just return the value
					return distance !== UNDEFINED && ordinalPositions[i] !== UNDEFINED ?
						ordinalPositions[i] + (distance ? distance * (ordinalPositions[i + 1] - ordinalPositions[i]) : 0) : 
						val;
				}
			};
			
			/**
			 * Get the ordinal positions for the entire data set. This is necessary in chart panning
			 * because we need to find out what points or data groups are available outside the 
			 * visible range. When a panning operation starts, if an index for the given grouping
			 * does not exists, it is created and cached. This index is deleted on updated data, so
			 * it will be regenerated the next time a panning operation starts.
			 */
			xAxis.getExtendedPositions = function () {
				var grouping = xAxis.series[0].currentDataGrouping,
					ordinalIndex = xAxis.ordinalIndex,
					key = grouping ? grouping.count + grouping.unitName : 'raw',
					extremes = xAxis.getExtremes(),
					fakeAxis,
					fakeSeries;
					
				// If this is the first time, or the ordinal index is deleted by updatedData,
				// create it.
				if (!ordinalIndex) {
					ordinalIndex = xAxis.ordinalIndex = {};
				}
				
				
				if (!ordinalIndex[key]) {
					
					// Create a fake axis object where the extended ordinal positions are emulated
					fakeAxis = {
						series: [],
						getExtremes: function () {
							return {
								min: extremes.dataMin,
								max: extremes.dataMax
							};
						},
						options: {
							ordinal: true
						}
					};
					
					// Add the fake series to hold the full data, then apply processData to it
					each(xAxis.series, function (series) {
						fakeSeries = {
							xAxis: fakeAxis,
							xData: series.xData,
							chart: chart
						};
						fakeSeries.options = {
							dataGrouping : grouping ? {
								enabled: true,
								forced: true,
								approximation: 'open', // doesn't matter which, use the fastest
								units: [[grouping.unitName, [grouping.count]]]
							} : {
								enabled: false
							}
						};
						series.processData.apply(fakeSeries);
						
						fakeAxis.series.push(fakeSeries);
					});
					
					// Run beforeSetTickPositions to compute the ordinalPositions
					xAxis.beforeSetTickPositions.apply(fakeAxis);
					
					// Cache it
					ordinalIndex[key] = fakeAxis.ordinalPositions;
				}
				return ordinalIndex[key];
			};
			
			/**
			 * Find the factor to estimate how wide the plot area would have been if ordinal
			 * gaps were included. This value is used to compute an imagined plot width in order
			 * to establish the data grouping interval. 
			 * 
			 * A real world case is the intraday-candlestick
			 * example. Without this logic, it would show the correct data grouping when viewing
			 * a range within each day, but once moving the range to include the gap between two
			 * days, the interval would include the cut-away night hours and the data grouping
			 * would be wrong. So the below method tries to compensate by identifying the most
			 * common point interval, in this case days. 
			 * 
			 * An opposite case is presented in issue #718. We have a long array of daily data,
			 * then one point is appended one hour after the last point. We expect the data grouping
			 * not to change.
			 * 
			 * In the future, if we find cases where this estimation doesn't work optimally, we
			 * might need to add a second pass to the data grouping logic, where we do another run
			 * with a greater interval if the number of data groups is more than a certain fraction
			 * of the desired group count.
			 */
			xAxis.getGroupIntervalFactor = function (xMin, xMax, processedXData) {
				var i = 0,
					len = processedXData.length, 
					distances = [],
					median;
					
				// Register all the distances in an array
				for (; i < len - 1; i++) {
					distances[i] = processedXData[i + 1] - processedXData[i];
				}
				
				// Sort them and find the median
				distances.sort(function (a, b) {
					return a - b;
				});
				median = distances[mathFloor(len / 2)];
				
				// Return the factor needed for data grouping
				return (len * median) / (xMax - xMin);
			};
			
			/**
			 * Make the tick intervals closer because the ordinal gaps make the ticks spread out or cluster
			 */
			xAxis.postProcessTickInterval = function (tickInterval) {
				// TODO: http://jsfiddle.net/highcharts/FQm4E/1/
				// This is a case where this algorithm doesn't work optimally. In this case, the 
				// tick labels are spread out per week, but all the gaps reside within weeks. So 
				// we have a situation where the labels are courser than the ordinal gaps, and 
				// thus the tick interval should not be altered				
				var ordinalSlope = this.ordinalSlope;
				
				return ordinalSlope ? 
					tickInterval / (ordinalSlope / xAxis.closestPointRange) : 
					tickInterval;
			};
			
			/**
			 * In an ordinal axis, there might be areas with dense consentrations of points, then large
			 * gaps between some. Creating equally distributed ticks over this entire range
			 * may lead to a huge number of ticks that will later be removed. So instead, break the 
			 * positions up in segments, find the tick positions for each segment then concatenize them.
			 * This method is used from both data grouping logic and X axis tick position logic. 
			 */
			xAxis.getNonLinearTimeTicks = function (normalizedInterval, min, max, startOfWeek, positions, closestDistance, findHigherRanks) {
				
				var start = 0,
					end = 0,
					segmentPositions,
					higherRanks = {},
					hasCrossedHigherRank,
					info,
					posLength,
					outsideMax,
					groupPositions = [],
					tickPixelIntervalOption = xAxis.options.tickPixelInterval;
					
				// The positions are not always defined, for example for ordinal positions when data
				// has regular interval
				if (!positions || min === UNDEFINED) {
					return getTimeTicks(normalizedInterval, min, max, startOfWeek);
				}
				
				// Analyze the positions array to split it into segments on gaps larger than 5 times
				// the closest distance. The closest distance is already found at this point, so 
				// we reuse that instead of computing it again.
				posLength = positions.length;
				for (; end < posLength; end++) {
					
					outsideMax = end && positions[end - 1] > max;
					
					if (positions[end] < min) { // Set the last position before min
						start = end;						
					}
					
					if (end === posLength - 1 || positions[end + 1] - positions[end] > closestDistance * 5 || outsideMax) {
						
						// For each segment, calculate the tick positions from the getTimeTicks utility
						// function. The interval will be the same regardless of how long the segment is.
						segmentPositions = getTimeTicks(normalizedInterval, positions[start], positions[end], startOfWeek);		
						
						groupPositions = groupPositions.concat(segmentPositions);
						
						// Set start of next segment
						start = end + 1;						
					}
					
					if (outsideMax) {
						break;
					}
				}
				
				// Get the grouping info from the last of the segments. The info is the same for
				// all segments.
				info = segmentPositions.info;
				
				// Optionally identify ticks with higher rank, for example when the ticks
				// have crossed midnight.
				if (findHigherRanks && info.unitRange <= timeUnits[HOUR]) {
					end = groupPositions.length - 1;
					
					// Compare points two by two
					for (start = 1; start < end; start++) {
						if (new Date(groupPositions[start])[getDate]() !== new Date(groupPositions[start - 1])[getDate]()) {
							higherRanks[groupPositions[start]] = DAY;
							hasCrossedHigherRank = true;
						}
					}
					
					// If the complete array has crossed midnight, we want to mark the first
					// positions also as higher rank
					if (hasCrossedHigherRank) {
						higherRanks[groupPositions[0]] = DAY;
					}
					info.higherRanks = higherRanks;
				}
				
				// Save the info
				groupPositions.info = info;
				
				
				
				// Don't show ticks within a gap in the ordinal axis, where the space between
				// two points is greater than a portion of the tick pixel interval
				if (findHigherRanks && defined(tickPixelIntervalOption)) { // check for squashed ticks
					
					var length = groupPositions.length,
						i = length,
						itemToRemove,
						translated,
						translatedArr = [],
						lastTranslated,
						medianDistance,
						distance,
						distances = [];
						
					// Find median pixel distance in order to keep a reasonably even distance between
					// ticks (#748)
					while (i--) {
						translated = xAxis.translate(groupPositions[i]);
						if (lastTranslated) {
							distances[i] = lastTranslated - translated;
						}
						translatedArr[i] = lastTranslated = translated; 
					}
					distances.sort();
					medianDistance = distances[mathFloor(distances.length / 2)];
					if (medianDistance < tickPixelIntervalOption * 0.6) {
						medianDistance = null;
					}
					
					// Now loop over again and remove ticks where needed
					i = groupPositions[length - 1] > max ? length - 1 : length; // #817
					lastTranslated = undefined;
					while (i--) {
						translated = translatedArr[i];
						distance = lastTranslated - translated;
	
						// Remove ticks that are closer than 0.6 times the pixel interval from the one to the right,
						// but not if it is close to the median distance (#748).
						if (lastTranslated && distance < tickPixelIntervalOption * 0.8 && 
								(medianDistance === null || distance < medianDistance * 0.8)) {
							
							// Is this a higher ranked position with a normal position to the right?
							if (higherRanks[groupPositions[i]] && !higherRanks[groupPositions[i + 1]]) {
								
								// Yes: remove the lower ranked neighbour to the right
								itemToRemove = i + 1;
								lastTranslated = translated; // #709
								
							} else {
								
								// No: remove this one
								itemToRemove = i;
							}
							
							groupPositions.splice(itemToRemove, 1);
							
						} else {
							lastTranslated = translated;
						}
					}
				}
				
				return groupPositions;
			};
			
			
			/**
			 * Overrride the chart.pan method for ordinal axes. 
			 */
			
			var baseChartPan = chart.pan;
			chart.pan = function (chartX) {
				var xAxis = chart.xAxis[0],
					runBase = false;
				if (xAxis.options.ordinal) {
					
					var mouseDownX = chart.mouseDownX,
						extremes = xAxis.getExtremes(),
						dataMax = extremes.dataMax,
						min = extremes.min,
						max = extremes.max,
						newMin,
						newMax,
						hoverPoints = chart.hoverPoints,
						closestPointRange = xAxis.closestPointRange,
						pointPixelWidth = xAxis.translationSlope * (xAxis.ordinalSlope || closestPointRange),
						movedUnits = (mouseDownX - chartX) / pointPixelWidth, // how many ordinal units did we move?
						extendedAxis = { ordinalPositions: xAxis.getExtendedPositions() }, // get index of all the chart's points
						ordinalPositions,
						searchAxisLeft,
						lin2val = xAxis.lin2val,
						val2lin = xAxis.val2lin,
						searchAxisRight;
					
					if (!extendedAxis.ordinalPositions) { // we have an ordinal axis, but the data is equally spaced
						runBase = true;
					
					} else if (mathAbs(movedUnits) > 1) {
						
						// Remove active points for shared tooltip
						if (hoverPoints) {
							each(hoverPoints, function (point) {
								point.setState();
							});
						}
						
						if (movedUnits < 0) {
							searchAxisLeft = extendedAxis;
							searchAxisRight = xAxis.ordinalPositions ? xAxis : extendedAxis;
						} else {
							searchAxisLeft = xAxis.ordinalPositions ? xAxis : extendedAxis;
							searchAxisRight = extendedAxis;
						}
						
						// In grouped data series, the last ordinal position represents the grouped data, which is 
						// to the left of the real data max. If we don't compensate for this, we will be allowed
						// to pan grouped data series passed the right of the plot area. 
						ordinalPositions = searchAxisRight.ordinalPositions;
						if (dataMax > ordinalPositions[ordinalPositions.length - 1]) {
							ordinalPositions.push(dataMax);
						}
						
						// Get the new min and max values by getting the ordinal index for the current extreme, 
						// then add the moved units and translate back to values. This happens on the 
						// extended ordinal positions if the new position is out of range, else it happens
						// on the current x axis which is smaller and faster.
						newMin = lin2val.apply(searchAxisLeft, [
							val2lin.apply(searchAxisLeft, [min, true]) + movedUnits, // the new index 
							true // translate from index
						]);
						newMax = lin2val.apply(searchAxisRight, [
							val2lin.apply(searchAxisRight, [max, true]) + movedUnits, // the new index 
							true // translate from index
						]);
						
						// Apply it if it is within the available data range
						if (newMin > mathMin(extremes.dataMin, min) && newMax < mathMax(dataMax, max)) {
							xAxis.setExtremes(newMin, newMax, true, false);
						}
				
						chart.mouseDownX = chartX; // set new reference for next run
						css(chart.container, { cursor: 'move' });
					}
				
				} else {
					runBase = true;
				}
				
				// revert to the linear chart.pan version
				if (runBase) {
					baseChartPan.apply(chart, arguments);
				}
			}; 
		}
	};
			
	/**
	 * Extend getSegments by identifying gaps in the ordinal data so that we can draw a gap in the 
	 * line or area
	 */
	seriesProto.getSegments = function () {
		
		var series = this,
			segments,
			gapSize = series.options.gapSize;
	
		// call base method
		baseGetSegments.apply(series);
		
		if (series.xAxis.options.ordinal && gapSize) {
		
			// properties
			segments = series.segments;
			
			// extension for ordinal breaks
			each(segments, function (segment, no) {
				var i = segment.length - 1;
				while (i--) {
					if (segment[i + 1].x - segment[i].x > series.xAxis.closestPointRange * gapSize) {
						segments.splice( // insert after this one
							no + 1,
							0,
							segment.splice(i + 1, segment.length - i)
						);
					}
				}
			});
		}
	};
}());

/* ****************************************************************************
 * End ordinal axis logic                                                   *
 *****************************************************************************/
// global variables
extend(Highcharts, {
	Chart: Chart,
	dateFormat: dateFormat,
	pathAnim: pathAnim,
	getOptions: getOptions,
	hasBidiBug: hasBidiBug,
	numberFormat: numberFormat,
	Point: Point,
	Color: Color,
	Renderer: Renderer,
	SVGRenderer: SVGRenderer,
	VMLRenderer: VMLRenderer,
	CanVGRenderer: CanVGRenderer,
	seriesTypes: seriesTypes,
	setOptions: setOptions,
	Series: Series,

	// Expose utility funcitons for modules
	addEvent: addEvent,
	removeEvent: removeEvent,
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	extend: extend,
	map: map,
	merge: merge,
	pick: pick,
	splat: splat,
	extendClass: extendClass,
	placeBox: placeBox,
	product: 'Highstock',
	version: '1.1.5'
});
}());
