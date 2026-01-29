/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type HistogramPoint from './HistogramPoint';
import type HistogramPointOptions from './HistogramPointOptions';
import type HistogramSeriesOptions from './HistogramSeriesOptions';

import DerivedComposition from '../DerivedComposition.js';
import HistogramSeriesDefaults from './HistogramSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
import AnimationOptions from '../../Core/Animation/AnimationOptions';
const {
    arrayMax,
    arrayMin,
    correctFloat,
    isNumber,
    merge
} = U;

/* ************************************************************************** *
 *  HISTOGRAM
 * ************************************************************************** */

/**
 * A dictionary with formulas for calculating number of bins based on data
 **/
const binsNumberFormulas: Record<string, Function> = {
    'square-root': function (data: number[]): number {
        return Math.ceil(Math.sqrt((data as any).length));
    },

    'sturges': function (data: number[]): number {
        return Math.ceil(
            Math.log((data as any).length) * Math.LOG2E
        );
    },

    'rice': function (data: number[]): number {
        return Math.ceil(
            2 * Math.pow((data as any).length, 1 / 3)
        );
    }
};

/**
 * Returns a function for mapping number to the closed (right opened) bins
 * @private
 * @param {Array<number>} bins
 * Width of the bins
 */
function fitToBinLeftClosed(bins: Array<number>): Function {
    return function (y: number): number {
        let i = 1;

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
class HistogramSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: HistogramSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        HistogramSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public binWidth?: number;

    public data!: Array<HistogramPoint>;

    public options!: HistogramSeriesOptions;

    public points!: Array<HistogramPoint>;

    public userOptions!: HistogramSeriesOptions;

    /* *
     *
     *  Functions
     *
     * */

    public binsNumber(data?: number[]): number {
        const binsNumberOption = this.options.binsNumber;
        const binsNumber = binsNumberFormulas[binsNumberOption as any] ||
            // #7457
            (typeof binsNumberOption === 'function' && binsNumberOption);

        return Math.ceil(
            (binsNumber && binsNumber(data)) ||
            (
                isNumber(binsNumberOption) ?
                    binsNumberOption :
                    binsNumberFormulas['square-root'](data)
            )
        );
    }

    public setData(
        data: number[]|undefined,
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>),
        updatePoints?: boolean
    ): void {
        let alteredData;
        if (typeof data !== 'undefined' && data.length > 0) {
            alteredData = this.derivedData(
                data.filter(isNumber),
                this.binsNumber(data),
                this.options.binWidth as any
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
        baseData: Array<number>,
        binsNumber: number,
        binWidth: number
    ): Array<HistogramPointOptions> {
        const series = this,
            max = correctFloat(arrayMax(baseData)),
            // Float correction needed, because first frequency value is not
            // corrected when generating frequencies (within for loop).
            min = correctFloat(arrayMin(baseData)),
            frequencies: Array<number> = [],
            bins: Record<string, number> = {},
            data: Array<HistogramPointOptions> = [];

        let x: number;

        binWidth = series.binWidth = (
            correctFloat(
                isNumber(binWidth) ?
                    (binWidth || 1) :
                    (max - min) / binsNumber
            )
        );

        // #12077 negative pointRange causes wrong calculations,
        // browser hanging.
        series.options.pointRange = Math.max(binWidth, 0);

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
                    // #13069 - Every add and subtract operation should
                    // be corrected, due to general problems with
                    // operations on float numbers in JS.
                    correctFloat(
                        correctFloat(min + (frequencies.length * binWidth)) -
                        x
                    ) <= 0
                );
            x = correctFloat(x + binWidth)
        ) {
            frequencies.push(x);
            bins[x] = 0;
        }

        if (bins[min] !== 0) {
            frequencies.push(min);
            bins[min] = 0;
        }

        const fitToBin = fitToBinLeftClosed(
            frequencies.map((elem): number => parseFloat(elem as any))
        );

        for (const y of baseData) {
            bins[correctFloat(fitToBin(y))]++;
        }

        for (const key of Object.keys(bins)) {
            data.push({
                x: Number(key),
                y: bins[key],
                x2: correctFloat(Number(key) + binWidth)
            });
        }

        data.sort((a, b): number => ((a.x as any) - (b.x as any)));

        data[data.length - 1].x2 = max;

        return data;
    }

    public setDerivedData(): void {
        const yData = this.baseSeries?.getColumn('y');

        if (!yData?.length) {
            this.setData([]);
            return;
        }

        this.setData(yData, false, void 0, false);
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface HistogramSeries extends DerivedComposition.SeriesComposition {
    animate: typeof ColumnSeries.prototype.animate;
    destroy: typeof ColumnSeries.prototype.destroy;
    drawPoints: typeof ColumnSeries.prototype.drawPoints;
    drawTracker: typeof ColumnSeries.prototype.drawTracker;
    group: typeof ColumnSeries.prototype.group;
    init: typeof ColumnSeries.prototype.init;
    pointAttribs: typeof ColumnSeries.prototype.pointAttribs;
    pointClass: typeof HistogramPoint;
    remove: typeof ColumnSeries.prototype.remove;
}

DerivedComposition.compose(HistogramSeries);

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        histogram: typeof HistogramSeries;
    }
}

SeriesRegistry.registerSeriesType('histogram', HistogramSeries);

/* *
 *
 *  Default Export
 *
 * */

export default HistogramSeries;
