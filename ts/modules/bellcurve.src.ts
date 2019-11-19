/* *
 *
 *  (c) 2010-2019 Highsoft AS
 *
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
        class BellcurvePoint extends AreaSplinePoint {
            public option: BellcurvePointOptions;
            public series: BellcurveSeries;
        }
        class BellcurveSeries
            extends AreaSplineSeries
            implements DerivedSeries {
            public addBaseSeriesEvents: DerivedSeriesMixin[
                'addBaseSeriesEvents'
            ];
            public addEvents: DerivedSeriesMixin['addEvents'];
            public data: Array<BellcurvePoint>;
            public eventRemovers: DerivedSeries['eventRemovers'];
            public hasDerivedData: DerivedSeriesMixin['hasDerivedData'];
            public init: DerivedSeriesMixin['init'];
            public initialised: DerivedSeries['initialised'];
            public mean?: number;
            public options: BellcurveSeriesOptions;
            public pointClass: typeof BellcurvePoint;
            public points: Array<BellcurvePoint>;
            public setBaseSeries: DerivedSeriesMixin['setBaseSeries'];
            public setDerivedData: DerivedSeriesMixin['setDerivedData'];
            public standardDeviation?: number;
            public derivedData(
                mean: number,
                standardDeviation: number
            ): Array<Array<number>>;
            public setMean(): void;
            public setStandardDeviation(): void;
        }
        interface BellcurvePointOptions extends AreaSplinePointOptions {
        }
        interface BellcurveSeriesOptions
            extends AreaSplineSeriesOptions, DerivedSeriesOptions
        {
            baseSeries?: (number|string);
            data?: undefined;
            intervals?: number;
            pointsInInterval?: number;
            states?: SeriesStatesOptionsObject<BellcurveSeries>;
        }
        interface SeriesTypesDictionary {
            bellcurve: typeof BellcurveSeries;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    correctFloat,
    isNumber
} = U;

import derivedSeriesMixin from '../mixins/derived-series.js';

var seriesType = H.seriesType,
    merge = H.merge;

/* ************************************************************************** *
 *  BELL CURVE                                                                *
 * ************************************************************************** */

/* eslint-disable valid-jsdoc */

/**
 * @private
 */
function mean(data: Array<number>): (number|false) {
    var length = data.length,
        sum = data.reduce(function (sum: number, value: number): number {
            return (sum += value);
        }, 0);

    return length > 0 && sum / length;
}

/**
 * @private
 */
function standardDeviation(
    data: Array<number>,
    average?: number
): (number|false) {
    var len = data.length,
        sum;

    average = isNumber(average) ? average : (mean(data) as any);

    sum = data.reduce(function (sum: number, value: number): number {
        var diff = value - (average as any);

        return (sum += diff * diff);
    }, 0);

    return len > 1 && Math.sqrt(sum / (len - 1));
}

/**
 * @private
 */
function normalDensity(
    x: number,
    mean: number,
    standardDeviation: number
): number {
    var translation = x - mean;

    return Math.exp(
        -(translation * translation) /
        (2 * standardDeviation * standardDeviation)
    ) / (standardDeviation * Math.sqrt(2 * Math.PI));
}

/* eslint-enable valid-jsdoc */

/**
 * Bell curve class
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bellcurve
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.BellcurveSeries>('bellcurve', 'areaspline'

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
    , {
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

    }, merge(derivedSeriesMixin, {
        setMean: function (this: Highcharts.BellcurveSeries): void {
            this.mean = correctFloat(
                mean(
                    (this.baseSeries as any).yData
                ) as any
            );
        },

        setStandardDeviation: function (
            this: Highcharts.BellcurveSeries
        ): void {
            this.standardDeviation = correctFloat(
                standardDeviation(
                    (this.baseSeries as any).yData,
                    this.mean as any
                ) as any
            );
        },

        setDerivedData: function (
            this: Highcharts.BellcurveSeries
        ): Array<Highcharts.PointOptionsType> {
            if ((this.baseSeries as any).yData.length > 1) {
                this.setMean();
                this.setStandardDeviation();
                this.setData(
                    this.derivedData(
                        this.mean as any,
                        this.standardDeviation as any
                    ),
                    false
                );
            }
            return (void 0) as any;
        },

        derivedData: function (
            this: Highcharts.BellcurveSeries,
            mean: number,
            standardDeviation: number
        ): Array<Array<number>> {
            var intervals = this.options.intervals,
                pointsInInterval = this.options.pointsInInterval,
                x = mean - (intervals as any) * standardDeviation,
                stop = (intervals as any) * (pointsInInterval as any) * 2 + 1,
                increment = standardDeviation / (pointsInInterval as any),
                data: Array<Array<number>> = [],
                i: number;

            for (i = 0; i < stop; i++) {
                data.push([x, normalDensity(x, mean, standardDeviation)]);
                x += increment;
            }

            return data;
        }
    })
);

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
 * @excluding dataParser, dataURL, data
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

''; // adds doclets above to transpiled file
