/* *
 *
 *  Copyright (c) 2010-2021 Highsoft AS
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

import type HistogramSeriesOptions from './HistogramSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A histogram is a column series which represents the distribution of the
 * data set in the base series. Histogram splits data into bins and shows
 * their frequencies.
 *
 * @sample {highcharts} highcharts/demo/histogram/
 *         Histogram
 *
 * @extends      plotOptions.column
 * @excluding    boostThreshold, dragDrop, pointInterval, pointIntervalUnit,
 *               stacking, boostBlending
 * @product      highcharts
 * @since        6.0.0
 * @requires     modules/histogram
 * @optionparent plotOptions.histogram
 */
const HistogramSeriesDefaults: HistogramSeriesOptions = {

    /**
     * A preferable number of bins. It is a suggestion, so a histogram may
     * have a different number of bins. By default it is set to the square
     * root of the base series' data length. Available options are:
     * `square-root`, `sturges`, `rice`. You can also define a function
     * which takes a `baseSeries` as a parameter and should return a
     * positive integer.
     *
     * @type {"square-root"|"sturges"|"rice"|number|Function}
     */
    binsNumber: 'square-root',

    /**
     * Width of each bin. By default the bin's width is calculated as
     * `(max - min) / number of bins`. This option takes precedence over
     * [binsNumber](#plotOptions.histogram.binsNumber).
     *
     * @type {number}
     */
    binWidth: void 0,

    pointPadding: 0,

    groupPadding: 0,

    grouping: false,

    pointPlacement: 'between',

    tooltip: {
        headerFormat: '',
        pointFormat: (
            '<span style="font-size: 0.8em">{point.x} - {point.x2}' +
            '</span><br/>' +
            '<span style="color:{point.color}">\u25CF</span>' +
            ' {series.name} <b>{point.y}</b><br/>'
        )
    }

};

/**
 * A `histogram` series. If the [type](#series.histogram.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.histogram
 * @excluding data, dataParser, dataURL, boostThreshold, boostBlending
 * @product   highcharts
 * @since     6.0.0
 * @requires  modules/histogram
 * @apioption series.histogram
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @apioption series.histogram.baseSeries
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default HistogramSeriesDefaults;
