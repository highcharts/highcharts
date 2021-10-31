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
    seriesTypes: { candlestick: CandlestickSeries }
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
