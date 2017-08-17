/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Options.js';
import './Legend.js';
import './Point.js';
import './SvgRenderer.js';
var addEvent = H.addEvent,
	animObject = H.animObject,
	arrayMax = H.arrayMax,
	arrayMin = H.arrayMin,
	correctFloat = H.correctFloat,
	Date = H.Date,
	defaultOptions = H.defaultOptions,
	defaultPlotOptions = H.defaultPlotOptions,
	defined = H.defined,
	each = H.each,
	erase = H.erase,
	extend = H.extend,
	fireEvent = H.fireEvent,
	grep = H.grep,
	isArray = H.isArray,
	isNumber = H.isNumber,
	isString = H.isString,
	LegendSymbolMixin = H.LegendSymbolMixin, // @todo add as a requirement
	merge = H.merge,
	objectEach = H.objectEach,
	pick = H.pick,
	Point = H.Point, // @todo  add as a requirement
	removeEvent = H.removeEvent,
	splat = H.splat,
	SVGElement = H.SVGElement,
	syncTimeout = H.syncTimeout,
	win = H.win;

/**
 * This is the base series prototype that all other series types inherit from.
 * A new series is initiated either through the {@link https://api.highcharts.com/highcharts/series|
 * series} option structure, or after the chart is initiated, through {@link
 * Highcharts.Chart#addSeries}.
 *
 * The object can be accessed in a number of ways. All series and point event
 * handlers give a reference to the `series` object. The chart object has a
 * {@link Highcharts.Chart.series|series} property that is a collection of all
 * the chart's series. The point objects and axis objects also have the same
 * reference.
 *
 * Another way to reference the series programmatically is by `id`. Add an id
 * in the series configuration options, and get the series object by {@link
 * Highcharts.Chart#get}.
 *
 * Configuration options for the series are given in three levels. Options for
 * all series in a chart are given in the {@link https://api.highcharts.com/highcharts/plotOptions.series|
 * plotOptions.series} object. Then options for all series of a specific type
 * are given in the plotOptions of that type, for example `plotOptions.line`.
 * Next, options for one single series are given in the series array, or as
 * arguements to `chart.addSeries`.
 *
 * The data in the series is stored in various arrays.
 *
 * - First, `series.options.data` contains all the original config options for
 * each point whether added by options or methods like `series.addPoint`.
 * - Next, `series.data` contains those values converted to points, but in case
 * the series data length exceeds the `cropThreshold`, or if the data is grouped,
 * `series.data` doesn't contain all the points. It only contains the points that
 * have been created on demand.
 * - Then there's `series.points` that contains all currently visible point
 * objects. In case of cropping, the cropped-away points are not part of this
 * array. The `series.points` array starts at `series.cropStart` compared to
 * `series.data` and `series.options.data`. If however the series data is grouped,
 * these can't be correlated one to one.
 * - `series.xData` and `series.processedXData` contain clean x values, equivalent
 * to `series.data` and `series.points`.
 * - `series.yData` and `series.processedYData` contain clean y values, equivalent
 * to `series.data` and `series.points`.
 *
 * @class Highcharts.Series
 * @param  {Highcharts.Chart} chart
 *         The chart instance.
 * @param  {Options.plotOptions.series} options
 *         The series options.
 *
 */

H.Series = H.seriesType('line', null, 

/**
 * General options for all series types.
 * @optionparent plotOptions.series
 * @product highcharts highstock highmaps
 */
{ // base series options
	/*= if (build.classic) { =*/
	//cursor: 'default',
	//dashStyle: null,
	//linecap: 'round',



	/**
	 * Pixel with of the graph line.
	 * 
	 * @type {Number}
	 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the line stroke-width can be set with the
	 * `.highcharts-graph` class name.
	 * @sample {highcharts} highcharts/plotoptions/series-linewidth-general/ On all series
	 * @sample {highcharts} highcharts/plotoptions/series-linewidth-specific/ On one single series
	 * @default {all} 2
	 * @product highcharts highstock
	 */
	lineWidth: 2,
	//shadow: false,
	/*= } =*/



	/**
	 * Allow this series' points to be selected by clicking on the markers,
	 *  bars or pie slices.
	 * 
	 * @type {Boolean}
	 * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-line/ Line
	 * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-column/ Column
	 * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-pie/ Pie
	 * @sample {highmaps} maps/plotoptions/series-allowpointselect/ Map area
	 * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/ Map bubble
	 * @default {all} false
	 * @since 1.2.0
	 * @product highcharts highstock highmaps
	 */
	allowPointSelect: false,



	/**
	 * If true, a checkbox is displayed next to the legend item to allow
	 * selecting the series. The state of the checkbox is determined by
	 * the `selected` option.
	 * 
	 * @type {Boolean}
	 * @sample {highcharts} highcharts/plotoptions/series-showcheckbox-true/ Show select box
	 * @default {all} false
	 * @since 1.2.0
	 * @product highcharts highstock highmaps
	 */
	showCheckbox: false,



	/**
	 * Enable or disable the initial animation when a series is displayed.
	 * The animation can also be set as a configuration object. Please
	 * note that this option only applies to the initial animation of the
	 * series itself. For other animations, see [chart.animation](#chart.
	 * animation) and the animation parameter under the API methods. The
	 * following properties are supported:
	 * 
	 * <dl>
	 * 
	 * <dt>duration</dt>
	 * 
	 * <dd>The duration of the animation in milliseconds.</dd>
	 * 
	 * <dt>easing</dt>
	 * 
	 * <dd>A string reference to an easing function set on the `Math` object.
	 * See [the easing demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
	 * animation-easing/).</dd>
	 * 
	 * </dl>
	 * 
	 * Due to poor performance, animation is disabled in old IE browsers
	 * for column charts and polar charts.
	 * 
	 * @type {Boolean}
	 * @sample {highcharts} highcharts/plotoptions/series-animation-disabled/ Animation disabled
	 * @sample {highcharts} highcharts/plotoptions/series-animation-slower/ Slower animation
	 * @sample {highcharts} highcharts/plotoptions/series-animation-easing/ Custom easing function
	 * @sample {highstock} stock/plotoptions/animation-slower/ Slower animation
	 * @sample {highstock} stock/plotoptions/animation-easing/ Custom easing function
	 * @sample {highmaps} maps/plotoptions/series-animation-true/ Animation enabled on map series
	 * @sample {highmaps} maps/plotoptions/mapbubble-animation-false/ Disabled on mapbubble series
	 * @default {highcharts} true
	 * @default {highstock} true
	 * @default {highmaps} false
	 * @product highcharts highstock highmaps
	 */
	animation: {


		/**
		 */
		duration: 1000
	},
	//clip: true,
	//connectNulls: false,
	//enableMouseTracking: true,



	/**
	 * @product highcharts highstock highmaps
	 */
	events: {},
	//legendIndex: 0,
	// stacking: null,



	/**
	 * Options for the point markers of line-like series. Properties like
	 * `fillColor`, `lineColor` and `lineWidth` define the visual appearance
	 * of the markers. Other series types, like column series, don't have
	 * markers, but have visual options on the series level instead.
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the markers can be styled with the `.highcharts-
	 * point`, `.highcharts-point-hover` and `.highcharts-point-select`
	 * class names.
	 * 
	 * @product highcharts highstock
	 */
	marker: {
		/*= if (build.classic) { =*/


		/**
		 * The width of the point marker's outline.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/ 2px blue marker
		 * @default {all} 0
		 * @product highcharts highstock
		 */
		lineWidth: 0,


		/**
		 * The color of the point marker's outline. When `null`, the series'
		 * or point's color is used.
		 * 
		 * @type {Color}
		 * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/ Inherit from series color (null)
		 * @default {all} #ffffff
		 * @product highcharts highstock
		 */
		lineColor: '${palette.backgroundColor}',
		//fillColor: null,
		/*= } =*/
		//enabled: true,
		//symbol: null,


		/**
		 * The radius of the point marker.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/plotoptions/series-marker-radius/ Bigger markers
		 * @default {all} 4
		 * @product highcharts highstock
		 */
		radius: 4,


		/**
		 * @product highcharts highstock
		 */
		states: { // states for a single point



			/**
			 * @product highcharts highstock
			 */
			hover: {



				/**
				 */
				animation: {


					/**
					 */
					duration: 50
				},



				/**
				 * Enable or disable the point marker.
				 * 
				 * @type {Boolean}
				 * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-enabled/ Disabled hover state
				 * @default {all} true
				 * @product highcharts highstock
				 */
				enabled: true,



				/**
				 * The number of pixels to increase the radius of the hovered point.
				 * 
				 * @type {Number}
				 * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/ 5 pixels greater radius on hover
				 * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/ 5 pixels greater radius on hover
				 * @default {all} 2
				 * @since 4.0.3
				 * @product highcharts highstock
				 */
				radiusPlus: 2,
				/*= if (build.classic) { =*/



				/**
				 * The additional line width for a hovered point.
				 * 
				 * @type {Number}
				 * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/ 2 pixels wider on hover
				 * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/ 2 pixels wider on hover
				 * @default {all} 1
				 * @since 4.0.3
				 * @product highcharts highstock
				 */
				lineWidthPlus: 1
				/*= } =*/
			},
			/*= if (build.classic) { =*/



			/**
			 * The appearance of the point marker when selected. In order to
			 * allow a point to be selected, set the `series.allowPointSelect`
			 * option to true.
			 * 
			 * @product highcharts highstock
			 */
			select: {



				/**
				 * The fill color of the point marker.
				 * 
				 * @type {Color}
				 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-fillcolor/ Solid red discs for selected points
				 * @default {all} null
				 * @product highcharts highstock
				 */
				fillColor: '${palette.neutralColor20}',



				/**
				 * The color of the point marker's outline. When `null`, the series'
				 * or point's color is used.
				 * 
				 * @type {Color}
				 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linecolor/ Red line color for selected points
				 * @default {all} #000000
				 * @product highcharts highstock
				 */
				lineColor: '${palette.neutralColor100}',



				/**
				 * The width of the point marker's outline.
				 * 
				 * @type {Number}
				 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linewidth/ 3px line width for selected points
				 * @default {all} 0
				 * @product highcharts highstock
				 */
				lineWidth: 2
			}
			/*= } =*/
		}
	},



	/**
	 * Properties for each single point
	 * 
	 * @product highcharts highstock highmaps
	 */
	point: {


		/**
		 * Events for each single point
		 * 
		 * @product highcharts highstock highmaps
		 */
		events: {}
	},



	/**
	 * Options for the series data labels, appearing next to each data
	 * point.
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the data labels can be styled wtih the `.highcharts-
	 * data-label-box` and `.highcharts-data-label` class names ([see example](http://jsfiddle.
	 * net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-
	 * datalabels)).
	 * 
	 * @extends xAxis.labels
	 * @excluding autoRotation,autoRotationLimit,distance,maxStaggerLines,reserveSpace,staggerLines,step
	 * @product highcharts highstock highmaps
	 */
	dataLabels: {


		/**
		 * The alignment of the data label compared to the point. If `right`,
		 * the right side of the label should be touching the point. For
		 * points with an extent, like columns, the alignments also dictates
		 * how to align it inside the box, as given with the [inside](#plotOptions.
		 * column.dataLabels.inside) option. Can be one of "left", "center"
		 * or "right".
		 * 
		 * @validvalue ["left", "center", "right"]
		 * @type {String}
		 * @sample {highcharts} highcharts/plotoptions/series-datalabels-align-left/ Left aligned
		 * @default {all} center
		 * @product highcharts highstock highmaps
		 */
		align: 'center',
		// defer: true,
		// enabled: false,


		/**
		 * Callback JavaScript function to format the data label. Note that
		 * if a `format` is defined, the format takes precedence and the formatter
		 * is ignored. Available data are:
		 * 
		 * <table>
		 * 
		 * <tbody>
		 * 
		 * <tr>
		 * 
		 * <td>`this.percentage`</td>
		 * 
		 * <td>Stacked series and pies only. The point's percentage of the
		 * total.</td>
		 * 
		 * </tr>
		 * 
		 * <tr>
		 * 
		 * <td>`this.point`</td>
		 * 
		 * <td>The point object. The point name, if defined, is available
		 * through `this.point.name`.</td>
		 * 
		 * </tr>
		 * 
		 * <tr>
		 * 
		 * <td>`this.series`:</td>
		 * 
		 * <td>The series object. The series name is available through `this.
		 * series.name`.</td>
		 * 
		 * </tr>
		 * 
		 * <tr>
		 * 
		 * <td>`this.total`</td>
		 * 
		 * <td>Stacked series only. The total value at this point's x value.
		 * </td>
		 * 
		 * </tr>
		 * 
		 * <tr>
		 * 
		 * <td>`this.x`:</td>
		 * 
		 * <td>The x value.</td>
		 * 
		 * </tr>
		 * 
		 * <tr>
		 * 
		 * <td>`this.y`:</td>
		 * 
		 * <td>The y value.</td>
		 * 
		 * </tr>
		 * 
		 * </tbody>
		 * 
		 * </table>
		 * 
		 * @type {Function}
		 * @sample {highmaps} maps/plotoptions/series-datalabels-format/ Formatted value
		 * @product highcharts highstock highmaps
		 */
		formatter: function () {
			return this.y === null ? '' : H.numberFormat(this.y, -1);
		},
		/*= if (build.classic) { =*/


		/**
		 * Styles for the label. The default `color` setting is `"contrast"`,
		 * which is a pseudo color that Highcharts picks up and applies the
		 * maximum contrast to the underlying point item, for example the
		 * bar in a bar chart. The `textOutline` is a pseudo property that
		 * applies an outline of the given width with the given color, which
		 * by default is the maximum contrast to the text. So a bright text
		 * color will result in a black text outline for maximum readability
		 * on a mixed background. In some cases, especially with grayscale
		 * text, the text outline doesn't work well, in which cases it can
		 * be disabled by setting it to `"none"`.
		 * 
		 * @type {CSSObject}
		 * @sample {highcharts} highcharts/plotoptions/series-datalabels-style/ Bold labels
		 * @sample {highmaps} maps/demo/color-axis/ Bold labels
		 * @default {all} {"color": "contrast", "fontSize": "11px", "fontWeight": "bold", "textOutline": "1px contrast" }
		 * @since 4.1.0
		 * @product highcharts highstock highmaps
		 */
		style: {



			/**
			 */
			fontSize: '11px',



			/**
			 */
			fontWeight: 'bold',



			/**
			 */
			color: 'contrast',



			/**
			 */
			textOutline: '1px contrast'
		},
		// backgroundColor: undefined,
		// borderColor: undefined,
		// borderWidth: undefined,
		// shadow: false
		/*= } =*/


		/**
		 * The vertical alignment of a data label. Can be one of `top`, `middle`
		 * or `bottom`. The default value depends on the data, for instance
		 * in a column chart, the label is above positive values and below
		 * negative values.
		 * 
		 * @validvalue ["top", "middle", "bottom"]
		 * @type {String}
		 * @since 2.3.3
		 * @product highcharts highstock highmaps
		 */
		verticalAlign: 'bottom', // above singular point


		/**
		 * The x position offset of the label relative to the point.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/ Vertical and positioned
		 * @default {all} 0
		 * @product highcharts highstock highmaps
		 */
		x: 0,


		/**
		 * The y position offset of the label relative to the point.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/ Vertical and positioned
		 * @default {all} -6
		 * @product highcharts highstock highmaps
		 */
		y: 0,
		// borderRadius: undefined,


		/**
		 * When either the `borderWidth` or the `backgroundColor` is set,
		 * this is the padding within the box.
		 * 
		 * @type {Number}
		 * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/ Data labels box options
		 * @sample {highstock} highcharts/plotoptions/series-datalabels-box/ Data labels box options
		 * @sample {highmaps} maps/plotoptions/series-datalabels-box/ Data labels box options
		 * @default {highcharts} 5
		 * @default {highstock} 5
		 * @default {highmaps} 0
		 * @since 2.2.1
		 * @product highcharts highstock highmaps
		 */
		padding: 5
	},
	// draw points outside the plot area when the number of points is less than
	// this



	/**
	 * When the series contains less points than the crop threshold, all
	 * points are drawn, even if the points fall outside the visible plot
	 * area at the current zoom. The advantage of drawing all points (including
	 * markers and columns), is that animation is performed on updates.
	 * On the other hand, when the series contains more points than the
	 * crop threshold, the series data is cropped to only contain points
	 * that fall within the plot area. The advantage of cropping away invisible
	 * points is to increase performance on large series.
	 * 
	 * @type {Number}
	 * @default {all} 300
	 * @since 2.2
	 * @product highcharts highstock
	 */
	cropThreshold: 300,



	/**
	 * The width of each point on the x axis. For example in a column chart
	 * with one value each day, the pointRange would be 1 day (= 24 * 3600
	 * * 1000 milliseconds). This is normally computed automatically, but
	 * this option can be used to override the automatic value.
	 * 
	 * @type {Number}
	 * @default {all} 0
	 * @product highstock
	 */
	pointRange: 0,
	//pointStart: 0,
	//pointInterval: 1,
	//showInLegend: null, // auto = false for linked series



	/**
	 * When this is true, the series will not cause the Y axis to cross
	 * the zero plane (or [threshold](#plotOptions.series.threshold) option)
	 * unless the data actually crosses the plane.
	 * 
	 * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
	 * 3 will make the Y axis show negative values according to the `minPadding`
	 * option. If `softThreshold` is `true`, the Y axis starts at 0.
	 * 
	 * @type {Boolean}
	 * @default {all} true
	 * @since 4.1.9
	 * @product highcharts highstock
	 */
	softThreshold: true,



	/**
	 * A wrapper object for all the series options in specific states.
	 * 
	 * @type {plotOptions.series.states}
	 * @product highcharts highstock highmaps
	 */
	states: { // states for the entire series


		/**
		 * Options for the hovered series
		 * 
		 * @product highcharts highstock highmaps
		 */
		hover: {
			//enabled: false,



			/**
			 * Animation setting for hovering the graph in line-type series.
			 * 
			 * @type {Boolean|Object}
			 * @default {all} { "duration": 50 }
			 * @since 5.0.8
			 * @product highcharts
			 */
			animation: {



				/**
				 */
				duration: 50
			},



			/**
			 * The additional line width for the graph of a hovered series.
			 * 
			 * @type {Number}
			 * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/ 5 pixels wider
			 * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/ 5 pixels wider
			 * @default {all} 1
			 * @since 4.0.3
			 * @product highcharts highstock
			 */
			lineWidthPlus: 1,



			/**
			 * In Highcharts 1.0, the appearance of all markers belonging to
			 * the hovered series. For settings on the hover state of the individual
			 * point, see [marker.states.hover](#plotOptions.series.marker.states.
			 * hover).
			 * 
			 * @extends plotOptions.series.marker
			 * @deprecated
			 * @product highcharts highstock
			 */
			marker: {
				// lineWidth: base + 1,
				// radius: base + 1
			},



			/**
			 * Options for the halo appearing around the hovered point in line-
			 * type series as well as outside the hovered slice in pie charts.
			 * By default the halo is filled by the current point or series
			 * color with an opacity of 0.25\. The halo can be disabled by setting
			 * the `halo` option to `false`.
			 * 
			 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
			 * style/style-by-css), the halo is styled with the `.highcharts-
			 * halo` class, with colors inherited from `.highcharts-color-{n}`.
			 * 
			 * @type {Object}
			 * @sample {highcharts} highcharts/plotoptions/halo/ Halo options
			 * @sample {highstock} highcharts/plotoptions/halo/ Halo options
			 * @since 4.0
			 * @product highcharts highstock
			 */
			halo: {



				/**
				 * The pixel size of the halo. For point markers this is the radius
				 * of the halo. For pie slices it is the width of the halo outside
				 * the slice. For bubbles it defaults to 5 and is the width of the
				 * halo outside the bubble.
				 * 
				 * @type {Number}
				 * @default {all} 10
				 * @since 4.0
				 * @product highcharts highstock
				 */
				size: 10,
				/*= if (build.classic) { =*/



				/**
				 * Opacity for the halo unless a specific fill is overridden using
				 * the `attributes` setting. Note that Highcharts is only able to
				 * apply opacity to colors of hex or rgb(a) formats.
				 * 
				 * @type {Number}
				 * @default {all} 0.25
				 * @since 4.0
				 * @product highcharts highstock
				 */
				opacity: 0.25
				/*= } =*/
			}
		},


		/**
		 * Specific options for point in selected states, after being selected
		 * by [allowPointSelect](#plotOptions.series.allowPointSelect) or
		 * programmatically.
		 * 
		 * @type {Object}
		 * @extends plotOptions.series.states.hover
		 * @excluding brightness
		 * @sample {highmaps} maps/plotoptions/series-allowpointselect/ Allow point select demo
		 * @product highmaps
		 */
		select: {



			/**
			 */
			marker: {}
		}
	},



	/**
	 * Sticky tracking of mouse events. When true, the `mouseOut` event
	 * on a series isn't triggered until the mouse moves over another series,
	 * or out of the plot area. When false, the `mouseOut` event on a
	 * series is triggered when the mouse leaves the area around the series'
	 * graph or markers. This also implies the tooltip. When `stickyTracking`
	 * is false and `tooltip.shared` is false, the tooltip will be hidden
	 * when moving the mouse between series. Defaults to true for line
	 * and area type series, but to false for columns, pies etc.
	 * 
	 * @type {Boolean}
	 * @sample {highcharts} highcharts/plotoptions/series-stickytracking-true/ True by default
	 * @sample {highcharts} highcharts/plotoptions/series-stickytracking-false/ False
	 * @default {highcharts} true
	 * @default {highstock} true
	 * @default {highmaps} false
	 * @since 2.0
	 * @product highcharts highstock highmaps
	 */
	stickyTracking: true,
	//tooltip: {
		//pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
		// '{series.name}: <b>{point.y}</b>'
		//valueDecimals: null,
		//xDateFormat: '%A, %b %e, %Y',
		//valuePrefix: '',
		//ySuffix: ''
	//}



	/**
	 * When a series contains a data array that is longer than this, only
	 * one dimensional arrays of numbers, or two dimensional arrays with
	 * x and y values are allowed. Also, only the first point is tested,
	 * and the rest are assumed to be the same format. This saves expensive
	 * data checking and indexing in long series. Set it to `0` disable.
	 * 
	 * @type {Number}
	 * @default {all} 1000
	 * @since 2.2
	 * @product highcharts highstock
	 */
	turboThreshold: 1000,
	// zIndex: null



	/**
	 * Determines whether the series should look for the nearest point
	 * in both dimensions or just the x-dimension when hovering the series.
	 * Defaults to `'xy'` for scatter series and `'x'` for most other
	 * series. If the data has duplicate x-values, it is recommended to
	 * set this to `'xy'` to allow hovering over all points.
	 * 
	 * Applies only to series types using nearest neighbor search (not
	 * direct hover) for tooltip.
	 * 
	 * @validvalue ['x', 'xy']
	 * @type {String}
	 * @sample {highcharts} highcharts/series/findnearestpointby/ Different hover behaviors
	 * @sample {highstock} highcharts/series/findnearestpointby/ Different hover behaviors
	 * @sample {highmaps} highcharts/series/findnearestpointby/ Different hover behaviors
	 * @since 5.0.10
	 * @product highcharts highstock highmaps
	 */
	findNearestPointBy: 'x'

}, /** @lends Highcharts.Series.prototype */ {
	isCartesian: true,
	pointClass: Point,
	sorted: true, // requires the data to be sorted
	requireSorting: true,
	directTouch: false,
	axisTypes: ['xAxis', 'yAxis'],
	colorCounter: 0,
	// each point's x and y values are stored in this.xData and this.yData
	parallelArrays: ['x', 'y'],
	coll: 'series',
	init: function (chart, options) {
		var series = this,
			events,
			chartSeries = chart.series,
			lastSeries;

		/**
		 * Read only. The chart that the series belongs to.
		 *
		 * @name chart
		 * @memberOf Series
		 * @type {Chart}
		 */
		series.chart = chart;

		/**
		 * Read only. The series' type, like "line", "area", "column" etc. The
		 * type in the series options anc can be altered using {@link
		 * Series#update}.
		 *
		 * @name type
		 * @memberOf Series
		 * @type String
		 */

		/**
		 * Read only. The series' current options. To update, use {@link
		 * Series#update}.
		 *
		 * @name options
		 * @memberOf Series
		 * @type SeriesOptions
		 */
		series.options = options = series.setOptions(options);
		series.linkedSeries = [];

		// bind the axes
		series.bindAxes();

		// set some variables
		extend(series, {
			/**
			 * The series name as given in the options. Defaults to
			 * "Series {n}".
			 *
			 * @name name
			 * @memberOf Series
			 * @type {String}
			 */
			name: options.name,
			state: '',
			/**
			 * Read only. The series' visibility state as set by {@link
			 * Series#show}, {@link Series#hide}, or in the initial
			 * configuration.
			 *
			 * @name visible
			 * @memberOf Series
			 * @type {Boolean}
			 */
			visible: options.visible !== false, // true by default
			/**
			 * Read only. The series' selected state as set by {@link
			 * Highcharts.Series#select}.
			 *
			 * @name selected
			 * @memberOf Series
			 * @type {Boolean}
			 */
			selected: options.selected === true // false by default
		});

		// register event listeners
		events = options.events;

		objectEach(events, function (event, eventType) {
			addEvent(series, eventType, event);
		});
		if (
			(events && events.click) ||
			(
				options.point &&
				options.point.events &&
				options.point.events.click
			) ||
			options.allowPointSelect
		) {
			chart.runTrackerClick = true;
		}

		series.getColor();
		series.getSymbol();

		// Set the data
		each(series.parallelArrays, function (key) {
			series[key + 'Data'] = [];
		});
		series.setData(options.data, false);

		// Mark cartesian
		if (series.isCartesian) {
			chart.hasCartesianSeries = true;
		}

		// Get the index and register the series in the chart. The index is one
		// more than the current latest series index (#5960).
		if (chartSeries.length) {
			lastSeries = chartSeries[chartSeries.length - 1];
		}
		series._i = pick(lastSeries && lastSeries._i, -1) + 1;

		// Insert the series and re-order all series above the insertion point.
		chart.orderSeries(this.insert(chartSeries));
	},

	/**
	 * Insert the series in a collection with other series, either the chart
	 * series or yAxis series, in the correct order according to the index
	 * option. Used internally when adding series.
	 *
	 * @private
	 * @param   {Array.<Series>} collection
	 *          A collection of series, like `chart.series` or `xAxis.series`.
	 * @returns {Number} The index of the series in the collection.
	 */
	insert: function (collection) {
		var indexOption = this.options.index,
			i;

		// Insert by index option
		if (isNumber(indexOption)) {
			i = collection.length;
			while (i--) {
				// Loop down until the interted element has higher index
				if (indexOption >=
						pick(collection[i].options.index, collection[i]._i)) {
					collection.splice(i + 1, 0, this);
					break;
				}
			}
			if (i === -1) {
				collection.unshift(this);
			}
			i = i + 1;

		// Or just push it to the end
		} else {
			collection.push(this);
		}
		return pick(i, collection.length - 1);
	},

	/**
	 * Set the xAxis and yAxis properties of cartesian series, and register the
	 * series in the `axis.series` array.
	 *
	 * @private
	 */
	bindAxes: function () {
		var series = this,
			seriesOptions = series.options,
			chart = series.chart,
			axisOptions;

		// repeat for xAxis and yAxis
		each(series.axisTypes || [], function (AXIS) {

			// loop through the chart's axis objects
			each(chart[AXIS], function (axis) {
				axisOptions = axis.options;

				// apply if the series xAxis or yAxis option mathches the number
				// of the axis, or if undefined, use the first axis
				if (
					seriesOptions[AXIS] === axisOptions.index ||
					(
						seriesOptions[AXIS] !== undefined &&
						seriesOptions[AXIS] === axisOptions.id
					) ||
					(
						seriesOptions[AXIS] === undefined &&
						axisOptions.index === 0
					)
				) {

					// register this series in the axis.series lookup
					series.insert(axis.series);

					// set this series.xAxis or series.yAxis reference
					/**
					 * Read only. The unique xAxis object associated with the
					 * series.
					 *
					 * @name xAxis
					 * @memberOf Series
					 * @type Axis
					 */
					/**
					 * Read only. The unique yAxis object associated with the
					 * series.
					 *
					 * @name yAxis
					 * @memberOf Series
					 * @type Axis
					 */
					series[AXIS] = axis;

					// mark dirty for redraw
					axis.isDirty = true;
				}
			});

			// The series needs an X and an Y axis
			if (!series[AXIS] && series.optionalAxis !== AXIS) {
				H.error(18, true);
			}

		});
	},

	/**
	 * For simple series types like line and column, the data values are held in
	 * arrays like xData and yData for quick lookup to find extremes and more.
	 * For multidimensional series like bubble and map, this can be extended
	 * with arrays like zData and valueData by adding to the
	 * `series.parallelArrays` array.
	 *
	 * @private
	 */
	updateParallelArrays: function (point, i) {
		var series = point.series,
			args = arguments,
			fn = isNumber(i) ?
				// Insert the value in the given position
				function (key) {
					var val = key === 'y' && series.toYData ?
						series.toYData(point) :
						point[key];
					series[key + 'Data'][i] = val;
				} :
				// Apply the method specified in i with the following arguments
				// as arguments
				function (key) {
					Array.prototype[i].apply(
						series[key + 'Data'],
						Array.prototype.slice.call(args, 2)
					);
				};

		each(series.parallelArrays, fn);
	},

	/**
	 * Return an auto incremented x value based on the pointStart and
	 * pointInterval options. This is only used if an x value is not given for
	 * the point that calls autoIncrement.
	 *
	 * @private
	 */
	autoIncrement: function () {

		var options = this.options,
			xIncrement = this.xIncrement,
			date,
			pointInterval,
			pointIntervalUnit = options.pointIntervalUnit;

		xIncrement = pick(xIncrement, options.pointStart, 0);

		this.pointInterval = pointInterval = pick(
			this.pointInterval,
			options.pointInterval,
			1
		);

		// Added code for pointInterval strings
		if (pointIntervalUnit) {
			date = new Date(xIncrement);

			if (pointIntervalUnit === 'day') {
				date = +date[Date.hcSetDate](
					date[Date.hcGetDate]() + pointInterval
				);
			} else if (pointIntervalUnit === 'month') {
				date = +date[Date.hcSetMonth](
					date[Date.hcGetMonth]() + pointInterval
				);
			} else if (pointIntervalUnit === 'year') {
				date = +date[Date.hcSetFullYear](
					date[Date.hcGetFullYear]() + pointInterval
				);
			}
			pointInterval = date - xIncrement;

		}

		this.xIncrement = xIncrement + pointInterval;
		return xIncrement;
	},

	/**
	 * Set the series options by merging from the options tree. Called
	 * internally on initiating and updating series. This function will not
	 * redraw the series. For API usage, use {@link Series#update}.
	 * 
	 * @param  {Options.plotOptions.series} itemOptions
	 *         The series options.
	 */
	setOptions: function (itemOptions) {
		var chart = this.chart,
			chartOptions = chart.options,
			plotOptions = chartOptions.plotOptions,
			userOptions = chart.userOptions || {},
			userPlotOptions = userOptions.plotOptions || {},
			typeOptions = plotOptions[this.type],
			options,
			zones;

		this.userOptions = itemOptions;

		// General series options take precedence over type options because
		// otherwise, default type options like column.animation would be
		// overwritten by the general option. But issues have been raised here
		// (#3881), and the solution may be to distinguish between default
		// option and userOptions like in the tooltip below.
		options = merge(
			typeOptions,
			plotOptions.series,
			itemOptions
		);

		// The tooltip options are merged between global and series specific
		// options. Importance order asscendingly:
		// globals: (1)tooltip, (2)plotOptions.series, (3)plotOptions[this.type]
		// init userOptions with possible later updates: 4-6 like 1-3 and
		// (7)this series options
		this.tooltipOptions = merge(
			defaultOptions.tooltip, // 1
			defaultOptions.plotOptions.series &&
				defaultOptions.plotOptions.series.tooltip, // 2
			defaultOptions.plotOptions[this.type].tooltip, // 3
			chartOptions.tooltip.userOptions, // 4
			plotOptions.series && plotOptions.series.tooltip, // 5
			plotOptions[this.type].tooltip, // 6
			itemOptions.tooltip // 7
		);

		// When shared tooltip, stickyTracking is true by default,
		// unless user says otherwise.
		this.stickyTracking = pick(
			itemOptions.stickyTracking,
			userPlotOptions[this.type] &&
				userPlotOptions[this.type].stickyTracking,
			userPlotOptions.series && userPlotOptions.series.stickyTracking,
			(
				this.tooltipOptions.shared && !this.noSharedTooltip ?
				true :
				options.stickyTracking
			)
		);

		// Delete marker object if not allowed (#1125)
		if (typeOptions.marker === null) {
			delete options.marker;
		}

		// Handle color zones
		this.zoneAxis = options.zoneAxis;
		zones = this.zones = (options.zones || []).slice();
		if (
			(options.negativeColor || options.negativeFillColor) &&
			!options.zones
		) {
			zones.push({
				value:
					options[this.zoneAxis + 'Threshold'] ||
					options.threshold ||
					0,
				className: 'highcharts-negative',
				/*= if (build.classic) { =*/
				color: options.negativeColor,
				fillColor: options.negativeFillColor
				/*= } =*/
			});
		}
		if (zones.length) { // Push one extra zone for the rest
			if (defined(zones[zones.length - 1].value)) {
				zones.push({
					/*= if (build.classic) { =*/
					color: this.color,
					fillColor: this.fillColor
					/*= } =*/
				});
			}
		}
		return options;
	},

	getCyclic: function (prop, value, defaults) {
		var i,
			chart = this.chart,
			userOptions = this.userOptions,
			indexName = prop + 'Index',
			counterName = prop + 'Counter',
			len = defaults ? defaults.length : pick(
				chart.options.chart[prop + 'Count'],
				chart[prop + 'Count']
			),
			setting;

		if (!value) {
			// Pick up either the colorIndex option, or the _colorIndex after
			// Series.update()
			setting = pick(
				userOptions[indexName],
				userOptions['_' + indexName]
			);
			if (defined(setting)) { // after Series.update()
				i = setting;
			} else {
				// #6138
				if (!chart.series.length) {
					chart[counterName] = 0;
				}
				userOptions['_' + indexName] = i = chart[counterName] % len;
				chart[counterName] += 1;
			}
			if (defaults) {
				value = defaults[i];
			}
		}
		// Set the colorIndex
		if (i !== undefined) {
			this[indexName] = i;
		}
		this[prop] = value;
	},

	/**
	 * Get the series' color based on either the options or pulled from global
	 * options.
	 *
	 * @return  {Color} The series color.
	 */
	/*= if (!build.classic) { =*/
	getColor: function () {
		this.getCyclic('color');
	},

	/*= } else { =*/
	getColor: function () {
		if (this.options.colorByPoint) {
			// #4359, selected slice got series.color even when colorByPoint was
			// set.
			this.options.color = null;
		} else {
			this.getCyclic(
				'color',
				this.options.color || defaultPlotOptions[this.type].color,
				this.chart.options.colors
			);
		}
	},
	/*= } =*/
	/**
	 * Get the series' symbol based on either the options or pulled from global
	 * options.
	 */
	getSymbol: function () {
		var seriesMarkerOption = this.options.marker;

		this.getCyclic(
			'symbol',
			seriesMarkerOption.symbol,
			this.chart.options.symbols
		);
	},

	drawLegendSymbol: LegendSymbolMixin.drawLineMarker,

	/**
	 * Apply a new set of data to the series and optionally redraw it. The new
	 * data array is passed by reference (except in case of `updatePoints`), and
	 * may later be mutated when updating the chart data.
	 *
	 * Note the difference in behaviour when setting the same amount of points,
	 * or a different amount of points, as handled by the `updatePoints`
	 * parameter.
	 *
	 * @param  {SeriesDataOptions} data
	 *         Takes an array of data in the same format as described under
	 *         `series<type>data` for the given series type.
	 * @param  {Boolean} [redraw=true]
	 *         Whether to redraw the chart after the series is altered. If doing
	 *         more operations on the chart, it is a good idea to set redraw to
	 *         false and call {@link Chart#redraw} after.
	 * @param  {AnimationOptions} [animation]
	 *         When the updated data is the same length as the existing data,
	 *         points will be updated by default, and animation visualizes how
	 *         the points are changed. Set false to disable animation, or a
	 *         configuration object to set duration or easing.
	 * @param  {Boolean} [updatePoints=true]
	 *         When the updated data is the same length as the existing data,
	 *         points will be updated instead of replaced. This allows updating
	 *         with animation and performs better. In this case, the original
	 *         array is not passed by reference. Set false to prevent.
	 *
	 * @sample highcharts/members/series-setdata/
	 *         Set new data from a button
	 * @sample highcharts/members/series-setdata-pie/
	 *         Set data in a pie
	 * @sample stock/members/series-setdata/
	 *         Set new data in Highstock
	 * @sample maps/members/series-setdata/
	 *         Set new data in Highmaps
	 */
	setData: function (data, redraw, animation, updatePoints) {
		var series = this,
			oldData = series.points,
			oldDataLength = (oldData && oldData.length) || 0,
			dataLength,
			options = series.options,
			chart = series.chart,
			firstPoint = null,
			xAxis = series.xAxis,
			i,
			turboThreshold = options.turboThreshold,
			pt,
			xData = this.xData,
			yData = this.yData,
			pointArrayMap = series.pointArrayMap,
			valueCount = pointArrayMap && pointArrayMap.length;

		data = data || [];
		dataLength = data.length;
		redraw = pick(redraw, true);

		// If the point count is the same as is was, just run Point.update which
		// is cheaper, allows animation, and keeps references to points.
		if (
			updatePoints !== false &&
			dataLength &&
			oldDataLength === dataLength &&
			!series.cropped &&
			!series.hasGroupedData &&
			series.visible
		) {
			each(data, function (point, i) {
				// .update doesn't exist on a linked, hidden series (#3709)
				if (oldData[i].update && point !== options.data[i]) {
					oldData[i].update(point, false, null, false);
				}
			});

		} else {

			// Reset properties
			series.xIncrement = null;

			series.colorCounter = 0; // for series with colorByPoint (#1547)

			// Update parallel arrays
			each(this.parallelArrays, function (key) {
				series[key + 'Data'].length = 0;
			});

			// In turbo mode, only one- or twodimensional arrays of numbers are
			// allowed. The first value is tested, and we assume that all the
			// rest are defined the same way. Although the 'for' loops are
			// similar, they are repeated inside each if-else conditional for
			// max performance.
			if (turboThreshold && dataLength > turboThreshold) {

				// find the first non-null point
				i = 0;
				while (firstPoint === null && i < dataLength) {
					firstPoint = data[i];
					i++;
				}


				if (isNumber(firstPoint)) { // assume all points are numbers
					for (i = 0; i < dataLength; i++) {
						xData[i] = this.autoIncrement();
						yData[i] = data[i];
					}

				// Assume all points are arrays when first point is
				} else if (isArray(firstPoint)) {
					if (valueCount) { // [x, low, high] or [x, o, h, l, c]
						for (i = 0; i < dataLength; i++) {
							pt = data[i];
							xData[i] = pt[0];
							yData[i] = pt.slice(1, valueCount + 1);
						}
					} else { // [x, y]
						for (i = 0; i < dataLength; i++) {
							pt = data[i];
							xData[i] = pt[0];
							yData[i] = pt[1];
						}
					}
				} else {
					// Highcharts expects configs to be numbers or arrays in
					// turbo mode
					H.error(12);
				}
			} else {
				for (i = 0; i < dataLength; i++) {
					if (data[i] !== undefined) { // stray commas in oldIE
						pt = { series: series };
						series.pointClass.prototype.applyOptions.apply(
							pt,
							[data[i]]
						);
						series.updateParallelArrays(pt, i);
					}
				}
			}

			// Forgetting to cast strings to numbers is a common caveat when
			// handling CSV or JSON
			if (isString(yData[0])) {
				H.error(14, true);
			}

			series.data = [];
			series.options.data = series.userOptions.data = data;

			// destroy old points
			i = oldDataLength;
			while (i--) {
				if (oldData[i] && oldData[i].destroy) {
					oldData[i].destroy();
				}
			}

			// reset minRange (#878)
			if (xAxis) {
				xAxis.minRange = xAxis.userMinRange;
			}

			// redraw
			series.isDirty = chart.isDirtyBox = true;
			series.isDirtyData = !!oldData;
			animation = false;
		}

		// Typically for pie series, points need to be processed and generated
		// prior to rendering the legend
		if (options.legendType === 'point') {
			this.processData();
			this.generatePoints();
		}

		if (redraw) {
			chart.redraw(animation);
		}
	},

	/**
	 * Internal function to process the data by cropping away unused data points
	 * if the series is longer than the crop threshold. This saves computing
	 * time for large series. In Highstock, this function is extended to
	 * provide data grouping.
	 *
	 * @private
	 * @param  {Boolean} force
	 *         Force data grouping.
	 */
	processData: function (force) {
		var series = this,
			processedXData = series.xData, // copied during slice operation
			processedYData = series.yData,
			dataLength = processedXData.length,
			croppedData,
			cropStart = 0,
			cropped,
			distance,
			closestPointRange,
			xAxis = series.xAxis,
			i, // loop variable
			options = series.options,
			cropThreshold = options.cropThreshold,
			getExtremesFromAll =
				series.getExtremesFromAll ||
				options.getExtremesFromAll, // #4599
			isCartesian = series.isCartesian,
			xExtremes,
			val2lin = xAxis && xAxis.val2lin,
			isLog = xAxis && xAxis.isLog,
			min,
			max;

		// If the series data or axes haven't changed, don't go through this.
		// Return false to pass the message on to override methods like in data
		// grouping.
		if (
			isCartesian &&
			!series.isDirty &&
			!xAxis.isDirty &&
			!series.yAxis.isDirty &&
			!force
		) {
			return false;
		}

		if (xAxis) {
			xExtremes = xAxis.getExtremes(); // corrected for log axis (#3053)
			min = xExtremes.min;
			max = xExtremes.max;
		}

		// optionally filter out points outside the plot area
		if (
			isCartesian &&
			series.sorted &&
			!getExtremesFromAll &&
			(!cropThreshold || dataLength > cropThreshold || series.forceCrop)
		) {

			// it's outside current extremes
			if (
				processedXData[dataLength - 1] < min ||
				processedXData[0] > max
			) {
				processedXData = [];
				processedYData = [];

			// only crop if it's actually spilling out
			} else if (
				processedXData[0] < min ||
				processedXData[dataLength - 1] > max
			) {
				croppedData = this.cropData(
					series.xData,
					series.yData,
					min,
					max
				);
				processedXData = croppedData.xData;
				processedYData = croppedData.yData;
				cropStart = croppedData.start;
				cropped = true;
			}
		}


		// Find the closest distance between processed points
		i = processedXData.length || 1;
		while (--i) {
			distance = isLog ?
				val2lin(processedXData[i]) - val2lin(processedXData[i - 1]) :
				processedXData[i] - processedXData[i - 1];

			if (
				distance > 0 &&
				(
					closestPointRange === undefined ||
					distance < closestPointRange
				)
			) {
				closestPointRange = distance;

			// Unsorted data is not supported by the line tooltip, as well as
			// data grouping and navigation in Stock charts (#725) and width
			// calculation of columns (#1900)
			} else if (distance < 0 && series.requireSorting) {
				H.error(15);
			}
		}

		// Record the properties
		series.cropped = cropped; // undefined or true
		series.cropStart = cropStart;
		series.processedXData = processedXData;
		series.processedYData = processedYData;

		series.closestPointRange = closestPointRange;

	},

	/**
	 * Iterate over xData and crop values between min and max. Returns object
	 * containing crop start/end cropped xData with corresponding part of yData,
	 * dataMin and dataMax within the cropped range.
	 *
	 * @private
	 */
	cropData: function (xData, yData, min, max) {
		var dataLength = xData.length,
			cropStart = 0,
			cropEnd = dataLength,
			// line-type series need one point outside
			cropShoulder = pick(this.cropShoulder, 1),
			i,
			j;

		// iterate up to find slice start
		for (i = 0; i < dataLength; i++) {
			if (xData[i] >= min) {
				cropStart = Math.max(0, i - cropShoulder);
				break;
			}
		}

		// proceed to find slice end
		for (j = i; j < dataLength; j++) {
			if (xData[j] > max) {
				cropEnd = j + cropShoulder;
				break;
			}
		}

		return {
			xData: xData.slice(cropStart, cropEnd),
			yData: yData.slice(cropStart, cropEnd),
			start: cropStart,
			end: cropEnd
		};
	},


	/**
	 * Generate the data point after the data has been processed by cropping
	 * away unused points and optionally grouped in Highcharts Stock.
	 *
	 * @private
	 */
	generatePoints: function () {
		var series = this,
			options = series.options,
			dataOptions = options.data,
			data = series.data,
			dataLength,
			processedXData = series.processedXData,
			processedYData = series.processedYData,
			PointClass = series.pointClass,
			processedDataLength = processedXData.length,
			cropStart = series.cropStart || 0,
			cursor,
			hasGroupedData = series.hasGroupedData,
			keys = options.keys,
			point,
			points = [],
			i;

		if (!data && !hasGroupedData) {
			var arr = [];
			arr.length = dataOptions.length;
			data = series.data = arr;
		}

		if (keys && hasGroupedData) {
			// grouped data has already applied keys (#6590)
			series.options.keys = false;
		}

		for (i = 0; i < processedDataLength; i++) {
			cursor = cropStart + i;
			if (!hasGroupedData) {
				point = data[cursor];
				if (!point && dataOptions[cursor] !== undefined) { // #970
					data[cursor] = point = (new PointClass()).init(
						series,
						dataOptions[cursor],
						processedXData[i]
					);
				}
			} else {
				// splat the y data in case of ohlc data array
				point = (new PointClass()).init(
					series,
					[processedXData[i]].concat(splat(processedYData[i]))
				);

				/**
				 * Highstock only. If a point object is created by data
				 * grouping, it doesn't reflect actual points in the raw data.
				 * In this case, the `dataGroup` property holds information
				 * that points back to the raw data.
				 *
				 * - `dataGroup.start` is the index of the first raw data point
				 * in the group.
				 * - `dataGroup.length` is the amount of points in the group.
				 *
				 * @name dataGroup
				 * @memberOf Point
				 * @type {Object}
				 *
				 */
				point.dataGroup = series.groupMap[i];
			}
			if (point) { // #6279
				point.index = cursor; // For faster access in Point.update
				points[i] = point;
			}
		}

		// restore keys options (#6590)
		series.options.keys = keys;

		// Hide cropped-away points - this only runs when the number of points
		// is above cropThreshold, or when swithching view from non-grouped
		// data to grouped data (#637)
		if (
			data &&
			(
				processedDataLength !== (dataLength = data.length) ||
				hasGroupedData
			)
		) {
			for (i = 0; i < dataLength; i++) {
				// when has grouped data, clear all points
				if (i === cropStart && !hasGroupedData) {
					i += processedDataLength;
				}
				if (data[i]) {
					data[i].destroyElements();
					data[i].plotX = undefined; // #1003
				}
			}
		}

		/**
		 * Read only. An array containing the series' data point objects. To
		 * modify the data, use {@link Highcharts.Series#setData} or {@link
		 * Highcharts.Point#update}.
		 *
		 * @name data
		 * @memberOf Highcharts.Series
		 * @type {Array.<Highcharts.Point>}
		 */
		series.data = data;

		/**
		 * An array containing all currently visible point objects. In case of
		 * cropping, the cropped-away points are not part of this array. The
		 * `series.points` array starts at `series.cropStart` compared to
		 * `series.data` and `series.options.data`. If however the series data
		 * is grouped, these can't be correlated one to one. To
		 * modify the data, use {@link Highcharts.Series#setData} or {@link
		 * Highcharts.Point#update}.
		 * @name point
		 * @memberof Series
		 * @type {Array.<Point>}
		 */
		series.points = points;
	},

	/**
	 * Calculate Y extremes for the visible data. The result is set as 
	 * `dataMin` and `dataMax` on the Series item.
	 *
	 * @param  {Array.<Number>} [yData]
	 *         The data to inspect. Defaults to the current data within the
	 *         visible range.
	 * 
	 */
	getExtremes: function (yData) {
		var xAxis = this.xAxis,
			yAxis = this.yAxis,
			xData = this.processedXData,
			yDataLength,
			activeYData = [],
			activeCounter = 0,
			// #2117, need to compensate for log X axis
			xExtremes = xAxis.getExtremes(),
			xMin = xExtremes.min,
			xMax = xExtremes.max,
			validValue,
			withinRange,
			x,
			y,
			i,
			j;

		yData = yData || this.stackedYData || this.processedYData || [];
		yDataLength = yData.length;

		for (i = 0; i < yDataLength; i++) {

			x = xData[i];
			y = yData[i];

			// For points within the visible range, including the first point
			// outside the visible range, consider y extremes
			validValue =
				(isNumber(y, true) || isArray(y)) &&
				(!yAxis.positiveValuesOnly || (y.length || y > 0));
			withinRange =
				this.getExtremesFromAll ||
				this.options.getExtremesFromAll ||
				this.cropped ||
				((xData[i] || x) >= xMin &&	(xData[i] || x) <= xMax);

			if (validValue && withinRange) {

				j = y.length;
				if (j) { // array, like ohlc or range data
					while (j--) {
						if (y[j] !== null) {
							activeYData[activeCounter++] = y[j];
						}
					}
				} else {
					activeYData[activeCounter++] = y;
				}
			}
		}

		this.dataMin = arrayMin(activeYData);
		this.dataMax = arrayMax(activeYData);
	},

	/**
	 * Translate data points from raw data values to chart specific positioning
	 * data needed later in the `drawPoints` and `drawGraph` functions. This
	 * function can be overridden in plugins and custom series type
	 * implementations.
	 */
	translate: function () {
		if (!this.processedXData) { // hidden series
			this.processData();
		}
		this.generatePoints();
		var series = this,
			options = series.options,
			stacking = options.stacking,
			xAxis = series.xAxis,
			categories = xAxis.categories,
			yAxis = series.yAxis,
			points = series.points,
			dataLength = points.length,
			hasModifyValue = !!series.modifyValue,
			i,
			pointPlacement = options.pointPlacement,
			dynamicallyPlaced =
				pointPlacement === 'between' ||
				isNumber(pointPlacement),
			threshold = options.threshold,
			stackThreshold = options.startFromThreshold ? threshold : 0,
			plotX,
			plotY,
			lastPlotX,
			stackIndicator,
			closestPointRangePx = Number.MAX_VALUE;

		// Point placement is relative to each series pointRange (#5889)
		if (pointPlacement === 'between') {
			pointPlacement = 0.5;
		}
		if (isNumber(pointPlacement)) {
			pointPlacement *= pick(options.pointRange || xAxis.pointRange);
		}

		// Translate each point
		for (i = 0; i < dataLength; i++) {
			var point = points[i],
				xValue = point.x,
				yValue = point.y,
				yBottom = point.low,
				stack = stacking && yAxis.stacks[(
					series.negStacks &&
					yValue < (stackThreshold ? 0 : threshold) ? '-' : ''
				) + series.stackKey],
				pointStack,
				stackValues;

			// Discard disallowed y values for log axes (#3434)
			if (yAxis.positiveValuesOnly && yValue !== null && yValue <= 0) {
				point.isNull = true;
			}

			// Get the plotX translation
			point.plotX = plotX = correctFloat( // #5236
				Math.min(Math.max(-1e5, xAxis.translate(
					xValue,
					0,
					0,
					0,
					1,
					pointPlacement,
					this.type === 'flags'
				)), 1e5) // #3923
			);

			// Calculate the bottom y value for stacked series
			if (
				stacking &&
				series.visible &&
				!point.isNull &&
				stack &&
				stack[xValue]
			) {
				stackIndicator = series.getStackIndicator(
					stackIndicator,
					xValue,
					series.index
				);
				pointStack = stack[xValue];
				stackValues = pointStack.points[stackIndicator.key];
				yBottom = stackValues[0];
				yValue = stackValues[1];

				if (
					yBottom === stackThreshold &&
					stackIndicator.key === stack[xValue].base
				) {
					yBottom = pick(threshold, yAxis.min);
				}
				if (yAxis.positiveValuesOnly && yBottom <= 0) { // #1200, #1232
					yBottom = null;
				}

				point.total = point.stackTotal = pointStack.total;
				point.percentage =
					pointStack.total &&
					(point.y / pointStack.total * 100);
				point.stackY = yValue;

				// Place the stack label
				pointStack.setOffset(
					series.pointXOffset || 0,
					series.barW || 0
				);

			}

			// Set translated yBottom or remove it
			point.yBottom = defined(yBottom) ?
				yAxis.translate(yBottom, 0, 1, 0, 1) :
				null;

			// general hook, used for Highstock compare mode
			if (hasModifyValue) {
				yValue = series.modifyValue(yValue, point);
			}

			// Set the the plotY value, reset it for redraws
			point.plotY = plotY =
				(typeof yValue === 'number' && yValue !== Infinity) ?
					Math.min(Math.max(
						-1e5,
						yAxis.translate(yValue, 0, 1, 0, 1)), 1e5
					) : // #3201
					undefined;

			point.isInside =
				plotY !== undefined &&
				plotY >= 0 &&
				plotY <= yAxis.len && // #3519
				plotX >= 0 &&
				plotX <= xAxis.len;


			// Set client related positions for mouse tracking
			point.clientX = dynamicallyPlaced ?
				correctFloat(
					xAxis.translate(xValue, 0, 0, 0, 1, pointPlacement)
				) :
				plotX; // #1514, #5383, #5518

			point.negative = point.y < (threshold || 0);

			// some API data
			point.category = categories && categories[point.x] !== undefined ?
				categories[point.x] : point.x;

			// Determine auto enabling of markers (#3635, #5099)
			if (!point.isNull) {
				if (lastPlotX !== undefined) {
					closestPointRangePx = Math.min(
						closestPointRangePx,
						Math.abs(plotX - lastPlotX)
					);
				}
				lastPlotX = plotX;
			}

			// Find point zone
			point.zone = this.zones.length && point.getZone();
		}
		series.closestPointRangePx = closestPointRangePx;
	},

	/**
	 * Return the series points with null points filtered out.
	 *
	 * @param  {Array.<Point>} [points]
	 *         The points to inspect, defaults to {@link Series.points}.
	 * @param  {Boolean} [insideOnly=false]
	 *         Whether to inspect only the points that are inside the visible
	 *         view.
	 *
	 * @return {Array.<Point>}
	 *         The valid points.
	 */
	getValidPoints: function (points, insideOnly) {
		var chart = this.chart;
		// #3916, #5029, #5085
		return grep(points || this.points || [], function isValidPoint(point) {
			if (insideOnly && !chart.isInsidePlot(
				point.plotX,
				point.plotY,
				chart.inverted
			)) {
				return false;
			}
			return !point.isNull;
		});
	},

	/**
	 * Set the clipping for the series. For animated series it is called twice,
	 * first to initiate animating the clip then the second time without the
	 * animation to set the final clip.
	 *
	 * @private
	 */
	setClip: function (animation) {
		var chart = this.chart,
			options = this.options,
			renderer = chart.renderer,
			inverted = chart.inverted,
			seriesClipBox = this.clipBox,
			clipBox = seriesClipBox || chart.clipBox,
			sharedClipKey =
				this.sharedClipKey ||
				[
					'_sharedClip',
					animation && animation.duration,
					animation && animation.easing,
					clipBox.height,
					options.xAxis,
					options.yAxis
				].join(','), // #4526
			clipRect = chart[sharedClipKey],
			markerClipRect = chart[sharedClipKey + 'm'];

		// If a clipping rectangle with the same properties is currently present
		// in the chart, use that.
		if (!clipRect) {

			// When animation is set, prepare the initial positions
			if (animation) {
				clipBox.width = 0;

				chart[sharedClipKey + 'm'] = markerClipRect = renderer.clipRect(
					-99, // include the width of the first marker
					inverted ? -chart.plotLeft : -chart.plotTop,
					99,
					inverted ? chart.chartWidth : chart.chartHeight
				);
			}
			chart[sharedClipKey] = clipRect = renderer.clipRect(clipBox);
			// Create hashmap for series indexes
			clipRect.count = { length: 0 };

		}
		if (animation) {
			if (!clipRect.count[this.index]) {
				clipRect.count[this.index] = true;
				clipRect.count.length += 1;
			}
		}

		if (options.clip !== false) {
			this.group.clip(animation || seriesClipBox ? clipRect : chart.clipRect);
			this.markerGroup.clip(markerClipRect);
			this.sharedClipKey = sharedClipKey;
		}

		// Remove the shared clipping rectangle when all series are shown
		if (!animation) {
			if (clipRect.count[this.index]) {
				delete clipRect.count[this.index];
				clipRect.count.length -= 1;
			}

			if (clipRect.count.length === 0 && sharedClipKey && chart[sharedClipKey]) {
				if (!seriesClipBox) {
					chart[sharedClipKey] = chart[sharedClipKey].destroy();
				}
				if (chart[sharedClipKey + 'm']) {
					chart[sharedClipKey + 'm'] = chart[sharedClipKey + 'm'].destroy();
				}
			}
		}
	},

	/**
	 * Animate in the series. Called internally twice. First with the `init`
	 * parameter set to true, which sets up the initial state of the animation.
	 * Then when ready, it is called with the `init` parameter undefined, in 
	 * order to perform the actual animation. After the second run, the function
	 * is removed.
	 *
	 * @param  {Boolean} init
	 *         Initialize the animation.
	 */
	animate: function (init) {
		var series = this,
			chart = series.chart,
			clipRect,
			animation = animObject(series.options.animation),
			sharedClipKey;

		// Initialize the animation. Set up the clipping rectangle.
		if (init) {

			series.setClip(animation);

		// Run the animation
		} else {
			sharedClipKey = this.sharedClipKey;
			clipRect = chart[sharedClipKey];
			if (clipRect) {
				clipRect.animate({
					width: chart.plotSizeX
				}, animation);
			}
			if (chart[sharedClipKey + 'm']) {
				chart[sharedClipKey + 'm'].animate({
					width: chart.plotSizeX + 99
				}, animation);
			}

			// Delete this function to allow it only once
			series.animate = null;

		}
	},

	/**
	 * This runs after animation to land on the final plot clipping.
	 *
	 * @private
	 */
	afterAnimate: function () {
		this.setClip();
		fireEvent(this, 'afterAnimate');
	},

	/**
	 * Draw the markers for line-like series types, and columns or other
	 * graphical representation for {@link Point} objects for other series
	 * types. The resulting element is typically stored as {@link
	 * Point.graphic}, and is created on the first call and updated and moved on
	 * subsequent calls.
	 */
	drawPoints: function () {
		var series = this,
			points = series.points,
			chart = series.chart,
			plotY,
			i,
			point,
			symbol,
			graphic,
			options = series.options,
			seriesMarkerOptions = options.marker,
			pointMarkerOptions,
			hasPointMarker,
			enabled,
			isInside,
			markerGroup = series[series.specialGroup] || series.markerGroup,
			xAxis = series.xAxis,
			markerAttribs,
			globallyEnabled = pick(
				seriesMarkerOptions.enabled,
				xAxis.isRadial ? true : null,
				// Use larger or equal as radius is null in bubbles (#6321)
				series.closestPointRangePx >= 2 * seriesMarkerOptions.radius
			);

		if (seriesMarkerOptions.enabled !== false || series._hasPointMarkers) {

			for (i = 0; i < points.length; i++) {
				point = points[i];
				plotY = point.plotY;
				graphic = point.graphic;
				pointMarkerOptions = point.marker || {};
				hasPointMarker = !!point.marker;
				enabled = (globallyEnabled && pointMarkerOptions.enabled === undefined) || pointMarkerOptions.enabled;
				isInside = point.isInside;

				// only draw the point if y is defined
				if (enabled && isNumber(plotY) && point.y !== null) {

					// Shortcuts
					symbol = pick(pointMarkerOptions.symbol, series.symbol);
					point.hasImage = symbol.indexOf('url') === 0;

					markerAttribs = series.markerAttribs(
						point,
						point.selected && 'select'
					);

					if (graphic) { // update
						graphic[isInside ? 'show' : 'hide'](true) // Since the marker group isn't clipped, each individual marker must be toggled
							.animate(markerAttribs);
					} else if (isInside && (markerAttribs.width > 0 || point.hasImage)) {

						/**
						 * The graphic representation of the point. Typically
						 * this is a simple shape, like a `rect` for column
						 * charts or `path` for line markers, but for some 
						 * complex series types like boxplot or 3D charts, the
						 * graphic may be a `g` element containing other shapes.
						 * The graphic is generated the first time {@link
						 * Series#drawPoints} runs, and updated and moved on
						 * subsequent runs.
						 *
						 * @memberof Point
						 * @name graphic
						 * @type {SVGElement}
						 */
						point.graphic = graphic = chart.renderer.symbol(
							symbol,
							markerAttribs.x,
							markerAttribs.y,
							markerAttribs.width,
							markerAttribs.height,
							hasPointMarker ? pointMarkerOptions : seriesMarkerOptions
						)
						.add(markerGroup);
					}

					/*= if (build.classic) { =*/
					// Presentational attributes
					if (graphic) {
						graphic.attr(series.pointAttribs(point, point.selected && 'select'));
					}
					/*= } =*/

					if (graphic) {
						graphic.addClass(point.getClassName(), true);
					}

				} else if (graphic) {
					point.graphic = graphic.destroy(); // #1269
				}
			}
		}

	},

	/**
	 * Get non-presentational attributes for a point. Used internally for both
	 * styled mode and classic. Can be overridden for different series types.
	 *
	 * @see    Series#pointAttribs
	 *
	 * @param  {Point} point
	 *         The Point to inspect.
	 * @param  {String} [state]
	 *         The state, can be either `hover`, `select` or undefined.
	 *
	 * @return {SVGAttributes}
	 *         A hash containing those attributes that are not settable from
	 *         CSS.
	 */
	markerAttribs: function (point, state) {
		var seriesMarkerOptions = this.options.marker,
			seriesStateOptions,
			pointMarkerOptions = point.marker || {},
			pointStateOptions,
			radius = pick(
				pointMarkerOptions.radius,
				seriesMarkerOptions.radius
			),
			attribs;

		// Handle hover and select states
		if (state) {
			seriesStateOptions = seriesMarkerOptions.states[state];
			pointStateOptions = pointMarkerOptions.states &&
				pointMarkerOptions.states[state];

			radius = pick(
				pointStateOptions && pointStateOptions.radius,
				seriesStateOptions && seriesStateOptions.radius,
				radius + (seriesStateOptions && seriesStateOptions.radiusPlus || 0)
			);
		}

		if (point.hasImage) {
			radius = 0; // and subsequently width and height is not set
		}

		attribs = {
			x: Math.floor(point.plotX) - radius, // Math.floor for #1843
			y: point.plotY - radius
		};

		if (radius) {
			attribs.width = attribs.height = 2 * radius;
		}

		return attribs;

	},

	/**
	 * Get presentational attributes for the halo shown around a point.
	 * Can be overridden for different series types.
	 */
	haloAttribs: function (point, state) {
		return {};
	},

	/*= if (build.classic) { =*/
	/**
	 * Internal function to get presentational attributes for each point. Unlike
	 * {@link Series#markerAttribs}, this function should return those
	 * attributes that can also be set in CSS. In styled mode, `pointAttribs`
	 * won't be called.
	 *
	 * @param  {Point} point
	 *         The point instance to inspect.
	 * @param  {String} [state]
	 *         The point state, can be either `hover`, `select` or undefined for
	 *         normal state.
	 *
	 * @return {SVGAttributes}
	 *         The presentational attributes to be set on the point.
	 */
	pointAttribs: function (point, state) {
		var seriesMarkerOptions = this.options.marker,
			seriesStateOptions,
			pointOptions = point && point.options,
			pointMarkerOptions = (pointOptions && pointOptions.marker) || {},
			pointStateOptions,
			color = this.color,
			pointColorOption = pointOptions && pointOptions.color,
			pointColor = point && point.color,
			strokeWidth = pick(
				pointMarkerOptions.lineWidth,
				seriesMarkerOptions.lineWidth
			),
			zoneColor = point && point.zone && point.zone.color,
			fill,
			stroke;

		color = pointColorOption || zoneColor || pointColor || color;
		fill = pointMarkerOptions.fillColor || seriesMarkerOptions.fillColor || color;
		stroke = pointMarkerOptions.lineColor || seriesMarkerOptions.lineColor || color;

		// Handle hover and select states
		if (state) {
			seriesStateOptions = seriesMarkerOptions.states[state];
			pointStateOptions = (pointMarkerOptions.states && pointMarkerOptions.states[state]) || {};
			strokeWidth = pick(
				pointStateOptions.lineWidth,
				seriesStateOptions.lineWidth,
				strokeWidth + pick(
					pointStateOptions.lineWidthPlus,
					seriesStateOptions.lineWidthPlus,
					0
				)
			);
			fill = pointStateOptions.fillColor || seriesStateOptions.fillColor || fill;
			stroke = pointStateOptions.lineColor || seriesStateOptions.lineColor || stroke;
		}

		return {
			'stroke': stroke,
			'stroke-width': strokeWidth,
			'fill': fill
		};
	},
	/*= } =*/
	/**
	 * Clear DOM objects and free up memory.
	 *
	 * @private
	 */
	destroy: function () {
		var series = this,
			chart = series.chart,
			issue134 = /AppleWebKit\/533/.test(win.navigator.userAgent),
			destroy,
			i,
			data = series.data || [],
			point,
			axis;

		// add event hook
		fireEvent(series, 'destroy');

		// remove all events
		removeEvent(series);

		// erase from axes
		each(series.axisTypes || [], function (AXIS) {
			axis = series[AXIS];
			if (axis && axis.series) {
				erase(axis.series, series);
				axis.isDirty = axis.forceRedraw = true;
			}
		});

		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}

		// destroy all points with their elements
		i = data.length;
		while (i--) {
			point = data[i];
			if (point && point.destroy) {
				point.destroy();
			}
		}
		series.points = null;

		// Clear the animation timeout if we are destroying the series during initial animation
		clearTimeout(series.animationTimeout);

		// Destroy all SVGElements associated to the series
		objectEach(series, function (val, prop) {
			if (val instanceof SVGElement && !val.survive) { // Survive provides a hook for not destroying

				// issue 134 workaround
				destroy = issue134 && prop === 'group' ?
				'hide' :
				'destroy';

				val[destroy]();
			}
		});

		// remove from hoverSeries
		if (chart.hoverSeries === series) {
			chart.hoverSeries = null;
		}
		erase(chart.series, series);
		chart.orderSeries();

		// clear all members
		objectEach(series, function (val, prop) {
			delete series[prop];
		});
	},

	/**
	 * Get the graph path.
	 *
	 * @private
	 */
	getGraphPath: function (points, nullsAsZeroes, connectCliffs) {
		var series = this,
			options = series.options,
			step = options.step,
			reversed,
			graphPath = [],
			xMap = [],
			gap;

		points = points || series.points;

		// Bottom of a stack is reversed
		reversed = points.reversed;
		if (reversed) {
			points.reverse();
		}
		// Reverse the steps (#5004)
		step = { right: 1, center: 2 }[step] || (step && 3);
		if (step && reversed) {
			step = 4 - step;
		}

		// Remove invalid points, especially in spline (#5015)
		if (options.connectNulls && !nullsAsZeroes && !connectCliffs) {
			points = this.getValidPoints(points);
		}

		// Build the line
		each(points, function (point, i) {

			var plotX = point.plotX,
				plotY = point.plotY,
				lastPoint = points[i - 1],
				pathToPoint; // the path to this point from the previous

			if ((point.leftCliff || (lastPoint && lastPoint.rightCliff)) && !connectCliffs) {
				gap = true; // ... and continue
			}

			// Line series, nullsAsZeroes is not handled
			if (point.isNull && !defined(nullsAsZeroes) && i > 0) {
				gap = !options.connectNulls;

			// Area series, nullsAsZeroes is set
			} else if (point.isNull && !nullsAsZeroes) {
				gap = true;

			} else {

				if (i === 0 || gap) {
					pathToPoint = ['M', point.plotX, point.plotY];

				} else if (series.getPointSpline) { // generate the spline as defined in the SplineSeries object

					pathToPoint = series.getPointSpline(points, point, i);

				} else if (step) {

					if (step === 1) { // right
						pathToPoint = [
							'L',
							lastPoint.plotX,
							plotY
						];

					} else if (step === 2) { // center
						pathToPoint = [
							'L',
							(lastPoint.plotX + plotX) / 2,
							lastPoint.plotY,
							'L',
							(lastPoint.plotX + plotX) / 2,
							plotY
						];

					} else {
						pathToPoint = [
							'L',
							plotX,
							lastPoint.plotY
						];
					}
					pathToPoint.push('L', plotX, plotY);

				} else {
					// normal line to next point
					pathToPoint = [
						'L',
						plotX,
						plotY
					];
				}

				// Prepare for animation. When step is enabled, there are two path nodes for each x value.
				xMap.push(point.x);
				if (step) {
					xMap.push(point.x);
				}

				graphPath.push.apply(graphPath, pathToPoint);
				gap = false;
			}
		});

		graphPath.xMap = xMap;
		series.graphPath = graphPath;

		return graphPath;

	},

	/**
	 * Draw the graph. Called internally when rendering line-like series types.
	 * The first time it generates the `series.graph` item and optionally other
	 * series-wide items like `series.area` for area charts. On subsequent calls
	 * these items are updated with new positions and attributes.
	 */
	drawGraph: function () {
		var series = this,
			options = this.options,
			graphPath = (this.gappedPath || this.getGraphPath).call(this),
			props = [[
				'graph',
				'highcharts-graph',
				/*= if (build.classic) { =*/
				options.lineColor || this.color,
				options.dashStyle
				/*= } =*/
			]];

		// Add the zone properties if any
		each(this.zones, function (zone, i) {
			props.push([
				'zone-graph-' + i,
				'highcharts-graph highcharts-zone-graph-' + i + ' ' + (zone.className || ''),
				/*= if (build.classic) { =*/
				zone.color || series.color,
				zone.dashStyle || options.dashStyle
				/*= } =*/
			]);
		});

		// Draw the graph
		each(props, function (prop, i) {
			var graphKey = prop[0],
				graph = series[graphKey],
				attribs;

			if (graph) {
				graph.endX = graphPath.xMap;
				graph.animate({ d: graphPath });

			} else if (graphPath.length) { // #1487

				series[graphKey] = series.chart.renderer.path(graphPath)
					.addClass(prop[1])
					.attr({ zIndex: 1 }) // #1069
					.add(series.group);

				/*= if (build.classic) { =*/
				attribs = {
					'stroke': prop[2],
					'stroke-width': options.lineWidth,
					'fill': (series.fillGraph && series.color) || 'none' // Polygon series use filled graph
				};

				if (prop[3]) {
					attribs.dashstyle = prop[3];
				} else if (options.linecap !== 'square') {
					attribs['stroke-linecap'] = attribs['stroke-linejoin'] = 'round';
				}

				graph = series[graphKey]
					.attr(attribs)
					.shadow((i < 2) && options.shadow); // add shadow to normal series (0) or to first zone (1) #3932
				/*= } =*/
			}

			// Helpers for animation
			if (graph) {
				graph.startX = graphPath.xMap;
				//graph.shiftUnit = options.step ? 2 : 1;
				graph.isArea = graphPath.isArea; // For arearange animation
			}
		});
	},

	/**
	 * Clip the graphs into zones for colors and styling.
	 *
	 * @private
	 */
	applyZones: function () {
		var series = this,
			chart = this.chart,
			renderer = chart.renderer,
			zones = this.zones,
			translatedFrom,
			translatedTo,
			clips = this.clips || [],
			clipAttr,
			graph = this.graph,
			area = this.area,
			chartSizeMax = Math.max(chart.chartWidth, chart.chartHeight),
			axis = this[(this.zoneAxis || 'y') + 'Axis'],
			extremes,
			reversed,
			inverted = chart.inverted,
			horiz,
			pxRange,
			pxPosMin,
			pxPosMax,
			ignoreZones = false;

		if (zones.length && (graph || area) && axis && axis.min !== undefined) {
			reversed = axis.reversed;
			horiz = axis.horiz;
			// The use of the Color Threshold assumes there are no gaps
			// so it is safe to hide the original graph and area
			if (graph) {
				graph.hide();
			}
			if (area) {
				area.hide();
			}

			// Create the clips
			extremes = axis.getExtremes();
			each(zones, function (threshold, i) {

				translatedFrom = reversed ?
					(horiz ? chart.plotWidth : 0) :
					(horiz ? 0 : axis.toPixels(extremes.min));
				translatedFrom = Math.min(Math.max(pick(translatedTo, translatedFrom), 0), chartSizeMax);
				translatedTo = Math.min(Math.max(Math.round(axis.toPixels(pick(threshold.value, extremes.max), true)), 0), chartSizeMax);

				if (ignoreZones) {
					translatedFrom = translatedTo = axis.toPixels(extremes.max);
				}

				pxRange = Math.abs(translatedFrom - translatedTo);
				pxPosMin = Math.min(translatedFrom, translatedTo);
				pxPosMax = Math.max(translatedFrom, translatedTo);
				if (axis.isXAxis) {
					clipAttr = {
						x: inverted ? pxPosMax : pxPosMin,
						y: 0,
						width: pxRange,
						height: chartSizeMax
					};
					if (!horiz) {
						clipAttr.x = chart.plotHeight - clipAttr.x;
					}
				} else {
					clipAttr = {
						x: 0,
						y: inverted ? pxPosMax : pxPosMin,
						width: chartSizeMax,
						height: pxRange
					};
					if (horiz) {
						clipAttr.y = chart.plotWidth - clipAttr.y;
					}
				}

				/*= if (build.classic) { =*/
				/// VML SUPPPORT
				if (inverted && renderer.isVML) {
					if (axis.isXAxis) {
						clipAttr = {
							x: 0,
							y: reversed ? pxPosMin : pxPosMax,
							height: clipAttr.width,
							width: chart.chartWidth
						};
					} else {
						clipAttr = {
							x: clipAttr.y - chart.plotLeft - chart.spacingBox.x,
							y: 0,
							width: clipAttr.height,
							height: chart.chartHeight
						};
					}
				}
				/// END OF VML SUPPORT
				/*= } =*/

				if (clips[i]) {
					clips[i].animate(clipAttr);
				} else {
					clips[i] = renderer.clipRect(clipAttr);

					if (graph) {
						series['zone-graph-' + i].clip(clips[i]);
					}

					if (area) {
						series['zone-area-' + i].clip(clips[i]);
					}
				}
				// if this zone extends out of the axis, ignore the others
				ignoreZones = threshold.value > extremes.max;
			});
			this.clips = clips;
		}
	},

	/**
	 * Initialize and perform group inversion on series.group and
	 * series.markerGroup.
	 *
	 * @private
	 */
	invertGroups: function (inverted) {
		var series = this,
			chart = series.chart,
			remover;

		function setInvert() {
			each(['group', 'markerGroup'], function (groupName) {
				if (series[groupName]) {

					// VML/HTML needs explicit attributes for flipping
					if (chart.renderer.isVML) {
						series[groupName].attr({
							width: series.yAxis.len,
							height: series.xAxis.len
						});
					}

					series[groupName].width = series.yAxis.len;
					series[groupName].height = series.xAxis.len;
					series[groupName].invert(inverted);
				}
			});
		}

		// Pie, go away (#1736)
		if (!series.xAxis) {
			return;
		}

		// A fixed size is needed for inversion to work
		remover = addEvent(chart, 'resize', setInvert);
		addEvent(series, 'destroy', remover);

		// Do it now
		setInvert(inverted); // do it now

		// On subsequent render and redraw, just do setInvert without setting up events again
		series.invertGroups = setInvert;
	},

	/**
	 * General abstraction for creating plot groups like series.group,
	 * series.dataLabelsGroup and series.markerGroup. On subsequent calls, the
	 * group will only be adjusted to the updated plot size.
	 *
	 * @private
	 */
	plotGroup: function (prop, name, visibility, zIndex, parent) {
		var group = this[prop],
			isNew = !group;

		// Generate it on first call
		if (isNew) {
			this[prop] = group = this.chart.renderer.g()
				.attr({
					zIndex: zIndex || 0.1 // IE8 and pointer logic use this
				})
				.add(parent);

		}

		// Add the class names, and replace existing ones as response to
		// Series.update (#6660)
		group.addClass(
			(
				'highcharts-' + name +
				' highcharts-series-' + this.index +
				' highcharts-' + this.type + '-series ' +
				'highcharts-color-' + this.colorIndex + ' ' +
				(this.options.className || '')
			),
			true
		);

		// Place it on first and subsequent (redraw) calls
		group.attr({ visibility: visibility })[isNew ? 'attr' : 'animate'](
			this.getPlotBox()
		);
		return group;
	},

	/**
	 * Get the translation and scale for the plot area of this series.
	 */
	getPlotBox: function () {
		var chart = this.chart,
			xAxis = this.xAxis,
			yAxis = this.yAxis;

		// Swap axes for inverted (#2339)
		if (chart.inverted) {
			xAxis = yAxis;
			yAxis = this.xAxis;
		}
		return {
			translateX: xAxis ? xAxis.left : chart.plotLeft,
			translateY: yAxis ? yAxis.top : chart.plotTop,
			scaleX: 1, // #1623
			scaleY: 1
		};
	},

	/**
	 * Render the graph and markers. Called internally when first rendering and
	 * later when redrawing the chart. This function can be extended in plugins,
	 * but normally shouldn't be called directly.
	 */
	render: function () {
		var series = this,
			chart = series.chart,
			group,
			options = series.options,
			// Animation doesn't work in IE8 quirks when the group div is
			// hidden, and looks bad in other oldIE
			animDuration = (
				!!series.animate &&
				chart.renderer.isSVG &&
				animObject(options.animation).duration
			),
			visibility = series.visible ? 'inherit' : 'hidden', // #2597
			zIndex = options.zIndex,
			hasRendered = series.hasRendered,
			chartSeriesGroup = chart.seriesGroup,
			inverted = chart.inverted;

		// the group
		group = series.plotGroup(
			'group',
			'series',
			visibility,
			zIndex,
			chartSeriesGroup
		);

		series.markerGroup = series.plotGroup(
			'markerGroup',
			'markers',
			visibility,
			zIndex,
			chartSeriesGroup
		);

		// initiate the animation
		if (animDuration) {
			series.animate(true);
		}

		// SVGRenderer needs to know this before drawing elements (#1089, #1795)
		group.inverted = series.isCartesian ? inverted : false;

		// draw the graph if any
		if (series.drawGraph) {
			series.drawGraph();
			series.applyZones();
		}

/*		each(series.points, function (point) {
			if (point.redraw) {
				point.redraw();
			}
		});*/

		// draw the data labels (inn pies they go before the points)
		if (series.drawDataLabels) {
			series.drawDataLabels();
		}

		// draw the points
		if (series.visible) {
			series.drawPoints();
		}


		// draw the mouse tracking area
		if (
			series.drawTracker &&
			series.options.enableMouseTracking !== false
		) {
			series.drawTracker();
		}

		// Handle inverted series and tracker groups
		series.invertGroups(inverted);

		// Initial clipping, must be defined after inverting groups for VML.
		// Applies to columns etc. (#3839).
		if (options.clip !== false && !series.sharedClipKey && !hasRendered) {
			group.clip(chart.clipRect);
		}

		// Run the animation
		if (animDuration) {
			series.animate();
		}

		// Call the afterAnimate function on animation complete (but don't
		// overwrite the animation.complete option which should be available to
		// the user).
		if (!hasRendered) {
			series.animationTimeout = syncTimeout(function () {
				series.afterAnimate();
			}, animDuration);
		}

		series.isDirty = false; // means data is in accordance with what you see
		// (See #322) series.isDirty = series.isDirtyData = false; // means
		// data is in accordance with what you see
		series.hasRendered = true;
	},

	/**
	 * Redraw the series. This function is called internally from `chart.redraw`
	 * and normally shouldn't be called directly.
	 *
	 * @private
	 */
	redraw: function () {
		var series = this,
			chart = series.chart,
			// cache it here as it is set to false in render, but used after
			wasDirty = series.isDirty || series.isDirtyData,
			group = series.group,
			xAxis = series.xAxis,
			yAxis = series.yAxis;

		// reposition on resize
		if (group) {
			if (chart.inverted) {
				group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				});
			}

			group.animate({
				translateX: pick(xAxis && xAxis.left, chart.plotLeft),
				translateY: pick(yAxis && yAxis.top, chart.plotTop)
			});
		}

		series.translate();
		series.render();
		if (wasDirty) { // #3868, #3945
			delete this.kdTree;
		}
	},

	kdAxisArray: ['clientX', 'plotY'],

	searchPoint: function (e, compareX) {
		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			inverted = series.chart.inverted;

		return this.searchKDTree({
			clientX: inverted ?
				xAxis.len - e.chartY + xAxis.pos :
				e.chartX - xAxis.pos,
			plotY: inverted ?
				yAxis.len - e.chartX + yAxis.pos :
				e.chartY - yAxis.pos
		}, compareX);
	},

	/**
	 * Build the k-d-tree that is used by mouse and touch interaction to get the
	 * closest point. Line-like series typically have a one-dimensional tree
	 * where points are searched along the X axis, while scatter-like series
	 * typically search in two dimensions, X and Y.
	 *
	 * @private
	 */
	buildKDTree: function () {

		// Prevent multiple k-d-trees from being built simultaneously (#6235)
		this.buildingKdTree = true;

		var series = this,
			dimensions = series.options.findNearestPointBy.indexOf('y') > -1 ?
							2 : 1;

		// Internal function
		function _kdtree(points, depth, dimensions) {
			var axis,
				median,
				length = points && points.length;

			if (length) {

				// alternate between the axis
				axis = series.kdAxisArray[depth % dimensions];

				// sort point array
				points.sort(function (a, b) {
					return a[axis] - b[axis];
				});

				median = Math.floor(length / 2);

				// build and return nod
				return {
					point: points[median],
					left: _kdtree(
						points.slice(0, median), depth + 1, dimensions
					),
					right: _kdtree(
						points.slice(median + 1), depth + 1, dimensions
					)
				};

			}
		}

		// Start the recursive build process with a clone of the points array
		// and null points filtered out (#3873)
		function startRecursive() {
			series.kdTree = _kdtree(
				series.getValidPoints(
					null,
					// For line-type series restrict to plot area, but
					// column-type series not (#3916, #4511)
					!series.directTouch
				),
				dimensions,
				dimensions
			);
			series.buildingKdTree = false;
		}
		delete series.kdTree;

		// For testing tooltips, don't build async
		syncTimeout(startRecursive, series.options.kdNow ? 0 : 1);
	},

	searchKDTree: function (point, compareX) {
		var series = this,
			kdX = this.kdAxisArray[0],
			kdY = this.kdAxisArray[1],
			kdComparer = compareX ? 'distX' : 'dist',
			kdDimensions = series.options.findNearestPointBy.indexOf('y') > -1 ?
							2 : 1;

		// Set the one and two dimensional distance on the point object
		function setDistance(p1, p2) {
			var x = (defined(p1[kdX]) && defined(p2[kdX])) ?
					Math.pow(p1[kdX] - p2[kdX], 2) :
					null,
				y = (defined(p1[kdY]) && defined(p2[kdY])) ?
					Math.pow(p1[kdY] - p2[kdY], 2) :
					null,
				r = (x || 0) + (y || 0);

			p2.dist = defined(r) ? Math.sqrt(r) : Number.MAX_VALUE;
			p2.distX = defined(x) ? Math.sqrt(x) : Number.MAX_VALUE;
		}
		function _search(search, tree, depth, dimensions) {
			var point = tree.point,
				axis = series.kdAxisArray[depth % dimensions],
				tdist,
				sideA,
				sideB,
				ret = point,
				nPoint1,
				nPoint2;

			setDistance(search, point);

			// Pick side based on distance to splitting point
			tdist = search[axis] - point[axis];
			sideA = tdist < 0 ? 'left' : 'right';
			sideB = tdist < 0 ? 'right' : 'left';

			// End of tree
			if (tree[sideA]) {
				nPoint1 = _search(search, tree[sideA], depth + 1, dimensions);

				ret = (nPoint1[kdComparer] < ret[kdComparer] ? nPoint1 : point);
			}
			if (tree[sideB]) {
				// compare distance to current best to splitting point to decide
				// wether to check side B or not
				if (Math.sqrt(tdist * tdist) < ret[kdComparer]) {
					nPoint2 = _search(
						search,
						tree[sideB],
						depth + 1,
						dimensions
					);
					ret = nPoint2[kdComparer] < ret[kdComparer] ?
						nPoint2 :
						ret;
				}
			}

			return ret;
		}

		if (!this.kdTree && !this.buildingKdTree) {
			this.buildKDTree();
		}

		if (this.kdTree) {
			return _search(point, this.kdTree, kdDimensions, kdDimensions);
		}
	}

}); // end Series prototype
