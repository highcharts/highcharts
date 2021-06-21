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


import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import HeikinAshiSeries from './HeikinAshiSeries';

const {
    seriesTypes: {
        candlestick: CandlestickSeries
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class HeikinAshiPoint extends CandlestickSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public series: HeikinAshiSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Translate the values to pixels.
     * @private
     *
     * @function Highcharts.seriesTypes.heikinashi#doTranslation
     *
     * @return {void}
     *
     */
    public doTranslation(): void {
        const point = this,
            series = point.series,
            yAxis = series.yAxis,
            translated = [
                'plotOpen',
                'plotHigh',
                'plotLow',
                'plotClose',
                'yBottom'
            ]; // translate OHLC for

        [point.open, point.high, point.low, point.close, point.low]
            .forEach(
                function (value, i): void {
                    if (value !== null) {
                        (point as any)[translated[i]] =
                            yAxis.toPixels(value, true);
                    }
                }
            );

        // Align the tooltip to the high value to avoid covering the
        // point
        (point.tooltipPos as any)[1] =
            (point.plotHigh as any) + yAxis.pos - series.chart.plotTop;
    }

    /**
     * Calculate and modify the first point value.
     * @private
     *
     * @function Highcharts.seriesTypes.heikinashi#modifyFirstPointValue
     *
     * @return {void}
     *
     */
    public modifyFirstPointValue(): void {
        const point = this,
            newClose = (point.open + point.high + point.low + point.close) / 4,
            newOpen = (point.open + point.close) / 2;

        point.open = newOpen;
        point.close = newClose;
    }

    /**
     * Calculate and modify the point value.
     * @private
     *
     * @function Highcharts.seriesTypes.heikinashi#modifyValue
     *
     * @param {HeikinAshiPoint} previousPoint
     *        Previous point.
     *
     * @return {void}
     *
     */
    public modifyValue(previousPoint: HeikinAshiPoint): void {
        const point = this,
            newOpen = (previousPoint.open + previousPoint.close) / 2,
            newClose = (point.open + point.high + point.low + point.close) / 4,
            newHigh = Math.max(point.high, newClose, newOpen),
            newLow = Math.min(point.low, newClose, newOpen);

        point.open = newOpen;
        point.close = newClose;
        point.high = newHigh;
        point.low = newLow;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace HeikinAshiPoint {
    export type PointShortOptions = [number, number, number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default HeikinAshiPoint;
