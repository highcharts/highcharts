/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Sebastian Domas
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

import type BellcurveSeriesOptions from './BellcurveSeriesOptions';

/* *
 *
 *  API Optiions
 *
 * */

/**
 * A bell curve is an areaspline series which represents the probability
 * density function of the normal distribution. It calculates mean and
 * standard deviation of the base series data and plots the curve according
 * to the calculated parameters.
 *
 * @sample {highcharts} highcharts/demo/bellcurve/
 *         Bell curve
 *
 * @extends      plotOptions.areaspline
 * @since        6.0.0
 * @product      highcharts
 * @excluding    boostThreshold, connectNulls, dragDrop, stacking,
 *               pointInterval, pointIntervalUnit
 * @requires     modules/bellcurve
 * @optionparent plotOptions.bellcurve
 */
const BellcurveSeriesDefaults: BellcurveSeriesOptions = {

    /**
     * @see [fillColor](#plotOptions.bellcurve.fillColor)
     * @see [fillOpacity](#plotOptions.bellcurve.fillOpacity)
     *
     * @apioption plotOptions.bellcurve.color
     */

    /**
     * @see [color](#plotOptions.bellcurve.color)
     * @see [fillOpacity](#plotOptions.bellcurve.fillOpacity)
     *
     * @apioption plotOptions.bellcurve.fillColor
     */

    /**
     * @see [color](#plotOptions.bellcurve.color)
     * @see [fillColor](#plotOptions.bellcurve.fillColor)
     *
     * @default   {highcharts} 0.75
     * @default   {highstock} 0.75
     * @apioption plotOptions.bellcurve.fillOpacity
     */

    /**
     * This option allows to define the length of the bell curve. A unit of
     * the length of the bell curve is standard deviation.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *         Intervals and points in interval
     */
    intervals: 3,

    /**
     * Defines how many points should be plotted within 1 interval. See
     * `plotOptions.bellcurve.intervals`.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *         Intervals and points in interval
     */
    pointsInInterval: 3,

    marker: {
        enabled: false
    }

};

/**
 * A `bellcurve` series. If the [type](#series.bellcurve.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to
 * [plotOptions.bellcurve](#plotOptions.bellcurve).
 *
 * @extends   series,plotOptions.bellcurve
 * @since     6.0.0
 * @product   highcharts
 * @excluding dataParser, dataURL, data, boostThreshold, boostBlending
 * @requires  modules/bellcurve
 * @apioption series.bellcurve
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @apioption series.bellcurve.baseSeries
 */

/**
 * @see [fillColor](#series.bellcurve.fillColor)
 * @see [fillOpacity](#series.bellcurve.fillOpacity)
 *
 * @apioption series.bellcurve.color
 */

/**
 * @see [color](#series.bellcurve.color)
 * @see [fillOpacity](#series.bellcurve.fillOpacity)
 *
 * @apioption series.bellcurve.fillColor
 */

/**
 * @see [color](#series.bellcurve.color)
 * @see [fillColor](#series.bellcurve.fillColor)
 *
 * @default   {highcharts} 0.75
 * @default   {highstock} 0.75
 * @apioption series.bellcurve.fillOpacity
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default BellcurveSeriesDefaults;
