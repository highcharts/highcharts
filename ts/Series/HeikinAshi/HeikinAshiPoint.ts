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

import type HeikinAshiSeries from './HeikinAshiSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    candlestick: {
        prototype: {
            pointClass: CandlestickPoint
        }
    },
    hlc: {
        prototype: {
            pointClass: HLCPoint
        }
    }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class HeikinAshiPoint extends CandlestickPoint {
    // clone inheritence
    public resolveColor = HLCPoint.prototype.resolveColor;
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
