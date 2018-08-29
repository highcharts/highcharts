/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * The returned object literal from the {@link Highcharts.Axis#getExtremes}
 * function.
 *
 * @typedef {*} Highcharts.ExtremesObject
 *
 * @property {number} dataMax
 *           The maximum value of the axis' associated series.
 *
 * @property {number} dataMin
 *           The minimum value of the axis' associated series.
 *
 * @property {number} max
 *           The maximum axis value, either automatic or set manually. If
 *           the `max` option is not set, `maxPadding` is 0 and `endOnTick`
 *           is false, this value will be the same as `dataMax`.
 *
 * @property {number} min
 *           The minimum axis value, either automatic or set manually. If
 *           the `min` option is not set, `minPadding` is 0 and
 *           `startOnTick` is false, this value will be the same
 *           as `dataMin`.
 *
 * @property {number} userMax
 *           The user defined maximum, either from the `max` option or from
 *           a zoom or `setExtremes` action.
 *
 * @property {number} userMin
 *           The user defined minimum, either from the `min` option or from
 *           a zoom or `setExtremes` action.
 */

/**
 * Position of the axis title.
 *
 * @typedef {*} Highcharts.AxisTitlePositionObject
 *
 * @property {number} x
 *           X position.
 *
 * @property {number} y
 *           Y position.
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

 * @param {Highcharts.Chart} chart
 *        The Chart instance to apply the axis on.
 *
 * @param {Highcharts.XAxisOptions|Highcharts.YAxisOptions|Highcharts.ZAxisOptions} options
 *        Axis options.
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
     * See [the Axis object](/class-reference/Highcharts.Axis) for
     * programmatic access to the axis.
     *
     * @productdesc {highmaps}
     * In Highmaps, the axis is hidden, but it is used behind the scenes to
     * control features like zooming and panning. Zooming is in effect the same
     * as setting the extremes of one of the exes.
     *
     * @optionparent xAxis
     */
    defaultOptions: {

        /**
         * When using multiple axis, the ticks of two or more opposite axes
         * will automatically be aligned by adding ticks to the axis or axes
         * with the least ticks, as if `tickAmount` were specified.
         *
         * This can be prevented by setting `alignTicks` to false. If the grid
         * lines look messy, it's a good idea to hide them for the secondary
         * axis by setting `gridLineWidth` to 0.
         *
         * If `startOnTick` or `endOnTick` in an Axis options are set to false,
         * then the `alignTicks ` will be disabled for the Axis.
         *
         * Disabled for logarithmic axes.
         *
         * @type       {boolean}
         * @default    true
         * @product    highcharts highstock
         * @apioption  xAxis.alignTicks
         */

        /**
         * Whether to allow decimals in this axis' ticks. When counting
         * integers, like persons or hits on a web page, decimals should
         * be avoided in the labels.
         *
         * @see [minTickInterval](#xAxis.minTickInterval)
         *
         * @sample {highcharts|highstock} highcharts/yaxis/allowdecimals-true/
         *         True by default
         * @sample {highcharts|highstock} highcharts/yaxis/allowdecimals-false/
         *         False
         *
         * @type       {boolean}
         * @default    true
         * @since      2.0
         * @apioption  xAxis.allowDecimals
         */

        /**
         * When using an alternate grid color, a band is painted across the
         * plot area between every other grid line.
         *
         * @sample {highcharts} highcharts/yaxis/alternategridcolor/
         *         Alternate grid color on the Y axis
         * @sample {highstock} stock/xaxis/alternategridcolor/
         *         Alternate grid color on the Y axis
         *
         * @type       {Highcharts.ColorString}
         * @apioption  xAxis.alternateGridColor
         */

        /**
         * An array defining breaks in the axis, the sections defined will be
         * left out and all the points shifted closer to each other.
         *
         * @productdesc {highcharts}
         * Requires that the broken-axis.js module is loaded.
         *
         * @sample {highcharts} highcharts/axisbreak/break-simple/
         *         Simple break
         * @sample {highcharts|highstock} highcharts/axisbreak/break-visualized/
         *         Advanced with callback
         * @sample {highstock} stock/demo/intraday-breaks/
         *         Break on nights and weekends
         *
         * @type       {Array<*>}
         * @since      4.1.0
         * @product    highcharts highstock
         * @apioption  xAxis.breaks
         */

        /**
         * A number indicating how much space should be left between the start
         * and the end of the break. The break size is given in axis units,
         * so for instance on a `datetime` axis, a break size of 3600000 would
         * indicate the equivalent of an hour.
         *
         * @type       {number}
         * @default    0
         * @since      4.1.0
         * @product    highcharts highstock
         * @apioption   xAxis.breaks.breakSize
         */

        /**
         * The point where the break starts.
         *
         * @type       {number}
         * @since      4.1.0
         * @product    highcharts highstock
         * @apioption  xAxis.breaks.from
         */

        /**
         * Defines an interval after which the break appears again. By default
         * the breaks do not repeat.
         *
         * @type       {number}
         * @default    0
         * @since      4.1.0
         * @product    highcharts highstock
         * @apioption  xAxis.breaks.repeat
         */

        /**
         * The point where the break ends.
         *
         * @type       {number}
         * @since      4.1.0
         * @product    highcharts highstock
         * @apioption  xAxis.breaks.to
         */

        /**
         * If categories are present for the xAxis, names are used instead of
         * numbers for that axis. Since Highcharts 3.0, categories can also
         * be extracted by giving each point a [name](#series.data) and setting
         * axis [type](#xAxis.type) to `category`. However, if you have multiple
         * series, best practice remains defining the `categories` array.
         *
         * Example:
         *
         * <pre>categories: ['Apples', 'Bananas', 'Oranges']</pre>
         *
         * @sample {highcharts} highcharts/demo/line-labels/
         *         With
         * @sample {highcharts} highcharts/xaxis/categories/
         *         Without
         *
         * @type       {Array<string>}
         * @product    highcharts
         * @apioption  xAxis.categories
         */

        /**
         * The highest allowed value for automatically computed axis extremes.
         *
         * @see [floor](#xAxis.floor)
         *
         * @sample {highcharts|highstock} highcharts/yaxis/floor-ceiling/
         *         Floor and ceiling
         *
         * @type       {number}
         * @since      4.0
         * @product    highcharts highstock
         * @apioption  xAxis.ceiling
         */

        /**
         * A class name that opens for styling the axis by CSS, especially in
         * Highcharts styled mode. The class name is applied to group elements
         * for the grid, axis elements and labels.
         *
         * @sample {highcharts|highstock|highmaps} highcharts/css/axis/
         *         Multiple axes with separate styling
         *
         * @type       {string}
         * @since      5.0.0
         * @apioption  xAxis.className
         */

        /**
         * Configure a crosshair that follows either the mouse pointer or the
         * hovered point.
         *
         * In styled mode, the crosshairs are styled in the
         * `.highcharts-crosshair`, `.highcharts-crosshair-thin` or
         * `.highcharts-xaxis-category` classes.
         *
         * @productdesc {highstock}
         * In Highstock, by default, the crosshair is enabled on the X axis and
         * disabled on the Y axis.
         *
         * @sample {highcharts} highcharts/xaxis/crosshair-both/
         *         Crosshair on both axes
         * @sample {highstock} stock/xaxis/crosshairs-xy/
         *         Crosshair on both axes
         * @sample {highmaps} highcharts/xaxis/crosshair-both/
         *         Crosshair on both axes
         *
         * @type       {boolean|*}
         * @default    false
         * @since      4.1
         * @apioption  xAxis.crosshair
         */

        /**
         * A class name for the crosshair, especially as a hook for styling.
         *
         * @type       {string}
         * @since      5.0.0
         * @apioption  xAxis.crosshair.className
         */

        /**
         * The color of the crosshair. Defaults to `#cccccc` for numeric and
         * datetime axes, and `rgba(204,214,235,0.25)` for category axes, where
         * the crosshair by default highlights the whole category.
         *
         * @sample {highcharts|highstock|highmaps} highcharts/xaxis/crosshair-customized/
         *         Customized crosshairs
         *
         * @type       {Highcharts.ColorString}
         * @default    #cccccc
         * @since      4.1
         * @apioption  xAxis.crosshair.color
         */

        /**
         * The dash style for the crosshair. See
         * [series.dashStyle](#plotOptions.series.dashStyle)
         * for possible values.
         *
         * @sample {highcharts|highmaps} highcharts/xaxis/crosshair-dotted/
         *         Dotted crosshair
         * @sample {highstock} stock/xaxis/crosshair-dashed/
         *         Dashed X axis crosshair
         *
         * @type       {string}
         * @default    Solid
         * @since      4.1
         * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot",
         *              "ShortDashDotDot", "Dot", "Dash" ,"LongDash",
         *              "DashDot", "LongDashDot", "LongDashDotDot"]
         * @apioption  xAxis.crosshair.dashStyle
         */

        /**
         * A label on the axis next to the crosshair.
         *
         * In styled mode, the label is styled with the
         * `.highcharts-crosshair-label` class.
         *
         * @sample {highstock} stock/xaxis/crosshair-label/
         *         Crosshair labels
         * @sample {highstock} highcharts/css/crosshair-label/
         *         Style mode
         *
         * @type       {*}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label
         */

        /**
         * Alignment of the label compared to the axis. Defaults to `left` for
         * right-side axes, `right` for left-side axes and `center` for
         * horizontal axes.
         *
         * @type       {string}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.align
         */

        /**
         * The background color for the label. Defaults to the related series
         * color, or `#666666` if that is not available.
         *
         * @type       {Highcharts.ColorString}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.backgroundColor
         */

        /**
         * The border color for the crosshair label
         *
         * @type       {Highcharts.ColorString}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.borderColor
         */

        /**
         * The border corner radius of the crosshair label.
         *
         * @type       {number}
         * @default    3
         * @since      2.1.10
         * @product    highstock
         * @apioption  xAxis.crosshair.label.borderRadius
         */

        /**
         * The border width for the crosshair label.
         *
         * @type       {number}
         * @default    0
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.borderWidth
         */

        /**
         * A format string for the crosshair label. Defaults to `{value}` for
         * numeric axes and `{value:%b %d, %Y}` for datetime axes.
         *
         * @type       {string}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.format
         */

        /**
         * Formatter function for the label text.
         *
         * @type       {Function}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.formatter
         */

        /**
         * Padding inside the crosshair label.
         *
         * @type       {number}
         * @default    8
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.padding
         */

        /**
         * The shape to use for the label box.
         *
         * @type       {string}
         * @default    callout
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.shape
         */

        /**
         * Text styles for the crosshair label.
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "white", "fontWeight": "normal", "fontSize": "11px", "textAlign": "center"}
         * @since      2.1
         * @product    highstock
         * @apioption  xAxis.crosshair.label.style
         */

        /**
         * Whether the crosshair should snap to the point or follow the pointer
         * independent of points.
         *
         * @sample {highcharts|highstock} highcharts/xaxis/crosshair-snap-false/
         *         True by default
         * @sample {highmaps} maps/demo/latlon-advanced/
         *         Snap is false
         *
         * @type       {boolean}
         * @default    true
         * @since      4.1
         * @apioption  xAxis.crosshair.snap
         */

        /**
         * The pixel width of the crosshair. Defaults to 1 for numeric or
         * datetime axes, and for one category width for category axes.
         *
         * @sample {highcharts} highcharts/xaxis/crosshair-customized/
         *         Customized crosshairs
         * @sample {highstock} highcharts/xaxis/crosshair-customized/
         *         Customized crosshairs
         * @sample {highmaps} highcharts/xaxis/crosshair-customized/
         *         Customized crosshairs
         *
         * @type       {number}
         * @default    1
         * @since      4.1
         * @apioption  xAxis.crosshair.width
         */

        /**
         * The Z index of the crosshair. Higher Z indices allow drawing the
         * crosshair on top of the series or behind the grid lines.
         *
         * @type       {number}
         * @default    2
         * @since      4.1
         * @apioption  xAxis.crosshair.zIndex
         */

        /**
         * For a datetime axis, the scale will automatically adjust to the
         * appropriate unit. This member gives the default string
         * representations used for each unit. For intermediate values,
         * different units may be used, for example the `day` unit can be used
         * on midnight and `hour` unit be used for intermediate values on the
         * same axis. For an overview of the replacement codes, see
         * [dateFormat](/class-reference/Highcharts#dateFormat). Defaults to:
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
         * @sample {highcharts} highcharts/xaxis/datetimelabelformats/
         *         Different day format on X axis
         * @sample {highstock} stock/xaxis/datetimelabelformats/
         *         More information in x axis labels
         *
         * @type       {*}
         * @product    highcharts highstock
         * @apioption  xAxis.dateTimeLabelFormats
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
         * _Requires Accessibility module_
         *
         * Description of the axis to screen reader users.
         *
         * @type       {string}
         * @since      5.0.0
         * @apioption  xAxis.description
         */

        /**
         * Whether to force the axis to end on a tick. Use this option with
         * the `maxPadding` option to control the axis end.
         *
         * @productdesc {highstock}
         * In Highstock, `endOnTick` is always false when the navigator is
         * enabled, to prevent jumpy scrolling.
         *
         * @sample {highcharts} highcharts/chart/reflow-true/
         *         True by default
         * @sample {highcharts} highcharts/yaxis/endontick/
         *         False
         * @sample {highstock} stock/demo/basic-line/
         *         True by default
         * @sample {highstock} stock/xaxis/endontick/
         *         False
         *
         * @type       {boolean}
         * @since      1.2.0
         * @apioption  xAxis.endOnTick
         */
        endOnTick: false,

        /**
         * Event handlers for the axis.
         *
         * @type       {*}
         * @apioption  xAxis.events
         */

        /**
         * An event fired after the breaks have rendered.
         *
         * @see [breaks](#xAxis.breaks)
         *
         * @sample {highcharts} highcharts/axisbreak/break-event/
         *         AfterBreak Event
         *
         * @type       {Function}
         * @since      4.1.0
         * @product    highcharts
         * @apioption  xAxis.events.afterBreaks
         */

        /**
         * As opposed to the `setExtremes` event, this event fires after the
         * final min and max values are computed and corrected for `minRange`.
         *
         *
         * Fires when the minimum and maximum is set for the axis, either by
         * calling the `.setExtremes()` method or by selecting an area in the
         * chart. One parameter, `event`, is passed to the function, containing
         * common event information.
         *
         * The new user set minimum and maximum values can be found by
         * `event.min` and `event.max`. These reflect the axis minimum and
         * maximum in axis values. The actual data extremes are found in
         * `event.dataMin` and `event.dataMax`.
         *
         * @type       {Function}
         * @since      2.3
         * @context    Axis
         * @apioption  xAxis.events.afterSetExtremes
         */

        /**
         * An event fired when a break from this axis occurs on a point.
         *
         * @see [breaks](#xAxis.breaks)
         *
         * @sample {highcharts} highcharts/axisbreak/break-visualized/
         *         Visualization of a Break
         *
         * @type       {Function}
         * @since      4.1.0
         * @product    highcharts
         * @context    Axis
         * @apioption  xAxis.events.pointBreak
         */

        /**
         * An event fired when a point falls inside a break from this axis.
         *
         * @type       {Function}
         * @product    highcharts highstock
         * @context    Axis
         * @apioption  xAxis.events.pointInBreak
         */

        /**
         * Fires when the minimum and maximum is set for the axis, either by
         * calling the `.setExtremes()` method or by selecting an area in the
         * chart. One parameter, `event`, is passed to the function,
         * containing common event information.
         *
         * The new user set minimum and maximum values can be found by
         * `event.min` and `event.max`. These reflect the axis minimum and
         * maximum in data values. When an axis is zoomed all the way out from
         * the "Reset zoom" button, `event.min` and `event.max` are null, and
         * the new extremes are set based on `this.dataMin` and `this.dataMax`.
         *
         * @sample {highstock} stock/xaxis/events-setextremes/
         *         Log new extremes on x axis
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Axis
         * @apioption  xAxis.events.setExtremes
         */

        /**
         * The lowest allowed value for automatically computed axis extremes.
         *
         * @see [ceiling](#yAxis.ceiling)
         *
         * @sample {highcharts} highcharts/yaxis/floor-ceiling/
         *         Floor and ceiling
         * @sample {highstock} stock/demo/lazy-loading/
         *         Prevent negative stock price on Y axis
         *
         * @type       {number}
         * @since      4.0
         * @product    highcharts highstock
         * @apioption  xAxis.floor
         */

        /**
         * The dash or dot style of the grid lines. For possible values, see
         * [this demonstration](https://jsfiddle.net/gh/get/library/pure/
         * highcharts/highcharts/tree/master/samples/highcharts/plotoptions/
         * series-dashstyle-all/).
         *
         * @sample {highcharts} highcharts/yaxis/gridlinedashstyle/
         *         Long dashes
         * @sample {highstock} stock/xaxis/gridlinedashstyle/
         *         Long dashes
         *
         * @type       {string}
         * @default    Solid
         * @since      1.2
         * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot",
         *              "ShortDashDotDot", "Dot", "Dash" ,"LongDash",
         *              "DashDot", "LongDashDot", "LongDashDotDot"]
         * @apioption  xAxis.gridLineDashStyle
         */

        /**
         * The Z index of the grid lines.
         *
         * @sample {highcharts|highstock} highcharts/xaxis/gridzindex/
         *         A Z index of 4 renders the grid above the graph
         *
         * @type       {number}
         * @default    1
         * @product    highcharts highstock
         * @apioption  xAxis.gridZIndex
         */

        /**
         * An id for the axis. This can be used after render time to get
         * a pointer to the axis object through `chart.get()`.
         *
         * @sample {highcharts} highcharts/xaxis/id/
         *         Get the object
         * @sample {highstock} stock/xaxis/id/
         *         Get the object
         *
         * @type       {string}
         * @since      1.2.0
         * @apioption  xAxis.id
         */

        /**
         * The axis labels show the number or category for each tick.
         *
         * @productdesc {highmaps}
         * X and Y axis labels are by default disabled in Highmaps, but the
         * functionality is inherited from Highcharts and used on `colorAxis`,
         * and can be enabled on X and Y axes too.
         *
         * @type       {*}
         * @apioption  xAxis.labels
         */
        labels: {
            /**
             * What part of the string the given position is anchored to.
             * If `left`, the left side of the string is at the axis position.
             * Can be one of `"left"`, `"center"` or `"right"`. Defaults to
             * an intelligent guess based on which side of the chart the axis
             * is on and the rotation of the label.
             *
             * @see [reserveSpace](#xAxis.labels.reserveSpace)
             *
             * @sample {highcharts} highcharts/xaxis/labels-align-left/
             *         Left
             * @sample {highcharts} highcharts/xaxis/labels-align-right/
             *         Right
             * @sample {highcharts} highcharts/xaxis/labels-reservespace-true/
             *         Left-aligned labels on a vertical category axis
             *
             * @type       {string}
             * @validvalue ["left", "center", "right"]
             * @apioption  xAxis.labels.align
             */

            /**
             * For horizontal axes, the allowed degrees of label rotation
             * to prevent overlapping labels. If there is enough space,
             * labels are not rotated. As the chart gets narrower, it
             * will start rotating the labels -45 degrees, then remove
             * every second label and try again with rotations 0 and -45 etc.
             * Set it to `false` to disable rotation, which will
             * cause the labels to word-wrap if possible.
             *
             * @sample {highcharts|highstock} highcharts/xaxis/labels-autorotation-default/
             *         Default auto rotation of 0 or -45
             * @sample {highcharts|highstock} highcharts/xaxis/labels-autorotation-0-90/
             *         Custom graded auto rotation
             *
             * @type       {Array<number>}
             * @default    [-45]
             * @since      4.1.0
             * @product    highcharts highstock
             * @apioption  xAxis.labels.autoRotation
             */

            /**
             * When each category width is more than this many pixels, we don't
             * apply auto rotation. Instead, we lay out the axis label with word
             * wrap. A lower limit makes sense when the label contains multiple
             * short words that don't extend the available horizontal space for
             * each label.
             *
             * @sample {highcharts} highcharts/xaxis/labels-autorotationlimit/
             *         Lower limit
             *
             * @type       {number}
             * @default    80
             * @since      4.1.5
             * @product    highcharts
             * @apioption  xAxis.labels.autoRotationLimit
             */

            /**
             * Polar charts only. The label's pixel distance from the perimeter
             * of the plot area.
             *
             * @type       {number}
             * @default    15
             * @product    highcharts
             * @apioption  xAxis.labels.distance
             */

            /**
             * Enable or disable the axis labels.
             *
             * @sample {highcharts} highcharts/xaxis/labels-enabled/
             *         X axis labels disabled
             * @sample {highstock} stock/xaxis/labels-enabled/
             *         X axis labels disabled
             *
             * @type       {boolean}
             * @default    {highcharts|highstock} true
             * @default    {highmaps} false
             * @apioption  xAxis.labels.enabled
             */
            enabled: true,

            /**
             * A [format string](https://www.highcharts.com/docs/chart-
             * concepts/labels-and-string-formatting) for the axis label.
             *
             * @sample {highcharts|highstock} highcharts/yaxis/labels-format/
             *         Add units to Y axis label
             *
             * @type       {string}
             * @default    {value}
             * @since      3.0
             * @apioption  xAxis.labels.format
             */

            /**
             * Callback JavaScript function to format the label. The value
             * is given by `this.value`. Additional properties for `this` are
             * `axis`, `chart`, `isFirst` and `isLast`. The value of the default
             * label formatter can be retrieved by calling
             * `this.axis.defaultLabelFormatter.call(this)` within the function.
             *
             * Defaults to:
             *
             * <pre>function() {
             *     return this.value;
             * }</pre>
             *
             * @sample {highcharts} highcharts/xaxis/labels-formatter-linked/
             *         Linked category names
             * @sample {highcharts} highcharts/xaxis/labels-formatter-extended/
             *         Modified numeric labels
             * @sample {highstock} stock/xaxis/labels-formatter/
             *         Added units on Y axis
             *
             * @type       {Function}
             * @apioption  xAxis.labels.formatter
             */

            /**
             * Horizontal axis only. When `staggerLines` is not set,
             * `maxStaggerLines` defines how many lines the axis is allowed to
             * add to automatically avoid overlapping X labels. Set to `1` to
             * disable overlap detection.
             *
             * @deprecated
             * @type       {number}
             * @default    5
             * @since      1.3.3
             * @product    highstock highmaps
             * @apioption  xAxis.labels.maxStaggerLines
             */

            /**
             * How to handle overflowing labels on horizontal axis. Can be
             * undefined, `false` or `"justify"`. By default it aligns inside
             * the chart area. If "justify", labels will not render outside
             * the plot area. If `false`, it will not be aligned at all.
             * If there is room to move it, it will be aligned to the edge,
             * else it will be removed.
             *
             * @deprecated
             * @type       {boolean|string}
             * @since      2.2.5
             * @validvalue ["justify", false]
             * @apioption  xAxis.labels.overflow
             */

            /**
             * The pixel padding for axis labels, to ensure white space between
             * them.
             *
             * @type       {number}
             * @default    5
             * @product    highcharts
             * @apioption  xAxis.labels.padding
             */

            /**
             * Whether to reserve space for the labels. By default, space is
             * reserved for the labels in these cases:
             *
             * * On all horizontal axes.
             * * On vertical axes if `label.align` is `right` on a left-side
             * axis or `left` on a right-side axis.
             * * On vertical axes if `label.align` is `center`.
             *
             * This can be turned off when for example the labels are rendered
             * inside the plot area instead of outside.
             *
             * @see [labels.align](#xAxis.labels.align)
             *
             * @sample {highcharts} highcharts/xaxis/labels-reservespace/
             *         No reserved space, labels inside plot
             * @sample {highcharts} highcharts/xaxis/labels-reservespace-true/
             *         Left-aligned labels on a vertical category axis
             *
             * @type       {boolean}
             * @since      4.1.10
             * @product    highcharts
             * @apioption  xAxis.labels.reserveSpace
             */

            /**
             * Rotation of the labels in degrees.
             *
             * @sample {highcharts} highcharts/xaxis/labels-rotation/
             *         X axis labels rotated 90°
             *
             * @type       {number}
             * @default    0
             * @apioption  xAxis.labels.rotation
             */

            /**
             * Horizontal axes only. The number of lines to spread the labels
             * over to make room or tighter labels.
             *
             * @sample {highcharts} highcharts/xaxis/labels-staggerlines/
             *         Show labels over two lines
             * @sample {highstock} stock/xaxis/labels-staggerlines/
             *         Show labels over two lines
             *
             * @type       {number}
             * @since      2.1
             * @apioption  xAxis.labels.staggerLines
             */

            /**
             * To show only every _n_'th label on the axis, set the step to _n_.
             * Setting the step to 2 shows every other label.
             *
             * By default, the step is calculated automatically to avoid
             * overlap. To prevent this, set it to 1\. This usually only
             * happens on a category axis, and is often a sign that you have
             * chosen the wrong axis type.
             *
             * Read more at
             * [Axis docs](https://www.highcharts.com/docs/chart-concepts/axes)
             * => What axis should I use?
             *
             * @sample {highcharts} highcharts/xaxis/labels-step/
             *         Showing only every other axis label on a categorized
             *         x-axis
             * @sample {highcharts} highcharts/xaxis/labels-step-auto/
             *         Auto steps on a category axis
             *
             * @type       {number}
             * @since      2.1
             * @apioption  xAxis.labels.step
             */

            /**
             * Whether to [use HTML](https://www.highcharts.com/docs/chart-
             * concepts/labels-and-string-formatting#html) to render the labels.
             *
             * @type       {boolean}
             * @default    false
             * @apioption  xAxis.labels.useHTML
             */

            /**
             * The x position offset of the label relative to the tick position
             * on the axis.
             *
             * @sample {highcharts} highcharts/xaxis/labels-x/
             *         Y axis labels placed on grid lines
             *
             * @type       {number}
             * @default    0
             * @apioption  xAxis.labels.x
             */
            x: 0,

            /**
             * The y position offset of the label relative to the tick position
             * on the axis. The default makes it adapt to the font size on
             * bottom axis.
             *
             * @sample {highcharts} highcharts/xaxis/labels-x/
             *         Y axis labels placed on grid lines
             *
             * @type       {number}
             * @apioption  xAxis.labels.y
             */

            /**
             * The Z index for the axis labels.
             *
             * @type       {number}
             * @default    7
             * @apioption  xAxis.labels.zIndex
             */

            /*= if (build.classic) { =*/

            /**
             * CSS styles for the label. Use `whiteSpace: 'nowrap'` to prevent
             * wrapping of category labels. Use `textOverflow: 'none'` to
             * prevent ellipsis (dots).
             *
             * In styled mode, the labels are styled with the
             * `.highcharts-axis-labels` class.
             *
             * @sample {highcharts} highcharts/xaxis/labels-style/
             *         Red X axis labels
             *
             * @type       {Highcharts.CSSObject}
             * @apioption  xAxis.labels.style
             */
            style: {
                color: '${palette.neutralColor60}',
                cursor: 'default',
                fontSize: '11px'
            }

            /*= } =*/
        },

        /**
         * Index of another axis that this axis is linked to. When an axis is
         * linked to a master axis, it will take the same extremes as
         * the master, but as assigned by min or max or by setExtremes.
         * It can be used to show additional info, or to ease reading the
         * chart by duplicating the scales.
         *
         * @sample {highcharts} highcharts/xaxis/linkedto/
         *         Different string formats of the same date
         * @sample {highcharts} highcharts/yaxis/linkedto/
         *         Y values on both sides
         *
         * @type       {number}
         * @since      2.0.2
         * @product    highcharts highstock
         * @apioption  xAxis.linkedTo
         */

        /**
         * The maximum value of the axis. If `null`, the max value is
         * automatically calculated.
         *
         * If the [endOnTick](#yAxis.endOnTick) option is true, the `max` value
         * might be rounded up.
         *
         * If a [tickAmount](#yAxis.tickAmount) is set, the axis may be extended
         * beyond the set max in order to reach the given number of ticks. The
         * same may happen in a chart with multiple axes, determined by [chart.
         * alignTicks](#chart), where a `tickAmount` is applied internally.
         *
         * @sample {highcharts} highcharts/yaxis/max-200/
         *         Y axis max of 200
         * @sample {highcharts} highcharts/yaxis/max-logarithmic/
         *         Y axis max on logarithmic axis
         * @sample {highstock} stock/xaxis/min-max/
         *         Fixed min and max on X axis
         * @sample {highmaps} maps/axis/min-max/
         *         Pre-zoomed to a specific area
         *
         * @type       {number}
         * @apioption  xAxis.max
         */

        /**
         * Padding of the max value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer. This is useful
         * when you don't want the highest data value to appear on the edge
         * of the plot area. When the axis' `max` option is set or a max extreme
         * is set using `axis.setExtremes()`, the maxPadding will be ignored.
         *
         * @sample {highcharts} highcharts/yaxis/maxpadding/
         *         Max padding of 0.25 on y axis
         * @sample {highstock} stock/xaxis/minpadding-maxpadding/
         *         Greater min- and maxPadding
         * @sample {highmaps} maps/chart/plotbackgroundcolor-gradient/
         *         Add some padding
         *
         * @type       {number}
         * @default    {highcharts} 0.01
         * @default    {highstock|highmaps} 0
         * @since      1.2.0
         * @apioption  xAxis.maxPadding
         */
        maxPadding: 0.01,

        /**
         * Deprecated. Use `minRange` instead.
         *
         * @deprecated
         * @type       {number}
         * @product    highcharts highstock
         * @apioption  xAxis.maxZoom
         */

        /**
         * The minimum value of the axis. If `null` the min value is
         * automatically calculated.
         *
         * If the [startOnTick](#yAxis.startOnTick) option is true (default),
         * the `min` value might be rounded down.
         *
         * The automatically calculated minimum value is also affected by
         * [floor](#yAxis.floor), [softMin](#yAxis.softMin),
         * [minPadding](#yAxis.minPadding), [minRange](#yAxis.minRange)
         * as well as [series.threshold](#plotOptions.series.threshold)
         * and [series.softThreshold](#plotOptions.series.softThreshold).
         *
         * @sample {highcharts} highcharts/yaxis/min-startontick-false/
         *         -50 with startOnTick to false
         * @sample {highcharts} highcharts/yaxis/min-startontick-true/
         *         -50 with startOnTick true by default
         * @sample {highstock} stock/xaxis/min-max/
         *         Set min and max on X axis
         * @sample {highmaps} maps/axis/min-max/
         *         Pre-zoomed to a specific area
         *
         * @type       {number}
         * @apioption  xAxis.min
         */

        /**
         * The dash or dot style of the minor grid lines. For possible values,
         * see [this demonstration](https://jsfiddle.net/gh/get/library/pure/
         * highcharts/highcharts/tree/master/samples/highcharts/plotoptions/
         * series-dashstyle-all/).
         *
         * @sample {highcharts} highcharts/yaxis/minorgridlinedashstyle/
         *         Long dashes on minor grid lines
         * @sample {highstock} stock/xaxis/minorgridlinedashstyle/
         *         Long dashes on minor grid lines
         *
         * @type       {string}
         * @default    Solid
         * @since      1.2
         * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot",
         *              "ShortDashDotDot", "Dot", "Dash" ,"LongDash",
         *              "DashDot", "LongDashDot", "LongDashDotDot"]
         * @apioption  xAxis.minorGridLineDashStyle
         */

        /**
         * Specific tick interval in axis units for the minor ticks. On a linear
         * axis, if `"auto"`, the minor tick interval is calculated as a fifth
         * of the tickInterval. If `null` or `undefined`, minor ticks are not
         * shown.
         *
         * On logarithmic axes, the unit is the power of the value. For example,
         * setting the minorTickInterval to 1 puts one tick on each of 0.1, 1,
         * 10, 100 etc. Setting the minorTickInterval to 0.1 produces 9 ticks
         * between 1 and 10, 10 and 100 etc.
         *
         * If user settings dictate minor ticks to become too dense, they don't
         * make sense, and will be ignored to prevent performance problems.
         *
         * @sample {highcharts} highcharts/yaxis/minortickinterval-null/
         *         Null by default
         * @sample {highcharts} highcharts/yaxis/minortickinterval-5/
         *         5 units
         * @sample {highcharts} highcharts/yaxis/minortickinterval-log-auto/
         *         "auto"
         * @sample {highcharts} highcharts/yaxis/minortickinterval-log/
         *         0.1
         * @sample {highstock} stock/demo/basic-line/
         *         Null by default
         * @sample {highstock} stock/xaxis/minortickinterval-auto/
         *         "auto"
         *
         * @type       {number|string|null}
         * @apioption  xAxis.minorTickInterval
         */

        /**
         * The pixel length of the minor tick marks.
         *
         * @sample {highcharts} highcharts/yaxis/minorticklength/
         *         10px on Y axis
         * @sample {highstock} stock/xaxis/minorticks/
         *         10px on Y axis
         *
         * @type       {number}
         * @apioption  xAxis.minorTickPosition
         */
        minorTickLength: 2,

        /**
         * The position of the minor tick marks relative to the axis line.
         *  Can be one of `inside` and `outside`.
         *
         * @sample {highcharts} highcharts/yaxis/minortickposition-outside/
         *         Outside by default
         * @sample {highcharts} highcharts/yaxis/minortickposition-inside/
         *         Inside
         * @sample {highstock} stock/xaxis/minorticks/
         *         Inside
         *
         * @type       {string}
         * @validvalue ["inside", "outside"]
         * @apioption  xAxis.minorTickPosition
         */
        minorTickPosition: 'outside',

        /**
         * Enable or disable minor ticks. Unless
         * [minorTickInterval](#xAxis.minorTickInterval) is set, the tick
         * interval is calculated as a fifth of the `tickInterval`.
         *
         * On a logarithmic axis, minor ticks are laid out based on a best
         * guess, attempting to enter approximately 5 minor ticks between
         * each major tick.
         *
         * Prior to v6.0.0, ticks were unabled in auto layout by setting
         * `minorTickInterval` to `"auto"`.
         *
         * @productdesc {highcharts}
         * On axes using [categories](#xAxis.categories), minor ticks are not
         * supported.
         *
         * @sample {highcharts} highcharts/yaxis/minorticks-true/
         *         Enabled on linear Y axis
         *
         * @type       {boolean}
         * @default    false
         * @since      6.0.0
         * @apioption  xAxis.minorTicks
         */

        /**
         * The pixel width of the minor tick mark.
         *
         * @sample {highcharts} highcharts/yaxis/minortickwidth/
         *         3px width
         * @sample {highstock} stock/xaxis/minorticks/
         *         1px width
         *
         * @type       {number}
         * @default    0
         * @apioption  xAxis.minorTickWidth
         */

        /**
         * Padding of the min value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer. This is useful
         * when you don't want the lowest data value to appear on the edge
         * of the plot area. When the axis' `min` option is set or a min extreme
         * is set using `axis.setExtremes()`, the minPadding will be ignored.
         *
         * @sample {highcharts} highcharts/yaxis/minpadding/
         *         Min padding of 0.2
         * @sample {highstock} stock/xaxis/minpadding-maxpadding/
         *         Greater min- and maxPadding
         * @sample {highmaps} maps/chart/plotbackgroundcolor-gradient/
         *         Add some padding
         *
         * @type       {number}
         * @default    {highcharts} 0.01
         * @default    {highstock|highmaps} 0
         * @since      1.2.0
         * @product    highcharts highstock
         * @apioption  xAxis.minPadding
         */
        minPadding: 0.01,

        /**
         * The minimum range to display on this axis. The entire axis will not
         * be allowed to span over a smaller interval than this. For example,
         * for a datetime axis the main unit is milliseconds. If minRange is
         * set to 3600000, you can't zoom in more than to one hour.
         *
         * The default minRange for the x axis is five times the smallest
         * interval between any of the data points.
         *
         * On a logarithmic axis, the unit for the minimum range is the power.
         * So a minRange of 1 means that the axis can be zoomed to 10-100,
         * 100-1000, 1000-10000 etc.
         *
         * Note that the `minPadding`, `maxPadding`, `startOnTick` and
         * `endOnTick` settings also affect how the extremes of the axis
         * are computed.
         *
         * @sample {highcharts} highcharts/xaxis/minrange/
         *         Minimum range of 5
         * @sample {highstock} stock/xaxis/minrange/
         *         Max zoom of 6 months overrides user selections
         * @sample {highmaps} maps/axis/minrange/
         *         Minimum range of 1000
         *
         * @type       {number}
         * @apioption  xAxis.minRange
         */

        /**
         * The minimum tick interval allowed in axis values. For example on
         * zooming in on an axis with daily data, this can be used to prevent
         * the axis from showing hours. Defaults to the closest distance between
         * two points on the axis.
         *
         * @type       {number}
         * @since      2.3.0
         * @apioption  xAxis.minTickInterval
         */

        /**
         * The distance in pixels from the plot area to the axis line.
         * A positive offset moves the axis with it's line, labels and ticks
         * away from the plot area. This is typically used when two or more
         * axes are displayed on the same side of the plot. With multiple
         * axes the offset is dynamically adjusted to avoid collision, this
         * can be overridden by setting offset explicitly.
         *
         * @sample    {highcharts} highcharts/yaxis/offset/
         *            Y axis offset of 70
         * @sample    {highcharts} highcharts/yaxis/offset-centered/
         *            Axes positioned in the center of the plot
         * @sample    {highstock} stock/xaxis/offset/
         *            Y axis offset by 70 px
         *
         * @type       {number}
         * @default    0
         * @apioption  xAxis.offset
         */

        /**
         * Whether to display the axis on the opposite side of the normal. The
         * normal is on the left side for vertical axes and bottom for
         * horizontal, so the opposite sides will be right and top respectively.
         * This is typically used with dual or multiple axes.
         *
         * @sample {highcharts} highcharts/yaxis/opposite/
         *         Secondary Y axis opposite
         * @sample {highstock} stock/xaxis/opposite/
         *         Y axis on left side
         *
         * @type       {boolean}
         * @default    false
         * @apioption  xAxis.opposite
         */

        /**
         * In an ordinal axis, the points are equally spaced in the chart
         * regardless of the actual time or x distance between them. This means
         * that missing data periods (e.g. nights or weekends for a stock chart)
         * will not take up space in the chart.
         * Having `ordinal: false` will show any gaps created by the `gapSize`
         * setting proportionate to their duration.
         *
         * In stock charts the X axis is ordinal by default, unless
         * the boost module is used and at least one of the series' data length
         * exceeds the [boostThreshold](#series.line.boostThreshold).
         *
         * @sample {highstock} stock/xaxis/ordinal-true/
         *         True by default
         * @sample {highstock} stock/xaxis/ordinal-false/
         *         False
         *
         * @type       {boolean}
         * @default    true
         * @since      1.1
         * @product    highstock
         * @apioption  xAxis.ordinal
         */

        /**
         * Additional range on the right side of the xAxis. Works similar to
         * `xAxis.maxPadding`, but value is set in milliseconds. Can be set for
         * both main `xAxis` and the navigator's `xAxis`.
         *
         * @sample {highstock} stock/xaxis/overscroll/
         *         One minute overscroll with live data
         *
         * @type       {number}
         * @default    0
         * @since      6.0.0
         * @product    highstock
         * @apioption  xAxis.overscroll
         */

        /**
         * Refers to the index in the [panes](#panes) array. Used for circular
         * gauges and polar charts. When the option is not set then first pane
         * will be used.
         *
         * @sample highcharts/demo/gauge-vu-meter
         *         Two gauges with different center
         *
         * @type       {number}
         * @product    highcharts
         * @apioption  xAxis.pane
         */

        /**
         * An array of colored bands stretching across the plot area marking
         * an interval on the axis.
         *
         * In styled mode, the plot bands are styled by the
         * `.highcharts-plot-band` class in addition to the `className` option.
         *
         * @productdesc {highcharts}
         * In a gauge, a plot band on the Y axis (value axis) will stretch along
         * the perimeter of the gauge.
         *
         * @type       {Array<*>}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands
         */

        /**
         * Border color for the plot band. Also requires `borderWidth` to be
         * set.
         *
         * @type       {Highcharts.ColorString}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.borderColor
         */

        /**
         * Border width for the plot band. Also requires `borderColor` to be
         * set.
         *
         * @type       {number}
         * @default    0
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.borderWidth
         */

        /**
         * A custom class name, in addition to the default
         * `highcharts-plot-band`, to apply to each individual band.
         *
         * @type       {string}
         * @since      5.0.0
         * @apioption  xAxis.plotBands.className
         */

        /**
         * The color of the plot band.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-color/
         *         Color band
         * @sample {highstock} stock/xaxis/plotbands/
         *         Plot band on Y axis
         *
         * @type       {Highcharts.ColorString}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.color
         */

        /**
         * An object defining mouse events for the plot band. Supported
         * properties are `click`, `mouseover`, `mouseout`, `mousemove`.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-events/
         *         Mouse events demonstrated
         *
         * @type       {*}
         * @since      1.2
         * @product    highcharts highstock
         * @context    PlotLineOrBand
         * @apioption  xAxis.plotBands.events
         */

        /**
         * The start position of the plot band in axis units.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-color/
         *         Datetime axis
         * @sample {highcharts} highcharts/xaxis/plotbands-from/
         *         Categorized axis
         * @sample {highstock} stock/xaxis/plotbands/
         *         Plot band on Y axis
         *
         * @type       {number}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.from
         */

        /**
         * An id used for identifying the plot band in Axis.removePlotBand.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-id/
         *         Remove plot band by id
         * @sample {highstock} highcharts/xaxis/plotbands-id/
         *         Remove plot band by id
         *
         * @type       {string}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.id
         */

        /**
         * The end position of the plot band in axis units.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-color/
         *         Datetime axis
         * @sample {highcharts} highcharts/xaxis/plotbands-from/
         *         Categorized axis
         * @sample {highstock} stock/xaxis/plotbands/
         *         Plot band on Y axis
         *
         * @type       {number}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.to
         */

        /**
         * The z index of the plot band within the chart, relative to other
         * elements. Using the same z index as another element may give
         * unpredictable results, as the last rendered element will be on top.
         * Values from 0 to 20 make sense.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-color/
         *         Behind plot lines by default
         * @sample {highcharts} highcharts/xaxis/plotbands-zindex/
         *         Above plot lines
         * @sample {highcharts} highcharts/xaxis/plotbands-zindex-above-series/
         *         Above plot lines and series
         *
         * @type       {number}
         * @since      1.2
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.zIndex
         */

        /**
         * Text labels for the plot bands
         *
         * @type       {*}
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label
         */

        /**
         * Horizontal alignment of the label. Can be one of "left", "center"
         * or "right".
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-align/
         *         Aligned to the right
         * @sample {highstock} stock/xaxis/plotbands-label/
         *         Plot band with labels
         *
         * @type       {string}
         * @default    center
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label.align
         */

        /**
         * Rotation of the text label in degrees .
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/
         *         Vertical text
         *
         * @type       {number}
         * @default    0
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label.rotation
         */

        /**
         * CSS styles for the text label.
         *
         * In styled mode, the labels are styled by the
         * `.highcharts-plot-band-label` class.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-style/
         *         Blue and bold label
         *
         * @type       {Highcharts.CSSObject}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label.style
         */

        /**
         * The string text itself. A subset of HTML is supported.
         *
         * @type       {string}
         * @since      2.1
         * @product    highcharts
         * @apioption  xAxis.plotBands.label.text
         */

        /**
         * The text alignment for the label. While `align` determines where
         * the texts anchor point is placed within the plot band, `textAlign`
         * determines how the text is aligned against its anchor point. Possible
         * values are "left", "center" and "right". Defaults to the same as
         * the `align` option.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/
         *         Vertical text in center position but text-aligned left
         *
         * @type       {string}
         * @since      2.1
         * @product    highcharts highstock
         * @validvalue ["center", "left", "right"]
         * @apioption  xAxis.plotBands.label.textAlign
         */

        /**
         * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-
         * and-string-formatting#html) to render the labels.
         *
         * @type       {boolean}
         * @default    false
         * @since      3.0.3
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label.useHTML
         */

        /**
         * Vertical alignment of the label relative to the plot band. Can be
         * one of "top", "middle" or "bottom".
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-verticalalign/
         *         Vertically centered label
         * @sample {highstock} stock/xaxis/plotbands-label/
         *         Plot band with labels
         *
         * @type       {string}
         * @default    top
         * @since      2.1
         * @product    highcharts highstock
         * @validvalue ["bottom", "middle",  "top"]
         * @apioption  xAxis.plotBands.label.verticalAlign
         */

        /**
         * Horizontal position relative the alignment. Default varies by
         * orientation.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-align/
         *         Aligned 10px from the right edge
         * @sample {highstock} stock/xaxis/plotbands-label/
         *         Plot band with labels
         *
         * @type       {number}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label.x
         */

        /**
         * Vertical position of the text baseline relative to the alignment.
         *  Default varies by orientation.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-label-y/
         *         Label on x axis
         * @sample {highstock} stock/xaxis/plotbands-label/
         *         Plot band with labels
         *
         * @type      {number}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotBands.label.y
         */

        /**
         * An array of lines stretching across the plot area, marking a specific
         * value on one of the axes.
         *
         * In styled mode, the plot lines are styled by the
         * `.highcharts-plot-line` class in addition to the `className` option.
         *
         * @type       {Array<*>}
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines
         */

        /**
         * A custom class name, in addition to the default
         * `highcharts-plot-line`, to apply to each individual line.
         *
         * @type       {string}
         * @since      5.0.0
         * @apioption  xAxis.plotLines.className
         */

        /**
         * The color of the line.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-color/
         *         A red line from X axis
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {Highcharts.ColorString}
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.color
         */

        /**
         * The dashing or dot style for the plot line. For possible values see
         * [this overview](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
         * dashstyle-all/).
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-dashstyle/
         *         Dash and dot pattern
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {string}
         * @default    Solid
         * @since      1.2
         * @product    highcharts highstock
         * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
         * @apioption  xAxis.plotLines.dashStyle
         */

        /**
         * An object defining mouse events for the plot line. Supported
         * properties are `click`, `mouseover`, `mouseout`, `mousemove`.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-events/
         *         Mouse events demonstrated
         *
         * @type       {*}
         * @since      1.2
         * @product    highcharts highstock
         * @context    PlotLineOrBand
         * @apioption  xAxis.plotLines.events
         */

        /**
         * An id used for identifying the plot line in Axis.removePlotLine.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-id/
         *         Remove plot line by id
         *
         * @type       {string}
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.id
         */

        /**
         * The position of the line in axis units.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-color/
         *         Between two categories on X axis
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {number}
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.value
         */

        /**
         * The width or thickness of the plot line.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-color/
         *         2px wide line from X axis
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {number}
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.width
         */

        /**
         * The z index of the plot line within the chart.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-zindex-behind/
         *         Behind plot lines by default
         * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above/
         *         Above plot lines
         * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above-all/
         *         Above plot lines and series
         *
         * @type       {number}
         * @since      1.2
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.zIndex
         */

        /**
         * Text labels for the plot bands
         *
         * @type       {*}
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label
         */

        /**
         * Horizontal alignment of the label. Can be one of "left", "center"
         * or "right".
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/
         *         Aligned to the right
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {string}
         * @default    left
         * @since      2.1
         * @product    highcharts highstock
         * @validvalue ["center", "left", "right"]
         * @apioption  xAxis.plotLines.label.align
         */

        /**
         * Rotation of the text label in degrees. Defaults to 0 for horizontal
         * plot lines and 90 for vertical lines.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/
         *         Slanted text
         *
         * @type       {number}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label.rotation
         */

        /**
         * CSS styles for the text label.
         *
         * In styled mode, the labels are styled by the
         * `.highcharts-plot-line-label` class.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-style/
         *         Blue and bold label
         *
         * @type       {Highcharts.CSSObject}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label.style
         */

        /**
         * The text itself. A subset of HTML is supported.
         *
         * @type       {string}
         * @since      2.1
         * @product    highcharts
         * @apioption  xAxis.plotLines.label.text
         */

        /**
         * The text alignment for the label. While `align` determines where
         * the texts anchor point is placed within the plot band, `textAlign`
         * determines how the text is aligned against its anchor point. Possible
         * values are "left", "center" and "right". Defaults to the same as
         * the `align` option.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-textalign/
         *         Text label in bottom position
         *
         * @type       {string}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label.textAlign
         */

        /**
         * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-
         * and-string-formatting#html) to render the labels.
         *
         * @type       {boolean}
         * @default    false
         * @since      3.0.3
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label.useHTML
         */

        /**
         * Vertical alignment of the label relative to the plot line. Can be
         * one of "top", "middle" or "bottom".
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/
         *         Vertically centered label
         *
         * @type       {string}
         * @default    {highcharts} top
         * @default    {highstock} top
         * @since      2.1
         * @product    highcharts highstock
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  xAxis.plotLines.label.verticalAlign
         */

        /**
         * Horizontal position relative the alignment. Default varies by
         * orientation.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/
         *         Aligned 10px from the right edge
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {number}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label.x
         */

        /**
         * Vertical position of the text baseline relative to the alignment.
         *  Default varies by orientation.
         *
         * @sample {highcharts} highcharts/xaxis/plotlines-label-y/
         *         Label below the plot line
         * @sample {highstock} stock/xaxis/plotlines/
         *         Plot line on Y axis
         *
         * @type       {number}
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  xAxis.plotLines.label.y
         */

        /**
         * The zoomed range to display when only defining one or none of `min`
         * or `max`. For example, to show the latest month, a range of one month
         * can be set.
         *
         * @sample {highstock} stock/xaxis/range/
         *         Setting a zoomed range when the rangeSelector is disabled
         *
         * @type       {number}
         * @product    highstock
         * @apioption  xAxis.range
         */

        /**
         * Whether to reverse the axis so that the highest number is closest
         * to the origin. If the chart is inverted, the x axis is reversed by
         * default.
         *
         * @sample {highcharts} highcharts/yaxis/reversed/
         *         Reversed Y axis
         * @sample {highstock} stock/xaxis/reversed/
         *         Reversed Y axis
         *
         * @type       {boolean}
         * @default    false
         * @apioption  xAxis.reversed
         */
        // reversed: false,

        /**
         * This option determines how stacks should be ordered within a group.
         * For example reversed xAxis also reverses stacks, so first series
         * comes last in a group. To keep order like for non-reversed xAxis
         * enable this option.
         *
         * @sample {highcharts} highcharts/xaxis/reversedstacks/
         *         Reversed stacks comparison
         * @sample {highstock} highcharts/xaxis/reversedstacks/
         *         Reversed stacks comparison
         *
         * @type       {boolean}
         * @default    false
         * @since      6.1.1
         * @product    highcharts highstock
         * @apioption  xAxis.reversedStacks
         */

        /**
         * An optional scrollbar to display on the X axis in response to
         * limiting the minimum and maximum of the axis values.
         *
         * In styled mode, all the presentational options for the scrollbar
         * are replaced by the classes `.highcharts-scrollbar-thumb`,
         * `.highcharts-scrollbar-arrow`, `.highcharts-scrollbar-button`,
         * `.highcharts-scrollbar-rifles` and `.highcharts-scrollbar-track`.
         *
         * @sample {highstock} stock/yaxis/heatmap-scrollbars/
         *         Heatmap with both scrollbars
         *
         * @type       {*}
         * @extends    scrollbar
         * @since      4.2.6
         * @product    highstock
         * @apioption  xAxis.scrollbar
         */

        /**
         * Whether to show the axis line and title when the axis has no data.
         *
         * @sample {highcharts} highcharts/yaxis/showempty/
         *         When clicking the legend to hide series, one axis preserves
         *         line and title, the other doesn't
         * @sample {highstock} highcharts/yaxis/showempty/
         *         When clicking the legend to hide series, one axis preserves
         *         line and title, the other doesn't
         *
         * @type       {boolean}
         * @default    true
         * @since      1.1
         * @apioption  xAxis.showEmpty
         */

        /**
         * Whether to show the first tick label.
         *
         * @sample {highcharts} highcharts/xaxis/showfirstlabel-false/
         *         Set to false on X axis
         * @sample {highstock} stock/xaxis/showfirstlabel/
         *         Labels below plot lines on Y axis
         *
         * @type       {boolean}
         * @default    true
         * @apioption  xAxis.showFirstLabel
         */

        /**
         * Whether to show the last tick label. Defaults to `true` on cartesian
         * charts, and `false` on polar charts.
         *
         * @sample {highcharts} highcharts/xaxis/showlastlabel-true/
         *         Set to true on X axis
         * @sample {highstock} stock/xaxis/showfirstlabel/
         *         Labels below plot lines on Y axis
         *
         * @type       {boolean}
         * @default    true
         * @product    highcharts highstock
         * @apioption  xAxis.showLastLabel
         */

        /**
         * A soft maximum for the axis. If the series data maximum is less than
         * this, the axis will stay at this maximum, but if the series data
         * maximum is higher, the axis will flex to show all data.
         *
         * @sample highcharts/yaxis/softmin-softmax/
         *         Soft min and max
         *
         * @type       {number}
         * @since      5.0.1
         * @product    highcharts highstock
         * @apioption  xAxis.softMax
         */

        /**
         * A soft minimum for the axis. If the series data minimum is greater
         * than this, the axis will stay at this minimum, but if the series
         * data minimum is lower, the axis will flex to show all data.
         *
         * @sample highcharts/yaxis/softmin-softmax/
         *         Soft min and max
         *
         * @type       {number}
         * @since      5.0.1
         * @product    highcharts highstock
         * @apioption  xAxis.softMin
         */

        /**
         * For datetime axes, this decides where to put the tick between weeks.
         *  0 = Sunday, 1 = Monday.
         *
         * @sample {highcharts} highcharts/xaxis/startofweek-monday/
         *         Monday by default
         * @sample {highcharts} highcharts/xaxis/startofweek-sunday/
         *         Sunday
         * @sample {highstock} stock/xaxis/startofweek-1
         *         Monday by default
         * @sample {highstock} stock/xaxis/startofweek-0
         *         Sunday
         *
         * @type       {number}
         * @default    1
         * @product    highcharts highstock
         * @apioption  xAxis.startOfWeek
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
         * @sample {highcharts} highcharts/xaxis/startontick-false/
         *         False by default
         * @sample {highcharts} highcharts/xaxis/startontick-true/
         *         True
         * @sample {highstock} stock/xaxis/endontick/
         *         False for Y axis
         *
         * @type       {boolean}
         * @since      1.2.0
         * @apioption  xAxis.startOnTick
         */
        startOnTick: false,


        /**
         * The amount of ticks to draw on the axis. This opens up for aligning
         * the ticks of multiple charts or panes within a chart. This option
         * overrides the `tickPixelInterval` option.
         *
         * This option only has an effect on linear axes. Datetime, logarithmic
         * or category axes are not affected.
         *
         * @sample {highcharts} highcharts/yaxis/tickamount/
         *         8 ticks on Y axis
         * @sample {highstock} highcharts/yaxis/tickamount/
         *         8 ticks on Y axis
         *
         * @type       {number}
         * @since      4.1.0
         * @product    highcharts highstock
         * @apioption  xAxis.tickAmount
         */

        /**
         * The interval of the tick marks in axis units. When `undefined`, the
         * tick interval is computed to approximately follow the
         * [tickPixelInterval](#xAxis.tickPixelInterval) on linear and datetime
         * axes. On categorized axes, a `undefined` tickInterval will default to
         * 1, one category. Note that datetime axes are based on milliseconds,
         * so for example an interval of one day is expressed as
         * `24 * 3600 * 1000`.
         *
         * On logarithmic axes, the tickInterval is based on powers, so a
         * tickInterval of 1 means one tick on each of 0.1, 1, 10, 100 etc. A
         * tickInterval of 2 means a tick of 0.1, 10, 1000 etc. A tickInterval
         * of 0.2 puts a tick on 0.1, 0.2, 0.4, 0.6, 0.8, 1, 2, 4, 6, 8, 10, 20,
         * 40 etc.
         *
         *
         * If the tickInterval is too dense for labels to be drawn, Highcharts
         * may remove ticks.
         *
         * If the chart has multiple axes, the [alignTicks](#chart.alignTicks)
         * option may interfere with the `tickInterval` setting.
         *
         * @see    [tickPixelInterval](#xAxis.tickPixelInterval),
         *         [tickPositions](#xAxis.tickPositions),
         *         [tickPositioner](#xAxis.tickPositioner)
         *
         * @sample {highcharts} highcharts/xaxis/tickinterval-5/
         *         Tick interval of 5 on a linear axis
         * @sample {highstock} stock/xaxis/tickinterval/
         *         Tick interval of 0.01 on Y axis
         *
         * @type       {number}
         * @apioption  xAxis.tickInterval
         */

        /**
         * The pixel length of the main tick marks.
         *
         * @sample {highcharts} highcharts/xaxis/ticklength/
         *         20 px tick length on the X axis
         * @sample {highstock} stock/xaxis/ticks/
         *         Formatted ticks on X axis
         */
        tickLength: 10,

        /**
         * If tickInterval is `null` this option sets the approximate pixel
         * interval of the tick marks. Not applicable to categorized axis.
         *
         * The tick interval is also influenced by the [minTickInterval](
         * #xAxis.minTickInterval) option, that, by default prevents ticks from
         * being denser than the data points.
         *
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
         * For categorized axes only. If `on` the tick mark is placed in the
         * center of the category, if `between` the tick mark is placed between
         * categories. The default is `between` if the `tickInterval` is 1,
         *  else `on`.
         *
         * @validvalue [null, "on", "between"]
         * @sample     {highcharts} highcharts/xaxis/tickmarkplacement-between/
         *             "between" by default
         * @sample     {highcharts} highcharts/xaxis/tickmarkplacement-on/
         *             "on"
         * @product    highcharts
         * @apioption  xAxis.tickmarkPlacement
         */
        tickmarkPlacement: 'between',

        /**
         * The position of the major tick marks relative to the axis line.
         * Can be one of `inside` and `outside`.
         *
         * @sample {highcharts} highcharts/xaxis/tickposition-outside/
         *         "outside" by default
         * @sample {highcharts} highcharts/xaxis/tickposition-inside/
         *         "inside"
         * @sample {highstock} stock/xaxis/ticks/
         *         Formatted ticks on X axis
         *
         * @type       {string}
         * @validvalue ["inside", "outside"]
         * @apioption  xAxis.tickPosition
         */
        tickPosition: 'outside',

        /**
         * A callback function returning array defining where the ticks are
         * laid out on the axis. This overrides the default behaviour of
         * [tickPixelInterval](#xAxis.tickPixelInterval) and [tickInterval](
         * #xAxis.tickInterval). The automatic tick positions are accessible
         * through `this.tickPositions` and can be modified by the callback.
         *
         * @see [tickPositions](#xAxis.tickPositions)
         *
         * @sample {highcharts} highcharts/xaxis/tickpositions-tickpositioner/
         *         Demo of tickPositions and tickPositioner
         * @sample {highstock} highcharts/xaxis/tickpositions-tickpositioner/
         *         Demo of tickPositions and tickPositioner
         *
         * @type       {Function}
         * @apioption  xAxis.tickPositioner
         */

        /**
         * An array defining where the ticks are laid out on the axis. This
         * overrides the default behaviour of [tickPixelInterval](
         * #xAxis.tickPixelInterval) and [tickInterval](#xAxis.tickInterval).
         *
         * @see [tickPositioner](#xAxis.tickPositioner)
         *
         * @sample {highcharts} highcharts/xaxis/tickpositions-tickpositioner/
         *         Demo of tickPositions and tickPositioner
         * @sample {highstock} highcharts/xaxis/tickpositions-tickpositioner/
         *         Demo of tickPositions and tickPositioner
         *
         * @type       {Array<number>}
         * @apioption  xAxis.tickPositions
         */

        /**
         * The pixel width of the major tick marks.
         *
         * In styled mode, the stroke width is given in the `.highcharts-tick`
         * class.
         *
         * @sample {highcharts} highcharts/xaxis/tickwidth/
         *         10 px width
         * @sample {highcharts} highcharts/css/axis-grid/
         *         Styled mode
         * @sample {highstock} stock/xaxis/ticks/
         *         Formatted ticks on X axis
         * @sample {highstock} highcharts/css/axis-grid/
         *         Styled mode
         *
         * @type       {number}
         * @default    {highcharts} 1
         * @default    {highstock} 1
         * @default    {highmaps} 0
         * @apioption  xAxis.tickWidth
         */

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
             * Deprecated. Set the `text` to `null` to disable the title.
             *
             * @deprecated
             * @type       {string}
             * @default    middle
             * @product    highcharts
             * @apioption  xAxis.title.enabled
             */

            /**
             * The pixel distance between the axis labels or line and the title.
             * Defaults to 0 for horizontal axes, 10 for vertical
             *
             * @sample {highcharts} highcharts/xaxis/title-margin/
             *         Y axis title margin of 60
             *
             * @type       {number}
             * @apioption  xAxis.title.margin
             */

            /**
             * The distance of the axis title from the axis line. By default,
             * this distance is computed from the offset width of the labels,
             * the labels' distance from the axis and the title's margin.
             * However when the offset option is set, it overrides all this.
             *
             * @sample {highcharts} highcharts/yaxis/title-offset/
             *         Place the axis title on top of the axis
             * @sample {highstock} highcharts/yaxis/title-offset/
             *         Place the axis title on top of the Y axis
             *
             * @type       {number}
             * @since      2.2.0
             * @apioption  xAxis.title.offset
             */

            /**
             * Whether to reserve space for the title when laying out the axis.
             *
             * @type       {boolean}
             * @default    true
             * @since      5.0.11
             * @product    highcharts highstock
             * @apioption  xAxis.title.reserveSpace
             */

            /**
             * The rotation of the text in degrees. 0 is horizontal, 270 is
             * vertical reading from bottom to top.
             *
             * @sample {highcharts} highcharts/yaxis/title-offset/
             *         Horizontal
             *
             * @type       {number}
             * @default    0
             * @apioption  xAxis.title.rotation
             */

            /**
             * The actual text of the axis title. It can contain basic HTML text
             * markup like <b>, <i> and spans with style.
             *
             * @sample {highcharts} highcharts/xaxis/title-text/
             *         Custom HTML
             * @sample {highstock} stock/xaxis/title-text/
             *         Titles for both axes
             *
             * @type       {string}
             * @apioption  xAxis.title.text
             */

            /**
             * Alignment of the text, can be `"left"`, `"right"` or `"center"`.
             * Default alignment depends on the
             * [title.align](xAxis.title.align):
             *
             * Horizontal axes:
             * - for `align` = `"low"`, `textAlign` is set to `left`
             * - for `align` = `"middle"`, `textAlign` is set to `center`
             * - for `align` = `"high"`, `textAlign` is set to `right`
             *
             * Vertical axes:
             * - for `align` = `"low"` and `opposite` = `true`, `textAlign` is
             *   set to `right`
             * - for `align` = `"low"` and `opposite` = `false`, `textAlign` is
             *   set to `left`
             * - for `align` = `"middle"`, `textAlign` is set to `center`
             * - for `align` = `"high"` and `opposite` = `true` `textAlign` is
             *   set to `left`
             * - for `align` = `"high"` and `opposite` = `false` `textAlign` is
             *   set to `right`
             *
             * @type       {string}
             * @apioption  xAxis.title.textAlign
             */

            /**
             * Whether to [use HTML](https://www.highcharts.com/docs/
             * chart-concepts/labels-and-string-formatting#html) to render the
             * axis title.
             *
             * @type       {boolean}
             * @default    false
             * @product    highcharts highstock
             * @apioption  xAxis.title.useHTML
             */

            /**
             * Horizontal pixel offset of the title position.
             *
             * @type       {number}
             * @default    0
             * @since      4.1.6
             * @product    highcharts highstock
             * @apioption  xAxis.title.x
             */

            /**
             * Vertical pixel offset of the title position.
             *
             * @type       {number}
             * @product    highcharts highstock
             * @apioption  xAxis.title.y
             */

            /**
             * Alignment of the title relative to the axis values. Possible
             * values are "low", "middle" or "high".
             *
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
             *
             * @type       {string}
             * @validvalue ["low", "middle", "high"]
             * @apioption  xAxis.title.align
             */
            align: 'middle',

            /*= if (build.classic) { =*/

            /**
             * CSS styles for the title. If the title text is longer than the
             * axis length, it will wrap to multiple lines by default. This can
             * be customized by setting `textOverflow: 'ellipsis'`, by
             * setting a specific `width` or by setting `whiteSpace: 'nowrap'`.
             *
             * In styled mode, the stroke width is given in the
             * `.highcharts-axis-title` class.
             *
             * @sample {highcharts} highcharts/xaxis/title-style/
             *         Red
             * @sample {highcharts} highcharts/css/axis/
             *         Styled mode
             *
             * @type       {Highcharts.CSSObject}
             * @default    {"color": "#666666"}
             * @apioption  xAxis.title.style
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
         *
         * @type       {string}
         * @default    linear
         * @product    highcharts
         * @validvalue ["linear", "logarithmic", "datetime", "category"]
         * @apioption  xAxis.type
         */
        type: 'linear',

        /**
         * Applies only when the axis `type` is `category`. When `uniqueNames`
         * is true, points are placed on the X axis according to their names.
         * If the same point name is repeated in the same or another series,
         * the point is placed on the same X position as other points of the
         * same name. When `uniqueNames` is false, the points are laid out in
         * increasing X positions regardless of their names, and the X axis
         * category will take the name of the last point in each position.
         *
         * @sample {highcharts} highcharts/xaxis/uniquenames-true/
         *         True by default
         * @sample {highcharts} highcharts/xaxis/uniquenames-false/
         *         False
         *
         * @type       {boolean}
         * @default    true
         * @since      4.2.7
         * @product    highcharts
         * @apioption  xAxis.uniqueNames
         */

        /**
         * Datetime axis only. An array determining what time intervals the
         * ticks are allowed to fall on. Each array item is an array where the
         * first value is the time unit and the second value another array of
         * allowed multiples. Defaults to:
         *
         * <pre>units: [[
         *     'millisecond', // unit name
         *     [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
         * ], [
         *     'second',
         *     [1, 2, 5, 10, 15, 30]
         * ], [
         *     'minute',
         *     [1, 2, 5, 10, 15, 30]
         * ], [
         *     'hour',
         *     [1, 2, 3, 4, 6, 8, 12]
         * ], [
         *     'day',
         *     [1]
         * ], [
         *     'week',
         *     [1]
         * ], [
         *     'month',
         *     [1, 3, 6]
         * ], [
         *     'year',
         *     null
         * ]]</pre>
         *
         * @type       {Array<Array<string|Array<number>>>}
         * @product    highcharts highstock
         * @apioption  xAxis.units
         */

        /**
         * Whether axis, including axis title, line, ticks and labels, should
         * be visible.
         *
         * @type       {boolean}
         * @default    true
         * @since      4.1.9
         * @product    highcharts highstock
         * @apioption  xAxis.visible
         */

        /*= if (build.classic) { =*/

        /**
         * Color of the minor, secondary grid lines.
         *
         * In styled mode, the stroke width is given in the
         * `.highcharts-minor-grid-line` class.
         *
         * @sample {highcharts} highcharts/yaxis/minorgridlinecolor/
         *         Bright grey lines from Y axis
         * @sample {highcharts|highstock} highcharts/css/axis-grid/
         *         Styled mode
         * @sample {highstock} stock/xaxis/minorgridlinecolor/
         *         Bright grey lines from Y axis
         *
         * @type       {Highcharts.ColorString}
         * @default    #f2f2f2
         * @apioption  xAxis.minorGridLineColor
         */
        minorGridLineColor: '${palette.neutralColor5}',

        /**
         * Width of the minor, secondary grid lines.
         *
         * In styled mode, the stroke width is given in the
         * `.highcharts-grid-line` class.
         *
         * @sample {highcharts} highcharts/yaxis/minorgridlinewidth/
         *         2px lines from Y axis
         * @sample {highcharts|highstock} highcharts/css/axis-grid/
         *         Styled mode
         * @sample {highstock} stock/xaxis/minorgridlinewidth/
         *         2px lines from Y axis
         *
         * @type       {number}
         * @apioption  xAxis.minorGridLineWidth
         */
        minorGridLineWidth: 1,

        /**
         * Color for the minor tick marks.
         *
         * @sample {highcharts} highcharts/yaxis/minortickcolor/
         *         Black tick marks on Y axis
         * @sample {highstock} stock/xaxis/minorticks/
         *         Black tick marks on Y axis
         *
         * @type       {Highcharts.ColorString}
         * @default    #999999
         * @apioption  xAxis.minorTickColor
         */
        minorTickColor: '${palette.neutralColor40}',

        /**
         * The color of the line marking the axis itself.
         *
         * In styled mode, the line stroke is given in the
         * `.highcharts-axis-line` or `.highcharts-xaxis-line` class.
         *
         * @productdesc {highmaps}
         * In Highmaps, the axis line is hidden by default, because the axis is
         * not visible by default.
         *
         * @sample {highcharts} highcharts/yaxis/linecolor/
         *         A red line on Y axis
         * @sample {highcharts|highstock} highcharts/css/axis/
         *         Axes in styled mode
         * @sample {highstock} stock/xaxis/linecolor/
         *         A red line on X axis
         *
         * @type       {Highcharts.ColorString}
         * @default    #ccd6eb
         * @apioption  xAxis.lineColor
         */
        lineColor: '${palette.highlightColor20}',

        /**
         * The width of the line marking the axis itself.
         *
         * In styled mode, the stroke width is given in the
         * `.highcharts-axis-line` or `.highcharts-xaxis-line` class.
         *
         * @sample {highcharts} highcharts/yaxis/linecolor/
         *         A 1px line on Y axis
         * @sample {highcharts|highstock} highcharts/css/axis/
         *         Axes in styled mode
         * @sample {highstock} stock/xaxis/linewidth/
         *         A 2px line on X axis
         *
         * @type       {number}
         * @default    {highcharts|highstock} 1
         * @default    {highmaps} 0
         * @apioption  xAxis.lineWidth
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
         * @sample {highcharts} highcharts/yaxis/gridlinecolor/
         *         Green lines
         * @sample {highcharts|highstock} highcharts/css/axis-grid/
         *         Styled mode
         * @sample {highstock} stock/xaxis/gridlinecolor/
         *         Green lines
         *
         * @type       {Highcharts.ColorString}
         * @default    #e6e6e6
         * @apioption  xAxis.gridLineColor
         */
        gridLineColor: '${palette.neutralColor10}',
        // gridLineDashStyle: 'solid',


        /**
         * The width of the grid lines extending the ticks across the plot area.
         *
         * In styled mode, the stroke width is given in the
         * `.highcharts-grid-line` class.
         *
         * @sample {highcharts} highcharts/yaxis/gridlinewidth/
         *         2px lines
         * @sample {highcharts|highstock} highcharts/css/axis-grid/
         *         Styled mode
         * @sample {highstock} stock/xaxis/gridlinewidth/
         *         2px lines
         *
         * @type        {number}
         * @default     0
         * @apioption   xAxis.gridLineWidth
         */
        // gridLineWidth: 0,

        /**
         * Color for the main tick marks.
         *
         * In styled mode, the stroke is given in the `.highcharts-tick`
         * class.
         *
         * @type    {Highcharts.ColorString}
         * @sample  {highcharts} highcharts/xaxis/tickcolor/
         *          Red ticks on X axis
         * @sample  {highcharts|highstock} highcharts/css/axis-grid/
         *          Styled mode
         * @sample  {highstock} stock/xaxis/ticks/
         *          Formatted ticks on X axis
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
     * See [the Axis object](/class-reference/Highcharts.Axis) for programmatic
     * access to the axis.
     *
     * @extends      xAxis
     * @excluding    ordinal,overscroll
     * @optionparent yAxis
     */
    defaultYAxisOptions: {
        /**
         * In a polar chart, this is the angle of the Y axis in degrees, where
         * 0 is up and 90 is right. The angle determines the position of the
         * axis line and the labels, though the coordinate system is unaffected.
         *
         * @sample {highcharts} highcharts/yaxis/angle/
         *         Dual axis polar chart
         *
         * @type       {number}
         * @default    0
         * @since      4.2.7
         * @product    highcharts
         * @apioption  yAxis.angle
         */

        /**
         * Polar charts only. Whether the grid lines should draw as a polygon
         * with straight lines between categories, or as circles. Can be either
         * `circle` or `polygon`.
         *
         * @sample {highcharts} highcharts/demo/polar-spider/
         *         Polygon grid lines
         * @sample {highcharts} highcharts/yaxis/gridlineinterpolation/
         *         Circle and polygon
         *
         * @type       {string}
         * @product    highcharts
         * @validvalue ["circle", "polygon"]
         * @apioption  yAxis.gridLineInterpolation
         */

        /**
         * The height of the Y axis. If it's a number, it is interpreted as
         * pixels.
         *
         * Since Highstock 2: If it's a percentage string, it is interpreted
         * as percentages of the total plot height.
         *
         * @see [yAxis.top](#yAxis.top)
         *
         * @sample {highstock} stock/demo/candlestick-and-volume/
         *         Percentage height panes
         *
         * @type       {number|string}
         * @product    highstock
         * @apioption  yAxis.height
         */

        /**
         * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
         * to represent the maximum value of the Y axis.
         *
         * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/
         *         Min and max colors
         *
         * @type       {Highcharts.ColorString}
         * @default    #003399
         * @since      4.0
         * @product    highcharts
         * @apioption  yAxis.maxColor
         */

        /**
         * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
         * to represent the minimum value of the Y axis.
         *
         * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/
         *         Min and max color
         *
         * @type       {Highcharts.ColorString}
         * @default    #e6ebf5
         * @since      4.0
         * @product    highcharts
         * @apioption  yAxis.minColor
         */

        /**
         * Whether to reverse the axis so that the highest number is closest
         * to the origin.
         *
         * @sample {highcharts} highcharts/yaxis/reversed/
         *         Reversed Y axis
         * @sample {highstock} stock/xaxis/reversed/
         *         Reversed Y axis
         *
         * @type       {boolean}
         * @default    {highcharts} false
         * @default    {highstock} false
         * @default    {highmaps} true
         * @apioption  yAxis.reversed
         */

        /**
         * If `true`, the first series in a stack will be drawn on top in a
         * positive, non-reversed Y axis. If `false`, the first series is in
         * the base of the stack.
         *
         * @sample {highcharts} highcharts/yaxis/reversedstacks-false/
         *         Non-reversed stacks
         * @sample {highstock} highcharts/yaxis/reversedstacks-false/
         *         Non-reversed stacks
         *
         * @type       {boolean}
         * @default    true
         * @since      3.0.10
         * @product    highcharts highstock
         * @apioption  yAxis.reversedStacks
         */

        /**
         * Solid gauge series only. Color stops for the solid gauge. Use this
         * in cases where a linear gradient between a `minColor` and `maxColor`
         * is not sufficient. The stops is an array of tuples, where the first
         * item is a float between 0 and 1 assigning the relative position in
         * the gradient, and the second item is the color.
         *
         * For solid gauges, the Y axis also inherits the concept of [data classes](http://api.
         * highcharts.com/highmaps#colorAxis.dataClasses) from the Highmaps
         * color axis.
         *
         * @see [minColor](#yAxis.minColor), [maxColor](#yAxis.maxColor).
         *
         * @sample {highcharts} highcharts/demo/gauge-solid/
         *         True by default
         *
         * @type       {Array<Array<number|Highcharts.ColorString>>}
         * @since      4.0
         * @product    highcharts
         * @apioption  yAxis.stops
         */

        /**
         * The pixel width of the major tick marks.
         *
         * @sample {highcharts} highcharts/xaxis/tickwidth/ 10 px width
         * @sample {highstock} stock/xaxis/ticks/ Formatted ticks on X axis
         *
         * @type       {number}
         * @default    0
         * @product    highcharts highstock
         * @apioption  yAxis.tickWidth
         */

        /**
         * Angular gauges and solid gauges only. The label's pixel distance
         * from the perimeter of the plot area.
         *
         * @type       {number}
         * @default    -25
         * @product    highcharts
         * @apioption  yAxis.labels.distance
         */

        /**
         * The y position offset of the label relative to the tick position
         * on the axis.
         *
         * @sample {highcharts} highcharts/xaxis/labels-x/
         *         Y axis labels placed on grid lines
         *
         * @type       {number}
         * @default    {highcharts} 3
         * @default    {highstock} -2
         * @default    {highmaps} 3
         * @apioption  yAxis.labels.y
         */

        /**
         * An array of objects defining plot bands on the Y axis.
         *
         * @type       {Array<*>}
         * @extends    xAxis.plotBands
         * @product    highcharts highstock
         * @apioption  yAxis.plotBands
         */

        /**
         * In a gauge chart, this option determines the inner radius of the
         * plot band that stretches along the perimeter. It can be given as
         * a percentage string, like `"100%"`, or as a pixel number, like `100`.
         * By default, the inner radius is controlled by the [thickness](
         * #yAxis.plotBands.thickness) option.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-gauge
         *         Gauge plot band
         *
         * @type       {number|string}
         * @since      2.3
         * @product    highcharts
         * @apioption  yAxis.plotBands.innerRadius
         */

        /**
         * In a gauge chart, this option determines the outer radius of the
         * plot band that stretches along the perimeter. It can be given as
         * a percentage string, like `"100%"`, or as a pixel number, like `100`.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-gauge
         *         Gauge plot band
         *
         * @type       {number|string}
         * @default    100%
         * @since      2.3
         * @product    highcharts
         * @apioption  yAxis.plotBands.outerRadius
         */

        /**
         * In a gauge chart, this option sets the width of the plot band
         * stretching along the perimeter. It can be given as a percentage
         * string, like `"10%"`, or as a pixel number, like `10`. The default
         * value 10 is the same as the default [tickLength](#yAxis.tickLength),
         * thus making the plot band act as a background for the tick markers.
         *
         * @sample {highcharts} highcharts/xaxis/plotbands-gauge
         *         Gauge plot band
         *
         * @type       {number|string}
         * @default    10
         * @since      2.3
         * @product    highcharts
         * @apioption  yAxis.plotBands.thickness
         */

        /**
         * An array of objects representing plot lines on the X axis
         *
         * @type       {Array<*>}
         * @extends    xAxis.plotLines
         * @product    highcharts highstock
         * @apioption  yAxis.plotLines
         */

        /**
         * @productdesc {highstock}
         * In Highstock, `endOnTick` is always false when the navigator is
         * enabled, to prevent jumpy scrolling.
         *
         * @type       {boolean}
         * @default    true
         * @apioption  yAxis.endOnTick
         */
        endOnTick: true,

        /**
         * Padding of the max value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer. This is useful
         * when you don't want the highest data value to appear on the edge
         * of the plot area. When the axis' `max` option is set or a max extreme
         * is set using `axis.setExtremes()`, the maxPadding will be ignored.
         *
         * @sample {highcharts} highcharts/yaxis/maxpadding-02/
         *         Max padding of 0.2
         * @sample {highstock} stock/xaxis/minpadding-maxpadding/
         *         Greater min- and maxPadding
         *
         * @type       {number}
         * @default    0.05
         * @since      1.2.0
         * @product    highcharts highstock
         * @apioption  yAxis.maxPadding
         */
        maxPadding: 0.05,

        /**
         * Padding of the min value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer. This is useful
         * when you don't want the lowest data value to appear on the edge
         * of the plot area. When the axis' `min` option is set or a max extreme
         * is set using `axis.setExtremes()`, the maxPadding will be ignored.
         *
         * @sample {highcharts} highcharts/yaxis/minpadding/
         *         Min padding of 0.2
         * @sample {highstock} stock/xaxis/minpadding-maxpadding/
         *         Greater min- and maxPadding
         *
         * @type        {number}
         * @default     0.05
         * @since       1.2.0
         * @product     highcharts highstock
         * @apioptions  yAxis.minPadding
         */
        minPadding: 0.05,

        /**
         * @productdesc {highstock}
         * In Highstock 1.x, the Y axis was placed on the left side by default.
         *
         * @sample {highcharts} highcharts/yaxis/opposite/
         *         Secondary Y axis opposite
         * @sample {highstock} stock/xaxis/opposite/
         *         Y axis on left side
         *
         * @type       {boolean}
         * @default    {highstock} true
         * @default    {highcharts} false
         * @product    highstock highcharts
         * @apioption  yAxis.opposite
         */

        /**
         * @see [tickInterval](#xAxis.tickInterval),
         *      [tickPositioner](#xAxis.tickPositioner),
         *      [tickPositions](#xAxis.tickPositions).
         *
         * @type       {number}
         * @default    72
         * @apioption  yAxis.tickPixelInterval
         */
        tickPixelInterval: 72,

        /**
         * @type       {boolean}
         * @default    true
         * @apioption  yAxis.showLastLabel
         */
        showLastLabel: true,

        /**
         * @type       {*}
         * @extends    xAxis.labels
         * @apioption  yAxis.labels
         */
        labels: {
            /**
             * What part of the string the given position is anchored to. Can
             * be one of `"left"`, `"center"` or `"right"`. The exact position
             * also depends on the `labels.x` setting.
             *
             * Angular gauges and solid gauges defaults to `center`.
             *
             * @sample {highcharts} highcharts/yaxis/labels-align-left/
             *         Left
             *
             * @type       {string}
             * @default    {highcharts|highmaps} right
             * @default    {highstock} left
             * @validvalue ["left", "center", "right"]
             * @apioption  yAxis.labels.align
             */

            /**
             * The x position offset of the label relative to the tick position
             * on the axis. Defaults to -15 for left axis, 15 for right axis.
             *
             * @sample {highcharts} highcharts/xaxis/labels-x/
             *         Y axis labels placed on grid lines
             *
             * @type       {number}
             * @default    -8
             * @apioption  yAxis.labels.x
             */
            x: -8
        },

        /**
         * @productdesc {highmaps}
         * In Highmaps, the axis line is hidden by default, because the axis is
         * not visible by default.
         *
         * @type       {Highcharts.ColorString}
         * @apioption  yAxis.lineColor
         */

        /**
         * @sample {highcharts} highcharts/yaxis/max-200/
         *         Y axis max of 200
         * @sample {highcharts} highcharts/yaxis/max-logarithmic/
         *         Y axis max on logarithmic axis
         * @sample {highstock} stock/yaxis/min-max/
         *         Fixed min and max on Y axis
         * @sample {highmaps} maps/axis/min-max/
         *         Pre-zoomed to a specific area
         *
         * @type       {number}
         * @apioption  yAxis.max
         */

        /**
         * @sample {highcharts} highcharts/yaxis/min-startontick-false/
         *         -50 with startOnTick to false
         * @sample {highcharts} highcharts/yaxis/min-startontick-true/
         *         -50 with startOnTick true by default
         * @sample {highstock} stock/yaxis/min-max/
         *         Fixed min and max on Y axis
         * @sample {highmaps} maps/axis/min-max/
         *         Pre-zoomed to a specific area
         *
         * @type       {number}
         * @apioption  yAxis.min
         */

        /**
         * An optional scrollbar to display on the Y axis in response to
         * limiting the minimum an maximum of the axis values.
         *
         * In styled mode, all the presentational options for the scrollbar
         * are replaced by the classes `.highcharts-scrollbar-thumb`,
         * `.highcharts-scrollbar-arrow`, `.highcharts-scrollbar-button`,
         * `.highcharts-scrollbar-rifles` and `.highcharts-scrollbar-track`.
         *
         * @sample {highstock} stock/yaxis/scrollbar/
         *         Scrollbar on the Y axis
         *
         * @type       {*}
         * @extends    scrollbar
         * @excluding  height
         * @since      4.2.6
         * @product    highstock
         * @apioption  yAxis.scrollbar
         */

        /**
         * Enable the scrollbar on the Y axis.
         *
         * @sample {highstock} stock/yaxis/scrollbar/
         *         Enabled on Y axis
         *
         * @type       {boolean}
         * @default    false
         * @since      4.2.6
         * @product    highstock
         * @apioption  yAxis.scrollbar.enabled
         */

        /**
         * Pixel margin between the scrollbar and the axis elements.
         *
         * @type       {number}
         * @default    10
         * @since      4.2.6
         * @product    highstock
         * @apioption  yAxis.scrollbar.margin
         */

        /**
         * Whether to show the scrollbar when it is fully zoomed out at max
         * range. Setting it to `false` on the Y axis makes the scrollbar stay
         * hidden until the user zooms in, like common in browsers.
         *
         * @type       {boolean}
         * @default    true
         * @since      4.2.6
         * @product    highstock
         * @apioption  yAxis.scrollbar.showFull
         */

        /**
         * The width of a vertical scrollbar or height of a horizontal
         * scrollbar. Defaults to 20 on touch devices.
         *
         * @type       {number}
         * @default    14
         * @since      4.2.6
         * @product    highstock
         * @apioption  yAxis.scrollbar.size
         */

        /**
         * Z index of the scrollbar elements.
         *
         * @type       {number}
         * @default    3
         * @since      4.2.6
         * @product    highstock
         * @apioption  yAxis.scrollbar.zIndex
         */

        /**
         * A soft maximum for the axis. If the series data maximum is less
         * than this, the axis will stay at this maximum, but if the series
         * data maximum is higher, the axis will flex to show all data.
         *
         * **Note**: The [series.softThreshold](
         * #plotOptions.series.softThreshold) option takes precedence over this
         * option.
         *
         * @sample highcharts/yaxis/softmin-softmax/
         *         Soft min and max
         *
         * @type       {number}
         * @since      5.0.1
         * @product    highcharts highstock
         * @apioption  yAxis.softMax
         */

        /**
         * A soft minimum for the axis. If the series data minimum is greater
         * than this, the axis will stay at this minimum, but if the series
         * data minimum is lower, the axis will flex to show all data.
         *
         * **Note**: The [series.softThreshold](
         * #plotOptions.series.softThreshold) option takes precedence over this
         * option.
         *
         * @sample highcharts/yaxis/softmin-softmax/
         *         Soft min and max
         *
         * @type       {number}
         * @since      5.0.1
         * @product    highcharts highstock
         * @apioption  yAxis.softMin
         */

        /**
         * Defines the horizontal alignment of the stack total label. Can be one
         * of `"left"`, `"center"` or `"right"`. The default value is calculated
         * at runtime and depends on orientation and whether the stack is
         * positive or negative.
         *
         * @sample {highcharts} highcharts/yaxis/stacklabels-align-left/
         *         Aligned to the left
         * @sample {highcharts} highcharts/yaxis/stacklabels-align-center/
         *         Aligned in center
         * @sample {highcharts} highcharts/yaxis/stacklabels-align-right/
         *         Aligned to the right
         *
         * @type       {string}
         * @since      2.1.5
         * @product    highcharts
         * @validvalue ["left", "center", "right"]
         * @apioption  yAxis.stackLabels.align
         */

        /**
         * A [format string](http://docs.highcharts.com/#formatting) for the
         * data label. Available variables are the same as for `formatter`.
         *
         * @type       {string}
         * @default    {total}
         * @since      3.0.2
         * @product    highcharts highstock
         * @apioption  yAxis.stackLabels.format
         */

        /**
         * Rotation of the labels in degrees.
         *
         * @sample {highcharts} highcharts/yaxis/stacklabels-rotation/
         *         Labels rotated 45°
         *
         * @type       {number}
         * @default    0
         * @since      2.1.5
         * @product    highcharts
         * @apioption  yAxis.stackLabels.rotation
         */

        /**
         * The text alignment for the label. While `align` determines where the
         * texts anchor point is placed with regards to the stack, `textAlign`
         * determines how the text is aligned against its anchor point. Possible
         * values are `"left"`, `"center"` and `"right"`. The default value is
         * calculated at runtime and depends on orientation and whether the
         * stack is positive or negative.
         *
         * @sample {highcharts} highcharts/yaxis/stacklabels-textalign-left/
         *         Label in center position but text-aligned left
         *
         * @type       {string}
         * @since      2.1.5
         * @product    highcharts
         * @validvalue ["left", "center", "right"]
         * @apioption  yAxis.stackLabels.textAlign
         */

        /**
         * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/
         * labels-and-string-formatting#html) to render the labels.
         *
         * @type       {boolean}
         * @default    false
         * @since      3.0
         * @product    highcharts highstock
         * @apioption  yAxis.stackLabels.useHTML
         */

        /**
         * Defines the vertical alignment of the stack total label. Can be one
         * of `"top"`, `"middle"` or `"bottom"`. The default value is calculated
         * at runtime and depends on orientation and whether the stack is
         * positive or negative.
         *
         * @sample {highcharts} highcharts/yaxis/stacklabels-verticalalign-top/
         *         Vertically aligned top
         * @sample {highcharts} highcharts/yaxis/stacklabels-verticalalign-middle/
         *         Vertically aligned middle
         * @sample {highcharts} highcharts/yaxis/stacklabels-verticalalign-bottom/
         *         Vertically aligned bottom
         *
         * @type       {string}
         * @since      2.1.5
         * @product    highcharts
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  yAxis.stackLabels.verticalAlign
         */

        /**
         * The x position offset of the label relative to the left of the
         * stacked bar. The default value is calculated at runtime and depends
         * on orientation and whether the stack is positive or negative.
         *
         * @sample {highcharts} highcharts/yaxis/stacklabels-x/
         *         Stack total labels with x offset
         *
         * @type       {number}
         * @since      2.1.5
         * @product    highcharts
         * @apioption  yAxis.stackLabels.x
         */

        /**
         * The y position offset of the label relative to the tick position
         * on the axis. The default value is calculated at runtime and depends
         * on orientation and whether the stack is positive or negative.
         *
         * @sample {highcharts} highcharts/yaxis/stacklabels-y/
         *         Stack total labels with y offset
         *
         * @type       {number}
         * @since      2.1.5
         * @product    highcharts
         * @apioption  yAxis.stackLabels.y
         */

        /**
         * Whether to force the axis to start on a tick. Use this option with
         * the `maxPadding` option to control the axis start.
         *
         * @sample  {highcharts} highcharts/xaxis/startontick-false/
         *          False by default
         * @sample  {highcharts} highcharts/xaxis/startontick-true/
         *          True
         * @sample  {highstock} stock/xaxis/endontick/
         *          False for Y axis
         *
         * @type       {boolean}
         * @default    true
         * @since      1.2.0
         * @product    highcharts highstock
         * @apioption  yAxis.startOnTick
         */
        startOnTick: true,

        /**
         * @type       {*}
         * @extends    xAxis.title
         * @apioption  yAxis.title
         */
        title: {

            /**
             * The pixel distance between the axis labels and the title.
             * Positive values are outside the axis line, negative are inside.
             *
             * @sample {highcharts} highcharts/xaxis/title-margin/
             *         Y axis title margin of 60
             *
             * @type       {number}
             * @default    40
             * @apioption  yAxis.title.margin
             */

            /**
             * The rotation of the text in degrees. 0 is horizontal, 270 is
             * vertical reading from bottom to top.
             *
             * @sample {highcharts} highcharts/yaxis/title-offset/
             *         Horizontal
             *
             * @type       {number}
             * @default    270
             * @apioption  yAxis.title.rotation
             */
            rotation: 270,

            /**
             * The actual text of the axis title. Horizontal texts can contain
             * HTML, but rotated texts are painted using vector techniques and
             * must be clean text. The Y axis title is disabled by setting the
             * `text` option to `undefined`.
             *
             * @sample  {highcharts} highcharts/xaxis/title-text/
             *          Custom HTML
             *
             * @type       {string}
             * @default    {highcharts} Values
             * @default    {highstock} undefined
             * @product    highcharts highstock
             * @apioption  yAxis.title.text
             */
            text: 'Values'
        },

        /**
         * The top position of the Y axis. If it's a number, it is interpreted
         * as pixel position relative to the chart.
         *
         * Since Highstock 2: If it's a percentage string, it is interpreted
         * as percentages of the plot height, offset from plot area top.
         *
         * @see [yAxis.height](#yAxis.height)
         *
         * @sample {highstock} stock/demo/candlestick-and-volume/
         *         Percentage height panes
         *
         * @type       {number|string}
         * @product    highstock
         * @apioption  yAxis.top
         */

        /**
         * The stack labels show the total value for each bar in a stacked
         * column or bar chart. The label will be placed on top of positive
         * columns and below negative columns. In case of an inverted column
         * chart or a bar chart the label is placed to the right of positive
         * bars and to the left of negative bars.
         *
         * @type       {*}
         * @product    highcharts
         * @apioption  yAxis.stackLabels
         */
        stackLabels: {

            /**
             * Allow the stack labels to overlap.
             *
             * @sample {highcharts} highcharts/yaxis/stacklabels-allowoverlap-false/
             *         Default false
             *
             * @type       {boolean}
             * @since      5.0.13
             * @product    highcharts
             * @apioption  yAxis.stackLabels.allowOverlap
             */
            allowOverlap: false,

            /**
             * Enable or disable the stack total labels.
             *
             * @sample {highcharts} highcharts/yaxis/stacklabels-enabled/
             *         Enabled stack total labels
             *
             * @type       {boolean}
             * @since      2.1.5
             * @product    highcharts
             * @apioption  yAxis.stackLabels.enabled
             */
            enabled: false,

            /**
             * Callback JavaScript function to format the label. The value is
             * given by `this.total`.
             *
             * @sample {highcharts} highcharts/yaxis/stacklabels-formatter/
             *         Added units to stack total value
             *
             * @type       {Function}
             * @default    function() { return H.numberFormat(this.total, -1); }
             * @since      2.1.5
             * @product    highcharts
             * @apioption  yAxis.stackLabels.formatter
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
             * @sample {highcharts} highcharts/yaxis/stacklabels-style/
             *         Red stack total labels
             *
             * @type       {Highcharts.CSSObject}
             * @since      2.1.5
             * @product    highcharts
             * @apioption  yAxis.stackLabels.style
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
        gridLineWidth: 1,
        lineWidth: 0
        // tickWidth: 0
        /*= } =*/
    },

    /**
     * The Z axis or depth axis for 3D plots.
     *
     * See [the Axis object](/class-reference/Highcharts.Axis) for programmatic
     * access to the axis.
     *
     * @sample {highcharts} highcharts/3d/scatter-zaxis-categories/
     *         Z-Axis with Categories
     * @sample {highcharts} highcharts/3d/scatter-zaxis-grid/
     *         Z-Axis with styling
     *
     * @extends    xAxis
     * @since      5.0.0
     * @product    highcharts
     * @excluding  breaks,crosshair,lineColor,lineWidth,nameToX,showEmpty
     * @apioption  zAxis
     */

    /**
     * These options extend the defaultOptions for left axes.
     *
     * @private
     * @type {object}
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
     * @type {object}
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
     * @type {object}
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
     * @type {object}
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
         * @name     Highcharts.Axis#chart
         * @type     {Highcharts.Chart}
         */
        axis.chart = chart;

        /**
         * Whether the axis is horizontal.
         *
         * @name     Highcharts.Axis#horiz
         * @type     {boolean}
         */
        axis.horiz = chart.inverted && !axis.isZAxis ? !isXAxis : isXAxis;

        // Flag, isXAxis
        axis.isXAxis = isXAxis;

        /**
         * The collection where the axis belongs, for example `xAxis`, `yAxis`
         * or `colorAxis`. Corresponds to properties on Chart, for example
         * {@link Chart.xAxis}.
         *
         * @name     Highcharts.Axis#coll
         * @type     {string}
         */
        axis.coll = axis.coll || (isXAxis ? 'xAxis' : 'yAxis');

        fireEvent(this, 'init', { userOptions: userOptions });

        axis.opposite = userOptions.opposite; // needed in setOptions

        /**
         * The side on which the axis is rendered. 0 is top, 1 is right, 2 is
         * bottom and 3 is left.
         *
         * @name     Highcharts.Axis#side
         * @type     {number}
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
         * @name     Highcharts.Axis#reversed
         * @type     {boolean}
         */
        axis.reversed = options.reversed;
        axis.visible = options.visible !== false;
        axis.zoomEnabled = options.zoomEnabled !== false;

        // Initial categories
        axis.hasNames = type === 'category' || options.categories === true;
        axis.categories = options.categories || axis.hasNames;
        if (!axis.names) { // Preserve on update (#3830)
            axis.names = [];
            axis.names.keys = {};
        }


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
         * @name     Highcharts.Axis#max
         * @type     {number}
         */
        axis.max = null;
        /**
         * The minimum value of the axis. In a logarithmic axis, this is the
         * logarithm of the real value, and the real value can be obtained from
         * {@link Axis#getExtremes}.
         *
         * @name     Highcharts.Axis#min
         * @type     {number}
         */
        axis.min = null;


        /**
         * The processed crosshair options.
         *
         * @name     Highcharts.Axis#crosshair
         * @type     {Highcharts.AxisCrosshairOptions}
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
         * @name     Highcharts.Axis#series
         * @type     {Array<Highcharts.Series>}
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

        fireEvent(this, 'afterInit');
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

        fireEvent(this, 'afterSetOptions', { userOptions: userOptions });
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
            time = axis.chart.time,
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
            ret = format(formatOption, this, time);

        } else if (categories) {
            ret = value;

        } else if (dateTimeLabelFormat) { // datetime axis
            ret = time.dateFormat(dateTimeLabelFormat, value);

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

        fireEvent(this, 'getSeriesExtremes', null, function () {

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
                            // If xData contains values which is not numbers,
                            // then filter them out. To prevent performance hit,
                            // we only do this after we have already found
                            // seriesDataMin because in most cases all data is
                            // valid. #5234.
                            seriesDataMin = arrayMin(xData);
                            seriesDataMax = arrayMax(xData);

                            if (
                                !isNumber(seriesDataMin) &&
                                !(seriesDataMin instanceof Date) // #5010
                            ) {
                                xData = grep(xData, isNumber);
                                // Do it again with valid data
                                seriesDataMin = arrayMin(xData);
                                seriesDataMax = arrayMax(xData);
                            }

                            if (xData.length) {
                                axis.dataMin = Math.min(
                                    pick(axis.dataMin, xData[0], seriesDataMin),
                                    seriesDataMin
                                );
                                axis.dataMax = Math.max(
                                    pick(axis.dataMax, xData[0], seriesDataMax),
                                    seriesDataMax
                                );
                            }
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
                        // If any series has a hard threshold, it takes
                        // precedence
                        if (
                            !seriesOptions.softThreshold ||
                            axis.positiveValuesOnly
                        ) {
                            axis.softThreshold = false;
                        }
                    }
                }
            });
        });

        fireEvent(this, 'afterGetSeriesExtremes');
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
     * @function Highcharts.Axis#toPixels
     *
     * @param  {number} value
     *         A value in terms of axis units.
     *
     * @param  {boolean} paneCoordinates
     *         Whether to return the pixel coordinate relative to the chart or
     *         just the axis/pane itself.
     *
     * @return {number}
     *         Pixel position of the value on the chart or axis.
     */
    toPixels: function (value, paneCoordinates) {
        return this.translate(value, false, !this.horiz, null, true) +
            (paneCoordinates ? 0 : this.pos);
    },

    /**
     * Translate a pixel position along the axis to a value in terms of axis
     * units.
     *
     * @function Highcharts.Axis#toValue
     *
     * @param  {number} pixel
     *         The pixel value coordinate.
     *
     * @param  {boolean} paneCoordiantes
     *         Whether the input pixel is relative to the chart or just the
     *         axis/pane itself.
     *
     * @return {number}
     *         The axis value.
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
     * @function Highcharts.Axis#getPlotLinePath
     *
     * @param  {number} value
     *         Axis value.
     *
     * @param  {number|undefined} [lineWidth=1]
     *         Used for calculation crisp line coordinates.
     *
     * @param  {boolean|undefined} [old=false]
     *         Use old coordinates (for resizing and rescaling).
     *
     * @param  {boolean|undefined} [force=false]
     *         If `false`, the function will return null when it falls outside
     *         the axis bounds.
     *
     * @param  {number|undefined} [translatedValue]
     *         If given, return the plot line path of a pixel position on the
     *         axis.
     *
     * @return {Array<string|number>}
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
             * Check if x is between a and b. If not, either move to a/b
             * or skip, depending on the force parameter.
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
        // Keep the translated value within sane bounds, and avoid Infinity to
        // fail the isNumber test (#7709).
        translatedValue = Math.min(Math.max(-1e5, translatedValue), 1e5);


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
     * @function Highcharts.Axis#getLinearTickPositions
     *
     * @param  {number} tickInterval
     *         The normalized tick interval.
     *
     * @param  {number} min
     *         Axis minimum.
     *
     * @param  {number} max
     *         Axis maximum.
     *
     * @return {Array<number>}
     *         An array of axis values where ticks should be placed.
     */
    getLinearTickPositions: function (tickInterval, min, max) {
        var pos,
            lastPos,
            roundedMin =
                correctFloat(Math.floor(min / tickInterval) * tickInterval),
            roundedMax =
                correctFloat(Math.ceil(max / tickInterval) * tickInterval),
            tickPositions = [],
            precision;

        // When the precision is higher than what we filter out in
        // correctFloat, skip it (#6183).
        if (correctFloat(roundedMin + tickInterval) === roundedMin) {
            precision = 20;
        }

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
            pos = correctFloat(
                pos + tickInterval,
                precision
            );

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
     *
     * @function Highcharts.Axis#getMinorTickInterval
     *
     * @return {number|'auto'|null}
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
     * @function Highcharts.Axis#getMinorTickPositions
     *
     * @return {Array<number>}
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
     * @function Highcharts.Axis#nameToX
     *
     * @param  {Highcharts.Point}
     *         The point to inspect.
     *
     * @return {number}
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
                (
                    explicitCategories ?
                        inArray(point.name, names) :
                        pick(names.keys[point.name], -1)

                );
        }
        if (nameX === -1) { // Not found in currenct categories
            if (!explicitCategories) {
                x = names.length;
            }
        } else {
            x = nameX;
        }

        // Write the last point's name to the names array
        if (x !== undefined) {
            this.names[x] = point.name;
            // Backwards mapping is much faster than array searching (#7725)
            this.names.keys[point.name] = x;
        }

        return x;
    },

    /**
     * When changes have been done to series data, update the axis.names.
     *
     * @private
     */
    updateNames: function () {
        var axis = this,
            names = this.names,
            i = names.length;

        if (i > 0) {
            each(H.keys(names.keys), function (key) {
                delete names.keys[key];
            });
            names.length = 0;

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

        fireEvent(this, 'afterSetAxisTranslation');
    },

    /**
     * @private
     */
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
            threshold = isNumber(axis.threshold) ? axis.threshold : null,
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
            axis.min = correctFloat(axis.log2lin(axis.min), 15);
            axis.max = correctFloat(axis.log2lin(axis.max), 15);
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
                if (!defined(hardMax) && maxPadding) {
                    axis.max += length * maxPadding;
                }
            }
        }

        // Handle options for floor, ceiling, softMin and softMax (#6359)
        if (isNumber(options.softMin) && !isNumber(axis.userMin)) {
            axis.min = Math.min(axis.min, options.softMin);
        }
        if (isNumber(options.softMax) && !isNumber(axis.userMax)) {
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

        /**
         * Now we're finished detecting min and max, crop and group series data.
         * This is in turn needed in order to find tick positions in
         * ordinal axes.
         */
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
     *
     * @function Highcharts.Axis#setTickPositions
     *
     * @return {void}
     *
     * @todo
     * Make events official: Fires the event `afterSetTickPositions`.
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
                // Reduce doubled value (#7339)
                if (tickPositions[0] === tickPositions[1]) {
                    tickPositions.length = 1;
                }
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

        fireEvent(this, 'afterSetTickPositions');
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
            if (
                tickPositions.length === 0 &&
                defined(roundedMin) &&
                !this.options.tickPositions
            ) {
                tickPositions.push((roundedMax + roundedMin) / 2);
            }
        }
    },

    /**
     * Check if there are multiple axes in the same pane.
     *
     * @private
     * @function Highcharts.Axis#alignToOthers
     *
     * @return {boolean}
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

            // Disabled when startOnTick or endOnTick are false (#7604)
            options.startOnTick !== false &&
            options.endOnTick !== false &&

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
            threshold = pick(this.threshold, this.softThreshold ? 0 : null),
            i,
            len;

        if (this.hasData()) {
            if (currentTickAmount < tickAmount) {
                while (tickPositions.length < tickAmount) {

                    // Extend evenly for both sides unless we're on the
                    // threshold (#3965)
                    if (
                        tickPositions.length % 2 ||
                        this.min === threshold
                    ) {
                        // to the end
                        tickPositions.push(correctFloat(
                            tickPositions[tickPositions.length - 1] +
                            tickInterval
                        ));
                    } else {
                        // to the start
                        tickPositions.unshift(correctFloat(
                            tickPositions[0] - tickInterval
                        ));
                    }
                }
                this.transA *= (currentTickAmount - 1) / (tickAmount - 1);
                this.min = tickPositions[0];
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

        fireEvent(this, 'afterSetScale');
    },

    /**
     * Set the minimum and maximum of the axes after render time. If the
     * `startOnTick` and `endOnTick` options are true, the minimum and maximum
     * values are rounded off to the nearest tick. To prevent this, these
     * options can be set to false before calling setExtremes. Also, setExtremes
     * will not allow a range lower than the `minRange` option, which by default
     * is the range of five points.
     *
     * @function Highcharts.Axis#setExtremes
     *
     * @param  {number|undefined} [newMin]
     *         The new minimum value.
     *
     * @param  {number|undefined} [newMax]
     *         The new maximum value.
     *
     * @param  {boolean|undefined} [redraw=true]
     *         Whether to redraw the chart or wait for an explicit call to
     *         {@link Highcharts.Chart#redraw}
     *
     * @param  {boolean|Highcharts.AnimationOptionsObject|undefined} [animation=true]
     *         Enable or modify animations.
     *
     * @param  {*|undefined} [eventArguments]
     *         Arguments to be accessed in event handler.
     *
     * @return {void}
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
     *
     * @todo
     * Make events official: Fires the event `setExtremes`.
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
     * Get the current extremes for the axis.
     *
     * @function Highcharts.Axis#getExtremes
     *
     * @returns {Highcharts.ExtremesObject}
     *          An object containing extremes information.
     *
     * @sample  highcharts/members/axis-getextremes/
     *          Report extremes by click on a button
     * @sample  maps/members/axis-getextremes/
     *          Get extremes in Highmaps
     */
    getExtremes: function () {
        var axis = this,
            isLog = axis.isLog;

        return {
            min: isLog ? correctFloat(axis.lin2log(axis.min)) : axis.min,
            max: isLog ? correctFloat(axis.lin2log(axis.max)) : axis.max,
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
     * @function Highcharts.Axis#getThreshold
     *
     * @param  {number} threshold
     *         The threshold in axis values.
     *
     * @return {number}
     *         The translated threshold position in terms of pixels, and
     *         corrected to stay within the axis bounds.
     */
    getThreshold: function (threshold) {
        var axis = this,
            isLog = axis.isLog,
            realMin = isLog ? axis.lin2log(axis.min) : axis.min,
            realMax = isLog ? axis.lin2log(axis.max) : axis.max;

        if (threshold === null || threshold === -Infinity) {
            threshold = realMin;
        } else if (threshold === Infinity) {
            threshold = realMax;
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
     * @private
     * @function Highcharts.Axis#autoLabelAlign
     *
     * @param  {number} rotation
     *         The rotation in degrees as set by either the `rotation` or
     *         `autoRotation` options.
     *
     * @return {string}
     *         Can be `center`, `left` or `right`.
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
     * @function Highcharts.Axis#tickSize
     *
     * @param  {string} prefix
     *         'tick' or 'minorTick'
     *
     * @return {Array<number>}
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
     * @function Highcharts.Axis#labelMetrics
     *
     * @return {Highcharts.FontMetricsObject}
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
     * @function Highcharts.Axis#unsquish
     *
     * @return {number}
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
                return correctFloat(step * tickInterval);
            };

        if (horiz) {
            autoRotation = !labelOptions.staggerLines &&
                !labelOptions.step &&
                ( // #3971
                    defined(rotationOption) ?
                        [rotationOption] :
                        slotSize < pick(labelOptions.autoRotationLimit, 80) &&
                            labelOptions.autoRotation
                );

            if (autoRotation) {

                // Loop over the given autoRotation options, and determine
                // which gives the best score. The best score is that with
                // the lowest number of steps and a rotation closest
                // to horizontal.
                each(autoRotation, function (rot) {
                    var score;

                    if (
                        rot === rotationOption ||
                        (rot && rot >= -90 && rot <= 90)
                    ) { // #3891

                        step = getStep(
                            Math.abs(labelMetrics.h / Math.sin(deg2rad * rot))
                        );

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
     * @function Highcharts.Axis#getSlotWidth
     *
     * @param  {*|undefined} [tick]
     *         Optionally, calculate the slot width basing on tick label. It is
     *         used in highcharts-3d module, where the slots has different
     *         widths depending on perspective angles.
     *
     * @return {number}
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
                (
                    labelOptions.style &&
                    parseInt(labelOptions.style.width, 10)
                ) ||
                (
                    marginLeft &&
                    (marginLeft - chart.spacing[3])
                ) ||
                chart.chartWidth * 0.33
            )
        );

    },

    /**
     * Render the axis labels and determine whether ellipsis or rotation need
     * to be applied.
     *
     * @private
     * @function Highcharts.Axis#renderUnsquish
     *
     * @return {void}
     */
    renderUnsquish: function () {
        var chart = this.chart,
            renderer = chart.renderer,
            tickPositions = this.tickPositions,
            ticks = this.ticks,
            labelOptions = this.options.labels,
            labelStyleOptions = (labelOptions && labelOptions.style || {}),
            horiz = this.horiz,
            slotWidth = this.getSlotWidth(),
            innerWidth = Math.max(
                1,
                Math.round(slotWidth - 2 * (labelOptions.padding || 5))
            ),
            attr = {},
            labelMetrics = this.labelMetrics(),
            textOverflowOption = labelOptions.style &&
                labelOptions.style.textOverflow,
            commonWidth,
            commonTextOverflow,
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
            if (
                tick &&
                tick.label &&
                tick.label.textPxLength > maxLabelLength
            ) {
                maxLabelLength = tick.label.textPxLength;
            }
        });
        this.maxLabelLength = maxLabelLength;


        // Handle auto rotation on horizontal axis
        if (this.autoRotation) {

            // Apply rotation only if the label is too wide for the slot, and
            // the label is wider than its height.
            if (
                maxLabelLength > innerWidth &&
                maxLabelLength > labelMetrics.h
            ) {
                attr.rotation = this.labelRotation;
            } else {
                this.labelRotation = 0;
            }

        // Handle word-wrap or ellipsis on vertical axis
        } else if (slotWidth) {
            // For word-wrap or ellipsis
            commonWidth = innerWidth;

            if (!textOverflowOption) {
                commonTextOverflow = 'clip';

                // On vertical axis, only allow word wrap if there is room
                // for more lines.
                i = tickPositions.length;
                while (!horiz && i--) {
                    pos = tickPositions[i];
                    label = ticks[pos].label;
                    if (label) {
                        // Reset ellipsis in order to get the correct
                        // bounding box (#4070)
                        if (
                            label.styles &&
                            label.styles.textOverflow === 'ellipsis'
                        ) {
                            label.css({ textOverflow: 'clip' });

                        // Set the correct width in order to read
                        // the bounding box height (#4678, #5034)
                        } else if (label.textPxLength > slotWidth) {
                            label.css({ width: slotWidth + 'px' });
                        }

                        if (
                            label.getBBox().height > (
                                this.len / tickPositions.length -
                                (labelMetrics.h - labelMetrics.f)
                            )
                        ) {
                            label.specificTextOverflow = 'ellipsis';
                        }
                    }
                }
            }
        }


        // Add ellipsis if the label length is significantly longer than ideal
        if (attr.rotation) {
            commonWidth = (
                maxLabelLength > chart.chartHeight * 0.5 ?
                    chart.chartHeight * 0.33 :
                    maxLabelLength
            );
            if (!textOverflowOption) {
                commonTextOverflow = 'ellipsis';
            }
        }

        // Set the explicit or automatic label alignment
        this.labelAlign = labelOptions.align ||
            this.autoLabelAlign(this.labelRotation);
        if (this.labelAlign) {
            attr.align = this.labelAlign;
        }

        // Apply general and specific CSS
        each(tickPositions, function (pos) {
            var tick = ticks[pos],
                label = tick && tick.label,
                widthOption = labelStyleOptions.width,
                css = {};
            if (label) {
                // This needs to go before the CSS in old IE (#4502)
                label.attr(attr);

                if (
                    commonWidth &&
                    !widthOption &&
                    // Setting width in this case messes with the bounding box
                    // (#7975)
                    labelStyleOptions.whiteSpace !== 'nowrap' &&
                    (
                        // Speed optimizing, #7656
                        commonWidth < label.textPxLength ||
                        // Resetting CSS, #4928
                        label.element.tagName === 'SPAN'
                    )
                ) {
                    css.width = commonWidth;
                    if (!textOverflowOption) {
                        css.textOverflow = (
                            label.specificTextOverflow ||
                            commonTextOverflow
                        );
                    }
                    label.css(css);

                // Reset previously shortened label (#8210)
                } else if (
                    label.styles &&
                    label.styles.width &&
                    !css.width &&
                    !widthOption
                ) {
                    label.css({ width: null });
                }

                delete label.specificTextOverflow;
                tick.rotation = attr.rotation;
            }
        });

        // Note: Why is this not part of getLabelPosition?
        this.tickRotCorr = renderer.rotCorr(
            labelMetrics.b,
            this.labelRotation || 0,
            this.side !== 0
        );
    },

    /**
     * Return true if the axis has associated data.
     *
     * @function Highcharts.Axis#hasData
     *
     * @return {boolean}
     *         True if the axis has associated visible series and those series
     *         have either valid data points or explicit `min` and `max`
     *         settings.
     */
    hasData: function () {
        return (
            this.hasVisibleSeries ||
            (
                defined(this.min) &&
                defined(this.max) &&
                this.tickPositions &&
                this.tickPositions.length > 0
            )
        );
    },

    /**
     * Adds the title defined in axis.options.title.
     *
     * @function Highcharts.Axis#addTitle
     *
     * @param  {boolean} display
     *         Whether or not to display the title.
     *
     * @return {void}
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
            // #7814, don't mutate style option
            .css(merge(axisTitleOptions.style))
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
     * @function Highcharts.Axis#generateTick
     *
     * @param  {number} pos
     *         The tick position in axis values.
     *
     * @param  {number} i
     *         The index of the tick in {@link Axis.tickPositions}.
     *
     * @return {void}
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
            invertedSide = chart.inverted &&
                !axis.isZAxis ? [1, 0, 3, 2][side] : side,
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
                .addClass(
                    'highcharts-' + this.coll.toLowerCase() + '-grid ' +
                    (className || '')
                )
                .add(axisParent);
            axis.axisGroup = renderer.g('axis')
                .attr({ zIndex: options.zIndex || 2 })
                .addClass(
                    'highcharts-' + this.coll.toLowerCase() + ' ' +
                    (className || '')
                )
                .add(axisParent);
            axis.labelGroup = renderer.g('axis-labels')
                .attr({ zIndex: labelOptions.zIndex || 7 })
                .addClass(
                    'highcharts-' + axis.coll.toLowerCase() + '-labels ' +
                    (className || '')
                )
                .add(axisParent);
        }

        if (hasData || axis.isLinked) {

            // Generate ticks
            each(tickPositions, function (pos, i) {
                // i is not used here, but may be used in overrides
                axis.generateTick(pos, i);
            });

            axis.renderUnsquish();


            // Left side must be align: right and right side must
            // have align: left for labels
            axis.reserveSpaceDefault = (
                side === 0 ||
                side === 2 ||
                { 1: 'left', 3: 'right' }[side] === axis.labelAlign
            );
            if (pick(
                labelOptions.reserveSpace,
                axis.labelAlign === 'center' ? true : null,
                axis.reserveSpaceDefault)
            ) {
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
            }
            axis.labelOffset = labelOffset * (axis.opposite ? -1 : 1);

        } else { // doesn't have data
            objectEach(ticks, function (tick, n) {
                tick.destroy();
                delete ticks[n];
            });
        }

        if (
            axisTitleOptions &&
            axisTitleOptions.text &&
            axisTitleOptions.enabled !== false
        ) {
            axis.addTitle(showAxis);

            if (showAxis && axisTitleOptions.reserveSpace !== false) {
                axis.titleOffset = titleOffset =
                    axis.axisTitle.getBBox()[horiz ? 'height' : 'width'];
                titleOffsetOption = axisTitleOptions.offset;
                titleMargin = defined(titleOffsetOption) ?
                    0 :
                    pick(axisTitleOptions.margin, horiz ? 5 : 10);
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
            labelOffsetPadded += directionFactor * (
                horiz ?
                    pick(
                        labelOptions.y,
                        axis.tickRotCorr.y + directionFactor * 8
                    ) :
                    labelOptions.x
            );
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

        // Decide the clipping needed to keep the graph inside
        // the plot area and axis lines
        clip = options.offset ?
            0 :
            Math.floor(axis.axisLine.strokeWidth() / 2) * 2; // #4308, #4371
        clipOffset[invertedSide] = Math.max(clipOffset[invertedSide], clip);

        fireEvent(this, 'afterGetOffset');
    },

    /**
     * Internal function to get the path for the axis line. Extended for polar
     * charts.
     *
     * @function Highcharts.Axis#getLinePath
     *
     * @param  {number} lineWidth
     *         The line width in pixels.
     *
     * @return {Array<string|number>}
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
     *
     * @function Highcharts.Axis#renderLine
     *
     * @return {void}
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
     * @function Highcharts.Axis#getTitlePosition
     *
     * @return {Highcharts.AxisTitlePositionObject}
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
     * @function Highcharts.Axis#renderMinorTick
     *
     * @param  {number} pos
     *         The position in axis values.
     *
     * @return {void}
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
     * @function Highcharts.Axis#renderTick
     *
     * @param  {number} pos
     *         The position in axis values.
     *
     * @param  {number} i
     *         The tick index.
     *
     * @return {void}
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
                // In a categorized axis, the tick marks are displayed
                // between labels. So we need to add a tick mark and
                // grid line at the left edge of the X axis.
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
                    to = tickPositions[i + 1] !== undefined ?
                        tickPositions[i + 1] + tickmarkOffset :
                        axis.max - tickmarkOffset;

                    if (
                        i % 2 === 0 &&
                        pos < axis.max &&
                        to <= axis.max + (
                            chart.polar ?
                                -tickmarkOffset :
                                tickmarkOffset
                        )
                    ) { // #2248, #4660
                        if (!alternateBands[pos]) {
                            alternateBands[pos] = new H.PlotLineOrBand(axis);
                        }
                        from = pos + tickmarkOffset; // #949
                        alternateBands[pos].options = {
                            from: isLog ? axis.lin2log(from) : from,
                            to: isLog ? axis.lin2log(to) : to,
                            color: alternateGridColor
                        };
                        alternateBands[pos].render();
                        alternateBands[pos].isActive = true;
                    }
                });
            }

            // custom plot lines and bands
            if (!axis._addedPlotLB) { // only first time
                each(
                    (options.plotLines || []).concat(options.plotBands || []),
                    function (plotLineOptions) {
                        axis.addPlotBandOrLine(plotLineOptions);
                    }
                );
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
                        // When resizing rapidly, the same items
                        // may be destroyed in different timeouts,
                        // or the may be reactivated
                        if (
                            coll[forDestruction[i]] &&
                            !coll[forDestruction[i]].isActive
                        ) {
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
                coll === alternateBands ||
                    !chart.hasRendered ||
                    !delay ?
                        0 :
                        delay
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

        fireEvent(this, 'afterRender');
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
     * @function Highcharts.Axis#destroy
     *
     * @param  {boolean} keepEvents
     *         Whether to preserve events, used internally in Axis.update.
     *
     * @return {void}
     */
    destroy: function (keepEvents) {
        var axis = this,
            stacks = axis.stacks,
            plotLinesAndBands = axis.plotLinesAndBands,
            plotGroup,
            i;

        fireEvent(this, 'destroy', { keepEvents: keepEvents });

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
        each(
            [axis.ticks, axis.minorTicks, axis.alternateBands],
            function (coll) {
                destroyObjectProperties(coll);
            }
        );
        if (plotLinesAndBands) {
            i = plotLinesAndBands.length;
            while (i--) { // #1975
                plotLinesAndBands[i].destroy();
            }
        }

        // Destroy elements
        each(
            ['stackTotalGroup', 'axisLine', 'axisTitle', 'axisGroup',
                'gridGroup', 'labelGroup', 'cross', 'scrollbar'],
            function (prop) {
                if (axis[prop]) {
                    axis[prop] = axis[prop].destroy();
                }
            }
        );

        // Destroy each generated group for plotlines and plotbands
        for (plotGroup in axis.plotLinesAndBandsGroups) {
            axis.plotLinesAndBandsGroups[plotGroup] =
                axis.plotLinesAndBandsGroups[plotGroup].destroy();
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
     * @function Highcharts.Axis#drawCrosshair
     *
     * @param  {Highcharts.PointerEvent|undefined} [e]
     *         The event arguments from the modified pointer event, extended
     *         with `chartX` and `chartY`
     *
     * @param  {Highcharts.Point|undefined} [point]
     *         The Point object if the crosshair snaps to points.
     *
     * @return {void}
     *
     * @todo
     * Make events official: Fires the events `drawCrosshair` and
     * `afterDrawCrosshair`.
     */
    drawCrosshair: function (e, point) {

        var path,
            options = this.crosshair,
            snap = pick(options.snap, true),
            pos,
            categorized,
            graphic = this.cross;

        fireEvent(this, 'drawCrosshair', { e: e, point: point });

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
                pos = e &&
                    (
                        this.horiz ?
                            e.chartX - this.pos :
                            this.len - e.chartY + this.pos
                    );
            } else if (defined(point)) {
                // #3834
                pos = pick(
                    point.crosshairPos, // 3D axis extension
                    this.isXAxis ? point.plotX : this.len - point.plotY
                );
            }

            if (defined(pos)) {
                path = this.getPlotLinePath(
                    // First argument, value, only used on radial
                    point && (this.isXAxis ?
                        point.x :
                        pick(point.stackY, point.y)
                    ),
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
                    .addClass(
                        'highcharts-crosshair highcharts-crosshair-' +
                        (categorized ? 'category ' : 'thin ') +
                        options.className
                    )
                    .attr({
                        zIndex: pick(options.zIndex, 2)
                    })
                    .add();

                /*= if (build.classic) { =*/
                // Presentational attributes
                graphic.attr({
                    'stroke': options.color ||
                        (
                            categorized ?
                                color('${palette.highlightColor20}')
                                    .setOpacity(0.25).get() :
                                '${palette.neutralColor20}'
                        ),
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

        fireEvent(this, 'afterDrawCrosshair', { e: e, point: point });
    },

    /**
     * Hide the crosshair if visible.
     *
     * @function Highcharts.Axis#hideCrosshair
     *
     * @return {void}
     */
    hideCrosshair: function () {
        if (this.cross) {
            this.cross.hide();
        }
    }
}); // end Axis

H.Axis = Axis;
export default Axis;
