/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type HeikinAshiSeriesOptions from './HeikinAshiSeriesOptions';
import HeikinAshiPoint from './HeikinAshiPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
import Series from '../../Core/Series/Series.js';

const {
    seriesTypes: {
        candlestick: CandlestickSeries
    }
} = SeriesRegistry;

const {
    prototype: {
        processData: seriesProcessData
    }
} = Series;

const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Heikin Ashi series.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.heikinashi
 *
 * @augments Highcharts.Series
 */
class HeikinAshiSeries extends CandlestickSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * An HeikinAshi series is a style of financial chart used to describe price
     * movements over time. It displays open, high, low and close values per
     * data point.
     *
     * @sample stock/demo/heikinashi/
     *         Heikin Ashi series
     *
     * @extends      plotOptions.column
     * @excluding    borderColor, borderRadius, borderWidth, crisp, stacking,
     *               stack
     * @product      highstock
     * @optionparent plotOptions.ohlc
     */
    public static defaultOptions: HeikinAshiSeriesOptions = merge(CandlestickSeries.defaultOptions, {

    } as HeikinAshiSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<HeikinAshiPoint> = void 0 as any;

    public options: HeikinAshiSeriesOptions = void 0 as any;

    public points: Array<HeikinAshiPoint> = void 0 as any;

    public yData: Array<Array<number>> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public processData(): any {
        // call base method
        seriesProcessData.apply(this, arguments as any);

        const series = this,
            processedYData = series.processedYData;

        if (processedYData && processedYData.length) {
            const firstPoint = (processedYData[0] as any),
                firstPointOpen = firstPoint[0],
                firstPointClose = firstPoint[3],
                newOpen = (firstPointOpen + firstPointClose) / 2,
                newClose = (firstPointOpen + firstPoint[1] + firstPoint[2] + firstPointClose) / 4;

            firstPoint[0] = newOpen;
            firstPoint[3] = newClose;

            for (let i = 1; i < processedYData.length; i++) {
                const point = (processedYData[i] as any),
                    open = point[0],
                    high = point[1],
                    low = point[2],
                    close = point[3];

                const previousOpen = (processedYData[i - 1] as any)[0],
                    previousClose = (processedYData[i - 1] as any)[3],
                    newOpen = (previousOpen + previousClose) / 2,
                    newClose = (open + high + low + close) / 4,
                    newHigh = Math.max(high, newClose, newOpen),
                    newLow = Math.min(low, newClose, newOpen);

                point[0] = newOpen;
                point[1] = newHigh;
                point[2] = newLow;
                point[3] = newClose;
            }
        }
    }

    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface HeikinAshiSeries {

}
extend(HeikinAshiSeries.prototype, {

});

HeikinAshiSeries.prototype.pointClass = HeikinAshiPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        heikinashi: typeof HeikinAshiSeries;
    }
}
SeriesRegistry.registerSeriesType('heikinashi', HeikinAshiSeries);

/* *
 *
 *  Default Export
 *
 * */

export default HeikinAshiSeries;

/* *
 *
 *  API Options
 *
 * */


''; // adds doclets above to transpilat
