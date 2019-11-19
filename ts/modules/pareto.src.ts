/* *
 *
 *  (c) 2010-2017 Sebastian Bochan
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
        class ParetoPoint extends LinePoint {
            public options: ParetoPointOptions;
            public series: ParetoSeries;
        }
        class ParetoSeries extends LineSeries implements DerivedSeries {
            public addBaseSeriesEvents: (
                DerivedSeriesMixin['addBaseSeriesEvents']
            );
            public addEvents: DerivedSeriesMixin['addEvents'];
            public data: Array<ParetoPoint>;
            public eventRemovers: DerivedSeries['eventRemovers'];
            public hasDerivedData: DerivedSeries['hasDerivedData'];
            public init: DerivedSeriesMixin['init'];
            public initialised: DerivedSeries['initialised'];
            public options: ParetoSeriesOptions;
            public pointClass: typeof ParetoPoint;
            public points: Array<ParetoPoint>;
            public setBaseSeries: DerivedSeriesMixin['setBaseSeries'];
            public setDerivedData: DerivedSeries['setDerivedData'];
            public sumPointsPercents<T extends (boolean|undefined)> (
                yValues: Array<number>,
                xValues: Array<number>,
                sum: number,
                isSum?: T
            ): (T extends true ? number : Array<Array<number>>);
        }
        interface ParetoPointOptions extends LinePointOptions {
        }
        interface ParetoSeriesOptions extends LineSeriesOptions {
            states?: SeriesStatesOptionsObject<ParetoSeries>;
        }
        interface SeriesTypesDictionary {
            pareto: typeof ParetoSeries;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    correctFloat
} = U;
import '../parts/Options.js';
import derivedSeriesMixin from '../mixins/derived-series.js';

var seriesType = H.seriesType,
    merge = H.merge;


/**
 * The pareto series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pareto
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.ParetoSeries>('pareto', 'line'

    /**
     * A pareto diagram is a type of chart that contains both bars and a line
     * graph, where individual values are represented in descending order by
     * bars, and the cumulative total is represented by the line.
     *
     * @sample {highcharts} highcharts/demo/pareto/
     *         Pareto diagram
     *
     * @extends      plotOptions.line
     * @since        6.0.0
     * @product      highcharts
     * @excluding    allAreas, boostThreshold, borderColor, borderRadius,
     *               borderWidth, crisp, colorAxis, depth, data, dragDrop,
     *               edgeColor, edgeWidth, findNearestPointBy, gapSize, gapUnit,
     *               grouping, groupPadding, groupZPadding, maxPointWidth, keys,
     *               negativeColor, pointInterval, pointIntervalUnit,
     *               pointPadding, pointPlacement, pointRange, pointStart,
     *               pointWidth, shadow, step, softThreshold, stacking,
     *               threshold, zoneAxis, zones
     * @requires     modules/pareto
     * @optionparent plotOptions.pareto
     */
    , {
        /**
         * Higher zIndex than column series to draw line above shapes.
         */
        zIndex: 3
    },

    /* eslint-disable no-invalid-this, valid-jsdoc */

    merge(derivedSeriesMixin, {
        /**
         * Calculate sum and return percent points.
         *
         * @private
         * @function Highcharts.Series#setDerivedData
         * @requires modules/pareto
         */
        setDerivedData: (function (this: Highcharts.ParetoSeries): void {
            var xValues = (this.baseSeries as any).xData,
                yValues = (this.baseSeries as any).yData,
                sum = this.sumPointsPercents(
                    yValues,
                    xValues,
                    null as any,
                    true
                );

            this.setData(
                this.sumPointsPercents(yValues, xValues, sum, false),
                false
            );
        } as any),
        /**
         * Calculate y sum and each percent point.
         *
         * @private
         * @function Highcharts.Series#sumPointsPercents
         *
         * @param {Array<number>} yValues
         * Y values
         *
         * @param {Array<number>} xValues
         * X values
         *
         * @param {number} sum
         * Sum of all y values
         *
         * @param {boolean} [isSum]
         * Declares if calculate sum of all points
         *
         * @return {number|Array<number,number>}
         * Returns sum of points or array of points [x,sum]
         *
         * @requires modules/pareto
         */
        sumPointsPercents: function<T extends (boolean|undefined)> (
            this: Highcharts.ParetoSeries,
            yValues: Array<number>,
            xValues: Array<number>,
            sum: number,
            isSum?: T
        ): (T extends true ? number : Array<Array<number>>) {
            var sumY = 0,
                sumPercent = 0,
                percentPoints: Array<Array<number>> = [],
                percentPoint: (number|undefined);

            yValues.forEach(function (point: number, i: number): void {
                if (point !== null) {
                    if (isSum) {
                        sumY += point;
                    } else {
                        percentPoint = (point / sum) * 100;
                        percentPoints.push([
                            xValues[i],
                            correctFloat(sumPercent + percentPoint)
                        ]);
                        sumPercent += percentPoint;
                    }
                }
            });

            return (isSum ? sumY : percentPoints) as (
                T extends true ? number : Array<Array<number>>
            );
        }
    })

    /* eslint-enable no-invalid-this, valid-jsdoc */
);

/**
 * A `pareto` series. If the [type](#series.pareto.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pareto
 * @since     6.0.0
 * @product   highcharts
 * @excluding data, dataParser, dataURL
 * @requires  modules/pareto
 * @apioption series.pareto
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @default   undefined
 * @apioption series.pareto.baseSeries
 */

/**
 * An array of data points for the series. For the `pareto` series type,
 * points are calculated dynamically.
 *
 * @type      {Array<Array<number|string>|*>}
 * @extends   series.column.data
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.pareto.data
 */

''; // adds the doclets above to the transpiled file
