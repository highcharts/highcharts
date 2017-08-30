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
	function populateAverage(xVal, yVal, yValVolume, i) {
		var high = yVal[i][1],
			low = yVal[i][2],
			close = yVal[i][3],
			volume = yValVolume[i],
			adY = close === high && close === low || high === low ? 0 : ((2 * close - low - high) / (high - low)) * volume,
			adX = xVal[i];
			
		return [adX, adY];
	}
	
	H.seriesType('ad', 'sma', {
		name: 'Accumulation/Distribution',
		params: {
			volumeSeriesID: 'Volume'
		}
	}, {
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				volumeSeriesID = params.volumeSeriesID,
				volumeSeries = series.chart.get(volumeSeriesID),
				yValVolume = volumeSeries && volumeSeries.yData,
				yValLen = yVal ? yVal.length : 0,
				AD = [],
				xData = [],
				yData = [],
				len, i, ADPoint;

			if (xVal.length <= period && yValLen && yVal[0].length !== 4) {
				return false;
			}

			if (!volumeSeries) {
				return H.error(
					'Series ' +
					volumeSeriesID +
					' not found! Check `volumeSeriesID`.',
					true
				);
			}
		
			// i = period <-- skip first N-points
			// Calculate value one-by-one for each period in visible data
			for (i = period; i < yValLen; i++) {
				
				len = AD.length;
				ADPoint = populateAverage(xVal, yVal, yValVolume, i, period);
				
				if (len > 0) {
					ADPoint[1] += AD[len - 1][1];
					ADPoint[1] = ADPoint[1];
				}
				
				AD.push(ADPoint);
				
				xData.push(ADPoint[0]);
				yData.push(ADPoint[1]);
			}

			return {
				values: AD,
				xData: xData,
				yData: yData
			};
		}
	});
}));
