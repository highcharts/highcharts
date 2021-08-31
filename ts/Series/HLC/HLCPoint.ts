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

import type HLCPointOptions from './HLCPointOptions';
import type HLCSeries from './HLCSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        ohlc: OHLCSeries
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class HLCPoint extends OHLCSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public options: HLCPointOptions = void 0 as any;

    public series: HLCSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */


    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace HLCPoint {
    export type PointShortOptions = [number, number, number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default HLCPoint;
