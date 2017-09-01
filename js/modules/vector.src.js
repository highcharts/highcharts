/**
 * Vector plot series module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

var each = H.each,
	seriesType = H.seriesType;


seriesType('vector', 'scatter', {
	lineWidth: 2,

	/** @ignore */
	marker: null,
	/**
	 * What part of the vector it should be rotated around. Can be one of
	 * `start`, `center` and `end`. When `start`, the vectors will start from
	 * the given [x, y] position, and when `end` the vectors will end in the
	 * [x, y] position.
	 *
	 * @sample  highcharts/plotoptions/vector-rotationorigin-start/
	 *          Rotate from start
	 */
	rotationOrigin: 'center',
	states: {
		hover: {
			lineWidthPlus: 1
		}
	},
	tooltip: {
		pointFormat: '<b>[{point.x}, {point.y}]</b><br/>Length: <b>{point.length}</b><br/>Direction: <b>{point.direction}\u00B0</b><br/>'
	},
	vectorLength: 20
	
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
			o = {
				start: 10,
				center: 0,
				end: -10
			}[this.options.rotationOrigin] || 0,
			u = fraction * this.options.vectorLength / 20;

		// The stem and the arrow head. Draw the arrow first with rotation 0,
		// which is the arrow pointing down (vector from north to south).
		path = [
			'M', 0, 7 * u + o, // base of arrow
			'L', -1.5 * u, 7 * u + o,
			0, 10 * u + o,
			1.5 * u, 7 * u + o,
			0, 7 * u + o,
			0, -10 * u + o// top
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
