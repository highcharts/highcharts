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
	function sumArray(array) {
		return array.reduce(function (prev, cur) {
			return prev + cur;
		});
	}

	function meanDeviation(arr, sma) {
		var len = arr.length,
			sum = 0,
			i;

		for (i = 0; i < len; i++) {
			sum += Math.abs(sma - (arr[i]));
		}

		return sum;
	}

	H.seriesType('cci', 'sma', {
		name: 'CCI (14)',
		params: {
			period: 14
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				TP = [],
				periodTP = [],
				range = 1,
				CCI = [],
				xData = [],
				yData = [],
				CCIPoint, p, len, smaTP, TPtemp, meanDev, i;

			// CCI requires close value
			if (xVal.length <= period || !isArray(yVal[0]) || yVal[0].length !== 4) {
				return false;
			}
			
			// accumulate first N-points
			while (range < period + 1) {
				p = yVal[range - 1];
				TP.push((p[1] + p[2] + p[3]) / 3);
				range++;
			}
			
			for (i = range - 1; i <= yValLen; i++) {
				p = yVal[i - 1];
				TPtemp = (p[1] + p[2] + p[3]) / 3;
				len = TP.push(TPtemp);
				periodTP = TP.slice(len - period);
				smaTP = sumArray(periodTP) / period;

				meanDev = meanDeviation(periodTP, smaTP) / period;
				CCIPoint = ((TPtemp - smaTP) / (0.015 * meanDev));
				CCI.push([xVal[i - 1], CCIPoint]);
				xData.push(xVal[i - 1]);
				yData.push(CCIPoint);
			}

			return {
				values: CCI,
				xData: xData,
				yData: yData
			};
		}
	});
}));
