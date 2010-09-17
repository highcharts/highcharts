// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/** 
 * @license Highcharts JS (resizing/auto margin branch)
 * 
 * (c) 2009-2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

// JSLint options:
/*jslint forin: true */
/*global document, window, navigator, setInterval, clearInterval, location, jQuery, $, $each, $merge, Events, Event, Fx, Request */
	
(function() {

// encapsulated variables
var doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathMax = math.max,
	mathMin = math.min,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,	
	
	
	// some variables
	userAgent = navigator.userAgent,
	isIE = /msie/i.test(userAgent) && !win.opera,
	isWebKit = /AppleWebKit/.test(userAgent),
	hasSVG = win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
	colorCounter,
	symbolCounter,
	symbolSizes = {},
	idCounter = 0,
	timeFactor = 1, // 1 = JavaScript time, 1000 = Unix time
	garbageBin,
	defaultOptions,
	dateFormat, // function
	globalAnimation,
	
	
	// some constants for frequently used strings
	UNDEFINED,
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
	TRACKER_FILL = 'rgba(192,192,192,0.005)', // invisible but clickable
	NORMAL_STATE = '',
	HOVER_STATE = 'hover',
	SELECT_STATE = 'select',
	
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
	each = adapter.each,
	grep = adapter.grep,
	map = adapter.map,
	merge = adapter.merge,
	hyphenate = adapter.hyphenate,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	animate = adapter.animate,
	stop = adapter.stop,
	
	// lookup over the types and the associated classes
	seriesTypes = {};
	
/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
function extend(a, b) {
	if (!a) {
		a = {};
	}
	for (var n in b) {
		a[n] = b[n];
	}
	return a;
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined (obj) {
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
	if (typeof prop == 'string') {
		// set the value
		if (defined(value)) {
			elem[setAttribute](prop, value);
		
		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}
	
	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && typeof prop == 'object') {
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
	if (!obj || obj.constructor != Array) {
		obj = [obj];
	}
	return obj; 
}



/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
function pick() {
	var args = arguments,
		i,
		arg;
	for (i = 0; i < args.length; i++) {
		arg = args[i];
		if (defined(arg)) {
			return arg;
		}
	}
}
/**
 * Make a style string from a JS object
 * @param {Object} style
 */
function serializeCSS(style) {
	var s = '', 
		key;
	// serialize the declaration
	for (key in style) {
		s += hyphenate(key) +':'+ style[key] + ';';
	}
	return s;
	
}
/**
 * Set CSS on a give element
 * @param {Object} el
 * @param {Object} styles
 */
function css (el, styles) {
	if (isIE) {
		if (styles && styles.opacity !== UNDEFINED) {
			styles.filter = 'alpha(opacity='+ (styles.opacity * 100) +')';
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
function createElement (tag, attribs, styles, parent, nopad) {
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

// Define the adapter
globalAdapter && globalAdapter.init && globalAdapter.init();
if (!globalAdapter && win.jQuery) {
	var jQ = jQuery;
	
	
	each = function(arr, fn) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	};
	
	grep = jQ.grep;
	
	map = function(arr, fn){
		//return jQuery.map(arr, fn);
		var results = [];
		for (var i = 0, len = arr.length; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}
		return results;
		
	};
	
	merge = function(){
		var args = arguments;
		return jQ.extend(true, null, args[0], args[1], args[2], args[3]);
	};
	
	hyphenate = function (str) {
		return str.replace(/([A-Z])/g, function(a, b){ return '-'+ b.toLowerCase(); });
	};
	
	addEvent = function (el, event, fn){
		jQ(el).bind(event, fn);
	};
	
	/**
	 * Remove event added with addEvent
	 * @param {Object} el The object
	 * @param {String} eventType The event type. Leave blank to remove all events.
	 * @param {Function} handler The function to remove
	 */
	removeEvent = function(el, eventType, handler) {
		try { // http://forum.jquery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jquery-1-4-2
			jQ(el).unbind(eventType, handler);
		} catch (e) {}
	};
	
	fireEvent = function(el, type, eventArguments, defaultFunction) {
		var event = jQ.Event(type),
			detachedType = 'detached'+ type;
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
	jQ.extend( jQ.easing, {
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
					
	// extend the animate function to allow SVG animations
	var oldStepDefault = jQuery.fx.step._default, 
		oldCur = jQuery.fx.prototype.cur;
	
	// do the step
	jQ.fx.step._default = function(fx){
		var elem = fx.elem;
		if (elem.attr) { // is SVG element wrapper
			elem.attr(fx.prop, fx.now);			
		} else {
			oldStepDefault.apply(this, arguments);
		}
	};
	// animate paths
	jQ.fx.step.d = function(fx) {
		var start = fx.start,
			end = fx.end,
			elem = fx.elem,
			ret = [];
			
		
		// Normally start and end should be set in state == 0, but sometimes,
		// for reasons unknown, this doesn't happen. Perhaps state == 0 is skipped
		// in these cases
		if (!fx.started) {
			
			var shift = elem.shift,
				fromD = elem.d,
				bezier = fromD.indexOf('C') > -1,
				numParams = bezier ? 7 : 3,
				endLength,
				slice,
				i,
				startVal,
				sixify = function(arr) { // in splines make move points have six parameters like bezier curves
					i = arr.length;
					while (i--) {
						if (arr[i] == M) {
							arr.splice(i + 1, 0, arr[i+1], arr[i+2], arr[i+1], arr[i+2]);
						}
					}
				};
			
			start = elem.d.split(' ');
			end = [].concat(elem.toD); // copy
			
			
			if (bezier) {
				sixify(start);
				sixify(end);
			}
			
			// if shifting points, prepend a dummy point to the end path
			if (shift) {
				end = [].concat(end).splice(0, numParams).concat(end);
			}
			
			// copy and append last point until the length matches the end length
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
			
			//shift && console.log(start);
			//shift && console.log(end);
			
			fx.start = start;
			fx.end = end;			
			fx.started = true;
		}
		
		
		// interpolate each value of the path
		i = start.length;
		if (fx.pos == 1) { // end of animation, land on the right path
			ret = elem.toD;
			
		} else if (i == end.length && fx.pos < 1) {
			while (i--) {
				startVal = parseFloat(start[i]);
				ret[i] = 
					isNaN(startVal) ? // a letter instruction like M or L
						start[i] :
						fx.pos * (parseFloat(end[i] - startVal)) + startVal;
				
			}
		} else {
			ret = end;
		}
		
		
		elem.attr('d', ret);
	
	};
	// get the current value
	jQ.fx.prototype.cur = function() {
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
 * Set the time methods globally based on the useUTC option. Time method can be either 
 * local time or UTC (default).
 */
function setTimeMethods() {
	var useUTC = defaultOptions.global.useUTC;
	
	makeTime = useUTC ? Date.UTC : function(year, month, date, hours, minutes, seconds) {
		return new Date(
			year, 
			month, 
			pick(date, 1), 
			pick(hours, 0), 
			pick(minutes, 0), 
			pick(seconds, 0)
		).getTime();
	};
	getMinutes = useUTC ? 'getUTCMinutes' : 'getMinutes';
	getHours = useUTC ? 'getUTCHours' : 'getHours';
	getDay = useUTC ? 'getUTCDay' : 'getDay';
	getDate = useUTC ? 'getUTCDate' : 'getDate';
	getMonth = useUTC ? 'getUTCMonth' : 'getMonth';
	getFullYear = useUTC ? 'getUTCFullYear' : 'getFullYear';
	setMinutes = useUTC ? 'setUTCMinutes' : 'setMinutes';
	setHours = useUTC ? 'setUTCHours' : 'setHours';
	setDate = useUTC ? 'setUTCDate' : 'setDate';
	setMonth = useUTC ? 'setUTCMonth' : 'setMonth';
	setFullYear = useUTC ? 'setUTCFullYear' : 'setFullYear';
		
}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
function setOptions(options) {
	defaultOptions = merge(defaultOptions, options);
	
	// apply UTC
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
	/*formatter: function() {
		return this.value;
	},*/
	style: {
		color: '#666',
		fontSize: '11px'
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
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		decimalPoint: '.',
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ','
	},
	global: {
		useUTC: true
	},
	chart: {
		//alignTicks: false,
		animation: { // docs
			//duration: 500,
			//easing: 'swing'
		},
		//className: null,
		//events: { load, selection },
		//margin: [null], // docs
		//marginTop: null, // docs
		//marginRight: null, // docs
		//marginBottom: null, // docs
		//marginLeft: 50,
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 5,		
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		spacingTop: 10, // docs
		spacingRight: 10, // docs
		spacingBottom: 10, // docs
		spacingLeft: 10, // docs
		style: {
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
			fontSize: '12px'
		},
		backgroundColor: '#FFFFFF',
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0'
		//plotBorderWidth: 0,
		//plotShadow: false,
		//zoomType: ''
	},
	title: {
		text: 'Chart title',
		align: 'center',
		// floating: false, // docs
		// margin: 15, // docs: padding for title or subtitle
		// x: 0,
		// verticalAlign: 'top', // docs
		y: 25, // docs
		style: {
			color: '#3E576F',
			fontSize: '16px'
		}

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false // docs
		// x: 0,
		// verticalAlign: 'top', // docs
		y: 40,
		style: {
			color: '#6D869F'
		}
	},
	
	plotOptions: {
		line: { // base series options
			allowPointSelect: false,
			showCheckbox: false,
			animation: true,
			//cursor: 'default',
			//enableMouseTracking: true,
			events: {},
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
				formatter: function() {
					return this.y;
				}
			}),
			
			//pointStart: 0,
			//pointInterval: 1,
			showInLegend: true,
			states: { // states for the entire series
				hover: {
					//enabled: false,
					lineWidth: 3,
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
		//floating: false, // docs
		layout: 'horizontal',
		labelFormatter: function() {
			return this.name;
		},
		// lineHeight: 16,
		borderWidth: 1,
		borderColor: '#909090',
		borderRadius: 5,
		// margin: 5, // docs
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
		x: 15,
		y: -15
	},
	
	loading: {
		hideDuration: 100,
		labelStyle: {
			fontWeight: 'bold',
			position: RELATIVE,
			top: '1em'
		},
		showDuration: 100,
		style: {
			position: ABSOLUTE,
			backgroundColor: 'white',
			opacity: 0.5,
			textAlign: 'center'
		}
	},
	
	tooltip: {
		enabled: true,
		formatter: function() {
			var pThis = this,
				series = pThis.series,
				xAxis = series.xAxis,
				x = pThis.x;
			return '<b>'+ (pThis.point.name || series.name) +'</b><br/>'+
				(defined(x) ? 
					'X value: '+ (xAxis && xAxis.options.type == 'datetime' ? 
						dateFormat(null, x) : x) +'<br/>':
					'')+
				'Y value: '+ pThis.y;
		},
		backgroundColor: 'rgba(255, 255, 255, .85)',
		borderWidth: 2,
		borderRadius: 5,
		shadow: true,
		//shared: false, // docs
		snap: 10,
		style: {
			color: '#333333',
			fontSize: '12px',
			padding: '5px',
			whiteSpace: 'nowrap'
		}
	},
	
	toolbar: {
		itemStyle: {
			color: '#4572A7',
			cursor: 'pointer'
		}
	},
	
	credits: {
		enabled: true,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		position: { // docs
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
var defaultXAxisOptions =  {
	// allowDecimals: null,
	// alternateGridColor: null,
	// categories: [],
	dateTimeLabelFormats: {
		second: '%H:%M:%S',
		minute: '%H:%M',
		hour: '%H:%M',
		day: '%e. %b',
		week: '%e. %b',
		month: '%b \'%y',
		year: '%Y'
	},
	endOnTick: false,
	gridLineColor: '#C0C0C0',
	// gridLineWidth: 0,
	// reversed: false,
	
	labels: defaultLabelOptions,
	lineColor: '#C0D0E0',
	lineWidth: 1,
	max: null,
	min: null,
	minPadding: 0.01,
	maxPadding: 0.01,
	maxZoom: null,
	minorGridLineColor: '#E0E0E0',
	minorGridLineWidth: 1,
	minorTickColor: '#A0A0A0',
	//minorTickInterval: null,
	minorTickLength: 2,
	minorTickPosition: 'outside', // inside or outside
	minorTickWidth: 1,
	//plotBands: [{
	//	events: // docs
	//	zIndex: // docs
	//}],
	//plotLines: [{
	//	events: // docs
	//	zIndex: // docs
	//}],
	//reversed: false,
	showFirstLabel: true,
	showLastLabel: false,
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
		//margin: 0 for horizontal, 10 for vertical axes, // docs
		//rotation: 0,
		//side: 'outside',
		style: {
			color: '#6D869F',
			//font: defaultFont.replace('normal', 'bold')
			fontWeight: 'bold'
		}
	},
	type: 'linear' // linear or datetime
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
	}
}),

defaultLeftAxisOptions = {
	labels: {
		align: 'right',
		x: -8,
		y: 3
	},
	title: {
		rotation: 270
	}
},
defaultRightAxisOptions = {
	labels: {
		align: 'left',
		x: 8,
		y: 3
	},
	title: {
		rotation: 90
	}
},
defaultBottomAxisOptions = { // horizontal axis
	labels: {
		align: 'center',
		x: 0,
		y: 14
	},
	title: {
		rotation: 0
	}
},
defaultTopAxisOptions = merge(defaultBottomAxisOptions, {
	labels: {
		y: -5
	}
});


 

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
	}
});
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	// threshold: 0,
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
	}
});
defaultPlotOptions.bar = merge(defaultPlotOptions.column, {
	dataLabels: {
		align: 'left',
		x: 5,
		y: 0
	}
});
defaultPlotOptions.pie = merge(defaultSeriesOptions, {
	//dragType: '', // n/a
	borderColor: '#FFFFFF',
	borderWidth: 1,
	center: ['50%', '50%'],
	colorByPoint: true, // always true for pies
	dataLabels: {
		// align: null, // docs - n/a for pies
		// connectorWidth: 1, // docs
		// connectorColor: '#606060', // docs
		// connectorPadding: 5, // docs
		distance: 30, // docs
		y: 5
	},
	//innerSize: 0,
	legendType: 'point',
	marker: null, // point options are specified in the base options
	size: '90%',
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
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
function extendClass(parent, members) {
	var object = function(){};
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}


/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var Color = function(input) {
	// declare variables
	var rgba = [], result;
	
	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {
		
		// rgba
		if((result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(input))) {
			rgba = [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10), parseFloat(result[4], 10)];
		}

		// hex
		else if((result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(input))) {
			rgba = [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16), 1];
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
			if (format == 'rgb') {
				ret = 'rgb('+ rgba[0] +','+ rgba[1] +','+ rgba[2] +')';
			} else if (format == 'a') {
				ret = rgba[3];
			} else {
				ret = 'rgba('+ rgba.join(',') +')';
			}
		} else {
			ret = input;
		}
		return ret;
	}
	
	/**
	 * Brighten the color
	 * @param {Object} alpha
	 */
	function brighten(alpha) {
		if (typeof alpha == 'number' && alpha !== 0) {
			for (var i = 0; i < 3; i++) {
				rgba[i] += parseInt(alpha * 255, 10);
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
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
function numberFormat (number, decimals, decPoint, thousandsSep) {
	var lang = defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = number, c = isNaN(decimals = mathAbs(decimals)) ? 2 : decimals,
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep, s = n < 0 ? "-" : "",
		i = parseInt(n = mathAbs(+n || 0).toFixed(c), 10) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php 
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	function pad (number) {
		return number.toString().replace(/^([0-9])$/, '0$1');
	}
	
	if (!defined(timestamp) || isNaN(timestamp)) {
		return 'Invalid date';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');
	
	var date = new Date(timestamp * timeFactor),
	
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,
		langMonths = lang.months,
		
		// list all format keys
		replacements = {

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31 
			'e': dayOfMonth, // Day of the month, 1 through 31 
			
			// Week (none implemented)
			
			// Month
			'b': langMonths[month].substr(0, 3), // Short month, like 'Jan'
			'B': langMonths[month], // Long month, like 'January'
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
			'S': pad(date.getSeconds()) // Two digits seconds, 00 through  59
			
		};


	// do the replaces
	for (var key in replacements) {
		format = format.replace('%'+ key, replacements[key]);
	}
		
	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};



/**
 * Loop up the node tree and add offsetWidth and offsetHeight to get the
 * total page offset for a given element
 * @param {Object} el
 */
function getPosition (el) {
	var p = { x: el.offsetLeft, y: el.offsetTop };
	while (el.offsetParent)	{
		el = el.offsetParent;
		p.x += el.offsetLeft;
		p.y += el.offsetTop;
		if (el != doc.body && el != doc.documentElement) {
			p.x -= el.scrollLeft;
			p.y -= el.scrollTop;
		}
	}
	return p;
}


/**
 * A wrapper object for SVG elements 
 */
function SVGElement () {}

SVGElement.prototype = {
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function(renderer, nodeName) {
		this.element = doc.createElementNS('http://www.w3.org/2000/svg', nodeName);
		this.renderer = renderer;
	},
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 */
	animate: function(params, options) {
		var animOptions = pick(options, globalAnimation, true);
		if (animOptions) {
			animate(this, params, merge(animOptions));
		} else {
			this.attr(params);
		}
	},
	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function(hash, val) {
		var key, 
			value, 
			i, 
			child,
			element = this.element,
			nodeName = element.nodeName,
			renderer = this.renderer,
			skipAttr,
			shadows = this.shadows,
			hasSetSymbolSize,
			ret = this;
			
		// single key-value pair
		if (typeof hash == 'string' && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}
		
		// used as a getter: first argument is a string, second is undefined
		if (typeof hash == 'string') {
			key = hash;
			if (nodeName == 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			} else if (key == 'strokeWidth') {
				key = 'stroke-width';
			}
			ret = attr(element, key) || this[key] || 0;
			
			if (key != 'd' && key != 'visibility') { // 'd' is string in animation step
				ret = parseFloat(ret);
			}
			
		// setter
		} else {
		
			for (key in hash) {
				value = hash[key];
				
				// paths
				if (key == 'd') {
					if (value && value.join) { // join path
						value = value.join(' ');
					}					
					if (/(NaN|  |^$)/.test(value)) {
						value = 'M 0 0';
					}
					this.d = value; // shortcut for animations
					
				// update child tspans x values
				} else if (key == 'x' && nodeName == 'text') { 
					for (i = 0; i < element.childNodes.length; i++ ) {
						child = element.childNodes[i];
						// if the x values are equal, the tspan represents a linebreak
						if (attr(child, 'x') == attr(element, 'x')) {
							//child.setAttribute('x', value);
							attr(child, 'x', value);
						}
					}
					if (this.rotation) {
						attr(element, 'transform', 'rotate('+ this.rotation +' '+ value +' '+ (hash.y || attr(element, 'y')) +')');
					}
					
				// apply gradients
				} else if (key == 'fill') {
					value = renderer.color(value, element, key);
				
				// circle x and y
				} else if (nodeName == 'circle') {
					key = { x: 'cx', y: 'cy' }[key] || key;
					
				// translation
				} else if (key == 'translateX' || key == 'translateY') {
					this[key] = value;
					this.updateTransform();
					skipAttr = true;
	
				// apply opacity as subnode (required by legacy WebKit and Batik)
				} else if (key == 'stroke') {
					value = renderer.color(value, element, key);
					 
				
				// special
				} else if (key == 'isTracker') {
					this[key] = value;
				}
				
				// jQuery animate changes case
				if (key == 'strokeWidth') {
					key = 'stroke-width';
				}
				
				// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)				
				if (isWebKit && key == 'stroke-width' && value === 0) {
					value = 0.000001;
				}
				
				// symbols
				if (this.symbolName && /^(x|y|r|start|end|innerR)/.test(key)) {
					
					
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);
						hasSetSymbolSize = true;
					}
					skipAttr = true;
				}
				
				// let the shadow follow the main element
				if (shadows && /^(width|height|visibility|x|y|d)$/.test(key)) {
					i = shadows.length;
					while (i--) {
						attr(shadows[i], key, value);
					}
					
				}
				
					
				
				if (key == 'text') {
					// only one node allowed
					renderer.buildText(element, value);
				} else if (!skipAttr) {
					//element.setAttribute(key, value);
					attr(element, key, value);
				}
			}
			
		}
		return ret;
	},
	
	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function(hash) {
		var wrapper = this;
		
		wrapper.x = pick(hash.x, wrapper.x);
		wrapper.y = pick(hash.y, wrapper.y);
		wrapper.r = pick(hash.r, wrapper.r);
		wrapper.start = pick(hash.start, wrapper.start);
		wrapper.end = pick(hash.end, wrapper.end);
		wrapper.width = pick(hash.width, wrapper.width);
		wrapper.height = pick(hash.height, wrapper.height);
		wrapper.innerR = pick(hash.innerR, wrapper.innerR);
		
		wrapper.attr({ 
			d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.r, {
				start: wrapper.start, 
				end: wrapper.end,
				width: wrapper.width, 
				height: wrapper.height,
				innerR: wrapper.innerR
			})
		});
	},
	
	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function(clipRect) {
		return this.attr('clip-path', 'url('+ this.renderer.url +'#'+ clipRect.id +')');
	},
	
	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function(styles) {
		var elemWrapper = this;
		
		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}
		
		// save the styles in an object
		styles = extend(
			elemWrapper.styles,
			styles
		);
		
		// serialize and set style attribute
		elemWrapper.attr({
			style: serializeCSS(styles)
		});
		
		// store object
		elemWrapper.styles = styles;
		
		return elemWrapper;
	},
	
	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function(eventType, handler) {
		// simplest possible event model for internal use
		this.element['on'+ eventType] = handler;
		return this;
	},
	
	
	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function(x, y) {
		var wrapper = this;
		wrapper.translateX = x;
		wrapper.translateY = y;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Invert a group, rotate and flip
	 */
	invert: function() {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Private method to update the transform attribute based on internal 
	 * properties
	 */
	updateTransform: function() {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			inverted = wrapper.inverted,
			transform = [];
			
		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}
			
		// apply translate
		if (translateX || translateY) {
			transform.push('translate('+ translateX +','+ translateY +')');
		}
		
		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		}
		
		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function() {
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
	 * 
	 */
	align: function(alignOptions, alignByTranslate) {
		
		if (!alignOptions) { // called on resize
			alignOptions = this.alignOptions;
			alignByTranslate = this.alignByTranslate;
		} else { // first call on instanciate
			this.alignOptions = alignOptions;
			this.alignByTranslate = alignByTranslate;
			this.renderer.alignedObjects.push(this); // todo: event?
		}
		var align = alignOptions.align,
			vAlign = alignOptions.verticalAlign,
			renderer = this.renderer,
			x = alignOptions.x || 0, // default: left align
			y = alignOptions.y || 0, // default: top align
			attribs = {};
			
		// align
		if (/^(right|center)$/.test(align)) {
			x += (renderer.width - (alignOptions.width || 0) ) /
					{ right: 1, center: 2 }[align];
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = x;
		
		
		// vertical align
		if (/^(bottom|middle)$/.test(vAlign)) {
			y += (renderer.height - (alignOptions.height || 0)) /
					({ bottom: 1, middle: 2 }[vAlign] || 1);
			
		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = y;
		
		this.animate(attribs);
		
		return this;
	},
	
	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function() {
		var bBox = this.element.getBBox(),
			rad,
			h = bBox.height;
		if (this.rotation) { // adjust for rotated text
			rad = this.rotation * math.PI * 2 / 360; // radians
			
			bBox.height = mathAbs(bBox.height * mathCos(rad) + bBox.width * mathSin(rad));
			//bBox.slant = mathAbs(bBox.width * mathSin(rad)); // the additional height below the anchor
			
			
		}
		return bBox;
	},
	
	/**
	 * Show the element
	 */
	show: function() {
		return this.attr({ visibility: VISIBLE });
	},
	
	/**
	 * Hide the element
	 */
	hide: function() {
		return this.attr({ visibility: HIDDEN });
	},
	
	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *    to append the element to the renderer.box.
	 */ 
	add: function(parent) {
	
		var renderer = this.renderer,
			parentWrapper = parent || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes = parentNode.childNodes,
			element = this.element,
			zIndex = attr(element, 'zIndex'),
			otherElement,
			otherZIndex,
			i;
			
		// mark as inverted
		this.parentInverted = parent && parent.inverted;
		
		// mark the container as having z indexed children
		if (zIndex) {
			parentWrapper.handleZ = true;
			zIndex = parseInt(zIndex, 10);
		}

		// insert according to this and other elements' zIndex
		if (parentWrapper.handleZ) { // this element or any of its siblings has a z index
			for (i = 0; i < childNodes.length; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement != element && (
						// insert before the first element with a higher zIndex
						parseInt(otherZIndex, 10) > zIndex || 
						// if no zIndex given, insert before the first element with a zIndex
						(!defined(zIndex) && defined(otherZIndex))  
						
						)) {
					parentNode.insertBefore(element, otherElement);
					return this;
				}
			}
		}
		
		// default: append at the end
		parentNode.appendChild(element);
		return this;
	},

	
	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function() {
		var wrapper = this,
			element = wrapper.element,
			shadows = wrapper.shadows,
			parentNode = element.parentNode,
			key;
		
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
		stop(wrapper); // stop running animations
		if (parentNode) {
			parentNode.removeChild(element);
		}
		
		if (shadows) {
			each(shadows, function(shadow) {
				parentNode = shadow.parentNode;
				if (parentNode) { // the entire chart HTML can be overwritten
					parentNode.removeChild(shadow);
				}				
			});
		}
				
		for (key in wrapper) {
			delete wrapper[key];
		}
		
		return null;
	},
	
	/**
	 * Empty a group element
	 */
	empty: function() {
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
	shadow: function(apply) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			
			// compensate for inverted plot area
			transform = this.parentInverted ? '(-1,-1)' : '(1,1)';
			
		
		if (apply) {
			//obj.shadows = [];
			for (i = 1; i <= 3; i++) {
				/*this.drawRect(x + 1, y + 1, w, h, 'rgba(0, 0, 0, '+ (0.05 * i) +')', 
					6 - 2 * i, radius);*/
					
				shadow = element.cloneNode(0);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': 'rgb(0, 0, 0)',
					'stroke-opacity': 0.05 * i,
					'stroke-width': 7 - 2 * i,
					'transform': 'translate'+ transform,
					'fill': NONE
				});
				
				
				element.parentNode.insertBefore(shadow, element);
				
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
var SVGRenderer = function() {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function(container, width, height) {
		var loc = location,
			boxWrapper;
			
		
		this.Element = SVGElement;
		this.width = width;
		this.height = height;
		boxWrapper = this.createElement('svg')
			.attr ({
				width: width,
				height: height,
				xmlns: 'http://www.w3.org/2000/svg',
				version: '1.1'
			});
		container.appendChild(boxWrapper.element);
		
		// object properties
		this.box = boxWrapper.element;
		this.boxWrapper = boxWrapper;
		this.alignedObjects = [];
		this.url = loc.href.replace(loc.hash, ''); // page url used for internal references
		this.defs = this.createElement('defs').add();
	},
	
	
	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function(nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},
	
	
	/** 
	 * Parse a simple HTML string into SVG tspans
	 * 
	 * @param {Object} textNode The parent text SVG node
	 * @param {String} str
	 */
	buildText: function(textNode, str) {
		var lines = str.toString()
				.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
				.replace(/<(i|em)>/g, '<span style="font-style:italic">')
				.replace(/<a/g, '<span')
				.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
				.split('<br/>'),
			childNodes = textNode.childNodes,
			styleRegex = /style="([^"]+)"/,
			hrefRegex = /href="([^"]+)"/,
			parentX = attr(textNode, 'x'),
			i;
			
			
		// remove old text
		for (i = childNodes.length - 1; i >= 0; i--) {
			textNode.removeChild(childNodes[i]);
		}
		
		
		each (lines, function(line, lineNo) {
			var spans, spanNo = 0;
			
			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');
			
			each (spans, function (span) {
				if (span !== '') {
					var attributes = {},
						tspan = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					if (styleRegex.test(span)) {
						attr(
							tspan, 
							'style', 
							span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2')
						);
					}
					if (hrefRegex.test(span)) {
						attr(tspan, 'onclick', 'location.href=\"'+ span.match(hrefRegex)[1] +'\"');
						css(tspan, { cursor: 'pointer' });
					}
					
					span = span.replace(/<(.|\n)*?>/g, '');
					tspan.appendChild(doc.createTextNode(span));
					//console.log('"'+tspan.textContent+'"');
					if (!spanNo) { // first span in a line, align it to the left
						attributes.x = parentX;
					} else {
						// Firefox ignores spaces at the front or end of the tspan
						attributes.dx = 3; // space
					}
					if (lineNo && !spanNo) { // first span on subsequent line, add the line height
						attributes.dy = 16;
					}
					
					attr(tspan, attributes);
					
					textNode.appendChild(tspan);
					
					spanNo++;
				}
			});
			
		});
	},
	
	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width 
	 */
	crispLine: function(points, width) {
		try {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] == points[4]) {
			points[1] = points[4] = mathRound(points[1]) + (width % 2 / 2);
		}
		if (points[2] == points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
		} catch (e) { console.info(e.massage); return []; }
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
		var attr = typeof x == 'object' ?
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
		
		if (typeof x == 'object') {
			y = x.y;
			r = x.r;
			innerR = x.innerR;
			start = x.start;
			end = x.end;
			x = x.x;
		}
		
		return this.symbol('arc', x || 0, y || 0, r || 0, {
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
		
		if (arguments.length > 1) {
			var normalizer = (strokeWidth || 0) % 2 / 2;

			// normalize for crisp edges
			x = mathRound(x || 0) + normalizer;
			y = mathRound(y || 0) + normalizer;
			width = mathRound((width || 0) - 2 * normalizer);
			height = mathRound((height || 0) - 2 * normalizer);
		}
		
		var attr = typeof x == 'object' ? 
			x : // the attributes can be passed as the first argument
			{
				x: x,
				y: y,
				width: mathMax(width, 0),
				height: mathMax(height, 0)
			};			
		
		return this.createElement('rect').attr(extend(attr, {
			rx: r || attr.r,
			ry: r || attr.r,
			fill: NONE
		}));
	},
	
	/**
	 * Resize the box and re-align all aligned elements
	 * @param {Object} width
	 * @param {Object} height
	 * 
	 * @todo: rename to setSize and call it in SVGRenderer.init and VMLRenderer.init
	 * 
	 */
	resizeTo: function(width, height) {
		var alignedObjects = this.alignedObjects,
			i = alignedObjects.length,
			obj;
		
		this.width = width;
		this.height = height;
		
		this.boxWrapper.animate({
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
	g: function(name) {
		return this.createElement('g').attr(
			defined(name) && { 'class': PREFIX + name }
		);
	},
	
	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function(src, x, y, width, height) {
		var elemWrapper = this.createElement('image').attr({
			x: x,
			y: y,
			width: width,
			height: height,
			preserveAspectRatio: NONE
		});		
		
		// set the href in the xlink namespace
		elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink', 
			'href', src);
			
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
	symbol: function(symbol, x, y, radius, options) {
		
		var obj,
			
			// get the symbol definition function
			symbolFn = this.symbols[symbol],
			
			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				x, 
				y, 
				radius, 
				options
			),
			
			imageRegex = /^url\((.*?)\)$/,
			imageSrc;
			
		
		if (path) {
			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				r: radius
			});
			if (options) {
				extend(obj, options);
			}
			
			
		// image symbols
		} else if (imageRegex.test(symbol)) {
			imageSrc = symbol.match(imageRegex)[1];
			
			
			// create the image
			obj = this.image(imageSrc).attr({
				visibility: HIDDEN
			});
			// create a dummy JavaScript image to get the width and height  
			createElement('img', {
				onload: function() {
					var img = this,
						size = symbolSizes[img.src] || [img.width, img.height];
					obj.attr({
						x: mathRound(x - size[0] / 2) + PX,
						y: mathRound(y - size[1] / 2) + PX,
						width: size[0],
						height: size[1],
						visibility: 'inherit'
					});
				},
				src: imageSrc
			});
				
		// default circles
		} else {
			obj = this.circle (x, y, radius);
		}
		
		return obj;
	},
	
	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'square': function (x, y, radius) {
			var len = 0.707 * radius;
			return [
				M, x-len, y-len,
				L, x+len, y-len,
				x+len, y+len,
				x-len, y+len,
				'Z'
			];
		},
			
		'triangle': function (x, y, radius) {
			return [
				M, x, y-1.33 * radius,
				L, x+radius, y + 0.67 * radius,
				x-radius, y + 0.67 * radius,
				'Z'
			];
		},
			
		'triangle-down': function (x, y, radius) {
			return [
				M, x, y + 1.33 * radius,
				L, x-radius, y-0.67 * radius,
				x+radius, y-0.67 * radius,
				'Z'
			];
		},
		'diamond': function (x, y, radius) {
			return [
				M, x, y-radius,
				L, x+radius, y,
				x, y+radius,
				x-radius, y,
				'Z'
			];
		},
		'arc': function (x, y, radius, options) {
			var pi = Math.PI,
				start = options.start,
				end = options.end - 0.000001, // to prevent cos and sin of start and end from becoming equal on 360 arcs
				innerRadius = options.innerR,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				longArc = options.end - start < pi ? 0 : 1;
				
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
		
		return wrapper;
	},
	
	
	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object
	 * 
	 * @param {Object} color The color or config object
	 */
	color: function(color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/;
		if (color && color.linearGradient) {
			var renderer = this,
				strLinearGradient = 'linearGradient',
				linearGradient = color[strLinearGradient],
				id = PREFIX + idCounter++,
				gradientObject,
				stopColor,
				stopOpacity;
			gradientObject = renderer.createElement(strLinearGradient).attr({
				id: id,
				gradientUnits: 'userSpaceOnUse',
				x1: linearGradient[0],
				y1: linearGradient[1],
				x2: linearGradient[2],
				y2: linearGradient[3]
			}).add(renderer.defs);
			
			each(color.stops, function(stop) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}
				renderer.createElement('stop').attr({
					offset: stop[0],
					'stop-color': stopColor,
					'stop-opacity': stopOpacity
				}).add(gradientObject);
			});
			
			return 'url('+ this.url +'#'+ id +')';
			
		// Webkit and Batik can't show rgba.
		} else if (regexRgba.test(color)) {
			colorObject = Color(color);
			attr(elem, prop +'-opacity', colorObject.get('a'));
			
			return colorObject.get('rgb');
			
			
		} else {
			return color;
		}
		
	},
	
		
	/**
	 * Add text to the SVG object
	 * @param {String} str
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Object} style CSS styles for the text
	 * @param {Nubmer} rotation Rotation in degrees
	 * @param {String} align Left, center or right
	 */
	text: function(str, x, y, style, rotation, align) {
		style = style || {};
		align = align || 'left';
		rotation = rotation || 0;
		
		// declare variables
		var attribs,
			css, 
			fill = style.color || '#000000',
			defaultChartStyle = defaultOptions.chart.style,
			wrapper;
	
		x = mathRound(pick(x, 0));
		y = mathRound(pick(y, 0));
		
		extend(style, {
			fontFamily: style.fontFamily || defaultChartStyle.fontFamily,
			fontSize: style.fontSize || defaultChartStyle.fontSize
		});
		
		// prepare style
		css = serializeCSS(style);
		
		// prepare attributes
		attribs = {
				x: x,
				y: y,
				text: str,
				fill: fill,
				style: css.replace(/"/g, "'")
				
			};
			
		if (rotation || align != 'left') {
			attribs = extend(attribs, {
				'text-anchor': { left: 'start', center: 'middle', right: 'end' }[align],
				transform: 'rotate('+ rotation +' '+ x +' '+ y +')'
			});
		}

		wrapper = this.createElement('text').attr(attribs);
		wrapper.rotation = rotation; // used when setting x and y later
		return wrapper;
	}
}; // end SVGRenderer




/* **************************************************************************** 
 *                                                                            * 
 * START OF INTERNET EXPLORER <= 8 SPECIFIC CODE                              *
 *                                                                            *
 * For applications and websites that don't need IE support, like platform    *
 * targeted mobile apps and web apps, this code can be removed.               *
 *                                                                            *
 *****************************************************************************/
var VMLRenderer;
if (!hasSVG) {

/**
 * The VML element wrapper.
 */
var VMLElement = extendClass( SVGElement, {
	
	/**
	 * Initialize a new VML element wrapper. It builds the markup as a string
	 * to minimize DOM traffic.
	 * @param {Object} renderer
	 * @param {Object} nodeName
	 */
	init: function(renderer, nodeName) {
		var markup =  ['<', nodeName, ' filled="f" stroked="f"'],
			style = ['position: ', ABSOLUTE, ';'];
		
		// divs and shapes need size
		if (nodeName == 'shape' || nodeName == DIV) {
			style.push('left:0;top:0;width:10px;height:10px;');
		}
		markup.push(' style="', style.join(''), '"/>');
		
		// create element with default attributes and style
		if (nodeName) {
			markup = nodeName == DIV || nodeName == 'span' || nodeName == 'img' ? 
				markup.join('')
				: renderer.prepVML(markup);
			this.element = createElement(markup);
		}
		
		this.renderer = renderer;
	},
	
	/**
	 * Add the node to the given parent
	 * @param {Object} parent
	 */
	add: function(parent) {
		var wrapper = this,
			renderer = wrapper.renderer,
			element = wrapper.element,
			box = renderer.box,
			inverted = parent && parent.inverted,
			parentStyle,
		
			// get the parent node
			parentNode = parent ? 
				parent.element || parent : 
				box;
			
			
		// if the parent group is inverted, apply inversion on all children
		if (inverted) { // only on groups
			
			parentStyle = parentNode.style;
			
			css(element, { 
				flip: 'x',
				left: parseInt(parentStyle.width, 10) - 10,
				top: parseInt(parentStyle.height, 10) - 10,
				rotation: -90
			});
			
		}
		
		//css(element, { visibility: 'visible' });
		
		// append it
		parentNode.appendChild(element);
		
		
		return wrapper;
	},
	
	/**
	 * Get or set attributes
	 */
	attr: function(hash, val) {
		var key, 
			value, 
			i, 
			element = this.element,
			elemStyle = element.style,
			nodeName = element.nodeName,
			renderer = this.renderer,
			symbolName = this.symbolName,
			hasSetSymbolSize,
			shadows = this.shadows,
			skipAttr,
			ret = this;
			
		// single key-value pair
		if (typeof hash == 'string' && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}
		
		// used as a getter, val is undefined
		if (typeof hash == 'string') {
			key = hash;
			if (key == 'strokeWidth' || key == 'stroke-width') {
				ret = element.strokeweight;
				
			} else {
				ret = pick(
					this[key], 
					parseInt(elemStyle[{ 
						x: 'left', 
						y: 'top'
					}[key] || key], 10)
				);
			}
			
		// setter
		} else {		
			for (key in hash) {
				value = hash[key];
				skipAttr = false;
				
				// prepare paths
				// symbols
				if (symbolName && /^(x|y|r|start|end|width|height|innerR)/.test(key)) {
					// if one of the symbol size affecting parameters are changed,
					// check all the others only once for each call to an element's
					// .attr() method
					if (!hasSetSymbolSize) {
							
						this.symbolAttr(hash);						
					
						hasSetSymbolSize = true;
					} 
					
					skipAttr = true;
					
				} else if (key == 'd') {
					
					this.d = value.join(' '); // used in getter for animation
					
					// convert paths 
					i = value.length;
					var convertedPath = [];
					while (i--) {					
						
						// Multiply by 10 to allow subpixel precision.
						// Substracting half a pixel seems to make the coordinates
						// align with SVG, but this hasn't been tested thoroughly
						if (typeof value[i] == 'number') {
							convertedPath[i] = mathRound(value[i] * 10) - 5;
						}
						// close the path
						else if (value[i] == 'Z') {
							convertedPath[i] = 'x';
						} 
						else {
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
				} else if (key == 'zIndex' || key == 'visibility') {
					elemStyle[key] = value;
					
					skipAttr = true;
				
				// width and height
				} else if (/^(width|height)$/.test(key)) {
					
					// normal
					elemStyle[key] = value;
										
					// clipping rectangle special
					if (this.updateClipping) {
						this.updateClipping();
					}
					
					skipAttr = true;
					
				// x and y 
				} else if (/^(x|y)$/.test(key)) {

					if (nodeName == 'SPAN') {
						if (key == 'y' && element.lineHeight) { // subtract lineHeight
							value -= element.lineHeight;
						
						} else if (key == 'x' && element.align && element.align != 'left') {
							// fix the position according to align
							value -= this.getBBox().width / { right: 1, center: 2 }[element.align];
						}
					}
					elemStyle[{ x: 'left', y: 'top' }[key]] = value;
					
				// class name
				} else if (key == 'class') {
					// IE8 Standards mode has problems retrieving the className
					element.className = value;
			
				// stroke
				} else if (key == 'stroke') {
					
					value = renderer.color(value, element, key);				
						
					key = 'strokecolor';
					
				// stroke width
				} else if (key == 'stroke-width' || key == 'strokeWidth') {
	
					element.stroked = value ? true : false;
					key = 'strokeweight';
					if (typeof value == 'number') {
						value += PX;
					}
					
				// fill
				} else if (key == 'fill') {
					
					if (nodeName == 'SPAN') { // text color
						elemStyle.color = value;
					} else {
						element.filled = value != NONE ? true : false;
						
						value = renderer.color(value, element, key);
						
						key = 'fillcolor';
					}
				}
				
				// translation for animation
				else if (key == 'translateX' || key == 'translateY') {
					this[key] = value;
					this.updateTransform();
					
					skipAttr = true;
				}
				
					
				// let the shadow follow the main element
				if (shadows && key == 'visibility') {
					i = shadows.length;
					while (i--) {
						shadows[i].style[key] = value;
					}
				}
				
				
				
					
				if (key == 'text') {
					// only one node allowed
					element.innerHTML = value;
				} else if (!skipAttr) {
					if (doc.documentMode == 8) { // IE8 setAttribute bug
						element[key] = value;
					} else {
						attr(element, key, value);
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
	clip: function(clipRect) {
		var wrapper = this,
			clipMembers = clipRect.members,
			index = clipMembers.length;
			
		clipMembers.push(wrapper);
		wrapper.destroyClip = function() {
			clipMembers.splice(index, 1);
		};
		return wrapper.css({ clip: clipRect.getCSS(wrapper.inverted) });
	},
	
	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function(styles) {
		var wrapper = this;
		
		css(wrapper.element, styles);
		
		return wrapper;
	},
	
	/**
	 * Extend element.destroy by removing it from the clip members array
	 */
	destroy: function() {
		var wrapper = this;
		
		if (wrapper.destroyClip) {
			wrapper.destroyClip();
		}
		
		SVGElement.prototype.destroy.apply(this);
	},
	
	/**
	 * Remove all child nodes of a group, except the v:group element
	 */
	empty: function() {
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
	 * Calculate the bounding box based on offsets
	 * 
	 * @return {Object} A hash containing values for x, y, width and height
	 */
	
	getBBox: function() {
		var element = this.element,
			ret,
			hasOffsetWidth = element.offsetWidth,
			origParentNode = element.parentNode;
		
		if (!hasOffsetWidth) {
			doc.body.appendChild(element);
		} 
		ret = {
			x: element.offsetLeft,
			y: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		};
		
		if (!hasOffsetWidth) {
			if (origParentNode) {
				origParentNode.appendChild(element);
			} else {
				doc.body.removeChild(element);
			}
		}

		return ret;
			
	},
	
	/**
	 * Add an event listener. VML override for normalizing event parameters.
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function(eventType, handler) {
		// simplest possible event model for internal use
		this.element['on'+ eventType] = function() {
			var evt = win.event;
			evt.target = evt.srcElement;
			handler(evt);
		};
		return this;
	},
	
	
	/**
	 * Private method to update elements based on internal 
	 * properties based on SVG transform
	 */
	updateTransform: function() {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0;
			
		// apply translate
		if (translateX || translateY) {
			wrapper.css({
				left: translateX,
				top: translateY
			});
		}
	},
	
	/**
	 * Apply a drop shadow by copying elements and giving them different strokes 
	 * @param {Boolean} apply
	 */
	shadow: function(apply) {
		var shadows = [],
			i,
			element = this.element,
			renderer = this.renderer,
			shadow,
			elemStyle = element.style,
			markup;
			
		if (apply && typeof element.path == 'string') {
			for (i = 1; i <= 3; i++) {
				markup = ['<shape isShadow="true" strokeweight="', ( 7 - 2 * i ) ,
					'" filled="false" path="', element.path,
					'" coordsize="100,100" style="', element.style.cssText, '" />'];
				shadow = createElement(renderer.prepVML(markup),
					null, {
						left: parseInt(elemStyle.left, 10) + 1,
						top: parseInt(elemStyle.top, 10) + 1
					}
				);
				
				// apply the opacity
				markup = ['<stroke color="black" opacity="', (0.05 * i), '"/>'];
				createElement(renderer.prepVML(markup), null, null, shadow);				
				
				
				// insert it
				element.parentNode.insertBefore(shadow, element);
				
				// record it
				shadows.push(shadow);				
				
			}
			
			this.shadows = shadows;
		}
		return this;
	
	}
});
	
/**
 * The VML renderer
 */
VMLRenderer = function() {
	this.init.apply(this, arguments);
};
VMLRenderer.prototype = merge( SVGRenderer.prototype, { // inherit SVGRenderer
	
	isIE8: userAgent.indexOf('MSIE 8.0') > -1,
	

	/**
	 * Initialize the VMLRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function(container, width, height) {
		this.Element = VMLElement;
		this.width = width;
		this.height = height;
		this.alignedObjects = [];
		
		var boxWrapper = this.createElement(DIV)
			.attr({
				width: width + PX,
				height: height + PX
			});
		container.appendChild(boxWrapper.element);	
		
		
		// generate the containing box
		this.box = boxWrapper.element;
		this.boxWrapper = boxWrapper;
		
		// The only way to make IE6 and IE7 print is to use a global namespace. However,
		// with IE8 the only way to make the dynamic shapes visible in screen and print mode
		// seems to be to add the xmlns attribute and the behaviour style inline. Except
		// for rotated text, which I haven't been able to render in IE8 without a namespace.
		// As a consequence, rotated text doesn't print.  
		if (!doc.namespaces.hcv) {			
			
			doc.namespaces.add('hcv', 'urn:schemas-microsoft-com:vml');
			
			// setup default css
			doc.createStyleSheet().cssText = 
				'hcv\\:fill, hcv\\:path, hcv\\:textpath, hcv\\:shape, hcv\\:stroke, hcv\\:line '+
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
			element: {
				style: {
					left: x,
					top: y,
					width: width,
					height: height
				}
			},
			getCSS: function(inverted) {
				var elemStyle = clipRect.element.style,
					top = elemStyle.top,
					left = elemStyle.left,
					right = left + elemStyle.width,
					bottom = top + elemStyle.height;
				return 'rect('+ 
					(inverted ? left : top) + 'px,'+ 
					(inverted ? bottom : right) + 'px,'+ 
					(inverted ? right : bottom) + 'px,'+ 
					(inverted ? top : left) +'px)';
			},
			
			// used in attr and animation to update the clipping of all members
			updateClipping: function() {
				each (clipRect.members, function(member) {
					member.css({ clip: clipRect.getCSS(member.inverted) });
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
	color: function(color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/,
			markup;
			
		if (color && color.linearGradient) {
			
			var stopColor, 
				stopOpacity,
				linearGradient = color.linearGradient,
				angle,
				color1,
				opacity1,
				color2,
				opacity2;	
				
			each(color.stops, function(stop, i) {
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
			
			
			
			// calculate the angle based on the linear vector
			angle = 90  - math.atan(
				(linearGradient[3] - linearGradient[1]) / // y vector
				(linearGradient[2] - linearGradient[0]) // x vector
				) * 180 / math.PI;
			
			// when colors attribute is used, the meanings of opacity and o:opacity2
			// are reversed.
			markup = ['<fill colors="0% ', color1, ',100% ', color2, '" angle="', angle,
				'" opacity="', opacity2, '" o:opacity2="', opacity1,
				'" type="gradient" focus="100%" />'];
			createElement(this.prepVML(markup), null, null, elem);
			
			
		
		// if the color is an rgba color, split it and add a fill node
		// to hold the opacity component
		} else if (regexRgba.test(color)) {
			
			colorObject = Color(color);
			
			markup = ['<', prop, ' opacity="', colorObject.get('a'), '"/>'];
			createElement(this.prepVML(markup), null, null, elem);
			
			return colorObject.get('rgb');
			
			
		} else {
			return color;
		}
		
	},
	
	/**
	 * Take a VML string and prepare it for either IE8 or IE6/IE7. 
	 * @param {Array} markup A string array of the VML markup to prepare
	 */
	prepVML: function(markup) {
		var //xmlns = 'urn:schemas-microsoft-com:vml',
			vmlStyle = 'display:inline-block;behavior:url(#default#VML);',
			isIE8 = this.isIE8;
	
		markup = markup.join('');
		
		if (isIE8) { // add xmlns and style inline
			markup = markup.replace('/>', ' xmlns="urn:schemas-microsoft-com:vml" />');
			if (markup.indexOf('style="') == -1) {
				markup = markup.replace('/>', ' style="'+ vmlStyle +'" />');
			} else {
				markup = markup.replace('style="', 'style="'+ vmlStyle);
			}

		} else { // add namespace
			markup = markup.replace('<', '<hcv:');
		}

		return markup;
	},
	
	/**
	 * Create rotated and aligned text
	 * @param {Object} str
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} style
	 * @param {Object} rotation
	 * @param {Object} align
	 */
	text: function(str, x, y, style, rotation, align) {
		//if (str || str === 0) {
		style = style || {};
		align = align || 'left';
		rotation = rotation || 0;
		
		// declare variables
		var elemWrapper, 
			elem, 
			spanWidth,
			lineHeight = mathRound(parseInt(style.fontSize || 12, 10) * 1.2),
			defaultChartStyle = defaultOptions.chart.style; 
	
		x = mathRound(x);
		y = mathRound(y);
		
		// set styles
		extend(style, {
			color: style.color || '#000000',
			whiteSpace: 'nowrap',
			// get font metrics for correct sizing
			fontFamily: style.fontFamily || defaultChartStyle.fontFamily,
			fontSize: style.fontSize || defaultChartStyle.fontSize
		});
			
		// create a simple span for the non-rotated text
		if (!rotation) { 
			elemWrapper = this.createElement('span');
			elem = elemWrapper.element;
			elem.lineHeight = lineHeight; // used in attr
			elem.align = align; // internal prop used in attr
			elemWrapper.attr({				 
				x: x,
				y: y - lineHeight,
				text: str
			});
			
			css(elem, style);
			
		
		// to achieve rotated text, the ie text is drawn on a vector line that
		// is extrapolated to the left or right or both depending on the 
		// alignment of the text
		} else {
			var radians = (rotation || 0) * math.PI * 2 / 360, // deg to rad
				costheta = mathCos(radians),
				sintheta = mathSin(radians),
				length = 10, // the text is not likely to be longer than this
				baselineCorrection = lineHeight * 0.3,
				left = align == 'left',
				right = align == 'right',
				x1 = left ?     x : x - length * costheta,
				x2 = right ?    x : x + length * costheta,
				y1 = left ?     y : y - length * sintheta,
				y2 = right ?    y : y + length * sintheta;
				
				
			// IE seems to always draw the text with v-text-align middle, so we need 
			// to correct for that by moving the path
			x1 += baselineCorrection * sintheta;
			x2 += baselineCorrection * sintheta;
			y1 -= baselineCorrection * costheta;
			y2 -= baselineCorrection * costheta;
			
			// strange painting bug
			if (mathAbs(x1 - x2) < 0.1) {
				x1 += 0.1;
			}
			if (mathAbs(y1 - y2) < 0.1) {
				y1 += 0.1;
			}
			
			elemWrapper = this.createElement('line').attr({
				from: x1 +', '+ y1,
				to: x2 +', '+ y2
			});
			elem = elemWrapper.element;
			
			createElement('hcv:fill', {
				on: true,
				color: style.color
			}, null, elem);
			
			createElement('hcv:path', {
				textpathok: true
			}, null, elem);
			
			
			// for reasons unknown, the style must be set on init
			createElement(
				'<hcv:textpath style="v-text-align:'+ align +';'+ serializeCSS(style).replace(/"/g, "'") +
				'" on="true" string="'+ str +'">',
			null, null, elem);

			
		}
		
		return elemWrapper;
	},
	
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
	circle: function(x, y, r) {
		return this.path(this.symbols.circle(x, y, r));
	},
	
	/**
	 * Create a group using an outer div and an inner v:group to allow rotating 
	 * and flipping. A simple v:group would have problems with positioning
	 * child HTML elements and CSS clip.
	 * 
	 * @param {String} name The name of the group
	 */
	g: function(name) {
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
	image: function(src, x, y, width, height) {
		return this.createElement('img')
			.attr({ src: src })
			.css({
				left: x,
				top: y,
				width: width,
				height: height
			});
	},
	
	/**
	 * VML uses a shape for rect to overcome bugs and rotation problems
	 */
	rect: function(x, y, width, height, r, strokeWidth) {
		// todo: share this code with SVG
		if (arguments.length > 1) {
			var normalizer = (strokeWidth || 0) % 2 / 2;

			// normalize for crisp edges
			x = mathRound(x || 0) + normalizer;
			y = mathRound(y || 0) + normalizer;
			width = mathRound((width || 0) - 2 * normalizer);
			height = mathRound((height || 0) - 2 * normalizer);
		}
		
		if (typeof x == 'object') { // the attributes can be passed as the first argument 
			y = x.y;
			width = x.width;
			height = x.height;
			r = x.r;
			x = x.x;
		} 
		
		return this.symbol('rect', x || 0, y || 0, r || 0, {
			width: width || 0,
			height: height || 0
		});		
	},
	

	
	/**
	 * Draw a symbol of a predefined type. Overrides the SVG method only when 
	 * drawing image symbols.
	 * 
	 * @param {String} symbol
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 */
	symbol: function(symbol, x, y, radius) {
		var wrapper,
			imageRegex = /^url\((.*?)\)$/;
		
		// image symbols
		if (imageRegex.test(symbol)) {
		
			wrapper = this.createElement('img').attr({
				onload: function() {
					var img = this,
						size = [img.width, img.height];
					css(img, {
						left: mathRound(x - size[0] / 2),
						top: mathRound(y - size[1] / 2)
					});
				},
				src: symbol.match(imageRegex)[1]
			});
		} else {
			wrapper = SVGRenderer.prototype.symbol.apply(this, arguments);
		}

		return wrapper;
	},
	
	/**
	 * Symbol definitions that override the parent SVG renderer's symbols
	 * 
	 */
	symbols: {
		// VML specific arc function
		arc: function (x, y, radius, options) {
			var start = options.start,
				optionsEnd = options.end,
				end = optionsEnd - start == 2 * Math.PI ? optionsEnd - 0.001 : optionsEnd,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				innerRadius = options.innerR;
				
			if (optionsEnd - start === 0) { // no angle, don't show it. 
				return ['x'];
			}
								
			return [
				'wa', // clockwisearcto
				x - radius, // left
				y - radius, // top
				x + radius, // right
				y + radius, // bottom
				x + radius * cosStart, // start x
				y + radius * sinStart, // start y
				x + radius * cosEnd, // end x
				y + radius * sinEnd, // end y
				
				
				'at', // clockwisearcto
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
		circle: function (x, y, r) {
			return [
				'wa', // clockwisearcto
				x - r, // left
				y - r, // top
				x + r, // right
				y + r, // bottom
				x + r, // start x
				y,     // start y
				x + r, // end x
				y,     // end y
				//'x', // finish path
				'e' // close
			];
		},
		/** 
		 * Add rectangle symbol path which eases rotation and omits arcsize problems
		 * compared to the built-in VML roundrect shape
		 * 
		 * @param {Object} left Left position
		 * @param {Object} top Top position
		 * @param {Object} r Border radius
		 * @param {Object} options Width and height
		 */
		
		rect: function (left, top, r, options) {
			var width = options.width,
				height = options.height,
				right = left + width,
				bottom = top + height;
		
			r = mathMin(r, width, height);
			
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
});
}
/* **************************************************************************** 
 *                                                                            * 
 * END OF INTERNET EXPLORER <= 8 SPECIFIC CODE                                *
 *                                                                            *
 *****************************************************************************/

/**
 * General renderer
 */
var Renderer = hasSVG ?	SVGRenderer : VMLRenderer;
	

/**
 * The chart class
 * @param {Object} options
 */
function Chart (options) {
	
	defaultXAxisOptions = merge(defaultXAxisOptions, defaultOptions.xAxis);
	defaultYAxisOptions = merge(defaultYAxisOptions, defaultOptions.yAxis);
	defaultOptions.xAxis = defaultOptions.yAxis = null;
		
	// Handle regular options
	options = merge(defaultOptions, options);
	
	// Define chart variables
	var optionsChart = options.chart,
		optionsMargin = optionsChart.margin,
		margin = typeof optionsMargin == 'object' ?
			optionsMargin : 
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin],
		optionsMarginTop = pick(optionsChart.marginTop, margin[0]),
		optionsMarginRight = pick(optionsChart.marginRight, margin[1]),
		optionsMarginBottom = pick(optionsChart.marginBottom, margin[2]),
		optionsMarginLeft = pick(optionsChart.marginLeft, margin[3]),
		chartTitleOptions = options.title,
		chartSubtitleOptions = options.subtitle,
		plotTop,
		marginRight,
		marginBottom,
		plotLeft,
		axisOffset,
		renderTo,
		renderToClone,
		container,
		containerId,
		chartWidth,
		chartHeight,
		chartBackground,
		plotBackground,
		plotBGImage,
		plotBorder,
		chart = this,
		chartEvents = optionsChart.events,
		eventType,
		isInsidePlot, // function
		tooltip,
		mouseIsDown,
		loadingLayer,
		loadingShown,
		plotHeight,
		plotWidth,
		plotSizeX, // width if normal, height if inverted
		plotSizeY, // height if normal, width if inverted
		tracker,
		trackerGroup,
		placeTrackerGroup,
		legend,
		legendWidth,
		legendHeight,
		position,// = getPosition(container),
		hasCartesianSeries = optionsChart.showAxes,
		isResizing,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [], 
		inverted,
		renderer,
		tooltipTick,
		tooltipInterval,
		hoverX,
		zoom, // function
		zoomOut; // function
		

	/**
	 * Create a new axis object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function Axis (chart, options) {

		// Define variables
		var isXAxis = options.isX,
			opposite = options.opposite, // needed in setOptions			
			horiz = inverted ? !isXAxis : isXAxis,
			side = horiz ? 
				(opposite ? 0 /* top */  : 2 /* bottom */) :
				(opposite ? 1 /* right*/ : 3 /* left */  ),
			stacks = {
				bar: {},
				column: {},
				area: {},
				areaspline: {},
				line: {}
			};
	
		options = merge(
				isXAxis ? defaultXAxisOptions : defaultYAxisOptions,
				[defaultTopAxisOptions, defaultRightAxisOptions, 
					defaultBottomAxisOptions, defaultLeftAxisOptions][side],
				options
			);
	
		var axis = this,
			isDatetimeAxis = options.type == 'datetime',
			offset = options.offset || 0,
			xOrY = isXAxis ? 'x' : 'y',
			axisLength,
		
			transA, // translation factor
			transB = horiz ? plotLeft : marginBottom, // translation addend
			axisGroup,
			gridGroup,
			axisLine,
			dataMin,
			dataMax,
			associatedSeries,
			userSetMin,
			userSetMax,
			max = null,
			min = null,
			minPadding = options.minPadding,
			maxPadding = options.maxPadding,
			ignoreMinPadding, // can be set to true by a column or bar series
			ignoreMaxPadding,
			usePercentage,
			events = options.events,
			eventType,
			//plotBands = options.plotBands || [],
			plotLinesAndBands = [],//options.plotLines || [],
			//plotLineLookup = {},
			tickInterval,
			minorTickInterval,
			magnitude,
			tickPositions, // array containing predefined positions
			ticks = {},
			minorTicks = {},
			tickAmount,
			labelOffset,
			axisTitleMargin,// = options.title.margin,
			dateTimeLabelFormat,
			labelFormatter = options.labels.formatter ||  // can be overwritten by dynamic format
				function() {
					var value = this.value;
					return dateTimeLabelFormat ? dateFormat(dateTimeLabelFormat, value) : value;
				},
			// column plots are always categorized
			categories = options.categories || (isXAxis && chart.columnCount), 
			reversed = options.reversed,
			tickmarkOffset = (categories && options.tickmarkPlacement == 'between') ? 0.5 : 0;		

		
		/**
		 * The Tick prototype
		 */
		function Tick(pos, minor) {
			var tick = this;
			tick.pos = pos;
			tick.minor = minor;
			tick.isNew = true;				
			
			if (!minor) {
				tick.addLabel();
			}
		}
		Tick.prototype = {
			/**
			 * Write the tick label
			 */
			addLabel: function() {
				var pos = this.pos,
					labelOptions = options.labels,
					str,
					withLabel = !((pos == min && !options.showFirstLabel) ||
						(pos == max && !options.showLastLabel));

					label = this.label;
				
				if (label === UNDEFINED) {
					str = labelFormatter.call({
						//index: index, todo: what-to-do?
						isFirst: pos == tickPositions[0],
						isLast: pos == tickPositions[tickPositions.length - 1],
						dateTimeLabelFormat: dateTimeLabelFormat,
						value: (categories && categories[pos] ? categories[pos] : pos)
					});
					this.label = label = 
						defined(str) && withLabel && labelOptions.enabled ?
							renderer.text(
								str,
								0,
								0,
								labelOptions.style, 
								labelOptions.rotation,
								labelOptions.align
							)
							.add(axisGroup):
							null;
				}
			},
			/**
			 * Get the offset height or width of the label
			 */
			getLabelSize: function() {
				var label = this.label;
				return label ? 
					label.getBBox()[horiz ? 'height' : 'width'] :
					0;
			},
			/**
			 * Put everything in place
			 */
			render: function() {
				var tick = this,
					major = !tick.minor,
					label = tick.label,
					pos = tick.pos,
					labelOptions = options.labels,
					gridLine = tick.gridLine,
					gridLineWidth = major ? options.gridLineWidth : options.minorGridLineWidth,
					gridLineColor = major ? options.gridLineColor : options.minorGridLineColor,
					gridLinePath,
					mark = tick.mark,
					markPath,
					tickLength = major ? options.tickLength : options.minorTickLength,
					tickWidth = major ? options.tickWidth : options.minorTickWidth,
					tickColor = major ? options.tickColor : options.minorTickColor,
					x,
					y;
					
				x = horiz ? 
					translate(pos + tickmarkOffset) + transB : 
					plotLeft + offset + (opposite ? plotWidth : 0);
				y = horiz ?
					chartHeight - marginBottom + offset - (opposite ? plotHeight : 0) :
					chartHeight - translate(pos + tickmarkOffset) - transB;
				
				// create the grid line
				if (gridLineWidth) {
					gridLinePath = getPlotLinePath(pos, gridLineWidth);
					
					if (gridLine === UNDEFINED) {
						tick.gridLine = gridLine =
							gridLineWidth ?
								renderer.path(gridLinePath)
									.attr({
										stroke: gridLineColor,
										'stroke-width': gridLineWidth
									}).add(gridGroup) :
								null;
					} 
					if (gridLine) {
						gridLine.animate({
							d: gridLinePath
						});
					}
				}
				
				// create the tick mark
				if (tickWidth) {
					
					// negate the length
					if (options.tickPosition == 'inside') {
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
						x + (horiz ? 0 : tickLength), 
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
				
				// the label is created on init - move it into place
				if (label) { 
					x = x + labelOptions.x - (tickmarkOffset && horiz ? 
						tickmarkOffset * transA * (reversed ? -1 : 1) : 0); 
					y = y + labelOptions.y - (tickmarkOffset && !horiz ? 
						tickmarkOffset * transA * (reversed ? 1 : -1) : 0);
				
					label[tick.isNew ? 'attr' : 'animate']({
						x: x,
						y: y
					});
				}
				
				tick.isNew = false;
			},
			/**
			 * Destructor for the tick prototype
			 */
			destroy: function() {
				var tick = this,
					n;
				for (n in tick) {
					tick[n] && tick[n].destroy && tick[n].destroy();
				}
			}
		};
		
		/**
		 * The object wrapper for plot lines and plot bands
		 * @param {Object} options
		 */
		function PlotLineOrBand(options) {
			var plotLine = this;
			plotLine.options = options;
			plotLine.id = options.id;
			
			plotLine.render()
			return plotLine;
		}
		
		PlotLineOrBand.prototype = {

		/**
		 * Render the plot line or plot band. If it is already existing,
		 * move it.
		 */
		render: function () {
			var plotLine = this,
				options = plotLine.options,
				width = options.width,
				to = options.to,
				toPath,
				from = options.from,
				svgElem = plotLine.svgElem,
				path = [],
				color = options.color,
				zIndex = options.zIndex,
				events = options.events,
				attribs;
			
			// plot line
			if (width) {
				path = getPlotLinePath(options.value, width);
				attribs = {
					stroke: color,
					'stroke-width': width
				};
			}
			
			// plot band
			else if (defined(from) && defined(to)) {
				// keep within plot area
				from = mathMax(from, min);
				to = mathMin(to, max);  
			
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
					path = [];
				}
				attribs = {
					fill: color
				}
			}
			
			// zIndex 
			if (defined(zIndex)) {
				attribs.zIndex = zIndex;
			}
			
			// common for lines and bands
			if (svgElem) {
				svgElem.animate({
					d: path
				});
			} else {
				plotLine.svgElem = svgElem = renderer.path(path)
					.attr(attribs).add();
					
				// events
				if (events) {
					for (var eventType in events) {
						svgElem.on(eventType, function(e) {
							events[eventType].apply(plotLine, [e]);
						});
					}
				}
			}
			
		},
		
		/**
		 * Destroy the element and release memory
		 */
		destroy: function() {
			this.svgElem.destroy();
		}
		};
		
		/*
		function addTick(pos, tickPos, color, width, len, withLabel, index) {
			var x1, y1, x2, y2, str, labelOptions = options.labels,
				markPath;
			
			// negate the length
			if (tickPos == 'inside') {
				len = -len;
			}
			if (opposite) {
				len = -len;
			}
			
			// set the initial positions
			x1 = x2 = translate(pos + tickmarkOffset) + transB;
			y1 = y2 = chartHeight - translate(pos + tickmarkOffset) - transB;
			
			if (horiz) {
				y1 = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;
				y2 = y1 + len;
			} else {
				x1 = plotLeft + (opposite ? plotWidth : 0) + offset;
				x2 = x1 - len;				
			}
			
			if (width) {
				markPath = renderer.crispLine([M, x1, y1, L, x2, y2], width);
				if (tickMarks[pos]) { // updating
					tickMarks[pos].animate({
						d: markPath
					});
				} else { // first time
					tickMarks[pos] = renderer.path(
						markPath
					).attr({
						stroke: color,
						'stroke-width': width
					}).add(axisGroup);
				}
			}
			
			
			// place the label that was pre-rendered to calculate its size
			if (ticks[pos]) {
				
				// record that it's being used
				ticks[pos].isInUse = true; 
						
				x1 = x1 + labelOptions.x - (tickmarkOffset && horiz ? 
					tickmarkOffset * transA * (reversed ? -1 : 1) : 0); 
				y1 = y1 + labelOptions.y - (tickmarkOffset && !horiz ? 
					tickmarkOffset * transA * (reversed ? 1 : -1) : 0);
				
				if (ticks[pos].attr('visibility') == HIDDEN) { // first time shown after getOffset
					setTimeout(function() {
						if (ticks[pos]) {
							ticks[pos].attr({
								x: x1,
								y: y1,
								visibility: VISIBLE
							});
						}
					}, globalAnimation.duration || 500);
					
				} else { // slide into new position
					ticks[pos].animate({
						x: x1,
						y: y1
					});
				}
				
			}
		}
		*/
		
		/**
		 * Get the minimum and maximum for the series of each axis 
		 */
		function getSeriesExtremes() {
			var stack = [],
				run;
				
			// reset dataMin and dataMax in case we're redrawing
			dataMin = dataMax = null;
			
			// get an overview of what series are associated with this axis
			associatedSeries = [];
			
			each(series, function(serie) {
				run = false;
				
				
				// match this axis against the series' given or implicated axis
				each(['xAxis', 'yAxis'], function(strAxis) {
					if (
						// the series is a cartesian type, and...
						serie.isCartesian &&
						// we're in the right x or y dimension, and...
						(strAxis == 'xAxis' && isXAxis || strAxis == 'yAxis' && !isXAxis) && (
							// the axis number is given in the options and matches this axis index, or
							(serie.options[strAxis] == options.index) || 
							// the axis index is not given
							(serie.options[strAxis] === UNDEFINED && options.index === 0)
						)
					) {
						serie[strAxis] = axis;
						associatedSeries.push(serie);
						
						// the series is visible, run the min/max detection
						run = true;		
					}
				});
				// ignore hidden series if opted 
				if (!serie.visible && optionsChart.ignoreHiddenSeries) {
					run = false;
				}				
				
				if (run) {
					
					var stacking,
						typeStack;
		
					if (!isXAxis) {
						stacking = serie.options.stacking;
						usePercentage = stacking == 'percent';
	
						// create a stack for this particular series type
						if (stacking) {
							typeStack = stack[serie.type] || [];
							stack[serie.type] = typeStack;
						}
						if (usePercentage) {
							dataMin = 0;
							dataMax = 99;			
						}
					} 
					if (serie.isCartesian) { // line, column etc. need axes, pie doesn't
						each(serie.data, function(point, i) {
							var pointX = point.x,
								pointY = point.y;
							
							// initial values
							if (dataMin === null) {

								// start out with the first point
								dataMin = dataMax = point[xOrY]; 
							}
		
							// x axis
							if (isXAxis) {
								if (pointX > dataMax) {
									dataMax = pointX;
								} else if (pointX < dataMin) {
									dataMin = pointX;
								}
							}
							
							// y axis
							else if (defined(pointY)) {
								if (stacking) {
									typeStack[pointX] = typeStack[pointX] ? typeStack[pointX] + pointY : pointY;
								}
								
								var stackedPoint = typeStack ? typeStack[pointX] : pointY;
								if (!usePercentage) {
									if (stackedPoint > dataMax) {
										dataMax = stackedPoint;
									} else if (stackedPoint < dataMin) {
										dataMin = stackedPoint;
									}
								}
								if (stacking) {
									stacks[serie.type][pointX] = { 
										total: stackedPoint,
										cum: stackedPoint 
									};
								}
							}
						});
						
							
						// For column, areas and bars, set the minimum automatically to zero
						// and prevent that minPadding is added in setScale
						if (/(area|column|bar)/.test(serie.type) && !isXAxis) {
							if (dataMin >= 0) {
								dataMin = 0;
								ignoreMinPadding = true;
							} else if (dataMax < 0) {
								dataMax = 0;
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
		function translate(val, backwards, cvsCoord) {
			var sign = 1,
				cvsOffset = 0,
				returnValue;
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
				returnValue = val / transA + min; // from chart pixel to value				
			
			} else { // normal translation
				returnValue = sign * (val - min) * transA + cvsOffset; // from value to chart pixel
			}
			
			return returnValue;
		}
		
		/**
		 * Create the path for a plot line that goes from the given value on 
		 * this axis, across the plot to the opposite side
		 * @param {Number} value
		 * @param {Number} lineWidth Used for calculation crisp line
		 */
		function getPlotLinePath(value, lineWidth) {
			var x1, 
				y1, 
				x2, 
				y2,
				translatedValue = translate(value),
				path,
				skip;
				
			x1 = x2 = mathRound(translatedValue + transB);
			y1 = y2 = mathRound(chartHeight - translatedValue - transB);
			if (horiz) { 
				y1 = plotTop;
				y2 = chartHeight - marginBottom;
				if (x1 < plotLeft || x1 > plotLeft + plotWidth) {
					skip = true;
				}
			} else {
				x1 = plotLeft;
				x2 = chartWidth - marginRight;
				if (y1 < plotTop || y1 > plotTop + plotHeight) {
					skip = true;
				}
			}
			return skip ? 
				null : 
				renderer.crispLine([M, x1, y1, L, x2, y2], lineWidth || 0);
		}
		
		/* *
		 * Add a single line across the plot
		 * /
		function drawPlotLine(value, color, width) {
			
			if (width) {
				
				var path = getPlotLinePath(value);
				if (path) {
					path = renderer.crispLine(path, width);
					// todo: remove from array on 
					if (plotLineLookup[value]) {
						plotLineLookup[value].animate({
							d: path
						});
					} else {
						plotLineLookup[value] = renderer.path(path)
							.attr({
								stroke: color,
								'stroke-width': width
							}).add(gridGroup);
					}
				}
				
			}
		}*/
		
		/* *
		 * Add a masked band across the plot
		 * @param {Number} from chart axis value
		 * @param {Number} to chart axis value
		 * @param {String} color
		 * /
		function drawPlotBand(from, to, color) {
			
			var width = (to - from) * transA;
			drawPlotLine(from + (to - from) / 2, color, width);
			
		}*/
		
		
		
		/**
		 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
		 * @param {Number} interval
		 */
		function normalizeTickInterval(interval, multiples) {
			var normalized;
				
			// round to a tenfold of 1, 2, 2.5 or 5
			magnitude = multiples ? 1 : math.pow(10, mathFloor(math.log(interval) / math.LN10));
			normalized = interval / magnitude;
			
			// multiples for a linear scale
			if (!multiples) {
				multiples = [1, 2, 2.5, 5, 10];
				//multiples = [1, 2, 2.5, 4, 5, 7.5, 10];
				
				// the allowDecimals option
				if (options.allowDecimals === false) {
					if (magnitude == 1) {
						multiples = [1, 2, 5, 10];
					} else if (magnitude <= 0.1) {
						multiples = [1 / magnitude];
					}					
				}
			}
			
			// normalize the interval to the nearest multiple
			for (var i = 0; i < multiples.length; i++) {
				interval = multiples[i];
				if (normalized <= (multiples[i] + (multiples[i+1] || multiples[i])) / 2) {
					break;
				}
			}
			
			// multiply back to the correct magnitude
			interval *= magnitude;
			
			return interval;
		}
	
		/**
		 * Set the tick positions to a time unit that makes sense, for example
		 * on the first of each month or on every Monday.
		 */
		function setDateTimeTickPositions() {
			tickPositions = [];
			var i,
				useUTC = defaultOptions.global.useUTC,
				oneSecond = 1000 / timeFactor,
				oneMinute = 60000 / timeFactor,
				oneHour = 3600000 / timeFactor,
				oneDay = 24 * 3600000 / timeFactor,
				oneWeek = 7 * 24 * 3600000 / timeFactor,
				oneMonth = 30 * 24 * 3600000 / timeFactor,
				oneYear = 31556952000 / timeFactor,
			
				units = [[
					'second',						// unit name
					oneSecond,						// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'minute',						// unit name
					oneMinute,						// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'hour',							// unit name
					oneHour,						// fixed incremental unit
					[1, 2, 3, 4, 6, 8, 12]			// allowed multiples
				], [
					'day',							// unit name
					oneDay,							// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'week',							// unit name
					oneWeek,						// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'month',
					oneMonth,
					[1, 2, 3, 4, 6]
				], [
					'year',
					oneYear,
					null
				]],
			
				unit = units[6], // default unit is years
				interval = unit[1], 
				multiples = unit[2];
			
			// loop through the units to find the one that best fits the tickInterval
			for (i = 0; i < units.length; i++)  {
				unit = units[i];
				interval = unit[1];
				multiples = unit[2];
				
				
				if (units[i+1]) {
					// lessThan is in the middle between the highest multiple and the next unit.
					var lessThan = (interval * multiples[multiples.length - 1] + 
								units[i + 1][1]) / 2;
							
					// break and keep the current unit
					if (tickInterval <= lessThan) {
						break;
					}
				}
			}
			
			// prevent 2.5 years intervals, though 25, 250 etc. are allowed
			if (interval == oneYear && tickInterval < 5 * interval) {
				multiples = [1, 2, 5];
			}
	
			// get the minimum value by flooring the date
			var multitude = normalizeTickInterval(tickInterval / interval, multiples),
				minYear, // used in months and years as a basis for Date.UTC()
				minDate = new Date(min * timeFactor);
				
			minDate.setMilliseconds(0);
			
			if (interval >= oneSecond) { // second
				minDate.setSeconds(interval >= oneMinute ? 0 :
					multitude * mathFloor(minDate.getSeconds() / multitude));
			}
	
			if (interval >= oneMinute) { // minute
				minDate[setMinutes](interval >= oneHour ? 0 :
					multitude * mathFloor(minDate[getMinutes]() / multitude));
			}
	
			if (interval >= oneHour) { // hour
				minDate[setHours](interval >= oneDay ? 0 :
					multitude * mathFloor(minDate[getHours]() / multitude));
			}
	
			if (interval >= oneDay) { // day
				minDate[setDate](interval >= oneMonth ? 1 :
					multitude * mathFloor(minDate[getDate]() / multitude));
			}
					
			if (interval >= oneMonth) { // month
				minDate[setMonth](interval >= oneYear ? 0 :
					multitude * mathFloor(minDate[getMonth]() / multitude));
				minYear = minDate[getFullYear]();
			}
			
			if (interval >= oneYear) { // year
				minYear -= minYear % multitude;
				minDate[setFullYear](minYear);
			}
			
			// week is a special case that runs outside the hierarchy
			if (interval == oneWeek) {
				// get start of current week, independent of multitude
				minDate[setDate](minDate[getDate]() - minDate[getDay]() + 
					options.startOfWeek);
			}
			
			
			// get tick positions
			i = 1; // prevent crash just in case
			minYear = minDate[getFullYear]();
			var time = minDate.getTime() / timeFactor,
				minMonth = minDate[getMonth](),
				minDateDate = minDate[getDate]();
				
			// iterate and add tick positions at appropriate values
			while (time < max && i < plotWidth) {
				tickPositions.push(time);
				
				// if the interval is years, use Date.UTC to increase years
				if (interval == oneYear) {
					time = makeTime(minYear + i * multitude, 0) / timeFactor;
				
				// if the interval is months, use Date.UTC to increase months
				} else if (interval == oneMonth) {
					time = makeTime(minYear, minMonth + i * multitude) / timeFactor;
					
				// if we're using global time, the interval is not fixed as it jumps
				// one hour at the DST crossover
				} else if (!useUTC && (interval == oneDay || interval == oneWeek)) {
					time = makeTime(minYear, minMonth, minDateDate + 
						i * multitude * (interval == oneDay ? 1 : 7));
					
				// else, the interval is fixed and we use simple addition
				} else {
					time += interval * multitude;
				}
				
				i++;
			}
			// push the last time
			tickPositions.push(time);
			
			// dynamic label formatter 
			dateTimeLabelFormat = options.dateTimeLabelFormats[unit[0]];
			/*if (!options.labels.formatter) {
				labelFormatter = function() {
					return dateFormat(options.dateTimeLabelFormats[unit[0]], this.value, 1);
				};
			}*/
			
		}
			
		/**
		 * Fix JS round off float errors
		 * @param {Number} num
		 */
		function correctFloat(num) {
			var invMag = (magnitude < 1 ? mathRound(1 / magnitude) : 1) * 10;
			return mathRound(num * invMag) / invMag;
		}
				
		/**
		 * Set the tick positions of a linear axis to round values like whole tens or every five.
		 */
		function setLinearTickPositions() {
			
			var i,
				roundedMin = mathFloor(min / tickInterval) * tickInterval,
				roundedMax = math.ceil(max / tickInterval) * tickInterval;
				
			tickPositions = [];
			
			// populate the intermediate values
			i = correctFloat(roundedMin);
			while (i <= roundedMax) {
				tickPositions.push(i);
				i = correctFloat(i + tickInterval);
			}
				
			// pad categorised axis to nearest half unit
			if (categories) {
				 min -= 0.5;
				 max += 0.5;
			}

			// dynamic label formatter 
			/*if (!labelFormatter) { 
				labelFormatter = function() {
					return this.value;
				};
			}*/
			
		}
		
		/**
		 * Set the tick positions to round values and optionally extend the extremes
		 * to the nearest tick
		 */
		function setTickPositions(secondPass) {

			
			axisLength = horiz ? plotWidth : plotHeight;

			// get tickInterval
			if (categories || min == max) {
				tickInterval = 1;
			} else {
				tickInterval = pick(
						secondPass && tickInterval || null,
						options.tickInterval,
						(max - min) * options.tickPixelInterval / axisLength
					);
			}
			
				
			if (!isDatetimeAxis && !defined(options.tickInterval)) { // linear
				tickInterval = normalizeTickInterval(tickInterval);
			}
			
			// get minorTickInterval
			minorTickInterval = options.minorTickInterval === 'auto' && tickInterval ?
					tickInterval / 5 : options.minorTickInterval;
			

			if (isDatetimeAxis)	{
				setDateTimeTickPositions();
			} else {
				setLinearTickPositions();
			}	
			
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
			
		}
		
		/**
		 * When using multiple axes, adjust the number of ticks to match the highest
		 * number of ticks in that group
		 */ 
		function adjustTickAmount() {
			if (!isDatetimeAxis && !categories) { // only apply to linear scale
				var oldTickAmount = tickAmount,
					calculatedTickAmount = tickPositions.length;
					
				// set the axis-level tickAmount to use below
				tickAmount = maxTicks[xOrY];
				
				if (calculatedTickAmount < tickAmount) {
					while (tickPositions.length < tickAmount) {
						tickPositions.push( correctFloat(
							tickPositions[tickPositions.length - 1] + tickInterval
						));
					}
					transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
					max = tickPositions[tickPositions.length - 1];
				}
				if (defined(oldTickAmount) && tickAmount != oldTickAmount) {
					axis.isDirty = true;	
				}
			}
		}
	
		/**
		 * Set the scale based on data min and max, user set min and max or options
		 * 
		 */
		function setScale() {
			var length, 
				type, 
				i,
				//total,
				oldMin = min,
				oldMax = max,
				maxZoom = options.maxZoom,
				zoomOffset;
				
			// get data extremes if needed
			getSeriesExtremes();
			
			// initial min and max from the extreme data values
			min = pick(userSetMin, options.min, dataMin);
			max = pick(userSetMax, options.max, dataMax);
			
			
			// maxZoom exceeded, just center the selection
			if (max - min < maxZoom) { 
				zoomOffset = (maxZoom - max + min) / 2;
				// if min and max options have been set, don't go beyond it
				min = mathMax(min - zoomOffset, pick(options.min, min - zoomOffset));
				max = mathMin(min + maxZoom, pick(options.max, min + maxZoom));
			}
				
			// pad the values to get clear of the chart's edges
			if (!categories && !usePercentage && defined(min) && defined(max)) {
				length = (max - min) || 1;
				if (!defined(options.min) && !defined(userSetMin) && minPadding && (dataMin < 0 || !ignoreMinPadding)) { 
					min -= length * minPadding; 
				}
				if (!defined(options.max) && !defined(userSetMax)  && maxPadding && (dataMax > 0 || !ignoreMaxPadding)) { 
					max += length * maxPadding;
				}
			}
			
			
			
					
			// get fixed positions based on tickInterval
			setTickPositions();
			
			// the translation factor used in translate function
			transA = axisLength / ((max - min) || 1);
							
			// record the greatest number of ticks for multi axis
			if (!maxTicks) { // first call, or maxTicks have been reset after a zoom operation
				maxTicks = {
					x: 0,
					y: 0
				};
			}
			
			if (!isDatetimeAxis && tickPositions.length > maxTicks[xOrY]) {
				maxTicks[xOrY] = tickPositions.length;
			}
				
			// reset stacks
			if (!isXAxis) {
				for (type in stacks) {
					for (i in stacks[type]) {
						stacks[type][i].cum = stacks[type][i].total;
					}
				}
			}

			// mark as dirty if it is not already set to dirty and extremes have changed
			if (!axis.isDirty) {
				axis.isDirty = (min != oldMin || max != oldMax);
			}
			
		}
		
		/**
		 * Set the extremes and optionally redraw
		 * @param {Number} newMin
		 * @param {Number} newMax
		 * @param {Boolean} redraw
		 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
		 *    configuration
		 * 
		 */
		function setExtremes(newMin, newMax, redraw, animation) {
			
			globalAnimation = animation;
			redraw = pick(redraw, true); // defaults to true
				
			fireEvent(axis, 'setExtremes', { // fire an event to enable syncing of multiple charts
				min: newMin,
				max: newMax
			}, function() { // the default event handler
				// make sure categorized axes are not exceeded
				if (categories) {
					if (newMin < 0) {
						newMin = 0;
					}
					if (newMax > categories.length - 1) {
						newMax = categories.length - 1;
					}
				}
				
				userSetMin = newMin;
				userSetMax = newMax;
			
				
				// redraw
				if (redraw) {
					chart.redraw();
				}
			});
			
		}
		
		/**
		 * Get the actual axis extremes
		 */
		function getExtremes() {
			return {
				min: min,
				max: max,
				dataMin: dataMin,
				dataMax: dataMax
			};
		}
		
		/**
		 * Get the zero plane either based on zero or on the min or max value.
		 * Used in bar and area plots
		 */
		function getThreshold(threshold) {
			if (min > threshold) {
				threshold = min;
			} else if (max < threshold) {
				threshold = max;
			}
			
			return translate(threshold, 0, 1);
		}
		
		/**
		 * Add a plot band or plot line after render time
		 * 
		 * @param options {Object} The plotBand or plotLine configuration object
		 */
		function addPlotBandOrLine(options) {
			plotLinesAndBands.push(new PlotLineOrBand(options));
			
			
			
			/*if (isLine) {
				drawPlotLine(item.value, item.color, item.width);
			} else {
				drawPlotBand(item.from, item.to, item.color);
			}*/			
		}
		
		/**
		 * Render the tick labels to a preliminary position to get their sizes
		 */
		function getOffset() {
			var tickmarkPos,
				hasData = associatedSeries.length && defined(min) && defined(max),
				titleOffset = 0,
				titleMargin = 0,
				axisTitleOptions = options.title,
				labelOptions = options.labels,
				directionFactor = [-1, 1, 1, -1][side];
			
			if (!axisGroup) {
				axisGroup = renderer.g('axis')
					.attr({ zIndex: 7 })
					.add();
				gridGroup = renderer.g('grid')
					.attr({ zIndex: 1 })
					.add();
			} /*else {
				// clear the axis layers before new grid and ticks are drawn
				axisGroup.empty();
				gridGroup.empty();
			}*/
			
			
			labelOffset = 0; // reset
			if (hasData) {
				each(tickPositions, function(pos) {
					
					if (!ticks[pos]) {
						ticks[pos] = new Tick(pos);
					}
					
					// left side must be align: right and right side must have align: left for labels
					if (side == 0 || side == 2 || { 1: 'left', 3: 'right' }[side] == labelOptions.align) {
						
						// get the highest offset
						labelOffset = mathMax(
							ticks[pos].getLabelSize(),
							labelOffset
						);
					}
				});
			
			} else { // doesn't have data
				for (var n in ticks) {
					ticks[n].destroy();
					delete ticks[n];
				}
			}
			
			if (axisTitleOptions && axisTitleOptions.text) {
				if (!axis.axisTitle) {
					axis.titleGroup = renderer.g()// todo: try without groups
						.attr({ zIndex: 7 })
						.add();
					axis.axisTitle = renderer.text(
						axisTitleOptions.text,
						0,
						0,
						axisTitleOptions.style, 
						axisTitleOptions.rotation || 0,
						{ low: 'left', middle: 'center', high: 'right' }[axisTitleOptions.align]
					)
					.add(axis.titleGroup);
				}
				
				titleOffset = axis.titleGroup.getBBox()[horiz ? 'height' : 'width'];
				titleMargin = pick(axisTitleOptions.margin, horiz ? 0 : 10);
			}
			
			// handle automatic or user set offset
			offset = directionFactor * (options.offset || axisOffset[side]);
			
			axisTitleMargin = 
				labelOffset +
				(side != 2 && labelOffset && directionFactor * options.labels[horiz ? 'y' : 'x']) + 
				titleMargin;
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
				alternateGridColor = options.alternateGridColor,
				minorTickWidth = options.minorTickWidth,
				lineWidth = options.lineWidth,
				lineLeft,
				lineTop,
				linePath,
				tickmarkPos,
				hasRendered = chart.hasRendered,
				hasData = associatedSeries.length && defined(min) && defined(max); // defined above - check for ticks.length instead?
			
			// update metrics - todo: try to avoid setting these twice, update after getMargins
			axisLength = horiz ? plotWidth : plotHeight;
			transA = axisLength / ((max - min) || 1);
			transB = horiz ? plotLeft : marginBottom; // translation addend
			
			// If the series has data draw the ticks. Else only the line and title
			if (hasData) {
				// alternate grid color
				if (alternateGridColor) {
					each(tickPositions, function(pos, i) {
						if (i % 2 === 0 && pos < max) {
							drawPlotBand(
								pos, 
								tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : max, 
								alternateGridColor
							);
						}
					});
				}
				
				// custom plot bands (behind grid lines)
				if (!hasRendered) { // only first time
					each (options.plotBands || [], function(plotBandOptions) {
						plotLinesAndBands.push(new PlotLineOrBand(plotBandOptions));
					});
				}
				
				
				// minor ticks and grid lines
				if (minorTickInterval && !categories) {
					for (var pos = min; pos <= max; pos += minorTickInterval) {
						/*drawPlotLine(i, options.minorGridLineColor, options.minorGridLineWidth);
						if (minorTickWidth) {
							addTick(
								i, 
								options.minorTickPosition, 
								options.minorTickColor, 
								minorTickWidth, 
								options.minorTickLength
							);
						}*/
						if (!minorTicks[pos]) {
							minorTicks[pos] = new Tick(pos, true);
						}
						minorTicks[pos].isActive = true;
						minorTicks[pos].render();
					}
				}
				
				// major ticks, grid lines and tick marks
				each(tickPositions, function(pos) {
					//if (ticks[pos]) {
					ticks[pos].isActive = true;
					if (globalAnimation && ticks[pos].isNew) {
						setTimeout(function() {
							ticks[pos] && ticks[pos].render();
						}, globalAnimation.duration || 500);
					} else {
						ticks[pos].render();
					}
					//} else console.error('ticks[pos] not defined');
				});
				
				
				
				// remove old plot lines 
				// todo: removeUnused function?
				/*for (var pos in plotLineLookup) {
					if (!plotLineLookup[pos].isInUse) {
						plotLineLookup[pos].destroy();
						delete plotLineLookup[pos];
					} else {
						plotLineLookup[pos].isInUse = false; // reset
					}
				}*/
				
				// remove inactive ticks
				each([ticks, minorTicks], function(coll) {
				for (var pos in coll) {
					if (!coll[pos].isActive) {
						coll[pos].destroy();
						delete coll[pos];
					} else {
						coll[pos].isActive = false; // reset
					}
				}
				});
			
				
				// custom plot lines (in front of grid lines)
				if (!hasRendered) { // only first time
					each (options.plotLines || [], function(plotLineOptions) {
						plotLinesAndBands.push(new PlotLineOrBand(plotLineOptions));
					});
				}
				
				
			
			} // end if hasData
			
			
			// Static items. As the axis group is cleared on subsequent calls
			// to render, these items are added outside the group.	
			// axis line
			if (lineWidth) {
				lineLeft = plotLeft + (opposite ? plotWidth : 0) + offset;
				lineTop = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;
				
				linePath = renderer.crispLine([
						M,
						horiz ? 
							plotLeft: 
							lineLeft,
						horiz ? 
							lineTop: 
							plotTop,
						L, 
						horiz ? 
							chartWidth - marginRight : 
							lineLeft,
						horiz ? 
							lineTop:
							chartHeight - marginBottom
					], lineWidth);
				if (!axisLine) {
					axisLine = renderer.path(linePath).
						attr({ 
							stroke: options.lineColor, 
							'stroke-width': lineWidth,
							zIndex: 7
						}).
						add();
				} else {
					axisLine.animate({ d: linePath });
				}
					
			}
			
			// Place the title. 
			if (axis.titleGroup) {
				// compute anchor points for each of the title align options
				var margin = horiz ? plotLeft : plotTop,
					fontSize = parseInt(axisTitleOptions.style.fontSize || 12, 10),
				// the position in the length direction of the axis
				alongAxis = { 
					low: margin + (horiz ? 0 : axisLength), 
					middle: margin + axisLength / 2, 
					high: margin + (horiz ? axisLength : 0)
				}[axisTitleOptions.align],
				
				// the position in the perpendicular direction of the axis
				// todo: reuse positions calculated in getOffset
				offAxis = (horiz ? plotTop + plotHeight : plotLeft) +
					(horiz ? 1 : -1) * // horizontal axis reverses the margin
					(opposite ? -1 : 1) * // so does opposite axes
					axisTitleMargin -
					(isIE ? fontSize / 3 : 0)+ // preliminary fix for vml's centerline
					(side == 2 ? fontSize : 0);
				
				axis.titleGroup.animate({
					translateX: horiz ? 
						alongAxis: 
						offAxis + (opposite ? plotWidth : 0) + offset, // x
					translateY: horiz ? 
						offAxis - (opposite ? plotHeight : 0) + offset: 
						alongAxis // y
				});
				
			}
			
			axis.isDirty = false;
		}
		
		/**
		 * Remove a plot band or plot line from the chart by id
		 * @param {Object} id
		 */
		function removePlotBandOrLine(id) {
			for (var i = 0; i < plotLinesAndBands.length; i++) {
				if (plotLinesAndBands[i].id == id) {
					plotLinesAndBands[i].destroy();
					plotLinesAndBands.splice(i, 1);
					break;
				}
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
			each(plotLinesAndBands, function(plotLine) {
				plotLine.render();
			});
			
			// mark associated series as dirty and ready for redraw
			each (associatedSeries, function(series) {
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
				axis.categories = categories = newCategories;
				
				// force reindexing tooltips
				each (associatedSeries, function(series) {
					series.translate();
					series.setTooltipPoints(true);
				});
				
				
				// optionally redraw
				axis.isDirty = true;
				if (pick(doRedraw, true)) {
					redraw();  // redraw axis
				}
		}
		
		
		
		// Run Axis
			
		// inverted charts have reversed xAxes as default
		if (inverted && isXAxis && reversed === UNDEFINED) {
			reversed = true;
		}
			
		// negate offset
		/*if (!opposite) {
			offset *= -1;
		}
		if (horiz) {
			offset *= -1;
		}*/
			
		// expose some variables
		extend (axis, {
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
			setCategories: setCategories,
			setExtremes: setExtremes,
			setScale: setScale,
			setTickPositions: setTickPositions,
			translate: translate,
			redraw: redraw,
			removePlotBand: removePlotBandOrLine,
			removePlotLine: removePlotBandOrLine,
			reversed: reversed,
			stacks: stacks
		});
		
		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}
		
		// set min and max
		setScale();
			
	
	} // end Axis
	
	
	/**
	 * The toolbar object
	 * 
	 * @param {Object} chart 
	 */
	function Toolbar(chart) {
		var buttons = {};
		
		function add(id, text, title, fn) {
			if (!buttons[id]) {
				var button = renderer.text(
					text,
					0,
					0,
					options.toolbar.itemStyle,
					0,
					'right'
				)
				.align({
					align: 'right',
					x: - marginRight - 20,
					y: plotTop + 30
				})
				.on('click', fn)
				.attr({ zIndex: 20 })
				.add();
				buttons[id] = button;
			}
		}
		function remove(id) {
			discardElement(buttons[id].element);
			buttons[id] = null;
		}
		
		// public
		return {
			add: add,
			remove: remove
		};
	}
	
	/**
	 * The tooltip object
	 * @param {Object} options Tooltip options
	 */
	function Tooltip (options) {
		var currentSeries,
			borderWidth = options.borderWidth,
			style = options.style,
			shared = options.shared,
			padding = parseInt(style.padding, 10),
			boxOffLeft = borderWidth + padding, // off left/top position as IE can't 
				//properly handle negative positioned shapes
			tooltipIsHidden = true,
			crosshairsX,
			crosshairsY,
			boxWidth,
			boxHeight,
			currentX = 0,			
			currentY = 0;
			
		
		// remove padding CSS and apply padding on box instead
		style.padding = 0;
		
		// create the elements
		var group = renderer.g('tooltip')
			.attr({ zIndex: 8 })
			.add(),
			
			box = renderer.rect(boxOffLeft, boxOffLeft, 0, 0, options.borderRadius, borderWidth).
				attr({
					fill: options.backgroundColor,
					'stroke-width': borderWidth
				}).
				add(group).
				shadow(options.shadow),
			label = renderer.text('', padding + boxOffLeft, parseInt(style.fontSize, 10) + padding + boxOffLeft).
				attr({ zIndex: 1 }).
				css(style).
				add(group);
				
		/**
		 * Provide a soft movement for the tooltip
		 * 
		 * @param {Number} finalX
		 * @param {Number} finalY 
		 */
		function move(finalX, finalY) {

			currentX = tooltipIsHidden ? finalX : (2 * currentX + finalX) / 3;
			currentY = tooltipIsHidden ? finalY : (currentY + finalY) / 2;
			
			group.translate(currentX, currentY);
			
			
			// run on next tick of the mouse tracker
			if (mathAbs(finalX - currentX) > 1 || mathAbs(finalY - currentY) > 1) {
				tooltipTick = function() {
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

			tooltipIsHidden = true;
			group.hide();
		}
		
		/**
		 * Refresh the tooltip's text and position. 
		 * @param {Object} point
		 * 
		 */
		function refresh(point) {
			var borderColor = options.borderColor || point.color || series.color || '#606060',
				x,
				y,
				boxX,
				boxY,
				show,
				bBox,
				plotX,
				plotY = 0,
				textConfig = {},
				pointConfig = [],
				tooltipPos = point.tooltipPos,
				getConfig = function(point) {
					return {
						series: point.series,
						point: point,
						x: point.category, 
						y: point.y,
						percentage: point.percentage,
						total: point.total || point.stackTotal
					}
				};
				
			// shared tooltip, array is sent over
			if (shared) { 
				each (point, function(item, i) {
					var series = item.series,
						hoverPoint = series.hoverPoint;
					hoverPoint && hoverPoint.setState();
					series.hoverPoint = item;
					item.setState(HOVER_STATE);
					plotY += item.plotY; // for average
					
					pointConfig.push(getConfig(item));
				});
				plotX = point[0].plotX;
				plotY /= point.length;
				
				textConfig = {
					x: point[0].category
				}
				textConfig.points = pointConfig;
				point = point[0];
				
			// single point tooltip
			} else {
				textConfig = getConfig(point);
			}
			text = options.formatter.call(textConfig);
			
			// register the current series
			currentSeries = point.series;
			
			// get the reference point coordinates (pie charts use tooltipPos)
			plotX = shared ? plotX : point.plotX;
			plotY = shared ? plotY : point.plotY;
			x = tooltipPos ? tooltipPos[0] : (inverted ? plotWidth - plotY : plotX);
			y = tooltipPos ? tooltipPos[1] : (inverted ? plotHeight - plotX : plotY);
				
				
			// hide tooltip if the point falls outside the plot
			show = isInsidePlot(x, y);
			
			// update the inner HTML
			if (text === false || !show) { 
				hide();
			} else {
				
			    // show it
				if (tooltipIsHidden) {
					group.show();
					tooltipIsHidden = false;
				}
				
				// update text
				label.attr({
					text: text
				});
				
				// get the bounding box
				bBox = label.getBBox();
				boxWidth = bBox.width;
				boxHeight = bBox.height;
				
				// set the size of the box
				box.attr({
					width: boxWidth + 2 * padding,
					height: boxHeight + 2 * padding,
					stroke: borderColor
				});
				
				// keep the box within the chart area
				boxX = x - boxWidth + plotLeft - 25;
				boxY = y - boxHeight + plotTop + 10;
				
				// it is too far to the left, adjust it
				if (boxX < 7) {
					boxX = 7;
					boxY -= 20;
				}
				
				
				if (boxY < 5) {
					boxY = 5; // above
				} else if (boxY + boxHeight > chartHeight) { 
					boxY = chartHeight - boxHeight - 5; // below
				}
				
				// do the move
				move(mathRound(boxX - boxOffLeft), mathRound(boxY - boxOffLeft));
				
				
			}
			
			
			// crosshairs
			if (options.crosshairs) {
				var crossPathX = point.series.xAxis.getPlotLinePath(point.x, 1);
				if (crosshairsX) {
					crosshairsX.attr({ d: crossPathX });
				
				} else {
					crosshairsX = renderer.path(crossPathX)
						.attr({
							'stroke-width': 1,
							stroke: '#606060'
						})
						.add();
				}				
			}		
		}
		

		
		// public members
		return {
			shared: shared,
			refresh: refresh,
			hide: hide
		};	
	}
	
	/**
	 * The mouse tracker object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function MouseTracker (chart, options) {

		
		var mouseDownX, 
			mouseDownY,
			hasDragged,
			selectionMarker,
			zoomType = optionsChart.zoomType,
			zoomX = /x/.test(zoomType),
			zoomY = /y/.test(zoomType),
			zoomHor = zoomX && !inverted || zoomY && inverted,
			zoomVert = zoomY && !inverted || zoomX && inverted;
			
		/**
		 * Add IE support for pageX and pageY
		 * @param {Object} e The event object in standard browsers
		 */
		function normalizeMouseEvent(e) {
			
			// common IE normalizing
			e = e || win.event;
			if (!e.target) {
				e.target = e.srcElement;
			}
			
			// in certain cases, get mouse position
			if (e.type != 'mousemove' || win.opera) { // only Opera needs position on mouse move, see below
				position = getPosition(container);
			}

			// layerX and layerY
			if (e.layerX === UNDEFINED) { // Firefox and WebKit have layerX
				if (isIE) { // IE
					e.layerX = e.x;
					e.layerY = e.y;
				} else { // Opera has no equivalent of layerX, see above
					e.layerX = e.pageX - position.x;
					e.layerY = e.pageY - position.y;
				}
			}
			
			return e;
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
			each (axes, function(axis, i) {
				var translate = axis.translate,
					isXAxis = axis.isXAxis,
					isHorizontal = inverted ? !isXAxis : isXAxis;
					
				coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
					axis: axis,
					value: translate(
						isHorizontal ? 
							e.layerX - plotLeft  : 
							plotHeight - e.layerY + plotTop ,
						true
					)								
				});
			});
			return coordinates;
		}
		
		/**
		 * With line type charts with a single tracker, get the point closest to the mouse
		 */
		function onmousemove (e) {
			var point,
				points,
				hoverPoint = chart.hoverPoint,
				hoverSeries = chart.hoverSeries,
				i,
				j,
				distance = chartWidth,
				index = inverted ? e.layerY : e.layerX - plotLeft // wtf?;
				
			// common tooltip
			if (options.shared) {
				points = [];
				
				// loop over all series and find the ones with points nearest to the mouse
				i = series.length;
				for (j = 0; j < i; j++) {
					if (series[j].visible) {
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
				if (points.length && points[0].plotX != hoverX) {
					tooltip.refresh(points);
					hoverX = points[0].plotX;
				}
			}
				
			// separate tooltip and general mouse events
			if (hoverSeries && hoverSeries.tracker) { // only use for line-type series with common tracker
		
				// get the point
				point = hoverSeries.tooltipPoints[index];
				
				// a new point is hovered, refresh the tooltip
				if (point && point != hoverPoint) {
					
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
			}
			
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
					each (axes, function(axis, i) {
						var translate = axis.translate,
							isXAxis = axis.isXAxis,
							isHorizontal = inverted ? !isXAxis : isXAxis,
							selectionMin = translate(
								isHorizontal ? 
									selectionLeft : 
									plotHeight - selectionTop - selectionBox.height, 
								true
							),
							selectionMax = translate(
								isHorizontal ? 
									selectionLeft + selectionBox.width : 
									plotHeight - selectionTop, 
								true
							);
								
							selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
								axis: axis,
								min: mathMin(selectionMin, selectionMax), // for reversed axes
								max: mathMax(selectionMin, selectionMax)
							});
							
						});
					fireEvent(chart, 'selection', selectionData, zoom);

				}
				selectionMarker = selectionMarker.destroy();
			}
			
			chart.mouseIsDown = mouseIsDown = hasDragged = false;

		}
		
		/**
		 * Set the JS events on the container element
		 */
		function setDOMEvents () {
			var lastWasOutsidePlot = true;
			
			container.onmousedown = function(e) {
				e = normalizeMouseEvent(e);
				
				// record the start position
				if (e.preventDefault) {
					e.preventDefault();
				}
				chart.mouseIsDown = mouseIsDown = true;
				mouseDownX = e.layerX;
				mouseDownY = e.layerY;
					
				
				// make a selection
				if (hasCartesianSeries && (zoomX || zoomY)) {
					if (!selectionMarker) {
						selectionMarker = renderer.rect(
							plotLeft,
							plotTop,
							zoomHor ? 1 : plotWidth,
							zoomVert ? 1 : plotHeight,
							0
						)
						.attr({
							fill: 'rgba(69,114,167,0.25)',
							zIndex: 7
						})
						.add();
					}
				}
				
			};
						
			// Use native browser event for this one. It's faster, and MooTools
			// doesn't use clientX and clientY.
			container.onmousemove = function(e) {
				e = normalizeMouseEvent(e);
				e.returnValue = false;
				
				var layerX = e.layerX,
					layerY = e.layerY,
					isOutsidePlot = !isInsidePlot(layerX - plotLeft, layerY - plotTop);
				
				if (mouseIsDown) { // make selection
					
					// determine if the mouse has moved more than 10px
					hasDragged = Math.sqrt(
						Math.pow(mouseDownX - layerX, 2) + 
						Math.pow(mouseDownY - layerY, 2)
					) > 10;
					
					
					// adjust the width of the selection marker
					if (zoomHor) {
						var xSize = layerX - mouseDownX;
						selectionMarker.attr({
							width: mathAbs(xSize),
							x: (xSize > 0 ? 0 : xSize) + mouseDownX
						});
					}
					// adjust the height of the selection marker
					if (zoomVert) {
						var ySize = layerY - mouseDownY;
						selectionMarker.attr({
							height: mathAbs(ySize),
							y: (ySize > 0 ? 0 : ySize) + mouseDownY
						});
					}
					
					
					
					
				} else if (!isOutsidePlot) {
					// show the tooltip
					onmousemove(e);
				}
				
				// cancel on mouse outside
				if (isOutsidePlot && !lastWasOutsidePlot) {
					// reset the tracker					
					resetTracker();
					
					// drop the selection if any and reset mouseIsDown and hasDragged
					drop();
				}	
				
				lastWasOutsidePlot = isOutsidePlot;
				return false;
			};
			
			container.onmouseup = function(e) {
				drop();
			};
			
			
			
			// MooTools 1.2.3 doesn't fire this in IE when using addEvent
			container.onclick = function(e) {
				var hoverPoint = chart.hoverPoint;
				e = normalizeMouseEvent(e);
				 
				e.cancelBubble = true; // IE specific
				
				
				if (!hasDragged) {
					if (hoverPoint && attr(e.target, 'isTracker')) {
						var plotX = hoverPoint.plotX,
							plotY = hoverPoint.plotY;
							
						// add page position info
						extend(hoverPoint, {
							pageX: position.x + plotLeft + 
								(inverted ? plotWidth - plotY : plotX),
							pageY: position.y + plotTop + 
								(inverted ? plotHeight - plotX : plotY)
						});
						
						// the series click event
						fireEvent(chart.hoverSeries, 'click', extend(e, {
							point: hoverPoint
						}));
						
						// the point click event
						hoverPoint.firePointEvent('click', e);
					
					} else { 
						extend (e, getMouseCoordinates(e));
						
						// fire a click event in the chart
						if (isInsidePlot(e.layerX - plotLeft, e.layerY - plotTop)) {
							fireEvent(chart, 'click', e);
						}
					}
					
					
				}
				// reset mouseIsDown and hasDragged
				hasDragged = false;
			};
		}
		
		/**
		 * Create the image map that listens for mouseovers
		 */
		placeTrackerGroup = function() {
			
			// first create - plot positions is not final at this stage
			if (!trackerGroup) {
				chart.trackerGroup = trackerGroup = renderer.g('tracker')
					.attr({ zIndex: 9 })
					.add();
			
			// then position - this happens on load and after resizing and changing
			// axis or box positions
			} else {				
				trackerGroup.translate(plotLeft, plotTop);
				if (inverted) {
					trackerGroup.attr({
						width: chart.plotWidth,
						height: chart.plotHeight
					}).invert();
				}
			}			
		}
		
		
		// Run MouseTracker
		placeTrackerGroup();
		if (options.enabled) {
			chart.tooltip = tooltip = Tooltip(options);
		}
		
		setDOMEvents();
		
		// set the fixed interval ticking for the smooth tooltip
		tooltipInterval = setInterval(function() {
			if (tooltipTick) {
				tooltipTick();
			}
		}, 32);
		
		// expose properties
		extend (this, {
			zoomX: zoomX,
			zoomY: zoomY,
			resetTracker: resetTracker
		});
	}
	
	
	
	/**
	 * The overview of the chart's series
	 * @param {Object} chart
	 */
	var Legend = function(chart) {

		var options = chart.options.legend;
			
		if (!options.enabled) {
			return;
		}
		
		var horizontal = options.layout == 'horizontal',
			symbolWidth = options.symbolWidth,
			symbolPadding = options.symbolPadding,
			allItems = [],
			style = options.style,
			itemStyle = options.itemStyle,
			itemHoverStyle = options.itemHoverStyle,
			itemHiddenStyle = options.itemHiddenStyle,
			padding = parseInt(style.padding, 10),
			rightPadding = 20,
			lineHeight = options.lineHeight || 16,
			y = 18,
			initialItemX = 4 + padding + symbolWidth + symbolPadding,
			itemX,
			itemY,
			lastItemY,
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
				legendItem.attr({ fill: textColor });
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
		function positionItem(item, itemX, itemY) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendSymbol = item.legendSymbol,
				checkbox = item.checkbox;
			if (legendItem) {
				legendItem.attr({ 
					x: itemX,
					y: itemY
				});
			}
			if (legendLine) {
				legendLine.translate(itemX, itemY - 4);
			}
			if (legendSymbol) {
				legendSymbol
					.translate(itemX, itemY);
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
			var i = allItems.length,				
				checkbox = item.checkbox;
				
			// pull out from the array
			while (i--) {
				if (allItems[i] == item) {
					allItems.splice(i, 1);
					break;
				}
			}
				
			// destroy SVG elements
			each (['legendItem', 'legendLine', 'legendSymbol'], function(key) {
				if (item[key]) {
					item[key].destroy();
				}
			});
			
			if (checkbox) {
				discardElement(item.checkbox);
			}
			
			
		}
		
		
		
		/**
		 * Render a single specific legend item
		 * @param {Object} item A series or point
		 */
		function renderItem(item) {
			var	bBox,
				itemWidth,
				legendSymbol,
				simpleSymbol,
				li = item.legendItem,
				series = item.series || item;
				
			
			if (!li) { // generate it once, later move it
			
				// let these series types use a simple symbol
				simpleSymbol = /^(bar|pie|area|column)$/.test(series.type);
				
				// generate the list item text
				item.legendItem = li = renderer.text(
						options.labelFormatter.call(item),
						0, 
						0
					)
					.css(itemStyle)
					.on('mouseover', function() {
						item.setState(HOVER_STATE);
						li.css(itemHoverStyle);
					})
					.on('mouseout', function() {
						li.css(item.visible ? itemStyle : itemHiddenStyle);
						item.setState();
					})
					.on('click', function(event) {
						var strLegendItemClick = 'legendItemClick',
							fnLegendItemClick = function() {
								item.setVisible();
							};
						
						// click the name or symbol
						if (item.firePointEvent) { // point
							item.firePointEvent (strLegendItemClick, null, fnLegendItemClick);
						} else {
							fireEvent (item, strLegendItemClick, null, fnLegendItemClick);
						}
					})
					.attr({ zIndex: 2 })
					.add(legendGroup);
				
				// draw the line
				if (!simpleSymbol && item.options && item.options.lineWidth) {
					item.legendLine = renderer.path([
						M,
						-symbolWidth - symbolPadding, 
						0,
						L, 
						-symbolPadding, 
						0
					]).attr({
						//stroke: color,
						'stroke-width': item.options.lineWidth,
						zIndex: 2
					}).
					add(legendGroup);
				}
					
				// draw a simple symbol
				if (simpleSymbol) { // bar|pie|area|column
					//legendLayer.drawRect(
					legendSymbol = renderer.rect(
						-symbolWidth - symbolPadding,
						-11,
						symbolWidth,
						12,
						2
					).attr({
						'stroke-width': 0,
						zIndex: 3
					}).add(legendGroup);
				}
					
				// draw the marker
				else if (item.options && item.options.marker && item.options.marker.enabled) {
					legendSymbol = renderer.symbol(
						item.symbol,
						-symbolWidth / 2 - symbolPadding, 
						-4, 
						item.options.marker.radius
					)
					.attr(item.pointAttr[NORMAL_STATE])
					.attr({ zIndex: 3 })
					.add(legendGroup);
				}
				item.legendSymbol = legendSymbol;
					
				// colorize the items
				colorizeItem(item, item.visible);
				
				
				// add the HTML checkbox on top
				if (item.options && item.options.showCheckbox) {
					item.checkbox = createElement('input', {
						type: 'checkbox',
						checked: item.selected,
						defaultChecked: item.selected // required by IE7						
					}, options.itemCheckboxStyle, container);
					
					addEvent(item.checkbox, 'click', function(event) {
						var target = event.target;
						fireEvent (item, 'checkboxClick', { 
								checked: target.checked 
							}, 
							function() {
								item.select();
							}
						);
					});
				}
			}
			
			
			
			// position the newly generated or reordered items
			positionItem(item, itemX, itemY);
			
			// calculate the positions for the next line
			bBox = li.getBBox();
			lastItemY = itemY;
			
			item.legendItemWidth = itemWidth = 
				options.itemWidth || symbolWidth + symbolPadding + bBox.width + rightPadding;
			if (horizontal) {
				itemX += itemWidth;
				offsetWidth = widthOption || mathMax(itemX - initialItemX, offsetWidth);
			
				if (itemX - initialItemX + itemWidth > 
						(widthOption || (chartWidth - 2 * padding - initialItemX))) { // new line
					itemX = initialItemX;
					itemY += lineHeight;
				}
				
			} else {
				itemY += lineHeight;
				// the width of the widest item
				offsetWidth = widthOption || mathMax(itemWidth, offsetWidth);			
			}		
			
			// add it all to an array to use below
			allItems.push(item);
		}

		/**
		 * Render the legend. This method can be called both before and after
		 * chart.render. If called after, it will only rearrange items instead
		 * of creating new ones.
		 */
		function renderLegend() {
			itemX = initialItemX;
			itemY = y;
			offsetWidth = 0;
			lastItemY = 0;
			
			if (!legendGroup) {
				legendGroup = renderer.g('legend')
					.attr({ zIndex: 7 })
					.add();
			}
			
			
			// add HTML for each series
			if (reversedLegend) {
				series.reverse();
			}
			each(series, function(serie) {
				if (!serie.options.showInLegend) {
					return;
				}
				
				// use points or series for the legend item depending on legendType
				var items = (serie.options.legendType == 'point') ?
					serie.data : [serie];
						
				// render all items
				each(items, renderItem);
			});
			if (reversedLegend) { // restore
				series.reverse();
			}
			
			
			
			// Draw the border
			legendWidth = widthOption || offsetWidth;
			legendHeight = lastItemY - y + lineHeight;
			
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
				
				} else {
					box.animate({
						width: legendWidth,
						height: legendHeight
					});
				}
			}
			
			// 1.x compatibility: positioning based on style
			var props = ['left', 'right', 'top', 'bottom'],
				prop,
				i = 4;
			while(i--) {
				prop = props[i];
				if (style[prop] && style[prop] != 'auto') {
					options[i < 2 ? 'align' : 'verticalAlign'] = prop;
					options[i < 2 ? 'x' : 'y'] = parseInt(style[prop], 10) * (i % 2 ? -1 : 1);
				}
			}

			
			/*var boxPos = renderer.getAlignment(options);
			legendGroup.translate(boxPos.x, boxPos.y);*/
			legendGroup.align(extend(options, {
				width: legendWidth,
				height: legendHeight
			}), true);
			
			// Position the checkboxes after the width is determined 
			each(allItems, function(item) {
				var checkbox = item.checkbox;
				if (checkbox) {
					css(checkbox, {
						left: (legendGroup.attr('translateX') + item.legendItemWidth + checkbox.x - 40) +PX,
						top: (legendGroup.attr('translateY') + checkbox.y - 11) + PX 
					});
				}
			});
			
		}
		
		// run legend
		renderLegend();
		
		// expose 
		return {
			colorizeItem: colorizeItem,
			destroyItem: destroyItem,
			renderLegend: renderLegend
		};
	};
	
	
	
		
	

	/** 
	 * Initialize an individual series, called internally before render time
	 */
	function initSeries(options) {
		var type = options.type || optionsChart.defaultSeriesType,
			typeClass = seriesTypes[type],
			serie,
			hasRendered = chart.hasRendered;
			
		// an inverted chart can't take a column series and vice versa
		if (hasRendered) {
			if (inverted && type == 'column') {
				typeClass = seriesTypes.bar;
			} else if (!inverted && type == 'bar') {
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
		
		globalAnimation = animation;
		redraw = pick(redraw, true); // defaults to true
		
		fireEvent(chart, 'addSeries', { options: options }, function() {
			series = initSeries(options);
			series.isDirty = true;
			
			chart.isDirtyLegend = true; // the series array is out of sync with the display
			if (redraw) {
				chart.redraw();
			}
		});
		
		return series;
	}
	
	/**
	 * Check whether a given point is within the plot area
	 * 
	 * @param {Number} x Pixel x relative to the coordinateSystem
	 * @param {Number} y Pixel y relative to the coordinateSystem
	 */
	isInsidePlot = function(x, y) {
		var left = 0,
			top = 0;
		return x >= left &&
			x <= left + plotWidth &&
			y >= top &&
			y <= top + plotHeight;
	};
		
	/**
	 * Adjust all axes tick amounts
	 */
	function adjustTickAmounts() {
		if (optionsChart.alignTicks !== false) {
			each (axes, function(axis) {
				axis.adjustTickAmount();
			});
		}
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
			isDirtyBox = chart.isDirtyBox,
			seriesLength = series.length,
			i = seriesLength,
			serie;
			
		globalAnimation = pick(animation, globalAnimation);
		
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
		each (series, function(serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				serie.cleanData();
				serie.getSegments();
				
				if (serie.options.legendType == 'point') {
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
				each (axes, function(axis) {
					axis.setScale();
				});
			}
			adjustTickAmounts();
			getMargins();
	
			// redraw axes
			each (axes, function(axis) {
				if (axis.isDirty || isDirtyBox) { axis.redraw(); }
			});
		}
		
		// the plot areas size has changed
		if (isDirtyBox) {
			drawChartBox();
			placeTrackerGroup();
		}
		
		// redraw affected series
		each (series, function(serie) {
			if (serie.isDirty && serie.visible) { 
				serie.redraw();
			}
		});
		
		
		// hide tooltip and hover states
		if (tracker && tracker.resetTracker) {
			tracker.resetTracker();
		}
		
		
		
		// fire the event
		fireEvent(chart, 'redraw');
	}
	
	
	
	/**
	 * Dim the chart and show a loading text or symbol
	 */
	function showLoading() {
		var loadingOptions = options.loading;

		// create the layer at the first call
		if (!loadingLayer) {
			loadingLayer = createElement(DIV, {
				className: 'highcharts-loading'
			}, extend(loadingOptions.style, {
				left: plotLeft + PX,
				top: plotTop + PX,
				width: plotWidth + PX,
				height: plotHeight + PX,
				zIndex: 10,
				display: NONE
			}), container);
			
			createElement('span', {
				innerHTML: options.lang.loading
			}, loadingOptions.labelStyle, loadingLayer);
		}
		
		
		// show it
		if (!loadingShown) {
			css(loadingLayer, { opacity: 0, display: '' });
			animate(loadingLayer, {
				opacity: loadingOptions.style.opacity
			}, {
				duration: loadingOptions.showDuration
			});
			loadingShown = true;
		}
	}
	/**
	 * Hide the loading layer
	 */
	function hideLoading() {
		animate(loadingLayer, {
			opacity: 0
		}, {
			duration: options.loading.hideDuration, 
			complete: function() {
				css(loadingLayer, { display: NONE });
			}
		});
		loadingShown = false;
	}
	
	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			data;
		
		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id == id) {
				return axes[i];
			}
		}
		
		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id == id) {
				return series[i];
			}
		}
		
		// search points
		for (i = 0; i < series.length; i++) {
			data = series[i].data;
			for (j = 0; j < data.length; j++) {
				if (data[j].id == id) {
					return data[j];
				}
			}
		}
		return null;	
	}
	
	/**
	 * Update the chart's position after it has been moved, to match
	 * the mouse positions with the chart
	 */
	/*function updatePosition() {
		var container = doc.getElementById(containerId);
		if (container) {
			position = getPosition(container);
		}
	}*/
	
	/** 
	 * Create the Axis instances based on the config options
	 */
	function getAxes() {
		var xAxisOptions = options.xAxis || {},
			yAxisOptions = options.yAxis || {},
			axis;
			
		// make sure the options are arrays and add some members
		xAxisOptions = splat(xAxisOptions);
		each(xAxisOptions, function(axis, i) {
			axis.index = i; 
			axis.isX = true;
		});
		
		yAxisOptions = splat(yAxisOptions);
		each(yAxisOptions, function(axis, i) {
			axis.index = i;
		});
		
		// concatenate all axis options into one array
		axes = xAxisOptions.concat(yAxisOptions);
		
		// loop the options and construct axis objects
		chart.xAxis = [];
		chart.yAxis = [];
		axes = map (axes, function(axisOptions) {
			axis = new Axis(chart, axisOptions);
			chart[axis.isXAxis ? 'xAxis' : 'yAxis'].push(axis);
			
			return axis;
		});
		
		adjustTickAmounts();	
	}

	
	/**
	 * Get the currently selected points from all series
	 */
	function getSelectedPoints() {
		var points = [];
		each(series, function(serie) {
			points = points.concat( grep( serie.data, function(point) {
				return point.selected;
			}));
		});
		return points;
	}
	
	/**
	 * Get the currently selected series
	 */
	function getSelectedSeries() {
		return grep (series, function (serie) {
			return serie.selected;
		});
	}
	
	/**
	 * Zoom out to 1:1
	 */
	zoomOut = function () {
		fireEvent(chart, 'selection', { resetSelection: true }, zoom);
		chart.toolbar.remove('zoom');

	};
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom = function (event) {
		
		// add button to reset selection
		var lang = defaultOptions.lang;
		chart.toolbar.add('zoom', lang.resetZoom, lang.resetZoomTitle, zoomOut);
		
		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(axes, function(axis) { 
				axis.setExtremes(null, null, false);
			});
		}
			
		// else, zoom in on all axes
		else {
			each (event.xAxis.concat(event.yAxis), function(axisData) {
				var axis = axisData.axis;
					
				// don't zoom more than maxZoom
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					axis.setExtremes(axisData.min, axisData.max, false);
				}
			});
		}
		
		// redraw chart
		redraw();
		
	};
	
	/**
	 * Function: (private) showTitle
	 * 
	 * Show the title and subtitle of the chart
	 */
	function showTitle () {
		/*var //title = options.title,
			titleAlign = chartTitleOptions.align,
			//subtitle = options.subtitle,
			subtitleAlign = chartSubtitleOptions.align;//,
			//titlePos = getAlignment(title),
			//subtitlePos = getAlignment(subtitle);*/
			
		// title
		if (chartTitleOptions && chartTitleOptions.text) {
			//if (!chart.title) {
				chart.title = renderer.text(
					chartTitleOptions.text, 
					0,//titlePos.x,
					0,//titlePos.y, 
					chartTitleOptions.style, 
					0,
					chartTitleOptions.align
				)
				.align(chartTitleOptions)
				.attr({
					'class': 'highcharts-title',
					zIndex: 1
				}).add();
			/*} else {
				chart.title.animate({
					x: titlePos.x,
					y: titlePos.y
				})
			}*/
		}
		
		// subtitle
		if (chartSubtitleOptions && chartSubtitleOptions.text) {
			//if (!chart.subtitle) {
				chart.subtitle = renderer.text(
					chartSubtitleOptions.text, 
					0,//subtitlePos.x,
					0,//subtitlePos.y, 
					chartSubtitleOptions.style, 
					0,
					chartSubtitleOptions.align
				)
				.align(chartSubtitleOptions)
				.attr({
					'class': 'highcharts-subtitle',
					zIndex: 1
				}).add();
			/*} else {
				chart.subtitle.animate({
					x: subtitlePos.x,
					y: subtitlePos.y
				})
			}*/
		}
	}

	
	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	function getContainer() {
		renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;
	
		if (typeof renderTo == 'string') {
			renderTo = doc.getElementById(renderTo);
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
		var renderToOffsetHeight = (renderToClone || renderTo).offsetHeight;
		chartWidth = optionsChart.width || (renderToClone || renderTo).offsetWidth || 600;
		chartHeight = optionsChart.height || 
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			(renderToOffsetHeight > plotTop + marginBottom ? renderToOffsetHeight : 0) || 
			400;
		
		// create the inner container
		container = createElement(DIV, {
				className: 'highcharts-container' + 
					(optionsChart.className ? ' '+ optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				//overflow: HIDDEN,
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left'
			}, optionsChart.style),
			renderToClone || renderTo
		);
		
		chart.renderer = renderer = 
			optionsChart.renderer == 'SVG' ? // force SVG, used for SVG export
				new SVGRenderer(container, chartWidth, chartHeight) : 
				new Renderer(container, chartWidth, chartHeight);
	}
	
	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be 
	 * moved into their final positions
	 */
	function getMargins() {
		var title = chart.title,
			subtitle = chart.subitle;

		resetMargins();

		// adjust for title and subtitle
		if ((chart.title || chart.subtitle) && !defined(optionsMarginTop)) {
			titleOffset = mathMax(
				chart.title && !chartTitleOptions.floating && !chartTitleOptions.verticalAlign && chartTitleOptions.y || 0, 
				chart.subtitle && !chartSubtitleOptions.floating && !chartSubtitleOptions.verticalAlign && chartSubtitleOptions.y || 0
			);
			if (titleOffset) {
				plotTop = mathMax(plotTop, titleOffset + pick(chartTitleOptions.margin, 15));
			}
		}
			
		// adjust for legend
		// todo: shorten
		if (options.legend.enabled && !options.legend.floating) {
			if (options.legend.align == 'right') { // horizontal alignment handled first
				if (!defined(optionsMarginRight)) {
					marginRight = mathMax(
						marginRight,
						legendWidth - options.legend.x + pick(options.legend.margin, 5)
					);
				}
			} else if (options.legend.align == 'left') {
				if (!defined(optionsMarginLeft)) {
					plotLeft = mathMax(
						plotLeft,
						legendWidth + options.legend.x + pick(options.legend.margin, 5)
					);
				}
				
			} else if (options.legend.verticalAlign == 'top') {
				if (!defined(optionsMarginTop)) {
					plotTop = mathMax(
						plotTop, 
						legendHeight + options.legend.y + pick(options.legend.margin, 5)
					);
				}
			
			} else if (options.legend.verticalAlign == 'bottom') {
				if (!defined(optionsMarginBottom)) {
					marginBottom = mathMax(
						marginBottom, 
						legendHeight - options.legend.y + pick(options.legend.margin, 5)
					);
				}
			}
		}
		
		// pre-render axes to get labels offset width
		if (hasCartesianSeries) {
			each(axes, function(axis) {
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
		
	}
	
	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	function setChartSize() {
		
		chart.plotLeft = plotLeft = mathRound(plotLeft);
		chart.plotTop = plotTop = mathRound(plotTop);
		chart.plotWidth = plotWidth = mathRound(chartWidth - plotLeft - marginRight);
		chart.plotHeight = plotHeight = mathRound(chartHeight - plotTop - marginBottom);
		
		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;
	}
	
	/**
	 * Initial margins before auto size margins are applied
	 */
	function resetMargins() {
		plotTop = pick(optionsMarginTop, optionsChart.spacingTop);
		marginRight = pick(optionsMarginRight, optionsChart.spacingRight);
		marginBottom = pick(optionsMarginBottom, optionsChart.spacingBottom);
		plotLeft = pick(optionsMarginLeft, optionsChart.spacingLeft);
		axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
	}
	
	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	function drawChartBox() {
		var chartBorderWidth = optionsChart.borderWidth || 0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			plotSize = {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};

		// Chart area
		mgn = 2 * chartBorderWidth + (optionsChart.shadow ? 8 : 0);
			
		if (chartBorderWidth || chartBackgroundColor) {
			if (!chartBackground) {
				chartBackground = renderer.rect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn, 
						optionsChart.borderRadius, chartBorderWidth).
					attr({ 
						stroke: optionsChart.borderColor,
						'stroke-width': chartBorderWidth,
						fill: chartBackgroundColor || NONE
					}).
					add().
					shadow(optionsChart.shadow);
			} else { // resize
				chartBackground.animate({
					width: chartWidth - mgn,
					height:chartHeight - mgn
				});
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
				plotBorder = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, optionsChart.plotBorderWidth).
					attr({
						'class': 'plot-border',
						stroke: optionsChart.plotBorderColor,
						'stroke-width': optionsChart.plotBorderWidth,
						zIndex: 4
					}).add();
			} else {
				plotBorder.animate(plotSize);
			}
		}
		
		// reset
		chart.isDirtyBox = false;
	}
	
	/**
	 * Render all graphics for the chart
	 */
	function render () {
		var mgn, 
			//div, 
			//i, 
			labels = options.labels,
			titleOffset= 0,
			credits = options.credits;
		
		// Title
		showTitle();
		
		
		// Legend
		legend = chart.legend = new Legend(chart);
		
		// Get margins by pre-rendering axes
		getMargins();
		//adjustTickAmounts();
		each(axes, function(axis) {
			axis.setTickPositions(true); // update to reflect the new margins 
		});
		getMargins(); // second pass to check for new labels
		
		
		// Draw the borders and backgrounds
		drawChartBox();
						
		// Axes
		if (hasCartesianSeries) {
			each(axes, function(axis) { 
				axis.render();
			});
		}
		
		
		// The series
		each (series, function(serie) {
			serie.translate();
			serie.setTooltipPoints();
			serie.render();
		});
		
		
		// Labels
		if (labels.items) {
			each (labels.items, function () {
				var style = extend (labels.style, this.style),
					x = parseInt(style.left, 10) + plotLeft,
					y = parseInt(style.top, 10) + plotTop + 12;
				
				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;
				
				renderer.text(
					this.html,
					x,
					y,
					style
				)
				.attr({ zIndex: 2 })
				.add();
					
			});
		}
		
		// Toolbar (don't redraw)
		if (!chart.toolbar) {
			chart.toolbar = Toolbar(chart);
		}
		
		// Credits
		if (credits.enabled && !chart.credits) {
			renderer.text(
				credits.text,
				0,
				0,
				credits.style,
				0,
				'right'
			)
			.align(credits.position)
			.on('click', function() {
				location.href = credits.href;
			})
			.attr({ zIndex: 8 })
			.add(); 
		}
		
		placeTrackerGroup();

		// Set flag
		chart.hasRendered = true;
		
		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
			//updatePosition(container);
		}
	}
	
	/**
	 * Clean up memory usage
	 */
	function destroy() {
		var i = series.length;

		// remove events
		//removeEvent(win, 'resize', updatePosition);
		removeEvent(win, 'unload', destroy);
		removeEvent(chart);
		
		each (axes, function(axis) {
			removeEvent(axis);
		});

		// destroy each series
		while (i--) {
			series[i].destroy();
		}
		
		// remove all SVG
		container.innerHTML = '';
		
		// IE6 leak 
		container =	null;
			
		// memory and CPU leak
		clearInterval(tooltipInterval);
		
		for (i in chart) {
			delete chart[i];
		}
	}
	/**
	 * Prepare for first rendering after all data are loaded
	 */
	function firstRender() {
		
		getAxes();
		
		
		// Prepare for the axis sizes
		/*each(series, function(serie) {
			serie.translate();
			serie.setTooltipPoints();
		});*/	
		
		chart.render = render;
		
		// depends on inverted and on margins being set	
		chart.tracker = tracker = new MouseTracker(chart, options.tooltip);
		
		globalAnimation = false;
		render();
		
		fireEvent(chart, 'load');
		
		globalAnimation = true;
	}
	
	// Run chart
		
	getContainer();
	//updatePosition(container);
	
		
	// Set to zero for each new chart
	colorCounter = 0;
	symbolCounter = 0;
	
	// Update position on resize and scroll
	//addEvent(win, 'resize', updatePosition);
	
	// Destroy the chart and free up memory. 
	addEvent(win, 'unload', destroy);
	
	// Chart event handlers
	if (chartEvents) {
		for (eventType in chartEvents) { 
			addEvent(chart, eventType, chartEvents[eventType]);
		}
	}
	
	
	chart.options = options;
	chart.series = series;
	chart.container = container;
	
	
	/*chart.chartWidth = chartWidth;
	chart.chartHeight = chartHeight;
	
	chart.plotWidth = plotWidth = chartWidth - plotLeft - marginRight;
	chart.plotHeight = plotHeight = chartHeight - plotTop - marginBottom;
	
	chart.plotLeft = plotLeft;
	chart.plotTop = plotTop;*/
	
	resetMargins();
	setChartSize();
	
	
	
	// API methods
	chart.addSeries = addSeries;
	chart.destroy = destroy;
	chart.get = get;
	//chart.getAlignment = getAlignment;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.hideLoading = hideLoading;
	chart.isInsidePlot = isInsidePlot;
	chart.redraw = redraw;
	chart.showLoading = showLoading;	
	//chart.updatePosition = updatePosition;
	
	/*
	 * To do for resize:
	 * - Re-use setting chartWidth, plotWidth, plotSizeX etc. Run resize chart on init or
	 *   isolate these statements in a func.
	 */
	
		
	if ($) $(function() {
		$container = $('#container');
		var origChartWidth = chartWidth,
			origChartHeight = chartHeight;
		if ($container) {
			$('<button>+</button>')
				.insertBefore($container)
				.click(function() {				
					chart.resize(chartWidth *= 1.1, chartHeight *= 1.1);
				});
			$('<button>-</button>')
				.insertBefore($container)
				.click(function() {				
					chart.resize(chartWidth *= 0.9, chartHeight *= 0.9);
				});
			$('<button>1:1</button>')
				.insertBefore($container)
				.click(function() {				
					chart.resize(origChartWidth, origChartHeight);
				});
		}
	})
	
	chart.resize = function(width, height, animation) {
		
		isResizing = true;
		
		// set the animation for the current process
		globalAnimation = pick(animation, optionsChart.animation);
		
		
		chartWidth = mathRound(width);
		chartHeight = mathRound(height);
		
		renderer.resizeTo(chartWidth, chartHeight);
		
		// update axis lengths for more correct tick intervals:
		plotWidth = chartWidth - plotLeft - marginRight; 
		plotHeight = chartHeight - plotTop - marginBottom;
		
		// handle axes
		maxTicks = null;
		each(axes, function(axis) {
			axis.isDirty = true;
			axis.setScale();
		});
		
		// make sure non-cartesian series are also handled
		each(series, function(serie) {
			serie.isDirty = true;
		});
		
		chart.isDirtyLegend = true; // force legend redraw
		chart.isDirtyBox = true; // force redraw of plot and chart border
		
		getMargins();
		 
		
		redraw();
		
		isResizing = false;
		
		fireEvent(chart, 'resize');
	}
	
	
	// Initialize the series
	each (options.series || [], function(serieOptions) {
		initSeries(serieOptions);
	});
	
	// Set the common inversion and transformation for inverted series after initSeries
	chart.inverted = inverted = pick(inverted, options.chart.inverted);
	/*chart.plotSizeX = plotSizeX = inverted ? plotHeight : plotWidth;
	chart.plotSizeY = plotSizeY = inverted ? plotWidth : plotHeight;*/ 
	
		
	firstRender();
	
	
}

/**
 * The Point object and prototype. Inheritable and used as base for PiePoint
 */
var Point = function() {};
Point.prototype = {

	/**
	 * Initialize the point
	 * @param {Object} series The series object containing this point
	 * @param {Object} options The data in either number, array or object format
	 */
	init: function(series, options) {
		var point = this,
			defaultColors;
		point.series = series;
		point.applyOptions(options);
		point.pointAttr = {};
		
		if (series.options.colorByPoint) {
			defaultColors = defaultOptions.colors;
			if (!point.options) {
				point.options = {};
			}
			point.color = point.options.color = point.color || defaultColors[colorCounter++];
			
			// loop back to zero
			if (colorCounter >= defaultColors.length) {
				colorCounter = 0;
			}
		}
		
		return point;
	},
	/**
	 * Apply the options containing the x and y data and possible some extra properties.
	 * This is called on point init or from point.update.
	 * 
	 * @param {Object} options
	 */
	applyOptions: function(options) {
		var point = this,
			series = point.series;
	
		
		// onedimensional array input
		if (typeof options == 'number' || options === null) {
			point.y = options;	
		}
		
		// object input
		else if (typeof options == 'object' && typeof options.length != 'number') {
			
			// copy options directly to point
			extend(point, options);
			point.options = options;
		}
		
		// categorized data with name in first position
		else if (typeof options[0] == 'string') {
			point.name = options[0];
			point.y = options[1];
		}
		
		// two-dimentional array
		else if (typeof options[0] ==  'number') {
			point.x = options[0];
			point.y = options[1];
		}
		
		/* 
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		if (point.x === UNDEFINED) {
			point.x = series.autoIncrement();
		}
	},
	
	/**
	 * Destroy a point to clear memory. Its reference still stays in series.data.
	 */
	destroy: function() {
		var point = this,
			prop;
			
		if (point == point.series.chart.hoverPoint) {
			point.onMouseOut();
		}
		
		// remove all events
		removeEvent(point);
		
		each (['graphic', 'tracker', 'group', 'dataLabel', 'connector'], function(prop) {
			if (point[prop]) {
				point[prop].destroy();
			}
		});		
		
		if (point.legendItem) { // pies have legend items
			point.series.chart.legend.destroyItem(point);
		}
		
		for (prop in point) {
			point[prop] = null;
		}
		
	},	
	
	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 *     this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function(selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;
			
		point.selected = selected = pick(selected, !point.selected);
		
		//series.isDirty = true;
		point.firePointEvent(selected ? 'select' : 'unselect');
		
		point.setState(SELECT_STATE);
		
		// unselect all other points unless Ctrl or Cmd + click
		if (!accumulate) {
			each (chart.getSelectedPoints(), function (loopPoint) {
				if (loopPoint.selected && loopPoint != point) {
					loopPoint.selected = false;
					loopPoint.setState(NORMAL_STATE);
					loopPoint.firePointEvent('unselect');
				}
			});
		}
		
	},
	
	onMouseOver: function() {
		var point = this,
			chart = point.series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;
			
		// set normal state to previous series
		if (hoverPoint && hoverPoint != point) {
			hoverPoint.onMouseOut();
		}
		
		// trigger the event
		point.firePointEvent('mouseOver');
		
		// update the tooltip
		if (tooltip && !tooltip.shared) {
			tooltip.refresh(point);
		}
		
		// hover this
		point.setState(HOVER_STATE);
		chart.hoverPoint = point;
	},
	
	onMouseOut: function() {
		var point = this;
		point.firePointEvent('mouseOut');
		
		point.setState(NORMAL_STATE);
		point.series.chart.hoverPoint = null;
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
	update: function(options, redraw, animation) {
		var point = this,
			series = point.series;
		
		globalAnimation = animation;
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function() {

			point.applyOptions(options);
	
			// redraw
			series.isDirty = true;
			if (redraw) {
				series.chart.redraw();
			}
		});
	},
	
	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	remove: function(redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			data = series.data,
			i = data.length;
		
		globalAnimation = animation;
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of removing the point			
		point.firePointEvent('remove', null, function() {

			// loop through the data to locate the point and remove it
			while (i--) {
				if (data[i] == point) {
					data.splice(i, 1);
					break;
				}
			}
			
			point.destroy();
			
			
			// redraw
			series.isDirty = true;
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
	firePointEvent: function(eventType, eventArgs, defaultFunction) {
		var point = this,
			series = this.series,
			seriesOptions = series.options;
		
		// load event handlers on demand to save time on mouseover/out
		if (seriesOptions.point.events[eventType] || (
				point.options && point.options.events && point.options.events[eventType])) {
			this.importEvents();
		}
			
		// add default handler if in selection mode
		if (eventType == 'click' && seriesOptions.allowPointSelect) {
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
	importEvents: function() {
		if (!this.hasImportedEvents) {
			var point = this,
				options = merge (point.series.options.point, point.options),
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
	setState: function(state) {
		var point = this,
			series = point.series,
			stateOptions = series.options.states,
			markerOptions = series.options.marker,
			normalDisabled = markerOptions && !markerOptions.enabled,
			markerStateOptions = markerOptions && markerOptions.states[state],
			stateDisabled = markerStateOptions && markerStateOptions.enabled === false,
			chart = series.chart,
			pointAttr = point.pointAttr;
			
		if (!state) {
			state = NORMAL_STATE; // empty string
		}
		
		if (
				// already has this state
				state == point.state ||
				// selected points don't respond to hover
				(point.selected && state != SELECT_STATE) ||
				// series' state options is disabled
				(stateOptions[state] && stateOptions[state].enabled === false) ||
				// point marker's state options is disabled
				//(!state && normalDisabled)
				(state && (stateDisabled || normalDisabled && !markerStateOptions.enabled))

			) {
			return;
		}
		
		
		
		
		// if a graphic is not applied to each point in the normal state, create a shared
		// graphic for the hover state
		if (state && !point.graphic) {
			if (!series.stateMarkerGraphic) {
				series.stateMarkerGraphic = chart.renderer.circle(
					0, 0, pointAttr[state].r
				)
				.attr(pointAttr[state])
				.add(series.group);
			}
			
			series.stateMarkerGraphic.translate(
				point.plotX, 
				point.plotY
			);
			
		// else, apply hover styles to the existing point
		} else if (point.graphic) {
			point.graphic.attr(pointAttr[state]);
		}
		
		point.state = state;
		
	}
};

/**
 * The base function which all other series types inherit from
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function() {};

Series.prototype = {
	
	isCartesian: true,
	type: 'line',
	pointClass: Point,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		r: 'radius'
	},
	init: function(chart, options) {
		var series = this,
			eventType,
			events,
			//pointEvent,
			index = chart.series.length;
			
		series.chart = chart;
		options = series.setOptions(options); // merge with plotOptions
		
		// set some variables
		extend (series, {
			index: index,
			options: options,
			name: options.name || 'Series '+ (index + 1),
			state: NORMAL_STATE,
			pointAttr: {},
			visible: options.visible !== false, // true by default
			selected: options.selected === true // false by default
		});
		
		// register event listeners
		events = options.events;
		for (eventType in events) {
			addEvent(series, eventType, events[eventType]);
		}
		
		series.getColor();
		series.getSymbol();
		
		// set the data
		series.setData(options.data, false);
			
	},
	
	
	/**
	 * Return an auto incremented x value based on the pointStart and pointInterval options. 
	 * This is only used if an x value is not given for the point that calls autoIncrement.
	 */
	autoIncrement: function() {
		var series = this,
			options = series.options,
			xIncrement = series.xIncrement;
			
		xIncrement = pick(xIncrement, options.pointStart, 0);
		
		series.pointInterval = pick(series.pointInterval, options.pointInterval, 1);
		
		series.xIncrement = xIncrement + series.pointInterval;
		return xIncrement;
	},
	
	/**
	 * Sort the data and remove duplicates 
	 */
	cleanData: function() {
		var series = this,
			data = series.data,
			i;
			
		// sort the data points
		data.sort(function(a, b){
			return (a.x - b.x);
		});
		
		// remove points with equal x values
		// record the closest distance for calculation of column widths
		for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				if (data[i - 1].x == data[i].x)	{
					data.splice(i - 1, 1); // remove the duplicate
				}
				
			}
		}
	},		
		
	/**
	 * Divide the series data into segments divided by null values. Also sort
	 * the data points and delete duplicate values.
	 */
	getSegments: function() {
		var lastNull = -1,
			segments = [],
			data = this.data;
		
		// create the segments
		each (data, function(point, i) {
			if (point.y === null) {
				if (i > lastNull + 1) {
					segments.push(data.slice(lastNull + 1, i));
				}
				lastNull = i;	
			} else if (i == data.length - 1) { // last value
				segments.push(data.slice(lastNull + 1, i + 1));
			}
		});
		this.segments = segments;
		
		
	},
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} itemOptions
	 */
	setOptions: function(itemOptions) {
		var plotOptions = this.chart.options.plotOptions,
			options = merge(
				plotOptions[this.type],
				plotOptions.series,
				itemOptions
			);
		
		return options;
		
	},
	/**
	 * Get the series' color
	 */
	getColor: function(){
		var defaultColors = this.chart.options.colors;
		this.color = this.options.color || defaultColors[colorCounter++] || '#0000ff';
		if (colorCounter >= defaultColors.length) {
			colorCounter = 0;
		}
	},
	/**
	 * Get the series' symbol
	 */
	getSymbol: function(){
		var defaultSymbols = this.chart.options.symbols,
			symbol = this.options.marker.symbol || defaultSymbols[symbolCounter++];
		this.symbol = symbol;
		if (symbolCounter >= defaultSymbols.length) { 
			symbolCounter = 0;
		}
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
	addPoint: function(options, redraw, shift, animation) {
		var series = this,
			data = series.data,
			graph = series.graph,
			point = (new series.pointClass()).init(series, options);
			
		globalAnimation = animation;
		if (graph && shift) { // make graph animate sideways
			graph.shift = shift;
		}
		/*if (series.area) {
			series.area.shift = shift;
		}*/
			
		redraw = pick(redraw, true);
			
		data.push(point);
		if (shift) {
			data[0].remove(false);
		}
		
		
		// redraw
		series.isDirty = true;
		if (redraw) {
			series.chart.redraw();
		}
	},
	
	/**
	 * Replace the series data with a new set of data
	 * @param {Object} data
	 * @param {Object} redraw
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	setData: function(data, redraw, animation) {
		var series = this,
			oldData = series.data,
			initialColor = series.initialColor,
			chart = series.chart,
			i = oldData && oldData.length || 0;
		
		globalAnimation = animation;
		series.xIncrement = null; // reset for new data
		if (defined(initialColor)) { // reset colors for pie
			colorCounter = initialColor;
		}
		
		data = map(splat(data || []), function(pointOptions) {
			return (new series.pointClass()).init(series, pointOptions);
		});
		
		
		/*
		// brightening colors. 
		// todo: make it apply to dynamic data as well
		if (true) {
			for (var j = 0; j < data.length; j++) {
				data[j].color = data[j].options.color = Color(chart.options.colors[initialColor])
					.brighten(j / (data.length + 2))
					.get();
			}
		}
		*/
		
		// destroy old points
		while (i--) {
			oldData[i].destroy();
		}
		
		// set the data
		series.data = data;
	
		series.cleanData();	
		series.getSegments();
		
		// redraw
		series.isDirty = true;
		chart.isDirtyBox = true;
		if (pick(redraw, true)) {
			chart.redraw();
		}
	},
	
	/**
	 * Remove a series and optionally redraw the chart
	 * 
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	
	remove: function(redraw, animation) {
		var series = this,
			chart = series.chart;
			
		globalAnimation = animation;
		redraw = pick(redraw, true);
		
		if (!series.isRemoving) {  /* prevent triggering native event in jQuery
				(calling the remove function from the remove event) */ 
			series.isRemoving = true;

			// fire the event with a default handler of removing the point			
			fireEvent(series, 'remove', null, function() {
				
						
				// destroy elements
				series.destroy();
			
				
				// redraw
				chart.isDirtyLegend = chart.isDirtyBox = true;
				if (redraw) {
					chart.redraw();
				}
			});
			
		} 
		series.isRemoving = false;
	},
	
	/**
	 * Translate data points from raw data values to chart specific positioning data
	 * needed later in drawPoints, drawGraph and drawTracker. 
	 */
	translate: function() {
		var series = this, 
			chart = series.chart, 
			stacking = series.options.stacking,
			categories = series.xAxis.categories,
			yAxis = series.yAxis,
			stack = yAxis.stacks[series.type],
			data = series.data,
			i = data.length;
			
		// do the translation
		while (i--) {
			var point = data[i],
				xValue = point.x, 
				yValue = point.y, 
				yBottom, 
				pointStack,
				pointStackTotal;
			point.plotX = series.xAxis.translate(xValue);
			
			// calculate the bottom y value for stacked series
			if (stacking && series.visible && stack[xValue]) {
				pointStack = stack[xValue];
				pointStackTotal = pointStack.total;
				pointStack.cum = yBottom = pointStack.cum - yValue; // start from top
				yValue = yBottom + yValue;
				
				if (stacking == 'percent') {
					yBottom = pointStackTotal ? yBottom * 100 / pointStackTotal : 0;
					yValue = pointStackTotal ? yValue * 100 / pointStackTotal : 0;
				}

				point.percentage = pointStackTotal ? point.y * 100 / pointStackTotal : 0;
				point.stackTotal = pointStackTotal;
				point.yBottom = yAxis.translate(yBottom, 0, 1);				
			}
			
			// set the y value
			if (yValue !== null) {
				point.plotY = yAxis.translate(yValue, 0, 1);
			}
			
			// set client related positions for mouse tracking
			point.clientX = chart.inverted ? 
				chart.plotHeight - point.plotX : 
				point.plotX; // for mouse tracking
				
			// some API data
			point.category = categories && categories[point.x] !== UNDEFINED ? 
				categories[point.x] : point.x;
				
		}
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			data = [],
			plotSize = mathRound((inverted ? chart.plotTop : chart.plotLeft) + chart.plotSizeX),
			low,
			high,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension
			
		// renew
		if (renew) {
			series.tooltipPoints = null;
		}
			
		// concat segments to overcome null values
		each (series.segments, function(segment){
			data = data.concat(segment);
		});
		
		// loop the concatenated data and apply each point to all the closest
		// pixel positions
		if (series.xAxis && series.xAxis.reversed) {
			data = data.reverse();//reverseArray(data);
		}
		
		each (data, function(point, i) {
			
			
			/*if (!series.tooltipPoints) { // only create the text the first time, not on zoom
				point.setTooltipText();
			}*/
			
			low = data[i - 1] ? data [i - 1].high + 1 : 0;
			high = point.high = data[i + 1] ? (
				mathFloor((point.plotX + (data[i + 1] ? 
					data[i + 1].plotX : plotSize)) / 2)) :
					plotSize;
			
			while (low <= high) {
				tooltipPoints[inverted ? plotSize - low++ : low++] = point;
			}
		});
		series.tooltipPoints = tooltipPoints;
	},
	
	

	
	/**
	 * Series mouse over handler
	 */
	onMouseOver: function() {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries,
			stateMarkerGraphic = series.stateMarkerGraphic;
			
		if (chart.mouseIsDown) {
			return;
		}
		
		if (stateMarkerGraphic) {
			stateMarkerGraphic.show();
		}
		
		// set normal state to previous series
		if (hoverSeries && hoverSeries != series) {
			hoverSeries.onMouseOut();
		}
		
		// trigger the event, but to save processing time, 
		// only if defined
		if (series.options.events.mouseOver) { 
			fireEvent(series, 'mouseOver');
		}
		
		
		// bring to front
		// Todo: optimize. This is one of two operations slowing down the tooltip in Firefox.
		// Can the tracking be done otherwise?
		if (series.tracker) {
			series.tracker.toFront();
		}
		
		// hover this
		series.setState(HOVER_STATE);
		chart.hoverSeries = series;
		
	},
	
	/**
	 * Series mouse out handler
	 */
	onMouseOut: function() {
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
		if (tooltip && !options.stickyTracking) {
			tooltip.hide();
		}
		
		// set normal state
		series.setState();
		chart.hoverSeries = null;		
	},
	
	/**
	 * Animate in the series
	 */
	animate: function(init) {
		var series = this,
			chart = series.chart,
			clipRect = series.clipRect;
		if (init) { // initialize the animation
			if (!clipRect.isAnimating) { // apply it only for one of the series
				clipRect.attr( 'width', 0 );
				clipRect.isAnimating = true;
			}
			
		} else { // run the animation
			globalAnimation = true;
			clipRect.animate({ 
				width: chart.plotSizeX 
			}, {
				complete: function() {
					clipRect.isAnimating = false;
				}, 
				duration: 1000
			});
			globalAnimation = false;
			
			// delete this function to allow it only once
			this.animate = null;
		}
	},
	
	/**
	 * Draw the markers
	 */
	drawPoints: function(){
		var series = this,
			pointAttr,
			data = series.data, 
			chart = series.chart,
			plotX,
			plotY,
			i,
			point,
			radius,
			graphic;
		
		if (series.options.marker.enabled) {
			i = data.length;
			while (i--) {
				point = data[i];
				plotX = point.plotX;
				plotY = point.plotY;
				graphic = point.graphic;
				
				// only draw the point if y is defined
				if (point.plotY !== UNDEFINED) {
				
					/* && removed this code because points stayed after zoom
						point.plotX >= 0 && point.plotX <= chart.plotSizeX &&
						point.plotY >= 0 && point.plotY <= chart.plotSizeY*/
					
					// shortcuts
					pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
					radius = pointAttr.r;
					
					
					if (graphic) { // update
						graphic.animate({
							x: plotX,
							y: plotY,
							r: radius
						});
					} else {
						point.graphic = chart.renderer.symbol(
							pick(point.marker && point.marker.symbol, series.symbol),
							plotX,
							plotY, 
							radius
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
	convertAttribs: function(options, base1, base2, base3) {
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
	getAttribs: function() {
		var series = this, 
			normalOptions = series.options.marker || series.options,
			stateOptions = normalOptions.states,
			stateOptionsHover = stateOptions[HOVER_STATE],
			pointStateOptionsHover,
			normalDefaults = {},
			seriesColor = series.color,
			data = series.data,
			i,
			point,
			seriesPointAttr = [],
			pointAttr,
			pointAttrToOptions = series.pointAttrToOptions,
			hasPointSpecificOptions;
			//chart = series.chart;
			
		// series type specific modifications
		if (series.options.marker) { // line, spline, area, areaspline, scatter
			
			// if no color is given for the point, use the general series color
			normalDefaults = {
				stroke: seriesColor,
				fill: seriesColor
			};
			
			// if no hover radius is given, default to normal radius + 2  
			stateOptionsHover.radius = stateOptionsHover.radius || normalOptions.radius + 2;
			stateOptionsHover.lineWidth = stateOptionsHover.lineWidth || normalOptions.lineWidth + 1;
			
		} else { // column, bar, pie
			
			// if no color is given for the point, use the general series color
			normalDefaults = {
				fill: seriesColor
			};
			
			// if no hover color is given, brighten the normal color
			stateOptionsHover.color = stateOptionsHover.color || 
				Color(stateOptionsHover.color || seriesColor)
					.brighten(stateOptionsHover.brightness).get();
		}
		
		// general point attributes for the series normal state
		seriesPointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, normalDefaults);
		
		// HOVER_STATE and SELECT_STATE states inherit from normal state except the default radius
		each([HOVER_STATE, SELECT_STATE], function(state) {
			seriesPointAttr[state] = 
					series.convertAttribs(stateOptions[state], seriesPointAttr[NORMAL_STATE]);
		});
				
		// set it
		series.pointAttr = seriesPointAttr;
		
		
		// Generate the point-specific attribute collections if specific point
		// options are given. If not, create a referance to the series wide point 
		// attributes
		i = data.length;
		while (i--) {
			point = data[i];
			normalOptions = (point.options && point.options.marker) || point.options;
			hasPointSpecificOptions = false;
			
			// check if the point has specific visual options
			if (point.options) {
				for (var key in pointAttrToOptions) {
					if (normalOptions[pointAttrToOptions[key]]) {
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
	destroy: function() {
		var series = this,
			chartSeries = series.chart.series,
			clipRect = series.clipRect,
			prop;
		
		// remove all events
		removeEvent(series);
			
		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}
		
		// destroy all points with their elements
		each (series.data, function(point) {
			point.destroy();
		});
		// destroy all SVGElements associated to the series
		each(['area', 'graph', 'dataLabelsGroup', 'group', 'tracker'], function(prop) {
			if (series[prop]) {
				series[prop].destroy();
			}
		});
		if (clipRect && clipRect != series.chart.clipRect) {
			clipRect.destroy();
		}
		
		// loop through the chart series to locate the series and remove it
		each(chartSeries, function(existingSeries, i) {
			if (existingSeries == series) {
				chartSeries.splice(i, 1);
			}
		});
				
		// clear all members
		for (prop in series) {
			delete series[prop];
		} 
	},
	
	/**
	 * Draw the data labels
	 */
	drawDataLabels: function() {
		if (this.options.dataLabels.enabled) {
			var series = this,
				x, 
				y, 
				data = series.data, 
				options = series.options.dataLabels,
				str, 
				dataLabelsGroup = series.dataLabelsGroup, 
				chart = series.chart, 
				inverted = chart.inverted,
				seriesType = series.type,
				color,
				align;
				
			// create a separate group for the data labels to avoid rotation
			if (!dataLabelsGroup) {
				dataLabelsGroup = series.dataLabelsGroup = 
					chart.renderer.g(PREFIX +'data-labels')
						.attr({ 
							visibility: series.visible ? VISIBLE : HIDDEN,
							zIndex: 4
						})
						.translate(chart.plotLeft, chart.plotTop)
						.add();
			}
		
			// determine the color
			color = options.color;
			if (color == 'auto') { // 1.0 backwards compatibility
				color = null;	
			}
			options.style.color = pick(color, series.color);
		
			// make the labels for each point
			each(data, function(point, i){
				var plotX = pick(point.barX, point.plotX, -999),
					plotY = pick(point.plotY, -999),
					labelPos = point.labelPos,
					dataLabel = point.dataLabel;
					
				// get the string
				str = options.formatter.call({
					x: point.x,
					y: point.y,
					series: series,
					point: point,
					percentage: point.percentage,
					total: point.total || point.stackTotal
				});
				x = (inverted ? chart.plotWidth - plotY : plotX) + options.x;
				y = (inverted ? chart.plotHeight - plotX : plotY) + options.y;
				align = labelPos ? labelPos[6] : options.align;
				
				// in columns, align the string to the column
				if (seriesType == 'column') {
					x += {
						center: point.barW / 2,
						right: point.barW
					}[align] || 0;
				}
				
				if (dataLabel) {
					dataLabel.animate({
						x: x,
						y: y
					});
				} else if (str) {
					point.dataLabel = chart.renderer.text(
						str, 
						x, 
						y, 
						options.style, 
						options.rotation, 
						align
					)
					.attr({ zIndex: 1 })
					.add(dataLabelsGroup);
				}
				
					
			});
		}
	},
	
	/**
	 * Draw the actual graph
	 */
	drawGraph: function(state) {
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
			segmentPath,
			renderer = chart.renderer,
			translatedThreshold = series.yAxis.getThreshold(options.threshold || 0),
			useArea = /^area/.test(series.type),
			areaPath = [];
			
		
		// divide into segments and build graph and area paths
		each(series.segments, function(segment) {
			segmentPath = [];
			
			// build the segment line
			each(segment, function(point, i) {

				if (series.getPointSpline) { // generate the spline as defined in the SplineSeries object
					segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i))
				
				} else {
				
					// moveTo or lineTo
					segmentPath.push(i ? L : M);
					
					// step line?
					if (i && options.step) {
						var lastPoint = segment[i - 1];
						segmentPath.push (
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
			graphPath = graphPath.concat(segmentPath);
			
			// build the area
			if (useArea) {
				var areaSegmentPath = [],
					i,
					segLength = segmentPath.length;
				for (i = 0; i < segLength; i++) {
					areaSegmentPath.push(segmentPath[i]);
				}
				if (options.stacking && series.type != 'areaspline') {
					// follow stack back. Todo: implement areaspline
					for (i = segment.length - 1; i >= 0; i--) {
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

		series.graphPath = graphPath; // used in drawTracker

		// draw the graph
		if (graph) {
			//graph.animate({ d: graphPath.join(' ') });
			graph.animate({ d: graphPath });
			
		} else {
			if (lineWidth) {
				series.graph = renderer.path(graphPath).
					attr({
						'stroke': color,
						'stroke-width': lineWidth + PX
					}).add(group).shadow(options.shadow);
			}
		}
		
			
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
				series.area = series.chart.renderer.path(areaPath).
					attr({
						fill: fillColor
					}).add(group);
			}
		}
	},
	
	
	/**
	 * Render the graph and markers
	 */
	render: function() {
		var series = this,
			chart = series.chart,
			group,
			setInvert,
			doAnimation = series.options.animation && series.animate,
			renderer = chart.renderer;
			
		
		// Add plot area clipping rectangle. If this is before chart.hasRendered,
		// create one shared clipRect. 
		if (!series.clipRect) {
			series.clipRect = !chart.hasRendered && chart.clipRect ?
				chart.clipRect : 
			renderer.clipRect(0, 0, chart.plotSizeX, chart.plotSizeY);
			if (!chart.clipRect) {
				chart.clipRect = series.clipRect;
			}
		}
		
			
		// the group
		if (!series.group) {
			group = series.group = renderer.g('series');
				
			if (chart.inverted) {
				setInvert = function() {
					group.attr({
						width: chart.plotWidth,
						height: chart.plotHeight
					}).invert();
				};
				
				setInvert(); // do it now
				addEvent(chart, 'resize', setInvert); // do it on resize
			} 
			group.clip(series.clipRect)
				.attr({ 
					visibility: series.visible ? VISIBLE : HIDDEN,
					zIndex: 3					
				})
				.translate(chart.plotLeft, chart.plotTop)
				.add();
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
		
		// run the animation
		if (doAnimation) {
			series.animate();
		}
		
		
		series.isDirty = false; // means data is in accordance with what you see
		
	},
	
	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function() {
		var series = this,
			chart = series.chart,
			clipRect = series.clipRect,
			group = series.group,
			translation;
		
		if (clipRect) {
			stop(clipRect);
			clipRect.animate({ // for chart resize
				width: chart.plotSizeX,
				height: chart.plotSizeY
			});
		}
		
		// reposition on resize
		group && group.animate({
			translateX: chart.plotLeft, 
			translateY: chart.plotTop
		});
		/* Todo: redo group and tracker inversion on resize
		if (chart.inverted) {
				series.group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				}).invert();
			}*/
		
		series.translate();
		series.setTooltipPoints(true);
		series.render();
	},
	
	/**
	 * Set the state of the graph
	 */
	setState: function(state) {
		var series = this,
			options = series.options,
			graph = series.graph,
			stateOptions = options.states,
			stateMarkerGraphic = series.stateMarkerGraphic,
			lineWidth = options.lineWidth;

		state = state || NORMAL_STATE;
				
		if (series.state != state) {
			series.state = state;
			
			if (stateOptions[state] && stateOptions[state].enabled === false) {
				return;
			}
		
			if (state) {				
				lineWidth = stateOptions[state].lineWidth || lineWidth;
			} else if (stateMarkerGraphic) {
				stateMarkerGraphic.hide();
			}
			
			if (graph) {
				graph.animate({
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
	setVisible: function(vis, redraw) {
		var series = this,
			chart = series.chart,
			legendItem = series.legendItem,
			seriesGroup = series.group,
			seriesTracker = series.tracker,
			dataLabelsGroup = series.dataLabelsGroup,
			showOrHide,
			i,
			data = series.data,
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
		} else {
			i = data.length;
			while (i--) {
				point = data[i];
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
			each (chart.series, function(otherSeries) {
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
	show: function() {
		this.setVisible(true);
	},
	
	/**
	 * Hide the graph
	 */
	hide: function() {
		this.setVisible(false);
	},
	
	
	/**
	 * Set the selected state of the graph
	 * 
	 * @param selected {Boolean} True to select the series, false to unselect. If
	 *        UNDEFINED, the selection state is toggled.
	 */
	select: function(selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === UNDEFINED) ? !series.selected : selected;

		if (series.checkbox) {
			series.checkbox.checked = selected;
		}
		
		fireEvent(series, selected ? 'select' : 'unselect');
	},
	
	
	/**
	 * Draw the tracker object that sits above all data labels and markers to
	 * track mouse events on the graph or points. For the line type charts
	 * the tracker uses the same graphPath, but with a greater stroke width
	 * for better control.
	 */
	drawTracker: function() {
		var series = this,
			options = series.options,
			trackerPath = series.graphPath,
			chart = series.chart,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor };
	
		// if only one series, use the whole plot area as tracker
		// problem: can't put legend inside plot area
		/*if (isSingleSeries) {
			trackerPath = [
				M,
				0, 0,
				L,
				0, plotHeight,
				plotWidth, plotHeight,
				plotWidth, 0,
				'Z'
			]; 
		}*/
		if (tracker) { // update
			tracker.attr({ d: trackerPath });
			
		} else { // create
			series.tracker = chart.renderer.path(trackerPath).
				attr({
					isTracker: true,
					stroke: TRACKER_FILL,
					//fill: isSingleSeries ? TRACKER_FILL : NONE,
					fill: NONE,
					'stroke-width' : options.lineWidth + 2 * chart.options.tooltip.snap,
					'stroke-linecap': 'round',
					visibility: series.visible ? VISIBLE : HIDDEN,
					zIndex: 1
				})
				.on('mouseover', function() {
					if (chart.hoverSeries != series) {
						series.onMouseOver();
					}
				})
				.on('mouseout', function() {
					if (!options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css)
				.add(chart.trackerGroup);
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
var SplineSeries = extendClass( Series, {
	type: 'spline',
	
	/**
	 * Draw the actual graph
	 */
	getPointSpline: function(segment, point, i) {
		var smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc
			denom = smoothing + 1,
			plotX = point.plotX,
			plotY = point.plotY,
			lastPoint = segment[i - 1],
			nextPoint = segment[i + 1],
			ret;
			
		// find control points
		if (i && i < segment.length - 1) {
			var lastX = lastPoint.plotX,
				lastY = lastPoint.plotY,
				nextX = nextPoint.plotX,
				nextY = nextPoint.plotY,
			
				leftContX = (smoothing * plotX + lastX) / denom,
				leftContY = (smoothing * plotY + lastY) / denom,
				rightContX = (smoothing * plotX + nextX) / denom,
				rightContY = (smoothing * plotY + nextY) / denom,
		
			// have the two control points make a straight line through main point
				correction = plotY - (leftContY + rightContY) / 2;
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
			
			// visualize
		    /*renderer.circle(leftContX, leftContY, 3).attr({
	            stroke: '#F66666',
	            'stroke-width': 1,
	            fill: 'none'
	        }).translate(chart.plotLeft, chart.plotTop).add();
	        renderer.path(['M', leftContX, leftContY, 'L', plotX, plotY]).attr({
	            stroke: '#F66666',
	            'stroke-width': 1
	        }).translate(chart.plotLeft, chart.plotTop).add();
	        renderer.circle(rightContX, rightContY, 3).attr({
	            stroke: '#66F666',
	            'stroke-width': 1,
	            fill: 'none'
	        }).translate(chart.plotLeft, chart.plotTop).add();
	        
	        renderer.path(['M', rightContX, rightContY, 'L', plotX, plotY]).attr({
	            stroke: '#66F666',
	            'stroke-width': 1
	        }).translate(chart.plotLeft, chart.plotTop).add();*/
		}
		
		// moveTo or lineTo
		if (!i) {
			ret = [M, plotX, plotY];
		}
		
		// curve from last point to this
		else {
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
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		r: 'borderRadius'
	},
	init: function() {
		Series.prototype.init.apply(this, arguments);
		
		var series = this,
			chart = series.chart;
		
		
		// if the series is added dynamically, force redraw of other
		// series affected by a new column
		if (chart.hasRendered) {
			each (chart.series, function(otherSeries) {
				if (otherSeries.type == series.type) {
					otherSeries.isDirty = true;
				}
			});
		}
	},
	
	/**
	 * Translate each point to the plot area coordinate system and find shape positions
	 */
	translate: function() {
		var series = this,
			chart = series.chart,
			columnCount = 0,
			reversedXAxis = series.xAxis.reversed,
			categories = series.xAxis.categories,
			stackedIndex; // the index of the first column in a stack
		
		Series.prototype.translate.apply(series);
		
		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a 
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		each (chart.series, function(otherSeries) {
			if (otherSeries.type == series.type) {
				if (!otherSeries.options.stacking) {
					otherSeries.columnIndex = columnCount++;
				} else {
					if (!defined(stackedIndex)) {
						stackedIndex = columnCount++;
					}
					otherSeries.columnIndex = stackedIndex;
				}
			}
		});
		
		// calculate the width and position of each column based on 
		// the number of column series in the plot, the groupPadding
		// and the pointPadding options
		var options = series.options,
			data = series.data,
			closestPoints = series.closestPoints,
			categoryWidth = mathAbs(
				data[1] ? data[closestPoints].plotX - data[closestPoints - 1].plotX : 
				chart.plotSizeX / (categories ? categories.length : 1)
			),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 : 
				pointOffsetWidth * options.pointPadding,
			pointWidth = pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding),
			columnIndex = (reversedXAxis ? columnCount - 
				series.columnIndex : series.columnIndex) || 0,
			pointXOffset = pointPadding + (groupPadding + columnIndex *
				pointOffsetWidth -(categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1),
			translatedThreshold = series.yAxis.getThreshold(options.threshold || 0),
			minPointLength = options.minPointLength;
			
		// record the new values
		each (data, function(point) {
			var plotY = point.plotY,
				barX = point.plotX + pointXOffset,
				barY = mathMin(plotY, translatedThreshold), 
				barW = pointWidth,
				barH = mathAbs((point.yBottom || translatedThreshold) - plotY),
				trackerY;
			
			// handle options.minPointLength and tracker for small points
			if (mathAbs(barH) < (minPointLength || 5)) { 
				if (minPointLength) {
					barH = minPointLength;
					barY = translatedThreshold - (plotY <= translatedThreshold ? minPointLength : 0);
				}
				trackerY = barY - 3;
			}
			
			
			extend (point, {
				barX: barX,
				barY: barY, 
				barW: barW,
				barH: barH
			});
			point.shapeType = 'rect';
			point.shapeArgs = {
				x: barX,
				y: barY,
				width: barW,
				height: barH,
				r: options.borderRadius
			};
			
			// make small columns responsive to mouse
			if (defined(trackerY)) {
				point.trackerArgs = merge(point.shapeArgs, { 
					height: 6,
					y: trackerY
				});
			}
		});
		
	},
	
	getSymbol: function(){
	},
	
	/** 
	 * Columns have no graph
	 */
	drawGraph: function() {},
	
	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 * 
	 */
	drawPoints: function() {
		var series = this,
			options = series.options,
			renderer = series.chart.renderer,
			graphic,
			shapeArgs;		
		
		
		// draw the columns
		each (series.data, function(point) {			
			
			if (defined(point.plotY)) {
				graphic = point.graphic;
				shapeArgs = point.shapeArgs;
				if (graphic) { // update
					graphic.animate(shapeArgs);
				
				} else {
					point.graphic = renderer[point.shapeType](shapeArgs)
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
	drawTracker: function() {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			shapeArgs,
			tracker,
			trackerLabel = +new Date(),
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			rel;
			
		each (series.data, function(point) {
			tracker = point.tracker;
			shapeArgs = point.trackerArgs || point.shapeArgs;
			if (tracker) {// update
				tracker.attr(shapeArgs);
				
			} else {
				point.tracker = 
					renderer[point.shapeType](shapeArgs)
					.attr({
						isTracker: trackerLabel,
						fill: TRACKER_FILL,
						visibility: series.visible ? VISIBLE : HIDDEN,
						zIndex: 1
					})
					.on('mouseover', function(event) {
						rel = event.relatedTarget || event.fromElement;
						if (chart.hoverSeries != series && attr(rel, 'isTracker') != trackerLabel) {
							series.onMouseOver();
						}
						point.onMouseOver();
						
					})
					.on('mouseout', function(event) {
						if (!series.options.stickyTracking) {
							rel = event.relatedTarget || event.toElement;
							if (attr(rel, 'isTracker') != trackerLabel) {
								series.onMouseOut();
							}
						}
					})
					.css(css)
					.add(chart.trackerGroup);
			}
		});				
	},
	
	/**
	 * Extend the base cleanData method by getting the closest pair of points.
	 * This is needed for determining the automatic point width.
	 */
	cleanData: function() {
		var series = this,
			data = series.data,
			interval,
			smallestInterval,
			closestPoints,
			i;
			
		// apply the parent method
		Series.prototype.cleanData.apply(series);
			
		// find the closes pair of points
		for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				interval = data[i].x - data[i - 1].x;
				if (smallestInterval === UNDEFINED || interval < smallestInterval) {
					smallestInterval = interval;
					closestPoints = i;	
				}
			}
		}
		series.closestPoints = closestPoints;
	},
	
	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it 
	 */
	animate: function(init) {
		var series = this,
			data = series.data;
			
		if (!init) { // run the animation
			/*
			 * Note: Ideally the animation should be initialized by calling
			 * series.group.hide(), and then calling series.group.show()
			 * after the animation was started. But this rendered the shadows
			 * invisible in IE8 standards mode. If the columns flicker on large
			 * datasets, this is the cause.
			 */
			
			each (data, function(point) {
				var graphic = point.graphic;
				
				if (graphic) {
					// start values
					graphic.attr({ 
						height: 0,
						y: series.yAxis.translate(0, 0, 1)
					});
					
					// animate
					globalAnimation = true;
					graphic.animate({ 
						height: point.barH,
						y: point.barY
					}, {
						duration: 1000
					});
					globalAnimation = false;
				}
			});
			
			
			// delete this function to allow it only once
			series.animate = null;
		}
		
	},
	/**
	 * Remove this series from the chart
	 */
	remove: function() {
		var series = this,
			chart = series.chart;
			
		// column and bar series affects other series of the same type
		// as they are either stacked or grouped
		if (chart.hasRendered) {
			each (chart.series, function(otherSeries) {
				if (otherSeries.type == series.type) {
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
	init: function(chart) {
		chart.inverted = this.inverted = true;
		ColumnSeries.prototype.init.apply(this, arguments);
	}
});
seriesTypes.bar = BarSeries;

/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	
	/**
	 * Extend the base Series' translate method by adding shape type and
	 * arguments for the point trackers
	 */
	translate: function() {
		var series = this;

		Series.prototype.translate.apply(series);

		each (series.data, function(point) {
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: series.chart.options.tooltip.snap
			};
		});
	},
	
	
	/**
	 * Create individual tracker elements for each point
	 */
	//drawTracker: ColumnSeries.prototype.drawTracker,
	drawTracker: function() {
		var series = this,
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			graphic;
			
		each(series.data, function(point) {
			graphic = point.graphic;
			if (graphic) { // doesn't exist for null points
				graphic
					.attr({ isTracker: true })
					.on('mouseover', function(event) {
						series.onMouseOver();
						point.onMouseOver();					
					})
					.on('mouseout', function(event) {
						if (!series.options.stickyTracking) {
							series.onMouseOut();
						}
					})
					.css(css);
			}
		});

	},
	
	/**
	 * Cleaning the data is not necessary in a scatter plot
	 */
	cleanData: function() {}
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
			//series = point.series,
			toggleSlice;
		
		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice')
		});
		
		// add event listener for select
		toggleSlice = function() {
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
	setVisible: function(vis) {	
		var point = this, 
			chart = point.series.chart,
			tracker = point.tracker,
			dataLabel = point.dataLabel,
			connector = point.connector,
			method;
		
		// if called without an argument, toggle visibility
		point.visible = vis = vis === UNDEFINED ? !point.visible : vis;
		
		method = vis ? 'show' : 'hide';
		
		point.group[method]();
		tracker && tracker[method]();
		dataLabel && dataLabel[method]();
		connector && connector[method]();
		point.legendItem && chart.legend.colorizeItem(point, vis);
	},
	
	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled 
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function(sliced, redraw) {
		var point = this,
			series = point.series,
			chart = series.chart,
			slicedTranslation = point.slicedTranslation;
		
		// redraw is true by default
		redraw = pick(redraw, true);
			
		// if called without an argument, toggle
		sliced = point.sliced = defined(sliced) ? sliced : !point.sliced;
		
		point.group.animate({
			translateX: (sliced ? slicedTranslation[0] : chart.plotLeft),
			translateY: (sliced ? slicedTranslation[1] : chart.plotTop)
		}, 100);
		
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
	getColor: function() {
		// record first color for use in setData
		this.initialColor = colorCounter;
	},
	
	
	translate: function() {
		var total = 0,
			series = this,
			cumulative = -0.25, // start at top
			options = series.options,
			slicedOffset = options.slicedOffset,
			connectorOffset = slicedOffset + options.borderWidth,
			positions = options.center,
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			start,
			end,
			angle,
			data = series.data,
			circ = 2 * math.PI,
			fraction,
			smallestSize = mathMin(plotWidth, plotHeight),
			isPercent,
			radiusX, // the x component of the radius vector for a given point
			radiusY,
			labelDistance = options.dataLabels.distance;
			
		// get positions - either an integer or a percentage string must be given
		positions.push(options.size, options.innerSize || 0);
		positions = map (positions, function(length, i) {
			
			isPercent = /%$/.test(length);			
			return isPercent ? 
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to smallestSize
				[plotWidth, plotHeight, smallestSize, smallestSize][i] *
					parseInt(length, 10) / 100:
				length;
		});
		
		// utility for getting the x value from a given y, used for anticollision logic in data labels
		series.getX = function(y, left) {
			
			/*y = positions[1] + mathSin(angle) * (positions[2] / 2 + labelDistance);
			mathSin(angle) * (positions[2] / 2 + labelDistance) = y - positions[1];
			mathSin(angle) = (y - positions[1]) / (positions[2] / 2 + labelDistance)*/
			angle = math.asin((y - positions[1]) / (positions[2] / 2 + labelDistance));
			
			return positions[0] + 
				(left ? -1 : 1) *
				(mathCos(angle) * (positions[2] / 2 + labelDistance));
		}
		
		// set center for later use
		series.center = positions;
					
		// get the total sum
		each (data, function(point) {
			total += point.y;
		});
		
		each (data, function(point) {
			// set start and end angle
			fraction = total ? point.y / total : 0;
			start = cumulative * circ;
			cumulative += fraction;
			end = cumulative * circ;
			
			
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
			
			//point.labelPos[0] = series.getX(point.labelPos[1]);
			
			// API properties
			point.percentage = fraction * 100;
			point.total = total;
			
		});
		
		this.setTooltipPoints();
	},
	
	/**
	 * Render the slices
	 */
	render: function() {
		var series = this;
		// cache attributes for shapes
		series.getAttribs();

		this.drawPoints();
		
		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}
		
		this.drawDataLabels();
		
		series.isDirty = false; // means data is in accordance with what you see
	},
	
	/**
	 * Draw the data points
	 */
	drawPoints: function() {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			groupTranslation,
			//center,
			graphic,
			shapeArgs;
		
		// draw the slices
		each (this.data, function(point) {
			graphic = point.graphic;
			shapeArgs = point.shapeArgs;

			// create the group the first time
			if (!point.group) {
				// if the point is sliced, use special translation, else use plot area traslation
				groupTranslation = point.sliced ? point.slicedTranslation : [chart.plotLeft, chart.plotTop];
				point.group = renderer.g('point')
					.attr({ zIndex: 5 })
					.add()
					.translate(groupTranslation[0], groupTranslation[1]);
			}
			
			// draw the slice
			if (graphic) {
				graphic.animate(shapeArgs);
			} else {
				point.graphic = 
					renderer.arc(shapeArgs)
					.attr(point.pointAttr[NORMAL_STATE])
					.add(point.group);
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
	drawDataLabels: function() {
		var series = this,
			data = series.data,
			options = series.options.dataLabels,
			connectorPadding = options.connectorPadding || 10,
			connectorWidth = options.connectorWidth || 1,
			connector,
			connectorPath,
			dataLabel,
			labelPos,
			labelHeight,
			lastY,
			top,
			centerY = series.center[1],
			quarters = [// divide the points into quarters for anti collision
				[], // top right
				[], // bottom right
				[], // bottom left
				[] // top left
			], 
			x,
			y,
			visibility,
			overlapping,
			rankArr,
			secondPass,
			sign,
			upperHalf,
			i = 4;
			
		// run parent method
		Series.prototype.drawDataLabels.apply(series);
		
		// arrange points for detection collision
		each (data, function(point) {
			var angle = point.labelPos[7],
				quarter;
			if (angle < 0) {
				quarter = 0;
			} else if (angle < math.PI / 2) {
				quarter = 1;
			} else if (angle < math.PI) {
				quarter = 2;
			} else {
				quarter = 3;
			}
			quarters[quarter].push(point);
		});
		quarters[1].reverse();
		quarters[3].reverse();
		
		/* Loop over the points in each quartile, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		while (i--) {
			overlapping = 0;
			
			// create an array for sorting and ranking the points within each quarter
			rankArr = [].concat(quarters[i]);
			rankArr.sort(function(a,b) {
				return a.y > b.y;
			});
			each (rankArr, function(point, i) {
				point.rank = i;
			})
				
			/* In the first pass, count the number of overlapping labels. In the second
			 * pass, remove the labels with lowest rank/values.
			 */
			for (secondPass = 0; secondPass < 2; secondPass++) {
				lowerHalf = i % 3;
				lastY = lowerHalf ? 9999 : -9999;
				sign = lowerHalf ? -1 : 1;
				each (quarters[i], function(point) {
					
					if ((dataLabel = point.dataLabel)) {
						labelPos = point.labelPos;
						visibility = VISIBLE;
						x = labelPos[0];
						y = labelPos[1];
						
						
						// assume all labels have equal height
						if (!labelHeight) {
							labelHeight = dataLabel && dataLabel.getBBox().height;
						}
						
						// anticollision
						if (secondPass && point.rank < overlapping) {
							visibility = HIDDEN;
						} else if ((!lowerHalf && y < lastY + labelHeight) ||
								(lowerHalf && y > lastY - labelHeight)) {  
							y = lastY + sign * labelHeight;
							x = series.getX(y, i > 1);
							if ((!lowerHalf && y + labelHeight > centerY) ||
									(lowerHalf && y -labelHeight < centerY)) {
								if (secondPass) {
									visibility = HIDDEN;
								} else {									
									overlapping++;
								}
							}
						}
						
						if (point.visible === false) {
							visibility = HIDDEN;
						}
						
						if (visibility == VISIBLE) {
							lastY = y;
						}
							
						
						if (secondPass) {
						
							// move or place the data label
							dataLabel.animate({
								x: x + options.x 
									+ ({ left: connectorPadding, right: -connectorPadding }[labelPos[6]] || 0),
								y: y + options.y							
							});
							dataLabel.attr('visibility', visibility);
							
							
							// draw the connector
							connector = point.connector;
								
							connectorPath = [
								M,
								x + (labelPos[6] == 'left' ? 5 : -5), y, // end of the string at the label
								L,
								x, y, // first break, next to the label
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
									stroke: options.connectorColor || '#606060',
									visibility: visibility
								}).add(series.dataLabelsGroup);
							}
						}
					}
				});
			}
		}
	},
	
	/* *
	 * Draw a connector from an individual point to its data label
	 * @todo: add this code in the same method as above to be able to reuse calculations
	 * /
	drawConnector: function(point) {


	},*/
	
	/**
	 * Draw point specific tracker objects. Inherit directly from column series.
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,
	
	/**
	 * Pies don't have point marker symbols
	 */
	getSymbol: function() {}
	
});
seriesTypes.pie = PieSeries;


// global variables
win.Highcharts = {
	Chart: Chart,
	dateFormat: dateFormat,
	getOptions: getOptions,
	numberFormat: numberFormat,
	Point: Point,
	Renderer: Renderer,
	seriesTypes: seriesTypes,
	setOptions: setOptions,
	Series: Series,
		
	// Expose utility funcitons for modules
	addEvent: addEvent,
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	extend: extend,
	map: map,
	merge: merge,
	pick: pick,
	extendClass: extendClass
};
})();

