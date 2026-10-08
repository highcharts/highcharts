/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignValue,
    VerticalAlignValue
} from '../Renderer/AlignObject';
import type AnimationOptions from '../Animation/AnimationOptions';
import type { EventCallback } from '../Callback';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type F from '../Templating';
import type Legend from './Legend';
import type PointerEvent from '../PointerEvent';
import type ShadowOptionsObject from '../Renderer/ShadowOptionsObject';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Options' {
    interface Options {
        /**
         * The legend is a box containing a symbol and name for each series
         * item or point item in the chart. Each series (or points in case
         * of pie charts) is represented by a symbol and its name in the
         * legend.
         *
         * It is possible to override the symbol creator function and create
         * [custom legend symbols](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/studies/legend-custom-symbol/).
         *
         * @productdesc {highmaps}
         * A Highmaps legend by default contains one legend item per series,
         * but if a `colorAxis` is defined, the axis will be displayed in the
         * legend. Either as a gradient, or as multiple legend items for
         * `dataClasses`.
         */
        legend: LegendOptions;
    }
}

declare module '../Series/SeriesOptions' {
    interface SeriesEventsOptions {
        /**
         * Fires when the legend item belonging to the series is clicked. One
         * parameter, `event`, is passed to the function. The default action
         * is to toggle the visibility of the series. This can be prevented
         * by returning `false` or calling `event.preventDefault()`.
         *
         * **Note:** This option is deprecated in favor of
         * [legend.events.itemClick](#legend.events.itemClick).
         *
         * @deprecated 11.4.4
         */
        legendItemClick?: LegendItemClickCallback;
    }
}

/**
 * General event handlers for the legend. These event hooks can
 * also be attached to the legend at run time using the
 * `Highcharts.addEvent` function.
 */
export interface LegendEventsOptions {
    /**
     * Fires when the legend item belonging to the series is clicked.
     * One parameter, `event`, is passed to the function. The default
     * action is to toggle the visibility of the series, point or data
     * class. This can be prevented by returning `false` or calling
     * `event.preventDefault()`.
     *
     * @sample {highcharts} highcharts/legend/itemclick/
     *         Confirm hiding and showing
     * @sample {highcharts} highcharts/legend/pie-legend-itemclick/
     *         Confirm toggle visibility of pie slices
     */
    itemClick?: EventCallback<Legend, Event>
}

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
 */
export interface LegendOptions {
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
     * @default 'center'
     * @since   2.0
     */
    align: AlignValue;

    /**
     * If the [layout](legend.layout) is `horizontal` and the legend items
     * span over two lines or more, whether to align the items into vertical
     * columns. Setting this to `false` makes room for more items, but will
     * look more messy.
     *
     * @sample highcharts/legend/aligncolumns
     *         Align columns
     *
     * @default true
     * @since   6.1.0
     */
    alignColumns: boolean;

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
     */
    backgroundColor?: ColorType;

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
     * @default 'var(--highcharts-neutral-color-40)'
     */
    borderColor: ColorType;

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
     * @default 0
     */
    borderRadius: number;

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
     * @default 0
     */
    borderWidth?: number;

    /**
     * A CSS class name to apply to the legend group.
     *
     * @default 'highcharts-no-tooltip'
     */
    className: string;

    /**
     * Enable or disable the legend. There is also a series-specific option,
     * [showInLegend](#plotOptions.series.showInLegend), that can hide the
     * series from the legend. In some series types this is `false` by
     * default, so it must set to `true` in order to show the legend for the
     * series.
     *
     * @sample {highcharts} highcharts/legend/enabled-false/ Legend disabled
     * @sample {highstock} stock/legend/align/ Various legend options
     * @sample {highmaps} maps/legend/enabled-false/ Legend disabled
     *
     * @default true
     * @default {highstock} false
     * @default {highmaps} true
     * @default {gantt} false
     */
    enabled: boolean;

    /**
     * General event handlers for the legend. These event hooks can
     * also be attached to the legend at run time using the
     * `Highcharts.addEvent` function.
     */
    events?: LegendEventsOptions;

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
     * @default false
     * @since   2.1
     */
    floating?: boolean;

    /**
     * Default styling for the checkbox next to a legend item when
     * `showCheckbox` is true.
     *
     * @default {"position": "absolute", "width": "13px", "height": "13px"}
     */
    itemCheckboxStyle: CSSObject;

    /**
     * In a legend with horizontal layout, the itemDistance defines the
     * pixel distance between each item.
     *
     * @sample {highcharts} highcharts/legend/itemwidth-default/
     *         40px item distance
     * @sample {highstock} highcharts/legend/itemwidth-default/
     *         40px item distance
     *
     * @default {highcharts} 20
     * @default {highstock} 20
     * @default {highmaps} 8
     * @since   3.0.3
     */
    itemDistance?: number;

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
     * @default {"color": "var(--highcharts-neutral-color-60)", "textDecoration": "line-through"}
     */
    itemHiddenStyle: CSSObject;

    /**
     * CSS styles for each legend item in hover mode. Only a subset of
     * CSS is supported, notably those options related to text. Properties
     * are inherited from `style` unless overridden here.
     *
     * @see In styled mode, the hovered legend items can be styled with
     *      the `.highcharts-legend-item:hover` pseudo-class.
     *
     * @sample {highcharts} highcharts/legend/itemhoverstyle/
     *         Red on hover
     * @sample {highmaps} maps/legend/itemstyle/
     *         Item text styles
     *
     * @default {"color": "var(--highcharts-neutral-color-100)"}
     */
    itemHoverStyle: CSSObject;

    /**
     * The pixel bottom margin for each legend item.
     *
     * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     * @sample {highmaps} maps/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     *
     * @default 2
     * @since   2.2.0
     */
    itemMarginBottom: number;

    /**
     * The pixel top margin for each legend item.
     *
     * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     * @sample {highmaps} maps/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     *
     * @default 2
     * @since   2.2.0
     */
    itemMarginTop: number;

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
     * @default {"color": "var(--highcharts-neutral-color-80)", "cursor": "pointer", "fontSize": "0.8em", "textDecoration": "none", "textOverflow": "ellipsis"}
     */
    itemStyle: CSSObject;

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
     * @since 2.0
     */
    itemWidth?: number;

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
     * @validvalue ["horizontal", "vertical", "proximate"]
     * @default    'horizontal'
     */
    layout: ('horizontal'|'vertical'|'proximate');

    /**
     * A [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * for each legend label. Available variables relates to properties on
     * the series, or the point in case of pies.
     *
     * @sample {highcharts} highcharts/legend/labelformat/
     *         Add text
     *
     * @default {name}
     * @since   1.3
     */
    labelFormat?: string;

    /**
     * Callback function to format each of the series' labels. The `this`
     * keyword refers to the series object, or the point object in case of
     * pie charts. By default the series or point name is printed. Since
     * v12.5.0, the callback also receives `ctx` as the first argument, so
     * that arrow functions can access the same context as regular
     * functions using `this`.
     *
     * @productdesc {highmaps}
     * In Highmaps the context can also be a data class in case of a
     * `colorAxis`.
     *
     * @sample {highcharts} highcharts/legend/labelformatter/
     *         Add text
     * @sample {highmaps} maps/legend/labelformatter/
     *         Data classes with label formatter
     */
    labelFormatter: F.FormatterCallback<Legend.Item>;

    /**
     * Line height for the legend items. Deprecated as of 2.1\. Instead,
     * the line height for each item can be set using
     * `itemStyle.lineHeight`, and the padding between items using
     * `itemMarginTop` and `itemMarginBottom`.
     *
     * @sample {highcharts} highcharts/legend/lineheight/
     *         Setting padding
     *
     * @deprecated 2.1.0
     *
     * @default 16
     * @since   2.0
     * @product highcharts gantt
     */
    lineHeight?: number;

    /**
     * If the plot area sized is calculated automatically and the legend is
     * not floating, the legend margin is the space between the legend and
     * the axis labels or plot area.
     *
     * @sample {highcharts} highcharts/legend/margin-default/
     *         12 pixels by default
     * @sample {highcharts} highcharts/legend/margin-30/
     *         30 pixels
     *
     * @default 12
     * @since   2.1
     */
    margin?: number;

    /**
     * Maximum width for the legend. Can be a percentage of the chart width,
     * or an integer representing how many pixels wide the legend can be.
     *
     * @sample {highcharts} highcharts/legend/maxwidth/
     *         Max width set to 7%
     */
    maxWidth?: number|string;

    /**
     * Maximum pixel height for the legend. When the maximum height is
     * extended, navigation will show.
     *
     * @since 2.3.0
     */
    maxHeight?: number;

    /**
     * Options for the paging or navigation appearing when the legend is
     * overflown. Navigation works well on screen, but not in static
     * exported images. One way of working around that is to
     * [increase the chart height in
     * export](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/legend/navigation-enabled-false/).
     *
     * @sample highcharts/legend/scrollable-vertical/
     *         Legend with vertical scrollable extension
     * @sample highcharts/legend/scrollable-horizontal/
     *         Legend with horizontal scrollable extension
     * @sample highcharts/legend/navigation-horizontal-plugin/
     *         Legend with horizontal navigation extension
     */
    navigation: LegendNavigationOptions;

    /**
     * The inner padding of the legend box.
     *
     * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     * @sample {highmaps} maps/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     *
     * @default 8
     * @since   2.2.0
     */
    padding?: number;

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
     * @default false
     * @since   1.2.5
     */
    reversed?: boolean;

    /**
     * Whether to show the symbol on the right side of the text rather than
     * the left side. This is common in Arabic and Hebrew.
     *
     * @sample {highcharts} highcharts/legend/rtl/
     *         Symbol to the right
     *
     * @default false
     * @since   2.2
     */
    rtl?: boolean;

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
     * @default false
     */
    shadow: (boolean|Partial<ShadowOptionsObject>);

    /**
     * When this is true, the legend symbol width will be the same as
     * the symbol height, which in turn defaults to the font size of the
     * legend items.
     *
     * @default true
     * @since   5.0.0
     */
    squareSymbol: boolean;

    /**
     * CSS styles for the legend area. In the 1.x versions the position
     * of the legend area was determined by CSS. In 2.x, the position is
     * determined by properties like `align`, `verticalAlign`, `x` and `y`,
     * but the styles are still parsed for backwards compatibility.
     *
     * @deprecated 2.0.0
     *
     * @product highcharts highstock
     */
    style?: CSSObject;

    /**
     * The pixel height of the symbol for series types that use a rectangle
     * in the legend. Defaults to the font size of legend items.
     *
     * Note: This option is a default source of color axis height, if the
     * [colorAxis.height](https://api.highcharts.com/highcharts/colorAxis.height)
     * option is not set.
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
     * @since 3.0.8
     */
    symbolHeight?: number;

    /**
     * The pixel padding between the legend item symbol and the legend
     * item text.
     *
     * @sample {highcharts} highcharts/legend/symbolpadding/
     *         Greater symbol width and padding
     *
     * @default 5
     */
    symbolPadding: number;

    /**
     * The border radius of the symbol for series types that use a rectangle
     * in the legend. Defaults to half the `symbolHeight`, effectively
     * creating a circle.
     *
     * For color axis scales, it defaults to 3.
     *
     * @sample {highcharts} highcharts/legend/symbolradius/
     *         Round symbols
     * @sample {highstock} highcharts/legend/symbolradius/
     *         Round symbols
     * @sample {highmaps} highcharts/legend/symbolradius/
     *         Round symbols
     *
     * @since 3.0.8
     */
    symbolRadius?: number;

    /**
     * The pixel width of the legend item symbol. When the `squareSymbol`
     * option is set, this defaults to the `symbolHeight`, otherwise 16.
     *
     * Note: This option is a default source of color axis width, if the
     * [colorAxis.width](https://api.highcharts.com/highcharts/colorAxis.width)
     * option is not set.
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
     */
    symbolWidth?: number;

    /**
     * A title to be added on top of the legend.
     *
     * @sample {highcharts} highcharts/legend/title/
     *         Legend title
     * @sample {highmaps} maps/legend/alignment/
     *         Legend with title
     *
     * @since 3.0
     */
    title: LegendTitleOptions;

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the legend item texts.
     *
     * Prior to 4.1.7, when using HTML, [legend.navigation](
     * #legend.navigation) was disabled.
     *
     * @sample highcharts/legend/scrollable-vertical/
     *         Legend with vertical scrollable extension
     * @sample highcharts/legend/scrollable-horizontal/
     *         Legend with horizontal scrollable extension
     *
     * @default false
     */
    useHTML?: boolean;

    /**
     * For a color axis with data classes, how many decimals to render in
     * the legend. The default preserves the decimals of the range numbers.
     *
     * @default -1
     * @product highcharts highmaps
     */
    valueDecimals?: number;

    /**
     * For a color axis with data classes, a suffix for the range numbers in
     * the legend.
     *
     * @default ''
     * @product highcharts highmaps
     */
    valueSuffix?: string;

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
     * @default 'bottom'
     * @since   2.0
     */
    verticalAlign: VerticalAlignValue;

    /**
     * The width of the legend box. If a number is set, it translates to
     * pixels. Since v7.0.2 it allows setting a percent string of the full
     * chart width, for example `40%`.
     *
     * Defaults to the full chart width for legends below or above the
     * chart, half the chart width for legends to the left and right.
     *
     * @sample {highcharts} highcharts/legend/width/
     *         Aligned to the plot area
     * @sample {highcharts} highcharts/legend/width-percent/
     *         A percent of the chart width
     *
     * @since 2.0
     */
    width?: (number|string);

    /**
     * The x offset of the legend relative to its horizontal alignment
     * `align` within chart.spacingLeft and chart.spacingRight. Negative
     * x moves it to the left, positive x moves it to the right.
     *
     * @sample {highcharts} highcharts/legend/width/
     *         Aligned to the plot area
     *
     * @default 0
     * @since   2.0
     */
    x: number;

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
     * @default 0
     * @since   2.0
     */
    y: number;
}

export type LegendItemClickCallback = EventCallback<PointerEvent>;

/**
 * Options for the paging or navigation appearing when the legend is
 * overflown. Navigation works well on screen, but not in static
 * exported images. One way of working around that is to
 * [increase the chart height in
 * export](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/legend/navigation-enabled-false/).
 */
export interface LegendNavigationOptions {
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
     * @since 2.2.4
     */
    activeColor: ColorType;

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
     * @default true
     * @since   2.2.4
     */
    animation?: (boolean|Partial<AnimationOptions>);

    /**
     * The pixel size of the up and down arrows in the legend paging
     * navigation.
     *
     * @sample {highcharts} highcharts/legend/navigation/
     *         Legend page navigation demonstrated
     * @sample {highstock} highcharts/legend/navigation/
     *         Legend page navigation demonstrated
     *
     * @default 12
     * @since   2.2.4
     */
    arrowSize?: number;

    /**
     * Whether to enable the legend navigation. In most cases, disabling
     * the navigation results in an unwanted overflow.
     *
     * See also the
     * [adapt chart to legend](https://github.com/highcharts/adapt-chart-to-legend)
     * plugin for a solution to extend the chart height to make room for
     * the legend, optionally in exported charts only.
     *
     * @default true
     * @since   4.2.4
     */
    enabled?: boolean;

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
     * @since 2.2.4
     */
    inactiveColor: ColorType;

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
     * @since 2.2.4
     */
    style?: CSSObject;
}

/**
 * A title to be added on top of the legend.
 */
export interface LegendTitleOptions {
    /**
     * Generic CSS styles for the legend title.
     *
     * @see In styled mode, the legend title is styled with the
     *      `.highcharts-legend-title` class.
     *
     * @default {"color": "var(--highcharts-neutral-color-80)", "fontSize": "0.8em", "fontWeight": "bold"}
     * @since   3.0
     */
    style: CSSObject;

    /**
     * A text or HTML string for the title.
     *
     * @since 3.0
     */
    text?: string;

    width?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default LegendOptions;
