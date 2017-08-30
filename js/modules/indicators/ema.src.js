/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';

	var isArray = H.isArray;

	// Utils:
	function accumulateAverage(points, xVal, yVal, i, index) {
		var xValue = xVal[i],
			yValue = index < 0 ? yVal[i] : yVal[i][index];
			
		points.push([xValue, yValue]);
	}

	function populateAverage(points, xVal, yVal, i, EMApercent, calEMA, index) {
		var x = xVal[i - 1],
			yValuePrev = index < 0 ? yVal[i - 2] : yVal[i - 2][index],
			yValue = index < 0 ? yVal[i - 1] : yVal[i - 1][index],
			prevPoint, y;

		prevPoint = calEMA === 0 ? yValuePrev : calEMA;
		y = ((yValue * EMApercent) + (prevPoint * (1 - EMApercent)));

		return [x, y];
	}

	H.seriesType('ema', 'sma', {
		name: 'EMA (14)',
		params: {
			period: 14,
			index: 0
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				EMApercent = (2 / (period + 1)),
				calEMA = 0,
				range = 1,
				xValue = xVal[0],
				yValue = yVal[0],
				EMA = [],
				xData = [],
				yData = [],
				index = -1,
				i, points,
				EMAPoint;

			// Check period, if bigger than points length, skip
			if (xVal.length <= period) {
				return false;
			}

			// Switch index for OHLC / Candlestick / Arearange
			if (isArray(yVal[0])) {
				index = params.index ? params.index : 0;
				yValue = yVal[0][index];
			}

			// Starting point
			points = [[xValue, yValue]];

			// Accumulate first N-points
			while (range !== period) {
				accumulateAverage(points, xVal, yVal, range, index);
				range++;
			}

			// Calculate value one-by-one for each period in visible data
			for (i = range; i < yValLen; i++) {
				EMAPoint = populateAverage(points, xVal, yVal, i, EMApercent, calEMA, index);
				EMA.push(EMAPoint);
				xData.push(EMAPoint[0]);
				yData.push(EMAPoint[1]);
				calEMA = EMAPoint[1];

				accumulateAverage(points, xVal, yVal, i, index);
			}

			EMAPoint = populateAverage(points, xVal, yVal, i, EMApercent, calEMA, index);
			EMA.push(EMAPoint);
			xData.push(EMAPoint[0]);
			yData.push(EMAPoint[1]);

			return {
				values: EMA,
				xData: xData,
				yData: yData
			};
		}
	});
}));
