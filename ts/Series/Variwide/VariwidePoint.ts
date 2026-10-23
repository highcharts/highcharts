/* *
 *
 *  Highcharts variwide module
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

import type VariwidePointOptions from './VariwidePointOptions';
import type VariwideSeries from './VariwideSeries';

import ColumnSeries from '../Column/ColumnSeries.js';
import { isNumber } from '../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

const ColumnPoint = ColumnSeries.prototype.pointClass;

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

    /** @internal */
    public crosshairWidth!: number;
    public options!: VariwidePointOptions;
    /** @internal */
    public series!: VariwideSeries;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
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
