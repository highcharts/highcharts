/* *
 *
 *  Highcharts variwide module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type VariwidePointOptions from './VariwidePointOptions';
import type VariwideSeries from './VariwideSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: { prototype: { pointClass: ColumnPoint } }
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointBase' {
    interface PointBase {
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
     *  Properties
     *
     * */

    public crosshairWidth!: number;
    public options!: VariwidePointOptions;
    public series!: VariwideSeries;

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
