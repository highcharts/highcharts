/**
 * Highcharts no-library adapter


To implement:
- extend
- getScript

 */
var HighchartsAdapter = (function () {

var win = window,
	doc = document,
	emptyArray = [],
	overridenNames,
	overriden = ['width', 'height'],
	adapter,
	events,
	fx;

overridenNames = Object.keys(overriden);

// function extend () {
// 	return Object.append.apply(Object, arguments);
// }


function doCopy(copy, original) {
	var value, key;

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

function merge() {
	var args = arguments,
		i,
		retVal = {};

	for (i = 0; i < args.length; i++) {
		retVal = doCopy(retVal, args[i]);
	}

	return retVal;
}

function getCSS(el, prop) {
	return win.getComputedStyle(el).getPropertyValue(prop);
}


events = {
	bind: function (e, callback, context) {
		var calls = this._highcharts_callbacks,
			list = calls[e];

		if (!list) {
			list = calls[e] = [];
		}

		list.push([callback, context]);

		return this;
	},
	unbind: function (e, callback) {
		var calls = this._highcharts_callbacks,
			list,
			i;

		if (!e) {
			this._highcharts_callbacks = {};

		} else if (calls) {
			if (!callback) {
				calls[e] = [];

			} else {
				list = calls[e];

				if (!list) {
					return this;
				}

				for (i = 0, l = list.length; i < l; i++) {
					if (list[i] && callback === list[i][0]) {
						list[i] = null;
						break;
					}
				}

				if (!list.length) {
					delete calls[e];
				}
			}
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


win.requestAnimFrame = (function () {
	return win.requestAnimationFrame ||
	win.webkitRequestAnimationFrame ||
	win.mozRequestAnimationFrame ||
	win.oRequestAnimationFrame ||
	win.msRequestAnimationFrame ||
	function (callback) {
		win.setTimeout(callback, 1000 / 60);
	};
}());


['width', 'height'].forEach(function (name) {
	overriden[name] = function (el) {
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
	// Initialize the adapter. This is run once as Highcharts is first run.
	init: function (pathAnim) {
		this.pathAnim = pathAnim;
	},

	// Downloads a script and executes a callback when done.
	getScript: function () {

	},

	// Return the index of an item in an array, or -1 if not found
	inArray: function (el, arr) {
		return arr.indexOf ? arr.indexOf(el) : emptyArray.indexOf.call(arr, el);
	},

	// A direct link to Zepto methods
	adapterRun: function (elem, method) {
		if (overridenNames.indexOf(method) !== -1) {
			return overriden[method](elem);
		}

		return Zepto(elem)[method]();
	},

	// Filter an array
	grep: function (elements, callback) {
		return emptyArray.filter.call(elements, callback);
	},

	// Map an array
	map: function (arr, fn) {
		var results = [], i = 0, len = arr.length;

		for (; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}

		return results;
	},

	// Deep merge two objects and return a third object
	merge: function () { // the built-in prototype merge function doesn't do deep copy
		return merge.apply(this, arguments);
	},

	offset: function (el) {
		return Zepto(el).offset();
	},

	// Add an event listener
	addEvent: function (el, event, fn) {
		if (el.addEventListener) {
			el = Zepto(el);
		} else {
			HighchartsAdapter._extend(el);
		}

		el.bind(event, fn);
	},

	// Remove event added with addEvent
	removeEvent: function (el, eventType, handler) {
		if (el.removeEventListener) {
			el = Zepto(el);
		}

		if (el.unbind) {
			el.unbind(eventType, handler);
		}
	},

	// Fire an event on a custom object
	fireEvent: function (el, event, eventArguments, defaultFunction) {
		var eventArgs = {
			type: event,
			target: el
		};
		// create an event object that keeps all functions
		event = new Zepto.Event(event, eventArgs);
		event = extend(event, eventArguments);
		// override the preventDefault function to be able to use
		// this for custom events
		event.preventDefault = function () {
			defaultFunction = null;
		};

		if ((!el.trigger && el instanceof HTMLElement) || el === doc || el === win) {
			el = Zepto(el);
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

	// Animate a HTML element or SVG element wrapper
	animate: function (el, params, options) {
		var key;

		// var el = Zepto(el.element);

		// default options
		// options = options || {};
		// options.delay = 0;
		// options.duration = (options.duration || 500) / 1000;

		for (key in params) {
			if (key !== 'd') {
				el.attr(key, params[key]);
				// anim(el, key, params[key]);
				// else
			}
		}



		// $el.stop();
		// if(!params.d) {
			// el.animate(params, options)
		// }
	},

	// Stop running animation
	stop: function (el) {
		// $(el).stop();
	},

	// Utility for iterating over an array. Parameters are reversed compared to jQuery.
	each: function (arr, fn) {
		var i = 0, len = arr.length;

		for (; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	},

  // Extend a highcharts object (not svg elements) to handle events.
	_extend: function (object) {
		if (!object._highcharts_callbacks) {
			extend(object, events, {
				_highcharts_callbacks: {}
			});
		}

		return object;
	}
};
}());