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
	function populateAverage(points, xVal, yVal, i, period) {
		var mmY = yVal[i - 1][3] - yVal[i - period][3],
			mmX = xVal[i - 1];
			
		points.shift(); // remove point until range < period

		return [mmX, mmY];
	}

	H.seriesType('momentum', 'sma', {
		name: 'Momentum (14)',
		params: {
			period: 14,
			decimals: 4
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				xValue = xVal[0],
				yValue = yVal[0],
				range = 1,
				MM = [],
				xData = [],
				yData = [],
				index,
				i,
				points,
				MMPoint;

			if (xVal.length <= period) {
				return false;
			}

			// Switch index for OHLC / Candlestick / Arearange
			if (isArray(yVal[0])) {
				yValue = yVal[0][3];
			} else {
				return false;
			}
			// Starting point
			points = [
				[xValue, yValue]
			];

			// Accumulate first N-points
			while (range !== period) {
				range++;
			}

			// Calculate value one-by-one for each perdio in visible data
			for (i = range; i < yValLen; i++) {
				MMPoint = populateAverage(points, xVal, yVal, i, period, index);
				MM.push(MMPoint);
				xData.push(MMPoint[0]);
				yData.push(MMPoint[1]);
			}
				
			MMPoint = populateAverage(points, xVal, yVal, i, period, index);
			MM.push(MMPoint);
			xData.push(MMPoint[0]);
			yData.push(MMPoint[1]);

			return {
				values: MM,
				xData: xData,
				yData: yData
			};
		}
	});
}));
