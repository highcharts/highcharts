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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import DerivedSeriesMixin from '../../Mixins/DerivedSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ColumnSeries = SeriesRegistry.seriesTypes.column;
import U from '../../Core/Utilities.js';
var arrayMax = U.arrayMax, arrayMin = U.arrayMin, correctFloat = U.correctFloat, extend = U.extend, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach;
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
 * @private
 * @param {Array<number>} bins - Width of the bins
 * @return {Function}
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
/* *
 *
 *  Class
 *
 * */
/**
 * Histogram class
 * @private
 * @class
 * @name Highcharts.seriesTypes.histogram
 * @augments Highcharts.Series
 */
var HistogramSeries = /** @class */ (function (_super) {
    __extends(HistogramSeries, _super);
    function HistogramSeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.userOptions = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    HistogramSeries.prototype.binsNumber = function () {
        var binsNumberOption = this.options.binsNumber;
        var binsNumber = binsNumberFormulas[binsNumberOption] ||
            // #7457
            (typeof binsNumberOption === 'function' && binsNumberOption);
        return Math.ceil((binsNumber && binsNumber(this.baseSeries)) ||
            (isNumber(binsNumberOption) ?
                binsNumberOption :
                binsNumberFormulas['square-root'](this.baseSeries)));
    };
    HistogramSeries.prototype.derivedData = function (baseData, binsNumber, binWidth) {
        var series = this, max = correctFloat(arrayMax(baseData)), 
        // Float correction needed, because first frequency value is not
        // corrected when generating frequencies (within for loop).
        min = correctFloat(arrayMin(baseData)), frequencies = [], bins = {}, data = [], x, fitToBin;
        binWidth = series.binWidth = (correctFloat(isNumber(binWidth) ?
            (binWidth || 1) :
            (max - min) / binsNumber));
        // #12077 negative pointRange causes wrong calculations,
        // browser hanging.
        series.options.pointRange = Math.max(binWidth, 0);
        // If binWidth is 0 then max and min are equaled,
        // increment the x with some positive value to quit the loop
        for (x = min; 
        // This condition is needed because of the margin of error while
        // operating on decimal numbers. Without that, additional bin
        // was sometimes noticeable on the graph, because of too small
        // precision of float correction.
        x < max &&
            (series.userOptions.binWidth ||
                correctFloat(max - x) >= binWidth ||
                // #13069 - Every add and subtract operation should
                // be corrected, due to general problems with
                // operations on float numbers in JS.
                correctFloat(correctFloat(min + (frequencies.length * binWidth)) -
                    x) <= 0); x = correctFloat(x + binWidth)) {
            frequencies.push(x);
            bins[x] = 0;
        }
        if (bins[min] !== 0) {
            frequencies.push(min);
            bins[min] = 0;
        }
        fitToBin = fitToBinLeftClosed(frequencies.map(function (elem) {
            return parseFloat(elem);
        }));
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
        data[data.length - 1].x2 = max;
        return data;
    };
    HistogramSeries.prototype.setDerivedData = function () {
        var yData = this.baseSeries.yData;
        if (!yData.length) {
            this.setData([]);
            return;
        }
        var data = this.derivedData(yData, this.binsNumber(), this.options.binWidth);
        this.setData(data, false);
    };
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
    HistogramSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
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
        binWidth: void 0,
        pointPadding: 0,
        groupPadding: 0,
        grouping: false,
        pointPlacement: 'between',
        tooltip: {
            headerFormat: '',
            pointFormat: ('<span style="font-size: 10px">{point.x} - {point.x2}' +
                '</span><br/>' +
                '<span style="color:{point.color}">\u25CF</span>' +
                ' {series.name} <b>{point.y}</b><br/>')
        }
    });
    return HistogramSeries;
}(ColumnSeries));
extend(HistogramSeries.prototype, {
    addBaseSeriesEvents: DerivedSeriesMixin.addBaseSeriesEvents,
    addEvents: DerivedSeriesMixin.addEvents,
    destroy: DerivedSeriesMixin.destroy,
    hasDerivedData: DerivedSeriesMixin.hasDerivedData,
    init: DerivedSeriesMixin.init,
    setBaseSeries: DerivedSeriesMixin.setBaseSeries
});
SeriesRegistry.registerSeriesType('histogram', HistogramSeries);
/* *
 *
 *  Default Export
 *
 * */
export default HistogramSeries;
/* *
 *
 *  API Options
 *
 * */
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
''; // adds doclets above to transpiled file
