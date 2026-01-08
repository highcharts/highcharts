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
import type AnimationOptions from '../../Animation/AnimationOptions';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../../Renderer/CSSObject';
import type { DataLabelsOverflowValue } from '../../Series/DataLabelOptions';
import type StackItem from './StackItem';
import type { SymbolKey } from '../../Renderer/SVG/SymbolType';
import type Templating from '../../Templating';

/* *
 *
 *  Declarations
 *
 * */

declare module '../AxisOptions' {
    interface AxisOptions {
        /**
         * The stack labels show the total value for each bar in a stacked
         * column or bar chart. The label will be placed on top of positive
         * columns and below negative columns. In case of an inverted column
         * chart or a bar chart the label is placed to the right of positive
         * bars and to the left of negative bars.
         *
         * @product highcharts
         */
        stackLabels?: StackLabelOptions;
    }
}

declare module '../../Series/SeriesOptions' {
    interface SeriesOptions {

        /**
         * This option allows grouping series in a stacked chart. The stack
         * option can be a string or anything else, as long as the grouped
         * series' stack options match each other after conversion into a
         * string.
         *
         * @sample {highcharts} highcharts/series/stack/
         *         Stacked and grouped columns
         * @sample {highcharts} highcharts/series/stack-centerincategory/
         *         Stacked and grouped, centered in category
         *
         * @since     2.1
         * @product   highcharts highstock
         */
        stack?: (number|string);

        /**
         * Whether to stack the values of each series on top of each other.
         * Possible values are null to disable, `"normal"` to stack by
         * value or `"percent"`.
         *
         * When stacking is enabled, data must be sorted
         * in ascending X order.
         *
         * Some stacking options are related to specific series types. In the
         * streamgraph series type, the stacking option is set to `"stream"`.
         * The second one is `"overlap"`, which only applies to waterfall
         * series.
         *
         * @see [yAxis.reversedStacks](#yAxis.reversedStacks)
         *
         * @sample {highcharts} highcharts/plotoptions/series-stacking-line/
         *         Line
         * @sample {highcharts} highcharts/plotoptions/series-stacking-column/
         *         Column
         * @sample {highcharts} highcharts/plotoptions/series-stacking-bar/
         *         Bar
         * @sample {highcharts} highcharts/plotoptions/series-stacking-area/
         *         Area
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-line/
         *         Line
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-column/
         *         Column
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-bar/
         *         Bar
         * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-area/
         *         Area
         * @sample {highcharts} highcharts/plotoptions/series-waterfall-with-normal-stacking
         *         Waterfall with normal stacking
         * @sample {highcharts} highcharts/plotoptions/series-waterfall-with-overlap-stacking
         *         Waterfall with overlap stacking
         * @sample {highstock} stock/plotoptions/stacking/
         *         Area
         *
         * @default null
         * @product highcharts highstock
         */
        stacking?: StackOverflowValue;

    }
}

export interface StackLabelOptions {

    /**
     * Enable or disable the initial animation when a series is
     * displayed for the `stackLabels`. The animation can also be set as
     * a configuration object. Please note that this option only
     * applies to the initial animation.
     * For other animations, see [chart.animation](#chart.animation)
     * and the animation parameter under the API methods.
     * The following properties are supported:
     *
     * - `defer`: The animation delay time in milliseconds.
     *
     * @sample {highcharts} highcharts/plotoptions/animation-defer/
     *          Animation defer settings
     *
     * @since 8.2.0
     */
    animation?: (false|Partial<StackLabelAnimationOptions>);

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
     * @since   2.1.5
     * @product highcharts
     */
    align?: AlignValue;

    /**
     * Allow the stack labels to overlap.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-allowoverlap-false/
     *         Default false
     *
     * @since   5.0.13
     * @product highcharts
     */
    allowOverlap?: boolean;

    /**
     * The background color or gradient for the stack label.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-box/
     *          Stack labels box options
     *
     * @since 8.1.0
     */
    backgroundColor?: ColorType;

    /**
     * The border color for the stack label. Defaults to `undefined`.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-box/
     *          Stack labels box options
     *
     * @since 8.1.0
     */
    borderColor?: ColorType;

    /**
     * The border radius in pixels for the stack label.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-box/
     *          Stack labels box options
     *
     * @default 0
     * @since   8.1.0
     */
    borderRadius?: number;

    /**
     * The border width in pixels for the stack label.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-box/
     *          Stack labels box options
     *
     * @default 0
     * @since   8.1.0
     */
    borderWidth?: number;

    /**
     * Whether to hide stack labels that are outside the plot area.
     * By default, the stack label is moved
     * inside the plot area according to the
     * [overflow](/highcharts/#yAxis/stackLabels/overflow)
     * option.
     *
     * @since 7.1.3
     */
    crop?: boolean;

    /**
     * Enable or disable the stack total labels.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-enabled/
     *         Enabled stack total labels
     * @sample {highcharts} highcharts/yaxis/stacklabels-enabled-waterfall/
     *         Enabled stack labels in waterfall chart
     *
     * @since   2.1.5
     * @product highcharts
     */
    enabled?: boolean;

    /**
     * A format string for the data label. Available variables are the same
     * as for `formatter`.
     *
     * @default {total}
     * @since   3.0.2
     * @product highcharts highstock
     */
    format?: string;

    /**
     * Callback JavaScript function to format the label. The value is
     * given by `this.total`.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-formatter/
     *         Added units to stack total value
     *
     * @since   2.1.5
     * @product highcharts
     */
    formatter?: Templating.FormatterCallback<StackItem>;

    /**
     * How to handle stack total labels that flow outside the plot area.
     * The default is set to `"justify"`,
     * which aligns them inside the plot area.
     * For columns and bars, this means it will be moved inside the bar.
     * To display stack labels outside the plot area,
     * set `crop` to `false` and `overflow` to `"allow"`.
     *
     * @sample highcharts/yaxis/stacklabels-overflow/
     *         Stack labels flows outside the plot area.
     *
     * @since 7.1.3
     */
    overflow?: DataLabelsOverflowValue;

    /** @internal */
    padding?: number;

    /**
     * Rotation of the labels in degrees.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-rotation/
     *         Labels rotated 45°
     *
     * @default 0
     * @since   2.1.5
     * @product highcharts
     */
    rotation?: number;

    /** @internal */
    shape?: SymbolKey;

    /**
     * CSS styles for the label.
     *
     * In styled mode, the styles are set in the
     * `.highcharts-stack-label` class.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-style/
     *         Red stack total labels
     *
     * @since   2.1.5
     * @product highcharts
     */
    style?: CSSObject;

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
     * @since   2.1.5
     * @product highcharts
     */
    textAlign?: AlignValue;

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the labels.
     *
     * @default false
     * @since   3.0
     * @product highcharts highstock
     */
    useHTML?: boolean;

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
     * @since   2.1.5
     * @product highcharts
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * The x position offset of the label relative to the left of the
     * stacked bar. The default value is calculated at runtime and depends
     * on orientation and whether the stack is positive or negative.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-x/
     *         Stack total labels with x offset
     *
     * @since   2.1.5
     * @product highcharts
     */
    x?: number;

    /**
     * The y position offset of the label relative to the tick position
     * on the axis. The default value is calculated at runtime and depends
     * on orientation and whether the stack is positive or negative.
     *
     * @sample {highcharts} highcharts/yaxis/stacklabels-y/
     *         Stack total labels with y offset
     *
     * @since   2.1.5
     * @product highcharts
     */
    y?: number;

}

export interface StackLabelAnimationOptions extends AnimationOptions {
    /**
     * The animation delay time in milliseconds.
     * Set to `0` renders stackLabel immediately.
     * As `undefined` inherits defer time from the [series.animation.defer](#plotOptions.series.animation.defer).
     *
     * @since 8.2.0
     */
    defer: number;
}

export type StackOverflowValue = (
    'normal'|'overlap'|'percent'|'stream'|'group' | null
);

/* *
 *
 *  Default Export
 *
 * */

export default StackLabelOptions;
