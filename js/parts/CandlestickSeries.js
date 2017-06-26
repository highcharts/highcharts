/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var defaultPlotOptions = H.defaultPlotOptions,
	each = H.each,
	merge = H.merge,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

/**
 * @extends {plotOptions.ohlc}
 * @products highstock
 * @optionparent plotOptions.candlestick
 */
var candlestickOptions = {

	/**
	 */
	states: {

		/**
		 * @extends plotOptions.column.states.hover
		 * @product highstock
		 */
		hover: {

			/**
			 * The pixel width of the line/border around the candlestick. Defaults
			 * to `2`.
			 * 
			 * @type {Number}
			 * @default 2
			 * @product highstock
			 */
			lineWidth: 2
		}
	},

	/**
	 */
	tooltip: defaultPlotOptions.ohlc.tooltip,

	/**
	 */
	threshold: null,
	/*= if (build.classic) { =*/

	/**
	 * The color of the line/border of the candlestick.
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the line stroke can be set with the `.highcharts-
	 * candlestick-series .highcahrts-point` rule.
	 * 
	 * @type {Color}
	 * @see [upLineColor](#plotOptions.candlestick.upLineColor)
	 * @sample {highstock} stock/plotoptions/candlestick-linecolor/ Candlestick line colors
	 * @default #000000
	 * @product highstock
	 */
	lineColor: '${palette.neutralColor100}',

	/**
	 * The pixel width of the candlestick line/border. Defaults to `1`.
	 * 
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the line stroke width can be set with the `.
	 * highcharts-candlestick-series .highcahrts-point` rule.
	 * 
	 * @type {Number}
	 * @default 1
	 * @product highstock
	 */
	lineWidth: 1,

	/**
	 * The fill color of the candlestick when values are rising.
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the up color can be set with the `.highcharts-
	 * candlestick-series .highcharts-point-up` rule.
	 * 
	 * @type {Color}
	 * @sample {highstock} stock/plotoptions/candlestick-color/ Custom colors
	 * @sample {highstock} highcharts/css/candlestick/ Colors in styled mode
	 * @default #ffffff
	 * @product highstock
	 */
	upColor: '${palette.backgroundColor}',

	/**
	 */
	stickyTracking: true
	// upLineColor: null
	/*= } =*/

};

/**
 * The candlestick series type.
 *
 * @constructor seriesTypes.candlestick
 * @augments seriesTypes.ohlc
 */
seriesType('candlestick', 'ohlc', merge(
	defaultPlotOptions.column, 
	candlestickOptions
), /** @lends seriesTypes.candlestick */ {
	/*= if (build.classic) { =*/
	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	pointAttribs: function (point, state) {
		var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state),
			options = this.options,
			isUp = point.open < point.close,
			stroke = options.lineColor || this.color,
			stateOptions;

		attribs['stroke-width'] = options.lineWidth;

		attribs.fill = point.options.color || (isUp ? (options.upColor || this.color) : this.color);
		attribs.stroke = point.lineColor || (isUp ? (options.upLineColor || stroke) : stroke);

		// Select or hover states
		if (state) {
			stateOptions = options.states[state];
			attribs.fill = stateOptions.color || attribs.fill;
			attribs.stroke = stateOptions.lineColor || attribs.stroke;
			attribs['stroke-width'] =
				stateOptions.lineWidth || attribs['stroke-width'];
		}


		return attribs;
	},
	/*= } =*/
	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,  //state = series.state,
			points = series.points,
			chart = series.chart;


		each(points, function (point) {

			var graphic = point.graphic,
				plotOpen,
				plotClose,
				topBox,
				bottomBox,
				hasTopWhisker,
				hasBottomWhisker,
				crispCorr,
				crispX,
				path,
				halfWidth,
				isNew = !graphic;

			if (point.plotY !== undefined) {

				if (!graphic) {
					point.graphic = graphic = chart.renderer.path()
						.add(series.group);
				}

				/*= if (build.classic) { =*/
				graphic
					.attr(series.pointAttribs(point, point.selected && 'select')) // #3897
					.shadow(series.options.shadow);
				/*= } =*/

				// Crisp vector coordinates
				crispCorr = (graphic.strokeWidth() % 2) / 2;
				crispX = Math.round(point.plotX) - crispCorr; // #2596
				plotOpen = point.plotOpen;
				plotClose = point.plotClose;
				topBox = Math.min(plotOpen, plotClose);
				bottomBox = Math.max(plotOpen, plotClose);
				halfWidth = Math.round(point.shapeArgs.width / 2);
				hasTopWhisker = Math.round(topBox) !== Math.round(point.plotHigh);
				hasBottomWhisker = bottomBox !== point.yBottom;
				topBox = Math.round(topBox) + crispCorr;
				bottomBox = Math.round(bottomBox) + crispCorr;

				// Create the path. Due to a bug in Chrome 49, the path is first instanciated
				// with no values, then the values pushed. For unknown reasons, instanciated
				// the path array with all the values would lead to a crash when updating
				// frequently (#5193).
				path = [];
				path.push(
					'M',
					crispX - halfWidth, bottomBox,
					'L',
					crispX - halfWidth, topBox,
					'L',
					crispX + halfWidth, topBox,
					'L',
					crispX + halfWidth, bottomBox,
					'Z', // Use a close statement to ensure a nice rectangle #2602
					'M',
					crispX, topBox,
					'L',
					crispX, hasTopWhisker ? Math.round(point.plotHigh) : topBox, // #460, #2094
					'M',
					crispX, bottomBox,
					'L',
					crispX, hasBottomWhisker ? Math.round(point.yBottom) : bottomBox // #460, #2094
				);

				graphic[isNew ? 'attr' : 'animate']({ d: path })
					.addClass(point.getClassName(), true);

			}
		});

	}


});

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/
