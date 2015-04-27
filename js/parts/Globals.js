// The Highcharts namespace
var Highcharts = window.Highcharts = window.Highcharts ? error(16, true) : {
	deg2rad: Math.PI * 2 / 360,
	isIE: /(msie|trident)/i.test(navigator.userAgent) && !window.opera,
	isWebKit: /AppleWebKit/.test(navigator.userAgent),
	isFirefox: /Firefox/.test(navigator.userAgent),
	isTouchDevice: /(Mobile|Android|Windows Phone)/.test(navigator.userAgent),
	SVG_NS: 'http://www.w3.org/2000/svg',
	idCounter: 0,
	chartCount: 0,
	seriesTypes: {},
	timeUnits: {
		millisecond: 1,
		second: 1000,
		minute: 60000,
		hour: 3600000,
		day: 24 * 3600000,
		week: 7 * 24 * 3600000,
		month: 28 * 24 * 3600000,
		year: 364 * 24 * 3600000
	},
	charts: [],
	noop: function () {}
},	init = function () {
		var H = Highcharts;
		H.svg = !!document.createElementNS && !!document.createElementNS(H.SVG_NS, 'svg').createSVGRect;
		H.useCanVG = !H.svg && !H.isIE && !!document.createElement('canvas').getContext;
		H.hasBidiBug = H.isFirefox && parseInt(navigator.userAgent.split('Firefox/')[1], 10) < 4; // issue #38
	};

	// Initialize some Highcharts variables
	init();

	// Object for extending Axis
var AxisPlotLineOrBandExtension,

	// time methods, changed based on whether or not UTC is used
	Date,  // Allow using a different Date class
	getHours,
	getDay,
	getDate,
	getMonth,
	getFullYear,
	setMilliseconds,
	setSeconds,
	setMinutes,
	setHours,
	setDate,
	setMonth,
	setFullYear;