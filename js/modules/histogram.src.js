/* *
 *
 *  Copyright (c) 2010-2017 Highsoft AS
 *  Author: Sebastian Domas
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';
import H from '../parts/Globals.js';
import derivedSeriesMixin from '../mixins/derived-series.js';

var objectEach = H.objectEach,
    seriesType = H.seriesType,
    correctFloat = H.correctFloat,
    isNumber = H.isNumber,
    arrayMax = H.arrayMax,
    arrayMin = H.arrayMin,
    merge = H.merge;

/* ************************************************************************** *
 *  HISTOGRAM
 * ************************************************************************** */

/**
 * A dictionary with formulas for calculating number of bins based on the
 * base series
 **/
var binsNumberFormulas = {
    'square-root': function (baseSeries) {
        return Math.ceil(Math.sqrt(baseSeries.options.data.length));
    },

    'sturges': function (baseSeries) {
        return Math.ceil(Math.log(baseSeries.options.data.length) * Math.LOG2E);
    },

    'rice': function (baseSeries) {
        return Math.ceil(2 * Math.pow(baseSeries.options.data.length, 1 / 3));
    }
};

/**
 * Returns a function for mapping number to the closed (right opened) bins
 *
 * @param {number} binWidth - width of the bin
 * @returns {function}
 **/
function fitToBinLeftClosed(bins) {
    return function (y) {
        var i = 1;

        while (bins[i] <= y) {
            i++;
        }
        return bins[--i];
    };
}

/**
 * Histogram class
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.histogram
 * @augments Highcharts.Series
 */

seriesType(
    'histogram',
    'column',
    /**
     * A histogram is a column series which represents the distribution of the
     * data set in the base series. Histogram splits data into bins and shows
     * their frequencies.
     *
     * @sample {highcharts} highcharts/demo/histogram/
     *         Histogram
     *
     * @extends      plotOptions.column
     * @excluding    boostThreshold, pointInterval, pointIntervalUnit, stacking
     * @product      highcharts
     * @since        6.0.0
     * @optionparent plotOptions.histogram
     */
    {
        /**
         * A preferable number of bins. It is a suggestion, so a histogram may
         * have a different number of bins. By default it is set to the square
         * root of the base series' data length. Available options are:
         * `square-root`, `sturges`, `rice`. You can also define a function
         * which takes a `baseSeries` as a parameter and should return a
         * positive integer.
         *
         * @type {"square-root"|"sturges"|"rice"|number|function}
         */
        binsNumber: 'square-root',

        /**
         * Width of each bin. By default the bin's width is calculated as
         * `(max - min) / number of bins`. This option takes precedence over
         * [binsNumber](#plotOptions.histogram.binsNumber).
         *
         * @type {number}
         */
        binWidth: undefined,
        pointPadding: 0,
        groupPadding: 0,
        grouping: false,
        pointPlacement: 'between',
        tooltip: {
            headerFormat: '',
            pointFormat: (
                '<span style="font-size: 10px">{point.x} - {point.x2}' +
                '</span><br/>' +
                '<span style="color:{point.color}">\u25CF</span>' +
                ' {series.name} <b>{point.y}</b><br/>'
            )
        }

    },
    merge(derivedSeriesMixin, {
        setDerivedData: function () {
            var data = this.derivedData(
                this.baseSeries.yData,
                this.binsNumber(),
                this.options.binWidth
            );

            this.setData(data, false);
        },

        derivedData: function (baseData, binsNumber, binWidth) {
            var series = this,
                max = arrayMax(baseData),
                // Float correction needed, because first frequency value is not
                // corrected when generating frequencies (within for loop).
                min = correctFloat(arrayMin(baseData)),
                frequencies = [],
                bins = {},
                data = [],
                x,
                fitToBin;

            binWidth = series.binWidth = series.options.pointRange = (
                correctFloat(
                    isNumber(binWidth) ?
                        (binWidth || 1) :
                        (max - min) / binsNumber
                )
            );

            // If binWidth is 0 then max and min are equaled,
            // increment the x with some positive value to quit the loop
            for (
                x = min;
                // This condition is needed because of the margin of error while
                // operating on decimal numbers. Without that, additional bin
                // was sometimes noticeable on the graph, because of too small
                // precision of float correction.
                x < max &&
                    (
                        series.userOptions.binWidth ||
                        correctFloat(max - x) >= binWidth ||
                        correctFloat(
                            min + (frequencies.length * binWidth) - x
                        ) <= 0
                    );
                x = correctFloat(x + binWidth)
            ) {
                frequencies.push(x);
                bins[x] = 0;
            }

            if (bins[min] !== 0) {
                frequencies.push(correctFloat(min));
                bins[correctFloat(min)] = 0;
            }

            fitToBin = fitToBinLeftClosed(
                frequencies.map(function (elem) {
                    return parseFloat(elem);
                })
            );

            baseData.forEach(function (y) {
                var x = correctFloat(fitToBin(y));

                bins[x]++;
            });

            objectEach(bins, function (frequency, x) {
                data.push({
                    x: Number(x),
                    y: frequency,
                    x2: correctFloat(Number(x) + binWidth)
                });
            });

            data.sort(function (a, b) {
                return a.x - b.x;
            });

            return data;
        },

        binsNumber: function () {
            var binsNumberOption = this.options.binsNumber;
            var binsNumber = binsNumberFormulas[binsNumberOption] ||
                // #7457
                (typeof binsNumberOption === 'function' && binsNumberOption);

            return Math.ceil(
                (binsNumber && binsNumber(this.baseSeries)) ||
                (
                    isNumber(binsNumberOption) ?
                        binsNumberOption :
                        binsNumberFormulas['square-root'](this.baseSeries)
                )
            );
        }
    })
);

/**
 * A `histogram` series. If the [type](#series.histogram.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.histogram
 * @excluding data, dataParser, dataURL
 * @product   highcharts
 * @since     6.0.0
 * @apioption series.histogram
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @apioption series.histogram.baseSeries
 */
