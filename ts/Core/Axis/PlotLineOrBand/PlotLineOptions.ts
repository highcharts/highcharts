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

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Renderer/AlignObject';
import type ColorString from '../../Color/ColorString';
import type CSSObject from '../../Renderer/CSSObject';
import type DashStyleValue from '../../Renderer/DashStyleValue';
import type Templating from '../../Templating';
import type PlotLineOrBand from './PlotLineOrBand';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options for plot line labels on axes.
 */
export interface PlotLineLabelOptions {

    /**
     * Horizontal alignment of the label. Can be one of "left", "center" or
     * "right".
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/
     *         Aligned to the right
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @default left
     * @since   2.1
     */
    align?: AlignValue;

    /**
     * A custom class name, in addition to the default `highcharts-plot-line`,
     * to apply to each individual line.
     *
     * @since 5.0.0
     * @internal
     */
    className?: string;

    /**
     * Whether to hide labels that are outside the plot area.
     *
     * @default false
     * @since   10.3.3
     */
    clip?: boolean;

    /**
     * Callback JavaScript function to format the label. Useful properties like
     * the value of plot line or the range of plot band (`from` & `to`
     * properties) can be found in `this.options` object.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-plotbands-label-formatter
     *         Label formatters for plot line and plot band.
     */
    formatter?: Templating.FormatterCallback<PlotLineOrBand>;

    /**
     * Rotation of the text label in degrees. Defaults to 0 for horizontal plot
     * lines and 90 for vertical lines.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/
     *         Slanted text
     *
     * @since 2.1
     */
    rotation?: number;

    /**
     * CSS styles for the text label.
     *
     * In styled mode, the labels are styled by the
     * `.highcharts-plot-line-label` class.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-style/
     *         Blue and bold label
     *
     * @since 2.1
     */
    style?: CSSObject;

    /**
     * The text itself. A subset of HTML is supported.
     *
     * @since 2.1
     */
    text?: string;

    /**
     * The text alignment for the label. While `align` determines where the
     * texts anchor point is placed within the plot band, `textAlign` determines
     * how the text is aligned against its anchor point. Possible values are
     * "left", "center" and "right". Defaults to the same as the `align` option.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-textalign/
     *         Text label in bottom position
     *
     * @since 2.1
     */
    textAlign?: AlignValue;

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the labels.
     *
     * @default false
     * @since   3.0.3
     */
    useHTML?: boolean;

    /**
     * Vertical alignment of the label relative to the plot line. Can be
     * one of "top", "middle" or "bottom".
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/
     *         Vertically centered label
     *
     * @default {highcharts} top
     * @default {highstock} top
     * @since   2.1
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * Horizontal position relative the alignment. Default varies by
     * orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/
     *         Aligned 10px from the right edge
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @since 2.1
     */
    x?: number;

    /**
     * Vertical position of the text baseline relative to the alignment. Default
     * varies by orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-y/
     *         Label below the plot line
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @since 2.1
     */
    y?: number;

}

/**
 * Options for plot lines on axes.
 *
 * @sample {highcharts} highcharts/xaxis/plotlines-color/
 *         Basic plot line
 * @sample {highcharts} highcharts/series-solidgauge/labels-auto-aligned/
 *         Solid gauge plot line
 *
 * @product highcharts highstock gantt
 */
export interface PlotLineOptions {

    /**
     * Flag to decide if plotLine should be rendered across all panes.
     *
     * @sample {highstock} stock/xaxis/plotlines-acrosspanes/
     *         Plot lines on different panes
     *
     * @default true
     * @product highstock
     * @since   7.1.2
     */
    acrossPanes?: boolean;

    /**
     * A custom class name, in addition to the default `highcharts-plot-line`,
     * to apply to each individual line.
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * The color of the line.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-color/
     *         A red line from X axis
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @default ${palette.neutralColor40}
     */
    color?: ColorString;

    /**
     * The dashing or dot style for the plot line. For possible values see
     * [this overview](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-dashstyle/
     *         Dash and dot pattern
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @default Solid
     * @since   1.2
     */
    dashStyle?: DashStyleValue;

    /**
     * An object defining mouse events for the plot line. Supported
     * properties are `click`, `mouseover`, `mouseout`, `mousemove`.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-events/
     *         Mouse events demonstrated
     *
     * @since 1.2
     */
    events?: any;

    /**
     * An id used for identifying the plot line in Axis.removePlotLine.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-id/
     *         Remove plot line by id
     */
    id?: string;

    /**
     * Text labels for the plot lines.
     */
    label?: PlotLineLabelOptions;

    /** @internal */
    translatedValue?: number;

    /**
     * The position of the line in axis units.
     *
     * On datetime axes, the value can be given as a timestamp or a date string.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-color/
     *         Between two categories on X axis
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     */
    value?: number|string;

    /**
     * The width or thickness of the plot line.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-color/
     *         2px wide line from X axis
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @default 2
     */
    width?: number;

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
     * @since 1.2
     */
    zIndex?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default PlotLineOptions;
