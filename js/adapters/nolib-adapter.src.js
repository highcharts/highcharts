/**
 * Highcharts no-library adapter


To implement:
- extend
- getScript

 */
var HighchartsAdapter = (function () {

var UNDEFINED,
	win = window,
	doc = document,
	adapterMethods = {},
	emptyArray = [];

/**
 * Extend an object with the members of another
 */
function extend() {
	var args = emptyArray.slice.call(arguments),
		target = args[0] || {},
		len = args.length,
		i = 1,
		n;

	for (; i < len; i++) {
		for (n in args[i]) {
			target[n] = args[i][n];
		}
	}

	return target;
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
 * Return the index of an item in an array, or -1 if not found
 */
function inArray(item, arr) {
	return arr.indexOf ? arr.indexOf(item) : emptyArray.indexOf.call(arr, item);

}


/**
 * Extend given object with custom events
 */
function _extend(obj) {
	function removeOneEvent(el, type, fn) {
		el.removeEventListener(type, fn, false);
	}

	function IERemoveOneEvent(el, type, fn) {
		fn = el._highcharts_proxied_methods[fn.toString()];
		el.detachEvent(type, fn);
	}

	function removeAllEvents(el, type) {
		var events = el._highcharts_events,
			remove,
			types,
			len,
			n;

		if (el.removeEventListener) {
			remove = removeOneEvent;
		} else if (el.attachEvent) {
			remove = IERemoveOneEvent;
		} else {
			return; // break on non-DOM events
		}


		if (type) {
			types = {};
			types[type] = true;
		} else {
			types = events;
		}

		for (n in types) {
			if (events[n]) {
				len = events[n].length;
				while (len--) {
					remove(el, n, events[n][len]);
				}
			}
		}
	}

	if (!obj._highcharts_extended) {
		extend(obj, {
			_highcharts_extended: true,

			_highcharts_events: {},

			bind: function (name, fn) {
				var el = this,
					events = this._highcharts_events,
					originalFn;


				// handle DOM events in modern browsers
				if (el.addEventListener) {
					el.addEventListener(name, fn, false);

				// handle old IE implementation
				} else if (el.attachEvent) {
					originalFn = fn;

					fn = function (e) {
						originalFn.call(el, e);
					};

					if (!el._highcharts_proxied_methods) {
						el._highcharts_proxied_methods = {};
					}

					// link wrapped fn with original fn, so we can get this in removeEvent
					el._highcharts_proxied_methods[originalFn.toString()] = fn;

					el.attachEvent(name, wrappedFn);
				}


				if (events[name] === UNDEFINED) {
					events[name] = [];
				}

				events[name].push(fn);
			},

			unbind: function (name, fn) {
				var events,
					index,
					tail;

				if (name) {
					events = this._highcharts_events[name] || [];

					if (fn) {
						index = inArray(fn, events);

						if (index > -1) {
							tail = events.splice(index);
							this._highcharts_events[name] = events.concat(tail.slice(1));
						}

						if (this.removeEventListener) {
							removeOneEvent(this, name, fn);
						} else if (this.attachEvent) {
							IERemoveOneEvent(this, name, fn);
						}
					} else {
						removeAllEvents(this, name);
						this._highcharts_events[name] = [];
					}
				} else {
					removeAllEvents(this);
					this._highcharts_events = {};
				}
			},

			trigger: function (name, args) {
				var events = this._highcharts_events[name] || [],
					target = this,
					len = events.length,
					preventDefault,
					fn;

				// Attach a simple preventDefault function to skip default handler if called
				preventDefault = function () {
					args.defaultPrevented = true;
				};

				while (len--) {
					fn = events[len];

					// args is never null here
					if (args.stopped) {
						return;
					}

					args.preventDefault = preventDefault;
					args.target = target;

					// If the event handler return false, prevent the default handler from executing
					if (fn.call(this, args) === false) {
						args.preventDefault();
					}
				}
			}
		});
	}

	return obj;
}


['width', 'height'].forEach(function (name) {
	adapterMethods[name] = function (el) {
		return parseInt(getCSS(el, name), 10);
	};
});


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

	inArray: inArray,

	/**
	 * A direct link to adapter methods
	 */
	adapterRun: function (elem, method) {
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
		var left = 0,
			top = 0;

		while (el) {
			left += el.offsetLeft;
			top += el.offsetTop;
			el = el.offsetParent;
		}

		return {
			left: left,
			top: top
		};
	},

	/**
	 * Add an event listener
	 */
	addEvent: function (el, type, fn) {
		_extend(el).bind(type, fn);
	},

	/**
	 * Remove event added with addEvent
	 */
	removeEvent: function (el, type, fn) {
		_extend(el).unbind(type, fn);
	},

	/**
	 * Fire an event on a custom object
	 */
	fireEvent: function (el, type, eventArguments, defaultFunction) {
		var e;

		if (el.dispatchEvent || el.fireEvent) {
			e = doc.createEvent('Events');
			e.initEvent(type, true, true);
			e.target = el;

			extend(e, eventArguments);

			if (el.dispatchEvent) {
				el.dispatchEvent(e);
			} else {
				el.fireEvent(type, e);
			}

		} else if (el._highcharts_extended === true) {
			eventArguments = eventArguments || {};
			el.trigger(type, eventArguments);
		}

		if (eventArguments && eventArguments.defaultPrevented) {
			defaultFunction = null;
		}

		if (defaultFunction) {
			defaultFunction(eventArguments);
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