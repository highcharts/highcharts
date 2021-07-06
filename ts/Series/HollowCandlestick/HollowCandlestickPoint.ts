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
import HollowCandlestickSeries from './HollowCandlestickSeries.js';
import palette from '../../Core/Color/Palette.js';
import type ColorType from '../../Core/Color/ColorType';

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
class HollowCandlestickPoint extends CandlestickSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public candleFill: ColorType = void 0 as any;

    public series: HollowCandlestickSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public getClassName(): string {
        let className = super.getClassName.apply(this);
        const point = this,
            previousPoint = point.series.data[point.index - 1];

        if (previousPoint && point.graphic && point.close > previousPoint.close && point.candleFill !== 'transparent') {
            className += '-bearish-up';
        }

        return className;
    }

    /**
     * Basing on the open and close values of the current and previous point,
     * determine what color the point should have.
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#getPointFill
     *
     * @param {HollowCandlestickPoint} previousPoint
     *        Previous point.
     *
     * @return {ColorType}
     *
     */
    public getLineColor(previousPoint: HollowCandlestickPoint): ColorType {
        const point = this;

        return point.close < previousPoint.close ?
            point.series.options.lineColor || palette.negativeColor :
            point.series.options.upLineColor || palette.positiveColor;
    }

    /**
     * Based on the open and close values of the current and previous point,
     * calculate what fill the point should have.
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#getPointFill
     *
     * @param {HollowCandlestickPoint} previousPoint
     *        Previous point.
     *
     * @return {ColorType}
     *
     */
    public getPointFill(previousPoint: HollowCandlestickPoint): ColorType {
        const point = this;

        // Return fill color only for bearish candles.
        if (point.open < point.close) {
            return 'transparent';
        }
        return point.close < previousPoint.close ?
            point.series.options.color || palette.negativeColor :
            point.series.options.upColor || palette.positiveColor;
    }
    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Class Namespace
 *
 * */


/* *
 *
 *  Default Export
 *
 * */

export default HollowCandlestickPoint;
