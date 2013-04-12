/**
 * Highcharts no-library adapter


To implement:
- extend
- getScript

 */
var HighchartsAdapter = (function () {

var win = window,
	doc = document,
	adapterMethods = {},
	emptyArray = [],
	events,
	fx;

/**
 * Extend an object with the members of another
 */
function extend() {
	var args = [].slice.call(arguments),
		a = args[0] || {},
		l = args.length,
		i = 1,
		n;


	for (; i < l; i++) {
		for (n in args[i]) {
			a[n] = args[i][n];
		}
	}

	return a;
}

/**
 * Deep copy properties from 'original' object to 'copy'
 */
function doCopy(copy, original) {
	var value,
		key;

	for (key in original) {
		value = original[key];

		if (value && typeof value === 'object' && value.constructor !== Array &&
			typeof value.nodeType !== 'number') {
			copy[key] = doCopy(copy[key] || {}, value); // copy
		} else {
			copy[key] = original[key];
		}
	}

	return copy;
}

/**
 * Merge objects passed in arguments into one object and return it
 */
function merge() {
	var args = arguments,
		obj = {},
		i;

	for (i = 0; i < args.length; i++) {
		obj = doCopy(obj, args[i]);
	}

	return obj;
}

/**
 * return CSS value for given element and property
 */
function getCSS(el, prop) {
	return win.getComputedStyle(el).getPropertyValue(prop);
}


/**
 *
 */
function Event(obj, type) {
	var receiver = (typeof arguments[2] === 'string' && arguments[3]) ? arguments[2] : null,
		data = receiver ? arguments[3] : arguments[2],
		isDom = obj.addEventListener,
		evt = doc.createEvent(isDom ? 'HTMLEvents' : 'Events');

	evt.initEvent(type, true, true);
	evt.data = data || {};

	return evt;
}

/**
 * Method to extend 
 */
Event.methods = {
	bind: function (eventName, callback, context) {
		var el = this,
			calls = el._highcharts_callbacks,
			list = calls[eventName],
			fn;

		if (!list) {
			list = calls[eventName] = [];
		}

		if (el.addEventListener) {
			el.addEventListener(eventName, callback, false);
		}
		else if (el.attachEvent) {
			fn = callback;
			callback = function (eventName) {
				el.call(fn, eventName);
			};

			el.attachEvent(eventName, callback);
		}

		list.push([callback, context]);

		return el;
	},

	unbind: function (eventName, callback) {
		var el = this,
			calls = el._highcharts_callbacks,
			list,
			l,
			i;

		if (!eventName) {
			el._highcharts_callbacks = {};

		} else if (calls) {
			if (!callback) {
				calls[eventName] = [];

			} else if (calls[eventName]) {
				list = calls[eventName];

				for (i = 0, l = list.length; i < l; i++) {
					if (list[i] && callback === list[i][0]) {
						list[i] = null;
						break;
					}
				}

				if (!list.length) {
					delete calls[eventName];
				}
			}
		}


		if (el.removeEventListener) {
			el.removeEventListener(eventName, callback, false);
		} else if (el.detachEvent) {
			el.detachEvent(eventName, callback);
		}

		return this;
	},

	trigger: function (eventName) {
		var calls = this._highcharts_callbacks,
			both = 2,
			callback,
			list,
			args,
			ev,
			i;

		if (!calls) {
			return this;
		}

		while (both--) {
			ev = both ? eventName : 'all';
			list = calls[ev];

			if (list) {
				for (i = 0, l = list.length; i < l; i++) {
					if (!(callback = list[i])) {
						list.splice(i, 1); i--; l--;
					} else {
						args = both ? emptyArray.slice.call(arguments, 1) : arguments;
						callback[0].apply(callback[1] || this, args);
					}
				}
			}
		}

		return this;
	}
};

/**
 * Extend an object (not html elements) to handle events.
 */
Event.extend = function (object) {
	if (!object._highcharts_callbacks) {
		extend(object, Event.methods, {
			_highcharts_callbacks: {}
		});
	}

	return object;
};


['width', 'height'].forEach(function (name) {
	adapterMethods[name] = function (el) {
		return parseInt(getCSS(el, name), 10);
	};
});

fx = function (elem, options, prop) {
	this.options = options;
	this.elem = elem;
	this.prop = prop;

	if (!options.orig) {
		options.orig = {};
	}
};
fx.prototype = {
	update: function () {
		(fx.step[this.prop] || fx.step._default)(this);

		if (this.options.step) {
			this.options.step.call(this.elem, this.now, this);
		}
	},

	step: function (gotoEnd) {
		var t = (new Date()).getTime(),
			done = true,
			i;

		if (gotoEnd || t >= this.options.duration + this.startTime) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[this.prop] = true;

			for (i in this.options.curAnim) {
				if (this.options.curAnim[i] !== true) {
					done = false;
				}
			}

			if (done && this.options.complete) {
				this.options.complete.call(this.elem);
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;
			this.pos = this.options.easing(n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);
			this.update();
		}

		return true;
	}
};


return {
	/**
	 * Initialize the adapter. This is run once as Highcharts is first run.
	 */
	init: function (pathAnim) {
		this.pathAnim = pathAnim;
	},

	/**
	 * Downloads a script and executes a callback when done.
	 */
	getScript: function () {},

	/**
	 * Return the index of an item in an array, or -1 if not found
	 */
	inArray: function (el, arr) {
		return arr.indexOf ? arr.indexOf(el) : emptyArray.indexOf.call(arr, el);
	},

	/**
	 * A direct link to adapter methods
	 */
	adapterRun: function (elem, method) {
		console.log(arguments);

		return adapterMethods[method](elem);
	},

	/**
	 * Filter an array
	 */
	grep: function (elements, callback) {
		return emptyArray.filter.call(elements, callback);
	},

	/**
	 * Map an array
	 */
	map: function (arr, fn) {
		var results = [], i = 0, len = arr.length;

		for (; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}

		return results;
	},

	/**
	 * Deep merge two objects and return a third object
	 */
	merge: function () { // the built-in prototype merge function doesn't do deep copy
		return merge.apply(this, arguments);
	},

	offset: function (el) {
		var left = el.offsetLeft || 0,
			top = el.offsetTop || 0;

		while ((el = el.offsetParent)) {
			left += el.offsetLeft;
			top += el.offsetTop;
		}

		return {
			left: left,
			top: top
		};
	},

	/**
	 * Add an event listener
	 */
	addEvent: function (el, event, handler) {
		Event.extend(el).bind(event, handler);
	},

	/**
	 * Remove event added with addEvent
	 */
	removeEvent: function (el, eventType, handler) {
		Event.extend(el).unbind(eventType, handler);
	},

	/**
	 * Fire an event on a custom object
	 */
	fireEvent: function (el, event, eventArguments, defaultFunction) {
		var eventArgs = {
			type: event,
			target: el
		};

		// create an event object that keeps all functions
		event = extend(Event(event, eventArgs), eventArguments);

		// override the preventDefault function to be able to use this for custom events
		event.preventDefault = function () {
			defaultFunction = null;
		};

		if ((!el.trigger && el instanceof HTMLElement) || el === doc || el === win) {
			el = Event.extend(el);
		}

		if (el.trigger) {
			el.trigger(event.type, event);
		}

		if (defaultFunction) {
			defaultFunction(event);
		}
	},

	washMouseEvent: function (e) {
		return e;
	},

	/**
	 * Animate a HTML element or SVG element wrapper
	 */
	animate: function (el, params, options) {},

	/**
	 * Stop running animation
	 */
	stop: function (el) {
		// $(el).stop();
	},

	/**
	 * Utility for iterating over an array. Parameters are reversed compared to jQuery.
	 */
	each: function (arr, fn) {
		var i = 0, len = arr.length;

		for (; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	}
};
}());