/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Sebastian Domas
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

import type BellcurvePoint from './BellcurvePoint';
import type BellcurveSeriesOptions from './BellcurveSeriesOptions';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';

import BellcurveSeriesDefaults from './BellcurveSeriesDefaults.js';
import DerivedComposition from '../DerivedComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { areaspline: AreaSplineSeries } = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
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

    public data: Array<BellcurvePoint> = void 0 as any;

    public mean?: number;

    public options: BellcurveSeriesOptions = void 0 as any;

    public points: Array<BellcurvePoint> = void 0 as any;

    public standardDeviation?: number;

    /* *
     *
     *  Functions
     *
     * */

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

    public setDerivedData(): Array<(PointOptions|PointShortOptions)> {
        const series = this;

        if (series.baseSeries?.yData?.length || 0 > 1) {
            series.setMean();
            series.setStandardDeviation();
            series.setData(
                series.derivedData(
                    series.mean || 0,
                    series.standardDeviation || 0
                ),
                false
            );
        }
        return (void 0) as any;
    }

    public setMean(): void {
        const series = this;

        series.mean = correctFloat(
            BellcurveSeries.mean(
                (series.baseSeries as any).yData
            ) as any
        );
    }

    public setStandardDeviation(): void {
        const series = this;

        series.standardDeviation = correctFloat(
            BellcurveSeries.standardDeviation(
                (series.baseSeries as any).yData,
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
