/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';
	
	function toFixed(a, n) {
		return parseFloat(a.toFixed(n));
	}
	
	var isArray = H.isArray;
	
	// Utils:
	function sumArray(array) {
		// reduce VS loop => reduce
		return array.reduce(function (prev, cur) {
			return prev + cur;
		});
	}

	H.seriesType('rsi', 'sma', {
		name: 'RSI (14)',
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
				decimals = params.decimals,
				range = 1,
				RSI = [],
				xData = [],
				yData = [],
				index = 3,
				gain = [],
				loss = [],
				RSIPoint, change, RS, avgGain, avgLoss, i;

			// RSI requires close value
			if ((xVal.length <= period) || !isArray(yVal[0]) || yVal[0].length !== 4) {
				return false;
			}

			// Accumulate first N-points
			while (range < period + 1) {
				change = toFixed(yVal[range][index] - yVal[range - 1][index], decimals);
				gain.push(change > 0 ? change : 0);
				loss.push(change < 0 ? Math.abs(change) : 0);
				range++;
			}

			for (i = range - 1; i < yValLen; i++) {
				if (i > range - 1) {
					// Remove first point from array
					gain.shift();
					loss.shift();
					// Calculate new change
					change = toFixed(yVal[i][index] - yVal[i - 1][index], decimals);
					// Add to array
					gain.push(change > 0 ? change : 0);
					loss.push(change < 0 ? Math.abs(change) : 0);
				}

				// calculate averages, RS, RSI values:
				avgGain = toFixed(sumArray(gain) / period, decimals);
				avgLoss = toFixed(sumArray(loss) / period, decimals);

				if (avgLoss === 0) {
					RS = 100;
				} else {
					RS = toFixed(avgGain / avgLoss, decimals);
				}
				RSIPoint = toFixed(100 - (100 / (1 + RS)), decimals);
				RSI.push([xVal[i], RSIPoint]);
				xData.push(xVal[i]);
				yData.push(RSIPoint);
			}

			return {
				values: RSI,
				xData: xData,
				yData: yData
			};
		}
	});
}));
