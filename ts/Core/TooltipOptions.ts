/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { AlignValue, VerticalAlignValue } from './Renderer/AlignObject';
import type AnimationOptions from './Animation/AnimationOptions';
import type ColorType from './Color/ColorType';
import type CSSObject from './Renderer/CSSObject';
import type F from './Templating';
import type Point from './Series/Point';
import type ShadowOptionsObject from './Renderer/ShadowOptionsObject';
import type Time from './Time';
import type Tooltip from './Tooltip';

/* *
 *
 *  Declarations
 *
 * */

declare module './Options' {
    interface Options {
        tooltip?: TooltipOptions;
    }
}

declare module './Series/SeriesOptions' {
    interface SeriesOptions {
        tooltip?: Partial<TooltipOptions>;
    }
}

/**
 * Options for the tooltip that appears when the user hovers over a
 * series or point.
 */
export interface TooltipOptions {
    /**
     * Enable or disable animation of the tooltip.
     *
     * @since 2.3.0
     */
    animation: boolean|Partial<AnimationOptions>;
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
     */
    backgroundColor: ColorType;
    /**
     * The color of the tooltip border. When `undefined`, the border takes
     * the color of the corresponding series or point.
     *
     * Note that the [borderWidth](#tooltip.borderWidth) is usually 0 by
     * default, so the border color may not be visible until a border width
     * is set.
     *
     * @sample {highcharts} highcharts/tooltip/bordercolor-default/ Follow
     *         series by default
     * @sample {highcharts} highcharts/tooltip/bordercolor-black/ Black
     *         border
     * @sample {highstock} stock/tooltip/general/ Styled tooltip
     * @sample {highmaps} maps/tooltip/background-border/ Background and
     *         border demo
     */
    borderColor?: ColorType;
    /**
     * The radius of the rounded border corners.
     *
     * @sample {highcharts} highcharts/tooltip/bordercolor-default/
     *         Default border radius
     * @sample {highcharts} highcharts/tooltip/borderradius-0/
     *         Square borders
     * @sample {highmaps} maps/tooltip/background-border/
     *         Background and border demo
     *
     * @default 3
     */
    borderRadius: number;
    /**
     * The pixel width of the tooltip border. Defaults to 0 for single
     * tooltips and fixed tooltips, otherwise 1 for split tooltips.
     *
     * In styled mode, the stroke width is set in the
     * `.highcharts-tooltip-box` class.
     *
     * @sample {highcharts} highcharts/tooltip/bordercolor-default/
     *         2 pixels
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
    borderWidth?: number;
    /**
     * A CSS class name to apply to the tooltip's container div,
     * allowing unique CSS styling for each chart.
     */
    className?: string;
    /**
     * How many decimals to show for the `point.change`
     * or the `point.cumulativeSum` value when the `series.compare`
     * or the `series.cumulative` option is set.
     * This is overridable in each series' tooltip options object.
     *
     * @default   2
     * @since     1.0.1
     * @product   highstock
     */
    changeDecimals?: number;
    /**
     * Since 4.1, the crosshair definitions are moved to the Axis object
     * in order for a better separation from the tooltip. See
     * [xAxis.crosshair](#xAxis.crosshair).
     *
     * @sample {highcharts} highcharts/tooltip/crosshairs-x/
     *         Enable a crosshair for the x value
     *
     * @deprecated
     * @default   true
     */
    crosshairs?: any;
    /**
     * For series on datetime axes, the date format in the tooltip's
     * header will by default be guessed based on the closest data points.
     * This member gives the default string representations used for
     * each unit. For an overview of the string or object configuration, see
     * [dateFormat](/class-reference/Highcharts.Time#dateFormat).
     *
     * @see [xAxis.dateTimeLabelFormats](#xAxis.dateTimeLabelFormats)
     *
     * @product highcharts highstock gantt
     */
    dateTimeLabelFormats: Time.DateTimeLabelFormatsOption;
    /**
     * Distance from point to tooltip in pixels.
     *
     * @default   16
     */
    distance?: number;
    /**
     * Enable or disable the tooltip.
     *
     * @sample {highcharts} highcharts/tooltip/enabled/
     *         Disabled
     * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
     *         Disable tooltip and show values on chart instead
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Whether the tooltip should be fixed to one position in the chart, or
     * located next to the point or mouse. When the tooltip is fixed, the
     * position can be further specified with the
     * [tooltip.position](#tooltip.position) options set.
     *
     * @sample    highcharts/tooltip/fixed/
     *            Fixed tooltip and position options
     * @sample    {highstock} stock/tooltip/fixed/
     *            Stock chart with fixed tooltip
     * @sample    {highmaps} maps/tooltip/fixed/
     *            Map with fixed tooltip
     *
     * @default   false
     * @since     12.2.0
     */
    fixed?: boolean;
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
     * @sample highcharts/tooltip/followpointer/
     *         Tooltip follow pointer comparison
     *
     * @default   {highcharts} false
     * @default   {highstock} false
     * @default   {highmaps} true
     * @since     3.0
     */
    followPointer?: boolean;
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
     * @default   {highcharts} true
     * @default   {highstock} true
     * @default   {highmaps} false
     * @since     3.0.1
     */
    followTouchMove?: boolean;
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
    footerFormat: string;
    /**
     * A [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * for the whole shared tooltip. When format strings are a requirement,
     * it is usually more convenient to use `headerFormat`, `pointFormat`
     * and `footerFormat`, but the `format` option allows combining them
     * into one setting.
     *
     * The context of the format string is the same as that of the
     * `tooltip.formatter` callback.
     *
     * @sample {highcharts} highcharts/tooltip/format-shared/
     *         Format for shared tooltip
     *
     * @since     11.1.0
     */
    format?: string;
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
     * The context of the formatter (since v12) is the
     * [Point](https://api.highcharts.com/class-reference/Highcharts.Point)
     * instance. If the tooltip is shared or split, an array `this.points`
     * contains all points of the hovered x-value.
     *
     * Common properties from the Point to use in the formatter include:
     *
     * - **Point.percentage**:
     *   Stacked series and pies only. The point's percentage of the total.
     *
     * - **Point.points**:
     *   In a shared or split tooltip, this is an array containing all the
     *   hovered points.
     *
     * - **this.series**:
     *   The series object. The series name is available through
     *   `this.series.name`.
     *
     * - **this.total**:
     *   The total value at this point's x value in a stacked series, or the
     *   sum of all slices in a pie series.
     *
     * - **this.x**:
     *   The x value.
     *
     * - **this.y**:
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
     */
    formatter?: Tooltip.FormatterCallbackFunction;
    /**
     * The HTML of the tooltip header line. The context is the
     * [Point class](https://api.highcharts.com/class-reference/Highcharts.Point).
     * Variables are enclosed in curly brackets. Examples of common
     * variables to include are `x`, `y`, `series.name` and `series.color`
     * and other properties on the same form. The `point.key` variable
     * contains the category name, x value or datetime string depending on
     * the type of axis. For datetime axes, the `point.key` date format can
     * be set using `tooltip.xDateFormat`.
     *
     * @sample {highcharts} highcharts/tooltip/footerformat/
     *         An HTML table in the tooltip
     * @sample {highstock} highcharts/tooltip/footerformat/
     *         An HTML table in the tooltip
     * @sample {highmaps} maps/tooltip/format/
     *         Format demo
     *
     * @default <span style="font-size: 0.8em">{ucfirst point.key}</span><br/>
     */
    headerFormat: string;
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
     * @since   7.0
     */
    headerShape: Tooltip.ShapeValue;
    /**
     * The number of milliseconds to wait until the tooltip is hidden when
     * mouse out from a point or chart.
     *
     * @default 500
     * @since   3.0
     */
    hideDelay: number;
    /**
     * The HTML of the null point's line in the tooltip. Works analogously
     * to [pointFormat](#tooltip.pointFormat).
     *
     * @sample {highcharts} highcharts/series/null-interaction
     *         Line chart with null interaction
     * @sample {highcharts} highcharts/plotoptions/series-nullformat
     *         Heatmap with null interaction
     */
    nullFormat?: string;
    /**
     * Callback function to format the text of the tooltip for
     * visible null points.
     * Works analogously to [formatter](#tooltip.formatter).
     *
     * @sample highcharts/plotoptions/series-nullformat
     *         Format data label and tooltip for null point.
     */
    nullFormatter?: Tooltip.FormatterCallbackFunction;
    /**
     * Whether to allow the tooltip to render outside the chart's SVG
     * element box. By default (`false`), the tooltip is rendered within the
     * chart's SVG element, which results in the tooltip being aligned
     * inside the chart area. For small charts, this may result in clipping
     * or overlapping. When `true`, a separate SVG element is created and
     * overlaid on the page, allowing the tooltip to be aligned inside the
     * page itself. Beware that with this option active, CSS classes on the
     * chart's target container, with classnames matching the pattern
     * 'highcharts-*', will be set on the tooltip as well. This is done to
     * support theming for tooltips with this option.
     *
     * Defaults to `true` if `chart.scrollablePlotArea` is activated,
     * otherwise `false`.
     *
     * @sample highcharts/tooltip/outside
     *         Small charts with tooltips outside
     *
     * @since     6.1.1
     */
    outside?: boolean;
    /**
     * Padding inside the tooltip, in pixels.
     *
     * @default 8
     * @since 5.0.0
     */
    padding: number;
    /**
     * The HTML of the point's line in the tooltip. The context is the
     * [Point class](https://api.highcharts.com/class-reference/Highcharts.Point).
     * Variables are enclosed in curly brackets. Examples of common
     * variables to include are `x`, `y`, `series.name` and `series.color`
     * and other properties on the same form. Furthermore, `y` can be
     * extended by the `tooltip.valuePrefix` and `tooltip.valueSuffix`
     * variables. This can also be overridden for each series, which makes
     * it a good hook for displaying units.
     *
     * In styled mode, the dot is colored by a class name rather than the
     * point color.
     *
     * @sample {highcharts} highcharts/tooltip/pointformat/
     *         A different point format with value suffix
     * @sample {highcharts|highstock} highcharts/tooltip/pointformat-extra-information/
     *         Show extra information about points in the tooltip
     * @sample {highmaps} maps/tooltip/format/
     *         Format demo
     *
     * @default <span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>
     * @since   2.2
     */
    pointFormat: string;
    /**
     * A callback function for formatting the HTML output for a single point
     * in the tooltip. Like the `pointFormat` string, but with more
     * flexibility.
     *
     * @since     4.1.0
     */
    pointFormatter?: F.FormatterCallback<Point>;
    /**
     * Positioning options for fixed tooltip, taking effect only when
     * [tooltip.fixed](#tooltip.fixed) is `true`.
     *
     * @sample {highcharts} highcharts/tooltip/fixed/
     *         Fixed tooltip and position options
     * @sample {highstock} stock/tooltip/fixed/
     *         Stock chart with fixed tooltip
     * @sample {highmaps} maps/tooltip/fixed/
     *         Map with fixed tooltip
     *
     * @since 12.2.0
     */
    position: TooltipPositionOptions;
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
     * Since v12.2, the [tooltip.fixed](#tooltip.fixed) option combined with
     * [tooltip.position](#tooltip.position) covers most of the use cases
     * for custom tooltip positioning.
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
     * @see [position](#tooltip.position)
     *
     * @since     2.2.4
     */
    positioner?: Tooltip.PositionerCallbackFunction;
    /**
     * Whether to apply a drop shadow to the tooltip. Defaults to true,
     * unless the tooltip is [fixed](#tooltip.fixed).
     *
     * @sample {highcharts} highcharts/tooltip/bordercolor-default/
     *         True by default
     * @sample {highcharts} highcharts/tooltip/shadow/
     *         False
     * @sample {highmaps} maps/tooltip/positioner/
     *         Fixed tooltip position, border and shadow disabled
     */
    shadow?: (boolean|Partial<ShadowOptionsObject>);
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
     * Defaults to `callout` for floating tooltip, `rect` for
     * [fixed](#tooltip.fixed) tooltip.
     *
     * @since 4.0
     */
    shape?: Tooltip.ShapeValue;
    /**
     * Shows information in the tooltip for all points with the same X
     * value. When the tooltip is shared, the entire plot area will capture
     * mouse movement or touch events. Tooltip texts for series types with
     * ordered data (not pie, scatter, flags etc) will be shown in a single
     * bubble. This is recommended for single series charts and for
     * tablet/mobile optimized charts.
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
    shared: boolean;
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
     * @default 10
     *          Desktop
     * @default 25
     *          Mobile
     * @since   1.2.0
     * @product highcharts highstock
     */
    snap: number;
    /**
     * Shows tooltip for all points with the same X value. Splits the
     * tooltip into one label per series, with the header close to the axis.
     * This is recommended over [shared](#tooltip.shared)
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
     * @default   {highcharts} false
     * @default   {highstock} true
     * @since     5.0.0
     * @product   highcharts highstock
     */
    split?: boolean;
    /**
     * Prevents the tooltip from switching or closing, when touched or
     * pointed.
     *
     * @sample highcharts/tooltip/stickoncontact/
     *         Tooltip sticks on pointer contact
     *
     * @since     8.0.1
     */
    stickOnContact: boolean;
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
     */
    style: CSSObject;
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
     * @default   false
     * @since     2.2
     */
    useHTML: boolean;
    /** @deprecated */
    userOptions?: TooltipOptions;
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
     * @since     2.2
     */
    valueDecimals?: number;
    /**
     * A string to prepend to each series' y value. Overridable in each
     * series' tooltip options object.
     *
     * @sample {highcharts|highstock} highcharts/tooltip/valuedecimals/
     *         Set decimals, prefix and suffix for the value
     * @sample {highmaps} maps/tooltip/valuedecimals/
     *         Set decimals, prefix and suffix for the value
     *
     * @since     2.2
     */
    valuePrefix?: string;
    /**
     * A string to append to each series' y value. Overridable in each
     * series' tooltip options object.
     *
     * @sample {highcharts|highstock} highcharts/tooltip/valuedecimals/
     *         Set decimals, prefix and suffix for the value
     * @sample {highmaps} maps/tooltip/valuedecimals/
     *         Set decimals, prefix and suffix for the value
     *
     * @since     2.2
     */
    valueSuffix?: string;
    /**
     * The format for the date in the tooltip header if the X axis is a
     * datetime axis. The default is a best guess based on the smallest
     * distance between points in the chart.
     *
     * @sample {highcharts} highcharts/tooltip/xdateformat/
     *         A different format
     *
     * @product   highcharts highstock gantt
     */
    xDateFormat?: Time.DateTimeFormat;
}

interface TooltipPositionOptions {
    align?: AlignValue;
    relativeTo?: 'chart'|'pane'|'plotBox'|'spacingBox'
    verticalAlign?: VerticalAlignValue;
    x: number;
    y: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default TooltipOptions;
