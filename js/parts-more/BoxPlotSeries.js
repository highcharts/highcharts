/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
var each = H.each,
	noop = H.noop,
	pick = H.pick,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

/**
 * The boxplot series type.
 *
 * @constructor seriesTypes.boxplot
 * @augments seriesTypes.column
 */
seriesType('boxplot', 'column', {
	threshold: null,
	tooltip: {
		/*= if (!build.classic) { =*/
		pointFormat: '<span class="highcharts-color-{point.colorIndex}">\u25CF</span> <b> {series.name}</b><br/>' +
			'Maximum: {point.high}<br/>' +
			'Upper quartile: {point.q3}<br/>' +
			'Median: {point.median}<br/>' +
			'Lower quartile: {point.q1}<br/>' +
			'Minimum: {point.low}<br/>',
		/*= } else { =*/
		pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' + // eslint-disable-line no-dupe-keys
			'Maximum: {point.high}<br/>' +
			'Upper quartile: {point.q3}<br/>' +
			'Median: {point.median}<br/>' +
			'Lower quartile: {point.q1}<br/>' +
			'Minimum: {point.low}<br/>'
		/*= } =*/
	},
	whiskerLength: '50%',
	/*= if (build.classic) { =*/
	fillColor: '${palette.backgroundColor}',
	lineWidth: 1,
	//medianColor: null,
	medianWidth: 2,
	states: {
		hover: {
			brightness: -0.3
		}
	},
	//stemColor: null,
	//stemDashStyle: 'solid'
	//stemWidth: null,

	//whiskerColor: null,
	whiskerWidth: 2
	/*= } =*/

}, /** @lends seriesTypes.boxplot */ {
	pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.low, point.q1, point.median, point.q3, point.high];
	},
	pointValKey: 'high', // defines the top of the tracker

	/*= if (build.classic) { =*/
	/**
	 * Get presentational attributes
	 */
	pointAttribs: function (point) {
		var options = this.options,
			color = (point && point.color) || this.color;

		return {
			'fill': point.fillColor || options.fillColor || color,
			'stroke': options.lineColor || color,
			'stroke-width': options.lineWidth || 0
		};
	},
	/*= } =*/

	/**
	 * Disable data labels for box plot
	 */
	drawDataLabels: noop,

	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			pointArrayMap = series.pointArrayMap;

		seriesTypes.column.prototype.translate.apply(series);

		// do the translation on each point dimension
		each(series.points, function (point) {
			each(pointArrayMap, function (key) {
				if (point[key] !== null) {
					point[key + 'Plot'] = yAxis.translate(point[key], 0, 1, 0, 1);
				}
			});
		});
	},

	setStackedPoints: noop // #3890


}, {
	render: function () {
		var point = this,
			series = point.series,
			options = series.options,
			chart = series.chart,
			renderer = chart.renderer,
			q1Plot,
			q3Plot,
			highPlot,
			lowPlot,
			medianPlot,
			medianPath,
			crispCorr,
			crispX = 0,
			boxPath,
			width,
			left,
			right,
			halfWidth,
			doQuartiles = series.doQuartiles !== false, // error bar inherits this series type but doesn't do quartiles
			pointWiskerLength,
			whiskerLength = series.options.whiskerLength,
			graphic = point.graphic,
			verb = graphic ? 'animate' : 'attr',
			shapeArgs = point.shapeArgs; // the box

		/*= if (build.classic) { =*/
		var boxAttr,
			stemAttr = {},
			whiskersAttr = {},
			medianAttr = {},
			color = point.color || series.color;
		/*= } =*/

		if (point.plotY !== undefined) {

			// crisp vector coordinates
			width = shapeArgs.width;
			left = Math.floor(shapeArgs.x);
			right = left + width;
			halfWidth = Math.round(width / 2);
			q1Plot = Math.floor(doQuartiles ? point.q1Plot : point.lowPlot);
			q3Plot = Math.floor(doQuartiles ? point.q3Plot : point.lowPlot);
			highPlot = Math.floor(point.highPlot);
			lowPlot = Math.floor(point.lowPlot);

			if (!graphic) {
				point.graphic = graphic = renderer.g('point')
					.add(series.group);

				point.stem = renderer.path()
					.addClass('highcharts-boxplot-stem')
					.add(graphic);

				if (whiskerLength) {
					point.whiskers = renderer.path()
						.addClass('highcharts-boxplot-whisker')
						.add(graphic);
				}
				if (doQuartiles) {
					point.box = renderer.path(boxPath)
						.addClass('highcharts-boxplot-box')
						.add(graphic);
				}
				point.medianShape = renderer.path(medianPath)
					.addClass('highcharts-boxplot-median')
					.add(graphic);


				/*= if (build.classic) { =*/

				// Stem attributes
				stemAttr.stroke = point.stemColor || options.stemColor || color;
				stemAttr['stroke-width'] = pick(point.stemWidth, options.stemWidth, options.lineWidth);
				stemAttr.dashstyle = point.stemDashStyle || options.stemDashStyle;
				point.stem.attr(stemAttr);

				// Whiskers attributes
				if (whiskerLength) {
					whiskersAttr.stroke = point.whiskerColor || options.whiskerColor || color;
					whiskersAttr['stroke-width'] = pick(point.whiskerWidth, options.whiskerWidth, options.lineWidth);
					point.whiskers.attr(whiskersAttr);
				}

				if (doQuartiles) {
					boxAttr = series.pointAttribs(point);
					point.box.attr(boxAttr);
				}


				// Median attributes
				medianAttr.stroke = point.medianColor || options.medianColor || color;
				medianAttr['stroke-width'] = pick(point.medianWidth, options.medianWidth, options.lineWidth);
				point.medianShape.attr(medianAttr);

				/*= } =*/
			}



			// The stem
			crispCorr = (point.stem.strokeWidth() % 2) / 2;
			crispX = left + halfWidth + crispCorr;
			point.stem[verb]({ d: [
				// stem up
				'M',
				crispX, q3Plot,
				'L',
				crispX, highPlot,

				// stem down
				'M',
				crispX, q1Plot,
				'L',
				crispX, lowPlot
			] });

			// The box
			if (doQuartiles) {
				crispCorr = (point.box.strokeWidth() % 2) / 2;
				q1Plot = Math.floor(q1Plot) + crispCorr;
				q3Plot = Math.floor(q3Plot) + crispCorr;
				left += crispCorr;
				right += crispCorr;
				point.box[verb]({ d: [
					'M',
					left, q3Plot,
					'L',
					left, q1Plot,
					'L',
					right, q1Plot,
					'L',
					right, q3Plot,
					'L',
					left, q3Plot,
					'z'
				] });
			}

			// The whiskers
			if (whiskerLength) {
				crispCorr = (point.whiskers.strokeWidth() % 2) / 2;
				highPlot = highPlot + crispCorr;
				lowPlot = lowPlot + crispCorr;
				pointWiskerLength = (/%$/).test(whiskerLength) ? halfWidth * parseFloat(whiskerLength) / 100 : whiskerLength / 2;
				point.whiskers[verb]({ d: [
					// High whisker
					'M',
					crispX - pointWiskerLength,
					highPlot,
					'L',
					crispX + pointWiskerLength,
					highPlot,

					// Low whisker
					'M',
					crispX - pointWiskerLength,
					lowPlot,
					'L',
					crispX + pointWiskerLength,
					lowPlot
				] });
			}

			// The median
			medianPlot = Math.round(point.medianPlot);
			crispCorr = (point.medianShape.strokeWidth() % 2) / 2;
			medianPlot = medianPlot + crispCorr;

			point.medianShape[verb]({ d: [
				'M',
				left,
				medianPlot,
				'L',
				right,
				medianPlot
			] });
		}
	}
});

/* ****************************************************************************
 * End Box plot series code												*
 *****************************************************************************/
