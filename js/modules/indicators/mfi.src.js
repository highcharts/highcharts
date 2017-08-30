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
	
	// Utils
	function sumArray(array) {
		// reduce VS loop => reduce
		return array.reduce(function (prev, cur) {
			return prev + cur;
		});
	}

	function calculateTypicalPrice(point) {
		return (point[1] + point[2] + point[3]) / 3;
	}

	function calculateRawMoneyFlow(typicalPrice, volume) {
		return typicalPrice * volume;
	}

	H.seriesType('mfi', 'sma', {
		name: 'Money Flow Index (14)',
		params: {
			period: 14,
			approximation: 'average',
			volumeSeriesID: 'Volume'
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				range = 1,
				volumeSeries = series.chart.get(params.volumeSeriesID),
				yValVolume = volumeSeries && volumeSeries.yData,
				MFI = [],
				isUp = false,
				xData = [],
				yData = [],
				positiveMoneyFlow = [],
				negativeMoneyFlow = [],
				newTypicalPrice,
				oldTypicalPrice,
				rawMoneyFlow,
				negativeMoneyFlowSum,
				positiveMoneyFlowSum,
				moneyFlowRatio,
				MFIPoint, i;

			if (!volumeSeries) {
				return H.error(
					'Series ' +
					params.volumeSeriesID +
					' not found! Check `volumeSeriesID`.',
					true
				);
			}

			// atr requires high low and close values
			if ((xVal.length <= period) || !isArray(yVal[0]) || yVal[0].length !== 4 || !yValVolume) {
				return false;
			}
			// calculate first typical price
			newTypicalPrice = calculateTypicalPrice(yVal[range]);
			// accumulate first N-points
			while (range < period + 1) {
				// calculate if up or down
				oldTypicalPrice = newTypicalPrice;
				newTypicalPrice = calculateTypicalPrice(yVal[range]);
				isUp = newTypicalPrice > oldTypicalPrice ? true : false;
				// calculate raw money flow
				rawMoneyFlow = calculateRawMoneyFlow(newTypicalPrice, yValVolume[range]);
				// add to array
				positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
				negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
				range++;
			}

			for (i = range - 1; i < yValLen; i++) {
				if (i > range - 1) {
					// remove first point from array
					positiveMoneyFlow.shift();
					negativeMoneyFlow.shift();
					// calculate if up or down
					oldTypicalPrice = newTypicalPrice;
					newTypicalPrice = calculateTypicalPrice(yVal[i]);
					isUp = newTypicalPrice > oldTypicalPrice ? true : false;
					// calculate raw money flow
					rawMoneyFlow = calculateRawMoneyFlow(newTypicalPrice, yValVolume[i]);
					// add to array
					positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
					negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
				}

				// calculate sum of negative and positive money flow:
				negativeMoneyFlowSum = sumArray(negativeMoneyFlow);
				positiveMoneyFlowSum = sumArray(positiveMoneyFlow);

				moneyFlowRatio = positiveMoneyFlowSum / negativeMoneyFlowSum;
				MFIPoint = 100 - (100 / (1 + moneyFlowRatio));
				MFI.push([xVal[i], MFIPoint]);
				xData.push(xVal[i]);
				yData.push(MFIPoint);
			}

			return {
				values: MFI,
				xData: xData,
				yData: yData
			};
		}
	});
}));
