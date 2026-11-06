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

import AreaRangePoint from '../AreaRange/AreaRangePoint.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import { extend, isNumber } from '../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

const ColumnPoint = ColumnSeries.prototype.pointClass;

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
    barX: typeof ColumnPoint.prototype.barX;
    /** @internal */
    pointWidth: typeof ColumnPoint.prototype.pointWidth;
    /** @internal */
    shapeType: typeof ColumnPoint.prototype.shapeType;

}
extend(ColumnRangePoint.prototype, {
    setState: ColumnPoint.prototype.setState
});

/* *
 *
 *  Default Export
 *
 * */

export default ColumnRangePoint;
