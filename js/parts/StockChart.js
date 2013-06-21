/**
 * A wrapper for Chart with all the default values for a Stock chart
 */
Highcharts.StockChart = function (options, callback) {
	var seriesOptions = options.series, // to increase performance, don't merge the data 
		opposite,
		lineOptions = {

			marker: {
				enabled: false,
				states: {
					hover: {
						radius: 5
					}
				}
			},
			// gapSize: 0,
			states: {
				hover: {
					lineWidth: 2
				}
			}
		},
		columnOptions = {
			shadow: false,
			borderWidth: 0
		};

	// apply X axis options to both single and multi y axes
	options.xAxis = map(splat(options.xAxis || {}), function (xAxisOptions) {
		return merge({ // defaults
				minPadding: 0,
				maxPadding: 0,
				ordinal: true,
				title: {
					text: null
				},
				labels: {
					overflow: 'justify'
				},
				showLastLabel: true
			}, xAxisOptions, // user options 
			{ // forced options
				type: 'datetime',
				categories: null
			});
	});

	// apply Y axis options to both single and multi y axes
	options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
		opposite = yAxisOptions.opposite;
		return merge({ // defaults
			labels: {
				align: opposite ? 'right' : 'left',
				x: opposite ? -2 : 2,
				y: -2
			},
			showLastLabel: false,
			title: {
				text: null
			}
		}, yAxisOptions // user options
		);
	});

	options.series = null;

	options = merge({
		chart: {
			panning: true,
			pinchType: 'x'
		},
		navigator: {
			enabled: true
		},
		scrollbar: {
			enabled: true
		},
		rangeSelector: {
			enabled: true
		},
		title: {
			text: null
		},
		tooltip: {
			shared: true,
			crosshairs: true
		},
		legend: {
			enabled: false
		},

		plotOptions: {
			line: lineOptions,
			spline: lineOptions,
			area: lineOptions,
			areaspline: lineOptions,
			arearange: lineOptions,
			areasplinerange: lineOptions,
			column: columnOptions,
			columnrange: columnOptions,
			candlestick: columnOptions,
			ohlc: columnOptions
		}

	},
	options, // user's options

	{ // forced options
		_stock: true, // internal flag
		chart: {
			inverted: false
		}
	});

	options.series = seriesOptions;


	return new Chart(options, callback);
};

// Implement the pinchType option
wrap(Pointer.prototype, 'init', function (proceed, chart, options) {

	var pinchType = options.chart.pinchType || '';
		
	proceed.call(this, chart, options);

	// Pinch status
	this.pinchX = this.pinchHor = pinchType.indexOf('x') !== -1;
	this.pinchY = this.pinchVert = pinchType.indexOf('y') !== -1;
});


/* ****************************************************************************
 * Start value compare logic                                                  *
 *****************************************************************************/
 
var seriesInit = seriesProto.init, 
	seriesProcessData = seriesProto.processData,
	pointTooltipFormatter = Point.prototype.tooltipFormatter;
	
/**
 * Extend series.init by adding a method to modify the y value used for plotting
 * on the y axis. This method is called both from the axis when finding dataMin
 * and dataMax, and from the series.translate method.
 */
seriesProto.init = function () {
	
	// Call base method
	seriesInit.apply(this, arguments);
	
	// Set comparison mode
	this.setCompare(this.options.compare);
};

/**
 * The setCompare method can be called also from the outside after render time
 */
seriesProto.setCompare = function (compare) {

	// Set or unset the modifyValue method
	this.modifyValue = (compare === 'value' || compare === 'percent') ? function (value, point) {
		var compareValue = this.compareValue;
		
		// get the modified value
		value = compare === 'value' ? 
			value - compareValue : // compare value
			value = 100 * (value / compareValue) - 100; // compare percent
			
		// record for tooltip etc.
		if (point) {
			point.change = value;
		}
		
		return value;
	} : null;

	// Mark dirty
	if (this.chart.hasRendered) {
		this.isDirty = true;
	}

};

/**
 * Extend series.processData by finding the first y value in the plot area,
 * used for comparing the following values 
 */
seriesProto.processData = function () {
	var series = this,
		i = 0,
		processedXData,
		processedYData,
		length;
	
	// call base method
	seriesProcessData.apply(this, arguments);

	if (series.xAxis && series.processedYData) { // not pies
		
		// local variables
		processedXData = series.processedXData;
		processedYData = series.processedYData;
		length = processedYData.length;
		
		// find the first value for comparison
		for (; i < length; i++) {
			if (typeof processedYData[i] === NUMBER && processedXData[i] >= series.xAxis.min) {
				series.compareValue = processedYData[i];
				break;
			}
		}
	}
};

/**
 * Add a utility method, setCompare, to the Y axis
 */
Axis.prototype.setCompare = function (compare, redraw) {
	if (!this.isXAxis) {
		each(this.series, function (series) {
			series.setCompare(compare);
		});
		if (pick(redraw, true)) {
			this.chart.redraw();
		}
	}
};

/**
 * Extend the tooltip formatter by adding support for the point.change variable
 * as well as the changeDecimals option
 */
Point.prototype.tooltipFormatter = function (pointFormat) {
	var point = this;
	
	pointFormat = pointFormat.replace(
		'{point.change}',
		(point.change > 0 ? '+' : '') + numberFormat(point.change, pick(point.series.tooltipOptions.changeDecimals, 2))
	); 
	
	return pointTooltipFormatter.apply(this, [pointFormat]);
};

/* ****************************************************************************
 * End value compare logic                                                    *
 *****************************************************************************/
