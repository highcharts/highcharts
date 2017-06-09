/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/Legend.js';
import './ColorSeriesMixin.js';
var colorPointMixin = H.colorPointMixin,
	colorSeriesMixin = H.colorSeriesMixin,
	each = H.each,
	LegendSymbolMixin = H.LegendSymbolMixin,
	merge = H.merge,
	noop = H.noop,
	pick = H.pick,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

// The Heatmap series type
seriesType('heatmap', 'scatter', {
	animation: false,
	borderWidth: 0,
	/*= if (build.classic) { =*/
	nullColor: '${palette.neutralColor3}',
	/*= } =*/
	dataLabels: {
		formatter: function () { // #2945
			return this.point.value;
		},
		inside: true,
		verticalAlign: 'middle',
		crop: false,
		overflow: false,
		padding: 0 // #3837
	},
	marker: null,
	pointRange: null, // dynamically set to colsize by default
	tooltip: {
		pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
	},
	states: {
		normal: {
			animation: true
		},
		hover: {
			halo: false,  // #3406, halo is not required on heatmaps
			brightness: 0.2
		}
	}
}, merge(colorSeriesMixin, {
	pointArrayMap: ['y', 'value'],
	hasPointSpecificOptions: true,
	getExtremesFromAll: true,
	directTouch: true,

	/**
	 * Override the init method to add point ranges on both axes.
	 */
	init: function () {
		var options;
		seriesTypes.scatter.prototype.init.apply(this, arguments);

		options = this.options;
		// #3758, prevent resetting in setData
		options.pointRange = pick(options.pointRange, options.colsize || 1);
		this.yAxis.axisPointRange = options.rowsize || 1; // general point range
	},
	translate: function () {
		var series = this,
			options = series.options,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			between = function (x, a, b) {
				return Math.min(Math.max(a, x), b);
			};

		series.generatePoints();

		each(series.points, function (point) {
			var xPad = (options.colsize || 1) / 2,
				yPad = (options.rowsize || 1) / 2,
				x1 = between(
					Math.round(
						xAxis.len -
						xAxis.translate(point.x - xPad, 0, 1, 0, 1)
					),
					-xAxis.len, 2 * xAxis.len
				),
				x2 = between(
					Math.round(
						xAxis.len -
						xAxis.translate(point.x + xPad, 0, 1, 0, 1)
					),
					-xAxis.len, 2 * xAxis.len
				),
				y1 = between(
					Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)),
					-yAxis.len, 2 * yAxis.len
				),
				y2 = between(
					Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1)),
					-yAxis.len, 2 * yAxis.len
				);

			// Set plotX and plotY for use in K-D-Tree and more
			point.plotX = point.clientX = (x1 + x2) / 2;
			point.plotY = (y1 + y2) / 2;

			point.shapeType = 'rect';
			point.shapeArgs = {
				x: Math.min(x1, x2),
				y: Math.min(y1, y2),
				width: Math.abs(x2 - x1),
				height: Math.abs(y2 - y1)
			};
		});

		series.translateColors();
	},
	drawPoints: function () {
		seriesTypes.column.prototype.drawPoints.call(this);

		each(this.points, function (point) {
			/*= if (build.classic) { =*/
			point.graphic.attr(this.colorAttribs(point));
			/*= } else { =*/
			// In styled mode, use CSS, otherwise the fill used in the style
			// sheet will take precedence over the fill attribute.
			point.graphic.css(this.colorAttribs(point));
			/*= } =*/
		}, this);
	},
	animate: noop,
	getBox: noop,
	drawLegendSymbol: LegendSymbolMixin.drawRectangle,
	alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
	getExtremes: function () {
		// Get the extremes from the value data
		Series.prototype.getExtremes.call(this, this.valueData);
		this.valueMin = this.dataMin;
		this.valueMax = this.dataMax;

		// Get the extremes from the y data
		Series.prototype.getExtremes.call(this);
	}

}), colorPointMixin);
