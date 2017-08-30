/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';
	var each = H.each,
		defined = H.defined,
		isArray = H.isArray,
		SMA = H.seriesTypes.sma;

	H.seriesType('pivotPoints', 'sma', {
		name: 'Pivot Points (28)',
		params: {
			period: 28,
			type: 'standard' // docs: standard || fibonacci || camarilla
		},
		marker: {
			enabled: false
		},
		tooltip: {
			enabled: false
		},
		dataLabels: {
			enabled: true,
			formatter: function () {
				return this.y === null ? '' : H.numberFormat(this.y, 2);
			}
		},
		dataGrouping: {
			enabled: false
		}
	}, {
		pointArrayMap: ['R4', 'R3', 'R2', 'R1', 'P', 'S1', 'S2', 'S3', 'S4'],
		pointValKey: 'P',
		toYData: function (point) {
			return [point.P]; // The rest should not affect extremes
		},
		translate: function () {
			var indicator = this;

			SMA.prototype.translate.apply(indicator);

			each(indicator.points, function (point) {
				each(indicator.pointArrayMap, function (value) {
					if (defined(point[value])) {
						point['plot' + value] = indicator.yAxis.toPixels(
							point[value],
							true
						);
					}
				});
			});

			// Pivot points are rendered as horizontal lines
			// And last point start not from the next one (as it's the last one)
			// But from the last point in data series
			indicator.plotEndPoint = indicator.xAxis.toPixels(
				indicator.endPoint,
				true
			);
		},
		getGraphPath: function (points) {
			var indicator = this,
				pointsLength = points.length,
				allPivotPoints = [[], [], [], [], [], [], [], [], []],
				path = [],
				endPoint = indicator.plotEndPoint,
				pointArrayMapLength = indicator.pointArrayMap.length,
				position,
				point,
				i;

			while (pointsLength--) {
				point = points[pointsLength];
				for (i = 0; i < pointArrayMapLength; i++) {
					position = indicator.pointArrayMap[i];

					if (defined(point[position])) {
						allPivotPoints[i].push({
							// Start left:
							plotX: point.plotX,
							plotY: point['plot' + position],
							isNull: false
						}, {
							// Go to right:
							plotX: endPoint,
							plotY: point['plot' + position],
							isNull: false
						}, {
							// And add null points in path to generate breaks:
							plotX: endPoint,
							plotY: null,
							isNull: true
						});
					}
				}
				endPoint = point.plotX;
			}

			each(allPivotPoints, function (pivotPoints) {
				path = path.concat(
					SMA.prototype.getGraphPath.call(indicator, pivotPoints)
				);
			});

			return path;
		},
		drawDataLabels: function () {
			var indicator = this,
				pointMapping = indicator.pointArrayMap,
				currentLabel,
				pointsLength,
				point,
				i;

			if (indicator.options.dataLabels.enabled) {
				pointsLength = indicator.points.length;

				// For every Ressitance/Support group we need to render labels
				each(pointMapping, function (position, k) {
					i = pointsLength;
					while (i--) {
						point = indicator.points[i];
						point.y = point[position];
						point.plotY = point['plot' + position];
						currentLabel = point['dataLabel' + position];

						// Store previous label if exists:
						if (k) {
							point['dataLabel' + pointMapping[k - 1]] = point.dataLabel;
						}

						// If current label exists, update it's position
						// And perhaps it's value
						if (currentLabel) {
							point.dataLabel = currentLabel;
						} else {
							point.dataLabel = null;
						}
					}
					SMA.prototype.drawDataLabels.apply(indicator, arguments);
				});
			}
		},
		getValues: function (series, params) {
			var period = params.period,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				placement = this[params.type + 'Placement'],
				PP = [], // 0- from, 1- to, 2- R1, 3- R2, 4- pivot, 5- S1, 6- S2 etc.
				xData = [],
				yData = [],
				slicedX,
				slicedY,
				lastPP,
				pivot,
				avg,
				i;

			// Pivot Points requires high, low and close values
			if (
				xVal.length <= period ||
				!isArray(yVal[0]) ||
				yVal[0].length !== 4
			) {
				return false;
			}

			for (i = period + 1; i <= yValLen + period; i += period) {
				slicedX = xVal.slice(i - period - 1, i);
				slicedY = yVal.slice(i - period - 1, i);

				pivot = this.getPivotAndHLC(slicedY);
				avg = placement(pivot);

				lastPP = PP.push(
					[slicedX[0]]
					.concat(avg)
				);

				xData.push(slicedX[0]);
				yData.push(PP[lastPP - 1].slice(1));
			}

			this.endPoint = slicedX[slicedX.length - 1];

			return {
				values: PP,
				xData: xData,
				yData: yData
			};
		},
		getPivotAndHLC: function (values) {
			var high = -Infinity,
				low = Infinity,
				close = values[values.length - 1][3],
				pivot;
			each(values, function (p) {
				high = Math.max(high, p[1]);
				low = Math.min(low, p[2]);
			});
			pivot = (high + low + close) / 3;

			return [pivot, high, low, close];
		},
		standardPlacement: function (values) {
			var avg = [
				null,
				null,
				values[0] + values[1] - values[2],
				values[0] * 2 - values[2],
				values[0],
				values[0] * 2 - values[1],
				values[0] - values[1] + values[2],
				null,
				null
			];

			return avg;
		},
		camarillaPlacement: function (values) {
			var diff = values[1] - values[2],
				avg = [
					values[3] + diff * 1.5,
					values[3] + diff * 1.25,
					values[3] + diff * 1.1666,
					values[3] + diff * 1.0833,
					values[0],
					values[3] - diff * 1.0833,
					values[3] - diff * 1.1666,
					values[3] - diff * 1.25,
					values[3] - diff * 1.5
				];

			return avg;
		},
		fibonacciPlacement: function (values) {
			var diff = values[1] - values[2],
				avg = [
					null,
					values[0] + diff,
					values[0] + diff * 0.618,
					values[0] + diff * 0.382,
					values[0],
					values[0] - diff * 0.382,
					values[0] - diff * 0.618,
					values[0] - diff,
					null
				];

			return avg;
		}
	}, {
		// Destroy labels:
		destroyElements: function () {
			var point = this,
				props = point.series.pointArrayMap,
				prop,
				i = props.length;

			SMA.prototype.Point.prototype.destroyElements.call(this);

			while (i--) {
				prop = 'dataLabel' + props[i];
				if (point[prop]) {
					point[prop] = point[prop].destroy();
				}
			}
		}
	});
}));
