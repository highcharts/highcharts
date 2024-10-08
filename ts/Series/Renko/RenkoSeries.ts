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
import type Axis from '../../Core/Axis/Axis';
import type RenkoPoint from './RenkoPoint.js';

import H from '../../Core/Globals.js';
const { composed } = H;
import RenkoSeriesDefaults from './RenkoSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import U from '../../Core/Utilities.js';
const { merge, relativeLength, isNumber } = U;

/**
 * For each renko series create renko data
 */
function generateRenkoData(this: Axis): void {
    for (const series of this.series) {
        if (series.is('renko')) {
            const renkoSeries = series as RenkoSeries;
            renkoSeries.createRenkoData();
        }
    }
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
    public renkoData?: {
        x: number;
        low: number;
        high: number;
    }[];

    /**
     * Create renko data from linear data
     *
     */
    public createRenkoData(): void {
        const yData = this.yData as number[];
        const xData = this.xData as number[];
        const boxSize = this.options.boxSize;
        const change =
            isNumber(boxSize) ? boxSize : relativeLength(boxSize, yData[0]);
        const renkoData = [],
            length = xData.length;
        let prevTrend = 0;
        let prevPrice = yData[0];

        if (!this.isDirtyData && this.renkoData && this.renkoData.length > 0) {
            return;
        }

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
                        y: prevPrice,
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
                        y: prevPrice,
                        low: prevPrice - change,
                        high: prevPrice,
                        isDown: true,
                        color: this.options.downColor
                    });
                    prevPrice -= change;
                }
                prevTrend = 2;
            }
        }

        this.renkoData = renkoData;

        this.processedXData.length = 0;
        this.processedYData.length = 0;
        this.processedData = [];
        for (const point of renkoData) {
            this.processedXData.push(point.x);
            this.processedYData.push([point.high, point.low] as any);
            this.processedData.push([
                point.x,
                point.high,
                point.low,
                point.color as string
            ]);
        }
    }

    /* *
     *
     *  Static Properties
     *
     * */
    public static compose(AxisClass: typeof Axis): void {
        if (U.pushUnique(composed, 'pointandfigure')) {
            U.addEvent(AxisClass, 'postProcessData', generateRenkoData);
        }
    }

    public static defaultOptions: RenkoSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        { tooltip: ColumnSeries.defaultOptions.tooltip },
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
