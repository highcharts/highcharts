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


/**
 * A heatmap is a graphical representation of data where the individual values
 * contained in a matrix are represented as colors.
 *
 * @sample highcharts/demo/heatmap/
 *         Simple heatmap
 * @sample highcharts/demo/heatmap-canvas/
 *         Heavy heatmap
 * @extends {plotOptions.scatter}
 * @product highcharts highmaps
 * @optionparent plotOptions.heatmap
 */
seriesType('heatmap', 'scatter', {

	/**
	 */
	animation: false,

	/**
	 */
	borderWidth: 0,

	/**
	 * The main color of the series. In heat maps this color is rarely used,
	 * as we mostly use the color to denote the value of each point. Unless
	 * options are set in the [colorAxis](#colorAxis), the default value
	 * is pulled from the [options.colors](#colors) array.
	 * 
	 * @type {Color}
	 * @default null
	 * @since 4.0
	 * @product highcharts
	 * @apioption plotOptions.heatmap.color
	 */

	/**
	 * The column size - how many X axis units each column in the heatmap
	 * should span.
	 * 
	 * @type {Number}
	 * @sample {highcharts} maps/demo/heatmap/ One day
	 * @sample {highmaps} maps/demo/heatmap/ One day
	 * @default 1
	 * @since 4.0
	 * @product highcharts highmaps
	 * @apioption plotOptions.heatmap.colsize
	 */
	
	/*= if (build.classic) { =*/

	/**
	 */
	nullColor: '${palette.neutralColor3}',
	/*= } =*/

	/**
	 */
	dataLabels: {

		/**
		 */
		formatter: function () { // #2945
			return this.point.value;
		},

		/**
		 */
		inside: true,

		/**
		 */
		verticalAlign: 'middle',

		/**
		 */
		crop: false,

		/**
		 */
		overflow: false,

		/**
		 */
		padding: 0 // #3837
	},

	/**
	 */
	marker: null,

	/**
	 */
	pointRange: null, // dynamically set to colsize by default

	/**
	 * The row size - how many Y axis units each heatmap row should span.
	 * 
	 * @type {Number}
	 * @sample {highcharts} maps/demo/heatmap/ 1 by default
	 * @sample {highmaps} maps/demo/heatmap/ 1 by default
	 * @default 1
	 * @since 4.0
	 * @product highcharts highmaps
	 * @apioption plotOptions.heatmap.rowsize
	 */

	/**
	 */
	tooltip: {

		/**
		 */
		pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
	},

	/**
	 */
	states: {

		/**
		 */
		normal: {

			/**
			 */
			animation: true
		},

		/**
		 */
		hover: {

			/**
			 */
			halo: false,  // #3406, halo is not required on heatmaps

			/**
			 */
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
/**
 * A `heatmap` series. If the [type](#series<heatmap>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * heatmap](#plotOptions.heatmap).
 * 
 * @type {Object}
 * @extends series,plotOptions.heatmap
 * @excluding dataParser,dataURL,stack
 * @product highcharts highmaps
 * @apioption series.heatmap
 */

/**
 * An array of data points for the series. For the `heatmap` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,value`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 *     [0, 9, 7],
 *     [1, 10, 4],
 *     [2, 6, 3]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<heatmap>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 *     x: 1,
 *     y: 3,
 *     value: 10,
 *     name: "Point2",
 *     color: "#00FF00"
 * }, {
 *     x: 1,
 *     y: 7,
 *     value: 10,
 *     name: "Point1",
 *     color: "#FF00FF"
 * }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<line>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highmaps
 * @apioption series.heatmap.data
 */

/**
 * The color of the point. In heat maps the point color is rarely set
 * explicitly, as we use the color to denote the `value`. Options for
 * this are set in the [colorAxis](#colorAxis) configuration.
 * 
 * @type {Color}
 * @product highcharts highmaps
 * @apioption series.heatmap.data.color
 */

/**
 * The value of the point, resulting in a color controled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 * 
 * @type {Number}
 * @product highcharts highmaps
 * @apioption series.heatmap.data.value
 */

/**
 * The x coordinate of the point.
 * 
 * @type {Number}
 * @product highmaps
 * @apioption series.heatmap.data.x
 */

/**
 * The y coordinate of the point.
 * 
 * @type {Number}
 * @product highmaps
 * @apioption series.heatmap.data.y
 */
