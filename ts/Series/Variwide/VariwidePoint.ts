/* *
 *
 *  Highcharts variwide module
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
 * Imports
 *
 * */

import type ColumnPointType from '../Column/ColumnPoint';
import type VariwidePointOptions from './VariwidePointOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const ColumnPoint: typeof ColumnPointType =
    SeriesRegistry.seriesTypes.column.prototype.pointClass;
import VariwideSeries from './VariwideSeries.js';
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        crosshairWidth?: VariwidePoint['crosshairWidth'];
    }
}

/* *
 *
 *  Class
 *
 * */

class VariwidePoint extends ColumnPoint {

    /* *
     *
     *  Properites
     *
     * */

    public crosshairWidth: number = void 0 as any;
    public options: VariwidePointOptions = void 0 as any;
    public series: VariwideSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public isValid(): boolean {
        return isNumber(this.y) && isNumber(this.z);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default VariwidePoint;
