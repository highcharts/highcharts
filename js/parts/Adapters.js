
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
	globalAdapter.init();
} 
if (!globalAdapter && win.jQuery) {
	var jQ = jQuery;
	
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
			detachedType = 'detached' + type;
		extend(event, eventArguments);
		
		// Prevent jQuery from triggering the object method that is named the
		// same as the event. For example, if the event is 'select', jQuery
		// attempts calling el.select and it goes into a loop.
		if (el[type]) {
			el[detachedType] = el[type];
			el[type] = null;	
		}
		
		// trigger it
		jQ(el).trigger(event);
		
		// attach the method
		if (el[detachedType]) {
			el[type] = el[detachedType];
			el[detachedType] = null;
		}
		
		if (defaultFunction && !event.isDefaultPrevented()) {
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
	
	
	// extend jQuery
	jQ.extend(jQ.easing, {
		easeOutQuad: function (x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}
	});
					
	// extend the animate function to allow SVG animations
	var oldStepDefault = jQuery.fx.step._default, 
		oldCur = jQuery.fx.prototype.cur;
	
	// do the step
	jQ.fx.step._default = function (fx) {
		var elem = fx.elem;
		if (elem.attr) { // is SVG element wrapper
			elem.attr(fx.prop, fx.now);
		} else {
			oldStepDefault.apply(this, arguments);
		}
	};
	// animate paths
	jQ.fx.step.d = function (fx) {
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
	// get the current value
	jQ.fx.prototype.cur = function () {
		var elem = this.elem,
			r;
		if (elem.attr) { // is SVG element wrapper
			r = elem.attr(this.prop);
		} else {
			r = oldCur.apply(this, arguments);
		}
		return r;
	};
}


/**
 * Add a global listener for mousemove events
 */
/*addEvent(doc, 'mousemove', function(e) {
	if (globalMouseMove) {
		globalMouseMove(e);
	}
});*/
