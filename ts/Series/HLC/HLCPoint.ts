/* *
 *
 *  (c) 2010-2021 Pawel Lysy
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
    column: {
        prototype: {
            pointClass: ColumnPoint
        }
    }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class HLCPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    public close: number = void 0 as any;

    public high: number = void 0 as any;

    public low: number = void 0 as any;

    public options: HLCPointOptions = void 0 as any;

    public plotClose: number = void 0 as any;

    public plotHigh?: number;

    public plotLow?: number;

    public series: HLCSeries = void 0 as any;

    public yBottom?: number;

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace HLCPoint {
    export type PointShortOptions = Array<number>;
}
/* *
 *
 *  Default Export
 *
 * */

export default HLCPoint;
