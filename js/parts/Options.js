/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Color.js';
import './Utilities.js';
var color = H.color,
	each = H.each,
	getTZOffset = H.getTZOffset,
	isTouchDevice = H.isTouchDevice,
	merge = H.merge,
	pick = H.pick,
	svg = H.svg,
	win = H.win;
		
/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
/** 	 
 * @optionparent
 */
H.defaultOptions = {
	/*= if (build.classic) { =*/

	/**
	 * An array containing the default colors for the chart's series. When
	 * all colors are used, new colors are pulled from the start again.
	 * Defaults to:
	 * 
	 * <pre>colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
	 * 
	 * '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']</pre>
	 * 
	 * Default colors can also be set on a series or series.type basis,
	 * see [column.colors](#plotOptions.column.colors), [pie.colors](#plotOptions.
	 * pie.colors).
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the colors option doesn't exist. Instead, colors
	 * are defined in CSS and applied either through series or point class
	 * names, or through the [chart.colorCount](#chart.colorCount) option.
	 * 
	 * 
	 * ### Legacy
	 * 
	 * In Highcharts 3.x, the default colors were:
	 * 
	 * <pre>colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
	 * 
	 * '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']</pre>
	 * 
	 * In Highcharts 2.x, the default colors were:
	 * 
	 * <pre>colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
	 * 
	 *    '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92']</pre>
	 * 
	 * @type {Array<Color>}
	 * @sample {highcharts} highcharts/chart/colors/ Assign a global color theme
	 * @default {all} [ "#7cb5ec" , "#434348" , "#90ed7d" , "#f7a35c" , "#8085e9" , "#f15c80" , "#e4d354" , "#2b908f" , "#f45b5b" , "#91e8e1"]
	 * @product highcharts highstock highmaps
	 */
	colors: '${palette.colors}'.split(' '),
	/*= } =*/

	/**
	 */
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {

		/**
		 * The loading text that appears when the chart is set into the loading
		 * state following a call to `chart.showLoading`.
		 * 
		 * @type {String}
		 * @default {all} Loading...
		 * @product highcharts highstock highmaps
		 */
		loading: 'Loading...',

		/**
		 * An array containing the months names. Corresponds to the `%B` format
		 * in `Highcharts.dateFormat()`.
		 * 
		 * @type {Array<String>}
		 * @default {all} [ "January" , "February" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"]
		 * @product highcharts highstock highmaps
		 */
		months: [
			'January', 'February', 'March', 'April', 'May', 'June', 'July',
			'August', 'September', 'October', 'November', 'December'
		],

		/**
		 * An array containing the months names in abbreviated form. Corresponds
		 * to the `%b` format in `Highcharts.dateFormat()`.
		 * 
		 * @type {Array<String>}
		 * @default {highcharts} Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec
		 * @default {highstock} [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"]
		 * @default {highmaps} Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec
		 * @product highcharts highstock highmaps
		 */
		shortMonths: [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
			'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		],

		/**
		 * An array containing the weekday names.
		 * 
		 * @type {Array<String>}
		 * @default {all} ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		 * @product highcharts highstock highmaps
		 */
		weekdays: [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday',
			'Thursday', 'Friday', 'Saturday'
		],
		// invalidDate: '',

		/**
		 * The default decimal point used in the `Highcharts.numberFormat`
		 * method unless otherwise specified in the function arguments.
		 * 
		 * @type {String}
		 * @default {all} .
		 * @since 1.2.2
		 * @product highcharts highstock highmaps
		 */
		decimalPoint: '.',

		/**
		 * [Metric prefixes](http://en.wikipedia.org/wiki/Metric_prefix) used
		 * to shorten high numbers in axis labels. Replacing any of the positions
		 * with `null` causes the full number to be written. Setting `numericSymbols`
		 * to `null` disables shortening altogether.
		 * 
		 * @type {Array<String>}
		 * @sample {highcharts} highcharts/lang/numericsymbols/ Replacing the symbols with text
		 * @sample {highstock} highcharts/lang/numericsymbols/ Replacing the symbols with text
		 * @default {all} [ "k" , "M" , "G" , "T" , "P" , "E"]
		 * @since 2.3.0
		 * @product highcharts highstock highmaps
		 */
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels

		/**
		 * The text for the label appearing when a chart is zoomed.
		 * 
		 * @type {String}
		 * @default {all} Reset zoom
		 * @since 1.2.4
		 * @product highcharts highstock highmaps
		 */
		resetZoom: 'Reset zoom',

		/**
		 * The tooltip title for the label appearing when a chart is zoomed.
		 * 
		 * @type {String}
		 * @default {all} Reset zoom level 1:1
		 * @since 1.2.4
		 * @product highcharts highstock highmaps
		 */
		resetZoomTitle: 'Reset zoom level 1:1',

		/**
		 * The default thousands separator used in the `Highcharts.numberFormat`
		 * method unless otherwise specified in the function arguments. Since
		 * Highcharts 4.1 it defaults to a single space character, which is
		 * compatible with ISO and works across Anglo-American and continental
		 * European languages.
		 * 
		 * The default is a single space.
		 * 
		 * @type {String}
		 * @default {all}  
		 * @since 1.2.2
		 * @product highcharts highstock highmaps
		 */
		thousandsSep: ' '
	},

	/**
	 * Global options that don't apply to each chart. These options, like
	 * the `lang` options, must be set using the `Highcharts.setOptions`
	 * method.
	 * 
	 * <pre>Highcharts.setOptions({
	 * global: {
	 * useUTC: false
	 * }
	 * });</pre>
	 * 
	 * @product highcharts highstock highmaps
	 */
	global: {

		/**
		 * Whether to use UTC time for axis scaling, tickmark placement and
		 * time display in `Highcharts.dateFormat`. Advantages of using UTC
		 * is that the time displays equally regardless of the user agent's
		 * time zone settings. Local time can be used when the data is loaded
		 * in real time or when correct Daylight Saving Time transitions are
		 * required.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/global/useutc-true/ True by default
		 * @sample {highcharts} highcharts/global/useutc-false/ False
		 * @default {all} true
		 * @product highcharts highstock highmaps
		 */
		useUTC: true,
		//timezoneOffset: 0,
		/*= if (build.classic) { =*/

		/**
		 * Path to the pattern image required by VML browsers in order to
		 * draw radial gradients.
		 * 
		 * @type {String}
		 * @default {highcharts} http://code.highcharts.com/{version}/gfx/vml-radial-gradient.png
		 * @default {highstock} http://code.highcharts.com/highstock/{version}/gfx/vml-radial-gradient.png
		 * @default {highmaps} http://code.highcharts.com/{version}/gfx/vml-radial-gradient.png
		 * @since 2.3.0
		 * @product highcharts highstock highmaps
		 */
		VMLRadialGradientURL: 'http://code.highcharts.com/@product.version@/gfx/vml-radial-gradient.png'
		/*= } =*/
	},
	chart: {
		//animation: true,
		//alignTicks: false,
		//reflow: true,
		//className: null,
		//events: { load, selection },
		//margin: [null],
		//marginTop: null,
		//marginRight: null,
		//marginBottom: null,
		//marginLeft: null,

		/**
		 * The corner radius of the outer chart border.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/chart/borderradius/ 20px radius
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/border/ 10px radius
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/border/ Border options
		 * @default {all} 0
		 * @product highcharts highstock highmaps
		 */
		borderRadius: 0,
		/*= if (!build.classic) { =*/

		/**
		 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), this sets how many colors the class names
		 * should rotate between. With ten colors, series (or points) are
		 * given class names like `highcharts-color-0`, `highcharts-color-
		 * 0` [...] `highcharts-color-9`. The equivalent in non-styled mode
		 * is to set colors using the [colors](#colors) setting.
		 * 
		 * @type {Number}
		 * @default {all} 10
		 * @since 5.0.0
		 * @product highcharts highstock highmaps
		 */
		colorCount: 10,
		/*= } =*/

		/**
		 * Alias of `type`.
		 * 
		 * @validvalue ["line", "spline", "column", "area", "areaspline", "pie"]
		 * @type {String}
		 * @deprecated
		 * @sample {highcharts} highcharts/chart/defaultseriestype/ Bar
		 * @default {all} line
		 * @product highcharts
		 */
		defaultSeriesType: 'line',

		/**
		 * If true, the axes will scale to the remaining visible series once
		 * one series is hidden. If false, hiding and showing a series will
		 * not affect the axes or the other series. For stacks, once one series
		 * within the stack is hidden, the rest of the stack will close in
		 * around it even if the axis is not affected.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/chart/ignorehiddenseries-true/ True by default
		 * @sample {highcharts} highcharts/chart/ignorehiddenseries-false/ False
		 * @sample {highcharts} highcharts/chart/ignorehiddenseries-true-stacked/ True with stack
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/ignorehiddenseries-true/ True by default
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/ignorehiddenseries-false/ False
		 * @default {all} true
		 * @since 1.2.0
		 * @product highcharts highstock
		 */
		ignoreHiddenSeries: true,
		//inverted: false,

		/**
		 * The distance between the outer edge of the chart and the content,
		 * like title or legend, or axis title or labels if present. The
		 * numbers in the array designate top, right, bottom and left respectively.
		 * Use the options spacingTop, spacingRight, spacingBottom and spacingLeft
		 * options for shorthand setting of one option.
		 * 
		 * @type {Array<Number>}
		 * @see [chart.margin](#chart.margin)
		 * @default {all} [10, 10, 15, 10]
		 * @since 3.0.6
		 * @product highcharts highstock highmaps
		 */
		spacing: [10, 10, 15, 10],
		//spacingTop: 10,
		//spacingRight: 10,
		//spacingBottom: 15,
		//spacingLeft: 10,
		//zoomType: ''

		/**
		 * The button that appears after a selection zoom, allowing the user
		 * to reset zoom.
		 * 
		 * @product highcharts highstock highmaps
		 */
		resetZoomButton: {

			/**
			 * A collection of attributes for the button. The object takes SVG
			 * attributes like `fill`, `stroke`, `stroke-width` or `r`, the border
			 * radius. The theme also supports `style`, a collection of CSS properties
			 * for the text. Equivalent attributes for the hover state are given
			 * in `theme.states.hover`.
			 * 
			 * @type {Object}
			 * @sample {highcharts} highcharts/chart/resetzoombutton-theme/ Theming the button
			 * @sample {highstock} highcharts/chart/resetzoombutton-theme/ Theming the button
			 * @since 2.2
			 * @product highcharts highstock highmaps
			 */
			theme: {

				/**
				 */
				zIndex: 20
			},

			/**
			 * The position of the button.
			 * 
			 * @type {Object}
			 * @sample {highcharts} highcharts/chart/resetzoombutton-position/ Above the plot area
			 * @sample {highstock} highcharts/chart/resetzoombutton-position/ Above the plot area
			 * @sample {highstock} highcharts/chart/resetzoombutton-position/ Above the plot area
			 * @sample {highmaps} highcharts/chart/resetzoombutton-position/ Above the plot area
			 * @since 2.2
			 * @product highcharts highstock highmaps
			 */
			position: {

				/**
				 * The heatmap series type. This series type is available both in
				 * Highcharts and Highmaps.
				 * 
				 * @type {String}
				 * @default {all} right
				 * @product highcharts highstock highmaps
				 */
				align: 'right',

				/**
				 * The horizontal offset of the button
				 * 
				 * @type {Number}
				 * @default {all} -10
				 * @product highcharts highstock highmaps
				 */
				x: -10,
				//verticalAlign: 'top',

				/**
				 * The vertical offset of the button.
				 * 
				 * @type {Number}
				 * @default {all} 10
				 * @product highcharts highstock highmaps
				 */
				y: 10
			}
			// relativeTo: 'plot'
		},

		/**
		 * An explicit width for the chart. By default (when `null`) the width
		 * is calculated from the offset width of the containing element.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/chart/width/ 800px wide
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/width/ 800px wide
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/size/ Chart with explicit size
		 * @default {all} null
		 * @product highcharts highstock highmaps
		 */
		width: null,

		/**
		 * An explicit height for the chart. If a _number_, the height is
		 * given in pixels. If given a _percentage string_ (for example `'56%'`),
		 * the height is given as the percentage of the actual chart width.
		 * This allows for preserving the aspect ratio across responsive
		 * sizes.
		 * 
		 * By default (when `null`) the height is calculated from the offset
		 * height of the containing element, or 400 pixels if the containing
		 * element's height is 0.
		 * 
		 * @type {Number|String}
		 * @sample {highcharts} highcharts/chart/height/ 500px height
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/height/ 300px height
		 * @sample {highstock} highcharts/chart/height-percent/ Highcharts with percentage height
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/size/ Chart with explicit size
		 * @sample {highmaps} highcharts/chart/height-percent/ Highcharts with percentage height
		 * @default {all} null
		 * @product highcharts highstock highmaps
		 */
		height: null,
		
		/*= if (build.classic) { =*/

		/**
		 * The color of the outer chart border.
		 * 
		 * @type {Color}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the stroke is set with the `.highcharts-background`
		 * class.
		 * @sample {highcharts} highcharts/chart/bordercolor/ Brown border
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/border/ Brown border
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/border/ Border options
		 * @default {all} #335cad
		 * @product highcharts highstock highmaps
		 */
		borderColor: '${palette.highlightColor80}',
		//borderWidth: 0,
		//style: {
		//	fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
		//	fontSize: '12px'
		//},

		/**
		 * The background color or gradient for the outer chart area.
		 * 
		 * @type {Color}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the background is set with the `.highcharts-
		 * background` class.
		 * @sample {highcharts} highcharts/chart/backgroundcolor-color/ Color
		 * @sample {highcharts} highcharts/chart/backgroundcolor-gradient/ Gradient
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/backgroundcolor-color/ Color
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/backgroundcolor-gradient/ Gradient
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/backgroundcolor-color/ Color
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/backgroundcolor-gradient/ Gradient
		 * @default {all} #FFFFFF
		 * @product highcharts highstock highmaps
		 */
		backgroundColor: '${palette.backgroundColor}',
		//plotBackgroundColor: null,

		/**
		 * The color of the inner chart or plot area border.
		 * 
		 * @type {Color}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), a plot border stroke can be set with the `.
		 * highcharts-plot-border` class.
		 * @sample {highcharts} highcharts/chart/plotbordercolor/ Blue border
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/plotborder/ Blue border
		 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/plotborder/ Plot border options
		 * @default {all} #cccccc
		 * @product highcharts highstock highmaps
		 */
		plotBorderColor: '${palette.neutralColor20}'
		//plotBorderWidth: 0,
		//plotShadow: false,
		/*= } =*/
	},

	/**
	 * The chart's main title.
	 * 
	 * @sample {highmaps} highcharts/tree/master/samples/maps/title/title/ Title options demonstrated
	 * @product highcharts highstock highmaps
	 */
	title: {

		/**
		 * The title of the chart. To disable the title, set the `text` to
		 * `null`.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/title/text/ Custom title
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-text/ Custom title
		 * @default {highcharts} Chart title
		 * @default {highstock} null
		 * @default {highmaps} Chart title
		 * @product highcharts highstock highmaps
		 */
		text: 'Chart title',

		/**
		 * The horizontal alignment of the title. Can be one of "left", "center"
		 * and "right".
		 * 
		 * @validvalue ["left", "center", "right"]
		 * @type {String}
		 * @sample {highcharts} highcharts/title/align/ Aligned to the plot area (x = 70px     = margin left - spacing left)
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-align/ Aligned to the plot area (x = 50px     = margin left - spacing left)
		 * @default {all} center
		 * @since 2.0
		 * @product highcharts highstock highmaps
		 */
		align: 'center',
		// floating: false,

		/**
		 * The margin between the title and the plot area, or if a subtitle
		 * is present, the margin between the subtitle and the plot area.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/title/margin-50/ A chart title margin of 50
		 * @sample {highcharts} highcharts/title/margin-subtitle/ The same margin applied with a subtitle
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-margin/ A chart title margin of 50
		 * @default {all} 15
		 * @since 2.1
		 * @product highcharts highstock highmaps
		 */
		margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		// style: {}, // defined inline

		/**
		 * Adjustment made to the title width, normally to reserve space for
		 * the exporting burger menu.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/title/widthadjust/ Wider menu, greater padding
		 * @sample {highstock} highcharts/title/widthadjust/ Wider menu, greater padding
		 * @sample {highmaps} highcharts/title/widthadjust/ Wider menu, greater padding
		 * @default {all} -44
		 * @since 4.2.5
		 * @product highcharts highstock highmaps
		 */
		widthAdjust: -44

	},

	/**
	 * The chart's subtitle
	 * 
	 * @sample {highmaps} highcharts/tree/master/samples/maps/title/subtitle/ Subtitle options demonstrated
	 * @product highcharts highstock highmaps
	 */
	subtitle: {

		/**
		 * The subtitle of the chart.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/subtitle/text/ Custom subtitle
		 * @sample {highcharts} highcharts/subtitle/text-formatted/ Formatted and linked text.
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-text Custom subtitle
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-text-formatted Formatted and linked text.
		 * @product highcharts highstock highmaps
		 */
		text: '',

		/**
		 * The horizontal alignment of the subtitle. Can be one of "left",
		 *  "center" and "right".
		 * 
		 * @validvalue ["left", "center", "right"]
		 * @type {String}
		 * @sample {highcharts} highcharts/subtitle/align/ Footnote at right of plot area
		 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-footnote Footnote at bottom right of plot area
		 * @default {all} center
		 * @since 2.0
		 * @product highcharts highstock highmaps
		 */
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		// style: {}, // defined inline

		/**
		 * Adjustment made to the subtitle width, normally to reserve space
		 * for the exporting burger menu.
		 * 
		 * @type {Number}
		 * @see [title.widthAdjust](#title.widthAdjust)
		 * @sample {highcharts} highcharts/title/widthadjust/ Wider menu, greater padding
		 * @sample {highstock} highcharts/title/widthadjust/ Wider menu, greater padding
		 * @sample {highmaps} highcharts/title/widthadjust/ Wider menu, greater padding
		 * @default {all} -44
		 * @since 4.2.5
		 * @product highcharts highstock highmaps
		 */
		widthAdjust: -44
	},

	plotOptions: {},

	/**
	 * HTML labels that can be positioned anywhere in the chart area.
	 * 
	 * @product highcharts highstock highmaps
	 */
	labels: {
		//items: [],

		/**
		 * Shared CSS styles for all labels.
		 * 
		 * @type {CSSObject}
		 * @default {all} { "color": "#333333" }
		 * @product highcharts highstock highmaps
		 */
		style: {
			//font: defaultFont,

			/**
			 */
			position: 'absolute',

			/**
			 */
			color: '${palette.neutralColor80}'
		}
	},

	/**
	 * The legend is a box containing a symbol and name for each series
	 * item or point item in the chart. Each series (or points in case
	 * of pie charts) is represented by a symbol and its name in the legend.
	 * 
	 * 
	 * It is also possible to override the symbol creator function and
	 * create [custom legend symbols](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/studies/legend-
	 * custom-symbol/).
	 * 
	 * @product highcharts highstock highmaps
	 */
	legend: {

		/**
		 * Enable or disable the legend.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/legend/enabled-false/ Legend disabled
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/enabled-false/ Legend disabled
		 * @default {highstock} false
		 * @default {highmaps} true
		 * @product highcharts highstock highmaps
		 */
		enabled: true,

		/**
		 * The horizontal alignment of the legend box within the chart area.
		 * Valid values are `left`, `center` and `right`.
		 * 
		 * In the case that the legend is aligned in a corner position, the
		 * `layout` option will determine whether to place it above/below
		 * or on the side of the plot area.
		 * 
		 * @validvalue ["left", "center", "right"]
		 * @type {String}
		 * @sample {highcharts} highcharts/legend/align/ Legend at the right of the chart
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/alignment/ Legend alignment
		 * @default {all} center
		 * @since 2.0
		 * @product highcharts highstock highmaps
		 */
		align: 'center',
		//floating: false,

		/**
		 * The layout of the legend items. Can be one of "horizontal" or "vertical".
		 * 
		 * @validvalue ["horizontal", "vertical"]
		 * @type {String}
		 * @sample {highcharts} highcharts/legend/layout-horizontal/ Horizontal by default
		 * @sample {highcharts} highcharts/legend/layout-vertical/ Vertical
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/layout-horizontal/ Horizontal by default
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/padding-itemmargin/ Vertical with data classes
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/layout-vertical/ Vertical with color axis gradient
		 * @default {all} horizontal
		 * @product highcharts highstock highmaps
		 */
		layout: 'horizontal',

		/**
		 * Callback function to format each of the series' labels. The _this_
		 * keyword refers to the series object, or the point object in case
		 * of pie charts. By default the series or point name is printed.
		 * 
		 * @type {Function}
		 * @sample {highcharts} highcharts/legend/labelformatter/ Add text
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/labelformatter/ Data classes with label formatter
		 * @product highcharts highstock highmaps
		 */
		labelFormatter: function () {
			return this.name;
		},
		//borderWidth: 0,

		/**
		 * The color of the drawn border around the legend.
		 * 
		 * @type {Color}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the legend border stroke can be applied with
		 * the `.highcharts-legend-box` class.
		 * @sample {highcharts} highcharts/legend/bordercolor/ Brown border
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/border-background/ Border and background options
		 * @default {all} #999999
		 * @product highcharts highstock highmaps
		 */
		borderColor: '${palette.neutralColor40}',

		/**
		 * The border corner radius of the legend.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/legend/borderradius-default/ Square by default
		 * @sample {highcharts} highcharts/legend/borderradius-round/ 5px rounded
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/border-background/ Border and background options
		 * @default {all} 0
		 * @product highcharts highstock highmaps
		 */
		borderRadius: 0,

		/**
		 * Options for the paging or navigation appearing when the legend
		 * is overflown. Navigation works well on screen, but not in static
		 * exported images. One way of working around that is to [increase
		 * the chart height in export](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/legend/navigation-
		 * enabled-false/).
		 * 
		 * @product highcharts highstock highmaps
		 */
		navigation: {
			/*= if (build.classic) { =*/

			/**
			 * The color for the active up or down arrow in the legend page navigation.
			 * 
			 * @type {Color}
			 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
			 * style/style-by-css), the active arrow be styled with the `.highcharts-
			 * legend-nav-active` class.
			 * @sample {highcharts} highcharts/legend/navigation/ Legend page navigation demonstrated
			 * @sample {highstock} highcharts/legend/navigation/ Legend page navigation demonstrated
			 * @default {all} #003399
			 * @since 2.2.4
			 * @product highcharts highstock highmaps
			 */
			activeColor: '${palette.highlightColor100}',

			/**
			 * The color of the inactive up or down arrow in the legend page
			 * navigation. .
			 * 
			 * @type {Color}
			 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
			 * style/style-by-css), the inactive arrow be styled with the `.highcharts-
			 * legend-nav-inactive` class.
			 * @sample {highcharts} highcharts/legend/navigation/ Legend page navigation demonstrated
			 * @sample {highstock} highcharts/legend/navigation/ Legend page navigation demonstrated
			 * @default {highcharts} #cccccc
			 * @default {highstock} #cccccc
			 * @default {highmaps} ##cccccc
			 * @since 2.2.4
			 * @product highcharts highstock highmaps
			 */
			inactiveColor: '${palette.neutralColor20}'
			/*= } =*/
			// animation: true,
			// arrowSize: 12
			// style: {} // text styles
		},
		// margin: 20,
		// reversed: false,
		// backgroundColor: null,
		/*style: {
			padding: '5px'
		},*/
		/*= if (build.classic) { =*/

		/**
		 * CSS styles for each legend item. Only a subset of CSS is supported,
		 * notably those options related to text. The default `textOverflow`
		 * property makes long texts truncate. Set it to `null` to wrap text
		 * instead. A `width` property can be added to control the text width.
		 * 
		 * @type {CSSObject}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the legend items can be styled with the `.
		 * highcharts-legend-item` class.
		 * @sample {highcharts} highcharts/legend/itemstyle/ Bold black text
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/itemstyle/ Item text styles
		 * @default {all} { "color": "#333333", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold", "textOverflow": "ellipsis" }
		 * @product highcharts highstock highmaps
		 */
		itemStyle: {			

			/**
			 */
			color: '${palette.neutralColor80}',

			/**
			 */
			fontSize: '12px',

			/**
			 */
			fontWeight: 'bold',

			/**
			 */
			textOverflow: 'ellipsis'
		},

		/**
		 * CSS styles for each legend item in hover mode. Only a subset of
		 * CSS is supported, notably those options related to text. Properties
		 * are inherited from `style` unless overridden here.
		 * 
		 * @type {CSSObject}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the hovered legend items can be styled with
		 * the `.highcharts-legend-item:hover` pesudo-class.
		 * @sample {highcharts} highcharts/legend/itemhoverstyle/ Red on hover
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/itemstyle/ Item text styles
		 * @default {all} { "color": "#000000" }
		 * @product highcharts highstock highmaps
		 */
		itemHoverStyle: {
			//cursor: 'pointer', removed as of #601

			/**
			 */
			color: '${palette.neutralColor100}'
		},

		/**
		 * CSS styles for each legend item when the corresponding series or
		 * point is hidden. Only a subset of CSS is supported, notably those
		 * options related to text. Properties are inherited from `style`
		 * unless overridden here.
		 * 
		 * @type {CSSObject}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the hidden legend items can be styled with
		 * the `.highcharts-legend-item-hidden` class.
		 * @sample {highcharts} highcharts/legend/itemhiddenstyle/ Darker gray color
		 * @default {all} { "color": "#cccccc" }
		 * @product highcharts highstock highmaps
		 */
		itemHiddenStyle: {

			/**
			 */
			color: '${palette.neutralColor20}'
		},

		/**
		 * Whether to apply a drop shadow to the legend. A `backgroundColor`
		 * also needs to be applied for this to take effect. Since 2.3 the
		 * shadow can be an object configuration containing `color`, `offsetX`,
		 *  `offsetY`, `opacity` and `width`.
		 * 
		 * @type {Boolean|Object}
		 * @sample {highcharts} highcharts/legend/shadow/ White background and drop shadow
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/border-background/ Border and background options
		 * @default {all} false
		 * @product highcharts highstock highmaps
		 */
		shadow: false,
		/*= } =*/

		/**
		 */
		itemCheckboxStyle: {

			/**
			 */
			position: 'absolute',

			/**
			 */
			width: '13px', // for IE precision

			/**
			 */
			height: '13px'
		},
		// itemWidth: undefined,

		/**
		 * When this is true, the legend symbol width will be the same as
		 * the symbol height, which in turn defaults to the font size of the
		 * legend items.
		 * 
		 * @type {Boolean}
		 * @default {all} true
		 * @since 5.0.0
		 * @product highcharts highstock highmaps
		 */
		squareSymbol: true,
		// symbolRadius: 0,
		// symbolWidth: 16,

		/**
		 * The pixel padding between the legend item symbol and the legend
		 * item text.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/legend/symbolpadding/ Greater symbol width and padding
		 * @default {all} 5
		 * @product highcharts highstock highmaps
		 */
		symbolPadding: 5,

		/**
		 * The vertical alignment of the legend box. Can be one of `top`,
		 * `middle` or `bottom`. Vertical position can be further determined
		 * by the `y` option.
		 * 
		 * In the case that the legend is aligned in a corner position, the
		 * `layout` option will determine whether to place it above/below
		 * or on the side of the plot area.
		 * 
		 * @validvalue ["top", "middle", "bottom"]
		 * @type {String}
		 * @sample {highcharts} highcharts/legend/verticalalign/ Legend 100px from the top of the chart
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/alignment/ Legend alignment
		 * @default {all} bottom
		 * @since 2.0
		 * @product highcharts highstock highmaps
		 */
		verticalAlign: 'bottom',
		// width: undefined,

		/**
		 * The x offset of the legend relative to its horizontal alignment
		 * `align` within chart.spacingLeft and chart.spacingRight. Negative
		 * x moves it to the left, positive x moves it to the right.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/legend/width/ Aligned to the plot area
		 * @default {all} 0
		 * @since 2.0
		 * @product highcharts highstock highmaps
		 */
		x: 0,

		/**
		 * The vertical offset of the legend relative to it's vertical alignment
		 * `verticalAlign` within chart.spacingTop and chart.spacingBottom.
		 *  Negative y moves it up, positive y moves it down.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/legend/verticalalign/ Legend 100px from the top of the chart
		 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/alignment/ Legend alignment
		 * @default {all} 0
		 * @since 2.0
		 * @product highcharts highstock highmaps
		 */
		y: 0,

		/**
		 * A title to be added on top of the legend.
		 * 
		 * @sample {highcharts} highcharts/legend/title/ Legend title
		 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/alignment/ Legend with title
		 * @since 3.0
		 * @product highcharts highstock highmaps
		 */
		title: {
			//text: null,
			/*= if (build.classic) { =*/

			/**
			 * Generic CSS styles for the legend title.
			 * 
			 * @type {CSSObject}
			 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
			 * style/style-by-css), the legend title is styled with the `.highcharts-
			 * legend-title` class.
			 * @default {all} {"fontWeight":"bold"}
			 * @since 3.0
			 * @product highcharts highstock highmaps
			 */
			style: {

				/**
				 */
				fontWeight: 'bold'
			}
			/*= } =*/
		}			
	},


	/**
	 * The loading options control the appearance of the loading screen
	 * that covers the plot area on chart operations. This screen only
	 * appears after an explicit call to `chart.showLoading()`. It is a
	 * utility for developers to communicate to the end user that something
	 * is going on, for example while retrieving new data via an XHR connection.
	 * The "Loading..." text itself is not part of this configuration
	 * object, but part of the `lang` object.
	 * 
	 * @product highcharts highstock highmaps
	 */
	loading: {
		// hideDuration: 100,
		// showDuration: 0,
		/*= if (build.classic) { =*/

		/**
		 * CSS styles for the loading label `span`.
		 * 
		 * @type {CSSObject}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the loading label is styled with the `.highcharts-
		 * legend-loading-inner` class.
		 * @sample {highcharts} highcharts/loading/labelstyle/ Vertically centered
		 * @sample {highstock} highcharts/tree/master/samples/stock/loading/general/ Label styles
		 * @default {all} { "fontWeight": "bold", "position": "relative", "top": "45%" }
		 * @since 1.2.0
		 * @product highcharts highstock highmaps
		 */
		labelStyle: {

			/**
			 */
			fontWeight: 'bold',

			/**
			 */
			position: 'relative',

			/**
			 */
			top: '45%'
		},

		/**
		 * CSS styles for the loading screen that covers the plot area.
		 * 
		 * @type {CSSObject}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the loading label is styled with the `.highcharts-
		 * legend-loading` class.
		 * @sample {highcharts} highcharts/loading/style/ Gray plot area, white text
		 * @sample {highstock} highcharts/tree/master/samples/stock/loading/general/ Gray plot area, white text
		 * @default {all} { "position": "absolute", "backgroundColor": "#ffffff", "opacity": 0.5, "textAlign": "center" }
		 * @since 1.2.0
		 * @product highcharts highstock highmaps
		 */
		style: {

			/**
			 */
			position: 'absolute',

			/**
			 */
			backgroundColor: '${palette.backgroundColor}',

			/**
			 */
			opacity: 0.5,

			/**
			 */
			textAlign: 'center'
		}
		/*= } =*/
	},


	/**
	 * Options for the tooltip that appears when the user hovers over a
	 * series or point.
	 * 
	 * @product highcharts highstock highmaps
	 */
	tooltip: {

		/**
		 * Enable or disable the tooltip.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/tooltip/enabled/ Disabled
		 * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/ Disable tooltip and show values on chart instead
		 * @default {all} true
		 * @product highcharts highstock highmaps
		 */
		enabled: true,

		/**
		 * Enable or disable animation of the tooltip. In slow legacy IE browsers
		 * the animation is disabled by default.
		 * 
		 * @type {Boolean}
		 * @default {all} true
		 * @since 2.3.0
		 * @product highcharts highstock highmaps
		 */
		animation: svg,
		//crosshairs: null,

		/**
		 * The radius of the rounded border corners.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/tooltip/bordercolor-default/ 5px by default
		 * @sample {highcharts} highcharts/tooltip/borderradius-0/ Square borders
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/background-border/ Background and border demo
		 * @default {all} 3
		 * @product highcharts highstock highmaps
		 */
		borderRadius: 3,

		/**
		 * For series on a datetime axes, the date format in the tooltip's
		 * header will by default be guessed based on the closest data points.
		 * This member gives the default string representations used for
		 * each unit. For an overview of the replacement codes, see [dateFormat](#Highcharts.
		 * dateFormat).
		 * 
		 * Defaults to:
		 * 
		 * <pre>{
		 * millisecond:"%A, %b %e, %H:%M:%S.%L",
		 * second:"%A, %b %e, %H:%M:%S",
		 * minute:"%A, %b %e, %H:%M",
		 * hour:"%A, %b %e, %H:%M",
		 * day:"%A, %b %e, %Y",
		 * week:"Week from %A, %b %e, %Y",
		 * month:"%B %Y",
		 * year:"%Y"
		 * }</pre>
		 * 
		 * @type {Object}
		 * @see [xAxis.dateTimeLabelFormats](#xAxis.dateTimeLabelFormats)
		 * @product highcharts highstock
		 */
		dateTimeLabelFormats: {

			/**
			 */
			millisecond: '%A, %b %e, %H:%M:%S.%L',

			/**
			 */
			second: '%A, %b %e, %H:%M:%S',

			/**
			 */
			minute: '%A, %b %e, %H:%M',

			/**
			 */
			hour: '%A, %b %e, %H:%M',

			/**
			 */
			day: '%A, %b %e, %Y',

			/**
			 */
			week: 'Week from %A, %b %e, %Y',

			/**
			 */
			month: '%B %Y',

			/**
			 */
			year: '%Y'
		},

		/**
		 * A string to append to the tooltip format.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/tooltip/footerformat/ A table for value alignment
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/format/ Format demo
		 * @default {all} false
		 * @since 2.2
		 * @product highcharts highmaps
		 */
		footerFormat: '',
		//formatter: defaultFormatter,
		/* todo: em font-size when finished comparing against HC4
		headerFormat: '<span style="font-size: 0.85em">{point.key}</span><br/>',
		*/

		/**
		 * Padding inside the tooltip, in pixels.
		 * 
		 * @type {Number}
		 * @default {all} 8
		 * @since 5.0.0
		 * @product highcharts highstock highmaps
		 */
		padding: 8,

		//shape: 'callout',
		//shared: false,

		/**
		 * Proximity snap for graphs or single points. It defaults to 10 for
		 * mouse-powered devices and 25 for touch devices.
		 * 
		 * Note that in most cases the whole plot area captures the mouse
		 * movement, and in these cases `tooltip.snap` doesn't make sense.
		 * This applies when [stickyTracking](#plotOptions.series.stickyTracking)
		 * is `true` (default) and when the tooltip is [shared](#tooltip.shared)
		 * or [split](#tooltip.split).
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/tooltip/bordercolor-default/ 10 px by default
		 * @sample {highcharts} highcharts/tooltip/snap-50/ 50 px on graph
		 * @default {all} 10/25
		 * @since 1.2.0
		 * @product highcharts highstock
		 */
		snap: isTouchDevice ? 25 : 10,
		/*= if (!build.classic) { =*/
		headerFormat: '<span class="highcharts-header">{point.key}</span><br/>',
		pointFormat: '<span class="highcharts-color-{point.colorIndex}">' +
			'\u25CF</span> {series.name}: <span class="highcharts-strong">' +
			'{point.y}</span><br/>',
		/*= } else { =*/

		/**
		 * The background color or gradient for the tooltip.
		 * 
		 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the stroke width is set in the `.highcharts-
		 * tooltip-box` class.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/tooltip/backgroundcolor-solid/ Yellowish background
		 * @sample {highcharts} highcharts/tooltip/backgroundcolor-gradient/ Gradient
		 * @sample {highcharts} highcharts/css/tooltip-border-background/ Tooltip in styled mode
		 * @sample {highstock} highcharts/tree/master/samples/stock/tooltip/general/ Custom tooltip
		 * @sample {highstock} highcharts/css/tooltip-border-background/ Tooltip in styled mode
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/background-border/ Background and border demo
		 * @sample {highmaps} highcharts/css/tooltip-border-background/ Tooltip in styled mode
		 * @default {all} rgba(247,247,247,0.85)
		 * @product highcharts highstock highmaps
		 */
		backgroundColor: color('${palette.neutralColor3}').setOpacity(0.85).get(),

		/**
		 * The pixel width of the tooltip border.
		 * 
		 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the stroke width is set in the `.highcharts-
		 * tooltip-box` class.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/tooltip/bordercolor-default/ 2px by default
		 * @sample {highcharts} highcharts/tooltip/borderwidth/ No border (shadow only)
		 * @sample {highcharts} highcharts/css/tooltip-border-background/ Tooltip in styled mode
		 * @sample {highstock} highcharts/tree/master/samples/stock/tooltip/general/ Custom tooltip
		 * @sample {highstock} highcharts/css/tooltip-border-background/ Tooltip in styled mode
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/background-border/ Background and border demo
		 * @sample {highmaps} highcharts/css/tooltip-border-background/ Tooltip in styled mode
		 * @default {all} 1
		 * @product highcharts highstock highmaps
		 */
		borderWidth: 1,

		/**
		 * The HTML of the tooltip header line. Variables are enclosed by
		 * curly brackets. Available variables are `point.key`, `series.name`,
		 * `series.color` and other members from the `point` and `series`
		 * objects. The `point.key` variable contains the category name, x
		 * value or datetime string depending on the type of axis. For datetime
		 * axes, the `point.key` date format can be set using tooltip.xDateFormat.
		 * 
		 * 
		 * Defaults to `<span style="font-size: 10px">{point.key}</span><br/>`
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/tooltip/footerformat/ A HTML table in the tooltip
		 * @sample {highstock} highcharts/tooltip/footerformat/ A HTML table in the tooltip
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/format/ Format demo
		 * @product highcharts highstock highmaps
		 */
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',

		/**
		 * The HTML of the point's line in the tooltip. Variables are enclosed
		 * by curly brackets. Available variables are point.x, point.y, series.
		 * name and series.color and other properties on the same form. Furthermore,
		 * point.y can be extended by the `tooltip.valuePrefix` and `tooltip.
		 * valueSuffix` variables. This can also be overridden for each series,
		 * which makes it a good hook for displaying units.
		 * 
		 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), the dot is colored by a class name rather
		 * than the point color.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/tooltip/pointformat/ A different point format with value suffix
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/format/ Format demo
		 * @default {all} <span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>
		 * @since 2.2
		 * @product highcharts highstock highmaps
		 */
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',

		/**
		 * Whether to apply a drop shadow to the tooltip.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/tooltip/bordercolor-default/ True by default
		 * @sample {highcharts} highcharts/tooltip/shadow/ False
		 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/positioner/ Fixed tooltip position, border and shadow disabled
		 * @default {all} true
		 * @product highcharts highstock highmaps
		 */
		shadow: true,

		/**
		 * CSS styles for the tooltip. The tooltip can also be styled through
		 * the CSS class `.highcharts-tooltip`.
		 * 
		 * @type {CSSObject}
		 * @sample {highcharts} highcharts/tooltip/style/ Greater padding, bold text
		 * @default {all} { "color": "#333333", "cursor": "default", "fontSize": "12px", "pointerEvents": "none", "whiteSpace": "nowrap" }
		 * @product highcharts highstock highmaps
		 */
		style: {

			/**
			 */
			color: '${palette.neutralColor80}',

			/**
			 */
			cursor: 'default',

			/**
			 */
			fontSize: '12px',

			/**
			 */
			pointerEvents: 'none', // #1686 http://caniuse.com/#feat=pointer-events

			/**
			 */
			whiteSpace: 'nowrap'
		}
		/*= } =*/
		//xDateFormat: '%A, %b %e, %Y',
		//valueDecimals: null,
		//valuePrefix: '',
		//valueSuffix: ''
	},


	/**
	 * Highchart by default puts a credits label in the lower right corner
	 * of the chart. This can be changed using these options.
	 * 
	 * @product highcharts highstock highmaps
	 */
	credits: {

		/**
		 * Whether to show the credits text.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/credits/enabled-false/ Credits disabled
		 * @sample {highstock} highcharts/tree/master/samples/stock/credits/enabled/ Credits disabled
		 * @sample {highmaps} highcharts/tree/master/samples/maps/credits/enabled-false/ Credits disabled
		 * @default {all} true
		 * @product highcharts highstock highmaps
		 */
		enabled: true,

		/**
		 * The URL for the credits label.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/credits/href/ Custom URL and text
		 * @sample {highmaps} highcharts/tree/master/samples/maps/credits/customized/ Custom URL and text
		 * @default {highcharts} http://www.highcharts.com
		 * @default {highstock} "http://www.highcharts.com"
		 * @default {highmaps} http://www.highcharts.com
		 * @product highcharts highstock highmaps
		 */
		href: 'http://www.highcharts.com',

		/**
		 * Position configuration for the credits label.
		 * 
		 * @type {Object}
		 * @sample {highcharts} highcharts/credits/position-left/ Left aligned
		 * @sample {highcharts} highcharts/credits/position-left/ Left aligned
		 * @sample {highmaps} highcharts/tree/master/samples/maps/credits/customized/ Left aligned
		 * @sample {highmaps} highcharts/tree/master/samples/maps/credits/customized/ Left aligned
		 * @since 2.1
		 * @product highcharts highstock highmaps
		 */
		position: {

			/**
			 * Horizontal alignment of the credits.
			 * 
			 * @validvalue ["left", "center", "right"]
			 * @type {String}
			 * @default {all} right
			 * @product highcharts highstock highmaps
			 */
			align: 'right',

			/**
			 * Horizontal pixel offset of the credits.
			 * 
			 * @type {Number}
			 * @default {all} -10
			 * @product highcharts highstock highmaps
			 */
			x: -10,

			/**
			 * Vertical alignment of the credits.
			 * 
			 * @validvalue ["top", "middle", "bottom"]
			 * @type {String}
			 * @default {all} bottom
			 * @product highcharts highstock highmaps
			 */
			verticalAlign: 'bottom',

			/**
			 * Vertical pixel offset of the credits.
			 * 
			 * @type {Number}
			 * @default {all} -5
			 * @product highcharts highstock highmaps
			 */
			y: -5
		},
		/*= if (build.classic) { =*/

		/**
		 * CSS styles for the credits label.
		 * 
		 * @type {CSSObject}
		 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
		 * style/style-by-css), credits styles can be set with the `.highcharts-
		 * credits` class.
		 * @default {all} { "cursor": "pointer", "color": "#999999", "fontSize": "10px" }
		 * @product highcharts highstock highmaps
		 */
		style: {

			/**
			 */
			cursor: 'pointer',

			/**
			 */
			color: '${palette.neutralColor40}',

			/**
			 */
			fontSize: '9px'
		},
		/*= } =*/

		/**
		 * The text for the credits label.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/credits/href/ Custom URL and text
		 * @sample {highmaps} highcharts/tree/master/samples/maps/credits/customized/ Custom URL and text
		 * @default {all} Highcharts.com
		 * @product highcharts highstock highmaps
		 */
		text: 'Highcharts.com'
	}
};



/**
 * Sets the getTimezoneOffset function. If the timezone option is set, a default
 * getTimezoneOffset function with that timezone is returned. If not, the
 * specified getTimezoneOffset function is returned. If neither are specified,
 * undefined is returned.
 * @return {function} a getTimezoneOffset function or undefined
 */
function getTimezoneOffsetOption() {
	var globalOptions = H.defaultOptions.global,
		moment = win.moment;

	if (globalOptions.timezone) {
		if (!moment) {
			// getTimezoneOffset-function stays undefined because it depends on
			// Moment.js
			H.error(25);
			
		} else {
			return function (timestamp) {
				return -moment.tz(
					timestamp,
					globalOptions.timezone
				).utcOffset();
			};
		}
	}

	// If not timezone is set, look for the getTimezoneOffset callback
	return globalOptions.useUTC && globalOptions.getTimezoneOffset;
}

/**
 * Set the time methods globally based on the useUTC option. Time method can be
 *   either local time or UTC (default). It is called internally on initiating
 *   Highcharts and after running `Highcharts.setOptions`.
 *
 * @private
 */
function setTimeMethods() {
	var globalOptions = H.defaultOptions.global,
		Date,
		useUTC = globalOptions.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	H.Date = Date = globalOptions.Date || win.Date; // Allow using a different Date class
	Date.hcTimezoneOffset = useUTC && globalOptions.timezoneOffset;
	Date.hcGetTimezoneOffset = getTimezoneOffsetOption();
	Date.hcMakeTime = function (year, month, date, hours, minutes, seconds) {
		var d;
		if (useUTC) {
			d = Date.UTC.apply(0, arguments);
			d += getTZOffset(d);
		} else {
			d = new Date(
				year,
				month,
				pick(date, 1),
				pick(hours, 0),
				pick(minutes, 0),
				pick(seconds, 0)
			).getTime();
		}
		return d;
	};
	each(['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcGet' + s] = GET + s;
	});
	each(['Milliseconds', 'Seconds', 'Minutes', 'Hours', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcSet' + s] = SET + s;
	});
}

/**
 * Merge the default options with custom options and return the new options
 * structure. Commonly used for defining reusable templates.
 *
 * @function #setOptions
 * @memberOf  Highcharts
 * @sample highcharts/global/useutc-false Setting a global option
 * @sample highcharts/members/setoptions Applying a global theme
 * @param {Object} options The new custom chart options.
 * @returns {Object} Updated options.
 */
H.setOptions = function (options) {
	
	// Copy in the default options
	H.defaultOptions = merge(true, H.defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return H.defaultOptions;
};

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions for outside modules
 * wasn't enough because the setOptions method created a new object.
 */
H.getOptions = function () {
	return H.defaultOptions;
};


// Series defaults
H.defaultPlotOptions = H.defaultOptions.plotOptions;

// set the default time methods
setTimeMethods();
