/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type Axis from '../../Core/Axis/Axis';
import type HeikinAshiSeriesOptions from './HeikinAshiSeriesOptions';
import type Series from '../../Core/Series/Series';

import H from '../../Core/Globals.js';
const { composed } = H;
import HeikinAshiPoint from './HeikinAshiPoint.js';
import HeikinAshiSeriesDefaults from './HeikinAshiSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    candlestick: CandlestickSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    merge,
    pushUnique
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * After processing and grouping the data, calculate how the heikeinashi data
 * set should look like.
 * @private
 */
function onAxisPostProcessData(
    this: Axis
): void {
    const series = this.series;

    series.forEach((series): void => {
        if (series.is('heikinashi')) {
            const heikinashiSeries = series as HeikinAshiSeries;
            heikinashiSeries.heikiashiData.length = 0;
            heikinashiSeries.getHeikinashiData();
        }
    });
}

/**
 * Assign heikinashi data into the points.
 * @private
 * @todo move to HeikinAshiPoint class
 */
function onHeikinAshiSeriesAfterTranslate(
    this: HeikinAshiSeries
): void {
    const series = this,
        points = series.points,
        heikiashiData = series.heikiashiData,
        cropStart = series.cropStart || 0;

    // Modify points.
    for (let i = 0; i < points.length; i++) {
        const point = points[i],
            heikiashiDataPoint = heikiashiData[i + cropStart];

        point.open = heikiashiDataPoint[0];
        point.high = heikiashiDataPoint[1];
        point.low = heikiashiDataPoint[2];
        point.close = heikiashiDataPoint[3];
    }

}

/**
 * Force to recalculate the heikinashi data set after updating data.
 * @private
 */
function onHeikinAshiSeriesUpdatedData(
    this: HeikinAshiSeries
): void {
    if (this.heikiashiData.length) {
        this.heikiashiData.length = 0;
    }
}
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

    public static defaultOptions: HeikinAshiSeriesOptions = merge(
        CandlestickSeries.defaultOptions,
        HeikinAshiSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        SeriesClass: typeof Series,
        AxisClass: typeof Axis
    ): void {
        CandlestickSeries.compose(SeriesClass);

        if (pushUnique(composed, 'HeikinAshi')) {
            addEvent(AxisClass, 'postProcessData', onAxisPostProcessData);

            addEvent(
                HeikinAshiSeries,
                'afterTranslate',
                onHeikinAshiSeriesAfterTranslate
            );
            addEvent(
                HeikinAshiSeries,
                'updatedData',
                onHeikinAshiSeriesUpdatedData
            );
        }

    }

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<HeikinAshiPoint>;

    public heikiashiData: Array<Array<number>> = [];

    public options!: HeikinAshiSeriesOptions;

    public points!: Array<HeikinAshiPoint>;

    public yData!: Array<Array<number>>;

    public processedYData!: Array<Array<(number|null)>>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Calculate data set for the heikinashi series before creating the points.
     * @private
     */
    public getHeikinashiData(): void {
        const series = this,
            table = series.allGroupedTable || series.dataTable,
            dataLength = table.rowCount,
            heikiashiData = series.heikiashiData;

        if (!heikiashiData.length && dataLength) {

            // Modify the first point.
            this.modifyFirstPointValue(
                table.getRow(0, this.pointArrayMap) as Array<number>
            );

            // Modify other points.
            for (let i = 1; i < dataLength; i++) {
                this.modifyDataPoint(
                    table.getRow(i, this.pointArrayMap) as Array<number>,
                    heikiashiData[i - 1]
                );
            }
        }
        series.heikiashiData = heikiashiData;
    }

    /**
     * @private
     */
    public init(): void {
        super.init.apply(this, arguments as any);

        this.heikiashiData = [];
    }

    /**
     * Calculate and modify the first data point value.
     * @private
     * @param {Array<(number)>} dataPoint
     *        Current data point.
     */
    public modifyFirstPointValue(dataPoint: Array<(number)>): void {
        const open = (
                dataPoint[0] +
                dataPoint[1] +
                dataPoint[2] +
                dataPoint[3]
            ) / 4,
            close = (dataPoint[0] + dataPoint[3]) / 2;

        this.heikiashiData.push([open, dataPoint[1], dataPoint[2], close]);
    }

    /**
     * Calculate and modify the data point's value.
     * @private
     * @param {Array<(number)>} dataPoint
     *        Current data point.
     * @param {Array<(number)>} previousDataPoint
     *        Previous data point.
     */
    public modifyDataPoint(
        dataPoint: Array<(number)>,
        previousDataPoint: Array<(number)>
    ): void {
        const newOpen = (previousDataPoint[0] + previousDataPoint[3]) / 2,
            newClose = (
                dataPoint[0] +
                dataPoint[1] +
                dataPoint[2] +
                dataPoint[3]
            ) / 4,
            newHigh = Math.max(dataPoint[1], newClose, newOpen),
            newLow = Math.min(dataPoint[2], newClose, newOpen);

        // Add new points to the array in order to properly calculate extremes.
        this.heikiashiData.push([newOpen, newHigh, newLow, newClose]);
    }

}

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
