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

	H.seriesType('vwap', 'sma', {
		name: 'VWAP (15)',
		params: {
			period: 15,
			volumeSeriesID: 'Volume'
		}
	}, {
		/**
		* Returns the final values of the indicator ready to be presented on a chart
		* @returns {Object} Object containing computed VWAP
		**/
		getValues: function (series, params) {
			var xValues = series.xData,
				yValues = series.yData,
				chart = series.chart,
				period = params.period,
				isOHLC = true,
				volumeSeries;

			//	Checks if Volume series exists and if period is a lower value than a number of points in main series
			if (!(volumeSeries = chart.get(params.volumeSeriesID))) {
				return H.error(
					'Series ' +
					params.volumeSeriesID +
					' not found! Check `volumeSeriesID`.',
					true
				);
			}

			if (period > xValues.length) {
				return false;
			}

			//	Checks if series data fits the OHLC format
			if (!(isArray(yValues[0]))) {
				isOHLC = false;
			}

			return this.calculateVWAPValues(isOHLC, xValues, yValues, volumeSeries, period);
		},
		/**
		* Main algorithm used to calculate Volume Weighted Average Price (VWAP) values
 		* @param {Boolean} isOHLC 		- Says if data has a format of an OHLC
 		* @param {Array} xValues 		- Array of timestamps
 		* @param {Array} yValues 		- Array of yValues, can be an array of a four arrays (OHLC) or array of values (line)
 		* @param {Array} volumeSeries 	- Volume series
 		* @param {Number} period 		- Number of points to be calculated
 		* @returns {Object} Object containing computed VWAP
 		**/
		calculateVWAPValues: function (isOHLC, xValues, yValues, volumeSeries, period) {
			var yValuesVolume,
				typicalPrice,
				cumulativePrice = [],
				cPrice = 0,
				cumulativeVolume = [],
				cVolume = 0,
				VWAP = [],
				i = 0,
				j = 0,
				xData = [],
				yData = [];

			yValuesVolume = volumeSeries.yData;

			while (i < xValues.length) {
				// Depending on whether series is OHLC or line type, price is average of the high, low and close or a simple value
				typicalPrice = isOHLC ? ((yValues[i][1] + yValues[i][2] + yValues[i][3]) / 3) : yValues[i];
				VWAP.push([xValues[i], typicalPrice]);
				xData.push(VWAP[i][0]);
				yData.push(VWAP[i][1]);

				cumulativePrice.push(yValuesVolume[i] * typicalPrice);
				cumulativeVolume.push(yValuesVolume[i]);
				
				i++;
				j = 1;

				for (; (j < period && i < xValues.length); j++, i++) {
					// Depending on whether series is OHLC or line type, price is average of the high, low and close or a simple value
					typicalPrice = isOHLC ? ((yValues[i][1] + yValues[i][2] + yValues[i][3]) / 3) : yValues[i];
					typicalPrice *= yValuesVolume[i];
					cPrice = cumulativePrice[i - 1] + typicalPrice;
					cVolume = cumulativeVolume[i - 1] + yValuesVolume[i];

					cumulativePrice.push(cPrice);
					cumulativeVolume.push(cVolume);

					VWAP.push([xValues[i], (cPrice / cVolume)]);
					xData.push(VWAP[i][0]);
					yData.push(VWAP[i][1]);
				}
			}

			return {
				values: VWAP,
				xData: xData,
				yData: yData
			};
		}
	});
}));
