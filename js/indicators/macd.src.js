/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';

	var UNDEFINED,
		each = H.each,
		noop = H.noop,
		merge = H.merge,
		isArray = H.isArray,
		defined = H.defined,
		SMA = H.seriesTypes.sma;

	// Utils:
	function average(arr) {
		var sum = 0,
			arrLength = arr.length,
			i = arrLength;

		while (i--) {
			sum = sum + arr[i];
		}

		return (sum / arrLength);
	}

	H.seriesType('macd', 'sma', {
		name: 'MACD (26, 12, 9)',
		params: {
			shortPeriod: 12,
			longPeriod: 26,
			signalPeriod: 9,
			period: 26
		},
		signalLine: {
			styles: {
				lineWidth: 1
			}
		},
		macdLine: {
			styles: {
				lineWidth: 1
			}
		},
		threshold: 0,
		groupPadding: 0.1,
		pointPadding: 0.1,
		tooltip: {
			pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
				'Value: {point.MACD}<br/>' +
				'Signal: {point.signal}<br/>' +
				'Histogram: {point.y}<br/>'
		},
		dataGrouping: {
			approximation: function (top, bot, mid) {
				var ret = [
						H.approximations.average(top),
						H.approximations.average(bot),
						H.approximations.average(mid)
					],
					val;

				if (ret[0] !== UNDEFINED && ret[1] !== UNDEFINED && ret[2] !== UNDEFINED) {
					val = ret;
				} else {
					val = UNDEFINED;
				}

				return val;
			}
		}
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
						isNull: point.isNull
					});
				}
				if (defined(point.plotSignal)) {
					otherSignals[1].push({
						plotX: point.plotX,
						plotY: point.plotSignal,
						isNull: point.isNull
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
		},
		getValues: function (series, params) {
			var xVal = series.xData,
				yVal = series.yData,
				ema = this.EMA,
				shortEMA,
				longEMA,
				MACD = [],
				xMACD = [],
				yMACD = [],
				signalLine = [],
				i;

			// Calculating the short and long EMA used when calculating the MACD
			shortEMA = ema(xVal, yVal, params.shortPeriod);
			longEMA = ema(xVal, yVal, params.longPeriod);

			// Subtract each Y value from the EMA's and create the new dataset (MACD)
			for (i = 0; i < shortEMA.length; i++) {

				if (longEMA[i][1] !== null) {
					MACD.push([xVal[i], (shortEMA[i][1] - longEMA[i][1])]);
				}
			}

			// Set the Y and X data of the MACD. This is used in calculating the signal line.
			for (i = 0; i < MACD.length; i++) {
				xMACD.push(MACD[i][0]);
				yMACD.push(MACD[i][1]);
			}

			// Setting the signalline (Signal Line: X-day EMA of MACD line).
			signalLine = ema(xMACD, yMACD, params.signalPeriod);

			// Setting the MACD Histogram. In comparison to the loop with pure MACD this loop uses MACD x value not xData.
			for (i = 0; i < MACD.length; i++) {
				MACD[i].push(signalLine[i][1]);
				yMACD[i] = [MACD[i][1], signalLine[i][1]];

				if (MACD[i][1] === null) {
					MACD[i].push(null);
					yMACD[i].push(null);
				} else {
					MACD[i].push((MACD[i][1] - signalLine[i][1]));
					yMACD[i].push((MACD[i][1] - signalLine[i][1]));
				}
			}

			return {
				values: MACD,
				xData: xMACD,
				yData: yMACD
			};
		},
		/* EMA for MACD, implementation is a bit different than the default EMA
		 *
		 * EMA = Price(t) * k + EMA(y) * (1 - k)
		 * t = today, y = yesterday, N = number of days in EMA, k = 2/(2N+1)
		 *
		 * @param {Array} yData Y-values contianer.
		 * @param {Array} xData X-values container.
		 * @param {Number} period Period
		 * @returns {Array} An array containing calculated EMA.
		 **/
		EMA: function (xData, yData, period) {
			var value,
				y = false,
				k = (2 / (period + 1)),
				isOhlc = isArray(yData[0]),
				closeIndex = 3,
				emaPoint,
				emaPoints = [],
				currentPeriod = [],
				length = yData.length,
				i;

			for (i = 0; i < length; i++) {
				// Add last point to the period
				if (yData[i - 1]) {
					if (isOhlc && yData[i - 1].length === 4) {
						currentPeriod.push(yData[i][closeIndex]);
					} else {
						currentPeriod.push(yData[i]);
					}
				}

				// Steps:
				// 0: runs if the current period has enough points
				// 1: set the current value
				// 2: set last value, can be average or previous ema
				// 3: calculate todays ema.
				if (period === currentPeriod.length) {

					if (isOhlc) {
						value = yData[i][closeIndex];
					} else {
						value = yData[i];
					}

					if (!y) {
						y = average(currentPeriod);
					} else {
						emaPoint = (value * k) + (y * (1 - k));
						y = emaPoint;
					}

					emaPoints.push([xData[i], y]);

					// Remove first value in array.
					currentPeriod.splice(0, 1);
				} else {
					emaPoints.push([xData[i], null]);
				}

			}

			return emaPoints;
		}
	});
}));
