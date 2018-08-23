/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * Translation and scale for the plot area of a series.
 *
 * @typedef {object} Highcharts.SeriesPlotBoxObject
 *
 * @property {number} translateX
 *
 * @property {number} translateY
 *
 * @property {number} scaleX
 *
 * @property {number} scaleY
 */

/**
 * Style options for the shadow of a series.
 *
 * @typedef {object} Highcharts.SeriesShadowOptions
 *
 * @property {Highcharts.ColorStirng} color
 *
 * @property {number} offsetX
 *
 * @property {number} offsetY
 *
 * @property {number} opacity
 *
 * @property {number} width
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
 * A new series is initialized either through the
 * {@link https://api.highcharts.com/highcharts/series|series}
 * option structure, or after the chart is initialized, through
 * {@link Highcharts.Chart#addSeries}.
 *
 * The object can be accessed in a number of ways. All series and point event
 * handlers give a reference to the `series` object. The chart object has a
 * {@link Highcharts.Chart.series|series} property that is a collection of all
 * the chart's series. The point objects and axis objects also have the same
 * reference.
 *
 * Another way to reference the series programmatically is by `id`. Add an id
 * in the series configuration options, and get the series object by
 * {@link Highcharts.Chart#get}.
 *
 * Configuration options for the series are given in three levels. Options for
 * all series in a chart are given in the
 * {@link https://api.highcharts.com/highcharts/plotOptions.series|
 * plotOptions.series} object. Then options for all series of a specific type
 * are given in the plotOptions of that type, for example `plotOptions.line`.
 * Next, options for one single series are given in the series array, or as
 * arguements to `chart.addSeries`.
 *
 * The data in the series is stored in various arrays.
 *
 * - First, `series.options.data` contains all the original config options for
 *   each point whether added by options or methods like `series.addPoint`.
 *
 * - Next, `series.data` contains those values converted to points, but in case
 *   the series data length exceeds the `cropThreshold`, or if the data is
 *   grouped, `series.data` doesn't contain all the points. It only contains the
 *   points that have been created on demand.
 *
 * - Then there's `series.points` that contains all currently visible point
 *   objects. In case of cropping, the cropped-away points are not part of this
 *   array. The `series.points` array starts at `series.cropStart` compared to
 *   `series.data` and `series.options.data`. If however the series data is
 *   grouped, these can't be correlated one to one.
 *
 * - `series.xData` and `series.processedXData` contain clean x values,
 *   equivalent to `series.data` and `series.points`.
 *
 * - `series.yData` and `series.processedYData` contain clean y values,
 *   equivalent to `series.data` and `series.points`.
 *
 * @class Highcharts.Series
 *
 * @param  {Highcharts.Chart} chart
 *         The chart instance.
 *
 * @param  {Options.plotOptions.series} options
 *         The series options.
 */

/**
 * General options for all series types.
 * @optionparent plotOptions.series
 */
H.Series = H.seriesType('line', null, { // base series options
    /*= if (build.classic) { =*/
    /**
     * The SVG value used for the `stroke-linecap` and `stroke-linejoin`
     * of a line graph. Round means that lines are rounded in the ends and
     * bends.
     *
     * @type       {string}
     * @validvalue ["round", "butt", "square"]
     * @default    round
     * @since      3.0.7
     * @apioption  plotOptions.line.linecap
     */

    /**
     * Pixel width of the graph line.
     *
     * @see In styled mode, the line stroke-width can be set with the
     *      `.highcharts-graph` class name.
     *
     * @sample {highcharts} highcharts/plotoptions/series-linewidth-general/
     *         On all series
     * @sample {highcharts} highcharts/plotoptions/series-linewidth-specific/
     *         On one single series
     *
     * @type       {number}
     * @default    2
     * @product    highcharts highstock
     * @apioption  plotOptions.series.lineWidth
     */
    lineWidth: 2,
    /*= } =*/

    /**
     * For some series, there is a limit that shuts down initial animation
     * by default when the total number of points in the chart is too high.
     * For example, for a column chart and its derivatives, animation doesn't
     * run if there is more than 250 points totally. To disable this cap, set
     * `animationLimit` to `Infinity`.
     *
     * @type       {number}
     * @apioption  plotOptions.series.animationLimit
     */

    /**
     * Allow this series' points to be selected by clicking on the graphic
     * (columns, point markers, pie slices, map areas etc).
     *
     * @see {@link Highcharts.Chart#getSelectedPoints}.
     *
     * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-line/
     *         Line
     * @sample {highcharts}
     *         highcharts/plotoptions/series-allowpointselect-column/
     *         Column
     * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-pie/
     *         Pie
     * @sample {highmaps} maps/plotoptions/series-allowpointselect/
     *         Map area
     * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/
     *         Map bubble

     * @type       {boolean}
     * @default    false
     * @since      1.2.0
     * @apioption  plotOptions.series.allowPointSelect
     */
    allowPointSelect: false,



    /**
     * If true, a checkbox is displayed next to the legend item to allow
     * selecting the series. The state of the checkbox is determined by
     * the `selected` option.
     *
     * @productdesc {highmaps}
     * Note that if a `colorAxis` is defined, the color axis is represented in
     * the legend, not the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-showcheckbox-true/
     *         Show select box
     *
     * @type       {boolean}
     * @default    false
     * @since      1.2.0
     * @apioption  plotOptions.series.allowPointSelect
     */
    showCheckbox: false,



    /**
     * Enable or disable the initial animation when a series is displayed.
     * The animation can also be set as a configuration object. Please
     * note that this option only applies to the initial animation of the
     * series itself. For other animations, see [chart.animation](
     * #chart.animation) and the animation parameter under the API methods. The
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
     * <dd>Can be a string reference to an easing function set on the `Math`
     * object or a function. See the _Custom easing function_ demo below.</dd>
     *
     * </dl>
     *
     * Due to poor performance, animation is disabled in old IE browsers
     * for several chart types.
     *
     * @sample {highcharts} highcharts/plotoptions/series-animation-disabled/
     *         Animation disabled
     * @sample {highcharts} highcharts/plotoptions/series-animation-slower/
     *         Slower animation
     * @sample {highcharts} highcharts/plotoptions/series-animation-easing/
     *         Custom easing function
     * @sample {highstock} stock/plotoptions/animation-slower/
     *         Slower animation
     * @sample {highstock} stock/plotoptions/animation-easing/
     *         Custom easing function
     * @sample {highmaps} maps/plotoptions/series-animation-true/
     *         Animation enabled on map series
     * @sample {highmaps} maps/plotoptions/mapbubble-animation-false/
     *         Disabled on mapbubble series
     *
     * @type       {boolean|Highcharts.AnimationOptionsObject}
     * @default    {highcharts} true
     * @default    {highstock} true
     * @default    {highmaps} false
     * @apioption  plotOptions.series.animation
     */
    animation: {
        duration: 1000
    },

    /**
     * An additional class name to apply to the series' graphical elements. This
     * option does not replace default class names of the graphical element.
     * @type       {string}
     * @since      5.0.0
     * @apioption  plotOptions.series.className
     */

    /**
     * Disable this option to allow series rendering in the whole plotting
     * area.
     *
     * **Note:** Clipping should be always enabled when
     * [chart.zoomType](#chart.zoomType) is set
     *
     * @sample {highcharts} highcharts/plotoptions/series-clip/
     *         Disabled clipping
     *
     * @default    true
     * @type       {boolean}
     * @since      3.0.0
     * @apioption  plotOptions.series.clip
     */

    /**
     * The main color of the series. In line type series it applies to the
     * line and the point markers unless otherwise specified. In bar type
     * series it applies to the bars unless a color is specified per point.
     * The default value is pulled from the `options.colors` array.
     *
     * In styled mode, the color can be defined by the
     * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
     * color can be set with the `.highcharts-series`, `.highcharts-color-{n}`,
     * `.highcharts-{type}-series` or `.highcharts-series-{n}` class, or
     * individual classes given by the `className` option.
     *
     * @productdesc {highmaps}
     * In maps, the series color is rarely used, as most choropleth maps use the
     * color to denote the value of each point. The series color can however be
     * used in a map with multiple series holding categorized data.
     *
     * @sample {highcharts} highcharts/plotoptions/series-color-general/
     *         General plot option
     * @sample {highcharts} highcharts/plotoptions/series-color-specific/
     *         One specific series
     * @sample {highcharts} highcharts/plotoptions/series-color-area/
     *         Area color
     * @sample {highmaps} maps/demo/category-map/
     *         Category map by multiple series
     *
     * @type       {Highcharts.ColorString}
     * @apioption  plotOptions.series.color
     */

    /**
     * Styled mode only. A specific color index to use for the series, so its
     * graphic representations are given the class name `highcharts-color-{n}`.
     *
     * @type       {number}
     * @since      5.0.0
     * @apioption  plotOptions.series.colorIndex
     */


    /**
     * Whether to connect a graph line across null points, or render a gap
     * between the two points on either side of the null.
     *
     * @sample {highcharts} highcharts/plotoptions/series-connectnulls-false/
     *         False by default
     * @sample {highcharts} highcharts/plotoptions/series-connectnulls-true/
     *         True
     *
     * @type       {boolean}
     * @default    false
     * @product    highcharts highstock
     * @apioption  plotOptions.series.connectNulls
     */


    /**
     * You can set the cursor to "pointer" if you have click events attached
     * to the series, to signal to the user that the points and lines can
     * be clicked.
     *
     * Possible values are: `"default"`, `"help"`, `"none"`, `"pointer"`, and
     * `"crosshair"`.
     *
     * In styled mode, the series cursor can be set with the same classes
     * as listed under [series.color](#plotOptions.series.color).
     *
     * @sample {highcharts} highcharts/plotoptions/series-cursor-line/
     *         On line graph
     * @sample {highcharts} highcharts/plotoptions/series-cursor-column/
     *         On columns
     * @sample {highcharts} highcharts/plotoptions/series-cursor-scatter/
     *         On scatter markers
     * @sample {highstock} stock/plotoptions/cursor/
     *         Pointer on a line graph
     * @sample {highmaps} maps/plotoptions/series-allowpointselect/
     *         Map area
     * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/
     *         Map bubble
     *
     * @type       {string}
     * @apioption  plotOptions.series.cursor
     */


    /**
     * A name for the dash style to use for the graph, or for some series types
     * the outline of each shape. The value for the `dashStyle` include:
     * `"Dash"`, `"DashDot"`, `"Dot"`, `"LongDash"`, `"LongDashDot"`,
     * `"LongDashDotDot"`, `"ShortDash"`, `"ShortDashDot"`, `"ShortDashDotDot"`,
     * `"ShortDot"`, and `"Solid"`.
     *
     * In styled mode, the [stroke dash-array](https://jsfiddle.net/gh/get/
     * library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/
     * series-dashstyle/) can be set with the same classes as listed under
     * [series.color](#plotOptions.series.color).
     *
     * @sample {highcharts} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     * @sample {highcharts} highcharts/plotoptions/series-dashstyle/
     *         Chart suitable for printing in black and white
     * @sample {highstock} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     * @sample {highmaps} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     * @sample {highmaps} maps/plotoptions/series-dashstyle/
     *         Dotted borders on a map
     *
     * @type       {string}
     * @default    Solid
     * @since      2.1
     * @apioption  plotOptions.series.dashStyle
     */

    /**
     * Requires the Accessibility module.
     *
     * A description of the series to add to the screen reader information
     * about the series.
     *
     * @type       {string}
     * @since      5.0.0
     * @apioption  plotOptions.series.description
     */





    /**
     * Enable or disable the mouse tracking for a specific series. This
     * includes point tooltips and click events on graphs and points. For
     * large datasets it improves performance.
     *
     * @sample {highcharts}
     *         highcharts/plotoptions/series-enablemousetracking-false/
     *         No mouse tracking
     * @sample {highmaps}
     *         maps/plotoptions/series-enablemousetracking-false/
     *         No mouse tracking
     *
     * @type       {boolean}
     * @default    true
     * @apioption  plotOptions.series.enableMouseTracking
     */

    /**
     * By default, series are exposed to screen readers as regions. By enabling
     * this option, the series element itself will be exposed in the same
     * way as the data points. This is useful if the series is not used
     * as a grouping entity in the chart, but you still want to attach a
     * description to the series.
     *
     * Requires the Accessibility module.
     *
     * @sample highcharts/accessibility/art-grants/
     *         Accessible data visualization
     *
     * @type        {boolean}
     * @since       5.0.12
     * @apioption   plotOptions.series.exposeElementToA11y
     */

    /**
     * Whether to use the Y extremes of the total chart width or only the
     * zoomed area when zooming in on parts of the X axis. By default, the
     * Y axis adjusts to the min and max of the visible data. Cartesian
     * series only.
     *
     * @type       {boolean}
     * @default    false
     * @since      4.1.6
     * @product    highcharts highstock
     * @apioption  plotOptions.series.getExtremesFromAll
     */

    /**
     * An id for the series. This can be used after render time to get a
     * pointer to the series object through `chart.get()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-id/
     *         Get series by id
     *
     * @type       {string}
     * @since      1.2.0
     * @apioption  series.id
     */

    /**
     * The index of the series in the chart, affecting the internal index
     * in the `chart.series` array, the visible Z index as well as the order
     * in the legend.
     *
     * @type       {number}
     * @since      2.3.0
     * @apioption  series.index
     */

    /**
     * An array specifying which option maps to which key in the data point
     * array. This makes it convenient to work with unstructured data arrays
     * from different sources.
     *
     * @see [series.data](#series.line.data)
     *
     * @sample {highcharts|highstock} highcharts/series/data-keys/
     *         An extended data array with keys
     * @sample {highcharts|highstock} highcharts/series/data-nested-keys/
     *         Nested keys used to access object properties
     *
     * @type       {Array<string>}
     * @since      4.1.6
     * @apioption  plotOptions.series.keys
     */

    /**
     * The sequential index of the series in the legend.
     *
     * @see    [legend.reversed](#legend.reversed),
     *         [yAxis.reversedStacks](#yAxis.reversedStacks)
     *
     * @sample {highcharts|highstock} highcharts/series/legendindex/
     *         Legend in opposite order
     *
     * @type       {number}
     * @apioption  series.legendIndex
     */

    /**
     * The line cap used for line ends and line joins on the graph.
     *
     * @type       {string}
     * @product    highcharts highstock
     * @validvalue ["round", "square"]
     * @apioption  plotOptions.series.linecap
     */

    /**
     * The [id](#series.id) of another series to link to. Additionally,
     * the value can be ":previous" to link to the previous series. When
     * two series are linked, only the first one appears in the legend.
     * Toggling the visibility of this also toggles the linked series.
     *
     * @sample {highcharts|highstock} highcharts/demo/arearange-line/
     *         Linked series
     *
     * @type       {string}
     * @since      3.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.linkedTo
     */

    /**
     * The name of the series as shown in the legend, tooltip etc.
     *
     * @sample {highcharts} highcharts/series/name/
     *         Series name
     * @sample {highmaps} maps/demo/category-map/
     *         Series name
     *
     * @type       {string}
     * @apioption  series.name
     */

    /**
     * Options for the corresponding navigator series if `showInNavigator`
     * is `true` for this series. Available options are the same as any
     * series, documented at [plotOptions](#plotOptions.series) and
     * [series](#series).
     *
     * These options are merged with options in [navigator.series](
     * #navigator.series), and will take precedence if the same option is
     * defined both places.
     *
     * @see [navigator.series](#navigator.series)
     *
     * @type       {*}
     * @since      5.0.0
     * @product    highstock
     * @apioption  plotOptions.series.navigatorOptions
     */

    /**
     * The color for the parts of the graph or points that are below the
     * [threshold](#plotOptions.series.threshold).
     *
     * @see In styled mode, a negative color is applied by setting this option
     *      to `true` combined with the `.highcharts-negative` class name.
     *
     * @sample {highcharts} highcharts/plotoptions/series-negative-color/
     *         Spline, area and column
     * @sample {highcharts} highcharts/plotoptions/arearange-negativecolor/
     *         Arearange
     * @sample {highcharts} highcharts/css/series-negative-color/
     *         Styled mode
     * @sample {highstock} highcharts/plotoptions/series-negative-color/
     *         Spline, area and column
     * @sample {highstock} highcharts/plotoptions/arearange-negativecolor/
     *         Arearange
     * @sample {highmaps} highcharts/plotoptions/series-negative-color/
     *         Spline, area and column
     * @sample {highmaps} highcharts/plotoptions/arearange-negativecolor/
     *         Arearange
     *
     * @type       {Highcharts.ColorString}
     * @since      3.0
     * @apioption  plotOptions.series.negativeColor
     */

    /**
     * Same as [accessibility.pointDescriptionFormatter](
     * #accessibility.pointDescriptionFormatter), but for an individual series.
     * Overrides the chart wide configuration.
     *
     * @type       {Function}
     * @since      5.0.12
     * @apioption  plotOptions.series.pointDescriptionFormatter
     */

    /**
     * If no x values are given for the points in a series, `pointInterval`
     * defines the interval of the x values. For example, if a series contains
     * one value every decade starting from year 0, set `pointInterval` to
     * `10`. In true `datetime` axes, the `pointInterval` is set in
     * milliseconds.
     *
     * It can be also be combined with `pointIntervalUnit` to draw irregular
     * time intervals.
     *
     * Please note that this options applies to the _series data_, not the
     * interval of the axis ticks, which is independent.
     *
     * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/
     *         Datetime X axis
     * @sample {highstock} stock/plotoptions/pointinterval-pointstart/
     *         Using pointStart and pointInterval
     *
     * @type       {number}
     * @default    1
     * @product    highcharts highstock
     * @apioption  plotOptions.series.pointInterval
     */

    /**
     * On datetime series, this allows for setting the
     * [pointInterval](#plotOptions.series.pointInterval) to irregular time
     * units, `day`, `month` and `year`. A day is usually the same as 24 hours,
     * but `pointIntervalUnit` also takes the DST crossover into consideration
     * when dealing with local time. Combine this option with `pointInterval`
     * to draw weeks, quarters, 6 months, 10 years etc.
     *
     * Please note that this options applies to the _series data_, not the
     * interval of the axis ticks, which is independent.
     *
     * @sample {highcharts} highcharts/plotoptions/series-pointintervalunit/
     *         One point a month
     * @sample {highstock} highcharts/plotoptions/series-pointintervalunit/
     *         One point a month
     *
     * @type       {string}
     * @since      4.1.0
     * @product    highcharts highstock
     * @validvalue ["day", "month", "year"]
     * @apioption  plotOptions.series.pointIntervalUnit
     */

    /**
     * Possible values: `"on"`, `"between"`, `number`.
     *
     * In a column chart, when pointPlacement is `"on"`, the point will
     * not create any padding of the X axis. In a polar column chart this
     * means that the first column points directly north. If the pointPlacement
     * is `"between"`, the columns will be laid out between ticks. This
     * is useful for example for visualising an amount between two points
     * in time or in a certain sector of a polar chart.
     *
     * Since Highcharts 3.0.2, the point placement can also be numeric,
     * where 0 is on the axis value, -0.5 is between this value and the
     * previous, and 0.5 is between this value and the next. Unlike the
     * textual options, numeric point placement options won't affect axis
     * padding.
     *
     * Note that pointPlacement needs a [pointRange](
     * #plotOptions.series.pointRange) to work. For column series this is
     * computed, but for line-type series it needs to be set.
     *
     * Defaults to `undefined` in cartesian charts, `"between"` in polar charts.
     *
     * @see [xAxis.tickmarkPlacement](#xAxis.tickmarkPlacement)
     *
     * @sample {highcharts|highstock} highcharts/plotoptions/series-pointplacement-between/
     *         Between in a column chart
     * @sample {highcharts|highstock} highcharts/plotoptions/series-pointplacement-numeric/
     *         Numeric placement for custom layout
     *
     * @type       {string|number}
     * @since      2.3.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.pointPlacement
     */

    /**
     * If no x values are given for the points in a series, pointStart defines
     * on what value to start. For example, if a series contains one yearly
     * value starting from 1945, set pointStart to 1945.
     *
     * @sample {highcharts} highcharts/plotoptions/series-pointstart-linear/
     *         Linear
     * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/
     *         Datetime
     * @sample {highstock} stock/plotoptions/pointinterval-pointstart/
     *         Using pointStart and pointInterval
     *
     * @type       {number}
     * @default    0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.pointStart
     */

    /**
     * Whether to select the series initially. If `showCheckbox` is true,
     * the checkbox next to the series name in the legend will be checked for a
     * selected series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-selected/
     *         One out of two series selected
     *
     * @type       {boolean}
     * @default    false
     * @since      1.2.0
     * @apioption  plotOptions.series.selected
     */

    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the shadow
     * can be an object configuration containing `color`, `offsetX`, `offsetY`,
     * `opacity` and `width`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-shadow/
     *         Shadow enabled
     *
     * @type       {boolean|Highcharts.SeriesShadowOptions}
     * @default    false
     * @apioption  plotOptions.series.shadow
     */

    /**
     * Whether to display this particular series or series type in the legend.
     * The default value is `true` for standalone series, `false` for linked
     * series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-showinlegend/
     *         One series in the legend, one hidden
     *
     * @type       {boolean}
     * @default    true
     * @apioption  plotOptions.series.showInLegend
     */

    /**
     * Whether or not to show the series in the navigator. Takes precedence
     * over [navigator.baseSeries](#navigator.baseSeries) if defined.
     *
     * @type       {boolean}
     * @since      5.0.0
     * @product    highstock
     * @apioption  plotOptions.series.showInNavigator
     */

    /**
     * If set to `True`, the accessibility module will skip past the points
     * in this series for keyboard navigation.
     *
     * @type       {boolean}
     * @since      5.0.12
     * @apioption  plotOptions.series.skipKeyboardNavigation
     */

    /**
     * This option allows grouping series in a stacked chart. The stack option
     * can be a string or anything else, as long as the grouped series' stack
     * options match each other after conversion into a string.
     *
     * @sample {highcharts} highcharts/series/stack/
     *         Stacked and grouped columns
     *
     * @type       {string|*}
     * @since      2.1
     * @product    highcharts highstock
     * @apioption  series.stack
     */

    /**
     * Whether to stack the values of each series on top of each other. Possible
     * values are `undefined` to disable, `"normal"` to stack by value or
     * `"percent"`. When stacking is enabled, data must be sorted in ascending
     * X order. A special stacking option is with the streamgraph series type,
     * where the stacking option is set to `"stream"`.
     *
     * @see [yAxis.reversedStacks](#yAxis.reversedStacks)
     *
     * @sample {highcharts} highcharts/plotoptions/series-stacking-line/
     *         Line
     * @sample {highcharts} highcharts/plotoptions/series-stacking-column/
     *         Column
     * @sample {highcharts} highcharts/plotoptions/series-stacking-bar/
     *         Bar
     * @sample {highcharts} highcharts/plotoptions/series-stacking-area/
     *         Area
     * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-line/
     *         Line
     * @sample {highcharts}
     *         highcharts/plotoptions/series-stacking-percent-column/
     *         Column
     * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-bar/
     *         Bar
     * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-area/
     *         Area
     * @sample {highstock} stock/plotoptions/stacking/
     *         Area
     *
     * @type       {string}
     * @product    highcharts highstock
     * @validvalue ["normal", "percent"]
     * @apioption  plotOptions.series.stacking
     */

    /**
     * Whether to apply steps to the line. Possible values are `left`, `center`
     * and `right`.
     *
     * @sample {highcharts} highcharts/plotoptions/line-step/
     *         Different step line options
     * @sample {highcharts} highcharts/plotoptions/area-step/
     *         Stepped, stacked area
     * @sample {highstock} stock/plotoptions/line-step/
     *         Step line
     *
     * @type       {string}
     * @since      1.2.5
     * @product    highcharts highstock
     * @validvalue ["left", "center", "right"]
     * @apioption  plotOptions.series.step
     */

    /**
     * The threshold, also called zero level or base level. For line type
     * series this is only used in conjunction with
     * [negativeColor](#plotOptions.series.negativeColor).
     *
     * @see [softThreshold](#plotOptions.series.softThreshold).
     *
     * @type       {number}
     * @default    0
     * @since      3.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.threshold
     */

    /**
     * The type of series, for example `line` or `column`. By default, the
     * series type is inherited from [chart.type](#chart.type), so unless the
     * chart is a combination of series types, there is no need to set it on the
     * series level.
     *
     * @sample {highcharts} highcharts/series/type/
     *         Line and column in the same chart
     * @sample {highmaps} maps/demo/mapline-mappoint/
     *         Multiple types in the same map
     *
     * @type       {string}
     * @apioption  series.type
     */

    /**
     * Set the initial visibility of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-visible/
     *         Two series, one hidden and one visible
     * @sample {highstock} stock/plotoptions/series-visibility/
     *         Hidden series
     *
     * @type       {boolean}
     * @default    true
     * @apioption  plotOptions.series.visible
     */

    /**
     * When using dual or multiple x axes, this number defines which xAxis
     * the particular series is connected to. It refers to either the [axis
     * id](#xAxis.id) or the index of the axis in the xAxis array, with
     * 0 being the first.
     *
     * @type       {number|string}
     * @default    0
     * @product    highcharts highstock
     * @apioption  series.xAxis
     */

    /**
     * When using dual or multiple y axes, this number defines which yAxis
     * the particular series is connected to. It refers to either the [axis
     * id](#yAxis.id) or the index of the axis in the yAxis array, with
     * 0 being the first.
     *
     * @sample {highcharts} highcharts/series/yaxis/
     *         Apply the column series to the secondary Y axis
     *
     * @type       {number|string}
     * @default    0
     * @product    highcharts highstock
     * @apioption  series.yAxis
     */

    /**
     * Defines the Axis on which the zones are applied.
     *
     * @see [zones](#plotOptions.series.zones)
     *
     * @sample {highcharts} highcharts/series/color-zones-zoneaxis-x/
     *         Zones on the X-Axis
     * @sample {highstock} highcharts/series/color-zones-zoneaxis-x/
     *         Zones on the X-Axis
     *
     * @type       {string}
     * @default    y
     * @since      4.1.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.zoneAxis
     */

    /**
     * Define the visual z index of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-zindex-default/
     *         With no z index, the series defined last are on top
     * @sample {highcharts} highcharts/plotoptions/series-zindex/
     *         With a z index, the series with the highest z index is on top
     * @sample {highstock} highcharts/plotoptions/series-zindex-default/
     *         With no z index, the series defined last are on top
     * @sample {highstock} highcharts/plotoptions/series-zindex/
     *         With a z index, the series with the highest z index is on top
     *
     * @type       {number}
     * @product    highcharts highstock
     * @apioption  series.zIndex
     */

    /**
     * Fires after the series has finished its initial animation, or in
     * case animation is disabled, immediately as the series is displayed.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-afteranimate/
     *         Show label after animate
     * @sample {highstock} highcharts/plotoptions/series-events-afteranimate/
     *         Show label after animate
     *
     * @type       {Function}
     * @since      4.0
     * @product    highcharts highstock
     * @context    Series
     * @apioption  plotOptions.series.events.afterAnimate
     */

    /**
     * Fires when the checkbox next to the series' name in the legend is
     * clicked. One parameter, `event`, is passed to the function. The state
     * of the checkbox is found by `event.checked`. The checked item is
     * found by `event.item`. Return `false` to prevent the default action
     * which is to toggle the select state of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/
     *         Alert checkbox status
     *
     * @type       {Function}
     * @since      1.2.0
     * @context    Series
     * @apioption  plotOptions.series.events.checkboxClick
     */

    /**
     * Fires when the series is clicked. One parameter, `event`, is passed to
     * the function, containing common event information. Additionally,
     * `event.point` holds a pointer to the nearest point on the graph.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-click/
     *         Alert click info
     * @sample {highstock} stock/plotoptions/series-events-click/
     *         Alert click info
     * @sample {highmaps} maps/plotoptions/series-events-click/
     *         Display click info in subtitle
     *
     * @type       {Function}
     * @context    Series
     * @apioption  plotOptions.series.events.click
     */

    /**
     * Fires when the series is hidden after chart generation time, either
     * by clicking the legend item or by calling `.hide()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-hide/
     *         Alert when the series is hidden by clicking the legend item
     *
     * @type       {Function}
     * @since      1.2.0
     * @context    Series
     * @apioption  plotOptions.series.events.hide
     */

    /**
     * Fires when the legend item belonging to the series is clicked. One
     * parameter, `event`, is passed to the function. The default action
     * is to toggle the visibility of the series. This can be prevented
     * by returning `false` or calling `event.preventDefault()`.
     *
     * @sample {highcharts}
     *         highcharts/plotoptions/series-events-legenditemclick/
     *         Confirm hiding and showing
     *
     * @type       {Function}
     * @context    Series
     * @apioption  plotOptions.series.events.legendItemClick
     */

    /**
     * Fires when the mouse leaves the graph. One parameter, `event`, is
     * passed to the function, containing common event information. If the
     * [stickyTracking](#plotOptions.series) option is true, `mouseOut`
     * doesn't happen before the mouse enters another graph or leaves the
     * plot area.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/
     *         With sticky tracking by default
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/
     *         Without sticky tracking
     *
     * @type       {Function}
     * @context    Series
     * @apioption  plotOptions.series.events.mouseOut
     */

    /**
     * Fires when the mouse enters the graph. One parameter, `event`, is
     * passed to the function, containing common event information.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/
     *         With sticky tracking by default
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/
     *         Without sticky tracking
     *
     * @type       {Function}
     * @context    Series
     * @apioption  plotOptions.series.events.mouseOver
     */

    /**
     * Fires when the series is shown after chart generation time, either
     * by clicking the legend item or by calling `.show()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-show/
     *         Alert when the series is shown by clicking the legend item.
     *
     * @type       {Function}
     * @since      1.2.0
     * @context    Series
     * @apioption  plotOptions.series.events.show
     */

    /**
     * General event handlers for the series items. These event hooks can also
     * be attached to the series at run time using the `Highcharts.addEvent`
     * function.
     *
     * @apioption  plotOptions.series.events
     */
    events: {},



    /**
     * Options for the point markers of line-like series. Properties like
     * `fillColor`, `lineColor` and `lineWidth` define the visual appearance
     * of the markers. Other series types, like column series, don't have
     * markers, but have visual options on the series level instead.
     *
     * In styled mode, the markers can be styled with the `.highcharts-point`,
     * `.highcharts-point-hover` and `.highcharts-point-select`
     * class names.
     *
     * @apioption  plotOptions.series.marker
     */
    marker: {
        /*= if (build.classic) { =*/


        /**
         * The width of the point marker's outline.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         2px blue marker
         *
         * @type       {number}
         * @default    0
         * @apioption  plotOptions.series.marker.lineWidth
         */
        lineWidth: 0,


        /**
         * The color of the point marker's outline. When `undefined`, the
         * series' or point's color is used.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         Inherit from series color (undefined)
         *
         * @type       {Highcharts.ColorString}
         * @apioption  plotOptions.series.marker.lineColor
         */
        lineColor: '${palette.backgroundColor}',

        /**
         * The fill color of the point marker. When `undefined`, the series' or
         * point's color is used.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         White fill
         *
         * @type       {Highcharts.ColorString}
         * @apioption  plotOptions.series.marker.fillColor
         */

        /*= } =*/

        /**
         * Enable or disable the point marker. If `undefined`, the markers are
         * hidden when the data is dense, and shown for more widespread data
         * points.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-enabled/
         *         Disabled markers
         * @sample {highcharts}
         *         highcharts/plotoptions/series-marker-enabled-false/
         *         Disabled in normal state but enabled on hover
         * @sample {highstock} stock/plotoptions/series-marker/
         *         Enabled markers
         *
         * @type       {boolean}
         * @default    {highcharts} undefined
         * @default    {highstock} false
         * @apioption  plotOptions.series.marker.enabled
         */

        /**
         * Image markers only. Set the image width explicitly. When using this
         * option, a `width` must also be set.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/
         *         Fixed width and height
         * @sample {highstock} highcharts/plotoptions/series-marker-width-height/
         *         Fixed width and height
         *
         * @type       {number}
         * @since      4.0.4
         * @apioption  plotOptions.series.marker.height
         */

        /**
         * A predefined shape or symbol for the marker. When undefined, the
         * symbol is pulled from options.symbols. Other possible values are
         * "circle", "square", "diamond", "triangle" and "triangle-down".
         *
         * Additionally, the URL to a graphic can be given on this form:
         * "url(graphic.png)". Note that for the image to be applied to exported
         * charts, its URL needs to be accessible by the export server.
         *
         * Custom callbacks for symbol path generation can also be added to
         * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
         * used by its method name, as shown in the demo.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         *
         * @type       {string}
         * @apioption  plotOptions.series.marker.symbol
         */

        /**
         * The threshold for how dense the point markers should be before they
         * are hidden, given that `enabled` is not defined. The number indicates
         * the horizontal distance between the two closest points in the series,
         * as multiples of the `marker.radius`. In other words, the default
         * value of 2 means points are hidden if overlapping horizontally.
         *
         * @sample highcharts/plotoptions/series-marker-enabledthreshold
         *         A higher threshold
         *
         * @type       {number}
         * @default    2
         * @since      6.0.5
         * @apioption  plotOptions.series.marker.enabledThreshold
         */
        enabledThreshold: 2,

        /**
         * The radius of the point marker.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-radius/
         *         Bigger markers
         *
         * @type       {number}
         * @default    4
         * @apioption  plotOptions.series.marker.radius
         */
        radius: 4,

        /**
         * Image markers only. Set the image width explicitly. When using this
         * option, a `height` must also be set.
         *
         * @sample {highcharts}
         *         highcharts/plotoptions/series-marker-width-height/
         *         Fixed width and height
         * @sample {highstock}
         *         highcharts/plotoptions/series-marker-width-height/
         *         Fixed width and height
         *
         * @type       {number}
         * @since      4.0.4
         * @apioption  plotOptions.series.marker.width
         */


        /**
         * States for a single point marker.
         *
         * @apioption  plotOptions.series.marker.states
         */
        states: {

            /**
             * The normal state of a single point marker. Currently only used
             * for setting animation when returning to normal state from hover.
             *
             * @apioption  plotOptions.series.marker.states.normal
             */
            normal: {
                /**
                 * Animation when returning to normal state after hovering.
                 *
                 * @type {boolean|Highcharts.AnimationOptionsObject}
                 * @apioption  plotOptions.series.marker.states.hover.animation
                 */
                animation: true
            },

            /**
             * The hover state for a single point marker.
             *
             * @apioption  plotOptions.series.marker.states.hover
             */
            hover: {

                /**
                 * Animation when hovering over the marker.
                 *
                 * @type {boolean|Highcharts.AnimationOptionsObject}
                 * @apioption  plotOptions.series.marker.states.hover.animation
                 */
                animation: {
                    duration: 50
                },

                /**
                 * Enable or disable the point marker.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-enabled/
                 *         Disabled hover state
                 *
                 * @apioption  plotOptions.series.marker.states.hover.enabled
                 */
                enabled: true,

                /**
                 * The fill color of the marker in hover state. When
                 * `undefined`, the series' or point's fillColor for normal
                 * state is used.
                 *
                 * @type       {Highcharts.ColorString}
                 * @apioption  plotOptions.series.marker.states.hover.fillColor
                 */

                /**
                 * The color of the point marker's outline. When `undefined`,
                 * the series' or point's lineColor for normal state is used.
                 *
                 * @sample    {highcharts} highcharts/plotoptions/series-marker-states-hover-linecolor/
                 *            White fill color, black line color
                 *
                 * @type      {Highcharts.ColorString}
                 * @apioption plotOptions.series.marker.states.hover.lineColor
                 */

                /**
                 * The width of the point marker's outline. When `undefined`,
                 * the series' or point's lineWidth for normal state is used.
                 *
                 * @sample    {highcharts}
                 *            highcharts/plotoptions/series-marker-states-hover-linewidth/
                 *            3px line width
                 *
                 * @type      {number}
                 * @apioption plotOptions.series.marker.states.hover.lineWidth
                 */

                /**
                 * The radius of the point marker. In hover state, it defaults
                 * to the normal state's radius + 2 as per the [radiusPlus](
                 * #plotOptions.series.marker.states.hover.radiusPlus)
                 * option.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-radius/
                 *         10px radius
                 *
                 * @type       {number}
                 * @apioption  plotOptions.series.marker.states.hover.radius
                 */

                /**
                 * The number of pixels to increase the radius of the hovered
                 * point.
                 *
                 * @sample {highcharts}
                 *         highcharts/plotoptions/series-states-hover-linewidthplus/
                 *         5 pixels greater radius on hover
                 * @sample {highstock}
                 *         highcharts/plotoptions/series-states-hover-linewidthplus/
                 *         5 pixels greater radius on hover
                 *
                 * @type       {number}
                 * @since      4.0.3
                 * @apioption  plotOptions.series.marker.states.hover.radiusPlus
                 */
                radiusPlus: 2,

                /*= if (build.classic) { =*/

                /**
                 * The additional line width for a hovered point.
                 *
                 * @sample {highcharts}
                 *         highcharts/plotoptions/series-states-hover-linewidthplus/
                 *         2 pixels wider on hover
                 * @sample {highstock}
                 *         highcharts/plotoptions/series-states-hover-linewidthplus/
                 *         2 pixels wider on hover
                 *
                 * @type       {number}
                 * @since      4.0.3
                 * @apioption  plotOptions.series.marker.states.hover.lineWidthPlus
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
             * @apioption  plotOptions.series.marker.states.select
             */
            select: {

                /**
                 * The radius of the point marker. In hover state, it defaults
                 * to the normal state's radius + 2.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-radius/
                 *         10px radius for selected points
                 *
                 * @type       {number}
                 * @apioption  plotOptions.series.marker.states.select.radius
                 */

                /**
                 * Enable or disable visible feedback for selection.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-enabled/
                 *         Disabled select state
                 *
                 * @type       {boolean}
                 * @default    true
                 * @apioption  plotOptions.series.marker.states.select.enabled
                 */

                /**
                 * The fill color of the point marker.
                 *
                 * @sample {highcharts}
                 *         highcharts/plotoptions/series-marker-states-select-fillcolor/
                 *         Solid red discs for selected points
                 *
                 * @type       {Highcharts.ColorString}
                 * @default    #cccccc
                 * @apioption  plotOptions.series.marker.states.select.fillColor
                 */
                fillColor: '${palette.neutralColor20}',

                /**
                 * The color of the point marker's outline. When `undefined`,
                 * the series' or point's color is used.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linecolor/
                 *         Red line color for selected points
                 *
                 * @type       {Highcharts.ColorString}
                 * @default    #000000
                 * @apioption  plotOptions.series.marker.states.select.lineColor
                 */
                lineColor: '${palette.neutralColor100}',

                /**
                 * The width of the point marker's outline.
                 *
                 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linewidth/
                 *         3px line width for selected points
                 *
                 * @type       {number}
                 * @apioption  plotOptions.series.marker.states.select.lineWidth
                 */
                lineWidth: 2
            }
            /*= } =*/
        }
    },



    /**
     * Properties for each single point.
     *
     * @apioption  plotOptions.series.point
     */
    point: {


        /**
         * Fires when a point is clicked. One parameter, `event`, is passed
         * to the function, containing common event information.
         *
         * If the `series.allowPointSelect` option is true, the default
         * action for the point's click event is to toggle the point's
         * select state. Returning `false` cancels this action.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-click/
         *         Click marker to alert values
         * @sample {highcharts} highcharts/plotoptions/series-point-events-click-column/
         *         Click column
         * @sample {highcharts} highcharts/plotoptions/series-point-events-click-url/
         *         Go to URL
         * @sample {highmaps} maps/plotoptions/series-point-events-click/
         *         Click marker to display values
         * @sample {highmaps} maps/plotoptions/series-point-events-click-url/
         *         Go to URL
         *
         * @type       {Function}
         * @context    Point
         * @apioption  plotOptions.series.point.events.click
         */

        /**
         * Fires when the mouse leaves the area close to the point. One
         * parameter, `event`, is passed to the function, containing common
         * event information.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
         *         Show values in the chart's corner on mouse over
         *
         * @type       {Function}
         * @context    Point
         * @apioption  plotOptions.series.point.events.mouseOut
         */

        /**
         * Fires when the mouse enters the area close to the point. One
         * parameter, `event`, is passed to the function, containing common
         * event information.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
         *         Show values in the chart's corner on mouse over
         *
         * @type       {Function}
         * @context    Point
         * @apioption  plotOptions.series.point.events.mouseOver
         */

        /**
         * Fires when the point is removed using the `.remove()` method. One
         * parameter, `event`, is passed to the function. Returning `false`
         * cancels the operation.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-remove/
         *         Remove point and confirm
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Point
         * @apioption  plotOptions.series.point.events.remove
         */

        /**
         * Fires when the point is selected either programmatically or
         * following a click on the point. One parameter, `event`, is passed
         * to the function. Returning `false` cancels the operation.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-select/
         *         Report the last selected point
         * @sample {highmaps} maps/plotoptions/series-allowpointselect/
         *         Report select and unselect
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Point
         * @apioption  plotOptions.series.point.events.select
         */

        /**
         * Fires when the point is unselected either programmatically or
         * following a click on the point. One parameter, `event`, is passed
         * to the function.
         *  Returning `false` cancels the operation.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-unselect/
         *         Report the last unselected point
         * @sample {highmaps} maps/plotoptions/series-allowpointselect/
         *         Report select and unselect
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Point
         * @apioption  plotOptions.series.point.events.unselect
         */

        /**
         * Fires when the point is updated programmatically through the
         * `.update()` method. One parameter, `event`, is passed to the
         * function. The new point options can be accessed through
         * `event.options`. Returning `false` cancels the operation.
         *
         * @sample {highcharts} highcharts/plotoptions/series-point-events-update/
         *         Confirm point updating
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Point
         * @apioption  plotOptions.series.point.events.update
         */

        /**
         * Events for each single point.
         *
         * @apioption  plotOptions.series.point.events
         */
        events: {}
    },



    /**
     * Options for the series data labels, appearing next to each data point.
     *
     * In styled mode, the data labels can be styled with the
     * `.highcharts-data-label-box` and `.highcharts-data-label` class names
     * ([see example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-datalabels)).
     *
     * @apioption  plotOptions.series.dataLabels
     */
    dataLabels: {


        /**
         * The alignment of the data label compared to the point. If `right`,
         * the right side of the label should be touching the point. For
         * points with an extent, like columns, the alignments also dictates
         * how to align it inside the box, as given with the
         * [inside](#plotOptions.column.dataLabels.inside) option. Can be one of
         * `left`, `center` or `right`.
         *
         * @sample {highcharts}
         *         highcharts/plotoptions/series-datalabels-align-left/
         *         Left aligned
         *
         * @type       {string}
         * @default    center
         * @validvalue ["left", "center", "right"]
         * @apioption  plotOptions.series.dataLabels.align
         */
        align: 'center',


        /**
         * Whether to allow data labels to overlap. To make the labels less
         * sensitive for overlapping, the [dataLabels.padding](
         * #plotOptions.series.dataLabels.padding) can be set to 0.
         *
         * @sample highcharts/plotoptions/series-datalabels-allowoverlap-false/
         *         Don't allow overlap
         *
         * @type       {boolean}
         * @default    false
         * @since      4.1.0
         * @apioption  plotOptions.series.dataLabels.allowOverlap
         */


        /**
         * The border radius in pixels for the data label.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         * @sample {highstock} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         * @sample {highmaps} maps/plotoptions/series-datalabels-box/
         *         Data labels box options
         *
         * @type       {number}
         * @default    0
         * @since      2.2.1
         * @apioption  plotOptions.series.dataLabels.borderRadius
         */


        /**
         * The border width in pixels for the data label.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         * @sample {highstock} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         *
         * @type       {number}
         * @default    0
         * @since      2.2.1
         * @apioption  plotOptions.series.dataLabels.borderWidth
         */

        /**
         * A class name for the data label. Particularly in styled mode, this
         * can be used to give each series' or point's data label unique
         * styling. In addition to this option, a default color class name is
         * added so that we can give the labels a
         * [contrast text shadow](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/data-label-contrast/).
         *
         * @sample {highcharts} highcharts/css/series-datalabels/
         *         Styling by CSS
         * @sample {highstock} highcharts/css/series-datalabels/
         *         Styling by CSS
         * @sample {highmaps} highcharts/css/series-datalabels/
         *         Styling by CSS
         *
         * @type       {string}
         * @since      5.0.0
         * @apioption  plotOptions.series.dataLabels.className
         */

        /**
         * The text color for the data labels. Defaults to `undefined`. For
         * certain series types, like column or map, the data labels can be
         * drawn inside the points. In this case the data label will be drawn
         * with maximum contrast by default. Additionally, it will be given a
         * `text-outline` style with the opposite color, to further increase the
         * contrast. This can be overridden by setting the `text-outline` style
         * to `none` in the `dataLabels.style` option.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-color/
         *         Red data labels
         * @sample {highmaps} maps/demo/color-axis/
         *         White data labels
         *
         * @type       {Highcharts.ColorString}
         * @apioption  plotOptions.series.dataLabels.color
         */

        /**
         * Whether to hide data labels that are outside the plot area. By
         * default, the data label is moved inside the plot area according to
         * the [overflow](#plotOptions.series.dataLabels.overflow) option.
         *
         * @type       {boolean}
         * @default    true
         * @since      2.3.3
         * @apioption  plotOptions.series.dataLabels.crop
         */

        /**
         * Whether to defer displaying the data labels until the initial series
         * animation has finished.
         *
         * @type       {boolean}
         * @default    true
         * @since      4.0
         * @product    highcharts highstock
         * @apioption  plotOptions.series.dataLabels.defer
         */

        /**
         * Enable or disable the data labels.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-enabled/
         *         Data labels enabled
         * @sample {highmaps} maps/demo/color-axis/
         *         Data labels enabled
         *
         * @type       {boolean}
         * @default    false
         * @apioption  plotOptions.series.dataLabels.enabled
         */

        /**
         * A [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * for the data label. Available variables are the same as for
         * `formatter`.
         *
         * @sample {highcharts|highstock}
         *         highcharts/plotoptions/series-datalabels-format/
         *         Add a unit
         * @sample {highmaps}
         *         maps/plotoptions/series-datalabels-format/
         *         Formatted value in the data label
         *
         * @type       {string}
         * @default    {highcharts} {y}
         * @default    {highstock} {y}
         * @default    {highmaps} {point.value}
         * @since      3.0
         * @apioption  plotOptions.series.dataLabels.format
         */

        /**
         * Callback JavaScript function to format the data label. Note that if a
         * `format` is defined, the format takes precedence and the formatter is
         * ignored. Available data are:
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
         * <td>The series object. The series name is available through
         * `this.series.name`.</td>
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
         * @sample {highmaps} maps/plotoptions/series-datalabels-format/
         *         Formatted value
         *
         * @type       {Function}
         * @apioption  plotOptions.series.dataLabels.formatter
         */
        formatter: function () {
            return this.y === null ? '' : H.numberFormat(this.y, -1);
        },
        /*= if (build.classic) { =*/


        /**
         * Styles for the label. The default `color` setting is `"contrast"`,
         * which is a pseudo color that Highcharts picks up and applies the
         * maximum contrast to the underlying point item, for example the
         * bar in a bar chart.
         *
         * The `textOutline` is a pseudo property that
         * applies an outline of the given width with the given color, which
         * by default is the maximum contrast to the text. So a bright text
         * color will result in a black text outline for maximum readability
         * on a mixed background. In some cases, especially with grayscale
         * text, the text outline doesn't work well, in which cases it can
         * be disabled by setting it to `"none"`. When `useHTML` is true, the
         * `textOutline` will not be picked up. In this, case, the same effect
         * can be acheived through the `text-shadow` CSS property.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-style/
         *         Bold labels
         * @sample {highmaps} maps/demo/color-axis/
         *         Bold labels
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "contrast", "fontSize": "11px", "fontWeight": "bold", "textOutline": "1px contrast" }
         * @since      4.1.0
         * @apioption  plotOptions.series.dataLabels.style
         */
        style: {
            fontSize: '11px',
            fontWeight: 'bold',
            color: 'contrast',
            textOutline: '1px contrast'
        },

        /**
         * The name of a symbol to use for the border around the label. Symbols
         * are predefined functions on the Renderer object.
         *
         * @sample highcharts/plotoptions/series-datalabels-shape/
         *         A callout for annotations
         *
         * @type       {string}
         * @default    square
         * @since      4.1.2
         * @apioption  plotOptions.series.dataLabels.shape
         */

        /**
         * The Z index of the data labels. The default Z index puts it above
         * the series. Use a Z index of 2 to display it behind the series.
         *
         * @type       {number}
         * @default    6
         * @since      2.3.5
         * @apioption  plotOptions.series.dataLabels.zIndex
         */

        /**
         * A declarative filter for which data labels to display. The
         * declarative filter is designed for use when callback functions are
         * not available, like when the chart options require a pure JSON
         * structure or for use with graphical editors. For programmatic
         * control, use the `formatter` instead, and return `undefined` to
         * disable a single data label.
         *
         * @example
         * filter: {
         *     property: 'percentage',
         *     operator: '>',
         *     value: 4
         * }
         *
         * @sample highcharts/demo/pie-monochrome
         *         Data labels filtered by percentage
         *
         * @type       {*}
         * @since      6.0.3
         * @apioption  plotOptions.series.dataLabels.filter
         */

        /**
         * The point property to filter by. Point options are passed directly to
         * properties, additionally there are `y` value, `percentage` and others
         * listed under [Point](https://api.highcharts.com/class-reference/Highcharts.Point)
         * members.
         *
         * @type       {string}
         * @apioption  plotOptions.series.dataLabels.filter.property
         */

        /**
         * The operator to compare by. Can be one of `>`, `<`, `>=`, `<=`, `==`,
         * and `===`.
         *
         * @type       {string}
         * @validvalue [">", "<", ">=", "<=", "==", "==="]
         * @apioption  plotOptions.series.dataLabels.filter.operator
         */

        /**
         * The value to compare against.
         *
         * @type       {*}
         * @apioption  plotOptions.series.dataLabels.filter.value
         */

        /**
         * The background color or gradient for the data label.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         * @sample {highmaps} maps/plotoptions/series-datalabels-box/
         *         Data labels box options
         *
         * @type       {Highcharts.ColorString}
         * @since      2.2.1
         * @apioption  plotOptions.series.dataLabels.backgroundColor
         */

        /**
         * The border color for the data label. Defaults to `undefined`.
         *
         * @sample {highcharts|highstock} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         *
         * @type       {Highcharts.ColorString}
         * @since      2.2.1
         * @apioption  plotOptions.series.dataLabels.borderColor
         */

        /**
         * The shadow of the box. Works best with `borderWidth` or
         * `backgroundColor`. Since 2.3 the shadow can be an object
         * configuration containing `color`, `offsetX`, `offsetY`, `opacity` and
         * `width`.
         *
         * @sample {highcharts|highstock} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         *
         * @type       {boolean|*}
         * @default    false
         * @since      2.2.1
         * @apioption  plotOptions.series.dataLabels.shadow
         */
        /*= } =*/

        /**
         * For points with an extent, like columns or map areas, whether to
         * align the data label inside the box or to the actual value point.
         * Defaults to `false` in most cases, `true` in stacked columns.
         *
         * @type       {boolean}
         * @since      3.0
         * @apioption  plotOptions.series.dataLabels.inside
         */

        /**
         * How to handle data labels that flow outside the plot area. The
         * default is `justify`, which aligns them inside the plot area. For
         * columns and bars, this means it will be moved inside the bar. To
         * display data labels outside the plot area, set `crop` to `false` and
         * `overflow` to `"none"`.
         *
         * @type       {string}
         * @default    justify
         * @since      3.0.6
         * @validvalue ["justify", "none"]
         * @apioption  plotOptions.series.dataLabels.overflow
         */

        /**
         * Text rotation in degrees. Note that due to a more complex structure,
         * backgrounds, borders and padding will be lost on a rotated data
         * label.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
         *         Vertical labels
         *
         * @type       {number}
         * @default    0
         * @apioption  plotOptions.series.dataLabels.rotation
         */

        /**
         * Whether to
         * [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
         * to render the labels.
         *
         * @type       {boolean}
         * @default    false
         * @apioption  plotOptions.series.dataLabels.useHTML
         */

        /**
         * The vertical alignment of a data label. Can be one of `top`, `middle`
         * or `bottom`. The default value depends on the data, for instance
         * in a column chart, the label is above positive values and below
         * negative values.
         *
         * @type       {string}
         * @default    bottom
         * @since      2.3.3
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  plotOptions.series.dataLabels.verticalAlign
         */
        verticalAlign: 'bottom', // above singular point


        /**
         * The x position offset of the label relative to the point in pixels.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
         *         Vertical and positioned
         *
         * @type       {number}
         * @default    0
         * @apioption  plotOptions.series.dataLabels.x
         */
        x: 0,


        /**
         * The y position offset of the label relative to the point in pixels.
         *
         * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
         *         Vertical and positioned
         *
         * @type       {number}
         * @default    -6
         * @apioption  plotOptions.series.dataLabels.y
         */
        y: 0,


        /**
         * When either the `borderWidth` or the `backgroundColor` is set,
         * this is the padding within the box.
         *
         * @sample {highcharts|highstock} highcharts/plotoptions/series-datalabels-box/
         *         Data labels box options
         * @sample {highmaps} maps/plotoptions/series-datalabels-box/
         *         Data labels box options
         *
         * @type       {number}
         * @default    {highcharts} 5
         * @default    {highstock} 5
         * @default    {highmaps} 0
         * @since      2.2.1
         * @apioption  plotOptions.series.dataLabels.padding
         */
        padding: 5
    },

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
     * @type       {number}
     * @default    300
     * @since      2.2
     * @product    highcharts highstock
     * @apioption  plotOptions.series.cropThreshold
     */
    cropThreshold: 300,



    /**
     * The width of each point on the x axis. For example in a column chart
     * with one value each day, the pointRange would be 1 day (= 24 * 3600
     * * 1000 milliseconds). This is normally computed automatically, but
     * this option can be used to override the automatic value.
     *
     * @type       {number}
     * @default    0
     * @product    highstock
     * @apioption  plotOptions.series.pointRange
     */
    pointRange: 0,

    /**
     * When this is true, the series will not cause the Y axis to cross
     * the zero plane (or [threshold](#plotOptions.series.threshold) option)
     * unless the data actually crosses the plane.
     *
     * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
     * 3 will make the Y axis show negative values according to the `minPadding`
     * option. If `softThreshold` is `true`, the Y axis starts at 0.
     *
     * @type       {boolean}
     * @default    true
     * @since      4.1.9
     * @product    highcharts highstock
     * @apioption  plotOptions.series.softThreshold
     */
    softThreshold: true,



    /**
     * A wrapper object for all the series options in specific states.
     *
     * @type       {Highcharts.PlotSeriesStatesOptions}
     * @apioption  plotOptions.series.states
     */
    states: {

        /**
         * The normal state of a series, or for point items in column, pie and
         * similar series. Currently only used for setting animation when
         * returning to normal state from hover.
         *
         * @type       {Highcharts.PlotSeriesStatesNormalOptions}
         * @apioption  plotOptions.series.states.normal
         */
        normal: {
            /**
             * Animation when returning to normal state after hovering.
             *
             * @type       {boolean|Highcharts.AnimationOptionsObject}
             * @default    true
             * @apioption  plotOptions.series.states.normal
             */
            animation: true
        },

        /**
         * Options for the hovered series. These settings override the normal
         * state options when a series is moused over or touched.
         *
         * @type       {Highcharts.PlotSeriesStatesHoverOptions}
         * @apioption  plotOptions.series.states.hover
         */
        hover: {

            /**
             * Enable separate styles for the hovered series to visualize that
             * the user hovers either the series itself or the legend. .
             *
             * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled/
             *         Line
             * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-column/
             *         Column
             * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-pie/
             *         Pie
             *
             * @type       {boolean}
             * @default    true
             * @since      1.2
             * @apioption  plotOptions.series.states.hover.enabled
             */


            /**
             * Animation setting for hovering the graph in line-type series.
             *
             * @type       {boolean|Highcharts.AnimationOptionsObject}
             * @default    { "duration": 50 }
             * @since      5.0.8
             * @product    highcharts
             * @apioption  plotOptions.series.states.hover.animation
             */
            animation: {
                /**
                 * The duration of the hover animation in milliseconds. By
                 * default the hover state animates quickly in, and slowly back
                 * to normal.
                 *
                 * @type       {number}
                 * @apioption  plotOptions.series.states.hover.animation.duration
                 */
                duration: 50
            },

            /**
             * Pixel width of the graph line. By default this property is
             * undefined, and the `lineWidthPlus` property dictates how much
             * to increase the linewidth from normal state.
             *
             * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidth/
             *         5px line on hover
             *
             * @type       {number}
             * @product    highcharts highstock
             * @apioption  plotOptions.series.states.hover.lineWidth
             */


            /**
             * The additional line width for the graph of a hovered series.
             *
             * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
             *         5 pixels wider
             * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
             *         5 pixels wider
             *
             * @type       {number}
             * @default    1
             * @since      4.0.3
             * @product    highcharts highstock
             * @apioption  plotOptions.series.states.hover.lineWidthPlus
             */
            lineWidthPlus: 1,



            /**
             * In Highcharts 1.0, the appearance of all markers belonging to the
             * hovered series. For settings on the hover state of the individual
             * point, see
             * [marker.states.hover](#plotOptions.series.marker.states.hover).
             *
             * @deprecated
             * @extends    plotOptions.series.marker
             * @product    highcharts highstock
             * @apioption  plotOptions.series.states.hover.marker
             */
            marker: {
                // lineWidth: base + 1,
                // radius: base + 1
            },



            /**
             * Options for the halo appearing around the hovered point in line-
             * type series as well as outside the hovered slice in pie charts.
             * By default the halo is filled by the current point or series
             * color with an opacity of 0.25\. The halo can be disabled by
             * setting the `halo` option to `false`.
             *
             * In styled mode, the halo is styled with the `.highcharts-halo`
             * class, with colors inherited from `.highcharts-color-{n}`.
             *
             * @sample {highcharts} highcharts/plotoptions/halo/
             *         Halo options
             * @sample {highstock} highcharts/plotoptions/halo/
             *         Halo options
             *
             * @type       {Highcharts.PlotSeriesStatesHoverHaloOptions}
             * @since      4.0
             * @product    highcharts highstock
             * @apioption  plotOptions.series.states.hover.halo
             */
            halo: {

                /**
                 * A collection of SVG attributes to override the appearance of
                 * the halo, for example `fill`, `stroke` and `stroke-width`.
                 *
                 * @type       {Highcharts.SVGAttributes}
                 * @since      4.0
                 * @product    highcharts highstock
                 * @apioption  plotOptions.series.states.hover.halo.attributes
                 */


                /**
                 * The pixel size of the halo. For point markers this is the
                 * radius of the halo. For pie slices it is the width of the
                 * halo outside the slice. For bubbles it defaults to 5 and is
                 * the width of the halo outside the bubble.
                 *
                 * @type       {number}
                 * @default    10
                 * @since      4.0
                 * @product    highcharts highstock
                 * @apioption  plotOptions.series.states.hover.halo.size
                 */
                size: 10,
                /*= if (build.classic) { =*/



                /**
                 * Opacity for the halo unless a specific fill is overridden
                 * using the `attributes` setting. Note that Highcharts is only
                 * able to apply opacity to colors of hex or rgb(a) formats.
                 *
                 * @type       {number}
                 * @default    0.25
                 * @since      4.0
                 * @product    highcharts highstock
                 * @apioption  plotOptions.series.states.hover.halo.opacity
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
         * @sample {highmaps} maps/plotoptions/series-allowpointselect/
         *         Allow point select demo
         *
         * @type       {Highcharts.PlotSeriesStatesSelectOptions}
         * @extends    plotOptions.series.states.hover
         * @excluding  brightness
         * @product    highmaps
         * @apioption  plotOptions.series.states.select
         */
        select: {
            // marker: {}
        }
    },



    /**
     * Sticky tracking of mouse events. When true, the `mouseOut` event
     * on a series isn't triggered until the mouse moves over another series,
     * or out of the plot area. When false, the `mouseOut` event on a
     * series is triggered when the mouse leaves the area around the series'
     * graph or markers. This also implies the tooltip when not shared. When
     * `stickyTracking` is false and `tooltip.shared` is false, the tooltip will
     * be hidden when moving the mouse between series. Defaults to true for line
     * and area type series, but to false for columns, pies etc.
     *
     * @sample {highcharts} highcharts/plotoptions/series-stickytracking-true/
     *         True by default
     * @sample {highcharts} highcharts/plotoptions/series-stickytracking-false/
     *         False
     *
     * @type       {boolean}
     * @default    {highcharts} true
     * @default    {highstock} true
     * @default    {highmaps} false
     * @since      2.0
     * @apioption  plotOptions.series.stickyTracking
     */
    stickyTracking: true,

    /**
     * A configuration object for the tooltip rendering of each single series.
     * Properties are inherited from [tooltip](#tooltip), but only the
     * following properties can be defined on a series level.
     *
     * @type       {object}
     * @since      2.3
     * @extends    tooltip
     * @excluding  animation,backgroundColor,borderColor,borderRadius,
     *             borderWidth,crosshairs,enabled,formatter,positioner,shadow,
     *             shared,shape,snap,style,useHTML
     * @apioption  plotOptions.series.tooltip
     */

    /**
     * When a series contains a data array that is longer than this, only
     * one dimensional arrays of numbers, or two dimensional arrays with
     * x and y values are allowed. Also, only the first point is tested,
     * and the rest are assumed to be the same format. This saves expensive
     * data checking and indexing in long series. Set it to `0` disable.
     *
     * @type       {number}
     * @default    1000
     * @since      2.2
     * @product    highcharts highstock
     * @apioption  plotOptions.series.turboThreshold
     */
    turboThreshold: 1000,

    /**
     * An array defining zones within a series. Zones can be applied to
     * the X axis, Y axis or Z axis for bubbles, according to the `zoneAxis`
     * option. The zone definitions have to be in ascending order regarding to
     * the value.
     *
     * In styled mode, the color zones are styled with the
     * `.highcharts-zone-{n}` class, or custom classed from the `className`
     * option
     * ([view live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/color-zones/)).
     *
     * @see [zoneAxis](#plotOptions.series.zoneAxis)
     *
     * @sample {highcharts} highcharts/series/color-zones-simple/
     *         Color zones
     * @sample {highstock} highcharts/series/color-zones-simple/
     *         Color zones
     *
     * @type       {Array}
     * @since      4.1.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.zones
     */

    /**
     * Styled mode only. A custom class name for the zone.
     *
     * @sample highcharts/css/color-zones/ Zones styled by class name
     *
     * @type       {string}
     * @since      5.0.0
     * @apioption  plotOptions.series.zones.className
     */

    /**
     * Defines the color of the series.
     *
     * @see [series color](#plotOptions.series.color)
     *
     * @type       {Highcharts.ColorString}
     * @since      4.1.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.zones.color
     */

    /**
     * A name for the dash style to use for the graph.
     *
     * @see [series.dashStyle](#plotOptions.series.dashStyle)
     *
     * @sample {highcharts|highstock} highcharts/series/color-zones-dashstyle-dot/
     *         Dashed line indicates prognosis
     *
     * @type       {string}
     * @since      4.1.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.zones.dashStyle
     */

    /**
     * Defines the fill color for the series (in area type series)
     *
     * @see [fillColor](#plotOptions.area.fillColor)
     *
     * @type       {Highcharts.ColorString}
     * @since      4.1.0
     * @product    highcharts highstock
     * @apioption  plotOptions.series.zones.fillColor
     */

    /**
     * The value up to where the zone extends, if undefined the zones stretches
     * to the last value in the series.
     *
     * @type      {number}
     * @since     4.1.0
     * @product   highcharts highstock
     * @apioption plotOptions.series.zones.value
     */



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
     * @sample {highcharts} highcharts/series/findnearestpointby/
     *         Different hover behaviors
     * @sample {highstock} highcharts/series/findnearestpointby/
     *         Different hover behaviors
     * @sample {highmaps} highcharts/series/findnearestpointby/
     *         Different hover behaviors
     *
     * @type       {string}
     * @since      5.0.10
     * @validvalue ["x", "xy"]
     * @apioption  plotOptions.series.findNearestPointBy
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
         * @name Highcharts.Series#chart
         * @type {Highcharts.Chart}
         */
        series.chart = chart;

        /**
         * Read only. The series' type, like "line", "area", "column" etc. The
         * type in the series options anc can be altered using {@link
         * Series#update}.
         *
         * @name Highcharts.Series#type
         * @type {string}
         */

        /**
         * Read only. The series' current options. To update, use {@link
         * Series#update}.
         *
         * @name Highcharts.Series#options
         * @type {Highcharts.PlotSeriesOptions}
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
             * @name Highcharts.Series#name
             * @type {string}
             */
            name: options.name,
            state: '',
            /**
             * Read only. The series' visibility state as set by {@link
             * Series#show}, {@link Series#hide}, or in the initial
             * configuration.
             *
             * @name Highcharts.Series#visible
             * @type {boolean}
             */
            visible: options.visible !== false, // true by default
            /**
             * Read only. The series' selected state as set by {@link
             * Highcharts.Series#select}.
             *
             * @name Highcharts.Series#selected
             * @type {boolean}
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

        fireEvent(this, 'afterInit');
    },

    /**
     * Insert the series in a collection with other series, either the chart
     * series or yAxis series, in the correct order according to the index
     * option. Used internally when adding series.
     *
     * @private
     * @function Highcharts.Series#insert
     *
     * @param  {Array<Highcharts.Series>} collection
     *         A collection of series, like `chart.series` or `xAxis.series`.
     *
     * @return {number}
     *         The index of the series in the collection.
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
     * @function Highcharts.Series#bindAxes
     *
     * @return {void}
     *
     * @exception 18
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
                     * @name Highcharts.Series#xAxis
                     * @type {Highcharts.Axis}
                     */
                    /**
                     * Read only. The unique yAxis object associated with the
                     * series.
                     *
                     * @name Highcharts.Series#yAxis
                     * @type {Highcharts.Axis}
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
     * @function Highcharts.Series#updateParallelArrays
     *
     * @param  {*} point
     *
     * @param  {number|string} i
     *
     * @return {void}
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
     * @function Highcharts.Series#autoIncrement
     *
     * @return {number}
     */
    autoIncrement: function () {

        var options = this.options,
            xIncrement = this.xIncrement,
            date,
            pointInterval,
            pointIntervalUnit = options.pointIntervalUnit,
            time = this.chart.time;

        xIncrement = pick(xIncrement, options.pointStart, 0);

        this.pointInterval = pointInterval = pick(
            this.pointInterval,
            options.pointInterval,
            1
        );

        // Added code for pointInterval strings
        if (pointIntervalUnit) {
            date = new time.Date(xIncrement);

            if (pointIntervalUnit === 'day') {
                time.set(
                    'Date',
                    date,
                    time.get('Date', date) + pointInterval
                );
            } else if (pointIntervalUnit === 'month') {
                time.set(
                    'Month',
                    date,
                    time.get('Month', date) + pointInterval
                );
            } else if (pointIntervalUnit === 'year') {
                time.set(
                    'FullYear',
                    date,
                    time.get('FullYear', date) + pointInterval
                );
            }

            pointInterval = date.getTime() - xIncrement;

        }

        this.xIncrement = xIncrement + pointInterval;
        return xIncrement;
    },

    /**
     * Set the series options by merging from the options tree. Called
     * internally on initiating and updating series. This function will not
     * redraw the series. For API usage, use {@link Series#update}.
     *
     * @function Highcharts.Series#setOptions
     *
     * @param  {Highcharts.PlotSeriesOptions} itemOptions
     *         The series options.
     *
     * @return {Highcharts.PlotSeriesOptions}
     *
     * @todo
     * Make events official: Fires the event `afterSetOptions`.
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

        fireEvent(this, 'afterSetOptions', { options: options });

        return options;
    },

    /**
     * Return series name in "Series {Number}" format or the one defined by a
     * user. This method can be simply overridden as series name format can
     * vary (e.g. technical indicators).
     *
     * @function Highcharts.Series#getName
     *
     * @return {string}
     *         The series name.
     */
    getName: function () {
        return this.name || 'Series ' + (this.index + 1);
    },

    /**
     * @private
     * @function Highcharts.Series#getCyclic
     *
     * @param  {string} prop
     *
     * @param  {*} value
     *
     * @param  {*|undefined} [defaults]
     *
     * @return {void}
     */
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
     * @function Highcharts.Series#getColor
     *
     * @return {Color}
     *         The series color.
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
     *
     * @function Highcharts.Series#getSymbol
     *
     * @return {void}
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
     * Internal function called from setData. If the point count is the same as
     * is was, or if there are overlapping X values, just run Point.update which
     * is cheaper, allows animation, and keeps references to points. This also
     * allows adding or removing points if the X-es don't match.
     *
     * @private
     * @function Highcharts.Series#updateData
     *
     * @param  {Array<*>} data
     *
     * @return {boolean}
     */
    updateData: function (data) {
        var options = this.options,
            oldData = this.points,
            pointsToAdd = [],
            hasUpdatedByKey,
            i,
            point,
            lastIndex,
            requireSorting = this.requireSorting;

        // Iterate the new data
        each(data, function (pointOptions) {
            var x,
                pointIndex;

            // Get the x of the new data point
            x = (
                H.defined(pointOptions) &&
                this.pointClass.prototype.optionsToObject.call(
                    { series: this },
                    pointOptions
                ).x
            );

            if (isNumber(x)) {
                // Search for the same X in the existing data set
                pointIndex = H.inArray(x, this.xData, lastIndex);

                // Matching X not found, add point (but later)
                if (pointIndex === -1) {
                    pointsToAdd.push(pointOptions);

                // Matching X found, update
                } else if (pointOptions !== options.data[pointIndex]) {
                    oldData[pointIndex].update(
                        pointOptions,
                        false,
                        null,
                        false
                    );

                    // Mark it touched, below we will remove all points that
                    // are not touched.
                    oldData[pointIndex].touched = true;

                    // Speed optimize by only searching from last known index.
                    // Performs ~20% bettor on large data sets.
                    if (requireSorting) {
                        lastIndex = pointIndex;
                    }
                // Point exists, no changes, don't remove it
                } else if (oldData[pointIndex]) {
                    oldData[pointIndex].touched = true;
                }
                hasUpdatedByKey = true;
            }
        }, this);

        // Remove points that don't exist in the updated data set
        if (hasUpdatedByKey) {
            i = oldData.length;
            while (i--) {
                point = oldData[i];
                if (!point.touched) {
                    point.remove(false);
                }
                point.touched = false;
            }

        // If we did not find keys (x-values), and the length is the same,
        // update one-to-one
        } else if (data.length === oldData.length) {
            each(data, function (point, i) {
                // .update doesn't exist on a linked, hidden series (#3709)
                if (oldData[i].update && point !== options.data[i]) {
                    oldData[i].update(point, false, null, false);
                }
            });

        // Did not succeed in updating data
        } else {
            return false;
        }

        // Add new points
        each(pointsToAdd, function (point) {
            this.addPoint(point, false);
        }, this);

        return true;
    },

    /**
     * Apply a new set of data to the series and optionally redraw it. The new
     * data array is passed by reference (except in case of `updatePoints`), and
     * may later be mutated when updating the chart data.
     *
     * Note the difference in behaviour when setting the same amount of points,
     * or a different amount of points, as handled by the `updatePoints`
     * parameter.
     *
     * @function Highcharts.Series#setData
     *
     * @param  {Array<*>} data
     *         Takes an array of data in the same format as described under
     *         `series.{type}.data` for the given series type, for example a
     *         line series would take data in the form described under
     *         [series.line.data](https://api.highcharts.com/highcharts/series.line.data).
     *
     * @param  {boolean|undefined} [redraw=true]
     *         Whether to redraw the chart after the series is altered. If doing
     *         more operations on the chart, it is a good idea to set redraw to
     *         false and call {@link Chart#redraw} after.
     *
     * @param  {Highcharts.AnimationOptionsObject|undefined} [animation]
     *         When the updated data is the same length as the existing data,
     *         points will be updated by default, and animation visualizes how
     *         the points are changed. Set false to disable animation, or a
     *         configuration object to set duration or easing.
     *
     * @param  {boolean|undefined} [updatePoints=true]
     *         When the updated data is the same length as the existing data, or
     *         points can be matched by X values, points will be updated instead
     *         of replaced. This allows updating with animation and performs
     *         better. In this case, the original array is not passed by
     *         reference. Set `false` to prevent.
     *
     * @return {void}
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
            valueCount = pointArrayMap && pointArrayMap.length,
            updatedData;

        data = data || [];
        dataLength = data.length;
        redraw = pick(redraw, true);

        // If the point count is the same as is was, just run Point.update which
        // is cheaper, allows animation, and keeps references to points.
        if (
            updatePoints !== false &&
            dataLength &&
            oldDataLength &&
            !series.cropped &&
            !series.hasGroupedData &&
            series.visible &&
            // Soft updating has no benefit in boost, and causes JS error
            // (#8355)
            !series.isSeriesBoosting
        ) {
            updatedData = this.updateData(data);
        }

        if (!updatedData) {

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
            if (yData && isString(yData[0])) {
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
     * @function Highcharts.Series#processData
     *
     * @param  {boolean} force
     *         Force data grouping.
     *
     * @return {boolean|undefined}
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
            throwOnUnsorted = series.requireSorting,
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
                series.yData && (
                    processedXData[0] < min ||
                    processedXData[dataLength - 1] > max
                )
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
            } else if (distance < 0 && throwOnUnsorted) {
                H.error(15);
                throwOnUnsorted = false; // Only once
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
     * @function Highcharts.Series#cropData
     *
     * @param  {Array<number>} xData
     *
     * @param  {Array<number>} yData
     *
     * @param  {number} min
     *
     * @param  {number} max
     *
     * @param  {number|undefined} [cropShoulder]
     *
     * @return {*}
     */
    cropData: function (xData, yData, min, max, cropShoulder) {
        var dataLength = xData.length,
            cropStart = 0,
            cropEnd = dataLength,
            i,
            j;

        // line-type series need one point outside
        cropShoulder = pick(cropShoulder, this.cropShoulder, 1);

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
     * @function Highcharts.Series#generatePoints
     *
     * @return {void}
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
                 * @name Highcharts.Point#dataGroup
                 * @type {Highcharts.SVGElement|undefined}
                 *
                 * @product highstock
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
         * Read only. An array containing those values converted to points.
         * In case the series data length exceeds the `cropThreshold`, or if the
         * data is grouped, `series.data` doesn't contain all the points. Also,
         * in case a series is hidden, the `data` array may be empty. To access
         * raw values, `series.options.data` will always be up to date.
         * `Series.data` only contains the points that have been created on
         * demand. To modify the data, use {@link Highcharts.Series#setData} or
         * {@link Highcharts.Point#update}.
         *
         * @name Highcharts.Series#data
         * @type {Array<Point>}
         *
         * @see Series.points
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
         *
         * @name Highcharts.Series#points
         * @type {Array<Highcharts.Point>}
         */
        series.points = points;
    },

    /**
     * Calculate Y extremes for the visible data. The result is set as
     * `dataMin` and `dataMax` on the Series item.
     *
     * @function Highcharts.Series#getExtremes
     *
     * @param  {Array<number>|undefined} [yData]
     *         The data to inspect. Defaults to the current data within the
     *         visible range.
     *
     * @return {void}
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
            // Handle X outside the viewed area. This does not work with non-
            // sorted data like scatter (#7639).
            shoulder = this.requireSorting ? 1 : 0,
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
            // outside the visible range (#7061), consider y extremes.
            validValue = (
                (isNumber(y, true) || isArray(y)) &&
                (!yAxis.positiveValuesOnly || (y.length || y > 0))
            );
            withinRange = (
                this.getExtremesFromAll ||
                this.options.getExtremesFromAll ||
                this.cropped ||
                (
                    (xData[i + shoulder] || x) >= xMin &&
                    (xData[i - shoulder] || x) <= xMax
                )
            );

            if (validValue && withinRange) {

                j = y.length;
                if (j) { // array, like ohlc or range data
                    while (j--) {
                        if (typeof y[j] === 'number') { // #7380
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
     *
     * @function Highcharts.Series#translate
     *
     * @return {void}
     *
     * @todo
     * Make events official: Fires the event `afterTranslate`.
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

        /*
         * Plotted coordinates need to be within a limited range. Drawing too
         * far outside the viewport causes various rendering issues (#3201,
         * #3923, #7555).
         */
        function limitedRange(val) {
            return Math.min(Math.max(-1e5, val), 1e5);
        }

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
                limitedRange(xAxis.translate( // #3923
                    xValue,
                    0,
                    0,
                    0,
                    1,
                    pointPlacement,
                    this.type === 'flags'
                )) // #3923
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
                    yBottom = pick(isNumber(threshold) && threshold, yAxis.min);
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
                limitedRange(yAxis.translate(yBottom, 0, 1, 0, 1)) :
                null;

            // general hook, used for Highstock compare mode
            if (hasModifyValue) {
                yValue = series.modifyValue(yValue, point);
            }

            // Set the the plotY value, reset it for redraws
            point.plotY = plotY =
                (typeof yValue === 'number' && yValue !== Infinity) ?
                    limitedRange(yAxis.translate(yValue, 0, 1, 0, 1)) : // #3201
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

        fireEvent(this, 'afterTranslate');
    },

    /**
     * Return the series points with null points filtered out.
     *
     * @param  {Array<Highcharts.Point>|undefined} [points]
     *         The points to inspect, defaults to {@link Series.points}.
     *
     * @param  {boolean|undefined} [insideOnly=false]
     *         Whether to inspect only the points that are inside the visible
     *         view.
     *
     * @return {Array<Highcharts.Point>}
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
     * @function Highcharts.Series#setClip
     *
     * @param  {boolean|undefined} [animation]
     *
     * @return {void}
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
                if (inverted) {
                    clipBox.x = chart.plotSizeX;
                }

                chart[sharedClipKey + 'm'] = markerClipRect = renderer.clipRect(
                    // include the width of the first marker
                    inverted ? chart.plotSizeX + 99 : -99,
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
            this.group.clip(
                animation || seriesClipBox ? clipRect : chart.clipRect
            );
            this.markerGroup.clip(markerClipRect);
            this.sharedClipKey = sharedClipKey;
        }

        // Remove the shared clipping rectangle when all series are shown
        if (!animation) {
            if (clipRect.count[this.index]) {
                delete clipRect.count[this.index];
                clipRect.count.length -= 1;
            }

            if (
                clipRect.count.length === 0 &&
                sharedClipKey &&
                chart[sharedClipKey]
            ) {
                if (!seriesClipBox) {
                    chart[sharedClipKey] = chart[sharedClipKey].destroy();
                }
                if (chart[sharedClipKey + 'm']) {
                    chart[sharedClipKey + 'm'] =
                        chart[sharedClipKey + 'm'].destroy();
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
     * @function Highcharts.Series#animate
     *
     * @param  {boolean} init
     *         Initialize the animation.
     *
     * @return {void}
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
                    width: chart.plotSizeX,
                    x: 0
                }, animation);
            }
            if (chart[sharedClipKey + 'm']) {
                chart[sharedClipKey + 'm'].animate({
                    width: chart.plotSizeX + 99,
                    x: 0
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
     * @function Highcharts.Series#afterAnimate
     *
     * @return {void}
     *
     * @todo
     * Make events official: Fires the event `afterAnimate`.
     */
    afterAnimate: function () {
        this.setClip();
        fireEvent(this, 'afterAnimate');
        this.finishedAnimating = true;
    },

    /**
     * Draw the markers for line-like series types, and columns or other
     * graphical representation for {@link Point} objects for other series
     * types. The resulting element is typically stored as {@link
     * Point.graphic}, and is created on the first call and updated and moved on
     * subsequent calls.
     *
     * @function Highcharts.Series#drawPoints
     *
     * @return {void}
     */
    drawPoints: function () {
        var series = this,
            points = series.points,
            chart = series.chart,
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
                series.closestPointRangePx >= (
                    seriesMarkerOptions.enabledThreshold *
                    seriesMarkerOptions.radius
                )
            );

        if (seriesMarkerOptions.enabled !== false || series._hasPointMarkers) {

            for (i = 0; i < points.length; i++) {
                point = points[i];
                graphic = point.graphic;
                pointMarkerOptions = point.marker || {};
                hasPointMarker = !!point.marker;
                enabled = (
                    globallyEnabled &&
                    pointMarkerOptions.enabled === undefined
                ) || pointMarkerOptions.enabled;
                isInside = point.isInside;

                // only draw the point if y is defined
                if (enabled && !point.isNull) {

                    // Shortcuts
                    symbol = pick(pointMarkerOptions.symbol, series.symbol);

                    markerAttribs = series.markerAttribs(
                        point,
                        point.selected && 'select'
                    );

                    if (graphic) { // update
                        // Since the marker group isn't clipped, each individual
                        // marker must be toggled
                        graphic[isInside ? 'show' : 'hide'](true)
                            .animate(markerAttribs);
                    } else if (
                        isInside &&
                        (markerAttribs.width > 0 || point.hasImage)
                    ) {

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
                            hasPointMarker ?
                                pointMarkerOptions :
                                seriesMarkerOptions
                        )
                        .add(markerGroup);
                    }

                    /*= if (build.classic) { =*/
                    // Presentational attributes
                    if (graphic) {
                        graphic.attr(
                            series.pointAttribs(
                                point,
                                point.selected && 'select'
                            )
                        );
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
     * @param  {Highcharts.Point} point
     *         The Point to inspect.
     *
     * @param  {string|undefined} [state]
     *         The state, can be either `hover`, `select` or undefined.
     *
     * @return {Highcharts.SVGAttributes}
     *         A hash containing those attributes that are not settable from
     *         CSS.
     */
    markerAttribs: function (point, state) {
        var seriesMarkerOptions = this.options.marker,
            seriesStateOptions,
            pointMarkerOptions = point.marker || {},
            symbol = pointMarkerOptions.symbol || seriesMarkerOptions.symbol,
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
                radius + (
                    seriesStateOptions && seriesStateOptions.radiusPlus ||
                    0
                )
            );
        }

        point.hasImage = symbol && symbol.indexOf('url') === 0;

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

    /*= if (build.classic) { =*/
    /**
     * Internal function to get presentational attributes for each point. Unlike
     * {@link Series#markerAttribs}, this function should return those
     * attributes that can also be set in CSS. In styled mode, `pointAttribs`
     * won't be called.
     *
     * @param  {Highcharts.Point} point
     *         The point instance to inspect.
     *
     * @param  {string|undefined} [state]
     *         The point state, can be either `hover`, `select` or undefined for
     *         normal state.
     *
     * @return {Highcharts.SVGAttributes}
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

        color = (
            pointColorOption ||
            zoneColor ||
            pointColor ||
            color
        );
        fill = (
            pointMarkerOptions.fillColor ||
            seriesMarkerOptions.fillColor ||
            color
        );
        stroke = (
            pointMarkerOptions.lineColor ||
            seriesMarkerOptions.lineColor ||
            color
        );

        // Handle hover and select states
        if (state) {
            seriesStateOptions = seriesMarkerOptions.states[state];
            pointStateOptions = (
                pointMarkerOptions.states && pointMarkerOptions.states[state]
            ) || {};
            strokeWidth = pick(
                pointStateOptions.lineWidth,
                seriesStateOptions.lineWidth,
                strokeWidth + pick(
                    pointStateOptions.lineWidthPlus,
                    seriesStateOptions.lineWidthPlus,
                    0
                )
            );
            fill = (
                pointStateOptions.fillColor ||
                seriesStateOptions.fillColor ||
                fill
            );
            stroke = (
                pointStateOptions.lineColor ||
                seriesStateOptions.lineColor ||
                stroke
            );
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
     * @function Highcharts.Series#destroy
     *
     * @return {void}
     *
     * @todo
     * Make events official: Fires the event `destroy`.
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

        // Clear the animation timeout if we are destroying the series during
        // initial animation
        H.clearTimeout(series.animationTimeout);

        // Destroy all SVGElements associated to the series
        objectEach(series, function (val, prop) {
            // Survive provides a hook for not destroying
            if (val instanceof SVGElement && !val.survive) {

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
     * @function Highcharts.Series#getGraphPath
     *
     * @param  {Array<*>} points
     *
     * @param  {boolean} nullsAsZeroes
     *
     * @param  {boolean} connectCliffs
     *
     * @return {Array<number|string>}
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

            if (
                (point.leftCliff || (lastPoint && lastPoint.rightCliff)) &&
                !connectCliffs
            ) {
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

                // Generate the spline as defined in the SplineSeries object
                } else if (series.getPointSpline) {

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

                // Prepare for animation. When step is enabled, there are two
                // path nodes for each x value.
                xMap.push(point.x);
                if (step) {
                    xMap.push(point.x);
                    if (step === 2) { // step = center (#8073)
                        xMap.push(point.x);
                    }
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
     *
     * @function Highcharts.Series#drawGraph
     *
     * @return {void}
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

        props = series.getZonesGraphs(props);

        // Draw the graph
        each(props, function (prop, i) {
            var graphKey = prop[0],
                graph = series[graphKey],
                attribs;

            if (graph) {
                graph.endX = series.preventGraphAnimation ?
                    null :
                    graphPath.xMap;
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
                    // Polygon series use filled graph
                    'fill': (series.fillGraph && series.color) || 'none'
                };

                if (prop[3]) {
                    attribs.dashstyle = prop[3];
                } else if (options.linecap !== 'square') {
                    attribs['stroke-linecap'] = attribs['stroke-linejoin'] =
                        'round';
                }

                graph = series[graphKey]
                    .attr(attribs)
                    // Add shadow to normal series (0) or to first zone (1)
                    // #3932
                    .shadow((i < 2) && options.shadow);
                /*= } =*/
            }

            // Helpers for animation
            if (graph) {
                graph.startX = graphPath.xMap;
                graph.isArea = graphPath.isArea; // For arearange animation
            }
        });
    },

    /**
     * Get zones properties for building graphs.
     * Extendable by series with multiple lines within one series.
     *
     * @private
     * @function Highcharts.Series#getZonesGraphs
     *
     * @param  {Array<Array<string>>} props
     *
     * @return {Array<Array<string>>}
     */
    getZonesGraphs: function (props) {
        // Add the zone properties if any
        each(this.zones, function (zone, i) {
            props.push([
                'zone-graph-' + i,
                'highcharts-graph highcharts-zone-graph-' + i + ' ' +
                    (zone.className || ''),
                /*= if (build.classic) { =*/
                zone.color || this.color,
                zone.dashStyle || this.options.dashStyle
                /*= } =*/
            ]);
        }, this);

        return props;
    },

    /**
     * Clip the graphs into zones for colors and styling.
     *
     * @private
     * @function Highcharts.Series#applyZones
     *
     * @return {void}
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
            // unless it is not waterfall series, then use showLine property to
            // set lines between columns to be visible (#7862)
            if (graph && !this.showLine) {
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
                translatedFrom = Math.min(
                    Math.max(
                        pick(translatedTo, translatedFrom), 0
                    ),
                    chartSizeMax
                );
                translatedTo = Math.min(
                    Math.max(
                        Math.round(
                            axis.toPixels(
                                pick(threshold.value, extremes.max),
                                true
                            )
                        ),
                        0
                    ),
                    chartSizeMax
                );

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
                // VML SUPPPORT
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
                // END OF VML SUPPORT
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

                // Clear translatedTo for indicators
                if (series.resetZones && translatedTo === 0) {
                    translatedTo = undefined;
                }
            });
            this.clips = clips;
        }
    },

    /**
     * Initialize and perform group inversion on series.group and
     * series.markerGroup.
     *
     * @private
     * @function Highcharts.Series#invertGroups
     *
     * @param  {boolean} inverted
     *
     * @return {void}
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

        // On subsequent render and redraw, just do setInvert without setting up
        // events again
        series.invertGroups = setInvert;
    },

    /**
     * General abstraction for creating plot groups like series.group,
     * series.dataLabelsGroup and series.markerGroup. On subsequent calls, the
     * group will only be adjusted to the updated plot size.
     *
     * @private
     * @function Highcharts.Series#plotGroup
     *
     * @param  {string} prop
     *
     * @param  {string} name
     *
     * @param  {string} visibility
     *
     * @param  {number} zIndex
     *
     * @param  {Highcharts.SVGElement} parent
     *
     * @return {Highcharts.SVGElement}
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
                (
                    defined(this.colorIndex) ?
                        'highcharts-color-' + this.colorIndex + ' ' :
                        ''
                ) +
                (this.options.className || '') +
                (
                    group.hasClass('highcharts-tracker') ?
                        ' highcharts-tracker' :
                        ''
                )
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
     *
     * @function Highcharts.Series#getPlotBox
     *
     * @return {Highcharts.SeriesPlotBoxObject}
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
     *
     * @function Highcharts.Series#render
     *
     * @return {void}
     *
     * @todo
     * Make events official: Fires the event `afterRender`.
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

/*        each(series.points, function (point) {
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

        fireEvent(series, 'afterRender');
    },

    /**
     * Redraw the series. This function is called internally from `chart.redraw`
     * and normally shouldn't be called directly.
     *
     * @private
     * @function Highcharts.Series#redraw
     *
     * @return {void}
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

    /**
     * @private
     * @function Highcharts.Series#searchPoint
     *
     * @param  {*} e
     *
     * @param  {*} compareX
     *
     * @return {Highcharts.Point}
     */
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
     * @function Highcharts.Series#buildKDTree
     *
     * @return {void}
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

    /**
     * @private
     * @function Highcharts.Series#searchKDTree
     *
     * @param  {*} point
     *
     * @param  {*} compareX
     *
     * @return {Highcharts.Point}
     */
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

/**
 * A line series displays information as a series of data points connected by
 * straight line segments.
 *
 * @sample {highcharts} highcharts/demo/line-basic/
 *         Line chart
 * @sample {highstock} stock/demo/basic-line/
 *         Line chart
 *
 * @extends    plotOptions.series
 * @product    highcharts highstock
 * @apioption  plotOptions.line
 */

/**
 * A `line` series. If the [type](#series.line.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type       {object}
 * @extends    series,plotOptions.line
 * @excluding  dataParser,dataURL
 * @product    highcharts highstock
 * @apioption  series.line
 */

/**
 * An array of data points for the series. For the `line` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 1],
 *         [1, 2],
 *         [2, 8]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.line.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 9,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 6,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type       {Array<number|Array<number|string|DateTime>|*>}
 * @apioption  series.line.data
 */

/**
 * An additional, individual class name for the data point's graphic
 * representation.
 *
 * @type       {string}
 * @product    highcharts
 * @since      5.0.0
 * @apioption  series.line.data.className
 */

/**
 * Individual color for the point. By default the color is pulled from
 * the global `colors` array.
 *
 * In styled mode, the `color` option doesn't take effect. Instead, use
 * `colorIndex`.
 *
 * @sample {highcharts} highcharts/point/color/
 *         Mark the highest point
 *
 * @type       {Highcharts.ColorString}
 * @product    highcharts highstock
 * @apioption  series.line.data.color
 */

/**
 * A specific color index to use for the point, so its graphic representations
 * are given the class name `highcharts-color-{n}`. In styled mode this will
 * change the color of the graphic. In non-styled mode, the color by is set by
 * the `fill` attribute, so the change in class name won't have a visual effect
 * by default.
 *
 * @type       {number}
 * @since      5.0.0
 * @product    highcharts
 * @apioption  series.line.data.colorIndex
 */

/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](
 * #plotOptions.series.dataLabels).
 *
 * @sample highcharts/point/datalabels/
 *         Show a label for the last value
 *
 * @type       {Highcharts.PlotSeriesDataLabelsOptions}
 * @product    highcharts highstock
 * @apioption  series.line.data.dataLabels
 */

/**
 * A description of the point to add to the screen reader information
 * about the point. Requires the Accessibility module.
 *
 * @type       {string}
 * @since      5.0.0
 * @apioption  series.line.data.description
 */

/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 *
 * @sample {highcharts} highcharts/point/id/
 *         Remove an id'd point
 *
 * @type       {string}
 * @since      1.2.0
 * @product    highcharts highstock
 * @apioption  series.line.data.id
 */

/**
 * The rank for this point's data label in case of collision. If two
 * data labels are about to overlap, only the one with the highest `labelrank`
 * will be drawn.
 *
 * @type       {number}
 * @apioption  series.line.data.labelrank
 */

/**
 * The name of the point as shown in the legend, tooltip, dataLabel
 * etc.
 *
 * @see [xAxis.uniqueNames](#xAxis.uniqueNames)
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Point names
 *
 * @type       {string}
 * @apioption  series.line.data.name
 */

/**
 * Whether the data point is selected initially.
 *
 * @type       {boolean}
 * @default    false
 * @product    highcharts highstock
 * @apioption  series.line.data.selected
 */

/**
 * The x value of the point. For datetime axes, the X value is the timestamp
 * in milliseconds since 1970.
 *
 * @type       {number}
 * @product    highcharts highstock
 * @apioption  series.line.data.x
 */

/**
 * The y value of the point.
 *
 * @type       {number}
 * @product    highcharts highstock
 * @apioption  series.line.data.y
 */

/**
 * Individual point events
 *
 * @extends    plotOptions.series.point.events
 * @product    highcharts highstock
 * @apioption  series.line.data.events
 */

/**
 * @extends    plotOptions.series.marker
 * @product    highcharts highstock
 * @apioption  series.line.data.marker
 */
