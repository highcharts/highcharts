import type LegendOptions from './LegendOptions.ts';

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
export const legendDefaults: LegendOptions = {
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
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @apioption legend.backgroundColor
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
     * @type      {number}
     * @default   0
     * @apioption legend.borderWidth
     */
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
     * @default {highstock} false
     * @default {highmaps} true
     * @default {gantt} false
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
     * @type  {Highcharts.AlignValue}
     * @since 2.0
     */
    align: 'center',
    /**
     * If the [layout](legend.layout) is `horizontal` and the legend items
     * span over two lines or more, whether to align the items into vertical
     * columns. Setting this to `false` makes room for more items, but will
     * look more messy.
     *
     * @since 6.1.0
     */
    alignColumns: true,
    /**
     * A CSS class name to apply to the legend group.
     */
    className: 'highcharts-no-tooltip',
    /**
     * General event handlers for the legend. These event hooks can
     * also be attached to the legend at run time using the
     * `Highcharts.addEvent` function.
     *
     * @declare Highcharts.LegendEventsOptionsObject
     *
     * @internal
     */
    events: {},
    /**
     * Fires when the legend item belonging to the series is clicked. One
     * parameter, `event`, is passed to the function. The default action
     * is to toggle the visibility of the series, point or data class. This
     * can be prevented by returning `false` or calling
     * `event.preventDefault()`.
     *
     * @sample {highcharts} highcharts/legend/itemclick/
     *         Confirm hiding and showing
     * @sample {highcharts} highcharts/legend/pie-legend-itemclick/
     *         Confirm toggle visibility of pie slices
     *
     * @type      {Highcharts.LegendItemClickCallbackFunction}
     * @context   Highcharts.Legend
     * @apioption legend.events.itemClick
     */
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
     * @type      {boolean}
     * @default   false
     * @since     2.1
     * @apioption legend.floating
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
     * @validvalue ["horizontal", "vertical", "proximate"]
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
     * @since     2.2.0
     */
    itemMarginBottom: 2,
    /**
     * The pixel top margin for each legend item.
     *
     * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     * @sample {highmaps} maps/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     *
     * @since     2.2.0
     */
    itemMarginTop: 2,
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
     * @type      {number}
     * @since     2.0
     * @apioption legend.itemWidth
     */
    /**
     * A [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * for each legend label. Available variables relates to properties on
     * the series, or the point in case of pies.
     *
     * @type      {string}
     * @default   {name}
     * @since     1.3
     * @apioption legend.labelFormat
     */
    /* eslint-disable valid-jsdoc */
    /**
     * Callback function to format each of the series' labels. The `this`
     * keyword refers to the series object, or the point object in case of
     * pie charts. By default the series or point name is printed.
     *
     * @productdesc {highmaps}
     * In Highmaps the context can also be a data class in case of a
     * `colorAxis`.
     *
     * @sample {highcharts} highcharts/legend/labelformatter/
     *         Add text
     * @sample {highmaps} maps/legend/labelformatter/
     *         Data classes with label formatter
     *
     * @type {Highcharts.FormatterCallbackFunction<Point|Series>}
     */
    labelFormatter: function (): string {
        // eslint-enable valid-jsdoc
        return this.name!;
    },
    /**
     * Line height for the legend items. Deprecated as of 2.1\. Instead,
     * the line height for each item can be set using
     * `itemStyle.lineHeight`, and the padding between items using
     * `itemMarginTop` and `itemMarginBottom`.
     *
     * @sample {highcharts} highcharts/legend/lineheight/
     *         Setting padding
     *
     * @deprecated
     *
     * @type      {number}
     * @default   16
     * @since     2.0
     * @product   highcharts gantt
     * @apioption legend.lineHeight
     */
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
     * @type      {number}
     * @default   12
     * @since     2.1
     * @apioption legend.margin
     */
    /**
     * Maximum width for the legend. Can be a percentage of the chart width,
     * or an integer representing how many pixels wide the legend can be.
     *
     * @sample {highcharts} highcharts/legend/maxwidth/
     *         Max width set to 7%
     *
     * @type      {number|string}
     * @apioption legend.maxWidth
     */
    /**
     * Maximum pixel height for the legend. When the maximum height is
     * extended, navigation will show.
     *
     * @type      {number}
     * @since     2.3.0
     * @apioption legend.maxHeight
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
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    borderColor: '#999999' /* Palette.neutralColor40 */,
    /**
     * The border corner radius of the legend.
     *
     * @sample {highcharts} highcharts/legend/borderradius-default/
     *         Square by default
     * @sample {highcharts} highcharts/legend/borderradius-round/
     *         5px rounded
     * @sample {highmaps} maps/legend/border-background/
     *         Border and background options
     */
    borderRadius: 0,
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
     *
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
         * @type      {boolean|Partial<Highcharts.AnimationOptionsObject>}
         * @default   true
         * @since     2.2.4
         * @apioption legend.navigation.animation
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
         * @type      {number}
         * @default   12
         * @since     2.2.4
         * @apioption legend.navigation.arrowSize
         */
        /**
         * Whether to enable the legend navigation. In most cases, disabling
         * the navigation results in an unwanted overflow.
         *
         * See also the
         * [adapt chart to legend](https://github.com/highcharts/adapt-chart-to-legend)
         * plugin for a solution to extend the chart height to make room for
         * the legend, optionally in exported charts only.
         *
         * @type      {boolean}
         * @default   true
         * @since     4.2.4
         * @apioption legend.navigation.enabled
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
         * @type      {Highcharts.CSSObject}
         * @since     2.2.4
         * @apioption legend.navigation.style
         */
        style: {
            /**
             * @type {number|string}
             */
            fontSize: '0.8em'
        },
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
         * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since 2.2.4
         */
        activeColor: '#0022ff' /* Palette.highlightColor100 */,
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
         * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since 2.2.4
         */
        inactiveColor: '#cccccc' /* Palette.neutralColor20 */
    },
    /**
     * The inner padding of the legend box.
     *
     * @sample {highcharts|highstock} highcharts/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     * @sample {highmaps} maps/legend/padding-itemmargin/
     *         Padding and item margins demonstrated
     *
     * @type      {number}
     * @default   8
     * @since     2.2.0
     * @apioption legend.padding
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
     * @type      {boolean}
     * @default   false
     * @since     1.2.5
     * @apioption legend.reversed
     */
    /**
     * Whether to show the symbol on the right side of the text rather than
     * the left side. This is common in Arabic and Hebrew.
     *
     * @sample {highcharts} highcharts/legend/rtl/
     *         Symbol to the right
     *
     * @type      {boolean}
     * @default   false
     * @since     2.2
     * @apioption legend.rtl
     */
    /**
     * CSS styles for the legend area. In the 1.x versions the position
     * of the legend area was determined by CSS. In 2.x, the position is
     * determined by properties like `align`, `verticalAlign`, `x` and `y`,
     * but the styles are still parsed for backwards compatibility.
     *
     * @deprecated
     *
     * @type      {Highcharts.CSSObject}
     * @product   highcharts highstock
     * @apioption legend.style
     */
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
     * @type    {Highcharts.CSSObject}
     * @default {"color": "#333333", "cursor": "pointer", "fontSize": "0.8em", "fontWeight": "bold", "textOverflow": "ellipsis"}
     */
    itemStyle: {
        /**
         * @ignore
         */
        color: '#333333' /* Palette.neutralColor80 */,
        /**
         * @ignore
         */
        cursor: 'pointer',
        /**
         * @ignore
         */
        fontSize: '0.8em',
        /**
         * @ignore
         */
        textDecoration: 'none',
        /**
         * @ignore
         */
        textOverflow: 'ellipsis'
    },
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
     * @type    {Highcharts.CSSObject}
     * @default {"color": "#000000"}
     */
    itemHoverStyle: {
        /**
         * @ignore
         */
        color: '#000000' /* Palette.neutralColor100 */
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
     * @type    {Highcharts.CSSObject}
     * @default {"color": "#cccccc"}
     */
    itemHiddenStyle: {
        /**
         * @ignore
         */
        color: '#666666' /* Palette.neutralColor60 */,
        /**
         * @ignore
         */
        textDecoration: 'line-through'
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
     * @type {boolean|Highcharts.CSSObject}
     */
    shadow: false,
    /**
     * Default styling for the checkbox next to a legend item when
     * `showCheckbox` is true.
     *
     * @type {Highcharts.CSSObject}
     * @default {"width": "13px", "height": "13px", "position":"absolute"}
     */
    itemCheckboxStyle: {
        /**
         * @ignore
         */
        position: 'absolute',
        /**
         * @ignore
         */
        width: '13px', // For IE precision
        /**
         * @ignore
         */
        height: '13px'
    },
    /// itemWidth: undefined,
    /**
     * When this is true, the legend symbol width will be the same as
     * the symbol height, which in turn defaults to the font size of the
     * legend items.
     *
     * @since 5.0.0
     */
    squareSymbol: true,
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
     * @type      {number}
     * @since     3.0.8
     * @apioption legend.symbolHeight
     */
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
     * @type      {number}
     * @since     3.0.8
     * @apioption legend.symbolRadius
     */
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
     *
     * @type      {number}
     * @apioption legend.symbolWidth
     */
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
     * @type      {boolean}
     * @default   false
     * @apioption legend.useHTML
     */
    /**
     * For a color axis with data classes, how many decimals to render in
     * the legend. The default preserves the decimals of the range numbers.
     *
     * @type      {number}
     * @default   -1
     * @product   highcharts highmaps
     * @apioption legend.valueDecimals
     */
    /**
     * For a color axis with data classes, a suffix for the range numbers in
     * the legend.
     *
     * @type      {string}
     * @default   ''
     * @product   highcharts highmaps
     * @apioption legend.valueSuffix
     */
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
     * @type      {number|string}
     * @since     2.0
     * @apioption legend.width
     */
    /**
     * The pixel padding between the legend item symbol and the legend
     * item text.
     *
     * @sample {highcharts} highcharts/legend/symbolpadding/
     *         Greater symbol width and padding
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
     * @type  {Highcharts.VerticalAlignValue}
     * @since 2.0
     */
    verticalAlign: 'bottom',
    // Width: undefined,
    /**
     * The x offset of the legend relative to its horizontal alignment
     * `align` within chart.spacingLeft and chart.spacingRight. Negative
     * x moves it to the left, positive x moves it to the right.
     *
     * @sample {highcharts} highcharts/legend/width/
     *         Aligned to the plot area
     *
     * @since 2.0
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
     * @since 2.0
     */
    y: 0,
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
    title: {
        /**
         * A text or HTML string for the title.
         *
         * @type      {string}
         * @since     3.0
         * @apioption legend.title.text
         */
        /**
         * Generic CSS styles for the legend title.
         *
         * @see In styled mode, the legend title is styled with the
         *      `.highcharts-legend-title` class.
         *
         * @type    {Highcharts.CSSObject}
         * @default {"fontSize": "0.8em", "fontWeight": "bold"}
         * @since   3.0
         */
        style: {
            /**
             * @ignore
             */
            color: '#333333' /* Palette.neutralColor80 */,
            /**
             * @ignore
             */
            fontSize: '0.8em',
            /**
             * @ignore
             */
            fontWeight: 'bold'
        }
    }
};

export default legendDefaults;
