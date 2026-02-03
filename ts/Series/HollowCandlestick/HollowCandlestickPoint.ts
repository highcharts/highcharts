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

    public series!: HollowCandlestickSeries;

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
