/**
 * @license  @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Sebastian Domas
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import derivedSeriesMixin from '../mixins/derived-series.js';

var seriesType = H.seriesType,
    correctFloat = H.correctFloat,
    isNumber = H.isNumber,
    merge = H.merge,
    reduce = H.reduce;


/** ****************************************************************************
 *
 * BELL CURVE
 *
 ******************************************************************************/

function mean(data) {
    var length = data.length,
        sum = reduce(data, function (sum, value) {
            return (sum += value);
        }, 0);

    return length > 0 && sum / length;
}

function standardDeviation(data, average) {
    var len = data.length,
        sum;

    average = isNumber(average) ? average : mean(data);

    sum = reduce(data, function (sum, value) {
        var diff = value - average;
        return (sum += diff * diff);
    }, 0);

    return len > 1 && Math.sqrt(sum / (len - 1));
}

function normalDensity(x, mean, standardDeviation) {
    var translation = x - mean;
    return Math.exp(
        -(translation * translation) /
        (2 * standardDeviation * standardDeviation)
    ) / (standardDeviation * Math.sqrt(2 * Math.PI));
}


/**
 * Bell curve class
 *
 * @constructor seriesTypes.bellcurve
 * @augments seriesTypes.areaspline
 * @mixes DerivedSeriesMixin
 **/

/**
 * A bell curve is an areaspline series which represents the probability density
 * function of the normal distribution. It calculates mean and standard
 * deviation of the base series data and plots the curve according to the
 * calculated parameters.
 *
 * @product      highcharts
 * @sample       {highcharts} highcharts/demo/bellcurve/ Bell curve
 * @since        6.0.0
 * @extends      plotOptions.areaspline
 * @excluding    boostThreshold,connectNulls,stacking,pointInterval,
 *               pointIntervalUnit
 * @optionparent plotOptions.bellcurve
 **/
seriesType('bellcurve', 'areaspline', {
   /**
    * This option allows to define the length of the bell curve. A unit of the
    * length of the bell curve is standard deviation.
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

}, merge(derivedSeriesMixin, {
    setMean: function () {
        this.mean = correctFloat(mean(this.baseSeries.yData));
    },

    setStandardDeviation: function () {
        this.standardDeviation = correctFloat(
            standardDeviation(this.baseSeries.yData, this.mean)
        );
    },

    setDerivedData: function () {
        if (this.baseSeries.yData.length > 1) {
            this.setMean();
            this.setStandardDeviation();
            this.setData(
                this.derivedData(this.mean, this.standardDeviation), false
            );
        }
    },

    derivedData: function (mean, standardDeviation) {
        var intervals = this.options.intervals,
            pointsInInterval = this.options.pointsInInterval,
            x = mean - intervals * standardDeviation,
            stop = intervals * pointsInInterval * 2 + 1,
            increment = standardDeviation / pointsInInterval,
            data = [],
            i;

        for (i = 0; i < stop; i++) {
            data.push([x, normalDensity(x, mean, standardDeviation)]);
            x += increment;
        }

        return data;
    }
}));


/**
* A `bellcurve` series. If the [type](#series.bellcurve.type) option is not
* specified, it is inherited from [chart.type](#chart.type).
*
* For options that apply to multiple series, it is recommended to add
* them to the [plotOptions.series](#plotOptions.series) options structure.
* To apply to all series of this specific type, apply it to
* [plotOptions.bellcurve](#plotOptions.bellcurve).
*
* @type      {Object}
* @since     6.0.0
* @extends   series,plotOptions.bellcurve
* @excluding dataParser,dataURL,data
* @product   highcharts
* @apioption series.bellcurve
*/

/**
* An integer identifying the index to use for the base series, or a string
* representing the id of the series.
*
* @type      {Number|String}
* @default   undefined
* @apioption series.bellcurve.baseSeries
*/

/**
* An array of data points for the series. For the `bellcurve` series type,
* points are calculated dynamically.
*
* @type      {Array<Object|Array>}
* @since     6.0.0
* @extends   series.areaspline.data
* @product   highcharts
* @apioption series.bellcurve.data
*/
