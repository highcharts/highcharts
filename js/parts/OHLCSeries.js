/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Point.js';
var each = H.each,
	Point = H.Point,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

/**
 * The ohlc series type.
 *
 * @constructor seriesTypes.ohlc
 * @augments seriesTypes.column
 */
seriesType('ohlc', 'column', {
	lineWidth: 1,
	tooltip: {
		/*= if (!build.classic) { =*/
		pointFormat: '<span class="highcharts-color-{point.colorIndex}">\u25CF</span> <b> {series.name}</b><br/>' +
			'Open: {point.open}<br/>' +
			'High: {point.high}<br/>' +
			'Low: {point.low}<br/>' +
			'Close: {point.close}<br/>',
		/*= } else { =*/
		pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
			'Open: {point.open}<br/>' +
			'High: {point.high}<br/>' +
			'Low: {point.low}<br/>' +
			'Close: {point.close}<br/>'
		/*= } =*/
	},
	threshold: null,
	/*= if (build.classic) { =*/
	states: {
		hover: {
			lineWidth: 3
		}
	}
	//upColor: undefined
	/*= } =*/

}, /** @lends seriesTypes.ohlc */ {
	pointArrayMap: ['open', 'high', 'low', 'close'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.open, point.high, point.low, point.close];
	},
	pointValKey: 'high',

	/*= if (build.classic) { =*/
	pointAttrToOptions: {
		'stroke': 'color',
		'stroke-width': 'lineWidth'
	},

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	pointAttribs: function (point, state) {
		var attribs = seriesTypes.column.prototype.pointAttribs.call(
				this,
				point,
				state
			),
			options = this.options;

		delete attribs.fill;

		if (
			!point.options.color &&
			options.upColor &&
			point.open < point.close
		) {
			attribs.stroke = options.upColor;
		}

		return attribs;
	},
	/*= } =*/

	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			hasModifyValue = !!series.modifyValue,
			translatedOLC = ['plotOpen', 'yBottom', 'plotClose'];

		seriesTypes.column.prototype.translate.apply(series);

		// Do the translation
		each(series.points, function (point) {
			each([point.open, point.low, point.close], function (value, i) {
				if (value !== null) {
					if (hasModifyValue) {
						value = series.modifyValue(value);
					}
					point[translatedOLC[i]] = yAxis.toPixels(value, true);
				}
			});
		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,
			points = series.points,
			chart = series.chart;


		each(points, function (point) {
			var plotOpen,
				plotClose,
				crispCorr,
				halfWidth,
				path,
				graphic = point.graphic,
				crispX,
				isNew = !graphic;

			if (point.plotY !== undefined) {

				// Create and/or update the graphic
				if (!graphic) {
					point.graphic = graphic = chart.renderer.path()
						.add(series.group);
				}

				/*= if (build.classic) { =*/
				graphic.attr(series.pointAttribs(point, point.selected && 'select')); // #3897
				/*= } =*/

				// crisp vector coordinates
				crispCorr = (graphic.strokeWidth() % 2) / 2;
				crispX = Math.round(point.plotX) - crispCorr;  // #2596
				halfWidth = Math.round(point.shapeArgs.width / 2);

				// the vertical stem
				path = [
					'M',
					crispX, Math.round(point.yBottom),
					'L',
					crispX, Math.round(point.plotY)
				];

				// open
				if (point.open !== null) {
					plotOpen = Math.round(point.plotOpen) + crispCorr;
					path.push(
						'M',
						crispX,
						plotOpen,
						'L',
						crispX - halfWidth,
						plotOpen
					);
				}

				// close
				if (point.close !== null) {
					plotClose = Math.round(point.plotClose) + crispCorr;
					path.push(
						'M',
						crispX,
						plotClose,
						'L',
						crispX + halfWidth,
						plotClose
					);
				}

				graphic[isNew ? 'attr' : 'animate']({ d: path })
					.addClass(point.getClassName(), true);

			}


		});

	},

	animate: null // Disable animation

/**
 * @constructor seriesTypes.ohlc.prototype.pointClass
 * @extends {Point}
 */
}, /** @lends seriesTypes.ohlc.prototype.pointClass.prototype */ {
	/**
 	 * Extend the parent method by adding up or down to the class name.
 	 */
	getClassName: function () {
		return Point.prototype.getClassName.call(this) +
			(this.open < this.close ? ' highcharts-point-up' : ' highcharts-point-down');
	}
});
/* ****************************************************************************
 * End OHLC series code													   *
 *****************************************************************************/
