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

import type CandlestickPointType from '../Candlestick/CandlestickPoint';
import type HollowCandlestickSeries from './HollowCandlestickSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const CandlestickPoint: typeof CandlestickPointType =
    SeriesRegistry.seriesTypes.candlestick.prototype.pointClass;

/* *
 *
 *  Class
 *
 * */

class HollowCandlestickPoint extends CandlestickPoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: HollowCandlestickSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Update class name if needed.
     * @private
     * @function Highcharts.seriesTypes.hollowcandlestick#getClassName
     */
    public getClassName(): string {
        let className = super.getClassName.apply(this);
        const point = this,
            index = point.index,
            currentPoint = point.series.hollowCandlestickData[index];

        if (!currentPoint.isBullish && currentPoint.trendDirection === 'up') {
            className += '-bearish-up';
        }

        return className;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default HollowCandlestickPoint;
