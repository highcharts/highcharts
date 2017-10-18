/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Color.js';
import './Options.js';
import './Tick.js';

var addEvent = H.addEvent,
	animObject = H.animObject,
	arrayMax = H.arrayMax,
	arrayMin = H.arrayMin,
	color = H.color,
	correctFloat = H.correctFloat,
	defaultOptions = H.defaultOptions,
	defined = H.defined,
	deg2rad = H.deg2rad,
	destroyObjectProperties = H.destroyObjectProperties,
	each = H.each,
	extend = H.extend,
	fireEvent = H.fireEvent,
	format = H.format,
	getMagnitude = H.getMagnitude,
	grep = H.grep,
	inArray = H.inArray,
	isArray = H.isArray,
	isNumber = H.isNumber,
	isString = H.isString,
	merge = H.merge,
	normalizeTickInterval = H.normalizeTickInterval,
	objectEach = H.objectEach,
	pick = H.pick,
	removeEvent = H.removeEvent,
	splat = H.splat,
	syncTimeout = H.syncTimeout,
	Tick = H.Tick;
	
/**
 * Create a new axis object. Called internally when instanciating a new chart or
 * adding axes by {@link Highcharts.Chart#addAxis}.
 *
 * A chart can have from 0 axes (pie chart) to multiples. In a normal, single
 * series cartesian chart, there is one X axis and one Y axis.
 * 
 * The X axis or axes are referenced by {@link Highcharts.Chart.xAxis}, which is
 * an array of Axis objects. If there is only one axis, it can be referenced
 * through `chart.xAxis[0]`, and multiple axes have increasing indices. The same
 * pattern goes for Y axes.
 * 
 * If you need to get the axes from a series object, use the `series.xAxis` and
 * `series.yAxis` properties. These are not arrays, as one series can only be
 * associated to one X and one Y axis.
 * 
 * A third way to reference the axis programmatically is by `id`. Add an `id` in
 * the axis configuration options, and get the axis by
 * {@link Highcharts.Chart#get}.
 * 
 * Configuration options for the axes are given in options.xAxis and
 * options.yAxis.
 * 
 * @class Highcharts.Axis
 * @memberOf Highcharts
 * @param {Highcharts.Chart} chart - The Chart instance to apply the axis on.
 * @param {Object} options - Axis options
 */
var Axis = function () {
	this.init.apply(this, arguments);
};

H.extend(Axis.prototype, /** @lends Highcharts.Axis.prototype */{

	/**
	 * The X axis or category axis. Normally this is the horizontal axis,
	 * though if the chart is inverted this is the vertical axis. In case of
	 * multiple axes, the xAxis node is an array of configuration objects.
	 * 
	 * See [the Axis object](#Axis) for programmatic access to the axis.
	 *
	 * @productdesc {highmaps}
	 * In Highmaps, the axis is hidden, but it is used behind the scenes to
	 * control features like zooming and panning. Zooming is in effect the same
	 * as setting the extremes of one of the exes.
	 * 
	 * @optionparent xAxis
	 */
	defaultOptions: {
		// allowDecimals: null,
		// alternateGridColor: null,
		// categories: [],

		/**
		 * For a datetime axis, the scale will automatically adjust to the
		 * appropriate unit. This member gives the default string
		 * representations used for each unit. For intermediate values,
		 * different units may be used, for example the `day` unit can be used
		 * on midnight and `hour` unit be used for intermediate values on the
		 * same axis. For an overview of the replacement codes, see
		 * [dateFormat](#Highcharts.dateFormat). Defaults to:
		 * 
		 * <pre>{
		 *     millisecond: '%H:%M:%S.%L',
		 *     second: '%H:%M:%S',
		 *     minute: '%H:%M',
		 *     hour: '%H:%M',
		 *     day: '%e. %b',
		 *     week: '%e. %b',
		 *     month: '%b \'%y',
		 *     year: '%Y'
		 * }</pre>
		 * 
		 * @type {Object}
		 * @sample {highcharts} highcharts/xaxis/datetimelabelformats/
		 *         Different day format on X axis
		 * @sample {highstock} stock/xaxis/datetimelabelformats/
		 *         More information in x axis labels
		 * @product highcharts highstock
		 */
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%e. %b',
			week: '%e. %b',
			month: '%b \'%y',
			year: '%Y'
		},

		/**
		 * Whether to force the axis to end on a tick. Use this option with
		 * the `maxPadding` option to control the axis end.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/chart/reflow-true/ True by default
		 * @sample {highcharts} highcharts/yaxis/endontick/ False
		 * @sample {highstock} stock/demo/basic-line/ True by default
		 * @sample {highstock} stock/xaxis/endontick/ False
		 * @default false
		 * @since 1.2.0
		 */
		endOnTick: false,
		// reversed: false,


		/**
		 * The axis labels show the number or category for each tick.
		 *
		 * @productdesc {highmaps}
		 * X and Y axis labels are by default disabled in Highmaps, but the
		 * functionality is inherited from Highcharts and used on `colorAxis`,
		 * and can be enabled on X and Y axes too.
		 */
		labels: {

			/**
			 * Enable or disable the axis labels.
			 * 
			 * @type {Boolean}
			 * @sample  {highcharts} highcharts/xaxis/labels-enabled/
			 *          X axis labels disabled
			 * @sample  {highstock} stock/xaxis/labels-enabled/
			 *          X axis labels disabled
			 * @default {highstock} true
			 * @default {highmaps} false
			 */
			enabled: true,
			// rotation: 0,
			// align: 'center',
			// step: null,
			/*= if (build.classic) { =*/

			/**
			 * CSS styles for the label. Use `whiteSpace: 'nowrap'` to prevent
			 * wrapping of category labels. Use `textOverflow: 'none'` to
			 * prevent ellipsis (dots).
			 * 
			 * In styled mode, the labels are styled with the
			 * `.highcharts-axis-labels` class.
			 * 
			 * @type {CSSObject}
			 * @sample  {highcharts} highcharts/xaxis/labels-style/
			 *          Red X axis labels
			 */
			style: {
				color: '${palette.neutralColor60}',
				cursor: 'default',
				fontSize: '11px'
			},
			/*= } =*/

			/**
			 * The x position offset of the label relative to the tick position
			 * on the axis.
			 * 
			 * @type {Number}
			 * @sample  {highcharts} highcharts/xaxis/labels-x/
			 *          Y axis labels placed on grid lines
			 * @default 0
			 */
			x: 0
		},
		
		/**
		 * Padding of the min value relative to the length of the axis. A
		 * padding of 0.05 will make a 100px axis 5px longer. This is useful
		 * when you don't want the lowest data value to appear on the edge
		 * of the plot area. When the axis' `min` option is set or a min extreme
		 * is set using `axis.setExtremes()`, the minPadding will be ignored.
		 * 
		 * @type {Number}
		 * @sample  {highcharts} highcharts/yaxis/minpadding/
		 *          Min padding of 0.2
		 * @sample  {highstock} stock/xaxis/minpadding-maxpadding/
		 *          Greater min- and maxPadding
		 * @sample  {highmaps} maps/chart/plotbackgroundcolor-gradient/
		 *          Add some padding
		 * @default {highcharts} 0.01
		 * @default {highstock} 0
		 * @default {highmaps} 0
		 * @since 1.2.0
		 */
		minPadding: 0.01,

		/**
		 * Padding of the max value relative to the length of the axis. A
		 * padding of 0.05 will make a 100px axis 5px longer. This is useful
		 * when you don't want the highest data value to appear on the edge
		 * of the plot area. When the axis' `max` option is set or a max extreme
		 * is set using `axis.setExtremes()`, the maxPadding will be ignored.
		 * 
		 * @type {Number}
		 * @sample  {highcharts} highcharts/yaxis/maxpadding/
		 *          Max padding of 0.25 on y axis
		 * @sample  {highstock} stock/xaxis/minpadding-maxpadding/
		 *          Greater min- and maxPadding
		 * @sample  {highmaps} maps/chart/plotbackgroundcolor-gradient/
		 *          Add some padding
		 * @default {highcharts} 0.01
		 * @default {highstock} 0
		 * @default {highmaps} 0
		 * @since 1.2.0
		 */
		maxPadding: 0.01,
		
		/**
		 * The pixel length of the minor tick marks.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/minorticklength/ 10px on Y axis
		 * @sample {highstock} stock/xaxis/minorticks/ 10px on Y axis
		 * @default 2
		 */
		minorTickLength: 2,

		/**
		 * The position of the minor tick marks relative to the axis line.
		 *  Can be one of `inside` and `outside`.
		 * 
		 * @validvalue ["inside", "outside"]
		 * @type {String}
		 * @sample  {highcharts} highcharts/yaxis/minortickposition-outside/
		 *          Outside by default
		 * @sample  {highcharts} highcharts/yaxis/minortickposition-inside/
		 *          Inside
		 * @sample  {highstock} stock/xaxis/minorticks/ Inside
		 * @default outside
		 */
		minorTickPosition: 'outside', // inside or outside
		
		/**
		 * For datetime axes, this decides where to put the tick between weeks.
		 *  0 = Sunday, 1 = Monday.
		 * 
		 * @type {Number}
		 * @sample  {highcharts} highcharts/xaxis/startofweek-monday/
		 *          Monday by default
		 * @sample  {highcharts} highcharts/xaxis/startofweek-sunday/
		 *          Sunday
		 * @sample  {highstock} stock/xaxis/startofweek-1
		 *          Monday by default
		 * @sample  {highstock} stock/xaxis/startofweek-0
		 *          Sunday
		 * @default 1
		 * @product highcharts highstock
		 */
		startOfWeek: 1,

		/**
		 * Whether to force the axis to start on a tick. Use this option with
		 * the `minPadding` option to control the axis start.
		 *
		 * @productdesc {highstock}
		 * In Highstock, `startOnTick` is always false when the navigator is
		 * enabled, to prevent jumpy scrolling.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/xaxis/startontick-false/
		 *         False by default
		 * @sample {highcharts} highcharts/xaxis/startontick-true/
		 *         True
		 * @sample {highstock} stock/xaxis/endontick/
		 *         False for Y axis
		 * @default false
		 * @since 1.2.0
		 */
		startOnTick: false,
		
		/**
		 * The pixel length of the main tick marks.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/xaxis/ticklength/
		 *         20 px tick length on the X axis
		 * @sample {highstock} stock/xaxis/ticks/
		 *         Formatted ticks on X axis
		 * @default 10
		 */
		tickLength: 10,

		/**
		 * For categorized axes only. If `on` the tick mark is placed in the
		 * center of the category, if `between` the tick mark is placed between
		 * categories. The default is `between` if the `tickInterval` is 1,
		 *  else `on`.
		 * 
		 * @validvalue [null, "on", "between"]
		 * @type {String}
		 * @sample {highcharts} highcharts/xaxis/tickmarkplacement-between/
		 *         "between" by default
		 * @sample {highcharts} highcharts/xaxis/tickmarkplacement-on/
		 *         "on"
		 * @default null
		 * @product highcharts
		 */
		tickmarkPlacement: 'between', // on or between

		/**
		 * If tickInterval is `null` this option sets the approximate pixel
		 * interval of the tick marks. Not applicable to categorized axis.
		 * 
		 * 
		 * The tick interval is also influenced by the [minTickInterval](#xAxis.
		 * minTickInterval) option, that, by default prevents ticks from being
		 * denser than the data points.
		 * 
		 * Defaults to `72` for the Y axis and `100` for the X axis.
		 * 
		 * @type {Number}
		 * @see    [tickInterval](#xAxis.tickInterval),
		 *         [tickPositioner](#xAxis.tickPositioner),
		 *         [tickPositions](#xAxis.tickPositions).
		 * @sample {highcharts} highcharts/xaxis/tickpixelinterval-50/
		 *         50 px on X axis
		 * @sample {highstock} stock/xaxis/tickpixelinterval/
		 *         200 px on X axis
		 */
		tickPixelInterval: 100,

		/**
		 * The position of the major tick marks relative to the axis line.
		 *  Can be one of `inside` and `outside`.
		 * 
		 * @validvalue ["inside", "outside"]
		 * @type {String}
		 * @sample {highcharts} highcharts/xaxis/tickposition-outside/
		 *         "outside" by default
		 * @sample {highcharts} highcharts/xaxis/tickposition-inside/
		 *         "inside"
		 * @sample {highstock} stock/xaxis/ticks/
		 *         Formatted ticks on X axis
		 * @default {highcharts} outside
		 * @default {highstock} "outside"
		 * @default {highmaps} outside
		 */
		tickPosition: 'outside',

		/**
		 * The axis title, showing next to the axis line.
		 *
		 * @productdesc {highmaps}
		 * In Highmaps, the axis is hidden by default, but adding an axis title
		 * is still possible. X axis and Y axis titles will appear at the bottom
		 * and left by default.
		 */
		title: {
			
			/**
			 * Alignment of the title relative to the axis values. Possible
			 * values are "low", "middle" or "high".
			 * 
			 * @validvalue ["low", "middle", "high"]
			 * @type {String}
			 * @sample {highcharts} highcharts/xaxis/title-align-low/
			 *         "low"
			 * @sample {highcharts} highcharts/xaxis/title-align-center/
			 *         "middle" by default
			 * @sample {highcharts} highcharts/xaxis/title-align-high/
			 *         "high"
			 * @sample {highcharts} highcharts/yaxis/title-offset/
			 *         Place the Y axis title on top of the axis
			 * @sample {highstock} stock/xaxis/title-align/
			 *         Aligned to "high" value
			 * @default {highcharts} middle
			 * @default {highstock} "middle"
			 * @default {highmaps} middle
			 */
			align: 'middle', // low, middle or high
			
			/*= if (build.classic) { =*/

			/**
			 * CSS styles for the title. If the title text is longer than the
			 * axis length, it will wrap to multiple lines by default. This can
			 * be customized by setting `textOverflow: 'ellipsis'`, by 
			 * setting a specific `width` or by setting `wordSpace: 'nowrap'`.
			 * 
			 * 
			 * In styled mode, the stroke width is given in the
			 * `.highcharts-axis-title` class.
			 * 
			 * @type {CSSObject}
			 * @sample {highcharts} highcharts/xaxis/title-style/ Red
			 * @sample {highcharts} highcharts/css/axis/ Styled mode
			 * @default { "color": "#666666" }
			 */
			style: {
				color: '${palette.neutralColor60}'
			}
			/*= } =*/
		},

		/**
		 * The type of axis. Can be one of `linear`, `logarithmic`, `datetime`
		 * or `category`. In a datetime axis, the numbers are given in
		 * milliseconds, and tick marks are placed on appropriate values like
		 * full hours or days. In a category axis, the 
		 * [point names](#series.line.data.name) of the chart's series are used
		 * for categories, if not a [categories](#xAxis.categories) array is
		 * defined.
		 * 
		 * @validvalue ["linear", "logarithmic", "datetime", "category"]
		 * @type {String}
		 * @sample {highcharts} highcharts/xaxis/type-linear/
		 *         Linear
		 * @sample {highcharts} highcharts/yaxis/type-log/
		 *         Logarithmic
		 * @sample {highcharts} highcharts/yaxis/type-log-minorgrid/
		 *         Logarithmic with minor grid lines
		 * @sample {highcharts} highcharts/xaxis/type-log-both/
		 *         Logarithmic on two axes
		 * @sample {highcharts} highcharts/yaxis/type-log-negative/
		 *         Logarithmic with extension to emulate negative values
		 * @default linear
		 * @product highcharts
		 */
		type: 'linear', // linear, logarithmic or datetime
		
		/*= if (build.classic) { =*/

		/**
		 * Color of the minor, secondary grid lines.
		 * 
		 * In styled mode, the stroke width is given in the
		 * `.highcharts-minor-grid-line` class.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/yaxis/minorgridlinecolor/
		 *         Bright grey lines from Y axis
		 * @sample {highcharts} highcharts/css/axis-grid/
		 *         Styled mode
		 * @sample {highstock} stock/xaxis/minorgridlinecolor/
		 *         Bright grey lines from Y axis
		 * @sample {highstock} highcharts/css/axis-grid/
		 *         Styled mode
		 * @default #f2f2f2
		 */
		minorGridLineColor: '${palette.neutralColor5}',
		// minorGridLineDashStyle: null,

		/**
		 * Width of the minor, secondary grid lines.
		 * 
		 * In styled mode, the stroke width is given in the
		 * `.highcharts-grid-line` class.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/minorgridlinewidth/
		 *         2px lines from Y axis
		 * @sample {highcharts} highcharts/css/axis-grid/
		 *         Styled mode
		 * @sample {highstock} stock/xaxis/minorgridlinewidth/
		 *         2px lines from Y axis
		 * @sample {highstock} highcharts/css/axis-grid/
		 *         Styled mode
		 * @default 1
		 */
		minorGridLineWidth: 1,

		/**
		 * Color for the minor tick marks.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/yaxis/minortickcolor/
		 *         Black tick marks on Y axis
		 * @sample {highstock} stock/xaxis/minorticks/
		 *         Black tick marks on Y axis
		 * @default #999999
		 */
		minorTickColor: '${palette.neutralColor40}',
		
		/**
		 * The color of the line marking the axis itself.
		 * 
		 * In styled mode, the line stroke is given in the
		 * `.highcharts-axis-line` or `.highcharts-xaxis-line` class.
		 * 
		 * @productdesc {highmaps}
		 * In Highmaps, the axis line is hidden by default.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/yaxis/linecolor/ A red line on Y axis
		 * @sample {highcharts} highcharts/css/axis/ Axes in styled mode
		 * @sample {highstock} stock/xaxis/linecolor/ A red line on X axis
		 * @sample {highstock} highcharts/css/axis/ Axes in styled mode
		 * @default #ccd6eb
		 */
		lineColor: '${palette.highlightColor20}',

		/**
		 * The width of the line marking the axis itself.
		 * 
		 * In styled mode, the stroke width is given in the
		 * `.highcharts-axis-line` or `.highcharts-xaxis-line` class.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/linecolor/ A 1px line on Y axis
		 * @sample {highcharts} highcharts/css/axis/ Axes in styled mode
		 * @sample {highstock} stock/xaxis/linewidth/ A 2px line on X axis
		 * @sample {highstock} highcharts/css/axis/ Axes in styled mode
		 * @default {highcharts} 1
		 * @default {highstock} 1
		 * @default {highmaps} 0
		 */
		lineWidth: 1,

		/**
		 * Color of the grid lines extending the ticks across the plot area.
		 * 
		 * In styled mode, the stroke is given in the `.highcharts-grid-line`
		 * class.
		 *
		 * @productdesc {highmaps}
		 * In Highmaps, the grid lines are hidden by default.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/yaxis/gridlinecolor/ Green lines
		 * @sample {highcharts} highcharts/css/axis-grid/ Styled mode
		 * @sample {highstock} stock/xaxis/gridlinecolor/ Green lines
		 * @sample {highstock} highcharts/css/axis-grid/ Styled mode
		 * @default #e6e6e6
		 */
		gridLineColor: '${palette.neutralColor10}',
		// gridLineDashStyle: 'solid',
		// gridLineWidth: 0,

		/**
		 * Color for the main tick marks.
		 * 
		 * In styled mode, the stroke is given in the `.highcharts-tick`
		 * class.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/xaxis/tickcolor/ Red ticks on X axis
		 * @sample {highcharts} highcharts/css/axis-grid/ Styled mode
		 * @sample {highstock} stock/xaxis/ticks/ Formatted ticks on X axis
		 * @sample {highstock} highcharts/css/axis-grid/ Styled mode
		 * @default #ccd6eb
		 */
		tickColor: '${palette.highlightColor20}'
		// tickWidth: 1
		/*= } =*/		
	},

	/**
	 * The Y axis or value axis. Normally this is the vertical axis,
	 * though if the chart is inverted this is the horizontal axis.
	 * In case of multiple axes, the yAxis node is an array of
	 * configuration objects.
	 *
	 * See [the Axis object](#Axis) for programmatic access to the axis.
	 * @extends xAxis
	 * @optionparent yAxis
	 */
	defaultYAxisOptions: {

		/**
		 * Whether to force the axis to end on a tick. Use this option with
		 * the `maxPadding` option to control the axis end.
		 *
		 * @productdesc {highstock}
		 * In Highstock, `endOnTick` is always false when the navigator is
		 * enabled, to prevent jumpy scrolling.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/chart/reflow-true/ True by default
		 * @sample {highcharts} highcharts/yaxis/endontick-false/ False
		 * @sample {highcharts} highcharts/yaxis/endontick-log-false/ False
		 * @sample {highstock} stock/demo/basic-line/ True by default
		 * @sample {highstock} stock/xaxis/endontick/ False
		 * @default true
		 * @since 1.2.0
		 * @product highcharts highstock
		 */
		endOnTick: true,

		tickPixelInterval: 72,

		/**
		 * Whether to show the last tick label. Defaults to `true` on cartesian
		 * charts, and `false` on polar charts.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/xaxis/showlastlabel-true/
		 *         Set to true on X axis
		 * @sample {highstock} stock/xaxis/showfirstlabel/
		 *         Labels below plot lines on Y axis
		 * @default false
		 * @product highcharts highstock
		 */
		showLastLabel: true,

		/**
		 * @extends xAxis.labels
		 */
		labels: {

			/**
			 * The x position offset of the label relative to the tick position
			 * on the axis. Defaults to -15 for left axis, 15 for right axis.
			 * 
			 * @type {Number}
			 * @sample {highcharts} highcharts/xaxis/labels-x/
			 *         Y axis labels placed on grid lines
			 * @default 0
			 */
			x: -8
		},

		/**
		 * Padding of the max value relative to the length of the axis. A
		 * padding of 0.05 will make a 100px axis 5px longer. This is useful
		 * when you don't want the highest data value to appear on the edge
		 * of the plot area. When the axis' `max` option is set or a max extreme
		 * is set using `axis.setExtremes()`, the maxPadding will be ignored.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/maxpadding-02/
		 *         Max padding of 0.2
		 * @sample {highstock} stock/xaxis/minpadding-maxpadding/
		 *         Greater min- and maxPadding
		 * @default 0.05
		 * @since 1.2.0
		 * @product highcharts highstock
		 */
		maxPadding: 0.05,

		/**
		 * Padding of the min value relative to the length of the axis. A
		 * padding of 0.05 will make a 100px axis 5px longer. This is useful
		 * when you don't want the lowest data value to appear on the edge
		 * of the plot area. When the axis' `min` option is set or a max extreme
		 * is set using `axis.setExtremes()`, the maxPadding will be ignored.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/minpadding/
		 *         Min padding of 0.2
		 * @sample {highstock} stock/xaxis/minpadding-maxpadding/
		 *         Greater min- and maxPadding
		 * @default 0.05
		 * @since 1.2.0
		 * @product highcharts highstock
		 */
		minPadding: 0.05,

		/**
		 * Whether to force the axis to start on a tick. Use this option with
		 * the `maxPadding` option to control the axis start.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/xaxis/startontick-false/
		 *         False by default
		 * @sample {highcharts} highcharts/xaxis/startontick-true/
		 *         True
		 * @sample {highstock} stock/xaxis/endontick/
		 *         False for Y axis
		 * @default true
		 * @since 1.2.0
		 * @product highcharts highstock
		 */
		startOnTick: true,

		/**
		 * @extends xAxis.title
		 */
		title: {

			/**
			 * The rotation of the text in degrees. 0 is horizontal, 270 is
			 * vertical reading from bottom to top.
			 * 
			 * @type {Number}
			 * @sample {highcharts} highcharts/yaxis/title-offset/ Horizontal
			 * @default 270
			 */
			rotation: 270,

			/**
			 * The actual text of the axis title. Horizontal texts can contain
			 * HTML, but rotated texts are painted using vector techniques and
			 * must be clean text. The Y axis title is disabled by setting the
			 * `text` option to `null`.
			 * 
			 * @type {String}
			 * @sample {highcharts} highcharts/xaxis/title-text/ Custom HTML
			 * @default {highcharts} Values
			 * @default {highstock} null
			 * @product highcharts highstock
			 */
			text: 'Values'
		},

		/**
		 * The stack labels show the total value for each bar in a stacked
		 * column or bar chart. The label will be placed on top of positive
		 * columns and below negative columns. In case of an inverted column
		 * chart or a bar chart the label is placed to the right of positive
		 * bars and to the left of negative bars.
		 * 
		 * @product highcharts
		 */
		stackLabels: {

			/**
			 * Allow the stack labels to overlap.
			 * 
			 * @type {Boolean}
			 * @sample {highcharts} highcharts/yaxis/stacklabels-allowoverlap-false/
			 *         Default false
			 * @since 5.0.13
			 * @product highcharts
			 */
			allowOverlap: false,

			/**
			 * Enable or disable the stack total labels.
			 * 
			 * @type {Boolean}
			 * @sample {highcharts} highcharts/yaxis/stacklabels-enabled/
			 *         Enabled stack total labels
			 * @since 2.1.5
			 * @product highcharts
			 */
			enabled: false,
			
			/**
			 * Callback JavaScript function to format the label. The value is
			 * given by `this.total`. Defaults to:
			 * 
			 * <pre>function() {
			 *     return this.total;
			 * }</pre>
			 * 
			 * @type {Function}
			 * @sample {highcharts} highcharts/yaxis/stacklabels-formatter/
			 *         Added units to stack total value
			 * @since 2.1.5
			 * @product highcharts
			 */
			formatter: function () {
				return H.numberFormat(this.total, -1);
			},
			/*= if (build.classic) { =*/

			/**
			 * CSS styles for the label.
			 * 
			 * In styled mode, the styles are set in the
			 * `.highcharts-stack-label` class.
			 * 
			 * @type {CSSObject}
			 * @sample {highcharts} highcharts/yaxis/stacklabels-style/
			 *         Red stack total labels
			 * @since 2.1.5
			 * @product highcharts
			 */
			style: {
				fontSize: '11px',
				fontWeight: 'bold',
				color: '${palette.neutralColor100}',
				textOutline: '1px contrast'
			}
			/*= } =*/
		},
		/*= if (build.classic) { =*/

		/**
		 * The width of the grid lines extending the ticks across the plot
		 * area.
		 * 
		 * @productdesc {highmaps}
		 * In Highmaps, the grid lines are hidden by default.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/gridlinewidth/ 2px lines
		 * @sample {highstock} stock/xaxis/gridlinewidth/ 2px lines
		 * @default 1
		 * @product highcharts highstock
		 */
		gridLineWidth: 1,		

		/**
		 * The width of the line marking the axis itself.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/yaxis/linecolor/ A 1px line on Y axis
		 * @sample {highstock} stock/xaxis/linewidth/ A 2px line on X axis
		 * @default 0
		 * @product highcharts highstock
		 */
		lineWidth: 0
		// tickWidth: 0
		/*= } =*/
	},

	/**
	 * These options extend the defaultOptions for left axes.
	 * 
	 * @private
	 * @type {Object}
	 */
	defaultLeftAxisOptions: {
		labels: {
			x: -15
		},
		title: {
			rotation: 270
		}
	},

	/**
	 * These options extend the defaultOptions for right axes.
	 *
	 * @private
	 * @type {Object}
	 */
	defaultRightAxisOptions: {
		labels: {
			x: 15
		},
		title: {
			rotation: 90
		}
	},

	/**
	 * These options extend the defaultOptions for bottom axes.
	 *
	 * @private
	 * @type {Object}
	 */
	defaultBottomAxisOptions: {
		labels: {
			autoRotation: [-45],
			x: 0
			// overflow: undefined,
			// staggerLines: null
		},
		title: {
			rotation: 0
		}
	},
	/**
	 * These options extend the defaultOptions for top axes.
	 *
	 * @private
	 * @type {Object}
	 */
	defaultTopAxisOptions: {
		labels: {
			autoRotation: [-45],
			x: 0
			// overflow: undefined
			// staggerLines: null
		},
		title: {
			rotation: 0
		}
	},

	/**
	 * Overrideable function to initialize the axis. 
	 *
	 * @see {@link Axis}
	 */
	init: function (chart, userOptions) {


		var isXAxis = userOptions.isX,
			axis = this;


		/**
		 * The Chart that the axis belongs to.
		 *
		 * @name chart
		 * @memberOf Axis
		 * @type {Chart}
		 */
		axis.chart = chart;
		
		/**
		 * Whether the axis is horizontal.
		 *
		 * @name horiz
		 * @memberOf Axis
		 * @type {Boolean}
		 */
		axis.horiz = chart.inverted && !axis.isZAxis ? !isXAxis : isXAxis;

		// Flag, isXAxis
		axis.isXAxis = isXAxis;

		/**
		 * The collection where the axis belongs, for example `xAxis`, `yAxis`
		 * or `colorAxis`. Corresponds to properties on Chart, for example
		 * {@link Chart.xAxis}.
		 *
		 * @name coll
		 * @memberOf Axis
		 * @type {String}
		 */
		axis.coll = axis.coll || (isXAxis ? 'xAxis' : 'yAxis');


		axis.opposite = userOptions.opposite; // needed in setOptions

		/**
		 * The side on which the axis is rendered. 0 is top, 1 is right, 2 is
		 * bottom and 3 is left.
		 *
		 * @name side
		 * @memberOf Axis
		 * @type {Number}
		 */
		axis.side = userOptions.side || (axis.horiz ?
				(axis.opposite ? 0 : 2) : // top : bottom
				(axis.opposite ? 1 : 3));  // right : left

		axis.setOptions(userOptions);


		var options = this.options,
			type = options.type,
			isDatetimeAxis = type === 'datetime';

		axis.labelFormatter = options.labels.formatter ||
			axis.defaultLabelFormatter; // can be overwritten by dynamic format


		// Flag, stagger lines or not
		axis.userOptions = userOptions;

		axis.minPixelPadding = 0;


		/**
		 * Whether the axis is reversed. Based on the `axis.reversed`,
		 * option, but inverted charts have reversed xAxis by default.
		 *
		 * @name reversed
		 * @memberOf Axis
		 * @type {Boolean}
		 */
		axis.reversed = options.reversed;
		axis.visible = options.visible !== false;
		axis.zoomEnabled = options.zoomEnabled !== false;

		// Initial categories
		axis.hasNames = type === 'category' || options.categories === true;
		axis.categories = options.categories || axis.hasNames;
		axis.names = axis.names || []; // Preserve on update (#3830)

		// Placeholder for plotlines and plotbands groups
		axis.plotLinesAndBandsGroups = {};

		// Shorthand types
		axis.isLog = type === 'logarithmic';
		axis.isDatetimeAxis = isDatetimeAxis;
		axis.positiveValuesOnly = axis.isLog && !axis.allowNegativeLog;

		// Flag, if axis is linked to another axis
		axis.isLinked = defined(options.linkedTo);
		
		// Major ticks
		axis.ticks = {};
		axis.labelEdge = [];
		// Minor ticks
		axis.minorTicks = {};

		// List of plotLines/Bands
		axis.plotLinesAndBands = [];

		// Alternate bands
		axis.alternateBands = {};

		// Axis metrics
		axis.len = 0;
		axis.minRange = axis.userMinRange = options.minRange || options.maxZoom;
		axis.range = options.range;
		axis.offset = options.offset || 0;


		// Dictionary for stacks
		axis.stacks = {};
		axis.oldStacks = {};
		axis.stacksTouched = 0;

		
		/**
		 * The maximum value of the axis. In a logarithmic axis, this is the
		 * logarithm of the real value, and the real value can be obtained from
		 * {@link Axis#getExtremes}.
		 *
		 * @name max
		 * @memberOf Axis
		 * @type {Number}
		 */
		axis.max = null;
		/**
		 * The minimum value of the axis. In a logarithmic axis, this is the
		 * logarithm of the real value, and the real value can be obtained from
		 * {@link Axis#getExtremes}.
		 *
		 * @name min
		 * @memberOf Axis
		 * @type {Number}
		 */
		axis.min = null;


		/**
		 * The processed crosshair options.
		 *
		 * @name crosshair
		 * @memberOf Axis
		 * @type {AxisCrosshairOptions}
		 */
		axis.crosshair = pick(
			options.crosshair,
			splat(chart.options.tooltip.crosshairs)[isXAxis ? 0 : 1],
			false
		);
		
		var events = axis.options.events;

		// Register. Don't add it again on Axis.update().
		if (inArray(axis, chart.axes) === -1) { // 
			if (isXAxis) { // #2713
				chart.axes.splice(chart.xAxis.length, 0, axis);
			} else {
				chart.axes.push(axis);
			}

			chart[axis.coll].push(axis);
		}

		/**
		 * All series associated to the axis.
		 *
		 * @name series
		 * @memberOf Axis
		 * @type {Array.<Series>}
		 */
		axis.series = axis.series || []; // populated by Series

		// Reversed axis
		if (
			chart.inverted &&
			!axis.isZAxis &&
			isXAxis &&
			axis.reversed === undefined
		) {
			axis.reversed = true;
		}

		// register event listeners
		objectEach(events, function (event, eventType) {
			addEvent(axis, eventType, event);
		});

		// extend logarithmic axis
		axis.lin2log = options.linearToLogConverter || axis.lin2log;
		if (axis.isLog) {
			axis.val2lin = axis.log2lin;
			axis.lin2val = axis.lin2log;
		}
	},

	/**
	 * Merge and set options.
	 *
	 * @private
	 */
	setOptions: function (userOptions) {
		this.options = merge(
			this.defaultOptions,
			this.coll === 'yAxis' && this.defaultYAxisOptions,
			[
				this.defaultTopAxisOptions,
				this.defaultRightAxisOptions,
				this.defaultBottomAxisOptions,
				this.defaultLeftAxisOptions
			][this.side],
			merge(
				defaultOptions[this.coll], // if set in setOptions (#1053)
				userOptions
			)
		);
	},

	/**
	 * The default label formatter. The context is a special config object for
	 * the label. In apps, use the {@link
	 * https://api.highcharts.com/highcharts/xAxis.labels.formatter|
	 * labels.formatter} instead except when a modification is needed.
	 *
	 * @private
	 */
	defaultLabelFormatter: function () {
		var axis = this.axis,
			value = this.value,
			categories = axis.categories,
			dateTimeLabelFormat = this.dateTimeLabelFormat,
			lang = defaultOptions.lang,
			numericSymbols = lang.numericSymbols,
			numSymMagnitude = lang.numericSymbolMagnitude || 1000,
			i = numericSymbols && numericSymbols.length,
			multi,
			ret,
			formatOption = axis.options.labels.format,

			// make sure the same symbol is added for all labels on a linear
			// axis
			numericSymbolDetector = axis.isLog ?
				Math.abs(value) :
				axis.tickInterval;

		if (formatOption) {
			ret = format(formatOption, this);

		} else if (categories) {
			ret = value;

		} else if (dateTimeLabelFormat) { // datetime axis
			ret = H.dateFormat(dateTimeLabelFormat, value);

		} else if (i && numericSymbolDetector >= 1000) {
			// Decide whether we should add a numeric symbol like k (thousands)
			// or M (millions). If we are to enable this in tooltip or other
			// places as well, we can move this logic to the numberFormatter and
			// enable it by a parameter.
			while (i-- && ret === undefined) {
				multi = Math.pow(numSymMagnitude, i + 1);
				if (
					// Only accept a numeric symbol when the distance is more 
					// than a full unit. So for example if the symbol is k, we
					// don't accept numbers like 0.5k.
					numericSymbolDetector >= multi &&
					// Accept one decimal before the symbol. Accepts 0.5k but
					// not 0.25k. How does this work with the previous?
					(value * 10) % multi === 0 &&
					numericSymbols[i] !== null &&
					value !== 0
				) { // #5480
					ret = H.numberFormat(value / multi, -1) + numericSymbols[i];
				}
			}
		}

		if (ret === undefined) {
			if (Math.abs(value) >= 10000) { // add thousands separators
				ret = H.numberFormat(value, -1);
			} else { // small numbers
				ret = H.numberFormat(value, -1, undefined, ''); // #2466
			}
		}

		return ret;
	},

	/**
	 * Get the minimum and maximum for the series of each axis. The function
	 * analyzes the axis series and updates `this.dataMin` and `this.dataMax`.
	 *
	 * @private
	 */
	getSeriesExtremes: function () {
		var axis = this,
			chart = axis.chart;
		axis.hasVisibleSeries = false;

		// Reset properties in case we're redrawing (#3353)
		axis.dataMin = axis.dataMax = axis.threshold = null;
		axis.softThreshold = !axis.isXAxis;

		if (axis.buildStacks) {
			axis.buildStacks();
		}

		// loop through this axis' series
		each(axis.series, function (series) {

			if (series.visible || !chart.options.chart.ignoreHiddenSeries) {

				var seriesOptions = series.options,
					xData,
					threshold = seriesOptions.threshold,
					seriesDataMin,
					seriesDataMax;

				axis.hasVisibleSeries = true;

				// Validate threshold in logarithmic axes
				if (axis.positiveValuesOnly && threshold <= 0) {
					threshold = null;
				}

				// Get dataMin and dataMax for X axes
				if (axis.isXAxis) {
					xData = series.xData;
					if (xData.length) {
						// If xData contains values which is not numbers, then
						// filter them out. To prevent performance hit, we only
						// do this after we have already found seriesDataMin
						// because in most cases all data is valid. #5234.
						seriesDataMin = arrayMin(xData);
						if (
							!isNumber(seriesDataMin) &&
							!(seriesDataMin instanceof Date) // #5010
						) {
							xData = grep(xData, function (x) {
								return isNumber(x);
							});
							// Do it again with valid data
							seriesDataMin = arrayMin(xData);
						}

						axis.dataMin = Math.min(
							pick(axis.dataMin, xData[0]),
							seriesDataMin
						);
						axis.dataMax = Math.max(
							pick(axis.dataMax, xData[0]),
							arrayMax(xData)
						);
						
					}

				// Get dataMin and dataMax for Y axes, as well as handle
				// stacking and processed data
				} else {

					// Get this particular series extremes
					series.getExtremes();
					seriesDataMax = series.dataMax;
					seriesDataMin = series.dataMin;

					// Get the dataMin and dataMax so far. If percentage is
					// used, the min and max are always 0 and 100. If
					// seriesDataMin and seriesDataMax is null, then series
					// doesn't have active y data, we continue with nulls
					if (defined(seriesDataMin) && defined(seriesDataMax)) {
						axis.dataMin = Math.min(
							pick(axis.dataMin, seriesDataMin),
							seriesDataMin
						);
						axis.dataMax = Math.max(
							pick(axis.dataMax, seriesDataMax),
							seriesDataMax
						);
					}

					// Adjust to threshold
					if (defined(threshold)) {
						axis.threshold = threshold;
					}
					// If any series has a hard threshold, it takes precedence
					if (
						!seriesOptions.softThreshold ||
						axis.positiveValuesOnly
					) {
						axis.softThreshold = false;
					}
				}
			}
		});
	},

	/**
	 * Translate from axis value to pixel position on the chart, or back. Use
	 * the `toPixels` and `toValue` functions in applications.
	 *
	 * @private
	 */
	translate: function (
		val,
		backwards,
		cvsCoord,
		old,
		handleLog,
		pointPlacement
	) {
		var axis = this.linkedParent || this, // #1417
			sign = 1,
			cvsOffset = 0,
			localA = old ? axis.oldTransA : axis.transA,
			localMin = old ? axis.oldMin : axis.min,
			returnValue,
			minPixelPadding = axis.minPixelPadding,
			doPostTranslate = (
				axis.isOrdinal ||
				axis.isBroken ||
				(axis.isLog && handleLog)
			) && axis.lin2val;

		if (!localA) {
			localA = axis.transA;
		}

		// In vertical axes, the canvas coordinates start from 0 at the top like
		// in SVG.
		if (cvsCoord) {
			sign *= -1; // canvas coordinates inverts the value
			cvsOffset = axis.len;
		}

		// Handle reversed axis
		if (axis.reversed) {
			sign *= -1;
			cvsOffset -= sign * (axis.sector || axis.len);
		}

		// From pixels to value
		if (backwards) { // reverse translation

			val = val * sign + cvsOffset;
			val -= minPixelPadding;
			returnValue = val / localA + localMin; // from chart pixel to value
			if (doPostTranslate) { // log and ordinal axes
				returnValue = axis.lin2val(returnValue);
			}

		// From value to pixels
		} else {
			if (doPostTranslate) { // log and ordinal axes
				val = axis.val2lin(val);
			}
			returnValue = isNumber(localMin) ?
				(
					sign * (val - localMin) * localA +
					cvsOffset +
					(sign * minPixelPadding) +
					(isNumber(pointPlacement) ? localA * pointPlacement : 0)
				) : 
				undefined;
		}

		return returnValue;
	},

	/**
	 * Translate a value in terms of axis units into pixels within the chart.
	 * 
	 * @param  {Number} value
	 *         A value in terms of axis units.
	 * @param  {Boolean} paneCoordinates
	 *         Whether to return the pixel coordinate relative to the chart or
	 *         just the axis/pane itself.
	 * @return {Number} Pixel position of the value on the chart or axis.
	 */
	toPixels: function (value, paneCoordinates) {
		return this.translate(value, false, !this.horiz, null, true) +
			(paneCoordinates ? 0 : this.pos);
	},

	/**
	 * Translate a pixel position along the axis to a value in terms of axis
	 * units.
	 * @param  {Number} pixel
	 *         The pixel value coordinate.
	 * @param  {Boolean} paneCoordiantes
	 *         Whether the input pixel is relative to the chart or just the
	 *         axis/pane itself.
	 * @return {Number} The axis value.
	 */
	toValue: function (pixel, paneCoordinates) {
		return this.translate(
			pixel - (paneCoordinates ? 0 : this.pos),
			true,
			!this.horiz,
			null,
			true
		);
	},

	/**
	 * Create the path for a plot line that goes from the given value on
	 * this axis, across the plot to the opposite side. Also used internally for
	 * grid lines and crosshairs.
	 * 
	 * @param  {Number} value
	 *         Axis value.
	 * @param  {Number} [lineWidth=1]
	 *         Used for calculation crisp line coordinates.
	 * @param  {Boolean} [old=false]
	 *         Use old coordinates (for resizing and rescaling).
	 * @param  {Boolean} [force=false]
	 *         If `false`, the function will return null when it falls outside
	 *         the axis bounds.
	 * @param  {Number} [translatedValue]
	 *         If given, return the plot line path of a pixel position on the
	 *         axis.
	 *
	 * @return {Array.<String|Number>}
	 *         The SVG path definition for the plot line.
	 */
	getPlotLinePath: function (value, lineWidth, old, force, translatedValue) {
		var axis = this,
			chart = axis.chart,
			axisLeft = axis.left,
			axisTop = axis.top,
			x1,
			y1,
			x2,
			y2,
			cHeight = (old && chart.oldChartHeight) || chart.chartHeight,
			cWidth = (old && chart.oldChartWidth) || chart.chartWidth,
			skip,
			transB = axis.transB,
			/**
			 * Check if x is between a and b. If not, either move to a/b or skip,
			 * depending on the force parameter.
			 */
			between = function (x, a, b) {
				if (x < a || x > b) {
					if (force) {
						x = Math.min(Math.max(a, x), b);
					} else {
						skip = true;
					}
				}
				return x;
			};

		translatedValue = pick(
			translatedValue,
			axis.translate(value, null, null, old)
		);
		x1 = x2 = Math.round(translatedValue + transB);
		y1 = y2 = Math.round(cHeight - translatedValue - transB);
		if (!isNumber(translatedValue)) { // no min or max
			skip = true;
			force = false; // #7175, don't force it when path is invalid
		} else if (axis.horiz) {
			y1 = axisTop;
			y2 = cHeight - axis.bottom;
			x1 = x2 = between(x1, axisLeft, axisLeft + axis.width);
		} else {
			x1 = axisLeft;
			x2 = cWidth - axis.right;
			y1 = y2 = between(y1, axisTop, axisTop + axis.height);
		}
		return skip && !force ?
			null :
			chart.renderer.crispLine(
				['M', x1, y1, 'L', x2, y2],
				lineWidth || 1
			);
	},

	/**
	 * Internal function to et the tick positions of a linear axis to round
	 * values like whole tens or every five.
	 *
	 * @param  {Number} tickInterval
	 *         The normalized tick interval
	 * @param  {Number} min
	 *         Axis minimum.
	 * @param  {Number} max
	 *         Axis maximum.
	 *
	 * @return {Array.<Number>}
	 *         An array of axis values where ticks should be placed.
	 */
	getLinearTickPositions: function (tickInterval, min, max) {
		var pos,
			lastPos,
			roundedMin =
				correctFloat(Math.floor(min / tickInterval) * tickInterval),
			roundedMax =
				correctFloat(Math.ceil(max / tickInterval) * tickInterval),
			tickPositions = [];

		// For single points, add a tick regardless of the relative position
		// (#2662, #6274)
		if (this.single) {
			return [min];
		}

		// Populate the intermediate values
		pos = roundedMin;
		while (pos <= roundedMax) {

			// Place the tick on the rounded value
			tickPositions.push(pos);

			// Always add the raw tickInterval, not the corrected one.
			pos = correctFloat(pos + tickInterval);

			// If the interval is not big enough in the current min - max range
			// to actually increase the loop variable, we need to break out to
			// prevent endless loop. Issue #619
			if (pos === lastPos) {
				break;
			}

			// Record the last value
			lastPos = pos;
		}
		return tickPositions;
	},

	/**
	 * Resolve the new minorTicks/minorTickInterval options into the legacy
	 * loosely typed minorTickInterval option.
	 */
	getMinorTickInterval: function () {
		var options = this.options;

		if (options.minorTicks === true) {
			return pick(options.minorTickInterval, 'auto');
		}
		if (options.minorTicks === false) {
			return null;
		}
		return options.minorTickInterval;
	},

	/**
	 * Internal function to return the minor tick positions. For logarithmic
	 * axes, the same logic as for major ticks is reused.
	 *
	 * @return {Array.<Number>}
	 *         An array of axis values where ticks should be placed.
	 */
	getMinorTickPositions: function () {
		var axis = this,
			options = axis.options,
			tickPositions = axis.tickPositions,
			minorTickInterval = axis.minorTickInterval,
			minorTickPositions = [],
			pos,
			pointRangePadding = axis.pointRangePadding || 0,
			min = axis.min - pointRangePadding, // #1498
			max = axis.max + pointRangePadding, // #1498
			range = max - min;

		// If minor ticks get too dense, they are hard to read, and may cause
		// long running script. So we don't draw them.
		if (range && range / minorTickInterval < axis.len / 3) { // #3875

			if (axis.isLog) {
				// For each interval in the major ticks, compute the minor ticks
				// separately.
				each(this.paddedTicks, function (pos, i, paddedTicks) {
					if (i) {
						minorTickPositions.push.apply(
							minorTickPositions, 
							axis.getLogTickPositions(
								minorTickInterval,
								paddedTicks[i - 1],
								paddedTicks[i],
								true
							)
						);
					}
				});

			} else if (
				axis.isDatetimeAxis &&
				this.getMinorTickInterval() === 'auto'
			) { // #1314
				minorTickPositions = minorTickPositions.concat(
					axis.getTimeTicks(
						axis.normalizeTimeTickInterval(minorTickInterval),
						min,
						max,
						options.startOfWeek
					)
				);
			} else {
				for (
					pos = min + (tickPositions[0] - min) % minorTickInterval;
					pos <= max;
					pos += minorTickInterval
				) {
					// Very, very, tight grid lines (#5771)
					if (pos === minorTickPositions[0]) {
						break;
					}
					minorTickPositions.push(pos);
				}
			}
		}

		if (minorTickPositions.length !== 0) {
			axis.trimTicks(minorTickPositions); // #3652 #3743 #1498 #6330
		}
		return minorTickPositions;
	},

	/**
	 * Adjust the min and max for the minimum range. Keep in mind that the
	 * series data is not yet processed, so we don't have information on data
	 * cropping and grouping, or updated axis.pointRange or series.pointRange.
	 * The data can't be processed until we have finally established min and
	 * max.
	 *
	 * @private
	 */
	adjustForMinRange: function () {
		var axis = this,
			options = axis.options,
			min = axis.min,
			max = axis.max,
			zoomOffset,
			spaceAvailable,
			closestDataRange,
			i,
			distance,
			xData,
			loopLength,
			minArgs,
			maxArgs,
			minRange;

		// Set the automatic minimum range based on the closest point distance
		if (axis.isXAxis && axis.minRange === undefined && !axis.isLog) {

			if (defined(options.min) || defined(options.max)) {
				axis.minRange = null; // don't do this again

			} else {

				// Find the closest distance between raw data points, as opposed
				// to closestPointRange that applies to processed points
				// (cropped and grouped)
				each(axis.series, function (series) {
					xData = series.xData;
					loopLength = series.xIncrement ? 1 : xData.length - 1;
					for (i = loopLength; i > 0; i--) {
						distance = xData[i] - xData[i - 1];
						if (
							closestDataRange === undefined ||
							distance < closestDataRange
						) {
							closestDataRange = distance;
						}
					}
				});
				axis.minRange = Math.min(
					closestDataRange * 5,
					axis.dataMax - axis.dataMin
				);
			}
		}

		// if minRange is exceeded, adjust
		if (max - min < axis.minRange) {

			spaceAvailable = axis.dataMax - axis.dataMin >= axis.minRange;
			minRange = axis.minRange;
			zoomOffset = (minRange - max + min) / 2;

			// if min and max options have been set, don't go beyond it
			minArgs = [min - zoomOffset, pick(options.min, min - zoomOffset)];
			// If space is available, stay within the data range
			if (spaceAvailable) {
				minArgs[2] = axis.isLog ?
					axis.log2lin(axis.dataMin) :
					axis.dataMin;
			}
			min = arrayMax(minArgs);

			maxArgs = [min + minRange, pick(options.max, min + minRange)];
			// If space is availabe, stay within the data range
			if (spaceAvailable) {
				maxArgs[2] = axis.isLog ?
					axis.log2lin(axis.dataMax) :
					axis.dataMax;
			}

			max = arrayMin(maxArgs);

			// now if the max is adjusted, adjust the min back
			if (max - min < minRange) {
				minArgs[0] = max - minRange;
				minArgs[1] = pick(options.min, max - minRange);
				min = arrayMax(minArgs);
			}
		}

		// Record modified extremes
		axis.min = min;
		axis.max = max;
	},

	/**
	 * Find the closestPointRange across all series.
	 *
	 * @private
	 */
	getClosest: function () {
		var ret;

		if (this.categories) {
			ret = 1;
		} else {
			each(this.series, function (series) {
				var seriesClosest = series.closestPointRange,
					visible = series.visible ||
						!series.chart.options.chart.ignoreHiddenSeries;
				
				if (
					!series.noSharedTooltip &&
					defined(seriesClosest) &&
					visible
				) {
					ret = defined(ret) ?
						Math.min(ret, seriesClosest) :
						seriesClosest;
				}
			});
		}
		return ret;
	},

	/**
	 * When a point name is given and no x, search for the name in the existing
	 * categories, or if categories aren't provided, search names or create a
	 * new category (#2522).
	 *
	 * @private
	 *
	 * @param  {Point}
	 *         The point to inspect.
	 *
	 * @return {Number}
	 *         The X value that the point is given.
	 */
	nameToX: function (point) {
		var explicitCategories = isArray(this.categories),
			names = explicitCategories ? this.categories : this.names,
			nameX = point.options.x,
			x;

		point.series.requireSorting = false;

		if (!defined(nameX)) {
			nameX = this.options.uniqueNames === false ?
				point.series.autoIncrement() : 
				inArray(point.name, names);
		}
		if (nameX === -1) { // The name is not found in currenct categories
			if (!explicitCategories) {
				x = names.length;
			}
		} else {
			x = nameX;
		}

		// Write the last point's name to the names array
		if (x !== undefined) {
			this.names[x] = point.name;
		}

		return x;
	},

	/**
	 * When changes have been done to series data, update the axis.names.
	 *
	 * @private
	 */
	updateNames: function () {
		var axis = this;

		if (this.names.length > 0) {
			this.names.length = 0;
			this.minRange = this.userMinRange; // Reset
			each(this.series || [], function (series) {
			
				// Reset incrementer (#5928)
				series.xIncrement = null;

				// When adding a series, points are not yet generated
				if (!series.points || series.isDirtyData) {
					series.processData();
					series.generatePoints();
				}

				each(series.points, function (point, i) {
					var x;
					if (point.options) {
						x = axis.nameToX(point);
						if (x !== undefined && x !== point.x) {
							point.x = x;
							series.xData[i] = x;
						}
					}
				});
			});
		}
	},

	/**
	 * Update translation information.
	 *
	 * @private
	 */
	setAxisTranslation: function (saveOld) {
		var axis = this,
			range = axis.max - axis.min,
			pointRange = axis.axisPointRange || 0,
			closestPointRange,
			minPointOffset = 0,
			pointRangePadding = 0,
			linkedParent = axis.linkedParent,
			ordinalCorrection,
			hasCategories = !!axis.categories,
			transA = axis.transA,
			isXAxis = axis.isXAxis;

		// Adjust translation for padding. Y axis with categories need to go
		// through the same (#1784).
		if (isXAxis || hasCategories || pointRange) {

			// Get the closest points
			closestPointRange = axis.getClosest();

			if (linkedParent) {
				minPointOffset = linkedParent.minPointOffset;
				pointRangePadding = linkedParent.pointRangePadding;
			} else {
				each(axis.series, function (series) {
					var seriesPointRange = hasCategories ? 
						1 : 
						(
							isXAxis ? 
								pick(
									series.options.pointRange,
									closestPointRange,
									0
								) : 
								(axis.axisPointRange || 0)
						), // #2806
						pointPlacement = series.options.pointPlacement;

					pointRange = Math.max(pointRange, seriesPointRange);

					if (!axis.single) {
						// minPointOffset is the value padding to the left of
						// the axis in order to make room for points with a
						// pointRange, typically columns. When the
						// pointPlacement option is 'between' or 'on', this
						// padding does not apply.
						minPointOffset = Math.max(
							minPointOffset,
							isString(pointPlacement) ? 0 : seriesPointRange / 2
						);

						// Determine the total padding needed to the length of
						// the axis to make room for the pointRange. If the
						// series' pointPlacement is 'on', no padding is added.
						pointRangePadding = Math.max(
							pointRangePadding,
							pointPlacement === 'on' ? 0 : seriesPointRange
						);
					}
				});
			}

			// Record minPointOffset and pointRangePadding
			ordinalCorrection = axis.ordinalSlope && closestPointRange ?
				axis.ordinalSlope / closestPointRange :
				1; // #988, #1853
			axis.minPointOffset = minPointOffset =
				minPointOffset * ordinalCorrection;
			axis.pointRangePadding =
				pointRangePadding = pointRangePadding * ordinalCorrection;

			// pointRange means the width reserved for each point, like in a
			// column chart
			axis.pointRange = Math.min(pointRange, range);

			// closestPointRange means the closest distance between points. In
			// columns it is mostly equal to pointRange, but in lines pointRange
			// is 0 while closestPointRange is some other value
			if (isXAxis) {
				axis.closestPointRange = closestPointRange;
			}
		}

		// Secondary values
		if (saveOld) {
			axis.oldTransA = transA;
		}
		axis.translationSlope = axis.transA = transA =
			axis.options.staticScale ||
			axis.len / ((range + pointRangePadding) || 1);

		// Translation addend
		axis.transB = axis.horiz ? axis.left : axis.bottom;
		axis.minPixelPadding = transA * minPointOffset;
	},

	minFromRange: function () {
		return this.max - this.range;
	},

	/**
	 * Set the tick positions to round values and optionally extend the extremes
	 * to the nearest tick.
	 *
	 * @private
	 */
	setTickInterval: function (secondPass) {
		var axis = this,
			chart = axis.chart,
			options = axis.options,
			isLog = axis.isLog,
			log2lin = axis.log2lin,
			isDatetimeAxis = axis.isDatetimeAxis,
			isXAxis = axis.isXAxis,
			isLinked = axis.isLinked,
			maxPadding = options.maxPadding,
			minPadding = options.minPadding,
			length,
			linkedParentExtremes,
			tickIntervalOption = options.tickInterval,
			minTickInterval,
			tickPixelIntervalOption = options.tickPixelInterval,
			categories = axis.categories,
			threshold = axis.threshold,
			softThreshold = axis.softThreshold,
			thresholdMin,
			thresholdMax,
			hardMin,
			hardMax;

		if (!isDatetimeAxis && !categories && !isLinked) {
			this.getTickAmount();
		}

		// Min or max set either by zooming/setExtremes or initial options
		hardMin = pick(axis.userMin, options.min);
		hardMax = pick(axis.userMax, options.max);

		// Linked axis gets the extremes from the parent axis
		if (isLinked) {
			axis.linkedParent = chart[axis.coll][options.linkedTo];
			linkedParentExtremes = axis.linkedParent.getExtremes();
			axis.min = pick(
				linkedParentExtremes.min,
				linkedParentExtremes.dataMin
			);
			axis.max = pick(
				linkedParentExtremes.max,
				linkedParentExtremes.dataMax
			);
			if (options.type !== axis.linkedParent.options.type) {
				H.error(11, 1); // Can't link axes of different type
			}

		// Initial min and max from the extreme data values
		} else {

			// Adjust to hard threshold
			if (!softThreshold && defined(threshold)) {
				if (axis.dataMin >= threshold) {
					thresholdMin = threshold;
					minPadding = 0;
				} else if (axis.dataMax <= threshold) {
					thresholdMax = threshold;
					maxPadding = 0;
				}
			}

			axis.min = pick(hardMin, thresholdMin, axis.dataMin);
			axis.max = pick(hardMax, thresholdMax, axis.dataMax);

		}

		if (isLog) {
			if (
				axis.positiveValuesOnly &&
				!secondPass &&
				Math.min(axis.min, pick(axis.dataMin, axis.min)) <= 0
			) { // #978
				H.error(10, 1); // Can't plot negative values on log axis
			}
			// The correctFloat cures #934, float errors on full tens. But it
			// was too aggressive for #4360 because of conversion back to lin,
			// therefore use precision 15.
			axis.min = correctFloat(log2lin(axis.min), 15);
			axis.max = correctFloat(log2lin(axis.max), 15);
		}

		// handle zoomed range
		if (axis.range && defined(axis.max)) {
			axis.userMin = axis.min = hardMin =
				Math.max(axis.dataMin, axis.minFromRange()); // #618, #6773
			axis.userMax = hardMax = axis.max;

			axis.range = null;  // don't use it when running setExtremes
		}

		// Hook for Highstock Scroller. Consider combining with beforePadding.
		fireEvent(axis, 'foundExtremes');

		// Hook for adjusting this.min and this.max. Used by bubble series.
		if (axis.beforePadding) {
			axis.beforePadding();
		}

		// adjust min and max for the minimum range
		axis.adjustForMinRange();

		// Pad the values to get clear of the chart's edges. To avoid
		// tickInterval taking the padding into account, we do this after
		// computing tick interval (#1337).
		if (
			!categories &&
			!axis.axisPointRange &&
			!axis.usePercentage &&
			!isLinked &&
			defined(axis.min) &&
			defined(axis.max)
		) {
			length = axis.max - axis.min;
			if (length) {
				if (!defined(hardMin) && minPadding) {
					axis.min -= length * minPadding;
				}
				if (!defined(hardMax)  && maxPadding) {
					axis.max += length * maxPadding;
				}
			}
		}

		// Handle options for floor, ceiling, softMin and softMax (#6359)
		if (isNumber(options.softMin)) {
			axis.min = Math.min(axis.min, options.softMin);
		}
		if (isNumber(options.softMax)) {
			axis.max = Math.max(axis.max, options.softMax);
		}
		if (isNumber(options.floor)) {
			axis.min = Math.max(axis.min, options.floor);
		}
		if (isNumber(options.ceiling)) {
			axis.max = Math.min(axis.max, options.ceiling);
		}
		

		// When the threshold is soft, adjust the extreme value only if the data
		// extreme and the padded extreme land on either side of the threshold.
		// For example, a series of [0, 1, 2, 3] would make the yAxis add a tick
		// for -1 because of the default minPadding and startOnTick options.
		// This is prevented by the softThreshold option.
		if (softThreshold && defined(axis.dataMin)) {
			threshold = threshold || 0;
			if (
				!defined(hardMin) &&
				axis.min < threshold &&
				axis.dataMin >= threshold
			) {
				axis.min = threshold;
			
			} else if (
				!defined(hardMax) &&
				axis.max > threshold &&
				axis.dataMax <= threshold
			) {
				axis.max = threshold;
			}
		}


		// get tickInterval
		if (
			axis.min === axis.max ||
			axis.min === undefined ||
			axis.max === undefined
		) {
			axis.tickInterval = 1;
		
		} else if (
			isLinked &&
			!tickIntervalOption &&
			tickPixelIntervalOption ===
				axis.linkedParent.options.tickPixelInterval
		) {
			axis.tickInterval = tickIntervalOption =
				axis.linkedParent.tickInterval;
		
		} else {
			axis.tickInterval = pick(
				tickIntervalOption,
				this.tickAmount ?
					((axis.max - axis.min) / Math.max(this.tickAmount - 1, 1)) :
					undefined,
				// For categoried axis, 1 is default, for linear axis use
				// tickPix
				categories ?
					1 :
					// don't let it be more than the data range
					(axis.max - axis.min) * tickPixelIntervalOption /
						Math.max(axis.len, tickPixelIntervalOption)
			);
		}

		// Now we're finished detecting min and max, crop and group series data.
		// This is in turn needed in order to find tick positions in ordinal axes.
		if (isXAxis && !secondPass) {
			each(axis.series, function (series) {
				series.processData(
					axis.min !== axis.oldMin || axis.max !== axis.oldMax
				);
			});
		}

		// set the translation factor used in translate function
		axis.setAxisTranslation(true);

		// hook for ordinal axes and radial axes
		if (axis.beforeSetTickPositions) {
			axis.beforeSetTickPositions();
		}

		// hook for extensions, used in Highstock ordinal axes
		if (axis.postProcessTickInterval) {
			axis.tickInterval = axis.postProcessTickInterval(axis.tickInterval);
		}

		// In column-like charts, don't cramp in more ticks than there are
		// points (#1943, #4184)
		if (axis.pointRange && !tickIntervalOption) {
			axis.tickInterval = Math.max(axis.pointRange, axis.tickInterval);
		}

		// Before normalizing the tick interval, handle minimum tick interval.
		// This applies only if tickInterval is not defined.
		minTickInterval = pick(
			options.minTickInterval,
			axis.isDatetimeAxis && axis.closestPointRange
		);
		if (!tickIntervalOption && axis.tickInterval < minTickInterval) {
			axis.tickInterval = minTickInterval;
		}

		// for linear axes, get magnitude and normalize the interval
		if (!isDatetimeAxis && !isLog && !tickIntervalOption) {
			axis.tickInterval = normalizeTickInterval(
				axis.tickInterval,
				null,
				getMagnitude(axis.tickInterval),
				// If the tick interval is between 0.5 and 5 and the axis max is
				// in the order of thousands, chances are we are dealing with
				// years. Don't allow decimals. #3363.
				pick(
					options.allowDecimals,
					!(
						axis.tickInterval > 0.5 &&
						axis.tickInterval < 5 &&
						axis.max > 1000 &&
						axis.max < 9999
					)
				),
				!!this.tickAmount
			);
		}

		// Prevent ticks from getting so close that we can't draw the labels
		if (!this.tickAmount) {
			axis.tickInterval = axis.unsquish();
		}

		this.setTickPositions();
	},

	/**
	 * Now we have computed the normalized tickInterval, get the tick positions
	 */
	setTickPositions: function () {

		var options = this.options,
			tickPositions,
			tickPositionsOption = options.tickPositions,
			minorTickIntervalOption = this.getMinorTickInterval(),
			tickPositioner = options.tickPositioner,
			startOnTick = options.startOnTick,
			endOnTick = options.endOnTick;

		// Set the tickmarkOffset
		this.tickmarkOffset = (
			this.categories &&
			options.tickmarkPlacement === 'between' &&
			this.tickInterval === 1
		) ? 0.5 : 0; // #3202


		// get minorTickInterval
		this.minorTickInterval =
			minorTickIntervalOption === 'auto' &&
			this.tickInterval ?
				this.tickInterval / 5 :
				minorTickIntervalOption;

		// When there is only one point, or all points have the same value on
		// this axis, then min and max are equal and tickPositions.length is 0
		// or 1. In this case, add some padding in order to center the point,
		// but leave it with one tick. #1337.
		this.single =
			this.min === this.max &&
			defined(this.min) &&
			!this.tickAmount &&
			(
				// Data is on integer (#6563)
				parseInt(this.min, 10) === this.min ||

				// Between integers and decimals are not allowed (#6274)
				options.allowDecimals !== false
			);

		// Find the tick positions. Work on a copy (#1565)
		this.tickPositions = tickPositions =
			tickPositionsOption && tickPositionsOption.slice();
		if (!tickPositions) {

			if (this.isDatetimeAxis) {
				tickPositions = this.getTimeTicks(
					this.normalizeTimeTickInterval(
						this.tickInterval,
						options.units
					),
					this.min,
					this.max,
					options.startOfWeek,
					this.ordinalPositions,
					this.closestPointRange,
					true
				);
			} else if (this.isLog) {
				tickPositions = this.getLogTickPositions(
					this.tickInterval,
					this.min,
					this.max
				);
			} else {
				tickPositions = this.getLinearTickPositions(
					this.tickInterval,
					this.min,
					this.max
				);
			}

			// Too dense ticks, keep only the first and last (#4477)
			if (tickPositions.length > this.len) {
				tickPositions = [tickPositions[0], tickPositions.pop()];
			}

			this.tickPositions = tickPositions;

			// Run the tick positioner callback, that allows modifying auto tick
			// positions.
			if (tickPositioner) {
				tickPositioner = tickPositioner.apply(
					this,
					[this.min, this.max]
				);
				if (tickPositioner) {
					this.tickPositions = tickPositions = tickPositioner;
				}
			}

		}

		// Reset min/max or remove extremes based on start/end on tick
		this.paddedTicks = tickPositions.slice(0); // Used for logarithmic minor
		this.trimTicks(tickPositions, startOnTick, endOnTick);
		if (!this.isLinked) {
			
			// Substract half a unit (#2619, #2846, #2515, #3390),
			// but not in case of multiple ticks (#6897)
			if (this.single && tickPositions.length < 2) {
				this.min -= 0.5;
				this.max += 0.5;
			}
			if (!tickPositionsOption && !tickPositioner) {
				this.adjustTickAmount();
			}
		}
	},

	/**
	 * Handle startOnTick and endOnTick by either adapting to padding min/max or
	 * rounded min/max. Also handle single data points.
	 *
	 * @private
	 */
	trimTicks: function (tickPositions, startOnTick, endOnTick) {
		var roundedMin = tickPositions[0],
			roundedMax = tickPositions[tickPositions.length - 1],
			minPointOffset = this.minPointOffset || 0;

		if (!this.isLinked) {
			if (startOnTick && roundedMin !== -Infinity) { // #6502
				this.min = roundedMin;
			} else {
				while (this.min - minPointOffset > tickPositions[0]) {
					tickPositions.shift();
				}
			}

			if (endOnTick) {
				this.max = roundedMax;
			} else {
				while (this.max + minPointOffset <
						tickPositions[tickPositions.length - 1]) {
					tickPositions.pop();
				}
			}

			// If no tick are left, set one tick in the middle (#3195)
			if (tickPositions.length === 0 && defined(roundedMin)) {
				tickPositions.push((roundedMax + roundedMin) / 2);
			}
		}
	},

	/**
	 * Check if there are multiple axes in the same pane.
	 *
	 * @private
	 * @return {Boolean}
	 *         True if there are other axes.
	 */
	alignToOthers: function () {
		var others = {}, // Whether there is another axis to pair with this one
			hasOther,
			options = this.options;

		if (
			// Only if alignTicks is true
			this.chart.options.chart.alignTicks !== false &&
			options.alignTicks !== false &&

			// Don't try to align ticks on a log axis, they are not evenly
			// spaced (#6021)
			!this.isLog
		) {
			each(this.chart[this.coll], function (axis) {
				var otherOptions = axis.options,
					horiz = axis.horiz,
					key = [
						horiz ? otherOptions.left : otherOptions.top, 
						otherOptions.width,
						otherOptions.height, 
						otherOptions.pane
					].join(',');


				if (axis.series.length) { // #4442
					if (others[key]) {
						hasOther = true; // #4201
					} else {
						others[key] = 1;
					}
				}
			});
		}
		return hasOther;
	},

	/**
	 * Find the max ticks of either the x and y axis collection, and record it
	 * in `this.tickAmount`.
	 *
	 * @private
	 */
	getTickAmount: function () {
		var options = this.options,
			tickAmount = options.tickAmount,
			tickPixelInterval = options.tickPixelInterval;

		if (
			!defined(options.tickInterval) &&
			this.len < tickPixelInterval &&
			!this.isRadial &&
			!this.isLog &&
			options.startOnTick &&
			options.endOnTick
		) {
			tickAmount = 2;
		}

		if (!tickAmount && this.alignToOthers()) {
			// Add 1 because 4 tick intervals require 5 ticks (including first
			// and last)
			tickAmount = Math.ceil(this.len / tickPixelInterval) + 1;
		}

		// For tick amounts of 2 and 3, compute five ticks and remove the
		// intermediate ones. This prevents the axis from adding ticks that are
		// too far away from the data extremes.
		if (tickAmount < 4) {
			this.finalTickAmt = tickAmount;
			tickAmount = 5;
		}

		this.tickAmount = tickAmount;
	},

	/**
	 * When using multiple axes, adjust the number of ticks to match the highest
	 * number of ticks in that group.
	 *
	 * @private
	 */
	adjustTickAmount: function () {
		var tickInterval = this.tickInterval,
			tickPositions = this.tickPositions,
			tickAmount = this.tickAmount,
			finalTickAmt = this.finalTickAmt,
			currentTickAmount = tickPositions && tickPositions.length,
			i,
			len;

		if (currentTickAmount < tickAmount) {
			while (tickPositions.length < tickAmount) {
				tickPositions.push(correctFloat(
					tickPositions[tickPositions.length - 1] + tickInterval
				));
			}
			this.transA *= (currentTickAmount - 1) / (tickAmount - 1);
			this.max = tickPositions[tickPositions.length - 1];

		// We have too many ticks, run second pass to try to reduce ticks
		} else if (currentTickAmount > tickAmount) {
			this.tickInterval *= 2;
			this.setTickPositions();
		}

		// The finalTickAmt property is set in getTickAmount
		if (defined(finalTickAmt)) {
			i = len = tickPositions.length;
			while (i--) {
				if (
					// Remove every other tick
					(finalTickAmt === 3 && i % 2 === 1) ||
					// Remove all but first and last
					(finalTickAmt <= 2 && i > 0 && i < len - 1)
				) {
					tickPositions.splice(i, 1);
				}
			}
			this.finalTickAmt = undefined;
		}
	},

	/**
	 * Set the scale based on data min and max, user set min and max or options.
	 * 
	 * @private
	 */
	setScale: function () {
		var axis = this,
			isDirtyData,
			isDirtyAxisLength;

		axis.oldMin = axis.min;
		axis.oldMax = axis.max;
		axis.oldAxisLength = axis.len;

		// set the new axisLength
		axis.setAxisSize();
		isDirtyAxisLength = axis.len !== axis.oldAxisLength;

		// is there new data?
		each(axis.series, function (series) {
			if (
				series.isDirtyData ||
				series.isDirty ||
				// When x axis is dirty, we need new data extremes for y as well
				series.xAxis.isDirty 
			) {
				isDirtyData = true;
			}
		});

		// do we really need to go through all this?
		if (
			isDirtyAxisLength ||
			isDirtyData ||
			axis.isLinked ||
			axis.forceRedraw ||
			axis.userMin !== axis.oldUserMin ||
			axis.userMax !== axis.oldUserMax ||
			axis.alignToOthers()
		) {

			if (axis.resetStacks) {
				axis.resetStacks();
			}

			axis.forceRedraw = false;

			// get data extremes if needed
			axis.getSeriesExtremes();

			// get fixed positions based on tickInterval
			axis.setTickInterval();

			// record old values to decide whether a rescale is necessary later
			// on (#540)
			axis.oldUserMin = axis.userMin;
			axis.oldUserMax = axis.userMax;

			// Mark as dirty if it is not already set to dirty and extremes have
			// changed. #595.
			if (!axis.isDirty) {
				axis.isDirty = 
					isDirtyAxisLength ||
					axis.min !== axis.oldMin ||
					axis.max !== axis.oldMax;
			}
		} else if (axis.cleanStacks) {
			axis.cleanStacks();
		}
	},

	/**
	 * Set the minimum and maximum of the axes after render time. If the
	 * `startOnTick` and `endOnTick` options are true, the minimum and maximum
	 * values are rounded off to the nearest tick. To prevent this, these
	 * options can be set to false before calling setExtremes. Also, setExtremes
	 * will not allow a range lower than the `minRange` option, which by default
	 * is the range of five points.
	 * 
	 * @param  {Number} [newMin]
	 *         The new minimum value.
	 * @param  {Number} [newMax]
	 *         The new maximum value.
	 * @param  {Boolean} [redraw=true]
	 *         Whether to redraw the chart or wait for an explicit call to 
	 *         {@link Highcharts.Chart#redraw}
	 * @param  {AnimationOptions} [animation=true]
	 *         Enable or modify animations.
	 * @param  {Object} [eventArguments]
	 *         Arguments to be accessed in event handler.
	 *
	 * @sample highcharts/members/axis-setextremes/
	 *         Set extremes from a button
	 * @sample highcharts/members/axis-setextremes-datetime/
	 *         Set extremes on a datetime axis
	 * @sample highcharts/members/axis-setextremes-off-ticks/
	 *         Set extremes off ticks
	 * @sample stock/members/axis-setextremes/
	 *         Set extremes in Highstock
	 * @sample maps/members/axis-setextremes/
	 *         Set extremes in Highmaps
	 */
	setExtremes: function (newMin, newMax, redraw, animation, eventArguments) {
		var axis = this,
			chart = axis.chart;

		redraw = pick(redraw, true); // defaults to true

		each(axis.series, function (serie) {
			delete serie.kdTree;
		});

		// Extend the arguments with min and max
		eventArguments = extend(eventArguments, {
			min: newMin,
			max: newMax
		});

		// Fire the event
		fireEvent(axis, 'setExtremes', eventArguments, function () {

			axis.userMin = newMin;
			axis.userMax = newMax;
			axis.eventArgs = eventArguments;

			if (redraw) {
				chart.redraw(animation);
			}
		});
	},

	/**
	 * Overridable method for zooming chart. Pulled out in a separate method to
	 * allow overriding in stock charts.
	 *
	 * @private
	 */
	zoom: function (newMin, newMax) {
		var dataMin = this.dataMin,
			dataMax = this.dataMax,
			options = this.options,
			min = Math.min(dataMin, pick(options.min, dataMin)),
			max = Math.max(dataMax, pick(options.max, dataMax));

		if (newMin !== this.min || newMax !== this.max) { // #5790
			
			// Prevent pinch zooming out of range. Check for defined is for
			// #1946. #1734.
			if (!this.allowZoomOutside) {
				// #6014, sometimes newMax will be smaller than min (or newMin
				// will be larger than max).
				if (defined(dataMin)) {
					if (newMin < min) {
						newMin = min;
					}
					if (newMin > max) {
						newMin = max;
					}
				}
				if (defined(dataMax)) {
					if (newMax < min) {
						newMax = min;
					}
					if (newMax > max) {
						newMax = max;
					}
				}
			}

			// In full view, displaying the reset zoom button is not required
			this.displayBtn = newMin !== undefined || newMax !== undefined;

			// Do it
			this.setExtremes(
				newMin,
				newMax,
				false,
				undefined,
				{ trigger: 'zoom' }
			);
		}

		return true;
	},

	/**
	 * Update the axis metrics.
	 *
	 * @private
	 */
	setAxisSize: function () {
		var chart = this.chart,
			options = this.options,
			// [top, right, bottom, left]
			offsets = options.offsets || [0, 0, 0, 0],
			horiz = this.horiz,

			// Check for percentage based input values. Rounding fixes problems
			// with column overflow and plot line filtering (#4898, #4899)
			width = this.width = Math.round(H.relativeLength(
				pick(
					options.width,
					chart.plotWidth - offsets[3] + offsets[1]
				),
				chart.plotWidth
			)),
			height = this.height = Math.round(H.relativeLength(
				pick(
					options.height,
					chart.plotHeight - offsets[0] + offsets[2]
				),
				chart.plotHeight
			)),
			top = this.top = Math.round(H.relativeLength(
				pick(options.top, chart.plotTop + offsets[0]),
				chart.plotHeight,
				chart.plotTop
			)),
			left = this.left = Math.round(H.relativeLength(
				pick(options.left, chart.plotLeft + offsets[3]),
				chart.plotWidth,
				chart.plotLeft
			));

		// Expose basic values to use in Series object and navigator
		this.bottom = chart.chartHeight - height - top;
		this.right = chart.chartWidth - width - left;

		// Direction agnostic properties
		this.len = Math.max(horiz ? width : height, 0); // Math.max fixes #905
		this.pos = horiz ? left : top; // distance from SVG origin
	},

	/**
	 * The returned object literal from the {@link Highcharts.Axis#getExtremes}
	 * function. 
	 * @typedef {Object} Extremes
	 * @property {Number} dataMax
	 *         The maximum value of the axis' associated series.
	 * @property {Number} dataMin
	 *         The minimum value of the axis' associated series.
	 * @property {Number} max
	 *         The maximum axis value, either automatic or set manually. If the
	 *         `max` option is not set, `maxPadding` is 0 and `endOnTick` is
	 *         false, this value will be the same as `dataMax`.
	 * @property {Number} min
	 *         The minimum axis value, either automatic or set manually. If the
	 *         `min` option is not set, `minPadding` is 0 and `startOnTick` is
	 *         false, this value will be the same as `dataMin`.
	 */
	/**
	 * Get the current extremes for the axis.
	 *
	 * @returns {Extremes}
	 * An object containing extremes information.
	 * 
	 * @sample  highcharts/members/axis-getextremes/
	 *          Report extremes by click on a button
	 * @sample  maps/members/axis-getextremes/
	 *          Get extremes in Highmaps
	 */
	getExtremes: function () {
		var axis = this,
			isLog = axis.isLog,
			lin2log = axis.lin2log;

		return {
			min: isLog ? correctFloat(lin2log(axis.min)) : axis.min,
			max: isLog ? correctFloat(lin2log(axis.max)) : axis.max,
			dataMin: axis.dataMin,
			dataMax: axis.dataMax,
			userMin: axis.userMin,
			userMax: axis.userMax
		};
	},

	/**
	 * Get the zero plane either based on zero or on the min or max value.
	 * Used in bar and area plots.
	 *
	 * @param  {Number} threshold
	 *         The threshold in axis values.
	 *
	 * @return {Number}
	 *         The translated threshold position in terms of pixels, and
	 *         corrected to stay within the axis bounds.
	 */
	getThreshold: function (threshold) {
		var axis = this,
			isLog = axis.isLog,
			lin2log = axis.lin2log,
			realMin = isLog ? lin2log(axis.min) : axis.min,
			realMax = isLog ? lin2log(axis.max) : axis.max;

		if (threshold === null) {
			threshold = realMin;
		} else if (realMin > threshold) {
			threshold = realMin;
		} else if (realMax < threshold) {
			threshold = realMax;
		}

		return axis.translate(threshold, 0, 1, 0, 1);
	},

	/**
	 * Compute auto alignment for the axis label based on which side the axis is
	 * on and the given rotation for the label.
	 *
	 * @param  {Number} rotation
	 *         The rotation in degrees as set by either the `rotation` or 
	 *         `autoRotation` options.
	 * @private
	 */
	autoLabelAlign: function (rotation) {
		var ret,
			angle = (pick(rotation, 0) - (this.side * 90) + 720) % 360;

		if (angle > 15 && angle < 165) {
			ret = 'right';
		} else if (angle > 195 && angle < 345) {
			ret = 'left';
		} else {
			ret = 'center';
		}
		return ret;
	},

	/**
	 * Get the tick length and width for the axis based on axis options.
	 *
	 * @private
	 * 
	 * @param  {String} prefix
	 *         'tick' or 'minorTick'
	 * @return {Array.<Number>}
	 *         An array of tickLength and tickWidth
	 */
	tickSize: function (prefix) {
		var options = this.options,
			tickLength = options[prefix + 'Length'],
			tickWidth = pick(
				options[prefix + 'Width'],
				prefix === 'tick' && this.isXAxis ? 1 : 0 // X axis default 1
			); 

		if (tickWidth && tickLength) {
			// Negate the length
			if (options[prefix + 'Position'] === 'inside') {
				tickLength = -tickLength;
			}
			return [tickLength, tickWidth];
		}
			
	},

	/**
	 * Return the size of the labels.
	 *
	 * @private
	 */
	labelMetrics: function () {
		var index = this.tickPositions && this.tickPositions[0] || 0;
		return this.chart.renderer.fontMetrics(
			this.options.labels.style && this.options.labels.style.fontSize, 
			this.ticks[index] && this.ticks[index].label
		);
	},

	/**
	 * Prevent the ticks from getting so close we can't draw the labels. On a
	 * horizontal axis, this is handled by rotating the labels, removing ticks
	 * and adding ellipsis. On a vertical axis remove ticks and add ellipsis.
	 *
	 * @private
	 */
	unsquish: function () {
		var labelOptions = this.options.labels,
			horiz = this.horiz,
			tickInterval = this.tickInterval,
			newTickInterval = tickInterval,
			slotSize = this.len / (
				((this.categories ? 1 : 0) + this.max - this.min) / tickInterval
			),
			rotation,
			rotationOption = labelOptions.rotation,
			labelMetrics = this.labelMetrics(),
			step,
			bestScore = Number.MAX_VALUE,
			autoRotation,
			// Return the multiple of tickInterval that is needed to avoid
			// collision
			getStep = function (spaceNeeded) {
				var step = spaceNeeded / (slotSize || 1);
				step = step > 1 ? Math.ceil(step) : 1;
				return step * tickInterval;
			};

		if (horiz) {
			autoRotation = !labelOptions.staggerLines && !labelOptions.step && ( // #3971
				defined(rotationOption) ?
					[rotationOption] :
					slotSize < pick(labelOptions.autoRotationLimit, 80) && labelOptions.autoRotation
			);

			if (autoRotation) {

				// Loop over the given autoRotation options, and determine which gives the best score. The
				// best score is that with the lowest number of steps and a rotation closest to horizontal.
				each(autoRotation, function (rot) {
					var score;

					if (rot === rotationOption || (rot && rot >= -90 && rot <= 90)) { // #3891
					
						step = getStep(Math.abs(labelMetrics.h / Math.sin(deg2rad * rot)));

						score = step + Math.abs(rot / 360);

						if (score < bestScore) {
							bestScore = score;
							rotation = rot;
							newTickInterval = step;
						}
					}
				});
			}

		} else if (!labelOptions.step) { // #4411
			newTickInterval = getStep(labelMetrics.h);
		}

		this.autoRotation = autoRotation;
		this.labelRotation = pick(rotation, rotationOption);

		return newTickInterval;
	},

	/**
	 * Get the general slot width for labels/categories on this axis. This may
	 * change between the pre-render (from Axis.getOffset) and the final tick
	 * rendering and placement.
	 *
	 * @private
	 * @return {Number}
	 *         The pixel width allocated to each axis label.
	 */
	getSlotWidth: function () {
		// #5086, #1580, #1931
		var chart = this.chart,
			horiz = this.horiz,
			labelOptions = this.options.labels,
			slotCount = Math.max(
				this.tickPositions.length - (this.categories ? 0 : 1),
				1
			),
			marginLeft = chart.margin[3];

		return (
			horiz &&
			(labelOptions.step || 0) < 2 &&
			!labelOptions.rotation && // #4415
			((this.staggerLines || 1) * this.len) / slotCount
		) || (
			!horiz && (
				// #7028
				(labelOptions.style && parseInt(labelOptions.style.width, 10)) ||
				(marginLeft && (marginLeft - chart.spacing[3])) ||
				chart.chartWidth * 0.33
			)
		);

	},

	/**
	 * Render the axis labels and determine whether ellipsis or rotation need
	 * to be applied.
	 *
	 * @private
	 */
	renderUnsquish: function () {
		var chart = this.chart,
			renderer = chart.renderer,
			tickPositions = this.tickPositions,
			ticks = this.ticks,
			labelOptions = this.options.labels,
			horiz = this.horiz,
			slotWidth = this.getSlotWidth(),
			innerWidth = Math.max(1, Math.round(slotWidth - 2 * (labelOptions.padding || 5))),
			attr = {},
			labelMetrics = this.labelMetrics(),
			textOverflowOption = labelOptions.style && labelOptions.style.textOverflow,
			css,
			maxLabelLength = 0,
			label,
			i,
			pos;

		// Set rotation option unless it is "auto", like in gauges
		if (!isString(labelOptions.rotation)) {
			attr.rotation = labelOptions.rotation || 0; // #4443
		}

		// Get the longest label length
		each(tickPositions, function (tick) {
			tick = ticks[tick];
			if (tick && tick.labelLength > maxLabelLength) {
				maxLabelLength = tick.labelLength;
			}
		});
		this.maxLabelLength = maxLabelLength;
		

		// Handle auto rotation on horizontal axis
		if (this.autoRotation) {

			// Apply rotation only if the label is too wide for the slot, and
			// the label is wider than its height.
			if (maxLabelLength > innerWidth && maxLabelLength > labelMetrics.h) {
				attr.rotation = this.labelRotation;
			} else {
				this.labelRotation = 0;
			}

		// Handle word-wrap or ellipsis on vertical axis
		} else if (slotWidth) {
			// For word-wrap or ellipsis
			css = { width: innerWidth + 'px' };

			if (!textOverflowOption) {
				css.textOverflow = 'clip';

				// On vertical axis, only allow word wrap if there is room for more lines.
				i = tickPositions.length;
				while (!horiz && i--) {
					pos = tickPositions[i];
					label = ticks[pos].label;
					if (label) {
						// Reset ellipsis in order to get the correct bounding box (#4070)
						if (label.styles && label.styles.textOverflow === 'ellipsis') {
							label.css({ textOverflow: 'clip' });

						// Set the correct width in order to read the bounding box height (#4678, #5034)
						} else if (ticks[pos].labelLength > slotWidth) {
							label.css({ width: slotWidth + 'px' });
						}

						if (label.getBBox().height > this.len / tickPositions.length - (labelMetrics.h - labelMetrics.f)) {
							label.specCss = { textOverflow: 'ellipsis' };
						}
					}
				}
			}
		}


		// Add ellipsis if the label length is significantly longer than ideal
		if (attr.rotation) {
			css = { 
				width: (maxLabelLength > chart.chartHeight * 0.5 ? chart.chartHeight * 0.33 : chart.chartHeight) + 'px'
			};
			if (!textOverflowOption) {
				css.textOverflow = 'ellipsis';
			}
		}

		// Set the explicit or automatic label alignment
		this.labelAlign = labelOptions.align || this.autoLabelAlign(this.labelRotation);
		if (this.labelAlign) {
			attr.align = this.labelAlign;
		}

		// Apply general and specific CSS
		each(tickPositions, function (pos) {
			var tick = ticks[pos],
				label = tick && tick.label;
			if (label) {
				label.attr(attr); // This needs to go before the CSS in old IE (#4502)
				if (css) {
					label.css(merge(css, label.specCss));
				}
				delete label.specCss;
				tick.rotation = attr.rotation;
			}
		});

		// Note: Why is this not part of getLabelPosition?
		this.tickRotCorr = renderer.rotCorr(labelMetrics.b, this.labelRotation || 0, this.side !== 0);
	},

	/**
	 * Return true if the axis has associated data.
	 *
	 * @return {Boolean}
	 *         True if the axis has associated visible series and those series
	 *         have either valid data points or explicit `min` and `max`
	 *         settings.
	 */
	hasData: function () {
		return (
			this.hasVisibleSeries ||
			(defined(this.min) && defined(this.max) && !!this.tickPositions)
		);
	},
	
	/**
	 * Adds the title defined in axis.options.title.
	 * @param {Boolean} display - whether or not to display the title
	 */
	addTitle: function (display) {
		var axis = this,
			renderer = axis.chart.renderer,
			horiz = axis.horiz,
			opposite = axis.opposite,
			options = axis.options,
			axisTitleOptions = options.title,
			textAlign;
		
		if (!axis.axisTitle) {
			textAlign = axisTitleOptions.textAlign;
			if (!textAlign) {
				textAlign = (horiz ? { 
					low: 'left',
					middle: 'center',
					high: 'right'
				} : { 
					low: opposite ? 'right' : 'left',
					middle: 'center',
					high: opposite ? 'left' : 'right'
				})[axisTitleOptions.align];
			}
			axis.axisTitle = renderer.text(
				axisTitleOptions.text,
				0,
				0,
				axisTitleOptions.useHTML
			)
			.attr({
				zIndex: 7,
				rotation: axisTitleOptions.rotation || 0,
				align: textAlign
			})
			.addClass('highcharts-axis-title')
			/*= if (build.classic) { =*/
			.css(axisTitleOptions.style)
			/*= } =*/
			.add(axis.axisGroup);
			axis.axisTitle.isNew = true;
		}

		// Max width defaults to the length of the axis
		/*= if (build.classic) { =*/
		if (!axisTitleOptions.style.width && !axis.isRadial) {
		/*= } =*/
			axis.axisTitle.css({
				width: axis.len
			});
		/*= if (build.classic) { =*/
		}
		/*= } =*/
			
		
		// hide or show the title depending on whether showEmpty is set
		axis.axisTitle[display ? 'show' : 'hide'](true);
	},

	/**
	 * Generates a tick for initial positioning.
	 *
	 * @private
	 * @param  {number} pos
	 *         The tick position in axis values.
	 * @param  {number} i
	 *         The index of the tick in {@link Axis.tickPositions}.
	 */
	generateTick: function (pos) {
		var ticks = this.ticks;

		if (!ticks[pos]) {
			ticks[pos] = new Tick(this, pos);
		} else {
			ticks[pos].addLabel(); // update labels depending on tick interval
		}
	},

	/**
	 * Render the tick labels to a preliminary position to get their sizes.
	 *
	 * @private
	 */
	getOffset: function () {
		var axis = this,
			chart = axis.chart,
			renderer = chart.renderer,
			options = axis.options,
			tickPositions = axis.tickPositions,
			ticks = axis.ticks,
			horiz = axis.horiz,
			side = axis.side,
			invertedSide = chart.inverted  && !axis.isZAxis ? [1, 0, 3, 2][side] : side,
			hasData,
			showAxis,
			titleOffset = 0,
			titleOffsetOption,
			titleMargin = 0,
			axisTitleOptions = options.title,
			labelOptions = options.labels,
			labelOffset = 0, // reset
			labelOffsetPadded,
			axisOffset = chart.axisOffset,
			clipOffset = chart.clipOffset,
			clip,
			directionFactor = [-1, 1, 1, -1][side],
			className = options.className,
			axisParent = axis.axisParent, // Used in color axis
			lineHeightCorrection,
			tickSize = this.tickSize('tick');

		// For reuse in Axis.render
		hasData = axis.hasData();
		axis.showAxis = showAxis = hasData || pick(options.showEmpty, true);

		// Set/reset staggerLines
		axis.staggerLines = axis.horiz && labelOptions.staggerLines;

		// Create the axisGroup and gridGroup elements on first iteration
		if (!axis.axisGroup) {
			axis.gridGroup = renderer.g('grid')
				.attr({ zIndex: options.gridZIndex || 1 })
				.addClass('highcharts-' + this.coll.toLowerCase() + '-grid ' + (className || ''))
				.add(axisParent);
			axis.axisGroup = renderer.g('axis')
				.attr({ zIndex: options.zIndex || 2 })
				.addClass('highcharts-' + this.coll.toLowerCase() + ' ' + (className || ''))
				.add(axisParent);
			axis.labelGroup = renderer.g('axis-labels')
				.attr({ zIndex: labelOptions.zIndex || 7 })
				.addClass('highcharts-' + axis.coll.toLowerCase() + '-labels ' + (className || ''))
				.add(axisParent);
		}

		if (hasData || axis.isLinked) {

			// Generate ticks
			each(tickPositions, function (pos, i) {
				// i is not used here, but may be used in overrides
				axis.generateTick(pos, i);
			});

			axis.renderUnsquish();


			// Left side must be align: right and right side must have align: left for labels
			if (labelOptions.reserveSpace !== false && (side === 0 || side === 2 ||
					{ 1: 'left', 3: 'right' }[side] === axis.labelAlign || axis.labelAlign === 'center')) {
				each(tickPositions, function (pos) {

					// get the highest offset
					labelOffset = Math.max(
						ticks[pos].getLabelSize(),
						labelOffset
					);
				});
			}

			if (axis.staggerLines) {
				labelOffset *= axis.staggerLines;
				axis.labelOffset = labelOffset * (axis.opposite ? -1 : 1);
			}


		} else { // doesn't have data
			objectEach(ticks, function (tick, n) {
				tick.destroy();
				delete ticks[n];
			});
		}

		if (axisTitleOptions && axisTitleOptions.text && axisTitleOptions.enabled !== false) {
			axis.addTitle(showAxis);

			if (showAxis && axisTitleOptions.reserveSpace !== false) {
				axis.titleOffset = titleOffset =
					axis.axisTitle.getBBox()[horiz ? 'height' : 'width'];
				titleOffsetOption = axisTitleOptions.offset;
				titleMargin = defined(titleOffsetOption) ? 0 : pick(axisTitleOptions.margin, horiz ? 5 : 10);
			}
		}

		// Render the axis line
		axis.renderLine();

		// handle automatic or user set offset
		axis.offset = directionFactor * pick(options.offset, axisOffset[side]);

		axis.tickRotCorr = axis.tickRotCorr || { x: 0, y: 0 }; // polar
		if (side === 0) {
			lineHeightCorrection = -axis.labelMetrics().h;
		} else if (side === 2) {
			lineHeightCorrection = axis.tickRotCorr.y;
		} else {
			lineHeightCorrection = 0;
		}

		// Find the padded label offset
		labelOffsetPadded = Math.abs(labelOffset) + titleMargin;
		if (labelOffset) {
			labelOffsetPadded -= lineHeightCorrection;
			labelOffsetPadded += directionFactor * (horiz ? pick(labelOptions.y, axis.tickRotCorr.y + directionFactor * 8) : labelOptions.x);
		}
		axis.axisTitleMargin = pick(titleOffsetOption, labelOffsetPadded);

		axisOffset[side] = Math.max(
			axisOffset[side],
			axis.axisTitleMargin + titleOffset + directionFactor * axis.offset,
			labelOffsetPadded, // #3027
			hasData && tickPositions.length && tickSize ?
				tickSize[0] + directionFactor * axis.offset :
				0 // #4866
		);

		// Decide the clipping needed to keep the graph inside the plot area and axis lines
		clip = options.offset ? 0 : Math.floor(axis.axisLine.strokeWidth() / 2) * 2; // #4308, #4371
		clipOffset[invertedSide] = Math.max(clipOffset[invertedSide], clip);
	},

	/**
	 * Internal function to get the path for the axis line. Extended for polar
	 * charts.
	 *
	 * @param  {Number} lineWidth
	 *         The line width in pixels.
	 * @return {Array}
	 *         The SVG path definition in array form.
	 */
	getLinePath: function (lineWidth) {
		var chart = this.chart,
			opposite = this.opposite,
			offset = this.offset,
			horiz = this.horiz,
			lineLeft = this.left + (opposite ? this.width : 0) + offset,
			lineTop = chart.chartHeight - this.bottom -
				(opposite ? this.height : 0) + offset;

		if (opposite) {
			lineWidth *= -1; // crispify the other way - #1480, #1687
		}

		return chart.renderer
			.crispLine([
				'M',
				horiz ?
					this.left :
					lineLeft,
				horiz ?
					lineTop :
					this.top,
				'L',
				horiz ?
					chart.chartWidth - this.right :
					lineLeft,
				horiz ?
					lineTop :
					chart.chartHeight - this.bottom
			], lineWidth);
	},

	/**
	 * Render the axis line. Called internally when rendering and redrawing the
	 * axis.
	 */
	renderLine: function () {
		if (!this.axisLine) {
			this.axisLine = this.chart.renderer.path()
				.addClass('highcharts-axis-line')
				.add(this.axisGroup);

			/*= if (build.classic) { =*/
			this.axisLine.attr({
				stroke: this.options.lineColor,
				'stroke-width': this.options.lineWidth,
				zIndex: 7
			});
			/*= } =*/
		}
	},

	/**
	 * Position the axis title.
	 *
	 * @private
	 *
	 * @return {Object}
	 *         X and Y positions for the title.
	 */
	getTitlePosition: function () {
		// compute anchor points for each of the title align options
		var horiz = this.horiz,
			axisLeft = this.left,
			axisTop = this.top,
			axisLength = this.len,
			axisTitleOptions = this.options.title,
			margin = horiz ? axisLeft : axisTop,
			opposite = this.opposite,
			offset = this.offset,
			xOption = axisTitleOptions.x || 0,
			yOption = axisTitleOptions.y || 0,
			axisTitle = this.axisTitle,
			fontMetrics = this.chart.renderer.fontMetrics(
				axisTitleOptions.style && axisTitleOptions.style.fontSize,
				axisTitle
			),
			// The part of a multiline text that is below the baseline of the
			// first line. Subtract 1 to preserve pixel-perfectness from the 
			// old behaviour (v5.0.12), where only one line was allowed.
			textHeightOvershoot = Math.max(
				axisTitle.getBBox(null, 0).height - fontMetrics.h - 1,
				0
			),

			// the position in the length direction of the axis
			alongAxis = {
				low: margin + (horiz ? 0 : axisLength),
				middle: margin + axisLength / 2,
				high: margin + (horiz ? axisLength : 0)
			}[axisTitleOptions.align],

			// the position in the perpendicular direction of the axis
			offAxis = (horiz ? axisTop + this.height : axisLeft) +
				(horiz ? 1 : -1) * // horizontal axis reverses the margin
				(opposite ? -1 : 1) * // so does opposite axes
				this.axisTitleMargin +
				[
					-textHeightOvershoot, // top
					textHeightOvershoot, // right
					fontMetrics.f, // bottom
					-textHeightOvershoot // left
				][this.side];


		return {
			x: horiz ?
				alongAxis + xOption :
				offAxis + (opposite ? this.width : 0) + offset + xOption,
			y: horiz ?
				offAxis + yOption - (opposite ? this.height : 0) + offset :
				alongAxis + yOption
		};
	},

	/**
	 * Render a minor tick into the given position. If a minor tick already 
	 * exists in this position, move it.
	 * 
	 * @param  {number} pos
	 *         The position in axis values.
	 */
	renderMinorTick: function (pos) {
		var slideInTicks = this.chart.hasRendered && isNumber(this.oldMin),
			minorTicks = this.minorTicks;

		if (!minorTicks[pos]) {
			minorTicks[pos] = new Tick(this, pos, 'minor');
		}

		// Render new ticks in old position
		if (slideInTicks && minorTicks[pos].isNew) {
			minorTicks[pos].render(null, true);
		}

		minorTicks[pos].render(null, false, 1);
	},

	/**
	 * Render a major tick into the given position. If a tick already exists
	 * in this position, move it.
	 * 
	 * @param  {number} pos
	 *         The position in axis values.
	 * @param  {number} i
	 *         The tick index.
	 */
	renderTick: function (pos, i) {
		var isLinked = this.isLinked,
			ticks = this.ticks,
			slideInTicks = this.chart.hasRendered && isNumber(this.oldMin);
		
		// Linked axes need an extra check to find out if
		if (!isLinked || (pos >= this.min && pos <= this.max)) {

			if (!ticks[pos]) {
				ticks[pos] = new Tick(this, pos);
			}

			// render new ticks in old position
			if (slideInTicks && ticks[pos].isNew) {
				ticks[pos].render(i, true, 0.1);
			}

			ticks[pos].render(i);
		}
	},

	/**
	 * Render the axis.
	 *
	 * @private
	 */
	render: function () {
		var axis = this,
			chart = axis.chart,
			renderer = chart.renderer,
			options = axis.options,
			isLog = axis.isLog,
			lin2log = axis.lin2log,
			isLinked = axis.isLinked,
			tickPositions = axis.tickPositions,
			axisTitle = axis.axisTitle,
			ticks = axis.ticks,
			minorTicks = axis.minorTicks,
			alternateBands = axis.alternateBands,
			stackLabelOptions = options.stackLabels,
			alternateGridColor = options.alternateGridColor,
			tickmarkOffset = axis.tickmarkOffset,
			axisLine = axis.axisLine,
			showAxis = axis.showAxis,
			animation = animObject(renderer.globalAnimation),
			from,
			to;

		// Reset
		axis.labelEdge.length = 0;
		axis.overlap = false;

		// Mark all elements inActive before we go over and mark the active ones
		each([ticks, minorTicks, alternateBands], function (coll) {
			objectEach(coll, function (tick) {
				tick.isActive = false;
			});
		});

		// If the series has data draw the ticks. Else only the line and title
		if (axis.hasData() || isLinked) {

			// minor ticks
			if (axis.minorTickInterval && !axis.categories) {
				each(axis.getMinorTickPositions(), function (pos) {
					axis.renderMinorTick(pos);
				});
			}

			// Major ticks. Pull out the first item and render it last so that
			// we can get the position of the neighbour label. #808.
			if (tickPositions.length) { // #1300
				each(tickPositions, function (pos, i) {
					axis.renderTick(pos, i);
				});
				// In a categorized axis, the tick marks are displayed between labels. So
				// we need to add a tick mark and grid line at the left edge of the X axis.
				if (tickmarkOffset && (axis.min === 0 || axis.single)) {
					if (!ticks[-1]) {
						ticks[-1] = new Tick(axis, -1, null, true);
					}
					ticks[-1].render(-1);
				}

			}

			// alternate grid color
			if (alternateGridColor) {
				each(tickPositions, function (pos, i) {
					to = tickPositions[i + 1] !== undefined ? tickPositions[i + 1] + tickmarkOffset : axis.max - tickmarkOffset; 
					if (i % 2 === 0 && pos < axis.max && to <= axis.max + (chart.polar ? -tickmarkOffset : tickmarkOffset)) { // #2248, #4660
						if (!alternateBands[pos]) {
							alternateBands[pos] = new H.PlotLineOrBand(axis);
						}
						from = pos + tickmarkOffset; // #949
						alternateBands[pos].options = {
							from: isLog ? lin2log(from) : from,
							to: isLog ? lin2log(to) : to,
							color: alternateGridColor
						};
						alternateBands[pos].render();
						alternateBands[pos].isActive = true;
					}
				});
			}

			// custom plot lines and bands
			if (!axis._addedPlotLB) { // only first time
				each((options.plotLines || []).concat(options.plotBands || []), function (plotLineOptions) {
					axis.addPlotBandOrLine(plotLineOptions);
				});
				axis._addedPlotLB = true;
			}

		} // end if hasData

		// Remove inactive ticks
		each([ticks, minorTicks, alternateBands], function (coll) {
			var i,
				forDestruction = [],
				delay = animation.duration,
				destroyInactiveItems = function () {
					i = forDestruction.length;
					while (i--) {
						// When resizing rapidly, the same items may be destroyed in different timeouts,
						// or the may be reactivated
						if (coll[forDestruction[i]] && !coll[forDestruction[i]].isActive) {
							coll[forDestruction[i]].destroy();
							delete coll[forDestruction[i]];
						}
					}

				};

			objectEach(coll, function (tick, pos) {
				if (!tick.isActive) {
					// Render to zero opacity
					tick.render(pos, false, 0);
					tick.isActive = false;
					forDestruction.push(pos);
				}
			});

			// When the objects are finished fading out, destroy them
			syncTimeout(
				destroyInactiveItems, 
				coll === alternateBands || !chart.hasRendered || !delay ? 0 : delay
			);
		});

		// Set the axis line path
		if (axisLine) {
			axisLine[axisLine.isPlaced ? 'animate' : 'attr']({
				d: this.getLinePath(axisLine.strokeWidth())
			});
			axisLine.isPlaced = true;

			// Show or hide the line depending on options.showEmpty
			axisLine[showAxis ? 'show' : 'hide'](true);
		}

		if (axisTitle && showAxis) {
			var titleXy = axis.getTitlePosition();
			if (isNumber(titleXy.y)) {
				axisTitle[axisTitle.isNew ? 'attr' : 'animate'](titleXy);
				axisTitle.isNew = false;
			} else {
				axisTitle.attr('y', -9999);
				axisTitle.isNew = true;
			}
		}

		// Stacked totals:
		if (stackLabelOptions && stackLabelOptions.enabled) {
			axis.renderStackTotals();
		}
		// End stacked totals

		axis.isDirty = false;
	},

	/**
	 * Redraw the axis to reflect changes in the data or axis extremes. Called
	 * internally from {@link Chart#redraw}.
	 *
	 * @private
	 */
	redraw: function () {

		if (this.visible) {
			// render the axis
			this.render();

			// move plot lines and bands
			each(this.plotLinesAndBands, function (plotLine) {
				plotLine.render();
			});
		}

		// mark associated series as dirty and ready for redraw
		each(this.series, function (series) {
			series.isDirty = true;
		});

	},

	// Properties to survive after destroy, needed for Axis.update (#4317,
	// #5773, #5881).
	keepProps: ['extKey', 'hcEvents', 'names', 'series', 'userMax', 'userMin'],
	
	/**
	 * Destroys an Axis instance. See {@link Axis#remove} for the API endpoint
	 * to fully remove the axis.
	 *
	 * @private
	 * @param  {Boolean} keepEvents
	 *         Whether to preserve events, used internally in Axis.update.
	 */
	destroy: function (keepEvents) {
		var axis = this,
			stacks = axis.stacks,
			plotLinesAndBands = axis.plotLinesAndBands,
			plotGroup,
			i;

		// Remove the events
		if (!keepEvents) {
			removeEvent(axis);
		}

		// Destroy each stack total
		objectEach(stacks, function (stack, stackKey) {
			destroyObjectProperties(stack);
			
			stacks[stackKey] = null;
		});

		// Destroy collections
		each([axis.ticks, axis.minorTicks, axis.alternateBands], function (coll) {
			destroyObjectProperties(coll);
		});
		if (plotLinesAndBands) {
			i = plotLinesAndBands.length;
			while (i--) { // #1975
				plotLinesAndBands[i].destroy();
			}
		}

		// Destroy local variables
		each(['stackTotalGroup', 'axisLine', 'axisTitle', 'axisGroup', 'gridGroup', 'labelGroup', 'cross'], function (prop) {
			if (axis[prop]) {
				axis[prop] = axis[prop].destroy();
			}
		});

		// Destroy each generated group for plotlines and plotbands
		for (plotGroup in axis.plotLinesAndBandsGroups) {
			axis.plotLinesAndBandsGroups[plotGroup] = axis.plotLinesAndBandsGroups[plotGroup].destroy();
		}

		// Delete all properties and fall back to the prototype.
		objectEach(axis, function (val, key) {
			if (inArray(key, axis.keepProps) === -1) {
				delete axis[key];
			}
		});
	},

	/**
	 * Internal function to draw a crosshair.
	 *
	 * @param  {PointerEvent} [e]
	 *         The event arguments from the modified pointer event, extended 
	 *         with `chartX` and `chartY`
	 * @param  {Point} [point]
	 *         The Point object if the crosshair snaps to points.
	 */
	drawCrosshair: function (e, point) {

		var path,
			options = this.crosshair,
			snap = pick(options.snap, true),
			pos,
			categorized,
			graphic = this.cross;

		// Use last available event when updating non-snapped crosshairs without
		// mouse interaction (#5287)
		if (!e) {
			e = this.cross && this.cross.e;
		}

		if (
			// Disabled in options
			!this.crosshair ||
			// Snap
			((defined(point) || !snap) === false)
		) {
			this.hideCrosshair();
		} else {

			// Get the path
			if (!snap) {				
				pos = e && (this.horiz ? e.chartX - this.pos : this.len - e.chartY + this.pos);
			} else if (defined(point)) {
				pos = this.isXAxis ? point.plotX : this.len - point.plotY; // #3834
			}

			if (defined(pos)) {
				path = this.getPlotLinePath(
					// First argument, value, only used on radial
					point && (this.isXAxis ? point.x : pick(point.stackY, point.y)),
					null,
					null,
					null,
					pos // Translated position
				) || null; // #3189
			}

			if (!defined(path)) {
				this.hideCrosshair();
				return;
			}

			categorized = this.categories && !this.isRadial;
			
			// Draw the cross
			if (!graphic) {
				this.cross = graphic = this.chart.renderer
					.path()
					.addClass('highcharts-crosshair highcharts-crosshair-' + 
						(categorized ? 'category ' : 'thin ') + options.className)
					.attr({
						zIndex: pick(options.zIndex, 2)
					})
					.add();

				/*= if (build.classic) { =*/
				// Presentational attributes
				graphic.attr({
					'stroke': options.color || (categorized ? color('${palette.highlightColor20}').setOpacity(0.25).get() : '${palette.neutralColor20}'),
					'stroke-width': pick(options.width, 1)
				}).css({
					'pointer-events': 'none'
				});
				if (options.dashStyle) {
					graphic.attr({
						dashstyle: options.dashStyle
					});
				}
				/*= } =*/
				
			}

			graphic.show().attr({
				d: path
			});

			if (categorized && !options.width) {
				graphic.attr({
					'stroke-width': this.transA
				});
			}
			this.cross.e = e;
		}
	},

	/**
	 *	Hide the crosshair if visible.
	 */
	hideCrosshair: function () {
		if (this.cross) {
			this.cross.hide();
		}
	}
}); // end Axis

H.Axis = Axis;
export default Axis;
