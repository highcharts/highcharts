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
	
	function weightedSumArray(array, pLen) {
		// The denominator is the sum of the number of days as a triangular number. If there are 5 days, the triangular numbers are 5, 4, 3, 2, and 1. The sum is 5+4+3+2+1=15.
		var denominator = (pLen + 1) / 2 * pLen; // the reduced sum of an arithmetic sequence
		
		// reduce VS loop => reduce
		return array.reduce(function (prev, cur, i) {
			return [null, prev[1] + cur[1] * (i + 1)];
		})[1] / denominator;
	}

	function populateAverage(points, xVal, yVal, i) {
		var pLen = points.length,
			wmaY = weightedSumArray(points, pLen),
			wmaX = xVal[i - 1];
		
		points.shift(); // remove point until range < period
		
		return [wmaX, wmaY];
	}

	H.seriesType('wma', 'sma', {
		name: 'WMA (9)',
		params: {
			period: 9,
			index: 3
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				range = 1,
				xValue = xVal[0],
				yValue = yVal[0],
				WMA = [],
				xData = [],
				yData = [],
				index = -1,
				i, points, WMAPoint;
			
			if (xVal.length <= period) {
				return false;
			}
			
			// Switch index for OHLC / Candlestick
			if (isArray(yVal[0])) {
				index = params.index ? params.index : 3;
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
				WMAPoint = populateAverage(points, xVal, yVal, i);
				WMA.push(WMAPoint);
				xData.push(WMAPoint[0]);
				yData.push(WMAPoint[1]);
				
				accumulateAverage(points, xVal, yVal, i, index);
			}
			
			WMAPoint = populateAverage(points, xVal, yVal, i);
			WMA.push(WMAPoint);
			xData.push(WMAPoint[0]);
			yData.push(WMAPoint[1]);
			
			return {
				values: WMA,
				xData: xData,
				yData: yData
			};
		}
	});
}));
