/**
 * Vector plot series module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*
@todo
- Tooltip format
- Anchor for the arrows. Start, end or center.
- Legend icon
 */

'use strict';
import H from '../parts/Globals.js';

var each = H.each,
	seriesType = H.seriesType;


seriesType('vector', 'scatter', {
	arrowLength: 20,
	lineWidth: 2,
	marker: null,
	states: {
		hover: {
			lineWidthPlus: 0
		}
	}
	
}, {
	pointArrayMap: ['y', 'length', 'direction'],
	parallelArrays: ['x', 'y', 'length', 'direction'],
	
	/**
	 * Get presentational attributes.
	 */
	pointAttribs: function (point, state) {
		var options = this.options,
			stroke = this.color,
			strokeWidth = this.options.lineWidth;

		if (state) {
			stroke = options.states[state].color || stroke;
			strokeWidth =
				(options.states[state].lineWidth || strokeWidth) + 
				(options.states[state].lineWidthPlus || 0);
		}

		return {
			'stroke': stroke,
			'stroke-width': strokeWidth
		};
	},
	markerAttribs: H.noop,
	getSymbol: H.noop,

	/**
	 * Create a single arrow. It is later rotated around the zero
	 * centerpoint.
	 */
	arrow: function (point) {
		var path,
			fraction = point.length / this.lengthMax,
			u = fraction * this.options.arrowLength / 20;

		// The stem and the arrow head
		path = [
			'M', 0, 7 * u, // base of arrow
			'L', -1.5 * u, 7 * u,
			0, 10 * u,
			1.5 * u, 7 * u,
			0, 7 * u,
			0, -10 * u// top
		];

		return path;
	},

	translate: function () {
		H.Series.prototype.translate.call(this);

		this.lengthMax = H.arrayMax(this.lengthData);
	},
	

	drawPoints: function () {
		each(this.points, function (point) {
			var plotX = point.plotX,
				plotY = point.plotY;
			if (!point.graphic) {
				point.graphic = this.chart.renderer
					.path()
					.add(this.markerGroup);
			}
			point.graphic
				.attr({
					d: this.arrow(point),
					translateX: plotX,
					translateY: plotY,
					rotation: point.direction
				})
				.attr(this.pointAttribs(point));
			
		}, this);
	},

	drawGraph: H.noop,

	/**
	 * Fade in the arrows on initiating series.
	 */
	animate: function (init) {
		if (init) {
			this.markerGroup.attr({
				opacity: 0.01
			});
		} else {
			this.markerGroup.animate({
				opacity: 1
			}, H.animObject(this.options.animation));

			this.animate = null;
		}
	}
});
