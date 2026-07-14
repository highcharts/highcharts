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

import type ColorType from '../../Core/Color/ColorType';
import type GaugePointOptions from './GaugePointOptions';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface GaugeSeriesDialOptions {

    /**
     * The background or fill color of the gauge's dial.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default #000000
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    backgroundColor: ColorType;

    /**
     * The length of the dial's base part, relative to the total
     * radius or length of the dial. Accepts a pixel value if given
     * as a number, or a percentage value if given as a percentage
     * string. If the base length is greater than 0, the dial's base
     * will have an even width, before it narrows in to the top.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default 0
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    baseLength: number|string;

    /**
     * The width of the base of the gauge dial. The base is the part
     * closest to the pivot, defined by baseLength. Accepts a pixel
     * value if given as a number, or a percentage value if given as
     * a percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default 18%
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    baseWidth: number|string;

    /**
     * The border color or stroke of the gauge's dial. By default,
     * the borderWidth is 0, so this must be set in addition to a
     * custom border color.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default #cccccc
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    borderColor: ColorType;

    /**
     * The border radius of the gauge dial
     *
     * @default 9%
     *
     * @since 13.0.0
     *
     * @product highcharts
     */
    borderRadius: number|string;

    /**
     * The width of the gauge dial border in pixels.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default 0
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    borderWidth: number;

    /**
     * An array with an SVG path for the custom dial.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-path/
     *         Dial options demonstrated
     *
     * @since 10.2.0
     *
     * @product highcharts
     */
    path?: SVGPath;

    /**
     * The radius or length of the dial, relative to the radius of
     * the gauge itself. Accepts a pixel value if given as a number,
     * or a percentage value if given as a percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default 70%
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    radius: number|string;

    /**
     * The length of the dial's rear end, the part that extends out
     * on the other side of the pivot. Accepts a pixel value if
     * given as a number, or a percentage value of the dial's length
     * if given as a percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default 9%
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    rearLength: number|string;

    /**
     * The width of the top of the dial, closest to the perimeter.
     * The pivot narrows in from the base to the top. Accepts a
     * pixel value if given as a number, or a percentage of the dial
     * radius if given as a percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-dial/
     *         Dial options demonstrated
     *
     * @default 4%
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    topWidth: number|string;
}

export interface GaugeSeriesPivotOptions {

    /**
     * The background color or fill of the pivot.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
     *         Pivot options demonstrated
     *
     * @default var(--highcharts-background-color)
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    backgroundColor: ColorType;

    /**
     * The border or stroke color of the pivot.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
     *         Pivot options demonstrated
     *
     * @default var(--highcharts-neutral-color-100)
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    borderColor: ColorType;

    /**
     * The border or stroke width of the pivot.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
     *         Pivot options demonstrated
     *
     * @default 0
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    borderWidth: number;

    /**
     * The radius of the pivot, the center point of the gauge.
     * Accepts a pixel value if given as a number, or a percentage
     * of the full gauge radius if given as a percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
     *         Pivot options demonstrated
     *
     * @default 4%
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    radius: number|string;
}

/**
 * Gauges are circular plots displaying one or more values with a dial
 * pointing to values along the perimeter.
 *
 * A `gauge` series. If the [type](#series.gauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/gauge-speedometer/
 *         Gauge chart
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.gauge
 *
 * @excluding animationLimit, boostBlending, boostThreshold, colorAxis,
 *            colorKey, connectEnds, connectNulls, cropThreshold, dashStyle,
 *            dataParser, dataSorting, dataURL, dragDrop, findNearestPointBy,
 *            getExtremesFromAll, negativeColor, pointPlacement,
 *            shadow, softThreshold, stack, stacking, step,
 *            turboThreshold, xAxis, zoneAxis, zones
 *
 * @product highcharts
 *
 * @requires highcharts-more
 */
export interface GaugeSeriesOptions extends LineSeriesOptions {

    /**
     * An array of data points for the series. For the `gauge` series type,
     * points can be given in the following ways:
     *
     * 1. An array of numerical values. In this case, the numerical values
     *    will be interpreted as `y` options. Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *    only a few settings, see the complete options set below. If the
     *    total number of data points exceeds the series'
     *    [turboThreshold](#series.gauge.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        y: 6,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        y: 8,
     *        name: "Point1",
     *       color: "#FF00FF"
     *    }]
     *    ```
     *
     * The typical gauge only contains a single data value.
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @basic
     *
     * @extends series.line.data
     *
     * @excluding drilldown, marker, x
     *
     * @product highcharts
     */
    data?: Array<(GaugePointOptions|PointShortOptions)>;

    /**
     * Options for the dial or arrow pointer of the gauge.
     *
     * In styled mode, the dial is styled with the
     * `.highcharts-gauge-series .highcharts-dial` rule.
     *
     * @sample {highcharts} highcharts/css/gauge/
     *         Styled mode
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    dial?: GaugeSeriesDialOptions;

    /**
     * Allow the dial to overshoot the end of the perimeter axis by
     * this many degrees. Say if the gauge axis goes from 0 to 60, a
     * value of 100, or 1000, will show 5 degrees beyond the end of the
     * axis when this option is set to 5.
     *
     * @see [wrap](#plotOptions.gauge.wrap)
     *
     * @sample {highcharts} highcharts/plotoptions/gauge-overshoot/
     *         Allow 5 degrees overshoot
     *
     * @since 3.0.10
     *
     * @product highcharts
     */
    overshoot?: number;

    /**
     * Options for the pivot or the center point of the gauge.
     *
     * In styled mode, the pivot is styled with the
     * `.highcharts-gauge-series .highcharts-pivot` rule.
     *
     * @sample {highcharts} highcharts/css/gauge/
     *         Styled mode
     *
     * @since 2.3.0
     *
     * @product highcharts
     */
    pivot?: GaugeSeriesPivotOptions;

    states?: SeriesStatesOptions<GaugeSeriesOptions>;

    /**
     * When this option is `true`, the dial will wrap around the axes.
     * For instance, in a full-range gauge going from 0 to 360, a value
     * of 400 will point to 40. When `wrap` is `false`, the dial stops
     * at 360.
     *
     * Defaults to `undefined`, which is equivalent to `true` when
     * the axis ranges over 360 degrees, and `false` when less.
     *
     * @see [overshoot](#plotOptions.gauge.overshoot)
     *
     * @default undefined
     *
     * @since 3.0
     *
     * @product highcharts
     */
    wrap?: boolean;

    /* *
     *
     *  Excluded
     *
     * */

    animationLimit?: undefined;
    boostBlending?: undefined;
    boostThreshold?: undefined;
    colorAxis?: undefined;
    colorKey?: undefined;
    connectEnds?: undefined;
    connectNulls?: undefined;
    cropThreshold?: undefined;
    dashStyle?: undefined;
    dataParser?: undefined;
    dataSorting?: undefined;
    dataURL?: undefined;
    dragDrop?: undefined;
    findNearestPointBy?: undefined;
    getExtremesFromAll?: undefined;
    negativeColor?: undefined;
    pointPlacement?: undefined;
    shadow?: undefined;
    softThreshold?: undefined;
    stack?: undefined;
    stacking?: undefined;
    step?: undefined;
    turboThreshold?: undefined;
    xAxis?: undefined;
    zoneAxis?: undefined;
    zones?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default GaugeSeriesOptions;
