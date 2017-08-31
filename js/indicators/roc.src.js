/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';

	// Utils:
	function populateAverage(xVal, yVal, i, period) {
		// (Closing Price [today] - Closing Price [n days ago]) / Closing Price [n days ago] * 100
		var nDaysAgoY = yVal[i - period][3],
			rocY = (yVal[i][3] - nDaysAgoY) / nDaysAgoY * 100,
			rocX = xVal[i];
			
		return [rocX, rocY];
	}

	H.seriesType('roc', 'sma', {
		name: 'Rate of Change (9)',
		params: {
			period: 9
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				ROC = [],
				xData = [],
				yData = [],
				i,
				ROCPoint;
			
			if (xVal.length <= period && yValLen && yVal[0].length !== 4) {
				return false;
			}
			
			// i = period <-- skip first N-points
			// Calculate value one-by-one for each period in visible data
			for (i = period; i < yValLen; i++) {
				ROCPoint = populateAverage(xVal, yVal, i, period);
				ROC.push(ROCPoint);
				xData.push(ROCPoint[0]);
				yData.push(ROCPoint[1]);
			}
			
			return {
				values: ROC,
				xData: xData,
				yData: yData
			};
		}
	});
}));
