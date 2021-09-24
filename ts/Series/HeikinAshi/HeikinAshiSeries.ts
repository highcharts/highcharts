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
import Axis from '../../Core/Axis/Axis.js';

const {
    seriesTypes: {
        candlestick: CandlestickSeries
    }
} = SeriesRegistry;

const {
    addEvent,
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
     * @requires  modules/heikinashi
     * @optionparent plotOptions.heikinashi
     */
    public static defaultOptions: HeikinAshiSeriesOptions = merge(
        CandlestickSeries.defaultOptions,
        {
            dataGrouping: {
                groupAll: true
            }
        } as HeikinAshiSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<HeikinAshiPoint> = void 0 as any;

    public heikiashiData: Array<Array<number>> = [];

    public options: HeikinAshiSeriesOptions = void 0 as any;

    public points: Array<HeikinAshiPoint> = void 0 as any;

    public yData: Array<Array<number>> = void 0 as any;

    public processedYData: Array<Array<(number|null)>> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Calculate data set for the heikinashi series before creating the points.
     * @private
     *
     * @function Highcharts.seriesTypes.heikinashi#getHeikinashiData
     *
     * @return {void}
     *
     */
    public getHeikinashiData(): void {
        const series = this,
            processedYData = series.allGroupedData || series.yData,
            heikiashiData = series.heikiashiData;

        if (!heikiashiData.length && processedYData && processedYData.length) {
            // Cast to `any` in order to avoid checks before calculation.
            // Adding null doesn't change anything.
            const firstPoint: any = processedYData[0];

            // Modify the first point.
            this.modifyFirstPointValue(firstPoint);

            // Modify other points.
            for (let i = 1; i < processedYData.length; i++) {
                const dataPoint: any = processedYData[i],
                    previousDataPoint: any = heikiashiData[i - 1];

                this.modifyDataPoint(dataPoint, previousDataPoint);
            }
        }
        series.heikiashiData = heikiashiData;
    }

    /**
     * @private
     * @function Highcarts.seriesTypes.heikinashi#init
     * @return {void}
     */
    public init(): void {
        super.init.apply(this, arguments as any);

        this.heikiashiData = [];
    }

    /**
     * Calculate and modify the first data point value.
     * @private
     *
     * @function Highcharts.seriesTypes.heikinashi#modifyFirstPointValue
     *
     * @param {Array<(number)>} dataPoint
     *        Current data point.
     *
     * @return {void}
     *
     */
    public modifyFirstPointValue(dataPoint: Array<(number)>): void {
        const open = (dataPoint[0] + dataPoint[1] + dataPoint[2] + dataPoint[3]) / 4,
            close = (dataPoint[0] + dataPoint[3]) / 2;

        this.heikiashiData.push([open, dataPoint[1], dataPoint[2], close]);
    }

    /**
     * Calculate and modify the data point's value.
     * @private
     *
     * @function Highcharts.seriesTypes.heikinashi#modifyDataPoint
     *
     * @param {Array<(number)>} dataPoint
     *        Current data point.
     *
     * @param {Array<(number)>} previousDataPoint
     *        Previous data point.
     *
     * @return {void}
     *
     */
    public modifyDataPoint(
        dataPoint: Array<(number)>,
        previousDataPoint: Array<(number)>
    ): void {
        const newOpen = (previousDataPoint[0] + previousDataPoint[3]) / 2,
            newClose = (dataPoint[0] + dataPoint[1] + dataPoint[2] + dataPoint[3]) / 4,
            newHigh = Math.max(dataPoint[1], newClose, newOpen),
            newLow = Math.min(dataPoint[2], newClose, newOpen);

        // Add new points to the array in order to properly calculate extremes.
        this.heikiashiData.push([newOpen, newHigh, newLow, newClose]);
    }

    /* eslint-enable valid-jsdoc */
}

// Assign haikinashi data into the points.
addEvent(HeikinAshiSeries, 'afterTranslate', function (): void {
    const series = this,
        points = series.points,
        heikiashiData = series.heikiashiData;
    let cropStart = series.cropStart || 0;

    // Reset the proccesed data.
    series.processedYData.length = 0;

    // Modify points.
    for (let i = 0; i < points.length; i++) {
        const point = points[i],
            heikiashiDataPoint = heikiashiData[i + cropStart];

        point.open = heikiashiDataPoint[0];
        point.high = heikiashiDataPoint[1];
        point.low = heikiashiDataPoint[2];
        point.close = heikiashiDataPoint[3];

        series.processedYData.push([point.open, point.high, point.low, point.close]);
    }
});

// Force to recalculate the heikinashi data set after updating data.
addEvent(HeikinAshiSeries, 'updatedData', function (): void {
    if (this.heikiashiData.length) {
        this.heikiashiData.length = 0;
    }
});

// After processing and grouping the data,
// calculate how the heikeinashi data set should look like.
addEvent(Axis, 'postProcessData', function (): void {
    const series = this.series;

    series.forEach(function (series): void {
        if (series.is('heikinashi')) {
            const heikinashiSeries = series as HeikinAshiSeries;
            heikinashiSeries.heikiashiData.length = 0;
            heikinashiSeries.getHeikinashiData();
        }
    });
});

/* *
 *
 *  Class Prototype
 *
 * */

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
 * @requires  modules/heikinashi
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
