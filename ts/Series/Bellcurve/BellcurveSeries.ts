/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type BellcurvePoint from './BellcurvePoint';
import type BellcurveSeriesOptions from './BellcurveSeriesOptions';

import BellcurveSeriesDefaults from './BellcurveSeriesDefaults.js';
import DerivedComposition from '../DerivedComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { areaspline: AreaSplineSeries } = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
import AnimationOptions from '../../Core/Animation/AnimationOptions';
const {
    correctFloat,
    isNumber,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Bell curve class
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bellcurve
 *
 * @augments Highcharts.Series
 */
class BellcurveSeries extends AreaSplineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: BellcurveSeriesOptions = merge(
        AreaSplineSeries.defaultOptions,
        BellcurveSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /** @private */
    private static mean(data: Array<number>): (number|false) {
        const length = data.length,
            sum = data.reduce(function (sum: number, value: number): number {
                return (sum += value);
            }, 0);

        return length > 0 && sum / length;
    }

    /** @private */
    private static standardDeviation(
        data: Array<number>,
        average?: number
    ): (number|false) {
        const len = data.length;

        average = isNumber(average) ?
            average : (BellcurveSeries.mean(data) as any);

        const sum = data.reduce((sum: number, value: number): number => {
            const diff = value - (average as any);

            return (sum += diff * diff);
        }, 0);

        return len > 1 && Math.sqrt(sum / (len - 1));
    }

    /** @private */
    private static normalDensity(
        x: number,
        mean: number,
        standardDeviation: number
    ): number {
        const translation = x - mean;

        return Math.exp(
            -(translation * translation) /
            (2 * standardDeviation * standardDeviation)
        ) / (standardDeviation * Math.sqrt(2 * Math.PI));
    }

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<BellcurvePoint>;

    public mean?: number;

    public options!: BellcurveSeriesOptions;

    public points!: Array<BellcurvePoint>;

    public standardDeviation?: number;

    /* *
     *
     *  Functions
     *
     * */

    public setData(
        data: number[]|undefined,
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>),
        updatePoints?: boolean
    ): void {
        let alteredData;
        if (typeof data !== 'undefined' && data.length > 0) {
            data = data.filter(isNumber),
            this.setMean(data);
            this.setStandardDeviation(data);
            alteredData = this.derivedData(
                this.mean || 0,
                this.standardDeviation || 0
            );
        }

        super.setData.call(
            this,
            alteredData,
            redraw,
            animation,
            updatePoints
        );
    }

    public derivedData(
        mean: number,
        standardDeviation: number
    ): Array<Array<number>> {
        const options = this.options,
            intervals = options.intervals,
            pointsInInterval = options.pointsInInterval,
            stop = intervals * pointsInInterval * 2 + 1,
            increment = standardDeviation / pointsInInterval,
            data: Array<Array<number>> = [];

        let x = mean - intervals * standardDeviation;

        for (let i = 0; i < stop; i++) {
            data.push(
                [x, BellcurveSeries.normalDensity(x, mean, standardDeviation)]
            );
            x += increment;
        }

        return data;
    }

    public setDerivedData(): void {
        const series = this;

        if (series.baseSeries?.getColumn('y').length) {
            series.setData(
                series.baseSeries?.getColumn('y'),
                false,
                void 0,
                false
            );
        }
    }

    public setMean(data: number[]): void {
        const series = this;

        series.mean = correctFloat(
            BellcurveSeries.mean(
                data || []
            ) as any
        );
    }

    public setStandardDeviation(data: number[]): void {
        const series = this;

        series.standardDeviation = correctFloat(
            BellcurveSeries.standardDeviation(
                data || [],
                series.mean as any
            ) as any
        );
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface BellcurveSeries extends DerivedComposition.SeriesComposition {
    pointClass: typeof BellcurvePoint;
}

DerivedComposition.compose(BellcurveSeries);

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        bellcurve: typeof BellcurveSeries;
    }
}
SeriesRegistry.registerSeriesType('bellcurve', BellcurveSeries);

/* *
 *
 *  Default Export
 *
 * */

export default BellcurveSeries;
