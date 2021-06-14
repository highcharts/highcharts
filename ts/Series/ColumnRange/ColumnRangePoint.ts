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
import type BBoxObject from '../../Core/Renderer/BBoxObject.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: {
            prototype: {
                pointClass: ColumnPoint
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
    public series: ColumnRangeSeries = void 0 as any;
    public options: ColumnRangePointOptions = void 0 as any;
    public barX: typeof ColumnPoint.prototype['barX'] = void 0 as any;
    public pointWidth: typeof ColumnPoint.prototype['pointWidth'] = void 0 as any;
    public shapeType: typeof ColumnPoint.prototype['shapeType'] = void 0 as any;

    public isValid(): boolean {
        return isNumber(this.low);
    }
}

/* *
 *
 *  Prototype properties
 *
 * */

extend(ColumnRangePoint.prototype, {
    setState: ColumnPoint.prototype.setState
});

/* *
 *
 *  Default export
 *
 * */
export default ColumnRangePoint;
