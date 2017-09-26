'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var seriesType = H.seriesType;

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
	
/**
 * The AD series type.
 *
 * @constructor seriesTypes.ad
 * @augments seriesTypes.sma
 */
seriesType('ad', 'sma',
	/**
	 * Accumulation Distribution (AD). This series requires `linkedTo` option to be set.
	 * 
	 * @extends {plotOptions.sma}
	 * @product highstock
	 * @sample {highstock} stock/indicators/ad Exponential moving average indicator
	 * @since 6.0.0
	 * @optionparent plotOptions.ad
	 */
	{
		name: 'Accumulation/Distribution',
		params: {
			/**
			 * The id of volume series which is mandatory.
			 * For example using OHLC data, volumeSeriesID='volume' means the indicator will be calculated using OHLC and volume values.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			volumeSeriesID: 'volume'
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

/**
 * A `AD` series. If the [type](#series.ad.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to 
 * [plotOptions.ad](#plotOptions.ad).
 * 
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.ad
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.ad
 */

/**
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.ad.data
 */
