/* *
 *
 *  (c) 2010-2024 Pawel Lysy
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

import type RenkoSeriesOptions from './RenkoSeriesOptions';
import type RenkoPoint from './RenkoPoint.js';
import type ColorType from '../../Core/Color/ColorType';
import type Series from '../../Core/Series/Series';

import RenkoSeriesDefaults from './RenkoSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import U from '../../Core/Utilities.js';
const { merge, relativeLength, isNumber } = U;

interface RenkoData {
    x: number;
    low: number;
    high: number;
    color?: ColorType;
}
/* *
 *
 *  Class
 *
 * */

/**
 * The renko series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.renko
 *
 * @augments Highcharts.seriesTypes.column
 */
class RenkoSeries extends ColumnSeries {
    /**
     * Renko data created from linear data
     */
    public renkoData?: RenkoData[];
    public hasDerivedData = true;

    public getProcessedData(): Series.ProcessedDataObject {
        const processedXData = [];
        const processedYData = [];
        const processedData = [];
        const yData = this.yData as number[];
        const xData = this.xData as number[];
        const boxSize = this.options.boxSize;
        const change =
            isNumber(boxSize) ? boxSize : relativeLength(boxSize, yData[0]);
        const renkoData: RenkoData[] = [],
            length = xData.length;
        let prevTrend = 0;
        let prevPrice = yData[0];

        for (let i = 1; i < length; i++) {
            const currentChange = yData[i] - yData[i - 1];
            if (currentChange > change) {
                // Uptrend
                if (prevTrend === 2) {
                    prevPrice += change;
                }

                for (let j = 0; j < currentChange / change; j++) {
                    renkoData.push({
                        x: xData[i] + j,
                        low: prevPrice,
                        high: prevPrice + change,
                        color: this.options.color
                    });
                    prevPrice += change;
                }
                prevTrend = 1;
            } else if (Math.abs(currentChange) > change) {
                if (prevTrend === 1) {
                    prevPrice -= change;
                }
                // Downtrend
                for (let j = 0; j < Math.abs(currentChange) / change; j++) {
                    renkoData.push({
                        x: xData[i] + j,
                        low: prevPrice - change,
                        high: prevPrice,
                        color: this.options.downColor
                    });
                    prevPrice -= change;
                }
                prevTrend = 2;
            }
        }

        this.renkoData = renkoData;

        for (const point of renkoData) {
            processedXData.push(point.x);
            processedYData.push([point.high, point.low] as any);
            processedData.push([
                point.x,
                point.high,
                point.low,
                point.color as string
            ]);
        }

        this.processedData = processedData;
        return {
            xData: processedXData,
            yData: processedYData,
            cropped: false,
            cropStart: 0,
            closestPointRange: 1
        };
    }

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: RenkoSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        RenkoSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<RenkoPoint>;

    public options!: RenkoSeriesOptions;

    public points!: Array<RenkoPoint>;

    /* *
     *
     *  Functions
     *
     * */
}

interface RenkoSeries {
    pointClass: typeof RenkoPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        renko: typeof RenkoSeries;
    }
}

SeriesRegistry.registerSeriesType('renko', RenkoSeries);

/* *
 *
 *  Default Export
 *
 * */

export default RenkoSeries;
