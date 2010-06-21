// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
/** 
 * @license Highcharts JS v1.2.6 (prerelease)
 * 
 * (c) 2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

/*
 * Roadmap
 * 
 * 2.0 (summer 2010)
 * - Rewritten rendering engine to SVG/VML
 * - Save as image
 * - Print chart - open in a popup and call window.print.
 * - Improvements to the toolbar object to allow the two above
 * 
 * 2.1 (summer/autumn 2010)
 * - Logarithmic axis
 * - Built-in table parser
 * - Base value for column, bar and area series
 * - Automatic margin size based on axis label size and legend. Anti-collision logic for labels.
 * - Floating columns and bars
 * - Candlestick charts
 * - Stock charts?
 * - Radar charts?
 * 
 * 2.2 (autumn 2010)
 * - Improve pies: shadow, better dataLabels, 3D view.
 *
 */


(function() {

// encapsulated variables
var 
	// abstracts to make compiled code smaller
	undefined,
	doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathMax = math.max,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,	
	
	
	// some variables
	userAgent = navigator.userAgent,
	isIE = /msie/i.test(userAgent) && !win.opera,
	isWebKit = /AppleWebKit/.test(userAgent),
	styleTag,
	canvasCounter = 0,
	colorCounter,
	symbolCounter,
	symbolSizes = {},
	idCounter = 0,
	timeFactor = 1, // 1 = JavaScript time, 1000 = Unix time
	garbageBin,
	
	// some constants for frequently used strings
	DIV = 'div',
	ABSOLUTE = 'absolute',
	RELATIVE = 'relative',
	HIDDEN = 'hidden',
	HIGHCHARTS_HIDDEN = 'highcharts-' + HIDDEN,
	VISIBLE = 'visible',
	PX = 'px',
	
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
	fireEvent = adapter.fireEvent,
	animate = adapter.animate,
	getAjax = adapter.getAjax,
	
	// lookup over the types and the associated classes
	seriesTypes = {};
	
	
// the jQuery adapter
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
		
	}
	merge = function(){
		var args = arguments;
		return jQ.extend(true, null, args[0], args[1], args[2], args[3]);
	}
	hyphenate = function (str){
		return str.replace(/([A-Z])/g, function(a, b){ return '-'+ b.toLowerCase() });
	}
	addEvent = function (el, event, fn){
		jQ(el).bind(event, fn);
	}
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
	}

	animate = function (el, params, options) {
		jQ(el).animate(params, options);
	}
	getAjax = function (url, callback) {
		jQ.get(url, null, callback);
	}
	
	jQ.extend( jQ.easing, {
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
	
// the MooTools adapter
} else if (!globalAdapter && win.MooTools) {
	
	each = $each;
	
	map = function (arr, fn){
		return arr.map(fn);
	}
	
	grep = function(arr, fn) {
		return arr.filter(fn)
	}
	
	merge = $merge;
	
	hyphenate = function (str){
		return str.hyphenate();
	}
	
	addEvent = function (el, type, fn) {
		// if the addEvent method is not defined, el is a custom Highcharts object
		// like series or point
		if (!el.addEvent) {
			if (el.nodeName) el = $(el); // a dynamically generated node
			else extend(el, new Events()); // a custom object
		} 
		el.addEvent(type, fn);
	}
	fireEvent = function(el, event, eventArguments, defaultFunction) {
		// create an event object that keeps all functions		
		event = new Event({ 
			type: event,
			target: el
		});
		event = extend (event, eventArguments);
		// override the preventDefault function to be able to use
		// this for custom events
		event.preventDefault = function() {
			defaultFunction = null;
		}
		// if fireEvent is not available on the object, there hasn't been added
		// any events to it above
		if (el.fireEvent) el.fireEvent(event.type, event);
		
		// fire the default if it is passed and it is not prevented above
		if (defaultFunction) defaultFunction(event);
		
	}
	animate = function (el, params, options){
		var myEffect = new Fx.Morph($(el), extend(options, {
	 		transition: Fx.Transitions.Quad.easeInOut
	 	}));
		myEffect.start(params);
	}
	getAjax = function (url, callback) {
		(new Request({
			url: url,
			method: 'get',
			onSuccess: callback
		})).send();			
	}
} 

/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
function splat(obj) {
	if (!obj || obj.constructor != Array) obj = [obj];
	return obj; 
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined (obj) {
	return obj !== undefined && obj !== null;
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
		if (defined(arg)) return arg;
	};
}

/**
 * Dynamically add a CSS rule to the page
 * @param {String} selector
 * @param {Object} declaration
 * @param {Boolean} print Whether to add the styles only to print media. IE only.
 */
function addCSSRule(selector, declaration, print) {
	
	var key,
		serialized = '',
		styleSheets,
		last,
		media = print ? 'print' : '',
		createStyleTag = function(print) {
			return createElement(
				'style', { 
					type: 'text/css',
					media: print ? 'print' : ''
				}, 
				null, 
				doc.getElementsByTagName('HEAD')[0]
			);

		};
	
	// add the style tag the first time
	if (!styleTag) styleTag = createStyleTag();
		
		
	// serialize the declaration
	for (key in declaration)
		serialized += hyphenate(key) +':'+ declaration[key] + ';';
	
	if (!isIE) { // create a text node in the style tag
		styleTag.appendChild(
			doc.createTextNode(
				selector + " {" + serialized + "}\n"
			)
		);
	} else { // get the last stylesheet and add rules
		
		var styleSheets = doc.styleSheets, 
			index,
			styleSheet;
			
			
		if (print) { // only in IE for now
			createStyleTag(true);
		}
		
		
		
		index = styleSheets.length - 1;
		while (index >= 1 && styleSheets[index].media != media) index--;
		
		
		styleSheet = styleSheets[index];
		styleSheet.addRule(selector, serialized);
	}
}
/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
function extend(a, b) {
	if (!a) a = {};
	for (var n in b) a[n] = b[n];
	return a;
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
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
function discardElement(element) {
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) garbageBin = createElement(DIV);
	
	// move the node and empty bin
	if (element) garbageBin.appendChild(element);
	garbageBin.innerHTML = '';
}

var defaultFont = 'normal 12px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',

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
		font: defaultFont.replace('12px', '11px') 
		//'10px bold "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'	
	}
},
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
		//className: null,
		/*events: {
		 * 	load,
		 * 	selection
		 * },
		 */
		margin: [50, 50, 60, 80],
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 5,		
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		//style: {},
		//backgroundColor: null,
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0'
		//plotBorderWidth: 0,
		//plotShadow: false,
		//zoomType: ''
	},
	title: {
		text: 'Chart title',
		style: {
			textAlign: 'center',
			color: '#3E576F',
			font: defaultFont.replace('12px', '16px'),
			margin: '10px 0 0 0'
		}

	},
	subtitle: {
		text: '',
		style: {
			textAlign: 'center',
			color: '#6D869F',
			font: defaultFont,
			margin: 0
		}
	},
	
	plotOptions: {
		line: { // base series options
			allowPointSelect: false,
			//allowDrag: false, // point dragging - not yet implemented
			//dragType: 'y',
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
				symbol: 'auto',
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				fillColor: 'auto',
				states: { // states for a single point
					hover: {
						//radius: base + 2
					},
					select: {
						fillColor: '#FFFFFF',
						lineColor: 'auto',
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
			}
		}
	},
	labels: {
		//items: [],
		style: {
			position: ABSOLUTE,
			color: '#3E576F',
			font: defaultFont
		}
	},
	legend: {
		enabled: true,
		layout: 'horizontal',
		labelFormatter: function() {
			return this.name
		},
		//borderWidth: 0,
		borderColor: '#909090',
		borderRadius: 5,
		shadow: true,
		//backgroundColor: null,
		style: {
			bottom: '10px',
			left: '80px',
			padding: '5px'
		},
		itemStyle: {
			listStyle: 'none',
			margin: 0,
			padding: '0 2em 0 0', // make room for the checkbox
			font: defaultFont,
			cursor: 'pointer',
			color: '#3E576F',
			position: RELATIVE // to allow absolute placement of the checkboxes
		},
		itemHoverStyle: {
			color: '#000'
		},
		itemHiddenStyle: {
			color: '#CCC'
		},
		itemCheckboxStyle: {
			position: ABSOLUTE,
			right: 0
		},
		//reversed: false, // docs
		symbolWidth: 16,
		symbolPadding: 5
	},
	
	loading: {
		hideDuration: 100,
		labelStyle: {
			font: defaultFont.replace('normal', 'bold'),
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
		snap: 10,
		style: {
			color: '#333333',
			font: defaultFont,
			fontSize: '9pt',
			padding: '5px',
			whiteSpace: 'nowrap'
		}
	},
	
	toolbar: {
		itemStyle: {
			color: '#4572A7',
			cursor: 'pointer',
			margin: '20px',
			font: defaultFont
		}
	},
	
	credits: {
		enabled: true,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		style: {
			position: ABSOLUTE,
			right: '10px',
			bottom: '5px',
			color: '#999',
			textDecoration: 'none',
			font: defaultFont.replace('12px', '10px')
		},
		target: '_self'
	}
};

// Axis defaults
//defaultOptions.xAxis = merge(defaultOptions.axis);
var defaultXAxisOptions =  {
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
	maxZoom: null,
	minorGridLineColor: '#E0E0E0',
	minorGridLineWidth: 1,
	minorTickColor: '#A0A0A0',
	//minorTickInterval: null,
	minorTickLength: 2,
	minorTickPosition: 'outside', // inside or outside
	minorTickWidth: 1,
	//plotBands: [],
	//plotLines: [],
	//reversed: false,
	showFirstLabel: true,
	showLastLabel: false,
	startOfWeek: 1, 
	startOnTick: false,
	tickColor: '#C0D0E0',
	tickInterval: 'auto',
	tickLength: 5,
	tickmarkPlacement: 'between', // on or between
	tickPixelInterval: 100,
	tickPosition: 'outside',
	tickWidth: 1,
	title: {
		enabled: false,
		text: 'X-values',
		align: 'middle', // low, middle or high
		margin: 35,
		//rotation: 0,
		//side: 'outside',
		style: {
			color: '#6D869F',
			font: defaultFont.replace('normal', 'bold')
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
		enabled: true,
		margin: 40,
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
	//dragType: 'xy', // n/a
	lineWidth: 0,
	states: {
		hover: {
			lineWidth: 0
		}
	}
});
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: .75,
	fillColor: 'auto'

});
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);
defaultPlotOptions.column = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	borderRadius: 0,
	groupPadding: 0.2,
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
	legendType: 'point',
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


// class-like inheritance
function extendClass(parent, members) {
	var object = function(){};
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}
/*
function reverseArray(arr) {
	var reversed = [];
	for (var i = arr.length - 1; i >= 0; i--)
		reversed.push( arr[i]);
	return reversed;
}
*/
// return a deep value without throwing an error
/*function deepStructure(obj, path) {
	// split the path into an array
	path = path.split('.'), i = 0;
	// recursively set obj to the path
	while (path[i] && obj) obj = obj[path[i++]];
	
	if (i == path.length) return obj;
}*/

/**
 * Create a color from a string or configuration object
 * @param {Object} val
 */
function setColor(val, ctx) {
	if (typeof val == 'string') {
		return val;

	} else if (val.linearGradient) {
		var gradient = ctx.createLinearGradient.apply(ctx, val.linearGradient);
		each (val.stops, function(stop) {
			gradient.addColorStop(stop[0], stop[1]);
		});
		return gradient;
	}
}


var Color = function(input) {
	var rgba = [], result;
	function parse(input) {
		
		// rgba
		if((result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(input)))
			rgba = [parseInt(result[1]), parseInt(result[2]), parseInt(result[3]), parseFloat(result[4])];	

		// hex
		else if((result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(input)))
			rgba = [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16), 1];
	
	}
	function get() {
		// it's NaN if gradient colors on a column chart
		if (rgba && !isNaN(rgba[0])) return 'rgba('+ rgba.join(',') +')';
		else return input;
	}
	
	function brighten(alpha) {
		if (typeof alpha == 'number' && alpha != 0) {
			for (var i = 0; i < 3; i++) {
				rgba[i] += parseInt(alpha * 255);
				if (rgba[i] < 0) rgba[i] = 0;
				if (rgba[i] > 255) rgba[i] = 255;
			}
		}
		return this;
	}
	
	function setOpacity(alpha) {
		rgba[3] = alpha;
		return this;
	}	
	
	parse(input);
	
	// public methods
	return {
		get: get,
		brighten: brighten,
		setOpacity: setOpacity
	};
};

	//defaultMarkers = ['circle'];


function createElement (tag, attribs, styles, parent, nopad) {
	var el = doc.createElement(tag);
	if (attribs) extend(el, attribs);
	if (nopad) setStyles(el, {padding: 0, border: 'none', margin: 0});
	if (styles) setStyles(el, styles);
	if (parent) parent.appendChild(el);	
	return el;
};

function setStyles (el, styles) {
	//for (var x in styles) el.style[x] = styles[x];
	if (isIE) {
		if (styles.opacity !== undefined) 
			styles.filter = 'alpha(opacity='+ (styles.opacity * 100) +')';	
	}
	
	extend(el.style, styles);

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
    	i = parseInt(n = mathAbs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
};

/**
 * Based on http://www.php.net/manual/en/function.strftime.php 
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
function dateFormat(format, timestamp, capitalize) {
	function pad (number) {
		return number.toString().replace(/^([0-9])$/, '0$1');
	}
	
	if (!defined(timestamp) || isNaN(timestamp)) return 'Invalid date';
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
	for (var key in replacements) format = format.replace('%'+ key, replacements[key]);
		
	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};

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
		
};

/**
 * Return the absolute page position of an element
 * @param {Object} el
 */
function getPosition (el)	{
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


var Layer = function (name, appendTo, props, styles) {
	var layer = this,
		div,
		appendToStyle = appendTo.style;
	props = extend({
		className: 'highcharts-'+ name
	}, props);
	styles = extend({
		width: appendToStyle.width, //appendTo.offsetWidth + PX,
		height: appendToStyle.height, //appendTo.offsetHeight + PX,
		position: ABSOLUTE,
		top: 0,
		left: 0,
		margin: 0,
		padding: 0,
		border: 'none'		
	}, styles);
	
	div = createElement(DIV, props, styles, appendTo);
	
	extend(layer, {
		div: div,
		width: parseInt(styles.width),
		height: parseInt(styles.height)
	});
	
	// initial SVG string
	layer.svg = isIE ? '' : '<?xml version="1.0" encoding="utf-8"?>'+
		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" '+
		'xmlns:xlink="http://www.w3.org/1999/xlink" width="'+ layer.width 
		+'px" height="'+ layer.height +'">';
			
	// save it for later
	layer.basicSvg = layer.svg;	
}
Layer.prototype = {
	getCtx: function() {
		if (!this.ctx) {
			var cvs = createElement('canvas', {
				id: 'highcharts-canvas-' + idCounter++,
				width: this.width,
				height: this.height
			}, {
				position: ABSOLUTE
			}, this.div);
			
			if (isIE) {
				G_vmlCanvasManager.initElement(cvs);
				cvs = doc.getElementById(cvs.id);
			}
		
			this.ctx = cvs.getContext('2d');			
		}
		
		return this.ctx;
	},
	getSvg: function() {
		if (!this.svgObject) {
			var layer = this,
				div = layer.div,
				width = layer.width,
				height = layer.height;
			if (isIE) {
				// create xmlns if excanvas hasn't done it
		        if (!doc.namespaces["g_vml_"]) {
					doc.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml");
					// setup default css
					doc.createStyleSheet().cssText = "g_vml_\\:*{behavior:url(#default#VML)}";
		        }
				this.svgObject = createElement(DIV, null, {
					width: width + PX,
					height: height + PX,
					position: ABSOLUTE
				}, div);
				
		    
			} else {
				// create an object and inject SVG into it
				this.svgObject = createElement('object', { 
					width: width,
					height: height,
					type: 'image/svg+xml'
				}, {
					position : ABSOLUTE,
					left: 0,
					top: 0
				}, div);
			}
		}
		return this.svgObject;
	},
	drawLine: function(x1, y1, x2, y2, color, width) {		
		var ctx = this.getCtx(), xBefore = x1;
		
		// normalize to a crisp line
		if (x1 == x2) x1 = x2 = mathRound(x1) + (width % 2 / 2);
		if (y1 == y2) y1 = y2 = mathRound(y1) + (width % 2 / 2);
		
		// draw path
		ctx.lineWidth = width;
		ctx.lineCap = 'round'; /* If this is not set, plotBands appear
			like 'square' in Firefox/Win. Reason unknown. */ 
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.strokeStyle = color;
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.stroke();
	},
	
	drawPolyLine: function(points, color, width, shadow, fillColor) {
		var ctx = this.getCtx(),
			shadowLine = [];
		// the shadow
		if (shadow && width) {
			each (points, function(point) { // add 1px offset
				shadowLine.push(point === undefined ? point : point + 1);
			}); 
			for (var i = 1; i <= 3; i++) // three lines of differing thickness and opacity
				this.drawPolyLine(shadowLine, 'rgba(0, 0, 0, '+ (0.05 * i) +')', 6 - 2 * i);
		}
		
		// the line path
		ctx.beginPath();
		for (i = 0; i < points.length; i += 2) 
			ctx[i == 0 ? 'moveTo' : 'lineTo'](points[i], points[i + 1]);
		
		// common properties
		extend(ctx, {
			lineWidth: width,
			lineJoin: 'round'
		});
		
		// stroke 
	    if (color && width)	{
			ctx.strokeStyle = setColor(color, ctx); 
			ctx.stroke();
		}
		
		// fill
		if (fillColor) {
			ctx.fillStyle = setColor(fillColor, ctx);
			ctx.fill();
		}
		
	},
	drawRect: function(x, y, w, h, color, width, radius, fill, shadow, image) {
		// must (?) be done twice to apply both stroke and fill in excanvas
		var drawPath = function() {
			var ret;
			if (w > 0 && h > 0) { // zero or negative dimensions break Opera 10
				ctx.beginPath();
				if (!radius) {
					ctx.rect(x, y, w, h);
				} else {
					ctx.moveTo(x, y + radius);
					ctx.lineTo(x, y + h - radius);
					ctx.quadraticCurveTo(x, y + h, x + radius, y + h); // change: use bezier
					ctx.lineTo(x + w - radius, y + h);
					ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - radius);
					ctx.lineTo(x + w, y + radius);
					ctx.quadraticCurveTo(x + w, y , x + w - radius, y);
					ctx.lineTo(x + radius, y);
					ctx.quadraticCurveTo(x , y, x, y + radius);
				}
				ctx.closePath();
				ret = true;
			}
			return ret;
		};
		
		var ctx = this.getCtx(), normalizer = (width || 0) % 2 / 2;

		// normalize for sharp edges
		x = mathRound(x) + normalizer;
		y = mathRound(y) + normalizer;
		w = mathRound(w - 2 * normalizer);
		h = mathRound(h - 2 * normalizer);

				
		// apply the drop shadow
		if (shadow) for (var i = 1; i <= 3; i++) {
	    	this.drawRect(x + 1, y + 1, w, h, 'rgba(0, 0, 0, '+ (0.05 * i) +')', 
	    		6 - 2 * i, radius);
		}

		// apply the background image behind everything
		if (image) ctx.drawImage(image, x, y, w, h);
		
		if (drawPath()) {
			if (fill) {
				ctx.fillStyle = setColor(fill, ctx);
				ctx.fill();
				// draw path again
				if (win.G_vmlCanvasManager) drawPath();
			}
			if (width) {
				ctx.strokeStyle = setColor(color, ctx);
				ctx.lineWidth = width;
				ctx.stroke();
			}
		}

	},
	drawSymbol: function(symbol, x, y, radius, lineWidth, lineColor, fillColor) {
		var ctx = this.getCtx(),
			imageRegex = /^url\((.*?)\)$/;
		ctx.beginPath();
		
		if (symbol == 'square') {
			var len = 0.707 * radius;
			ctx.moveTo(x - len, y - len);
			ctx.lineTo(x + len, y - len);
			ctx.lineTo(x + len, y + len);
			ctx.lineTo(x - len, y + len);
			ctx.lineTo(x - len, y - len);
			
		} else if (symbol == 'triangle') {
			y++;
			ctx.moveTo(x, y - 1.33 * radius);
			ctx.lineTo(x + radius, y + 0.67 * radius);
			ctx.lineTo(x - radius, y + 0.67 * radius);
			ctx.lineTo(x, y - 1.33 * radius);
			
		} else if (symbol == 'triangle-down') {
			y--;
			ctx.moveTo(x, y + 1.33 * radius);
			ctx.lineTo(x - radius, y - 0.67 * radius);
			ctx.lineTo(x + radius, y - 0.67 * radius);
			ctx.lineTo(x, y + 1.33 * radius);
			
		} else if (symbol == 'diamond') {
			ctx.moveTo(x, y - radius);
			ctx.lineTo(x + radius, y);
			ctx.lineTo(x, y + radius);
			ctx.lineTo(x - radius, y);
			ctx.lineTo(x, y - radius);
			
		} else if (imageRegex.test(symbol)) {
			createElement('img', {
				onload: function() {
					var img = this,
						size = symbolSizes[img.src] || [img.width, img.height];
					setStyles(img, {
						left: mathRound(x - size[0] / 2) + PX,
						top: mathRound(y - size[1] / 2) + PX,
						visibility: VISIBLE
					})
					// Bug workaround: Opera (10.01) fails to get size the second time
					symbolSizes[img.src] = size;
				},
				src: symbol.match(imageRegex)[1]
			}, {
				position: ABSOLUTE,
				visibility: isIE ? VISIBLE : HIDDEN // hide until left and top are set in Gecko
			}, this.div);
			
		} else { // default: circle
			ctx.arc(x, y, radius, 0, 2*math.PI, true);
		} 
	
		if (fillColor) {
			ctx.fillStyle = fillColor;
			ctx.fill();
			
			// draw path again
			//if (isIE) ctx.arc(x, y, radius, 0, 2*Math.PI, true);
		}
		if (lineColor && lineWidth) {
			ctx.strokeStyle = lineColor || "rgb(100, 100, 255)";
	    	ctx.lineWidth = lineWidth || 2;
	    	ctx.stroke();
		}
	},
	drawHtml: function(html, attributes, styles) {
		createElement(
			DIV, 
			extend(attributes, { innerHTML: html }), 
			extend(styles, { position: ABSOLUTE}),
			this.div
		);
	},
	/**
	 * Add text and draw it. For those browsers adding the text to an SVG object,
	 * it is better for performance to add all strings before the object 
	 * is created. This function takes the same arguments as addText.
	 * 
	 * @param {string} str
	 * @param {number} x
	 * @param {number} y
	 * @param {object} style
	 * @param {number} rotation
	 * @param {string} align
	 */
	drawText: function() {
		this.addText.apply(this, arguments);
		this.strokeText();
	},
	addText: function(str, x, y, style, rotation, align) {
		if (str || str === 0) {
			
			// declare variables
			var layer = this,
				hasObject,
				div = layer.div,
				CSStransform,
				css = '', 
				style = style || {},
				fill = style.color || '#000000',
				align = align || 'left',
				fontSize = parseInt(style.fontSize || style.font.replace(/^[a-z ]+/, '')),
				span,
				spanWidth,
				transformOriginX;
		
			
			// prepare style
			for (var key in style) css += hyphenate(key) +':'+ style[key] +';';
			
			// what transform property is supported?
			each (['MozTransform', 'WebkitTransform', 'transform'], function(str) {
				if (str in div.style) CSStransform = str;
			});
			
			// if the text is not rotated, or if the browser supports CSS transform,
			// write a simple span
			if (!rotation || CSStransform) {
				span = createElement('span', {
					innerHTML: str
				}, extend(style, {
					position: ABSOLUTE,
					left: x + PX,
					whiteSpace: 'nowrap',
					bottom: mathRound(layer.height - y - fontSize * 0.25) + PX,
					color: fill
				}), div);
				
				// fix the position according to align and rotation
				spanWidth = span.offsetWidth;
				
				if (align == 'right') setStyles(span, {
					left: (x - spanWidth) + PX
				});
				else if (align == 'center') setStyles(span, { 
					left: mathRound(x - spanWidth / 2) + PX
				});
				
				if (rotation) {  // ... and CSStransform
					transformOriginX = { left: 0, center: 50, right: 100 }[align]
					span.style[CSStransform] = 'rotate('+ rotation +'deg)';
					span.style[CSStransform +'Origin'] = transformOriginX +'% 100%';					
				}
				
			} else if (isIE) {
				// to achieve rotated text, the ie text is drawn on a vector line that
				// is extrapolated to the left or right or both depending on the 
				// alignment of the text
				hasObject = true;
				var radians = (rotation || 0) * math.PI * 2 / 360, // deg to rad
					costheta = mathCos(radians),
					sintheta = mathSin(radians),
					length = layer.width, // the text is not likely to be longer than this
					baselineCorrection = fontSize / 3 || 3,
					left = align == 'left',
					right = align == 'right',
					x1 = left ? 	x : x - length * costheta,
					x2 = right ?	x : x + length * costheta,
					y1 = left ? 	y : y - length * sintheta,
					y2 = right ?	y : y + length * sintheta;
					
					
				// IE seems to always draw the text with v-text-align middle, so we need 
				// to correct for that by moving the path
				x1 += baselineCorrection * sintheta;
				x2 += baselineCorrection * sintheta;
				y1 -= baselineCorrection * costheta;
				y2 -= baselineCorrection * costheta;
				
				if (mathAbs(x1 - x2) < 0.1) x1 += 0.1; // strange IE painting bug
				if (mathAbs(y1 - y2) < 0.1) y1 += 0.1; // strange IE painting bug
				layer.svg += 
					'<g_vml_:line from="'+ x1 +', '+ y1 +'" to="'+ x2 +', '+ y2 +'" stroked="false">'+
						'<g_vml_:fill on="true" color="'+ fill +'"/>'+
						'<g_vml_:path textpathok="true"/>'+
						'<g_vml_:textpath on="true" string="'+ str +'" '+
							'style="v-text-align:'+ align + 
							';'+ css +'"/>'+
					'</g_vml_:line>';
					
			// svg browsers
			} else { 
				hasObject = true;
				layer.svg +=  
					'<g>'+
						'<text transform="translate('+ x +','+ y +
							') rotate('+ (rotation || 0) +')" '+
							'style="fill:'+ fill +';text-anchor:'+ 
							{ left: 'start', center: 'middle', right: 'end' }[align] +
				 			';'+ css.replace(/"/g, "'") +'">'+	str+
						'</text>'+
					'</g>';
			}
			
			if (hasObject) layer.hasObject = hasObject;
		}
	},
	/*
	Experimental text rendering using canvas text. Speed and possibly weight are the advantages.
	Excanvas trunk supports canvas text, but not current version (2009-11-03). Older Gecko and Webkit
	browsers and Opera needs SVG approach, so all in all there is not much weight spared by this one.
	Furthermore, CanvasText looks crappy in Firefox, but on the other hand, SVG object make the tooltip
	animation slow.
	
	2009-11-07: Preliminary conclusion:
		- IE: Use VML on a textpath. The con is that IE8 renders all text as bold italic. Possibly
			experiment with CSS text rotation for whole 90 degrees if that's supported by IE8.
		- Firefox >= 3.5 (Gecko 1.9.1 was it?) and Webkit > ?: Use CSS transforms to rotate the text.
			Canvas and textFill would be a better and faster alternative, but the text is very badly
			drawn in Firefox. When that's fixed in future versions, go for Canvas and textFill instead.
		- Opera, older Gecko and older Webkit: Use SVG. It is slow, and all the text has to be added 
			before written to the SVG object. Hence the addText and strokeText functions. When Opera 
			starts supporting textFill or text rotate, use that instead.
		
	
	_addText: function(str, x, y, style, rotation, anchor) {
		if (str || str === 0) {
		
			// declare variables
			var css = '', 
				style = style || {},
				fill = style.color || '#000000',
				anchor = anchor || 'start',
				ctx,
				span,
				font = (style.font || '') +' '+ (style.fontSize || '') +' '+ 
					(style.fontWeight || '') +' '+ (style.fontFamily || ''),
				align = { start: 'left', middle: 'center', end: 'right' }[anchor],
				rotation = (rotation || 0) * math.PI * 2 / 360, // deg to rad
				fontSize = parseInt(style.fontSize || font); 
				
			// prepare style
			for (var key in style) css += hyphenate(key) +':'+ style[key] +';';
			
			if (rotation) {
				var ctx = this.getCtx();
				ctx.font = font;
				ctx.fillStyle = fill;
				ctx.textAlign = align;
				
				ctx.translate(x, y);
				ctx.rotate(rotation);
				ctx.fillText(str, 0, 0);
				ctx.rotate(-rotation);
				ctx.translate(-x, -y);
			} else {

			}
			
		}
	},*/
	strokeText: function() {
		if (this.hasObject) {
			var svgObject = this.getSvg(),
				svg = this.svg;
			if (isIE) {
				svgObject.innerHTML = svg;
			} else {
				svgObject.data = 
					'data:image/svg+xml,'+ svg +'</svg>';
					
				// append it again for Chrome to update
				if (isWebKit) this.div.appendChild(svgObject);
	
			}
		}
	},
	clear: function() {
		var layer = this,
			div = this.div,
			childNodes = div.childNodes,
			node;
		if (layer.ctx) layer.ctx.clearRect(0, 0, layer.width, layer.height);
		if (layer.svgObject) {
			discardElement(layer.svgObject);
			layer.svgObject = null;
			layer.svg = layer.basicSvg;
		}
		
		// remove all spans
		for (var i = childNodes.length - 1; i >= 0; i--) {
			node = childNodes[i];			
			if (/(SPAN|IMG)/.test(node.tagName)) discardElement(node);
		} 
		
	},
	hide: function() {
		setStyles (this.div, {
			display: 'none'
		})
		
		//jQuery(this.div).fadeOut(250);
		
		// A possible way to fade out in IE would be to get all the shapes
		// in the layer and change the opacities of their FillColor and StrokeColor
		/*var shapes = this.div.getElementsByTagName('shape');
		each (shapes, function(shape) {
			//shape.style.filter = 'alpha(opacity=59)';
			
		})	
		var layer = this;
		setTimeout(function() {
			layer.div.style.visibility = HIDDEN
		}, 2000);*/
	},
	show: function() {
		setStyles (this.div, {
			display: ''
		})
		//jQuery(this.div).fadeIn(50);
	},
	/**
	 * Discard layer DOM elements and null the reference
	 */
	destroy: function() {
		discardElement(this.div);
		return null;
	}
};


function Chart (options) {
	/**
	 * Add a series dynamically after  time
	 * 
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * 
	 * @return {Object} series The newly created series object
	 */
	function addSeries(options, redraw) {
		var series;
		
		redraw = pick(redraw, true); // defaults to true
		
		fireEvent(chart, 'addSeries', { options: options }, function() {
			series = initSeries(options);
			series.isDirty = true;
			
			chart.isDirty = true; // the series array is out of sync with the display
			if (redraw) chart.redraw();
		});
		
		return series;
	};

	/**
	 * Redraw legend, axes or series based on updated data
	 */
	function redraw() {
		var redrawLegend = chart.isDirty;
			
		// handle updated data in the series		
		each (series, function(serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				serie.cleanData();
				serie.getSegments();
				
				if (serie.options.legendType == 'point') redrawLegend = true;
			}
		});
		
		// reset maxTicks
		maxTicks = null;
		if (hasCartesianSeries) {
			// set axes scales
			each (axes, function(axis) {
				axis.setScale();
			})
			adjustTickAmounts();
	
			// redraw axes
			each (axes, function(axis) {
				if (axis.isDirty) axis.redraw();
			})
		}
		
		// redraw affected series
		each (series, function(serie) {
			if (serie.isDirty && serie.visible) serie.redraw();
		});
		
		// handle added or removed series 
		if (redrawLegend) { // series or pie points are added or removed
			// draw legend graphics
			if (legend && legend.renderHTML) {
				legend.renderHTML(true);
				legend.drawGraphics(true);
			}
			
			chart.isDirty = false;
		}

		// hide tooltip and hover states
		if (tracker && tracker.resetTracker) tracker.resetTracker();			
		
		
		// fire the event
		fireEvent(chart, 'redraw');
	}
	
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
			if (inverted && type == 'column') typeClass = BarSeries;
			else if (!inverted && type == 'bar') typeClass = ColumnSeries;
		}
		
		serie = new typeClass();
		
		serie.init(chart, options);
		
		// set internal chart properties
		if (!hasRendered && serie.inverted) inverted = true;
		if (serie.isCartesian) hasCartesianSeries = serie.isCartesian;
		
		series.push(serie);
		
		return serie;
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
				left: marginLeft + PX,
				top: marginTop + PX,
				width: plotWidth + PX,
				height: plotHeight + PX,
				zIndex: 10,
				display: 'none'
			}), container);
			
			createElement('span', {
				innerHTML: options.lang.loading
			}, loadingOptions.labelStyle, loadingLayer);
		}
		
		// show it
		setStyles(loadingLayer, { display: '' });
		animate(loadingLayer, {
			opacity: loadingOptions.style.opacity
		}, {
			duration: loadingOptions.showDuration
		});
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
				setStyles(loadingLayer, { display: 'none' });
			}
		});

	}
	
	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			match,
			data;
		
		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id == id) return axes[i];
		}
		
		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id == id) return series[i];
		}
		
		// search points
		for (i = 0; i < series.length; i++) {
			data = series[i].data;
			for (j = 0; j < data.length; j++) {
				if (data[j].id == id) return data[j];
			}
		}
		return null;	
	}
	
	/**
	 * Update the chart's position after it has been moved, to match
	 * the mouse positions with the chart
	 */
	function updatePosition() {
		var container = doc.getElementById(containerId);
		if (container) {
			position = getPosition(container);
		}
	}
	
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
	};
	
	/**
	 * Adjust all axes tick amounts
	 */
	function adjustTickAmounts() {
		if (optionsChart.alignTicks !== false) each (axes, function(axis) {
			axis.adjustTickAmount();
		});	
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
	};
	
	/**
	 * Get the currently selected series
	 */
	function getSelectedSeries() {
		return grep (series, function (serie) {
			return serie.selected;
		});
	}
	
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	function zoom(event) {
		var lang = defaultOptions.lang;
		
		// add button to reset selection
		chart.toolbar.add('zoom', lang.resetZoom, lang.resetZoomTitle, function() {
			//zoom(false);
			fireEvent(chart, 'selection', { resetSelection: true }, zoom);
			chart.toolbar.remove('zoom');
		});
		
		
		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) each(axes, function(axis) { 
			axis.setExtremes(null, null, false);
		});
			
		// else, zoom in on all axes
		else {
			each (event.xAxis.concat(event.yAxis), function(axisData) {
				var axis = axisData.axis;
					
				// don't zoom more than maxZoom
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY'])
					axis.setExtremes(axisData.min, axisData.max, false);
			});
		}
		
		// redraw chart
		redraw();
		
	}
	
	/**
	 * Function: (private) showTitle
	 * 
	 * Show the title and subtitle of the chart
	 */
	function showTitle () {
		var title = options.title,
			subtitle = options.subtitle;
			
		if (!chart.titleLayer) {
			var titleLayer = new Layer('title-layer', container, null, {
				zIndex: 2
			});
			
			// title
			if (title && title.text) createElement('h2', {
				className: 'highcharts-title',
				innerHTML: title.text
			}, title.style, titleLayer.div);
			
			// subtitle
			if (subtitle && subtitle.text) createElement('h3', {
				className: 'highcharts-subtitle',
				innerHTML: subtitle.text
			}, subtitle.style, titleLayer.div);
			
			chart.titleLayer = titleLayer;
		}
	}
	/**
	 * Load graphics and data required to draw the chart
	 */
	function checkResources() {
		var allLoaded = true;
		for (var n in chart.resources) {
			if (!chart.resources[n]) allLoaded = false;
		}
		if (allLoaded) resourcesLoaded();
	};
	
	/**
	 * Prepare for first rendering after all data are loaded
	 */
	function resourcesLoaded() {
		
		getAxes();
		
		
		// Prepare for the axis sizes
		each(series, function(serie) {
			serie.translate();
			serie.setTooltipPoints();
			/*if (options.tooltip.enabled) */ serie.createArea();
		});	
		
		chart.render = render;
		
		setTimeout(function() { // IE(7) needs timeout
			render();
			fireEvent(chart, 'load');
			
		}, 0); 
		
	}
	
	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	function getContainer() {
		renderTo = optionsChart.renderTo;
		containerId = 'highcharts-'+ idCounter++;
	
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
			setStyles(renderToClone, {
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
			(renderToOffsetHeight > marginTop + marginBottom ? renderToOffsetHeight : 0) || 
			400;
		
		// create the inner container
		container = createElement(DIV, {
				className: 'highcharts-container' + 
					(optionsChart.className ? ' '+ optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN,
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left'
			}, optionsChart.style),
			renderToClone || renderTo
		);
	}
	/**
	 * Render all graphics for the chart
	 */
	function render () {
		var mgn, 
			div, 
			i, 
			labels = options.labels, 
			credits = options.credits;
		
		
		// Chart area
		mgn = 2 * (optionsChart.borderWidth || 0) + (optionsChart.shadow ? 8 : 0);
		backgroundLayer.drawRect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn, 
			optionsChart.borderColor, optionsChart.borderWidth, optionsChart.borderRadius, 
			optionsChart.backgroundColor, optionsChart.shadow);
		
		
		// Plot background
		backgroundLayer.drawRect(
			marginLeft, 
			marginTop, 
			plotWidth, 
			plotHeight, 
			null, 
			null, 
			null, 
			optionsChart.plotBackgroundColor, 
			null, 
			plotBackground
		);
		
		// Plot area border
		(new Layer('plot-border', container, null, {
			zIndex: 4 // in front of grid lines and graphs, behind axis lines
		})).drawRect(
			marginLeft, 
			marginTop, 
			plotWidth, 
			plotHeight, 
			optionsChart.plotBorderColor, 
			optionsChart.plotBorderWidth, 
			null, 
			null, 
			optionsChart.plotShadow
		);
			
		
		// Printing CSS for IE
		if (isIE) addCSSRule('.highcharts-image-map', { display: 'none' }, 'print');
		
		// Axes
		if (hasCartesianSeries) each(axes, function(axis) { 
			axis.render();
		});
	
		// Title
		showTitle();
		
		
		// Labels
		if (labels.items)	each (labels.items, function () {
			var attributes = extend({ className: 'highcharts-label' }, this.attributes);
			plotLayer.drawHtml(this.html, attributes, extend(labels.style, this.style));
		});

		// The series
		each (series, function(serie) {
			serie.render();
		});
		
		// Legend
		legend = chart.legend = new Legend(chart);

		
		// Toolbar (don't redraw)
		if (!chart.toolbar) chart.toolbar = Toolbar(chart);
		
		// Credits
		if (credits.enabled && !chart.credits) 
			chart.credits = createElement('a', {
				className: 'highcharts-credits',
				href: credits.href,
				innerHTML: credits.text,
				target: credits.target
			}, extend(credits.style, {
				zIndex: 8
			}), container);

		// Set flag
		chart.hasRendered = true;
		
		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
			updatePosition()
		}
	};
	
	/**
	 * Clean up memory usage
	 */
	function destroy() {
		

		/**
		 * Clear certain attributes from the element
		 * @param {Object} d
		 */
		function purge(d) {
		    var a = d.attributes, i, l, n;
		    if (a) {
		        l = a.length;
		        for (i = l - 1; i >= 0; i -= 1) {
		            n = a[i].name;
					
					try {
			            //if (typeof d[n] != 'object' && !/^(width|height)$/.test(n)) {
						if (typeof d[n] == 'function') {
							d[n] = null;
			            }
					} catch (e) {
						// IE/excanvas produces errors on some of the properties
					}
					
		        }
		    }
			
		    a = d.childNodes;
		    if (a) {
		        l = a.length;
		        for (i = l - 1; i >= 0; i--) {
		            var node = d.childNodes[i];
					purge(node);	
					
					if (!node.childNodes.length) discardElement(node);			
		        }
		    }
			
		}
		
		// destroy each series
		each (series, function(serie) {
			serie.destroy();
		});
		series = [];
		
		
		purge(container);
	};
	
	/**
	 * Create a new axis object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function Axis (chart, options) {
		
		/**
		 * Set the options by merging the inheritance line
		 */
		function setOptions() {
			options = merge(
				isXAxis ? defaultXAxisOptions : defaultYAxisOptions,
				//defaultOptions[isXAxis ? 'xAxis' : 'yAxis'],
				horiz ? 
					(opposite ? defaultTopAxisOptions : defaultBottomAxisOptions) :
					(opposite ? defaultRightAxisOptions : defaultLeftAxisOptions),
				options
			);		
		};

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
						// we're in the right x or y dimension, and...
						(strAxis == 'xAxis' && isXAxis || strAxis == 'yAxis' && !isXAxis) && (
							// the axis number is given in the options and matches this axis index, or
							(serie.options[strAxis] == options.index) || 
							// the axis index is not given
							(serie.options[strAxis] === undefined && options.index == 0)
						)
					) {
						serie[strAxis] = axis;
						associatedSeries.push(serie);
						
						// the series is visible, run the min/max detection
						run = true;		
					}
				});
				// ignore hidden series if opted 
				if (!serie.visible && optionsChart.ignoreHiddenSeries) run = false;				
				
				if (run) {
					
					var stacking;
		
					if (!isXAxis) {
						stacking = serie.options.stacking;
						usePercentage = stacking == 'percent';
	
						// create a stack for this particular series type
						if (stacking) {
							var typeStack = stack[serie.type] || [];
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
								if (pointX > dataMax) dataMax = pointX;
								else if (pointX < dataMin) 	dataMin = pointX;
								
							}
							
							// y axis
							else if (defined(pointY)) {
								if (stacking) 
									typeStack[pointX] = typeStack[pointX] ? typeStack[pointX] + pointY : pointY;
								
								var stackedPoint = typeStack ? typeStack[pointX] : pointY;
								if (!usePercentage) {
									if (stackedPoint > dataMax) dataMax = stackedPoint;
									else if (stackedPoint < dataMin) dataMin = stackedPoint;
								}
								if (stacking) stacks[serie.type][pointX] = { 
									total: stackedPoint,
									cum: stackedPoint 
								};
							}
						});
						
							
						// For column, areas and bars, set the minimum automatically to zero
						// and prevent that minPadding is added in setScale
						if (!isXAxis && /(area|column|bar)/.test(serie.type)) {
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
			
			
		};
	
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
				if (reversed) val = axisLength - val;
				returnValue = val / transA + min; // from chart pixel to value				
			
			} else { // normal translation
				returnValue = sign * (val - min) * transA + cvsOffset; // from value to chart pixel
			}
			
			return returnValue;
		};
		
		/**
		 * Add a single line across the plot
		 */
		function drawPlotLine(value, color, width) {
			
			if (width) {
				var x1, 
					y1, 
					x2, 
					y2,
					translatedValue = translate(value),
					skip;
					
				x1 = x2 = translatedValue + transB;
				y1 = y2 = chartHeight - translatedValue - transB;
				
				if (horiz) { // horizontal axis, vertical plot line 
					y1 = marginTop;
					y2 = chartHeight - marginBottom;
					if (x1 < marginLeft || x1 > marginLeft + plotWidth) skip = true;
					
				} else { // vertical axis, horizontal plot line
					x1 = marginLeft;
					x2 = chartWidth - marginRight;
					if (y1 < marginTop || y1 > marginTop + plotHeight) skip = true;
				}
				if (!skip) gridLayer.drawLine(x1, y1, x2, y2, color, width);
				
			}
		};
		/**
		 * Add a masked band across the plot
		 * @param {Number} from chart axis value
		 * @param {Number} to chart axis value
		 * @param {String} color
		 */
		function drawPlotBand(from, to, color) {
			// keep within plot area
			from = mathMax(from, min);
			to = Math.min(to, max);  
			
			var width = (to - from) * transA;
			drawPlotLine(from + (to - from) / 2, color, width);
			
		}
		
		/**
		 * Add a tick mark an a label
		 */
		function addTick(pos, tickPos, color, width, len, withLabel, index) {
			var x1, y1, x2, y2, str, labelOptions = options.labels;
			
			// negate the length
			if (tickPos == 'inside') len = -len;
			if (opposite) len = -len;
			
			// set the initial positions
			x1 = x2 = translate(pos + tickmarkOffset) + transB;
			y1 = y2 = chartHeight - translate(pos + tickmarkOffset) - transB;
			
			if (horiz) {
				y1 = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;
				y2 = y1 + len;
			} else {
				x1 = marginLeft + (opposite ? plotWidth : 0) + offset;
				x2 = x1 - len;				
			}
			
			if (width) axisLayer.drawLine(x1, y1, x2, y2, color, width);
			
			
			// write the label
			if (withLabel && labelOptions.enabled) {
				str = labelFormatter.call({
					index: index,
					isFirst: pos == tickPositions[0],
					isLast: pos == tickPositions[tickPositions.length - 1],
					value: (categories && categories[pos] ? categories[pos] : pos)
				});
				if (str || str === 0) axisLayer.addText(
					str,
					x1 + labelOptions.x - (tickmarkOffset && horiz ? tickmarkOffset * transA * (reversed ? -1 : 1) : 0),
					y1 + labelOptions.y - (tickmarkOffset && !horiz ? tickmarkOffset * transA * (reversed ? 1 : -1) : 0),
					labelOptions.style, 
					labelOptions.rotation,
					labelOptions.align
				);
			}
			
		};
		
		/**
		 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
		 * @param {Number} interval
		 */
		function normalizeTickInterval(interval, multiples) {
			var normalized,
				allowDecimals = pick(options.allowDecimals, true);
				
			// round to a tenfold of 1, 2, 2.5 or 5
			magnitude = multiples ? 1 : math.pow(10, mathFloor(math.log(interval) / math.LN10));
			normalized = interval / magnitude;
			
			// multiples for a linear scale
			if (!multiples) {
				multiples = [1, 2, 2.5, 5, 10];
				
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
		};
	
		/**
		 * Set the tick positions to a time unit that makes sense, for example
		 * on the first of each month or on every Monday.
		 */
		function setDateTimeTickPositions() {
			tickPositions = [];
			var useUTC = defaultOptions.global.useUTC,
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
					oneMinute,				// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'hour',							// unit name
					oneHour,			// fixed incremental unit
					[1, 2, 3, 4, 6, 8, 12]			// allowed multiples
				], [
					'day',							// unit name
					oneDay,		// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'week',							// unit name
					oneWeek,	// fixed incremental unit
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
			for (var i = 0; i < units.length; i++)  {
				unit = units[i];
				interval = unit[1];
				multiples = unit[2];
				
				
				if (units[i+1]) {
					// lessThan is in the middle between the highest multiple and the next unit.
					var lessThan = (interval * multiples[multiples.length - 1] + 
								units[i + 1][1]) / 2;
							
					// break and keep the current unit
					if (tickInterval <= lessThan) break;
				}
			}
			
			// prevent 2.5 years intervals, though 25, 250 etc. are allowed
			if (interval == oneYear && tickInterval < 5 * interval)
				multiples = [1, 2, 5];
	
			// get the minimum value by flooring the date
			var multitude = normalizeTickInterval(tickInterval / interval, multiples),
				minYear, // used in months and years as a basis for Date.UTC()
				minDate = new Date(min * timeFactor);
				
				
			minDate.setMilliseconds(0);
			
			if (interval >= oneSecond) // second
				minDate.setSeconds(interval >= oneMinute ? 0 :
					multitude * mathFloor(minDate.getSeconds() / multitude));
	
			if (interval >= oneMinute) // minute
				minDate[setMinutes](interval >= oneHour ? 0 :
					multitude * mathFloor(minDate[getMinutes]() / multitude));
	
			if (interval >= oneHour) // hour
				minDate[setHours](interval >= oneDay ? 0 :
					multitude * mathFloor(minDate[getHours]() / multitude));
	
			if (interval >= oneDay) // day
				minDate[setDate](interval >= oneMonth ? 1 :
					multitude * mathFloor(minDate[getDate]() / multitude));
					
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
			var i = 1, // prevent crash just in case
				time = minDate.getTime() / timeFactor,
				minYear = minDate[getFullYear](),
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
			if (!options.labels.formatter) labelFormatter = function() {
				return dateFormat(options.dateTimeLabelFormats[unit[0]], this.value, 1);
			}
		}
			
			
		/**
		 * Set the tick positions of a linear axis to round values like whole tens or every five.
		 */
		function setLinearTickPositions() {
			
			var correctFloat = function(num) { // JS round off float errors
					var invMag = (magnitude < 1 ? mathRound(1 / magnitude) : 1) * 10;
					
					return mathRound(num * invMag) / invMag
				},
				
				i,
				roundedMin = mathFloor(min / tickInterval) * tickInterval,
				roundedMax = math.ceil(max / tickInterval) * tickInterval;
				// default extreme ticks when axis does not start and end on a tick
				//firstTickPosition = roundedMin + tickInterval,
				//lastTickPosition = roundedMax - tickInterval,
			
				
				//invMag = (magnitude < 1 ? 1 / magnitude : 1) * 10; // round off JS float errors;
				
			tickPositions = [];
			
			// populate the intermediate values
			// todo: round off float errors occur here!
			i = correctFloat(roundedMin);
			while (i <= roundedMax) {
			//for (i = roundedMin; i <= roundedMax; i += tickInterval) {
				//i = mathRound(i * invMag) / invMag
				tickPositions.push(i);
				i = correctFloat(i + tickInterval);
			}
				
			// pad categorised axis to nearest half unit
			if (categories) {
				 min -= 0.5;
				 max += 0.5;
			}

			// dynamic label formatter 
			if (!labelFormatter) labelFormatter = function() {
				return this.value;
			}
			
		};
		
		/**
		 * Set the tick positions to round values and optionally extend the extremes
		 * to the nearest tick
		 */
		function setTickPositions() {
			if (isDatetimeAxis)	setDateTimeTickPositions();
			else setLinearTickPositions();
			
			
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
					while (tickPositions.length < tickAmount)
						tickPositions.push(tickPositions[tickPositions.length - 1] + tickInterval);
					transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
				}
				if (defined(oldTickAmount) && tickAmount != oldTickAmount) axis.isDirty = true;	
				
			}
		};
	
		/**
		 * Set the scale based on data min and max, user set min and max or options
		 */
		function setScale() {
			var length, 
				type, 
				i,
				total,
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
				max = math.min(min + maxZoom, pick(options.max, min + maxZoom));
			}
				
			// pad the values to get clear of the chart's edges
			if (!categories && !usePercentage && defined(min) && defined(max)) {
				length = (max - min) || 1;
				if (!defined(options.min) && !defined(userSetMin) && minPadding && (dataMin < 0 || !ignoreMinPadding)) 
					min -= length * minPadding; 
				if (!defined(options.max) && !defined(userSetMax)  && maxPadding && (dataMax > 0 || !ignoreMaxPadding)) 
					max += length * maxPadding;
			}
			
			
			// tickInterval
			if (categories || min == max) tickInterval = 1;
			else tickInterval = options.tickInterval == 'auto' ? 
					(max - min) * options.tickPixelInterval / axisLength : 
					options.tickInterval;
					
			if (!isDatetimeAxis && options.tickInterval == 'auto') // linear
				tickInterval = normalizeTickInterval(tickInterval);
			
			// minorTickInterval
			minorTickInterval = (options.minorTickInterval == 'auto' && tickInterval) ?
					tickInterval / 5 : options.minorTickInterval;
					
			// get fixed positions based on tickInterval
			setTickPositions();
			
			// the translation factor used in translate function			
			transA = axisLength / ((max - min) || 1);
			
			// record the greatest number of ticks for multi axis
			if (!maxTicks) maxTicks = { // first call, or maxTicks have been reset after a zoom operation
				x: 0,
				y: 0
			};				
			if (!isDatetimeAxis && tickPositions.length > maxTicks[xOrY]) 
				maxTicks[xOrY] = tickPositions.length;
			//if (options.numberOfTicks) maxTicks[xOrY] = options.numberOfTicks;
				
			// reset stacks
				
			//if (!isXAxis) for (type in stacks) each (stacks[type], function(stack, i) {
			if (!isXAxis) for (type in stacks) for (i in stacks[type]) {
				stacks[type][i].cum = stacks[type][i].total;
			}


			
			// mark as dirty if it is not already set to dirty and extremes have changed
			if (!axis.isDirty) {
				axis.isDirty = (min != oldMin || max != oldMax);
			}
		};
		
		/**
		 * Set the extremes and optionally redraw
		 * @param {Number} newMin
		 * @param {Number} newMax
		 * @param {Boolean} redraw
		 * 
		 */
		function setExtremes(newMin, newMax, redraw) {
			redraw = pick(redraw, true); // defaults to true
				
			fireEvent(axis, 'setExtremes', { // fire an event to enable syncing of multiple charts
				min: newMin,
				max: newMax
			}, function() { // the default event handler
				// make sure categorized axes are not exceeded
				if (categories) {
					if (newMin < 0) newMin = 0;
					if (newMax > categories.length - 1) newMax = categories.length - 1;
				}
				
				// set the new values
				//userSetMin = pick(newMin, min);
				//userSetMax = pick(newMax, max);
				//if (defined(newMin)) userSetMin = newMin;
				//if (defined(newMax)) userSetMax = newMax;
				
				// this fails on zooming when a series is hidden and ignoreHiddenSeries is true
				//userSetMin = pick(newMin, options.min, dataMin);
				//userSetMax = pick(newMax, options.max, dataMax);
				
				userSetMin = newMin;
				userSetMax = newMax;
			
				
				// redraw
				if (redraw) chart.redraw();
			});
			
		};
		
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
		};
		
		
		/* *
		 * Reset min and max and set the scale again from data min and max
		 * /
		function reset() {
			//min = max = tickInterval = minorTickInterval = tickPositions = null;
			setScale();
		}*/
		
		/**
		 * Get the actual axis extremes
		 */
		function getExtremes() {
			return {
				min: min,
				max: max,
				dataMin: dataMin,
				dataMax: dataMax
			}
		}
		
		/**
		 * Add a plot band or plot line after render time
		 * 
		 * @param item {Object} The plotBand or plotLine configuration object
		 */
		function addPlotBandOrLine(item) {
			var isLine = item.width,
				collection = isLine ? plotLines : plotBands;	

			collection.push(item);
			
			if (isLine) drawPlotLine(item.value, item.color, item.width);
			else drawPlotBand(item.from, item.to, item.color);			
		}
		
		/**
		 * Remove a plot band or plot line from the chart by id
		 * @param {Object} id
		 */
		function removePlotBandOrLine(id) {
			each ([plotBands, plotLines], function(collection) {
				for (var i = 0; i < collection.length; i++) {
	
					if (collection[i].id == id) {
						collection.splice(i, 1);
						break;
					}
				}
			});
			render();
		}
		
		
		/**
		 * Redraw the axis to reflect changes in the data or axis extremes
		 */
		function redraw() {
			
			// hide tooltip and hover states
			if (tracker.resetTracker) tracker.resetTracker();
		
			// render the axis
			render();
			
			// mark associated series as dirty and ready for redraw
			each (associatedSeries, function(series) {
				series.isDirty = true;
			});
						
		}
		
		function render() {
			var axisTitle = options.title,
				alternateGridColor = options.alternateGridColor,
				minorTickWidth = options.minorTickWidth,
				lineWidth = options.lineWidth,
				lineLeft,
				lineTop,
				tickmarkPos,
				hasData = associatedSeries.length && defined(min) && defined(max);
			
			
			// clear the axis layers before new grid and ticks are drawn
			axisLayer.clear();
			gridLayer.clear();
			
			// return if there's no series on this axis
			//if (!associatedSeries.length || !defined(min) || !defined(max)) return;
			
			// If the series has data draw the ticks. Else only the line and title
			if (hasData) {
			
				// alternate grid color
				if (alternateGridColor) {
					each(tickPositions, function(pos, i) {
						if (i % 2 == 0 && pos < max) {
							drawPlotBand(
								pos, 
								tickPositions[i + 1] !== undefined ? tickPositions[i + 1] : max, 
								alternateGridColor
							);
						}
					});
				}
				
				// custom plot bands (behind grid lines)
				each (plotBands, function(plotBand) {
					drawPlotBand(plotBand.from, plotBand.to, plotBand.color);
				});
				
				// minor grid lines
				if (minorTickInterval && !categories) for (var i = min; i <= max; i += minorTickInterval) {
					drawPlotLine(i, options.minorGridLineColor, options.minorGridLineWidth);
					if (minorTickWidth) addTick(
						i, 
						options.minorTickPosition, 
						options.minorTickColor, 
						minorTickWidth, 
						options.minorTickLength
					);
				}
				// grid lines and tick marks
				each(tickPositions, function(pos, index) {
					tickmarkPos = pos + tickmarkOffset;
					
					// add the grid line
					drawPlotLine(tickmarkPos, options.gridLineColor, options.gridLineWidth);
					
					// add the tick mark
					addTick(
						pos, 
						options.tickPosition, 
						options.tickColor, 
						options.tickWidth, 
						options.tickLength, 
						!((pos == min && !options.showFirstLabel) || (pos == max && !options.showLastLabel)),
						index
					);
				});
			
			
				
				// custom plot lines (in front of grid lines)
				each (plotLines, function(plotLine) {
					drawPlotLine(plotLine.value, plotLine.color, plotLine.width);
				});
			
			} // end if hasData
			
			// axis line
			if (lineWidth) {
				lineLeft = marginLeft + (opposite ? plotWidth : 0) + offset;
				lineTop = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;
				axisLayer.drawLine(
					horiz ? 
						marginLeft: 
						lineLeft,
					horiz ? 
						lineTop: 
						marginTop, 
					horiz ? 
						chartWidth - marginRight : 
						lineLeft,
					horiz ? 
						lineTop:
						chartHeight - marginBottom, 
					options.lineColor, 
					lineWidth
				);
			}
			
			// title
			if (axisTitle && axisTitle.enabled && axisTitle.text) {
				
				// compute anchor points for each of the title align options
				var margin = horiz ? 
						marginLeft : marginTop,
					length = horiz ? plotWidth : plotHeight;
					
				// the position in the length direction of the axis
				var alongAxis = { 
					low: margin + (horiz ? 0 : length), 
					middle: margin + length / 2, 
					high: margin + (horiz ? length : 0)
				}[axisTitle.align];
				
				// the position in the perpendicular direction of the axis
				var offAxis = (horiz ? marginTop + plotHeight : marginLeft) +
					(horiz ? 1 : -1) * // horizontal axis reverses the margin
					(opposite ? -1 : 1) * // so does opposite axes
					axisTitle.margin 
					- (isIE ? parseInt(
						axisTitle.style.fontSize || axisTitle.style.font.replace(/^[a-z ]+/, '')
					) / 3 : 0); // preliminary fix for vml's centerline
				
				axisLayer.addText(
					axisTitle.text,
					horiz ? 
						alongAxis: 
						offAxis + (opposite ? plotWidth : 0) + offset, // x
					horiz ? 
						offAxis - (opposite ? plotHeight : 0) + offset: 
						alongAxis, // y
					axisTitle.style, 
					axisTitle.rotation || 0,
					{ low: 'left', middle: 'center', high: 'right' }[axisTitle.align]
				);
				
			}
			// stroke tick labels and title
			axisLayer.strokeText();
			
			axis.isDirty = false;
		};
		
		
		// Run Axis
		var isXAxis = options.isX,
			opposite = options.opposite, // needed in setOptions			
			horiz = inverted ? !isXAxis : isXAxis,
			stacks = {
				bar: {},
				column: {},
				area: {},
				areaspline: {}
			};
	
		setOptions(); // do the merging
	
		var axis = this,
			isDatetimeAxis = options.type == 'datetime',
			offset = options.offset || 0,
			xOrY = isXAxis ? 'x' : 'y',
			axisLength = horiz ? plotWidth : plotHeight,
		
			transA,							 	// translation factor
			transB = horiz ? marginLeft : marginBottom, 		// translation addend
			axisLayer = new Layer('axis-layer', container, null, { zIndex: 7}), /* The
				axis layer is in front of the series because the axis line must hide
				graphs and bars. Grid lines are drawn on the grid layer. */
			gridLayer = new Layer('grid-layer', container, null, { zIndex: 1 }),
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
			plotBands = options.plotBands || [],
			plotLines = options.plotLines || [],
			tickInterval,
			minorTickInterval,
			magnitude,
			tickPositions, // array containing predefined positions
			tickAmount,
			zoom = 1,
			//var axisLabelsLayer = new Layer((horiz ? 'x' : 'y') +'-axis-labels');
			labelFormatter = options.labels.formatter, // can be overwritten by dynamic format
			// column plots are always categorized
			categories = options.categories || (isXAxis && chart.columnCount), 
			reversed = options.reversed,
			tickmarkOffset = (categories && options.tickmarkPlacement == 'between') ? 0.5 : 0;
			//var hasWrittenTitle;
			
		// inverted charts have reversed xAxes as default
		if (inverted && isXAxis && reversed === undefined) reversed = true;
			
		// negate offset
		if (!opposite) offset *= -1;
		if (horiz) offset *= -1; 
		
			
		// expose some variables
		extend (axis, {
			addPlotBand: addPlotBandOrLine,
			addPlotLine: addPlotBandOrLine,
			adjustTickAmount: adjustTickAmount,
			categories: categories,
			getExtremes: getExtremes,
			isXAxis: isXAxis,
			options: options,
			render: render,
			setExtremes: setExtremes,
			setScale: setScale,
			setCategories: setCategories,
			translate: translate,
			redraw: redraw,
			removePlotBand: removePlotBandOrLine,
			removePlotLine: removePlotBandOrLine,
			//reset: reset,
			reversed: reversed,
			stacks: stacks
		});
		
		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}
		
		// set min and max
		setScale();
			
	
	}; // end Axis
	
	function Toolbar(chart) {
		var toolbarLayer, buttons = {};
		
		toolbarLayer = new Layer('toolbar', container, null, { 
			zIndex: 1004, 
			width: 'auto', 
			height: 'auto'
		});
		
		
		function add(id, text, title, fn) {
			if (!buttons[id]) {
				var button = createElement(DIV, {
						innerHTML: text,
						title: title,
						onclick: fn
					}, extend(options.toolbar.itemStyle, { 	
						zIndex: 1003
					}), toolbarLayer.div);
				buttons[id] = button;
			}
		}
		function remove(id) {
			discardElement(buttons[id]);
			buttons[id] = null;
		}
		
		// public
		return {
			add: add,
			remove: remove
		}
	};
	
	function MouseTracker (chart, options) {
		/**
		 * Get the currently hovered point
		 */
		function getActivePoint() {
			return activePoint;
		};
		
		/**
		 * Add IE support for pageX and pageY
		 * @param {Object} e The event object in standard browsers
		 */
		function normalizeMouseEvent(e) {
			// common IE normalizing
			e = e || win.event;
			if (!e.target) e.target = e.srcElement;
				
			// pageX and pageY
			if (!e.pageX)
				e.pageX = e.clientX + (doc.documentElement.scrollLeft || doc.body.scrollLeft);
			
			if (!e.pageY)
				e.pageY = e.clientY + (doc.documentElement.scrollTop || doc.body.scrollTop);
				
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
							e.pageX - position.x - marginLeft  : 
							plotHeight - e.pageY + position.y + marginTop ,
						true
					)								
				})
			});
			return coordinates;
		}
		
		/* *
		 * Drop a point after dragging to change it's value
		 * 
		 * @todo: 
		 * - x dimension
		 * /
		function dropDragPoint() {
			if (hasDragged && dragPoint) {
				var yAxis = dragPointCoordinates.yAxis,
					i = 0;
					
				// identify the point's yAxis
				for (i; i < yAxis.length; i++) { 
					if (yAxis[i].axis == dragPoint.series.yAxis) {
						break;
					}					
				}
				// update the point
				dragPoint.update(yAxis[i].value);
				dragPoint = null;				
			}
		}
		*/
		/**
		 * Set the JS events on the container element
		 */
		function setDOMEvents () {
			
			imagemap.onmousedown = function(e) {
				e = normalizeMouseEvent(e);
				
				// record the start position
				if (e.preventDefault) e.preventDefault();
				chart.mouseIsDown = mouseIsDown = true;
				mouseDownX = e.pageX;
				mouseDownY = e.pageY;
					
				
				// make a selection
				if (hasCartesianSeries && (zoomX || zoomY)) {
					if (!selectionMarker) selectionMarker = createElement(DIV, null, {
						position: ABSOLUTE,
						border: 'none',
						background: '#4572A7',
						opacity: 0.25,
						width: zoomHor ? 0 : plotWidth + PX,
						height: zoomVert ? 0 : plotHeight + PX
					});
					plotLayer.div.appendChild(selectionMarker);
				}
				
				// drag a point
				/* else if (activePoint && e.target.tagName == 'AREA') {
					var seriesOptions = activePoint.series.options,
						dragType = seriesOptions.dragType;
					
					if (seriesOptions.allowDrag) {
						allowXDrag = /x/.test(dragType);
						allowYDrag = /y/.test(dragType);
					}
					// define the point
					if (allowXDrag || allowYDrag) dragPoint = activePoint;
				}
				*/
			};
			
			
			// Use native browser event for this one. It's faster, and MooTools
			// doesn't use clientX and clientY.
			imagemap.onmousemove = function(e) {
				e = normalizeMouseEvent(e);
				e.returnValue = false;
				if (mouseIsDown) { // make selection
				
					// determine if the mouse has moved more than 10px
					hasDragged = Math.sqrt(
						Math.pow(mouseDownX - e.pageX, 2) + 
						Math.pow(mouseDownY - e.pageY, 2)
					) > 10;
					
					// adjust the width of the selection marker
					if (zoomHor) {
						var xSize = e.pageX - mouseDownX;
						setStyles(selectionMarker, {
							width: mathAbs(xSize) + PX,
							left: ((xSize > 0 ? 0 : xSize) 
								 + mouseDownX - position.x - marginLeft) + PX
						});
					}
					// adjust the height of the selection marker
					if (zoomVert) {
						var ySize = e.pageY - mouseDownY;
						setStyles(selectionMarker, {
							height: mathAbs(ySize) + PX,
							top: ((ySize > 0 ? 0 : ySize) +
								 + mouseDownY - position.y - marginTop) + PX
						});
					}
					
					/* Removed to prevent bloating. Can be added as a separate component later. 
					// drag a point
					if (hasDragged && dragPoint) {
		
						// draw the hover point
						dragPoint.series.drawPointState(dragPoint, 'hover');

						// record the coordinates
						dragPointCoordinates = getMouseCoordinates(e);
						
						if (allowXDrag) {
							// update the plot coordinates
							dragPoint.plotX = e.pageX - position.x - marginLeft;
							// get the tooltip text and refresh the tooltip
							dragPoint.x = dragPoint.series.xAxis.translate(
								dragPoint.plotX, 
								true
							);
						}
						if (allowYDrag) {
							// update the plot coordinates
							dragPoint.plotY = e.pageY - position.y - marginTop;
							// get the tooltip text and refresh the tooltip
							dragPoint.y = dragPoint.series.yAxis.translate(
								plotHeight - dragPoint.plotY, 
								true
							);
						}
						
						// adjust height for columns
						dragPoint.h = (dragPoint.yBottom || dragPoint.y0) - dragPoint.plotY;
						
						dragPoint.setTooltipText();
						tooltip.refresh(dragPoint, dragPoint.series);						
					}
					*/
					
				} else {
					// show the tooltip
					onmousemove(e);
				}
				return false;
			};
			imagemap.onmouseup = function() {
				var selectionIsMade;
				
				if (selectionMarker) {
					var selectionData = {
							xAxis: [],
							yAxis: []
						},
						selectionLeft = selectionMarker.offsetLeft,
						selectionTop = selectionMarker.offsetTop,
						selectionWidth = selectionMarker.offsetWidth,
						selectionHeight = selectionMarker.offsetHeight;
						
						
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
										plotHeight - selectionTop - selectionHeight, 
									true
								),
								selectionMax = translate(
									isHorizontal ? 
										selectionLeft + selectionWidth : 
										plotHeight - selectionTop, 
									true
								);
								
							selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
								axis: axis,
								min: math.min(selectionMin, selectionMax), // for reversed axes
								max: mathMax(selectionMin, selectionMax)
							});
							
						});
						fireEvent(chart, 'selection', selectionData, zoom);

						selectionIsMade = true;
					}					
					
					discardElement(selectionMarker);
					selectionMarker = null;
				}
				
				chart.mouseIsDown = mouseIsDown = hasDragged = false;
				/*
				else {
					dropDragPoint();
				}*/
			};
			
			// MooTools 1.2.4 doesn't handle this 'mouseleave' in IE
			imagemap.onmouseout = function(e) {
				e = e || win.event;
				var	related = e.relatedTarget || e.toElement;
				
				// check that the mouse has really left the imagemap
				if (related && related != trackerImage && related.tagName != 'AREA') {
			
					// reset the tracker
					resetTracker();
					
					// if the user is pushing a point, drop it
					//dropDragPoint();
					
					// reset mouseIsDown and hasDragged
					chart.mouseIsDown = mouseIsDown = hasDragged = false;
					
					
				}
				

			}
			
			// MooTools 1.2.3 doesn't fire this in IE when using addEvent
			imagemap.onclick = function(e) {
				e = normalizeMouseEvent(e);
				 
				e.cancelBubble = true; // IE specific
				
				if (!hasDragged) {
					if (activePoint && e.target.tagName == 'AREA') {
						var plotX = activePoint.plotX,
							plotY = activePoint.plotY;
							
						// add page position info
						extend(activePoint, {
							pageX: position.x + marginLeft + 
								(inverted ? plotWidth - plotY : plotX),
							pageY: position.y + marginTop + 
								(inverted ? plotHeight - plotX : plotY)
						});
						
						// the series click event
						fireEvent(chart.hoverSeries, 'click', extend(e, {
							point: activePoint
						}));
						
						// the point click event
						activePoint.firePointEvent('click', e);
					
					} else { 
						extend (e, getMouseCoordinates(e));
							
						
						// fire a click event in the chart
						fireEvent(chart, 'click', e);
					}
					
					
				}
				// reset mouseIsDown and hasDragged
				//chart.mouseIsDown = mouseIsDown = hasDragged = false;
				hasDragged = false;
			};
			
			
			 
		};
		/**
		 * Refresh the tooltip on mouse move
		 */
		function onmousemove (e) {
			var point = chart.hoverPoint,
				series = chart.hoverSeries;
			
			if (series) {
		
				// get the point
				if (!point) point = series.tooltipPoints[
					inverted ? 
						e.pageY - position.y - marginTop : 
						e.pageX - position.x - marginLeft
				];
			
				// a new point is hovered, refresh the tooltip
				if (point && point != activePoint) {
					
					// trigger the events
					if (activePoint) activePoint.firePointEvent('mouseOut');
					point.firePointEvent('mouseOver');

					// refresh the tooltip
					if (tooltip) tooltip.refresh(point);
					activePoint = point;
					
					
				}				
			}
		};
		

		
		/**
		 * Create the image map that listens for mouseovers
		 */
		function createImageMap () {
			var id = 'highchartsMap'+ canvasCounter++;
			
			chart.imagemap = imagemap = createElement('map', {
					name: id,
					id: id,
					className: 'highcharts-image-map'
				}, null, container);
			
			// Append the image to the image map to allow events to 
			// bubble up
			trackerImage = createElement('img', {
				useMap: '#'+ id
			}, {
				width: plotWidth + PX,
				height: plotHeight + PX,
				left: marginLeft + PX,
				top: marginTop + PX,
				opacity: 0,
				border: 'none',
				position: ABSOLUTE,
				// Workaround: if not clipped, the left axis will flicker in 
				// IE8 when hovering the chart
				clip: 'rect(1px,'+ plotWidth +'px,'+ plotHeight +'px,1px)', 
				zIndex: 9
			}, imagemap);
			
						
			// Blank image for modern browsers. IE doesn't need a valid 
			// image for the image map to work, and fails in SSL mode
			// if it's present.
			if (!isIE) trackerImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
		};
		
		/**
		 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
		 */
		function resetTracker() {
			// hide the tooltip
			if (tooltip) tooltip.hide();
			
			// hide the hovered series and point
			if (chart.hoverSeries) {
				chart.hoverSeries.setState();
				chart.hoverSeries = null;
				activePoint = null;
			}
		}
		/**
		 * Bring a specific area to the front so that the user can follow a line. The
		 * legend area should always stay on top. Series tracker areas are brought to the
		 * top after the legend area.
		 * @param {Object} area The area DOM element
		 */
		function insertAtFront(area) {
			var before = 0,
				i,
				childNodes = imagemap.childNodes;
			for (i = 0; i < childNodes.length; i++) {
				if (childNodes[i].isLegendArea) {
					before = i + 1;
					break;
				}
			}
			imagemap.insertBefore(area, childNodes[before]);				
		}
		
		//if (!options.enabled) return;
		
		// Run MouseTracker
		var activePoint,
			mouseDownX, 
			mouseDownY,
			hasDragged,
			selectionMarker,
			/*dragPoint,
			dragPointCoordinates,
			allowXDrag,
			allowYDrag,*/
			zoomType = optionsChart.zoomType,
			zoomX = /x/.test(zoomType),
			zoomY = /y/.test(zoomType),
			zoomHor = zoomX && !inverted || zoomY && inverted,
			zoomVert = zoomY && !inverted || zoomX && inverted;
			
			
		// public
		createImageMap();
		if (options.enabled) chart.tooltip = tooltip = Tooltip(options);
		
		setDOMEvents();
		
		// set the fixed interval ticking for the smooth tooltip
		setInterval(function() {
			if (tooltipTick) tooltipTick();
		}, 32);
		
		// expose properties
		extend (this, {
			insertAtFront: insertAtFront,
			zoomX: zoomX,
			zoomY: zoomY,
			resetTracker: resetTracker
		});
	};
	

	
	/**
	 * The overview of the chart's series
	 * @param {Object} chart
	 */
	var Legend = function(chart) {
		// already existing			
		//if (chart.legend) return;
			
		var options = chart.options.legend;
			
		if (!options.enabled) return;
		
		var li,
			layout = options.layout,
			symbolWidth = options.symbolWidth,
			dom,
			topRule = '#'+ container.id +' .highcharts-legend li', // apply once for each chart
			allItems = [],
			legendLayer = new Layer('legend', container, null, { zIndex: 7 }),
			legendArea,
			series = chart.series,
			reversedLegend = options.reversed;
			
		
		// Don't use Layer prototype because this needs to sit above the chart in zIndex
		this.dom = dom = createElement(DIV, {
			className: 'highcharts-legend highcharts-legend-'+ layout,
			innerHTML: '<ul style="margin:0;padding:0"></ul>'
		}, extend({
			position: ABSOLUTE,
			zIndex: 7
		}, options.style), container);
			
		// Add the CSS for all states
		addCSSRule(topRule, extend(options.itemStyle, {
			paddingLeft: (symbolWidth +	options.symbolPadding) + PX,
			'float': layout == 'horizontal' ? 'left' : 'none'
		}));
		addCSSRule(topRule +':hover', options.itemHoverStyle);
		addCSSRule(topRule +'.'+ HIGHCHARTS_HIDDEN, options.itemHiddenStyle);
		addCSSRule('.highcharts-legend-horizontal li', { 'float': 'left' });
		
		renderHTML();
		drawGraphics();
		
		function renderHTML(clear) {
			if (clear) {
				each (allItems, function(item) {
					discardElement(item.legendItem);
				});
				allItems = [];
			}

			// add HTML for each series
			if (reversedLegend) {
				series.reverse();
			} 
			each(series, function(serie) {
				if (!serie.options.showInLegend) return;
				
				// use points or series for the legend item depending on legendType
				var items = (serie.options.legendType == 'point') ?
						serie.data : [serie];
						
					
				each(items, function(item) {
					// let these series types use a simple symbol
					item.simpleSymbol = /(bar|pie|area|column)/.test(serie.type);
					
					
					// generate the list item
					item.legendItem = li = createElement('li', {
							innerHTML: options.labelFormatter.call(item),
							className: item.visible ? '' : HIGHCHARTS_HIDDEN
						}, 
						null, //item.visible ? style : merge(style, options.itemHiddenStyle), 
						dom.firstChild
					);
					
					
					// add the checkbox
					if (item.options && item.options.showCheckbox) {
						item.checkbox = createElement('input', {
							type: 'checkbox',
							checked: item.selected,
							defaultChecked: item.selected // required by IE7
						}, options.itemCheckboxStyle, li);
					}
					
					// add the events
					addEvent(li, 'mouseover', function() {
						item.setState('hover');
					});
					addEvent(li, 'mouseout', function() {
						item.setState();
					});
					addEvent(li, 'click', function(event) {
						var target = event.target,
							strLegendItemClick = 'legendItemClick',
							fnLegendItemClick = function() {
								item.setVisible();
							};
						
						// click the input
						if (target.tagName == 'INPUT') {
							fireEvent (item, 'checkboxClick', { 
									checked: target.checked 
								}, 
								function() {
									item.select();
								}
							);
							
						// click the name or symbol
						} else if (item.firePointEvent) { // point
							item.firePointEvent (strLegendItemClick, null, fnLegendItemClick);
						} else {
							fireEvent (item, strLegendItemClick, null, fnLegendItemClick);
						}
					});
					
					// add it all to an array to use below
					allItems.push(item);
				});
			});
			if (reversedLegend) {
				series.reverse();
			}
		}
		
		
		/**
		 * Draw the box behind the legend and the symbols
		 * @param {Boolean} clear Whether to clear out previous graphics
		 */
		function drawGraphics(clear) {
			if (clear) {
				legendLayer.clear();
				discardElement(legendArea);
				legendArea = null;
			}
			if (series.length) {
			
				// draw the box around the legend
				if (options.borderWidth || options.backgroundColor) 
						legendLayer.drawRect(
					dom.offsetLeft, 
					dom.offsetTop,
					dom.offsetWidth, 
					dom.offsetHeight, 
					options.borderColor, 
					options.borderWidth, 
					options.borderRadius, 
					options.backgroundColor, 
					options.shadow
				);
	
	
			
				// Add the symbol after the list is complete.		
				each(allItems, function(item) {
					if (!item.legendItem) return;
	
					var li = item.legendItem,
						symbolX = dom.offsetLeft + li.offsetLeft,
						symbolY = dom.offsetTop + li.offsetTop + li.offsetHeight / 2,
						markerOptions,
						isHidden = item.legendItem.className == HIGHCHARTS_HIDDEN,
						color = isHidden ? 
							options.itemHiddenStyle.color : 
							item.color;
							
					// draw the line
					if (!item.simpleSymbol && item.options && item.options.lineWidth)
						legendLayer.drawLine(
							symbolX, 
							symbolY, 
							symbolX + symbolWidth, 
							symbolY, 
							color, 
							item.options.lineWidth
						);
					// draw a simple symbol
					if (item.simpleSymbol) // bar|pie|area|column
						legendLayer.drawRect(
							symbolX,
							symbolY - 6,
							16,
							12,
							null,
							0,
							2,
							color
						);
						
					// draw the marker
					else if (item.options && item.options.marker && item.options.marker.enabled)
						item.drawMarker(
							legendLayer, 
							symbolX + symbolWidth / 2, 
							symbolY, 
							merge(item.options.marker, isHidden ? {
								fillColor: color,
								lineColor: color
							}: null)
						);
				});
				
				// Add an area that detects mouseovers and puts the legend in front so it can be clicked
				if (imagemap) {
					legendArea = createElement('area', {
						shape: 'rect',
						isLegendArea: true,
						coords: [
							dom.offsetLeft - marginLeft, 
							dom.offsetTop - marginTop, 
							dom.offsetLeft + dom.offsetWidth - marginLeft,
							dom.offsetTop + dom.offsetHeight - marginTop
						].join(',')
					});
					// insert at the top
					tracker.insertAtFront(legendArea);
					
					// note: using addEvent and mouseleave, mouseenter doesn't work with Moo in IE
					legendArea.onmouseover = function(e) {
						e = e || win.event;
						var	relatedTarget = e.relatedTarget || e.fromElement;
						if (relatedTarget != dom && !mouseIsDown) {
							if (tooltip) tooltip.hide();
							setStyles(dom, {
								zIndex: 10
							});
						}		
					}
					dom.onmouseout = legendArea.onmouseout = function(e) {
						e = e || win.event;
						var	relatedTarget = e.relatedTarget || e.toElement;
						if (relatedTarget && (relatedTarget == trackerImage || 
								(relatedTarget.tagName == 'AREA' && relatedTarget != legendArea))) 
							setStyles(dom, {
								zIndex: 7
							});
					}
				}
			} // if series.length
		}
		
		// expose redrawGraphics
		return {
			renderHTML: renderHTML,
			drawGraphics: drawGraphics
		};
	};
	
	function Tooltip (options) {
		var currentSeries,
			innerDiv,
			borderWidth = options.borderWidth,
			boxLayer;
		
		tooltipDiv = createElement(DIV, null, {
			position: ABSOLUTE,
			visibility: HIDDEN,
			overflow: HIDDEN,
			padding: '0 50px 5px 0',
			zIndex: 8
		}, container);
		
		// the rounded corner box
		boxLayer = new Layer('tooltip-box', tooltipDiv, null, {
			width: chartWidth + PX,
			height: chartHeight + PX
		});
		
		// an inner element for the contents
		innerDiv = createElement(DIV, { 
				className: "highcharts-tooltip"
			}, extend(options.style, {
				maxWidth: (chartWidth - 40) + PX,
				//overflow: HIDDEN, interferes with the text width detection
				textOverflow: 'ellipsis',
				position: RELATIVE,
				zIndex: 2
			}), tooltipDiv
		);
		
		
		/**
		 * Refresh the tooltip's text and position. 
		 * @param {Object} point
		 * 
		 */
		function refresh(point, series) {
			var tooltipPos = point.tooltipPos,
				series = point.series,
				//chartOptions = chart.options,
				borderColor = options.borderColor || point.color || series.color || '#606060',
				//categories = series.xAxis ? series.xAxis.categories : null,
				inverted = chart.inverted,//chart.options.chart.inverted,
				x,
				y,
				boxX,
				boxY,
				boxWidth,
				boxHeight,
				oldInnerDivHeight = innerDiv.offsetHeight,
				show,
				text = point.tooltipText;
				
			
			// register the current series
			currentSeries = series;
			
			// get the reference point coordinates (pie charts use tooltipPos)
			x = tooltipPos ? tooltipPos[0] : (inverted ? plotWidth - point.plotY : point.plotX);
			y = tooltipPos ? tooltipPos[1] : (inverted ? plotHeight - point.plotX : point.plotY);
				
				
			// hide tooltip if the point falls outside the plot
			if (x >= 0 && x <= plotWidth && y >= 0 && y <= plotHeight) {
				show = true;
			}
			
			// update the inner HTML
			if (text === false || !show) { 
				hide();
			} else {
				innerDiv.innerHTML = text;
				
				// Draw a rounded border. Draw the border with 20px extra width to minimize
				// the need to redraw it later. Next time, only redraw if the width of the 
				// box is more than 20px wider or smaller than the old box.
				setStyles(innerDiv, { overflow: VISIBLE });
				boxWidth = innerDiv.offsetWidth - borderWidth;
				boxHeight = innerDiv.offsetHeight - borderWidth;
				setStyles(innerDiv, { overflow: HIDDEN });
				
				if (boxWidth > (boxLayer.w || 0) + 20 || boxWidth < (boxLayer.w || 0) - 20 || 
						boxHeight > boxLayer.h || boxLayer.c != borderColor ||
						oldInnerDivHeight != innerDiv.offsetHeight ) {
				    boxLayer.clear();		
				    boxLayer.drawRect(
						borderWidth / 2, 
						borderWidth / 2, 
				    	boxWidth + 20,
				    	boxHeight, 
				    	borderColor, 
						borderWidth, 
						options.borderRadius, 
				    	options.backgroundColor, 
						options.shadow
					);
					
					// register size
					extend(boxLayer, {
						w: boxWidth,
						h: boxHeight,
						c: borderColor
					});
				}
				
				// keep the box within the chart area
				boxX = x - boxLayer.w + marginLeft - 35;
				boxY = y - boxLayer.h + 10 + marginTop;
				
				// it is too far to the left, and there is space to the right
				/*if ((inverted || boxX < 5) && x + marginLeft + boxLayer.w < chartWidth - 100) 
					boxX = x + marginLeft + 15; // right align*/
				
				// it is too far to the left, lift it up
				if (boxX < 5) {
					boxX = 5;
					boxY -= 20;
				}
				
				
				if (boxY < 5) boxY = 5; // above
				else if (boxY + boxLayer.h > chartHeight) 
					boxY = chartHeight - boxLayer.h - 5; // below
				
				// do the move
				move(mathRound(boxX), mathRound(boxY));
		
			    // show the hover mark
				series.drawPointState(point, 'hover');
			
				tooltipDiv.style.visibility = VISIBLE;
			}
		
		};
		
		// Provide a soft movement of the tooltip
		function move(finalX, finalY) {
			
			var hidden = (tooltipDiv.style.visibility == HIDDEN),
				x = hidden ? finalX : (tooltipDiv.offsetLeft + finalX) / 2, 
				y = hidden ? finalY : (tooltipDiv.offsetTop + finalY) / 2;
			
			setStyles( tooltipDiv, {
				left: x + PX, 
				top: y + PX
			});
			
			// run on next tick of the mouse tracker
			if (mathAbs(finalX - x) > 1 || mathAbs(finalY - y) > 1) {
				tooltipTick = function() {
					move(finalX, finalY);
				};
			} else {
				tooltipTick = null;
			}
		};
		function hide() {
			if (tooltipDiv) tooltipDiv.style.visibility = HIDDEN;
			if (currentSeries) currentSeries.drawPointState();
		};
		
		// public members
		return {
			refresh: refresh,
			hide: hide
		}		
	};
	
		
	

		
	//--- Run Chart ---
	// Override defaults for inverted axis
	/*if (options.chart && options.chart.inverted) defaultOptions = 
		merge(defaultOptions, invertedDefaultOptions);*/
	// Make sure the VML canvas manager is initialized. It initializes on doc.ready by default,
	// which in some cases is too late for Highcharts.
	if (win.G_vmlCanvasManager) {
		win.G_vmlCanvasManager.init_(document);
	}
		
	// Pull out the axis options to enable multiple axes
	defaultXAxisOptions = merge(defaultXAxisOptions, defaultOptions.xAxis);
	defaultYAxisOptions = merge(defaultYAxisOptions, defaultOptions.yAxis);
	defaultOptions.xAxis = defaultOptions.yAxis = null;
		
	// Handle regular options
	options = merge(defaultOptions, options);
	
	var optionsChart = options.chart;
	

		
	// handle margins
	var optionsMargin = optionsChart.margin,
		margin = typeof optionsMargin == 'number' ? 
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin] :
			optionsMargin,
		marginTop = margin[0],
		marginRight = margin[1],
		marginBottom = margin[2],
		marginLeft = margin[3],
		renderTo,
		renderToClone,
		container,
		containerId,
		chartWidth,
		chartHeight;
		
	// create the container
	// todo: move this to render and don't render anything to the container before that
	getContainer();
	
	
	var chart = this,
		//container = doc.getElementById(optionsChart.renderTo),
		//container,
		chartEvents = optionsChart.events,
		eventType,
		imagemap,
		tooltip,
		mouseIsDown,
		backgroundLayer = new Layer('chart-background', container),
		//chartHeight, 
		//chartWidth,
		loadingLayer,
		plotLayer,
		plotHeight,
		plotWidth,
		//ctx, 
		tracker,
		trackerImage,
		legend,
		//xAxis, 
		//yAxis,
		position = getPosition(container),
		hasCartesianSeries = optionsChart.showAxes,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [], 
		resourcesLoaded, 
		plotBackground,
		inverted,
		tooltipTick,
		tooltipDiv;
		
		
	// Set to zero for each new chart
	colorCounter = 0;
	symbolCounter = 0;
	
	// Update position on resize and scroll
	addEvent(win, 'resize', updatePosition);
	
	// Destroy the chart and free up memory
	addEvent(win, 'unload', destroy);
	
	// Chart event handlers
	if (chartEvents) for (eventType in chartEvents) { 
		addEvent(chart, eventType, chartEvents[eventType]);
	}
	
	// Chart member functions
	chart.addLoading = function (loadingId) {
		chart.resources[loadingId] = false;
	}
	chart.clearLoading = function (loadingId) {
		chart.resources[loadingId] = true;
		checkResources();
	}
	
	
	chart.options = options;
	chart.series = series;
	chart.container = container;
	
	chart.resources = {};
	
	chart.inverted = inverted = options.chart.inverted
	
	chart.chartWidth = chartWidth;
	chart.chartHeight = chartHeight;
	
	chart.plotWidth = plotWidth = chartWidth - marginLeft - marginRight;
	chart.plotHeight = plotHeight = chartHeight - marginTop - marginBottom;
	
	chart.plotLeft = marginLeft;
	chart.plotTop = marginTop;
	
	// API methods
	chart.redraw = redraw;
	chart.addSeries = addSeries;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.showLoading = showLoading;
	chart.hideLoading = hideLoading;
	chart.get = get;
	chart.destroy = destroy;
	
	chart.updatePosition = updatePosition; // docs
	
	chart.plotLayer = plotLayer = new Layer('plot', container, null, {
		position: ABSOLUTE,
		width: plotWidth + PX,
		height: plotHeight + PX,
		left: marginLeft + PX,
		top: marginTop + PX,
		overflow: HIDDEN,
		zIndex: 3
	});
	
	
	// Wait for loading of plot area background
	if (optionsChart.plotBackgroundImage) {
		chart.addLoading('plotBack');
		plotBackground = createElement('img');
		plotBackground.onload = function() {
			chart.clearLoading('plotBack');
		}
		plotBackground.src = optionsChart.plotBackgroundImage;
	}
	
	// Initialize the series
	//initSeries();
	each (options.series || [], function(serieOptions) {
		initSeries(serieOptions);
	});
	
	// Mouse tracker must be initiated after series because it depends on inverted
	chart.tracker = tracker = new MouseTracker(chart, options.tooltip);
	
	
	checkResources();
	
};

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
		var point = this;
		point.series = series;
		point.applyOptions(options);
		
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
			series = point.series,
			n;
	
		
		// onedimensional array input
		if (typeof options == 'number' || options === null) {
			//point.x = i;
			point.y = options;	
		}
		
		// object input
		else if (typeof options == 'object' && typeof options.length != 'number') {
			
			// copy options directly to point
			//for (n in options) point[n] = options[n];
			extend(point, options);
			
			point.options = options;
			// set x and y
			//point.x = options.x;
			//point.y = options.y;
		}
		
		// categorized data with name in first position
		else if (typeof options[0] == 'string') {
			point.name = options[0];
			//point.x = i;
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
		if (point.x === undefined) point.x = series.autoIncrement();
	},
	
	/**
	 * Clear memory
	 */
	destroy: function() {
		var point = this;
		
		if (point.stateLayer) point.stateLayer.destroy();
		for (prop in point) point[prop] = null; 
	},
	
	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 * 		this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function(selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart,
			stateLayers,
			state,
			singlePointLayer = pick(point.stateLayer, series.singlePointLayer, chart.singlePointLayer);
			
		//point.selected = !point.selected;
		// if called without an argument, toggle
		//series.selected = selected = (selected === undefined) ? !series.selected : selected;
		point.selected = selected = pick(selected, !point.selected);
		
		series.isDirty = true;
		point.firePointEvent(selected ? 'select' : 'unselect');
		
		// remove the hover marker so the user can see the underlying marker changes to selected
		if (singlePointLayer) singlePointLayer.clear();
		
		
		each (chart.series, function (series) {
			stateLayers = series.stateLayers;
			
			// unselect all other points unless Ctrl or Cmd + click
			if (!accumulate) each (series.data, function(loopPoint) {
				if (loopPoint.selected && loopPoint != point) {
					loopPoint.selected = false;
					fireEvent(loopPoint, 'unselect');
					series.isDirty = true;
				}
			});
			
			
			// Just render the series, not the entire chart. Also, don't redraw
			// with new translation and all. 
			if (series.isDirty) {
				for (state in stateLayers) {
					stateLayers[state].clear();
				}
				series.render();
			}
		})
		
	},
	
	/**
	 * Update the point with new options (typically x/y data) and optionally redraw the series.
	 * 
	 * @param {Object} options Point options as defined in the series.data array
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * 
	 */
	update: function(options, redraw) {
		var point = this,
			series = point.series;
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function() {

			point.applyOptions(options);
	
			// redraw
			series.isDirty = true;
			if (redraw) series.chart.redraw();
		});
	},
	
	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 */
	remove: function(redraw) {
		var point = this,
			series = point.series,
			chart = series.chart,
			data = series.data;
		
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of removing the point			
		point.firePointEvent('remove', null, function() {

			// loop through the data to locate the point and remove it
			each(data, function(existingPoint, i) {
				if (existingPoint == point) {
					data.splice(i, 1);
				}
			})
			
			// pies have separate point layers and legend items
			if (point.layer) point.layer = point.layer.destroy();
			if (point.legendItem) {
				discardElement(point.legendItem);
				point.legendItem = null;
				chart.isDirty = true;
			}
			
			// redraw
			series.isDirty = true;
			if (redraw) chart.redraw();
		})
			
		
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
				point.options && point.options.events && point.options.events[eventType])) 
			this.importEvents();
			
		// add default handler if in selection mode
		if (eventType == 'click' && seriesOptions.allowPointSelect)
			defaultFunction = function (event) {
				// Control key is for Windows, meta (= Cmd key) for Mac, Shift for Opera
				point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
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
	
	setTooltipText: function() {
		var point = this;
		point.tooltipText = point.series.chart.options.tooltip.formatter.call({
			series: point.series,
			point: point,
			x: point.category, 
			y: point.y,
			percentage: point.percentage,
			total: point.total || point.stackTotal
		});
	}	
};

/**
 * The base function which all other series types inherit from
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function() {
	this.isCartesian = true;
	this.type = 'line';
	this.pointClass = Point;
};

Series.prototype = {
	init: function(chart, options) {
		var series = this,
			eventType,
			events,
			pointEvent,
			index = chart.series.length;
			
		series.chart = chart;
		options = series.setOptions(options); // merge with plotOptions
		
		// set some variables
		extend (series, {
			index: index,
			options: options,
			name: options.name || 'Series '+ (index + 1),
			state: '',
			visible: options.visible !== false, // true by default
			selected: options.selected == true // false by default
		});
		
		// register event listeners
		events = options.events;
		for (eventType in events) {
			addEvent(series, eventType, events[eventType]);
		}
		
		series.getColor();
		series.getSymbol();
		
		// get the data and go on when the data is loaded
		series.getData(options);
			
	},
	getData: function(options) {
		var series = this,
			chart = series.chart,
			loadingId = 'series'+ idCounter++;
		
		// Ajax loaded data
		if (!options.data && options.dataURL) {
			chart.addLoading(loadingId);
			getAjax(options.dataURL, function(data) {
				series.dataLoaded(data);
				chart.clearLoading(loadingId);
			});
		} else {
			series.dataLoaded(options.data);
		}
	},
	dataLoaded: function(data) {
		var series = this,
			chart = series.chart,
			options = series.options,
			enabledStates = [''],
			//data = series.data,
			dataParser = options.dataParser,
			stateLayers = {},
			layerGroup,
			point,
			//pointInterval = options.pointInterval || 1,
			x;
		
		// if no dataParser is defined for ajax loaded data, assume JSON and eval the code
		if (options.dataURL && !dataParser) 
			dataParser = function(data){
				return eval(data);
			}
		// dataParser is defined, run parsing
		if (dataParser) data = dataParser.call(series, data);
		
		
		// create the group layer (TODO: move to render?)
		series.layerGroup = layerGroup = new Layer('series-group', chart.plotLayer.div, null, {
			zIndex: 2 // labels are underneath
		});
		
		if (options.states.hover.enabled) enabledStates.push('hover');
		each(enabledStates, function(state) { // create the state layers
			stateLayers[state] = new Layer('state-'+ state, layerGroup.div);
		});
		series.stateLayers = stateLayers;
		
		series.setData(data, false);
	
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
	 * 
	 * @todo: For reversed x axis, reverse the data once and for all here
	 */
	cleanData: function() {
		var series = this,
			data = series.data,
			i;
			//smallestInterval,
			//closestPoints,
			//interval;
			
		// sort the data points
		data.sort(function(a, b){
			return (a.x - b.x);
		});
		
		// remove points with equal x values
		// record the closest distance for calculation of column widths
		for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				if (data[i - 1].x == data[i].x)	data.splice(i - 1, 1); // remove the duplicate
				
				/*interval = data[i].x - data[i - 1].x
				if (smallestInterval === undefined || interval < smallestInterval) {
					smallestInterval = interval;
					closestPoints = i;	
				}*/
			}
		}
		//series.closestPoints = closestPoints;
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
				if (i > lastNull + 1)
					segments.push(data.slice(lastNull + 1, i));
				lastNull = i;	
			} else if (i == data.length - 1) { // last value
				segments.push(data.slice(lastNull + 1, i + 1));
			}
		});
		
		
		this.segments = segments;
		
		
	},
	
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} options
	 */
	setOptions: function(options) {
		var plotOptions = this.chart.options.plotOptions,
			options = merge(
				plotOptions[this.type], 
				plotOptions.series,
				options
			),
			normalSeriesMarkerOptions = options.marker,
			hoverSeriesMarkerOptions = options.states.hover.marker;
			
		// default hover values are dynamic based on basic state 
		//var stateOptions = seriesOptions.states[state].marker;
		if (hoverSeriesMarkerOptions.lineWidth === undefined) 
			hoverSeriesMarkerOptions.lineWidth = normalSeriesMarkerOptions.lineWidth + 1;
		if (hoverSeriesMarkerOptions.radius === undefined) 
			hoverSeriesMarkerOptions.radius = normalSeriesMarkerOptions.radius + 1;
		//markerOptions = merge(markerOptions, stateOptions);
		
		return options;
		
	},
	getColor: function(){
		var defaultColors = this.chart.options.colors;
		this.color = this.options.color || defaultColors[colorCounter++] || '#0000ff';
		if (colorCounter >= defaultColors.length) 
			colorCounter = 0;
	},
	getSymbol: function(){
		var defaultSymbols = this.chart.options.symbols,
			symbol = this.options.marker.symbol || 'auto';
		if (symbol == 'auto') symbol = defaultSymbols[symbolCounter++];
		this.symbol = symbol;
		if (symbolCounter >= defaultSymbols.length) 
			symbolCounter = 0;
	},
	
	/**
	 * Add a point dynamically after chart load time
	 * @param {Object} options Point options as given in series.data
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean} shift If shift is true, a point is shifted off the start 
	 * 		of the series as one is appended to the end.
	 */
	addPoint: function(options, redraw, shift) {
		var series = this,
			data = series.data,
			point = (new series.pointClass).init(series, options);
			
		redraw = pick(redraw, true);
			
		data.push(point);
		if (shift) data.shift();
		
		
		// redraw
		series.isDirty = true;
		if (redraw) series.chart.redraw();
	},
	
	/**
	 * Replace the series data with a new set of data
	 * @param {Object} data
	 * @param {Object} redraw
	 */
	setData: function(data, redraw) {
		var series = this;
		
		// data.push(point);
		// if (shift) data.shift();
		
		// generate the point objects
		//x = options.pointStart || 0;
		series.xIncrement = null; // reset for new data
		data = map(splat(data), function(pointOptions) {
			return (new series.pointClass).init(series, pointOptions);
			//return new PiePoint(series, pointOptions);
			//x += pointInterval;
			//return point;
		});
		
		
		// set the data
		series.data = data;
	
		series.cleanData();	
		series.getSegments();
		
		// redraw
		series.isDirty = true;
		if (pick(redraw, true)) series.chart.redraw();
	},
	
	
	/**
	 * Remove a series and optionally redraw the chart
	 * 
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 */
	
	remove: function(redraw) {
		var series = this,
			chart = series.chart;
			
		redraw = pick(redraw, true);
		
		if (!series.isRemoving) {  /* prevent triggering native event in jQuery
				(calling the remove function from the remove event) */ 
			series.isRemoving = true;

			// fire the event with a default handler of removing the point			
			fireEvent(series, 'remove', null, function() {
				
				// remove the layer group
				discardElement(series.layerGroup.div);
				
				// remove the area
				each (series.areas, function(area) {
					discardElement(area);
				});
						
				// remove legend item
				discardElement(series.legendItem);
				series.legendItem = null;
				
				
				// loop through the chart series to locate the series and remove it
				each(chart.series, function(existingSeries, i) {
					if (existingSeries == series) {
						chart.series.splice(i, 1);
					}
				})
				
				// redraw
				chart.isDirty = true;
				if (redraw) chart.redraw();
			})
			
		} 
		series.isRemoving = false
	},
	
	/**
	 * Translate data points from raw values 0 and 1 to x and y.
	 */
	translate: function() {
		var chart = this.chart, 
			series = this, 
			stacking = series.options.stacking,
			categories = series.xAxis.categories,
			yAxis = series.yAxis,
			stack = yAxis.stacks[series.type];
			
		// do the translation
		each(this.data, function(point) {
			var xValue = point.x, 
				yValue = point.y, 
				yBottom, 
				pointStack,
				pointStackTotal;
			point.plotX = series.xAxis.translate(point.x);
			
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
			if (yValue !== null) 
				point.plotY = yAxis.translate(yValue, 0, 1);
			
			// set client related positions for mouse tracking
			point.clientX = chart.inverted ? 
				chart.plotHeight - point.plotX + chart.plotTop : 
				point.plotX + chart.plotLeft; // for mouse tracking
				
			// some API data
			point.category = categories && categories[point.x] !== undefined ? 
				categories[point.x] : point.x;
				
		});
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			//concatenated = [],
			data = [],
			plotSize = inverted ? chart.plotHeight : chart.plotWidth,
			low,
			high,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension
			
		// renew
		if (renew) series.tooltipPoints = null;
			
		// concat segments to overcome null values
		each (series.segments, function(segment){
			data = data.concat(segment);
		});
		
		// loop the concatenated data and apply each point to all the closest
		// pixel positions
		if (series.xAxis && series.xAxis.reversed) data = data.reverse();//reverseArray(data);
		each (data, function(point, i) {
			
			
			if (!series.tooltipPoints) // only create the text the first time, not on zoom
				point.setTooltipText();
			
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
	 * Draw the actual graph
	 */
	drawLine: function(state) {
		var i, 
			j, 
			series = this, 
			options = series.options, 
			chart = series.chart, 
			doAnimation = options.animation && series.animate,
			layer = series.stateLayers[state], 
			data = series.data, 
			color,
			fillColor,
			inverted = chart.inverted, 
			y0 = (inverted ? 0 : chart.plotHeight) - series.yAxis.translate(0);
		
		// get state options
		if (state) {
			options = merge(options, options.states[state]);
		}
		color = options.lineColor || series.color; 
		fillColor = options.fillColor == 'auto' ? 
			Color(series.color).setOpacity(options.fillOpacity || 0.75).get() : 
			options.fillColor; 
			
		
		// initiate the animation
		if (doAnimation) series.animate(true);
		
		// divide into segments
		each(series.segments, function(segment){
			var line = [], 
				area = [];
			
			// get the points
			each(segment, function(point, i) {
				if (i && options.step) {
					var lastPoint = segment[i - 1];
					line.push (
						inverted ? chart.plotWidth - lastPoint.plotY : point.plotX, 
						inverted ? chart.plotHeight - point.plotX : lastPoint.plotY						
					);
				}

				line.push(
					inverted ? chart.plotWidth - point.plotY : point.plotX, 
					inverted ? chart.plotHeight - point.plotX : point.plotY
				);
			});
			
			// draw the area
			if (/area/.test(series.type)) {
				for (i = 0; i < line.length; i++) 
					area.push(line[i]);
				if (options.stacking && series.type != 'areaspline') {
					// follow stack back. Todo: implement areaspline
					for (i = segment.length - 1; i >= 0; i--) 
						area.push(segment[i].plotX, segment[i].yBottom);
					
				
				} else if (segment.length) { // follow zero line back
					area.push(
						inverted ? y0 : segment[segment.length - 1].plotX, 
						inverted ? chart.plotHeight - segment[segment.length - 1].plotX : y0, 
						inverted ? y0 : segment[0].plotX, 
						inverted ? chart.plotHeight - segment[0].plotX : y0
					);
				}
				layer.drawPolyLine(area, null, null, options.shadow, fillColor);
			}
			// draw the line
			if (options.lineWidth) layer.drawPolyLine(line, color, options.lineWidth, options.shadow);
		});
		
		// experimental animation
		if (doAnimation) series.animate();
		
	},
	/**
	 * Experimental animation
	 */
	animate: function(init) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			div = series.layerGroup.div;
		
		if (series.visible) {
			if (init) { // initialize the animation
				setStyles (
					div, 
					extend(
						{ overflow: HIDDEN }, 
						inverted ? { height: 0 } : { width: 0 }
					)
				);
			} else { // run the animation
				animate(
					div, 
					inverted ? { height: chart.plotHeight + PX } : { width: chart.plotWidth + PX }, 
					{ duration: 1000 }
				);
		
				// delete this function to allow it only once
				this.animate = null;
			}
		}
	},
	
	/**
	 * Draw the markers
	 */
	drawPoints: function(state){
		var series = this, i,  //state = series.state,
		layer = series.stateLayers[state], 
			seriesOptions = series.options, 
			markerOptions = seriesOptions.marker, 
			data = series.data, 
			chart = series.chart, 
			inverted = chart.inverted;
		
		/*if (state) {
			// default hover values are dynamic based on basic state 
			var stateOptions = seriesOptions.states[state].marker;
			if (stateOptions.lineWidth === undefined) 
				stateOptions.lineWidth = markerOptions.lineWidth + 1;
			if (stateOptions.radius === undefined) 
				stateOptions.radius = markerOptions.radius + 1;
			markerOptions = merge(markerOptions, stateOptions);
		}*/
		
		if (markerOptions.enabled) {
			each(data, function(point){
				if (point.plotY !== undefined) 
					series.drawMarker(
						layer, 
						inverted ? chart.plotWidth - point.plotY : point.plotX, 
						inverted ? chart.plotHeight - point.plotX : point.plotY, 
						merge(markerOptions, point.marker)
					);
				
				// draw the selected mode marker on top of the default one
				if (point.selected)	series.drawPointState(point, 'select', layer);
				
			});
		}
	},
	/**
	 * Some config objects, like marker, have a state value that depends on the base value
	 * @param {Object} props
	 */
	/*getDynamicStateValues: function(base, state, props) {
	 each (props, function(value, key) {
	 if (state[key] === undefined) state[key] = base[key] + value;
	 });
	 return state;
	 },*/
	/**
	 * Draw a single marker into a given layer and position
	 */
	drawMarker: function(layer, x, y, options) {
		if (options.lineColor == 'auto') 
			options.lineColor = this.color;
		if (options.fillColor == 'auto') 
			options.fillColor = this.color;
		if (options.symbol == 'auto') 
			options.symbol = this.symbol;
		layer.drawSymbol(
			options.symbol, 
			x, 
			y, 
			options.radius, 
			options.lineWidth, 
			options.lineColor, 
			options.fillColor
		);
	},
	
	/**
	 * Draw the data labels
	 */
	drawDataLabels: function() {
		if (this.options.dataLabels.enabled) {
			var series = this, 
				i, 
				x, 
				y, 
				data = series.data, 
				options = series.options.dataLabels, 
				color, 
				str, 
				dataLabelsLayer = series.dataLabelsLayer, 
				chart = series.chart, 
				inverted = chart.inverted,
				seriesType = series.type,
				isPie = (seriesType == 'pie'), 
				align;
				
			// create a separate layer for the data labels
			if (dataLabelsLayer) {
				dataLabelsLayer.clear();
			} else {
				series.dataLabelsLayer = dataLabelsLayer = new Layer('data-labels', 
					series.layerGroup.div, 
					null, {
						zIndex: 1
					});
			}
				
			// determine the color
			//options.style.color = options.color == 'auto' ? series.color : options.color;
			options.style.color = pick(options.style.color, series.color);
			
			// make the labels for each point
			each(data, function(point){
				var plotX = point.plotX,
					plotY = point.plotY,
					tooltipPos = point.tooltipPos;
					
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
				
				// special case for pies
				if (tooltipPos) {
					x = tooltipPos[0] + options.x;
					y = tooltipPos[1] + options.y;
				}
				// special for pies
				if (isPie) {
					if (!point.dataLabelsLayer) point.dataLabelsLayer =  
						new Layer('data-labels', point.layer.div, null, { zIndex: 3} );
					dataLabelsLayer = point.dataLabelsLayer;
				}
				
				// in columns, align the string to the column
				align = options.align;
				if (seriesType == 'column') 
					x += {
						center: point.w / 2,
						right: point.w
					}[align] || 0;
					
				
				if (str) dataLabelsLayer[isPie ? 'drawText' : 'addText'](
					str, 
					x, 
					y, 
					options.style, 
					options.rotation, 
					align
				);
					
			});
			if (!isPie) dataLabelsLayer.strokeText();
			
			// only draw once - todo: different labels in different states and single point label?
			//series.hasDrawnDataLabels = true;
		}
	},
	
	/**
	 * Draw a single point in a specific state
	 */
	drawPointState: function(point, state, layer){
		var chart = this.chart, 
			inverted = chart.inverted,
			isHoverState = state == 'hover',
			layer = layer || chart.singlePointLayer,
			options = this.options,
			stateOptions;
		
		// a specific layer for the currently active point
		if (isHoverState) {
			if (!layer) layer = chart.singlePointLayer = new Layer(
				'single-point', 
				chart.plotLayer.div, 
				null, 
				{ zIndex: 3 }
			);
			layer.clear();
		}
		
		if (state) {
			// merge series hover marker and marker hover marker
			var seriesStateOptions = options.states[state].marker, 
				pointStateOptions = options.marker.states[state];
			
			// the default for hover points is two more than normal radius
			if (isHoverState && pointStateOptions.radius === undefined) 
				pointStateOptions.radius = seriesStateOptions.radius + 2;
				
			// merge all options
			stateOptions = merge(
				options.marker, 
				point.marker, 
				seriesStateOptions, 
				pointStateOptions
			);
			
			// draw the marker
			if (stateOptions && stateOptions.enabled) 
				this.drawMarker(
					layer, 
					inverted ? chart.plotWidth - point.plotY : point.plotX, 
					inverted ? chart.plotHeight - point.plotX : point.plotY, 
					stateOptions
				);
		}
	},
	
	/**
	 * Clear DOM objects and free up memory
	 */
	destroy: function() {
		var series = this,
			prop;
		
		each (series.data, function(point) {
			point.destroy();
		});
		
		for (prop in series) series[prop] = null; 
	},
	
	/**
	 * Render the graph and markers
	 */
	render: function() {
		var series = this,
			state, 
			stateLayers = series.stateLayers;
			
		series.drawDataLabels();
		if (series.visible) for (state in stateLayers) {
			series.drawLine(state);
			series.drawPoints(state);			
		}
		else series.setVisible(false, false);
		
		// initially hide other states than normal
		if (!series.hasRendered && stateLayers.hover) {
			stateLayers.hover.hide();
			hasRendered = true;
		}
		
		series.isDirty = false; // means data is in accordance with what you see
		
	},
	
	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function() {
		var series = this;
		series.translate();
		series.setTooltipPoints(true);
		/*if (series.chart.options.tooltip.enabled) */series.createArea();
		series.clear();
		
		series.render();
	},
	
	
	/**
	 * Clear all graphics and HTML from the series layer group
	 */
	clear: function(){
		var stateLayers = this.stateLayers;
		for (var state in stateLayers) {
			stateLayers[state].clear();
			stateLayers[state].cleared = true;
		}
		if (this.dataLabelsLayer) {
			this.dataLabelsLayer.clear();
			this.hasDrawnDataLabels = false;
		}
	},
	
	/**
	 * Set the state of the graph and redraw
	 */
	setState: function(state) {
		state = state || '';
		if (this.state != state) {
			
			var series = this, 
				stateLayers = series.stateLayers, 
				newStateLayer = stateLayers[state],
				oldStateLayer = stateLayers[series.state],
				singlePointLayer = series.singlePointLayer || series.chart.singlePointLayer;
			
			series.state = state;
			
			if (newStateLayer) { // if not, hover state is disabled
				
				if (state) 
					newStateLayer.show();
				else {
					if (oldStateLayer) oldStateLayer.hide();
					if (singlePointLayer) singlePointLayer.clear();
				}
			}
		}
	},
	
	/**
	 * Set the visibility of the graph
	 * 
	 * @param vis {Boolean} True to show the series, false to hide. If undefined,
	 *        the visibility is toggled.
	 */
	setVisible: function(vis, redraw) {
		var series = this,
			chart = series.chart,
			//imagemap = chart.imagemap,
			layerGroup = series.layerGroup,
			legendItem = series.legendItem,
			areas = series.areas,
			oldVisibility = series.visible;
		
		// if called without an argument, toggle visibility
		series.visible = vis = vis === undefined ? !oldVisibility : vis;
		
		if (vis) {
			series.isDirty = true; // when series is initially hidden
			
			layerGroup.show();
		} else { 
			layerGroup.hide();
		}
			
		if (legendItem) { 
			legendItem.className = vis ? '' : HIGHCHARTS_HIDDEN;
			chart.legend.drawGraphics(true);
		}
			
		// hide or show areas
		if (areas) each (areas, function(area) {
			if (vis)
				//imagemap.insertBefore(area, imagemap.childNodes[1]);
				chart.tracker.insertAtFront(area); 
			else
				discardElement(area);
		});
		
		// rescale
		if (chart.options.chart.ignoreHiddenSeries) {
			
			// in a stack, all other series are affected
			if (series.options.stacking) each (chart.series, function(otherSeries) {
				if (otherSeries.options.stacking && otherSeries.visible) 
					otherSeries.isDirty = true;
			}); 
			
		}
		if (redraw !== false) chart.redraw();
		
		fireEvent(series, vis ? 'show' : 'hide');
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
	 *        undefined, the selection state is toggled.
	 */
	select: function(selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === undefined) ? !series.selected : selected;

		if (series.checkbox) series.checkbox.checked = selected;
		
		fireEvent(series, selected ? 'select' : 'unselect');
	},
	
	/**
	 * Calculate the mouseover area coordinates for a given data series
	 */
	getAreaCoords: function(){
	
		var data = this.data, 
			series = this, 
			datas = [], 
			chart = this.chart, 
			inverted = chart.inverted, 
			plotWidth = chart.plotWidth, 
			plotHeight = chart.plotHeight, 
			reversedXAxis = series.xAxis.reversed,
			reversedData,
			snap = chart.options.tooltip.snap,
			dataIsReverse,
			i = 0, 
			ret = [];
			
		
		each(series.splinedata || series.segments, function(data, i) {
			//if (reversedXAxis) data.reverse();//reverseArray(data);
			
			// Reverse the data in case of a reversed x axis. Spline data
			// is already reversed at this point, so we need to actually
			// inspect the data x values.
			reversedData = data.length > 1 && data[0].x > data[1].x;
			if (reversedData && !reversedXAxis || reversedXAxis && !reversedData) {
				data = data.reverse();
			}
			
			var coords = [], outlineTop = [], outlineBottom = [];
			each([outlineTop, outlineBottom], function(outline){
				var last = 0, i = 0, extreme, slice, 
					peaks = [data[0]], // add the first point at init
 					sign = outline == outlineTop ? 1 : -1, 
					intersects, 
					num, 
					x, y, lastX, lastY, x1, y1, x2, y2, dX, dY, pX, pY, l, factor, p1, p2, mA, mB, iX, iY, area;
				
				// pull out the highest and lowest peaks in slices of {snap} width,
				// push these peaks into the peaks array.
				while (data[i]) {
					if (data[i].plotX > data[last].plotX + snap || i == data.length - 1) {
						extreme = data[i];
						slice = data.slice(last, i - 1);
						each(slice, function(point) {
							if (sign * point.plotY < sign * extreme.plotY) {
								extreme = point;
							}
						});
						// push it only if we have moved on along the x axis
						if (mathRound(data[last].plotX) < mathRound(extreme.plotX) ||
								data[i].plotX > data[last].plotX + snap) {
							peaks.push(extreme);
						}
						
						last = i;
					}
					i++;
				}
				
				// push the last point
				if (peaks[peaks.length - 1] != data[data.length-1])
					peaks.push(data[data.length - 1]);
					
				
				
				// loop through the peaks and calculate rectangles {snap} pixels
				// away from the peaks.
				//peaks = data;
				for (i = 0; i < peaks.length; i++) {
				
					// clickable area
					if (i > 0) {
						// vector from last point to this
						x = peaks[i].plotX;
						y = peaks[i].plotY;
						lastX = peaks[i - 1].plotX;
						lastY = peaks[i - 1].plotY;
						
						
						dX = x - peaks[i - 1].plotX;
						dY = y - peaks[i - 1].plotY;
						
						
						
						// perpendicular vector
						pX = dY;
						pY = -dX;
						
						// length of the perpendicular vector
						l = math.sqrt(math.pow(pX, 2) + math.pow(pY, 2));
						
						
						// extend the line by {snap} pixels
						if (i == 1) {
							lastX -= (snap / l) * dX;
							lastY -= (snap / l) * dY;
						
						} else if (i == peaks.length - 1) {
							x += (snap / l) * dX;
							y += (snap / l) * dY;
						}
						
						// factors compared to snap
						factor = sign * snap / l;
						
						// incremental calculation of the top and bottom line
						
						// the new upper parallel vector
						x1 = mathRound(lastX + factor * pX);
						y1 = mathRound(lastY + factor * pY);
						x2 = mathRound(x + factor * pX);
						y2 = mathRound(y + factor * pY);
						
						// loop back until this line intersects a previous line
						if (outline[outline.length - 1] && outline[outline.length - 1][0] > x1) {
							intersects = false;
							while (!intersects) {
								p2 = outline.pop();
								p1 = outline[outline.length - 1];
								if (!p1) 
									break;
								// get intersection point
								// http://www.ultrashock.com/forums/showthread.php?t=81785
								mA = (y1 - y2) / (x1 - x2);
								mB = (p1[1] - p2[1]) / (p1[0] - p2[0]);
								
								iX = ((-mB * p1[0]) + p1[1] + (mA * x1) - y1) / (mA - mB);
								iY = (mA * (iX - x1)) + y1;
								
								if (iX > p1[0]) {
									outline.push([mathRound(iX), mathRound(iY), 1]);
									intersects = true;
								}
								
							}
						}
						else {
							if (!isNaN(x1)) 
								outline.push([x1, y1]);
						}
						if (outline[outline.length - 1] && outline[outline.length - 1][0] < x2) 
							outline.push([x2, y2]);
					}
				}
				
				
				
			});
			
			// area for detecting moveover
			for (i = 0; i < outlineTop.length; i++) { // top of the area
				coords.push(
					inverted ? plotWidth - outlineTop[i][1] : outlineTop[i][0], 
					inverted ? plotHeight - outlineTop[i][0] : outlineTop[i][1]
				);
				
			}
			for (i = outlineBottom.length - 1; i >= 0; i--) { // bottom of the area
				coords.push(
					inverted ? plotWidth - outlineBottom[i][1] : outlineBottom[i][0], 
					inverted ? plotHeight - outlineBottom[i][0] : outlineBottom[i][1]
				);
			}
			
			// single point: make circle
			if (!coords.length && data.length) {
				coords.push(mathRound(data[0].plotX), mathRound(data[0].plotY));
			}
			
			// visualize
			//series.stateLayers[''].drawPolyLine(coords, '#afaf00', 1);
			
			if (coords.length) ret.push([coords.join(',')]);
			
			// undo reverse
			//if (reversedXAxis) data.reverse();
		});
		
		return ret;
	},
	
	createArea: function() {
		if (this.options.enableMouseTracking === false) return;
		
		var area, 
			series = this,
			options = series.options,
			chart = series.chart,
			inverted = chart.inverted,
			tracker = chart.tracker,
			//cursor = series.options.cursor,
			coordsArray = series.getAreaCoords(), 
			firstArea, 
			seriesAreas = [],
			existingAreas = series.areas, 
			isCircle;
			
			
		// remove old areas in case of updating
		if (existingAreas) each (existingAreas, function(area) {
			discardElement(area);
		})
			
		// create each area
		each(coordsArray, function(coords) {
			isCircle = /^[0-9]+,[0-9]+$/.test(coords[0]);
			area = createElement('area', {
				shape: isCircle ? 'circle' : 'poly',
				chart: chart,
				coords: coords[0] + (isCircle ? ','+ chart.options.tooltip.snap : ''),
				onmouseover: function(e) {
					if (!series.visible || chart.mouseIsDown) return;
					
					var hoverSeries = chart.hoverSeries;
					
					// for column/scatterplots, register that we entered a new column
					// coords[1] contains the reference to a point - if
					// no such reference is given, the area refers to 
					// a series
					chart.hoverPoint = coords[1];
					
					// trigger the event, but to save processing time, 
					// only if defined
					if (options.events.mouseOver) { 
						fireEvent(series, 'mouseOver', {
							point:  chart.hoverPoint
						});
					}
					
					// set normal state to previous series
					if (hoverSeries && hoverSeries != series) 
						hoverSeries.setState();
					
					// bring to front	
					if (!/(column|bar|pie)/.test(series.type)) {
						//imagemap.insertBefore(this, imagemap.childNodes[1]);
						tracker.insertAtFront(area);
					}
					
					// hover this
					series.setState('hover');
					chart.hoverSeries = series;
				},
				onmouseout: function() {
					// trigger the event only if listeners exist
					var hoverSeries = chart.hoverSeries;
					if (hoverSeries && options.events.mouseOut) { 
						fireEvent(hoverSeries, 'mouseOut');
					}
				}
			});
			
			// add a href to make the cursor appear - simply adding
			// the style is not enough for IE.
			if (options.cursor == 'pointer') {
				area.href = 'javascript:;';
				
				/*if (options.allowDrag) {
					setStyles(area, { cursor: {
						'x': inverted ? 'ns-resize' : 'ew-resize',
						'xy': 'move',
						'y': inverted ? 'ew-resize' : 'ns-resize'
					}[options.dragType] });
				}*/
			}
		
			
			// insert latest on top
			tracker.insertAtFront(area);
			seriesAreas.push(area);
		});
		series.areas = seriesAreas;
		
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
	 * Translate the points and get the spline data
	 */
	translate: function() {
		var series = this;
		
		// do the partent translate
		Series.prototype.translate.apply(series, arguments);
		
		// get the spline data
		series.splinedata = series.getSplineData();
		
	},
	/**
	 * Draw the actual spline line with interpolated values
	 * @param {Object} state
	 */
	drawLine: function(state) {
		var series = this,
			realSegments = series.segments; 
		
		// temporarily set the segments to reflect the spline
		series.segments = series.splinedata;// || series.getSplineData();
		
		// draw the line
		Series.prototype.drawLine.apply(series, arguments);
		
		// reset the segments
		series.segments = realSegments;	
	},
	/**
	 * Get interpolated spline values
	 */
	getSplineData: function() {
		var series = this, 
			chart = series.chart,
			//data = this.data,
			splinedata = [],
			num;
		each (series.segments, function(data) {
			if (series.xAxis.reversed) data = data.reverse();//reverseArray(data);
			var croppedData = [],
				nextUp,
				nextDown;
			
			// to save calculations, only add data within the plot
			each (data, function(point, i) {
				nextUp = data[i+2] || data[i+1] || point;
				nextDown = data[i-2] || data[i-1] || point;
				if (nextUp.plotX > 0 && nextDown.plotX < chart.plotWidth) {
					croppedData.push(point);
				}
			});
				
			// 3px intervals:
			if (croppedData.length > 1) {
				num = mathRound(mathMax(chart.plotWidth, 
					croppedData[croppedData.length-1].clientX	- croppedData[0].clientX) / 3);
			}
			splinedata.push (
				data.length > 1 ? // if the data.length is one, it's a single point so we can't spline it
					num ? (new SplineHelper(croppedData)).get(num) : [] :
					data
			);
		});
		series.splinedata = splinedata;
		return splinedata;
	}
});
seriesTypes.spline = SplineSeries;
		

/**
 * Calculate the spine interpolation.
 * 
 * @todo: Implement true Bezier curves like shown at http://www.math.ucla.edu/~baker/java/hoefer/Spline.htm
 */
function SplineHelper (data) {
	var xdata = [];
	var ydata = [];
	for (var i = 0; i < data.length; i++) {
		xdata[i] = data[i].plotX;
		ydata[i] = data[i].plotY;
	}
	this.xdata = xdata;
	this.ydata = ydata;
	var delta = [];
	this.y2 = [];

	var n = ydata.length;
	this.n = n;

	// Natural spline 2:derivate == 0 at endpoints
	this.y2[0]    = 0.0;
	this.y2[n-1] = 0.0;
	delta[0] = 0.0;

	// Calculate 2:nd derivate
	for(var i=1; i < n-1; i++) {
	    var d = (xdata[i+1]-xdata[i-1]);
	    /*if( d == 0  ) {
			error: ('Invalid input data for spline. Two or more consecutive input X-values are equal. Each input X-value must differ since from a mathematical point of view it must be a one-to-one mapping, i.e. each X-value must correspond to exactly one Y-value.');
	    }*/
	    var s = (xdata[i]-xdata[i-1])/d;
	    var p = s*this.y2[i-1]+2.0;
	    this.y2[i] = (s-1.0)/p;
	    delta[i] = (ydata[i+1]-ydata[i])/(xdata[i+1]-xdata[i]) -
		         (ydata[i]-ydata[i-1])/(xdata[i]-xdata[i-1]);
	    delta[i] = (6.0*delta[i]/(xdata[i+1]-xdata[i-1])-s*delta[i-1])/p;
	}

	// Backward substitution
	for(var j=n-2; j >= 0; j-- ) {
	    this.y2[j] = this.y2[j]*this.y2[j+1] + delta[j];
	}
};
SplineHelper.prototype = {
// Return the two new data vectors
get: function(num) {
	if (!num) num = 50;
	var n = this.n ;
	var step = (this.xdata[n-1]-this.xdata[0]) / (num-1);
	var xnew=[];
	var ynew=[];
	xnew[0] = this.xdata[0];
	ynew[0] = this.ydata[0];
	var data = [{ plotX: xnew[0], plotY: ynew[0] }];//[[xnew[0], ynew[0]]];

	for(var j = 1; j < num; j++ ) {
	    xnew[j] = xnew[0]+j*step;
	    ynew[j] = this.interpolate(xnew[j]);
	    data[j] = { plotX: xnew[j], plotY: ynew[j] };//[xnew[j], ynew[j]];
	}

	return data;
},

// Return a single interpolated Y-value from an x value
interpolate: function(xpoint) {
	var max = this.n-1;
	var min = 0;

	// Binary search to find interval
	while( max-min > 1 ) {
	    var k = (max+min) / 2;
		if( this.xdata[mathFloor(k)] > xpoint )
			max=k;
	    else
			min=k;
	}
	var intMax = mathFloor(max), intMin = mathFloor(min);

	// Each interval is interpolated by a 3:degree polynom function
	var h = this.xdata[intMax]-this.xdata[intMin];
	/*if( h == 0  ) {
	    error: ('Invalid input data for spline. Two or more consecutive input X-values are equal. Each input X-value must differ since from a mathematical point of view it must be a one-to-one mapping, i.e. each X-value must correspond to exactly one Y-value.');
	}*/


	var a = (this.xdata[intMax]-xpoint)/h;
	var b = (xpoint-this.xdata[intMin])/h;
	return a*this.ydata[intMin]+b*this.ydata[intMax]+
	     ((a*a*a-a)*this.y2[intMin]+(b*b*b-b)*this.y2[intMax])*(h*h)/6.0;
}

};


/**
 * AreaSplineSeries object
 */
var AreaSplineSeries = extendClass(SplineSeries, {
	type: 'areaspline'
});
seriesTypes.areaspline = AreaSplineSeries
		

/**
 * ColumnSeries object
 */
var ColumnSeries = extendClass(Series, {
	type: 'column',
	
	init: function() {
		Series.prototype.init.apply(this, arguments);
		
		var series = this,
			chart = series.chart;
		
		
		// record number of column series to calculate column width
		//if (!series.options.stacking) series.countColumn = true;
		
		// if the series is added dynamically, force redraw of other
		// series affected by a new column
		if (chart.hasRendered) each (chart.series, function(otherSeries) {
			if (otherSeries.type == series.type) otherSeries.isDirty = true;
		});
	},
	
	translate: function() {
		var series = this,
			chart = series.chart,
			columnCount = 0,
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
					if (!defined(stackedIndex)) stackedIndex = columnCount++;
					otherSeries.columnIndex = stackedIndex;
				}
			}
		});
		
		// calculate the width and position of each column based on 
		// the number of column series in the plot, the groupPadding
		// and the pointPadding options
		var options = series.options,
			data = series.data,
			inverted = chart.inverted,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			closestPoints = series.closestPoints,
			categoryWidth = mathAbs(
				data[1] ? data[closestPoints].plotX - data[closestPoints - 1].plotX : 
				(inverted ? plotHeight : plotWidth)
			),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 : 
				pointOffsetWidth * options.pointPadding,
			pointWidth = pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding),
			columnIndex = (chart.options.xAxis && chart.options.xAxis.reversed ? columnCount - 
				series.columnIndex : series.columnIndex) || 0,
			pointX = -(categoryWidth / 2) + groupPadding + columnIndex *
				pointOffsetWidth + pointPadding,
			//pointY0 = plotWidth - chart.xAxis.translate(0),
			translatedY0 = series.yAxis.translate(0),
			minPointLength = options.minPointLength,
			height;
			
		// record the new values
		each (data, function(point) {
			point.plotX += pointX;
			point.w = pointWidth;
			point.y0 = (inverted ? plotWidth : plotHeight) - translatedY0;
			
			height = (point.yBottom || point.y0) - point.plotY;
			if (minPointLength && mathAbs(height) < minPointLength) {
				height = (height < 0 ? 1 : -1) * minPointLength;
			}
			point.h = height;
			
		});
		
	},
	
	drawLine: function() {
	},
	
	getSymbol: function(){
	},
	
	drawPoints: function(state) {
		var series = this,
			options = series.options,
			chart = series.chart,
			doAnimation = options.animation && series.animate,
			plot = chart.plot,
			inverted = chart.inverted,
			data = series.data,
			layer = series.stateLayers[state];
			
		// make ready for animation
		if (doAnimation) this.animate(true);
	    
		// draw the columns
		// todo: record the rectangle coordinates and reuse them for the mouseover area
		each (data, function(point) {
			if (point.plotY !== undefined) layer.drawRect(
				inverted ? 
					(point.h >= 0 ? chart.plotWidth - point.plotY - point.h : chart.plotWidth - point.plotY) :				
					point.plotX,
				inverted ? chart.plotHeight - point.plotX - point.w : 
					(point.h >= 0 ? point.plotY : point.plotY + point.h), // for negative bars, subtract h (Opera) 
				inverted ? mathAbs(point.h) : point.w, 
				inverted ? point.w : mathAbs(point.h),
				options.borderColor, 
				options.borderWidth, 
				options.borderRadius, 
				point.color || series.color,
				options.shadow
			);
			
			// draw the selected mode marker on top of the default one
			if (point.selected)	series.drawPointState(point, 'select', layer);
		});
		if (doAnimation) series.animate();
	},
	

	/**
	 * Draw a single point in hover state
	 */
	drawPointState: function(point, state, layer) {
		// local vars
		var series = this,
			chart = series.chart,
			seriesOptions = series.options,
			pointOptions = point ? point.options : null,	
			plot = chart.plot,
			inverted = chart.inverted,
			//singlePointLayer = series.singlePointLayer;
			layer = layer || series.singlePointLayer; 
			
		// use one layer each series as opposed to the chartwide singlePointLayer for line-type series.
		/*if (!singlePointLayer) singlePointLayer = series.singlePointLayer = new Layer(
				'single-point-layer', 
				series.layerGroup.div
			);
		singlePointLayer.clear();*/
				
		// a specific layer for the currently active point
		if (state == 'hover') {
			if (!layer) layer = series.singlePointLayer = new Layer(
				'single-point',  
				series.layerGroup.div
			);
			layer.clear();
		}
		
		// draw the column
		if (state && this.options.states[state]) {
			var options = merge(
				seriesOptions, 
				seriesOptions.states[state],
				pointOptions
			);
			layer.drawRect(
				inverted ? 
					(point.h >= 0 ? chart.plotWidth - point.plotY - point.h : chart.plotWidth - point.plotY) :				
					point.plotX,
				inverted ? chart.plotHeight - point.plotX - point.w : 
					(point.h >= 0 ? point.plotY : point.plotY + point.h), // for negative bars, subtract h (Opera) 
				inverted ? mathAbs(point.h) : point.w, 
				inverted ? point.w : mathAbs(point.h),
				options.borderColor, 
				options.borderWidth, 
				options.borderRadius, 
				Color(options.color || this.color).brighten(options.brightness).get(),
				options.shadow		
			)
		}
	},
	
	getAreaCoords: function() {
		var areas = [],
			chart = this.chart,
			inverted = chart.inverted;
		each (this.data, function(point) {
			var pointH = mathMax(mathAbs(point.h), 3) * (point.h < 3 ? -1 : 1),
				x1 = inverted ? chart.plotWidth - point.plotY - pointH : point.plotX,
				y2 = inverted ? chart.plotHeight - point.plotX - point.w  : point.plotY,
				y1 = y2 + (inverted ? point.w : pointH),
				x2 = x1 + (inverted ? pointH : point.w);
				
				
			// make sure tightly packed colums can receive mouseover
			if (!inverted && mathAbs(x2 - x1) < 1) x2 = x1 + 1;
			else if (inverted && mathAbs(y2 - y1) < 1) y2 = y1 + 1;
				
			// push an array containing the coordinates and the point
			areas.push([
				map([
					x1, y1, 
					x1, y2, 
					x2, y2, 
					x2, y1
				], mathRound).join(','),
				point
			]);
		});
		return areas;
	},
	
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
				if (smallestInterval === undefined || interval < smallestInterval) {
					smallestInterval = interval;
					closestPoints = i;	
				}
			}
		}
		series.closestPoints = closestPoints;
	},
	
	animate: function(init) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			div = series.layerGroup.div,
			dataLabelsLayer = series.dataLabelsLayer;
		if (init) { // initialize the animation
			div.style[inverted ? 'left' : 'top'] = 
				(inverted ? -chart.plotWidth : chart.plotHeight) + PX;
			
				
		} else { // run the animation
			animate(div, chart.inverted ? { left: 0 } : { top: 0 });		
			
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
		if (chart.hasRendered) each (chart.series, function(otherSeries) {
			if (otherSeries.type == series.type) otherSeries.isDirty = true;
		});
		
		Series.prototype.remove.apply(series, arguments);
	}
});
seriesTypes.column = ColumnSeries;

/**
 * The bar series class
 */
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
	 * Calculate the mouseover area coordinates for a given data series
	 */
	getAreaCoords: function () {

		var data = this.data,
			coords, 
			ret = [];
			
			
		each (data, function(point) {
			// create a circle for each point
			ret.push([[mathRound(point.plotX), mathRound(point.plotY)].join(','), point]);
		});
		return ret;
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
	setState: function(state) {
		this.series.drawPointState(this, state);
	},
	init: function () {
		
		Point.prototype.init.apply(this, arguments);
		
		var point = this,
			series = point.series,
			defaultColors = series.chart.options.colors,
			toggleSlice;
		
		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice'),
			color: point.color || defaultColors[colorCounter++]
		});
		
		// loop back to zero
		if (colorCounter >= defaultColors.length) colorCounter = 0;
		
		// create an individual layer
		if (!point.layer) point.layer = new Layer('pie', series.layerGroup.div);
		
		// add event listener for select
		toggleSlice = function() {
			point.slice();
		}
		addEvent(point, 'select', toggleSlice);
		addEvent(point, 'unselect', toggleSlice);
		
		return point;
	},
	setVisible: function(vis) {
		var point = this, 
			layer = point.layer,
			legendItem = point.legendItem;
			
		
		// if called without an argument, toggle visibility
		point.visible = vis = vis === undefined ? !point.visible : vis;
		
		if (vis) 
			layer.show();
		else 
			layer.hide();
	
		if (legendItem) { 
			legendItem.className = vis ? '' : HIGHCHARTS_HIDDEN;
			point.series.chart.legend.drawGraphics(true);
		}
	},
	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled 
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function(sliced, redraw) {
		var point = this,
			series = point.series;
		
		// redraw is true by default
		redraw = pick(redraw, true);
			
		// if called without an argument, toggle
		point.sliced = defined(sliced) ? sliced : !point.sliced;
		
		series.isDirty = true;
		
		if (redraw) series.chart.redraw();
		
	}
});


/**
 * The Pie series class
 */
var PieSeries = extendClass(Series, {
	type: 'pie',
	isCartesian: false,
	pointClass: PiePoint,
	getColor: function() {
		// pie charts have a color each point
	},
	translate: function() {
		var total = 0,
			series = this,
			cumulative = -0.25, // start at top
			options = series.options,
			slicedOffset = options.slicedOffset,
			positions = options.center,
			size = options.size,
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			data = series.data,
			circ = 2 * math.PI,
			fraction;
			
		// get positions - either an integer or a percentage string must be given
		positions.push(options.size);
		positions = map (positions, function(length, i) {
			return /%$/.test(length) ? 
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to height
				[plotWidth, plotHeight, math.min(plotWidth, plotHeight)][i]
					* parseInt(length) / 100:
				length;
		});
					
		// get the total sum
		each (data, function(point) {
			total += point.y;
		});
		
		each (data, function(point) {
			// set start and end angle
			fraction = total ? point.y / total : 0
			point.start = cumulative * circ;
			cumulative += fraction;
			point.end = cumulative * circ;
			point.percentage = fraction * 100;
			point.total = total;
			
			// set size and positions
			point.center = [positions[0], positions[1]];
			point.size = positions[2];
			
			// center for the sliced out slice
			var angle = (point.end + point.start) / 2;
			point.centerSliced = map([
				mathCos(angle) * slicedOffset + positions[0], 
				mathSin(angle) * slicedOffset + positions[1]
			], mathRound);
			
		});
		
		this.setTooltipPoints();
	},
	
	/**
	 * Render the graph and markers
	 */
	render: function() {
		//if (!this.pointsDrawn) 
		this.drawPoints();
		this.drawDataLabels();
	},
	
	/**
	 * Draw the data points
	 * @param {Object} state The state of this graph
	 */
	drawPoints: function(state) {
		var series = this;
		
		// draw the slices
		each (this.data, function(point) {
			series.drawPoint(point, point.layer.getCtx(), point.color);
			
			if (point.visible === false) point.setVisible(false);
			
			// draw the selected mode marker on top of the default one
			if (point.selected)	series.drawPointState(point, 'select', point.layer);
			
			//if (point.sliced) this.slice(point);		
		});
		
		//series.pointsDrawn = true;
	},
	
	getSymbol: function(){
	},
	

	/**
	 * Draw a single point in hover state
	 */
	drawPointState: function(point, state, layer) {
		var series = this,
			seriesOptions = series.options;

		
		if (point) { // drawPointState can be called without arguments to clear states

			// create a special state layer nested in this point's main layer
			/*stateLayer = point.stateLayer;
			if (!stateLayer) 
				stateLayer = point.stateLayer = new Layer('state-layer', point.layer.div);
			stateLayer.clear();*/
			
			// a specific layer for the currently active point
			
			layer = layer || point.stateLayer;
			if (state == 'hover') {
				if (!layer) layer = point.stateLayer = new Layer(
					'single-point',  
					point.layer.div
				);
				layer.clear();
			}
			
			// draw the point
			if (state && series.options.states[state]) {
				var options = merge(seriesOptions, seriesOptions.states[state]);
				this.drawPoint(
					point, 
					layer.getCtx(), 
					options.color || point.color, 
					options.brightness
				);
			}
			
		}
		// clear the old point on register the new one
		if (series.hoverPoint && series.hoverPoint.stateLayer) series.hoverPoint.stateLayer.clear();
		series.hoverPoint = point;
	},
	
	/**
	 * Draw a single point (pie slice)
	 * @param {Object} point The point object
	 * @param {Object} ctx The canvas context to draw it into
	 * @param {Object} color The color of the point
	 * @param {Object} brightness The brightness relative to the color
	 */
	drawPoint: function(point, ctx, color, brightness) {
		var options = this.options,
			center = point.sliced ? point.centerSliced : point.center,
			centerX = center[0],
			centerY = center[1],
			size = point.size,
			borderWidth = options.borderWidth,
			/* IE7 and IE6 fail to render a full circle unless start and
			end points are equal: */
			end = isIE && point.percentage > 99.999 ? point.start : point.end;
			
		// Todo: make Layer.prototype.drawArc method
		if (point.y > 0) { // drawing 0 will draw a full disc in IE
			ctx.fillStyle = setColor(Color(color).brighten(brightness).get(ctx), ctx);
			ctx.strokeStyle = options.borderColor;
			ctx.lineWidth = borderWidth;
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, size / 2, point.start, end, false);
			ctx.lineTo(centerX, centerY);
			ctx.closePath();
			ctx.fill();
			if (borderWidth) ctx.stroke(); // in WebKit, a zero width line will display as 1 if stroked
		}
	},
	/**
	 * Pull the slice out from the pie
	 * @param {Object} point
	 */
	/*slice: function(point) {
		var centerSliced = point.centerSliced;
		setStyles(point.layer, {
			left: centerSliced[0] + PX,
			top: centerSliced[1] + PX
		});
	},*/
	/**
	 * Get the coordinates for the mouse tracker area
	 */
	getAreaCoords: function() {
		var areas = [];
		var series = this;
		each (this.data, function(point) {
			var centerX = point.center[0],
				centerY = point.center[1],
				radius = point.size / 2,
				start = point.start,
				end = point.end,
				coords = [];
				
			// start building the coordinates from the start point
			// with .25 radians (~15 degrees) increments the coordinates
			for (var angle = start; 1; angle += 0.25) {
				if (angle >= end) angle = end;
				coords = coords.concat([
					centerX + mathCos(angle) * radius,
					centerY + mathSin(angle) * radius
				])
				if (angle >= end) break;
			}
			
			// wrap it up with the center point		
			coords = coords.concat([
				centerX, centerY
			]);
						
			// set tooltip position in the center of the sector
			point.tooltipPos = [
				centerX + 2 * mathCos((start + end) / 2) * radius / 3,
				centerY + 2 * mathSin((start + end) / 2) * radius / 3
			];
			
			// push an array containing the coordinates and the point
			areas.push([
				map(coords, mathRound).join(','),
				point
			])
			
		});
		return areas;
	},
	
	/**
	 * Extend the default setData method by first removing the old points
	 */
	setData: function() {
		// destroy old points, since the pie has one layer each point
		var series = this,
			data = series.data,
			i;
		if (data) {
			for (i = data.length - 1; i >= 0; i--) {
				data[i].remove();
			}
		}
		
		Series.prototype.setData.apply(series, arguments);
	},
	
	/**
	 * Clear all graphics and HTML from the series layer group
	 */
	clear: function() {
		/*var stateLayers = this.stateLayers;
		for (var state in stateLayers) {
			stateLayers[state].clear();
			stateLayers[state].cleared = true;
		}
		if (this.dataLabelsLayer) {
			this.dataLabelsLayer.clear();
			this.hasDrawnDataLabels = false;
		}*/
		// pies have separate layers per point
		each (this.data, function(point) {
			point.layer.clear();
			if (point.dataLabelsLayer) point.dataLabelsLayer.clear();
			if (point.stateLayer) point.stateLayer.clear();
		});
	}
});
seriesTypes.pie = PieSeries;


// global variables
Highcharts = {
	/*'load': function(arr) {
		each (arr, function(url) {
			getAjax(url, function(script) {
				eval(script)
			})
		})
	},*/
	numberFormat: numberFormat,
	dateFormat: dateFormat,
	defaultOptions: defaultOptions,
	setOptions: setOptions,
	Chart: Chart,
	extendClass: extendClass,
	seriesTypes: seriesTypes,
	Layer: Layer
}


})();
