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
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../../Renderer/CSSObject';
import type Templating from '../../Templating';
import type PlotLineOrBand from './PlotLineOrBand';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options for plot band labels on axes.
 *
 * @product highcharts highstock gantt
 */
export interface PlotBandLabelOptions {

    /**
     * Horizontal alignment of the label. Can be one of "left", "center" or
     * "right".
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-align/
     *         Aligned to the right
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @default center
     * @since   2.1
     */
    align?: AlignValue;

    /**
     * Whether or not the label can be hidden if it overlaps with another label.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-allowoverlap/
     *         A Plotband label overlapping another
     *
     * @default undefined
     * @since   11.4.8
     */
    allowOverlap?: boolean,

    /**
     * A custom class name, in addition to the default `highcharts-plot-band`,
     * to apply to each individual band.
     *
     * @internal
     * @since 5.0.0
     */
    className?: string;

    /**
     * Whether to hide labels that are outside the plot area.
     *
     * @internal
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
     *
     * @internal
     */
    formatter?: Templating.FormatterCallback<PlotLineOrBand>;

    /**
     * Wether or not the text of the label can exceed the width of the label.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-textwidth/
     *         Displaying text with text-wrapping/ellipsis, or the full text.
     *
     * @default true
     * @product highcharts highstock gantt
     * @since   11.4.6
     */
    inside?: boolean;

    /**
     * Rotation of the text label in degrees .
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/
     *         Vertical text
     *
     * @default 0
     * @since   2.1
     */
    rotation?: number;

    /**
     * CSS styles for the text label.
     *
     * In styled mode, the labels are styled by the
     * `.highcharts-plot-band-label` class.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-style/
     *         Blue and bold label
     *
     * @since 2.1
     */
    style?: CSSObject;

    /**
     * The string text itself. A subset of HTML is supported.
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
     * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/
     *         Vertical text in center position but text-aligned left
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
     * Vertical alignment of the label relative to the plot band. Can be one of
     * "top", "middle" or "bottom".
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-verticalalign/
     *         Vertically centered label
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @default top
     * @since   2.1
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * Horizontal position relative the alignment. Default varies by
     * orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-align/
     *         Aligned 10px from the right edge
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @since 2.1
     */
    x?: number;

    /**
     * Vertical position of the text baseline relative to the alignment. Default
     * varies by orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-y/
     *         Label on x axis
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @since 2.1
     */
    y?: number;

}

/**
 * Options for plot bands on axes.
 *
 * @productdesc {highcharts}
 * In a gauge, a plot band on the Y axis (value axis) will stretch along the
 * perimeter of the gauge.
 *
 * @product highcharts highstock gantt
 */
export interface PlotBandOptions {

    /**
     * Flag to decide if plotBand should be rendered across all panes.
     *
     * @default true
     * @product highstock
     * @since   7.1.2
     */
    acrossPanes?: boolean;

    /**
     * Border color for the plot band. Also requires `borderWidth` to be set.
     */
    borderColor?: ColorString;

    /**
     * Border radius for the plot band. Applies only to gauges. Can be a pixel
     * value or a percentage, for example `50%`.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-gauge-borderradius
     *         Angular gauge with rounded plot bands
     *
     * @since 11.4.2
     */
    borderRadius?: number|string;

    /**
     * Border width for the plot band. Also requires `borderColor` to be set.
     *
     * @default 0
     */
    borderWidth?: number;

    /**
     * A custom class name, in addition to the default `highcharts-plot-band`,
     * to apply to each individual band.
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * The color of the plot band.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Color band
     * @sample {highstock} stock/xaxis/plotbands/
     *         Plot band on Y axis
     *
     * @default ${palette.highlightColor10}
     */
    color?: ColorType;

    /**
     * An object defining mouse events for the plot band. Supported properties
     * are `click`, `mouseover`, `mouseout`, `mousemove`.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-events/
     *         Mouse events demonstrated
     *
     * @since 1.2
     */
    events?: any;

    /**
     * The start position of the plot band in axis units.
     *
     * On datetime axes, the value can be given as a timestamp or a date string.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Datetime axis
     * @sample {highcharts} highcharts/xaxis/plotbands-from/
     *         Categorized axis
     * @sample {highstock} stock/xaxis/plotbands/
     *         Plot band on Y axis
     */
    from?: number|string;

    /**
     * An id used for identifying the plot band in Axis.removePlotBand.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-id/
     *         Remove plot band by id
     * @sample {highstock} highcharts/xaxis/plotbands-id/
     *         Remove plot band by id
     */
    id?: string;

    /**
     * Text labels for the plot bands.
     *
     * @product highcharts highstock gantt
     */
    label?: PlotBandLabelOptions;

    /**
     * The end position of the plot band in axis units.
     *
     * On datetime axes, the value can be given as a timestamp or a date string.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Datetime axis
     * @sample {highcharts} highcharts/xaxis/plotbands-from/
     *         Categorized axis
     * @sample {highstock} stock/xaxis/plotbands/
     *         Plot band on Y axis
     */
    to?: number|string;

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
     * @since 1.2
     */
    zIndex?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default PlotBandOptions;
