/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Color.js';
import './Utilities.js';
var color = H.color,
	each = H.each,
	getTZOffset = H.getTZOffset,
	isTouchDevice = H.isTouchDevice,
	merge = H.merge,
	pick = H.pick,
	svg = H.svg,
	win = H.win;
		
/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
H.defaultOptions = {
	/*= if (build.classic) { =*/
	colors: '${palette.colors}'.split(' '),
	/*= } =*/
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: [
			'January', 'February', 'March', 'April', 'May', 'June', 'July',
			'August', 'September', 'October', 'November', 'December'
		],
		shortMonths: [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
			'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		],
		weekdays: [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday',
			'Thursday', 'Friday', 'Saturday'
		],
		// invalidDate: '',
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ' '
	},
	global: {
		useUTC: true,
		//timezoneOffset: 0,
		/*= if (build.classic) { =*/
		VMLRadialGradientURL: 'http://code.highcharts.com/@product.version@/gfx/vml-radial-gradient.png'
		/*= } =*/
	},
	chart: {
		//animation: true,
		//alignTicks: false,
		//reflow: true,
		//className: null,
		//events: { load, selection },
		//margin: [null],
		//marginTop: null,
		//marginRight: null,
		//marginBottom: null,
		//marginLeft: null,
		borderRadius: 0,
		/*= if (!build.classic) { =*/
		colorCount: 10,
		/*= } =*/
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		spacing: [10, 10, 15, 10],
		//spacingTop: 10,
		//spacingRight: 10,
		//spacingBottom: 15,
		//spacingLeft: 10,
		//zoomType: ''
		resetZoomButton: {
			theme: {
				zIndex: 20
			},
			position: {
				align: 'right',
				x: -10,
				//verticalAlign: 'top',
				y: 10
			}
			// relativeTo: 'plot'
		},
		width: null,
		height: null,
		
		/*= if (build.classic) { =*/
		borderColor: '${palette.highlightColor80}',
		//borderWidth: 0,
		//style: {
		//	fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
		//	fontSize: '12px'
		//},
		backgroundColor: '${palette.backgroundColor}',
		//plotBackgroundColor: null,
		plotBorderColor: '${palette.neutralColor20}'
		//plotBorderWidth: 0,
		//plotShadow: false,
		/*= } =*/
	},
	title: {
		text: 'Chart title',
		align: 'center',
		// floating: false,
		margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		// style: {}, // defined inline
		widthAdjust: -44

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		// style: {}, // defined inline
		widthAdjust: -44
	},

	plotOptions: {},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: 'absolute',
			color: '${palette.neutralColor80}'
		}
	},
	legend: {
		enabled: true,
		align: 'center',
		//floating: false,
		layout: 'horizontal',
		labelFormatter: function () {
			return this.name;
		},
		//borderWidth: 0,
		borderColor: '${palette.neutralColor40}',
		borderRadius: 0,
		navigation: {
			/*= if (build.classic) { =*/
			activeColor: '${palette.highlightColor100}',
			inactiveColor: '${palette.neutralColor20}'
			/*= } =*/
			// animation: true,
			// arrowSize: 12
			// style: {} // text styles
		},
		// margin: 20,
		// reversed: false,
		// backgroundColor: null,
		/*style: {
			padding: '5px'
		},*/
		/*= if (build.classic) { =*/
		itemStyle: {			
			color: '${palette.neutralColor80}',
			fontSize: '12px',
			fontWeight: 'bold',
			textOverflow: 'ellipsis' // docs: Explain the difference, setting
				// this to null will make long texts wrap
		},
		itemHoverStyle: {
			//cursor: 'pointer', removed as of #601
			color: '${palette.neutralColor100}'
		},
		itemHiddenStyle: {
			color: '${palette.neutralColor20}'
		},
		shadow: false,
		/*= } =*/
		itemCheckboxStyle: {
			position: 'absolute',
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
		squareSymbol: true,
		// symbolRadius: 0,
		// symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		// width: undefined,
		x: 0,
		y: 0,
		title: {
			//text: null,
			/*= if (build.classic) { =*/
			style: {
				fontWeight: 'bold'
			}
			/*= } =*/
		}			
	},

	loading: {
		// hideDuration: 100,
		// showDuration: 0,
		/*= if (build.classic) { =*/
		labelStyle: {
			fontWeight: 'bold',
			position: 'relative',
			top: '45%'
		},
		style: {
			position: 'absolute',
			backgroundColor: '${palette.backgroundColor}',
			opacity: 0.5,
			textAlign: 'center'
		}
		/*= } =*/
	},

	tooltip: {
		enabled: true,
		animation: svg,
		//crosshairs: null,
		borderRadius: 3,
		dateTimeLabelFormats: {
			millisecond: '%A, %b %e, %H:%M:%S.%L',
			second: '%A, %b %e, %H:%M:%S',
			minute: '%A, %b %e, %H:%M',
			hour: '%A, %b %e, %H:%M',
			day: '%A, %b %e, %Y',
			week: 'Week from %A, %b %e, %Y',
			month: '%B %Y',
			year: '%Y'
		},
		footerFormat: '',
		//formatter: defaultFormatter,
		/* todo: em font-size when finished comparing against HC4
		headerFormat: '<span style="font-size: 0.85em">{point.key}</span><br/>',
		*/
		padding: 8,

		//shape: 'callout',
		//shared: false,
		snap: isTouchDevice ? 25 : 10,
		/*= if (!build.classic) { =*/
		headerFormat: '<span class="highcharts-header">{point.key}</span><br/>',
		pointFormat: '<span class="highcharts-color-{point.colorIndex}">' +
			'\u25CF</span> {series.name}: <span class="highcharts-strong">' +
			'{point.y}</span><br/>',
		/*= } else { =*/
		backgroundColor: color('${palette.neutralColor3}').setOpacity(0.85).get(),
		borderWidth: 1,
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
		shadow: true,
		style: {
			color: '${palette.neutralColor80}',
			cursor: 'default',
			fontSize: '12px',
			pointerEvents: 'none', // #1686 http://caniuse.com/#feat=pointer-events
			whiteSpace: 'nowrap'
		}
		/*= } =*/
		//xDateFormat: '%A, %b %e, %Y',
		//valueDecimals: null,
		//valuePrefix: '',
		//valueSuffix: ''
	},

	credits: {
		enabled: true,
		href: 'http://www.highcharts.com',
		position: {
			align: 'right',
			x: -10,
			verticalAlign: 'bottom',
			y: -5
		},
		/*= if (build.classic) { =*/
		style: {
			cursor: 'pointer',
			color: '${palette.neutralColor40}',
			fontSize: '9px'
		},
		/*= } =*/
		text: 'Highcharts.com'
	}
};



/**
 * Sets the getTimezoneOffset function. If the timezone option is set, a default
 * getTimezoneOffset function with that timezone is returned. If not, the
 * specified getTimezoneOffset function is returned. If neither are specified,
 * undefined is returned.
 * @return {function} a getTimezoneOffset function or undefined
 */
function getTimezoneOffsetOption() {
	var globalOptions = H.defaultOptions.global,
		moment = win.moment;

	if (globalOptions.timezone) {
		if (!moment) {
			// getTimezoneOffset-function stays undefined because it depends on
			// Moment.js
			H.error(25);
			
		} else {
			return function (timestamp) {
				return -moment.tz(
					timestamp,
					globalOptions.timezone
				).utcOffset();
			};
		}
	}

	// If not timezone is set, look for the getTimezoneOffset callback
	return globalOptions.useUTC && globalOptions.getTimezoneOffset;
}

/**
 * Set the time methods globally based on the useUTC option. Time method can be
 *   either local time or UTC (default). It is called internally on initiating
 *   Highcharts and after running `Highcharts.setOptions`.
 *
 * @private
 */
function setTimeMethods() {
	var globalOptions = H.defaultOptions.global,
		Date,
		useUTC = globalOptions.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	H.Date = Date = globalOptions.Date || win.Date; // Allow using a different Date class
	Date.hcTimezoneOffset = useUTC && globalOptions.timezoneOffset;
	Date.hcGetTimezoneOffset = getTimezoneOffsetOption();
	Date.hcMakeTime = function (year, month, date, hours, minutes, seconds) {
		var d;
		if (useUTC) {
			d = Date.UTC.apply(0, arguments);
			d += getTZOffset(d);
		} else {
			d = new Date(
				year,
				month,
				pick(date, 1),
				pick(hours, 0),
				pick(minutes, 0),
				pick(seconds, 0)
			).getTime();
		}
		return d;
	};
	each(['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcGet' + s] = GET + s;
	});
	each(['Milliseconds', 'Seconds', 'Minutes', 'Hours', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcSet' + s] = SET + s;
	});
}

/**
 * Merge the default options with custom options and return the new options
 * structure. Commonly used for defining reusable templates.
 *
 * @function #setOptions
 * @memberOf  Highcharts
 * @sample highcharts/global/useutc-false Setting a global option
 * @sample highcharts/members/setoptions Applying a global theme
 * @param {Object} options The new custom chart options.
 * @returns {Object} Updated options.
 */
H.setOptions = function (options) {
	
	// Copy in the default options
	H.defaultOptions = merge(true, H.defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return H.defaultOptions;
};

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions for outside modules
 * wasn't enough because the setOptions method created a new object.
 */
H.getOptions = function () {
	return H.defaultOptions;
};


// Series defaults
H.defaultPlotOptions = H.defaultOptions.plotOptions;

// set the default time methods
setTimeMethods();
