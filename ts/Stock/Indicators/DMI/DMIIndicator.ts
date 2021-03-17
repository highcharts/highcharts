/* *
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

import type {
    DMIOptions,
    DMIParamsOptions
} from './DMIOptions';
import type DMIPoint from './DMIPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    merge,
    isArray
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The DMI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dmi
 *
 * @augments Highcharts.Series
 */
class DMIIndicator extends SMAIndicator {
    public static defaultOptions: DMIOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            // check index
            period: 9
        }
    } as DMIOptions);

    /* *
     *
     *  Properties
     *
     * */

    /* *
     *
     *  Functions
     *
     * */

    public calculateDM(
        yVal: Array<Array<number>>,
        i: number,
        isPositiveDM?: boolean
    ): number {
        const currentHigh = yVal[i][1],
            currentLow = yVal[i][2],
            previousHigh = yVal[i - 1][1],
            previousLow = yVal[i - 1][2];

        let DM: number = 0;

        if (currentHigh - previousHigh > previousLow - currentLow) {
            // for +DM
            DM = isPositiveDM ? Math.max(currentHigh - previousHigh, 0) : 0;
        } else {
            // for -DM
            DM = !isPositiveDM ? Math.max(previousLow - currentLow, 0) : 0;
        }

        return DM;
    }

    public calculateDI(
        smoothedDM: number,
        tr: number
    ): number {
        return smoothedDM / tr * 100;
    }

    public calculateDMI(
        plusDI: number,
        minusDI: number
    ): number {
        return Math.abs(plusDI - minusDI) / Math.abs(plusDI + minusDI) * 100;
    }

    public smoothValues(
        accumulatedValues: number,
        currentValue: number,
        period: number
    ): number {
        return accumulatedValues - accumulatedValues / period + currentValue;
    }

    public getTR(
        currentPoint: Array<number>,
        prevPoint: Array<number>
    ): number {
        const HL = currentPoint[1] - currentPoint[2],
            HCp = prevPoint ? 0 : Math.abs(currentPoint[1] - prevPoint[3]),
            LCp = prevPoint ? 0 : Math.abs(currentPoint[2] - prevPoint[3]),
            TR = Math.max(HL, HCp, LCp);

        return TR;
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: DMIParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const period: number = (params.period as any),
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            plusDIValues: Array<number> = [],
            minusDIValues: Array<number> = [],
            DXPoints: Array<Array<number>> = [],
            xData: Array<number> = [],
            DXValues: Array<number> = [];

        if (
            // Check period, if bigger than points length, skip
            (xVal.length <= period) ||
            // Only ohlc data is valid
            !isArray(yVal[0]) ||
            yVal[0].length !== 4
        ) {
            return;
        }

        let prevSmoothedPlusDM: number = 0,
            prevSmoothedMinusDM: number = 0,
            prevSmoothedTR: number = 0,
            i: number;

        for (i = 1; i < yValLen; i++) {
            let smoothedPlusDM: number,
                smoothedMinusDM: number,
                smoothedTR: number,
                currentPlusDM: number, // +DM
                currentMinusDM: number, // -DM
                currentTR: number,
                DX: number;

            if (i <= period) {
                currentPlusDM = this.calculateDM(yVal, i, true);
                currentMinusDM = this.calculateDM(yVal, i);
                currentTR = this.getTR(yVal[i], yVal[i - 1]);
                // Accumulate first period values to smooth them later
                prevSmoothedPlusDM += currentPlusDM;
                prevSmoothedMinusDM += currentMinusDM;
                prevSmoothedTR += currentTR;

                // Get all values for the first point
                if (i === period) {
                    // +DI
                    plusDIValues.push(
                        this.calculateDI(prevSmoothedPlusDM, prevSmoothedTR)
                    );
                    // -DI
                    minusDIValues.push(
                        this.calculateDI(prevSmoothedMinusDM, prevSmoothedTR)
                    );
                    // DX
                    DX = this.calculateDMI(
                        prevSmoothedPlusDM,
                        prevSmoothedMinusDM
                    );
                    DXValues.push(DX);

                    xData.push(xVal[i]);
                    DXPoints.push([xVal[i], DX]);
                }
            } else {
                // Calculate current values
                currentPlusDM = this.calculateDM(yVal, i, true);
                currentMinusDM = this.calculateDM(yVal, i);
                currentTR = this.getTR(yVal[i], yVal[i - 1]);
                // Smooth +DM, -DM and TR
                smoothedPlusDM = this.smoothValues(
                    prevSmoothedPlusDM,
                    currentPlusDM,
                    period
                );
                smoothedMinusDM = this.smoothValues(
                    prevSmoothedMinusDM,
                    currentMinusDM,
                    period
                );
                smoothedTR = this.smoothValues(
                    prevSmoothedTR,
                    currentTR,
                    period
                );
                // Save current smoothed values for the next step
                prevSmoothedPlusDM = smoothedPlusDM;
                prevSmoothedMinusDM = smoothedMinusDM;
                prevSmoothedTR = smoothedTR;

                // Get all next points (except the first one calculated above)
                // +DI
                plusDIValues.push(
                    this.calculateDI(prevSmoothedPlusDM, prevSmoothedTR)
                );
                // -DI
                minusDIValues.push(
                    this.calculateDI(prevSmoothedMinusDM, prevSmoothedTR)
                );
                // DX
                DX = this.calculateDMI(
                    prevSmoothedPlusDM,
                    prevSmoothedMinusDM
                );
                DXValues.push(DX);

                xData.push(xVal[i]);
                DXPoints.push([xVal[i], DX]);
            }
        }

        return {
            values: DXPoints,
            xData: xData,
            yData: DXValues
        } as IndicatorValuesObject<TLinkedSeries>;
    }

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface DMIIndicator {
    pointClass: typeof DMIPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        dmi: typeof DMIIndicator;
    }
}
SeriesRegistry.registerSeriesType('dmi', DMIIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default DMIIndicator;

''; // adds doclet above to the transpiled file
