/* *
 *
 *  (c) 2010-2024 Pawel Lysy
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

    public close!: number;

    public high!: number;

    public low!: number;

    public options!: HLCPointOptions;

    public plotClose!: number;

    public plotHigh?: number;

    public plotLow?: number;

    public series!: HLCSeries;

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
