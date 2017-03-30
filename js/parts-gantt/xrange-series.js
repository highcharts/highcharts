 /**
 * (c) 2014-2017 Highsoft AS
 * Authors: Torstein Honsi, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var defaultPlotOptions = H.getOptions().plotOptions,
	color = H.Color,
	columnType = H.seriesTypes.column,
	each = H.each,
	extendClass = H.extendClass,
	isNumber = H.isNumber,
	isObject = H.isObject,
	merge = H.merge,
	pick = H.pick,
	seriesTypes = H.seriesTypes,
	wrap = H.wrap,
	Axis = H.Axis,
	Point = H.Point,
	Series = H.Series,
	pointFormat = 	'<span style="color:{point.color}">' +
						'\u25CF' +
					'</span> {series.name}: <b>{point.yCategory}</b><br/>',
	xrange = 'xrange';

defaultPlotOptions.xrange = merge(defaultPlotOptions.column, {
	tooltip: {
		pointFormat: pointFormat
	}
});
seriesTypes.xrange = extendClass(columnType, {
	pointClass: extendClass(Point, {
		// Add x2 and yCategory to the available properties for tooltip formats
		getLabelConfig: function () {
			var cfg = Point.prototype.getLabelConfig.call(this);

			cfg.x2 = this.x2;
			cfg.yCategory = this.yCategory = this.series.yAxis.categories && this.series.yAxis.categories[this.y];
			return cfg;
		}
	}),
	type: xrange,
	forceDL: true,
	parallelArrays: ['x', 'x2', 'y'],
	requireSorting: false,
	animate: seriesTypes.line.prototype.animate,

	/**
	 * Borrow the column series metrics, but with swapped axes. This gives free access
	 * to features like groupPadding, grouping, pointWidth etc.
	 */
	getColumnMetrics: function () {
		var metrics,
			chart = this.chart;

		function swapAxes() {
			each(chart.series, function (s) {
				var xAxis = s.xAxis;
				s.xAxis = s.yAxis;
				s.yAxis = xAxis;
			});
		}

		swapAxes();

		this.yAxis.closestPointRange = 1;
		metrics = columnType.prototype.getColumnMetrics.call(this);

		swapAxes();

		return metrics;
	},

	/**
	 * Override cropData to show a point where x is outside visible range
	 * but x2 is outside.
	 */
	cropData: function (xData, yData, min, max) {

		// Replace xData with x2Data to find the appropriate cropStart
		var cropData = Series.prototype.cropData,
			crop = cropData.call(this, this.x2Data, yData, min, max);

		// Re-insert the cropped xData
		crop.xData = xData.slice(crop.start, crop.end);

		return crop;
	},

	translate: function () {
		columnType.prototype.translate.apply(this, arguments);
		var series = this,
			xAxis = series.xAxis,
			metrics = series.columnMetrics,
			minPointLength = series.options.minPointLength || 0;

		each(series.points, function (point) {
			var plotX = point.plotX,
				posX = pick(point.x2, point.x + (point.len || 0)),
				plotX2 = xAxis.toPixels(posX, true),
				width = plotX2 - plotX,
				widthDifference,
				shapeArgs,
				partialFill;

			if (minPointLength) {
				widthDifference = minPointLength - width;
				if (widthDifference < 0) {
					widthDifference = 0;
				}
				plotX -= widthDifference / 2;
				plotX2 += widthDifference / 2;
			}

			plotX = Math.max(plotX, -10);
			plotX2 = Math.min(Math.max(plotX2, -10), xAxis.len + 10);

			if (plotX2 < plotX) { // #6107
				plotX2 = plotX;
			}

			point.shapeArgs = {
				x: plotX,
				y: point.plotY + metrics.offset,
				width: plotX2 - plotX,
				height: metrics.width
			};
			point.tooltipPos[0] += width / 2;
			point.tooltipPos[1] -= metrics.width / 2;

			// Add a partShapeArgs to the point, based on the shapeArgs property
			partialFill = point.partialFill;
			if (partialFill) {
				// Get the partial fill amount
				if (isObject(partialFill)) {
					partialFill = partialFill.amount;
				}
				// If it was not a number, assume 0
				if (!isNumber(partialFill)) {
					partialFill = 0;
				}
				shapeArgs = point.shapeArgs;
				point.partShapeArgs = {
					x: shapeArgs.x,
					y: shapeArgs.y + 1,
					width: shapeArgs.width * partialFill,
					height: shapeArgs.height - 2
				};
			}
		});
	},

	drawPoints: function () {
		var series = this,
			chart = this.chart,
			options = series.options,
			renderer = chart.renderer,
			animationLimit = options.animationLimit || 250,
			verb = chart.pointCount < animationLimit ? 'animate' : 'attr';

		// draw the columns
		each(series.points, function (point) {
			var plotY = point.plotY,
				graphic = point.graphic,
				type = point.shapeType,
				shapeArgs = point.shapeArgs,
				partShapeArgs = point.partShapeArgs,
				seriesOpts = series.options,
				pfOptions = point.partialFill,
				fill,
				state = point.selected && 'select',
				cutOff = options.stacking && !options.borderRadius;

			if (isNumber(plotY) && point.y !== null) {
				if (graphic) { // update
					point.graphicOriginal[verb](
						merge(shapeArgs)
					);
					if (partShapeArgs) {
						point.graphicOverlay[verb](
							merge(partShapeArgs)
						);
					}

				} else {
					point.graphic = graphic = renderer.g('point')
						.attr({
							'class': point.getClassName()
						})
						.add(point.group || series.group);
					
					point.graphicOriginal = renderer[type](shapeArgs)
						.addClass('highcharts-partfill-original')
						.add(graphic);
					if (partShapeArgs) {
						point.graphicOverlay = renderer[type](partShapeArgs)
							.addClass('highcharts-partfill-overlay')
							.add(graphic);
					}
				}

				/*= if (build.classic) { =*/
				// Presentational
				point.graphicOriginal
					.attr(series.pointAttribs(point, state))
					.shadow(options.shadow, null, cutOff);
				if (partShapeArgs) {
					// Ensure pfOptions is an object
					if (!isObject(pfOptions)) {
						pfOptions = {};
					}
					if (isObject(seriesOpts.partialFill)) {
						pfOptions = merge(pfOptions, seriesOpts.partialFill);
					}
					
					fill = pfOptions.fill ||
							color(series.color).brighten(-0.3).get('rgb');
					point.graphicOverlay
						.attr(series.pointAttribs(point, state))
						.attr('fill', fill)
						.attr('stroke-width', 0)
						.shadow(options.shadow, null, cutOff);
				}
				/*= } =*/

			} else if (graphic) {
				point.graphic = graphic.destroy(); // #1269
			}
		});
	}
});

/**
 * Max x2 should be considered in xAxis extremes
 */
wrap(Axis.prototype, 'getSeriesExtremes', function (proceed) {
	var axis = this,
		series = axis.series,
		dataMax,
		modMax;

	proceed.call(this);
	if (axis.isXAxis && series.type === xrange) {
		dataMax = pick(axis.dataMax, Number.MIN_VALUE);
		each(this.series, function (series) {
			each(series.x2Data || [], function (val) {
				if (val > dataMax) {
					dataMax = val;
					modMax = true;
				}
			});
		});
		if (modMax) {
			axis.dataMax = dataMax;
		}
	}
});
