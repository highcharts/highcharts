/* *
 *
 *  Solid angular gauge module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SolidGaugeSeriesOptions from './SolidGaugeSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A solid gauge is a circular gauge where the value is indicated by a filled
 * arc, and the color of the arc may variate with the value.
 *
 * @sample highcharts/demo/gauge-solid/
 *         Solid gauges
 *
 * @extends      plotOptions.gauge
 * @excluding    dial, pivot, wrap
 * @product      highcharts
 * @requires     modules/solid-gauge
 * @optionparent plotOptions.solidgauge
 */
const SolidGaugeSeriesDefaults: SolidGaugeSeriesOptions = {

    /**
     * The inner radius for points in a solid gauge. Can be given only in
     * percentage, either as a number or a string like `"50%"`.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
     *         Individual radius and innerRadius
     *
     * @type      {string}
     * @default   "60%"
     * @since     4.1.6
     * @product   highcharts
     * @apioption plotOptions.solidgauge.innerRadius
     */

    /**
     * Whether the strokes of the solid gauge should be `round` or `square`.
     *
     * @sample {highcharts} highcharts/demo/gauge-activity/
     *         Rounded gauge
     *
     * @type       {string}
     * @default    round
     * @since      4.2.2
     * @product    highcharts
     * @validvalue ["square", "round"]
     * @apioption  plotOptions.solidgauge.linecap
     */

    /**
     * Allow the gauge to overshoot the end of the perimeter axis by this
     * many degrees. Say if the gauge axis goes from 0 to 60, a value of
     * 100, or 1000, will show 5 degrees beyond the end of the axis when this
     * option is set to 5.
     *
     * @type      {number}
     * @default   0
     * @since     3.0.10
     * @product   highcharts
     * @apioption plotOptions.solidgauge.overshoot
     */

    /**
     * The outer radius for points in a solid gauge. Can be given only in
     * percentage, either as a number or a string like `"100%"`.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
     *         Individual radius and innerRadius
     *
     * @type      {string}
     * @default   "100%"
     * @since     4.1.6
     * @product   highcharts
     * @apioption plotOptions.solidgauge.radius
     */

    /**
     * Whether to draw rounded edges on the gauge. This options adds the radius
     * of the rounding to the ends of the arc, so it extends past the actual
     * values. When `borderRadius` is set, it takes precedence over `rounded`. A
     * `borderRadius` of 50% behaves like `rounded`, except the shape is not
     * extended past its value.
     *
     * @sample {highcharts} highcharts/demo/gauge-activity/
     *         Activity Gauge
     *
     * @type      {boolean}
     * @default   false
     * @since     5.0.8
     * @product   highcharts
     * @apioption plotOptions.solidgauge.rounded
     */

    /**
     * The threshold or base level for the gauge.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-threshold/
     *         Zero threshold with negative and positive values
     *
     * @type      {number|null}
     * @since     5.0.3
     * @product   highcharts
     * @apioption plotOptions.solidgauge.threshold
     */

    /**
     * Whether to give each point an individual color.
     */
    colorByPoint: true,

    dataLabels: {
        y: 0
    }
};

/**
 * A `solidgauge` series. If the [type](#series.solidgauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.solidgauge
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, dial,
 *            findNearestPointBy, getExtremesFromAll, marker, negativeColor,
 *            pointPlacement, pivot, shadow, softThreshold, stack, stacking,
 *            states, step, threshold, turboThreshold, wrap, zoneAxis, zones,
 *            dataSorting, boostBlending
 * @product   highcharts
 * @requires  modules/solid-gauge
 * @apioption series.solidgauge
 */

/**
 * An array of data points for the series. For the `solidgauge` series
 * type, points can be given in the following ways:
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
 *    [turboThreshold](#series.solidgauge.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        y: 5,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
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
 * @type      {Array<number|null|*>}
 * @extends   series.gauge.data
 * @product   highcharts
 * @apioption series.solidgauge.data
 */

/**
 * The inner radius of an individual point in a solid gauge. Can be given only
 * in percentage, either as a number or a string like `"50%"`.
 *
 * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
 *         Individual radius and innerRadius
 *
 * @type      {string}
 * @since     4.1.6
 * @product   highcharts
 * @apioption series.solidgauge.data.innerRadius
 */

/**
 * The outer radius of an individual point in a solid gauge. Can be
 * given only in percentage, either as a number or a string like `"100%"`.
 *
 * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
 *         Individual radius and innerRadius
 *
 * @type      {string}
 * @since     4.1.6
 * @product   highcharts
 * @apioption series.solidgauge.data.radius
 */

''; // keeps doclets above in transpiled file

/* *
 *
 *  Default Export
 *
 * */

export default SolidGaugeSeriesDefaults;
