/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type MapBubbleSeriesOptions from './MapBubbleSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A map bubble series is a bubble series laid out on top of a map
 * series, where each bubble is tied to a specific map area.
 *
 * @sample maps/demo/map-bubble/
 *         Map bubble chart
 *
 * @extends      plotOptions.bubble
 * @product      highmaps
 * @optionparent plotOptions.mapbubble
 */
const MapBubbleSeriesDefaults: MapBubbleSeriesOptions = {
    /**
     * The main color of the series. This color affects both the fill
     * and the stroke of the bubble. For enhanced control, use `marker`
     * options.
     *
     * @sample {highmaps} maps/plotoptions/mapbubble-color/
     *         Pink bubbles
     *
     * @type      {Highcharts.ColorType}
     * @apioption plotOptions.mapbubble.color
     */

    /**
     * Whether to display negative sized bubbles. The threshold is
     * given by the [zThreshold](#plotOptions.mapbubble.zThreshold)
     * option, and negative bubbles can be visualized by setting
     * [negativeColor](#plotOptions.bubble.negativeColor).
     *
     * @type      {boolean}
     * @default   true
     * @apioption plotOptions.mapbubble.displayNegative
     */

    /**
     * Color of the line connecting bubbles. The default value is the same
     * as series' color.
     *
     * In styled mode, the color can be defined by the
     * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
     * color can be set with the `.highcharts-series`,
     * `.highcharts-color-{n}`, `.highcharts-{type}-series` or
     * `.highcharts-series-{n}` class, or individual classes given by the
     * `className` option.
     *
     *
     * @sample {highmaps} maps/demo/spider-map/
     *         Spider map
     * @sample {highmaps} maps/plotoptions/spider-map-line-color/
     *         Different line color
     *
     * @type      {Highcharts.ColorType}
     * @apioption plotOptions.mapbubble.lineColor
     */

    /**
     * Pixel width of the line connecting bubbles.
     *
     * @sample {highmaps} maps/demo/spider-map/
     *         Spider map
     *
     * @product   highmaps
     * @apioption plotOptions.mapbubble.lineWidth
     */
    lineWidth: 0,

    /**
     * Maximum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the `z` value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height.
     *
     * @sample {highmaps} highcharts/plotoptions/bubble-size/
     *         Bubble size
     * @sample {highmaps} maps/demo/spider-map/
     *         Spider map
     *
     * @product   highmaps
     * @apioption plotOptions.mapbubble.maxSize
     */

    /**
     * Minimum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the `z` value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height.
     *
     * @sample {highmaps} maps/demo/map-bubble/
     *         Bubble size
     * @sample {highmaps} maps/demo/spider-map/
     *         Spider map
     *
     * @product   highmaps
     * @apioption plotOptions.mapbubble.minSize
     */

    /**
     * When a point's Z value is below the
     * [zThreshold](#plotOptions.mapbubble.zThreshold) setting, this
     * color is used.
     *
     * @sample {highmaps} maps/plotoptions/mapbubble-negativecolor/
     *         Negative color below a threshold
     *
     * @type      {Highcharts.ColorType}
     * @apioption plotOptions.mapbubble.negativeColor
     */

    /**
     * Whether the bubble's value should be represented by the area or
     * the width of the bubble. The default, `area`, corresponds best to
     * the human perception of the size of each bubble.
     *
     * @type       {Highcharts.BubbleSizeByValue}
     * @default    area
     * @apioption  plotOptions.mapbubble.sizeBy
     */

    /**
     * When this is true, the absolute value of z determines the size
     * of the bubble. This means that with the default `zThreshold` of
     * 0, a bubble of value -1 will have the same size as a bubble of
     * value 1, while a bubble of value 0 will have a smaller size
     * according to `minSize`.
     *
     * @sample {highmaps} highcharts/plotoptions/bubble-sizebyabsolutevalue/
     *         Size by absolute value, various thresholds
     *
     * @type      {boolean}
     * @default   false
     * @since     1.1.9
     * @apioption plotOptions.mapbubble.sizeByAbsoluteValue
     */

    /**
     * The maximum for the Z value range. Defaults to the highest Z value in
     * the data.
     *
     * @see [zMin](#plotOptions.mapbubble.zMin)
     *
     * @sample {highmaps} highcharts/plotoptions/bubble-zmin-zmax/
     *         Z has a possible range of 0-100
     *
     * @type      {number}
     * @since     1.0.3
     * @apioption plotOptions.mapbubble.zMax
     */

    /**
     * The minimum for the Z value range. Defaults to the lowest Z value
     * in the data.
     *
     * @see [zMax](#plotOptions.mapbubble.zMax)
     *
     * @sample {highmaps} highcharts/plotoptions/bubble-zmin-zmax/
     *         Z has a possible range of 0-100
     *
     * @type      {number}
     * @since     1.0.3
     * @apioption plotOptions.mapbubble.zMin
     */

    /**
     * When [displayNegative](#plotOptions.mapbubble.displayNegative)
     * is `false`, bubbles with lower Z values are skipped. When
     * `displayNegative` is `true` and a
     * [negativeColor](#plotOptions.mapbubble.negativeColor) is given,
     * points with lower Z is colored.
     *
     * @sample {highmaps} maps/plotoptions/mapbubble-negativecolor/
     *         Negative color below a threshold
     *
     * @type      {number}
     * @default   0
     * @apioption plotOptions.mapbubble.zThreshold
     */

    /**
     * @default 500
     */
    animationLimit: 500,

    /**
     * @type {string|Array<string>}
     */
    joinBy: 'hc-key',
    tooltip: {
        pointFormat: '{point.name}: {point.z}'
    },
    stickyTracking: true
} as MapBubbleSeriesOptions;

/* *
 *
 *  Default Export
 *
 * */

export default MapBubbleSeriesDefaults;
