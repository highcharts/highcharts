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

import type CandelstickPointType from '../Candlestick/CandlestickPoint';
import type HeikinAshiSeries from './HeikinAshiSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const CandlestickPoint: typeof CandelstickPointType =
    SeriesRegistry.seriesTypes.candlestick.prototype.pointClass;

/* *
 *
 *  Class
 *
 * */

class HeikinAshiPoint extends CandlestickPoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: HeikinAshiSeries = void 0 as any;

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
