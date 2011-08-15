/* ****************************************************************************
 * Start data grouping module												 *
 ******************************************************************************/
var DATA_GROUPING = 'dataGrouping',
	seriesProto = Series.prototype,
	baseProcessData = seriesProto.processData,
	baseGeneratePoints = seriesProto.generatePoints,
	baseDestroy = seriesProto.destroy;

/**
 * Extend the basic processData method, that crops the data to the current zoom
 * range, with data grouping logic.
 */
seriesProto.processData = function () {
	var series = this,
		options = series.options,
		dataGroupingOptions = options[DATA_GROUPING];

	baseProcessData.apply(this);

	// disabled?
	if (!dataGroupingOptions || dataGroupingOptions.enabled === false) {
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
		//groupPixelWidth = pick(xAxis.groupPixelWidth, dataGroupingOptions.groupPixelWidth),
		groupPixelWidth = dataGroupingOptions.groupPixelWidth,
		maxPoints = plotSizeX / groupPixelWidth,
		approximation = dataGroupingOptions.approximation,
		summarize = approximation === 'average' || approximation === 'sum',
		dataLength = processedXData.length,
		ohlcData = series.valueCount === 4,
		groupedData = series.groupedData,
		chartSeries = chart.series,
		groupedXData = [],
		groupedYData = [];

	// attempt to solve #334: if multiple series are compared on the same x axis, give them the same
	// group pixel width 
	/*if (!xAxis.groupPixelWidth) {
		i = chartSeries.length;
		while (i--) {
			if (chartSeries[i].xAxis == xAxis) {
			groupPixelWidth = mathMax(groupPixelWidth, chartSeries[i].options.dataGrouping.groupPixelWidth);
		}
	}
	xAxis.groupPixelWidth = groupPixelWidth;    
	}*/

	// clear previous groups
	each(groupedData || [], function (point, i) {
		if (point) {
			// TODO: find out why this is looping over all points in the Navigator when changing range
			groupedData[i] = point.destroy();
		}
	});

	series.hasGroupedData = false;
	if (dataLength > maxPoints) {
		series.hasGroupedData = true;

		series.points = null; // force recreation of point instances in series.translate

		var xMin = processedXData[0],
			xMax = processedXData[dataLength - 1],
			interval = groupPixelWidth * (xMax - xMin) / plotSizeX,
			groupPositions = getTimeTicks(interval, xMin, xMax, null, dataGroupingOptions.units),
			pointX,
			pointY,
			value = UNDEFINED,
			open = null,
			high = null,
			low = null,
			close = null,
			count = 0;

		for (i = 0; i < dataLength; i++) {

			// when a new group is entered, summarize and initiate the previous group
			while (groupPositions[1] !== UNDEFINED && processedXData[i] >= groupPositions[1]) {

				if (approximation === 'average' && value !== UNDEFINED && value !== null) {
					value /= count;
				}

				pointX = groupPositions.shift();
				if (value !== UNDEFINED || ohlcData) {
					groupedXData.push(pointX); // todo: just use groupPositions as xData?

					if (ohlcData) {
						groupedYData.push([open, high, low, close]);
						open = high = low = close = null;
					} else {
						groupedYData.push(value);
					}
				}

				value = UNDEFINED;
				count = 0;
			}

			// increase the counters
			pointY = processedYData[i];
			if (summarize && !ohlcData) { // approximation = 'sum' or 'average', the most frequent
				value = value === UNDEFINED || value === null ? pointY : value + pointY;
			} else if (ohlcData) {
				var index = series.cropStart + i,
					point = (data && data[index]) || series.pointClass.prototype.applyOptions.apply({}, [dataOptions[index]]);
				if (open === null) { // first point
					open = point.open;
				}
				high = high === null ? point.high : mathMax(high, point.high);
				low = low === null ? point.low : mathMin(low, point.low);
				close = point.close; // last point
			} else if (approximation === 'open' && value === UNDEFINED) {
				value = pointY;
			} else if (approximation === 'high') {
				value = value === UNDEFINED ? pointY : mathMax(value, pointY);
			} else if (approximation === 'low') {
				value = value === UNDEFINED ? pointY : mathMin(value, pointY);
			} else if (approximation === 'close') { // last point
				value = pointY;
			}

			count++;
		}

		// prevent the smoothed data to spill out left and right, and make
		// sure data is not shifted to the left
		if (dataGroupingOptions.smoothed) {
			i = groupedXData.length - 1;
			groupedXData[i] = xMax;
			while (i-- && i) {
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
var dateTimeLabelFormats = {
	second: '%A, %b %e, %H:%M:%S',
	minute: '%A, %b %e, %H:%M',
	hour: '%A, %b %e, %H:%M',
	day: '%A, %b %e, %Y',
	week: 'Week from %A, %b %e, %Y',
	month: '%B %Y',
	year: '%Y'
};

// line types
defaultPlotOptions.line[DATA_GROUPING] =
	defaultPlotOptions.spline[DATA_GROUPING] =
	defaultPlotOptions.area[DATA_GROUPING] =
	defaultPlotOptions.areaspline[DATA_GROUPING] = {
		approximation: 'average', // average, open, high, low, close, sum
		groupPixelWidth: 2,
		dateTimeLabelFormats: dateTimeLabelFormats, // todo: move to tooltip options?
		// smoothed = false, // enable this for navigator series only
		units: [[
			'millisecond',					// unit name
			[1, 2, 5, 10, 20, 25, 50, 100, 200, 500]
		], [
			'second',						// unit name
			[1, 2, 5, 10, 15, 30]			// allowed multiples
		], [
			'minute',						// unit name
			[1, 2, 5, 10, 15, 30]			// allowed multiples
		], [
			'hour',							// unit name
			[1, 2, 3, 4, 6, 8, 12]			// allowed multiples
		], [
			'day',							// unit name
			[1]								// allowed multiples
		], [
			'week',							// unit name
			[1]								// allowed multiples
		], [
			'month',
			[1, 3, 6]
		], [
			'year',
			null
		]]
};
// bar-like types (OHLC and candleticks inherit this as the classes are not yet built)
defaultPlotOptions.column[DATA_GROUPING] = {
		approximation: 'sum',
		groupPixelWidth: 10,
		dateTimeLabelFormats: dateTimeLabelFormats
};
/* ****************************************************************************
 * End data grouping module												   *
 ******************************************************************************/