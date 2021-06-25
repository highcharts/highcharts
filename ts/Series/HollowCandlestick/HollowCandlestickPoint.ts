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
import ColorString from '../../Core/Color/ColorString.js';
import GradientColor from '../../Core/Color/GradientColor.js';
import PatternFill from '../../Extensions/PatternFill.js';

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

    public candleFill: string | GradientColor | PatternFill.PatternObject = void 0 as any;

    public series: HollowCandlestickSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Based on the open and close values of the current and previous point,
     * calculate what color the point line/border should have.
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#getPointFill
     *
     * @param {HollowCandlestickPoint} previousPoint
     *        Previous point.
     *
     * @return {void}
     *
     */
    public getLineColor(previousPoint: HollowCandlestickPoint): string | GradientColor | PatternFill.PatternObject {
        const point = this;

        // Apply fill only for bullish candles.
        if (point.close < previousPoint.close) {
            return point.series.options.lineColor || palette.negativeColor;
        }

        return point.series.options.upLineColor || palette.positiveColor;
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
     * @return {void}
     *
     */
    public getPointFill(previousPoint: HollowCandlestickPoint): string | GradientColor | PatternFill.PatternObject {
        const point = this;

        // Apply fill only for bullish candles.
        if (point.open > point.close) {
            if (point.close < previousPoint.close) {
                return point.series.options.color || palette.negativeColor;
            }

            return point.series.options.upColor || palette.positiveColor;
        }
        return 'transparent';
    }
    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace HollowCandlestickPoint {
    export type PointShortOptions = [number, number, number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default HollowCandlestickPoint;
