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

const {
    seriesTypes: {
        candlestick: CandlestickSeries
    }
} = SeriesRegistry;

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
     * @extends      plotOptions.candlestick
     * @product      highstock
     * @optionparent plotOptions.heikinashi
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

    public calculatePoints(): any {
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
        series.processedYData = processedYData;
        series.options.data = processedYData;
    }

    public generatePoints(): void {
        this.calculatePoints();

        // Run base method.
        super.generatePoints.call(this);
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

/**
 * A `heikinashi` series. If the [type](#series.heikinashi.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.heikinashi
 * @excluding dataParser, dataURL, marker
 * @product   highstock
 * @apioption series.heikinashi
 */

/**
 * An array of data points for the series. For the `heikinashi` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 7, 2, 0, 4],
 *        [1, 1, 4, 2, 8],
 *        [2, 3, 3, 9, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.heikinashi.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 9,
 *        high: 2,
 *        low: 4,
 *        close: 6,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 1,
 *        high: 4,
 *        low: 7,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.candlestick.data
 * @excluding y
 * @product   highstock
 * @apioption series.heikinashi.data
 */

''; // adds doclets above to transpilat
