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

import type { BubblePointMarkerOptions } from './BubblePointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { ScatterSeriesTooltipOptions } from '../Scatter/ScatterSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A bubble series is a three dimensional series type where each point
 * renders an X, Y and Z value. Each points is drawn as a bubble where the
 * position along the X and Y axes mark the X and Y values, and the size of
 * the bubble relates to the Z value.
 *
 * A `bubble` series. If the [type](#series.bubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/bubble/
 *         Bubble chart
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.bubble
 *
 * @excluding cluster
 *
 * @excluding dataParser, dataURL, legendSymbolColor, stack
 *
 * @product highcharts highstock
 *
 * @requires highcharts-more
 */
export interface BubbleSeriesOptions extends ScatterSeriesOptions {

    /**
     * Whether to display negative sized bubbles. The threshold is given
     * by the [zThreshold](#plotOptions.bubble.zThreshold) option, and negative
     * bubbles can be visualized by setting
     * [negativeColor](#plotOptions.bubble.negativeColor).
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-negative/
     *         Negative bubbles
     *
     * @default true
     *
     * @since 3.0
     */
    displayNegative?: boolean;

    /**
     * @extends plotOptions.series.marker
     *
     * @excluding enabled, enabledThreshold, height, radius, width
     */
    marker?: BubblePointMarkerOptions;

    /**
     * Minimum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the `z` value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-size/
     *         Bubble size
     *
     * @since 3.0
     *
     * @product highcharts highstock
     */
    minSize?: (number|string);

    /**
     * Maximum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the `z` value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-size/
     *         Bubble size
     *
     * @since 3.0
     *
     * @product highcharts highstock
     */
    maxSize?: (number|string);

    /**
     * Whether the bubble's value should be represented by the area or the
     * width of the bubble. The default, `area`, corresponds best to the
     * human perception of the size of each bubble.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-sizeby/
     *         Comparison of area and size
     *
     * @default area
     *
     * @since 3.0.7
     */
    sizeBy?: BubbleSizeByValue;

    /**
     * When this is true, the absolute value of z determines the size of
     * the bubble. This means that with the default `zThreshold` of 0, a
     * bubble of value -1 will have the same size as a bubble of value 1,
     * while a bubble of value 0 will have a smaller size according to
     * `minSize`.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-sizebyabsolutevalue/
     *         Size by absolute value, various thresholds
     *
     * @default false
     *
     * @since 4.1.9
     *
     * @product highcharts
     */
    sizeByAbsoluteValue?: boolean;

    tooltip?: BubbleSeriesTooltipOptions;

    /**
     * The minimum for the Z value range. Defaults to the highest Z value
     * in the data.
     *
     * @see [zMin](#plotOptions.bubble.zMin)
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-zmin-zmax/
     *         Z has a possible range of 0-100
     *
     * @since 4.0.3
     *
     * @product highcharts
     */
    zMax?: number;

    /**
     * The minimum for the Z value range. Defaults to the lowest Z value
     * in the data.
     *
     * @see [zMax](#plotOptions.bubble.zMax)
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-zmin-zmax/
     *         Z has a possible range of 0-100
     *
     * @since 4.0.3
     *
     * @product highcharts
     */
    zMin?: number;

    /**
     * When [displayNegative](#plotOptions.bubble.displayNegative) is `false`,
     * bubbles with lower Z values are skipped. When `displayNegative`
     * is `true` and a [negativeColor](#plotOptions.bubble.negativeColor)
     * is given, points with lower Z is colored.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-negative/
     *         Negative bubbles
     *
     * @since 3.0
     *
     * @product highcharts
     */
    zThreshold?: number;
}

export interface BubbleSeriesTooltipOptions
    extends ScatterSeriesTooltipOptions {
    /**
     * @default '({point.x}, {point.y}), Size: {point.z}'
     */
    pointFormat?: ScatterSeriesTooltipOptions['pointFormat'];
}

export type BubbleSizeByValue = ('area'|'width');

/* *
 *
 *  Default Export
 *
 * */

export default BubbleSeriesOptions;
