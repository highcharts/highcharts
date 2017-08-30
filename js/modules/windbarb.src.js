/**
 * Wind barb series module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var each = H.each,
	seriesType = H.seriesType;


/*
 Wind barb study
 @todo
 - Hover effects (line width, hover color etc from pointAttribs)
 - Option whether to position on Y value
 - Tooltip
 */

seriesType('windbarb', 'line', {
	yOffset: -20,
	arrowLength: 20

	// lineWidth
}, {
	pointArrayMap: ['y', 'z'],
	parallelArrays: ['x', 'y', 'z'],
	beaufortName: ['Calm', 'Light air', 'Light breeze',
		'Gentle breeze', 'Moderate breeze', 'Fresh breeze',
		'Strong breeze', 'Near gale', 'Gale', 'Strong gale', 'Storm',
		'Violent storm', 'Hurricane'],
	beaufortFloor: [0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8,
		24.5, 28.5, 32.7],

	/**
	 * Get presentational attributes for marker-based series (line, spline,
	 * scatter, bubble, mappoint...)
	 */
	pointAttribs: function () {
		return {
			'stroke': this.color,
			'stroke-width': this.options.lineWidth || 2
		};
	},
	markerAttribs: function () {
		return undefined;
	},
	/**
	 * Create a single wind arrow. It is later rotated around the zero
	 * centerpoint.
	 */
	windArrow: function (y) {
		var level,
			path,
			beaufortFloor = this.beaufortFloor,
			u = this.options.arrowLength / 20;

		// The stem and the arrow head
		path = [
			'M', 0, 7 * u, // base of arrow
			'L', -1.5 * u, 7 * u,
			0, 10 * u,
			1.5 * u, 7 * u,
			0, 7 * u,
			0, -10 * u// top
		];

		// Find the beaufort level (zero based)
		for (level = 0; level < beaufortFloor.length; level++) {
			if (beaufortFloor[level] > y) {
				break;
			}
		}

		if (level === 0) {
			path = [];
		}

		if (level === 2) {
			path.push('M', 0, -8 * u, 'L', 4 * u, -8 * u); // short line
		} else if (level >= 3) {
			path.push(0, -10 * u, 7 * u, -10 * u); // long line
		}

		if (level === 4) {
			path.push('M', 0, -7 * u, 'L', 4 * u, -7 * u);
		} else if (level >= 5) {
			path.push('M', 0, -7 * u, 'L', 7 * u, -7 * u);
		}

		if (level === 5) {
			path.push('M', 0, -4 * u, 'L', 4 * u, -4 * u);
		} else if (level >= 6) {
			path.push('M', 0, -4 * u, 'L', 7 * u, -4 * u);
		}

		if (level === 7) {
			path.push('M', 0, -1 * u, 'L', 4 * u, -1 * u);
		} else if (level >= 8) {
			path.push('M', 0, -1 * u, 'L', 7 * u, -1 * u);
		}

		return path;
	},

	drawPoints: function () {
		each(this.points, function (point) {
			if (!point.graphic) {
				point.graphic = this.chart.renderer
					.path()
					.add(this.group);
			}
			point.graphic
				.attr({
					d: this.windArrow(point.y),
					translateX: point.plotX,
					translateY: point.plotY + this.options.yOffset,
					rotation: point.z
				})
				.attr(this.pointAttribs(point));
		}, this);
	}
});
