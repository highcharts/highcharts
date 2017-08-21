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
 * A candlestick chart is a style of financial chart used to describe price
 * movements over time.
 *
 * @sample stock/demo/candlestick/ Candlestick chart
 * 
 * @extends {plotOptions.ohlc}
 * @excluding borderColor,borderRadius,borderWidth
 * @product highstock
 * @optionparent plotOptions.candlestick
 */
var candlestickOptions = {

	/**
	 * The method of approximation inside a group. When for example 30 days
	 * are grouped into one month, this determines what value should represent
	 * the group. Possible values are "average", "open", "high", "low",
	 * "close" and "sum". For OHLC and candlestick series the approximation
	 * is "ohlc" by default, which finds the open, high, low and close values
	 * within all the grouped data.
	 * 
	 * Custom aggregate methods can be added by assigning a callback function
	 * as the approximation. This function takes a numeric array as the
	 * argument and should return a single numeric value or `null`. Note
	 * that the numeric array will never contain null values, only true
	 * numbers. Instead, if null values are present in the raw data, the
	 * numeric array will have an `.hasNulls` property set to `true`. For
	 * single-value data sets the data is available in the first argument
	 * of the callback function. For OHLC data sets, all the open values
	 * are in the first argument, all high values in the second etc.
	 * 
	 * @type {String|Function}
	 * @default ohlc
	 * @product highstock
	 * @apioption plotOptions.candlestick.dataGrouping.approximation
	 */

	states: {

		/**
		 * @extends plotOptions.column.states.hover
		 * @product highstock
		 */
		hover: {

			/**
			 * The pixel width of the line/border around the candlestick.
			 * 
			 * @type {Number}
			 * @default 2
			 * @product highstock
			 */
			lineWidth: 2
		}
	},

	/**
	 * @extends {plotOptions.ohlc.tooltip}
	 */
	tooltip: defaultPlotOptions.ohlc.tooltip,

	threshold: null,
	/*= if (build.classic) { =*/

	/**
	 * The color of the line/border of the candlestick.
	 * 
	 * In styled mode, the line stroke can be set with the `.highcharts-
	 * candlestick-series .highcahrts-point` rule.
	 * 
	 * @type {Color}
	 * @see [upLineColor](#plotOptions.candlestick.upLineColor)
	 * @sample {highstock} stock/plotoptions/candlestick-linecolor/
	 *         Candlestick line colors
	 * @default #000000
	 * @product highstock
	 */
	lineColor: '${palette.neutralColor100}',

	/**
	 * The pixel width of the candlestick line/border. Defaults to `1`.
	 * 
	 * 
	 * In styled mode, the line stroke width can be set with the `.
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
	 * In styled mode, the up color can be set with the `.highcharts-
	 * candlestick-series .highcharts-point-up` rule.
	 * 
	 * @type {Color}
	 * @sample {highstock} stock/plotoptions/candlestick-color/ Custom colors
	 * @sample {highstock} highcharts/css/candlestick/ Colors in styled mode
	 * @default #ffffff
	 * @product highstock
	 */
	upColor: '${palette.backgroundColor}',

	stickyTracking: true
	
	/**
	 * The specific line color for up candle sticks. The default is to inherit
	 * the general `lineColor` setting.
	 * 
	 * @type {Color}
	 * @sample {highstock} stock/plotoptions/candlestick-linecolor/ Candlestick line colors
	 * @default null
	 * @since 1.3.6
	 * @product highstock
	 * @apioption plotOptions.candlestick.upLineColor
	 */
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

/**
 * A `candlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](#chart.
 * type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * candlestick](#plotOptions.candlestick).
 * 
 * @type {Object}
 * @extends series,plotOptions.candlestick
 * @excluding dataParser,dataURL
 * @product highstock
 * @apioption series.candlestick
 */

/**
 * An array of data points for the series. For the `candlestick` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 5 or 4 values. In this case, the values
 * correspond to `x,open,high,low,close`. If the first value is a string,
 * it is applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 4\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 *  ```js
 *     data: [
 *         [0, 7, 2, 0, 4],
 *         [1, 1, 4, 2, 8],
 *         [2, 3, 3, 9, 3]
 *     ]
 *  ```
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.candlestick.
 * turboThreshold), this option is not available.
 * 
 *  ```js
 *     data: [{
 *         x: 1,
 *         open: 9,
 *         high: 2,
 *         low: 4,
 *         close: 6,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         open: 1,
 *         high: 4,
 *         low: 7,
 *         close: 7,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 * 
 * @type {Array<Object|Array>}
 * @extends series.ohlc.data
 * @excluding y
 * @product highstock
 * @apioption series.candlestick.data
 */
