/* ****************************************************************************
 * Start data grouping module												 *
 ******************************************************************************/
var DATA_GROUPING = 'dataGrouping',
	seriesProto = Series.prototype,
	baseProcessData = seriesProto.processData,
	baseGeneratePoints = seriesProto.generatePoints,
	baseDestroy = seriesProto.destroy,
	NUMBER = 'number',
	
	/**
	 * Define the available approximation types. The data grouping approximations takes an array
	 * or numbers as the first parameter. In case of ohlc, four arrays are sent in as four parameters.
	 * Each array consists only of numbers. In case null values belong to the group, the property
	 * .hasNulls will be set to true on the array.
	 */
	approximations = {
		sum: function (arr) {
			var len = arr.length, 
				ret;
				
			// 1. it consists of nulls exclusively
			if (!len && arr.hasNulls) {
				ret = null;
			// 2. it has a length and real values
			} else if (len) {
				ret = 0;
				while (len--) {
					ret += arr[len];
				}
			}
			// 3. it has zero length, so just return undefined 
			// => doNothing()
			
			return ret;
		},
		average: function (arr) {
			var len = arr.length,
				ret = approximations.sum(arr);
				
			// If we have a number, return it divided by the length. If not, return
			// null or undefined based on what the sum method finds.
			if (typeof ret === NUMBER && len) {
				ret = ret / len;
			}
			
			return ret;
		},
		open: function (arr) {
			return arr.length ? arr[0] : (arr.hasNulls ? null : UNDEFINED);
		},
		high: function (arr) {
			return arr.length ? mathMax.apply(0, arr) : (arr.hasNulls ? null : UNDEFINED);
		},
		low: function (arr) {
			return arr.length ? mathMin.apply(0, arr) : (arr.hasNulls ? null : UNDEFINED);
		},
		close: function (arr) {
			return arr.length ? arr[arr.length - 1] : (arr.hasNulls ? null : UNDEFINED);
		},
		// ohlc is a special case where a multidimensional array is input and an array is output
		ohlc: function (opens, highs, lows, closes) {
			return [
				approximations.open(opens),
				approximations.high(highs),
				approximations.low(lows),
				approximations.close(closes)
			];
		}
	};

/**
 * Extend the basic processData method, that crops the data to the current zoom
 * range, with data grouping logic.
 */
seriesProto.processData = function () {
	var series = this,
		options = series.options,
		dataGroupingOptions = options[DATA_GROUPING],
		groupingEnabled = dataGroupingOptions && dataGroupingOptions.enabled;

	// run base method
	series.forceCrop = groupingEnabled; // #334
	baseProcessData.apply(series);

	// disabled?
	if (!groupingEnabled) {
		return;
	}

	var i,
		chart = series.chart,
		processedXData = series.processedXData,
		processedYData = series.processedYData,
		data = series.data,
		dataOptions = options.data,
		plotSizeX = chart.plotSizeX,
		xAxis = series.xAxis,
		groupPixelWidth = pick(xAxis.groupPixelWidth, dataGroupingOptions.groupPixelWidth),
		maxPoints = plotSizeX / groupPixelWidth,
		approximation = dataGroupingOptions.approximation,
		dataLength = processedXData.length,
		groupedData = series.groupedData,
		chartSeries = chart.series,
		groupedXData = [],
		groupedYData = [];

	// attempt to solve #334: if multiple series are compared on the same x axis, give them the same
	// group pixel width
	if (!xAxis.groupPixelWidth) {
		i = chartSeries.length;
		while (i--) {
			if (chartSeries[i].xAxis === xAxis) {
				groupPixelWidth = mathMax(groupPixelWidth, chartSeries[i].options.dataGrouping.groupPixelWidth);
			}
		}
		xAxis.groupPixelWidth = groupPixelWidth;
	}

	// clear previous groups
	each(groupedData || [], function (point, i) {
		if (point) {
			// TODO: find out why this is looping over all points in the Navigator when changing range
			groupedData[i] = point.destroy ? point.destroy() : null;
		}
	});

	
	if (dataLength > maxPoints) {
		series.hasGroupedData = true;

		series.points = null; // force recreation of point instances in series.translate

		var xMin = processedXData[0],
			xMax = processedXData[dataLength - 1],
			interval = groupPixelWidth * (xMax - xMin) / plotSizeX,
			groupPositions = getTimeTicks(interval, xMin, xMax, null, dataGroupingOptions.units),
			pointX,
			pointY,
			groupedY,
			values1 = [],
			values2 = [],
			values3 = [],
			values4 = [];

		for (i = 0; i < dataLength; i++) {

			// when a new group is entered, summarize and initiate the previous group
			while (groupPositions[1] !== UNDEFINED && processedXData[i] >= groupPositions[1]) {

				pointX = groupPositions.shift();
				
				groupedY = typeof approximation === 'function' ?
						approximation(values1, values2, values3, values4) : // custom approximation callback function
						approximations[approximation](values1, values2, values3, values4); // predefined approximation
						
				if (groupedY !== UNDEFINED) {
					groupedXData.push(pointX);
					groupedYData.push(groupedY);
				}
				
				values1 = [];
				values2 = [];
				values3 = [];
				values4 = [];
			}
			
			// for each raw data point, push it to an array that contains all values for this specific group
			pointY = processedYData[i];
			if (approximation === 'ohlc') {
				var index = series.cropStart + i,
					point = (data && data[index]) || series.pointClass.prototype.applyOptions.apply({}, [dataOptions[index]]),
					open = point.open,
					high = point.high,
					low = point.low,
					close = point.close;
				
				if (typeof open === NUMBER) {
					values1.push(open);
				} else if (open === null) {
					values1.hasNulls = true;
				}
				
				if (typeof high === NUMBER) {
					values2.push(high);
				} else if (high === null) {
					values2.hasNulls = true;
				}
				
				if (typeof low === NUMBER) {
					values3.push(low);
				} else if (low === null) {
					values3.hasNulls = true;
				}
				
				if (typeof close === NUMBER) {
					values4.push(close);
				} else if (close === null) {
					values4.hasNulls = true;
				}
			} else {
				if (typeof pointY === NUMBER) {
					values1.push(pointY);
				} else if (pointY === null) {
					values1.hasNulls = true;
				}
			}

		}

		// prevent the smoothed data to spill out left and right, and make
		// sure data is not shifted to the left
		if (dataGroupingOptions.smoothed) {
			i = groupedXData.length - 1;
			groupedXData[i] = xMax;
			while (i-- && i > 0) {
				groupedXData[i] += interval / 2;
			}
			groupedXData[0] = xMin;
		}

		series.tooltipHeaderFormat = dataGroupingOptions.dateTimeLabelFormats[groupPositions.unit[0]];
		series.unit = groupPositions.unit;

	} else {
		groupedXData = processedXData;
		groupedYData = processedYData;
		series.tooltipHeaderFormat = null;
		series.unit = null;
	}

	series.processedXData = groupedXData;
	series.processedYData = groupedYData;

};

seriesProto.generatePoints = function () {
	var series = this;

	baseGeneratePoints.apply(series);

	// record grouped data in order to let it be destroyed the next time processData runs
	series.groupedData = series.hasGroupedData ? series.points : null;
};

seriesProto.destroy = function () {
	var series = this,
		groupedData = series.groupedData || [],
		i = groupedData.length;

	while (i--) {
		if (groupedData[i]) {
			groupedData[i].destroy();
		}
	}
	baseDestroy.apply(series);
};


// Extend the plot options
/*jslint white: true*/
var commonOptions = {
	approximation: 'average', // average, open, high, low, close, sum
	groupPixelWidth: 2,
	dateTimeLabelFormats: hash(
		SECOND, '%A, %b %e, %H:%M:%S',
		MINUTE, '%A, %b %e, %H:%M',
		HOUR, '%A, %b %e, %H:%M',
		DAY, '%A, %b %e, %Y',
		WEEK, 'Week from %A, %b %e, %Y',
		MONTH, '%B %Y',
		YEAR, '%Y'
	),

	// smoothed = false, // enable this for navigator series only
	units: [[
		MILLISECOND,          // unit name
		[1, 2, 5, 10, 20, 25, 50, 100, 200, 500]
	], [
		SECOND,              // unit name
		[1, 2, 5, 10, 15, 30]      // allowed multiples
	], [
		MINUTE,              // unit name
		[1, 2, 5, 10, 15, 30]      // allowed multiples
	], [
		HOUR,              // unit name
		[1, 2, 3, 4, 6, 8, 12]      // allowed multiples
	], [
		DAY,              // unit name
		[1]                // allowed multiples
	], [
		WEEK,              // unit name
		[1]                // allowed multiples
	], [
		MONTH,
		[1, 3, 6]
	], [
		YEAR,
		null
	]]
};
/*jslint white: false*/

// line types
defaultPlotOptions.line[DATA_GROUPING] =
	defaultPlotOptions.spline[DATA_GROUPING] =
	defaultPlotOptions.area[DATA_GROUPING] =
	defaultPlotOptions.areaspline[DATA_GROUPING] = commonOptions;

// bar-like types (OHLC and candleticks inherit this as the classes are not yet built)
defaultPlotOptions.column[DATA_GROUPING] = merge(commonOptions, {
		approximation: 'sum',
		groupPixelWidth: 10
});

/* ****************************************************************************
 * End data grouping module												   *
 ******************************************************************************/