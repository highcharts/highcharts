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

import type ColumnRangePointOptions from './ColumnRangePointOptions.js';
import type ColumnRangeSeries from './ColumnRangeSeries.js';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: {
            prototype: {
                pointClass: {
                    prototype: columnProto
                }
            }
        },
        arearange: {
            prototype: {
                pointClass: AreaRangePoint
            }
        }
    }
} = SeriesRegistry;
import { extend, isNumber } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

class ColumnRangePoint extends AreaRangePoint {

    /* *
     *
     *  Properties
     *
     * */

    public options!: ColumnRangePointOptions;

    /** @internal */
    public series!: ColumnRangeSeries;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public isValid(): boolean {
        return isNumber(this.low);
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface ColumnRangePoint {
    /** @internal */
    barX: typeof columnProto.barX;
    /** @internal */
    pointWidth: typeof columnProto.pointWidth;
    /** @internal */
    shapeType: typeof columnProto.shapeType;

}
extend(ColumnRangePoint.prototype, {
    setState: columnProto.setState
});

/* *
 *
 *  Default Export
 *
 * */

export default ColumnRangePoint;
