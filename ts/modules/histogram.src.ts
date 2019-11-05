/* *
 *
 *  Copyright (c) 2010-2017 Highsoft AS
 *  Author: Sebastian Domas
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class HistogramPoint extends ColumnPoint {
            public options: HistogramPointOptions;
            public series: HistogramSeries;
        }
        class HistogramSeries extends ColumnSeries implements DerivedSeries {
            public addBaseSeriesEvents: DerivedSeriesMixin[
                'addBaseSeriesEvents'
            ];
            public addEvents: DerivedSeriesMixin['addEvents'];
            public binWidth?: number;
            public data: Array<HistogramPoint>;
            public eventRemovers: DerivedSeries['eventRemovers'];
            public hasDerivedData: DerivedSeries['hasDerivedData'];
            public init: DerivedSeriesMixin['init'];
            public initialised: DerivedSeries['initialised'];
            public options: HistogramSeriesOptions;
            public pointClass: typeof HistogramPoint;
            public points: Array<HistogramPoint>;
            public setBaseSeries: DerivedSeriesMixin['setBaseSeries'];
            public setDerivedData: DerivedSeriesMixin['setDerivedData'];
            public userOptions: HistogramSeriesOptions;
            public binsNumber(): number;
            public derivedData(
                baseData: Array<number>,
                binsNumber: number,
                binWidth: number
            ): Array<HistogramPointOptions>;
        }
        interface HistogramPointOptions extends ColumnPointOptions {
            x2?: number;
        }
        interface HistogramSeriesOptions extends ColumnSeriesOptions {
            baseSeries?: (number|string);
            binsNumber?: string;
            binWidth?: number;
            states?: SeriesStatesOptionsObject<HistogramSeries>;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    arrayMax,
    arrayMin,
    correctFloat,
    isNumber,
    objectEach
} = U;

import derivedSeriesMixin from '../mixins/derived-series.js';

var seriesType = H.seriesType,
    merge = H.merge;

/* ************************************************************************** *
 *  HISTOGRAM
 * ************************************************************************** */

/**
 * A dictionary with formulas for calculating number of bins based on the
 * base series
 **/
var binsNumberFormulas: Highcharts.Dictionary<Function> = {
    'square-root': function (baseSeries: Highcharts.Series): number {
        return Math.ceil(Math.sqrt((baseSeries.options.data as any).length));
    },

    'sturges': function (baseSeries: Highcharts.Series): number {
        return Math.ceil(
            Math.log((baseSeries.options.data as any).length) * Math.LOG2E
        );
    },

    'rice': function (baseSeries: Highcharts.Series): number {
        return Math.ceil(
            2 * Math.pow((baseSeries.options.data as any).length, 1 / 3)
        );
    }
};

/**
 * Returns a function for mapping number to the closed (right opened) bins
 * @private
 * @param {Array<number>} bins - Width of the bins
 * @return {Function}
 **/
function fitToBinLeftClosed(bins: Array<number>): Function {
    return function (y: number): number {
        var i = 1;

        while (bins[i] <= y) {
            i++;
        }
        return bins[--i];
    };
}

/**
 * Histogram class
 * @private
 * @class
 * @name Highcharts.seriesTypes.histogram
 * @augments Highcharts.Series
 */

seriesType<Highcharts.HistogramSeries>(
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
     * @excluding    boostThreshold, dragDrop, pointInterval, pointIntervalUnit,
     *               stacking
     * @product      highcharts
     * @since        6.0.0
     * @requires     modules/histogram
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
        binWidth: void 0,
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
        setDerivedData: function (this: Highcharts.HistogramSeries): void {
            var yData = (this.baseSeries as any).yData;

            if (!yData.length) {
                return;
            }

            var data = this.derivedData(
                yData,
                this.binsNumber(),
                this.options.binWidth as any
            );

            this.setData(data, false);
        },

        derivedData: function (
            this: Highcharts.HistogramSeries,
            baseData: Array<number>,
            binsNumber: number,
            binWidth: number
        ): Array<Highcharts.HistogramPointOptions> {
            var series = this,
                max = arrayMax(baseData),
                // Float correction needed, because first frequency value is not
                // corrected when generating frequencies (within for loop).
                min = correctFloat(arrayMin(baseData)),
                frequencies: Array<number> = [],
                bins: Highcharts.Dictionary<number> = {},
                data: Array<Highcharts.HistogramPointOptions> = [],
                x: number,
                fitToBin: Function;

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
                (frequencies as any).map(function (elem: string): number {
                    return parseFloat(elem);
                })
            );

            baseData.forEach(function (y: number): void{
                var x = correctFloat(fitToBin(y));

                bins[x]++;
            });

            objectEach(bins, function (frequency: number, x: string): void {
                data.push({
                    x: Number(x),
                    y: frequency,
                    x2: correctFloat(Number(x) + binWidth)
                });
            });

            data.sort(function (
                a: Highcharts.PointOptionsObject,
                b: Highcharts.PointOptionsObject
            ): number {
                return (a.x as any) - (b.x as any);
            });

            return data;
        },

        binsNumber: function (this: Highcharts.HistogramSeries): number {
            var binsNumberOption = this.options.binsNumber;
            var binsNumber = binsNumberFormulas[binsNumberOption as any] ||
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
