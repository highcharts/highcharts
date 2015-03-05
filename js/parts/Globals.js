// encapsulated variables
var deg2rad = Math.PI * 2 / 360,


	// some variables
	isOpera = window.opera,
	isIE = /(msie|trident)/i.test(navigator.userAgent) && !isOpera,
	docMode8 = document.documentMode === 8,
	isWebKit = /AppleWebKit/.test(navigator.userAgent),
	isFirefox = /Firefox/.test(navigator.userAgent),
	isTouchDevice = /(Mobile|Android|Windows Phone)/.test(navigator.userAgent),
	SVG_NS = 'http://www.w3.org/2000/svg',
	hasSVG = !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect,
	hasBidiBug = isFirefox && parseInt(navigator.userAgent.split('Firefox/')[1], 10) < 4, // issue #38
	useCanVG = !hasSVG && !isIE && !!document.createElement('canvas').getContext,
	Renderer,
	hasTouch,
	symbolSizes = {},
	idCounter = 0,
	garbageBin,
	defaultOptions,
	dateFormat, // function
	globalAnimation,
	pathAnim,
	timeUnits,
	noop = function () {},
	charts = [],
	chartCount = 0,

	// some constants for frequently used strings
	numRegex = /^[0-9]+$/,
	marginNames = ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
	
	// Object for extending Axis
	AxisPlotLineOrBandExtension,

	// time methods, changed based on whether or not UTC is used
	Date,  // Allow using a different Date class
	makeTime,
	timezoneOffset,
	getTimezoneOffset,
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


	// lookup over the types and the associated classes
	seriesTypes = {},
	Highcharts;

// The Highcharts namespace
Highcharts = window.Highcharts = window.Highcharts ? error(16, true) : {};

Highcharts.seriesTypes = seriesTypes;
