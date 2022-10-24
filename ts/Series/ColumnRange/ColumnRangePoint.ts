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
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber
} = U;

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

    public options: ColumnRangePointOptions = void 0 as any;

    public series: ColumnRangeSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public isValid(): boolean {
        return isNumber(this.low);
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface ColumnRangePoint {
    barX: typeof columnProto.barX;
    pointWidth: typeof columnProto.pointWidth;
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
