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
		merge = H.merge,
		isArray = H.isArray,
		defined = H.defined,
		SMA = H.seriesTypes.sma;
		
	// Utils:
	function minInArray(arr, index) {
		return arr.reduce(function (min, target) {
			return Math.min(min, target[index]);
		}, Infinity);
	}

	function maxInArray(arr, index) {
		return arr.reduce(function (min, target) {
			return Math.max(min, target[index]);
		}, 0);
	}

	H.seriesType('stochastic', 'sma', {
		name: 'Stochastic (14, 3)',
		params: {
			period: [14, 3] // 14 for %K, 3 for %D
		},
		marker: {
			enabled: false
		},
		tooltip: {
			pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
				'%K: {point.y}<br/>' +
				'%D: {point.bottom}<br/>'
		},
		smoothedLine: {
			styles: {
				lineWidth: 1
			}
		},
		dataGrouping: {
			approximation: function (top, bot) {
				var ret = [
					H.approximations.average(top),
					H.approximations.average(bot)
				];
				if (ret[0] !== UNDEFINED && ret[1] !== UNDEFINED) {
					return ret;
				}
				return UNDEFINED;
			}
		}
	}, {
		pointArrayMap: ['y', 'bottom'],
		parallelArrays: ['x', 'y', 'bottom'],
		pointValKey: 'y',
		init: function () {
			SMA.prototype.init.apply(this, arguments);

			// Set default color for lines:
			this.options = merge({
				smoothedLine: {
					styles: {
						lineColor: this.color
					}
				}
			}, this.options);
		},
		toYData: function (point) {
			return [point.y, point.bottom];
		},
		translate: function () {
			var indicator = this;

			SMA.prototype.translate.apply(indicator);

			each(indicator.points, function (point) {
				if (point.bottom !== null) {
					point.plotBottom = indicator.yAxis.toPixels(point.bottom, true);
				}
			});
		},
		drawGraph: function () {
			var indicator = this,
				mainLinePoints = indicator.points,
				pointsLength = mainLinePoints.length,
				mainLineOptions = indicator.options,
				mainLinePath = indicator.graph,
				gappedExtend = {
					options: {
						gapSize: mainLineOptions.gapSize
					}
				},
				smoothing = [],
				point;

			// Generate points for top and bottom lines:
			while (pointsLength--) {
				point = mainLinePoints[pointsLength];
				smoothing.push({
					plotX: point.plotX,
					plotY: point.plotBottom,
					isNull: !defined(point.plotBottom)
				});
			}

			// Modify options and generate smoothing line:
			indicator.points = smoothing;
			indicator.options = merge(mainLineOptions.smoothedLine.styles, gappedExtend);
			indicator.graph = indicator.graphSmoothed;
			SMA.prototype.drawGraph.call(indicator);
			indicator.graphSmoothed = indicator.graph;

			// Restore options and draw a main line:
			indicator.points = mainLinePoints;
			indicator.options = mainLineOptions;
			indicator.graph = mainLinePath;
			SMA.prototype.drawGraph.call(indicator);
		},
		getValues: function (series, params) {
			var periodK = params.period[0],
				periodD = params.period[1],
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				SO = [], // 0- date, 1-%K, 2-%D
				date,
				xData = [],
				yData = [],
				slicedY,
				close = 3,
				low = 2,
				high = 1,
				CL, HL, LL, K,
				D = null,
				points,
				i;


			// Stochastic requires close value
			if (xVal.length <= periodK || !isArray(yVal[0]) || yVal[0].length !== 4) {
				return false;
			}

			for (i = periodK; i < yValLen; i++) {
				slicedY = yVal.slice(i - periodK, i + 1); // i+1 - previous preiods + today
				date = xVal[i];
					
				// Calculate %K
				LL = minInArray(slicedY, low); // Lowest low in %K periods
				CL = yVal[i][close] - LL;
				HL = maxInArray(slicedY, high) - LL;
				K = CL / HL * 100;
				
				// Calculate smoothed %D, which is SMA of %K
				if (i > periodK + periodD) {
					points = SMA.prototype.getValues.call(this, {
						xData: xData.slice(i - periodD - periodK - 1, i - periodD),
						yData: yData.slice(i - periodD - periodK - 1, i - periodD)
					}, {
						period: periodD
					});
					D = points.yData[0];
				}
				
				SO.push([date, K, D]);
				xData.push(date);
				yData.push([K, D]);
			}

			return {
				values: SO,
				xData: xData,
				yData: yData
			};
		}
	});
}));
