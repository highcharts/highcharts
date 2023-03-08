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

    public series: HollowCandlestickSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

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
