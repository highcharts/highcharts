(function (H) {
	var each = H.each,
		getTZOffset = H.getTZOffset,
		isTouchDevice = H.isTouchDevice,
		merge = H.merge,
		pick = H.pick,
		svg = H.svg;
		
/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
H.defaultOptions = {
	/*= if (build.classic) { =*/
	colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', 
		'#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
	/*= } =*/
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'],
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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
		canvasToolsURL: 'http://code.highcharts.com@product.cdnpath@/@product.version@/modules/canvas-tools.js',
		VMLRadialGradientURL: 'http://code.highcharts.com@product.cdnpath@/@product.version@/gfx/vml-radial-gradient.png'
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
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 0,
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		spacing: [10, 10, 15, 10],
		//spacingTop: 10,
		//spacingRight: 10,
		//spacingBottom: 15,
		//spacingLeft: 10,
		//style: {
		//	fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
		//	fontSize: '12px'
		//},
		backgroundColor: '#FFFFFF',
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0',
		//plotBorderWidth: 0,
		//plotShadow: false,
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
		}
	},
	title: {
		text: 'Chart title',
		align: 'center',
		// floating: false,
		margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		/*= if (build.classic) { =*/
		style: {
			color: '#333333',
			fontSize: '18px'
		}
		/*= } =*/

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		/*= if (build.classic) { =*/
		style: {
			color: '#555555'
		}
		/*= } =*/
	},

	plotOptions: {
		line: { // base series options
			/*= if (build.classic) { =*/
			//cursor: 'default',
			//dashStyle: null,
			//linecap: 'round',
			lineWidth: 2,
			//shadow: false,
			/*= } =*/
			allowPointSelect: false,
			showCheckbox: false,
			animation: {
				duration: 1000
			},
			//clip: true,
			//connectNulls: false,
			//enableMouseTracking: true,
			events: {},
			//legendIndex: 0,
			// stacking: null,
			marker: {
				/*= if (build.classic) { =*/
				lineWidth: 0,
				lineColor: '#FFFFFF',
				//fillColor: null,
				/*= } =*/				
				//enabled: true,
				//symbol: null,
				radius: 4,
				states: { // states for a single point
					hover: {
						enabled: true,
						radiusPlus: 2,
						/*= if (build.classic) { =*/
						lineWidthPlus: 1
						/*= } =*/
					},
					/*= if (build.classic) { =*/
					select: {
						fillColor: '#FFFFFF',
						lineColor: '#000000',
						lineWidth: 2
					}
					/*= } =*/
				}
			},
			point: {
				events: {}
			},
			dataLabels: {
				align: 'center',
				// defer: true,
				// enabled: false,
				formatter: function () {
					return this.y === null ? '' : H.numberFormat(this.y, -1);
				},
				/*= if (!build.classic) { =*/
				style: {
					color: 'contrast',
					textShadow: '0 0 6px contrast, 0 0 3px contrast'
				},
				/*= } else { =*/
				style: {
					fontSize: '11px',
					fontWeight: 'bold',
					color: 'contrast',
					textShadow: '0 0 6px contrast, 0 0 3px contrast'
				},
				// backgroundColor: undefined,
				// borderColor: undefined,
				// borderWidth: undefined,
				/*= } =*/
				verticalAlign: 'bottom', // above singular point
				x: 0,
				y: 0,
				// borderRadius: undefined,
				padding: 5
				// shadow: false
			},
			cropThreshold: 300, // draw points outside the plot area when the number of points is less than this
			pointRange: 0,
			//pointStart: 0,
			//pointInterval: 1,
			//showInLegend: null, // auto: true for standalone series, false for linked series
			softThreshold: true,
			states: { // states for the entire series
				hover: {
					//enabled: false,
					lineWidthPlus: 1,
					marker: {
						// lineWidth: base + 1,
						// radius: base + 1
					},
					halo: {
						size: 10,
						/*= if (build.classic) { =*/
						opacity: 0.25
						/*= } =*/
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: true,
			//tooltip: {
				//pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b>'
				//valueDecimals: null,
				//xDateFormat: '%A, %b %e, %Y',
				//valuePrefix: '',
				//ySuffix: ''
			//}
			turboThreshold: 1000
			// zIndex: null
		}
	},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: 'absolute',
			color: '#3E576F'
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
		borderColor: '#909090',
		borderRadius: 0,
		navigation: {
			/*= if (build.classic) { =*/
			activeColor: '#274b6d',
			inactiveColor: '#CCC'
			/*= } =*/
			// animation: true,
			// arrowSize: 12
			// style: {} // text styles
		},
		// margin: 20,
		// reversed: false,
		shadow: false,
		// backgroundColor: null,
		/*style: {
			padding: '5px'
		},*/
		/*= if (build.classic) { =*/
		itemStyle: {			
			color: '#333333',
			fontSize: '12px',
			fontWeight: 'bold'
		},
		itemHoverStyle: {
			//cursor: 'pointer', removed as of #601
			color: '#000'
		},
		itemHiddenStyle: {
			color: '#CCC'
		},
		/*= } =*/
		itemCheckboxStyle: {
			position: 'absolute',
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
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
			backgroundColor: 'white',
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
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
		padding: 8, // docs
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
		//shape: 'callout',
		//shared: false,
		snap: isTouchDevice ? 25 : 10,
		/*= if (build.classic) { =*/
		backgroundColor: 'rgba(249, 249, 249, .85)',
		borderWidth: 1,
		shadow: true,
		style: {
			color: '#333333',
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
			color: '#909090',
			fontSize: '9px'
		},
		/*= } =*/
		text: 'Highcharts.com'
	}
};



/**
 * Set the time methods globally based on the useUTC option. Time method can be either
 * local time or UTC (default).
 */
function setTimeMethods() {
	var globalOptions = H.defaultOptions.global,
		Date,
		useUTC = globalOptions.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	H.Date = Date = globalOptions.Date || window.Date; // Allow using a different Date class
	Date.hcTimezoneOffset = useUTC && globalOptions.timezoneOffset;
	Date.hcGetTimezoneOffset = useUTC && globalOptions.getTimezoneOffset;
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
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
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
H.defaultSeriesOptions = H.defaultPlotOptions.line;

// set the default time methods
setTimeMethods();

	return H;
}(Highcharts));
