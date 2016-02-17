var timers = [],
	getStyle,

	// Previous adapter functions
	inArray,
	each,
	grep,
	offset,
	map,
	addEvent,
	removeEvent,
	fireEvent,
	animate,
	stop;

/**
 * An animator object. One instance applies to one property (attribute or style prop) 
 * on one element.
 * 
 * @param {object} elem	The element to animate. May be a DOM element or a Highcharts SVGElement wrapper.
 * @param {object} options Animation options, including duration, easing, step and complete.
 * @param {object} prop	The property to animate.
 */
function Fx(elem, options, prop) {
	this.options = options;
	this.elem = elem;
	this.prop = prop;
}
Fx.prototype = {
	
	/**
	 * Animating a path definition on SVGElement
	 * @returns {undefined} 
	 */
	dSetter: function () {
		var start = this.paths[0],
			end = this.paths[1],
			ret = [],
			now = this.now,
			i = start.length,
			startVal;

		if (now === 1) { // land on the final path without adjustment points appended in the ends
			ret = this.toD;

		} else if (i === end.length && now < 1) {
			while (i--) {
				startVal = parseFloat(start[i]);
				ret[i] =
					isNaN(startVal) ? // a letter instruction like M or L
							start[i] :
							now * (parseFloat(end[i] - startVal)) + startVal;

			}
		} else { // if animation is finished or length not matching, land on right value
			ret = end;
		}
		this.elem.attr('d', ret);
	},

	/**
	 * Update the element with the current animation step
	 * @returns {undefined}
	 */
	update: function () {
		var elem = this.elem,
			prop = this.prop, // if destroyed, it is null
			now = this.now,
			step = this.options.step;

		// Animation setter defined from outside
		if (this[prop + 'Setter']) {
			this[prop + 'Setter']();

		// Other animations on SVGElement
		} else if (elem.attr) {
			if (elem.element) {
				elem.attr(prop, now);
			}

		// HTML styles, raw HTML content like container size
		} else {
			elem.style[prop] = now + this.unit;
		}
		
		if (step) {
			step.call(elem, now, this);
		}

	},

	/**
	 * Run an animation
	 */
	run: function (from, to, unit) {
		var self = this,
			timer = function (gotoEnd) {
				return timer.stopped ? false : self.step(gotoEnd);
			},
			i;

		this.startTime = +new Date();
		this.start = from;
		this.end = to;
		this.unit = unit;
		this.now = this.start;
		this.pos = 0;

		timer.elem = this.elem;

		if (timer() && timers.push(timer) === 1) {
			timer.timerId = setInterval(function () {
				
				for (i = 0; i < timers.length; i++) {
					if (!timers[i]()) {
						timers.splice(i--, 1);
					}
				}

				if (!timers.length) {
					clearInterval(timer.timerId);
				}
			}, 13);
		}
	},
	
	/**
	 * Run a single step in the animation
	 * @param   {Boolean} gotoEnd Whether to go to then endpoint of the animation after abort
	 * @returns {Boolean} True if animation continues
	 */
	step: function (gotoEnd) {
		var t = +new Date(),
			ret,
			done,
			options = this.options,
			elem = this.elem,
			complete = options.complete,
			duration = options.duration,
			curAnim = options.curAnim,
			i;
		
		if (elem.attr && !elem.element) { // #2616, element including flag is destroyed
			ret = false;

		} else if (gotoEnd || t >= duration + this.startTime) {
			this.now = this.end;
			this.pos = 1;
			this.update();

			curAnim[this.prop] = true;

			done = true;
			for (i in curAnim) {
				if (curAnim[i] !== true) {
					done = false;
				}
			}

			if (done && complete) {
				complete.call(elem);
			}
			ret = false;

		} else {
			this.pos = options.easing((t - this.startTime) / duration);
			this.now = this.start + ((this.end - this.start) * this.pos);
			this.update();
			ret = true;
		}
		return ret;
	},

	/**
	 * Prepare start and end values so that the path can be animated one to one
	 */
	initPath: function (elem, fromD, toD) {
		fromD = fromD || '';
		var shift = elem.shift,
			bezier = fromD.indexOf('C') > -1,
			numParams = bezier ? 7 : 3,
			endLength,
			slice,
			i,
			start = fromD.split(' '),
			end = [].concat(toD), // copy
			isArea = elem.isArea,
			positionFactor = isArea ? 2 : 1,
			sixify = function (arr) { // in splines make move points have six parameters like bezier curves
				i = arr.length;
				while (i--) {
					if (arr[i] === M || arr[i] === L) {
						arr.splice(i + 1, 0, arr[i + 1], arr[i + 2], arr[i + 1], arr[i + 2]);
					}
				}
			};

		if (bezier) {
			sixify(start);
			sixify(end);
		}

		// If shifting points, prepend a dummy point to the end path. For areas,
		// prepend both at the beginning and end of the path.
		if (shift <= end.length / numParams && start.length === end.length) {
			while (shift--) {
				end = end.slice(0, numParams).concat(end);
				if (isArea) {
					end = end.concat(end.slice(end.length - numParams));
				}
			}
		}
		elem.shift = 0; // reset for following animations

		
		// Copy and append last point until the length matches the end length
		if (start.length) {
			endLength = end.length;
			while (start.length < endLength) {

				// Pull out the slice that is going to be appended or inserted. In a line graph,
				// the positionFactor is 1, and the last point is sliced out. In an area graph,
				// the positionFactor is 2, causing the middle two points to be sliced out, since
				// an area path starts at left, follows the upper path then turns and follows the
				// bottom back. 
				slice = start.slice().splice(
					(start.length / positionFactor) - numParams, 
					numParams * positionFactor
				);
				
				// Disable first control point
				if (bezier) {
					slice[numParams - 6] = slice[numParams - 2];
					slice[numParams - 5] = slice[numParams - 1];
				}
				
				// Now insert the slice, either in the middle (for areas) or at the end (for lines)
				[].splice.apply(
					start, 
					[(start.length / positionFactor), 0].concat(slice)
				);

			}
		}

		return [start, end];
	}
}; // End of Fx prototype


/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
var extend = Highcharts.extend = function (a, b) {
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
function merge() {
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
	return obj && typeof obj === 'object';
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
 * Returns true if the object is not null or undefined.
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
		ret;

	// if the prop is a string
	if (isString(prop)) {
		// set the value
		if (defined(value)) {
			elem.setAttribute(prop, value);

		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}

	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && isObject(prop)) {
		for (key in prop) {
			elem.setAttribute(key, prop[key]);
		}
	}
	return ret;
}
/**
 * Check if an element is an array, and if not, make it into an array.
 */
function splat(obj) {
	return isArray(obj) ? obj : [obj];
}

/**
 * Set a timeout if the delay is given, otherwise perform the function synchronously
 * @param   {Function} fn	  The function to perform
 * @param   {Number}   delay   Delay in milliseconds
 * @param   {Ojbect}   context The context
 * @returns {Nubmer}		   An identifier for the timeout
 */
function syncTimeout(fn, delay, context) {
	if (delay) {
		return setTimeout(fn, delay, context);
	}
	fn.call(0, context);
}


/**
 * Return the first value that is defined.
 */
var pick = Highcharts.pick = function () {
	var args = arguments,
		i,
		arg,
		length = args.length;
	for (i = 0; i < length; i++) {
		arg = args[i];
		if (arg !== UNDEFINED && arg !== null) {
			return arg;
		}
	}
};

/**
 * Set CSS on a given element
 * @param {Object} el
 * @param {Object} styles Style object with camel case property names
 */
function css(el, styles) {
	if (isMS && !hasSVG) { // #2686
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
		css(el, { padding: 0, border: 'none', margin: 0 });
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
function extendClass(Parent, members) {
	var object = function () {
	};
	object.prototype = new Parent();
	extend(object.prototype, members);
	return object;
}

/**
 * Pad a string to a given length by adding 0 to the beginning
 * @param {Number} number
 * @param {Number} length
 */
function pad(number, length) {
	return new Array((length || 2) + 1 - String(number).length).join(0) + number;
}

/**
 * Return a length based on either the integer value, or a percentage of a base.
 */
function relativeLength(value, base) {
	return (/%$/).test(value) ? base * parseFloat(value) / 100 : parseFloat(value);
}

/**
 * Wrap a method with extended functionality, preserving the original function
 * @param {Object} obj The context object that the method belongs to
 * @param {String} method The name of the method to extend
 * @param {Function} func A wrapper function callback. This function is called with the same arguments
 * as the original function, except that the original function is unshifted and passed as the first
 * argument.
 */
var wrap = Highcharts.wrap = function (obj, method, func) {
	var proceed = obj[method];
	obj[method] = function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(proceed);
		return func.apply(this, args);
	};
};


function getTZOffset(timestamp) {
	return ((getTimezoneOffset && getTimezoneOffset(timestamp)) || timezoneOffset || 0) * 60000;
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	if (!defined(timestamp) || isNaN(timestamp)) {
		return defaultOptions.lang.invalidDate || '';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');

	var date = new Date(timestamp - getTZOffset(timestamp)),
		key, // used in for constuct below
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,

		// List all format keys. Custom formats can be added from the outside.
		replacements = extend({

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
			'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()), // Two digits seconds, 00 through  59
			'L': pad(mathRound(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
		}, Highcharts.dateFormats);


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
function formatSingle(format, val) {
	var floatRegex = /f$/,
		decRegex = /\.([0-9])/,
		lang = defaultOptions.lang,
		decimals;

	if (floatRegex.test(format)) { // float
		decimals = format.match(decRegex);
		decimals = decimals ? decimals[1] : -1;
		if (val !== null) {
			val = Highcharts.numberFormat(
				val,
				decimals,
				lang.decimalPoint,
				format.indexOf(',') > -1 ? lang.thousandsSep : ''
			);
		}
	} else {
		val = dateFormat(format, val);
	}
	return val;
}

/**
 * Format a string according to a subset of the rules of Python's String.format method.
 */
function format(str, ctx) {
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
				val = formatSingle(valueAndFormat.join(':'), val);
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
}

/**
 * Get the magnitude of a number
 */
function getMagnitude(num) {
	return math.pow(10, mathFloor(math.log(num) / math.LN10));
}

/**
 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
 * @param {Number} interval
 * @param {Array} multiples
 * @param {Number} magnitude
 * @param {Object} options
 */
function normalizeTickInterval(interval, multiples, magnitude, allowDecimals, preventExceed) {
	var normalized,
		i,
		retInterval = interval;

	// round to a tenfold of 1, 2, 2.5 or 5
	magnitude = pick(magnitude, 1);
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
		arr[i].safeI = i; // stable sort index
	}

	arr.sort(function (a, b) {
		sortValue = sortFunction(a, b);
		return sortValue === 0 ? a.safeI - b.safeI : sortValue;
	});

	// Remove index from items
	for (i = 0; i < length; i++) {
		delete arr[i].safeI; // stable sort index
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
 * @param {Object} The object to destroy properties on
 * @param {Object} Exception, do not destroy this property, only delete it.
 */
function destroyObjectProperties(obj, except) {
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
 * Fix JS round off float errors
 * @param {Number} num
 */
function correctFloat(num, prec) {
	return parseFloat(
		num.toPrecision(prec || 14)
	);
}

/**
 * Set the global animation to either a given value, or fall back to the
 * given chart's animation option
 * @param {Object} animation
 * @param {Object} chart
 */
function setAnimation(animation, chart) {
	chart.renderer.globalAnimation = pick(animation, chart.animation);
}

/**
 * Get the animation in object form, where a disabled animation is always
 * returned with duration: 0
 */
function animObject(animation) {
	return isObject(animation) ? merge(animation) : { duration: animation ? 500 : 0 };
}

/**
 * The time unit lookup
 */
timeUnits = {
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
 * @param {String} decimalPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
Highcharts.numberFormat = function (number, decimals, decimalPoint, thousandsSep) {

	number = +number || 0;

	var lang = defaultOptions.lang,
		origDec = (number.toString().split('.')[1] || '').length,
		decimalComponent,
		strinteger,
		thousands,
		absNumber = Math.abs(number),
		ret;

	if (decimals === -1) {
		decimals = Math.min(origDec, 20); // Preserve decimals. Not huge numbers (#3793).
	} else if (isNaN(decimals)) {
		decimals = 2;
	}

	// A string containing the positive integer component of the number
	strinteger = String(pInt(absNumber.toFixed(decimals)));

	// Leftover after grouping into thousands. Can be 0, 1 or 3.
	thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

	// Language
	decimalPoint = pick(decimalPoint, lang.decimalPoint);
	thousandsSep = pick(thousandsSep, lang.thousandsSep);

	// Start building the return
	ret = number < 0 ? '-' : '';

	// Add the leftover after grouping into thousands. For example, in the number 42 000 000,
	// this line adds 42.
	ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

	// Add the remaining thousands groups, joined by the thousands separator
	ret += strinteger.substr(thousands).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);

	// Add the decimal point and the decimal component
	if (+decimals) {
		// Get the decimal component, and add power to avoid rounding errors with float numbers (#4573)
		decimalComponent = Math.abs(absNumber - strinteger + Math.pow(10, -Math.max(decimals, origDec) - 1));
		ret += decimalPoint + decimalComponent.toFixed(decimals).slice(2);
	}

	return ret;
};

/**
 * Easing definition
 * @param   {Number} pos Current position, ranging from 0 to 1
 */
Math.easeInOutSine = function (pos) {
	return -0.5 * (Math.cos(Math.PI * pos) - 1);
};

/**
 * Internal method to return CSS value for given element and property
 */
getStyle = function (el, prop) {

	var style;

	// For width and height, return the actual inner pixel size (#4913)
	if (prop === 'width') {
		return Math.min(el.offsetWidth, el.scrollWidth) - getStyle(el, 'padding-left') - getStyle(el, 'padding-right');
	} else if (prop === 'height') {
		return Math.min(el.offsetHeight, el.scrollHeight) - getStyle(el, 'padding-top') - getStyle(el, 'padding-bottom');
	}

	// Otherwise, get the computed style
	style = win.getComputedStyle(el, undefined);
	return style && pInt(style.getPropertyValue(prop));
};

/**
 * Return the index of an item in an array, or -1 if not found
 */
inArray = function (item, arr) {
	return arr.indexOf ? arr.indexOf(item) : [].indexOf.call(arr, item);
};

/**
 * Filter an array
 */
grep = function (elements, callback) {
	return [].filter.call(elements, callback);
};

/**
 * Map an array
 */
map = function (arr, fn) {
	var results = [], i = 0, len = arr.length;

	for (; i < len; i++) {
		results[i] = fn.call(arr[i], arr[i], i, arr);
	}

	return results;
};

/**
 * Get the element's offset position, corrected by overflow:auto.
 */
offset = function (el) {
	var docElem = doc.documentElement,
		box = el.getBoundingClientRect();

	return {
		top: box.top  + (win.pageYOffset || docElem.scrollTop)  - (docElem.clientTop  || 0),
		left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
	};
};

/**
 * Stop running animation.
 * A possible extension to this would be to stop a single property, when
 * we want to continue animating others. Then assign the prop to the timer
 * in the Fx.run method, and check for the prop here. This would be an improvement
 * in all cases where we stop the animation from .attr. Instead of stopping
 * everything, we can just stop the actual attributes we're setting.
 */
stop = function (el) {

	var i = timers.length;

	// Remove timers related to this element (#4519)
	while (i--) {
		if (timers[i].elem === el) {
			timers[i].stopped = true; // #4667
		}
	}
};

/**
 * Utility for iterating over an array.
 * @param {Array} arr
 * @param {Function} fn
 */
each = function (arr, fn) { // modern browsers
	return Array.prototype.forEach.call(arr, fn);
};

/**
 * Add an event listener
 */
addEvent = function (el, type, fn) {
	
	var events = el.hcEvents = el.hcEvents || {};

	function wrappedFn(e) {
		e.target = e.srcElement || win; // #2820
		fn.call(el, e);
	}

	// Handle DOM events in modern browsers
	if (el.addEventListener) {
		el.addEventListener(type, fn, false);

	// Handle old IE implementation
	} else if (el.attachEvent) {

		if (!el.hcEventsIE) {
			el.hcEventsIE = {};
		}

		// Link wrapped fn with original fn, so we can get this in removeEvent
		el.hcEventsIE[fn.toString()] = wrappedFn;

		el.attachEvent('on' + type, wrappedFn);
	}

	if (!events[type]) {
		events[type] = [];
	}

	events[type].push(fn);
};

/**
 * Remove event added with addEvent
 */
removeEvent = function (el, type, fn) {
	
	var events,
		hcEvents = el.hcEvents,
		index;

	function removeOneEvent(type, fn) {
		if (el.removeEventListener) {
			el.removeEventListener(type, fn, false);
		} else if (el.attachEvent) {
			fn = el.hcEventsIE[fn.toString()];
			el.detachEvent('on' + type, fn);
		}
	}

	function removeAllEvents() {
		var types,
			len,
			n;

		if (!el.nodeName) {
			return; // break on non-DOM events
		}

		if (type) {
			types = {};
			types[type] = true;
		} else {
			types = hcEvents;
		}

		for (n in types) {
			if (hcEvents[n]) {
				len = hcEvents[n].length;
				while (len--) {
					removeOneEvent(n, hcEvents[n][len]);
				}
			}
		}
	}

	if (hcEvents) {
		if (type) {
			events = hcEvents[type] || [];
			if (fn) {
				index = inArray(fn, events);
				if (index > -1) {
					events.splice(index, 1);
					hcEvents[type] = events;
				}
				removeOneEvent(type, fn);

			} else {
				removeAllEvents();
				hcEvents[type] = [];
			}
		} else {
			removeAllEvents();
			el.hcEvents = {};
		}
	}
};

/**
 * Fire an event on a custom object
 */
fireEvent = function (el, type, eventArguments, defaultFunction) {
	var e,
		hcEvents = el.hcEvents,
		events,
		len,
		i,
		preventDefault,
		fn;

	eventArguments = eventArguments || {};

	if (doc.createEvent && (el.dispatchEvent || el.fireEvent)) {
		e = doc.createEvent('Events');
		e.initEvent(type, true, true);
		e.target = el;

		extend(e, eventArguments);

		if (el.dispatchEvent) {
			el.dispatchEvent(e);
		} else {
			el.fireEvent(type, e);
		}

	} else if (hcEvents) {
		
		events = hcEvents[type] || [];
		len = events.length;

		// Attach a simple preventDefault function to skip default handler if called
		preventDefault = function () {
			eventArguments.defaultPrevented = true;
		};
		
		for (i = 0; i < len; i++) {
			fn = events[i];

			// eventArguments is never null here
			if (eventArguments.stopped) {
				return;
			}

			eventArguments.preventDefault = preventDefault;
			eventArguments.target = el;

			// If the type is not set, we're running a custom event (#2297). If it is set,
			// we're running a browser event, and setting it will cause en error in
			// IE8 (#2465).
			if (!eventArguments.type) {
				eventArguments.type = type;
			}
			
			// If the event handler return false, prevent the default handler from executing
			if (fn.call(el, eventArguments) === false) {
				eventArguments.preventDefault();
			}
		}
	}

	// Run the default if not prevented
	if (defaultFunction && !eventArguments.defaultPrevented) {
		defaultFunction(eventArguments);
	}
};

/**
 * The global animate method, which uses Fx to create individual animators.
 */
animate = function (el, params, opt) {
	var start,
		unit = '',
		end,
		fx,
		args,
		prop;

	if (!isObject(opt)) { // Number or undefined/null
		args = arguments;
		opt = {
			duration: args[2],
			easing: args[3],
			complete: args[4]
		};
	}
	if (!isNumber(opt.duration)) {
		opt.duration = 400;
	}
	opt.easing = Math[opt.easing] || Math.easeInOutSine;
	opt.curAnim = merge(params);

	for (prop in params) {
		fx = new Fx(el, opt, prop);
		end = null;

		if (prop === 'd') {
			fx.paths = fx.initPath(
				el,
				el.d,
				params.d
			);
			fx.toD = params.d;
			start = 0;
			end = 1;
		} else if (el.attr) {
			start = el.attr(prop);
		} else {
			start = parseFloat(getStyle(el, prop)) || 0;
			if (prop !== 'opacity') {
				unit = 'px';
			}
		}

		if (!end) {
			end = params[prop];
		}
		if (end.match && end.match('px')) {
			end = end.replace(/px/g, ''); // #4351
		}
		fx.run(start, end, unit);
	}
};

/**
 * Register Highcharts as a plugin in jQuery
 */
if (win.jQuery) {
	win.jQuery.fn.highcharts = function () {
		var args = [].slice.call(arguments);

		if (this[0]) { // this[0] is the renderTo div

			// Create the chart
			if (args[0]) {
				new Highcharts[ // eslint-disable-line no-new
					isString(args[0]) ? args.shift() : 'Chart' // Constructor defaults to Chart
				](this[0], args[0], args[1]);
				return this;
			}

			// When called without parameters or with the return argument, return an existing chart
			return charts[attr(this[0], 'data-highcharts-chart')];
		}
	};
}


/**
 * Compatibility section to add support for legacy IE. This can be removed if old IE 
 * support is not needed.
 */
if (doc && !doc.defaultView) {
	getStyle = function (el, prop) {
		var val,
			alias = { width: 'clientWidth', height: 'clientHeight' }[prop];
			
		if (el.style[prop]) {
			return pInt(el.style[prop]);
		}
		if (prop === 'opacity') {
			prop = 'filter';
		}

		// Getting the rendered width and height
		if (alias) {
			el.style.zoom = 1;
			return el[alias] - 2 * getStyle(el, 'padding');
		}
		
		val = el.currentStyle[prop.replace(/\-(\w)/g, function (a, b) {
			return b.toUpperCase();
		})];
		if (prop === 'filter') {
			val = val.replace(
				/alpha\(opacity=([0-9]+)\)/, 
				function (a, b) { 
					return b / 100; 
				}
			);
		}
		
		return val === '' ? 1 : pInt(val);
	};
}

if (!Array.prototype.forEach) {
	each = function (arr, fn) { // legacy
		var i = 0, 
			len = arr.length;
		for (; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	};
}

if (!Array.prototype.indexOf) {
	inArray = function (item, arr) {
		var len, 
			i = 0;

		if (arr) {
			len = arr.length;
			
			for (; i < len; i++) {
				if (arr[i] === item) {
					return i;
				}
			}
		}

		return -1;
	};
}

if (!Array.prototype.filter) {
	grep = function (elements, fn) {
		var ret = [],
			i = 0,
			length = elements.length;

		for (; i < length; i++) {
			if (fn(elements[i], i)) {
				ret.push(elements[i]);
			}
		}

		return ret;
	};
}

//--- End compatibility section ---

// Expose utilities
Highcharts.Fx = Fx;
Highcharts.inArray = inArray;
Highcharts.each = each;
Highcharts.grep = grep;
Highcharts.offset = offset;
Highcharts.map = map;
Highcharts.addEvent = addEvent;
Highcharts.removeEvent = removeEvent;
Highcharts.fireEvent = fireEvent;
Highcharts.animate = animate;
Highcharts.animObject = animObject;
Highcharts.stop = stop;

