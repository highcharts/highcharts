/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Color.js';
import './Utilities.js';
import './Time.js';

var color = H.color,
    isTouchDevice = H.isTouchDevice,
    merge = H.merge,
    svg = H.svg;

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
     *
     * Default colors can also be set on a series or series.type basis,
     * see [column.colors](#plotOptions.column.colors),
     * [pie.colors](#plotOptions.pie.colors).
     *
     * In styled mode, the colors option doesn't exist. Instead, colors
     * are defined in CSS and applied either through series or point class
     * names, or through the [chart.colorCount](#chart.colorCount) option.
     *
     *
     * ### Legacy
     *
     * In Highcharts 3.x, the default colors were:
     *
     * <pre>colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
     *     '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']</pre>
     *
     * In Highcharts 2.x, the default colors were:
     *
     * <pre>colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
     *    '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92']</pre>
     *
     * @sample {highcharts} highcharts/chart/colors/
     *         Assign a global color theme
     *
     * @type       {Array<Highcharts.ColorString>}
     * @default    ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9",
     *             "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
     * @apioption  colors
     */
    colors: '${palette.colors}'.split(' '),
    /*= } =*/


    /**
     * Styled mode only. Configuration object for adding SVG definitions for
     * reusable elements. See [gradients, shadows and
     * patterns](https://www.highcharts.com/docs/chart-design-and-style/gradients-shadows-and-patterns)
     * for more information and code examples.
     *
     * @type       {*}
     * @since      5.0.0
     * @apioption  defs
     */

    /**
     * @ignore-option
     */
    symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],

    /**
     * The language object is global and it can't be set on each chart
     * initiation. Instead, use `Highcharts.setOptions` to set it before any
     * chart is initialized.
     *
     * <pre>Highcharts.setOptions({
     *     lang: {
     *         months: [
     *             'Janvier', 'Février', 'Mars', 'Avril',
     *             'Mai', 'Juin', 'Juillet', 'Août',
     *             'Septembre', 'Octobre', 'Novembre', 'Décembre'
     *         ],
     *         weekdays: [
     *             'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
     *             'Jeudi', 'Vendredi', 'Samedi'
     *         ]
     *     }
     * });</pre>
     *
     * @type       {*}
     * @apioption  lang
     */
    lang: {

        /**
         * The loading text that appears when the chart is set into the loading
         * state following a call to `chart.showLoading`.
         *
         * @type       {string}
         * @default    Loading...
         * @apioption  lang.loading
         */
        loading: 'Loading...',

        /**
         * An array containing the months names. Corresponds to the `%B` format
         * in `Highcharts.dateFormat()`.
         *
         * @type       {Array<string>}
         * @default    ["January", "February", "March", "April", "May", "June",
         *             "July", "August", "September", "October", "November",
         *             "December"]
         * @apioption  lang.months
         */
        months: [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ],

        /**
         * An array containing the months names in abbreviated form. Corresponds
         * to the `%b` format in `Highcharts.dateFormat()`.
         *
         * @type       {Array<string>}
         * @default    ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
         *             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
         * @apioption  lang.shortMonths
         */
        shortMonths: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],

        /**
         * An array containing the weekday names.
         *
         * @type       {Array<string>}
         * @default    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
         *             "Friday", "Saturday"]
         * @apioption  lang.weekdays
         */
        weekdays: [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ],

        /**
         * Short week days, starting Sunday. If not specified, Highcharts uses
         * the first three letters of the `lang.weekdays` option.
         *
         * @sample highcharts/lang/shortweekdays/
         *         Finnish two-letter abbreviations
         *
         * @type       {Array<string>}
         * @since      4.2.4
         * @apioption  lang.shortWeekdays
         */

        /**
         * What to show in a date field for invalid dates. Defaults to an empty
         * string.
         *
         * @type       {string}
         * @since      4.1.8
         * @product    highcharts highstock
         * @apioption  lang.invalidDate
         */

        /**
         * The title appearing on hovering the zoom in button. The text itself
         * defaults to "+" and can be changed in the button options.
         *
         * @type       {string}
         * @default    Zoom in
         * @product    highmaps
         * @apioption  lang.zoomIn
         */

        /**
         * The title appearing on hovering the zoom out button. The text itself
         * defaults to "-" and can be changed in the button options.
         *
         * @type       {string}
         * @default    Zoom out
         * @product    highmaps
         * @apioption  lang.zoomOut
         */

        /**
         * The default decimal point used in the `Highcharts.numberFormat`
         * method unless otherwise specified in the function arguments.
         *
         * @type       {string}
         * @default    .
         * @since      1.2.2
         * @apioption  lang.decimalPoint
         */
        decimalPoint: '.',

        /**
         * [Metric prefixes](http://en.wikipedia.org/wiki/Metric_prefix) used
         * to shorten high numbers in axis labels. Replacing any of the
         * positions with `null` causes the full number to be written. Setting
         * `numericSymbols` to `null` disables shortening altogether.
         *
         * @sample {highcharts} highcharts/lang/numericsymbols/
         *         Replacing the symbols with text
         * @sample {highstock} highcharts/lang/numericsymbols/
         *         Replacing the symbols with text
         *
         * @type       {Array<string>}
         * @default    ["k", "M", "G", "T", "P", "E"]
         * @since      2.3.0
         * @apioption  lang.numericSymbols
         */
        numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],

        /**
         * The magnitude of [numericSymbols](#lang.numericSymbol) replacements.
         * Use 10000 for Japanese, Korean and various Chinese locales, which
         * use symbols for 10^4, 10^8 and 10^12.
         *
         * @sample highcharts/lang/numericsymbolmagnitude/
         *         10000 magnitude for Japanese
         *
         * @type       {number}
         * @default    1000
         * @since      5.0.3
         * @apioption  lang.numericSymbolMagnitude
         */

        /**
         * The text for the label appearing when a chart is zoomed.
         *
         * @type       {string}
         * @default    Reset zoom
         * @since      1.2.4
         * @apioption  lang.resetZoom
         */
        resetZoom: 'Reset zoom',

        /**
         * The tooltip title for the label appearing when a chart is zoomed.
         *
         * @type       {string}
         * @default    Reset zoom level 1:1
         * @since      1.2.4
         * @apioption  lang.resetZoomTitle
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
         * @type       {string}
         * @default    \u0020
         * @since      1.2.2
         * @apioption  lang.thousandsSep
         */
        thousandsSep: ' '
    },

    /**
     * Global options that don't apply to each chart. These options, like
     * the `lang` options, must be set using the `Highcharts.setOptions`
     * method.
     *
     * <pre>Highcharts.setOptions({
     *     global: {
     *         useUTC: false
     *     }
     * });</pre>
     *
     */

    /**
     * _Canvg rendering for Android 2.x is removed as of Highcharts 5.0\.
     * Use the [libURL](#exporting.libURL) option to configure exporting._
     *
     * The URL to the additional file to lazy load for Android 2.x devices.
     * These devices don't support SVG, so we download a helper file that
     * contains [canvg](http://code.google.com/p/canvg/), its dependency
     * rbcolor, and our own CanVG Renderer class. To avoid hotlinking to
     * our site, you can install canvas-tools.js on your own server and
     * change this option accordingly.
     *
     * @deprecated
     * @type        {string}
     * @default     http://code.highcharts.com/{version}/modules/canvas-tools.js
     * @product     highcharts highmaps
     * @apioption   global.canvasToolsURL
     */

    /**
     * This option is deprecated since v6.0.5. Instead, use
     * [time.useUTC](#time.useUTC) that supports individual time settings
     * per chart.
     *
     * @deprecated
     * @type       {boolean}
     * @apioption  global.useUTC
     */

    /**
     * This option is deprecated since v6.0.5. Instead, use
     * [time.Date](#time.Date) that supports individual time settings
     * per chart.
     *
     * @deprecated
     * @type       {Function}
     * @product    highcharts highstock
     * @apioption  global.Date
     */

    /**
     * This option is deprecated since v6.0.5. Instead, use
     * [time.getTimezoneOffset](#time.getTimezoneOffset) that supports
     * individual time settings per chart.
     *
     * @deprecated
     * @type       {Function}
     * @product    highcharts highstock
     * @apioption  global.getTimezoneOffset
     */

    /**
     * This option is deprecated since v6.0.5. Instead, use
     * [time.timezone](#time.timezone) that supports individual time
     * settings per chart.
     *
     * @deprecated
     * @type       {string}
     * @product    highcharts highstock
     * @apioption  global.timezone
     */

    /**
     * This option is deprecated since v6.0.5. Instead, use
     * [time.timezoneOffset](#time.timezoneOffset) that supports individual
     * time settings per chart.
     *
     * @deprecated
     * @type       {number}
     * @product    highcharts highstock
     * @apioption  global.timezoneOffset
     */
    global: {},


    time: H.Time.prototype.defaultOptions,

    /**
     * General options for the chart.
     *
     * @type       {*}
     * @apioption  chart
     */
    chart: {

        /**
         * Default `mapData` for all series. If set to a string, it functions
         * as an index into the `Highcharts.maps` array. Otherwise it is
         * interpreted s map data.
         *
         * @see [mapData](#series.map.mapData)
         *
         * @type       {string|Array<*>}
         * @since      5.0.0
         * @product    highmaps
         * @apioption  chart.map
         */

        /**
         * Set lat/lon transformation definitions for the chart. If not defined,
         * these are extracted from the map data.
         *
         * @type       {*}
         * @since      5.0.0
         * @product    highmaps
         * @apioption  chart.mapTransforms
         */

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
         * @sample    {highcharts} highcharts/chart/alignticks-true/
         *            True by default
         * @sample    {highcharts} highcharts/chart/alignticks-false/
         *            False
         * @sample    {highstock} stock/chart/alignticks-true/
         *            True by default
         * @sample    {highstock} stock/chart/alignticks-false/
         *            False
         *
         * @type       {boolean}
         * @default    true
         * @product    highcharts highstock
         * @apioption  chart.alignTicks
         */

        /**
         * Set the overall animation for all chart updating. Animation can be
         * disabled throughout the chart by setting it to false here. It can
         * be overridden for each individual API method as a function parameter.
         * The only animation not affected by this option is the initial series
         * animation, see [plotOptions.series.animation](
         * #plotOptions.series.animation).
         *
         * The animation can either be set as a boolean or a configuration
         * object. If `true`, it will use the 'swing' jQuery easing and a
         * duration of 500 ms. If used as a configuration object, the following
         * properties are supported:
         *
         * <dl>
         *
         * <dt>duration</dt>
         *
         * <dd>The duration of the animation in milliseconds.</dd>
         *
         * <dt>easing</dt>
         *
         * <dd>A string reference to an easing function set on the `Math`
         * object. See [the easing
         * demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-animation-easing/).
         * </dd>
         *
         * </dl>
         *
         * @sample {highcharts} highcharts/chart/animation-none/
         *         Updating with no animation
         * @sample {highcharts} highcharts/chart/animation-duration/
         *         With a longer duration
         * @sample {highcharts} highcharts/chart/animation-easing/
         *         With a jQuery UI easing
         * @sample {highmaps} maps/chart/animation-none/
         *         Updating with no animation
         * @sample {highmaps} maps/chart/animation-duration/
         *         With a longer duration
         *
         * @type       {boolean|Highcharts.AnimationOptionsObject}
         * @default    true
         * @apioption  chart.animation
         */

        /**
         * A CSS class name to apply to the charts container `div`, allowing
         * unique CSS styling for each chart.
         *
         * @type       {string}
         * @apioption  chart.className
         */

        /**
         * Event listeners for the chart.
         *
         * @type       {*}
         * @apioption  chart.events
         */

        /**
         * Fires when a series is added to the chart after load time, using
         * the `addSeries` method. One parameter, `event`, is passed to the
         * function, containing common event information.
         * Through `event.options` you can access the series options that was
         * passed to the `addSeries` method. Returning false prevents the series
         * from being added.
         *
         * @sample {highcharts} highcharts/chart/events-addseries/
         *         Alert on add series
         * @sample {highstock} stock/chart/events-addseries/
         *         Alert on add series
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Highcharts.Chart
         * @apioption  chart.events.addSeries
         */

        /**
         * Fires when clicking on the plot background. One parameter, `event`,
         * is passed to the function, containing common event information.
         *
         * Information on the clicked spot can be found through `event.xAxis`
         * and `event.yAxis`, which are arrays containing the axes of each
         * dimension and each axis' value at the clicked spot. The primary axes
         * are `event.xAxis[0]` and `event.yAxis[0]`. Remember the unit of a
         * datetime axis is milliseconds since 1970-01-01 00:00:00.
         *
         * <pre>click: function(e) {
         *     console.log(
         *         Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', e.xAxis[0].value),
         *         e.yAxis[0].value
         *     )
         * }</pre>
         *
         * @sample {highcharts} highcharts/chart/events-click/
         *         Alert coordinates on click
         * @sample {highcharts} highcharts/chart/events-container/
         *         Alternatively, attach event to container
         * @sample {highstock} stock/chart/events-click/
         *         Alert coordinates on click
         * @sample {highstock} highcharts/chart/events-container/
         *         Alternatively, attach event to container
         * @sample {highmaps} maps/chart/events-click/
         *         Record coordinates on click
         * @sample {highmaps} highcharts/chart/events-container/
         *         Alternatively, attach event to container
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Highcharts.Chart
         * @apioption  chart.events.click
         */


        /**
         * Fires when the chart is finished loading. Since v4.2.2, it also waits
         * for images to be loaded, for example from point markers. One
         * parameter, `event`, is passed to the function, containing common
         * event information.
         *
         * There is also a second parameter to the chart constructor where a
         * callback function can be passed to be executed on chart.load.
         *
         * @sample {highcharts} highcharts/chart/events-load/
         *         Alert on chart load
         * @sample {highstock} stock/chart/events-load/
         *         Alert on chart load
         * @sample {highmaps} maps/chart/events-load/
         *         Add series on chart load
         *
         * @type       {Function}
         * @context    Highcharts.Chart
         * @apioption  chart.events.load
         */

        /**
         * Fires when the chart is redrawn, either after a call to
         * `chart.redraw()` or after an axis, series or point is modified with
         * the `redraw` option set to true. One parameter, `event`, is passed to
         * the function, containing common event information.
         *
         * @sample {highcharts} highcharts/chart/events-redraw/
         *         Alert on chart redraw
         * @sample {highstock} stock/chart/events-redraw/
         *         Alert on chart redraw when adding a series or moving the
         *         zoomed range
         * @sample {highmaps} maps/chart/events-redraw/
         *         Set subtitle on chart redraw
         *
         * @type       {Function}
         * @since      1.2.0
         * @context    Highcharts.Chart
         * @apioption  chart.events.redraw
         */

        /**
         * Fires after initial load of the chart (directly after the `load`
         * event), and after each redraw (directly after the `redraw` event).
         *
         * @type       {Function}
         * @since      5.0.7
         * @context    Highcharts.Chart
         * @apioption  chart.events.render
         */

        /**
         * Fires when an area of the chart has been selected. Selection is
         * enabled by setting the chart's zoomType. One parameter, `event`, is
         * passed to the function, containing common event information. The
         * default action for the selection event is to zoom the chart to the
         * selected area. It can be prevented by calling
         * `event.preventDefault()`.
         *
         * Information on the selected area can be found through `event.xAxis`
         * and `event.yAxis`, which are arrays containing the axes of each
         * dimension and each axis' min and max values. The primary axes are
         * `event.xAxis[0]` and `event.yAxis[0]`. Remember the unit of a
         * datetime axis is milliseconds since 1970-01-01 00:00:00.
         *
         * <pre>selection: function(event) {
         *     // log the min and max of the primary, datetime x-axis
         *     console.log(
         *         Highcharts.dateFormat(
         *             '%Y-%m-%d %H:%M:%S',
         *             event.xAxis[0].min
         *         ),
         *         Highcharts.dateFormat(
         *             '%Y-%m-%d %H:%M:%S',
         *             event.xAxis[0].max
         *         )
         *     );
         *     // log the min and max of the y axis
         *     console.log(event.yAxis[0].min, event.yAxis[0].max);
         * }</pre>
         *
         * @sample {highcharts} highcharts/chart/events-selection/
         *         Report on selection and reset
         * @sample {highcharts} highcharts/chart/events-selection-points/
         *         Select a range of points through a drag selection
         * @sample {highstock} stock/chart/events-selection/
         *         Report on selection and reset
         * @sample {highstock} highcharts/chart/events-selection-points/
         *         Select a range of points through a drag selection
         *         (Highcharts)
         *
         * @type       {Function}
         * @apioption  chart.events.selection
         */

        /**
         * The margin between the outer edge of the chart and the plot area.
         * The numbers in the array designate top, right, bottom and left
         * respectively. Use the options `marginTop`, `marginRight`,
         * `marginBottom` and `marginLeft` for shorthand setting of one option.
         *
         * By default there is no margin. The actual space is dynamically
         * calculated from the offset of axis labels, axis title, title,
         * subtitle and legend in addition to the `spacingTop`, `spacingRight`,
         * `spacingBottom` and `spacingLeft` options.
         *
         * @sample {highcharts} highcharts/chart/margins-zero/
         *         Zero margins
         * @sample {highstock} stock/chart/margin-zero/
         *         Zero margins
         *
         * @type       {number|Array<number>}
         * @apioption  chart.margin
         */

        /**
         * The margin between the bottom outer edge of the chart and the plot
         * area. Use this to set a fixed pixel value for the margin as opposed
         * to the default dynamic margin. See also `spacingBottom`.
         *
         * @sample {highcharts} highcharts/chart/marginbottom/
         *         100px bottom margin
         * @sample {highstock} stock/chart/marginbottom/
         *         100px bottom margin
         * @sample {highmaps} maps/chart/margin/
         *         100px margins
         *
         * @type       {number}
         * @since      2.0
         * @apioption  chart.marginBottom
         */

        /**
         * The margin between the left outer edge of the chart and the plot
         * area. Use this to set a fixed pixel value for the margin as opposed
         * to the default dynamic margin. See also `spacingLeft`.
         *
         * @sample {highcharts} highcharts/chart/marginleft/
         *         150px left margin
         * @sample {highstock} stock/chart/marginleft/
         *         150px left margin
         * @sample {highmaps} maps/chart/margin/
         *         100px margins
         *
         * @type       {number}
         * @since      2.0
         * @apioption  chart.marginLeft
         */

        /**
         * The margin between the right outer edge of the chart and the plot
         * area. Use this to set a fixed pixel value for the margin as opposed
         * to the default dynamic margin. See also `spacingRight`.
         *
         * @sample {highcharts} highcharts/chart/marginright/
         *         100px right margin
         * @sample {highstock} stock/chart/marginright/
         *         100px right margin
         * @sample {highmaps} maps/chart/margin/
         *         100px margins
         *
         * @type       {number}
         * @since      2.0
         * @apioption  chart.marginRight
         */

        /**
         * The margin between the top outer edge of the chart and the plot area.
         * Use this to set a fixed pixel value for the margin as opposed to
         * the default dynamic margin. See also `spacingTop`.
         *
         * @sample {highcharts} highcharts/chart/margintop/ 100px top margin
         * @sample {highstock} stock/chart/margintop/
         *         100px top margin
         * @sample {highmaps} maps/chart/margin/
         *         100px margins
         *
         * @type       {number}
         * @since      2.0
         * @apioption  chart.marginTop
         */

        /**
         * Allows setting a key to switch between zooming and panning. Can be
         * one of `alt`, `ctrl`, `meta` (the command key on Mac and Windows
         * key on Windows) or `shift`. The keys are mapped directly to the key
         * properties of the click event argument (`event.altKey`,
         * `event.ctrlKey`, `event.metaKey` and `event.shiftKey`).
         *
         * @type       {string}
         * @since      4.0.3
         * @product    highcharts
         * @validvalue ["alt", "ctrl", "meta", "shift"]
         * @apioption  chart.panKey
         */

        /**
         * Allow panning in a chart. Best used with [panKey](#chart.panKey)
         * to combine zooming and panning.
         *
         * On touch devices, when the [tooltip.followTouchMove](
         * #tooltip.followTouchMove) option is `true` (default), panning
         * requires two fingers. To allow panning with one finger, set
         * `followTouchMove` to `false`.
         *
         * @sample {highcharts} highcharts/chart/pankey/ Zooming and panning
         *
         * @type       {boolean}
         * @default    {highcharts} false
         * @default    {highstock} true
         * @since      4.0.3
         * @product    highcharts highstock
         * @apioption  chart.panning
         */


        /**
         * Equivalent to [zoomType](#chart.zoomType), but for multitouch
         * gestures only. By default, the `pinchType` is the same as the
         * `zoomType` setting. However, pinching can be enabled separately in
         * some cases, for example in stock charts where a mouse drag pans the
         * chart, while pinching is enabled. When [tooltip.followTouchMove](
         * #tooltip.followTouchMove) is true, pinchType only applies to
         * two-finger touches.
         *
         * @type       {string}
         * @default    {highcharts} undefined
         * @default    {highstock} x
         * @since      3.0
         * @product    highcharts highstock
         * @validvalue ["x", "y", "xy"]
         * @apioption  chart.pinchType
         */

        /**
         * The corner radius of the outer chart border.
         *
         * @sample {highcharts} highcharts/chart/borderradius/
         *         20px radius
         * @sample {highstock} stock/chart/border/
         *         10px radius
         * @sample {highmaps} maps/chart/border/
         *         Border options
         *
         * @type       {number}
         * @default    0
         * @apioption  chart.borderRadius
         */
        borderRadius: 0,
        /*= if (!build.classic) { =*/

        /**
         * In styled mode, this sets how many colors the class names
         * should rotate between. With ten colors, series (or points) are
         * given class names like `highcharts-color-0`, `highcharts-color-0`
         * [...] `highcharts-color-9`. The equivalent in non-styled mode
         * is to set colors using the [colors](#colors) setting.
         *
         * @type       {number}
         * @default    10
         * @since      5.0.0
         * @apioption  chart.colorCount
         */
        colorCount: 10,
        /*= } =*/

        /**
         * Alias of `type`.
         *
         * @sample {highcharts} highcharts/chart/defaultseriestype/
         *         Bar
         *
         * @deprecated
         * @type       {string}
         * @default    line
         * @product    highcharts
         * @apioption  chart.defaultSeriesType
         */
        defaultSeriesType: 'line',

        /**
         * If true, the axes will scale to the remaining visible series once
         * one series is hidden. If false, hiding and showing a series will
         * not affect the axes or the other series. For stacks, once one series
         * within the stack is hidden, the rest of the stack will close in
         * around it even if the axis is not affected.
         *
         * @sample {highcharts} highcharts/chart/ignorehiddenseries-true/
         *         True by default
         * @sample {highcharts} highcharts/chart/ignorehiddenseries-false/
         *         False
         * @sample {highcharts} highcharts/chart/ignorehiddenseries-true-stacked/
         *         True with stack
         * @sample {highstock} stock/chart/ignorehiddenseries-true/
         *         True by default
         * @sample {highstock} stock/chart/ignorehiddenseries-false/
         *         False
         *
         * @type       {boolean}
         * @default    true
         * @since      1.2.0
         * @product    highcharts highstock
         * @apioption  chart.ignoreHiddenSeries
         */
        ignoreHiddenSeries: true,


        /**
         * Whether to invert the axes so that the x axis is vertical and y axis
         * is horizontal. When `true`, the x axis is [reversed](#xAxis.reversed)
         * by default.
         *
         * @productdesc {highcharts}
         * If a bar series is present in the chart, it will be inverted
         * automatically. Inverting the chart doesn't have an effect if there
         * are no cartesian series in the chart, or if the chart is
         * [polar](#chart.polar).
         *
         * @sample {highcharts} highcharts/chart/inverted/
         *         Inverted line
         * @sample {highstock} stock/navigator/inverted/
         *         Inverted stock chart
         *
         * @type       {boolean}
         * @default    false
         * @product    highcharts highstock
         * @apioption  chart.inverted
         */

        /**
         * The distance between the outer edge of the chart and the content,
         * like title or legend, or axis title and labels if present. The
         * numbers in the array designate top, right, bottom and left
         * respectively. Use the options spacingTop, spacingRight, spacingBottom
         * and spacingLeft options for shorthand setting of one option.
         *
         * @type       {Array<number>}
         * @see        [chart.margin](#chart.margin)
         * @default    [10, 10, 15, 10]
         * @since      3.0.6
         * @apioption  chart.spacing
         */
        spacing: [10, 10, 15, 10],

        /**
         * The button that appears after a selection zoom, allowing the user
         * to reset zoom.
         *
         * @type       {*}
         * @apioption  chart.resetZoomButton
         */
        resetZoomButton: {

            /**
             * What frame the button should be placed related to. Can be either
             * `plot` or `chart`
             *
             * @sample {highcharts} highcharts/chart/resetzoombutton-relativeto/
             *         Relative to the chart
             * @sample {highstock} highcharts/chart/resetzoombutton-relativeto/
             *         Relative to the chart
             *
             * @type       {string}
             * @default    plot
             * @since      2.2
             * @validvalue ["plot", "chart"]
             * @apioption  chart.resetZoomButton.relativeTo
             */

            /**
             * A collection of attributes for the button. The object takes SVG
             * attributes like `fill`, `stroke`, `stroke-width` or `r`, the
             * border radius. The theme also supports `style`, a collection of
             * CSS properties for the text. Equivalent attributes for the hover
             * state are given in `theme.states.hover`.
             *
             * @sample {highcharts} highcharts/chart/resetzoombutton-theme/
             *         Theming the button
             * @sample {highstock} highcharts/chart/resetzoombutton-theme/
             *         Theming the button
             *
             * @type       {*}
             * @since      2.2
             * @apioption  chart.resetZoomButton.theme
             */
            theme: {

                /**
                 * The Z index for the reset zoom button. The default value
                 * places it below the tooltip that has Z index 7.
                 *
                 * @type       {number}
                 * @apioption  chart.resetZoomButton.theme.zIndex
                 */
                zIndex: 6
            },

            /**
             * The position of the button.
             *
             * @sample {highcharts} highcharts/chart/resetzoombutton-position/
             *         Above the plot area
             * @sample {highstock} highcharts/chart/resetzoombutton-position/
             *         Above the plot area
             * @sample {highmaps} highcharts/chart/resetzoombutton-position/
             *         Above the plot area
             *
             * @type       {*}
             * @since      2.2
             * @apioption  chart.resetZoomButton.position
             */
            position: {

                /**
                 * The horizontal alignment of the button.
                 *
                 * @type       {string}
                 * @apioption  chart.resetZoomButton.position.align
                 */
                align: 'right',

                /**
                 * The horizontal offset of the button.
                 *
                 * @type       {number}
                 * @apioption  chart.resetZoomButton.position.x
                 */
                x: -10,

                /**
                 * The vertical alignment of the button.
                 *
                 * @type       {string}
                 * @default    top
                 * @validvalue ["top", "middle", "bottom"]
                 * @apioption  chart.resetZoomButton.position.verticalAlign
                 */

                /**
                 * The vertical offset of the button.
                 *
                 * @type       {number}
                 * @apioption  chart.resetZoomButton.position.y
                 */
                y: 10
            }
        },

        /**
         * The pixel width of the plot area border.
         *
         * @sample {highcharts} highcharts/chart/plotborderwidth/
         *         1px border
         * @sample {highstock} stock/chart/plotborder/
         *         2px border
         * @sample {highmaps} maps/chart/plotborder/
         *         Plot border options
         *
         * @type       {number}
         * @default    0
         * @apioption  chart.plotBorderWidth
         */

        /**
         * Whether to apply a drop shadow to the plot area. Requires that
         * plotBackgroundColor be set. The shadow can be an object configuration
         * containing `color`, `offsetX`, `offsetY`, `opacity` and `width`.
         *
         * @sample {highcharts} highcharts/chart/plotshadow/
         *         Plot shadow
         * @sample {highstock} stock/chart/plotshadow/
         *         Plot shadow
         * @sample {highmaps} maps/chart/plotborder/
         *         Plot border options
         *
         * @type       {boolean|Highcharts.CSSObject}
         * @default    false
         * @apioption  chart.plotShadow
         */

        /**
         * When true, cartesian charts like line, spline, area and column are
         * transformed into the polar coordinate system. Requires
         * `highcharts-more.js`.
         *
         * @sample {highcharts} highcharts/demo/polar/
         *         Polar chart
         * @sample {highcharts} highcharts/demo/polar-wind-rose/
         *         Wind rose, stacked polar column chart
         * @sample {highcharts} highcharts/demo/polar-spider/
         *         Spider web chart
         * @sample {highcharts} highcharts/parallel-coordinates/polar/
         *         Star plot, multivariate data in a polar chart
         *
         * @type       {boolean}
         * @default    false
         * @since      2.3.0
         * @product    highcharts
         * @apioption  chart.polar
         */

        /**
         * Whether to reflow the chart to fit the width of the container div
         * on resizing the window.
         *
         * @sample {highcharts} highcharts/chart/reflow-true/
         *         True by default
         * @sample {highcharts} highcharts/chart/reflow-false/
         *         False
         * @sample {highstock} stock/chart/reflow-true/
         *         True by default
         * @sample {highstock} stock/chart/reflow-false/
         *         False
         * @sample {highmaps} maps/chart/reflow-true/
         *         True by default
         * @sample {highmaps} maps/chart/reflow-false/
         *         False
         *
         * @type       {boolean}
         * @default    true
         * @since      2.1
         * @apioption  chart.reflow
         */

        /**
         * The HTML element where the chart will be rendered. If it is a string,
         * the element by that id is used. The HTML element can also be passed
         * by direct reference, or as the first argument of the chart
         * constructor, in which case the option is not needed.
         *
         * @sample {highcharts} highcharts/chart/reflow-true/
         *         String
         * @sample {highcharts} highcharts/chart/renderto-object/
         *         Object reference
         * @sample {highcharts} highcharts/chart/renderto-jquery/
         *         Object reference through jQuery
         * @sample {highstock} stock/chart/renderto-string/
         *         String
         * @sample {highstock} stock/chart/renderto-object/
         *         Object reference
         * @sample {highstock} stock/chart/renderto-jquery/
         *         Object reference through jQuery
         *
         * @type       {string|Highcharts.SVGDOMElement}
         * @apioption  chart.renderTo
         */

        /**
         * The background color of the marker square when selecting (zooming
         * in on) an area of the chart.
         *
         * @see In styled mode, the selection marker fill is set with the
         *      `.highcharts-selection-marker` class.
         *
         * @type       {Highcharts.ColorString}
         * @default    rgba(51,92,173,0.25)
         * @since      2.1.7
         * @apioption  chart.selectionMarkerFill
         */

        /**
         * Whether to apply a drop shadow to the outer chart area. Requires
         * that backgroundColor be set. The shadow can be an object
         * configuration containing `color`, `offsetX`, `offsetY`, `opacity` and
         * `width`.
         *
         * @sample {highcharts} highcharts/chart/shadow/
         *         Shadow
         * @sample {highstock} stock/chart/shadow/
         *         Shadow
         * @sample {highmaps} maps/chart/border/
         *         Chart border and shadow
         *
         * @type       {boolean|Highcharts.CSSObject}
         * @default    false
         * @apioption  chart.shadow
         */

        /**
         * Whether to show the axes initially. This only applies to empty charts
         * where series are added dynamically, as axes are automatically added
         * to cartesian series.
         *
         * @sample {highcharts} highcharts/chart/showaxes-false/
         *         False by default
         * @sample {highcharts} highcharts/chart/showaxes-true/
         *         True
         *
         * @type       {boolean}
         * @since      1.2.5
         * @product    highcharts
         * @apioption  chart.showAxes
         */

        /**
         * The space between the bottom edge of the chart and the content (plot
         * area, axis title and labels, title, subtitle or legend in top
         * position).
         *
         * @sample {highcharts} highcharts/chart/spacingbottom/
         *         Spacing bottom set to 100
         * @sample {highstock} stock/chart/spacingbottom/
         *         Spacing bottom set to 100
         * @sample {highmaps} maps/chart/spacing/
         *         Spacing 100 all around
         *
         * @type       {number}
         * @default    15
         * @since      2.1
         * @apioption  chart.spacingBottom
         */

        /**
         * The space between the left edge of the chart and the content (plot
         * area, axis title and labels, title, subtitle or legend in top
         * position).
         *
         * @sample {highcharts} highcharts/chart/spacingleft/
         *         Spacing left set to 100
         * @sample {highstock} stock/chart/spacingleft/
         *         Spacing left set to 100
         * @sample {highmaps} maps/chart/spacing/
         *         Spacing 100 all around
         *
         * @type      {number}
         * @default   10
         * @since     2.1
         * @apioption chart.spacingLeft
         */

        /**
         * The space between the right edge of the chart and the content (plot
         * area, axis title and labels, title, subtitle or legend in top
         * position).
         *
         * @sample {highcharts} highcharts/chart/spacingright-100/
         *         Spacing set to 100
         * @sample {highcharts} highcharts/chart/spacingright-legend/
         *         Legend in right position with default spacing
         * @sample {highstock} stock/chart/spacingright/
         *         Spacing set to 100
         * @sample {highmaps} maps/chart/spacing/
         *         Spacing 100 all around
         *
         * @type       {number}
         * @default    10
         * @since      2.1
         * @apioption  chart.spacingRight
         */

        /**
         * The space between the top edge of the chart and the content (plot
         * area, axis title and labels, title, subtitle or legend in top
         * position).
         *
         * @sample {highcharts} highcharts/chart/spacingtop-100/
         *         A top spacing of 100
         * @sample {highcharts} highcharts/chart/spacingtop-10/
         *         Floating chart title makes the plot area align to the default
         *         spacingTop of 10.
         * @sample {highstock} stock/chart/spacingtop/
         *         A top spacing of 100
         * @sample {highmaps} maps/chart/spacing/
         *         Spacing 100 all around
         *
         * @type       {number}
         * @default    10
         * @since      2.1
         * @apioption  chart.spacingTop
         */

        /**
         * Additional CSS styles to apply inline to the container `div`. Note
         * that since the default font styles are applied in the renderer, it
         * is ignorant of the individual chart options and must be set globally.
         *
         * @see    In styled mode, general chart styles can be set with the
         *         `.highcharts-root` class.
         * @sample {highcharts} highcharts/chart/style-serif-font/
         *         Using a serif type font
         * @sample {highcharts} highcharts/css/em/
         *         Styled mode with relative font sizes
         * @sample {highstock} stock/chart/style/
         *         Using a serif type font
         * @sample {highmaps} maps/chart/style-serif-font/
         *         Using a serif type font
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"fontFamily": "\"Lucida Grande\", \"Lucida Sans Unicode\", Verdana, Arial, Helvetica, sans-serif","fontSize":"12px"}
         * @apioption  chart.style
         */

        /**
         * The default series type for the chart. Can be any of the chart types
         * listed under [plotOptions](#plotOptions).
         *
         * @sample {highcharts} highcharts/chart/type-bar/
         *         Bar
         * @sample {highstock} stock/chart/type/
         *         Areaspline
         * @sample {highmaps} maps/chart/type-mapline/
         *         Mapline
         *
         * @type       {string}
         * @default    {highcharts} line
         * @default    {highstock} line
         * @default    {highmaps} map
         * @since      2.1.0
         * @validvalue ["line", "spline", "column", "bar", "area", "areaspline",
         *             "pie", "arearange", "areasplinerange", "boxplot",
         *             "bubble", "columnrange", "errorbar", "funnel", "gauge",
         *             "heatmap", "polygon", "pyramid", "scatter", "solidgauge",
         *             "treemap", "waterfall"]
         * @apioption  chart.type
         */

        /**
         * Decides in what dimensions the user can zoom by dragging the mouse.
         * Can be one of `x`, `y` or `xy`.
         *
         * @see [panKey](#chart.panKey)
         *
         * @sample {highcharts} highcharts/chart/zoomtype-none/
         *         None by default
         * @sample {highcharts} highcharts/chart/zoomtype-x/
         *         X
         * @sample {highcharts} highcharts/chart/zoomtype-y/
         *         Y
         * @sample {highcharts} highcharts/chart/zoomtype-xy/
         *         Xy
         * @sample {highstock} stock/demo/basic-line/
         *         None by default
         * @sample {highstock} stock/chart/zoomtype-x/
         *         X
         * @sample {highstock} stock/chart/zoomtype-y/
         *         Y
         * @sample {highstock} stock/chart/zoomtype-xy/
         *         Xy
         *
         * @type       {string}
         * @product    highcharts highstock
         * @validvalue ["x", "y", "xy"]
         * @apioption  chart.zoomType
         */

        /**
         * An explicit width for the chart. By default (when `null`) the width
         * is calculated from the offset width of the containing element.
         *
         * @sample {highcharts} highcharts/chart/width/
         *         800px wide
         * @sample {highstock} stock/chart/width/
         *         800px wide
         * @sample {highmaps} maps/chart/size/
         *         Chart with explicit size
         *
         * @type       {number|null}
         * @default    null
         * @apioption  chart.width
         */
        width: null,

        /**
         * An explicit height for the chart. If a _number_, the height is
         * given in pixels. If given a _percentage string_ (for example
         * `'56%'`), the height is given as the percentage of the actual chart
         * width. This allows for preserving the aspect ratio across responsive
         * sizes.
         *
         * By default (when `null`) the height is calculated from the offset
         * height of the containing element, or 400 pixels if the containing
         * element's height is 0.
         *
         * @sample {highcharts} highcharts/chart/height/
         *         500px height
         * @sample {highstock} stock/chart/height/
         *         300px height
         * @sample {highmaps} maps/chart/size/
         *         Chart with explicit size
         * @sample highcharts/chart/height-percent/
         *         Highcharts with percentage height
         *
         * @type       {number|string|null}
         * @default    null
         * @apioption  chart.height
         */
        height: null,

        /*= if (build.classic) { =*/

        /**
         * The color of the outer chart border.
         *
         * @see In styled mode, the stroke is set with the
         *      `.highcharts-background` class.
         *
         * @sample {highcharts} highcharts/chart/bordercolor/
         *         Brown border
         * @sample {highstock} stock/chart/border/
         *         Brown border
         * @sample {highmaps} maps/chart/border/
         *         Border options
         *
         * @type       {Highcharts.ColorString}
         * @default    #335cad
         * @apioption  chart.borderColor
         */
        borderColor: '${palette.highlightColor80}',

        /**
         * The pixel width of the outer chart border.
         *
         * @see In styled mode, the stroke is set with the
         *      `.highcharts-background` class.
         *
         * @sample {highcharts} highcharts/chart/borderwidth/
         *         5px border
         * @sample {highstock} stock/chart/border/
         *         2px border
         * @sample {highmaps} maps/chart/border/
         *         Border options
         *
         * @type       {number}
         * @default    0
         * @apioption  chart.borderWidth
         */

        /**
         * The background color or gradient for the outer chart area.
         *
         * @see In styled mode, the background is set with the
         *      `.highcharts-background` class.
         *
         * @sample {highcharts} highcharts/chart/backgroundcolor-color/
         *         Color
         * @sample {highcharts} highcharts/chart/backgroundcolor-gradient/
         *         Gradient
         * @sample {highstock} stock/chart/backgroundcolor-color/
         *         Color
         * @sample {highstock} stock/chart/backgroundcolor-gradient/
         *         Gradient
         * @sample {highmaps} maps/chart/backgroundcolor-color/
         *         Color
         * @sample {highmaps} maps/chart/backgroundcolor-gradient/
         *         Gradient
         *
         * @type       {Highcharts.ColorString}
         * @default    #FFFFFF
         * @apioption  chart.backgroundColor
         */
        backgroundColor: '${palette.backgroundColor}',

        /**
         * The background color or gradient for the plot area.
         *
         * @see In styled mode, the plot background is set with the
         *      `.highcharts-plot-background` class.
         *
         * @sample {highcharts} highcharts/chart/plotbackgroundcolor-color/
         *         Color
         * @sample {highcharts} highcharts/chart/plotbackgroundcolor-gradient/
         *         Gradient
         * @sample {highstock} stock/chart/plotbackgroundcolor-color/
         *         Color
         * @sample {highstock} stock/chart/plotbackgroundcolor-gradient/
         *         Gradient
         * @sample {highmaps} maps/chart/plotbackgroundcolor-color/
         *         Color
         * @sample {highmaps} maps/chart/plotbackgroundcolor-gradient/
         *         Gradient
         *
         * @type       {Highcharts.ColorString}
         * @apioption  chart.plotBackgroundColor
         */


        /**
         * The URL for an image to use as the plot background. To set an image
         * as the background for the entire chart, set a CSS background image
         * to the container element. Note that for the image to be applied to
         * exported charts, its URL needs to be accessible by the export server.
         *
         * @see In styled mode, a plot background image can be set with the
         *      `.highcharts-plot-background` class and a [custom pattern](
         *      https://www.highcharts.com/docs/chart-design-and-style/
         *      gradients-shadows-and-patterns).
         *
         * @sample {highcharts} highcharts/chart/plotbackgroundimage/
         *         Skies
         * @sample {highstock} stock/chart/plotbackgroundimage/
         *         Skies
         *
         * @type       {string}
         * @apioption  chart.plotBackgroundImage
         */

        /**
         * The color of the inner chart or plot area border.
         *
         * @see In styled mode, a plot border stroke can be set with the
         *      `.highcharts-plot-border` class.
         *
         * @sample {highcharts} highcharts/chart/plotbordercolor/
         *         Blue border
         * @sample {highstock} stock/chart/plotborder/
         *         Blue border
         * @sample {highmaps} maps/chart/plotborder/
         *         Plot border options
         *
         * @type       {Highcharts.ColorString}
         * @default    #cccccc
         * @apioption  chart.plotBorderColor
         */
        plotBorderColor: '${palette.neutralColor20}'
        /*= } =*/

    },

    /**
     * The chart's main title.
     *
     * @sample {highmaps} maps/title/title/
     *         Title options demonstrated
     *
     * @type       {*}
     * @apioption  title
     */
    title: {

        /**
         * When the title is floating, the plot area will not move to make space
         * for it.
         *
         * @sample {highcharts} highcharts/chart/zoomtype-none/
         *         False by default
         * @sample {highcharts} highcharts/title/floating/
         *         True - title on top of the plot area
         * @sample {highstock} stock/chart/title-floating/
         *         True - title on top of the plot area
         *
         * @type       {boolean}
         * @default    false
         * @since      2.1
         * @apioption  title.floating
         */

        /**
         * CSS styles for the title. Use this for font styling, but use `align`,
         * `x` and `y` for text alignment.
         *
         * In styled mode, the title style is given in the `.highcharts-title`
         * class.
         *
         * @sample {highcharts} highcharts/title/style/
         *         Custom color and weight
         * @sample {highstock} stock/chart/title-style/
         *         Custom color and weight
         * @sample highcharts/css/titles/
         *         Styled mode
         *
         * @type       {Highcharts.CSSObject}
         * @default    {highcharts|highmaps} { "color": "#333333", "fontSize": "18px" }
         * @default    {highstock} { "color": "#333333", "fontSize": "16px" }
         * @apioption  title.style
         */

        /**
         * Whether to
         * [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
         * to render the text.
         *
         * @type       {boolean}
         * @default    false
         * @apioption  title.useHTML
         */

        /**
         * The vertical alignment of the title. Can be one of `"top"`,
         * `"middle"` and `"bottom"`. When a value is given, the title behaves
         * as if [floating](#title.floating) were `true`.
         *
         * @sample {highcharts} highcharts/title/verticalalign/
         *         Chart title in bottom right corner
         * @sample {highstock} stock/chart/title-verticalalign/
         *         Chart title in bottom right corner
         *
         * @type        {string}
         * @since       2.1
         * @validvalue  ["top", "middle", "bottom"]
         * @apioption   title.verticalAlign
         */

        /**
         * The x position of the title relative to the alignment within
         * `chart.spacingLeft` and `chart.spacingRight`.
         *
         * @sample {highcharts} highcharts/title/align/
         *         Aligned to the plot area (x = 70px = margin left - spacing
         *         left)
         * @sample {highstock} stock/chart/title-align/
         *         Aligned to the plot area (x = 50px = margin left - spacing
         *         left)
         *
         * @type       {number}
         * @default    0
         * @since      2.0
         * @apioption  title.x
         */

        /**
         * The y position of the title relative to the alignment within
         * [chart.spacingTop](#chart.spacingTop) and [chart.spacingBottom](
         * #chart.spacingBottom). By default it depends on the font size.
         *
         * @sample {highcharts} highcharts/title/y/
         *         Title inside the plot area
         * @sample {highstock} stock/chart/title-verticalalign/
         *         Chart title in bottom right corner
         *
         * @type       {number}
         * @since      2.0
         * @apioption  title.y
         */

        /**
         * The title of the chart. To disable the title, set the `text` to
         * `undefined`.
         *
         * @sample {highcharts} highcharts/title/text/
         *         Custom title
         * @sample {highstock} stock/chart/title-text/
         *         Custom title
         *
         * @type       {string}
         * @default    {highcharts|highmaps} Chart title
         * @default    {highstock} undefined
         * @apioption  title.text
         */
        text: 'Chart title',

        /**
         * The horizontal alignment of the title. Can be one of "left", "center"
         * and "right".
         *
         * @sample {highcharts} highcharts/title/align/
         *         Aligned to the plot area (x = 70px = margin left - spacing
         *         left)
         * @sample {highstock} stock/chart/title-align/
         *         Aligned to the plot area (x = 50px = margin left - spacing
         *         left)
         *
         * @type       {string}
         * @default    center
         * @since      2.0
         * @validvalue ["left", "center", "right"]
         * @apioption  title.align
         */
        align: 'center',

        /**
         * The margin between the title and the plot area, or if a subtitle
         * is present, the margin between the subtitle and the plot area.
         *
         * @sample {highcharts} highcharts/title/margin-50/
         *         A chart title margin of 50
         * @sample {highcharts} highcharts/title/margin-subtitle/
         *         The same margin applied with a subtitle
         * @sample {highstock} stock/chart/title-margin/
         *         A chart title margin of 50
         *
         * @type       {number}
         * @default    15
         * @since      2.1
         * @apioption  title.margin
         */
        margin: 15,

        /**
         * Adjustment made to the title width, normally to reserve space for
         * the exporting burger menu.
         *
         * @sample highcharts/title/widthadjust/
         *         Wider menu, greater padding
         *
         * @type       {number}
         * @default    -44
         * @since      4.2.5
         * @apioption  title.margin
         */
        widthAdjust: -44

    },

    /**
     * The chart's subtitle. This can be used both to display a subtitle below
     * the main title, and to display random text anywhere in the chart. The
     * subtitle can be updated after chart initialization through the
     * `Chart.setTitle` method.
     *
     * @sample {highmaps} maps/title/subtitle/
     *         Subtitle options demonstrated
     *
     * @type       {*}
     * @apioption  subtitle
     */
    subtitle: {

        /**
         * When the subtitle is floating, the plot area will not move to make
         * space for it.
         *
         * @sample {highcharts} highcharts/subtitle/floating/
         *         Floating title and subtitle
         * @sample {highstock} stock/chart/subtitle-footnote
         *         Footnote floating at bottom right of plot area
         *
         * @type       {boolean}
         * @default    false
         * @since      2.1
         * @apioption  subtitle.floating
         */

        /**
         * CSS styles for the title.
         *
         * In styled mode, the subtitle style is given in the
         * `.highcharts-subtitle` class.
         *
         * @sample {highcharts} highcharts/subtitle/style/
         *         Custom color and weight
         * @sample {highcharts} highcharts/css/titles/
         *         Styled mode
         * @sample {highstock} stock/chart/subtitle-style
         *         Custom color and weight
         * @sample {highstock} highcharts/css/titles/
         *         Styled mode
         * @sample {highmaps} highcharts/css/titles/
         *         Styled mode
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "#666666"}
         * @apioption  subtitle.style
         */

        /**
         * Whether to
         * [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
         * to render the text.
         *
         * @type       {boolean}
         * @default    false
         * @apioption  subtitle.useHTML
         */

        /**
         * The vertical alignment of the title. Can be one of "top", "middle"
         * and "bottom". When a value is given, the title behaves as floating.
         *
         * @sample {highcharts} highcharts/subtitle/verticalalign/
         *         Footnote at the bottom right of plot area
         * @sample {highstock} stock/chart/subtitle-footnote
         *         Footnote at the bottom right of plot area
         *
         * @type       {string}
         * @since      2.1
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  subtitle.verticalAlign
         */

        /**
         * The x position of the subtitle relative to the alignment within
         * `chart.spacingLeft` and `chart.spacingRight`.
         *
         * @sample {highcharts} highcharts/subtitle/align/
         *         Footnote at right of plot area
         * @sample {highstock} stock/chart/subtitle-footnote
         *         Footnote at the bottom right of plot area
         *
         * @type       {number}
         * @default    0
         * @since      2.0
         * @apioption  subtitle.x
         */

        /**
         * The y position of the subtitle relative to the alignment within
         * `chart.spacingTop` and `chart.spacingBottom`. By default the subtitle
         * is laid out below the title unless the title is floating.
         *
         * @sample {highcharts} highcharts/subtitle/verticalalign/
         *         Footnote at the bottom right of plot area
         * @sample {highstock} stock/chart/subtitle-footnote
         *         Footnote at the bottom right of plot area
         *
         * @type       {number}
         * @since      2.0
         * @apioption  subtitle.y
         */

        /**
         * The subtitle of the chart.
         *
         * @sample {highcharts|highstock} highcharts/subtitle/text/
         *         Custom subtitle
         * @sample {highcharts|highstock} highcharts/subtitle/text-formatted/
         *         Formatted and linked text.
         *
         * @type       {string}
         * @apioption  subtitle.text
         */
        text: '',

        /**
         * The horizontal alignment of the subtitle. Can be one of "left",
         *  "center" and "right".
         *
         * @sample {highcharts} highcharts/subtitle/align/
         *         Footnote at right of plot area
         * @sample {highstock} stock/chart/subtitle-footnote
         *         Footnote at bottom right of plot area
         *
         * @type       {string}
         * @default    center
         * @since      2.0
         * @validvalue ["left", "center", "right"]
         * @apioption  subtitle.align
         */
        align: 'center',

        /**
         * Adjustment made to the subtitle width, normally to reserve space
         * for the exporting burger menu.
         *
         * @see [title.widthAdjust](#title.widthAdjust)
         *
         * @sample highcharts/title/widthadjust/
         *         Wider menu, greater padding
         *
         * @type       {number}
         * @default    -44
         * @since      4.2.5
         * @apioption  subtitle.widthAdjust
         */
        widthAdjust: -44
    },

    /**
     * The plotOptions is a wrapper object for config objects for each series
     * type. The config objects for each series can also be overridden for
     * each series item as given in the series array.
     *
     * Configuration options for the series are given in three levels. Options
     * for all series in a chart are given in the [plotOptions.series](
     * #plotOptions.series) object. Then options for all series of a specific
     * type are given in the plotOptions of that type, for example
     * `plotOptions.line`. Next, options for one single series are given in
     * [the series array](#series).
     *
     * @type       {*}
     * @apioption  plotOptions
     */
    plotOptions: {},

    /**
     * HTML labels that can be positioned anywhere in the chart area.
     *
     * @type       {*}
     * @apioption  labels
     */
    labels: {

        /**
         * An HTML label that can be positioned anywhere in the chart area.
         *
         * @type       {Array<*>}
         * @apioption  labels.items
         */

        /**
         * Inner HTML or text for the label.
         *
         * @type       {string}
         * @apioption  labels.items.html
         */

        /**
         * CSS styles for each label. To position the label, use left and top
         * like this:
         *
         * <pre>style: {
         *     left: '100px',
         *     top: '100px'
         * }</pre>
         *
         * @type       {Highcharts.CSSObject}
         * @apioption  labels.items.style
         */

        /**
         * Shared CSS styles for all labels.
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "#333333"}
         * @apioption  labels.style
         */
        style: {
            position: 'absolute',
            color: '${palette.neutralColor80}'
        }
    },

    /**
     * The legend is a box containing a symbol and name for each series
     * item or point item in the chart. Each series (or points in case
     * of pie charts) is represented by a symbol and its name in the legend.
     *
     * It is possible to override the symbol creator function and create
     * [custom legend symbols](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/studies/legend-custom-symbol/).
     *
     * @productdesc {highmaps}
     * A Highmaps legend by default contains one legend item per series, but if
     * a `colorAxis` is defined, the axis will be displayed in the legend.
     * Either as a gradient, or as multiple legend items for `dataClasses`.
     *
     * @type       {*}
     * @apioption  legend
     */
    legend: {

        /**
         * The background color of the legend.
         *
         * @see In styled mode, the legend background fill can be applied with
         *      the `.highcharts-legend-box` class.
         *
         * @sample {highcharts} highcharts/legend/backgroundcolor/
         *         Yellowish background
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/border-background/
         *         Border and background options
         *
         * @type       {Highcharts.ColorString}
         * @apioption  legend.backgroundColor
         */

        /**
         * The width of the drawn border around the legend.
         *
         * @see In styled mode, the legend border stroke width can be applied
         *      with the `.highcharts-legend-box` class.
         *
         * @sample {highcharts} highcharts/legend/borderwidth/
         *         2px border width
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/border-background/
         *         Border and background options
         *
         * @type       {number}
         * @default    0
         * @apioption  legend.borderWidth
         */

        /**
         * Enable or disable the legend.
         *
         * @sample {highcharts} highcharts/legend/enabled-false/ Legend disabled
         * @sample {highstock} stock/legend/align/ Various legend options
         * @sample {highmaps} maps/legend/enabled-false/ Legend disabled
         *
         * @type       {boolean}
         * @default    {highstock} false
         * @default    {highmaps} true
         * @apioption  legend.enabled
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
         * @sample {highcharts} highcharts/legend/align/
         *         Legend at the right of the chart
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/alignment/
         *         Legend alignment
         *
         * @type       {string}
         * @since      2.0
         * @validvalue ["left", "center", "right"]
         * @apioption  legend.align
         */
        align: 'center',

        /**
         * If the [layout](legend.layout) is `horizontal` and the legend items
         * span over two lines or more, whether to align the items into vertical
         * columns. Setting this to `false` makes room for more items, but will
         * look more messy.
         *
         * @since      6.1.0
         * @apioption  legend.alignColumns
         */
        alignColumns: true,

        /**
         * When the legend is floating, the plot area ignores it and is allowed
         * to be placed below it.
         *
         * @sample {highcharts} highcharts/legend/floating-false/
         *         False by default
         * @sample {highcharts} highcharts/legend/floating-true/
         *         True
         * @sample {highmaps} maps/legend/alignment/
         *         Floating legend
         *
         * @type       {boolean}
         * @default    false
         * @since      2.1
         * @apioption  legend.floating
         */

        /**
         * The layout of the legend items. Can be one of `horizontal` or
         * `vertical` or `proximate`. When `proximate`, the legend items will be
         * placed as close as possible to the graphs they're representing,
         * except in inverted charts or when the legend position doesn't allow
         * it.
         *
         * @sample {highcharts} highcharts/legend/layout-horizontal/
         *         Horizontal by default
         * @sample {highcharts} highcharts/legend/layout-vertical/
         *         Vertical
         * @sample highcharts/legend/layout-proximate
         *         Labels proximate to the data
         * @sample {highstock} stock/legend/layout-horizontal/
         *         Horizontal by default
         * @sample {highmaps} maps/legend/padding-itemmargin/
         *         Vertical with data classes
         * @sample {highmaps} maps/legend/layout-vertical/
         *         Vertical with color axis gradient
         *
         * @type       {string}
         * @default    horizontal
         * @validvalue ["horizontal", "vertical", "proximate"]
         * @apioption  legend.floating
         */
        layout: 'horizontal',

        /**
         * In a legend with horizontal layout, the itemDistance defines the
         * pixel distance between each item.
         *
         * @sample {highcharts} highcharts/legend/layout-horizontal/
         *         50px item distance
         * @sample {highstock} highcharts/legend/layout-horizontal/
         *         50px item distance
         *
         * @type      {number}
         * @default   {highcharts} 20
         * @default   {highstock} 20
         * @default   {highmaps} 8
         * @since     3.0.3
         * @apioption legend.itemDistance
         */

        /**
         * The pixel bottom margin for each legend item.
         *
         * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         * @sample {highmaps} maps/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         *
         * @type       {number}
         * @default    0
         * @since      2.2.0
         * @apioption  legend.itemMarginBottom
         */

        /**
         * The pixel top margin for each legend item.
         *
         * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         * @sample {highmaps} maps/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         *
         * @type       {number}
         * @default    0
         * @since      2.2.0
         * @apioption  legend.itemMarginTop
         */

        /**
         * The width for each legend item. By default the items are laid out
         * successively. In a [horizontal layout](legend.layout), if the items
         * are laid out across two rows or more, they will be vertically aligned
         * depending on the [legend.alignColumns](legend.alignColumns) option.
         *
         * @sample {highcharts} highcharts/legend/itemwidth-default/
         *         Undefined by default
         * @sample {highcharts} highcharts/legend/itemwidth-80/
         *         80 for aligned legend items
         *
         * @type       {number}
         * @since      2.0
         * @apioption  legend.itemWidth
         */

        /**
         * A [format string](https://www.highcharts.com/docs/chart-concepts/
         * labels-and-string-formatting) for each legend label. Available
         * variables relates to properties on the series, or the point in case
         * of pies.
         *
         * @type       {string}
         * @default    {name}
         * @since      1.3
         * @apioption  legend.labelFormat
         */

        /**
         * Callback function to format each of the series' labels. The `this`
         * keyword refers to the series object, or the point object in case
         * of pie charts. By default the series or point name is printed.
         *
         * @productdesc {highmaps}
         *              In Highmaps the context can also be a data class in case
         *              of a `colorAxis`.
         *
         * @sample {highcharts} highcharts/legend/labelformatter/
         *         Add text
         * @sample {highmaps} maps/legend/labelformatter/
         *         Data classes with label formatter
         *
         * @type       {Function}
         * @context    {Highcharts.Series|Highcharts.Point}
         * @apioption  legend.labelFormatter
         */
        labelFormatter: function () {
            return this.name;
        },

        /**
         * Line height for the legend items. Deprecated as of 2.1\. Instead,
         * the line height for each item can be set using itemStyle.lineHeight,
         * and the padding between items using `itemMarginTop` and
         * `itemMarginBottom`.
         *
         * @sample {highcharts} highcharts/legend/lineheight/
         *         Setting padding
         *
         * @type       {number}
         * @default    16
         * @since      2.0
         * @product    highcharts
         * @apioption  legend.lineHeight
         */

        /**
         * If the plot area sized is calculated automatically and the legend
         * is not floating, the legend margin is the space between the legend
         * and the axis labels or plot area.
         *
         * @sample {highcharts} highcharts/legend/margin-default/
         *         12 pixels by default
         * @sample {highcharts} highcharts/legend/margin-30/
         *         30 pixels
         *
         * @type       {number}
         * @default    12
         * @since      2.1
         * @apioption  legend.margin
         */

        /**
         * Maximum pixel height for the legend. When the maximum height is
         * extended, navigation will show.
         *
         * @type       {number}
         * @since      2.3.0
         * @apioption  legend.maxHeight
         */

        /**
         * The color of the drawn border around the legend.
         *
         * @see In styled mode, the legend border stroke can be applied with the
         *      `.highcharts-legend-box` class.
         *
         * @sample {highcharts} highcharts/legend/bordercolor/
         *         Brown border
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/border-background/
         *         Border and background options
         *
         * @type       {Highcharts.ColorString}
         * @default    #999999
         * @apioption  legend.borderColor
         */
        borderColor: '${palette.neutralColor40}',

        /**
         * The border corner radius of the legend.
         *
         * @sample {highcharts} highcharts/legend/borderradius-default/
         *         Square by default
         * @sample {highcharts} highcharts/legend/borderradius-round/
         *         5px rounded
         * @sample {highmaps} maps/legend/border-background/
         *         Border and background options
         *
         * @type       {number}
         * @apioption  legend.borderRadius
         */
        borderRadius: 0,

        /**
         * Options for the paging or navigation appearing when the legend
         * is overflown. Navigation works well on screen, but not in static
         * exported images. One way of working around that is to
         * [increase the chart height in
         * export](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/legend/navigation-enabled-false/).
         *
         * @type       {*}
         * @apioption  legend.navigation
         */
        navigation: {

            /**
             * How to animate the pages when navigating up or down. A value of
             * `true` applies the default navigation given in the
             * `chart.animation` option. Additional options can be given as an
             * object containing values for easing and duration.
             *
             * @sample {highcharts} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             * @sample {highstock} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             *
             * @type       {boolean|Highcharts.AnimationObject}
             * @default    true
             * @since      2.2.4
             * @apioption  legend.navigation.animation
             */

            /**
             * The pixel size of the up and down arrows in the legend paging
             * navigation.
             *
             * @sample {highcharts} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             * @sample {highstock} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             *
             * @type       {number}
             * @default    12
             * @since      2.2.4
             * @apioption  legend.navigation.arrowSize
             */

            /**
             * Whether to enable the legend navigation. In most cases, disabling
             * the navigation results in an unwanted overflow.
             *
             * See also the [adapt chart to legend](
             * https://www.highcharts.com/products/plugin-registry/single/8/Adapt-Chart-To-Legend)
             * plugin for a solution to extend the chart height to make room for
             * the legend, optionally in exported charts only.
             *
             * @type       {boolean}
             * @default    true
             * @since      4.2.4
             * @apioption  legend.navigation.enabled
             */

            /**
             * Text styles for the legend page navigation.
             *
             * @see In styled mode, the navigation items are styled with the
             *      `.highcharts-legend-navigation` class.
             *
             * @sample {highcharts} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             * @sample {highstock} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             *
             * @type       {Highcharts.CSSObject}
             * @since      2.2.4
             * @apioption  legend.navigation.style
             */

            /*= if (build.classic) { =*/

            /**
             * The color for the active up or down arrow in the legend page
             * navigation.
             *
             * @see In styled mode, the active arrow be styled with the
             *      `.highcharts-legend-nav-active` class.
             *
             * @sample  {highcharts} highcharts/legend/navigation/
             *          Legend page navigation demonstrated
             * @sample  {highstock} highcharts/legend/navigation/
             *          Legend page navigation demonstrated
             *
             * @type       {Highcharts.ColorString}
             * @default    #003399
             * @since      2.2.4
             * @apioption  legend.navigation.activeColor
             */
            activeColor: '${palette.highlightColor100}',

            /**
             * The color of the inactive up or down arrow in the legend page
             * navigation. .
             *
             * @see In styled mode, the inactive arrow be styled with the
             *      `.highcharts-legend-nav-inactive` class.
             *
             * @sample {highcharts} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             * @sample {highstock} highcharts/legend/navigation/
             *         Legend page navigation demonstrated
             *
             * @type       {Highcharts.ColorString}
             * @default    #cccccc
             * @since      2.2.4
             * @apioption  legend.navigation.inactiveColor
             */
            inactiveColor: '${palette.neutralColor20}'
            /*= } =*/
        },

        /**
         * The inner padding of the legend box.
         *
         * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         * @sample {highmaps} maps/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         *
         * @type       {number}
         * @default    8
         * @since      2.2.0
         * @apioption  legend.padding
         */

        /**
         * Whether to reverse the order of the legend items compared to the
         * order of the series or points as defined in the configuration object.
         *
         * @see [yAxis.reversedStacks](#yAxis.reversedStacks),
         *      [series.legendIndex](#series.legendIndex)
         *
         * @sample {highcharts} highcharts/legend/reversed/
         *         Stacked bar with reversed legend
         *
         * @type       {boolean}
         * @default    false
         * @since      1.2.5
         * @apioption  legend.reversed
         */

        /**
         * Whether to show the symbol on the right side of the text rather than
         * the left side. This is common in Arabic and Hebraic.
         *
         * @sample {highcharts} highcharts/legend/rtl/
         *         Symbol to the right
         *
         * @type       {boolean}
         * @default    false
         * @since      2.2
         * @apioption  legend.rtl
         */

        /**
         * CSS styles for the legend area. In the 1.x versions the position
         * of the legend area was determined by CSS. In 2.x, the position is
         * determined by properties like `align`, `verticalAlign`, `x` and `y`,
         * but the styles are still parsed for backwards compatibility.
         *
         * @deprecated
         * @type       {Highcharts.CSSObject}
         * @product    highcharts highstock
         * @apioption  legend.style
         */

        /*= if (build.classic) { =*/

        /**
         * CSS styles for each legend item. Only a subset of CSS is supported,
         * notably those options related to text. The default `textOverflow`
         * property makes long texts truncate. Set it to `undefined` to wrap
         * text instead. A `width` property can be added to control the text
         * width.
         *
         * @see In styled mode, the legend items can be styled with the
         *      `.highcharts-legend-item` class.
         *
         * @sample {highcharts} highcharts/legend/itemstyle/
         *         Bold black text
         * @sample {highmaps} maps/legend/itemstyle/
         *         Item text styles
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "#333333", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold", "textOverflow": "ellipsis"}
         * @apioption  legend.itemStyle
         */
        itemStyle: {
            color: '${palette.neutralColor80}',
            fontSize: '12px',
            fontWeight: 'bold',
            textOverflow: 'ellipsis'
        },

        /**
         * CSS styles for each legend item in hover mode. Only a subset of
         * CSS is supported, notably those options related to text. Properties
         * are inherited from `style` unless overridden here.
         *
         * @see In styled mode, the hovered legend items can be styled with
         *      the `.highcharts-legend-item:hover` pesudo-class.
         *
         * @sample {highcharts} highcharts/legend/itemhoverstyle/
         *         Red on hover
         * @sample {highmaps} maps/legend/itemstyle/
         *         Item text styles
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "#000000"}
         * @apioption  legend.itemHoverStyle
         */
        itemHoverStyle: {
            color: '${palette.neutralColor100}'
        },

        /**
         * CSS styles for each legend item when the corresponding series or
         * point is hidden. Only a subset of CSS is supported, notably those
         * options related to text. Properties are inherited from `style`
         * unless overridden here.
         *
         * @see In styled mode, the hidden legend items can be styled with
         *      the `.highcharts-legend-item-hidden` class.
         *
         * @sample {highcharts} highcharts/legend/itemhiddenstyle/
         *         Darker gray color
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "#cccccc"}
         * @apioption  legend.itemHiddenStyle
         */
        itemHiddenStyle: {
            color: '${palette.neutralColor20}'
        },

        /**
         * Whether to apply a drop shadow to the legend. A `backgroundColor`
         * also needs to be applied for this to take effect. The shadow can be
         * an object configuration containing `color`, `offsetX`, `offsetY`,
         * `opacity` and `width`.
         *
         * @sample {highcharts} highcharts/legend/shadow/
         *         White background and drop shadow
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/border-background/
         *         Border and background options
         *
         * @type       {boolean|Highcharts.CSSObject}
         * @default    false
         * @apioption  legend.shadow
         */
        shadow: false,
        /*= } =*/

        /**
         * Default styling for the checkbox next to a legend item when
         * `showCheckbox` is true.
         *
         * @type       {Highcharts.CSSObject}
         * @apioption  legend.itemCheckboxStyle
         */
        itemCheckboxStyle: {
            position: 'absolute',
            width: '13px', // for IE precision
            height: '13px'
        },
        // itemWidth: undefined,

        /**
         * When this is true, the legend symbol width will be the same as
         * the symbol height, which in turn defaults to the font size of the
         * legend items.
         *
         * @type       {boolean}
         * @default    true
         * @since      5.0.0
         * @apioption  legend.squareSymbol
         */
        squareSymbol: true,

        /**
         * The pixel height of the symbol for series types that use a rectangle
         * in the legend. Defaults to the font size of legend items.
         *
         * @productdesc {highmaps}
         * In Highmaps, when the symbol is the gradient of a vertical color
         * axis, the height defaults to 200.
         *
         * @sample {highmaps} maps/legend/layout-vertical-sized/
         *         Sized vertical gradient
         * @sample {highmaps} maps/legend/padding-itemmargin/
         *         No distance between data classes
         *
         * @type       {number}
         * @since      3.0.8
         * @apioption  legend.symbolHeight
         */

        /**
         * The border radius of the symbol for series types that use a rectangle
         * in the legend. Defaults to half the `symbolHeight`.
         *
         * @sample {highcharts} highcharts/legend/symbolradius/
         *         Round symbols
         * @sample {highstock} highcharts/legend/symbolradius/
         *         Round symbols
         * @sample {highmaps} highcharts/legend/symbolradius/
         *         Round symbols
         *
         * @type       {number}
         * @since      3.0.8
         * @apioption  legend.symbolRadius
         */

        /**
         * The pixel width of the legend item symbol. When the `squareSymbol`
         * option is set, this defaults to the `symbolHeight`, otherwise 16.
         *
         * @productdesc {highmaps}
         * In Highmaps, when the symbol is the gradient of a horizontal color
         * axis, the width defaults to 200.
         *
         * @sample {highcharts} highcharts/legend/symbolwidth/
         *         Greater symbol width and padding
         * @sample {highmaps} maps/legend/padding-itemmargin/
         *         Padding and item margins demonstrated
         * @sample {highmaps} maps/legend/layout-vertical-sized/
         *         Sized vertical gradient
         *
         * @type       {number}
         * @apioption  legend.symbolWidth
         */

        /**
         * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/
         * labels-and-string-formatting#html) to render the legend item texts.
         *
         * Prior to 4.1.7, when using HTML, [legend.navigation](
         * #legend.navigation) was disabled.
         *
         * @type       {boolean}
         * @default    false
         * @apioption  legend.useHTML
         */

        /**
         * The width of the legend box.
         *
         * @sample {highcharts} highcharts/legend/width/
         *         Aligned to the plot area
         *
         * @type       {number}
         * @since      2.0
         * @apioption  legend.width
         */

        /**
         * The pixel padding between the legend item symbol and the legend
         * item text.
         *
         * @sample {highcharts} highcharts/legend/symbolpadding/
         *         Greater symbol width and padding
         *
         * @type       {number}
         * @default    5
         * @apioption  legend.symbolPadding
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
         * When the [layout](#legend.layout) option is `proximate`, the
         * `verticalAlign` option doesn't apply.
         *
         * @sample {highcharts} highcharts/legend/verticalalign/
         *         Legend 100px from the top of the chart
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/alignment/
         *         Legend alignment
         *
         * @type       {string}
         * @default    bottom
         * @since      2.0
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  legend.verticalAlign
         */
        verticalAlign: 'bottom',
        // width: undefined,

        /**
         * The x offset of the legend relative to its horizontal alignment
         * `align` within chart.spacingLeft and chart.spacingRight. Negative
         * x moves it to the left, positive x moves it to the right.
         *
         * @sample {highcharts} highcharts/legend/width/
         *         Aligned to the plot area
         *
         * @type       {number}
         * @default    0
         * @since      2.0
         * @apioption  legend.x
         */
        x: 0,

        /**
         * The vertical offset of the legend relative to it's vertical alignment
         * `verticalAlign` within chart.spacingTop and chart.spacingBottom.
         *  Negative y moves it up, positive y moves it down.
         *
         * @sample {highcharts} highcharts/legend/verticalalign/
         *         Legend 100px from the top of the chart
         * @sample {highstock} stock/legend/align/
         *         Various legend options
         * @sample {highmaps} maps/legend/alignment/
         *         Legend alignment
         *
         * @type       {number}
         * @default    0
         * @since      2.0
         * @apioption  legend.y
         */
        y: 0,

        /**
         * A title to be added on top of the legend.
         *
         * @sample {highcharts} highcharts/legend/title/ Legend title
         * @sample {highmaps} maps/legend/alignment/ Legend with title
         * @since 3.0
         *
         * @type       {*}
         * @apioption  legend.title
         */
        title: {
            /**
             * A text or HTML string for the title.
             *
             * @type       {string}
             * @since      3.0
             * @apioption  legend.title.text
             */

            /*= if (build.classic) { =*/

            /**
             * Generic CSS styles for the legend title.
             *
             * @see In styled mode, the legend title is styled with the
             *      `.highcharts-legend-title` class.
             *
             * @type       {Highcharts.CSSObject}
             * @default    {"fontWeight":"bold"}
             * @since      3.0
             * @apioption  legend.title.style
             */
            style: {
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
     * @type       {*}
     * @apioption  loading
     */
    loading: {

        /**
         * The duration in milliseconds of the fade out effect.
         *
         * @sample highcharts/loading/hideduration/
         *         Fade in and out over a second
         *
         * @type       {number}
         * @default    100
         * @since      1.2.0
         * @apioption  loading.hideDuration
         */

        /**
         * The duration in milliseconds of the fade in effect.
         *
         * @sample highcharts/loading/hideduration/
         *         Fade in and out over a second
         *
         * @type       {number}
         * @default    100
         * @since      1.2.0
         * @apioption  loading.showDuration
         */
        /*= if (build.classic) { =*/

        /**
         * CSS styles for the loading label `span`.
         *
         * @see In styled mode, the loading label is styled with the
         *      `.highcharts-loading-inner` class.
         *
         * @sample {highcharts|highmaps} highcharts/loading/labelstyle/
         *         Vertically centered
         * @sample {highstock} stock/loading/general/
         *         Label styles
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"fontWeight": "bold", "position": "relative", "top": "45%"}
         * @since      1.2.0
         * @apioption  loading.labelStyle
         */
        labelStyle: {
            fontWeight: 'bold',
            position: 'relative',
            top: '45%'
        },

        /**
         * CSS styles for the loading screen that covers the plot area.
         *
         * In styled mode, the loading label is styled with the
         * `.highcharts-loading` class.
         *
         * @sample  {highcharts|highmaps} highcharts/loading/style/
         *          Gray plot area, white text
         * @sample  {highstock} stock/loading/general/
         *          Gray plot area, white text
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"position": "absolute", "backgroundColor": "#ffffff", "opacity": 0.5, "textAlign": "center"}
         * @since      1.2.0
         * @apioption  loading.style
         */
        style: {
            position: 'absolute',
            backgroundColor: '${palette.backgroundColor}',
            opacity: 0.5,
            textAlign: 'center'
        }
        /*= } =*/
    },


    /**
     * Options for the tooltip that appears when the user hovers over a
     * series or point.
     *
     * @type       {*}
     * @apioption  legend
     */
    tooltip: {


        /**
         * The color of the tooltip border. When `undefined`, the border takes
         * the color of the corresponding series or point.
         *
         * @sample {highcharts} highcharts/tooltip/bordercolor-default/
         *         Follow series by default
         * @sample {highcharts} highcharts/tooltip/bordercolor-black/
         *         Black border
         * @sample {highstock} stock/tooltip/general/
         *         Styled tooltip
         * @sample {highmaps} maps/tooltip/background-border/
         *         Background and border demo
         *
         * @type       {Highcharts.ColorString}
         * @apioption  tooltip.borderColor
         */

        /**
         * Since 4.1, the crosshair definitions are moved to the Axis object
         * in order for a better separation from the tooltip. See
         * [xAxis.crosshair](#xAxis.crosshair)<a>.</a>
         *
         * @sample {highcharts} highcharts/tooltip/crosshairs-x/
         *         Enable a crosshair for the x value
         *
         * @deprecated
         * @type       {*}
         * @default    true
         * @apioption  tooltip.crosshairs
         */

        /**
         * Whether the tooltip should follow the mouse as it moves across
         * columns, pie slices and other point types with an extent. By default
         * it behaves this way for scatter, bubble and pie series by override
         * in the `plotOptions` for those series types.
         *
         * For touch moves to behave the same way, [followTouchMove](
         * #tooltip.followTouchMove) must be `true` also.
         *
         * @type       {boolean}
         * @default    {highcharts} false
         * @default    {highstock} false
         * @default    {highmaps} true
         * @since      3.0
         * @apioption  tooltip.followPointer
         */

        /**
         * Whether the tooltip should follow the finger as it moves on a touch
         * device. If this is `true` and [chart.panning](#chart.panning) is
         * set,`followTouchMove` will take over one-finger touches, so the user
         * needs to use two fingers for zooming and panning.
         *
         * @type       {boolean}
         * @default    {highcharts} true
         * @default    {highstock} true
         * @default    {highmaps} false
         * @since      3.0.1
         * @apioption  tooltip.followTouchMove
         */

        /**
         * Callback function to format the text of the tooltip from scratch.
         * Return `false` to disable tooltip for a specific point on series.
         *
         * A subset of HTML is supported. Unless `useHTML` is true, the HTML of
         * the tooltip is parsed and converted to SVG, therefore this isn't a
         * complete HTML renderer. The following tags are supported: `<b>`,
         * `<strong>`, `<i>`, `<em>`, `<br/>`, `<span>`. Spans can be styled
         * with a `style` attribute, but only text-related CSS that is shared
         * with SVG is handled.
         *
         * Since version 2.1 the tooltip can be shared between multiple series
         * through the `shared` option. The available data in the formatter
         * differ a bit depending on whether the tooltip is shared or not. In
         * a shared tooltip, all properties except `x`, which is common for
         * all points, are kept in an array, `this.points`.
         *
         * Available data are:
         *
         * <dl>
         *
         * <dt>this.percentage (not shared) / this.points[i].percentage (shared)
         * </dt>
         *
         * <dd>Stacked series and pies only. The point's percentage of the
         * total.
         * </dd>
         *
         * <dt>this.point (not shared) / this.points[i].point (shared)</dt>
         *
         * <dd>The point object. The point name, if defined, is available
         * through `this.point.name`.</dd>
         *
         * <dt>this.points</dt>
         *
         * <dd>In a shared tooltip, this is an array containing all other
         * properties for each point.</dd>
         *
         * <dt>this.series (not shared) / this.points[i].series (shared)</dt>
         *
         * <dd>The series object. The series name is available through
         * `this.series.name`.</dd>
         *
         * <dt>this.total (not shared) / this.points[i].total (shared)</dt>
         *
         * <dd>Stacked series only. The total value at this point's x value.
         * </dd>
         *
         * <dt>this.x</dt>
         *
         * <dd>The x value. This property is the same regardless of the tooltip
         * being shared or not.</dd>
         *
         * <dt>this.y (not shared) / this.points[i].y (shared)</dt>
         *
         * <dd>The y value.</dd>
         *
         * </dl>
         *
         * @sample {highcharts} highcharts/tooltip/formatter-simple/
         *         Simple string formatting
         * @sample {highcharts} highcharts/tooltip/formatter-shared/
         *         Formatting with shared tooltip
         * @sample {highstock} stock/tooltip/formatter/
         *         Formatting with shared tooltip
         * @sample {highmaps} maps/tooltip/formatter/
         *         String formatting
         *
         * @type       {Function}
         * @apioption  tooltip.formatter
         */

        /**
         * The number of milliseconds to wait until the tooltip is hidden when
         * mouse out from a point or chart.
         *
         * @type       {number}
         * @default    500
         * @since      3.0
         * @apioption  tooltip.hideDelay
         */

        /**
         * Whether to allow the tooltip to render outside the chart's SVG
         * element box. By default (`false`), the tooltip is rendered within the
         * chart's SVG element, which results in the tooltip being aligned
         * inside the chart area. For small charts, this may result in clipping
         * or overlapping. When `true`, a separate SVG element is created and
         * overlaid on the page, allowing the tooltip to be aligned inside the
         * page itself.
         *
         * @sample highcharts/tooltip/outside
         *         Small charts with tooltips outside
         *
         * @type       {boolean}
         * @default    false
         * @since      6.1.1
         * @apioption  tooltip.outside
         */

        /**
         * A callback function for formatting the HTML output for a single point
         * in the tooltip. Like the `pointFormat` string, but with more
         * flexibility.
         *
         * @type       {Function}
         * @since      4.1.0
         * @context    Highcharts.Point
         * @apioption  tooltip.pointFormatter
         */

        /**
         * A callback function to place the tooltip in a default position. The
         * callback receives three parameters: `labelWidth`, `labelHeight` and
         * `point`, where point contains values for `plotX` and `plotY` telling
         * where the reference point is in the plot area. Add `chart.plotLeft`
         * and `chart.plotTop` to get the full coordinates.
         *
         * The return should be an object containing x and y values, for example
         * `{ x: 100, y: 100 }`.
         *
         * @sample {highcharts} highcharts/tooltip/positioner/
         *         A fixed tooltip position
         * @sample {highstock} stock/tooltip/positioner/
         *         A fixed tooltip position on top of the chart
         * @sample {highmaps} maps/tooltip/positioner/
         *         A fixed tooltip position
         *
         * @type       {Function}
         * @since      2.2.4
         * @apioption  tooltip.positioner
         */

        /**
         * The name of a symbol to use for the border around the tooltip. Can
         * be one of: `"callout"`, `"circle"` or `"square"`.
         *
         * Custom callbacks for symbol path generation can also be added to
         * `Highcharts.SVGRenderer.prototype.symbols` the same way as for
         * [series.marker.symbol](plotOptions.line.marker.symbol).
         *
         * @type       {string}
         * @default    callout
         * @since      4.0
         * @validvalue ["callout", "square"]
         * @apioption  tooltip.shape
         */

        /**
         * When the tooltip is shared, the entire plot area will capture mouse
         * movement or touch events. Tooltip texts for series types with ordered
         * data (not pie, scatter, flags etc) will be shown in a single bubble.
         * This is recommended for single series charts and for tablet/mobile
         * optimized charts.
         *
         * See also [tooltip.split](#tooltip.split), that is better suited for
         * charts with many series, especially line-type series. The
         * `tooltip.split` option takes precedence over `tooltip.shared`.
         *
         * @sample {highcharts} highcharts/tooltip/shared-false/
         *         False by default
         * @sample {highcharts} highcharts/tooltip/shared-true/
         *         True
         * @sample {highcharts} highcharts/tooltip/shared-x-crosshair/
         *         True with x axis crosshair
         * @sample {highcharts} highcharts/tooltip/shared-true-mixed-types/
         *         True with mixed series types
         *
         * @type       {boolean}
         * @default    false
         * @since      2.1
         * @product    highcharts highstock
         * @apioption  tooltip.shared
         */

        /**
         * Split the tooltip into one label per series, with the header close
         * to the axis. This is recommended over [shared](#tooltip.shared)
         * tooltips for charts with multiple line series, generally making them
         * easier to read. This option takes precedence over `tooltip.shared`.
         *
         * @productdesc {highstock} In Highstock, tooltips are split by default
         * since v6.0.0. Stock charts typically contain multi-dimension points
         * and multiple panes, making split tooltips the preferred layout over
         * the previous `shared` tooltip.
         *
         * @sample highcharts/tooltip/split/
         *         Split tooltip
         *
         * @type       {boolean}
         * @default    {highcharts} false
         * @default    {highstock} true
         * @since      5.0.0
         * @product    highcharts highstock
         * @apioption  tooltip.split
         */

        /**
         * Use HTML to render the contents of the tooltip instead of SVG. Using
         * HTML allows advanced formatting like tables and images in the
         * tooltip. It is also recommended for rtl languages as it works around
         * rtl bugs in early Firefox.
         *
         * @sample {highcharts|highstock} highcharts/tooltip/footerformat/
         *         A table for value alignment
         * @sample {highcharts|highstock} highcharts/tooltip/fullhtml/
         *         Full HTML tooltip
         * @sample {highmaps} maps/tooltip/usehtml/
         *         Pure HTML tooltip
         *
         * @type       {boolean}
         * @default    false
         * @since      2.2
         * @apioption  tooltip.useHTML
         */

        /**
         * How many decimals to show in each series' y value. This is
         * overridable in each series' tooltip options object. The default is to
         * preserve all decimals.
         *
         * @sample {highcharts|highstock} highcharts/tooltip/valuedecimals/
         *         Set decimals, prefix and suffix for the value
         * @sample {highmaps} maps/tooltip/valuedecimals/
         *         Set decimals, prefix and suffix for the value
         *
         * @type       {number}
         * @since      2.2
         * @apioption  tooltip.valueDecimals
         */

        /**
         * A string to prepend to each series' y value. Overridable in each
         * series' tooltip options object.
         *
         * @sample {highcharts|highstock} highcharts/tooltip/valuedecimals/
         *         Set decimals, prefix and suffix for the value
         * @sample {highmaps} maps/tooltip/valuedecimals/
         *         Set decimals, prefix and suffix for the value
         *
         * @type       {string}
         * @since      2.2
         * @apioption  tooltip.valuePrefix
         */

        /**
         * A string to append to each series' y value. Overridable in each
         * series' tooltip options object.
         *
         * @sample {highcharts|highstock} highcharts/tooltip/valuedecimals/
         *         Set decimals, prefix and suffix for the value
         * @sample {highmaps} maps/tooltip/valuedecimals/
         *         Set decimals, prefix and suffix for the value
         *
         * @type       {string}
         * @since      2.2
         * @apioption  tooltip.valueSuffix
         */

        /**
         * The format for the date in the tooltip header if the X axis is a
         * datetime axis. The default is a best guess based on the smallest
         * distance between points in the chart.
         *
         * @sample {highcharts} highcharts/tooltip/xdateformat/
         *         A different format
         *
         * @type       {string}
         * @product    highcharts highstock
         * @apioption  tooltip.xDateFormat
         */

        /**
         * How many decimals to show for the `point.change` value when the
         * `series.compare` option is set. This is overridable in each series'
         * tooltip options object. The default is to preserve all decimals.
         *
         * @type       {number}
         * @since      1.0.1
         * @product    highstock
         * @apioption  tooltip.changeDecimals
         */

        /**
         * Enable or disable the tooltip.
         *
         * @sample {highcharts} highcharts/tooltip/enabled/
         *         Disabled
         * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
         *         Disable tooltip and show values on chart instead
         *
         * @type       {boolean}
         * @default    true
         * @apioption  tooltip.enabled
         */
        enabled: true,

        /**
         * Enable or disable animation of the tooltip.
         *
         * @type       {boolean}
         * @default    true
         * @since      2.3.0
         * @apioption  tooltip.animation
         */
        animation: svg,

        /**
         * The radius of the rounded border corners.
         *
         * @sample {highcharts} highcharts/tooltip/bordercolor-default/
         *         5px by default
         * @sample {highcharts} highcharts/tooltip/borderradius-0/
         *         Square borders
         * @sample {highmaps} maps/tooltip/background-border/
         *         Background and border demo
         *
         * @type       {number}
         * @default    3
         * @apioption  tooltip.borderRadius
         */
        borderRadius: 3,

        /**
         * For series on a datetime axes, the date format in the tooltip's
         * header will by default be guessed based on the closest data points.
         * This member gives the default string representations used for
         * each unit. For an overview of the replacement codes, see
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * Defaults to:
         *
         * <pre>{
         *     millisecond:"%A, %b %e, %H:%M:%S.%L",
         *     second:"%A, %b %e, %H:%M:%S",
         *     minute:"%A, %b %e, %H:%M",
         *     hour:"%A, %b %e, %H:%M",
         *     day:"%A, %b %e, %Y",
         *     week:"Week from %A, %b %e, %Y",
         *     month:"%B %Y",
         *     year:"%Y"
         * }</pre>
         *
         * @see [xAxis.dateTimeLabelFormats](#xAxis.dateTimeLabelFormats)
         *
         * @type       {Highcharts.Dictionary<string>}
         * @product    highcharts highstock
         * @apioption  tooltip.dateTimeLabelFormats
         */
        dateTimeLabelFormats: {
            millisecond: '%A, %b %e, %H:%M:%S.%L',
            second: '%A, %b %e, %H:%M:%S',
            minute: '%A, %b %e, %H:%M',
            hour: '%A, %b %e, %H:%M',
            day: '%A, %b %e, %Y',
            week: 'Week from %A, %b %e, %Y',
            month: '%B %Y',
            year: '%Y'
        },

        /**
         * A string to append to the tooltip format.
         *
         * @sample {highcharts} highcharts/tooltip/footerformat/
         *         A table for value alignment
         * @sample {highmaps} maps/tooltip/format/
         *         Format demo
         *
         * @type       {string}
         * @default
         * @since      2.2
         * @apioption  tooltip.footerFormat
         */
        footerFormat: '',

        /**
         * Padding inside the tooltip, in pixels.
         *
         * @type       {number}
         * @default    8
         * @since      5.0.0
         * @apioption  tooltip.padding
         */
        padding: 8,

        /**
         * Proximity snap for graphs or single points. It defaults to 10 for
         * mouse-powered devices and 25 for touch devices.
         *
         * Note that in most cases the whole plot area captures the mouse
         * movement, and in these cases `tooltip.snap` doesn't make sense. This
         * applies when [stickyTracking](#plotOptions.series.stickyTracking)
         * is `true` (default) and when the tooltip is [shared](#tooltip.shared)
         * or [split](#tooltip.split).
         *
         * @sample {highcharts} highcharts/tooltip/bordercolor-default/
         *         10 px by default
         * @sample {highcharts} highcharts/tooltip/snap-50/
         *         50 px on graph
         *
         * @type       {number}
         * @default    10/25
         * @since      1.2.0
         * @product    highcharts highstock
         * @apioption  tooltip.snap
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
         * In styled mode, the stroke width is set in the
         * `.highcharts-tooltip-box` class.
         *
         * @sample {highcharts} highcharts/tooltip/backgroundcolor-solid/
         *         Yellowish background
         * @sample {highcharts} highcharts/tooltip/backgroundcolor-gradient/
         *         Gradient
         * @sample {highcharts} highcharts/css/tooltip-border-background/
         *         Tooltip in styled mode
         * @sample {highstock} stock/tooltip/general/
         *         Custom tooltip
         * @sample {highstock} highcharts/css/tooltip-border-background/
         *         Tooltip in styled mode
         * @sample {highmaps} maps/tooltip/background-border/
         *         Background and border demo
         * @sample {highmaps} highcharts/css/tooltip-border-background/
         *         Tooltip in styled mode
         *
         * @type       {Highcharts.ColorString}
         * @default    rgba(247,247,247,0.85)
         * @apioption  tooltip.backgroundColor
         */
        backgroundColor: color('${palette.neutralColor3}')
            .setOpacity(0.85).get(),

        /**
         * The pixel width of the tooltip border.
         *
         * In styled mode, the stroke width is set in the
         * `.highcharts-tooltip-box` class.
         *
         * @sample {highcharts} highcharts/tooltip/bordercolor-default/
         *         2px by default
         * @sample {highcharts} highcharts/tooltip/borderwidth/
         *         No border (shadow only)
         * @sample {highcharts} highcharts/css/tooltip-border-background/
         *         Tooltip in styled mode
         * @sample {highstock} stock/tooltip/general/
         *         Custom tooltip
         * @sample {highstock} highcharts/css/tooltip-border-background/
         *         Tooltip in styled mode
         * @sample {highmaps} maps/tooltip/background-border/
         *         Background and border demo
         * @sample {highmaps} highcharts/css/tooltip-border-background/
         *         Tooltip in styled mode
         *
         * @type       {number}
         * @default    1
         * @apioption  tooltip.borderWidth
         */
        borderWidth: 1,

        /**
         * The HTML of the tooltip header line. Variables are enclosed by
         * curly brackets. Available variables are `point.key`, `series.name`,
         * `series.color` and other members from the `point` and `series`
         * objects. The `point.key` variable contains the category name, x
         * value or datetime string depending on the type of axis. For datetime
         * axes, the `point.key` date format can be set using
         * `tooltip.xDateFormat`.
         *
         * @sample {highcharts} highcharts/tooltip/footerformat/
         *         An HTML table in the tooltip
         * @sample {highstock} highcharts/tooltip/footerformat/
         *         An HTML table in the tooltip
         * @sample {highmaps} maps/tooltip/format/
         *         Format demo
         *
         * @type       {string}
         * @apioption  tooltip.headerFormat
         */
        headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',

        /**
         * The HTML of the point's line in the tooltip. Variables are enclosed
         * by curly brackets. Available variables are point.x, point.y, series.
         * name and series.color and other properties on the same form.
         * Furthermore, `point.y` can be extended by the `tooltip.valuePrefix`
         * and `tooltip.valueSuffix` variables. This can also be overridden for
         * each series, which makes it a good hook for displaying units.
         *
         * In styled mode, the dot is colored by a class name rather
         * than the point color.
         *
         * @sample {highcharts} highcharts/tooltip/pointformat/
         *         A different point format with value suffix
         * @sample {highmaps} maps/tooltip/format/
         *         Format demo
         *
         * @type       {string}
         * @default    <span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>
         * @since      2.2
         * @apioption  tooltip.pointFormat
         */
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',

        /**
         * Whether to apply a drop shadow to the tooltip.
         *
         * @sample {highcharts} highcharts/tooltip/bordercolor-default/
         *         True by default
         * @sample {highcharts} highcharts/tooltip/shadow/
         *         False
         * @sample {highmaps} maps/tooltip/positioner/
         *         Fixed tooltip position, border and shadow disabled
         *
         * @type       {boolean}
         * @default    true
         * @apioption  tooltip.shadow
         */
        shadow: true,

        /**
         * CSS styles for the tooltip. The tooltip can also be styled through
         * the CSS class `.highcharts-tooltip`.
         *
         * @sample {highcharts} highcharts/tooltip/style/
         *         Greater padding, bold text
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"color": "#333333", "cursor": "default", "fontSize": "12px", "pointerEvents": "none", "whiteSpace": "nowrap"}
         * @apioption  tooltip.style
         */
        style: {
            color: '${palette.neutralColor80}',
            cursor: 'default',
            fontSize: '12px',
            // #1686 http://caniuse.com/#feat=pointer-events
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
        }
        /*= } =*/
    },


    /**
     * Highchart by default puts a credits label in the lower right corner
     * of the chart. This can be changed using these options.
     *
     * @type       {*}
     * @apioption  credits
     */
    credits: {

        /**
         * Credits for map source to be concatenated with conventional credit
         * text. By default this is a format string that collects copyright
         * information from the map if available.
         *
         * @see [mapTextFull](#credits.mapTextFull), [text](#credits.text)
         *
         * @type       {string}
         * @default    \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>
         * @since      4.2.2
         * @product    highmaps
         * @apioption  credits.mapText
         */

        /**
         * Detailed credits for map source to be displayed on hover of credits
         * text. By default this is a format string that collects copyright
         * information from the map if available.
         *
         * @see        [mapText](#credits.mapText), [text](#credits.text)
         *
         * @type       {string}
         * @default    {geojson.copyright}
         * @since      4.2.2
         * @product    highmaps
         * @apioption  credits.mapTextFull
         */

        /**
         * Whether to show the credits text.
         *
         * @sample {highcharts} highcharts/credits/enabled-false/
         *         Credits disabled
         * @sample {highstock} stock/credits/enabled/
         *         Credits disabled
         * @sample {highmaps} maps/credits/enabled-false/
         *         Credits disabled
         *
         * @type       {boolean}
         * @apioption  credits.enabled
         */
        enabled: true,

        /**
         * The URL for the credits label.
         *
         * @sample {highcharts} highcharts/credits/href/
         *         Custom URL and text
         * @sample {highmaps} maps/credits/customized/
         *         Custom URL and text
         *
         * @type       {string}
         * @apioption  credits.href
         */
        href: 'https://www.highcharts.com',

        /**
         * Position configuration for the credits label.
         *
         * @sample {highcharts} highcharts/credits/position-left/
         *         Left aligned
         * @sample {highcharts} highcharts/credits/position-left/
         *         Left aligned
         * @sample {highmaps} maps/credits/customized/
         *         Left aligned
         * @sample {highmaps} maps/credits/customized/
         *         Left aligned
         *
         * @type       {*}
         * @since      2.1
         * @apioption  credits.position
         */
        position: {

            /**
             * Horizontal alignment of the credits.
             *
             * @type       {string}
             * @default    right
             * @validvalue ["left", "center", "right"]
             * @apioption  credits.position.align
             */
            align: 'right',

            /**
             * Horizontal pixel offset of the credits.
             *
             * @type      {number}
             * @default   -10
             * @apioption credits.position.x
             */
            x: -10,

            /**
             * Vertical alignment of the credits.
             *
             * @type       {string}
             * @default    bottom
             * @validvalue ["top", "middle", "bottom"]
             * @apioption  credits.position.verticalAlign
             */
            verticalAlign: 'bottom',

            /**
             * Vertical pixel offset of the credits.
             *
             * @type       {number}
             * @default    -5
             * @apioption  credits.position.y
             */
            y: -5
        },
        /*= if (build.classic) { =*/

        /**
         * CSS styles for the credits label.
         *
         * @see In styled mode, credits styles can be set with the
         *      `.highcharts-credits` class.
         *
         * @type       {Highcharts.CSSObject}
         * @default    {"cursor": "pointer", "color": "#999999", "fontSize": "10px"}
         * @apioption  credits.style
         */
        style: {

            cursor: 'pointer',
            color: '${palette.neutralColor40}',
            fontSize: '9px'
        },
        /*= } =*/

        /**
         * The text for the credits label.
         *
         * @productdesc {highmaps}
         * If a map is loaded as GeoJSON, the text defaults to
         * `Highcharts @ {map-credits}`. Otherwise, it defaults to
         * `Highcharts.com`.
         *
         * @sample {highcharts} highcharts/credits/href/
         *         Custom URL and text
         * @sample {highmaps} maps/credits/customized/
         *         Custom URL and text
         *
         * @type       {string}
         * @default    {highcharts|highstock} Highcharts.com
         * @apioption  credits.text
         */
        text: 'Highcharts.com'

    }
};

/**
 * Merge the default options with custom options and return the new options
 * structure. Commonly used for defining reusable templates.
 *
 * @sample highcharts/global/useutc-false Setting a global option
 * @sample highcharts/members/setoptions Applying a global theme
 *
 * @function Highcharts.setOptions
 *
 * @param   {Highcharts.Options} options
 *          The new custom chart options.
 *
 * @returns {Highcharts.Options}
 *          Updated options.
 */
H.setOptions = function (options) {

    // Copy in the default options
    H.defaultOptions = merge(true, H.defaultOptions, options);

    // Update the time object
    H.time.update(
        merge(H.defaultOptions.global, H.defaultOptions.time),
        false
    );

    return H.defaultOptions;
};

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions
 * for outside modules wasn't enough because the setOptions method created a new
 * object.
 *
 * @function Highcharts.getOptions
 *
 * @return {Highcharts.Options}
 */
H.getOptions = function () {
    return H.defaultOptions;
};


// Series defaults
H.defaultPlotOptions = H.defaultOptions.plotOptions;


// Time utilities
H.time = new H.Time(merge(H.defaultOptions.global, H.defaultOptions.time));

/**
 * Formats a JavaScript date timestamp (milliseconds since Jan 1st 1970) into a
 * human readable date string. The format is a subset of the formats for PHP's
 * [strftime]{@link
 * http://www.php.net/manual/en/function.strftime.php} function. Additional
 * formats can be given in the {@link Highcharts.dateFormats} hook.
 *
 * Since v6.0.5, all internal dates are formatted through the
 * [Chart.time](Chart#time) instance to respect chart-level time settings. The
 * `Highcharts.dateFormat` function only reflects global time settings set with
 * `setOptions`.
 *
 * @function Highcharts.dateFormat
 *
 * @param  {string} format
 *         The desired format where various time representations are prefixed
 *         with %.
 *
 * @param  {number} timestamp
 *         The JavaScript timestamp.
 *
 * @param  {boolean} [capitalize=false]
 *         Upper case first letter in the return.
 *
 * @return {string}
 *         The formatted date.
 */
H.dateFormat = function (format, timestamp, capitalize) {
    return H.time.dateFormat(format, timestamp, capitalize);
};
