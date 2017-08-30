/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';
	
	var isArray = H.isArray,
		UNDEFINED;

	// Utils:
	function accumulateAverage(points, xVal, yVal, i) {
		var xValue = xVal[i],
			yValue = yVal[i];
			
		points.push([xValue, yValue]);
	}

	function getTR(currentPoint, prevPoint) {
		var pointY = currentPoint,
			prevY = prevPoint,
			HL = pointY[1] - pointY[2],
			HCp = prevY === UNDEFINED ? 0 : Math.abs(pointY[1] - prevY[3]),
			LCp = prevY === UNDEFINED ? 0 : Math.abs(pointY[2] - prevY[3]),
			TR = Math.max(HL, HCp, LCp);

		return TR;
	}

	function populateAverage(points, xVal, yVal, i, period, prevATR) {
		var x = xVal[i - 1],
			TR = getTR(yVal[i - 1], yVal[i - 2]),
			y;

		y = (((prevATR * (period - 1)) + TR) / period);
		return [x, y];
	}

	H.seriesType('atr', 'sma', {
		name: 'ATR (14)',
		params: {
			period: 14
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
				prevATR = 0,
				TR = 0,
				ATR = [],
				xData = [],
				yData = [],
				point, i, points;

			points = [[xValue, yValue]];
		
			if ((xVal.length <= period) || !isArray(yVal[0]) || yVal[0].length !== 4) {
				return false;
			}

			for (i = 1; i < yValLen; i++) {
			
				accumulateAverage(points, xVal, yVal, i);

				if (period < range) {
					point = populateAverage(points, xVal, yVal, i, period, prevATR);
					prevATR = point[1];
					ATR.push(point);
					xData.push(point[0]);
					yData.push(point[1]);
				} else if (period === range) {
					prevATR = TR / (i - 1);
					ATR.push([xVal[i - 1], prevATR]);
					range++;
				} else {
					TR += getTR(yVal[i - 1], yVal[i - 2]);
					range++;
				}
			}

			point = populateAverage(points, xVal, yVal, i, period, prevATR);
			xData.push(point[0]);
			yData.push(point[1]);
			ATR.push(point);

			return {
				values: ATR,
				xData: xData,
				yData: yData
			};
		}

	});
}));
