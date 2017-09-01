/**
 * Vector plot series module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*
@todo
- Anchor for the arrows. Start, end or center.
- Legend icon
 */

'use strict';
import H from '../parts/Globals.js';

var each = H.each,
	seriesType = H.seriesType;


seriesType('vector', 'scatter', {
	vectorLength: 20,
	lineWidth: 2,
	marker: null,
	states: {
		hover: {
			lineWidthPlus: 1
		}
	},
	tooltip: {
		pointFormat: '<b>[{point.x}, {point.y}]</b><br/>Length: <b>{point.length}</b><br/>Direction: <b>{point.direction}\u00B0</b><br/>'
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
			u = fraction * this.options.vectorLength / 20;

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

	/*
	drawLegendSymbol: function (legend, item) {
		var options = legend.options,
			symbolHeight = legend.symbolHeight,
			square = options.squareSymbol,
			symbolWidth = square ? symbolHeight : legend.symbolWidth,
			path = this.arrow.call({
				lengthMax: 1,
				options: {
					vectorLength: symbolWidth
				}
			}, {
				length: 1
			});

		item.legendLine = this.chart.renderer.path(path)
		.addClass('highcharts-point')
		.attr({
			zIndex: 3,
			translateY: symbolWidth / 2,
			rotation: 270,
			'stroke-width': 1,
			'stroke': 'black'
		}).add(item.legendGroup);

	},
	*/

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
