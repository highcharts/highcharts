/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type HeikinAshiSeries from './HeikinAshiSeries';

import CandlestickSeries from '../Candlestick/CandlestickSeries.js';
const {
    prototype: {
        pointClass: CandlestickPoint
    }
} = CandlestickSeries;

/* *
 *
 *  Class
 *
 * */

class HeikinAshiPoint extends CandlestickPoint {
}

/* *
 *
 *  Class Prototype
 *
 * */

interface HeikinAshiPoint {
    series: HeikinAshiSeries;
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
