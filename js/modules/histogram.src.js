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
import derivedSeriesMixin from '../mixins/derived-series.js';

var each = H.each,
    objectEach = H.objectEach,
    seriesType = H.seriesType,
    correctFloat = H.correctFloat,
    isNumber = H.isNumber,
    arrayMax = H.arrayMax,
    arrayMin = H.arrayMin,
    merge = H.merge;

/* ***************************************************************************
 *
 * HISTOGRAM
 *
 **************************************************************************** */

/**
 * A dictionary with formulas for calculating number of bins based on the
 * base series
 **/
var binsNumberFormulas = {
    'square-root': function (baseSeries) {
        return Math.round(Math.sqrt(baseSeries.options.data.length));
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
function fitToBinLeftClosed(binWidth) {
    return function (y) {
        return Math.floor(y / binWidth) * binWidth;
    };
}

/**
 * Identity function - takes a param and returns that param
 * It is used to grouping data with the same values
 *
 * @param {number} y - value
 * @returns {number}
 **/
function identity(y) {
    return y;
}

/**
 * Histogram class
 *
 * @constructor seriesTypes.histogram
 * @augments seriesTypes.column
 * @mixes DerivedSeriesMixin
 **/

/**
 * A histogram is a column series which represents the distribution of the data
 * set in the base series. Histogram splits data into bins and shows their
 * frequencies.
 *
 * @product highcharts
 * @sample {highcharts} highcharts/demo/histogram/ Histogram
 * @since 6.0.0
 * @extends plotOptions.column
 * @excluding boostThreshold, pointInterval, pointIntervalUnit, stacking
 * @optionparent plotOptions.histogram
 **/
seriesType('histogram', 'column', {
    /**
      * A preferable number of bins. It is a suggestion, so a histogram may have
      * a different number of bins. By default it is set to the square root
      * of the base series' data length. Available options are: `square-root`,
      * `sturges`, `rice`. You can also define a function which takes a
      * `baseSeries` as a parameter and should return a positive integer.
     *
     * @type {String|Number|Function}
     * @validvalue ["square-root", "sturges", "rice"]
     */
    binsNumber: 'square-root',

    /**
     * Width of each bin. By default the bin's width is calculated as
     * `(max - min) / number of bins`. This option takes precedence over
     * [binsNumber](#plotOptions.histogram.binsNumber).
     *
     * @type {Number}
     */
    binWidth: undefined,
    pointPadding: 0,
    groupPadding: 0,
    grouping: false,
    pointPlacement: 'between',
    tooltip: {
        headerFormat: '',
        pointFormat: '<span style="font-size:10px">{point.x} - {point.x2}' +
            '</span><br/>' +
            '<span style="color:{point.color}">\u25CF</span>' +
            ' {series.name} <b>{point.y}</b><br/>'
    }

}, merge(derivedSeriesMixin, {
    setDerivedData: function () {
        var data = this.derivedData(
            this.baseSeries.yData,
            this.binsNumber(),
            this.options.binWidth
        );

        this.setData(data, false);
    },

    derivedData: function (baseData, binsNumber, binWidth) {
        var max = arrayMax(baseData),
            min = arrayMin(baseData),
            frequencies = {},
            data = [],
            x,
            fitToBin;

        binWidth = this.binWidth = isNumber(binWidth) ?
            binWidth :
            (max - min) / binsNumber;

        fitToBin = binWidth ? fitToBinLeftClosed(binWidth) : identity;

        // If binWidth is 0 then max and min are equaled,
        // increment the x with some positive value to quit the loop
        for (
            x = fitToBin(min);
            x <= max;
            x = correctFloat(x + (binWidth || 1))
        ) {
            frequencies[correctFloat(fitToBin((x)))] = 0;
        }

        each(baseData, function (y) {
            var x = correctFloat(fitToBin(y));
            frequencies[x]++;
        });

        objectEach(frequencies, function (frequency, x) {
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
}));

/**
 * A `histogram` series. If the [type](#series.histogram.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.histogram
 * @excluding dataParser,dataURL,data
 * @product highcharts
 * @apioption series.histogram
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type {Number|String}
 * @default undefined
 * @apioption series.histogram.baseSeries
 */

/**
 * An array of data points for the series. For the `histogram` series type,
 * points are calculated dynamically. See
 * [histogram.baseSeries](#series.histogram.baseSeries).
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.column.data
 * @product highcharts
 * @apioption series.histogram.data
 */
