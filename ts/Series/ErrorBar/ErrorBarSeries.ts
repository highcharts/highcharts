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

import type ErrorBarPoint from './ErrorBarPoint';
import type ErrorBarSeriesOptions from './ErrorBarSeriesOptions';
import type ColumnMetricsObject from '../Column/ColumnMetricsObject';

import BoxPlotSeries from '../BoxPlot/BoxPlotSeries.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import ErrorBarSeriesDefaults from './ErrorBarSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    arearange: AreaRangeSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    merge,
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Errorbar series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.errorbar
 *
 * @augments Highcharts.Series
 */
class ErrorBarSeries extends BoxPlotSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: ErrorBarSeriesOptions = merge(
        BoxPlotSeries.defaultOptions,
        ErrorBarSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<ErrorBarPoint> = void 0 as any;
    public options: ErrorBarSeriesOptions = void 0 as any;
    public points: Array<ErrorBarPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getColumnMetrics(): ColumnMetricsObject {
        const series = this;

        // Get the width and X offset, either on top of the linked series
        // column or standalone
        return (
            (series.linkedParent && series.linkedParent.columnMetrics) ||
            ColumnSeries.prototype.getColumnMetrics.call(series)
        );
    }

    public drawDataLabels(): void {
        const series = this,
            valKey = series.pointValKey;

        if (AreaRangeSeries) {
            AreaRangeSeries.prototype.drawDataLabels.call(series);
            // Arearange drawDataLabels does not reset point.y to high,
            // but to low after drawing (#4133)
            for (const point of series.points) {
                point.y = (point as any)[valKey];
            }
        }
    }

    public toYData(point: ErrorBarPoint): Array<number> {
        // return a plain array for speedy calculation
        return [point.low, point.high];
    }

}

addEvent(ErrorBarSeries, 'afterTranslate', function (): void {
    for (const point of this.points) {
        point.plotLow = point.plotY;
    }
}, { order: 0 });

/* *
 *
 *  Class Prototype
 *
 * */

interface ErrorBarSeries extends BoxPlotSeries {
    pointClass: typeof ErrorBarPoint;
    doQuartiles: boolean;
    linkedParent: ErrorBarSeries;
    pointArrayMap: Array<string>;
    pointValKey: string;
}

extend(ErrorBarSeries.prototype, {
    // pointClass: ErrorBarPoint, // just a declaration
    pointArrayMap: ['low', 'high'], // array point configs are mapped to this
    pointValKey: 'high', // defines the top of the tracker
    doQuartiles: false
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        errorbar: typeof ErrorBarSeries;
    }
}

SeriesRegistry.registerSeriesType('errorbar', ErrorBarSeries);

/* *
 *
 *  Default Export
 *
 * */

export default ErrorBarSeries;
