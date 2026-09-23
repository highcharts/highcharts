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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GaugeSeriesOptions from './GaugeSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * Gauges are circular plots displaying one or more values with a dial
 * pointing to values along the perimeter.
 *
 * @sample highcharts/demo/gauge-speedometer/
 *         Gauge chart
 *
 * @extends      plotOptions.line
 * @excluding    animationLimit, boostThreshold, colorAxis, colorKey,
 *               connectEnds, connectNulls, cropThreshold, dashStyle,
 *               dragDrop, findNearestPointBy, getExtremesFromAll, marker,
 *               negativeColor, pointPlacement, shadow, softThreshold,
 *               stacking, states, step, threshold, turboThreshold, xAxis,
 *               zoneAxis, zones, dataSorting, boostBlending
 * @product      highcharts
 * @requires     highcharts-more
 * @optionparent plotOptions.gauge
 */
const GaugeSeriesDefaults: GaugeSeriesOptions = {

    clip: false,

    color: 'var(--highcharts-neutral-color-20)',

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
     * @type      {boolean}
     * @default   undefined
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.wrap
     */

    /**
     * Data labels for the gauge. For gauges, the data labels are
     * enabled by default and shown in the center.
     *
     * @since   2.3.0
     * @product highcharts
     */
    dataLabels: {
        crop: false,
        defer: false,
        distance: 0,
        enabled: true,
        padding: 5,
        verticalAlign: 'top',
        style: {
            fontSize: '1.4em'
        },
        y: 25,
        zIndex: 2
    },

    /**
     * Options for the dial or arrow pointer of the gauge.
     *
     * In styled mode, the dial is styled with the
     * `.highcharts-gauge-series .highcharts-dial` rule.
     *
     * @sample {highcharts} highcharts/css/gauge/
     *         Styled mode
     *
     * @type    {*}
     * @since   2.3.0
     * @product highcharts
     */
    dial: {
        /**
         * The background or fill color of the gauge's dial.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {Highcharts.ColorType}
         * @default   #000000
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.backgroundColor
         */
        backgroundColor: 'var(--highcharts-neutral-color-100)',

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
         * @type      {number|string}
         * @default   0
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.baseLength
         */
        baseLength: 0,

        /**
         * The width of the base of the gauge dial. The base is the part
         * closest to the pivot, defined by baseLength. Accepts a pixel
         * value if given as a number, or a percentage value if given as
         * a percentage string.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {number|string}
         * @default   18%
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.baseWidth
         */
        baseWidth: '18%',

        /**
         * The border color or stroke of the gauge's dial. By default,
         * the borderWidth is 0, so this must be set in addition to a
         * custom border color.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {Highcharts.ColorType}
         * @default   #cccccc
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.borderColor
         */
        borderColor: 'var(--highcharts-neutral-color-20)',

        /**
         * The border radius of the gauge dial
         *
         * @type      {number|string}
         * @default   9%
         * @since     13.0.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.borderRadius
         */
        borderRadius: '9%',

        /**
         * The width of the gauge dial border in pixels.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {number}
         * @default   0
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.borderWidth
         */
        borderWidth: 0,

        /**
         * An array with an SVG path for the custom dial.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-path/
         *         Dial options demonstrated
         *
         * @type      {Highcharts.SVGPathArray}
         * @since 10.2.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.path
         */

        /**
         * The radius or length of the dial, relative to the radius of
         * the gauge itself. Accepts a pixel value if given as a number,
         * or a percentage value if given as a percentage string.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {number|string}
         * @default   70%
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.radius
         */
        radius: '70%',

        /**
         * The length of the dial's rear end, the part that extends out
         * on the other side of the pivot. Accepts a pixel value if
         * given as a number, or a percentage value of the dial's length
         * if given as a percentage string.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {number|string}
         * @default   9%
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.rearLength
         */
        rearLength: '9%',

        /**
         * The width of the top of the dial, closest to the perimeter.
         * The pivot narrows in from the base to the top. Accepts a
         * pixel value if given as a number, or a percentage of the dial
         * radius if given as a percentage string.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-dial/
         *         Dial options demonstrated
         *
         * @type      {number|string}
         * @default   4%
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.dial.topWidth
         */
        topWidth: '4%'
    },

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
     * @type      {number}
     * @since     3.0.10
     * @product   highcharts
     * @apioption plotOptions.gauge.overshoot
     */

    /**
     * Options for the pivot or the center point of the gauge.
     *
     * In styled mode, the pivot is styled with the
     * `.highcharts-gauge-series .highcharts-pivot` rule.
     *
     * @sample {highcharts} highcharts/css/gauge/
     *         Styled mode
     *
     * @type    {*}
     * @since   2.3.0
     * @product highcharts
     */

    pivot: {
        /**
         * The radius of the pivot, the center point of the gauge.
         * Accepts a pixel value if given as a number, or a percentage
         * of the full gauge radius if given as a percentage string.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
         *         Pivot options demonstrated
         *
         * @type      {number|string}
         * @default   4%
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.pivot.radius
         */
        radius: '4%',

        /**
         * The border or stroke width of the pivot.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
         *         Pivot options demonstrated
         *
         * @type      {number}
         * @default   0
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.pivot.borderWidth
         */
        borderWidth: 2,

        /**
         * The border or stroke color of the pivot.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
         *         Pivot options demonstrated
         *
         * @type      {Highcharts.ColorType}
         * @default   var(--highcharts-neutral-color-100)
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.pivot.borderColor
         */
        borderColor: 'var(--highcharts-neutral-color-100)',

        /**
         * The background color or fill of the pivot.
         *
         * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
         *         Pivot options demonstrated
         *
         * @type      {Highcharts.ColorType}
         * @default   var(--highcharts-background-color)
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.gauge.pivot.backgroundColor
         */
        backgroundColor: 'var(--highcharts-background-color)'
    },

    threshold: 0,

    tooltip: {
        headerFormat: ''
    },

    /**
     * Whether to display this particular series or series type in the
     * legend. Defaults to false for gauge series.
     *
     * @since   2.3.0
     * @product highcharts
     */
    showInLegend: false

};

/**
 * A `gauge` series. If the [type](#series.gauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.gauge
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, findNearestPointBy,
 *            getExtremesFromAll, marker, negativeColor, pointPlacement, shadow,
 *            softThreshold, stack, stacking, states, step, threshold,
 *            turboThreshold, zoneAxis, zones, dataSorting, boostBlending
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.gauge
 */

/**
 * An array of data points for the series. For the `gauge` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
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
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @basic
 * @type      {Array<number|null|*>}
 * @extends   series.line.data
 * @excluding drilldown, marker, x
 * @product   highcharts
 * @apioption series.gauge.data
 */

''; // Adds the doclets above in the transpiled file

/* *
 *
 *  Default Export
 *
 * */

export default GaugeSeriesDefaults;
