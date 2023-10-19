/* *
 *
 *  (c) 2010-2021 Sebastian Bochan
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

import type ParetoPoint from './ParetoPoint';
import type ParetoSeriesOptions from './ParetoSeriesOptions';

import DerivedComposition from '../DerivedComposition.js';
import ParetoSeriesDefaults from './ParetoSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    line: LineSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    correctFloat,
    merge,
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The pareto series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pareto
 *
 * @augments Highcharts.Series
 */

class ParetoSeries extends LineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: ParetoSeriesOptions = merge(
        LineSeries.defaultOptions,
        ParetoSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<ParetoPoint> = void 0 as any;
    public points: Array<ParetoPoint> = void 0 as any;
    public options: ParetoSeriesOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

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
    public sumPointsPercents<T extends(boolean | undefined)>(
        yValues: Array<number>,
        xValues: Array<number>,
        sum: number,
        isSum?: T
    ): (T extends true ? number : Array<Array<number>>) {
        const percentPoints: Array<Array<number>> = [];

        let i = 0,
            sumY = 0,
            sumPercent = 0,
            percentPoint: (number | undefined);

        for (const point of yValues) {
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
            ++i;
        }

        return (isSum ? sumY : percentPoints) as (
            T extends true ? number : Array<Array<number>>
        );
    }

    /**
     * Calculate sum and return percent points.
     *
     * @private
     * @function Highcharts.Series#setDerivedData
     * @requires modules/pareto
     */
    public setDerivedData(): void {
        const xValues = (this.baseSeries as any).xData,
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
    }

}

/* *
 *
 *  Prototype properties
 *
 * */

interface ParetoSeries extends DerivedComposition.SeriesComposition {
    pointClass: typeof ParetoPoint;
}

extend(ParetoSeries.prototype, {
    hasDerivedData: DerivedComposition.hasDerivedData
});

DerivedComposition.compose(ParetoSeries);

/* *
 *
 *  Registry
 *
 * */

/**
 * @private
 */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pareto: typeof ParetoSeries;
    }
}

SeriesRegistry.registerSeriesType('pareto', ParetoSeries);

/* *
 *
 *  Default export
 *
 * */

export default ParetoSeries;
