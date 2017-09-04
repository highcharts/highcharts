/**
 * Honeycomb module
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Øystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts-map/HeatmapSeries.js';

var seriesType = H.seriesType,
	each = H.each,
	reduce = H.reduce,
	between = function (x, a, b) {
		return Math.min(Math.max(a, x), b);
	};

// Add pixel padding for series. Uses getSeriesPixelPadding on each series and
// adds the largest padding required. If no series has this function defined,
// we add nothing.
H.wrap(H.Axis.prototype, 'setAxisTranslation', function (proceed) {

	// We need to run the original func first, so that we know the translation
	// formula to use for computing the padding
	proceed.apply(this, Array.prototype.slice.call(arguments, 1));

	var axis = this,
		// Find which series' padding to use
		seriesPadding = reduce(H.map(axis.series, function (series) {
			return series.getSeriesPixelPadding &&
				series.getSeriesPixelPadding(axis);
		}), function (a, b) {
			return (a && a.padding) > (b && b.padding) ? a : b;
		}) || {
			padding: 0,
			axisLengthFactor: 1
		},
		lengthPadding = Math.round(
			seriesPadding.padding * seriesPadding.axisLengthFactor
		);

	// Don't waste time on this if we're not adding extra padding
	if (seriesPadding.padding) {
		// Recompute translation with new axis length now (minus padding)
		axis.len -= lengthPadding;
		proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
		axis.minPixelPadding += seriesPadding.padding;
		axis.len += lengthPadding;
	}
});


/**
 * A honeycomb series is a type of heatmap where the tiles are hexagonal.
 * 
 * @extends {plotOptions.heatmap}
 * @since 6.0.0
 * @optionparent plotOptions.honeycomb
 */
seriesType('honeycomb', 'heatmap', {
// Default options
	states: {
		hover: {
			halo: { 
				enabled: true,
				size: 2,
				opacity: 0.5,
				attributes: {
					zIndex: 3
				}
			}
		}
	}

// Prototype functions
}, {
	getSeriesPixelPadding: function (axis, xpad, ypad) {
		var isX = axis.isXAxis,
			options = this.options,
			xPad = xpad || (options.colsize || 1) / -3,
			yPad = ypad || (options.rowsize || 1) / -2,
			coord1 = Math.round(
				axis.translate(
					isX ? 
						xPad * 2 :
						yPad,
					0, 1, 0, 1
				)
			),
			coord2 = Math.round(
				axis.translate(
					isX ? xPad : 0,
					0, 1, 0, 1
				)
			);
		return {
			// Use translate to compute how far outside the points we draw, and
			// use this difference as padding.
			padding: Math.abs(coord1 - coord2) || 0,

			// Offset the yAxis length to compensate for shift.
			// Setting the length factor to 2 would add the same margin to max
			// as min. Now we only add a slight bit of the min margin to max, as 
			// we don't actually draw outside the max bounds. For the xAxis we
			// draw outside on both sides so we add the same margin to min and
			// max.
			axisLengthFactor: isX ? 2 : 1.1
		};
	},

	translate: function () {
		var series = this,
			options = series.options,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			pointPadding = options.pointPadding || 0,
			xPointPadding = xAxis.reversed ? -pointPadding : pointPadding,
			yPointPadding = yAxis.reversed ? -pointPadding : pointPadding,
			xPad = (options.colsize || 1) / 3,
			yPad = (options.rowsize || 1) / 2,
			yShift;

		series.generatePoints();

		each(series.points, function (point) {
			var x1 = between(
					Math.floor(
						xAxis.len -
						xAxis.translate(point.x - xPad * 2, 0, 1, 0, 1)
					), -xAxis.len, 2 * xAxis.len
				),
				x2 = between(
					Math.floor(
						xAxis.len -
						xAxis.translate(point.x - xPad, 0, 1, 0, 1)
					), -xAxis.len, 2 * xAxis.len
				),
				x3 = between(
					Math.floor(
						xAxis.len -
						xAxis.translate(point.x + xPad, 0, 1, 0, 1)
					), -xAxis.len, 2 * xAxis.len
				),
				x4 = between(
					Math.floor(
						xAxis.len -
						xAxis.translate(point.x + xPad * 2, 0, 1, 0, 1)
					), -xAxis.len, 2 * xAxis.len
				),
				y1 = between(
					Math.floor(yAxis.translate(point.y - yPad, 0, 1, 0, 1)),
					-yAxis.len,
					2 * yAxis.len
				),
				y2 = between(
					Math.floor(yAxis.translate(point.y, 0, 1, 0, 1)),
					-yAxis.len,
					2 * yAxis.len
				),
				y3 = between(
					Math.floor(yAxis.translate(point.y + yPad, 0, 1, 0, 1)),
					-yAxis.len,
					2 * yAxis.len
				);

			// Shift y-values for every second grid column
			if (point.x % 2) {
				yShift = yShift || Math.round(Math.abs(y3 - y1) / 2) *
					// We have to reverse the shift for reversed y-axes
					(yAxis.reversed ? -1 : 1);
				y1 += yShift;
				y2 += yShift;
				y3 += yShift;
			}

			// Set plotX and plotY for use in K-D-Tree and more
			point.plotX = point.clientX = (x2 + x3) / 2;
			point.plotY = y2;

			// Apply point padding to translated coordinates
			x1 += xPointPadding;
			x2 += xPointPadding;
			x3 -= xPointPadding;
			x4 -= xPointPadding;
			y1 -= yPointPadding;
			y3 += yPointPadding;

			// Store points for halo creation
			point.tileEdges = {
				x1: x1, x2: x2, x3: x3,	x4: x4, y1: y1, y2: y2, y3: y3
			};

			// Finally set the shape for this point
			point.shapeType = 'path';
			point.shapeArgs = {
				d: [
					'M', x2, y1,
					'L', x3, y1,
					x4, y2,
					x3, y3,
					x2, y3,
					x1, y2,
					'Z'
				]
			};
		});

		series.translateColors();
	},

	alignDataLabel: H.seriesTypes.scatter.prototype.alignDataLabel

// Point class
}, {
	haloPath: function (size) {
		var hexagon = this.tileEdges;
		return [
			'M', hexagon.x2 - size, hexagon.y1 + size,
			'L', hexagon.x3 + size, hexagon.y1 + size,
			hexagon.x4 + size * 1.5, hexagon.y2,
			hexagon.x3 + size, hexagon.y3 - size,
			hexagon.x2 - size, hexagon.y3 - size,
			hexagon.x1 - size * 1.5, hexagon.y2,
			'Z'
		];
	}
});


/**
 * A diamondmap series is a type of heatmap where the tiles are diamond shaped.
 * 
 * @extends {plotOptions.honeycomb}
 * @since 6.0.0
 * @optionparent plotOptions.diamondmap
 */
seriesType('diamondmap', 'honeycomb', { 
	// Default options
	states: {
		hover: {
			halo: {	
				size: 4,
				opacity: 0.5
			}
		}
	}
}, {
	getSeriesPixelPadding: function (axis) {
		var options = this.options;
		// Reuse logic from honeycomb series with different padding settings
		return H.seriesTypes.honeycomb.prototype.getSeriesPixelPadding.call(
			this, axis, (options.colsize || 1) / -2, (options.rowsize || 1) / -2
		);
	},

	translate: function () {
		var series = this,
			options = series.options,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			pointPadding = options.pointPadding || 0,
			xPointPadding = xAxis.reversed ? -pointPadding : pointPadding,
			yPointPadding = yAxis.reversed ? -pointPadding : pointPadding,
			xPad = (options.colsize || 1),
			yPad = (options.rowsize || 1) / 2,
			yShift;

		series.generatePoints();

		each(series.points, function (point) {
			var x1 = between(
					Math.round(
						xAxis.len -
						xAxis.translate(point.x - xPad, 0, 1, 0, 0)
					), -xAxis.len, 2 * xAxis.len
				),
				x2 = between(
					Math.round(
						xAxis.len -
						xAxis.translate(point.x, 0, 1, 0, 0)
					), -xAxis.len, 2 * xAxis.len
				),
				x3 = between(
					Math.round(
						xAxis.len -
						xAxis.translate(point.x + xPad, 0, 1, 0, 0)
					), -xAxis.len, 2 * xAxis.len
				),
				y1 = between(
					Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 0)),
					-yAxis.len, 
					2 * yAxis.len
				),
				y2 = between(
					Math.round(yAxis.translate(point.y, 0, 1, 0, 0)),
					-yAxis.len,
					2 * yAxis.len
				),
				y3 = between(
					Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 0)),
					-yAxis.len,
					2 * yAxis.len
				);

			// Shift y-values for every second grid column
			// We have to reverse the shift for reversed y-axes
			if (point.x % 2) {
				yShift = Math.abs(y3 - y1) / 2 * (yAxis.reversed ? -1 : 1);
				y1 += yShift;
				y2 += yShift;
				y3 += yShift;
			}

			// Set plotX and plotY for use in K-D-Tree and more
			point.plotX = point.clientX = x2;
			point.plotY = y2;

			// Apply point padding to translated coordinates
			x1 += xPointPadding;
			x3 -= xPointPadding;
			y1 -= yPointPadding;
			y3 += yPointPadding;

			// Store points for halo creation
			point.tileEdges = {
				x1: x1, x2: x2, x3: x3, y1: y1, y2: y2, y3: y3
			};
			
			// Set this point's shape parameters
			point.shapeType = 'path';
			point.shapeArgs = {
				d: [
					'M', x2, y1,
					'L', x3, y2,
					x2, y3,
					x1, y2,
					'Z'
				]
			};
		});

		series.translateColors();
	}

// Point class
}, {
	haloPath: function (size) {
		var diamond = this.tileEdges;
		return [
			'M', diamond.x2, diamond.y1 + size,
			'L', diamond.x3 + size, diamond.y2,
			diamond.x2, diamond.y3 - size,
			diamond.x1 - size, diamond.y2,
			'Z'
		];
	}
});
