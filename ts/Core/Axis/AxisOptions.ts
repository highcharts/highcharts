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

import type { AlignValue } from '../Renderer/AlignObject';
import type Axis from './Axis';
import type Chart from '../Chart/Chart';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type { DeepPartial } from '../../Shared/Types';
import type { EventCallback, FormatterCallback } from '../Callback';
import type GradientColor from '../Color/GradientColor';
import type { OptionsOverflowValue } from '../Options';
import type Point from '../Series/Point';
import type { SymbolKey } from '../Renderer/SVG/SymbolType';
import type {
    RangeSelectorButtonOptions
} from '../../Stock/RangeSelector/RangeSelectorOptions';
import type Tick from './Tick';
import type TickPositionsArray from './TickPositionsArray';
import type Time from '../Time';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Options'{
    /** @internal */
    interface DefaultOptions {
        xAxis?: DeepPartial<XAxisOptions>;
        yAxis?: DeepPartial<YAxisOptions>;
    }
    interface Options {

        /**
         * The X axis or category axis. Normally this is the horizontal axis,
         * though if the chart is inverted this is the vertical axis. In case of
         * multiple axes, the xAxis node is an array of configuration objects.
         *
         * See the [Axis class](/class-reference/Highcharts.Axis) for
         * programmatic access to the axis.
         *
         * @productdesc {highmaps}
         * In Highmaps, the axis is hidden, but it is used behind the scenes to
         * control features like zooming and panning. Zooming is in effect the
         * same as setting the extremes of one of the exes.
         */
        xAxis?: (DeepPartial<XAxisOptions>|Array<DeepPartial<XAxisOptions>>);

        /**
         * The Y axis or value axis. Normally this is the vertical axis,
         * though if the chart is inverted this is the horizontal axis.
         * In case of multiple axes, the yAxis node is an array of
         * configuration objects.
         *
         * See [the Axis object](/class-reference/Highcharts.Axis) for
         * programmatic access to the axis.
         */
        yAxis?: (DeepPartial<YAxisOptions>|Array<DeepPartial<YAxisOptions>>);

    }
}

export type AxisCollectionKey = ('colorAxis'|'xAxis'|'yAxis'|'zAxis');

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
 * @since   2.1
 * @product highstock
 */
export interface AxisCrosshairLabelOptions {

    /**
     * Alignment of the label compared to the axis. Defaults to `"left"` for
     * right-side axes, `"right"` for left-side axes and `"center"` for
     * horizontal axes.
     *
     * @since   2.1
     * @product highstock
     */
    align?: AlignValue;

    /**
     * The background color for the label. Defaults to the related series
     * color, or `#666666` if that is not available.
     *
     * @since   2.1
     * @product highstock
     */
    backgroundColor?: ColorType;

    /**
     * The border color for the crosshair label
     *
     * @since   2.1
     * @product highstock
     */
    borderColor?: ColorType;

    /**
     * The border corner radius of the crosshair label.
     *
     * @default 3
     * @since   2.1.10
     * @product highstock
     */
    borderRadius?: number;

    /**
     * The border width for the crosshair label.
     *
     * @default 0
     * @since   2.1
     * @product highstock
     */
    borderWidth?: number;

    /**
     * Flag to enable crosshair's label.
     *
     * @sample {highstock} stock/xaxis/crosshairs-xy/
     *         Enabled label for yAxis' crosshair
     *
     * @default false
     * @since   2.1
     * @product highstock
     */
    enabled?: boolean;

    /**
     * A format string for the crosshair label. Defaults to `{value}` for
     * numeric axes and `{value:%b %d, %Y}` for datetime axes.
     *
     * @since   2.1
     * @product highstock
     */
    format?: string;

    /**
     * Formatter function for the label text.
     *
     * @since   2.1
     * @product highstock
     */
    formatter?: FormatterCallback<Axis, number>;

    /**
     * Padding inside the crosshair label.
     *
     * @default 8
     * @since   2.1
     * @product highstock
     */
    padding?: number;

    /**
     * The shape to use for the label box.
     *
     * @default callout
     * @since   2.1
     * @product highstock
     */
    shape?: SymbolKey;

    /**
     * Text styles for the crosshair label.
     *
     * @default {"color": "white", "fontWeight": "normal", "fontSize": "11px", "textAlign": "center"}
     * @since   2.1
     * @product highstock
     */
    style?: CSSObject;

}

export interface AxisCrosshairOptions {

    /**
     * A class name for the crosshair, especially as a hook for styling.
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * The color of the crosshair. Defaults to `#cccccc` for numeric and
     * datetime axes, and `rgba(204,214,235,0.25)` for category axes, where
     * the crosshair by default highlights the whole category.
     *
     * @sample {highcharts|highstock|highmaps} highcharts/xaxis/crosshair-customized/
     *         Customized crosshairs
     *
     * @default #cccccc
     * @since   4.1
     */
    color?: ColorType;

    /**
     * The dash style for the crosshair. See
     * [plotOptions.series.dashStyle](#plotOptions.series.dashStyle)
     * for possible values.
     *
     * @sample {highcharts|highmaps} highcharts/xaxis/crosshair-dotted/
     *         Dotted crosshair
     * @sample {highstock} stock/xaxis/crosshair-dashed/
     *         Dashed X axis crosshair
     *
     * @default Solid
     * @since   4.1
     */
    dashStyle?: DashStyleValue;

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
     * @since   2.1
     * @product highstock
     */
    label?: AxisCrosshairLabelOptions;

    /**
     * Whether the crosshair should snap to the point or follow the pointer
     * independent of points.
     *
     * @sample {highcharts|highstock} highcharts/xaxis/crosshair-snap-false/
     *         True by default
     * @sample {highmaps} maps/demo/latlon-advanced/
     *         Snap is false
     *
     * @default true
     * @since   4.1
     */
    snap?: boolean;

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
     * @default 1
     * @since   4.1
     */
    width?: number;

    /**
     * The Z index of the crosshair. Higher Z indices allow drawing the
     * crosshair on top of the series or behind the grid lines.
     *
     * @default 2
     * @since   4.1
     */
    zIndex?: number;

}

export interface AxisEventsOptions {

    /**
     * An event fired after the breaks have rendered.
     *
     * @see [breaks](#xAxis.breaks)
     *
     * @sample {highcharts} highcharts/axisbreak/break-event/
     *         AfterBreak Event
     *
     * @since   4.1.0
     * @product highcharts gantt
     */
    afterBreaks?: EventCallback<Axis>;

    /**
     * As opposed to the `setExtremes` event, this event fires after the
     * final min and max values are computed and corrected for `minRange`.
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
     * @since 2.3
     */
    afterSetExtremes?: AxisSetExtremesEventCallback;

    /**
     * An event fired when a break from this axis occurs on a point.
     *
     * @see [breaks](#xAxis.breaks)
     *
     * @sample {highcharts} highcharts/axisbreak/break-visualized/
     *         Visualization of a Break
     *
     * @since   4.1.0
     * @product highcharts gantt
     */
    pointBreak?: AxisPointBreakEventCallback;

    /**
     * An event fired when a point falls inside a break from this axis.
     *
     * @product highcharts highstock gantt
     */
    pointInBreak?: AxisPointBreakEventCallback;

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
     * @since   1.2.0
     */
    setExtremes?: AxisSetExtremesEventCallback;

}

export type AxisLabelFormatterCallback = FormatterCallback<
    AxisLabelFormatterContextObject,
    AxisLabelFormatterContextObject
>;

export interface AxisLabelFormatterContextObject {

    /**
     * The axis item of the label
     */
    axis: Axis;

    /**
     * The chart instance.
     */
    chart: Chart;

    /**
     * Default formatting of date/time labels.
     */
    dateTimeLabelFormat?: Time.DateTimeFormat;

    /**
     * Whether the label belongs to the first tick on the axis.
     */
    isFirst: boolean;

    /**
     * Whether the label belongs to the last tick on the axis.
     */
    isLast: boolean;

    /**
     * The position on the axis in terms of axis values. For category axes, a
     * zero-based index. For datetime axes, the JavaScript time in milliseconds
     * since 1970.
     */
    pos: number;

    /**
     * The preformatted text as the result of the default formatting. For
     * example dates will be formatted as strings, and numbers with
     * language-specific comma separators, thousands separators and numeric
     * symbols like `k` or `M`.
     */
    text?: string;

    /**
     * The Tick instance.
     */
    tick: Tick;

    /**
     * This can be either a numeric value or a category string.
     */
    value: number|string;

}

export interface AxisLabelOptions {

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
     */
    align?: AlignValue;

    /**
     * Whether to allow the axis labels to overlap. When false,
     * overlapping labels are hidden.
     *
     * @sample {highcharts} highcharts/xaxis/labels-allowoverlap-true/
     *         X axis labels overlap enabled
     *
     * @default false
     */
    allowOverlap?: boolean;

    /**
     * For horizontal axes, the allowed degrees of label rotation
     * to prevent overlapping labels. If there is enough space,
     * labels are not rotated. As the chart gets narrower, it
     * will start rotating the labels -45 degrees, then remove
     * every second label and try again with rotations 0 and -45 etc.
     * Set it to `undefined` to disable rotation, which will
     * cause the labels to word-wrap if possible. Defaults to `[-45]``
     * on bottom and top axes, `undefined` on left and right axes.
     *
     * @sample {highcharts|highstock} highcharts/xaxis/labels-autorotation-default/
     *         Default auto rotation of 0 or -45
     * @sample {highcharts|highstock} highcharts/xaxis/labels-autorotation-0-90/
     *         Custom graded auto rotation
     *
     * @since   4.1.0
     * @product highcharts highstock gantt
     */
    autoRotation?: Array<number>;

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
     * @default 80
     * @since   4.1.5
     * @product highcharts gantt
     */
    autoRotationLimit: number;

    /**
     * The label's pixel distance from the perimeter of the plot area.
     * On cartesian charts, this is overridden if the `labels.y` setting
     * is set.
     *
     * @sample {highcharts} highcharts/yaxis/labels-distance/
     *         Polar chart, labels centered under the arc
     *
     * @default 15
     * @product highcharts gantt
     */
    distance: number;

    /**
     * Enable or disable the axis labels.
     *
     * @sample {highcharts} highcharts/xaxis/labels-enabled/
     *         X axis labels disabled
     * @sample {highstock} stock/xaxis/labels-enabled/
     *         X axis labels disabled
     */
    enabled: boolean;

    /**
     * A format string for the axis label. The context is available as
     * format string variables. For example, you can use `{text}` to
     * insert the default formatted text. The recommended way of adding
     * units for the label is using `text`, for example `{text} km`.
     *
     * To add custom numeric or datetime formatting, use `{value}` with
     * formatting, for example `{value:.1f}` or `{value:%Y-%m-%d}`.
     *
     * See
     * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * for more examples of formatting.
     *
     * The default value is not specified due to the dynamic
     * nature of the default implementation.
     *
     * @sample {highcharts|highstock} highcharts/yaxis/labels-format/
     *         Add units to Y axis label
     * @sample {highcharts} highcharts/xaxis/labels-format-linked/
     *         Linked category names
     * @sample {highcharts} highcharts/xaxis/labels-format-custom/
     *         Custom number format
     *
     * @since 3.0
     */
    format?: string;

    /**
     * Callback JavaScript function to format the label. The value
     * is given by `this.value`. Additional properties for `this` are
     * `axis`, `chart`, `isFirst`, `isLast` and `text` which holds the
     * value of the default formatter.
     *
     * Defaults to a built in function returning a formatted string
     * depending on whether the axis is `category`, `datetime`,
     * `numeric` or other.
     *
     * @sample {highcharts} highcharts/xaxis/labels-formatter-linked/
     *         Linked category names
     * @sample {highcharts} highcharts/xaxis/labels-formatter-extended/
     *         Modified numeric labels
     * @sample {highstock} stock/xaxis/labels-formatter/
     *         Added units on Y axis
     */
    formatter?: FormatterCallback<AxisLabelFormatterContextObject, AxisLabelFormatterContextObject>;

    /**
     * The number of pixels to indent the labels per level in a treegrid
     * axis.
     *
     * @sample gantt/treegrid-axis/demo
     *         Indentation 10px by default.
     * @sample gantt/treegrid-axis/indentation-0px
     *         Indentation set to 0px.
     *
     * @default 10
     * @product gantt
     */
    indentation: number;

    /**
     * How to handle overflowing labels on horizontal axis. If set to
     * `"allow"`, it will not be aligned at all. By default it
     * `"justify"` labels inside the chart area. If there is room to
     * move it, it will be aligned to the edge, else it will be removed.
     *
     * @default justify
     * @since   2.2.5
     */
    overflow: OptionsOverflowValue;

    /**
     * The pixel padding for axis labels, to ensure white space between
     * them. Defaults to 4 for horizontal axes, 1 for vertical.
     *
     * @default undefined
     * @product highcharts gantt
     */
    padding?: number;

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
     * @since   4.1.10
     * @product highcharts highstock gantt
     */
    reserveSpace?: boolean;

    /**
     * Rotation of the labels in degrees. When `undefined`, the
     * `autoRotation` option takes precedence.
     *
     * @sample {highcharts} highcharts/xaxis/labels-rotation/
     *         X axis labels rotated 90°
     *
     * @default 0
     */
    rotation?: number|'auto';

    /**
     * Horizontal axes only. The number of lines to spread the labels
     * over to make room or tighter labels. 0 disables staggering.
     *
     * @sample {highcharts} highcharts/xaxis/labels-staggerlines/
     *         Show labels over two lines
     * @sample {highstock} stock/xaxis/labels-staggerlines/
     *         Show labels over two lines
     *
     * @since 2.1
     */
    staggerLines: number;

    /**
     * To show only every _n_'th label on the axis, set the step to _n_.
     * Setting the step to 2 shows every other label.
     *
     * By default, when 0, the step is calculated automatically to avoid
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
     * @since 2.1
     */
    step: number;

    /**
     * CSS styles for the label. Use `lineClamp` to control wrapping of
     * category labels. Use `textOverflow: 'none'` to prevent ellipsis
     * (dots).
     *
     * In styled mode, the labels are styled with the
     * `.highcharts-axis-labels` class.
     *
     * @sample {highcharts} highcharts/xaxis/labels-style/
     *         Red X axis labels
     */
    style: CSSObject;

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the labels.
     */
    useHTML: boolean;

    /**
     * The x position offset of all labels relative to the tick
     * positions on the axis. Overrides the `labels.distance` option.
     */
    x?: number;

    /**
     * The y position offset of all labels relative to the tick
     * positions on the axis. Overrides the `labels.distance` option.
     *
     * @sample {highcharts} highcharts/xaxis/labels-x/
     *         X axis labels placed on grid lines
     */
    y?: number;

    /**
     * The Z index for the axis labels.
     *
     * @see [axis.zIndex](#xAxis.zIndex)
     * @see [axis.gridZIndex](#xAxis.gridZIndex)
     *
     * @default 7
     */
    zIndex: number;

}

export interface AxisOptions {

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
     * @product highcharts highstock gantt
     */
    alignTicks: boolean;

    /**
     * Whether to allow decimals in this axis' ticks. When counting
     * integers, like persons or hits on a web page, decimals should
     * be avoided in the labels. By default, decimals are allowed on small
     * scale axes.
     *
     * @see [minTickInterval](#xAxis.minTickInterval)
     *
     * @sample {highcharts|highstock} highcharts/yaxis/allowdecimals-true/
     *         True by default
     * @sample {highcharts|highstock} highcharts/yaxis/allowdecimals-false/
     *         False
     *
     * @default   undefined
     */
    allowDecimals?: boolean;

    /**
     * When using an alternate grid color, a band is painted across the
     * plot area between every other grid line.
     *
     * @sample {highcharts} highcharts/yaxis/alternategridcolor/
     *         Alternate grid color on the Y axis
     * @sample {highstock} stock/xaxis/alternategridcolor/
     *         Alternate grid color on the Y axis
     */
    alternateGridColor?: ColorType;

    /**
     * If categories are present for the xAxis, names are used instead of
     * numbers for that axis.
     *
     * Since Highcharts 3.0, categories can also
     * be extracted by giving each point a [name](#series.data) and setting
     * axis [type](#xAxis.type) to `category`. However, if you have multiple
     * series, best practice remains defining the `categories` array.
     *
     * Example: `categories: ['Apples', 'Bananas', 'Oranges']`
     *
     * @sample {highcharts} highcharts/demo/line-labels/
     *         With
     * @sample {highcharts} highcharts/xaxis/categories/
     *         Without
     *
     * @type      {Array<string>}
     * @product   highcharts gantt
     * @apioption xAxis.categories
     */
    categories?: Array<string>|boolean;

    /**
     * The highest allowed value for automatically computed axis extremes.
     *
     * @see [floor](#xAxis.floor)
     *
     * @sample {highcharts|highstock} highcharts/yaxis/floor-ceiling/
     *         Floor and ceiling
     *
     * @since   4.0
     * @product highcharts highstock gantt
     */
    ceiling?: number;

    /**
     * A class name that opens for styling the axis by CSS, especially in
     * Highcharts styled mode. The class name is applied to group elements
     * for the grid, axis elements and labels.
     *
     * @sample {highcharts|highstock|highmaps} highcharts/css/axis/
     *         Multiple axes with separate styling
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * Configure a crosshair that follows either the mouse pointer or the
     * hovered point.
     *
     * In styled mode, the crosshairs are styled in the
     * `.highcharts-crosshair`, `.highcharts-crosshair-thin` or
     * `.highcharts-xaxis-category` classes.
     *
     * @productdesc {highstock}
     * In Highcharts stock, by default, the crosshair is enabled on the
     * X axis and disabled on the Y axis.
     *
     * @sample {highcharts} highcharts/xaxis/crosshair-both/
     *         Crosshair on both axes
     * @sample {highstock} stock/xaxis/crosshairs-xy/
     *         Crosshair on both axes, with y axis label
     * @sample {highmaps} highcharts/xaxis/crosshair-both/
     *         Crosshair on both axes
     *
     * @default false
     * @since   4.1
     */
    crosshair?: (boolean|AxisCrosshairOptions);

    /**
     * The value on a perpendicular axis where this axis should cross. This
     * is typically used on mathematical plots where the axes cross at 0.
     * When `crossing` is set, space will not be reserved at the sides of
     * the chart for axis labels and title, so those may be clipped. In this
     * case it is better to place the axes without the `crossing` option.
     *
     * @sample highcharts/xaxis/crossing
     *         Function plot with axes crossing at 0
     *
     * @since 11.0.1
     */
    crossing?: number;

    /**
     * Whether to force the axis to end on a tick. Use this option with
     * the `maxPadding` option to control the axis end.
     *
     * @productdesc {highstock}
     * In Highcharts Stock, `endOnTick` is always `false` when the navigator
     * is enabled, to prevent jumpy scrolling. With disabled navigator
     * enabling `endOnTick` may lead to extending the xAxis to show the last
     * tick, therefore range selector buttons may not have an active state
     * if the axis gets extended.
     *
     * @sample {highcharts} highcharts/yaxis/endontick/
     *         True by default
     * @sample {highcharts} highcharts/yaxis/endontick-false/
     *         False
     * @sample {highstock} stock/demo/basic-line/
     *         True by default
     * @sample {highstock} stock/xaxis/endontick/
     *         False
     *
     * @since 1.2.0
     */
    endOnTick: boolean;

    /**
     * Event handlers for the axis.
     */
    events?: AxisEventsOptions;

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
     * @since   4.0
     * @product highcharts highstock gantt
     */
    floor?: number;

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
     * @default #e6e6e6
     */
    gridLineColor: ColorType;

    /**
     * The dash or dot style of the grid lines. For possible values, see
     * [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
     *
     * @sample {highcharts} highcharts/yaxis/gridlinedashstyle/
     *         Long dashes
     * @sample {highstock} stock/xaxis/gridlinedashstyle/
     *         Long dashes
     *
     * @since  1.2
     */
    gridLineDashStyle: DashStyleValue;

    /**
     * The width of the grid lines extending the ticks across the plot area.
     * Defaults to 1 on the Y axis and 0 on the X axis, except for 3d
     * charts.
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
     */
    gridLineWidth?: number;

    /**
     * The Z index of the grid lines.
     *
     * @sample {highcharts|highstock} highcharts/xaxis/gridzindex/
     *         A Z index of 4 renders the grid above the graph
     *
     * @see [axis.zIndex](#xAxis.zIndex)
     * @see [axis.labels.zIndex](#xAxis.labels.zIndex)
     *
     * @product highcharts highstock gantt
     */
    gridZIndex: number;

    /**
     * The height as the vertical axis. If it's a number, it is
     * interpreted as pixels.
     *
     * Since Highcharts 2: If it's a percentage string, it is interpreted
     * as percentages of the total plot height.
     *
     * @sample {highcharts} highcharts/xaxis/axis-position-properties
     *         Different axis position properties
     *
     * @product highcharts highstock
     */
    height?: (number|string);

    /**
     * An id for the axis. This can be used after render time to get
     * a pointer to the axis object through `chart.get()`.
     *
     * @sample {highcharts} highcharts/xaxis/id/
     *         Get the object
     * @sample {highstock} stock/xaxis/id/
     *         Get the object
     *
     * @since 1.2.0
     */
    id?: string;

    /**
     * The axis labels show the number or category for each tick.
     *
     * Since v8.0.0: Labels are animated in categorized x-axis with
     * updating data if `tickInterval` and `step` is set to 1.
     *
     * @productdesc {highmaps}
     * X and Y axis labels are by default disabled in Highmaps, but the
     * functionality is inherited from Highcharts and used on `colorAxis`,
     * and can be enabled on X and Y axes too.
     */
    labels: AxisLabelOptions;

    /**
     * The left position as the horizontal axis. If it's a number, it is
     * interpreted as pixel position relative to the chart.
     *
     * Since Highcharts v5.0.13: If it's a percentage string, it is
     * interpreted as percentages of the plot width, offset from plot area
     * left.
     *
     * @sample {highcharts} highcharts/xaxis/axis-position-properties
     *         Different axis position properties
     *
     * @product highcharts highstock
     */
    left?: (number|string);

    /**
     * The color of the line marking the axis itself.
     *
     * In styled mode, the line stroke is given in the
     * `.highcharts-axis-line` or `.highcharts-xaxis-line` class.
     *
     * @sample {highcharts} highcharts/yaxis/linecolor/
     *         A red line on Y axis
     * @sample {highcharts|highstock} highcharts/css/axis/
     *         Axes in styled mode
     * @sample {highstock} stock/xaxis/linecolor/
     *         A red line on X axis
     */
    lineColor: ColorType;

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
     * @default {highcharts|highstock} 1
     * @default {highmaps} 0
     */
    lineWidth: number;

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
     * @since   2.0.2
     * @product highcharts highstock gantt
     */
    linkedTo?: number;

    /**
     * If there are multiple axes on the same side of the chart, the pixel
     * margin between the axes. Defaults to 0 on vertical axes, 15 on
     * horizontal axes.
     *
     * @since 7.0.3
     */
    margin?: number;

    /**
     * The maximum value of the axis. If `undefined`, the max value is
     * automatically calculated.
     *
     * If a datetime string is passed, it is parsed into epoch time
     * according to the time zone given in [time.timezone](#time.timezone).
     *
     * If the [endOnTick](#yAxis.endOnTick) option is true, the `max` value
     * might be rounded up.
     *
     * If a [tickAmount](#yAxis.tickAmount) is set, the axis may be extended
     * beyond the set max in order to reach the given number of ticks. The
     * same may happen in a chart with multiple axes, determined by [chart.
     * alignTicks](#chart.alignTicks), where a `tickAmount` is applied internally.
     *
     * @sample {highcharts} highcharts/yaxis/max-200/
     *         Y axis max of 200
     * @sample {highcharts} highcharts/yaxis/max-logarithmic/
     *         Y axis max on logarithmic axis
     * @sample {highstock} stock/xaxis/min-max/
     *         Fixed min and max on X axis
     */
    max?: (null|number|string);

    /**
     * Padding of the max value relative to the length of the axis. A
     * padding of 0.05 will make a 100px axis 5px longer. This is useful
     * when you don't want the highest data value to appear on the edge
     * of the plot area. When the axis' `max` option is set or a max extreme
     * is set using `axis.setExtremes()`, the maxPadding will be ignored.
     *
     * @productdesc {highstock}
     * For an [ordinal](#xAxis.ordinal) axis, `minPadding` and `maxPadding`
     * are ignored. Use [overscroll](#xAxis.overscroll) instead.
     *
     * @sample {highcharts} highcharts/yaxis/maxpadding/
     *         Max padding of 0.25 on y axis
     * @sample {highstock} stock/xaxis/minpadding-maxpadding/
     *         Greater min- and maxPadding
     * @sample {highmaps} maps/chart/plotbackgroundcolor-gradient/
     *         Add some padding
     *
     * @default {highcharts} 0.01
     * @default {highstock|highmaps} 0
     * @since   1.2.0
     */
    maxPadding: number;

    /** @internal */
    maxRange?: number;

    /**
     * Deprecated. Use `minRange` instead.
     *
     * @deprecated
     * @product highcharts highstock
     */
    maxZoom?: number;

    /**
     * The minimum value of the axis. If `undefined`, the min value is
     * automatically calculated.
     *
     * If a datetime string is passed, it is parsed into epoch time
     * according to the time zone given in [time.timezone](#time.timezone).
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
     */
    min?: (null|number|string);

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
     * @type    {Highcharts.ColorType}
     * @default #f2f2f2
     */
    minorGridLineColor: ColorType;

    /**
     * The dash or dot style of the minor grid lines. For possible values,
     * see [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
     *
     * @sample {highcharts} highcharts/yaxis/minorgridlinedashstyle/
     *         Long dashes on minor grid lines
     * @sample {highstock} stock/xaxis/minorgridlinedashstyle/
     *         Long dashes on minor grid lines
     *
     * @since 1.2
     */
    minorGridLineDashStyle: DashStyleValue;

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
     */
    minorGridLineWidth: number;

    /**
     * Color for the minor tick marks.
     *
     * @sample {highcharts} highcharts/yaxis/minortickcolor/
     *         Black tick marks on Y axis
     * @sample {highstock} stock/xaxis/minorticks/
     *         Black tick marks on Y axis
     *
     * @default #999999
     */
    minorTickColor: ColorType;

    /**
     * Specific tick interval in axis units for the minor ticks. On a linear
     * axis, if `"auto"`, the minor tick interval is calculated as a fifth
     * of the tickInterval. If `undefined`, minor ticks are not shown.
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
     *         Undefined by default
     * @sample {highcharts} highcharts/yaxis/minortickinterval-5/ 5 units
     * @sample {highcharts} highcharts/yaxis/minortickinterval-log-auto/
     *         "auto"
     * @sample {highcharts} highcharts/yaxis/minortickinterval-log/ 0.1
     * @sample {highstock} stock/demo/basic-line/ Null by default
     * @sample {highstock} stock/xaxis/minortickinterval-auto/ "auto"
     */
    minorTickInterval?: ('auto'|number);

    /**
     * The pixel length of the minor tick marks.
     *
     * @sample {highcharts} highcharts/yaxis/minorticklength/
     *         10px on Y axis
     * @sample {highstock} stock/xaxis/minorticks/
     *         10px on Y axis
     *
     * @default 2
     */
    minorTickLength: number;

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
     * @default outside
     */
    minorTickPosition: AxisTickPositionValue;

    /**
     * Enable or disable minor ticks. The interval between the minor ticks
     * can be controlled either by the
     * [minorTicksPerMajor](#xAxis.minorTicksPerMajor) setting, or as an
     * absolute [minorTickInterval](#xAxis.minorTickInterval) value.
     *
     * On a logarithmic axis, minor ticks are laid out based on a best
     * guess, attempting to enter an approximate number of minor ticks
     * between each major tick based on
     * [minorTicksPerMajor](#xAxis.minorTicksPerMajor).
     *
     * Prior to v6.0.0, ticks were enabled in auto layout by setting
     * `minorTickInterval` to `"auto"`.
     *
     * @productdesc {highcharts} On axes using
     * [categories](#xAxis.categories), minor ticks are not supported.
     *
     * @sample {highcharts} highcharts/yaxis/minorticks-true/ Enabled on
     *         linear Y axis
     *
     * @default false
     * @since   6.0.0
     */
    minorTicks?: boolean;

    /**
     * The number of minor ticks per major tick. Works for `linear`,
     * `logarithmic` and `datetime` axes.
     *
     * @sample {highcharts} highcharts/yaxis/minortickspermajor/
     *         2 minor ticks per major tick on Y axis
     *
     * @default 5
     * @since   11.0.0
     */
    minorTicksPerMajor: number;

    /**
     * The pixel width of the minor tick mark.
     *
     * @sample {highcharts} highcharts/yaxis/minortickwidth/
     *         3px width
     * @sample {highstock} stock/xaxis/minorticks/
     *         1px width
     *
     * @default 0
     */
    minorTickWidth?: number;

    /**
     * Padding of the min value relative to the length of the axis. A
     * padding of 0.05 will make a 100px axis 5px longer. This is useful
     * when you don't want the lowest data value to appear on the edge
     * of the plot area. When the axis' `min` option is set or a min extreme
     * is set using `axis.setExtremes()`, the minPadding will be ignored.
     *
     * @productdesc {highstock}
     * For an [ordinal](#xAxis.ordinal) axis, `minPadding` and `maxPadding`
     * are ignored. Use [overscroll](#xAxis.overscroll) instead.
     *
     * @sample {highcharts} highcharts/yaxis/minpadding/
     *         Min padding of 0.2
     * @sample {highstock} stock/xaxis/minpadding-maxpadding/
     *         Greater min- and maxPadding
     * @sample {highmaps} maps/chart/plotbackgroundcolor-gradient/
     *         Add some padding
     *
     * @default {highcharts} 0.01
     * @default {highstock|highmaps} 0
     * @since   1.2.0
     * @product highcharts highstock gantt
     */
    minPadding: number;

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
     * **Note**: The `minPadding`, `maxPadding`, `startOnTick` and
     * `endOnTick` settings also affect how the extremes of the axis
     * are computed.
     *
     * @sample {highcharts} highcharts/xaxis/minrange/
     *         Minimum range of 5
     * @sample {highstock} stock/xaxis/minrange/
     *         Max zoom of 6 months overrides user selections
     */
    minRange?: number;

    /**
     * The minimum tick interval allowed in axis values. For example on
     * zooming in on an axis with daily data, this can be used to prevent
     * the axis from showing hours. Defaults to the closest distance between
     * two points on the axis.
     *
     * @since 2.3.0
     */
    minTickInterval?: number;

    /**
     * The distance in pixels from the plot area to the axis line.
     * A positive offset moves the axis with it's line, labels and ticks
     * away from the plot area. This is typically used when two or more
     * axes are displayed on the same side of the plot. With multiple
     * axes the offset is dynamically adjusted to avoid collision, this
     * can be overridden by setting offset explicitly.
     *
     * @sample {highcharts} highcharts/yaxis/offset/
     *         Y axis offset of 70
     * @sample {highcharts} highcharts/yaxis/offset-centered/
     *         Axes positioned in the center of the plot
     * @sample {highstock} stock/xaxis/offset/
     *         Y axis offset by 70 px
     */
    offset?: number;

    /** @internal */
    offsets?: [number, number, number, number];

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
     * @default {highcharts|highstock|highmaps} false
     * @default {gantt} true
     */
    opposite?: boolean;

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
     * For an ordinal axis, `minPadding` and `maxPadding` are ignored. Use
     * [overscroll](#xAxis.overscroll) instead.
     *
     * @sample {highstock} stock/xaxis/ordinal-true/
     *         True by default
     * @sample {highstock} stock/xaxis/ordinal-false/
     *         False
     *
     * @see [overscroll](#xAxis.overscroll)
     *
     * @default true
     * @since   1.1
     * @product highstock
     */
    ordinal?: boolean;

    /**
     * Additional range on the right side of the xAxis. Works similar to
     * `xAxis.maxPadding`, but the value is set in terms of axis values,
     * percentage or pixels.
     *
     * If it's a number, it is interpreted as axis values, which in a
     * datetime axis equals milliseconds.
     *
     * If it's a percentage string, is interpreted as percentages of axis
     * length. An overscroll of 50% will make a 100px axis 50px longer.
     *
     * If it's a pixel string, it is interpreted as a fixed pixel value, but
     * limited to 90% of the axis length.
     *
     * @sample {highstock} stock/xaxis/overscroll/ One minute overscroll
     *         with live data
     * @sample {highstock} stock/xaxis/overscroll-percent/ Overscroll set in
     *         percentage
     * @sample {highstock} stock/xaxis/overscroll-pixel/ Overscroll set in
     *         pixels
     *
     * @default 0
     * @since   6.0.0
     * @product highstock
     */
    overscroll?: number | string;

    /**
     * Refers to the index in the [panes](#panes) array. Used for circular
     * gauges and polar charts. When the option is not set then first pane
     * will be used.
     *
     * @sample highcharts/demo/gauge-vu-meter
     *         Two gauges with different center
     *
     * @product highcharts
     */
    pane?: number;

    /**
     * Whether to pan axis. If `chart.panning` is enabled, the option
     * allows to disable panning on an individual axis.
     */
    panningEnabled: boolean;

    /**
     * The zoomed range to display when only defining one or none of `min`
     * or `max`. For example, to show the latest month, a range of one month
     * can be set.
     *
     * @sample {highstock} stock/xaxis/range/
     *         Setting a zoomed range when the rangeSelector is disabled
     *
     * @product highstock
     */
    range?: number;

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
     * @type      {boolean}
     */
    reversed?: boolean;

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
     * @since   6.1.1
     * @product highcharts highstock
     */
    reversedStacks: boolean;

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
     * @since 1.1
     */
    showEmpty: boolean;

    /**
     * Whether to show the first tick label.
     *
     * @sample {highcharts} highcharts/xaxis/showfirstlabel-false/
     *         Set to false on X axis
     * @sample {highstock} stock/xaxis/showfirstlabel/
     *         Labels below plot lines on Y axis
     */
    showFirstLabel: boolean;

    /**
     * Whether to show the last tick label. Defaults to `true` on cartesian
     * charts, and `false` on polar charts.
     *
     * @sample {highcharts} highcharts/xaxis/showlastlabel-true/
     *         Set to true on X axis
     * @sample {highstock} stock/xaxis/showfirstlabel/
     *         Labels below plot lines on Y axis
     *
     * @product highcharts highstock gantt
     */
    showLastLabel: boolean;

    /** @internal */
    side?: number;

    /**
     * A soft maximum for the axis. If the series data maximum is less than
     * this, the axis will stay at this maximum, but if the series data
     * maximum is higher, the axis will flex to show all data.
     *
     * @sample highcharts/yaxis/softmin-softmax/
     *         Soft min and max
     *
     * @since   5.0.1
     * @product highcharts highstock gantt
     */
    softMax?: number;

    /**
     * A soft minimum for the axis. If the series data minimum is greater
     * than this, the axis will stay at this minimum, but if the series
     * data minimum is lower, the axis will flex to show all data.
     *
     * @sample highcharts/yaxis/softmin-softmax/
     *         Soft min and max
     *
     * @since   5.0.1
     * @product highcharts highstock gantt
     */
    softMin?: number;

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
     * @default 1
     * @product highcharts highstock gantt
     */
    startOfWeek: number;

    /**
     * Whether to force the axis to start on a tick. Use this option with
     * the `minPadding` option to control the axis start.
     *
     * @productdesc {highstock}
     * In Highcharts Stock, `startOnTick` is always `false` when
     * the navigator is enabled, to prevent jumpy scrolling.
     *
     * @sample {highcharts} highcharts/xaxis/startontick-false/
     *         False by default
     * @sample {highcharts} highcharts/xaxis/startontick-true/
     *         True
     *
     * @default false
     * @since   1.2.0
     */
    startOnTick: boolean;

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
     * @since   4.1.0
     * @product highcharts highstock gantt
     */
    tickAmount?: number;

    /**
     * Color for the main tick marks.
     *
     * In styled mode, the stroke is given in the `.highcharts-tick`
     * class.
     *
     * @sample {highcharts} highcharts/xaxis/tickcolor/
     *         Red ticks on X axis
     * @sample {highcharts|highstock} highcharts/css/axis-grid/
     *         Styled mode
     * @sample {highstock} stock/xaxis/ticks/
     *         Formatted ticks on X axis
     */
    tickColor: ColorType;

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
     * @see [tickPixelInterval](#xAxis.tickPixelInterval)
     * @see [tickPositions](#xAxis.tickPositions)
     * @see [tickPositioner](#xAxis.tickPositioner)
     *
     * @sample {highcharts} highcharts/xaxis/tickinterval-5/
     *         Tick interval of 5 on a linear axis
     * @sample {highstock} stock/xaxis/tickinterval/
     *         Tick interval of 0.01 on Y axis
     */
    tickInterval?: number;

    /**
     * The pixel length of the main tick marks.
     *
     * @sample {highcharts} highcharts/xaxis/ticklength/
     *         20 px tick length on the X axis
     * @sample {highstock} stock/xaxis/ticks/
     *         Formatted ticks on X axis
     */
    tickLength: number;

    /**
     * For categorized axes only. If `on` the tick mark is placed in the
     * center of the category, if `between` the tick mark is placed between
     * categories. The default is `between` if the `tickInterval` is 1, else
     * `on`. In order to render tick marks on a category axis it is necessary
     * to provide a [tickWidth](#xAxis.tickWidth).
     *
     * @sample {highcharts} highcharts/xaxis/tickmarkplacement-between/
     *         "between" by default
     * @sample {highcharts} highcharts/xaxis/tickmarkplacement-on/
     *         "on"
     *
     * @product highcharts gantt
     * @default between
     */
    tickmarkPlacement: ('between'|'on');

    /**
     * If tickInterval is `null` this option sets the approximate pixel
     * interval of the tick marks. Not applicable to categorized axis.
     *
     * The tick interval is also influenced by the [minTickInterval](
     * #xAxis.minTickInterval) option, that, by default prevents ticks from
     * being denser than the data points.
     *
     * @see [tickInterval](#xAxis.tickInterval)
     * @see [tickPositioner](#xAxis.tickPositioner)
     * @see [tickPositions](#xAxis.tickPositions)
     *
     * @sample {highcharts} highcharts/xaxis/tickpixelinterval-50/
     *         50 px on X axis
     * @sample {highstock} stock/xaxis/tickpixelinterval/
     *         200 px on X axis
     */
    tickPixelInterval: number;

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
     * @default outside
     */
    tickPosition: AxisTickPositionValue;

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
     */
    tickPositioner?: AxisTickPositionerCallback;

    /**
     * An array defining where the ticks are laid out on the axis. This
     * overrides the default behaviour of [tickPixelInterval](
     * #xAxis.tickPixelInterval) and [tickInterval](#xAxis.tickInterval).
     *
     * Note: When working with date-time axes, be aware of time zone
     * handling. See the [documentation on time options](https://www.highcharts.com/docs/chart-concepts/axes#datetime)
     * for best practices.
     *
     * @see [tickPositioner](#xAxis.tickPositioner)
     *
     * @sample {highcharts} highcharts/xaxis/tickpositions-tickpositioner/
     *         Demo of tickPositions and tickPositioner
     * @sample {highstock} highcharts/xaxis/tickpositions-tickpositioner/
     *         Demo of tickPositions and tickPositioner
     */
    tickPositions?: TickPositionsArray;

    /**
     * The pixel width of the major tick marks. Defaults to 0 on category
     * axes, otherwise 1.
     *
     * In styled mode, the stroke width is given in the `.highcharts-tick`
     * class, but in order for the element to be generated on category axes,
     * the option must be explicitly set to 1.
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
     * @default {highstock} 1
     * @default {highmaps} 0
     */
    tickWidth?: number;

    /**
     * The axis title, showing next to the axis line.
     *
     * @productdesc {highmaps}
     * In Highmaps, the axis is hidden by default, but adding an axis title
     * is still possible. X axis and Y axis titles will appear at the bottom
     * and left by default.
     */
    title: AxisTitleOptions;

    /**
     * The top position as the vertical axis. If it's a number, it is
     * interpreted as pixel position relative to the chart.
     *
     * Since Highcharts 2: If it's a percentage string, it is interpreted
     * as percentages of the plot height, offset from plot area top.
     *
     * @sample {highcharts} highcharts/xaxis/axis-position-properties
     *         Different axis position properties
     *
     * @product highcharts highstock
     */
    top?: (number|string);

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
     * @default linear
     * @product highcharts gantt
     */
    type?: AxisTypeValue;

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
     * @since   4.2.7
     * @product highcharts gantt
     * @default true
     */
    uniqueNames?: boolean;

    /**
     * Whether axis, including axis title, line, ticks and labels, should
     * be visible.
     *
     * @since   4.1.9
     * @product highcharts highstock gantt
     */
    visible: boolean;

    /**
     * The width as the horizontal axis. If it's a number, it is interpreted
     * as pixels.
     *
     * Since Highcharts v5.0.13: If it's a percentage string, it is
     * interpreted as percentages of the total plot width.
     *
     * @sample {highcharts} highcharts/xaxis/axis-position-properties
     *         Different axis position properties
     *
     * @product highcharts highstock
     */
    width?: (number|string);

    /**
     * The Z index for the axis group.
     *
     * @see [axis.gridZIndex](#xAxis.gridZIndex)
     * @see [axis.labels.zIndex](#xAxis.labels.zIndex)
     */
    zIndex: number;

    /**
     * Whether to zoom axis. If `chart.zoomType` is set, the option allows
     * to disable zooming on an individual axis.
     *
     * @sample {highcharts} highcharts/xaxis/zoomenabled/
     *         Zoom enabled is false
     */
    zoomEnabled: boolean;
}

export interface AxisPointBreakEventCallback {
    (this: Axis, evt: AxisPointBreakEventObject): void;
}

export interface AxisPointBreakEventObject {
    brk: Record<string, number>;
    point: Point;
    preventDefault: Function;
    target: SVGElement;
    type: ('pointBreak'|'pointInBreak');
}

export interface AxisSetExtremesEventCallback {
    (this: Axis, evt: AxisSetExtremesEventObject): void;
}

export interface AxisSetExtremesEventObject extends Axis.ExtremesObject {
    DOMEvent?: any;
    max: number;
    min: number;
    move?: number;
    preventDefault: Function;
    rangeSelectorButton?: RangeSelectorButtonOptions;
    scale?: number;
    target: SVGElement;
    trigger?: string;
    triggerOp?: string;
    type: 'setExtremes';
}

export interface AxisTickPositionerCallback {
    (
        this: Axis,
        min: number,
        max: number
    ): (TickPositionsArray|undefined);
}

export type AxisTickPositionValue = ('inside'|'outside');

export interface AxisTitleOptions {

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
     * @default middle
     */
    align: ('high'|'low'|'middle');

    /**
     * Deprecated. Set the `text` to `undefined` to disable the title.
     *
     * @deprecated
     * @product highcharts
     */
    enabled?: boolean;

    /**
     * The pixel distance between the axis labels or line and the title.
     * Defaults to 0 for horizontal axes, 10 for vertical
     *
     * @sample {highcharts} highcharts/xaxis/title-margin/
     *         Y axis title margin of 60
     */
    margin?: number;

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
     * @since 2.2.0
     */
    offset?: number;

    /**
     * Whether to reserve space for the title when laying out the axis.
     *
     * @default true
     * @since   5.0.11
     * @product highcharts highstock gantt
     */
    reserveSpace?: boolean;

    /**
     * The rotation of the text in degrees. 0 is horizontal, 270 is
     * vertical reading from bottom to top. Defaults to 0 for horizontal
     * axes, 270 for left-side axes and 90 for right-side axes.
     *
     * @sample    {highcharts} highcharts/yaxis/title-offset/
     *            Horizontal
     */
    rotation?: number;

    /**
     * CSS styles for the title. If the title text is longer than the
     * axis length, it will wrap to multiple lines by default. This can
     * be customized by setting the `lineClamp` property, by setting a
     * specific `width` or by setting `whiteSpace: 'nowrap'`.
     *
     * In styled mode, the stroke width is given in the
     * `.highcharts-axis-title` class.
     *
     * @sample {highcharts} highcharts/xaxis/title-style/
     *         Red
     * @sample {highcharts} highcharts/css/axis/
     *         Styled mode
     */
    style: CSSObject;

    /**
     * The actual text of the axis title. It can contain basic HTML tags
     * like `b`, `i` and `span` with style.
     *
     * @sample {highcharts} highcharts/xaxis/title-text/
     *         Custom HTML
     * @sample {highstock} stock/xaxis/title-text/
     *         Titles for both axes
     */
    text?: (string|null);

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
     */
    textAlign?: AlignValue;

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the axis title.
     *
     * @product highcharts highstock gantt
     */
    useHTML: boolean;

    /**
     * Horizontal pixel offset of the title position.
     *
     * @since   4.1.6
     * @product highcharts highstock gantt
     */
    x: number;

    /**
     * Vertical pixel offset of the title position.
     *
     * @product highcharts highstock gantt
     */
    y: number;

}

export type AxisTypeValue = (
    | 'category'
    | 'datetime'
    | 'linear'
    | 'logarithmic'
    | 'treegrid'
);

export interface XAxisOptions extends AxisOptions {
    // Nothing here yet
}

export interface YAxisOptions extends AxisOptions {

    /**
     * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
     * to represent the maximum value of the Y axis.
     *
     * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/
     *         Min and max colors
     *
     * @default #003399
     * @since   4.0
     * @product highcharts
     */
    maxColor?: ColorType;

    /**
     * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
     * to represent the minimum value of the Y axis.
     *
     * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/
     *         Min and max color
     *
     * @default #e6ebf5
     * @since   4.0
     * @product highcharts
     */
    minColor?: ColorType;

    /** @internal */
    staticScale?: number;

    /**
     * Solid gauge series only. Color stops for the solid gauge. Use this
     * in cases where a linear gradient between a `minColor` and `maxColor`
     * is not sufficient. The stops is an array of tuples, where the first
     * item is a float between 0 and 1 assigning the relative position in
     * the gradient, and the second item is the color.
     *
     * For solid gauges, the Y axis also inherits the concept of
     * [data classes](https://api.highcharts.com/highmaps#colorAxis.dataClasses)
     * from the Highmaps color axis.
     *
     * @sample {highcharts} highcharts/demo/gauge-solid/
     *         Gauge with stops
     *
     * @see [minColor](#yAxis.minColor)
     * @see [maxColor](#yAxis.maxColor)
     *
     * @since   4.0
     * @product highcharts
     */
    stops?: GradientColor['stops'];

}

/* *
 *
 *  Default Export
 *
 * */

export default AxisOptions;
