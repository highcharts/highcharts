/**
 * Highcharts no-library adapter


To implement:
- extend
- getScript

 */
/*global Highcharts */
var HighchartsAdapter = (function () {

var UNDEFINED,
	win = window,
	doc = document,
	adapterMethods = {},
	emptyArray = [],
	timers = [],
	timerId,
	Fx;

Math.easeInOutSine = function (t, b, c, d) {
	return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};
	
/**
 * Extend an object with the members of another
 * TODO: Maybe we can use Highcharts.extend instead of all of these calls, as they
 * are not called until Highcharts is loaded and we start drawing elements.
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
 * return CSS value for given element and property
 */
function getStyle(el, prop) {
	// TODO: legacy IE support
	return win.getComputedStyle(el).getPropertyValue(prop);
}


/**
 * Return the index of an item in an array, or -1 if not found
 */
function inArray(item, arr) {
	// TODO: legacy IE support
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

					el.attachEvent(name, fn);
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
		return parseInt(getStyle(el, name), 10);
	};
});


return {
	/**
	 * Initialize the adapter. This is run once as Highcharts is first run.
	 */
	init: function (pathAnim) {

		Fx = function (elem, options, prop) {
			this.options = options;
			this.elem = elem;
			this.prop = prop;
		};
		Fx.prototype = {
			
			update: function () {
				var styles,
					paths = this.paths,
					elem = this.elem,
					elemelem = elem.element; // if destroyed, it is null

				// Animating a path definition on SVGElement
				if (paths && elemelem) {
					elem.attr('d', pathAnim.step(paths[0], paths[1], this.now, this.toD));
				
				// Other animations on SVGElement
				} else if (elem.attr) {
					if (elemelem) {
						elem.attr(this.prop, this.now);
					}

				// HTML styles
				} else {
					styles = {};
					styles[elem] = this.now + this.unit;
					Highcharts.css(elem, styles);
				}
				
				if (this.options.step) {
					this.options.step.call(this.elem, this.now, this);
				}

			},
			custom: function (from, to, unit) {
				var self = this,
					t = function (gotoEnd) {
						return self.step(gotoEnd);
					},
					i;

				this.startTime = +new Date();
				this.start = from;
				this.end = to;
				this.unit = unit;
				this.now = this.start;
				this.pos = this.state = 0;

				t.elem = this.elem;

				if (t() && timers.push(t) === 1) {
					timerId = setInterval(function () {
						
						for (i = 0; i < timers.length; i++) {
							if (!timers[i]()) {
								timers.splice(i--, 1);
							}
						}

						if (!timers.length) {
							clearInterval(timerId);
						}
					}, 13);
				}
			},
			
			step: function (gotoEnd) {
				var t = +new Date(),
					ret,
					done,
					options = this.options,
					i;

				if (this.elem.stopAnimation) {
					ret = false;

				} else if (gotoEnd || t >= options.duration + this.startTime) {
					this.now = this.end;
					this.pos = this.state = 1;
					this.update();

					this.options.curAnim[this.prop] = true;

					done = true;
					for (i in options.curAnim) {
						if (options.curAnim[i] !== true) {
							done = false;
						}
					}

					if (done) {
						if (options.complete) {
							options.complete.call(this.elem);
						}
					}
					ret = false;

				} else {
					var n = t - this.startTime;
					this.state = n / options.duration;
					this.pos = options.easing(n, 0, 1, options.duration);
					this.now = this.start + ((this.end - this.start) * this.pos);
					this.update();
					ret = true;
				}
				return ret;
			}
		};

		/**
		 * The adapter animate method
		 */
		this.animate = function (el, prop, opt) {
			var start,
				unit = '',
				end,
				fx,
				args,
				name;

			el.stopAnimation = false; // ready for new

			if (typeof opt !== 'object' || opt === null) {
				args = arguments;
				opt = {
					duration: args[2],
					easing: args[3],
					complete: args[4]
				};
			}
			if (typeof opt.duration !== 'number') {
				opt.duration = 400;
			}
			opt.easing = Math[opt.easing] || Math.easeInOutSine;
			opt.curAnim = Highcharts.extend({}, prop);
			
			for (name in prop) {
				fx = new Fx(el, opt, name);
				end = null;
				
				if (name === 'd') {
					fx.paths = pathAnim.init(
						el,
						el.d,
						prop.d
					);
					fx.toD = prop.d;
					start = 0;
					end = 1;
				} else if (el.attr) {
					start = el.attr(name);
				} else {
					start = parseFloat(getStyle(el, name)) || 0;
					if (name !== 'opacity') {
						unit = 'px';
					}
				}
	
				if (!end) {
					end = parseFloat(prop[name]);
				}
				fx.custom(start, end, unit);
			}	
		};


	},

	/**
	 * Downloads a script and executes a callback when done.
	 * TODO: implement
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
		// TODO: legacy implementation
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
	 * Stop running animation
	 */
	stop: function (el) {
		el.stopAnimation = true;
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