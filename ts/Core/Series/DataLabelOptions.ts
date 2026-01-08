/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
import type ColorString from '../Color/ColorString';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type Point from './Point';
import type ShadowOptionsObject from '../Renderer/ShadowOptionsObject';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type { SymbolTypeRegistry } from '../Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export type DataLabelsFilterOperatorValue = (
    '>'|'<'|'>='|'<='|'=='|'==='|'!='|'!=='
);

export interface TextPathAttributes extends SVGAttributes {
    startOffset?: string;
    textAnchor?: 'start'|'middle'|'end';
    dy?: number;
}

export interface DataLabelsFilterOptionsObject {
    /**
     * The operator to compare by. Can be one of `>`, `<`, `>=`, `<=`,
     * `==`, `===`, `!=` and `!==`.
     */
    operator: DataLabelsFilterOperatorValue;

    /**
     * The point property to filter by. Point options are passed
     * directly to properties, additionally there are `y` value,
     * `percentage` and others listed under {@link Highcharts.Point}
     * members.
     */
    property: string;

    /**
     * The value to compare against.
     */
    value: (null|number);
}

/**
 * Callback JavaScript function to format the data label as a string. Note that
 * if a `format` is defined, the format takes precedence and the formatter is
 * ignored.
 *
 * @callback Highcharts.DataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.Point} this
 * Data label context to format
 *
 * @param {Highcharts.DataLabelsOptions} options
 * [API options](/highcharts/plotOptions.series.dataLabels) of the data label
 *
 * @return {number|string|null|undefined}
 * Formatted data label text
 */
export interface DataLabelsFormatterCallbackFunction {
    (this: Point, options: DataLabelOptions): (number|string|null|undefined);
}

export interface DataLabelOptions {
    /**
     * Enable or disable the initial animation when a series is displayed
     * for the `dataLabels`. The animation can also be set as a
     * configuration object. Please note that this option only applies to
     * the initial animation.
     *
     * For other animations, see [chart.animation](#chart.animation) and the
     * animation parameter under the API methods. The following properties
     * are supported:
     *
     * - `defer`: The animation delay time in milliseconds.
     *
     * @sample {highcharts} highcharts/plotoptions/animation-defer/
     *          Animation defer settings
     *
     * @since 8.2.0
     */
    animation?: (boolean|Partial<AnimationOptions>);

    /**
     * The alignment of the data label compared to the point. If `right`,
     * the right side of the label should be touching the point. For points
     * with an extent, like columns, the alignments also dictates how to
     * align it inside the box, as given with the
     * [inside](#plotOptions.column.dataLabels.inside) option. Can be one of
     * `left`, `center` or `right`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-align-left/
     *         Left aligned
     * @sample {highcharts} highcharts/plotoptions/bar-datalabels-align-inside-bar/
     *         Data labels inside the bar
     */
    align?: AlignValue;

    /**
     * Alignment method for data labels. If set to `plotEdges`, the labels
     * are aligned within the plot area in the direction of the y-axis. So
     * in a regular column chart, the labels are aligned vertically
     * according to the `verticalAlign` setting. In a bar chart, which is
     * inverted, the labels are aligned horizontally according to the
     * `align` setting. Applies to cartesian series only.
     *
     * @sample {highcharts} highcharts/series-bar/datalabels-alignto/
     *         Align to plot edges
     *
     * @since 11.4.2
     */
    alignTo?: 'connectors' | 'plotEdges';

    /**
     * Whether to allow data labels to overlap. To make the labels less
     * sensitive for overlapping, the
     * [dataLabels.padding](#plotOptions.series.dataLabels.padding)
     * can be set to 0.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-allowoverlap-false/
     *         Don't allow overlap
     *
     * @default   false
     * @since     4.1.0
     */
    allowOverlap?: boolean;

    /**
     * The background color or gradient for the data label. Setting it to
     * `auto` will use the point's color.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
     *         Data labels box options
     * @sample {highmaps} maps/plotoptions/series-datalabels-box/
     *         Data labels box options
     * @sample {highmaps} maps/demo/mappoint-datalabels-mapmarker
     *         Data labels as map markers
     *
     * @since     2.2.1
     */
    backgroundColor?: ColorType;

    /**
     * The border color for the data label. Setting it to `auto` will use
     * the point's color. Defaults to `undefined`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
     *         Data labels box options
     *
     * @since     2.2.1
     */
    borderColor?: ColorType;

    /**
     * The border radius in pixels for the data label.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
     *         Data labels box options
     * @sample {highmaps} maps/plotoptions/series-datalabels-box/
     *         Data labels box options
     *
     * @default   0
     * @since     2.2.1
     */
    borderRadius?: number;

    /**
     * The border width in pixels for the data label.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
     *         Data labels box options
     *
     * @default   0
     * @since     2.2.1
     */
    borderWidth?: number;

    /**
     * A class name for the data label. Particularly in styled mode,
     * this can be used to give each series' or point's data label
     * unique styling. In addition to this option, a default color class
     * name is added so that we can give the labels a contrast text
     * shadow.
     *
     * @sample {highcharts} highcharts/css/data-label-contrast/
     *         Contrast text shadow
     * @sample {highcharts} highcharts/css/series-datalabels/
     *         Styling by CSS
     *
     * @since     5.0.0
     */
    className?: string;

    /**
     * This options is deprecated.
     * Use [style.color](#plotOptions.series.dataLabels.style) instead.
     *
     * The text color for the data labels. Defaults to `undefined`. For
     * certain series types, like column or map, the data labels can be
     * drawn inside the points. In this case the data label will be
     * drawn with maximum contrast by default. Additionally, it will be
     * given a `text-outline` style with the opposite color, to further
     * increase the contrast. This can be overridden by setting the
     * `text-outline` style to `none` in the `dataLabels.style` option.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-color/
     *         Red data labels
     * @sample {highmaps} maps/demo/color-axis/
     *         White data labels
     *
     * @see [style.color](#plotOptions.series.dataLabels.style)
     *
     * @deprecated 10.3
     */
    color?: ColorString;

    /**
     * Whether to hide data labels that are outside the plot area. By
     * default, the data label is moved inside the plot area according
     * to the
     * [overflow](#plotOptions.series.dataLabels.overflow)
     * option.
     *
     * @default   true
     * @since     2.3.3
     */
    crop?: boolean;

    /**
     * Whether to defer displaying the data labels until the initial
     * series animation has finished. Setting to `false` renders the
     * data label immediately. If set to `true` inherits the defer
     * time set in [plotOptions.series.animation](#plotOptions.series.animation).
     *
     * @since     4.0.0
     * @default   true
     * @product   highcharts highstock gantt
     */
    defer?: boolean;

    /**
     * TODO: This is a pie (and derived) series option. It should be
     * moved to the pie module.
     *
     * @internal
     */
    distance?: number|string;

    /**
     * Enable or disable the data labels.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-enabled/
     *         Data labels enabled
     * @sample {highmaps} maps/demo/color-axis/
     *         Data labels enabled
     *
     * @default   false
     */
    enabled?: boolean;

    /**
     * A declarative filter to control of which data labels to display.
     * The declarative filter is designed for use when callback
     * functions are not available, like when the chart options require
     * a pure JSON structure or for use with graphical editors. For
     * programmatic control, use the `formatter` instead, and return
     * `undefined` to disable a single data label.
     *
     * @example
     * filter: {
     *     property: 'percentage',
     *     operator: '>',
     *     value: 4
     * }
     *
     * @sample {highcharts} highcharts/demo/pie-monochrome
     *         Data labels filtered by percentage
     *
     * @declare Highcharts.DataLabelsFilterOptionsObject
     * @since 6.0.3
     */
    filter?: DataLabelsFilterOptionsObject;

    /**
     * A
     * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * for the data label. Available variables are the same as for
     * `formatter`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-format/
     *         Add a unit
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-format-subexpression/
     *         Complex logic in the format string
     * @sample {highmaps} maps/plotoptions/series-datalabels-format/
     *         Formatted value in the data label
     *
     * @default 'point.value'
     * @since 3.0
     */
    format?: string;

    /**
     * Callback JavaScript function to format the data label. Note that if a
     * `format` is defined, the format takes precedence and the formatter is
     * ignored.
     *
     * @sample {highmaps} maps/plotoptions/series-datalabels-format/
     *         Formatted value
     */
    formatter?: DataLabelsFormatterCallbackFunction;

    /**
     * For points with an extent, like columns or map areas, whether to
     * align the data label inside the box or to the actual value point.
     * Defaults to `false` in most cases, `true` in stacked columns.
     *
     * @since 3.0
     */
    inside?: boolean;

    /**
     * The rank for this point's data label in case of collision. If two
     * data labels are about to overlap, only the one with the highest
     * `labelrank` will be drawn.
     */
    labelrank?: number;

    /**
     * Format for points with the value of null. Works analogously to
     * [format](#plotOptions.series.dataLabels.format). `nullFormat` can
     * be applied only to series which support displaying null points.
     * `heatmap` and `tilemap` supports `nullFormat` by default while the
     * following series requires [#series.nullInteraction] set to `true`:
     * `line`, `spline`, `area`, `area-spline`, `column`, `bar`, and
     * `timeline`. Does not work with series that don't display null
     * points, like `pie`.
     *
     * @sample {highcharts} highcharts/series/null-interaction/
     *         Line chart with null interaction
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-nullformat/
     *         Heatmap with null interaction
     *
     * @since 7.1.0
     */
    nullFormat?: (boolean|string);

    /**
     * Callback JavaScript function that defines formatting for points
     * with the value of null. Works analogously to
     * [formatter](#plotOptions.series.dataLabels.formatter).
     * `nullFormatter` can be applied only to series which support
     * displaying null points. `heatmap` and `tilemap` supports
     * `nullFormatter` by default while the following series requires
     * (series.nullInteraction)[#series.nullInteraction]
     * set to `true`: `line`, `spline`, `area`, `area-spline`, `column`,
     * `bar`, and `timeline`. Does not work with series that don't display
     * null points, like `pie`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-nullformat/
     *         Format data label for null points in heat map
     *
     * @since 7.1.0
     */
    nullFormatter?: DataLabelsFormatterCallbackFunction;

    /**
     * How to handle data labels that flow outside the plot area. The
     * default is `"justify"`, which aligns them inside the plot area.
     * For columns and bars, this means it will be moved inside the bar.
     * To display data labels outside the plot area, set `crop` to
     * `false` and `overflow` to `"allow"`.
     *
     * @default 'justify'
     * @since 3.0.6
     */
    overflow?: DataLabelsOverflowValue;

    /**
     * When either the `borderWidth` or the `backgroundColor` is set,
     * this is the padding within the box.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
     *         Data labels box options
     * @sample {highmaps} maps/plotoptions/series-datalabels-box/
     *         Data labels box options
     * @default 5
     * @since 2.2.1
     */
    padding?: number;

    /**
     * Aligns data labels relative to points. If `center` alignment is
     * not possible, it defaults to `right`.
     *
     * @default center
     */
    position?: AlignValue;

    /**
     * Text rotation in degrees. Note that due to a more complex
     * structure, backgrounds, borders and padding will be lost on a
     * rotated data label.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
     *         Vertical labels
     *
     * @default 0
     */
    rotation?: number;

    /**
     * The shadow of the box. Works best with `borderWidth` or
     * `backgroundColor`. Since 2.3 the shadow can be an object
     * configuration containing `color`, `offsetX`, `offsetY`, `opacity`
     * and `width`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/
     *         Data labels box options
     *
     * @default   false
     * @since     2.2.1
     */
    shadow?: (boolean|Partial<ShadowOptionsObject>);

    /**
     * The name of a symbol to use for the border around the label.
     * Symbols are predefined functions on the Renderer object.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-shape/
     *         A callout for annotations
     *
     * @default   square
     * @since     4.1.2
     */
    shape?: keyof SymbolTypeRegistry;

    /**
     * Styles for the label. The default `color` setting is
     * `"contrast"`, which is a pseudo color that Highcharts picks up
     * and applies the maximum contrast to the underlying point item,
     * for example the bar in a bar chart.
     *
     * The `textOutline` is a pseudo property that applies an outline of
     * the given width with the given color, which by default is the
     * maximum contrast to the text. So a bright text color will result
     * in a black text outline for maximum readability on a mixed
     * background. In some cases, especially with grayscale text, the
     * text outline doesn't work well, in which cases it can be disabled
     * by setting it to `"none"`. When `useHTML` is true, the
     * `textOutline` will not be picked up. In this, case, the same
     * effect can be achieved through the `text-shadow` CSS property.
     *
     * For some series types, where each point has an extent, like for
     * example tree maps, the data label may overflow the point. There
     * are two strategies for handling overflow. By default, the text
     * will wrap to multiple lines. The other strategy is to set
     * `style.textOverflow` to `ellipsis`, which will keep the text on
     * one line plus it will break inside long words.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-style/
     *         Bold labels
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-overflow/
     *         Long labels truncated with an ellipsis in a pie
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-overflow-wrap/
     *         Long labels are wrapped in a pie
     * @sample {highmaps} maps/demo/color-axis/
     *         Bold labels
     *
     * @since     4.1.0
     */
    style?: CSSObject;

    /**
     * Options for a label text which should follow marker's shape.
     * Border and background are disabled for a label that follows a
     * path.
     *
     * **Note:** Only SVG-based renderer supports this option. Setting
     * `useHTML` to true will disable this option.
     *
     * @declare   Highcharts.DataLabelsTextPathOptionsObject
     * @since     7.1.0
     */
    textPath?: DataLabelTextPathOptions;

    /**
     * Whether to
     * [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the labels.
     *
     * @default false
     */
    useHTML?: boolean;

    /**
     * The vertical alignment of a data label. Can be one of `top`,
     * `middle` or `bottom`. The default value depends on the data, for
     * instance in a column chart, the label is above positive values
     * and below negative values.
     *
     * @default bottom
     * @since 2.3.3
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * The x position offset of the label relative to the point in
     * pixels.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
     *         Vertical and positioned
     * @sample {highcharts} highcharts/plotoptions/bar-datalabels-align-inside-bar/
     *         Data labels inside the bar
     *
     * @default 0
     */
    x?: number;

    /**
     * The y position offset of the label relative to the point in
     * pixels.
     *
     * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/
     *         Vertical and positioned
     */
    y?: number;

    /**
     * The z index of the data labels group. Does not apply below series
     * level options.
     *
     * Use a `zIndex` of 6 to display it above the series,
     * or use a `zIndex` of 2 to display it behind the series.
     *
     * @default   6
     * @since     2.3.5
     */
    zIndex?: number;
}

/**
 * Values for handling data labels that flow outside the plot area.
 *
 * @typedef {"allow"|"justify"} Highcharts.DataLabelsOverflowValue
 */
export type DataLabelsOverflowValue = ('allow'|'justify');

export interface DataLabelTextPathOptions {
    /**
     * Presentation attributes for the text path.
     *
     * @since     7.1.0
     */
    attributes?: TextPathAttributes;

    /**
     * Enable or disable `textPath` option for link's or marker's data
     * labels.
     *
     * @since     7.1.0
     */
    enabled?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataLabelOptions;
