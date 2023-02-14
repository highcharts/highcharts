/* *
 *
 *  (c) 2010-2023 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TooltipOptions from './TooltipOptions';

import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
const {
    isTouchDevice,
    svg
} = H;
import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * Options for the tooltip that appears when the user hovers over a
 * series or point.
 *
 * @declare Highcharts.TooltipOptions
 */
const TooltipDefaults: TooltipOptions = {

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
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @apioption tooltip.borderColor
     */

    /**
     * A CSS class name to apply to the tooltip's container div,
     * allowing unique CSS styling for each chart.
     *
     * @type      {string}
     * @apioption tooltip.className
     */

    /**
     * Since 4.1, the crosshair definitions are moved to the Axis object
     * in order for a better separation from the tooltip. See
     * [xAxis.crosshair](#xAxis.crosshair).
     *
     * @sample {highcharts} highcharts/tooltip/crosshairs-x/
     *         Enable a crosshair for the x value
     *
     * @deprecated
     *
     * @type      {*}
     * @default   true
     * @apioption tooltip.crosshairs
     */

    /**
     * Distance from point to tooltip in pixels.
     *
     * @type      {number}
     * @default   16
     * @apioption tooltip.distance
     */

    /**
     * Whether the tooltip should follow the mouse as it moves across
     * columns, pie slices and other point types with an extent.
     * By default it behaves this way for pie, polygon, map, sankey
     * and wordcloud series by override in the `plotOptions`
     * for those series types.
     *
     * Does not apply if [split](#tooltip.split) is `true`.
     *
     * For touch moves to behave the same way, [followTouchMove](
     * #tooltip.followTouchMove) must be `true` also.
     *
     * @type      {boolean}
     * @default   {highcharts} false
     * @default   {highstock} false
     * @default   {highmaps} true
     * @since     3.0
     * @apioption tooltip.followPointer
     */

    /**
     * Whether the tooltip should update as the finger moves on a touch
     * device. If this is `true` and [chart.panning](#chart.panning) is
     * set,`followTouchMove` will take over one-finger touches, so the user
     * needs to use two fingers for zooming and panning.
     *
     * Note the difference to [followPointer](#tooltip.followPointer) that
     * only defines the _position_ of the tooltip. If `followPointer` is
     * false in for example a column series, the tooltip will show above or
     * below the column, but as `followTouchMove` is true, the tooltip will
     * jump from column to column as the user swipes across the plot area.
     *
     * @type      {boolean}
     * @default   {highcharts} true
     * @default   {highstock} true
     * @default   {highmaps} false
     * @since     3.0.1
     * @apioption tooltip.followTouchMove
     */

    /**
     * Callback function to format the text of the tooltip from scratch. In
     * case of single or [shared](#tooltip.shared) tooltips, a string should
     * be returned. In case of [split](#tooltip.split) tooltips, it should
     * return an array where the first item is the header, and subsequent
     * items are mapped to the points. Return `false` to disable tooltip for
     * a specific point on series.
     *
     * A subset of HTML is supported. Unless `useHTML` is true, the HTML of
     * the tooltip is parsed and converted to SVG, therefore this isn't a
     * complete HTML renderer. The following HTML tags are supported: `b`,
     * `br`, `em`, `i`, `span`, `strong`. Spans can be styled with a `style`
     * attribute, but only text-related CSS, that is shared with SVG, is
     * handled.
     *
     * The available data in the formatter differ a bit depending on whether
     * the tooltip is shared or split, or belongs to a single point. In a
     * shared/split tooltip, all properties except `x`, which is common for
     * all points, are kept in an array, `this.points`.
     *
     * Available data are:
     *
     * - **this.percentage (not shared) /**
     *   **this.points[i].percentage (shared)**:
     *   Stacked series and pies only. The point's percentage of the total.
     *
     * - **this.point (not shared) / this.points[i].point (shared)**:
     *   The point object. The point name, if defined, is available through
     *   `this.point.name`.
     *
     * - **this.points**:
     *   In a shared tooltip, this is an array containing all other
     *   properties for each point.
     *
     * - **this.series (not shared) / this.points[i].series (shared)**:
     *   The series object. The series name is available through
     *   `this.series.name`.
     *
     * - **this.total (not shared) / this.points[i].total (shared)**:
     *   Stacked series only. The total value at this point's x value.
     *
     * - **this.x**:
     *   The x value. This property is the same regardless of the tooltip
     *   being shared or not.
     *
     * - **this.y (not shared) / this.points[i].y (shared)**:
     *   The y value.
     *
     * @sample {highcharts} highcharts/tooltip/formatter-simple/
     *         Simple string formatting
     * @sample {highcharts} highcharts/tooltip/formatter-shared/
     *         Formatting with shared tooltip
     * @sample {highcharts|highstock} highcharts/tooltip/formatter-split/
     *         Formatting with split tooltip
     * @sample highcharts/tooltip/formatter-conditional-default/
     *         Extending default formatter
     * @sample {highstock} stock/tooltip/formatter/
     *         Formatting with shared tooltip
     * @sample {highmaps} maps/tooltip/formatter/
     *         String formatting
     *
     * @type      {Highcharts.TooltipFormatterCallbackFunction}
     * @apioption tooltip.formatter
     */


    /**
     * Callback function to format the text of the tooltip for
     * visible null points.
     * Works analogously to [formatter](#tooltip.formatter).
     *
     * @sample highcharts/plotoptions/series-nullformat
     *         Format data label and tooltip for null point.
     *
     * @type      {Highcharts.TooltipFormatterCallbackFunction}
     * @apioption tooltip.nullFormatter
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
     * Defaults to `true` if `chart.scrollablePlotArea` is activated,
     * otherwise `false`.
     *
     * @sample highcharts/tooltip/outside
     *         Small charts with tooltips outside
     *
     * @type      {boolean|undefined}
     * @default   undefined
     * @since     6.1.1
     * @apioption tooltip.outside
     */

    /**
     * A callback function for formatting the HTML output for a single point
     * in the tooltip. Like the `pointFormat` string, but with more
     * flexibility.
     *
     * @type      {Highcharts.FormatterCallbackFunction<Highcharts.Point>}
     * @since     4.1.0
     * @context   Highcharts.Point
     * @apioption tooltip.pointFormatter
     */

    /**
     * A callback function to place the tooltip in a custom position. The
     * callback receives three parameters: `labelWidth`, `labelHeight` and
     * `point`, where point contains values for `plotX` and `plotY` telling
     * where the reference point is in the plot area. Add `chart.plotLeft`
     * and `chart.plotTop` to get the full coordinates.
     *
     * To find the actual hovered `Point` instance, use
     * `this.chart.hoverPoint`. For shared or split tooltips, all the hover
     * points are available in `this.chart.hoverPoints`.
     *
     * Since v7, when [tooltip.split](#tooltip.split) option is enabled,
     * positioner is called for each of the boxes separately, including
     * xAxis header. xAxis header is not a point, instead `point` argument
     * contains info: `{ plotX: Number, plotY: Number, isHeader: Boolean }`
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
     * @sample {highstock} stock/tooltip/split-positioner/
     *         Split tooltip with fixed positions
     * @sample {highstock} stock/tooltip/positioner-scrollable-plotarea/
     *         Scrollable plot area combined with tooltip positioner
     *
     * @type      {Highcharts.TooltipPositionerCallbackFunction}
     * @since     2.2.4
     * @apioption tooltip.positioner
     */

    /**
     * Split the tooltip into one label per series, with the header close
     * to the axis. This is recommended over [shared](#tooltip.shared)
     * tooltips for charts with multiple line series, generally making them
     * easier to read. This option takes precedence over `tooltip.shared`.
     *
     * Not supported for [polar](#chart.polar) and [inverted](#chart.inverted) charts.
     *
     * @productdesc {highstock} In Highcharts Stock, tooltips are split
     * by default since v6.0.0. Stock charts typically contain
     * multi-dimension points and multiple panes, making split tooltips
     * the preferred layout over
     * the previous `shared` tooltip.
     *
     * @sample highcharts/tooltip/split/
     *         Split tooltip
     * @sample {highcharts|highstock} highcharts/tooltip/formatter-split/
     *         Split tooltip and custom formatter callback
     *
     * @type      {boolean}
     * @default   {highcharts} false
     * @default   {highstock} true
     * @since     5.0.0
     * @product   highcharts highstock
     * @apioption tooltip.split
     */

    /**
     * Prevents the tooltip from switching or closing, when touched or
     * pointed.
     *
     * @sample highcharts/tooltip/stickoncontact/
     *         Tooltip sticks on pointer contact
     *
     * @type      {boolean}
     * @since     8.0.1
     * @apioption tooltip.stickOnContact
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
     * @type      {boolean}
     * @default   false
     * @since     2.2
     * @apioption tooltip.useHTML
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
     * @type      {number|undefined}
     * @since     2.2
     * @apioption tooltip.valueDecimals
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
     * @type      {string}
     * @since     2.2
     * @apioption tooltip.valuePrefix
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
     * @type      {string}
     * @since     2.2
     * @apioption tooltip.valueSuffix
     */

    /**
     * The format for the date in the tooltip header if the X axis is a
     * datetime axis. The default is a best guess based on the smallest
     * distance between points in the chart.
     *
     * @sample {highcharts} highcharts/tooltip/xdateformat/
     *         A different format
     *
     * @type      {string}
     * @product   highcharts highstock gantt
     * @apioption tooltip.xDateFormat
     */

    /**
     * How many decimals to show for the `point.change`
     * or the `point.cumulativeSum` value when the `series.compare`
     * or the `series.cumulative` option is set.
     * This is overridable in each series' tooltip options object.
     *
     * @type      {number}
     * @default   2
     * @since     1.0.1
     * @product   highstock
     * @apioption tooltip.changeDecimals
     */

    /**
     * Enable or disable the tooltip.
     *
     * @sample {highcharts} highcharts/tooltip/enabled/
     *         Disabled
     * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
     *         Disable tooltip and show values on chart instead
     */
    enabled: true,

    /**
     * Enable or disable animation of the tooltip.
     *
     * @type       {boolean}
     * @default    true
     * @since      2.3.0
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
     */
    borderRadius: 3,

    /**
     * For series on datetime axes, the date format in the tooltip's
     * header will by default be guessed based on the closest data points.
     * This member gives the default string representations used for
     * each unit. For an overview of the replacement codes, see
     * [dateFormat](/class-reference/Highcharts.Time#dateFormat).
     *
     * @see [xAxis.dateTimeLabelFormats](#xAxis.dateTimeLabelFormats)
     *
     * @type    {Highcharts.Dictionary<string>}
     * @product highcharts highstock gantt
     */
    dateTimeLabelFormats: {
        /** @internal */
        millisecond: '%A, %b %e, %H:%M:%S.%L',
        /** @internal */
        second: '%A, %b %e, %H:%M:%S',
        /** @internal */
        minute: '%A, %b %e, %H:%M',
        /** @internal */
        hour: '%A, %b %e, %H:%M',
        /** @internal */
        day: '%A, %b %e, %Y',
        /** @internal */
        week: 'Week from %A, %b %e, %Y',
        /** @internal */
        month: '%B %Y',
        /** @internal */
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
     * @since 2.2
     */
    footerFormat: '',

    /**
     * The name of a symbol to use for the border around the tooltip
     * header. Applies only when [tooltip.split](#tooltip.split) is
     * enabled.
     *
     * Custom callbacks for symbol path generation can also be added to
     * `Highcharts.SVGRenderer.prototype.symbols` the same way as for
     * [series.marker.symbol](plotOptions.line.marker.symbol).
     *
     * @see [tooltip.shape](#tooltip.shape)
     *
     * @sample {highstock} stock/tooltip/split-positioner/
     *         Different shapes for header and split boxes
     *
     * @type       {Highcharts.TooltipShapeValue}
     * @validvalue ["callout", "square"]
     * @since      7.0
     */
    headerShape: 'callout',

    /**
     * The number of milliseconds to wait until the tooltip is hidden when
     * mouse out from a point or chart.
     *
     * @since 3.0
     */
    hideDelay: 500,

    /**
     * Padding inside the tooltip, in pixels.
     *
     * @since 5.0.0
     */
    padding: 8,

    /**
     * The name of a symbol to use for the border around the tooltip. Can
     * be one of: `"callout"`, `"circle"` or `"rect"`. When
     * [tooltip.split](#tooltip.split)
     * option is enabled, shape is applied to all boxes except header, which
     * is controlled by
     * [tooltip.headerShape](#tooltip.headerShape).
     *
     * Custom callbacks for symbol path generation can also be added to
     * `Highcharts.SVGRenderer.prototype.symbols` the same way as for
     * [series.marker.symbol](plotOptions.line.marker.symbol).
     *
     * @type  {Highcharts.TooltipShapeValue}
     * @since 4.0
     */
    shape: 'callout',

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
     * @since   2.1
     * @product highcharts highstock
     */
    shared: false,

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
     * @type    {number}
     * @default 10/25
     * @since   1.2.0
     * @product highcharts highstock
     */
    snap: isTouchDevice ? 25 : 10,

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
     * @type      {string}
     * @apioption tooltip.headerFormat
     */
    headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',

    /**
     * The HTML of the null point's line in the tooltip. Works analogously
     * to [pointFormat](#tooltip.pointFormat).
     *
     * @sample {highcharts} highcharts/plotoptions/series-nullformat
     *         Format data label and tooltip for null point.
     *
     * @type      {string}
     * @apioption tooltip.nullFormat
     */

    /**
     * The HTML of the point's line in the tooltip. Variables are enclosed
     * by curly brackets. Available variables are `point.x`, `point.y`,
     * `series.name` and `series.color` and other properties on the same
     * form. Furthermore, `point.y` can be extended by the
     * `tooltip.valuePrefix` and `tooltip.valueSuffix` variables. This can
     * also be overridden for each series, which makes it a good hook for
     * displaying units.
     *
     * In styled mode, the dot is colored by a class name rather
     * than the point color.
     *
     * @sample {highcharts} highcharts/tooltip/pointformat/
     *         A different point format with value suffix
     * @sample {highcharts|highstock} highcharts/tooltip/pointformat-extra-information/
     *         Show extra information about points in the tooltip
     * @sample {highmaps} maps/tooltip/format/
     *         Format demo
     *
     * @type       {string}
     * @since      2.2
     * @apioption  tooltip.pointFormat
     */
    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',

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
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    backgroundColor: color(Palette.neutralColor3)
        // @todo: Disallow undefined as input for colors
        .setOpacity(0.85).get() as any,

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
     */
    borderWidth: 1,

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
     * @type {boolean|Highcharts.ShadowOptionsObject}
     */
    shadow: true,

    /**
     * Prevents the tooltip from switching or closing when touched or
     * pointed.
     *
     * @sample highcharts/tooltip/stickoncontact/
     *         Tooltip sticks on pointer contact
     *
     * @since 8.0.1
     */
    stickOnContact: false,

    /**
     * CSS styles for the tooltip. The tooltip can also be styled through
     * the CSS class `.highcharts-tooltip`.
     *
     * Note that the default `pointerEvents` style makes the tooltip ignore
     * mouse events, so in order to use clickable tooltips, this value must
     * be set to `auto`.
     *
     * @sample {highcharts} highcharts/tooltip/style/
     *         Greater padding, bold text
     *
     * @type {Highcharts.CSSObject}
     */
    style: {
        /** @internal */
        color: Palette.neutralColor80,
        /** @internal */
        cursor: 'default',
        /** @internal */
        fontSize: '12px'
    },

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
     * @since 2.2
     */
    useHTML: false

};

/* *
 *
 *  Default Exports
 *
 * */

export default TooltipDefaults;
