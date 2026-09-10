/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import AnimationOptions from '../../Core/Animation/AnimationOptions';
import { correctFloat, isNumber, merge } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Bell curve class
 *
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

    /** @internal */
    public static defaultOptions: BellcurveSeriesOptions = merge(
        AreaSplineSeries.defaultOptions,
        BellcurveSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /** @internal */
    private static mean(data: Array<number>): (number|false) {
        const length = data.length,
            sum = data.reduce(function (sum: number, value: number): number {
                return (sum += value);
            }, 0);

        return length > 0 && sum / length;
    }

    /** @internal */
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

    /** @internal */
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

    /** @internal */
    public data!: Array<BellcurvePoint>;

    /** @internal */
    public mean?: number;

    public options!: BellcurveSeriesOptions;

    /** @internal */
    public points!: Array<BellcurvePoint>;

    /** @internal */
    public standardDeviation?: number;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public setData(
        data: number[]|undefined,
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>),
        updatePoints?: boolean
    ): void {
        let alteredData: Array<Array<number>> = [];
        if (typeof data !== 'undefined' && data.length > 0) {
            // Support data array of objects (#24073).
            data = data
                .map(function (
                    item: number | { y?: number | null } | null | undefined
                ): number | null | undefined {
                    return isNumber(item) ? item : item?.y;
                })
                .filter(isNumber);
            this.setMean(data);
            this.setStandardDeviation(data);
            if (
                isNumber(this.mean) &&
                isNumber(this.standardDeviation) &&
                this.standardDeviation > 0
            ) {
                alteredData = this.derivedData(
                    this.mean,
                    this.standardDeviation
                );
            }
        }

        super.setData.call(
            this,
            alteredData,
            redraw,
            animation,
            updatePoints
        );
    }

    /** @internal */
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

    /** @internal */
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

    /** @internal */
    public setMean(data: number[]): void {
        const mean = BellcurveSeries.mean(data || []);

        this.mean = isNumber(mean) ? correctFloat(mean) : void 0;
    }

    /** @internal */
    public setStandardDeviation(data: number[]): void {
        const sd = BellcurveSeries.standardDeviation(
            data || [],
            this.mean
        );

        this.standardDeviation = isNumber(sd) ? correctFloat(sd) : void 0;
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
