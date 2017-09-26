'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import './ema.src.js';

var seriesType = H.seriesType,
	each = H.each,
	noop = H.noop,
	merge = H.merge,
	defined = H.defined,
	SMA = H.seriesTypes.sma,
	EMA = H.seriesTypes.ema;

/**
 * The MACD series type.
 *
 * @constructor seriesTypes.macd
 * @augments seriesTypes.sma
 */
seriesType('macd', 'sma', 
	/**
	 * Moving Average Convergence Divergence (MACD). This series requires `linkedTo` option to be set.
	 * 
	 * @extends {plotOptions.sma}
	 * @product highstock
	 * @sample {highstock} stock/indicators/macd Exponential moving average indicator
	 * @since 6.0.0
	 * @optionparent plotOptions.macd
	 */
	{
		name: 'MACD (26, 12, 9)',
		params: {
			/**
			 * The short period for indicator calculations.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			shortPeriod: 12,
			/**
			 * The long period for indicator calculations.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			longPeriod: 26,
			/**
			 * The base period for signal calculations.
			 * 
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			signalPeriod: 9,
			period: 26
		},
		/**
		 * The styles for signal line
		 * 
		 * @type {Number}
		 * @since 6.0.0
		 * @product highstock
		 */
		signalLine: {
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
				 *
				 * @type {Number}
				 * @since 6.0.0
				 * @product highstock
				 */
				lineColor: undefined
			}
		},
		/**
		 * The styles for macd line
		 * 
		 * @type {Number}
		 * @since 6.0.0
		 * @product highstock
		 */
		macdLine: {
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
				 *
				 * @type {Number}
				 * @since 6.0.0
				 * @product highstock
				 */
				lineColor: undefined
			}
		},
		threshold: 0,
		groupPadding: 0.1,
		pointPadding: 0.1,
		states: {
			hover: {
				halo: {
					size: 0
				}
			}
		},
		tooltip: {
			pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
				'Value: {point.MACD}<br/>' +
				'Signal: {point.signal}<br/>' +
				'Histogram: {point.y}<br/>'
		},
		dataGrouping: 'averages',
		minPointLength: 0
	}, {
		// "y" value is treated as Histogram data
		pointArrayMap: ['y', 'signal', 'MACD'],
		parallelArrays: ['x', 'y', 'signal', 'MACD'],
		pointValKey: 'y',
		// Columns support:
		markerAttribs: noop,
		getColumnMetrics: H.seriesTypes.column.prototype.getColumnMetrics,
		crispCol: H.seriesTypes.column.prototype.crispCol,
		// Colors and lines:
		init: function () {
			SMA.prototype.init.apply(this, arguments);

			// Set default color for a signal line and the histogram:
			this.options = merge({
				signalLine: {
					styles: {
						lineColor: this.color
					}
				},
				macdLine: {
					styles: {
						color: this.color
					}
				}
			}, this.options);
		},
		toYData: function (point) {
			return [point.y, point.signal, point.MACD];
		},
		translate: function () {
			var indicator = this,
				plotNames = ['plotSignal', 'plotMACD'];

			H.seriesTypes.column.prototype.translate.apply(indicator);

			each(indicator.points, function (point) {
				each([point.signal, point.MACD], function (value, i) {
					if (value !== null) {
						point[plotNames[i]] = indicator.yAxis.toPixels(value, true);
					}
				});
			});
		},
		destroy: function () {
			// this.graph is null due to removing two times the same SVG element
			this.graph = null;
			this.graphmacd = this.graphmacd.destroy();
			this.graphsignal = this.graphsignal.destroy();

			SMA.prototype.destroy.apply(this, arguments);
		},
		drawPoints: H.seriesTypes.column.prototype.drawPoints,
		drawGraph: function () {
			var indicator = this,
				mainLinePoints = indicator.points,
				pointsLength = mainLinePoints.length,
				mainLineOptions = indicator.options,
				gappedExtend = {
					options: {
						gapSize: mainLineOptions.gapSize
					}
				},
				otherSignals = [[], []],
				point;

			// Generate points for top and bottom lines:
			while (pointsLength--) {
				point = mainLinePoints[pointsLength];
				if (defined(point.plotMACD)) {
					otherSignals[0].push({
						plotX: point.plotX,
						plotY: point.plotMACD,
						isNull: !defined(point.plotMACD)
					});
				}
				if (defined(point.plotSignal)) {
					otherSignals[1].push({
						plotX: point.plotX,
						plotY: point.plotSignal,
						isNull: !defined(point.plotMACD)
					});
				}
			}

			// Modify options and generate smoothing line:
			each(['macd', 'signal'], function (lineName, i) {
				indicator.points = otherSignals[i];
				indicator.options = merge(mainLineOptions[lineName + 'Line'].styles, gappedExtend);
				indicator.graph = indicator['graph' + lineName];
				SMA.prototype.drawGraph.call(indicator);
				indicator['graph' + lineName] = indicator.graph;
			});

			// Restore options:
			indicator.points = mainLinePoints;
			indicator.options = mainLineOptions;
			//indicator.graph = null;
		},
		getValues: function (series, params) {
			var j = 0,
				shortEMA,
				longEMA,
				MACD = [],
				xMACD = [],
				yMACD = [],
				signalLine = [],
				i;

			// Calculating the short and long EMA used when calculating the MACD
			shortEMA = EMA.prototype.getValues(series, 
				{ 
					period: params.shortPeriod 
				}
			);

			longEMA = EMA.prototype.getValues(series, 
				{ 
					period: params.longPeriod 
				}
			);

			shortEMA = shortEMA.values;
			longEMA = longEMA.values;

			// Subtract each Y value from the EMA's and create the new dataset (MACD)
			for (i = 1; i < shortEMA.length; i++) {
				if (longEMA[i] && longEMA[i][1]) {
					MACD.push([
						shortEMA[i + params.shortPeriod + 1][0], 
						0,
						null,
						shortEMA[i + params.shortPeriod + 1][1] - longEMA[i - 1][1]
					]);
				}
			}

			// Set the Y and X data of the MACD. This is used in calculating the signal line.
			for (i = 0; i < MACD.length; i++) {
				xMACD.push(MACD[i][0]);
				yMACD.push([0, null, MACD[i][3]]);
			}

			// Setting the signalline (Signal Line: X-day EMA of MACD line).
			signalLine = EMA.prototype.getValues(
				{
					xData: xMACD, 
					yData: yMACD
				},
				{ 
					period: params.signalPeriod,
					index: 2
				}
			);

			signalLine = signalLine.values;

			// Setting the MACD Histogram. In comparison to the loop with pure MACD this loop uses MACD x value not xData.
			for (i = 0; i < MACD.length; i++) {
				if (MACD[i][0] >= signalLine[0][0]) { // detect the first point

					MACD[i][2] = signalLine[j][1];
					yMACD[i] = [0, signalLine[j][1],  MACD[i][3]];

					if (MACD[i][3] === null) {
						MACD[i][1] = 0;
						yMACD[i][0] = 0;
					} else {
						MACD[i][1] = (MACD[i][3] - signalLine[j][1]);
						yMACD[i][0] = (MACD[i][3] - signalLine[j][1]);
					}

					j++;
				}
			}
			return {
				values: MACD,
				xData: xMACD,
				yData: yMACD
			};
		}
	});

/**
 * A `MACD` series. If the [type](#series.macd.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to 
 * [plotOptions.macd](#plotOptions.macd).
 * 
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.macd
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.macd
 */

/**
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.macd.data
 */
