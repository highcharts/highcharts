'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var each = H.each,
	merge = H.merge,
	isArray = H.isArray,
	SMA = H.seriesTypes.sma;

// Utils:
function getStandardDeviation(arr, mean) {
	var variance = 0,
		arrLen = arr.length,
		std = 0,
		i = 0;

	for (; i < arrLen; i++) {
		variance += (arr[i][3] - mean) * (arr[i][3] - mean);
	}
	variance = variance / (arrLen - 1);

	std = Math.sqrt(variance);
	return std;
}

H.seriesType('bb', 'sma',
	/**
	 * Bollinger bands (BB). This series requires `linkedTo`
	 * option to be set and should be loaded after `stock/indicators/indicators.js` file.
	 *
	 * @extends {plotOptions.sma}
	 * @product highstock
	 * @sample {highstock} stock/indicators/bollinger-bands
	 *                     Bollinger bands
	 * @since 6.0.0
	 * @optionparent plotOptions.bb
	 */
	{
		name: 'BB (20, 2)',
		params: {
			period: 20,
			/**
			 * Standard deviation for top and bottom bands.
			 *
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			standardDeviation: 2,
			index: 3
		},
		/**
		 * Bottom line options.
		 *
		 * @since 6.0.0
		 * @product highstock
		 */
		bottomLine: {
			/**
			 * Styles for a bottom line.
			 *
			 * @since 6.0.0
			 * @product highstock
			 */
			styles: {
				/**
				 * Pixel width of the line.
				 *
				 * @type {Number}
				 * @since 6.0.0
				 * @product highstock
				 */
				lineWidth: 1,
				/**
				 * Color of the line.
				 * If not set, it's inherited from [plotOptions.bb.color](#plotOptions.bb.color).
				 *
				 * @type {String}
				 * @since 6.0.0
				 * @product highstock
				 */
				lineColor: undefined
			}
		},
		/**
		 * Top line options.
		 *
		 * @extends {plotOptions.bb.bottomLine}
		 * @since 6.0.0
		 * @product highstock
		 */
		topLine: {
			styles: {
				lineWidth: 1,
				lineColor: undefined
			}
		},
		tooltip: {
			/**
			 * The HTML of the point's line in the tooltip. Variables are enclosed
			 * by curly brackets. Available variables are point.x, point.y, series.
			 * name and series.color and other properties on the same form. Furthermore,
			 * point.y can be extended by the `tooltip.valuePrefix` and `tooltip.
			 * valueSuffix` variables. This can also be overridden for each series,
			 * which makes it a good hook for displaying units.
			 *
			 * In styled mode, the dot is colored by a class name rather
			 * than the point color.
			 *
			 * @type {String}
			 * @sample {highcharts} highcharts/tooltip/pointformat/ A different point format with value suffix
			 * @sample {highmaps} maps/tooltip/format/ Format demo
			 * @default
			 *	<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>
			 *		Top: {point.top}<br/>
			 *		Middle: {point.middle}<br/>
			 *		Bottom: {point.bottom}<br/>
			 */
			pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
				'<b> {series.name}</b><br/>' +
				'Top: {point.top}<br/>' +
				'Middle: {point.middle}<br/>' +
				'Bottom: {point.bottom}<br/>'
		},
		marker: {
			enabled: false
		},
		dataGrouping: {
			approximation: 'averages'
		}
	}, /** @lends Highcharts.Series.prototype */ {
		pointArrayMap: ['top', 'middle', 'bottom'],
		pointValKey: 'middle',
		init: function () {
			SMA.prototype.init.apply(this, arguments);

			// Set default color for lines:
			this.options = merge({
				topLine: {
					styles: {
						lineColor: this.color
					}
				},
				bottomLine: {
					styles: {
						lineColor: this.color
					}
				}
			}, this.options);
		},
		toYData: function (point) {
			return [point.top, point.middle, point.bottom];
		},
		translate: function () {
			var indicator = this,
				translatedBB = ['plotTop', 'plotMiddle', 'plotBottom'];

			SMA.prototype.translate.apply(indicator, arguments);

			each(indicator.points, function (point) {
				each([point.top, point.middle, point.bottom], function (value, i) {
					if (value !== null) {
						point[translatedBB[i]] = indicator.yAxis.toPixels(value, true);
					}
				});
			});
		},
		drawGraph: function () {
			var indicator = this,
				middleLinePoints = indicator.points,
				pointsLength = middleLinePoints.length,
				middleLineOptions = indicator.options,
				middleLinePath = indicator.graph,
				gappedExtend = {
					options: {
						gapSize: middleLineOptions.gapSize
					}
				},
				deviations = [[], []], // top and bottom point place holders
				point;

			// Generate points for top and bottom lines:
			while (pointsLength--) {
				point = middleLinePoints[pointsLength];
				deviations[0].push({
					plotX: point.plotX,
					plotY: point.plotTop,
					isNull: point.isNull
				});
				deviations[1].push({
					plotX: point.plotX,
					plotY: point.plotBottom,
					isNull: point.isNull
				});
			}

			// Modify options and generate lines:
			each(['topLine', 'bottomLine'], function (lineName, i) {
				indicator.points = deviations[i];
				indicator.options = merge(middleLineOptions[lineName].styles, gappedExtend);
				indicator.graph = indicator['graph' + lineName];
				SMA.prototype.drawGraph.call(indicator);

				// Now save lines:
				indicator['graph' + lineName] = indicator.graph;
			});

			// Restore options and draw a middle line:
			indicator.points = middleLinePoints;
			indicator.options = middleLineOptions;
			indicator.graph = middleLinePath;
			SMA.prototype.drawGraph.call(indicator);
		},
		getValues: function (series, params) {
			var period = params.period,
				standardDeviation = params.standardDeviation,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				BB = [], // 0- date, 1-middle line, 2-top line, 3-bottom line
				ML, TL, BL, // middle line, top line and bottom line
				date,
				xData = [],
				yData = [],
				slicedX,
				slicedY,
				stdDev,
				point,
				i;

			// BB requires close value
			if (xVal.length < period || !isArray(yVal[0]) || yVal[0].length !== 4) {
				return false;
			}

			for (i = period; i <= yValLen; i++) {
				slicedX = xVal.slice(i - period, i);
				slicedY = yVal.slice(i - period, i);

				point = SMA.prototype.getValues.call(this, {
					xData: slicedX,
					yData: slicedY
				}, params);

				date = point.xData[0];
				ML = point.yData[0];
				stdDev = getStandardDeviation(slicedY, ML);
				TL = ML + standardDeviation * stdDev;
				BL = ML - standardDeviation * stdDev;

				BB.push([date, TL, ML, BL]);
				xData.push(date);
				yData.push([TL, ML, BL]);
			}

			return {
				values: BB,
				xData: xData,
				yData: yData
			};
		}
	}
);

/**
 * A bollinger bands indicator. If the [type](#series.bb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * bb](#plotOptions.bb).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.bb
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.bb
 */

/**
 * An array of data points for the series. For the `bb` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.bb.data
 */
